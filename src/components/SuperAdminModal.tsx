import React, { useState } from 'react';
import { useUIConfig } from '../context/UIConfigContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { PANTONE_PRESETS } from '../utils/mockData';
import { 
  Lock, 
  Unlock, 
  Palette, 
  Sliders, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  Check, 
  X,
  Type,
  ShieldCheck,
  HardHat,
  Briefcase,
  Trophy
} from 'lucide-react';
import { CustomFormField } from '../types';
import { RewardsManagementPanel } from './RewardsManagementPanel';

export const SuperAdminModal: React.FC = () => {
  const { 
    isSuperAdminModalOpen, 
    setIsSuperAdminModalOpen, 
    config, 
    updateAppBranding, 
    toggleFeature, 
    addCustomField, 
    removeCustomField, 
    toggleCustomField, 
    resetToDefaults 
  } = useUIConfig();

  const { pantone, setPantone, setCustomHex } = useTheme();
  const { t, language } = useLanguage();

  const [pinInput, setPinInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinError, setPinError] = useState('');
  const [adminTab, setAdminTab] = useState<'rewards' | 'theme' | 'branding' | 'fields' | 'features'>('rewards');

  // Branding fields state
  const [titleInput, setTitleInput] = useState(config.appTitle);
  const [subtitleInput, setSubtitleInput] = useState(config.appSubtitle);
  const [bannerInput, setBannerInput] = useState(config.noticeBanner);
  const [customHexInput, setCustomHexInput] = useState(pantone.hex);

  // New field state
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<'text' | 'select' | 'number' | 'toggle'>('text');
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [newFieldOptions, setNewFieldOptions] = useState('');

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === '0000' || pinInput.trim() === 'admin') {
      setIsUnlocked(true);
      setPinError('');
    } else {
      setPinError(language === 'ar' ? 'رمز الدخول غير صحيح (الرمز الافتراضي: 0000)' : 'Invalid PIN. (Default demo PIN: 0000)');
    }
  };

  const handleSaveBranding = () => {
    updateAppBranding(titleInput, subtitleInput, bannerInput);
  };

  const handleAddNewField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldLabel.trim()) return;

    const optionsArray = newFieldType === 'select'
      ? newFieldOptions.split(',').map(s => s.trim()).filter(Boolean)
      : undefined;

    const newField: Omit<CustomFormField, 'id'> = {
      label: newFieldLabel.trim(),
      type: newFieldType,
      options: optionsArray && optionsArray.length > 0 ? optionsArray : ['Option A', 'Option B', 'Option C'],
      required: newFieldRequired,
      enabled: true
    };

    addCustomField(newField);
    setNewFieldLabel('');
    setNewFieldOptions('');
  };

  if (!isSuperAdminModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="p-2 rounded-lg text-white font-bold"
              style={{ backgroundColor: pantone.hex }}
            >
              {isUnlocked ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('super_admin_title')}
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'ar' ? 'التحكم الشامل في هوية المنظومة والحقول والصلاحيات' : 'Global UI Controller, Dynamic Theming & Form CMS'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsSuperAdminModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {!isUnlocked ? (
            /* PIN Gate */
            <div className="max-w-md mx-auto py-12 text-center space-y-6">
              <div
                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white shadow-lg"
                style={{ backgroundColor: pantone.hex }}
              >
                <Lock className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t('admin_pin_required')}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {t('pin_hint')}
                </p>
              </div>

              <form onSubmit={handlePinSubmit} className="space-y-4">
                <input
                  type="password"
                  maxLength={10}
                  value={pinInput}
                  onChange={e => setPinInput(e.target.value)}
                  placeholder="PIN: 0000"
                  className="w-full text-center tracking-widest text-2xl font-mono py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': pantone.hex } as React.CSSProperties}
                  autoFocus
                />
                {pinError && (
                  <p className="text-xs font-semibold text-rose-500">{pinError}</p>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPinInput('0000');
                    }}
                    className="flex-1 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200"
                  >
                    {language === 'ar' ? 'تعبئة الرمز 0000' : 'Autofill PIN 0000'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs font-bold text-white rounded-xl shadow-sm transition-all"
                    style={{ backgroundColor: pantone.hex }}
                  >
                    {t('unlock')}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Unlocked CMS Controls */
            <div className="space-y-6">
              
              {/* Super Admin Top Tabs Bar */}
              <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setAdminTab('rewards')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    adminTab === 'rewards'
                      ? 'text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/60'
                  }`}
                  style={adminTab === 'rewards' ? { backgroundColor: pantone.hex } : undefined}
                >
                  <Trophy className="w-4 h-4" />
                  <span>{language === 'ar' ? 'نظام المكافآت والتحفيز' : 'Rewards Engine'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAdminTab('theme')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    adminTab === 'theme'
                      ? 'text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/60'
                  }`}
                  style={adminTab === 'theme' ? { backgroundColor: pantone.hex } : undefined}
                >
                  <Palette className="w-4 h-4" />
                  <span>{language === 'ar' ? 'الألوان والهوية' : 'Colors & Theme'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAdminTab('branding')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    adminTab === 'branding'
                      ? 'text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/60'
                  }`}
                  style={adminTab === 'branding' ? { backgroundColor: pantone.hex } : undefined}
                >
                  <Type className="w-4 h-4" />
                  <span>{language === 'ar' ? 'النصوص والعناوين' : 'App Branding'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAdminTab('fields')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    adminTab === 'fields'
                      ? 'text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/60'
                  }`}
                  style={adminTab === 'fields' ? { backgroundColor: pantone.hex } : undefined}
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'ar' ? 'حقول النموذج' : 'Custom Fields'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAdminTab('features')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    adminTab === 'features'
                      ? 'text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/60'
                  }`}
                  style={adminTab === 'features' ? { backgroundColor: pantone.hex } : undefined}
                >
                  <Sliders className="w-4 h-4" />
                  <span>{language === 'ar' ? 'خصائص البوابات' : 'Feature Flags'}</span>
                </button>
              </div>

              {/* Tab Content: Rewards Management for System Admin */}
              {adminTab === 'rewards' && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <span>{language === 'ar' ? 'إدارة وتحكم مدير النظام في نظام المكافآت' : 'System Administrator Rewards Controller'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {language === 'ar'
                        ? 'تحكم كامل لمدير النظام مطابق لصلاحيات المدير العام: إظهار وإخفاء المكافآت، تعديل نسب المستويات، وقواعد النقاط، ومنح مكافآت فورية.'
                        : 'Full administrative authority: toggle visibility, calibrate bonus points, edit tiers, and award manual bonuses.'}
                    </p>
                  </div>
                  <RewardsManagementPanel isExecutive={false} />
                </div>
              )}

              {/* Section 1: Pantone-Style Color Picker */}
              {adminTab === 'theme' && (
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      {t('branding_theme')}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                    Active: {pantone.name} ({pantone.code})
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'ar' 
                    ? 'يغير اللون الرئيسي الموحد لجميع الأزرار والرموز وحالات التنشيط عبر المتغيرات اللحظية لـ Tailwind CSS.'
                    : 'Select a standardized industrial safety Pantone swatch or custom HEX. Dynamically updates all buttons, indicators, and focus rings.'}
                </p>

                {/* Pantone Swatch Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {PANTONE_PRESETS.map(preset => {
                    const isSelected = pantone.hex.toLowerCase() === preset.hex.toLowerCase();
                    return (
                      <div
                        key={preset.code}
                        onClick={() => {
                          setPantone(preset);
                          setCustomHexInput(preset.hex);
                        }}
                        className={`group relative p-2.5 rounded-xl border cursor-pointer transition-all bg-white dark:bg-slate-900 shadow-xs hover:shadow-md ${
                          isSelected
                            ? 'ring-2 ring-offset-2 dark:ring-offset-slate-900 border-transparent'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                        }`}
                        style={{ '--tw-ring-color': preset.hex } as React.CSSProperties}
                      >
                        <div
                          className="h-12 w-full rounded-lg mb-2 shadow-inner flex items-center justify-center text-white"
                          style={{ backgroundColor: preset.hex }}
                        >
                          {isSelected && <Check className="w-4 h-4 drop-shadow" />}
                        </div>
                        <div className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                          {preset.name}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 uppercase">
                          {preset.code}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Custom HEX Slider */}
                <div className="pt-2 flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t('custom_color')}:
                  </span>
                  <input
                    type="color"
                    value={customHexInput}
                    onChange={e => {
                      setCustomHexInput(e.target.value);
                      setCustomHex(e.target.value);
                    }}
                    className="w-9 h-9 rounded-lg border border-slate-300 dark:border-slate-600 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={customHexInput}
                    onChange={e => {
                      setCustomHexInput(e.target.value);
                      if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                        setCustomHex(e.target.value);
                      }
                    }}
                    className="w-28 text-xs font-mono py-1.5 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 uppercase"
                  />
                </div>
              </div>
              )}

              {/* Section 2: Global UI Text & Branding CMS */}
              {adminTab === 'branding' && (
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-4">
                <div className="flex items-center gap-2">
                  <Type className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {language === 'ar' ? 'تعديل نصوص وعناوين المنظومة' : 'Global Title, Subtitle & Broadcast Banner'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'ar' ? 'اسم التطبيق' : 'Application Name'}
                    </label>
                    <input
                      type="text"
                      value={titleInput}
                      onChange={e => setTitleInput(e.target.value)}
                      className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'ar' ? 'العنوان الفرعي' : 'Application Subtitle'}
                    </label>
                    <input
                      type="text"
                      value={subtitleInput}
                      onChange={e => setSubtitleInput(e.target.value)}
                      className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'ar' ? 'شريط الإشعار الإداري العام' : 'Mandatory Stand-Down / Notice Banner'}
                    </label>
                    <input
                      type="text"
                      value={bannerInput}
                      onChange={e => setBannerInput(e.target.value)}
                      className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveBranding}
                  className="px-4 py-2 text-xs font-bold text-white rounded-lg transition-all"
                  style={{ backgroundColor: pantone.hex }}
                >
                  {t('save_changes')}
                </button>
              </div>
              )}

              {/* Section 3: Feature Flags Controller */}
              {adminTab === 'features' && (
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-4">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {t('feature_flags')}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Worker Features */}
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2.5">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white">
                      <HardHat className="w-4 h-4 text-amber-500" />
                      <span>{t('portal_worker')}</span>
                    </div>
                    {Object.entries(config.portalFeatures.worker).map(([key, enabled]) => (
                      <label key={key} className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={() => toggleFeature('worker', key)}
                          className="rounded text-amber-600 focus:ring-amber-500"
                        />
                      </label>
                    ))}
                  </div>

                  {/* HSE Features */}
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2.5">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white">
                      <ShieldCheck className="w-4 h-4 text-blue-500" />
                      <span>{t('portal_hse')}</span>
                    </div>
                    {Object.entries(config.portalFeatures.hse).map(([key, enabled]) => (
                      <label key={key} className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={() => toggleFeature('hse', key)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                      </label>
                    ))}
                  </div>

                  {/* GM Features */}
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2.5">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white">
                      <Briefcase className="w-4 h-4 text-emerald-500" />
                      <span>{t('portal_gm')}</span>
                    </div>
                    {Object.entries(config.portalFeatures.gm).map(([key, enabled]) => (
                      <label key={key} className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={() => toggleFeature('gm', key)}
                          className="rounded text-emerald-600 focus:ring-emerald-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              )}

              {/* Section 4: Dynamic Custom Form Fields Builder */}
              {adminTab === 'fields' && (
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      {t('custom_form_builder')}
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400">
                    {config.customFields.length} {language === 'ar' ? 'حقول مخصصة' : 'custom fields'}
                  </span>
                </div>

                {/* Existing Fields List */}
                <div className="space-y-2">
                  {config.customFields.map(field => (
                    <div
                      key={field.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {field.label}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {field.type}
                        </span>
                        {field.required && (
                          <span className="text-[10px] text-rose-500 font-semibold">
                            {language === 'ar' ? 'إلزامي' : 'Required'}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleCustomField(field.id)}
                          className={`p-1.5 rounded-md text-xs transition-colors ${
                            field.enabled
                              ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40'
                              : 'text-slate-400 bg-slate-100 dark:bg-slate-800'
                          }`}
                        >
                          {field.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => removeCustomField(field.id)}
                          className="p-1.5 rounded-md text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add New Field Form */}
                <form onSubmit={handleAddNewField} className="pt-2 grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    value={newFieldLabel}
                    onChange={e => setNewFieldLabel(e.target.value)}
                    placeholder={t('field_label')}
                    className="text-xs py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                  <select
                    value={newFieldType}
                    onChange={e => setNewFieldType(e.target.value as any)}
                    className="text-xs py-2 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  >
                    <option value="text">Text / نصوص</option>
                    <option value="select">Dropdown / قائمة</option>
                    <option value="number">Number / رقمي</option>
                    <option value="toggle">Toggle / مفتاح تبديل</option>
                  </select>
                  {newFieldType === 'select' && (
                    <input
                      type="text"
                      value={newFieldOptions}
                      onChange={e => setNewFieldOptions(e.target.value)}
                      placeholder="Comma-separated options"
                      className="text-xs py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  )}
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newFieldRequired}
                        onChange={e => setNewFieldRequired(e.target.checked)}
                        className="rounded"
                      />
                      <span>{t('field_required')}</span>
                    </label>
                    <button
                      type="submit"
                      className="ml-auto px-3 py-2 text-xs font-bold text-white rounded-lg"
                      style={{ backgroundColor: pantone.hex }}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
              )}

              {/* Reset to Factory Defaults */}
              <div className="pt-4 flex justify-between items-center border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={resetToDefaults}
                  className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t('reset_defaults')}</span>
                </button>
                <button
                  onClick={() => setIsSuperAdminModalOpen(false)}
                  className="px-5 py-2 text-xs font-bold text-white rounded-xl shadow-sm"
                  style={{ backgroundColor: pantone.hex }}
                >
                  {t('close')}
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
