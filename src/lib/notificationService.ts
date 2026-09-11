import { CalendarEvent } from '../types';

export type NotificationPermissionStatus = 'granted' | 'denied' | 'default' | 'unsupported';

export function getNotificationPermission(): NotificationPermissionStatus {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission as NotificationPermissionStatus;
}

export async function requestNotificationPermission(): Promise<NotificationPermissionStatus> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  
  try {
    const permission = await Notification.requestPermission();
    return permission as NotificationPermissionStatus;
  } catch (err) {
    console.error('Notification permission error:', err);
    return getNotificationPermission();
  }
}

/**
 * Plays a pleasant 2-tone notification sound using Web Audio API
 */
export function playNotificationSound() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    
    // Tone 1: 587.33 Hz (D5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    // Tone 2: 880 Hz (A5)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.12);
    gain2.gain.setValueAtTime(0.2, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.5);
  } catch (e) {
    console.warn('Audio play error:', e);
  }
}

/**
 * Sends a desktop notification if permission is granted
 */
export function sendDesktopNotification(
  title: string,
  options: {
    body: string;
    tag?: string;
    link?: string;
    playSound?: boolean;
  }
) {
  if (options.playSound !== false) {
    playNotificationSound();
  }

  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.warn('Desktop notifications not supported in this browser.');
    return null;
  }

  if (Notification.permission === 'granted') {
    try {
      const notification = new Notification(title, {
        body: options.body,
        tag: options.tag,
        icon: 'https://cdn-icons-png.flaticon.com/512/2693/2693507.png', // Calendar bell icon
        requireInteraction: true // Keeps notification visible until user interacts or dismisses
      });

      notification.onclick = () => {
        window.focus();
        if (options.link) {
          window.open(options.link, '_blank');
        }
        notification.close();
      };

      return notification;
    } catch (err) {
      console.error('Failed to create notification:', err);
    }
  }

  return null;
}

/**
 * Sends a test notification to verify system setup
 */
export async function sendTestNotification(): Promise<boolean> {
  let permission = getNotificationPermission();
  
  if (permission === 'default') {
    permission = await requestNotificationPermission();
  }

  if (permission === 'granted') {
    sendDesktopNotification('🔔 Hatırlatıcı Sistemi Aktif!', {
      body: 'Etkinliklerinize 15 dakika kala bu şekilde masaüstü bildirimi alacaksınız.',
      tag: 'test-notification',
      playSound: true
    });
    return true;
  }

  return false;
}

export interface ReminderCheckResult {
  newNotifiedIds: string[];
  notificationsSent: { event: CalendarEvent; minutesLeft: number }[];
}

/**
 * Checks events and triggers notifications for upcoming events within reminder window
 */
export function checkUpcomingEventReminders(
  events: CalendarEvent[],
  notifiedIdsSet: Set<string>
): ReminderCheckResult {
  const newNotifiedIds: string[] = [];
  const notificationsSent: { event: CalendarEvent; minutesLeft: number }[] = [];
  const now = new Date();

  events.forEach((event) => {
    if (event.completed) return;
    if (!event.startDate) return;

    const startDate = new Date(event.startDate);
    if (isNaN(startDate.getTime())) return;

    const diffMs = startDate.getTime() - now.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    // Target reminder window: default is 15 minutes before event (or event.reminderMinutes if specified)
    const reminderLeadMinutes = event.reminderMinutes || 15;

    // Check if event is starting soon (e.g. between 0 and reminderLeadMinutes)
    // We create a unique notification key per event and reminder window
    const notificationKey = `reminder_${event.id}_${reminderLeadMinutes}m`;

    if (!notifiedIdsSet.has(notificationKey)) {
      if (diffMinutes >= 0 && diffMinutes <= reminderLeadMinutes) {
        // Formatted start time string e.g. 15:30
        const timeStr = startDate.toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit'
        });

        const locationOrLink = event.location || event.link || 'Etkinlik Detayları';
        const minutesText = diffMinutes === 0 ? 'Şimdi başlıyor!' : `${diffMinutes} dakika kaldı!`;

        const title = `⏰ 15 DAKİKA KALA: ${event.title}`;
        const body = `Etkinlik ${timeStr} saatinde başlayacak (${minutesText})\n📍 ${locationOrLink}`;

        sendDesktopNotification(title, {
          body,
          tag: notificationKey,
          link: event.link,
          playSound: true
        });

        newNotifiedIds.push(notificationKey);
        notificationsSent.push({ event, minutesLeft: diffMinutes });
      }
    }
  });

  return { newNotifiedIds, notificationsSent };
}
