/**
 * The store gift on the reader's side (src/app/gift.ts) — CEO card sqglow_10.
 *
 * The lines held here: the code comes only from the server, a failure never turns into a
 * made-up code, the request carries a device id and a shop code and nothing about how the
 * reader did, and the gift lives nowhere near learning scores or the 7-day routine check.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  GIFT_ENDPOINT,
  giftDeviceId,
  giftRequestBody,
  requestGift,
  saveGift,
  savedGift,
  staffGiftCall,
} from '@/app/gift';
import { laosDay } from '@/app/gift-code';

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
  };
}

const reply = (status: number, body?: unknown) =>
  (async () => new Response(body === undefined ? null : JSON.stringify(body), { status })) as unknown as typeof fetch;

describe('the device id', () => {
  it('is made once and kept', () => {
    const storage = memoryStorage();
    const first = giftDeviceId(storage);
    expect(first).toMatch(/^[A-Za-z0-9_-]{16,64}$/);
    expect(giftDeviceId(storage)).toBe(first);
  });

  it('is null when storage is missing or blocked, so no request is sent without one', () => {
    expect(giftDeviceId(undefined)).toBeNull();
    const blocked = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => undefined,
    };
    expect(giftDeviceId(blocked)).toBeNull();
  });
});

describe('asking the server for a code', () => {
  it('sends the device id and the shop code, and nothing else', async () => {
    expect(giftRequestBody('dev_abcdefghijklmnop', 'VTE-01')).toEqual({ device: 'dev_abcdefghijklmnop', partner: 'VTE-01' });
    expect(giftRequestBody('dev_abcdefghijklmnop', null)).toEqual({ device: 'dev_abcdefghijklmnop' });
    let sent: { url: string; body: string } | null = null;
    const fetcher = (async (url: string, init: RequestInit) => {
      sent = { url, body: String(init.body) };
      return new Response(JSON.stringify({ code: 'K7MX4P', issuedOn: '2026-10-19' }), { status: 201 });
    }) as unknown as typeof fetch;
    const result = await requestGift('dev_abcdefghijklmnop', 'VTE-01', fetcher);
    expect(result).toEqual({ status: 'ready', gift: { code: 'K7MX4P', issuedOn: '2026-10-19' } });
    expect(sent!.url).toBe(GIFT_ENDPOINT);
    expect(Object.keys(JSON.parse(sent!.body)).sort()).toEqual(['device', 'partner']);
  });

  it('never makes a code up: offline, refused or garbled is «unavailable»', async () => {
    const offline = (async () => {
      throw new TypeError('Failed to fetch');
    }) as unknown as typeof fetch;
    expect(await requestGift('dev_abcdefghijklmnop', null, offline)).toEqual({ status: 'unavailable' });
    expect(await requestGift('dev_abcdefghijklmnop', null, reply(503, { error: 'unavailable' }))).toEqual({
      status: 'unavailable',
    });
    expect(await requestGift('dev_abcdefghijklmnop', null, reply(429))).toEqual({ status: 'unavailable' });
    expect(await requestGift('dev_abcdefghijklmnop', null, reply(200, { code: 'KG-261019-21', issuedOn: '2026-10-19' }))).toEqual({
      status: 'unavailable',
    });
  });

  it('keeps today’s code on the phone, and forgets it the next day', () => {
    const storage = memoryStorage();
    const now = new Date('2026-10-19T03:00:00Z');
    saveGift(storage, { code: 'K7MX4P', issuedOn: laosDay(now) });
    expect(savedGift(storage, now)).toEqual({ code: 'K7MX4P', issuedOn: '2026-10-19' });
    expect(savedGift(storage, new Date('2026-10-20T03:00:00Z'))).toBeNull();
    expect(savedGift(memoryStorage({ 'korea-glow:gift:v1': 'rubbish' }), now)).toBeNull();
  });
});

describe('the shop check', () => {
  it('sends the PIN in a header, never in the address', async () => {
    let seen: { url: string; pin: string | null } | null = null;
    const fetcher = (async (url: string, init: RequestInit) => {
      seen = { url, pin: new Headers(init.headers).get('x-staff-pin') };
      return new Response(JSON.stringify({ status: 'valid', display: 'K7M-X4P', issuedOn: '2026-10-19', partner: null }));
    }) as unknown as typeof fetch;
    const result = await staffGiftCall('482915', 'k7m-x4p', 'check', fetcher);
    expect(result.status).toBe('valid');
    expect(seen!.pin).toBe('482915');
    expect(seen!.url).not.toContain('482915');
  });

  it('turns each server answer into what the staff screen says', async () => {
    expect((await staffGiftCall('1', 'X', 'check', reply(401))).status).toBe('badPin');
    expect((await staffGiftCall('1', 'X', 'check', reply(429))).status).toBe('locked');
    expect((await staffGiftCall('1', 'X', 'check', reply(500))).status).toBe('notConfigured');
    expect((await staffGiftCall('1', 'X', 'check', reply(200, { status: 'unknown' }))).status).toBe('unknown');
    expect((await staffGiftCall('1', 'X', 'redeem', reply(200, { status: 'used', redeemedAt: 'x' }))).status).toBe('used');
  });
});

describe('the gift stays out of learning and the 7-day check', () => {
  const read = (path: string) => readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8');

  it('is not imported by the mastery ledger, the routine week or the collection', () => {
    for (const path of ['mastery/mastery-ledger.ts', 'app/routine-week.ts', 'app/collection.ts']) {
      expect(read(path)).not.toMatch(/from ['"][^'"]*gift/);
    }
  });

  it('does not read a score, an answer or mastery state to ask for a gift', () => {
    const imports = read('app/gift.ts').match(/^import .*$/gm) ?? [];
    expect(imports.join('\n')).not.toMatch(/mastery|care-quest|routine-week|collection|academy/);
    expect(requestGift.length).toBeGreaterThanOrEqual(2); // (device, partner, …transport)
  });
});
