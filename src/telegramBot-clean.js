const TelegramBot = require('node-telegram-bot-api');
const { PrismaClient } = require('@prisma/client');
const express = require('express');
const path = require('path');
require('dotenv').config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const prisma = new PrismaClient();

// Express app for dashboard
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Store user states
const userStates = new Map();

// Persian texts
const TEXTS = {
  // Student menu
  studentWelcome: `🇫🇷 خوش آمدید به کلاس‌های فرانسوی زهرا!`,
  studentMenu: `🏠 منوی دانشجو`,
  
  // New user menu
  newUserWelcome: `🎉 خوش آمدید! شما دانشجوی جدید هستید.`,
  newUserMenu: `🏠 منوی کاربر جدید`,
  
  // Teacher menu
  teacherWelcome: `👩‍🏫 خوش آمدید زهرا! منوی مدیریت کلاس‌ها`,
  teacherMenu: `🏠 منوی معلم`,
  
  // Common
  backToMain: `🔙 بازگشت به منوی اصلی`,
  
  // Registration
  phoneRequest: `📱 برای ادامه، لطفاً شماره تلفن خود را به اشتراک بگذارید:`,
  phoneReceived: `✅ شماره تلفن شما دریافت شد!`,
  requestName: `👤 لطفاً نام و نام خانوادگی خود را وارد کنید:`,
  requestClassType: `📚 نوع کلاس خود را انتخاب کنید:`,
  requestSessions: `📘 چند جلسه باقی‌مانده دارید؟`,
  
  // Homework
  homeworkTitle: `📝 لطفاً عنوان تکلیف را وارد کنید (یا "رد کردن" برای ادامه بدون عنوان):`,
  homeworkDescription: `📝 لطفاً توضیحات تکلیف را وارد کنید:`,
  homeworkComplete: `✅ تکلیف شما ثبت شد! معلم شما به زودی آن را بررسی خواهد کرد.`,
  
  // Trial class
  trialTimeSelection: `🎯 زمان مورد نظر برای کلاس آزمایشی را انتخاب کنید:`,
  trialNameRequest: `لطفاً نام و نام خانوادگی خود را وارد کنید:`,
  trialBooked: `✅ کلاس آزمایشی شما رزرو شد! زهرا به زودی با شما تماس خواهد گرفت.`,
  
  // Questions
  questionRequest: `❓ سوال خود را بنویسید و ارسال کنید:`,
  questionSent: `✅ سوال شما ارسال شد! زهرا به زودی پاسخ خواهد داد.`,
  teacherQuestionReceived: `❓ سوال جدید دریافت شد!`,
  teacherResponseSent: `✅ پاسخ شما ارسال شد!`,
  
  // Information texts
  conditions: `📋 شرایط کلاس‌های فرانسوی:

💰 قیمت‌ها:
• کلاس خصوصی: ۷۰۰,۰۰۰ تومان برای هر جلسه (۶۰ دقیقه)
• کلاس نیمه‌خصوصی (۲ تا ۳ نفره): ۳۵۰,۰۰۰ تومان برای هر نفر در هر جلسه
• کلاس آزمایشی: رایگان (پرداخت تنها در صورت ادامه دوره)

💳 روش‌های پرداخت:
• کارت به کارت (ریالی)
• پرداخت ارزی (یورو یا دلار)
• پرداخت با ارز دیجیتال (هزینه کارمزد بر عهده زبان‌آموز)

📅 زمان‌بندی:
• هر ترم شامل ۱۰ جلسه
• مدت هر جلسه: ۶۰ دقیقه
• برگزاری در پلتفرم Google Meet به صورت آنلاین
• زمان‌بندی بر اساس هماهنگی با زبان‌آموز

📝 قوانین:
• جلسه اول آزمایشی و بدون پیش‌پرداخت است
• هزینه جلسه آزمایشی فقط در صورت ادامه دوره دریافت می‌شود
• ارتقا سطح زبان‌آموز همراه با به‌روزرسانی شهریه خواهد بود
•`,

  teachingMethod: `📚 روش تدریس:
  
• آموزش آنلاین و تعاملی از طریق Google Meet
• تمرکز بر مهارت‌های گفتاری و شنیداری
• بهره‌گیری از منابع کمکی و وبسایت‌های آموزشی معتبر

🎯 سطوح آموزشی:
• مبتدی (A1-A2)
• متوسط (B1-B2)
• پیشرفته (C1-C2)

📖 منابع آموزشی:
• کتاب‌های Vite et Bien، Grammaire en Dialogue، Café Crème
• منابع کمکی معتبر
• فایل‌های صوتی و تصویری آموزشی
• مطالب فرهنگی و اجتماعی مرتبط با زبان فرانسه

✅ مزایا:
• جلسه اول به صورت آزمایشی و بدون پیش‌پرداخت
• امکان برگزاری کلاس خصوصی و نیمه‌خصوصی (۲ تا ۳ نفره)
• برنامه‌ریزی بر اساس نیاز و سطح زبان‌آموز
• امکان پرداخت ارزی (یورو، دلار) یا ارز دیجیتال برای زبان‌آموزان خارج از ایران
`,

  teacherInfo: `👩‍🏫 آشنایی با زهرا:

🎓 تحصیلات:
• کارشناسی مترجمی زبان فرانسه از دانشگاه علامه طباطبایی
• کارشناسی ارشد مطالعات فرانسه از دانشگاه تهران
• ۹ سال تجربه زندگی و یادگیری زبان در سوئیس

🌟 تخصص‌ها:
• تدریس زبان فرانسه به صورت خصوصی و نیمه‌خصوصی
• آموزش آنلاین از سال ۱۳۹۹
• آمادگی برای ارتقا سطح زبان‌آموزان
• استفاده از متدهای آموزشی معتبر

📞 تماس:
• تلگرام: @zahra_french


💬 پیام از زهرا:
"سلام به زبان‌آموزان عزیز! من زهرا دانشیار هستم و از سال‌ها تجربه‌ی زندگی و یادگیری در سوئیس و تحصیل در ایران بهره گرفته‌ام تا مسیر یادگیری زبان فرانسه را برای شما هموارتر کنم. هدفم این است که شما را به سطح بالاتری برسانم و یادگیری را برایتان لذت‌بخش سازم."

📞 تماس مستقیم:
اگر سوال فوری دارید، می‌توانید مستقیماً با زهرا تماس بگیرید:
🆔 تلگرام: 1955330844`
};

// Keyboards
const studentMenuKeyboard = {
  reply_markup: {
    keyboard: [
      [{ text: '📘 تعداد جلسات باقی‌مانده' }, { text: '📝 مشق هام رو نوشتم و میخوام چک بشه' }],
      [{ text: '📅 مشاهده تاریخ و ساعت کلاس‌ها' }, { text: '❌ کنسل کردن جلسه' }],
      [{ text: '📚 دریافت کتاب' }, { text: '🔗 لینک کلاس' }]
    ],
    resize_keyboard: true,
    one_time_keyboard: false
  }
};

const newUserMenuKeyboard = {
  reply_markup: {
    keyboard: [
      [{ text: '📝 ثبت‌نام' }, { text: '🎯 رزرو کلاس آزمایشی' }],
      [{ text: '👨‍🎓 از قبل دانشآموز زهرا هستم' }],
      [{ text: '📋 مشاهده شرایط' }, { text: '🎓 شیوه تدریس چجوریه؟' }],
      [{ text: '👩‍🏫 آشنایی با معلم (زهرا)' }, { text: '❓ سوال دارم' }]
    ],
    resize_keyboard: true,
    one_time_keyboard: false
  }
};

const teacherMenuKeyboard = {
  reply_markup: {
    keyboard: [
      [{ text: '👥 مشاهده دانش‌آموزان' }, { text: '📊 پنل مدیریت' }],
      [{ text: '➕ اضافه کردن دانشجو' }],
      [{ text: '💬 پاسخ به سوالات' }],
      [{ text: '✅ تأیید ثبت‌نام‌ها' }, { text: '🆓 بررسی کلاس‌های آزمایشی' }],
      [{ text: '👨‍🎓 بررسی دانش‌آموزان موجود' }],
      [{ text: '❌ کنسل کردن کلاس' }]
    ],
    resize_keyboard: true,
    one_time_keyboard: false
  }
};

const phoneRequestKeyboard = {
  reply_markup: {
    keyboard: [
      [{ text: '📱 ارسال شماره تلفن', request_contact: true }],
      [{ text: '🔙 بازگشت به منوی اصلی' }]
    ],
    resize_keyboard: true,
    one_time_keyboard: true
  }
};

const learningReasonKeyboard = {
  reply_markup: {
    keyboard: [
      [{ text: '📝 امتحان TEF' }, { text: '📝 امتحان DELF' }],
      [{ text: '🏠 زندگی و کار در کشور فرانسه زبان' }, { text: '🎓 دوره ی زبان کشور فرانسه' }],
      [{ text: '❤️ علاقه شخصی' }, { text: '📝 Other' }],
      [{ text: '🔙 بازگشت به منوی اصلی' }]
    ],
    resize_keyboard: true,
    one_time_keyboard: true
  }
};

const experienceKeyboard = {
  reply_markup: {
    keyboard: [
      [{ text: '❌ ندارم' }, { text: '✅ دارم' }],
      [{ text: '🔙 بازگشت به منوی اصلی' }]
    ],
    resize_keyboard: true,
    one_time_keyboard: true
  }
};

const levelKeyboard = {
  reply_markup: {
    keyboard: [
      [{ text: '🟢 A1 (مبتدی)' }, { text: '🟡 A2 (مبتدی پیشرفته)' }],
      [{ text: '🟠 B1 (متوسط)' }, { text: '🔴 B2 (متوسط پیشرفته)' }],
      [{ text: '🔙 بازگشت به منوی اصلی' }]
    ],
    resize_keyboard: true,
    one_time_keyboard: true
  }
};

const sessionsPerWeekKeyboard = {
  reply_markup: {
    keyboard: [
      [{ text: '1️⃣ یک جلسه' }, { text: '2️⃣ دو جلسه' }],
      [{ text: '3️⃣ سه جلسه' }, { text: '📝 Other' }],
      [{ text: '🔙 بازگشت به منوی اصلی' }]
    ],
    resize_keyboard: true,
    one_time_keyboard: true
  }
};

const weekdaysKeyboard = {
  reply_markup: {
    keyboard: [
      [{ text: 'شنبه' }, { text: 'یکشنبه' }, { text: 'دوشنبه' }],
      [{ text: 'سه شنبه' }, { text: 'چهارشنبه' }, { text: 'پنج شنبه' }],
      [{ text: '🤷‍♀️ فرقی برام نداره' }],
      [{ text: '✅ تأیید انتخاب روزها' }],
      [{ text: '🔙 بازگشت به منوی اصلی' }]
    ],
    resize_keyboard: true,
    one_time_keyboard: false
  }
};

const teacherWeekdaysKeyboard = {
  reply_markup: {
    keyboard: [
      [{ text: 'شنبه' }, { text: 'یکشنبه' }, { text: 'دوشنبه' }],
      [{ text: 'سه شنبه' }, { text: 'چهارشنبه' }, { text: 'پنج شنبه' }],
      [{ text: '✅ تأیید انتخاب روزها' }],
      [{ text: '🔙 بازگشت به منوی اصلی' }]
    ],
    resize_keyboard: true,
    one_time_keyboard: false
  }
};

const timeSlotsKeyboard = {
  reply_markup: {
    keyboard: [
      [{ text: '🌅 صبح 9 تا 12' }, { text: '☀️ ظهر 12 تا 3' }],
      [{ text: '🌆 بعد از ظهر 3 تا 6' }, { text: '🌙 شب 6 تا 9' }],
      [{ text: '🤷‍♀️ فرقی برام نداره' }],
      [{ text: '✅ تأیید انتخاب ساعات' }],
      [{ text: '🔙 بازگشت به منوی اصلی' }]
    ],
    resize_keyboard: true,
    one_time_keyboard: false
  }
};

const classTypeKeyboard = {
  reply_markup: {
    keyboard: [
      [{ text: '🔒 خصوصی' }, { text: '👥 گروهی' }],
      [{ text: '🔙 بازگشت به منوی اصلی' }]
    ],
    resize_keyboard: true,
    one_time_keyboard: true
  }
};


const backKeyboard = {
  reply_markup: {
    keyboard: [[{ text: '🔙 بازگشت به منوی اصلی' }]],
    resize_keyboard: true,
    one_time_keyboard: true
  }
};

const additionalInfoKeyboard = {
  reply_markup: {
    keyboard: [
      [{ text: '⏭️ رد کردن' }],
      [{ text: '🔙 بازگشت به منوی اصلی' }]
    ],
    resize_keyboard: true,
    one_time_keyboard: true
  }
};

const skipInlineKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [{ text: 'تمایلی به گفتنش ندارم', callback_data: 'skip_field' }]
    ]
  }
};

const attendanceKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [{ text: '✅ می‌آیم', callback_data: 'attending' }],
      [{ text: '❌ نمی‌آیم', callback_data: 'not_attending' }]
    ]
  }
};

const testClassResponseKeyboard = {
  reply_markup: {
    keyboard: [
      [{ text: '✅ زمان را انتخاب کردم' }, { text: '❌ منصرف شدم' }],
      [{ text: '🔙 بازگشت به منوی اصلی' }]
    ],
    resize_keyboard: true,
    one_time_keyboard: true
  }
};

const paymentStatusKeyboard = {
  reply_markup: {
    keyboard: [
      [{ text: '✅ پرداخت شده' }, { text: '❌ پرداخت نشده' }],
      [{ text: '🔙 بازگشت به منوی اصلی' }]
    ],
    resize_keyboard: true,
    one_time_keyboard: true
  }
};

const studentActionsKeyboard = {
  reply_markup: {
    keyboard: [
      [{ text: '📅 ویرایش تاریخ کلاس‌ها' }, { text: '💳 اطلاع‌رسانی پرداخت' }],
      [{ text: '📝 دادن تکلیف اضافی' }, { text: '📘 تغییر تعداد جلسات' }],
      [{ text: '🔄 تغییر وضعیت پرداخت' }, { text: '📚 تغییر نوع کلاس' }],
      [{ text: '🔙 بازگشت به لیست' }]
    ],
    resize_keyboard: true,
    one_time_keyboard: false
  }
};

const groupStudentActionsKeyboard = {
  reply_markup: {
    keyboard: [
      [{ text: '📅 ویرایش تاریخ کلاس‌ها' }, { text: '💳 اطلاع‌رسانی پرداخت' }],
      [{ text: '📝 دادن تکلیف اضافی' }, { text: '📘 تغییر تعداد جلسات' }],
      [{ text: '🔄 تغییر وضعیت پرداخت' }, { text: '📚 تغییر نوع کلاس' }],
      [{ text: '👥 تشکیل گروه' }, { text: '🔙 بازگشت به لیست' }]
    ],
    resize_keyboard: true,
    one_time_keyboard: false
  }
};


const bookKeyboard = {
  reply_markup: {
    keyboard: [
      [{ text: '📖 کتاب فرانسوی سطح ۱' }, { text: '📖 کتاب فرانسوی سطح ۲' }],
      [{ text: '📖 کتاب فرانسوی سطح ۳' }, { text: '📖 کتاب گرامر فرانسوی' }],
      [{ text: '🔙 بازگشت به منوی اصلی' }]
    ],
    resize_keyboard: true,
    one_time_keyboard: true
  }
};

// Helper function to notify teacher
async function notifyZahra(message) {
  const teacherId = '1955330844';
  try {
    await bot.sendMessage(teacherId, message);
  } catch (error) {
    console.error('Error notifying teacher:', error);
  }
}

// Helper function to get correct menu
async function getCorrectMenu(chatId) {
  if (chatId.toString() === '1955330844') {
    return { text: TEXTS.teacherMenu, keyboard: teacherMenuKeyboard };
  }
  
  const student = await prisma.student.findFirst({
    where: { telegramId: chatId.toString() }
  });
  
  if (student && student.registrationStatus === 'approved') {
    return { text: TEXTS.studentMenu, keyboard: studentMenuKeyboard };
  } else {
    return { text: TEXTS.newUserMenu, keyboard: newUserMenuKeyboard };
  }
}

// Handle /start command
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name || '';
  
  try {
    // Check if this is the teacher
    if (chatId.toString() === '1955330844') {
      await bot.sendMessage(chatId, `سلام زهرا! 👋\n\n${TEXTS.teacherWelcome}`, teacherMenuKeyboard);
      return;
    }
    
    // Check if student exists
    const student = await prisma.student.findFirst({
      where: { telegramId: chatId.toString() }
    });

    if (student && student.registrationStatus === 'approved') {
      // Existing approved student
      await bot.sendMessage(chatId, `سلام ${firstName}! 👋\n\n${TEXTS.studentWelcome}`, studentMenuKeyboard);
     } else if (student && student.registrationStatus === 'pending') {
       // Student waiting for approval
       await bot.sendMessage(chatId, `سلام ${firstName}! 👋\n\n⏳ ثبت‌نام شما در انتظار تأیید است. لطفاً منتظر پیام زهرا باشید.`, newUserMenuKeyboard);
    } else {
      // New user
      await bot.sendMessage(chatId, `سلام ${firstName}! 👋\n\n${TEXTS.newUserWelcome}`, newUserMenuKeyboard);
    }
  } catch (error) {
    console.error('Error in /start:', error);
    await bot.sendMessage(chatId, 'خطا در سیستم. لطفاً دوباره تلاش کنید.');
  }
});

// Handle registration
bot.onText(/📝 ثبت‌نام/, async (msg) => {
  const chatId = msg.chat.id;
  console.log('Registration button clicked by:', chatId);
  
  try {
    // Check if student already exists
    const existingStudent = await prisma.student.findFirst({
      where: { telegramId: chatId.toString() }
    });
    
    console.log('Existing student found:', existingStudent);
    
     if (existingStudent) {
       if (existingStudent.registrationStatus === 'pending') {
         await bot.sendMessage(chatId, '⏳ ثبت‌نام شما در انتظار تأیید است. لطفاً منتظر پیام زهرا باشید.', newUserMenuKeyboard);
       } else if (existingStudent.registrationStatus === 'approved') {
         await bot.sendMessage(chatId, '✅ شما قبلاً ثبت‌نام کرده‌اید!', studentMenuKeyboard);
       } else if (existingStudent.registrationStatus === 'rejected') {
         await bot.sendMessage(chatId, '❌ متأسفانه ثبت‌نام قبلی شما رد شده است. لطفاً برای ثبت‌نام مجدد با زهرا تماس بگیرید.', newUserMenuKeyboard);
       }
       return;
     }
    
    // Start registration process
    userStates.set(chatId, { 
      step: 'phone_request',
      data: { 
        telegramId: chatId.toString(),
        firstName: msg.from.first_name || '',
        userId: msg.from.id
      }
    });
    
    await bot.sendMessage(chatId, TEXTS.phoneRequest, phoneRequestKeyboard);
  } catch (error) {
    console.error('Error in registration:', error);
    await bot.sendMessage(chatId, 'خطا در سیستم. لطفاً دوباره تلاش کنید.');
  }
});

// Handle contact sharing
bot.on('contact', async (msg) => {
  const chatId = msg.chat.id;
  const contact = msg.contact;
  
  try {
    const state = userStates.get(chatId);
    
    if (state && state.step === 'phone_request') {
      // Extract phone number
      let phoneNumber = contact.phone_number;
      if (phoneNumber.startsWith('+')) {
        phoneNumber = phoneNumber.substring(1);
      }
      
      // Check if student exists by phone number
      const existingStudent = await prisma.student.findFirst({
        where: { phoneNumber: phoneNumber }
      });
      
      if (existingStudent) {
        // Update existing student with telegram ID
        await prisma.student.update({
          where: { id: existingStudent.id },
          data: { telegramId: chatId.toString() }
        });
        
        const message = `${TEXTS.phoneReceived}\n\n👋 سلام! شما قبلاً ثبت‌نام کرده‌اید.\n\n📋 اطلاعات شما:\n👤 نام: ${existingStudent.name}\n📱 تلفن: ${existingStudent.phoneNumber}\n📚 نوع کلاس: ${existingStudent.classType === 'private' ? 'خصوصی' : 'گروهی'}\n📘 جلسات باقی‌مانده: ${existingStudent.sessionsLeft}`;
        
        userStates.delete(chatId);
        await bot.sendMessage(chatId, message, studentMenuKeyboard);
      } else {
        // New student - continue with registration
        state.data.phoneNumber = phoneNumber;
        state.data.firstName = contact.first_name || state.data.firstName;
        state.data.lastName = contact.last_name || '';
        state.step = 'name';
        userStates.set(chatId, state);
        
        await bot.sendMessage(chatId, `${TEXTS.phoneReceived}\n\n👤 لطفاً نام کامل خود را وارد کنید:`, backKeyboard);
      }
    } else if (state && state.step === 'existing_student_phone') {
      // Handle existing student phone number
      let phoneNumber = contact.phone_number;
      if (phoneNumber.startsWith('+')) {
        phoneNumber = phoneNumber.substring(1);
      }
      
      state.data.phoneNumber = phoneNumber;
      state.step = 'existing_student_city';
      userStates.set(chatId, state);
      
      await bot.sendMessage(chatId, `📱 تلفن: ${phoneNumber}\n\n🏙️ لطفاً شهر محل زندگی خود را وارد کنید:`, backKeyboard);
    } else if (state && state.step === 'test_class_phone') {
      // Handle test class phone number
      let phoneNumber = contact.phone_number;
      if (phoneNumber.startsWith('+')) {
        phoneNumber = phoneNumber.substring(1);
      }
      
      try {
        // Save test class request to database
        const student = await prisma.student.create({
          data: {
            name: state.data.name,
            phoneNumber: phoneNumber,
            telegramId: state.data.telegramId.toString(),
            classType: 'test',
            registrationStatus: 'pending',
            learningReason: 'کلاس آزمایشی',
            sessionsLeft: 1,
            paymentStatus: 'unpaid'
          }
        });
        
        // Notify teacher
        const teacherId = '1955330844';
        await bot.sendMessage(teacherId, `🆓 درخواست کلاس آزمایشی جدید!

👤 نام: ${state.data.name}
📱 تلفن: ${phoneNumber}
🆔 تلگرام: ${state.data.telegramId}
📅 زمان: کاربر زمان را در تقویم انتخاب کرده
🆔 ID: ${student.id}
⏰ لطفاً تقویم را بررسی کنید و با دانشجو تماس بگیرید.`);
        
        userStates.delete(chatId);
        const menu = await getCorrectMenu(chatId);
        await bot.sendMessage(chatId, `✅ درخواست کلاس آزمایشی شما ثبت شد!

👤 نام: ${state.data.name}
📱 تلفن: ${phoneNumber}
📅 زهرا به زودی با شما تماس خواهد گرفت.

متشکریم!`, menu.keyboard);
      } catch (error) {
        console.error('Error saving test class request:', error);
        await bot.sendMessage(chatId, 'خطا در ثبت درخواست. لطفاً دوباره تلاش کنید.', backKeyboard);
      }
    }
  } catch (error) {
    console.error('Error handling contact:', error);
    await bot.sendMessage(chatId, 'خطا در دریافت شماره تلفن. لطفاً دوباره تلاش کنید.');
  }
});

// Handle text messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  
  try {
    const state = userStates.get(chatId);
    console.log('Message received:', text, 'State:', state ? state.step : 'no state');
    console.log('Chat ID:', chatId, 'Message type:', msg.message_id);
    
    // Handle registration button - PRIORITY HANDLER
    if (text === '📝 ثبت‌نام') {
      console.log('Registration button clicked in main handler:', chatId);
      
      try {
        // Check if student already exists
        const existingStudent = await prisma.student.findFirst({
          where: { telegramId: chatId.toString() }
        });
        
        console.log('Existing student found:', existingStudent);
        
        if (existingStudent) {
          if (existingStudent.registrationStatus === 'pending') {
            await bot.sendMessage(chatId, '⏳ ثبت‌نام شما در انتظار تأیید است. لطفاً منتظر پیام زهرا باشید.', newUserMenuKeyboard);
          } else if (existingStudent.registrationStatus === 'approved') {
            await bot.sendMessage(chatId, '✅ شما قبلاً ثبت‌نام کرده‌اید!', studentMenuKeyboard);
          } else if (existingStudent.registrationStatus === 'rejected') {
            await bot.sendMessage(chatId, '❌ متأسفانه ثبت‌نام قبلی شما رد شده است. لطفاً برای ثبت‌نام مجدد با زهرا تماس بگیرید.', newUserMenuKeyboard);
          }
          return;
        }
        
        // Start registration process
        userStates.set(chatId, { 
          step: 'phone_request',
          data: { 
            name: '',
            phoneNumber: '',
            email: '',
            city: '',
            birthDate: '',
            learningReason: '',
            experience: '',
            level: '',
            classType: '',
            sessionsPerWeek: '',
            selectedDays: [],
            selectedTimes: [],
            additionalInfo: ''
          }
        });
        
        await bot.sendMessage(chatId, '📱 لطفاً شماره تلفن خود را وارد کنید:', backKeyboard);
        return;
      } catch (error) {
        console.error('Error in registration handler:', error);
        await bot.sendMessage(chatId, 'خطا در سیستم. لطفاً دوباره تلاش کنید.');
        return;
      }
    }

    // Handle class review - PRIORITY HANDLER
    if (state && state.step === 'class_review') {
      console.log(`Class review response from ${chatId}: ${text}`);
      console.log(`State data:`, state.data);
      
      if (text && text.trim().length > 5) {
        try {
          const classRecord = await prisma.class.findUnique({
            where: { id: state.data.classId },
            include: { student: true }
          });
          
          if (classRecord) {
            console.log(`Processing review for class ${classRecord.id}`);
            
            // Send review to teacher immediately
            const teacherId = '1955330844';
            const reviewMessage = `📝 نظرسنجی کلاس

👤 دانشجو: ${classRecord.student.name}
📅 ${classRecord.day} - ${classRecord.time}
📱 تلفن: ${classRecord.student.phoneNumber || 'نامشخص'}

💬 نظر دانشجو:
"${text.trim()}"`;
            
            await bot.sendMessage(teacherId, reviewMessage);
            
            // Update class with review
            await prisma.class.update({
              where: { id: state.data.classId },
              data: { 
                status: 'completed'
              }
            });
            
            userStates.delete(chatId);
            await bot.sendMessage(chatId, '✅ متشکریم از نظر شما! نظرتان به زهرا ارسال شد.', studentMenuKeyboard);
          } else {
            console.log(`Class record not found for review ${state.data.classId}`);
            // For test reviews with classId 999, just send to teacher
            if (state.data.classId === 999) {
              const student = await prisma.student.findUnique({
                where: { telegramId: chatId.toString() }
              });
              
              const reviewMessage = `📝 نظرسنجی کلاس (تست)

👤 دانشجو: ${student ? student.name : 'نامشخص'}
📅 کلاس آزمایشی
📱 تلفن: ${student ? student.phoneNumber : 'نامشخص'}

💬 نظر دانشجو:
"${text.trim()}"`;
              
              await bot.sendMessage('1955330844', reviewMessage);
              userStates.delete(chatId);
              await bot.sendMessage(chatId, '✅ متشکریم از نظر شما! نظرتان به زهرا ارسال شد.', studentMenuKeyboard);
            }
          }
        } catch (error) {
          console.error('Error handling class review:', error);
          await bot.sendMessage(chatId, 'خطا در ارسال نظر. لطفاً دوباره تلاش کنید.', studentMenuKeyboard);
        }
      } else {
        await bot.sendMessage(chatId, 'لطفاً نظر خود را به صورت کامل وارد کنید (حداقل ۵ کاراکتر).', backKeyboard);
      }
      return;
    }
    
    // Handle back to main menu
    if (text === '🔙 بازگشت به منوی اصلی') {
      userStates.delete(chatId);
      const menu = await getCorrectMenu(chatId);
      await bot.sendMessage(chatId, menu.text, menu.keyboard);
      return;
    }
    
    // Handle back to student list
    if (text === '🔙 بازگشت به لیست') {
      userStates.delete(chatId);
      await bot.sendMessage(chatId, '🔙 بازگشت به لیست دانش‌آموزان', teacherMenuKeyboard);
      return;
    }
    
    // Handle menu buttons that don't require state
    if (!state) {
      // Handle book selection
      if (text && text.includes('📖 کتاب')) {
        await handleBookSelection(chatId, text);
        return;
      }
      
     // Handle test class booking
     if (text === '🎯 رزرو کلاس آزمایشی') {
       userStates.set(chatId, { 
         step: 'test_class_booking',
         data: { telegramId: msg.from.id }
       });
       
       const message = `🆓 رزرو کلاس آزمایشی

📅 لطفاً برای انتخاب زمان کلاس آزمایشی از لینک زیر استفاده کنید:

🔗 https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ0NtoUdys7OfznfPZvLtIq68BWM3_CZ3Vk8ZKSo8iEsuxtEasuumNXB3s9LEcdt37oAl5R1i-bA

⏰ پس از انتخاب زمان، زهرا بر اساس زمان انتخاب شده با شما تماس خواهد گرفت.

آیا زمان را انتخاب کردید؟`;
       
       await bot.sendMessage(chatId, message, testClassResponseKeyboard);
       return;
     }
     
     
     
    // Handle class link for students
    if (text === '🔗 لینک کلاس') {
      await bot.sendMessage(chatId, `🔗 لینک کلاس

📅 برای شرکت در کلاس از لینک زیر استفاده کنید:

🔗 https://meet.google.com/emb-fhpm-gwp

💡 نکات مهم:
• لینک کلاس همیشه ثابت است
• ۵ دقیقه قبل از شروع کلاس وارد شوید
• در صورت مشکل با زهرا تماس بگیرید

موفق باشید! 🎓`, studentMenuKeyboard);
      return;
    }
    
    // Handle class cancellation for students
    if (text === '❌ کنسل کردن جلسه') {
      try {
        const student = await prisma.student.findFirst({
          where: { telegramId: chatId.toString() }
        });
        
        if (!student) {
          await bot.sendMessage(chatId, '❌ دانش‌آموز یافت نشد.', studentMenuKeyboard);
          return;
        }
        
        // Get upcoming classes (next 7 days)
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        const upcomingClasses = await prisma.class.findMany({
          where: {
            studentId: student.id,
            status: 'scheduled',
            date: {
              gte: now,
              lte: nextWeek
            }
          },
          orderBy: { date: 'asc' }
        });
        
        if (upcomingClasses.length === 0) {
          await bot.sendMessage(chatId, '❌ هیچ کلاس آینده‌ای برای کنسل کردن وجود ندارد.', studentMenuKeyboard);
          return;
        }
        
        // Create inline keyboard for class selection
        const classKeyboard = {
          reply_markup: {
            inline_keyboard: upcomingClasses.map(cls => {
              const date = new Date(cls.date);
              const dateStr = date.toLocaleDateString('fa-IR');
              const timeStr = date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
              
              return [{
                text: `${cls.day} ${dateStr} - ${timeStr}`,
                callback_data: `cancel_class_${cls.id}`
              }];
            }).concat([[
              { text: '🔙 بازگشت', callback_data: 'back_to_student_menu' }
            ]])
          }
        };
        
        await bot.sendMessage(chatId, `❌ کنسل کردن جلسه

📅 کلاس‌های آینده شما (۷ روز آینده):

لطفاً کلاسی که می‌خواهید کنسل کنید را انتخاب کنید:

⚠️ توجه: کنسل کردن باید حداقل ۲۴ ساعت قبل از زمان کلاس انجام شود.`, classKeyboard);
      } catch (error) {
        console.error('Error handling class cancellation:', error);
        await bot.sendMessage(chatId, 'خطا در دریافت کلاس‌ها. لطفاً دوباره تلاش کنید.', studentMenuKeyboard);
      }
      return;
    }
     
     // Handle existing students review for teacher
     if (text === '👨‍🎓 بررسی دانش‌آموزان موجود') {
       try {
         const existingStudents = await prisma.student.findMany({
           where: {
             registrationStatus: 'existing_pending'
           },
           select: {
             id: true,
             name: true,
             phoneNumber: true,
             city: true,
             telegramId: true,
             createdAt: true
           },
           orderBy: {
             createdAt: 'desc'
           }
         });

         if (existingStudents.length === 0) {
           await bot.sendMessage(chatId, `👨‍🎓 بررسی دانش‌آموزان موجود

📋 در حال حاضر هیچ درخواست دانش‌آموز موجود در انتظار وجود ندارد.

✅ همه درخواست‌ها بررسی شده‌اند.`, teacherMenuKeyboard);
           return;
         }

         let message = `👨‍🎓 بررسی دانش‌آموزان موجود

📋 ${existingStudents.length} درخواست دانش‌آموز موجود در انتظار:

`;

         existingStudents.forEach((student, index) => {
           const date = new Date(student.createdAt).toLocaleDateString('fa-IR');
           message += `${index + 1}. 👤 ${student.name}
📱 ${student.phoneNumber || 'نامشخص'}
🏙️ ${student.city || 'نامشخص'}
🆔 ${student.telegramId || 'نامشخص'}
📅 ${date}

`;
         });

         userStates.set(chatId, { 
           step: 'review_existing_students',
           data: { existingStudents }
         });

         await bot.sendMessage(chatId, message + 'برای تأیید یک دانش‌آموز، شماره آن را ارسال کنید. برای لغو "لغو" بنویسید.', backKeyboard);
       } catch (error) {
         console.error('Error fetching existing students:', error);
         await bot.sendMessage(chatId, 'خطا در دریافت اطلاعات دانش‌آموزان موجود.', teacherMenuKeyboard);
       }
       return;
     }

    // Handle dashboard button
    if (text === '📊 پنل مدیریت') {
      const dashboardUrl = `http://localhost:${process.env.PORT || 3000}/dashboard.html`;
      await bot.sendMessage(chatId, `📊 پنل مدیریت کلاس‌های فرانسه

🔗 لینک پنل مدیریت:
${dashboardUrl}

💡 در این پنل می‌توانید:
• تمام دانش‌آموزان را مشاهده و مدیریت کنید
• کلاس‌های آینده را ببینید
• به سوالات پاسخ دهید
• دانش‌آموزان را تأیید یا رد کنید
• تکالیف را بررسی کنید

📱 برای دسترسی، لینک بالا را در مرورگر باز کنید.`, teacherMenuKeyboard);
      return;
    }
    
    // Handle teacher class cancellation
    if (text === '❌ کنسل کردن کلاس') {
      try {
        // Get all upcoming classes (next 14 days)
        const now = new Date();
        const nextTwoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
        
        const upcomingClasses = await prisma.class.findMany({
          where: {
            status: 'scheduled',
            date: {
              gte: now,
              lte: nextTwoWeeks
            }
          },
          include: {
            student: true
          },
          orderBy: { date: 'asc' }
        });
        
        if (upcomingClasses.length === 0) {
          await bot.sendMessage(chatId, '❌ هیچ کلاس آینده‌ای برای کنسل کردن وجود ندارد.', teacherMenuKeyboard);
          return;
        }
        
        // Create inline keyboard for class selection
        const classKeyboard = {
          reply_markup: {
            inline_keyboard: upcomingClasses.map(cls => {
              const date = new Date(cls.date);
              const dateStr = date.toLocaleDateString('fa-IR');
              const timeStr = date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
              
              return [{
                text: `${cls.student.name} - ${cls.day} ${dateStr} - ${timeStr}`,
                callback_data: `teacher_cancel_class_${cls.id}`
              }];
            }).concat([[
              { text: '🔙 بازگشت', callback_data: 'back_to_teacher_menu' }
            ]])
          }
        };
        
        await bot.sendMessage(chatId, `❌ کنسل کردن کلاس

📅 کلاس‌های آینده (۱۴ روز آینده):

لطفاً کلاسی که می‌خواهید کنسل کنید را انتخاب کنید:`, classKeyboard);
      } catch (error) {
        console.error('Error handling teacher class cancellation:', error);
        await bot.sendMessage(chatId, 'خطا در دریافت کلاس‌ها. لطفاً دوباره تلاش کنید.', teacherMenuKeyboard);
      }
      return;
    }

    // Handle test class review for teacher
    if (text === '🆓 بررسی کلاس‌های آزمایشی') {
       try {
         // Get all students who have requested test classes
         const testClassStudents = await prisma.student.findMany({
           where: {
             status: 'pending',
             // You can add more conditions here if needed
           },
           select: {
             id: true,
             name: true,
             phoneNumber: true,
             telegramId: true,
             createdAt: true,
             learningReason: true,
             level: true
           },
           orderBy: {
             createdAt: 'desc'
           }
         });

         if (testClassStudents.length === 0) {
           await bot.sendMessage(chatId, `🆓 بررسی کلاس‌های آزمایشی

📋 در حال حاضر هیچ درخواست کلاس آزمایشی در انتظار وجود ندارد.

✅ همه درخواست‌ها بررسی شده‌اند.`, teacherMenuKeyboard);
           return;
         }

         let message = `🆓 بررسی کلاس‌های آزمایشی

📋 ${testClassStudents.length} درخواست کلاس آزمایشی در انتظار:

`;

         testClassStudents.forEach((student, index) => {
           const date = new Date(student.createdAt).toLocaleDateString('fa-IR');
           message += `${index + 1}. 👤 ${student.name}
📱 ${student.phoneNumber || 'نامشخص'}
🆔 ${student.telegramId || 'نامشخص'}
📅 ${date}
🎯 ${student.learningReason || 'نامشخص'}
📊 ${student.level || 'نامشخص'}

`;
         });

         message += `💡 برای تأیید یا رد هر درخواست، از منوی "✅ تأیید ثبت‌نام‌ها" استفاده کنید.`;

         await bot.sendMessage(chatId, message, teacherMenuKeyboard);
       } catch (error) {
         console.error('Error fetching test class students:', error);
         await bot.sendMessage(chatId, 'خطا در دریافت اطلاعات کلاس‌های آزمایشی.', teacherMenuKeyboard);
       }
       return;
     }
     
    // Handle other menu buttons
    await handleMenuButtons(chatId, text, msg, state);
    return;
   }
    
   // Handle test class booking response
   if (state && state.step === 'test_class_booking') {
     console.log('Test class booking handler triggered with text:', text);
     if (text === '✅ زمان را انتخاب کردم') {
       console.log('User chose time, asking for name');
       // Ask for name
       state.step = 'test_class_name';
       userStates.set(chatId, state);
       await bot.sendMessage(chatId, '👤 لطفاً نام کامل خود را وارد کنید:', backKeyboard);
       return;
     } else if (text === '❌ منصرف شدم') {
       console.log('User cancelled, returning to menu');
       // Return to main menu
       userStates.delete(chatId);
       const menu = await getCorrectMenu(chatId);
       await bot.sendMessage(chatId, '❌ در صورت تمایل می‌توانید بعداً دوباره تلاش کنید.', menu.keyboard);
       return;
     } else {
       // If it's not one of the expected buttons, ignore and let other handlers process it
       console.log('Ignoring text in test_class_booking state:', text);
       // Don't return here, let the message continue to other handlers
     }
   }

   // Handle test class name input
   if (state && state.step === 'test_class_name') {
     if (text && text.trim().length > 2) {
       const name = text.trim();
       state.data.name = name;
       state.step = 'test_class_phone';
       userStates.set(chatId, state);
       await bot.sendMessage(chatId, `نام: ${name}\n\n📱 لطفاً شماره تلفن خود را ارسال کنید:`, phoneRequestKeyboard);
     } else {
       await bot.sendMessage(chatId, 'لطفاً نام کامل خود را وارد کنید (حداقل ۳ کاراکتر).', backKeyboard);
     }
     return;
   }

   // Handle existing student approval flow
   if (state && state.step === 'approve_existing_sessions') {
     const sessions = parseInt(text);
     if (sessions && sessions > 0) {
       state.data.sessionsLeft = sessions;
       state.step = 'approve_existing_sessions_per_week';
       userStates.set(chatId, state);
       
       await bot.sendMessage(chatId, `📚 تعداد کل جلسات: ${sessions}

📅 تعداد جلسات در هفته را وارد کنید:`, backKeyboard);
     } else {
       await bot.sendMessage(chatId, 'لطفاً تعداد جلسات معتبر وارد کنید (عدد مثبت).', backKeyboard);
     }
     return;
   }

   if (state && state.step === 'approve_existing_sessions_per_week') {
     const sessionsPerWeek = parseInt(text);
     if (sessionsPerWeek && sessionsPerWeek > 0) {
       state.data.sessionsPerWeek = sessionsPerWeek;
       state.data.selectedDays = [];
       state.data.classTimes = [];
       state.step = 'approve_existing_select_days';
       userStates.set(chatId, state);
       
       await bot.sendMessage(chatId, `📅 جلسات در هفته: ${sessionsPerWeek}

📅 روزهای هفته را انتخاب کنید (${sessionsPerWeek} روز):`, teacherWeekdaysKeyboard);
     } else {
       await bot.sendMessage(chatId, 'لطفاً تعداد جلسات در هفته را به صورت عدد وارد کنید.', backKeyboard);
     }
     return;
   }

   if (state && state.step === 'approve_existing_select_days') {
     if (text === '✅ تأیید انتخاب روزها') {
       if (state.data.selectedDays.length === state.data.sessionsPerWeek) {
         state.step = 'approve_existing_class_times';
         state.data.currentDayIndex = 0;
         userStates.set(chatId, state);
         
         const currentDay = state.data.selectedDays[0];
         await bot.sendMessage(chatId, `📅 روزهای انتخاب شده: ${state.data.selectedDays.join(', ')}

⏰ ساعت کلاس برای ${currentDay} را وارد کنید (مثال: 15:00):`, backKeyboard);
       } else {
         await bot.sendMessage(chatId, `لطفاً دقیقاً ${state.data.sessionsPerWeek} روز انتخاب کنید.`, teacherWeekdaysKeyboard);
       }
     } else if (state.data.selectedDays.includes(text)) {
       // Remove day if already selected
       state.data.selectedDays = state.data.selectedDays.filter(day => day !== text);
       await bot.sendMessage(chatId, `📅 روزهای انتخاب شده: ${state.data.selectedDays.join(', ') || 'هیچ'}

📅 روزهای هفته را انتخاب کنید (${state.data.sessionsPerWeek} روز):`, teacherWeekdaysKeyboard);
     } else if (state.data.selectedDays.length < state.data.sessionsPerWeek) {
       // Add day
       state.data.selectedDays.push(text);
       await bot.sendMessage(chatId, `📅 روزهای انتخاب شده: ${state.data.selectedDays.join(', ')}

📅 روزهای هفته را انتخاب کنید (${state.data.sessionsPerWeek} روز):`, teacherWeekdaysKeyboard);
     } else {
       await bot.sendMessage(chatId, `لطفاً ابتدا روزهای انتخاب شده را تأیید کنید یا روز دیگری را حذف کنید.`, teacherWeekdaysKeyboard);
     }
     return;
   }

   if (state && state.step === 'approve_existing_class_times') {
     const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
     if (timePattern.test(text)) {
       const currentDay = state.data.selectedDays[state.data.currentDayIndex];
       state.data.classTimes.push({ day: currentDay, time: text });
       
       if (state.data.currentDayIndex < state.data.selectedDays.length - 1) {
         state.data.currentDayIndex++;
         const nextDay = state.data.selectedDays[state.data.currentDayIndex];
         await bot.sendMessage(chatId, `⏰ ساعت کلاس برای ${currentDay}: ${text}

⏰ ساعت کلاس برای ${nextDay} را وارد کنید (مثال: 15:00):`, backKeyboard);
       } else {
         state.step = 'approve_existing_payment_status';
         userStates.set(chatId, state);
         
         const timesText = state.data.classTimes.map(ct => `${ct.day}: ${ct.time}`).join('\n');
         await bot.sendMessage(chatId, `📅 برنامه کلاس‌ها:
${timesText}

💳 وضعیت پرداخت دانش‌آموز را انتخاب کنید:`, paymentStatusKeyboard);
       }
     } else {
       await bot.sendMessage(chatId, 'لطفاً ساعت را به فرمت صحیح وارد کنید (مثال: 15:00).', backKeyboard);
     }
     return;
   }

   if (state && state.step === 'approve_existing_payment_status') {
     if (text === '✅ پرداخت شده' || text === '❌ پرداخت نشده') {
       const paymentStatus = text === '✅ پرداخت شده' ? 'paid' : 'unpaid';
       
       try {
         // Update student with approval details
         await prisma.student.update({
           where: { id: state.data.studentId },
           data: {
             sessionsLeft: state.data.sessionsLeft,
             sessionsPerWeek: state.data.sessionsPerWeek.toString(),
             selectedDays: state.data.selectedDays.join(','),
             selectedTimes: state.data.classTimes.map(ct => `${ct.day}:${ct.time}`).join(','),
             classSchedule: JSON.stringify(state.data.classTimes),
             paymentStatus: paymentStatus,
             registrationStatus: 'approved'
           }
         });
         
         // Generate class schedule
         await generateClassSchedule(state.data.studentId, state.data.classTimes);
         
         // Notify student
         if (state.data.student.telegramId) {
           await bot.sendMessage(state.data.student.telegramId, `🎉 تأیید شما تکمیل شد!

📚 تعداد جلسات: ${state.data.sessionsLeft}
📅 جلسات در هفته: ${state.data.sessionsPerWeek}
📅 روزهای کلاس: ${state.data.selectedDays.join(', ')}
⏰ ساعات کلاس:
${state.data.classTimes.map(ct => `${ct.day}: ${ct.time}`).join('\n')}

🔄 لطفاً ربات را دوباره با /start شروع کنید تا منوی جدید را ببینید.`, studentMenuKeyboard);
         }
         
         userStates.delete(chatId);
         await bot.sendMessage(chatId, `✅ دانش‌آموز موجود ${state.data.student.name} با موفقیت تأیید شد!`, teacherMenuKeyboard);
       } catch (error) {
         console.error('Error approving existing student:', error);
         await bot.sendMessage(chatId, 'خطا در تأیید دانش‌آموز موجود. لطفاً دوباره تلاش کنید.', teacherMenuKeyboard);
       }
     } else {
       await bot.sendMessage(chatId, 'لطفاً وضعیت پرداخت را انتخاب کنید.', paymentStatusKeyboard);
     }
     return;
   }

   // Handle teacher approval flow
   if (state && state.step === 'approve_sessions') {
     const sessions = parseInt(text);
     if (sessions && sessions > 0) {
       state.data.sessionsLeft = sessions;
       state.step = 'approve_sessions_per_week';
       userStates.set(chatId, state);
       
       await bot.sendMessage(chatId, `📚 تعداد کل جلسات: ${sessions}

📅 تعداد جلسات در هفته را وارد کنید:`, backKeyboard);
     } else {
       await bot.sendMessage(chatId, 'لطفاً تعداد جلسات معتبر وارد کنید (عدد مثبت).', backKeyboard);
     }
     return;
   }

   if (state && state.step === 'approve_sessions_per_week') {
     const sessionsPerWeek = parseInt(text);
     if (sessionsPerWeek && sessionsPerWeek > 0) {
       state.data.sessionsPerWeek = sessionsPerWeek;
       state.data.selectedDays = [];
       state.data.classTimes = [];
       state.step = 'approve_select_days';
       userStates.set(chatId, state);
       
       await bot.sendMessage(chatId, `📅 جلسات در هفته: ${sessionsPerWeek}

📅 روزهای هفته را انتخاب کنید (${sessionsPerWeek} روز):`, teacherWeekdaysKeyboard);
     } else {
       await bot.sendMessage(chatId, 'لطفاً تعداد جلسات در هفته را به صورت عدد وارد کنید.', backKeyboard);
     }
     return;
   }

   if (state && state.step === 'approve_select_days') {
     if (text === '✅ تأیید انتخاب روزها') {
       if (state.data.selectedDays.length === state.data.sessionsPerWeek) {
         state.step = 'approve_class_times';
         state.data.currentDayIndex = 0;
         userStates.set(chatId, state);
         
         const currentDay = state.data.selectedDays[0];
         await bot.sendMessage(chatId, `📅 روزهای انتخاب شده: ${state.data.selectedDays.join(', ')}

⏰ ساعت کلاس برای ${currentDay} را وارد کنید (مثال: 15:00):`, backKeyboard);
       } else {
         await bot.sendMessage(chatId, `لطفاً دقیقاً ${state.data.sessionsPerWeek} روز انتخاب کنید.`, teacherWeekdaysKeyboard);
       }
     } else if (state.data.selectedDays.includes(text)) {
       // Remove day if already selected
       state.data.selectedDays = state.data.selectedDays.filter(day => day !== text);
       await bot.sendMessage(chatId, `📅 روزهای انتخاب شده: ${state.data.selectedDays.join(', ') || 'هیچ'}

📅 روزهای هفته را انتخاب کنید (${state.data.sessionsPerWeek} روز):`, teacherWeekdaysKeyboard);
     } else if (state.data.selectedDays.length < state.data.sessionsPerWeek) {
       // Add day
       state.data.selectedDays.push(text);
       await bot.sendMessage(chatId, `📅 روزهای انتخاب شده: ${state.data.selectedDays.join(', ')}

📅 روزهای هفته را انتخاب کنید (${state.data.sessionsPerWeek} روز):`, teacherWeekdaysKeyboard);
     } else {
       await bot.sendMessage(chatId, `لطفاً ابتدا روزهای انتخاب شده را تأیید کنید یا روز دیگری را حذف کنید.`, teacherWeekdaysKeyboard);
     }
     return;
   }

   if (state && state.step === 'approve_class_times') {
     const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
     if (timePattern.test(text)) {
       const currentDay = state.data.selectedDays[state.data.currentDayIndex];
       state.data.classTimes.push({ day: currentDay, time: text });
       
       if (state.data.currentDayIndex < state.data.selectedDays.length - 1) {
         state.data.currentDayIndex++;
         const nextDay = state.data.selectedDays[state.data.currentDayIndex];
         await bot.sendMessage(chatId, `⏰ ساعت کلاس برای ${currentDay}: ${text}

⏰ ساعت کلاس برای ${nextDay} را وارد کنید (مثال: 15:00):`, backKeyboard);
       } else {
         state.step = 'approve_payment_status';
         userStates.set(chatId, state);
         
         const timesText = state.data.classTimes.map(ct => `${ct.day}: ${ct.time}`).join('\n');
         await bot.sendMessage(chatId, `📅 برنامه کلاس‌ها:
${timesText}

💳 وضعیت پرداخت دانش‌آموز را انتخاب کنید:`, paymentStatusKeyboard);
       }
     } else {
       await bot.sendMessage(chatId, 'لطفاً ساعت را به فرمت صحیح وارد کنید (مثال: 15:00).', backKeyboard);
     }
     return;
   }

   if (state && state.step === 'approve_payment_status') {
     if (text === '✅ پرداخت شده' || text === '❌ پرداخت نشده') {
       const paymentStatus = text === '✅ پرداخت شده' ? 'paid' : 'unpaid';
       
       try {
         // Update student with approval details
         await prisma.student.update({
           where: { id: state.data.studentId },
           data: {
             sessionsLeft: state.data.sessionsLeft,
             sessionsPerWeek: state.data.sessionsPerWeek.toString(),
             selectedDays: state.data.selectedDays.join(','),
             selectedTimes: state.data.classTimes.map(ct => `${ct.day}:${ct.time}`).join(','),
             classSchedule: JSON.stringify(state.data.classTimes),
             paymentStatus: paymentStatus,
             registrationStatus: 'approved'
           }
         });
         
         // Generate class schedule
         await generateClassSchedule(state.data.studentId, state.data.classTimes);
         
         // Notify student
         if (state.data.student.telegramId) {
           await bot.sendMessage(state.data.student.telegramId, `🎉 ثبت‌نام شما تأیید شد!

📚 تعداد جلسات: ${state.data.sessionsLeft}
📅 جلسات در هفته: ${state.data.sessionsPerWeek}
📅 روزهای کلاس: ${state.data.selectedDays.join(', ')}
⏰ ساعات کلاس:
${state.data.classTimes.map(ct => `${ct.day}: ${ct.time}`).join('\n')}

🔄 لطفاً ربات را دوباره با /start شروع کنید تا منوی جدید را ببینید.`, studentMenuKeyboard);
         }
         
         userStates.delete(chatId);
         await bot.sendMessage(chatId, `✅ دانش‌آموز ${state.data.student.name} با موفقیت تأیید شد!`, teacherMenuKeyboard);
       } catch (error) {
         console.error('Error approving student:', error);
         await bot.sendMessage(chatId, 'خطا در تأیید دانش‌آموز. لطفاً دوباره تلاش کنید.', teacherMenuKeyboard);
       }
     } else {
       await bot.sendMessage(chatId, 'لطفاً وضعیت پرداخت را انتخاب کنید.', paymentStatusKeyboard);
     }
     return;
   }


   // Handle existing student flow
   if (state.step === 'existing_student_name') {
     if (text && text.trim().length > 2) {
       const name = text.trim();
       state.data.name = name;
       state.step = 'existing_student_phone';
       userStates.set(chatId, state);
       
       await bot.sendMessage(chatId, `نام: ${name}\n\n📱 لطفاً شماره تلفن خود را ارسال کنید:`, phoneRequestKeyboard);
     } else {
       await bot.sendMessage(chatId, 'لطفاً نام کامل خود را وارد کنید (حداقل ۳ کاراکتر).', backKeyboard);
     }
     return;
   }

   if (state.step === 'existing_student_city') {
     if (text && text.trim().length > 2) {
       const city = text.trim();
       state.data.city = city;
       
       try {
         // Create existing student record
         const student = await prisma.student.create({
           data: {
             name: state.data.name,
             phoneNumber: state.data.phoneNumber,
             city: city,
             registrationStatus: 'existing_pending',
             telegramId: chatId.toString()
           }
         });
         
         // Notify teacher
         const teacherId = '1955330844';
         await bot.sendMessage(teacherId, `👨‍🎓 دانش‌آموز موجود درخواست تأیید کرده:

👤 نام: ${state.data.name}
📱 تلفن: ${state.data.phoneNumber}
🏙️ شهر: ${city}
🆔 تلگرام: ${chatId}

لطفاً در منوی "👨‍🎓 بررسی دانش‌آموزان موجود" بررسی کنید.`);
         
         userStates.delete(chatId);
         await bot.sendMessage(chatId, `✅ اطلاعات شما ثبت شد!

👤 نام: ${state.data.name}
📱 تلفن: ${state.data.phoneNumber}
🏙️ شهر: ${city}

⏳ درخواست شما به زهرا ارسال شد و به زودی بررسی خواهد شد.`, newUserMenuKeyboard);
       } catch (error) {
         console.error('Error creating existing student:', error);
         await bot.sendMessage(chatId, 'خطا در ثبت اطلاعات. لطفاً دوباره تلاش کنید.', newUserMenuKeyboard);
       }
     } else {
       await bot.sendMessage(chatId, 'لطفاً شهر محل زندگی خود را وارد کنید.', backKeyboard);
     }
     return;
   }

   // Handle new registration flow
   if (state.step === 'name') {
       if (text && text.trim().length > 2) {
         const name = text.trim();
         state.data.name = name;
         state.step = 'email';
         userStates.set(chatId, state);
         
         await bot.sendMessage(chatId, `نام: ${name}\n\n📧 لطفاً ایمیل خود را وارد کنید:`, skipInlineKeyboard);
       } else {
         await bot.sendMessage(chatId, 'لطفاً نام کامل خود را وارد کنید (حداقل ۳ کاراکتر).', backKeyboard);
       }
     } else if (state.step === 'email') {
       if (text === 'تمایلی به گفتنش ندارم') {
         state.data.email = 'تمایلی به گفتنش ندارم';
         state.step = 'city';
         userStates.set(chatId, state);
         
         await bot.sendMessage(chatId, `ایمیل: تمایلی به گفتنش ندارم\n\n🏙️ لطفاً شهر محل زندگی خود را وارد کنید:`, backKeyboard);
       } else if (text && text.includes('@')) {
         state.data.email = text.trim();
         state.step = 'city';
         userStates.set(chatId, state);
         
         await bot.sendMessage(chatId, `ایمیل: ${text}\n\n🏙️ لطفاً شهر محل زندگی خود را وارد کنید:`, backKeyboard);
       } else {
         await bot.sendMessage(chatId, 'لطفاً یک ایمیل معتبر وارد کنید یا "تمایلی به گفتنش ندارم" را انتخاب کنید.', skipInlineKeyboard);
       }
     } else if (state.step === 'city') {
       if (text && text.trim().length > 2) {
         state.data.city = text.trim();
         state.step = 'birth_date';
         userStates.set(chatId, state);
         
         await bot.sendMessage(chatId, `شهر: ${text}\n\n📅 لطفاً تاریخ تولد خود را وارد کنید (مثال: 1375/05/15):`, skipInlineKeyboard);
       } else {
         await bot.sendMessage(chatId, 'لطفاً شهر محل زندگی خود را وارد کنید.', backKeyboard);
       }
     } else if (state.step === 'birth_date') {
       if (text === 'تمایلی به گفتنش ندارم') {
         state.data.birthDate = 'تمایلی به گفتنش ندارم';
         state.step = 'learning_reason';
         userStates.set(chatId, state);
         
         await bot.sendMessage(chatId, `تاریخ تولد: تمایلی به گفتنش ندارم\n\n🎯 دلیل یادگیری زبان فرانسه را انتخاب کنید:`, learningReasonKeyboard);
       } else if (text && text.trim().length > 5) {
         state.data.birthDate = text.trim();
         state.step = 'learning_reason';
         userStates.set(chatId, state);
         
         await bot.sendMessage(chatId, `تاریخ تولد: ${text}\n\n🎯 دلیل یادگیری زبان فرانسه را انتخاب کنید:`, learningReasonKeyboard);
       } else {
         await bot.sendMessage(chatId, 'لطفاً تاریخ تولد را وارد کنید (مثال: 1375/05/15) یا "تمایلی به گفتنش ندارم" را انتخاب کنید.', skipInlineKeyboard);
       }
     } else if (state.step === 'learning_reason') {
       if (text && text !== '🔙 بازگشت به منوی اصلی') {
         state.data.learningReason = text;
         state.step = 'experience';
         userStates.set(chatId, state);
         
         await bot.sendMessage(chatId, `دلیل یادگیری: ${text}\n\n📚 تجربه قبلی در زبان فرانسه:`, experienceKeyboard);
       }
     } else if (state.step === 'experience') {
       if (text === '❌ ندارم') {
         state.data.experience = text;
         state.data.level = 'مبتدی';
         state.data.sessionsLeft = 10; // New students start with 10 sessions
         state.step = 'sessions_per_week';
         userStates.set(chatId, state);
         
         await bot.sendMessage(chatId, `تجربه: ${text}\n\n📚 تعداد کل جلسات: 10 (شروع جدید)\n\n📅 تعداد جلسات کلاس در هفته:`, sessionsPerWeekKeyboard);
       } else if (text === '✅ دارم') {
         state.data.experience = text;
         state.step = 'level';
         userStates.set(chatId, state);
         
         await bot.sendMessage(chatId, `تجربه: ${text}\n\n📊 سطح زبان فرانسه خود را انتخاب کنید:`, levelKeyboard);
       }
     } else if (state.step === 'level') {
       if (text && text !== '🔙 بازگشت به منوی اصلی') {
         state.data.level = text;
         state.step = 'total_sessions';
         userStates.set(chatId, state);
         
         await bot.sendMessage(chatId, `سطح: ${text}\n\n📚 تعداد کل جلسات ترم (1 تا 10):`, backKeyboard);
       }
     } else if (state.step === 'total_sessions') {
       const sessions = parseInt(text);
       if (sessions && sessions >= 1 && sessions <= 10) {
         state.data.sessionsLeft = sessions;
         state.step = 'sessions_per_week';
         userStates.set(chatId, state);
         
         await bot.sendMessage(chatId, `📚 تعداد کل جلسات: ${sessions}\n\n📅 تعداد جلسات در هفته:`, sessionsPerWeekKeyboard);
       } else {
         await bot.sendMessage(chatId, 'لطفاً عددی بین 1 تا 10 وارد کنید.', backKeyboard);
       }
     } else if (state.step === 'sessions_per_week') {
       if (text && text !== '🔙 بازگشت به منوی اصلی') {
         state.data.sessionsPerWeek = text;
         state.data.selectedDays = [];
         state.step = 'select_days';
         userStates.set(chatId, state);
         
         await bot.sendMessage(chatId, `تعداد جلسات: ${text}\n\n📅 روزهای هفته مورد نظر خود را انتخاب کنید (می‌توانید چند روز انتخاب کنید):`, weekdaysKeyboard);
       }
     } else if (state.step === 'select_days') {
       if (text === '✅ تأیید انتخاب روزها') {
         if (state.data.selectedDays.length === 0) {
           await bot.sendMessage(chatId, '❌ لطفاً حداقل یک روز انتخاب کنید یا "فرقی برام نداره" را بزنید.', weekdaysKeyboard);
         } else {
           state.step = 'select_times';
           userStates.set(chatId, state);
           
           await bot.sendMessage(chatId, `روزهای انتخاب شده: ${state.data.selectedDays.join(', ')}\n\n⏰ ساعت‌های ترجیحی خود را انتخاب کنید:`, timeSlotsKeyboard);
         }
       } else if (text === '🤷‍♀️ فرقی برام نداره') {
         state.data.selectedDays = ['فرقی برام نداره'];
         state.step = 'select_times';
         userStates.set(chatId, state);
         
         await bot.sendMessage(chatId, `روزهای انتخاب شده: فرقی برام نداره\n\n⏰ ساعت‌های ترجیحی خود را انتخاب کنید:`, timeSlotsKeyboard);
       } else if (['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنج شنبه'].includes(text)) {
         if (state.data.selectedDays.includes(text)) {
           state.data.selectedDays = state.data.selectedDays.filter(day => day !== text);
         } else {
           state.data.selectedDays.push(text);
         }
         userStates.set(chatId, state);
         
         const selectedText = state.data.selectedDays.length > 0 ? state.data.selectedDays.join(', ') : 'هیچ روزی انتخاب نشده';
         await bot.sendMessage(chatId, `روزهای انتخاب شده: ${selectedText}\n\nبرای ادامه "✅ تأیید انتخاب روزها" را بزنید.`, weekdaysKeyboard);
       }
     } else if (state.step === 'select_times') {
       if (text === '✅ تأیید انتخاب ساعات') {
         if (state.data.selectedTimes.length === 0) {
           await bot.sendMessage(chatId, '❌ لطفاً حداقل یک ساعت انتخاب کنید یا "فرقی برام نداره" را بزنید.', timeSlotsKeyboard);
         } else {
           state.step = 'additional_info';
           userStates.set(chatId, state);
           
           await bot.sendMessage(chatId, `ساعت‌های انتخاب شده: ${state.data.selectedTimes.join(', ')}\n\n📝 با تشکر از همکاری شما، اگر توضیح خاص و نیاز خاصی دارید لطفا در باکس زیر بنویسید:`, additionalInfoKeyboard);
         }
       } else if (text === '🤷‍♀️ فرقی برام نداره') {
         state.data.selectedTimes = ['فرقی برام نداره'];
         state.step = 'additional_info';
         userStates.set(chatId, state);
         
         await bot.sendMessage(chatId, `ساعت‌های انتخاب شده: فرقی برام نداره\n\n📝 با تشکر از همکاری شما، اگر توضیح خاص و نیاز خاصی دارید لطفا در باکس زیر بنویسید:`, additionalInfoKeyboard);
       } else if (['🌅 صبح 9 تا 12', '☀️ ظهر 12 تا 3', '🌆 بعد از ظهر 3 تا 6', '🌙 شب 6 تا 9'].includes(text)) {
         if (!state.data.selectedTimes) state.data.selectedTimes = [];
         if (state.data.selectedTimes.includes(text)) {
           state.data.selectedTimes = state.data.selectedTimes.filter(time => time !== text);
         } else {
           state.data.selectedTimes.push(text);
         }
         userStates.set(chatId, state);
         
         const selectedText = state.data.selectedTimes.length > 0 ? state.data.selectedTimes.join(', ') : 'هیچ ساعتی انتخاب نشده';
         await bot.sendMessage(chatId, `ساعت‌های انتخاب شده: ${selectedText}\n\nبرای ادامه "✅ تأیید انتخاب ساعات" را بزنید.`, timeSlotsKeyboard);
       }
     } else if (state.step === 'additional_info') {
       if (text === '⏭️ رد کردن') {
         state.data.additionalInfo = 'هیچ توضیح اضافی ارائه نشده';
       } else {
         state.data.additionalInfo = text.trim();
       }
       
       // Create new student
       const student = await prisma.student.create({
         data: {
           name: state.data.name,
           telegramId: state.data.telegramId,
           phoneNumber: state.data.phoneNumber,
           email: state.data.email,
           city: state.data.city,
           birthDate: state.data.birthDate,
           learningReason: state.data.learningReason,
           experience: state.data.experience,
           level: state.data.level,
           sessionsPerWeek: state.data.sessionsPerWeek,
           selectedDays: state.data.selectedDays.join(', '),
           selectedTimes: state.data.selectedTimes.join(', '),
           additionalInfo: state.data.additionalInfo,
           classType: 'private', // Default
           sessionsLeft: 0,
           paymentStatus: 'unpaid',
           registrationStatus: 'pending'
         }
       });
       
       // Clear user state
       userStates.delete(chatId);
       
       // Notify teacher with inline approve button
       const teacherId = '1955330844';
       const approveKeyboard = {
         inline_keyboard: [
           [{ text: '✅ تأیید ثبت‌نام', callback_data: `approve_student_${student.id}` }],
           [{ text: '❌ رد ثبت‌نام', callback_data: `reject_student_${student.id}` }]
         ]
       };
       
       await bot.sendMessage(teacherId, `🎓 ثبت‌نام دانشجوی جدید!
       
 📋 اطلاعات کامل:
 👤 نام: ${student.name}
 📱 تلفن: ${student.phoneNumber}
 📧 ایمیل: ${student.email}
 🏙️ شهر: ${student.city}
 📅 تاریخ تولد: ${student.birthDate}
 🎯 دلیل یادگیری: ${student.learningReason}
 📚 تجربه: ${student.experience}
 📊 سطح: ${student.level}
 📅 تعداد جلسات: ${student.sessionsPerWeek}
 📅 روزهای انتخاب شده: ${student.selectedDays}
 ⏰ ساعت‌های انتخاب شده: ${student.selectedTimes}
 📝 توضیحات اضافی: ${student.additionalInfo}
 🆔 تلگرام: ${student.telegramId}
 📅 زمان ثبت‌نام: ${student.createdAt.toLocaleString('fa-IR')}
 
 لطفاً وضعیت ثبت‌نام را بررسی کنید.`, approveKeyboard);
       
        const message = `✅ ثبت‌نام شما با موفقیت انجام شد!
 
 📋 اطلاعات شما:
 👤 نام: ${student.name}
 📱 تلفن: ${student.phoneNumber}
 📧 ایمیل: ${student.email}
 🏙️ شهر: ${student.city}
 📅 تاریخ تولد: ${student.birthDate}
 🎯 دلیل یادگیری: ${student.learningReason}
 📚 تجربه: ${student.experience}
 📊 سطح: ${student.level}
 📅 تعداد جلسات: ${student.sessionsPerWeek}
 📅 روزهای انتخاب شده: ${student.selectedDays}
 ⏰ ساعت‌های انتخاب شده: ${student.selectedTimes}
 
 ⏳ لطفاً منتظر پیام زهرا باشید. او به زودی با شما تماس خواهد گرفت.`;
       
       await bot.sendMessage(chatId, message, newUserMenuKeyboard);
     }
    
     // Handle question input
     if (state.step === 'question_input') {
       if (text && text.trim().length > 5) {
         const question = text.trim();
         
         // Find or create student
         let student = await prisma.student.findFirst({
           where: { telegramId: state.data.telegramId }
         });
         
         if (!student) {
           // Create temporary student for question
           student = await prisma.student.create({
             data: {
               name: state.data.firstName || 'کاربر',
               telegramId: state.data.telegramId,
               phoneNumber: null,
               classType: 'private',
               sessionsLeft: 0,
               paymentStatus: 'unpaid',
               registrationStatus: 'pending'
             }
           });
         }
         
         // Create question
         const questionRecord = await prisma.question.create({
           data: {
             studentId: student.id,
             question: question,
             status: 'pending'
           }
         });
         
         // Clear user state
         userStates.delete(chatId);
         
         // Notify teacher
         await notifyZahra(`❓ سوال جدید دریافت شد!
         
👤 از: ${student.name}
🆔 تلگرام: ${state.data.telegramId}
❓ سوال: ${question}
📅 زمان: ${questionRecord.createdAt.toLocaleString('fa-IR')}

لطفاً از منوی "💬 پاسخ به سوالات" پاسخ دهید.`);
         
         await bot.sendMessage(chatId, TEXTS.questionSent, newUserMenuKeyboard);
       } else {
         await bot.sendMessage(chatId, 'لطفاً سوال خود را کامل بنویسید (حداقل ۵ کاراکتر).', backKeyboard);
       }
     }
     
     
     
     // Handle student list (no action needed, handled by callback)
     if (state.step === 'student_list') {
       // Handle add student button in student list state
       if (text === '➕ اضافه کردن دانشجو') {
         userStates.set(chatId, { 
           step: 'add_student_name',
           data: {}
         });
         
         await bot.sendMessage(chatId, '👤 لطفاً نام و نام خانوادگی دانشجو را وارد کنید:', backKeyboard);
         return;
       }
       // This state is maintained until teacher clicks back
       return;
     }
     
     // Handle student actions
     if (state.step === 'student_actions') {
       if (text === '🔙 بازگشت به لیست') {
         userStates.delete(chatId);
         await bot.sendMessage(chatId, '🔙 بازگشت به منوی معلم', teacherMenuKeyboard);
       } else if (text === '👥 تشکیل گروه') {
         const student = state.data.selectedStudent;
         
         // Get all other group students with same level
         const otherStudents = await prisma.student.findMany({
           where: {
             classType: 'group',
             level: student.level,
             id: { not: student.id },
             registrationStatus: 'approved'
           },
           orderBy: { name: 'asc' }
         });
         
         if (otherStudents.length === 0) {
           await bot.sendMessage(chatId, `❌ هیچ دانشجوی گروهی دیگری با سطح ${student.level} یافت نشد.`, groupStudentActionsKeyboard);
         } else {
           let message = `👥 انتخاب دانشجو برای تشکیل گروه با ${student.name}:\n\n`;
           otherStudents.forEach((otherStudent, index) => {
             message += `${index + 1}. ${otherStudent.name}\n`;
             message += `   📱 تلفن: ${otherStudent.phoneNumber || 'ثبت نشده'}\n`;
             message += `   📘 جلسات باقی‌مانده: ${otherStudent.sessionsLeft}\n\n`;
           });
           
           userStates.set(chatId, { 
             step: 'select_group_partner',
             data: { 
               selectedStudent: student, 
               otherStudents 
             }
           });
           
           await bot.sendMessage(chatId, message + 'برای انتخاب دانشجو، شماره آن را ارسال کنید. برای لغو "لغو" بنویسید.', backKeyboard);
         }
       } else if (text === '📅 ویرایش تاریخ کلاس‌ها') {
         const student = state.data.selectedStudent;
         const bookings = await prisma.booking.findMany({
           where: { studentId: student.id },
           orderBy: { dateTime: 'asc' }
         });
         
         if (bookings.length === 0) {
           await bot.sendMessage(chatId, `📅 ${student.name} هیچ کلاس رزرو شده‌ای ندارد.`, studentActionsKeyboard);
         } else {
           let message = `📅 کلاس‌های ${student.name}:\n\n`;
           bookings.forEach((booking, index) => {
             const date = new Date(booking.dateTime);
             message += `${index + 1}. ${date.toLocaleString('fa-IR')}\n`;
             message += `   وضعیت: ${booking.status}\n\n`;
           });
           
           userStates.set(chatId, { 
             step: 'edit_class_dates',
             data: { selectedStudent: student, bookings }
           });
           
           await bot.sendMessage(chatId, message + 'برای حذف کلاس، شماره آن را ارسال کنید. برای لغو "لغو" بنویسید.', backKeyboard);
         }
       } else if (text === '💳 اطلاع‌رسانی پرداخت') {
         const student = state.data.selectedStudent;
         
         await bot.sendMessage(student.telegramId, `💳 اطلاع‌رسانی پرداخت

سلام ${student.name} عزیز!

⏰ زمان پرداخت جلسات شما فرا رسیده است.

📋 اطلاعات:
📘 جلسات باقی‌مانده: ${student.sessionsLeft}
💳 وضعیت پرداخت: ${student.paymentStatus === 'paid' ? 'پرداخت شده' : 'پرداخت نشده'}

لطفاً برای ادامه کلاس‌ها، پرداخت خود را انجام دهید.

با تشکر، زهرا`);
         
         await bot.sendMessage(chatId, `✅ اطلاع‌رسانی پرداخت برای ${student.name} ارسال شد.`, studentActionsKeyboard);
       } else if (text === '📝 دادن تکلیف اضافی') {
         const student = state.data.selectedStudent;
         
         userStates.set(chatId, { 
           step: 'give_homework',
           data: { selectedStudent: student }
         });
         
         await bot.sendMessage(chatId, `📝 دادن تکلیف اضافی به ${student.name}

لطفاً عنوان تکلیف را وارد کنید:`, backKeyboard);
       } else if (text === '📘 تغییر تعداد جلسات') {
         const student = state.data.selectedStudent;
         
         userStates.set(chatId, { 
           step: 'change_sessions',
           data: { selectedStudent: student }
         });
         
         await bot.sendMessage(chatId, `📘 تغییر تعداد جلسات ${student.name}

تعداد جلسات فعلی: ${student.sessionsLeft}

لطفاً تعداد جدید جلسات را وارد کنید:`, backKeyboard);
        } else if (text === '🔄 تغییر وضعیت پرداخت') {
          const student = state.data.selectedStudent;
          
          const newStatus = student.paymentStatus === 'paid' ? 'unpaid' : 'paid';
          
          await prisma.student.update({
            where: { id: student.id },
            data: { paymentStatus: newStatus }
          });
          
          await bot.sendMessage(chatId, `✅ وضعیت پرداخت ${student.name} به "${newStatus === 'paid' ? 'پرداخت شده' : 'پرداخت نشده'}" تغییر کرد.`, studentActionsKeyboard);
        } else if (text === '📚 تغییر نوع کلاس') {
          const student = state.data.selectedStudent;
          
          userStates.set(chatId, { 
            step: 'change_class_type',
            data: { selectedStudent: student }
          });
          
          await bot.sendMessage(chatId, `📚 تغییر نوع کلاس ${student.name}\n\nنوع فعلی: ${student.classType === 'private' ? 'خصوصی' : 'گروهی'}\n\nنوع جدید را انتخاب کنید:`, classTypeKeyboard);
        } else {
          await bot.sendMessage(chatId, '❌ لطفاً یکی از گزینه‌های منو را انتخاب کنید.', studentActionsKeyboard);
        }
     }
     
     // Handle edit class dates
     if (state.step === 'edit_class_dates') {
       if (text.toLowerCase() === 'لغو' || text.toLowerCase() === 'cancel') {
         userStates.set(chatId, { 
           step: 'student_actions',
           data: { selectedStudent: state.data.selectedStudent }
         });
         
         
         await bot.sendMessage(chatId, '🔙 بازگشت به منوی دانشجو', studentActionsKeyboard);
       } else if (text && !isNaN(parseInt(text))) {
         const index = parseInt(text) - 1;
         
         if (index >= 0 && index < state.data.bookings.length) {
           const booking = state.data.bookings[index];
           
           // Delete booking
           await prisma.booking.delete({
             where: { id: booking.id }
           });
           
           await bot.sendMessage(chatId, `✅ کلاس حذف شد:\n\n📅 ${new Date(booking.dateTime).toLocaleString('fa-IR')}`, backKeyboard);
         } else {
           await bot.sendMessage(chatId, '❌ شماره نامعتبر است. لطفاً شماره صحیح را وارد کنید.', backKeyboard);
         }
       } else {
         await bot.sendMessage(chatId, '❌ لطفاً شماره کلاس را وارد کنید.', backKeyboard);
       }
     }
     
     // Handle give homework
     if (state.step === 'give_homework') {
       if (text.toLowerCase() === 'لغو' || text.toLowerCase() === 'cancel') {
         userStates.set(chatId, { 
           step: 'student_actions',
           data: { selectedStudent: state.data.selectedStudent }
         });
         
         
         await bot.sendMessage(chatId, '🔙 بازگشت به منوی دانشجو', studentActionsKeyboard);
       } else if (text && text.trim().length > 3) {
         const student = state.data.selectedStudent;
         const title = text.trim();
         
         userStates.set(chatId, { 
           step: 'homework_description_teacher',
           data: { selectedStudent: student, title }
         });
         
         await bot.sendMessage(chatId, `📝 توضیحات تکلیف برای ${student.name}:

عنوان: ${title}

لطفاً توضیحات تکلیف را وارد کنید:`, backKeyboard);
       } else {
         await bot.sendMessage(chatId, '❌ لطفاً عنوان تکلیف را کامل وارد کنید.', backKeyboard);
       }
     }
     
     // Handle homework description from teacher
     if (state.step === 'homework_description_teacher') {
       if (text.toLowerCase() === 'لغو' || text.toLowerCase() === 'cancel') {
         userStates.set(chatId, { 
           step: 'student_actions',
           data: { selectedStudent: state.data.selectedStudent }
         });
         
         
         await bot.sendMessage(chatId, '🔙 بازگشت به منوی دانشجو', studentActionsKeyboard);
       } else if (text && text.trim().length > 5) {
         const student = state.data.selectedStudent;
         const title = state.data.title;
         const description = text.trim();
         
         // Create homework
         const homework = await prisma.homework.create({
           data: {
             studentId: student.id,
             title: title,
             description: description,
             status: 'submitted'
           }
         });
         
         // Notify student
         await bot.sendMessage(student.telegramId, `📝 تکلیف جدید از زهرا:

📝 عنوان: ${title}
📄 توضیحات: ${description}

🆔 کد تکلیف: ${homework.id}

لطفاً تکلیف را انجام داده و ارسال کنید.`);
         
         userStates.set(chatId, { 
           step: 'student_actions',
           data: { selectedStudent: student }
         });
         
         
         await bot.sendMessage(chatId, `✅ تکلیف برای ${student.name} ارسال شد:\n\n📝 ${title}`, studentActionsKeyboard);
       } else {
         await bot.sendMessage(chatId, '❌ لطفاً توضیحات تکلیف را کامل وارد کنید.', backKeyboard);
       }
     }
     
     // Handle change sessions
     if (state.step === 'change_sessions') {
       if (text.toLowerCase() === 'لغو' || text.toLowerCase() === 'cancel') {
         userStates.set(chatId, { 
           step: 'student_actions',
           data: { selectedStudent: state.data.selectedStudent }
         });
         
         
         await bot.sendMessage(chatId, '🔙 بازگشت به منوی دانشجو', studentActionsKeyboard);
       } else if (text && !isNaN(parseInt(text))) {
         const student = state.data.selectedStudent;
         const newSessions = parseInt(text);
         
         if (newSessions >= 0) {
           await prisma.student.update({
             where: { id: student.id },
             data: { sessionsLeft: newSessions }
           });
           
           userStates.set(chatId, { 
             step: 'student_actions',
             data: { selectedStudent: student }
           });
           
           
           await bot.sendMessage(chatId, `✅ تعداد جلسات ${student.name} به ${newSessions} تغییر کرد.`, studentActionsKeyboard);
         } else {
           await bot.sendMessage(chatId, '❌ تعداد جلسات نمی‌تواند منفی باشد.', backKeyboard);
         }
       } else {
         await bot.sendMessage(chatId, '❌ لطفاً تعداد جلسات را به صورت عدد وارد کنید.', backKeyboard);
       }
     }
     
     // Handle review existing students
     if (state.step === 'review_existing_students') {
       if (text.toLowerCase() === 'لغو' || text.toLowerCase() === 'cancel') {
         userStates.delete(chatId);
         await bot.sendMessage(chatId, '❌ بررسی دانش‌آموزان موجود لغو شد.', teacherMenuKeyboard);
       } else if (text && !isNaN(parseInt(text))) {
         const index = parseInt(text) - 1;
         
         if (index >= 0 && index < state.data.existingStudents.length) {
           const student = state.data.existingStudents[index];
           
           // Set state for approval flow
           userStates.set(chatId, {
             step: 'approve_existing_sessions',
             data: { studentId: student.id, student: student }
           });
           
           await bot.sendMessage(chatId, `📋 تأیید دانش‌آموز موجود: ${student.name}

📚 تعداد کل جلسات کلاس را وارد کنید:`, backKeyboard);
         } else {
           await bot.sendMessage(chatId, '❌ شماره نامعتبر است. لطفاً شماره صحیح را وارد کنید.', backKeyboard);
         }
       } else {
         await bot.sendMessage(chatId, '❌ لطفاً شماره دانش‌آموز را وارد کنید.', backKeyboard);
       }
       return;
     }

     // Handle approve students
     if (state.step === 'approve_students') {
       if (text.toLowerCase() === 'لغو' || text.toLowerCase() === 'cancel') {
         userStates.delete(chatId);
         await bot.sendMessage(chatId, '❌ تأیید ثبت‌نام لغو شد.', teacherMenuKeyboard);
       } else if (text && !isNaN(parseInt(text))) {
         const index = parseInt(text) - 1;
         
        if (index >= 0 && index < state.data.pendingStudents.length) {
          const student = state.data.pendingStudents[index];
           
           // Set state for approval flow
           userStates.set(chatId, {
             step: 'approve_sessions',
             data: { studentId: student.id, student: student }
           });
           
           await bot.sendMessage(chatId, `📋 تأیید دانش‌آموز: ${student.name}

📚 تعداد کل جلسات کلاس را وارد کنید:`, backKeyboard);
         } else {
           await bot.sendMessage(chatId, '❌ شماره نامعتبر است. لطفاً شماره صحیح را وارد کنید.', backKeyboard);
         }
       } else {
         await bot.sendMessage(chatId, '❌ لطفاً شماره دانشجو را وارد کنید.', backKeyboard);
       }
     }
     
     // Handle teacher response
     if (state.step === 'teacher_response') {
       if (text && text.includes(':')) {
         const parts = text.split(':');
         const questionIndex = parseInt(parts[0].trim()) - 1;
         const response = parts.slice(1).join(':').trim();
         
         if (questionIndex >= 0 && questionIndex < state.data.questions.length && response.length > 0) {
           const question = state.data.questions[questionIndex];
           
           // Update question with response
           await prisma.question.update({
             where: { id: question.id },
             data: {
               response: response,
               status: 'answered',
               answeredAt: new Date()
             }
           });
           
           // Send response to student
           await bot.sendMessage(question.student.telegramId, `💬 پاسخ زهرا به سوال شما:

❓ سوال شما: ${question.question}

💬 پاسخ: ${response}

📅 زمان پاسخ: ${new Date().toLocaleString('fa-IR')}`);
           
           // Clear teacher state
           userStates.delete(chatId);
           
           await bot.sendMessage(chatId, TEXTS.teacherResponseSent, teacherMenuKeyboard);
         } else {
           await bot.sendMessage(chatId, 'فرمت صحیح نیست. لطفاً به فرمت "شماره: پاسخ" ارسال کنید.', backKeyboard);
         }
       } else {
         await bot.sendMessage(chatId, 'لطفاً پاسخ خود را به فرمت "شماره: پاسخ" ارسال کنید.', backKeyboard);
       }
     }
     
     // Handle group partner selection
     if (state.step === 'select_group_partner') {
       if (text.toLowerCase() === 'لغو' || text.toLowerCase() === 'cancel') {
         userStates.set(chatId, { 
           step: 'student_actions',
           data: { selectedStudent: state.data.selectedStudent }
         });
         await bot.sendMessage(chatId, '❌ تشکیل گروه لغو شد.', groupStudentActionsKeyboard);
       } else {
         const partnerIndex = parseInt(text) - 1;
         if (partnerIndex >= 0 && partnerIndex < state.data.otherStudents.length) {
           const partner = state.data.otherStudents[partnerIndex];
           const student = state.data.selectedStudent;
           
           // Create group notification
           const groupMessage = `👥 گروه تشکیل شد!

🎉 ${student.name} و ${partner.name} اکنون یک گروه هستند.

📋 اطلاعات گروه:
👤 دانشجو ۱: ${student.name}
👤 دانشجو ۲: ${partner.name}
📊 سطح: ${student.level}
📚 نوع کلاس: گروهی

📅 کلاس‌های گروهی به زودی برنامه‌ریزی خواهد شد.

با تشکر، زهرا`;

           // Notify both students
           if (student.telegramId) {
             await bot.sendMessage(student.telegramId, groupMessage);
           }
           if (partner.telegramId) {
             await bot.sendMessage(partner.telegramId, groupMessage);
           }
           
           userStates.set(chatId, { 
             step: 'student_actions',
             data: { selectedStudent: student }
           });
           
           await bot.sendMessage(chatId, `✅ گروه ${student.name} و ${partner.name} تشکیل شد و هر دو دانشجو مطلع شدند.`, groupStudentActionsKeyboard);
         } else {
           await bot.sendMessage(chatId, '❌ لطفاً شماره معتبری وارد کنید.', backKeyboard);
         }
       }
     }
     
     // Handle change class type
     if (state.step === 'change_class_type') {
       if (text === '🔒 خصوصی' || text === '👥 گروهی') {
         const student = state.data.selectedStudent;
         const newClassType = text.includes('خصوصی') ? 'private' : 'group';
         
         await prisma.student.update({
           where: { id: student.id },
           data: { classType: newClassType }
         });
         
         userStates.set(chatId, { 
           step: 'student_actions',
           data: { selectedStudent: { ...student, classType: newClassType } }
         });
         
         const keyboard = newClassType === 'group' ? groupStudentActionsKeyboard : studentActionsKeyboard;
         await bot.sendMessage(chatId, `✅ نوع کلاس ${student.name} به "${text}" تغییر کرد.`, keyboard);
       } else {
         await bot.sendMessage(chatId, '❌ لطفاً نوع کلاس را انتخاب کنید.', classTypeKeyboard);
       }
     }
     
     // Handle add student flow
     if (state.step === 'add_student_name') {
       // Teacher adding student - name step
       userStates.set(chatId, { 
         step: 'add_student_phone',
         data: { name: text }
       });
       
       await bot.sendMessage(chatId, '📱 لطفاً شماره تلفن دانشجو را وارد کنید:', backKeyboard);
     } else if (state.step === 'add_student_phone') {
       // Teacher adding student - phone step
       userStates.set(chatId, { 
         step: 'add_student_class_type',
         data: { ...state.data, phoneNumber: text }
       });
       
       await bot.sendMessage(chatId, '📚 نوع کلاس را انتخاب کنید:', classTypeKeyboard);
     } else if (state.step === 'add_student_class_type') {
       // Teacher adding student - class type step
       const classType = text === '🔒 خصوصی' ? 'private' : 'group';
       userStates.set(chatId, { 
         step: 'add_student_level',
         data: { ...state.data, classType }
       });
       
       await bot.sendMessage(chatId, '📊 سطح دانشجو را انتخاب کنید:', levelKeyboard);
     } else if (state.step === 'add_student_level') {
       // Teacher adding student - level step
       let level = 'beginner';
       if (text === '🟡 متوسط (B1-B2)') level = 'intermediate';
       else if (text === '🔴 پیشرفته (C1-C2)') level = 'advanced';
       
       userStates.set(chatId, { 
         step: 'add_student_sessions',
         data: { ...state.data, level }
       });
       
       await bot.sendMessage(chatId, '📚 تعداد کل جلسات کلاس را وارد کنید:', backKeyboard);
     } else if (state.step === 'add_student_sessions') {
       // Teacher adding student - total sessions step
       const sessions = parseInt(text);
       if (isNaN(sessions) || sessions <= 0) {
         await bot.sendMessage(chatId, '❌ لطفاً تعداد جلسات معتبر وارد کنید (عدد مثبت).', backKeyboard);
         return;
       }
       
       state.data.sessionsLeft = sessions;
       state.step = 'add_student_sessions_per_week';
       userStates.set(chatId, state);
       
       await bot.sendMessage(chatId, `📚 تعداد کل جلسات: ${sessions}

📅 تعداد جلسات در هفته را وارد کنید:`, backKeyboard);
       return;
     }

     if (state && state.step === 'add_student_sessions_per_week') {
       const sessionsPerWeek = parseInt(text);
       if (isNaN(sessionsPerWeek) || sessionsPerWeek <= 0) {
         await bot.sendMessage(chatId, '❌ لطفاً تعداد جلسات در هفته معتبر وارد کنید (عدد مثبت).', backKeyboard);
         return;
       }
       
       state.data.sessionsPerWeek = sessionsPerWeek;
       state.data.selectedDays = [];
       state.data.classTimes = [];
       state.step = 'add_student_select_days';
       userStates.set(chatId, state);
       
       await bot.sendMessage(chatId, `📅 جلسات در هفته: ${sessionsPerWeek}

📅 روزهای کلاس را انتخاب کنید (${sessionsPerWeek} روز):`, teacherWeekdaysKeyboard);
     }

     if (state && state.step === 'add_student_select_days') {
       if (text === '✅ تأیید انتخاب روزها') {
         if (state.data.selectedDays.length === state.data.sessionsPerWeek) {
           state.step = 'add_student_class_times';
           state.data.currentDayIndex = 0;
           userStates.set(chatId, state);
           
           const currentDay = state.data.selectedDays[0];
           await bot.sendMessage(chatId, `📅 روزهای انتخاب شده: ${state.data.selectedDays.join(', ')}

⏰ ساعت کلاس برای ${currentDay} را وارد کنید (مثال: 18:00):`, backKeyboard);
         } else {
           await bot.sendMessage(chatId, `❌ لطفاً دقیقاً ${state.data.sessionsPerWeek} روز انتخاب کنید.`, teacherWeekdaysKeyboard);
         }
       } else if (['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنج شنبه'].includes(text)) {
         if (state.data.selectedDays.includes(text)) {
           state.data.selectedDays = state.data.selectedDays.filter(day => day !== text);
         } else if (state.data.selectedDays.length < state.data.sessionsPerWeek) {
           state.data.selectedDays.push(text);
         }
         userStates.set(chatId, state);
         
         const selectedText = state.data.selectedDays.length > 0 ? state.data.selectedDays.join(', ') : 'هیچ روزی انتخاب نشده';
         await bot.sendMessage(chatId, `روزهای انتخاب شده: ${selectedText}\n\nبرای ادامه "✅ تأیید انتخاب روزها" را بزنید.`, teacherWeekdaysKeyboard);
       }
       return;
     }

     if (state && state.step === 'add_student_class_times') {
       const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
       if (timePattern.test(text)) {
         const currentDay = state.data.selectedDays[state.data.currentDayIndex];
         state.data.classTimes.push({ day: currentDay, time: text });
         state.data.currentDayIndex++;
         
         if (state.data.currentDayIndex < state.data.selectedDays.length) {
           const nextDay = state.data.selectedDays[state.data.currentDayIndex];
           userStates.set(chatId, state);
           await bot.sendMessage(chatId, `⏰ ساعت کلاس برای ${currentDay}: ${text}

⏰ ساعت کلاس برای ${nextDay} را وارد کنید (مثال: 18:00):`, backKeyboard);
         } else {
           state.step = 'add_student_payment_status';
           userStates.set(chatId, state);
           
           const timesText = state.data.classTimes.map(ct => `${ct.day}: ${ct.time}`).join('\n');
           await bot.sendMessage(chatId, `⏰ ساعت‌های کلاس:
${timesText}

💳 وضعیت پرداخت دانش‌آموز:`, paymentStatusKeyboard);
         }
       } else {
         await bot.sendMessage(chatId, 'لطفاً ساعت معتبر وارد کنید (مثال: 18:00).', backKeyboard);
       }
       return;
     }

     if (state && state.step === 'add_student_payment_status') {
       if (text === '✅ پرداخت شده' || text === '❌ پرداخت نشده') {
         const paymentStatus = text === '✅ پرداخت شده' ? 'paid' : 'unpaid';
         
         try {
           // Create student
           const student = await prisma.student.create({
             data: {
               name: state.data.name,
               phoneNumber: state.data.phoneNumber,
               classType: state.data.classType,
               level: state.data.level,
               sessionsLeft: state.data.sessionsLeft,
               paymentStatus: paymentStatus,
               classSchedule: JSON.stringify(state.data.classTimes),
               registrationStatus: 'approved',
               telegramId: null // Will be set when student registers
             }
           });
           
           // Generate class schedule
           await generateClassSchedule(student.id, state.data.classTimes);
           
           userStates.delete(chatId);
           const timesText = state.data.classTimes.map(ct => `${ct.day}: ${ct.time}`).join('\n');
           await bot.sendMessage(chatId, `✅ دانشجو با موفقیت اضافه شد!

📋 اطلاعات دانشجو:
👤 نام: ${student.name}
📱 تلفن: ${student.phoneNumber}
📚 نوع کلاس: ${student.classType}
📊 سطح: ${student.level}
📚 تعداد کل جلسات: ${student.sessionsLeft}
📅 جلسات در هفته: ${state.data.sessionsPerWeek}
📅 روزهای کلاس: ${state.data.selectedDays.join(', ')}
⏰ ساعت‌های کلاس:
${timesText}
💳 وضعیت پرداخت: ${text}`, teacherMenuKeyboard);
         } catch (error) {
           console.error('Error creating student:', error);
           await bot.sendMessage(chatId, '❌ خطا در ایجاد دانشجو. لطفاً دوباره تلاش کنید.', teacherMenuKeyboard);
         }
       } else {
         await bot.sendMessage(chatId, 'لطفاً وضعیت پرداخت را انتخاب کنید.', paymentStatusKeyboard);
       }
       return;
     }
     
     // Handle homework flow
     if (state.step === 'homework_title') {
      if (text.toLowerCase() === 'رد کردن' || text.toLowerCase() === 'skip') {
        state.data.title = null;
      } else {
        state.data.title = text.trim();
      }
      state.step = 'homework_description';
      userStates.set(chatId, state);
      
      await bot.sendMessage(chatId, TEXTS.homeworkDescription, backKeyboard);
    } else if (state.step === 'homework_description') {
      state.data.description = text.trim();
      
      // Create homework submission
      const homework = await prisma.homework.create({
        data: {
          studentId: state.data.studentId,
          title: state.data.title,
          description: state.data.description,
          status: 'submitted'
        }
      });
      
      // Clear user state
      userStates.delete(chatId);
      
      // Notify teacher
      await notifyZahra(`📝 تکلیف جدید دریافت شد!
      
🆔 کد تکلیف: ${homework.id}
👤 دانشجو: ${state.data.studentId}
📝 عنوان: ${homework.title || 'بدون عنوان'}
📄 توضیحات: ${homework.description}
📅 زمان ارسال: ${homework.submittedAt.toLocaleString('fa-IR')}`);
      
      await bot.sendMessage(chatId, `${TEXTS.homeworkComplete}\n\n🆔 کد تکلیف: ${homework.id}`, studentMenuKeyboard);
    }
    
  } catch (error) {
    console.error('Error handling message:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
    try {
      await bot.sendMessage(chatId, 'خطا در سیستم. لطفاً دوباره تلاش کنید.');
    } catch (sendError) {
      console.error('Error sending error message:', sendError);
    }
    userStates.delete(chatId);
  }
});

// Handle menu buttons
async function handleMenuButtons(chatId, text, msg, state) {
  try {
    // Student menu buttons
    if (text === '📘 تعداد جلسات باقی‌مانده') {
      const student = await prisma.student.findFirst({
        where: { telegramId: chatId.toString() }
      });
      
      if (student) {
        const message = `📘 جلسات باقی‌مانده شما: ${student.sessionsLeft}\n\n💳 وضعیت پرداخت: ${student.paymentStatus === 'paid' ? 'پرداخت شده ✅' : 'پرداخت نشده ❌'}\n📚 نوع کلاس: ${student.classType === 'private' ? 'خصوصی' : 'گروهی'}`;
        await bot.sendMessage(chatId, message, studentMenuKeyboard);
      }
    } else if (text === '📝 مشق هام رو نوشتم و میخوام چک بشه') {
      const student = await prisma.student.findFirst({
        where: { telegramId: chatId.toString() }
      });
      
      if (student) {
        // Notify teacher immediately
        const teacherId = '1955330844';
        const homeworkMessage = `📝 تکلیف جدید

👤 دانشجو: ${student.name}
📱 تلفن: ${student.phoneNumber || 'نامشخص'}
📚 نوع کلاس: ${student.classType === 'private' ? 'خصوصی' : 'گروهی'}

دانشجو اعلام کرده که تکلیف خود را انجام داده و می‌خواهد در Google Docs بررسی شود.

لطفاً Google Docs را بررسی کنید.`;
        
        await bot.sendMessage(teacherId, homeworkMessage);
        
        // Confirm to student
        await bot.sendMessage(chatId, '✅ متشکریم! زهرا از تکلیف شما مطلع شد و به زودی در Google Docs بررسی خواهد کرد.', studentMenuKeyboard);
      }
    } else if (text === '📅 مشاهده تاریخ و ساعت کلاس‌ها') {
      const student = await prisma.student.findFirst({
        where: { telegramId: chatId.toString() }
      });
      
      if (student) {
        // Get upcoming classes
        const upcomingClasses = await prisma.class.findMany({
          where: {
            studentId: student.id,
            status: 'scheduled',
            date: { gte: new Date() }
          },
          orderBy: { date: 'asc' },
          take: 10
        });
        
        if (upcomingClasses.length > 0) {
          let message = `📅 کلاس‌های آینده شما:\n\n📚 جلسات باقی‌مانده: ${student.sessionsLeft}\n\n`;
          upcomingClasses.forEach((classRecord, index) => {
            const date = new Date(classRecord.date);
            const dateStr = date.toLocaleDateString('fa-IR');
            const timeStr = date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
            message += `${index + 1}. ${classRecord.day} - ${classRecord.time}\n`;
            message += `   📅 ${dateStr} - ${timeStr}\n`;
            if (classRecord.attendance) {
              message += `   ✅ حضور: ${classRecord.attendance === 'attending' ? 'می‌آیم' : 'نمی‌آیم'}\n`;
            }
            message += '\n';
          });
          await bot.sendMessage(chatId, message, studentMenuKeyboard);
        } else {
          await bot.sendMessage(chatId, `📅 در حال حاضر کلاس آینده‌ای برنامه‌ریزی نشده است.\n\n📚 جلسات باقی‌مانده: ${student.sessionsLeft}`, studentMenuKeyboard);
        }
      }
    } else if (text === '📚 دریافت کتاب') {
      const student = await prisma.student.findFirst({
        where: { telegramId: chatId.toString() }
      });
      
      if (student) {
        await bot.sendMessage(chatId, '📚 کتاب مورد نظر خود را انتخاب کنید:', bookKeyboard);
      }
    }
    
    // New user menu buttons
    else if (text === '🎯 رزرو کلاس آزمایشی') {
      // This is now handled in the main message handler
      return;
    } else if (text === '👨‍🎓 از قبل دانشآموز زهرا هستم') {
      userStates.set(chatId, {
        step: 'existing_student_name',
        data: {}
      });
      await bot.sendMessage(chatId, '👨‍🎓 از قبل دانشآموز زهرا هستم\n\n👤 لطفاً نام کامل خود را وارد کنید:', backKeyboard);
      return;
    } else if (text === '📋 مشاهده شرایط') {
      await bot.sendMessage(chatId, TEXTS.conditions, newUserMenuKeyboard);
    } else if (text === '🎓 شیوه تدریس چجوریه؟') {
      await bot.sendMessage(chatId, TEXTS.teachingMethod, newUserMenuKeyboard);
     } else if (text === '👩‍🏫 آشنایی با معلم (زهرا)') {
       await bot.sendMessage(chatId, TEXTS.teacherInfo, newUserMenuKeyboard);
     } else if (text === '❓ سوال دارم') {
       userStates.set(chatId, { 
         step: 'question_input',
         data: { 
           telegramId: chatId.toString(),
           firstName: msg?.from?.first_name || '',
           userId: msg?.from?.id || chatId
         }
       });
       
       await bot.sendMessage(chatId, TEXTS.questionRequest, backKeyboard);
     }
    
     // Teacher menu buttons
     else if (text === '👥 مشاهده دانش‌آموزان') {
       if (chatId.toString() === '1955330844') {
         const students = await prisma.student.findMany({
           where: { registrationStatus: 'approved' },
           orderBy: { name: 'asc' }
         });
         
         if (students.length === 0) {
           await bot.sendMessage(chatId, '👥 هیچ دانش‌آموز تأیید شده‌ای وجود ندارد.', teacherMenuKeyboard);
         } else {
           let message = '👥 لیست دانش‌آموزان تأیید شده:\n\n';
           const inlineKeyboard = [];
           
           students.forEach((student, index) => {
             message += `${index + 1}. ${student.name}\n`;
             message += `   📱 تلفن: ${student.phoneNumber || 'ثبت نشده'}\n`;
             message += `   📚 نوع کلاس: ${student.classType === 'private' ? 'خصوصی' : 'گروهی'}\n`;
             message += `   📘 جلسات باقی‌مانده: ${student.sessionsLeft}\n`;
             message += `   💳 وضعیت پرداخت: ${student.paymentStatus === 'paid' ? 'پرداخت شده' : 'پرداخت نشده'}\n\n`;
             
             inlineKeyboard.push([{
               text: `👤 ${student.name}`,
               callback_data: `select_student_${student.id}`
             }]);
           });
           
           const keyboard = {
             reply_markup: {
               inline_keyboard: inlineKeyboard
             }
           };
           
           userStates.set(chatId, { 
             step: 'student_list',
             data: { students }
           });
           
           await bot.sendMessage(chatId, message + 'برای انتخاب دانشجو، روی نام آن کلیک کنید:', keyboard);
         }
       }
     } else if (text === '💬 پاسخ به سوالات') {
       if (chatId.toString() === '1955330844') {
         // Get pending questions
         const questions = await prisma.question.findMany({
           where: { status: 'pending' },
           include: { student: true },
           orderBy: { createdAt: 'asc' }
         });
         
         if (questions.length === 0) {
           await bot.sendMessage(chatId, '❓ هیچ سوالی در انتظار پاسخ نیست.', teacherMenuKeyboard);
         } else {
           let message = '❓ سوالات در انتظار پاسخ:\n\n';
           questions.forEach((question, index) => {
             message += `${index + 1}. از: ${question.student.name}\n`;
             message += `   سوال: ${question.question}\n`;
             message += `   زمان: ${question.createdAt.toLocaleString('fa-IR')}\n\n`;
           });
           
           userStates.set(chatId, { 
             step: 'teacher_response',
             data: { questions }
           });
           
           await bot.sendMessage(chatId, message + 'لطفاً شماره سوال و پاسخ خود را به فرمت "شماره: پاسخ" ارسال کنید.', backKeyboard);
        }
      }
    }

    if (text === '➕ اضافه کردن دانشجو') {
       if (chatId.toString() === '1955330844') {
         userStates.set(chatId, { 
           step: 'add_student_name',
           data: {}
         });
         
         await bot.sendMessage(chatId, '👤 لطفاً نام و نام خانوادگی دانشجو را وارد کنید:', backKeyboard);
       }
     } else if (text === '✅ تأیید ثبت‌نام‌ها') {
       if (chatId.toString() === '1955330844') {
         const pendingStudents = await prisma.student.findMany({
           where: { registrationStatus: 'pending' },
           orderBy: { createdAt: 'asc' }
         });
         
         if (pendingStudents.length === 0) {
           await bot.sendMessage(chatId, '✅ هیچ ثبت‌نامی در انتظار تأیید نیست.', teacherMenuKeyboard);
         } else {
           let message = '⏳ ثبت‌نام‌های در انتظار تأیید:\n\n';
           pendingStudents.forEach((student, index) => {
             message += `${index + 1}. ${student.name}\n`;
             message += `   📱 تلفن: ${student.phoneNumber || 'ثبت نشده'}\n`;
             message += `   📚 نوع کلاس: ${student.classType === 'private' ? 'خصوصی' : 'گروهی'}\n`;
             message += `   🆔 تلگرام: ${student.telegramId}\n`;
             message += `   📅 زمان ثبت‌نام: ${student.createdAt.toLocaleString('fa-IR')}\n\n`;
           });
           
           userStates.set(chatId, { 
             step: 'approve_students',
             data: { pendingStudents }
           });
           
           await bot.sendMessage(chatId, message + 'برای تأیید یک دانشجو، شماره آن را ارسال کنید. برای لغو "لغو" بنویسید.', backKeyboard);
         }
       }
     }
    
  } catch (error) {
    console.error('Error handling menu buttons:', error);
    await bot.sendMessage(chatId, 'خطا در سیستم. لطفاً دوباره تلاش کنید.');
  }
}

// Send class reminder
async function sendClassReminder(classId) {
  try {
    const classRecord = await prisma.class.findUnique({
      where: { id: classId },
      include: { student: true }
    });
    
    if (!classRecord || !classRecord.student.telegramId) {
      return;
    }
    
    const classDate = new Date(classRecord.date);
    const dateStr = classDate.toLocaleDateString('fa-IR');
    const timeStr = classDate.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    
    const message = `🔔 یادآوری کلاس - 10 دقیقه تا شروع

📚 کلاس زبان فرانسه شما:
📅 تاریخ: ${dateStr}
⏰ ساعت: ${timeStr}
📝 روز: ${classRecord.day}

🔗 لینک کلاس: https://meet.google.com/emb-fhpm-gwp

لطفاً 5 دقیقه قبل از شروع کلاس آماده باشید.

آیا در کلاس شرکت می‌کنید؟`;
    
    await bot.sendMessage(classRecord.student.telegramId, message, attendanceKeyboard);
    
    // Notify teacher about upcoming class
    const teacherId = '1955330844';
    const teacherMessage = `📚 یادآوری کلاس

👤 دانشجو: ${classRecord.student.name}
📅 ${classRecord.day} - ${classRecord.time}
📱 تلفن: ${classRecord.student.phoneNumber || 'نامشخص'}

کلاس در 5 دقیقه شروع می‌شود.`;
    
    await bot.sendMessage(teacherId, teacherMessage);
    
    // Mark reminder as sent
    await prisma.class.update({
      where: { id: classId },
      data: { reminderSent: true }
    });
    
    console.log(`Reminder sent for class ${classId} to student ${classRecord.student.name}`);
  } catch (error) {
    console.error('Error sending class reminder:', error);
  }
}

// Send class review
async function sendClassReview(classId) {
  try {
    const classRecord = await prisma.class.findUnique({
      where: { id: classId },
      include: { student: true }
    });
    
    if (!classRecord || !classRecord.student.telegramId) {
      console.log(`No class or student found for review ${classId}`);
      return;
    }
    
    const message = `📝 نظرسنجی کلاس

📅 ${classRecord.day} - ${classRecord.time}

لطفاً نظرات خود را درباره کلاس امروز ارسال کنید:
- کیفیت تدریس
- مفید بودن مطالب
- پیشنهادات

نظر شما برای بهبود کلاس‌ها مهم است! 🙏`;
    
    await bot.sendMessage(classRecord.student.telegramId, message);
    
    // Set state for review collection
    userStates.set(classRecord.student.telegramId, {
      step: 'class_review',
      data: { classId: classId }
    });
    
    // Mark review as sent
    await prisma.class.update({
      where: { id: classId },
      data: { reviewSent: true }
    });
    
    console.log(`Review sent for class ${classId} to student ${classRecord.student.name}`);
  } catch (error) {
    console.error('Error sending class review:', error);
  }
}

// Check for classes that need reminders
async function checkClassReminders() {
  try {
    const now = new Date();
    const reminderTime = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes from now
    
    // Find classes that need reminders (10 minutes before class time)
    const classesNeedingReminders = await prisma.class.findMany({
      where: {
        status: 'scheduled',
        reminderSent: false,
        date: {
          gte: now,
          lte: reminderTime
        }
      }
    });
    
    for (const classRecord of classesNeedingReminders) {
      await sendClassReminder(classRecord.id);
    }
    
    // Find classes that need reviews (1.5 hours after class time)
    const reviewTime = new Date(now.getTime() - 90 * 60 * 1000); // 1.5 hours ago
    const classesNeedingReviews = await prisma.class.findMany({
      where: {
        status: 'scheduled',
        reviewSent: false,
        date: {
          lte: reviewTime
        }
      }
    });
    
    for (const classRecord of classesNeedingReviews) {
      await sendClassReview(classRecord.id);
    }
    
  } catch (error) {
    console.error('Error checking class reminders:', error);
  }
}

// Generate class schedule for a student
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
    const totalSessions = student.sessionsLeft;
    let sessionCount = 0;
    
    // Start from today or the provided start date
    let currentDate = new Date(startDate);
    
    // Persian day names to JavaScript day indices (0=Sunday, 1=Monday, etc.)
    const persianToJS = {
      'یکشنبه': 1,    // Monday
      'دوشنبه': 2,    // Tuesday  
      'سه شنبه': 3,   // Wednesday
      'چهارشنبه': 4,  // Thursday
      'پنج شنبه': 5,  // Friday
      'جمعه': 6,      // Saturday
      'شنبه': 0       // Sunday
    };
    
    console.log('Generating classes for student:', studentId);
    console.log('Class times:', classTimes);
    console.log('Total sessions:', totalSessions);
    
    // Generate classes for the next 20 weeks
    for (let week = 0; week < 20 && sessionCount < totalSessions; week++) {
      for (const classTime of classTimes) {
        if (sessionCount >= totalSessions) break;
        
        const targetDayIndex = persianToJS[classTime.day];
        if (targetDayIndex === undefined) continue;
        
        // Find the next occurrence of this day
        const classDate = new Date(currentDate);
        const currentDayIndex = classDate.getDay();
        
        // Calculate days to add to reach the target day
        let daysToAdd = targetDayIndex - currentDayIndex;
        if (daysToAdd < 0) {
          daysToAdd += 7;
        }
        
        // Add the week offset
        daysToAdd += (week * 7);
        
        // Create a new date to avoid mutation
        const finalDate = new Date(currentDate);
        finalDate.setDate(finalDate.getDate() + daysToAdd);
        
        // Set the time
        const [hours, minutes] = classTime.time.split(':').map(Number);
        finalDate.setHours(hours, minutes, 0, 0);
        
        // Validate the date
        if (isNaN(finalDate.getTime())) {
          console.error(`Invalid date generated for ${classTime.day} ${classTime.time}`);
          continue;
        }
        
        console.log(`Generated class: ${classTime.day} ${classTime.time} -> ${finalDate.toISOString()}`);
        
        classes.push({
          studentId: studentId,
          day: classTime.day,
          time: classTime.time,
          date: finalDate,
          status: 'scheduled'
        });
        
        sessionCount++;
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

// Handle book selection
async function handleBookSelection(chatId, text) {
  try {
    const student = await prisma.student.findFirst({
      where: { telegramId: chatId.toString() }
    });
    
    if (!student) {
      await bot.sendMessage(chatId, 'لطفاً ابتدا با /start شروع کنید.', newUserMenuKeyboard);
      return;
    }
    
    let bookInfo = '';
    let downloadLink = '';
    
    switch (text) {
      case '📖 کتاب فرانسوی سطح ۱':
        bookInfo = '📖 کتاب فرانسوی سطح ۱\n\nاین کتاب برای مبتدیان طراحی شده است.';
        downloadLink = 'https://example.com/french-level1.pdf';
        break;
      case '📖 کتاب فرانسوی سطح ۲':
        bookInfo = '📖 کتاب فرانسوی سطح ۲\n\nاین کتاب برای سطح متوسط طراحی شده است.';
        downloadLink = 'https://example.com/french-level2.pdf';
        break;
      case '📖 کتاب فرانسوی سطح ۳':
        bookInfo = '📖 کتاب فرانسوی سطح ۳\n\nاین کتاب برای سطح پیشرفته طراحی شده است.';
        downloadLink = 'https://example.com/french-level3.pdf';
        break;
      case '📖 کتاب گرامر فرانسوی':
        bookInfo = '📖 کتاب گرامر فرانسوی\n\nاین کتاب شامل قواعد کامل گرامر فرانسوی است.';
        downloadLink = 'https://example.com/french-grammar.pdf';
        break;
    }
    
    const message = `${bookInfo}\n\n📥 لینک دانلود:\n${downloadLink}\n\n💡 لطفاً کتاب را دانلود کرده و برای کلاس آماده کنید.`;
    
    await bot.sendMessage(chatId, message, studentMenuKeyboard);
  } catch (error) {
    console.error('Error in book selection:', error);
    await bot.sendMessage(chatId, 'خطا در دریافت کتاب. لطفاً دوباره تلاش کنید.', studentMenuKeyboard);
  }
}

// Handle callback queries (inline buttons)
bot.on('callback_query', async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;
  const messageId = callbackQuery.message.message_id;
  
  try {
    // Answer callback query
    await bot.answerCallbackQuery(callbackQuery.id);
    
    // Handle class cancellation
    if (data.startsWith('cancel_class_')) {
      try {
        const classId = parseInt(data.replace('cancel_class_', ''));
        const student = await prisma.student.findFirst({
          where: { telegramId: chatId.toString() }
        });
        
        if (!student) {
          await bot.sendMessage(chatId, '❌ دانش‌آموز یافت نشد.', studentMenuKeyboard);
          return;
        }
        
        const classRecord = await prisma.class.findUnique({
          where: { id: classId },
          include: { student: true }
        });
        
        if (!classRecord) {
          await bot.sendMessage(chatId, '❌ کلاس یافت نشد.', studentMenuKeyboard);
          return;
        }
        
        // Check if cancellation is at least 24 hours before class
        const now = new Date();
        const classTime = new Date(classRecord.date);
        const timeDiff = classTime.getTime() - now.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          await bot.sendMessage(chatId, '❌ کنسل کردن باید حداقل ۲۴ ساعت قبل از کلاس انجام شود.', studentMenuKeyboard);
          return;
        }
        
        // Update class status to cancelled
        await prisma.class.update({
          where: { id: classId },
          data: { status: 'cancelled' }
        });
        
        // Notify teacher
        const teacherId = '1955330844';
        const dateStr = classTime.toLocaleDateString('fa-IR');
        const timeStr = classTime.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
        
        const notificationMessage = `❌ کنسل کردن کلاس

👤 دانشجو: ${student.name}
📅 ${classRecord.day} ${dateStr} - ${timeStr}
📱 تلفن: ${student.phoneNumber || 'نامشخص'}

دانشجو کلاس را کنسل کرده است و لینک تعیین زمان جبرانی برای او ارسال شده است. منتظر انتخاب زمان جدید از طرف دانشجو باشید.`;
        
        await bot.sendMessage(teacherId, notificationMessage);
        
        await bot.sendMessage(chatId, `✅ کلاس ${classRecord.day} ${dateStr} - ${timeStr} کنسل شد.

📅 لطفاً برای تعیین زمان جبرانی از لینک زیر استفاده کنید:

🔗 https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ0NtoUdys7OfznfPZvLtIq68BWM3_CZ3Vk8ZKSo8iEsuxtEasuumNXB3s9LEcdt37oAl5R1i-bA

⏰ پس از انتخاب زمان جدید، زهرا با شما تماس خواهد گرفت.`, studentMenuKeyboard);
      } catch (error) {
        console.error('Error handling class cancellation:', error);
        await bot.sendMessage(chatId, '❌ خطا در سیستم.', studentMenuKeyboard);
      }
      return;
    }
    
    // Handle back to student menu
    if (data === 'back_to_student_menu') {
      await bot.sendMessage(chatId, '🔙 بازگشت به منوی دانش‌آموز', studentMenuKeyboard);
      return;
    }
    
    // Handle back to teacher menu
    if (data === 'back_to_teacher_menu') {
      await bot.sendMessage(chatId, '🔙 بازگشت به منوی معلم', teacherMenuKeyboard);
      return;
    }
    
    // Handle teacher class cancellation
    if (data.startsWith('teacher_cancel_class_')) {
      try {
        const classId = parseInt(data.replace('teacher_cancel_class_', ''));
        
        const classRecord = await prisma.class.findUnique({
          where: { id: classId },
          include: { student: true }
        });
        
        if (!classRecord) {
          await bot.sendMessage(chatId, '❌ کلاس یافت نشد.', teacherMenuKeyboard);
          return;
        }
        
        // Update class status to cancelled
        await prisma.class.update({
          where: { id: classId },
          data: { status: 'cancelled' }
        });
        
        // Notify student
        if (classRecord.student.telegramId) {
          const dateStr = new Date(classRecord.date).toLocaleDateString('fa-IR');
          const timeStr = new Date(classRecord.date).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
          
          const studentMessage = `❌ کنسل کردن کلاس

📅 کلاس ${classRecord.day} ${dateStr} - ${timeStr} توسط زهرا کنسل شد.

📅 لطفاً برای تعیین زمان جبرانی از لینک زیر استفاده کنید:

🔗 https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ0NtoUdys7OfznfPZvLtIq68BWM3_CZ3Vk8ZKSo8iEsuxtEasuumNXB3s9LEcdt37oAl5R1i-bA

⏰ پس از انتخاب زمان جدید، زهرا با شما تماس خواهد گرفت.`;
          
          await bot.sendMessage(classRecord.student.telegramId, studentMessage);
        }
        
        const dateStr = new Date(classRecord.date).toLocaleDateString('fa-IR');
        const timeStr = new Date(classRecord.date).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
        
        await bot.sendMessage(chatId, `✅ کلاس ${classRecord.student.name} - ${classRecord.day} ${dateStr} - ${timeStr} کنسل شد.

📅 لینک تعیین زمان جبرانی برای دانشجو ارسال شد.`, teacherMenuKeyboard);
      } catch (error) {
        console.error('Error handling teacher class cancellation:', error);
        await bot.sendMessage(chatId, '❌ خطا در سیستم.', teacherMenuKeyboard);
      }
      return;
    }
    
    // Handle attendance responses
    if (data === 'attending' || data === 'not_attending') {
      console.log(`Attendance response: ${data} from ${chatId}`);
      
      // Find the class this attendance is for
      const student = await prisma.student.findFirst({
        where: { telegramId: chatId.toString() }
      });
      
      if (student) {
        console.log(`Found student: ${student.name}`);
        
        // Find the most recent class that needs attendance (within 2 hours window)
        const now = new Date();
        const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
        const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
        
        console.log(`Looking for class between ${twoHoursAgo.toISOString()} and ${twoHoursFromNow.toISOString()}`);
        
        const classRecord = await prisma.class.findFirst({
          where: {
            studentId: student.id,
            status: 'scheduled',
            attendance: null,
            date: {
              gte: twoHoursAgo,
              lte: twoHoursFromNow
            }
          },
          orderBy: { date: 'asc' }
        });
        
        if (classRecord) {
          console.log(`Found class: ${classRecord.day} ${classRecord.time}`);
          
          // Update attendance
          await prisma.class.update({
            where: { id: classRecord.id },
            data: { attendance: data }
          });
          
          if (data === 'attending') {
            await bot.sendMessage(chatId, '✅ متشکریم! منتظر شما در کلاس هستیم. 🎓');
            
            // Notify teacher about attendance confirmation
            const teacherId = '1955330844';
            await bot.sendMessage(teacherId, `✅ تأیید حضور

👤 دانشجو: ${student.name}
📅 ${classRecord.day} - ${classRecord.time}
📱 تلفن: ${student.phoneNumber || 'نامشخص'}

دانشجو تأیید کرده که در کلاس شرکت خواهد کرد.`);
          } else {
            await bot.sendMessage(chatId, '❌ متأسفیم که نمی‌توانید در کلاس شرکت کنید. امیدواریم دفعه بعد ببینیم‌تان!');
            
            // Notify teacher
            const teacherId = '1955330844';
            await bot.sendMessage(teacherId, `⚠️ اطلاع‌رسانی عدم حضور

👤 دانشجو: ${student.name}
📅 ${classRecord.day} - ${classRecord.time}
📱 تلفن: ${student.phoneNumber || 'نامشخص'}

دانشجو اعلام کرده که در کلاس شرکت نمی‌کند.`);
          }
        } else {
          console.log('No class found for attendance response');
          await bot.sendMessage(chatId, '❌ کلاس مناسبی برای پاسخ یافت نشد.');
        }
      } else {
        console.log('No student found for attendance response');
        await bot.sendMessage(chatId, '❌ دانشجو یافت نشد.');
      }
      return;
    }
    
    if (data.startsWith('select_student_')) {
      const studentId = parseInt(data.replace('select_student_', ''));
      const state = userStates.get(chatId);
      
      if (state && state.step === 'student_list') {
        const student = state.data.students.find(s => s.id === studentId);
        
        if (student) {
          userStates.set(chatId, { 
            step: 'student_actions',
            data: { selectedStudent: student }
          });
          
          const message = `👤 دانشجو انتخاب شده: ${student.name}

📋 اطلاعات:
📱 تلفن: ${student.phoneNumber || 'ثبت نشده'}
📚 نوع کلاس: ${student.classType === 'private' ? 'خصوصی' : 'گروهی'}
📊 سطح: ${student.level || 'نامشخص'}
📘 جلسات باقی‌مانده: ${student.sessionsLeft}
💳 وضعیت پرداخت: ${student.paymentStatus === 'paid' ? 'پرداخت شده' : 'پرداخت نشده'}`;
          
          await bot.editMessageText(message, {
            chat_id: chatId,
            message_id: messageId
          });
          
          // Send appropriate keyboard based on class type
          const keyboard = student.classType === 'group' ? groupStudentActionsKeyboard : studentActionsKeyboard;
          await bot.sendMessage(chatId, 'لطفاً عملیات مورد نظر را انتخاب کنید:', keyboard);
        }
      }
    } else if (data.startsWith('approve_student_')) {
      const studentId = parseInt(data.replace('approve_student_', ''));
      const student = await prisma.student.findUnique({
        where: { id: studentId }
      });
      
      if (student) {
        // Set state for approval flow
        userStates.set(callbackQuery.from.id, {
          step: 'approve_sessions',
          data: { studentId: studentId, student: student }
        });
        
        await bot.answerCallbackQuery(callbackQuery.id, 'شروع فرآیند تأیید...');
        await bot.editMessageText(
          `📋 تأیید دانش‌آموز: ${student.name}

📚 تعداد کل جلسات کلاس را وارد کنید:`,
          { chat_id: callbackQuery.message.chat.id, message_id: callbackQuery.message.message_id }
        );
      }
    } else if (data.startsWith('reject_student_')) {
      const studentId = parseInt(data.replace('reject_student_', ''));
      const student = await prisma.student.findUnique({
        where: { id: studentId }
      });
      
      if (student) {
        // Update student status
        await prisma.student.update({
          where: { id: studentId },
          data: { registrationStatus: 'rejected' }
        });
        
        // Notify student
        await bot.sendMessage(student.telegramId, `❌ متأسفانه ثبت‌نام شما رد شد.

 لطفاً برای اطلاعات بیشتر با زهرا تماس بگیرید.`);
        
        // Update teacher message
        await bot.editMessageText(`❌ ثبت‌نام ${student.name} رد شد.`, {
          chat_id: chatId,
          message_id: messageId
        });
      }
    } else if (data === 'back_to_students') {
      // This will be handled by text message handler
      return;
    } else if (data === 'skip_field') {
      const state = userStates.get(callbackQuery.from.id);
      if (state && state.step === 'email') {
        state.data.email = 'تمایلی به گفتنش ندارم';
        state.step = 'city';
        userStates.set(callbackQuery.from.id, state);
        
        await bot.answerCallbackQuery(callbackQuery.id, 'ایمیل رد شد');
        await bot.sendMessage(callbackQuery.from.id, `ایمیل: تمایلی به گفتنش ندارم\n\n🏙️ لطفاً شهر محل زندگی خود را وارد کنید:`, backKeyboard);
      } else if (state && state.step === 'birth_date') {
        state.data.birthDate = 'تمایلی به گفتنش ندارم';
        state.step = 'learning_reason';
        userStates.set(callbackQuery.from.id, state);
        
        await bot.answerCallbackQuery(callbackQuery.id, 'تاریخ تولد رد شد');
        await bot.sendMessage(callbackQuery.from.id, `تاریخ تولد: تمایلی به گفتنش ندارم\n\n🎯 دلیل یادگیری زبان فرانسه را انتخاب کنید:`, learningReasonKeyboard);
      }
    }
    // All other actions will be handled by text message handler
    
  } catch (error) {
    console.error('Error handling callback query:', error);
  }
});

// Error handling
bot.on('error', (error) => {
  console.error('Bot error:', error);
});

bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

// Dashboard API endpoints
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

    // Get cancelled classes
    const cancelledClasses = await prisma.class.findMany({
      where: {
        status: 'cancelled'
      },
      include: { student: true },
      orderBy: { date: 'desc' },
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
      cancelledClasses,
      recentHomework,
      recentQuestions
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Answer question
app.post('/api/questions/:id/answer', async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;

    const question = await prisma.question.findUnique({
      where: { id: parseInt(id) },
      include: { student: true }
    });

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const updatedQuestion = await prisma.question.update({
      where: { id: parseInt(id) },
      data: {
        response,
        status: 'answered',
        answeredAt: new Date()
      }
    });

    // Notify student
    if (question.student.telegramId) {
      await bot.sendMessage(question.student.telegramId, `📝 پاسخ زهرا به سوال شما:\n\n${response}`);
    }

    res.json(updatedQuestion);
  } catch (error) {
    console.error('Error answering question:', error);
    res.status(500).json({ error: 'Failed to answer question' });
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

    // Notify student
    if (student.telegramId) {
      const message = `🎉 تبریک! درخواست شما تأیید شد!

👤 نام: ${student.name}
📚 نوع کلاس: ${student.classType === 'test' ? 'کلاس آزمایشی رایگان' : 'کلاس خصوصی'}
📅 جلسات باقی‌مانده: ${sessionsLeft}
💰 وضعیت پرداخت: ${paymentStatus === 'paid' ? 'پرداخت شده' : 'در انتظار پرداخت'}

زهرا به زودی با شما تماس خواهد گرفت تا زمان کلاس را هماهنگ کند.

متشکریم! 🇫🇷`;

      await bot.sendMessage(student.telegramId, message);
      console.log(`✅ Approval message sent to student ${student.name} (${student.telegramId})`);
    }

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

    // Notify student
    if (student.telegramId) {
      const message = `❌ متأسفانه درخواست شما رد شد.

👤 نام: ${student.name}
📚 نوع درخواست: ${student.classType === 'test' ? 'کلاس آزمایشی' : 'ثبت‌نام'}

برای اطلاعات بیشتر یا درخواست مجدد، لطفاً با زهرا تماس بگیرید.

متشکریم! 🇫🇷`;

      await bot.sendMessage(student.telegramId, message);
      console.log(`❌ Rejection message sent to student ${student.name} (${student.telegramId})`);
    }

    res.json(student);
  } catch (error) {
    console.error('Error rejecting student:', error);
    res.status(500).json({ error: 'Failed to reject student' });
  }
});

// Update student class schedule
app.post('/api/students/:id/update-schedule', async (req, res) => {
  try {
    const { id } = req.params;
    const { sessionsLeft, sessionsPerWeek, selectedDays, classTimes, paymentStatus } = req.body;
    
    console.log('Updating student schedule:', {
      studentId: id,
      sessionsLeft,
      sessionsPerWeek,
      selectedDays,
      classTimes,
      paymentStatus
    });

    // Update student
    const student = await prisma.student.update({
      where: { id: parseInt(id) },
      data: {
        sessionsLeft,
        sessionsPerWeek: sessionsPerWeek.toString(),
        selectedDays: selectedDays.join(','),
        selectedTimes: classTimes.map(ct => `${ct.day}:${ct.time}`).join(','),
        classSchedule: JSON.stringify(classTimes),
        paymentStatus
      }
    });
    
    console.log('Student updated successfully:', {
      id: student.id,
      name: student.name,
      selectedTimes: student.selectedTimes,
      selectedDays: student.selectedDays
    });

    // Regenerate class schedule
    await generateClassSchedule(parseInt(id), classTimes);

    // Notify student
    if (student.telegramId) {
      await bot.sendMessage(student.telegramId, `📅 برنامه کلاس‌های شما به‌روزرسانی شد!\n\nلطفاً ربات را با دستور /start مجدداً راه‌اندازی کنید تا برنامه جدید را ببینید.`);
    }

    res.json(student);
  } catch (error) {
    console.error('Error updating class schedule:', error);
    res.status(500).json({ error: 'Failed to update class schedule' });
  }
});

// Test API endpoints
app.get('/api/students/:id/classes', async (req, res) => {
  try {
    const { id } = req.params;
    const classes = await prisma.class.findMany({
      where: { studentId: parseInt(id) },
      orderBy: { date: 'asc' }
    });
    res.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

app.get('/api/classes', async (req, res) => {
  try {
    const classes = await prisma.class.findMany({
      include: { student: true },
      orderBy: { date: 'asc' },
      take: 50
    });
    res.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

// Get all students for debugging
app.get('/api/students', async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      orderBy: { createdAt: 'desc' }
    });
    console.log('All students:', students);
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Get student photo from Telegram
app.get('/api/students/:id/photo', async (req, res) => {
  try {
    const { id } = req.params;
    const student = await prisma.student.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!student || !student.telegramId) {
      return res.status(404).json({ error: 'Student not found or no Telegram ID' });
    }
    
    try {
      // Get user profile photos
      const photos = await bot.getUserProfilePhotos(student.telegramId, { limit: 1 });
      
      if (photos.total_count > 0) {
        const fileId = photos.photos[0][0].file_id;
        const file = await bot.getFile(fileId);
        const photoUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
        
        res.json({ 
          success: true, 
          photoUrl: photoUrl,
          hasPhoto: true 
        });
      } else {
        res.json({ 
          success: true, 
          photoUrl: null,
          hasPhoto: false 
        });
      }
    } catch (telegramError) {
      console.error('Error getting photo from Telegram:', telegramError);
      res.json({ 
        success: true, 
        photoUrl: null,
        hasPhoto: false 
      });
    }
  } catch (error) {
    console.error('Error fetching student photo:', error);
    res.status(500).json({ error: 'Failed to fetch student photo' });
  }
});

// Simple test endpoint to update payment status
app.post('/api/students/:id/test-payment', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Testing payment update for student ${id}`);
    
    const student = await prisma.student.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    console.log('Student found:', student.name);
    
    // Simple update without Telegram notification
    const updatedStudent = await prisma.student.update({
      where: { id: parseInt(id) },
      data: { 
        paymentStatus: 'paid'
      }
    });
    
    console.log('Student updated successfully');
    res.json({ success: true, student: updatedStudent });
  } catch (error) {
    console.error('Error in test payment update:', error);
    res.status(500).json({ error: 'Failed to update payment', details: error.message });
  }
});

// Get single class details
app.get('/api/classes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const classRecord = await prisma.class.findUnique({
      where: { id: parseInt(id) },
      include: { student: true }
    });
    
    if (!classRecord) {
      return res.status(404).json({ error: 'Class not found' });
    }
    
    res.json(classRecord);
  } catch (error) {
    console.error('Error fetching class:', error);
    res.status(500).json({ error: 'Failed to fetch class' });
  }
});

// Send class reminder
app.post('/api/classes/:id/remind', async (req, res) => {
  try {
    const { id } = req.params;
    const classRecord = await prisma.class.findUnique({
      where: { id: parseInt(id) },
      include: { student: true }
    });
    
    if (!classRecord || !classRecord.student) {
      return res.status(404).json({ error: 'Class or student not found' });
    }
    
    // Send reminder message to student
    if (classRecord.student.telegramId) {
      const classDate = new Date(classRecord.date);
      const dateStr = classDate.toLocaleDateString('fa-IR');
      const timeStr = classDate.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
      
      const message = `🔔 یادآوری کلاس

📚 کلاس زبان فرانسه شما:
📅 تاریخ: ${dateStr}
⏰ ساعت: ${timeStr}
📝 روز: ${classRecord.day}

🔗 لینک کلاس: https://meet.google.com/emb-fhpm-gwp

لطفاً 5 دقیقه قبل از شروع کلاس آماده باشید.

متشکریم! 🇫🇷`;

      await bot.sendMessage(classRecord.student.telegramId, message);
      
      // Mark reminder as sent
      await prisma.class.update({
        where: { id: parseInt(id) },
        data: { reminderSent: true }
      });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending class reminder:', error);
    res.status(500).json({ error: 'Failed to send reminder' });
  }
});

// Cancel class
app.post('/api/classes/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const classRecord = await prisma.class.findUnique({
      where: { id: parseInt(id) },
      include: { student: true }
    });
    
    if (!classRecord) {
      return res.status(404).json({ error: 'Class not found' });
    }
    
    // Update class status
    await prisma.class.update({
      where: { id: parseInt(id) },
      data: { status: 'cancelled' }
    });
    
    // Notify student
    if (classRecord.student.telegramId) {
      const classDate = new Date(classRecord.date);
      const dateStr = classDate.toLocaleDateString('fa-IR');
      const timeStr = classDate.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
      
      const message = `❌ کلاس کنسل شد

📚 کلاس زبان فرانسه شما کنسل شده است:
📅 تاریخ: ${dateStr}
⏰ ساعت: ${timeStr}
📝 روز: ${classRecord.day}

زهرا به زودی با شما تماس خواهد گرفت تا زمان جدیدی را هماهنگ کند.

متشکریم! 🇫🇷`;

      await bot.sendMessage(classRecord.student.telegramId, message);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error cancelling class:', error);
    res.status(500).json({ error: 'Failed to cancel class' });
  }
});

// Payment reminder for individual student
app.post('/api/students/:id/payment-reminder', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Payment reminder requested for student ID: ${id}`);
    
    const student = await prisma.student.findUnique({
      where: { id: parseInt(id) }
    });
    
    console.log('Student found:', student);
    
    if (!student) {
      console.log('Student not found in database');
      return res.status(404).json({ error: 'Student not found' });
    }
    
    if (!student.telegramId) {
      console.log('Student has no telegramId:', student.telegramId);
      return res.status(400).json({ error: 'Student has no Telegram ID' });
    }
    
    const message = `💰 یادآوری پرداخت

سلام ${student.name}!

🔔 زمان پرداخت شهریه کلاس زبان فرانسه شما فرا رسیده است.

📊 اطلاعات پرداخت:
💵 مبلغ: 500,000 تومان
📚 جلسات باقی‌مانده: ${student.sessionsLeft || 0} جلسه

💳 راه‌های پرداخت:
🏦 شماره کارت: 6037-9977-1234-5678
🏦 شماره شبا: IR123456789012345678901234
📱 پیامک: 09123456789

لطفاً پس از پرداخت، رسید را برای زهرا ارسال کنید.

متشکریم! 🇫🇷`;

    console.log(`Sending payment reminder to Telegram ID: ${student.telegramId}`);
    await bot.sendMessage(student.telegramId, message);
    console.log('Payment reminder sent successfully');
    
    res.json({ success: true, message: 'Payment reminder sent successfully' });
  } catch (error) {
    console.error('Error sending payment reminder:', error);
    res.status(500).json({ error: 'Failed to send payment reminder', details: error.message });
  }
});

// Custom payment reminder with amount and message
app.post('/api/students/:id/custom-payment-reminder', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, customMessage } = req.body;
    
    console.log(`Custom payment reminder requested for student ID: ${id}, amount: ${amount}`);
    
    const student = await prisma.student.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    if (!student.telegramId) {
      return res.status(400).json({ error: 'Student has no Telegram ID' });
    }
    
    // Format amount with commas
    const formattedAmount = amount.toLocaleString('fa-IR');
    
    let message = `💰 یادآوری پرداخت

سلام ${student.name}!

🔔 زمان پرداخت شهریه کلاس زبان فرانسه شما فرا رسیده است.

📊 اطلاعات پرداخت:
💵 مبلغ: ${formattedAmount} تومان
📚 جلسات باقی‌مانده: ${student.sessionsLeft || 0} جلسه`;

    if (customMessage && customMessage.trim()) {
      message += `\n\n📝 پیام اضافی:\n${customMessage.trim()}`;
    }

    message += `

💳 راه‌های پرداخت:
🏦 شماره کارت: 6037-9977-1234-5678
🏦 شماره شبا: IR123456789012345678901234
📱 پیامک: 09123456789

لطفاً پس از پرداخت، رسید را برای زهرا ارسال کنید.

متشکریم! 🇫🇷`;

    console.log(`Sending custom payment reminder to Telegram ID: ${student.telegramId}`);
    await bot.sendMessage(student.telegramId, message);
    console.log('Custom payment reminder sent successfully');
    
    res.json({ success: true, message: 'Custom payment reminder sent successfully' });
  } catch (error) {
    console.error('Error sending custom payment reminder:', error);
    res.status(500).json({ error: 'Failed to send custom payment reminder', details: error.message });
  }
});

// Send payment reminders to all unpaid students
app.post('/api/payments/send-reminders', async (req, res) => {
  try {
    const unpaidStudents = await prisma.student.findMany({
      where: {
        registrationStatus: 'approved',
        paymentStatus: { in: ['unpaid', 'overdue'] }
      }
    });
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const student of unpaidStudents) {
      try {
        if (student.telegramId) {
          const message = `💰 یادآوری پرداخت

سلام ${student.name}!

🔔 زمان پرداخت شهریه کلاس زبان فرانسه شما فرا رسیده است.

📊 اطلاعات پرداخت:
💵 مبلغ: 500,000 تومان
📚 جلسات باقی‌مانده: ${student.sessionsLeft || 0} جلسه

💳 راه‌های پرداخت:
🏦 شماره کارت: 6037-9977-1234-5678
🏦 شماره شبا: IR123456789012345678901234
📱 پیامک: 09123456789

لطفاً پس از پرداخت، رسید را برای زهرا ارسال کنید.

متشکریم! 🇫🇷`;

          await bot.sendMessage(student.telegramId, message);
          successCount++;
        }
      } catch (error) {
        console.error(`Error sending reminder to ${student.name}:`, error);
        errorCount++;
      }
    }
    
    res.json({ 
      success: true, 
      successCount, 
      errorCount,
      total: unpaidStudents.length 
    });
  } catch (error) {
    console.error('Error sending payment reminders:', error);
    res.status(500).json({ error: 'Failed to send payment reminders' });
  }
});

// Send bulk payment reminders with custom amount and message
app.post('/api/payments/send-bulk-reminders', async (req, res) => {
  try {
    const { amount, customMessage } = req.body;
    
    const unpaidStudents = await prisma.student.findMany({
      where: {
        registrationStatus: 'approved',
        paymentStatus: { in: ['unpaid', 'overdue'] }
      }
    });
    
    let successCount = 0;
    let errorCount = 0;
    
    // Format amount with commas
    const formattedAmount = amount.toLocaleString('fa-IR');
    
    for (const student of unpaidStudents) {
      try {
        if (student.telegramId) {
          let message = `💰 یادآوری پرداخت

سلام ${student.name}!

🔔 زمان پرداخت شهریه کلاس زبان فرانسه شما فرا رسیده است.

📊 اطلاعات پرداخت:
💵 مبلغ: ${formattedAmount} تومان
📚 جلسات باقی‌مانده: ${student.sessionsLeft || 0} جلسه`;

          if (customMessage && customMessage.trim()) {
            message += `\n\n📝 پیام اضافی:\n${customMessage.trim()}`;
          }

          message += `

💳 راه‌های پرداخت:
🏦 شماره کارت: 6037-9977-1234-5678
🏦 شماره شبا: IR123456789012345678901234
📱 پیامک: 09123456789

لطفاً پس از پرداخت، رسید را برای زهرا ارسال کنید.

متشکریم! 🇫🇷`;

          await bot.sendMessage(student.telegramId, message);
          successCount++;
        }
      } catch (error) {
        console.error(`Error sending bulk reminder to ${student.name}:`, error);
        errorCount++;
      }
    }
    
    res.json({ 
      success: true, 
      successCount, 
      errorCount,
      total: unpaidStudents.length 
    });
  } catch (error) {
    console.error('Error sending bulk payment reminders:', error);
    res.status(500).json({ error: 'Failed to send bulk payment reminders' });
  }
});

// Get all homework submissions
app.get('/api/homework', async (req, res) => {
  try {
    const homework = await prisma.homework.findMany({
      include: {
        student: {
          select: {
            id: true,
            name: true,
            telegramId: true,
            phoneNumber: true
          }
        }
      },
      orderBy: { submittedAt: 'desc' }
    });
    
    res.json(homework);
  } catch (error) {
    console.error('Error fetching homework:', error);
    res.status(500).json({ error: 'Failed to fetch homework' });
  }
});

// Update homework status
app.post('/api/homework/:id/update-status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, teacherNotes } = req.body;
    
    const homework = await prisma.homework.update({
      where: { id: parseInt(id) },
      data: {
        status: status,
        teacherNotes: teacherNotes,
        reviewedAt: new Date()
      },
      include: {
        student: true
      }
    });
    
    // Notify student if status changed
    if (homework.student.telegramId) {
      let message = `📝 وضعیت تکلیف شما به‌روزرسانی شد:\n\n`;
      message += `📝 عنوان: ${homework.title || 'بدون عنوان'}\n`;
      message += `📊 وضعیت: `;
      
      switch (status) {
        case 'reviewed':
          message += `✅ بررسی شده`;
          break;
        case 'approved':
          message += `✅ تأیید شده`;
          break;
        case 'needs_revision':
          message += `🔄 نیاز به بازنگری`;
          break;
        default:
          message += status;
      }
      
      if (teacherNotes) {
        message += `\n\n📝 نظرات معلم:\n${teacherNotes}`;
      }
      
      try {
        await bot.sendMessage(homework.student.telegramId, message);
      } catch (telegramError) {
        console.error('Error sending homework update to student:', telegramError);
      }
    }
    
    res.json({ success: true, homework });
  } catch (error) {
    console.error('Error updating homework status:', error);
    res.status(500).json({ error: 'Failed to update homework status' });
  }
});

// Get all questions
app.get('/api/questions', async (req, res) => {
  try {
    const questions = await prisma.question.findMany({
      include: {
        student: {
          select: {
            id: true,
            name: true,
            telegramId: true,
            phoneNumber: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Answer a question
app.post('/api/questions/:id/answer', async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;
    
    const question = await prisma.question.update({
      where: { id: parseInt(id) },
      data: {
        response: response,
        status: 'answered',
        answeredAt: new Date()
      },
      include: {
        student: true
      }
    });
    
    // Send response to student
    if (question.student.telegramId) {
      const message = `💬 پاسخ زهرا به سوال شما:

❓ سوال شما: ${question.question}

💬 پاسخ: ${response}

از سوال شما متشکرم! اگر سوال دیگری دارید، خوشحال می‌شوم پاسخ دهم.`;

      try {
        await bot.sendMessage(question.student.telegramId, message);
      } catch (telegramError) {
        console.error('Error sending answer to student:', telegramError);
      }
    }
    
    res.json({ success: true, question });
  } catch (error) {
    console.error('Error answering question:', error);
    res.status(500).json({ error: 'Failed to answer question' });
  }
});

// Get cancelled classes
app.get('/api/cancelled-classes', async (req, res) => {
  try {
    const cancelledClasses = await prisma.class.findMany({
      where: {
        status: { in: ['cancelled', 'cancelled_by_student', 'cancelled_by_teacher'] }
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            telegramId: true,
            phoneNumber: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
    
    res.json(cancelledClasses);
  } catch (error) {
    console.error('Error fetching cancelled classes:', error);
    res.status(500).json({ error: 'Failed to fetch cancelled classes' });
  }
});

// Cancel a class by teacher
app.post('/api/classes/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const classRecord = await prisma.class.update({
      where: { id: parseInt(id) },
      data: {
        status: 'cancelled_by_teacher',
        cancelledAt: new Date(),
        cancelledBy: 'teacher',
        cancellationReason: reason
      },
      include: {
        student: true
      }
    });
    
    // Notify student
    if (classRecord.student.telegramId) {
      const message = `❌ کلاس لغو شد

سلام ${classRecord.student.name}!

کلاس شما در تاریخ ${new Date(classRecord.date).toLocaleDateString('fa-IR')} لغو شده است.

📅 تاریخ کلاس: ${new Date(classRecord.date).toLocaleDateString('fa-IR')}
🕐 ساعت: ${classRecord.time}
📝 دلیل: ${reason || 'بدون دلیل مشخص'}

لطفاً برای تعیین زمان جدید با زهرا تماس بگیرید.

متشکریم!`;

      try {
        await bot.sendMessage(classRecord.student.telegramId, message);
      } catch (telegramError) {
        console.error('Error sending cancellation message to student:', telegramError);
      }
    }
    
    res.json({ success: true, class: classRecord });
  } catch (error) {
    console.error('Error cancelling class:', error);
    res.status(500).json({ error: 'Failed to cancel class' });
  }
});

// Mark class as completed and update session count
app.post('/api/classes/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const { attendance } = req.body;
    
    const classRecord = await prisma.class.update({
      where: { id: parseInt(id) },
      data: {
        status: 'completed',
        attendance: attendance || 'attending'
      },
      include: {
        student: true
      }
    });
    
    // Update student's session count
    if (attendance === 'attending') {
      await prisma.student.update({
        where: { id: classRecord.studentId },
        data: {
          sessionsLeft: Math.max(0, classRecord.student.sessionsLeft - 1)
        }
      });
    }
    
    res.json({ success: true, class: classRecord });
  } catch (error) {
    console.error('Error completing class:', error);
    res.status(500).json({ error: 'Failed to complete class' });
  }
});

// Update student data
app.put('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const student = await prisma.student.update({
      where: { id: parseInt(id) },
      data: updateData
    });
    
    res.json({ success: true, student });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// Get student's latest class time
app.get('/api/students/:id/latest-time', async (req, res) => {
  try {
    const { id } = req.params;
    
    const latestClass = await prisma.class.findFirst({
      where: { studentId: parseInt(id) },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ 
      success: true, 
      latestTime: latestClass ? {
        day: latestClass.day,
        time: latestClass.time,
        classType: latestClass.classType,
        groupId: latestClass.groupId
      } : null
    });
  } catch (error) {
    console.error('Error fetching latest time:', error);
    res.status(500).json({ error: 'Failed to fetch latest time' });
  }
});

// Mark student as paid
app.post('/api/students/:id/mark-paid', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Marking student ${id} as paid`);
    
    const student = await prisma.student.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!student) {
      console.log('Student not found');
      return res.status(404).json({ error: 'Student not found' });
    }
    
    console.log('Student found:', student.name, 'Current payment status:', student.paymentStatus);
    
    // Update payment status
    const updatedStudent = await prisma.student.update({
      where: { id: parseInt(id) },
      data: { 
        paymentStatus: 'paid'
      }
    });
    
    console.log('Student payment status updated to:', updatedStudent.paymentStatus);
    
    // Notify student
    if (student.telegramId) {
      try {
        const message = `✅ پرداخت تأیید شد

سلام ${student.name}!

🎉 پرداخت شما با موفقیت تأیید شد.

📊 اطلاعات پرداخت:
💵 مبلغ: 500,000 تومان
📚 جلسات باقی‌مانده: ${student.sessionsLeft || 0} جلسه
📅 تاریخ پرداخت: ${new Date().toLocaleDateString('fa-IR')}

از همکاری شما متشکریم! 🇫🇷`;

        await bot.sendMessage(student.telegramId, message);
        console.log('Payment confirmation sent to student');
      } catch (telegramError) {
        console.error('Error sending Telegram notification:', telegramError);
        // Don't fail the entire operation if Telegram fails
      }
    }
    
    res.json({ success: true, message: 'Student marked as paid successfully' });
  } catch (error) {
    console.error('Error marking as paid:', error);
    res.status(500).json({ error: 'Failed to mark as paid' });
  }
});

app.post('/api/test/send-reminder/:classId', async (req, res) => {
  try {
    const { classId } = req.params;
    await sendClassReminder(parseInt(classId));
    res.json({ success: true, message: 'Reminder sent' });
  } catch (error) {
    console.error('Error sending test reminder:', error);
    res.status(500).json({ error: 'Failed to send reminder' });
  }
});

app.post('/api/test/send-review/:classId', async (req, res) => {
  try {
    const { classId } = req.params;
    await sendClassReview(parseInt(classId));
    res.json({ success: true, message: 'Review sent' });
  } catch (error) {
    console.error('Error sending test review:', error);
    res.status(500).json({ error: 'Failed to send review' });
  }
});

// Send review to any student
app.post('/api/test/send-review-to-student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await prisma.student.findUnique({
      where: { id: parseInt(studentId) }
    });

    if (!student || !student.telegramId) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Create a test review state
    userStates.set(student.telegramId, {
      step: 'class_review',
      data: { classId: 999 } // Test class ID
    });
    
    console.log(`Set review state for student ${student.telegramId}:`, userStates.get(student.telegramId));

    const message = `📝 نظرسنجی کلاس

📅 کلاس آزمایشی

لطفاً نظرات خود را درباره کلاس امروز ارسال کنید:
- کیفیت تدریس
- مفید بودن مطالب
- پیشنهادات

نظر شما برای بهبود کلاس‌ها مهم است! 🙏`;
    
    await bot.sendMessage(student.telegramId, message);
    res.json({ success: true, message: 'Review sent to student' });
  } catch (error) {
    console.error('Error sending review to student:', error);
    res.status(500).json({ error: 'Failed to send review' });
  }
});

app.post('/api/test/check-reminders', async (req, res) => {
  try {
    await checkClassReminders();
    res.json({ success: true, message: 'Reminders checked' });
  } catch (error) {
    console.error('Error checking reminders:', error);
    res.status(500).json({ error: 'Failed to check reminders' });
  }
});

// Send payment reminder
app.post('/api/students/:id/payment-reminder', async (req, res) => {
  try {
    const { id } = req.params;
    const student = await prisma.student.findUnique({
      where: { id: parseInt(id) }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    if (student.telegramId) {
      const paymentMessage = `💳 یادآوری پرداخت

سلام ${student.name}!

لطفاً پرداخت کلاس‌های خود را انجام دهید تا بتوانیم کلاس‌ها را ادامه دهیم.

📚 نوع کلاس: ${student.classType === 'private' ? 'خصوصی' : 'گروهی'}
📘 جلسات باقی‌مانده: ${student.sessionsLeft}

برای اطلاعات بیشتر با زهرا تماس بگیرید.`;
      
      await bot.sendMessage(student.telegramId, paymentMessage);
    }

    res.json({ success: true, message: 'Payment reminder sent' });
  } catch (error) {
    console.error('Error sending payment reminder:', error);
    res.status(500).json({ error: 'Failed to send payment reminder' });
  }
});

// Cancel class from dashboard
app.post('/api/classes/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    
    const classRecord = await prisma.class.findUnique({
      where: { id: parseInt(id) },
      include: { student: true }
    });
    
    if (!classRecord) {
      return res.status(404).json({ error: 'Class not found' });
    }
    
    // Update class status to cancelled
    await prisma.class.update({
      where: { id: parseInt(id) },
      data: { status: 'cancelled' }
    });
    
    // Notify student
    if (classRecord.student.telegramId) {
      const dateStr = new Date(classRecord.date).toLocaleDateString('fa-IR');
      const timeStr = new Date(classRecord.date).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
      
      const studentMessage = `❌ کنسل کردن کلاس

📅 کلاس ${classRecord.day} ${dateStr} - ${timeStr} توسط زهرا کنسل شد.

📅 لطفاً برای تعیین زمان جبرانی از لینک زیر استفاده کنید:

🔗 https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ0NtoUdys7OfznfPZvLtIq68BWM3_CZ3Vk8ZKSo8iEsuxtEasuumNXB3s9LEcdt37oAl5R1i-bA

⏰ پس از انتخاب زمان جدید، زهرا با شما تماس خواهد گرفت.`;
      
      await bot.sendMessage(classRecord.student.telegramId, studentMessage);
    }
    
    res.json({ success: true, message: 'Class cancelled and student notified' });
  } catch (error) {
    console.error('Error cancelling class:', error);
    res.status(500).json({ error: 'Failed to cancel class' });
  }
});

// Start bot
console.log('🤖 Starting clean Telegram bot...');
console.log('✅ Bot started successfully!');
console.log('🔗 Send /start to your bot on Telegram to test');

// Start reminder checker (every minute)
setInterval(checkClassReminders, 60000);
console.log('⏰ Reminder system started - checking every minute');

// Start dashboard server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`📊 Dashboard available at http://localhost:${PORT}/dashboard.html`);
});

// Keep the process alive
process.on('SIGINT', () => {
  console.log('🛑 Stopping bot...');
  bot.stopPolling();
  prisma.$disconnect();
  process.exit(0);
});

module.exports = { bot, prisma };
