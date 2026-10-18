/**
 * Care Quest — the app's front door, rebuilt.
 *
 * The first Skin Quest asked seven loose questions about face, hair and body at once and handed
 * back only the reader's own answers. The owner called it low-level, and he was right. This
 * screen walks one area at a time (face first, then scalp & hair, then body), explains the five
 * skin types before asking which is hers, offers twenty concerns with "none of these", and ends
 * with a likely type, the ingredients commonly used for each concern, a morning and evening
 * routine for her age, products to look at, and the patch-test and sunscreen habits.
 *
 * Every word comes from `src/content/care-quest/` (rule 8). Results are labelled as a
 * cosmetic-education estimate, not a diagnosis, with the sources underneath. Nothing here
 * records an attempt or touches mastery (rule 9); answers stay on the phone.
 */
import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { translate } from '@/localization/messages';
import { CARE_TRACKS, careTrack } from '@/content/care-quest';
import {
  NONE_ID,
  NOT_SURE_ID,
  PRODUCT_KINDS,
  QUEST_TEXT,
  productKind,
} from '@/content/care-quest/common';
import { inLocale, type Localized } from '@/content/care-quest/types';
import type {
  CareTrack,
  LearnStep,
  MultiStep,
  QuestAnswers,
  RoutineLine,
  SingleStep,
  TrackId,
} from '@/content/care-quest/types';
import type { QuestNav } from '@/app/app-chrome';
import { CHROME } from '../chrome-text';
import { Icon, Sheet } from '../components/AppChrome';
import { ProductAskLink } from '../components/ProductAsk';
import { RoutineWeekCard } from '../components/RoutineWeek';
import { productAskHref, tipsAskMessage } from '@/app/product-ask';
import { requestShareNudge } from '@/app/share-ask';
import { OtherAppLinks } from '../components/OtherApps';
import { ShareAskAtEnd } from '../components/ShareAsk';
import { displayCode } from '@/app/store-catalog';
import { companyDictionary } from '@/content/company/ingredient-dictionary';
import { storeCatalog } from '@/content/store-catalog';
import type { StoreProduct } from '@/content/store-catalog-types';
import {
  careQuestReducer,
  compareWithPrevious,
  currentStep,
  governedIdsFor,
  initialCareQuest,
  loadHistory,
  loadProgress,
  loadSavedResults,
  questEntryState,
  saveProgress,
  labelEvidence,
  matchProducts,
  resultSummary,
  pickedConcerns,
  readType,
  recordHistory,
  resultDate,
  retestDate,
  saveResult,
  selfDisagrees,
  startingCareQuest,
  typeConfidence,
  typeReasons,
  type CareQuestAction,
  type CareQuestState,
  type QuestHistory,
  type ResultChange,
  type SavedResults,
} from '@/app/care-quest';
import {
  currentStreak,
  issueGift,
  loadCollection,
  saveCollection,
  withDiscovered,
  withVisit,
  type CollectionState,
} from '@/app/collection';
import { GiftCard, StreakBadge } from '../components/Collection';
import { Companion, CompanionSays, SpeechBubble } from '../components/Companion';
import { ReadAloud } from '../components/ReadAloud';
import { SceneHero } from '../components/SceneHero';
import { GlowHero, InstallButton } from '../components/GlowHero';
import { QuestWelcome } from './QuestWelcome';
import { spokenFallback } from '../spoken-fallback';
import { pick } from '../pick';
import { PARTNER_PARAM } from '@/app/partner';
import { trackPartnerVisit } from '@/app/partner-track';

/** The address the app is served from, so a shared link opens this same app. */
const appBase = (): string =>
  typeof window === 'undefined' ? '/' : `${window.location.origin}${window.location.pathname}`;

const storage = (): Storage | undefined =>
  typeof localStorage === 'undefined' ? undefined : localStorage;

type Dispatch = (action: CareQuestAction) => void;

/** Text in the reader's language, and a read-aloud control that can borrow Thai for Lao. */
function Say({
  text,
  locale,
  autoplay = false,
}: {
  text: Localized;
  locale: string;
  autoplay?: boolean;
}) {
  return (
    <ReadAloud
      text={inLocale(text, locale)}
      locale={locale}
      fallback={spokenFallback(locale, (spoken) => inLocale(text, spoken))}
      autoplay={autoplay}
    />
  );
}

const fill = (text: string, params: Record<string, string>) =>
  text.replace(/\{(\w+)\}/g, (_, key: string) => params[key] ?? `{${key}}`);

export function CareQuestScreen({
  locale,
  partner = null,
  fromSkinQuest = false,
  startTrack = null,
  begun = false,
  entry = null,
  onNav,
  onExplore,
  onGlowHome,
  onOpenIngredient,
  onOpenProduct,
}: {
  locale: string;
  partner?: string | null;
  /** Arrived from SKIN QUEST's "learn more" link (`?from=skinquest`). */
  fromSkinQuest?: boolean;
  /** Came in through the game door (`?play`): open on this track's first question. */
  startTrack?: TrackId | null;
  /** The reader has already pressed «begin» on the light greeting the app shows first. */
  begun?: boolean;
  /** From GLOW home: open the last result, or continue a half-done track. */
  entry?: 'result' | 'resume' | null;
  /** KG-APP-BASE bottom bar: where the reader is, and what Back/Next do here. */
  onNav?: (nav: QuestNav | null) => void;
  onExplore: () => void;
  /** «Learn more deeply → GLOW Class»: from the result to the class's home. */
  onGlowHome: () => void;
  onOpenIngredient: (id: string) => void;
  onOpenProduct: (sku: string) => void;
}) {
  const [saved, setSaved] = useState<SavedResults>(() => loadSavedResults(storage()));
  const [history, setHistory] = useState<QuestHistory>(() => loadHistory(storage()));
  // Someone who has finished a track before (and has just come back from the dictionary or a
  // product it linked to) lands on the track list with "see my result", not on the greeting.
  // The game door (`?play`) always starts the quest itself, even for someone who has played before.
  const [state, dispatch] = useReducer(careQuestReducer, saved, (initial: SavedResults) =>
    startTrack
      ? startingCareQuest(startTrack)
      : entry && questEntryState(entry, initial, loadProgress(storage()), history)
        ? questEntryState(entry, initial, loadProgress(storage()), history)!
      : begun || Object.keys(initial).length > 0 || loadProgress(storage())
        ? { ...initialCareQuest, phase: 'tracks' as const }
        : initialCareQuest,
  );
  // Tell the bottom bar where we are. Next on a question is «Skip» until it is answered —
  // skipping records nothing, so the result never pretends to know an answer it was not given.
  useEffect(() => {
    if (!onNav) return;
    const step = currentStep(state);
    const steps = state.track ? (careTrack(state.track)?.steps.length ?? 0) : 0;
    const answered = step ? (state.answers[step.id]?.length ?? 0) > 0 : false;
    onNav({
      position:
        state.phase === 'steps' && steps > 0 ? { index: state.stepIndex + 1, total: steps } : null,
      canGoBack: state.phase !== 'welcome',
      nextLabel:
        state.phase === 'result'
          ? 'restart'
          : state.phase === 'steps'
            ? answered
              ? 'next'
              : 'skip'
            : 'next',
      back: () => dispatch({ type: 'back' }),
      next: () => {
        if (state.phase === 'welcome') dispatch({ type: 'begin' });
        else if (state.phase === 'tracks') dispatch({ type: 'chooseTrack', track: 'face' });
        else if (state.phase === 'steps') dispatch({ type: 'skip' });
        else if (state.track) dispatch({ type: 'chooseTrack', track: state.track });
      },
    });
  }, [state, onNav]);
  useEffect(() => () => onNav?.(null), [onNav]);
  const [collection, setCollection] = useState<CollectionState>(() => loadCollection(storage()));
  // A track left half-way — offered as "continue" on the track list, re-read each time the list
  // is shown so a track finished since then no longer offers it.
  const progress = useMemo(
    () => (state.phase === 'tracks' ? loadProgress(storage()) : null),
    [state.phase],
  );

  useEffect(() => saveProgress(storage(), state), [state]);
  const t = (text: Localized) => inLocale(text, locale);

  useEffect(() => {
    setCollection((previous) => {
      const next = withVisit(previous, new Date());
      if (next !== previous) saveCollection(storage(), next);
      return next;
    });
  }, []);

  // A finished track is remembered on this phone, and its governed concerns go on the shelf.
  useEffect(() => {
    if (state.phase !== 'result' || !state.track) return;
    const track = careTrack(state.track);
    if (!track) return;
    const earlier = loadSavedResults(storage())[track.id];
    setHistory((previous) =>
      recordHistory(storage(), previous, track.id, state.answers, new Date(), earlier),
    );
    setSaved((previous) => saveResult(storage(), previous, track.id, state.answers));
    const ids = governedIdsFor(pickedConcerns(track, state.answers));
    if (ids.length > 0) {
      setCollection((previous) => {
        const next = withDiscovered(previous, ids);
        if (next.discoveredConcernIds.length !== previous.discoveredConcernIds.length) {
          saveCollection(storage(), next);
        }
        return next;
      });
    }
    // Counts the visit for the partner who sent this reader here (decision ② — see
    // src/app/partner-track.ts for exactly what this does and does not record).
    if (partner) trackPartnerVisit(partner, 'result', track.id);
  }, [state.phase, state.track, state.answers]);

  // Moving from the questions to the result: the first result on this phone offers the home-screen
  // icon once (the app's own install guidance); any result may bring the soft like/share note,
  // which keeps its own once-a-visit, once-in-three-days budget (src/app/share-ask.ts).
  const previousPhase = useRef(state.phase);
  const [installHint, setInstallHint] = useState(false);
  useEffect(() => {
    const from = previousPhase.current;
    previousPhase.current = state.phase;
    if (state.phase !== 'result' || from !== 'steps') return;
    if (firstInstallHint(storage())) {
      setInstallHint(true);
      return;
    }
    const timer = setTimeout(() => requestShareNudge(), 2500);
    return () => clearTimeout(timer);
  }, [state.phase]);

  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo?.(0, 0);
  }, [state.phase, state.stepIndex, state.track]);

  if (state.phase === 'welcome') {
    return (
      <QuestWelcome
        locale={locale}
        partner={partner}
        fromSkinQuest={fromSkinQuest}
        onBegin={() => dispatch({ type: 'begin' })}
      />
    );
  }

  if (state.phase === 'tracks') {
    return (
      <section className="quest care-tracks" aria-labelledby="tracks-title">
        <GlowHero locale={locale} partner={partner} fromSkinQuest={fromSkinQuest} compact />
        <CompanionSays>
          <p className="bubble__prompt" id="tracks-title">
            {t(QUEST_TEXT.chooseTrack)}
          </p>
          <p className="bubble__help">{t(QUEST_TEXT.chooseTrackHelp)}</p>
          <Say text={QUEST_TEXT.chooseTrackHelp} locale={locale} />
        </CompanionSays>
        <ol className="care-tracks__list">
          {CARE_TRACKS.map((track, index) => (
            <li key={track.id}>
              <button
                type="button"
                className="academy-card care-track"
                onClick={() => dispatch({ type: 'chooseTrack', track: track.id })}
              >
                <span className="academy-card__media" aria-hidden="true">
                  <img
                    src={track.cover}
                    alt=""
                    style={track.coverFocus ? { objectPosition: track.coverFocus } : undefined}
                  />
                </span>
                <span className="academy-card__text">
                  <span className="academy-card__n">
                    {index + 1}
                    {saved[track.id] ? ` · ${t(QUEST_TEXT.done)}` : ''}
                  </span>
                  <span className="academy-card__title">{t(track.title)}</span>
                  <span className="academy-card__body">{t(track.intro)}</span>
                </span>
              </button>
              {progress && progress.track === track.id ? (
                <button
                  type="button"
                  className="btn btn--primary btn--small"
                  onClick={() =>
                    dispatch({
                      type: 'resume',
                      track: progress.track,
                      stepIndex: progress.stepIndex,
                      answers: progress.answers,
                    })
                  }
                >
                  ▶{' '}
                  {t(QUEST_TEXT.resume)
                    .replace('{done}', String(progress.stepIndex + 1))
                    .replace('{total}', String(track.steps.length))}
                </button>
              ) : null}
              {saved[track.id] ? (
                <button
                  type="button"
                  className="btn btn--quiet btn--small"
                  onClick={() =>
                    dispatch({ type: 'restore', track: track.id, answers: saved[track.id]! })
                  }
                >
                  {t(QUEST_TEXT.seeResult)}
                </button>
              ) : null}
            </li>
          ))}
        </ol>
        <p className="record-block__note">{t(QUEST_TEXT.savedNote)}</p>
      </section>
    );
  }

  const track = state.track ? careTrack(state.track) : undefined;
  if (!track) return null;

  if (state.phase === 'result') {
    return (
      <>
      <CareResult
        track={track}
        answers={state.answers}
        locale={locale}
        collection={collection}
        history={history}
        partner={partner}
        dispatch={dispatch}
        onExplore={onExplore}
        onGlowHome={onGlowHome}
        onOpenIngredient={onOpenIngredient}
        onOpenProduct={onOpenProduct}
      />
      {installHint ? (
        <Sheet title={inLocale(CHROME.installHintTitle!, locale)} locale={locale} onClose={() => setInstallHint(false)}>
          <p className="kg-setting__note">{inLocale(CHROME.installHintBody!, locale)}</p>
          <InstallButton locale={locale} />
        </Sheet>
      ) : null}
      </>
    );
  }

  return <StepView track={track} state={state} locale={locale} dispatch={dispatch} />;
}

function StepView({
  track,
  state,
  locale,
  dispatch,
}: {
  track: CareTrack;
  state: CareQuestState;
  locale: string;
  dispatch: Dispatch;
}) {
  const step = currentStep(state);
  if (!step) return null;
  const t = (text: Localized) => inLocale(text, locale);
  const total = track.steps.length;
  const done = state.stepIndex;
  const percent = Math.round((done / total) * 100);

  return (
    <section className="quest care-step" aria-labelledby="quest-prompt">
      <header className="quest__header">
        <p className="quest__level">
          {t(track.title)} · {t(step.section)}
        </p>
        <div className="quest__bar">
          <span className="quest__bar-fill" style={{ width: `${percent}%` }} />
        </div>
        <p className="quest__count">
          {fill(t(QUEST_TEXT.progress), { done: String(done + 1), total: String(total) })}
        </p>
      </header>

      <CompanionSays>
        <p className="bubble__prompt" id="quest-prompt">
          {t(step.prompt)}
        </p>
        {step.help ? <p className="bubble__help">{t(step.help)}</p> : null}
        <Say text={step.prompt} locale={locale} autoplay />
      </CompanionSays>

      {step.kind === 'single' ? (
        <SingleChoices step={step} state={state} locale={locale} dispatch={dispatch} />
      ) : step.kind === 'multi' ? (
        <MultiChoices step={step} state={state} locale={locale} dispatch={dispatch} />
      ) : (
        <LearnCards step={step} locale={locale} />
      )}

      <div className="quest__foot">
        <button type="button" className="btn btn--quiet" onClick={() => dispatch({ type: 'back' })}>
          {t(QUEST_TEXT.back)}
        </button>
        {step.kind === 'learn' ? (
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => dispatch({ type: 'next' })}
          >
            {t(QUEST_TEXT.learnDone)}
          </button>
        ) : step.kind === 'multi' ? (
          <button
            type="button"
            className="btn btn--primary"
            disabled={(state.answers[step.id] ?? []).length === 0}
            onClick={() => dispatch({ type: 'next' })}
          >
            {state.stepIndex + 1 >= total ? t(QUEST_TEXT.seeResult) : t(QUEST_TEXT.next)}
          </button>
        ) : state.answers[step.id] ? (
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => dispatch({ type: 'next' })}
          >
            {t(QUEST_TEXT.next)}
          </button>
        ) : null}
      </div>
    </section>
  );
}

function ChoiceButton({
  label,
  detail,
  pressed,
  muted,
  onClick,
}: {
  icon?: string | undefined;
  label: string;
  detail?: string | undefined;
  pressed: boolean;
  muted?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`option care-option${muted ? ' care-option--muted' : ''}`}
      aria-pressed={pressed}
      onClick={onClick}
    >
      {/* KG-APP-BASE §5: a line mark, never an emoji. Empty until picked, then a check. */}
      <span className="care-option__icon care-option__mark" aria-hidden="true">
        {pressed ? <Icon name="check" /> : null}
      </span>
      <span className="care-option__text">
        <span className="care-option__label">{label}</span>
        {detail ? <span className="care-option__detail">{detail}</span> : null}
      </span>
    </button>
  );
}

function SingleChoices({
  step,
  state,
  locale,
  dispatch,
}: {
  step: SingleStep;
  state: CareQuestState;
  locale: string;
  dispatch: Dispatch;
}) {
  const chosen = state.answers[step.id]?.[0];
  return (
    <ul className="options" role="list">
      {step.choices.map((choice) => (
        <li key={choice.id}>
          <ChoiceButton
            icon={choice.icon}
            label={inLocale(choice.label, locale)}
            detail={choice.detail ? inLocale(choice.detail, locale) : undefined}
            pressed={chosen === choice.id}
            muted={choice.id === NOT_SURE_ID}
            onClick={() => dispatch({ type: 'choose', stepId: step.id, choiceId: choice.id })}
          />
        </li>
      ))}
    </ul>
  );
}

function MultiChoices({
  step,
  state,
  locale,
  dispatch,
}: {
  step: MultiStep;
  state: CareQuestState;
  locale: string;
  dispatch: Dispatch;
}) {
  const picked = state.answers[step.id] ?? [];
  const t = (text: Localized) => inLocale(text, locale);
  const button = (id: string) => {
    const choice = step.choices.find((c) => c.id === id);
    if (!choice) return null;
    return (
      <li key={choice.id}>
        <ChoiceButton
          icon={choice.icon}
          label={t(choice.label)}
          detail={choice.detail ? t(choice.detail) : undefined}
          pressed={picked.includes(choice.id)}
          muted={choice.id === NONE_ID}
          onClick={() => dispatch({ type: 'toggle', stepId: step.id, choiceId: choice.id })}
        />
      </li>
    );
  };
  const grouped = new Set(step.groups?.flatMap((group) => group.ids) ?? []);
  const loose = step.choices.filter((choice) => !grouped.has(choice.id));

  return (
    <>
      <p className="care-multi__count" aria-live="polite">
        {step.max ? fill(t(QUEST_TEXT.pickUpTo), { n: String(step.max) }) : t(QUEST_TEXT.pickAny)}
        {picked.length > 0 && !picked.includes(NONE_ID)
          ? ` · ${fill(t(QUEST_TEXT.picked), { n: String(picked.length) })}`
          : ''}
      </p>
      {step.groups?.map((group) => (
        <section key={group.id} className="care-group" aria-label={t(group.label)}>
          {group.photo ? (
            <figure className="care-photo care-photo--band" aria-hidden="true">
              <img src={group.photo} alt="" loading="lazy" />
            </figure>
          ) : null}
          <h2 className="care-group__title">{t(group.label)}</h2>
          <ul className="options care-options--grid" role="list">
            {group.ids.map(button)}
          </ul>
        </section>
      ))}
      <ul className="options" role="list">
        {loose.map((choice) => button(choice.id))}
      </ul>
    </>
  );
}

function LearnCards({ step, locale }: { step: LearnStep; locale: string }) {
  const t = (text: Localized) => inLocale(text, locale);
  return (
    <ul className="care-learn" role="list">
      {step.cards.map((card) => (
        <li key={card.id} className="care-learn__card">
          {card.image ? (
            <figure className="care-learn__media" aria-hidden="true">
              <img src={card.image} alt="" loading="lazy" />
            </figure>
          ) : null}
          <h2 className="care-learn__title">
            {t(card.title)}
          </h2>
          <p className="care-learn__body">{t(card.body)}</p>
          <ul className="care-learn__signs">
            {card.signs.map((sign) => (
              <li key={sign.en}>{t(sign)}</li>
            ))}
          </ul>
          <Say
            text={{
              ko: `${card.title.ko}. ${card.body.ko} ${card.signs.map((s) => s.ko).join('. ')}`,
              en: `${card.title.en}. ${card.body.en} ${card.signs.map((s) => s.en).join('. ')}`,
              lo: `${card.title.lo}. ${card.body.lo} ${card.signs.map((s) => s.lo).join('. ')}`,
              th: `${card.title.th}. ${card.body.th} ${card.signs.map((s) => s.th).join('. ')}`,
              fr: `${card.title.fr}. ${card.body.fr} ${card.signs.map((s) => s.fr).join('. ')}`,
            }}
            locale={locale}
          />
        </li>
      ))}
    </ul>
  );
}

const productName = (product: StoreProduct, locale: string): string =>
  locale === 'ko'
    ? product.nameKo
    : ((locale === 'lo' || locale === 'th' || locale === 'fr' ? product.names[locale] : null) ??
      product.nameEn ??
      product.nameKo);

const ingredientName = (id: string, locale: string): string | null => {
  const entry = companyDictionary.ingredients.find((ingredient) => ingredient.id === id);
  return entry ? pick(entry.name, locale) : null;
};

function RoutineList({
  title,
  icon,
  lines,
  locale,
}: {
  title: string;
  icon: string;
  lines: readonly RoutineLine[];
  locale: string;
}) {
  if (lines.length === 0) return null;
  return (
    <section className="care-routine" aria-label={title}>
      <h3 className="care-routine__title">
        {title}
      </h3>
      <ol className="care-routine__steps">
        {lines.map((line, index) => {
          const kind = productKind(line.kind);
          return (
            <li key={`${line.kind}-${index}`} className="care-routine__step">
              <span className="care-routine__n" aria-hidden="true">
                {index + 1}
              </span>
              <span className="care-routine__text">
                <strong>{kind ? `${inLocale(kind.name, locale)}` : line.kind}</strong>
                <span>{inLocale(line.note, locale)}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function CareResult({
  track,
  answers,
  locale,
  collection,
  history,
  partner,
  dispatch,
  onExplore,
  onGlowHome,
  onOpenIngredient,
  onOpenProduct,
}: {
  track: CareTrack;
  answers: QuestAnswers;
  locale: string;
  collection: CollectionState;
  history: QuestHistory;
  partner: string | null;
  dispatch: Dispatch;
  onExplore: () => void;
  onGlowHome: () => void;
  onOpenIngredient: (id: string) => void;
  onOpenProduct: (sku: string) => void;
}) {
  const t = (text: Localized) => inLocale(text, locale);
  const reading = useMemo(() => readType(track, answers), [track, answers]);
  const concerns = useMemo(() => pickedConcerns(track, answers), [track, answers]);
  const plan = useMemo(() => track.plan(answers, reading), [track, answers, reading]);
  const kinds = new Set(plan.routines.flatMap((block) => block.lines.map((line) => line.kind)));
  const categories = [
    ...new Set(
      PRODUCT_KINDS.filter((kind) => kinds.has(kind.id)).flatMap((kind) => kind.categories),
    ),
  ];
  const products = matchProducts(storeCatalog, concerns, reading, categories);
  const type = reading.typeId ? track.types.find((item) => item.id === reading.typeId) : undefined;
  const close = reading.closeTypeId
    ? track.types.find((item) => item.id === reading.closeTypeId)
    : undefined;
  const modifier =
    reading.modifier && track.modifierTypeId
      ? track.types.find((item) => item.id === track.modifierTypeId)
      : undefined;
  const now = useMemo(() => new Date(), []);
  const reasons = reading.typeId ? typeReasons(track, answers, reading.typeId) : [];
  const confidence = typeConfidence(track, answers);
  const selfId = selfDisagrees(track, answers);
  const selfType = selfId ? track.types.find((item) => item.id === selfId) : undefined;
  const change = compareWithPrevious(track, history, answers);
  const shownAt = resultDate(history, track.id, answers) ?? now.toISOString().slice(0, 10);
  const gift = useMemo(() => issueGift(now), [now]);
  const streak = currentStreak(collection, now);
  const avoid = new Set(plan.avoid);

  return (
    <section className="quest quest--record care-result" aria-labelledby="result-title">
      <p className="eyebrow">
        {t(QUEST_TEXT.resultEyebrow)} · {t(track.title)}
      </p>
      <StreakBadge days={streak} locale={locale} />

      {plan.alert ? (
        <p className="boundary boundary--strong care-alert" role="alert">
          🩺 {t(plan.alert)}
        </p>
      ) : null}

      <p className="disclosure disclosure--caution">
        <span className="disclosure__mark">!</span>
        <span>{t(QUEST_TEXT.notDiagnosis)}</span>
      </p>

      <section className="care-type" aria-labelledby="result-title">
        {type?.photo ? (
          <figure className="care-photo care-photo--type" aria-hidden="true">
            <img src={type.photo} alt="" />
          </figure>
        ) : null}
        <p className="care-type__eyebrow">{t(QUEST_TEXT.likelyType)}</p>
        {type ? (
          <>
            <h1 className="care-type__name" id="result-title">
              {t(type.name)}
              {modifier ? (
                <span className="care-type__mod"> + {t(QUEST_TEXT.sensitiveToo)}</span>
              ) : null}
            </h1>
            {close ? (
              <p className="care-type__close">
                {fill(t(QUEST_TEXT.close), { name: t(close.name) })}
              </p>
            ) : null}
            <p className="care-type__summary">{t(type.summary)}</p>
            <ul className="care-type__care">
              {[...type.care, ...(modifier ? modifier.care : [])].map((line) => (
                <li key={line.en}>{t(line)}</li>
              ))}
            </ul>
            {confidence ? (
              <p className={`care-type__confidence care-type__confidence--${confidence}`}>
                {t(
                  confidence === 'clear'
                    ? QUEST_TEXT.confidenceClear
                    : confidence === 'mixed'
                      ? QUEST_TEXT.confidenceMixed
                      : QUEST_TEXT.confidenceLikely,
                )}
              </p>
            ) : null}
            {reasons.length > 0 ? (
              <div className="care-why">
                <p className="care-concern__label">{t(QUEST_TEXT.why)}</p>
                <ul className="care-why__list">
                  {reasons.slice(0, 6).map((reason) => (
                    <li key={`${reason.stepId}:${reason.answer.en}`}>{t(reason.answer)}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {selfType ? (
              <p className="care-type__close">
                {fill(t(QUEST_TEXT.selfDiffers), { name: t(selfType.name) })}
              </p>
            ) : null}
            <Say
              text={{
                ko: `${type.name.ko}. ${type.summary.ko}`,
                en: `${type.name.en}. ${type.summary.en}`,
                lo: `${type.name.lo}. ${type.summary.lo}`,
                th: `${type.name.th}. ${type.summary.th}`,
                fr: `${type.name.fr}. ${type.summary.fr}`,
              }}
              locale={locale}
              autoplay
            />
          </>
        ) : (
          <>
            <h1 className="care-type__name" id="result-title">
              🤔
            </h1>
            <p className="care-type__summary">{t(QUEST_TEXT.notEnough)}</p>
          </>
        )}
      </section>

      {/* Secondary to «learn more deeply» below: a quiet button, not a primary one. */}
      <a
        className="btn btn--quiet kg-tips"
        href={productAskHref(tipsMessage(locale, type ? t(type.name) : t(track.title), partner))}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon name="chat" />
        {t(CHROME.tips!)}
      </a>

      {plan.avoidReason ? <p className="boundary boundary--strong">{t(plan.avoidReason)}</p> : null}

      <section className="record-block">
        <h2 className="record-block__title">{t(QUEST_TEXT.yourConcerns)}</h2>
        {concerns.length === 0 ? (
          <p className="record-block__note">{t(QUEST_TEXT.noConcerns)}</p>
        ) : (
          <ul className="care-concerns" role="list">
            {concerns.map((concern) => (
              <li key={concern.id} className="care-concern">
                {concern.photo ? (
                  <figure className="care-photo care-photo--concern" aria-hidden="true">
                    <img src={concern.photo} alt="" loading="lazy" />
                  </figure>
                ) : null}
                <h3 className="care-concern__name">
                  {t(concern.name)}
                </h3>
                <p className="care-concern__what">{t(concern.what)}</p>
                {concern.ingredients.length + (concern.otherIngredients?.length ?? 0) > 0 ? (
                  <>
                    <p className="care-concern__label">{t(QUEST_TEXT.commonlyUsed)}</p>
                    <ul className="chips" role="list">
                      {concern.ingredients.map((id) => {
                        const name = ingredientName(id, locale);
                        if (!name) return null;
                        const held = avoid.has(id);
                        return (
                          <li key={id}>
                            <button
                              type="button"
                              className={`chip care-chip${held ? ' care-chip--held' : ''}`}
                              onClick={() => onOpenIngredient(id)}
                            >
                              {name}
                              {held ? ` · ${t(QUEST_TEXT.avoidNow)}` : ''}
                            </button>
                          </li>
                        );
                      })}
                      {(concern.otherIngredients ?? []).map((name) => (
                        <li key={name.en}>
                          <span className="chip chip--soft">{t(name)}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
                <p className="care-concern__label">{t(QUEST_TEXT.productTypes)}</p>
                <p className="care-concern__kinds">
                  {concern.products
                    .map((id) => productKind(id))
                    .filter((kind) => kind !== undefined)
                    .map((kind) => `${t(kind!.name)}`)
                    .join(' · ')}
                </p>
                <p className="care-concern__tip">💡 {t(concern.tip)}</p>
                {concern.seeDoctor ? (
                  <p className="care-concern__doctor">
                    <strong>🩺 {t(QUEST_TEXT.seeDoctor)}:</strong> {t(concern.seeDoctor)}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      {change ? <ResultCompare track={track} change={change} locale={locale} /> : null}

      <section className="record-block">
        <h2 className="record-block__title">
          {plan.routines.map((block) => t(block.title)).join(' · ')}
        </h2>
        <div className="care-routines">
          {plan.routines.map((block) => (
            <RoutineList
              key={block.id}
              title={t(block.title)}
              icon={block.icon}
              lines={block.lines}
              locale={locale}
            />
          ))}
        </div>
        {plan.weekly.map((line) => (
          <p key={line.kind} className="record-block__note">
            🗓️ {productKind(line.kind) ? t(productKind(line.kind)!.name) : line.kind} —{' '}
            {t(line.note)}
          </p>
        ))}
      </section>

      {plan.advice.map((block) => (
        <section key={block.id} className="record-block care-advice">
          {block.photo ? (
            <figure className="care-photo care-photo--band" aria-hidden="true">
              <img src={block.photo} alt="" loading="lazy" />
            </figure>
          ) : null}
          <h2 className="record-block__title">
            {t(block.title)}
          </h2>
          <ul className="care-advice__list">
            {block.points.map((point) => (
              <li key={point.en}>{t(point)}</li>
            ))}
          </ul>
          <Say
            text={{
              ko: [block.title.ko, ...block.points.map((p) => p.ko)].join('. '),
              en: [block.title.en, ...block.points.map((p) => p.en)].join('. '),
              lo: [block.title.lo, ...block.points.map((p) => p.lo)].join('. '),
              th: [block.title.th, ...block.points.map((p) => p.th)].join('. '),
              fr: [block.title.fr, ...block.points.map((p) => p.fr)].join('. '),
            }}
            locale={locale}
          />
        </section>
      ))}

      {products.length > 0 ? (
        <section className="record-block">
          {/* Commercial disclosure: these are the company's own products. */}
          <p className="kg-kgtag">{t(CHROME.kgProducts!)}</p>
          <h2 className="record-block__title">{t(QUEST_TEXT.products)}</h2>
          <ul className="care-products" role="list">
            {products.map((product) => (
              <li key={product.sku}>
                <button
                  type="button"
                  className="care-product"
                  onClick={() => onOpenProduct(product.sku)}
                >
                  <span className="care-product__media" aria-hidden="true">
                    {product.photo ? <img src={product.photo} alt="" loading="lazy" /> : <Icon name="bottle" />}
                  </span>
                  <span className="care-product__text">
                    <span className="care-product__brand">
                      {displayCode(product.sku) ? `${displayCode(product.sku)} · ` : ''}
                      {product.brand}
                    </span>
                    <span className="care-product__name">{productName(product, locale)}</span>
                    {locale === 'ko' ? (
                      <span className="care-product__cat">{product.category}</span>
                    ) : null}
                    {labelEvidence(product, concerns).length > 0 ? (
                      <span className="care-product__why">
                        {t(CHROME.whyLabel!)}:{' '}
                        {labelEvidence(product, concerns)
                          .slice(0, 3)
                          .map((item) => `${item.printed} (${fill(t(CHROME.nth!), { n: String(item.position) })})`)
                          .join(' · ')}
                      </span>
                    ) : null}
                  </span>
                </button>
                <ProductAskLink
                  code={displayCode(product.sku) ?? product.sku}
                  brand={product.brand}
                  name={productName(product, locale)}
                  locale={locale}
                  partner={partner}
                />
              </li>
            ))}
          </ul>
          <p className="record-block__note">{t(QUEST_TEXT.productsNote)}</p>
        </section>
      ) : null}

      <section className="record-block care-sources">
        <h2 className="record-block__title">{t(QUEST_TEXT.sources)}</h2>
        <p className="record-block__note">{t(QUEST_TEXT.draft)}</p>
        <ul className="care-sources__list">
          {track.sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noreferrer noopener">
                {source.name}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="record-block care-retest">
        <h2 className="record-block__title">🗓️ {t(QUEST_TEXT.retestTitle)}</h2>
        <p className="record-block__note">
          {fill(t(QUEST_TEXT.retestBody), { date: retestDate(shownAt) })}
        </p>
      </section>

      <ShareResult track={track} answers={answers} locale={locale} partner={partner} />

      {/* Last, after the safety and education above: education outranks commerce (rule 6). */}
      <GiftCard gift={gift} locale={locale} partner={partner} />

      <RoutineWeekCard locale={locale} />

      <div className="quest__foot">
        <button
          type="button"
          className="btn btn--quiet"
          onClick={() => dispatch({ type: 'tracks' })}
        >
          {t(QUEST_TEXT.otherTracks)}
        </button>
        <button
          type="button"
          className="btn btn--quiet"
          onClick={() => dispatch({ type: 'chooseTrack', track: track.id })}
        >
          {t(QUEST_TEXT.restart)}
        </button>
        <button type="button" className="btn btn--quiet" onClick={onExplore}>
          {t(QUEST_TEXT.learnMore)}
        </button>
      </div>
      {/* SKIN QUEST → GLOW Class: the one big way on. The result stays saved on this phone. */}
      <button type="button" className="btn btn--primary kg-deeper" onClick={onGlowHome}>
        {t(CHROME.deeper!)}
      </button>
      <p className="record-block__note">{t(QUEST_TEXT.savedNote)}</p>
      <OtherAppLinks locale={locale} />
      {/* Read to the end of a result: the first success, when the shared part may ask once. */}
      <ShareAskAtEnd />
    </section>
  );
}

/**
 * Send the result to a partner shop: the type, concern and goal names only, with the app link
 * (and the shop's code, if the reader came in through one). Nothing is sent by the app itself —
 * the reader's own share sheet, clipboard or WhatsApp does it.
 */
/** This result beside the one before it: the reader's own answers, never a product effect. */
function ResultCompare({
  track,
  change,
  locale,
}: {
  track: CareTrack;
  change: ResultChange;
  locale: string;
}) {
  const t = (text: Localized) => inLocale(text, locale);
  const typeName = (id: string | null) => {
    const type = id ? track.types.find((item) => item.id === id) : undefined;
    return type ? t(type.name) : '—';
  };
  const rows = [
    { key: 'added', label: QUEST_TEXT.compareAdded, items: change.added },
    { key: 'kept', label: QUEST_TEXT.compareKept, items: change.kept },
    { key: 'gone', label: QUEST_TEXT.compareGone, items: change.gone },
  ].filter((row) => row.items.length > 0);
  return (
    <section className="record-block care-compare">
      <h2 className="record-block__title">↔️ {t(QUEST_TEXT.compareTitle)}</h2>
      <p className="care-compare__dates">
        {fill(t(QUEST_TEXT.compareDates), {
          before: change.previousAt ?? t(QUEST_TEXT.earlier),
          now: change.at ?? '—',
        })}
      </p>
      <p className="care-compare__type">
        <strong>{t(QUEST_TEXT.compareType)}:</strong>{' '}
        {change.typeBefore === change.typeNow
          ? `${typeName(change.typeNow)} · ${t(QUEST_TEXT.compareSame)}`
          : `${typeName(change.typeBefore)} → ${typeName(change.typeNow)}`}
      </p>
      {rows.map((row) => (
        <div key={row.key} className="care-compare__row">
          <p className="care-concern__label">{t(row.label)}</p>
          <ul className="chips" role="list">
            {row.items.map((concern) => (
              <li key={concern.id}>
                <span className="chip chip--soft">
                  {t(concern.name)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <p className="record-block__note">{t(QUEST_TEXT.compareNote)}</p>
    </section>
  );
}

function ShareResult({
  track,
  answers,
  locale,
  partner,
}: {
  track: CareTrack;
  answers: QuestAnswers;
  locale: string;
  partner: string | null;
}) {
  const [state, setState] = useState<'idle' | 'copied' | 'manual'>('idle');
  const t = (text: Localized) => inLocale(text, locale);
  const link =
    partner === null ? appBase() : `${appBase()}?${PARTNER_PARAM}=${encodeURIComponent(partner)}`;
  const message = resultSummary(track, answers, locale, link);
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setState('copied');
    } catch {
      setState('manual');
    }
  };
  const share = async () => {
    try {
      await navigator.share({ text: message });
    } catch {
      // The reader closed the share sheet; nothing to do.
    }
  };
  return (
    <section className="record-block care-share" aria-labelledby="care-share-title">
      <h2 className="record-block__title" id="care-share-title">
        📤 {t(QUEST_TEXT.shareTitle)}
      </h2>
      <p className="record-block__note">{t(QUEST_TEXT.shareIntro)}</p>
      <pre className="care-share__preview">{message}</pre>
      <div className="store-share">
        {canShare ? (
          <button type="button" className="btn" onClick={share}>
            📤 {t(QUEST_TEXT.share)}
          </button>
        ) : null}
        <button type="button" className="btn btn--quiet" onClick={copy}>
          📋 {t(QUEST_TEXT.copy)}
        </button>
        <a
          className="btn btn--quiet"
          href={`https://wa.me/?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          WhatsApp
        </a>
      </div>
      {state === 'copied' ? (
        <p className="store-share__done" role="status">
          ✓ {t(QUEST_TEXT.copied)}
        </p>
      ) : null}
    </section>
  );
}

const INSTALL_HINT_KEY = 'korea-glow:install-hint:v1';

/** True the first time only: the home-screen icon is offered once, after the first result. */
function firstInstallHint(store: Storage | undefined): boolean {
  try {
    if (!store || store.getItem(INSTALL_HINT_KEY)) return false;
    store.setItem(INSTALL_HINT_KEY, '1');
    if (typeof window !== 'undefined' && window.matchMedia?.('(display-mode: standalone)').matches) return false;
    return true;
  } catch {
    return false;
  }
}

/** The «skin-care tips on WhatsApp» message: the result's type, the language, the partner code. */
const tipsMessage = (locale: string, typeName: string, partner: string | null): string =>
  tipsAskMessage(inLocale(CHROME.tipsMessage!, locale), typeName, locale, partner);
