import React, { useState } from 'react';
import { useSafety } from '../context/SafetyContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useUIConfig } from '../context/UIConfigContext';
import { RewardsManagementPanel } from './RewardsManagementPanel';
import { InteractivePlantMap } from './InteractivePlantMap';
import { GMDirectiveModal } from './GMDirectiveModal';
import { getLocalizedCategory, getLocalizedZone, getLocalizedSeverity } from '../utils/localizationHelper';
import { SAFETY_OFFICERS_LOCATIONS } from '../utils/plantMapData';
import { 
  Briefcase, 
  AlertOctagon, 
  Send, 
  ShieldAlert, 
  MessageSquare, 
  TrendingUp, 
  CheckCircle2, 
  ArrowUpRight, 
  Activity, 
  UserCheck, 
  FileCheck, 
  Trophy, 
  Sliders, 
  Eye, 
  EyeOff,
  Inbox,
  Gauge,
  MapPin,
  Clock,
  Radio,
  PlusCircle,
  FileSearch,
  CheckCheck,
  Bell,
  Sparkles,
  Zap,
  Phone
} from 'lucide-react';
import { SafetyReport } from '../types';

interface GMPortalProps {
  isSystemAdminView?: boolean;
}

export const GMPortal: React.FC<GMPortalProps> = ({ isSystemAdminView = false }) => {
  const { 
    reports, 
    setSelectedReportForModal, 
    openChatWithReport, 
    executiveDirectives,
    updateDirectiveStatus
  } = useSafety();

  const { pantone } = useTheme();
  const { t, language } = useLanguage();
  const { config } = useUIConfig();

  const [mainTab, setMainTab] = useState<'oversight' | 'map' | 'rewards'>('oversight');
  const [oversightSubView, setOversightSubView] = useState<'intake' | 'kpis'>('intake');
  const [isDirectiveModalOpen, setIsDirectiveModalOpen] = useState(false);
  const [selectedReportForDirective, setSelectedReportForDirective] = useState<SafetyReport | null>(null);
  const [stopWorkSimulation, setStopWorkSimulation] = useState(false);

  // Critical & high priority reports requiring executive attention
  const urgentReports = reports.filter(
    r => r.aiAssessment.severity === 'critical' || r.aiAssessment.severity === 'high'
  );

  const isRewardsEnabled = config.rewardsConfig?.enabled ?? true;

  const isSectionVisible = (sectionId: string) => {
    const sec = config.pageSections?.gm?.find(s => s.id === sectionId);
    return sec ? sec.visible !== false : true;
  };

  const isActionVisible = (actionId: string) => {
    const act = config.actionIcons?.find(a => a.id === actionId);
    return act ? act.visible !== false : true;
  };

  const handleOpenDirectiveModal = (report?: SafetyReport) => {
    setSelectedReportForDirective(report || null);
    setIsDirectiveModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Executive Header */}
      {isSectionVisible('sec_gm_header') && (
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-emerald-600" />
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              {isSystemAdminView
                ? 'بوابة المدير العام ومدير النظام'
                : 'بوابة الإدارة العامة والرقابة التنفيذية'}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            الرقابة الميدانية التنفيذية، استلام وفحص البلاغات بصدر الصفحة، توجيه الأوامر الملزمة للإدارات، والرادار الجغرافي للمحطات
          </p>
        </div>

        {/* Executive Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Dispatch Directive Button */}
          {isActionVisible('act_directive') && (
          <button
            onClick={() => handleOpenDirectiveModal()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-white shadow-md hover:opacity-95 transition-all cursor-pointer"
            style={{ backgroundColor: pantone.hex }}
          >
            <PlusCircle className="w-4 h-4" />
            <span>إصدار توجيه تصحيحي للإدارات</span>
          </button>
          )}

          {/* Executive Emergency Stop-Work Notice Simulation Toggle */}
          <button
            onClick={() => setStopWorkSimulation(!stopWorkSimulation)}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
              stopWorkSimulation
                ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
                : 'border-rose-300 dark:border-rose-900 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40'
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            <span>
              {stopWorkSimulation
                ? 'أمر الإيقاف العام سارٍ (خطوط الإنتاج متوقفة)'
                : 'إعلان إيقاف عمل طارئ (Stop-Work)'}
            </span>
          </button>
        </div>
      </div>
      )}

      {/* Prominent Real-time Notification Banner for GM & HSE Personnel */}
      {isSectionVisible('sec_gm_notice_banner') && (
      <div className="p-4 sm:p-5 rounded-3xl bg-linear-to-r from-rose-950/90 via-slate-900 to-indigo-950/90 text-white border-2 border-rose-500/50 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          <div className="p-3 rounded-2xl bg-rose-600 text-white shadow-lg animate-pulse shrink-0">
            <Bell className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-[10px] font-black uppercase tracking-wider">
                إشعار فوري عاجل
              </span>
              <span className="text-xs font-semibold text-rose-300">
                موجه للمدير العام والعاملين بإدارة السلامة والصحة المهنية
              </span>
            </div>
            <h3 className="text-sm font-black text-white">
              تم رصد ({urgentReports.length}) بلاغات حرجة تستوجب تدخلاً فورياً وإصدار توجيهات تصحيحية ملزمة للإدارات المعنية!
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {isActionVisible('act_directive') && (
          <button
            onClick={() => handleOpenDirectiveModal(urgentReports[0])}
            className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-white text-rose-950 font-black text-xs hover:bg-rose-50 transition-colors shadow-md cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5 rtl:rotate-180" />
            <span>إصدار توجيه تصحيحي عاجل</span>
          </button>
          )}
          <button
            onClick={() => {
              setMainTab('oversight');
              setOversightSubView('intake');
            }}
            className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-rose-800/80 hover:bg-rose-700 text-white font-bold text-xs border border-rose-400/40 transition-colors cursor-pointer text-center"
          >
            فحص البلاغات بصدر الصفحة
          </button>
        </div>
      </div>
      )}

      {/* Main Executive Tabs: Oversight vs Interactive Map vs Rewards */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/60 dark:bg-slate-800/60 rounded-2xl border border-slate-300/60 dark:border-slate-700/60 w-fit">
        <button
          onClick={() => setMainTab('oversight')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mainTab === 'oversight'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-500" />
          <span>الرقابة الميدانية والتوجيهات الإلزامية</span>
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
            {urgentReports.length}
          </span>
        </button>

        {isSectionVisible('sec_gm_plant_map') && isActionVisible('act_map') && (
        <button
          onClick={() => setMainTab('map')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mainTab === 'map'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <MapPin className="w-4 h-4 text-emerald-500" />
          <span>خريطة المنشأة وتمركز مسؤولي HSE</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </button>
        )}

        {isSectionVisible('sec_gm_rewards_panel') && (
        <button
          onClick={() => setMainTab('rewards')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mainTab === 'rewards'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>التحكم بنظام المكافآت والحوافز</span>
          <span className={`w-2 h-2 rounded-full ${isRewardsEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
        </button>
        )}
      </div>

      {/* VIEW 1: INTERACTIVE PLANT MAP */}
      {mainTab === 'map' && isSectionVisible('sec_gm_plant_map') && (
        <div className="space-y-6">
          <InteractivePlantMap />
        </div>
      )}

      {/* VIEW 2: REWARDS MANAGEMENT */}
      {mainTab === 'rewards' && isSectionVisible('sec_gm_rewards_panel') && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
          <div className="pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>لوحة تحكم المدير العام لنظام المكافآت والتحفيز</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              تحكم كامل في إظهار وإخفاء المكافآت للعاملين، علماً بأن النقاط لا تُمنح إلا بعد إغلاق الملف واعتماد الإجراءات التصحيحية.
            </p>
          </div>
          <RewardsManagementPanel isExecutive={true} />
        </div>
      )}

      {/* VIEW 3: FIELD OVERSIGHT & MANDATORY DIRECTIVES */}
      {mainTab === 'oversight' && (
        <div className="space-y-6">
          
          {/* Sub-view switcher: Intake vs KPIs & Response Speed */}
          <div className="flex items-center gap-2 pb-2">
            <button
              onClick={() => setOversightSubView('intake')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                oversightSubView === 'intake'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              <Inbox className="w-4 h-4 text-blue-500" />
              <span>استلام وفحص البلاغات الميدانية (صدر الصفحة)</span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                {reports.length}
              </span>
            </button>

            <button
              onClick={() => setOversightSubView('kpis')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                oversightSubView === 'kpis'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              <Gauge className="w-4 h-4 text-emerald-500" />
              <span>تقييم الأداء وسرعة الاستجابة (إدارة HSE)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>
          </div>

          {/* Sub-view: Intake & Inspection - LIFTED TO THE TOP (في صدر الصفحة) */}
          {oversightSubView === 'intake' && (
            <div className="space-y-6">
              
              {/* 1. LIFTED TO TOP: Live Reports Inspection Center */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600">
                      <Inbox className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-black text-slate-900 dark:text-white">
                        مركز استلام وفحص البلاغات الميدانية (في صدر الصفحة)
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        فحص البلاغات الواردة لحظياً، التدقيق المباشر، وتوجيه الإجراءات التصحيحية الفورية
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl">
                    {reports.length} بلاغ مسجل
                  </span>
                </div>

                <div className="space-y-4">
                  {reports.map(rep => {
                    const catLocalized = getLocalizedCategory(rep.category, language);
                    const zoneLocalized = getLocalizedZone(rep.siteZone, language);
                    const sevLocalized = getLocalizedSeverity(rep.aiAssessment.severity, language);
                    const isUrgent = rep.aiAssessment.severity === 'critical' || rep.aiAssessment.severity === 'high';

                    return (
                      <div
                        key={rep.id}
                        className={`p-5 rounded-2xl border space-y-4 transition-all ${
                          isUrgent
                            ? 'border-rose-300 dark:border-rose-900/80 bg-rose-50/30 dark:bg-rose-950/20'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                        }`}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-md bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
                                {rep.id}
                              </span>
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                isUrgent
                                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300'
                                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                              }`}>
                                {sevLocalized}
                              </span>
                              <span className="text-xs text-slate-500 font-mono">
                                {rep.timestamp}
                              </span>
                              {rep.status === 'resolved' && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 flex items-center gap-1">
                                  <CheckCheck className="w-3 h-3" />
                                  <span>تم الإغلاق وصرف النقاط</span>
                                </span>
                              )}
                            </div>

                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                              {rep.titleAr || rep.title}
                            </h3>

                            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-3xl">
                              {rep.descriptionAr || rep.description}
                            </p>

                            <div className="flex flex-wrap gap-4 text-[11px] text-slate-500 pt-1">
                              <span>📍 {zoneLocalized}</span>
                              <span>👷 {rep.reporter.nameAr || rep.reporter.name} ({rep.reporter.employeeId})</span>
                              <span>🏷️ {catLocalized}</span>
                              {rep.pointsPending && !rep.pointsAwarded && (
                                <span className="font-mono font-bold text-amber-600">
                                  ⏳ +{rep.pointsPending} نقطة معلقة للإغلاق
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedReportForModal(rep)}
                              className="px-3.5 py-1.5 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              معاينة وفحص البلاغ
                            </button>
                            {isActionVisible('act_directive') && (
                            <button
                              onClick={() => handleOpenDirectiveModal(rep)}
                              className="px-3.5 py-1.5 text-xs font-bold text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer bg-indigo-600 hover:bg-indigo-700"
                            >
                              <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                              <span>إصدار توجيه للإدارة</span>
                            </button>
                            )}
                            {isActionVisible('act_chat') && (
                            <button
                              onClick={() => openChatWithReport('hse_gm', rep.id)}
                              className="p-2 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                              title="محادثة فورية"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* 2. Executive Summary Metrics */}
              {isSectionVisible('sec_gm_kpi_grid') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
                    <span>مؤشر الامتثال والسلامة</span>
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="text-3xl font-black font-mono text-slate-900 dark:text-white">
                    98.4%
                  </span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block mt-1">
                    +2.1% مقارنة بالمستهدف الربع سنوي
                  </span>
                </div>

                <div className="p-5 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 shadow-xs">
                  <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 text-xs mb-2">
                    <span>مخاطر حرجة تستوجب تدخلاً</span>
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <span className="text-3xl font-black font-mono text-rose-700 dark:text-rose-400">
                    {urgentReports.length}
                  </span>
                  <span className="text-[11px] text-rose-600 block mt-1">
                    تحت متابعة الإدارة المباشرة
                  </span>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
                    <span>متوسط سرعة المعالجة</span>
                    <Activity className="w-4 h-4 text-blue-500" />
                  </div>
                  <span className="text-3xl font-black font-mono text-slate-900 dark:text-white">
                    38 دقيقة
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    المستهدف: أقل من 60 دقيقة
                  </span>
                </div>

                <div 
                  onClick={() => handleOpenDirectiveModal()}
                  className="p-5 rounded-2xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-950/20 shadow-xs cursor-pointer hover:border-indigo-400 transition-all group"
                >
                  <div className="flex items-center justify-between text-indigo-700 dark:text-indigo-400 text-xs mb-2">
                    <span>أوامر التوجيه الصادرة</span>
                    <PlusCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-3xl font-black font-mono text-indigo-900 dark:text-indigo-200">
                    {executiveDirectives.length}
                  </span>
                  <span className="text-[11px] text-indigo-600 group-hover:underline block mt-1">
                    + إصدار توجيه جديد للإدارات
                  </span>
                </div>
              </div>
              )}

              {/* 3. Active Executive Directives Trail */}
              {isSectionVisible('sec_gm_directives_trail') && executiveDirectives.length > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-indigo-600" />
                      <h2 className="text-sm font-black text-slate-900 dark:text-white">
                        سجل التوجيهات والأوامر التصحيحية الصادرة من المدير العام للإدارات
                      </h2>
                    </div>
                    {isActionVisible('act_directive') && (
                    <button
                      onClick={() => handleOpenDirectiveModal()}
                      className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                    >
                      + توجيه جديد
                    </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {executiveDirectives.map(dir => (
                      <div
                        key={dir.id}
                        className="p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/20 dark:bg-indigo-950/20 space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-indigo-950 dark:text-indigo-200">
                            {dir.targetDepartmentAr || dir.targetDepartment}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            dir.priority === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {dir.priority === 'critical' ? 'حرج وفوري' : 'أولوية عالية'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                          "{dir.directive}"
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-indigo-100 dark:border-indigo-900/40">
                          <span>👤 {dir.assigneeName}</span>
                          <span className="font-mono text-rose-600 font-bold">⏱️ {dir.deadline}</span>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-slate-400 font-mono">{dir.timestamp}</span>
                          <button
                            onClick={() => updateDirectiveStatus(dir.id, 'executed')}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              dir.status === 'executed'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-600 hover:text-white'
                            }`}
                          >
                            {dir.status === 'executed' ? '✓ تم التنفيذ والاعتماد' : 'تأكيد اكتمال التنفيذ'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Sub-view: HSE Performance & Response Speed KPIs */}
          {oversightSubView === 'kpis' && (
            <div className="space-y-6">
              
              {/* FEATURED: مسؤول السلامة الأسرع في تنفيذ المعالجة الفورية المباشرة دون انتظار توجيهات المدير العام وفق اشتراطات السلامة والصحة المهنية */}
              {isSectionVisible('sec_gm_fastest_hero') && (
              <div className="p-6 rounded-3xl bg-linear-to-r from-amber-950/80 via-slate-900 to-emerald-950/80 border-2 border-amber-500/60 shadow-xl text-white space-y-4 relative overflow-hidden">
                {isActionVisible('act_fastest') && (
                <div className="absolute top-0 left-0 rtl:left-auto rtl:right-0 p-3 bg-amber-500 text-slate-950 font-black text-[10px] uppercase rounded-bl-2xl rtl:rounded-bl-none rtl:rounded-br-2xl shadow-md flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>وسام التميز القياسي: الأسرع في المعالجة الفورية المستقلة</span>
                </div>
                )}

                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pt-3">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg ring-4 ring-amber-400/30">
                        خ.س
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[10px] text-white">
                        ✓
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-black text-white">
                          م. خالد بن سلطان السويدي
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                          كود الموظف: EMP-4101
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                          المحطة: محطة التكرير ومعالجة الغاز
                        </span>
                      </div>
                      <p className="text-xs text-amber-200 font-bold">
                        مسؤول السلامة الأسرع في تنفيذ المعالجة الفورية الميدانية دون انتظار توجيهات المدير العام وفقاً لاشتراطات ومعايير السلامة والصحة المهنية (OSHA / ISO 45001)
                      </p>
                      <p className="text-[11px] text-slate-300 leading-relaxed max-w-3xl">
                        يمتلك صلاحية الإيقاف والعزل الفوري المستقل (Zero-Harm Rapid Authority)؛ حيث يباشر عزل مصادر الخطر وتأمين سلامة العاملين في الموقع بلحظات قياسية دون أي تعطيل إداري.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 w-full lg:w-auto justify-end">
                    <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-center min-w-[100px]">
                      <span className="text-[10px] text-slate-400 block font-semibold">متوسط سرعة المعالجة</span>
                      <span className="text-xl font-black font-mono text-emerald-400">1.8 دقيقة</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-center min-w-[100px]">
                      <span className="text-[10px] text-slate-400 block font-semibold">حالات عولجت ذاتياً</span>
                      <span className="text-xl font-black font-mono text-amber-400">34 حالة</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-center min-w-[100px]">
                      <span className="text-[10px] text-slate-400 block font-semibold">الامتثال للاشتراطات</span>
                      <span className="text-xl font-black font-mono text-emerald-400">100%</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-slate-300">الحالة الميدانية: معالجة فورية ذاتية مباشرة (معتمدة ومسجلة بسجل السلامة)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href="tel:+966504101122"
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>اتصال هاتفي مباشر</span>
                    </a>
                    {isActionVisible('act_chat') && (
                    <button
                      onClick={() => openChatWithReport('hse_gm', 'REP-2026-104')}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>محادثة فورية (قناة المدير العام)</span>
                    </button>
                    )}
                  </div>
                </div>
              </div>
              )}

              {/* Primary KPI Gauges */}
              {isSectionVisible('sec_gm_kpi_grid') && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Gauge 1: Safety & Compliance Rate */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">
                      مدى الامتثال والسلامة الميدانية
                    </span>
                    <ShieldAlert className="w-5 h-5 text-emerald-500" />
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                      98.4%
                    </span>
                    <span className="text-xs text-slate-400">/ 100%</span>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: '98.4%' }}></div>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    مؤشر الامتثال لمعايير OSHA 1910 وISO 45001 وتطبيق تدابير العزل والإغلاق في المحطات.
                  </p>
                </div>

                {/* Gauge 2: Average Remediation Time */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">
                      متوسط سرعة المعالجة والإغلاق
                    </span>
                    <Clock className="w-5 h-5 text-blue-500" />
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black font-mono text-blue-600 dark:text-blue-400">
                      38
                    </span>
                    <span className="text-sm font-bold text-slate-500">دقيقة</span>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '63%' }}></div>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    المستهدف التنفيذي: أقل من 60 دقيقة من لحظة رصد الخطر حتى اعتماد التدبير التصحيحي.
                  </p>
                </div>

                {/* Gauge 3: HSE Response Speed */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">
                      سرعة استجابة مسؤولي HSE
                    </span>
                    <Activity className="w-5 h-5 text-amber-500" />
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black font-mono text-amber-600 dark:text-amber-400">
                      4.2
                    </span>
                    <span className="text-sm font-bold text-slate-500">دقائق</span>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '85%' }}></div>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    معدل وصول مسؤولي السلامة لموقع البلاغ فور انطلاق الإنذار والتوجيه في المحطات.
                  </p>
                </div>

              </div>
              )}

              {/* HSE Officers Response Speed & Performance Table */}
              {isSectionVisible('sec_gm_officers_table') && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      تقييم أداء وسرعة استجابة مسؤولي السلامة والصحة المهنية الميدانيين
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {SAFETY_OFFICERS_LOCATIONS.length} مسؤولي سلامة وصحة مهنية
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-right rtl:text-right ltr:text-left">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
                        <th className="py-2.5 px-3 font-semibold">مسؤول السلامة والصحة المهنية</th>
                        <th className="py-2.5 px-3 font-semibold">المحطة المكلف بها</th>
                        <th className="py-2.5 px-3 font-semibold">متوسط سرعة الاستجابة</th>
                        <th className="py-2.5 px-3 font-semibold">نسبة الإغلاق الناجح</th>
                        <th className="py-2.5 px-3 font-semibold">حالة التواجد</th>
                        <th className="py-2.5 px-3 font-semibold">إجراء فوري</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {SAFETY_OFFICERS_LOCATIONS.map((officer) => {
                        const isFastest = officer.isFastestResponder;
                        return (
                          <tr
                            key={officer.id}
                            className={`transition-colors ${
                              isFastest
                                ? 'bg-amber-50/50 dark:bg-amber-950/20 border-l-4 rtl:border-l-0 rtl:border-r-4 border-amber-500 font-medium'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                          >
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2.5">
                                <span className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center text-xs shadow-xs ${
                                  isFastest
                                    ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400/50'
                                    : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                }`}>
                                  {officer.avatar}
                                </span>
                                <div>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-black text-slate-900 dark:text-white">
                                      {officer.nameAr}
                                    </span>
                                    {isFastest && (
                                      <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black flex items-center gap-0.5 shadow-xs">
                                        <Zap className="w-2.5 h-2.5 fill-current" />
                                        <span>الأسرع معالجة دون انتظار التوجيهات</span>
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-slate-400 font-mono">{officer.phone}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">
                              {officer.stationNameAr}
                            </td>
                            <td className="py-3 px-3 font-mono font-bold">
                              {isFastest ? (
                                <span className="text-amber-600 dark:text-amber-400 font-black text-sm">
                                  ⚡ {officer.swiftRemediationAvgMinutes || '1.8 دقيقة'}
                                </span>
                              ) : (
                                <span className="text-emerald-600 dark:text-emerald-400">
                                  {officer.swiftRemediationAvgMinutes || '3.2 دقيقة'}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                              {isFastest ? '100%' : '97.5%'}
                            </td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isFastest
                                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                                  : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              }`}>
                                {officer.statusAr}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <button
                                onClick={() => openChatWithReport('hse_gm', officer.activeTaskId || 'REP-2026-104')}
                                className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 font-bold text-[11px] transition-colors cursor-pointer"
                              >
                                توجيه ومحادثة
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* GM Executive Directive Modal */}
      <GMDirectiveModal
        isOpen={isDirectiveModalOpen}
        onClose={() => {
          setIsDirectiveModalOpen(false);
          setSelectedReportForDirective(null);
        }}
        targetReport={selectedReportForDirective}
      />

    </div>
  );
};
