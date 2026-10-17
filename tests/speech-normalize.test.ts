/**
 * Pronunciation before speech, sentence queueing, and honest failure.
 *
 * The voice must *say* "SPF50+" and "PA++++" the way a person would, in the reader's language,
 * without changing a word of what is on screen. Long passages go to the engine one sentence at
 * a time; stopping ends the whole queue; and an engine error is reported, not treated as done.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MAX_CHUNK, normalizeForSpeech, splitForSpeech } from '@/ui/speech-normalize';
import { speak, stopSpeaking } from '@/ui/speech';
import { translate } from '@/localization/messages';

/** [input, expected spoken form] per language. */
const CASES: Readonly<Record<'en' | 'ko' | 'th' | 'fr', readonly (readonly [string, string])[]>> = {
  en: [
    ['Use SPF50+ every morning.', 'Use S P F 50 plus every morning.'],
    ['Look for SPF 30 or higher.', 'Look for S P F 30 or higher.'],
    ['The SPF number is about UVB.', 'The S P F number is about U V B.'],
    ['PA++++ is the highest grade.', 'P A four plus is the highest grade.'],
    ['PA++ protects less than PA+++.', 'P A two plus protects less than P A three plus.'],
    ['AHA and BHA are exfoliants.', 'A H A and B H A are exfoliants.'],
    ['PHA is gentler than AHAs.', 'P H A is gentler than A H A.'],
    ['UV light reaches you indoors.', 'U V light reaches you indoors.'],
    ['UVA/UVB both matter.', 'U V A, U V B both matter.'],
    ['UVA reaches deeper.', 'U V A reaches deeper.'],
    ['Skin pH is slightly acidic.', 'Skin P H is slightly acidic.'],
    ['Niacinamide at 5% is common.', 'Niacinamide at 5 percent is common.'],
    ['Try 0.5% first.', 'Try 0.5 percent first.'],
    ['A 50ml bottle lasts a month.', 'A 50 millilitres bottle lasts a month.'],
    ['Use 2 mL each time.', 'Use 2 millilitres each time.'],
    ['It weighs 30g.', 'It weighs 30 grams.'],
    ['Store below 25°C.', 'Store below 25 degrees Celsius.'],
    ['K-beauty starts with KOREA GLOW.', 'K beauty starts with Korea Glow.'],
    ['UVB is 280 to 315 nm.', 'U V B is 280 to 315 nanometres.'],
    ['Agree with the HUVAX code.', 'Agree with the HUVAX code.'],
    ['Plain sentence, nothing to change.', 'Plain sentence, nothing to change.'],
  ],
  ko: [
    ['SPF50+ 선크림을 바르세요.', '에스피에프 50 플러스 선크림을 바르세요.'],
    ['PA++++는 가장 높은 등급이에요.', '피에이 플러스 네 개는 가장 높은 등급이에요.'],
    ['AHA와 BHA는 각질 제거 성분이에요.', '에이에이치에이와 비에이치에이는 각질 제거 성분이에요.'],
    ['PHA는 더 순해요.', '피에이치에이는 더 순해요.'],
    ['UV는 실내에도 들어와요.', '유브이는 실내에도 들어와요.'],
    ['UVA와 UVB를 모두 막아요.', '유브이에이와 유브이비를 모두 막아요.'],
    ['피부의 pH는 약산성이에요.', '피부의 피에이치는 약산성이에요.'],
    ['나이아신아마이드 5%가 흔해요.', '나이아신아마이드 5 퍼센트가 흔해요.'],
    ['50ml 한 병이에요.', '50 밀리리터 한 병이에요.'],
    ['K-beauty는 KOREA GLOW와 함께.', '케이뷰티는 코리아 글로우와 함께.'],
    ['30g 용량이에요.', '30 그램 용량이에요.'],
  ],
  th: [
    ['ทาครีมกันแดด SPF50+ ทุกเช้า', 'ทาครีมกันแดด เอสพีเอฟ 50 พลัส ทุกเช้า'],
    ['PA++++ คือระดับสูงสุด', 'พีเอ บวกสี่ คือระดับสูงสุด'],
    ['AHA และ BHA ช่วยผลัดเซลล์ผิว', 'เอเอชเอ และ บีเอชเอ ช่วยผลัดเซลล์ผิว'],
    ['แสง UV เข้ามาในบ้านได้', 'แสง ยูวี เข้ามาในบ้านได้'],
    ['ค่า pH ของผิว', 'ค่า พีเอช ของผิว'],
    ['ไนอะซินาไมด์ 5%', 'ไนอะซินาไมด์ 5 เปอร์เซ็นต์'],
    ['ขวด 50ml', 'ขวด 50 มิลลิลิตร'],
    ['K-beauty กับ KOREA GLOW', 'เคบิวตี้ กับ โคเรีย โกลว์'],
    ['UVA/UVB', 'ยูวีเอ, ยูวีบี'],
  ],
  fr: [
    ['Mettez un SPF50+ chaque matin.', 'Mettez un S P F 50 plus chaque matin.'],
    ['PA++++ est le plus haut niveau.', 'P A quatre plus est le plus haut niveau.'],
    ['Les AHA et les BHA exfolient.', 'Les A H A et les B H A exfolient.'],
    ['Les UV traversent les vitres.', 'Les U V traversent les vitres.'],
    ['Le pH de la peau est acide.', 'Le P H de la peau est acide.'],
    ['Niacinamide à 5 %.', 'Niacinamide à 5 pour cent.'],
    ['Un flacon de 50 ml.', 'Un flacon de 50 millilitres.'],
    ['La K-beauty avec KOREA GLOW.', 'La K beauty avec Korea Glow.'],
    ['Essayez 0,5 % d’abord.', 'Essayez 0,5 pour cent d’abord.'],
  ],
};

describe('per-language pronunciation', () => {
  it('covers at least 40 sentences across ko, en, th and fr', () => {
    const total = Object.values(CASES).reduce((sum, list) => sum + list.length, 0);
    expect(total).toBeGreaterThanOrEqual(40);
  });

  for (const [locale, cases] of Object.entries(CASES)) {
    for (const [input, expected] of cases) {
      it(`${locale}: ${input}`, () => {
        expect(normalizeForSpeech(input, locale)).toBe(expected);
      });
    }
  }

  it('reads a regional tag the same as its language', () => {
    expect(normalizeForSpeech('SPF30', 'th-TH')).toBe('เอสพีเอฟ 30');
    expect(normalizeForSpeech('SPF30', 'ko-KR')).toBe('에스피에프 30');
  });

  it('falls back to letter-by-letter readings for other languages', () => {
    expect(normalizeForSpeech('SPF30', 'lo')).toBe('S P F 30');
  });

  it('never throws on odd input', () => {
    for (const odd of ['', '%%%', '+++', 'PA+++++', '5', 'ml', '°C']) {
      expect(() => normalizeForSpeech(odd, 'en')).not.toThrow();
    }
  });
});

describe('splitting into sentences', () => {
  it('splits at sentence ends and keeps every word in order', () => {
    const text = 'First one. Second one? Third one! 네 번째예요. 다섯.';
    const parts = splitForSpeech(text);
    expect(parts).toEqual(['First one.', 'Second one?', 'Third one!', '네 번째예요.', '다섯.']);
    expect(parts.join(' ')).toBe(text);
  });

  it('does not split a decimal number', () => {
    expect(splitForSpeech('Try 0.5 percent first.')).toEqual(['Try 0.5 percent first.']);
  });

  it('breaks a long passage with no full stops (Thai) at spaces, under the limit', () => {
    const thai = Array.from({ length: 60 }, () => 'ครีมกันแดด').join(' ');
    const parts = splitForSpeech(thai);
    expect(parts.length).toBeGreaterThan(1);
    for (const part of parts) expect(part.length).toBeLessThanOrEqual(MAX_CHUNK);
    expect(parts.join(' ')).toBe(thai);
  });

  it('returns nothing for blank text', () => {
    expect(splitForSpeech('   ')).toEqual([]);
  });
});

/* ---------------- queue, stop and error, against a fake engine ---------------- */

interface FakeUtterance {
  text: string;
  voice?: unknown;
  lang?: string;
  rate?: number;
  onend?: () => void;
  onerror?: (event: { error: string }) => void;
}

let spoken: FakeUtterance[] = [];
let cancels = 0;
const restore: Record<string, PropertyDescriptor | undefined> = {};

beforeEach(() => {
  spoken = [];
  cancels = 0;
  restore.synth = Object.getOwnPropertyDescriptor(globalThis, 'speechSynthesis');
  restore.utterance = Object.getOwnPropertyDescriptor(globalThis, 'SpeechSynthesisUtterance');
  Object.defineProperty(globalThis, 'speechSynthesis', {
    configurable: true,
    value: {
      cancel: () => {
        cancels += 1;
      },
      speak: (utterance: FakeUtterance) => spoken.push(utterance),
      getVoices: () => [],
    },
  });
  Object.defineProperty(globalThis, 'SpeechSynthesisUtterance', {
    configurable: true,
    value: class {
      constructor(public text: string) {}
    },
  });
});

afterEach(() => {
  for (const [key, name] of [
    ['synth', 'speechSynthesis'],
    ['utterance', 'SpeechSynthesisUtterance'],
  ] as const) {
    const descriptor = restore[key];
    if (descriptor) Object.defineProperty(globalThis, name, descriptor);
    else Reflect.deleteProperty(globalThis, name);
  }
});

const VOICE = { name: 'Samantha', lang: 'en-US', localService: true, default: true } as unknown as SpeechSynthesisVoice;

describe('the sentence queue', () => {
  it('speaks the normalised sentences one after another, then reports the end once', () => {
    let ended = 0;
    expect(speak('Use SPF50+. Then wait.', 'en', { voice: VOICE, onEnd: () => (ended += 1) })).toBe(true);
    expect(spoken.map((u) => u.text)).toEqual(['Use S P F 50 plus.']);
    spoken[0]!.onend!();
    expect(spoken.map((u) => u.text)).toEqual(['Use S P F 50 plus.', 'Then wait.']);
    expect(ended).toBe(0);
    spoken[1]!.onend!();
    expect(ended).toBe(1);
  });

  it('cancels what was playing before starting, so two passages never overlap', () => {
    speak('One.', 'en', { voice: VOICE });
    speak('Two.', 'en', { voice: VOICE });
    expect(cancels).toBe(2);
  });

  it('stop ends the whole queue, not just the current sentence', () => {
    let ended = 0;
    speak('A. B. C.', 'en', { voice: VOICE, onEnd: () => (ended += 1) });
    stopSpeaking();
    spoken[0]!.onend!();
    expect(spoken).toHaveLength(1);
    expect(ended).toBe(1);
  });

  it('a newer passage ends the older queue', () => {
    speak('Old one. Old two.', 'en', { voice: VOICE });
    speak('New.', 'en', { voice: VOICE });
    spoken[0]!.onend!();
    expect(spoken.map((u) => u.text)).toEqual(['Old one.', 'New.']);
  });
});

describe('an engine error is not "finished"', () => {
  it('reports a real error through onError, not onEnd', () => {
    let ended = 0;
    let failed = 0;
    speak('A. B.', 'en', { voice: VOICE, onEnd: () => (ended += 1), onError: () => (failed += 1) });
    spoken[0]!.onerror!({ error: 'synthesis-failed' });
    expect(failed).toBe(1);
    expect(ended).toBe(0);
    expect(spoken).toHaveLength(1);
  });

  it('treats a stop (interrupted / canceled) as an ending, not a failure', () => {
    let ended = 0;
    let failed = 0;
    speak('A.', 'en', { voice: VOICE, onEnd: () => (ended += 1), onError: () => (failed += 1) });
    spoken[0]!.onerror!({ error: 'interrupted' });
    speak('B.', 'en', { voice: VOICE, onEnd: () => (ended += 1), onError: () => (failed += 1) });
    spoken[1]!.onerror!({ error: 'canceled' });
    expect(failed).toBe(0);
    expect(ended).toBe(2);
  });

  it('has a short note in every language', () => {
    for (const locale of ['en', 'ko', 'fr', 'lo', 'th']) {
      const note = translate('speech.failed', locale);
      expect(note.length).toBeGreaterThan(0);
      expect(note.length).toBeLessThan(40);
      if (locale !== 'en') expect(note).not.toBe(translate('speech.failed', 'en'));
    }
  });
});
