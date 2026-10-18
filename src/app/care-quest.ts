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
  Localized,
  QuestAnswers,
  QuestStep,
  TrackId,
  TypeReading,
} from '@/content/care-quest/types';
import type { StoreProduct } from '@/content/store-catalog-types';
import { companyDictionary } from '@/content/company/ingredient-dictionary';
import { printedMatches } from '@/content/company/ingredient-links';
import { RECOMMENDABLE_SKUS } from '@/content/recommendable';

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
  /** «Skip»: move on without an answer — the result treats it as unanswered, never as a guess. */
  | { readonly type: 'skip' }
  | { readonly type: 'back' }
  | { readonly type: 'tracks' }
  | { readonly type: 'restore'; readonly track: TrackId; readonly answers: QuestAnswers }
  | {
      readonly type: 'resume';
      readonly track: TrackId;
      readonly stepIndex: number;
      readonly answers: QuestAnswers;
    };

export const initialCareQuest: CareQuestState = {
  phase: 'welcome',
  track: null,
  stepIndex: 0,
  answers: {},
};

/**
 * The game door: `?play` opens straight onto the face track's first question, skipping the
 * greeting and the track list — the address play.korea-glow.com forwards to, so SKIN QUEST and
 * GLOW Class are one app with one way in. `?play=scalp` / `?play=body` open those tracks.
 * Anything that is not a track is no door, and the app opens as it always has.
 */
export { playTrackFromSearch } from './entry-links';

/** Where a quest begins: on a track's first question when a door named one, else the greeting. */
export const startingCareQuest = (track: TrackId | null): CareQuestState =>
  track ? careQuestReducer(initialCareQuest, { type: 'chooseTrack', track }) : initialCareQuest;

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

    case 'skip':
      return state.phase === 'steps' && currentStep(state) ? advance(state) : state;

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

    case 'resume': {
      const steps = careTrack(action.track)?.steps;
      if (!steps || action.stepIndex < 0 || action.stepIndex >= steps.length) return state;
      return {
        phase: 'steps',
        track: action.track,
        stepIndex: Math.floor(action.stepIndex),
        answers: action.answers,
      };
    }

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

/** One answer that pointed at the type the result names — the "why" under the type. */
export interface TypeReason {
  readonly stepId: string;
  readonly answer: Localized;
  readonly points: number;
}

/** The answers that gave the named type points, strongest first. */
export function typeReasons(
  track: CareTrack,
  answers: QuestAnswers,
  typeId: string,
): readonly TypeReason[] {
  const reasons: TypeReason[] = [];
  for (const step of track.steps) {
    if (step.kind === 'learn') continue;
    for (const id of answers[step.id] ?? []) {
      const choice = step.choices.find((c) => c.id === id);
      const points = choice?.scores?.[typeId] ?? 0;
      if (choice && points > 0) reasons.push({ stepId: step.id, answer: choice.label, points });
    }
  }
  return reasons.sort((a, b) => b.points - a.points);
}

/**
 * How firmly the answers point at one type. Self-reported skin type is often wrong, so the
 * screen says how sure the read-out is instead of stating it flatly: "clear" when the leader is
 * well ahead and several separate answers agree, "mixed" when the runner-up is within a point,
 * "likely" otherwise. These cut-offs are the app's own heuristic, not a governed number.
 */
export type TypeConfidence = 'clear' | 'likely' | 'mixed';
/** Points the leading type must be ahead by to be read as "clear". */
export const CLEAR_MARGIN = 3;
/** Separate answers that must agree before the result is read as "clear". */
export const CLEAR_REASONS = 3;

export function typeConfidence(track: CareTrack, answers: QuestAnswers): TypeConfidence | null {
  const reading = readType(track, answers);
  if (!reading.typeId) return null;
  if (reading.closeTypeId) return 'mixed';
  const scores = typeScores(track, answers);
  const lead = scores[reading.typeId] ?? 0;
  const runnerUp = Math.max(
    0,
    ...track.baseTypeIds.filter((id) => id !== reading.typeId).map((id) => scores[id] ?? 0),
  );
  const agreeing = new Set(typeReasons(track, answers, reading.typeId).map((r) => r.stepId)).size;
  return lead - runnerUp >= CLEAR_MARGIN && agreeing >= CLEAR_REASONS ? 'clear' : 'likely';
}

/** The type the reader named herself, when the answers point somewhere else. */
export function selfDisagrees(track: CareTrack, answers: QuestAnswers): string | null {
  if (!track.selfStepId) return null;
  const self = (answers[track.selfStepId] ?? []).find((id) => track.baseTypeIds.includes(id));
  const reading = readType(track, answers);
  return self && reading.typeId && self !== reading.typeId ? self : null;
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
/**
 * Kinds the app may recommend (CEO, 2026-10-15/16): toner, essence/serum/ampoule, cream,
 * eye care — plus sunscreen, which melasma and sun spots cannot do without. Never masks,
 * accessories, gift sets, perfume or make-up. Scalp and body tracks keep their own kinds.
 */
export const RECOMMEND_CATEGORIES: ReadonlySet<string> = new Set([
  '토너',
  '에센스·세럼·앰플',
  '크림',
  '아이케어',
  '선케어',
  '헤어케어',
  '바디케어',
  '핸드크림',
]);

const EVIDENCE_WEIGHT: Readonly<Record<string, number>> = { strong: 3, moderate: 2, emerging: 1 };

/** One reason a product was picked: a dictionary ingredient printed on its own label. */
export interface LabelEvidence {
  readonly id: string;
  /** The name exactly as printed on the label. */
  readonly printed: string;
  /** 1-based place in the printed list — earlier usually means more of it. */
  readonly position: number;
  readonly evidence: string;
  /** Which of the reader's concerns this ingredient is commonly used for. */
  readonly concernIds: readonly string[];
}

/**
 * The label evidence for these concerns: every dictionary ingredient the concerns name that
 * this product actually prints, earliest first. Nothing is inferred from the product's name,
 * its marketing or the master's AI-written columns — only the printed ingredient list.
 */
export function labelEvidence(
  product: StoreProduct,
  concerns: readonly CareConcern[],
): readonly LabelEvidence[] {
  const wanted = new Map<string, string[]>();
  for (const concern of concerns) {
    for (const id of concern.ingredients) wanted.set(id, [...(wanted.get(id) ?? []), concern.id]);
  }
  const found: LabelEvidence[] = [];
  for (const [id, concernIds] of wanted) {
    // A name printed with a trace amount — «(100 ppb)», «(313ppm)» — is there for the label,
    // not for the skin: below 0.1% it earns no credit.
    const printed = printedMatches(product, id).find((name) => !isTraceAmount(name));
    if (!printed) continue;
    const entry = companyDictionary.ingredients.find((ingredient) => ingredient.id === id);
    found.push({
      id,
      printed,
      position: product.inci.indexOf(printed) + 1,
      evidence: entry?.evidence ?? 'emerging',
      concernIds,
    });
  }
  return found.sort((a, b) => a.position - b.position);
}

/**
 * True when the printed name states an amount under 0.1% (1,000 ppm): any ppb figure, or a ppm
 * figure below 1,000. Names without a stated amount are not judged here.
 */
export function isTraceAmount(printed: string): boolean {
  const match = /([\d.,]+)\s*(ppb|ppm)/i.exec(printed);
  if (!match) return false;
  const value = Number(match[1]!.replace(/,/g, ''));
  return match[2]!.toLowerCase() === 'ppb' || (Number.isFinite(value) && value < 1000);
}

/**
 * Ranking weight for one printed ingredient: evidence strength × how high it sits on the list.
 * Sunscreen filters count for little here: they protect against new spots but are not what fades
 * existing ones, so a sunscreen should not outrank a serum built for the concern.
 */
const evidenceScore = (item: LabelEvidence): number =>
  (item.id === 'sunscreen' ? 1 : (EVIDENCE_WEIGHT[item.evidence] ?? 1)) *
  (item.position <= 5 ? 2 : item.position <= 10 ? 1.2 : item.position <= 20 ? 0.6 : 0.2);

/** Eye-care products are offered only to someone who picked an eye-area concern. */
const EYE_CONCERNS: ReadonlySet<string> = new Set(['darkCircles', 'eyeWrinkles']);

/** At most this many picks of one kind, so the list spans serum, cream, sunscreen… */
const PER_CATEGORY = 2;

/**
 * Products to show for these concerns. Three gates, in order:
 *  1. the owner allows recommending it (approved price at or above the floor — RECOMMENDABLE_SKUS),
 *  2. it is a kind the routine uses and the owner allows (RECOMMEND_CATEGORIES),
 *  3. its printed label carries at least one ingredient the reader's concerns call for.
 * Ranked by how many of the concerns the label covers, then evidence strength and list position;
 * the master's AI skin-type note only breaks ties.
 */
export function matchProducts(
  catalog: readonly StoreProduct[],
  concerns: readonly CareConcern[],
  reading: TypeReading,
  categories: readonly string[],
  limit = 6,
  allowed: ReadonlySet<string> = RECOMMENDABLE_SKUS,
): readonly StoreProduct[] {
  if (concerns.length === 0) return [];
  const usesIngredients = concerns.some((concern) => concern.ingredients.length > 0);
  const keys = new Set(concerns.flatMap((concern) => concern.storeKeys));
  const skin = reading.modifier ? 'sensitive' : reading.typeId;
  const scored = catalog
    .filter(
      (product) =>
        allowed.has(product.sku) &&
        RECOMMEND_CATEGORIES.has(product.category) &&
        categories.includes(product.category) &&
        (product.category !== '아이케어' || concerns.some((concern) => EYE_CONCERNS.has(concern.id))),
    )
    .map((product) => {
      const skinFit = skin && product.fit?.skin.includes(skin) ? 1 : 0;
      const photo = product.photo ? 0.25 : 0;
      if (usesIngredients) {
        const evidence = labelEvidence(product, concerns);
        const covered = new Set(evidence.flatMap((item) => item.concernIds)).size;
        const strength = evidence.reduce((sum, item) => sum + evidenceScore(item), 0);
        return { product, ok: evidence.length > 0, score: covered * 10 + strength + skinFit + photo };
      }
      // Tracks whose concerns name no dictionary ingredient (some scalp/body ones) fall back to
      // the master's concern tags — still behind the price and kind gates above.
      const overlap = product.fit ? product.fit.concerns.filter((key) => keys.has(key)).length : 0;
      return { product, ok: overlap > 0, score: overlap * 2 + skinFit + photo };
    })
    .filter((entry) => entry.ok)
    .sort((a, b) => b.score - a.score || a.product.sku.localeCompare(b.product.sku));
  const perCategory = new Map<string, number>();
  const picked: StoreProduct[] = [];
  for (const { product } of scored) {
    const used = perCategory.get(product.category) ?? 0;
    if (used >= PER_CATEGORY) continue;
    perCategory.set(product.category, used + 1);
    picked.push(product);
    if (picked.length >= limit) break;
  }
  return picked;
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

const PROGRESS_KEY = 'korea-glow:care-quest:progress:v1';

/** A track the reader left half-way, so the next visit can pick it up at the same question. */
export interface QuestProgress {
  readonly track: TrackId;
  readonly stepIndex: number;
  readonly answers: QuestAnswers;
}

export function loadProgress(storage: Storage | undefined): QuestProgress | null {
  try {
    const raw = storage?.getItem(PROGRESS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<QuestProgress>;
    const track = parsed.track ? careTrack(parsed.track) : undefined;
    if (!track || typeof parsed.stepIndex !== 'number') return null;
    if (parsed.stepIndex < 1 || parsed.stepIndex >= track.steps.length) return null;
    const answers: Record<string, readonly string[]> = {};
    for (const [step, ids] of Object.entries(parsed.answers ?? {})) {
      if (Array.isArray(ids)) answers[step] = ids.filter((id) => typeof id === 'string');
    }
    return { track: track.id, stepIndex: Math.floor(parsed.stepIndex), answers };
  } catch {
    return null;
  }
}

/** Remembers the questions in progress; anything other than "mid-track" clears it. */
export function saveProgress(storage: Storage | undefined, state: CareQuestState): void {
  try {
    if (state.phase === 'steps' && state.track && state.stepIndex > 0) {
      const progress: QuestProgress = {
        track: state.track,
        stepIndex: state.stepIndex,
        answers: state.answers,
      };
      storage?.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } else if (state.phase === 'result') {
      storage?.removeItem(PROGRESS_KEY);
    }
  } catch {
    // Storage unavailable: the quest still works, it just will not be resumable.
  }
}

const HISTORY_KEY = 'korea-glow:care-quest:history:v1';
/** Results kept per track, oldest dropped first. */
export const HISTORY_KEEP = 6;
/** Days after a result that the screen suggests looking again (skin shifts with the season). */
export const RETEST_DAYS = 28;

/** One finished track on one day; `at` is null for a result saved before dates were kept. */
export interface QuestRecord {
  readonly at: string | null;
  readonly answers: QuestAnswers;
}

export type QuestHistory = Readonly<Partial<Record<TrackId, readonly QuestRecord[]>>>;

const sameAnswers = (a: QuestAnswers, b: QuestAnswers): boolean => {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const key of keys) {
    const x = [...(a[key] ?? [])].sort().join('|');
    const y = [...(b[key] ?? [])].sort().join('|');
    if (x !== y) return false;
  }
  return true;
};

export function loadHistory(storage: Storage | undefined): QuestHistory {
  try {
    const raw = storage?.getItem(HISTORY_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const out: Partial<Record<TrackId, QuestRecord[]>> = {};
    for (const track of CARE_TRACKS) {
      const list = parsed[track.id];
      if (!Array.isArray(list)) continue;
      out[track.id] = list.flatMap((item: unknown) => {
        if (!item || typeof item !== 'object') return [];
        const { at, answers } = item as { at?: unknown; answers?: unknown };
        if (!answers || typeof answers !== 'object') return [];
        const clean: Record<string, readonly string[]> = {};
        for (const [step, ids] of Object.entries(answers as Record<string, unknown>)) {
          if (Array.isArray(ids)) clean[step] = ids.filter((id) => typeof id === 'string');
        }
        return [{ at: typeof at === 'string' ? at : null, answers: clean }];
      });
    }
    return out;
  } catch {
    return {};
  }
}

/**
 * Adds a finished result to the track's history. Re-opening the same result adds nothing; a
 * result saved before history existed (`earlier`) is kept as the first, undated entry so the
 * reader's next result still has something to be compared with.
 */
export function recordHistory(
  storage: Storage | undefined,
  history: QuestHistory,
  track: TrackId,
  answers: QuestAnswers,
  now: Date,
  earlier?: QuestAnswers,
): QuestHistory {
  let list = [...(history[track] ?? [])];
  if (list.length === 0 && earlier && !sameAnswers(earlier, answers)) {
    list.push({ at: null, answers: earlier });
  }
  if (list.some((record) => sameAnswers(record.answers, answers))) return history;
  list.push({ at: now.toISOString().slice(0, 10), answers });
  list = list.slice(-HISTORY_KEEP);
  const next = { ...history, [track]: list };
  try {
    storage?.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable: no comparison next time, nothing else changes.
  }
  return next;
}

/** What changed between two results of the same track. */
export interface ResultChange {
  readonly previousAt: string | null;
  readonly at: string | null;
  readonly typeBefore: string | null;
  readonly typeNow: string | null;
  readonly added: readonly CareConcern[];
  readonly gone: readonly CareConcern[];
  readonly kept: readonly CareConcern[];
}

/** The result shown compared with the one before it, or null when there is none. */
export function compareWithPrevious(
  track: CareTrack,
  history: QuestHistory,
  answers: QuestAnswers,
): ResultChange | null {
  const list = history[track.id] ?? [];
  const index = list.findIndex((record) => sameAnswers(record.answers, answers));
  if (index < 1) return null;
  const before = list[index - 1]!;
  const was = pickedConcerns(track, before.answers);
  const now = pickedConcerns(track, answers);
  const wasIds = new Set(was.map((c) => c.id));
  const nowIds = new Set(now.map((c) => c.id));
  return {
    previousAt: before.at,
    at: list[index]!.at,
    typeBefore: readType(track, before.answers).typeId,
    typeNow: readType(track, answers).typeId,
    added: now.filter((c) => !wasIds.has(c.id)),
    gone: was.filter((c) => !nowIds.has(c.id)),
    kept: now.filter((c) => wasIds.has(c.id)),
  };
}

/** The date a result dated `at` suggests looking again, as YYYY-MM-DD. */
export function retestDate(at: string): string {
  const date = new Date(`${at}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + RETEST_DAYS);
  return date.toISOString().slice(0, 10);
}

/** The date the shown result was recorded, when the history knows it. */
export function resultDate(
  history: QuestHistory,
  track: TrackId,
  answers: QuestAnswers,
): string | null {
  const record = (history[track] ?? []).find((item) => sameAnswers(item.answers, answers));
  return record?.at ?? null;
}
