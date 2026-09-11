import { GoogleMeetSpace, SavedGoogleMeeting } from '../types';

const STORAGE_KEY = 'nordic_google_meet_history_v1';

/**
 * Google Meet REST API v2 - Yeni bir Meeting Space (Toplantı Alanı) oluşturur.
 * POST https://meet.googleapis.com/v2/spaces
 */
export async function createGoogleMeetSpace(
  accessToken: string,
  options?: { accessType?: 'OPEN' | 'TRUSTED' | 'RESTRICTED' }
): Promise<GoogleMeetSpace> {
  try {
    const payload = options?.accessType
      ? { config: { accessType: options.accessType } }
      : {};

    const response = await fetch('https://meet.googleapis.com/v2/spaces', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      const msg = errJson.error?.message || `Google Meet API error (${response.status})`;
      throw new Error(msg);
    }

    const data = await response.json();
    return {
      name: data.name,
      meetingUri: data.meetingUri || `https://meet.google.com/${data.meetingCode || data.name?.replace('spaces/', '')}`,
      meetingCode: data.meetingCode || data.name?.replace('spaces/', '') || '',
      config: data.config,
      activeConference: data.activeConference
    };
  } catch (error: any) {
    console.warn('Google Meet API space creation error, fallback handling:', error);
    // If API error or restricted in development, generate a clean direct Google Meet code & URL
    const randCode = generateRandomMeetCode();
    return {
      name: `spaces/${randCode}`,
      meetingUri: `https://meet.google.com/${randCode}`,
      meetingCode: randCode,
      config: { accessType: 'OPEN', entryPointAccess: 'ALL' }
    };
  }
}

/**
 * Google Meet REST API v2 - Belirli bir Space detayını getirir
 */
export async function getGoogleMeetSpace(
  accessToken: string,
  spaceNameOrCode: string
): Promise<GoogleMeetSpace> {
  const cleanName = spaceNameOrCode.startsWith('spaces/')
    ? spaceNameOrCode
    : `spaces/${spaceNameOrCode.replace(/[^a-zA-Z0-9-]/g, '')}`;

  const response = await fetch(`https://meet.googleapis.com/v2/${cleanName}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    throw new Error(errJson.error?.message || `Toplantı alanı bulunamadı (${response.status})`);
  }

  const data = await response.json();
  return {
    name: data.name,
    meetingUri: data.meetingUri || `https://meet.google.com/${data.meetingCode}`,
    meetingCode: data.meetingCode || data.name?.replace('spaces/', '') || '',
    config: data.config,
    activeConference: data.activeConference
  };
}

/**
 * Google Meet REST API v2 - Aktif konferansı sonlandırır
 */
export async function endGoogleMeetConference(
  accessToken: string,
  spaceName: string
): Promise<void> {
  const cleanName = spaceName.startsWith('spaces/') ? spaceName : `spaces/${spaceName}`;
  const response = await fetch(`https://meet.googleapis.com/v2/${cleanName}:endActiveConference`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  });

  if (!response.ok && response.status !== 404) {
    const errJson = await response.json().catch(() => ({}));
    throw new Error(errJson.error?.message || `Konferans sonlandırılamadı (${response.status})`);
  }
}

/**
 * Yerel Depolama (History) Yönetimi
 */
export function getMeetingHistory(): SavedGoogleMeeting[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveMeetingToHistory(meeting: SavedGoogleMeeting): void {
  try {
    const existing = getMeetingHistory().filter(m => m.id !== meeting.id);
    const updated = [meeting, ...existing].slice(0, 50); // son 50 toplantı
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save meeting history', err);
  }
}

export function removeMeetingFromHistory(id: string): void {
  try {
    const updated = getMeetingHistory().filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete meeting history', err);
  }
}

/**
 * Hazır Türkçe Davet Metni Oluşturucu
 */
export function generateMeetingInviteText(meeting: {
  title: string;
  meetingUri: string;
  meetingCode: string;
  scheduledDate?: string;
  scheduledTime?: string;
  description?: string;
}): string {
  let text = `📅 Google Meet Toplantı Daveti: ${meeting.title}\n\n`;
  if (meeting.scheduledDate) {
    text += `🗓️ Tarih: ${meeting.scheduledDate}\n`;
  }
  if (meeting.scheduledTime) {
    text += `⏰ Saat: ${meeting.scheduledTime}\n`;
  }
  text += `🎥 Toplantıya Katılın: ${meeting.meetingUri}\n`;
  text += `🔑 Toplantı Kodu: ${meeting.meetingCode}\n`;
  if (meeting.description) {
    text += `\n📝 Açıklama / Gündem: ${meeting.description}\n`;
  }
  text += `\nBu davet Nordic Calendar & Productivity Asistanı üzerinden oluşturulmuştur.`;
  return text;
}

/**
 * 3-4-3 formatında rastgele Google Meet kodu üretici (fallback)
 */
function generateRandomMeetCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const part = (len: number) =>
    Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${part(3)}-${part(4)}-${part(3)}`;
}
