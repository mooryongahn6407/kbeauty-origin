/**
 * The Cloudflare Worker in front of GLOW Class.
 *
 * Everything is the built app (`env.ASSETS`), except one small endpoint: `/api/like`, the shared
 * Like count. The wrangler config routes only `/api/*` here first (`assets.run_worker_first`),
 * so every screen, picture and script is served exactly as before.
 *
 *   GET  /api/like                        → { count }
 *   POST /api/like  { "action": "like" }  → { count }   (one more)
 *   POST /api/like  { "action": "unlike" }→ { count }   (one fewer, never below 0)
 *
 * What this deliberately is not:
 * - Not a count of people. A like is a button press remembered on one phone; the same person on
 *   two phones counts twice. The app says "Like", never "N people liked this".
 * - Not exact under a burst. KV has no atomic increment, so two presses in the same instant can
 *   land as one. For a like count that is an acceptable error, and it only ever errs low.
 * - Not personal data. The rate limit keys on a SHA-256 of the visitor's IP, kept for 60 seconds,
 *   never the IP itself, and nothing else about the visitor is stored.
 * - Not open to other sites. A change must come from this same origin; no CORS header is sent.
 */

/** The two KV calls this Worker uses — declared here so the repo needs no Workers type package. */
export interface LikeStore {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

export interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  LIKES?: LikeStore;
}

export const LIKE_PATH = '/api/like';
export const COUNT_KEY = 'count';
/** Changes one visitor may make per window before getting 429. */
export const RATE_LIMIT = 6;
/** KV's shortest allowed expiry. */
export const RATE_WINDOW_SECONDS = 60;
/** `{"action":"unlike"}` is 19 bytes; anything much larger is not a like. */
export const MAX_BODY_BYTES = 128;

const HEADERS: Readonly<Record<string, string>> = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
};

function json(body: unknown, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...HEADERS, ...extra } });
}

/** A stored count read back as a whole number ≥ 0 — anything else counts as 0. */
export function readCount(raw: string | null): number {
  const n = Number.parseInt(raw ?? '', 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/**
 * True when the request comes from this same origin. A POST must carry a matching `Origin`
 * (every browser sends one on a POST); `Sec-Fetch-Site`, when present, must say same-origin.
 * A GET without either is allowed — reading the count reveals nothing.
 */
export function isSameOrigin(request: Request): boolean {
  const site = request.headers.get('sec-fetch-site');
  if (site && site !== 'same-origin') return false;
  const origin = request.headers.get('origin');
  if (origin) return origin === new URL(request.url).origin;
  return request.method === 'GET';
}

async function visitorKey(request: Request): Promise<string> {
  const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`glow-like:${ip}`));
  const hex = Array.from(new Uint8Array(digest).slice(0, 12), (b) => b.toString(16).padStart(2, '0'));
  return `rl:${hex.join('')}`;
}

export async function handleLike(request: Request, env: Env): Promise<Response> {
  const store = env.LIKES;
  if (!store) return json({ error: 'unavailable' }, 503);
  if (!isSameOrigin(request)) return json({ error: 'forbidden' }, 403);

  if (request.method === 'GET') {
    return json({ count: readCount(await store.get(COUNT_KEY)) });
  }
  if (request.method !== 'POST') {
    return json({ error: 'method' }, 405, { allow: 'GET, POST' });
  }

  const declared = Number.parseInt(request.headers.get('content-length') ?? '0', 10);
  if (declared > MAX_BODY_BYTES) return json({ error: 'too large' }, 413);
  const body = await request.text();
  if (body.length > MAX_BODY_BYTES) return json({ error: 'too large' }, 413);

  let action: unknown;
  try {
    action = (JSON.parse(body) as { action?: unknown } | null)?.action;
  } catch {
    return json({ error: 'bad request' }, 400);
  }
  if (action !== 'like' && action !== 'unlike') return json({ error: 'bad request' }, 400);

  const key = await visitorKey(request);
  const changes = readCount(await store.get(key));
  const current = readCount(await store.get(COUNT_KEY));
  if (changes >= RATE_LIMIT) {
    return json({ count: current, error: 'slow down' }, 429, { 'retry-after': String(RATE_WINDOW_SECONDS) });
  }
  await store.put(key, String(changes + 1), { expirationTtl: RATE_WINDOW_SECONDS });

  const next = Math.max(0, current + (action === 'like' ? 1 : -1));
  if (next !== current) await store.put(COUNT_KEY, String(next));
  return json({ count: next });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === LIKE_PATH) return handleLike(request, env);
    if (pathname.startsWith('/api/')) return json({ error: 'not found' }, 404);
    return env.ASSETS.fetch(request);
  },
};
