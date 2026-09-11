import { CalendarEvent } from '../types';

export const UDEMY_PYTHON_COURSE_URL = 'https://www.udemy.com/course/python-100-gunluk-yazilim-kampi/learn/lecture/37243986?start=0#overview';

export const PYTHON_100_SPRINT_DAYS: {
  dayNumber: number;
  date: string; // YYYY-MM-DD
  courseDayRange: string;
  title: string;
  description: string;
  topics: string[];
  deliverables: string[];
  durationHours: number;
}[] = [
  {
    dayNumber: 1,
    date: '2026-08-23',
    courseDayRange: 'Kamp Günleri: 1 - 6',
    title: '🐍 1. Gün: Python Temelleri & Geliştirme Ortamları (PyCharm, VS Code, Jupyter)',
    description: 'Atıl Samancıoğlu ile 100 Günlük Python Kampı başlıyor! Python kurulumu, IDE ayarları, değişkenler, temel veri tipleri (int, float, string) ve input/print operasyonları.\n\n🌐 Udemy: ' + UDEMY_PYTHON_COURSE_URL,
    topics: ['Python Kurulumu', 'PyCharm & VS Code & Jupyter Notebook', 'Değişkenler & Veri Tipleri', 'Input/Output & Tip Dönüşümleri', 'String Manipülasyonları'],
    deliverables: [
      'PyCharm veya VS Code çalışma ortamı kuruldu',
      'İlk Python betiği (Hello World & Input) yazıldı',
      'Veri tipleri ve tip dönüşümü alıştırmaları tamamlandı',
      '1. - 6. gün arası video dersleri izlendi'
    ],
    durationHours: 2.5
  },
  {
    dayNumber: 2,
    date: '2026-08-24',
    courseDayRange: 'Kamp Günleri: 7 - 12',
    title: '🐍 2. Gün: Operatörler, Karşılaştırmalar & Koşullu İfadeler (If-Elif-Else)',
    description: 'Matematiksel ve mantıksal operatörler, Boolean mantığı, If-Elif-Else blokları ile karar mekanizmaları ve akış kontrolü.\n\n🌐 Udemy: ' + UDEMY_PYTHON_COURSE_URL,
    topics: ['Aritmetik & Mantıksal Operatörler', 'If, Elif, Else Yapıları', 'İç İçe Koşullar', 'Karar Verme Projeleri'],
    deliverables: [
      'Koşullu durum kontrolü alıştırmaları kodlandı',
      'Hesap makinesi & bilet fiyatı mini projesi tamamlandı',
      '7. - 12. gün video dersleri tamamlandı'
    ],
    durationHours: 2.5
  },
  {
    dayNumber: 3,
    date: '2026-08-25',
    courseDayRange: 'Kamp Günleri: 13 - 18',
    title: '🐍 3. Gün: Veri Yapıları (Listeler, Dictionaries, Tuples, Sets) & Döngüler',
    description: 'Python veri yapıları: Listeler, Sözlükler (Dicts), Kümeler (Sets), Demetler (Tuples) ve For / While döngüleri ile veri manipülasyonu.\n\n🌐 Udemy: ' + UDEMY_PYTHON_COURSE_URL,
    topics: ['Listeler & List Metotları', 'Dictionaries (Key-Value)', 'For & While Döngüleri', 'Break, Continue, Pass'],
    deliverables: [
      'Sözlük ve liste döngü pratikleri tamamlandı',
      'Öğrenci not takip / envanter mini projesi yazıldı',
      '13. - 18. gün ders videoları izlendi'
    ],
    durationHours: 2.5
  },
  {
    dayNumber: 4,
    date: '2026-08-26',
    courseDayRange: 'Kamp Günleri: 19 - 25',
    title: '🐍 4. Gün: Fonksiyonlar, Parametreler, Scope & Modüler Kodlama',
    description: 'Fonksiyon tanımlama (def), return değerleri, default argümanlar, *args & **kwargs, yerel ve global kapsam (Scope), Lambda fonksiyonları.\n\n🌐 Udemy: ' + UDEMY_PYTHON_COURSE_URL,
    topics: ['Fonksiyon Mimarisi', 'Return Mekanizması', '*args ve **kwargs', 'Scope (Local vs Global)', 'Lambda İfadeleri'],
    deliverables: [
      'Modüler yardımcı fonksiyon kütüphanesi oluşturuldu',
      'Adam Asmaca / Şifreleme mini oyunu kodlandı',
      '19. - 25. gün dersleri tamamlandı'
    ],
    durationHours: 2.5
  },
  {
    dayNumber: 5,
    date: '2026-08-27',
    courseDayRange: 'Kamp Günleri: 26 - 31',
    title: '🐍 5. Gün: Nesne Yönelimli Programlama (OOP - Class, Object, __init__)',
    description: 'Python ile Object Oriented Programming dünyasına giriş: Sınıf (Class) tasarımı, Nesne (Object) üretimi, Constructor (__init__), Instance Değişkenleri ve Metotlar.\n\n🌐 Udemy: ' + UDEMY_PYTHON_COURSE_URL,
    topics: ['Class & Object', 'Constructor (__init__)', 'Self Parametresi', 'Nesne Metotları & Nitelikleri'],
    deliverables: [
      'Banka Hesabı & Kullanıcı Yönetimi OOP sınıfı tasarlandı',
      '26. - 31. gün OOP videoları izlenip uygulandı'
    ],
    durationHours: 2.5
  },
  {
    dayNumber: 6,
    date: '2026-08-28',
    courseDayRange: 'Kamp Günleri: 32 - 37',
    title: '🐍 6. Gün: İleri OOP (Kalıtım, Polimorfizm, Kapsülleme) & Modüller / PIP',
    description: 'İleri OOP kavramları: Kalıtım (Inheritance), Polimorfizm, Kapsülleme (Encapsulation), Super() kullanımı, Harici Python modülleri ve PIP paket yöneticisi.\n\n🌐 Udemy: ' + UDEMY_PYTHON_COURSE_URL,
    topics: ['Inheritance (Kalıtım)', 'Super() Metodu', 'Polymorphism', 'Encapsulation', 'PIP & Python Modülleri'],
    deliverables: [
      'Kalıtım hiyerarşisine sahip Araç / Çalışan projesi yazıldı',
      'Özel modül import denemeleri yapıldı',
      '32. - 37. gün dersleri tamamlandı'
    ],
    durationHours: 2.5
  },
  {
    dayNumber: 7,
    date: '2026-08-29',
    courseDayRange: 'Kamp Günleri: 38 - 43',
    title: '🐍 7. Gün: Hata Yönetimi (Try-Except), Dosya İşlemleri (I/O) & JSON',
    description: 'Exception Handling (Try-Except-Finally), özel istisnalar (raise), dosya okuma/yazma (File I/O with open context), JSON ve CSV veri saklama.\n\n🌐 Udemy: ' + UDEMY_PYTHON_COURSE_URL,
    topics: ['Try-Except-Finally', 'Custom Exceptions', 'File I/O (r, w, a)', 'Context Managers (with)', 'JSON Parsing'],
    deliverables: [
      'Dosyaya veri kaydeden ve okuyan günlük/log uygulaması yazıldı',
      'Hata yakalama mekanizmaları test edildi',
      '38. - 43. gün dersleri tamamlandı'
    ],
    durationHours: 2.5
  },
  {
    dayNumber: 8,
    date: '2026-08-30',
    courseDayRange: 'Kamp Günleri: 44 - 50',
    title: '🐍 8. Gün: GUI Geliştirme - Tkinter, Turtle & Olay Yönetimi (Events)',
    description: 'Grafiksel Kullanıcı Arayüzü (GUI): Tkinter ile pencereler, butonlar, formlar, Turtle kütüphanesi ile oyun ve grafik geliştirme.\n\n🌐 Udemy: ' + UDEMY_PYTHON_COURSE_URL,
    topics: ['Tkinter Pencereleri & Grid Layout', 'Butonlar, Entry & Canvas', 'Turtle Grafik Çizimleri', 'Event Listener (Klavye/Fare)'],
    deliverables: [
      'Tkinter ile Vücut Kitle Endeksi (BMI) veya Şifre Yöneticisi arayüzü yapıldı',
      'Turtle ile Pong / Yılan mini oyunu tamamlandı',
      '44. - 50. gün dersleri tamamlandı'
    ],
    durationHours: 2.5
  },
  {
    dayNumber: 9,
    date: '2026-08-31',
    courseDayRange: 'Kamp Günleri: 51 - 56',
    title: '🐍 9. Gün: Web Scraping, Requests & REST API Entegrasyonları',
    description: 'İnternetten veri çekme (Web Scraping): Requests modülü ile HTTP GET/POST, BeautifulSoup ile HTML ayrıştırma ve REST API kullanımı.\n\n🌐 Udemy: ' + UDEMY_PYTHON_COURSE_URL,
    topics: ['Requests Kütüphanesi', 'HTTP Metotları & Headers', 'BeautifulSoup HTML Parsing', 'REST API Entegrasyonu & JSON'],
    deliverables: [
      'Bir haber/fiyat sitesinden otomatik veri çeken bot yazıldı',
      'Hava durumu / Döviz kuru API bağlantısı kuruldu',
      '51. - 56. gün videoları tamamlandı'
    ],
    durationHours: 2.5
  },
  {
    dayNumber: 10,
    date: '2026-09-01',
    courseDayRange: 'Kamp Günleri: 57 - 63',
    title: '🐍 10. Gün: Selenium ile Web Otomasyonu & Threading (Eşzamanlılık)',
    description: 'Selenium WebDriver ile tarayıcı otomasyonu, buton tıklatma, form doldurma, veri toplama ve Python Threading ile çoklu görev yürütme.\n\n🌐 Udemy: ' + UDEMY_PYTHON_COURSE_URL,
    topics: ['Selenium WebDriver', 'Web Elementleri & XPath Seçiciler', 'Tarayıcı Otomasyon Botları', 'Threading & Concurrency'],
    deliverables: [
      'Otomatik giriş yapan ve arama gerçekleştiren Selenium botu yazıldı',
      '57. - 63. gün videoları tamamlandı'
    ],
    durationHours: 2.5
  },
  {
    dayNumber: 11,
    date: '2026-09-02',
    courseDayRange: 'Kamp Günleri: 64 - 70',
    title: '🐍 11. Gün: Veri Bilimi Temelleri - NumPy (Matrisler & Sayısal Analiz)',
    description: 'Veri analizinin temel taşı NumPy: Çok boyutlu diziler (ndarray), vektör işlemleri, matris matematiği, indexing & slicing ve istatistiksel hesaplamalar.\n\n🌐 Udemy: ' + UDEMY_PYTHON_COURSE_URL,
    topics: ['NumPy Arrays (1D, 2D, 3D)', 'Array Operasyonları & Broadcasting', 'Matematiksel & İstatistiki Metotlar', 'Slicing & Reshape'],
    deliverables: [
      'NumPy ile matris işlemleri ve veri analiz alıştırmaları çözüldü',
      '64. - 70. gün videoları izlendi'
    ],
    durationHours: 2.5
  },
  {
    dayNumber: 12,
    date: '2026-09-03',
    courseDayRange: 'Kamp Günleri: 71 - 77',
    title: '🐍 12. Gün: Veri Analitiği - Pandas & Matplotlib ile Görselleştirme',
    description: 'Pandas ile DataFrames, Series, CSV/Excel veri okuma, veri temizleme (Missing Data), filtreleme, gruplama (groupby) ve Matplotlib ile grafik çizimi.\n\n🌐 Udemy: ' + UDEMY_PYTHON_COURSE_URL,
    topics: ['Pandas Series & DataFrames', 'Veri Temizleme & Filtreleme', 'Groupby & Aggregation', 'Matplotlib Çizgi/Çubuk/Pasta Grafikleri'],
    deliverables: [
      'Gerçek bir veri seti (CSV) Pandas ile analiz edildi',
      'Matplotlib ile veriler görselleştirilip grafik oluşturuldu',
      '71. - 77. gün dersleri tamamlandı'
    ],
    durationHours: 2.5
  },
  {
    dayNumber: 13,
    date: '2026-09-04',
    courseDayRange: 'Kamp Günleri: 78 - 84',
    title: '🐍 13. Gün: Web Geliştirme Temelleri (HTML5 & CSS3) & Web Mimarisi',
    description: 'Django öncesi web temelleri: HTML5 semantik etiketleri, formlar, tablolar, CSS3 stilleri, Flexbox ve Web istemci-sunucu mimarisi.\n\n🌐 Udemy: ' + UDEMY_PYTHON_COURSE_URL,
    topics: ['HTML5 Temel Yapı & Formlar', 'CSS3 Stilleri & Renkler', 'Web Request/Response Döngüsü', 'Frontend-Backend Entegrasyonu'],
    deliverables: [
      'Temel bir portfolyo / blog HTML-CSS şablonu kodlandı',
      '78. - 84. gün dersleri tamamlandı'
    ],
    durationHours: 2.5
  },
  {
    dayNumber: 14,
    date: '2026-09-05',
    courseDayRange: 'Kamp Günleri: 85 - 91',
    title: '🐍 14. Gün: Django Framework - MVC/MVT Mimarisi, Modeller & Views',
    description: 'Python\'ın en güçlü web framework\'ü Django: Proje oluşturma, MVT (Model-View-Template) yapısı, URL Routing, ORM & SQLite veritabanı, Admin Paneli.\n\n🌐 Udemy: ' + UDEMY_PYTHON_COURSE_URL,
    topics: ['Django Projesi & App Yapısı', 'URL Dispatcher & Views', 'Django Templates & Jinja', 'Django Modelleri & SQLite ORM', 'Admin Paneli'],
    deliverables: [
      'Django ile ilk dinamik web uygulaması (Blog/Görev Takip) ayağa kaldırıldı',
      'Admin paneline model kaydedildi ve test edildi',
      '85. - 91. gün videoları tamamlandı'
    ],
    durationHours: 2.5
  },
  {
    dayNumber: 15,
    date: '2026-09-06',
    courseDayRange: 'Kamp Günleri: 92 - 97',
    title: '🐍 15. Gün: Git & GitHub, DigitalOcean ile Canlıya Alma (Deployment)',
    description: 'Versiyon kontrolü (Git commit, branch, push), GitHub repo yönetimi ve DigitalOcean Linux sunucu üzerinde projeyi canlıya alma (Deployment).\n\n🌐 Udemy: ' + UDEMY_PYTHON_COURSE_URL,
    topics: ['Git & GitHub Temelleri', 'Terminal & SSH Bağlantısı', 'DigitalOcean Sunucu Kurulumu', 'Gunicorn / Nginx ile Canlıya Alma'],
    deliverables: [
      'Proje GitHub reposuna yüklendi',
      'DigitalOcean hediye kredisi ile sunucuda uygulama canlıya alındı',
      '92. - 97. gün dersleri tamamlandı'
    ],
    durationHours: 2.5
  },
  {
    dayNumber: 16,
    date: '2026-09-07',
    courseDayRange: 'Kamp Günleri: 98 - 100 & Final',
    title: '🐍 16. Gün: Cursor AI & ChatGPT ile Kodlama, Debugging & Sertifika',
    description: 'Yapay zeka destekli kodlama (Cursor IDE, ChatGPT), ileri seviye hata ayıklama (Debugging) teknikleri, final proje teslimi ve 100 Günlük Kamp Sertifikasyonu!\n\n🌐 Udemy: ' + UDEMY_PYTHON_COURSE_URL,
    topics: ['Cursor AI ile Yazılım Geliştirme', 'ChatGPT ile Debugging & Refactoring', 'İleri Python İpuçları', 'Final Proje Değerlendirmesi'],
    deliverables: [
      'Cursor IDE ile AI destekli kodlama pratiği yapıldı',
      'Tüm 100 günlük video serisi %100 tamamlandı',
      'Udemy resmi Bitirme Sertifikası alındı',
      'GitHub portfolyosu güncellendi'
    ],
    durationHours: 2.5
  }
];

export const PYTHON_100_EVENTS: CalendarEvent[] = PYTHON_100_SPRINT_DAYS.map((day) => ({
  id: `py100-gun-${day.dayNumber}-${day.date}`,
  title: day.title,
  description: `${day.description}\n\n📚 ${day.courseDayRange}\n⏱️ Günlük Hedef Süre: ~${day.durationHours} Saat (Video & Kodlama Pratiği)\n\n📋 Günün Konuları:\n${day.topics.map(t => '• ' + t).join('\n')}\n\n🌐 Udemy Kurs Linki: ${UDEMY_PYTHON_COURSE_URL}`,
  startDate: `${day.date}T19:00:00`,
  endDate: `${day.date}T21:30:00`,
  allDay: false,
  location: 'Udemy (Atıl Samancıoğlu - Python: 100 Günlük Yazılım Kampı)',
  link: UDEMY_PYTHON_COURSE_URL,
  type: 'self-paced',
  program: 'python-100-gun',
  isMandatory: true,
  color: '#eab308', // Python Yellow / Gold
  reminderMinutes: 60, // 1 hour before
  priority: day.dayNumber === 16 ? 'critical' : 'high',
  tags: ['Python', '100 Günlük Kamp', 'Atıl Samancıoğlu', 'Udemy', `Sprint Gün ${day.dayNumber}`, 'Yazılım'],
  deliverables: day.deliverables.map((text, idx) => ({
    id: `py100-del-${day.dayNumber}-${idx + 1}`,
    text,
    completed: false
  }))
}));

// Final completion milestone on 07 September 2026
export const PYTHON_100_FINAL_MILESTONE: CalendarEvent = {
  id: 'py100-final-mezuniyet-sertifika',
  title: '🏆 Atıl Samancıoğlu - 100 Günlük Python Kampı Mezuniyet & Sertifika Hedefi',
  description: '100 Günlük Python Yazılım Kampının 16 günde (23 Ağustos - 7 Eylül 2026) başarıyla tamamlanması ve Udemy sertifikasyonunun alınması hedefi.\n\n🎓 Başarılan Yetkinlikler:\n• Python Temelleri, OOP, Veri Yapıları\n• Web Scraping, Requests, Selenium, Threading\n• NumPy, Pandas, Matplotlib ile Veri Bilimi\n• HTML, CSS, Django Web Geliştirme & DigitalOcean Deployment\n• Cursor AI & ChatGPT ile Modern Yazılım Geliştirme\n\n🌐 Udemy Kurs Linki: ' + UDEMY_PYTHON_COURSE_URL,
  startDate: '2026-09-07T09:00:00',
  endDate: '2026-09-07T23:59:00',
  allDay: true,
  location: 'Udemy (Atıl Samancıoğlu Python 100 Gün)',
  link: UDEMY_PYTHON_COURSE_URL,
  type: 'milestone',
  program: 'python-100-gun',
  isMandatory: true,
  color: '#f59e0b', // amber gold
  reminderMinutes: 1440,
  priority: 'critical',
  tags: ['Python', '100 Günlük Kamp', 'Atıl Samancıoğlu', 'Sertifika', 'Mezuniyet', 'Final'],
  deliverables: [
    { id: 'py100-final-del-1', text: '100 günlük tüm ders modülleri eksiksiz izlendi', completed: false },
    { id: 'py100-final-del-2', text: 'Tüm mini projeler ve Django blog uygulaması kodlandı', completed: false },
    { id: 'py100-final-del-3', text: 'GitHub reposu ve portfolyo güncellendi', completed: false },
    { id: 'py100-final-del-4', text: 'Udemy kurs bitirme sertifikası indirildi ve LinkedIn\'e eklendi', completed: false }
  ]
};

export const ALL_PYTHON_100_EVENTS: CalendarEvent[] = [
  ...PYTHON_100_EVENTS,
  PYTHON_100_FINAL_MILESTONE
];
