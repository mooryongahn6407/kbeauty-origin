/**
 * Batch 4 UI fixes: line icons instead of emoji on the reader's screens, one install offer per
 * visit, and room for the floating share/like pair so it covers nothing on a phone.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it } from 'vitest';
import { GLYPH_PATHS, GlyphIcon, glyphFor } from '@/ui/components/GlyphIcon';
import {
  INSTALL_OFFER_VISIT_KEY,
  installOfferedThisVisit,
  markInstallOffered,
  mayOfferInstall,
  resetInstallOfferForTests,
} from '@/app/install-offer';

// Pictographs, flags, ℹ and the dingbat block (☀ ✓ ✍ …) — the ones that render as emoji.
const EMOJI = /[\u{1F1E6}-\u{1F1FF}\u{1F300}-\u{1FAFF}ℹ☀-➿⭐]/u;
const SCREENS = resolve(__dirname, '../src/ui/screens');

describe('line icons, never emoji', () => {
  it('no reader screen renders an emoji character from its own source', () => {
    for (const file of readdirSync(SCREENS).filter((name) => name.endsWith('.tsx'))) {
      const code = readFileSync(resolve(SCREENS, file), 'utf8')
        .split('\n')
        .filter((line) => !/^\s*(\*|\/\/|\/\*)/.test(line)) // comments may quote one
        .join('\n');
      expect(code, file).not.toMatch(EMOJI);
    }
  });

  it('turns a content emoji key into an aria-hidden line SVG, never the emoji itself', () => {
    for (const key of ['☀️', '🌙', '💧', '🔬', '🎓', '✍️', '🛍️', '🤷']) {
      const html = renderToStaticMarkup(createElement(GlyphIcon, { glyph: key }));
      expect(html).toMatch(/^<svg[^>]*aria-hidden="true"/);
      expect(html).not.toMatch(EMOJI);
    }
    expect(glyphFor('☀️')).toBe('sun');
    expect(glyphFor('🔬')).toBe('search');
    expect(glyphFor('🤷')).toBe('ring');
    for (const path of Object.values(GLYPH_PATHS)) expect(path).toMatch(/^M/);
  });
});

describe('one install offer per visit', () => {
  const store = new Map<string, string>();
  const session = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
  } as unknown as Storage;

  beforeEach(() => {
    store.clear();
    resetInstallOfferForTests();
  });

  it('lets the first-screen strip keep offering, and keeps the result sheet quiet', () => {
    expect(mayOfferInstall('strip', session)).toBe(true);
    markInstallOffered('strip', session);
    expect(mayOfferInstall('strip', session)).toBe(true);
    expect(mayOfferInstall('sheet', session)).toBe(false);
    expect(store.get(INSTALL_OFFER_VISIT_KEY)).toBe('strip');
  });

  it('works the other way round, and survives a reload within the visit', () => {
    markInstallOffered('sheet', session);
    resetInstallOfferForTests(); // a reload: memory gone, session storage kept
    expect(installOfferedThisVisit(session)).toBe('sheet');
    expect(mayOfferInstall('strip', session)).toBe(false);
  });

  it('still holds for the visit when storage throws (private window)', () => {
    const broken = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
    } as unknown as Storage;
    markInstallOffered('strip', broken);
    expect(mayOfferInstall('sheet', broken)).toBe(false);
  });
});

describe('the floating share/like pair covers nothing on a phone', () => {
  const css = readFileSync(resolve(__dirname, '../src/ui/theme.css'), 'utf8');
  it('sits in its own opaque band on top of the measured bottom bar', () => {
    expect(css).toMatch(/body:has\(\.kgs-dock\):has\(\.kg-bottombar\)::after \{[^}]*background: var\(--surface\)/);
    expect(css).toMatch(/\.kgs-dock \{ flex-direction: row !important; bottom: calc\(var\(--kg-bar-h/);
    const bar = readFileSync(resolve(__dirname, '../src/ui/components/AppChrome.tsx'), 'utf8');
    expect(bar).toContain("setProperty('--kg-bar-h'");
  });
});
