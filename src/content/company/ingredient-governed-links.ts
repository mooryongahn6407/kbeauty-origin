/**
 * Where a company-dictionary entry (`src/content/company/ingredient-dictionary.ts`) names the
 * same substance as a governed Master Database ingredient (`data/source/ingredients.json`), so
 * the dictionary entry can show the real label photos `src/content/label-photos.ts` already
 * carries for that governed `Ingredient_ID` — a photo of a real box, not a fabricated image.
 *
 * Deliberately short and hand-checked rather than name-matched automatically: a fuzzy match
 * between "Vitamin C" and two different printed forms (ascorbic acid, 3-O-ethyl ascorbic acid)
 * would silently claim they are the same thing on a label, which they are not. Every entry here
 * is a plain, exact identity — "Niacinamide" the company writes about is "Niacinamide" the
 * Master Database lists — and `tests/ingredient-governed-links.test.ts` checks both IDs on
 * every entry actually exist, so a rename on either side fails loudly instead of linking to
 * nothing.
 */
export const INGREDIENT_GOVERNED_LINKS: Readonly<Record<string, string>> = {
  niacinamide: 'ING-007',
  retinol: 'ING-010',
  panthenol: 'ING-011',
  centella: 'ING-022',
  vite: 'ING-024',
  adenosine: 'ING-039',
};
