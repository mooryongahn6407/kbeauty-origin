/**
 * Design system tests.
 *
 * "Make it readable" is the kind of requirement that quietly decays: one small font here, one
 * low-contrast grey there, and six months later the app is unusable in sunlight and nobody can
 * point at the commit. So the three rules in theme.css are checked as numbers, against the
 * stylesheet that actually ships.
 *
 *   1. Nothing is smaller than the scale's smallest step — and the scale's smallest step is at
 *      least 13px at the browser default.
 *   2. Every text/background pair clears WCAG AA (4.5:1), in BOTH themes. The ratios are
 *      computed here from the hex values in the file, not asserted from memory.
 *   3. Interactive targets are at least 44px, and focus is visible.
 *
 * The contrast maths is the W3C formula (WCAG 2.1 §1.4.3): relative luminance, then
 * (lighter + 0.05) / (darker + 0.05).
 */
import { globSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PREFERENCES,
  TEXT_SIZE_CHOICES,
  THEME_CHOICES,
  applyPreferences,
  parsePreferences,
  themeAttribute,
} from '@/ui/preferences';

const CSS = readFileSync(new URL('../src/ui/theme.css', import.meta.url), 'utf8');

/* ------------------------------------------------------------------ *
 * Token extraction
 * ------------------------------------------------------------------ */

/** Pull `--name: value;` pairs out of the block a selector opens. */
function blockTokens(selector: string): Readonly<Record<string, string>> {
  const start = CSS.indexOf(selector);
  if (start < 0) throw new Error(`Selector ${selector} not found in theme.css`);
  const open = CSS.indexOf('{', start);
  const close = CSS.indexOf('}', open);
  const body = CSS.slice(open + 1, close);
  const tokens: Record<string, string> = {};
  for (const match of body.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
    tokens[match[1]!] = match[2]!.trim();
  }
  return tokens;
}

const LIGHT = blockTokens(':root {');
/** The explicit override block — identical by construction to the prefers-color-scheme one. */
const DARK = blockTokens(":root[data-theme='dark'] {");
const DARK_AUTO = blockTokens(":root:not([data-theme='light']) {");

/* ------------------------------------------------------------------ *
 * WCAG contrast
 * ------------------------------------------------------------------ */
const channel = (value: number): number => {
  const c = value / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

function luminance(hex: string): number {
  const match = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) throw new Error(`Not a 6-digit hex colour: ${hex}`);
  const n = Number.parseInt(match[1]!, 16);
  return (
    0.2126 * channel((n >> 16) & 255) +
    0.7152 * channel((n >> 8) & 255) +
    0.0722 * channel(n & 255)
  );
}

export function contrastRatio(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (light + 0.05) / (dark + 0.05);
}

/** Every text colour against every surface it is actually rendered on. */
const TEXT_PAIRS: readonly { fg: string; bg: string; where: string }[] = [
  { fg: 'text', bg: 'bg', where: 'body text on the page' },
  { fg: 'text', bg: 'surface', where: 'body text on a card' },
  { fg: 'text', bg: 'surface-sunk', where: 'body text on a sunk card' },
  { fg: 'text-muted', bg: 'bg', where: '.muted on the page' },
  { fg: 'text-muted', bg: 'surface', where: '.muted on a card' },
  { fg: 'text-muted', bg: 'surface-sunk', where: '.muted on a sunk card, and .tag' },
  { fg: 'accent', bg: 'bg', where: 'brand line, provenance keys' },
  { fg: 'accent', bg: 'surface', where: 'provenance keys on a card' },
  { fg: 'accent', bg: 'surface-sunk', where: 'accent text on a sunk card' },
  { fg: 'accent', bg: 'accent-wash', where: '.tag--open, selected option' },
  { fg: 'botanical', bg: 'surface', where: '.eyebrow on a card' },
  { fg: 'botanical', bg: 'bg', where: '.eyebrow on the page' },
  { fg: 'botanical', bg: 'botanical-wash', where: '.disclosure--info, satisfied dimension' },
  { fg: 'caution', bg: 'caution-wash', where: '.disclosure--caution, .tag--critical' },
  { fg: 'blocker', bg: 'blocker-wash', where: '.tag--blocker' },
  { fg: 'btn-fg', bg: 'btn-bg', where: 'primary button label' },
];

const themes: readonly [string, Readonly<Record<string, string>>][] = [
  ['light', LIGHT],
  ['dark', DARK],
];

describe('colour contrast clears WCAG AA in both themes', () => {
  for (const [name, tokens] of themes) {
    for (const pair of TEXT_PAIRS) {
      it(`${name}: --${pair.fg} on --${pair.bg} (${pair.where})`, () => {
        const fg = tokens[pair.fg];
        const bg = tokens[pair.bg];
        expect(fg, `--${pair.fg} missing from the ${name} theme`).toBeDefined();
        expect(bg, `--${pair.bg} missing from the ${name} theme`).toBeDefined();
        expect(contrastRatio(fg!, bg!)).toBeGreaterThanOrEqual(4.5);
      });
    }

    it(`${name}: the focus ring is visible against the page (3:1, WCAG 1.4.11)`, () => {
      expect(contrastRatio(tokens['focus']!, tokens['bg']!)).toBeGreaterThanOrEqual(3);
    });

    it(`${name}: borders are distinguishable from the surface they sit on`, () => {
      expect(contrastRatio(tokens['line']!, tokens['surface']!)).toBeGreaterThan(1.2);
      expect(contrastRatio(tokens['line-strong']!, tokens['surface']!)).toBeGreaterThan(1.8);
    });
  }

  it('defines the same token names in both themes, so no component loses a colour', () => {
    const colourNames = (tokens: Readonly<Record<string, string>>) =>
      Object.keys(tokens)
        .filter((name) => tokens[name]!.startsWith('#'))
        .sort();
    expect(colourNames(DARK)).toEqual(colourNames(LIGHT));
  });

  it('keeps the two dark blocks identical — the media query and the explicit override', () => {
    // They are written out twice because one applies by device preference and one by the
    // reader's choice. If they ever drift, one of the two ways to get dark mode is wrong.
    for (const [name, value] of Object.entries(DARK)) {
      expect(DARK_AUTO[name], `--${name}`).toBe(value);
    }
    expect(Object.keys(DARK_AUTO).sort()).toEqual(Object.keys(DARK).sort());
  });

  it('is genuinely dark, not a lightly tinted light theme', () => {
    expect(luminance(DARK['bg']!)).toBeLessThan(0.05);
    expect(luminance(LIGHT['bg']!)).toBeGreaterThan(0.8);
  });
});

/* ------------------------------------------------------------------ *
 * Type scale
 * ------------------------------------------------------------------ */
describe('nothing in the app is too small to read', () => {
  const SCALE_STEPS = ['2xs', 'xs', 'sm', 'base', 'md', 'lg', 'xl', '2xl'] as const;

  /** The rem multiplier inside `calc(Xrem * var(--text-scale))`. */
  const stepRem = (step: string): number => {
    const raw = LIGHT[`fs-${step}`];
    const match = /calc\(([\d.]+)rem/.exec(raw ?? '');
    if (!match) throw new Error(`--fs-${step} is not a calc() on the text scale: ${raw}`);
    return Number.parseFloat(match[1]!);
  };

  it('defines every step of the scale', () => {
    for (const step of SCALE_STEPS) expect(stepRem(step)).toBeGreaterThan(0);
  });

  it('never goes below 13px at the browser default', () => {
    // 0.8125rem × 16px = 13px. The previous design had 0.62rem — just under 10px.
    for (const step of SCALE_STEPS) {
      expect(stepRem(step) * 16, `--fs-${step}`).toBeGreaterThanOrEqual(13);
    }
  });

  it('rises monotonically, so a bigger name is always a bigger size', () => {
    const sizes = SCALE_STEPS.map(stepRem);
    for (let index = 1; index < sizes.length; index += 1) {
      expect(sizes[index]!).toBeGreaterThan(sizes[index - 1]!);
    }
  });

  it('sets body text at 17px or more at the browser default', () => {
    expect(stepRem('base') * 16).toBeGreaterThanOrEqual(17);
  });

  it('uses no font-size outside the scale', () => {
    // Every `font-size:` must be a var() from the scale or `1em`/`inherit`. A literal rem or
    // px value is how a 10px label gets back in. The one exception is `html { font-size: 100% }`,
    // which is the root the whole scale is relative to and is asserted separately below.
    const offenders: string[] = [];
    for (const match of CSS.matchAll(/font-size:\s*([^;]+);/g)) {
      const value = match[1]!.trim();
      const fromScale = /^var\(--fs-(2xs|xs|sm|base|md|lg|xl|2xl)\)$/.test(value);
      if (!fromScale && !['1em', 'inherit', '100%'].includes(value)) offenders.push(value);
    }
    expect(offenders).toEqual([]);
  });

  it('sets no font size inline in a component, where the scale cannot reach it', () => {
    // How the old 10px labels survived the first pass of this file: the stylesheet was clean
    // and seventeen components carried `style={{ fontSize: '0.72rem' }}`, which neither the
    // scale nor the reader's text-size setting can touch. Found in the browser, not here —
    // so it is checked here now.
    const files = globSync('src/ui/**/*.tsx');
    expect(files.length).toBeGreaterThan(10);
    for (const file of files) {
      const source = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
      expect(source, file).not.toMatch(/fontSize/);
    }
  });

  it('respects the browser font size rather than pinning a pixel value', () => {
    expect(CSS).toMatch(/html\s*\{[^}]*font-size:\s*100%/);
    expect(CSS).not.toMatch(/html\s*\{[^}]*font-size:\s*\d+px/);
  });

  it('offers a text-size step that meaningfully enlarges everything', () => {
    const larger = /data-text-size='larger'\]\s*\{\s*--text-scale:\s*([\d.]+)/.exec(CSS);
    expect(larger).not.toBeNull();
    expect(Number.parseFloat(larger![1]!)).toBeGreaterThanOrEqual(1.3);
    // The smallest text at the largest step must clear 17px — the point of the setting.
    const smallest = /--fs-2xs:\s*calc\(([\d.]+)rem/.exec(CSS)![1]!;
    expect(Number.parseFloat(smallest) * 16 * Number.parseFloat(larger![1]!)).toBeGreaterThan(17);
  });
});

/* ------------------------------------------------------------------ *
 * Targets and motion
 * ------------------------------------------------------------------ */
describe('everything you can press is big enough to press', () => {
  it('sets a 44px minimum target', () => {
    expect(/--tap:\s*(\d+)px/.exec(CSS)?.[1]).toBe('44');
  });

  it('applies it to the controls a learner uses most', () => {
    for (const rule of [
      '.btn',
      '.option',
      '.nav__item',
      '.textarea, .field',
      '.segmented__item',
      '.speak',
      '.btn--small',
    ]) {
      // Anchored to the start of a line: a per-language override such as
      // `:root[lang='lo'] .option` is a different rule and must not be mistaken for this one.
      const start = CSS.search(new RegExp(`^${rule.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} \\{`, 'm'));
      expect(start, rule).toBeGreaterThan(-1);
      const body = CSS.slice(start, CSS.indexOf('}', start));
      expect(body, rule).toMatch(/min-height:\s*var\(--tap\)/);
    }
  });

  it('shows a focus ring rather than removing the outline', () => {
    expect(CSS).toMatch(/:focus-visible\s*\{[^}]*outline:\s*3px solid var\(--focus\)/);
    expect(CSS).not.toMatch(/outline:\s*(none|0)\s*;/);
  });

  it('honours prefers-reduced-motion', () => {
    expect(CSS).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
  });

  it('follows the device theme by default, and lets the reader override it', () => {
    expect(CSS).toMatch(/@media \(prefers-color-scheme: dark\)/);
    // Guarded, so that an explicit "light" choice wins over a dark device.
    expect(CSS).toMatch(/:root:not\(\[data-theme='light'\]\)/);
    expect(CSS).toMatch(/:root\[data-theme='dark'\]/);
  });
});

/* ------------------------------------------------------------------ *
 * Narrow screens
 * ------------------------------------------------------------------ */
describe('a wide table scrolls on its own axis instead of the whole page', () => {
  it('makes .table its own horizontal scroll container under the narrow-screen breakpoint', () => {
    const start = CSS.search(/@media \(max-width: 640px\)\s*\{/);
    expect(start).toBeGreaterThan(-1);
    const block = CSS.slice(start, CSS.lastIndexOf('}'));
    const rule = /^\s*\.table\s*\{[^}]*\}/m.exec(block);
    expect(rule, '.table rule inside the narrow-screen media query').not.toBeNull();
    expect(rule?.[0]).toMatch(/overflow-x:\s*auto/);
  });

  it('lets an unbroken value like a source ID wrap instead of overflowing the page', () => {
    const start = CSS.search(/^\.provenance \{/m);
    expect(start).toBeGreaterThan(-1);
    const body = CSS.slice(start, CSS.indexOf('}', start));
    expect(body).toMatch(/overflow-wrap:\s*anywhere/);
  });
});

/* ------------------------------------------------------------------ *
 * Scripts that need more than the Latin defaults
 * ------------------------------------------------------------------ */
describe('Lao and Thai typography', () => {
  // Both stack vowel and tone marks above and below the consonant (collides at the default
  // 1.7 line-height) and write phrases without spaces between words (overflows a browser that
  // only breaks on spaces). Checked for both scripts, in parallel, so one cannot regress
  // without the other being noticed.
  for (const lang of ['lo', 'th']) {
    it(`gives :lang(${lang}) its own font stack, not just the Latin default`, () => {
      const rule = new RegExp(`:root\\[lang='${lang}'\\] body[^{]*\\{[^}]*font-family:`, 's');
      expect(CSS, lang).toMatch(rule);
    });

    it(`raises :lang(${lang})'s line-height so stacked marks do not collide`, () => {
      const start = CSS.search(new RegExp(`:root\\[lang='${lang}'\\] body`));
      expect(start, lang).toBeGreaterThan(-1);
      const block = CSS.slice(start, CSS.indexOf('}', start));
      const match = /line-height:\s*([\d.]+)/.exec(block);
      expect(match, lang).not.toBeNull();
      expect(Number.parseFloat(match![1]!), lang).toBeGreaterThanOrEqual(1.9);
    });

    it(`lets :lang(${lang}) wrap mid-phrase instead of overflowing`, () => {
      const rule = new RegExp(`:root\\[lang='${lang}'\\][^{]*\\{[^}]*overflow-wrap:\\s*anywhere`, 's');
      expect(CSS, lang).toMatch(rule);
    });

    it(`turns off uppercasing for :lang(${lang}), which has no case to transform`, () => {
      const rule = new RegExp(`:root\\[lang='${lang}'\\][^{]*\\.eyebrow[^{]*\\{[^}]*text-transform:\\s*none`, 's');
      expect(CSS, lang).toMatch(rule);
    });
  }

  it('names Noto Sans Lao and Noto Sans Thai in the shared font stacks too', () => {
    // Not only under :lang(lo)/:lang(th) — a passage in one script can appear inside an
    // English sentence (the safety-original wording, or a Thai fallback spoken for Lao), and
    // must not fall back to tofu just because the surrounding page is in English.
    expect(CSS).toMatch(/--font-body:[^;]*Noto Sans Lao/);
    expect(CSS).toMatch(/--font-body:[^;]*Noto Sans Thai/);
    expect(CSS).toMatch(/--font-ui:[^;]*Noto Sans Lao/);
    expect(CSS).toMatch(/--font-ui:[^;]*Noto Sans Thai/);
  });
});

/* ------------------------------------------------------------------ *
 * Preferences
 * ------------------------------------------------------------------ */
describe('display preferences', () => {
  it('defaults to following the device', () => {
    expect(DEFAULT_PREFERENCES.theme).toBe('auto');
    expect(DEFAULT_PREFERENCES.textSize).toBe('normal');
  });

  it('offers exactly the choices the stylesheet implements', () => {
    expect([...THEME_CHOICES]).toEqual(['auto', 'light', 'dark']);
    for (const size of TEXT_SIZE_CHOICES) {
      if (size === 'normal') continue;
      expect(CSS).toContain(`data-text-size='${size}'`);
    }
  });

  it('writes no data-theme for auto, so the device preference can apply', () => {
    expect(themeAttribute('auto')).toBeNull();
    expect(themeAttribute('dark')).toBe('dark');
  });

  it('round-trips stored preferences', () => {
    expect(parsePreferences(JSON.stringify({ theme: 'dark', textSize: 'larger' }))).toEqual({
      theme: 'dark',
      textSize: 'larger',
    });
  });

  it('ignores stored values it does not recognise rather than trusting them', () => {
    expect(parsePreferences('{"theme":"neon","textSize":42}')).toEqual(DEFAULT_PREFERENCES);
    expect(parsePreferences('not json')).toEqual(DEFAULT_PREFERENCES);
    expect(parsePreferences(null)).toEqual(DEFAULT_PREFERENCES);
  });

  it('applies the attributes a stylesheet can key off', () => {
    const attributes = new Map<string, string>();
    const root = {
      setAttribute: (name: string, value: string) => void attributes.set(name, value),
      removeAttribute: (name: string) => void attributes.delete(name),
    };

    applyPreferences({ theme: 'dark', textSize: 'large' }, root);
    expect(attributes.get('data-theme')).toBe('dark');
    expect(attributes.get('data-text-size')).toBe('large');

    applyPreferences({ theme: 'auto', textSize: 'normal' }, root);
    expect(attributes.has('data-theme')).toBe(false);
    expect(attributes.get('data-text-size')).toBe('normal');
  });
});

/* ------------------------------------------------------------------ *
 * Components use tokens, never literal colours
 * ------------------------------------------------------------------ */
describe('components name no colour of their own', () => {
  it('has no literal colour left in a component or screen', () => {
    // A hex in a component is a colour that cannot follow the theme, which is exactly how a
    // dark mode ends up with black text on a black card.
    const files = [
      'src/ui/App.tsx',
      'src/ui/components/LessonRunner.tsx',
      'src/ui/components/Disclosures.tsx',
      'src/ui/components/MasteryPanel.tsx',
      'src/ui/components/DisplaySettings.tsx',
      'src/ui/components/ReadAloud.tsx',
    ];
    for (const file of files) {
      const source = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
      expect(source, file).not.toMatch(/#[0-9a-fA-F]{3,6}\b/);
    }
  });

  it('declares no literal colour in theme.css outside the two token blocks', () => {
    const withoutTokens = CSS.replace(/--[\w-]+\s*:\s*[^;]+;/g, '');
    const literals = [...withoutTokens.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map((m) => m[0]);
    expect(literals).toEqual([]);
  });
});
