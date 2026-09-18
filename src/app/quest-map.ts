/**
 * Quest map — all 25 governed quests, their real availability, and what blocks each.
 *
 * Source: Master DB 11_QUESTS (25 rows), 12_QUEST_NODE_MAP (71 links), 04_SKILLS.
 *
 * This is the world where the state of the whole corpus becomes visible at once, so it is
 * deliberately a map of what is locked and why, rather than a progress bar. Twenty-two of the
 * twenty-five quests cannot open, and each says which record stops it.
 *
 * No XP number is computed anywhere. `11_QUESTS.Reward` carries labels — XP, Badge, Card,
 * Collection, Seed, Boss, Crown — but **no source defines an amount for any of them**, nor a
 * level threshold: the seven-level ladder in the Competency Matrix is marked "PROPOSED — NOT
 * CANONICAL". Inventing a points economy would be fabricating a governed system, so the reward
 * label is shown verbatim and nothing is added up. See OQ-X01.
 */
import type { ClaimClass } from '@/content/types';
import type { Quest } from '@/domain/entities';
import {
  evaluateQuestAvailability,
  type QuestAvailability,
} from '@/governance/learning-availability';
import { LESSON_PLANS } from './learning-session';
import { quests, skills } from '@/knowledge/repository';

/**
 * Claim class per quest — an engineering DECISION, not a source value.
 *
 * `evaluateQuestAvailability` takes the claim class from its caller because whether a quest
 * teaches a fact or a skill is an editorial judgement about its Win_Condition. The table below
 * makes that judgement once, in one place, with a reason for each, so it can be reviewed and
 * overridden by a curriculum owner rather than being scattered through screens.
 *
 * The default is SCIENTIFIC. A quest is only PEDAGOGICAL where its win condition is about
 * separating, recording or classifying what is in front of the learner — never where meeting it
 * would require knowing a fact about skin, ingredients or products.
 */
export const QUEST_CLAIM_CLASS: Readonly<Record<string, { claimClass: ClaimClass; reason: string }>> =
  {
    'QST-001': {
      claimClass: 'PEDAGOGICAL',
      reason: 'Recording three observations asserts nothing; the learner supplies the content.',
    },
    'QST-013': {
      claimClass: 'PEDAGOGICAL',
      reason: 'Separating claim, ingredients and instructions is a categorisation of text.',
    },
    'QST-014': {
      claimClass: 'PEDAGOGICAL',
      reason: 'Sorting a review into experience, fact and inference classifies statements.',
    },
    'QST-015': {
      claimClass: 'PEDAGOGICAL',
      reason: 'Spotting whether a post is sponsored reads a disclosure, not an effect.',
    },
    'QST-016': {
      claimClass: 'PEDAGOGICAL',
      reason: 'Need, want and priority are the learner’s own classification of their own goals.',
    },
    'QST-021': {
      claimClass: 'PEDAGOGICAL',
      reason:
        'Explaining in sixty seconds is the act of teaching back. Whatever is explained inherits its own claim class from the lesson it came from.',
    },
    'QST-022': {
      claimClass: 'PEDAGOGICAL',
      reason: 'Seven days of recording and reflection is the learner observing their own behaviour.',
    },
  };

const DEFAULT_CLAIM_CLASS: ClaimClass = 'SCIENTIFIC';

export const claimClassFor = (questId: string): ClaimClass =>
  QUEST_CLAIM_CLASS[questId]?.claimClass ?? DEFAULT_CLAIM_CLASS;

export interface QuestMapEntry {
  readonly quest: Quest;
  readonly world: string;
  readonly claimClass: ClaimClass;
  /** Why that class was chosen, when it departs from the SCIENTIFIC default. */
  readonly claimClassReason: string | null;
  readonly availability: QuestAvailability;
  /** Lesson plan that currently serves this quest, when one exists. */
  readonly servedByPlanId: string | null;
  /** Skill_ID for the name the quest carries, or null when the name does not resolve. */
  readonly primarySkillId: string | null;
  readonly primarySkillUnresolved: boolean;
  /** Reward label exactly as 11_QUESTS records it. No amount is attached. */
  readonly reward: string;
}

export interface QuestWorld {
  readonly world: string;
  readonly entries: readonly QuestMapEntry[];
  readonly openCount: number;
}

const skillIdForName = (name: string): string | null =>
  skills.find((skill) => skill.Skill_Name === name)?.Skill_ID ?? null;

export function questMapEntry(quest: Quest): QuestMapEntry {
  const claimClass = claimClassFor(quest.Quest_ID);
  const primarySkillId = skillIdForName(quest.Primary_Skill);
  const plan = LESSON_PLANS.find((candidate) => candidate.questId === quest.Quest_ID);

  return {
    quest,
    world: quest.World,
    claimClass,
    claimClassReason: QUEST_CLAIM_CLASS[quest.Quest_ID]?.reason ?? null,
    availability: evaluateQuestAvailability(quest.Quest_ID, claimClass),
    servedByPlanId: plan?.planId ?? null,
    primarySkillId,
    primarySkillUnresolved: primarySkillId === null,
    reward: quest.Reward,
  };
}

export const questMap = (): readonly QuestMapEntry[] => quests.map(questMapEntry);

/** Quests grouped by the World label 11_QUESTS gives them, in first-appearance order. */
export function questWorlds(): readonly QuestWorld[] {
  const grouped = new Map<string, QuestMapEntry[]>();
  for (const entry of questMap()) {
    const bucket = grouped.get(entry.world);
    if (bucket) bucket.push(entry);
    else grouped.set(entry.world, [entry]);
  }
  return [...grouped.entries()].map(([world, entries]) => ({
    world,
    entries,
    openCount: entries.filter((entry) => entry.availability.available).length,
  }));
}

export interface QuestMapReport {
  readonly total: number;
  readonly open: number;
  readonly blocked: number;
  readonly served: number;
  readonly worlds: number;
  /** Quests blocked because a mapped node does not exist at all. */
  readonly blockedByMissingRecord: number;
  /** Quests naming a Primary_Skill that does not resolve in 04_SKILLS. */
  readonly unresolvedSkillReferences: readonly string[];
  /** Reward labels present, with how many quests carry each. No amounts exist. */
  readonly rewardLabels: Readonly<Record<string, number>>;
}

export function questMapReport(): QuestMapReport {
  const entries = questMap();
  const rewardLabels: Record<string, number> = {};
  for (const entry of entries) {
    rewardLabels[entry.reward] = (rewardLabels[entry.reward] ?? 0) + 1;
  }

  return {
    total: entries.length,
    open: entries.filter((entry) => entry.availability.available).length,
    blocked: entries.filter((entry) => !entry.availability.available).length,
    served: entries.filter((entry) => entry.servedByPlanId !== null).length,
    worlds: questWorlds().length,
    blockedByMissingRecord: entries.filter((entry) =>
      entry.availability.blockers.some((blocker) => blocker.reason === 'MISSING_RECORD'),
    ).length,
    unresolvedSkillReferences: entries
      .filter((entry) => entry.primarySkillUnresolved)
      .map((entry) => `${entry.quest.Quest_ID} → "${entry.quest.Primary_Skill}"`),
    rewardLabels,
  };
}
