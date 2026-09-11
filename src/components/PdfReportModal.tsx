import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  ExternalLink, 
  X, 
  CheckCircle2, 
  Calendar, 
  Cpu, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  Layers
} from 'lucide-react';

interface PdfReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PdfReportModal: React.FC<PdfReportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'todo' | 'programs' | 'architecture'>('overview');
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPdf = () => {
    setIsDownloading(true);
    const link = document.createElement('a');
    link.href = '/inovasyon_etkinlik_ajandasi_detayli_rapor.pdf';
    link.download = 'inovasyon_etkinlik_ajandasi_detayli_rapor.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setIsDownloading(false), 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="bg-[#0F172A] border border-slate-700/80 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#1E293B]/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-rose-900/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Resmi Proje Dokümantasyonu & PDF Raporu
                <span className="px-2 py-0.5 text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full">
                  PDF Hazır (135 KB)
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                11 Eylül 2026 | Meryem Güçlü (meriguclu123@gmail.com)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition shadow-md shadow-rose-900/40 cursor-pointer disabled:opacity-50"
              title="PDF Dosyasını İndir"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'İndiriliyor...' : 'PDF İndir'}</span>
            </button>

            <a
              href="/inovasyon_etkinlik_ajandasi_detayli_rapor.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Yeni Sekmede PDF Aç"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>Yeni Sekmede Aç</span>
            </a>

            <button
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Yazdır / PDF Olarak Kaydet"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Yazdır</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-slate-800 bg-[#0F172A] text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            📋 Genel Özet & Amaç
          </button>
          <button
            onClick={() => setActiveTab('todo')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'todo'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            📌 Yapılacaklar (P0 - P3)
          </button>
          <button
            onClick={() => setActiveTab('programs')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'programs'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            📅 Programlar & Takvim
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'architecture'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            ⚙️ Sistem & Mimari
          </button>
        </div>

        {/* Scrollable Document Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm leading-relaxed">
          {activeTab === 'overview' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/30 to-indigo-900/20 border border-blue-800/40">
                <h3 className="text-base font-bold text-blue-300 mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  İnovasyon & Etkinlik Ajandası Nedir?
                </h3>
                <p className="text-xs text-slate-300">
                  Üniversite öğrencisi ve genç yeteneklerin eş zamanlı yürüttüğü akademik araştırmalar (TÜBİTAK 2209-A), savunma sanayii / havacılık staj süreçleri (CEZERİ & FERGANİ 2027), yoğun yazılım eğitim kampları (Tech Istanbul, Akbank Python, Pupilica No-Code) ve kariyer mülakatlarını tek bir akıllı ekranda birleştiren tam donanımlı bir yönetim merkezidir.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    Zaman Çakışması Önleme
                  </h4>
                  <p className="text-xs text-slate-400">
                    Aynı saat diliminde başlayan canlı yayınları tespit eder (örneğin 11 Eylül 20:00 Huawei Canlı Lab ile Akbank Mentor Toplantısı). Kullanıcıya kayıt esnekliği ve öncelik sıralaması sunar.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Otomatik Görev Devir (Daily Rollover)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Günün yoğunluğunda tamamlanamayan görevleri kaybetmeden otomatik olarak bir sonraki günün yapılacaklar listesine aktarır ve e-posta ile raporlar.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-sky-400" />
                    Gemini 3.7 Flash NLP Entegrasyonu
                  </h4>
                  <p className="text-xs text-slate-400">
                    Telegram, Discord veya e-postalardan kopyalanan serbest duyuru metinlerini anında takvime döker. Türkçe sesli komutlarla görev oluşturur.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    Google Workspace Çift Yönlü Sync
                  </h4>
                  <p className="text-xs text-slate-400">
                    Google Calendar, Google Tasks, Google Meet Spaces ve Gmail API ile doğrudan bağlıdır. Tek tıkla toplu takvim aktarımı ve .ICS desteği sunar.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'todo' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-800/40 space-y-2">
                <h4 className="text-xs font-bold text-rose-300 flex items-center gap-2">
                  🚨 [P0] Kritik ve Acil Eylemler (Eylül 2026)
                </h4>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li><strong>Akbank Python (10million.AI):</strong> "Yapay Zekaya İlk Adım" ve "Introduction to Python" derslerini bitir; 27 Eylül 23:59'a kadar sertifikaları tamamla.</li>
                  <li><strong>JCI Maltepe AIP Staj Mülakatı:</strong> 17 Eylül Perşembe 19:40 - 19:50 Google Meet görüşmesine katıl.</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/30 space-y-2">
                <h4 className="text-xs font-bold text-amber-300 flex items-center gap-2">
                  ⚡ [P1] Yüksek Öncelikli Canlı Oturumlar & Hazırlıklar
                </h4>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li><strong>Huawei ICT Academy Canlı Lab:</strong> 11 Eylül Cuma 20:00 YouTube canlı lab uygulamasına katıl.</li>
                  <li><strong>Pupilica No-Code:</strong> 15 Eylül Salı 1. hafta başlangıç oturumunu takip et.</li>
                  <li><strong>Miuul Claude Code MedKit:</strong> 21 Eylül Pazartesi 20:30 Zoom canlı seminerine katıl.</li>
                  <li><strong>TÜBİTAK 2209-A:</strong> Danışman hoca ile proje metnini ve iş-zaman tablosunu netleştir.</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  ⚙️ [P2 / P3] Teknik ve Altyapı Yol Haritası
                </h4>
                <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                  <li>Google Calendar periyodik arka plan senkronizasyonu</li>
                  <li>Entegre Pomodoro odaklanma zamanlayıcısı</li>
                  <li>Sabah 06:00 brifingini Telegram botu üzerinden alma seçeneği</li>
                  <li>Sertifika ve belge PDF kasası</li>
                  <li>Tam PWA çevrimdışı çalışma kabiliyeti</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'programs' && (
            <div className="space-y-3 animate-fade-in">
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-800 text-slate-200">
                      <th className="p-2.5">Program</th>
                      <th className="p-2.5">Platform</th>
                      <th className="p-2.5">Tarih</th>
                      <th className="p-2.5">Öncelik</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-2.5 font-bold text-rose-300">Akbank Python'a Giriş</td>
                      <td className="p-2.5">10million.AI</td>
                      <td className="p-2.5">07 - 27 Eylül 2026</td>
                      <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-rose-900/40 text-rose-300 font-bold">P0 Zorunlu</span></td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-2.5 font-bold text-emerald-300">JCI Maltepe AIP Mülakatı</td>
                      <td className="p-2.5">Google Meet</td>
                      <td className="p-2.5">17 Eylül 19:40-19:50</td>
                      <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-300 font-bold">P0 Mülakat</span></td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-2.5 font-bold text-sky-300">Tech Istanbul AI Bootcamp</td>
                      <td className="p-2.5">İBB & Tech Istanbul</td>
                      <td className="p-2.5">08 Eylül - 08 Ekim</td>
                      <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-sky-900/40 text-sky-300">P1 Bootcamp</span></td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-2.5 font-bold text-purple-300">Pupilica No-Code / Low-Code</td>
                      <td className="p-2.5">Canlı Oturumlar</td>
                      <td className="p-2.5">15 - 24 Eylül 2026</td>
                      <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-purple-900/40 text-purple-300">P1 Eğitim</span></td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-2.5 font-bold text-red-400">Huawei ICT Academy Networks</td>
                      <td className="p-2.5">YouTube Canlı Lab</td>
                      <td className="p-2.5">11 Eylül 2026 20:00</td>
                      <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-red-900/40 text-red-300">P1 Canlı Lab</span></td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-2.5 font-bold text-amber-300">Miuul Claude Code MedKit</td>
                      <td className="p-2.5">Zoom Canlı Yayın</td>
                      <td className="p-2.5">21 Eylül 2026 20:30</td>
                      <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-amber-900/40 text-amber-300">P1 Seminer</span></td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-2.5 font-bold text-indigo-300">TÜBİTAK 2209-A & Ar-Ge</td>
                      <td className="p-2.5">Proje Başvurusu</td>
                      <td className="p-2.5">Eylül 2026</td>
                      <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-indigo-900/40 text-indigo-300">Akademik</span></td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-2.5 font-bold text-blue-300">CEZERİ & FERGANİ 2027</td>
                      <td className="p-2.5">Aday Mühendislik</td>
                      <td className="p-2.5">2027 Uzun Dönem</td>
                      <td className="p-2.5"><span className="px-2 py-0.5 rounded bg-blue-900/40 text-blue-300">Staj Hazırlık</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-3 animate-fade-in">
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-sky-300 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Full-Stack Mimari Yapı
                </h4>
                <div className="text-xs text-slate-300 space-y-1 font-mono bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                  <div>Frontend: React 18, TypeScript, Vite, Tailwind CSS, motion, lucide-react</div>
                  <div>Backend:  Node.js, Express (server.ts), Port 3000</div>
                  <div>AI/NLP:   Google Gemini 3.7 Flash (@google/genai)</div>
                  <div>Auth:     Firebase Auth (Google Sign-In) + Resilient Persistence</div>
                  <div>APIs:     Google Calendar v3, Google Tasks v1, Gmail, Google Meet</div>
                  <div>Cron:     node-cron (Her sabah 06:00 brifingi ve günlük devir)</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Dirençli Kalıcılık ve Çözülen Hatalar
                </h4>
                <p className="text-xs text-slate-300">
                  Firebase JS SDK'nın sekme gizlendiğinde fırlattığı <code>Database is closing/hidden</code> hatası, <code>browserLocalPersistence</code> ve <code>inMemoryPersistence</code> fallback mekanizması ile kalıcı olarak giderilmiştir. Token yedekleme sayesinde sekme yenilense bile oturum kesintisiz devam eder.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-800 bg-[#1E293B]/60 shrink-0 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>PDF Dosyası: <strong>inovasyon_etkinlik_ajandasi_detayli_rapor.pdf</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold bg-rose-600 hover:bg-rose-500 text-white transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF İndir</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
