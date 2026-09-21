/**
 * Routine Order — QST-006 and QST-007.
 *
 * The property worth guarding above the rest: the answer is an Approved record, read verbatim.
 * These are the only ten rows in the Master Database with Status=Approved, which is the whole
 * reason this screen may show an order at all, and a test that let the answer drift away from
 * the record would quietly turn the one grounded exercise into an invented one.
 */
import { describe, expect, it } from 'vitest';
import { routines } from '@/knowledge/repository';
import {
  buildOrderRound,
  initialOrderState,
  isSolved,
  orderableRoutines,
  placedMarks,
  routineOrderReducer,
  splitSequence,
  type OrderState,
} from '@/app/routine-order';

const firstPick = () => 0;
const amBasic = routines.find((routine) => routine.Routine_ID === 'RUT-001')!;

const startedWith = (routineId: string): OrderState => {
  const routine = routines.find((item) => item.Routine_ID === routineId)!;
  return routineOrderReducer(initialOrderState, {
    type: 'start',
    round: buildOrderRound(routine, firstPick),
  });
};

const placeAll = (state: OrderState, steps: readonly string[]): OrderState =>
  steps.reduce((acc, step) => routineOrderReducer(acc, { type: 'place', step }), state);

describe('the answer is an Approved record, read verbatim', () => {
  it('only offers routines the database has approved', () => {
    for (const routine of orderableRoutines()) {
      expect(routine.Status, routine.Routine_ID).toBe('Approved');
    }
  });

  it('takes the order from Default_Sequence and changes none of the words', () => {
    const round = buildOrderRound(amBasic, firstPick);
    expect(round.answer).toEqual(['정돈', '선택적 트리트먼트', '보습', '자외선 보호']);
    expect(round.answer.join(' → ')).toBe(amBasic.Default_Sequence);
  });

  it('offers only records whose sequence is an ordered list, not a description', () => {
    // RUT-004's "가벼운 세정/보습 + 외부활동 보호" is prose; asking for its "order" is nonsense.
    const offered = orderableRoutines().map((routine) => routine.Routine_ID);
    expect(offered).toContain('RUT-001');
    expect(offered).not.toContain('RUT-004');
    for (const id of offered) {
      const routine = routines.find((item) => item.Routine_ID === id)!;
      expect(splitSequence(routine.Default_Sequence).length, id).toBeGreaterThanOrEqual(2);
    }
  });

  it('shuffles exactly the steps of the answer — none added, none dropped', () => {
    for (const routine of orderableRoutines()) {
      const round = buildOrderRound(routine, firstPick);
      expect([...round.shuffled].sort(), routine.Routine_ID).toEqual([...round.answer].sort());
    }
  });
});

describe('marking compares against the record, and a wrong order costs nothing', () => {
  it('accepts the record’s order', () => {
    const state = placeAll(startedWith('RUT-001'), amBasic.Default_Sequence.split('→').map((s) => s.trim()));
    const checked = routineOrderReducer(state, { type: 'check' });
    expect(isSolved(checked)).toBe(true);
    expect(checked.solvedIds).toEqual(['RUT-001']);
  });

  it('rejects any other order, and marks which rows were right', () => {
    const wrongOrder = ['보습', '정돈', '선택적 트리트먼트', '자외선 보호'];
    const checked = routineOrderReducer(placeAll(startedWith('RUT-001'), wrongOrder), { type: 'check' });
    expect(isSolved(checked)).toBe(false);
    expect(placedMarks(checked)).toEqual([false, false, false, true]);
    expect(checked.solvedIds).toEqual([]);
  });

  it('lets a step be taken back before the check', () => {
    let state = placeAll(startedWith('RUT-001'), ['보습', '정돈']);
    expect(state.placed).toEqual(['보습', '정돈']);
    state = routineOrderReducer(state, { type: 'unplace', step: '보습' });
    expect(state.placed).toEqual(['정돈']);
  });

  it('refuses to check before every slot is filled', () => {
    const state = placeAll(startedWith('RUT-001'), ['정돈']);
    expect(routineOrderReducer(state, { type: 'check' })).toBe(state);
  });

  it('keeps what was already solved when a later routine is answered wrongly', () => {
    let state = placeAll(startedWith('RUT-001'), ['정돈', '선택적 트리트먼트', '보습', '자외선 보호']);
    state = routineOrderReducer(state, { type: 'check' });
    expect(state.solvedIds).toEqual(['RUT-001']);

    const pm = routines.find((routine) => routine.Routine_ID === 'RUT-002')!;
    state = routineOrderReducer(state, { type: 'next', round: buildOrderRound(pm, firstPick) });
    state = placeAll(state, [...splitSequence(pm.Default_Sequence)].reverse());
    state = routineOrderReducer(state, { type: 'check' });
    expect(state.solvedIds).toEqual(['RUT-001']);
  });

  it('has no score field anywhere in its state', () => {
    expect(Object.keys(initialOrderState)).toEqual(['round', 'placed', 'revealed', 'solvedIds']);
    expect(JSON.stringify(initialOrderState)).not.toMatch(/score|lives|hearts|timer|xp/i);
  });
});

describe('the reducer is pure and takes exactly (state, action)', () => {
  it('takes two parameters and no sink', () => {
    expect(routineOrderReducer.length).toBe(2);
  });

  it('ignores a step that is not in this round', () => {
    const state = startedWith('RUT-001');
    expect(routineOrderReducer(state, { type: 'place', step: '샴푸' })).toBe(state);
  });

  it('ignores placing the same step twice', () => {
    const state = placeAll(startedWith('RUT-001'), ['정돈']);
    expect(routineOrderReducer(state, { type: 'place', step: '정돈' })).toBe(state);
  });

  it('ignores placing and unplacing once revealed', () => {
    let state = placeAll(startedWith('RUT-001'), ['정돈', '선택적 트리트먼트', '보습', '자외선 보호']);
    state = routineOrderReducer(state, { type: 'check' });
    expect(routineOrderReducer(state, { type: 'unplace', step: '정돈' })).toBe(state);
    expect(routineOrderReducer(state, { type: 'check' })).toBe(state);
  });

  it('clears the board for the next routine', () => {
    let state = placeAll(startedWith('RUT-001'), ['정돈', '선택적 트리트먼트', '보습', '자외선 보호']);
    state = routineOrderReducer(state, { type: 'check' });
    const pm = routines.find((routine) => routine.Routine_ID === 'RUT-002')!;
    state = routineOrderReducer(state, { type: 'next', round: buildOrderRound(pm, firstPick) });
    expect(state.placed).toEqual([]);
    expect(state.revealed).toBe(false);
  });
});
