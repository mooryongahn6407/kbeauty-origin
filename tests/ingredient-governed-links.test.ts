import { describe, expect, it } from 'vitest';
import { INGREDIENT_GOVERNED_LINKS } from '@/content/company/ingredient-governed-links';
import { companyDictionary } from '@/content/company/ingredient-dictionary';
import { ingredients as governedIngredients } from '@/knowledge/repository';
import { labelPhotosForIngredient } from '@/content/label-photos';

describe('links from the company dictionary to the Master Database', () => {
  const dictIds = new Set(companyDictionary.ingredients.map((entry) => entry.id));
  const governedIds = new Set(governedIngredients.map((entry) => entry.Ingredient_ID));

  it('names a real company-dictionary entry on the left and a real Master Database id on the right', () => {
    for (const [dictId, governedId] of Object.entries(INGREDIENT_GOVERNED_LINKS)) {
      expect(dictIds.has(dictId), `company dictionary has no entry '${dictId}'`).toBe(true);
      expect(governedIds.has(governedId), `Master Database has no '${governedId}'`).toBe(true);
    }
  });

  it('names the same substance on both sides, not a look-alike', () => {
    const governedName = (id: string) =>
      governedIngredients.find((entry) => entry.Ingredient_ID === id)?.Ingredient_Name ?? '';
    for (const [dictId, governedId] of Object.entries(INGREDIENT_GOVERNED_LINKS)) {
      const entry = companyDictionary.ingredients.find((item) => item.id === dictId)!;
      // The governed name (e.g. "Tocopherol") has to appear, whole, somewhere the dictionary
      // entry names itself — in "Vitamin E (Tocopherol)" or plainly in "Niacinamide" — so a
      // link can never pair two merely-similar substances by accident.
      const haystack = `${entry.name.en} ${entry.aka}`.toLowerCase();
      expect(haystack, `'${entry.name.en}' vs '${governedName(governedId)}'`).toContain(
        governedName(governedId).toLowerCase(),
      );
    }
  });

  it('every linked entry actually has a photographed label to show', () => {
    for (const governedId of Object.values(INGREDIENT_GOVERNED_LINKS)) {
      expect(
        labelPhotosForIngredient(governedId).length,
        `${governedId} has no label photo — the link shows nothing`,
      ).toBeGreaterThan(0);
    }
  });
});
