import { CalendarEvent } from '../types';

/**
 * Export events array formatted specifically for Google Calendar CSV import
 */
export function exportEventsToGoogleCalendarCSV(events: CalendarEvent[], filename = 'kariyer_takvimi.csv') {
  const headers = ['Subject', 'Start Date', 'End Date', 'All Day Event', 'Description', 'Location'];

  const rows = events.map(e => {
    // Format date as MM/DD/YYYY for Google Calendar
    const startObj = new Date(e.startDate);
    const endObj = new Date(e.endDate || e.startDate);
    
    const formatGDate = (d: Date) => {
      if (isNaN(d.getTime())) return '';
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${mm}/${dd}/${yyyy}`;
    };

    const startDateStr = formatGDate(startObj);
    const endDateStr = formatGDate(endObj);
    const cleanDesc = (e.description || '').replace(/"/g, '""');
    const cleanTitle = (e.title || '').replace(/"/g, '""');
    const cleanLoc = (e.location || '').replace(/"/g, '""');

    return [
      `"${cleanTitle}"`,
      startDateStr,
      endDateStr,
      e.allDay ? 'True' : 'False',
      `"${cleanDesc}"`,
      `"${cleanLoc}"`
    ];
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export events array to a downloadable CSV file
 */
export function exportEventsToCSV(events: CalendarEvent[], filename = 'etkinlik-takvimi.csv') {
  const headers = ['ID', 'Başlık', 'Başlangıç Tarihi', 'Bitiş Tarihi', 'Tür', 'Program', 'Konum', 'Link', 'Zorunlu', 'Tamamlandı'];

  const rows = events.map(e => [
    `"${e.id}"`,
    `"${(e.title || '').replace(/"/g, '""')}"`,
    `"${e.startDate || ''}"`,
    `"${e.endDate || ''}"`,
    `"${e.type || ''}"`,
    `"${e.program || ''}"`,
    `"${(e.location || '').replace(/"/g, '""')}"`,
    `"${(e.link || '').replace(/"/g, '""')}"`,
    e.isMandatory ? 'Evet' : 'Hayır',
    e.completed ? 'Evet' : 'Hayır'
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export full JSON backup
 */
export function exportEventsToJSON(events: CalendarEvent[], filename = 'takvim-yedegi.json') {
  const jsonStr = JSON.stringify(events, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Helper to check if two events overlap in time
 */
export function checkEventOverlap(eventA: CalendarEvent, eventB: CalendarEvent): boolean {
  if (eventA.id === eventB.id) return false;
  if (!eventA.startDate || !eventB.startDate) return false;

  const startA = new Date(eventA.startDate).getTime();
  const endA = new Date(eventA.endDate || eventA.startDate).getTime();

  const startB = new Date(eventB.startDate).getTime();
  const endB = new Date(eventB.endDate || eventB.startDate).getTime();

  if (isNaN(startA) || isNaN(endA) || isNaN(startB) || isNaN(endB)) return false;

  return startA < endB && startB < endA;
}

/**
 * Format relative time distance e.g. "2 gün kaldı", "Bugün 19:00", "Günü geçti"
 */
export function getRelativeTimeText(startDateStr: string): { text: string; isPast: boolean; isToday: boolean; isSoon: boolean } {
  try {
    const now = new Date();
    const start = new Date(startDateStr);
    if (isNaN(start.getTime())) {
      return { text: '', isPast: false, isToday: false, isSoon: false };
    }

    const diffMs = start.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const isToday = now.toDateString() === start.toDateString();
    const isPast = diffMs < 0 && !isToday;
    const isSoon = diffHours > 0 && diffHours <= 24;

    if (isPast) {
      return { text: 'Günü Geçti', isPast: true, isToday: false, isSoon: false };
    }

    if (isToday) {
      const timeStr = start.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      return { text: `Bugün ${timeStr}`, isPast: false, isToday: true, isSoon: true };
    }

    if (diffDays === 1) {
      const timeStr = start.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      return { text: `Yarın ${timeStr}`, isPast: false, isToday: false, isSoon: true };
    }

    if (diffDays > 1) {
      return { text: `${diffDays} gün kaldı`, isPast: false, isToday: false, isSoon: false };
    }

    return { text: 'Yaklaşmakta', isPast: false, isToday: false, isSoon: true };
  } catch {
    return { text: '', isPast: false, isToday: false, isSoon: false };
  }
}
