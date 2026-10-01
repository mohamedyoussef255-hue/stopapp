import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSafety } from '../context/SafetyContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useUIConfig } from '../context/UIConfigContext';
import { assessRiskSeverity } from '../utils/aiRiskEngine';
import { SAMPLE_HAZARD_PHOTOS } from '../utils/mockData';
import { CATEGORY_MAP, ZONE_MAP, getLocalizedCategory, getLocalizedZone } from '../utils/localizationHelper';
import { 
  MapPin, 
  Mic, 
  MicOff, 
  UploadCloud, 
  Camera, 
  Trophy, 
  Award, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  Sparkles, 
  FileText,
  Shield,
  X,
  Send,
  Zap,
  Flame,
  Droplets,
  HardHat,
  DoorOpen,
  Truck,
  Layers,
  Biohazard,
  Check,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkle,
  FileEdit,
  Gift
} from 'lucide-react';
import { SafetyReport, Severity } from '../types';

export const WorkerPortal: React.FC = () => {
  const { currentUser } = useAuth();
  const { addReport, leaderboard, setSelectedReportForModal, openChatWithReport } = useSafety();
  const { pantone } = useTheme();
  const { t, language } = useLanguage();
  const { config } = useUIConfig();

  // Rapid Hazard Selection category
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('Electrical');
  const [customHazardText, setCustomHazardText] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [siteZone, setSiteZone] = useState('Zone 4: Cooling Towers & Pump House');
  
  // Geolocation
  const [location, setLocation] = useState({
    lat: 29.7604,
    lng: -95.3698,
    address: 'Refining Plant - Section B',
    addressAr: 'مجمع التكرير الصناعي - القطاع ب',
    accuracy: 4
  });
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);

  // Photos
  const [photos, setPhotos] = useState<string[]>([]);
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);

  // Voice-to-Text Speech Recognition
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  // Custom field values
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, any>>({
    field_shift: 'Shift 1 (Day: 06:00 - 14:00)',
    field_contractor: false,
    field_machinery_id: ''
  });

  // Official Delivery Confirmation Modal state
  const [confirmedReport, setConfirmedReport] = useState<SafetyReport | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick Hazard Icon Cards configuration
  const hazardIconCards = [
    {
      key: 'Electrical',
      labelEn: 'Electrical',
      labelAr: 'خطر كهربائي',
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      color: 'hover:border-amber-400',
      activeBg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-500',
      defaultAr: 'سلك كهربائي مكشوف أو لوحة كهرباء تطلق شرارات',
      defaultEn: 'Exposed wire or sparking junction box'
    },
    {
      key: 'Fall Protection',
      labelEn: 'Heights & Scaffold',
      labelAr: 'سقالات وارتفاعات',
      icon: <Layers className="w-6 h-6 text-blue-500" />,
      color: 'hover:border-blue-400',
      activeBg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-500',
      defaultAr: 'سقالة تفتقر لحاجز القدم أو حبل أمان مفقود',
      defaultEn: 'Scaffolding missing toe-board or harness'
    },
    {
      key: 'Chemical / Toxic',
      labelEn: 'Gas & Chemicals',
      labelAr: 'غاز ومواد كيميائية',
      icon: <Biohazard className="w-6 h-6 text-rose-500" />,
      color: 'hover:border-rose-400',
      activeBg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-500',
      defaultAr: 'رائحة غاز نفاذة أو تسرب سوائل كيميائية خطرة',
      defaultEn: 'Strong gas smell or toxic liquid release'
    },
    {
      key: 'Heavy Machinery',
      labelEn: 'Machinery & Forklift',
      labelAr: 'آليات ورافعات شوكية',
      icon: <Truck className="w-6 h-6 text-orange-500" />,
      color: 'hover:border-orange-400',
      activeBg: 'bg-orange-50 dark:bg-orange-950/40 border-orange-500',
      defaultAr: 'رافعة شوكية مسرعة أو عطل بمنبه الرجوع للخلف',
      defaultEn: 'Forklift speeding without reverse alarm'
    },
    {
      key: 'Slip / Trip / Fall',
      labelEn: 'Slip & Fluid Spill',
      labelAr: 'انزلاق وزيوت وسوائل',
      icon: <Droplets className="w-6 h-6 text-cyan-500" />,
      color: 'hover:border-cyan-400',
      activeBg: 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-500',
      defaultAr: 'بقعة زيت هيدروليكي زلقة على ممر المشاة',
      defaultEn: 'Hydraulic fluid puddle on walking surface'
    },
    {
      key: 'Fire Hazard',
      labelEn: 'Fire & Explosion',
      labelAr: 'خطر حريق وانفجار',
      icon: <Flame className="w-6 h-6 text-red-500" />,
      color: 'hover:border-red-400',
      activeBg: 'bg-red-50 dark:bg-red-950/40 border-red-500',
      defaultAr: 'اسطوانات غاز غير مؤمنة أو شرر قرب مواد قابلة للاشتعال',
      defaultEn: 'Unsecured gas bottles or sparks near combustibles'
    },
    {
      key: 'PPE Compliance',
      labelEn: 'PPE Non-Compliance',
      labelAr: 'مخالفة مهمات الوقاية',
      icon: <HardHat className="w-6 h-6 text-emerald-500" />,
      color: 'hover:border-emerald-400',
      activeBg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500',
      defaultAr: 'العمل في منطقة الضوضاء بدون واقيات السمع أو بدون خوذة',
      defaultEn: 'Working without earplugs or helmet'
    },
    {
      key: 'Housekeeping',
      labelEn: 'Blocked Exits & Waste',
      labelAr: 'انسداد مخارج ومسارات',
      icon: <DoorOpen className="w-6 h-6 text-purple-500" />,
      color: 'hover:border-purple-400',
      activeBg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-500',
      defaultAr: 'طرود تعيق مخرج الطوارئ أو كابلات ممتدة في الممر',
      defaultEn: 'Pallets obstructing exit door or trip cables'
    },
    {
      key: 'Other',
      labelEn: 'Other (Custom)',
      labelAr: 'أخرى (خطر مخصص)',
      icon: <FileEdit className="w-6 h-6 text-fuchsia-500" />,
      color: 'hover:border-fuchsia-400',
      activeBg: 'bg-fuchsia-50 dark:bg-fuchsia-950/40 border-fuchsia-500',
      defaultAr: '',
      defaultEn: ''
    }
  ];

  // Dynamic hazard icons sorted and filtered by System Administrator (مدير النظام)
  const configuredHazardCards = React.useMemo(() => {
    if (!config.hazardIcons || config.hazardIcons.length === 0) return hazardIconCards;
    const iconMap = new Map(hazardIconCards.map(c => [c.key, c]));
    return config.hazardIcons
      .filter(i => i.visible !== false)
      .sort((a, b) => a.order - b.order)
      .map(conf => {
        const base = iconMap.get(conf.key);
        if (base) {
          return {
            ...base,
            labelAr: conf.labelAr || base.labelAr,
            defaultAr: conf.defaultTitleAr || base.defaultAr
          };
        }
        return {
          key: conf.key,
          labelEn: conf.labelAr,
          labelAr: conf.labelAr,
          icon: <span className="text-lg">{conf.icon}</span>,
          color: 'hover:border-indigo-400',
          activeBg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500',
          defaultAr: conf.defaultTitleAr,
          defaultEn: conf.defaultTitleAr
        };
      });
  }, [config.hazardIcons]);

  // Section and Field visibility helpers controlled by System Administrator
  const isSectionVisible = (sectionId: string) => {
    const sec = config.pageSections?.worker?.find(s => s.id === sectionId);
    return sec ? sec.visible !== false : true;
  };

  const isFieldVisible = (fieldKey: string) => {
    const fld = config.formFields?.find(f => f.key === fieldKey);
    return fld ? fld.visible !== false : true;
  };

  const isActionVisible = (actionId: string) => {
    const act = config.actionIcons?.find(a => a.id === actionId);
    return act ? act.visible !== false : true;
  };

  // Set default title on load or category change if empty
  const handleSelectHazard = (card: typeof hazardIconCards[0]) => {
    setSelectedCategoryKey(card.key);
    if (card.key === 'Other') {
      setTitle(customHazardText || 'خطر ميداني مخصص غير مدرج');
    } else if (!title || hazardIconCards.some(c => c.defaultAr === title || c.defaultEn === title)) {
      setTitle(card.defaultAr);
    }
  };

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionClass) {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'ar-SA';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setDescription(prev => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }
  }, [language]);

  const toggleVoiceDictation = () => {
    if (!recognitionRef.current) {
      simulateMockVoice();
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = 'ar-SA';
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        simulateMockVoice();
      }
    }
  };

  const simulateMockVoice = () => {
    setIsListening(true);
    setTimeout(() => {
      const phrases = [
        'لاحظت وجود كابل تغذية 480 فولت بدون عازل حماية قرب تسريب المياه في وحدة التبريد، مما يهدد بحدوث تماس كهربائي خطير.',
        'لوح السقالة في الطابق الثالث غير مثبت ومفقود حاجز القدم مما تسبب في سقوط مفتاح ربط كاد يصيب أحد العمال المارين بالأسفل.',
        'بقعة زيت هيدروليكي كثيفة على منحدر تحميل الرافعة الشوكية رقم 12 تسببت في انزلاق عجلة المعدة أثناء نقل الحمولات.'
      ];
      const selected = phrases[Math.floor(Math.random() * phrases.length)];
      setDescription(prev => (prev ? `${prev}\n${selected}` : selected));
      setIsListening(false);
    }, 1100);
  };

  // GPS satellite fetch
  const handleFetchGPS = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      setTimeout(() => {
        setLocationSuccess(true);
        setIsLocating(false);
      }, 600);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLocation({
          lat: parseFloat(pos.coords.latitude.toFixed(5)),
          lng: parseFloat(pos.coords.longitude.toFixed(5)),
          address: `${siteZone} (GPS Satellite Locked)`,
          addressAr: `${getLocalizedZone(siteZone, 'ar')} (مثبت بالأقمار الصناعية)`,
          accuracy: Math.round(pos.coords.accuracy || 3)
        });
        setIsLocating(false);
        setLocationSuccess(true);
      },
      err => {
        setIsLocating(false);
        setLocationSuccess(true);
      },
      { timeout: 7000 }
    );
  };

  // Photo handlers
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result) {
          setPhotos(prev => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick hazard photo preset click
  const handlePresetPhoto = (url: string) => {
    setPhotos(prev => [...prev, url]);
  };

  // Real-time AI Risk assessment preview
  const liveAssessment = description.trim().length > 6
    ? assessRiskSeverity(description, selectedCategoryKey)
    : null;

  // Submit Handler -> Displays Confirmation Receipt Modal
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = title.trim() || (language === 'ar' ? 'ملاحظة خطر ميداني' : 'Field Hazard Observation');
    const finalDesc = description.trim() || (language === 'ar' ? 'تم رصد وتوثيق الخطر ميدانياً عبر أيقونات الرصد السريع.' : 'Hazard observed and verified via rapid field icons.');

    setIsSubmitting(true);
    
    setTimeout(() => {
      const finalCategory = selectedCategoryKey === 'Other' && customHazardText.trim()
        ? customHazardText.trim()
        : selectedCategoryKey;

      const newReport = addReport({
        title: finalTitle,
        description: finalDesc,
        category: finalCategory,
        siteZone,
        location,
        photos,
        customFieldValues
      });

      // Provide Arabic title and description if language is Arabic
      if (language === 'ar') {
        newReport.titleAr = finalTitle;
        newReport.descriptionAr = finalDesc;
      }

      setIsSubmitting(false);
      setConfirmedReport(newReport);

      // Reset form
      setTitle('');
      setDescription('');
      setPhotos([]);
      setLocationSuccess(false);
    }, 500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Notice Banner */}
      {config.noticeBanner && (
        <div className="p-3.5 rounded-2xl border border-amber-300 dark:border-amber-800 bg-amber-50/90 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 flex items-center gap-3 text-xs font-semibold shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span className="flex-1">{config.noticeBanner}</span>
        </div>
      )}

      {/* Main Grid: Icon-Driven Reporting Card + Points/Leaderboard Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Simple Icon Reporting Canvas (8 Cols or 12 Cols if rewards wall is hidden) */}
        <div className={isSectionVisible('sec_worker_rewards_wall') ? "lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6" : "lg:col-span-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6"}>
          
          {/* Header with high-impact status */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold shadow-xs"
                  style={{ backgroundColor: pantone.hex }}
                >
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <h1 className="text-xl font-black text-slate-900 dark:text-white">
                  {t('worker_simple_mode')}
                </h1>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t('worker_simple_sub')}
              </p>
            </div>

            {isSectionVisible('sec_worker_welcome') && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>غرفة العمليات متصلة</span>
                </span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* ---------------- STEP 1: ICON GRID FOR HAZARD SELECTION ---------------- */}
            {isSectionVisible('sec_worker_hazard_icons') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                      style={{ backgroundColor: pantone.hex }}
                    >
                      1
                    </span>
                    <span>{t('step1_observe')}</span>
                  </label>

                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    انقر على نوع الخطر لتحديده فوراً
                  </span>
                </div>

                {/* Compact Touch-Friendly Hazard Cards configured by Admin */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {configuredHazardCards.map(card => {
                    const isSelected = selectedCategoryKey === card.key;
                    return (
                      <div
                        key={card.key}
                        onClick={() => handleSelectHazard(card)}
                        className={`py-2 px-2 rounded-xl border transition-all cursor-pointer flex flex-col items-center text-center justify-center gap-1.5 select-none group shadow-2xs hover:shadow-xs ${
                          isSelected
                            ? card.activeBg + ' ring-2 ring-offset-1 dark:ring-offset-slate-900 border-current'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800'
                        }`}
                        style={isSelected ? ({ '--tw-ring-color': pantone.hex } as React.CSSProperties) : undefined}
                      >
                        <div className="p-1 rounded-lg bg-white dark:bg-slate-900 shadow-2xs group-hover:scale-105 transition-transform [&_svg]:w-4 [&_svg]:h-4">
                          {card.icon}
                        </div>
                        <span className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight line-clamp-1">
                          {card.labelAr}
                        </span>
                        {isSelected && (
                          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px]">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Dedicated Custom Hazard Text Input when "Other / أخرى" is selected */}
                {selectedCategoryKey === 'Other' && (
                  <div className="p-4 rounded-2xl bg-fuchsia-50/80 dark:bg-fuchsia-950/40 border border-fuchsia-200 dark:border-fuchsia-900/60 space-y-2 animate-in fade-in duration-200">
                    <div className="flex items-center gap-2 text-xs font-bold text-fuchsia-900 dark:text-fuchsia-200">
                      <FileEdit className="w-4 h-4 text-fuchsia-600" />
                      <span>
                        اكتب نوع الخطر المرصود بنفسك (غير مدرج بالقائمة أعلاه):
                      </span>
                    </div>
                    <input
                      type="text"
                      required
                      value={customHazardText}
                      onChange={e => {
                        setCustomHazardText(e.target.value);
                        setTitle(e.target.value);
                      }}
                      placeholder="مثال: انهيار ترابي في الحفر، سقوط كابل من عمود إنارة، اهتزاز عنيف في مضخة..."
                      className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-fuchsia-300 dark:border-fuchsia-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-fuchsia-500 font-semibold"
                    />
                    <p className="text-[11px] text-fuchsia-700 dark:text-fuchsia-300">
                      💡 سيقوم محرك الذكاء الاصطناعي بتقييم وتحليل وصفك وتحديد درجة الخطورة وهرم التحكم وإشعار مسؤولي السلامة فوراً.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Quick Title & Zone Row */}
            {isSectionVisible('sec_worker_form_inputs') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {isFieldVisible('title') && (
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                      {t('incident_title')}
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="عنوان الخطر المرصود..."
                      className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2"
                      style={{ '--tw-ring-color': pantone.hex } as React.CSSProperties}
                    />
                  </div>
                )}

                {isFieldVisible('zone') && (
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                      {t('site_zone')}
                    </label>
                    <select
                      value={siteZone}
                      onChange={e => setSiteZone(e.target.value)}
                      className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2"
                      style={{ '--tw-ring-color': pantone.hex } as React.CSSProperties}
                    >
                      {Object.keys(ZONE_MAP).map(zoneKey => (
                        <option key={zoneKey} value={zoneKey}>
                          {getLocalizedZone(zoneKey, language)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* ---------------- STEP 2: 3 CORE ACTIONS (VOICE, PHOTO, GPS) ---------------- */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                  style={{ backgroundColor: pantone.hex }}
                >
                  2
                </span>
                <span>{t('step2_document')}</span>
              </label>

              {/* 3 Prominent Action Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* 1. Voice Record Button */}
                {isActionVisible('act_voice') && (
                <div
                  onClick={toggleVoiceDictation}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center justify-center gap-2 select-none group shadow-xs ${
                    isListening
                      ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 animate-pulse ring-2 ring-rose-400'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-slate-400 hover:bg-white dark:hover:bg-slate-800'
                  }`}
                >
                  <div className={`p-3 rounded-full text-white shadow-md ${
                    isListening ? 'bg-rose-600 animate-bounce' : 'bg-rose-500 group-hover:scale-110 transition-transform'
                  }`}>
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {isListening ? t('voice_stop') : t('voice_hold_speak')}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    تحدث وسيقوم النظام بكتابة الوصف
                  </span>
                </div>
                )}

                {/* 2. Photo Camera / Upload Button */}
                {isActionVisible('act_camera') && (
                <div className="relative p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-slate-400 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer flex flex-col items-center text-center justify-center gap-2 select-none group shadow-xs">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    id="workerCameraInput"
                    className="hidden"
                  />
                  <label htmlFor="workerCameraInput" className="cursor-pointer w-full flex flex-col items-center justify-center gap-2">
                    <div className="p-3 rounded-full bg-blue-500 text-white shadow-md group-hover:scale-110 transition-transform">
                      <Camera className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {t('camera_tap_photo')}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {photos.length > 0 ? `${photos.length} صور مرفقة` : 'التقاط فوري بكاميرا الهاتف'}
                    </span>
                  </label>
                </div>
                )}

                {/* 3. GPS Instant Lock Button */}
                <div
                  onClick={handleFetchGPS}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center justify-center gap-2 select-none group shadow-xs ${
                    locationSuccess
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500'
                      : isLocating
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 animate-pulse'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-slate-400 hover:bg-white dark:hover:bg-slate-800'
                  }`}
                >
                  <div className={`p-3 rounded-full text-white shadow-md ${
                    locationSuccess ? 'bg-emerald-600' : isLocating ? 'bg-amber-500' : 'bg-emerald-500 group-hover:scale-110 transition-transform'
                  }`}>
                    {locationSuccess ? <Check className="w-5 h-5 stroke-[3]" /> : <MapPin className="w-5 h-5" />}
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {locationSuccess ? t('gps_detected') : isLocating ? t('gps_fetching') : t('gps_tap_lock')}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    {location.lat}, {location.lng}
                  </span>
                </div>

              </div>

              {/* Photos Previews & Quick Sample Hazard Photos */}
              {isSectionVisible('sec_worker_media_upload') && isFieldVisible('photos') && (
              <div className="space-y-2 pt-1">
                {photos.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    {photos.map((url, i) => (
                      <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-600 shadow-xs">
                        <img src={url} alt="hazard" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <button
                          type="button"
                          onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))}
                          className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-slate-900/80 text-white hover:bg-rose-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 1-Click Ready Hazard Photo Samples */}
                <div className="flex items-center gap-2 overflow-x-auto py-1 text-xs">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                    {t('quick_sample_photos')}:
                  </span>
                  {SAMPLE_HAZARD_PHOTOS.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePresetPhoto(sample.url)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:border-slate-400 whitespace-nowrap shrink-0 transition-colors"
                    >
                      + {sample.titleAr || sample.title}
                    </button>
                  ))}
                </div>
              </div>
              )}

              {/* Substantially Enlarged Observation Notes Field */}
              {isFieldVisible('description') && (
              <div className="pt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-500" />
                    <span>
                      مساحة تسجيل الملاحظات وتوثيق الخطر بالتفصيل (كتابياً أو بالإملاء الصوتي):
                    </span>
                  </label>
                  <div className="flex items-center gap-2">
                    {isActionVisible('act_voice') && (
                    <button
                      type="button"
                      onClick={toggleVoiceDictation}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        isListening
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>{isListening ? 'جارٍ التسجيل...' : 'إملاء صوتي'}</span>
                    </button>
                    )}
                    <span className="text-[10px] font-mono text-slate-400">
                      {description.length} حرف
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    rows={7}
                    required
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="صف ما لاحظته في الموقع بدقة: ما هو الخطر بالتحديد؟ أين يقع بالضبط؟ ما الذي كاد أن يحدث لو لم تلاحظه؟ ما هي التدابير العاجلة أو التحذيرات التي اتخذتها لحماية زملائك في الوردية؟..."
                    className="w-full text-xs sm:text-sm py-3.5 px-4 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 leading-relaxed shadow-inner min-h-[160px]"
                    style={{ '--tw-ring-color': pantone.hex } as React.CSSProperties}
                  />
                  {description.trim().length > 0 && (
                    <button
                      type="button"
                      onClick={() => setDescription('')}
                      className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 px-2 py-1 bg-slate-200/70 dark:bg-slate-800/70 hover:bg-slate-300 rounded-lg text-[10px] text-slate-600 dark:text-slate-400 font-semibold"
                    >
                      مسح النص
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  💡 نصيحة ميدانية: يتم تحليل هذه الملاحظات لحظياً بمحرك الذكاء الاصطناعي لتحديد مستوى الخطورة وتوجيه الإجراءات التصحيحية للإدارة المختصة.
                </p>
              </div>
              )}
            </div>

            {/* AI Real-time Pre-assessment indicator */}
            {liveAssessment && (
              <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 flex items-center justify-between gap-3 text-xs animate-in fade-in">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <span className="font-bold text-amber-950 dark:text-amber-200 block">
                      {t('ai_risk_assessment')}: {liveAssessment.severity.toUpperCase()} ({liveAssessment.score}/100)
                    </span>
                    <span className="text-[11px] text-amber-800 dark:text-amber-300">
                      {liveAssessment.recommendedAction}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-100 uppercase shrink-0">
                  {liveAssessment.severity}
                </span>
              </div>
            )}

            {/* ---------------- STEP 3: GIANT DISPATCH BUTTON ---------------- */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl font-black text-sm text-white shadow-xl transition-all hover:opacity-95 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                style={{ backgroundColor: pantone.hex }}
              >
                <Send className="w-5 h-5 rtl:rotate-180" />
                <span>{isSubmitting ? t('sending') : t('send_now')}</span>
              </button>
              
              <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                <span>🛡️ {t('safety_first')}</span>
                <span>·</span>
                <span>⚡ تنبيه صوتي فوري لـ HSE</span>
                <span>·</span>
                <span>⭐ +100 نقطة سلامة</span>
              </div>
            </div>

          </form>

        </div>

        {/* Right Column: Gamification & Rewards Side Panel (4 Cols) */}
        {isSectionVisible('sec_worker_rewards_wall') && (
          <div className="lg:col-span-4 space-y-6">
            
            {/* Executive Rewards Program Toggle Check */}
          {!config.rewardsConfig?.enabled ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-6 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-900">
                <Trophy className="w-6 h-6 opacity-60" />
              </div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                نظام الحوافز والمكافآت متوقف مؤقتاً
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                {config.rewardsConfig?.executiveNoticeAr || 'تم إخفاء لوحة المكافآت بقرار من الإدارة العامة لمراجعة وتقييم معايير السلامة.'}
              </p>
            </div>
          ) : (
            <>
              {/* User Points Card */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                      {config.rewardsConfig.programTitleAr || t('safety_points')}
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40">
                    {currentUser.safetyRankAr || currentUser.safetyRank}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                    {currentUser.safetyPoints}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {config.rewardsConfig.currencyNameAr || 'نقطة معتمدة'}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t('points_explainer')} (+{config.rewardsConfig.pointsPerReport} لكل بلاغ مؤكد)
                </p>

                {/* Dynamic Tiers from Config */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    {t('bonus_breakdown')}
                  </span>
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 font-mono">
                    {config.rewardsConfig.tiers?.map(tier => (
                      <div
                        key={tier.id}
                        className={`flex justify-between items-center p-2.5 rounded-xl border text-xs ${
                          currentUser.safetyPoints >= tier.minPoints
                            ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 font-bold'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span>{tier.nameAr || tier.name}</span>
                          <span className="text-[10px] text-slate-400 font-sans">{tier.perksAr || tier.perks}</span>
                        </div>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                          +{tier.bonusPercentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Available Claimable Gifts Catalog Preview */}
                {config.rewardsConfig.catalog?.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                      <span>المكافآت والجوائز المتاحة:</span>
                      <Gift className="w-3.5 h-3.5 text-indigo-500" />
                    </span>
                    <div className="space-y-2">
                      {config.rewardsConfig.catalog.filter(c => c.enabled).map(item => (
                        <div
                          key={item.id}
                          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
                              {item.titleAr || item.title}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {item.descriptionAr || item.description}
                            </span>
                          </div>
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900 shrink-0">
                            {item.costPoints} نقطة
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Wall of Fame Leaderboard */}
              {config.rewardsConfig.showWallOfFame && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-indigo-500" />
                      <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                        {t('wall_of_fame')}
                      </h2>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Q3 2026
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {leaderboard.map((entry, index) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                            index === 0
                              ? 'bg-amber-400 text-slate-950'
                              : index === 1
                              ? 'bg-slate-300 text-slate-900'
                              : index === 2
                              ? 'bg-amber-700 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}>
                            {index + 1}
                          </span>
                          <div>
                            <span className="text-xs font-bold text-slate-900 dark:text-white block">
                              {entry.name}
                            </span>
                            <span className="text-[10px] text-slate-400 truncate max-w-[150px] block">
                              {entry.department}
                            </span>
                          </div>
                        </div>

                        <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                          {entry.points} نقطة
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          </div>
        )}

      </div>

      {/* ---------------- DELIVERY CONFIRMATION RECEIPT MODAL ---------------- */}
      {confirmedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden p-6 sm:p-8 space-y-6">
            
            {/* Top Badge & Sound Ping Notice */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/80 border-4 border-emerald-500 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg animate-bounce">
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {t('delivery_confirmed_title')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {t('delivery_status_delivered')}
                </p>
              </div>
            </div>

            {/* Official Digital Receipt Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">{t('delivery_ref_no')}:</span>
                <span className="font-mono font-black text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-900 px-2.5 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  {confirmedReport.id}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">{t('delivery_timestamp')}:</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {confirmedReport.timestamp}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">تصنيف الخطر المرصود:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {getLocalizedCategory(confirmedReport.category, language)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">المنطقة والموقع:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-right rtl:text-left">
                  {getLocalizedZone(confirmedReport.siteZone, language)}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-amber-700 dark:text-amber-300 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>نقاط السلامة المستحقة (معلقة):</span>
                  </span>
                  <span className="font-mono font-black text-amber-600 dark:text-amber-400 text-sm">
                    +{confirmedReport.pointsPending || 100} نقطة
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  🔒 بنظام المكافآت المعتمد: لا تُمنح وتُودع النقاط إلا بعد إغلاق الملف رسمياً والتأكد من اتخاذ الإجراءات التصحيحية الميدانية.
                </p>
              </div>
            </div>

            {/* Actions: Start Chat / Log Another / View Details */}
            <div className="space-y-2.5">
              <button
                onClick={() => {
                  const rep = confirmedReport;
                  setConfirmedReport(null);
                  openChatWithReport('worker_hse', rep.id);
                }}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t('delivery_action_chat')}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setSelectedReportForModal(confirmedReport);
                    setConfirmedReport(null);
                  }}
                  className="py-2.5 px-3 rounded-xl font-bold text-xs border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {t('delivery_action_view')}
                </button>

                <button
                  onClick={() => setConfirmedReport(null)}
                  className="py-2.5 px-3 rounded-xl font-bold text-xs text-white shadow-xs transition-colors"
                  style={{ backgroundColor: pantone.hex }}
                >
                  {t('delivery_action_another')}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
