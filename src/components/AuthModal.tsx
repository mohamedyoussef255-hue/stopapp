import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { UserRole } from '../types';
import { 
  HardHat, 
  ShieldCheck, 
  Briefcase, 
  KeyRound, 
  X, 
  Key, 
  User, 
  Phone, 
  BadgeCheck, 
  AlertCircle,
  CheckCircle2,
  Lock,
  Sparkles
} from 'lucide-react';
import { DEMO_USERS } from '../utils/mockData';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    isAuthenticated,
    loginWithCredentials,
    targetRoleForModal,
    setTargetRoleForModal
  } = useAuth();

  const { pantone } = useTheme();
  const { language, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<UserRole>(targetRoleForModal || 'worker');

  // Input states
  const [username, setUsername] = useState(DEMO_USERS.worker.name);
  const [employeeId, setEmployeeId] = useState(DEMO_USERS.worker.employeeId);
  const [password, setPassword] = useState('worker123');
  const [phone, setPhone] = useState(DEMO_USERS.worker.phone || '+966 50 123 4567');
  const [jobTitle, setJobTitle] = useState(DEMO_USERS.worker.jobTitle || 'Field Maintenance Specialist');
  const [authError, setAuthError] = useState('');

  // Sync inputs when tab changes
  useEffect(() => {
    const demo = DEMO_USERS[activeTab];
    if (demo) {
      setUsername(demo.name);
      setEmployeeId(demo.employeeId);
      setPhone(demo.phone || '+966 50 123 4567');
      setJobTitle(demo.jobTitle || '');
      if (activeTab === 'worker') setPassword('worker123');
      else if (activeTab === 'hse') setPassword('hse123');
      else if (activeTab === 'gm') setPassword('gm123');
      else if (activeTab === 'admin') setPassword('admin123');
      setAuthError('');
    }
  }, [activeTab]);

  useEffect(() => {
    if (targetRoleForModal) {
      setActiveTab(targetRoleForModal);
    }
  }, [targetRoleForModal]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const res = loginWithCredentials(
      activeTab,
      username,
      employeeId,
      password,
      { phone, jobTitle }
    );

    if (!res.success) {
      setAuthError(res.error || (language === 'ar' ? 'بيانات الدخول غير صحيحة' : 'Invalid credentials'));
    }
  };

  const handleQuickPreset = (role: UserRole) => {
    setActiveTab(role);
    setTargetRoleForModal(role);
  };

  const tabs: { role: UserRole; labelAr: string; labelEn: string; icon: React.ReactNode }[] = [
    {
      role: 'worker',
      labelAr: 'العاملين',
      labelEn: 'العاملين',
      icon: <HardHat className="w-4 h-4" />
    },
    {
      role: 'hse',
      labelAr: 'مسؤول السلامة والصحة المهنية',
      labelEn: 'مسؤول السلامة والصحة المهنية',
      icon: <ShieldCheck className="w-4 h-4" />
    },
    {
      role: 'gm',
      labelAr: 'المدير العام',
      labelEn: 'المدير العام',
      icon: <Briefcase className="w-4 h-4" />
    },
    {
      role: 'admin',
      labelAr: 'مدير النظام',
      labelEn: 'مدير النظام',
      icon: <KeyRound className="w-4 h-4" />
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md"
              style={{ backgroundColor: pantone.hex }}
            >
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                تسجيل الدخول وعزل الصلاحيات الأمنية
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                يتطلب الدخول اسم المستخدم ورقم الأداء الوظيفي وكلمة المرور المعتمدة
              </p>
            </div>
          </div>

          {isAuthenticated && (
            <button
              onClick={closeAuthModal}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Tab Role Switcher */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 grid grid-cols-4 gap-1.5">
          {tabs.map(tab => {
            const isActive = activeTab === tab.role;
            return (
              <button
                key={tab.role}
                type="button"
                onClick={() => handleQuickPreset(tab.role)}
                className={`py-2 px-1.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  isActive
                    ? 'text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/60'
                }`}
                style={isActive ? { backgroundColor: pantone.hex } : undefined}
              >
                {tab.icon}
                <span className="text-[11px] truncate">
                  {tab.labelAr}
                </span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Preset hint notification */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                الحساب الافتراضي لدور ({activeTab === 'worker' ? 'العاملين' : activeTab === 'hse' ? 'مسؤول السلامة والصحة المهنية' : activeTab === 'gm' ? 'المدير العام' : 'مدير النظام'}): كلمة المرور جاهزة
              </span>
            </div>
            <span className="font-mono text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded-md font-bold">
              {password}
            </span>
          </div>

          {/* Error notice */}
          {authError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 font-semibold animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Field 1: Username */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              اسم المستخدم المعتمد
            </label>
            <div className="relative">
              <User className="absolute left-3 rtl:left-auto rtl:right-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="أدخل اسم الموظف"
                className="w-full text-xs py-2.5 pl-9 pr-3 rtl:pl-3 rtl:pr-9 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Field 2: Employee Performance ID */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              رقم الأداء الوظيفي (كود الموظف)
            </label>
            <div className="relative">
              <BadgeCheck className="absolute left-3 rtl:left-auto rtl:right-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={employeeId}
                onChange={e => setEmployeeId(e.target.value.toUpperCase())}
                placeholder="مثال: EMP-8821"
                className="w-full text-xs font-mono font-bold uppercase py-2.5 pl-9 pr-3 rtl:pl-3 rtl:pr-9 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Field 3: Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              كلمة المرور السرية
            </label>
            <div className="relative">
              <Key className="absolute left-3 rtl:left-auto rtl:right-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs py-2.5 pl-9 pr-3 rtl:pl-3 rtl:pr-9 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
              <span>
                كلمات المرور الافتراضية للتجربة:
              </span>
              <span className="font-mono text-slate-500">
                {activeTab === 'worker' ? 'worker123 / 1234' : activeTab === 'hse' ? 'hse123 / 4105' : activeTab === 'gm' ? 'gm123 / 0000' : 'admin123 / 0000'}
              </span>
            </div>
          </div>

          {/* Optional extra metadata (Phone for worker, Job title for HSE/Admin) */}
          {activeTab === 'worker' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                رقم هاتف الاتصال الميداني
              </label>
              <div className="relative">
                <Phone className="absolute left-3 rtl:left-auto rtl:right-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full text-xs py-2 pl-9 pr-3 rtl:pl-3 rtl:pr-9 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-2xl font-black text-xs text-white shadow-xl transition-all hover:opacity-95 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer mt-2"
            style={{ backgroundColor: pantone.hex }}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              التحقق والدخول إلى ({activeTab === 'worker' ? 'بوابة العاملين' : activeTab === 'hse' ? 'بوابة مسؤول السلامة والصحة المهنية' : activeTab === 'gm' ? 'بوابة المدير العام' : 'لوحة مدير النظام'})
            </span>
          </button>
        </form>

      </div>
    </div>
  );
};
