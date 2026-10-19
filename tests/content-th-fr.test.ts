/**
 * Thai and French drafts for the company content that used to exist only in Korean, Lao and
 * English: the ingredient dictionary, the K-beauty guide and the partner academy. Every text has
 * both drafts, each in its own script, none says more than the English it was made from, and the
 * "shown in English" note appears only when a text really falls back to English.
 */
import { describe, expect, it } from 'vitest';
import { companyDictionary } from '@/content/company/ingredient-dictionary';
import type { Trilingual } from '@/content/company/ingredient-dictionary-types';
import {
  ANTI_AGING_TERMS,
  CATEGORY_GUIDES,
  ROUTINE,
  SUN_CARE,
  WHY_KBEAUTY,
  WHY_SO_MANY_CATEGORIES,
} from '@/content/guides/kbeauty-guide';
import { ACADEMY } from '@/content/partner/academy';
import { CATALOG_REVIEW } from '@/localization/messages';
import { pick, pickLang, showsEnglishFallback } from '@/ui/pick';

const THAI = /[฀-๿]/;
const MEDICAL_FR = /\b(guérit|guérir|traite la|cicatrisation|régénère la peau|blessure)/i;
const MEDICAL_TH = /รักษาโรค|หายขาด|สมานแผล/;

function texts(value: unknown, out: Trilingual[] = []): Trilingual[] {
  if (typeof value !== 'object' || value === null) return out;
  const record = value as Record<string, unknown>;
  if (typeof record.en === 'string' && typeof record.lo === 'string') out.push(value as Trilingual);
  else for (const child of Object.values(record)) texts(child, out);
  return out;
}

const SETS = {
  dictionary: companyDictionary,
  guide: [WHY_KBEAUTY, WHY_SO_MANY_CATEGORIES, ANTI_AGING_TERMS, SUN_CARE, ROUTINE, CATEGORY_GUIDES],
  academy: ACADEMY,
} as const;

describe('Thai and French company content', () => {
  it.each(Object.entries(SETS))('%s: every text has a Thai and a French draft', (_name, set) => {
    const all = texts(set);
    expect(all.length).toBeGreaterThan(50);
    for (const text of all) {
      // An abbreviation such as PDRN is the same in every script.
      if (/^[A-Z0-9]+$/.test(text.en)) expect(text.th).toBe(text.en);
      else expect(text.th, text.en).toMatch(THAI);
      expect(text.fr?.trim(), text.en).toBeTruthy();
      expect(text.fr, text.en).not.toMatch(/[฀-໿]/);
    }
  });

  it('counts what the owner was told: 184 dictionary, 122 guide, 75 academy texts', () => {
    expect(texts(SETS.dictionary)).toHaveLength(184);
    expect(texts(SETS.guide)).toHaveLength(122);
    expect(texts(SETS.academy)).toHaveLength(75);
  });

  it('adds no medical wording the English does not have', () => {
    for (const text of Object.values(SETS).flatMap((set) => texts(set))) {
      // The academy quotes the forbidden words in order to forbid them.
      if (/treats?|treatment|cures?|heals?|scars?/i.test(text.en)) continue;
      expect(text.fr ?? '', text.en).not.toMatch(MEDICAL_FR);
      expect(text.th ?? '', text.en).not.toMatch(MEDICAL_TH);
    }
  });

  it('keeps Thai and French drafts — never native-reviewed', () => {
    expect(CATALOG_REVIEW.th).toBe('UNREVIEWED_DRAFT');
    expect(CATALOG_REVIEW.fr).toBe('UNREVIEWED_DRAFT');
  });
});

describe('pick, pickLang and the "shown in English" note', () => {
  const full: Trilingual = { ko: '가', en: 'A', lo: 'ກ', th: 'ก', fr: 'Á' };
  const partial: Trilingual = { ko: '가', en: 'A', lo: 'ກ' };

  it('returns the reader language when it exists, English otherwise, and says which', () => {
    expect([pick(full, 'th'), pickLang(full, 'th')]).toEqual(['ก', 'th']);
    expect([pick(full, 'fr'), pickLang(full, 'fr')]).toEqual(['Á', 'fr']);
    expect([pick(partial, 'fr'), pickLang(partial, 'fr')]).toEqual(['A', 'en']);
    expect([pick(full, 'es'), pickLang(full, 'es')]).toEqual(['A', 'en']);
    expect([pick(full, 'lo'), pickLang(full, 'lo')]).toEqual(['ກ', 'lo']);
  });

  it('shows the note only when some of the content really falls back', () => {
    expect(showsEnglishFallback('th', [full, full])).toBe(false);
    expect(showsEnglishFallback('fr', { a: full, b: [partial] })).toBe(true);
    expect(showsEnglishFallback('es', [full])).toBe(true);
    expect(showsEnglishFallback('lo', [partial])).toBe(false);
    expect(showsEnglishFallback('ko')).toBe(false);
  });

  it('no longer shows it in Thai or French on the dictionary, guide and academy', () => {
    for (const set of Object.values(SETS)) {
      expect(showsEnglishFallback('th', set)).toBe(false);
      expect(showsEnglishFallback('fr', set)).toBe(false);
    }
  });
});
