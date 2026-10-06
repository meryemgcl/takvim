/**
 * routes/queueRoutes.ts
 * Asenkron gorev kuyrugu ve SSE yonetimi route'lari.
 * server.ts'den ayrilarak modüler hale getirildi.
 */
import { Router, Request, Response } from 'express';
import { asyncQueue, smartCache, sseManager } from '../src/server/asyncQueueManager';

const router = Router();

// SSE Canli Bildirim Akisi
router.get('/live-stream', (req: Request, res: Response) => {
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

// Webhook Kabul Noktasi (202 Accepted - UI bloklanmaz)
router.post('/webhook', (req: Request, res: Response) => {
  try {
    const payload = req.body || {};
    const source = payload.source || 'manual_webhook';
    const job = asyncQueue.enqueue(payload, source);

    return res.status(202).json({
      success: true,
      status: 'QUEUED',
      jobId: job.id,
      message: 'Is arka plan kuyruguna alindi.',
      timestamp: job.createdAt
    });
  } catch (err: any) {
    console.error('[QueueRoute] /webhook error:', err);
    return res.status(500).json({ error: err.message || 'Webhook kuyruga alinamadi.' });
  }
});

// Tum isleri listele
router.get('/jobs', (_req: Request, res: Response) => {
  return res.json({ success: true, jobs: asyncQueue.getAllJobs(), stats: asyncQueue.getStats() });
});

// Tekil is durumu
router.get('/jobs/:id', (req: Request, res: Response) => {
  const job = asyncQueue.getJob(req.params.id);
  if (!job) return res.status(404).json({ error: 'Is bulunamadi' });
  return res.json({ success: true, job });
});

// Kuyruk ve cache istatistikleri
router.get('/stats', (_req: Request, res: Response) => {
  return res.json({
    success: true,
    queueStats: asyncQueue.getStats(),
    cacheStats: smartCache.getStats(),
    recentNotifications: sseManager.getRecentNotifications()
  });
});

// Cache temizle
router.post('/clear-cache', (_req: Request, res: Response) => {
  smartCache.clear();
  return res.json({ success: true, message: 'Smart Cache sifirlandi.' });
});

export default router;