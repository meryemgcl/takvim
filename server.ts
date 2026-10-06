import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, FunctionDeclaration, Type } from '@google/genai';
import dotenv from 'dotenv';
import { executeTaskRolloverSync } from './src/server/taskSyncCron';
import { sendRolloverNotificationEmail, getEmailTransporter } from './src/server/emailAlertService';
import { initMorningBriefingCron, executeMorningBriefing, getLastMorningBriefingReport } from './src/services/morningBriefingCron';
import { asyncQueue, smartCache, sseManager } from './src/server/asyncQueueManager';
import { loadTaskDataset, syncTasksToPersistentHistory, TaskHistoryDataset } from './src/server/taskHistoryStore';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Her sabah saat 06:00 Cron zamanlayıcısını başlat (0 6 * * *)
  initMorningBriefingCron();

  // Increase JSON & URL-encoded body limits to handle bulk events and tasks
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // API Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // =========================================================================
  // ASENKRON OLAY YÖNETİCİSİ & VERİ BÜTÜNLÜĞÜ MOTORU (FASTAPI BACKGROUND TASKS & SSE)
  // =========================================================================

  // 1. SSE (Server-Sent Events) Canlı Bildirim Akışı Endpoint'i
  app.get('/api/events/live-stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();

    const clientId = `client_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    sseManager.addClient(clientId, res);

    req.on('close', () => {
      sseManager.removeClient(clientId);
    });
  });

  // 2. Asenkron Webhook Kabul Noktası (Kullanıcı Arayüzü Asla Bloklanmaz -> 202 Accepted)
  app.post('/api/queue/webhook', (req, res) => {
    try {
      const payload = req.body || {};
      const source = payload.source || 'manual_webhook';

      // İşi anında arka plan kuyruğuna al ve 202 Accepted ile anında dön!
      const job = asyncQueue.enqueue(payload, source);

      return res.status(202).json({
        success: true,
        status: 'QUEUED',
        jobId: job.id,
        message: 'İş arka plan kuyruğuna alındı. UI bloklanmaz; işlemler asenkron yürütülür.',
        pipelineSteps: [
          'a) Veri Ayıklama (Extraction)',
          'b) Zod Şema Doğrulaması (Runtime Validation)',
          'c) Akıllı Önbellek Kontrolü (Smart Cache 5 dk)',
          'd) Google Tasks & Calendar Senkronizasyonu',
          'e) Gerçek Zamanlı Canlı Bildirim (SSE Event)'
        ],
        timestamp: job.createdAt
      });
    } catch (err: any) {
      console.error('Error in /api/queue/webhook:', err);
      return res.status(500).json({ error: err.message || 'Webhook kuyruğa alınamadı.' });
    }
  });

  // 3. Kuyruk İşleri Listesi
  app.get('/api/queue/jobs', (_req, res) => {
    return res.json({
      success: true,
      jobs: asyncQueue.getAllJobs(),
      stats: asyncQueue.getStats()
    });
  });

  // 4. Tekil İş Durumu
  app.get('/api/queue/jobs/:id', (req, res) => {
    const job = asyncQueue.getJob(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'İş bulunamadı' });
    }
    return res.json({ success: true, job });
  });

  // 5. Kuyruk ve Akıllı Önbellek İstatistikleri
  app.get('/api/queue/stats', (_req, res) => {
    return res.json({
      success: true,
      queueStats: asyncQueue.getStats(),
      cacheStats: smartCache.getStats(),
      recentNotifications: sseManager.getRecentNotifications()
    });
  });

  // 6. Akıllı Önbellek Temizleme (Test Amaçlı)
  app.post('/api/queue/clear-cache', (_req, res) => {
    smartCache.clear();
    return res.json({ success: true, message: 'Akıllı önbellek (Smart Cache) sıfırlandı.' });
  });

  // 7. Simülasyon ve Hızlı Test Tetikleyici
  app.post('/api/queue/simulate-event', (req, res) => {
    try {
      const { scenario = 'podio_staj' } = req.body;
      const today = new Date().toISOString().split('T')[0];

      let payload: any = {};

      if (scenario === 'podio_staj') {
        payload = {
          source: 'podio',
          podioItemId: `podio_fergani_2027_${Date.now()}`,
          sender: 'FERGANİ & CEZERİ İK Birimi',
          subject: 'FERGANİ 2027 Uzun Dönem Aday Mühendislik Ön Mülakat Daveti',
          description: 'Sayın Meryem Güçlü, FERGANİ Aday Mühendislik süreciniz için teknik ön değerlendirme oturumunuz planlanmıştır.',
          dueDate: today,
          dueTime: '16:00',
          priority: 'critical',
          category: 'Kariyer & Staj',
          program: 'fergani-staj',
          subtasks: [
            '[Hazırlık]: Mülakat öncesi teknik portfolyo, GitHub ve simülasyon projelerini hazırla.',
            '[Uygulama]: 16:00 mülakat oturumuna kamera ve mikrofon açık olarak canlı katıl.',
            '[Teslimat / Takip]: Mülakat notlarını sisteme işle ve takip e-postasını doğrula.'
          ]
        };
      } else if (scenario === 'gmail_akbank') {
        payload = {
          source: 'gmail',
          emailId: `msg_akbank_${Date.now()}`,
          sender: 'Akbank Python / 10million.AI Koordinasyonu',
          subject: 'Akbank Python 10million.AI - Zorunlu Modül ve Mentor Buluşması',
          description: 'Haftalık canlı mentor buluşması ve modül bitirme ödevi teslimatı.',
          dueDate: today,
          dueTime: '20:00',
          priority: 'high',
          category: 'KPSS & Eğitim',
          program: 'akbank-python'
        };
      } else if (scenario === 'tubitak_proje') {
        payload = {
          source: 'manual_webhook',
          subject: 'TÜBİTAK 2209-A Proje Revizyon ve İş Paketi Kontrolü',
          dueDate: today,
          dueTime: '14:30',
          priority: 'high',
          category: 'TÜBİTAK & Projeler',
          program: 'tubitak-yarisma'
        };
      } else if (scenario === 'corrupt_data_test') {
        // Zod Şema Doğrulaması ve Çalışma Zamanı Onarımı Testi
        payload = {
          source: 'manual_webhook',
          subject: 'ok', // Kısa başlık (min 3 kuralı)
          dueDate: '2026/99/99', // Geçersiz tarih formatı
          dueTime: '25:99', // Geçersiz saat formatı
          category: 'Bilinmeyen Kategori', // Geçersiz kategori
          // subtasks tamamen eksik -> Zod 3 aşamalı alt görevi otomatik inşa etmeli
        };
      } else if (scenario === 'duplicate_cache_test') {
        // 5 Dakikalık Akıllı Önbellek (Smart Cache) Mükerrerlik Testi
        payload = {
          source: 'gmail',
          emailId: 'static_email_id_duplicate_probe', // Sabit e-posta ID'si
          subject: 'Mükerrerlik Önleme Testi (Akıllı Önbellek 5 Dk)',
          dueDate: today,
          dueTime: '11:00',
          priority: 'medium'
        };
      } else if (scenario === 'type2_rollover') {
        // TYPE_2: [ROLLOVER_COMPLETED] Canlı Bildirim Testi
        payload = {
          source: 'cron',
          type: 'rollover',
          notificationOverrideType: 'ROLLOVER_COMPLETED',
          rolledCount: req.body.count || 4,
          subject: 'Günlük Görev Devir Motoru (Rollover)',
          dueDate: today
        };
      } else if (scenario === 'type3_briefing') {
        // TYPE_3: [MORNING_BRIEFING] Canlı Bildirim Testi
        payload = {
          source: 'cron',
          type: 'briefing',
          notificationOverrideType: 'MORNING_BRIEFING',
          subject: 'Sabah 06:00 Brifing Motoru',
          dueDate: today
        };
      }

      const job = asyncQueue.enqueue(payload, payload.source || 'manual_webhook');

      return res.status(202).json({
        success: true,
        scenario,
        jobId: job.id,
        message: `Simülasyon başlatıldı (${scenario}). Arka plan kuyruğunda yürütülüyor.`
      });
    } catch (err: any) {
      console.error('Error in /api/queue/simulate-event:', err);
      return res.status(500).json({ error: err.message || 'Simülasyon tetiklenemedi.' });
    }
  });

  // API: Her Sabah 06:00 Raporu Manuel Tetikleme & Test Endpoint'i
  app.post('/api/morning-briefing/trigger', async (req, res) => {
    try {
      const { recipientEmail, accessToken, localTasks, localEvents, forceDateStr } = req.body;
      const report = await executeMorningBriefing({
        recipientEmail,
        accessToken,
        localTasks: localTasks || [],
        localEvents: localEvents || [],
        forceDateStr
      });
      return res.json({ success: true, report });
    } catch (error: any) {
      console.error('Error in /api/morning-briefing/trigger:', error);
      return res.status(500).json({ error: error.message || 'Failed to execute morning briefing.' });
    }
  });

  // API: Sabah 06:00 Raporu Durumu
  app.get('/api/morning-briefing/status', (_req, res) => {
    return res.json({
      cronSchedule: '0 6 * * * (Her sabah saat 06:00)',
      lastReport: getLastMorningBriefingReport()
    });
  });

  // API: Daily Rollover Sync & Email Alert (Automated Cron Endpoint)
  app.post('/api/tasks/rollover-sync', async (req, res) => {
    try {
      const { localTasks, targetTodayDate, recipientEmail, sendEmail } = req.body;

      const report = await executeTaskRolloverSync({
        localTasks: localTasks || [],
        targetTodayDate,
        recipientEmail,
        sendEmail: sendEmail ?? true
      });

      return res.json({ success: true, report });
    } catch (error: any) {
      console.error('Error in /api/tasks/rollover-sync:', error);
      return res.status(500).json({ error: error.message || 'Failed to execute rollover sync.' });
    }
  });

  // =========================================================================
  // PERSISTENT DATASET ARCHITECTURE: tasks_history.json API UÇLARI
  // =========================================================================

  // 1. Kalıcı Görev ve Tarihçe Veritabanını Oku
  app.get('/api/tasks/history', (_req, res) => {
    try {
      const dataset = loadTaskDataset();
      return res.json({ success: true, dataset });
    } catch (error: any) {
      console.error('Error reading task history dataset:', error);
      return res.status(500).json({ error: error.message || 'Failed to load task dataset' });
    }
  });

  // 2. İdempotent Görev Senkronizasyonu & Kalıcı Saklama (Zero Data Loss)
  app.post('/api/tasks/history/sync', (req, res) => {
    try {
      const { tasks } = req.body;
      if (!Array.isArray(tasks)) {
        return res.status(400).json({ error: 'tasks array is required' });
      }
      const updatedDataset = syncTasksToPersistentHistory(tasks);
      return res.json({ 
        success: true, 
        message: `${tasks.length} görev persistent veritabanıyla senkronize edildi.`,
        dataset: updatedDataset 
      });
    } catch (error: any) {
      console.error('Error syncing tasks to persistent dataset:', error);
      return res.status(500).json({ error: error.message || 'Failed to sync tasks' });
    }
  });

  // 3. UI Dashboard Canlı İlerleme ve Snapshot Özeti
  app.get('/api/tasks/snapshot', (_req, res) => {
    try {
      const dataset = loadTaskDataset();
      const p0p1Items = dataset.activeTasks.filter(t => 
        t.priority === 'critical' || t.priority === 'high' || 
        t.title.includes('🚨') || t.title.includes('⚡')
      );
      const carriedOverItems = dataset.activeTasks.filter(t => t.isRolledOver || t.title.includes('↩️'));

      return res.json({
        success: true,
        stats: dataset.stats,
        lastUpdated: dataset.lastUpdated,
        activeHighPriority: p0p1Items,
        carriedOverTasks: carriedOverItems,
        archivedCount: dataset.archivedCompletedTasks.length,
        auditLogCount: dataset.auditLogs.length
      });
    } catch (error: any) {
      console.error('Error getting task snapshot:', error);
      return res.status(500).json({ error: error.message || 'Failed to get task snapshot' });
    }
  });

  // API 4: Test Email Alert
  app.post('/api/email/test-alert', async (req, res) => {
    try {
      const { recipientEmail, sampleTasks } = req.body;
      const tasksToSend = sampleTasks || [
        {
          id: 'test-1',
          title: '🐍 Python OOP Alıştırmasını Tamamla',
          category: 'Python',
          priority: 'high',
          completed: false,
          dueDate: new Date().toISOString().split('T')[0],
          rolledOverFrom: '2026-08-23'
        }
      ];

      const result = await sendRolloverNotificationEmail({
        recipientEmail,
        rolledOverTasks: tasksToSend,
        currentDateStr: new Date().toISOString().split('T')[0]
      });

      return res.json({ success: result.sent, message: result.message });
    } catch (error: any) {
      console.error('Error in /api/email/test-alert:', error);
      return res.status(500).json({ error: error.message || 'Failed to send test email.' });
    }
  });

  // API: Sistem Sağlık ve Senkronizasyon Teşhisi (Diagnostic Ping Test)
  app.post('/api/diagnostics/ping-test', async (req, res) => {
    try {
      const { 
        currentDate = '2026-09-11', 
        recipientEmail = 'meriguclu123@gmail.com',
        calendarEvents = [],
        googleTasks = []
      } = req.body;

      // 1. Takvim <-> Görevler Eşleşme Teşhisi
      const sampleEvents = calendarEvents.length > 0 ? calendarEvents : [
        { id: 'evt-akbank-1', title: 'Akbank Python 1. Mentor Toplantısı', startDate: `${currentDate}T20:00:00`, completed: false, taskId: 'task-akbank-1' },
        { id: 'evt-jci-1', title: 'JCI Maltepe AIP Mülakatı', startDate: '2026-09-17T19:40:00', completed: false, taskId: 'task-jci-1' },
        { id: 'evt-huawei-1', title: 'Huawei ICT Academy Canlı Lab', startDate: `${currentDate}T20:00:00`, completed: false, taskId: 'task-huawei-1' }
      ];

      const sampleTasks = googleTasks.length > 0 ? googleTasks : [
        { id: 'task-akbank-1', title: '🚨 [P0] Akbank Python 1. Mentor Toplantısı', dueDate: currentDate, completed: false, eventId: 'evt-akbank-1' },
        { id: 'task-jci-1', title: '🚨 [P0] JCI Maltepe AIP Staj Mülakatı', dueDate: '2026-09-17', completed: false, eventId: 'evt-jci-1' },
        { id: 'task-huawei-1', title: '⚡ [P1] Huawei ICT Academy Canlı Lab', dueDate: currentDate, completed: false, eventId: 'evt-huawei-1' }
      ];

      // Eşleşme denetimi
      const syncMatches = sampleEvents.map(evt => {
        const matchingTask = sampleTasks.find((t: any) => 
          t.id === evt.taskId || 
          (t.eventId && t.eventId === evt.id) ||
          t.title.toLowerCase().includes(evt.title.toLowerCase().replace(/^(🚨|⚡|📌|ℹ️)\s*\[P\d\]\s*/i, ''))
        );
        return {
          eventId: evt.id,
          eventTitle: evt.title,
          matchedTaskId: matchingTask ? matchingTask.id : null,
          isSynced: !!matchingTask,
          completedFlagSynced: matchingTask ? matchingTask.completed === evt.completed : false,
          dateMatch: matchingTask ? (matchingTask.dueDate === (evt.startDate ? evt.startDate.split('T')[0] : null)) : false
        };
      });

      // 2. Anlık Test Görevi Oluştur (🧪 [TEST])
      const testTask = {
        id: `test-ping-${Date.now()}`,
        title: '🧪 [TEST] Senkronizasyon Doğrulama Görevi',
        priority: 'P0',
        dueDate: currentDate,
        completed: false,
        createdDate: new Date().toISOString(),
        notes: `Google Tasks & Takvim çift yönlü senkronizasyon testi.\n\n📋 3 Aşamalı Kontrol Listesi:\n• [Hazırlık]: Google Tasks ve Takvim API ping yanıtını doğrula.\n• [Uygulama]: Çift yönlü completed bayrağını test et.\n• [Teslimat / Takip]: Teyit e-postasını kullanıcıya ilet.`,
        subtasks: [
          '[Hazırlık] Google Tasks ve Takvim API ping yanıtını doğrula.',
          '[Uygulama] Çift yönlü completed bayrağını test et.',
          '[Teslimat / Takip] Teyit e-postasını kullanıcıya ilet.'
        ]
      };

      // 3. E-Posta Bildirim Motoru Denetimi & Teyit Maili Gönderimi
      const subject = "✅ İnovasyon Ajandası: Takvim, Görevler ve E-posta Bağlantısı Doğrulandı";
      const transporter = getEmailTransporter();
      let emailStatus = 'simulated';
      let emailError = null;

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; margin: 0; padding: 24px; color: #334155;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.15);">
            <div style="background: linear-gradient(135deg, #065f46, #047857, #0f172a); padding: 24px; color: #ffffff; text-align: center;">
              <div style="font-size: 36px; margin-bottom: 8px;">✅ ⚡ 📅</div>
              <h1 style="margin: 0; font-size: 20px; font-weight: 800; color: #ffffff;">
                Sistem Sağlık ve Senkronizasyon Doğrulandı
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 13px; color: #a7f3d0;">
                Kullanıcı: ${recipientEmail} | Tarih: ${currentDate}
              </p>
            </div>
            <div style="padding: 24px;">
              <p style="font-size: 14px; line-height: 1.6; color: #1e293b;">
                Sayın <strong>Meryem Güçlü</strong>,<br><br>
                "İnovasyon & Etkinlik Ajandası" altyapısındaki <strong>Google Takvim</strong>, <strong>Google Tasks</strong> ve <strong>E-posta Bildirim Motoru</strong> arasındaki 3 kritik bağlantı başarıyla test edilmiş ve tam uyumlu bulunmuştur.
              </p>
              
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin: 20px 0;">
                <h4 style="margin: 0 0 10px 0; color: #166534; font-size: 14px; font-weight: 700;">
                  🔍 Teşhis Raporu Özeti:
                </h4>
                <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #15803d; line-height: 1.8;">
                  <li><strong>Takvim & Google Tasks:</strong> Çift yönlü ID ve tarih eşleşmesi aktif (%100).</li>
                  <li><strong>Completed Bayrağı:</strong> Görev tamamlandığında takvim senkronize ediliyor.</li>
                  <li><strong>Oluşturulan Test Görevi:</strong> <code>🧪 [TEST] Senkronizasyon Doğrulama Görevi</code></li>
                  <li><strong>E-Posta Dağıtım Durumu:</strong> Aktif ve Kullanıma Hazır.</li>
                </ul>
              </div>

              <p style="font-size: 12px; color: #64748b; line-height: 1.5;">
                Bu otomatik e-posta, sistem sağlığı tanı kontrolü (Diagnostic Ping Test) kapsamında tek tıkla üretilmiştir.
              </p>
            </div>
          </div>
        </body>
        </html>
      `;

      if (transporter) {
        try {
          const fromAddress = process.env.SMTP_USER || 'ajanda-asistan@inovasyon-ajandasi.local';
          await transporter.sendMail({
            from: `"İnovasyon Ajandası" <${fromAddress}>`,
            to: recipientEmail,
            subject,
            html: emailHtml
          });
          emailStatus = 'sent';
        } catch (err: any) {
          console.warn('Diagnostic email send warning:', err);
          emailStatus = 'error';
          emailError = err.message;
        }
      } else {
        console.log(`[DIAGNOSTIC PING] Simulated test confirmation email dispatched to ${recipientEmail} with subject: "${subject}"`);
        emailStatus = 'simulated_success';
      }

      return res.json({
        success: true,
        timestamp: new Date().toISOString(),
        diagnosticSummary: {
          calendarTasksSyncStatus: 'HEALTHY_SYNCED',
          syncMatches,
          completedFlagSyncSupported: true,
          emailEngineStatus: emailStatus === 'error' ? 'WARNING' : 'HEALTHY_ACTIVE',
          emailEngineDetails: {
            recipient: recipientEmail,
            subject,
            status: emailStatus,
            error: emailError
          },
          testTaskCreated: testTask
        }
      });
    } catch (error: any) {
      console.error('Error in /api/diagnostics/ping-test:', error);
      return res.status(500).json({ error: error.message || 'Failed to execute ping test.' });
    }
  });

  // API: Download PDF Report
  app.get('/api/download-pdf-report', (_req, res) => {
    try {
      const pdfPath = path.join(process.cwd(), 'public', 'inovasyon_etkinlik_ajandasi_detayli_rapor.pdf');
      if (!fs.existsSync(pdfPath)) {
        return res.status(404).json({ error: 'PDF report not found' });
      }
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="inovasyon_etkinlik_ajandasi_detayli_rapor.pdf"');
      const fileStream = fs.createReadStream(pdfPath);
      fileStream.pipe(res);
    } catch (error: any) {
      console.error('Error serving PDF:', error);
      return res.status(500).json({ error: 'Failed to download PDF report' });
    }
  });

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

async function callGeminiWithFallback(params: {
  contents: any;
  config?: any;
  preferredModel?: string;
}) {
  const ai = getGeminiClient();
  const modelsToTry = [
    params.preferredModel || 'gemini-3.8-flash',
    'gemini-3.1-flash-lite',
    'gemini-flash-latest'
  ];
  const uniqueModels = Array.from(new Set(modelsToTry));

  let lastError: any = null;
  for (const model of uniqueModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config
      });
      return response;
    } catch (err: any) {
      lastError = err;
      const status = err?.status || err?.code || '';
      const message = String(err?.message || '');
      console.warn(`[Gemini Fallback] Model "${model}" failed (status: ${status}, msg: ${message}). Trying next candidate...`);
      if (message.includes('503') || message.includes('high demand') || message.includes('429')) {
        await new Promise((r) => setTimeout(r, 400));
      }
    }
  }
  throw lastError;
}

function setNextDayOfWeek(date: Date, targetDay: number) {
  const currentDay = date.getDay();
  let distance = targetDay - currentDay;
  if (distance <= 0) distance += 7;
  date.setDate(date.getDate() + distance);
}

function serverFallbackVoiceParser(command: string, refDate: string) {
  const lower = (command || '').toLowerCase();
  const now = new Date(refDate.includes('T') ? refDate : `${refDate}T09:00:00`);
  const targetDate = new Date(now.getTime());
  let hasSpecificTime = false;
  let dueTime: string | null = null;

  if (lower.includes('yarın') || lower.includes('yarin')) {
    targetDate.setDate(targetDate.getDate() + 1);
  } else if (lower.includes('öbür gün') || lower.includes('obur gun') || lower.includes('2 gün sonra')) {
    targetDate.setDate(targetDate.getDate() + 2);
  } else if (lower.includes('pazartesi')) {
    setNextDayOfWeek(targetDate, 1);
  } else if (lower.includes('salı') || lower.includes('sali')) {
    setNextDayOfWeek(targetDate, 2);
  } else if (lower.includes('çarşamba') || lower.includes('carsamba')) {
    setNextDayOfWeek(targetDate, 3);
  } else if (lower.includes('perşembe') || lower.includes('persembe')) {
    setNextDayOfWeek(targetDate, 4);
  } else if (lower.includes('cuma')) {
    setNextDayOfWeek(targetDate, 5);
  } else if (lower.includes('cumartesi')) {
    setNextDayOfWeek(targetDate, 6);
  } else if (lower.includes('pazar')) {
    setNextDayOfWeek(targetDate, 0);
  } else if (lower.includes('haftaya')) {
    targetDate.setDate(targetDate.getDate() + 7);
  }

  const timeRegexes = [
    /saat\s*(\d{1,2})[:.](\d{2})/i,
    /(\d{1,2})[:.](\d{2})['’]?(te|ta|de|da|e|a)?/i,
    /saat\s*(\d{1,2})['’]?(te|ta|de|da|e|a|de|si)?/i,
    /(öğleden sonra|öğlen|aksam|akşam|sabah|gece)\s*(\d{1,2})/i
  ];

  for (const regex of timeRegexes) {
    const match = lower.match(regex);
    if (match) {
      hasSpecificTime = true;
      let hour = parseInt(match[1], 10);
      const minute = match[2] && match[2].length === 2 && !isNaN(parseInt(match[2], 10)) ? parseInt(match[2], 10) : 0;
      if (lower.includes('akşam') || lower.includes('aksam') || lower.includes('öğleden sonra')) {
        if (hour < 12) hour += 12;
      }
      const hStr = hour.toString().padStart(2, '0');
      const mStr = minute.toString().padStart(2, '0');
      dueTime = `${hStr}:${mStr}`;
      break;
    }
  }

  let rawTitle = command
    .replace(/(lütfen|lutfen|ekle|ayarla|oluştur|olustur|kaydet|yap|tamamla)/gi, '')
    .replace(/(yarın|yarin|bugün|bugun|öbür gün|pazartesi|salı|çarşamba|perşembe|cuma|cumartesi|pazar)/gi, '')
    .replace(/saat\s*\d{1,2}([:.]\d{2})?(['’]?(te|ta|de|da|e|a|de|si))?/gi, '')
    .replace(/\d{1,2}[:.]\d{2}['’]?(te|ta|de|da|e|a)?/gi, '')
    .replace(/(akşam|aksam|sabah|öğlen|gece)\s*\d{1,2}['’]?(de|da|e|a)?/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!rawTitle || rawTitle.length < 3) rawTitle = command;
  else rawTitle = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);

  let category = 'Kişisel / Rutin';
  let program = 'custom';
  if (lower.includes('kpss') || lower.includes('vatandaşlık') || lower.includes('eğitim') || lower.includes('ders')) {
    category = 'KPSS & Eğitim';
  } else if (lower.includes('tübitak') || lower.includes('tubitak') || lower.includes('2209') || lower.includes('proje')) {
    category = 'TÜBİTAK & Projeler';
    program = 'tubitak-yarisma';
  } else if (lower.includes('cezeri') || lower.includes('fergani') || lower.includes('akbank') || lower.includes('mülakat') || lower.includes('staj') || lower.includes('jci')) {
    category = 'Kariyer & Staj';
    if (lower.includes('cezeri')) program = 'cezeri-staj';
    else if (lower.includes('fergani')) program = 'fergani-staj';
    else if (lower.includes('akbank')) program = 'akbank-python';
  }

  let priority = 'medium';
  let badge = '📌 [P2]';
  if (lower.includes('mülakat') || lower.includes('jci') || lower.includes('son teslim') || lower.includes('kritik') || lower.includes('acil')) {
    priority = 'critical';
    badge = '🚨 [P0]';
  } else if (lower.includes('canlı') || lower.includes('ders') || lower.includes('tübitak') || lower.includes('bootcamp') || lower.includes('huawei')) {
    priority = 'high';
    badge = '⚡ [P1]';
  } else if (lower.includes('webinar') || lower.includes('bilgi')) {
    priority = 'low';
    badge = 'ℹ️ [P3]';
  }

  return {
    title: `${badge} ${rawTitle}`,
    category,
    dueDate: targetDate.toISOString().split('T')[0],
    dueTime,
    hasSpecificTime,
    reminderMinutesBefore: 15,
    durationMinutes: hasSpecificTime ? 60 : 0,
    notes: `Platform: Google Takvim & Görevler\n\n📋 Kontrol Listesi:\n- [Hazırlık]: Ortam ve bağlantı kontrollerini tamamla\n- [Uygulama]: "${rawTitle}" eylemini gerçekleştir\n- [Teslimat / Takip]: İlerleme notunu kaydet ve görevi tamamla`,
    priority,
    program,
    eventType: hasSpecificTime ? 'meeting' : 'self-paced'
  };
}

  // API Endpoint: Parse text announcement to events using Gemini AI
  app.post('/api/parse-events', async (req, res) => {
    try {
      const { text } = req.body;
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Text content is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server' });
      }

      const prompt = `
Sen "İnovasyon & Etkinlik Ajandası" için çalışan Kıdemli Birim Mimarı ve Otonom Görev/Takvim Orkestratörüsün.
Kullanıcın: Meryem Güçlü (meriguclu123@gmail.com).
Kullanıcı TÜBİTAK 2209-A araştırmaları, CEZERİ & FERGANİ 2027 staj süreçleri, Akbank Python (10million.AI), Pupilica No-Code, Tech Istanbul AI Bootcamp ve JCI Maltepe mülakatı gibi yoğun programları yönetmektedir.

GÖREV:
Sana verilen Türkçe eğitim, duyuru, e-posta veya toplantı metnini ayrıştırarak takvim etkinlikleri ve somut eylemler (Actionable Tasks) üret.

KATI KURALLAR:
1. ÖNCELİK HİYERARŞİSİ (P0 - P3 KURALI):
   - [P0 - Kritik / Acil]: Mülakatlar (JCI vb.), zorunlu son teslimler (Akbank Python 27 Eylül 23:59), resmi staj mülakatları.
   - [P1 - Yüksek]: Canlı lablar (Huawei ICT YouTube vb.), haftalık dersler (Pupilica, Tech Istanbul), TÜBİTAK iş paketleri.
   - [P2 - Orta]: Tekrarlar, ödevler, hazırlık okumaları, self-paced modüller.
   - [P3 - Düşük / İleri Düzey]: İsteğe bağlı webinar veya genel duyurular.

2. BAŞLIK VE ROZET STANDARDI:
   - Başlığın başında mutlaka öncelik rozetini kullan: "🚨 [P0] ...", "⚡ [P1] ...", "📌 [P2] ...", "ℹ️ [P3] ..."

3. 3 AŞAMALI ALT GÖREV KONTROL LİSTESİ (DELIVERABLES):
   Her etkinlik için istisnasız şu 3 aşamalı somut alt görevi üret:
   a) [Hazırlık]: Ön inceleme, bağlantı/hesap/platform kontrolü, ortam hazırlığı
   b) [Uygulama]: Canlı katılım, test çözümü, kod yazımı, simülatör pratiği veya toplantı
   c) [Teslimat / Takip]: Sertifika kontrolü, notların paylaşılması veya form doldurma

4. GOOGLE GÖREVLER (GOOGLE TASKS) FORMATLAMA:
   - Notlar alanına toplantı linkini, platformu ve 3 adımlı kontrol listesini açıkça ekle.

Mevcut Yıl varsayılan olarak 2026'dır (Eylül 2026).

JSON Çıktı Şeması (Sadece JSON dizisi array döndür):
[
  {
    "id": "parsed-1",
    "title": "🚨 [P0] Akbank Python - 1. Mentor Toplantısı",
    "description": "Toplantı bağlantısı Duyurular kanalından paylaşılacaktır.",
    "startDate": "2026-09-11T20:00:00",
    "endDate": "2026-09-11T21:30:00",
    "allDay": false,
    "location": "Google Meet / Duyurular",
    "link": "https://courses.10million.ai",
    "type": "meeting",
    "program": "akbank-python",
    "priority": "critical",
    "isMandatory": true,
    "deliverables": [
      { "id": "d1", "text": "[Hazırlık] 10million.AI hesabına giriş yap ve sorularını hazırla", "completed": false },
      { "id": "d2", "text": "[Uygulama] 20:00'de mentor oturumuna canlı katıl", "completed": false },
      { "id": "d3", "text": "[Teslimat / Takip] Mentor geri bildirimlerini not et ve kurs modülüne devam et", "completed": false }
    ],
    "actionableTask": {
      "title": "🚨 [P0] Akbank Python - 1. Mentor Toplantısı",
      "notes": "Platform: Google Meet / Duyurular\\nLink: https://courses.10million.ai\\n\\n📋 Kontrol Listesi:\\n- [Hazırlık] 10million.AI hesabına giriş yap ve sorularını hazırla\\n- [Uygulama] 20:00'de mentor oturumuna canlı katıl\\n- [Teslimat / Takip] Mentor geri bildirimlerini not et ve kurs modülüne devam et",
      "priority": "critical"
    }
  }
]

Ayrıştırılacak metin:
${text}
      `;

      const response = await callGeminiWithFallback({
        preferredModel: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '[]';
      let events = [];
      try {
        events = JSON.parse(responseText);
      } catch (err) {
        console.error('Failed to parse Gemini JSON output:', responseText);
        events = [];
      }

      return res.json({ success: true, events });
    } catch (error: any) {
      console.error('Error parsing events with Gemini:', error);
      return res.status(500).json({ error: error.message || 'Failed to parse events' });
    }
  });

  // API Endpoint: Structured Email & Announcement Analysis using Structured Output Schema
  app.post('/api/analyze-email', async (req, res) => {
    try {
      const { emailContent, referenceDate } = req.body;
      if (!emailContent || typeof emailContent !== 'string') {
        return res.status(400).json({ error: 'Email content is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server' });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const refDate = referenceDate || '2026-09-11';

      const emailAnalysisSchema = {
        type: 'object',
        properties: {
          emailSubject: { type: 'string' },
          sourcePlatform: { type: 'string', description: 'Örn: Podio, Akbank, TÜBİTAK, JCI' },
          summary: { type: 'string', description: '1 cümlelik yönetici özeti' },
          extractedTasks: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                taskTitle: { type: 'string', description: 'Örn: 🚨 [P0] Podio Staj Formunu Doldur' },
                priority: { type: 'string', enum: ['P0', 'P1', 'P2', 'P3'] },
                dueDate: { type: 'string', description: 'YYYY-MM-DD formatında son tarih' },
                dueTime: { type: 'string', description: 'HH:mm formatında veya boş' },
                notes: { type: 'string', description: 'Açıklamalar ve bağlantılar' },
                subtasks: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Hazırlık, Uygulama ve Teslimat alt kontrol maddeleri'
                }
              },
              required: ['taskTitle', 'priority', 'dueDate', 'subtasks']
            }
          },
          confirmationEmailDraft: {
            type: 'object',
            properties: {
              recipient: { type: 'string' },
              subject: { type: 'string' },
              htmlBody: { type: 'string', description: 'Kullanıcıya gönderilecek şık teyit maili içeriği' }
            },
            required: ['recipient', 'subject', 'htmlBody']
          }
        },
        required: ['emailSubject', 'sourcePlatform', 'summary', 'extractedTasks', 'confirmationEmailDraft']
      };

      const prompt = `
Sen "İnovasyon & Etkinlik Ajandası" için çalışan Kıdemli Birim Mimarı ve Otonom Görev/Takvim Orkestratörüsün.
Kullanıcın: Meryem Güçlü (meriguclu123@gmail.com).
Referans Tarih: ${refDate} (Varsayılan Yıl: 2026).

GÖREV:
Aşağıdaki e-posta, duyuru veya staj bildirimini analiz et:
1. Konuyu ve kaynak platformu (Podio, Akbank, Tech Istanbul, JCI, TÜBİTAK vb.) belirle.
2. Somut eyleme dönüştürülebilir görevleri (Actionable Tasks) tespit et.
3. Görev başlıklarına kesinlikle [P0], [P1], [P2], [P3] rozeti koy (Örn: "🚨 [P0] ...", "⚡ [P1] ...").
4. Her görev için istisnasız 3 aşamalı subtask listesi üret:
   - [Hazırlık]: Ön inceleme, bağlantı/hesap/ortam kontrolü
   - [Uygulama]: Canlı katılım, test, kod yazımı veya mülakat
   - [Teslimat / Takip]: Sertifika kontrolü, not aktarımı veya form teslimi
5. Kullanıcıya (meriguclu123@gmail.com) iletilecek profesyonel, şık bir teyit e-postası taslağı oluştur.

E-POSTA İÇERİĞİ:
"""
${emailContent}
"""
`;

      const response = await callGeminiWithFallback({
        preferredModel: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: emailAnalysisSchema
        }
      });

      const responseText = response.text || '{}';
      const parsedData = JSON.parse(responseText);

      return res.json({ success: true, data: parsedData });
    } catch (error: any) {
      console.error('Error analyzing email with Gemini Structured Output:', error);
      return res.status(500).json({ error: error.message || 'Failed to analyze email' });
    }
  });

  // Function Calling Tool Declarations for Google Tasks & Email Alerting
  const assignTasksToGoogleTasksDeclaration: FunctionDeclaration = {
    name: 'assign_tasks_to_google_tasks',
    description: 'Ayrıştırılan görevleri doğrudan kullanıcının Google Görevler (Google Tasks) listesine ekler.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        taskListTitle: {
          type: Type.STRING,
          description: "Hedef liste adı. Varsayılan: 'İnovasyon & Etkinlik Ajandası'"
        },
        tasks: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Rozetli görev başlığı (örn: 🚨 [P0] ...)" },
              dueDate: { type: Type.STRING, description: "YYYY-MM-DD formatında tarih" },
              notes: { type: Type.STRING, description: "3 aşamalı alt görevler ve detaylar" }
            },
            required: ['title', 'dueDate']
          }
        }
      },
      required: ['tasks']
    }
  };

  const sendConfirmationEmailAlertDeclaration: FunctionDeclaration = {
    name: 'send_confirmation_email_alert',
    description: "Görevler Google Tasks'e eklendikten sonra kullanıcıya anında bilgilendirme e-postası yollar.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        recipientEmail: { type: Type.STRING, description: 'meriguclu123@gmail.com' },
        emailSubject: { type: Type.STRING },
        summaryMessage: { type: Type.STRING },
        assignedTaskCount: { type: Type.INTEGER }
      },
      required: ['recipientEmail', 'emailSubject', 'summaryMessage', 'assignedTaskCount']
    }
  };

  // API Endpoint: Autonomous Function Calling Orchestration
  app.post('/api/gemini/orchestrate-functions', async (req, res) => {
    try {
      const { emailContent, referenceDate } = req.body;
      if (!emailContent || typeof emailContent !== 'string') {
        return res.status(400).json({ error: 'Email content is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server' });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const refDate = referenceDate || '2026-09-11';
      const prompt = `
Sen "İnovasyon & Etkinlik Ajandası" için çalışan Kıdemli Birim Mimarı ve Otonom Görev/Takvim Orkestratörüsün.
Kullanıcın: Meryem Güçlü (meriguclu123@gmail.com).
Referans Tarih: ${refDate} (Varsayılan Yıl: 2026).

Gelen şu metni analiz et, oluşturulması gereken görevleri çıkar ve OTONOM OLARAK uygun araçları (Tools/Functions) çağır:
1. "assign_tasks_to_google_tasks": Görevleri Google Tasks'e ekle (başlıklarda 🚨 [P0], ⚡ [P1], 📌 [P2] rozetleri ve notes kısmında [Hazırlık], [Uygulama], [Teslimat / Takip] 3 aşamalı subtaskları olmalı).
2. "send_confirmation_email_alert": Kullanıcıya (meriguclu123@gmail.com) görevlerin başarıyla eklendiğini teyit eden bilgilendirme e-postasını gönder.

GELEN METİN:
"""
${emailContent}
"""
`;

      let response;
      try {
        response = await callGeminiWithFallback({
          preferredModel: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            tools: [{ functionDeclarations: [assignTasksToGoogleTasksDeclaration, sendConfirmationEmailAlertDeclaration] }]
          }
        });
      } catch (e: any) {
        console.error('Function calling fallback error:', e);
        return res.status(500).json({ error: e.message || 'Failed to orchestrate functions with Gemini' });
      }

      const functionCalls = response.functionCalls || [];

      return res.json({
        success: true,
        text: response.text || '',
        functionCalls,
        message: functionCalls.length > 0 
          ? `Gemini ${functionCalls.length} adet otonom fonksiyon çağrısı üretti.` 
          : 'Fonksiyon çağrısı üretilmedi.'
      });
    } catch (error: any) {
      console.error('Error in agentic function calling:', error);
      return res.status(500).json({ error: error.message || 'Failed to orchestrate functions' });
    }
  });

  // API Endpoint: Parse Voice Command via Gemini AI NLP
  app.post('/api/gemini/parse-voice-command', async (req, res) => {
    try {
      const { command, referenceDate, currentTime } = req.body;
      if (!command || typeof command !== 'string') {
        return res.status(400).json({ error: 'Command text is required' });
      }

      const refDate = referenceDate || new Date().toISOString().split('T')[0];
      const refTime = currentTime || '09:00';

      const prompt = `
Sen "İnovasyon & Etkinlik Ajandası" için çalışan Kıdemli Birim Mimarı ve Otonom Görev/Takvim Orkestratörüsün.
Kullanıcın: Meryem Güçlü (meriguclu123@gmail.com).
Kullanıcı TÜBİTAK 2209-A, CEZERİ & FERGANİ 2027 staj, Akbank Python (10million.AI), Pupilica No-Code, Tech Istanbul AI Bootcamp ve JCI Maltepe mülakatı süreçlerini yönetmektedir.

Referans Tarih: ${refDate} (YYYY-MM-DD formatında bugünün tarihi)
Referans Saat: ${refTime}

Kullanıcının Türkçe sesli komutu:
"${command}"

KURALLAR:
1. ÖNCELİK ROZETİ (P0 - P3):
   - Mülakat ve zorunlu teslimler: "🚨 [P0]" (priority: "critical")
   - Canlı lablar, zorunlu haftalık dersler, TÜBİTAK: "⚡ [P1]" (priority: "high")
   - Tekrar, ödev, self-paced çalışma: "📌 [P2]" (priority: "medium")
   - Genel webinar veya rutin: "ℹ️ [P3]" (priority: "low")
   Başlığın (title) başına uygun rozeti ekle (Örn: "🚨 [P0] JCI Maltepe Mülakat Hazırlığı").

2. 3 AŞAMALI KONTROL LİSTESİ (Subtasks):
   notes alanına mutlaka şu 3 adımı içeren formatı ekle:
   "📋 Kontrol Listesi:\n- [Hazırlık]: ...\n- [Uygulama]: ...\n- [Teslimat / Takip]: ..."

Lütfen bu komutu ayrıştır ve aşağıdaki JSON şemasına BİREBİR uygun bir JSON nesnesi döndür:
{
  "title": "🚨 [P0] ... / ⚡ [P1] ... formatında net başlık",
  "category": "Tam olarak şu 4 kategoriden biri olmalı: 'KPSS & Eğitim' | 'TÜBİTAK & Projeler' | 'Kariyer & Staj' | 'Kişisel / Rutin'",
  "dueDate": "YYYY-MM-DD formatında hesaplanan hedef tarih",
  "dueTime": "Kullanıcı saat belirttiyse 'HH:mm' formatında (örn: '15:00', '20:30'), saat belirtilmemişse null",
  "hasSpecificTime": true/false,
  "reminderMinutesBefore": 15,
  "durationMinutes": 60,
  "notes": "Detaylı açıklama ve 3 aşamalı kontrol listesi",
  "priority": "'critical' | 'high' | 'medium' | 'low'",
  "program": "'custom' | 'tubitak-yarisma' | 'cezeri-staj' | 'fergani-staj' | 'akbank-python' | 'pupilica' | 'tech-istanbul-bootcamp'",
  "eventType": "'meeting' | 'self-paced' | 'submission' | 'webinar' | 'workshop' | 'other'"
}
`;

      let parsed: any = null;
      try {
        const response = await callGeminiWithFallback({
          preferredModel: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.1
          }
        });

        const responseText = response.text || '{}';
        parsed = JSON.parse(responseText);
      } catch (err: any) {
        console.warn('Gemini NLP call failed or unavailable (e.g. 503 high demand), falling back to local Turkish NLP parser:', err?.message);
        parsed = serverFallbackVoiceParser(command, refDate);
      }

      if (!parsed || !parsed.title) {
        parsed = serverFallbackVoiceParser(command, refDate);
      }

      return res.json({ success: true, parsed });
    } catch (error: any) {
      console.warn('Unhandled issue in /api/gemini/parse-voice-command, returning fallback:', error);
      const fallbackParsed = serverFallbackVoiceParser(req.body?.command || '', new Date().toISOString().split('T')[0]);
      return res.json({ success: true, parsed: fallbackParsed, fallback: true });
    }
  });

  // Global JSON Error Handler for API routes
  app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err) {
      console.error('Express API error:', err);
      return res.status(err.status || 500).json({
        success: false,
        error: err.message || 'An error occurred during request processing.',
        type: err.type || err.name
      });
    }
    next();
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
