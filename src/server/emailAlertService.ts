import nodemailer from 'nodemailer';
import { TaskItem } from '../types';

let transporterInstance: nodemailer.Transporter | null = null;

export function getEmailTransporter(): nodemailer.Transporter | null {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    // If SMTP credentials not provided, return null for graceful fallback
    return null;
  }

  if (!transporterInstance) {
    transporterInstance = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass
      }
    });
  }

  return transporterInstance;
}

export interface SendRolloverEmailParams {
  recipientEmail?: string;
  rolledOverTasks: TaskItem[];
  currentDateStr: string;
}

/**
 * 3. E-Posta Bildirim Servisi: Ertelenen görevleri şık HTML şablonla kullanıcıya iletir
 */
export async function sendRolloverNotificationEmail({
  recipientEmail,
  rolledOverTasks,
  currentDateStr
}: SendRolloverEmailParams): Promise<{ sent: boolean; message: string }> {
  const targetTo = recipientEmail || process.env.NOTIFICATION_EMAIL_TO || 'meriguclu123@gmail.com';
  const count = rolledOverTasks.length;

  if (count === 0) {
    return { sent: false, message: 'Devredilen görev bulunmadığı için e-posta gönderilmedi.' };
  }

  const transporter = getEmailTransporter();

  const taskListHtml = rolledOverTasks
    .map(
      (task, idx) => `
      <li style="margin-bottom: 10px; padding: 10px 14px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #f59e0b; list-style: none;">
        <div style="font-weight: 700; color: #1e293b; font-size: 14px;">
          ${idx + 1}. ${escapeHtml(task.title)}
        </div>
        <div style="font-size: 12px; color: #64748b; margin-top: 4px;">
          ${task.category ? `<span style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-weight: 600; color: #475569;">${escapeHtml(task.category)}</span>` : ''}
          ${task.rolledOverFrom ? `<span style="color: #d97706; margin-left: 6px; font-weight: 600;">Eski Tarih: ${task.rolledOverFrom} ➔ Yeni Tarih: ${currentDateStr}</span>` : ''}
          ${task.priority ? `<span style="color: #6366f1; margin-left: 6px;">[Öncelik: ${task.priority.toUpperCase()}]</span>` : ''}
        </div>
      </li>
    `
    )
    .join('');

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Günlük Görev Devir Bildirimi</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; margin: 0; padding: 24px; color: #334155;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.15);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e1b4b, #312e81, #0f172a); padding: 28px 24px; color: #ffffff; text-align: center;">
          <div style="font-size: 32px; margin-bottom: 8px;">🔁 📋</div>
          <h1 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">
            Günlük Görev Devir Raporu
          </h1>
          <p style="margin: 8px 0 0 0; font-size: 13px; color: #cbd5e1;">
            ${currentDateStr} Tarihli Otomatik Senkronizasyon ve Rollover
          </p>
        </div>

        <!-- Body Content -->
        <div style="padding: 28px 24px;">
          <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 14px 18px; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 14px; color: #92400e; font-weight: 600;">
              ⚠️ Dün tamamlanmayan <strong>${count} adet görev</strong> bugünün (${currentDateStr}) yapılacaklar listesine devredildi.
            </p>
          </div>

          <h3 style="font-size: 15px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 12px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">
            Bugüne Aktarılan Görevler:
          </h3>

          <ul style="padding-left: 0; margin: 0 0 24px 0;">
            ${taskListHtml}
          </ul>

          <div style="text-align: center; margin-top: 24px;">
            <a href="${process.env.APP_URL || 'https://ai.studio/build'}" style="display: inline-block; background: #4f46e5; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 700; font-size: 13px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);">
              Takvimi ve Görev Panelini Aç ➔
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #f8fafc; padding: 16px 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8;">
          Bu bilgilendirme e-postası Takvim & Notion Otomatik Devir (Rollover) sistemi tarafından otomatik olarak oluşturulmuştur.
        </div>
      </div>
    </body>
    </html>
  `;

  if (!transporter) {
    console.log(`[EMAIL SIMULATION] SMTP not configured. Would send email to: ${targetTo}`);
    console.log(`[EMAIL SIMULATION] Content: Dün tamamlanmayan ${count} adet görev bugüne devredildi:`, rolledOverTasks.map(t => t.title));
    return {
      sent: true,
      message: `[Simülasyon / Konsol] SMTP bilgileri girilmediği için bildirim simüle edildi. ${count} görev başarıyla raporlandı.`
    };
  }

  try {
    const fromName = process.env.EMAIL_FROM_NAME || 'Takvim & Görev Asistanı';
    const fromAddress = process.env.SMTP_USER || 'no-reply@takvim-asistani.local';

    await transporter.sendMail({
      from: `"${fromName}" <${fromAddress}>`,
      to: targetTo,
      subject: `🔁 Hatırlatma: Dünden ${count} adet tamamlanmamış görev bugüne aktarıldı! (${currentDateStr})`,
      html: emailHtml
    });

    return {
      sent: true,
      message: `${targetTo} adresine ${count} devredilen görev için bildirim e-postası başarıyla gönderildi.`
    };
  } catch (error: any) {
    console.error('Failed to send rollover notification email:', error);
    return {
      sent: false,
      message: `E-posta gönderiminde hata: ${error.message || error}`
    };
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
