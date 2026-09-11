import React, { useState, useEffect } from 'react';
import { Bell, BellOff, BellRing, Check, ShieldAlert, Volume2, VolumeX, Sparkles, X, Clock, Play } from 'lucide-react';
import { CalendarEvent } from '../types';
import { 
  getNotificationPermission, 
  requestNotificationPermission, 
  sendTestNotification, 
  playNotificationSound,
  NotificationPermissionStatus 
} from '../lib/notificationService';

interface NotificationManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: CalendarEvent[];
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const NotificationManagerModal: React.FC<NotificationManagerModalProps> = ({
  isOpen,
  onClose,
  events,
  soundEnabled,
  onToggleSound
}) => {
  const [permission, setPermission] = useState<NotificationPermissionStatus>('default');
  const [isTesting, setIsTesting] = useState(false);
  const [testSuccess, setTestSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPermission(getNotificationPermission());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const status = await requestNotificationPermission();
    setPermission(status);
    if (status === 'granted') {
      setTestSuccess('Masaüstü bildirim izni verildi! Hatırlatıcılar aktif.');
      sendTestNotification();
    } else if (status === 'denied') {
      setTestSuccess('Bildirim izni reddedildi. Tarayıcı ayarlarınızdan izin verebilirsiniz.');
    }
  };

  const handleSendTest = async () => {
    setIsTesting(true);
    setTestSuccess(null);
    const success = await sendTestNotification();
    setIsTesting(false);

    if (success) {
      setTestSuccess('Masaüstü bildirimi ve sesli uyarı başarıyla gönderildi!');
    } else {
      setTestSuccess('Bildirim gönderilemedi. Lütfen tarayıcı izinlerini kontrol edin.');
    }
  };

  const handleTestSound = () => {
    playNotificationSound();
  };

  // Find upcoming events in next 24 hours
  const now = new Date();
  const upcomingEvents = events
    .filter(ev => !ev.completed && ev.startDate)
    .map(ev => {
      const startDate = new Date(ev.startDate);
      const diffMs = startDate.getTime() - now.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return { event: ev, startDate, diffMinutes };
    })
    .filter(item => item.diffMinutes >= 0 && item.diffMinutes <= 1440) // within 24 hours
    .sort((a, b) => a.diffMinutes - b.diffMinutes);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <BellRing className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Masaüstü Bildirim Sistemi
              </h3>
              <p className="text-xs text-slate-400">Etkinlik saatine 15 dakika kala otomatik hatilatici</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Permission Status Box */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {permission === 'granted' ? (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  <span>Masaüstü Bildirimleri Aktif</span>
                </div>
              ) : permission === 'denied' ? (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Bildirim İzni Engellendi</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
                  <BellOff className="w-3.5 h-3.5" />
                  <span>Masaüstü İzni Bekleniyor</span>
                </div>
              )}
            </div>

            {permission !== 'granted' && permission !== 'unsupported' && (
              <button
                onClick={handleRequestPermission}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-md shadow-indigo-950/50"
              >
                İzin Ver
              </button>
            )}
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Tarayıcı bildirimi sayesinde sekme arkaplanda veya simge durumunda küçültülmüş olsa bile, etkinliklerinize 15 dakika kala sesli masaüstü uyarısı alırsınız.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={handleSendTest}
              disabled={isTesting}
              className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition border border-slate-600"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>Test Bildirimi Gönder</span>
            </button>

            <button
              onClick={handleTestSound}
              className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition border border-slate-600"
            >
              <Volume2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Sesi Test Et</span>
            </button>

            <button
              onClick={onToggleSound}
              className={`px-3 py-2 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition border ${
                soundEnabled 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{soundEnabled ? 'Ses Açık' : 'Ses Kapalı'}</span>
            </button>
          </div>

          {testSuccess && (
            <div className="p-2.5 rounded-xl bg-indigo-950/80 border border-indigo-500/30 text-indigo-200 text-xs flex items-center gap-2 animate-fadeIn">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>{testSuccess}</span>
            </div>
          )}
        </div>

        {/* Upcoming 15-min Reminders Preview */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Yaklaşan Otomatik Hatırlatıcılar (Önümüzdeki 24 Saat)</span>
          </h4>

          {upcomingEvents.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 text-center text-xs text-slate-400">
              Önümüzdeki 24 saat içinde otomatik hatırlatıcısı olan yaklaşan etkinlik bulunmuyor.
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {upcomingEvents.map(({ event, startDate, diffMinutes }) => (
                <div 
                  key={event.id}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs transition ${
                    diffMinutes <= 15 
                      ? 'bg-amber-950/30 border-amber-500/40 text-amber-200' 
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-200'
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-white line-clamp-1">{event.title}</p>
                    <p className="text-[11px] text-slate-400">
                      {startDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} ({event.location || 'Online'})
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                      diffMinutes <= 15 
                        ? 'bg-amber-500 text-slate-950 font-black animate-pulse' 
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}>
                      {diffMinutes === 0 ? 'Şimdi!' : `${diffMinutes} dk kaldı`}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">15 dk kala bildirim</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Hatırlatıcı döngüsü her 30 saniyede bir otomatik taranır.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition"
          >
            Tamam
          </button>
        </div>

      </div>
    </div>
  );
};
