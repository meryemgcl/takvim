import { CalendarEvent } from '../types';
import { ALL_COP31_EVENTS } from './cop31Events';
import { CAREER_TALENT_EVENTS } from './careerEvents';
import { ALL_PYTHON_100_EVENTS } from './python100Events';
import { CAREERGEN_BOOTCAMP_EVENTS } from './careerGenEvents';
import { AI_MASTERCLASS_EVENTS } from './aiMasterclassEvents';
import { TECH_ISTANBUL_BOOTCAMP_EVENTS } from './techIstanbulEvents';
import { NO_CODE_EVENTS } from './noCodeEvents';
import { AKBANK_PYTHON_EVENTS } from './akbankPythonEvents';

export const INITIAL_EVENTS: CalendarEvent[] = [
  // --- Akbank Python'a Giriş Eğitimi (7 - 27 Eylül 2026) ---
  ...AKBANK_PYTHON_EVENTS,

  // --- Pupilica: No-Code & Low-Code ile Fikirden Ürüne (15 - 24 Eylül 2026) ---
  ...NO_CODE_EVENTS,

  // --- Tech Istanbul: Uygulamalı Yapay Zekâ Geliştirme Bootcamp (8 Eylül - 8 Ekim 2026) ---
  ...TECH_ISTANBUL_BOOTCAMP_EVENTS,

  // --- PythianGo: Yapay Zeka Masterclass (26 Ağustos - 23 Eylül 2026) ---
  ...AI_MASTERCLASS_EVENTS,

  // --- CareerGen: Kariyere İlk Adım Bootcamp 1. Dönem ---
  ...CAREERGEN_BOOTCAMP_EVENTS,

  // --- Atıl Samancıoğlu - Python: 100 Günlük Yazılım Kampı (23 Ağustos - 7 Eylül 2026) ---
  ...ALL_PYTHON_100_EVENTS,

  // --- Kariyer, Teknoloji & Genç Yetenek Takvim Havuzu ---
  ...CAREER_TALENT_EVENTS,

  // --- COP31 Türkiye Gönüllülük Programı (akademi.csb.gov.tr) ---
  ...ALL_COP31_EVENTS,

  // --- Akbank Yapay Zeka ve Generative AI Giriş Eğitimi (User Prompt Events) ---
  {
    id: 'akbank-self-paced',
    title: '📚 Self-Paced Eğitim: Yapay Zekaya İlk Adım',
    description: 'Akbank Yapay Zeka ve Generative AI Giriş Eğitimi başlığı altında yer alan Yapay Zekaya İlk Adım self-paced eğitimini eğitim süresi boyunca tamamlamanız zorunludur.\n\nEğitimi tamamladıktan sonra My Certificates bölümünden aldığınız sertifikayı indirerek aşağıdaki forma yüklemeniz gerekmektedir.\n\nSertifika Yükleme Formu: https://forms.gle/RrFM4BtbtP1ph1Hn7',
    startDate: '2026-08-07T09:00:00',
    endDate: '2026-08-27T18:00:00',
    allDay: true,
    location: 'https://courses.10million.ai/',
    link: 'https://courses.10million.ai/',
    type: 'self-paced',
    program: 'akbank-genai',
    isMandatory: true,
    color: '#0284c7', // sky blue
    reminderMinutes: 1440 // 1 day before
  },
  {
    id: 'akbank-acilis-webinari',
    title: '🎉 Açılış Webinarı - Akbank Yapay Zeka Eğitimi',
    description: 'Akbank Yapay Zeka ve Generative AI Giriş Eğitimi Açılış Webinarı canlı yayını.\n\nYer: YouTube canlı yayını.',
    startDate: '2026-08-07T20:00:00',
    endDate: '2026-08-07T21:30:00',
    allDay: false,
    location: 'YouTube',
    link: 'https://youtube.com',
    type: 'webinar',
    program: 'akbank-genai',
    isMandatory: true,
    color: '#dc2626', // red/youtube
    reminderMinutes: 120 // 2 hours before
  },
  {
    id: 'akbank-tanisma-oturumu',
    title: '☕ Tanışma Oturumu & Q&A',
    description: 'Eğitim süreci hakkında bilgi alabileceğiniz, mentorlarınızla tanışarak sorularınızı iletebileceğiniz tanışma oturumudur.\n\nYer: Duyurular Kanalı (Teams linki paylaşılacaktır).',
    startDate: '2026-08-10T20:00:00',
    endDate: '2026-08-10T21:00:00',
    allDay: false,
    location: '📢 Duyurular Kanalı (MS Teams)',
    type: 'meeting',
    program: 'akbank-genai',
    isMandatory: false,
    color: '#4f46e5', // indigo
    reminderMinutes: 60 // 1 hour before
  },
  {
    id: 'akbank-egitim-webinari',
    title: '📖 Generative AI Eğitim Webinarı',
    description: 'Generative AI ve Yapay Zeka teknik içerik ve detaylı anlatım webiharı.\n\nYer: YouTube canlı yayını.',
    startDate: '2026-08-17T20:00:00',
    endDate: '2026-08-17T21:30:00',
    allDay: false,
    location: 'YouTube',
    link: 'https://youtube.com',
    type: 'webinar',
    program: 'akbank-genai',
    isMandatory: true,
    color: '#dc2626',
    reminderMinutes: 120 // 2 hours before
  },
  {
    id: 'akbank-mentor-toplantisi',
    title: '👩‍🏫 Mentor Toplantısı',
    description: 'Mentorlarınız ile bir araya gelip projeler ve eğitim konuları hakkında sorularınızı sorabileceğiniz oturum.\n\nYer: Duyurular kanalı (Teams linki paylaşılacaktır).',
    startDate: '2026-08-24T20:00:00',
    endDate: '2026-08-24T21:00:00',
    allDay: false,
    location: '📢 Duyurular Kanalı (MS Teams)',
    type: 'meeting',
    program: 'akbank-genai',
    isMandatory: false,
    color: '#059669', // emerald
    reminderMinutes: 60 // 1 hour before
  },
  {
    id: 'akbank-sertifika-son-gun',
    title: '🚨 Sertifika Yükleme Son Günü',
    description: 'Yapay Zekaya İlk Adım sertifikanızı My Certificates bölümünden indirip aşağıdaki Google Formuna yüklemek için son gün!\n\nForm Linki: https://forms.gle/RrFM4BtbtP1ph1Hn7',
    startDate: '2026-08-27T23:59:00',
    endDate: '2026-08-27T23:59:00',
    allDay: false,
    location: 'https://forms.gle/RrFM4BtbtP1ph1Hn7',
    link: 'https://forms.gle/RrFM4BtbtP1ph1Hn7',
    type: 'submission',
    program: 'akbank-genai',
    isMandatory: true,
    color: '#e11d48', // rose
    reminderMinutes: 1440 // 1 day before
  },

  // --- Komut Mühendisliği Programı (Attachment 1) ---
  {
    id: 'km-1',
    title: '💻 Yazılım ve Tasarım için Komut Mühendisliği - 1. Ders',
    description: 'Komut Mühendisliğine Giriş Programı Canlı Uygulama Oturumu',
    startDate: '2026-07-23T19:30:00',
    endDate: '2026-07-23T21:00:00',
    location: 'Online Canlı Ders',
    type: 'workshop',
    program: 'komut-muhendisligi',
    color: '#d97706' // amber
  },
  {
    id: 'km-2',
    title: '💻 Yazılım ve Tasarım için Komut Mühendisliği - 2. Ders',
    description: 'Komut Mühendisliğine Giriş Programı Canlı Uygulama Oturumu',
    startDate: '2026-07-28T19:30:00',
    endDate: '2026-07-28T21:00:00',
    location: 'Online Canlı Ders',
    type: 'workshop',
    program: 'komut-muhendisligi',
    color: '#d97706'
  },
  {
    id: 'km-3',
    title: '💻 Yazılım ve Tasarım için Komut Mühendisliği - 3. Ders',
    description: 'Komut Mühendisliğine Giriş Programı Canlı Uygulama Oturumu',
    startDate: '2026-07-30T19:30:00',
    endDate: '2026-07-30T21:00:00',
    location: 'Online Canlı Ders',
    type: 'workshop',
    program: 'komut-muhendisligi',
    color: '#d97706'
  },
  {
    id: 'km-4',
    title: '💻 Yazılım ve Tasarım için Komut Mühendisliği - 4. Ders',
    description: 'Komut Mühendisliğine Giriş Programı Canlı Uygulama Oturumu',
    startDate: '2026-08-04T19:30:00',
    endDate: '2026-08-04T21:00:00',
    location: 'Online Canlı Ders',
    type: 'workshop',
    program: 'komut-muhendisligi',
    color: '#d97706'
  },
  {
    id: 'km-5',
    title: '💻 Yazılım ve Tasarım için Komut Mühendisliği - 5. Ders',
    description: 'Komut Mühendisliğine Giriş Programı Canlı Uygulama Oturumu',
    startDate: '2026-08-06T19:30:00',
    endDate: '2026-08-06T21:00:00',
    location: 'Online Canlı Ders',
    type: 'workshop',
    program: 'komut-muhendisligi',
    color: '#d97706'
  },
  {
    id: 'edutech-prompt-muhendisligi-sinav',
    title: '📝 Edutech YZ Prompt Mühendisliği - Değerlendirme Sınavı',
    description: 'Edutech Yapay Zeka Prompt Mühendisliği Eğitimi katılımcı belirleme değerlendirme sınavı.\n\n👉 Sınav Bağlantısı: https://forms.gle/Byae1kBxuAzr5qGv9\n⏰ Tarih & Saat: 18 Ağustos Salı / 19:00 - 20:00\n📌 Not: Eğitim programına katılacak adayların belirlenmesi amacıyla gerçekleştirilecektir.',
    startDate: '2026-08-18T19:00:00',
    endDate: '2026-08-18T20:00:00',
    allDay: false,
    location: 'Online (Google Forms)',
    link: 'https://forms.gle/Byae1kBxuAzr5qGv9',
    type: 'submission',
    program: 'komut-muhendisligi',
    isMandatory: true,
    color: '#d97706',
    reminderMinutes: 30
  },

  // --- Geleceğin Meslekleri Program Takvimi (Attachment 2) ---
  {
    id: 'gm-m1',
    title: '🚀 1. Modül: İçsel Mimariyi İnşa Etmek (Zihniyet & Kimlik)',
    description: 'Canlı Oturumlar: 4 Ağu Salı (19:30-20:30), 8 Ağu Cmt (10:00-13:30)',
    startDate: '2026-08-03T10:00:00',
    endDate: '2026-08-08T13:30:00',
    location: 'Online',
    type: 'workshop',
    program: 'gelecegin-meslekleri',
    color: '#7c3aed' // purple
  },
  {
    id: 'gm-m2',
    title: '🚀 2. Modül: "Biz" Bilinci ve Sosyal Bağlar',
    description: 'Canlı Oturumlar: 18 Ağu Salı (19:30-20:30), 22 Ağu Cmt (10:00-13:30)',
    startDate: '2026-08-10T10:00:00',
    endDate: '2026-08-15T13:30:00',
    location: 'Online',
    type: 'workshop',
    program: 'gelecegin-meslekleri',
    color: '#7c3aed'
  },
  {
    id: 'gm-m3',
    title: '🚀 3. Modül: Çağı Okuma ve Dijital Dünyaya Hâkimiyet',
    description: 'Canlı Oturumlar: 1 Eyl Salı (19:30-20:30), 5 Eyl Cmt (10:00-13:30)',
    startDate: '2026-08-31T10:00:00',
    endDate: '2026-09-05T13:30:00',
    location: 'Online',
    type: 'workshop',
    program: 'gelecegin-meslekleri',
    color: '#7c3aed'
  },
  {
    id: 'gm-m4',
    title: '🚀 4. Modül: Yetkinlikleri Somut Eylemlere Dönüştürmek',
    description: 'Canlı Oturumlar: 15 Eyl Salı (19:30-20:30), 19 Eyl Cmt (10:00-13:30)',
    startDate: '2026-09-14T10:00:00',
    endDate: '2026-09-19T13:30:00',
    location: 'Online',
    type: 'workshop',
    program: 'gelecegin-meslekleri',
    color: '#7c3aed'
  },

  // --- TEKNOFEST Gönüllü Akademisi Vazife Programı ---
  {
    id: 'teknofest-cumartesi',
    title: '🇹🇷 TEKNOFEST Gönüllü Akademisi: Sorumluluk & Vakıf Bilinci & Anı Oturumu',
    description: 'TEKNOFEST Gönüllü Akademisi Vazife Programı Cumartesi Oturumu.\n\nEğitim Akışı:\n1. Sorumluluk Bilinci ve Vakıf Bilinci eğitimi\n2. Deneyimli gönüllülerimizle keyifli Anı & Hatıra Oturumu\n\n📌 Katılım Notu: Değerlendirme sürecinizde + puan sağlayacaktır.',
    startDate: '2026-08-08T18:00:00',
    endDate: '2026-08-08T21:00:00',
    location: 'Online Canlı Eğitim',
    type: 'workshop',
    program: 'teknofest-gonullu',
    isMandatory: false,
    color: '#0d9488', // teal
    reminderMinutes: 120 // 2 hours before
  },
  {
    id: 'teknofest-pazar',
    title: '🇹🇷 TEKNOFEST Gönüllü Akademisi: Temel İlk Yardım & Proje Yönetimi',
    description: 'TEKNOFEST Gönüllü Akademisi Vazife Programı Pazar Oturumu.\n\nEğitim Akışı:\n1. Temel İlk Yardım Eğitimi\n2. Proje Yönetimi Eğitimi\n\n📌 Katılım Notu: Değerlendirme sürecinizde + puan sağlayacaktır.',
    startDate: '2026-08-09T18:00:00',
    endDate: '2026-08-09T21:00:00',
    location: 'Online Canlı Eğitim',
    type: 'workshop',
    program: 'teknofest-gonullu',
    isMandatory: false,
    color: '#0d9488', // teal
    reminderMinutes: 120 // 2 hours before
  },

  // --- Meta ile Yapay Zeka Dönüşüm Programı ---
  {
    id: 'meta-yapay-zeka-10agustos',
    title: '♾️ Meta ile Yapay Zeka Dönüşüm Programı Eğitimi',
    description: 'Meta ile Yapay Zeka Dönüşüm Programı kapsamında gerçekleştirilecek online eğitim.\n\n🔗 Katılım Linki: http://hd.tc/REpM\n🏛️ Düzenleyen: Habitat Derneği & Meta\n📞 İletişim Tel: 08503461125',
    startDate: '2026-08-10T15:00:00',
    endDate: '2026-08-10T17:30:00',
    location: 'Online (Habitat Derneği)',
    link: 'http://hd.tc/REpM',
    type: 'workshop',
    program: 'meta-yapay-zeka',
    isMandatory: false,
    color: '#2563eb', // blue
    reminderMinutes: 60 // 1 hour before
  },

  // --- Pupilica Etkinlikleri ---
  {
    id: 'pupilica-veri-bilimi',
    title: '📊 Veri Biliminde Popüler Araçlar ve Platformlar',
    description: 'Pupilica Canlı Eğitimi: Veri Biliminde Popüler Araçlar ve Platformlar.\n\n👨‍🏫 Eğitmen: Kaan Can Yılmaz\n🔗 Zoom Linki: https://softtech-tr.zoom.us/j/92632464963',
    startDate: '2026-09-17T17:00:00',
    endDate: '2026-09-17T18:30:00',
    location: 'Online (Zoom)',
    link: 'https://softtech-tr.zoom.us/j/92632464963',
    type: 'workshop',
    program: 'pupilica',
    isMandatory: false,
    color: '#0284c7', // sky blue
    reminderMinutes: 60
  },

  // --- Kültür & Sanat Sergileri ---
  {
    id: 'sergi-yasayan-miras-erzurum',
    title: '🖼️ Yaşayan Miras: Erzurum Sergisi',
    description: 'Kültürel Sergi: Yaşayan Miras Erzurum Sergisi (Ücretsiz Katılım).\n\n📍 Konum: Erzurum Müzesi\n⏰ Ziyaret Saatleri: 08:30 - 20:00',
    startDate: '2026-08-15T08:30:00',
    endDate: '2026-08-23T20:00:00',
    location: 'Erzurum Müzesi',
    type: 'other',
    program: 'sergi-kultur',
    isMandatory: false,
    color: '#d97706', // amber
    reminderMinutes: 1440 // 1 day before
  },
  {
    id: 'sergi-hane-islam-sanatlari',
    title: '🖼️ Hâne: İslam Sanatları Sergisi',
    description: 'Kültürel Sergi: Hâne İslam Sanatları Sergisi (Ücretsiz Katılım).\n\n📍 Konum: Yakutiye Medresesi Türk İslam Eserleri ve Etnografya Müzesi\n⏰ Ziyaret Saatleri: 08:00 - 19:00',
    startDate: '2026-08-15T08:00:00',
    endDate: '2026-08-23T19:00:00',
    location: 'Yakutiye Medresesi Türk İslam Eserleri ve Etnografya Müzesi',
    type: 'other',
    program: 'sergi-kultur',
    isMandatory: false,
    color: '#059669', // emerald
    reminderMinutes: 1440
  },
  {
    id: 'sergi-osmanli-mukaddes-emanetler',
    title: '🖼️ Osmanlı’nın Mukaddes Emanetleri Sergisi',
    description: 'Kültürel Sergi: Osmanlı’nın Mukaddes Emanetleri (Ücretsiz Katılım).\n\n📍 Konum: Erzurum Müzesi\n⏰ Ziyaret Saatleri: 08:30 - 20:00',
    startDate: '2026-08-15T08:30:00',
    endDate: '2026-08-23T20:00:00',
    location: 'Erzurum Müzesi',
    type: 'other',
    program: 'sergi-kultur',
    isMandatory: false,
    color: '#b45309', // warm amber/brown
    reminderMinutes: 1440
  },

  // --- Takım Çalışması & Girişimcilik Buluşmaları ---
  {
    id: 'takim-calismasi-04agustos',
    title: '🥳 Takım Çalışması Buluşması',
    description: 'Hadi bakalım, bolca güleceğimiz, hem takım çalışmamızı yapıp hem de harika işler çıkaracağımız bir buluşma bizi bekliyor! 🎯🎉\n\n📞 Telefonla katılım (yalnızca ses): (GB) +44 20 3937 3504 PIN: 575 920 365#\n🌐 Diğer numaralar: https://tel.meet/ayw-hznp-ybm?pin=5133080221635',
    startDate: '2026-08-04T19:30:00',
    endDate: '2026-08-04T20:30:00',
    location: 'Google Meet',
    link: 'https://meet.google.com/ayw-hznp-ybm',
    type: 'meeting',
    program: 'custom',
    isMandatory: false,
    color: '#ec4899', // pink
    reminderMinutes: 15
  },
  {
    id: 'girisimcilik-haftalik-toplanti-23agustos',
    title: '🚀 Girişimcilik & Fikir Geliştirme - Haftalık Toplantı',
    description: 'Girişimcilik, fikir geliştirme ve girişimcilik yolculuğu ile ilgilenen katılımcılar için haftalık buluşma! 🚀💡\n\n🎯 Odak: Bir problemi keşfetmek, fikir geliştirmek ve girişimcilik yolculuğunu paylaşmak.\n🔗 Google Meet Bağlantısı: https://meet.google.com/hhb-frgh-eun\n⏰ Saat: Pazar 18:00',
    startDate: '2026-08-23T18:00:00',
    endDate: '2026-08-23T19:30:00',
    location: 'Google Meet',
    link: 'https://meet.google.com/hhb-frgh-eun',
    type: 'meeting',
    program: 'custom',
    isMandatory: false,
    color: '#0284c7', // sky blue
    reminderMinutes: 30
  },

  // --- Kavcar YouTube Canlı Yayınları (Her Salı) ---
  {
    id: 'kavcar-canli-11agustos',
    title: '🔴 Kavcar Canlı Yayını (@kamilkavcar)',
    description: 'Dönem boyunca her Salı canlı yayın!\n\n⏰ Saat: 19:00 (TSİ)\n⏱️ Süre: 60 - 120 dakika arası\n📍 Yer: YouTube (@kamilkavcar)\n❓ Neden?: Merak ettiğin konular, sorular olursa diye.\n🎟️ Katılım Şartı: Yok.',
    startDate: '2026-08-11T19:00:00',
    endDate: '2026-08-11T21:00:00',
    location: 'YouTube (@kamilkavcar)',
    link: 'https://youtube.com/@kamilkavcar',
    type: 'webinar',
    program: 'kavcar-canli',
    isMandatory: false,
    color: '#dc2626', // red
    reminderMinutes: 30
  },
  {
    id: 'kavcar-canli-18agustos',
    title: '🔴 Kavcar Canlı Yayını (@kamilkavcar)',
    description: 'Dönem boyunca her Salı canlı yayın!\n\n⏰ Saat: 19:00 (TSİ)\n⏱️ Süre: 60 - 120 dakika arası\n📍 Yer: YouTube (@kamilkavcar)\n❓ Neden?: Merak ettiğin konular, sorular olursa diye.\n🎟️ Katılım Şartı: Yok.',
    startDate: '2026-08-18T19:00:00',
    endDate: '2026-08-18T21:00:00',
    location: 'YouTube (@kamilkavcar)',
    link: 'https://youtube.com/@kamilkavcar',
    type: 'webinar',
    program: 'kavcar-canli',
    isMandatory: false,
    color: '#dc2626',
    reminderMinutes: 30
  },
  {
    id: 'kavcar-canli-25agustos',
    title: '🔴 Kavcar Canlı Yayını (@kamilkavcar)',
    description: 'Dönem boyunca her Salı canlı yayın!\n\n⏰ Saat: 19:00 (TSİ)\n⏱️ Süre: 60 - 120 dakika arası\n📍 Yer: YouTube (@kamilkavcar)\n❓ Neden?: Merak ettiğin konular, sorular olursa diye.\n🎟️ Katılım Şartı: Yok.',
    startDate: '2026-08-25T19:00:00',
    endDate: '2026-08-25T21:00:00',
    location: 'YouTube (@kamilkavcar)',
    link: 'https://youtube.com/@kamilkavcar',
    type: 'webinar',
    program: 'kavcar-canli',
    isMandatory: false,
    color: '#dc2626',
    reminderMinutes: 30
  },
  {
    id: 'kavcar-canli-01eylul',
    title: '🔴 Kavcar Canlı Yayını (@kamilkavcar)',
    description: 'Dönem boyunca her Salı canlı yayın!\n\n⏰ Saat: 19:00 (TSİ)\n⏱️ Süre: 60 - 120 dakika arası\n📍 Yer: YouTube (@kamilkavcar)\n❓ Neden?: Merak ettiğin konular, sorular olursa diye.\n🎟️ Katılım Şartı: Yok.',
    startDate: '2026-09-01T19:00:00',
    endDate: '2026-09-01T21:00:00',
    location: 'YouTube (@kamilkavcar)',
    link: 'https://youtube.com/@kamilkavcar',
    type: 'webinar',
    program: 'kavcar-canli',
    isMandatory: false,
    color: '#dc2626',
    reminderMinutes: 30
  },

  // --- Burs Başvuruları ---
  {
    id: 'mukad-burs-basvurusu',
    title: '🎓 MÜKAD Burs Başvurusu (Mühendis Kadınlar Derneği)',
    description: 'MÜKAD (Mühendis Kadınlar Derneği) 2026-2027 Lisans Burs Başvuruları.\n\n📌 Şartlar: Mühendislik veya Mimarlık Fakültesi kız öğrencisi olmak, T.C. vatandaşı olmak.\n🌐 Başvuru Portalı: https://burs.mukad.org.tr',
    startDate: '2026-08-15T09:00:00',
    endDate: '2026-09-10T23:59:00',
    allDay: true,
    location: 'Online Başvuru (burs.mukad.org.tr)',
    link: 'https://burs.mukad.org.tr',
    type: 'submission',
    program: 'burs-basvuru',
    isMandatory: false,
    color: '#ea580c', // orange/amber
    reminderMinutes: 1440 // 1 day before
  },
  {
    id: 'tev-universite-burs-basvurusu',
    title: '🎓 TEV Üniversite (Eğitim) Burs Başvurusu',
    description: 'Türk Eğitim Vakfı (TEV) 2026-2027 Üniversite Eğitim Bursu Başvuruları.\n\n📌 Başvuru Yolu: Obigenç mobil uygulaması ve TEV resmi web sitesi (tev.org.tr) üzerinden alınmaktadır.\n🌐 Resmi İnternet Adresi: https://www.tev.org.tr',
    startDate: '2026-09-14T09:00:00',
    endDate: '2026-10-08T23:59:00',
    allDay: true,
    location: 'Obigenç Mobil Uygulaması & tev.org.tr',
    link: 'https://www.tev.org.tr',
    type: 'submission',
    program: 'burs-basvuru',
    isMandatory: false,
    color: '#0284c7', // sky blue
    reminderMinutes: 1440 // 1 day before
  },

  // --- Kastamonu Ar-Ge ve İnovasyon Proje Pazarı ---
  {
    id: 'kastamonu-arge-basvuru',
    title: '💡 Kastamonu Ar-Ge ve İnovasyon Proje Pazarı - Başvuru Süreci',
    description: 'Kastamonu Üniversitesi, Kastamonu Teknokent ve Teknoloji Transfer Ofisi (TTO) iş birliğiyle düzenlenen Kastamonu Ar-Ge ve İnovasyon Proje Pazarı başvuru dönemi.\n\n📅 Başvuru Tarihleri: 1 Haziran 2026 - 1 Eylül 2026\n📍 Kastamonu Üniversitesi Teknoloji Transfer Ofisi',
    startDate: '2026-06-01T09:00:00',
    endDate: '2026-09-01T23:59:00',
    allDay: true,
    location: 'Kastamonu Üniversitesi & Kastamonu Teknokent TTO',
    link: 'https://www.kastamonu.edu.tr',
    type: 'submission',
    program: 'arge-inovasyon',
    isMandatory: false,
    color: '#7c3aed', // violet
    reminderMinutes: 1440
  },
  {
    id: 'kastamonu-arge-kabul-ilani',
    title: '📢 Kastamonu Ar-Ge ve İnovasyon Proje Pazarı - Kabul Edilen Projelerin İlanı',
    description: 'Kastamonu Ar-Ge ve İnovasyon Proje Pazarı kapsamında jüri değerlendirmesinden geçerek kabul edilen projelerin ilan tarihi.\n\n📅 İlan Tarihi: 10 Ekim 2026',
    startDate: '2026-10-10T09:00:00',
    endDate: '2026-10-10T18:00:00',
    allDay: true,
    location: 'Kastamonu Üniversitesi TTO',
    link: 'https://www.kastamonu.edu.tr',
    type: 'submission',
    program: 'arge-inovasyon',
    isMandatory: false,
    color: '#2563eb', // blue
    reminderMinutes: 1440
  },
  {
    id: 'kastamonu-arge-poster-sunum',
    title: '📊 Kastamonu Ar-Ge ve İnovasyon Proje Pazarı - Poster Sunumu & Sergi',
    description: 'Kabul edilen projelerin poster sunumlarının gerçekleştirileceği ve inovasyon projelerinin sergileneceği ana etkinlik tarihi.\n\n📅 Etkinlik Tarihi: 17 Ekim 2026',
    startDate: '2026-10-17T09:00:00',
    endDate: '2026-10-17T17:00:00',
    allDay: false,
    location: 'Kastamonu Üniversitesi & Teknokent Etkinlik Alanı',
    link: 'https://www.kastamonu.edu.tr',
    type: 'workshop',
    program: 'arge-inovasyon',
    isMandatory: false,
    color: '#059669', // emerald
    reminderMinutes: 1440
  },

  // --- Türk Tarih Kurumu (TTK) Mobil Kitap Satış Mağazası ---
  {
    id: 'ttk-erzurum-kitap-magazasi',
    title: '📚 TTK Mobil Kitap Satış Mağazası - Erzurum',
    description: 'Türk Tarih Kurumu (TTK) "Her Eve Bir Tarih Kitabı" Ağustos Güzergâhı.\n\n📖 Mobil Kitap Satış Mağazası, Türk Tarih Kurumu yayınlarını ve yazarlarını Erzurumlu okurlarla buluşturuyor.\n📍 Konum: Erzurum\n📅 Tarih: 15-16 Ağustos 2026',
    startDate: '2026-08-15T09:00:00',
    endDate: '2026-08-16T20:00:00',
    allDay: true,
    location: 'Erzurum (TTK Mobil Satış Aracı)',
    link: 'https://www.ttk.gov.tr',
    type: 'other',
    program: 'sergi-kultur',
    isMandatory: false,
    color: '#991b1b', // TTK burgundy red
    reminderMinutes: 1440
  },

  // --- TSSTT Savunma Sanayiinde Yapay Zekâ Söyleşisi ---
  {
    id: 'tsstt-savunma-sanayiinde-yapay-zeka',
    title: '🚀 TSSTT: Savunma Sanayiinde Yapay Zekânın Stratejik Konumu',
    description: 'Türkiye Savunma Sanayi Teknolojileri Topluluğu (TSSTT) Söyleşileri.\n\n🎙️ Konuşmacı: Levent ERİKAN (Danışman)\n\n📌 Konular:\n• Yapay zekânın savunma sanayii açısından stratejik önemi\n• Karar destek, kaynak yönetimi ve tehdit değerlendirme süreçleri\n• İnsan-yapay zekâ iş birliği ve ulusal güvenlik perspektifi\n• Veri manipülasyon riskleri ve insan denetimi\n\n📜 Şartları sağlayanlara Dijital Katılım Belgesi verilecektir.\n🎟️ Katılım ücretsizdir.\n🔗 Başvuru: https://lnkd.in/dtDR5a5D',
    startDate: '2026-08-28T14:00:00',
    endDate: '2026-08-28T15:30:00',
    allDay: false,
    location: 'Çevrim içi – Microsoft Teams',
    link: 'https://lnkd.in/dtDR5a5D',
    type: 'webinar',
    program: 'custom',
    isMandatory: false,
    color: '#1e40af', // deep royal blue
    reminderMinutes: 30
  },

  // --- CEZERİ 2027 Yaz Dönemi Stajı ---
  {
    id: 'cezeri-2027-yaz-son-basvuru',
    title: '📝 CEZERİ 2027 Yaz Dönemi Stajı - Son Başvuru Tarihi',
    description: 'CEZERİ 2027 Yaz Dönemi Staj Programı son başvuru tarihi.\n\n📅 Son Başvuru: 09 Şubat 2027\n🌐 Resmi Portal: https://www.cezeri.com',
    startDate: '2027-02-09T09:00:00',
    endDate: '2027-02-09T23:59:00',
    allDay: true,
    location: 'Online Başvuru (cezeri.com)',
    link: 'https://www.cezeri.com',
    type: 'submission',
    program: 'cezeri-staj',
    isMandatory: true,
    color: '#2563eb', // blue
    reminderMinutes: 1440
  },
  {
    id: 'cezeri-2027-yaz-sinav-mulakat',
    title: '📋 CEZERİ 2027 Yaz Dönemi - Sınav ve Video Mülakatlar',
    description: 'CEZERİ 2027 Yaz Dönemi Stajı sınav ve video mülakatların gerçekleştirilmesi süreci.\n\n📅 Tarih Aralığı: 16 Şubat 2027 - 18 Şubat 2027',
    startDate: '2027-02-16T09:00:00',
    endDate: '2027-02-18T23:59:00',
    allDay: true,
    location: 'Çevrim içi Sınav & Mülakat Portalı',
    link: 'https://www.cezeri.com',
    type: 'workshop',
    program: 'cezeri-staj',
    isMandatory: true,
    color: '#0891b2', // cyan
    reminderMinutes: 1440
  },
  {
    id: 'cezeri-2027-yaz-degerlendirme',
    title: '🔍 CEZERİ 2027 Yaz Dönemi - Değerlendirme Süreci',
    description: 'CEZERİ 2027 Yaz Dönemi Staj başvuruları değerlendirme ve puanlama dönemi.\n\n📅 Tarih Aralığı: 18 Şubat 2027 - 14 Nisan 2027',
    startDate: '2027-02-18T09:00:00',
    endDate: '2027-04-14T23:59:00',
    allDay: true,
    location: 'CEZERİ İnsan Kaynakları',
    type: 'other',
    program: 'cezeri-staj',
    isMandatory: false,
    color: '#6366f1', // indigo
    reminderMinutes: 1440
  },
  {
    id: 'cezeri-2027-yaz-sonuc-bildirimi',
    title: '📢 CEZERİ 2027 Yaz Dönemi - Sonuçların Bildirilmesi',
    description: 'CEZERİ 2027 Yaz Dönemi Staj başvuru sonuçlarının adaylara duyurulması.\n\n📅 Tarih Aralığı: 15 Nisan 2027 - 21 Nisan 2027',
    startDate: '2027-04-15T09:00:00',
    endDate: '2027-04-21T23:59:00',
    allDay: true,
    location: 'Aday Başvuru Portalı / E-posta',
    link: 'https://www.cezeri.com',
    type: 'submission',
    program: 'cezeri-staj',
    isMandatory: false,
    color: '#16a34a', // green
    reminderMinutes: 1440
  },
  {
    id: 'cezeri-2027-yaz-1-donem-staj',
    title: '🏢 CEZERİ 2027 Yaz - 1. Staj Dönemi',
    description: 'CEZERİ 2027 Yaz Dönemi 1. Grup Staj Çalışma Dönemi.\n\n📅 Tarih Aralığı: 22 Haziran 2027 - 08 Ağustos 2027',
    startDate: '2027-06-22T09:00:00',
    endDate: '2027-08-08T18:00:00',
    allDay: true,
    location: 'CEZERİ Ar-Ge / Çalışma Ofisi',
    link: 'https://www.cezeri.com',
    type: 'workshop',
    program: 'cezeri-staj',
    isMandatory: true,
    color: '#0d9488', // teal
    reminderMinutes: 1440
  },
  {
    id: 'cezeri-2027-yaz-2-donem-staj',
    title: '🏢 CEZERİ 2027 Yaz - 2. Staj Dönemi',
    description: 'CEZERİ 2027 Yaz Dönemi 2. Grup Staj Çalışma Dönemi.\n\n📅 Tarih Aralığı: 10 Ağustos 2027 - 26 Eylül 2027',
    startDate: '2027-08-10T09:00:00',
    endDate: '2027-09-26T18:00:00',
    allDay: true,
    location: 'CEZERİ Ar-Ge / Çalışma Ofisi',
    link: 'https://www.cezeri.com',
    type: 'workshop',
    program: 'cezeri-staj',
    isMandatory: true,
    color: '#0d9488', // teal
    reminderMinutes: 1440
  },

  // --- CEZERİ 2027 Güz Dönemi Stajı ---
  {
    id: 'cezeri-2027-guz-son-basvuru',
    title: '📝 CEZERİ 2027 Güz Dönemi Stajı - Son Başvuru Tarihi',
    description: 'CEZERİ 2027 Güz Dönemi Staj Programı son başvuru tarihi.\n\n📅 Son Başvuru: 22 Haziran 2027\n🌐 Resmi Portal: https://www.cezeri.com',
    startDate: '2027-06-22T09:00:00',
    endDate: '2027-06-22T23:59:00',
    allDay: true,
    location: 'Online Başvuru (cezeri.com)',
    link: 'https://www.cezeri.com',
    type: 'submission',
    program: 'cezeri-staj',
    isMandatory: true,
    color: '#ea580c', // orange
    reminderMinutes: 1440
  },
  {
    id: 'cezeri-2027-guz-sinav-mulakat',
    title: '📋 CEZERİ 2027 Güz Dönemi - Sınav ve Video Mülakatlar',
    description: 'CEZERİ 2027 Güz Dönemi Stajı sınav ve video mülakatların gerçekleştirilmesi süreci.\n\n📅 Tarih Aralığı: 22 Haziran 2027 - 25 Haziran 2027',
    startDate: '2027-06-22T09:00:00',
    endDate: '2027-06-25T23:59:00',
    allDay: true,
    location: 'Çevrim içi Sınav & Mülakat Portalı',
    link: 'https://www.cezeri.com',
    type: 'workshop',
    program: 'cezeri-staj',
    isMandatory: true,
    color: '#d97706', // amber
    reminderMinutes: 1440
  },
  {
    id: 'cezeri-2027-guz-degerlendirme',
    title: '🔍 CEZERİ 2027 Güz Dönemi - Değerlendirme Süreci',
    description: 'CEZERİ 2027 Güz Dönemi Staj aday değerlendirme süreci.\n\n📅 Tarih Aralığı: 26 Haziran 2027 - 15 Ağustos 2027',
    startDate: '2027-06-26T09:00:00',
    endDate: '2027-08-15T23:59:00',
    allDay: true,
    location: 'CEZERİ İnsan Kaynakları',
    type: 'other',
    program: 'cezeri-staj',
    isMandatory: false,
    color: '#7c3aed', // purple
    reminderMinutes: 1440
  },
  {
    id: 'cezeri-2027-guz-sonuc-bildirimi',
    title: '📢 CEZERİ 2027 Güz Dönemi - Sonuçların Bildirilmesi',
    description: 'CEZERİ 2027 Güz Dönemi Staj başvuru sonuçlarının adaylara duyurulması.\n\n📅 Tarih Aralığı: 24 Ağustos 2027 - 31 Ağustos 2027',
    startDate: '2027-08-24T09:00:00',
    endDate: '2027-08-31T23:59:00',
    allDay: true,
    location: 'Aday Başvuru Portalı / E-posta',
    link: 'https://www.cezeri.com',
    type: 'submission',
    program: 'cezeri-staj',
    isMandatory: false,
    color: '#16a34a', // green
    reminderMinutes: 1440
  },
  {
    id: 'cezeri-2027-guz-donem-staj',
    title: '🏢 CEZERİ 2027 Güz - Staj Dönemi',
    description: 'CEZERİ 2027 Güz Dönemi Staj Çalışma Dönemi.\n\n📅 Staj Tarihleri: 05 Ekim 2027 - 15 Ocak 2028',
    startDate: '2027-10-05T09:00:00',
    endDate: '2028-01-15T18:00:00',
    allDay: true,
    location: 'CEZERİ Ar-Ge / Çalışma Ofisi',
    link: 'https://www.cezeri.com',
    type: 'workshop',
    program: 'cezeri-staj',
    isMandatory: true,
    color: '#047857', // emerald green
    reminderMinutes: 1440
  },

  // --- FERGANİ 2027 Yaz Dönemi Stajı ---
  {
    id: 'fergani-2027-yaz-son-basvuru',
    title: '📝 FERGANİ 2027 Yaz Dönemi Stajı - Son Başvuru Tarihi',
    description: 'FERGANİ Uzay Teknolojileri 2027 Yaz Dönemi Staj Programı son başvuru tarihi.\n\n📅 Son Başvuru: 09 Şubat 2027\n🌐 Resmi Web Sitesi: https://fergani.space',
    startDate: '2027-02-09T09:00:00',
    endDate: '2027-02-09T23:59:00',
    allDay: true,
    location: 'Online Başvuru (fergani.space)',
    link: 'https://fergani.space',
    type: 'submission',
    program: 'fergani-staj',
    isMandatory: true,
    color: '#8b5cf6', // violet
    reminderMinutes: 1440
  },
  {
    id: 'fergani-2027-yaz-sinav-mulakat',
    title: '📋 FERGANİ 2027 Yaz Dönemi - Sınav ve Video Mülakatlar',
    description: 'FERGANİ 2027 Yaz Dönemi Stajı sınav ve video mülakatların yapılması süreci.\n\n📅 Tarih Aralığı: 16 Şubat 2027 - 20 Şubat 2027',
    startDate: '2027-02-16T09:00:00',
    endDate: '2027-02-20T23:59:00',
    allDay: true,
    location: 'Çevrim içi Sınav & Mülakat Portalı',
    link: 'https://fergani.space',
    type: 'workshop',
    program: 'fergani-staj',
    isMandatory: true,
    color: '#6366f1', // indigo
    reminderMinutes: 1440
  },
  {
    id: 'fergani-2027-yaz-degerlendirme',
    title: '🔍 FERGANİ 2027 Yaz Dönemi - Değerlendirme Süreci',
    description: 'FERGANİ 2027 Yaz Dönemi Staj başvuruları değerlendirme dönemi.\n\n📅 Tarih Aralığı: 18 Şubat 2027 - 14 Nisan 2027',
    startDate: '2027-02-18T09:00:00',
    endDate: '2027-04-14T23:59:00',
    allDay: true,
    location: 'FERGANİ İnsan Kaynakları & Değerlendirme Kurulu',
    type: 'other',
    program: 'fergani-staj',
    isMandatory: false,
    color: '#4f46e5',
    reminderMinutes: 1440
  },
  {
    id: 'fergani-2027-yaz-sonuc-bildirimi',
    title: '📢 FERGANİ 2027 Yaz Dönemi - Sonuçların Bildirilmesi',
    description: 'FERGANİ 2027 Yaz Dönemi Staj başvuru sonuçlarının adaylara duyurulması.\n\n📅 Tarih Aralığı: 15 Nisan 2027 - 20 Nisan 2027',
    startDate: '2027-04-15T09:00:00',
    endDate: '2027-04-20T23:59:00',
    allDay: true,
    location: 'Aday Başvuru Portalı / E-posta',
    link: 'https://fergani.space',
    type: 'submission',
    program: 'fergani-staj',
    isMandatory: false,
    color: '#16a34a',
    reminderMinutes: 1440
  },
  {
    id: 'fergani-2027-yaz-1-donem-staj',
    title: '🛰️ FERGANİ 2027 Yaz - 1. Staj Dönemi',
    description: 'FERGANİ 2027 Yaz Dönemi 1. Grup Staj Çalışma Dönemi.\n\n📅 Tarih Aralığı: 22 Haziran 2027 - 08 Ağustos 2027',
    startDate: '2027-06-22T09:00:00',
    endDate: '2027-08-08T18:00:00',
    allDay: true,
    location: 'FERGANİ Uzay Teknolojileri Ar-Ge Merkezi',
    link: 'https://fergani.space',
    type: 'workshop',
    program: 'fergani-staj',
    isMandatory: true,
    color: '#9333ea',
    reminderMinutes: 1440
  },
  {
    id: 'fergani-2027-yaz-2-donem-staj',
    title: '🛰️ FERGANİ 2027 Yaz - 2. Staj Dönemi',
    description: 'FERGANİ 2027 Yaz Dönemi 2. Grup Staj Çalışma Dönemi.\n\n📅 Tarih Aralığı: 10 Ağustos 2027 - 26 Eylül 2027',
    startDate: '2027-08-10T09:00:00',
    endDate: '2027-09-26T18:00:00',
    allDay: true,
    location: 'FERGANİ Uzay Teknolojileri Ar-Ge Merkezi',
    link: 'https://fergani.space',
    type: 'workshop',
    program: 'fergani-staj',
    isMandatory: true,
    color: '#9333ea',
    reminderMinutes: 1440
  },

  // --- FERGANİ 2027 Güz Dönemi Stajı ---
  {
    id: 'fergani-2027-guz-son-basvuru',
    title: '📝 FERGANİ 2027 Güz Dönemi Stajı - Son Başvuru Tarihi',
    description: 'FERGANİ 2027 Güz Dönemi Staj Programı son başvuru tarihi.\n\n📅 Son Başvuru: 22 Haziran 2027\n🌐 Resmi Portal: https://fergani.space',
    startDate: '2027-06-22T09:00:00',
    endDate: '2027-06-22T23:59:00',
    allDay: true,
    location: 'Online Başvuru (fergani.space)',
    link: 'https://fergani.space',
    type: 'submission',
    program: 'fergani-staj',
    isMandatory: true,
    color: '#d946ef', // fuchsia
    reminderMinutes: 1440
  },
  {
    id: 'fergani-2027-guz-sinav-mulakat',
    title: '📋 FERGANİ 2027 Güz Dönemi - Sınav ve Video Mülakatlar',
    description: 'FERGANİ 2027 Güz Dönemi Stajı sınav ve video mülakatların gerçekleştirilmesi süreci.\n\n📅 Tarih Aralığı: 29 Haziran 2027 - 03 Temmuz 2027',
    startDate: '2027-06-29T09:00:00',
    endDate: '2027-07-03T23:59:00',
    allDay: true,
    location: 'Çevrim içi Sınav & Mülakat Portalı',
    link: 'https://fergani.space',
    type: 'workshop',
    program: 'fergani-staj',
    isMandatory: true,
    color: '#c026d3',
    reminderMinutes: 1440
  },
  {
    id: 'fergani-2027-guz-degerlendirme',
    title: '🔍 FERGANİ 2027 Güz Dönemi - Değerlendirme Süreci',
    description: 'FERGANİ 2027 Güz Dönemi Staj aday değerlendirme süreci.\n\n📅 Tarih Aralığı: 03 Temmuz 2027 - 15 Ağustos 2027',
    startDate: '2027-07-03T09:00:00',
    endDate: '2027-08-15T23:59:00',
    allDay: true,
    location: 'FERGANİ İnsan Kaynakları',
    type: 'other',
    program: 'fergani-staj',
    isMandatory: false,
    color: '#a21caf',
    reminderMinutes: 1440
  },
  {
    id: 'fergani-2027-guz-sonuc-bildirimi',
    title: '📢 FERGANİ 2027 Güz Dönemi - Sonuçların Bildirilmesi',
    description: 'FERGANİ 2027 Güz Dönemi Staj başvuru sonuçlarının adaylara duyurulması.\n\n📅 Tarih Aralığı: 24 Ağustos 2027 - 31 Ağustos 2027',
    startDate: '2027-08-24T09:00:00',
    endDate: '2027-08-31T23:59:00',
    allDay: true,
    location: 'Aday Başvuru Portalı / E-posta',
    link: 'https://fergani.space',
    type: 'submission',
    program: 'fergani-staj',
    isMandatory: false,
    color: '#16a34a',
    reminderMinutes: 1440
  },
  {
    id: 'fergani-2027-guz-donem-staj',
    title: '🛰️ FERGANİ 2027 Güz - Staj Dönemi',
    description: 'FERGANİ 2027 Güz Dönemi Staj Çalışma Dönemi.\n\n📅 Staj Tarihleri: 05 Ekim 2027 - 15 Ocak 2028',
    startDate: '2027-10-05T09:00:00',
    endDate: '2028-01-15T18:00:00',
    allDay: true,
    location: 'FERGANİ Uzay Teknolojileri Ar-Ge Merkezi',
    link: 'https://fergani.space',
    type: 'workshop',
    program: 'fergani-staj',
    isMandatory: true,
    color: '#7e22ce',
    reminderMinutes: 1440
  },

  // --- TÜBİTAK Bilim Genç Yarışma Takvimi ve Süreç Planlaması (Yol Haritası) ---
  {
    id: 'tubitak-fikir-tasarim-gelistirme',
    title: '💡 Fikir ve Tasarım Geliştirme (Yarışma Yol Haritası)',
    description: 'Yarışma Takvimi & Süreç Planlaması - 1. Aşama:\n\nBelirtilen kanvasları kullanarak fikrinizi bulup çizimlerini, 3D render\'larını ve teknik üretim detaylarını tamamlamalısınız.\n\n📅 Süreç: Şu an - 15 Ekim 2026',
    startDate: '2026-08-20T09:00:00',
    endDate: '2026-10-15T23:59:00',
    allDay: true,
    location: 'Bireysel & Takım Çalışması',
    link: 'https://bilimgenc.tubitak.gov.tr',
    type: 'workshop',
    program: 'tubitak-yarisma',
    isMandatory: true,
    color: '#0284c7', // sky blue
    reminderMinutes: 1440
  },
  {
    id: 'tubitak-dosya-hazirligi',
    title: '📁 Dosya Hazırlığı (Konsept Metni & 10 Sayfalık Sunum)',
    description: 'Yarışma Takvimi & Süreç Planlaması - 2. Aşama:\n\n• Konsept Tasarım Metni\'ni yazmalı,\n• 10 sayfalık Görsel Sunum dosyasını PDF olarak hazırlamalısınız.\n\n📅 Süreç: Ekim\'in Son Haftası (24 Ekim 2026 - 30 Ekim 2026)',
    startDate: '2026-10-24T09:00:00',
    endDate: '2026-10-30T23:59:00',
    allDay: true,
    location: 'Dosya & PDF Hazırlığı',
    link: 'https://bilimgenc.tubitak.gov.tr',
    type: 'submission',
    program: 'tubitak-yarisma',
    isMandatory: true,
    color: '#7c3aed', // purple
    reminderMinutes: 1440
  },
  {
    id: 'tubitak-son-basvuru-31ekim',
    title: '🚨 TÜBİTAK Bilim Genç Yarışması - Son Başvuru',
    description: 'TÜBİTAK Bilim Genç Yarışması Son Başvuru ve Dosya Yükleme!\n\nBu tarihe kadar tüm dosyalarınızı (Konsept Tasarım Metni, 10 sayfalık PDF Görsel Sunum, çizim ve render\'lar) https://bilimgenc.tubitak.gov.tr üzerinden sisteme yüklemelisiniz.\n\n⚠️ Dikkat: Bu tarihten ve saatten sonra sisteme evrak eklenemez!',
    startDate: '2026-10-31T23:59:00',
    endDate: '2026-10-31T23:59:00',
    allDay: false,
    location: 'https://bilimgenc.tubitak.gov.tr',
    link: 'https://bilimgenc.tubitak.gov.tr',
    type: 'submission',
    program: 'tubitak-yarisma',
    isMandatory: true,
    color: '#dc2626', // red
    reminderMinutes: 1440, // 1 day before
    trlLevel: 3,
    priority: 'critical',
    tags: ['TÜBİTAK', 'Yarışma', 'Son Başvuru', '10 Sayfalık Sunum', 'TRL-3'],
    deliverables: [
      { id: 'del-1', text: 'Tasarım kanvası ve problem tanımı tamamlandı', completed: false },
      { id: 'del-2', text: 'Teknik eskizler ve 3D CAD renderları üretildi', completed: false },
      { id: 'del-3', text: '10 sayfalık PDF konsept sunumu mizanpajlandı', completed: false },
      { id: 'del-4', text: 'bilimgenc.tubitak.gov.tr sistemine evraklar yüklendi', completed: false }
    ]
  },

  // --- TÜBİTAK 2209-A & B Üniversite Araştırma Projeleri ---
  {
    id: 'tubitak-2209-arastirma-projesi',
    title: '🏆 TÜBİTAK 2209-A Üniversite Öğrencileri Araştırma Projesi Başvurusu',
    description: 'TÜBİTAK Bilim İnsanı Destek Programları Başkanlığı (BİDEB) tarafından yürütülen 2209-A Üniversite Öğrencileri Araştırma Projeleri Destekleme Programı başvuru dönemi.\n\n📌 Danışman akademisyen eşliğinde araştırma önerisi, bütçe tablosu ve iş paketleri BİDEB sistemine yüklenmelidir.\n🌐 Başvuru: https://tybs.tubitak.gov.tr',
    startDate: '2026-10-15T09:00:00',
    endDate: '2026-11-20T17:30:00',
    allDay: true,
    location: 'Online Başvuru (tybs.tubitak.gov.tr)',
    link: 'https://tybs.tubitak.gov.tr',
    type: 'submission',
    program: 'tubitak-yarisma',
    isMandatory: false,
    color: '#059669',
    reminderMinutes: 1440,
    trlLevel: 3,
    priority: 'high',
    tags: ['TÜBİTAK 2209-A', 'BİDEB', 'Akademik Danışman', 'Ar-Ge Fonu', 'TRL-3'],
    deliverables: [
      { id: 't2209-1', text: 'Literatür taraması ve özgün değer yazıldı', completed: false },
      { id: 't2209-2', text: 'Akademik danışman onay mektubu alındı', completed: false },
      { id: 't2209-3', text: 'İş-zaman çizelgesi ve bütçe planı hazırlandı', completed: false }
    ]
  },

  // --- TEKNOFEST 2027 Havacılık & Uzay Yarışmaları Takvimi ---
  {
    id: 'teknofest-2027-yarisma-basvurulari',
    title: '🇹🇷 TEKNOFEST 2027 Teknoloji Yarışmaları - Başvuru Süreci',
    description: 'Milli Teknoloji Hamlesi kapsamında düzenlenen TEKNOFEST 2027 Havacılık, Uzay ve Teknoloji Festivali yarışma başvuruları.\n\n🚀 İHA, Savaşan İHA, Model Uydu, Yapay Zeka, Sağlıkta Yapay Zeka ve Çevre Teknolojileri kategorileri.\n🌐 Resmi Portal: https://www.teknofest.org',
    startDate: '2026-11-01T09:00:00',
    endDate: '2027-02-28T23:59:00',
    allDay: true,
    location: 'Kurumsal Yönetim Sistemi (KYS)',
    link: 'https://www.teknofest.org',
    type: 'submission',
    program: 'teknofest-gonullu',
    isMandatory: false,
    color: '#0d9488',
    reminderMinutes: 1440,
    trlLevel: 5,
    priority: 'high',
    tags: ['TEKNOFEST', 'İHA & Havacılık', 'KYS', 'Takım Başvurusu', 'TRL-5'],
    deliverables: [
      { id: 'tk-1', text: 'Takım üyeleri KYS portalına eklendi', completed: false },
      { id: 'tk-2', text: 'Kategori şartnamesi detaylı incelendi', completed: false },
      { id: 'tk-3', text: 'Ön Tasarım Raporu (ÖTR) taslağı oluşturuldu', completed: false }
    ]
  },

  // --- Girişimcilik & Patent / Fikri Mülkiyet Tescil Süreci ---
  {
    id: 'patent-turkpatent-tescil-sureci',
    title: '💡 TÜRKPATENT: Patent & Faydalı Model Başvuru Süreci',
    description: 'Ar-Ge projenizin yenilik basamağı içeren teknik çözümünün Türk Patent ve Marka Kurumu (TÜRKPATENT) EPATS sistemi üzerinden korunması.\n\n📜 Tarifname takımı, istemler ve teknik resimlerin yüklenmesi süreci.\n🌐 Resmi Portal: https://epats.turkpatent.gov.tr',
    startDate: '2026-11-05T09:00:00',
    endDate: '2026-12-15T18:00:00',
    allDay: true,
    location: 'EPATS Elektronik Patent Sistemi',
    link: 'https://epats.turkpatent.gov.tr',
    type: 'milestone',
    program: 'girisimcilik-patent',
    isMandatory: false,
    color: '#d97706',
    reminderMinutes: 1440,
    trlLevel: 4,
    priority: 'high',
    tags: ['Patent', 'TÜRKPATENT', 'EPATS', 'Faydalı Model', 'Fikri Mülkiyet', 'TRL-4'],
    deliverables: [
      { id: 'pat-1', text: 'Tekniğin bilinen durumu (Prior Art) araştırması yapıldı', completed: false },
      { id: 'pat-2', text: 'Tarifname ve istemler metni yazıldı', completed: false },
      { id: 'pat-3', text: 'EPATS üzerinden resmi harç yatırıldı ve dosya sunuldu', completed: false }
    ]
  },

  // --- TR72 Bölgesi: Yeşil Ekonomik Fırsatlar ve Zorluklar İstişare Toplantısı ---
  {
    id: 'tr72-yesil-ekonomik-firsatlar-toplantisi',
    title: 'ℹ️ [P3] TR72 Bölgesi: Yeşil Ekonomik Fırsatlar ve Zorluklar İstişare Toplantısı',
    description: 'TR72 Bölgesi’nde yeşil dönüşüm sürecindeki mevcut fırsatların, karşılaşılan temel güçlüklerin ve yeşil ekonomik faaliyetlerin değerlendirilmesi amacıyla gerçekleştirilecek çevrim içi istişare toplantısı.\n\nÖzellikle kadın ve genç istihdamına yönelik çalışmalar yürüten kurum, kuruluş ve paydaşlarımızın görüş ve değerlendirmeleri toplantı için önem taşımaktadır.\n\n🔗 Toplantı Linki: https://shorturl.at/SdbGG\n🆔 Toplantı Kimliği: 852 0484 8792\n🔑 Parola: 760833',
    startDate: '2026-09-16T14:00:00',
    endDate: '2026-09-16T16:00:00',
    allDay: false,
    location: 'Çevrim İçi (Toplantı ID: 852 0484 8792, Parola: 760833)',
    link: 'https://shorturl.at/SdbGG',
    type: 'meeting',
    program: 'arge-inovasyon',
    isMandatory: false,
    color: '#059669',
    reminderMinutes: 60,
    trlLevel: 3,
    priority: 'low',
    tags: ['Yeşil Dönüşüm', 'TR72', 'Yeşil Ekonomi', 'İstihdam', 'Kadın & Genç', 'Ar-Ge'],
    deliverables: [
      { 
        id: 'tr72-deliv-1', 
        text: '[Hazırlık]: Toplantı linki, kimlik (852 0484 8792) ve parola (760833) doğrulandı; yeşil dönüşüm ve istihdam notları hazırlandı.', 
        completed: false 
      },
      { 
        id: 'tr72-deliv-2', 
        text: '[Uygulama]: 14:00 - 16:00 çevrim içi istişare oturumuna aktif katılım sağlandı, bölgesel ekonomik fırsatlar ve zorluklar not alındı.', 
        completed: false 
      },
      { 
        id: 'tr72-deliv-3', 
        text: '[Teslimat / Takip]: Toplantı çıktıları derlendi, Ar-Ge ve sürdürülebilirlik proje fikirleri havuzuna işlendi.', 
        completed: false 
      }
    ]
  }
];
