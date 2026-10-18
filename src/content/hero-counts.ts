/**
 * How many lessons and dictionary ingredients the front door says there are — constants, so the
 * first screen does not have to download the lessons and the dictionary just to count them.
 * `tests/hero-counts.test.ts` fails if either stops matching the real content (rule 12).
 */
export const HERO_LESSON_COUNT = 12;
export const HERO_INGREDIENT_COUNT = 30;

/** Four product photos for the «more to learn» door under the game — the catalog's 5th to 8th. */
export const GUIDE_ENTRY_PHOTOS: readonly string[] = [
  '/products/sku/KG-CRM-00007.jpg',
  '/products/sku/KG-CRM-00008.jpg',
  '/products/sku/KG-CRM-00018.jpg',
  '/products/sku/KG-CRM-00019.jpg',
];
