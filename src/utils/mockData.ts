import { PantoneColor, SafetyReport, UIConfig, LeaderboardEntry, ChatMessage, UserProfile, UserRole } from '../types';

export const PANTONE_PRESETS: PantoneColor[] = [
  {
    name: 'كهرماني السلامة',
    code: 'بانتون 137 C',
    hex: '#D97706',
    hoverHex: '#B45309',
    lightHex: 'rgba(217, 119, 6, 0.14)',
    ringHex: 'rgba(217, 119, 6, 0.35)'
  },
  {
    name: 'برتقالي صناعي تحذيري',
    code: 'بانتون 021 C',
    hex: '#EA580C',
    hoverHex: '#C2410C',
    lightHex: 'rgba(234, 88, 12, 0.14)',
    ringHex: 'rgba(234, 88, 12, 0.35)'
  },
  {
    name: 'أزرق السلامة والامتثال',
    code: 'بانتون 300 C',
    hex: '#0284C7',
    hoverHex: '#0369A1',
    lightHex: 'rgba(2, 132, 199, 0.14)',
    ringHex: 'rgba(2, 132, 199, 0.35)'
  },
  {
    name: 'أخضر الفحص الميداني',
    code: 'بانتون 376 C',
    hex: '#16A34A',
    hoverHex: '#15803D',
    lightHex: 'rgba(22, 163, 74, 0.14)',
    ringHex: 'rgba(22, 163, 74, 0.35)'
  },
  {
    name: 'أحمر الخطر الحرج',
    code: 'بانتون 186 C',
    hex: '#DC2626',
    hoverHex: '#B91C1C',
    lightHex: 'rgba(220, 38, 38, 0.14)',
    ringHex: 'rgba(220, 38, 38, 0.35)'
  },
  {
    name: 'رمادي التيتانيوم الصناعي',
    code: 'بانتون 432 C',
    hex: '#334155',
    hoverHex: '#1E293B',
    lightHex: 'rgba(51, 65, 85, 0.15)',
    ringHex: 'rgba(51, 65, 85, 0.35)'
  }
];

export const DEFAULT_REWARDS_CONFIG = {
  enabled: true,
  showWallOfFame: true,
  pointsPerReport: 100,
  bonusPhotoPoints: 25,
  bonusCriticalPoints: 50,
  currencyName: 'نقطة سلامة',
  currencyNameAr: 'نقطة سلامة',
  programTitle: 'برنامج حوافز ومكافآت أبطال السلامة',
  programTitleAr: 'برنامج حوافز ومكافآت أبطال السلامة',
  executiveNotice: 'تُصرف المكافآت ربع سنوياً بعد إغلاق الملفات والتأكد التام من اتخاذ الإجراءات التصحيحية.',
  executiveNoticeAr: 'تُصرف المكافآت ربع سنوياً بعد إغلاق الملفات والتأكد التام من اتخاذ الإجراءات التصحيحية.',
  tiers: [
    {
      id: 'tier_1',
      name: 'المستوى 1: راصد نشط (400+ نقطة)',
      nameAr: 'المستوى 1: راصد نشط (400+ نقطة)',
      minPoints: 400,
      bonusPercentage: 5,
      perks: '+5% حافز أداء ربع سنوي + شهادة تقدير رسمية',
      perksAr: '+5% حافز أداء ربع سنوي + شهادة تقدير رسمية',
      color: 'emerald'
    },
    {
      id: 'tier_2',
      name: 'المستوى 2: سفير السلامة (700+ نقطة)',
      nameAr: 'المستوى 2: سفير السلامة (700+ نقطة)',
      minPoints: 700,
      bonusPercentage: 10,
      perks: '+10% حافز أداء + أولوية ترشيح للدورات التخصصية',
      perksAr: '+10% حافز أداء + أولوية ترشيح للدورات التخصصية',
      color: 'blue'
    },
    {
      id: 'tier_3',
      name: 'المستوى 3: بطل انعدام الحوادث (850+ نقطة)',
      nameAr: 'المستوى 3: بطل انعدام الحوادث (850+ نقطة)',
      minPoints: 850,
      bonusPercentage: 15,
      perks: '+15% مكافأة تنفيذية عليا + درع التميز السنوي + يوم راحة تقديري',
      perksAr: '+15% مكافأة تنفيذية عليا + درع التميز السنوي + يوم راحة تقديري',
      color: 'amber'
    }
  ],
  catalog: [
    {
      id: 'rew_1',
      title: 'قسيمة شراء هايبرماركت معتمدة (500 ريال)',
      titleAr: 'قسيمة شراء هايبرماركت معتمدة (500 ريال)',
      costPoints: 500,
      description: 'قسيمة شراء إلكترونية فورية قابلة للاستخدام لدى شركاء التجزئة الكبرى.',
      descriptionAr: 'قسيمة شراء إلكترونية فورية قابلة للاستخدام لدى شركاء التجزئة الكبرى.',
      category: 'قسيمة تسوق',
      categoryAr: 'قسيمة تسوق',
      icon: 'Gift',
      enabled: true
    },
    {
      id: 'rew_2',
      title: 'يوم راحة إضافي مدفوع الأجر تقديراً للسلامة',
      titleAr: 'يوم راحة إضافي مدفوع الأجر تقديراً للسلامة',
      costPoints: 800,
      description: 'يوم إجازة استثنائي مدفوع الأجر معتمد مباشرة من المدير العام م. طارق المنصور.',
      descriptionAr: 'يوم إجازة استثنائي مدفوع الأجر معتمد مباشرة من المدير العام م. طارق المنصور.',
      category: 'ميزة استثنائية',
      categoryAr: 'ميزة استثنائية',
      icon: 'Calendar',
      enabled: true
    },
    {
      id: 'rew_3',
      title: 'درع التميز الكريستالي لبطل انعدام الحوادث',
      titleAr: 'درع التميز الكريستالي لبطل انعدام الحوادث',
      costPoints: 1000,
      description: 'درع كريستالي فاخر منقوش باسم الموظف يُسلّم في الحفل السنوي العام للمنشأة.',
      descriptionAr: 'درع كريستالي فاخر منقوش باسم الموظف يُسلّم في الحفل السنوي العام للمنشأة.',
      category: 'تكريم رسمي',
      categoryAr: 'تكريم رسمي',
      icon: 'Trophy',
      enabled: true
    },
    {
      id: 'rew_4',
      title: 'حقيبة مهمات السلامة الاحترافية المعتمدة (OSHA)',
      titleAr: 'حقيبة مهمات السلامة الاحترافية المعتمدة (OSHA)',
      costPoints: 350,
      description: 'خوذة كربونية احترافية، نظارات باليستية مضادة للوهج، وأداة فحص سلامة متعددة.',
      descriptionAr: 'خوذة كربونية احترافية، نظارات باليستية مضادة للوهج، وأداة فحص سلامة متعددة.',
      category: 'مهمات وقاية',
      categoryAr: 'مهمات وقاية',
      icon: 'HardHat',
      enabled: true
    }
  ]
};

export const DEFAULT_UI_CONFIG: UIConfig = {
  appTitle: 'STOP',
  appSubtitle: 'منصة تتبع وملاحظة السلامة والصحة المهنية',
  pantone: PANTONE_PRESETS[0],
  rewardsConfig: DEFAULT_REWARDS_CONFIG,
  portalFeatures: {
    worker: {
      voiceDictation: true,
      gamification: true,
      gpsAutoDetect: true,
      photoUpload: true,
      instantChat: true
    },
    hse: {
      audioAlerts: true,
      riskOverride: true,
      quickDirectives: true,
      exportReports: true
    },
    gm: {
      executiveDirectives: true,
      reassignment: true,
      exportSummaries: true,
      riskHeatmap: true
    }
  },
  customFields: [
    {
      id: 'field_shift',
      label: 'الوردية التشغيلية الميدانية',
      type: 'select',
      options: ['الوردية 1 (الصباحية: 06:00 - 14:00)', 'الوردية 2 (المسائية: 14:00 - 22:00)', 'الوردية 3 (الليلية: 22:00 - 06:00)'],
      required: true,
      enabled: true
    },
    {
      id: 'field_contractor',
      label: 'هل يوجد مقاول خارجي بموقع العمل؟',
      type: 'toggle',
      required: false,
      enabled: true
    },
    {
      id: 'field_machinery_id',
      label: 'رمز تعريف المعدة أو خط الإنتاج',
      type: 'text',
      placeholder: 'مثال: خط التبريد 3 / قاطع 480 فولت',
      required: false,
      enabled: true
    }
  ],
  noticeBanner: 'تنبيه إداري إلزامي: اجتماع وقفة السلامة الميدانية اليوم الساعة 14:00 لمراجعة مستهدف صفر حوادث.',
  pageSections: {
    worker: [
      { id: 'sec_worker_welcome', titleAr: 'شريط الترحيب والاتصال بغرفة العمليات', descriptionAr: 'شريط الحالة العلوية ومعلومات العامل ورابط القناة الفورية', visible: true, order: 1 },
      { id: 'sec_worker_hazard_icons', titleAr: 'شبكة أيقونات تصنيف المخاطر الميدانية السريعة', descriptionAr: 'أزرار الأيقونات المصورة للتبليغ الفوري عن الخطر', visible: true, order: 2 },
      { id: 'sec_worker_form_inputs', titleAr: 'خانات تعبئة بيانات البلاغ (العنوان والوصف والموقع)', descriptionAr: 'حقول الإدخال النصية لتفاصيل الخطر ورقم الموقع', visible: true, order: 3 },
      { id: 'sec_worker_custom_fields', titleAr: 'الخانات الميدانية الإضافية (الوردية، المقاول، رمز المعدة)', descriptionAr: 'حقول إضافية يديرها مدير النظام', visible: true, order: 4 },
      { id: 'sec_worker_media_upload', titleAr: 'مساحة إرفاق الصور والتوثيق الميداني بالكاميرا', descriptionAr: 'رفع صور الإثبات الميداني وحساب البونص الإضافي', visible: true, order: 5 },
      { id: 'sec_worker_rewards_wall', titleAr: 'مساحة برنامج المكافآت والحوافز ولوحة أبطال السلامة', descriptionAr: 'عرض رصيد النقاط والمستويات ودليل الجوائز المتاحة', visible: true, order: 6 }
    ],
    hse: [
      { id: 'sec_hse_header', titleAr: 'شريط ترويسة مركز عمليات HSE وأزرار الإجراءات', descriptionAr: 'العنوان الرئيسي، التنبيه الصوتي وتصدير ملفات البيانات', visible: true, order: 1 },
      { id: 'sec_hse_notice_banner', titleAr: 'إشعار إدارة HSE التشغيلي المعتمد', descriptionAr: 'الإشعار التنبيهي الصادر لإدارة السلامة والصحة المهنية', visible: true, order: 2 },
      { id: 'sec_hse_fastest_officer', titleAr: 'وسام وبطاقة مسؤول السلامة الأسرع في المعالجة الفورية المباشرة', descriptionAr: 'تكريم م. خالد السويدي بالمعالجة المستقلة خلال 1.8 دقيقة', visible: true, order: 3 },
      { id: 'sec_hse_kpi_cards', titleAr: 'شريط بطاقات مؤشرات الأداء الحيوية (KPIs)', descriptionAr: 'إجمالي البلاغات، الحالات الحرجة، قيد المعالجة، والمنجزة', visible: true, order: 4 },
      { id: 'sec_hse_search_filters', titleAr: 'مساحة البحث والتصفية حسب الخطورة والحالة', descriptionAr: 'شريط البحث الفوري والتبويب حسب تصنيف الخطورة', visible: true, order: 5 },
      { id: 'sec_hse_reports_feed', titleAr: 'جدول وسجل البلاغات الميدانية النشطة والمعالجة', descriptionAr: 'قائمة بطاقات البلاغات والإجراءات التصحيحية المعتمدة', visible: true, order: 6 }
    ],
    gm: [
      { id: 'sec_gm_header', titleAr: 'ترويسة الإدارة العامة والمفاتيح التنفيذية', descriptionAr: 'بيانات المدير العام، اختيار طرق العرض، وإصدار التوجيهات', visible: true, order: 1 },
      { id: 'sec_gm_notice_banner', titleAr: 'إشعار المتابعة الرقابية والتنبيه الحي بصدر الصفحة', descriptionAr: 'تنبيه مباشر للمدير العام بالبلاغات الحرجة المفتوحة', visible: true, order: 2 },
      { id: 'sec_gm_fastest_hero', titleAr: 'وسام التميز القياسي لـ مسؤول السلامة الأسرع معالجة', descriptionAr: 'بطاقة القياس الميداني لسرعة التدخل دون انتظار التوجيهات', visible: true, order: 3 },
      { id: 'sec_gm_kpi_grid', titleAr: 'شبكة مقاييس الأداء الرقابي ومؤشرات الاستجابة', descriptionAr: 'نسبة الامتثال، الحالات الحرجة، متوسط سرعة المعالجة', visible: true, order: 4 },
      { id: 'sec_gm_directives_trail', titleAr: 'سجل التوجيهات والأوامر الصادرة لمديري الإدارات', descriptionAr: 'متابعة تنفيذ أوامر المدير العام والتكاليف الميدانية', visible: true, order: 5 },
      { id: 'sec_gm_plant_map', titleAr: 'خريطة المنشأة الصناعية ومواقع مسؤولي HSE', descriptionAr: 'الخريطة التفاعلية لمواقع الفرق الميدانية وتتبع الحالات', visible: true, order: 6 },
      { id: 'sec_gm_officers_table', titleAr: 'جدول تقييم أداء وسرعة مسؤولي HSE الميدانيين', descriptionAr: 'إحصائيات إنجاز مسؤولي السلامة ونسب الإغلاق الناجح', visible: true, order: 7 },
      { id: 'sec_gm_rewards_panel', titleAr: 'لوحة إدارة المكافآت والحوافز وقواعد احتساب النقاط', descriptionAr: 'صرف المكافآت الاستثنائية وتحديد مستويات التكريم', visible: true, order: 8 }
    ]
  },
  hazardIcons: [
    { id: 'icon_electrical', key: 'Electrical', labelAr: 'خطر كهربائي', icon: '⚡', color: 'amber', visible: true, order: 1, defaultTitleAr: 'سلك كهربائي مكشوف أو تماس في لوحة التغذية' },
    { id: 'icon_fall', key: 'Fall Protection', labelAr: 'السقوط والعمل على ارتفاع', icon: '🪜', color: 'rose', visible: true, order: 2, defaultTitleAr: 'سقالة غير مثبتة أو غياب حواجز الحماية العلوية' },
    { id: 'icon_chemical', key: 'Chemical / Toxic', labelAr: 'تسرب كيميائي وغازات', icon: '☣️', color: 'purple', visible: true, order: 3, defaultTitleAr: 'رائحة غاز نفاذة أو تسرب مادة كيميائية في الخط' },
    { id: 'icon_machinery', key: 'Heavy Machinery', labelAr: 'آليات ومعدات ثقيلة ورافعات', icon: '🚜', color: 'orange', visible: true, order: 4, defaultTitleAr: 'رافعة شوكية مسرعة أو عطل في منبه الرجوع للخلف' },
    { id: 'icon_slip', key: 'Slip / Trip / Fall', labelAr: 'انزلاق وتعثر وسوائل', icon: '💦', color: 'blue', visible: true, order: 5, defaultTitleAr: 'بقعة زيت أو سائل هيدروليكي زلق في الممر' },
    { id: 'icon_fire', key: 'Fire Hazard', labelAr: 'خطر حريق وانفجار', icon: '🔥', color: 'red', visible: true, order: 6, defaultTitleAr: 'اسطوانات غاز غير مؤمنة أو دخان قرب منطقة ساخنة' },
    { id: 'icon_ppe', key: 'PPE Compliance', labelAr: 'مخالفة مهمات الوقاية (PPE)', icon: '🦺', color: 'emerald', visible: true, order: 7, defaultTitleAr: 'عامل بدون خوذة أو حزام أمان أثناء الصعود' },
    { id: 'icon_housekeeping', key: 'Housekeeping', labelAr: 'انسداد مخارج ومسارات الطوارئ', icon: '🚪', color: 'cyan', visible: true, order: 8, defaultTitleAr: 'طرود وبضائع تسد باب مخرج الطوارئ الجنوبي' },
    { id: 'icon_other', key: 'Other', labelAr: 'خطر ميداني مخصص غير مدرج', icon: '✍️', color: 'slate', visible: true, order: 9, defaultTitleAr: 'ملاحظة خطر ميداني غير مدرج بالقائمة أعلاه' }
  ],
  formFields: [
    { id: 'fld_category', key: 'category', labelAr: 'تصنيف ونوع الخطر الميداني', descriptionAr: 'اختيار نوع الخطر عبر الأيقونة المباشرة', visible: true, required: true, order: 1 },
    { id: 'fld_title', key: 'title', labelAr: 'عنوان ومسمى الخطر المرصود', descriptionAr: 'وصف موجز للملاحظة الميدانية', visible: true, required: true, order: 2 },
    { id: 'fld_zone', key: 'zone', labelAr: 'المنطقة والموقع الميداني (تحديد الموقع)', descriptionAr: 'تحديد محطة العمل والإحداثيات الميدانية', visible: true, required: true, order: 3 },
    { id: 'fld_description', key: 'description', labelAr: 'الشرح والوصف التفصيلي للخطر', descriptionAr: 'تفاصيل الحالة مع خيار الإملاء الصوتي المباشر', visible: true, required: false, order: 4 },
    { id: 'fld_photos', key: 'photos', labelAr: 'إرفاق وتوثيق الصور بالكاميرا', descriptionAr: 'إضافة دليل بصري بونص +25 نقطة سلامة', visible: true, required: false, order: 5 },
    { id: 'fld_custom', key: 'custom', labelAr: 'الحقول الميدانية الإلزامية المخصصة', descriptionAr: 'الوردية التشغيلية، فحص المقاول، رمز المعدة', visible: true, required: false, order: 6 }
  ],
  actionIcons: [
    { id: 'act_voice', labelAr: 'أيقونة الإملاء الصوتي المباشر', iconName: 'Mic', visible: true },
    { id: 'act_camera', labelAr: 'أيقونة التقاط ورفع الصور', iconName: 'Camera', visible: true },
    { id: 'act_sound', labelAr: 'أيقونة الإنذار والتنبيه الصوتي', iconName: 'Volume2', visible: true },
    { id: 'act_export', labelAr: 'أيقونة تصدير ملفات البيانات (Excel/CSV)', iconName: 'Download', visible: true },
    { id: 'act_chat', labelAr: 'أيقونة المحادثة والاتصال اللاسلكي الفوري', iconName: 'MessageSquare', visible: true },
    { id: 'act_map', labelAr: 'أيقونة خريطة المنشأة التفاعلية', iconName: 'Map', visible: true },
    { id: 'act_directive', labelAr: 'أيقونة إصدار التوجيهات الإدارية الصريحة', iconName: 'Send', visible: true },
    { id: 'act_resolve', labelAr: 'أيقونة إغلاق البلاغ واعتماد النقاط', iconName: 'CheckCircle2', visible: true },
    { id: 'act_fastest', labelAr: 'وسام مسؤول السلامة الأسرع في المعالجة (⚡)', iconName: 'Zap', visible: true },
    { id: 'act_points', labelAr: 'أيقونة وعداد رصيد نقاط السلامة (⭐)', iconName: 'Trophy', visible: true }
  ]
};

export const DEMO_USERS: Record<UserRole, UserProfile> = {
  worker: {
    id: 'usr_w_01',
    name: 'أحمد بن منصور الحارثي',
    nameAr: 'أحمد بن منصور الحارثي (العاملين)',
    employeeId: 'EMP-8821',
    role: 'worker',
    phone: '+966 50 123 4567',
    avatar: 'أ.ح',
    safetyPoints: 850,
    safetyRank: 'بطل انعدام الحوادث (المستوى 3)',
    safetyRankAr: 'بطل انعدام الحوادث (المستوى 3)',
    reportsSubmitted: 14
  },
  hse: {
    id: 'usr_h_01',
    name: 'م. سارة بنت عبد الله المهيدب',
    nameAr: 'م. سارة بنت عبد الله المهيدب (مسؤول السلامة والصحة المهنية)',
    employeeId: 'EMP-4105',
    role: 'hse',
    jobTitle: 'كبير أخصائيي السلامة والصحة المهنية والبيئة',
    jobTitleAr: 'كبير أخصائيي السلامة والصحة المهنية والبيئة',
    avatar: 'س.م',
    safetyPoints: 1240,
    safetyRank: 'كبير مسؤولي السلامة والصحة المهنية المعتمدين',
    safetyRankAr: 'كبير مسؤولي السلامة والصحة المهنية المعتمدين',
    reportsSubmitted: 28
  },
  gm: {
    id: 'usr_g_01',
    name: 'م. طارق بن عبد الله المنصور',
    nameAr: 'م. طارق بن عبد الله المنصور (المدير العام)',
    employeeId: 'EMP-1002',
    role: 'gm',
    jobTitle: 'المدير العام والرئيس التنفيذي للمنشأة',
    jobTitleAr: 'المدير العام والرئيس التنفيذي للمنشأة',
    avatar: 'ط.م',
    safetyPoints: 950,
    safetyRank: 'الراعي التنفيذي الأعلى لمنظومة السلامة',
    safetyRankAr: 'الراعي التنفيذي الأعلى لمنظومة السلامة',
    reportsSubmitted: 6
  },
  admin: {
    id: 'usr_a_01',
    name: 'عبد الرحمن بن فهد القحطاني',
    nameAr: 'عبد الرحمن بن فهد القحطاني (مدير النظام)',
    employeeId: 'ADMIN-001',
    role: 'admin',
    jobTitle: 'مدير الأنظمة والمعلومات والرقابة الشاملة',
    jobTitleAr: 'مدير الأنظمة والمعلومات والرقابة الشاملة',
    avatar: 'ع.ق',
    safetyPoints: 1500,
    safetyRank: 'مدير النظام الأعلى',
    safetyRankAr: 'مدير النظام الأعلى',
    reportsSubmitted: 45
  }
};

export const INITIAL_REPORTS: SafetyReport[] = [
  {
    id: 'REP-2026-104',
    timestamp: '2026-09-29 10:45 ص',
    title: 'سلك كهربائي 480 فولت مكشوف يطلق شرارات قرب مصرف برج التبريد',
    titleAr: 'سلك كهربائي 480 فولت مكشوف يطلق شرارات قرب مصرف برج التبريد',
    description: 'أثناء الجولة الصباحية، لوحظ تساقط رذاذ ماء من خط الصرف رقم 3 مباشرة على صندوق توصيل كهربائي 480 فولت غير معزول جيداً، مع تصاعد شرر كهربائي ورائحة أوزون نفاذة.',
    descriptionAr: 'أثناء الجولة الصباحية، لوحظ تساقط رذاذ ماء من خط الصرف رقم 3 مباشرة على صندوق توصيل كهربائي 480 فولت غير معزول جيداً، مع تصاعد شرر كهربائي ورائحة أوزون نفاذة.',
    category: 'خطر كهربائي',
    categoryAr: 'خطر كهربائي',
    siteZone: 'محطة التكرير ومعالجة الغاز (ST-01)',
    siteZoneAr: 'محطة التكرير ومعالجة الغاز (ST-01)',
    location: {
      lat: 24.6879,
      lng: 46.7223,
      address: 'محطة التكرير، خليج التبريد ب الشمالي، بجوار مضخات الخط 3',
      addressAr: 'محطة التكرير، خليج التبريد ب الشمالي، بجوار مضخات الخط 3',
      accuracy: 4
    },
    photos: [
      'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=600&q=80'
    ],
    reporter: {
      id: 'usr_w_01',
      name: 'أحمد بن منصور الحارثي',
      nameAr: 'أحمد بن منصور الحارثي (العاملين)',
      employeeId: 'EMP-8821',
      phone: '+966 50 123 4567',
      role: 'worker'
    },
    aiAssessment: {
      severity: 'critical',
      score: 96,
      hazardType: 'قوس كهربائي عالي الجهد وخطر صعق مميت',
      hazardTypeAr: 'قوس كهربائي عالي الجهد وخطر صعق مميت',
      standardRef: 'معيار السلامة الكهربائية OSHA 1910.303 و NFPA 70E',
      standardRefAr: 'معيار السلامة الكهربائية OSHA 1910.303 و NFPA 70E',
      potentialConsequences: 'حدوث قوس وميضي كارثي، صعق كهربائي مميت للعاملين، أو خروج محولات المصنع عن الخدمة.',
      potentialConsequencesAr: 'حدوث قوس وميضي كارثي، صعق كهربائي مميت للعاملين، أو خروج محولات المصنع عن الخدمة.',
      recommendedAction: 'فصل وتأمين الطاقة فوراً بنظام LOTO للمغذي رقم 4، وإحاطة الموقع بحزام أمان دائري نصف قطره 15 متراً.',
      recommendedActionAr: 'فصل وتأمين الطاقة فوراً بنظام LOTO للمغذي رقم 4، وإحاطة الموقع بحزام أمان دائري نصف قطره 15 متراً.',
      hierarchyOfControl: 'Elimination',
      hierarchyOfControlAr: 'الإزالة الكاملة لمصدر الخطر (Elimination)',
      confidenceScore: 98,
      analyzedAt: '10:46 ص'
    },
    status: 'investigating',
    assignedHse: {
      id: 'officer_khalid',
      name: 'م. خالد بن سلطان السويدي',
      nameAr: 'م. خالد بن سلطان السويدي (الأسرع في المعالجة الفورية المباشرة)',
      jobTitle: 'كبير أخصائيي الاستجابة الفورية والتدخل الوقائي السريع',
      jobTitleAr: 'كبير أخصائيي الاستجابة الفورية والتدخل الوقائي السريع'
    },
    gmDirectives: [
      {
        id: 'dir_1',
        directive: 'أمر إداري ملزم: إيقاف وتأمين قاطع مضخات برج التبريد 3 فوراً، ويمنع تشغيل الوردية الثانية دون توقيع مشترك.',
        directiveAr: 'أمر إداري ملزم: إيقاف وتأمين قاطع مضخات برج التبريد 3 فوراً، ويمنع تشغيل الوردية الثانية دون توقيع مشترك.',
        timestamp: '10:52 ص',
        author: 'م. طارق المنصور (المدير العام)',
        authorAr: 'م. طارق المنصور (المدير العام)'
      }
    ],
    correctiveActions: [
      {
        id: 'ca_1',
        note: 'تدخل فوري ذاتي ومستقل من مسؤول السلامة م. خالد السويدي دون انتظار التوجيهات وفق اشتراطات السلامة: عزل القاطع وتركيب غطاء عازل LOTO خلال 1.8 دقيقة.',
        noteAr: 'تدخل فوري ذاتي ومستقل من مسؤول السلامة م. خالد السويدي دون انتظار التوجيهات وفق اشتراطات السلامة: عزل القاطع وتركيب غطاء عازل LOTO خلال 1.8 دقيقة.',
        author: 'م. خالد بن سلطان السويدي',
        authorAr: 'م. خالد بن سلطان السويدي (مسؤول السلامة الأسرع معالجة)',
        timestamp: '10:48 ص'
      }
    ],
    customFieldValues: {
      field_shift: 'الوردية 1 (الصباحية: 06:00 - 14:00)',
      field_contractor: false,
      field_machinery_id: 'مضخة التبريد 03'
    }
  },
  {
    id: 'REP-2026-103',
    timestamp: '2026-09-29 09:20 ص',
    title: 'سقالة في الطابق الرابع تفتقر لحاجز القدم وحبل الأمان الثانوي',
    titleAr: 'سقالة في الطابق الرابع تفتقر لحاجز القدم وحبل الأمان الثانوي',
    description: 'قام مقاول تركيب الأنابيب بنصب منصة السقالة بالطابق الرابع بدون ألواح حماية القدم الإلزامية، مما تسبب في سقوط مفتاح ربط من ارتفاع 8 أمتار كاد يصيب أحد العاملين بالأسفل.',
    descriptionAr: 'قام مقاول تركيب الأنابيب بنصب منصة السقالة بالطابق الرابع بدون ألواح حماية القدم الإلزامية، مما تسبب في سقوط مفتاح ربط من ارتفاع 8 أمتار كاد يصيب أحد العاملين بالأسفل.',
    category: 'السقوط والعمل على ارتفاع',
    categoryAr: 'السقوط والعمل على ارتفاع',
    siteZone: 'ورشة الصيانة الميكانيكية والهيدروليكية (ST-04)',
    siteZoneAr: 'ورشة الصيانة الميكانيكية والهيدروليكية (ST-04)',
    location: {
      lat: 24.6838,
      lng: 46.7235,
      address: 'ورشة الصيانة المركزية، منصة السقالات المستوى 4',
      addressAr: 'ورشة الصيانة المركزية، منصة السقالات المستوى 4',
      accuracy: 6
    },
    photos: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80'
    ],
    reporter: {
      id: 'usr_w_02',
      name: 'سعود بن فهد الدوسري',
      nameAr: 'سعود بن فهد الدوسري (العاملين)',
      employeeId: 'EMP-7319',
      phone: '+966 50 887 3211',
      role: 'worker'
    },
    aiAssessment: {
      severity: 'high',
      score: 84,
      hazardType: 'سقوط أدوات من علو وخطر سقوط أفراد',
      hazardTypeAr: 'سقوط أدوات من علو وخطر سقوط أفراد',
      standardRef: 'معيار السقالات الإنشائية OSHA 1926.451',
      standardRefAr: 'معيار السقالات الإنشائية OSHA 1926.451',
      potentialConsequences: 'إصابات قاتلة نتيجة سقوط العدد الثقيلة أو انزلاق وسقوط العامل لعدم وجود حواجز محيطية.',
      potentialConsequencesAr: 'إصابات قاتلة نتيجة سقوط العدد الثقيلة أو انزلاق وسقوط العامل لعدم وجود حواجز محيطية.',
      recommendedAction: 'تعليق البطاقة الحمراء على السقالة (ممنوع الاستخدام)، وتوجيه أمر إيقاف للمقاول لتركيب حواجز القدم وشباك الأمان فوراً.',
      recommendedActionAr: 'تعليق البطاقة الحمراء على السقالة (ممنوع الاستخدام)، وتوجيه أمر إيقاف للمقاول لتركيب حواجز القدم وشباك الأمان فوراً.',
      hierarchyOfControl: 'Engineering',
      hierarchyOfControlAr: 'تحكم هندسي ووقائي (Engineering)',
      confidenceScore: 94,
      analyzedAt: '09:21 ص'
    },
    status: 'action_in_progress',
    assignedHse: {
      id: 'usr_h_01',
      name: 'م. سارة بنت عبد الله المهيدب',
      nameAr: 'م. سارة بنت عبد الله المهيدب',
      jobTitle: 'كبير أخصائيي السلامة والصحة المهنية',
      jobTitleAr: 'كبير أخصائيي السلامة والصحة المهنية'
    },
    gmDirectives: [
      {
        id: 'dir_2',
        directive: 'مراجعة تصريح عمل السقالة وتأمين المقاول، وفرض سجل فحص يومي موقع قبل كل وردية.',
        directiveAr: 'مراجعة تصريح عمل السقالة وتأمين المقاول، وفرض سجل فحص يومي موقع قبل كل وردية.',
        timestamp: '09:35 ص',
        author: 'م. طارق المنصور (المدير العام)',
        authorAr: 'م. طارق المنصور (المدير العام)'
      }
    ],
    correctiveActions: [
      {
        id: 'ca_2',
        note: 'تم تعليق البطاقة الحمراء وإرسال فريق التركيبات لتركيب حواجز فولاذية بارتفاع 4 بوصات وشباك التقاط.',
        noteAr: 'تم تعليق البطاقة الحمراء وإرسال فريق التركيبات لتركيب حواجز فولاذية بارتفاع 4 بوصات وشباك التقاط.',
        author: 'م. سارة بنت عبد الله المهيدب',
        authorAr: 'م. سارة بنت عبد الله المهيدب',
        timestamp: '10:05 ص'
      }
    ],
    customFieldValues: {
      field_shift: 'الوردية 1 (الصباحية: 06:00 - 14:00)',
      field_contractor: true,
      field_machinery_id: 'سقالة المنصة 4'
    }
  },
  {
    id: 'REP-2026-102',
    timestamp: '2026-09-29 08:10 ص',
    title: 'تجمع زيت هيدروليكي زلق على منحدر بوابة التحميل رقم 4',
    titleAr: 'تجمع زيت هيدروليكي زلق على منحدر بوابة التحميل رقم 4',
    description: 'منحدر الرافعة الشوكية بالبوابة 4 يظهر تسرب زيت هيدروليكي بمساحة مترين من الرافعة 12، مما يهدد بانزلاق الرافعة أو سقوط العمال أثناء نقل الحمولات.',
    descriptionAr: 'منحدر الرافعة الشوكية بالبوابة 4 يظهر تسرب زيت هيدروليكي بمساحة مترين من الرافعة 12، مما يهدد بانزلاق الرافعة أو سقوط العمال أثناء نقل الحمولات.',
    category: 'انزلاق وتعثر وسوائل',
    categoryAr: 'انزلاق وتعثر وسوائل',
    siteZone: 'رصيف الشحن والتصدير البحري (ST-03)',
    siteZoneAr: 'رصيف الشحن والتصدير البحري (ST-03)',
    location: {
      lat: 24.6845,
      lng: 46.7305,
      address: 'منحدر الخدمات اللوجستية ورصيف الشحن رقم 4',
      addressAr: 'منحدر الخدمات اللوجستية ورصيف الشحن رقم 4',
      accuracy: 8
    },
    photos: [],
    reporter: {
      id: 'usr_w_03',
      name: 'محمد بن عبد العزيز الشمري',
      nameAr: 'محمد بن عبد العزيز الشمري (العاملين)',
      employeeId: 'EMP-6640',
      role: 'worker'
    },
    aiAssessment: {
      severity: 'medium',
      score: 58,
      hazardType: 'خطر انزلاق وعطل في المنظومة الهيدروليكية',
      hazardTypeAr: 'خطر انزلاق وعطل في المنظومة الهيدروليكية',
      standardRef: 'معيار أسطح العمل والممرات OSHA 1910.22',
      standardRefAr: 'معيار أسطح العمل والممرات OSHA 1910.22',
      potentialConsequences: 'انزلاق وسقوط العاملين متسبباً في إصابات بالعمود الفقري، أو انزلاق الرافعة الشوكية بحمولتها.',
      potentialConsequencesAr: 'انزلاق وسقوط العاملين متسبباً في إصابات بالعمود الفقري، أو انزلاق الرافعة الشوكية بحمولتها.',
      recommendedAction: 'نشر بودرة وحبيبات امتصاص الزيوت فوراً ووضع حواجز تنبيه، وعزل الرافعة رقم 12 لفحص خراطيم الهيدروليك.',
      recommendedActionAr: 'نشر بودرة وحبيبات امتصاص الزيوت فوراً ووضع حواجز تنبيه، وعزل الرافعة رقم 12 لفحص خراطيم الهيدروليك.',
      hierarchyOfControl: 'Administrative',
      hierarchyOfControlAr: 'تحكم إداري وإجرائي (Administrative)',
      confidenceScore: 91,
      analyzedAt: '08:11 ص'
    },
    status: 'resolved',
    assignedHse: {
      id: 'officer_khalid',
      name: 'م. خالد بن سلطان السويدي',
      nameAr: 'م. خالد بن سلطان السويدي',
      jobTitle: 'كبير أخصائيي الاستجابة الفورية والتدخل الوقائي السريع',
      jobTitleAr: 'كبير أخصائيي الاستجابة الفورية والتدخل الوقائي السريع'
    },
    pointsAwarded: 100,
    correctiveActions: [
      {
        id: 'ca_3',
        note: 'معالجة فورية ذاتية: تم تنظيف الزيت بالكامل بمادة ماصة غير سامة، وعزل الرافعة واستبدال الحلقات المطاطية O-ring واعتماد إغلاق الملف.',
        noteAr: 'معالجة فورية ذاتية: تم تنظيف الزيت بالكامل بمادة ماصة غير سامة، وعزل الرافعة واستبدال الحلقات المطاطية O-ring واعتماد إغلاق الملف.',
        author: 'م. خالد بن سلطان السويدي',
        authorAr: 'م. خالد بن سلطان السويدي (الأسرع معالجة)',
        timestamp: '08:45 ص'
      }
    ],
    customFieldValues: {
      field_shift: 'الوردية 1 (الصباحية: 06:00 - 14:00)',
      field_contractor: false,
      field_machinery_id: 'رافعة شوكية 12'
    }
  },
  {
    id: 'REP-2026-101',
    timestamp: '2026-09-28 04:30 م',
    title: 'قضيب فتح مخرج الطوارئ عالق ووجود طرود كرتون تعيق الباب',
    titleAr: 'قضيب فتح مخرج الطوارئ عالق ووجود طرود كرتون تعيق الباب',
    description: 'باب مخرج الطوارئ الجنوبي في ملحق التعبئة كان محاطاً بثلاث بالات كرتون تعيق فتحه بالكامل، ومزلاج الدفع كان يحتاج لقوة غير اعتيادية للفتح.',
    descriptionAr: 'باب مخرج الطوارئ الجنوبي في ملحق التعبئة كان محاطاً بثلاث بالات كرتون تعيق فتحه بالكامل، ومزلاج الدفع كان يحتاج لقوة غير اعتيادية للفتح.',
    category: 'انسداد مخارج ومسارات الطوارئ',
    categoryAr: 'انسداد مخارج ومسارات الطوارئ',
    siteZone: 'مركز العمليات والتحكم المركزي والطوارئ (ST-06)',
    siteZoneAr: 'مركز العمليات والتحكم المركزي والطوارئ (ST-06)',
    location: {
      lat: 24.6895,
      lng: 46.7240,
      address: 'مركز العمليات، باب الطوارئ الجنوبي رقم 2',
      addressAr: 'مركز العمليات، باب الطوارئ الجنوبي رقم 2',
      accuracy: 5
    },
    photos: [],
    reporter: {
      id: 'usr_w_01',
      name: 'أحمد بن منصور الحارثي',
      nameAr: 'أحمد بن منصور الحارثي (العاملين)',
      employeeId: 'EMP-8821',
      role: 'worker'
    },
    aiAssessment: {
      severity: 'low',
      score: 34,
      hazardType: 'إعاقة مسار الهروب وتصلب مزلاج باب الطوارئ',
      hazardTypeAr: 'إعاقة مسار الهروب وتصلب مزلاج باب الطوارئ',
      standardRef: 'معيار مخارج ومسارات الإخلاء OSHA 1910.36',
      standardRefAr: 'معيار مخارج ومسارات الإخلاء OSHA 1910.36',
      potentialConsequences: 'تأخر إخلاء المنشأة في حالات الطوارئ والحرائق وخطر التدافع.',
      potentialConsequencesAr: 'تأخر إخلاء المنشأة في حالات الطوارئ والحرائق وخطر التدافع.',
      recommendedAction: 'نقل بالات الكرتون لمنطقة التدوير، وتشحيم قضيب الدفع وتجربة آلية الفتح التلقائي.',
      recommendedActionAr: 'نقل بالات الكرتون لمنطقة التدوير، وتشحيم قضيب الدفع وتجربة آلية الفتح التلقائي.',
      hierarchyOfControl: 'Administrative',
      hierarchyOfControlAr: 'تحكم إجرائي وتدبيري (Administrative)',
      confidenceScore: 89,
      analyzedAt: '04:32 م'
    },
    status: 'resolved',
    pointsAwarded: 100,
    correctiveActions: [
      {
        id: 'ca_4',
        note: 'تمت إزالة العوائق فوراً وتشحيم المزلاج والتأكد من سهولة فتحه بضغطة واحدة من قبل مشرف الصيانة واعتماد الإغلاق.',
        noteAr: 'تمت إزالة العوائق فوراً وتشحيم المزلاج والتأكد من سهولة فتحه بضغطة واحدة من قبل مشرف الصيانة واعتماد الإغلاق.',
        author: 'م. سارة بنت عبد الله المهيدب',
        authorAr: 'م. سارة بنت عبد الله المهيدب',
        timestamp: '05:15 م'
      }
    ]
  }
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'lb_1',
    name: 'أحمد بن منصور الحارثي',
    employeeId: 'EMP-8821',
    department: 'قسم التوربينات والتشغيل الميداني (العاملين)',
    points: 850,
    verifiedReports: 14,
    badge: 'بطل انعدام الحوادث (المستوى 3)',
    avatar: 'أ.ح'
  },
  {
    id: 'lb_2',
    name: 'سعود بن فهد الدوسري',
    employeeId: 'EMP-7319',
    department: 'تمديدات الأنابيب والمضخات (العاملين)',
    points: 720,
    verifiedReports: 11,
    badge: 'صائد المخاطر (المستوى 2)',
    avatar: 'س.د'
  },
  {
    id: 'lb_3',
    name: 'محمد بن عبد العزيز الشمري',
    employeeId: 'EMP-6640',
    department: 'المستودعات والخدمات اللوجستية (العاملين)',
    points: 640,
    verifiedReports: 9,
    badge: 'صائد المخاطر (المستوى 2)',
    avatar: 'م.ش'
  },
  {
    id: 'lb_4',
    name: 'يوسف بن إبراهيم القاسم',
    employeeId: 'EMP-5512',
    department: 'الصيانة الكهربائية ومفاتيح العزل LOTO (العاملين)',
    points: 510,
    verifiedReports: 7,
    badge: 'حارس السلامة (المستوى 1)',
    avatar: 'ي.ق'
  },
  {
    id: 'lb_5',
    name: 'عمر بن سليمان الحربي',
    employeeId: 'EMP-9024',
    department: 'مختبر فحص الجودة والسلامة الكيميائية (العاملين)',
    points: 490,
    verifiedReports: 6,
    badge: 'حارس السلامة (المستوى 1)',
    avatar: 'ع.ح'
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  // Channel A: Worker <-> HSE
  {
    id: 'msg_1',
    channelId: 'worker_hse',
    senderId: 'usr_w_01',
    senderName: 'أحمد بن منصور الحارثي',
    senderNameAr: 'أحمد بن منصور الحارثي (العاملين)',
    senderRole: 'worker',
    text: 'مرحباً م. سارة، لقد قمت للتو بالإبلاغ عن صندوق 480 فولت الذي يطلق شرارات في خليج التبريد (بلاغ REP-2026-104). الماء يتساقط عليه مباشرة، ووضعت قمع تحذير على بعد 5 أمتار.',
    textAr: 'مرحباً م. سارة، لقد قمت للتو بالإبلاغ عن صندوق 480 فولت الذي يطلق شرارات في خليج التبريد (بلاغ REP-2026-104). الماء يتساقط عليه مباشرة، ووضعت قمع تحذير على بعد 5 أمتار.',
    timestamp: '10:47 ص',
    linkedReportId: 'REP-2026-104',
    isDirectUrgent: true
  },
  {
    id: 'msg_2',
    channelId: 'worker_hse',
    senderId: 'usr_h_01',
    senderName: 'م. سارة بنت عبد الله المهيدب',
    senderNameAr: 'م. سارة بنت عبد الله المهيدب (مسؤول السلامة والصحة المهنية)',
    senderRole: 'hse',
    text: 'رصد ممتاز يا أحمد! تراجع للخلف فوراً مسافة 15 متراً على الأقل ولا تلمس أي درابزين معدني. الزميل م. خالد السويدي بالموقع الآن ويباشر العزل الفوري، وتم إخطار غرفة العمليات والمدير العام.',
    textAr: 'رصد ممتاز يا أحمد! تراجع للخلف فوراً مسافة 15 متراً على الأقل ولا تلمس أي درابزين معدني. الزميل م. خالد السويدي بالموقع الآن ويباشر العزل الفوري، وتم إخطار غرفة العمليات والمدير العام.',
    timestamp: '10:49 ص',
    linkedReportId: 'REP-2026-104'
  },
  {
    id: 'msg_3',
    channelId: 'worker_hse',
    senderId: 'usr_w_01',
    senderName: 'أحمد بن منصور الحارثي',
    senderNameAr: 'أحمد بن منصور الحارثي (العاملين)',
    senderRole: 'worker',
    text: 'علم ومفهوم. سأظل متمركزاً عند مدخل الممر الرئيسي لمنع أي شخص من الاقتراب حتى اكتمال عزل القاطع الكهربائي ووصول الدعم.',
    textAr: 'علم ومفهوم. سأظل متمركزاً عند مدخل الممر الرئيسي لمنع أي شخص من الاقتراب حتى اكتمال عزل القاطع الكهربائي ووصول الدعم.',
    timestamp: '10:50 ص'
  },
  // Channel B: HSE <-> GM
  {
    id: 'msg_4',
    channelId: 'hse_gm',
    senderId: 'usr_h_01',
    senderName: 'م. سارة بنت عبد الله المهيدب',
    senderNameAr: 'م. سارة بنت عبد الله المهيدب (مسؤول السلامة والصحة المهنية)',
    senderRole: 'hse',
    text: 'سعادة المدير العام م. طارق، تصعيد للبلاغ REP-2026-104: شرر كهربائي 480 فولت مع تسرب مياه ببرج التبريد 3. باشر الزميل م. خالد السويدي المعالجة الفورية المباشرة وعزل القاطع استناداً لاشتراطات السلامة.',
    textAr: 'سعادة المدير العام م. طارق، تصعيد للبلاغ REP-2026-104: شرر كهربائي 480 فولت مع تسرب مياه ببرج التبريد 3. باشر الزميل م. خالد السويدي المعالجة الفورية المباشرة وعزل القاطع استناداً لاشتراطات السلامة.',
    timestamp: '10:51 ص',
    linkedReportId: 'REP-2026-104',
    isDirectUrgent: true
  },
  {
    id: 'msg_5',
    channelId: 'hse_gm',
    senderId: 'usr_g_01',
    senderName: 'م. طارق بن عبد الله المنصور',
    senderNameAr: 'م. طارق بن عبد الله المنصور (المدير العام)',
    senderRole: 'gm',
    text: 'معتمد فوراً. تصرف سليم ومثالي من مسؤول السلامة م. خالد السويدي بالمعالجة الفورية المستقلة وفق الصلاحيات المعيارية دون تأخير. يمنع تشغيل الوردية الثانية دون شهادة فحص معتمدة.',
    textAr: 'معتمد فوراً. تصرف سليم ومثالي من مسؤول السلامة م. خالد السويدي بالمعالجة الفورية المستقلة وفق الصلاحيات المعيارية دون تأخير. يمنع تشغيل الوردية الثانية دون شهادة فحص معتمدة.',
    timestamp: '10:53 ص',
    linkedReportId: 'REP-2026-104'
  },
  {
    id: 'msg_6',
    channelId: 'hse_gm',
    senderId: 'usr_h_01',
    senderName: 'م. سارة بنت عبد الله المهيدب',
    senderNameAr: 'م. سارة بنت عبد الله المهيدب (مسؤول السلامة والصحة المهنية)',
    senderRole: 'hse',
    text: 'تم التأكيد. تم قفل قاطع المحطة الفرعية بنجاح بواسطة م. خالد السويدي في وقت قياسي (1.8 دقيقة) وفريق الكهرباء بالموقع حالياً لإنهاء التمديد المدرع الجديد.',
    textAr: 'تم التأكيد. تم قفل قاطع المحطة الفرعية بنجاح بواسطة م. خالد السويدي في وقت قياسي (1.8 دقيقة) وفريق الكهرباء بالموقع حالياً لإنهاء التمديد المدرع الجديد.',
    timestamp: '11:02 ص',
    linkedReportId: 'REP-2026-104'
  }
];

export const SAMPLE_HAZARD_PHOTOS = [
  {
    title: 'كابل كهربائي مكشوف يطلق شرارات',
    titleAr: 'كابل كهربائي مكشوف يطلق شرارات',
    url: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=600&q=80',
    description: 'صندوق توصيل كهربائي عالي الجهد متآكل ويتساقط عليه رذاذ ماء.'
  },
  {
    title: 'سقالة مرتفعة تفتقر لحاجز القدم وحبل الأمان',
    titleAr: 'سقالة مرتفعة تفتقر لحاجز القدم وحبل الأمان',
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
    description: 'غياب حاجز الحماية الأوسط ولوح القدم الإلزامي على ارتفاع 8 أمتار.'
  },
  {
    title: 'تسرب زيوت هيدروليكية زلقة على المنحدر',
    titleAr: 'تسرب زيوت هيدروليكية زلقة على المنحدر',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    description: 'بقعة زيت هيدروليكي زلقة حول مسار حركة الرافعات الشوكية.'
  },
  {
    title: 'انسداد مخرج الطوارئ ببالات كرتون',
    titleAr: 'انسداد مخرج الطوارئ ببالات كرتون',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
    description: 'طرود وبضائع تعيق فتح باب مخرج الطوارئ المزدوج.'
  }
];
