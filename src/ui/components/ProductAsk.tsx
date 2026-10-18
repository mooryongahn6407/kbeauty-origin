/**
 * The «Ask about this product on WhatsApp» button under a recommended product and on a product's
 * page. Opens the company's WhatsApp Business with a polite message already written; the reader
 * presses send herself. No price, no order.
 */
import { inLocale } from '@/content/care-quest/types';
import { productAskHref, productAskMessage } from '@/app/product-ask';
import { CHROME } from '../chrome-text';
import { Icon } from './AppChrome';

export function ProductAskLink({
  code,
  brand,
  name,
  locale,
  partner,
}: {
  /** The shelf number (A-69) when it has one, else the product code. */
  code: string;
  brand: string;
  name: string;
  locale: string;
  partner: string | null;
}) {
  const message = productAskMessage(inLocale(CHROME.askProductMessage!, locale), { code, brand, name }, locale, partner);
  return (
    <a className="kg-askproduct" href={productAskHref(message)} target="_blank" rel="noopener noreferrer">
      <Icon name="chat" />
      <span>{inLocale(CHROME.askProduct!, locale)}</span>
    </a>
  );
}
