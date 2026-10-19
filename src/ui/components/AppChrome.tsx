/**
 * KG-APP-BASE v1.0 chrome: the bottom bar (◀ Back · ⏮ Start · ▶ Next/Skip), the settings sheet,
 * the one-time button guide, the help desk (guide card → kind → one line → WhatsApp Business,
 * three a day) and the "new version" line. Line icons, never emoji.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { inLocale } from '@/content/care-quest/types';
import {
  APP_VERSION,
  deviceLabel,
  helpDeskHref,
  helpDeskLeft,
  recordHelpDeskSend,
  type HelpKind,
} from '@/app/app-chrome';
import { browserStores, clearDeviceData } from '@/app/device-data';
import { CHROME } from '../chrome-text';
import { applyUpdate, checkForUpdate, onUpdateReady } from '../updates';

const t = (key: keyof typeof CHROME, locale: string) => inLocale(CHROME[key]!, locale);
const storage = (): Storage | undefined => {
  try {
    return typeof localStorage === 'undefined' ? undefined : localStorage;
  } catch {
    return undefined;
  }
};

type IconName =
  | 'prev'
  | 'next'
  | 'first'
  | 'home'
  | 'gear'
  | 'close'
  | 'chat'
  | 'refresh'
  | 'check'
  | 'speaker'
  | 'speakerOn'
  | 'bottle'
  | 'external';
const PATHS: Record<IconName, string> = {
  prev: 'M15 5l-7 7 7 7',
  next: 'M9 5l7 7-7 7',
  first: 'M6 5v14M18 5l-8 7 8 7',
  home: 'M4 11l8-7 8 7M6 10v9h12v-9',
  gear: 'M12 9a3 3 0 100 6 3 3 0 000-6zM12 3v2M12 19v2M4.2 7l1.7 1M18.1 16l1.7 1M4.2 17l1.7-1M18.1 8l1.7-1M3 12h2M19 12h2',
  close: 'M6 6l12 12M18 6L6 18',
  chat: 'M5 5h14v10H9l-4 4z',
  refresh: 'M20 12a8 8 0 11-2.3-5.7M20 4v5h-5',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  speaker: 'M4 9.5v5h4l5 4v-13l-5 4H4z',
  speakerOn: 'M4 9.5v5h4l5 4v-13l-5 4H4zM16.5 9a4.5 4.5 0 010 6M19 6.5a8 8 0 010 11',
  bottle: 'M10 3h4v3l2 3v12H8V9l2-3V3z',
  external: 'M14 4h6v6M20 4l-9 9M18 14v6H4V6h6',
};

export function Icon({ name }: { name: IconName }) {
  return (
    <svg className="kg-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={PATHS[name]} />
    </svg>
  );
}

export interface BottomBarProps {
  locale: string;
  /** "3 / 10" — shown only where there is a sequence. */
  position: { index: number; total: number } | null;
  canGoBack: boolean;
  nextLabel: 'next' | 'skip' | 'restart' | null;
  onPrev: () => void;
  onNext: () => void;
  /** The first screen of the branch the reader is in (KG-APP-CARE §2-5) — not the app's home. */
  onBranch: () => void;
  onHome: () => void;
}

/**
 * KG-APP-CARE §2-5: ← Back · Section start · Home · Next → — four buttons, always in the same
 * places, on every screen. A button with nothing to do stays in its place, disabled, so the
 * others never move under the reader's thumb.
 */
export function BottomBar({ locale, position, canGoBack, nextLabel, onPrev, onNext, onBranch, onHome }: BottomBarProps) {
  const bar = useRef<HTMLElement | null>(null);
  // The bar's real height, as --kg-bar-h, so the share/like band (theme.css) sits right on top of
  // it whether or not the "3 / 10" line is showing.
  useEffect(() => {
    const element = bar.current;
    if (!element || typeof ResizeObserver === 'undefined') return undefined;
    const root = document.documentElement;
    const update = () => root.style.setProperty('--kg-bar-h', `${Math.ceil(element.offsetHeight)}px`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => {
      observer.disconnect();
      root.style.removeProperty('--kg-bar-h');
    };
  }, []);
  return (
    <nav className="kg-bottombar" aria-label={t('first', locale)} ref={bar}>
      {position ? (
        <span className="kg-bottombar__pos" aria-live="polite">
          {`${position.index} / ${position.total}`}
        </span>
      ) : null}
      <div className="kg-bottombar__inner">
        <button type="button" className="kg-navbtn" onClick={onPrev} disabled={!canGoBack} data-guide="prev">
          <Icon name="prev" />
          <span>{t('prev', locale)}</span>
        </button>
        <button type="button" className="kg-navbtn kg-navbtn--quiet" onClick={onBranch} data-guide="first">
          <Icon name="first" />
          <span>{t('branchStart', locale)}</span>
        </button>
        <button type="button" className="kg-navbtn kg-navbtn--quiet" onClick={onHome} data-guide="home-bar">
          <Icon name="home" />
          <span>{t('home', locale)}</span>
        </button>
        <button
          type="button"
          className="kg-navbtn kg-navbtn--primary"
          onClick={onNext}
          disabled={!nextLabel}
          data-guide="next"
        >
          <Icon name={nextLabel === 'restart' ? 'refresh' : 'next'} />
          <span>{t(nextLabel ?? 'next', locale)}</span>
        </button>
      </div>
    </nav>
  );
}

export interface BranchLink {
  readonly id: string;
  readonly label: string;
  readonly current: boolean;
  readonly onOpen: () => void;
}

/** KG-APP-CARE §2-5: the sibling branches, one tap each, without going back to the start. */
export function BranchLinks({ locale, links }: { locale: string; links: readonly BranchLink[] }) {
  return (
    <nav className="kg-branches" aria-label={t('branchesTitle', locale)}>
      <p className="kg-branches__title">{t('branchesTitle', locale)}</p>
      <ul className="kg-branches__list" role="list">
        {links.map((link) => (
          <li key={link.id}>
            <button
              type="button"
              className={`kg-branch kg-branch--${link.id}`}
              aria-current={link.current ? 'page' : undefined}
              onClick={link.onOpen}
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Sheet({
  title,
  locale,
  onClose,
  children,
}: {
  title: string;
  locale: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="kg-sheet" role="dialog" aria-modal="true" aria-label={title}>
      <div className="kg-sheet__panel">
        <div className="kg-sheet__head">
          <h2 className="kg-sheet__title">{title}</h2>
          <button type="button" className="kg-iconbtn" onClick={onClose} aria-label={t('close', locale)}>
            <Icon name="close" />
          </button>
        </div>
        <div className="kg-sheet__body">{children}</div>
      </div>
    </div>
  );
}

export function UpdateLine({ locale }: { locale: string }) {
  const [ready, setReady] = useState(false);
  useEffect(() => onUpdateReady(setReady), []);
  if (!ready) return null;
  return (
    <div className="kg-update" role="status">
      <span>{t('updateReady', locale)}</span>
      <button type="button" className="kg-update__btn" onClick={applyUpdate}>
        {t('updateApply', locale)}
      </button>
    </div>
  );
}

export function UpdateCheck({ locale }: { locale: string }) {
  const [state, setState] = useState<'idle' | 'checking' | 'latest' | 'ready'>('idle');
  return (
    <div className="kg-setting__row">
      <button
        type="button"
        className="kg-setting__btn"
        onClick={async () => {
          setState('checking');
          setState((await checkForUpdate()) ? 'ready' : 'latest');
        }}
      >
        <Icon name="refresh" />
        {t('sUpdate', locale)}
      </button>
      {state === 'latest' ? <p className="kg-setting__note">{t('sUpToDate', locale)}</p> : null}
      {state === 'ready' ? (
        <button type="button" className="kg-update__btn" onClick={applyUpdate}>
          {t('updateApply', locale)}
        </button>
      ) : null}
    </div>
  );
}

/**
 * "Delete my data on this phone" — a button, then a confirm step, then every key this app owns
 * is removed and the page reloads into the first-visit state. See `src/app/device-data.ts`.
 */
export function DeleteMyData({ locale }: { locale: string }) {
  const [asking, setAsking] = useState(false);
  return (
    <div className="kg-setting__row">
      <p className="kg-setting__note">{t('sDataNote', locale)}</p>
      {asking ? (
        <div className="kg-setting__confirm" role="alertdialog" aria-label={t('sDelete', locale)}>
          <p className="kg-setting__note">{t('sDeleteConfirm', locale)}</p>
          <button
            type="button"
            className="kg-setting__btn kg-setting__btn--danger"
            onClick={() => {
              const { local, session } = browserStores();
              clearDeviceData(local, session);
              window.location.reload();
            }}
          >
            {t('sDeleteYes', locale)}
          </button>
          <button type="button" className="kg-setting__btn" onClick={() => setAsking(false)}>
            {t('sDeleteNo', locale)}
          </button>
        </div>
      ) : (
        <button type="button" className="kg-setting__btn kg-setting__btn--danger" onClick={() => setAsking(true)}>
          {t('sDelete', locale)}
        </button>
      )}
    </div>
  );
}

const GUIDE = [
  ['g1t', 'g1b'],
  ['g2t', 'g2b'],
  ['g3t', 'g3b'],
] as const;

export function ButtonGuide({ locale, onDone }: { locale: string; onDone: () => void }) {
  const [card, setCard] = useState(0);
  const last = card === GUIDE.length - 1;
  const [title, body] = GUIDE[card]!;
  return (
    <div className="kg-guide" role="dialog" aria-modal="true" aria-label={t(title, locale)}>
      <div className={`kg-guide__arrow kg-guide__arrow--${card === 1 ? 'top' : 'bottom'}`} aria-hidden="true" />
      <div className="kg-guide__card">
        <p className="kg-guide__count">
          {card + 1} / {GUIDE.length}
        </p>
        <h2 className="kg-guide__title">{t(title, locale)}</h2>
        <p className="kg-guide__body">{t(body, locale)}</p>
        <div className="kg-guide__actions">
          <button type="button" className="btn btn--quiet" onClick={onDone}>
            {t('skip', locale)}
          </button>
          <button type="button" className="btn" onClick={() => (last ? onDone() : setCard(card + 1))}>
            {last ? t('gDone', locale) : t('next', locale)}
          </button>
        </div>
      </div>
    </div>
  );
}

export function HelpDesk({ locale, screen }: { locale: string; screen: string }) {
  const [kind, setKind] = useState<HelpKind | null>(null);
  const [note, setNote] = useState('');
  const [left, setLeft] = useState(() => helpDeskLeft(storage(), new Date()));
  if (left <= 0) return <p className="kg-help__intro">{t('hLimit', locale)}</p>;
  const href = kind
    ? helpDeskHref(
        {
          app: 'GLOW Class',
          screen,
          version: APP_VERSION,
          locale,
          device: deviceLabel(navigator.userAgent, window.innerWidth),
        },
        kind,
        note,
      )
    : null;
  return (
    <div className="kg-help">
      <p className="kg-help__intro">{t('hIntro', locale)}</p>
      <p className="kg-help__label">{t('hKind', locale)}</p>
      <div className="kg-help__kinds" role="radiogroup" aria-label={t('hKind', locale)}>
        {(['error', 'wrong', 'idea'] as const).map((value) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={kind === value}
            className="kg-help__kind"
            onClick={() => setKind(value)}
          >
            {t(value === 'error' ? 'hError' : value === 'wrong' ? 'hWrong' : 'hIdea', locale)}
          </button>
        ))}
      </div>
      {kind ? (
        <>
          <label className="kg-help__label" htmlFor="kg-help-note">
            {t('hNote', locale)}
          </label>
          <input
            id="kg-help-note"
            className="kg-help__input"
            value={note}
            maxLength={300}
            onChange={(event) => setNote(event.target.value)}
          />
          <a
            className={`btn kg-help__send${href ? '' : ' is-disabled'}`}
            href={href ?? undefined}
            aria-disabled={!href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => {
              if (!href) {
                event.preventDefault();
                return;
              }
              recordHelpDeskSend(storage(), new Date());
              setLeft(helpDeskLeft(storage(), new Date()));
            }}
          >
            <Icon name="chat" />
            {t('hSend', locale)}
          </a>
        </>
      ) : null}
    </div>
  );
}

export const chromeText = t;
