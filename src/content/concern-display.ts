/**
 * What a concern is called, and what you might notice — in the reader's own language.
 *
 * 07_CONCERNS carries `Concern_Name` in English only ("Acne", "Pigmentation") and
 * `Learning_Goal` in Korean, written for whoever authors the lessons ("치료 주장 금지",
 * "지속 시 전문가 상담"). Both were being printed straight onto the screen, so a shopper in
 * Vientiane met an English label and an internal instruction to the content team. Neither is a
 * defect in the database — the database has no column for a consumer-facing name, because that
 * is application copy.
 *
 * So this module supplies the copy and leaves the records alone. `Concern_ID` is the key and
 * `Concern_Name` is never altered, renamed or reinterpreted (rule 1); the governance screen
 * still shows the source record exactly as it stands.
 *
 * Every notice describes only what a person might SEE or FEEL. None of them names a cause,
 * says what skin is or needs, or recommends anything — which is what keeps this authorable at
 * all while the corpus is unverified (rules 2 and 3). The source `Boundary` is untouched and
 * still raises the app's professional-consultation notice on the concerns that carry one.
 */
import data from '../../data/authored/concern-display.json';
import { BASE_LOCALE } from '@/localization/locales';

interface ConcernDisplay {
  readonly concernId: string;
  readonly sourceName: string;
  readonly laoReview: boolean;
  readonly name: Readonly<Record<string, string>>;
  readonly notice: Readonly<Record<string, string>>;
}

export const concernDisplays = data.concerns as readonly ConcernDisplay[];

const byId = new Map(concernDisplays.map((entry) => [entry.concernId, entry]));

/** Falls back to the base locale, then to the source name — never to an empty label. */
const pick = (
  table: Readonly<Record<string, string>> | undefined,
  locale: string,
  fallback: string,
): string => table?.[locale] ?? table?.[BASE_LOCALE] ?? fallback;

/** The name to show a reader. `sourceName` is the last resort, so a new record still renders. */
export function concernName(concernId: string, locale: string, sourceName: string): string {
  return pick(byId.get(concernId)?.name, locale, sourceName);
}

/** One line on what someone might notice, or null when this concern has no copy yet. */
export function concernNotice(concernId: string, locale: string): string | null {
  const entry = byId.get(concernId);
  if (!entry) return null;
  return entry.notice[locale] ?? entry.notice[BASE_LOCALE] ?? null;
}

/** Concerns whose Lao name is a phrase we constructed rather than one we found in use. */
export const laoNeedsPartnerReview: readonly string[] = concernDisplays
  .filter((entry) => entry.laoReview)
  .map((entry) => entry.concernId);
