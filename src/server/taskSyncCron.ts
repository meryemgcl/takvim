import { GoogleTaskItem, TaskItem, RolloverReport } from '../types';
import { sendRolloverNotificationEmail } from './emailAlertService';
import { sseManager } from './asyncQueueManager';

export interface ExecuteRolloverParams {
  localTasks?: (TaskItem | GoogleTaskItem)[];
  targetTodayDate?: string; // YYYY-MM-DD (defaults to local today)
  recipientEmail?: string;
  sendEmail?: boolean;
}

/**
 * GÜNLÜK OTOMATİK DEVİR (ROLLOVER) VE KONTROL MANTIĞI (Backend Handler)
 */
export async function executeTaskRolloverSync({
  localTasks = [],
  targetTodayDate,
  recipientEmail,
  sendEmail = true
}: ExecuteRolloverParams): Promise<RolloverReport> {
  const now = new Date();
  const todayStr = targetTodayDate || now.toISOString().split('T')[0];

  const rolledOverTasks: any[] = [];
  const updatedAllTasks: any[] = [];

  for (const task of localTasks) {
    const rawDue = (task as any).due || (task as any).dueDate;
    const taskDate = rawDue ? rawDue.split('T')[0] : null;
    const isCompleted = (task as any).status === 'completed' || (task as any).completed === true;

    // Check if task is overdue and uncompleted
    if (taskDate && taskDate < todayStr && !isCompleted) {
      const originalDueDate = (task as any).rolledOverFrom || taskDate;
      const count = ((task as any).rolledOverCount || 0) + 1;

      const rolledTask = {
        ...task,
        due: `${todayStr}T00:00:00.000Z`,
        dueDate: todayStr,
        isRolledOver: true,
        rolledOverFrom: originalDueDate,
        rolledOverCount: count
      };

      rolledOverTasks.push(rolledTask);
      updatedAllTasks.push(rolledTask);
    } else {
      updatedAllTasks.push(task);
    }
  }

  // Send email alert if there are rolled-over tasks
  let emailSent = false;
  if (rolledOverTasks.length > 0 && sendEmail) {
    const emailResult = await sendRolloverNotificationEmail({
      recipientEmail: recipientEmail || process.env.NOTIFICATION_EMAIL_TO,
      rolledOverTasks,
      currentDateStr: todayStr
    });
    emailSent = emailResult.sent;
  }

  // TYPE_2: [ROLLOVER_COMPLETED] "↩️ Görev Devri: {Sayı} adet dün görevi bugüne taşındı."
  const count = rolledOverTasks.length;
  sseManager.broadcast({
    type: 'ROLLOVER_COMPLETED',
    message: `↩️ Görev Devri: ${count} adet dün görevi bugüne taşındı.`,
    timestamp: new Date().toISOString(),
    data: {
      rolledOverCount: count,
      targetDate: todayStr
    }
  });

  return {
    timestamp: new Date().toISOString(),
    targetDate: todayStr,
    rolledOverTasks,
    googleTasksSyncedCount: rolledOverTasks.length,
    emailSent,
    emailRecipient: recipientEmail || process.env.NOTIFICATION_EMAIL_TO || 'meriguclu123@gmail.com',
    message: rolledOverTasks.length > 0
      ? `Dünden ${rolledOverTasks.length} adet tamamlanmamış görev başarıyla bugüne (${todayStr}) devredildi.`
      : 'Devredilecek geçmiş tarihli tamamlanmamış görev bulunamadı.'
  };
}
