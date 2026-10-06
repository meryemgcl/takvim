<div align="center">

# 📅 İnovasyon & Etkinlik Ajandası

**Masaüstü & Mobil Takvim Senkronizasyon Sistemi**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-latest-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Gemini AI](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

> Akademik, kariyer, teknoloji ve girişimcilik süreçlerini tek akıllı panoda birleştiren, yapay zeka destekli tam entegreli takvim yönetim sistemi.

</div>

---

## 📋 İçindekiler

- [✨ Özellikler](#-özellikler)
- [🏗️ Mimari](#️-mimari)
- [📦 Teknoloji Yığını](#-teknoloji-yığını)
- [🚀 Kurulum](#-kurulum)
- [⚙️ Ortam Değişkenleri](#️-ortam-değişkenleri)
- [📁 Proje Yapısı](#-proje-yapısı)
- [🤖 Yapay Zeka Özellikleri](#-yapay-zeka-özellikleri)
- [🔗 Google Workspace Entegrasyonları](#-google-workspace-entegrasyonları)
- [⏰ Otomasyon & Zamanlayıcılar](#-otomasyon--zamanlayıcılar)
- [📚 Belgeler](#-belgeler)
- [🤝 Katkıda Bulunma](#-katkıda-bulunma)

---

## ✨ Özellikler

| Özellik | Açıklama |
|---|---|
| 🗓️ **İki Yönlü Senkronizasyon** | Google Takvim ile gerçek zamanlı çift yönlü veri akışı |
| 🤖 **Yapay Zeka Asistanı** | Gemini AI ile doğal dil ve sesli komut desteği |
| 📧 **Gmail Tarama** | E-postalardan etkinlik ve görev otomatik algılama |
| ✅ **Görev Devir (Rollover)** | Tamamlanamayan görevler ertesi güne otomatik aktarılır |
| 🎙️ **Sesli Komut** | Türkçe konuşma ile görev ekleme ve yönetme |
| 📊 **Sabah Brifingi** | Her sabah 06:00'da günün özetini e-posta ile alma |
| 📹 **Google Meet Entegrasyonu** | Tek tıkla video görüşme başlatma |
| 📥 **ICS Dışa Aktarım** | RFC 5545 uyumlu takvim dosyası indirme |
| 🔒 **Güvenli Proxy API** | API anahtarları asla tarayıcıya iletilmez |

---

## 🏗️ Mimari

```
┌─────────────────────────────────────────────────────────┐
│                    TARAYICI (Browser)                    │
│                                                          │
│   React 18 + TypeScript + Tailwind CSS + Vite           │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│   │Takvim UI │ │ Görevler │ │ Gmail    │ │ Brifing  │  │
│   └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘  │
└────────┼────────────┼────────────┼─────────────┼────────┘
         │            │            │             │
         ▼            ▼            ▼             ▼
┌─────────────────────────────────────────────────────────┐
│              NODE.JS / EXPRESS SUNUCU (:3000)            │
│                                                          │
│  /api/parse-events  /api/gemini/*  /api/google/*        │
│         │                 │               │              │
│         ▼                 ▼               ▼              │
│   Gemini API      Firebase Auth    Google APIs           │
│   (AI Flash)      OAuth 2.0        Calendar, Tasks,      │
│                                    Gmail, Meet           │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Teknoloji Yığını

### Ön Yüz (Frontend)

| Teknoloji | Versiyon | Amaç |
|---|---|---|
| **React** | 18 | UI bileşen kütüphanesi |
| **TypeScript** | 5.x | Tip güvenli geliştirme |
| **Vite** | Latest | Hızlı derleme ve HMR |
| **Tailwind CSS** | v4 | Utility-first stilleme |
| **Lucide React** | Latest | İkon seti |
| **Motion** | Latest | Animasyon kütüphanesi |

### Arka Yüz (Backend)

| Teknoloji | Versiyon | Amaç |
|---|---|---|
| **Node.js + Express** | Latest | Proxy API sunucusu |
| **TypeScript (tsx)** | Latest | Sunucu kodu |
| **Bun** | Latest | Paket yöneticisi ve çalıştırıcı |

### Servisler & Entegrasyonlar

| Servis | Kullanım Amacı |
|---|---|
| **Google Gemini 3.7 Flash** | Doğal dil işleme, sesli komut, görev sınıflandırma |
| **Firebase Authentication** | Google OAuth 2.0 kimlik doğrulama |
| **Google Calendar API v3** | Takvim okuma/yazma/senkronizasyon |
| **Google Tasks API v1** | Görev listesi yönetimi |
| **Gmail API** | E-posta tarama ve etkinlik çıkarma |
| **Google Meet Space API** | Video görüşme odası oluşturma |
| **Notion API** | Opsiyonel görev senkronizasyonu |

---

## 🚀 Kurulum

### Gereksinimler

- [Node.js](https://nodejs.org/) >= 18
- [Bun](https://bun.sh/) (önerilen) veya npm/yarn
- Google Cloud Console projesi (Calendar, Tasks, Gmail, Meet API'leri etkin)
- Firebase projesi (Authentication etkin)
- Gemini API anahtarı ([Google AI Studio](https://aistudio.google.com/))

### 1. Repoyu Klonlayın

```bash
git clone https://github.com/meryemgcl/takvim.git
cd takvim
```

### 2. Bağımlılıkları Yükleyin

```bash
bun install
# veya
npm install
```

### 3. Ortam Değişkenlerini Ayarlayın

```bash
cp .env.example .env
```

`.env` dosyasını düzenleyerek gerekli API anahtarlarını girin (bkz. [Ortam Değişkenleri](#️-ortam-değişkenleri)).

### 4. Geliştirme Sunucusunu Başlatın

```bash
bun run dev
# veya
npm run dev
```

Uygulama `http://localhost:3000` adresinde açılacaktır.

### 5. Üretim Build'i

```bash
bun run build
bun run start
# veya
npm run build
npm run start
```

---

## ⚙️ Ortam Değişkenleri

`.env.example` dosyasını kopyalayarak `.env` oluşturun:

```env
# Zorunlu - Google Gemini AI API Anahtarı
GEMINI_API_KEY="your_gemini_api_key_here"

# Zorunlu - Uygulamanın host URL'i (OAuth callback için)
APP_URL="http://localhost:3000"

# Opsiyonel - Notion Entegrasyonu
NOTION_API_KEY=
NOTION_DATABASE_ID=

# Firebase Yapılandırması (firebase-applet-config.json üzerinden de ayarlanabilir)
FIREBASE_API_KEY=
FIREBASE_PROJECT_ID=
```

> [!CAUTION]
> `.env` dosyasını asla Git'e commit etmeyin. `.gitignore` dosyasında zaten hariç tutulmuştur.

---

## 📁 Proje Yapısı

```
takvim/
├── src/                          # React ön yüz kaynak kodu
│   ├── components/               # UI bileşenleri
│   │   ├── BulkSyncModal.tsx     # Toplu Google Takvim aktarımı
│   │   ├── GoogleMeetModal.tsx   # Meet görüşme oluşturma
│   │   └── GmailModal.tsx        # Gmail tarama arayüzü
│   ├── services/                 # API servis katmanı
│   └── ...
├── services/                     # Sunucu tarafı servisler
├── scripts/
│   └── generatePdfReport.ts      # PDF rapor oluşturucu
├── data/                         # Yerel veri dosyaları
├── assets/                       # Statik kaynaklar
├── public/                       # Public dizini
├── server.ts                     # Express proxy sunucusu (~46KB)
├── vite.config.ts                # Vite yapılandırması
├── tsconfig.json                 # TypeScript yapılandırması
├── package.json                  # Paket bağımlılıkları
├── firebase-applet-config.json   # Firebase yapılandırması
├── .env.example                  # Örnek ortam değişkenleri
└── ...
```

---

## 🤖 Yapay Zeka Özellikleri

### 1. 📝 Doğal Dil Duyuru Ayrıştırıcı
`POST /api/parse-events` endpoint'i, Discord/Telegram/WhatsApp/e-posta gibi kaynaklardan kopyalanan **serbest biçimli Türkçe metinleri** analiz eder:

```
"Bu hafta Cuma saat 15:00'te TÜBİTAK proje sunumu var, Zoom linki: meet.google.com/xxx"
```
↓ Gemini AI çıktısı:
```json
{
  "title": "TÜBİTAK Proje Sunumu",
  "date": "2026-10-10",
  "time": "15:00",
  "meetLink": "meet.google.com/xxx",
  "category": "TUBITAK",
  "priority": "CRITICAL"
}
```

### 2. 🎙️ Türkçe Sesli Komut Asistanı
Tarayıcının Web Speech API'siyle entegre çalışır:

```
"Yarın akşam saat 20:00'ye KPSS vatandaşlık denemesi ekle"
"Cuma gününe TÜBİTAK proje toplantısı yaz"
```

### 3. 🧠 Akıllı Görev Öncelik Sınıflandırıcı
Eisenhower Matrisine göre görevleri otomatik sınıflandırır:

| Öncelik | Kriter |
|---|---|
| 🔴 **KRİTİK** | Deadline < 24 saat, mülakatlar, sunum günleri |
| 🟠 **YÜKSEK** | Başvuru son günleri, önemli etkinlikler |
| 🟡 **NORMAL** | Günlük görevler, öğrenme hedefleri |

---

## 🔗 Google Workspace Entegrasyonları

### 📅 Google Takvim
- Tekli ve toplu (`BulkSyncModal`) etkinlik aktarımı
- İki yönlü senkronizasyon (okuma, güncelleme, silme)
- RFC 5545 uyumlu `.ICS` dosya dışa aktarımı

### ✅ Google Görevler
- Özel "İnovasyon & Etkinlik Ajandası" görev listesi
- Görev durumu iki yönlü senkronizasyonu
- Tarih bazlı hatırlatıcı entegrasyonu

### 📹 Google Meet
- Tek tıkla yeni Meet alanı oluşturma
- Etkinlik kartlarına "Meet'e Katıl" butonu entegrasyonu

### 📧 Gmail
- Gelen kutusunu AI ile tarayıp etkinlik çıkarma
- Otomatik sabah brifingi e-posta bildirimleri

---

## ⏰ Otomasyon & Zamanlayıcılar

| Zamanlayıcı | Zaman | Görev |
|---|---|---|
| **Sabah Brifingi** | `06:00` her gün | Günün kritik etkinliklerini, teslim tarihlerini ve devreden görevleri özetler, e-posta gönderir |
| **Görev Rollover** | Gece yarısı | Tamamlanamayan görevleri ertesi güne taşır |

---

## 📚 Belgeler

| Dosya | İçerik |
|---|---|
| [`PROJE_DOKUMANTASYONU.md`](./PROJE_DOKUMANTASYONU.md) | Detaylı teknik mimari ve özellik belgesi |
| [`SISTEM_VE_AJANDA_YONETIM_KILAVUZU.md`](./SISTEM_VE_AJANDA_YONETIM_KILAVUZU.md) | AI model devir kılavuzu (Claude, ChatGPT, Cursor uyumlu) |
| [`AGENTS.md`](./AGENTS.md) | AI ajanları için yapılandırma ve rehber |
| [`SECURITY.md`](./SECURITY.md) | Güvenlik politikaları ve güvenlik açığı bildirimi |
| [`yapılacaklar.md`](./yapılacaklar.md) | Yol haritası ve yapılacaklar listesi |

---

## 🛠️ Geliştirme Scriptleri

```bash
# Geliştirme sunucusunu başlat
bun run dev

# TypeScript tip kontrolü (lint)
bun run lint

# PDF raporu oluştur
bun run generate:pdf

# Üretim build'i
bun run build

# Üretim sunucusunu başlat
bun run start

# Dist klasörünü temizle
bun run clean
```

---

## 🤝 Katkıda Bulunma

1. Bu repoyu fork'layın
2. Yeni bir branch oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Değişikliklerinizi commit'leyin (`git commit -m 'feat: yeni özellik eklendi'`)
4. Branch'inizi push'layın (`git push origin feature/yeni-ozellik`)
5. Pull Request açın

---

## 🔒 Güvenlik

Güvenlik açığı bildirmek için [`SECURITY.md`](./SECURITY.md) dosyasını inceleyin.

---

<div align="center">

**Geliştirici:** [Meryem Güçlü](https://github.com/meryemgcl)

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!

</div>
