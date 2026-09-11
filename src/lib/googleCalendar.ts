import { CalendarEvent } from '../types';

export interface GoogleCalendarEventPayload {
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{ method: string; minutes: number }>;
  };
}

export async function addEventToGoogleCalendar(
  accessToken: string,
  event: CalendarEvent
): Promise<{ id: string; htmlLink?: string }> {
  const isAllDay = event.allDay;
  const startIso = new Date(event.startDate).toISOString();
  const endIso = new Date(event.endDate || event.startDate).toISOString();

  const remMins = event.reminderMinutes !== undefined ? event.reminderMinutes : 30;

  const payload: GoogleCalendarEventPayload = {
    summary: event.title,
    description: event.description + (event.link ? `\n\nLink: ${event.link}` : ''),
    location: event.location || event.link || '',
    start: isAllDay
      ? { date: event.startDate.split('T')[0] }
      : { dateTime: startIso, timeZone: 'Europe/Istanbul' },
    end: isAllDay
      ? { date: event.endDate ? event.endDate.split('T')[0] : event.startDate.split('T')[0] }
      : { dateTime: endIso, timeZone: 'Europe/Istanbul' },
    reminders: remMins > 0
      ? {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: remMins },
            { method: 'email', minutes: remMins }
          ]
        }
      : { useDefault: false, overrides: [] }
  };

  const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Google Calendar API error (${response.status})`);
  }

  const data = await response.json();
  return { id: data.id, htmlLink: data.htmlLink };
}

export async function deleteEventFromGoogleCalendar(
  accessToken: string,
  googleEventId: string
): Promise<void> {
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${googleEventId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  if (!response.ok && response.status !== 404 && response.status !== 410) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Delete failed (${response.status})`);
  }
}

export async function listGoogleCalendarEvents(accessToken: string): Promise<any[]> {
  const now = new Date();
  const start = new Date(now.getFullYear(), 6, 1); // July 1st 2026
  const end = new Date(now.getFullYear(), 9, 31); // October 31st 2026
  
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(
      start.toISOString()
    )}&timeMax=${encodeURIComponent(end.toISOString())}&singleEvents=true`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Google Takvim etkinlikleri okunamadı (${response.status})`);
  }

  const data = await response.json();
  return data.items || [];
}
