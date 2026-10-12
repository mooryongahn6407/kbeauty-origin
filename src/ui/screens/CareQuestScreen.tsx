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
import { useEffect, useMemo, useReducer, useState } from 'react';
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
} from '@/content/care-quest/types';
import { companyDictionary } from '@/content/company/ingredient-dictionary';
import { storeCatalog } from '@/content/store-catalog';
import type { StoreProduct } from '@/content/store-catalog-types';
import {
  careQuestReducer,
  currentStep,
  governedIdsFor,
  initialCareQuest,
  loadSavedResults,
  matchProducts,
  pickedConcerns,
  readType,
  saveResult,
  type CareQuestAction,
  type CareQuestState,
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
import { spokenFallback } from '../spoken-fallback';
import { pick } from '../pick';

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
  onExplore,
  onOpenIngredient,
  onOpenProduct,
}: {
  locale: string;
  partner?: string | null;
  onExplore: () => void;
  onOpenIngredient: (id: string) => void;
  onOpenProduct: (sku: string) => void;
}) {
  const [saved, setSaved] = useState<SavedResults>(() => loadSavedResults(storage()));
  // Someone who has finished a track before (and has just come back from the dictionary or a
  // product it linked to) lands on the track list with "see my result", not on the greeting.
  const [state, dispatch] = useReducer(careQuestReducer, saved, (initial: SavedResults) =>
    Object.keys(initial).length > 0
      ? { ...initialCareQuest, phase: 'tracks' as const }
      : initialCareQuest,
  );
  const [collection, setCollection] = useState<CollectionState>(() => loadCollection(storage()));
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
  }, [state.phase, state.track, state.answers]);

  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo?.(0, 0);
  }, [state.phase, state.stepIndex, state.track]);

  if (state.phase === 'welcome') {
    const spoken = [
      translate('skinquest.welcome.hello', locale),
      translate('skinquest.welcome.guide', locale),
      translate('skinquest.welcome.promise', locale),
    ].join(' ');
    return (
      <section className="quest quest--welcome" aria-labelledby="quest-hello">
        <Companion mood="calm" size={116} />
        <SpeechBubble>
          <h1 id="quest-hello" className="bubble__hello">
            {translate('skinquest.welcome.hello', locale)}
          </h1>
          <p className="bubble__prompt">{translate('skinquest.welcome.guide', locale)}</p>
          <p className="bubble__help">{translate('skinquest.welcome.promise', locale)}</p>
          <ReadAloud
            text={spoken}
            locale={locale}
            fallback={spokenFallback(locale, (l) =>
              [
                translate('skinquest.welcome.hello', l),
                translate('skinquest.welcome.guide', l),
                translate('skinquest.welcome.promise', l),
              ].join(' '),
            )}
            autoplay
          />
        </SpeechBubble>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => dispatch({ type: 'begin' })}
        >
          {translate('skinquest.welcome.begin', locale)}
        </button>
        <p className="boundary">{translate('skinquest.welcome.boundary', locale)}</p>
      </section>
    );
  }

  if (state.phase === 'tracks') {
    return (
      <section className="quest care-tracks" aria-labelledby="tracks-title">
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
                    {track.icon} {index + 1}
                    {saved[track.id] ? ` · ${t(QUEST_TEXT.done)}` : ''}
                  </span>
                  <span className="academy-card__title">{t(track.title)}</span>
                  <span className="academy-card__body">{t(track.intro)}</span>
                </span>
              </button>
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
      <CareResult
        track={track}
        answers={state.answers}
        locale={locale}
        collection={collection}
        partner={partner}
        dispatch={dispatch}
        onExplore={onExplore}
        onOpenIngredient={onOpenIngredient}
        onOpenProduct={onOpenProduct}
      />
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
          {track.icon} {t(track.title)} · {t(step.section)}
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
  icon,
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
      {icon ? (
        <span className="care-option__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
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
          <h2 className="care-learn__title">
            <span aria-hidden="true">{card.icon}</span> {t(card.title)}
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
        <span aria-hidden="true">{icon}</span> {title}
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
                <strong>{kind ? `${kind.icon} ${inLocale(kind.name, locale)}` : line.kind}</strong>
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
  partner,
  dispatch,
  onExplore,
  onOpenIngredient,
  onOpenProduct,
}: {
  track: CareTrack;
  answers: QuestAnswers;
  locale: string;
  collection: CollectionState;
  partner: string | null;
  dispatch: Dispatch;
  onExplore: () => void;
  onOpenIngredient: (id: string) => void;
  onOpenProduct: (sku: string) => void;
}) {
  const t = (text: Localized) => inLocale(text, locale);
  const reading = useMemo(() => readType(track, answers), [track, answers]);
  const concerns = useMemo(() => pickedConcerns(track, answers), [track, answers]);
  const plan = useMemo(() => track.plan(answers, reading), [track, answers, reading]);
  const kinds = new Set([...plan.am, ...plan.pm].map((line) => line.kind));
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
  const gift = useMemo(() => issueGift(now), [now]);
  const streak = currentStreak(collection, now);
  const avoid = new Set(plan.avoid);

  return (
    <section className="quest quest--record care-result" aria-labelledby="result-title">
      <p className="eyebrow">
        {track.icon} {t(QUEST_TEXT.resultEyebrow)} · {t(track.title)}
      </p>
      <StreakBadge days={streak} locale={locale} />

      <p className="disclosure disclosure--caution">
        <span className="disclosure__mark">!</span>
        <span>{t(QUEST_TEXT.notDiagnosis)}</span>
      </p>

      <section className="care-type" aria-labelledby="result-title">
        <p className="care-type__eyebrow">{t(QUEST_TEXT.likelyType)}</p>
        {type ? (
          <>
            <h1 className="care-type__name" id="result-title">
              <span aria-hidden="true">{type.icon}</span> {t(type.name)}
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

      {plan.avoidReason ? <p className="boundary boundary--strong">{t(plan.avoidReason)}</p> : null}

      <section className="record-block">
        <h2 className="record-block__title">{t(QUEST_TEXT.yourConcerns)}</h2>
        {concerns.length === 0 ? (
          <p className="record-block__note">{t(QUEST_TEXT.noConcerns)}</p>
        ) : (
          <ul className="care-concerns" role="list">
            {concerns.map((concern) => (
              <li key={concern.id} className="care-concern">
                <h3 className="care-concern__name">
                  <span aria-hidden="true">{concern.icon}</span> {t(concern.name)}
                </h3>
                <p className="care-concern__what">{t(concern.what)}</p>
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
                </ul>
                <p className="care-concern__label">{t(QUEST_TEXT.productTypes)}</p>
                <p className="care-concern__kinds">
                  {concern.products
                    .map((id) => productKind(id))
                    .filter((kind) => kind !== undefined)
                    .map((kind) => `${kind!.icon} ${t(kind!.name)}`)
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

      <section className="record-block">
        <h2 className="record-block__title">
          {t(QUEST_TEXT.morning)} · {t(QUEST_TEXT.evening)}
        </h2>
        <div className="care-routines">
          <RoutineList title={t(QUEST_TEXT.morning)} icon="🌅" lines={plan.am} locale={locale} />
          <RoutineList title={t(QUEST_TEXT.evening)} icon="🌙" lines={plan.pm} locale={locale} />
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
          <h2 className="record-block__title">
            <span aria-hidden="true">{block.icon}</span> {t(block.title)}
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
                    {product.photo ? <img src={product.photo} alt="" loading="lazy" /> : '🧴'}
                  </span>
                  <span className="care-product__text">
                    <span className="care-product__brand">{product.brand}</span>
                    <span className="care-product__name">{productName(product, locale)}</span>
                    {locale === 'ko' ? (
                      <span className="care-product__cat">{product.category}</span>
                    ) : null}
                  </span>
                </button>
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

      {/* Last, after the safety and education above: education outranks commerce (rule 6). */}
      <GiftCard gift={gift} locale={locale} partner={partner} />

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
        <button type="button" className="btn btn--primary" onClick={onExplore}>
          {t(QUEST_TEXT.learnMore)}
        </button>
      </div>
      <p className="record-block__note">{t(QUEST_TEXT.savedNote)}</p>
    </section>
  );
}
