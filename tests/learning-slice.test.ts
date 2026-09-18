/**
 * End-to-end test of the first learning slice.
 *
 * Drives the real reducer through every transition the handoff command requires:
 * My Skin -> governed node -> micro lesson -> question -> hint -> answer -> feedback
 * -> reflection -> mastery evidence record.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { createEventSink } from '@/analytics/events';
import {
  SLICE_NODE_ID,
  SLICE_QUEST_ID,
  SLICE_SKILL_ID,
  createSession,
  currentActivityText,
  loadSliceGrounding,
  sessionReducer,
  sliceActivities,
  type SessionState,
} from '@/app/learning-session';
import { findActivity } from '@/content/authored-content';
import { nodeLinksForQuest } from '@/knowledge/repository';

const AT = '2026-09-18T00:00:00.000Z';
let sink = createEventSink();
let state: SessionState;

const dispatch = (action: Parameters<typeof sessionReducer>[1]) => {
  state = sessionReducer(state, action, sink);
  return state;
};

beforeEach(() => {
  sink = createEventSink();
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
    expect(dispatch({ type: 'REQUEST_HINT' }).phase).toBe('HINT');
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
    expect(dispatch({ type: 'CONTINUE_TO_MASTERY' }).phase).toBe('COMPLETE');
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
    expect(dispatch({ type: 'CONTINUE_TO_MASTERY' })).toEqual(before);
  });

  it('caps the hint ladder instead of running past H3', () => {
    dispatch({ type: 'LESSON_READ' });
    dispatch({ type: 'THINK_DONE' });
    for (let i = 0; i < 6; i += 1) dispatch({ type: 'REQUEST_HINT' });
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
    dispatch({ type: 'REQUEST_HINT' });
    dispatch({ type: 'REQUEST_HINT' });
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
    dispatch({ type: 'START_LESSON' });
    dispatch({ type: 'LESSON_READ' });
    dispatch({ type: 'THINK_DONE' });
    dispatch({ type: 'REQUEST_HINT' });
    const activity = findActivity(state.activityId)!;
    dispatch({ type: 'SELECT_OPTION', optionIndex: activity.correctOptionIndex });
    dispatch({ type: 'SUBMIT_ANSWER', at: AT });
    dispatch({ type: 'CONTINUE_TO_REFLECT' });
    dispatch({ type: 'SUBMIT_REFLECTION', text: 'I only write what I can point at.', at: AT });
    dispatch({ type: 'CONTINUE_TO_MASTERY' });
    dispatch({ type: 'COMPLETE' });

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
