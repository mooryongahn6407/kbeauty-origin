/**
 * «7-day routine check» (owner's order I, 2026-10-18; benchmark: skin-diary and habit apps).
 * After a result, the reader can tick «morning care done» and «evening care done» each day for
 * seven days. Kept only on this phone; listed in «delete my data».
 *
 * What it deliberately is not: not a streak (a missed day is never counted against anyone and no
 * number of «days in a row» exists here), not a reward (nothing — no coupon, gift or level — is
 * tied to it), and not mastery (rule 9). Pure functions over an injected Storage.
 */
export const ROUTINE_WEEK_KEY = 'korea-glow:routine-week:v1';
export const WEEK_DAYS = 7;

export type Slot = 'am' | 'pm';
export interface RoutineWeek {
  /** The first day, as the phone's local date YYYY-MM-DD. */
  readonly start: string;
  readonly days: Readonly<Record<string, { readonly am?: boolean; readonly pm?: boolean }>>;
}
export type DotState = 'both' | 'one' | 'none' | 'ahead';

/** The phone's local calendar date, YYYY-MM-DD. */
export function localDay(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

const DAY_SHAPE = /^\d{4}-\d{2}-\d{2}$/;
const toUtc = (day: string): number => {
  const [y, m, d] = day.split('-').map(Number) as [number, number, number];
  return Date.UTC(y, m - 1, d);
};
const addDays = (day: string, n: number): string => {
  const date = new Date(toUtc(day) + n * 86_400_000);
  return date.toISOString().slice(0, 10);
};

/** 0 on the first day, 6 on the last; 7 or more once the week is over; -1 before it starts. */
export function dayIndex(week: RoutineWeek, today: string): number {
  return Math.round((toUtc(today) - toUtc(week.start)) / 86_400_000);
}

export function loadWeek(storage: Pick<Storage, 'getItem'> | undefined): RoutineWeek | null {
  try {
    const raw = storage?.getItem(ROUTINE_WEEK_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<RoutineWeek> | null;
    if (!parsed || typeof parsed.start !== 'string' || !DAY_SHAPE.test(parsed.start)) return null;
    const days: Record<string, { am?: boolean; pm?: boolean }> = {};
    for (const [day, value] of Object.entries(parsed.days ?? {})) {
      if (!DAY_SHAPE.test(day) || typeof value !== 'object' || value === null) continue;
      days[day] = { am: value.am === true, pm: value.pm === true };
    }
    return { start: parsed.start, days };
  } catch {
    return null;
  }
}

export function saveWeek(storage: Pick<Storage, 'setItem'> | undefined, week: RoutineWeek): void {
  try {
    storage?.setItem(ROUTINE_WEEK_KEY, JSON.stringify(week));
  } catch {
    // Private window: the ticks last for this visit only.
  }
}

export const startWeek = (today: string): RoutineWeek => ({ start: today, days: {} });

/** Tick or untick one slot of today. Days outside the week are left alone. */
export function toggleSlot(week: RoutineWeek, today: string, slot: Slot): RoutineWeek {
  const index = dayIndex(week, today);
  if (index < 0 || index >= WEEK_DAYS) return week;
  const current = week.days[today] ?? {};
  return { ...week, days: { ...week.days, [today]: { ...current, [slot]: !current[slot] } } };
}

/** Seven dots: both done, one done, none, or a day still ahead. */
export function weekDots(week: RoutineWeek, today: string): readonly DotState[] {
  const index = dayIndex(week, today);
  return Array.from({ length: WEEK_DAYS }, (_, n) => {
    if (n > index) return 'ahead';
    const day = week.days[addDays(week.start, n)];
    const count = (day?.am ? 1 : 0) + (day?.pm ? 1 : 0);
    return count === 2 ? 'both' : count === 1 ? 'one' : 'none';
  });
}
