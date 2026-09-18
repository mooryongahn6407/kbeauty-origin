/**
 * Mode prompt contracts — AI Tutor Constitution §10.
 *
 * Each tutor mode has an output skeleton the Constitution specifies. Rather than generating
 * prose to fill them, this module declares the slots and reports, per slot, whether the
 * application can honestly fill it today and why not when it cannot.
 *
 * That inversion is the point. A generative tutor with no approved knowledge would fill every
 * slot with fluent text and hide the gap; §16's RED TEAM note warns that in this category
 * "유창함이 위험한 hallucination을 숨길 수 있다". Declaring the empty slots makes the gap the
 * visible output instead.
 */
import type { TutorMode } from '@/domain/learning';
import { atomsForNode } from '@/content/authored-content';

export interface SlotSpec {
  readonly slot: string;
  /** True when filling this slot means asserting something about the world. */
  readonly requiresVerifiedKnowledge: boolean;
}

/** Output skeletons transcribed from AI Tutor Constitution §10 and §2.2. */
export const MODE_SKELETON: Readonly<Record<TutorMode, readonly SlotSpec[]>> = {
  TEACH: [
    { slot: 'hook', requiresVerifiedKnowledge: false },
    { slot: 'core', requiresVerifiedKnowledge: true },
    { slot: 'visual_analogy', requiresVerifiedKnowledge: false },
    { slot: 'check', requiresVerifiedKnowledge: false },
  ],
  COACH: [
    { slot: 'question', requiresVerifiedKnowledge: false },
    { slot: 'hint', requiresVerifiedKnowledge: false },
    { slot: 'retry', requiresVerifiedKnowledge: false },
  ],
  REMEDIATE: [
    { slot: 'error', requiresVerifiedKnowledge: false },
    { slot: 'misconception_contrast', requiresVerifiedKnowledge: true },
    { slot: 'retry', requiresVerifiedKnowledge: false },
  ],
  PRACTICE: [
    { slot: 'similar_problem', requiresVerifiedKnowledge: false },
    { slot: 'variation', requiresVerifiedKnowledge: false },
    { slot: 'transfer', requiresVerifiedKnowledge: false },
  ],
  ASSESS: [
    { slot: 'task', requiresVerifiedKnowledge: false },
    { slot: 'response', requiresVerifiedKnowledge: false },
    { slot: 'score', requiresVerifiedKnowledge: false },
    { slot: 'next', requiresVerifiedKnowledge: false },
  ],
  REFLECT: [
    { slot: 'what_learned', requiresVerifiedKnowledge: false },
    { slot: 'what_changed', requiresVerifiedKnowledge: false },
    { slot: 'next_mission', requiresVerifiedKnowledge: false },
  ],
  RECOMMEND: [
    { slot: 'need', requiresVerifiedKnowledge: false },
    { slot: 'criteria', requiresVerifiedKnowledge: true },
    { slot: 'options', requiresVerifiedKnowledge: true },
    { slot: 'why', requiresVerifiedKnowledge: true },
    { slot: 'limits', requiresVerifiedKnowledge: true },
  ],
  SAFETY: [
    { slot: 'acknowledge', requiresVerifiedKnowledge: false },
    { slot: 'boundary', requiresVerifiedKnowledge: false },
    { slot: 'next_safe_action', requiresVerifiedKnowledge: false },
  ],
};

export interface SlotState {
  readonly slot: string;
  readonly filled: boolean;
  /** Why the slot is empty. Null when it is filled. */
  readonly blockedReason: string | null;
}

export interface ModeContract {
  readonly mode: TutorMode;
  readonly slots: readonly SlotState[];
  readonly filledCount: number;
  readonly totalCount: number;
  /** True when every slot the skeleton requires can be filled honestly. */
  readonly complete: boolean;
}

/**
 * Work out which slots of a mode's skeleton this application can fill right now.
 *
 * A slot is filled when it does not require asserting a fact AND authored scaffolding exists
 * for the grounded node. Safety is the exception: its slots are always fillable, because a
 * safety response is about boundaries and next steps, not about knowledge — and a safety
 * message must never be withheld for lack of curriculum.
 */
export function evaluateModeContract(
  mode: TutorMode,
  groundedNodeId: string | null,
  canStateAsFact: boolean,
): ModeContract {
  const skeleton = MODE_SKELETON[mode];
  const authored = groundedNodeId ? atomsForNode(groundedNodeId) : [];
  const hasAuthored = authored.length > 0;

  const slots: SlotState[] = skeleton.map((spec) => {
    if (mode === 'SAFETY') {
      return { slot: spec.slot, filled: true, blockedReason: null };
    }
    if (spec.requiresVerifiedKnowledge && !canStateAsFact) {
      return {
        slot: spec.slot,
        filled: false,
        blockedReason:
          'Filling this would assert something about the world, and no grounded record has passed the evidence gate.',
      };
    }
    if (!groundedNodeId) {
      return {
        slot: spec.slot,
        filled: false,
        blockedReason: 'Nothing was grounded, so there is no node to draw scaffolding from.',
      };
    }
    if (!hasAuthored) {
      return {
        slot: spec.slot,
        filled: false,
        blockedReason: `No authored content exists for ${groundedNodeId} yet.`,
      };
    }
    return { slot: spec.slot, filled: true, blockedReason: null };
  });

  const filledCount = slots.filter((slot) => slot.filled).length;
  return {
    mode,
    slots,
    filledCount,
    totalCount: slots.length,
    complete: filledCount === slots.length,
  };
}
