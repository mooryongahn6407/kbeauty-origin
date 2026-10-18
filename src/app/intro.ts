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
export const INTRO_HOSTS: readonly string[] = [
  'app.korea-glow.com', // script approved by the CEO 2026-10-18 (card sqglow_12)
  'glow-next.korea-glow.com',
  'localhost',
  '127.0.0.1',
];

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

/**
 * Recorded voice for the introduction (2026-10-18): one MP3 per sentence per language, made with
 * edge-tts from the exact lines in `src/content/intro-script.ts`, because the phone's own voice is
 * silent on many phones with no Thai or Lao voice. Lao screens keep the Lao subtitle and play the
 * Thai recording (company rule: Lao text on screen, Thai voice). If a file fails, the intro falls
 * back to the device voice. Regenerate the files whenever a line of the script changes.
 */
export const INTRO_AUDIO_COUNT = 6;
export const INTRO_AUDIO_VOICE: Readonly<Record<string, string>> = {
  ko: 'ko',
  en: 'en',
  fr: 'fr',
  th: 'th',
  lo: 'th',
};

/** The recording for sentence `index` (0-based) in this locale, or null when there is none. */
export function introAudioUrl(locale: string, index: number): string | null {
  const lang = INTRO_AUDIO_VOICE[(locale || '').toLowerCase().split(/[-_]/)[0] ?? ''];
  if (!lang || !Number.isInteger(index) || index < 0 || index >= INTRO_AUDIO_COUNT) return null;
  return `/intro/audio/${lang}/${index + 1}.mp3`;
}

/**
 * How long to wait for a recording before moving on anyway (a phone that never reports the end):
 * the clip's own length plus 3 s once known, otherwise generous for the line's length.
 */
export const clipSafetyMs = (text: string, durationSeconds?: number): number =>
  durationSeconds !== undefined && Number.isFinite(durationSeconds) && durationSeconds > 0
    ? Math.round(durationSeconds * 1000) + 3000
    : subtitleMs(text) * 3 + 5000;

/** How long a subtitle stays when no voice reads it: about 14 characters a second, 3.5 s minimum. */
export const subtitleMs = (text: string): number => Math.max(3500, Math.round(text.length * 70));
