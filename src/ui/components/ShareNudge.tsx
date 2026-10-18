/**
 * The soft one-line «please like / share» note (owner, 2026-10-18). It appears at a step change
 * only when `requestShareNudge` (src/app/share-ask.ts) says the budget allows — at most once a
 * visit, never within three days of the last ask — sits above the bottom bar without blocking
 * anything, closes itself after a while, and can be closed at once. When the voice switch is on,
 * Lumina reads the line (Lao through a Thai voice, per rule 15).
 */
import { useEffect, useState } from 'react';
import { inLocale } from '@/content/care-quest/types';
import { NUDGE_EVENT } from '@/app/share-ask';
import { CHROME } from '../chrome-text';
import { speakLocalized } from '../speak-localized';
import { useVoice } from '../voice';
import { Icon } from './AppChrome';

export const NUDGE_SHOWN_MS = 14000;

export function ShareNudge({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  const { on: voiceOn } = useVoice();
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const show = () => setOpen(true);
    window.addEventListener(NUDGE_EVENT, show);
    return () => window.removeEventListener(NUDGE_EVENT, show);
  }, []);
  useEffect(() => {
    if (!open) return;
    if (voiceOn) speakLocalized(CHROME.nudge!, locale);
    const timer = setTimeout(() => setOpen(false), NUDGE_SHOWN_MS);
    return () => clearTimeout(timer);
    // Speak once per showing; a language change mid-note does not restart it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  if (!open) return null;
  return (
    <div className="kg-nudge" role="status">
      <p className="kg-nudge__text">{inLocale(CHROME.nudge!, locale)}</p>
      <button
        type="button"
        className="kg-iconbtn kg-nudge__close"
        onClick={() => setOpen(false)}
        aria-label={inLocale(CHROME.close!, locale)}
      >
        <Icon name="close" />
      </button>
    </div>
  );
}
