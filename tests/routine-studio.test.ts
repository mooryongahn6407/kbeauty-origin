/**
 * Routine Studio tests.
 *
 * Source: Master DB 09_ROUTINES, 10_NODE_ROUTINE_MAP, Domain D08, quest QST-007.
 *
 * The central assertion is that the product never tells anyone what their routine should be:
 * routine records are shown but cannot be stated as fact, prose sequences are never split into
 * invented steps, the quest stays closed, and the reflection tool counts without judging.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { createMasteryLedger } from '@/mastery/mastery-ledger';
import { createEventSink } from '@/analytics/events';
import {
  ROUTINE_PURPOSE_PLAN,
  createSession,
  currentActivityText,
  findLessonPlan,
  loadSliceGrounding,
  applySession,
  sliceActivities,
  type SessionState,
} from '@/app/learning-session';
import {
  MAX_STEPS,
  createReflection,
  applyReflection,
  summariseReflection,
  type ReflectionState,
} from '@/app/routine-reflection';
import { findActivity } from '@/content/authored-content';
import { evaluateQuestAvailability } from '@/governance/learning-availability';
import { findQuestNumericMismatches } from '@/governance/integrity';
import {
  findRoutineView,
  routineCorpusReport,
  routineViews,
} from '@/knowledge/routines';

const AT = '2026-09-18T00:00:00.000Z';

describe('governed routine records', () => {
  it('exposes all 10 routines with their source fields intact', () => {
    const report = routineCorpusReport();
    expect(report.total).toBe(10);
    expect(report.approved).toBe(10);
    const amBasic = findRoutineView('RUT-001')!;
    expect(amBasic.routine.Routine_Name).toBe('AM Basic');
    expect(amBasic.routine.Default_Sequence).toBe('정돈 → 선택적 트리트먼트 → 보습 → 자외선 보호');
  });

  it('refuses to state any routine as fact despite all ten being Approved', () => {
    const report = routineCorpusReport();
    expect(report.mayStateAsFact).toBe(0);
    for (const view of routineViews()) {
      expect(view.mayStateAsFact, view.routine.Routine_ID).toBe(false);
      expect(view.publicationReason).toContain('Evidence_Status');
    }
  });

  it('reports that the sheet has no column in which a routine could cite evidence (OQ-R01)', () => {
    expect(routineCorpusReport().hasEvidenceLinkageColumn).toBe(false);
  });

  it('parses an ordered sequence into steps', () => {
    const view = findRoutineView('RUT-001')!;
    expect(view.isSequenced).toBe(true);
    expect(view.steps.map((step) => step.label)).toEqual([
      '정돈',
      '선택적 트리트먼트',
      '보습',
      '자외선 보호',
    ]);
  });

  it('never splits a prose sequence into invented steps', () => {
    const view = findRoutineView('RUT-004')!;
    expect(view.isSequenced).toBe(false);
    expect(view.steps).toEqual([]);
    expect(view.routine.Default_Sequence).toBe('가벼운 세정/보습 + 외부활동 보호');
  });

  it('counts how many sequences are ordered versus prose', () => {
    const report = routineCorpusReport();
    expect(report.sequenced + report.prose).toBe(10);
    expect(report.prose).toBe(5);
  });

  it('surfaces the broken node reference in RUT-001 rather than dropping the link (SR-007)', () => {
    const view = findRoutineView('RUT-001')!;
    expect(view.referencesComplete).toBe(false);
    const broken = view.links.find((link) => !link.exists)!;
    expect(broken.nodeId).toBe('KN-D04-02-003');
    expect(broken.relationship).toBe('Primary');
    expect(broken.nodeTitle).toBeNull();
    expect(routineCorpusReport().withBrokenReferences).toBe(1);
  });

  it('keeps every routine link, including the ones that resolve', () => {
    const view = findRoutineView('RUT-001')!;
    expect(view.links).toHaveLength(5);
    expect(view.links.filter((link) => link.exists)).toHaveLength(4);
  });

  it('returns undefined for an unknown routine instead of inventing one', () => {
    expect(findRoutineView('RUT-999')).toBeUndefined();
  });
});

describe('QST-007 Routine Rescue stays closed', () => {
  const quest = evaluateQuestAvailability('QST-007', 'SCIENTIFIC');

  it('is wired to its real node map', () => {
    expect(quest.questName).toBe('Routine Rescue');
    expect(quest.coreNodeId).toBe('KN-D08-04-001');
    expect(quest.nodeIds).toEqual(['KN-D08-04-001', 'KN-D08-04-002']);
  });

  it('is blocked, with every blocker naming a record and a register entry', () => {
    expect(quest.available).toBe(false);
    expect(quest.blockers.length).toBeGreaterThan(0);
    for (const blocker of quest.blockers) {
      expect(blocker.recordId).toMatch(/^KN-/);
      expect(blocker.registerId).toBeTruthy();
    }
  });
});

describe('quest numeric consistency (OQ-R02)', () => {
  const mismatches = findQuestNumericMismatches();

  it('finds exactly one contradiction across all 25 quests', () => {
    expect(mismatches).toHaveLength(1);
    expect(mismatches[0]!.questId).toBe('QST-007');
  });

  it('reports both numbers without choosing one', () => {
    expect(mismatches[0]).toMatchObject({
      winCondition: '과도한 루틴을 4단계로 단순화',
      winConditionNumbers: [4],
      coreNodeId: 'KN-D08-04-001',
      coreNodeTitle: '3-step routine 만들기',
      coreNodeNumbers: [3],
    });
  });

  it('does not flag a quest whose win condition counts something the node never mentions', () => {
    // QST-008's win condition says 10, its core node title has no number at all.
    expect(mismatches.some((item) => item.questId === 'QST-008')).toBe(false);
  });
});

describe('routine reasoning lesson', () => {
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
    state = createSession('test-learner', 'en', AT, ROUTINE_PURPOSE_PLAN);
  });

  it('is grounded in a governed D08 node, strand and skill', () => {
    const grounding = loadSliceGrounding(ROUTINE_PURPOSE_PLAN);
    expect(grounding.nodeTitle).toBe('제품 역할로 순서 판단하기');
    expect(grounding.domainId).toBe('D08');
    expect(grounding.strandCode).toBe('08.3');
    expect(grounding.strandName).toBe('Order Logic');
    expect(grounding.skillName).toBe('Sequence');
  });

  it('claims no quest, because QST-007 cannot be authored yet', () => {
    expect(ROUTINE_PURPOSE_PLAN.questId).toBeNull();
    expect(loadSliceGrounding(ROUTINE_PURPOSE_PLAN).questName).toBeNull();
  });

  it('is registered and runs on the shared engine', () => {
    expect(findLessonPlan('routine-purpose')).toBe(ROUTINE_PURPOSE_PLAN);
    expect(dispatch({ type: 'LESSON_READ' }).phase).toBe('ASK');
    dispatch({ type: 'THINK_DONE' });
    const activity = findActivity(state.activityId)!;
    dispatch({ type: 'SELECT_OPTION', optionIndex: activity.correctOptionIndex });
    expect(dispatch({ type: 'SUBMIT_ANSWER', at: AT }).phase).toBe('FEEDBACK');
    expect(state.lastAnswerCorrect).toBe(true);
    expect(state.mastery.skillId).toBe('SK05');
  });

  it('offers a transfer activity', () => {
    expect(sliceActivities(ROUTINE_PURPOSE_PLAN).filter((a) => a.isTransfer)).toHaveLength(1);
  });

  it('renders in Korean without falling back', () => {
    const korean = currentActivityText({ ...state, locale: 'ko' });
    expect(korean?.usedFallback).toBe(false);
    expect(korean?.options).toHaveLength(3);
  });
});

describe('routine reflection studio', () => {
  let sink = createEventSink();
  let state: ReflectionState;
  const dispatch = (action: Parameters<typeof applyReflection>[1]) => {
    state = applyReflection(state, action, sink);
    return state;
  };

  beforeEach(() => {
    sink = createEventSink();
    state = createReflection('test-learner');
  });

  it('starts empty, with the disclosures it owes', () => {
    expect(state.phase).toBe('LISTING');
    expect(state.entries).toEqual([]);
    expect(state.disclosures.map((d) => d.code)).toEqual([
      'PENDING_VERIFICATION',
      'NOT_MEDICAL_ADVICE',
    ]);
  });

  it('records the learner’s own steps verbatim', () => {
    dispatch({ type: 'ADD_STEP', label: '  cleanser  ' });
    dispatch({ type: 'ADD_STEP', label: 'sunscreen' });
    expect(state.entries.map((entry) => entry.label)).toEqual(['cleanser', 'sunscreen']);
    expect(state.entries.every((entry) => entry.purpose === null)).toBe(true);
  });

  it('ignores an empty step and caps the list', () => {
    dispatch({ type: 'ADD_STEP', label: '   ' });
    expect(state.entries).toHaveLength(0);
    for (let i = 0; i < MAX_STEPS + 3; i += 1) dispatch({ type: 'ADD_STEP', label: `step ${i}` });
    expect(state.entries).toHaveLength(MAX_STEPS);
  });

  it('removes a step by id', () => {
    dispatch({ type: 'ADD_STEP', label: 'a' });
    dispatch({ type: 'ADD_STEP', label: 'b' });
    dispatch({ type: 'REMOVE_STEP', entryId: state.entries[0]!.entryId });
    expect(state.entries.map((entry) => entry.label)).toEqual(['b']);
  });

  it('counts only the steps the learner could account for, and grades nothing', () => {
    dispatch({ type: 'ADD_STEP', label: 'a' });
    dispatch({ type: 'ADD_STEP', label: 'b' });
    dispatch({ type: 'ADD_STEP', label: 'c' });
    dispatch({ type: 'GO_TO_PURPOSE' });
    dispatch({ type: 'SET_PURPOSE', entryId: 'step-1', purpose: 'removes the day' });
    dispatch({ type: 'SET_PURPOSE', entryId: 'step-2', purpose: '   ' });

    const summary = summariseReflection(state);
    expect(summary).toEqual({ total: 3, withPurpose: 1, withoutPurpose: 2 });
    // There is no score, no ideal count and no recommendation anywhere in the state.
    // `transitionId` and `emitted` are the reducer's event outbox, not learner data.
    expect(Object.keys(state)).toEqual([
      'userId',
      'phase',
      'entries',
      'disclosures',
      'safetyHaltMessageKey',
      'transitionId',
      'emitted',
    ]);
  });

  it('will not move to the purpose phase with nothing listed', () => {
    expect(dispatch({ type: 'GO_TO_PURPOSE' }).phase).toBe('LISTING');
  });

  it('emits a reflection event on completion', () => {
    dispatch({ type: 'ADD_STEP', label: 'a' });
    dispatch({ type: 'GO_TO_PURPOSE' });
    dispatch({ type: 'SET_PURPOSE', entryId: 'step-1', purpose: 'because' });
    expect(dispatch({ type: 'COMPLETE_REVIEW', at: AT }).phase).toBe('REVIEW');
    expect(sink.countOf('reflection_completed')).toBe(1);
  });

  it('halts on a risk signal in a step label, before storing it', () => {
    dispatch({ type: 'ADD_STEP', label: '이 단계 하고 나면 너무 아파요' });
    expect(state.phase).toBe('HALTED');
    expect(state.entries).toHaveLength(0);
    expect(state.safetyHaltMessageKey).toMatch(/^safety\.escalation\.R[234]$/);
    expect(sink.countOf('safety_intervention')).toBe(1);
  });

  it('halts on a risk signal in a stated purpose', () => {
    dispatch({ type: 'ADD_STEP', label: 'a toner' });
    dispatch({ type: 'GO_TO_PURPOSE' });
    dispatch({ type: 'SET_PURPOSE', entryId: 'step-1', purpose: '감염된 것 같아서요' });
    expect(state.phase).toBe('HALTED');
    expect(sink.countOf('safety_intervention')).toBe(1);
  });

  it('accepts nothing but a reset once halted', () => {
    dispatch({ type: 'ADD_STEP', label: '너무 아파요' });
    dispatch({ type: 'ADD_STEP', label: 'a normal step' });
    expect(state.phase).toBe('HALTED');
    expect(state.entries).toHaveLength(0);
    expect(dispatch({ type: 'RESET' }).phase).toBe('LISTING');
    expect(state.safetyHaltMessageKey).toBeNull();
  });
});
