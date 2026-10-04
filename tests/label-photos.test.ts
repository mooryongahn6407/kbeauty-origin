/**
 * Label-photo tests.
 *
 * Mirrors the discipline product-proposals.test.ts applies to the proposal register: every
 * Ingredient_ID this module cites must resolve against the real 06_INGREDIENTS records, and
 * every image file it points at must actually exist in public/.
 */
import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { labelPhotos, labelPhotosForIngredient } from '@/content/label-photos';
import { findIngredient } from '@/knowledge/ingredients';

describe('label photo register', () => {
  it('cites only Ingredient_IDs that exist in 06_INGREDIENTS', () => {
    for (const photo of labelPhotos) {
      for (const id of photo.ingredientIds) {
        expect(findIngredient(id), `${photo.id} → ${id}`).toBeDefined();
      }
    }
  });

  it('gives every photo at least one ingredient match, a product name and both image sizes', () => {
    for (const photo of labelPhotos) {
      expect(photo.ingredientIds.length, photo.id).toBeGreaterThan(0);
      expect(photo.productName.length, photo.id).toBeGreaterThan(0);
      expect(photo.src, photo.id).toMatch(/^\/products\/.+\.jpg$/);
      expect(photo.thumbSrc, photo.id).toMatch(/^\/products\/.+-thumb\.jpg$/);
    }
  });

  it('ships every referenced image file in public/', () => {
    for (const photo of labelPhotos) {
      expect(existsSync(`public${photo.src}`), photo.src).toBe(true);
      expect(existsSync(`public${photo.thumbSrc}`), photo.thumbSrc).toBe(true);
    }
  });

  it('has no duplicate photo ids', () => {
    const ids = labelPhotos.map((photo) => photo.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('looks photos up by ingredient id without inventing one', () => {
    expect(labelPhotosForIngredient('ING-007').length).toBeGreaterThanOrEqual(3);
    expect(labelPhotosForIngredient('ING-999')).toEqual([]);
  });
});
