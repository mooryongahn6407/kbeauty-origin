/**
 * Reducer purity — the event outbox.
 *
 * Every interactive world in this app is driven by a reducer, and every one of them needs to
 * tell the outside world that something happened: an analytics event, a mastery attempt. The
 * obvious way to do that is to call the sink from inside the `switch`. It is also wrong.
 *
 * A reducer is not a place where effects may run. React invokes it speculatively — under
 * StrictMode it invokes it **twice** for every action in development, on purpose, precisely to
 * surface effects hiding in there — and it may replay or discard a call entirely. An effect in
 * a reducer therefore runs an unpredictable number of times. We saw exactly that: one answer
 * was recorded as two attempts in the browser, and the event counts were double everywhere.
 *
 * The fix is the outbox pattern. The reducer stays a pure function of `(state, action)`. What
 * it wants to tell the world it *returns*, in `emitted`, alongside a `transitionId` that
 * increments once per real transition. Exactly one place — the drain — turns that into a call
 * on a sink, and it drains a given `transitionId` at most once. Double-invoking a pure reducer
 * now produces two identical values and zero effects, which is what StrictMode is testing for.
 *
 * `emitted` is *replaced* on each transition, never accumulated: the state holds one
 * transition's outbox, not a log. The log lives in the sink.
 */
import type { EventSink } from '@/analytics/events';
import type { LearningEvent } from '@/domain/learning';

/** What a reducer state must carry to participate in the outbox. */
export interface EmittingState {
  /** Increments once per state transition. Never decreases, including across RESET. */
  readonly transitionId: number;
  /** Events this transition produced. Replaced every transition, never appended to. */
  readonly emitted: readonly LearningEvent[];
}

/** Handed to an inner reducer so it can declare an event without performing one. */
export type Emit = (event: LearningEvent) => void;

/** The outbox fields a freshly created state starts with. */
export const INITIAL_TRANSITION: EmittingState = { transitionId: 0, emitted: [] };

/**
 * Deliver one transition's outbox to a sink.
 *
 * The single boundary between pure state and the outside world. Callers that dispatch inside
 * React should not call this directly — `useTransitionDrain` guards it against the repeated
 * effect invocations StrictMode also performs.
 */
export function drainEvents(state: EmittingState, sink?: EventSink): void {
  if (!sink) return;
  for (const event of state.emitted) sink.record(event);
}

/**
 * A drain that performs each transition at most once.
 *
 * Moving the writes out of the reducer removes the double-*reducer* problem, but React also
 * double-invokes effects — it mounts, unmounts and remounts every effect in development, and
 * may re-run one on any render. So the drain remembers the last `transitionId` it performed
 * and refuses to repeat it. That guard is the part that can be got wrong, so it lives here as
 * a plain closure a test can drive directly, rather than inside a hook.
 *
 * Returns true when the transition was performed, false when it had already been drained.
 */
export function createDrainGuard() {
  // -1 rather than 0: a freshly created state is transition 0, and its (empty) outbox should
  // still go through the same path rather than being special-cased.
  let lastDrained = -1;

  return function drainOnce<S extends EmittingState>(
    state: S,
    sink?: EventSink,
    perform?: (state: S) => void,
  ): boolean {
    if (lastDrained === state.transitionId) return false;
    lastDrained = state.transitionId;
    drainEvents(state, sink);
    perform?.(state);
    return true;
  };
}
