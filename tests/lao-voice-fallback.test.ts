/**
 * Lao readers are never left in silence on the lesson and dictionary screens.
 *
 * Almost no phone has a Lao voice. Other screens hand ReadAloud the Thai version of the same
 * passage; the lesson runner and the ingredient dictionary did not, so their Lao passages could
 * not be heard at all. Lessons now pass the lender's own lesson text when it exists; dictionary
 * entries (written in ko/lo/en only) offer the lender's text if present, else the English the
 * entry actually carries — never one language handed to another language's voice.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { planSpeech, type VoiceLike } from '@/ui/speech';
import { contentSpokenFallback } from '@/ui/spoken-fallback';
import { companyDictionary } from '@/content/company/ingredient-dictionary';

const voice = (name: string, lang: string): VoiceLike => ({ name, lang, localService: true, default: false });
const PHONE: readonly VoiceLike[] = [voice('Samantha', 'en-US'), voice('Kanya', 'th-TH')];

describe('contentSpokenFallback', () => {
  it('lends nothing to a language that has its own voice route', () => {
    expect(contentSpokenFallback('ko', { ko: '가', en: 'a' })).toBeUndefined();
    expect(contentSpokenFallback('en', { en: 'a' })).toBeUndefined();
  });

  it('uses the Thai text for a Lao reader when the content has Thai', () => {
    expect(contentSpokenFallback('lo', { lo: 'ລາວ', th: 'ไทย', en: 'en' })).toEqual({ locale: 'th', text: 'ไทย' });
  });

  it('offers the English the content carries when there is no Thai', () => {
    expect(contentSpokenFallback('lo', { lo: 'ລາວ', ko: '가', en: 'English' })).toEqual({
      locale: 'en',
      text: 'English',
    });
  });

  it('gives nothing rather than an empty passage', () => {
    expect(contentSpokenFallback('lo', { lo: 'ລາວ', en: '  ' })).toBeUndefined();
  });
});

describe('a dictionary entry is audible for a Lao reader on a phone with no Lao voice', () => {
  const entry = companyDictionary.ingredients[0]!;

  it('was silent before: Lao text alone finds no voice', () => {
    expect(planSpeech(PHONE, 'lo', ['lo']).voice).toBeNull();
  });

  it('now plans a voice, says it is a substitute, and reads that language\'s own text', () => {
    const fallback = contentSpokenFallback('lo', entry.what)!;
    const plan = planSpeech(PHONE, 'lo', ['lo', fallback.locale]);
    expect(plan.voice).not.toBeNull();
    expect(plan.isSubstitute).toBe(true);
    expect(plan.spokenLocale).toBe(fallback.locale);
    expect(fallback.text).toBe(entry.what[fallback.locale as 'en']);
  });
});

describe('both screens pass the fallback to every read-aloud', () => {
  const count = (source: string, needle: RegExp) => (source.match(needle) ?? []).length;

  it('LessonRunner: all three controls', () => {
    const source = readFileSync(new URL('../src/ui/components/LessonRunner.tsx', import.meta.url), 'utf8');
    expect(count(source, /<ReadAloud\b/g)).toBe(3);
    expect(count(source, /fallback=\{spokenFallback\(locale,/g)).toBe(3);
  });

  it('IngredientDictionaryScreen: the entry passages', () => {
    const source = readFileSync(new URL('../src/ui/screens/IngredientDictionaryScreen.tsx', import.meta.url), 'utf8');
    expect(count(source, /<ReadAloud\b/g)).toBe(count(source, /fallback=\{contentSpokenFallback\(locale, /g));
  });
});
