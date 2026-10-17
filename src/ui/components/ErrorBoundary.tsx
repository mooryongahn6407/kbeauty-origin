/**
 * The last line before a blank white screen.
 *
 * If any screen throws while drawing, React unmounts the whole tree and the reader is left with
 * nothing. This boundary catches that and shows a calm, translated note with two ways out:
 * «Try again» reloads the page, «Go home» opens the app's start page. It runs outside `App`, so
 * it reads the language the same way the app does on start-up and never depends on app state.
 */
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { initialLocale } from '@/app/app-chrome';
import { inLocale } from '@/content/care-quest/types';
import { UI_CATALOG_LOCALES } from '@/localization/messages';
import { CHROME } from '../chrome-text';

const text = (key: 'errTitle' | 'errBody' | 'errRetry' | 'errHome', locale: string) =>
  inLocale(CHROME[key]!, locale);

/** The reader's language, worked out without the app: link, then saved choice, then device. */
export function fallbackLocale(): string {
  let storage: Storage | undefined;
  try {
    storage = typeof localStorage === 'undefined' ? undefined : localStorage;
  } catch {
    storage = undefined;
  }
  return initialLocale(
    typeof window === 'undefined' ? '' : window.location.search,
    storage,
    typeof navigator === 'undefined' ? [] : navigator.languages ?? [navigator.language],
    UI_CATALOG_LOCALES,
  );
}

const homeHref = (): string => {
  try {
    return import.meta.env.BASE_URL || '/';
  } catch {
    return '/';
  }
};

export function ErrorFallback({
  locale,
  onRetry,
  onHome,
}: {
  locale: string;
  onRetry: () => void;
  onHome: () => void;
}) {
  return (
    <main className="kg-crash" role="alert" lang={locale}>
      <div className="kg-crash__panel">
        <h1 className="kg-crash__title">{text('errTitle', locale)}</h1>
        <p className="kg-crash__body">{text('errBody', locale)}</p>
        <div className="kg-crash__actions">
          <button type="button" className="btn" onClick={onRetry}>
            {text('errRetry', locale)}
          </button>
          <button type="button" className="btn btn--quiet" onClick={onHome}>
            {text('errHome', locale)}
          </button>
        </div>
      </div>
    </main>
  );
}

interface State {
  readonly failed: boolean;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  override state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  override componentDidCatch(error: unknown, info: ErrorInfo): void {
    // Kept in the console for whoever is debugging; never shown to the reader.
    console.error('GLOW Class screen failed', error, info.componentStack);
  }

  override render() {
    if (!this.state.failed) return this.props.children;
    return (
      <ErrorFallback
        locale={fallbackLocale()}
        onRetry={() => window.location.reload()}
        onHome={() => window.location.assign(homeHref())}
      />
    );
  }
}
