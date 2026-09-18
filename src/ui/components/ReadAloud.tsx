/**
 * Read-aloud control.
 *
 * Sits next to the passage it reads and speaks exactly that text — see `src/ui/speech.ts` for
 * why it never reads anything that is not already on screen.
 *
 * `text` is written in `spokenLocale`, which defaults to the reader's UI `locale` but is not
 * always the same thing: lesson content exists only in en/ko, so when a French, Lao or Thai
 * reader is looking at an English-fallback passage, the control must ask a device for an
 * *English* voice, not a French one — asking for a voice in the language the text is not
 * written in is how a working feature looks broken.
 *
 * `fallback` is the separate case where the device is the problem, not the text: Lao is the
 * Master Database's launch language and almost no device ships a Lao voice, but Lao and Thai
 * are closely related and the app's own Thai catalog carries a real translation of the same
 * string. `src/ui/speech.ts`'s `SPOKEN_FALLBACK` records that substitution; `fallback` supplies
 * the Thai text for it. The reader is always told when this happens — the label changes to
 * "Listen (in Thai)" rather than silently switching language.
 *
 * Three states, all of them honest:
 *   - ready       a voice exists, in `spokenLocale` or in `fallback.locale`;
 *   - speaking    press again to stop;
 *   - unavailable no voice for either, said plainly. Disabled rather than hidden, because a
 *                 missing control looks like a missing feature while a disabled one explains
 *                 itself.
 */
import { useEffect, useState } from 'react';
import { translate } from '@/localization/messages';
import { languageName } from '@/localization/locales';
import { availableVoices, planSpeech, speak, speechSupported, stopSpeaking } from '../speech';

export function ReadAloud({
  text,
  locale,
  spokenLocale = locale,
  fallback,
  label,
}: {
  text: string;
  /** The reader's UI locale — used only for this control's own button labels. */
  locale: string;
  /** The language `text` is actually written in. */
  spokenLocale?: string;
  /** A translation of the same passage to speak when the device has no voice for `spokenLocale`. */
  fallback?: { locale: string; text: string } | undefined;
  /** Overrides the default control label, for a passage that needs naming. */
  label?: string;
}) {
  const [speaking, setSpeaking] = useState(false);
  const [voiceCount, setVoiceCount] = useState(() => availableVoices().length);

  // Chrome populates the voice list asynchronously and fires this event once it has. Without
  // it the first render of every page reports "no voice", which is wrong rather than merely
  // early.
  useEffect(() => {
    if (!speechSupported()) return undefined;
    const onVoices = () => setVoiceCount(availableVoices().length);
    globalThis.speechSynthesis.addEventListener('voiceschanged', onVoices);
    onVoices();
    return () => globalThis.speechSynthesis.removeEventListener('voiceschanged', onVoices);
  }, []);

  // Leaving the screen mid-sentence should stop the sentence.
  useEffect(() => () => stopSpeaking(), []);

  const supported = speechSupported();
  const available = fallback ? [spokenLocale, fallback.locale] : [spokenLocale];
  // `voiceCount` is read here so the plan is recomputed when the event above fires.
  const plan =
    supported && voiceCount >= 0
      ? planSpeech(availableVoices(), spokenLocale, available)
      : { voice: null, spokenLocale, isSubstitute: false };
  const unavailable = !supported || plan.voice === null;
  const spokenText = plan.isSubstitute && fallback ? fallback.text : text;

  const toggle = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    const started = speak(spokenText, plan.spokenLocale, {
      voice: plan.voice,
      onEnd: () => setSpeaking(false),
    });
    setSpeaking(started);
  };

  const readyLabel = plan.isSubstitute
    ? translate('speech.listenIn', locale, { language: languageName(plan.spokenLocale) })
    : (label ?? translate('speech.listen', locale));

  return (
    <button
      type="button"
      className={`speak${speaking ? ' speak--speaking' : ''}`}
      onClick={toggle}
      disabled={unavailable}
      title={unavailable ? translate('speech.unavailable', locale) : undefined}
    >
      <span className="speak__icon" aria-hidden="true">
        {speaking ? '■' : '▶'}
      </span>
      <span>
        {unavailable
          ? translate('speech.unavailable', locale)
          : speaking
            ? translate('speech.stop', locale)
            : readyLabel}
      </span>
    </button>
  );
}
