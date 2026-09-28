/**
 * Which partner shop sent a reader here.
 *
 * A salon or shop gives its customers a link (usually a QR code on the counter) that carries its
 * own code: `?p=VTE-01`. The app remembers that code on this device and prints it on the store
 * gift card, so when the reader shows the card, the shop can see the visit came through it.
 *
 * What this deliberately is not:
 * - Not part of the gift code. `issueGift` takes a date and nothing else (see its test); the
 *   partner code is a separate line beside it, so no one can mistake it for something earned.
 * - Not mastery, loyalty or status (rule 9). Nothing here touches the mastery ledger, and the
 *   ledger never learns a partner code exists.
 * - Not commerce inside the app. There is no price, commission, cart or order here, and no list
 *   of partners: the code is whatever the shop's own link says, validated only for shape.
 * - Not personal data. It identifies a shop, never the reader, and never leaves the device.
 */
export const PARTNER_PARAM = 'p';
const STORAGE_KEY = 'korea-glow:partner:v1';

/** Letters, digits and single hyphens; 3–16 characters; stored upper-case. */
const SHAPE = /^[A-Z0-9](?:[A-Z0-9]|-(?=[A-Z0-9])){2,15}$/;

export function normalizePartnerCode(raw: string | null | undefined): string | null {
  if (typeof raw !== 'string') return null;
  const code = raw.trim().toUpperCase();
  return SHAPE.test(code) ? code : null;
}

/** The partner code carried by a link's query string, if it carries a well-formed one. */
export function partnerFromSearch(search: string): string | null {
  try {
    return normalizePartnerCode(new URLSearchParams(search).get(PARTNER_PARAM));
  } catch {
    return null;
  }
}

export function loadPartner(storage: Pick<Storage, 'getItem'> | undefined): string | null {
  try {
    return normalizePartnerCode(storage?.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

export function savePartner(storage: Pick<Storage, 'setItem'> | undefined, code: string): void {
  try {
    storage?.setItem(STORAGE_KEY, code);
  } catch {
    // Private windows and full storage: the card simply shows no shop line.
  }
}

/**
 * Called once when the app opens. A new, well-formed code in the link replaces the remembered
 * one (the reader walked into a different shop); a missing or malformed one changes nothing.
 * Returns the code now in effect.
 */
export function capturePartner(
  search: string,
  storage: (Pick<Storage, 'getItem'> & Pick<Storage, 'setItem'>) | undefined,
): string | null {
  const fromLink = partnerFromSearch(search);
  if (fromLink) {
    savePartner(storage, fromLink);
    return fromLink;
  }
  return loadPartner(storage);
}
