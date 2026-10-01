import React, { useState } from 'react';
import { useSafety } from '../context/SafetyContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { DEPARTMENT_GMS } from '../utils/plantMapData';
import { SafetyReport } from '../types';
import { 
  Briefcase, 
  Send, 
  AlertOctagon, 
  Clock, 
  UserCheck, 
  Building2, 
  X, 
  CheckCircle2, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface GMDirectiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetReport?: SafetyReport | null;
}

export const GMDirectiveModal: React.FC<GMDirectiveModalProps> = ({
  isOpen,
  onClose,
  targetReport
}) => {
  const { language } = useLanguage();
  const { pantone } = useTheme();
  const { addGMExecutiveDirective, reports } = useSafety();

  const [selectedDeptId, setSelectedDeptId] = useState(DEPARTMENT_GMS[1].id); // Default to Maintenance
  const [assigneeName, setAssigneeName] = useState('م. بدر الشريف / مشرف صيانة الخطوط الكهربائية');
  const [directiveText, setDirectiveText] = useState(
    targetReport ? `توجيه فوري بشأن البلاغ [${targetReport.id}]: إيقاف خط التشغيل المباشر وعزل مصدر الخطر واتخاذ التدابير الوقائية الميدانية فوراً.` : ''
  );
  const [deadline, setDeadline] = useState('فوري خلال ساعتين (اليوم)');
  const [priority, setPriority] = useState<'critical' | 'mandatory' | 'high'>('critical');
  const [selectedReportId, setSelectedReportId] = useState(targetReport?.id || reports[0]?.id || '');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const currentDept = DEPARTMENT_GMS.find(d => d.id === selectedDeptId) || DEPARTMENT_GMS[0];

  const handleDeptChange = (deptId: string) => {
    setSelectedDeptId(deptId);
    const dept = DEPARTMENT_GMS.find(d => d.id === deptId);
    if (dept) {
      if (dept.roleKey === 'hse_director') {
        setAssigneeName('د. طارق الحسيني (مدير عام السلامة والصحة المهنية) / مسؤول السلامة والصحة المهنية الميداني المناوب');
      } else if (dept.roleKey === 'workers') {
        setAssigneeName('قائد فريق العاملين ومجموعة الصيانة الميدانية');
      } else if (dept.id === 'dept_maintenance') {
        setAssigneeName('م. بدر الشريف (مدير عام الصيانة) / طاقم العاملين بالإصلاح الميكانيكي والكهربائي');
      } else if (dept.id === 'dept_operations') {
        setAssigneeName('م. نواف الخطيب (مدير عام العمليات) / مشرف غرفة التحكم المركزية');
      } else {
        setAssigneeName('أ. زياد الفرحان (مدير عام سلاسل الإمداد) / مشرف المستودعات');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directiveText.trim()) return;

    addGMExecutiveDirective({
      reportId: selectedReportId,
      targetType: currentDept.roleKey as any,
      targetDepartment: currentDept.title,
      targetDepartmentAr: currentDept.titleAr,
      assigneeName: assigneeName.trim() || currentDept.nameAr,
      directive: directiveText.trim(),
      directiveAr: directiveText.trim(),
      deadline,
      deadlineAr: deadline,
      priority
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md"
              style={{ backgroundColor: pantone.hex }}
            >
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                إصدار أمر وتوجيه تصحيحي إلزامي من المدير العام
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                مخاطبة مدير عام السلامة، مديري الإدارات الأخرى، أو العاملين لتنفيذ التدابير التصحيحية
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center border-4 border-emerald-500 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              تم تعميم وإرسال التوجيه الإلزامي بنجاح!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              تم إشعار مدير الإدارة وتكليف أحد العاملين المختصين بالمهمة فوراً
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* 1. Target Department / Role Selector */}
            <div>
              <label className="block text-xs font-black text-slate-800 dark:text-slate-200 mb-1.5">
                الجهة الموجه إليها الأمر التنفيذي (مخاطبة المدير المختص):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DEPARTMENT_GMS.map(dept => {
                  const isSelected = selectedDeptId === dept.id;
                  return (
                    <div
                      key={dept.id}
                      onClick={() => handleDeptChange(dept.id)}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold leading-tight">
                          {dept.titleAr || dept.title}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        {dept.nameAr || dept.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Assignee & Linked Report Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  المكلف بالتنفيذ من الإدارة:
                </label>
                <div className="relative">
                  <UserCheck className="absolute left-3 rtl:left-auto rtl:right-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={assigneeName}
                    onChange={e => setAssigneeName(e.target.value)}
                    className="w-full text-xs py-2 pl-9 pr-3 rtl:pl-3 rtl:pr-9 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ربط بالبلاغ المرصود:
                </label>
                <select
                  value={selectedReportId}
                  onChange={e => setSelectedReportId(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">-- توجيه عام للمنشأة --</option>
                  {reports.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.id}: {(r.titleAr || r.title).slice(0, 35)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Mandatory Corrective Action Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                نص الإجراء التصحيحي الملزم والتوجيهات الميدانية:
              </label>
              <textarea
                rows={3}
                required
                value={directiveText}
                onChange={e => setDirectiveText(e.target.value)}
                placeholder="حدد بدقة الإجراء الواجب تنفيذه، آليات العزل والإصلاح، وشروط استئناف العمل..."
                className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* 4. Deadline and Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  المهلة الزمنية للتنفيذ والإغلاق:
                </label>
                <select
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="فوري خلال ساعتين (اليوم)">فوري خلال ساعتين (طوارئ)</option>
                  <option value="مهلة 4 ساعات">مهلة 4 ساعات قبل نهاية الوردية</option>
                  <option value="خلال 24 ساعة">خلال 24 ساعة عمل</option>
                  <option value="مهلة 48 ساعة">خلال 48 ساعة مع تقرير مرحلي</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  درجة الإلزام والأولوية:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['critical', 'mandatory', 'high'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        priority === p
                          ? p === 'critical'
                            ? 'bg-rose-600 text-white'
                            : p === 'mandatory'
                            ? 'bg-amber-600 text-white'
                            : 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {p === 'critical' ? 'حرج فوري' : p === 'mandatory' ? 'إلزامي' : 'أولوية عليا'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl font-black text-xs text-white shadow-xl hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                style={{ backgroundColor: pantone.hex }}
              >
                <Send className="w-4 h-4 rtl:rotate-180" />
                <span>
                  إصدار وتعميم الأمر الإلزامي إلى ({currentDept.titleAr.split(' ')[2] || currentDept.titleAr})
                </span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
