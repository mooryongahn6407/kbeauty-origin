/**
 * Reading the labels of the products the shop sells.
 *
 * Everything here is about what is printed: which names are on a label, in what order, and which
 * of them are records in 06_INGREDIENTS. Nothing here says what an ingredient does, whether a
 * product suits anyone, or how much it costs — there is no price, cart or order in this app.
 *
 * "Ingredients I want to avoid" is the reader's own list, kept on this device. It only ever finds
 * a name on a label; it never says a product is free of something, because a list that is
 * truncated, unchecked or not yet collected cannot prove an absence.
 */
import { storeCatalog } from '@/content/store-catalog';
import type { StoreProduct } from '@/content/store-catalog-types';
import { ingredientIdForPrinted, printedBase } from '@/content/inci-names';
import { findIngredient } from '@/knowledge/ingredients';
import { PARTNER_PARAM } from './partner';

export const PRODUCT_PARAM = 'product';
const AVOID_KEY = 'korea-glow:avoid:v1';
const SKU_SHAPE = /^KG-[A-Z]{3}-\d{5}$/;

export interface LabelEntry {
  /** 1-based place in the printed list, or null when the text was elided before it. */
  readonly position: number | null;
  readonly printed: string;
  readonly ingredientId: string | null;
}

export const findProduct = (sku: string): StoreProduct | undefined =>
  storeCatalog.find((product) => product.sku === sku);

export const hasReadableList = (product: StoreProduct): boolean =>
  (product.source === 'LABEL_CHECKED' || product.source === 'SUPPLIER_TEXT_UNCHECKED') &&
  product.inci.length > 0;

export function readLabel(product: StoreProduct): readonly LabelEntry[] {
  return product.inci.map((printed, index) => ({
    position: product.inciGapAfter !== null && index >= product.inciGapAfter ? null : index + 1,
    printed,
    ingredientId: ingredientIdForPrinted(printed),
  }));
}

/** Categories in the order the master lists products, each once. */
export const storeCategories = (): readonly string[] => [
  ...new Set(storeCatalog.map((product) => product.category)),
];

const fold = (text: string): string => text.toLowerCase().replace(/[\s·\-_.]/g, '');

/**
 * Products whose brand, name, SKU or printed ingredient list contains the query. An English
 * ingredient name finds the products whose label prints that record ("niacinamide" finds
 * 나이아신아마이드), because that is how a reader in Vientiane is likely to type it.
 */
export function searchCatalog(
  query: string,
  products: readonly StoreProduct[] = storeCatalog,
): readonly StoreProduct[] {
  const q = fold(query);
  if (q === '') return products;
  return products.filter((product) => {
    const names = [product.brand, product.nameKo, product.nameEn ?? '', product.sku];
    if (names.some((name) => fold(name).includes(q))) return true;
    return product.inci.some((printed) => {
      if (fold(printedBase(printed)).includes(q)) return true;
      const id = ingredientIdForPrinted(printed);
      const record = id ? findIngredient(id) : undefined;
      return record ? fold(record.Ingredient_Name).includes(q) : false;
    });
  });
}

/** Entries on this product's label that name a record on the reader's avoid list. */
export const avoidHits = (product: StoreProduct, avoid: readonly string[]): readonly LabelEntry[] =>
  readLabel(product).filter((entry) => entry.ingredientId && avoid.includes(entry.ingredientId));

/** The 06_INGREDIENTS records printed on at least one product the shop sells. */
export const ingredientsOnSale = (): readonly string[] => {
  const ids = new Set<string>();
  for (const product of storeCatalog) {
    for (const printed of product.inci) {
      const id = ingredientIdForPrinted(printed);
      if (id) ids.add(id);
    }
  }
  return [...ids].sort();
};

export function loadAvoidList(storage: Pick<Storage, 'getItem'> | undefined): readonly string[] {
  try {
    const parsed: unknown = JSON.parse(storage?.getItem(AVOID_KEY) ?? '[]');
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === 'string' && !!findIngredient(id))
      : [];
  } catch {
    return [];
  }
}

export function saveAvoidList(
  storage: Pick<Storage, 'setItem'> | undefined,
  avoid: readonly string[],
): void {
  try {
    storage?.setItem(AVOID_KEY, JSON.stringify(avoid));
  } catch {
    // Private windows and full storage: the list lasts for this visit only.
  }
}

/** The product a link points at (`?product=KG-CRM-00003`), if it is one the shop sells. */
export function productFromSearch(search: string): string | null {
  try {
    const raw = new URLSearchParams(search).get(PRODUCT_PARAM)?.trim().toUpperCase() ?? '';
    return SKU_SHAPE.test(raw) && findProduct(raw) ? raw : null;
  } catch {
    return null;
  }
}

/** A link that opens this product's page, carrying the partner shop's code when there is one. */
export function productLink(base: string, sku: string, partner: string | null): string {
  const params = new URLSearchParams();
  params.set(PRODUCT_PARAM, sku);
  if (partner) params.set(PARTNER_PARAM, partner);
  return `${base}?${params.toString()}`;
}

/**
 * Two printed lists side by side: what both labels print, and what only one of them prints.
 * A printed name counts as the same ingredient when both resolve to one 06_INGREDIENTS record,
 * otherwise when the printed base names match. Nothing is scored or ranked, and "only on A"
 * means only that B's list as collected does not print it — a truncated or unchecked list
 * cannot prove an absence, which the screen says.
 */
export interface LabelComparison {
  readonly both: readonly string[];
  readonly onlyA: readonly string[];
  readonly onlyB: readonly string[];
}

const compareKey = (printed: string): string =>
  ingredientIdForPrinted(printed) ?? `printed:${fold(printedBase(printed))}`;

export function compareLabels(a: StoreProduct, b: StoreProduct): LabelComparison {
  const keysB = new Set(b.inci.map(compareKey));
  const keysA = new Set(a.inci.map(compareKey));
  const seen = new Set<string>();
  const both: string[] = [];
  const onlyA: string[] = [];
  for (const printed of a.inci) {
    const key = compareKey(printed);
    if (seen.has(key)) continue;
    seen.add(key);
    (keysB.has(key) ? both : onlyA).push(printed);
  }
  const onlyB: string[] = [];
  const seenB = new Set<string>();
  for (const printed of b.inci) {
    const key = compareKey(printed);
    if (seenB.has(key) || keysA.has(key)) continue;
    seenB.add(key);
    onlyB.push(printed);
  }
  return { both, onlyA, onlyB };
}

/** Either list is incomplete or unchecked, so "only on one" is weaker than it looks. */
export const comparisonIsPartial = (a: StoreProduct, b: StoreProduct): boolean =>
  [a, b].some(
    (product) =>
      product.inciTruncated || product.inciGapAfter !== null || product.source !== 'LABEL_CHECKED',
  );

const INQUIRY_KEY = 'korea-glow:inquiry:v1';
export const INQUIRY_LIMIT = 20;

/**
 * The reader's "ask the shop about these" list: product codes only, kept on this device. It is
 * not a cart — no quantity, no price, nothing is sent anywhere until the reader shares it.
 */
export function loadInquiryList(storage: Pick<Storage, 'getItem'> | undefined): readonly string[] {
  try {
    const parsed: unknown = JSON.parse(storage?.getItem(INQUIRY_KEY) ?? '[]');
    return Array.isArray(parsed)
      ? [
          ...new Set(
            parsed.filter((sku): sku is string => typeof sku === 'string' && !!findProduct(sku)),
          ),
        ].slice(0, INQUIRY_LIMIT)
      : [];
  } catch {
    return [];
  }
}

export function saveInquiryList(
  storage: Pick<Storage, 'setItem'> | undefined,
  skus: readonly string[],
): void {
  try {
    storage?.setItem(INQUIRY_KEY, JSON.stringify(skus.slice(0, INQUIRY_LIMIT)));
  } catch {
    // Private windows and full storage: the list lasts for this visit only.
  }
}

export const toggleInquiry = (skus: readonly string[], sku: string): readonly string[] =>
  skus.includes(sku)
    ? skus.filter((item) => item !== sku)
    : findProduct(sku) && skus.length < INQUIRY_LIMIT
      ? [...skus, sku]
      : skus;

/**
 * The text a reader sends to the shop: a greeting, one line per product (name and code) and a
 * link back to the app carrying the shop's code. The wording comes from the caller (it is a
 * localization string); this only assembles it, and never adds a price or a quantity.
 */
export function inquiryMessage(
  head: string,
  lines: readonly { name: string; sku: string }[],
  link: string,
): string {
  return [head, ...lines.map((line) => `• ${line.name} (${line.sku})`), '', link].join('\n');
}
