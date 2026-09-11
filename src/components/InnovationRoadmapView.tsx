import React, { useState } from 'react';
import { 
  Sparkles, Calendar, Clock, CheckCircle2, ChevronRight, AlertCircle, 
  ExternalLink, Download, ShieldAlert, ArrowRight, Zap, Target, Award, Rocket, FileText, Cpu, CheckSquare, Square, Layers, Bookmark, PlusCircle, RefreshCw, Lightbulb, Compass, Share2
} from 'lucide-react';
import { CalendarEvent, UserAuth, EventDeliverable } from '../types';
import { buildGoogleCalendarUrl, downloadICSFile } from '../lib/icsGenerator';
import { getRelativeTimeText } from '../lib/exportUtils';
import { INNOVATION_TEMPLATES, TRL_DEFINITIONS, InnovationTemplate } from '../data/innovationTemplates';

interface InnovationRoadmapViewProps {
  events: CalendarEvent[];
  user: UserAuth | null;
  onSyncToGoogle: (event: CalendarEvent) => void;
  onToggleComplete: (eventId: string) => void;
  onEdit: (event: CalendarEvent) => void;
  onAddFromTemplate?: (template: InnovationTemplate) => void;
  onUpdateDeliverable?: (eventId: string, deliverableId: string, completed: boolean) => void;
  onAddCustomDeliverable?: (eventId: string, text: string) => void;
}

interface TrackPipeline {
  id: string;
  title: string;
  badge: string;
  tagline: string;
  icon: string;
  color: string;
  trlFocus: string;
  filterProgramKey: string;
  portalUrl: string;
  portalName: string;
  stages: {
    title: string;
    description: string;
    dateRange: string;
    deadline?: string;
    eventId?: string;
    isMandatory?: boolean;
    trl?: number;
    tips?: string[];
  }[];
}

export const InnovationRoadmapView: React.FC<InnovationRoadmapViewProps> = ({
  events,
  user,
  onSyncToGoogle,
  onToggleComplete,
  onEdit,
  onAddFromTemplate,
  onUpdateDeliverable,
  onAddCustomDeliverable
}) => {
  const [activeTrack, setActiveTrack] = useState<string>('tubitak');
  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);
  const [newDeliverableInputs, setNewDeliverableInputs] = useState<{ [key: string]: string }>({});

  const pipelines: TrackPipeline[] = [
    {
      id: 'tubitak',
      title: 'TÜBİTAK 2209-A / Bilim Genç',
      badge: '🏆 Üniversite Lisans Hibe Programı',
      tagline: 'Ulusal Araştırma Projeleri, TYBS Başvuru & Hakem Değerlendirme Süreci',
      icon: '🏆',
      color: 'from-[#6366F1] to-[#4338CA]',
      trlFocus: 'TRL 1-4 (Temel & Uygulamalı Ar-Ge)',
      filterProgramKey: 'tubitak-yarisma',
      portalUrl: 'https://tybs.tubitak.gov.tr',
      portalName: 'TÜBİTAK TYBS Portalı',
      stages: [
        {
          title: 'Danışman Belirleme & Literatür Taraması',
          description: 'Akademik danışman onayı, WoS/Scopus literatür taraması ve hipotez formülasyonu.',
          dateRange: '15 Eylül – 05 Ekim 2026',
          eventId: 'tubitak-2209-danisman-belirleme',
          isMandatory: true,
          trl: 1,
          tips: ['Bölüm başkanlığı veya ilgili anabilim dalından danışman onayını alın', 'Benzer TÜBİTAK projelerinin özetlerini inceleyin']
        },
        {
          title: 'Proje Metni & İş Paketleri Yazımı',
          description: 'Özgün değer, yöntem, iş-zaman çubuğu, risk yönetimi ve yaygın etki bölümlerinin hazırlanması.',
          dateRange: '06 Ekim – 30 Ekim 2026',
          eventId: 'tubitak-2209-proje-metni-yazimi',
          isMandatory: true,
          trl: 2,
          tips: ['Gantt şeması ve risk yönetimi matrisini net kurgulayın', 'Bütçe kalemlerini proforma faturalarla eşleştirin']
        },
        {
          title: '2. Dönem TYBS Başvuru Son Günü',
          description: 'Proje öneri formu, taahhütname ve danışman onayının TYBS sistemine e-İmza ile yüklenmesi.',
          dateRange: '10 Kasım 2026 / 17:30',
          deadline: '2026-11-10T17:30:00',
          eventId: 'tubitak-2209-2donem-son-basvuru',
          isMandatory: true,
          trl: 3,
          tips: ['Son güne bırakmadan sisteme PDF olarak yükleyin', 'Danışmanın e-BİDEB üzerinden onay verdiğini doğrulayın']
        }
      ]
    },
    {
      id: 'python-100',
      title: 'Python: 100 Günlük Yazılım Kampı',
      badge: '🐍 16 Günde Yoğun Kamp (Sprint)',
      tagline: 'Atıl Samancıoğlu / Udemy – 23 Ağustos Başlangıç / 07 Eylül 2026 Mezuniyet',
      icon: '🐍',
      color: 'from-[#F59E0B] to-[#B45309]',
      trlFocus: 'Python, OOP, Veri Bilimi, Django & AI',
      filterProgramKey: 'python-100-gun',
      portalUrl: 'https://www.udemy.com/course/python-100-gunluk-yazilim-kampi/learn/lecture/37243986?start=0#overview',
      portalName: 'Udemy Kurs Portalı (Atıl Samancıoğlu)',
      stages: [
        {
          title: 'Aşama 1 (23 - 27 Ağustos): Python Temelleri, Veri Yapıları & OOP',
          description: 'PyCharm, VS Code, Jupyter, temel tipler, döngüler, listeler, fonksiyonlar ve OOP (Class, Object, __init__).',
          dateRange: '23 Ağustos – 27 Ağustos 2026',
          eventId: 'py100-gun-1-2026-08-23',
          isMandatory: true,
          tips: ['Günde 6-7 alt modül izleyin (~2.5 saat video & pratik)', 'Mini projeleri IDE\'nizde kodlayın']
        },
        {
          title: 'Aşama 2 (28 Ağustos - 01 Eylül): İleri OOP, Dosya I/O, GUI (Tkinter) & Botlar',
          description: 'Kalıtım, Try-Except hata yönetimi, Dosya işlemleri, Tkinter/Turtle GUI ve Requests/Selenium botları.',
          dateRange: '28 Ağustos – 01 Eylül 2026',
          eventId: 'py100-gun-6-2026-08-28',
          isMandatory: true,
          tips: ['Tkinter ile çalışan bir arayüz projesi çıkartın', 'Selenium ile tarayıcı otomasyonu yapın']
        },
        {
          title: 'Aşama 3 (02 Eylül - 07 Eylül): NumPy/Pandas, Django, Git & AI Deploy',
          description: 'NumPy & Pandas veri analizi, Matplotlib grafikleri, Django web geliştirme, Git/GitHub ve Cursor AI ile mezuniyet.',
          dateRange: '02 Eylül – 07 Eylül 2026',
          eventId: 'py100-gun-11-2026-09-02',
          isMandatory: true,
          tips: ['Django MVT projesi ayağa kaldırın', 'Udemy mezuniyet sertifikanızı alın']
        }
      ]
    },
    {
      id: 'kariyer-havuz',
      title: 'Kariyer & Genç Yetenek Takvim Havuzu',
      badge: '💼 Savunma & Teknoloji Stajları',
      tagline: 'Aselsan, Turkcell, TUSAŞ, TÜBİTAK, NASA ve Erasmus+ Başvuru Dönemleri',
      icon: '💼',
      color: 'from-[#6366F1] to-[#3B82F6]',
      trlFocus: 'Kariyer, Staj & Ar-Ge Ağları',
      filterProgramKey: 'kariyer-yetenek',
      portalUrl: 'https://kariyer.aselsan.com',
      portalName: 'Genç Yetenek Portalları',
      stages: [
        {
          title: 'Güz Dönemi (Ekim - Kasım): Üretim & Hibe',
          description: 'NASA Space Apps Hackathonu, TÜBİTAK 2209-A 2. Dönem araştırma projesi başvurusu ve Google Oyun ve Uygulama Akademisi.',
          dateRange: '01 Ekim – 10 Aralık 2026',
          eventId: 'kariyer-nasa-space-apps',
          isMandatory: true,
          tips: ['NASA açık verileriyle yapay zeka çözümleri üretin', '2209-A başvurusunu TYBS\'ye yükleyin']
        },
        {
          title: 'Kış Dönemi (Aralık - Şubat): Savunma Sanayii & Telekom',
          description: 'TEKNOFEST 2027 takım kayıtları, Aselsan a Yetenek, Turkcell GNÇYTNK ve YetGen 1. Dönem başvuruları.',
          dateRange: '15 Aralık 2026 – 28 Şubat 2027',
          eventId: 'kariyer-aselsan-a-yetenek',
          isMandatory: true,
          tips: ['Güncel İngilizce/Türkçe CV ve GitHub portfolyonuzu hazır tutun', 'Sınavlara hazırlanın']
        },
        {
          title: 'Bahar Dönemi (Şubat - Nisan): Avrupa Stajı, Tez & Fintek',
          description: 'Erasmus+ staj dil sınavları, TUSAŞ Lift Up lisans bitirme tezi ve TÜBİTAK 2209-A 1. Dönem bahar çağrısı.',
          dateRange: '01 Şubat – 30 Nisan 2027',
          eventId: 'kariyer-erasmus-staj-ilan',
          isMandatory: true,
          tips: ['Erasmus dil sınavını kaçırmayın', 'TUSAŞ Lift Up tez konularını eşleştirin']
        }
      ]
    },
    {
      id: 'cop31',
      title: 'COP31 Türkiye Gönüllülük Programı',
      badge: '🌍 Zorunlu Akademi Süreci',
      tagline: 'akademi.csb.gov.tr Platformu – COP31 Volunteers Paket Programları & 15 Eylül Son Tamamlama',
      icon: '🌍',
      color: 'from-[#3B82F6] to-[#1D4ED8]',
      trlFocus: 'Yetkinlik & İklim Gönüllülüğü',
      filterProgramKey: 'cop31-gonullu',
      portalUrl: 'https://akademi.csb.gov.tr',
      portalName: 'ÇSB Akademi Portalı',
      stages: [
        {
          title: 'Adım 1: Platform Girişi & Video Modülleri',
          description: 'akademi.csb.gov.tr platformuna giriş yapılarak COP31 Volunteers eğitim paketinin izlenmesi.',
          dateRange: '20 Ağustos – 05 Eylül 2026',
          eventId: 'cop31-adim1-platform-giris',
          isMandatory: true,
          tips: ['Tüm video modüllerini eksiksiz izleyin', 'Quiz sorularını çözün']
        },
        {
          title: 'Adım 2: ÇSB Akademi Sertifikasını Alma',
          description: 'Eğitim sürecini bitirip sistem tarafından üretilen resmi COP31 Gönüllü Sertifikasının indirilmesi.',
          dateRange: '15 Eylül 2026 / 23:59',
          deadline: '2026-09-15T23:59:00',
          eventId: 'cop31-adim2-sertifika-alma',
          isMandatory: true,
          tips: ['Sertifikanızı PDF olarak yedekleyin']
        }
      ]
    },
    {
      id: 'staj',
      title: 'CEZERİ & FERGANİ İleri Teknoloji Stajları',
      badge: '🚀 Havacılık & Otonom',
      tagline: 'Otonom Sistemler, Aviyonik ve Uzay Teknolojileri 2027 Staj & Kariyer Haritası',
      icon: '🚀',
      color: 'from-[#6366F1] to-[#8B5CF6]',
      trlFocus: 'Kariyer & İleri Ar-Ge',
      filterProgramKey: 'cezeri-staj',
      portalUrl: 'https://www.cezeri.com',
      portalName: 'CEZERİ Kariyer Portalı',
      stages: [
        {
          title: 'CEZERİ & FERGANİ Yaz Stajı Son Başvuru',
          description: 'Yapay zeka, otonom sistemler, uydu ve aviyonik alanlarında staj başvurusu.',
          dateRange: '09 Şubat 2027 / 23:59',
          deadline: '2027-02-09T23:59:00',
          eventId: 'cezeri-2027-yaz-son-basvuru',
          isMandatory: true,
          tips: ['GitHub ve portfolyo projelerinizi güncel tutun', 'Teknik motivasyon mektubunuzu hazırlayın']
        },
        {
          title: 'Online Sınav & Video Mülakat Süreci',
          description: 'Yazılım algoritma testi ve yetkinlik odaklı asenkron video mülakat değerlendirmesi.',
          dateRange: '16 – 20 Şubat 2027',
          eventId: 'cezeri-2027-yaz-sinav-mulakat',
          isMandatory: true,
          tips: ['Algoritma ve veri yapıları sorularına çalışın']
        },
        {
          title: 'Sonuç Bildirimi & Fiili Staj Başlangıcı',
          description: 'Adaylara kabullerin duyurulması ve Ar-Ge merkezinde fiili staj dönemi.',
          dateRange: '15 Nisan – 22 Haziran 2027',
          eventId: 'cezeri-2027-yaz-sonuc-bildirimi',
          isMandatory: true,
          tips: ['Üniversite zorunlu staj onayını tamamlayın']
        }
      ]
    },
    {
      id: 'genai',
      title: 'Akbank Yapay Zeka & TEKNOFEST Akademisi',
      badge: '🤖 AI & Sertifikasyon',
      tagline: 'Üretken Yapay Zeka, Prompt Mühendisliği ve TEKNOFEST 2027 Yarışma Süreci',
      icon: '🤖',
      color: 'from-[#EC4899] to-[#BE185D]',
      trlFocus: 'Yapay Zeka & Sertifikasyon',
      filterProgramKey: 'akbank-genai',
      portalUrl: 'https://courses.10million.ai',
      portalName: 'Akbank AI Portalı',
      stages: [
        {
          title: 'Yapay Zekaya İlk Adım Self-Paced Eğitimi',
          description: 'courses.10million.ai üzerinden modüllerin bitirilerek sertifikanın forma yüklenmesi.',
          dateRange: '07 – 27 Ağustos 2026',
          deadline: '2026-08-27T23:59:00',
          eventId: 'akbank-sertifika-son-gun',
          isMandatory: true,
          tips: ['Modül sonu quizlerini tamamlayın', 'Sertifikanızı PDF olarak yükleyin']
        },
        {
          title: 'Prompt Mühendisliği & Değerlendirme Sınavı',
          description: 'Yazılım ve tasarım için komut mühendisliği dersleri ve yeterlilik sınavı.',
          dateRange: '18 Ağustos 2026 / 19:00 - 20:00',
          eventId: 'edutech-prompt-muhendisligi-sinav',
          isMandatory: true,
          tips: ['Few-shot prompting ve chain-of-thought tekniklerini uygulayın']
        },
        {
          title: 'TEKNOFEST 2027 Takım Başvuruları',
          description: 'Havacılık, İHA, Yapay Zeka ve Çevre Teknolojileri kategorilerinde takım başvurusu.',
          dateRange: '01 Kasım 2026 – 28 Şubat 2027',
          eventId: 'teknofest-2027-yarisma-basvurulari',
          isMandatory: false,
          tips: ['KYS portalından takım kaptanı ve üyeleri eşleştirin']
        }
      ]
    }
  ];

  const currentPipeline = pipelines.find(p => p.id === activeTrack) || pipelines[0];

  const getEventData = (eventId?: string) => {
    if (!eventId) return null;
    return events.find(e => e.id === eventId);
  };

  const completedStagesCount = currentPipeline.stages.filter(s => {
    const ev = getEventData(s.eventId);
    return ev?.completed;
  }).length;
  const progressPercent = Math.round((completedStagesCount / currentPipeline.stages.length) * 100);

  const handleAddDeliverableSubmit = (eventId: string) => {
    const text = newDeliverableInputs[eventId];
    if (!text || !text.trim()) return;
    if (onAddCustomDeliverable) {
      onAddCustomDeliverable(eventId, text.trim());
    }
    setNewDeliverableInputs(prev => ({ ...prev, [eventId]: '' }));
  };

  return (
    <div className="space-y-6">
      
      {/* Strategic Hub Header */}
      <div className="bg-[#151B2B] rounded-3xl p-6 sm:p-7 border border-[#263047] text-[#F1F5F9] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#6366F1]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#F59E0B]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6366F1]/15 text-[#818CF8] text-xs font-bold border border-[#6366F1]/30">
              <Zap className="w-3.5 h-3.5 text-[#6366F1]" />
              <span>Ulusal İnovasyon, Ar-Ge & Kariyer Ekosistemi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F1F5F9] flex items-center gap-3">
              Stratejik Yol Haritası & İnovasyon Matrisi
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] max-w-3xl leading-relaxed">
              Tüm başvuru ve araştırma aşamalarınızı, TRL seviyelerini, teslim edilecek evrak kontrollerini ve resmi portal takvimlerini tek merkezden yönetin.
            </p>
          </div>

          {/* Action Hub */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowTemplateModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold text-xs shadow-lg shadow-[#6366F1]/25 flex items-center gap-2 border border-[#6366F1]/30 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span>İnovasyon Şablonu Ekle</span>
            </button>
            <a
              href={currentPipeline.portalUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2.5 rounded-2xl bg-[#1E273D] hover:bg-[#263047] text-[#F1F5F9] font-semibold text-xs border border-[#263047] flex items-center gap-1.5 transition"
            >
              <span>{currentPipeline.portalName}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#94A3B8]" />
            </a>
          </div>
        </div>

        {/* Track Selector Navigation Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-4 border-t border-[#263047]">
          {pipelines.map(track => {
            const isSelected = track.id === activeTrack;
            return (
              <button
                key={track.id}
                onClick={() => setActiveTrack(track.id)}
                className={`p-3.5 rounded-2xl text-left transition-all duration-200 cursor-pointer border flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-[#1E273D] border-[#6366F1] shadow-lg ring-2 ring-[#6366F1]/40 text-[#F1F5F9]' 
                    : 'bg-[#0B0F19] border-[#263047] hover:bg-[#1E273D]/50 text-[#94A3B8]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-xl">{track.icon}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#101522] text-[#818CF8] border border-[#263047]">
                      {track.trlFocus.split(' ')[0]}
                    </span>
                  </div>
                  <div className={`text-xs font-bold line-clamp-2 ${isSelected ? 'text-[#F1F5F9]' : 'text-[#94A3B8]'}`}>
                    {track.title}
                  </div>
                </div>
                <div className="mt-2 text-[10px] font-medium text-[#94A3B8] truncate">
                  {track.badge}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Track Deep-Dive Overview */}
      <div className="bg-[#151B2B] rounded-3xl border border-[#263047] shadow-xl p-6 sm:p-8 space-y-6">
        
        {/* Track Status Banner with Progress Bar */}
        <div className={`p-6 rounded-3xl bg-gradient-to-r ${currentPipeline.color} text-white shadow-lg space-y-4`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider font-extrabold text-white/90 bg-black/20 px-2.5 py-1 rounded-md border border-white/20">
                {currentPipeline.badge} • {currentPipeline.trlFocus}
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">{currentPipeline.title}</h3>
              <p className="text-xs sm:text-sm text-white/90 max-w-2xl">{currentPipeline.tagline}</p>
            </div>
            
            <div className="bg-black/25 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-center shrink-0">
              <div className="text-2xl font-black text-white">{completedStagesCount} / {currentPipeline.stages.length}</div>
              <div className="text-[11px] font-semibold text-white/80">Tamamlanan Aşama</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs font-bold text-white/90">
              <span>İlerleme ve Hazırlık Durumu</span>
              <span>%{progressPercent}</span>
            </div>
            <div className="w-full h-3 rounded-full bg-black/30 overflow-hidden p-0.5">
              <div 
                className="h-full rounded-full bg-[#F59E0B] transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* 2-3 Wide Horizontal Focus Cards Grid (Stratejik Hazırlık ve Kritik Teslimatlar) */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-[#F1F5F9] flex items-center gap-2">
              <Target className="w-4 h-4 text-[#6366F1]" />
              <span>Stratejik Hazırlık & Kritik Teslimat Kartları</span>
            </h3>
            <span className="text-xs text-[#94A3B8]">
              {currentPipeline.stages.length} Odak Aşaması
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {currentPipeline.stages.map((stage, idx) => {
              const ev = getEventData(stage.eventId);
              const isCompleted = ev?.completed || false;
              const relTime = stage.deadline ? getRelativeTimeText(stage.deadline) : null;
              const deliverables = ev?.deliverables || [];

              return (
                <div 
                  key={idx}
                  className={`rounded-2xl border p-5 transition-all flex flex-col justify-between space-y-4 shadow-lg ${
                    isCompleted 
                      ? 'bg-[#101522] border-[#263047] opacity-80' 
                      : 'bg-[#151B2B] border-[#263047] hover:border-[#6366F1] hover:shadow-[#6366F1]/10'
                  }`}
                >
                  <div className="space-y-3">
                    
                    {/* Top Header of Card */}
                    <div className="flex items-start justify-between gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-sm ${
                        isCompleted 
                          ? 'bg-[#6366F1] text-white' 
                          : 'bg-[#1E273D] text-[#818CF8] border border-[#263047]'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>

                      <div className="flex flex-wrap items-center justify-end gap-1.5">
                        {stage.isMandatory && (
                          <span className="text-[10px] font-bold text-[#F59E0B] bg-[#F59E0B]/15 px-2 py-0.5 rounded border border-[#F59E0B]/30">
                            Zorunlu
                          </span>
                        )}
                        {stage.trl && (
                          <span className="text-[10px] font-bold text-[#818CF8] bg-[#6366F1]/15 px-2 py-0.5 rounded border border-[#6366F1]/30">
                            TRL-{stage.trl}
                          </span>
                        )}
                        {relTime && relTime.text && (
                          <span className="text-[10px] font-bold text-[#EC4899] bg-[#EC4899]/15 px-2 py-0.5 rounded border border-[#EC4899]/30 animate-pulse">
                            ⏳ {relTime.text}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Date and Title */}
                    <div>
                      <span className="text-xs font-bold text-[#6366F1]">
                        {stage.dateRange}
                      </span>
                      <h4 className="text-base font-bold text-[#F1F5F9] mt-0.5 leading-snug">
                        {stage.title}
                      </h4>
                      <p className="text-xs text-[#94A3B8] leading-relaxed mt-1">
                        {stage.description}
                      </p>
                    </div>

                    {/* Tips */}
                    {stage.tips && (
                      <div className="space-y-1 pt-1">
                        {stage.tips.map((tip, tIdx) => (
                          <div key={tIdx} className="flex items-start gap-1.5 text-[11px] text-[#94A3B8] bg-[#0B0F19] p-2 rounded-xl border border-[#263047]">
                            <Target className="w-3.5 h-3.5 text-[#6366F1] shrink-0 mt-0.5" />
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Interactive Deliverables / Evrak Kontrol Listesi */}
                    {ev && (
                      <div className="pt-2 border-t border-[#263047] space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#F1F5F9] flex items-center gap-1.5">
                            <CheckSquare className="w-3.5 h-3.5 text-[#6366F1]" />
                            <span>Evrak & Hazırlık:</span>
                          </span>
                          <span className="text-[11px] text-[#94A3B8]">
                            {deliverables.filter(d => d.completed).length} / {deliverables.length} Hazır
                          </span>
                        </div>

                        {deliverables.length > 0 && (
                          <div className="space-y-1.5">
                            {deliverables.map(del => (
                              <button
                                key={del.id}
                                onClick={() => onUpdateDeliverable && onUpdateDeliverable(ev.id, del.id, !del.completed)}
                                className={`w-full p-2 rounded-xl border text-left text-xs font-medium transition flex items-center gap-2 cursor-pointer ${
                                  del.completed 
                                    ? 'bg-[#101522] text-[#64748B] border-[#263047] line-through' 
                                    : 'bg-[#0B0F19] hover:bg-[#1E273D] text-[#F1F5F9] border-[#263047]'
                                }`}
                              >
                                {del.completed ? (
                                  <CheckSquare className="w-4 h-4 text-[#6366F1] shrink-0" />
                                ) : (
                                  <Square className="w-4 h-4 text-[#94A3B8] shrink-0" />
                                )}
                                <span className="truncate">{del.text}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Quick Add Custom Deliverable */}
                        <div className="flex items-center gap-1.5 pt-1">
                          <input
                            type="text"
                            placeholder="Yeni teslim maddesi ekle..."
                            value={newDeliverableInputs[ev.id] || ''}
                            onChange={e => setNewDeliverableInputs({ ...newDeliverableInputs, [ev.id]: e.target.value })}
                            onKeyDown={e => e.key === 'Enter' && handleAddDeliverableSubmit(ev.id)}
                            className="px-2.5 py-1.5 rounded-xl border border-[#263047] bg-[#0B0F19] text-[#F1F5F9] placeholder-[#94A3B8] text-xs flex-1 focus:outline-none focus:border-[#6366F1]"
                          />
                          <button
                            onClick={() => handleAddDeliverableSubmit(ev.id)}
                            className="px-3 py-1.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold transition cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Card Bottom Actions */}
                  {ev && (
                    <div className="pt-3 border-t border-[#263047] flex items-center justify-between gap-2">
                      <button
                        onClick={() => onToggleComplete(ev.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                          ev.completed
                            ? 'bg-[#6366F1] text-white'
                            : 'bg-[#1E273D] hover:bg-[#263047] text-[#F1F5F9]'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{ev.completed ? 'Tamamlandı' : 'Tamamla'}</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onSyncToGoogle(ev)}
                          title="Google Takvime Ekle"
                          className="px-2.5 py-1.5 rounded-xl bg-[#0B0F19] hover:bg-[#1E273D] text-[#818CF8] border border-[#263047] text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                        >
                          <Calendar className="w-3 h-3 text-[#6366F1]" />
                          <span className="hidden sm:inline">Takvim</span>
                        </button>
                        <button
                          onClick={() => onEdit(ev)}
                          title="Düzenle ve İncele"
                          className="px-2.5 py-1.5 rounded-xl bg-[#0B0F19] hover:bg-[#1E273D] text-[#94A3B8] hover:text-[#F1F5F9] text-xs font-semibold border border-[#263047] transition cursor-pointer"
                        >
                          Düzenle
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Innovation Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
          <div className="bg-[#151B2B] rounded-3xl max-w-2xl w-full shadow-2xl border border-[#263047] overflow-hidden my-8 text-[#F1F5F9]">
            <div className="bg-[#101522] text-[#F1F5F9] p-5 border-b border-[#263047] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#6366F1]/15 text-[#818CF8] flex items-center justify-center border border-[#6366F1]/30">
                  <Lightbulb className="w-5 h-5 text-[#6366F1]" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Hızlı İnovasyon & Araştırma Şablonları</h3>
                  <p className="text-xs text-[#94A3B8]">Takviminize tek tıkla önceden yapılandırılmış Ar-Ge aşaması ekleyin</p>
                </div>
              </div>
              <button 
                onClick={() => setShowTemplateModal(false)}
                className="p-1.5 text-[#94A3B8] hover:text-[#F1F5F9] rounded-xl transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-thin">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {INNOVATION_TEMPLATES.map(tmpl => (
                  <div 
                    key={tmpl.id} 
                    className="p-4 rounded-2xl border border-[#263047] bg-[#0B0F19] hover:border-[#6366F1] hover:shadow-md transition space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#6366F1]/15 text-[#818CF8] border border-[#6366F1]/30">
                          {tmpl.trlLevel ? `TRL-${tmpl.trlLevel}` : 'Ar-Ge'}
                        </span>
                        <span className="text-[11px] font-semibold text-[#94A3B8]">
                          {tmpl.defaultDurationHours} Saat
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#F1F5F9]">{tmpl.name}</h4>
                      <p className="text-xs text-[#94A3B8] mt-1 line-clamp-3 leading-relaxed">{tmpl.description}</p>
                    </div>

                    <div className="pt-3 border-t border-[#263047] flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {tmpl.tags.slice(0, 2).map((t, idx) => (
                          <span key={idx} className="text-[10px] bg-[#1E273D] text-[#94A3B8] px-1.5 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          if (onAddFromTemplate) {
                            onAddFromTemplate(tmpl);
                          }
                          setShowTemplateModal(false);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Ekle</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
