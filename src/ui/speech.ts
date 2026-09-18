/**
 * Read-aloud.
 *
 * Learning text that can be heard as well as read is the other half of "make it legible":
 * it helps a reader whose eyes are tired, a learner whose second language this is, and anyone
 * using the app while their hands are busy. It uses the browser's own speech synthesis, so
 * there is no network call, no account and no audio leaving the device.
 *
 * Two rules govern it.
 *
 * 1. **It only ever reads text that is already on screen.** It is a reader, not a narrator:
 *    nothing is generated, summarised or rephrased for it. Whatever governance applies to the
 *    text applies unchanged to the spoken version, because it is the same text.
 *
 * 2. **It will not read a language in the wrong voice.** If the device has no voice for the
 *    locale, `pickVoice` returns null and the control says so rather than reading French
 *    aloud in an English accent — which mispronounces the words a learner is trying to learn,
 *    and sounds like a bug in the app rather than a gap on the device.
 *
 * The device decides which voices exist; this module only ranks them. Ranking is pure and
 * tested against fixed voice lists, because the useful part — "pick the best one" — is where
 * the judgement is, and it should not need a browser to check.
 */
import { BASE_LOCALE } from '@/localization/locales';

/** The parts of `SpeechSynthesisVoice` this module needs. Keeps the ranking testable. */
export interface VoiceLike {
  readonly name: string;
  readonly lang: string;
  readonly localService: boolean;
  readonly default: boolean;
}

/**
 * Name fragments that mark a higher-quality voice, best first.
 *
 * These are the vendor labels for their neural / enhanced voice sets. A name is a weak signal,
 * but it is the only quality signal the Web Speech API exposes — there is no "quality" field —
 * and getting it wrong costs nothing worse than a plainer voice.
 */
const QUALITY_MARKERS: readonly string[] = [
  'neural',
  'natural',
  'premium',
  'enhanced',
  'siri',
  'google',
  'microsoft',
];

/**
 * Name fragments that mark a voice to avoid: the low-bandwidth fallbacks, and the macOS
 * novelty voices, which are comic rather than legible.
 */
const POOR_MARKERS: readonly string[] = [
  'compact',
  'espeak',
  'novelty',
  'bad news',
  'good news',
  'bahh',
  'bells',
  'boing',
  'bubbles',
  'cellos',
  'jester',
  'organ',
  'trinoids',
  'whisper',
  'wobble',
  'zarvox',
  'albert',
  'bruce',
  'fred',
  'junior',
  'ralph',
  'kathy',
  'princess',
];

const base = (lang: string): string => lang.toLowerCase().replace('_', '-').split('-')[0] ?? '';

/** Voices that speak the requested language, in any region. */
export function voicesForLocale<T extends VoiceLike>(
  voices: readonly T[],
  locale: string,
): readonly T[] {
  const wanted = base(locale);
  if (!wanted) return [];
  return voices.filter((voice) => base(voice.lang) === wanted);
}

/**
 * Score a voice. Higher is better; the absolute number means nothing outside a comparison.
 *
 * The weights say, in order: a voice the vendor markets as high quality beats one it does not;
 * a device-local voice beats a network one, because it works offline and does not send the
 * text anywhere; an exact region match beats a different region; the device default breaks a
 * remaining tie.
 */
export function scoreVoice(voice: VoiceLike, locale: string): number {
  const name = voice.name.toLowerCase();
  let score = 0;

  const quality = QUALITY_MARKERS.findIndex((marker) => name.includes(marker));
  if (quality >= 0) score += 100 - quality * 5;
  if (POOR_MARKERS.some((marker) => name.includes(marker))) score -= 200;

  if (voice.localService) score += 30;
  if (voice.lang.toLowerCase().replace('_', '-') === locale.toLowerCase()) score += 20;
  if (voice.default) score += 5;

  return score;
}

/**
 * The best available voice for a locale, or null when the device has none.
 *
 * Null is a real answer, not a failure to handle: it means this device cannot pronounce this
 * language, and the caller must say so rather than substitute another voice.
 */
export function pickVoice<T extends VoiceLike>(
  voices: readonly T[],
  locale: string,
): T | null {
  const candidates = voicesForLocale(voices, locale);
  if (candidates.length === 0) return null;
  return [...candidates].sort((a, b) => scoreVoice(b, locale) - scoreVoice(a, locale))[0] ?? null;
}

/** Voices for a locale, best first — what a voice picker offers the reader. */
export function rankVoices<T extends VoiceLike>(
  voices: readonly T[],
  locale: string,
): readonly T[] {
  return [...voicesForLocale(voices, locale)].sort(
    (a, b) => scoreVoice(b, locale) - scoreVoice(a, locale),
  );
}

/**
 * Slightly under normal pace.
 *
 * This is learning material, often in the listener's second or third language, and the default
 * rate of most voices is set for reading a notification, not a definition.
 */
export const SPEECH_RATE = 0.92;

export const speechSupported = (): boolean =>
  typeof globalThis !== 'undefined' && 'speechSynthesis' in globalThis;

export const availableVoices = (): readonly SpeechSynthesisVoice[] =>
  speechSupported() ? globalThis.speechSynthesis.getVoices() : [];

export interface SpeakOptions {
  readonly voice?: SpeechSynthesisVoice | null;
  readonly onEnd?: () => void;
}

/**
 * Speak one passage, cancelling anything already speaking.
 *
 * Returns false when nothing was spoken — no support, nothing to say, or no voice for this
 * language — so the caller can report that instead of appearing to do nothing.
 */
export function speak(text: string, locale: string, options: SpeakOptions = {}): boolean {
  if (!speechSupported() || text.trim() === '') return false;

  const voice = options.voice ?? pickVoice(availableVoices(), locale);
  if (!voice) return false;

  globalThis.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voice;
  utterance.lang = voice.lang;
  utterance.rate = SPEECH_RATE;
  if (options.onEnd) {
    utterance.onend = options.onEnd;
    utterance.onerror = options.onEnd;
  }
  globalThis.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking(): void {
  if (speechSupported()) globalThis.speechSynthesis.cancel();
}

/* ------------------------------------------------------------------ *
 * Speaking one language on behalf of another
 * ------------------------------------------------------------------ */

/**
 * A locale whose voice may speak for another when the device has none.
 *
 * Lao is the case this exists for. Virtually no device ships a Lao voice, and Lao and Thai are
 * closely related — Lao readers commonly follow Thai. But the two use **different scripts**: a
 * Thai voice handed Lao characters does not read them with an accent, it fails or produces
 * noise. So the fallback is not "read the Lao text in a Thai voice"; it is **read the Thai
 * text** — the app's own Thai translation of the same string — with a Thai voice.
 *
 * Two rules keep that honest, both tested:
 *   - a fallback locale must have its own UI catalog, so there is real text to speak;
 *   - the reader is told which language is about to be spoken. Speech that quietly switches
 *     language is a bug, even when the substitution is a reasonable one.
 *
 * This is an engineering DECISION taken on the owner's instruction (PR-037), not a source fact.
 */
export const SPOKEN_FALLBACK: Readonly<Record<string, string>> = {
  lo: 'th',
};

/** What a read-aloud control will actually do, before it does it. */
export interface SpeechPlan {
  /** The voice that will speak, or null when nothing can. */
  readonly voice: SpeechSynthesisVoice | null;
  /** The language the text to be spoken is in. */
  readonly spokenLocale: string;
  /** True when that is not the language the reader asked for. */
  readonly isSubstitute: boolean;
}

/**
 * Decide what to speak and in which voice, given the languages a passage exists in.
 *
 * Tries, in order: the reader's own language; the declared spoken fallback for it; the base
 * locale. A candidate only counts when the passage exists in that language **and** the device
 * has a voice for it — a voice with no text and text with no voice are equally useless.
 */
export function planSpeech<T extends VoiceLike>(
  voices: readonly T[],
  locale: string,
  /** Languages the passage is available in. */
  available: readonly string[],
): { voice: T | null; spokenLocale: string; isSubstitute: boolean } {
  const fallback = SPOKEN_FALLBACK[locale];
  const candidates = [locale, ...(fallback ? [fallback] : []), BASE_LOCALE];

  for (const candidate of candidates) {
    if (!available.includes(candidate)) continue;
    const voice = pickVoice(voices, candidate);
    if (voice) return { voice, spokenLocale: candidate, isSubstitute: candidate !== locale };
  }
  return { voice: null, spokenLocale: locale, isSubstitute: false };
}
