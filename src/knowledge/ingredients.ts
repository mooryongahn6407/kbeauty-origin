/**
 * Ingredient repository — the knowledge layer behind Ingredient Garden.
 *
 * Source: Master DB 06_INGREDIENTS (40 rows), Domain D06, Quests QST-008/009/010.
 *
 * Every ingredient record is currently Status=Draft with Evidence_Status "Seed / Verify"
 * (SR-010), and only 3 of 40 carry a Reference_URL. Nothing here changes that: the module
 * groups, filters and reports the records as they are, and the publication gate decides what
 * may be said about them.
 */
import type { Ingredient } from '@/domain/entities';
import { evaluatePublication } from '@/governance/publication-gate';
import { ingredients } from './repository';

export interface IngredientFamily {
  /** Family label exactly as 06_INGREDIENTS spells it. Not normalised, not merged. */
  readonly name: string;
  readonly ingredients: readonly Ingredient[];
}

/** Families derived from the source rows, in first-appearance order. Nothing invented. */
export const ingredientFamilies: readonly IngredientFamily[] = (() => {
  const grouped = new Map<string, Ingredient[]>();
  for (const ingredient of ingredients) {
    const bucket = grouped.get(ingredient.Family);
    if (bucket) bucket.push(ingredient);
    else grouped.set(ingredient.Family, [ingredient]);
  }
  return [...grouped.entries()].map(([name, members]) => ({ name, ingredients: members }));
})();

export const findIngredient = (ingredientId: string): Ingredient | undefined =>
  ingredients.find((ingredient) => ingredient.Ingredient_ID === ingredientId);

export const ingredientsInFamily = (family: string): readonly Ingredient[] =>
  ingredients.filter((ingredient) => ingredient.Family === family);

export interface IngredientCorpusReport {
  readonly total: number;
  readonly familyCount: number;
  /** How many may be presented as verified fact. Currently zero (SR-010). */
  readonly mayStateAsFact: number;
  /** How many carry an external reference URL at all. */
  readonly withReferenceUrl: number;
  readonly byLevel: Readonly<Record<string, number>>;
}

/** Honest coverage report for the governance screen. */
export function ingredientCorpusReport(): IngredientCorpusReport {
  const byLevel: Record<string, number> = {};
  for (const ingredient of ingredients) {
    const key = ingredient.Level || '(blank)';
    byLevel[key] = (byLevel[key] ?? 0) + 1;
  }

  return {
    total: ingredients.length,
    familyCount: ingredientFamilies.length,
    mayStateAsFact: ingredients.filter((item) => evaluatePublication(item).mayStateAsFact).length,
    withReferenceUrl: ingredients.filter((item) => item.Reference_URL.trim() !== '').length,
    byLevel,
  };
}

export { ingredients };
