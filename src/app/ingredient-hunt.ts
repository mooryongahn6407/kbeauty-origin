/**
 * The ingredient hunt — QST-009 "Humectant Hunt" and QST-008 "Ingredient Garden", made playable.
 *
 * These two quests were designed in the Master Database and never wired to anything. Their win
 * conditions are "성분표에서 humectant 찾기" and "10개 성분 기능 매칭", and both are scored
 * entirely against governed fields: an ingredient either has `Family = "Humectant"` in
 * 06_INGREDIENTS or it does not.
 *
 * That is why this game can exist while the corpus is unverified. It never says what an
 * ingredient *does* — it asks which records the database files under a heading, and marks the
 * answer against the record. A player who finishes has learned how a real ingredient list is
 * organised, which is a genuine skill (SK02 Identify), and the app has asserted nothing.
 *
 * Pure `(state, action)`, like every other reducer here (rule 16).
 */
import { ingredients } from '@/knowledge/repository';
import type { Ingredient } from '@/domain/entities';

/** A round's target: one governed Family, and the records that carry it. */
export interface HuntRound {
  /** Family label exactly as 06_INGREDIENTS spells it. */
  readonly family: string;
  /** The list shown to the player — targets mixed with decoys, in a stable shuffled order. */
  readonly shown: readonly Ingredient[];
  readonly targetIds: readonly string[];
}

export interface HuntState {
  readonly round: HuntRound | null;
  readonly picked: readonly string[];
  readonly revealed: boolean;
  readonly roundsPlayed: number;
  /** Ingredient_IDs the player has correctly identified at least once, across rounds. */
  readonly learnedIds: readonly string[];
}

export type HuntAction =
  | { readonly type: 'start'; readonly round: HuntRound }
  | { readonly type: 'toggle'; readonly ingredientId: string }
  | { readonly type: 'check' }
  | { readonly type: 'next'; readonly round: HuntRound };

export const initialHuntState: HuntState = {
  round: null,
  picked: [],
  revealed: false,
  roundsPlayed: 0,
  learnedIds: [],
};

/**
 * Families with enough records to make a round worth playing, easiest first.
 *
 * "Easiest" is the governed `Level` of the family's members, not a judgement made here: a round
 * of Basic records comes before a round of Advanced ones, the way the database grades them.
 * Without this the first thing a reader met was "find every Rheology Modifier", which is a
 * phrase no shopper in Vientiane or Seoul has ever needed.
 */
const LEVEL_ORDER: Readonly<Record<string, number>> = { Basic: 0, Intermediate: 1, Advanced: 2 };

export const huntableFamilies = (minimum = 2): readonly string[] => {
  const counts = new Map<string, number>();
  const hardest = new Map<string, number>();
  for (const ingredient of ingredients) {
    counts.set(ingredient.Family, (counts.get(ingredient.Family) ?? 0) + 1);
    const level = LEVEL_ORDER[ingredient.Level] ?? 1;
    hardest.set(ingredient.Family, Math.max(hardest.get(ingredient.Family) ?? 0, level));
  }
  return [...counts.entries()]
    .filter(([, count]) => count >= minimum)
    .map(([family]) => family)
    .sort((a, b) => (hardest.get(a) ?? 1) - (hardest.get(b) ?? 1));
};

/**
 * What the family's records say they are for, when they agree.
 *
 * `Primary_Function` is a governed field and, unlike the family label, it is written in the
 * reader's own language in the source ("보습", "장벽 지원"). Returned only when every record in
 * the family carries the same one — a family whose members disagree gets no label rather than
 * an averaged or invented one.
 */
export const familyFunction = (family: string): string | null => {
  const functions = new Set(
    ingredients
      .filter((ingredient) => ingredient.Family === family)
      .map((ingredient) => ingredient.Primary_Function.trim())
      .filter(Boolean),
  );
  return functions.size === 1 ? ([...functions][0] ?? null) : null;
};

/**
 * Builds one round: every record of the chosen family, plus decoys from other families, in an
 * order the caller controls. `pick` takes the count and returns an index, so the shuffle is the
 * caller's to make deterministic — a reducer that shuffles is not a pure reducer.
 */
export function buildRound(
  family: string,
  listSize: number,
  pick: (bound: number) => number,
): HuntRound {
  const targets = ingredients.filter((ingredient) => ingredient.Family === family);
  const pool = ingredients.filter((ingredient) => ingredient.Family !== family);

  const decoys: Ingredient[] = [];
  const remaining = [...pool];
  const wanted = Math.max(0, Math.min(listSize - targets.length, remaining.length));
  for (let index = 0; index < wanted; index += 1) {
    const [taken] = remaining.splice(pick(remaining.length), 1);
    if (taken) decoys.push(taken);
  }

  const shown = [...targets, ...decoys];
  // Fisher-Yates, driven by the caller's picker so a test can pin the order.
  for (let index = shown.length - 1; index > 0; index -= 1) {
    const swap = pick(index + 1);
    const a = shown[index];
    const b = shown[swap];
    if (a && b) {
      shown[index] = b;
      shown[swap] = a;
    }
  }

  return { family, shown, targetIds: targets.map((target) => target.Ingredient_ID) };
}

export interface HuntResult {
  readonly correct: readonly string[];
  readonly missed: readonly string[];
  readonly wrong: readonly string[];
}

/** What the player got, once they have asked to be checked. Never a score out of a hundred. */
export function huntResult(state: HuntState): HuntResult {
  const round = state.round;
  if (!round) return { correct: [], missed: [], wrong: [] };
  const targets = new Set(round.targetIds);
  return {
    correct: state.picked.filter((id) => targets.has(id)),
    missed: round.targetIds.filter((id) => !state.picked.includes(id)),
    wrong: state.picked.filter((id) => !targets.has(id)),
  };
}

export function huntReducer(state: HuntState, action: HuntAction): HuntState {
  switch (action.type) {
    case 'start':
      return { ...initialHuntState, round: action.round, learnedIds: state.learnedIds };

    case 'toggle': {
      if (state.revealed || !state.round) return state;
      return {
        ...state,
        picked: state.picked.includes(action.ingredientId)
          ? state.picked.filter((id) => id !== action.ingredientId)
          : [...state.picked, action.ingredientId],
      };
    }

    case 'check': {
      if (state.revealed || !state.round) return state;
      const targets = new Set(state.round.targetIds);
      const correct = state.picked.filter((id) => targets.has(id));
      return {
        ...state,
        revealed: true,
        roundsPlayed: state.roundsPlayed + 1,
        learnedIds: [...new Set([...state.learnedIds, ...correct])],
      };
    }

    case 'next':
      return { ...state, round: action.round, picked: [], revealed: false };

    default:
      return state;
  }
}
