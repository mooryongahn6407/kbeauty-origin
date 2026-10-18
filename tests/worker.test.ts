/**
 * The Cloudflare Worker (cloudflare/worker.ts): partner visits and report, the server-issued
 * gift code and its redemption, rate limits, body cap and lockouts.
 *
 * D1 is SQLite, so the handler runs here against Node's own SQLite (node:sqlite) behind a small
 * D1-shaped adapter, with the real migration applied — the SQL in the Worker is exercised as
 * written, not mocked.
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import type { DatabaseSync as Sqlite } from 'node:sqlite';
import { beforeEach, describe, expect, it } from 'vitest';
import { handle, type D1Like, type D1Statement, type Deps, type Env } from '../cloudflare/worker';
import {
  BodyTooLarge,
  LOCKOUT,
  RATE_PER_MINUTE,
  buildReport,
  isCrossSite,
  minuteBucket,
  oldestReportMonth,
  parseGiftRequest,
  parseRedeem,
  parseVisit,
  readCappedText,
  routeFor,
  secretMatches,
} from '../cloudflare/logic';
import {
  GIFT_ALPHABET,
  formatGiftCode,
  giftCodeFromBytes,
  laosDay,
  laosMonth,
  newGiftCode,
  normalizeGiftCode,
} from '@/app/gift-code';

// Loaded at run time: Vite would otherwise strip the `node:` prefix, and `sqlite` alone is no module.
const { DatabaseSync } = createRequire(import.meta.url)('node:sqlite') as typeof import('node:sqlite');
const MIGRATION = readFileSync(new URL('../migrations/0001_init.sql', import.meta.url), 'utf8');

function d1(db: Sqlite): D1Like {
  const statement = (sql: string, args: unknown[]): D1Statement => ({
    bind: (...values: unknown[]) => statement(sql, values),
    first: async <T,>() => (db.prepare(sql).get(...(args as never[])) as T | undefined) ?? null,
    run: async () => ({ meta: { changes: Number(db.prepare(sql).run(...(args as never[])).changes) } }),
    all: async <T,>() => ({ results: db.prepare(sql).all(...(args as never[])) as T[] }),
  });
  return { prepare: (sql: string) => statement(sql, []) };
}

const ORIGIN = 'https://glow-next.korea-glow.com';
const REPORT_KEY = 'test-report-key-0123456789abcdef';
const PIN = '482915';
const DEVICE = 'dev_abcdefghijklmnop1234';

let sqlite: Sqlite;
let env: Env;
let deps: Deps;
let clock: number;
let assetHits: string[];

beforeEach(() => {
  sqlite = new DatabaseSync(':memory:');
  sqlite.exec(MIGRATION);
  assetHits = [];
  env = {
    ASSETS: {
      fetch: async (request: Request) => {
        assetHits.push(new URL(request.url).pathname);
        return new Response('asset', { status: 200 });
      },
    },
    DB: d1(sqlite),
    PARTNER_REPORT_KEY: REPORT_KEY,
    STAFF_GIFT_PIN: PIN,
  };
  clock = Date.parse('2026-10-19T03:00:00Z');
  let seed = 1;
  deps = {
    now: () => clock,
    random: () => 0.5,
    fillRandom: (bytes) => {
      for (let i = 0; i < bytes.length; i += 1) bytes[i] = (seed = (seed * 1103515245 + 12345) % 2 ** 31) & 0xff;
      return bytes;
    },
    blocked: new Map(),
  };
});

const ctx = { waitUntil: () => undefined };

function call(path: string, init: RequestInit & { ip?: string } = {}) {
  const headers = new Headers(init.headers);
  headers.set('cf-connecting-ip', init.ip ?? '203.0.113.7');
  return handle(new Request(`${ORIGIN}${path}`, { ...init, headers }), env, ctx, deps);
}
const post = (path: string, body: unknown, headers: Record<string, string> = {}, ip?: string) =>
  call(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
    ...(ip ? { ip } : {}),
  });
const report = (key: string | null, ip?: string, query = '') =>
  call(`/api/partner-report${query}`, { headers: key === null ? {} : { 'x-report-key': key }, ...(ip ? { ip } : {}) });

describe('routing', () => {
  it('sends everything that is not an API path to the static assets', async () => {
    const response = await call('/');
    expect(await response.text()).toBe('asset');
    await call('/assets/index-abc.js');
    expect(assetHits).toEqual(['/', '/assets/index-abc.js']);
  });

  it('answers the new paths and the old Netlify ones', () => {
    expect(routeFor('/api/visit')).toBe('visit');
    expect(routeFor('/.netlify/functions/track-visit')).toBe('visit');
    expect(routeFor('/api/partner-report')).toBe('report');
    expect(routeFor('/.netlify/functions/partner-report')).toBe('report');
    expect(routeFor('/api/gift')).toBe('gift');
    expect(routeFor('/api/gift/redeem')).toBe('redeem');
    expect(routeFor('/api/nothing')).toBe('unknownApi');
    expect(routeFor('/index.html')).toBeNull();
  });

  it('refuses the wrong method and an unknown API path', async () => {
    expect((await call('/api/visit')).status).toBe(405);
    expect((await post('/api/partner-report', {})).status).toBe(405);
    expect((await call('/api/nope')).status).toBe(404);
    expect(assetHits).toEqual([]);
  });

  it('refuses a post from another site, but not from this one or from curl', async () => {
    const other = await post('/api/visit', { code: 'VTE-01', event: 'open' }, { origin: 'https://evil.example' });
    expect(other.status).toBe(403);
    const same = await post('/api/visit', { code: 'VTE-01', event: 'open' }, { origin: ORIGIN });
    expect(same.status).toBe(204);
    expect(isCrossSite(new Request(`${ORIGIN}/api/visit`, { method: 'POST' }))).toBe(false);
  });
});

describe('partner visits and the owner report', () => {
  it('accepts exactly the body the app already sends', () => {
    expect(parseVisit({ code: 'vte-01', event: 'open' })).toEqual({ code: 'VTE-01', event: 'open', track: '-' });
    expect(parseVisit({ code: 'VTE-01', event: 'result', track: 'scalp' })).toEqual({
      code: 'VTE-01',
      event: 'result',
      track: 'scalp',
    });
    expect(parseVisit({ code: 'VTE-01', event: 'open', track: 'face' })?.track).toBe('-');
    for (const bad of [null, {}, { code: 'ab', event: 'open' }, { code: 'VTE-01', event: 'buy' }, { code: '<x>', event: 'open' }]) {
      expect(parseVisit(bad)).toBeNull();
    }
  });

  it('counts visits into monthly rows and reports them in the same shape as before', async () => {
    for (const body of [
      { code: 'VTE-01', event: 'open' },
      { code: 'VTE-01', event: 'open' },
      { code: 'VTE-01', event: 'result', track: 'face' },
      { code: 'PKZ-02', event: 'result', track: 'body' },
    ]) {
      expect((await post('/.netlify/functions/track-visit', body)).status).toBe(204);
    }
    const rows = sqlite.prepare('SELECT COUNT(*) AS c FROM visit_counts').get() as { c: number };
    expect(rows.c).toBe(3); // one row per code/month/event/track, not one per visit

    const response = await report(REPORT_KEY);
    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('no-store');
    const body = (await response.json()) as { report: Record<string, Record<string, unknown>> };
    expect(body.report).toEqual({
      'PKZ-02': { '202610': { opens: 0, results: 1, byTrack: { face: 0, scalp: 0, body: 1 } } },
      'VTE-01': { '202610': { opens: 2, results: 1, byTrack: { face: 1, scalp: 0, body: 0 } } },
    });
    const filtered = (await (await report(REPORT_KEY, undefined, '?code=vte-01')).json()) as { report: object };
    expect(Object.keys(filtered.report)).toEqual(['VTE-01']);
  });

  it('rejects a malformed visit with 400 and an oversized one with 413', async () => {
    expect((await post('/api/visit', { code: 'x', event: 'open' })).status).toBe(400);
    expect((await post('/api/visit', 'not json')).status).toBe(400);
    expect((await post('/api/visit', 'x'.repeat(5000))).status).toBe(413);
  });

  it('reads the report key only from the header — never from ?key=', async () => {
    expect((await report(null, undefined, `?key=${REPORT_KEY}`)).status).toBe(401);
    expect((await report('wrong')).status).toBe(401);
  });

  it('refuses to serve when the key is not configured, rather than defaulting to open', async () => {
    delete env.PARTNER_REPORT_KEY;
    expect((await report(REPORT_KEY)).status).toBe(500);
  });

  it('locks an IP out after repeated wrong keys, even for the right key, and not other IPs', async () => {
    for (let i = 1; i < LOCKOUT.perIpFailures; i += 1) expect((await report('wrong')).status).toBe(401);
    expect((await report('wrong')).status).toBe(429);
    expect((await report(REPORT_KEY)).status).toBe(429);
    expect((await report(REPORT_KEY, '198.51.100.9')).status).toBe(200);
    clock += LOCKOUT.lockMs + 1000;
    expect((await report(REPORT_KEY)).status).toBe(200);
  });

  it('reads at most 24 months of rows', () => {
    expect(oldestReportMonth(new Date('2026-10-19T03:00:00Z'), laosMonth)).toBe('202411');
  });

  it('shapes rows into the report the screen reads', () => {
    expect(
      buildReport([
        { code: 'A01', month: '202610', event: 'open', track: '-', n: 3 },
        { code: 'A01', month: '202610', event: 'result', track: 'scalp', n: 2 },
      ]),
    ).toEqual({ A01: { '202610': { opens: 3, results: 2, byTrack: { face: 0, scalp: 2, body: 0 } } } });
  });
});

describe('rate limits and body cap', () => {
  it('answers 429 once one IP passes the per-minute limit, and lets other IPs through', async () => {
    const statuses: number[] = [];
    for (let i = 0; i < RATE_PER_MINUTE.visit + 2; i += 1) {
      statuses.push((await post('/api/visit', { code: 'VTE-01', event: 'open' })).status);
    }
    expect(statuses.filter((status) => status === 204)).toHaveLength(RATE_PER_MINUTE.visit);
    expect(statuses.at(-1)).toBe(429);
    expect((await post('/api/visit', { code: 'VTE-01', event: 'open' }, {}, '198.51.100.9')).status).toBe(204);
    clock += 60_000;
    expect((await post('/api/visit', { code: 'VTE-01', event: 'open' })).status).toBe(204);
  });

  it('keeps per-minute buckets apart by route, IP and minute', () => {
    expect(minuteBucket('visit', 'ab', 120_000)).toBe('rl:visit:ab:2');
    expect(minuteBucket('gift', 'ab', 120_000)).not.toBe(minuteBucket('visit', 'ab', 120_000));
  });

  it('refuses a body over the cap even without a declared length', async () => {
    const big = new Request(`${ORIGIN}/x`, {
      method: 'POST',
      body: new ReadableStream({
        start(controller) {
          controller.enqueue(new Uint8Array(800));
          controller.enqueue(new Uint8Array(800));
          controller.close();
        },
      }),
      // @ts-expect-error — Node needs this for a streamed request body.
      duplex: 'half',
    });
    await expect(readCappedText(big)).rejects.toBeInstanceOf(BodyTooLarge);
  });
});

describe('secrets', () => {
  it('matches only the exact secret', async () => {
    expect(await secretMatches(REPORT_KEY, REPORT_KEY)).toBe(true);
    expect(await secretMatches(REPORT_KEY.slice(0, -1), REPORT_KEY)).toBe(false);
    expect(await secretMatches('', REPORT_KEY)).toBe(false);
    expect(await secretMatches(null, REPORT_KEY)).toBe(false);
    expect(await secretMatches('x'.repeat(300), REPORT_KEY)).toBe(false);
  });
});

describe('gift codes (CEO card sqglow_10)', () => {
  it('uses only letters and digits that cannot be read as one another', () => {
    for (const ambiguous of '0O1IL2Z5S6G8BDQ') expect(GIFT_ALPHABET).not.toContain(ambiguous);
    const code = newGiftCode(deps.fillRandom);
    expect(code).toHaveLength(6);
    expect([...code].every((char) => GIFT_ALPHABET.includes(char))).toBe(true);
    expect(giftCodeFromBytes([255, 255, 255])).toBeNull();
  });

  it('reads a typed code in any case, with spaces or a hyphen', () => {
    expect(normalizeGiftCode(' k7m-x4p ')).toBe('K7MX4P');
    expect(normalizeGiftCode('K7MX4')).toBeNull();
    expect(normalizeGiftCode('K0MX4P')).toBeNull();
    expect(formatGiftCode('K7MX4P')).toBe('K7M-X4P');
  });

  it('turns the day over at midnight in Laos', () => {
    expect(laosDay(new Date('2026-10-19T16:59:00Z'))).toBe('2026-10-19');
    expect(laosDay(new Date('2026-10-19T17:00:00Z'))).toBe('2026-10-20');
  });

  it('reads only a device id and a shop code from the request — never a score', () => {
    expect(parseGiftRequest({ device: DEVICE, partner: 'vte-01', score: 99 })).toEqual({ device: DEVICE, partner: 'VTE-01' });
    expect(parseGiftRequest({ device: DEVICE, partner: '<bad>' })).toEqual({ device: DEVICE, partner: null });
    expect(parseGiftRequest({ device: 'short' })).toBeNull();
    expect(parseRedeem({ code: 'X', action: 'delete' })).toBeNull();
    expect(parseRedeem({ code: 'X' })?.action).toBe('check');
  });

  it('issues one code per phone per day, the same one if asked again, a new one tomorrow', async () => {
    const first = await post('/api/gift', { device: DEVICE, partner: 'VTE-01' });
    expect(first.status).toBe(201);
    const issued = (await first.json()) as { code: string; display: string; issuedOn: string; partner: string };
    expect(issued.issuedOn).toBe('2026-10-19');
    expect(issued.partner).toBe('VTE-01');
    expect(issued.display).toBe(formatGiftCode(issued.code));

    const again = (await (await post('/api/gift', { device: DEVICE })).json()) as { code: string };
    expect(again.code).toBe(issued.code);

    const other = (await (await post('/api/gift', { device: 'dev_zzzzzzzzzzzzzzzz9999' })).json()) as { code: string };
    expect(other.code).not.toBe(issued.code);

    clock += 24 * 60 * 60 * 1000;
    const tomorrow = (await (await post('/api/gift', { device: DEVICE })).json()) as { code: string };
    expect(tomorrow.code).not.toBe(issued.code);

    const stored = sqlite.prepare('SELECT device FROM gift_codes LIMIT 1').get() as { device: string };
    expect(stored.device).not.toContain(DEVICE); // only a hash of the device id is kept
  });

  it('refuses a gift request without a well-formed device id', async () => {
    expect((await post('/api/gift', { partner: 'VTE-01' })).status).toBe(400);
  });

  it('checks, redeems once, and then says «already used»', async () => {
    const { code } = (await (await post('/api/gift', { device: DEVICE })).json()) as { code: string };
    const pin = { 'x-staff-pin': PIN };
    const typed = formatGiftCode(code).toLowerCase();

    const check = (await (await post('/api/gift/redeem', { code: typed }, pin)).json()) as { status: string };
    expect(check.status).toBe('valid');
    const redeem = (await (await post('/api/gift/redeem', { code: typed, action: 'redeem' }, pin)).json()) as {
      status: string;
      redeemedAt: string;
    };
    expect(redeem.status).toBe('redeemed');
    expect(redeem.redeemedAt).toBe('2026-10-19T03:00:00.000Z');
    const second = (await (await post('/api/gift/redeem', { code, action: 'redeem' }, pin)).json()) as { status: string };
    expect(second.status).toBe('used');

    const unknown = (await (await post('/api/gift/redeem', { code: 'KKKKKK', action: 'redeem' }, pin)).json()) as {
      status: string;
    };
    expect(unknown.status).toBe('unknown');
  });

  it('needs the staff PIN in the header, and locks out after repeated wrong PINs', async () => {
    const { code } = (await (await post('/api/gift', { device: DEVICE })).json()) as { code: string };
    expect((await post('/api/gift/redeem', { code })).status).toBe(401);
    for (let i = 2; i < LOCKOUT.perIpFailures; i += 1) {
      expect((await post('/api/gift/redeem', { code }, { 'x-staff-pin': '000000' })).status).toBe(401);
    }
    expect((await post('/api/gift/redeem', { code }, { 'x-staff-pin': '000000' })).status).toBe(429);
    expect((await post('/api/gift/redeem', { code }, { 'x-staff-pin': PIN })).status).toBe(429);
    expect((await post('/api/gift/redeem', { code }, { 'x-staff-pin': PIN }, '198.51.100.9')).status).toBe(200);
  });

  it('locks the PIN for everyone after many wrong PINs from many places', async () => {
    for (let i = 0; i < LOCKOUT.globalPinFailures; i += 1) {
      await post('/api/gift/redeem', { code: 'KKKKKK' }, { 'x-staff-pin': '000000' }, `10.0.${Math.floor(i / 4)}.${i % 4}`);
    }
    expect((await post('/api/gift/redeem', { code: 'KKKKKK' }, { 'x-staff-pin': PIN }, '192.0.2.1')).status).toBe(429);
  });

  it('refuses to redeem when the PIN is not configured', async () => {
    delete env.STAFF_GIFT_PIN;
    expect((await post('/api/gift/redeem', { code: 'KKKKKK' }, { 'x-staff-pin': PIN })).status).toBe(500);
  });

  it('answers 503 rather than a fake code when the database fails', async () => {
    env.DB = {
      prepare: () => {
        throw new Error('down');
      },
    };
    const response = await post('/api/gift', { device: DEVICE });
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: 'unavailable' });
  });
});
