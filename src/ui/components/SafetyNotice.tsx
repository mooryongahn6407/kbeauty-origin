/**
 * Safety halt wording.
 *
 * The one string in the app where a translation error could do harm. On an unreviewed catalog
 * this renders the translation *and* the English it was made from, so a mistranslated "seek
 * emergency help" cannot silently replace the instruction — see `safetyWording`.
 *
 * Used by every surface that can halt: the lesson runner, the routine studio and the exposure
 * log. One component, so the three cannot drift apart on the thing that matters most.
 */
import { safetyWording, translate, type MessageKey } from '@/localization/messages';

export function SafetyNotice({
  messageKey,
  locale,
}: {
  messageKey: MessageKey;
  locale: string;
}) {
  const { text, original } = safetyWording(messageKey, locale);

  return (
    <p className="disclosure disclosure--caution">
      <span className="disclosure__mark">!</span>
      <span>
        {text}
        {original ? (
          <>
            <br />
            <span className="fine" lang="en">
              {translate('catalog.safetyOriginal', locale)}: {original}
            </span>
          </>
        ) : null}
      </span>
    </p>
  );
}
