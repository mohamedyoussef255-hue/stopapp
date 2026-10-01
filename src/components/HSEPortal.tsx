import React, { useState } from 'react';
import { useSafety } from '../context/SafetyContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useUIConfig } from '../context/UIConfigContext';
import { ReportStatus, SafetyReport, Severity } from '../types';
import { getLocalizedCategory, getLocalizedZone, getLocalizedStatus, getLocalizedSeverity } from '../utils/localizationHelper';
import { 
  ShieldCheck, 
  Filter, 
  Search, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  MessageSquare, 
  Download, 
  Volume2, 
  VolumeX, 
  ChevronRight,
  Sparkles,
  Clock,
  User
} from 'lucide-react';

export const HSEPortal: React.FC = () => {
  const { 
    reports, 
    setSelectedReportForModal, 
    openChatWithReport, 
    updateReportStatus,
    isAudioMuted, 
    toggleAudioMute, 
    triggerTestAudioAlert 
  } = useSafety();

  const { pantone } = useTheme();
  const { t, language } = useLanguage();
  const { config } = useUIConfig();

  const isSectionVisible = (sectionId: string) => {
    const sec = config.pageSections?.hse?.find(s => s.id === sectionId);
    return sec ? sec.visible !== false : true;
  };

  const isActionVisible = (actionId: string) => {
    const act = config.actionIcons?.find(a => a.id === actionId);
    return act ? act.visible !== false : true;
  };

  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredReports = reports.filter(rep => {
    if (severityFilter !== 'all' && rep.aiAssessment.severity !== severityFilter) {
      return false;
    }
    if (statusFilter !== 'all' && rep.status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = (language === 'ar' ? (rep.titleAr || rep.title) : rep.title).toLowerCase().includes(q);
      const descMatch = (language === 'ar' ? (rep.descriptionAr || rep.description) : rep.description).toLowerCase().includes(q);
      const idMatch = rep.id.toLowerCase().includes(q);
      const zoneMatch = (language === 'ar' ? (rep.siteZoneAr || rep.siteZone) : rep.siteZone).toLowerCase().includes(q);
      return titleMatch || descMatch || idMatch || zoneMatch;
    }
    return true;
  });

  const exportCSV = () => {
    const headers = language === 'ar'
      ? ['رقم البلاغ', 'التوقيت', 'عنوان الخطر', 'التصنيف', 'المنطقة', 'الشدة', 'مؤشر الخطورة', 'الحالة', 'المبلّغ']
      : ['Report ID', 'Timestamp', 'Title', 'Category', 'Site Zone', 'Severity', 'Risk Score', 'Status', 'Reporter'];

    const rows = filteredReports.map(r => [
      r.id,
      r.timestamp,
      `"${((language === 'ar' ? r.titleAr || r.title : r.title)).replace(/"/g, '""')}"`,
      language === 'ar' ? getLocalizedCategory(r.category, 'ar') : r.category,
      language === 'ar' ? getLocalizedZone(r.siteZone, 'ar') : r.siteZone,
      r.aiAssessment.severity.toUpperCase(),
      r.aiAssessment.score,
      getLocalizedStatus(r.status, language),
      `"${(language === 'ar' && r.reporter.nameAr ? r.reporter.nameAr : r.reporter.name)} (${r.reporter.employeeId})"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `STOP_Safety_Reports_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSeverityBadgeClass = (severity: Severity) => {
    switch (severity) {
      case 'critical':
        return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900';
      case 'high':
        return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-900';
      case 'medium':
        return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900';
      case 'low':
      default:
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900';
    }
  };

  const getStatusBadge = (status: ReportStatus) => {
    const label = getLocalizedStatus(status, language);
    switch (status) {
      case 'open':
        return <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">{label}</span>;
      case 'investigating':
        return <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">{label}</span>;
      case 'action_in_progress':
        return <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">{label}</span>;
      case 'resolved':
        return <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">{label}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Bar */}
      {isSectionVisible('sec_hse_header') && (
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-blue-500" />
              <h1 className="text-xl font-black text-slate-900 dark:text-white">
                {t('portal_hse')}
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              مركز متابعة وفحص البلاغات الميدانية والتحقق من تدابير السيطرة
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Test Sound Alert Button */}
            {isActionVisible('act_sound') && (
              <button
                onClick={() => triggerTestAudioAlert('critical')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-rose-500" />
                <span>{t('test_audio')}</span>
              </button>
            )}

            {/* Export CSV */}
            {isActionVisible('act_export') && (
              <button
                onClick={exportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t('export_csv')}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Prominent Real-time Notification Banner for HSE Department Personnel */}
      {isSectionVisible('sec_hse_notice_banner') && (
        <div className="p-4 sm:p-5 rounded-3xl bg-linear-to-r from-emerald-950/80 via-slate-900 to-blue-950/80 text-white border-2 border-emerald-500/50 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-md shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-[10px] font-black uppercase tracking-wider text-slate-950">
                  إشعار تشغيلي معتمد
                </span>
                <span className="text-xs font-bold text-emerald-300">
                  العاملين بإدارة السلامة والصحة المهنية (HSE Team)
                </span>
              </div>
              <p className="text-xs text-slate-200">
                تم رفع البلاغات الميدانية الواردة بصدر الصفحة للمتابعة والتحقق الفوري من تدابير السيطرة، وتأكيد منح النقاط بعد إغلاق الملفات.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-emerald-900/70 text-emerald-200 border border-emerald-600/50">
              {reports.filter(r => r.status !== 'resolved').length} بلاغات نشطة للمعالجة
            </span>
          </div>
        </div>
      )}

      {/* Featured Banner: مسؤول السلامة الأسرع في تنفيذ المعالجة الفورية المباشرة دون انتظار توجيهات المدير العام */}
      {isSectionVisible('sec_hse_fastest_officer') && (
        <div className="p-4 rounded-2xl bg-linear-to-r from-amber-500/15 via-amber-600/10 to-emerald-500/15 border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-amber-900 dark:text-amber-300">
                  مسؤول السلامة الأسرع في تنفيذ المعالجة الفورية دون انتظار توجيهات المدير العام:
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  م. خالد بن سلطان السويدي (1.8 دقيقة)
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                مفوض بصلاحية التدخل الذاتي الفوري وعزل مصادر الخطر بالموقع دون انتظار أوامر إدارية وفقاً لاشتراطات ومعايير السلامة والصحة المهنية (OSHA / ISO 45001).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <span className="px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 font-black text-[10px] shadow-xs">
              34 معالجة فورية مستقلة
            </span>
          </div>
        </div>
      )}

      {/* KPI Ticker Cards */}
      {isSectionVisible('sec_hse_kpi_cards') && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
              إجمالي البلاغات
            </span>
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              {reports.length}
            </span>
          </div>

          <div className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20 shadow-xs">
            <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 block">
              حرج / مرتفع الخطورة
            </span>
            <span className="text-2xl font-black font-mono text-rose-700 dark:text-rose-400">
              {reports.filter(r => r.aiAssessment.severity === 'critical' || r.aiAssessment.severity === 'high').length}
            </span>
          </div>

          <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20 shadow-xs">
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 block">
              قيد المعالجة
            </span>
            <span className="text-2xl font-black font-mono text-amber-700 dark:text-amber-400">
              {reports.filter(r => r.status === 'investigating' || r.status === 'action_in_progress').length}
            </span>
          </div>

          <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs">
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block">
              تم الحل والإغلاق
            </span>
            <span className="text-2xl font-black font-mono text-emerald-700 dark:text-emerald-400">
              {reports.filter(r => r.status === 'resolved').length}
            </span>
          </div>
        </div>
      )}

      {/* Filters & Search Control */}
      {isSectionVisible('sec_hse_search_filters') && (
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-wrap items-center justify-between gap-3">
          
          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="بحث برقم البلاغ، العنوان، المنطقة، أو المبلغ..."
              className="w-full text-xs py-2 pl-9 pr-3 rtl:pl-3 rtl:pr-9 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          {/* Status segmented filters */}
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            {['all', 'open', 'investigating', 'action_in_progress', 'resolved'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl capitalize whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {st === 'all' ? t('filter_all') : getLocalizedStatus(st as ReportStatus, language)}
              </button>
            ))}
          </div>

          {/* Severity dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value)}
              className="text-xs py-1.5 px-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            >
              <option value="all">جميع مستويات الخطورة</option>
              <option value="critical">حرج جداً</option>
              <option value="high">مرتفع</option>
              <option value="medium">متوسط</option>
              <option value="low">منخفض</option>
            </select>
          </div>

        </div>
      )}

      {/* Reports Feed List */}
      {isSectionVisible('sec_hse_reports_feed') && (
      <div className="space-y-3">
        {filteredReports.length > 0 ? (
          filteredReports.map(rep => {
            const displayTitle = language === 'ar' && rep.titleAr ? rep.titleAr : rep.title;
            const displayDesc = language === 'ar' && rep.descriptionAr ? rep.descriptionAr : rep.description;
            const displayZone = getLocalizedZone(rep.siteZone, language);
            const displayCategory = getLocalizedCategory(rep.category, language);
            const reporterName = language === 'ar' && rep.reporter.nameAr ? rep.reporter.nameAr : rep.reporter.name;

            return (
              <div
                key={rep.id}
                onClick={() => setSelectedReportForModal(rep)}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-black text-slate-800 dark:text-slate-200">
                      {rep.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase ${getSeverityBadgeClass(
                        rep.aiAssessment.severity
                      )}`}
                    >
                      {getLocalizedSeverity(rep.aiAssessment.severity, language)} ({rep.aiAssessment.score}/100)
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {rep.timestamp}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(rep.status)}
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1 group-hover:text-amber-600 transition-colors">
                  {displayTitle}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {displayDesc}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{displayZone}</span>
                    <span>·</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{displayCategory}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{reporterName}</span>
                    </div>

                    {rep.photos.length > 0 && (
                      <span className="text-[11px] font-semibold text-slate-400">
                        📷 {rep.photos.length} صور
                      </span>
                    )}

                    {rep.pointsAwarded ? (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        +{rep.pointsAwarded} نقطة معتمدة
                      </span>
                    ) : rep.pointsPending ? (
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                        ⏳ +{rep.pointsPending} نقطة عند الإغلاق
                      </span>
                    ) : null}

                    {rep.status !== 'resolved' && isActionVisible('act_resolve') && (
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          updateReportStatus(rep.id, 'resolved');
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>إغلاق واعتماد النقاط</span>
                      </button>
                    )}

                    {isActionVisible('act_chat') && (
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          openChatWithReport('worker_hse', rep.id);
                        }}
                        className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>مراسلة العاملين</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        ) : (
          <div className="py-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-slate-400 text-xs">
            لا توجد بلاغات تطابق شروط الفلترة المحددة
          </div>
        )}
      </div>
      )}

    </div>
  );
};
