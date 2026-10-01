import { Language } from '../context/LanguageContext';
import { AIAssessmentResult, ReportStatus, SafetyReport, Severity, UserRole } from '../types';

export const CATEGORY_MAP: Record<string, { en: string; ar: string; icon: string; defaultTitleAr: string; defaultTitleEn: string }> = {
  Electrical: {
    en: 'Electrical Hazard',
    ar: 'خطر كهربائي',
    icon: '⚡',
    defaultTitleAr: 'سلك كهربائي مكشوف أو تماس في لوحة التغذية',
    defaultTitleEn: 'Exposed electrical wiring or sparking breaker'
  },
  'Fall Protection': {
    en: 'Fall & Scaffolding',
    ar: 'السقوط والعمل على ارتفاع',
    icon: '🪜',
    defaultTitleAr: 'سقالة غير مثبتة أو غياب حواجز الحماية العلوية',
    defaultTitleEn: 'Unsecured scaffolding or missing perimeter guardrail'
  },
  'Chemical / Toxic': {
    en: 'Chemical & Gas Leak',
    ar: 'تسرب كيميائي وغازات',
    icon: '☣️',
    defaultTitleAr: 'رائحة غاز نفاذة أو تسرب مادة كيميائية في الخط',
    defaultTitleEn: 'Pungent gas odor or chemical substance leak'
  },
  'Heavy Machinery': {
    en: 'Heavy Machinery & Forklifts',
    ar: 'آليات ومعدات ثقيلة ورافعات',
    icon: '🚜',
    defaultTitleAr: 'رافعة شوكية مسرعة أو عطل في منبه الرجوع للخلف',
    defaultTitleEn: 'Forklift speeding or defective reverse warning alarm'
  },
  'Slip / Trip / Fall': {
    en: 'Slip, Trip & Fluid Spill',
    ar: 'انزلاق وتعثر وسوائل',
    icon: '💦',
    defaultTitleAr: 'بقعة زيت أو سائل هيدروليكي زلق في الممر',
    defaultTitleEn: 'Oil or hydraulic fluid puddle in walkway'
  },
  'Fire Hazard': {
    en: 'Fire & Explosion Risk',
    ar: 'خطر حريق وانفجار',
    icon: '🔥',
    defaultTitleAr: 'اسطوانات غاز غير مؤمنة أو دخان قرب منطقة ساخنة',
    defaultTitleEn: 'Unsecured gas cylinders or smoke near hot work'
  },
  'PPE Compliance': {
    en: 'PPE Non-Compliance',
    ar: 'مخالفة مهمات الوقاية (PPE)',
    icon: '🦺',
    defaultTitleAr: 'عامل بدون خوذة أو حزام أمان أثناء الصعود',
    defaultTitleEn: 'Worker without helmet or fall harness at elevation'
  },
  Housekeeping: {
    en: 'Emergency Egress & Housekeeping',
    ar: 'انسداد مخارج ومسارات الطوارئ',
    icon: '🚪',
    defaultTitleAr: 'طرود وبضائع تسد باب مخرج الطوارئ الجنوبي',
    defaultTitleEn: 'Pallets obstructing south emergency exit doorway'
  },
  Other: {
    en: 'Other Hazard (Custom)',
    ar: 'أخرى (خطر مخصص غير مدرج)',
    icon: '✍️',
    defaultTitleAr: 'ملاحظة خطر ميداني غير مدرج بالقائمة أعلاه',
    defaultTitleEn: 'Unlisted custom field hazard observation'
  }
};

export const ZONE_MAP: Record<string, { en: string; ar: string }> = {
  'Zone 1: Logistics & Warehouse Hub': {
    en: 'Zone 1: Logistics & Warehouse Hub',
    ar: 'المنطقة 1: مستودعات الشحن والخدمات اللوجستية'
  },
  'Zone 2: Catalytic Cracking Reactor': {
    en: 'Zone 2: Catalytic Cracking Reactor',
    ar: 'المنطقة 2: مفاعل التكسير الحفزي ووحدات الضغط'
  },
  'Zone 3: Finishing & Packaging': {
    en: 'Zone 3: Finishing & Packaging',
    ar: 'المنطقة 3: خطوط الإنهاء والتعبئة والتغليف'
  },
  'Zone 4: Cooling Towers & Pump House': {
    en: 'Zone 4: Cooling Towers & Pump House',
    ar: 'المنطقة 4: أبراج التبريد ومحطة المضخات المركزية'
  },
  'Zone 5: Chemical Storage Annex': {
    en: 'Zone 5: Chemical Storage Annex',
    ar: 'المنطقة 5: مستودع تخزين المواد الكيميائية الخطرة'
  },
  'Zone 6: Structural Scaffolding Bay': {
    en: 'Zone 6: Structural Scaffolding Bay',
    ar: 'المنطقة 6: ساحة أعمال السقالات والصيانة الإنشائية'
  }
};

export const STATUS_MAP: Record<ReportStatus, { en: string; ar: string }> = {
  open: { en: 'Open Incident', ar: 'مفتوح جديد' },
  investigating: { en: 'Under Investigation', ar: 'قيد المعاينة والفحص' },
  action_in_progress: { en: 'Action in Progress', ar: 'الإجراء التصحيحي جارٍ' },
  resolved: { en: 'Resolved & Verified', ar: 'تمت المعالجة والإغلاق' }
};

export const SEVERITY_MAP: Record<Severity, { en: string; ar: string }> = {
  critical: { en: 'CRITICAL', ar: 'حرج جداً' },
  high: { en: 'HIGH', ar: 'مرتفع' },
  medium: { en: 'MEDIUM', ar: 'متوسط' },
  low: { en: 'LOW', ar: 'منخفض' }
};

export const ROLE_MAP: Record<UserRole, { en: string; ar: string }> = {
  worker: { en: 'Field Workers', ar: 'العاملين' },
  hse: { en: 'HSE Officer', ar: 'مسؤول السلامة والصحة المهنية (HSE)' },
  gm: { en: 'General Manager', ar: 'المدير العام (GM)' },
  admin: { en: 'System Administrator', ar: 'مدير النظام (Admin)' }
};

export function getLocalizedCategory(catKey: string, lang: Language): string {
  const match = CATEGORY_MAP[catKey];
  if (match) return lang === 'ar' ? match.ar : match.en;
  return catKey;
}

export function getLocalizedZone(zoneKey: string, lang: Language): string {
  const match = ZONE_MAP[zoneKey];
  if (match) return lang === 'ar' ? match.ar : match.en;
  return zoneKey;
}

export function getLocalizedStatus(status: ReportStatus, lang: Language): string {
  const match = STATUS_MAP[status];
  if (match) return lang === 'ar' ? match.ar : match.en;
  return status;
}

export function getLocalizedSeverity(sev: Severity, lang: Language): string {
  const match = SEVERITY_MAP[sev];
  if (match) return lang === 'ar' ? match.ar : match.en;
  return sev;
}

export function getLocalizedRole(role: UserRole, lang: Language): string {
  const match = ROLE_MAP[role];
  if (match) return lang === 'ar' ? match.ar : match.en;
  return role;
}

export function getLocalizedReportTitle(report: SafetyReport, lang: Language): string {
  if (lang === 'ar' && report.titleAr) return report.titleAr;
  return report.title;
}

export function getLocalizedReportDesc(report: SafetyReport, lang: Language): string {
  if (lang === 'ar' && report.descriptionAr) return report.descriptionAr;
  return report.description;
}

export function getLocalizedHazardType(ai: AIAssessmentResult | undefined, lang: Language): string {
  if (!ai) return '';
  if (lang === 'ar' && ai.hazardTypeAr) return ai.hazardTypeAr;
  return ai.hazardType;
}

export function getLocalizedRecommendedAction(ai: AIAssessmentResult | undefined, lang: Language): string {
  if (!ai) return '';
  if (lang === 'ar' && ai.recommendedActionAr) return ai.recommendedActionAr;
  return ai.recommendedAction;
}

export function getLocalizedConsequences(ai: AIAssessmentResult | undefined, lang: Language): string {
  if (!ai) return '';
  if (lang === 'ar' && ai.potentialConsequencesAr) return ai.potentialConsequencesAr;
  return ai.potentialConsequences;
}
