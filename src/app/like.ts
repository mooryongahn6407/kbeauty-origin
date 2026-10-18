/**
 * The Like button's two halves: whether *this phone* has liked the app (localStorage), and the
 * shared count (the Worker's `/api/like`, see `cloudflare/worker.ts`).
 *
 * Honest by construction:
 * - The number is shown only once it is a real, server-reported count of at least
 *   `LIKE_COUNT_SHOWN_FROM`. Below that the button shows just its label — never a seeded or
 *   rounded-up figure, and never "0 likes" on a new app.
 * - If the server is slow, blocked or offline, the button still toggles on this phone and simply
 *   shows no number. Nothing here throws to the caller or puts an error on screen.
 */
export const LIKE_STORAGE_KEY = 'korea-glow:like:v1';
export const LIKE_ENDPOINT = '/api/like';
/** The smallest count the button will print. Change this one number to change the rule. */
export const LIKE_COUNT_SHOWN_FROM = 10;

export type LikeAction = 'like' | 'unlike';
type Fetch = (input: string, init?: RequestInit) => Promise<Response>;

export function loadLiked(storage: Pick<Storage, 'getItem'> | undefined): boolean {
  try {
    return storage?.getItem(LIKE_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function saveLiked(storage: Pick<Storage, 'setItem' | 'removeItem'> | undefined, liked: boolean): void {
  try {
    if (liked) storage?.setItem(LIKE_STORAGE_KEY, '1');
    else storage?.removeItem(LIKE_STORAGE_KEY);
  } catch {
    // Private windows and full storage: the like lasts until the page closes.
  }
}

/** The count from a response body, or null when it is not a whole number ≥ 0. */
export function parseLikeCount(body: unknown): number | null {
  const count = (body as { count?: unknown } | null)?.count;
  return typeof count === 'number' && Number.isInteger(count) && count >= 0 ? count : null;
}

/** The number to print beside the label, or null to print none. */
export function shownLikeCount(count: number | null): number | null {
  return count !== null && count >= LIKE_COUNT_SHOWN_FROM ? count : null;
}

/** The count after this phone's own press, before the server has answered. */
export function optimisticCount(count: number | null, action: LikeAction): number | null {
  if (count === null) return null;
  return Math.max(0, count + (action === 'like' ? 1 : -1));
}

/** 1,234 → "1.2K" the way the reader's language writes it; plain digits if Intl cannot. */
export function formatLikeCount(count: number, locale: string): string {
  try {
    return new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(count);
  } catch {
    return String(count);
  }
}

const fetchImpl = (): Fetch | null =>
  typeof fetch === 'function' ? (fetch as unknown as Fetch) : null;

async function call(init: RequestInit | undefined, doFetch: Fetch | null): Promise<number | null> {
  if (!doFetch) return null;
  try {
    const response = await doFetch(LIKE_ENDPOINT, { ...init, credentials: 'same-origin', cache: 'no-store' });
    // 429 still carries the real count; anything else that is not ok carries nothing to trust.
    if (!response.ok && response.status !== 429) return null;
    return parseLikeCount(await response.json());
  } catch {
    return null;
  }
}

export function fetchLikeCount(doFetch: Fetch | null = fetchImpl()): Promise<number | null> {
  return call(undefined, doFetch);
}

export function sendLike(action: LikeAction, doFetch: Fetch | null = fetchImpl()): Promise<number | null> {
  return call(
    { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action }) },
    doFetch,
  );
}
