/**
 * Safety halt wording.
 *
 * The one string in the app where a translation error could do harm. On an unreviewed catalog
 * this renders the translation *and* the English it was made from, so a mistranslated "seek
 * emergency help" cannot silently replace the instruction — see `safetyWording`.
 *
 * It also offers to read the message aloud. This is the highest-stakes text in the app, and a
 * reader who is upset or whose reading in this script is weaker than their listening should
 * not have to parse it silently. `SPOKEN_FALLBACK` (`src/ui/speech.ts`) covers the case the
 * owner asked for directly: Lao has almost no device voice, so this speaks the app's own Thai
 * translation of the same safety text through a Thai voice, and says on the button that it is
 * doing so — never a silent language switch.
 *
 * Used by every surface that can halt: the lesson runner, the routine studio and the exposure
 * log. One component, so the three cannot drift apart on the thing that matters most.
 */
import { safetyWording, translate, type MessageKey } from '@/localization/messages';
import { SPOKEN_FALLBACK } from '../speech';
import { ReadAloud } from './ReadAloud';

export function SafetyNotice({
  messageKey,
  locale,
}: {
  messageKey: MessageKey;
  locale: string;
}) {
  const { text, original } = safetyWording(messageKey, locale);

  const fallbackLocale = SPOKEN_FALLBACK[locale];
  const fallback = fallbackLocale
    ? { locale: fallbackLocale, text: translate(messageKey, fallbackLocale) }
    : undefined;

  return (
    <p className="disclosure disclosure--caution">
      <span className="disclosure__mark">!</span>
      <span>
        {text}
        {original ? (
          <>
            <br />
            {/* The label is in the reader's own language; only `original` itself is English —
                `lang` must cover exactly what it is spoken/read as, or a screen reader (and
                this component's own read-aloud) mispronounces the label using English rules. */}
            <span className="fine">
              {translate('catalog.safetyOriginal', locale)}: <span lang="en">{original}</span>
            </span>
          </>
        ) : null}
        <br />
        <ReadAloud locale={locale} spokenLocale={locale} text={text} fallback={fallback} />
      </span>
    </p>
  );
}
