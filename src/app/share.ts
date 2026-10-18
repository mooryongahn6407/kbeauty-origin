/**
 * What the Share sheet sends. Always the real public address — never the preview host or
 * whatever address the reader happens to be on — with the reader's language, and the partner
 * shop's code when the reader came in through one, so the shop keeps the credit for whoever
 * opens the link next (see `partner.ts` for what that code is and is not).
 *
 * Nothing here counts shares. Every button opens the reader's own app or copies a link; the app
 * never learns whether anything was sent.
 */
import { PARTNER_PARAM, normalizePartnerCode } from './partner';

export const PUBLIC_APP_URL = 'https://app.korea-glow.com/';
export const SHARE_TITLE = 'GLOW Class · KOREA GLOW';

export function publicShareUrl(locale: string, partner: string | null | undefined): string {
  const url = new URL(PUBLIC_APP_URL);
  if (/^[a-z]{2,3}$/.test(locale)) url.searchParams.set('lang', locale);
  const code = normalizePartnerCode(partner ?? null);
  if (code) url.searchParams.set(PARTNER_PARAM, code);
  return url.toString();
}

export function whatsappShareHref(text: string, url: string): string {
  return `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;
}

export function facebookShareHref(url: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}
