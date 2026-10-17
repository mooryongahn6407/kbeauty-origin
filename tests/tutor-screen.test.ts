/**
 * The AI tutor screen: internal tables are for the team, the question box has a limit, and the
 * "what I am unsure about" notes come from the translation catalogue in every language.
 */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AITutorScreen, TUTOR_QUESTION_MAX } from '@/ui/screens/AITutorScreen';
import { respond } from '@/tutor/tutor-engine';
import { translate } from '@/localization/messages';

const render = (props: { locale: string; showInternals?: boolean }) =>
  renderToStaticMarkup(createElement(AITutorScreen, props));

describe('internal tables are hidden from readers', () => {
  it('shows neither the rule table nor the self-test by default', () => {
    const html = render({ locale: 'en' });
    expect(html).not.toContain(translate('tutor.rulesTitle', 'en'));
    expect(html).not.toContain(translate('tutor.evalTitle', 'en'));
    expect(html).not.toContain('Pass criteria');
  });

  it('shows both only when explicitly asked', () => {
    const html = render({ locale: 'en', showInternals: true });
    expect(html).toContain(translate('tutor.rulesTitle', 'en'));
    expect(html).toContain(translate('tutor.evalTitle', 'en'));
  });
});

describe('the question box', () => {
  it('accepts at most 500 characters', () => {
    expect(TUTOR_QUESTION_MAX).toBe(500);
    expect(render({ locale: 'en' })).toContain('maxLength="500"');
  });
});

describe('uncertainty notes come from the catalogue', () => {
  const unsure = respond({
    userMessage: 'zzzz qqqq',
    nodeId: 'KN-D99-99-999',
    skillId: null,
    locale: 'ko',
    hintsUsed: 0,
    failedAttempts: 0,
    userRequestedProductHelp: false,
  });

  it('returns keys with parameters, and the English text alongside for the evaluation suite', () => {
    expect(unsure.uncertaintyNotes.length).toBeGreaterThan(0);
    expect(unsure.uncertaintyNotes.length).toBe(unsure.uncertainty.length);
    unsure.uncertaintyNotes.forEach((note, index) => {
      expect(note.key.startsWith('tutor.unc.')).toBe(true);
      expect(unsure.uncertainty[index]).toBe(translate(note.key, 'en', note.params));
    });
    expect(unsure.uncertainty.join(' ')).toContain('KN-D99-99-999');
  });

  it('has its own wording in every language, with the parameters filled in', () => {
    const keys = [
      'tutor.unc.nodeMissing',
      'tutor.unc.noMatch',
      'tutor.unc.notFact',
      'tutor.unc.unresolvedEvidence',
      'tutor.unc.unfilled',
    ] as const;
    for (const key of keys) {
      const en = translate(key, 'en', { nodeId: 'X', reason: 'R', count: '2', missing: '1', total: '3', mode: 'M' });
      for (const locale of ['ko', 'fr', 'lo', 'th']) {
        const text = translate(key, locale, { nodeId: 'X', reason: 'R', count: '2', missing: '1', total: '3', mode: 'M' });
        expect(text, `${key}.${locale}`).not.toBe(en);
        expect(text).not.toMatch(/\{[a-zA-Z]+\}/);
      }
    }
  });

  it('is no longer hard-coded English in the engine', async () => {
    const { readFileSync } = await import('node:fs');
    const engine = readFileSync(new URL('../src/tutor/tutor-engine.ts', import.meta.url), 'utf8');
    expect(engine).not.toContain('was requested but does not exist');
    expect(engine).not.toContain('Nothing in the governed knowledge matched');
    expect(engine).not.toContain('cannot be filled honestly yet');
  });
});
