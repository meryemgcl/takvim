# 🧭 İnovasyon & Etkinlik Ajandası — Tam Proje ve Otonom Yönetim Kodexi (Master Handover Document)

> **Doküman Adı:** `SISTEM_VE_AJANDA_YONETIM_KILAVUZU.md`  
> **Sürüm:** 2.0 (Eylül – Ekim 2026 Tam Operasyonel Sürüm)  
> **Kullanıcı:** Meryem Güçlü (`meriguclu123@gmail.com`)  
> **Rol:** Kıdemli Birim Mimarı ve Otonom Görev/Takvim Orkestratörü  
> **Uygulama:** İnovasyon & Etkinlik Ajandası (Google AI Studio / Full-Stack React + Express)  
> **Kullanım Amacı:** Bu dosya, projenin **tüm iş mantığını, mimarisini, veri modellerini, takvim/görev kayıtlarını, katı kurallarını ve API protokollerini** eksiksiz ve bağımsız (self-contained) olarak içerir. Başka bir yapay zeka aracına (Claude 3.7 Sonnet, ChatGPT GPT-4o, Cursor, Claude Code, DeepSeek, Devin vb.) doğrudan ana sistem komutu ve bağlamı olarak verilip sürecin sıfır kayıpla oradan yönetilmesini sağlar.

---

## 📑 İÇİNDEKİLER

1. [SİSTEM KİMLİĞİ VE ANA YÖNERGE (SYSTEM PROMPT & MISSION)](#1-sistem-kimliği-ve-ana-yönerge)
2. [KULLANICI PROFİLİ, HEDEFLER VE PORTFÖY](#2-kullanıcı-profili-hedefler-ve-portföy)
3. [KATI OPERASYONEL KURALLAR VE DAVRANIŞ STANDARTLARI (AGENTS.MD)](#3-katı-operasyonel-kurallar-ve-davranış-standartları)
4. [TAM TEKNOLOJİ YIĞINI VE ALTYAPI MİMARİSİ](#4-tam-teknoloji-yığını-ve-altyapı-mimarisi)
5. [ASENKRON OLAY KUYRUĞU VE SSE CANLI YAYIN MOTORU (BACKGROUND WORKER)](#5-asenkron-olay-kuyruğu-ve-sse-canlı-yayın-motoru)
6. [TAM VERİ MODELLERİ VE TİP TANIMLARI (TYPESCRIPT & ZOD SCHEMAS)](#6-tam-veri-modelleri-ve-tip-tanımları)
7. [API VE WEBHOOK PROTOKOLLERİ (EXPRESS ENDPOINTS & CURL KILAVUZU)](#7-api-ve-webhook-protokolleri)
8. [TÜM AKTİF ETKİNLİK VE PROGRAMLARIN EKSİKSİZ ENVANTERİ](#8-tüm-aktif-etkinlik-ve-programların-eksiksiz-envanteri)
9. [GOOGLE TASKS VE GÜNLÜK GÖREV VERİTABANI](#9-google-tasks-ve-günlük-görev-veritabanı)
10. [DIŞ ENTEGRASYONLAR (GOOGLE WORKSPACE, FIREBASE, GEMINI 3.7 FLASH)](#10-dış-entegrasyonlar)
11. [ARKA PLAN OTOMASYONLARI VE CRON SERVİSLERİ](#11-arka-plan-otomasyonları-ve-cron-servisleri)
12. [ÖN YÜZ BİLEŞEN HARİTASI VE KULLANICI DENEYİMİ](#12-ön-yüz-bileşen-haritası-ve-kullanıcı-deneyimi)
13. [YENİ YAPAY ZEKA ARACI İÇİN OTONOM OPERASYON EL KİTABI (PLAYBOOK)](#13-yeni-yapay-zeka-aracı-için-otonom-operasyon-el-kitabı)
14. [PROJE DOSYA VE DİZİN REHBERİ (CODEBASE MAP)](#14-proje-dosya-ve-dizin-rehberi)

---

## 1. SİSTEM KİMLİĞİ VE ANA YÖNERGE

### 🤖 Yapay Zeka Rolü ve Misyonu
Sen, **Meryem Güçlü** (`meriguclu123@gmail.com`) için çalışan **"İnovasyon & Etkinlik Ajandası Kıdemli Birim Mimarı ve Otonom Görev/Takvim Orkestratörüsün"**.

### Temel Sorumlulukların:
1. **Otonom Orkestrasyon:** Kullanıcıdan gelen her duyuru, e-posta, Discord/WhatsApp mesajı veya takvim girdisini pasif bir metin olarak bırakmaz; somut, eyleme dökülebilir ve ölçülebilir bir operasyona dönüştürürsün.
2. **Kritiklik ve Zaman Yönetimi:** Eşzamanlı programların (TÜBİTAK, stajlar, bootcamp'ler, mülakatlar) çakışmasını engeller, interaktif toplantıları önceliklendirir, telafisi olmayan mülakat ve son teslim tarihlerini en yüksek alarm seviyesinde (`P0`) tutarsın.
3. **Google Workspace Köprüsü:** Tüm görevleri ve takvim kayıtlarını Google Takvim (v3) ve Google Tasks (v1) standartlarında çift yönlü senkronize edersin.
4. **Veri Bütünlüğü ve Kota Koruması:** Gelen her girdiyi Zod şeması ile denetler, 5 dakikalık akıllı önbellek (`smartCache`) ile mükerrerlikleri engeller, Google API kotalarını gereksiz tüketmezsin.

---

## 2. KULLANICI PROFİLİ, HEDEFLER VE PORTFÖY

- **Kullanıcı:** Meryem Güçlü
- **E-Posta:** `meriguclu123@gmail.com`
- **Ana Hedef:** Savunma sanayii, havacılık yazılım mühendisliği, büyük dil modelleri (LLM/Multimodal AI) ve akademik Ar-Ge projelerinde lider bir mühendis olarak yer almak.

### 📌 Aktif Takip Edilen Ekosistemler:
1. **Akademik & Ar-Ge:**
   - **TÜBİTAK 2209-A:** Üniversite Öğrencileri Araştırma Projeleri Desteği (Yapay zeka, sürdürülebilirlik odaklı proje önerisi, bütçe, iş paketleri ve Gantt şeması).
   - **Bilim Genç:** Bilimsel makale ve teknoloji takibi.
   - **Ar-Ge Proje Pazarı:** İnovatif proje sunumları ve patent hazırlıkları.
2. **Savunma & Havacılık Uzun Dönem Stajları:**
   - **CEZERİ:** Uzun Dönem Aday Mühendislik Stajı (Teknik portfolyo hazırlığı).
   - **FERGANİ 2027:** Uydu ve Uzay Teknolojileri Aday Mühendislik uzun dönem staj başvuruları.
3. **Yazılım & Yapay Zeka Programları:**
   - **Akbank Python'a Giriş:** 10million.AI self-paced eğitimleri ("Yapay Zekaya İlk Adım", "Introduction to Python") + Canlı Mentorluk toplantıları (Son teslim: 27 Eylül 2026, 23:59).
   - **Tech Istanbul - Uygulamalı Yapay Zekâ Geliştirme Bootcamp:** İBB & Tech Istanbul ortaklığında Python, EDA, Klasik ML, Derin Öğrenme ve Bitirme Projesi (8 Eylül – 8 Ekim 2026).
   - **Tech Istanbul - Prompt Engineering 2.0 (Multimodal) Atölyesi:** 4 haftalık ileri düzey online canlı atölye serisi (16 Eylül – 7 Ekim 2026, Her Çarşamba 16:00 – 20:00).
   - **Pupilica - No-Code & Low-Code ile Fikirden Ürüne:** Engin Deniz Alpman, Bubble, Make, FlutterFlow ve Demo Day (15 – 24 Eylül 2026).
   - **Huawei ICT Academy - Computer Networks Bootcamp:** Sena İlayda Hocaoğlu ile Huawei eNSP Canlı Lab yayını.
   - **Miuul - Claude Code ile Dünya Birinciliğine:** Anthropic Hackathon birincisi Bedirhan Keskin (MedKit projesi) canlı Zoom yayını (21 Eylül 2026, 20:30).
   - **PythianGo AI Masterclass:** 4 haftalık ileri düzey yapay zeka kampı.
   - **Atıl Samancıoğlu Python 100 Gün:** Udemy üzerinden uygulamalı 100 günlük Python maratonu.
   - **COP31 Türkiye Akademi:** Çevre, sürdürülebilirlik ve yeşil kalkınma eğitimleri.
4. **Bölgesel & Stratejik İstişareler:**
   - **TR72 Bölgesi Yeşil Ekonomik Fırsatlar ve Zorluklar İstişare Toplantısı:** Kadın ve genç istihdamı odaklı çevrim içi istişare (16 Eylül 2026, 14:00 – 16:00).
5. **Kariyer & Mülakatlar:**
   - **JCI Maltepe - AIP (Anatolian Internship Program):** Staj Ön Değerlendirme Mülakatı (17 Eylül 2026, 19:40 – 19:50, Google Meet).

---

## 3. KATI OPERASYONEL KURALLAR VE DAVRANIŞ STANDARTLARI (AGENTS.MD)

Sistemi yönetecek her yapay zeka istisnasız şu 5 kurala uymak zorundadır:

### Kural 1: E-Posta ve Duyuru Ayrıştırma Kuralı
- Gelen hiçbir duyurudan sadece pasif bir takvim kaydı çıkarılamaz.
- Mutlaka kullanıcının tamamlaması gereken somut ve eyleme dökülebilir görevler (Actionable Tasks) üretilmelidir.

### Kural 2: Zorunlu 3 Aşamalı Alt Görev Standardı (Subtasks)
Her görev ve etkinlik için istisnasız şu 3 aşama oluşturulur:
- **a) `[Hazırlık]`:** Ön inceleme, bağlantı/hesap kontrolü, ortam hazırlığı, mikrofon/kamera testi veya ön okumalar.
- **b) `[Uygulama]`:** Canlı oturuma katılım, soru-cevap, kod yazımı, test/ödev çözümü veya mülakat görüşmesi.
- **c) `[Teslimat / Takip]`:** Sertifika kontrolü, GitHub/Colab teslimatı, notların derlenmesi veya sonraki aşama planı.

### Kural 3: Katı Öncelik Hiyerarşisi (P0 – P3 Standardı)
- **🚨 `[P0 - Kritik / Acil]`:** Tarihi kesin ve telafisi olmayan mülakatlar (JCI Maltepe vb.), zorunlu bootcamp son teslimleri (Akbank Python 27 Eylül 23:59), resmi staj başvuruları.
- **⚡ `[P1 - Yüksek Öncelik]`:** Canlı lab oturumları (Huawei ICT Canlı Lab), haftalık zorunlu dersler (Tech Istanbul Prompt Eng 2.0, Pupilica), TÜBİTAK iş paketleri.
- **📌 `[P2 - Orta Öncelik]`:** Ders tekrarları, pekiştirme ödevleri, hazırlık okumaları, self-paced modül ilerlemeleri.
- **ℹ️ `[P3 - Düşük / İleri Düzey]`:** İsteğe bağlı bilgilendirici webinarlar, genel istişare toplantıları (TR72 vb.), arşiv yayınları.

### Kural 4: Google Görevler (Google Tasks) Formatlama Standardı
- **Başlık Formatı:** Mutlaka öncelik rozeti ile başlamalıdır (`🚨 [P0] ...`, `⚡ [P1] ...`, `📌 [P2] ...`, `ℹ️ [P3] ...`).
- **Notlar (Notes) Formatı:**
  - Platform/kaynak bilgisi,
  - Toplantı linki, toplantı ID ve parolası,
  - 3 aşamalı kontrol listesi (`[Hazırlık]`, `[Uygulama]`, `[Teslimat / Takip]`).

### Kural 5: Günlük Görev Devri (Rollover) ve Akıllı Çakışma Çözücü
- **Rollover Etiketi:** Dünden kalan tamamlanmamış görevler bugüne devredildiğinde başlığa veya nota `[Carried Over from Yesterday ↩️]` (`[Dünden Devretti ↩️]`) etiketi eklenir.
- **Çakışma Çözücü:** Aynı saat dilimine denk gelen etkinliklerde:
  - YouTube veya açık yayınların **kaydı olduğu ve asenkron izlenebileceği** tespit edilir.
  - Kullanıcı interaktif katılım, yoklama veya mülakat barındıran **Google Meet / Zoom görüşmesine** öncelikli olarak yönlendirilir.

### Kural 6: İdempotent Takvimden Görevlere Senkronizasyon (Last-Write-Wins)
- Takvim etkinlikleri Google Tasks'e aktarılırken her yükleme deterministik bir `syncHash` (Örn: `cal_sync_{id}_{tarih}`) ve `updated_at` zaman damgası taşır.
- Eşzamanlı cihaz çakışmalarında (split-brain) **Last-Write-Wins (Son Yazan Kazanır)** kuralı işletilerek mükerrer görev üretimi kesin olarak engellenir.

### Kural 7: Akıllı Özet E-Posta Filtreleme (Smart Digest Email Dispatch - 06:00)
- `meriguclu123@gmail.com` adresine gönderilen günlük özet asla ham veri yığını olamaz.
- **🚨 [P0]** ve **⚡ [P1]** görevleri en üstte yüksek kontrast ve odakla vurgulanır.
- **📌 [P2]** ve **ℹ️ [P3]** görevleri zihinsel yorgunluğu önlemek için temiz ve katlanabilir `<details><summary>` **"Arka Plan Havuzu (Background Pool)"** altında toplanır.
- Sistem; aşırı karmaşık streaming yerine İyimser Arayüz (Optimistic UI) ve hafif yoklama (lightweight polling) modeliyle çalışır. Cron tetikleyicileri yerel sunucu bağımsız bulut/edge uyumludur.

### Kural 8: Kalıcı JSON Veritabanı ve Canlı UI İlerleme Radarı (Zero Data Loss & Archival)
- Tüm görevler, 3 aşamalı subtask'lar (`[Hazırlık]`, `[Uygulama]`, `[Teslimat / Takip]`), öncelik rozetleri (`[P0]` - `[P3]`) ve yürütme kayıtları `tasks_history.json` veri tabanına kalıcı olarak işlenir (`POST /api/tasks/history/sync`).
- Geçmiş operasyonlar, tamamlanan kilometre taşları ve rollover raporları asla üzerine yazılmaz; TÜBİTAK 2209-A ve akademik denetimler için kalıcı olarak arşivlenir.
- Kullanıcı arayüzünde en üstte günün tamamlanma yüzdesini, aktif `🚨 [P0]` / `⚡ [P1]` bloklarını ve devreden görevleri gösteren **Progress Dashboard** bileşeni gerçek zamanlı görünürlük sağlar.

---

## 4. TAM TEKNOLOJİ YIĞINI VE ALTYAPI MİMARİSİ

Uygulama modern Full-Stack mimarisinde çalışır:

### Ön Yüz (Frontend)
- **Kütüphane & Dil:** React 19 + TypeScript (strict mode)
- **Derleme Aracı:** Vite 6
- **Stil & Tasarım:** Tailwind CSS v4 (`@tailwindcss/vite`, `@import "tailwindcss";`)
- **İkonografi:** `lucide-react`
- **Animasyonlar:** `motion` (`motion/react`)
- **Tasarım Dili:** Nordic Koyu Tema (`#0F172A` arka plan, `#1E293B` kart zeminleri, `#38BDF8` camgöbeği, `#818CF8` mor, `#34D399` zümrüt aksan renkleri).

### Sunucu Katmanı (Backend / Server)
- **Sunucu:** Node.js + Express 4.21 (`server.ts`)
- **Port:** 3000
- **Çalışma Modu:** Geliştirmede `tsx server.ts` (Vite dev middleware gömülü), üretimde esbuild tek dosya bundle (`dist/server.cjs`).
- **Doğrulama:** Zod runtime schema validation
- **Zamanlayıcı:** `node-cron`
- **E-Posta Servisi:** `nodemailer`
- **PDF Üretimi:** `jspdf` (`scripts/generatePdfReport.ts`)
- **Yapay Zeka:** `@google/genai` TypeScript SDK (Gemini 3.7 Flash)

### Bağımlılıklar (`package.json`):
```json
{
  "name": "react-example",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx server.ts",
    "generate:pdf": "tsx scripts/generatePdfReport.ts",
    "build": "tsx scripts/generatePdfReport.ts && vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",
    "start": "node dist/server.cjs",
    "clean": "rm -rf dist server.js",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "@google/genai": "^2.4.0",
    "@notionhq/client": "^5.26.0",
    "@tailwindcss/vite": "^4.1.14",
    "@types/node-cron": "^3.0.11",
    "@vitejs/plugin-react": "^5.0.4",
    "dotenv": "^17.2.3",
    "express": "^4.21.2",
    "firebase": "^12.19.0",
    "jspdf": "^4.2.1",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "node-cron": "^4.6.0",
    "nodemailer": "^9.0.5",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "vite": "^6.2.3",
    "zod": "^4.6.5"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^22.14.0",
    "@types/nodemailer": "^8.0.1",
    "autoprefixer": "^10.4.21",
    "esbuild": "^0.25.0",
    "tailwindcss": "^4.1.14",
    "tsx": "^4.21.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.3"
  }
}
```

---

## 5. ASENKRON OLAY KUYRUĞU VE SSE CANLI YAYIN MOTORU

Dosya konumu: `src/server/asyncQueueManager.ts`

Bu motor, FastAPI'ın `BackgroundTasks` mekanizmasını Node.js ortamında simüle eden, kullanıcı arayüzünü asla dondurmayan ve gerçek zamanlı Server-Sent Events (SSE) yayını yapan 5 aşamalı otonom kuyruk işlemcisidir.

### 5 Aşamalı İşlem Hattı:
```text
HAM VERİ GİRDİSİ (Webhook / Gmail / Cron)
   │
   ▼
[1] HTTP 202 ACCEPTED ──► İstemciye hemen yanıt dön (Non-blocking)
   │
   ▼ (Arka planda yürütme başlar)
[Adım a] EXTRACTION: Regex ile başlık, gönderen, tarih (YYYY-MM-DD), saat (HH:mm) ayıkla.
   │
   ▼
[Adım b] VALIDATION & REPAIR: Zod ile şemayı doğrula.
         - Başlık < 3 karakter ise onar.
         - Öncelik rozeti (🚨 [P0] vb.) yoksa metin analiziyle otomatik ekle.
         - Bozuk tarihleri bugüne, bozuk saatleri 'HH:mm' formatına onar.
         - 3 aşamalı subtask ([Hazırlık], [Uygulama], [Teslimat]) eksikse otomatik üret.
   │
   ▼
[Adım c] CACHE LOOKUP: 5 dakikalık TTL SmartCache ile mükerrerlik denetimi.
         - E-posta ID, Podio ID veya task:başlık:tarih hash'i eşleşirse -> CACHE_HIT.
         - API kotasını koru, Google çağrısını atla, kullanıcıyı bilgilendir.
   │
   ▼
[Adım d] GOOGLE SYNC: Google Tasks / Calendar REST API kaydını tamamla.
   │
   ▼
[Adım e] LIVE SSE BROADCAST: /api/events/live-stream üzerinden tüm açık sekmelere yayın yap.
         - TYPE_1: TASK_ASSIGNED
         - TYPE_2: ROLLOVER_COMPLETED
         - TYPE_3: MORNING_BRIEFING
```

---

## 6. TAM VERİ MODELLERİ VE TİP TANIMLARI

### TypeScript Tipleri (`src/types.ts`):
```typescript
export type EventType = 'webinar' | 'self-paced' | 'meeting' | 'submission' | 'workshop' | 'milestone' | 'pitch' | 'other';

export type ProgramCategory = 
  | 'nocode-lowcode'
  | 'akbank-python'
  | 'tech-istanbul-bootcamp'
  | 'pythiango-ai-masterclass'
  | 'careergen-bootcamp'
  | 'python-100-gun'
  | 'cop31-gonullu'
  | 'kariyer-yetenek'
  | 'tubitak-yarisma'
  | 'arge-inovasyon'
  | 'cezeri-staj'
  | 'fergani-staj'
  | 'akbank-genai'
  | 'komut-muhendisligi'
  | 'gelecegin-meslekleri'
  | 'teknofest-gonullu'
  | 'meta-yapay-zeka'
  | 'girisimcilik-patent'
  | 'burs-basvuru'
  | 'pupilica'
  | 'sergi-kultur'
  | 'kavcar-canli'
  | 'custom';

export interface EventDeliverable {
  id: string;
  text: string;
  completed: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startDate: string; // ISO format: "YYYY-MM-DDTHH:mm:ss"
  endDate: string;   // ISO format: "YYYY-MM-DDTHH:mm:ss"
  allDay?: boolean;
  location?: string;
  link?: string;
  type: EventType;
  program: ProgramCategory;
  isMandatory?: boolean;
  googleCalendarEventId?: string;
  syncedToGoogle?: boolean;
  completed?: boolean;
  color?: string;
  reminderMinutes?: number;
  trlLevel?: number; // Teknoloji Hazırlık Seviyesi (1-9)
  tags?: string[];
  deliverables?: EventDeliverable[];
  priority?: 'critical' | 'high' | 'medium' | 'low';
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface GoogleTaskItem {
  id: string;
  title: string;
  notes?: string;
  status: 'needsAction' | 'completed';
  due?: string; // RFC 3339 formatı
  completed?: string;
  updated?: string;
  position?: string;
  selfLink?: string;
  webViewLink?: string;
  isRolledOver?: boolean;
  rolledOverFrom?: string;
  rolledOverCount?: number;
  priority?: TaskPriority;
  category?: string;
  source?: 'google-tasks' | 'local';
}

export interface RolloverReport {
  timestamp: string;
  targetDate: string; // YYYY-MM-DD
  rolledOverTasks: GoogleTaskItem[];
  googleTasksSyncedCount: number;
  emailSent?: boolean;
  emailRecipient?: string;
  message: string;
}
```

### Zod Doğrulama Şemaları (`src/server/asyncQueueManager.ts`):
```typescript
export const ValidPrioritySchema = z.enum(['critical', 'high', 'medium', 'low']);
export const ValidCategorySchema = z.enum([
  'KPSS & Eğitim',
  'TÜBİTAK & Projeler',
  'Kariyer & Staj',
  'Kişisel / Rutin'
]);

export const ValidatedTaskSchema = z.object({
  id: z.string(),
  title: z.string().min(3),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dueTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).nullable(),
  hasSpecificTime: z.boolean(),
  category: ValidCategorySchema,
  priority: ValidPrioritySchema,
  priorityBadge: z.string(),
  notes: z.string(),
  subtasks: z.array(z.string()).min(3),
  externalId: z.string().optional(),
  source: z.string(),
  sanitized: z.boolean(),
  repairsApplied: z.array(z.string())
});
```

---

## 7. API VE WEBHOOK PROTOKOLLERİ

Express sunucusundaki (`server.ts`) ana HTTP ve SSE uçları:

### 1. Asenkron Webhook Olay Girişi: `POST /api/queue/webhook`
- **Giriş:** Ham JSON verisi.
- **Yanıt:** `HTTP 202 Accepted` ve `{ "status": "ACCEPTED", "jobId": "...", "statusCheckUrl": "..." }`
- **Örnek cURL Çağrısı:**
```bash
curl -X POST http://localhost:3000/api/queue/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "source": "gmail",
    "subject": "Tech Istanbul: Prompt Engineering 2.0 (Multimodal) Atölyesi",
    "sender": "Tech Istanbul Ekibi",
    "dueDate": "2026-09-16",
    "dueTime": "16:00",
    "priority": "high",
    "category": "Kariyer & Staj",
    "rawContent": "16 Eylül Çarşamba 16.00-20.00 arası Prompt Engineering 2.0 Atölyesi yapılacaktır."
  }'
```

### 2. Canlı SSE Akışı: `GET /api/events/live-stream`
- **Format:** `text/event-stream`
- **Keep-alive:** 15 saniyede bir `PING` kalp atışı.
- **Yayın Tipleri:**
  - `TASK_ASSIGNED` (TYPE_1): Yeni görev atandı.
  - `ROLLOVER_COMPLETED` (TYPE_2): Dünden devreden görevler taşındı.
  - `MORNING_BRIEFING` (TYPE_3): Sabah 06:00 brifingi hazırlandı.
  - `JOB_PROGRESS`: İşlem hattı aşama ilerlemeleri.

### 3. İş Durumu ve İstatistikler:
- `GET /api/queue/jobs`: Kuyruktaki tüm işlerin dökümü.
- `GET /api/queue/jobs/:id`: Belirli bir işin adım adım logları (`EXTRACTING`, `VALIDATING`, `CACHE_LOOKUP`, `SYNCING`, `COMPLETED`, `CACHE_HIT`).
- `GET /api/queue/stats`: Toplam iş, aktif SSE istemcisi ve cache istatistikleri.
- `POST /api/queue/clear-cache`: 5 dakikalık akıllı önbelleği temizler.

### 4. Yapay Zeka ve Otomasyon:
- `POST /api/parse-events`: Kopyalanan serbest Türkçe duyuru metninden takvim etkinlikleri çıkarır (Gemini 3.7 Flash).
- `POST /api/gemini/parse-voice-command`: Türkçe sesli komutu algılar, tarih/öncelik belirleyip göreve dönüştürür.
- `POST /api/morning-briefing/trigger`: Sabah 06:00 brifingini hemen manuel çalıştırır.
- `POST /api/tasks/rollover-sync`: Günlük görev rollover senkronizasyonunu çalıştırır.
- `GET /api/download-pdf-report`: Güncel ajanda ve inovasyon takip raporunu PDF formatında üretip indirir.

---

## 8. TÜM AKTİF ETKİNLİK VE PROGRAMLARIN EKSİKSİZ ENVANTERİ

Aşağıdaki takvim dökümü, sistemin veritabanında yer alan ve eksiksiz olarak işlenmiş ana program omurgasıdır:

### 📅 1. Tech Istanbul: Prompt Engineering 2.0 (Multimodal) Atölye Serisi (4 Hafta)
- **Öncelik:** `⚡ [P1 - Yüksek Öncelik]` | **Program:** `tech-istanbul-bootcamp` | **Konum:** Online Canlı Atölye
- **1. Oturum:** 16 Eylül 2026 Çarşamba, 16:00 – 20:00
  - *İçerik:* İleri Düzey Prompt Teknikleri (Few-Shot, CoT, Role-Prompting), Tokenization, Context Window, Sistem Talimatları.
  - *Kontrol Listesi:*
    - `[Hazırlık]:` Online eğitim ortamı ve LLM araçları (Gemini, Claude, GPT) hazırlandı; bağlantı linki kontrol edildi (14:00-16:00 TR72 toplantısından doğrudan bu oturuma geçiş yap).
    - `[Uygulama]:` 16:00 – 20:00 canlı atölye oturumuna katılındı, ileri prompt teknikleri uygulandı.
    - `[Teslimat / Takip]:` Atölye prompt kütüphanesi notları derlendi ve GitHub reposuna kaydedildi.
- **2. Oturum:** 23 Eylül 2026 Çarşamba, 16:00 – 20:00
  - *İçerik:* Çok Modlu (Multimodal) AI Modelleri Mimarisi, Görsel Promptlama (Visual Prompting), Ses ve Video Analizi, Halüsinasyon Kontrolü.
- **3. Oturum:** 30 Eylül 2026 Çarşamba, 16:00 – 20:00
  - *İçerik:* Üretken Yapay Zekâ ile Profesyonel İçerik Üretimi Pipeline'ı, İş Akışı Optimizasyonu, Prompt Chaining.
- **4. Oturum (Final):** 7 Ekim 2026 Çarşamba, 16:00 – 20:00
  - *İçerik:* Katılımcı Uygulamalı Proje Sunumları, Değerlendirme, Atölye Sertifikasyonu ve Kapanış.

### 📅 2. TR72 Bölgesi: Yeşil Ekonomik Fırsatlar ve Zorluklar İstişare Toplantısı
- **Tarih:** 16 Eylül 2026 Çarşamba, 14:00 – 16:00
- **Öncelik:** `ℹ️ [P3 - Bilgilendirici / Bölgesel]` | **Program:** `arge-inovasyon` / `tubitak-yarisma`
- **Format:** Çevrim İçi İstişare Toplantısı
- **Bağlantı Bilgileri:**
  - *Toplantı Linki:* `https://shorturl.at/SdbGG`
  - *Toplantı Kimliği (ID):* `852 0484 8792`
  - *Parola:* `760833`
- **Kapsam:** TR72 Bölgesi yeşil dönüşüm süreci, yeşil ekonomik faaliyetler, kadın ve genç istihdamı.
- **Kontrol Listesi:**
  - `[Hazırlık]:` Toplantı linki, kimlik ve parola doğrulaması yap; kadın ve genç istihdamı ön notlarını hazırla.
  - `[Uygulama]:` 14:00 – 16:00 çevrim içi oturuma katıl; fırsat ve zorluk değerlendirmelerini not al.
  - `[Teslimat / Takip]:` Toplantı çıktılarını derle; TÜBİTAK 2209-A ve Ar-Ge proje pazarı sürdürülebilirlik fikirlerine işle.

### 📅 3. Akbank Python'a Giriş (10million.AI)
- **Tarih Aralığı:** 7 – 27 Eylül 2026 | **Son Teslim:** 🚨 27 Eylül 2026, 23:59
- **Platform:** `courses.10million.ai`
- **Modüller:** "Yapay Zekaya İlk Adım", "Introduction to Python".
- **Canlı Mentorluklar:**
  - 1. Mentor Toplantısı: 11 Eylül 2026, 20:00 – 21:00
  - 2. Mentor Toplantısı: 17 Eylül 2026, 20:00 – 21:00
- **Kontrol Listesi:**
  - `[Hazırlık]:` 10million.ai hesabına giriş yap, ders videolarını izle.
  - `[Uygulama]:` Kodlama egzersizlerini ve quizleri tamamla; mentorluk toplantılarına katıl.
  - `[Teslimat / Takip]:` Bitirme sertifikalarını indir ve portfolyoya kaydet.

### 📅 4. JCI Maltepe - AIP Staj Ön Değerlendirme Mülakatı
- **Tarih:** 🚨 17 Eylül 2026 Perşembe, 19:40 – 19:50 (19:35 Ortam Testi)
- **Öncelik:** `🚨 [P0 - Kritik / Telafisiz]`
- **Platform:** Google Meet (`meet.google.com/dyz-fxcd-rpg`)
- **Kontrol Listesi:**
  - `[Hazırlık]:` 19:35'te kamera, mikrofon, aydınlatma ve bağlantı testini tamamla; teknik CV'yi aç.
  - `[Uygulama]:` 19:40 mülakata katıl; aday mühendislik ve staj hedeflerini net ifade et.
  - `[Teslimat / Takip]:` Mülakat geri bildirimlerini not et; değerlendirme sürecini takip et.

### 📅 5. Tech Istanbul: Uygulamalı Yapay Zekâ Geliştirme Bootcamp
- **Tarih:** 8 Eylül – 8 Ekim 2026 (Haftalık canlı oturumlar, 16:00 – 20:00)
- **Öncelik:** `⚡ [P1 - Yüksek Öncelik]`
- **Modüller:** Python Temelleri (8 Eyl), EDA & Özellik Mühendisliği (10 Eyl), Scikit-Learn Klasik ML (15 Eyl), Derin Öğrenme & NLP, Final Mezuniyet Projesi (8 Eki).

### 📅 6. Pupilica: No-Code & Low-Code ile Fikirden Ürüne
- **Eğitmen:** Engin Deniz Alpman | **Tarih:** 15 – 24 Eylül 2026
- **Oturumlar:** 15 Eyl (No-Code Temelleri), 17 Eyl (Bubble Modelleme), 22 Eyl (Make Otomasyon), 24 Eyl (Demo Day & Proje Teslimi).

### 📅 7. Huawei ICT Academy & Miuul
- **Huawei ICT Academy:** 11 Eylül 2026, 20:00 – 21:30 | Sena İlayda Hocaoğlu | YouTube Canlı Lab (`youtube.com/live/IExcHo1vG9c`).
- **Miuul Claude Code Semineri:** 21 Eylül 2026, 20:30 | Bedirhan Keskin (MedKit) | Zoom (ID: `862 4348 1180`, Şifre: `723648`).

### 📅 8. Akademik & Savunma Sanayii Süreçleri
- **TÜBİTAK 2209-A:** Başvuru formu, proje özeti, bütçe tablosu, danışman onayı ve Gantt şeması.
- **CEZERİ & FERGANİ 2027:** Uzun dönem aday mühendislik teknik CV ve GitHub portfolyo revizyonu.

---

## 9. GOOGLE TASKS VE GÜNLÜK GÖREV VERİTABANI

Ön yüzde `useDailyTasks.ts` hook'u tarafından yönetilen, Google Tasks API ile çift yönlü eşitlenen çekirdek görevler:

1. **`ℹ️ [P3] TR72 Bölgesi Yeşil Ekonomik Fırsatlar ve Zorluklar İstişare Toplantısı`**
   - *Tarih:* 2026-09-16T14:00:00
   - *Notlar:* ShortURL linki, ID ve parola, 3 aşamalı checklist.
2. **`⚡ [P1] Tech Istanbul: Prompt Engineering 2.0 (Multimodal) Atölyesi - 1. Oturum`**
   - *Tarih:* 2026-09-16T16:00:00
   - *Notlar:* Online atölye, çok modlu LLM hazırlığı, 3 aşamalı checklist.
3. **`🚨 [P0] JCI Maltepe AIP Staj Mülakatı`**
   - *Tarih:* 2026-09-17T19:40:00
   - *Notlar:* Google Meet linki, 19:35 kamera/mikrofon testi.
4. **`🐍 [Python 100 Gün] Temel Algoritma ve Veri Yapıları Ödevi`**
   - *Durum:* Dünden devretti (`isRolledOver: true`, `[Dünden Devretti ↩️]`).
5. **`🚀 [CareerGen] WhatsApp Takımına Katıl & CV Taslağı`**
6. **`🤖 [PythianGo Masterclass] Canlı Oturum Notlarını Derle`**
7. **`🌍 COP31 Volunteers 1. Modül Sınavı & Sertifika`**
8. **`🏆 TÜBİTAK 2209-A Araştırma Önerisi Danışman Görüşmesi`**

---

## 10. DIŞ ENTEGRASYONLAR

### 1. Google Workspace
- **Google Calendar API v3:** Etkinlik ekleme, güncelleme, silme, RFC 5545 uyumlu `.ICS` ve CSV dışa aktarımı.
- **Google Tasks API v1:** "İnovasyon & Etkinlik Ajandası" listesi üzerinde çift yönlü durum eşitleme.
- **Google Meet Space API:** `spaces.create` ile takvimden tek tıkla video görüşme odası açma.
- **Gmail API:** Gelen kutusundaki mülakat/etkinlik e-postalarını tarama.

### 2. Firebase Authentication
- Pop-up Google Girişi.
- `browserLocalPersistence` ve `inMemoryPersistence` fallback mekanizması sayesinde iframe veya sekmeler arası kapanma/gizlenme hatalarında oturum kopmaz. Access token `localStorage` üzerinde güvenle yedeklenir.

### 3. Google Gemini 3.7 Flash API
- Sunucu tarafında `@google/genai` TypeScript SDK kullanımı.
- Doğal dildeki Türkçe duyuruları JSON formatına ayrıştırır; mikrofon konuşmalarını takvim görevlerine dönüştürür.

---

## 11. ARKA PLAN OTOMASYONLARI VE CRON SERVİSLERİ

1. **Sabah 06:00 Brifing Cron (`0 6 * * *`):**
   - Her sabah 06:00'da çalışır.
   - O günün `P0` ve `P1` etkinliklerini, devreden görevleri derler ve `TYPE_3: MORNING_BRIEFING` SSE bildirimi üretir.
   - İsteğe bağlı e-posta raporu gönderir.
2. **Gece Görev Devir Senkronizasyonu (Daily Rollover):**
   - Günü geçen ve tamamlanmayan görevleri tespit eder.
   - Başlığa `[Dünden Devretti ↩️]` ekleyerek bugüne taşır ve `TYPE_2: ROLLOVER_COMPLETED` bildirimi yayar.
3. **Otomatik PDF Raporlama Motoru (`scripts/generatePdfReport.ts`):**
   - `jspdf` kullanarak tüm takvim ve inovasyon durumunu görsel PDF raporu olarak derler (`/api/download-pdf-report`).

---

## 12. ÖN YÜZ BİLEŞEN HARİTASI VE KULLANICI DENEYİMİ

- `CalendarView.tsx`: Ay, hafta, gün ve ajanda modlarında responsive takvim ızgarası.
- `EventCard.tsx`: Etkinliğin bağlantı türüne göre akıllı butonlar:
  - Google Meet için yeşil **"Meet'e Katıl"**
  - Zoom için mavi **"Zoom'a Katıl"**
  - YouTube için kırmızı **"YouTube Canlı Yayın"**
  - 10million.AI için pembe **"10million.AI Giriş"**
- `GoogleTasksPanel.tsx`: Google Tasks eşitlemesi, rollover görevleri ve hızlı tamamlama butonları.
- `QueueMonitorModal.tsx`: Gerçek zamanlı SSE akışını ve 5 aşamalı arka plan işlem kuyruğunu canlı izleme paneli.
- `InnovationRoadmapView.tsx` & `InnovationRadar.tsx`: TÜBİTAK ve staj süreçleri için Gantt şeması ve hazırlık radarı.
- `VoiceCommandModal.tsx`: Web Speech API ile mikrofon tabanlı Türkçe sesli komut asistanı.

---

## 13. YENİ YAPAY ZEKA ARACI İÇİN OTONOM OPERASYON EL KİTABI (PLAYBOOK)

Süreci devralan yeni yapay zeka aracının izleyeceği karar akışları:

### Senaryo 1: Kullanıcı Yeni Bir Duyuru veya E-Posta İlettiğinde
1. **Veri Çıkarımı:** Başlık, saat, tarih, platform, link ve şifreleri regex veya NLP ile çıkar.
2. **Öncelik Rozeti:**
   - Mülakat / resmi teslim: `🚨 [P0]`
   - Canlı ders / zorunlu oturum: `⚡ [P1]`
   - Ödev / self-paced tekrar: `📌 [P2]`
   - Genel webinar / istişare: `ℹ️ [P3]`
3. **3 Aşamalı Alt Görev İnşası:**
   - `[Hazırlık]:` Platform, link ve ön testler.
   - `[Uygulama]:` Canlı katılım, kodlama veya mülakat.
   - `[Teslimat / Takip]:` Sertifika, doküman veya sonraki adım.
4. **Çakışma Kontrolü:** Aynı saatte başka bir etkinlik varsa interaktif olanı seç, kaydı olanın sonradan izleneceğini belirt.
5. **Kuyruğa İlet:** `POST /api/queue/webhook` çağrısı yaparak 202 Accepted ile asenkron işlet.

### Senaryo 2: Mükerrer E-Posta / Duyuru Geldiğinde
1. 5 dakikalık akıllı önbellek kuralı gereği:
   - "Bu etkinlik ajandanızda zaten mevcuttur." de.
   - Mevcut kaydın link ve saat detaylarını kullanıcıya hatırlat.
   - Tekrar takvim kaydı açmayarak kota tasarrufu sağla.

### Senaryo 3: Yeni Bir Yapay Zeka Aracına Başlangıç Promptu Olarak Verme
Yeni modele ilk mesaj olarak şu şablonu iletin:
```text
Sen "İnovasyon & Etkinlik Ajandası" Kıdemli Birim Mimarı ve Otonom Görev/Takvim Orkestratörüsün.
Kullanıcın: Meryem Güçlü (meriguclu123@gmail.com).

"SISTEM_VE_AJANDA_YONETIM_KILAVUZU.md" dosyasındaki tüm sistem mimarisi, 
katı kurallar (3 aşamalı subtask, P0-P3 öncelik, çakışma çözücü, rollover) 
ve takvim verilerini ana yönergen olarak kabul et.

Tüm duyuru ve görevleri bu standartlara göre otonom olarak yönet.
Hazır olduğunu teyit et ve bugünün kritik ajandasını listele.
```

---

## 14. PROJE DOSYA VE DİZİN REHBERİ (CODEBASE MAP)

```text
/
├── SISTEM_VE_AJANDA_YONETIM_KILAVUZU.md # (BU KODEX) Tam Proje ve Otonom Yönetim Rehberi
├── AGENTS.md                            # Kıdemli Birim Mimarı kuralları ve standartları
├── PROJE_DOKUMANTASYONU.md              # İlk sürüm mimari ve bileşen dokümantasyonu
├── YAPILACAKLAR.md                      # Kullanıcı yapılacaklar ve geliştirme yol haritası
├── package.json                         # Node bağımlılıkları ve çalıştırma komutları
├── server.ts                            # Express API sunucusu, SSE, webhook ve cron yönetimi
├── index.html                           # HTML giriş noktası, SEO meta etiketleri
│
├── src/
│   ├── App.tsx                          # Ana uygulama kabuğu ve modal/görünüm yönetimi
│   ├── types.ts                         # CalendarEvent, GoogleTaskItem, Rollover tipleri
│   │
│   ├── components/                      # React UI Bileşenleri
│   │   ├── CalendarView.tsx             # Takvim ızgarası ve zaman çizelgeleri
│   │   ├── EventCard.tsx                # Etkinlik kartı ve akıllı link butonları
│   │   ├── GoogleTasksPanel.tsx         # Google Tasks ve rollover görev arayüzü
│   │   ├── QueueMonitorModal.tsx        # Canlı SSE ve asenkron kuyruk izleme penceresi
│   │   ├── InnovationRoadmapView.tsx    # Gantt zaman çizelgesi ve inovasyon aşamaları
│   │   ├── InnovationRadar.tsx          # Program hazırlık durumu radarı
│   │   ├── VoiceCommandModal.tsx        # Türkçe Web Speech API sesli asistanı
│   │   ├── AiParseModal.tsx             # Gemini NLP metin ayrıştırma arayüzü
│   │   ├── BulkSyncModal.tsx            # Google Takvim toplu eşitleme ve .ICS indirme
│   │   └── ConflictModal.tsx            # Çakışma bildirim ve çözümleme penceresi
│   │
│   ├── data/                            # Statik ve Önyüklü Veri Setleri
│   │   ├── initialEvents.ts             # Birleştirilmiş ana takvim etkinlik havuzu
│   │   ├── techIstanbulEvents.ts        # Tech Istanbul Bootcamp + Prompt Eng 2.0 Serisi
│   │   ├── akbankPythonEvents.ts        # 10million.AI Python eğitimleri ve mentorluklar
│   │   ├── careerEvents.ts              # JCI Maltepe, Huawei ICT, Miuul Claude Code
│   │   ├── noCodeEvents.ts              # Pupilica No-Code (Engin Deniz Alpman)
│   │   └── innovationTemplates.ts       # TÜBİTAK 2209-A, CEZERİ, FERGANİ şablonları
│   │
│   ├── lib/                             # İstemci Kütüphaneleri ve Servisleri
│   │   ├── firebase.ts                  # Firebase Auth dirençli oturum yönetimi
│   │   ├── googleCalendar.ts            # Google Calendar REST API fonksiyonları
│   │   ├── googleTasksService.ts        # Google Tasks REST API fonksiyonları
│   │   ├── icsGenerator.ts              # RFC 5545 .ICS takvim üreticisi
│   │   ├── conflictService.ts           # Çakışma tespit ve analiz algoritması
│   │   ├── useAsyncQueueSSE.ts          # Canlı SSE akışı React Hook'u
│   │   └── useDailyTasks.ts             # Görev devir ve senkronizasyon React Hook'u
│   │
│   └── server/                          # Sunucu Tarafı Mantığı
│       ├── asyncQueueManager.ts         # Zod doğrulamalı Asenkron İş Kuyruğu & SSE
│       ├── taskSyncCron.ts              # Günlük görev rollover cron servisi
│       └── emailAlertService.ts         # Brifing ve devir e-posta gönderim servisi
│
└── scripts/
    └── generatePdfReport.ts             # Otomatik PDF raporu üretim betiği
```

---

> **Sonuç & Garanti:** Bu kodex, projenin tek satır koduna dahi bakmaya gerek kalmadan, tüm mantığı, verileri, kuralları ve mimariyi sıfır kayıpla aktarmak üzere tasarlanmıştır. Herhangi bir yapay zeka bu dokümanı okuduğunda sistemi ve ajandayı tam yetkiyle ve kusursuzca yönetebilir.
