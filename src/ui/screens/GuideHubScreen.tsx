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

export type GuideTarget =
  | 'store'
  | 'dictionary'
  | 'categories'
  | 'kbeauty'
  | 'sunguide'
  | 'lessons'
  | 'about'
  | 'academy'
  | 'wording'
  | 'more';

const withPhoto = storeCatalog.filter((product) => product.photo);
const photoIn = (category: string, skip = 0): StoreProduct | undefined =>
  withPhoto.filter((product) => product.category === category)[skip] ?? withPhoto[skip];

interface Card {
  readonly target: GuideTarget;
  readonly key: string;
  readonly photos: readonly (StoreProduct | undefined)[];
  readonly count?: number;
  readonly icon?: string;
  /** One of the owner's lifestyle photos (public/scenes), for a card that shows no product. */
  readonly scene?: string;
  /** Which part of the scene photo to keep when the card crops it (CSS object-position). */
  readonly focus?: string;
}

const CARDS: readonly Card[] = [
  {
    target: 'store',
    key: 'store',
    photos: [],
    count: storeCatalog.length,
    scene: '/gemini/A-03.jpg',
    focus: '50% 40%',
  },
  {
    target: 'dictionary',
    key: 'dictionary',
    photos: [],
    scene: '/gemini/A-04.jpg',
    focus: '60% 40%',
  },
  {
    target: 'categories',
    key: 'categories',
    photos: [],
    scene: '/gemini/A-05.jpg',
    focus: '50% 60%',
  },
  { target: 'kbeauty', key: 'kbeauty', photos: [], scene: '/gemini/A-06.jpg', focus: '30% 40%' },
  { target: 'sunguide', key: 'suncare', photos: [], scene: '/gemini/A-07.jpg', focus: '50% 45%' },
  {
    target: 'lessons',
    key: 'lessons',
    photos: [],
    icon: '📚',
    scene: '/gemini/B-09.jpg',
    focus: '60% 35%',
  },
  { target: 'about', key: 'about', photos: [], icon: 'ℹ️', scene: '/scenes/scene-04.jpg' },
  {
    target: 'academy',
    key: 'academy',
    photos: [],
    icon: '🎓',
    scene: '/scenes/scene-05.jpg',
    focus: '50% 35%',
  },
  {
    target: 'wording',
    key: 'partner',
    photos: [],
    icon: '✍️',
    scene: '/gemini/A-09.jpg',
    focus: '40% 45%',
  },
  { target: 'more', key: 'more', photos: [], icon: '🎮', scene: '/scenes/scene-02.jpg' },
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
              className={`guide-card${card.photos.length > 1 ? ' guide-card--collage' : ''}${card.photos.length === 0 && !card.scene ? ' guide-card--plain' : ''}`}
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
              ) : card.scene ? (
                <span className="guide-card__media guide-card__media--scene" aria-hidden="true">
                  <img
                    src={card.scene}
                    alt=""
                    loading="lazy"
                    style={card.focus ? { objectPosition: card.focus } : undefined}
                  />
                </span>
              ) : (
                <span className="guide-card__icon" aria-hidden="true">
                  {card.icon}
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
