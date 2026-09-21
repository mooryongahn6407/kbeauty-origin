/**
 * Routine Order — QST-006 "Gentle Wash Challenge" (올바른 세안 순서 구성) and QST-007
 * "Routine Rescue" (과도한 루틴을 4단계로 단순화).
 *
 * This is the best-grounded exercise in the app, and the reason is one word in the data: the
 * ten rows of 12_ROUTINES are the only records in the Master Database with Status=Approved.
 * Everywhere else the app must say "this is a topic in review"; here it can say "this is the
 * order, and here is the record it came from".
 *
 * A round shuffles the steps of one approved sequence and asks for them back in order. Marking
 * compares the player's order against the record's own `Default_Sequence`, split on the arrow
 * the record itself uses. Nothing is added to the steps and none of them is explained, because
 * explaining why a step comes where it does would be a claim, and the approval covers the
 * sequence rather than a rationale for it.
 *
 * Pure `(state, action)` (rule 16). The shuffle is the caller's, as in the ingredient hunt.
 */
import { routines } from '@/knowledge/repository';
import type { Routine } from '@/domain/entities';

/** Routines whose Default_Sequence is an ordered list rather than a description. */
export const orderableRoutines = (): readonly Routine[] =>
  routines.filter(
    (routine) => routine.Status === 'Approved' && splitSequence(routine.Default_Sequence).length >= 2,
  );

/** Splits on the arrow the record uses. Presentation only — the words stay the record's own. */
export const splitSequence = (sequence: string): readonly string[] =>
  sequence
    .split(/[→➜>]/)
    .map((step) => step.trim())
    .filter(Boolean);

export interface OrderRound {
  readonly routineId: string;
  /** The steps, shuffled, as the player first sees them. */
  readonly shuffled: readonly string[];
  /** The record's own order. */
  readonly answer: readonly string[];
}

export interface OrderState {
  readonly round: OrderRound | null;
  /** Steps the player has placed, in the order they placed them. */
  readonly placed: readonly string[];
  readonly revealed: boolean;
  /** Routine_IDs the player has put in the right order at least once. */
  readonly solvedIds: readonly string[];
}

export type OrderAction =
  | { readonly type: 'start'; readonly round: OrderRound }
  | { readonly type: 'place'; readonly step: string }
  | { readonly type: 'unplace'; readonly step: string }
  | { readonly type: 'check' }
  | { readonly type: 'next'; readonly round: OrderRound };

export const initialOrderState: OrderState = {
  round: null,
  placed: [],
  revealed: false,
  solvedIds: [],
};

export function buildOrderRound(routine: Routine, pick: (bound: number) => number): OrderRound {
  const answer = splitSequence(routine.Default_Sequence);
  const shuffled = [...answer];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swap = pick(index + 1);
    const a = shuffled[index];
    const b = shuffled[swap];
    if (a && b) {
      shuffled[index] = b;
      shuffled[swap] = a;
    }
  }
  return { routineId: routine.Routine_ID, shuffled, answer };
}

/** True when every step is placed in the record's order. No partial score is computed. */
export const isSolved = (state: OrderState): boolean => {
  const round = state.round;
  if (!round || state.placed.length !== round.answer.length) return false;
  return state.placed.every((step, index) => step === round.answer[index]);
};

/** Which placed positions match the record — used to mark each row, not to make a score. */
export const placedMarks = (state: OrderState): readonly boolean[] => {
  const round = state.round;
  if (!round) return [];
  return state.placed.map((step, index) => step === round.answer[index]);
};

export function routineOrderReducer(state: OrderState, action: OrderAction): OrderState {
  switch (action.type) {
    case 'start':
      return { ...initialOrderState, round: action.round, solvedIds: state.solvedIds };

    case 'place': {
      if (state.revealed || !state.round) return state;
      if (state.placed.includes(action.step)) return state;
      if (!state.round.shuffled.includes(action.step)) return state;
      return { ...state, placed: [...state.placed, action.step] };
    }

    case 'unplace': {
      if (state.revealed) return state;
      if (!state.placed.includes(action.step)) return state;
      return { ...state, placed: state.placed.filter((step) => step !== action.step) };
    }

    case 'check': {
      if (state.revealed || !state.round) return state;
      if (state.placed.length !== state.round.answer.length) return state;
      const solved = state.placed.every((step, index) => step === state.round!.answer[index]);
      return {
        ...state,
        revealed: true,
        solvedIds: solved
          ? [...new Set([...state.solvedIds, state.round.routineId])]
          : state.solvedIds,
      };
    }

    case 'next':
      return { ...state, round: action.round, placed: [], revealed: false };

    default:
      return state;
  }
}
