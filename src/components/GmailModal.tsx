import React, { useState, useEffect } from 'react';
import { Mail, RefreshCw, Send, CheckCircle2, AlertCircle, Search, X, ShieldAlert, Sparkles, Calendar } from 'lucide-react';
import { UserAuth, CalendarEvent } from '../types';
import { searchAkbankEmails, sendEmailReminder, GmailMessageSummary } from '../lib/gmailService';

interface GmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAuth | null;
  onGoogleLogin: () => void;
  events: CalendarEvent[];
}

export const GmailModal: React.FC<GmailModalProps> = ({
  isOpen,
  onClose,
  user,
  onGoogleLogin,
  events = []
}) => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'send'>('inbox');
  
  // Inbox search state
  const [searchQuery, setSearchQuery] = useState('Akbank');
  const [emails, setEmails] = useState<GmailMessageSummary[]>([]);
  const [isLoadingEmails, setIsLoadingEmails] = useState(false);
  const [inboxError, setInboxError] = useState<string | null>(null);

  // Send email state
  const [recipient, setRecipient] = useState(user?.email || '');
  const [subject, setSubject] = useState('Akbank Yapay Zeka Eğitimi Etkinlik Programı ve Hatırlatmaları');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccessMessage, setSendSuccessMessage] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [confirmSendOpen, setConfirmSendOpen] = useState(false);

  const isAuthenticated = Boolean(user?.accessToken);

  useEffect(() => {
    if (user?.email && !recipient) {
      setRecipient(user.email);
    }
  }, [user?.email]);

  useEffect(() => {
    if (isOpen && isAuthenticated && user?.accessToken && activeTab === 'inbox') {
      handleSearch();
    }
  }, [isOpen, isAuthenticated, activeTab]);

  if (!isOpen) return null;

  const handleSearch = async () => {
    if (!user?.accessToken) return;
    setIsLoadingEmails(true);
    setInboxError(null);
    try {
      const results = await searchAkbankEmails(user.accessToken, searchQuery);
      setEmails(results);
    } catch (err: any) {
      setInboxError(err.message || 'E-postalar yüklenirken bir hata oluştu.');
    } finally {
      setIsLoadingEmails(false);
    }
  };

  const generateEmailBody = () => {
    const akbankEvents = (events || []).filter(e => e.program === 'akbank-genai');
    const eventsToUse = akbankEvents.length > 0 ? akbankEvents : (events || []).slice(0, 10);

    let body = `Merhaba,\n\nTakvim ve Eğitim Etkinlik Programı detayları aşağıdadır:\n\n`;
    
    eventsToUse.forEach((evt, idx) => {
      const dateStr = new Date(evt.startDate).toLocaleString('tr-TR', {
        dateStyle: 'full',
        timeStyle: 'short'
      });
      const remText = evt.reminderMinutes === 1440 ? '1 Gün Önce' :
                      evt.reminderMinutes === 120 ? '2 Saat Önce' :
                      evt.reminderMinutes === 60 ? '1 Saat Önce' :
                      evt.reminderMinutes ? `${evt.reminderMinutes} Dk Önce` : 'Yok';

      body += `${idx + 1}. ${evt.title}\n`;
      body += `    Tarih: ${dateStr}\n`;
      body += `    Program: ${evt.program || 'Genel'}\n`;
      body += `    Tip: ${evt.type === 'webinar' ? 'Webinar' : evt.type === 'meeting' ? 'Oturum/Toplantı' : 'Eğitim / Teslimat'}\n`;
      if (evt.link) body += `    Katılım Linki: ${evt.link}\n`;
      body += `    Hatırlatıcı Ayarı: ${remText}\n\n`;
    });

    body += `İyi çalışmalar ve başarılar dileriz!`;
    return body;
  };

  const executeSendEmail = async () => {
    if (!user?.accessToken) {
      setSendError('Gmail ile e-posta göndermek için lütfen Google hesabınızla giriş yapın.');
      return;
    }
    if (!recipient.trim()) {
      setSendError('Lütfen geçerli bir alıcı e-posta adresi yazın.');
      return;
    }

    setIsSending(true);
    setSendError(null);
    setSendSuccessMessage(null);

    try {
      const bodyText = generateEmailBody();
      await sendEmailReminder(user.accessToken, recipient, subject, bodyText);
      setSendSuccessMessage(`E-posta başarıyla ${recipient} adresine gönderildi! 🚀`);
      setConfirmSendOpen(false);
    } catch (err: any) {
      setSendError(err.message || 'E-posta gönderilemedi.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0F19]/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#151B2B] rounded-3xl shadow-2xl border border-[#263047] max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Gmail Asistanı & Gelen Kutusu</h2>
              <p className="text-xs text-rose-100 font-normal">Gelen kutunuzu inceleyin veya takvim programını e-posta ile kendinize iletin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth status banner */}
        {!isAuthenticated && (
          <div className="bg-[#F59E0B]/10 p-4 border-b border-[#F59E0B]/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[#FBBF24] text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Gmail kutunuza erişmek veya e-posta göndermek için lütfen Google hesabınızla giriş yapın.</span>
            </div>
            <button
              onClick={onGoogleLogin}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-xl shadow-sm transition shrink-0 cursor-pointer"
            >
              Google ile Giriş Yap
            </button>
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex border-b border-[#263047] bg-[#0B0F19]/50">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`flex-1 py-3 px-4 text-xs font-semibold flex items-center justify-center gap-2 transition border-b-2 cursor-pointer ${
              activeTab === 'inbox'
                ? 'border-red-500 text-red-400 bg-[#151B2B] font-bold'
                : 'border-transparent text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
          >
            <Search className="w-4 h-4" />
            Gelen Kutusu Araması
          </button>
          <button
            onClick={() => setActiveTab('send')}
            className={`flex-1 py-3 px-4 text-xs font-semibold flex items-center justify-center gap-2 transition border-b-2 cursor-pointer ${
              activeTab === 'send'
                ? 'border-red-500 text-red-400 bg-[#151B2B] font-bold'
                : 'border-transparent text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
          >
            <Send className="w-4 h-4" />
            Programı E-Posta Olarak Gönder
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'inbox' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder="Aranacak kelime (ör. Akbank, Yapay Zeka, TÜBİTAK, Sınav)"
                  className="flex-1 px-3.5 py-2.5 bg-[#0B0F19] border border-[#263047] rounded-xl text-xs text-[#F1F5F9] focus:border-red-500 focus:outline-none placeholder-[#64748B]"
                />
                <button
                  onClick={handleSearch}
                  disabled={isLoadingEmails || !isAuthenticated}
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingEmails ? 'animate-spin' : ''}`} />
                  Ara
                </button>
              </div>

              {inboxError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{inboxError}</span>
                </div>
              )}

              {isLoadingEmails ? (
                <div className="py-12 text-center space-y-2">
                  <RefreshCw className="w-6 h-6 text-red-400 animate-spin mx-auto" />
                  <p className="text-xs text-[#94A3B8] font-normal">Gelen kutunuz taranıyor, lütfen bekleyin...</p>
                </div>
              ) : emails.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-[#94A3B8]">Bulunan E-postalar ({emails.length})</p>
                  <div className="divide-y divide-[#263047] border border-[#263047] rounded-2xl overflow-hidden bg-[#0B0F19]">
                    {emails.map(msg => (
                      <div key={msg.id} className="p-3.5 hover:bg-[#1E273D]/50 transition">
                        <div className="flex items-center justify-between text-[11px] text-[#94A3B8] mb-1">
                          <span className="font-semibold text-[#F1F5F9] truncate max-w-[280px]">{msg.from}</span>
                          <span>{msg.date ? new Date(msg.date).toLocaleDateString('tr-TR') : ''}</span>
                        </div>
                        <h4 className="text-xs font-semibold text-[#F1F5F9] mb-1">{msg.subject}</h4>
                        <p className="text-xs text-[#94A3B8] line-clamp-2 font-normal leading-relaxed">{msg.snippet}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center text-[#64748B] bg-[#0B0F19]/60 rounded-2xl border border-dashed border-[#263047]">
                  <Mail className="w-8 h-8 mx-auto mb-2 opacity-50 text-[#64748B]" />
                  <p className="text-xs font-medium text-[#94A3B8]">Henüz eşleşen bir e-posta bulunamadı.</p>
                  <p className="text-[11px] text-[#64748B] mt-1">
                    {!isAuthenticated 
                      ? 'E-postalarınızı görebilmek için Google hesabınızla giriş yapabilirsiniz.' 
                      : 'Farklı bir arama terimi deneyebilirsiniz.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'send' && (
            <div className="space-y-4">
              {sendSuccessMessage && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{sendSuccessMessage}</span>
                </div>
              )}

              {sendError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{sendError}</span>
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#CBD5E1] mb-1">Alıcı E-posta Adresi</label>
                  <input
                    type="email"
                    value={recipient}
                    onChange={e => setRecipient(e.target.value)}
                    placeholder="ornek@domain.com"
                    className="w-full px-3.5 py-2.5 bg-[#0B0F19] border border-[#263047] rounded-xl text-xs text-[#F1F5F9] focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#CBD5E1] mb-1">E-posta Konusu</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0B0F19] border border-[#263047] rounded-xl text-xs text-[#F1F5F9] focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#CBD5E1] mb-1">İçerik Önizlemesi</label>
                  <textarea
                    readOnly
                    value={generateEmailBody()}
                    rows={7}
                    className="w-full p-3.5 bg-[#0B0F19] border border-[#263047] rounded-xl text-xs text-[#CBD5E1] leading-relaxed font-mono"
                  />
                </div>
              </div>

              {!confirmSendOpen ? (
                <button
                  onClick={() => setConfirmSendOpen(true)}
                  disabled={!isAuthenticated || !recipient.trim()}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  E-postayı Gönder
                </button>
              ) : (
                /* User Confirmation Box */
                <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-2xl space-y-3 animate-fade-in text-xs">
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-red-200">Gönderim Onayı</h4>
                      <p className="text-red-300 mt-1 font-normal leading-relaxed">
                        <strong>{recipient}</strong> adresine takvim programı detayları gönderilecektir. Onaylıyor musunuz?
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-red-500/20">
                    <button
                      onClick={() => setConfirmSendOpen(false)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-[#CBD5E1] bg-[#151B2B] border border-[#263047] hover:bg-[#1E273D] rounded-xl cursor-pointer"
                    >
                      Vazgeç
                    </button>
                    <button
                      onClick={executeSendEmail}
                      disabled={isSending}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 disabled:opacity-50 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      {isSending && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                      Evet, Gönder
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0B0F19] border-t border-[#263047] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1E273D] hover:bg-[#263047] text-[#F1F5F9] text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
