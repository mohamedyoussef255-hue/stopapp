import React, { useState, useRef, useEffect } from 'react';
import { useSafety } from '../context/SafetyContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  X, 
  Send, 
  MessageSquare, 
  ShieldCheck, 
  Briefcase, 
  HardHat, 
  ExternalLink, 
  AlertTriangle,
  Radio,
  FileText
} from 'lucide-react';
import { getLocalizedRole } from '../utils/localizationHelper';

export const ChatDrawer: React.FC = () => {
  const { 
    isChatDrawerOpen, 
    setChatDrawerOpen, 
    chatMessages, 
    sendChatMessage, 
    activeChatChannel, 
    setActiveChatChannel,
    unreadCounts,
    markChannelRead,
    reports,
    setSelectedReportForModal
  } = useSafety();

  const { currentUser, currentRole } = useAuth();
  const { pantone } = useTheme();
  const { t, language } = useLanguage();

  const [inputText, setInputText] = useState('');
  const [selectedReportId, setSelectedReportId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isChatDrawerOpen) {
      markChannelRead(activeChatChannel);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isChatDrawerOpen, activeChatChannel, chatMessages]);

  if (!isChatDrawerOpen) return null;

  const currentMessages = chatMessages.filter(m => m.channelId === activeChatChannel);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendChatMessage(
      activeChatChannel, 
      inputText.trim(), 
      selectedReportId || undefined
    );
    setInputText('');
  };

  const handleQuickDirective = (quickText: string) => {
    sendChatMessage(activeChatChannel, quickText, selectedReportId || undefined);
  };

  const quickDirectivesList = activeChatChannel === 'worker_hse' ? [
    language === 'ar' ? 'تم عزل الموقع ووضع شريط تحذيري' : 'Area cordoned off with barrier cones',
    language === 'ar' ? 'يرجى التراجع 15 متراً فوراً وعدم لمس المعدة' : 'Step back 15m immediately, do not approach hazard',
    language === 'ar' ? 'فريق الصيانة الكهربائية في طريقه إليكم الآن' : 'Electrical maintenance crew dispatched to your zone'
  ] : [
    language === 'ar' ? 'أمر بوقف خط الإنتاج رقم 3 فوراً' : 'Halt Production Line 3 immediately until LOTO certified',
    language === 'ar' ? 'تم إغلاق المحبس الرئيسي وإخلاء الطابق' : 'Gas main valve closed, zone fully evacuated',
    language === 'ar' ? 'تقرير التقييم البيئي والتصحيح قيد الاعتماد' : 'Environmental corrective audit ready for GM sign-off'
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg h-full bg-white dark:bg-slate-900 border-l rtl:border-l-0 rtl:border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="p-2 rounded-lg text-white font-bold"
              style={{ backgroundColor: pantone.hex }}
            >
              <MessageSquare className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {t('chat_system')}
              </h2>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {language === 'ar' ? 'تواصل فوري مشفر وتوجيهات أمان' : 'Encrypted Field Directives & Coordination'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setChatDrawerOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channel Segmented Switcher */}
        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2">
          
          <button
            onClick={() => {
              setActiveChatChannel('worker_hse');
              markChannelRead('worker_hse');
            }}
            className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeChatChannel === 'worker_hse'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <HardHat className="w-3.5 h-3.5 text-amber-500" />
            <span className="truncate">{language === 'ar' ? 'القناة أ: العامل ⇄ السلامة' : 'Worker ⇄ HSE'}</span>
            {unreadCounts.worker_hse > 0 && activeChatChannel !== 'worker_hse' && (
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveChatChannel('hse_gm');
              markChannelRead('hse_gm');
            }}
            className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeChatChannel === 'hse_gm'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-blue-500" />
            <span className="truncate">{language === 'ar' ? 'القناة ب: السلامة ⇄ المدير العام' : 'HSE ⇄ GM'}</span>
            {unreadCounts.hse_gm > 0 && activeChatChannel !== 'hse_gm' && (
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            )}
          </button>

        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/30 dark:bg-slate-950/20">
          {currentMessages.length > 0 ? (
            currentMessages.map(msg => {
              const isMine = msg.senderId === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {msg.senderName}
                    </span>
                    <span className="uppercase text-[9px] px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800">
                      {getLocalizedRole(msg.senderRole, language)}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed shadow-xs ${
                      isMine
                        ? 'text-white rounded-tr-xs rtl:rounded-tr-2xl rtl:rounded-tl-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-tl-xs rtl:rounded-tl-2xl rtl:rounded-tr-xs'
                    }`}
                    style={isMine ? { backgroundColor: pantone.hex } : undefined}
                  >
                    {/* Linked Report Chip inside message */}
                    {msg.linkedReportId && (
                      <div
                        onClick={() => {
                          const rep = reports.find(r => r.id === msg.linkedReportId);
                          if (rep) setSelectedReportForModal(rep);
                        }}
                        className={`mb-2 p-1.5 rounded-lg flex items-center justify-between gap-2 text-[10px] font-bold cursor-pointer transition-opacity hover:opacity-90 ${
                          isMine
                            ? 'bg-black/20 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          <span>{t('chat_linked_report')}: {msg.linkedReportId}</span>
                        </span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </div>
                    )}

                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              {language === 'ar' ? 'لا توجد رسائل سابقة في هذه القناة' : 'No messages yet in this channel.'}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Safety Directives Chips */}
        <div className="px-4 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/80">
          <span className="text-[10px] font-bold text-slate-400 block mb-1.5">
            {t('quick_directives')}:
          </span>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {quickDirectivesList.map((directive, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleQuickDirective(directive)}
                className="px-2.5 py-1 text-[10px] font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400 whitespace-nowrap shrink-0 transition-colors"
              >
                {directive}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-2">
          {/* Optional Report tagger */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500">
              {language === 'ar' ? 'ربط ببلاغ:' : 'Tag Report:'}
            </span>
            <select
              value={selectedReportId}
              onChange={e => setSelectedReportId(e.target.value)}
              className="text-[11px] py-1 px-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              <option value="">{language === 'ar' ? '-- بدون ربط --' : '-- No Report Tag --'}</option>
              {reports.slice(0, 8).map(r => (
                <option key={r.id} value={r.id}>
                  {r.id}: {r.title.slice(0, 28)}...
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={t('type_message')}
              className="flex-1 text-xs py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': pantone.hex } as React.CSSProperties}
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl text-white font-bold transition-all shadow-sm"
              style={{ backgroundColor: pantone.hex }}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
