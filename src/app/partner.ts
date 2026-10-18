/**
 * Which partner shop sent a reader here.
 *
 * A salon or shop gives its customers a link (usually a QR code on the counter) that carries its
 * own code: `?p=VTE-01`. The app remembers that code on this device and prints it on the store
 * gift card (and sends it with the gift request, so the shop sees it at the check), so when the reader shows the card, the shop can see the visit came through it.
 *
 * What this deliberately is not:
 * - Not part of the gift code. The code is random (`gift-code.ts`, issued by the server); the
 *   partner code is stored beside it and printed on a separate line, so no one can mistake it
 *   for something earned.
 * - Not mastery, loyalty or status (rule 9). Nothing here touches the mastery ledger, and the
 *   ledger never learns a partner code exists.
 * - Not commerce inside the app. There is no price, commission, cart or order here, and no list
 *   of partners: the code is whatever the shop's own link says, validated only for shape.
 * - Not personal data. It identifies a shop, never the reader, and leaves the device only as
 *   that shop code, on a visit count or a gift request.
 */
import { normalizePartnerCode } from './partner-shape';

export { normalizePartnerCode } from './partner-shape';

export const PARTNER_PARAM = 'p';
const STORAGE_KEY = 'korea-glow:partner:v1';

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

/** A shop's own link — the app's front door carrying its code — or null for a malformed code. */
export function shopLink(base: string, raw: string): string | null {
  const code = normalizePartnerCode(raw);
  return code ? `${base}?${PARTNER_PARAM}=${encodeURIComponent(code)}` : null;
}
