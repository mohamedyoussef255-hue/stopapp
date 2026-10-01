import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useSafety } from '../context/SafetyContext';
import { useUIConfig } from '../context/UIConfigContext';
import { StopLogo } from './StopLogo';
import { 
  Sun, 
  Moon, 
  Globe, 
  MessageSquare, 
  Volume2, 
  VolumeX, 
  HardHat, 
  ShieldCheck, 
  Briefcase,
  KeyRound,
  LogOut,
  SlidersHorizontal,
  UserCheck
} from 'lucide-react';
import { getLocalizedRole } from '../utils/localizationHelper';

export const TopNavigation: React.FC = () => {
  const { currentRole, currentUser, logout } = useAuth();
  const { theme, toggleTheme, pantone } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { 
    unreadCounts, 
    setChatDrawerOpen, 
    isAudioMuted, 
    toggleAudioMute,
    isShiftAlarmHours,
    shiftMuteWarning,
    dismissShiftMuteWarning,
    isBackgroundSyncActive
  } = useSafety();
  const { setIsSuperAdminModalOpen } = useUIConfig();

  const totalUnread = unreadCounts.worker_hse + unreadCounts.hse_gm;

  const roleConfig = {
    worker: {
      label: 'بوابة العاملين والميدان',
      badgeAr: 'العامل والميدان',
      badgeEn: 'العامل والميدان',
      icon: <HardHat className="w-4 h-4 text-amber-500" />,
      colorClass: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
    },
    hse: {
      label: 'بوابة مسؤولي HSE الميدانيين',
      badgeAr: 'مسؤول HSE',
      badgeEn: 'مسؤول HSE',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
      colorClass: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
    },
    gm: {
      label: 'البوابة التنفيذية للمدير العام',
      badgeAr: 'المدير العام',
      badgeEn: 'المدير العام',
      icon: <Briefcase className="w-4 h-4 text-indigo-500" />,
      colorClass: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
    },
    admin: {
      label: 'لوحة تحكم مدير النظام الشاملة',
      badgeAr: 'مدير النظام',
      badgeEn: 'مدير النظام',
      icon: <KeyRound className="w-4 h-4 text-rose-500" />,
      colorClass: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
    }
  }[currentRole] || {
    label: 'بوابة المستخدم',
    badgeAr: 'مستخدم',
    badgeEn: 'مستخدم',
    icon: <UserCheck className="w-4 h-4" />,
    colorClass: 'bg-slate-100 text-slate-700'
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand Wordmark with Interactive STOP Traffic Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <StopLogo size="md" interactive={true} />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white">
                STOP
              </span>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
                منصة تتبع وملاحظة السلامة
              </span>
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono tracking-wider hidden md:inline">
              معايير السلامة المهنية ISO 45001 / OSHA
            </span>
          </div>
        </div>

        {/* Zone 2: Isolated Current User Role Badge & Credential Display */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${roleConfig.colorClass}`}>
            {roleConfig.icon}
            <div className="flex items-center gap-2">
              <span className="font-bold">
                {roleConfig.badgeAr}
              </span>
              <span className="text-slate-400 dark:text-slate-500">|</span>
              <span className="font-mono text-[11px] font-bold text-slate-900 dark:text-white">
                {currentUser.employeeId}
              </span>
              <span className="text-slate-600 dark:text-slate-300 hidden md:inline">
                ({currentUser.nameAr || currentUser.name})
              </span>
            </div>
          </div>
        </div>

        {/* Zone 3: Quick Action Shortcuts & Official Logout Button */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          
          {/* Shift Alarm Status & Sound Alert Toggle */}
          <div className="relative flex items-center">
            {isShiftAlarmHours && (
              <span className="hidden xl:flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-300/60 dark:border-emerald-800 me-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>وردية العمل (8:00 ص - 4:00 م) | الإنذار الصوتي إلزامي</span>
              </span>
            )}
            <button
              onClick={toggleAudioMute}
              title={
                isShiftAlarmHours
                  ? 'الإنذار إلزامي خلال وردية العمل (8:00 ص - 4:00 م) ولا يمكن كتمه'
                  : (isAudioMuted ? t('sound_unmute') : t('sound_mute'))
              }
              className={`p-2 rounded-lg border transition-colors cursor-pointer relative ${
                isShiftAlarmHours
                  ? 'border-emerald-400 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 shadow-xs'
                  : isAudioMuted
                  ? 'border-slate-300 dark:border-slate-700 text-slate-400'
                  : 'border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
              }`}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              {isShiftAlarmHours && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              )}
            </button>
          </div>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? t('light_mode') : t('dark_mode')}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Internal Chat Drawer Button with Unread Badge */}
          <button
            onClick={() => setChatDrawerOpen(true)}
            title={t('chat_system')}
            className="relative p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            {totalUnread > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm animate-pulse">
                {totalUnread}
              </span>
            )}
          </button>

          {/* Super Admin Quick Settings Shortcut (Only visible to Admin or GM) */}
          {(currentRole === 'gm' || currentRole === 'admin') && (
            <button
              onClick={() => setIsSuperAdminModalOpen(true)}
              title="لوحة تحكم إعدادات المنظومة والمكافآت"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
            </button>
          )}

          {/* Explicit Logout Button per User Request */}
          <button
            onClick={logout}
            title="تسجيل الخروج وقفل الجلسة"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5 rtl:rotate-180" />
            <span className="hidden sm:inline">خروج</span>
          </button>

        </div>

      </div>

      {/* Mandatory Shift Alarm Warning Banner if user tries to mute */}
      {shiftMuteWarning && (
        <div className="bg-amber-500 text-slate-950 font-bold px-4 py-2.5 text-xs flex items-center justify-between gap-3 shadow-md animate-in slide-in-from-top duration-200">
          <div className="max-w-7xl mx-auto flex items-center gap-2 flex-1">
            <span className="text-base">📢</span>
            <span className="text-[12px]">{shiftMuteWarning}</span>
          </div>
          <button
            onClick={dismissShiftMuteWarning}
            className="px-2.5 py-1 bg-slate-950 text-white rounded-lg text-[11px] font-bold hover:bg-slate-900 transition-colors cursor-pointer"
          >
            فهمت ذلك
          </button>
        </div>
      )}
    </header>
  );
};
