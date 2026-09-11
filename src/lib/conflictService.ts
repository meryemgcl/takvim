import { CalendarEvent } from '../types';

export interface EventConflictPair {
  eventA: CalendarEvent;
  eventB: CalendarEvent;
  overlapMinutes: number;
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
          conflicts.push({
            eventA: eA,
            eventB: eB,
            overlapMinutes
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
