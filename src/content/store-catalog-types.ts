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
  /** The product's name in Lao, Thai and French, from the company site; null where it has none. */
  readonly names: {
    readonly lo: string | null;
    readonly th: string | null;
    readonly fr: string | null;
  };
  /** Product photo served from public/, or null when the company site has none yet. */
  readonly photo: string | null;
  /** Who the master's analysis says it suits. AI-assisted, not expert-reviewed: label it so. */
  readonly fit: ProductFit | null;
  /** When and how to use it, including Laos' three seasons. Korean text from the master. */
  readonly usage: ProductUsage | null;
  /** What to use it with and what to keep apart. Korean text from the master. */
  readonly pairing: ProductPairing | null;
}

export type SkinKey = 'dry' | 'oily' | 'combination' | 'sensitive';
export type AgeKey = '20s' | '30s' | '40plus';
export type ConcernKey =
  | 'tone'
  | 'soothing'
  | 'hydration'
  | 'barrier'
  | 'firmness'
  | 'pores'
  | 'uv'
  | 'scalp'
  | 'nourish'
  | 'cleansing';

export interface ProductFit {
  readonly skin: readonly string[];
  readonly age: readonly string[];
  readonly concerns: readonly string[];
  /** The master's own note on what the judgement was based on. */
  readonly basis: string | null;
}

export interface ProductUsage {
  readonly am: string | null;
  readonly day: string | null;
  readonly pm: string | null;
  readonly drySeason: string | null;
  readonly hotSeason: string | null;
  readonly rainySeason: string | null;
  /** Usage as printed on the label or given by the source. */
  readonly howTo: string | null;
  /** Caution as printed on the label. */
  readonly caution: string | null;
}

export interface ProductPairing {
  readonly good: string | null;
  readonly avoid: string | null;
  readonly basis: string | null;
}

/** The Korean name without a leading repeat of the brand ("모다모다 블루비오틴…" → "블루비오틴…"). */
export const nameWithoutBrand = (product: Pick<StoreProduct, 'brand' | 'nameKo'>): string => {
  const prefix = `${product.brand} `;
  return product.nameKo.startsWith(prefix) ? product.nameKo.slice(prefix.length) : product.nameKo;
};
