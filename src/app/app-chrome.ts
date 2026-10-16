/**
 * KG-APP-BASE v1.0 (CEO, 2026-10-16) — the pieces every KOREA GLOW customer app shares: the
 * help desk that is hard to send by accident, the one-time button guide, and the build version.
 * Pure functions over an injected Storage, so they test without a browser.
 */

/** WhatsApp Business — the only number any app may use; personal numbers never appear in an app. */
export const HELP_DESK_NUMBER = '8562096363944';
export const HELP_DESK_DAILY_LIMIT = 3;
const HELP_KEY = 'korea-glow:help-desk:v1';
const GUIDE_KEY = 'korea-glow:button-guide:v1';

declare const __APP_VERSION__: string | undefined;
/** Shown at the bottom of Settings and put in front of every help-desk message. */
export const APP_VERSION: string =
  typeof __APP_VERSION__ === 'string' && __APP_VERSION__ ? __APP_VERSION__ : 'dev';

export type HelpKind = 'error' | 'wrong' | 'idea';

const day = (now: Date) =>
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

function readSent(storage: Storage | undefined, now: Date): number {
  try {
    const raw = JSON.parse(storage?.getItem(HELP_KEY) ?? 'null') as { day?: string; n?: number } | null;
    return raw && raw.day === day(now) && typeof raw.n === 'number' ? raw.n : 0;
  } catch {
    return 0;
  }
}

/** How many more help-desk messages this device may send today (never below zero). */
export const helpDeskLeft = (storage: Storage | undefined, now: Date): number =>
  Math.max(0, HELP_DESK_DAILY_LIMIT - readSent(storage, now));

export function recordHelpDeskSend(storage: Storage | undefined, now: Date): void {
  try {
    storage?.setItem(HELP_KEY, JSON.stringify({ day: day(now), n: readSent(storage, now) + 1 }));
  } catch {
    // Private windows: the limit lasts for this visit only.
  }
}

export interface HelpContext {
  readonly app: string;
  readonly screen: string;
  readonly version: string;
  readonly locale: string;
  readonly device: string;
}

/**
 * The WhatsApp link, or null when there is nothing to send — the one-line note is required.
 * The context header goes first so the team can fix it without asking back.
 */
export function helpDeskHref(context: HelpContext, kind: HelpKind, note: string): string | null {
  const text = note.trim();
  if (!text) return null;
  const head = `[${context.app} · ${context.screen} · ${context.version} · ${context.locale} · ${context.device}]`;
  return `https://wa.me/${HELP_DESK_NUMBER}?text=${encodeURIComponent(`${head} (${kind}) ${text}`)}`;
}

/** A short, non-identifying description of the device: platform family and screen width. */
export function deviceLabel(userAgent: string, width: number): string {
  const family = /iphone|ipad/i.test(userAgent)
    ? 'iOS'
    : /android/i.test(userAgent)
      ? 'Android'
      : /windows/i.test(userAgent)
        ? 'Windows'
        : /mac/i.test(userAgent)
          ? 'Mac'
          : 'other';
  return `${family} ${Math.round(width)}px`;
}

export function buttonGuideSeen(storage: Storage | undefined): boolean {
  try {
    return storage?.getItem(GUIDE_KEY) === '1';
  } catch {
    return true; // Storage blocked: do not nag on every visit.
  }
}

export function markButtonGuideSeen(storage: Storage | undefined): void {
  try {
    storage?.setItem(GUIDE_KEY, '1');
  } catch {
    // Nothing to remember it in; it will show again next visit.
  }
}

/** What the quest tells the bottom bar about where the reader is. */
export interface QuestNav {
  readonly position: { readonly index: number; readonly total: number } | null;
  /** False on the greeting: there the app itself decides what «Back» means. */
  readonly canGoBack: boolean;
  readonly nextLabel: 'next' | 'skip' | 'restart' | null;
  readonly back: () => void;
  readonly next: () => void;
}

const LOCALE_KEY = 'korea-glow:locale:v1';

/**
 * The language to open in: a link's `?lang=` first (so SKIN QUEST and partner links keep the
 * reader's language), then the one this phone chose last time, then the phone's own language,
 * else English. Only languages the app offers.
 */
export function initialLocale(
  search: string,
  storage: Storage | undefined,
  deviceLanguages: readonly string[],
  offered: readonly string[],
): string {
  const ok = (tag: string | null | undefined) => {
    const base = (tag ?? '').toLowerCase().split('-')[0] ?? '';
    return offered.includes(base) ? base : null;
  };
  let fromLink: string | null = null;
  try {
    fromLink = ok(new URLSearchParams(search).get('lang'));
  } catch {
    fromLink = null;
  }
  let saved: string | null = null;
  try {
    saved = ok(storage?.getItem(LOCALE_KEY));
  } catch {
    saved = null;
  }
  return fromLink ?? saved ?? deviceLanguages.map(ok).find((tag) => tag) ?? 'en';
}

export function saveLocale(storage: Storage | undefined, locale: string): void {
  try {
    storage?.setItem(LOCALE_KEY, locale);
  } catch {
    // Private windows: the choice lasts for this visit only.
  }
}
