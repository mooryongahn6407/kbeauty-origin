/**
 * The owner's orders of 2026-10-18 (C–I): SKIN QUEST → GLOW Class, product questions on WhatsApp
 * Business, the gentle like/share note, Lumina Noy's first-visit introduction, skin-care tips on
 * WhatsApp, and the 7-day routine check.
 */
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it } from 'vitest';
import { CHROME } from '@/ui/chrome-text';
import { INTRO_LINES } from '@/content/intro-script';
import { INTRO_KEY, introWanted, markIntro, subtitleMs } from '@/app/intro';
import { productAskHref, productAskMessage, tipsAskMessage } from '@/app/product-ask';
import {
  ASK_GAP_MS,
  PART_ASKED_KEY,
  askToShare,
  claimNudge,
  promptAllowed,
  resetVisitForTests,
} from '@/app/share-ask';
import {
  ROUTINE_WEEK_KEY,
  dayIndex,
  loadWeek,
  localDay,
  saveWeek,
  startWeek,
  toggleSlot,
  weekDots,
} from '@/app/routine-week';
import { LOCAL_STORAGE_KEYS } from '@/app/device-data';
import { hasProgress, hasSavedResult } from '@/app/entry-links';
import { brandForDisplay, evidenceName, printedForDisplay, questEntryState } from '@/app/care-quest';
import { IntroGuide } from '@/ui/components/IntroGuide';
import { RoutineWeekCard } from '@/ui/components/RoutineWeek';
import { ProductAskLink } from '@/ui/components/ProductAsk';

const LOCALES = ['ko', 'en', 'lo', 'th', 'fr'] as const;
const HANGUL = /[가-힣]/;

function memory(seed: Record<string, string> = {}) {
  const data = new Map(Object.entries(seed));
  return {
    data,
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
  };
}

describe('new words, in every language', () => {
  const KEYS = [
    'deeper', 'welcomeBack', 'lastResult', 'continueQuest', 'newQuest', 'installHintTitle', 'installHintBody',
    'kgProducts', 'askProduct', 'askProductMessage', 'nudge', 'introSkip', 'introNoAuto', 'introSound',
    'introStart', 'tips', 'tipsMessage', 'weekTitle', 'weekIntro', 'weekStart', 'weekDay', 'weekAm', 'weekPm',
    'weekDone', 'weekAgain', 'appOfficial',
  ] as const;
  it('exist in ko/en/lo/th/fr, and only Korean is in Korean', () => {
    for (const key of KEYS) {
      for (const locale of LOCALES) {
        const text = CHROME[key]?.[locale];
        expect(text, `${key}.${locale}`).toBeTruthy();
        if (locale !== 'ko') expect(text, `${key}.${locale}`).not.toMatch(HANGUL);
      }
    }
    for (const line of INTRO_LINES) {
      for (const locale of LOCALES) {
        expect(line[locale]).toBeTruthy();
        if (locale !== 'ko') expect(line[locale]).not.toMatch(HANGUL);
      }
    }
  });

  it('keep the owner’s Korean wording', () => {
    expect(CHROME.deeper!.ko).toBe('더 깊이 공부하기 → GLOW 클래스');
    expect(CHROME.askProduct!.ko).toBe('WhatsApp으로 이 제품 문의하기');
    expect(CHROME.kgProducts!.ko).toBe('KOREA GLOW 제품');
    expect(CHROME.tips!.ko).toBe('WhatsApp으로 피부 관리 팁 받기');
    expect(CHROME.nudge!.ko).toBe('내용이 좋으면 ♥ 좋아요를 눌러 주세요. 친구분들께 공유해 주시면 정말 고맙겠습니다.');
    expect(INTRO_LINES).toHaveLength(6);
    expect(INTRO_LINES[0]!.ko).toBe('안녕하세요, 저는 루미나 노이예요. GLOW 클래스에 오신 걸 환영해요.');
  });

  it('never carry a price or a currency', () => {
    const all = JSON.stringify([CHROME, INTRO_LINES]);
    expect(all).not.toMatch(/₭|\bkip\b|\bLAK\b|\$\s?\d|USD|원\s?\d|\d\s?원|ກີບ|บาท/i);
  });
});

describe('asking about a product on WhatsApp Business', () => {
  it('goes to the company number with the shelf number, name, language and partner code', () => {
    const message = productAskMessage(CHROME.askProductMessage!.lo!, { code: 'A-69', brand: 'COSRX', name: 'Snail Mucin' }, 'lo', 'vte-01');
    expect(message).toContain('A-69 · COSRX · Snail Mucin');
    expect(message).toContain('lang=lo');
    expect(message).toContain('p=VTE-01');
    const href = new URL(productAskHref(message));
    expect(href.origin + href.pathname).toBe('https://wa.me/8562096363944');
    expect(href.searchParams.get('text')).toBe(message);
    expect(productAskMessage('{product}', { code: 'A-1', brand: 'X', name: 'Y' }, 'en', '<bad>')).not.toContain('p=');
  });

  it('renders as a real link that opens in a new tab', () => {
    const html = renderToStaticMarkup(
      createElement(ProductAskLink, { code: 'A-69', brand: 'B', name: 'N', locale: 'th', partner: null }),
    );
    expect(html).toContain('href="https://wa.me/8562096363944?text=');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain(CHROME.askProduct!.th);
  });

  it('asks for skin-care tips with the result type and partner code', () => {
    const message = tipsAskMessage(CHROME.tipsMessage!.fr!, 'Peau mixte', 'fr', 'SALON7');
    expect(message).toContain('Peau mixte');
    expect(message).toContain('lang=fr · p=SALON7');
  });

  it('is labelled as the company’s products on the result, beside every recommended product', () => {
    const screen = readFileSync(new URL('../src/ui/screens/CareQuestScreen.tsx', import.meta.url), 'utf8');
    expect(screen).toContain('CHROME.kgProducts!');
    expect(screen).toContain('<ProductAskLink');
    expect(screen).toMatch(/btn btn--quiet kg-tips/);
    expect(screen).toMatch(/btn btn--primary kg-deeper/);
  });
});

describe('the like/share budget', () => {
  beforeEach(() => resetVisitForTests());

  it('allows one prompt per visit, and none within three days of the last', () => {
    const store = memory();
    const win = { localStorage: store, document: { querySelector: () => null } };
    const now = 10 * ASK_GAP_MS;
    expect(promptAllowed(win, now)).toBe(true);
    expect(claimNudge(win, now)).toBe(true);
    expect(store.data.get(PART_ASKED_KEY)).toBe(String(now));
    expect(claimNudge(win, now)).toBe(false);
    expect(askToShare({ ...win, KGShare: { ask: () => true } }, now)).toBe(false);
    resetVisitForTests();
    expect(promptAllowed(win, now + ASK_GAP_MS - 1)).toBe(false);
    expect(promptAllowed(win, now + ASK_GAP_MS)).toBe(true);
  });

  it('never prompts over an open dialog', () => {
    const win = { localStorage: memory(), document: { querySelector: () => ({}) as Element } };
    expect(claimNudge(win, ASK_GAP_MS)).toBe(false);
  });
});

describe('Lumina Noy’s first-visit introduction', () => {
  const host = (hostname: string, search = '') => ({ hostname, search });

  it('plays on the preview on a first visit only, never on the live address unless asked', () => {
    expect(introWanted(host('glow-next.korea-glow.com'), memory())).toBe(true);
    expect(introWanted(host('glow-next.korea-glow.com'), memory({ [INTRO_KEY]: 'seen' }))).toBe(false);
    expect(introWanted(host('app.korea-glow.com'), memory())).toBe(false);
    expect(introWanted(host('app.korea-glow.com', '?intro'), memory({ [INTRO_KEY]: 'off' }))).toBe(true);
    expect(introWanted(host('glow-next.korea-glow.com', '?product=KG-CRM-00007'), memory())).toBe(false);
    const store = memory();
    markIntro(store, 'off');
    expect(store.data.get(INTRO_KEY)).toBe('off');
    expect(subtitleMs('short')).toBe(3500);
  });

  it('shows her name only, the first line, Skip and «don’t play automatically»', () => {
    for (const locale of LOCALES) {
      const html = renderToStaticMarkup(createElement(IntroGuide, { locale, onDone: () => undefined }));
      const plain = html.replace(/&#x27;/g, "'").replace(/&amp;/g, '&');
      expect(plain).toContain(CHROME.guideName![locale]!);
      expect(plain).toContain(INTRO_LINES[0]![locale]!);
      expect(plain).toContain(CHROME.introSkip![locale]!);
      expect(plain).toContain(CHROME.introNoAuto![locale]!);
      expect(plain).toContain('/brand/lumina-noy');
      expect(plain).not.toMatch(/not a real person|실제 사람이 아닙|AI (guide|가이드|character)/i);
    }
  });
});

describe('7-day routine check', () => {
  it('ticks today’s morning and evening, shows seven dots, and ends after a week', () => {
    let week = startWeek('2026-10-18');
    week = toggleSlot(week, '2026-10-18', 'am');
    week = toggleSlot(week, '2026-10-18', 'pm');
    week = toggleSlot(week, '2026-10-19', 'am');
    expect(weekDots(week, '2026-10-20')).toEqual(['both', 'one', 'none', 'ahead', 'ahead', 'ahead', 'ahead']);
    expect(dayIndex(week, '2026-10-24')).toBe(6);
    expect(dayIndex(week, '2026-10-25')).toBe(7);
    // Outside the week nothing changes.
    expect(toggleSlot(week, '2026-10-25', 'am')).toBe(week);
    expect(toggleSlot(toggleSlot(week, '2026-10-19', 'am'), '2026-10-19', 'am').days['2026-10-19']?.am).toBe(true);
  });

  it('is saved under a versioned key that «delete my data» clears, and survives junk', () => {
    expect(ROUTINE_WEEK_KEY).toBe('korea-glow:routine-week:v1');
    expect(LOCAL_STORAGE_KEYS).toContain(ROUTINE_WEEK_KEY);
    expect(LOCAL_STORAGE_KEYS).toContain(INTRO_KEY);
    const store = memory();
    saveWeek(store, toggleSlot(startWeek('2026-10-18'), '2026-10-18', 'am'));
    expect(loadWeek(store)?.days['2026-10-18']?.am).toBe(true);
    expect(loadWeek(memory({ [ROUTINE_WEEK_KEY]: '{bad' }))).toBeNull();
    expect(loadWeek(memory({ [ROUTINE_WEEK_KEY]: '{"start":"yesterday"}' }))).toBeNull();
    expect(localDay(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('speaks gently — no streak, no reward', () => {
    const html = renderToStaticMarkup(createElement(RoutineWeekCard, { locale: 'en', today: '2026-10-18' }));
    expect(html).toContain('7-day routine check');
    const words = JSON.stringify(['weekTitle', 'weekIntro', 'weekDone', 'weekAgain'].map((key) => CHROME[key]));
    expect(words).not.toMatch(/streak|연속|coupon|쿠폰|reward|보상|fail|실패/i);
  });
});

describe('returning to GLOW home', () => {
  it('knows whether there is a result to show or a track to continue', () => {
    expect(hasSavedResult(memory({ 'korea-glow:care-quest:v1': '{"face":{}}' }))).toBe(true);
    expect(hasSavedResult(memory({ 'korea-glow:care-quest:v1': '{}' }))).toBe(false);
    expect(hasProgress(memory({ 'korea-glow:care-quest:progress:v1': '{}' }))).toBe(true);
    expect(hasProgress(memory())).toBe(false);
  });

  it('opens the latest result, or the question that was left', () => {
    const answers = { 'face-type': ['oily'] };
    const result = questEntryState('result', { face: answers, body: {} }, null, {
      face: [{ at: '2026-10-18', answers }],
      body: [{ at: '2026-10-01', answers: {} }],
    });
    expect(result?.phase).toBe('result');
    expect(result?.track).toBe('face');
    const resumed = questEntryState('resume', {}, { track: 'scalp', stepIndex: 2, answers: {} }, {});
    expect(resumed?.phase).toBe('steps');
    expect(resumed?.stepIndex).toBe(2);
    expect(questEntryState('resume', {}, null, {})).toBeNull();
    expect(questEntryState('result', {}, null, {})).toBeNull();
  });
});

describe('label evidence as shown', () => {
  it('drops a dangling bracket the transcription left, and nothing else', () => {
    expect(printedForDisplay('콜라겐(4')).toBe('콜라겐');
    expect(printedForDisplay('스쿠알란(150')).toBe('스쿠알란');
    expect(printedForDisplay('판테놀')).toBe('판테놀');
    expect(printedForDisplay('아스코빅애씨드 <ILN50755>')).toBe('아스코빅애씨드 <ILN50755>');
    expect(printedForDisplay('Collagen (4,000ppm)')).toBe('Collagen (4,000ppm)');
  });
});

describe('result product lines for readers who do not read Korean', () => {
  it('name the ingredient in their language and keep the printed Korean for Korean readers', () => {
    const item = { id: 'niacinamide', printed: '나이아신아마이드' };
    expect(evidenceName(item, 'ko')).toBe('나이아신아마이드');
    expect(evidenceName(item, 'en')).not.toMatch(/[가-힣]/);
    expect(evidenceName(item, 'fr')).not.toMatch(/[가-힣]/);
    expect(evidenceName({ id: 'no-such-id', printed: '콜라겐(4' }, 'en')).toBe('콜라겐');
  });

  it('drop a Korean reading in brackets from a Latin brand name', () => {
    expect(brandForDisplay('Coeval(코에벨)', 'fr')).toBe('Coeval');
    expect(brandForDisplay('Coeval(코에벨)', 'ko')).toBe('Coeval(코에벨)');
    expect(brandForDisplay('푸드어홀릭', 'en')).toBe('푸드어홀릭');
  });
});
