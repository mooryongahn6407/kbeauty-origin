/**
 * The shape of a partner shop code, split out from `partner.ts` so that the Netlify function
 * which counts visits (`netlify/functions/track-visit.mts`) can import this one pure check
 * without pulling in `partner.ts`'s device-storage functions, which assume a browser `Storage`
 * that does not exist in a serverless function.
 */

/** Letters, digits and single hyphens; 3–16 characters. */
export const PARTNER_CODE_SHAPE = /^[A-Z0-9](?:[A-Z0-9]|-(?=[A-Z0-9])){2,15}$/;

/** Upper-cases and checks the shape; null for anything that is not a well-formed code. */
export function normalizePartnerCode(raw: string | null | undefined): string | null {
  if (typeof raw !== 'string') return null;
  const code = raw.trim().toUpperCase();
  return PARTNER_CODE_SHAPE.test(code) ? code : null;
}
