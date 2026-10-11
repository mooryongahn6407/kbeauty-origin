/**
 * The beauty guide — where the Skin Quest leads. Big picture cards, one tap each, instead of a
 * row of thirteen buttons: our products, the 30-ingredient dictionary, why skincare comes in so
 * many types, why Korean beauty, sun care, and the games for anyone who wants more.
 */
import { translate, type MessageKey } from '@/localization/messages';
import { storeCatalog } from '@/content/store-catalog';
import { companyDictionary } from '@/content/company/ingredient-dictionary';
import type { StoreProduct } from '@/content/store-catalog-types';
import { LUMINA_PORTRAIT } from '@/content/brand';

export type GuideTarget = 'store' | 'dictionary' | 'categories' | 'kbeauty' | 'sunguide' | 'more';

const withPhoto = storeCatalog.filter((product) => product.photo);
const photoIn = (category: string, skip = 0): StoreProduct | undefined =>
  withPhoto.filter((product) => product.category === category)[skip] ?? withPhoto[skip];

interface Card {
  readonly target: GuideTarget;
  readonly key: string;
  readonly photos: readonly (StoreProduct | undefined)[];
  readonly count?: number;
}

const CARDS: readonly Card[] = [
  { target: 'store', key: 'store', photos: withPhoto.slice(0, 4), count: storeCatalog.length },
  { target: 'dictionary', key: 'dictionary', photos: [photoIn('에센스·세럼·앰플', 2)] },
  { target: 'categories', key: 'categories', photos: [photoIn('기프트세트')] },
  { target: 'kbeauty', key: 'kbeauty', photos: [photoIn('크림', 3)] },
  { target: 'sunguide', key: 'suncare', photos: [photoIn('선케어', 1)] },
  { target: 'more', key: 'more', photos: [] },
];

export function GuideHubScreen({
  locale,
  onGo,
}: {
  locale: string;
  onGo: (target: GuideTarget) => void;
}) {
  return (
    <section className="guide" aria-labelledby="guide-title">
      <header className="guide-hero">
        {LUMINA_PORTRAIT ? (
          <img className="guide-hero__photo" src={LUMINA_PORTRAIT} alt="Lumina Noy" />
        ) : null}
        <div className="guide-hero__text">
          <h1 className="guide-title" id="guide-title">
            {translate('guide.title', locale)}
          </h1>
          <p className="lead">{translate('guide.intro', locale)}</p>
        </div>
      </header>
      <ul className="guide__cards" role="list">
        {CARDS.map((card) => (
          <li key={card.key}>
            <button
              type="button"
              className={`guide-card${card.photos.length > 1 ? ' guide-card--collage' : ''}${card.photos.length === 0 ? ' guide-card--plain' : ''}`}
              onClick={() => onGo(card.target)}
            >
              {card.photos.length > 0 ? (
                <span className="guide-card__media" aria-hidden="true">
                  {card.photos.map((product, index) =>
                    product?.photo ? (
                      <img key={product.sku + index} src={product.photo} alt="" loading="lazy" />
                    ) : null,
                  )}
                </span>
              ) : (
                <span className="guide-card__icon" aria-hidden="true">
                  🎮
                </span>
              )}
              <span className="guide-card__text">
                <span className="guide-card__title">
                  {translate(`guide.card.${card.key}.title` as MessageKey, locale)}
                </span>
                <span className="guide-card__body">
                  {translate(`guide.card.${card.key}.body` as MessageKey, locale, {
                    count: String(card.count ?? companyDictionary.ingredients.length),
                  })}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
