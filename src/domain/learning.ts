/**
 * Learning domain logic types.
 *
 * Sources: Curriculum Knowledge Tree v1.0 §8 (entity schema), AI Tutor Constitution §5-§6,
 * Master DB 19_MASTERY_RULES, 00_CLAUDE_MASTER_CODING_HANDOFF_COMMAND_v1.0.md.
 */

/** Socratic hint ladder. AI Tutor Constitution §5.1. */
export type HintLevel = 'H0' | 'H1' | 'H2' | 'H3' | 'H4';

/** Tutor mode router. AI Tutor Constitution §2.2. */
export type TutorMode =
  | 'TEACH'
  | 'COACH'
  | 'REMEDIATE'
  | 'PRACTICE'
  | 'ASSESS'
  | 'REFLECT'
  | 'RECOMMEND'
  | 'SAFETY';

/** Intent schema. AI Tutor Constitution §4.1. */
export type LearnerIntent =
  | 'LEARN'
  | 'IDENTIFY'
  | 'COMPARE'
  | 'BUILD'
  | 'VERIFY'
  | 'DECIDE'
  | 'REFLECT'
  | 'TRANSFER'
  | 'SAFETY';

/** Risk tiers. AI Tutor Constitution §7.1. */
export type RiskTier = 'R0' | 'R1' | 'R2' | 'R3' | 'R4';

/** Learner state per skill. AI Tutor Constitution §6.2. */
export type LearnerState = 'NotAssessed' | 'Emerging' | 'Developing' | 'Secure' | 'Mastered';

/**
 * The default learning interaction, as stated in the handoff command:
 * ASK -> THINK -> HINT -> TRY -> FEEDBACK -> REFLECT -> MASTER.
 * `COMPLETE` is a terminal application state, not an additional pedagogical step.
 */
export type LessonPhase =
  | 'LESSON'
  | 'ASK'
  | 'THINK'
  | 'HINT'
  | 'TRY'
  | 'FEEDBACK'
  | 'REFLECT'
  | 'MASTER'
  | 'COMPLETE';

/** The four mastery dimensions. Master DB 19_MASTERY_RULES M01-M04. */
export type MasteryDimension = 'accuracy' | 'independence' | 'transfer' | 'retention';

/** Evidence accumulated for one dimension of one skill. */
export interface MasteryDimensionState {
  readonly attempts: number;
  readonly successes: number;
  /** True once the dimension's operational rule is satisfied. */
  readonly satisfied: boolean;
}

/**
 * Per-skill mastery state.
 *
 * Mastery is judged at Skill level (AI Constitution §6.2); node-level progress is tracked
 * separately in `nodeEvidence` and never by itself produces a Mastered skill.
 */
export interface MasteryState {
  readonly userId: string;
  readonly skillId: string;
  readonly dimensions: Readonly<Record<MasteryDimension, MasteryDimensionState>>;
  readonly state: LearnerState;
  /** Node IDs that contributed evidence, for traceability. */
  readonly nodeEvidence: readonly string[];
  readonly updatedAt: string;
}

/** A single learner attempt at one question. */
export interface Attempt {
  readonly attemptId: string;
  readonly userId: string;
  readonly nodeId: string;
  readonly skillId: string;
  readonly activityId: string;
  readonly correct: boolean;
  /** How many hints were revealed before this attempt was submitted. */
  readonly hintsUsed: number;
  /** True when the activity presents a scenario the learner has not seen before. */
  readonly isTransfer: boolean;
  /** True when the activity is a scheduled delayed-recall check. */
  readonly isRetention: boolean;
  readonly at: string;
}

/**
 * Analytics event taxonomy. Source: 01_TECHNICAL_IMPLEMENTATION_SPEC_v1.0.md §9.
 * Learning events are instrumented, not engagement time (AI Constitution §14.1).
 */
export type LearningEventType =
  | 'lesson_started'
  | 'lesson_completed'
  | 'question_answered'
  | 'hint_used'
  | 'reflection_completed'
  | 'transfer_attempted'
  | 'mastery_dimension_updated'
  | 'safety_intervention'
  | 'recommendation_shown'
  | 'recommendation_explained'
  | 'content_language_used'
  | 'content_variant_used';

export interface LearningEvent {
  readonly type: LearningEventType;
  readonly userId: string;
  readonly at: string;
  readonly nodeId?: string;
  readonly skillId?: string;
  readonly locale?: string;
  readonly detail?: Readonly<Record<string, string | number | boolean>>;
}
