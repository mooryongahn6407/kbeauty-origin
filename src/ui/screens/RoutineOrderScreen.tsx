/**
 * Routine Order — QST-006 and QST-007, playable.
 *
 * The one place in the app where the answer is an approved record rather than a topic under
 * review, which is why this screen is allowed to say "this is the order" and show the routine's
 * name and ID underneath. It still explains no step: approval covers the sequence, not a
 * rationale for it, and inventing the rationale is exactly the line the corpus does not let the
 * app cross.
 *
 * Marking is per row rather than as a score, and a wrong order costs nothing — the steps go
 * back and can be placed again.
 */
import { useReducer } from 'react';
import { translate } from '@/localization/messages';
import { routines } from '@/knowledge/repository';
import {
  buildOrderRound,
  initialOrderState,
  isSolved,
  orderableRoutines,
  placedMarks,
  routineOrderReducer,
  type OrderState,
} from '@/app/routine-order';
import { CompanionSays } from '../components/Companion';
import { ReadAloud } from '../components/ReadAloud';
import { spokenFallback } from '../spoken-fallback';

const randomPick = (bound: number) => Math.floor(Math.random() * bound);

const nextRoutine = (previousId: string | null) => {
  const all = orderableRoutines();
  if (all.length === 0) return null;
  const at = previousId ? all.findIndex((routine) => routine.Routine_ID === previousId) : -1;
  return all[(at + 1) % all.length] ?? all[0] ?? null;
};

export function RoutineOrderScreen({ locale }: { locale: string }) {
  const [state, dispatch] = useReducer(routineOrderReducer, initialOrderState, (initial): OrderState => {
    const routine = nextRoutine(null);
    return routine
      ? { ...initial, round: buildOrderRound(routine, randomPick) }
      : initial;
  });

  const round = state.round;
  if (!round) return null;

  const routine = routines.find((item) => item.Routine_ID === round.routineId);
  const remaining = round.shuffled.filter((step) => !state.placed.includes(step));
  const marks = placedMarks(state);
  const solved = isSolved(state);
  const prompt = translate('order.prompt', locale, {
    name: routine?.Routine_Name ?? '',
    description: routine?.Description ?? '',
  });

  return (
    <section className="order" aria-labelledby="order-prompt">
      <CompanionSays>
        <p className="bubble__prompt" id="order-prompt">
          {prompt}
        </p>
        <p className="bubble__help">{translate('order.help', locale)}</p>
        <ReadAloud
          text={prompt}
          locale={locale}
          fallback={spokenFallback(locale, (spoken) =>
            translate('order.prompt', spoken, {
              name: routine?.Routine_Name ?? '',
              description: routine?.Description ?? '',
            }),
          )}
          autoplay
        />
      </CompanionSays>

      {/* Where the steps go. Numbered, so the order being asked for is visible before the first
          tap rather than implied by position alone. */}
      <ol className="order__slots" role="list">
        {round.answer.map((_, index) => {
          const step = state.placed[index];
          const mark = state.revealed && step ? (marks[index] ? ' is-right' : ' is-wrong') : '';
          return (
            <li className={`order__slot${step ? ' is-filled' : ''}${mark}`} key={index}>
              <span className="order__number">{index + 1}</span>
              {step ? (
                <button
                  type="button"
                  className="order__placed"
                  disabled={state.revealed}
                  onClick={() => dispatch({ type: 'unplace', step })}
                >
                  {step}
                </button>
              ) : (
                <span className="order__empty">—</span>
              )}
            </li>
          );
        })}
      </ol>

      {remaining.length > 0 ? (
        <ul className="order__bank" role="list">
          {remaining.map((step) => (
            <li key={step}>
              <button
                type="button"
                className="order__step"
                disabled={state.revealed}
                onClick={() => dispatch({ type: 'place', step })}
              >
                {step}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {state.revealed ? (
        <div className="order__reveal">
          <p className="hunt__score">
            {translate(solved ? 'order.right' : 'order.notYet', locale)}
          </p>
          {!solved ? (
            <ol className="order__answer" role="list">
              {round.answer.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          ) : null}
          {routine ? (
            <p className="record-block__note">
              {translate('order.source', locale, {
                id: routine.Routine_ID,
                name: routine.Routine_Name,
                status: routine.Status,
              })}
            </p>
          ) : null}
        </div>
      ) : (
        <button
          type="button"
          className="btn btn--primary"
          disabled={state.placed.length !== round.answer.length}
          onClick={() => dispatch({ type: 'check' })}
        >
          {translate('order.check', locale)}
        </button>
      )}

      {state.revealed ? (
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => {
            const next = nextRoutine(round.routineId);
            if (next) dispatch({ type: 'next', round: buildOrderRound(next, randomPick) });
          }}
        >
          {translate('order.next', locale)}
        </button>
      ) : null}

      <p className="hunt__progress">
        {translate('order.solved', locale, {
          solved: String(state.solvedIds.length),
          total: String(orderableRoutines().length),
        })}
      </p>
      <p className="record-block__note">{translate('order.note', locale)}</p>
    </section>
  );
}
