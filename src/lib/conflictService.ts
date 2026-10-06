import { CalendarEvent } from '../types';

export interface EventConflictPair {
  eventA: CalendarEvent;
  eventB: CalendarEvent;
  overlapMinutes: number;
  recommendation?: string;
  recommendedEvent?: CalendarEvent;
  secondaryEvent?: CalendarEvent;
}

/**
 * Intelligent Conflict Resolver:
 * Evaluates overlapping events to recommend which one to attend live vs watch later.
 * Specifically checks for interactive meetings (Google Meet, Zoom, Teams, Mentor, Mülakat)
 * vs recorded broadcasts (YouTube, webinars).
 */
export function resolveConflictRecommendation(
  eventA: CalendarEvent,
  eventB: CalendarEvent
): {
  recommendation: string;
  recommendedEvent: CalendarEvent;
  secondaryEvent: CalendarEvent;
} {
  const isInteractive = (ev: CalendarEvent) => {
    const text = `${ev.title} ${ev.location || ''} ${ev.link || ''} ${ev.description || ''}`.toLowerCase();
    return (
      text.includes('meet') ||
      text.includes('zoom') ||
      text.includes('teams') ||
      text.includes('mentor') ||
      text.includes('mülakat') ||
      text.includes('interview') ||
      ev.type === 'meeting'
    );
  };

  const isStreamOrRecorded = (ev: CalendarEvent) => {
    const text = `${ev.title} ${ev.location || ''} ${ev.link || ''} ${ev.description || ''}`.toLowerCase();
    return (
      text.includes('youtube') ||
      text.includes('webinar') ||
      text.includes('canlı yayın') ||
      text.includes('kaydı') ||
      ev.type === 'webinar'
    );
  };

  const aIsInteractive = isInteractive(eventA);
  const bIsInteractive = isInteractive(eventB);
  const aIsStream = isStreamOrRecorded(eventA);
  const bIsStream = isStreamOrRecorded(eventB);

  // Case 1: One is interactive (Meet/Mentor), one is YouTube/Stream
  if (aIsInteractive && bIsStream) {
    return {
      recommendedEvent: eventA,
      secondaryEvent: eventB,
      recommendation: `💡 Canlı Katılım Önerisi: "${eventA.title}" interaktif soru-cevap ve mentorluk barındırdığından canlı katılmanız önceliklidir. "${eventB.title}" etkinliği YouTube yayını olduğu ve sonradan kaydı izlenebildiği için daha sonra asenkron takip edilebilir.`
    };
  }

  if (bIsInteractive && aIsStream) {
    return {
      recommendedEvent: eventB,
      secondaryEvent: eventA,
      recommendation: `💡 Canlı Katılım Önerisi: "${eventB.title}" interaktif soru-cevap ve mentorluk barındırdığından canlı katılmanız önceliklidir. "${eventA.title}" etkinliği YouTube yayını olduğu ve sonradan kaydı izlenebildiği için daha sonra asenkron takip edilebilir.`
    };
  }

  // Case 2: Priority P0 vs P1
  const getPriorityWeight = (ev: CalendarEvent): number => {
    const title = ev.title.toLowerCase();
    if (title.includes('[p0]') || ev.priority === 'critical' || title.includes('mülakat')) return 4;
    if (title.includes('[p1]') || ev.priority === 'high' || ev.isMandatory) return 3;
    if (title.includes('[p2]') || ev.priority === 'medium') return 2;
    return 1;
  };

  const weightA = getPriorityWeight(eventA);
  const weightB = getPriorityWeight(eventB);

  if (weightA > weightB) {
    return {
      recommendedEvent: eventA,
      secondaryEvent: eventB,
      recommendation: `🚨 Öncelik Tavsiyesi: "${eventA.title}" [P0/Zorunlu] kritik aşama olduğu için canlı katılım şarttır. "${eventB.title}" oturumunu alternatif zamana planlayınız.`
    };
  } else if (weightB > weightA) {
    return {
      recommendedEvent: eventB,
      secondaryEvent: eventA,
      recommendation: `🚨 Öncelik Tavsiyesi: "${eventB.title}" [P0/Zorunlu] kritik aşama olduğu için canlı katılım şarttır. "${eventA.title}" oturumunu alternatif zamana planlayınız.`
    };
  }

  // Default fallback
  return {
    recommendedEvent: eventA,
    secondaryEvent: eventB,
    recommendation: `⚠️ Eşit Öncelikli Çakışma: İki oturum da aynı saatte. "${eventA.title}" etkinliğine katılıp "${eventB.title}" için kayıt veya not talep edilmesi önerilir.`
  };
}

/**
 * Detects all genuine conflicting (overlapping fixed-time) events in the user's event list.
 * Ignores allDay events, self-paced video courses, and multi-day windows (>24 hours).
 */
export function detectEventConflicts(events: CalendarEvent[]): EventConflictPair[] {
  const conflicts: EventConflictPair[] = [];
  
  // Filter only concrete scheduled live events with real time slots
  const scheduledEvents = events.filter(e => {
    if (!e.startDate || e.completed) return false;
    if (e.allDay) return false;
    if (e.type === 'self-paced') return false;
    
    // Check duration - ignore spans longer than 24 hours (milestones / submission windows)
    const s = new Date(e.startDate).getTime();
    const end = new Date(e.endDate || e.startDate).getTime();
    if (isNaN(s) || isNaN(end)) return false;
    const durationHours = (end - s) / (1000 * 60 * 60);
    if (durationHours > 24) return false;

    return true;
  });

  for (let i = 0; i < scheduledEvents.length; i++) {
    for (let j = i + 1; j < scheduledEvents.length; j++) {
      const eA = scheduledEvents[i];
      const eB = scheduledEvents[j];

      // Must be on the same calendar day to be a schedule conflict
      const dayA = eA.startDate.split('T')[0];
      const dayB = eB.startDate.split('T')[0];
      if (dayA !== dayB) continue;

      const startA = new Date(eA.startDate).getTime();
      const endA = new Date(eA.endDate || eA.startDate).getTime();

      const startB = new Date(eB.startDate).getTime();
      const endB = new Date(eB.endDate || eB.startDate).getTime();

      // Check overlap
      const maxStart = Math.max(startA, startB);
      const minEnd = Math.min(endA, endB);

      if (maxStart < minEnd) {
        const overlapMinutes = Math.round((minEnd - maxStart) / (1000 * 60));
        // Only consider meaningful overlaps (> 5 minutes)
        if (overlapMinutes > 5) {
          const rec = resolveConflictRecommendation(eA, eB);
          conflicts.push({
            eventA: eA,
            eventB: eB,
            overlapMinutes,
            recommendation: rec.recommendation,
            recommendedEvent: rec.recommendedEvent,
            secondaryEvent: rec.secondaryEvent
          });
        }
      }
    }
  }

  return conflicts;
}

/**
 * Returns a Set of event IDs that have time conflicts with at least one other event
 */
export function getConflictingEventIdsSet(events: CalendarEvent[]): Set<string> {
  const pairs = detectEventConflicts(events);
  const conflictingSet = new Set<string>();

  pairs.forEach(pair => {
    conflictingSet.add(pair.eventA.id);
    conflictingSet.add(pair.eventB.id);
  });

  return conflictingSet;
}
