/**
 * The bridge to the shared KOREA GLOW «Share + Like» part (`public/kg_share_like.js`, owned by
 * 11_IST). The part draws its own floating Like and WhatsApp buttons; the app only tells it when
 * a «first success» has happened — a skin-game result read to the end, a lesson finished — so it
 * may ask, politely, at most once every three days (the part keeps that rule itself).
 *
 * Never required: if the part did not load (blocked, offline, an old cached page), every call
 * here does nothing and returns false. It never asks over one of the app's own open dialogs.
 */
interface KGShareApi {
  ask?: (force?: boolean) => boolean;
  relabel?: () => void;
}

type ShareWindow = { KGShare?: KGShareApi; document?: Pick<Document, 'querySelector'> };

const shareWindow = (): ShareWindow | null =>
  typeof window === 'undefined' ? null : (window as unknown as ShareWindow);

/** True when the part asked. False when it is missing, a dialog is open, or it chose not to. */
export function askToShare(win: ShareWindow | null = shareWindow()): boolean {
  try {
    const api = win?.KGShare;
    if (typeof api?.ask !== 'function') return false;
    if (win?.document?.querySelector('[role="dialog"][aria-modal="true"], .kg-guide')) return false;
    return api.ask(false) === true;
  } catch {
    return false;
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
