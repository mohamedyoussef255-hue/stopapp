import React, { useState } from 'react';
import { useSafety } from '../context/SafetyContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ReportStatus, Severity } from '../types';
import {
  X,
  MapPin,
  Calendar,
  User,
  ShieldAlert,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  Send,
  Building,
  Check,
  Compass,
} from 'lucide-react';
import {
  getLocalizedCategory,
  getLocalizedZone,
  getLocalizedSeverity,
  getLocalizedStatus,
  getLocalizedReportTitle,
  getLocalizedReportDesc,
  getLocalizedHazardType,
  getLocalizedRecommendedAction,
  getLocalizedConsequences,
} from '../utils/localizationHelper';

export const ReportDetailModal: React.FC = () => {
  const { pantone } = useTheme();
  const { t, language } = useLanguage();
  const { currentUser } = useAuth();
  const { 
    selectedReportForModal: report, 
    setSelectedReportForModal,
    updateReportStatus, 
    addGMDirective, 
    addCorrectiveAction, 
    openChatWithReport 
  } = useSafety();

  const [directiveText, setDirectiveText] = useState('');
  const [actionText, setActionText] = useState('');
  const [statusUpdatedSuccess, setStatusUpdatedSuccess] = useState(false);

  if (!report) return null;

  const handleClose = () => {
    setSelectedReportForModal(null);
  };

  const localizedTitle = getLocalizedReportTitle(report, language);
  const localizedDesc = getLocalizedReportDesc(report, language);
  const localizedCat = getLocalizedCategory(report.category, language);
  const localizedZone = getLocalizedZone(report.siteZone, language);
  const localizedStatus = getLocalizedStatus(report.status, language);
  const localizedSeverity = getLocalizedSeverity(report.aiAssessment.severity, language);

  const handleStatusChange = (status: ReportStatus) => {
    updateReportStatus(report.id, status);
    setStatusUpdatedSuccess(true);
    setTimeout(() => setStatusUpdatedSuccess(false), 2500);
  };

  const handleDirectiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directiveText.trim()) return;
    addGMDirective(report.id, directiveText.trim());
    setDirectiveText('');
  };

  const handleActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionText.trim()) return;
    addCorrectiveAction(report.id, actionText.trim());
    setActionText('');
  };

  const severityColor: Record<Severity, string> = {
    low: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300',
    medium: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-950/70 dark:text-orange-300 border-orange-300',
    critical: 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-300 animate-pulse',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 font-mono font-bold text-xs bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md">
              {report.id}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${severityColor[report.aiAssessment.severity]}`}>
              {localizedSeverity}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {localizedStatus}
            </span>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Title & Metadata */}
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
              {localizedTitle}
            </h2>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(report.timestamp).toLocaleString('ar-SA')}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Building className="w-3.5 h-3.5" />
                {localizedZone}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                {report.reporter.name} ({report.reporter.employeeId})
              </span>
              <span className="flex items-center gap-1.5 font-bold" style={{ color: pantone.hex }}>
                {localizedCat}
              </span>
            </div>
          </div>

          {/* Media & GPS Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.photos && report.photos.length > 0 ? (
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-72 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <img
                  src={report.photos[0]}
                  alt={report.title}
                  className="w-full h-full object-cover max-h-72 hover:scale-105 transition-transform duration-300"
                />
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center text-slate-400 flex flex-col items-center justify-center min-h-[160px]">
                <ShieldAlert className="w-10 h-10 mb-2 opacity-50" />
                <span className="text-xs">{t('no_image_attached')}</span>
              </div>
            )}

            {/* GPS Location Card */}
            <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  {t('gps_coordinates')}
                </div>
                <div className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {report.location.lat.toFixed(6)}, {report.location.lng.toFixed(6)}
                </div>
                {report.location.address && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {language === 'ar' && report.location.addressAr ? report.location.addressAr : report.location.address}
                  </p>
                )}
                {report.location.accuracy && (
                  <p className="text-[11px] text-slate-400 mt-1">
                    {t('accuracy')}: ±{Math.round(report.location.accuracy)} {t('meters')}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                <a
                  href={`https://www.google.com/maps?q=${report.location.lat},${report.location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                  style={{ color: pantone.hex }}
                >
                  <Compass className="w-3.5 h-3.5" />
                  {t('view_on_map')}
                  <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                </a>

                <button
                  onClick={() => openChatWithReport('worker_hse', report.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-xs hover:bg-slate-50 flex items-center gap-1.5 text-slate-700 dark:text-slate-200"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                  {t('chat_about_report')}
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              {t('field_description')}
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
              {localizedDesc}
            </p>
          </div>

          {/* AI Risk Assessment Card */}
          {report.aiAssessment && (
            <div className="rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm text-indigo-950 dark:text-indigo-300">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  {t('ai_safety_analysis')}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-indigo-800 dark:text-indigo-400">
                    {t('risk_score')}: {report.aiAssessment.score}/100
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    ({Math.round(report.aiAssessment.confidenceScore * 100)}% {t('confidence')})
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-white dark:bg-slate-900/70 p-3 rounded-lg border border-indigo-100 dark:border-indigo-900/40">
                  <span className="font-semibold text-slate-500 block mb-1">{t('hazard_identified')}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {getLocalizedHazardType(report.aiAssessment, language)}
                  </span>
                </div>
                <div className="bg-white dark:bg-slate-900/70 p-3 rounded-lg border border-indigo-100 dark:border-indigo-900/40">
                  <span className="font-semibold text-slate-500 block mb-1">{t('potential_consequences')}</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {getLocalizedConsequences(report.aiAssessment, language)}
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900/70 p-3 rounded-lg border border-indigo-100 dark:border-indigo-900/40 text-xs">
                <span className="font-semibold text-slate-500 block mb-1">{t('recommended_corrective_action')}</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">
                  {getLocalizedRecommendedAction(report.aiAssessment, language)}
                </span>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                  <span className="bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 px-2 py-0.5 rounded font-mono">
                    {language === 'ar' && report.aiAssessment.standardRefAr ? report.aiAssessment.standardRefAr : report.aiAssessment.standardRef}
                  </span>
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-medium">
                    {t('control')}: {language === 'ar' && report.aiAssessment.hierarchyOfControlAr ? report.aiAssessment.hierarchyOfControlAr : report.aiAssessment.hierarchyOfControl}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* GM Directives Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              {t('gm_directives')} ({report.gmDirectives?.length || 0})
            </h4>

            {report.gmDirectives && report.gmDirectives.length > 0 ? (
              <div className="space-y-2">
                {report.gmDirectives.map((dir) => (
                  <div
                    key={dir.id}
                    className="p-3 bg-amber-50/70 dark:bg-amber-950/20 border-l-4 rtl:border-l-0 rtl:border-r-4 border-amber-500 rounded-r-lg rtl:rounded-r-none rtl:rounded-l-lg text-xs"
                  >
                    <div className="flex items-center justify-between font-bold text-amber-900 dark:text-amber-300 mb-1">
                      <span>{dir.authorAr || dir.author}</span>
                      <span className="font-normal text-[10px] text-slate-400">
                        {new Date(dir.timestamp).toLocaleTimeString('ar-SA')}
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">
                      {dir.directiveAr || dir.directive}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">لا توجد توجيهات إدارية مسجلة حتى الآن</p>
            )}

            {/* Directive Input for GM */}
            {currentUser?.role === 'gm' && (
              <form onSubmit={handleDirectiveSubmit} className="flex gap-2 mt-3">
                <input
                  type="text"
                  value={directiveText}
                  onChange={(e) => setDirectiveText(e.target.value)}
                  placeholder="اكتب التوجيه الإداري الإلزامي هنا..."
                  className="flex-1 text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition"
                >
                  <Send className="w-3 h-3" />
                  <span>إرسال التوجيه</span>
                </button>
              </form>
            )}
          </div>

          {/* Corrective Actions Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>الإجراءات التصحيحية المتخذة ({report.correctiveActions?.length || 0})</span>
            </h4>

            {report.correctiveActions && report.correctiveActions.length > 0 ? (
              <div className="space-y-2">
                {report.correctiveActions.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 bg-emerald-50/70 dark:bg-emerald-950/20 border-l-4 rtl:border-l-0 rtl:border-r-4 border-emerald-500 rounded-r-lg rtl:rounded-r-none rtl:rounded-l-lg text-xs"
                  >
                    <div className="flex items-center justify-between font-bold text-emerald-900 dark:text-emerald-300 mb-1">
                      <span>{act.authorAr || act.author}</span>
                      <span className="font-normal text-[10px] text-slate-400">
                        {new Date(act.timestamp).toLocaleTimeString('ar-SA')}
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">
                      {act.noteAr || act.note}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">{t('no_actions_logged')}</p>
            )}

            {/* Action Input for HSE or GM */}
            {(currentUser?.role === 'hse' || currentUser?.role === 'gm') && (
              <form onSubmit={handleActionSubmit} className="flex gap-2 mt-3">
                <input
                  type="text"
                  value={actionText}
                  onChange={(e) => setActionText(e.target.value)}
                  placeholder={t('log_mitigation_action')}
                  className="flex-1 text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition"
                >
                  <Check className="w-3 h-3" />
                  {t('log_action')}
                </button>
              </form>
            )}
          </div>

          {/* Reward Points Closure Status Notice */}
          <div className="p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  حالة نقاط السلامة والحوافز للعامل:
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {report.pointsAwarded ? (
                    `✅ تم صرف وإيداع +${report.pointsAwarded} نقطة سلامة لحساب العامل (${report.reporter.nameAr || report.reporter.name}) بعد التأكد من اتخاذ الإجراءات التصحيحية وإغلاق الملف.`
                  ) : (
                    `⏳ رصيد معلق: +${report.pointsPending || 100} نقطة سلامة (تُودع تلقائياً عند تغيير الحالة إلى "تمت المعالجة والإغلاق" والتحقق من المعالجة).`
                  )}
                </span>
              </div>
            </div>
            {report.pointsAwarded ? (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono font-black text-xs shrink-0">
                +{report.pointsAwarded} نقطة معتمدة
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-mono font-bold text-xs shrink-0">
                +{report.pointsPending || 100} نقطة معلقة
              </span>
            )}
          </div>
        </div>

        {/* Footer / Controls */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('update_status')}:</span>
            <div className="flex flex-wrap gap-1">
              {(['open', 'investigating', 'action_in_progress', 'resolved'] as ReportStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition ${
                    report.status === status
                      ? 'text-white border-transparent'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:bg-slate-100'
                  }`}
                  style={report.status === status ? { backgroundColor: pantone.hex } : {}}
                >
                  {getLocalizedStatus(status, language)}
                </button>
              ))}
            </div>
            {statusUpdatedSuccess && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 animate-fade-in">
                <Check className="w-3.5 h-3.5" />
                {t('status_updated')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openChatWithReport('worker_hse', report.id)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm flex items-center gap-1.5"
              style={{ backgroundColor: pantone.hex }}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              {t('open_chat_channel')}
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition"
            >
              {t('close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
