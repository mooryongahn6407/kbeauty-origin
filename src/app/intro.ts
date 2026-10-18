/**
 * When Lumina Noy's first-visit introduction plays.
 *
 * - Only on a first visit: once it has finished, been skipped, or been told not to play by
 *   itself, this phone remembers and it never starts by itself again.
 * - Only on the preview for now: the owner has not approved the script yet (2026-10-18), so the
 *   live address never plays it. `?intro` forces it anywhere, for review. Approving it means
 *   adding the live host to INTRO_HOSTS.
 */
export const INTRO_KEY = 'korea-glow:intro:v1';
export const INTRO_HOSTS: readonly string[] = ['glow-next.korea-glow.com', 'localhost', '127.0.0.1'];

export function introWanted(
  location: { readonly hostname: string; readonly search: string },
  storage: Pick<Storage, 'getItem'> | undefined,
): boolean {
  let forced = false;
  let blocked = false;
  try {
    const params = new URLSearchParams(location.search);
    forced = params.has('intro');
    // A partner's product link or the owner's report opens on that, never on an introduction.
    blocked = params.has('product') || params.has('admin');
  } catch {
    forced = false;
  }
  if (blocked) return false;
  if (forced) return true;
  if (!INTRO_HOSTS.includes(location.hostname)) return false;
  try {
    return !storage?.getItem(INTRO_KEY);
  } catch {
    return false;
  }
}

/** `seen` after it ends or is skipped; `off` when the reader asked it never to start by itself. */
export function markIntro(storage: Pick<Storage, 'setItem'> | undefined, value: 'seen' | 'off'): void {
  try {
    storage?.setItem(INTRO_KEY, value);
  } catch {
    // Private window: it may play once more on the next visit; nothing worse.
  }
}

/** How long a subtitle stays when no voice reads it: about 14 characters a second, 3.5 s minimum. */
export const subtitleMs = (text: string): number => Math.max(3500, Math.round(text.length * 70));
