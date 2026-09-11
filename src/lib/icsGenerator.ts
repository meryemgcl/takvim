import { CalendarEvent } from '../types';

function formatToICSDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => (n < 10 ? '0' + n : '' + n);
  const year = d.getUTCFullYear();
  const month = pad(d.getUTCMonth() + 1);
  const day = pad(d.getUTCDate());
  const hours = pad(d.getUTCHours());
  const minutes = pad(d.getUTCMinutes());
  const seconds = pad(d.getUTCSeconds());
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

function escapeICSText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

export function generateICSContent(events: CalendarEvent[]): string {
  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Akbank AI Training Calendar//TR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];

  events.forEach((event) => {
    const startICS = formatToICSDate(event.startDate);
    const endICS = formatToICSDate(event.endDate || event.startDate);
    
    ics.push('BEGIN:VEVENT');
    ics.push(`UID:akbank-ai-${event.id}-${Date.now()}@ais.app`);
    ics.push(`DTSTAMP:${formatToICSDate(new Date().toISOString())}`);
    ics.push(`DTSTART:${startICS}`);
    ics.push(`DTEND:${endICS}`);
    ics.push(`SUMMARY:${escapeICSText(event.title)}`);
    if (event.description) {
      ics.push(`DESCRIPTION:${escapeICSText(event.description)}`);
    }
    if (event.location || event.link) {
      ics.push(`LOCATION:${escapeICSText(event.location || event.link || '')}`);
    }
    if (event.link) {
      ics.push(`URL:${escapeICSText(event.link)}`);
    }

    const remMins = event.reminderMinutes !== undefined ? event.reminderMinutes : 30;
    if (remMins > 0) {
      ics.push('BEGIN:VALARM');
      ics.push('ACTION:DISPLAY');
      ics.push(`DESCRIPTION:Hatırlatma: ${escapeICSText(event.title)}`);
      ics.push(`TRIGGER:-PT${remMins}M`);
      ics.push('END:VALARM');
    }

    ics.push('STATUS:CONFIRMED');
    ics.push('END:VEVENT');
  });

  ics.push('END:VCALENDAR');
  return ics.join('\r\n');
}

export function downloadICSFile(events: CalendarEvent[], filename = 'akbank-ai-egitim-takvimi.ics') {
  const content = generateICSContent(events);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function buildGoogleCalendarUrl(event: CalendarEvent): string {
  const title = encodeURIComponent(event.title);
  const details = encodeURIComponent(event.description + (event.link ? `\n\nLink: ${event.link}` : ''));
  const location = encodeURIComponent(event.location || event.link || '');
  
  const startStr = formatToICSDate(event.startDate);
  const endStr = formatToICSDate(event.endDate || event.startDate);
  const dates = `${startStr}/${endStr}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}
