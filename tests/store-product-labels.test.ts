/**
 * Store product labels — the printed ingredient lists from products the shop sells, shown in the
 * Compare Lab. Every cited Ingredient_ID must resolve, every position must fit inside its list,
 * and look-alike names must never be counted as the acid they resemble.
 */
import { describe, expect, it } from 'vitest';
import { storeProductLabels, storeProductsListing } from '@/content/store-product-labels';
import { findIngredient } from '@/knowledge/ingredients';

const ACID_FAMILIES = ['AHA', 'BHA', 'Polyhydroxy Acid'];

describe('store product labels', () => {
  it('cites only acid-family records that exist in 06_INGREDIENTS', () => {
    for (const product of storeProductLabels) {
      for (const match of product.matches) {
        const ingredient = findIngredient(match.ingredientId);
        expect(ingredient, `${product.sku} → ${match.ingredientId}`).toBeDefined();
        expect(ACID_FAMILIES).toContain(ingredient!.Family);
      }
    }
  });

  it('places every match inside its printed list, or admits the place is unknown', () => {
    for (const product of storeProductLabels) {
      expect(product.matches.length, product.sku).toBeGreaterThan(0);
      for (const match of product.matches) {
        if (match.position === null) {
          expect(product.inciTruncated, product.sku).toBe(true);
        } else {
          expect(match.position).toBeGreaterThanOrEqual(1);
          expect(match.position).toBeLessThanOrEqual(product.inciCount);
        }
      }
    }
  });

  it('keeps the master’s own honesty flag on every product', () => {
    for (const product of storeProductLabels) {
      expect(['LABEL_CHECKED', 'SUPPLIER_TEXT_UNCHECKED']).toContain(product.source);
    }
  });

  it('never counts a look-alike name as the acid it resembles', () => {
    const printed = storeProductLabels.flatMap((product) => product.matches.map((m) => m.printedName));
    expect(printed.some((name) => name.includes('치오글라이콜릭'))).toBe(false);
    expect(printed.some((name) => name.includes('베타인살리실레이트'))).toBe(false);
  });

  it('has no duplicate products', () => {
    const skus = storeProductLabels.map((product) => product.sku);
    expect(new Set(skus).size).toBe(skus.length);
  });

  it('filters by ingredient without inventing matches', () => {
    for (const product of storeProductsListing(['ING-013'])) {
      expect(product.matches.some((match) => match.ingredientId === 'ING-013')).toBe(true);
    }
    expect(storeProductsListing(['ING-999'])).toEqual([]);
  });
});
