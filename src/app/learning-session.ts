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
import type { ClaimClass, LearningActivity } from '@/content/types';
import { evaluateLessonAvailability, type LessonAvailability } from '@/governance/learning-availability';
import { activitiesForNode, atomsForNode, findActivity, resolveVariant } from '@/content/authored-content';
import { evaluatePublication } from '@/governance/publication-gate';
import { findNode, findQuest, findSkill, nodeLinksForQuest } from '@/knowledge/repository';
import { createMasteryState, recordAttempt } from '@/mastery/mastery-engine';
import { classifyRisk } from '@/safety/safety-gate';
import { nextHintLevel } from '@/tutor/tutor-engine';
import type { EventSink } from '@/analytics/events';
import type { LearningEvent } from '@/domain/learning';
import { INITIAL_TRANSITION, drainEvents, type Emit, type EmittingState } from './transition';
import { masteryLedger, type MasteryLedger } from '@/mastery/mastery-ledger';

/**
 * A lesson plan names the governed records a learning session stands on.
 *
 * Plans are declared here rather than assembled by the UI, so a screen cannot point a session
 * at an arbitrary node or silently widen what a lesson claims.
 */
export interface LessonPlan {
  readonly planId: string;
  /** Governing quest from 11_QUESTS, or null when the lesson is grounded directly in a node. */
  readonly questId: string | null;
  readonly nodeId: string;
  readonly skillId: string;
  /** What kind of claim this lesson makes; drives the availability gate. */
  readonly claimClass: ClaimClass;
}

/**
 * First slice — My Skin.
 * Quest QST-001 "Mirror Detective" (World: My Skin), core node KN-D01-07-001 per
 * 12_QUEST_NODE_MAP, primary skill SK01 Observe per 05_NODE_SKILL_MAP.
 */
export const MIRROR_DETECTIVE_PLAN: LessonPlan = {
  planId: 'mirror-detective',
  questId: 'QST-001',
  nodeId: 'KN-D01-07-001',
  skillId: 'SK01',
  claimClass: 'PEDAGOGICAL',
};

/**
 * Ingredient Garden — ingredient literacy.
 *
 * Grounded in KN-D11-02-001 "단일 성분 halo effect" (D11 Beauty Media Literacy, strand 11.2
 * Ingredient Halo) with primary skill SK06 Evaluate Claims per 05_NODE_SKILL_MAP.
 *
 * No quest in 12_QUEST_NODE_MAP references the D11-02 nodes, so `questId` is null rather than
 * being attached to a quest that does not claim it. The lesson teaches a reasoning skill — not
 * to judge a product by one ingredient — so it asserts nothing about what any ingredient does
 * and can open while 06_INGREDIENTS is still unverified.
 */
export const INGREDIENT_HALO_PLAN: LessonPlan = {
  planId: 'ingredient-halo',
  questId: null,
  nodeId: 'KN-D11-02-001',
  skillId: 'SK06',
  claimClass: 'PEDAGOGICAL',
};

/**
 * Routine Studio — routine reasoning.
 *
 * Grounded in KN-D08-03-001 "제품 역할로 순서 판단하기" (D08 Routine & Layering, strand 08.3
 * Order Logic) with primary skill SK05 Sequence per 05_NODE_SKILL_MAP.
 *
 * QST-007 "Routine Rescue" is the Routine Studio quest, but it is not used here: its
 * Win_Condition asks for a 4-step routine while its Core node teaches a 3-step one (OQ-R02),
 * so it cannot be authored yet. The lesson teaches the reasoning that precedes any ordering
 * judgement — you cannot evaluate a step until you can say what it is for — and so asserts
 * nothing about what a routine should contain or in what order.
 */
export const ROUTINE_PURPOSE_PLAN: LessonPlan = {
  planId: 'routine-purpose',
  questId: null,
  nodeId: 'KN-D08-03-001',
  skillId: 'SK05',
  claimClass: 'PEDAGOGICAL',
};

/**
 * Sun Protection — exposure observation.
 *
 * Grounded in KN-D04-06-002 "일상 속 선케어 점검" (D04 Sun & Environmental Protection, strand
 * 04.6 Daily Protection Planning) with primary skill SK07 Decide per 05_NODE_SKILL_MAP.
 *
 * QST-004 and QST-005 are the Sun Observatory quests, but neither is used here: both turn on
 * UV and sunscreen facts, and the evidence position for D04 is the weakest in the corpus —
 * every D04 node cites one general page and the registry holds no sun source at all (OQ-E02).
 * This lesson teaches only the separation between what a person can establish about their own
 * day and what needs evidence from elsewhere.
 */
export const SUN_EXPOSURE_PLAN: LessonPlan = {
  planId: 'sun-exposure-observation',
  questId: null,
  nodeId: 'KN-D04-06-002',
  skillId: 'SK07',
  claimClass: 'PEDAGOGICAL',
};

/**
 * Label Detective — label reading.
 *
 * Grounded in KN-D11-07-001 "라벨에서 핵심 정보 찾기" (D11 Beauty Media Literacy, strand 11.7
 * Label Detective) with primary skill SK06 Evaluate Claims per 05_NODE_SKILL_MAP.
 *
 * Unlike the other worlds this one *does* claim its quest: QST-013's Core node is exactly this
 * node, its Win_Condition is "claim/ingredient/use instructions 분리", and none of its three
 * mapped nodes is missing. Separating the parts of a label is a categorisation of text, so the
 * lesson asserts nothing about efficacy and can open on Draft records.
 */
export const LABEL_READING_PLAN: LessonPlan = {
  planId: 'label-reading',
  questId: 'QST-013',
  nodeId: 'KN-D11-07-001',
  skillId: 'SK06',
  claimClass: 'PEDAGOGICAL',
};

export const LESSON_PLANS: readonly LessonPlan[] = [
  MIRROR_DETECTIVE_PLAN,
  INGREDIENT_HALO_PLAN,
  ROUTINE_PURPOSE_PLAN,
  SUN_EXPOSURE_PLAN,
  LABEL_READING_PLAN,
];

export const findLessonPlan = (planId: string): LessonPlan | undefined =>
  LESSON_PLANS.find((plan) => plan.planId === planId);

/** Shorthand for the first slice, kept because several call sites read better with it. */
export const SLICE_QUEST_ID = MIRROR_DETECTIVE_PLAN.questId as string;
export const SLICE_NODE_ID = MIRROR_DETECTIVE_PLAN.nodeId;
export const SLICE_SKILL_ID = MIRROR_DETECTIVE_PLAN.skillId;

/** Highest hint index available; H4 is explicit teaching (AI Constitution §5.1). */
const MAX_HINT_STEPS = 3;

export interface SessionState extends EmittingState {
  readonly userId: string;
  readonly locale: string;
  readonly planId: string;
  readonly phase: LessonPhase;
  readonly questId: string | null;
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
  /**
   * When the learner entered this lesson, and when they finished it. Null until each happens.
   *
   * These are the idempotency guards for `lesson_started` and `lesson_completed`, and they are
   * timestamps rather than booleans because the answer to "has this fired?" and "when?" is the
   * same fact. A pure reducer is safe against a repeated *invocation*; only state is safe
   * against a repeated *action*, which is what a mount effect under StrictMode produces.
   *
   * A safety halt reaches phase COMPLETE without setting `lessonCompletedAt`: an intervention
   * is not a completed lesson, and must not be counted as one.
   */
  readonly lessonStartedAt: string | null;
  readonly lessonCompletedAt: string | null;
  /** True when the rendered content fell back to the base locale. */
  readonly usedFallbackLocale: boolean;
  /**
   * Attempt this transition produced, for the caller to fold into the cross-lesson ledger.
   * Returned rather than recorded, for the reason set out in `src/app/transition.ts`.
   */
  readonly recordedAttempt: Attempt | null;
  readonly transitionId: number;
  readonly emitted: readonly LearningEvent[];
}

/**
 * Every action that emits an event carries the `at` it happened. Three of them used to emit
 * with `new Date(0)` — an event stamped 1970 is not a record of anything, so the timestamp is
 * now supplied by the caller like every other one.
 */
export type SessionAction =
  | { readonly type: 'START_LESSON'; readonly at: string }
  | { readonly type: 'LESSON_READ' }
  | { readonly type: 'THINK_DONE' }
  | { readonly type: 'REQUEST_HINT'; readonly at: string }
  | { readonly type: 'SELECT_OPTION'; readonly optionIndex: number }
  | { readonly type: 'SUBMIT_ANSWER'; readonly at: string }
  | { readonly type: 'CONTINUE_TO_REFLECT' }
  | { readonly type: 'SUBMIT_REFLECTION'; readonly text: string; readonly at: string }
  | { readonly type: 'CONTINUE_TO_MASTERY'; readonly at: string }
  | { readonly type: 'START_ACTIVITY'; readonly activityId: string }
  | { readonly type: 'COMPLETE'; readonly at: string }
  | { readonly type: 'RESTART'; readonly at: string };

export interface SliceGrounding {
  readonly plan: LessonPlan;
  /** Quest name, or null when the lesson is grounded directly in a node. */
  readonly questName: string | null;
  readonly nodeTitle: string;
  readonly domainId: string;
  readonly strandCode: string;
  readonly strandName: string;
  readonly learningObjective: string;
  readonly skillName: string;
  readonly nodeStatus: string;
  readonly nodeEvidenceStatus: string;
  readonly nodeVersion: string;
  readonly nodeSourceId: string;
  readonly mayStateAsFact: boolean;
  readonly availability: LessonAvailability;
  readonly disclosures: readonly Disclosure[];
}

/**
 * Resolve the governed records behind a lesson plan.
 *
 * Throws if a source ID is missing, because silently substituting content would defeat the
 * grounding contract — a broken reference must be visible, not papered over. When a plan names
 * a quest, the quest's Core node in 12_QUEST_NODE_MAP must be the plan's node; a plan cannot
 * quietly claim a quest it is not the core of.
 */
export function loadSliceGrounding(plan: LessonPlan = MIRROR_DETECTIVE_PLAN): SliceGrounding {
  const node = findNode(plan.nodeId);
  const skill = findSkill(plan.skillId);
  if (!node) throw new Error(`Knowledge node ${plan.nodeId} not found in the Master Database`);
  if (!skill) throw new Error(`Skill ${plan.skillId} not found in the Master Database`);

  let questName: string | null = null;
  if (plan.questId !== null) {
    const quest = findQuest(plan.questId);
    if (!quest) throw new Error(`Quest ${plan.questId} not found in the Master Database`);
    questName = quest.Quest_Name;

    const coreLink = nodeLinksForQuest(plan.questId).find((link) => link.Role === 'Core');
    if (coreLink?.Node_ID !== plan.nodeId) {
      throw new Error(
        `Quest ${plan.questId} core node is ${coreLink?.Node_ID ?? 'missing'}, expected ${plan.nodeId}`,
      );
    }
  }

  const publication = evaluatePublication(node);
  const availability = evaluateLessonAvailability({
    claimClass: plan.claimClass,
    nodeIds: [plan.nodeId],
  });

  return {
    plan,
    questName,
    nodeTitle: node.Node_Title,
    domainId: node.Domain_ID,
    strandCode: node.Strand_Code,
    strandName: node.Strand_Name,
    learningObjective: node.Learning_Objective,
    skillName: skill.Skill_Name,
    nodeStatus: node.Status,
    nodeEvidenceStatus: node.Evidence_Status || '\u2014',
    nodeVersion: node.Version,
    nodeSourceId: node.Source_ID || '\u2014',
    mayStateAsFact: publication.mayStateAsFact,
    availability,
    disclosures: availability.disclosures,
  };
}

/** Activities for a plan, in authored order: the practice question first, then transfer. */
export const sliceActivities = (
  plan: LessonPlan = MIRROR_DETECTIVE_PLAN,
): readonly LearningActivity[] => activitiesForNode(plan.nodeId);

export const sliceAtoms = (plan: LessonPlan = MIRROR_DETECTIVE_PLAN) => atomsForNode(plan.nodeId);

/**
 * Start a session for a lesson plan.
 *
 * Refuses to start a lesson the availability gate has blocked: a blocked lesson must not be
 * reachable by constructing a session directly, only reported by the screen that offered it.
 */
export function createSession(
  userId: string,
  locale: string,
  at: string,
  plan: LessonPlan = MIRROR_DETECTIVE_PLAN,
): SessionState {
  const grounding = loadSliceGrounding(plan);
  if (!grounding.availability.available) {
    throw new Error(
      `Lesson ${plan.planId} is blocked: ${grounding.availability.blockers
        .map((blocker) => blocker.detail)
        .join('; ')}`,
    );
  }

  const first = sliceActivities(plan)[0];
  if (!first) throw new Error(`No authored activity exists for node ${plan.nodeId}`);

  return {
    userId,
    locale,
    planId: plan.planId,
    phase: 'LESSON',
    questId: plan.questId,
    nodeId: plan.nodeId,
    skillId: plan.skillId,
    activityId: first.activityId,
    hintsUsed: 0,
    failedAttempts: 0,
    selectedOptionIndex: null,
    lastAnswerCorrect: null,
    reflection: null,
    mastery: createMasteryState(userId, plan.skillId, at),
    attempts: [],
    disclosures: grounding.disclosures,
    safetyHaltMessageKey: null,
    lessonStartedAt: null,
    lessonCompletedAt: null,
    usedFallbackLocale: false,
    recordedAttempt: null,
    ...INITIAL_TRANSITION,
  };
}

/**
 * The transition table.
 *
 * Declares what happened through `emit` and `onAttempt`; performs nothing. Not exported —
 * `sessionReducer` is the only way in, so no caller can reach a version that takes effects.
 */
function reduceSession(
  state: SessionState,
  action: SessionAction,
  emit: Emit,
  onAttempt: (attempt: Attempt) => void,
): SessionState {
  switch (action.type) {
    case 'START_LESSON': {
      // Dispatched from a mount effect, which React StrictMode runs twice. The reducer being
      // pure does not help here — these are two genuinely different actions — so the guard has
      // to live in state: a lesson that has already started cannot start again.
      if (state.phase !== 'LESSON' || state.lessonStartedAt !== null) return state;
      emit({
        type: 'lesson_started',
        userId: state.userId,
        at: action.at,
        nodeId: state.nodeId,
        skillId: state.skillId,
        locale: state.locale,
      });
      return { ...state, lessonStartedAt: action.at };
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
        at: action.at,
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
        // The timestamp makes the id unique across restarts, and makes a repeated write of the
        // *same* answer identifiable — see the ledger's idempotency note.
        attemptId: `${state.activityId}#${state.attempts.length + 1}@${action.at}`,
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
      // The same attempt also accrues to the cross-lesson ledger, so a skill practised in one
      // world counts toward the same skill everywhere. Evidence is only ever earned this way.
      // The write itself is the caller's to perform — this reducer only declares the attempt.
      onAttempt(attempt);
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
      // Finishing is the end of the lesson on the normal path.
      if (state.phase !== 'MASTER') return state;
      // The event fires once per lesson: the transfer activity sends the learner back through
      // LESSON → … → MASTER within the same lesson, and arriving a second time is not a second
      // completion. The phase still advances, so the control the learner pressed is never dead.
      if (state.lessonCompletedAt !== null) return { ...state, phase: 'COMPLETE' };
      emit({
        type: 'lesson_completed',
        userId: state.userId,
        at: action.at,
        nodeId: state.nodeId,
        skillId: state.skillId,
      });
      return { ...state, phase: 'COMPLETE', lessonCompletedAt: action.at };
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
      // The direct route to the end, for a caller that is not walking the phase rail.
      if (state.phase === 'COMPLETE') return state;
      if (state.lessonCompletedAt !== null) return { ...state, phase: 'COMPLETE' };
      emit({
        type: 'lesson_completed',
        userId: state.userId,
        at: action.at,
        nodeId: state.nodeId,
        skillId: state.skillId,
      });
      return { ...state, phase: 'COMPLETE', lessonCompletedAt: action.at };
    }

    case 'RESTART':
      return createSession(
        state.userId,
        state.locale,
        action.at,
        findLessonPlan(state.planId) ?? MIRROR_DETECTIVE_PLAN,
      );

    default:
      return state;
  }
}

/**
 * The session reducer. Pure: same `(state, action)` in, deeply equal state out, nothing else.
 *
 * Calling it twice with the same arguments — which React StrictMode does on every dispatch in
 * development — writes no event and records no attempt. What the transition wanted to do is in
 * `emitted` and `recordedAttempt`, for `drainSession` to perform exactly once.
 */
export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  const events: LearningEvent[] = [];
  // An array rather than a `let`, so the closure assignment stays visible to the type checker.
  const attempts: Attempt[] = [];
  const next = reduceSession(
    state,
    action,
    (event) => events.push(event),
    (attempt) => attempts.push(attempt),
  );

  // A no-op action keeps state identity, so React bails out of the re-render and a test can
  // still assert that nothing happened.
  if (next === state && events.length === 0) return state;

  return {
    ...next,
    // Always derived from the previous counter, so RESTART — which rebuilds state from
    // `createSession` — moves it forward rather than back to zero.
    transitionId: state.transitionId + 1,
    emitted: events,
    recordedAttempt: attempts[0] ?? null,
  };
}

/**
 * Perform one transition's declared effects, exactly once.
 *
 * The ledger is a parameter rather than an import at the call site so a test can hand in an
 * isolated ledger and assert that a pure reducer call reached neither it nor the sink.
 */
export function drainSession(
  state: SessionState,
  sink?: EventSink,
  ledger: MasteryLedger = masteryLedger,
): void {
  drainEvents(state, sink);
  if (state.recordedAttempt) ledger.record(state.recordedAttempt);
}

/** Reduce and drain in one step, for callers outside React (tests, scripts). */
export function applySession(
  state: SessionState,
  action: SessionAction,
  sink?: EventSink,
  ledger: MasteryLedger = masteryLedger,
): SessionState {
  const next = sessionReducer(state, action);
  if (next !== state) drainSession(next, sink, ledger);
  return next;
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
