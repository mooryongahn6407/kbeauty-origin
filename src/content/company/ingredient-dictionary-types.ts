export interface Trilingual {
  readonly ko: string;
  readonly lo: string;
  readonly en: string;
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
