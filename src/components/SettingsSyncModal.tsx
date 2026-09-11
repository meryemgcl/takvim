import React, { useState } from 'react';
import { 
  X, Settings, Calendar, RefreshCw, Mail, Sparkles, Bell, 
  AlertTriangle, Download, Smartphone, CheckCircle2, Layers, 
  ExternalLink, FileSpreadsheet, ShieldAlert
} from 'lucide-react';
import { UserAuth } from '../types';

interface SettingsSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAuth | null;
  onLogin: () => void;
  onOpenBulkSyncModal: () => void;
  onOpenGmailModal: () => void;
  onOpenAiModal: () => void;
  onOpenNotificationModal: () => void;
  onOpenConflictModal: () => void;
  onDownloadAllICS: () => void;
  onDownloadCSV: () => void;
  canInstallPWA: boolean;
  onInstallPWA: () => void;
  totalEventsCount: number;
  syncedEventsCount: number;
  conflictCount: number;
  notificationPermission: string;
  onTestMorningBriefing?: () => void;
  isTestingBriefing?: boolean;
}

export const SettingsSyncModal: React.FC<SettingsSyncModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogin,
  onOpenBulkSyncModal,
  onOpenGmailModal,
  onOpenAiModal,
  onOpenNotificationModal,
  onOpenConflictModal,
  onDownloadAllICS,
  onDownloadCSV,
  canInstallPWA,
  onInstallPWA,
  totalEventsCount,
  syncedEventsCount,
  conflictCount,
  notificationPermission,
  onTestMorningBriefing,
  isTestingBriefing
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#151B2B] border border-[#263047] rounded-3xl w-full max-w-2xl text-[#F1F5F9] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#263047] flex items-center justify-between bg-[#101522]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#6366F1]/15 text-[#6366F1] flex items-center justify-center border border-[#6366F1]/30">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#F1F5F9]">Ayarlar & Senkronizasyon</h2>
              <p className="text-xs text-[#94A3B8]">Google Takvim, Bildirimler, 06:00 Sabah Raporu & Entegrasyon</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1E273D] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 scrollbar-thin">
          
          {/* 🌅 Sabah 06:00 Günlük Brifing Servisi Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1E1B4B]/70 to-[#0B0F19] border border-[#6366F1]/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#F59E0B]/20 text-[#F59E0B] flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F1F5F9] flex items-center gap-2">
                    <span>🌅 Her Sabah 06:00 Brifing Servisi</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30">
                      Cron: 0 6 * * *
                    </span>
                  </h3>
                </div>
              </div>
            </div>
            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              Her gün saat tam 06:00'da dünden kalan tamamlanmamış görevleri bugüne devreder, bugünün takvim ve görev programını derleyip Gmail kutunuza Cosmic Royal şablonuyla iletir.
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-3">
              {onTestMorningBriefing && (
                <button
                  onClick={() => {
                    onTestMorningBriefing();
                  }}
                  disabled={isTestingBriefing}
                  className="px-4 py-2 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#0B0F19] text-xs font-bold transition shadow-md shadow-[#F59E0B]/20 cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {isTestingBriefing ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Mail className="w-3.5 h-3.5" />
                  )}
                  <span>{isTestingBriefing ? 'Rapor Gönderiliyor...' : '📨 Sabah 06:00 Raporunu Test Et'}</span>
                </button>
              )}
              {user?.email && (
                <span className="text-[11px] text-[#94A3B8]">
                  Hedef: <strong className="text-[#F1F5F9]">{user.email}</strong>
                </span>
              )}
            </div>
          </div>

          {/* Google Sync Card */}
          <div className="p-4 rounded-2xl bg-[#0B0F19] border border-[#263047] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-[#6366F1]" />
                <span className="text-sm font-bold text-[#F1F5F9]">Google Takvim Senkronizasyonu</span>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#6366F1]/15 text-[#818CF8] border border-[#6366F1]/30">
                {syncedEventsCount} / {totalEventsCount} Senkronize
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Tüm staj, eğitim ve kariyer etkinliklerinizi tek tıkla resmi Google Takvim hesabınıza aktarın ve bildirimler alın.
            </p>
            <div className="pt-1 flex flex-wrap gap-2">
              <button
                onClick={() => { onClose(); onOpenBulkSyncModal(); }}
                className="px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold transition shadow-md shadow-[#6366F1]/20 cursor-pointer flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Toplu Takvime Aktar</span>
              </button>
            </div>
          </div>

          {/* Quick Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* AI Parse */}
            <button
              onClick={() => { onClose(); onOpenAiModal(); }}
              className="p-4 rounded-2xl bg-[#0B0F19] hover:bg-[#1E273D] border border-[#263047] hover:border-[#6366F1] text-left transition space-y-1.5 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-[#6366F1]/15 text-[#818CF8] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-[#6366F1] uppercase">Gemini AI</span>
              </div>
              <h4 className="text-xs font-bold text-[#F1F5F9] group-hover:text-[#6366F1] transition">Duyurudan Etkinlik Çözümle</h4>
              <p className="text-[11px] text-[#94A3B8] line-clamp-2">WhatsApp, Telegram veya PDF metinlerini yapay zeka ile otomatik ajandaya çevirin.</p>
            </button>

            {/* Gmail Scan */}
            <button
              onClick={() => { onClose(); onOpenGmailModal(); }}
              className="p-4 rounded-2xl bg-[#0B0F19] hover:bg-[#1E273D] border border-[#263047] hover:border-[#6366F1] text-left transition space-y-1.5 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-[#F59E0B]/15 text-[#F59E0B] flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-[#F59E0B] uppercase">Gmail API</span>
              </div>
              <h4 className="text-xs font-bold text-[#F1F5F9] group-hover:text-[#F59E0B] transition">Gmail ile Duyuru Tara</h4>
              <p className="text-[11px] text-[#94A3B8] line-clamp-2">Gelen kutunuzdaki kabul, mülakat ve duyuru e-postalarını tarayın.</p>
            </button>

            {/* Notifications */}
            <button
              onClick={() => { onClose(); onOpenNotificationModal(); }}
              className="p-4 rounded-2xl bg-[#0B0F19] hover:bg-[#1E273D] border border-[#263047] hover:border-[#6366F1] text-left transition space-y-1.5 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-[#EC4899]/15 text-[#EC4899] flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  notificationPermission === 'granted' ? 'bg-[#6366F1]/20 text-[#818CF8]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                }`}>
                  {notificationPermission === 'granted' ? 'Aktif' : 'Ayarla'}
                </span>
              </div>
              <h4 className="text-xs font-bold text-[#F1F5F9] group-hover:text-[#EC4899] transition">15 Dk Kala Hatırlatıcı</h4>
              <p className="text-[11px] text-[#94A3B8] line-clamp-2">Canlı oturumlar ve son teslimler başlamadan masaüstü uyarısı alın.</p>
            </button>

            {/* Conflicts */}
            <button
              onClick={() => { onClose(); onOpenConflictModal(); }}
              className="p-4 rounded-2xl bg-[#0B0F19] hover:bg-[#1E273D] border border-[#263047] hover:border-[#6366F1] text-left transition space-y-1.5 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-[#F59E0B]/15 text-[#F59E0B] flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                {conflictCount > 0 ? (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F59E0B] text-[#0B0F19]">
                    {conflictCount} Çakışma
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-[#94A3B8]">0 Çakışma</span>
                )}
              </div>
              <h4 className="text-xs font-bold text-[#F1F5F9] group-hover:text-[#F59E0B] transition">Çakışma Kontrolü</h4>
              <p className="text-[11px] text-[#94A3B8] line-clamp-2">Aynı saat diliminde çakışan canlı oturum ve dersleri inceleyin.</p>
            </button>

          </div>

          {/* Export & PWA Section */}
          <div className="p-4 rounded-2xl bg-[#0B0F19] border border-[#263047] space-y-3">
            <h4 className="text-xs font-bold text-[#F1F5F9]">Dışa Aktarma & Mobil Yükleme</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={onDownloadAllICS}
                className="px-3.5 py-2 rounded-xl bg-[#1E273D] hover:bg-[#263047] text-[#F1F5F9] text-xs font-medium border border-[#263047] transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#6366F1]" />
                <span>Tümünü .ICS İndir (Apple/Outlook)</span>
              </button>

              <button
                onClick={onDownloadCSV}
                className="px-3.5 py-2 rounded-xl bg-[#1E273D] hover:bg-[#263047] text-[#F1F5F9] text-xs font-medium border border-[#263047] transition flex items-center gap-1.5 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Excel / CSV İndir</span>
              </button>

              <a
                href="/inovasyon_etkinlik_ajandasi_detayli_rapor.pdf"
                download="inovasyon_etkinlik_ajandasi_detayli_rapor.pdf"
                className="px-3.5 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-bold border border-rose-500/40 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-rose-400" />
                <span>Resmi Proje Dokümantasyonu (PDF)</span>
              </a>

              {canInstallPWA && (
                <button
                  onClick={onInstallPWA}
                  className="px-3.5 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Uygulamayı Cihaza Yükle</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#263047] bg-[#101522] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1E273D] hover:bg-[#263047] text-[#F1F5F9] text-xs font-bold transition cursor-pointer"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
