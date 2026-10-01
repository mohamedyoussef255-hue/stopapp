import React, { useState } from 'react';
import { useUIConfig } from '../context/UIConfigContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useSafety } from '../context/SafetyContext';
import { useAuth } from '../context/AuthContext';
import { RewardCatalogItem, RewardTier } from '../types';
import { 
  Trophy, 
  Award, 
  Gift, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  Check, 
  Sliders, 
  Send, 
  CheckCircle2, 
  Percent, 
  Coins, 
  UserCheck, 
  Sparkles, 
  Layers,
  FileText,
  AlertCircle
} from 'lucide-react';

interface RewardsManagementPanelProps {
  isExecutive?: boolean; // True when rendered in GM portal, false/admin when in SuperAdmin
}

export const RewardsManagementPanel: React.FC<RewardsManagementPanelProps> = ({ isExecutive = false }) => {
  const { 
    config, 
    toggleRewardsVisibility, 
    updateRewardsConfig, 
    updateRewardTier, 
    toggleRewardItem, 
    addRewardItem, 
    deleteRewardItem 
  } = useUIConfig();

  const { pantone } = useTheme();
  const { language } = useLanguage();
  const { leaderboard, addGMDirective } = useSafety();
  const { updateUserPoints, currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'tiers' | 'catalog' | 'bonus' | 'rules'>('tiers');

  // Editing state for points rules
  const [pointsPerReport, setPointsPerReport] = useState(config.rewardsConfig?.pointsPerReport || 100);
  const [bonusPhoto, setBonusPhoto] = useState(config.rewardsConfig?.bonusPhotoPoints || 25);
  const [bonusCritical, setBonusCritical] = useState(config.rewardsConfig?.bonusCriticalPoints || 50);
  const [programTitleAr, setProgramTitleAr] = useState(config.rewardsConfig?.programTitleAr || 'برنامج حوافز ومكافآت أبطال السلامة');
  const [programTitleEn, setProgramTitleEn] = useState(config.rewardsConfig?.programTitle || 'Safety Champions Incentive Program');
  const [executiveNoticeAr, setExecutiveNoticeAr] = useState(config.rewardsConfig?.executiveNoticeAr || '');
  const [rulesSaveSuccess, setRulesSaveSuccess] = useState(false);

  // New reward item form state
  const [newTitleAr, setNewTitleAr] = useState('');
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newCost, setNewCost] = useState(250);
  const [newCategoryAr, setNewCategoryAr] = useState('قسيمة');
  const [newCategoryEn, setNewCategoryEn] = useState('Voucher');
  const [newDescAr, setNewDescAr] = useState('');
  const [newDescEn, setNewDescEn] = useState('');

  // Manual Bonus Grant state
  const [selectedWorkerId, setSelectedWorkerId] = useState(leaderboard[0]?.id || 'usr_w_01');
  const [bonusPointsToAward, setBonusPointsToAward] = useState(150);
  const [bonusReason, setBonusReason] = useState(
    language === 'ar' 
      ? 'مكافأة استثنائية فورية معتمدة من الإدارة العامة لليقظة العالية وتفادي حادث محتمل.' 
      : 'Executive spot bonus for outstanding vigilance and proactive hazard prevention.'
  );
  const [bonusAwardSuccess, setBonusAwardSuccess] = useState(false);

  // Save rules changes
  const handleSaveRules = (e: React.FormEvent) => {
    e.preventDefault();
    updateRewardsConfig({
      pointsPerReport: Number(pointsPerReport),
      bonusPhotoPoints: Number(bonusPhoto),
      bonusCriticalPoints: Number(bonusCritical),
      programTitleAr,
      programTitle: programTitleEn,
      executiveNoticeAr,
      executiveNotice: executiveNoticeAr
    });
    setRulesSaveSuccess(true);
    setTimeout(() => setRulesSaveSuccess(false), 2500);
  };

  // Add new reward item to catalog
  const handleAddReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitleAr.trim() && !newTitleEn.trim()) return;

    addRewardItem({
      title: newTitleEn.trim() || newTitleAr.trim(),
      titleAr: newTitleAr.trim() || newTitleEn.trim(),
      costPoints: Number(newCost),
      description: newDescEn.trim() || 'Reward item claimable by safety champions.',
      descriptionAr: newDescAr.trim() || 'مكافأة معتمدة قابلة للاستبدال بنقاط السلامة.',
      category: newCategoryEn,
      categoryAr: newCategoryAr,
      icon: 'Gift',
      enabled: true
    });

    setNewTitleAr('');
    setNewTitleEn('');
    setNewDescAr('');
    setNewDescEn('');
    setNewCost(250);
  };

  // Grant manual bonus points
  const handleAwardBonus = (e: React.FormEvent) => {
    e.preventDefault();
    const worker = leaderboard.find(w => w.id === selectedWorkerId);
    const workerName = worker?.name || 'Marcus Reed';

    updateUserPoints(Number(bonusPointsToAward));

    // Also register an executive directive if GM
    const directiveMsg = language === 'ar'
      ? `صرف مكافأة استثنائية قدرها (${bonusPointsToAward} نقطة سلامة) للعامل [${workerName}]. السبب: ${bonusReason}`
      : `Awarded ${bonusPointsToAward} safety bonus points to ${workerName}. Reason: ${bonusReason}`;
    
    // Add to GM directives on first report or general log
    addGMDirective('REP-2026-104', directiveMsg);

    setBonusAwardSuccess(true);
    setTimeout(() => setBonusAwardSuccess(false), 3000);
  };

  const isEnabled = config.rewardsConfig?.enabled ?? true;

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Master Show/Hide Toggle */}
      <div className={`p-5 rounded-3xl border-2 transition-all flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isEnabled
          ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
          : 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${
            isEnabled ? 'bg-emerald-600' : 'bg-rose-600'
          }`}>
            {isEnabled ? <Eye className="w-6 h-6" /> : <EyeOff className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                {language === 'ar' ? 'حالة نظام المكافآت والحوافز الميدانية' : 'Safety Rewards Program Status'}
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                isEnabled
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 border-emerald-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200 border-rose-300'
              }`}>
                {isEnabled 
                  ? (language === 'ar' ? 'مفعّل وظاهر للعاملين' : 'Active & Visible to Workers') 
                  : (language === 'ar' ? 'مخفي بقرار إداري' : 'Hidden by Executive Directive')}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {language === 'ar' 
                ? (isEnabled 
                    ? 'نظام النقاط ولوحة الشرف والجوائز تظهر للعاملين في بواباتهم الميدانية.' 
                    : 'تم إخفاء لوحة النقاط والمكافآت عن جميع العاملين مع الحفاظ على الأرصدة مسجلة بالنظام.')
                : (isEnabled 
                    ? 'Rewards, tiers, and Wall of Fame are actively visible on the worker portal.' 
                    : 'The rewards panel is completely hidden from field workers.')}
            </p>
          </div>
        </div>

        {/* Big Master Toggle Button */}
        <button
          onClick={toggleRewardsVisibility}
          className={`px-5 py-3 rounded-2xl font-black text-xs text-white shadow-lg transition-all active:scale-[0.98] flex items-center gap-2 cursor-pointer ${
            isEnabled
              ? 'bg-rose-600 hover:bg-rose-700'
              : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          {isEnabled ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>
            {isEnabled 
              ? (language === 'ar' ? 'إخفاء نظام المكافآت الآن' : 'Hide Rewards Program') 
              : (language === 'ar' ? 'إظهار وتفعيل نظام المكافآت' : 'Activate & Show Rewards')}
          </span>
        </button>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('tiers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'tiers'
              ? 'text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          style={activeTab === 'tiers' ? { backgroundColor: pantone.hex } : undefined}
        >
          <Layers className="w-4 h-4" />
          <span>{language === 'ar' ? 'مستويات ونسب المكافأة (Tiers)' : 'Reward Tiers & Bonuses'}</span>
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'catalog'
              ? 'text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          style={activeTab === 'catalog' ? { backgroundColor: pantone.hex } : undefined}
        >
          <Gift className="w-4 h-4" />
          <span>{language === 'ar' ? 'دليل الجوائز والقسائم (Catalog)' : 'Reward Catalog & Vouchers'}</span>
        </button>

        <button
          onClick={() => setActiveTab('bonus')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'bonus'
              ? 'text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          style={activeTab === 'bonus' ? { backgroundColor: pantone.hex } : undefined}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{language === 'ar' ? 'منح مكافأة فورية لعامل' : 'Award Spot Bonus to Worker'}</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'rules'
              ? 'text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          style={activeTab === 'rules' ? { backgroundColor: pantone.hex } : undefined}
        >
          <Coins className="w-4 h-4" />
          <span>{language === 'ar' ? 'قواعد احتساب النقاط' : 'Points Calculation Rules'}</span>
        </button>
      </div>

      {/* Tab 1: Reward Tiers & Bonus Percentages */}
      {activeTab === 'tiers' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'ar' 
              ? 'تعديل مستويات المكافأة: حدد النقاط المطلوبة ونسبة الزيادة والمزايا لكل مستوى:' 
              : 'Configure safety reward tiers, thresholds, and performance bonus percentages:'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {config.rewardsConfig?.tiers?.map((tier, idx) => (
              <div 
                key={tier.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      {language === 'ar' ? tier.nameAr : tier.name}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-black text-emerald-600 dark:text-emerald-400">
                    +{tier.bonusPercentage}%
                  </span>
                </div>

                {/* Editable Threshold */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    {language === 'ar' ? 'النقاط المطلوبة (Min Points):' : 'Min Points Required:'}
                  </label>
                  <input
                    type="number"
                    value={tier.minPoints}
                    onChange={e => updateRewardTier(tier.id, { minPoints: Number(e.target.value) })}
                    className="w-full text-xs py-1.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold"
                  />
                </div>

                {/* Editable Bonus Percentage */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    {language === 'ar' ? 'نسبة المكافأة المالية (%):' : 'Bonus Percentage (%):'}
                  </label>
                  <input
                    type="number"
                    value={tier.bonusPercentage}
                    onChange={e => updateRewardTier(tier.id, { bonusPercentage: Number(e.target.value) })}
                    className="w-full text-xs py-1.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold text-emerald-600"
                  />
                </div>

                {/* Editable Perks Arabic */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    {language === 'ar' ? 'المزايا الإضافية (بالعربية):' : 'Perks Description (Arabic):'}
                  </label>
                  <input
                    type="text"
                    value={tier.perksAr}
                    onChange={e => updateRewardTier(tier.id, { perksAr: e.target.value })}
                    className="w-full text-xs py-1.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                {/* Editable Perks English */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    {language === 'ar' ? 'المزايا الإضافية (الإنجليزية):' : 'Perks Description (English):'}
                  </label>
                  <input
                    type="text"
                    value={tier.perks}
                    onChange={e => updateRewardTier(tier.id, { perks: e.target.value })}
                    className="w-full text-xs py-1.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Catalog & Vouchers Management */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'ar' 
                ? 'قائمة الجوائز والقسائم: يمكنك تفعيل أو إيقاف أي مكافأة أو إضافة عناصر جديدة:' 
                : 'Reward Catalog Items: Enable/disable rewards or add new redeemable incentives:'}
            </span>
          </div>

          {/* Current Catalog Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {config.rewardsConfig?.catalog?.map(item => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                  item.enabled
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
                    : 'bg-slate-50/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/60 opacity-60'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {language === 'ar' ? item.titleAr : item.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {language === 'ar' ? item.categoryAr : item.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'ar' ? item.descriptionAr : item.description}
                  </p>
                  <span className="font-mono text-xs font-black text-indigo-600 dark:text-indigo-400 block pt-1">
                    {item.costPoints} {language === 'ar' ? 'نقطة سلامة' : 'pts required'}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleRewardItem(item.id)}
                    title={item.enabled ? 'إخفاء المكافأة' : 'تفعيل المكافأة'}
                    className={`p-1.5 rounded-lg border text-xs font-bold transition-colors ${
                      item.enabled
                        ? 'border-emerald-300 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40'
                        : 'border-slate-300 text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    {item.enabled ? <Check className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => deleteRewardItem(item.id)}
                    title="حذف المكافأة"
                    className="p-1.5 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Reward Item Form */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/30 space-y-4">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-500" />
              <span>{language === 'ar' ? 'إضافة مكافأة جديدة لدليل الحوافز' : 'Add New Reward to Catalog'}</span>
            </h4>

            <form onSubmit={handleAddReward} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  {language === 'ar' ? 'عنوان المكافأة (بالعربية):' : 'Title (Arabic):'}
                </label>
                <input
                  type="text"
                  required
                  value={newTitleAr}
                  onChange={e => setNewTitleAr(e.target.value)}
                  placeholder="مثال: قسيمة وقود مجانية (200 ريال)"
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  {language === 'ar' ? 'عنوان المكافأة (بالإنجليزية):' : 'Title (English):'}
                </label>
                <input
                  type="text"
                  value={newTitleEn}
                  onChange={e => setNewTitleEn(e.target.value)}
                  placeholder="e.g. Free Fuel Voucher (200 SAR)"
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  {language === 'ar' ? 'تكلفة النقاط المطلوبة للاستبدال:' : 'Points Cost:'}
                </label>
                <input
                  type="number"
                  required
                  min="50"
                  step="25"
                  value={newCost}
                  onChange={e => setNewCost(Number(e.target.value))}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  {language === 'ar' ? 'تصنيف المكافأة:' : 'Category:'}
                </label>
                <select
                  value={newCategoryAr}
                  onChange={e => {
                    setNewCategoryAr(e.target.value);
                    setNewCategoryEn(e.target.value === 'قسيمة' ? 'Voucher' : e.target.value === 'عينية' ? 'Gear' : 'Recognition');
                  }}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <option value="قسيمة">{language === 'ar' ? 'قسيمة شراء / تسوق' : 'Shopping Voucher'}</option>
                  <option value="عينية">{language === 'ar' ? 'مهمات ومعدات سلامة' : 'Safety Gear'}</option>
                  <option value="تكريم">{language === 'ar' ? 'تكريم وميزة خاصة' : 'Recognition & Privilege'}</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  {language === 'ar' ? 'وصف المكافأة والشروط:' : 'Description & Terms:'}
                </label>
                <input
                  type="text"
                  value={newDescAr}
                  onChange={e => setNewDescAr(e.target.value)}
                  placeholder={language === 'ar' ? 'تُسلّم القسيمة إلكترونياً وتُصرف فورياً للموظف' : 'Delivered digitally upon redemption'}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>

              <div className="sm:col-span-2 pt-1">
                <button
                  type="submit"
                  className="py-2.5 px-4 rounded-xl font-bold text-xs text-white shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  style={{ backgroundColor: pantone.hex }}
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'ar' ? 'إضافة المكافأة للدليل' : 'Save & Publish Reward'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 3: Award Spot Bonus to Worker */}
      {activeTab === 'bonus' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <div>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                {language === 'ar' ? 'صرف مكافأة استثنائية ونقاط فورية لعامل' : 'Executive Direct Safety Points Grant'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {language === 'ar' 
                  ? 'صلاحية حصرية للمدير العام ومدير النظام لمنح نقاط تحفيزية إضافية مع توثيق السبب رسمياً' 
                  : 'Direct authority to award spot points and log official executive recognition.'}
              </p>
            </div>
          </div>

          {bonusAwardSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                {language === 'ar' 
                  ? `تم بنجاح إيداع (+${bonusPointsToAward} نقطة سلامة) في حساب الموظف، وتسجيل التوجيه الإداري!` 
                  : `Successfully granted +${bonusPointsToAward} bonus points!`}
              </span>
            </div>
          )}

          <form onSubmit={handleAwardBonus} className="space-y-4 text-xs">
            {/* Worker Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'ar' ? 'حدد الموظف المستفيد من المكافأة:' : 'Select Target Employee:'}
              </label>
              <select
                value={selectedWorkerId}
                onChange={e => setSelectedWorkerId(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {leaderboard.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.employeeId}) - {w.department} - رصيده الحالي: {w.points} نقطة
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Points Preset */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'ar' ? 'قيمة النقاط الممنوحة:' : 'Bonus Points Amount:'}
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {[50, 100, 150, 250, 500].map(pts => (
                  <button
                    key={pts}
                    type="button"
                    onClick={() => setBonusPointsToAward(pts)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-colors ${
                      bonusPointsToAward === pts
                        ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    +{pts} {language === 'ar' ? 'نقطة' : 'pts'}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="10"
                step="10"
                required
                value={bonusPointsToAward}
                onChange={e => setBonusPointsToAward(Number(e.target.value))}
                className="w-full text-xs font-mono font-bold py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            {/* Reason */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'ar' ? 'السبب والمسوغ الإداري (يظهر في التوجيهات الرسمية):' : 'Official Justification / Reason:'}
              </label>
              <textarea
                rows={2}
                required
                value={bonusReason}
                onChange={e => setBonusReason(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-2xl font-black text-xs text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              style={{ backgroundColor: pantone.hex }}
            >
              <Coins className="w-4 h-4" />
              <span>
                {language === 'ar' 
                  ? `اعتماد وصرف (+${bonusPointsToAward} نقطة سلامة) فوراً` 
                  : `Authorize & Award +${bonusPointsToAward} Safety Points`}
              </span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 4: Points Calculation Rules */}
      {activeTab === 'rules' && (
        <form onSubmit={handleSaveRules} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-500" />
              <span>{language === 'ar' ? 'إعدادات وقواعد احتساب النقاط التلقائية' : 'Automated Point Matrix Settings'}</span>
            </h4>
            {rulesSaveSuccess && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 animate-in fade-in">
                <Check className="w-3.5 h-3.5" />
                {language === 'ar' ? 'تم الحفظ وتحديث النظام بنجاح' : 'Settings Saved!'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                {language === 'ar' ? 'نقاط كل بلاغ سلامة مؤكد:' : 'Points per verified report:'}
              </label>
              <input
                type="number"
                min="10"
                value={pointsPerReport}
                onChange={e => setPointsPerReport(Number(e.target.value))}
                className="w-full text-xs font-mono font-bold py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                {language === 'ar' ? 'بونص إضافي لإرفاق صورة:' : 'Bonus points for photo proof:'}
              </label>
              <input
                type="number"
                min="0"
                value={bonusPhoto}
                onChange={e => setBonusPhoto(Number(e.target.value))}
                className="w-full text-xs font-mono font-bold py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                {language === 'ar' ? 'بونص تفادي خطر حرج (Critical):' : 'Bonus for stopping critical hazard:'}
              </label>
              <input
                type="number"
                min="0"
                value={bonusCritical}
                onChange={e => setBonusCritical(Number(e.target.value))}
                className="w-full text-xs font-mono font-bold py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
          </div>

          {/* Program Title & Notice */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                {language === 'ar' ? 'مسمى برنامج الحوافز (بالعربية):' : 'Program Title (Arabic):'}
              </label>
              <input
                type="text"
                value={programTitleAr}
                onChange={e => setProgramTitleAr(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                {language === 'ar' ? 'مسمى برنامج الحوافز (بالإنجليزية):' : 'Program Title (English):'}
              </label>
              <input
                type="text"
                value={programTitleEn}
                onChange={e => setProgramTitleEn(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                {language === 'ar' ? 'إشعار الإدارة العامة المرافق للمكافآت:' : 'Executive Notice / Disclaimer:'}
              </label>
              <input
                type="text"
                value={executiveNoticeAr}
                onChange={e => setExecutiveNoticeAr(e.target.value)}
                placeholder="تخضع المكافآت لتقييم ربع سنوي معتمد من المدير العام"
                className="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
          </div>

          <button
            type="submit"
            className="py-2.5 px-6 rounded-xl font-bold text-xs text-white shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            style={{ backgroundColor: pantone.hex }}
          >
            <Check className="w-4 h-4" />
            <span>{language === 'ar' ? 'حفظ وتطبيق القواعد فوراً' : 'Save & Enforce Rules'}</span>
          </button>
        </form>
      )}

    </div>
  );
};
