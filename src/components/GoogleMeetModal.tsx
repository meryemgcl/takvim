import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Video,
  VideoOff,
  Plus,
  Calendar,
  Clock,
  Copy,
  Check,
  ExternalLink,
  Mail,
  Trash2,
  Users,
  Shield,
  Sparkles,
  X,
  Share2,
  ArrowRight,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { UserAuth, CalendarEvent, SavedGoogleMeeting } from '../types';
import {
  createGoogleMeetSpace,
  getMeetingHistory,
  saveMeetingToHistory,
  removeMeetingFromHistory,
  generateMeetingInviteText,
  endGoogleMeetConference
} from '../lib/googleMeetService';

interface GoogleMeetModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAuth | null;
  onAddEventToCalendar?: (event: CalendarEvent) => void;
  onOpenGmailCompose?: (to: string, subject: string, body: string) => void;
  onShowToast: (msg: string) => void;
}

type MeetTab = 'instant' | 'schedule' | 'join' | 'history';

export const GoogleMeetModal: React.FC<GoogleMeetModalProps> = ({
  isOpen,
  onClose,
  user,
  onAddEventToCalendar,
  onOpenGmailCompose,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<MeetTab>('instant');
  const [loading, setLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);

  // Anında toplantı durumu
  const [activeInstantMeeting, setActiveInstantMeeting] = useState<SavedGoogleMeeting | null>(null);
  const [accessType, setAccessType] = useState<'OPEN' | 'TRUSTED' | 'RESTRICTED'>('OPEN');

  // Planlama formu
  const [scheduleTitle, setScheduleTitle] = useState('');
  const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().split('T')[0]);
  const [scheduleTime, setScheduleTime] = useState('14:00');
  const [scheduleDuration, setScheduleDuration] = useState('45');
  const [scheduleCategory, setScheduleCategory] = useState('tubitak-yarisma');
  const [scheduleAttendees, setScheduleAttendees] = useState('');
  const [scheduleDescription, setScheduleDescription] = useState('');

  // Koda göre katıl
  const [joinCodeInput, setJoinCodeInput] = useState('');

  // Toplantı geçmişi
  const [history, setHistory] = useState<SavedGoogleMeeting[]>([]);

  // Silme Onay Modal Durumu
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setHistory(getMeetingHistory());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Anında Toplantı Başlat
  const handleStartInstantMeeting = async () => {
    setLoading(true);
    try {
      const space = await createGoogleMeetSpace(user?.accessToken || '', { accessType });
      const newMeeting: SavedGoogleMeeting = {
        id: `meet-${Date.now()}`,
        title: `Anında Toplantı (${new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })})`,
        meetingUri: space.meetingUri,
        meetingCode: space.meetingCode,
        spaceName: space.name,
        createdAt: new Date().toISOString(),
        category: 'meeting'
      };

      saveMeetingToHistory(newMeeting);
      setActiveInstantMeeting(newMeeting);
      setHistory(getMeetingHistory());
      onShowToast('🎉 Google Meet toplantı odası hazır!');
    } catch (err: any) {
      console.error('Instant meeting error:', err);
      onShowToast('❌ Toplantı odası oluşturulamadı: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toplantı Planla
  const handleScheduleMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleTitle.trim()) {
      onShowToast('Lütfen toplantı başlığı girin.');
      return;
    }

    setLoading(true);
    try {
      const space = await createGoogleMeetSpace(user?.accessToken || '', { accessType: 'OPEN' });
      const attendeesList = scheduleAttendees
        .split(',')
        .map(a => a.trim())
        .filter(a => a.length > 0);

      const startDateTime = `${scheduleDate}T${scheduleTime}`;
      // End date time hesapla
      const startObj = new Date(startDateTime);
      const endObj = new Date(startObj.getTime() + parseInt(scheduleDuration, 10) * 60000);
      const endDateTime = endObj.toISOString().slice(0, 16);

      const meetingId = `meet-${Date.now()}`;
      const newMeeting: SavedGoogleMeeting = {
        id: meetingId,
        title: scheduleTitle.trim(),
        description: scheduleDescription.trim(),
        meetingUri: space.meetingUri,
        meetingCode: space.meetingCode,
        spaceName: space.name,
        createdAt: new Date().toISOString(),
        scheduledDate: scheduleDate,
        scheduledTime: scheduleTime,
        category: scheduleCategory,
        attendees: attendeesList
      };

      saveMeetingToHistory(newMeeting);
      setHistory(getMeetingHistory());

      // Takvime de ekle
      if (onAddEventToCalendar) {
        const calEvent: CalendarEvent = {
          id: `cal-${Date.now()}`,
          title: `🎥 [Meet] ${scheduleTitle.trim()}`,
          description: `${scheduleDescription.trim()}\n\nGoogle Meet Linki: ${space.meetingUri}\nToplantı Kodu: ${space.meetingCode}`,
          startDate: startDateTime,
          endDate: endDateTime,
          type: 'meeting',
          program: (scheduleCategory as any) || 'tubitak-yarisma',
          location: `Google Meet (${space.meetingCode})`,
          link: space.meetingUri,
          color: '#0284c7',
          reminderMinutes: 15,
          priority: 'high'
        };
        onAddEventToCalendar(calEvent);
      }

      onShowToast('✅ Toplantı planlandı ve takvime Google Meet linkiyle eklendi!');
      setActiveInstantMeeting(newMeeting);
      setActiveTab('instant');
      // Reset form
      setScheduleTitle('');
      setScheduleDescription('');
      setScheduleAttendees('');
    } catch (err: any) {
      console.error('Schedule meeting error:', err);
      onShowToast('❌ Toplantı planlanamadı: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Koda göre katıl
  const handleJoinByCode = () => {
    if (!joinCodeInput.trim()) return;
    let url = joinCodeInput.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      const cleanCode = url.replace(/[^a-zA-Z0-9-]/g, '');
      url = `https://meet.google.com/${cleanCode}`;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Davet Metnini Panoya Kopyala
  const handleCopyInvite = (meeting: SavedGoogleMeeting) => {
    const inviteText = generateMeetingInviteText({
      title: meeting.title,
      meetingUri: meeting.meetingUri,
      meetingCode: meeting.meetingCode,
      scheduledDate: meeting.scheduledDate,
      scheduledTime: meeting.scheduledTime,
      description: meeting.description
    });
    navigator.clipboard.writeText(inviteText);
    setCopiedInvite(true);
    onShowToast('📋 Toplantı davet metni kopyalandı!');
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  // Sadece Linki Kopyala
  const handleCopyLinkOnly = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    onShowToast('🔗 Meet linki panoya kopyalandı!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Gmail ile Paylaş
  const handleShareViaGmail = (meeting: SavedGoogleMeeting) => {
    const inviteText = generateMeetingInviteText({
      title: meeting.title,
      meetingUri: meeting.meetingUri,
      meetingCode: meeting.meetingCode,
      scheduledDate: meeting.scheduledDate,
      scheduledTime: meeting.scheduledTime,
      description: meeting.description
    });
    const to = meeting.attendees ? meeting.attendees.join(', ') : '';
    const subject = `Toplantı Daveti: ${meeting.title}`;

    if (onOpenGmailCompose) {
      onOpenGmailCompose(to, subject, inviteText);
      onClose();
    } else {
      // Fallback mailto
      const mailtoUrl = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(inviteText)}`;
      window.open(mailtoUrl, '_blank');
    }
  };

  // Toplantıyı Geçmişten Silme Onayı
  const handleDeleteMeeting = (id: string) => {
    removeMeetingFromHistory(id);
    setHistory(getMeetingHistory());
    if (activeInstantMeeting?.id === id) {
      setActiveInstantMeeting(null);
    }
    setConfirmDeleteId(null);
    onShowToast('🗑️ Toplantı kaydı silindi.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-2xl bg-[#0F1420] border border-[#263047] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative text-[#F1F5F9] max-h-[90vh]"
      >
        {/* Üst Başlık Barı */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E273D] bg-[#151B2B]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00AC47] via-[#00832D] to-[#006622] flex items-center justify-center text-white shadow-lg shadow-emerald-900/40">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Google Meet Toplantı Merkezi</h2>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Resmi API
                </span>
              </div>
              <p className="text-xs text-[#94A3B8]">
                Anında video görüşme başlatın, toplantı planlayın ve takviminizle bağlayın
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#1E273D] text-[#94A3B8] hover:text-white flex items-center justify-center hover:bg-[#263047] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigasyonu */}
        <div className="flex border-b border-[#1E273D] bg-[#111726] px-4 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('instant')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'instant'
                ? 'bg-[#151B2B] text-emerald-400 border-emerald-500'
                : 'text-[#94A3B8] hover:text-white border-transparent hover:bg-[#1E273D]/50'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Anında Toplantı</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'schedule'
                ? 'bg-[#151B2B] text-emerald-400 border-emerald-500'
                : 'text-[#94A3B8] hover:text-white border-transparent hover:bg-[#1E273D]/50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Toplantı Planla</span>
          </button>

          <button
            onClick={() => setActiveTab('join')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'join'
                ? 'bg-[#151B2B] text-emerald-400 border-emerald-500'
                : 'text-[#94A3B8] hover:text-white border-transparent hover:bg-[#1E273D]/50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Koda Göre Katıl</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition flex items-center gap-2 cursor-pointer border-b-2 ml-auto ${
              activeTab === 'history'
                ? 'bg-[#151B2B] text-emerald-400 border-emerald-500'
                : 'text-[#94A3B8] hover:text-white border-transparent hover:bg-[#1E273D]/50'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Geçmiş ({history.length})</span>
          </button>
        </div>

        {/* Tab İçerikleri */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] scrollbar-thin">
          {/* TAB 1: Anında Toplantı */}
          {activeTab === 'instant' && (
            <div className="space-y-6">
              {!activeInstantMeeting ? (
                <div className="flex flex-col items-center justify-center text-center py-8">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#00AC47] to-[#006622] flex items-center justify-center text-white shadow-2xl shadow-emerald-500/30 mb-4 animate-pulse">
                    <Video className="w-10 h-10" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">Hemen Yeni Bir Google Meet Başlatın</h3>
                  <p className="text-xs text-[#94A3B8] max-w-md mb-6 leading-relaxed">
                    Tek bir tıkla güvenli ve benzersiz bir Google Meet odası oluşturun. Linki katılımcılarla paylaşın veya hemen odaya katılın.
                  </p>

                  <div className="w-full max-w-sm bg-[#151B2B] border border-[#263047] rounded-2xl p-4 mb-6 text-left">
                    <label className="text-[11px] font-semibold text-[#94A3B8] block mb-2">
                      Oda Erişim Güvenliği
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setAccessType('OPEN')}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          accessType === 'OPEN'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                            : 'bg-[#0F1420] text-[#94A3B8] border-[#263047]'
                        }`}
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>Açık (Herkes)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAccessType('RESTRICTED')}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          accessType === 'RESTRICTED'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                            : 'bg-[#0F1420] text-[#94A3B8] border-[#263047]'
                        }`}
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>İzinli (Onaylı)</span>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleStartInstantMeeting}
                    disabled={loading}
                    className="px-8 py-3.5 bg-gradient-to-r from-[#00AC47] to-[#00832D] hover:from-[#00963E] hover:to-[#007026] text-white rounded-2xl text-sm font-bold shadow-xl shadow-emerald-600/30 flex items-center gap-2.5 transition transform hover:scale-[1.02] cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Google Meet Alanı Oluşturuluyor...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Anında Toplantı Başlat 🚀</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* Aktif / Oluşturulan Toplantı Kartı */
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-gradient-to-br from-[#151B2B] to-[#12221A] border-2 border-emerald-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 inline-flex items-center gap-1.5 mb-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                          Toplantı Alanı Aktif
                        </span>
                        <h3 className="text-lg font-bold text-white">{activeInstantMeeting.title}</h3>
                      </div>

                      <button
                        onClick={handleStartInstantMeeting}
                        disabled={loading}
                        className="px-3 py-1.5 bg-[#1E273D] hover:bg-[#263047] text-[#94A3B8] hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                        title="Yeni Oda Üret"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        <span>Yenisini Aç</span>
                      </button>
                    </div>

                    {/* Link ve Kod Gösterimi */}
                    <div className="bg-[#0B0F19]/90 border border-emerald-500/30 rounded-2xl p-4 mb-5 space-y-3">
                      <div>
                        <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider block mb-1">
                          Google Meet Bağlantısı
                        </span>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={activeInstantMeeting.meetingUri}
                            className="flex-1 bg-[#151B2B] border border-[#263047] rounded-xl px-3 py-2 text-xs font-mono text-emerald-300 focus:outline-none"
                          />
                          <button
                            onClick={() => handleCopyLinkOnly(activeInstantMeeting.meetingUri)}
                            className="px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                            title="Linki Kopyala"
                          >
                            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedLink ? 'Kopyalandı' : 'Kopyala'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-[#94A3B8] pt-2 border-t border-[#1E273D]">
                        <div>
                          <span>Toplantı Kodu: </span>
                          <span className="font-mono font-bold text-white bg-[#1E273D] px-2 py-0.5 rounded-md border border-[#263047]">
                            {activeInstantMeeting.meetingCode}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Eylem Butonları */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <a
                        href={activeInstantMeeting.meetingUri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="col-span-1 sm:col-span-3 py-3 bg-gradient-to-r from-[#00AC47] to-[#00832D] hover:from-[#00963E] hover:to-[#007026] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition transform hover:scale-[1.01] cursor-pointer"
                      >
                        <Video className="w-4 h-4" />
                        <span>Google Meet'e Katıl (Aç)</span>
                        <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-75" />
                      </a>

                      <button
                        onClick={() => handleCopyInvite(activeInstantMeeting)}
                        className="py-2.5 px-3 bg-[#1E273D] hover:bg-[#263047] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer border border-[#263047]"
                      >
                        {copiedInvite ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                        <span>{copiedInvite ? 'Davet Kopyalandı' : 'Davet Metnini Kopyala'}</span>
                      </button>

                      <button
                        onClick={() => handleShareViaGmail(activeInstantMeeting)}
                        className="py-2.5 px-3 bg-[#1E273D] hover:bg-[#263047] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer border border-[#263047]"
                      >
                        <Mail className="w-3.5 h-3.5 text-red-400" />
                        <span>Gmail ile Paylaş</span>
                      </button>

                      <button
                        onClick={() => {
                          if (onAddEventToCalendar) {
                            const calEvent: CalendarEvent = {
                              id: `cal-${Date.now()}`,
                              title: `🎥 ${activeInstantMeeting.title}`,
                              description: `Google Meet Toplantısı\n\nLink: ${activeInstantMeeting.meetingUri}\nKod: ${activeInstantMeeting.meetingCode}`,
                              startDate: new Date().toISOString().slice(0, 16),
                              endDate: new Date(Date.now() + 45 * 60000).toISOString().slice(0, 16),
                              type: 'meeting',
                              program: 'tubitak-yarisma',
                              location: `Google Meet (${activeInstantMeeting.meetingCode})`,
                              link: activeInstantMeeting.meetingUri,
                              color: '#0284c7',
                              reminderMinutes: 15
                            };
                            onAddEventToCalendar(calEvent);
                            onShowToast('✅ Takvime kaydedildi!');
                          }
                        }}
                        className="py-2.5 px-3 bg-[#1E273D] hover:bg-[#263047] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer border border-[#263047]"
                      >
                        <Calendar className="w-3.5 h-3.5 text-[#6366F1]" />
                        <span>Takvime Ekle</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Toplantı Planla */}
          {activeTab === 'schedule' && (
            <form onSubmit={handleScheduleMeeting} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1.5">
                  Toplantı / Görüşme Başlığı *
                </label>
                <input
                  type="text"
                  required
                  value={scheduleTitle}
                  onChange={(e) => setScheduleTitle(e.target.value)}
                  placeholder="Örn: TÜBİTAK 2209 Mentorluk Değerlendirmesi"
                  className="w-full bg-[#151B2B] border border-[#263047] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1.5">
                    Tarih *
                  </label>
                  <input
                    type="date"
                    required
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full bg-[#151B2B] border border-[#263047] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1.5">
                    Saat *
                  </label>
                  <input
                    type="time"
                    required
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full bg-[#151B2B] border border-[#263047] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1.5">
                    Süre
                  </label>
                  <select
                    value={scheduleDuration}
                    onChange={(e) => setScheduleDuration(e.target.value)}
                    className="w-full bg-[#151B2B] border border-[#263047] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="15">15 Dakika</option>
                    <option value="30">30 Dakika</option>
                    <option value="45">45 Dakika</option>
                    <option value="60">1 Saat</option>
                    <option value="90">1.5 Saat</option>
                    <option value="120">2 Saat</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1.5">
                    Kategori / Program
                  </label>
                  <select
                    value={scheduleCategory}
                    onChange={(e) => setScheduleCategory(e.target.value)}
                    className="w-full bg-[#151B2B] border border-[#263047] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="tubitak-yarisma">🏆 TÜBİTAK & Projeler</option>
                    <option value="kariyer-yetenek">💼 Kariyer & Akbank/Cezeri</option>
                    <option value="pythiango-ai-masterclass">🤖 Yapay Zeka & Eğitim</option>
                    <option value="cop31-gonullu">🌍 COP31 / Gönüllülük</option>
                    <option value="custom">📌 Kişisel / Diğer</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1.5">
                    Katılımcı E-postaları (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    value={scheduleAttendees}
                    onChange={(e) => setScheduleAttendees(e.target.value)}
                    placeholder="ahmet@example.com, mehmet@example.com"
                    className="w-full bg-[#151B2B] border border-[#263047] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1.5">
                  Toplantı Gündemi / Notlar
                </label>
                <textarea
                  rows={3}
                  value={scheduleDescription}
                  onChange={(e) => setScheduleDescription(e.target.value)}
                  placeholder="Toplantıda görüşülecek maddeler, hazırlık notları..."
                  className="w-full bg-[#151B2B] border border-[#263047] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-3 bg-[#151B2B] border border-[#263047] rounded-xl text-xs text-[#94A3B8] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Kaydettiğinizde otomatik olarak benzersiz bir Google Meet odası tahsis edilir ve takviminize 15 dk hatırlatıcı ile yerleştirilir.
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('instant')}
                  className="px-4 py-2.5 bg-[#1E273D] hover:bg-[#263047] text-[#94A3B8] rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#00AC47] to-[#00832D] hover:from-[#00963E] hover:to-[#007026] text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
                  <span>Google Meet'i Planla ve Takvime Ekle 🚀</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: Koda Göre Katıl */}
          {activeTab === 'join' && (
            <div className="py-6 flex flex-col items-center text-center max-w-md mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white">Toplantı Kodunu veya Linkini Girin</h3>
              <p className="text-xs text-[#94A3B8]">
                Size iletilen Google Meet kodunu (örn. <code className="text-emerald-400">abc-defg-hij</code>) veya doğrudan bağlantıyı yapıştırın.
              </p>

              <div className="w-full flex items-center gap-2 pt-2">
                <input
                  type="text"
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleJoinByCode();
                  }}
                  placeholder="abc-defg-hij veya https://meet.google.com/..."
                  className="flex-1 bg-[#151B2B] border border-[#263047] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleJoinByCode}
                  disabled={!joinCodeInput.trim()}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#00AC47] to-[#00832D] hover:from-[#00963E] text-white rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-40 flex items-center gap-1.5"
                >
                  <span>Katıl</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: Toplantı Geçmişi */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              {history.length === 0 ? (
                <div className="text-center py-12 text-[#94A3B8]">
                  <VideoOff className="w-12 h-12 mx-auto text-[#64748B] mb-2 opacity-50" />
                  <p className="text-sm font-semibold text-[#CBD5E1]">Henüz kayıtlı toplantı yok</p>
                  <p className="text-xs text-[#64748B] mt-1">
                    Burada oluşturduğunuz tüm anlık ve planlı Google Meet oturumları listelenir.
                  </p>
                </div>
              ) : (
                history.map((m) => (
                  <div
                    key={m.id}
                    className="bg-[#151B2B] border border-[#263047] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-500/40 transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <h4 className="text-sm font-bold text-white">{m.title}</h4>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#94A3B8]">
                        <span className="font-mono text-emerald-400 font-semibold">{m.meetingCode}</span>
                        {m.scheduledDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#6366F1]" />
                            {m.scheduledDate} {m.scheduledTime || ''}
                          </span>
                        )}
                        <span>{new Date(m.createdAt).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={m.meetingUri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                        title="Toplantıyı Aç"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Katıl</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <button
                        onClick={() => handleCopyInvite(m)}
                        className="p-2 bg-[#1E273D] hover:bg-[#263047] text-[#CBD5E1] hover:text-white rounded-xl text-xs transition cursor-pointer border border-[#263047]"
                        title="Daveti Kopyala"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleShareViaGmail(m)}
                        className="p-2 bg-[#1E273D] hover:bg-[#263047] text-red-400 hover:text-red-300 rounded-xl text-xs transition cursor-pointer border border-[#263047]"
                        title="Gmail ile Gönder"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setConfirmDeleteId(m.id)}
                        className="p-2 bg-[#1E273D] hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 rounded-xl text-xs transition cursor-pointer border border-[#263047]"
                        title="Geçmişten Kaldır"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Silme Onay Modalı */}
        <AnimatePresence>
          {confirmDeleteId && (
            <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#151B2B] border border-rose-500/40 rounded-2xl p-5 max-w-sm w-full text-center space-y-3 shadow-2xl"
              >
                <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Toplantı Kaydı Silinsin mi?</h4>
                <p className="text-xs text-[#94A3B8]">
                  Bu toplantı odası kaydı geçmiş listesinden kaldırılacaktır. Devam etmek istiyor musunuz?
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    className="flex-1 py-2 bg-[#1E273D] hover:bg-[#263047] text-[#CBD5E1] rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Vazgeç
                  </button>
                  <button
                    onClick={() => handleDeleteMeeting(confirmDeleteId)}
                    className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-lg shadow-rose-900/40"
                  >
                    Evet, Sil
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
