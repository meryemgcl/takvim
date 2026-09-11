import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { executeTaskRolloverSync } from './src/server/taskSyncCron';
import { sendRolloverNotificationEmail } from './src/server/emailAlertService';
import { initMorningBriefingCron, executeMorningBriefing, getLastMorningBriefingReport } from './src/services/morningBriefingCron';

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

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
Sen bir Takvim Etkinliği Ayrıştırıcısısın (Calendar Event Parser).
Sana Türkçe bir eğitim, duyuru veya toplantı metni verilecek. Bu metinden takvim etkinliklerini tespit edip JSON formatında döndür.

Mevcut Yıl varsayılan olarak 2026'dır (Ağustos 2026 civarı).

Her bir etkinlik için şu alanları sağla:
- id: benzersiz string (örn: "parsed-1")
- title: kısa ve net başlık (emoji içerebilir)
- description: detaylı açıklama
- startDate: ISO formatında tarih (YYYY-MM-DDTHH:mm:ss)
- endDate: ISO formatında bitiş tarihi (YYYY-MM-DDTHH:mm:ss)
- allDay: boolean (saat belirtilmemişse veya gün boyu sürecekse true)
- location: yer veya platform (YouTube, Teams, link, vb.)
- link: varsa web veya form bağlantısı
- type: 'webinar' | 'self-paced' | 'meeting' | 'submission' | 'workshop' | 'other'
- program: 'akbank-genai' | 'komut-muhendisligi' | 'gelecegin-meslekleri' | 'custom'
- isMandatory: boolean (zorunluysa true)

JSON Çıktı Şeması (Sadece bir JSON dizisi array döndür):
[
  {
    "id": "parsed-1",
    "title": "...",
    "description": "...",
    "startDate": "2026-08-07T20:00:00",
    "endDate": "2026-08-07T21:30:00",
    "allDay": false,
    "location": "YouTube",
    "link": "https://...",
    "type": "webinar",
    "program": "custom",
    "isMandatory": true
  }
]

Ayrıştırılacak metin:
${text}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
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

  // API Endpoint: Parse Voice Command via Gemini AI NLP
  app.post('/api/gemini/parse-voice-command', async (req, res) => {
    try {
      const { command, referenceDate, currentTime } = req.body;
      if (!command || typeof command !== 'string') {
        return res.status(400).json({ error: 'Command text is required' });
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

      const refDate = referenceDate || new Date().toISOString().split('T')[0];
      const refTime = currentTime || '09:00';

      const prompt = `
Sen Türkçe sesli komutları akıllı görev ve takvim etkinliklerine dönüştüren uzman bir AI NLP asistanısın.
Referans Tarih: ${refDate} (YYYY-MM-DD formatında bugünün tarihi)
Referans Saat: ${refTime}

Kullanıcının Türkçe sesli komutu:
"${command}"

Lütfen bu komutu ayrıştır ve aşağıdaki JSON şemasına BİREBİR uygun bir JSON nesnesi döndür:
{
  "title": "Görev veya etkinlik için temiz, anlamlı, ilk harfi büyük başlık (Örn: 'KPSS Vatandaşlık Soru Çözümü')",
  "category": "Tam olarak şu 4 kategoriden biri olmalı: 'KPSS & Eğitim' | 'TÜBİTAK & Projeler' | 'Kariyer & Staj' | 'Kişisel / Rutin'",
  "dueDate": "YYYY-MM-DD formatında hesaplanan hedef tarih. (Örn: 'yarın' denmişse ${refDate}'den bir sonraki gün, gün adı verilmişse o günün tarihi)",
  "dueTime": "Kullanıcı saat belirttiyse 'HH:mm' formatında (örn: '15:00', '20:30'), saat belirtilmemişse null",
  "hasSpecificTime": true/false (belirli bir saat söylendiyse true, sadece gün söylendiyse false),
  "reminderMinutesBefore": 15,
  "durationMinutes": 60,
  "notes": "Varsa görevin detay açıklaması veya 'Sesli komut ile eklendi'",
  "priority": "'critical' | 'high' | 'medium' | 'low'",
  "program": "'custom' | 'tubitak-yarisma' | 'cezeri-staj' | 'fergani-staj' | 'akbank-genai' | 'python-100-gun'",
  "eventType": "'meeting' | 'self-paced' | 'submission' | 'webinar' | 'workshop' | 'other'"
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1
        }
      });

      const responseText = response.text || '{}';
      let parsed = {};
      try {
        parsed = JSON.parse(responseText);
      } catch (err) {
        console.error('Failed to parse Gemini NLP JSON output:', responseText);
        return res.status(500).json({ error: 'Failed to parse AI output', raw: responseText });
      }

      return res.json({ success: true, parsed });
    } catch (error: any) {
      console.error('Error in /api/gemini/parse-voice-command:', error);
      return res.status(500).json({ error: error.message || 'Failed to parse voice command with Gemini' });
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
