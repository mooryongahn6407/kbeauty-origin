/**
 * Media content derivation.
 *
 * Source: 02_GLOBAL_CONTENT_ENGINE_SPEC_v1.0.md —
 *   "Platform scripts may change tone, duration, structure and examples, but must link back
 *    to the canonical knowledge source."
 *
 * A derivative is a re-shaping of one content atom for one platform in one locale. It copies
 * no facts of its own: every block it emits comes from the atom's variant text. If the atom
 * has no text for a block, the block is omitted rather than invented.
 */
import type { AuthoredContentAtom, PlatformDerivative, PlatformTarget } from './types';
import { resolveVariant } from './authored-content';

/** Which atom text blocks each platform uses, in order. */
const PLATFORM_BLOCK_PLAN: Readonly<Record<PlatformTarget, readonly string[]>> = {
  app_lesson: ['hook', 'core', 'analogy', 'checkPrompt'],
  ai_tutor: ['hook', 'core', 'checkPrompt'],
  quiz: ['checkPrompt'],
  quest: ['hook', 'checkPrompt', 'transferPrompt'],
  article: ['hook', 'core', 'analogy', 'transferPrompt'],
  infographic: ['hook', 'analogy'],
  youtube_long: ['hook', 'core', 'analogy', 'transferPrompt'],
  youtube_shorts: ['hook', 'analogy'],
  tiktok: ['hook', 'analogy'],
  instagram_reels: ['hook', 'analogy'],
  facebook_video: ['hook', 'core'],
};

export interface DerivationResult {
  readonly derivative: PlatformDerivative | null;
  /** Why nothing could be derived, when derivative is null. */
  readonly reason?: string;
  readonly usedFallbackLocale: boolean;
}

/**
 * Derive one platform representation of an atom.
 *
 * Returns null rather than partial invented content when the atom has no variant for the
 * locale (and no base-locale fallback), or when the plan's blocks are all absent.
 */
export function derive(
  atom: AuthoredContentAtom,
  platform: PlatformTarget,
  locale: string,
): DerivationResult {
  const resolved = resolveVariant(atom.variants, locale);
  if (!resolved) {
    return {
      derivative: null,
      reason: `No variant for locale "${locale}" and no base-locale fallback.`,
      usedFallbackLocale: false,
    };
  }

  const plan = PLATFORM_BLOCK_PLAN[platform];
  const blocks = plan.flatMap((role) => {
    const text = resolved.variant.text[role];
    return text ? [{ role, text }] : [];
  });

  if (blocks.length === 0) {
    return {
      derivative: null,
      reason: `Atom ${atom.atomId} has none of the blocks required for ${platform}.`,
      usedFallbackLocale: resolved.usedFallback,
    };
  }

  return {
    derivative: {
      derivativeId: `${atom.atomId}--${platform}--${resolved.variant.locale}`,
      atomId: atom.atomId,
      nodeId: atom.nodeId,
      nodeVersion: atom.nodeVersion,
      platform,
      locale: resolved.variant.locale,
      claimClass: atom.claimClass,
      evidenceSourceIds: atom.evidenceSourceIds,
      blocks,
    },
    usedFallbackLocale: resolved.usedFallback,
  };
}

export const ALL_PLATFORMS = Object.keys(PLATFORM_BLOCK_PLAN) as readonly PlatformTarget[];
