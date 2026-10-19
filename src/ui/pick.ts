import type { Trilingual } from '@/content/company/ingredient-dictionary-types';

/**
 * Company content always exists in Korean, Lao and English, and in Thai and French where a
 * draft has been written. Korean, Lao and English readers get their own language; Thai and French
 * readers get theirs when the draft exists, otherwise English — and the screen says so
 * (`guide.englishShown`, via `showsEnglishFallback`).
 */
const DRAFT_LOCALES = ['th', 'fr'] as const;
type DraftLocale = (typeof DRAFT_LOCALES)[number];
const isDraftLocale = (locale: string): locale is DraftLocale =>
  (DRAFT_LOCALES as readonly string[]).includes(locale);

/** The language `pick` actually returns for this text — use it for the element's `lang`. */
export const pickLang = (text: Trilingual, locale: string): string => {
  if (locale === 'ko' || locale === 'lo' || locale === 'en') return locale;
  if (isDraftLocale(locale) && text[locale]) return locale;
  return 'en';
};

export const pick = (text: Trilingual, locale: string): string => {
  const lang = pickLang(text, locale);
  return lang === 'ko'
    ? text.ko
    : lang === 'lo'
      ? text.lo
      : lang === 'th' || lang === 'fr'
        ? (text[lang] ?? text.en)
        : text.en;
};

const isLocalized = (value: unknown): value is Trilingual =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as Trilingual).en === 'string' &&
  typeof (value as Trilingual).lo === 'string';

const missingCache = new WeakMap<object, Map<string, boolean>>();

/** True when any localized text inside `content` lacks `locale` (walks objects and arrays). */
function lacksLocale(content: unknown, locale: DraftLocale): boolean {
  if (typeof content !== 'object' || content === null) return false;
  let byLocale = missingCache.get(content);
  if (!byLocale) missingCache.set(content, (byLocale = new Map()));
  const known = byLocale.get(locale);
  if (known !== undefined) return known;
  const missing = isLocalized(content)
    ? !content[locale]
    : Object.values(content).some((value) => lacksLocale(value, locale));
  byLocale.set(locale, missing);
  return missing;
}

/**
 * Whether the screen must say "shown in English". With `content`, only when some of that content
 * really falls back to English for this locale; without it, for every locale that has no
 * company-content language of its own.
 */
export const showsEnglishFallback = (locale: string, content?: unknown): boolean => {
  if (locale === 'ko' || locale === 'lo' || locale === 'en') return false;
  if (content === undefined || !isDraftLocale(locale)) return true;
  return lacksLocale(content, locale);
};
