/**
 * Label Detective — the label sorting exercise.
 *
 * Source: QST-013 "Label Detective", whose Win_Condition is literally
 * "claim/ingredient/use instructions 분리" — separation, not evaluation. Core node
 * KN-D11-07-001 "라벨에서 핵심 정보 찾기", supporting KN-D11-07-002 "사용법·주의사항 읽기",
 * primary skill SK06 Evaluate Claims.
 *
 * Why this world can carry a real exercise while the others cannot: sorting a label is a
 * categorisation of text. The correct answer is always *which part of a label a sentence is*,
 * never whether the sentence is true or whether an ingredient does anything. No scientific
 * claim is asserted or required.
 *
 * The specimens are explicitly fictional and carry no brand, because 16_PRODUCTS is
 * Template-only (SR-011) and showing a real label would need product data that does not exist.
 *
 * There is no free-text input here, so unlike the reflection and exposure surfaces there is no
 * channel through which a risk signal could arrive; the safety gate has nothing to read. The
 * lesson's safety-boundary atom still states the medical boundary.
 */
import type { Disclosure } from '@/domain/governance';
import type { EventSink } from '@/analytics/events';
import {
  DISCLOSURE_NOT_MEDICAL,
  DISCLOSURE_PENDING_VERIFICATION,
} from '@/governance/publication-gate';
import specimenData from '../../data/authored/label-specimens.json';

/** The parts of a label the learner sorts into. */
export const LABEL_BUCKETS = ['CLAIM', 'INGREDIENTS', 'HOW_TO_USE', 'CAUTION'] as const;
export type LabelBucket = (typeof LABEL_BUCKETS)[number];

export interface LabelFragment {
  readonly fragmentId: string;
  readonly kind: LabelBucket;
  readonly text: Readonly<Record<string, string>>;
  /** Why it belongs where it belongs. About placement, never about efficacy. */
  readonly why: Readonly<Record<string, string>>;
}

export interface LabelSpecimen {
  readonly specimenId: string;
  /** Always true. A specimen that claimed to be real would be fabricated product data. */
  readonly isFictional: boolean;
  readonly fictionNote: Readonly<Record<string, string>>;
  readonly context: Readonly<Record<string, string>>;
  readonly identity: Readonly<Record<string, string>>;
  readonly fragments: readonly LabelFragment[];
}

export const labelSpecimens = specimenData.specimens as readonly LabelSpecimen[];

export const findSpecimen = (specimenId: string): LabelSpecimen | undefined =>
  labelSpecimens.find((specimen) => specimen.specimenId === specimenId);

export type SorterPhase = 'SORTING' | 'CHECKED' | 'COMPLETE';

export interface SorterState {
  readonly userId: string;
  readonly specimenId: string;
  readonly phase: SorterPhase;
  /** Where the learner has put each fragment. Absent means not yet placed. */
  readonly placements: Readonly<Record<string, LabelBucket>>;
  /** Fragments the learner got wrong on the last check, so feedback can be specific. */
  readonly incorrectFragmentIds: readonly string[];
  /** How many times the learner has asked to be checked. Drives the tone of the feedback. */
  readonly checkCount: number;
  readonly disclosures: readonly Disclosure[];
}

export type SorterAction =
  | { readonly type: 'PLACE'; readonly fragmentId: string; readonly bucket: LabelBucket }
  | { readonly type: 'UNPLACE'; readonly fragmentId: string }
  | { readonly type: 'CHECK'; readonly at: string }
  | { readonly type: 'CONTINUE_SORTING' }
  | { readonly type: 'COMPLETE'; readonly at: string }
  | { readonly type: 'RESET' };

export function createSorter(userId: string, specimenId: string): SorterState {
  const specimen = findSpecimen(specimenId);
  if (!specimen) throw new Error(`Label specimen ${specimenId} not found`);
  return {
    userId,
    specimenId,
    phase: 'SORTING',
    placements: {},
    incorrectFragmentIds: [],
    checkCount: 0,
    disclosures: [DISCLOSURE_PENDING_VERIFICATION, DISCLOSURE_NOT_MEDICAL],
  };
}

export interface SorterResult {
  readonly total: number;
  readonly placed: number;
  readonly correct: number;
  readonly incorrect: number;
  readonly allPlaced: boolean;
  readonly allCorrect: boolean;
}

/** Score the current placements against the specimen. Pure; used by the reducer and the UI. */
export function evaluateSorter(state: SorterState): SorterResult {
  const specimen = findSpecimen(state.specimenId);
  const fragments = specimen?.fragments ?? [];
  let correct = 0;
  let placed = 0;

  for (const fragment of fragments) {
    const placement = state.placements[fragment.fragmentId];
    if (placement === undefined) continue;
    placed += 1;
    if (placement === fragment.kind) correct += 1;
  }

  return {
    total: fragments.length,
    placed,
    correct,
    incorrect: placed - correct,
    allPlaced: placed === fragments.length && fragments.length > 0,
    allCorrect: correct === fragments.length && fragments.length > 0,
  };
}

/** Fragments currently in the wrong bucket, with the explanation for each. */
export function misplacedFragments(state: SorterState): readonly LabelFragment[] {
  const specimen = findSpecimen(state.specimenId);
  return (specimen?.fragments ?? []).filter((fragment) => {
    const placement = state.placements[fragment.fragmentId];
    return placement !== undefined && placement !== fragment.kind;
  });
}

export function sorterReducer(
  state: SorterState,
  action: SorterAction,
  sink?: EventSink,
): SorterState {
  switch (action.type) {
    case 'PLACE': {
      if (state.phase === 'COMPLETE') return state;
      const specimen = findSpecimen(state.specimenId);
      if (!specimen?.fragments.some((f) => f.fragmentId === action.fragmentId)) return state;
      return {
        ...state,
        // Moving a fragment after a check returns to sorting, so stale marks never linger.
        phase: 'SORTING',
        placements: { ...state.placements, [action.fragmentId]: action.bucket },
        incorrectFragmentIds: state.incorrectFragmentIds.filter((id) => id !== action.fragmentId),
      };
    }

    case 'UNPLACE': {
      if (state.phase === 'COMPLETE') return state;
      const { [action.fragmentId]: _removed, ...rest } = state.placements;
      return {
        ...state,
        phase: 'SORTING',
        placements: rest,
        incorrectFragmentIds: state.incorrectFragmentIds.filter((id) => id !== action.fragmentId),
      };
    }

    case 'CHECK': {
      if (state.phase !== 'SORTING') return state;
      const result = evaluateSorter(state);
      // Checking before everything is placed would mark work the learner has not done yet.
      if (!result.allPlaced) return state;

      const incorrect = misplacedFragments(state).map((fragment) => fragment.fragmentId);
      sink?.record({
        type: 'question_answered',
        userId: state.userId,
        at: action.at,
        detail: {
          surface: 'label_sorter',
          specimenId: state.specimenId,
          correct: result.correct,
          total: result.total,
          attempt: state.checkCount + 1,
        },
      });

      return {
        ...state,
        phase: 'CHECKED',
        incorrectFragmentIds: incorrect,
        checkCount: state.checkCount + 1,
      };
    }

    case 'CONTINUE_SORTING':
      return state.phase === 'CHECKED' ? { ...state, phase: 'SORTING' } : state;

    case 'COMPLETE': {
      if (state.phase !== 'CHECKED' || !evaluateSorter(state).allCorrect) return state;
      sink?.record({
        type: 'lesson_completed',
        userId: state.userId,
        at: action.at,
        detail: { surface: 'label_sorter', specimenId: state.specimenId },
      });
      return { ...state, phase: 'COMPLETE' };
    }

    case 'RESET':
      return createSorter(state.userId, state.specimenId);

    default:
      return state;
  }
}
