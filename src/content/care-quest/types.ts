/**
 * Care Quest — the shape of the three question tracks (face, scalp & hair, body).
 *
 * The first Skin Quest only let the reader name what she could see, because nothing in the
 * Master Database had passed its evidence gate. That kept it honest and made it shallow: seven
 * vague questions, face mixed with hair and body, nothing to take home. The owner rejected it.
 *
 * This is the replacement. It is KOREA GLOW's own consumer education — the same standing as the
 * company's 30-ingredient dictionary — written from public dermatology-association guidance and
 * shown as that: every result screen names its sources and says it is a Draft, not a diagnosis.
 * It never touches `evaluatePublication()` and never claims a governed record is verified.
 *
 * Everything the reader sees is in the content files, in five languages; the components only lay
 * it out (rule 8).
 */
import type { Localized } from '@/content/partner/wording-check';

export type { Localized };
export { inLocale } from '@/content/partner/wording-check';

export type TrackId = 'face' | 'scalp' | 'body';

export interface QuestChoice {
  readonly id: string;
  readonly icon?: string;
  readonly label: Localized;
  /** One plain line under the label, when the label alone is not enough. */
  readonly detail?: Localized;
  /** Points this answer gives each type, for the "likely type" read-out. */
  readonly scores?: Readonly<Record<string, number>>;
}

interface StepBase {
  readonly id: string;
  /** Small heading above the question: "1단계 · 나이대". */
  readonly section: Localized;
  readonly prompt: Localized;
  readonly help?: Localized;
}

/** Pick one. Always offers a "not sure / doesn't apply" choice. */
export interface SingleStep extends StepBase {
  readonly kind: 'single';
  readonly choices: readonly QuestChoice[];
}

/** Pick any number, or "none of these". */
export interface MultiStep extends StepBase {
  readonly kind: 'multi';
  readonly choices: readonly QuestChoice[];
  /** Headings that split a long list, by choice id → group id. */
  readonly groups?: readonly {
    readonly id: string;
    readonly label: Localized;
    readonly ids: readonly string[];
  }[];
  /** At most this many may be picked; undefined means no limit. */
  readonly max?: number;
}

/** A short lesson card set shown before a question — the five skin types, explained. */
export interface LearnStep extends StepBase {
  readonly kind: 'learn';
  readonly cards: readonly LearnCard[];
}

export interface LearnCard {
  readonly id: string;
  readonly icon: string;
  readonly title: Localized;
  readonly body: Localized;
  readonly signs: readonly Localized[];
  /** An illustration for the card (public/gemini), when the owner has made one. */
  readonly image?: string;
}

export type QuestStep = SingleStep | MultiStep | LearnStep;

/** A type the track can suggest — a skin type, a scalp type. */
export interface CareType {
  readonly id: string;
  readonly icon: string;
  readonly name: Localized;
  readonly summary: Localized;
  readonly care: readonly Localized[];
}

/** A concern the reader can pick, with what is commonly used for it. */
export interface CareConcern {
  readonly id: string;
  readonly icon: string;
  readonly name: Localized;
  /** What it looks or feels like, in one line. */
  readonly what: Localized;
  /** Ids in the company ingredient dictionary commonly used for it. */
  readonly ingredients: readonly string[];
  /** Commonly used ingredients the dictionary does not cover (anti-dandruff actives, urea…). */
  readonly otherIngredients?: readonly Localized[];
  /** Product kinds that usually carry those ingredients. */
  readonly products: readonly string[];
  /** Store catalog `fit.concerns` keys that match it, for product suggestions. */
  readonly storeKeys: readonly string[];
  /** A one-line practical tip. */
  readonly tip: Localized;
  /** When to see a dermatologist rather than keep trying products. */
  readonly seeDoctor?: Localized;
  /** The governed 07_CONCERNS id it corresponds to, if one does — never renamed (rule 1). */
  readonly governedId?: string;
}

export interface RoutineStepText {
  readonly product: string;
  readonly note: Localized;
}

export interface Source {
  readonly name: string;
  readonly url: string;
}

/** One line of a routine: which kind of product, and what to know about it here. */
export interface RoutineLine {
  readonly kind: string;
  readonly note: Localized;
}

export interface AdviceBlock {
  readonly id: string;
  readonly icon: string;
  readonly title: Localized;
  readonly points: readonly Localized[];
}

/** A named list of steps: "Morning routine", "When you wash your hair", "In the shower". */
export interface RoutineBlock {
  readonly id: string;
  readonly icon: string;
  readonly title: Localized;
  readonly lines: readonly RoutineLine[];
}

/** What the result screen shows besides the type and the concerns. */
export interface CarePlan {
  /** Shown above everything else when an answer means "see a doctor first". */
  readonly alert: Localized | null;
  readonly routines: readonly RoutineBlock[];
  readonly weekly: readonly RoutineLine[];
  readonly advice: readonly AdviceBlock[];
  /** Dictionary ids to hold back for now (pregnancy, teenage skin), with the reason shown. */
  readonly avoid: readonly string[];
  readonly avoidReason: Localized | null;
}

/** The likely type the answers point to — never more certain than "likely". */
export interface TypeReading {
  readonly typeId: string | null;
  readonly closeTypeId: string | null;
  readonly modifier: boolean;
}

/** Answers by step id; a single-choice step holds one id. */
export type QuestAnswers = Readonly<Record<string, readonly string[]>>;

export interface CareTrack {
  readonly id: TrackId;
  readonly icon: string;
  readonly cover: string;
  readonly coverFocus?: string;
  readonly title: Localized;
  readonly intro: Localized;
  readonly steps: readonly QuestStep[];
  readonly types: readonly CareType[];
  /** Mutually exclusive types the scores choose between. */
  readonly baseTypeIds: readonly string[];
  /** A type that can sit on top of any base type ("with a sensitive tendency"). */
  readonly modifierTypeId: string | null;
  readonly concernStepId: string;
  readonly concerns: readonly CareConcern[];
  readonly plan: (answers: QuestAnswers, reading: TypeReading) => CarePlan;
  readonly sources: readonly Source[];
}
