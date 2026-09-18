/**
 * End-to-end test of the first learning slice.
 *
 * Drives the real reducer through every transition the handoff command requires:
 * My Skin -> governed node -> micro lesson -> question -> hint -> answer -> feedback
 * -> reflection -> mastery evidence record.
 */
import { readFileSync } from 'node:fs';
import { beforeEach, describe, expect, it } from 'vitest';
import { createMasteryLedger } from '@/mastery/mastery-ledger';
import { createEventSink } from '@/analytics/events';
import {
  SLICE_NODE_ID,
  SLICE_QUEST_ID,
  SLICE_SKILL_ID,
  createSession,
  currentActivityText,
  loadSliceGrounding,
  applySession,
  sliceActivities,
  type SessionState,
} from '@/app/learning-session';
import { findActivity } from '@/content/authored-content';
import { nodeLinksForQuest } from '@/knowledge/repository';

const AT = '2026-09-18T00:00:00.000Z';
let sink = createEventSink();
// An isolated ledger: `applySession` would otherwise fold attempts into the
// process-wide one and let suites see each other's evidence.
const ledger = createMasteryLedger('test-learner');
let state: SessionState;

const dispatch = (action: Parameters<typeof applySession>[1]) => {
  state = applySession(state, action, sink, ledger);
  return state;
};

beforeEach(() => {
  sink = createEventSink();
  ledger.reset();
  state = createSession('test-learner', 'en', AT);
});

describe('slice grounding', () => {
  it('is grounded in Master Database IDs that exist', () => {
    const grounding = loadSliceGrounding();
    expect(grounding.questName).toBe('Mirror Detective');
    expect(grounding.skillName).toBe('Observe');
    expect(grounding.nodeStatus).toBe('Draft');
  });

  it('uses the Core node the quest map actually declares', () => {
    const core = nodeLinksForQuest(SLICE_QUEST_ID).find((link) => link.Role === 'Core');
    expect(core?.Node_ID).toBe(SLICE_NODE_ID);
  });

  it('cannot state its governed node as fact, and says so', () => {
    const grounding = loadSliceGrounding();
    expect(grounding.mayStateAsFact).toBe(false);
    expect(grounding.disclosures.map((d) => d.code)).toContain('PENDING_VERIFICATION');
  });
});

describe('phase transitions are real state changes', () => {
  it('walks the full ASK -> THINK -> HINT -> TRY -> FEEDBACK -> REFLECT -> MASTER path', () => {
    expect(state.phase).toBe('LESSON');
    expect(dispatch({ type: 'LESSON_READ' }).phase).toBe('ASK');
    expect(dispatch({ type: 'THINK_DONE' }).phase).toBe('THINK');
    expect(dispatch({ type: 'REQUEST_HINT', at: AT }).phase).toBe('HINT');
    expect(state.hintsUsed).toBe(1);

    const activity = findActivity(state.activityId)!;
    dispatch({ type: 'SELECT_OPTION', optionIndex: activity.correctOptionIndex });
    expect(state.phase).toBe('TRY');

    expect(dispatch({ type: 'SUBMIT_ANSWER', at: AT }).phase).toBe('FEEDBACK');
    expect(state.lastAnswerCorrect).toBe(true);

    expect(dispatch({ type: 'CONTINUE_TO_REFLECT' }).phase).toBe('REFLECT');
    expect(
      dispatch({ type: 'SUBMIT_REFLECTION', text: 'An observation only says what I saw.', at: AT })
        .phase,
    ).toBe('MASTER');
    expect(state.reflection).toBe('An observation only says what I saw.');
    expect(dispatch({ type: 'CONTINUE_TO_MASTERY', at: AT }).phase).toBe('COMPLETE');
  });

  it('sends an incorrect answer back to the hint ladder rather than forward', () => {
    dispatch({ type: 'LESSON_READ' });
    dispatch({ type: 'THINK_DONE' });
    const activity = findActivity(state.activityId)!;
    const wrong = activity.correctOptionIndex === 0 ? 1 : 0;

    dispatch({ type: 'SELECT_OPTION', optionIndex: wrong });
    dispatch({ type: 'SUBMIT_ANSWER', at: AT });
    expect(state.lastAnswerCorrect).toBe(false);
    expect(state.failedAttempts).toBe(1);

    expect(dispatch({ type: 'CONTINUE_TO_REFLECT' }).phase).toBe('HINT');
    expect(state.selectedOptionIndex).toBeNull();
  });

  it('ignores actions that do not belong to the current phase', () => {
    const before = state;
    expect(dispatch({ type: 'SUBMIT_ANSWER', at: AT })).toEqual(before);
    expect(dispatch({ type: 'CONTINUE_TO_MASTERY', at: AT })).toEqual(before);
  });

  it('caps the hint ladder instead of running past H3', () => {
    dispatch({ type: 'LESSON_READ' });
    dispatch({ type: 'THINK_DONE' });
    for (let i = 0; i < 6; i += 1) dispatch({ type: 'REQUEST_HINT', at: AT });
    expect(state.hintsUsed).toBe(3);
  });
});

describe('mastery evidence', () => {
  const answerCorrectly = () => {
    dispatch({ type: 'LESSON_READ' });
    dispatch({ type: 'THINK_DONE' });
    const activity = findActivity(state.activityId)!;
    dispatch({ type: 'SELECT_OPTION', optionIndex: activity.correctOptionIndex });
    dispatch({ type: 'SUBMIT_ANSWER', at: AT });
  };

  it('records a mastery evidence entry for every attempt', () => {
    answerCorrectly();
    expect(state.attempts).toHaveLength(1);
    expect(state.attempts[0]).toMatchObject({
      nodeId: SLICE_NODE_ID,
      skillId: SLICE_SKILL_ID,
      correct: true,
    });
    expect(state.mastery.nodeEvidence).toContain(SLICE_NODE_ID);
  });

  it('never marks a skill Mastered from one correct answer', () => {
    answerCorrectly();
    expect(state.mastery.state).not.toBe('Mastered');
    expect(state.mastery.dimensions.accuracy.satisfied).toBe(false);
    expect(state.mastery.dimensions.transfer.satisfied).toBe(false);
    expect(state.mastery.dimensions.retention.satisfied).toBe(false);
  });

  it('counts a hinted answer for accuracy but not for independence', () => {
    dispatch({ type: 'LESSON_READ' });
    dispatch({ type: 'THINK_DONE' });
    dispatch({ type: 'REQUEST_HINT', at: AT });
    dispatch({ type: 'REQUEST_HINT', at: AT });
    const activity = findActivity(state.activityId)!;
    dispatch({ type: 'SELECT_OPTION', optionIndex: activity.correctOptionIndex });
    dispatch({ type: 'SUBMIT_ANSWER', at: AT });

    expect(state.mastery.dimensions.accuracy.successes).toBe(1);
    expect(state.mastery.dimensions.independence.successes).toBe(0);
  });

  it('collects transfer evidence only from the transfer activity', () => {
    answerCorrectly();
    expect(state.mastery.dimensions.transfer.attempts).toBe(0);

    const transfer = sliceActivities().find((activity) => activity.isTransfer)!;
    dispatch({ type: 'START_ACTIVITY', activityId: transfer.activityId });
    expect(state.hintsUsed).toBe(0);
    dispatch({ type: 'LESSON_READ' });
    dispatch({ type: 'THINK_DONE' });
    dispatch({ type: 'SELECT_OPTION', optionIndex: transfer.correctOptionIndex });
    dispatch({ type: 'SUBMIT_ANSWER', at: AT });

    expect(state.mastery.dimensions.transfer.attempts).toBe(1);
    expect(state.mastery.dimensions.transfer.successes).toBe(1);
  });
});

describe('safety runs before learning flow', () => {
  it('halts the session when a reflection carries a risk signal', () => {
    dispatch({ type: 'LESSON_READ' });
    dispatch({ type: 'THINK_DONE' });
    const activity = findActivity(state.activityId)!;
    dispatch({ type: 'SELECT_OPTION', optionIndex: activity.correctOptionIndex });
    dispatch({ type: 'SUBMIT_ANSWER', at: AT });
    dispatch({ type: 'CONTINUE_TO_REFLECT' });

    dispatch({ type: 'SUBMIT_REFLECTION', text: '얼굴이 너무 아프고 붓는 것 같아요', at: AT });

    expect(state.phase).toBe('COMPLETE');
    expect(state.safetyHaltMessageKey).toMatch(/^safety\.escalation\.R[234]$/);
    expect(sink.countOf('safety_intervention')).toBe(1);
    expect(sink.countOf('reflection_completed')).toBe(0);
  });
});

describe('analytics instruments learning, not engagement', () => {
  it('emits the learning events the technical spec lists', () => {
    dispatch({ type: 'START_LESSON', at: AT });
    dispatch({ type: 'LESSON_READ' });
    dispatch({ type: 'THINK_DONE' });
    dispatch({ type: 'REQUEST_HINT', at: AT });
    const activity = findActivity(state.activityId)!;
    dispatch({ type: 'SELECT_OPTION', optionIndex: activity.correctOptionIndex });
    dispatch({ type: 'SUBMIT_ANSWER', at: AT });
    dispatch({ type: 'CONTINUE_TO_REFLECT' });
    dispatch({ type: 'SUBMIT_REFLECTION', text: 'I only write what I can point at.', at: AT });
    dispatch({ type: 'CONTINUE_TO_MASTERY', at: AT });
    dispatch({ type: 'COMPLETE', at: AT });

    expect(sink.countOf('lesson_started')).toBe(1);
    expect(sink.countOf('hint_used')).toBe(1);
    expect(sink.countOf('question_answered')).toBe(1);
    expect(sink.countOf('mastery_dimension_updated')).toBe(1);
    expect(sink.countOf('reflection_completed')).toBe(1);
    expect(sink.countOf('lesson_completed')).toBe(1);
  });
});

describe('localized rendering', () => {
  it('renders the activity in Korean without falling back', () => {
    const korean = currentActivityText({ ...state, locale: 'ko' });
    expect(korean?.usedFallback).toBe(false);
    expect(korean?.options).toHaveLength(3);
    expect(korean?.text['question']).toContain('관찰');
  });

  it('falls back to the base locale for an untranslated locale, and reports it', () => {
    const thai = currentActivityText({ ...state, locale: 'th' });
    expect(thai?.usedFallback).toBe(true);
    expect(thai?.options).toHaveLength(3);
  });

  it('keeps the correct option at the same index across locales', () => {
    const activity = findActivity(state.activityId)!;
    for (const variant of activity.variants) {
      expect(variant.text[`option${activity.correctOptionIndex}`]).toBeTruthy();
    }
  });
});

/**
 * The lesson lifecycle — `lesson_started` and `lesson_completed`.
 *
 * Both events existed in the reducer and were covered by the test above from the day the slice
 * was written, and neither ever fired in the running app: no screen dispatched `START_LESSON`
 * or `CONTINUE_TO_MASTERY`. A reducer test cannot catch that, so the wiring is asserted here
 * too, and the idempotency the wiring depends on is tested separately from it.
 */
describe('the lesson lifecycle fires once, and only from a real start and finish', () => {
  const START = '2026-09-18T09:00:00.000Z';
  const FINISH = '2026-09-18T09:12:00.000Z';

  /** Walk the lesson from a fresh session to the MASTER phase, answering correctly. */
  const reachMastery = () => {
    dispatch({ type: 'START_LESSON', at: START });
    dispatch({ type: 'LESSON_READ' });
    dispatch({ type: 'THINK_DONE' });
    const activity = findActivity(state.activityId)!;
    dispatch({ type: 'SELECT_OPTION', optionIndex: activity.correctOptionIndex });
    dispatch({ type: 'SUBMIT_ANSWER', at: AT });
    dispatch({ type: 'CONTINUE_TO_REFLECT' });
    dispatch({ type: 'SUBMIT_REFLECTION', text: 'I described what I could see.', at: AT });
  };

  it('starts unstarted and unfinished', () => {
    expect(state.lessonStartedAt).toBeNull();
    expect(state.lessonCompletedAt).toBeNull();
    expect(sink.countOf('lesson_started')).toBe(0);
  });

  it('records when the lesson started, and emits the event once', () => {
    dispatch({ type: 'START_LESSON', at: START });
    expect(state.lessonStartedAt).toBe(START);
    expect(sink.countOf('lesson_started')).toBe(1);
  });

  it('survives the doubled mount effect StrictMode runs, which is two real actions', () => {
    // Purity protects against a repeated *invocation* of one action. This is a repeated
    // *action*, which only state can tell apart — so the guard is `lessonStartedAt`.
    dispatch({ type: 'START_LESSON', at: START });
    dispatch({ type: 'START_LESSON', at: '2026-09-18T09:00:00.001Z' });
    dispatch({ type: 'START_LESSON', at: '2026-09-18T09:00:00.002Z' });
    expect(sink.countOf('lesson_started')).toBe(1);
    // The first timestamp is the one kept: the lesson started when it started.
    expect(state.lessonStartedAt).toBe(START);
  });

  it('makes a repeated START_LESSON a true no-op, preserving state identity', () => {
    dispatch({ type: 'START_LESSON', at: START });
    const before = state;
    expect(dispatch({ type: 'START_LESSON', at: FINISH })).toBe(before);
  });

  it('emits lesson_completed when the learner finishes, with the real timestamp', () => {
    reachMastery();
    expect(state.phase).toBe('MASTER');
    expect(sink.countOf('lesson_completed')).toBe(0);

    dispatch({ type: 'CONTINUE_TO_MASTERY', at: FINISH });
    expect(state.phase).toBe('COMPLETE');
    expect(state.lessonCompletedAt).toBe(FINISH);
    expect(sink.countOf('lesson_completed')).toBe(1);
  });

  it('stamps both events with the time given, never with the epoch', () => {
    reachMastery();
    dispatch({ type: 'CONTINUE_TO_MASTERY', at: FINISH });
    const lifecycle = sink
      .all()
      .filter((event) => event.type === 'lesson_started' || event.type === 'lesson_completed');
    expect(lifecycle.map((event) => event.at)).toEqual([START, FINISH]);
    for (const event of sink.all()) {
      // Every event, not only these two: an event dated 1970 records nothing.
      expect(new Date(event.at).getTime()).toBeGreaterThan(0);
    }
  });

  it('does not complete twice when the transfer activity revisits the mastery panel', () => {
    reachMastery();
    dispatch({ type: 'CONTINUE_TO_MASTERY', at: FINISH });

    // The transfer question is part of the same lesson, so arriving at MASTER again is not a
    // second completion.
    const transfer = sliceActivities().find((activity) => activity.isTransfer)!;
    dispatch({ type: 'START_ACTIVITY', activityId: transfer.activityId });
    dispatch({ type: 'LESSON_READ' });
    dispatch({ type: 'THINK_DONE' });
    dispatch({ type: 'SELECT_OPTION', optionIndex: transfer.correctOptionIndex });
    dispatch({ type: 'SUBMIT_ANSWER', at: AT });
    dispatch({ type: 'CONTINUE_TO_REFLECT' });
    dispatch({ type: 'SUBMIT_REFLECTION', text: 'The same idea, a different day.', at: AT });
    expect(state.phase).toBe('MASTER');
    dispatch({ type: 'CONTINUE_TO_MASTERY', at: '2026-09-18T09:30:00.000Z' });

    // The phase still advances — the learner pressed a control and it did something — but the
    // completion is not reported twice, and the recorded time stays the first one.
    expect(state.phase).toBe('COMPLETE');
    expect(state.lessonCompletedAt).toBe(FINISH);
    expect(sink.countOf('lesson_completed')).toBe(1);
    expect(sink.countOf('lesson_started')).toBe(1);
    // Both answers still counted; it is the lifecycle that is once-per-lesson, not the evidence.
    expect(sink.countOf('question_answered')).toBe(2);
    expect(sink.countOf('transfer_attempted')).toBe(1);
  });

  it('does not report a lesson completed when safety halted it', () => {
    dispatch({ type: 'START_LESSON', at: START });
    dispatch({ type: 'LESSON_READ' });
    dispatch({ type: 'THINK_DONE' });
    const activity = findActivity(state.activityId)!;
    dispatch({ type: 'SELECT_OPTION', optionIndex: activity.correctOptionIndex });
    dispatch({ type: 'SUBMIT_ANSWER', at: AT });
    dispatch({ type: 'CONTINUE_TO_REFLECT' });
    dispatch({ type: 'SUBMIT_REFLECTION', text: '얼굴이 너무 아파요', at: AT });

    // The halt reaches phase COMPLETE, which is what stops the flow. It is not a completion.
    expect(state.phase).toBe('COMPLETE');
    expect(state.safetyHaltMessageKey).not.toBeNull();
    expect(state.lessonCompletedAt).toBeNull();
    expect(sink.countOf('lesson_completed')).toBe(0);
    expect(sink.countOf('safety_intervention')).toBe(1);

    // And it cannot be completed afterwards either — the lesson ended in an intervention.
    dispatch({ type: 'COMPLETE', at: FINISH });
    dispatch({ type: 'CONTINUE_TO_MASTERY', at: FINISH });
    expect(sink.countOf('lesson_completed')).toBe(0);
  });

  it('starts over cleanly on RESTART', () => {
    reachMastery();
    dispatch({ type: 'CONTINUE_TO_MASTERY', at: FINISH });
    dispatch({ type: 'RESTART', at: AT });
    expect(state.lessonStartedAt).toBeNull();
    expect(state.lessonCompletedAt).toBeNull();
    // A restarted lesson can start and finish again; it is a new attempt at the same lesson.
    dispatch({ type: 'START_LESSON', at: START });
    expect(sink.countOf('lesson_started')).toBe(2);
  });
});

describe('the lifecycle is wired to the screen, not only to the reducer', () => {
  const source = readFileSync(
    new URL('../src/ui/components/LessonRunner.tsx', import.meta.url),
    'utf8',
  );

  it('dispatches START_LESSON from a mount effect', () => {
    expect(source).toMatch(/dispatch\(\{ type: 'START_LESSON', at: now\(\) \}\)/);
    expect(source).toMatch(/useEffect\(/);
  });

  it('offers a finish control that dispatches CONTINUE_TO_MASTERY', () => {
    expect(source).toMatch(/dispatch\(\{ type: 'CONTINUE_TO_MASTERY', at: now\(\) \}\)/);
    expect(source).toMatch(/translate\('lesson\.finish', locale\)/);
  });

  it('never stamps a dispatched event with the epoch', () => {
    // `new Date(0)` was how the lifecycle events used to be timed.
    expect(source).not.toMatch(/new Date\(0\)/);
  });
});
