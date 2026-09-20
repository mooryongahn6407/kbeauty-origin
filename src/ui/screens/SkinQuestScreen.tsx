/**
 * Skin Quest — the app's front door.
 *
 * What the reader meets first is a question about their own face, asked by someone, with four
 * big things to tap. What they leave with is the record of what they answered. Between those
 * two points the app states no fact about skin, because none of its knowledge records has
 * passed the evidence gate — and it turns out that a journey through your own observations
 * does not need one.
 *
 * The governed content it does show is named, not asserted: the fifteen 07_CONCERNS rows appear
 * as things to notice and as topics to learn (their `Learning_Goal`, which is what the source
 * says the topic is *for*), and the approved routine sequence appears verbatim. Everything
 * about review status lives on the owner screen now, not here.
 */
import { useEffect, useMemo, useReducer, useState } from 'react';
import { translate, type MessageKey } from '@/localization/messages';
import { concerns, routines } from '@/knowledge/repository';
import {
  currentStreak,
  issueGift,
  loadCollection,
  saveCollection,
  withDiscovered,
  withVisit,
  type CollectionState,
} from '@/app/collection';
import { CollectionShelf, GiftCard, StreakBadge, VisitCalendar } from '../components/Collection';
import { RoutineDiagram, SkinMap, type SkinRegion } from '../components/SkinMap';
import {
  ESCALATING_CONCERN_IDS,
  QUEST_LEVELS,
  concernsForLevel,
} from '@/content/skin-quest';
import {
  initialQuestState,
  questProgress,
  skinQuestReducer,
  type SkinQuestState,
} from '@/app/skin-quest';
import { CompanionSays, Companion } from '../components/Companion';
import { ReadAloud } from '../components/ReadAloud';

const pad = (value: number) => String(value).padStart(2, '0');

export function SkinQuestScreen({
  locale,
  onExplore,
}: {
  locale: string;
  onExplore: () => void;
}) {
  const [state, dispatch] = useReducer(skinQuestReducer, initialQuestState);
  // The shelf and the streak live in this browser only, and the app renders fine when the
  // read comes back empty — which it does in a private window, and during thumbnail capture.
  const [collection, setCollection] = useState<CollectionState>(() =>
    loadCollection(typeof localStorage === 'undefined' ? undefined : localStorage),
  );
  const t = (key: MessageKey, params?: Record<string, string>) =>
    translate(key, locale, params ?? {});

  useEffect(() => {
    setCollection((previous) => {
      const next = withVisit(previous, new Date());
      if (next !== previous) {
        saveCollection(typeof localStorage === 'undefined' ? undefined : localStorage, next);
      }
      return next;
    });
  }, []);

  // A card is discovered by opening its concern, so the shelf fills as the journey is walked
  // rather than only at the end.
  useEffect(() => {
    if (state.pickedConcernIds.length === 0) return;
    setCollection((previous) => {
      const next = withDiscovered(previous, state.pickedConcernIds);
      if (next.discoveredConcernIds.length === previous.discoveredConcernIds.length) {
        return previous;
      }
      saveCollection(typeof localStorage === 'undefined' ? undefined : localStorage, next);
      return next;
    });
  }, [state.pickedConcernIds]);

  if (state.phase === 'welcome') {
    return (
      <section className="quest quest--welcome" aria-labelledby="quest-headline">
        <p className="eyebrow">{t('skinquest.welcome.eyebrow')}</p>
        <Companion mood="calm" size={132} />
        <h1 id="quest-headline" className="quest__headline">
          {t('skinquest.welcome.headline')}
        </h1>
        <p className="quest__lead">{t('skinquest.welcome.lead')}</p>
        <ReadAloud
          text={`${t('skinquest.welcome.headline')} ${t('skinquest.welcome.lead')}`}
          locale={locale}
        />
        <button type="button" className="btn btn--primary" onClick={() => dispatch({ type: 'begin' })}>
          {t('skinquest.welcome.begin')}
        </button>
        <p className="boundary">{t('skinquest.welcome.boundary')}</p>
      </section>
    );
  }

  if (state.phase === 'record') {
    return (
      <QuestRecord
        state={state}
        locale={locale}
        collection={collection}
        onExplore={onExplore}
        dispatch={dispatch}
      />
    );
  }

  const level = QUEST_LEVELS[state.levelIndex];
  if (!level) return null;
  const progress = questProgress(state);

  return (
    <section className="quest" aria-labelledby="quest-prompt">
      <QuestHeader levelTitle={t(level.titleKey)} progress={progress} locale={locale} />

      {state.phase === 'steps' ? (
        <QuestStepView state={state} locale={locale} dispatch={dispatch} />
      ) : (
        <QuestConcernPicker state={state} locale={locale} dispatch={dispatch} />
      )}
    </section>
  );
}

function QuestHeader({
  levelTitle,
  progress,
  locale,
}: {
  levelTitle: string;
  progress: { done: number; total: number };
  locale: string;
}) {
  const percent = Math.round((progress.done / progress.total) * 100);
  return (
    <header className="quest__header">
      <p className="quest__level">{levelTitle}</p>
      <div className="quest__bar">
        <span className="quest__bar-fill" style={{ width: `${percent}%` }} />
      </div>
      <p className="quest__count">
        {pad(progress.done)} / {pad(progress.total)}
        <span className="visually-hidden">
          {' '}
          {translate('skinquest.progress', locale, {
            done: String(progress.done),
            total: String(progress.total),
          })}
        </span>
      </p>
    </header>
  );
}

function QuestStepView({
  state,
  locale,
  dispatch,
}: {
  state: SkinQuestState;
  locale: string;
  dispatch: (action: Parameters<typeof skinQuestReducer>[1]) => void;
}) {
  const level = QUEST_LEVELS[state.levelIndex];
  const step = level?.steps[state.stepIndex];
  if (!step) return null;
  const prompt = translate(step.promptKey, locale);

  return (
    <>
      <CompanionSays>
        <p className="bubble__prompt" id="quest-prompt">
          {prompt}
        </p>
        <p className="bubble__help">{translate(step.helpKey, locale)}</p>
        <ReadAloud text={prompt} locale={locale} />
      </CompanionSays>

      <ul className="options" role="list">
        {step.options.map((option) => (
          <li key={option.id}>
            <button
              type="button"
              className="option"
              aria-pressed={state.answers[step.id] === option.id}
              onClick={() => dispatch({ type: 'answer', stepId: step.id, optionId: option.id })}
            >
              {translate(option.labelKey, locale)}
            </button>
          </li>
        ))}
      </ul>

      <div className="quest__foot">
        <button type="button" className="btn btn--quiet" onClick={() => dispatch({ type: 'back' })}>
          {translate('skinquest.back', locale)}
        </button>
      </div>
    </>
  );
}

function QuestConcernPicker({
  state,
  locale,
  dispatch,
}: {
  state: SkinQuestState;
  locale: string;
  dispatch: (action: Parameters<typeof skinQuestReducer>[1]) => void;
}) {
  const level = QUEST_LEVELS[state.levelIndex];
  if (!level) return null;
  const offered = concernsForLevel(level);
  const prompt = translate('skinquest.concerns.prompt', locale);

  return (
    <>
      <CompanionSays>
        <p className="bubble__prompt" id="quest-prompt">
          {prompt}
        </p>
        <p className="bubble__help">{translate('skinquest.concerns.help', locale)}</p>
        <ReadAloud text={prompt} locale={locale} />
      </CompanionSays>

      <ul className="options options--multi" role="list">
        {offered.map((concern) => (
          <li key={concern.Concern_ID}>
            <button
              type="button"
              className="option option--concern"
              aria-pressed={state.pickedConcernIds.includes(concern.Concern_ID)}
              onClick={() => dispatch({ type: 'toggleConcern', concernId: concern.Concern_ID })}
            >
              <span className="option__name">{concern.Concern_Name}</span>
              <span className="option__detail">{concern.Description}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="quest__foot">
        <button type="button" className="btn btn--quiet" onClick={() => dispatch({ type: 'back' })}>
          {translate('skinquest.back', locale)}
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => dispatch({ type: 'continue' })}
        >
          {translate('skinquest.continue', locale)}
        </button>
      </div>
    </>
  );
}

function QuestRecord({
  state,
  locale,
  collection,
  onExplore,
  dispatch,
}: {
  state: SkinQuestState;
  locale: string;
  collection: CollectionState;
  onExplore: () => void;
  dispatch: (action: Parameters<typeof skinQuestReducer>[1]) => void;
}) {
  const now = useMemo(() => new Date(), []);
  const gift = useMemo(() => issueGift(now), [now]);
  const streak = currentStreak(collection, now);
  // Which region the reader said they were looking at, for the map. Their own answer, not a
  // guess made from the others.
  const region = (state.answers['L1-S2'] ?? null) as SkinRegion | null;

  const answered = QUEST_LEVELS.flatMap((level) =>
    level.steps
      .map((step) => {
        const chosen = step.options.find((option) => option.id === state.answers[step.id]);
        return chosen ? { step, chosen } : null;
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null),
  );

  const picked = state.pickedConcernIds
    .map((id) => concerns.find((concern) => concern.Concern_ID === id))
    .filter((concern): concern is NonNullable<typeof concern> => concern !== undefined);

  const needsProfessional = picked.some((concern) =>
    ESCALATING_CONCERN_IDS.includes(concern.Concern_ID),
  );

  // The one approved sequence in the whole Master Database, shown exactly as the record has it.
  const approvedRoutine = routines.find((routine) => routine.Status === 'Approved');

  return (
    <section className="quest quest--record" aria-labelledby="record-headline">
      <p className="eyebrow">{translate('skinquest.record.eyebrow', locale)}</p>
      <StreakBadge days={streak} locale={locale} />
      <CompanionSays mood="pleased" size={84}>
        <p className="bubble__prompt" id="record-headline">
          {translate('skinquest.record.headline', locale)}
        </p>
        <p className="bubble__help">{translate('skinquest.record.lead', locale)}</p>
      </CompanionSays>

      <SkinMap active={region} title={translate('skinquest.record.picked', locale)} />

      {needsProfessional ? (
        <p className="boundary boundary--strong">{translate('skinquest.record.escalation', locale)}</p>
      ) : null}

      <section className="record-block">
        <h2 className="record-block__title">{translate('skinquest.record.answers', locale)}</h2>
        <dl className="record-list">
          {answered.map(({ step, chosen }) => (
            <div className="record-list__row" key={step.id}>
              <dt>{translate(step.promptKey, locale)}</dt>
              <dd>{translate(chosen.labelKey, locale)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="record-block">
        <h2 className="record-block__title">{translate('skinquest.record.picked', locale)}</h2>
        {picked.length === 0 ? (
          <p className="record-block__note">
            {translate('skinquest.record.nothingPicked', locale)}
          </p>
        ) : (
          <>
            <ul className="chips" role="list">
              {picked.map((concern) => (
                <li className="chip" key={concern.Concern_ID}>
                  {concern.Concern_Name}
                </li>
              ))}
            </ul>
            <h3 className="record-block__subtitle">
              {translate('skinquest.record.learnNext', locale)}
            </h3>
            <ul className="goals" role="list">
              {picked.map((concern) => (
                <li key={concern.Concern_ID}>{concern.Learning_Goal}</li>
              ))}
            </ul>
            <p className="record-block__note">
              {translate('skinquest.record.pendingReview', locale)}
            </p>
          </>
        )}
      </section>

      {approvedRoutine ? (
        <section className="record-block record-block--approved">
          <h2 className="record-block__title">{translate('skinquest.record.routine', locale)}</h2>
          <RoutineDiagram sequence={approvedRoutine.Default_Sequence} />
          <p className="record-block__note">{translate('skinquest.record.routineNote', locale)}</p>
        </section>
      ) : null}

      <CollectionShelf discoveredIds={collection.discoveredConcernIds} locale={locale} />

      <VisitCalendar visitDays={collection.visitDays} today={now} locale={locale} />

      {/* Last, and after the safety notice above: education outranks commerce (rule 6), and
          the order things appear in is where that is honoured or quietly reversed. */}
      <GiftCard gift={gift} locale={locale} />

      <div className="quest__foot">
        <button
          type="button"
          className="btn btn--quiet"
          onClick={() => dispatch({ type: 'restart' })}
        >
          {translate('skinquest.record.restart', locale)}
        </button>
        <button type="button" className="btn btn--primary" onClick={onExplore}>
          {translate('skinquest.record.explore', locale)}
        </button>
      </div>
    </section>
  );
}
