import { CalendarEvent, ProgramCategory } from '../types';

export interface InnovationTemplate {
  id: string;
  name: string;
  category: ProgramCategory;
  type: CalendarEvent['type'];
  description: string;
  defaultDurationHours: number;
  color: string;
  isMandatory: boolean;
  trlLevel?: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  tags: string[];
  deliverables: { text: string; done: boolean }[];
}

export const INNOVATION_TEMPLATES: InnovationTemplate[] = [
  {
    id: 'tmpl-python-100-gun',
    name: '🐍 Python 100 Günlük Kamp Günlük Çalışma Modülü',
    category: 'python-100-gun',
    type: 'self-paced',
    description: 'Atıl Samancıoğlu Python 100 Günlük Yazılım Kampı günlük video modülleri (~6 alt gün/2.5 saat) ve pratik kodlama.',
    defaultDurationHours: 2.5,
    color: '#eab308',
    isMandatory: true,
    priority: 'high',
    tags: ['Python', '100 Günlük Kamp', 'Atıl Samancıoğlu', 'Udemy', 'Kodlama'],
    deliverables: [
      { text: 'Günün video dersleri Udemy üzerinden izlendi', done: false },
      { text: 'Günün mini projesi ve algoritmaları IDE\'de kodlandı', done: false },
      { text: 'Kodlar GitHub reposuna commit edildi', done: false }
    ]
  },
  {
    id: 'tmpl-kariyer-yetenek-staj',
    name: '💼 Genç Yetenek & Aday Mühendislik Başvurusu',
    category: 'kariyer-yetenek',
    type: 'submission',
    description: 'Savunma sanayii, telekom veya global teknoloji şirketlerinin genç yetenek, aday mühendislik veya staj programı başvuru süreci.',
    defaultDurationHours: 3,
    color: '#4f46e5',
    isMandatory: false,
    priority: 'high',
    tags: ['Kariyer', 'Staj', 'Genç Yetenek', 'Mühendislik', 'CV'],
    deliverables: [
      { text: 'Güncel İngilizce/Türkçe CV ve portfolyo yüklendi', done: false },
      { text: 'Adaylık başvuru formu dolduruldu', done: false },
      { text: 'Genel yetenek ve yabancı dil değerlendirme sınavı tamamlandı', done: false }
    ]
  },
  {
    id: 'tmpl-cop31-volunteers',
    name: '🌍 COP31 Volunteers Ders & Modül Tamamlama',
    category: 'cop31-gonullu',
    type: 'self-paced',
    description: 'akademi.csb.gov.tr platformu üzerinden "COP31 Volunteers" eğitim paketindeki video derslerin izlenmesi ve testlerin çözülmesi.',
    defaultDurationHours: 2,
    color: '#059669',
    isMandatory: true,
    priority: 'critical',
    tags: ['COP31', 'Gönüllülük', 'akademi.csb.gov.tr', 'İklim', 'Zorunlu'],
    deliverables: [
      { text: 'akademi.csb.gov.tr > Programlar > "COP31 Volunteers" açıldı', done: false },
      { text: 'Tanımlanan ders videoları eksiksiz izlendi', done: false },
      { text: 'Ders sonu değerlendirme testleri çözüldü', done: false },
      { text: 'Tamamlama oranı kontrol edildi', done: false }
    ]
  },
  {
    id: 'tmpl-tubitak-2209',
    name: '🏆 TÜBİTAK 2209-A Üniversite Öğrenci Projesi',
    category: 'tubitak-yarisma',
    type: 'submission',
    description: 'TÜBİTAK 2209-A Üniversite Öğrencileri Araştırma Projeleri Destekleme Programı başvuru dosyasının hazırlanması ve ARBİS/BİDEB sistemine yüklenmesi.',
    defaultDurationHours: 4,
    color: '#059669',
    isMandatory: true,
    trlLevel: 3,
    priority: 'critical',
    tags: ['TÜBİTAK 2209-A', 'Araştırma', 'BİDEB', 'TRL-3', 'Akademik Danışman'],
    deliverables: [
      { text: 'Proje öneri formu ve araştırma metodolojisi yazıldı', done: false },
      { text: 'Akademik danışman onay yazısı ve imza alındı', done: false },
      { text: 'Bütçe ve malzeme listesi tablosu hazırlandı', done: false },
      { text: 'BİDEB / ARBİS sistemine PDF yüklendi ve başvuru onaylandı', done: false }
    ]
  },
  {
    id: 'tmpl-patent-basvuru',
    name: '💡 Patent / Faydalı Model Başvurusu (TÜRKPATENT)',
    category: 'girisimcilik-patent',
    type: 'milestone',
    description: 'Geliştirilen özgün buluş veya yenilikçi mekanizmanın Türk Patent ve Marka Kurumu (TÜRKPATENT) EPATS sistemi üzerinden tescil başvurusu.',
    defaultDurationHours: 3,
    color: '#d97706',
    isMandatory: false,
    trlLevel: 4,
    priority: 'high',
    tags: ['Patent', 'Faydalı Model', 'TÜRKPATENT', 'Fikri Mülkiyet', 'TRL-4'],
    deliverables: [
      { text: 'Buluş özeti ve teknik tarifname metni hazırlandı', done: false },
      { text: 'İstemler (Claims) ve teknik çizimler çizildi', done: false },
      { text: 'Tekniğin bilinen durumu (Prior Art) araştırması yapıldı', done: false },
      { text: 'EPATS portalı üzerinden başvuru harcı yatırıldı', done: false }
    ]
  },
  {
    id: 'tmpl-teknofest-rapor',
    name: '🇹🇷 TEKNOFEST Ön Tasarım / Detay Raporu Teslimi',
    category: 'teknofest-gonullu',
    type: 'submission',
    description: 'TEKNOFEST Yarışmaları resmi Şartnamesine uygun Ön Tasarım Raporu (ÖTR) veya Kritik Tasarım Raporu (KTR) sisteme yüklenmesi.',
    defaultDurationHours: 6,
    color: '#0d9488',
    isMandatory: true,
    trlLevel: 5,
    priority: 'critical',
    tags: ['TEKNOFEST', 'KTR/ÖTR', 'Milli Teknoloji', 'TRL-5', 'Takım Raporu'],
    deliverables: [
      { text: 'Şartname puanlama kriterleri satır satır incelendi', done: false },
      { text: 'Sistem mimarisi ve blok diyagramları çizildi', done: false },
      { text: 'Risk analizi ve bütçe tablosu tamamlandı', done: false },
      { text: 'KYS sistemi üzerinden rapor yüklendi', done: false }
    ]
  },
  {
    id: 'tmpl-prototip-test',
    name: '🔬 MVP Prototip & Donanım Doğrulama Testi',
    category: 'arge-inovasyon',
    type: 'workshop',
    description: 'Fiziksel prototip veya yazılım MVP sürümünün laboratuvar/saha koşullarında fonksiyonel performans testlerinin yapılması.',
    defaultDurationHours: 4,
    color: '#7c3aed',
    isMandatory: false,
    trlLevel: 6,
    priority: 'high',
    tags: ['Prototip', 'MVP', 'Laboratuvar', 'Doğrulama', 'TRL-6'],
    deliverables: [
      { text: 'Test senaryoları ve metrik kriterleri belirlendi', done: false },
      { text: 'Prototip donanım/yazılım üzerinde stres testi yapıldı', done: false },
      { text: 'Ölçüm sonuçları ve hata logları kaydedildi', done: false }
    ]
  },
  {
    id: 'tmpl-juri-pitch',
    name: '🎤 Yatırımcı & Jüri Sunumu (Pitch Deck)',
    category: 'girisimcilik-patent',
    type: 'pitch',
    description: '3-5 dakikalık asansör konuşması ve slayt sunumu ile jüri, melek yatırımcı veya kurumsal mentora projenin sunulması.',
    defaultDurationHours: 2,
    color: '#e11d48',
    isMandatory: false,
    trlLevel: 4,
    priority: 'high',
    tags: ['Pitch Deck', 'Jüri Sunumu', 'Girişimcilik', 'Sunum'],
    deliverables: [
      { text: '10-12 slaytlık yalın Pitch Deck tasarlandı', done: false },
      { text: 'Zaman sınırlı (3 dakika) sunum provası yapıldı', done: false },
      { text: 'Sık sorulabilecek jüri soruları için SSS hazırlandı', done: false }
    ]
  },
  {
    id: 'tmpl-staj-mulakat',
    name: '🚀 Savunma / Havacılık Teknik Mülakat Provası',
    category: 'cezeri-staj',
    type: 'meeting',
    description: 'CEZERİ, FERGANİ veya Baykar/TUSAŞ teknik mülakatı öncesinde algoritma, veri yapıları ve otonom sistemler prova çalışması.',
    defaultDurationHours: 2,
    color: '#2563eb',
    isMandatory: false,
    trlLevel: 2,
    priority: 'medium',
    tags: ['Teknik Mülakat', 'Otonom', 'Yazılım', 'Aviyonik', 'Kariyer'],
    deliverables: [
      { text: 'GitHub projeleri ve Readme belgeleri güncellendi', done: false },
      { text: 'Algoritma ve C++/Python temel soruları tekrar edildi', done: false },
      { text: 'Önceki projelerin teknik blok diyagramları hazırlandı', done: false }
    ]
  }
];

export const TRL_DEFINITIONS = [
  { level: 1, title: 'Temel Prensipler', desc: 'Temel ilkelerin gözlemlenmesi ve raporlanması.' },
  { level: 2, title: 'Konsept Formülasyonu', desc: 'Teknoloji konseptinin ve uygulama alanının tanımlanması.' },
  { level: 3, title: 'Kavram Kanıtı (PoC)', desc: 'Analitik ve deneysel kritik fonksiyon kanıtı.' },
  { level: 4, title: 'Laboratuvar Doğrulaması', desc: 'Bileşenlerin laboratuvar ortamında entegrasyonu.' },
  { level: 5, title: 'İlgili Ortamda Doğrulama', desc: 'Bileşenlerin simüle edilmiş gerçekçi ortamda testi.' },
  { level: 6, title: 'Prototip Gösterimi', desc: 'Sistem/alt sistem modelinin ilgili ortamda gösterimi.' },
  { level: 7, title: 'Operasyonel Ortam Prototipi', desc: 'Operasyonel ortamda sistem prototip gösterimi.' },
  { level: 8, title: 'Nitelikli Sistem', desc: 'Gerçek sistemin tamamlanması ve testlerle kalifiye edilmesi.' },
  { level: 9, title: 'Başarılı Operasyon', desc: 'Sistemin gerçek operasyonel koşullarda kanıtlanması.' }
];
