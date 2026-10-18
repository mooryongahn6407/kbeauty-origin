/**
 * Like · Share — two pill buttons, the way a video site puts them under a video (owner's request,
 * 2026-10-18). Shown only in three places: under the home screen, at the end of a skin-game
 * result, and at the end of a lesson — never on every screen.
 *
 * Like remembers this phone's press and shows the shared count only once it is real and at least
 * `LIKE_COUNT_SHOWN_FROM` (see `src/app/like.ts`). Share opens a small sheet with a polite note
 * and the reader's own share options; the link is always the public address with her language
 * and, if she came through a partner shop, that shop's code.
 */
import { useEffect, useState, useSyncExternalStore } from 'react';
import { inLocale } from '@/content/care-quest/types';
import {
  fetchLikeCount,
  formatLikeCount,
  loadLiked,
  optimisticCount,
  saveLiked,
  sendLike,
  shownLikeCount,
} from '@/app/like';
import { loadPartner } from '@/app/partner';
import { SHARE_TITLE, facebookShareHref, publicShareUrl, whatsappShareHref } from '@/app/share';
import { CHROME } from '../chrome-text';
import { Icon, Sheet } from './AppChrome';

const t = (key: keyof typeof CHROME, locale: string) => inLocale(CHROME[key]!, locale);
const storage = (): Storage | undefined => {
  try {
    return typeof localStorage === 'undefined' ? undefined : localStorage;
  } catch {
    return undefined;
  }
};

/* One shared like state for every bar on the page, so two bars never disagree. */
interface LikeState {
  readonly liked: boolean;
  readonly count: number | null;
}
let likeState: LikeState = { liked: false, count: null };
let likeLoaded = false;
const listeners = new Set<() => void>();
const setLikeState = (next: LikeState) => {
  likeState = next;
  listeners.forEach((listener) => listener());
};
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const snapshot = () => likeState;

function ensureLoaded() {
  if (likeLoaded) return;
  likeLoaded = true;
  setLikeState({ liked: loadLiked(storage()), count: null });
  void fetchLikeCount().then((count) => setLikeState({ ...likeState, count }));
}

function toggleLike() {
  const action = likeState.liked ? 'unlike' : 'like';
  const liked = action === 'like';
  saveLiked(storage(), liked);
  setLikeState({ liked, count: optimisticCount(likeState.count, action) });
  void sendLike(action).then((count) => {
    // A late answer for an older press must not undo a newer one.
    if (likeState.liked === liked) setLikeState({ liked, count });
  });
}

export function LikeButton({ locale }: { locale: string }) {
  const state = useSyncExternalStore(subscribe, snapshot, snapshot);
  useEffect(ensureLoaded, []);
  const shown = shownLikeCount(state.count);
  return (
    <button type="button" className="kg-pill kg-pill--like" aria-pressed={state.liked} onClick={toggleLike}>
      <Icon name="like" />
      <span>{t('like', locale)}</span>
      {shown !== null ? <span className="kg-pill__count">{formatLikeCount(shown, locale)}</span> : null}
    </button>
  );
}

async function copyText(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the old way below.
  }
  try {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  } catch {
    return false;
  }
}

export function ShareSheet({ locale, onClose }: { locale: string; onClose: () => void }) {
  const url = publicShareUrl(locale, loadPartner(storage()));
  const message = t('shareMessage', locale);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2500);
    return () => clearTimeout(timer);
  }, [copied]);
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  return (
    <Sheet title={t('shareTitle', locale)} locale={locale} onClose={onClose}>
      <div className="kg-share">
        <p className="kg-share__note">{message}</p>
        <div className="kg-share__actions">
          {canShare ? (
            <button
              type="button"
              className="btn btn--primary kg-share__btn"
              onClick={() => {
                navigator.share({ title: SHARE_TITLE, text: message, url }).catch(() => {
                  // Closed by the reader, or not allowed here: nothing to say.
                });
              }}
            >
              <Icon name="share" />
              {t('shareNative', locale)}
            </button>
          ) : null}
          <a
            className="kg-setting__btn kg-share__btn"
            href={whatsappShareHref(message, url)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="chat" />
            {t('shareWhatsApp', locale)}
          </a>
          <a
            className="kg-setting__btn kg-share__btn"
            href={facebookShareHref(url)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="people" />
            {t('shareFacebook', locale)}
          </a>
          <button
            type="button"
            className="kg-setting__btn kg-share__btn"
            onClick={() => void copyText(url).then(setCopied)}
          >
            <Icon name={copied ? 'check' : 'link'} />
            {copied ? t('shareCopied', locale) : t('shareCopy', locale)}
          </button>
          <p className="visually-hidden" role="status" aria-live="polite">
            {copied ? t('shareCopied', locale) : ''}
          </p>
          <button type="button" className="btn btn--quiet kg-share__btn" onClick={onClose}>
            {t('close', locale)}
          </button>
        </div>
      </div>
    </Sheet>
  );
}

export function ShareButton({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="kg-pill" aria-haspopup="dialog" onClick={() => setOpen(true)}>
        <Icon name="share" />
        <span>{t('share', locale)}</span>
      </button>
      {open ? <ShareSheet locale={locale} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

/** "Was this app helpful?" + Like + Share. `ask` adds the question in front of the buttons. */
export function LikeShareBar({ locale, ask = false }: { locale: string; ask?: boolean }) {
  return (
    <div className={`kg-likeshare${ask ? ' kg-likeshare--ask' : ''}`}>
      {ask ? <p className="kg-likeshare__ask">{t('helpful', locale)}</p> : null}
      <div className="kg-likeshare__pills">
        <LikeButton locale={locale} />
        <ShareButton locale={locale} />
      </div>
    </div>
  );
}

/** Test seam: forget the shared like state between tests. */
export function resetLikeStateForTests() {
  likeState = { liked: false, count: null };
  likeLoaded = false;
}
