/**
 * The collection shelf, the return streak, and the store gift card.
 *
 * Fifteen cards, one per governed concern, face-down until the reader has opened that one. A
 * shelf with gaps in it is the oldest reason in the world to come back, and it needs no
 * invented points to work: the gaps are real records nobody has looked at yet.
 */
import { concerns } from '@/knowledge/repository';
import { translate } from '@/localization/messages';
import type { StoreGift } from '@/app/collection';

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
              aria-label={found ? concern.Concern_Name : translate('collection.locked', locale)}
            >
              <span className="shelf__name">
                {found ? concern.Concern_Name : '?'}
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
 * The gift.
 *
 * Kept in its own card, after the learning content and after any safety notice, because
 * education outranks commerce (rule 6) and the order on the page is where that ranking is
 * either honoured or quietly reversed.
 */
export function GiftCard({ gift, locale }: { gift: StoreGift; locale: string }) {
  return (
    <section className="gift">
      <p className="gift__eyebrow">{translate('gift.eyebrow', locale)}</p>
      <p className="gift__headline">{translate('gift.headline', locale)}</p>
      <p className="gift__code">{gift.code}</p>
      <p className="gift__note">{translate('gift.note', locale)}</p>
    </section>
  );
}
