/**
 * The ingredient hunt.
 *
 * Two properties matter more than the rest and are asserted first: the game marks against the
 * governed Family column and nothing else, and a wrong tap costs the player nothing. The second
 * is not politeness — punishing errors runs against the evidence that retrieval plus feedback is
 * where learning happens, and it is the most complained-about mechanic in the apps that ship it.
 */
import { describe, expect, it } from 'vitest';
import { ingredients } from '@/knowledge/repository';
import {
  buildRound,
  familyFunction,
  huntReducer,
  huntResult,
  huntableFamilies,
  initialHuntState,
  type HuntState,
} from '@/app/ingredient-hunt';

/** Deterministic picker: always takes the first remaining item, so rounds are reproducible. */
const firstPick = () => 0;

const roundOf = (family: string, size = 9) => buildRound(family, size, firstPick);

const started = (family: string): HuntState =>
  huntReducer(initialHuntState, { type: 'start', round: roundOf(family) });

describe('a round is built from the database, never from a hand-written list', () => {
  it('includes every record of the family it asks for', () => {
    const round = roundOf('Humectant');
    const expected = ingredients
      .filter((item) => item.Family === 'Humectant')
      .map((item) => item.Ingredient_ID)
      .sort();
    expect([...round.targetIds].sort()).toEqual(expected);
  });

  it('fills the rest of the list with records from other families', () => {
    const round = roundOf('Humectant');
    const decoys = round.shown.filter((item) => item.Family !== 'Humectant');
    expect(decoys.length).toBeGreaterThan(0);
    expect(decoys.every((item) => item.Family !== 'Humectant')).toBe(true);
  });

  it('shows every target somewhere in the list, so the round is always winnable', () => {
    for (const family of huntableFamilies()) {
      const round = roundOf(family);
      const shownIds = new Set(round.shown.map((item) => item.Ingredient_ID));
      expect(round.targetIds.every((id) => shownIds.has(id)), family).toBe(true);
    }
  });

  it('never repeats a record within one list', () => {
    const round = roundOf('AHA');
    const ids = round.shown.map((item) => item.Ingredient_ID);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('offers only families the database has more than one record for', () => {
    for (const family of huntableFamilies()) {
      const count = ingredients.filter((item) => item.Family === family).length;
      expect(count, family).toBeGreaterThanOrEqual(2);
    }
  });

  it('puts the families the database grades Basic before the ones it grades Advanced', () => {
    // Otherwise the first thing a reader meets is "find every Rheology Modifier".
    const families = huntableFamilies();
    const hardest = (family: string) =>
      Math.max(
        ...ingredients
          .filter((item) => item.Family === family)
          .map((item) => ({ Basic: 0, Intermediate: 1, Advanced: 2 })[item.Level] ?? 1),
      );
    const levels = families.map(hardest);
    expect(levels).toEqual([...levels].sort((a, b) => a - b));
    expect(hardest(families[0]!)).toBe(0);
  });
});

describe('the family label uses the record’s own words, or none at all', () => {
  it('gives the shared Primary_Function when every record in the family agrees', () => {
    expect(familyFunction('Humectant')).toBe('보습');
  });

  it('gives nothing rather than averaging when the records disagree', () => {
    const disagreeing = huntableFamilies().find((family) => {
      const fns = new Set(
        ingredients.filter((i) => i.Family === family).map((i) => i.Primary_Function.trim()),
      );
      return fns.size > 1;
    });
    if (disagreeing) expect(familyFunction(disagreeing)).toBeNull();
  });

  it('gives nothing for a family that is not in the database', () => {
    expect(familyFunction('Not A Family')).toBeNull();
  });
});

describe('marking happens against the record, and a wrong tap costs nothing', () => {
  it('counts a pick correct only when the record carries that Family', () => {
    const state = started('Humectant');
    const target = state.round!.targetIds[0]!;
    const decoy = state.round!.shown.find((i) => !state.round!.targetIds.includes(i.Ingredient_ID))!;

    const picked = [target, decoy.Ingredient_ID].reduce(
      (acc, id) => huntReducer(acc, { type: 'toggle', ingredientId: id }),
      state,
    );
    const checked = huntReducer(picked, { type: 'check' });
    const result = huntResult(checked);

    expect(result.correct).toEqual([target]);
    expect(result.wrong).toEqual([decoy.Ingredient_ID]);
    expect(result.missed).toEqual(
      state.round!.targetIds.filter((id) => id !== target),
    );
  });

  it('has no score, no lives and no timer anywhere in its state', () => {
    const keys = Object.keys(initialHuntState);
    expect(keys).toEqual(['round', 'picked', 'revealed', 'roundsPlayed', 'learnedIds']);
    expect(JSON.stringify(initialHuntState)).not.toMatch(/score|lives|hearts|timer|streak|xp/i);
  });

  it('keeps everything the player learned when they get the next round wrong', () => {
    let state = started('Humectant');
    const target = state.round!.targetIds[0]!;
    state = huntReducer(state, { type: 'toggle', ingredientId: target });
    state = huntReducer(state, { type: 'check' });
    expect(state.learnedIds).toEqual([target]);

    // A whole round answered wrongly takes nothing away.
    state = huntReducer(state, { type: 'next', round: roundOf('AHA') });
    state = huntReducer(state, { type: 'check' });
    expect(state.learnedIds).toEqual([target]);
  });

  it('does not count the same record twice when it is found again', () => {
    let state = started('Humectant');
    const target = state.round!.targetIds[0]!;
    state = huntReducer(state, { type: 'toggle', ingredientId: target });
    state = huntReducer(state, { type: 'check' });
    state = huntReducer(state, { type: 'next', round: roundOf('Humectant') });
    state = huntReducer(state, { type: 'toggle', ingredientId: target });
    state = huntReducer(state, { type: 'check' });
    expect(state.learnedIds).toEqual([target]);
  });
});

describe('the reducer is pure and takes exactly (state, action)', () => {
  it('takes two parameters and no sink', () => {
    expect(huntReducer.length).toBe(2);
  });

  it('ignores a toggle once the answer has been revealed', () => {
    let state = started('Humectant');
    state = huntReducer(state, { type: 'check' });
    const after = huntReducer(state, { type: 'toggle', ingredientId: state.round!.shown[0]!.Ingredient_ID });
    expect(after).toBe(state);
  });

  it('ignores a second check on the same round', () => {
    let state = started('Humectant');
    state = huntReducer(state, { type: 'check' });
    expect(huntReducer(state, { type: 'check' })).toBe(state);
    expect(state.roundsPlayed).toBe(1);
  });

  it('clears the previous picks when the next round starts', () => {
    let state = started('Humectant');
    state = huntReducer(state, { type: 'toggle', ingredientId: state.round!.targetIds[0]! });
    state = huntReducer(state, { type: 'check' });
    state = huntReducer(state, { type: 'next', round: roundOf('AHA') });
    expect(state.picked).toEqual([]);
    expect(state.revealed).toBe(false);
  });

  it('returns an empty result when there is no round yet', () => {
    expect(huntResult(initialHuntState)).toEqual({ correct: [], missed: [], wrong: [] });
  });
});
