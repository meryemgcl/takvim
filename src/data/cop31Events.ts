import { CalendarEvent } from '../types';

export const COP31_FINAL_EVENT: CalendarEvent = {
  id: 'cop31-volunteers-son-tamamlama',
  title: '🌍 COP31 Türkiye Gönüllülük Programı - Zorunlu Eğitimleri Son Tamamlama Tarihi',
  description: `COP31 Türkiye Gönüllülük Programı kapsamında atanan tüm eğitimlerin tamamlanması için son gün!\n\n📋 Sisteme Giriş ve Tamamlama Adımları:\n1. https://akademi.csb.gov.tr eğitim platformuna giriş yapınız.\n2. Sol menüden “Programlar” sekmesine tıklayınız.\n3. Açılan ekranda tarafınıza atanmış olan “COP31 Volunteers” paketini bulunuz.\n4. “COP31 Volunteers” paketinin altında yer alan “Paket Programları” butonuna tıklayınız.\n5. Tarafınıza tanımlanmış dersleri ve her bir derse ilişkin tamamlama oranınızı görüntüleyiniz.\n6. Her dersin ayrı ayrı seçilmesi, eğitim videosunun izlenmesi ve ilgili değerlendirme süreçlerinin eksiksiz tamamlanması gerekmektedir.\n\n⚠️ ÖNEMLİ BİLGİLENDİRME:\nEğitim içerikleri 15 Eylül 2026 tarihine kadar sisteme kademeli olarak eklenmeye devam edecektir. Hesabınızda halihazırda bulunan tüm dersleri tamamlamış olmanız sürecin bittiği anlamına gelmez. Düzenli olarak kontrol ederek yeni eklenen tüm dersleri tamamlamanız gerekmektedir.\n\n🌐 Resmi Eğitim Portalı: https://akademi.csb.gov.tr`,
  startDate: '2026-09-15T09:00:00',
  endDate: '2026-09-15T23:59:00',
  allDay: true,
  location: 'akademi.csb.gov.tr (Programlar > COP31 Volunteers)',
  link: 'https://akademi.csb.gov.tr',
  type: 'submission',
  program: 'cop31-gonullu',
  isMandatory: true,
  color: '#059669', // emerald
  reminderMinutes: 1440, // 1 day before
  priority: 'critical',
  tags: ['COP31', 'Gönüllülük', 'İklim Değişikliği', 'akademi.csb.gov.tr', 'Zorunlu Eğitim', 'Bakanlık'],
  deliverables: [
    { id: 'cop31-del-1', text: 'akademi.csb.gov.tr portalına giriş yapıldı', completed: false },
    { id: 'cop31-del-2', text: 'Sol Menü > "Programlar" > "COP31 Volunteers" > "Paket Programları" açıldı', completed: false },
    { id: 'cop31-del-3', text: 'Tanımlanmış tüm eğitim videoları eksiksiz izlendi', completed: false },
    { id: 'cop31-del-4', text: 'Ders değerlendirme ve anlama testleri tamamlandı', completed: false },
    { id: 'cop31-del-5', text: '15 Eylül 2026 saat 23:59 öncesi tamamlama oranı %100 teyit edildi', completed: false }
  ]
};

// Generate daily reminder events from 2026-08-22 to 2026-09-14
export const generateCop31DailyCheckEvents = (): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  
  // Date range: 2026-08-22 to 2026-09-14
  const startDay = new Date(2026, 7, 22); // Month is 0-indexed (7 = August)
  const endDay = new Date(2026, 8, 14);   // 8 = September

  let current = new Date(startDay);
  while (current <= endDay) {
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const day = String(current.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    events.push({
      id: `cop31-gunluk-kontrol-${dateStr}`,
      title: `🔔 COP31 Akademi Günlük Ders & Yükleme Kontrolü`,
      description: `https://akademi.csb.gov.tr adresine giriş yaparak "COP31 Volunteers" paketine yeni eğitim içeriği veya ders tanımlanıp tanımlanmadığını kontrol ediniz.\n\n📖 Hızlı Adımlar:\n1. akademi.csb.gov.tr > "Programlar"\n2. "COP31 Volunteers" > "Paket Programları"\n3. Yeni dersleri ve ilerleme oranınızı kontrol edip tamamlayınız.\n\n⏳ Son Eğitim Tamamlama Tarihi: 15 Eylül 2026\n🌐 Portal: https://akademi.csb.gov.tr`,
      startDate: `${dateStr}T10:00:00`,
      endDate: `${dateStr}T10:30:00`,
      allDay: false,
      location: 'akademi.csb.gov.tr',
      link: 'https://akademi.csb.gov.tr',
      type: 'self-paced',
      program: 'cop31-gonullu',
      isMandatory: true,
      color: '#059669',
      reminderMinutes: 30, // 30 minutes before reminder
      priority: 'high',
      tags: ['COP31', 'Günlük Kontrol', 'akademi.csb.gov.tr', 'Ders Takibi'],
      deliverables: [
        { id: `cop31-chk-${dateStr}-1`, text: `akademi.csb.gov.tr'ye girildi ve yeni dersler kontrol edildi`, completed: false },
        { id: `cop31-chk-${dateStr}-2`, text: 'Aktif videolar izlendi ve değerlendirmeler çözüldü', completed: false }
      ]
    });

    current.setDate(current.getDate() + 1);
  }

  return events;
};

export const ALL_COP31_EVENTS: CalendarEvent[] = [
  COP31_FINAL_EVENT,
  ...generateCop31DailyCheckEvents()
];
