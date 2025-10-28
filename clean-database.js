const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function cleanDatabase() {
  console.log('🧹 Database Cleanup Tool\n');
  console.log('Choose an option:');
  console.log('1. Complete reset (delete all data)');
  console.log('2. Reset specific tables');
  console.log('3. Delete test data only');
  console.log('4. Reset database file (complete wipe)');
  console.log('5. Show current data counts');
  
  // For this script, we'll implement the most common options
  // You can modify this based on your needs
  
  try {
    // Option 1: Complete reset
    console.log('\n🔄 Performing complete database reset...');
    
    // Delete in correct order to respect foreign key constraints
    await prisma.homework.deleteMany();
    console.log('✅ Deleted all homework records');
    
    await prisma.booking.deleteMany();
    console.log('✅ Deleted all booking records');
    
    await prisma.payment.deleteMany();
    console.log('✅ Deleted all payment records');
    
    await prisma.notification.deleteMany();
    console.log('✅ Deleted all notification records');
    
    await prisma.availability.deleteMany();
    console.log('✅ Deleted all availability records');
    
    await prisma.student.deleteMany();
    console.log('✅ Deleted all student records');
    
    await prisma.teacher.deleteMany();
    console.log('✅ Deleted all teacher records');
    
    console.log('\n🎉 Database completely cleaned!');
    
    // Show final counts
    const counts = await getDataCounts();
    console.log('\n📊 Final data counts:', counts);
    
  } catch (error) {
    console.error('❌ Error cleaning database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function getDataCounts() {
  try {
    const counts = {
      students: await prisma.student.count(),
      teachers: await prisma.teacher.count(),
      homework: await prisma.homework.count(),
      bookings: await prisma.booking.count(),
      payments: await prisma.payment.count(),
      notifications: await prisma.notification.count(),
      availability: await prisma.availability.count()
    };
    return counts;
  } catch (error) {
    console.error('Error getting counts:', error);
    return {};
  }
}

async function showCurrentData() {
  console.log('\n📊 Current database contents:');
  const counts = await getDataCounts();
  
  Object.entries(counts).forEach(([table, count]) => {
    console.log(`   ${table}: ${count} records`);
  });
  
  // Show some sample data
  console.log('\n📋 Sample data:');
  
  const students = await prisma.student.findMany({ take: 3 });
  if (students.length > 0) {
    console.log('\n👥 Students:');
    students.forEach(student => {
      console.log(`   - ${student.name} (ID: ${student.id}, Telegram: ${student.telegramId})`);
    });
  }
  
  const teachers = await prisma.teacher.findMany({ take: 3 });
  if (teachers.length > 0) {
    console.log('\n👨‍🏫 Teachers:');
    teachers.forEach(teacher => {
      console.log(`   - ${teacher.name} (ID: ${teacher.id}, Telegram: ${teacher.telegramId})`);
    });
  }
  
  const homework = await prisma.homework.findMany({ take: 3 });
  if (homework.length > 0) {
    console.log('\n📝 Homework:');
    homework.forEach(hw => {
      console.log(`   - ${hw.title || 'No title'} (ID: ${hw.id}, Status: ${hw.status})`);
    });
  }
}

async function resetDatabaseFile() {
  const dbPath = path.join(__dirname, 'prisma', 'dev.db');
  
  try {
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
      console.log('✅ Database file deleted');
      
      // Recreate database with schema
      console.log('🔄 Recreating database...');
      const { execSync } = require('child_process');
      execSync('npx prisma db push', { stdio: 'inherit' });
      console.log('✅ Database recreated successfully');
    } else {
      console.log('❌ Database file not found');
    }
  } catch (error) {
    console.error('❌ Error resetting database file:', error);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'reset':
      await cleanDatabase();
      break;
    case 'show':
      await showCurrentData();
      await prisma.$disconnect();
      break;
    case 'file-reset':
      await resetDatabaseFile();
      break;
    case 'counts':
      const counts = await getDataCounts();
      console.log('📊 Data counts:', counts);
      await prisma.$disconnect();
      break;
    default:
      console.log('Usage:');
      console.log('  node clean-database.js reset     - Complete database reset');
      console.log('  node clean-database.js show      - Show current data');
      console.log('  node clean-database.js file-reset - Reset database file');
      console.log('  node clean-database.js counts    - Show data counts only');
      break;
  }
}

main();
