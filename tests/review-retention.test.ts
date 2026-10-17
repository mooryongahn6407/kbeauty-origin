/**
 * Spaced reviews are the retention evidence.
 *
 * M04 Retention asks for a "pass after scheduled review", and before this every attempt the app
 * recorded was flagged non-recall, so no skill could ever be mastered. An answer about an item
 * the review queue had scheduled is that scheduled check: it reaches the ledger as a retention
 * attempt. Ordinary practice does not, and the thresholds themselves are untouched.
 */
import { describe, expect, it } from 'vitest';
import nodeSkillMap from '../data/source/node-skill-map.json';
import questNodeMap from '../data/source/quest-node-map.json';
import { ingredients } from '@/knowledge/repository';
import {
  HUNT_NODE_ID,
  HUNT_QUEST_ID,
  HUNT_SKILL_ID,
  buildRound,
  huntReducer,
  initialHuntState,
  reviewAnswers,
  reviewAttempts,
} from '@/app/ingredient-hunt';
import { createMasteryLedger } from '@/mastery/mastery-ledger';
import { MASTERY_THRESHOLDS } from '@/mastery/mastery-engine';

const firstPick = () => 0;
const humectants = ingredients.filter((item) => item.Family === 'Humectant').map((i) => i.Ingredient_ID);
const decoyId = ingredients.find((item) => item.Family !== 'Humectant')!.Ingredient_ID;

const markedRound = (picked: readonly string[], due: readonly string[]) => {
  let state = huntReducer(initialHuntState, {
    type: 'start',
    round: buildRound('Humectant', 9, firstPick, due),
  });
  for (const id of picked) state = huntReducer(state, { type: 'toggle', ingredientId: id });
  return huntReducer(state, { type: 'check' });
};

describe('the hunt evidence lands on the governed quest, node and skill', () => {
  it('uses the Core node of QST-009 and that node\'s Primary skill', () => {
    const core = (questNodeMap as { records: { Quest_ID: string; Node_ID: string; Role: string }[] }).records.find(
      (row) => row.Quest_ID === HUNT_QUEST_ID && row.Role === 'Core',
    );
    expect(core?.Node_ID).toBe(HUNT_NODE_ID);
    const primary = (nodeSkillMap as { records: { Node_ID: string; Skill_ID: string; Relationship: string }[] }).records.find(
      (row) => row.Node_ID === HUNT_NODE_ID && row.Relationship === 'Primary',
    );
    expect(primary?.Skill_ID).toBe(HUNT_SKILL_ID);
  });
});

describe('only due items count as reviews', () => {
  it('returns nothing when nothing was due', () => {
    expect(reviewAnswers(markedRound(humectants, []), [])).toEqual([]);
  });

  it('marks a due target right when picked, and a due decoy right when left alone', () => {
    const target = humectants[0]!;
    const state = markedRound([target], [target, decoyId]);
    const answers = reviewAnswers(state, [target, decoyId]);
    expect(answers).toContainEqual({ id: target, correct: true });
    expect(answers).toContainEqual({ id: decoyId, correct: true });
  });

  it('marks a due decoy wrong when it was picked', () => {
    const state = markedRound([decoyId], [decoyId]);
    expect(reviewAnswers(state, [decoyId])).toEqual([{ id: decoyId, correct: false }]);
  });

  it('says nothing before the round is marked', () => {
    const state = huntReducer(initialHuntState, {
      type: 'start',
      round: buildRound('Humectant', 9, firstPick, [decoyId]),
    });
    expect(reviewAnswers(state, [decoyId])).toEqual([]);
  });
});

describe('review answers are retention attempts, and retention can now be met', () => {
  it('flags every review attempt as recall, with no hints and no transfer', () => {
    const attempts = reviewAttempts([{ id: decoyId, correct: true }], 'u', '2026-10-18T09:00:00.000Z');
    expect(attempts).toHaveLength(1);
    expect(attempts[0]).toMatchObject({
      isRetention: true,
      isTransfer: false,
      hintsUsed: 0,
      skillId: HUNT_SKILL_ID,
      nodeId: HUNT_NODE_ID,
    });
  });

  it('satisfies the retention dimension after a passed review, with thresholds unchanged', () => {
    expect(MASTERY_THRESHOLDS.retention).toEqual({ ratio: 1.0, minAttempts: 1, ruleId: 'M04' });
    const ledger = createMasteryLedger('u');
    expect(ledger.stateFor(HUNT_SKILL_ID).dimensions.retention.satisfied).toBe(false);
    for (const attempt of reviewAttempts([{ id: decoyId, correct: true }], 'u', '2026-10-18T09:00:00.000Z')) {
      ledger.record(attempt);
    }
    expect(ledger.stateFor(HUNT_SKILL_ID).dimensions.retention).toEqual({
      attempts: 1,
      successes: 1,
      satisfied: true,
    });
  });

  it('does not satisfy retention from a failed review', () => {
    const ledger = createMasteryLedger('u');
    for (const attempt of reviewAttempts([{ id: decoyId, correct: false }], 'u', '2026-10-18T09:00:00.000Z')) {
      ledger.record(attempt);
    }
    expect(ledger.stateFor(HUNT_SKILL_ID).dimensions.retention.satisfied).toBe(false);
  });

  it('records one review once, however often it is written', () => {
    const ledger = createMasteryLedger('u');
    const attempts = reviewAttempts([{ id: decoyId, correct: true }], 'u', '2026-10-18T09:00:00.000Z');
    for (const attempt of [...attempts, ...attempts]) ledger.record(attempt);
    expect(ledger.snapshot().attemptCount).toBe(1);
  });
});
