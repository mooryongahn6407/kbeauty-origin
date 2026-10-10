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
