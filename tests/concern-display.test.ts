/**
 * Consumer-facing concern copy.
 *
 * Two things went to a shopper's screen that were never written for her: `Concern_Name`, which
 * the database keeps in English, and `Learning_Goal`, which is a Korean instruction to whoever
 * authors the lessons — including the words "치료 주장 금지" (do not claim treatment), printed
 * verbatim on a consumer's phone. `data/authored/concern-display.json` supplies the copy the
 * database has no column for.
 *
 * The risk in writing that copy is the obvious one: a line describing a skin concern is one
 * careless verb away from a medical or efficacy claim, and the corpus has nothing approved
 * behind it. So the asserted property is narrow and mechanical — a notice may say what a person
 * SEES or FEELS, and nothing else. No cause, no treatment, no recommendation, no product.
 */
import { describe, expect, it } from 'vitest';
import { concerns } from '@/knowledge/repository';
import {
  concernDisplays,
  concernName,
  concernNotice,
  laoNeedsPartnerReview,
} from '@/content/concern-display';

const LOCALES = ['en', 'ko', 'fr', 'lo', 'th'] as const;

describe('the copy covers the governed records and invents none', () => {
  it('writes copy for every concern in the database', () => {
    const covered = new Set(concernDisplays.map((entry) => entry.concernId));
    for (const concern of concerns) {
      expect(covered.has(concern.Concern_ID), concern.Concern_ID).toBe(true);
    }
  });

  it('names no concern the database does not have', () => {
    // Rule 4: a broken reference is reported, never invented into existence.
    const governed = new Set(concerns.map((concern) => concern.Concern_ID));
    for (const entry of concernDisplays) {
      expect(governed.has(entry.concernId), entry.concernId).toBe(true);
    }
  });

  it('records each source name unchanged, so a source rename is caught here', () => {
    // Rule 1: the copy never edits Concern_Name. Keeping a copy of it means this test fails
    // loudly if the workbook changes one, rather than the app quietly showing stale copy.
    for (const entry of concernDisplays) {
      const record = concerns.find((concern) => concern.Concern_ID === entry.concernId);
      expect(record?.Concern_Name, entry.concernId).toBe(entry.sourceName);
    }
  });
});

describe('every reader gets their own language', () => {
  it('gives every concern a name and a notice in all five catalogs', () => {
    for (const entry of concernDisplays) {
      for (const locale of LOCALES) {
        expect(entry.name[locale], `${entry.concernId} name/${locale}`).toBeTruthy();
        expect(entry.notice[locale], `${entry.concernId} notice/${locale}`).toBeTruthy();
      }
    }
  });

  it('never shows an English label to a Lao or Thai reader', () => {
    // The defect this whole file exists to fix: "Acne" on a Vientiane phone.
    for (const concern of concerns) {
      for (const locale of ['lo', 'th'] as const) {
        const shown = concernName(concern.Concern_ID, locale, concern.Concern_Name);
        expect(shown, `${concern.Concern_ID}/${locale}`).not.toBe(concern.Concern_Name);
        expect(shown, `${concern.Concern_ID}/${locale}`).not.toMatch(/^[\x20-\x7E]+$/);
      }
    }
  });

  it('falls back to the source name rather than rendering nothing', () => {
    expect(concernName('CON-999', 'ko', 'Unknown')).toBe('Unknown');
    expect(concernNotice('CON-999', 'ko')).toBeNull();
  });

  it('flags the Lao names that a native speaker still has to confirm', () => {
    // Honesty, not coverage: these are phrases assembled rather than terms found in use, and
    // the senior partner sees this list first. An empty list would be the suspicious answer.
    expect(laoNeedsPartnerReview.length).toBeGreaterThan(0);
    for (const id of laoNeedsPartnerReview) {
      expect(concerns.some((concern) => concern.Concern_ID === id), id).toBe(true);
    }
  });
});

describe('a notice says what you see, and nothing more', () => {
  /** Verbs that turn a description into a medical or efficacy claim. */
  const CLAIMS =
    /\b(cure|cures|treat|treats|heal|heals|prevent|prevents|reduce|reduces|improve|improves|fix|fixes|repair|repairs|clear up|get rid of|caused by|because of|you should|apply|use a|try a)\b/i;

  /** The Korean equivalents, which is where a slip is likeliest — the source notes are Korean. */
  const CLAIMS_KO = /(치료|완치|낫게|개선|예방|없애|제거|해결|추천|바르세요|사용하세요|때문에|원인은)/;

  it('promises nothing in any language', () => {
    for (const entry of concernDisplays) {
      for (const locale of LOCALES) {
        const line = entry.notice[locale]!;
        expect(line, `${entry.concernId}/${locale}`).not.toMatch(CLAIMS);
        expect(line, `${entry.concernId}/${locale}`).not.toMatch(CLAIMS_KO);
      }
    }
  });

  it('names no ingredient and no product', () => {
    const NAMED =
      /\b(retinol|niacinamide|hyaluronic|salicylic|glycolic|vitamin c|spf|serum|cream|cleanser|toner)\b/i;
    for (const entry of concernDisplays) {
      for (const locale of LOCALES) {
        expect(entry.notice[locale], `${entry.concernId}/${locale}`).not.toMatch(NAMED);
      }
    }
  });

  it('leaks no internal instruction to the reader', () => {
    // `Learning_Goal` says things like "치료 주장 금지" and "지속 시 전문가 상담" — written for
    // the content team. None of that wording may appear in consumer copy.
    const goals = concerns.map((concern) => concern.Learning_Goal);
    for (const entry of concernDisplays) {
      for (const locale of LOCALES) {
        for (const goal of goals) {
          expect(entry.notice[locale], `${entry.concernId}/${locale}`).not.toContain(goal);
        }
      }
    }
  });

  it('stays one line', () => {
    for (const entry of concernDisplays) {
      for (const locale of LOCALES) {
        const line = entry.notice[locale]!;
        expect(line, `${entry.concernId}/${locale}`).not.toContain('\n');
        expect(line.length, `${entry.concernId}/${locale}`).toBeLessThanOrEqual(120);
      }
    }
  });
});
