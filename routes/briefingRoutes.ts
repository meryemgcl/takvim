/**
 * routes/briefingRoutes.ts
 * Sabah brifingi (morning briefing) route'lari.
 * server.ts'den ayrilarak modüler hale getirildi.
 */
import { Router, Request, Response } from 'express';
import {
  executeMorningBriefing,
  getLastMorningBriefingReport
} from '../src/services/morningBriefingCron';

const router = Router();

// Manuel sabah brifingi tetikle
router.post('/trigger', async (req: Request, res: Response) => {
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
    console.error('[BriefingRoute] /trigger error:', error);
    return res.status(500).json({ error: error.message || 'Sabah brifingi baslatılamadi.' });
  }
});

// Son brifing durumu
router.get('/status', (_req: Request, res: Response) => {
  return res.json({
    cronSchedule: '0 6 * * * (Her sabah saat 06:00)',
    lastReport: getLastMorningBriefingReport()
  });
});

export default router;