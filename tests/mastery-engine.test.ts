/**
 * Mastery engine tests.
 * Source: Master DB 19_MASTERY_RULES (M01-M06), AI Tutor Constitution §6.
 * Hard requirement: "A single correct answer must never create mastery."
 */
import { describe, expect, it } from 'vitest';
import type { Attempt, MasteryState } from '@/domain/learning';
import {
  MASTERY_THRESHOLDS,
  createMasteryState,
  governedMasteryRules,
  isMastered,
  recordAttempt,
} from '@/mastery/mastery-engine';

const AT = '2026-09-18T00:00:00.000Z';

const attempt = (overrides: Partial<Attempt> = {}): Attempt => ({
  attemptId: 'a1',
  userId: 'u1',
  nodeId: 'KN-D01-07-001',
  skillId: 'SK01',
  activityId: 'AUTHORED-ACT-001',
  correct: true,
  hintsUsed: 0,
  isTransfer: false,
  isRetention: false,
  at: AT,
  ...overrides,
});

const fold = (attempts: readonly Attempt[]): MasteryState =>
  attempts.reduce(
    (state, next) => recordAttempt(state, next),
    createMasteryState('u1', 'SK01', AT),
  );

describe('mastery thresholds come from the governed rules', () => {
  it('keeps the operational ratios stated in 19_MASTERY_RULES', () => {
    expect(MASTERY_THRESHOLDS.accuracy.ratio).toBe(0.8);
    expect(MASTERY_THRESHOLDS.independence.ratio).toBe(0.8);
    expect(MASTERY_THRESHOLDS.transfer.ratio).toBe(0.7);
  });

  it('exposes the six source rules unchanged', () => {
    expect(governedMasteryRules.map((rule) => rule.Rule_ID)).toEqual([
      'M01',
      'M02',
      'M03',
      'M04',
      'M05',
      'M06',
    ]);
  });
});

describe('a single correct answer is never mastery', () => {
  it('leaves every dimension unsatisfied after one correct attempt', () => {
    const state = fold([attempt()]);
    expect(isMastered(state)).toBe(false);
    expect(Object.values(state.dimensions).every((dimension) => !dimension.satisfied)).toBe(true);
  });

  it('stays unmastered even after a perfect run of accuracy alone', () => {
    const state = fold(Array.from({ length: 20 }, () => attempt()));
    expect(state.dimensions.accuracy.satisfied).toBe(true);
    expect(state.dimensions.transfer.satisfied).toBe(false);
    expect(state.dimensions.retention.satisfied).toBe(false);
    expect(isMastered(state)).toBe(false);
  });
});

describe('dimension accounting', () => {
  it('requires the minimum sample size before a ratio can satisfy a dimension', () => {
    const four = fold(Array.from({ length: 4 }, () => attempt()));
    expect(four.dimensions.accuracy.satisfied).toBe(false);
    const five = fold(Array.from({ length: 5 }, () => attempt()));
    expect(five.dimensions.accuracy.satisfied).toBe(true);
  });

  it('counts an answer with more than one hint as accurate but not independent', () => {
    const state = fold(Array.from({ length: 5 }, () => attempt({ hintsUsed: 2 })));
    expect(state.dimensions.accuracy.satisfied).toBe(true);
    expect(state.dimensions.independence.satisfied).toBe(false);
  });

  it('allows exactly one hint to still count as independent (M02)', () => {
    const state = fold(Array.from({ length: 5 }, () => attempt({ hintsUsed: 1 })));
    expect(state.dimensions.independence.satisfied).toBe(true);
  });

  it('only counts transfer and retention attempts in their own dimensions', () => {
    const state = fold([
      attempt(),
      attempt({ isTransfer: true }),
      attempt({ isRetention: true }),
    ]);
    expect(state.dimensions.accuracy.attempts).toBe(3);
    expect(state.dimensions.transfer.attempts).toBe(1);
    expect(state.dimensions.retention.attempts).toBe(1);
  });

  it('drops a dimension below threshold when the learner regresses', () => {
    const state = fold([
      ...Array.from({ length: 5 }, () => attempt()),
      ...Array.from({ length: 5 }, () => attempt({ correct: false })),
    ]);
    expect(state.dimensions.accuracy.satisfied).toBe(false);
  });
});

describe('reaching Mastered requires all four kinds of evidence', () => {
  const full = fold([
    ...Array.from({ length: 5 }, () => attempt()),
    ...Array.from({ length: 3 }, () => attempt({ isTransfer: true })),
    attempt({ isRetention: true }),
  ]);

  it('marks the skill Mastered only once every dimension is satisfied', () => {
    expect(full.dimensions.accuracy.satisfied).toBe(true);
    expect(full.dimensions.independence.satisfied).toBe(true);
    expect(full.dimensions.transfer.satisfied).toBe(true);
    expect(full.dimensions.retention.satisfied).toBe(true);
    expect(isMastered(full)).toBe(true);
    expect(full.state).toBe('Mastered');
  });

  it('keeps Mastered while a single miss still clears the threshold', () => {
    const stillMastered = recordAttempt(full, attempt({ correct: false }));
    expect(stillMastered.dimensions.accuracy.satisfied).toBe(true);
    expect(stillMastered.state).toBe('Mastered');
  });

  it('reopens to Developing once performance actually drops below threshold (M06)', () => {
    // `full` holds 9 correct attempts across all dimensions; 3 misses bring accuracy to
    // 9/12 = 75%, below the M01 threshold of 80%.
    const reopened = Array.from({ length: 3 }, () => attempt({ correct: false })).reduce(
      (state, next) => recordAttempt(state, next),
      full,
    );
    expect(reopened.dimensions.accuracy.satisfied).toBe(false);
    expect(isMastered(reopened)).toBe(false);
    expect(reopened.state).toBe('Developing');
  });

  it('records which nodes supplied the evidence', () => {
    const state = recordAttempt(full, attempt({ nodeId: 'KN-D02-04-001' }));
    expect(state.nodeEvidence).toEqual(['KN-D01-07-001', 'KN-D02-04-001']);
  });
});
