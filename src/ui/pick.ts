import type { Trilingual } from '@/content/company/ingredient-dictionary-types';

/**
 * Company content exists in Korean, Lao and English. Korean and Lao readers get their own
 * language; everyone else gets English, and the screen says so (`guide.englishShown`).
 */
export const pick = (text: Trilingual, locale: string): string =>
  locale === 'ko' ? text.ko : locale === 'lo' ? text.lo : text.en;

export const showsEnglishFallback = (locale: string): boolean =>
  locale !== 'ko' && locale !== 'lo' && locale !== 'en';
