/**
 * Access layer for application-authored learning content.
 *
 * Authored content is NOT an official source. It exists because the handoff command allows
 * "safe placeholder/demo data only where source data is not approved" — and in the current
 * Master Database no Knowledge Node has passed the evidence gate. Everything here therefore:
 *   - carries an AUTHORED- ID that cannot collide with a source ID,
 *   - names the governed node and node version it derives from,
 *   - declares the class of claim it makes (see ClaimClass),
 *   - stays Draft; nothing in code promotes it.
 */
import type { AuthoredContentAtom, ContentVariant, LearningActivity } from './types';
import { BASE_LOCALE } from '@/localization/locales';
import firstSlice from '../../data/authored/first-slice.json';

export const authoredAtoms = firstSlice.atoms as readonly AuthoredContentAtom[];
export const authoredActivities = firstSlice.activities as readonly LearningActivity[];

export const findAtom = (atomId: string): AuthoredContentAtom | undefined =>
  authoredAtoms.find((atom) => atom.atomId === atomId);

export const findActivity = (activityId: string): LearningActivity | undefined =>
  authoredActivities.find((activity) => activity.activityId === activityId);

export const atomsForNode = (nodeId: string): readonly AuthoredContentAtom[] =>
  authoredAtoms.filter((atom) => atom.nodeId === nodeId);

export const activitiesForNode = (nodeId: string): readonly LearningActivity[] =>
  authoredActivities.filter((activity) => activity.nodeId === nodeId);

export interface ResolvedVariant {
  readonly variant: ContentVariant;
  /** True when the requested locale was unavailable and the base locale was used instead. */
  readonly usedFallback: boolean;
  readonly requestedLocale: string;
}

/**
 * Resolve a variant for a locale, falling back to the base locale.
 *
 * The fallback is reported rather than hidden: a screen showing English text to a Thai
 * learner should be able to say so, and analytics records which locale was actually used
 * (`content_language_used`).
 */
export function resolveVariant(
  variants: readonly ContentVariant[],
  locale: string,
): ResolvedVariant | undefined {
  const exact = variants.find((variant) => variant.locale === locale);
  if (exact) return { variant: exact, usedFallback: false, requestedLocale: locale };

  const base = variants.find((variant) => variant.locale === BASE_LOCALE);
  if (base) return { variant: base, usedFallback: true, requestedLocale: locale };

  return undefined;
}

export interface LocaleCoverage {
  readonly locale: string;
  readonly atomsTranslated: number;
  readonly atomsTotal: number;
  readonly activitiesTranslated: number;
  readonly activitiesTotal: number;
}

/**
 * Report translation coverage per locale.
 * Gaps are surfaced, never filled with machine text, so that an unresolved locale decision
 * (OQ-L01) cannot quietly become a shipping claim of "10 languages supported".
 */
export function localeCoverage(locales: readonly string[]): readonly LocaleCoverage[] {
  return locales.map((locale) => ({
    locale,
    atomsTranslated: authoredAtoms.filter((atom) =>
      atom.variants.some((variant) => variant.locale === locale),
    ).length,
    atomsTotal: authoredAtoms.length,
    activitiesTranslated: authoredActivities.filter((activity) =>
      activity.variants.some((variant) => variant.locale === locale),
    ).length,
    activitiesTotal: authoredActivities.length,
  }));
}
