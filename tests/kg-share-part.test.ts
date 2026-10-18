/**
 * The shared KOREA GLOW «Share + Like» part (11_IST, kg_common/parts/v1.2) on GLOW Class:
 * loaded on every page, configured to share the real public address with the reader's language
 * and partner code, asked only at «first success» moments, and harmless when it is missing.
 * Also the «Other KOREA GLOW apps» links.
 */
import { globSync, readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { askToShare, relabelShare, resetVisitForTests } from '@/app/share-ask';
import { CHROME } from '@/ui/chrome-text';
import { OTHER_APPS, OtherAppLinks } from '@/ui/components/OtherApps';

const ROOT = new URL('../', import.meta.url);
const source = (path: string) => readFileSync(new URL(path, ROOT), 'utf8');

/** Runs public/kg_share_config.js against a pretend browser and returns what it set. */
function configFor(search: string, saved: Record<string, string> = {}, languages = ['en-US']) {
  const win: Record<string, unknown> = {
    location: { search },
    localStorage: { getItem: (key: string) => saved[key] ?? null },
  };
  const doc = { documentElement: { lang: '' } };
  new Function('window', 'navigator', 'document', source('public/kg_share_config.js'))(
    win,
    { languages, language: languages[0] },
    doc,
  );
  return win.KG_SHARE as { app: string; url: string; bottom: number; lang: () => string };
}

describe('the shared Share + Like part', () => {
  it('is loaded on the page after its settings, unchanged from the company copy', () => {
    const html = source('index.html');
    const config = html.indexOf('src="/kg_share_config.js"');
    const part = html.indexOf('src="/kg_share_like.js" defer');
    expect(config).toBeGreaterThan(0);
    expect(part).toBeGreaterThan(config);
    expect(source('public/kg_share_like.js')).toMatch(/KG 공용 «공유 \+ 좋아요\(하트\)»/);
  });

  it('shares app.korea-glow.com with the language and a well-formed partner code only', () => {
    expect(configFor('').url).toBe('https://app.korea-glow.com/?lang=en');
    expect(configFor('?lang=lo&p=vte-01').url).toBe('https://app.korea-glow.com/?lang=lo&p=VTE-01');
    expect(configFor('', { 'korea-glow:locale:v1': 'th', 'korea-glow:partner:v1': 'SALON7' }).url).toBe(
      'https://app.korea-glow.com/?lang=th&p=SALON7',
    );
    expect(configFor('?p=<x>', {}, ['fr-FR']).url).toBe('https://app.korea-glow.com/?lang=fr');
    expect(configFor('?lang=de').url).toBe('https://app.korea-glow.com/?lang=en');
    const config = configFor('');
    expect(config.app).toBe('GLOW Class');
    expect(config.url).not.toMatch(/glow-next|localhost|netlify/);
    // Clears the bottom bar (48px buttons + 16px padding + the safe area).
    expect(config.bottom).toBeGreaterThanOrEqual(72);
  });

  it('asks only through the part, never over an open dialog, and does nothing without it', () => {
    resetVisitForTests();
    let asked = 0;
    const api = { ask: () => ((asked += 1), true) };
    const none = { querySelector: () => null };
    expect(askToShare({ KGShare: api, document: none })).toBe(true);
    expect(askToShare({ KGShare: api, document: { querySelector: () => ({}) as Element } })).toBe(false);
    expect(asked).toBe(1);
    expect(askToShare({ document: none })).toBe(false);
    expect(askToShare(null)).toBe(false);
    const broken = { ask: () => { throw new Error('x'); }, relabel: () => { throw new Error('x'); } };
    expect(askToShare({ KGShare: broken, document: none })).toBe(false);
    expect(() => relabelShare({ KGShare: broken })).not.toThrow();
  });

  it('asks or nudges only at the result, on the way to GLOW home and at lesson ends', () => {
    const askers = globSync('src/ui/**/*.tsx', { cwd: ROOT })
      .map((path) => path.replace(/\\/g, '/'))
      .filter((path) => /<ShareAskAtEnd\b|askToShare\(|requestShareNudge\(/.test(source(path)))
      .filter((path) => !path.endsWith('ShareAsk.tsx'))
      .sort();
    expect(askers).toEqual([
      'src/ui/App.tsx',
      'src/ui/components/LessonRunner.tsx',
      'src/ui/screens/CareLessonsScreen.tsx',
      'src/ui/screens/CareQuestScreen.tsx',
    ]);
  });

  it('hides the floating buttons while the app’s own sheet, guide or update line is up', () => {
    expect(source('src/ui/theme.css')).toMatch(/body:has\(\.kg-sheet\) \.kgs-dock/);
  });
});

describe('other KOREA GLOW apps', () => {
  it('lists LAO BRIDGE, the shop (named a shop) and the official site, shop never first', () => {
    expect(OTHER_APPS.map((app) => app.url)).toEqual([
      'https://laobridge.korea-glow.com/',
      'https://buy.korea-glow.com/',
      'https://korea-glow.com/',
    ]);
    expect(CHROME.appSmartBuy!.ko).toContain('쇼핑몰');
    expect(CHROME.appSmartBuy!.en).toMatch(/shop/i);
    expect(CHROME.appLaoBridge!.en).toMatch(/Lao, Korean and English/);
  });

  it('opens each in a new tab with rel="noopener", in every language', () => {
    for (const locale of ['ko', 'en', 'lo', 'th', 'fr']) {
      const html = renderToStaticMarkup(createElement(OtherAppLinks, { locale }));
      expect(html.match(/target="_blank"/g)).toHaveLength(OTHER_APPS.length);
      expect(html.match(/rel="noopener noreferrer"/g)).toHaveLength(OTHER_APPS.length);
      for (const app of OTHER_APPS) expect(html).toContain(`href="${app.url}"`);
    }
  });
});
