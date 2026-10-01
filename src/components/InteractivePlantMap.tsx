import React, { useState } from 'react';
import { PlantStation, SafetyOfficerLocation } from '../types';
import { PLANT_STATIONS, SAFETY_OFFICERS_LOCATIONS } from '../utils/plantMapData';
import { useLanguage } from '../context/LanguageContext';
import { useSafety } from '../context/SafetyContext';
import { useTheme } from '../context/ThemeContext';
import { 
  MapPin, 
  Radio, 
  Phone, 
  MessageSquare, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  HardHat, 
  Eye, 
  Activity, 
  Battery, 
  Flame, 
  Zap, 
  Anchor, 
  Wrench, 
  Warehouse, 
  Building2,
  X
} from 'lucide-react';

interface InteractivePlantMapProps {
  onSelectReport?: (reportId: string) => void;
}

export const InteractivePlantMap: React.FC<InteractivePlantMapProps> = ({ onSelectReport }) => {
  const { language } = useLanguage();
  const { pantone } = useTheme();
  const { openChatWithReport, triggerTestAudioAlert } = useSafety();

  const [selectedStation, setSelectedStation] = useState<PlantStation | null>(null);
  const [selectedOfficer, setSelectedOfficer] = useState<SafetyOfficerLocation | null>(null);
  const [filterLayer, setFilterLayer] = useState<'all' | 'officers' | 'critical'>('all');
  const [radioPttActive, setRadioPttActive] = useState<string | null>(null);

  const getStationIcon = (stationId: string) => {
    switch (stationId) {
      case 'station_refinery':
        return <Flame className="w-5 h-5 text-rose-500" />;
      case 'station_substation':
        return <Zap className="w-5 h-5 text-amber-500" />;
      case 'station_marine':
        return <Anchor className="w-5 h-5 text-blue-500" />;
      case 'station_workshop':
        return <Wrench className="w-5 h-5 text-emerald-500" />;
      case 'station_hazmat':
        return <AlertTriangle className="w-5 h-5 text-purple-500" />;
      default:
        return <Building2 className="w-5 h-5 text-indigo-500" />;
    }
  };

  const handlePttBroadcast = (officer: SafetyOfficerLocation) => {
    setRadioPttActive(officer.id);
    triggerTestAudioAlert('medium');
    setTimeout(() => {
      setRadioPttActive(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Map Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-black flex items-center gap-2">
              <span>الخريطة التفاعلية لمحطات المنشأة وتمركز مسؤولي السلامة والصحة المهنية</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                بث حي ومباشر
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              رصد آني لمواقع محطات الإنتاج، إحداثيات مسؤولي السلامة والصحة المهنية، وأرقام وقنوات الاتصال اللاسلكي الفوري
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilterLayer('all')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterLayer === 'all' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            كافة المحطات والمسؤولين
          </button>
          <button
            onClick={() => setFilterLayer('officers')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterLayer === 'officers' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            مسؤولو HSE فقط
          </button>
          <button
            onClick={() => setFilterLayer('critical')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterLayer === 'critical' ? 'bg-rose-900/60 text-rose-300 border border-rose-700' : 'text-slate-400 hover:text-white'
            }`}
          >
            المناطق الحرجة فقط
          </button>
        </div>
      </div>

      {/* Main Interactive Map Graphic Container */}
      <div className="relative w-full aspect-16/9 min-h-[460px] max-h-[580px] rounded-3xl bg-slate-950 border-2 border-slate-800 overflow-hidden shadow-2xl select-none">
        
        {/* Subtle Map Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />

        {/* Plant Zone Boundaries & Roads SVG Vector Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-800/80 fill-none" xmlns="http://www.w3.org/2000/svg">
          {/* Main Plant Ring Road */}
          <path d="M 120 180 Q 400 80 800 120 T 1100 360 Q 950 500 500 480 Z" strokeWidth="2" strokeDasharray="6 6" />
          {/* Internal Access Corridors */}
          <line x1="22%" y1="35%" x2="52%" y2="44%" stroke="#334155" strokeWidth="2" />
          <line x1="52%" y1="44%" x2="74%" y2="24%" stroke="#334155" strokeWidth="2" />
          <line x1="52%" y1="44%" x2="38%" y2="72%" stroke="#334155" strokeWidth="2" />
          <line x1="52%" y1="44%" x2="86%" y2="68%" stroke="#334155" strokeWidth="2" />
          <line x1="50%" y1="15%" x2="52%" y2="44%" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" opacity="0.4" />
        </svg>

        {/* Stations Overlay */}
        {PLANT_STATIONS.map(station => {
          if (filterLayer === 'officers') return null;
          if (filterLayer === 'critical' && station.riskLevel !== 'critical') return null;

          const isSelected = selectedStation?.id === station.id;

          return (
            <div
              key={station.id}
              onClick={() => {
                setSelectedStation(station);
                setSelectedOfficer(null);
              }}
              style={{ left: `${station.coords.x}%`, top: `${station.coords.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-10 ${
                isSelected ? 'scale-110 z-30' : 'hover:scale-105'
              }`}
            >
              <div className={`p-3 rounded-2xl border-2 backdrop-blur-md shadow-xl flex items-center gap-2.5 ${
                station.riskLevel === 'critical'
                  ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                  : station.riskLevel === 'high'
                  ? 'bg-amber-950/80 border-amber-500 text-amber-200'
                  : 'bg-slate-900/80 border-slate-700 text-slate-200'
              }`}>
                <div className="p-1.5 rounded-xl bg-slate-950/90 shadow-inner">
                  {getStationIcon(station.id)}
                </div>
                <div className="text-right rtl:text-right ltr:text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-white/10">
                      {station.zoneCode}
                    </span>
                    <span className="text-xs font-black truncate max-w-[140px] sm:max-w-[180px]">
                      {station.nameAr || station.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                    <span>{station.activeIncidents} بلاغات نشطة</span>
                    {station.riskLevel === 'critical' && (
                      <span className="text-rose-400 font-bold animate-pulse">● حرج فوري</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Safety Officers Overlay Markers */}
        {SAFETY_OFFICERS_LOCATIONS.map(officer => {
          if (filterLayer === 'critical') return null;

          const isSelected = selectedOfficer?.id === officer.id;

          return (
            <div
              key={officer.id}
              onClick={() => {
                setSelectedOfficer(officer);
                setSelectedStation(null);
              }}
              style={{ left: `${officer.coords.x}%`, top: `${officer.coords.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-20 ${
                isSelected ? 'scale-125 z-40' : 'hover:scale-115'
              }`}
            >
              {/* Radar Pulse Effect around responding officer */}
              {officer.status === 'responding' && (
                <div className="absolute inset-0 -m-3 rounded-full bg-rose-500/30 animate-ping pointer-events-none" />
              )}

              <div className={`relative p-1.5 rounded-full border-2 shadow-2xl flex items-center justify-center ${
                officer.status === 'responding'
                  ? 'bg-rose-600 border-rose-300 text-white'
                  : 'bg-emerald-600 border-emerald-300 text-white'
              }`}>
                <HardHat className="w-5 h-5 stroke-[2.5]" />
                
                {/* Status Dot */}
                <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-950 ${
                  officer.status === 'responding' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                }`} />
              </div>

              {/* Mini Officer Badge */}
              <div className={`mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold text-center whitespace-nowrap shadow-md border ${
                officer.isFastestResponder
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-black animate-pulse'
                  : 'bg-slate-900/90 border-slate-700 text-slate-200'
              }`}>
                {officer.isFastestResponder && '⚡ '}
                {officer.nameAr.split('(')[0]}
              </div>
            </div>
          );
        })}

        {/* Legend Box */}
        <div className="absolute bottom-4 left-4 rtl:left-auto rtl:right-4 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs space-y-1.5 z-20 backdrop-blur-md">
          <div className="text-[11px] font-bold text-slate-400 mb-1">
            دليل ورموز الخريطة:
          </div>
          <div className="flex items-center gap-2 text-[11px] text-amber-300 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span>⚡ مسؤول السلامة الأسرع في المعالجة الفورية المستقلة (1.8 دقيقة)</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span>محطة أو بلاغ ذو خطورة حرجة</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>مسؤول سلامة وصحة مهنية متواجد / دورية نشطة</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>رصيف المرفأ والمنطقة البحرية</span>
          </div>
        </div>

      </div>

      {/* Detail Popout Modal: When Officer is Selected */}
      {selectedOfficer && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl space-y-5 animate-in fade-in duration-200">
          
          {selectedOfficer.isFastestResponder && (
            <div className="p-3.5 rounded-2xl bg-linear-to-r from-amber-500/20 via-amber-600/10 to-transparent border border-amber-500/40 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <span className="text-base">⚡</span>
                <span>مسؤول السلامة الأسرع في تنفيذ المعالجة الفورية المباشرة دون انتظار توجيهات المدير العام وفقاً لاشتراطات ومعايير السلامة والصحة المهنية المعتمدة</span>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 font-black text-[11px] shrink-0 shadow-xs">
                سرعة الإنجاز: 1.8 دقيقة | 34 معالجة مستقلة
              </span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-lg">
                {selectedOfficer.avatar}
              </div>
              <div>
                <h3 className="text-base font-black">
                  {selectedOfficer.nameAr}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedOfficer.jobTitleAr}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1 font-mono">
                  <span>كود الموظف: {selectedOfficer.employeeId}</span>
                  <span>·</span>
                  <span>📍 {selectedOfficer.stationNameAr}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                selectedOfficer.status === 'responding'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                <span>{selectedOfficer.statusAr}</span>
              </span>

              <button
                onClick={() => setSelectedOfficer(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Communication Actions Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Direct Mobile Call */}
            <a
              href={`tel:${selectedOfficer.phone}`}
              className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 flex items-center gap-3 transition-colors cursor-pointer group"
            >
              <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-md group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-semibold">
                  اتصال هاتفي مباشر للموبايل
                </span>
                <span className="font-mono text-xs font-black text-white">
                  {selectedOfficer.phone}
                </span>
              </div>
            </a>

            {/* Direct Radio VHF Channel Dispatch */}
            <div
              onClick={() => handlePttBroadcast(selectedOfficer)}
              className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 flex items-center gap-3 transition-colors cursor-pointer group"
            >
              <div className={`p-2.5 rounded-xl text-white shadow-md transition-transform ${
                radioPttActive === selectedOfficer.id ? 'bg-rose-600 animate-ping' : 'bg-amber-600 group-hover:scale-105'
              }`}>
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-semibold">
                  تردد اللاسلكي VHF (اضغط للتحدث)
                </span>
                <span className="font-mono text-xs font-black text-amber-300">
                  {selectedOfficer.radioChannel}
                </span>
              </div>
            </div>

            {/* Instant Internal Chat Trigger */}
            <button
              onClick={() => openChatWithReport('hse_gm', selectedOfficer.activeTaskId || 'REP-2026-101')}
              className="p-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-3 transition-colors cursor-pointer shadow-md"
            >
              <div className="p-2.5 rounded-xl bg-white/20 text-white">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="text-right rtl:text-right ltr:text-left">
                <span className="text-[11px] text-indigo-200 block font-semibold">
                  محادثة فورية (HSE - الإدارة العامة)
                </span>
                <span className="text-xs font-black">
                  فتح قناة التوجيه المباشر
                </span>
              </div>
            </button>

          </div>
        </div>
      )}

      {/* Detail Popout Modal: When Station is Selected */}
      {selectedStation && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-slate-800 text-amber-400">
                {getStationIcon(selectedStation.id)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {selectedStation.zoneCode}
                  </span>
                  <h3 className="text-base font-black">
                    {selectedStation.nameAr || selectedStation.name}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedStation.typeAr || selectedStation.type}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedStation(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedStation.descriptionAr || selectedStation.descriptionEn}
          </p>

          <div className="flex items-center gap-3 pt-2 text-xs">
            <span className="text-slate-400">مسؤولو HSE المكلفون بالمحطة:</span>
            <span className="font-bold text-emerald-400">
              {selectedStation.safetyOfficerIds.map(id => {
                const off = SAFETY_OFFICERS_LOCATIONS.find(o => o.id === id);
                return off ? (off.nameAr || off.name) : id;
              }).join('، ')}
            </span>
          </div>
        </div>
      )}

    </div>
  );
};
