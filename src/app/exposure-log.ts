/**
 * Exposure Log — the interactive surface of Sun Protection.
 *
 * Sun protection is the most claim-dense domain in the curriculum: SPF numbers, broad-spectrum
 * coverage and reapplication intervals are all factual and regulatory claims. The evidence
 * position today is worse than elsewhere:
 *
 *   - all 13 D04 nodes cite one general "Skin care basics" page, not a sunscreen page;
 *   - 14_EVIDENCE registers no source about sun, UV or SPF at all;
 *   - the AI Tutor Constitution §17 cites AAD-05 "Right Sunscreen", but no node cites it and
 *     the registry does not contain it (OQ-E02).
 *
 * So this world must not tell anyone what protection to use. What it can do is help the user
 * observe their own day, which is SK01 territory and asserts nothing: when were you outside,
 * for how long, and in what setting. The log records; it never advises, scores or warns.
 *
 * Absence of guidance here is a statement about this app's evidence, not about whether sun
 * protection matters. The safety-boundary content says so explicitly, because an omission that
 * reads as "so it does not matter" would be its own false claim.
 */
import type { Disclosure } from '@/domain/governance';
import type { EventSink } from '@/analytics/events';
import type { LearningEvent } from '@/domain/learning';
import { INITIAL_TRANSITION, drainEvents, type Emit, type EmittingState } from './transition';
import { classifyRisk } from '@/safety/safety-gate';
import {
  DISCLOSURE_NOT_MEDICAL,
  DISCLOSURE_PENDING_VERIFICATION,
} from '@/governance/publication-gate';

/** Settings a user can report about a period outdoors. Observational, not evaluative. */
export const EXPOSURE_SETTINGS = ['open', 'partial-shade', 'shade', 'indoors-by-window'] as const;
export type ExposureSetting = (typeof EXPOSURE_SETTINGS)[number];

/** Rough time bands. Coarse on purpose: a precise clock would invite a precision we cannot back. */
export const EXPOSURE_BANDS = ['early-morning', 'midday', 'afternoon', 'evening'] as const;
export type ExposureBand = (typeof EXPOSURE_BANDS)[number];

export interface ExposureEntry {
  readonly entryId: string;
  /** What the user was doing, in their words. */
  readonly activity: string;
  readonly band: ExposureBand;
  readonly setting: ExposureSetting;
  /** Minutes, as the user estimates them. Never converted into a dose or a risk figure. */
  readonly minutes: number;
}

export type ExposurePhase = 'LOGGING' | 'REVIEW' | 'HALTED';

export interface ExposureLogState extends EmittingState {
  readonly userId: string;
  readonly phase: ExposurePhase;
  readonly entries: readonly ExposureEntry[];
  readonly disclosures: readonly Disclosure[];
  readonly safetyHaltMessageKey: string | null;
  readonly transitionId: number;
  readonly emitted: readonly LearningEvent[];
}

export type ExposureAction =
  | {
      readonly type: 'ADD_ENTRY';
      readonly activity: string;
      readonly band: ExposureBand;
      readonly setting: ExposureSetting;
      readonly minutes: number;
      /** When this was logged. Also the timestamp a safety intervention is recorded with. */
      readonly at: string;
    }
  | { readonly type: 'REMOVE_ENTRY'; readonly entryId: string }
  | { readonly type: 'REVIEW'; readonly at: string }
  | { readonly type: 'RESET' };

export const MAX_ENTRIES = 10;
/** Upper bound on a single reported period, to keep an obvious typo from dominating a total. */
export const MAX_MINUTES = 720;

export function createExposureLog(userId: string): ExposureLogState {
  return {
    userId,
    phase: 'LOGGING',
    entries: [],
    disclosures: [DISCLOSURE_PENDING_VERIFICATION, DISCLOSURE_NOT_MEDICAL],
    safetyHaltMessageKey: null,
    ...INITIAL_TRANSITION,
  };
}

export interface ExposureSummary {
  readonly entries: number;
  readonly totalMinutes: number;
  /** Minutes per setting, so the user can see their own pattern. No setting is labelled good or bad. */
  readonly minutesBySetting: Readonly<Record<ExposureSetting, number>>;
  readonly minutesByBand: Readonly<Record<ExposureBand, number>>;
  /** Bands the user recorded nothing for. A gap in the record, not a gap in behaviour. */
  readonly bandsNotRecorded: readonly ExposureBand[];
}

/**
 * Summarise what was recorded.
 *
 * Counts only. There is no threshold, no risk score and no "recommended" figure to compare
 * against, because the app has no approved evidence that would justify one.
 */
export function summariseExposure(state: ExposureLogState): ExposureSummary {
  const minutesBySetting = Object.fromEntries(
    EXPOSURE_SETTINGS.map((setting) => [setting, 0]),
  ) as Record<ExposureSetting, number>;
  const minutesByBand = Object.fromEntries(
    EXPOSURE_BANDS.map((band) => [band, 0]),
  ) as Record<ExposureBand, number>;

  for (const entry of state.entries) {
    minutesBySetting[entry.setting] += entry.minutes;
    minutesByBand[entry.band] += entry.minutes;
  }

  return {
    entries: state.entries.length,
    totalMinutes: state.entries.reduce((sum, entry) => sum + entry.minutes, 0),
    minutesBySetting,
    minutesByBand,
    bandsNotRecorded: EXPOSURE_BANDS.filter((band) => minutesByBand[band] === 0),
  };
}

function halt(
  state: ExposureLogState,
  text: string,
  at: string,
  emit: Emit,
): ExposureLogState | null {
  const safety = classifyRisk(text);
  if (!safety.escalate) return null;

  emit({
    type: 'safety_intervention',
    userId: state.userId,
    at,
    detail: { tier: safety.tier, signals: safety.matchedSignalIds.join(','), surface: 'exposure_log' },
  });

  return {
    ...state,
    phase: 'HALTED',
    safetyHaltMessageKey: safety.messageKey,
    disclosures: [...state.disclosures, ...safety.disclosures],
  };
}

/** The transition table. Declares events through `emit`; performs none. See `./transition`. */
function reduceExposure(
  state: ExposureLogState,
  action: ExposureAction,
  emit: Emit,
): ExposureLogState {
  if (state.phase === 'HALTED' && action.type !== 'RESET') return state;

  switch (action.type) {
    case 'ADD_ENTRY': {
      const activity = action.activity.trim();
      const minutes = Math.round(action.minutes);
      if (state.phase !== 'LOGGING') return state;
      if (activity === '' || state.entries.length >= MAX_ENTRIES) return state;
      if (!Number.isFinite(minutes) || minutes <= 0 || minutes > MAX_MINUTES) return state;

      // A description of a burn or a painful reaction is a safety signal, not a log entry.
      const halted = halt(state, activity, action.at, emit);
      if (halted) return halted;

      return {
        ...state,
        entries: [
          ...state.entries,
          {
            entryId: `exposure-${state.entries.length + 1}`,
            activity,
            band: action.band,
            setting: action.setting,
            minutes,
          },
        ],
      };
    }

    case 'REMOVE_ENTRY':
      if (state.phase !== 'LOGGING') return state;
      return {
        ...state,
        entries: state.entries.filter((entry) => entry.entryId !== action.entryId),
      };

    case 'REVIEW': {
      if (state.phase !== 'LOGGING' || state.entries.length === 0) return state;
      emit({
        type: 'reflection_completed',
        userId: state.userId,
        at: action.at,
        detail: {
          surface: 'exposure_log',
          entries: state.entries.length,
          totalMinutes: summariseExposure(state).totalMinutes,
        },
      });
      return { ...state, phase: 'REVIEW' };
    }

    case 'RESET':
      return createExposureLog(state.userId);

    default:
      return state;
  }
}

/**
 * The exposure reducer. Pure: same `(state, action)` in, deeply equal state out, nothing else.
 * What the transition wanted to report is in `emitted`, for the caller to drain once.
 */
export function exposureReducer(
  state: ExposureLogState,
  action: ExposureAction,
): ExposureLogState {
  const events: LearningEvent[] = [];
  const next = reduceExposure(state, action, (event) => events.push(event));
  if (next === state && events.length === 0) return state;
  // Derived from the previous counter so RESET moves it forward rather than back to zero.
  return { ...next, transitionId: state.transitionId + 1, emitted: events };
}

/** Reduce and drain in one step, for callers outside React (tests, scripts). */
export function applyExposure(
  state: ExposureLogState,
  action: ExposureAction,
  sink?: EventSink,
): ExposureLogState {
  const next = exposureReducer(state, action);
  if (next !== state) drainEvents(next, sink);
  return next;
}
