/**
 * Routine Reflection Studio.
 *
 * What a "studio" can honestly be today. Every routine record in 09_ROUTINES is
 * Approved-but-unevidenced (OQ-R01), so the product must not tell anyone what their routine
 * should be, in what order, or how many steps it should have. What it *can* do is hand the
 * learner the question that makes their own routine answerable:
 *
 *     for each step you take — what is it for, and how would you notice if it worked?
 *
 * This reducer therefore records what the learner writes and reflects the tally back. It
 * makes no recommendation, ranks nothing, and never evaluates whether a step is appropriate.
 * The insight belongs to the learner; the app only holds the mirror.
 *
 * Safety (AI Constitution §7.2) still runs first: free text can carry a risk signal, and a
 * signal halts the tool rather than quietly filing the note.
 */
import type { Disclosure } from '@/domain/governance';
import type { EventSink } from '@/analytics/events';
import { classifyRisk } from '@/safety/safety-gate';
import {
  DISCLOSURE_NOT_MEDICAL,
  DISCLOSURE_PENDING_VERIFICATION,
} from '@/governance/publication-gate';

export interface RoutineStepEntry {
  readonly entryId: string;
  /** What the learner says they do. Their words, never matched against a product catalog. */
  readonly label: string;
  /** Why they do it, in their words. Null until they answer. */
  readonly purpose: string | null;
}

export type ReflectionPhase = 'LISTING' | 'PURPOSE' | 'REVIEW' | 'HALTED';

export interface ReflectionState {
  readonly userId: string;
  readonly phase: ReflectionPhase;
  readonly entries: readonly RoutineStepEntry[];
  readonly disclosures: readonly Disclosure[];
  readonly safetyHaltMessageKey: string | null;
}

export type ReflectionAction =
  | { readonly type: 'ADD_STEP'; readonly label: string }
  | { readonly type: 'REMOVE_STEP'; readonly entryId: string }
  | { readonly type: 'SET_PURPOSE'; readonly entryId: string; readonly purpose: string }
  | { readonly type: 'GO_TO_PURPOSE' }
  | { readonly type: 'COMPLETE_REVIEW'; readonly at: string }
  | { readonly type: 'RESET' };

/** Upper bound on listed steps, to keep the exercise a reflection rather than an inventory. */
export const MAX_STEPS = 12;

export function createReflection(userId: string): ReflectionState {
  return {
    userId,
    phase: 'LISTING',
    entries: [],
    // The pending-verification disclosure is present because the governed routine records
    // shown alongside this tool have not completed evidence review.
    disclosures: [DISCLOSURE_PENDING_VERIFICATION, DISCLOSURE_NOT_MEDICAL],
    safetyHaltMessageKey: null,
  };
}

export interface ReflectionSummary {
  readonly total: number;
  readonly withPurpose: number;
  readonly withoutPurpose: number;
}

/**
 * Count what the learner could and could not account for.
 *
 * Deliberately just a count. There is no score, no grade and no "ideal" number of steps to
 * compare against, because the product has no approved basis for one.
 */
export function summariseReflection(state: ReflectionState): ReflectionSummary {
  const withPurpose = state.entries.filter(
    (entry) => entry.purpose !== null && entry.purpose.trim() !== '',
  ).length;
  return {
    total: state.entries.length,
    withPurpose,
    withoutPurpose: state.entries.length - withPurpose,
  };
}

/** Halt the tool and route to safety guidance. Shared by every text-accepting action. */
function halt(
  state: ReflectionState,
  text: string,
  at: string,
  sink?: EventSink,
): ReflectionState | null {
  const safety = classifyRisk(text);
  if (!safety.escalate) return null;

  sink?.record({
    type: 'safety_intervention',
    userId: state.userId,
    at,
    detail: { tier: safety.tier, signals: safety.matchedSignalIds.join(',') , surface: 'routine_reflection' },
  });

  return {
    ...state,
    phase: 'HALTED',
    safetyHaltMessageKey: safety.messageKey,
    disclosures: [...state.disclosures, ...safety.disclosures],
  };
}

const AT_ZERO = new Date(0).toISOString();

export function reflectionReducer(
  state: ReflectionState,
  action: ReflectionAction,
  sink?: EventSink,
): ReflectionState {
  if (state.phase === 'HALTED' && action.type !== 'RESET') return state;

  switch (action.type) {
    case 'ADD_STEP': {
      const label = action.label.trim();
      if (state.phase !== 'LISTING' || label === '' || state.entries.length >= MAX_STEPS) {
        return state;
      }
      const halted = halt(state, label, AT_ZERO, sink);
      if (halted) return halted;

      return {
        ...state,
        entries: [
          ...state.entries,
          { entryId: `step-${state.entries.length + 1}`, label, purpose: null },
        ],
      };
    }

    case 'REMOVE_STEP':
      if (state.phase !== 'LISTING') return state;
      return {
        ...state,
        entries: state.entries.filter((entry) => entry.entryId !== action.entryId),
      };

    case 'GO_TO_PURPOSE':
      if (state.phase !== 'LISTING' || state.entries.length === 0) return state;
      return { ...state, phase: 'PURPOSE' };

    case 'SET_PURPOSE': {
      if (state.phase !== 'PURPOSE') return state;
      const halted = halt(state, action.purpose, AT_ZERO, sink);
      if (halted) return halted;

      return {
        ...state,
        entries: state.entries.map((entry) =>
          entry.entryId === action.entryId ? { ...entry, purpose: action.purpose } : entry,
        ),
      };
    }

    case 'COMPLETE_REVIEW': {
      if (state.phase !== 'PURPOSE') return state;
      sink?.record({
        type: 'reflection_completed',
        userId: state.userId,
        at: action.at,
        detail: {
          surface: 'routine_reflection',
          steps: state.entries.length,
          withPurpose: summariseReflection(state).withPurpose,
        },
      });
      return { ...state, phase: 'REVIEW' };
    }

    case 'RESET':
      return createReflection(state.userId);

    default:
      return state;
  }
}
