/**
 * Ingredient Hunt — QST-009 and QST-008, playable at last.
 *
 * The screen shows an ingredient list the way a bottle does and asks the player to pick out one
 * family. Marking happens against the Family column of 06_INGREDIENTS, so the app teaches how a
 * real list is organised while asserting nothing about what anything does.
 *
 * Two findings from benchmarking the field shaped this:
 *
 * - **A wrong tap costs nothing.** Punishing errors runs against the evidence that retrieval
 *   plus feedback is where learning happens, and hearts-and-lives designs are the most
 *   complained-about mechanic in the apps that ship them. There is no score here, no timer and
 *   nothing to lose — only "you found 4 of 6, and here are the other two".
 * - **The source is the feature, not the apology.** The reveal opens each record so the reader
 *   can see the fields it was marked against, the review status included. Apps that show their
 *   working are the ones readers say they trust.
 */
import { useEffect, useMemo, useReducer, useState } from 'react';
import { translate } from '@/localization/messages';
import { ingredients } from '@/knowledge/repository';
import type { Ingredient } from '@/domain/entities';
import {
  buildRound,
  familyFunction,
  huntReducer,
  huntResult,
  huntableFamilies,
  initialHuntState,
  type HuntState,
} from '@/app/ingredient-hunt';
import {
  dueIds,
  loadQueue,
  saveQueue,
  trackedCount,
  withMissed,
  withRecognised,
  type ReviewQueue,
} from '@/app/review-queue';
import { CompanionSays } from '../components/Companion';
import { ReadAloud } from '../components/ReadAloud';

const LIST_SIZE = 9;

/** The shuffle lives here, not in the reducer: a reducer that shuffles is not pure (rule 16). */
const randomPick = (bound: number) => Math.floor(Math.random() * bound);

const nextFamily = (previous: string | null): string => {
  const families = huntableFamilies();
  if (families.length === 0) return 'Humectant';
  const at = previous ? families.indexOf(previous) : -1;
  return families[(at + 1) % families.length] ?? families[0]!;
};

/**
 * "보습 · Humectant" where the records agree on a function, "Humectant" where they do not.
 * Both halves are the records' own fields; nothing is translated here.
 */
const familyLabel = (family: string): string => {
  const fn = familyFunction(family);
  return fn ? `${fn} · ${family}` : family;
};

const storage = () => (typeof localStorage === 'undefined' ? undefined : localStorage);

export function IngredientHuntScreen({ locale }: { locale: string }) {
  const knownIds = useMemo(
    () => new Set(ingredients.map((ingredient) => ingredient.Ingredient_ID)),
    [],
  );
  const [queue, setQueue] = useState<ReviewQueue>(() => loadQueue(storage(), knownIds));
  const today = useMemo(() => new Date(), []);
  const due = useMemo(() => dueIds(queue, today), [queue, today]);

  const [state, dispatch] = useReducer(huntReducer, initialHuntState, (initial): HuntState => ({
    ...initial,
    round: buildRound(nextFamily(null), LIST_SIZE, randomPick, dueIds(loadQueue(storage(), knownIds), new Date())),
  }));

  // Reschedule the moment a round is marked: what was recognised moves further out, what was
  // missed comes back tomorrow. Nothing here is written to the mastery ledger.
  useEffect(() => {
    if (!state.revealed || !state.round) return;
    const result = huntResult(state);
    setQueue((previous) => {
      let next = previous;
      for (const id of result.correct) next = withRecognised(next, id, new Date());
      for (const id of result.missed) next = withMissed(next, id, new Date());
      saveQueue(storage(), next);
      return next;
    });
  }, [state.revealed, state.round]);

  const round = state.round;
  if (!round) return null;
  const prompt = translate('hunt.prompt', locale, { family: familyLabel(round.family) });

  return (
    <section className="hunt" aria-labelledby="hunt-prompt">
      <CompanionSays>
        <p className="bubble__prompt" id="hunt-prompt">
          {prompt}
        </p>
        <p className="bubble__help">{translate('hunt.help', locale)}</p>
        <ReadAloud text={prompt} locale={locale} />
      </CompanionSays>

      <ul className="inci" role="list">
        {round.shown.map((ingredient) => (
          <li key={ingredient.Ingredient_ID}>
            <IngredientChip
              ingredient={ingredient}
              picked={state.picked.includes(ingredient.Ingredient_ID)}
              revealed={state.revealed}
              isTarget={round.targetIds.includes(ingredient.Ingredient_ID)}
              onToggle={() =>
                dispatch({ type: 'toggle', ingredientId: ingredient.Ingredient_ID })
              }
            />
          </li>
        ))}
      </ul>

      {state.revealed ? (
        <HuntReveal state={state} locale={locale} />
      ) : (
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => dispatch({ type: 'check' })}
        >
          {translate('hunt.check', locale)}
        </button>
      )}

      {state.revealed ? (
        <button
          type="button"
          className="btn btn--primary"
          onClick={() =>
            dispatch({
              type: 'next',
              round: buildRound(nextFamily(round.family), LIST_SIZE, randomPick, due),
            })
          }
        >
          {translate('hunt.next', locale)}
        </button>
      ) : null}

      <p className="hunt__progress">
        {translate('hunt.learned', locale, {
          learned: String(state.learnedIds.length),
          total: String(ingredients.length),
        })}
      </p>
      {trackedCount(queue) > 0 ? (
        <p className="hunt__due">
          {due.length > 0
            ? translate('review.dueToday', locale, { count: String(due.length) })
            : translate('review.allCaughtUp', locale, { tracked: String(trackedCount(queue)) })}
        </p>
      ) : null}
      <p className="record-block__note">{translate('hunt.sourceNote', locale)}</p>
    </section>
  );
}

function IngredientChip({
  ingredient,
  picked,
  revealed,
  isTarget,
  onToggle,
}: {
  ingredient: Ingredient;
  picked: boolean;
  revealed: boolean;
  isTarget: boolean;
  onToggle: () => void;
}) {
  const mark = revealed
    ? isTarget
      ? picked
        ? ' is-correct'
        : ' is-missed'
      : picked
        ? ' is-wrong'
        : ''
    : picked
      ? ' is-picked'
      : '';

  return (
    <button
      type="button"
      className={`inci__item${mark}`}
      aria-pressed={picked}
      disabled={revealed}
      onClick={onToggle}
    >
      <span className="inci__name">{ingredient.Ingredient_Name}</span>
      {revealed ? <span className="inci__family">{ingredient.Family}</span> : null}
    </button>
  );
}

function HuntReveal({ state, locale }: { state: HuntState; locale: string }) {
  const round = state.round;
  const result = huntResult(state);
  if (!round) return null;

  const byId = (id: string) => ingredients.find((item) => item.Ingredient_ID === id);
  const missed = result.missed.map(byId).filter((item): item is Ingredient => item !== undefined);
  const wrong = result.wrong.map(byId).filter((item): item is Ingredient => item !== undefined);

  return (
    <div className="hunt__reveal">
      <p className="hunt__score">
        {translate('hunt.found', locale, {
          correct: String(result.correct.length),
          total: String(round.targetIds.length),
        })}
      </p>

      {missed.length > 0 ? (
        <>
          <p className="hunt__label">{translate('hunt.alsoWere', locale)}</p>
          {missed.map((ingredient) => (
            <IngredientRecord key={ingredient.Ingredient_ID} ingredient={ingredient} locale={locale} />
          ))}
        </>
      ) : null}

      {wrong.length > 0 ? (
        <>
          <p className="hunt__label">{translate('hunt.notThese', locale)}</p>
          {wrong.map((ingredient) => (
            <IngredientRecord key={ingredient.Ingredient_ID} ingredient={ingredient} locale={locale} />
          ))}
        </>
      ) : null}
    </div>
  );
}

/**
 * One ingredient, as the database holds it.
 *
 * Every line is a field of the record, labelled and shown verbatim — including the review
 * status, which is the point rather than an embarrassment. Nothing is summarised into a score
 * and nothing is added.
 */
export function IngredientRecord({
  ingredient,
  locale,
}: {
  ingredient: Ingredient;
  locale: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="inci-record">
      <div className="inci-record__head">
        <span className="inci-record__name">{ingredient.Ingredient_Name}</span>
        <span className="chip">{ingredient.Family}</span>
        {ingredient.Primary_Function ? (
          <span className="chip chip--soft">{ingredient.Primary_Function}</span>
        ) : null}
      </div>
      <button
        type="button"
        className="btn btn--small btn--quiet"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {translate(open ? 'hunt.hideSource' : 'hunt.showSource', locale)}
      </button>
      {open ? (
        <dl className="inci-record__fields">
          <div>
            <dt>{translate('hunt.field.goal', locale)}</dt>
            <dd>{ingredient.Learning_Goal}</dd>
          </div>
          <div>
            <dt>{translate('hunt.field.level', locale)}</dt>
            <dd>{ingredient.Level}</dd>
          </div>
          <div>
            <dt>{translate('hunt.field.status', locale)}</dt>
            <dd>
              {ingredient.Status} · {ingredient.Evidence_Status}
            </dd>
          </div>
          <div>
            <dt>{translate('hunt.field.reference', locale)}</dt>
            <dd>
              {ingredient.Reference_URL ? (
                <a href={ingredient.Reference_URL} target="_blank" rel="noreferrer">
                  {ingredient.Reference_URL}
                </a>
              ) : (
                translate('hunt.noReference', locale)
              )}
            </dd>
          </div>
          <div>
            <dt>ID</dt>
            <dd>{ingredient.Ingredient_ID}</dd>
          </div>
        </dl>
      ) : null}
    </div>
  );
}
