/**
 * The store gift, on the reader's side (CEO card sqglow_10, 2026-10-18).
 *
 * Earned by finishing the skin game — a thing someone *did* — never by scoring well, and never by
 * the 7-day routine check (`routine-week.ts`, which gives nothing on purpose). What is sent to ask
 * for one is the whole guarantee: this phone's random id and the shop code that brought the
 * reader, if any. No score, answer or progress is ever part of the request.
 *
 * The code itself comes from the server (`cloudflare/worker.ts`, POST /api/gift): a random code
 * for this phone and this Laos day, remembered there, which a shop marks used once. When the
 * server cannot be reached the card says so calmly and offers to try again — it never makes a
 * code up on the phone, because a code the server has never seen is worthless at the counter.
 *
 * What is kept on the phone: the random device id (so «one a day» holds), and today's code once
 * the server has issued it (so the card still shows it offline, later the same day).
 */
import { DEVICE_ID_SHAPE, laosDay, normalizeGiftCode } from './gift-code';

const DEVICE_KEY = 'korea-glow:gift-device:v1';
const GIFT_KEY = 'korea-glow:gift:v1';
export const GIFT_ENDPOINT = '/api/gift';

export interface IssuedGift {
  readonly code: string;
  readonly issuedOn: string;
}

type Store = Pick<Storage, 'getItem' | 'setItem'>;

/** This phone's random id for gifts, made once. Null when storage is unavailable. */
export function giftDeviceId(
  storage: Store | undefined,
  fill: (bytes: Uint8Array) => Uint8Array = (bytes) => crypto.getRandomValues(bytes),
): string | null {
  if (!storage) return null;
  try {
    const saved = storage.getItem(DEVICE_KEY);
    if (saved && DEVICE_ID_SHAPE.test(saved)) return saved;
    const bytes = fill(new Uint8Array(18));
    const id = btoa(String.fromCharCode(...bytes))
      .replaceAll('+', '-')
      .replaceAll('/', '_')
      .replaceAll('=', '');
    storage.setItem(DEVICE_KEY, id);
    return storage.getItem(DEVICE_KEY) === id ? id : null;
  } catch {
    return null;
  }
}

/** Today's code (Laos day), if the server already issued one to this phone. */
export function savedGift(storage: Pick<Storage, 'getItem'> | undefined, now: Date): IssuedGift | null {
  try {
    const raw = storage?.getItem(GIFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<IssuedGift>;
    const code = normalizeGiftCode(parsed.code);
    return code && parsed.issuedOn === laosDay(now) ? { code, issuedOn: parsed.issuedOn } : null;
  } catch {
    return null;
  }
}

export function saveGift(storage: Pick<Storage, 'setItem'> | undefined, gift: IssuedGift): void {
  try {
    storage?.setItem(GIFT_KEY, JSON.stringify(gift));
  } catch {
    // Not kept: the server still knows this phone's code and hands the same one back today.
  }
}

/** The body of a gift request — the device id and the shop code, and nothing else. */
export function giftRequestBody(device: string, partner: string | null): { device: string; partner?: string } {
  return partner ? { device, partner } : { device };
}

export type GiftResult = { readonly status: 'ready'; readonly gift: IssuedGift } | { readonly status: 'unavailable' };

/** Asks the server for today's code. Any failure — offline, slow, refused — is `unavailable`. */
export async function requestGift(
  device: string,
  partner: string | null,
  fetcher: typeof fetch = fetch,
  timeoutMs = 8000,
): Promise<GiftResult> {
  const controller = typeof AbortController === 'undefined' ? null : new AbortController();
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
  try {
    const response = await fetcher(GIFT_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(giftRequestBody(device, partner)),
      cache: 'no-store',
      ...(controller ? { signal: controller.signal } : {}),
    });
    if (!response.ok) return { status: 'unavailable' };
    const body = (await response.json()) as { code?: unknown; issuedOn?: unknown };
    const code = normalizeGiftCode(body.code);
    if (!code || typeof body.issuedOn !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(body.issuedOn)) {
      return { status: 'unavailable' };
    }
    return { status: 'ready', gift: { code, issuedOn: body.issuedOn } };
  } catch {
    return { status: 'unavailable' };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/* ---- The shop's side: checking and marking a code used (`?staff=gift`). ------------------- */

export const REDEEM_ENDPOINT = '/api/gift/redeem';

export type StaffResult =
  | {
      readonly status: 'valid' | 'used' | 'redeemed';
      readonly display: string;
      readonly issuedOn: string;
      readonly partner: string | null;
      readonly redeemedAt: string | null;
    }
  | { readonly status: 'unknown' | 'badPin' | 'locked' | 'notConfigured' | 'networkError' };

export async function staffGiftCall(
  pin: string,
  code: string,
  action: 'check' | 'redeem',
  fetcher: typeof fetch = fetch,
): Promise<StaffResult> {
  let response: Response;
  try {
    response = await fetcher(REDEEM_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-staff-pin': pin },
      body: JSON.stringify({ code, action }),
      cache: 'no-store',
    });
  } catch {
    return { status: 'networkError' };
  }
  if (response.status === 401) return { status: 'badPin' };
  if (response.status === 429) return { status: 'locked' };
  if (response.status === 500) return { status: 'notConfigured' };
  if (!response.ok) return { status: 'networkError' };
  try {
    const body = (await response.json()) as Record<string, unknown>;
    const status = body['status'];
    if (status === 'valid' || status === 'used' || status === 'redeemed') {
      return {
        status,
        display: String(body['display'] ?? ''),
        issuedOn: String(body['issuedOn'] ?? ''),
        partner: typeof body['partner'] === 'string' ? body['partner'] : null,
        redeemedAt: typeof body['redeemedAt'] === 'string' ? body['redeemedAt'] : null,
      };
    }
    return { status: 'unknown' };
  } catch {
    return { status: 'networkError' };
  }
}
