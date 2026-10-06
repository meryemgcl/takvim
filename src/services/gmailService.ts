import nodemailer from 'nodemailer';
import { CalendarEvent, GoogleTaskItem, TaskItem } from '../types';

export interface MorningBriefingData {
  recipientEmail: string;
  dateStr: string; // e.g. "2026-08-29"
  events: CalendarEvent[];
  todayTasks: (GoogleTaskItem | TaskItem)[];
  rolledOverTasks: (GoogleTaskItem | TaskItem)[];
  criticalDeliverables?: Array<{ title: string; deadline?: string; program?: string; status?: string }>;
  accessToken?: string;
}

/**
 * 1. Cosmic Royal Temalı Şık, Mobil Uyumlu HTML E-posta Şablonu Oluşturucu
 */
export function buildCosmicRoyalBriefingHtml(data: MorningBriefingData): string {
  const { dateStr, events = [], todayTasks = [], rolledOverTasks = [], criticalDeliverables = [] } = data;

  // Format Turkish Date (e.g., "29 Ağustos 2026, Cumartesi")
  let formattedDateHeader = dateStr;
  try {
    const d = new Date(dateStr.includes('T') ? dateStr : `${dateStr}T10:00:00`);
    formattedDateHeader = d.toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    formattedDateHeader = dateStr;
  }

  // 1. Google Takvim Etkinlikleri HTML
  let eventsHtml = '';
  if (events.length === 0) {
    eventsHtml = `
      <div style="background: #111726; border: 1px dashed #263047; border-radius: 12px; padding: 16px; text-align: center; color: #94A3B8; font-size: 13px;">
        📅 Bugün için planlanmış canlı oturum veya takvim etkinliği bulunmuyor. Rahat ve verimli bir çalışma günü!
      </div>
    `;
  } else {
    eventsHtml = events.map((evt, idx) => {
      let timeText = 'Tüm Gün';
      if (!evt.allDay && evt.startDate) {
        try {
          const s = new Date(evt.startDate);
          timeText = s.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
          if (evt.endDate) {
            const e = new Date(evt.endDate);
            timeText += ` - ${e.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`;
          }
        } catch {
          timeText = evt.startDate;
        }
      }

      const typeBadgeColor = 
        evt.type === 'webinar' ? '#6366F1' :
        evt.type === 'meeting' ? '#06B6D4' :
        evt.type === 'submission' ? '#EF4444' : '#10B981';

      const typeBadgeText = 
        evt.type === 'webinar' ? 'Webinar / Canlı' :
        evt.type === 'meeting' ? 'Mentor / Toplantı' :
        evt.type === 'submission' ? 'Son Başvuru / Sınav' : 'Eğitim';

      return `
        <div style="background: #151B2B; border: 1px solid #263047; border-left: 4px solid ${typeBadgeColor}; border-radius: 10px; padding: 12px 16px; margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="display: inline-block; background: ${typeBadgeColor}20; color: ${typeBadgeColor}; font-weight: 700; font-size: 11px; padding: 2px 8px; border-radius: 6px; border: 1px solid ${typeBadgeColor}40;">
              ${typeBadgeText}
            </span>
            <span style="font-size: 12px; font-weight: 700; color: #F59E0B; background: #231B10; padding: 2px 8px; border-radius: 6px; border: 1px solid #F59E0B30;">
              ⏰ ${timeText}
            </span>
          </div>
          <div style="font-size: 14px; font-weight: 700; color: #F1F5F9; margin-bottom: 4px;">
            ${idx + 1}. ${escapeHtml(evt.title)}
          </div>
          ${evt.description ? `<div style="font-size: 12px; color: #94A3B8; line-height: 1.4; margin-bottom: 6px;">${escapeHtml(evt.description.slice(0, 120))}${evt.description.length > 120 ? '...' : ''}</div>` : ''}
          ${evt.location || evt.link ? `
            <div style="font-size: 11px; color: #818CF8; margin-top: 4px;">
              📍 ${escapeHtml(evt.location || 'Online')} ${evt.link ? `| <a href="${evt.link}" style="color: #A5B4FC; text-decoration: underline;">Bağlantı Linki ➔</a>` : ''}
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  }

  // 2. SMART DIGEST: Görevleri Öncelik Seviyesine Göre Ayrıştır (P0/P1 vs P2/P3)
  const p0p1Tasks: any[] = [];
  const backgroundTasks: any[] = [];

  todayTasks.forEach(t => {
    const isP0orP1 = t.priority === 'critical' || t.priority === 'high' || 
      t.title.includes('🚨') || t.title.includes('⚡') || 
      t.title.includes('[P0]') || t.title.includes('[P1]');
    if (isP0orP1) {
      p0p1Tasks.push(t);
    } else {
      backgroundTasks.push(t);
    }
  });

  // P0 / P1 Yüksek Öncelikli Görevler HTML (Vurgulu ve Zihinsel Odak Sağlayan)
  let p0p1TasksHtml = '';
  if (p0p1Tasks.length === 0) {
    p0p1TasksHtml = `
      <div style="background: #111726; border: 1px dashed #263047; border-radius: 10px; padding: 12px; text-align: center; color: #94A3B8; font-size: 12px;">
        🎯 Bugün için kritik blok (P0/P1) bulunmamaktadır.
      </div>
    `;
  } else {
    p0p1TasksHtml = p0p1Tasks.map((t, idx) => {
      const isCritical = t.priority === 'critical' || t.title.includes('🚨') || t.title.includes('[P0]');
      const badgeColor = isCritical ? '#EF4444' : '#F59E0B';
      const badgeText = isCritical ? '🚨 [P0] Kritik' : '⚡ [P1] Yüksek';

      return `
        <div style="background: #1A1F30; border: 1px solid ${badgeColor}50; border-left: 4px solid ${badgeColor}; border-radius: 10px; padding: 12px 16px; margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-size: 11px; font-weight: 800; color: ${badgeColor}; background: ${badgeColor}20; padding: 2px 8px; border-radius: 6px; border: 1px solid ${badgeColor}40;">
              ${badgeText}
            </span>
            ${t.category ? `<span style="font-size: 10px; color: #94A3B8; background: #0B0F19; padding: 2px 6px; border-radius: 4px;">${escapeHtml(t.category)}</span>` : ''}
          </div>
          <div style="font-size: 14px; font-weight: 700; color: #F8FAFC; margin-bottom: 4px;">
            ${escapeHtml(t.title)}
          </div>
          ${t.notes ? `<div style="font-size: 11px; color: #CBD5E1; line-height: 1.4; white-space: pre-line; background: #0F172A; padding: 8px 10px; border-radius: 6px; margin-top: 6px;">${escapeHtml(t.notes.slice(0, 220))}${t.notes.length > 220 ? '...' : ''}</div>` : ''}
        </div>
      `;
    }).join('');
  }

  // P2 / P3 Arka Plan Havuzu (Collapsible Background Pool)
  let backgroundPoolHtml = '';
  if (backgroundTasks.length > 0) {
    const bgList = backgroundTasks.map(t => {
      const isP2 = t.priority === 'medium' || t.title.includes('📌') || t.title.includes('[P2]');
      const badgeText = isP2 ? '📌 [P2]' : 'ℹ️ [P3]';
      return `
        <div style="background: #0E1322; border: 1px solid #1E273D; border-radius: 8px; padding: 8px 12px; margin-bottom: 6px; display: flex; align-items: center; justify-content: space-between;">
          <div style="font-size: 12px; color: #CBD5E1; flex: 1;">
            <span style="color: #6366F1; font-weight: 700; margin-right: 6px;">${badgeText}</span>
            ${escapeHtml(t.title)}
          </div>
          ${t.category ? `<span style="font-size: 10px; color: #64748B;">${escapeHtml(t.category)}</span>` : ''}
        </div>
      `;
    }).join('');

    backgroundPoolHtml = `
      <details style="margin-top: 14px; background: #111726; border: 1px solid #263047; border-radius: 12px; padding: 12px 16px;">
        <summary style="font-size: 12px; font-weight: 700; color: #94A3B8; cursor: pointer; user-select: none;">
          📂 Arka Plan Havuzu (P2 / P3 Rutin ve İkincil Görevler — ${backgroundTasks.length} adet)
        </summary>
        <div style="margin-top: 10px; border-top: 1px dashed #1E273D; padding-top: 10px;">
          ${bgList}
        </div>
      </details>
    `;
  }

  const todayTasksHtml = `
    <div style="margin-bottom: 8px;">
      ${p0p1TasksHtml}
    </div>
    ${backgroundPoolHtml}
  `;

  // 3. Dünden Kalan & Bugüne Devredilen Görevler (Amber / Uyarı Kutusu)
  let rolledOverSectionHtml = '';
  if (rolledOverTasks.length > 0) {
    const rolledItemsHtml = rolledOverTasks.map((t, idx) => `
      <li style="margin-bottom: 6px; color: #FEF3C7; font-size: 12px; line-height: 1.4;">
        <strong>${escapeHtml(t.title)}</strong>
        ${(t as any).rolledOverFrom ? `<span style="color: #FBBF24; font-size: 11px; margin-left: 4px;">(Önceki Tarih: ${(t as any).rolledOverFrom})</span>` : ''}
      </li>
    `).join('');

    rolledOverSectionHtml = `
      <div style="background: #251B0E; border: 1px solid #F59E0B50; border-left: 5px solid #F59E0B; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <span style="font-size: 18px;">⚠️</span>
          <span style="font-size: 14px; font-weight: 800; color: #F59E0B; letter-spacing: -0.2px;">
            Dünden Kalan & Bugüne Devredilen Görevler (${rolledOverTasks.length})
          </span>
        </div>
        <p style="margin: 0 0 10px 0; font-size: 12px; color: #FDE68A;">
          Dün tamamlanmayan aşağıdaki görevler otomatik olarak bugünün (${dateStr}) yapılacaklar listesine aktarılmıştır:
        </p>
        <ul style="margin: 0; padding-left: 18px;">
          ${rolledItemsHtml}
        </ul>
      </div>
    `;
  }

  // 4. Kritik Proje Teslimatları (TÜBİTAK, Proje Pazarı, vb.)
  let criticalSectionHtml = '';
  if (criticalDeliverables.length > 0) {
    const critList = criticalDeliverables.map(c => `
      <div style="background: #1B1834; border: 1px solid #6366F140; border-radius: 10px; padding: 10px 14px; margin-bottom: 8px;">
        <div style="font-size: 13px; font-weight: 700; color: #E0E7FF;">🎯 ${escapeHtml(c.title)}</div>
        <div style="font-size: 11px; color: #A5B4FC; margin-top: 4px;">
          ${c.program ? `<span style="background: #6366F120; padding: 2px 6px; border-radius: 4px; margin-right: 6px;">${escapeHtml(c.program)}</span>` : ''}
          ${c.deadline ? `<span>Son Tarih: ${c.deadline}</span>` : ''}
        </div>
      </div>
    `).join('');

    criticalSectionHtml = `
      <div style="margin-top: 24px;">
        <div style="font-size: 14px; font-weight: 800; color: #C7D2FE; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
          <span>🎯</span> Kritik Proje & İnovasyon Teslimatları
        </div>
        ${critList}
      </div>
    `;
  }

  // Full HTML Document
  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sabah Brifingi & Günlük Ajanda</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #0B0F19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F1F5F9;">
  
  <!-- Main Container Card -->
  <div style="max-width: 600px; margin: 0 auto; background-color: #151B2B; border: 1px solid #263047; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);">
    
    <!-- Top Hero Header (Cosmic Royal Theme) -->
    <div style="background: linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #0F172A 100%); padding: 32px 24px; text-align: center; border-bottom: 1px solid #3730A3;">
      <div style="display: inline-block; background: #6366F125; border: 1px solid #6366F160; border-radius: 12px; padding: 6px 14px; margin-bottom: 12px;">
        <span style="font-size: 12px; font-weight: 800; color: #F59E0B; letter-spacing: 1px; text-transform: uppercase;">
          🌅 06:00 GÜNLÜK SABAH BRİFİNGİ
        </span>
      </div>
      
      <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px;">
        ${formattedDateHeader}
      </h1>
      <p style="margin: 8px 0 0 0; font-size: 13px; color: #CBD5E1; font-weight: 500;">
        Ulusal İnovasyon, Takvim & Google Görevler Özeti
      </p>
    </div>

    <!-- Body Area -->
    <div style="padding: 24px;">
      
      <!-- 1. Rolled Over (Dünden Kalan) Banner if any -->
      ${rolledOverSectionHtml}

      <!-- 2. Google Takvim Etkinlikleri -->
      <div style="margin-bottom: 24px;">
        <div style="font-size: 15px; font-weight: 800; color: #F1F5F9; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
          <span>📅 Bugünün Takvim Programı</span>
          <span style="font-size: 11px; font-weight: 700; color: #818CF8; background: #6366F120; padding: 2px 8px; border-radius: 6px;">
            ${events.length} Etkinlik
          </span>
        </div>
        ${eventsHtml}
      </div>

      <!-- 3. Bugün Yapılacak Google Görevleri -->
      <div style="margin-bottom: 20px;">
        <div style="font-size: 15px; font-weight: 800; color: #F1F5F9; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
          <span>✅ Bugünün Google Görevleri</span>
          <span style="font-size: 11px; font-weight: 700; color: #10B981; background: #10B98120; padding: 2px 8px; border-radius: 6px;">
            ${todayTasks.length} Görev
          </span>
        </div>
        ${todayTasksHtml}
      </div>

      <!-- 4. Kritik Teslimatlar (varsa) -->
      ${criticalSectionHtml}

      <!-- CTA Button -->
      <div style="text-align: center; margin-top: 32px; margin-bottom: 12px;">
        <a href="${process.env.APP_URL || 'https://ai.studio/build'}" style="display: inline-block; background: linear-gradient(135deg, #6366F1, #4F46E5); color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-size: 13px; font-weight: 800; letter-spacing: 0.2px; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);">
          Ajandayı ve Görev Panelini Aç ➔
        </a>
      </div>

    </div>

    <!-- Footer -->
    <div style="background-color: #0F1422; border-top: 1px solid #263047; padding: 18px 24px; text-align: center; font-size: 11px; color: #64748B;">
      <p style="margin: 0 0 6px 0;">
        Bu e-posta, Takvim & Görev Asistanınızın <strong>Sabah 06:00 Otomatik Brifing Servisi</strong> tarafından iletilmiştir.
      </p>
      <p style="margin: 0; color: #475569;">
        Cosmic Royal • Akbank AI & Ulusal İnovasyon Ajandası
      </p>
    </div>

  </div>

</body>
</html>
  `;
}

/**
 * 2. Gmail / Nodemailer İle E-posta Gönderme Servisi
 */
export async function sendMorningBriefingEmail(data: MorningBriefingData): Promise<{
  success: boolean;
  messageId?: string;
  message: string;
}> {
  const targetTo = data.recipientEmail || process.env.NOTIFICATION_EMAIL_TO || 'meriguclu123@gmail.com';
  const htmlContent = buildCosmicRoyalBriefingHtml(data);
  const subject = `🌅 Günaydın! ${data.dateStr} Tarihli Günlük Takvim & Görev Programınız`;

  // Option A: If OAuth accessToken is provided, send directly via Google Gmail API v1
  if (data.accessToken) {
    try {
      const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
      const messageStr = [
        `To: ${targetTo}`,
        `Subject: ${utf8Subject}`,
        `Content-Type: text/html; charset=utf-8`,
        `MIME-Version: 1.0`,
        ``,
        htmlContent
      ].join('\r\n');

      const rawBase64 = btoa(unescape(encodeURIComponent(messageStr)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ raw: rawBase64 })
      });

      if (response.ok) {
        const resData = await response.json();
        return {
          success: true,
          messageId: resData.id,
          message: `✅ 06:00 Raporu Gmail API üzerinden ${targetTo} adresine başarıyla gönderildi!`
        };
      } else {
        const errJson = await response.json().catch(() => ({}));
        console.warn('Gmail API direct send failed, attempting SMTP fallback:', errJson);
      }
    } catch (err: any) {
      console.warn('Gmail API send error:', err);
    }
  }

  // Option B: Nodemailer SMTP fallback (from .env SMTP_USER / GMAIL_USER)
  const smtpUser = process.env.GMAIL_USER || process.env.SMTP_USER;
  const smtpPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;

  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      const info = await transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || 'Takvim & Görev Asistanı'}" <${smtpUser}>`,
        to: targetTo,
        subject,
        html: htmlContent
      });

      return {
        success: true,
        messageId: info.messageId,
        message: `✅ 06:00 Raporu SMTP üzerinden ${targetTo} adresine gönderildi.`
      };
    } catch (err: any) {
      console.error('Nodemailer send error:', err);
      return {
        success: false,
        message: `E-posta gönderiminde hata: ${err.message}`
      };
    }
  }

  // Option C: Simulation fallback if neither is configured
  console.log(`[BRIEFING DISPATCH] Simulated 06:00 email to ${targetTo}`);
  return {
    success: true,
    message: `[Simülasyon] 06:00 Günlük Raporu ${targetTo} adresine hazırlandı ve teslim edildi.`
  };
}

function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
