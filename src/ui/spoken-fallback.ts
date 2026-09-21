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
