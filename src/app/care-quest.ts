/**
 * Care Quest state and read-outs.
 *
 * Pure `(state, action)` like every reducer here (CLAUDE.md rule 16), and it emits nothing: a
 * questionnaire about your own skin has no right answer, so nothing here is an attempt and the
 * mastery ledger never hears of it (rule 9).
 *
 * The "likely type" is a plain sum of the points each answer gives, read back as "likely", with
 * the runner-up named when it is close and no type at all when the answers are mostly "not
 * sure". It is a cosmetic-education estimate, and the screen says so above it.
 */
import { CARE_TRACKS, careTrack } from '@/content/care-quest';
import { NONE_ID, QUEST_TEXT } from '@/content/care-quest/common';
import { inLocale } from '@/content/care-quest/types';
import type {
  CareConcern,
  CareTrack,
  QuestAnswers,
  QuestStep,
  TrackId,
  TypeReading,
} from '@/content/care-quest/types';
import type { StoreProduct } from '@/content/store-catalog-types';

export type CarePhase = 'welcome' | 'tracks' | 'steps' | 'result';

export interface CareQuestState {
  readonly phase: CarePhase;
  readonly track: TrackId | null;
  readonly stepIndex: number;
  readonly answers: QuestAnswers;
}

export type CareQuestAction =
  | { readonly type: 'begin' }
  | { readonly type: 'chooseTrack'; readonly track: TrackId }
  | { readonly type: 'choose'; readonly stepId: string; readonly choiceId: string }
  | { readonly type: 'toggle'; readonly stepId: string; readonly choiceId: string }
  | { readonly type: 'next' }
  | { readonly type: 'back' }
  | { readonly type: 'tracks' }
  | { readonly type: 'restore'; readonly track: TrackId; readonly answers: QuestAnswers };

export const initialCareQuest: CareQuestState = {
  phase: 'welcome',
  track: null,
  stepIndex: 0,
  answers: {},
};

const stepsOf = (state: CareQuestState): readonly QuestStep[] =>
  (state.track ? careTrack(state.track)?.steps : undefined) ?? [];

export const currentStep = (state: CareQuestState): QuestStep | undefined =>
  state.phase === 'steps' ? stepsOf(state)[state.stepIndex] : undefined;

const advance = (state: CareQuestState): CareQuestState => {
  const steps = stepsOf(state);
  return state.stepIndex + 1 >= steps.length
    ? { ...state, phase: 'result' }
    : { ...state, stepIndex: state.stepIndex + 1 };
};

/** Picking "none" clears the rest; picking anything else clears "none". Never more than `max`. */
export function toggleChoice(
  picked: readonly string[],
  choiceId: string,
  max?: number,
): readonly string[] {
  if (picked.includes(choiceId)) return picked.filter((id) => id !== choiceId);
  if (choiceId === NONE_ID) return [NONE_ID];
  const rest = picked.filter((id) => id !== NONE_ID);
  if (max !== undefined && rest.length >= max) return rest;
  return [...rest, choiceId];
}

export function careQuestReducer(state: CareQuestState, action: CareQuestAction): CareQuestState {
  switch (action.type) {
    case 'begin':
      return { ...initialCareQuest, phase: 'tracks' };

    case 'chooseTrack':
      if (!careTrack(action.track)) return state;
      return { phase: 'steps', track: action.track, stepIndex: 0, answers: {} };

    case 'choose': {
      const step = currentStep(state);
      if (!step || step.id !== action.stepId || step.kind !== 'single') return state;
      if (!step.choices.some((choice) => choice.id === action.choiceId)) return state;
      return advance({ ...state, answers: { ...state.answers, [step.id]: [action.choiceId] } });
    }

    case 'toggle': {
      const step = currentStep(state);
      if (!step || step.id !== action.stepId || step.kind !== 'multi') return state;
      if (!step.choices.some((choice) => choice.id === action.choiceId)) return state;
      const picked = toggleChoice(state.answers[step.id] ?? [], action.choiceId, step.max);
      return { ...state, answers: { ...state.answers, [step.id]: picked } };
    }

    case 'next': {
      const step = currentStep(state);
      if (!step || step.kind === 'single') return state;
      return advance(state);
    }

    case 'back': {
      if (state.phase === 'result') {
        return { ...state, phase: 'steps', stepIndex: Math.max(0, stepsOf(state).length - 1) };
      }
      if (state.phase === 'steps') {
        return state.stepIndex > 0
          ? { ...state, stepIndex: state.stepIndex - 1 }
          : { ...state, phase: 'tracks' };
      }
      if (state.phase === 'tracks') return { ...state, phase: 'welcome' };
      return state;
    }

    case 'tracks':
      return { ...initialCareQuest, phase: 'tracks' };

    case 'restore':
      if (!careTrack(action.track)) return state;
      return { phase: 'result', track: action.track, stepIndex: 0, answers: action.answers };

    default:
      return state;
  }
}

/** Points per type from every answer given, including helper and family questions. */
export function typeScores(
  track: CareTrack,
  answers: QuestAnswers,
): Readonly<Record<string, number>> {
  const scores: Record<string, number> = {};
  for (const step of track.steps) {
    if (step.kind === 'learn') continue;
    for (const id of answers[step.id] ?? []) {
      const choice = step.choices.find((c) => c.id === id);
      for (const [type, points] of Object.entries(choice?.scores ?? {})) {
        scores[type] = (scores[type] ?? 0) + points;
      }
    }
  }
  return scores;
}

/** Least points the leading type needs before the app will name it at all. */
export const TYPE_MIN_POINTS = 3;
/** Points a modifier type ("sensitive") needs to be mentioned alongside the base type. */
export const MODIFIER_MIN_POINTS = 3;

export function readType(track: CareTrack, answers: QuestAnswers): TypeReading {
  const scores = typeScores(track, answers);
  const ranked = [...track.baseTypeIds]
    .map((id) => ({ id, points: scores[id] ?? 0 }))
    .sort((a, b) => b.points - a.points);
  const [first, second] = ranked;
  const typeId = first && first.points >= TYPE_MIN_POINTS ? first.id : null;
  const closeTypeId =
    typeId && second && second.points > 0 && first!.points - second.points <= 1 ? second.id : null;
  const modifier =
    track.modifierTypeId !== null && (scores[track.modifierTypeId] ?? 0) >= MODIFIER_MIN_POINTS;
  return { typeId, closeTypeId, modifier };
}

export const pickedConcerns = (track: CareTrack, answers: QuestAnswers): readonly CareConcern[] =>
  (answers[track.concernStepId] ?? [])
    .map((id) => track.concerns.find((concern) => concern.id === id))
    .filter((concern): concern is CareConcern => concern !== undefined);

/** Governed 07_CONCERNS ids behind the picked concerns, for the collection shelf. */
export const governedIdsFor = (concerns: readonly CareConcern[]): readonly string[] => [
  ...new Set(concerns.flatMap((concern) => (concern.governedId ? [concern.governedId] : []))),
];

/**
 * Products whose own "suits" notes overlap the picked concerns, in the product kinds the
 * routine uses — at most `limit`, photographed ones first. The catalog's notes are AI-assisted
 * and unreviewed; the screen says so beside the list.
 */
export function matchProducts(
  catalog: readonly StoreProduct[],
  concerns: readonly CareConcern[],
  reading: TypeReading,
  categories: readonly string[],
  limit = 6,
): readonly StoreProduct[] {
  const keys = new Set(concerns.flatMap((concern) => concern.storeKeys));
  if (keys.size === 0) return [];
  const skin = reading.modifier ? 'sensitive' : reading.typeId;
  const scored = catalog
    .filter((product) => product.fit && categories.includes(product.category))
    .map((product) => {
      const overlap = product.fit!.concerns.filter((key) => keys.has(key)).length;
      const skinFit = skin && product.fit!.skin.includes(skin) ? 1 : 0;
      return { product, score: overlap * 2 + skinFit + (product.photo ? 0.5 : 0) };
    })
    .filter((entry) => entry.score >= 2)
    .sort((a, b) => b.score - a.score || a.product.sku.localeCompare(b.product.sku));
  return scored.slice(0, limit).map((entry) => entry.product);
}

const SAVE_KEY = 'korea-glow:care-quest:v1';

export type SavedResults = Readonly<Partial<Record<TrackId, QuestAnswers>>>;

export function loadSavedResults(storage: Storage | undefined): SavedResults {
  try {
    const raw = storage?.getItem(SAVE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const out: Partial<Record<TrackId, QuestAnswers>> = {};
    for (const track of CARE_TRACKS) {
      const value = parsed[track.id];
      if (value && typeof value === 'object') {
        const answers: Record<string, readonly string[]> = {};
        for (const [step, ids] of Object.entries(value as Record<string, unknown>)) {
          if (Array.isArray(ids)) answers[step] = ids.filter((id) => typeof id === 'string');
        }
        out[track.id] = answers;
      }
    }
    return out;
  } catch {
    return {};
  }
}

export function saveResult(
  storage: Storage | undefined,
  saved: SavedResults,
  track: TrackId,
  answers: QuestAnswers,
): SavedResults {
  const next = { ...saved, [track]: answers };
  try {
    storage?.setItem(SAVE_KEY, JSON.stringify(next));
  } catch {
    // Private windows and full storage: the result still shows, it just is not remembered.
  }
  return next;
}

/**
 * The text a reader can send to a partner shop. Deliberately narrow: the likely type, the
 * concern names and the goals — never the age band, pregnancy, family history or lifestyle
 * answers, which are the reader's own business and stay on the phone.
 */
export function resultSummary(
  track: CareTrack,
  answers: QuestAnswers,
  locale: string,
  link: string,
): string {
  const t = (text: Parameters<typeof inLocale>[0]) => inLocale(text, locale);
  const reading = readType(track, answers);
  const type = track.types.find((item) => item.id === reading.typeId);
  const typeLine = type
    ? `${t(type.name)}${reading.modifier ? ` + ${t(QUEST_TEXT.sensitiveToo)}` : ''}`
    : t(QUEST_TEXT.shareUnknown);
  const concerns = pickedConcerns(track, answers).map((concern) => t(concern.name));
  const goalStep = track.steps.find((step) => step.id === 'goals');
  const goals =
    goalStep && goalStep.kind === 'multi'
      ? (answers.goals ?? [])
          .filter((id) => id !== NONE_ID)
          .map((id) => goalStep.choices.find((choice) => choice.id === id))
          .flatMap((choice) => (choice ? [t(choice.label)] : []))
      : [];
  return [
    t(QUEST_TEXT.shareHead).replace('{track}', t(track.title)),
    `• ${t(QUEST_TEXT.shareType)}: ${typeLine}`,
    `• ${t(QUEST_TEXT.shareConcerns)}: ${concerns.length > 0 ? concerns.join(', ') : t(QUEST_TEXT.shareNone)}`,
    ...(goals.length > 0 ? [`• ${t(QUEST_TEXT.shareGoals)}: ${goals.join(', ')}`] : []),
    t(QUEST_TEXT.shareNotDx),
    '',
    link,
  ].join('\n');
}
