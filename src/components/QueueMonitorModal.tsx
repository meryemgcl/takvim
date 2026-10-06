import React, { useState } from 'react';
import { 
  X, Activity, Cpu, ShieldCheck, Zap, Bell, CheckCircle2, AlertTriangle, 
  RefreshCw, Play, Inbox, Calendar, ArrowRight, Layers, Database, Sparkles,
  CheckCircle, FileWarning, Clock, Server, Radio
} from 'lucide-react';
import { QueueJobItem, LiveNotificationItem, QueueStats } from '../lib/useAsyncQueueSSE';

interface QueueMonitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  isConnected: boolean;
  lastPing: Date | null;
  jobs: QueueJobItem[];
  stats: QueueStats | null;
  notifications: LiveNotificationItem[];
  onSimulateScenario: (scenario: string, extra?: any) => Promise<any>;
  onClearCache: () => Promise<any>;
  onRefresh: () => void;
}

export const QueueMonitorModal: React.FC<QueueMonitorModalProps> = ({
  isOpen,
  onClose,
  isConnected,
  lastPing,
  jobs,
  stats,
  notifications,
  onSimulateScenario,
  onClearCache,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'notifications' | 'pipeline'>('queue');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulate = async (scenario: string, extra?: any) => {
    try {
      setIsSimulating(scenario);
      const res = await onSimulateScenario(scenario, extra);
      setActionSuccessMsg(`✅ Simülasyon başlatıldı (${scenario}): İş ID ${res.jobId || ''}`);
      setTimeout(() => setActionSuccessMsg(null), 5000);
    } catch (err: any) {
      setActionSuccessMsg(`❌ Hata: ${err.message}`);
    } finally {
      setIsSimulating(null);
    }
  };

  const handleClearCacheClick = async () => {
    try {
      await onClearCache();
      setActionSuccessMsg('🧹 Akıllı Önbellek (Smart Cache) temizlendi.');
      setTimeout(() => setActionSuccessMsg(null), 4000);
    } catch (err: any) {
      setActionSuccessMsg(`❌ Hata: ${err.message}`);
    }
  };

  const selectedJob = jobs.find(j => j.id === selectedJobId) || jobs[0];

  const getStatusBadge = (status: QueueJobItem['status']) => {
    switch (status) {
      case 'QUEUED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">⏳ KUYRUĞA ALINDI</span>;
      case 'EXTRACTING':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30 animate-pulse">📥 AYIKLANIYOR</span>;
      case 'VALIDATING':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30 animate-pulse">🛡️ ZOD DOĞRULAMA</span>;
      case 'CACHE_LOOKUP':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">🔍 ÖNBELLEK ARAMA</span>;
      case 'SYNCING':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 animate-pulse">📋 GOOGLE SYNC</span>;
      case 'CACHE_HIT':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">⚡ CACHE_HIT (Kota Korundu)</span>;
      case 'COMPLETED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">✅ TAMAMLANDI</span>;
      case 'FAILED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">❌ BAŞARISIZ</span>;
      default:
        return null;
    }
  };

  const getNotificationBadge = (type: LiveNotificationItem['type']) => {
    switch (type) {
      case 'TASK_ASSIGNED':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">TYPE_1: TASK_ASSIGNED</span>;
      case 'ROLLOVER_COMPLETED':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">TYPE_2: ROLLOVER_COMPLETED</span>;
      case 'MORNING_BRIEFING':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">TYPE_3: MORNING_BRIEFING</span>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-[#0B0F19] border border-[#263047] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#F1F5F9]">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-[#263047] bg-[#151B2B] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#4F46E5] flex items-center justify-center text-white shadow-lg shadow-[#6366F1]/25 shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Asenkron Olay Yöneticisi & Veri Bütünlüğü Motoru
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  FastAPI BackgroundTasks Mimari
                </span>
              </div>
              <p className="text-xs text-[#94A3B8]">
                UI Asla Bloklanmaz • Zod Pydantic Katılığı • 5 Dk Akıllı Önbellek • Canlı SSE Bildirimleri
              </p>
            </div>
          </div>

          {/* SSE Live Status Indicator */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
              isConnected 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
              <span className="hidden sm:inline">{isConnected ? 'SSE Canlı Bağlı' : 'Bağlantı Kesildi'}</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E273D] transition cursor-pointer"
              title="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Alert Message */}
        {actionSuccessMsg && (
          <div className="bg-indigo-950/60 border-b border-indigo-500/30 px-4 py-2 text-xs text-indigo-200 flex items-center justify-between">
            <span>{actionSuccessMsg}</span>
            <button onClick={() => setActionSuccessMsg(null)} className="text-indigo-300 hover:text-white">✕</button>
          </div>
        )}

        {/* 5-Step Pipeline Overview Strip */}
        <div className="px-4 py-3 bg-[#101522] border-b border-[#263047] overflow-x-auto scrollbar-none">
          <div className="flex items-center justify-between min-w-[700px] text-xs gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#151B2B] border border-[#263047]">
              <span className="w-5 h-5 rounded-md bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-[10px]">a</span>
              <span className="font-semibold text-[#F1F5F9]">Veri Ayıklama</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[#6366F1]/50 shrink-0" />

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#151B2B] border border-[#263047]">
              <span className="w-5 h-5 rounded-md bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-[10px]">b</span>
              <span className="font-semibold text-[#F1F5F9]">Zod Şema Doğrulaması</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[#6366F1]/50 shrink-0" />

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#151B2B] border border-[#263047]">
              <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px]">c</span>
              <span className="font-semibold text-[#F1F5F9]">Akıllı Önbellek (5 Dk)</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[#6366F1]/50 shrink-0" />

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#151B2B] border border-[#263047]">
              <span className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[10px]">d</span>
              <span className="font-semibold text-[#F1F5F9]">Google Tasks & Takvim</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[#6366F1]/50 shrink-0" />

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#151B2B] border border-emerald-500/30">
              <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">e</span>
              <span className="font-semibold text-emerald-300">Canlı Bildirim (SSE)</span>
            </div>
          </div>
        </div>

        {/* Quick Simulation Bar (1-Click Test Triggers) */}
        <div className="p-3 sm:p-4 bg-[#151B2B]/60 border-b border-[#263047]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 text-[#F59E0B]" />
              Hızlı Simülasyon ve Gerçek Zamanlı Test Tetikleyicileri
            </span>
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={handleClearCacheClick}
                className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition cursor-pointer"
                title="5 dakikalık önbelleği temizle"
              >
                🧹 Önbelleği Sıfırla
              </button>
              <button
                onClick={onRefresh}
                className="text-[11px] font-semibold text-[#94A3B8] hover:text-white transition flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Yenile
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {/* 1. Podio Staj Bildirimi */}
            <button
              onClick={() => handleSimulate('podio_staj')}
              disabled={isSimulating !== null}
              className="p-2 rounded-xl bg-[#1E273D] hover:bg-[#263047] border border-[#263047] hover:border-indigo-500/50 text-left transition cursor-pointer group disabled:opacity-50"
            >
              <div className="text-sm mb-1">💼</div>
              <div className="text-xs font-bold text-white group-hover:text-indigo-300 truncate">Podio Staj Kabul</div>
              <div className="text-[10px] text-[#94A3B8] truncate">FERGANİ 2027 Mülakatı</div>
            </button>

            {/* 2. Gmail Duyurusu */}
            <button
              onClick={() => handleSimulate('gmail_akbank')}
              disabled={isSimulating !== null}
              className="p-2 rounded-xl bg-[#1E273D] hover:bg-[#263047] border border-[#263047] hover:border-indigo-500/50 text-left transition cursor-pointer group disabled:opacity-50"
            >
              <div className="text-sm mb-1">📬</div>
              <div className="text-xs font-bold text-white group-hover:text-indigo-300 truncate">Gmail Akbank</div>
              <div className="text-[10px] text-[#94A3B8] truncate">Python Mentor Duyurusu</div>
            </button>

            {/* 3. Akıllı Önbellek Mükerrerlik Testi */}
            <button
              onClick={() => handleSimulate('duplicate_cache_test')}
              disabled={isSimulating !== null}
              className="p-2 rounded-xl bg-[#1E273D] hover:bg-[#263047] border border-amber-500/30 hover:border-amber-400 text-left transition cursor-pointer group disabled:opacity-50"
              title="Aynı e-postayı 5 dk içinde tekrar tetikler -> CACHE_HIT üretir"
            >
              <div className="text-sm mb-1">⚡</div>
              <div className="text-xs font-bold text-amber-300 group-hover:text-amber-200 truncate">Önbellek Testi</div>
              <div className="text-[10px] text-amber-200/70 truncate">5 Dk Tekrar Önleme</div>
            </button>

            {/* 4. Zod Bozuk Veri Onarım Testi */}
            <button
              onClick={() => handleSimulate('corrupt_data_test')}
              disabled={isSimulating !== null}
              className="p-2 rounded-xl bg-[#1E273D] hover:bg-[#263047] border border-purple-500/30 hover:border-purple-400 text-left transition cursor-pointer group disabled:opacity-50"
              title="Bozuk tarih formatı ve eksik subtask gönderilir -> Zod çalışma zamanında onarır"
            >
              <div className="text-sm mb-1">🛡️</div>
              <div className="text-xs font-bold text-purple-300 group-hover:text-purple-200 truncate">Zod Onarım Testi</div>
              <div className="text-[10px] text-purple-200/70 truncate">Veri Bütünlüğü Katılığı</div>
            </button>

            {/* 5. TYPE_2: Rollover Canlı Bildirim */}
            <button
              onClick={() => handleSimulate('type2_rollover')}
              disabled={isSimulating !== null}
              className="p-2 rounded-xl bg-[#1E273D] hover:bg-[#263047] border border-amber-500/30 hover:border-amber-400 text-left transition cursor-pointer group disabled:opacity-50"
            >
              <div className="text-sm mb-1">↩️</div>
              <div className="text-xs font-bold text-amber-300 group-hover:text-amber-200 truncate">TYPE_2 Bildirim</div>
              <div className="text-[10px] text-amber-200/70 truncate">Görev Devri (Rollover)</div>
            </button>

            {/* 6. TYPE_3: Sabah Brifingi Canlı Bildirim */}
            <button
              onClick={() => handleSimulate('type3_briefing')}
              disabled={isSimulating !== null}
              className="p-2 rounded-xl bg-[#1E273D] hover:bg-[#263047] border border-emerald-500/30 hover:border-emerald-400 text-left transition cursor-pointer group disabled:opacity-50"
            >
              <div className="text-sm mb-1">🌅</div>
              <div className="text-xs font-bold text-emerald-300 group-hover:text-emerald-200 truncate">TYPE_3 Bildirim</div>
              <div className="text-[10px] text-emerald-200/70 truncate">Sabah 06:00 Brifingi</div>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-4 border-b border-[#263047] bg-[#101522]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-3 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'queue'
                  ? 'border-[#6366F1] text-white'
                  : 'border-transparent text-[#94A3B8] hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>İş Kuyruğu ({jobs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-3 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'notifications'
                  ? 'border-[#6366F1] text-white'
                  : 'border-transparent text-[#94A3B8] hover:text-white'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Canlı SSE Bildirimleri ({notifications.length})</span>
            </button>
          </div>

          {/* Quick Metrics */}
          {stats && (
            <div className="hidden sm:flex items-center gap-3 text-[11px] text-[#94A3B8]">
              <span>Toplam İş: <strong className="text-white">{stats.totalJobs}</strong></span>
              <span>Tamamlanan: <strong className="text-emerald-400">{stats.completed}</strong></span>
              <span>Cache Hit: <strong className="text-amber-400">{stats.cacheHits}</strong></span>
              <span>Aktif SSE İstemci: <strong className="text-sky-400">{stats.activeClients}</strong></span>
            </div>
          )}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {activeTab === 'queue' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* Left: Job List */}
              <div className="lg:col-span-6 space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {jobs.length === 0 ? (
                  <div className="p-8 text-center text-[#94A3B8] bg-[#151B2B] rounded-xl border border-[#263047]">
                    <Inbox className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    <p className="text-sm font-semibold">Kuyrukta henüz iş bulunmuyor.</p>
                    <p className="text-xs text-slate-500 mt-1">Yukarıdaki simülasyon butonlarına tıklayarak test edebilirsiniz.</p>
                  </div>
                ) : (
                  jobs.map((job) => {
                    const isSelected = selectedJob?.id === job.id;
                    return (
                      <div
                        key={job.id}
                        onClick={() => setSelectedJobId(job.id)}
                        className={`p-3 rounded-xl border transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#1E273D] border-[#6366F1] shadow-lg shadow-[#6366F1]/10'
                            : 'bg-[#151B2B] border-[#263047] hover:border-[#384566]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[11px] font-mono text-[#94A3B8]">#{job.id}</span>
                          {getStatusBadge(job.status)}
                        </div>

                        <div className="text-xs font-bold text-white truncate mb-1">
                          {job.validatedTask?.title || job.extracted?.subject || job.rawPayload?.subject || 'Olay'}
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-[#94A3B8]">
                          <span className="capitalize">Kaynak: {job.source}</span>
                          <span>{job.durationMs ? `${job.durationMs}ms` : 'İşleniyor...'}</span>
                        </div>

                        {job.validatedTask?.repairsApplied && job.validatedTask.repairsApplied.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-[#263047] text-[10px] text-purple-300 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 shrink-0" />
                            <span className="truncate">{job.validatedTask.repairsApplied.length} adet Zod onarımı uygulandı</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Right: Selected Job Inspection */}
              <div className="lg:col-span-6 bg-[#151B2B] p-4 rounded-xl border border-[#263047] space-y-4 max-h-[500px] overflow-y-auto">
                {selectedJob ? (
                  <>
                    <div className="flex items-center justify-between border-b border-[#263047] pb-3">
                      <div>
                        <div className="text-xs font-mono text-[#94A3B8]">İş Denetim Raporu</div>
                        <h3 className="text-sm font-bold text-white mt-0.5">
                          {selectedJob.validatedTask?.title || selectedJob.extracted?.subject || selectedJob.id}
                        </h3>
                      </div>
                      {getStatusBadge(selectedJob.status)}
                    </div>

                    {/* Step Details */}
                    <div className="space-y-2 text-xs">
                      {/* Step a: Extraction */}
                      <div className="p-2.5 rounded-lg bg-[#101522] border border-[#263047]">
                        <div className="font-semibold text-sky-400 mb-1 flex items-center gap-1">
                          <span>a) Veri Ayıklama (Extraction):</span>
                        </div>
                        <div className="text-[#94A3B8] text-[11px] space-y-0.5">
                          <div>Gönderen: <strong className="text-white">{selectedJob.extracted?.sender || '-'}</strong></div>
                          <div>Ayıklanan Tarih/Saat: <strong className="text-white">{selectedJob.extracted?.extractedDate || '-'} {selectedJob.extracted?.extractedTime || ''}</strong></div>
                        </div>
                      </div>

                      {/* Step b: Zod Validation */}
                      <div className="p-2.5 rounded-lg bg-[#101522] border border-[#263047]">
                        <div className="font-semibold text-purple-400 mb-1 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>b) Zod Şema Doğrulaması:</span>
                        </div>
                        {selectedJob.validatedTask ? (
                          <div className="text-[11px] space-y-1">
                            <div className="text-emerald-300">✅ Veri bütünlüğü şemayla doğrulandı.</div>
                            <div>Kategori: <strong className="text-white">{selectedJob.validatedTask.category}</strong></div>
                            <div>Öncelik: <strong className="text-white">{selectedJob.validatedTask.priorityBadge}</strong></div>
                            {selectedJob.validatedTask.repairsApplied.length > 0 && (
                              <div className="mt-1 pt-1 border-t border-[#263047]">
                                <div className="text-[10px] font-bold text-purple-300 uppercase">Uygulanan Zod Onarımları:</div>
                                <ul className="list-disc pl-4 text-[10px] text-purple-200/80 space-y-0.5">
                                  {selectedJob.validatedTask.repairsApplied.map((rep, idx) => (
                                    <li key={idx}>{rep}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-[#94A3B8] text-[11px]">Doğrulama bekleniyor...</div>
                        )}
                      </div>

                      {/* Step c: Smart Cache Lookup */}
                      <div className="p-2.5 rounded-lg bg-[#101522] border border-[#263047]">
                        <div className="font-semibold text-amber-400 mb-1 flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5" />
                          <span>c) Akıllı Önbellek (5 Dk Deduplication):</span>
                        </div>
                        <div className="text-[11px] text-[#94A3B8]">
                          <div>Anahtar: <code className="text-amber-200 bg-amber-950/40 px-1 py-0.5 rounded">{selectedJob.cacheLookup?.cacheKey || 'N/A'}</code></div>
                          <div className="mt-1 font-semibold text-white">{selectedJob.cacheLookup?.reason || 'Kontrol ediliyor...'}</div>
                        </div>
                      </div>

                      {/* Step d: Google Tasks Sync */}
                      <div className="p-2.5 rounded-lg bg-[#101522] border border-[#263047]">
                        <div className="font-semibold text-indigo-400 mb-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>d) Google Tasks & Takvim Senkronizasyonu:</span>
                        </div>
                        <div className="text-[11px] text-[#94A3B8]">
                          {selectedJob.googleSyncResult ? (
                            <div>
                              <span className="text-emerald-400 font-semibold">Senkronize Edildi: </span>
                              <span className="text-white">{selectedJob.googleSyncResult.message}</span>
                            </div>
                          ) : selectedJob.status === 'CACHE_HIT' ? (
                            <div className="text-amber-300">⚡ Önbellek isabeti (Cache Hit) nedeniyle Google API çağrısı atlandı.</div>
                          ) : (
                            <div>Senkronizasyon bekleniyor...</div>
                          )}
                        </div>
                      </div>

                      {/* Step e: Live Notification */}
                      {selectedJob.liveNotification && (
                        <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30">
                          <div className="font-semibold text-emerald-400 mb-1 flex items-center gap-1">
                            <Radio className="w-3.5 h-3.5 animate-pulse" />
                            <span>e) Canlı Bildirim (SSE Yayınlandı):</span>
                          </div>
                          <div className="text-xs font-bold text-emerald-200">
                            "{selectedJob.liveNotification.message}"
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Step Execution Logs */}
                    <div className="mt-3 pt-3 border-t border-[#263047]">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-2">
                        İşlem Günlüğü (Audit Trail)
                      </div>
                      <div className="space-y-1 max-h-36 overflow-y-auto text-[11px] font-mono bg-[#0B0F19] p-2 rounded-lg border border-[#263047]">
                        {selectedJob.logs.map((lg, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-slate-500 shrink-0">[{lg.step}]</span>
                            <span className={
                              lg.type === 'error' ? 'text-rose-400' :
                              lg.type === 'warn' ? 'text-amber-400' :
                              lg.type === 'success' ? 'text-emerald-400' : 'text-slate-300'
                            }>
                              {lg.message}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-[#94A3B8] py-12">
                    Lütfen sol taraftan bir iş seçin.
                  </div>
                )}
              </div>

            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-2">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-[#94A3B8] bg-[#151B2B] rounded-xl border border-[#263047]">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                  <p className="text-sm font-semibold">Henüz canlı bildirim üretilmedi.</p>
                  <p className="text-xs text-slate-500 mt-1">Hızlı simülasyon butonlarını kullanarak TYPE_1, TYPE_2 veya TYPE_3 bildirimlerini tetikleyebilirsiniz.</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-3 rounded-xl bg-[#151B2B] border border-[#263047] flex items-start justify-between gap-3 animate-fade-in"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getNotificationBadge(notif.type)}
                        <span className="text-[10px] text-[#94A3B8]">
                          {new Date(notif.timestamp).toLocaleTimeString('tr-TR')}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-white">
                        {notif.message}
                      </div>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                  </div>
                ))
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-[#151B2B] border-t border-[#263047] flex items-center justify-between text-xs text-[#94A3B8]">
          <div>
            <span>Meryem Güçlü (meriguclu123@gmail.com) • İnovasyon & Etkinlik Ajandası</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold transition cursor-pointer"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
