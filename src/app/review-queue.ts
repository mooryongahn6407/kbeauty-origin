/**
 * The review queue.
 *
 * An ingredient you missed comes back tomorrow; one you keep getting right comes back less and
 * less often. Spaced retrieval is the best-evidenced mechanic in consumer learning — the
 * spacing effect and the testing effect are both large and long-established — and it is the one
 * that also brings people back, because "5 due today" is a real reason to open an app.
 *
 * **Why these numbers are allowed and a point total is not.** OQ-X01 blocks inventing an XP
 * amount or a level threshold, because those would be claims about how much someone has learned
 * and no source defines them. An interval is not a claim about the reader at all: it is this
 * app's own scheduling policy, the way a reminder is, and it asserts nothing about skin, about
 * an ingredient, or about mastery. Nothing here is written to the mastery ledger, which still
 * accepts evidence only from recorded attempts (rule 9), and the queue never reports a score.
 *
 * State is per-browser, like the shelf. Every read is defensive and the app works without it.
 */

const STORAGE_KEY = 'korea-glow:review:v1';

/**
 * Days until an item is due again, by how many times in a row it has been recognised. The last
 * step repeats for anything beyond it.
 */
export const REVIEW_INTERVALS: readonly number[] = [1, 3, 7, 14, 30];

export interface ReviewItem {
  /** Governed Ingredient_ID. */
  readonly id: string;
  /** ISO day (YYYY-MM-DD) this item is next due. */
  readonly dueOn: string;
  /** Consecutive times recognised. Reset to 0 by a miss. Never shown as a score. */
  readonly run: number;
}

export type ReviewQueue = Readonly<Record<string, ReviewItem>>;

export const emptyQueue: ReviewQueue = {};

const isIsoDay = (value: unknown): value is string =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);

export const dayOf = (at: Date): string => at.toISOString().slice(0, 10);

export const addDays = (at: Date, days: number): string => {
  const moved = new Date(at);
  moved.setUTCDate(moved.getUTCDate() + days);
  return dayOf(moved);
};

/**
 * `run` is how many times in a row the item has been recognised, so the first success is run 1
 * and takes the first interval. Indexing by `run` rather than `run - 1` skipped that first step
 * and sent a just-learned ingredient three days away instead of one.
 */
const intervalFor = (run: number): number =>
  REVIEW_INTERVALS[Math.min(Math.max(run, 1) - 1, REVIEW_INTERVALS.length - 1)] ?? 1;

/** Records that an item was recognised: its run grows and it moves further out. */
export function withRecognised(queue: ReviewQueue, id: string, at: Date): ReviewQueue {
  const run = (queue[id]?.run ?? 0) + 1;
  return { ...queue, [id]: { id, run, dueOn: addDays(at, intervalFor(run)) } };
}

/**
 * Records a miss: the run resets and the item returns tomorrow.
 *
 * A miss costs the run and nothing else. It does not remove what else the reader knows, and the
 * item is not marked wrong anywhere — it is simply asked again sooner, which is the mechanism
 * rather than a punishment.
 */
export function withMissed(queue: ReviewQueue, id: string, at: Date): ReviewQueue {
  return { ...queue, [id]: { id, run: 0, dueOn: addDays(at, 1) } };
}

/** Ids due on or before today, soonest first. The number the reader sees on the home screen. */
export function dueIds(queue: ReviewQueue, at: Date): readonly string[] {
  const today = dayOf(at);
  return Object.values(queue)
    .filter((item) => item.dueOn <= today)
    .sort((a, b) => (a.dueOn < b.dueOn ? -1 : a.dueOn > b.dueOn ? 1 : 0))
    .map((item) => item.id);
}

/** Items being tracked at all, due or not — the size of what is being kept warm. */
export const trackedCount = (queue: ReviewQueue): number => Object.keys(queue).length;

export function loadQueue(
  storage: Pick<Storage, 'getItem'> | undefined,
  knownIds: ReadonlySet<string>,
): ReviewQueue {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (!raw) return emptyQueue;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return emptyQueue;

    const out: Record<string, ReviewItem> = {};
    for (const [id, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (!knownIds.has(id)) continue;
      if (typeof value !== 'object' || value === null) continue;
      const item = value as Partial<ReviewItem>;
      if (!isIsoDay(item.dueOn)) continue;
      const run = typeof item.run === 'number' && Number.isFinite(item.run) ? Math.max(0, Math.floor(item.run)) : 0;
      out[id] = { id, dueOn: item.dueOn, run };
    }
    return out;
  } catch {
    return emptyQueue;
  }
}

export function saveQueue(
  storage: Pick<Storage, 'setItem'> | undefined,
  queue: ReviewQueue,
): void {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(queue));
  } catch {
    // Private window, blocked site data, full quota. The queue is a convenience, not the app.
  }
}
