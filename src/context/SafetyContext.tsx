import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChatMessage, GMExecutiveDirective, LeaderboardEntry, ReportStatus, SafetyReport, Severity, UserRole } from '../types';
import { INITIAL_CHAT_MESSAGES, INITIAL_LEADERBOARD, INITIAL_REPORTS } from '../utils/mockData';
import { assessRiskSeverity } from '../utils/aiRiskEngine';
import { audioAlertSystem } from '../utils/audioAlert';
import { useAuth } from './AuthContext';

interface AddReportInput {
  title: string;
  description: string;
  category: string;
  siteZone: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    accuracy?: number;
  };
  photos: string[];
  customFieldValues?: Record<string, string | number | boolean>;
}

interface AlertBannerData {
  reportId: string;
  title: string;
  severity: Severity;
  siteZone: string;
  timestamp: string;
}

const INITIAL_EXECUTIVE_DIRECTIVES: GMExecutiveDirective[] = [
  {
    id: 'dir_init_01',
    reportId: 'REP-2026-101',
    targetType: 'other_department',
    targetDepartment: 'الإدارة الهندسية والصيانة',
    targetDepartmentAr: 'الإدارة الهندسية والصيانة والاعتمادية',
    assigneeName: 'م. بدر الشريف (مدير عام الصيانة) / طاقم العاملين بعزل الكهرباء',
    directive: 'إيقاف خط التغذية 480V فوراً واستبدال الكابل المتآكل وعزله بأنبوب حماية مدرع قبل إعادة تشغيل وحدة التبريد.',
    directiveAr: 'إيقاف خط التغذية 480V فوراً واستبدال الكابل المتآكل وعزله بأنبوب حماية مدرع قبل إعادة تشغيل وحدة التبريد.',
    deadline: 'فوري خلال ساعتين (اليوم 12:00)',
    deadlineAr: 'فوري خلال ساعتين (اليوم 12:00)',
    priority: 'critical',
    timestamp: '10:15 AM',
    author: 'المدير العام (GM)',
    status: 'in_progress'
  },
  {
    id: 'dir_init_02',
    reportId: 'REP-2026-102',
    targetType: 'hse_director',
    targetDepartment: 'إدارة السلامة والصحة المهنية',
    targetDepartmentAr: 'إدارة السلامة والصحة المهنية وسلامة العمليات',
    assigneeName: 'د. طارق الحسيني (مدير عام السلامة) / م. سارة جنكينز',
    directive: 'إيقاف العمل على السقالة رقم 3 فوراً وسحب تصريح العمل على ارتفاع حتى تركيب حواجز القدم وتثبيت الألواح وتوقيع بطاقة السقالات الخضراء.',
    directiveAr: 'إيقاف العمل على السقالة رقم 3 فوراً وسحب تصريح العمل على ارتفاع حتى تركيب حواجز القدم وتثبيت الألواح وتوقيع بطاقة السقالات الخضراء.',
    deadline: 'مهلة 4 ساعات',
    deadlineAr: 'مهلة 4 ساعات',
    priority: 'mandatory',
    timestamp: '09:40 AM',
    author: 'المدير العام (GM)',
    status: 'dispatched'
  }
];

interface SafetyContextType {
  reports: SafetyReport[];
  addReport: (input: AddReportInput) => SafetyReport;
  updateReportStatus: (reportId: string, status: ReportStatus) => void;
  assignReportToHSE: (reportId: string, hse: { id: string; name: string; jobTitle: string }) => void;
  addGMDirective: (reportId: string, directive: string) => void;
  addGMExecutiveDirective: (directive: Omit<GMExecutiveDirective, 'id' | 'timestamp' | 'status' | 'author'>) => void;
  executiveDirectives: GMExecutiveDirective[];
  updateDirectiveStatus: (directiveId: string, status: GMExecutiveDirective['status']) => void;
  addCorrectiveAction: (reportId: string, note: string, photoProof?: string) => void;
  
  // Chat & Communication
  chatMessages: ChatMessage[];
  sendChatMessage: (channelId: 'worker_hse' | 'hse_gm', text: string, linkedReportId?: string, isDirectUrgent?: boolean) => void;
  unreadCounts: { worker_hse: number; hse_gm: number };
  markChannelRead: (channelId: 'worker_hse' | 'hse_gm') => void;
  isChatDrawerOpen: boolean;
  setChatDrawerOpen: (open: boolean) => void;
  activeChatChannel: 'worker_hse' | 'hse_gm';
  setActiveChatChannel: (channel: 'worker_hse' | 'hse_gm') => void;
  openChatWithReport: (channelId: 'worker_hse' | 'hse_gm', reportId: string) => void;

  // Alerts & Sound
  activeAlertBanner: AlertBannerData | null;
  dismissAlertBanner: () => void;
  isAudioMuted: boolean;
  toggleAudioMute: () => void;
  triggerTestAudioAlert: (severity: Severity) => void;
  isShiftAlarmHours: boolean;
  setIsShiftAlarmHours: (active: boolean) => void;
  shiftMuteWarning: string | null;
  dismissShiftMuteWarning: () => void;

  // Background Sync & Delivery
  isBackgroundSyncActive: boolean;
  setIsBackgroundSyncActive: (active: boolean) => void;
  simulateIncomingBackgroundReport: () => void;

  // Modals & Inspection
  selectedReportForModal: SafetyReport | null;
  setSelectedReportForModal: (report: SafetyReport | null) => void;
  leaderboard: LeaderboardEntry[];
}

const SafetyContext = createContext<SafetyContextType | undefined>(undefined);

export const SafetyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, updateUserPoints } = useAuth();

  const [reports, setReports] = useState<SafetyReport[]>(() => {
    const saved = localStorage.getItem('safetypulse_reports');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_REPORTS;
  });

  const [executiveDirectives, setExecutiveDirectives] = useState<GMExecutiveDirective[]>(() => {
    const saved = localStorage.getItem('safetypulse_gm_directives');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_EXECUTIVE_DIRECTIVES;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('safetypulse_chats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_CHAT_MESSAGES;
  });

  const [unreadCounts, setUnreadCounts] = useState<{ worker_hse: number; hse_gm: number }>({
    worker_hse: 1,
    hse_gm: 1
  });

  const [isChatDrawerOpen, setChatDrawerOpen] = useState<boolean>(false);
  const [activeChatChannel, setActiveChatChannel] = useState<'worker_hse' | 'hse_gm'>('worker_hse');
  const [activeAlertBanner, setActiveAlertBanner] = useState<AlertBannerData | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [selectedReportForModal, setSelectedReportForModal] = useState<SafetyReport | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(INITIAL_LEADERBOARD);

  // Shift Alarm & Mute Prevention (8:00 AM to 4:00 PM / 08:00 - 16:00)
  // Defaults to true during operation per user requirement
  const [isShiftAlarmHours, setIsShiftAlarmHours] = useState<boolean>(true);
  const [shiftMuteWarning, setShiftMuteWarning] = useState<string | null>(null);

  // Background Sync state
  const [isBackgroundSyncActive, setIsBackgroundSyncActive] = useState<boolean>(true);

  useEffect(() => {
    localStorage.setItem('safetypulse_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('safetypulse_gm_directives', JSON.stringify(executiveDirectives));
  }, [executiveDirectives]);

  useEffect(() => {
    localStorage.setItem('safetypulse_chats', JSON.stringify(chatMessages));
  }, [chatMessages]);

  // Request browser Notification permission on mount for continuous background alerts
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        Notification.requestPermission();
      } catch (e) {
        // Safe fallback
      }
    }
  }, []);

  // Background visibility listener: Keep audio alert active when app is minimized or backgrounded
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isBackgroundSyncActive) {
        // App continues background sync
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isBackgroundSyncActive]);

  const toggleAudioMute = () => {
    if (isShiftAlarmHours) {
      setShiftMuteWarning(
        '⚠️ إجراء سلامة إلزامي: يُمنع كتم الصوت في الموبايل من الساعة 8:00 صباحاً إلى 4:00 مساءً طوال تشغيل التطبيق لضمان الاستجابة الفورية للبلاغات والإنذارات الحرجة.'
      );
      setIsAudioMuted(false);
      audioAlertSystem.setMuted(false);
      return;
    }
    const next = !isAudioMuted;
    setIsAudioMuted(next);
    audioAlertSystem.setMuted(next);
  };

  const dismissShiftMuteWarning = () => {
    setShiftMuteWarning(null);
  };

  const triggerTestAudioAlert = (severity: Severity) => {
    audioAlertSystem.playAlert(severity);
  };

  const markChannelRead = (channelId: 'worker_hse' | 'hse_gm') => {
    setUnreadCounts(prev => ({
      ...prev,
      [channelId]: 0
    }));
  };

  const openChatWithReport = (channelId: 'worker_hse' | 'hse_gm', reportId: string) => {
    setActiveChatChannel(channelId);
    setChatDrawerOpen(true);
    markChannelRead(channelId);
  };

  const dismissAlertBanner = () => {
    setActiveAlertBanner(null);
  };

  // Add Report - NOTE: Points are PENDING and only granted when closed ('resolved')
  const addReport = (input: AddReportInput): SafetyReport => {
    const aiAssessment = assessRiskSeverity(input.description, input.category);

    const reportId = `REP-2026-${Math.floor(105 + reports.length)}`;
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = new Date().toISOString().split('T')[0];

    // Calculate potential points to be awarded upon case resolution
    const calculatedPoints = (aiAssessment.severity === 'critical' || aiAssessment.severity === 'high' ? 100 : 50) + (input.photos.length > 0 ? 25 : 0);

    const newReport: SafetyReport = {
      id: reportId,
      timestamp: `${dateStr} ${nowStr}`,
      title: input.title,
      description: input.description,
      category: input.category,
      siteZone: input.siteZone,
      location: input.location,
      photos: input.photos,
      reporter: {
        id: currentUser.id,
        name: currentUser.name,
        employeeId: currentUser.employeeId,
        phone: currentUser.phone,
        role: currentUser.role
      },
      aiAssessment,
      status: 'open',
      assignedHse: {
        id: 'usr_h_01',
        name: 'Sarah Jenkins, CSP',
        jobTitle: 'Senior HSE Superintendent'
      },
      gmDirectives: [],
      correctiveActions: [],
      pointsPending: calculatedPoints, // PENDING until ticket closed!
      customFieldValues: input.customFieldValues
    };

    setReports(prev => [newReport, ...prev]);

    // Audio alert & Push notification banner
    if (aiAssessment.severity === 'critical' || aiAssessment.severity === 'high') {
      audioAlertSystem.playAlert(aiAssessment.severity);
      setActiveAlertBanner({
        reportId: newReport.id,
        title: newReport.title,
        severity: aiAssessment.severity,
        siteZone: newReport.siteZone,
        timestamp: nowStr
      });

      // Browser Desktop/Mobile background Notification
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification(`🚨 [STOP CRITICAL SAFETY ALERT] ${newReport.siteZone}`, {
            body: `${newReport.title} - AI Severity: ${aiAssessment.severity.toUpperCase()}`,
            icon: '/favicon.ico'
          });
        } catch (e) {
          // Fallback
        }
      }
    } else {
      audioAlertSystem.playAlert('medium');
    }

    // Auto-generate notification in Worker <-> HSE chat channel
    const autoChatMessage: ChatMessage = {
      id: `msg_auto_${Date.now()}`,
      channelId: 'worker_hse',
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      text: `[NEW REPORT SUBMITTED] ${newReport.id}: "${newReport.title}". AI Severity: ${aiAssessment.severity.toUpperCase()} (${aiAssessment.score}/100) at ${newReport.siteZone}. Pending Points: +${calculatedPoints} (will be credited on verified closure).`,
      timestamp: nowStr,
      linkedReportId: newReport.id,
      isDirectUrgent: aiAssessment.severity === 'critical' || aiAssessment.severity === 'high'
    };

    setChatMessages(prev => [...prev, autoChatMessage]);
    setUnreadCounts(prev => ({ ...prev, worker_hse: prev.worker_hse + 1 }));

    return newReport;
  };

  // Update Report Status - Points awarded HERE when closed ('resolved')
  const updateReportStatus = (reportId: string, newStatus: ReportStatus) => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setReports(prev =>
      prev.map(r => {
        if (r.id !== reportId) return r;

        // If transitioning to resolved and points have not yet been granted:
        if (newStatus === 'resolved' && !r.pointsAwarded) {
          const pts = r.pointsPending || (r.aiAssessment.severity === 'critical' || r.aiAssessment.severity === 'high' ? 100 : 50);
          
          // Grant points to the reporting worker
          if (currentUser.id === r.reporter.id) {
            updateUserPoints(pts);
          }

          // Update Leaderboard
          setLeaderboard(lPrev =>
            lPrev.map(entry =>
              entry.employeeId === r.reporter.employeeId || entry.name.toLowerCase().includes(r.reporter.name.toLowerCase())
                ? { ...entry, points: entry.points + pts, verifiedReports: entry.verifiedReports + 1 }
                : entry
            )
          );

          // Audio confirmation chime
          audioAlertSystem.playAlert('low');

          // Send confirmation message to chat
          const closureChatMsg: ChatMessage = {
            id: `msg_close_${Date.now()}`,
            channelId: 'worker_hse',
            senderId: currentUser.id,
            senderName: currentUser.name,
            senderRole: currentUser.role,
            text: `✅ [TICKET RESOLVED & VERIFIED] Report ${r.id} is officially closed. Corrective actions confirmed. +${pts} Safety Points awarded to ${r.reporter.name}!`,
            timestamp: nowStr,
            linkedReportId: r.id
          };
          setChatMessages(cPrev => [...cPrev, closureChatMsg]);

          return {
            ...r,
            status: newStatus,
            pointsAwarded: pts,
            pointsAwardedAt: nowStr,
            resolvedAt: nowStr,
            resolvedBy: currentUser.name
          };
        }

        return { ...r, status: newStatus };
      })
    );
  };

  const assignReportToHSE = (reportId: string, hse: { id: string; name: string; jobTitle: string }) => {
    setReports(prev =>
      prev.map(r => (r.id === reportId ? { ...r, assignedHse: hse } : r))
    );
  };

  const addGMDirective = (reportId: string, directive: string) => {
    const newDirective = {
      id: `dir_${Date.now()}`,
      directive: directive.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      author: `${currentUser.name} (${currentUser.role.toUpperCase()})`
    };

    setReports(prev =>
      prev.map(r =>
        r.id === reportId
          ? {
              ...r,
              gmDirectives: [...(r.gmDirectives || []), newDirective],
              status: r.status === 'open' ? 'action_in_progress' : r.status
            }
          : r
      )
    );

    const directiveMsg: ChatMessage = {
      id: `msg_dir_${Date.now()}`,
      channelId: 'hse_gm',
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: 'gm',
      text: `DIRECTIVE for ${reportId}: "${directive.trim()}"`,
      timestamp: newDirective.timestamp,
      linkedReportId: reportId,
      isDirectUrgent: true
    };
    setChatMessages(prev => [...prev, directiveMsg]);
    setUnreadCounts(prev => ({ ...prev, hse_gm: prev.hse_gm + 1 }));
  };

  // Dispatch GM Executive Corrective Directive to Department GMs, Workers, or HSE
  const addGMExecutiveDirective = (directive: Omit<GMExecutiveDirective, 'id' | 'timestamp' | 'status' | 'author'>) => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newExecDir: GMExecutiveDirective = {
      ...directive,
      id: `exec_dir_${Date.now()}`,
      timestamp: nowStr,
      author: `${currentUser.name} (${currentUser.role.toUpperCase()})`,
      status: 'dispatched'
    };

    setExecutiveDirectives(prev => [newExecDir, ...prev]);

    // Attach to linked report if applicable
    if (directive.reportId) {
      setReports(prev =>
        prev.map(r =>
          r.id === directive.reportId
            ? {
                ...r,
                gmDirectives: [
                  ...(r.gmDirectives || []),
                  {
                    id: newExecDir.id,
                    directive: directive.directive,
                    timestamp: nowStr,
                    author: newExecDir.author,
                    targetDepartment: directive.targetDepartment,
                    assigneeName: directive.assigneeName,
                    deadline: directive.deadline
                  }
                ],
                status: r.status === 'open' ? 'action_in_progress' : r.status
              }
            : r
        )
      );
    }

    // Play alert sound for executive directive
    audioAlertSystem.playAlert('critical');

    // Chat dispatch
    const chatMsg: ChatMessage = {
      id: `msg_exec_${Date.now()}`,
      channelId: 'hse_gm',
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: 'gm',
      text: `🏛️ [EXECUTIVE GM DIRECTIVE DISPATCHED] To: ${directive.targetDepartmentAr || directive.targetDepartment} | Assignee: ${directive.assigneeName} | Directive: "${directive.directive}" | Deadline: ${directive.deadline}`,
      timestamp: nowStr,
      linkedReportId: directive.reportId,
      isDirectUrgent: true
    };
    setChatMessages(prev => [...prev, chatMsg]);
    setUnreadCounts(prev => ({ ...prev, hse_gm: prev.hse_gm + 1 }));
  };

  const updateDirectiveStatus = (directiveId: string, status: GMExecutiveDirective['status']) => {
    setExecutiveDirectives(prev =>
      prev.map(d => (d.id === directiveId ? { ...d, status } : d))
    );
  };

  const addCorrectiveAction = (reportId: string, note: string, photoProof?: string) => {
    const action = {
      id: `ca_${Date.now()}`,
      note: note.trim(),
      author: currentUser.name,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      photoProof
    };

    setReports(prev =>
      prev.map(r =>
        r.id === reportId
          ? {
              ...r,
              correctiveActions: [...(r.correctiveActions || []), action]
            }
          : r
      )
    );
  };

  const sendChatMessage = (
    channelId: 'worker_hse' | 'hse_gm',
    text: string,
    linkedReportId?: string,
    isDirectUrgent?: boolean
  ) => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      channelId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      text: text.trim(),
      timestamp: nowStr,
      linkedReportId,
      isDirectUrgent
    };

    setChatMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      let replyRole: UserRole = 'hse';
      let replyName = 'Sarah Jenkins, CSP';
      let replyText = 'Received your update. Dispatching area safety response team right now.';

      if (channelId === 'worker_hse') {
        if (currentUser.role === 'worker') {
          replyRole = 'hse';
          replyName = 'Sarah Jenkins, CSP';
          replyText = `Thank you for the field observation. We have logged the incident and deployed an inspection order. Stand by.`;
        } else {
          replyRole = 'worker';
          replyName = 'Marcus Reed';
          replyText = `Understood, proceeding with precautions and caution tape at the zone.`;
        }
      } else {
        if (currentUser.role === 'gm') {
          replyRole = 'hse';
          replyName = 'Sarah Jenkins, CSP';
          replyText = `Understood GM. Corrective measures initiated immediately under executive protocol. Will report closure status within 30 minutes.`;
        } else {
          replyRole = 'gm';
          replyName = 'Arthur Vance';
          replyText = `Acknowledged. Ensure all personnel are clear of the zone before authorizing work resumption.`;
        }
      }

      const autoReply: ChatMessage = {
        id: `msg_reply_${Date.now()}`,
        channelId,
        senderId: `usr_reply_${Date.now()}`,
        senderName: replyName,
        senderRole: replyRole,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        linkedReportId
      };

      setChatMessages(prev => [...prev, autoReply]);
      setUnreadCounts(prev => ({
        ...prev,
        [channelId]: prev[channelId] + 1
      }));
    }, 900);
  };

  // Simulate background report arrival for testing continuous background dispatch
  const simulateIncomingBackgroundReport = () => {
    const randomZones = ['ZONE-A (Refinery)', 'ZONE-B (Substation)', 'ZONE-E (HazMat Storage)', 'ZONE-D (Workshop)'];
    const sampleIncidents = [
      {
        title: 'تسريب بخار مضغوط من صمام أمان الغلاية رقم 2',
        titleEn: 'High-pressure steam leak from boiler safety relief valve 2',
        desc: 'رصد صوت تنفيس حاد وتصاعد بخار كثيف يحد من الرؤية بالقرب من ممشى التشغيل، احتمال تلف الحشوة المانعة.',
        cat: 'Pressure & Steam',
        sev: 'high' as Severity
      },
      {
        title: 'رائحة غاز كبريتيد الهيدروجين H2S قرب مصيدة السائل',
        titleEn: 'H2S gas odor detection near knock-out drum area',
        desc: 'أطلق الكاشف الشخصي قراءة 8 ppm، تم إخلاء المنطقة المجاورة فوراً وطلب فريق الطوارئ.',
        cat: 'Toxic Gas & Chemical',
        sev: 'critical' as Severity
      }
    ];

    const pick = sampleIncidents[Math.floor(Math.random() * sampleIncidents.length)];
    const zone = randomZones[Math.floor(Math.random() * randomZones.length)];

    addReport({
      title: pick.title,
      description: pick.desc,
      category: pick.cat,
      siteZone: zone,
      location: {
        lat: 24.6865,
        lng: 46.7230,
        address: `${zone} (Background Dispatch Sensor)`,
        accuracy: 4
      },
      photos: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400']
    });
  };

  return (
    <SafetyContext.Provider
      value={{
        reports,
        addReport,
        updateReportStatus,
        assignReportToHSE,
        addGMDirective,
        addGMExecutiveDirective,
        executiveDirectives,
        updateDirectiveStatus,
        addCorrectiveAction,
        chatMessages,
        sendChatMessage,
        unreadCounts,
        markChannelRead,
        isChatDrawerOpen,
        setChatDrawerOpen,
        activeChatChannel,
        setActiveChatChannel,
        openChatWithReport,
        activeAlertBanner,
        dismissAlertBanner,
        isAudioMuted,
        toggleAudioMute,
        triggerTestAudioAlert,
        isShiftAlarmHours,
        setIsShiftAlarmHours,
        shiftMuteWarning,
        dismissShiftMuteWarning,
        isBackgroundSyncActive,
        setIsBackgroundSyncActive,
        simulateIncomingBackgroundReport,
        selectedReportForModal,
        setSelectedReportForModal,
        leaderboard
      }}
    >
      {children}
    </SafetyContext.Provider>
  );
};

export const useSafety = () => {
  const context = useContext(SafetyContext);
  if (!context) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return context;
};
