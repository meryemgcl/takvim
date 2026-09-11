import React from 'react';
import { 
  Flame, Clock, Calendar, CheckSquare, Layers, ArrowUpRight, 
  ExternalLink, Sparkles, Target, AlertTriangle, ShieldCheck, ChevronRight
} from 'lucide-react';
import { CalendarEvent } from '../types';
import { getRelativeTimeText } from '../lib/exportUtils';
import { TRL_DEFINITIONS } from '../data/innovationTemplates';

interface InnovationRadarProps {
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
  onFilterProgram: (program: string) => void;
  activeFilter: string;
}

export const InnovationRadar: React.FC<InnovationRadarProps> = ({
  events,
  onSelectEvent,
  onFilterProgram,
  activeFilter
}) => {
  // Find upcoming critical deadlines
  const upcomingDeadlines = events
    .filter(e => !e.completed && (e.priority === 'critical' || e.isMandatory || e.type === 'submission'))
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3);

  // Calculate deliverable completion stats
  const allDeliverables = events.flatMap(e => e.deliverables || []);
  const completedDeliverables = allDeliverables.filter(d => d.completed).length;
  const deliverablePercent = allDeliverables.length > 0
    ? Math.round((completedDeliverables / allDeliverables.length) * 100)
    : 0;

  // Calculate highest TRL achieved
  const eventsWithTrl = events.filter(e => e.trlLevel);
  const maxTrl = eventsWithTrl.length > 0 
    ? Math.max(...eventsWithTrl.map(e => e.trlLevel || 1)) 
    : 3;
  const currentTrlDef = TRL_DEFINITIONS.find(t => t.level === maxTrl) || TRL_DEFINITIONS[2];

  // Quick categories
  const categoryHighlights = [
    {
      id: 'kariyer-yetenek',
      title: 'Kariyer & Genç Yetenek Havuzu',
      icon: '💼',
      bgClass: 'bg-blue-950/50 border-blue-500/40 text-blue-200 hover:bg-blue-900/60',
      badge: 'Savunma & Staj',
      count: events.filter(e => e.program === 'kariyer-yetenek').length
    },
    {
      id: 'cop31-gonullu',
      title: 'COP31 Türkiye Gönüllülük (CSB)',
      icon: '🌍',
      bgClass: 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200 hover:bg-emerald-900/60',
      badge: '15 Eylül 2026',
      count: events.filter(e => e.program === 'cop31-gonullu').length
    },
    {
      id: 'tubitak-yarisma',
      title: 'TÜBİTAK 10 Sayfalık Sunum & 2209-A',
      icon: '🏆',
      bgClass: 'bg-teal-950/40 border-teal-500/30 text-teal-300 hover:bg-teal-900/50',
      badge: '31 Ekim 2026',
      count: events.filter(e => e.program === 'tubitak-yarisma').length
    },
    {
      id: 'arge-inovasyon',
      title: 'Ar-Ge ve İnovasyon Proje Pazarı',
      icon: '🔬',
      bgClass: 'bg-violet-950/40 border-violet-500/30 text-violet-300 hover:bg-violet-900/50',
      badge: '17 Ekim 2026',
      count: events.filter(e => e.program === 'arge-inovasyon').length
    }
  ];

  return (
    <div className="bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-800 text-white shadow-xl space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Live Radar & Metrics */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Canlı İnovasyon & Süreç Radarı</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <span>Stratejik Hazırlık ve Kritik Teslimatlar</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed mt-1">
            Öncelikli yarışma teslimatları, TRL olgunluk düzeyi ve evrak kontrol durumunuzu anlık olarak takip edin.
          </p>
        </div>

        {/* Global Progress Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
          
          {/* TRL Status Box */}
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-slate-400">Hedef TRL Düzeyi</span>
              <span className="text-xs font-black text-violet-400 bg-violet-950/80 px-2 py-0.5 rounded-md border border-violet-800">
                TRL-{maxTrl}
              </span>
            </div>
            <div className="mt-1 text-xs font-bold text-slate-200 truncate" title={currentTrlDef.title}>
              {currentTrlDef.title}
            </div>
          </div>

          {/* Deliverables Checkbox Progress */}
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-slate-400">Evrak & Teslimat</span>
              <span className="text-xs font-black text-emerald-400">
                %{deliverablePercent}
              </span>
            </div>
            <div className="mt-1 text-xs font-bold text-slate-200">
              {completedDeliverables} / {allDeliverables.length} Madde Hazır
            </div>
          </div>

          {/* Total Active Events */}
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 col-span-2 sm:col-span-1 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-slate-400">Aktif Görevler</span>
              <span className="text-xs font-black text-indigo-400">
                {events.filter(e => !e.completed).length} Kaldı
              </span>
            </div>
            <div className="mt-1 text-xs font-bold text-slate-200">
              {events.filter(e => e.completed).length} Tamamlandı
            </div>
          </div>

        </div>
      </div>

      {/* Countdown Cards for Nearest Critical Deadlines */}
      {upcomingDeadlines.length > 0 && (
        <div className="relative z-10 space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-200">
              <Flame className="w-4 h-4 text-rose-400" />
              <span>Yaklaşan En Kritik 3 Teslimat & Aşama:</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {upcomingDeadlines.map(ev => {
              const relTime = getRelativeTimeText(ev.startDate);
              const delList = ev.deliverables || [];
              const delDone = delList.filter(d => d.completed).length;

              return (
                <div
                  key={ev.id}
                  onClick={() => onSelectEvent(ev)}
                  className="group p-4 rounded-2xl bg-slate-950/90 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 transition cursor-pointer flex flex-col justify-between space-y-3 shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {relTime.text ? relTime.text : 'Kritik'}
                      </span>
                      {ev.trlLevel && (
                        <span className="text-[10px] font-bold text-violet-300">
                          TRL-{ev.trlLevel}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition line-clamp-2">
                      {ev.title}
                    </h4>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <CheckSquare className="w-3 h-3 text-emerald-400" />
                      <span>{delDone}/{delList.length} Evrak</span>
                    </span>
                    <span className="font-semibold text-slate-300 group-hover:text-white flex items-center gap-0.5">
                      İncele <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Fast Program Filter Matrix */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2">
        {categoryHighlights.map(cat => {
          const isSelected = activeFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onFilterProgram(isSelected ? 'all' : cat.id)}
              className={`p-3 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                isSelected 
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg ring-2 ring-indigo-300/40' 
                  : cat.bgClass
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-xl shrink-0">{cat.icon}</span>
                <div className="min-w-0">
                  <div className={`text-xs font-bold truncate ${isSelected ? 'text-white' : ''}`}>
                    {cat.title}
                  </div>
                  <div className={`text-[10px] font-medium opacity-80 ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                    Hedef: {cat.badge}
                  </div>
                </div>
              </div>
              <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-900 text-slate-300'}`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

    </div>
  );
};
