import { CalendarEvent } from '../types';

export const AI_MASTERCLASS_EVENTS: CalendarEvent[] = [
  // 1. Keynote & 1. Oturum (26 Ağustos 2026 Çarşamba 19:30 - 20:30)
  {
    id: 'ai-mc-veli-bahceci-roiva',
    title: '🤖 Yapay Zeka Masterclass: Keynote - Yapay Zeka Araçlarının İş Hayatındaki Kullanımı (Veli Bahçeci)',
    description: `Yapay Zeka Masterclass Programı Açılış Keynote Oturumu!

🎙️ Konuşmacı: Veli Bahçeci | Roiva Akademi
⏰ Saat: 19:30 – 20:30
🏢 Organizasyon: PythianGo

📌 Konu Başlıkları:
• Günlük çalışma süreçlerimizde yapay zekadan nasıl faydalanabiliriz?
• Hangi AI araçları hangi ihtiyaçlara çözüm sunuyor?
• Yapay zekanın modern çalışma biçimlerimizi ve iş süreçlerini dönüştürmesi.

🔗 Oturum bağlantı linki gün içerisinde WhatsApp grubu üzerinden paylaşılacaktır.`,
    startDate: '2026-08-26T19:30:00',
    endDate: '2026-08-26T20:30:00',
    allDay: false,
    location: 'Online (WhatsApp Grubu Canlı Yayın Linki / PythianGo)',
    link: 'https://pythiango.com',
    type: 'webinar',
    program: 'pythiango-ai-masterclass',
    isMandatory: true,
    color: '#8b5cf6', // Violet / Purple AI Brand
    reminderMinutes: 60,
    priority: 'critical',
    tags: ['Yapay Zeka', 'Masterclass', 'PythianGo', 'Roiva Akademi', 'Veli Bahçeci', 'Keynote', 'AI Araçları'],
    deliverables: [
      { id: 'mc-del-1', text: 'WhatsApp grubundaki oturum bağlantı linkini kontrol ettim', completed: false },
      { id: 'mc-del-2', text: 'Veli Bahçeci Keynote oturumuna katıldım (19:30)', completed: false },
      { id: 'mc-del-3', text: 'İş hayatında kullanılabilecek AI araçları notlarımı çıkardım', completed: false }
    ]
  },

  // 2. Oturum (27 Ağustos 2026 Perşembe 19:30 - 20:30)
  {
    id: 'ai-mc-neslisah-suicmez-ordigen',
    title: '🤖 Yapay Zeka Masterclass: Neslişah Suiçmez – Ordigen',
    description: `Yapay Zeka Masterclass 2. Canlı Oturumu!

🎙️ Konuşmacı: Neslişah Suiçmez | Ordigen
⏰ Saat: 19:30 – 20:30
🏢 Organizasyon: PythianGo

📌 Oturum Kapsamı: Üretken yapay zeka çözümleri, sektörel vaka analizleri ve Ordigen yapay zeka yaklaşımları.
🔗 Oturum linki gün içerisinde WhatsApp grubunda paylaşılacaktır.`,
    startDate: '2026-08-27T19:30:00',
    endDate: '2026-08-27T20:30:00',
    allDay: false,
    location: 'Online (WhatsApp Canlı Yayın Linki / PythianGo)',
    link: 'https://pythiango.com',
    type: 'workshop',
    program: 'pythiango-ai-masterclass',
    isMandatory: true,
    color: '#a855f7',
    reminderMinutes: 60,
    priority: 'high',
    tags: ['Yapay Zeka', 'Masterclass', 'Ordigen', 'Neslişah Suiçmez', 'PythianGo', 'AI']
  },

  // 3. Oturum (1 Eylül 2026 Salı 19:30 - 20:30)
  {
    id: 'ai-mc-tikla-gelsin',
    title: '🤖 Yapay Zeka Masterclass: Tıkla Gelsin – E-Ticaret & Servislerde AI',
    description: `Yapay Zeka Masterclass 3. Canlı Oturumu!

🎙️ Konuk: Tıkla Gelsin
⏰ Saat: 19:30 – 20:30
🏢 Organizasyon: PythianGo

📌 Oturum Kapsamı: Hızlı tüketim ve teslimat platformlarında büyük veri, yapay zeka optimizasyonları ve algoritmalar.
🔗 Oturum linki gün içerisinde WhatsApp grubunda paylaşılacaktır.`,
    startDate: '2026-09-01T19:30:00',
    endDate: '2026-09-01T20:30:00',
    allDay: false,
    location: 'Online (WhatsApp Canlı Yayın Linki / PythianGo)',
    link: 'https://pythiango.com',
    type: 'workshop',
    program: 'pythiango-ai-masterclass',
    isMandatory: true,
    color: '#ec4899',
    reminderMinutes: 60,
    priority: 'high',
    tags: ['Yapay Zeka', 'Masterclass', 'Tıkla Gelsin', 'PythianGo', 'AI Optimizasyonu']
  },

  // 4. Oturum (2 Eylül 2026 Çarşamba 19:30 - 20:30)
  {
    id: 'ai-mc-burak-songur-kocsistem',
    title: '🤖 Yapay Zeka Masterclass: Burak Songur – KoçSistem',
    description: `Yapay Zeka Masterclass 4. Canlı Oturumu!

🎙️ Konuşmacı: Burak Songur | KoçSistem
⏰ Saat: 19:30 – 20:30
🏢 Organizasyon: PythianGo

📌 Oturum Kapsamı: Kurumsal yapay zeka dönüşümü, bulut sistemleri entegrasyonu ve KoçSistem AI vizyonu.
🔗 Oturum linki gün içerisinde WhatsApp grubunda paylaşılacaktır.`,
    startDate: '2026-09-02T19:30:00',
    endDate: '2026-09-02T20:30:00',
    allDay: false,
    location: 'Online (WhatsApp Canlı Yayın Linki / PythianGo)',
    link: 'https://pythiango.com',
    type: 'workshop',
    program: 'pythiango-ai-masterclass',
    isMandatory: true,
    color: '#06b6d4',
    reminderMinutes: 60,
    priority: 'high',
    tags: ['Yapay Zeka', 'Masterclass', 'KoçSistem', 'Burak Songur', 'PythianGo', 'Kurumsal AI']
  },

  // 5. Oturum (9 Eylül 2026 Çarşamba 19:30 - 20:30)
  {
    id: 'ai-mc-sena-kaya-pythiango',
    title: '🤖 Yapay Zeka Masterclass: Sena Kaya – PythianGo (İleri Seviye AI Uygulamaları)',
    description: `Yapay Zeka Masterclass 5. Canlı Oturumu!

🎙️ Konuşmacı: Sena Kaya | PythianGo
⏰ Saat: 19:30 – 20:30
🏢 Organizasyon: PythianGo

📌 Oturum Kapsamı: Geleceğin yapay zeka modelleri, PythianGo projeleri, prompt mühendisliği ve pratik yapay zeka uygulamaları.
🔗 Oturum linki gün içerisinde WhatsApp grubunda paylaşılacaktır.`,
    startDate: '2026-09-09T19:30:00',
    endDate: '2026-09-09T20:30:00',
    allDay: false,
    location: 'Online (WhatsApp Canlı Yayın Linki / PythianGo)',
    link: 'https://pythiango.com',
    type: 'webinar',
    program: 'pythiango-ai-masterclass',
    isMandatory: true,
    color: '#6366f1',
    reminderMinutes: 60,
    priority: 'critical',
    tags: ['Yapay Zeka', 'Masterclass', 'Sena Kaya', 'PythianGo', 'Geleceğin AI Modelleri']
  },

  // 6. Masterclass Genel Program (4 Hafta)
  {
    id: 'ai-mc-genel-program',
    title: '🧠 PythianGo: Yapay Zeka Masterclass (4 Haftalık Yoğun Akademi)',
    description: `Binlerce başvuru arasından seçilen katılımcılarla 4 haftalık yoğun Yapay Zeka Masterclass programı!

🚀 Organizasyon: PythianGo Ekibi
🗓️ Süre: 4 Hafta (26 Ağustos – 23 Eylül 2026)

🎯 Akademi Takvimi Öne Çıkanlar:
• 26.08 | 19:30 - Veli Bahçeci (Roiva Akademi) [İş Hayatında AI]
• 27.08 | 19:30 - Neslişah Suiçmez (Ordigen)
• 01.09 | 19:30 - Tıkla Gelsin
• 02.09 | 19:30 - Burak Songur (KoçSistem)
• 09.09 | 19:30 - Sena Kaya (PythianGo)
... ve çok daha fazlası!

Tüm duyurular ve canlı yayın linkleri PythianGo WhatsApp topluluğu üzerinden paylaşılacaktır.`,
    startDate: '2026-08-26T19:30:00',
    endDate: '2026-09-23T23:59:00',
    allDay: true,
    location: 'PythianGo Canlı Oturumları (WhatsApp Duyuru Grubu)',
    link: 'https://pythiango.com',
    type: 'milestone',
    program: 'pythiango-ai-masterclass',
    isMandatory: true,
    color: '#7c3aed',
    reminderMinutes: 1440,
    priority: 'critical',
    tags: ['PythianGo', 'Yapay Zeka', 'Masterclass', '4 Hafta', 'Akademi'],
    deliverables: [
      { id: 'mc-prog-1', text: '1. Hafta: Veli Bahçeci & Neslişah Suiçmez canlı oturumlarına katıldım', completed: false },
      { id: 'mc-prog-2', text: '2. Hafta: Tıkla Gelsin & Burak Songur oturumlarına katıldım', completed: false },
      { id: 'mc-prog-3', text: '3. Hafta: Sena Kaya (PythianGo) oturumuna katıldım', completed: false },
      { id: 'mc-prog-4', text: '4. Hafta: Masterclass final ödevi / değerlendirmesini tamamladım', completed: false }
    ]
  }
];
