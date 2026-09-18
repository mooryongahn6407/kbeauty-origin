/**
 * First end-to-end learning slice — the application use case.
 *
 * Flow required by the handoff command:
 *   My Skin -> governed Knowledge Node -> micro lesson -> question -> hint -> answer
 *           -> feedback -> reflection -> mastery evidence record
 *
 * Implemented as a pure reducer so the transitions are real state changes that tests can
 * drive without a DOM. The UI renders this state; it does not own it.
 *
 * Grounding: the slice runs on Quest QST-001 "Mirror Detective" (World = My Skin), whose Core
 * node in 12_QUEST_NODE_MAP is KN-D01-07-001 (Skin Observation) with primary Skill SK01
 * Observe. Both IDs come from the Master Database and are used unchanged.
 */
import type { Attempt, LessonPhase, MasteryState } from '@/domain/learning';
import type { Disclosure } from '@/domain/governance';
import type { LearningActivity } from '@/content/types';
import { activitiesForNode, atomsForNode, findActivity, resolveVariant } from '@/content/authored-content';
import { evaluatePublication } from '@/governance/publication-gate';
import { findNode, findQuest, findSkill, nodeLinksForQuest } from '@/knowledge/repository';
import { createMasteryState, recordAttempt } from '@/mastery/mastery-engine';
import { classifyRisk } from '@/safety/safety-gate';
import { nextHintLevel } from '@/tutor/tutor-engine';
import type { EventSink } from '@/analytics/events';

/** Master Database IDs the slice is grounded in. Not configurable by the UI. */
export const SLICE_QUEST_ID = 'QST-001';
export const SLICE_NODE_ID = 'KN-D01-07-001';
export const SLICE_SKILL_ID = 'SK01';

/** Highest hint index available; H4 is explicit teaching (AI Constitution §5.1). */
const MAX_HINT_STEPS = 3;

export interface SessionState {
  readonly userId: string;
  readonly locale: string;
  readonly phase: LessonPhase;
  readonly questId: string;
  readonly nodeId: string;
  readonly skillId: string;
  readonly activityId: string;
  /** Hints revealed for the CURRENT activity. Resets when a new activity starts. */
  readonly hintsUsed: number;
  readonly failedAttempts: number;
  readonly selectedOptionIndex: number | null;
  readonly lastAnswerCorrect: boolean | null;
  readonly reflection: string | null;
  readonly mastery: MasteryState;
  readonly attempts: readonly Attempt[];
  readonly disclosures: readonly Disclosure[];
  /** Set when a safety signal halted the flow. */
  readonly safetyHaltMessageKey: string | null;
  /** True when the rendered content fell back to the base locale. */
  readonly usedFallbackLocale: boolean;
}

export type SessionAction =
  | { readonly type: 'START_LESSON' }
  | { readonly type: 'LESSON_READ' }
  | { readonly type: 'THINK_DONE' }
  | { readonly type: 'REQUEST_HINT' }
  | { readonly type: 'SELECT_OPTION'; readonly optionIndex: number }
  | { readonly type: 'SUBMIT_ANSWER'; readonly at: string }
  | { readonly type: 'CONTINUE_TO_REFLECT' }
  | { readonly type: 'SUBMIT_REFLECTION'; readonly text: string; readonly at: string }
  | { readonly type: 'CONTINUE_TO_MASTERY' }
  | { readonly type: 'START_ACTIVITY'; readonly activityId: string }
  | { readonly type: 'COMPLETE' }
  | { readonly type: 'RESTART'; readonly at: string };

export interface SliceGrounding {
  readonly questName: string;
  readonly nodeTitle: string;
  readonly learningObjective: string;
  readonly skillName: string;
  readonly nodeStatus: string;
  readonly nodeEvidenceStatus: string;
  readonly nodeVersion: string;
  readonly nodeSourceId: string;
  readonly mayStateAsFact: boolean;
  readonly disclosures: readonly Disclosure[];
}

/**
 * Resolve the governed records behind the slice.
 * Throws if a source ID is missing, because silently substituting content would defeat the
 * grounding contract — a broken reference must be visible, not papered over.
 */
export function loadSliceGrounding(): SliceGrounding {
  const quest = findQuest(SLICE_QUEST_ID);
  const node = findNode(SLICE_NODE_ID);
  const skill = findSkill(SLICE_SKILL_ID);
  if (!quest) throw new Error(`Quest ${SLICE_QUEST_ID} not found in the Master Database`);
  if (!node) throw new Error(`Knowledge node ${SLICE_NODE_ID} not found in the Master Database`);
  if (!skill) throw new Error(`Skill ${SLICE_SKILL_ID} not found in the Master Database`);

  const coreLink = nodeLinksForQuest(SLICE_QUEST_ID).find((link) => link.Role === 'Core');
  if (coreLink?.Node_ID !== SLICE_NODE_ID) {
    throw new Error(
      `Quest ${SLICE_QUEST_ID} core node is ${coreLink?.Node_ID ?? 'missing'}, expected ${SLICE_NODE_ID}`,
    );
  }

  const publication = evaluatePublication(node);
  return {
    questName: quest.Quest_Name,
    nodeTitle: node.Node_Title,
    learningObjective: node.Learning_Objective,
    skillName: skill.Skill_Name,
    nodeStatus: node.Status,
    nodeEvidenceStatus: node.Evidence_Status || '—',
    nodeVersion: node.Version,
    nodeSourceId: node.Source_ID || '—',
    mayStateAsFact: publication.mayStateAsFact,
    disclosures: publication.disclosures,
  };
}

/** Activities for the slice, in authored order: the practice question first, then transfer. */
export const sliceActivities = (): readonly LearningActivity[] => activitiesForNode(SLICE_NODE_ID);

export const sliceAtoms = () => atomsForNode(SLICE_NODE_ID);

export function createSession(userId: string, locale: string, at: string): SessionState {
  const activities = sliceActivities();
  const first = activities[0];
  if (!first) throw new Error(`No authored activity exists for node ${SLICE_NODE_ID}`);

  const grounding = loadSliceGrounding();

  return {
    userId,
    locale,
    phase: 'LESSON',
    questId: SLICE_QUEST_ID,
    nodeId: SLICE_NODE_ID,
    skillId: SLICE_SKILL_ID,
    activityId: first.activityId,
    hintsUsed: 0,
    failedAttempts: 0,
    selectedOptionIndex: null,
    lastAnswerCorrect: null,
    reflection: null,
    mastery: createMasteryState(userId, SLICE_SKILL_ID, at),
    attempts: [],
    disclosures: grounding.disclosures,
    safetyHaltMessageKey: null,
    usedFallbackLocale: false,
  };
}

/**
 * Advance the session.
 *
 * Every transition is explicit; an action that does not apply to the current phase is a
 * no-op rather than an error, so the UI cannot drive the state machine into a bad phase.
 */
export function sessionReducer(
  state: SessionState,
  action: SessionAction,
  sink?: EventSink,
): SessionState {
  const emit = (event: Parameters<EventSink['record']>[0]) => sink?.record(event);

  switch (action.type) {
    case 'START_LESSON': {
      if (state.phase !== 'LESSON') return state;
      emit({
        type: 'lesson_started',
        userId: state.userId,
        at: new Date(0).toISOString(),
        nodeId: state.nodeId,
        skillId: state.skillId,
        locale: state.locale,
      });
      return state;
    }

    case 'LESSON_READ':
      return state.phase === 'LESSON' ? { ...state, phase: 'ASK' } : state;

    // THINK is a real step: the learner is asked to commit to thinking before options act.
    // AI Constitution C03 "User agency before answer delivery".
    case 'THINK_DONE':
      return state.phase === 'ASK' ? { ...state, phase: 'THINK' } : state;

    case 'REQUEST_HINT': {
      if (state.phase !== 'THINK' && state.phase !== 'HINT') return state;
      if (state.hintsUsed >= MAX_HINT_STEPS) return { ...state, phase: 'HINT' };
      emit({
        type: 'hint_used',
        userId: state.userId,
        at: new Date(0).toISOString(),
        nodeId: state.nodeId,
        skillId: state.skillId,
        detail: { hintLevel: nextHintLevel(state.hintsUsed + 1, state.failedAttempts) },
      });
      return { ...state, phase: 'HINT', hintsUsed: state.hintsUsed + 1 };
    }

    case 'SELECT_OPTION': {
      const selectable = state.phase === 'THINK' || state.phase === 'HINT' || state.phase === 'TRY';
      if (!selectable) return state;
      return { ...state, phase: 'TRY', selectedOptionIndex: action.optionIndex };
    }

    case 'SUBMIT_ANSWER': {
      if (state.phase !== 'TRY' || state.selectedOptionIndex === null) return state;
      const activity = findActivity(state.activityId);
      if (!activity) return state;

      const correct = state.selectedOptionIndex === activity.correctOptionIndex;
      const attempt: Attempt = {
        attemptId: `${state.activityId}#${state.attempts.length + 1}`,
        userId: state.userId,
        nodeId: state.nodeId,
        skillId: state.skillId,
        activityId: state.activityId,
        correct,
        hintsUsed: state.hintsUsed,
        isTransfer: activity.isTransfer,
        isRetention: false,
        at: action.at,
      };

      emit({
        type: 'question_answered',
        userId: state.userId,
        at: action.at,
        nodeId: state.nodeId,
        skillId: state.skillId,
        detail: { correct, hintsUsed: state.hintsUsed, activityId: state.activityId },
      });
      if (activity.isTransfer) {
        emit({
          type: 'transfer_attempted',
          userId: state.userId,
          at: action.at,
          nodeId: state.nodeId,
          skillId: state.skillId,
        });
      }

      const mastery = recordAttempt(state.mastery, attempt);
      emit({
        type: 'mastery_dimension_updated',
        userId: state.userId,
        at: action.at,
        skillId: state.skillId,
        detail: { state: mastery.state },
      });

      return {
        ...state,
        phase: 'FEEDBACK',
        lastAnswerCorrect: correct,
        failedAttempts: correct ? state.failedAttempts : state.failedAttempts + 1,
        attempts: [...state.attempts, attempt],
        mastery,
      };
    }

    case 'CONTINUE_TO_REFLECT': {
      if (state.phase !== 'FEEDBACK') return state;
      // An incorrect answer returns to the hint ladder rather than moving on.
      if (state.lastAnswerCorrect === false) {
        return { ...state, phase: 'HINT', selectedOptionIndex: null };
      }
      return { ...state, phase: 'REFLECT' };
    }

    case 'SUBMIT_REFLECTION': {
      if (state.phase !== 'REFLECT') return state;

      // Safety runs before the reflection is stored: free text can carry a risk signal,
      // and safety takes priority over learning flow (AI Constitution §7.2).
      const safety = classifyRisk(action.text);
      if (safety.escalate) {
        emit({
          type: 'safety_intervention',
          userId: state.userId,
          at: action.at,
          nodeId: state.nodeId,
          detail: { tier: safety.tier, signals: safety.matchedSignalIds.join(',') },
        });
        return {
          ...state,
          phase: 'COMPLETE',
          reflection: action.text,
          safetyHaltMessageKey: safety.messageKey,
          disclosures: [...state.disclosures, ...safety.disclosures],
        };
      }

      emit({
        type: 'reflection_completed',
        userId: state.userId,
        at: action.at,
        nodeId: state.nodeId,
        skillId: state.skillId,
      });
      return { ...state, phase: 'MASTER', reflection: action.text };
    }

    case 'CONTINUE_TO_MASTERY': {
      if (state.phase !== 'MASTER') return state;
      // Reaching the mastery panel is the end of the lesson on the normal path.
      emit({
        type: 'lesson_completed',
        userId: state.userId,
        at: new Date(0).toISOString(),
        nodeId: state.nodeId,
        skillId: state.skillId,
      });
      return { ...state, phase: 'COMPLETE' };
    }

    case 'START_ACTIVITY': {
      const activity = findActivity(action.activityId);
      if (!activity || activity.nodeId !== state.nodeId) return state;
      return {
        ...state,
        phase: 'LESSON',
        activityId: action.activityId,
        hintsUsed: 0,
        failedAttempts: 0,
        selectedOptionIndex: null,
        lastAnswerCorrect: null,
        reflection: null,
      };
    }

    case 'COMPLETE': {
      if (state.phase === 'COMPLETE') return state;
      emit({
        type: 'lesson_completed',
        userId: state.userId,
        at: new Date(0).toISOString(),
        nodeId: state.nodeId,
        skillId: state.skillId,
      });
      return { ...state, phase: 'COMPLETE' };
    }

    case 'RESTART':
      return createSession(state.userId, state.locale, action.at);

    default:
      return state;
  }
}

/** Resolve the current activity's text for the session locale, reporting any fallback. */
export function currentActivityText(state: SessionState) {
  const activity = findActivity(state.activityId);
  if (!activity) return null;
  const resolved = resolveVariant(activity.variants, state.locale);
  if (!resolved) return null;
  return {
    activity,
    text: resolved.variant.text,
    usedFallback: resolved.usedFallback,
    options: [0, 1, 2]
      .map((index) => resolved.variant.text[`option${index}`])
      .filter((option): option is string => Boolean(option)),
  };
}
