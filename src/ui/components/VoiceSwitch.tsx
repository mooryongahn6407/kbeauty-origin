/**
 * The voice switch, as the reader meets it.
 *
 * It is the second thing on the screen, after the language buttons, and before anything else —
 * because the two questions a first-time visitor has are "can I read this?" and "can you read
 * it to me?", and both answers should be visible without scrolling.
 *
 * It explains itself in a full sentence in both states. A speaker icon alone assumes the reader
 * knows what a speaker icon on a learning app does; the line underneath says press this to have
 * it read aloud, and, once it is on, says press it again to turn it off. That second half is
 * the part usually left out, and the reason people avoid pressing unfamiliar buttons.
 *
 * When the device has no voice for the chosen language it says so and disables itself, rather
 * than accepting the press and then doing nothing.
 */
import { translate } from '@/localization/messages';
import { languageName } from '@/localization/locales';
import { availableVoices, planSpeech, speechSupported, stopSpeaking } from '../speech';
import { SPOKEN_FALLBACK } from '../speech';
import { useVoice } from '../voice';

export function VoiceSwitch({ locale }: { locale: string }) {
  const { on, toggle } = useVoice();

  // Whether *anything* could be spoken in this language on this device — the same plan the
  // passage controls make, asked here before the reader commits to pressing. The lending locale
  // comes from `SPOKEN_FALLBACK` rather than being named here, so this control and the passage
  // controls can never disagree about which languages may speak for which.
  const lender = SPOKEN_FALLBACK[locale];
  const available = lender ? [locale, lender] : [locale];
  const plan = speechSupported()
    ? planSpeech(availableVoices(), locale, available)
    : { voice: null, spokenLocale: locale, isSubstitute: false };
  const unavailable = plan.voice === null;

  const press = () => {
    if (on) stopSpeaking();
    toggle();
  };

  return (
    <div className={`voiceswitch${on ? ' voiceswitch--on' : ''}`}>
      <button
        type="button"
        className="voiceswitch__btn"
        aria-pressed={on}
        disabled={unavailable}
        onClick={press}
      >
        <span className="voiceswitch__icon" aria-hidden="true">
          {on ? '🔊' : '🔈'}
        </span>
        <span>
          {unavailable
            ? translate('speech.unavailable', locale)
            : translate(on ? 'speech.master.on' : 'speech.master.off', locale)}
        </span>
      </button>
      {unavailable ? null : (
        <p className="voiceswitch__hint">
          {translate(on ? 'speech.master.hintOn' : 'speech.master.hintOff', locale)}
        </p>
      )}
      {/* Rule 15: speech never crosses scripts silently. If this device is about to read the
          app's Thai translation to a Lao reader, the reader is told so before pressing, not
          left to wonder why the voice does not match the screen. */}
      {!unavailable && plan.isSubstitute ? (
        <p className="voiceswitch__hint voiceswitch__hint--substitute">
          {translate('speech.master.substitute', locale, {
            language: languageName(plan.spokenLocale),
          })}
        </p>
      ) : null}
    </div>
  );
}
