/**
 * The review queue.
 *
 * The property worth guarding first is the one that separates a scheduler from a score: an
 * interval is this app's own policy about when to ask again, and it says nothing about how much
 * anyone has learned. Nothing here reaches the mastery ledger, and a missed day costs the run
 * and nothing else.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ingredients } from '@/knowledge/repository';
import { buildRound } from '@/app/ingredient-hunt';
import {
  REVIEW_INTERVALS,
  addDays,
  dayOf,
  dueIds,
  emptyQueue,
  loadQueue,
  saveQueue,
  trackedCount,
  withMissed,
  withRecognised,
} from '@/app/review-queue';

const at = (iso: string) => new Date(`${iso}T09:00:00Z`);
const knownIds = new Set(ingredients.map((item) => item.Ingredient_ID));

describe('an item comes back sooner when missed and later when recognised', () => {
  it('brings a missed item back tomorrow', () => {
    const queue = withMissed(emptyQueue, 'ING-001', at('2026-09-20'));
    expect(queue['ING-001']?.dueOn).toBe('2026-09-21');
    expect(queue['ING-001']?.run).toBe(0);
  });

  it('pushes a recognised item further out each time, along the published steps', () => {
    let queue = emptyQueue;
    const seen: string[] = [];
    for (let round = 0; round < REVIEW_INTERVALS.length; round += 1) {
      queue = withRecognised(queue, 'ING-001', at('2026-09-20'));
      seen.push(queue['ING-001']!.dueOn);
    }
    expect(seen).toEqual(REVIEW_INTERVALS.map((days) => addDays(at('2026-09-20'), days)));
  });

  it('holds at the last step rather than growing without limit', () => {
    let queue = emptyQueue;
    for (let round = 0; round < 20; round += 1) {
      queue = withRecognised(queue, 'ING-001', at('2026-09-20'));
    }
    const last = REVIEW_INTERVALS.at(-1)!;
    expect(queue['ING-001']?.dueOn).toBe(addDays(at('2026-09-20'), last));
  });

  it('resets the run on a miss, so a forgotten item is asked again soon', () => {
    let queue = withRecognised(withRecognised(emptyQueue, 'ING-001', at('2026-09-20')), 'ING-001', at('2026-09-20'));
    expect(queue['ING-001']?.run).toBe(2);
    queue = withMissed(queue, 'ING-001', at('2026-09-25'));
    expect(queue['ING-001']?.run).toBe(0);
    expect(queue['ING-001']?.dueOn).toBe('2026-09-26');
  });

  it('a miss costs the run and nothing else — other items are untouched', () => {
    let queue = withRecognised(emptyQueue, 'ING-002', at('2026-09-20'));
    const before = queue['ING-002'];
    queue = withMissed(queue, 'ING-001', at('2026-09-20'));
    expect(queue['ING-002']).toEqual(before);
    expect(trackedCount(queue)).toBe(2);
  });
});

describe('due is a date comparison, never a score', () => {
  it('lists what is due today and earlier, soonest first', () => {
    let queue = withMissed(emptyQueue, 'ING-001', at('2026-09-18')); // due 09-19
    queue = withMissed(queue, 'ING-002', at('2026-09-19')); // due 09-20
    queue = withRecognised(queue, 'ING-003', at('2026-09-20')); // due 09-21
    expect(dueIds(queue, at('2026-09-20'))).toEqual(['ING-001', 'ING-002']);
  });

  it('lists nothing when everything is scheduled ahead', () => {
    const queue = withRecognised(emptyQueue, 'ING-001', at('2026-09-20'));
    expect(dueIds(queue, at('2026-09-20'))).toEqual([]);
  });

  it('has no field anywhere that could be read as a score or a level', () => {
    const queue = withRecognised(emptyQueue, 'ING-001', at('2026-09-20'));
    expect(Object.keys(queue['ING-001']!).sort()).toEqual(['dueOn', 'id', 'run']);
    expect(JSON.stringify(queue)).not.toMatch(/score|level|xp|points|rank|grade/i);
  });

  it('is not imported by the mastery ledger, in either direction', () => {
    const ledger = readFileSync(new URL('../src/mastery/mastery-ledger.ts', import.meta.url), 'utf8');
    expect(ledger).not.toMatch(/review|queue|due|interval/i);
    const queue = readFileSync(new URL('../src/app/review-queue.ts', import.meta.url), 'utf8');
    expect(queue).not.toMatch(/from '@\/mastery/);
  });
});

describe('a round carries the reader’s due items without becoming a separate chore', () => {
  it('prefers due records as decoys when there are any', () => {
    const humectants = new Set(
      ingredients.filter((i) => i.Family === 'Humectant').map((i) => i.Ingredient_ID),
    );
    const due = ingredients
      .filter((i) => !humectants.has(i.Ingredient_ID))
      .slice(0, 3)
      .map((i) => i.Ingredient_ID);

    const round = buildRound('Humectant', 9, () => 0, due);
    const shown = new Set(round.shown.map((i) => i.Ingredient_ID));
    for (const id of due) expect(shown.has(id), id).toBe(true);
  });

  it('still marks against the family, never against what was due', () => {
    const due = ingredients.filter((i) => i.Family !== 'AHA').slice(0, 3).map((i) => i.Ingredient_ID);
    const round = buildRound('AHA', 9, () => 0, due);
    const expected = ingredients.filter((i) => i.Family === 'AHA').map((i) => i.Ingredient_ID);
    expect([...round.targetIds].sort()).toEqual([...expected].sort());
    for (const id of due) expect(round.targetIds).not.toContain(id);
  });

  it('builds the same round with or without a due list when nothing is due', () => {
    const withNone = buildRound('Humectant', 9, () => 0);
    const withEmpty = buildRound('Humectant', 9, () => 0, []);
    expect(withEmpty.shown.map((i) => i.Ingredient_ID)).toEqual(
      withNone.shown.map((i) => i.Ingredient_ID),
    );
  });
});

describe('stored state is a convenience and is never trusted', () => {
  it('returns an empty queue with no storage, a throwing read, or rubbish', () => {
    expect(loadQueue(undefined, knownIds)).toEqual(emptyQueue);
    expect(loadQueue({ getItem() { throw new Error('blocked'); } }, knownIds)).toEqual(emptyQueue);
    for (const raw of ['not json', '[]', 'null', '"text"']) {
      expect(loadQueue({ getItem: () => raw }, knownIds)).toEqual(emptyQueue);
    }
  });

  it('drops entries for ids the database does not have', () => {
    const raw = JSON.stringify({
      'ING-001': { id: 'ING-001', dueOn: '2026-09-21', run: 1 },
      'ING-999': { id: 'ING-999', dueOn: '2026-09-21', run: 1 },
    });
    expect(Object.keys(loadQueue({ getItem: () => raw }, knownIds))).toEqual(['ING-001']);
  });

  it('drops an entry whose due date is not a date', () => {
    const raw = JSON.stringify({ 'ING-001': { id: 'ING-001', dueOn: 'tomorrow', run: 1 } });
    expect(loadQueue({ getItem: () => raw }, knownIds)).toEqual(emptyQueue);
  });

  it('repairs a nonsense run rather than storing it', () => {
    const raw = JSON.stringify({ 'ING-001': { id: 'ING-001', dueOn: '2026-09-21', run: -5 } });
    expect(loadQueue({ getItem: () => raw }, knownIds)['ING-001']?.run).toBe(0);
  });

  it('does not throw when the write fails', () => {
    expect(() =>
      saveQueue({ setItem() { throw new Error('quota'); } }, emptyQueue),
    ).not.toThrow();
  });

  it('formats days as plain ISO dates', () => {
    expect(dayOf(at('2026-09-20'))).toBe('2026-09-20');
    expect(addDays(at('2026-12-31'), 1)).toBe('2027-01-01');
  });
});
