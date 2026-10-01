import React from 'react';
import { useSafety } from '../context/SafetyContext';
import { useLanguage } from '../context/LanguageContext';
import { AlertOctagon, X, ArrowRight } from 'lucide-react';

export const AlertNotificationBanner: React.FC = () => {
  const { activeAlertBanner, dismissAlertBanner, setSelectedReportForModal, reports } = useSafety();
  const { t, language } = useLanguage();

  if (!activeAlertBanner) return null;

  const handleReview = () => {
    const report = reports.find(r => r.id === activeAlertBanner.reportId);
    if (report) {
      setSelectedReportForModal(report);
    }
    dismissAlertBanner();
  };

  const isCritical = activeAlertBanner.severity === 'critical';

  return (
    <div className={`fixed top-18 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 p-4 rounded-2xl shadow-2xl border text-white animate-in slide-in-from-top-4 duration-300 ${
      isCritical
        ? 'bg-rose-900/95 border-rose-600 shadow-rose-950/50'
        : 'bg-amber-900/95 border-amber-600 shadow-amber-950/50'
    } backdrop-blur-md`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-white/10 shrink-0 animate-bounce">
            <AlertOctagon className="w-5 h-5 text-white" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded bg-black/30">
                {activeAlertBanner.severity}
              </span>
              <span className="text-[11px] text-white/80 font-mono">
                {activeAlertBanner.reportId}
              </span>
            </div>
            <h4 className="text-xs font-bold text-white mt-1 line-clamp-1">
              {activeAlertBanner.title}
            </h4>
          </div>
        </div>

        <button
          onClick={dismissAlertBanner}
          className="text-white/60 hover:text-white p-1 rounded-md"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between text-xs">
        <span className="text-[10px] text-white/70">
          📍 {activeAlertBanner.siteZone}
        </span>
        <button
          onClick={handleReview}
          className="flex items-center gap-1 font-bold text-white hover:underline cursor-pointer"
        >
          <span>{language === 'ar' ? 'معاينة البلاغ' : 'Review Incident'}</span>
          <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
};
