import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ar';

interface LanguageContextType {
  language: 'ar';
  direction: 'rtl';
  toggleLanguage: () => void;
  setLanguage: (lang: 'ar') => void;
  t: (key: string) => string;
}

const arabicTranslations: Record<string, string> = {
  // App & Branding
  app_name: 'STOP',
  app_full_name: 'STOP (منصة تتبع وملاحظة السلامة)',
  app_tagline: 'النظام المؤسسي للاستجابة الاستباقية للسلامة والحد من الحوادث',
  portal_worker: 'بوابة العاملين',
  portal_hse: 'بوابة مسؤول السلامة والصحة المهنية (HSE)',
  portal_gm: 'بوابة المدير العام (GM)',
  switch_role: 'تبديل الصلاحية',
  sign_out: 'تسجيل الخروج',
  light_mode: 'الوضع النهاري',
  dark_mode: 'الوضع الليلي',
  admin_cms: 'لوحة التحكم CMS',
  language_label: 'العربية',
  safety_first: 'صفر حوادث · صلاحية إيقاف العمل الفوري (Stop-Work Authority)',

  // Worker Simple Flow
  worker_simple_mode: 'واجهة الرصد الميداني السريع (تصفح الأيقونات)',
  worker_simple_sub: 'واجهة بسيطة من 3 خطوات ملموسة: رصد بالرمز، توثيق فوري بالصوت والصورة، وإرسال مع تأكيد استلام رسمي',
  step1_observe: '1. اختر نوع الخطر المرصود (اضغط على الرمز)',
  step2_document: '2. وثّق الملاحظة (صوت + صورة + إحداثيات GPS)',
  step3_send: '3. إرسال البلاغ لغرفة العمليات المركزية',
  voice_hold_speak: 'تسجيل الملاحظة بالصوت (إملاء ذكي)',
  voice_listening: 'جارٍ الاستماع... (تحدث بوصف الخطر بدقة)',
  voice_stop: 'إيقاف الميكروفون',
  gps_tap_lock: 'تحديد موقع الخطر تلقائياً (GPS)',
  gps_detected: 'تم قفل الموقع بالأقمار الصناعية',
  camera_tap_photo: 'التقاط أو إرفاق صورة توثيقية',
  quick_sample_photos: 'نماذج صور جاهزة للمعاينة',
  send_now: 'إرسال البلاغ فوراً إلى غرفة العمليات 🚀',
  sending: 'جارٍ نقل البلاغ والتحليل بالذكاء الاصطناعي...',
  report_near_miss: 'الإبلاغ عن حادث وشيك / ملاحظة سلامة',
  incident_title: 'عنوان الملاحظة / الخطر',
  incident_title_placeholder: 'مثال: سلك كهربائي مكشوف بالقرب من تجمع مياه في وحدة التبريد',
  description: 'الوصف التفصيلي والملابسات',
  description_placeholder: 'صف ما لاحظته بدقة، ما كاد أن يقع، وأي تدبير فوري قمت به لحماية الزملاء...',
  category: 'تصنيف نوع الخطر',
  site_zone: 'المنطقة أو الموقع في المنشأة',
  custom_fields: 'بيانات الوردية والتشغيل',

  // Delivery Confirmation Modal & Receipt
  delivery_confirmed_title: 'تم استلام وتأكيد وصول البلاغ بنجاح!',
  delivery_confirmed_sub: 'إشعار استلام وتثبيت رسمي بغرفة العمليات',
  delivery_status_delivered: 'وصل البلاغ فوراً إلى مسؤول السلامة والصحة المهنية (HSE) ومكتب المدير العام',
  delivery_ref_no: 'الرقم المرجعي المعتمد للبلاغ',
  delivery_timestamp: 'وقت وتاريخ الاستلام المؤكد',
  delivery_points_awarded: 'نقاط السلامة المستحقة (تُمنح بعد إغلاق الملف واعتماد الإجراءات التصحيحية)',
  delivery_new_total: 'إجمالي رصيد نقاطك الحالي',
  delivery_alert_status: 'تم تفعيل الإنذار الصوتي الميداني والإشعار الفوري',
  delivery_action_chat: 'محادثة فورية مع مسؤول السلامة والصحة المهنية حول هذا البلاغ',
  delivery_action_another: 'رصد وتسجيل بلاغ ميداني آخر',
  delivery_action_view: 'عرض ملف البلاغ بالكامل',

  // AI Assessment
  ai_risk_assessment: 'التقييم الذكي الفوري لشدة الخطورة (AI)',
  ai_severity: 'مستوى الخطورة المقدر',
  ai_score: 'مؤشر الخطورة الرقمي',
  ai_standard: 'المعيار المرجعي (OSHA / ISO)',
  ai_consequences: 'العواقب المحتملة في حال عدم التدارك',
  ai_recommended_action: 'الإجراء الفوري الموصى به',
  ai_hierarchy: 'مستوى التحكم الهرمي',
  severity_critical: 'حرج جداً (CRITICAL)',
  severity_high: 'مرتفع (HIGH)',
  severity_medium: 'متوسط (MEDIUM)',
  severity_low: 'منخفض (LOW)',

  // Gamification
  safety_points: 'نقاط السلامة المهنية',
  wall_of_fame: 'لوحة شرف أبطال السلامة',
  bonus_breakdown: 'مكافآت التميز والتقييم السنوي',
  reports_submitted: 'البلاغات الموثقة',
  safety_rank: 'رتبة السلامة',
  points_explainer: 'نظام حوافز السلامة: لا يتم منح النقاط إلا بعد إغلاق الملف والتأكد التام من اتخاذ الإجراءات التصحيحية واعتمادها ميدانياً.',
  tier1_badge: 'حارس السلامة (المستوى 1)',
  tier2_badge: 'صائد المخاطر (المستوى 2)',
  tier3_badge: 'بطل انعدام الحوادث (المستوى 3)',

  // HSE & GM Workflows
  live_feed: 'البث الحي للبلاغات والملاحظات الميدانية',
  filter_all: 'جميع البلاغات',
  filter_open: 'مفتوح جديد',
  filter_investigating: 'قيد المعاينة والفحص',
  filter_action: 'الإجراء التصحيحي جارٍ',
  filter_resolved: 'تمت المعالجة والإغلاق',
  take_action: 'اتخاذ إجراء / معالجة',
  issue_directive: 'إصدار توجيه تنفيذي (GM)',
  reassign: 'إعادة إسناد لمسؤول سلامة وصحة مهنية آخر',
  add_corrective_note: 'إضافة تقرير تصحيحي',
  corrective_actions_log: 'سجل الإجراءات التصحيحية الميدانية',
  gm_directives_log: 'التوجيهات والقرارات الصادرة من الإدارة العليا',
  resolved_stamp: 'معتمد ومغلق نهائياً',
  export_csv: 'تصدير التقرير (CSV)',
  sound_alert_active: 'التنبيه الصوتي مفعّل',
  sound_mute: 'كتم الإنذارات الصوتية',
  sound_unmute: 'تفعيل التنبيهات الصوتية',
  test_audio: 'اختبار نغمة الإنذار',
  reporter: 'مقدّم البلاغ',
  assigned_officer: 'مسؤول السلامة والصحة المهنية المسند إليه',
  workflow_status: 'مسار حالة البلاغ',
  evidence_photos: 'الصور المرفقة للتوثيق الميداني',
  no_photos: 'لا توجد صور مرفقة',

  // Chat
  chat_system: 'مركز المحادثات والتوجيه الفوري',
  channel_worker_hse: 'القناة أ: العاملين ⇄ إدارة السلامة والصحة المهنية',
  channel_hse_gm: 'القناة ب: فريق السلامة ⇄ المدير العام (GM)',
  chat_linked_report: 'مرتبط بالبلاغ رقم',
  type_message: 'اكتب رسالة أو توجيهاً ميدانياً عاجلاً...',
  send: 'إرسال',
  quick_directives: 'توجيهات وإيعازات سريعة جاهزة',
  unread: 'غير مقروءة',

  // Super Admin CMS & Pantone
  super_admin_title: 'لوحة التحكم المتقدمة الفائقة (Super Admin CMS)',
  admin_pin_required: 'أدخل رمز الأمان السري للوحة التحكم',
  pin_hint: 'الرمز الافتراضي: 0000 (يتم إظهاره بالضغط 5 مرات متتالية على شعار STOP)',
  unlock: 'فتح لوحة التحكم',
  branding_theme: 'الهوية البصرية وألوان بانتون (Pantone)',
  pantone_picker: 'منتقي درجات بانتون الصناعية المعتمدة',
  custom_color: 'تحديد لون مخصص (Hex)',
  feature_flags: 'التحكم في ظهور الميزات للبوابات الثلاث',
  custom_form_builder: 'محرر الحقول المخصصة لنموذج البلاغات',
  add_new_field: 'إضافة حقل جديد للنموذج',
  field_label: 'اسم الحقل',
  field_type: 'نوع الحقل',
  field_required: 'إلزامي للإرسال',
  reset_defaults: 'استعادة الإعدادات الأصلية',
  save_changes: 'حفظ وتطبيق التغييرات',
  close: 'إغلاق',

  // Field Details Modal & Miscellaneous
  field_description: 'الوصف الميداني التفصيلي',
  ai_safety_analysis: 'التحليل الذكي لإدارة المخاطر',
  risk_score: 'مؤشر الخطورة',
  confidence: 'نسبة الدقة',
  hazard_identified: 'الخطر المرصود بدقة',
  potential_consequences: 'العواقب والمخاطر المحتملة',
  recommended_corrective_action: 'الإجراء التصحيحي الفوري الموصى به',
  control: 'هرم تدابير السيطرة',
  gm_directives: 'توجيهات المدير العام التنفيذية',
  update_status: 'تحديث حالة البلاغ',
  status_updated: 'تم تحديث الحالة بنجاح',
  open_chat_channel: 'فتح قناة المحادثة الفورية',
  incident_dossier: 'ملف توثيق البلاغ الميداني'
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const language: 'ar' = 'ar';
  const direction: 'rtl' = 'rtl';

  useEffect(() => {
    localStorage.setItem('safetypulse_lang', 'ar');
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  }, []);

  const toggleLanguage = () => {
    // English is permanently removed per user request. Always stay Arabic.
  };

  const setLanguage = () => {
    // Stays Arabic
  };

  const t = (key: string): string => {
    return arabicTranslations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
