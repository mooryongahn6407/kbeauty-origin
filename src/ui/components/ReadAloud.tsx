/**
 * Read-aloud control.
 *
 * Sits next to the passage it reads and speaks exactly that text — see `src/ui/speech.ts` for
 * why it never reads anything that is not already on screen.
 *
 * Three states, all of them honest:
 *   - ready       the device has a voice for this language;
 *   - speaking    press again to stop;
 *   - unavailable the device has no voice for this language, said plainly. It is disabled
 *                 rather than hidden, because a missing control looks like a missing feature
 *                 while a disabled one with a reason explains itself.
 */
import { useEffect, useState } from 'react';
import { translate } from '@/localization/messages';
import { availableVoices, pickVoice, speak, speechSupported, stopSpeaking } from '../speech';

export function ReadAloud({
  text,
  locale,
  label,
}: {
  text: string;
  locale: string;
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
  // `voiceCount` is read here so the memoised list is recomputed when the event above fires.
  const voice = supported && voiceCount >= 0 ? pickVoice(availableVoices(), locale) : null;
  const unavailable = !supported || voice === null;

  const toggle = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    const started = speak(text, locale, { voice, onEnd: () => setSpeaking(false) });
    setSpeaking(started);
  };

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
            : (label ?? translate('speech.listen', locale))}
      </span>
    </button>
  );
}
