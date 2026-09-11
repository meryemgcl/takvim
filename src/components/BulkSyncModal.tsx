import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, AlertCircle, RefreshCw, X, ShieldCheck, ExternalLink, Search, ListFilter, Sparkles } from 'lucide-react';
import { CalendarEvent, UserAuth } from '../types';
import { downloadICSFile } from '../lib/icsGenerator';
import { listGoogleCalendarEvents } from '../lib/googleCalendar';

interface BulkSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: CalendarEvent[];
  user: UserAuth | null;
  onLogin: () => void;
  onConfirmBulkSync: (selectedEvents: CalendarEvent[]) => Promise<void>;
  isSyncing: boolean;
}

export const BulkSyncModal: React.FC<BulkSyncModalProps> = ({
  isOpen,
  onClose,
  events,
  user,
  onLogin,
  onConfirmBulkSync,
  isSyncing
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'bulk' | 'audit'>('bulk');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(events.map(e => e.id))
  );

  // Live Google Calendar Audit State
  const [liveCalendarEvents, setLiveCalendarEvents] = useState<any[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);
  const [hasAudited, setHasAudited] = useState(false);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const selectAll = () => setSelectedIds(new Set(events.map(e => e.id)));
  const deselectAll = () => setSelectedIds(new Set());

  const selectedEvents = events.filter(e => selectedIds.has(e.id));

  const handleSyncClick = async () => {
    if (!user) {
      onLogin();
      return;
    }
    await onConfirmBulkSync(selectedEvents);
  };

  // Run audit against user's actual Google Calendar
  const handleRunAudit = async () => {
    if (!user || !user.accessToken) {
      onLogin();
      return;
    }

    setIsAuditing(true);
    setAuditError(null);

    try {
      const calendarItems = await listGoogleCalendarEvents(user.accessToken);
      setLiveCalendarEvents(calendarItems);
      setHasAudited(true);

      // Auto-select missing events
      const missingIds = new Set<string>();
      events.forEach(localEv => {
        const found = calendarItems.some((gItem: any) => {
          const gSummary = (gItem.summary || '').toLowerCase();
          const lTitle = localEv.title.toLowerCase();
          return gSummary.includes(lTitle) || lTitle.includes(gSummary);
        });
        if (!found) {
          missingIds.add(localEv.id);
        }
      });

      if (missingIds.size > 0) {
        setSelectedIds(missingIds);
      }
    } catch (err: any) {
      setAuditError(err.message || 'Google Takvim verileri okunamadı.');
    } finally {
      setIsAuditing(false);
    }
  };

  // Helper to check if event exists in audited calendar
  const isEventInLiveCalendar = (localEv: CalendarEvent) => {
    if (!hasAudited) return localEv.syncedToGoogle;
    return liveCalendarEvents.some((gItem: any) => {
      const gSummary = (gItem.summary || '').toLowerCase();
      const lTitle = localEv.title.toLowerCase();
      return gSummary.includes(lTitle) || lTitle.includes(gSummary);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Google Takvim Aktarımı & Kontrolü</h3>
              <p className="text-xs text-slate-300 font-normal">Etkinlikleri Google Takviminize aktarın veya takviminizdeki eksikleri inceleyin</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => setActiveTab('bulk')}
            className={`flex-1 py-3 px-4 text-xs font-semibold flex items-center justify-center gap-2 transition border-b-2 cursor-pointer ${
              activeTab === 'bulk'
                ? 'border-red-600 text-red-600 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            Toplu Etkinlik Aktarımı
          </button>
          <button
            onClick={() => {
              setActiveTab('audit');
              if (user && !hasAudited) handleRunAudit();
            }}
            className={`flex-1 py-3 px-4 text-xs font-semibold flex items-center justify-center gap-2 transition border-b-2 cursor-pointer ${
              activeTab === 'audit'
                ? 'border-red-600 text-red-600 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search className="w-4 h-4" />
            Takvimimi Tara & Eksikleri Bul
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          
          {!user ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-xs text-amber-900">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p className="font-semibold">Google Takvim Bağlantısı</p>
                  <p className="text-amber-700 font-normal">Etkinliklerinizi otomatik senkronize etmek için lütfen Google hesabınızla giriş yapın.</p>
                </div>
              </div>
              <button
                onClick={onLogin}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-lg shrink-0 shadow-sm cursor-pointer"
              >
                Google ile Giriş Yap
              </button>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Hesap: <strong>{user.email || user.displayName || 'Google Kullanıcısı'}</strong> bağlı ve hazır.</span>
              </div>
              <a
                href="https://calendar.google.com"
                target="_blank"
                rel="noreferrer"
                className="text-red-700 hover:text-red-900 font-semibold flex items-center gap-1 underline"
              >
                Google Takvim'i Aç <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Takvim Durum Analizi
                  </h4>
                  <button
                    onClick={handleRunAudit}
                    disabled={isAuditing || !user}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
                    Yeniden Kontrol Et
                  </button>
                </div>
                <p className="text-[11px] text-slate-600 font-normal">
                  Google Takviminiz kontrol edilerek kayıtlı olmayan oturum ve tarihler belirlenir.
                </p>
              </div>

              {auditError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{auditError}</span>
                </div>
              )}

              {hasAudited && (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <span className="font-bold text-emerald-900 block text-sm">
                      {events.filter(e => isEventInLiveCalendar(e)).length} Etkinlik
                    </span>
                    <span className="text-emerald-700 text-[11px]">Takviminizde Zaten Var</span>
                  </div>
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                    <span className="font-bold text-rose-900 block text-sm">
                      {events.filter(e => !isEventInLiveCalendar(e)).length} Etkinlik
                    </span>
                    <span className="text-rose-700 text-[11px]">Takviminize Henüz Eklenmemiş</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t">
            <span>Seçilen: <strong>{selectedIds.size} / {events.length} etkinlik</strong></span>
            <div className="space-x-3">
              <button onClick={selectAll} className="text-indigo-600 hover:underline font-medium cursor-pointer">Tümünü Seç</button>
              <button onClick={deselectAll} className="text-slate-500 hover:underline cursor-pointer">Seçimi Temizle</button>
            </div>
          </div>

          {/* List of events with audit badges */}
          <div className="space-y-2">
            {events.map((ev) => {
              const isChecked = selectedIds.has(ev.id);
              const existsInGoogle = isEventInLiveCalendar(ev);
              return (
                <div
                  key={ev.id}
                  onClick={() => toggleSelect(ev.id)}
                  className={`p-3 rounded-xl border text-xs flex items-start gap-3 cursor-pointer transition ${
                    isChecked ? 'border-red-300 bg-red-50/30' : 'border-slate-200 bg-white opacity-70'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}} // handled by parent onClick
                    className="mt-1 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-900 truncate">{ev.title}</span>
                      {hasAudited ? (
                        existsInGoogle ? (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Takvimde Var
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-rose-100 text-rose-800 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-rose-600" /> Takvimde Yok
                          </span>
                        )
                      ) : (
                        ev.syncedToGoogle && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-medium">
                            Ekli
                          </span>
                        )
                      )}
                    </div>
                    <p className="text-slate-500 font-normal">
                      {new Date(ev.startDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'short' })}
                      {!ev.allDay && ` | ${ev.startDate.split('T')[1]?.slice(0, 5)}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => downloadICSFile(selectedEvents, 'akbank-secilen-etkinlikler.ics')}
            className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <span>Dosya Olarak İndir (.ics)</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium text-xs transition cursor-pointer"
            >
              Kapat
            </button>

            <button
              onClick={handleSyncClick}
              disabled={isSyncing || selectedIds.size === 0}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs flex items-center gap-2 transition shadow-md disabled:opacity-50 cursor-pointer"
            >
              {isSyncing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Calendar className="w-4 h-4" />
              )}
              <span>{user ? `${selectedIds.size} Etkinliği Takvime Aktar` : 'Giriş Yap & Aktar'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

