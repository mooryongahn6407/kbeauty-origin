/**
 * One name per ingredient in every language: the dictionary must use the shared glossary's name
 * (src/localization/glossary.ts) in Korean, English, Lao, Thai and French.
 */
import { describe, expect, it } from 'vitest';
import { companyDictionary } from '@/content/company/ingredient-dictionary';
import {
  GLOSSARY_LOCALES,
  INGREDIENT_GLOSSARY,
  TERM_GLOSSARY,
  glossaryName,
} from '@/localization/glossary';

describe('shared glossary', () => {
  it('has a name for every dictionary ingredient, and nothing the dictionary lacks', () => {
    const ids = companyDictionary.ingredients.map((entry) => entry.id).sort();
    expect(Object.keys(INGREDIENT_GLOSSARY).sort()).toEqual(ids);
  });

  it('is the name every dictionary entry uses, in all five languages', () => {
    for (const entry of companyDictionary.ingredients) {
      const glossary = INGREDIENT_GLOSSARY[entry.id]!;
      for (const locale of GLOSSARY_LOCALES) expect(entry.name[locale], `${entry.id} ${locale}`).toBe(glossary[locale]);
    }
  });

  it('writes each language in its own script', () => {
    for (const [id, name] of Object.entries({ ...INGREDIENT_GLOSSARY, ...TERM_GLOSSARY })) {
      if (id === 'pdrn') continue; // an abbreviation in every language
      expect(name.ko, id).toMatch(/[가-힣]|^[A-Z]/);
      expect(name.lo, id).toMatch(/[຀-໿]/);
      expect(name.th, id).toMatch(/[฀-๿]/);
      expect(name.fr.trim(), id).not.toBe('');
    }
  });

  it('falls back to English for a language it does not carry', () => {
    expect(glossaryName('retinol', 'fr')).toBe('Rétinol');
    expect(glossaryName('retinol', 'es')).toBe('Retinol');
    expect(glossaryName('nope', 'en')).toBeUndefined();
  });
});
