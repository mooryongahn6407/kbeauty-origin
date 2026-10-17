/**
 * The same passage, in the language that will speak for this one.
 *
 * `SPOKEN_FALLBACK` says which locale may lend its voice to another — today only Thai for Lao.
 * That substitution is only allowed to happen as *that locale's own translation, read by its
 * own voice*: a Thai voice handed Lao characters produces noise, not an accent. So a control
 * that wants the fallback has to supply the Thai text, not just name Thai.
 *
 * Every passage the app reads aloud is built from message keys, which means the Thai version of
 * the same passage is one more `translate()` away. This is that one call, in one place, so a
 * screen asking for it cannot accidentally hand over the wrong string.
 *
 * Returns undefined when the reader's locale has no lender, which is every locale but Lao — in
 * which case the control falls back to the base locale or says it has no voice, unchanged.
 */
import { BASE_LOCALE } from '@/localization/locales';
import { SPOKEN_FALLBACK } from './speech';

export function spokenFallback(
  locale: string,
  /** Renders the passage in whichever locale it is given. */
  render: (locale: string) => string,
): { locale: string; text: string } | undefined {
  const lender = SPOKEN_FALLBACK[locale];
  if (!lender) return undefined;
  const text = render(lender);
  return text.trim() === '' ? undefined : { locale: lender, text };
}

/**
 * The same idea for content that is not built from message keys — the company dictionary and
 * authored lessons, which exist only in some languages.
 *
 * `versions` holds the passage in every language it is actually written in. The lender's own
 * text is used when it exists (Thai text for a Thai voice, exactly as above). When the content
 * has no version in the lender's language, the base-locale version is offered instead, so a Lao
 * reader on a phone with no Lao voice hears the English that the content does carry rather than
 * silence. Never a version in one language handed to a voice for another.
 */
export function contentSpokenFallback(
  locale: string,
  versions: { readonly ko?: string; readonly en?: string; readonly lo?: string; readonly th?: string; readonly fr?: string },
): { locale: string; text: string } | undefined {
  const lender = SPOKEN_FALLBACK[locale];
  if (!lender) return undefined;
  const lent = versions[lender as keyof typeof versions];
  if (lent && lent.trim() !== '') return { locale: lender, text: lent };
  const base = versions[BASE_LOCALE as keyof typeof versions];
  return base && base.trim() !== '' ? { locale: BASE_LOCALE, text: base } : undefined;
}
