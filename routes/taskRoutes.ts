/**
 * routes/taskRoutes.ts
 * Gorev gecmisi, senkronizasyon ve rollover route'lari.
 * server.ts'den ayrilarak modüler hale getirildi.
 */
import { Router, Request, Response } from 'express';
import { executeTaskRolloverSync } from '../src/server/taskSyncCron';
import { loadTaskDataset, syncTasksToPersistentHistory } from '../src/server/taskHistoryStore';
import { sendRolloverNotificationEmail } from '../src/server/emailAlertService';

const router = Router();

// Kalici gorev gecmisini oku
router.get('/history', (_req: Request, res: Response) => {
  try {
    const dataset = loadTaskDataset();
    return res.json({ success: true, dataset });
  } catch (error: any) {
    console.error('[TaskRoute] /history error:', error);
    return res.status(500).json({ error: error.message || 'Gorev gecmisi yuklenemedi.' });
  }
});

// Idempotent gorev senkronizasyonu
router.post('/history/sync', (req: Request, res: Response) => {
  try {
    const { tasks } = req.body;
    if (!Array.isArray(tasks)) {
      return res.status(400).json({ error: 'tasks dizisi zorunludur.' });
    }
    const updatedDataset = syncTasksToPersistentHistory(tasks);
    return res.json({
      success: true,
      message: `${tasks.length} gorev senkronize edildi.`,
      dataset: updatedDataset
    });
  } catch (error: any) {
    console.error('[TaskRoute] /history/sync error:', error);
    return res.status(500).json({ error: error.message || 'Senkronizasyon basarisiz.' });
  }
});

// Dashboard canli ilerleme ozeti
router.get('/snapshot', (_req: Request, res: Response) => {
  try {
    const dataset = loadTaskDataset();
    const highPriority = dataset.activeTasks.filter(t =>
      t.priority === 'critical' || t.priority === 'high'
    );
    const rolledOver = dataset.activeTasks.filter(t => t.isRolledOver);

    return res.json({
      success: true,
      stats: dataset.stats,
      lastUpdated: dataset.lastUpdated,
      activeHighPriority: highPriority,
      carriedOverTasks: rolledOver,
      archivedCount: dataset.archivedCompletedTasks.length,
      auditLogCount: dataset.auditLogs.length
    });
  } catch (error: any) {
    console.error('[TaskRoute] /snapshot error:', error);
    return res.status(500).json({ error: error.message || 'Snapshot alinaamdi.' });
  }
});

// Gunluk rollover senkronizasyonu
router.post('/rollover-sync', async (req: Request, res: Response) => {
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
    console.error('[TaskRoute] /rollover-sync error:', error);
    return res.status(500).json({ error: error.message || 'Rollover basarisiz.' });
  }
});

// Test e-posta bildirimi
router.post('/email/test-alert', async (req: Request, res: Response) => {
  try {
    const { recipientEmail, sampleTasks } = req.body;
    const tasksToSend = sampleTasks || [{
      id: 'test-1',
      title: 'Test Gorevi',
      priority: 'high',
      completed: false,
      dueDate: new Date().toISOString().split('T')[0]
    }];
    const result = await sendRolloverNotificationEmail({
      recipientEmail,
      rolledOverTasks: tasksToSend,
      currentDateStr: new Date().toISOString().split('T')[0]
    });
    return res.json({ success: result.sent, message: result.message });
  } catch (error: any) {
    console.error('[TaskRoute] /email/test-alert error:', error);
    return res.status(500).json({ error: error.message || 'E-posta gonderilemedi.' });
  }
});

export default router;