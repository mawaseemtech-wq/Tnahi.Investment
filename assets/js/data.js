const AppData = {
  provider: {
    name: "سنام للحراسات الأمنية",
    shortName: "سنام",
  },

  client: {
    name: "تناهي للاستثمار",
    email: "client@demo.com",
    password: "123456",
  },

  users: [
    { id: 1, name: "أحمد السالم", email: "ahmad@tanahi.com", password: "••••••", role: "مدير المشروع" },
    { id: 2, name: "سارة العتيبي", email: "sara@tanahi.com", password: "••••••", role: "مراقب حضور" },
    { id: 3, name: "خالد المطيري", email: "khaled@tanahi.com", password: "••••••", role: "مشرف مركبات" },
  ],

  projects: [
    { id: "P-101", name: "متحف حي الثقافة", status: "نشط", guards: 64, site: "مكة المكرمة" },
    { id: "P-102", name: "متحف وبلاد الصافية", status: "نشط", guards: 64, site: "مكة المكرمة" },
  ],

  attendance: [
    { id: 1, name: "فهد القحطاني", project: "متحف حي الثقافة", in: "06:02", out: "—", status: "حاضر", shift: "صباحي" },
    { id: 2, name: "ماجد الحربي", project: "متحف حي الثقافة", in: "05:58", out: "—", status: "حاضر", shift: "صباحي" },
    { id: 3, name: "ناصر الدوسري", project: "متحف وبلاد الصافية", in: "18:01", out: "—", status: "حاضر", shift: "مسائي" },
    { id: 4, name: "يوسف الشهري", project: "متحف وبلاد الصافية", in: "05:45", out: "14:02", status: "انصرف", shift: "صباحي" },
    { id: 5, name: "بندر العتيبي", project: "متحف حي الثقافة", in: "—", out: "—", status: "غائب", shift: "صباحي" },
    { id: 6, name: "سعود الغامدي", project: "متحف وبلاد الصافية", in: "07:10", out: "—", status: "حاضر", shift: "صباحي" },
  ],

  vehicles: {
    log: [
      { plate: "أ ب ج 1234", type: "مسجلة", direction: "دخول", gate: "البوابة 1", time: "08:14", project: "متحف حي الثقافة" },
      { plate: "ر س ت 5566", type: "غير مسجلة", direction: "دخول", gate: "البوابة 2", time: "08:22", project: "متحف حي الثقافة" },
      { plate: "د هـ و 7788", type: "مسجلة", direction: "خروج", gate: "البوابة 1", time: "09:01", project: "متحف وبلاد الصافية" },
      { plate: "ز ح ط 9900", type: "مسجلة", direction: "دخول", gate: "البوابة 3", time: "09:18", project: "متحف وبلاد الصافية" },
      { plate: "ك ل م 1122", type: "غير مسجلة", direction: "خروج", gate: "البوابة 2", time: "09:40", project: "متحف حي الثقافة" },
    ],
    registered: [
      { plate: "أ ب ج 1234", owner: "تناهي للاستثمار", model: "تويوتا هايلوكس", status: "مسموح" },
      { plate: "د هـ و 7788", owner: "مورد المعدات", model: "إيسوزو NPR", status: "مسموح" },
      { plate: "ز ح ط 9900", owner: "الإدارة", model: "لكزس ES", status: "مسموح" },
    ],
    banned: [
      { plate: "س ص ع 4444", reason: "تكرار مخالفة الدخول بدون تصريح", date: "2026-06-12", by: "إدارة الأمن" },
      { plate: "ف ق ر 3333", reason: "مركبة مطلوبة أمنياً", date: "2026-07-01", by: "الرقابة الميدانية" },
    ],
  },

  parking: {
    total: 48,
    free: 19,
    busy: 24,
    reserved: 5,
    slots: Array.from({ length: 48 }, (_, i) => {
      const n = i + 1;
      if ([3, 7, 11, 18, 22].includes(n)) return { id: n, state: "reserved" };
      if (n % 2 === 0 && n < 40) return { id: n, state: "busy" };
      if (n > 40 || n % 3 === 0) return { id: n, state: "free" };
      return { id: n, state: n % 5 === 0 ? "free" : "busy" };
    }),
  },

  quote: {
    company: "تناهي للاستثمار",
    directedTo: "إدارة التعاقدات — سنام للحراسات الأمنية",
    siteDesc: "مجمع إداري وتجاري متعدد الأدوار مع مواقف تحت الأرض ومداخل متعددة.",
    duration: "12 شهراً قابلة للتجديد",
    guards: "14 حارساً (مناوبات 24/7) + مشرف موقع",
    tasks: "تأمين المداخل والمخارج، مراقبة الكاميرات، تسجيل المركبات، دوريات داخلية، استقبال البلاغات.",
    contact: "0550001122 — contracts@tanahi.com",
  },

  contract: {
    guardsRequired: "14 حارساً + مشرف",
    workHours: "24 ساعة — ثلاث ورديات",
    period: "من 2026-08-01 إلى 2027-07-31",
    relation: "علاقة تعاقدية لتقديم خدمات حراسة وحماية للمنشأة وفق بنود العرض المعتمد.",
    clauses: [
      "يلتزم الطرف الثاني بتوفير العدد المتفق عليه من الحراس المؤهلين.",
      "رفع تقارير يومية وبلاغات ميدانية عبر بوابة العميل.",
      "الالتزام ببروتوكول دخول وخروج المركبات والمواقف.",
      "المحافظة على سرية بيانات العميل والمنشأة.",
    ],
  },

  approval: {
    projectName: "متحف حي الثقافة — عقد الحراسة",
    projectCode: "APR-2026-088",
    clientSign: "",
    providerSign: "",
    approved: false,
    date: "2026-07-21",
  },

  tasks: [
    { id: 1, title: "رفع خطاب اعتماد المناوبات", status: "قيد التنفيذ", priority: "عالية", due: "اليوم" },
    { id: 2, title: "إصدار التقرير الأمني اليومي", status: "مكتمل", priority: "متوسطة", due: "أمس" },
    { id: 3, title: "مراجعة قائمة المركبات الممنوعة", status: "جديدة", priority: "عالية", due: "غداً" },
    { id: 4, title: "تحديث صلاحيات مستخدمي العميل", status: "قيد التنفيذ", priority: "منخفضة", due: "هذا الأسبوع" },
  ],

  letters: [
    { id: 1, title: "خطاب طلب تعزيز الحراسة", date: "2026-07-18", type: "وارد من العميل", status: "مستلم" },
    { id: 2, title: "نموذج إبلاغ حادث ميداني", date: "2026-07-19", type: "نموذج معتمد", status: "متاح" },
    { id: 3, title: "خطاب تمديد فترة التعاقد", date: "2026-07-20", type: "صادر للإدارة", status: "بانتظار الرد" },
  ],

  templates: [
    { id: "T1", name: "نموذج طلب عرض سعر", desc: "قالب رسمي لتقديم طلب عرض سعر للحراسة" },
    { id: "T2", name: "نموذج بلاغ ميداني", desc: "لتوثيق الحوادث والملاحظات الميدانية" },
    { id: "T3", name: "نموذج خطاب رسمي للعميل", desc: "مراسلات إدارية بين سنام وتناهي للاستثمار" },
    { id: "T4", name: "نموذج اعتماد مشروع", desc: "صفحة اعتماد المشروع مع أماكن التوقيع" },
    { id: "T5", name: "نموذج طلب إضافة عدد حراس", desc: "طلب رسمي لزيادة عدد الحراس في المشروع" },
    { id: "T6", name: "نموذج خطاب إنهاء التعاقد", desc: "خطاب رسمي لإنهاء العلاقة التعاقدية" },
  ],

  guardRequests: [
    { id: 1, project: "متحف حي الثقافة", currentGuards: 12, extraGuards: 3, reason: "تعزيز المناوبة المسائية", date: "2026-07-18", status: "قيد المراجعة" },
  ],

  terminationLetters: [
    { id: 1, project: "متحف وبلاد الصافية", endDate: "2026-08-31", reason: "انتهاء الحاجة للخدمة", notice: "30 يوماً", date: "2026-07-10", status: "مسودة" },
  ],

  evaluations: [
    { id: 1, guard: "فهد القحطاني", project: "متحف حي الثقافة", discipline: 5, appearance: 4, performance: 5, cooperation: 4, notes: "التزام ممتاز بالمناوبة", date: "2026-07-15", avg: 4.5 },
    { id: 2, guard: "ناصر الدوسري", project: "متحف وبلاد الصافية", discipline: 4, appearance: 4, performance: 3, cooperation: 4, notes: "يحتاج متابعة في سرعة الاستجابة", date: "2026-07-14", avg: 3.8 },
    { id: 3, guard: "سعود الغامدي", project: "متحف وبلاد الصافية", discipline: 5, appearance: 5, performance: 5, cooperation: 5, notes: "أداء إشرافي متميز", date: "2026-07-12", avg: 5 },
  ],

  dailyReports: [
    { id: 1, date: "2026-07-25", project: "متحف حي الثقافة", summary: "الوردية مستقرة — لا ملاحظات جوهرية", author: "مشرف الموقع" },
    { id: 2, date: "2026-07-25", project: "متحف وبلاد الصافية", summary: "اكتمال الجولات المسائية وفق الجدول", author: "مراقب الوردية" },
    { id: 3, date: "2026-07-24", project: "متحف حي الثقافة", summary: "تسجيل ملاحظة صيانة بسيطة عند المدخل الشرقي", author: "مشرف الموقع" },
  ],

  fieldAlerts: [
    { id: 1, time: "07:42", date: "2026-07-25", level: "عالٍ", status: "مفتوح", type: "أمني", text: "محاولة دخول غير مصرح عند البوابة الرئيسية — تم المنع", project: "متحف حي الثقافة", handler: "فهد القحطاني" },
    { id: 2, time: "09:15", date: "2026-07-25", level: "متوسط", status: "قيد المعالجة", type: "تشغيلي", text: "ازدحام زوار عند نقطة التفتيش — جارٍ تنظيم الدخول", project: "متحف وبلاد الصافية", handler: "ناصر الدوسري" },
    { id: 3, time: "11:30", date: "2026-07-25", level: "منخفض", status: "مغلق", type: "صيانة", text: "بلاغ إضاءة ضعيفة في الممر الجانبي — تم الإصلاح", project: "متحف حي الثقافة", handler: "ماجد الحربي" },
    { id: 4, time: "14:05", date: "2026-07-24", level: "عالٍ", status: "قيد المعالجة", type: "أمني", text: "إنذار كاشف حركة في المنطقة المغلقة بعد ساعات الزيارة", project: "متحف وبلاد الصافية", handler: "سعود الغامدي" },
    { id: 5, time: "16:40", date: "2026-07-24", level: "متوسط", status: "مغلق", type: "ميداني", text: "تأخر جولة دورية 8 دقائق — تم التوثيق والمتابعة", project: "متحف حي الثقافة", handler: "فهد القحطاني" },
    { id: 6, time: "18:22", date: "2026-07-23", level: "منخفض", status: "مغلق", type: "تشغيلي", text: "طلب توجيه زائر فاقد للتذكرة — تم الحل فورًا", project: "متحف وبلاد الصافية", handler: "يوسف الشهري" },
    { id: 7, time: "20:10", date: "2026-07-23", level: "متوسط", status: "مفتوح", type: "أمني", text: "ملاحظة مركبة متوقفة في منطقة محظورة", project: "متحف حي الثقافة", handler: "بندر العتيبي" },
    { id: 8, time: "08:05", date: "2026-07-22", level: "عالٍ", status: "مغلق", type: "طوارئ", text: "بلاغ حالة إسعاف لزائر — تم التنسيق مع الطوارئ", project: "متحف وبلاد الصافية", handler: "سعود الغامدي" },
  ],

  incidentTrend: [
    { day: "20", count: 1 },
    { day: "21", count: 2 },
    { day: "22", count: 1 },
    { day: "23", count: 2 },
    { day: "24", count: 2 },
    { day: "25", count: 3 },
  ],

  employees: [
    { name: "فهد القحطاني", role: "حارس", project: "متحف حي الثقافة", shift: "صباحي" },
    { name: "ماجد الحربي", role: "حارس", project: "متحف حي الثقافة", shift: "صباحي" },
    { name: "ناصر الدوسري", role: "حارس", project: "متحف وبلاد الصافية", shift: "مسائي" },
    { name: "سعود الغامدي", role: "مشرف", project: "متحف وبلاد الصافية", shift: "صباحي" },
  ],

  messages: [
    { from: "admin", who: "سنام — الإدارة", text: "تم استلام خطابكم بخصوص تعزيز المناوبة المسائية.", time: "09:12" },
    { from: "client", who: "عميل — تناهي للاستثمار", text: "نرجو تأكيد توفر 3 حراس إضافيين نهاية الأسبوع.", time: "09:20" },
    { from: "admin", who: "سنام — الإدارة", text: "تم جدولة التعزيز — سيظهر في قسم المهام خلال ساعة.", time: "09:35" },
  ],
};
