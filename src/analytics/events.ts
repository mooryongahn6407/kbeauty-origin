/**
 * Analytics.
 *
 * Source: 01_TECHNICAL_IMPLEMENTATION_SPEC_v1.0.md §9 — "Instrument learning events rather
 * than only engagement", and AI Constitution §14.1 anti-metrics (session length and message
 * volume are not success measures).
 *
 * The recorder is an in-memory sink for the prototype. Its interface is what a real
 * transport would implement; nothing downstream depends on where events are stored.
 */
import type { LearningEvent, LearningEventType } from '@/domain/learning';

export interface EventSink {
  record(event: LearningEvent): void;
  all(): readonly LearningEvent[];
  countOf(type: LearningEventType): number;
  clear(): void;
}

export function createEventSink(): EventSink {
  let events: LearningEvent[] = [];
  return {
    record(event) {
      events = [...events, event];
    },
    all() {
      return events;
    },
    countOf(type) {
      return events.filter((event) => event.type === type).length;
    },
    clear() {
      events = [];
    },
  };
}

/** Process-wide sink for the prototype shell. Tests create their own isolated sinks. */
export const eventSink: EventSink = createEventSink();
