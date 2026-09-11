/**
 * Her Sabah 06:00 Cron Zamanlayıcı ve Brifing Motoru (morningBriefingCron.js)
 * Cron Tablo: 0 6 * * *
 */
import cron from 'node-cron';
import { sendMorningBriefingEmail } from './gmailService.js';

let cronTask = null;
let lastReport = null;

export async function executeMorningBriefing({
  accessToken,
  recipientEmail,
  localTasks = [],
  localEvents = [],
  forceDateStr
} = {}) {
  const now = new Date();
  const todayStr = forceDateStr || now.toISOString().split('T')[0];
  const targetEmail = recipientEmail || process.env.NOTIFICATION_EMAIL_TO || 'meriguclu123@gmail.com';

  console.log(`[06:00 CRON JS] Sabah Brifingi Tetiklendi -> ${todayStr}, Hedef: ${targetEmail}`);

  // a) Dünden kalan tamamlanmamış (status === 'needsAction') görevleri tespit et & devret
  const rolledOverTasks = [];
  const todayTasks = [];

  for (const task of localTasks) {
    const rawDue = task.due || task.dueDate;
    const taskDate = rawDue ? rawDue.split('T')[0] : null;
    const isCompleted = task.status === 'completed' || task.completed === true;

    if (taskDate && taskDate < todayStr && !isCompleted) {
      const originalDueDate = task.rolledOverFrom || taskDate;
      const rolled = {
        ...task,
        due: `${todayStr}T00:00:00.000Z`,
        dueDate: todayStr,
        isRolledOver: true,
        rolledOverFrom: originalDueDate,
        rolledOverCount: (task.rolledOverCount || 0) + 1,
        notes: task.notes ? `[Dünden Devredildi: ${originalDueDate}] ${task.notes}` : `[Dünden Devredildi: ${originalDueDate}]`
      };
      rolledOverTasks.push(rolled);
      todayTasks.push(rolled);
    } else if (taskDate === todayStr && !isCompleted) {
      todayTasks.push(task);
    }
  }

  // b) Bugünün Takvim Etkinlikleri
  const todayEvents = localEvents.filter(evt => {
    if (!evt.startDate) return false;
    return evt.startDate.split('T')[0] === todayStr;
  });

  // c) Kritik Proje Teslimatları
  const criticalDeliverables = [];
  localEvents.forEach(evt => {
    if (evt.isMandatory || evt.priority === 'critical' || evt.priority === 'high') {
      criticalDeliverables.push({
        title: evt.title,
        deadline: evt.startDate ? evt.startDate.split('T')[0] : undefined,
        program: evt.program
      });
    }
  });

  // d) E-posta Gönder
  const emailResult = await sendMorningBriefingEmail({
    recipientEmail: targetEmail,
    dateStr: todayStr,
    events: todayEvents,
    todayTasks,
    rolledOverTasks,
    criticalDeliverables: criticalDeliverables.slice(0, 5),
    accessToken
  });

  const report = {
    success: emailResult.success,
    timestamp: new Date().toISOString(),
    targetDate: todayStr,
    recipientEmail: targetEmail,
    eventsCount: todayEvents.length,
    todayTasksCount: todayTasks.length,
    rolledOverCount: rolledOverTasks.length,
    criticalDeliverablesCount: criticalDeliverables.length,
    message: emailResult.message
  };

  lastReport = report;
  return report;
}

export function initMorningBriefingCron() {
  if (cronTask) return;

  // 0 6 * * * = Her gün sabah 06:00
  cronTask = cron.schedule('0 6 * * *', async () => {
    console.log('[06:00 CRON JS] Saat 06:00 otomatik zamanlayıcı çalıştı!');
    try {
      await executeMorningBriefing({
        recipientEmail: process.env.NOTIFICATION_EMAIL_TO || 'meriguclu123@gmail.com'
      });
    } catch (err) {
      console.error('[06:00 CRON JS] Hata:', err);
    }
  });

  console.log('⏰ [06:00 CRON JS] Sabah Brifingi Zamanlayıcısı Aktif (Her sabah 06:00).');
}

export function getLastMorningBriefingReport() {
  return lastReport;
}
