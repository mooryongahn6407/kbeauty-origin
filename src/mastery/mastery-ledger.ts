/**
 * Mastery ledger — evidence accumulated across lessons.
 *
 * The mastery engine folds one attempt into one skill's state. The ledger is what makes that
 * meaningful across a learner's whole session: My Skin, Ingredient Garden, Routine Studio, Sun
 * Protection and Label Detective all feed the same twelve skills, so evidence for SK06 earned
 * while reading a label counts toward the same SK06 as evidence earned in Ingredient Garden.
 *
 * One property matters more than any other here, and it is enforced by the shape of the API:
 * **mastery can only be earned from attempts.** There is no grant, set, unlock or award method.
 * A progress surface cannot hand out a level, a quest cannot confer one on completion, and no
 * commercial or loyalty state can reach it — CLAUDE.md rule 9 and AI Constitution §6.
 *
 * Persistence is in-memory for the prototype; the interface is what a stored ledger would
 * implement.
 */
import type { Attempt, MasteryState } from '@/domain/learning';
import { createMasteryState, isMastered, recordAttempt } from './mastery-engine';
import { skills } from '@/knowledge/repository';

export interface LedgerSnapshot {
  readonly userId: string;
  readonly states: readonly MasteryState[];
  readonly attemptCount: number;
  /** Skill IDs whose four dimensions are all satisfied. */
  readonly masteredSkillIds: readonly string[];
  /** Skills that have any evidence at all, mastered or not. */
  readonly startedSkillIds: readonly string[];
  /** Node IDs that contributed evidence anywhere. */
  readonly nodesEvidenced: readonly string[];
}

export interface MasteryLedger {
  /** The only way state changes. Deliberately the only mutator on this interface. */
  record(attempt: Attempt): void;
  stateFor(skillId: string): MasteryState;
  snapshot(): LedgerSnapshot;
  /** Resets the ledger. Used by tests and by an explicit learner action, never by scoring. */
  reset(): void;
}

export function createMasteryLedger(userId: string): MasteryLedger {
  let states = new Map<string, MasteryState>();
  let seen = new Set<string>();
  let attemptCount = 0;

  const ensure = (skillId: string, at: string): MasteryState =>
    states.get(skillId) ?? createMasteryState(userId, skillId, at);

  return {
    /**
     * Fold one attempt in.
     *
     * Idempotent per `attemptId`: recording the same attempt twice counts once. That is what an
     * id means, and it matters concretely because the caller writes from inside a reducer, which
     * React StrictMode invokes twice in development. Without this, one answer would show as two
     * and the learner's evidence count would be wrong on screen.
     */
    record(attempt) {
      // An attempt for an unknown skill is dropped rather than creating a skill that
      // does not exist in 04_SKILLS.
      if (!skills.some((skill) => skill.Skill_ID === attempt.skillId)) return;
      if (seen.has(attempt.attemptId)) return;
      seen.add(attempt.attemptId);
      states.set(attempt.skillId, recordAttempt(ensure(attempt.skillId, attempt.at), attempt));
      attemptCount += 1;
    },

    stateFor(skillId) {
      return ensure(skillId, new Date(0).toISOString());
    },

    snapshot() {
      const all = [...states.values()];
      const nodes = new Set<string>();
      for (const state of all) for (const nodeId of state.nodeEvidence) nodes.add(nodeId);

      return {
        userId,
        states: all,
        attemptCount,
        masteredSkillIds: all.filter(isMastered).map((state) => state.skillId).sort(),
        startedSkillIds: all.map((state) => state.skillId).sort(),
        nodesEvidenced: [...nodes].sort(),
      };
    },

    reset() {
      states = new Map();
      seen = new Set();
      attemptCount = 0;
    },
  };
}

/** Process-wide ledger for the prototype shell. Tests create their own isolated ledgers. */
export const masteryLedger: MasteryLedger = createMasteryLedger('local-learner');

export interface SkillProgressRow {
  readonly skillId: string;
  readonly skillName: string;
  readonly definition: string;
  readonly level: string;
  readonly linkedDomains: string;
  readonly state: MasteryState;
  readonly hasEvidence: boolean;
  readonly mastered: boolean;
}

/** All twelve governed skills with whatever evidence the ledger holds for each. */
export function skillProgress(ledger: MasteryLedger): readonly SkillProgressRow[] {
  return skills.map((skill) => {
    const state = ledger.stateFor(skill.Skill_ID);
    return {
      skillId: skill.Skill_ID,
      skillName: skill.Skill_Name,
      definition: skill.Definition,
      level: skill.Level,
      linkedDomains: skill.Linked_Domains,
      state,
      hasEvidence: state.dimensions.accuracy.attempts > 0,
      mastered: isMastered(state),
    };
  });
}
