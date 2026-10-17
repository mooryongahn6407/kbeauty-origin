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
 * Persistence: the ledger keeps the attempts it has accepted and, when given a browser store,
 * writes them under a versioned key so progress survives a reload. On load the stored attempts
 * are *replayed through `record`* — states are never read back directly — so stored data can
 * only ever rebuild evidence that attempts earned, and a malformed row is simply skipped. Every
 * read and write is wrapped: a private window or blocked site data leaves an in-memory ledger
 * that still works.
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

/** Storage key, versioned: a change to the stored shape takes a new key, never a reinterpretation. */
export const MASTERY_STORAGE_KEY = 'korea-glow:mastery:v1';

/** The slice of the Web Storage API the ledger touches. */
export type LedgerStore = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

const isAttempt = (value: unknown): value is Attempt => {
  if (typeof value !== 'object' || value === null) return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.attemptId === 'string' &&
    typeof row.userId === 'string' &&
    typeof row.nodeId === 'string' &&
    typeof row.skillId === 'string' &&
    typeof row.activityId === 'string' &&
    typeof row.correct === 'boolean' &&
    typeof row.hintsUsed === 'number' &&
    Number.isFinite(row.hintsUsed) &&
    typeof row.isTransfer === 'boolean' &&
    typeof row.isRetention === 'boolean' &&
    typeof row.at === 'string'
  );
};

function readStored(store: LedgerStore | undefined): readonly Attempt[] {
  try {
    const raw = store?.getItem(MASTERY_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return [];
    const attempts = (parsed as { attempts?: unknown }).attempts;
    return Array.isArray(attempts) ? attempts.filter(isAttempt) : [];
  } catch {
    return [];
  }
}

export function createMasteryLedger(userId: string, store?: LedgerStore): MasteryLedger {
  let states = new Map<string, MasteryState>();
  let seen = new Set<string>();
  let attemptCount = 0;
  let accepted: Attempt[] = [];

  const write = () => {
    try {
      store?.setItem(MASTERY_STORAGE_KEY, JSON.stringify({ attempts: accepted }));
    } catch {
      // Blocked storage or a full quota: the in-memory ledger carries on.
    }
  };

  const fold = (attempt: Attempt): boolean => {
    // An attempt for an unknown skill is dropped rather than creating a skill that
    // does not exist in 04_SKILLS.
    if (!skills.some((skill) => skill.Skill_ID === attempt.skillId)) return false;
    if (seen.has(attempt.attemptId)) return false;
    seen.add(attempt.attemptId);
    states.set(attempt.skillId, recordAttempt(ensure(attempt.skillId, attempt.at), attempt));
    attemptCount += 1;
    accepted.push(attempt);
    return true;
  };

  const ensure = (skillId: string, at: string): MasteryState =>
    states.get(skillId) ?? createMasteryState(userId, skillId, at);

  const ledger: MasteryLedger = {
    /**
     * Fold one attempt in.
     *
     * Idempotent per `attemptId`: recording the same attempt twice counts once. That is what an
     * id means, and it matters concretely because the caller writes from inside a reducer, which
     * React StrictMode invokes twice in development. Without this, one answer would show as two
     * and the learner's evidence count would be wrong on screen.
     */
    record(attempt) {
      if (fold(attempt)) write();
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
      accepted = [];
      try {
        store?.removeItem(MASTERY_STORAGE_KEY);
      } catch {
        // Nothing stored, or storage blocked — the in-memory reset is what matters.
      }
    },
  };

  // Rebuild from what this browser kept, one attempt at a time through the same fold.
  for (const attempt of readStored(store)) fold(attempt);
  return ledger;
}

const browserStore = (): LedgerStore | undefined => {
  try {
    return typeof localStorage === 'undefined' ? undefined : localStorage;
  } catch {
    // Accessing localStorage itself throws when site data is blocked.
    return undefined;
  }
};

/** Process-wide ledger for the app shell, kept in this browser. Tests create their own ledgers. */
export const masteryLedger: MasteryLedger = createMasteryLedger('local-learner', browserStore());

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
