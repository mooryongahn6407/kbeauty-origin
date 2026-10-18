/**
 * An invisible marker at the end of a result or a lesson. When the reader has scrolled down to
 * it — she has read to the end, a «first success» — the shared Share part may ask her, once,
 * politely, whether she would share the app (see `src/app/share-ask.ts`). Never on arrival, and
 * never over one of the app's own dialogs.
 */
import { useEffect, useRef } from 'react';
import { askToShare } from '@/app/share-ask';

/** How long the end must stay on screen before asking — a glance past it does not count. */
export const SHARE_ASK_DWELL_MS = 1500;

export function ShareAskAtEnd() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let done = false;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.some((entry) => entry.isIntersecting);
      if (timer) clearTimeout(timer);
      timer = undefined;
      if (visible && !done) {
        timer = setTimeout(() => {
          done = true;
          observer.disconnect();
          askToShare();
        }, SHARE_ASK_DWELL_MS);
      }
    });
    observer.observe(node);
    return () => {
      if (timer) clearTimeout(timer);
      observer.disconnect();
    };
  }, []);
  return <span ref={ref} className="kg-share-ask" aria-hidden="true" />;
}
