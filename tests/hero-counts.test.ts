/**
 * The front door prints how many lessons and dictionary ingredients there are without loading the
 * lessons or the dictionary (they arrive with the skin game, later). So the two numbers are kept
 * as constants — and this test fails the moment either drifts from the real content (rule 12).
 */
import { describe, expect, it } from 'vitest';
import { CARE_LESSONS } from '@/content/care-quest/lessons';
import { companyDictionary } from '@/content/company/ingredient-dictionary';
import { HERO_INGREDIENT_COUNT, HERO_LESSON_COUNT } from '@/content/hero-counts';

describe('front-door counts', () => {
  it('match the lessons and the dictionary exactly', () => {
    expect(HERO_LESSON_COUNT).toBe(CARE_LESSONS.length);
    expect(HERO_INGREDIENT_COUNT).toBe(companyDictionary.ingredients.length);
  });
});

describe('front-door product photos', () => {
  it('are the same four photos the catalog would pick', async () => {
    const { storeCatalog } = await import('@/content/store-catalog');
    const { GUIDE_ENTRY_PHOTOS } = await import('@/content/hero-counts');
    const expected = storeCatalog
      .filter((product) => product.photo)
      .slice(4, 8)
      .map((product) => product.photo);
    expect(GUIDE_ENTRY_PHOTOS).toEqual(expected);
  });
});
