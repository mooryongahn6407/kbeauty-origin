/**
 * Localization / global content architecture.
 *
 * Two sources define the locale set and they DO NOT AGREE:
 *
 *   Master DB 15_LOCALIZATION (7 rows): EN, KO, LO, TH, FR, ES, PT
 *   02_GLOBAL_CONTENT_ENGINE_SPEC_v1.0.md (10 languages):
 *     English, French, Spanish, Chinese, Korean, Japanese, Italian, Thai, Vietnamese, Indonesian
 *
 * The DB-only locales are LO (Lao) and PT (Portuguese); the spec-only locales are
 * ZH, JA, IT, VI, ID. Lao matters especially: the Master DB marks it "Laos launch language"
 * and the AI Tutor Constitution §13.1 names Lao as the first localization target, yet it is
 * absent from the 10-language list. This is a genuine source conflict, logged as OQ-L01.
 *
 * Per source discipline this module does NOT pick a set. It registers the union, records
 * which source each locale comes from, and leaves the decision open.
 */
import type { OpenGovernanceItem } from '@/domain/governance';
import { localizationRecords } from '@/knowledge/repository';

export type LocaleOrigin = 'MASTER_DB_15_LOCALIZATION' | 'GLOBAL_CONTENT_ENGINE_SPEC' | 'BOTH';

export interface LocaleDefinition {
  /** BCP-47-style lower-case tag used by the application. */
  readonly tag: string;
  /** Locale_ID from Master DB 15_LOCALIZATION when the DB defines it. */
  readonly masterDbLocaleId: string | null;
  readonly englishName: string;
  readonly origin: LocaleOrigin;
  /** Stage from the Master DB (Core / Market / Future) when present. */
  readonly stage: string | null;
  readonly note: string;
}

export const OQ_L01: OpenGovernanceItem = {
  id: 'OQ-L01',
  title: 'Locale set conflict between Master DB 15_LOCALIZATION and the Global Content Engine spec',
  classification: 'OPEN_QUESTION',
  severity: 'OPEN',
  summary:
    'The Master Database defines 7 locales including Lao (marked "Laos launch language") and ' +
    'Portuguese. The Global Content Engine spec lists 10 languages that include Chinese, Japanese, ' +
    'Italian, Vietnamese and Indonesian but omit Lao and Portuguese. The two sets are not equal ' +
    'and neither has been approved as the launch locale set.',
  engineeringPosture:
    'The union of both sets is registered, each locale tagged with the source that defines it. ' +
    'No locale is dropped and none is invented. Translation coverage is reported per locale so ' +
    'an unresolved set does not silently become a shipping decision. Lao now has a UI catalog ' +
    '(PR-036), which does not resolve this item: a catalog existing is not the locale set being ' +
    'approved, and that catalog is itself an unreviewed draft.',
};

/** Language list from 02_GLOBAL_CONTENT_ENGINE_SPEC_v1.0.md, in document order. */
const SPEC_LANGUAGES: readonly { tag: string; englishName: string }[] = [
  { tag: 'en', englishName: 'English' },
  { tag: 'fr', englishName: 'French' },
  { tag: 'es', englishName: 'Spanish' },
  { tag: 'zh', englishName: 'Chinese' },
  { tag: 'ko', englishName: 'Korean' },
  { tag: 'ja', englishName: 'Japanese' },
  { tag: 'it', englishName: 'Italian' },
  { tag: 'th', englishName: 'Thai' },
  { tag: 'vi', englishName: 'Vietnamese' },
  { tag: 'id', englishName: 'Indonesian' },
];

const specByTag = new Map(SPEC_LANGUAGES.map((language) => [language.tag, language]));

/** Union of both source sets, with per-locale provenance. Nothing is dropped or invented. */
export const LOCALES: readonly LocaleDefinition[] = (() => {
  const merged = new Map<string, LocaleDefinition>();

  for (const record of localizationRecords) {
    const tag = record.Language.trim().toLowerCase() === 'global english'
      ? 'en'
      : record.Locale_ID.replace(/^LOC-\d+$/, '').toLowerCase() || '';
    // Locale_ID is LOC-00n; the two-letter code lives in the `Language` column of this sheet.
    const code = record.Language.trim().toLowerCase();
    const resolved = code.length === 2 ? code : tag;
    if (!resolved) continue;
    merged.set(resolved, {
      tag: resolved,
      masterDbLocaleId: record.Locale_ID,
      englishName: specByTag.get(resolved)?.englishName ?? record.Market_Label,
      origin: specByTag.has(resolved) ? 'BOTH' : 'MASTER_DB_15_LOCALIZATION',
      stage: record.Stage,
      note: record.Notes,
    });
  }

  for (const language of SPEC_LANGUAGES) {
    if (merged.has(language.tag)) continue;
    merged.set(language.tag, {
      tag: language.tag,
      masterDbLocaleId: null,
      englishName: language.englishName,
      origin: 'GLOBAL_CONTENT_ENGINE_SPEC',
      stage: null,
      note: 'Required by the Global Content Engine spec; not present in Master DB 15_LOCALIZATION.',
    });
  }

  return [...merged.values()].sort((a, b) => a.tag.localeCompare(b.tag));
})();

/**
 * Base locale for authored content.
 * The Global Content Engine spec makes English the reference language; the Constitution
 * §13.1 keeps core content and UI separable so a market pack can lead with another locale.
 */
export const BASE_LOCALE = 'en';

export const isKnownLocale = (tag: string): boolean =>
  LOCALES.some((locale) => locale.tag === tag);

export const findLocale = (tag: string): LocaleDefinition | undefined =>
  LOCALES.find((locale) => locale.tag === tag);

/**
 * A language's name, written in that language.
 *
 * Master DB 15_LOCALIZATION carries only an English `Market_Label` ("Lao", "French"), so
 * telling a Lao reader in Lao which language they are reading needs a name the source does not
 * hold. Inventing one in a data file would be inventing data, so it comes from `Intl`, which is
 * the platform's own locale data rather than anything this project asserts — and falls back to
 * the governed English label wherever the runtime has no entry.
 */
export function languageName(tag: string): string {
  const fallback = findLocale(tag)?.englishName ?? tag;
  try {
    const names = new Intl.DisplayNames([tag], { type: 'language', fallback: 'none' });
    const native = names.of(tag);
    return native && native !== tag ? native : fallback;
  } catch {
    return fallback;
  }
}