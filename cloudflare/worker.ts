/**
 * GLOW Class on Cloudflare Workers (app.korea-glow.com moved off Netlify on 2026-10-18).
 *
 * Everything that is not an API path is handed straight to the static assets (`env.ASSETS`), so
 * the app itself is served exactly as before. The API paths:
 *
 *   POST /api/visit               (also the old /.netlify/functions/track-visit)
 *        A partner visit — `{code, event, track}`, the body `src/app/partner-track.ts` sends.
 *        Counted into one monthly row per shop/event/track; never a name, phone or device id.
 *   GET  /api/partner-report      (also the old /.netlify/functions/partner-report)
 *        The owner's report. The key comes in the `X-Report-Key` header — never `?key=`, which
 *        ends up in logs and browser history — compared in constant time against the Worker
 *        secret PARTNER_REPORT_KEY; repeated wrong keys lock the IP out for a while.
 *   POST /api/gift                The store gift (CEO card sqglow_10): a one-time code for this
 *        phone and this Laos day, issued by the server and remembered, so it cannot be forged.
 *   POST /api/gift/redeem         A shop checks a code and marks it used, with the staff PIN
 *        (Worker secret STAFF_GIFT_PIN) in the `X-Staff-Pin` header.
 *
 * Storage is the D1 database `glow-class` (schema: `migrations/`). Every API route is rate
 * limited per IP and capped at a 1 KB body. Pure pieces live in `logic.ts`.
 */
import { formatGiftCode, laosDay, laosMonth, newGiftCode, normalizeGiftCode } from '../src/app/gift-code';
import {
  BodyTooLarge,
  GIFTS_PER_IP_PER_DAY,
  LOCKOUT,
  RATE_PER_MINUTE,
  ROUTE_METHOD,
  buildReport,
  hashTag,
  isCrossSite,
  minuteBucket,
  oldestReportMonth,
  parseGiftRequest,
  parseRedeem,
  parseVisit,
  readCappedText,
  reportFilter,
  routeFor,
  secretMatches,
  windowBucket,
  type Route,
  type VisitRow,
} from './logic';

/* ---- The small part of the Workers runtime this file uses (no extra type package needed). */
export interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  run(): Promise<{ meta?: { changes?: number } }>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
}
export interface D1Like {
  prepare(sql: string): D1Statement;
}
export interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  DB: D1Like;
  PARTNER_REPORT_KEY?: string;
  STAFF_GIFT_PIN?: string;
}
export interface Ctx {
  waitUntil(promise: Promise<unknown>): void;
}

/** What the handler takes from the outside world — swapped in tests. */
export interface Deps {
  now(): number;
  random(): number;
  fillRandom(bytes: Uint8Array): Uint8Array;
  /** Per-isolate memory of IPs already over a limit, so a flood stops before it reaches D1. */
  blocked: Map<string, number>;
}

const defaultDeps: Deps = {
  now: () => Date.now(),
  random: () => Math.random(),
  fillRandom: (bytes) => crypto.getRandomValues(bytes),
  blocked: new Map(),
};

const API_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'no-referrer',
};

function json(body: unknown, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...API_HEADERS, ...extra } });
}

/** +1 on a counter row, creating it with an expiry if new; returns the new count. */
async function hit(db: D1Like, bucket: string, expires: number): Promise<number> {
  const row = await db
    .prepare(
      'INSERT INTO counters (bucket, n, expires) VALUES (?1, 1, ?2) ' +
        'ON CONFLICT(bucket) DO UPDATE SET n = n + 1 RETURNING n',
    )
    .bind(bucket, expires)
    .first<{ n: number }>();
  return Number(row?.n ?? 1);
}

async function setLock(db: D1Like, bucket: string, until: number): Promise<void> {
  await db
    .prepare(
      'INSERT INTO counters (bucket, n, expires) VALUES (?1, 1, ?2) ' +
        'ON CONFLICT(bucket) DO UPDATE SET expires = excluded.expires',
    )
    .bind(bucket, until)
    .run();
}

async function isLocked(db: D1Like, scope: string, ipTag: string, nowMs: number): Promise<boolean> {
  const row = await db
    .prepare('SELECT 1 AS locked FROM counters WHERE bucket IN (?1, ?2) AND expires > ?3 LIMIT 1')
    .bind(`lock:${scope}:${ipTag}`, `lock:${scope}:*`, nowMs)
    .first();
  return row !== null;
}

/** Counts a wrong secret; returns true when that failure has just locked the caller out. */
async function recordFailure(
  db: D1Like,
  scope: 'report' | 'pin',
  ipTag: string,
  nowMs: number,
): Promise<boolean> {
  let locked = false;
  const mine = await hit(
    db,
    windowBucket(`fail:${scope}`, ipTag, nowMs, LOCKOUT.windowMs),
    nowMs + LOCKOUT.windowMs,
  );
  if (mine >= LOCKOUT.perIpFailures) {
    await setLock(db, `lock:${scope}:${ipTag}`, nowMs + LOCKOUT.lockMs);
    locked = true;
  }
  if (scope === 'pin') {
    const everyone = await hit(
      db,
      windowBucket(`fail:${scope}`, '*', nowMs, LOCKOUT.globalWindowMs),
      nowMs + LOCKOUT.globalWindowMs,
    );
    if (everyone >= LOCKOUT.globalPinFailures) {
      await setLock(db, `lock:${scope}:*`, nowMs + LOCKOUT.globalLockMs);
      locked = true;
    }
  }
  return locked;
}

async function overRate(
  db: D1Like,
  deps: Deps,
  route: Exclude<Route, 'unknownApi'>,
  ipTag: string,
  nowMs: number,
): Promise<boolean> {
  const memoryKey = `${route}:${ipTag}`;
  const until = deps.blocked.get(memoryKey);
  if (until !== undefined && until > nowMs) return true;
  if (until !== undefined) deps.blocked.delete(memoryKey);
  const count = await hit(db, minuteBucket(route, ipTag, nowMs), nowMs + 2 * 60_000);
  if (count <= RATE_PER_MINUTE[route]) return false;
  if (deps.blocked.size > 5000) deps.blocked.clear();
  deps.blocked.set(memoryKey, (Math.floor(nowMs / 60_000) + 1) * 60_000);
  return true;
}

async function readJson(request: Request): Promise<unknown> {
  const text = await readCappedText(request);
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

/* ---- Routes ------------------------------------------------------------------------------ */

async function visit(request: Request, env: Env, nowMs: number): Promise<Response> {
  const input = parseVisit(await readJson(request));
  if (!input) return json({ error: 'bad request' }, 400);
  try {
    await env.DB.prepare(
      'INSERT INTO visit_counts (code, month, event, track, n) VALUES (?1, ?2, ?3, ?4, 1) ' +
        'ON CONFLICT(code, month, event, track) DO UPDATE SET n = n + 1',
    )
      .bind(input.code, laosMonth(new Date(nowMs)), input.event, input.track)
      .run();
  } catch {
    // A dropped count never breaks the reader's screen — the app never waits on this anyway.
  }
  return new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } });
}

async function report(request: Request, env: Env, ipTag: string, nowMs: number): Promise<Response> {
  const expected = env.PARTNER_REPORT_KEY;
  if (!expected) return json({ error: 'not configured' }, 500);
  if (await isLocked(env.DB, 'report', ipTag, nowMs)) return json({ error: 'locked' }, 429, { 'retry-after': '900' });
  if (!(await secretMatches(request.headers.get('x-report-key'), expected))) {
    const locked = await recordFailure(env.DB, 'report', ipTag, nowMs);
    return locked ? json({ error: 'locked' }, 429, { 'retry-after': '900' }) : json({ error: 'unauthorized' }, 401);
  }
  const url = new URL(request.url);
  const onlyCode = reportFilter(url.searchParams.get('code'));
  const { results } = await env.DB.prepare(
    'SELECT code, month, event, track, n FROM visit_counts ' +
      'WHERE month >= ?1 AND (?2 IS NULL OR code = ?2) ORDER BY code, month',
  )
    .bind(oldestReportMonth(new Date(nowMs), laosMonth), onlyCode)
    .all<VisitRow>();
  return json({ report: buildReport(results), note: 'counts of events, not of unique people' });
}

interface GiftRow {
  code: string;
  day: string;
  partner: string | null;
  status: 'issued' | 'redeemed';
  redeemed_at: string | null;
}

function giftBody(row: Pick<GiftRow, 'code' | 'day' | 'partner'>) {
  return { code: row.code, display: formatGiftCode(row.code), issuedOn: row.day, partner: row.partner };
}

async function gift(request: Request, env: Env, deps: Deps, ipTag: string, nowMs: number): Promise<Response> {
  const input = parseGiftRequest(await readJson(request));
  if (!input) return json({ error: 'bad request' }, 400);
  const device = await hashTag(input.device, 32);
  const day = laosDay(new Date(nowMs));
  const findMine = () =>
    env.DB.prepare('SELECT code, day, partner FROM gift_codes WHERE device = ?1 AND day = ?2')
      .bind(device, day)
      .first<GiftRow>();

  const existing = await findMine();
  if (existing) return json(giftBody(existing));

  const issuedToday = await hit(env.DB, `gd:${ipTag}:${day}`, nowMs + 26 * 60 * 60 * 1000);
  if (issuedToday > GIFTS_PER_IP_PER_DAY) return json({ error: 'too many requests' }, 429, { 'retry-after': '3600' });

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = newGiftCode(deps.fillRandom);
    const result = await env.DB.prepare(
      'INSERT OR IGNORE INTO gift_codes (code, device, day, partner, status, issued_at) ' +
        "VALUES (?1, ?2, ?3, ?4, 'issued', ?5)",
    )
      .bind(code, device, day, input.partner, new Date(nowMs).toISOString())
      .run();
    if ((result.meta?.changes ?? 0) > 0) return json(giftBody({ code, day, partner: input.partner }), 201);
    // Either this phone got a code a moment ago in another request, or the random code is taken.
    const raced = await findMine();
    if (raced) return json(giftBody(raced));
  }
  return json({ error: 'unavailable' }, 503);
}

async function redeem(request: Request, env: Env, ipTag: string, nowMs: number): Promise<Response> {
  const expected = env.STAFF_GIFT_PIN;
  if (!expected) return json({ error: 'not configured' }, 500);
  if (await isLocked(env.DB, 'pin', ipTag, nowMs)) return json({ error: 'locked' }, 429, { 'retry-after': '900' });
  if (!(await secretMatches(request.headers.get('x-staff-pin'), expected))) {
    const locked = await recordFailure(env.DB, 'pin', ipTag, nowMs);
    return locked ? json({ error: 'locked' }, 429, { 'retry-after': '900' }) : json({ error: 'unauthorized' }, 401);
  }
  const input = parseRedeem(await readJson(request));
  if (!input) return json({ error: 'bad request' }, 400);
  const code = normalizeGiftCode(input.code);
  if (!code) return json({ status: 'unknown' });

  const find = () =>
    env.DB.prepare('SELECT code, day, partner, status, redeemed_at FROM gift_codes WHERE code = ?1')
      .bind(code)
      .first<GiftRow>();
  const describe = (row: GiftRow) => ({
    status: row.status === 'redeemed' ? 'used' : 'valid',
    code: row.code,
    display: formatGiftCode(row.code),
    issuedOn: row.day,
    partner: row.partner,
    redeemedAt: row.redeemed_at,
  });

  if (input.action === 'redeem') {
    const redeemedAt = new Date(nowMs).toISOString();
    const result = await env.DB.prepare(
      "UPDATE gift_codes SET status = 'redeemed', redeemed_at = ?2 WHERE code = ?1 AND status = 'issued'",
    )
      .bind(code, redeemedAt)
      .run();
    const row = await find();
    if (!row) return json({ status: 'unknown' });
    if ((result.meta?.changes ?? 0) > 0) return json({ ...describe(row), status: 'redeemed' });
    return json(describe(row));
  }
  const row = await find();
  return json(row ? describe(row) : { status: 'unknown' });
}

/* ---- Entry ------------------------------------------------------------------------------- */

export async function handle(request: Request, env: Env, ctx: Ctx, deps: Deps = defaultDeps): Promise<Response> {
  const url = new URL(request.url);
  const route = routeFor(url.pathname);
  if (route === null) return env.ASSETS.fetch(request);
  if (route === 'unknownApi') return json({ error: 'not found' }, 404);

  const method = ROUTE_METHOD[route];
  if (request.method !== method) return json({ error: 'method not allowed' }, 405, { allow: method });
  if (method === 'POST' && isCrossSite(request)) return json({ error: 'forbidden' }, 403);

  const nowMs = deps.now();
  try {
    const ipTag = await hashTag(request.headers.get('cf-connecting-ip') ?? 'unknown');
    if (await overRate(env.DB, deps, route, ipTag, nowMs)) {
      return json({ error: 'too many requests' }, 429, { 'retry-after': '60' });
    }
    if (deps.random() < 0.02) {
      ctx.waitUntil(
        env.DB.prepare('DELETE FROM counters WHERE expires < ?1').bind(nowMs).run().catch(() => undefined),
      );
    }
    switch (route) {
      case 'visit':
        return await visit(request, env, nowMs);
      case 'report':
        return await report(request, env, ipTag, nowMs);
      case 'gift':
        return await gift(request, env, deps, ipTag, nowMs);
      case 'redeem':
        return await redeem(request, env, ipTag, nowMs);
    }
  } catch (error) {
    if (error instanceof BodyTooLarge) return json({ error: 'too large' }, 413);
    if (route === 'visit') return new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } });
    return json({ error: 'unavailable' }, 503);
  }
}

export default {
  fetch(request: Request, env: Env, ctx: Ctx): Promise<Response> {
    return handle(request, env, ctx);
  },
};
