import { CalendarEvent } from '../types';

export const CAREER_TALENT_EVENTS: CalendarEvent[] = [
  // Miuul - Claude Code ile Dünya Birinciliğine: MedKit Nasıl Geliştirildi? (Bedirhan Keskin)
  {
    id: 'miuul-claude-code-medkit',
    title: '🏆 Miuul: Claude Code ile Dünya Birinciliğine - MedKit Nasıl Geliştirildi?',
    description: `Anthropic’in "Built with Opus 4.7 Claude Code Hackathon"unda MedKit projesiyle dünya birincisi olan Bedirhan Keskin, proje geliştirme sürecini ve Claude Code deneyimini aktarıyor!

🏢 Organizasyon: Miuul Ekibi
👨‍💻 Konuşmacı: Bedirhan Keskin (Claude Code Hackathon Dünya Birincisi)
📅 Tarih: 21 Eylül 2026 Pazartesi
⏰ Saat: 20:30 – 22:00
💻 Format: Online & Ücretsiz Canlı Yayın (Zoom)

📌 Zoom Katılım Detayları:
🔗 Katılım Linki: https://zoom.us/j/86243481180?pwd=723648
🆔 Toplantı Kimliği (Meeting ID): 862 4348 1180
🔑 Parola (Passcode): 723648

🎯 Bu Oturumda Neler Var?
• Anthropic Opus 4.7 Claude Code Hackathon birincilik serüveni
• MedKit projesinin mimarisi ve Claude Code ile geliştirilme aşamaları
• Claude Code prompt stratejileri ve yapay zeka destekli kodlama pratikleri
• Dünya birinciliğine giden sürecin perde arkası ve canlı soru-cevap`,
    startDate: '2026-09-21T20:30:00',
    endDate: '2026-09-21T22:00:00',
    allDay: false,
    location: 'Zoom (ID: 862 4348 1180 | Şifre: 723648)',
    link: 'https://zoom.us/j/86243481180?pwd=723648',
    type: 'webinar',
    program: 'kariyer-yetenek',
    isMandatory: false,
    color: '#d97706', // Anthropic / Claude warm amber
    reminderMinutes: 30,
    priority: 'high',
    tags: ['Miuul', 'Claude Code', 'Anthropic', 'Opus 4.7', 'MedKit', 'Bedirhan Keskin', 'Hackathon', 'Zoom'],
    deliverables: [
      { id: 'miuul-del-1', text: 'Zoom bağlantısı ve şifresi kontrol edildi (ID: 862 4348 1180 | Şifre: 723648)', completed: false },
      { id: 'miuul-del-2', text: 'Canlı yayına katılarak Claude Code ile MedKit geliştirme sunumu dinlendi', completed: false },
      { id: 'miuul-del-3', text: 'Claude Code prompt ve mimari notları çıkarıldı', completed: false }
    ]
  },

  // Huawei ICT Academy - Computer Networks Bootcamp: Canlı Lab Uygulaması (Sena İlayda Hocaoğlu)
  {
    id: 'huawei-ict-computer-networks-lab',
    title: '🌐 Huawei ICT Academy: Computer Networks Bootcamp Canlı Lab Uygulaması',
    description: `Huawei ICT Academy Computer Networks Bootcamp kapsamında gerçekleştirdiğimiz bu canlı yayında, teorik ağ bilgilerini Huawei eNSP (Enterprise Network Simulation Platform) üzerinde pratik laboratuvar senaryolarına dönüştürüyoruz!

👩‍🏫 Eğitmen: Sena İlayda Hocaoğlu
🏢 Kurum: Huawei ICT Academy
📅 Tarih: 11 Eylül 2026 Cuma
⏰ Saat: 20:00 – 22:00
💻 Format: Canlı Lab Uygulaması (Yayın kaydı etkinlik sonrasında kanalda erişilebilir olacaktır.)
🔗 Canlı Yayın Bağlantısı: https://www.youtube.com/live/IExcHo1vG9c?si=5Qxpl6trpngGiWdO

📌 Bu Oturumda Neler Var?
• Huawei eNSP arayüzü ve temel çalışma prensipleri
• Router ve Switch konfigürasyon adımları
• Canlı ağ senaryoları ve simülasyon pratikleri
• Soru & Cevap

🎯 Hedef:
Ağ teknolojilerinde yetkinliğini artırmak ve Huawei sertifikasyon süreçlerine sağlam bir pratik zemin hazırlamak isteyen herkes davetlidir.

💡 Not: Oturum kaydı canlı yayın sonrasında YouTube üzerinden izlenebilir olacaktır.`,
    startDate: '2026-09-11T20:00:00',
    endDate: '2026-09-11T22:00:00',
    allDay: false,
    location: 'YouTube Canlı Yayın (Online)',
    link: 'https://www.youtube.com/live/IExcHo1vG9c?si=5Qxpl6trpngGiWdO',
    type: 'workshop',
    program: 'kariyer-yetenek',
    isMandatory: false,
    color: '#cf0a2c', // Huawei Signature Red
    reminderMinutes: 30,
    priority: 'high',
    tags: ['Huawei', 'ICT Academy', 'Computer Networks', 'eNSP', 'Lab', 'Sena İlayda Hocaoğlu', 'YouTube', 'Sertifikasyon'],
    deliverables: [
      { id: 'huawei-del-1', text: 'YouTube canlı yayınına 20:00 öncesi giriş yapıldı (https://www.youtube.com/live/IExcHo1vG9c)', completed: false },
      { id: 'huawei-del-2', text: 'Huawei eNSP simülatörü ve Router/Switch konfigürasyon notları çıkarıldı', completed: false },
      { id: 'huawei-del-3', text: 'Canlı lab senaryoları incelendi ve soru-cevap oturumuna katılındı', completed: false }
    ]
  },

  // JCI Maltepe - Anatolian Internship Program (AIP) Tanışma Sohbeti (Meryem Güçlü)
  {
    id: 'jci-maltepe-aip-tanisma-mulakati',
    title: '☕ JCI Maltepe AIP: Tanışma Sohbeti & Ön Değerlendirme Mülakatı',
    description: `Tebrikler Meryem Güçlü! 🎉
JCI Maltepe tarafından yürütülen Anatolian Internship Program'a (AIP) yapılan başvurunun ön değerlendirme aşaması başarıyla geçildi.

📌 Görüşme Detayları:
Seni daha yakından tanımak ve projeyle ilgili heyecanımızı paylaşmak için karşılıklı beklentilerin konuşulacağı 10 dakikalık samimi bir kahve sohbeti / tanışma mülakatı.

⏰ Saat: 19:40 – 19:50 (10 Dakika)
📅 Tarih: 17 Eylül 2026 Perşembe
💻 Format: Online (Google Meet)
🔗 Toplantı Linki: https://meet.google.com/dyz-fxcd-rpg`,
    startDate: '2026-09-17T19:40:00',
    endDate: '2026-09-17T19:50:00',
    allDay: false,
    location: 'Google Meet (Online)',
    link: 'https://meet.google.com/dyz-fxcd-rpg',
    type: 'meeting',
    program: 'kariyer-yetenek',
    isMandatory: true,
    color: '#10b981', // emerald
    reminderMinutes: 15, // 15 dakika önce
    priority: 'critical',
    tags: ['JCI Maltepe', 'AIP', 'Mülakat', 'Tanışma', 'Staj', 'Google Meet', 'Meryem Güçlü'],
    deliverables: [
      { id: 'jci-del-1', text: 'Kamera, mikrofon ve ortam kontrolü yapıldı (19:35)', completed: false },
      { id: 'jci-del-2', text: 'Google Meet odasına giriş yapıldı (https://meet.google.com/dyz-fxcd-rpg)', completed: false },
      { id: 'jci-del-3', text: 'Kişisel tanıtım, motivasyon ve staj beklentileri aktarıldı', completed: false }
    ]
  },

  // Softtech - Veri Biliminde Popüler Araçlar ve Platformlar (Kaan Can Yılmaz)
  {
    id: 'softtech-veri-bilimi-araclar',
    title: '📊 Veri Biliminde Popüler Araçlar ve Platformlar',
    description: `Konuşmacı: Kaan Can Yılmaz
Konu: Veri Biliminde Popüler Araçlar ve Platformlar

📌 Açıklama:
Veri bilimi ve makine öğrenmesi projelerinde endüstri standardı haline gelen popüler araçlar, kütüphaneler, bulut ve veri platformlarının ele alınacağı Softtech canlı online semineri.

🔗 Canlı Bağlantı (Zoom): https://softtech-tr.zoom.us/j/92632464963
Toplantı ID: 926 3246 4963`,
    startDate: '2026-09-17T17:00:00',
    endDate: '2026-09-17T18:30:00',
    allDay: false,
    location: 'Softtech Zoom (Online)',
    link: 'https://softtech-tr.zoom.us/j/92632464963',
    type: 'webinar',
    program: 'kariyer-yetenek',
    isMandatory: false,
    color: '#06b6d4', // cyan / teal
    reminderMinutes: 30, // 30 mins before
    priority: 'high',
    tags: ['Softtech', 'Veri Bilimi', 'Kaan Can Yılmaz', 'Zoom', 'Webinar', 'Platformlar', 'Python'],
    deliverables: [
      { id: 'softtech-del-1', text: 'Zoom seminerine 17:00 öncesi giriş yapıldı (Meeting ID: 926 3246 4963)', completed: false },
      { id: 'softtech-del-2', text: 'Öne çıkan veri bilimi platform ve araç notları çıkarıldı', completed: false }
    ]
  },

  // 1. NASA Space Apps Challenge
  {
    id: 'kariyer-nasa-space-apps',
    title: '🌌 NASA Space Apps Challenge Kayıtları & Global Hackathon',
    description: 'Dünyanın en büyük hackathonu. Global açık uydu ve uzay veri setleriyle yapay zeka, veri bilimi ve yazılım çözümleri üret. Kayıtları ve takımını kontrol et!\n\n🌐 Resmi Portal: https://www.spaceappschallenge.org/',
    startDate: '2026-10-01T09:00:00',
    endDate: '2026-10-05T23:59:00',
    allDay: true,
    location: 'Global Online / NASA Open Data Platform',
    link: 'https://www.spaceappschallenge.org/',
    type: 'workshop',
    program: 'kariyer-yetenek',
    isMandatory: false,
    color: '#0284c7', // light blue
    reminderMinutes: 1440, // 1 day
    priority: 'critical',
    tags: ['NASA', 'Hackathon', 'Açık Veri', 'Space Apps', 'Yapay Zeka', 'Global'],
    deliverables: [
      { id: 'nasa-del-1', text: 'spaceappschallenge.org üzerinden kayıt kontrol edildi', completed: false },
      { id: 'nasa-del-2', text: '2-4 kişilik multidisipliner hackathon takımı kuruldu', completed: false },
      { id: 'nasa-del-3', text: 'Python/AI veri analizi ve makine öğrenmesi şablonları hazırlandı', completed: false }
    ]
  },

  // 2. TÜBİTAK 2209-A 2. Dönem
  {
    id: 'kariyer-tubitak-2209a-donem2',
    title: '🏆 TÜBİTAK 2209-A 2. Dönem Proje Başvuruları (Güz Çağrısı)',
    description: 'Üniversite öğrencileri araştırma projeleri destekleme programı. Danışman akademisyen eşliğinde yapay zeka / veri bilimi araştırma projesi yazmak için başvuru penceresi.\n\n🌐 TYBS / BİDEB: https://tybs.tubitak.gov.tr/',
    startDate: '2026-10-15T09:00:00',
    endDate: '2026-11-15T17:30:00',
    allDay: true,
    location: 'TÜBİTAK BİDEB / TYBS Portalı',
    link: 'https://tybs.tubitak.gov.tr/',
    type: 'submission',
    program: 'tubitak-yarisma',
    isMandatory: true,
    color: '#059669', // emerald
    reminderMinutes: 1440,
    priority: 'critical',
    tags: ['TÜBİTAK', '2209-A', 'BİDEB', 'Akademik Ar-Ge', 'Lisans Hibesi'],
    deliverables: [
      { id: 'tubitak-d2-del-1', text: 'Danışman hoca ile proje konusu ve yöntem belirlendi', completed: false },
      { id: 'tubitak-d2-del-2', text: 'TYBS/BİDEB sistemi proje öneri formu ve bütçe tablosu dolduruldu', completed: false },
      { id: 'tubitak-d2-del-3', text: 'Danışman onay mektubu sisteme yüklendi', completed: false }
    ]
  },

  // 3. Google Oyun ve Uygulama Akademisi
  {
    id: 'kariyer-google-oyun-akademi',
    title: '📱 Google Oyun ve Uygulama Akademisi Yeni Dönem Başvuruları',
    description: 'Google Türkiye, Girişimcilik Vakfı ve T3 Girişim Merkezi ortaklığında Flutter, Unity ve teknoloji girişimciliği eğitim bursu yeni dönem başvuruları.\n\n🌐 Portal: https://oyunveuygulamaakademisi.com/',
    startDate: '2026-11-15T09:00:00',
    endDate: '2026-12-10T23:59:00',
    allDay: true,
    location: 'oyunveuygulamaakademisi.com',
    link: 'https://oyunveuygulamaakademisi.com/',
    type: 'submission',
    program: 'kariyer-yetenek',
    isMandatory: false,
    color: '#4f46e5', // indigo
    reminderMinutes: 720, // 12 hours
    priority: 'high',
    tags: ['Google', 'GUA', 'Flutter', 'Unity', 'Girişimcilik', 'Burs'],
    deliverables: [
      { id: 'gua-del-1', text: 'oyunveuygulamaakademisi.com başvuru formu dolduruldu', completed: false },
      { id: 'gua-del-2', text: 'Motivasyon videosu/metni hazırlandı', completed: false }
    ]
  },

  // 4. TEKNOFEST 2027 Proje Başvuruları
  {
    id: 'kariyer-teknofest-2027-basvuru',
    title: '🇹🇷 TEKNOFEST 2027 Proje & Takım Başvuruları (AquaGuard & AI)',
    description: 'AquaGuard (erken uyarı sistemi) veya yeni AI projeleriniz için Teknofest başvuruları açılıyor. İnsanlık Yararına Teknoloji, Sağlıkta Yapay Zeka, Tarım veya Çevre kategorisi. Ekibini topla ve KYS\'ye kaydet!\n\n🌐 KYS: https://www.t3kys.com/',
    startDate: '2026-11-25T09:00:00',
    endDate: '2027-02-20T23:59:00',
    allDay: true,
    location: 'T3 KYS Portalı (t3kys.com)',
    link: 'https://www.t3kys.com/',
    type: 'submission',
    program: 'teknofest-gonullu',
    isMandatory: true,
    color: '#e11d48', // rose
    reminderMinutes: 1440,
    priority: 'critical',
    tags: ['TEKNOFEST', 'AquaGuard', 'Milli Teknoloji', 'Yapay Zeka', 'KYS'],
    deliverables: [
      { id: 'tekno-del-1', text: 'KYS portalı üzerinden takım kaydı yapıldı', completed: false },
      { id: 'tekno-del-2', text: 'AquaGuard / AI projesi için kısa özet metin oluşturuldu', completed: false },
      { id: 'tekno-del-3', text: 'İlgili kategori şartnamesi incelendi', completed: false }
    ]
  },

  // 5. YetGen 1. Dönem Başvuruları
  {
    id: 'kariyer-yetgen-donem1',
    title: '💡 YetGen (Yetkin Gençler) 1. Dönem Başvuruları',
    description: '21. Yüzyıl yetkinlikleri, algoritmik düşünme, sunum teknikleri, veri okuryazarlığı ve network programı YetGen başvuruları.\n\n🌐 Portal: https://yetgen.org.tr/',
    startDate: '2026-12-15T09:00:00',
    endDate: '2027-01-10T23:59:00',
    allDay: true,
    location: 'yetgen.org.tr',
    link: 'https://yetgen.org.tr/',
    type: 'submission',
    program: 'kariyer-yetenek',
    isMandatory: false,
    color: '#8b5cf6', // purple
    reminderMinutes: 720,
    priority: 'medium',
    tags: ['YetGen', 'Yetkinlik', 'Liderlik', 'Algoritmik Düşünme'],
    deliverables: [
      { id: 'yetgen-del-1', text: 'yetgen.org.tr başvuru formu ve değerlendirme testi tamamlandı', completed: false }
    ]
  },

  // 6. Turkcell GNÇYTNK
  {
    id: 'kariyer-turkcell-gncytnk',
    title: '📱 Turkcell GNÇYTNK (Genç Yetenek & Uzun Dönem Staj)',
    description: 'Turkcell\'in yeni mezun, uzun dönem staj ve genç mühendis yetenek programı. Yapay zeka, veri bilimi ve yazılım mühendisliği pozisyonları.\n\n🌐 Kariyer: https://kariyerim.turkcell.com.tr/',
    startDate: '2027-01-15T09:00:00',
    endDate: '2027-02-20T23:59:00',
    allDay: true,
    location: 'Turkcell Kariyer Portalı',
    link: 'https://kariyerim.turkcell.com.tr/',
    type: 'submission',
    program: 'kariyer-yetenek',
    isMandatory: false,
    color: '#0284c7', // blue
    reminderMinutes: 1440,
    priority: 'high',
    tags: ['Turkcell', 'GNÇYTNK', 'Genç Yetenek', 'Staj', 'Veri Bilimi'],
    deliverables: [
      { id: 'turkcell-del-1', text: 'Güncel İngilizce/Türkçe CV yüklendi', completed: false },
      { id: 'turkcell-del-2', text: 'Genel yetenek ve online İngilizce değerlendirme sınavı provası yapıldı', completed: false }
    ]
  },

  // 7. Aselsan a Yetenek Programı
  {
    id: 'kariyer-aselsan-a-yetenek',
    title: '🛡️ Aselsan a Yetenek Programı (Aday Mühendislik & Staj)',
    description: 'Aselsan uzun dönem aday mühendis / stajyer başvuru dönemi. Savunma sanayii, gömülü yazılım, yapay zeka ve elektronik Ar-Ge departmanları.\n\n🌐 Aselsan Kariyer: https://kariyer.aselsan.com/',
    startDate: '2027-01-20T09:00:00',
    endDate: '2027-02-28T23:59:00',
    allDay: true,
    location: 'Aselsan Kariyer Portalı',
    link: 'https://kariyer.aselsan.com/',
    type: 'submission',
    program: 'cezeri-staj',
    isMandatory: false,
    color: '#0f766e', // teal
    reminderMinutes: 1440,
    priority: 'critical',
    tags: ['Aselsan', 'a Yetenek', 'Savunma Sanayii', 'Aday Mühendislik', 'Ar-Ge'],
    deliverables: [
      { id: 'aselsan-del-1', text: 'Transkript (güncel not dökümü) ve GitHub portfolyosu hazırlandı', completed: false },
      { id: 'aselsan-del-2', text: 'Aselsan Kariyer portalı profili güncellendi', completed: false }
    ]
  },

  // 8. Erasmus+ Staj ve Öğrenim Sınav İlanları
  {
    id: 'kariyer-erasmus-staj-ilan',
    title: '🌍 Erasmus+ Staj ve Öğrenim Sınav İlanları (Sivas Cumhuriyet Üni.)',
    description: 'Sivas Cumhuriyet Üniversitesi Dış İlişkiler (Erasmus) ofisini kontrol et. Avrupa\'da yazılım/veri bilimi yaz stajı veya öğrenim hareketliliği için dil sınavı ilanları ve hibe başvurusu.\n\n🌐 SCÜ Dış İlişkiler: https://erasmus.cumhuriyet.edu.tr/',
    startDate: '2027-02-01T09:00:00',
    endDate: '2027-02-28T23:59:00',
    allDay: true,
    location: 'Sivas Cumhuriyet Üniversitesi Dış İlişkiler Ofisi',
    link: 'https://erasmus.cumhuriyet.edu.tr/',
    type: 'submission',
    program: 'kariyer-yetenek',
    isMandatory: false,
    color: '#6366f1', // indigo
    reminderMinutes: 1440,
    priority: 'high',
    tags: ['Erasmus+', 'Staj Hareketliliği', 'SCÜ', 'Avrupa', 'Yabancı Dil'],
    deliverables: [
      { id: 'erasmus-del-1', text: 'Üniversite Dış İlişkiler (Erasmus) duyurusu kontrol edildi', completed: false },
      { id: 'erasmus-del-2', text: 'Yabancı dil yazılı/sözlü sınav kaydı yapıldı', completed: false }
    ]
  },

  // 9. TUSAŞ Lift Up Programı
  {
    id: 'kariyer-tusas-lift-up',
    title: '✈️ TUSAŞ Lift Up Sanayi Odaklı Lisans Bitirme Projeleri',
    description: 'Savunma sanayiinde havacılık ve uzay sanayiine yönelik sanayi odaklı lisans bitirme projesi ve aday mühendislik destek programı.\n\n🌐 Lift Up: https://liftup.tusas.com/',
    startDate: '2027-03-01T09:00:00',
    endDate: '2027-03-30T23:59:00',
    allDay: true,
    location: 'TUSAŞ Lift Up Portalı',
    link: 'https://liftup.tusas.com/',
    type: 'submission',
    program: 'cezeri-staj',
    isMandatory: false,
    color: '#0369a1', // sky
    reminderMinutes: 720,
    priority: 'high',
    tags: ['TUSAŞ', 'Lift Up', 'Havacılık', 'Bitirme Tezi', 'Aday Mühendislik'],
    deliverables: [
      { id: 'tusas-del-1', text: 'Lift Up portalındaki sanayi tez konuları incelendi', completed: false },
      { id: 'tusas-del-2', text: 'Bölüm bitirme tezi danışman hocasıyla konu eşleştirildi', completed: false }
    ]
  },

  // 10. TÜBİTAK 2209-A 1. Dönem Proje Başvuruları (İlkbahar)
  {
    id: 'kariyer-tubitak-2209a-donem1',
    title: '🔬 TÜBİTAK 2209-A 1. Dönem Proje Başvuruları (İlkbahar Çağrısı)',
    description: 'İlkbahar dönemi lisans araştırma projeleri hibe başvuruları açılıyor. Bilimsel araştırma önerileri ve makine öğrenmesi projeleri için devlet hibesi.\n\n🌐 TYBS: https://tybs.tubitak.gov.tr/',
    startDate: '2027-03-15T09:00:00',
    endDate: '2027-04-15T17:30:00',
    allDay: true,
    location: 'TÜBİTAK BİDEB / TYBS Portalı',
    link: 'https://tybs.tubitak.gov.tr/',
    type: 'submission',
    program: 'tubitak-yarisma',
    isMandatory: true,
    color: '#047857', // emerald
    reminderMinutes: 1440,
    priority: 'critical',
    tags: ['TÜBİTAK', '2209-A', 'Bahar Çağrısı', 'Araştırma Hilesi', 'BİDEB'],
    deliverables: [
      { id: 'tubitak-d1-del-1', text: 'Yeni araştırma metodolojisi ve literatür taraması hazırlandı', completed: false }
    ]
  },

  // 11. Koç Holding Genç Yetenek & Kuveyt Türk Lonca
  {
    id: 'kariyer-koc-lonca-girisim',
    title: '🏦 Koç Holding Genç Yetenek & Kuveyt Türk Lonca Kuluçka',
    description: 'Bahar dönemi teknoloji ve bankacılık start-up hızlandırıcı/kuluçka ve holding genç yetenek staj/istihdam programları.\n\n🌐 Lonca: https://loncagirisim.com/ | Koç Kariyerim: https://kockariyerim.com/',
    startDate: '2027-04-01T09:00:00',
    endDate: '2027-04-30T23:59:00',
    allDay: true,
    location: 'Lonca Girişimcilik / Koç Kariyerim',
    link: 'https://loncagirisim.com/',
    type: 'submission',
    program: 'kariyer-yetenek',
    isMandatory: false,
    color: '#ca8a04', // amber/gold
    reminderMinutes: 720,
    priority: 'medium',
    tags: ['Koç Holding', 'Lonca', 'Fintek', 'Kuluçka', 'Start-up', 'Bankacılık'],
    deliverables: [
      { id: 'koc-del-1', text: 'Lonca Girişimcilik / Koç Kariyer portalı başvurusu tamamlandı', completed: false }
    ]
  },

  // 12. Küresel Topluluk Liderlikleri (Google GDSC & Microsoft MLSA)
  {
    id: 'kariyer-gdsc-mlsa-liderlik',
    title: '👩‍💻 Küresel Topluluk Liderlikleri (Google GDSC & Microsoft MLSA)',
    description: 'Microsoft Learn Student Ambassadors (MLSA) ve Google Developer Student Clubs (GDSC) çekirdek ekip ve liderlik seçimleri.\n\n🌐 MLSA: https://studentambassadors.microsoft.com/ | Google Developers: https://developers.google.com/community/gdsc',
    startDate: '2026-09-01T09:00:00',
    endDate: '2026-09-30T23:59:00',
    allDay: true,
    location: 'Online / Kampüs Çekirdek Ekip',
    link: 'https://studentambassadors.microsoft.com/',
    type: 'milestone',
    program: 'kariyer-yetenek',
    isMandatory: false,
    color: '#2563eb', // blue
    reminderMinutes: 1440,
    priority: 'high',
    tags: ['Microsoft MLSA', 'Google GDSC', 'Topluluk Liderliği', 'Azure', 'AI'],
    deliverables: [
      { id: 'lead-del-1', text: 'studentambassadors.microsoft.com başvurusu gönderildi', completed: false },
      { id: 'lead-del-2', text: 'Kampüs GDSC lideri ve ekibiyle iletişime geçildi', completed: false }
    ]
  },

  // 13. Outreachy Kış Dönemi Başvuruları
  {
    id: 'kariyer-outreachy-kis',
    title: '🌐 Outreachy Kış Dönemi Başvuruları ($7,000 Burslu Remote Açık Kaynak Stajı)',
    description: 'Teknolojide az temsil edilen gruplara/kadın yazılımcılara özel $7,000 ödüllü küresel remote açık kaynak stajı. İlk aşama ön eleme formu ve katkı dönemi.\n\n🌐 Outreachy: https://www.outreachy.org/',
    startDate: '2026-08-10T09:00:00',
    endDate: '2026-08-30T23:59:00',
    allDay: true,
    location: 'Global Remote / outreachy.org',
    link: 'https://www.outreachy.org/',
    type: 'submission',
    program: 'kariyer-yetenek',
    isMandatory: false,
    color: '#ec4899', // pink
    reminderMinutes: 1440,
    priority: 'critical',
    tags: ['Outreachy', 'Açık Kaynak', 'Remote Staj', 'Dolar Hibesi', 'Global'],
    deliverables: [
      { id: 'outreachy-k-del-1', text: 'outreachy.org ön eleme formu ve motivasyon yazıları dolduruldu', completed: false },
      { id: 'outreachy-k-del-2', text: 'Açık kaynak organizasyonları listesi incelendi', completed: false }
    ]
  },

  // 14. Patika.dev & Kodluyoruz Güz Bootcamp Taraması
  {
    id: 'kariyer-patika-kodluyoruz-guz',
    title: '🚀 Patika.dev & Kodluyoruz Güz Bootcamp Taraması',
    description: 'Şirketlerin (Trendyol, Akbank vb.) iş garantili / staj garantili ücretsiz remote yazılım ve yapay zeka bootcamp ilanları dönemi. Platformdaki yeni açılan programları kontrol et!\n\n🌐 Patika.dev: https://www.patika.dev/ | Kodluyoruz: https://www.kodluyoruz.org/',
    startDate: '2026-10-01T09:00:00',
    endDate: '2026-10-05T23:59:00',
    allDay: true,
    location: 'patika.dev & kodluyoruz.org',
    link: 'https://www.patika.dev/',
    type: 'workshop',
    program: 'kariyer-yetenek',
    isMandatory: false,
    color: '#f97316', // orange
    reminderMinutes: 720,
    priority: 'high',
    tags: ['Patika.dev', 'Kodluyoruz', 'Bootcamp', 'İş Garantili', 'Yazılım'],
    deliverables: [
      { id: 'patika-del-1', text: 'patika.dev ve kodluyoruz.org aktif bootcamp ilanları kontrol edildi', completed: false },
      { id: 'patika-del-2', text: 'Teknik test ve algoritma sınavlarına başvuruldu', completed: false }
    ]
  },

  // 15. Outreachy Yaz Dönemi Başvuruları
  {
    id: 'kariyer-outreachy-yaz',
    title: '☀️ Outreachy Yaz Dönemi Başvuruları ($7,000 Burslu Remote Staj)',
    description: 'Mayıs ayında başlayacak yaz dönemi 3 aylık tam zamanlı remote açık kaynak stajı için ön başvurular açılıyor.\n\n🌐 Outreachy: https://www.outreachy.org/',
    startDate: '2027-01-15T09:00:00',
    endDate: '2027-02-05T23:59:00',
    allDay: true,
    location: 'Global Remote / outreachy.org',
    link: 'https://www.outreachy.org/',
    type: 'submission',
    program: 'kariyer-yetenek',
    isMandatory: false,
    color: '#d946ef', // fuchsia
    reminderMinutes: 1440,
    priority: 'high',
    tags: ['Outreachy', 'Yaz Stajı', 'Açık Kaynak', 'Remote', 'Global'],
    deliverables: [
      { id: 'outreachy-y-del-1', text: 'Yaz kohortu uygunluk formu dolduruldu', completed: false },
      { id: 'outreachy-y-del-2', text: 'Topluluk repo katkı dönemi (Contribution phase) takip edildi', completed: false }
    ]
  },

  // 16. MLH Fellowship Yaz Kohortu Başvuruları
  {
    id: 'kariyer-mlh-fellowship',
    title: '💻 MLH Fellowship Yaz Kohortu Başvuruları (GitHub & Meta Destekli)',
    description: 'Major League Hacking (MLH) tarafından GitHub ve Meta sponsorluğunda yürütülen 12 haftalık global remote staj/fellowship programı.\n\n🌐 MLH Fellowship: https://fellowship.mlh.io/',
    startDate: '2027-01-20T09:00:00',
    endDate: '2027-02-15T23:59:00',
    allDay: true,
    location: 'Global Remote / fellowship.mlh.io',
    link: 'https://fellowship.mlh.io/',
    type: 'submission',
    program: 'kariyer-yetenek',
    isMandatory: false,
    color: '#059669', // emerald
    reminderMinutes: 1440,
    priority: 'critical',
    tags: ['MLH Fellowship', 'GitHub', 'Meta', 'Açık Kaynak', 'Remote Staj'],
    deliverables: [
      { id: 'mlh-del-1', text: 'fellowship.mlh.io başvuru formu ve kod örnekleri (Code Sample) yüklendi', completed: false },
      { id: 'mlh-del-2', text: 'Teknik mülakat provası yapıldı', completed: false }
    ]
  },

  // 17. Google Summer of Code (GSoC) Öğrenci Başvuruları
  {
    id: 'kariyer-gsoc-basvuru',
    title: '☀️ Google Summer of Code (GSoC) Öğrenci & Proje Başvuruları',
    description: 'Açık kaynak organizasyonları (Apache, Linux, TensorFlow, Python vb.) duyuruldu! Kendi yapay zeka/yazılım proje önerini sunup Google\'dan doğrudan döviz hibeli staj hakkı alma dönemi.\n\n🌐 GSoC: https://summerofcode.withgoogle.com/',
    startDate: '2027-03-20T09:00:00',
    endDate: '2027-04-05T23:59:00',
    allDay: true,
    location: 'Google Open Source / summerofcode.withgoogle.com',
    link: 'https://summerofcode.withgoogle.com/',
    type: 'submission',
    program: 'kariyer-yetenek',
    isMandatory: false,
    color: '#ea4335', // google red
    reminderMinutes: 1440,
    priority: 'critical',
    tags: ['GSoC', 'Google', 'Summer of Code', 'Açık Kaynak', 'Hibe', 'AI'],
    deliverables: [
      { id: 'gsoc-del-1', text: 'GSoC kabul edilen organizasyonlar ve proje fikirleri (Ideas List) incelendi', completed: false },
      { id: 'gsoc-del-2', text: 'Proje önerisi (Proposal) hazırlanıp mentörlerle iletişime geçildi', completed: false },
      { id: 'gsoc-del-3', text: 'Resmi başvuru sistemi üzerinden proposal yüklendi', completed: false }
    ]
  },

  // 18. Bilişim Vadisi Açık Kaynak Yaz Kampı
  {
    id: 'kariyer-bilisim-vadisi-yaz-kampi',
    title: '🏕️ Bilişim Vadisi Açık Kaynak Yaz Kampı Başvuruları',
    description: 'Türkiye Açık Kaynak Platformu (TÜBİTAK BİLGEM & Bilişim Vadisi) uzaktan/hibrit katılımlı açık kaynak yazılım geliştirme kampı başvuruları.\n\n🌐 Bilişim Vadisi: https://bilisimvadisi.com.tr/ | TÜBİTAK BİLGEM',
    startDate: '2027-06-01T09:00:00',
    endDate: '2027-06-20T23:59:00',
    allDay: true,
    location: 'Bilişim Vadisi / Online Kampüs',
    link: 'https://bilisimvadisi.com.tr/',
    type: 'workshop',
    program: 'kariyer-yetenek',
    isMandatory: false,
    color: '#0891b2', // cyan
    reminderMinutes: 1440,
    priority: 'high',
    tags: ['Bilişim Vadisi', 'Açık Kaynak', 'Yaz Kampı', 'TÜBİTAK BİLGEM', 'Yazılım'],
    deliverables: [
      { id: 'bv-del-1', text: 'Bilişim Vadisi kamp başvuru formu dolduruldu', completed: false },
      { id: 'bv-del-2', text: 'Seçilen odak alanında ön değerlendirme görevi teslim edildi', completed: false }
    ]
  }
];
