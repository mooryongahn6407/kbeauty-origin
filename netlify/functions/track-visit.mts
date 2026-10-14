/**
 * Counts one partner visit — never a name, a phone number or a device id (decision ② in
 * `docs/기억/05_결정대기.md`: "파트너별 손님 수를 센다, 이름·전화번호 없이 숫자만").
 *
 * Each visit writes its own key instead of incrementing a shared counter. Netlify Blobs has no
 * transactional read-modify-write — its own reference says to build counters on Netlify DB, not
 * on a blob — so a blind write of a brand-new key is the safe move here: it can never race with
 * another visit or lose an update, because nothing is ever read back and rewritten.
 * `partner-report.mts` counts visits by *listing* these keys, never by reading a stored total.
 *
 * Key shape: v1/<code>/<yyyyMM>/<event>/<track-or-dash>/<timestamp>-<random>
 * The value is empty — everything the report needs is in the key itself, so a count never has
 * to read a blob's body, only list its keys.
 */
import { getStore } from '@netlify/blobs';
import type { Config, Context } from '@netlify/functions';
import { normalizePartnerCode } from '../../src/app/partner-shape';

const EVENTS = new Set(['open', 'result']);
const TRACKS = new Set(['face', 'scalp', 'body']);

export default async (req: Request, _context: Context) => {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response('Bad request', { status: 400 });
  }
  const { code, event, track } = (body && typeof body === 'object' ? body : {}) as Record<
    string,
    unknown
  >;
  const normalized = typeof code === 'string' ? normalizePartnerCode(code) : null;
  if (!normalized || typeof event !== 'string' || !EVENTS.has(event)) {
    return new Response('Bad request', { status: 400 });
  }
  const trackPart =
    event === 'result' && typeof track === 'string' && TRACKS.has(track) ? track : '-';
  const month = new Date().toISOString().slice(0, 7).replace('-', '');
  const random = Math.random().toString(36).slice(2, 8);
  const key = `v1/${normalized}/${month}/${event}/${trackPart}/${Date.now()}-${random}`;

  try {
    await getStore('partner-visits').set(key, '');
  } catch {
    // A dropped count never breaks the reader's screen — nothing here throws outward.
  }
  return new Response(null, { status: 204 });
};

export const config: Config = { method: ['POST'] };
