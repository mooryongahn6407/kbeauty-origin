/**
 * Shape of a product the shop sells today. See `store-catalog.ts` for where the data comes from.
 *
 * `source` keeps the owner's master's own honesty flag about the ingredient text:
 * - LABEL_CHECKED — someone read the physical label.
 * - SUPPLIER_TEXT_UNCHECKED — the list came from supplier or public text; the physical label has
 *   not been compared yet.
 * - INCI_PENDING — the full ingredient list has not been collected yet.
 * - NOT_APPLICABLE — an accessory (a puff, a brush): there is no ingredient list to read.
 */
export type StoreProductSource =
  | 'LABEL_CHECKED'
  | 'SUPPLIER_TEXT_UNCHECKED'
  | 'INCI_PENDING'
  | 'NOT_APPLICABLE';

export interface StoreProduct {
  readonly sku: string;
  /** The master's own category name, in Korean. */
  readonly category: string;
  readonly brand: string;
  readonly nameKo: string;
  readonly nameEn: string | null;
  readonly size: string | null;
  readonly source: StoreProductSource;
  /** Printed ingredient names, in printed order, exactly as transcribed. Empty when none. */
  readonly inci: readonly string[];
  /** When the text was elided, how many names came before the gap; otherwise null. */
  readonly inciGapAfter: number | null;
  /** True when the master holds only part of the printed list. */
  readonly inciTruncated: boolean;
}

/** The Korean name without a leading repeat of the brand ("모다모다 블루비오틴…" → "블루비오틴…"). */
export const nameWithoutBrand = (product: Pick<StoreProduct, 'brand' | 'nameKo'>): string => {
  const prefix = `${product.brand} `;
  return product.nameKo.startsWith(prefix) ? product.nameKo.slice(prefix.length) : product.nameKo;
};
