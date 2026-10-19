/**
 * KG-APP-CARE §2 customer journey (CEO, 2026-10-19) — what this phone remembers about how often
 * the reader has come, and what GLOW home offers someone on their third visit or later:
 *
 *   ① today's one thing  ② review  ③ next  ④ something different (another branch)
 *
 * Only progress lives here — a visit counter, the last lesson opened — never a name or a number
 * that identifies anyone, and every key is in `device-data.ts` so «delete my data» removes it.
 * Pure functions over an injected Storage, so they test without a browser; a blocked store makes
 * every reader look like a first-time one, which is the safe direction.
 */
import { TRACK_IDS } from './entry-links';
import type { TrackId } from '@/content/care-quest/types';

export const VISITS_KEY = 'korea-glow:visits:v1';
export const LAST_LESSON_KEY = 'korea-glow:last-lesson:v1';
/** A page load within this long of the last one is the same visit (a reload, a back-and-forth). */
export const VISIT_GAP_MS = 30 * 60 * 1000;
/** From this visit on, GLOW home shows the four continue cards. */
export const CONTINUE_CARDS_FROM_VISIT = 3;

/** This browser's localStorage, or undefined where even reaching it throws. */
export function safeLocalStorage(): Storage | undefined {
  try {
    return typeof localStorage === 'undefined' ? undefined : localStorage;
  } catch {
    return undefined;
  }
}

interface VisitRecord {
  readonly n: number;
  readonly last: number;
}

function readVisits(storage: Pick<Storage, 'getItem'> | undefined): VisitRecord | null {
  try {
    const parsed = JSON.parse(storage?.getItem(VISITS_KEY) ?? 'null') as Partial<VisitRecord> | null;
    if (!parsed || typeof parsed.n !== 'number' || typeof parsed.last !== 'number') return null;
    if (!Number.isFinite(parsed.n) || parsed.n < 1) return null;
    return { n: Math.floor(parsed.n), last: parsed.last };
  } catch {
    return null;
  }
}

/**
 * Counts this page load as a visit unless the last one was under 30 minutes ago, and returns
 * which visit this is (1 = first). Storage blocked: always 1.
 */
export function countVisit(storage: Storage | undefined, now: number): number {
  const previous = readVisits(storage);
  const n = !previous ? 1 : now - previous.last >= VISIT_GAP_MS ? previous.n + 1 : previous.n;
  try {
    storage?.setItem(VISITS_KEY, JSON.stringify({ n, last: now }));
  } catch {
    return 1;
  }
  return n;
}

export function saveLastLesson(storage: Pick<Storage, 'setItem'> | undefined, id: string): void {
  try {
    storage?.setItem(LAST_LESSON_KEY, id);
  } catch {
    // Private window: «next lesson» starts from the first one again.
  }
}

export function loadLastLesson(storage: Pick<Storage, 'getItem'> | undefined): string | null {
  try {
    return storage?.getItem(LAST_LESSON_KEY) || null;
  } catch {
    return null;
  }
}

/** Tracks with a finished result on this phone, read without loading the game itself. */
export function finishedTracks(storage: Pick<Storage, 'getItem'> | undefined): readonly TrackId[] {
  try {
    const parsed = JSON.parse(storage?.getItem('korea-glow:care-quest:v1') ?? 'null') as Record<string, unknown> | null;
    if (!parsed || typeof parsed !== 'object') return [];
    return TRACK_IDS.filter((id) => parsed[id] && typeof parsed[id] === 'object');
  } catch {
    return [];
  }
}

/** Review items due today or earlier (the ingredient hunt's spaced-review queue). */
export function dueReviewCount(storage: Pick<Storage, 'getItem'> | undefined, today: string): number {
  try {
    const parsed = JSON.parse(storage?.getItem('korea-glow:review:v1') ?? 'null') as Record<string, unknown> | null;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return 0;
    return Object.values(parsed).filter((item) => {
      const dueOn = (item as { dueOn?: unknown } | null)?.dueOn;
      return typeof dueOn === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dueOn) && dueOn <= today;
    }).length;
  } catch {
    return 0;
  }
}

export type JourneyAction =
  | { readonly kind: 'resume' }
  | { readonly kind: 'week' }
  | { readonly kind: 'track'; readonly track: TrackId }
  | { readonly kind: 'result' }
  | { readonly kind: 'review'; readonly due: number }
  | { readonly kind: 'lesson'; readonly id: string }
  | { readonly kind: 'dictionary' };

export interface JourneyCard {
  readonly slot: 'today' | 'review' | 'next' | 'other';
  readonly action: JourneyAction;
}

export interface JourneyInput {
  readonly finished: readonly TrackId[];
  readonly hasProgress: boolean;
  /** The 7-day routine check: running with today not fully ticked, or not. */
  readonly weekTodo: boolean;
  readonly dueReviews: number;
  readonly lastLesson: string | null;
  readonly lessonIds: readonly string[];
}

/** The lesson after `last` (the first one when nothing was opened, wrapping at the end). */
export function nextLesson(lessonIds: readonly string[], last: string | null, skip = 0): string | null {
  if (lessonIds.length === 0) return null;
  const at = last ? lessonIds.indexOf(last) : -1;
  return lessonIds[(at + 1 + skip) % lessonIds.length] ?? null;
}

/** The four continue cards, always four, always in the same order. */
export function journeyCards(input: JourneyInput): readonly JourneyCard[] {
  const firstLesson = nextLesson(input.lessonIds, input.lastLesson);
  const lessonOr = (id: string | null): JourneyAction => (id ? { kind: 'lesson', id } : { kind: 'dictionary' });

  let usedLesson = false;
  let today: JourneyAction;
  if (input.hasProgress) today = { kind: 'resume' };
  else if (input.weekTodo) today = { kind: 'week' };
  else if (input.finished.length === 0) today = { kind: 'track', track: 'face' };
  else {
    today = lessonOr(firstLesson);
    usedLesson = true;
  }

  const review: JourneyAction =
    input.dueReviews > 0
      ? { kind: 'review', due: input.dueReviews }
      : input.finished.length > 0
        ? { kind: 'result' }
        : { kind: 'review', due: 0 };

  const next = lessonOr(nextLesson(input.lessonIds, input.lastLesson, usedLesson ? 1 : 0));

  const unplayed = (['scalp', 'body'] as const).find((track) => !input.finished.includes(track));
  const other: JourneyAction = unplayed ? { kind: 'track', track: unplayed } : { kind: 'dictionary' };

  return [
    { slot: 'today', action: today },
    { slot: 'review', action: review },
    { slot: 'next', action: next },
    { slot: 'other', action: other },
  ];
}
