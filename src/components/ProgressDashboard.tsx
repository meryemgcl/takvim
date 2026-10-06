import React from 'react';
import { 
  CheckCircle2, Clock, AlertTriangle, ShieldCheck, Flame, 
  ArrowUpRight, RefreshCw, Database, Layers, Sparkles, Check
} from 'lucide-react';
import { GoogleTaskItem } from '../types';

interface ProgressDashboardProps {
  tasks: GoogleTaskItem[];
  onToggleTask: (taskId: string, isCompleted: boolean) => void;
  onSyncPersistentHistory?: () => void;
  isSyncingHistory?: boolean;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  tasks,
  onToggleTask,
  onSyncPersistentHistory,
  isSyncingHistory = false
}) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Active High-Priority Items (P0 and P1)
  const highPriorityTasks = tasks.filter(t => 
    t.status === 'needsAction' && (
      t.priority === 'critical' || t.priority === 'high' ||
      t.title.includes('🚨') || t.title.includes('⚡') ||
      t.title.includes('[P0]') || t.title.includes('[P1]')
    )
  );

  // Carried Over Tasks
  const carriedOverTasks = tasks.filter(t => 
    t.status === 'needsAction' && (t.isRolledOver || t.title.includes('↩️'))
  );

  return (
    <div className="bg-[#111726] border border-[#263047] rounded-2xl p-5 sm:p-6 shadow-xl mb-6 relative overflow-hidden">
      {/* Background Glow Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#1E273D] relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Flame className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-white tracking-tight">
                Canlı İlerleme & Performans Radarı
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Database className="w-2.5 h-2.5" />
                Zero Data Loss (JSON DB)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              TÜBİTAK 2209-A, Savunma Stajları ve Günlük Görev Akışı Gerçek Zamanlı Takibi
            </p>
          </div>
        </div>

        {onSyncPersistentHistory && (
          <button
            onClick={onSyncPersistentHistory}
            disabled={isSyncingHistory}
            className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#1E273D] hover:bg-[#2A3654] text-indigo-300 hover:text-white border border-[#263047] transition shadow-sm cursor-pointer disabled:opacity-50"
            title="Kalıcı tasks_history.json veritabanına anlık snapshot kaydet"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingHistory ? 'animate-spin' : ''}`} />
            <span>{isSyncingHistory ? 'Arşive Kaydediliyor...' : 'Persistent DB Eşitle'}</span>
          </button>
        )}
      </div>

      {/* Top 3 Visual KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5 relative z-10">
        
        {/* KPI 1: Completion Metric */}
        <div className="bg-[#151B2B] border border-[#263047] rounded-xl p-4 flex items-center gap-4">
          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#1E273D]"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-indigo-400 transition-all duration-700"
                strokeDasharray={`${completionPercentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-extrabold text-white">
              %{completionPercentage}
            </span>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold">Günlük Tamamlama Oranı</div>
            <div className="text-lg font-black text-white mt-0.5">
              {completedTasks} <span className="text-xs text-slate-400 font-normal">/ {totalTasks} Görev Bitti</span>
            </div>
            <div className="text-[11px] text-indigo-300 mt-0.5">
              {pendingTasks} bekleyen operasyon
            </div>
          </div>
        </div>

        {/* KPI 2: Active High-Priority [P0 / P1] */}
        <div className="bg-[#151B2B] border border-[#263047] rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              Aktif P0 & P1 Öncelikler
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {highPriorityTasks.length}
            </div>
            <div className="text-[11px] text-amber-300/90 mt-0.5">
              Mülakat, son teslim ve canlı lablar
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-xl">
            🚨
          </div>
        </div>

        {/* KPI 3: Carried Over Tasks */}
        <div className="bg-[#151B2B] border border-[#263047] rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Dünden Devreden Görevler
            </div>
            <div className="text-2xl font-black text-amber-400 mt-1">
              {carriedOverTasks.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Rollover etiketiyle aktarıldı
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl">
            ↩️
          </div>
        </div>

      </div>

      {/* Two Column Focus: High Priority vs Carried Over */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2 relative z-10">
        
        {/* Left Column: High Priority Queue [P0 & P1] */}
        <div className="bg-[#0B0F19] border border-[#1E273D] rounded-xl p-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E273D] mb-3">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <span className="text-sm">⚡</span>
              Kritik Odak Havuzu (P0 & P1)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
              {highPriorityTasks.length} Aktif
            </span>
          </div>

          {highPriorityTasks.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500">
              🎉 Harika! Tüm kritik (P0/P1) görevler tamamlandı.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {highPriorityTasks.map(task => (
                <div 
                  key={task.id}
                  className="p-3 rounded-lg bg-[#151B2B] border border-[#263047] hover:border-indigo-500/50 transition flex items-start gap-3"
                >
                  <button
                    onClick={() => onToggleTask(task.id, true)}
                    className="mt-0.5 w-4 h-4 rounded border border-slate-600 hover:border-emerald-400 hover:bg-emerald-500/20 flex items-center justify-center transition shrink-0 cursor-pointer"
                    title="Görevi tamamla"
                  >
                    <Check className="w-3 h-3 text-transparent hover:text-emerald-400" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white leading-snug line-clamp-2">
                      {task.title}
                    </div>
                    {task.category && (
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1E273D] text-slate-400 font-medium">
                          {task.category}
                        </span>
                        {task.due && (
                          <span className="text-[10px] text-amber-400">
                            ⏰ {task.due.split('T')[0]}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Carried Over Tasks [Dünden Devretti] */}
        <div className="bg-[#0B0F19] border border-[#1E273D] rounded-xl p-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E273D] mb-3">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <span className="text-sm">↩️</span>
              Dünden Devredenler (Rollover)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {carriedOverTasks.length} Görev
            </span>
          </div>

          {carriedOverTasks.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500">
              ✨ Dünden devreden bekleyen görev bulunmuyor.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {carriedOverTasks.map(task => (
                <div 
                  key={task.id}
                  className="p-3 rounded-lg bg-[#151B2B] border border-amber-500/30 hover:border-amber-500/60 transition flex items-start gap-3"
                >
                  <button
                    onClick={() => onToggleTask(task.id, true)}
                    className="mt-0.5 w-4 h-4 rounded border border-amber-600 hover:border-emerald-400 hover:bg-emerald-500/20 flex items-center justify-center transition shrink-0 cursor-pointer"
                    title="Görevi tamamla"
                  >
                    <Check className="w-3 h-3 text-transparent hover:text-emerald-400" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-amber-200 leading-snug line-clamp-2">
                      {task.title}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                      <span className="px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40">
                        [Dünden Devretti ↩️]
                      </span>
                      {task.rolledOverFrom && (
                        <span>Önceki: {task.rolledOverFrom}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
