/**
 * Claim vs observation — QST-012 "Retinol Myth Lab", whose win condition is "주장과 사실 구분".
 *
 * Eight sentences, two buckets: something another person could go and check, or someone telling
 * you what to conclude. It is the skill the whole app is built on — SK01 Observe, "관찰 가능한
 * 사실과 주관적 느낌을 구분해 기록" — and it is the one exercise that works *better* for being
 * unable to assert anything, because the answer never depends on whether a claim is true.
 *
 * "Natural ingredients are gentler" sorts as a claim whether or not it is correct, and the
 * reason given says exactly that: it is the kind of sentence that would need evidence behind
 * it. The app takes no position on the sentence itself.
 *
 * Pure `(state, action)` (rule 16).
 */
import data from '../../data/authored/claim-vs-observation.json';

export const CLAIM_BUCKETS = ['OBSERVATION', 'CLAIM'] as const;
export type ClaimBucket = (typeof CLAIM_BUCKETS)[number];

export interface ClaimStatement {
  readonly statementId: string;
  readonly kind: ClaimBucket;
  readonly text: Readonly<Record<string, string>>;
  readonly why: Readonly<Record<string, string>>;
}

export const claimStatements = data.statements as readonly ClaimStatement[];
export const bucketNote = data.bucketNote as Readonly<Record<string, string>>;

export interface ClaimSorterState {
  /** statementId → the bucket the player put it in. */
  readonly placements: Readonly<Record<string, ClaimBucket>>;
  readonly revealed: boolean;
}

export type ClaimSorterAction =
  | { readonly type: 'place'; readonly statementId: string; readonly bucket: ClaimBucket }
  | { readonly type: 'check' }
  | { readonly type: 'reset' };

export const initialClaimSorter: ClaimSorterState = { placements: {}, revealed: false };

export const allPlaced = (state: ClaimSorterState): boolean =>
  claimStatements.every((statement) => state.placements[statement.statementId] !== undefined);

/** Which statements sit in the bucket the data says they belong to. Never a score. */
export const correctIds = (state: ClaimSorterState): readonly string[] =>
  claimStatements
    .filter((statement) => state.placements[statement.statementId] === statement.kind)
    .map((statement) => statement.statementId);

export const misplacedIds = (state: ClaimSorterState): readonly string[] =>
  claimStatements
    .filter((statement) => {
      const placed = state.placements[statement.statementId];
      return placed !== undefined && placed !== statement.kind;
    })
    .map((statement) => statement.statementId);

export function claimSorterReducer(
  state: ClaimSorterState,
  action: ClaimSorterAction,
): ClaimSorterState {
  switch (action.type) {
    case 'place': {
      if (state.revealed) return state;
      if (!claimStatements.some((statement) => statement.statementId === action.statementId)) {
        return state;
      }
      return {
        ...state,
        placements: { ...state.placements, [action.statementId]: action.bucket },
      };
    }

    case 'check':
      if (state.revealed || !allPlaced(state)) return state;
      return { ...state, revealed: true };

    case 'reset':
      return initialClaimSorter;

    default:
      return state;
  }
}
