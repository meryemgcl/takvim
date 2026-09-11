import { CalendarEvent } from '../types';

export const CAREERGEN_BOOTCAMP_EVENTS: CalendarEvent[] = [
  // 1. Canlı Buluşma: Tanışma & Oryantasyon (30 Ağustos 2026 Pazar, 20:00)
  {
    id: 'careergen-tanisma-oryantasyon',
    title: '🚀 CareerGen: İlk Canlı Buluşma (Tanışma & Oryantasyon)',
    description: `CareerGen Kariyere İlk Adım Bootcamp 1. Dönem açılış canlı buluşması ve oryantasyon oturumu.

🌐 Web Sitesi: https://career-gen.com
💬 WhatsApp Topluluğu: https://chat.whatsapp.com/CN0BjmrQcvK52hUAlzlT5o
📸 Instagram: https://www.instagram.com/career_gen
💼 LinkedIn: https://www.linkedin.com/company/careergentr/

📌 Zoom bağlantı linki WhatsApp duyuru grubundan etkinlik öncesinde paylaşılacaktır.`,
    startDate: '2026-08-30T20:00:00',
    endDate: '2026-08-30T21:30:00',
    allDay: false,
    location: 'Zoom (WhatsApp Topluluğu / career-gen.com)',
    link: 'https://career-gen.com',
    type: 'meeting',
    program: 'careergen-bootcamp',
    isMandatory: true,
    color: '#6366f1', // Indigo / CareerGen Brand
    reminderMinutes: 120, // 2 saat önce hatırlatıcı
    priority: 'critical',
    tags: ['CareerGen', 'Bootcamp', 'Oryantasyon', 'Kariyer', 'Canlı Oturum', 'Zoom'],
    deliverables: [
      { 
        id: 'cg-del-1', 
        text: 'WhatsApp Topluluğuna katıldım (https://chat.whatsapp.com/CN0BjmrQcvK52hUAlzlT5o)', 
        completed: false 
      },
      { 
        id: 'cg-del-2', 
        text: 'Dolu olmayan 6-7 kişilik bir takıma (Takım A, B, C, D) katıldım', 
        completed: false 
      },
      { 
        id: 'cg-del-3', 
        text: 'Instagram (@career_gen) ve LinkedIn (careergentr) hesaplarını takip ettim', 
        completed: false 
      },
      { 
        id: 'cg-del-4', 
        text: 'Instagram "Katılımcılarımız Tanışıyor" postuna yorum yazıp kendimi tanıttım', 
        completed: false 
      },
      { 
        id: 'cg-del-5', 
        text: 'Saat 20:00\'deki Zoom Canlı Tanışma ve Oryantasyon yayınına katıldım', 
        completed: false 
      }
    ]
  },

  // 2. Bootcamp Resmi Başlangıç & 4 Haftalık Ana Program
  {
    id: 'careergen-bootcamp-resmi-baslangic',
    title: '🎓 CareerGen: Kariyere İlk Adım Bootcamp 1. Dönem (Resmi Başlangıç)',
    description: `CareerGen 4 haftalık yoğun kariyer yolculuğu resmen başlıyor!

Önümüzdeki 4 hafta boyunca kariyer hedefleri, CV/LinkedIn optimizasyonu, vaka çalışmaları, mentorluk ve mülakat simülasyonları ile kariyer yolculuğunuzu şekillendiriyoruz.

🌐 Web: https://career-gen.com
💬 WhatsApp Grubu: https://chat.whatsapp.com/CN0BjmrQcvK52hUAlzlT5o
📸 Instagram: https://www.instagram.com/career_gen
💼 LinkedIn: https://www.linkedin.com/company/careergentr/`,
    startDate: '2026-08-31T09:00:00',
    endDate: '2026-09-27T23:59:00',
    allDay: true,
    location: 'Online Platform (career-gen.com & WhatsApp)',
    link: 'https://career-gen.com',
    type: 'milestone',
    program: 'careergen-bootcamp',
    isMandatory: true,
    color: '#4f46e5',
    reminderMinutes: 1440,
    priority: 'critical',
    tags: ['CareerGen', 'Bootcamp', '4 Hafta', 'Kariyer', 'Staj', 'Gelişim'],
    deliverables: [
      { id: 'cg-main-1', text: '1. Hafta: Takım içi tanışma ve çalışma planı oluşturuldu', completed: false },
      { id: 'cg-main-2', text: '2. Hafta: CV ve LinkedIn profili optimize edildi', completed: false },
      { id: 'cg-main-3', text: '3. Hafta: Vaka / Case çalışması ve mülakat simülasyonu tamamlandı', completed: false },
      { id: 'cg-main-4', text: '4. Hafta: Final mezuniyet projesi ve kariyer yol haritası teslim edildi', completed: false }
    ]
  },

  // 3. 1. Hafta: Takım Dinamikleri & Hedef Belirleme
  {
    id: 'careergen-hafta-1',
    title: '📌 CareerGen 1. Hafta: Takım İletişimi & Bireysel Kariyer Hedefleri',
    description: `6-7 kişilik Takım A/B/C/D içi görev dağılımı, haftalık hedeflerin netleştirilmesi ve kariyer pusulası oluşturma haftası.

🌐 Detaylar: https://career-gen.com`,
    startDate: '2026-08-31T09:00:00',
    endDate: '2026-09-06T23:59:00',
    allDay: true,
    location: 'WhatsApp Takım Grubu & career-gen.com',
    link: 'https://career-gen.com',
    type: 'self-paced',
    program: 'careergen-bootcamp',
    isMandatory: true,
    color: '#0ea5e9',
    reminderMinutes: 720,
    priority: 'high',
    tags: ['CareerGen', 'Hafta 1', 'Takım Çalışması', 'Hedefler']
  },

  // 4. 2. Hafta: CV, LinkedIn & Kişisel Marka
  {
    id: 'careergen-hafta-2',
    title: '💼 CareerGen 2. Hafta: ATS Uyumlu CV & LinkedIn Profili Optimizasyonu',
    description: `Profesyonel CV hazırlama, LinkedIn algoritmasına uygun profil yapılandırma ve yetenek vitrini oluşturma.

🌐 Detaylar: https://career-gen.com`,
    startDate: '2026-09-07T09:00:00',
    endDate: '2026-09-13T23:59:00',
    allDay: true,
    location: 'career-gen.com',
    link: 'https://career-gen.com',
    type: 'workshop',
    program: 'careergen-bootcamp',
    isMandatory: true,
    color: '#8b5cf6',
    reminderMinutes: 720,
    priority: 'high',
    tags: ['CareerGen', 'Hafta 2', 'CV', 'LinkedIn', 'Kişisel Marka']
  },

  // 5. 3. Hafta: Mülakat Teknikleri & Case Çalışmaları
  {
    id: 'careergen-hafta-3',
    title: '🎯 CareerGen 3. Hafta: İK & Teknik Mülakatlar, Case Çözümleri',
    description: `Yetkinlik bazlı mülakat simülasyonları, STAR tekniği ve problem çözme vakaları.

🌐 Detaylar: https://career-gen.com`,
    startDate: '2026-09-14T09:00:00',
    endDate: '2026-09-20T23:59:00',
    allDay: true,
    location: 'career-gen.com',
    link: 'https://career-gen.com',
    type: 'workshop',
    program: 'careergen-bootcamp',
    isMandatory: true,
    color: '#ec4899',
    reminderMinutes: 720,
    priority: 'high',
    tags: ['CareerGen', 'Hafta 3', 'Mülakat', 'Case', 'Simülasyon']
  },

  // 6. 4. Hafta: Final Sunumları, Mezuniyet & Kariyer Ağı
  {
    id: 'careergen-hafta-4',
    title: '🏆 CareerGen 4. Hafta: Final Sunumları, Networking & Mezuniyet',
    description: `Bootcamp bitirme sunumları, mentor geri bildirimleri, kariyer sertifikası ve mezuniyet ağına katılım.

🌐 Detaylar: https://career-gen.com`,
    startDate: '2026-09-21T09:00:00',
    endDate: '2026-09-27T23:59:00',
    allDay: true,
    location: 'career-gen.com',
    link: 'https://career-gen.com',
    type: 'pitch',
    program: 'careergen-bootcamp',
    isMandatory: true,
    color: '#10b981',
    reminderMinutes: 1440,
    priority: 'critical',
    tags: ['CareerGen', 'Hafta 4', 'Mezuniyet', 'Final', 'Sertifika']
  }
];
