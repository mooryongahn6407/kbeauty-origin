/**
 * The collection, the return streak, and the store gift.
 *
 * All three are deliberately kept out of `src/mastery/`. CLAUDE.md rule 9 says mastery stays
 * separate from loyalty, influencer, partner and commercial status, and a voucher someone
 * redeems in a shop is exactly commercial status. Nothing in this file touches the mastery
 * ledger, and nothing in the ledger reads this file.
 *
 * Nor does anything here invent a number. The collection counts concerns the reader actually
 * opened, out of the fifteen the database has — a real count of a real set. The streak counts
 * distinct days the app was opened. There is no XP amount and no level threshold, because no
 * source defines one (OQ-X01), and a point total nobody can trace is exactly the kind of
 * invented figure the numeric audit exists to catch.
 *
 * State lives in this viewer's own browser. It never reaches another viewer, another device or
 * a server, which is also why it can be wrong and the UI must render without it.
 */
import { concerns } from '@/knowledge/repository';

const STORAGE_KEY = 'korea-glow:collection:v1';

export interface CollectionState {
  /** Governed Concern_IDs the reader has opened at least once. */
  readonly discoveredConcernIds: readonly string[];
  /** ISO dates (YYYY-MM-DD) the app was opened, most recent last. */
  readonly visitDays: readonly string[];
}

export const emptyCollection: CollectionState = { discoveredConcernIds: [], visitDays: [] };

export const TOTAL_COLLECTABLE = concerns.length;

const isIsoDay = (value: unknown): value is string =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);

export const dayOf = (at: Date): string => at.toISOString().slice(0, 10);

/** Reads what this browser has stored, tolerating every way that can fail or be tampered with. */
export function loadCollection(storage: Pick<Storage, 'getItem'> | undefined): CollectionState {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (!raw) return emptyCollection;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return emptyCollection;
    const record = parsed as Partial<Record<keyof CollectionState, unknown>>;
    const known = new Set(concerns.map((concern) => concern.Concern_ID));
    return {
      discoveredConcernIds: Array.isArray(record.discoveredConcernIds)
        ? record.discoveredConcernIds.filter(
            (id): id is string => typeof id === 'string' && known.has(id),
          )
        : [],
      visitDays: Array.isArray(record.visitDays) ? record.visitDays.filter(isIsoDay) : [],
    };
  } catch {
    return emptyCollection;
  }
}

export function saveCollection(
  storage: Pick<Storage, 'setItem'> | undefined,
  state: CollectionState,
): void {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // A private window, blocked site data, a full quota. The app works without the record.
  }
}

/** Adds today to the visit log, once per day. */
export function withVisit(state: CollectionState, at: Date): CollectionState {
  const today = dayOf(at);
  if (state.visitDays.includes(today)) return state;
  return { ...state, visitDays: [...state.visitDays, today].slice(-90) };
}

export function withDiscovered(
  state: CollectionState,
  concernIds: readonly string[],
): CollectionState {
  const known = new Set(concerns.map((concern) => concern.Concern_ID));
  const merged = new Set([...state.discoveredConcernIds, ...concernIds.filter((id) => known.has(id))]);
  return { ...state, discoveredConcernIds: [...merged] };
}

/** Consecutive days ending today (or yesterday, so a streak survives until the day is over). */
export function currentStreak(state: CollectionState, at: Date): number {
  if (state.visitDays.length === 0) return 0;
  const days = new Set(state.visitDays);
  const cursor = new Date(at);
  if (!days.has(dayOf(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(dayOf(cursor))) return 0;
  }
  let streak = 0;
  while (days.has(dayOf(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/**
 * The store gift.
 *
 * Earned by finishing the journey, which is a thing someone *did* — not by scoring well, which
 * would make it a reward for being right and turn a page of self-observation into a test. The
 * code identifies the visit to a partner shop and carries no personal data: the day, and a
 * checksum over it, so a staff member can tell a real code from an invented one at a glance.
 */
export interface StoreGift {
  readonly code: string;
  readonly issuedOn: string;
}

export function issueGift(at: Date): StoreGift {
  const day = dayOf(at);
  const digits = day.replaceAll('-', '');
  const checksum = [...digits].reduce((sum, digit) => sum + Number(digit), 0) % 97;
  return {
    code: `KG-${digits.slice(2)}-${String(checksum).padStart(2, '0')}`,
    issuedOn: day,
  };
}
