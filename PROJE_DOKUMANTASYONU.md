# 📘 İnovasyon & Etkinlik Ajandası - Proje Dokümantasyonu

> **Son Güncelleme:** 11 Eylül 2026  
> **Uygulama Adı:** İnovasyon & Etkinlik Ajandası  
> **Kullanıcı:** Meryem Güçlü (`meriguclu123@gmail.com`)  
> **Teknoloji Yığını:** React 18, TypeScript, Vite, Tailwind CSS, Express (Node.js), Google Gemini API, Firebase Auth & Google Workspace APIs

---

## 📑 İçindekiler
1. [Proje Vizyonu ve Amacı](#1-proje-vizyonu-ve-amacı)
2. [Sistem Mimarisi ve Teknoloji Yığını](#2-sistem-mimarisi-ve-teknoloji-yığını)
3. [Google Workspace & Bulut Entegrasyonları](#3-google-workspace--bulut-entegrasyonları)
4. [Yapay Zeka (Gemini API) Özellikleri](#4-yapay-zeka-gemini-api-özellikleri)
5. [Arka Plan Zamanlayıcıları ve Otomasyonlar](#5-arka-plan-zamanlayıcıları-ve-otomasyonlar)
6. [Entegre Edilen Eğitim, Staj ve İnovasyon Ekosistemleri](#6-entegre-edilen-eğitim-staj-ve-inovasyon-ekosistemleri)
7. [Dizin ve Dosya Yapısı (Codebase Map)](#7-dizin-ve-dosya-yapısı-codebase-map)
8. [Kullanıcı Arayüzü ve Bileşen Mimarisi](#8-kullanıcı-arayüzü-ve-bileşen-mimarisi)
9. [Güvenlik, Dayanıklılık ve Veri Kalıcılığı](#9-güvenlik-dayanıklılık-ve-veri-kalıcılığı)
10. [Geliştirme ve Dağıtım Rehberi](#10-geliştirme-ve-dağıtım-rehberi)

---

## 1. Proje Vizyonu ve Amacı

**İnovasyon & Etkinlik Ajandası**, akademik, kariyer, teknoloji ve girişimcilik süreçlerini tek bir akıllı panoda toplayan kapsamlı bir yönetim merkezidir. 

### Temel Hedefler:
- **Çoklu Ekosistem Takibi:** TÜBİTAK 2209-A, CEZERİ/FERGANİ 2027 staj süreçleri, Tech Istanbul Bootcamp, Pupilica No-Code, Akbank Yapay Zeka & Python, Huawei ICT Academy, Miuul ve Atıl Samancıoğlu Python 100 Gün gibi yoğun ve eşzamanlı programları kaçırmadan yönetmek.
- **Zaman Çakışması Önleme:** Eşzamanlı başlayan canlı seminerler, mülakatlar ve teslim tarihlerini yapay zekayla denetleyip alternatif çözümler önermek.
- **Görev Devir & Takip Sistemi (Rollover):** Tamamlanamayan günlük görevlerin ertesi güne otomatik aktarılması ve sabah 06:00'da brifing olarak sunulması.
- **Google Workspace İki Yönlü Senkronizasyonu:** Google Takvim, Google Tasks, Gmail ve Google Meet Space servisleriyle anlık, doğrudan etkileşim.

---

## 2. Sistem Mimarisi ve Teknoloji Yığını

Uygulama, güvenliği ve hızı ön planda tutan **Full-Stack (Client + Server)** mimarisinde tasarlanmıştır:

### Ön Yüz (Frontend)
- **Kütüphane & Dil:** React 18 + TypeScript
- **Derleme Aracı:** Vite (Hızlı geliştirme ve modüler bundle)
- **Stil & Tasarım:** Tailwind CSS (Modern Nordic/Koyu tema paleti, yüksek kontrastlı tipografi, WCAG AA erişilebilirlik)
- **İkonografi:** `lucide-react`
- **Animasyonlar:** `motion` (`motion/react`)

### Sunucu Tarafı (Backend / Proxy API)
- **Sunucu:** Node.js + Express (`server.ts`)
- **Port:** `3000` (Docker / Cloud Run reverse proxy ile uyumlu)
- **Vite Middleware:** Geliştirme ortamında Vite dev server middleware olarak Express içine gömülüdür; üretimde ise `dist/` klasörü statik olarak sunulur.
- **Gizli Anahtarlar:** Gemini API anahtarları asla tarayıcıya iletilmez, yalnızca sunucu tarafında (`process.env.GEMINI_API_KEY`) kullanılır.

---

## 3. Google Workspace & Bulut Entegrasyonları

Uygulama, Google Identity Services (GSI) ve Firebase Auth OAuth 2.0 belirteçlerini kullanarak Google servisleriyle doğrudan çalışır:

1. **Google Takvim (Calendar API v3):**
   - Etkinlikleri Google Takvim'e tek tek veya toplu (`BulkSyncModal`) aktarma.
   - İki yönlü senkronizasyon, Google etkinliklerini çekme, güncelleme ve silme.
   - Çevrimdışı kullanım için RFC 5545 standartlarına tam uyumlu `.ICS` dışa aktarımı (`icsGenerator.ts`).

2. **Google Görevler (Tasks API v1):**
   - "İnovasyon & Etkinlik Ajandası" adında özel bir Google Tasks listesi açma veya mevcut listeyle eşitleme.
   - Tamamlanan görev durumlarının iki yönlü senkronizasyonu.
   - Tarih bazlı teslim ve hatırlatma entegrasyonu.

3. **Google Meet (Meet Space API):**
   - Tek tıkla yeni Google Meet video görüşme alanı (`spaces.create`) oluşturma (`GoogleMeetModal.tsx`).
   - Etkinlik kartlarına doğrudan "Meet'e Katıl" hızlı erişim butonu entegrasyonu.

4. **Gmail API (Gmail Read/Send):**
   - Gelen kutusunda etkinlik, mülakat, bootcamp ve kabul e-postalarını yapay zekayla tarayıp takvime aktarma (`GmailModal.tsx`).
   - Otomatik görev devir ve sabah brifingi e-posta bildirimleri.

5. **Firebase Authentication:**
   - Google Sign-In pop-up tabanlı giriş.
   - Tarayıcılarda (özellikle iframe ortamlarında) oluşan IndexedDB kapanma sorununa karşı `browserLocalPersistence` ve `inMemoryPersistence` ile güçlendirilmiş oturum yönetimi.

---

## 4. Yapay Zeka (Gemini API) Özellikleri

Proje, Google'ın yeni nesil **Gemini 3.7 Flash** modelini sunucu tarafında güvenle kullanır:

- **1. Doğal Dil Duyuru Ayrıştırıcı (`/api/parse-events`):**
  - Discord, Telegram, WhatsApp veya e-postalardan kopyalanan serbest biçimli Türkçe duyuruları algılar.
  - Tarih, saat, toplantı linki, zorunluluk durumu, kategori ve platform bilgilerini JSON formatında ayrıştırıp takvime döker.
- **2. Türkçe Sesli Komut Asistanı (`/api/gemini/parse-voice-command`):**
  - Tarayıcının Web Speech API mikrofon girdisini alır.
  - *"Yarın akşam saat 20:00'ye KPSS vatandaşlık denemesi ekle"* veya *"Cuma gününe TÜBİTAK proje toplantısı yaz"* gibi konuşmaları anlayarak tarih, kategori ve öncelik belirleyip görevi anında kaydeder.
- **3. Akıllı Görev Dağıtıcı (Smart Task Dispatcher):**
  - Görev metnini analiz ederek Eisenhower Matrisinde (Kritik, Yüksek, Normal) doğru önceliğe ve uygun kategoriye otomatik yerleştirir.

---

## 5. Arka Plan Zamanlayıcıları ve Otomasyonlar

1. **Her Sabah 06:00 Brifingi (`morningBriefingCron.ts`):**
   - Node-cron zamanlayıcısı her gün saat 06:00'da tetiklenir (`0 6 * * *`).
   - O günün kritik etkinliklerini, yaklaşan teslim tarihlerini ve devreden görevleri özetleyen bir sabah raporu hazırlar.
   - UI üzerinden `/api/morning-briefing/trigger` ile istendiğinde anlık test edilebilir.

2. **Otomatik Görev Devir (Daily Rollover - `taskSyncCron.ts`):**
   - Geçmiş günlerden kalan ve tamamlanmamış görevleri tespit eder.
   - Görevleri "Dünden Devredenler" etiketiyle bugünün yapılacaklar listesine otomatik taşır.
   - İsteğe bağlı olarak kullanıcıya devreden görev raporunu e-posta ile iletir (`emailAlertService.ts`).

---

## 6. Entegre Edilen Eğitim, Staj ve İnovasyon Ekosistemleri

Takvimde hali hazırda tanımlanmış, kontrol listeleri ve linkleri hazır olan programlar:

| Program / Ekosistem | Kapsam & Platform | Tarih Aralığı |
| :--- | :--- | :--- |
| **Akbank Python'a Giriş** | 10million.AI (Yapay Zekaya İlk Adım + Python), Mentorluklar | 7 – 27 Eylül 2026 |
| **Pupilica: No-Code & Low-Code** | Engin Deniz Alpman, Bubble, Make, FlutterFlow | 15 – 24 Eylül 2026 |
| **Tech Istanbul AI Bootcamp** | Uygulamalı Yapay Zeka, İBB & Tech Istanbul | 8 Eylül – 8 Ekim 2026 |
| **Huawei ICT Academy Networks** | Sena İlayda Hocaoğlu, Huawei eNSP Canlı Lab | 11 Eylül 2026 |
| **JCI Maltepe - AIP Stajı** | Anatolian Internship Program Mülakat & Tanışma | 17 Eylül 2026 |
| **Miuul - Claude Code Semineri** | Bedirhan Keskin (Anthropic Hackathon 1.si, MedKit) | 21 Eylül 2026 |
| **PythianGo AI Masterclass** | 4 Haftalık İleri Düzey Yapay Zeka Programı | 26 Ağustos – 23 Eylül 2026 |
| **CareerGen: Kariyere İlk Adım** | 1. Dönem Bootcamp & Kariyer Gelişimi | Eylül 2026 |
| **Python 100 Gün (Udemy)** | Atıl Samancıoğlu Python 100 Günlük Kampı | Ağustos – Eylül 2026 |
| **COP31 Türkiye Akademi** | Çevre ve İklim Değişikliği Gönüllülük Eğitimi | Eylül 2026 |
| **TÜBİTAK 2209-A & Bilim Genç** | Üniversite Öğrencileri Araştırma Projeleri Desteği | Başvuru & Hazırlık Dönemi |
| **Ar-Ge & İnovasyon Proje Pazarı** | Patent & Proje Yarışması Süreçleri | 2026 Dönemi |
| **CEZERİ & FERGANİ 2027 Stajları** | Havacılık ve Uzay Teknolojileri Aday Mühendislik | Uzun Dönem Staj Takvimi |

---

## 7. Dizin ve Dosya Yapısı (Codebase Map)

```text
├── .env.example                     # Gerekli ortam değişkenleri şablonu
├── firebase-applet-config.json      # Firebase proje kimlik yapılandırması
├── metadata.json                    # Uygulama izinleri ve platform yetenekleri
├── package.json                     # Bağımlılıklar, build ve start komutları
├── server.ts                        # Express API sunucusu, cron servisleri, Vite entegrasyonu
├── index.html                       # Ana HTML giriş noktası, SEO etiketleri
│
├── src/
│   ├── main.tsx                     # React DOM giriş noktası
│   ├── App.tsx                      # Ana uygulama kabuğu, state yönetimi, bildirim motoru
│   ├── types.ts                     # Tüm TypeScript tip tanımları (Event, Task, Category vb.)
│   ├── index.css                    # Tailwind CSS direktifleri ve global stiller
│   │
│   ├── components/                  # Modüler React UI Bileşenleri
│   │   ├── Header.tsx               # Üst bar, arama, filtreler, profil ve yetkilendirme
│   │   ├── Sidebar.tsx              # Sol navigasyon paneli, program kategorileri ve sayaçlar
│   │   ├── CalendarView.tsx         # Ay, hafta, gün ve ajanda takvim ızgarası
│   │   ├── EventCard.tsx            # Etkinlik kartı, hızlı linkler (Meet, Zoom, YouTube, 10million.ai)
│   │   ├── AddEditEventModal.tsx    # Manuel etkinlik ekleme/düzenleme modalı
│   │   ├── AiParseModal.tsx         # Yapay zeka ile metinden etkinlik ayrıştırma modalı
│   │   ├── VoiceCommandModal.tsx    # Türkçe sesli komut alma ve görev dönüştürme modalı
│   │   ├── GoogleTasksPanel.tsx     # Google Tasks & günlük devir görev yöneticisi
│   │   ├── TaskPanel.tsx            # Genişletilmiş görev, KPSS ve inovasyon takip paneli
│   │   ├── GmailModal.tsx           # Gmail gelen kutusu etkinlik tarayıcısı
│   │   ├── GoogleMeetModal.tsx      # Hızlı Google Meet video toplantısı oluşturucu
│   │   ├── ConflictModal.tsx        # Çakışma bildirim ve çözümleme penceresi
│   │   ├── BulkSyncModal.tsx        # Toplu Google Takvim ve .ICS senkronizasyonu
│   │   ├── InnovationRadar.tsx      # Başvuru ve inovasyon durum radarı
│   │   ├── InnovationRoadmapView.tsx# Gantt tarzı zaman çizelgesi ve aşama yol haritası
│   │   ├── NotificationManagerModal.tsx # Bildirim ve ses tercihleri yöneticisi
│   │   ├── SettingsSyncModal.tsx    # Sistem ve entegrasyon ayarları modalı
│   │   └── ConfirmationModal.tsx    # İşlem onay pencereleri
│   │
│   ├── data/                        # Statik ve Önyüklü Veri Setleri
│   │   ├── initialEvents.ts         # Ana takvim etkinlikleri birleştiricisi
│   │   ├── akbankPythonEvents.ts    # Akbank Python ve 10million.AI etkinlikleri
│   │   ├── careerEvents.ts          # Huawei, JCI Maltepe, Softtech kariyer etkinlikleri
│   │   ├── noCodeEvents.ts          # Pupilica No-Code eğitim takvimi
│   │   ├── techIstanbulEvents.ts    # Tech Istanbul AI Bootcamp takvimi
│   │   ├── aiMasterclassEvents.ts   # PythianGo Masterclass verileri
│   │   ├── careerGenEvents.ts       # CareerGen Bootcamp etkinlikleri
│   │   ├── python100Events.ts       # 100 Günlük Python Kampı verileri
│   │   ├── cop31Events.ts           # COP31 Türkiye Akademi etkinlikleri
│   │   └── innovationTemplates.ts   # TÜBİTAK, CEZERİ, FERGANİ şablonları
│   │
│   ├── lib/                         # İstemci Tarafı Servisler ve Yardımcılar
│   │   ├── firebase.ts              # Firebase Auth istemcisi ve dirençli oturum yönetimi
│   │   ├── googleCalendar.ts        # Google Calendar API REST entegrasyonu
│   │   ├── googleTasksService.ts    # Google Tasks API REST entegrasyonu
│   │   ├── googleMeetService.ts     # Google Meet REST entegrasyonu
│   │   ├── gmailService.ts          # Gmail API istemci servisleri
│   │   ├── conflictService.ts       # Takvim çakışma tespit algoritması
│   │   ├── icsGenerator.ts          # RFC 5545 uyumlu .ICS takvim dosyası üreticisi
│   │   ├── exportUtils.ts           # CSV, JSON, Markdown dışa aktarıcılar
│   │   ├── notificationService.ts   # Tarayıcı bildirimleri ve sesli ikaz servisi
│   │   ├── useDailyTasks.ts         # Günlük görev devir ve senkronizasyon hook'u
│   │   └── useTaskManager.ts        # Kapsamlı görev state yönetim hook'u
│   │
│   ├── server/                      # Sunucu Tarafı Özel Servisler
│   │   ├── emailAlertService.ts     # E-posta gönderme ve bildirim servisleri
│   │   └── taskSyncCron.ts          # Görev devir arka plan mantığı
│   │
│   └── services/                    # İş Mantığı ve AI Servisleri
│       ├── geminiNlpService.ts      # Gemini NLP promptları ve istemci yönlendiricisi
│       ├── smartTaskDispatcher.ts   # Görev sınıflandırma ve önceliklendirme
│       └── morningBriefingCron.ts   # Sabah 06:00 brifing servisi ve cron job
```

---

## 8. Kullanıcı Arayüzü ve Bileşen Mimarisi

- **Nordic Koyu Tema:** `#0F172A` arka plan, `#1E293B` kart zeminleri ve `#38BDF8`, `#818CF8`, `#34D399` vurgu renkleri ile gözü yormayan yüksek kontrast.
- **Dinamik Kart Çipleri:** Etkinlik kartlarında link türüne göre akıllı butonlar belirir:
  - Google Meet için yeşil **"Meet'e Katıl"**
  - Zoom için mavi **"Zoom'a Katıl"**
  - YouTube için kırmızı **"YouTube Canlı Yayın"**
  - 10million.AI için pembe **"10million.AI Giriş"**
- **Etkileşimli Kontrol Listeleri (Deliverables):** Her etkinlik kartının içinde aşama aşama işaretlenebilir onay kutuları yer alır ve durumları kaydedilir.

---

## 9. Güvenlik, Dayanıklılık ve Veri Kalıcılığı

1. **Firebase IndexedDB / Closing-Hidden Çözümü:**
   - Pop-up açılışlarında veya sekme arka plana geçtiğinde oluşan `Database is closing/hidden` hatası, `browserLocalPersistence` ve `inMemoryPersistence` fallback mekanizmasıyla kalıcı olarak çözülmüştür.
2. **Access Token Yedekleme:**
   - Google Access Token'ı güvenli bir şekilde `localStorage` üzerinde yedeklenerek sekme yenilendiğinde oturum kopması engellenir.
3. **Akıllı Veri Birleştirme (Data Merging):**
   - `initialEvents.ts` dosyasına yeni bir etkinlik eklendiğinde, kullanıcının mevcut kayıtları veya işaretlediği onay kutuları silinmez; yeni etkinlikler otomatik olarak kullanıcı takvimine eklenir.

---

## 10. Geliştirme ve Dağıtım Rehberi

### Geliştirme Sunucusunu Başlatma:
```bash
npm run dev
```
*(Express sunucusu 3000 portunda başlar ve Vite middleware'ini otomatik bağlar.)*

### Tip Kontrolü ve Linting:
```bash
npm run lint
```

### Üretim Derlemesi (Production Build):
```bash
npm run build
```
*(Vite ile istemci derlenir ve esbuild ile `dist/server.cjs` tek dosya Node sunucusu oluşturulur.)*

### Üretim Sunucusunu Çalıştırma:
```bash
npm run start
```
