/**
 * No blank white screen: a screen that throws is caught and replaced by a calm, translated note
 * with «Try again» and «Go home».
 */
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ErrorBoundary, ErrorFallback, fallbackLocale } from '@/ui/components/ErrorBoundary';
import { CHROME } from '@/ui/chrome-text';

const noop = () => undefined;

describe('the boundary catches a failing screen', () => {
  it('switches to its fallback when a child throws', () => {
    expect(ErrorBoundary.getDerivedStateFromError()).toEqual({ failed: true });
  });

  it('renders its children when nothing failed', () => {
    const html = renderToStaticMarkup(createElement(ErrorBoundary, null, createElement('p', null, 'fine')));
    expect(html).toBe('<p>fine</p>');
  });

  it('wraps the whole app in main.tsx', () => {
    const main = readFileSync(new URL('../src/main.tsx', import.meta.url), 'utf8');
    expect(main).toMatch(/<ErrorBoundary>\s*<App \/>\s*<\/ErrorBoundary>/);
  });
});

describe('the fallback is calm, translated and offers two ways out', () => {
  for (const locale of ['ko', 'en', 'lo', 'th', 'fr'] as const) {
    it(`${locale}: title, body, Try again and Go home`, () => {
      const html = renderToStaticMarkup(
        createElement(ErrorFallback, { locale, onRetry: noop, onHome: noop }),
      );
      for (const key of ['errTitle', 'errBody', 'errRetry', 'errHome'] as const) {
        const expected = CHROME[key]![locale]!
          .replaceAll('&', '&amp;')
          .replaceAll('<', '&lt;')
          .replaceAll('"', '&quot;')
          .replaceAll("'", '&#x27;');
        expect(html, `${key}.${locale}`).toContain(expected);
      }
      expect(html).toContain('role="alert"');
      expect((html.match(/<button/g) ?? []).length).toBe(2);
    });
  }

  it('uses theme tokens, not a hard-coded white page', () => {
    const css = readFileSync(new URL('../src/ui/theme.css', import.meta.url), 'utf8');
    const rule = css.match(/\.kg-crash \{[^}]*\}/)?.[0] ?? '';
    expect(rule).toContain('var(--bg)');
    expect(rule).toContain('var(--text)');
  });

  it('works out a language without the app or any storage', () => {
    expect(['en', 'ko', 'fr', 'lo', 'th']).toContain(fallbackLocale());
  });
});
