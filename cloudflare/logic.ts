/**
 * Pure pieces of the GLOW Class Worker (`worker.ts`): routing, request validation, limits,
 * secret comparison and report shaping. Nothing here touches D1 or the network, so vitest
 * exercises it directly (tests/worker-logic.test.ts).
 */
import { normalizePartnerCode } from '../src/app/partner-shape';
import { DEVICE_ID_SHAPE } from '../src/app/gift-code';

export const TRACKS = ['face', 'scalp', 'body'] as const;
export type Track = (typeof TRACKS)[number];
export type VisitEvent = 'open' | 'result';

/** Which API a path is, or null for everything the static assets serve. */
export type Route = 'visit' | 'report' | 'gift' | 'redeem' | 'unknownApi';

export function routeFor(pathname: string): Route | null {
  const path = pathname.replace(/\/+$/, '') || '/';
  switch (path) {
    // The old Netlify paths stay alive: phones still running a cached build post there.
    case '/api/visit':
    case '/.netlify/functions/track-visit':
      return 'visit';
    case '/api/partner-report':
    case '/.netlify/functions/partner-report':
      return 'report';
    case '/api/gift':
      return 'gift';
    case '/api/gift/redeem':
      return 'redeem';
    default:
      return path.startsWith('/api/') || path.startsWith('/.netlify/') ? 'unknownApi' : null;
  }
}

/** The method each route accepts. */
export const ROUTE_METHOD: Readonly<Record<Exclude<Route, 'unknownApi'>, 'GET' | 'POST'>> = {
  visit: 'POST',
  report: 'GET',
  gift: 'POST',
  redeem: 'POST',
};

/** Largest request body any route accepts. The real ones are well under 200 bytes. */
export const MAX_BODY_BYTES = 1024;

/** Requests per minute per IP, per route. A salon's shared wifi stays well inside these. */
export const RATE_PER_MINUTE: Readonly<Record<Exclude<Route, 'unknownApi'>, number>> = {
  visit: 30,
  report: 10,
  gift: 10,
  redeem: 30,
};

/** Gift codes one IP may be issued in one day — stops one script farming codes with fresh device ids. */
export const GIFTS_PER_IP_PER_DAY = 50;

/**
 * Wrong secrets before an IP is locked out, the window they are counted in, and the lock.
 * The lock is per IP only (2026-10-18): a shared lock for everyone let one person's wrong PINs
 * stop the staff of every shop from checking gift codes.
 */
export const LOCKOUT = {
  perIpFailures: 5,
  windowMs: 15 * 60 * 1000,
  lockMs: 15 * 60 * 1000,
} as const;

export interface VisitInput {
  readonly code: string;
  readonly event: VisitEvent;
  readonly track: Track | '-';
}

/** The body the app already sends (`src/app/partner-track.ts`), or null when it is not one. */
export function parseVisit(body: unknown): VisitInput | null {
  if (!body || typeof body !== 'object') return null;
  const { code, event, track } = body as Record<string, unknown>;
  const normalized = typeof code === 'string' ? normalizePartnerCode(code) : null;
  if (!normalized || (event !== 'open' && event !== 'result')) return null;
  const trackPart =
    event === 'result' && typeof track === 'string' && (TRACKS as readonly string[]).includes(track)
      ? (track as Track)
      : '-';
  return { code: normalized, event, track: trackPart };
}

export interface GiftRequest {
  readonly device: string;
  readonly partner: string | null;
}

/**
 * A gift request: the phone's device id and, if a shop's link brought the reader, that shop's
 * code. Nothing else is read — no score, answer or progress — so a gift cannot depend on one.
 */
export function parseGiftRequest(body: unknown): GiftRequest | null {
  if (!body || typeof body !== 'object') return null;
  const { device, partner } = body as Record<string, unknown>;
  if (typeof device !== 'string' || !DEVICE_ID_SHAPE.test(device)) return null;
  return { device, partner: typeof partner === 'string' ? normalizePartnerCode(partner) : null };
}

export type RedeemAction = 'check' | 'redeem';

export function parseRedeem(body: unknown): { code: unknown; action: RedeemAction } | null {
  if (!body || typeof body !== 'object') return null;
  const { code, action } = body as Record<string, unknown>;
  if (action !== undefined && action !== 'check' && action !== 'redeem') return null;
  return { code, action: action === 'redeem' ? 'redeem' : 'check' };
}

/** The `?code=` filter on the report, upper-cased; null for none or a malformed one. */
export function reportFilter(raw: string | null): string | null {
  return normalizePartnerCode(raw);
}

/** The oldest month the report reads: 24 months back, so it never grows into a full scan. */
export function oldestReportMonth(now: Date, laosMonthOf: (date: Date) => string): string {
  const back = new Date(now);
  back.setUTCMonth(back.getUTCMonth() - 23, 1);
  return laosMonthOf(back);
}

export interface VisitRow {
  readonly code: string;
  readonly month: string;
  readonly event: string;
  readonly track: string;
  readonly n: number;
}

export interface MonthCount {
  opens: number;
  results: number;
  byTrack: Record<Track, number>;
}

/** Rows from `visit_counts` → the `{code: {month: count}}` shape the report screen reads. */
export function buildReport(rows: readonly VisitRow[]): Record<string, Record<string, MonthCount>> {
  const report: Record<string, Record<string, MonthCount>> = {};
  for (const row of rows) {
    const byMonth = (report[row.code] ??= {});
    const count = (byMonth[row.month] ??= { opens: 0, results: 0, byTrack: { face: 0, scalp: 0, body: 0 } });
    const n = Number(row.n) || 0;
    if (row.event === 'open') count.opens += n;
    else if (row.event === 'result') {
      count.results += n;
      if ((TRACKS as readonly string[]).includes(row.track)) count.byTrack[row.track as Track] += n;
    }
  }
  return report;
}

/**
 * Whether a supplied secret equals the configured one, in time that does not depend on where
 * they first differ — both are hashed to 32 bytes and every byte is compared, so neither the
 * position of a mismatch nor the secret's length leaks through timing.
 */
export async function secretMatches(supplied: string | null, expected: string): Promise<boolean> {
  if (supplied === null || supplied.length === 0 || supplied.length > 256) return false;
  const encoder = new TextEncoder();
  const [a, b] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(supplied)),
    crypto.subtle.digest('SHA-256', encoder.encode(expected)),
  ]);
  const x = new Uint8Array(a);
  const y = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < x.length; i += 1) diff |= x[i]! ^ y[i]!;
  return diff === 0;
}

/** A short, one-way tag for an IP or device id — enough to count by, never reversible to it. */
export async function hashTag(value: string, length = 16): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`glow-class:${value}`));
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, length);
}

/** The counter row for one IP's requests to one route in the current minute. */
export function minuteBucket(route: string, ipTag: string, nowMs: number): string {
  return `rl:${route}:${ipTag}:${Math.floor(nowMs / 60_000)}`;
}

/** The counter row for a fixed window of `windowMs`, e.g. wrong PINs in this quarter hour. */
export function windowBucket(prefix: string, who: string, nowMs: number, windowMs: number): string {
  return `${prefix}:${who}:${Math.floor(nowMs / windowMs)}`;
}

export class BodyTooLarge extends Error {}

/**
 * The request body as text, refusing more than `max` bytes — by the declared length when there
 * is one, and by counting while reading when there is not, so a chunked body cannot slip past.
 */
export async function readCappedText(request: Request, max = MAX_BODY_BYTES): Promise<string> {
  const declared = Number(request.headers.get('content-length') ?? '');
  if (Number.isFinite(declared) && declared > max) throw new BodyTooLarge();
  if (!request.body) return '';
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > max) {
      await reader.cancel().catch(() => undefined);
      throw new BodyTooLarge();
    }
    chunks.push(value);
  }
  const all = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    all.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(all);
}

/** A cross-site browser post (another page posting here) — refused; same-site and curl pass. */
export function isCrossSite(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    return new URL(origin).host !== new URL(request.url).host;
  } catch {
    return true;
  }
}
