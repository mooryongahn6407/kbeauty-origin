/**
 * The shape of a store gift code, shared by the app (which shows it) and the Cloudflare Worker
 * (which issues and redeems it — `cloudflare/worker.ts`). Pure: no storage, no network, so both
 * sides import the same checks and a code can never be well-formed on one side and not the other.
 *
 * Why the server issues it (CEO card sqglow_10, 2026-10-18): the old code was the date plus a
 * checksum over it, so anyone who saw one could write tomorrow's. A code is now a random draw
 * the server remembers, tied to one phone and one day, and a shop marks it used once.
 *
 * The alphabet leaves out letters and digits that are read or typed as one another — 0/O/Q/D,
 * 1/I/L, 2/Z, 5/S, 6/G, 8/B — so a staff member reading it off a customer's screen cannot
 * mistype it into a different, valid code.
 */
export const GIFT_ALPHABET = 'ACEFHJKMNPRTUVWXY3479';
export const GIFT_CODE_LENGTH = 6;

/** A device id is a random token the app makes once and keeps on the phone (see `gift.ts`). */
export const DEVICE_ID_SHAPE = /^[A-Za-z0-9_-]{16,64}$/;

/**
 * A code from random bytes, or null when the bytes run out before six usable ones (each byte is
 * kept only below the largest multiple of the alphabet size, so no letter is likelier than
 * another). The caller passes fresh bytes and tries again.
 */
export function giftCodeFromBytes(bytes: ArrayLike<number>): string | null {
  const size = GIFT_ALPHABET.length;
  const ceiling = 256 - (256 % size);
  let code = '';
  for (let i = 0; i < bytes.length && code.length < GIFT_CODE_LENGTH; i += 1) {
    const byte = bytes[i]!;
    if (byte < ceiling) code += GIFT_ALPHABET[byte % size];
  }
  return code.length === GIFT_CODE_LENGTH ? code : null;
}

/** A fresh random code. `fill` is `crypto.getRandomValues` (injected so tests can pin it). */
export function newGiftCode(fill: (bytes: Uint8Array) => Uint8Array): string {
  for (;;) {
    const code = giftCodeFromBytes(fill(new Uint8Array(16)));
    if (code) return code;
  }
}

/** What a person typed (any case, spaces or a hyphen) → the stored code, or null if it cannot be one. */
export function normalizeGiftCode(raw: unknown): string | null {
  if (typeof raw !== 'string' || raw.length > 32) return null;
  const code = raw.toUpperCase().replace(/[\s-]/g, '');
  if (code.length !== GIFT_CODE_LENGTH) return null;
  return [...code].every((char) => GIFT_ALPHABET.includes(char)) ? code : null;
}

/** `K7MX4P` → `K7M-X4P`, the way it is shown and read aloud. */
export function formatGiftCode(code: string): string {
  return code.length === GIFT_CODE_LENGTH ? `${code.slice(0, 3)}-${code.slice(3)}` : code;
}

/**
 * The calendar day in Laos (UTC+7, no daylight saving), as `yyyy-mm-dd` — the day a gift belongs
 * to, so «one a day» turns over at midnight where the shops are, not at midnight in London.
 */
export function laosDay(now: Date): string {
  return new Date(now.getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/** `yyyyMM` in Laos time — the month a partner visit is counted under. */
export function laosMonth(now: Date): string {
  return laosDay(now).slice(0, 7).replace('-', '');
}
