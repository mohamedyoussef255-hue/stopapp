/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { UIConfigProvider } from './context/UIConfigContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SafetyProvider } from './context/SafetyContext';
import { TopNavigation } from './components/TopNavigation';
import { WorkerPortal } from './components/WorkerPortal';
import { HSEPortal } from './components/HSEPortal';
import { GMPortal } from './components/GMPortal';
import { AdminManagementPortal } from './components/AdminManagementPortal';
import { AuthModal } from './components/AuthModal';
import { SuperAdminModal } from './components/SuperAdminModal';
import { ReportDetailModal } from './components/ReportDetailModal';
import { ChatDrawer } from './components/ChatDrawer';
import { AlertNotificationBanner } from './components/AlertNotificationBanner';
import { StopLogo } from './components/StopLogo';

const MainAppLayout: React.FC = () => {
  const { currentRole } = useAuth();
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-100/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased transition-colors">
      {/* Top Bar Contract Navigation */}
      <TopNavigation />

      {/* Real-time Push Alert Banner */}
      <AlertNotificationBanner />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentRole === 'worker' && <WorkerPortal />}
        {currentRole === 'hse' && <HSEPortal />}
        {currentRole === 'gm' && <GMPortal />}
        {currentRole === 'admin' && <AdminManagementPortal />}
      </main>

      {/* Quiet Clean Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <StopLogo size="sm" interactive={false} />
            <span className="font-bold text-slate-700 dark:text-slate-300">
              STOP (Safety Tracking & Observation Platform)
            </span>
            <span>·</span>
            <span>{language === 'ar' ? 'منصة تتبع وملاحظة السلامة' : 'Proactive Hazard Mitigation'}</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span>OSHA 1910 / 1926</span>
            <span>·</span>
            <span>ISO 45001:2018</span>
            <span>·</span>
            <span>WCAG 2.1 AA</span>
          </div>
        </div>
      </footer>

      {/* Global Modals & Drawers */}
      <AuthModal />
      <SuperAdminModal />
      <ReportDetailModal />
      <ChatDrawer />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <UIConfigProvider>
          <AuthProvider>
            <SafetyProvider>
              <MainAppLayout />
            </SafetyProvider>
          </AuthProvider>
        </UIConfigProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
