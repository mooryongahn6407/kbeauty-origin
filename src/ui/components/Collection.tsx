/**
 * The collection shelf, the return streak, and the store gift card.
 *
 * Fifteen cards, one per governed concern, face-down until the reader has opened that one. A
 * shelf with gaps in it is the oldest reason in the world to come back, and it needs no
 * invented points to work: the gaps are real records nobody has looked at yet.
 */
import { concerns } from '@/knowledge/repository';
import { translate } from '@/localization/messages';
import { concernName } from '@/content/concern-display';
import { useCallback, useEffect, useState } from 'react';
import { formatGiftCode, laosDay } from '@/app/gift-code';
import {
  giftDeviceId,
  requestGift,
  saveGift,
  savedGift,
  type IssuedGift,
} from '@/app/gift';

export function CollectionShelf({
  discoveredIds,
  locale,
}: {
  discoveredIds: readonly string[];
  locale: string;
}) {
  const discovered = new Set(discoveredIds);
  return (
    <section className="record-block">
      <h2 className="record-block__title">{translate('collection.title', locale)}</h2>
      <p className="record-block__note">
        {translate('collection.count', locale, {
          found: String(discovered.size),
          total: String(concerns.length),
        })}
      </p>
      <ul className="shelf" role="list">
        {concerns.map((concern) => {
          const found = discovered.has(concern.Concern_ID);
          return (
            <li
              key={concern.Concern_ID}
              className={found ? 'shelf__card is-found' : 'shelf__card'}
              // A card nobody has opened says so, rather than showing a name it has not earned.
              aria-label={
                found
                  ? concernName(concern.Concern_ID, locale, concern.Concern_Name)
                  : translate('collection.locked', locale)
              }
            >
              <span className="shelf__name">
                {found ? concernName(concern.Concern_ID, locale, concern.Concern_Name) : '?'}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function StreakBadge({ days, locale }: { days: number; locale: string }) {
  if (days < 2) return null;
  return (
    <p className="streak">{translate('collection.streak', locale, { days: String(days) })}</p>
  );
}

/**
 * The last few weeks as a grid of days, filled where the app was opened.
 *
 * A gap is drawn as a quiet empty square and nothing else happens: no lost progress, no
 * apology, no offer to buy the day back. The grid is there because seeing a row fill is worth
 * more than a number, not because a missed day should cost something.
 */
export function VisitCalendar({
  visitDays,
  today,
  locale,
  weeks = 8,
}: {
  visitDays: readonly string[];
  today: Date;
  locale: string;
  weeks?: number;
}) {
  const visited = new Set(visitDays);
  const days: { iso: string; visited: boolean }[] = [];
  // Whole weeks ending today, so the last column is always the day the reader is looking at.
  const total = weeks * 7;
  for (let back = total - 1; back >= 0; back -= 1) {
    const day = new Date(today);
    day.setUTCDate(day.getUTCDate() - back);
    const iso = day.toISOString().slice(0, 10);
    days.push({ iso, visited: visited.has(iso) });
  }

  return (
    <section className="record-block">
      <h2 className="record-block__title">{translate('calendar.title', locale)}</h2>
      <ul className="daygrid" role="list" aria-label={translate('calendar.title', locale)}>
        {days.map((day) => (
          <li
            key={day.iso}
            className={day.visited ? 'daygrid__day is-on' : 'daygrid__day'}
            title={day.iso}
          >
            <span className="visually-hidden">
              {day.iso} {translate(day.visited ? 'calendar.here' : 'calendar.away', locale)}
            </span>
          </li>
        ))}
      </ul>
      <p className="record-block__note">{translate('calendar.note', locale)}</p>
    </section>
  );
}

type GiftState =
  | { readonly status: 'idle' }
  | { readonly status: 'loading' }
  | { readonly status: 'ready'; readonly gift: IssuedGift }
  | { readonly status: 'unavailable' };

const localStore = (): Storage | undefined => {
  try {
    return typeof localStorage === 'undefined' ? undefined : localStorage;
  } catch {
    return undefined;
  }
};

/**
 * The gift.
 *
 * Kept in its own card, after the learning content and after any safety notice, because
 * education outranks commerce (rule 6) and the order on the page is where that ranking is
 * either honoured or quietly reversed.
 *
 * The store gift card (CEO card sqglow_10). `earned` is true only when the reader has just
 * finished the skin game on this screen — reopening a saved result shows today's code if the
 * server already issued one, and otherwise nothing. The code always comes from the server
 * (`@/app/gift`); offline or on any failure the card says «try again in a moment» and never
 * shows a code the server has not issued.
 */
export function GiftCard({
  locale,
  partner = null,
  earned,
}: {
  locale: string;
  /** The shop whose link brought the reader here (see `@/app/partner`), printed beside the code, never in it. */
  partner?: string | null;
  earned: boolean;
}) {
  const [state, setState] = useState<GiftState>(() => {
    const saved = savedGift(localStore(), new Date());
    return saved ? { status: 'ready', gift: saved } : { status: 'idle' };
  });

  const fetchGift = useCallback(async () => {
    const storage = localStore();
    const device = giftDeviceId(storage);
    if (!device) {
      setState({ status: 'unavailable' });
      return;
    }
    setState({ status: 'loading' });
    const result = await requestGift(device, partner);
    if (result.status === 'ready') {
      saveGift(storage, result.gift);
      setState({ status: 'ready', gift: result.gift });
    } else {
      setState({ status: 'unavailable' });
    }
  }, [partner]);

  useEffect(() => {
    if (earned && state.status === 'idle') void fetchGift();
    // Only when the reader earns it; a retry is the reader's own tap.
  }, [earned]);

  if (state.status === 'idle') return null;
  const today = state.status === 'ready' && state.gift.issuedOn === laosDay(new Date());

  return (
    <section className="gift" aria-live="polite">
      <p className="gift__eyebrow">{translate('gift.eyebrow', locale)}</p>
      <p className="gift__headline">{translate('gift.headline', locale)}</p>
      {state.status === 'ready' && today ? (
        <p className="gift__code">{formatGiftCode(state.gift.code)}</p>
      ) : state.status === 'loading' ? (
        <p className="gift__wait">{translate('gift.loading', locale)}</p>
      ) : (
        <>
          <p className="gift__wait">{translate('gift.unavailable', locale)}</p>
          <button type="button" className="btn btn--quiet" onClick={() => void fetchGift()}>
            {translate('gift.retry', locale)}
          </button>
        </>
      )}
      {partner ? <p className="gift__partner">{translate('gift.partner', locale, { code: partner })}</p> : null}
      <p className="gift__note">{translate('gift.note', locale)}</p>
      <p className="gift__note">{translate('gift.oncePerDay', locale)}</p>
    </section>
  );
}
