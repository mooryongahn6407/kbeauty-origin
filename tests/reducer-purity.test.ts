/**
 * Reducer purity — the regression gate.
 *
 * This file exists because the app once got this wrong in a way no test caught. The session
 * reducer wrote to the analytics sink and the mastery ledger from inside its `switch`. React
 * StrictMode invokes a reducer twice for every action in development precisely to expose that,
 * and it did: one answer in the browser showed as two attempts, and every event count was
 * double. The learner-visible number was only correct because the ledger happened to be
 * idempotent per attempt ID.
 *
 * So the rule is now enforced from four directions:
 *   1. shape    — a reducer takes exactly `(state, action)`; there is no third slot to hand an
 *                 effect into, so a future call site cannot reintroduce the defect;
 *   2. behaviour— invoking a reducer twice produces deeply equal results and zero writes;
 *   3. drain    — the guard performs a given `transitionId` at most once, however often the
 *                 effect around it re-runs;
 *   4. source   — no reducer module mentions a sink or the process-wide ledger outside the
 *                 drain helpers.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { createEventSink } from '@/analytics/events';
import { createMasteryLedger } from '@/mastery/mastery-ledger';
import { createDrainGuard, type EmittingState } from '@/app/transition';
import {
  INGREDIENT_HALO_PLAN,
  applySession,
  createSession,
  drainSession,
  sessionReducer,
  type SessionAction,
  type SessionState,
} from '@/app/learning-session';
import {
  applyReflection,
  createReflection,
  reflectionReducer,
  type ReflectionAction,
  type ReflectionState,
} from '@/app/routine-reflection';
import {
  applyExposure,
  createExposureLog,
  exposureReducer,
  type ExposureAction,
  type ExposureLogState,
} from '@/app/exposure-log';
import {
  applySorter,
  createSorter,
  labelSpecimens,
  sorterReducer,
  type SorterAction,
  type SorterState,
} from '@/app/label-sorter';

const AT = '2026-09-18T00:00:00.000Z';
const specimen = labelSpecimens[0]!;

/**
 * One scenario per reducer: a starting state and the sequence of actions that drives it
 * through every branch that wants to emit something.
 */
interface Scenario<S extends EmittingState, A> {
  readonly name: string;
  readonly reducer: (state: S, action: A) => S;
  readonly create: () => S;
  readonly actions: readonly A[];
  /** How many events the whole sequence should produce, drained exactly once. */
  readonly expectedEvents: number;
}

/**
 * Erase a scenario's generics so the four can share one `describe.each` table. The cast is the
 * price of a heterogeneous list; each scenario is still fully checked where it is declared.
 */
const erased = <S extends EmittingState, A>(
  scenario: Scenario<S, A>,
): Scenario<EmittingState, unknown> => scenario as unknown as Scenario<EmittingState, unknown>;

const sessionScenario: Scenario<SessionState, SessionAction> = {
  name: 'sessionReducer',
  reducer: sessionReducer,
  create: () => createSession('purity', 'en', AT, INGREDIENT_HALO_PLAN),
  actions: [
    { type: 'START_LESSON', at: AT },
    { type: 'LESSON_READ' },
    { type: 'THINK_DONE' },
    { type: 'REQUEST_HINT', at: AT },
    { type: 'SELECT_OPTION', optionIndex: 0 },
    { type: 'SUBMIT_ANSWER', at: AT },
  ],
  // lesson_started, hint_used, question_answered, mastery_dimension_updated
  expectedEvents: 4,
};

const reflectionScenario: Scenario<ReflectionState, ReflectionAction> = {
  name: 'reflectionReducer',
  reducer: reflectionReducer,
  create: () => createReflection('purity'),
  actions: [
    { type: 'ADD_STEP', label: 'cleanser', at: AT },
    { type: 'GO_TO_PURPOSE' },
    { type: 'SET_PURPOSE', entryId: 'step-1', purpose: 'to wash', at: AT },
    { type: 'COMPLETE_REVIEW', at: AT },
  ],
  expectedEvents: 1,
};

const exposureScenario: Scenario<ExposureLogState, ExposureAction> = {
  name: 'exposureReducer',
  reducer: exposureReducer,
  create: () => createExposureLog('purity'),
  actions: [
    { type: 'ADD_ENTRY', activity: 'walk to work', band: 'midday', setting: 'open', minutes: 20, at: AT },
    { type: 'REVIEW', at: AT },
  ],
  expectedEvents: 1,
};

const sorterScenario: Scenario<SorterState, SorterAction> = {
  name: 'sorterReducer',
  reducer: sorterReducer,
  create: () => createSorter('purity', specimen.specimenId),
  actions: [
    ...specimen.fragments.map(
      (fragment): SorterAction => ({
        type: 'PLACE',
        fragmentId: fragment.fragmentId,
        bucket: fragment.kind,
      }),
    ),
    { type: 'CHECK', at: AT },
    { type: 'COMPLETE', at: AT },
  ],
  expectedEvents: 2,
};

/** Run a scenario, applying `step` to each transition. */
function run(
  scenario: Scenario<EmittingState, unknown>,
  step: (state: EmittingState) => void,
): EmittingState {
  let state = scenario.create();
  for (const action of scenario.actions) {
    state = scenario.reducer(state, action);
    step(state);
  }
  return state;
}

describe('a reducer has no slot to put an effect in', () => {
  const arities: readonly [string, number][] = [
    ['sessionReducer', sessionReducer.length],
    ['reflectionReducer', reflectionReducer.length],
    ['exposureReducer', exposureReducer.length],
    ['sorterReducer', sorterReducer.length],
  ];

  for (const [name, arity] of arities) {
    it(`${name} takes exactly (state, action)`, () => {
      // A third parameter is how the sink got in last time. There isn't one to pass now.
      expect(arity).toBe(2);
    });
  }
});

describe.each([
  erased(sessionScenario),
  erased(reflectionScenario),
  erased(exposureScenario),
  erased(sorterScenario),
])('$name is pure', (scenario) => {
  it('produces deeply equal results when invoked twice, as StrictMode does', () => {
    let a = scenario.create();
    let b = scenario.create();
    for (const action of scenario.actions) {
      // Two independent invocations from the *same* previous state, the shape React's
      // double-invoke takes. Both must land on the same value.
      const first = scenario.reducer(a, action);
      const second = scenario.reducer(a, action);
      expect(first).toEqual(second);
      a = first;
      b = scenario.reducer(b, action);
    }
    expect(a).toEqual(b);
  });

  it('writes nothing to a sink or a ledger when invoked, only when drained', () => {
    const sink = createEventSink();
    const ledger = createMasteryLedger('purity');

    // Invoke every transition twice and drain neither.
    let state = scenario.create();
    for (const action of scenario.actions) {
      scenario.reducer(state, action);
      state = scenario.reducer(state, action);
    }
    expect(sink.all()).toEqual([]);
    expect(ledger.snapshot().attemptCount).toBe(0);

    // Now drain each transition once and the events appear, once each.
    let total = 0;
    run(scenario, (next) => {
      total += next.emitted.length;
      for (const event of next.emitted) sink.record(event);
    });
    expect(total).toBe(scenario.expectedEvents);
    expect(sink.all()).toHaveLength(scenario.expectedEvents);
  });

  it('replaces the outbox each transition rather than accumulating a log', () => {
    const seen: number[] = [];
    const final = run(scenario, (next) => seen.push(next.emitted.length));
    // If `emitted` accumulated, the last entry would equal the total.
    expect(final.emitted.length).toBeLessThanOrEqual(scenario.expectedEvents);
    expect(seen.reduce((sum, count) => sum + count, 0)).toBe(scenario.expectedEvents);
  });

  it('advances transitionId once per real transition and never backwards', () => {
    const ids: number[] = [];
    run(scenario, (next) => ids.push(next.transitionId));
    expect(ids[0]).toBe(1);
    for (let index = 1; index < ids.length; index += 1) {
      expect(ids[index]!).toBeGreaterThan(ids[index - 1]!);
    }
  });

  it('keeps state identity for an action that changes nothing', () => {
    const state = scenario.create();
    // An action no reducer declares, so every switch falls through to its default.
    expect(scenario.reducer(state, { type: '__not_an_action__' })).toBe(state);
  });
});

describe('the drain guard performs a transition at most once', () => {
  it('ignores a repeat of the same transitionId, however often the effect re-runs', () => {
    const sink = createEventSink();
    const drainOnce = createDrainGuard();
    const state = sessionReducer(createSession('purity', 'en', AT), { type: 'START_LESSON', at: AT });

    expect(drainOnce(state, sink)).toBe(true);
    // StrictMode mounts, unmounts and remounts the effect; the guard outlives that.
    expect(drainOnce(state, sink)).toBe(false);
    expect(drainOnce(state, sink)).toBe(false);
    expect(sink.countOf('lesson_started')).toBe(1);
  });

  it('runs the extra effect exactly once too', () => {
    const ledger = createMasteryLedger('purity');
    const drainOnce = createDrainGuard();
    let state = createSession('purity', 'en', AT, INGREDIENT_HALO_PLAN);
    for (const action of sessionScenario.actions) state = sessionReducer(state, action);

    const perform = (current: SessionState) => {
      if (current.recordedAttempt) ledger.record(current.recordedAttempt);
    };
    drainOnce(state, undefined, perform);
    drainOnce(state, undefined, perform);
    drainOnce(state, undefined, perform);
    expect(ledger.snapshot().attemptCount).toBe(1);
  });

  it('drains the empty outbox of a freshly created state without complaint', () => {
    const sink = createEventSink();
    const drainOnce = createDrainGuard();
    const state = createSession('purity', 'en', AT);
    expect(state.transitionId).toBe(0);
    expect(drainOnce(state, sink)).toBe(true);
    expect(sink.all()).toEqual([]);
  });
});

describe('one answer is one attempt, however many times the reducer runs', () => {
  it('records once even when every transition is invoked twice and drained twice', () => {
    const sink = createEventSink();
    const ledger = createMasteryLedger('purity');
    const drainOnce = createDrainGuard();
    const perform = (current: SessionState) => {
      if (current.recordedAttempt) ledger.record(current.recordedAttempt);
    };

    let state = createSession('purity', 'en', AT, INGREDIENT_HALO_PLAN);
    for (const action of sessionScenario.actions) {
      sessionReducer(state, action); // the discarded StrictMode invocation
      state = sessionReducer(state, action);
      drainOnce(state, sink, perform);
      drainOnce(state, sink, perform); // the repeated effect invocation
    }

    expect(ledger.snapshot().attemptCount).toBe(1);
    expect(sink.countOf('question_answered')).toBe(1);
    expect(sink.countOf('mastery_dimension_updated')).toBe(1);
    expect(sink.countOf('hint_used')).toBe(1);
    expect(sink.countOf('lesson_started')).toBe(1);
  });

  it('applySession folds the attempt into the ledger it is given, not the shared one', () => {
    const sink = createEventSink();
    const ledger = createMasteryLedger('purity');
    let state = createSession('purity', 'en', AT, INGREDIENT_HALO_PLAN);
    for (const action of sessionScenario.actions) {
      state = applySession(state, action, sink, ledger);
    }
    expect(ledger.snapshot().attemptCount).toBe(1);
    expect(ledger.snapshot().startedSkillIds).toEqual([INGREDIENT_HALO_PLAN.skillId]);
  });

  it('drainSession is idempotent for the same attempt, because the ledger is', () => {
    const ledger = createMasteryLedger('purity');
    let state = createSession('purity', 'en', AT, INGREDIENT_HALO_PLAN);
    for (const action of sessionScenario.actions) state = sessionReducer(state, action);
    drainSession(state, undefined, ledger);
    drainSession(state, undefined, ledger);
    expect(ledger.snapshot().attemptCount).toBe(1);
  });
});

describe('the apply helpers drain exactly what the reducer declared', () => {
  it('applyReflection emits the reflection event once', () => {
    const sink = createEventSink();
    let state = createReflection('purity');
    for (const action of reflectionScenario.actions) state = applyReflection(state, action, sink);
    expect(sink.countOf('reflection_completed')).toBe(1);
  });

  it('applyExposure emits the review event once', () => {
    const sink = createEventSink();
    let state = createExposureLog('purity');
    for (const action of exposureScenario.actions) state = applyExposure(state, action, sink);
    expect(sink.countOf('reflection_completed')).toBe(1);
  });

  it('applySorter emits the check and completion events once each', () => {
    const sink = createEventSink();
    let state = createSorter('purity', specimen.specimenId);
    for (const action of sorterScenario.actions) state = applySorter(state, action, sink);
    expect(sink.countOf('question_answered')).toBe(1);
    expect(sink.countOf('lesson_completed')).toBe(1);
  });

  it('an apply helper called with no sink still advances state', () => {
    let state = createReflection('purity');
    state = applyReflection(state, { type: 'ADD_STEP', label: 'toner', at: AT });
    expect(state.entries).toHaveLength(1);
    expect(state.emitted).toEqual([]);
  });
});

describe('no reducer module performs an effect', () => {
  const MODULES = [
    'src/app/learning-session.ts',
    'src/app/routine-reflection.ts',
    'src/app/exposure-log.ts',
    'src/app/label-sorter.ts',
  ] as const;

  for (const module of MODULES) {
    it(`${module} never calls a sink directly`, () => {
      const source = readFileSync(new URL(`../${module}`, import.meta.url), 'utf8');
      // The reducers declare events through `emit`; only `drainEvents` may reach a sink.
      expect(source).not.toMatch(/sink\??\.record\(/);
    });
  }

  it('learning-session touches a ledger only in its drain', () => {
    const source = readFileSync(new URL('../src/app/learning-session.ts', import.meta.url), 'utf8');
    // Case-insensitive on purpose: `masteryLedger.record(` is the exact call that caused the
    // original defect, and a case-sensitive `ledger.record(` would sail straight past it.
    const calls = [...source.matchAll(/[A-Za-z]*[Ll]edger\.record\(/g)];
    expect(calls.map((match) => match[0])).toEqual(['ledger.record(']);
    // And that one call is inside drainSession, not inside the transition table.
    expect(calls[0]!.index).toBeGreaterThan(source.indexOf('export function drainSession'));
  });

  it('the UI drains through the hook rather than calling the sink from a reducer', () => {
    const screens = [
      'src/ui/components/LessonRunner.tsx',
      'src/ui/screens/RoutineStudioScreen.tsx',
      'src/ui/screens/SunProtectionScreen.tsx',
      'src/ui/screens/LabelDetectiveScreen.tsx',
    ];
    for (const screen of screens) {
      const source = readFileSync(new URL(`../${screen}`, import.meta.url), 'utf8');
      expect(source).toMatch(/useTransitionDrain\(/);
      // No reducer call site may pass a sink as a third argument.
      expect(source).not.toMatch(/Reducer\(current, action, /);
    }
  });
});
