/**
 * Lesson availability gate.
 *
 * The publication gate answers "may this record be stated as fact?" for one record.
 * This gate answers the question a screen actually asks: **may this whole lesson open?**
 *
 * The rule follows directly from the handoff command's source discipline:
 *
 *   - A lesson that teaches a SCIENTIFIC claim (what an ingredient does, what a product
 *     achieves, what a regulation requires) may open only when every record it stands on
 *     passes the publication gate AND its evidence reference actually resolves.
 *   - A lesson that teaches a PEDAGOGICAL skill (how to observe, how to read a claim, how to
 *     reason about sufficiency) may open on unapproved records, because it asserts nothing
 *     about the world — but it still renders the pending-verification disclosure.
 *
 * Today this means the Ingredient Garden function-matching quests are correctly blocked while
 * ingredient literacy can still be taught. That is the intended behaviour, not a limitation to
 * work around.
 */
import type { Disclosure } from '@/domain/governance';
import type { ClaimClass } from '@/content/types';
import {
  DISCLOSURE_NOT_MEDICAL,
  DISCLOSURE_PENDING_VERIFICATION,
  evaluatePublication,
} from './publication-gate';
import { findEvidenceSource, findNode, findQuest, nodeLinksForQuest } from '@/knowledge/repository';
import { findIngredient } from '@/knowledge/ingredients';

export type BlockerReason = 'MISSING_RECORD' | 'UNVERIFIED_RECORD' | 'UNRESOLVED_EVIDENCE';

export interface LessonBlocker {
  readonly recordType: 'Quest' | 'KnowledgeNode' | 'Ingredient';
  readonly recordId: string;
  readonly reason: BlockerReason;
  /** Precise, quotable explanation for the governance surface. */
  readonly detail: string;
  /** Register entry that already records this class of problem, when one exists. */
  readonly registerId: string | null;
}

export interface LessonAvailability {
  readonly available: boolean;
  readonly claimClass: ClaimClass;
  readonly blockers: readonly LessonBlocker[];
  readonly disclosures: readonly Disclosure[];
  readonly summary: string;
}

export interface LessonRequirements {
  readonly claimClass: ClaimClass;
  readonly nodeIds: readonly string[];
  readonly ingredientIds?: readonly string[];
}

/** True for content that asserts something about the world rather than about reasoning. */
export const requiresVerifiedEvidence = (claimClass: ClaimClass): boolean =>
  claimClass === 'SCIENTIFIC';

/**
 * Evaluate whether a lesson may open.
 *
 * A missing record blocks any lesson, whatever its claim class: teaching around a hole in the
 * curriculum would mean inventing the missing piece.
 */
export function evaluateLessonAvailability(requirements: LessonRequirements): LessonAvailability {
  const blockers: LessonBlocker[] = [];
  const needsEvidence = requiresVerifiedEvidence(requirements.claimClass);
  let anyUnverified = false;

  for (const nodeId of requirements.nodeIds) {
    const node = findNode(nodeId);
    if (!node) {
      blockers.push({
        recordType: 'KnowledgeNode',
        recordId: nodeId,
        reason: 'MISSING_RECORD',
        detail: `Node ${nodeId} is referenced but absent from 03_KNOWLEDGE_NODES.`,
        registerId: 'SR-004 … SR-007',
      });
      continue;
    }

    const publication = evaluatePublication(node);
    if (!publication.mayStateAsFact) {
      anyUnverified = true;
      if (needsEvidence) {
        blockers.push({
          recordType: 'KnowledgeNode',
          recordId: nodeId,
          reason: 'UNVERIFIED_RECORD',
          detail: `${nodeId}: ${publication.reason}`,
          registerId: 'SR-009',
        });
      }
    }

    // A node that claims an evidence anchor must actually resolve to a registered source.
    if (needsEvidence && node.Source_ID.trim() !== '' && !findEvidenceSource(node.Source_ID)) {
      blockers.push({
        recordType: 'KnowledgeNode',
        recordId: nodeId,
        reason: 'UNRESOLVED_EVIDENCE',
        detail: `${nodeId} cites Source_ID "${node.Source_ID}", which is not registered in 14_EVIDENCE.`,
        registerId: 'OQ-E01',
      });
    }
  }

  for (const ingredientId of requirements.ingredientIds ?? []) {
    const ingredient = findIngredient(ingredientId);
    if (!ingredient) {
      blockers.push({
        recordType: 'Ingredient',
        recordId: ingredientId,
        reason: 'MISSING_RECORD',
        detail: `Ingredient ${ingredientId} is referenced but absent from 06_INGREDIENTS.`,
        registerId: null,
      });
      continue;
    }
    const publication = evaluatePublication(ingredient);
    if (!publication.mayStateAsFact) {
      anyUnverified = true;
      if (needsEvidence) {
        blockers.push({
          recordType: 'Ingredient',
          recordId: ingredientId,
          reason: 'UNVERIFIED_RECORD',
          detail: `${ingredientId} ${ingredient.Ingredient_Name}: ${publication.reason}`,
          registerId: 'SR-010',
        });
      }
    }
  }

  const disclosures: Disclosure[] = [DISCLOSURE_NOT_MEDICAL];
  if (anyUnverified) disclosures.unshift(DISCLOSURE_PENDING_VERIFICATION);

  const available = blockers.length === 0;
  return {
    available,
    claimClass: requirements.claimClass,
    blockers,
    disclosures,
    summary: available
      ? needsEvidence
        ? 'Every record this lesson stands on is approved and evidence-verified.'
        : 'This lesson teaches reasoning, so it may open on records that are still in review.'
      : `Blocked by ${blockers.length} record${blockers.length === 1 ? '' : 's'}.`,
  };
}

export interface QuestAvailability extends LessonAvailability {
  readonly questId: string;
  readonly questName: string;
  readonly winCondition: string;
  readonly coreNodeId: string | null;
  readonly nodeIds: readonly string[];
}

/**
 * Evaluate a governed quest from 11_QUESTS using its real 12_QUEST_NODE_MAP wiring.
 *
 * `claimClass` is supplied by the caller rather than inferred, because whether a quest teaches
 * a fact or a skill is an editorial judgement about its Win_Condition, not something derivable
 * from the data.
 */
export function evaluateQuestAvailability(
  questId: string,
  claimClass: ClaimClass,
): QuestAvailability {
  const quest = findQuest(questId);
  const links = nodeLinksForQuest(questId);
  const nodeIds = links.map((link) => link.Node_ID);
  const coreNodeId = links.find((link) => link.Role === 'Core')?.Node_ID ?? null;

  if (!quest) {
    return {
      questId,
      questName: questId,
      winCondition: '',
      coreNodeId,
      nodeIds,
      available: false,
      claimClass,
      blockers: [
        {
          recordType: 'Quest',
          recordId: questId,
          reason: 'MISSING_RECORD',
          detail: `Quest ${questId} is absent from 11_QUESTS.`,
          registerId: null,
        },
      ],
      disclosures: [DISCLOSURE_NOT_MEDICAL],
      summary: 'Quest record not found.',
    };
  }

  const availability = evaluateLessonAvailability({ claimClass, nodeIds });
  return {
    ...availability,
    questId,
    questName: quest.Quest_Name,
    winCondition: quest.Win_Condition,
    coreNodeId,
    nodeIds,
  };
}

/**
 * The Ingredient Garden quests, with the claim class each one's Win_Condition implies.
 *
 * All three ask the learner to state what an ingredient *does* or how ingredients relate,
 * which is a scientific claim. They are therefore wired for real and correctly blocked until
 * the ingredient and node records pass evidence review.
 */
export const INGREDIENT_GARDEN_QUESTS: readonly { questId: string; claimClass: ClaimClass }[] = [
  { questId: 'QST-008', claimClass: 'SCIENTIFIC' },
  { questId: 'QST-009', claimClass: 'SCIENTIFIC' },
  { questId: 'QST-010', claimClass: 'SCIENTIFIC' },
];

export const ingredientGardenQuestAvailability = (): readonly QuestAvailability[] =>
  INGREDIENT_GARDEN_QUESTS.map((entry) =>
    evaluateQuestAvailability(entry.questId, entry.claimClass),
  );
