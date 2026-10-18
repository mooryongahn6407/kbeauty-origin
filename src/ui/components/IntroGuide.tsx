/**
 * Lumina Noy introduces GLOW Class on a reader's first visit (owner's order F, 2026-10-18):
 * the official guide photo, one subtitle at a time, read aloud by the device's voice in the
 * reader's language (Lao through a Thai voice reading the Thai line, rule 15). Then straight into
 * the skin game's first question.
 *
 * - Skip, and «don't play this automatically», are always on screen.
 * - When the browser blocks sound until the reader touches the page, the subtitles carry on by
 *   themselves and a «Turn on sound» button appears; one tap and Lumina reads from that line.
 * - With no voice at all, the subtitles simply advance at reading pace.
 * - The caption names her and nothing else (CEO 2026-10-17).
 * When it plays at all is decided in `src/app/intro.ts` (first visit, preview only for now).
 */
import { useEffect, useRef, useState } from 'react';
import { inLocale } from '@/content/care-quest/types';
import { LUMINA_PHOTO, LUMINA_PORTRAIT } from '@/content/brand';
import { INTRO_LINES } from '@/content/intro-script';
import { subtitleMs } from '@/app/intro';
import { CHROME } from '../chrome-text';
import { speakLocalized } from '../speak-localized';
import { speechSupported, stopSpeaking } from '../speech';
import { Icon } from './AppChrome';

const t = (key: keyof typeof CHROME, locale: string) => inLocale(CHROME[key]!, locale);

export function IntroGuide({
  locale,
  onDone,
}: {
  locale: string;
  /** `seen`: ended or skipped. `off`: the reader asked it never to start by itself again. */
  onDone: (how: 'seen' | 'off') => void;
}) {
  const [index, setIndex] = useState(0);
  // Try to speak from the start; a browser that blocks it flips this off and shows the button.
  const [sound, setSound] = useState(true);
  const [blocked, setBlocked] = useState(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  const last = INTRO_LINES.length - 1;
  const line = INTRO_LINES[index]!;
  const text = inLocale(line, locale);

  useEffect(() => {
    let finished = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const advance = (delay: number) => {
      if (finished) return;
      finished = true;
      timers.push(
        setTimeout(() => {
          if (index < last) setIndex(index + 1);
          else doneRef.current('seen');
        }, delay),
      );
    };
    if (sound) {
      const started = speakLocalized(line, locale, {
        onEnd: () => advance(450),
        onError: () => {
          setSound(false);
          setBlocked(true);
        },
      });
      if (!started) {
        // No voice yet (the list may still be loading) or none at all: carry on in subtitles, and
        // offer the button wherever the browser can speak at all.
        setSound(false);
        setBlocked(speechSupported());
      } else {
        // A voice that never reports back (some phones) must not hold the subtitles forever.
        timers.push(setTimeout(() => advance(0), subtitleMs(text) * 2 + 2500));
      }
    } else {
      advance(subtitleMs(text));
    }
    return () => {
      finished = true;
      timers.forEach(clearTimeout);
    };
  }, [index, sound, locale, last, line, text]);

  useEffect(() => () => stopSpeaking(), []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') doneRef.current('seen');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const photo = LUMINA_PORTRAIT ?? LUMINA_PHOTO;
  return (
    <div className="kg-intro" role="dialog" aria-modal="true" aria-labelledby="kg-intro-line">
      <div className="kg-intro__panel">
        {photo ? (
          <figure className="kg-intro__figure">
            <img className="kg-intro__photo" src={photo} alt="" />
            <figcaption className="kg-intro__name">{t('guideName', locale)}</figcaption>
          </figure>
        ) : null}
        <p className="kg-intro__line" id="kg-intro-line" aria-live="polite">
          {text}
        </p>
        <ol className="kg-intro__dots" aria-hidden="true">
          {INTRO_LINES.map((_, n) => (
            <li key={n} className={n === index ? 'is-on' : n < index ? 'is-done' : ''} />
          ))}
        </ol>
        <div className="kg-intro__actions">
          {!sound && blocked ? (
            <button
              type="button"
              className="btn kg-intro__btn"
              onClick={() => {
                setBlocked(false);
                setSound(true);
              }}
            >
              <Icon name="speakerOn" />
              {t('introSound', locale)}
            </button>
          ) : null}
          {index === last ? (
            <button type="button" className="btn btn--primary kg-intro__btn" onClick={() => onDone('seen')}>
              {t('introStart', locale)}
              <Icon name="next" />
            </button>
          ) : (
            <button type="button" className="btn btn--quiet kg-intro__btn" onClick={() => onDone('seen')}>
              {t('introSkip', locale)}
              <Icon name="next" />
            </button>
          )}
          <button type="button" className="kg-intro__noauto" onClick={() => onDone('off')}>
            {t('introNoAuto', locale)}
          </button>
        </div>
      </div>
    </div>
  );
}
