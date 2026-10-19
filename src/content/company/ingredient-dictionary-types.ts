/**
 * Company content: Korean, Lao and English always; Thai and French where a draft exists.
 * Lao, Thai and French are unreviewed drafts (`CATALOG_REVIEW`), never native-reviewed text.
 * A missing `th`/`fr` falls back to English and the screen says so (`showsEnglishFallback`).
 */
export interface Trilingual {
  readonly ko: string;
  readonly lo: string;
  readonly en: string;
  readonly th?: string;
  readonly fr?: string;
}

export type Evidence = 'strong' | 'moderate' | 'emerging';

export interface DictionaryEntry {
  readonly id: string;
  readonly group: string;
  readonly evidence: Evidence;
  readonly name: Trilingual;
  /** Other names it goes by on labels and in shops. */
  readonly aka: string;
  readonly concerns: readonly string[];
  readonly what: Trilingual;
  readonly how: Trilingual;
  readonly use: Trilingual;
  readonly caution: Trilingual;
  /** Dictionary ids that work well alongside it. */
  readonly pairs: readonly string[];
  /** Dictionary ids to keep apart from it, and why. */
  readonly avoid: readonly { readonly id: string; readonly why: Trilingual }[];
}

export interface CompanyDictionary {
  readonly groups: Readonly<Record<string, Trilingual & { readonly icon: string }>>;
  readonly concerns: Readonly<Record<string, Trilingual>>;
  readonly ingredients: readonly DictionaryEntry[];
}
