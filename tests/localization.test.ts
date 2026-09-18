/**
 * Localization architecture tests.
 * Source: 02_GLOBAL_CONTENT_ENGINE_SPEC_v1.0.md, Master DB 15_LOCALIZATION,
 * AI Tutor Constitution §13.
 */
import { describe, expect, it } from 'vitest';
import { BASE_LOCALE, LOCALES, OQ_L01, findLocale, isKnownLocale } from '@/localization/locales';
import {
  UI_CATALOG_LOCALES,
  messageKeys,
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
