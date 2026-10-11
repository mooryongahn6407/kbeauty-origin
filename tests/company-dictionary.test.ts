/**
 * The company's ingredient dictionary, as carried into the app: 30 entries, every cross-link
 * resolves, Lao is Lao, the sales-coaching field stayed out, and product links come only from
 * printed labels.
 */
import { describe, expect, it } from 'vitest';
import { companyDictionary } from '@/content/company/ingredient-dictionary';
import {
  DICTIONARY_LABEL_PATTERNS,
  dictionaryIdsOn,
  printedMatches,
  productsWith,
} from '@/content/company/ingredient-links';
import { storeCatalog } from '@/content/store-catalog';

const ids = companyDictionary.ingredients.map((entry) => entry.id);
const lao = /[຀-໿]/;

describe('company ingredient dictionary', () => {
  it('holds 30 distinct ingredients with an evidence grade each', () => {
    expect(ids).toHaveLength(30);
    expect(new Set(ids).size).toBe(30);
    for (const entry of companyDictionary.ingredients) {
      expect(['strong', 'moderate', 'emerging']).toContain(entry.evidence);
    }
  });

  it('resolves every group, concern, pairing and avoid link', () => {
    for (const entry of companyDictionary.ingredients) {
      expect(companyDictionary.groups[entry.group], entry.id).toBeDefined();
      for (const c of entry.concerns)
        expect(companyDictionary.concerns[c], `${entry.id}/${c}`).toBeDefined();
      for (const p of entry.pairs) expect(ids, `${entry.id} pairs ${p}`).toContain(p);
      for (const a of entry.avoid) expect(ids, `${entry.id} avoids ${a.id}`).toContain(a.id);
    }
  });

  it('writes every Lao text in Lao script, and every text in all three languages', () => {
    for (const entry of companyDictionary.ingredients) {
      expect(entry.name.ko && entry.name.en && entry.name.lo, entry.id).toBeTruthy();
      // Names may stay Latin in Lao (PDRN is PDRN); every explanation must be in Lao script.
      for (const text of [entry.what, entry.how, entry.use, entry.caution]) {
        expect(text.ko && text.en && text.lo, entry.id).toBeTruthy();
        expect(text.lo, entry.id).toMatch(lao);
      }
    }
  });

  it('leaves the shop-staff sales notes out of the customer app', () => {
    for (const entry of companyDictionary.ingredients) {
      expect(Object.keys(entry)).not.toContain('staff');
    }
  });
});

describe('dictionary ↔ product links', () => {
  it('has a label pattern for every entry, and none for an entry that does not exist', () => {
    expect(Object.keys(DICTIONARY_LABEL_PATTERNS).sort()).toEqual([...ids].sort());
  });

  it('links a product only through a name printed on its label', () => {
    for (const product of storeCatalog) {
      for (const id of dictionaryIdsOn(product)) {
        for (const printed of printedMatches(product, id)) expect(product.inci).toContain(printed);
      }
    }
  });

  it('does not take look-alikes for the real thing', () => {
    expect(DICTIONARY_LABEL_PATTERNS.bha!.test('베타인살리실레이트')).toBe(false);
    expect(DICTIONARY_LABEL_PATTERNS.aha!.test('치오글라이콜릭애씨드')).toBe(false);
    expect(DICTIONARY_LABEL_PATTERNS.vite!.test('토코페릴리놀레이트')).toBe(false);
    expect(DICTIONARY_LABEL_PATTERNS.niacinamide!.test('나이아신아마이드')).toBe(true);
  });

  it('finds the common ingredients on the shelf', () => {
    expect(productsWith('niacinamide').length).toBeGreaterThan(10);
    expect(productsWith('sunscreen').length).toBeGreaterThan(5);
  });
});
