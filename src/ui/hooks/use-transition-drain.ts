/**
 * Drain a reducer's event outbox, exactly once per transition.
 *
 * The reducers in `src/app/` are pure (see `src/app/transition.ts`): they return the events a
 * transition produced instead of performing them. This hook is the one place in the UI that
 * turns those back into calls on the analytics sink.
 *
 * The guard itself is `createDrainGuard` in `src/app/transition.ts` — a plain closure keyed on
 * `transitionId`, so it can be tested without a DOM. All this hook adds is holding one instance
 * in a ref, which is what makes it survive the unmount/remount StrictMode performs.
 *
 * The effect deliberately has no dependency array. It runs after every render and the guard
 * makes all but the first run for a given transition free, which is cheaper to reason about
 * than a dependency list that has to stay correct as the state shape grows.
 */
import { useEffect, useRef } from 'react';
import type { EventSink } from '@/analytics/events';
import { createDrainGuard, type EmittingState } from '@/app/transition';

export function useTransitionDrain<S extends EmittingState>(
  state: S,
  sink: EventSink,
  /** Extra effects this transition declared — e.g. folding an attempt into the mastery ledger. */
  perform?: (state: S) => void,
): void {
  // Created once and kept in a ref, so it survives the unmount/remount StrictMode performs.
  const drainOnce = useRef<ReturnType<typeof createDrainGuard>>();
  drainOnce.current ??= createDrainGuard();

  useEffect(() => {
    drainOnce.current?.(state, sink, perform);
  });
}
