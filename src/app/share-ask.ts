/**
 * When the app may ask a reader to like or share it — «not too much, not too little» (owner,
 * 2026-10-18) — and the bridge to the shared KOREA GLOW «Share + Like» part
 * (`public/kg_share_like.js`, owned by 11_IST), which draws the floating heart and WhatsApp
 * buttons itself.
 *
 * One budget for every kind of asking:
 * - at most ONE prompt per visit (a page load), whether the soft one-line note or the part's
 *   share sheet;
 * - and none within three days of the last one. That window is the part's own
 *   (`kgshare:<app>:asked`), so the note and the sheet count against the same clock and the
 *   part's automatic three-minute ask cannot stack on top of the note.
 *
 * Where: the note at step changes (skin game → result, result → GLOW Class, a lesson finished);
 * the part's sheet when the reader has stayed at the end of a result or a lesson. Whichever comes
 * first in a visit uses the budget. Never over one of the app's own dialogs; never required — if
 * the part did not load, nothing here throws or shows an error.
 */
interface KGShareApi {
  ask?: (force?: boolean) => boolean;
  relabel?: () => void;
}

type ShareWindow = {
  KGShare?: KGShareApi;
  document?: Pick<Document, 'querySelector'>;
  localStorage?: Pick<Storage, 'getItem' | 'setItem'>;
};

/** The part's own key for «last asked», as `kgshare:` + its configured app name. */
export const PART_ASKED_KEY = 'kgshare:GLOW Class:asked';
export const ASK_GAP_MS = 3 * 24 * 60 * 60 * 1000;
export const NUDGE_EVENT = 'kg:share-nudge';

let promptedThisVisit = false;

const shareWindow = (): ShareWindow | null =>
  typeof window === 'undefined' ? null : (window as unknown as ShareWindow);

function lastAsked(win: ShareWindow | null): number {
  try {
    const n = Number(win?.localStorage?.getItem(PART_ASKED_KEY) ?? 0);
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

/** True while this visit has not prompted yet and the last prompt is three days old or more. */
export function promptAllowed(win: ShareWindow | null = shareWindow(), now = Date.now()): boolean {
  return !promptedThisVisit && now - lastAsked(win) >= ASK_GAP_MS;
}

function dialogOpen(win: ShareWindow | null): boolean {
  try {
    return Boolean(win?.document?.querySelector('[role="dialog"][aria-modal="true"], .kg-guide'));
  } catch {
    return false;
  }
}

function markPrompted(win: ShareWindow | null, now: number): void {
  promptedThisVisit = true;
  try {
    win?.localStorage?.setItem(PART_ASKED_KEY, String(now));
  } catch {
    // Storage blocked: the once-per-visit rule still holds.
  }
}

/** The part's share sheet. True when it was shown. */
export function askToShare(win: ShareWindow | null = shareWindow(), now = Date.now()): boolean {
  try {
    const api = win?.KGShare;
    if (typeof api?.ask !== 'function') return false;
    if (!promptAllowed(win, now) || dialogOpen(win)) return false;
    const asked = api.ask(false) === true;
    if (asked) promptedThisVisit = true;
    return asked;
  } catch {
    return false;
  }
}

/**
 * The soft one-line note. True when it may be shown now — the caller (the `ShareNudge` bar,
 * through `NUDGE_EVENT`) then shows it; the budget is spent here.
 */
export function claimNudge(win: ShareWindow | null = shareWindow(), now = Date.now()): boolean {
  if (!promptAllowed(win, now) || dialogOpen(win)) return false;
  markPrompted(win, now);
  return true;
}

/** Called at a step change. Fire-and-forget: the bar listening for it decides nothing more. */
export function requestShareNudge(win: (ShareWindow & Partial<Pick<Window, 'dispatchEvent'>>) | null = shareWindow()): void {
  try {
    if (!claimNudge(win)) return;
    win?.dispatchEvent?.(new Event(NUDGE_EVENT));
  } catch {
    // Optional by design.
  }
}

/** Redraws the part's button labels after the reader changes language. */
export function relabelShare(win: ShareWindow | null = shareWindow()): void {
  try {
    win?.KGShare?.relabel?.();
  } catch {
    // The part is optional; a failure here changes nothing on screen.
  }
}

/** Test seam: a new visit. */
export function resetVisitForTests(): void {
  promptedThisVisit = false;
}
