/**
 * The Like button: a real shared count or none at all.
 *
 *   1. The Worker (`cloudflare/worker.ts`) keeps the count in KV, never below zero, only for
 *      same-origin requests, with a small body limit and a per-visitor rate limit — and serves
 *      every other path from the built app untouched.
 *   2. The app (`src/app/like.ts`) remembers this phone's press, prints the number only from
 *      `LIKE_COUNT_SHOWN_FROM` up, and turns every network failure into "no number".
 */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it } from 'vitest';
import worker, {
  COUNT_KEY,
  LIKE_PATH,
  MAX_BODY_BYTES,
  RATE_LIMIT,
  RATE_WINDOW_SECONDS,
  handleLike,
  isSameOrigin,
  readCount,
  type Env,
  type LikeStore,
} from '../cloudflare/worker';
import {
  LIKE_COUNT_SHOWN_FROM,
  LIKE_ENDPOINT,
  LIKE_STORAGE_KEY,
  fetchLikeCount,
  formatLikeCount,
  loadLiked,
  optimisticCount,
  parseLikeCount,
  saveLiked,
  sendLike,
  shownLikeCount,
} from '@/app/like';
import { LikeShareBar, resetLikeStateForTests } from '@/ui/components/LikeShare';

const ORIGIN = 'https://glow-next.korea-glow.com';

class MemoryKV implements LikeStore {
  readonly data = new Map<string, string>();
  readonly ttl = new Map<string, number | undefined>();
  async get(key: string) {
    return this.data.get(key) ?? null;
  }
  async put(key: string, value: string, options?: { expirationTtl?: number }) {
    this.data.set(key, value);
    this.ttl.set(key, options?.expirationTtl);
  }
}

const env = (kv: LikeStore | null = new MemoryKV()): Env => ({
  ASSETS: { fetch: async (request) => new Response(`asset:${new URL(request.url).pathname}`) },
  ...(kv ? { LIKES: kv } : {}),
});

function post(body: string, headers: Record<string, string> = {}, ip = '203.0.113.7'): Request {
  return new Request(`${ORIGIN}${LIKE_PATH}`, {
    method: 'POST',
    headers: { origin: ORIGIN, 'content-type': 'application/json', 'cf-connecting-ip': ip, ...headers },
    body,
  });
}
const like = (ip?: string) => post(JSON.stringify({ action: 'like' }), {}, ip);
const unlike = (ip?: string) => post(JSON.stringify({ action: 'unlike' }), {}, ip);
const get = (headers: Record<string, string> = {}) => new Request(`${ORIGIN}${LIKE_PATH}`, { headers });

describe('the like Worker', () => {
  it('serves every other path from the built app, and unknown /api/ paths as 404', async () => {
    const e = env();
    expect(await (await worker.fetch(new Request(`${ORIGIN}/`), e)).text()).toBe('asset:/');
    expect(await (await worker.fetch(new Request(`${ORIGIN}/assets/app.js`), e)).text()).toBe('asset:/assets/app.js');
    expect((await worker.fetch(new Request(`${ORIGIN}/api/other`), e)).status).toBe(404);
  });

  it('starts at 0, counts likes and unlikes, and never goes below 0', async () => {
    const kv = new MemoryKV();
    const e = env(kv);
    expect(await (await handleLike(get(), e)).json()).toEqual({ count: 0 });
    expect(await (await handleLike(unlike(), e)).json()).toEqual({ count: 0 });
    expect(await (await handleLike(like('198.51.100.1'), e)).json()).toEqual({ count: 1 });
    expect(await (await handleLike(like('198.51.100.2'), e)).json()).toEqual({ count: 2 });
    expect(await (await handleLike(unlike('198.51.100.2'), e)).json()).toEqual({ count: 1 });
    expect(kv.data.get(COUNT_KEY)).toBe('1');
    const response = await handleLike(get(), e);
    expect(response.headers.get('content-type')).toMatch(/application\/json/);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(response.headers.get('access-control-allow-origin')).toBeNull();
  });

  it('rate-limits one visitor to a few changes a minute, by a hash of the IP — never the IP', async () => {
    const kv = new MemoryKV();
    const e = env(kv);
    for (let i = 0; i < RATE_LIMIT; i += 1) {
      expect((await handleLike(i % 2 ? unlike() : like(), e)).status).toBe(200);
    }
    const blocked = await handleLike(like(), e);
    expect(blocked.status).toBe(429);
    expect(((await blocked.json()) as { count: number }).count).toBe(0);
    // Somebody else is not slowed down.
    expect((await handleLike(like('192.0.2.50'), e)).status).toBe(200);
    const keys = [...kv.data.keys()].filter((key) => key !== COUNT_KEY);
    expect(keys.every((key) => /^rl:[0-9a-f]{24}$/.test(key))).toBe(true);
    expect(JSON.stringify([...kv.data])).not.toContain('203.0.113.7');
    expect([...kv.ttl.entries()].filter(([key]) => key !== COUNT_KEY).every(([, ttl]) => ttl === RATE_WINDOW_SECONDS)).toBe(true);
  });

  it('refuses other sites, other methods, junk and oversized bodies', async () => {
    const e = env();
    expect((await handleLike(post('{"action":"like"}', { origin: 'https://evil.example' }), e)).status).toBe(403);
    expect((await handleLike(post('{"action":"like"}', { 'sec-fetch-site': 'cross-site' }), e)).status).toBe(403);
    const noOrigin = new Request(`${ORIGIN}${LIKE_PATH}`, { method: 'POST', body: '{"action":"like"}' });
    expect((await handleLike(noOrigin, e)).status).toBe(403);
    expect((await handleLike(new Request(`${ORIGIN}${LIKE_PATH}`, { method: 'PUT', headers: { origin: ORIGIN } }), e)).status).toBe(405);
    expect((await handleLike(post('not json'), e)).status).toBe(400);
    expect((await handleLike(post('{"action":"love"}'), e)).status).toBe(400);
    expect((await handleLike(post(JSON.stringify({ action: 'like', pad: 'x'.repeat(MAX_BODY_BYTES) })), e)).status).toBe(413);
    expect((await handleLike(get(), env(null))).status).toBe(503);
  });

  it('a GET from this page is allowed; a GET another site reads in a browser is not', () => {
    expect(isSameOrigin(get())).toBe(true);
    expect(isSameOrigin(get({ 'sec-fetch-site': 'same-origin' }))).toBe(true);
    expect(isSameOrigin(get({ 'sec-fetch-site': 'cross-site' }))).toBe(false);
  });

  it('reads a damaged stored count as 0', () => {
    expect(readCount(null)).toBe(0);
    expect(readCount('-4')).toBe(0);
    expect(readCount('abc')).toBe(0);
    expect(readCount('12')).toBe(12);
  });
});

describe('the like button on the phone', () => {
  it('remembers this phone’s press under korea-glow:like:v1, and survives a broken storage', () => {
    const store = new Map<string, string>();
    const storage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
    };
    expect(loadLiked(storage)).toBe(false);
    saveLiked(storage, true);
    expect(store.get(LIKE_STORAGE_KEY)).toBe('1');
    expect(loadLiked(storage)).toBe(true);
    saveLiked(storage, false);
    expect(loadLiked(storage)).toBe(false);
    const broken = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
      removeItem: () => {
        throw new Error('blocked');
      },
    };
    expect(loadLiked(broken)).toBe(false);
    expect(() => saveLiked(broken, true)).not.toThrow();
    expect(loadLiked(undefined)).toBe(false);
  });

  it('prints the number only when it is real and at least the threshold', () => {
    expect(LIKE_COUNT_SHOWN_FROM).toBe(10);
    expect(shownLikeCount(null)).toBeNull();
    expect(shownLikeCount(0)).toBeNull();
    expect(shownLikeCount(LIKE_COUNT_SHOWN_FROM - 1)).toBeNull();
    expect(shownLikeCount(LIKE_COUNT_SHOWN_FROM)).toBe(LIKE_COUNT_SHOWN_FROM);
    expect(formatLikeCount(12, 'en')).toBe('12');
    expect(formatLikeCount(1234, 'en')).toBe('1.2K');
  });

  it('moves the count by one at once, and never invents one it does not have', () => {
    expect(optimisticCount(null, 'like')).toBeNull();
    expect(optimisticCount(10, 'like')).toBe(11);
    expect(optimisticCount(0, 'unlike')).toBe(0);
    expect(parseLikeCount({ count: 3 })).toBe(3);
    expect(parseLikeCount({ count: -1 })).toBeNull();
    expect(parseLikeCount({ count: '3' })).toBeNull();
    expect(parseLikeCount(null)).toBeNull();
  });

  it('turns offline, errors and junk into "no number", and sends only the action', async () => {
    const calls: { input: string; init?: RequestInit }[] = [];
    const ok = async (input: string, init?: RequestInit) => {
      calls.push({ input, ...(init ? { init } : {}) });
      return new Response(JSON.stringify({ count: 41 }), { status: 200 });
    };
    expect(await fetchLikeCount(ok)).toBe(41);
    expect(await sendLike('like', ok)).toBe(41);
    expect(calls[1]!.input).toBe(LIKE_ENDPOINT);
    expect(calls[1]!.init?.method).toBe('POST');
    expect(calls[1]!.init?.body).toBe('{"action":"like"}');
    expect(await fetchLikeCount(async () => Promise.reject(new TypeError('offline')))).toBeNull();
    expect(await fetchLikeCount(async () => new Response('oops', { status: 500 }))).toBeNull();
    expect(await fetchLikeCount(async () => new Response('<html>', { status: 200 }))).toBeNull();
    expect(await sendLike('like', async () => new Response('{"count":7}', { status: 429 }))).toBe(7);
    expect(await fetchLikeCount(null)).toBeNull();
  });
});

describe('the Like · Share bar', () => {
  beforeEach(() => resetLikeStateForTests());

  it('shows the label and no number before any count is known, in every language', () => {
    for (const [locale, label] of [
      ['ko', '좋아요'],
      ['en', 'Like'],
      ['lo', 'ມັກ'],
      ['th', 'ถูกใจ'],
      ['fr', 'J&#x27;aime'],
    ] as const) {
      const html = renderToStaticMarkup(createElement(LikeShareBar, { locale, ask: true }));
      expect(html).toContain(label);
      expect(html).not.toContain('kg-pill__count');
      expect(html).toContain('aria-pressed="false"');
      expect(html).toContain('<svg');
      expect(html).not.toMatch(/[\u{1F300}-\u{1FAFF}]/u);
    }
  });
});
