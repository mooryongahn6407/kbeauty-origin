/**
 * Claim vs observation — QST-012.
 *
 * The property that makes this exercise safe to ship on an unverified corpus, and the first
 * thing asserted here: the correct answer never depends on whether a statement is true. "천연
 * 성분이 더 순하다" sorts as a conclusion either way, and no `why` text in the data argues for
 * or against any statement's content.
 */
import { describe, expect, it } from 'vitest';
import {
  CLAIM_BUCKETS,
  allPlaced,
  bucketNote,
  claimSorterReducer,
  claimStatements,
  correctIds,
  initialClaimSorter,
  misplacedIds,
  type ClaimSorterState,
} from '@/app/claim-sorter';

const placeAll = (correct: boolean): ClaimSorterState =>
  claimStatements.reduce<ClaimSorterState>(
    (state, statement) =>
      claimSorterReducer(state, {
        type: 'place',
        statementId: statement.statementId,
        bucket: correct
          ? statement.kind
          : statement.kind === 'OBSERVATION'
            ? 'CLAIM'
            : 'OBSERVATION',
      }),
    initialClaimSorter,
  );

describe('the exercise asserts nothing about the statements themselves', () => {
  it('sorts by kind, and both kinds are represented', () => {
    const kinds = new Set(claimStatements.map((statement) => statement.kind));
    expect([...kinds].sort()).toEqual([...CLAIM_BUCKETS].sort());
  });

  it('never claims a statement is true or false in its explanation', () => {
    // A `why` that argued the content would turn a sorting exercise into an assertion.
    for (const statement of claimStatements) {
      for (const [locale, why] of Object.entries(statement.why)) {
        expect(why, `${statement.statementId}/${locale}`).not.toMatch(
          /\b(is true|is false|is correct|is wrong|proven|scientifically)\b/i,
        );
      }
    }
  });

  it('carries no scientific, ingredient or product claim in the statements it ships', () => {
    for (const statement of claimStatements) {
      for (const [locale, text] of Object.entries(statement.text)) {
        expect(text, `${statement.statementId}/${locale}`).not.toMatch(
          /\b(SPF|retinol|niacinamide|hyaluronic|cures?|treats?|guaranteed|clinically)\b/i,
        );
      }
    }
  });

  it('gives every statement a reason and a translation in all five catalogs', () => {
    for (const statement of claimStatements) {
      for (const locale of ['en', 'ko', 'fr', 'lo', 'th']) {
        expect(statement.text[locale], `${statement.statementId} text/${locale}`).toBeTruthy();
        expect(statement.why[locale], `${statement.statementId} why/${locale}`).toBeTruthy();
      }
    }
    for (const locale of ['en', 'ko', 'fr', 'lo', 'th']) {
      expect(bucketNote[locale], `bucketNote/${locale}`).toBeTruthy();
    }
  });
});

describe('sorting is marked against the data and costs nothing to get wrong', () => {
  it('marks every statement correct when each goes to its own kind', () => {
    const checked = claimSorterReducer(placeAll(true), { type: 'check' });
    expect(correctIds(checked)).toHaveLength(claimStatements.length);
    expect(misplacedIds(checked)).toEqual([]);
  });

  it('marks every statement misplaced when each goes to the other bucket', () => {
    const checked = claimSorterReducer(placeAll(false), { type: 'check' });
    expect(correctIds(checked)).toEqual([]);
    expect(misplacedIds(checked)).toHaveLength(claimStatements.length);
  });

  it('lets a statement be moved before the check', () => {
    const id = claimStatements[0]!.statementId;
    let state = claimSorterReducer(initialClaimSorter, { type: 'place', statementId: id, bucket: 'CLAIM' });
    state = claimSorterReducer(state, { type: 'place', statementId: id, bucket: 'OBSERVATION' });
    expect(state.placements[id]).toBe('OBSERVATION');
  });

  it('refuses to check until everything is placed', () => {
    const id = claimStatements[0]!.statementId;
    const state = claimSorterReducer(initialClaimSorter, { type: 'place', statementId: id, bucket: 'CLAIM' });
    expect(allPlaced(state)).toBe(false);
    expect(claimSorterReducer(state, { type: 'check' })).toBe(state);
  });

  it('has no score field in its state', () => {
    expect(Object.keys(initialClaimSorter)).toEqual(['placements', 'revealed']);
  });
});

describe('the reducer is pure and takes exactly (state, action)', () => {
  it('takes two parameters and no sink', () => {
    expect(claimSorterReducer.length).toBe(2);
  });

  it('ignores a statement id the data does not have', () => {
    const state = claimSorterReducer(initialClaimSorter, {
      type: 'place',
      statementId: 'CVO-999',
      bucket: 'CLAIM',
    });
    expect(state).toBe(initialClaimSorter);
  });

  it('ignores a placement once revealed', () => {
    const checked = claimSorterReducer(placeAll(true), { type: 'check' });
    const id = claimStatements[0]!.statementId;
    expect(claimSorterReducer(checked, { type: 'place', statementId: id, bucket: 'CLAIM' })).toBe(checked);
  });

  it('resets to an empty board', () => {
    const checked = claimSorterReducer(placeAll(true), { type: 'check' });
    expect(claimSorterReducer(checked, { type: 'reset' })).toEqual(initialClaimSorter);
  });
});
