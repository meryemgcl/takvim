import cron, { ScheduledTask } from 'node-cron';
import { CalendarEvent, GoogleTaskItem, TaskItem } from '../types';
import { sendMorningBriefingEmail, MorningBriefingData } from './gmailService';
import { sseManager } from '../server/asyncQueueManager';

export interface MorningBriefingExecutionParams {
  accessToken?: string;
  recipientEmail?: string;
  localTasks?: (GoogleTaskItem | TaskItem)[];
  localEvents?: CalendarEvent[];
  forceDateStr?: string; // e.g. "2026-08-29"
}

export interface MorningBriefingReport {
  success: boolean;
  timestamp: string;
  targetDate: string;
  recipientEmail: string;
  eventsCount: number;
  todayTasksCount: number;
  rolledOverCount: number;
  criticalDeliverablesCount: number;
  message: string;
}

let lastReport: MorningBriefingReport | null = null;
let cronTask: ScheduledTask | null = null;

/**
 * 1. Sabah 06:00 Günlük Brifing & Otomatik Devir Yürütme Motoru
 * (Hem Cron hem de "Test Et" butonu bu fonksiyonu tetikler)
 */
export async function executeMorningBriefing(
  params: MorningBriefingExecutionParams = {}
): Promise<MorningBriefingReport> {
  const now = new Date();
  const todayStr = params.forceDateStr || now.toISOString().split('T')[0];
  const targetEmail = params.recipientEmail || process.env.NOTIFICATION_EMAIL_TO || 'meriguclu123@gmail.com';

  console.log(`[06:00 CRON] Sabah Brifingi Tetiklendi -> Tarih: ${todayStr}, Hedef: ${targetEmail}`);

  const allTasks = params.localTasks || [];
  const allEvents = params.localEvents || [];

  // a) Dünden kalan tamamlanmamış (status === 'needsAction') görevleri tespit et & devret
  const rolledOverTasks: (GoogleTaskItem | TaskItem)[] = [];
  const todayTasks: (GoogleTaskItem | TaskItem)[] = [];

  for (const task of allTasks) {
    const rawDue = (task as any).due || (task as any).dueDate;
    const taskDate = rawDue ? rawDue.split('T')[0] : null;
    const isCompleted = (task as any).status === 'completed' || (task as any).completed === true;

    // Dünden kalan ve bitirilmemiş görevler
    if (taskDate && taskDate < todayStr && !isCompleted) {
      const originalDueDate = (task as any).rolledOverFrom || taskDate;
      const count = ((task as any).rolledOverCount || 0) + 1;

      const rolled: any = {
        ...task,
        due: `${todayStr}T00:00:00.000Z`,
        dueDate: todayStr,
        isRolledOver: true,
        rolledOverFrom: originalDueDate,
        rolledOverCount: count,
        notes: (task as any).notes 
          ? `[Dünden Devredildi: ${originalDueDate}] ${(task as any).notes}`
          : `[Dünden Devredildi: ${originalDueDate}]`
      };

      rolledOverTasks.push(rolled);
      todayTasks.push(rolled);
    } else if (taskDate === todayStr && !isCompleted) {
      todayTasks.push(task);
    }
  }

  // b) Bugünün (00:00 - 23:59) Takvim Etkinliklerini filtrele
  const todayEvents = allEvents.filter(evt => {
    if (!evt.startDate) return false;
    const eventDate = evt.startDate.split('T')[0];
    return eventDate === todayStr;
  });

  // c) Kritik Proje & Kariyer Teslimatlarını tespit et
  const criticalDeliverables: Array<{ title: string; deadline?: string; program?: string }> = [];
  allEvents.forEach(evt => {
    if (evt.isMandatory || evt.priority === 'critical' || evt.priority === 'high') {
      criticalDeliverables.push({
        title: evt.title,
        deadline: evt.startDate ? evt.startDate.split('T')[0] : undefined,
        program: evt.program
      });
    }
  });

  // d) E-posta Verisini Hazırla ve Gmail Servisiyle Fırlat
  const briefingData: MorningBriefingData = {
    recipientEmail: targetEmail,
    dateStr: todayStr,
    events: todayEvents,
    todayTasks,
    rolledOverTasks,
    criticalDeliverables: criticalDeliverables.slice(0, 5),
    accessToken: params.accessToken
  };

  const emailResult = await sendMorningBriefingEmail(briefingData);

  const report: MorningBriefingReport = {
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

  // TYPE_3: [MORNING_BRIEFING] "🌅 Sabah 06:00 Brifingi: Günün kritik P0 planı hazır."
  sseManager.broadcast({
    type: 'MORNING_BRIEFING',
    message: '🌅 Sabah 06:00 Brifingi: Günün kritik P0 planı hazır.',
    timestamp: new Date().toISOString(),
    data: {
      report,
      criticalCount: criticalDeliverables.length,
      todayTasksCount: todayTasks.length
    }
  });

  // Eğer devredilen görev varsa TYPE_2 bildirimini de yayınla
  if (rolledOverTasks.length > 0) {
    sseManager.broadcast({
      type: 'ROLLOVER_COMPLETED',
      message: `↩️ Görev Devri: ${rolledOverTasks.length} adet dün görevi bugüne taşındı.`,
      timestamp: new Date().toISOString(),
      data: {
        rolledCount: rolledOverTasks.length
      }
    });
  }

  lastReport = report;
  return report;
}

/**
 * 2. Her Sabah 06:00'da Otomatik Çalışacak Cron Zamanlayıcısını Başlat (0 6 * * *)
 */
export function initMorningBriefingCron(): void {
  if (cronTask) {
    console.log('[06:00 CRON] Cron servisi zaten aktif.');
    return;
  }

  // Her gün sabah 06:00: '0 6 * * *'
  cronTask = cron.schedule('0 6 * * *', async () => {
    console.log('[06:00 CRON] Saat 06:00 otomatik zamanlayıcı çalıştı!');
    try {
      await executeMorningBriefing({
        recipientEmail: process.env.NOTIFICATION_EMAIL_TO || 'meriguclu123@gmail.com'
      });
    } catch (err) {
      console.error('[06:00 CRON] Sabah brifingi gönderilirken hata oluştu:', err);
    }
  });

  console.log('⏰ [06:00 CRON] Sabah Brifingi Zamanlayıcısı Aktif Edildi (Her sabah saat 06:00).');
}

/**
 * Son çalışma raporunu döndürür
 */
export function getLastMorningBriefingReport(): MorningBriefingReport | null {
  return lastReport;
}
