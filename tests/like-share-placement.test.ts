/**
 * Where Like · Share and the other-apps links appear — a few chosen places, not every screen —
 * and that the other apps open safely in a new tab, with the shop named as a shop.
 */
import { globSync, readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CHROME } from '@/ui/chrome-text';
import { OTHER_APPS, OtherAppLinks } from '@/ui/components/OtherApps';

const ROOT = new URL('../', import.meta.url);
const source = (path: string) => readFileSync(new URL(path, ROOT), 'utf8');

describe('Like · Share placement', () => {
  it('appears on home, at the end of the skin-game result and at the end of a lesson — nowhere else', () => {
    const users = globSync('src/ui/**/*.tsx', { cwd: ROOT })
      .map((path) => path.replace(/\\/g, '/'))
      .filter((path) => !path.endsWith('LikeShare.tsx'))
      .filter((path) => /<LikeShareBar\b/.test(source(path)))
      .sort();
    expect(users).toEqual([
      'src/ui/App.tsx',
      'src/ui/components/LessonRunner.tsx',
      'src/ui/screens/CareLessonsScreen.tsx',
      'src/ui/screens/CareQuestScreen.tsx',
    ]);
    // On the quest screen the home bar is shown only on the welcome step.
    expect(source('src/ui/App.tsx')).toMatch(/questNav && !questNav\.canGoBack \? <LikeShareBar/);
    expect(source('src/ui/components/LessonRunner.tsx')).toMatch(/state\.lessonCompletedAt \? <LikeShareBar/);
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
