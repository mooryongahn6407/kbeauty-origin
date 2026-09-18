/**
 * Localization architecture tests.
 * Source: 02_GLOBAL_CONTENT_ENGINE_SPEC_v1.0.md, Master DB 15_LOCALIZATION,
 * AI Tutor Constitution §13.
 */
import { describe, expect, it } from 'vitest';
import {
  BASE_LOCALE,
  LOCALES,
  OQ_L01,
  findLocale,
  isKnownLocale,
  languageName,
} from '@/localization/locales';
import {
  CATALOG_REVIEW,
  UI_CATALOG_LOCALES,
  catalogReview,
  isUnreviewedCatalog,
  messageKeys,
  safetyWording,
  translate,
  translateWithMeta,
} from '@/localization/messages';

describe('locale registry', () => {
  it('registers 12 locales — the union of both sources, with nothing dropped', () => {
    expect(LOCALES).toHaveLength(12);
  });

  it('does not silently resolve the locale-set conflict', () => {
    expect(OQ_L01.classification).toBe('OPEN_QUESTION');
    expect(OQ_L01.summary).toContain('Lao');
  });

  it('keeps Lao, which the database names as the launch language', () => {
    const lao = findLocale('lo');
    expect(lao).toBeDefined();
    expect(lao!.masterDbLocaleId).toBe('LOC-003');
    expect(lao!.stage).toBe('Market');
  });

  it('rejects an unknown locale tag', () => {
    expect(isKnownLocale('xx')).toBe(false);
    expect(isKnownLocale('ko')).toBe(true);
  });
});

describe('UI message catalog', () => {
  it('resolves every key in the base locale', () => {
    for (const key of messageKeys) {
      expect(translate(key, BASE_LOCALE), key).toBeTruthy();
    }
  });

  it('resolves every key in Korean without leaving an empty string', () => {
    for (const key of messageKeys) {
      expect(translate(key, 'ko'), key).toBeTruthy();
    }
  });

  it('resolves every key in French without leaving an empty string', () => {
    for (const key of messageKeys) {
      expect(translate(key, 'fr'), key).toBeTruthy();
    }
  });

  it('actually translates French rather than echoing English', () => {
    // A catalog can pass the "every key resolves" test while being a copy of the base locale.
    const echoed = messageKeys.filter((key) => translate(key, 'fr') === translate(key, 'en'));
    // Only the handful that are the same word or symbol in both languages may match.
    expect(echoed.length).toBeLessThan(messageKeys.length * 0.06);
  });

  it('fills French for a locale both sources agree on', () => {
    const french = findLocale('fr');
    expect(french?.origin).toBe('BOTH');
    expect(UI_CATALOG_LOCALES).toContain('fr');
  });

  it('resolves every key in Lao without leaving an empty string', () => {
    for (const key of messageKeys) {
      expect(translate(key, 'lo'), key).toBeTruthy();
    }
  });

  it('writes Lao in Lao script, not transliterated or left in English', () => {
    // U+0E80–U+0EFF is the Lao block. A key that slipped through untranslated would be pure
    // Latin and is caught here rather than in a screenshot.
    const lao = /[\u0E80-\u0EFF]/;
    // The brand name is the same in every catalog on purpose: a brand is not translated.
    const NOT_TRANSLATED = ['app.brand'];
    const latinOnly = messageKeys
      .filter((key) => !NOT_TRANSLATED.includes(key))
      .filter((key) => !lao.test(translate(key, 'lo')));
    expect(latinOnly).toEqual([]);
  });

  it('fills Lao, which the database names the launch language', () => {
    const lao = findLocale('lo');
    expect(lao?.masterDbLocaleId).toBe('LOC-003');
    expect(UI_CATALOG_LOCALES).toContain('lo');
  });

  it('resolves every key in Thai without leaving an empty string', () => {
    for (const key of messageKeys) {
      expect(translate(key, 'th'), key).toBeTruthy();
    }
  });

  it('writes Thai in Thai script, not transliterated or left in English', () => {
    // U+0E00–U+0E7F is the Thai block — immediately before the Lao block, and a genuinely
    // different set of code points, so a Thai string cannot pass this check by accident of
    // sharing Lao's.
    const thai = /[\u0E00-\u0E7F]/;
    const NOT_TRANSLATED = ['app.brand'];
    const latinOnly = messageKeys
      .filter((key) => !NOT_TRANSLATED.includes(key))
      .filter((key) => !thai.test(translate(key, 'th')));
    expect(latinOnly).toEqual([]);
  });

  it('fills Thai, the locale Lao read-aloud borrows a voice from', () => {
    const thai = findLocale('th');
    expect(thai?.masterDbLocaleId).toBe('LOC-004');
    expect(UI_CATALOG_LOCALES).toContain('th');
  });

  it('reports when a locale had no catalog and English was used instead', () => {
    const result = translateWithMeta('nav.mySkin', 'vi');
    expect(result.usedFallback).toBe(true);
    expect(result.text).toBe('My Skin');
  });

  it('does not claim a fallback for the base locale itself', () => {
    expect(translateWithMeta('nav.mySkin', 'en').usedFallback).toBe(false);
  });

  it('interpolates parameters', () => {
    expect(translate('common.fallbackLocale', 'en', { locale: 'English' })).toContain('English');
  });

  it('has a UI catalog for fewer locales than it registers, and does not hide that', () => {
    expect(UI_CATALOG_LOCALES.length).toBeLessThan(LOCALES.length);
  });

  it('provides safety escalation wording for every escalating tier', () => {
    for (const tier of ['R2', 'R3', 'R4'] as const) {
      for (const locale of UI_CATALOG_LOCALES) {
        expect(translate(`safety.escalation.${tier}`, locale).length).toBeGreaterThan(10);
      }
    }
  });

  it('carries no scientific, ingredient or product claim in UI strings', () => {
    // UI chrome must not hard-code governed claims (handoff command DO NOT list).
    const forbidden = /\b(SPF|ceramide|retinol|niacinamide|hyaluronic|cures?|treats?|guaranteed)\b/i;
    for (const key of messageKeys) {
      for (const locale of UI_CATALOG_LOCALES) {
        expect(translate(key, locale), `${key}/${locale}`).not.toMatch(forbidden);
      }
    }
  });
});

/**
 * Translation review status.
 *
 * The same discipline the corpus gets: a translation nobody has read is a draft, and the app
 * must not present it as finished. French, Lao and Thai were written by the engine that wrote
 * this file, and none of them has been checked by a speaker of the language.
 */
describe('a translation nobody has checked is a draft', () => {
  it('marks every catalog with how much review it has actually had', () => {
    expect(catalogReview('en')).toBe('BASE');
    expect(catalogReview('ko')).toBe('OWNER_REVIEWED');
    expect(catalogReview('fr')).toBe('UNREVIEWED_DRAFT');
    expect(catalogReview('lo')).toBe('UNREVIEWED_DRAFT');
    expect(catalogReview('th')).toBe('UNREVIEWED_DRAFT');
  });

  it('has a review status for every catalog it ships, and none for one it does not', () => {
    expect(Object.keys(CATALOG_REVIEW).sort()).toEqual([...UI_CATALOG_LOCALES].sort());
  });

  it('claims review only where review happened', () => {
    // A catalog cannot become reviewed by being committed. If this ever flips to false for
    // fr or lo, a person must have read it — not a build.
    expect(isUnreviewedCatalog('lo')).toBe(true);
    expect(isUnreviewedCatalog('fr')).toBe(true);
    expect(isUnreviewedCatalog('th')).toBe(true);
    expect(isUnreviewedCatalog('ko')).toBe(false);
  });

  it('names the language in the language, so the notice is readable by its reader', () => {
    // The Master Database carries only an English label, so these come from Intl. Where the
    // runtime has no entry the governed English label is used rather than a guess.
    expect(languageName('ko')).not.toBe('Korean');
    expect(languageName('fr')).not.toBe('French');
    for (const locale of UI_CATALOG_LOCALES) {
      expect(languageName(locale), locale).toBeTruthy();
    }
    // An unregistered tag still returns something printable rather than throwing.
    expect(languageName('xx')).toBe('xx');
  });

  it('has wording to tell the reader their interface is unchecked, in their language', () => {
    for (const locale of UI_CATALOG_LOCALES) {
      const notice = translate('catalog.unreviewed', locale);
      expect(notice.length, locale).toBeGreaterThan(20);
      // No unfilled placeholder: the notice names its own language in its own grammar,
      // because Intl does not carry an endonym for every locale in every runtime.
      expect(notice, locale).not.toMatch(/\{\w+\}/);
    }
    expect(translate('catalog.unreviewed', 'lo')).toContain('ພາສາລາວ');
    expect(translate('catalog.unreviewed', 'fr')).toContain('français');
  });
});

describe('safety wording survives an unreviewed translation', () => {
  const TIERS = ['safety.escalation.R2', 'safety.escalation.R3', 'safety.escalation.R4'] as const;

  it('shows the English original alongside an unreviewed translation', () => {
    for (const tier of TIERS) {
      const lao = safetyWording(tier, 'lo');
      expect(lao.text).toMatch(/[\u0E80-\u0EFF]/);
      // A mistranslated "seek emergency help" must not silently replace the instruction.
      expect(lao.original, tier).toBe(translate(tier, 'en'));
    }
  });

  it('does not clutter a reviewed catalog with a second copy', () => {
    for (const tier of TIERS) {
      expect(safetyWording(tier, 'ko').original).toBeNull();
      expect(safetyWording(tier, 'en').original).toBeNull();
    }
  });

  it('translates every escalating tier in Lao, the launch language', () => {
    for (const tier of TIERS) {
      const text = translate(tier, 'lo');
      expect(text.length).toBeGreaterThan(20);
      expect(text).not.toBe(translate(tier, 'en'));
    }
  });

  it('translates every escalating tier in Thai too, since Lao speech borrows its voice', () => {
    for (const tier of TIERS) {
      const text = translate(tier, 'th');
      expect(text.length).toBeGreaterThan(20);
      expect(text).not.toBe(translate(tier, 'en'));
      expect(text).not.toBe(translate(tier, 'lo'));
    }
  });

  it('names the emergency route in the most severe tier', () => {
    // R4 is the only tier that must send the reader out of the app. Whatever the language,
    // it has to say so — checked here as a property of every catalog, not of one translation.
    for (const locale of UI_CATALOG_LOCALES) {
      expect(translate('safety.escalation.R4', locale).length).toBeGreaterThan(30);
    }
    expect(translate('safety.escalation.R4', 'lo')).toContain('ສຸກເສີນ'); // "emergency"
    expect(translate('safety.escalation.R4', 'lo')).toContain('ແພດ'); // "medical"
  });

  it('routes every halting surface through the one component that does this', async () => {
    const { readFileSync } = await import('node:fs');
    const surfaces = [
      'src/ui/components/LessonRunner.tsx',
      'src/ui/screens/RoutineStudioScreen.tsx',
      'src/ui/screens/SunProtectionScreen.tsx',
    ];
    for (const surface of surfaces) {
      const source = readFileSync(new URL(`../${surface}`, import.meta.url), 'utf8');
      expect(source, surface).toMatch(/<SafetyNotice/);
      // Translating the halt key directly would skip the original-wording safeguard.
      expect(source, surface).not.toMatch(/translate\(state\.safetyHaltMessageKey/);
    }
  });

  it('offers to speak the safety message, in Thai for a Lao reader', async () => {
    const { SPOKEN_FALLBACK } = await import('@/ui/speech');
    // SafetyNotice looks up SPOKEN_FALLBACK[locale] itself; this proves the entry it needs
    // for its highest-stakes surface is exactly the one speech.ts declares.
    expect(SPOKEN_FALLBACK['lo']).toBe('th');
    for (const tier of TIERS) {
      const laoText = translate(tier, 'lo');
      const thaiText = translate(tier, SPOKEN_FALLBACK['lo']!);
      // The two scripts never share code points, so a caller cannot mix them up by accident.
      expect(laoText).toMatch(/[\u0E80-\u0EFF]/);
      expect(thaiText).toMatch(/[\u0E00-\u0E7F]/);
      expect(thaiText).not.toMatch(/[\u0E80-\u0EFF]/);
    }
  });

  it('wires SafetyNotice itself to the Lao\u2192Thai fallback, not a hand-rolled copy', async () => {
    const { readFileSync } = await import('node:fs');
    const source = readFileSync(
      new URL('../src/ui/components/SafetyNotice.tsx', import.meta.url),
      'utf8',
    );
    // Anchored to the actual lookup and prop wiring, not merely a mention of the name \u2014 a
    // docstring referencing SPOKEN_FALLBACK would otherwise satisfy a looser check while the
    // real wiring was deleted underneath it.
    expect(source).toMatch(/SPOKEN_FALLBACK\[locale\]/);
    expect(source).toMatch(/<ReadAloud[^>]*fallback=\{fallback\}/s);
  });

  it('tells LessonRunner\u2019s read-aloud the real language of a fallen-back passage', async () => {
    // Lesson content exists only in en/ko. A reader in fr/lo/th who is looking at the English
    // fallback must have that read as English \u2014 asking a device for a voice in a language
    // the passage is not written in is exactly the defect `spokenLocale` exists to prevent.
    const { readFileSync } = await import('node:fs');
    const source = readFileSync(
      new URL('../src/ui/components/LessonRunner.tsx', import.meta.url),
      'utf8',
    );
    const spokenLocaleUses = source.match(/spokenLocale=\{[^}]*usedFallback[^}]*\}/g) ?? [];
    expect(spokenLocaleUses.length).toBe(3);
  });
});
