/**
 * The dictionary's three grades are KOREA GLOW's own reading, and the badge says so.
 *
 * "Strong evidence" had no source behind it — it is the company's grade, not an expert verdict.
 * Every language labels it as the company's, the screen carries a line saying it is not an
 * expert review, and the badge keeps text next to its colour.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { translate, type MessageKey } from '@/localization/messages';

const LOCALES = ['en', 'ko', 'fr', 'lo', 'th'] as const;
const GRADES = ['strong', 'moderate', 'emerging'] as const;
const COMPANY_WORD: Record<(typeof LOCALES)[number], string> = {
  en: 'Company grade',
  ko: '회사 평가',
  fr: 'Note de l\'entreprise',
  lo: 'ການປະເມີນຂອງບໍລິສັດ',
  th: 'การประเมินของบริษัท',
};

describe('every grade is labelled as the company\'s own', () => {
  for (const locale of LOCALES) {
    it(`${locale}: all three badges name the company grade`, () => {
      for (const grade of GRADES) {
        const text = translate(`dict.evidence.${grade}` as MessageKey, locale);
        expect(text).toContain(COMPANY_WORD[locale]);
      }
    });

    it(`${locale}: has its own grade note naming KOREA GLOW`, () => {
      const note = translate('dict.gradeNote', locale);
      expect(note).toContain('KOREA GLOW');
      if (locale !== 'en') expect(note).not.toBe(translate('dict.gradeNote', 'en'));
    });
  }

  it('no longer calls any grade "strong evidence"', () => {
    expect(translate('dict.evidence.strong', 'en')).not.toMatch(/evidence/i);
    expect(translate('dict.evidence.strong', 'ko')).not.toContain('근거');
  });
});

describe('the dictionary screen shows the note and keeps text with colour', () => {
  const screen = readFileSync(new URL('../src/ui/screens/IngredientDictionaryScreen.tsx', import.meta.url), 'utf8');

  it('renders the grade note', () => {
    expect(screen).toContain("translate('dict.gradeNote', locale)");
  });

  it('renders the badge text inside the coloured badge', () => {
    expect(screen).toMatch(/evidence--\$\{evidence\}[\s\S]{0,120}translate\(`dict\.evidence\.\$\{evidence\}`/);
  });
});
