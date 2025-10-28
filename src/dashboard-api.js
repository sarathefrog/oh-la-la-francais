const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Get all dashboard data
app.get('/api/dashboard', async (req, res) => {
  try {
    // Get all students
    const students = await prisma.student.findMany({
      include: {
        classes: {
          orderBy: { date: 'asc' }
        },
        homework: {
          orderBy: { createdAt: 'desc' }
        },
        questions: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get statistics
    const totalStudents = await prisma.student.count();
    const approvedStudents = await prisma.student.count({
      where: { registrationStatus: 'approved' }
    });
    const pendingStudents = await prisma.student.count({
      where: { registrationStatus: 'pending' }
    });
    const existingPendingStudents = await prisma.student.count({
      where: { registrationStatus: 'existing_pending' }
    });

    // Get upcoming classes
    const upcomingClasses = await prisma.class.findMany({
      where: {
        status: 'scheduled',
        date: { gte: new Date() }
      },
      include: { student: true },
      orderBy: { date: 'asc' },
      take: 20
    });

    // Get recent activity
    const recentHomework = await prisma.homework.findMany({
      include: { student: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    const recentQuestions = await prisma.question.findMany({
      include: { student: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    res.json({
      students,
      statistics: {
        totalStudents,
        approvedStudents,
        pendingStudents,
        existingPendingStudents
      },
      upcomingClasses,
      recentHomework,
      recentQuestions
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Update student
app.put('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const student = await prisma.student.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json(student);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// Approve student
app.post('/api/students/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { sessionsLeft, sessionsPerWeek, selectedDays, classTimes, paymentStatus } = req.body;

    // Update student
    const student = await prisma.student.update({
      where: { id: parseInt(id) },
      data: {
        registrationStatus: 'approved',
        sessionsLeft,
        sessionsPerWeek: sessionsPerWeek.toString(),
        selectedDays: selectedDays.join(','),
        selectedTimes: classTimes.map(ct => `${ct.day}:${ct.time}`).join(','),
        classSchedule: JSON.stringify(classTimes),
        paymentStatus
      }
    });

    // Generate class schedule
    await generateClassSchedule(parseInt(id), classTimes);

    res.json(student);
  } catch (error) {
    console.error('Error approving student:', error);
    res.status(500).json({ error: 'Failed to approve student' });
  }
});

// Reject student
app.post('/api/students/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;

    const student = await prisma.student.update({
      where: { id: parseInt(id) },
      data: { registrationStatus: 'rejected' }
    });

    res.json(student);
  } catch (error) {
    console.error('Error rejecting student:', error);
    res.status(500).json({ error: 'Failed to reject student' });
  }
});

// Answer question
app.post('/api/questions/:id/answer', async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;

    const question = await prisma.question.update({
      where: { id: parseInt(id) },
      data: {
        response,
        status: 'answered',
        answeredAt: new Date()
      }
    });

    res.json(question);
  } catch (error) {
    console.error('Error answering question:', error);
    res.status(500).json({ error: 'Failed to answer question' });
  }
});

// Update class
app.put('/api/classes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const classRecord = await prisma.class.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json(classRecord);
  } catch (error) {
    console.error('Error updating class:', error);
    res.status(500).json({ error: 'Failed to update class' });
  }
});

// Generate class schedule function
async function generateClassSchedule(studentId, classTimes, startDate = new Date()) {
  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });
    
    if (!student || !classTimes || classTimes.length === 0) {
      return;
    }
    
    // Clear existing classes for this student
    await prisma.class.deleteMany({
      where: { studentId: studentId }
    });
    
    // Generate classes based on student's sessions left
    const classes = [];
    const currentDate = new Date(startDate);
    const totalSessions = student.sessionsLeft;
    let sessionCount = 0;
    
    for (let week = 0; week < 20 && sessionCount < totalSessions; week++) {
      for (const classTime of classTimes) {
        const classDate = new Date(currentDate);
        
        // Find the next occurrence of this day
        const dayNames = ['یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنج شنبه', 'جمعه', 'شنبه'];
        const targetDayIndex = dayNames.indexOf(classTime.day);
        
        if (targetDayIndex !== -1) {
          // Calculate days to add to reach the target day
          const currentDayIndex = classDate.getDay();
          let daysToAdd = targetDayIndex - currentDayIndex;
          
          if (daysToAdd < 0) {
            daysToAdd += 7;
          }
          
          classDate.setDate(classDate.getDate() + daysToAdd + (week * 7));
          
          // Set the time
          const [hours, minutes] = classTime.time.split(':').map(Number);
          classDate.setHours(hours, minutes, 0, 0);
          
          classes.push({
            studentId: studentId,
            day: classTime.day,
            time: classTime.time,
            date: classDate,
            status: 'scheduled'
          });
          
          sessionCount++;
          if (sessionCount >= totalSessions) {
            break;
          }
        }
      }
      
      if (sessionCount >= totalSessions) {
        break;
      }
    }
    
    // Create all classes
    if (classes.length > 0) {
      await prisma.class.createMany({
        data: classes
      });
    }
    
    console.log(`Generated ${classes.length} classes for student ${studentId}`);
  } catch (error) {
    console.error('Error generating class schedule:', error);
  }
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`📊 Dashboard API running on port ${PORT}`);
});

