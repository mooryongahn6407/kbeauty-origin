/**
 * Products KOREA GLOW sells today whose printed ingredient list names an acid from the AHA, BHA
 * or PHA families in 06_INGREDIENTS.
 *
 * Derived from `store-catalog.ts`, the owner's ingredient master (KOREA_GLOW_성분표_마스터_260930.xlsx, sheet
 * 제품_전체, rows with 상태 = 지금 판매). Only three things were taken: the product's name, the
 * ingredient as it is printed, and where in the printed list it sits. The master's own
 * "who is it for / season / pairing" columns are AI analysis awaiting expert review, so none of
 * that is here, and no price or supplier field ever was.
 *
 * `source` keeps the master's own honesty flag: LABEL_CHECKED means someone read the physical
 * label; SUPPLIER_TEXT_UNCHECKED means the list came from supplier or public text and the
 * physical label has not been compared yet. The screen shows the difference.
 *
 * Matching is by exact printed name, so 치오글라이콜릭애씨드 (a depilatory) is not glycolic acid
 * and 베타인살리실레이트 is not salicylic acid. A printed concentration such as (420ppm) is kept
 * verbatim. `position` is null when the source list was elided before that ingredient.
 */
import { storeCatalog } from './store-catalog';
import { ingredientIdForPrinted } from './inci-names';
import { nameWithoutBrand } from './store-catalog-types';
import { findIngredient } from '@/knowledge/ingredients';

export type LabelSource = 'LABEL_CHECKED' | 'SUPPLIER_TEXT_UNCHECKED';

export interface LabelMatch {
  /** Exactly as printed, including any printed concentration. */
  readonly printedName: string;
  /** 06_INGREDIENTS record this printed name belongs to. */
  readonly ingredientId: string;
  /** 1-based place in the printed list, or null when the list was elided before it. */
  readonly position: number | null;
}

export interface StoreProductLabel {
  readonly sku: string;
  readonly category: string;
  readonly brand: string;
  readonly name: string;
  readonly source: LabelSource;
  readonly inciCount: number;
  /** True when the master holds only part of the printed list. */
  readonly inciTruncated: boolean;
  readonly matches: readonly LabelMatch[];
}

const ACID_FAMILIES = ['AHA', 'BHA', 'Polyhydroxy Acid'];

export const storeProductLabels: readonly StoreProductLabel[] = storeCatalog.flatMap((product) => {
  if (product.source !== 'LABEL_CHECKED' && product.source !== 'SUPPLIER_TEXT_UNCHECKED') return [];
  const matches = product.inci.flatMap((printedName, index): LabelMatch[] => {
    const ingredientId = ingredientIdForPrinted(printedName);
    const family = ingredientId ? findIngredient(ingredientId)?.Family : undefined;
    if (!ingredientId || !family || !ACID_FAMILIES.includes(family)) return [];
    const elided = product.inciGapAfter !== null && index >= product.inciGapAfter;
    return [{ printedName, ingredientId, position: elided ? null : index + 1 }];
  });
  if (matches.length === 0) return [];
  return [
    {
      sku: product.sku,
      category: product.category,
      brand: product.brand,
      name: nameWithoutBrand(product),
      source: product.source,
      inciCount: product.inci.length,
      inciTruncated: product.inciTruncated,
      matches,
    },
  ];
});

export const storeProductsListing = (ingredientIds: readonly string[]) =>
  storeProductLabels.filter((product) =>
    product.matches.some((match) => ingredientIds.includes(match.ingredientId)),
  );
