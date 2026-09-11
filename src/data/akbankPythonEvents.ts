import { CalendarEvent } from '../types';

export const AKBANK_PYTHON_EVENTS: CalendarEvent[] = [
  // Self-Paced Eğitim Süreci (7 - 27 Eylül 2026)
  {
    id: 'akbank-python-self-paced',
    title: "📚 Akbank Python'a Giriş: Self-Paced Eğitimler (10million.AI)",
    description: `Akbank Python'a Giriş Eğitimi Takvimi @everyone

📚 Self-Paced Eğitimler
📅 Tarih: 7 Eylül 2026 – 27 Eylül 2026
🌐 Platform: https://courses.10million.ai/login

Akbank Python'a Giriş Eğitimi kapsamında 10million.AI platformunda hesabınıza tanımlanan aşağıdaki iki eğitimi 27 Eylül 2026 tarihine kadar sırasıyla tamamlamanız beklenmektedir:

1️⃣ Yapay Zekaya İlk Adım
2️⃣ Introduction to Python

⚠️ Önemli Sıralama:
Öncelikle "Yapay Zekaya İlk Adım" eğitimini, ardından "Introduction to Python" eğitimini tamamlamanız gerekmektedir.

🎖️ Sertifika:
Program kapsamında tanımlanan kursları başarıyla tamamlamanız halinde sertifikalarınız 10million.AI platformundaki hesabınıza tanımlanacaktır.`,
    startDate: '2026-09-07T09:00:00',
    endDate: '2026-09-27T23:59:00',
    allDay: true,
    location: '10million.AI (https://courses.10million.ai/login)',
    link: 'https://courses.10million.ai/login',
    type: 'self-paced',
    program: 'akbank-python',
    isMandatory: true,
    color: '#e11d48', // Akbank Red
    reminderMinutes: 1440,
    priority: 'critical',
    tags: ['Akbank', 'Python', 'Yapay Zeka', '10million.AI', 'Self-Paced', 'Sertifika'],
    deliverables: [
      { id: 'akp-del-1', text: 'courses.10million.ai/login adresinden hesaba giriş yapıldı', completed: false },
      { id: 'akp-del-2', text: '1. Kurs: Yapay Zekaya İlk Adım eğitimi tamamlandı', completed: false },
      { id: 'akp-del-3', text: '2. Kurs: Introduction to Python eğitimi tamamlandı', completed: false },
      { id: 'akp-del-4', text: 'Her iki eğitimin bitirme sertifikası kontrol edildi', completed: false }
    ]
  },

  // 1. Mentor Toplantısı - 11 Eylül 2026 Cuma
  {
    id: 'akbank-python-mentor-1',
    title: '☕ Akbank Python: 1. Mentor Toplantısı & Tanışma',
    description: `☕ Mentor Toplantısı - Akbank Python'a Giriş Eğitimi

📅 Tarih: 11 Eylül 2026 Cuma
⏰ Saat: 20:00 – 21:00 (Oturum saati ve linki kanalda paylaşılacaktır)
📍 Yer: 📢 Duyurular kanalında toplantı bağlantısı paylaşılacaktır.

🎯 Amaç:
Eğitim süreciyle ilgili sorularınızı iletebileceğiniz, mentorlarınızla tanışabileceğiniz ve öğrenme süreciniz boyunca destek alabileceğiniz bir oturumdur.`,
    startDate: '2026-09-11T20:00:00',
    endDate: '2026-09-11T21:00:00',
    allDay: false,
    location: '📢 Duyurular Kanalı (Toplantı Bağlantısı Paylaşılacak)',
    link: 'https://courses.10million.ai/login',
    type: 'meeting',
    program: 'akbank-python',
    isMandatory: false,
    color: '#e11d48',
    reminderMinutes: 60,
    priority: 'high',
    tags: ['Akbank', 'Python', 'Mentor Toplantısı', 'Tanışma', 'Q&A', '10million.AI'],
    deliverables: [
      { id: 'akp-del-5', text: 'Duyurular kanalındaki toplantı bağlantısı kontrol edildi', completed: false },
      { id: 'akp-del-6', text: 'Mentor tanışma oturumuna katılıp sorular iletildi', completed: false }
    ]
  },

  // 2. Mentor Toplantısı - 17 Eylül 2026 Perşembe
  {
    id: 'akbank-python-mentor-2',
    title: '👩‍🏫 Akbank Python: 2. Mentor Toplantısı & Soru-Cevap',
    description: `👩‍🏫 Mentor Toplantısı - Akbank Python'a Giriş Eğitimi

📅 Tarih: 17 Eylül 2026 Perşembe
⏰ Saat: 20:00 – 21:00 (Oturum saati ve linki kanalda paylaşılacaktır)
📍 Yer: 📢 Duyurular kanalında toplantı bağlantıları paylaşılacaktır.

🎯 Amaç:
Python temelleri, Yapay Zekaya İlk Adım ve eğitim platformundaki uygulamalarla ilgili sorularınızı mentorlarınıza danışabileceğiniz destek oturumu.`,
    startDate: '2026-09-17T20:00:00',
    endDate: '2026-09-17T21:00:00',
    allDay: false,
    location: '📢 Duyurular Kanalı (Toplantı Bağlantısı Paylaşılacak)',
    link: 'https://courses.10million.ai/login',
    type: 'meeting',
    program: 'akbank-python',
    isMandatory: false,
    color: '#e11d48',
    reminderMinutes: 60,
    priority: 'high',
    tags: ['Akbank', 'Python', 'Mentorluk', 'Soru-Cevap', 'Duyurular'],
    deliverables: [
      { id: 'akp-del-7', text: 'Duyurular kanalından paylaşılan toplantı linkine giriş yapıldı', completed: false },
      { id: 'akp-del-8', text: 'Python ve Yapay Zeka dersleri ile ilgili sorular soruldu', completed: false }
    ]
  },

  // Sertifika ve Eğitimleri Tamamlama Son Günü - 27 Eylül 2026 Pazar
  {
    id: 'akbank-python-sertifika-son-gun',
    title: '🎖️ Akbank Python: Eğitimleri & Sertifikaları Tamamlama Son Günü',
    description: `🚨 Akbank Python'a Giriş Eğitimi Kapsamındaki İki Eğitimi Tamamlama Son Günü!

📅 Son Tarih: 27 Eylül 2026 Pazar, 23:59
🌐 Giriş: https://courses.10million.ai/login

📌 Tamamlanması Zorunlu Eğitimler:
1️⃣ Yapay Zekaya İlk Adım
2️⃣ Introduction to Python

🎖️ Sertifika:
Program kapsamında tanımlanan kursları başarıyla tamamlamanız halinde sertifikalarınız 10million.AI platformundaki hesabınıza tanımlanacaktır.`,
    startDate: '2026-09-27T23:59:00',
    endDate: '2026-09-27T23:59:00',
    allDay: false,
    location: '10million.AI Platformu',
    link: 'https://courses.10million.ai/login',
    type: 'milestone',
    program: 'akbank-python',
    isMandatory: true,
    color: '#be123c', // darker rose/crimson
    reminderMinutes: 1440,
    priority: 'critical',
    tags: ['Akbank', 'Python', 'Son Gün', 'Deadline', 'Sertifika', '10million.AI'],
    deliverables: [
      { id: 'akp-del-9', text: 'Yapay Zekaya İlk Adım kursu %100 tamamlandı', completed: false },
      { id: 'akp-del-10', text: 'Introduction to Python kursu %100 tamamlandı', completed: false },
      { id: 'akp-del-11', text: '10million.AI platformundan sertifikalar indirildi', completed: false }
    ]
  }
];
