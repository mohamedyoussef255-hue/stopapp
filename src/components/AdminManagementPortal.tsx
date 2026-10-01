import React, { useState } from 'react';
import { useUIConfig } from '../context/UIConfigContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { PANTONE_PRESETS } from '../utils/mockData';
import {
  Sliders,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Plus,
  Trash2,
  Check,
  ShieldCheck,
  Palette,
  Type,
  LayoutGrid,
  Sparkles,
  Layers,
  Save,
  CheckCircle2,
  HardHat,
  Briefcase,
  AlertTriangle,
  Zap,
  Mic,
  Camera,
  Volume2,
  Download,
  MessageSquare,
  MapPin,
  Send,
  Trophy,
  Activity
} from 'lucide-react';
import { CustomFormField } from '../types';
import { RewardsManagementPanel } from './RewardsManagementPanel';

export const AdminManagementPortal: React.FC = () => {
  const {
    config,
    updateAppBranding,
    toggleSectionVisibility,
    moveSectionOrder,
    toggleHazardIconVisibility,
    moveHazardIconOrder,
    toggleFormFieldVisibility,
    moveFormFieldOrder,
    toggleActionIconVisibility,
    addCustomField,
    removeCustomField,
    toggleCustomField,
    resetLayoutToDefault,
    resetToDefaults
  } = useUIConfig();

  const { pantone, setPantone } = useTheme();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'spaces' | 'icons' | 'fields' | 'rewards' | 'branding'>('spaces');
  const [selectedPortal, setSelectedPortal] = useState<'worker' | 'hse' | 'gm'>('worker');
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  // New custom field form
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<'text' | 'select' | 'number' | 'toggle'>('text');
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [newFieldOptions, setNewFieldOptions] = useState('');

  // Branding states
  const [titleInput, setTitleInput] = useState(config.appTitle);
  const [subtitleInput, setSubtitleInput] = useState(config.appSubtitle);
  const [bannerInput, setBannerInput] = useState(config.noticeBanner);

  const handleTriggerSaveNotice = () => {
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 2500);
  };

  const handleAddNewCustomField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldLabel.trim()) return;

    const optionsArray = newFieldType === 'select'
      ? newFieldOptions.split(',').map(s => s.trim()).filter(Boolean)
      : undefined;

    const newField: Omit<CustomFormField, 'id'> = {
      label: newFieldLabel.trim(),
      type: newFieldType,
      options: optionsArray && optionsArray.length > 0 ? optionsArray : ['الخيار 1', 'الخيار 2', 'الخيار 3'],
      required: newFieldRequired,
      enabled: true
    };

    addCustomField(newField);
    setNewFieldLabel('');
    setNewFieldOptions('');
    handleTriggerSaveNotice();
  };

  const handleSaveBranding = () => {
    updateAppBranding(titleInput, subtitleInput, bannerInput);
    handleTriggerSaveNotice();
  };

  const currentPortalSections = (config.pageSections?.[selectedPortal] || []).slice().sort((a, b) => a.order - b.order);
  const currentHazardIcons = (config.hazardIcons || []).slice().sort((a, b) => a.order - b.order);
  const currentFormFields = (config.formFields || []).slice().sort((a, b) => a.order - b.order);
  const currentActionIcons = config.actionIcons || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Executive Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 p-6 rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-900/60 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-indigo-600 text-white shadow-md">
              <Sliders className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">
                  بوابة مدير النظام والتحكم الشامل
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-black uppercase">
                  صلاحيات النظام العليا
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                التحكم المباشر في ظهور وإخفاء كافة الأيقونات، الخانات، المساحات، وتبديل الأماكن وإعادة توزيع البيانات في صفحات التطبيق
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-3 shrink-0 z-10 w-full lg:w-auto justify-end">
          {showSavedFeedback && (
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>تم تحديث وتطبيق التوزيع فوراً!</span>
            </span>
          )}

          <button
            onClick={() => {
              resetLayoutToDefault();
              handleTriggerSaveNotice();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>استعادة التوزيع الافتراضي</span>
          </button>
        </div>
      </div>

      {/* Main Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('spaces')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'spaces'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>التحكم في المساحات وإعادة توزيع الصفحة</span>
        </button>

        <button
          onClick={() => setActiveTab('icons')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'icons'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>التحكم في الأيقونات وتبديل أماكنها</span>
        </button>

        <button
          onClick={() => setActiveTab('fields')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'fields'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Type className="w-4 h-4" />
          <span>التحكم في الخانات وحقول الإدخال</span>
        </button>

        <button
          onClick={() => setActiveTab('rewards')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'rewards'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>نظام المكافآت والحوافز</span>
        </button>

        <button
          onClick={() => setActiveTab('branding')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'branding'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>الهوية والمظهر وبانتون</span>
        </button>
      </div>

      {/* ---------------- TAB 1: SPACES & LAYOUT REDISTRIBUTION ---------------- */}
      {activeTab === 'spaces' && (
        <div className="space-y-6">
          {/* Sub-selector: Choose Portal */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-900 dark:text-white">
                اختر البوابة أو الصفحة المراد إعادة توزيع مساحاتها:
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedPortal('worker')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedPortal === 'worker'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <HardHat className="w-3.5 h-3.5" />
                <span>بوابة العاملين والميدان</span>
              </button>

              <button
                onClick={() => setSelectedPortal('hse')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedPortal === 'hse'
                    ? 'bg-blue-600 text-white font-black shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>بوابة مسؤولي HSE الميدانيين</span>
              </button>

              <button
                onClick={() => setSelectedPortal('gm')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedPortal === 'gm'
                    ? 'bg-emerald-600 text-white font-black shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>البوابة التنفيذية للمدير العام</span>
              </button>
            </div>
          </div>

          {/* Sections List */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  المساحات والأقسام الميدانية ({selectedPortal === 'worker' ? 'بوابة العاملين' : selectedPortal === 'hse' ? 'بوابة مسؤولي HSE' : 'بوابة المدير العام'})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  انقر على زر العين لإظهار أو إخفاء أي مساحة، واستخدم أزرار الأسهم لتبديل مكان المساحة وإعادة توزيع ترتيبها في الصفحة.
                </p>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {currentPortalSections.filter(s => s.visible).length} من أصل {currentPortalSections.length} مساحات ظاهرة
              </span>
            </div>

            <div className="space-y-3">
              {currentPortalSections.map((section, idx) => (
                <div
                  key={section.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    section.visible
                      ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                      : 'bg-slate-100/40 dark:bg-slate-900/40 border-dashed border-slate-300 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-black text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          {section.titleAr}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          section.visible ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {section.visible ? 'ظاهرة' : 'مخفية'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {section.descriptionAr}
                      </p>
                    </div>
                  </div>

                  {/* Controls: Reorder & Show/Hide */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {/* Move Up */}
                    <button
                      disabled={idx === 0}
                      onClick={() => {
                        moveSectionOrder(selectedPortal, section.id, 'up');
                        handleTriggerSaveNotice();
                      }}
                      title="تحريك لأعلى"
                      className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    {/* Move Down */}
                    <button
                      disabled={idx === currentPortalSections.length - 1}
                      onClick={() => {
                        moveSectionOrder(selectedPortal, section.id, 'down');
                        handleTriggerSaveNotice();
                      }}
                      title="تحريك لأسفل"
                      className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Toggle Visibility */}
                    <button
                      onClick={() => {
                        toggleSectionVisibility(selectedPortal, section.id);
                        handleTriggerSaveNotice();
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        section.visible
                          ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 hover:bg-rose-100'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {section.visible ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>إخفاء المساحة</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>إظهار المساحة</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- TAB 2: ICONS & HAZARDS CONTROL ---------------- */}
      {activeTab === 'icons' && (
        <div className="space-y-6">
          {/* 1. Hazard Observation Icons Control */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  أيقونات تصنيف المخاطر الميدانية الفورية
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  يمكن لمدير النظام إخفاء أي أيقونة أو تبديل ترتيب ظهورها وأماكنها في شبكة الإبلاغ فوراً.
                </p>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {currentHazardIcons.filter(i => i.visible).length} من {currentHazardIcons.length} أيقونات نشطة
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {currentHazardIcons.map((item, idx) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    item.visible
                      ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                      : 'bg-slate-100/30 dark:bg-slate-900/30 border-dashed border-slate-300 dark:border-slate-800 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl w-10 h-10 rounded-xl bg-white dark:bg-slate-900 shadow-2xs flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-800">
                      {item.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {item.labelAr}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          #{idx + 1}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 block truncate max-w-[160px]">
                        {item.defaultTitleAr}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      disabled={idx === 0}
                      onClick={() => {
                        moveHazardIconOrder(item.id, 'up');
                        handleTriggerSaveNotice();
                      }}
                      title="تقديم الأيقونة"
                      className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>

                    <button
                      disabled={idx === currentHazardIcons.length - 1}
                      onClick={() => {
                        moveHazardIconOrder(item.id, 'down');
                        handleTriggerSaveNotice();
                      }}
                      title="تأخير الأيقونة"
                      className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => {
                        toggleHazardIconVisibility(item.id);
                        handleTriggerSaveNotice();
                      }}
                      title={item.visible ? 'إخفاء الأيقونة' : 'إظهار الأيقونة'}
                      className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        item.visible
                          ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {item.visible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Preview of Hazard Icon Grid */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-black text-slate-700 dark:text-slate-300 block mb-2">
                معاينة حية لشكل شبكة الأيقونات كما يراها العامل الميداني حالياً:
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                {currentHazardIcons.filter(i => i.visible).map(card => (
                  <div
                    key={card.id}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col items-center text-center gap-1.5"
                  >
                    <span className="text-xl">{card.icon}</span>
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                      {card.labelAr}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Functional & Action Icons Control */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                الأيقونات الوظيفية وأزرار الإجراءات السريعة
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                التحكم في ظهور أو إخفاء أيقونات الميكروفون، الكاميرا، الصوت، التصدير، والمحادثات.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {currentActionIcons.map(act => (
                <div
                  key={act.id}
                  className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                    act.visible
                      ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                      : 'bg-slate-100/30 dark:bg-slate-900/30 border-dashed border-slate-300 dark:border-slate-800 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                      {act.iconName === 'Mic' && <Mic className="w-4 h-4" />}
                      {act.iconName === 'Camera' && <Camera className="w-4 h-4" />}
                      {act.iconName === 'Volume2' && <Volume2 className="w-4 h-4" />}
                      {act.iconName === 'Download' && <Download className="w-4 h-4" />}
                      {act.iconName === 'MessageSquare' && <MessageSquare className="w-4 h-4" />}
                      {act.iconName === 'Map' && <MapPin className="w-4 h-4" />}
                      {act.iconName === 'Send' && <Send className="w-4 h-4" />}
                      {act.iconName === 'CheckCircle2' && <CheckCircle2 className="w-4 h-4" />}
                      {act.iconName === 'Zap' && <Zap className="w-4 h-4 text-amber-500" />}
                      {act.iconName === 'Trophy' && <Trophy className="w-4 h-4 text-amber-500" />}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {act.labelAr}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      toggleActionIconVisibility(act.id);
                      handleTriggerSaveNotice();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      act.visible
                        ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {act.visible ? 'إخفاء' : 'إظهار'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- TAB 3: FORM FIELDS & INPUTS CONTROL ---------------- */}
      {activeTab === 'fields' && (
        <div className="space-y-6">
          {/* Standard Fields Reordering & Toggling */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  خانات وحقول استمارة الإبلاغ عن الخطر
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  إظهار أو إخفاء حقول الإدخال، وتبديل أماكنها لتحديد أولوية وسلاسة إدخال البيانات للعامل الميداني.
                </p>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {currentFormFields.filter(f => f.visible).length} من {currentFormFields.length} خانات مفعلة
              </span>
            </div>

            <div className="space-y-3">
              {currentFormFields.map((field, idx) => (
                <div
                  key={field.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    field.visible
                      ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                      : 'bg-slate-100/30 dark:bg-slate-900/30 border-dashed border-slate-300 dark:border-slate-800 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-black text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          {field.labelAr}
                        </span>
                        {field.required && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                            خانة إلزامية
                          </span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          field.visible ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {field.visible ? 'ظاهرة' : 'مخفية'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {field.descriptionAr}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      disabled={idx === 0}
                      onClick={() => {
                        moveFormFieldOrder(field.id, 'up');
                        handleTriggerSaveNotice();
                      }}
                      title="تحريك لأعلى"
                      className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      disabled={idx === currentFormFields.length - 1}
                      onClick={() => {
                        moveFormFieldOrder(field.id, 'down');
                        handleTriggerSaveNotice();
                      }}
                      title="تحريك لأسفل"
                      className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        toggleFormFieldVisibility(field.id);
                        handleTriggerSaveNotice();
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        field.visible
                          ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 hover:bg-rose-100'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {field.visible ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>إخفاء الخانة</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>إظهار الخانة</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Custom Fields Section */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  الخانات الميدانية المخصصة الإضافية
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  إضافة خانات وحقول مخصصة تظهر تلقائياً في استمارة الإبلاغ الميداني.
                </p>
              </div>
            </div>

            {/* List of existing custom fields */}
            <div className="space-y-2.5">
              {config.customFields.map((f) => (
                <div
                  key={f.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                    f.enabled
                      ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                      : 'bg-slate-100/40 dark:bg-slate-900/40 border-dashed border-slate-300 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {f.label}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {f.type === 'select' ? 'قائمة اختيار' : f.type === 'toggle' ? 'زر تبديل (نعم/لا)' : f.type === 'number' ? 'رقمي' : 'نصي'}
                      </span>
                      {f.required && (
                        <span className="text-[10px] font-bold text-rose-500">
                          * إلزامي
                        </span>
                      )}
                    </div>
                    {f.options && (
                      <span className="text-[10px] text-slate-400 block mt-1">
                        الخيارات: {f.options.join(' | ')}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleCustomField(f.id)}
                      className={`p-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        f.enabled
                          ? 'border-emerald-300 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60'
                          : 'border-slate-300 text-slate-400'
                      }`}
                    >
                      {f.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => removeCustomField(f.id)}
                      className="p-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add new field form */}
            <form onSubmit={handleAddNewCustomField} className="p-4 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 space-y-3">
              <span className="text-xs font-black text-indigo-950 dark:text-indigo-200 block">
                + إضافة خانة جديدة لاستمارة السلامة:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    اسم وعنوان الخانة:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: رقم تصريح العمل الساخن، جهة المقاول..."
                    value={newFieldLabel}
                    onChange={e => setNewFieldLabel(e.target.value)}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    نوع الخانة:
                  </label>
                  <select
                    value={newFieldType}
                    onChange={e => setNewFieldType(e.target.value as any)}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  >
                    <option value="text">نص حر</option>
                    <option value="select">قائمة منسدلة متعددة الخيارات</option>
                    <option value="number">قيمة رقمية</option>
                    <option value="toggle">زر تبديل نعم أو لا</option>
                  </select>
                </div>
              </div>

              {newFieldType === 'select' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الخيارات المتاحة (افصل بينها بفاصلة ,):
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: خيار 1, خيار 2, خيار 3"
                    value={newFieldOptions}
                    onChange={e => setNewFieldOptions(e.target.value)}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={newFieldRequired}
                    onChange={e => setNewFieldRequired(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>جعل هذه الخانة إلزامية للتسليم</span>
                </label>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة الخانة وتفعيلها</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- TAB 4: REWARDS & INCENTIVES ---------------- */}
      {activeTab === 'rewards' && (
        <div className="space-y-6">
          <RewardsManagementPanel />
        </div>
      )}

      {/* ---------------- TAB 5: BRANDING & PANTONE ---------------- */}
      {activeTab === 'branding' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              هوية المنظومة ودرجات ألوان بانتون القياسية
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              تغيير عناوين المنصة واللوحة التحذيرية العليا ودرجات ألوان الأمان المعيارية.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  اسم المنصة الرئيسي:
                </label>
                <input
                  type="text"
                  value={titleInput}
                  onChange={e => setTitleInput(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الوصف والعنوان الفرعي:
                </label>
                <input
                  type="text"
                  value={subtitleInput}
                  onChange={e => setSubtitleInput(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  اللافتة التحذيرية المرفوعة بصدر الصفحة:
                </label>
                <textarea
                  rows={2}
                  value={bannerInput}
                  onChange={e => setBannerInput(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>

              <button
                onClick={handleSaveBranding}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>حفظ بيانات الهوية واللافتة</span>
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                درجات بانتون المعتمدة للسلامة والصحة المهنية:
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                {PANTONE_PRESETS.map((p) => {
                  const isSelected = pantone.hex === p.hex;
                  return (
                    <button
                      key={p.code}
                      onClick={() => setPantone(p)}
                      className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/40 ring-2 ring-indigo-500/40'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-4 h-4 rounded-full border border-black/10 shrink-0 shadow-xs"
                          style={{ backgroundColor: p.hex }}
                        />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {p.code}
                          </span>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
