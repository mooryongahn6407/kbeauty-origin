/**
 * Mastery engine.
 *
 * Source: Master DB 19_MASTERY_RULES (M01-M06) and AI Tutor Constitution §6.
 *
 * The operational rules are read from the governed source rows rather than hard-coded
 * prose, and the thresholds they state are held in one table so that re-approving a rule
 * changes behaviour in a single place.
 *
 * Hard requirement from the handoff command: "A single correct answer must never create
 * mastery." `isMastered` requires all four dimensions to be satisfied independently, and
 * each dimension requires a minimum number of attempts.
 */
import type {
  Attempt,
  LearnerState,
  MasteryDimension,
  MasteryDimensionState,
  MasteryState,
} from '@/domain/learning';
import { masteryRules } from '@/knowledge/repository';

/**
 * Thresholds transcribed from 19_MASTERY_RULES `Operational_Rule`:
 *   M01 Accuracy      - "≥ 80% within skill practice"
 *   M02 Independence  - "≥ 80% with no more than 1 hint"
 *   M03 Transfer      - "≥ 70% on unseen variation"
 *   M04 Retention     - "Pass after scheduled review"
 *
 * `minAttempts` is an engineering addition (DECISION, not from source): the source states a
 * ratio but no sample size, and a ratio over one attempt would let a single correct answer
 * create mastery, which the handoff command forbids. SR-013 records that the mastery
 * protocol still needs an approved sampling/scheduling specification.
 */
export const MASTERY_THRESHOLDS: Readonly<
  Record<MasteryDimension, { readonly ratio: number; readonly minAttempts: number; readonly ruleId: string }>
> = {
  accuracy: { ratio: 0.8, minAttempts: 5, ruleId: 'M01' },
  independence: { ratio: 0.8, minAttempts: 5, ruleId: 'M02' },
  transfer: { ratio: 0.7, minAttempts: 3, ruleId: 'M03' },
  retention: { ratio: 1.0, minAttempts: 1, ruleId: 'M04' },
};

/** Maximum hints allowed for an attempt to count as independent (M02: "no more than 1 hint"). */
export const MAX_HINTS_FOR_INDEPENDENCE = 1;

const EMPTY_DIMENSION: MasteryDimensionState = { attempts: 0, successes: 0, satisfied: false };

export function createMasteryState(userId: string, skillId: string, at: string): MasteryState {
  return {
    userId,
    skillId,
    dimensions: {
      accuracy: EMPTY_DIMENSION,
      independence: EMPTY_DIMENSION,
      transfer: EMPTY_DIMENSION,
      retention: EMPTY_DIMENSION,
    },
    state: 'NotAssessed',
    nodeEvidence: [],
    updatedAt: at,
  };
}

const satisfies = (dimension: MasteryDimension, attempts: number, successes: number): boolean => {
  const threshold = MASTERY_THRESHOLDS[dimension];
  if (attempts < threshold.minAttempts) return false;
  return successes / attempts >= threshold.ratio;
};

const advance = (
  current: MasteryDimensionState,
  counted: boolean,
  success: boolean,
  dimension: MasteryDimension,
): MasteryDimensionState => {
  if (!counted) return current;
  const attempts = current.attempts + 1;
  const successes = current.successes + (success ? 1 : 0);
  return { attempts, successes, satisfied: satisfies(dimension, attempts, successes) };
};

/** Every dimension satisfied — the M05 "Mastered" rule. */
export function isMastered(state: MasteryState): boolean {
  return (Object.keys(MASTERY_THRESHOLDS) as MasteryDimension[]).every(
    (dimension) => state.dimensions[dimension].satisfied,
  );
}

function deriveLearnerState(state: MasteryState, previous: LearnerState): LearnerState {
  if (isMastered(state)) return 'Mastered';

  const satisfiedCount = (Object.keys(MASTERY_THRESHOLDS) as MasteryDimension[]).filter(
    (dimension) => state.dimensions[dimension].satisfied,
  ).length;

  // M06 Reopen: performance dropping after mastery returns the learner to Developing.
  if (previous === 'Mastered') return 'Developing';

  if (satisfiedCount >= 2) return 'Secure';
  if (state.dimensions.accuracy.attempts === 0) return 'NotAssessed';
  if (state.dimensions.accuracy.successes === 0) return 'Emerging';
  return 'Developing';
}

/**
 * Fold one attempt into a skill's mastery state.
 *
 * Which dimensions an attempt feeds:
 *   accuracy     - every attempt.
 *   independence - every attempt; counts as a success only when hints <= 1 AND correct.
 *   transfer     - only attempts flagged `isTransfer`.
 *   retention    - only attempts flagged `isRetention`.
 */
export function recordAttempt(state: MasteryState, attempt: Attempt): MasteryState {
  const dimensions = {
    accuracy: advance(state.dimensions.accuracy, true, attempt.correct, 'accuracy'),
    independence: advance(
      state.dimensions.independence,
      true,
      attempt.correct && attempt.hintsUsed <= MAX_HINTS_FOR_INDEPENDENCE,
      'independence',
    ),
    transfer: advance(state.dimensions.transfer, attempt.isTransfer, attempt.correct, 'transfer'),
    retention: advance(state.dimensions.retention, attempt.isRetention, attempt.correct, 'retention'),
  };

  const nodeEvidence = state.nodeEvidence.includes(attempt.nodeId)
    ? state.nodeEvidence
    : [...state.nodeEvidence, attempt.nodeId];

  const next: MasteryState = {
    ...state,
    dimensions,
    nodeEvidence,
    state: state.state,
    updatedAt: attempt.at,
  };

  return { ...next, state: deriveLearnerState(next, state.state) };
}

/** The governed mastery rule rows, for display on progress screens. */
export const governedMasteryRules = masteryRules;
