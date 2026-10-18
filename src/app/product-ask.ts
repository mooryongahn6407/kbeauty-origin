/**
 * «Ask about this product on WhatsApp» — a link to the company's WhatsApp Business number
 * (the only number any app may use, `HELP_DESK_NUMBER`) with a polite message already written in
 * the reader's language: the product's shelf number (e.g. A-69) or its code, its name, the
 * language, and the partner shop's code when she came in through one. Never a price.
 */
import { HELP_DESK_NUMBER } from './app-chrome';
import { normalizePartnerCode } from './partner-shape';

export interface AskedProduct {
  readonly code: string;
  readonly brand: string;
  readonly name: string;
}

export function productAskMessage(
  template: string,
  product: AskedProduct,
  locale: string,
  partner: string | null | undefined,
): string {
  const label = [product.code, product.brand, product.name].filter((part) => part.trim() !== '').join(' · ');
  const code = normalizePartnerCode(partner ?? null);
  return `${template.replace('{product}', label)}\n(lang=${locale}${code ? ` · p=${code}` : ''})`;
}

export function productAskHref(message: string): string {
  return `https://wa.me/${HELP_DESK_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** «Skin-care tips on WhatsApp»: the result's type name in the reader's words, her language, the partner code. */
export function tipsAskMessage(
  template: string,
  typeName: string,
  locale: string,
  partner: string | null | undefined,
): string {
  const code = normalizePartnerCode(partner ?? null);
  return `${template.replace('{type}', typeName)}\n(lang=${locale}${code ? ` · p=${code}` : ''})`;
}
