import React from 'react';
import { AlertTriangle, Clock, Calendar, Edit3, X, CheckCircle2, Sparkles, Video } from 'lucide-react';
import { CalendarEvent } from '../types';
import { EventConflictPair } from '../lib/conflictService';

interface ConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  conflicts: EventConflictPair[];
  onEditEvent: (event: CalendarEvent) => void;
}

export const ConflictModal: React.FC<ConflictModalProps> = ({
  isOpen,
  onClose,
  conflicts,
  onEditEvent
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 text-white shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <AlertTriangle className="w-5 h-5 text-rose-400 animate-bounce" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Çakışan Etkinlik Uyarısı ({conflicts.length})
              </h3>
              <p className="text-xs text-slate-400">Aynı zaman dilimine denk gelen oturumlar tespit edildi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Conflicts */}
        {conflicts.length === 0 ? (
          <div className="p-8 text-center space-y-3 bg-slate-800/40 rounded-2xl border border-slate-800">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white">Harika! Hiçbir Takvim Çakışması Yok</h4>
            <p className="text-xs text-slate-400">Tüm etkinlikleriniz düzenli ve çakışmasız saat dilimlerine sahip.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {conflicts.map((pair, index) => {
              const startA = new Date(pair.eventA.startDate);
              const startB = new Date(pair.eventB.startDate);

              return (
                <div 
                  key={index} 
                  className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {pair.overlapMinutes} Dakikalık Zaman Çakışması
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Tarih: {startA.toLocaleDateString('tr-TR')}
                    </span>
                  </div>

                  {/* Side-by-Side Events */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Event A */}
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-indigo-300 line-clamp-1">{pair.eventA.title}</span>
                        <button
                          onClick={() => { onClose(); onEditEvent(pair.eventA); }}
                          title="Etkinliği Düzenle"
                          className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        🕒 {startA.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        📍 {pair.eventA.location || pair.eventA.program || 'Online'}
                      </p>
                    </div>

                    {/* Event B */}
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-amber-300 line-clamp-1">{pair.eventB.title}</span>
                        <button
                          onClick={() => { onClose(); onEditEvent(pair.eventB); }}
                          title="Etkinliği Düzenle"
                          className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        🕒 {startB.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        📍 {pair.eventB.location || pair.eventB.program || 'Online'}
                      </p>
                    </div>
                  </div>

                  {/* Intelligent Recommendation Box */}
                  {pair.recommendation && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="font-semibold block text-amber-300">Otonom Orkestratör Katılım Önerisi:</span>
                        <p className="text-slate-300 leading-relaxed text-[11px]">{pair.recommendation}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Çakışan saatleri düzeltmek için ilgili etkinliğin kalem simgesine tıklayın.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
