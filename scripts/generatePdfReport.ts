import fs from 'fs';
import path from 'path';
import { jsPDF } from 'jspdf';

export function buildPdfDocument() {
  const regularFontPath = '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf';
  const boldFontPath = '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf';

  const regularFont = fs.readFileSync(regularFontPath).toString('base64');
  const boldFont = fs.readFileSync(boldFontPath).toString('base64');

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  doc.addFileToVFS('LiberationSans-Regular.ttf', regularFont);
  doc.addFont('LiberationSans-Regular.ttf', 'LiberationSans', 'normal');
  doc.addFileToVFS('LiberationSans-Bold.ttf', boldFont);
  doc.addFont('LiberationSans-Bold.ttf', 'LiberationSans', 'bold');

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 10) {
      addFooter();
      doc.addPage();
      y = margin + 5;
      addHeader();
    }
  };

  const addHeader = () => {
    doc.setFont('LiberationSans', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('İnovasyon & Etkinlik Ajandası | Detaylı Proje Dokümantasyonu & Yapılacaklar Raporu', margin, margin);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, margin + 2, pageWidth - margin, margin + 2);
    y = margin + 8;
  };

  const addFooter = () => {
    const pageCount = (doc.internal as any).getNumberOfPages();
    doc.setFont('LiberationSans', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Tarih: 11 Eylül 2026 | Kullanıcı: meriguclu123@gmail.com`, margin, pageHeight - 10);
    doc.text(`Sayfa ${pageCount}`, pageWidth - margin - 15, pageHeight - 10);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);
  };

  const addTitle = (title: string, subtitle?: string) => {
    // Header background banner
    doc.setFillColor(15, 23, 42); // slate-900
    doc.roundedRect(margin, y, contentWidth, 34, 3, 3, 'F');

    doc.setFont('LiberationSans', 'bold');
    doc.setFontSize(17);
    doc.setTextColor(255, 255, 255);
    doc.text(title, margin + 6, y + 12);

    if (subtitle) {
      doc.setFont('LiberationSans', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text(subtitle, margin + 6, y + 20);
    }

    doc.setFont('LiberationSans', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(56, 189, 248); // sky-400
    doc.text('Google Workspace & Gemini 3.7 Flash Entegrasyonlu Akıllı Kariyer ve İnovasyon Yönetim Sistemi', margin + 6, y + 28);

    y += 40;
  };

  const addSectionHeader = (number: string, title: string) => {
    checkPageBreak(16);
    doc.setFillColor(241, 245, 249); // slate-100
    doc.roundedRect(margin, y, contentWidth, 8.5, 1.5, 1.5, 'F');
    
    doc.setFillColor(37, 99, 235); // blue-600 indicator
    doc.rect(margin, y, 2.5, 8.5, 'F');

    doc.setFont('LiberationSans', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(`${number}. ${title}`, margin + 5, y + 6);
    y += 12;
  };

  const addSubSection = (title: string) => {
    checkPageBreak(10);
    doc.setFont('LiberationSans', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(title, margin, y);
    y += 5;
  };

  const addParagraph = (text: string, indent = 0) => {
    doc.setFont('LiberationSans', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    const lines = doc.splitTextToSize(text, contentWidth - indent);
    checkPageBreak(lines.length * 4.2 + 2);
    doc.text(lines, margin + indent, y);
    y += lines.length * 4.2 + 2;
  };

  const addBullet = (bulletTitle: string, bulletDesc: string) => {
    doc.setFont('LiberationSans', 'bold');
    doc.setFontSize(8.8);
    doc.setTextColor(30, 41, 59);
    
    checkPageBreak(9);
    doc.text('•', margin + 2, y);
    doc.text(`${bulletTitle}: `, margin + 6, y);

    const titleWidth = doc.getTextWidth(`${bulletTitle}: `);
    doc.setFont('LiberationSans', 'normal');
    doc.setTextColor(71, 85, 105);

    const firstLineDesc = doc.splitTextToSize(bulletDesc, contentWidth - 6 - titleWidth);
    if (firstLineDesc.length === 1) {
      doc.text(firstLineDesc[0], margin + 6 + titleWidth, y);
      y += 4.5;
    } else {
      const allLines = doc.splitTextToSize(`${bulletTitle}: ${bulletDesc}`, contentWidth - 6);
      doc.text(allLines, margin + 6, y);
      y += allLines.length * 4.2 + 1.5;
    }
  };

  const addTable = (headers: string[], rows: string[][], colWidths: number[]) => {
    checkPageBreak(15 + rows.length * 6);

    // Table Header
    doc.setFillColor(30, 41, 59);
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setFont('LiberationSans', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);

    let currentX = margin;
    headers.forEach((h, idx) => {
      doc.text(h, currentX + 2, y + 4.8);
      currentX += colWidths[idx];
    });
    y += 7;

    // Table Rows
    rows.forEach((row, rIdx) => {
      checkPageBreak(7);
      if (rIdx % 2 === 1) {
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, y, contentWidth, 6.5, 'F');
      }
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.line(margin, y + 6.5, margin + contentWidth, y + 6.5);

      currentX = margin;
      doc.setFont('LiberationSans', 'normal');
      doc.setFontSize(7.8);
      doc.setTextColor(30, 41, 59);

      row.forEach((cell, cIdx) => {
        const cellText = doc.splitTextToSize(cell, colWidths[cIdx] - 4);
        doc.text(cellText[0] || '', currentX + 2, y + 4.5);
        currentX += colWidths[cIdx];
      });
      y += 6.5;
    });
    y += 4;
  };

  // ----------------------------------------------------
  // REPORT CONTENT GENERATION
  // ----------------------------------------------------

  // 1. Title Banner
  addTitle('İnovasyon & Etkinlik Ajandası', 'Resmi Proje Dokümantasyonu, Sistem Mimarisi ve Yapılacaklar Yol Haritası');

  // Overview Info Box
  doc.setFillColor(238, 242, 255); // indigo-50
  doc.setDrawColor(199, 210, 254);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'FD');

  doc.setFont('LiberationSans', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(67, 56, 202);
  doc.text('Yönetici Özeti & Sistem Durumu:', margin + 4, y + 5);

  doc.setFont('LiberationSans', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(30, 41, 59);
  doc.text('Bu rapor, İnovasyon & Etkinlik Ajandası üzerinde geliştirilen tüm mimari bileşenleri, Google Workspace API', margin + 4, y + 9.5);
  doc.text('entegrasyonlarını, Gemini 3.7 Flash yapay zeka servislerini ve Eylül 2026 öncelikli yapılacaklar listesini içerir.', margin + 4, y + 14);
  y += 23;

  // SECTION 1
  addSectionHeader('1', 'Projenin Amacı, Kapsamı ve Çözülen Problemler');
  addParagraph('İnovasyon & Etkinlik Ajandası; üniversite öğrencisi ve genç profesyonellerin eş zamanlı yürüttüğü akademik araştırmalar (TÜBİTAK), savunma sanayii / havacılık staj başvuruları (CEZERİ & FERGANİ), yoğun yazılım eğitim kampları (Tech Istanbul, Akbank Python, Pupilica No-Code) ve kariyer mülakatlarını tek bir merkezden yönetmek üzere inşa edilmiştir.');
  addBullet('Zaman Çakışması Engelleme', 'Aynı gün ve saate denk gelen canlı oturumları (örneğin 11 Eylül 20:00 Huawei Canlı Lab ve Akbank Mentor Buluşması) tespit ederek kayıt/tekrar esnekliği sunar.');
  addBullet('Otomatik Görev Devri (Rollover)', 'Günün yoğunluğunda tamamlanamayan görevleri kaybetmeden otomatik olarak bir sonraki günün yapılacaklar listesine aktarır.');
  addBullet('Sabah 06:00 Brifingi', 'Her sabah saat 06:00\'da o günün kritik teslim ve toplantılarını özetleyen brifing raporu üretir.');
  y += 3;

  // SECTION 2
  addSectionHeader('2', 'Teknoloji Yığını ve Sistem Mimarisi');
  addBullet('Ön Yüz (Frontend)', 'React 18, TypeScript, Vite, Tailwind CSS (Nordic koyu/açık tema, WCAG AA erişilebilirlik), motion animasyon motoru, Lucide ikon kütüphanesi.');
  addBullet('Sunucu Katmanı (Backend)', 'Node.js + Express (server.ts). Port 3000 üzerinde container reverse proxy uyumlu mimari. Üretimde esbuild ile tek dosya dist/server.cjs çıktısı.');
  addBullet('Yapay Zeka (AI / NLP)', 'Google Gemini 3.7 Flash (server-side proxy). Kullanıcı duyuru metinlerini ayrıştırma ve sesli komutları takvim görevine dönüştürme.');
  addBullet('Veri ve Kimlik Doğrulama', 'Firebase Auth (Google Sign-In) + IndexedDB resilient persistence (browserLocalPersistence & inMemoryPersistence), Google Access Token yedekleme.');
  y += 3;

  // SECTION 3
  addSectionHeader('3', 'Google Workspace ve Bulut Entegrasyonları');
  addBullet('Google Calendar API v3', 'Etkinlikleri tek tıkla veya toplu olarak kullanıcı Google Takvimine senkronize etme, silme, güncelleme ve RFC 5545 uyumlu .ICS dışa aktarımı.');
  addBullet('Google Tasks API v1', 'Kullanıcı adına özel "İnovasyon & Etkinlik Ajandası" görev listesi oluşturma, iki yönlü onay kutusu senkronizasyonu ve tarih bazlı görev atama.');
  addBullet('Google Meet Space API', 'Etkinlik kartından doğrudan yeni Google Meet video görüşme alanı oluşturma (spaces.create) ve tek tıkla bağlantı paylaşımı.');
  addBullet('Gmail API', 'Gelen kutusundaki staj kabul, hackathon ve mülakat duyuru e-postalarını yapay zeka ile otomatik tarayıp takvime dönüştürme.');
  y += 3;

  // SECTION 4
  addSectionHeader('4', 'Kayıtlı Eğitim, Staj ve İnovasyon Ekosistemleri');
  addParagraph('Uygulama veri tabanında yer alan tüm programlar tam detayları, görev kontrol listeleri ve bağlantılarıyla işlenmiştir:');

  const programHeaders = ['Program / Organizasyon', 'Format / Platform', 'Tarih Aralığı', 'Durum / Öncelik'];
  const programRows = [
    ['Akbank Python\'a Giriş', '10million.AI (Self-Paced & Mentor)', '07 - 27 Eylül 2026', 'P0 - Zorunlu'],
    ['Pupilica: No-Code & Low-Code', 'Engin Deniz Alpman / Canlı', '15 - 24 Eylül 2026', 'P1 - Yüksek'],
    ['Tech Istanbul AI Bootcamp', 'İBB & Tech Istanbul / Canlı + Proje', '08 Eylül - 08 Ekim', 'P1 - Yüksek'],
    ['Huawei ICT Academy Networks', 'Sena İlayda Hocaoğlu / YouTube Canlı', '11 Eylül 2026 20:00', 'P1 - Canlı Lab'],
    ['JCI Maltepe AIP Mülakatı', 'Tanışma & Mülakat / Google Meet', '17 Eylül 19:40-19:50', 'P0 - Kritik'],
    ['Miuul Claude Code MedKit', 'Bedirhan Keskin / Zoom Canlı', '21 Eylül 2026 20:30', 'P1 - Seminer'],
    ['PythianGo AI Masterclass', '4 Haftalık Canlı Masterclass', 'Ağustos - Eylül 2026', 'Devam Ediyor'],
    ['Atıl Samancıoğlu Python 100', 'Udemy / Self-Paced Yazılım Kampı', 'Ağustos - Eylül 2026', 'Sprint Modu'],
    ['TÜBİTAK 2209-A & Bilim Genç', 'Üniversite Araştırma Projesi', 'Eylül 2026 Dönemi', 'Başvuru Hazırlık'],
    ['CEZERİ & FERGANİ 2027 Stajı', 'Havacılık ve Uzay Aday Mühendislik', '2027 Uzun Dönem', 'Portfolyo Aşaması']
  ];
  addTable(programHeaders, programRows, [55, 45, 40, 34]);

  // SECTION 5
  addSectionHeader('5', 'Önceliklendirilmiş Yapılacaklar Listesi (To-Do & Roadmap)');
  
  addSubSection('[P0] Kritik ve Acil Eylemler (Eylül 2026)');
  addBullet('Akbank Python (10million.AI)', 'courses.10million.ai adresinde "Yapay Zekaya İlk Adım" ve "Introduction to Python" derslerini bitir; 27 Eylül saat 23:59\'a kadar sertifikalarını tamamla.');
  addBullet('JCI Maltepe AIP Staj Mülakatı', '17 Eylül 2026 Perşembe saat 19:40 - 19:50 arasında Google Meet (meet.google.com/dyz-fxcd-rpg) odasına katılarak ön değerlendirme mülakatını gerçekleştir.');

  addSubSection('[P1] Yüksek Öncelikli Eğitim ve Canlı Oturumlar');
  addBullet('Huawei ICT Academy Canlı Lab', '11 Eylül Cuma 20:00\'de YouTube yayınında Huawei eNSP simülatörü ve Router/Switch konfigürasyon pratiklerini takip et.');
  addBullet('Pupilica No-Code Başlangıcı', '15 Eylül 2026 Salı günü 1. hafta oturumuna katılarak Bubble ve Make araçlarıyla ilk MVP çalışmasını başlat.');
  addBullet('Miuul Claude Code MedKit', '21 Eylül 20:30 Zoom yayınına katılarak Anthropic dünya birinciliği mimarisini ve prompt stratejilerini incele.');
  addBullet('TÜBİTAK 2209-A Başvuru Dosyası', 'Danışman hoca ile görüşerek proje yenilikçi yönünü, iş paketlerini ve malzeme bütçesini netleştir.');

  addSubSection('[P2] Teknik Geliştirmeler & Verimlilik Araçları');
  addBullet('Google Calendar Periyodik Senkronizasyonu', 'Arka planda belirli aralıklarla takvimdeki değişiklikleri sorgulayıp arayüzü güncelleyen arka plan sync servisi.');
  addBullet('Entegre Pomodoro Sayacı', 'Takvim veya görev kartına tıklandığında 25 dakika odaklanma sayacı başlatan mini zamanlayıcı.');
  addBullet('Sertifika PDF Kasası', '10million.AI, Pupilica, Tech Istanbul ve Huawei sertifikalarını tek sayfada depolayan ve LinkedIn paylaşım linki üreten arşiv.');

  addSubSection('[P3] Uzun Vadeli Altyapı ve Vizyon');
  addBullet('PWA Çevrimdışı Çalışma Modu', 'İnternet bağlantısı olmadığında dahi takvim verilerine erişim ve düzenleme sağlayan Service Worker entegrasyonu.');
  addBullet('Telegram Bildirim Botu', 'Sabah 06:00 brifingini doğrudan cep telefonuna anlık mesaj olarak ileten bot entegrasyonu.');

  // SECTION 6
  addSectionHeader('6', 'Uygulama Dosya ve Dizin Mimarisi');
  addBullet('src/components/', 'Header, Sidebar, CalendarView, EventCard, AddEditEventModal, AiParseModal, VoiceCommandModal, GoogleTasksPanel, GmailModal, ConflictModal, BulkSyncModal vb.');
  addBullet('src/lib/', 'firebase.ts, googleCalendar.ts, googleTasksService.ts, googleMeetService.ts, conflictService.ts, icsGenerator.ts, exportUtils.ts, notificationService.ts.');
  addBullet('src/data/', 'initialEvents.ts, akbankPythonEvents.ts, careerEvents.ts, noCodeEvents.ts, techIstanbulEvents.ts, cop31Events.ts, innovationTemplates.ts.');
  addBullet('server.ts & src/services/', 'Express API sunucusu, morningBriefingCron.ts, taskSyncCron.ts, emailAlertService.ts, geminiNlpService.ts.');

  addFooter();

  return doc;
}

// If executed directly via node
if (process.argv[1]?.endsWith('generatePdfReport.js') || process.argv[1]?.endsWith('generatePdfReport.ts')) {
  try {
    const doc = buildPdfDocument();
    const outputPath = path.join(process.cwd(), 'public', 'inovasyon_etkinlik_ajandasi_detayli_rapor.pdf');
    const buffer = Buffer.from(doc.output('arraybuffer'));
    fs.writeFileSync(outputPath, buffer);
    console.log('PDF Report generated successfully at:', outputPath, 'Size:', buffer.length, 'bytes');
  } catch (err) {
    console.error('Failed to generate PDF:', err);
    process.exit(1);
  }
}
