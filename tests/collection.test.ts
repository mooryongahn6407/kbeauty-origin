/**
 * The collection, the streak and the store gift.
 *
 * The tests that matter most here are not about counting. They are the ones that hold the line
 * CLAUDE.md rule 9 draws: a voucher redeemed in a shop is commercial status, and commercial
 * status must not reach the mastery ledger or be computed from it.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { concerns } from '@/knowledge/repository';
import { createMasteryLedger } from '@/mastery/mastery-ledger';
import {
  currentStreak,
  dayOf,
  emptyCollection,
  issueGift,
  loadCollection,
  saveCollection,
  withDiscovered,
  withVisit,
  TOTAL_COLLECTABLE,
} from '@/app/collection';

const day = (iso: string) => new Date(`${iso}T09:00:00Z`);

describe('the shelf counts real records, never invented ones', () => {
  it('has exactly one slot per governed concern', () => {
    expect(TOTAL_COLLECTABLE).toBe(concerns.length);
    expect(TOTAL_COLLECTABLE).toBe(15);
  });

  it('only accepts Concern_IDs that exist in the database', () => {
    const state = withDiscovered(emptyCollection, ['CON-001', 'CON-999', 'not-an-id']);
    expect(state.discoveredConcernIds).toEqual(['CON-001']);
  });

  it('does not double-count a concern opened twice', () => {
    const once = withDiscovered(emptyCollection, ['CON-001', 'CON-002']);
    const twice = withDiscovered(once, ['CON-001']);
    expect(twice.discoveredConcernIds).toHaveLength(2);
  });
});

describe('the streak counts days, and stops counting when a day is missed', () => {
  it('is zero before anyone has visited', () => {
    expect(currentStreak(emptyCollection, day('2026-09-20'))).toBe(0);
  });

  it('counts consecutive days ending today', () => {
    const state = { ...emptyCollection, visitDays: ['2026-09-18', '2026-09-19', '2026-09-20'] };
    expect(currentStreak(state, day('2026-09-20'))).toBe(3);
  });

  it('breaks on a gap rather than counting every visit ever made', () => {
    const state = { ...emptyCollection, visitDays: ['2026-09-01', '2026-09-19', '2026-09-20'] };
    expect(currentStreak(state, day('2026-09-20'))).toBe(2);
  });

  it('survives until the day is over, so an evening visit is not erased at midnight', () => {
    const state = { ...emptyCollection, visitDays: ['2026-09-19', '2026-09-20'] };
    expect(currentStreak(state, day('2026-09-21'))).toBe(2);
  });

  it('records a day once, however many times the app is opened', () => {
    const first = withVisit(emptyCollection, day('2026-09-20'));
    const second = withVisit(first, day('2026-09-20'));
    expect(second.visitDays).toEqual(['2026-09-20']);
    expect(second).toBe(first);
  });
});

describe('the gift is commercial, and stays out of the mastery ledger', () => {
  it('is issued for finishing, and takes no score, answer or mastery state', () => {
    // If a score could change the gift, the journey would become a test with a prize. The
    // signature is the whole guarantee: a date, and nothing else.
    expect(issueGift.length).toBe(1);
    expect(issueGift(day('2026-09-20')).code).toBe(issueGift(day('2026-09-20')).code);
  });

  it('carries no personal data — only the day and a checksum over it', () => {
    const gift = issueGift(day('2026-09-20'));
    expect(gift.code).toBe('KG-260920-21');
    expect(gift.issuedOn).toBe('2026-09-20');
  });

  it('changes day to day, so a shop can tell today’s code from last month’s', () => {
    expect(issueGift(day('2026-09-20')).code).not.toBe(issueGift(day('2026-09-21')).code);
  });

  it('never appears in the mastery ledger, and the ledger never gains a way to grant one', () => {
    const ledger = createMasteryLedger('test-reader');
    issueGift(day('2026-09-20'));
    withDiscovered(withVisit(emptyCollection, day('2026-09-20')), ['CON-001']);
    const snapshot = ledger.snapshot();
    expect(snapshot.states).toEqual([]);
    expect(snapshot.attemptCount).toBe(0);
    // Nothing about a shelf, a streak or a voucher exists anywhere in what the ledger reports.
    expect(JSON.stringify(snapshot)).not.toMatch(/gift|shelf|streak|voucher|KG-/i);
    // The ledger's surface is record/stateFor/snapshot/reset and nothing else (rule 9).
    expect(Object.keys(ledger).sort()).toEqual(['record', 'reset', 'snapshot', 'stateFor']);
  });

  it('is not imported anywhere under src/mastery/, in either direction', () => {
    const source = readFileSync(new URL('../src/mastery/mastery-ledger.ts', import.meta.url), 'utf8');
    expect(source).not.toMatch(/collection|gift|voucher|streak/i);
  });
});

describe('browser storage is a convenience, never a source of truth', () => {
  it('returns an empty collection when there is no storage at all', () => {
    expect(loadCollection(undefined)).toEqual(emptyCollection);
  });

  it('returns an empty collection when the read throws, as a private window can', () => {
    const throwing = {
      getItem() {
        throw new Error('blocked');
      },
    };
    expect(loadCollection(throwing)).toEqual(emptyCollection);
  });

  it('survives stored rubbish rather than trusting it', () => {
    for (const raw of ['not json', '[]', 'null', '{"visitDays":"yesterday"}', '{"discoveredConcernIds":[1,2]}']) {
      expect(loadCollection({ getItem: () => raw })).toEqual(emptyCollection);
    }
  });

  it('drops a stored id that is not a governed concern', () => {
    const raw = JSON.stringify({ discoveredConcernIds: ['CON-001', 'CON-999'], visitDays: [] });
    expect(loadCollection({ getItem: () => raw }).discoveredConcernIds).toEqual(['CON-001']);
  });

  it('does not throw when the write fails, as a full quota does', () => {
    expect(() =>
      saveCollection(
        {
          setItem() {
            throw new Error('quota');
          },
        },
        emptyCollection,
      ),
    ).not.toThrow();
  });

  it('keeps the visit log bounded, so it cannot grow without limit', () => {
    let state = emptyCollection;
    for (let index = 0; index < 200; index += 1) {
      const date = new Date(Date.UTC(2026, 0, 1));
      date.setUTCDate(date.getUTCDate() + index);
      state = withVisit(state, date);
    }
    expect(state.visitDays.length).toBeLessThanOrEqual(90);
    expect(state.visitDays.at(-1)).toBe(dayOf(new Date(Date.UTC(2026, 0, 1 + 199))));
  });
});
