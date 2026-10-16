import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  HELP_DESK_DAILY_LIMIT,
  HELP_DESK_NUMBER,
  buttonGuideSeen,
  deviceLabel,
  helpDeskHref,
  helpDeskLeft,
  markButtonGuideSeen,
  recordHelpDeskSend,
} from '@/app/app-chrome';
import {
  RECOMMEND_CATEGORIES,
  careQuestReducer,
  isTraceAmount,
  labelEvidence,
  matchProducts,
  startingCareQuest,
} from '@/app/care-quest';
import { FACE_CONCERNS } from '@/content/care-quest/face-concerns';
import { RECOMMENDABLE_SKUS } from '@/content/recommendable';
import { storeCatalog } from '@/content/store-catalog';

class MemoryStorage {
  private map = new Map<string, string>();
  get length() {
    return this.map.size;
  }
  clear() {
    this.map.clear();
  }
  getItem(key: string) {
    return this.map.has(key) ? this.map.get(key)! : null;
  }
  key(index: number) {
    return [...this.map.keys()][index] ?? null;
  }
  removeItem(key: string) {
    this.map.delete(key);
  }
  setItem(key: string, value: string) {
    this.map.set(key, value);
  }
}
const store = () => new MemoryStorage() as unknown as Storage;
const context = { app: 'GLOW Class', screen: 'quest 3/19', version: 'v10.16.0', locale: 'lo', device: 'Android 360px' };

describe('KG-APP-BASE help desk', () => {
  it('goes only to the WhatsApp Business number — never the private one ending 7075', () => {
    expect(HELP_DESK_NUMBER).toBe('8562096363944');
    const href = helpDeskHref(context, 'error', 'The app does not open')!;
    expect(href.startsWith('https://wa.me/8562096363944?text=')).toBe(true);
    const sources = ['src/app/app-chrome.ts', 'src/ui/components/AppChrome.tsx', 'src/ui/App.tsx']
      .map((file) => readFileSync(file, 'utf-8'))
      .join('\n');
    expect(sources).not.toMatch(/7075/);
  });

  it('puts the app, screen, version, language and device in front of the note', () => {
    const text = decodeURIComponent(helpDeskHref(context, 'wrong', 'Typo on step 3')!.split('text=')[1]!);
    expect(text).toBe('[GLOW Class · quest 3/19 · v10.16.0 · lo · Android 360px] (wrong) Typo on step 3');
  });

  it('will not send without the one-line note', () => {
    expect(helpDeskHref(context, 'idea', '   ')).toBeNull();
  });

  it('allows three a day per device, and starts again the next day', () => {
    const storage = store();
    const today = new Date(2026, 9, 16, 10);
    expect(helpDeskLeft(storage, today)).toBe(HELP_DESK_DAILY_LIMIT);
    for (let i = 0; i < 3; i += 1) recordHelpDeskSend(storage, today);
    expect(helpDeskLeft(storage, today)).toBe(0);
    recordHelpDeskSend(storage, today);
    expect(helpDeskLeft(storage, today)).toBe(0);
    expect(helpDeskLeft(storage, new Date(2026, 9, 17, 9))).toBe(3);
  });

  it('describes the device without identifying anyone', () => {
    expect(deviceLabel('Mozilla/5.0 (Linux; Android 13; SM-A135F)', 360.4)).toBe('Android 360px');
    expect(deviceLabel('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)', 390)).toBe('iOS 390px');
  });
});

describe('KG-APP-BASE button guide', () => {
  it('shows once, then stays away until asked for from Settings', () => {
    const storage = store();
    expect(buttonGuideSeen(storage)).toBe(false);
    markButtonGuideSeen(storage);
    expect(buttonGuideSeen(storage)).toBe(true);
  });
});

describe('KG-APP-BASE skip', () => {
  it('moves on without recording an answer, and never past the result', () => {
    const start = startingCareQuest('face');
    const skipped = careQuestReducer(start, { type: 'skip' });
    expect(skipped.stepIndex).toBe(1);
    expect(skipped.answers).toEqual({});
    expect(careQuestReducer({ ...start, phase: 'result' }, { type: 'skip' }).phase).toBe('result');
  });
});

describe('recommendations (CEO 2026-10-16): price floor, real label evidence, right kinds', () => {
  const kinds = ['토너', '에센스·세럼·앰플', '아이케어', '크림', '선케어', '마스크팩', '클렌징'];
  const reading = { typeId: 'combination', modifier: null } as never;
  const cases = [['melasma'], ['acne'], ['melasma', 'acne'], ['darkSpots'], ['dryness'], ['redness'], ['comedones']];

  it('recommends only owner-allowed SKUs, only allowed kinds, and only with a non-trace printed ingredient', () => {
    for (const ids of cases) {
      const concerns = FACE_CONCERNS.filter((concern) => ids.includes(concern.id));
      const picks = matchProducts(storeCatalog, concerns, reading, kinds);
      expect(picks.length, ids.join('+')).toBeGreaterThan(0);
      for (const product of picks) {
        expect(RECOMMENDABLE_SKUS.has(product.sku)).toBe(true);
        expect(RECOMMEND_CATEGORIES.has(product.category)).toBe(true);
        expect(['마스크팩', '클렌징', '뷰티소품', '기프트세트', '향수', '메이크업']).not.toContain(product.category);
        expect(product.category).not.toBe('아이케어');
        const evidence = labelEvidence(product, concerns);
        expect(evidence.length).toBeGreaterThan(0);
        expect(evidence.every((item) => !isTraceAmount(item.printed))).toBe(true);
      }
    }
  });

  it('treats ppb and sub-0.1% ppm amounts as trace', () => {
    expect(isTraceAmount('3-O-에틸아스코빅애씨드(100 ppb)')).toBe(true);
    expect(isTraceAmount('병풀추출물(313ppm)')).toBe(true);
    expect(isTraceAmount('나이아신아마이드')).toBe(false);
    expect(isTraceAmount('판테놀(2,000ppm)')).toBe(false);
  });

  it('puts a melasma serum or ampoule first for melasma — never a sunscreen', () => {
    const concerns = FACE_CONCERNS.filter((concern) => concern.id === 'melasma');
    const [first] = matchProducts(storeCatalog, concerns, reading, kinds);
    expect(first!.category).toBe('에센스·세럼·앰플');
  });
});
