/**
 * Content atom + localization + platform derivation types.
 *
 * Source: 02_GLOBAL_CONTENT_ENGINE_SPEC_v1.0.md
 *   ONE KNOWLEDGE -> MULTI-LANGUAGE -> MULTI-FORMAT -> MULTI-PLATFORM
 *   "Do not duplicate core facts separately for each platform."
 *
 * The canonical knowledge lives in the Master Database. Everything below is a *derivation*
 * that must carry `nodeId` and `nodeVersion` back to it.
 */

/**
 * What kind of claim a piece of authored content makes. This is the mechanism that keeps
 * application-authored text from smuggling in fabricated science.
 *
 * PEDAGOGICAL     - about how to learn, observe or reason. Asserts nothing about skin biology.
 * SAFETY_BOUNDARY - states the product's own limits (e.g. "this is not medical advice").
 * SCIENTIFIC      - asserts a fact about skin, ingredients, products or regulation.
 *                   Requires evidence that passes the publication gate. See
 *                   tests/content-governance.test.ts.
 */
export type ClaimClass = 'PEDAGOGICAL' | 'SAFETY_BOUNDARY' | 'SCIENTIFIC';

/** Platforms a content atom can be derived for. Source: Global Content Engine spec. */
export type PlatformTarget =
  | 'app_lesson'
  | 'ai_tutor'
  | 'quiz'
  | 'quest'
  | 'article'
  | 'infographic'
  | 'youtube_long'
  | 'youtube_shorts'
  | 'tiktok'
  | 'instagram_reels'
  | 'facebook_video';

/** One localized rendering of a content atom. */
export interface ContentVariant {
  readonly locale: string;
  /** Review state of this translation, independent of the knowledge node's own status. */
  readonly reviewStatus: 'Draft' | 'Review' | 'Approved';
  readonly text: Readonly<Record<string, string>>;
  /** Terminology or market notes; localization is not literal translation (spec §Localization). */
  readonly localNotes?: string;
}

/** An application-authored learning atom derived from exactly one governed Knowledge Node. */
export interface AuthoredContentAtom {
  /** AUTHORED- prefix keeps this ID namespace disjoint from every source ID namespace. */
  readonly atomId: string;
  /** The governed node this content teaches. Must exist in 03_KNOWLEDGE_NODES. */
  readonly nodeId: string;
  /** Node `Version` at authoring time, so drift is detectable. */
  readonly nodeVersion: string;
  /** Skill this atom collects evidence for (Master DB 04_SKILLS). */
  readonly skillId: string;
  readonly claimClass: ClaimClass;
  /** Source_IDs from 14_EVIDENCE. Required and non-empty when claimClass is SCIENTIFIC. */
  readonly evidenceSourceIds: readonly string[];
  readonly reviewStatus: 'Draft' | 'Review' | 'Approved';
  readonly variants: readonly ContentVariant[];
}

/** A question the learner answers, with its hint ladder. */
export interface LearningActivity {
  readonly activityId: string;
  readonly atomId: string;
  readonly nodeId: string;
  readonly skillId: string;
  readonly claimClass: ClaimClass;
  readonly interactionType: 'tap_choice';
  /** Index into `options` of each variant. Options are ordered identically across locales. */
  readonly correctOptionIndex: number;
  /** True when this activity presents a scenario not covered by the lesson (transfer evidence). */
  readonly isTransfer: boolean;
  readonly variants: readonly ContentVariant[];
}

/** A platform derivative: same knowledge, different shape. Never a separate source of fact. */
export interface PlatformDerivative {
  readonly derivativeId: string;
  readonly atomId: string;
  readonly nodeId: string;
  readonly nodeVersion: string;
  readonly platform: PlatformTarget;
  readonly locale: string;
  readonly claimClass: ClaimClass;
  readonly evidenceSourceIds: readonly string[];
  readonly blocks: readonly { readonly role: string; readonly text: string }[];
}
