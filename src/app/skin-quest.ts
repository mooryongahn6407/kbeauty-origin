/**
 * Skin Quest state.
 *
 * Pure `(state, action)` like the four reducers before it (CLAUDE.md rule 16).
 *
 * It emits nothing, deliberately. `LearningEventType` is a closed list from the spec, and none
 * of its members honestly describes what happens here: a quest step has no correct answer, so
 * `question_answered` would misreport a self-observation as an attempt, and an attempt is the
 * only thing the mastery ledger accepts as evidence (rule 9). A journey through one's own
 * observations earns no mastery, and the instrumentation says so by staying silent.
 *
 * A level opens because the level before it was answered, not because a score crossed a
 * threshold. Nothing here adds up points, and there is no `unlockLevel` or `setLevel` action:
 * no source defines an amount or a threshold (OQ-X01).
 */
import {
  QUEST_LEVELS,
  TOTAL_QUEST_STEPS,
  concernsForLevel,
  questLevel,
  type QuestLevelId,
} from '@/content/skin-quest';

export type QuestPhase = 'welcome' | 'steps' | 'concerns' | 'record';

export interface SkinQuestState {
  readonly phase: QuestPhase;
  readonly levelIndex: number;
  readonly stepIndex: number;
  /** Step id → chosen option id. The reader's own answers, never interpreted. */
  readonly answers: Readonly<Record<string, string>>;
  /** Governed Concern_IDs the reader picked, in pick order. */
  readonly pickedConcernIds: readonly string[];
}

export type SkinQuestAction =
  | { readonly type: 'begin' }
  | { readonly type: 'answer'; readonly stepId: string; readonly optionId: string }
  | { readonly type: 'toggleConcern'; readonly concernId: string }
  | { readonly type: 'continue' }
  | { readonly type: 'back' }
  | { readonly type: 'restart' };

export const initialQuestState: SkinQuestState = {
  phase: 'welcome',
  levelIndex: 0,
  stepIndex: 0,
  answers: {},
  pickedConcernIds: [],
};

/**
 * How far along the journey is, as "answered so far / total". Counting answers rather than
 * scoring them is the whole point: the number goes up because the reader looked at something,
 * never because they were right.
 */
export const questProgress = (state: SkinQuestState): { done: number; total: number } => {
  const concernPicksDone = QUEST_LEVELS.filter(
    (_level, index) =>
      index < state.levelIndex || (index === state.levelIndex && state.phase === 'record'),
  ).length;
  return { done: Object.keys(state.answers).length + concernPicksDone, total: TOTAL_QUEST_STEPS };
};

export const isLevelOpen = (state: SkinQuestState, levelId: QuestLevelId): boolean =>
  QUEST_LEVELS.findIndex((level) => level.id === levelId) <= state.levelIndex;

/** Concerns picked so far that belong to one level, so the record can group them by level. */
export const pickedConcernIdsForLevel = (
  state: SkinQuestState,
  levelId: QuestLevelId,
): readonly string[] => {
  const ids = new Set(concernsForLevel(questLevel(levelId)).map((concern) => concern.Concern_ID));
  return state.pickedConcernIds.filter((id) => ids.has(id));
};

export function skinQuestReducer(state: SkinQuestState, action: SkinQuestAction): SkinQuestState {
  switch (action.type) {
    case 'begin':
      return { ...initialQuestState, phase: 'steps' };

    case 'answer': {
      if (state.phase !== 'steps') return state;
      const level = QUEST_LEVELS[state.levelIndex];
      const step = level?.steps[state.stepIndex];
      if (!step || step.id !== action.stepId) return state;

      const lastStepOfLevel = state.stepIndex >= level.steps.length - 1;
      return {
        ...state,
        answers: { ...state.answers, [action.stepId]: action.optionId },
        phase: lastStepOfLevel ? 'concerns' : 'steps',
        stepIndex: lastStepOfLevel ? state.stepIndex : state.stepIndex + 1,
      };
    }

    case 'toggleConcern': {
      if (state.phase !== 'concerns') return state;
      return {
        ...state,
        pickedConcernIds: state.pickedConcernIds.includes(action.concernId)
          ? state.pickedConcernIds.filter((id) => id !== action.concernId)
          : [...state.pickedConcernIds, action.concernId],
      };
    }

    case 'continue': {
      if (state.phase !== 'concerns') return state;
      if (state.levelIndex >= QUEST_LEVELS.length - 1) return { ...state, phase: 'record' };
      return { ...state, phase: 'steps', levelIndex: state.levelIndex + 1, stepIndex: 0 };
    }

    case 'back': {
      if (state.phase === 'concerns') {
        const level = QUEST_LEVELS[state.levelIndex];
        return { ...state, phase: 'steps', stepIndex: Math.max(0, (level?.steps.length ?? 1) - 1) };
      }
      if (state.phase === 'steps' && state.stepIndex > 0) {
        return { ...state, stepIndex: state.stepIndex - 1 };
      }
      if (state.phase === 'steps' && state.levelIndex > 0) {
        return { ...state, phase: 'concerns', levelIndex: state.levelIndex - 1 };
      }
      return state;
    }

    case 'restart':
      return initialQuestState;

    default:
      return state;
  }
}
