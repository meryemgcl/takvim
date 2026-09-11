import { CalendarEvent } from '../types';

export const NO_CODE_EVENTS: CalendarEvent[] = [
  // 1. Ders - 15 Eylül 2026 Salı (18:00 - 21:00)
  {
    id: 'nocode-lowcode-ders-1',
    title: '🛠️ No-Code & Low-Code: 1. Ders - Fikirden Ürün Problemine Geçiş',
    description: `🚀 Program: No-Code & Low-Code ile Fikirden Ürüne
👨‍🏫 Eğitmen: Engin Deniz Alpman
🏢 Organizasyon: Pupilica
💻 Format: Online Canlı Eğitim
⏰ Saat: 18:00 – 21:00
📅 Tarih: 15 Eylül 2026 Salı

📍 1. Ders - Fikirden Ürün Problemine Geçiş:
No-Code / Low-Code dünyasına giriş yapılarak; problem bulma ve kullanıcıyı anlama, değer önerisi oluşturma adımları ele alınacak.

📚 Konular:
• No-code ve low-code kavramları
• Yazılım bilmeden ürün geliştirme yaklaşımı
• No-code araçlarla neler yapılabilir?
• Problem, ihtiyaç ve çözüm farkı
• Kullanıcı personası oluşturma
• Günlük hayattaki veya iş süreçlerindeki problem alanlarını keşfetme
• İyi ürün fikri nasıl doğar?

🎯 Uygulama:
• Ürün fikrinin seçilmesi
• Hedef kullanıcı ve problem tanımının yapılması
• İlk ürün fikri kartının oluşturulması`,
    startDate: '2026-09-15T18:00:00',
    endDate: '2026-09-15T21:00:00',
    allDay: false,
    location: 'Pupilica Canlı Yayın (Online)',
    link: 'https://pupilica.com',
    type: 'workshop',
    program: 'nocode-lowcode',
    isMandatory: true,
    color: '#8b5cf6', // Violet
    reminderMinutes: 60,
    priority: 'high',
    tags: ['No-Code', 'Low-Code', 'Pupilica', 'Engin Deniz Alpman', 'Fikirden Ürüne', 'Persona', 'Problem Tanımı'],
    deliverables: [
      { id: 'nocode-del-1', text: 'Hedef kullanıcı personası ve problem tanımını netleştirdim', completed: false },
      { id: 'nocode-del-2', text: 'İlk ürün fikri kartını hazırladım', completed: false }
    ]
  },

  // 2. Ders - 17 Eylül 2026 Perşembe (18:00 - 21:00)
  {
    id: 'nocode-lowcode-ders-2',
    title: '📐 No-Code & Low-Code: 2. Ders - MVP Tasarımı ve Ürün Akışı',
    description: `🚀 Program: No-Code & Low-Code ile Fikirden Ürüne
👨‍🏫 Eğitmen: Engin Deniz Alpman
🏢 Organizasyon: Pupilica
💻 Format: Online Canlı Eğitim
⏰ Saat: 18:00 – 21:00
📅 Tarih: 17 Eylül 2026 Perşembe

📍 2. Ders - MVP Tasarımı ve Ürün Akışı:
MVP mantığı kavranarak; kullanıcı yolculuğu ve ekran akışı, araç seçimi adımları ele alınacak.

📚 Konular:
• Minimum Viable Product (MVP) kavramı
• Her fikrin ilk versiyonunda olması ve olmaması gerekenler
• Gereksiz özellik kalabalığından kaçınma
• Hızlı test edilebilir ürün yaklaşımı
• Kullanıcı ilk nereden başlar?
• Üründe temel adımlar nasıl sıralanır?
• Form, ekran, aksiyon ve sonuç mantığı
• Basit kullanıcı akışı çizimi
• Landing page araçları
• Basit uygulama oluşturma araçları
• Otomasyon araçları

🎯 Uygulama:
• Ürün akışının çizilmesi
• MVP özellik listesinin hazırlanması
• Kullanılacak no-code aracın seçilmesi`,
    startDate: '2026-09-17T18:00:00',
    endDate: '2026-09-17T21:00:00',
    allDay: false,
    location: 'Pupilica Canlı Yayın (Online)',
    link: 'https://pupilica.com',
    type: 'workshop',
    program: 'nocode-lowcode',
    isMandatory: true,
    color: '#8b5cf6',
    reminderMinutes: 60,
    priority: 'high',
    tags: ['No-Code', 'Low-Code', 'Pupilica', 'MVP', 'Ürün Akışı', 'Landing Page', 'Otomasyon'],
    deliverables: [
      { id: 'nocode-del-3', text: 'Kullanıcı ekran yolculuğu ve ürün akış şemasını çizdim', completed: false },
      { id: 'nocode-del-4', text: 'MVP özellik listesini ve kullanılacak araçları belirledim', completed: false }
    ]
  },

  // 3. Ders - 22 Eylül 2026 Salı (18:00 - 21:00)
  {
    id: 'nocode-lowcode-ders-3',
    title: '⚡ No-Code & Low-Code: 3. Ders - No-Code Prototip Geliştirme',
    description: `🚀 Program: No-Code & Low-Code ile Fikirden Ürüne
👨‍🏫 Eğitmen: Engin Deniz Alpman
🏢 Organizasyon: Pupilica
💻 Format: Online Canlı Eğitim
⏰ Saat: 18:00 – 21:00
📅 Tarih: 22 Eylül 2026 Salı

📍 3. Ders - No-Code Prototip Geliştirme:
Prototip kurulum mantığı, otomasyonla ürün deneyimini güçlendirme, test ve iyileştirme ele alınacak.

📚 Konular:
• Sayfa, form, veri ve aksiyon ilişkisi
• Basit veri toplama yapısı
• Kullanıcıdan bilgi alma ve sonucu gösterme
• Prototipin test edilebilir hale getirilmesi
• Formdan gelen veriyi kaydetme
• Otomatik e-posta veya bildirim oluşturma
• Basit onay ve yönlendirme akışları
• Ürüne küçük ama etkili otomasyonlar ekleme
• Prototip nasıl test edilir?
• Kullanıcı geri bildirimi nasıl alınır?

🎯 Uygulama:
• İlk çalışan prototipin hazırlanması
• En az bir kullanıcı aksiyonunun çalışır hale getirilmesi
• Test notlarının çıkarılması`,
    startDate: '2026-09-22T18:00:00',
    endDate: '2026-09-22T21:00:00',
    allDay: false,
    location: 'Pupilica Canlı Yayın (Online)',
    link: 'https://pupilica.com',
    type: 'workshop',
    program: 'nocode-lowcode',
    isMandatory: true,
    color: '#8b5cf6',
    reminderMinutes: 60,
    priority: 'critical',
    tags: ['No-Code', 'Low-Code', 'Prototip', 'Otomasyon', 'Veri Toplama', 'Form Akışı', 'Test'],
    deliverables: [
      { id: 'nocode-del-5', text: 'Çalışan ilk no-code prototipini hazırladım', completed: false },
      { id: 'nocode-del-6', text: 'Otomasyon (bildirim/e-posta) ve kullanıcı aksiyonunu test ettim', completed: false }
    ]
  },

  // 4. Ders - 24 Eylül 2026 Perşembe (18:00 - 21:00)
  {
    id: 'nocode-lowcode-ders-4',
    title: '🏆 No-Code & Low-Code: 4. Ders - Ürün Sunumu ve Portfolyo Çıktısı',
    description: `🚀 Program: No-Code & Low-Code ile Fikirden Ürüne
👨‍🏫 Eğitmen: Engin Deniz Alpman
🏢 Organizasyon: Pupilica
💻 Format: Online Canlı Eğitim
⏰ Saat: 18:00 – 21:00
📅 Tarih: 24 Eylül 2026 Perşembe

📍 4. Ders - Ürün Sunumu ve Portfolyo Çıktısı:
Ürün anlatımı, portfolyo için proje dokümantasyonu ve gelişim yol haritası ele alınacak.

📚 Konular:
• Problem, çözüm ve hedef kullanıcı anlatımı
• Ürünün temel faydasını sadeleştirme
• Demo akışı hazırlama
• Ürün fikrini 2 dakikada anlatma
• Proje özeti yazma
• Kullanılan araçlar listesi
• Ekran görüntüleri ve akış diyagramı hazırlama
• Prototipten gerçek ürüne geçiş
• Teknik geliştirme ihtiyacını belirleme
• Veri, kullanıcı ve özellik önceliklendirme

🎯 Uygulama:
• Ürün fikrini 2 dakikada özetleyen sunum/pitch hazırlığı
• Proje özeti, ekran görüntüleri ve portfolyo dokümantasyonu`,
    startDate: '2026-09-24T18:00:00',
    endDate: '2026-09-24T21:00:00',
    allDay: false,
    location: 'Pupilica Canlı Yayın (Online)',
    link: 'https://pupilica.com',
    type: 'milestone',
    program: 'nocode-lowcode',
    isMandatory: true,
    color: '#8b5cf6',
    reminderMinutes: 60,
    priority: 'critical',
    tags: ['No-Code', 'Portfolyo', 'Demo Day', 'Pitch', 'Ürün Sunumu', 'Dokümantasyon'],
    deliverables: [
      { id: 'nocode-del-7', text: '2 dakikalık ürün demo akışı ve sunumunu hazırladım', completed: false },
      { id: 'nocode-del-8', text: 'Portfolyo için proje özetini ve ekran görüntülerini kaydettim', completed: false }
    ]
  }
];
