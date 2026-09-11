import React from 'react';
import { 
  Calendar, ExternalLink, Download, CheckCircle, Clock, MapPin, 
  Trash2, Edit3, ShieldAlert, Sparkles, Video, BookOpen, UserCheck, FileSpreadsheet, Bell, AlertTriangle, CheckSquare, Square, Tag, Layers, Flame, Target
} from 'lucide-react';
import { CalendarEvent, UserAuth, EventDeliverable } from '../types';
import { buildGoogleCalendarUrl, downloadICSFile } from '../lib/icsGenerator';
import { getRelativeTimeText } from '../lib/exportUtils';

interface EventCardProps {
  event: CalendarEvent;
  user: UserAuth | null;
  onSyncToGoogle: (event: CalendarEvent) => void;
  onRemoveFromGoogle: (event: CalendarEvent) => void;
  onToggleComplete: (eventId: string) => void;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (event: CalendarEvent) => void;
  onUpdateReminder?: (eventId: string, minutes: number) => void;
  onUpdateDeliverable?: (eventId: string, deliverableId: string, completed: boolean) => void;
  isSyncingThisEvent?: boolean;
  hasConflict?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  user,
  onSyncToGoogle,
  onRemoveFromGoogle,
  onToggleComplete,
  onEdit,
  onDelete,
  onUpdateReminder,
  onUpdateDeliverable,
  isSyncingThisEvent,
  hasConflict = false
}) => {
  const formatDateTR = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        weekday: 'long'
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  const formatTimeTR = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(d);
    } catch {
      return '';
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'webinar':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-950/60 text-red-300 border border-red-800"><Video className="w-3 h-3" /> Canlı Oturum</span>;
      case 'self-paced':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-950/60 text-sky-300 border border-sky-800"><BookOpen className="w-3 h-3" /> Bireysel Eğitim</span>;
      case 'meeting':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#6366F1]/20 text-[#818CF8] border border-[#6366F1]/40"><UserCheck className="w-3 h-3" /> Mentorluk & Tanışma</span>;
      case 'submission':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950/60 text-rose-300 border border-rose-800"><FileSpreadsheet className="w-3 h-3" /> Son Teslim / Sınav</span>;
      case 'workshop':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/60 text-[#F59E0B] border border-amber-800"><Sparkles className="w-3 h-3" /> Atölye & Uygulama</span>;
      case 'milestone':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#6366F1]/20 text-[#818CF8] border border-[#6366F1]/40"><Target className="w-3 h-3" /> İnovasyon Kilometre Taşı</span>;
      case 'pitch':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-950/60 text-purple-300 border border-purple-800"><Flame className="w-3 h-3" /> Jüri & Pitch Deck</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#1E273D] text-[#94A3B8] border border-[#263047]">Etkinlik</span>;
    }
  };

  const getProgramBadge = (program: string) => {
    switch (program) {
      case 'nocode-lowcode':
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold tracking-wide bg-violet-600 text-white shadow-xs">🛠️ No-Code & Low-Code</span>;
      case 'akbank-python':
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold tracking-wide bg-rose-600 text-white shadow-xs">🔴 Akbank Python</span>;
      case 'tech-istanbul-bootcamp':
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold tracking-wide bg-sky-600 text-white shadow-xs">⚡ Tech Istanbul Bootcamp</span>;
      case 'pythiango-ai-masterclass':
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold tracking-wide bg-purple-600 text-white shadow-xs">🤖 PythianGo Masterclass</span>;
      case 'careergen-bootcamp':
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold tracking-wide bg-[#6366F1] text-white shadow-xs">🚀 CareerGen Bootcamp</span>;
      case 'python-100-gun':
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold tracking-wide bg-[#F59E0B] text-slate-950 shadow-xs">🐍 Python 100 Gün</span>;
      case 'cop31-gonullu':
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold tracking-wide bg-blue-600 text-white shadow-xs">🌍 COP31 Gönüllülük</span>;
      case 'kariyer-yetenek':
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold tracking-wide bg-[#6366F1] text-white shadow-xs">💼 Kariyer & Yetenek</span>;
      case 'tubitak-yarisma':
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold tracking-wide bg-indigo-600 text-white shadow-xs">🏆 TÜBİTAK</span>;
      case 'arge-inovasyon':
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold tracking-wide bg-violet-600 text-white shadow-xs">🔬 Ar-Ge Proje Pazarı</span>;
      case 'cezeri-staj':
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold tracking-wide bg-blue-600 text-white shadow-xs">🚀 CEZERİ Staj</span>;
      case 'fergani-staj':
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold tracking-wide bg-purple-600 text-white shadow-xs">🛰️ FERGANİ Staj</span>;
      case 'akbank-genai':
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold tracking-wide bg-[#EC4899] text-white shadow-xs">Akbank Yapay Zeka</span>;
      case 'teknofest-gonullu':
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold tracking-wide bg-rose-600 text-white shadow-xs">🇹🇷 TEKNOFEST</span>;
      case 'girisimcilik-patent':
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold tracking-wide bg-[#F59E0B] text-slate-950 shadow-xs">💡 Patent & Girişim</span>;
      case 'burs-basvuru':
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold tracking-wide bg-amber-600 text-white shadow-xs">🎓 Burs Başvurusu</span>;
      case 'meta-yapay-zeka':
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold tracking-wide bg-blue-700 text-white shadow-xs">Meta Yapay Zeka</span>;
      case 'komut-muhendisligi':
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold tracking-wide bg-[#F59E0B] text-slate-950 shadow-xs">Prompt Mühendisliği</span>;
      case 'gelecegin-meslekleri':
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold tracking-wide bg-purple-600 text-white shadow-xs">Geleceğin Meslekleri</span>;
      case 'pupilica':
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold tracking-wide bg-sky-600 text-white shadow-xs">Pupilica</span>;
      case 'sergi-kultur':
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold tracking-wide bg-amber-700 text-white shadow-xs">Kültür & Sanat</span>;
      case 'kavcar-canli':
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold tracking-wide bg-red-700 text-white shadow-xs">Kavcar Canlı</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold tracking-wide bg-[#1E273D] text-white shadow-xs">Özel Etkinlik</span>;
    }
  };

  const googleWebUrl = buildGoogleCalendarUrl(event);
  const relTime = getRelativeTimeText(event.startDate);
  const deliverables = event.deliverables || [];

  return (
    <div className={`group relative bg-[#151B2B] rounded-2xl border transition-all duration-200 hover:shadow-xl text-[#F1F5F9] ${
      event.completed ? 'border-[#263047] bg-[#101522] opacity-75' : 'border-[#263047] hover:border-[#6366F1]'
    }`}>
      {/* Top Accent Color Bar */}
      <div 
        className="h-1.5 w-full rounded-t-2xl" 
        style={{ backgroundColor: event.color || '#6366F1' }}
      />

      <div className="p-5 sm:p-6 space-y-4">
        
        {/* Header Badges Matrix */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {getProgramBadge(event.program)}
            {getTypeBadge(event.type)}
            
            {event.trlLevel && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#6366F1]/15 text-[#818CF8] border border-[#6366F1]/30">
                <Layers className="w-3 h-3 text-[#6366F1]" /> TRL-{event.trlLevel}
              </span>
            )}

            {event.priority === 'critical' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#EC4899]/20 text-[#EC4899] border border-[#EC4899]/40">
                🚨 Kritik
              </span>
            )}

            {event.isMandatory && !event.priority && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40">
                <ShieldAlert className="w-3 h-3 text-[#F59E0B]" /> Zorunlu
              </span>
            )}

            {hasConflict && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-500 text-white animate-pulse shadow-sm">
                <AlertTriangle className="w-3 h-3" /> Saat Çakışması
              </span>
            )}

            {relTime.text && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${
                relTime.isToday
                  ? 'bg-[#EC4899] text-white animate-pulse'
                  : relTime.isSoon
                  ? 'bg-[#F59E0B] text-[#0B0F19]'
                  : relTime.isPast
                  ? 'bg-[#1E273D] text-[#94A3B8]'
                  : 'bg-[#6366F1]/20 text-[#818CF8] border border-[#6366F1]/30'
              }`}>
                {relTime.text}
              </span>
            )}
          </div>

          <button
            onClick={() => onToggleComplete(event.id)}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition cursor-pointer ${
              event.completed 
                ? 'bg-[#6366F1] text-white shadow-xs' 
                : 'bg-[#1E273D] text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#263047]'
            }`}
          >
            <CheckCircle className={`w-4 h-4 ${event.completed ? 'text-white fill-white/20' : 'text-[#94A3B8]'}`} />
            <span>{event.completed ? 'Tamamlandı' : 'Tamamla'}</span>
          </button>
        </div>

        {/* Title */}
        <h3 className={`text-lg sm:text-xl font-bold text-[#F1F5F9] leading-snug ${event.completed ? 'line-through text-[#64748B]' : ''}`}>
          {event.title}
        </h3>

        {/* Date & Time & Location */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-[#94A3B8]">
          <div className="flex items-center gap-1.5 font-semibold text-[#F1F5F9]">
            <Clock className="w-4 h-4 text-[#6366F1] shrink-0" />
            <span>{formatDateTR(event.startDate)}</span>
            {!event.allDay && (
              <span className="text-[#94A3B8] font-normal">
                ({formatTimeTR(event.startDate)} - {formatTimeTR(event.endDate)})
              </span>
            )}
            {event.allDay && (
              <span className="text-[11px] bg-[#1E273D] px-2 py-0.5 rounded-md text-[#94A3B8] font-semibold">Tüm Gün</span>
            )}
          </div>

          {(event.location || event.link) && (
            <div className="flex items-center gap-1.5 text-[#94A3B8]">
              <MapPin className="w-4 h-4 text-[#64748B] shrink-0" />
              {event.link ? (
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#818CF8] hover:text-[#A5B4FC] font-semibold underline flex items-center gap-1"
                >
                  <span>{event.location || 'Bağlantıyı Aç'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="font-medium text-[#F1F5F9]">{event.location}</span>
              )}
            </div>
          )}

          {/* Google Meet Quick Action Chip if Meet link exists */}
          {event.link && event.link.includes('meet.google.com') && (
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition cursor-pointer shadow-xs"
              title="Google Meet'e Katıl"
            >
              <Video className="w-3.5 h-3.5 text-emerald-400" />
              <span>Meet'e Katıl</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          {/* Zoom Quick Action Chip if Zoom link exists */}
          {event.link && event.link.includes('zoom.us') && (
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 transition cursor-pointer shadow-xs"
              title="Zoom Seminerine Katıl"
            >
              <Video className="w-3.5 h-3.5 text-blue-400" />
              <span>Zoom'a Katıl</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          {/* 10million.AI Quick Action Chip if 10million.ai link exists */}
          {event.link && event.link.includes('10million.ai') && (
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition cursor-pointer shadow-xs"
              title="10million.AI Eğitim Platformuna Giriş Yap"
            >
              <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
              <span>10million.AI Giriş</span>
            </a>
          )}

          {/* YouTube Live Quick Action Chip if YouTube link exists */}
          {event.link && (event.link.includes('youtube.com') || event.link.includes('youtu.be')) && (
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-red-600/25 hover:bg-red-600/35 text-red-300 border border-red-500/40 transition cursor-pointer shadow-xs"
              title="YouTube Canlı Yayınına Katıl"
            >
              <Video className="w-3.5 h-3.5 text-red-400" />
              <span>YouTube Canlı Yayın</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          {/* Reminder Selector */}
          <div className="flex items-center gap-1 text-xs bg-[#F59E0B]/15 border border-[#F59E0B]/30 text-[#F59E0B] px-2.5 py-1 rounded-xl">
            <Bell className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
            <span className="font-bold shrink-0">Hatırlatıcı:</span>
            <select
              value={event.reminderMinutes ?? 30}
              onChange={(e) => onUpdateReminder && onUpdateReminder(event.id, Number(e.target.value))}
              className="bg-[#151B2B] text-[#F59E0B] font-semibold cursor-pointer border border-[#F59E0B]/30 rounded px-1 text-xs focus:outline-none"
              title="Hatırlatıcı zamanı seçin"
            >
              <option value={1440}>1 Gün Önce</option>
              <option value={720}>12 Saat Önce</option>
              <option value={120}>2 Saat Önce</option>
              <option value={60}>1 Saat Önce</option>
              <option value={30}>30 Dakika Önce</option>
              <option value={15}>15 Dakika Önce</option>
              <option value={0}>Yok</option>
            </select>
          </div>
        </div>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {event.tags.map((t, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 text-[11px] font-semibold bg-[#1E273D] text-[#94A3B8] px-2.5 py-0.5 rounded-md border border-[#263047]">
                <Tag className="w-2.5 h-2.5 text-[#64748B]" />
                <span>{t}</span>
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        {event.description && (
          <p className="text-xs sm:text-sm text-[#94A3B8] whitespace-pre-line bg-[#0B0F19] p-3.5 rounded-xl border border-[#263047] leading-relaxed font-normal">
            {event.description}
          </p>
        )}

        {/* Deliverables / Evrak & Hazırlık Kontrol Listesi */}
        {deliverables.length > 0 && (
          <div className="p-3.5 bg-[#0B0F19] rounded-xl border border-[#263047] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#F1F5F9]">
              <span className="flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-[#6366F1]" />
                <span>Evrak & Hazırlık Maddeleri</span>
              </span>
              <span className="text-[11px] text-[#94A3B8] font-normal">
                {deliverables.filter(d => d.completed).length} / {deliverables.length} Tamamlandı
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {deliverables.map(del => (
                <button
                  key={del.id}
                  onClick={() => onUpdateDeliverable && onUpdateDeliverable(event.id, del.id, !del.completed)}
                  className={`p-2 rounded-lg border text-left text-xs font-medium transition flex items-center gap-2 cursor-pointer ${
                    del.completed 
                      ? 'bg-[#101522] text-[#64748B] border-[#263047] line-through opacity-75' 
                      : 'bg-[#151B2B] hover:bg-[#1E273D] text-[#F1F5F9] border-[#263047]'
                  }`}
                >
                  {del.completed ? (
                    <CheckSquare className="w-3.5 h-3.5 text-[#6366F1] shrink-0" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                  )}
                  <span className="truncate">{del.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-[#263047] flex flex-wrap items-center justify-between gap-3">
          
          {/* Sync status & Direct Sync */}
          <div className="flex items-center gap-2">
            {event.syncedToGoogle ? (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#6366F1]/20 text-[#818CF8] border border-[#6366F1]/40">
                  <CheckCircle className="w-3.5 h-3.5 text-[#6366F1]" /> Google Takvim'de
                </span>
                {user && (
                  <button
                    onClick={() => onRemoveFromGoogle(event)}
                    title="Google Takvim'den Çıkar"
                    className="text-xs text-[#94A3B8] hover:text-[#EC4899] underline cursor-pointer"
                  >
                    Kaldır
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => onSyncToGoogle(event)}
                disabled={isSyncingThisEvent}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-xs transition cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-white" />
                <span>{user ? "Google Takvim'e Ekle" : "Google'a Ekle (Giriş Yapın)"}</span>
              </button>
            )}
          </div>

          {/* Quick links, Edit & Actions */}
          <div className="flex items-center gap-2">
            <a
              href={googleWebUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Google Takvim Web Sayfasında Aç"
              className="p-2 text-[#94A3B8] hover:text-[#818CF8] hover:bg-[#1E273D] rounded-xl text-xs flex items-center gap-1 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-semibold">Web Takvim</span>
            </a>

            <button
              onClick={() => downloadICSFile([event], `${event.id}.ics`)}
              title="Takvim Dosyasını İndir (.ics)"
              className="p-2 text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1E273D] rounded-xl text-xs flex items-center gap-1 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-semibold">.ics</span>
            </button>

            <button
              onClick={() => onEdit(event)}
              title="Etkinliği Düzenle"
              className="p-2 text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1E273D] rounded-xl transition cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            <button
              onClick={() => onDelete(event)}
              title="Etkinliği Kaldır"
              className="p-2 text-[#94A3B8] hover:text-[#EC4899] hover:bg-rose-950/40 rounded-xl transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
