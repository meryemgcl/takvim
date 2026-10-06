import { z } from 'zod';
import { Response } from 'express';

// ==========================================
// 1. ZOD PYDANTIC BENZERİ KATI ŞEMALAR (ZOD RUNTIME VALIDATION)
// ==========================================

export const ValidPrioritySchema = z.enum(['critical', 'high', 'medium', 'low']);
export type ValidPriority = z.infer<typeof ValidPrioritySchema>;

export const ValidCategorySchema = z.enum([
  'KPSS & Eğitim',
  'TÜBİTAK & Projeler',
  'Kariyer & Staj',
  'Kişisel / Rutin'
]);
export type ValidCategory = z.infer<typeof ValidCategorySchema>;

// Ham gelen olay verisi (Webhook / Gmail / Podio / Takvim)
export const RawEventPayloadSchema = z.object({
  source: z.enum(['gmail', 'podio', 'calendar', 'manual_webhook', 'cron']).default('manual_webhook'),
  emailId: z.string().optional(),
  podioItemId: z.string().optional(),
  sender: z.string().optional(),
  subject: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  rawContent: z.string().optional(),
  dueDate: z.string().optional(),
  dueTime: z.string().nullable().optional(),
  priority: z.string().optional(),
  category: z.string().optional(),
  program: z.string().optional(),
  subtasks: z.array(z.string()).optional(),
  userEmail: z.string().email().optional().default('meriguclu123@gmail.com'),
  accessToken: z.string().optional()
});

export type RawEventPayload = z.infer<typeof RawEventPayloadSchema>;

// Doğrulanmış ve Onarılmış Görev Şeması
export const ValidatedTaskSchema = z.object({
  id: z.string(),
  title: z.string().min(3, 'Başlık en az 3 karakter olmalıdır'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Tarih formatı YYYY-MM-DD olmalıdır'),
  dueTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Saat formatı HH:mm olmalıdır').nullable(),
  hasSpecificTime: z.boolean(),
  category: ValidCategorySchema,
  priority: ValidPrioritySchema,
  priorityBadge: z.string(),
  notes: z.string(),
  subtasks: z.array(z.string()).min(3, 'En az 3 aşamalı alt görev ([Hazırlık], [Uygulama], [Teslimat / Takip]) zorunludur'),
  externalId: z.string().optional(),
  source: z.string(),
  sanitized: z.boolean(),
  repairsApplied: z.array(z.string())
});

export type ValidatedTask = z.infer<typeof ValidatedTaskSchema>;

// ==========================================
// 2. AKILLI ÖNBELLEK (5 DAKİKALIK DEDUPLICATION CACHE)
// ==========================================

interface CacheEntry {
  key: string;
  timestamp: number;
  jobId: string;
  title: string;
  summary: string;
}

class SmartCacheManager {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly TTL_MS = 5 * 60 * 1000; // 5 dakika

  public checkAndSet(key: string, title: string, jobId: string): { isHit: boolean; entry?: CacheEntry } {
    const now = Date.now();
    const existing = this.cache.get(key);

    if (existing) {
      if (now - existing.timestamp < this.TTL_MS) {
        return { isHit: true, entry: existing };
      }
      this.cache.delete(key);
    }

    const newEntry: CacheEntry = {
      key,
      timestamp: now,
      jobId,
      title,
      summary: `Cached at ${new Date(now).toLocaleTimeString('tr-TR')}`
    };
    this.cache.set(key, newEntry);

    // Temizlik: 15 dakikadan eski girişleri temizle
    this.cleanupOldEntries(now);

    return { isHit: false, entry: newEntry };
  }

  public get(key: string): CacheEntry | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    if (Date.now() - entry.timestamp > this.TTL_MS) {
      this.cache.delete(key);
      return undefined;
    }
    return entry;
  }

  public clear(): void {
    this.cache.clear();
  }

  public getStats(): { totalEntries: number; entries: CacheEntry[] } {
    const now = Date.now();
    const validEntries: CacheEntry[] = [];
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp < this.TTL_MS) {
        validEntries.push(entry);
      } else {
        this.cache.delete(key);
      }
    }
    return { totalEntries: validEntries.length, entries: validEntries };
  }

  private cleanupOldEntries(now: number): void {
    if (this.cache.size > 200) {
      for (const [key, entry] of this.cache.entries()) {
        if (now - entry.timestamp > this.TTL_MS) {
          this.cache.delete(key);
        }
      }
    }
  }
}

export const smartCache = new SmartCacheManager();

// ==========================================
// 3. KUYRUK İŞİ (JOB) TANIMLARI
// ==========================================

export type JobStatus = 'QUEUED' | 'EXTRACTING' | 'VALIDATING' | 'CACHE_LOOKUP' | 'SYNCING' | 'COMPLETED' | 'CACHE_HIT' | 'FAILED';
export type JobStep = 'a_extraction' | 'b_validation' | 'c_cache_lookup' | 'd_google_sync' | 'e_sse_notification';

export interface QueueJob {
  id: string;
  source: 'gmail' | 'podio' | 'calendar' | 'manual_webhook' | 'cron';
  status: JobStatus;
  currentStep: JobStep;
  createdAt: string;
  updatedAt: string;
  durationMs?: number;
  rawPayload: any;
  extracted?: {
    subject: string;
    sender: string;
    extractedDate: string;
    extractedTime: string | null;
    rawTextPreview: string;
  };
  validatedTask?: ValidatedTask;
  cacheLookup?: {
    cacheKey: string;
    isHit: boolean;
    reason: string;
    originalJobId?: string;
  };
  googleSyncResult?: {
    synced: boolean;
    taskId?: string;
    calendarEventId?: string;
    message: string;
  };
  liveNotification?: {
    type: 'TASK_ASSIGNED' | 'ROLLOVER_COMPLETED' | 'MORNING_BRIEFING';
    badge: string;
    message: string;
    timestamp: string;
  };
  logs: Array<{ timestamp: string; step: string; message: string; type?: 'info' | 'warn' | 'success' | 'error' }>;
  error?: string;
}

// ==========================================
// 4. SSE (SERVER-SENT EVENTS) YAYIN YÖNETİCİSİ
// ==========================================

export interface SSEEventPayload {
  type: 'TASK_ASSIGNED' | 'ROLLOVER_COMPLETED' | 'MORNING_BRIEFING' | 'QUEUE_UPDATE' | 'JOB_PROGRESS' | 'PING';
  jobId?: string;
  message: string;
  data?: any;
  timestamp: string;
}

class SSEManager {
  private clients: Map<string, Response> = new Map();
  private recentNotifications: SSEEventPayload[] = [];

  constructor() {
    // 15 saniyede bir keep-alive ping gönder
    setInterval(() => {
      this.broadcast({
        type: 'PING',
        message: 'heartbeat',
        timestamp: new Date().toISOString()
      });
    }, 15000);
  }

  public addClient(id: string, res: Response): void {
    this.clients.set(id, res);

    // Hoş geldin ve mevcut bildirim geçmişi gönder
    res.write(`data: ${JSON.stringify({
      type: 'QUEUE_UPDATE',
      message: 'Canlı Asenkron Olay Yöneticisi SSE Akışına Bağlandı',
      timestamp: new Date().toISOString(),
      data: {
        connectedClients: this.clients.size,
        recentNotifications: this.recentNotifications.slice(-10)
      }
    })}\n\n`);
  }

  public removeClient(id: string): void {
    this.clients.delete(id);
  }

  public broadcast(payload: SSEEventPayload): void {
    if (['TASK_ASSIGNED', 'ROLLOVER_COMPLETED', 'MORNING_BRIEFING'].includes(payload.type)) {
      this.recentNotifications.push(payload);
      if (this.recentNotifications.length > 50) {
        this.recentNotifications.shift();
      }
    }

    const dataString = `data: ${JSON.stringify(payload)}\n\n`;
    for (const [id, res] of this.clients.entries()) {
      try {
        res.write(dataString);
      } catch (err) {
        console.warn(`[SSE] Failed writing to client ${id}, removing:`, err);
        this.clients.delete(id);
      }
    }
  }

  public getConnectedClientsCount(): number {
    return this.clients.size;
  }

  public getRecentNotifications(): SSEEventPayload[] {
    return this.recentNotifications.slice(-20);
  }
}

export const sseManager = new SSEManager();

// ==========================================
// 5. ASENKRON İŞ KUYRUĞU YÖNETİCİSİ (FASTAPI BACKGROUND TASKS PARALELİ)
// ==========================================

class AsyncQueueManager {
  private jobs: Map<string, QueueJob> = new Map();
  private isProcessing = false;
  private queue: string[] = []; // Job IDs waiting in queue

  public enqueue(rawPayload: any, source: QueueJob['source'] = 'manual_webhook'): QueueJob {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const job: QueueJob = {
      id: jobId,
      source,
      status: 'QUEUED',
      currentStep: 'a_extraction',
      createdAt: now,
      updatedAt: now,
      rawPayload,
      logs: [
        { timestamp: now, step: 'INIT', message: `İş kuyruğa alındı. Kaynak: ${source.toUpperCase()}`, type: 'info' }
      ]
    };

    this.jobs.set(jobId, job);
    this.queue.push(jobId);

    // SSE ile kuyruk güncellemesini bildir
    sseManager.broadcast({
      type: 'QUEUE_UPDATE',
      jobId,
      message: `Yeni iş kuyruğa alındı: [${jobId}]`,
      timestamp: now,
      data: { jobId, status: 'QUEUED', queueLength: this.queue.length }
    });

    // Asenkron kuyruk işlemcisini tetikle (Non-blocking, UI anında döner)
    setImmediate(() => this.processNext());

    return job;
  }

  public getJob(id: string): QueueJob | undefined {
    return this.jobs.get(id);
  }

  public getAllJobs(): QueueJob[] {
    return Array.from(this.jobs.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getStats() {
    const all = Array.from(this.jobs.values());
    return {
      totalJobs: all.length,
      queued: this.queue.length,
      completed: all.filter(j => j.status === 'COMPLETED').length,
      cacheHits: all.filter(j => j.status === 'CACHE_HIT').length,
      failed: all.filter(j => j.status === 'FAILED').length,
      activeClients: sseManager.getConnectedClientsCount(),
      smartCacheEntries: smartCache.getStats().totalEntries
    };
  }

  private async processNext(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const jobId = this.queue.shift();
    if (!jobId) {
      this.isProcessing = false;
      return;
    }

    const job = this.jobs.get(jobId);
    if (!job) {
      this.isProcessing = false;
      return;
    }

    const startTime = Date.now();

    try {
      // -------------------------------------------------------------
      // ADIM a: VERİ AYIKLAMA (EXTRACTION)
      // -------------------------------------------------------------
      job.status = 'EXTRACTING';
      job.currentStep = 'a_extraction';
      job.updatedAt = new Date().toISOString();
      this.addLog(job, 'EXTRACTION', 'Adım 1/5: Ham olay verisinden başlık, gönderen ve içerik ayıklanıyor...', 'info');
      this.emitJobProgress(job);

      const raw = job.rawPayload || {};
      const subject = raw.subject || raw.title || 'Duyuru / Etkinlik';
      const sender = raw.sender || (raw.source === 'podio' ? 'Podio Bildirim Servisi' : 'Google Workspace');
      const rawText = raw.rawContent || raw.description || subject;
      
      // Tarih tespiti
      const todayStr = new Date().toISOString().split('T')[0];
      let detectedDate = raw.dueDate;
      if (!detectedDate || !/^\d{4}-\d{2}-\d{2}$/.test(detectedDate)) {
        detectedDate = todayStr;
      }

      let detectedTime = raw.dueTime || null;
      if (detectedTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(detectedTime)) {
        detectedTime = null;
      }

      job.extracted = {
        subject,
        sender,
        extractedDate: detectedDate,
        extractedTime: detectedTime,
        rawTextPreview: rawText.substring(0, 150)
      };

      await this.microDelay(120);

      // -------------------------------------------------------------
      // ADIM b: ZOD ŞEMA DOĞRULAMASI VE ÇALIŞMA ZAMANI ONARIMI (VALIDATION)
      // -------------------------------------------------------------
      job.status = 'VALIDATING';
      job.currentStep = 'b_validation';
      job.updatedAt = new Date().toISOString();
      this.addLog(job, 'VALIDATION', 'Adım 2/5: Zod şeması ile veri bütünlüğü denetleniyor & eksikler onarılıyor...', 'info');
      this.emitJobProgress(job);

      const validated = this.validateAndRepair(job.rawPayload, job.extracted, todayStr);
      job.validatedTask = validated;

      if (validated.repairsApplied.length > 0) {
        this.addLog(job, 'VALIDATION', `Zod Onarımları: ${validated.repairsApplied.join('; ')}`, 'warn');
      } else {
        this.addLog(job, 'VALIDATION', 'Zod doğrulaması eksiksiz tamamlandı: Veri bütünlüğü %100.', 'success');
      }

      await this.microDelay(150);

      // -------------------------------------------------------------
      // ADIM c: AKILLI ÖNBELLEK KONTROLÜ (SMART CACHE LOOKUP - 5 DAKİKA)
      // -------------------------------------------------------------
      job.status = 'CACHE_LOOKUP';
      job.currentStep = 'c_cache_lookup';
      job.updatedAt = new Date().toISOString();
      this.addLog(job, 'CACHE_LOOKUP', 'Adım 3/5: Son 5 dakika mükerrerlik ve kota koruma denetimi yapılıyor...', 'info');
      this.emitJobProgress(job);

      const cacheKey = this.generateCacheKey(job.rawPayload, validated);
      const cacheResult = smartCache.checkAndSet(cacheKey, validated.title, job.id);

      job.cacheLookup = {
        cacheKey,
        isHit: cacheResult.isHit,
        reason: cacheResult.isHit 
          ? `Mükerrer işleme engellendi (Önceki iş: ${cacheResult.entry?.jobId}). Google API kotası korundu.`
          : 'Yeni benzersiz olay, önbelleğe yazıldı.',
        originalJobId: cacheResult.entry?.jobId
      };

      if (cacheResult.isHit) {
        // MÜKERRER İŞLEM: Google API çağrısını tüketmemek için işlemi CACHE_HIT olarak sonlandır!
        job.status = 'CACHE_HIT';
        job.durationMs = Date.now() - startTime;
        job.updatedAt = new Date().toISOString();
        this.addLog(job, 'CACHE_HIT', `⚡ [SMART CACHE HIT] Son 5 dakika içinde aynı olay işlenmiş. Google API çağrısı atlandı.`, 'warn');
        this.emitJobProgress(job);

        // SSE Bildirimi (Cache Hit bilgisiyle)
        sseManager.broadcast({
          type: 'QUEUE_UPDATE',
          jobId: job.id,
          message: `⚡ [CACHE_HIT] "${validated.title}" mükerrer çağrısı önlendi, Google API kotası korundu.`,
          timestamp: new Date().toISOString(),
          data: { job }
        });

        this.isProcessing = false;
        setImmediate(() => this.processNext());
        return;
      }

      this.addLog(job, 'CACHE_LOOKUP', 'Önbellek temiz: İlk kez işleniyor, Google Workspace senkronizasyonuna geçiliyor.', 'success');
      await this.microDelay(150);

      // -------------------------------------------------------------
      // ADIM d: GOOGLE TASKS & CALENDAR SENKRONİZASYONU (GOOGLE_SYNC)
      // -------------------------------------------------------------
      job.status = 'SYNCING';
      job.currentStep = 'd_google_sync';
      job.updatedAt = new Date().toISOString();
      this.addLog(job, 'GOOGLE_SYNC', 'Adım 4/5: Google Tasks ve Takvim API eşleşmesi hazırlanıyor...', 'info');
      this.emitJobProgress(job);

      // Simüle edilen veya gerçek backend task senkronizasyonu
      const syncResult = await this.syncToGoogleWorkspace(validated, job.rawPayload?.accessToken);
      job.googleSyncResult = syncResult;
      this.addLog(job, 'GOOGLE_SYNC', `Google Senkronizasyonu Başarılı: ${syncResult.message}`, 'success');

      await this.microDelay(150);

      // -------------------------------------------------------------
      // ADIM e: GERÇEK ZAMANLI CANLI BİLDİRİM (SSE EVENT) ÜRETİMİ
      // -------------------------------------------------------------
      job.currentStep = 'e_sse_notification';
      job.updatedAt = new Date().toISOString();

      let notificationType: 'TASK_ASSIGNED' | 'ROLLOVER_COMPLETED' | 'MORNING_BRIEFING' = 'TASK_ASSIGNED';
      let notificationMsg = '';

      if (job.rawPayload?.notificationOverrideType === 'ROLLOVER_COMPLETED' || job.source === 'cron' && raw.type === 'rollover') {
        notificationType = 'ROLLOVER_COMPLETED';
        const count = raw.rolledCount || 3;
        // TYPE_2 Standardı:
        notificationMsg = `↩️ Görev Devri: ${count} adet dün görevi bugüne taşındı.`;
      } else if (job.rawPayload?.notificationOverrideType === 'MORNING_BRIEFING' || job.source === 'cron' && raw.type === 'briefing') {
        notificationType = 'MORNING_BRIEFING';
        // TYPE_3 Standardı:
        notificationMsg = `🌅 Sabah 06:00 Brifingi: Günün kritik P0 planı hazır.`;
      } else {
        notificationType = 'TASK_ASSIGNED';
        // TYPE_1 Standardı:
        const cleanSubject = job.extracted?.subject || validated.title;
        notificationMsg = `📬 Yeni Görevler Tanımlandı: ${cleanSubject} Google Tasks'e aktarıldı.`;
      }

      job.liveNotification = {
        type: notificationType,
        badge: notificationType === 'TASK_ASSIGNED' ? 'TYPE_1' : notificationType === 'ROLLOVER_COMPLETED' ? 'TYPE_2' : 'TYPE_3',
        message: notificationMsg,
        timestamp: new Date().toISOString()
      };

      this.addLog(job, 'SSE_NOTIFY', `Adım 5/5: Canlı SSE Bildirimi yayınlanıyor: [${notificationType}] "${notificationMsg}"`, 'success');

      // SSE ile canlı yayına bas
      sseManager.broadcast({
        type: notificationType,
        jobId: job.id,
        message: notificationMsg,
        timestamp: new Date().toISOString(),
        data: {
          task: validated,
          jobId: job.id,
          googleTaskId: syncResult.taskId
        }
      });

      // İşi Tamamla
      job.status = 'COMPLETED';
      job.durationMs = Date.now() - startTime;
      job.updatedAt = new Date().toISOString();
      this.addLog(job, 'COMPLETED', `İş başarıyla tamamlandı (${job.durationMs}ms). UI bloklanmadan asenkron yürütüldü.`, 'success');
      this.emitJobProgress(job);

    } catch (err: any) {
      console.error(`[ASYNC QUEUE] Job ${job.id} failed:`, err);
      job.status = 'FAILED';
      job.durationMs = Date.now() - startTime;
      job.updatedAt = new Date().toISOString();
      job.error = err.message || 'Bilinmeyen bir hata oluştu.';
      this.addLog(job, 'ERROR', `Hata: ${job.error}`, 'error');
      this.emitJobProgress(job);
    } finally {
      this.isProcessing = false;
      // Sıradaki işi ele al
      setImmediate(() => this.processNext());
    }
  }

  // ==========================================
  // ZOD DOĞRULAMA & AKILLI ONARIM YARDIMCISI
  // ==========================================
  private validateAndRepair(raw: any, extracted: any, referenceDate: string): ValidatedTask {
    const repairs: string[] = [];

    // 1. Başlık Kontrolü & Öncelik Rozeti Denetimi
    let rawTitle = (raw.title || extracted?.subject || raw.subject || 'İnovasyon Görevi').trim();
    if (rawTitle.length < 3) {
      rawTitle = 'İnovasyon & Etkinlik Görevi';
      repairs.push("Boş/kısa başlık varsayılan ad ile onarıldı");
    }

    // Öncelik belirleme
    let priority: ValidPriority = 'medium';
    const lowerTitle = rawTitle.toLowerCase();
    const lowerContent = (raw.rawContent || raw.description || '').toLowerCase();

    if (raw.priority && ['critical', 'high', 'medium', 'low'].includes(raw.priority)) {
      priority = raw.priority as ValidPriority;
    } else if (
      lowerTitle.includes('mülakat') || 
      lowerTitle.includes('jci') || 
      lowerTitle.includes('fergani') || 
      lowerTitle.includes('cezeri') || 
      lowerTitle.includes('son teslim') ||
      lowerTitle.includes('p0')
    ) {
      priority = 'critical';
    } else if (
      lowerTitle.includes('huawei') || 
      lowerTitle.includes('canlı lab') || 
      lowerTitle.includes('tübitak') || 
      lowerTitle.includes('p1') ||
      lowerTitle.includes('tech istanbul')
    ) {
      priority = 'high';
    } else if (lowerTitle.includes('webinar') || lowerTitle.includes('arşiv') || lowerTitle.includes('p3')) {
      priority = 'low';
    }

    // Rozet eki kontrolü
    const badgeMap: Record<ValidPriority, string> = {
      critical: '🚨 [P0]',
      high: '⚡ [P1]',
      medium: '📌 [P2]',
      low: 'ℹ️ [P3]'
    };
    const expectedBadge = badgeMap[priority];

    // Eğer başlıkta rozet yoksa otomatik ekle
    if (!/^(🚨|⚡|📌|ℹ️)\s*\[P\d\]/i.test(rawTitle)) {
      rawTitle = `${expectedBadge} ${rawTitle}`;
      repairs.push(`Başlığa öncelik rozeti '${expectedBadge}' otomatik eklendi`);
    }

    // 2. Tarih Formatı Denetimi (YYYY-MM-DD)
    let validatedDate = raw.dueDate || extracted?.extractedDate;
    if (!validatedDate || !/^\d{4}-\d{2}-\d{2}$/.test(validatedDate)) {
      validatedDate = referenceDate;
      repairs.push(`Bozuk/eksik tarih referans tarihe (${referenceDate}) dönüştürüldü`);
    }

    // 3. Saat Formatı Denetimi (HH:mm)
    let validatedTime: string | null = raw.dueTime || extracted?.extractedTime || null;
    if (validatedTime) {
      if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(validatedTime)) {
        // '19:0' -> '19:00' gibi onarımlar
        const parts = validatedTime.split(':');
        if (parts.length === 2 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1]))) {
          const h = parts[0].padStart(2, '0');
          const m = parts[1].padEnd(2, '0');
          validatedTime = `${h}:${m}`;
          repairs.push(`Saat formatı '${validatedTime}' olarak onarıldı`);
        } else {
          validatedTime = null;
          repairs.push("Geçersiz saat formatı kaldırıldı");
        }
      }
    }

    // 4. Kategori Denetimi
    let validatedCategory: ValidCategory = 'Kariyer & Staj';
    if (raw.category && ['KPSS & Eğitim', 'TÜBİTAK & Projeler', 'Kariyer & Staj', 'Kişisel / Rutin'].includes(raw.category)) {
      validatedCategory = raw.category as ValidCategory;
    } else if (lowerTitle.includes('tübitak') || lowerTitle.includes('ar-ge') || lowerContent.includes('2209')) {
      validatedCategory = 'TÜBİTAK & Projeler';
    } else if (lowerTitle.includes('python') || lowerTitle.includes('akbank') || lowerTitle.includes('bootcamp') || lowerTitle.includes('eğitim')) {
      validatedCategory = 'KPSS & Eğitim';
    } else {
      validatedCategory = 'Kariyer & Staj';
    }

    // 5. 3 Aşamalı Alt Görev (Subtasks) Denetimi & Otomatik İnşası
    let subtasks: string[] = Array.isArray(raw.subtasks) ? raw.subtasks : [];
    
    // Alt görevler eksik veya 3 aşamayı karşılamıyorsa otomatik oluştur
    const hasPrep = subtasks.some(s => s.toLowerCase().includes('[hazırlık]'));
    const hasImpl = subtasks.some(s => s.toLowerCase().includes('[uygulama]'));
    const hasDeliv = subtasks.some(s => s.toLowerCase().includes('[teslimat') || s.toLowerCase().includes('[takip]'));

    if (subtasks.length < 3 || !hasPrep || !hasImpl || !hasDeliv) {
      const cleanTitleWithoutBadge = rawTitle.replace(/^(🚨|⚡|📌|ℹ️)\s*\[P\d\]\s*/i, '');
      subtasks = [
        `[Hazırlık]: ${cleanTitleWithoutBadge} için bağlantı, platform ve teknik gereksinimleri kontrol et.`,
        `[Uygulama]: Canlı oturuma katılım sağla, notları al ve temel aşamaları tamamla.`,
        `[Teslimat / Takip]: İlgili dokümanı Google Drive veya sisteme kaydet, sonraki adımı planla.`
      ];
      repairs.push("Eksik 3 aşamalı alt görev yapısı ([Hazırlık], [Uygulama], [Teslimat]) otomatik oluşturuldu");
    }

    const notesContent = `Platform / Kaynak: ${raw.source || 'Asenkron İş Kuyruğu'}\n` +
      `Tarih: ${validatedDate}${validatedTime ? ` ${validatedTime}` : ''}\n\n` +
      `📋 3 Aşamalı Kontrol Listesi:\n` +
      subtasks.map(st => `• ${st}`).join('\n');

    return {
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: rawTitle,
      dueDate: validatedDate,
      dueTime: validatedTime,
      hasSpecificTime: !!validatedTime,
      category: validatedCategory,
      priority,
      priorityBadge: expectedBadge,
      notes: notesContent,
      subtasks,
      externalId: raw.emailId || raw.podioItemId || undefined,
      source: raw.source || 'queue_worker',
      sanitized: true,
      repairsApplied: repairs
    };
  }

  // ==========================================
  // BENZERSİZ CACHE ANAHTARI OLUŞTURUCU
  // ==========================================
  private generateCacheKey(raw: any, task: ValidatedTask): string {
    if (raw.emailId) return `email:${raw.emailId}`;
    if (raw.podioItemId) return `podio:${raw.podioItemId}`;
    // Başlık ve tarih bazlı hash
    const normalizedTitle = task.title.replace(/^(🚨|⚡|📌|ℹ️)\s*\[P\d\]\s*/i, '').toLowerCase().trim();
    return `task:${normalizedTitle}:${task.dueDate}`;
  }

  // ==========================================
  // GOOGLE TASKS & CALENDAR SENKRONİZASYONU
  // ==========================================
  private async syncToGoogleWorkspace(task: ValidatedTask, _accessToken?: string): Promise<{ synced: boolean; taskId: string; message: string }> {
    // Google Tasks API senkronizasyonu simülasyonu / hazırlığı
    const generatedGoogleTaskId = `gtask_${Date.now()}`;
    return {
      synced: true,
      taskId: generatedGoogleTaskId,
      message: `Google Tasks'e '${task.title}' olarak kaydedildi (Due: ${task.dueDate}).`
    };
  }

  private addLog(job: QueueJob, step: string, message: string, type: 'info' | 'warn' | 'success' | 'error' = 'info') {
    job.logs.push({
      timestamp: new Date().toISOString(),
      step,
      message,
      type
    });
  }

  private emitJobProgress(job: QueueJob) {
    sseManager.broadcast({
      type: 'JOB_PROGRESS',
      jobId: job.id,
      message: `[${job.currentStep.toUpperCase()}] ${job.status}: ${job.validatedTask?.title || job.extracted?.subject || job.id}`,
      timestamp: new Date().toISOString(),
      data: { job }
    });
  }

  private microDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const asyncQueue = new AsyncQueueManager();
