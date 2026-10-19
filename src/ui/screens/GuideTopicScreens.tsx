/**
 * The guide's reading pages: why skincare comes in so many types (with each of our 15
 * categories and the products we sell in it), why Korean beauty, and sun care. Text comes from
 * src/content/guides — KOREA GLOW's own education content in Korean, Lao and English — and
 * every page says it has not yet been through an outside expert's review.
 */
import { useState } from 'react';
import { SceneHero } from '../components/SceneHero';
import { translate, type MessageKey } from '@/localization/messages';
import {
  ANTI_AGING_TERMS,
  CATEGORY_GUIDES,
  GUIDE_SOURCES,
  ROUTINE,
  SUN_CARE,
  WHY_KBEAUTY,
  WHY_SO_MANY_CATEGORIES,
  type GuidePoint,
} from '@/content/guides/kbeauty-guide';
import { storeCatalog } from '@/content/store-catalog';
import { pick, pickLang, showsEnglishFallback } from '../pick';
import { ProductStrip } from '../components/ProductCard';
import { GlyphIcon } from '../components/GlyphIcon';

const categoryLabel = (category: string, locale: string): string =>
  translate(`store.category.${category}` as MessageKey, locale);

const productsIn = (category: string) =>
  storeCatalog.filter((product) => product.category === category);

function Points({ points, locale }: { points: readonly GuidePoint[]; locale: string }) {
  return (
    <ul className="points" role="list">
      {points.map((point) => (
        <li key={point.title.en} className="point">
          <span className="point__icon" aria-hidden="true">
            <GlyphIcon glyph={point.icon} />
          </span>
          <span className="point__text">
            <strong className="point__title" lang={pickLang(point.title, locale)}>
              {pick(point.title, locale)}
            </strong>
            <span className="point__body" lang={pickLang(point.body, locale)}>
              {pick(point.body, locale)}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function PageFoot({ locale }: { locale: string }) {
  return (
    <footer className="guide-foot">
      <p className="record-block__note">{translate('guide.draftNote', locale)}</p>
      <details className="store-usage__more">
        <summary>{translate('guide.sources', locale)}</summary>
        <ul className="guide-sources">
          {GUIDE_SOURCES.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noreferrer noopener">
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </footer>
  );
}

function FallbackNote({ locale, content }: { locale: string; content: unknown }) {
  return showsEnglishFallback(locale, content) ? (
    <p className="fine">{translate('guide.englishShown', locale)}</p>
  ) : null;
}

export function CategoriesGuideScreen({
  locale,
  onOpenProduct,
}: {
  locale: string;
  onOpenProduct: (sku: string) => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section className="guide" aria-labelledby="cat-title">
      <SceneHero src="/scenes/scene-03.jpg" focus="50% 30%" />
      <h1 className="guide-title" id="cat-title">
        {translate('cat.title', locale)}
      </h1>
      <FallbackNote locale={locale} content={[WHY_SO_MANY_CATEGORIES, ROUTINE, CATEGORY_GUIDES]} />
      <h2 className="guide-subtitle">{translate('cat.whyTitle', locale)}</h2>
      <Points points={WHY_SO_MANY_CATEGORIES} locale={locale} />

      <h2 className="guide-subtitle">{translate('cat.routineTitle', locale)}</h2>
      <ol className="routine-line">
        {ROUTINE.map((step) => (
          <li key={`${step.step}-${step.category}`} className="routine-line__step">
            <span className="routine-line__n">{step.step}</span>
            <span className="routine-line__name">{categoryLabel(step.category, locale)}</span>
            <span className="routine-line__when">
              {step.am ? (
                <>
                  <GlyphIcon name="sun" /> {translate('store.usage.am', locale)}
                </>
              ) : null}
              {step.am && step.pm ? ' · ' : ''}
              {step.pm ? (
                <>
                  <GlyphIcon name="moon" /> {translate('store.usage.pm', locale)}
                </>
              ) : null}
            </span>
            <span className="routine-line__note" lang={pickLang(step.note, locale)}>
              {pick(step.note, locale)}
            </span>
          </li>
        ))}
      </ol>

      <h2 className="guide-subtitle">{translate('cat.listTitle', locale)}</h2>
      <ul className="cat-list" role="list">
        {CATEGORY_GUIDES.map((guide) => {
          const products = productsIn(guide.category);
          const cover = products.find((product) => product.photo);
          const expanded = open === guide.category;
          return (
            <li key={guide.category} className="cat-item">
              <button
                type="button"
                className="cat-item__head"
                aria-expanded={expanded}
                onClick={() => setOpen(expanded ? null : guide.category)}
              >
                {cover?.photo ? (
                  <img className="cat-item__photo" src={cover.photo} alt="" loading="lazy" />
                ) : (
                  <span className="cat-item__photo cat-item__photo--icon" aria-hidden="true">
                    <GlyphIcon glyph={guide.icon} />
                  </span>
                )}
                <span className="cat-item__title">
                  <GlyphIcon glyph={guide.icon} /> {categoryLabel(guide.category, locale)}
                </span>
                <span className="cat-item__what" lang={pickLang(guide.what, locale)}>
                  {pick(guide.what, locale)}
                </span>
              </button>
              {expanded ? (
                <div className="cat-item__body">
                  <dl className="cat-item__facts">
                    {(
                      [
                        ['cat.why', guide.why],
                        ['cat.when', guide.when],
                        ['cat.laoTip', guide.laoTip],
                      ] as const
                    ).map(([key, text]) => (
                      <div key={key}>
                        <dt>{translate(key, locale)}</dt>
                        <dd lang={pickLang(text, locale)}>{pick(text, locale)}</dd>
                      </div>
                    ))}
                  </dl>
                  {products.length > 0 ? (
                    <>
                      <h3 className="store-labels__title">
                        {translate('cat.products', locale, {
                          category: categoryLabel(guide.category, locale),
                          count: String(products.length),
                        })}
                      </h3>
                      <ProductStrip products={products} locale={locale} onOpen={onOpenProduct} />
                    </>
                  ) : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
      <PageFoot locale={locale} />
    </section>
  );
}

export function KBeautyGuideScreen({ locale }: { locale: string }) {
  return (
    <section className="guide" aria-labelledby="kb-title">
      <SceneHero src="/scenes/scene-11.jpg" focus="50% 25%" />
      <h1 className="guide-title" id="kb-title">
        {translate('kb.title', locale)}
      </h1>
      <FallbackNote locale={locale} content={[WHY_KBEAUTY, ANTI_AGING_TERMS]} />
      <Points points={WHY_KBEAUTY} locale={locale} />
      <h2 className="guide-subtitle">{translate('kb.termsTitle', locale)}</h2>
      <Points points={ANTI_AGING_TERMS} locale={locale} />
      <PageFoot locale={locale} />
    </section>
  );
}

export function SunCareGuideScreen({
  locale,
  onOpenProduct,
}: {
  locale: string;
  onOpenProduct: (sku: string) => void;
}) {
  const products = productsIn('선케어');
  return (
    <section className="guide" aria-labelledby="sun-guide-title">
      <SceneHero src="/gemini/A-07.jpg" focus="50% 40%" />
      <h1 className="guide-title" id="sun-guide-title">
        {translate('sunguide.title', locale)}
      </h1>
      <FallbackNote locale={locale} content={SUN_CARE} />
      <Points points={SUN_CARE} locale={locale} />
      <h2 className="guide-subtitle">
        {translate('sunguide.products', locale, {
          count: String(products.length),
        })}
      </h2>
      <ProductStrip products={products} locale={locale} onOpen={onOpenProduct} />
      <PageFoot locale={locale} />
    </section>
  );
}

const ABOUT_POINTS = [
  { n: 1, icon: 'bag' },
  { n: 2, icon: 'sparkle' },
  { n: 3, icon: 'tag' },
  { n: 4, icon: 'note' },
  { n: 5, icon: 'medical' },
  { n: 6, icon: 'lock' },
  { n: 7, icon: 'globe' },
] as const;

/**
 * How this app works: what it never does (sell, rank brands, diagnose), where its content comes
 * from and how much of it has been checked, and what stays on the reader's phone. Every sentence
 * is a localization string; nothing here is a claim about a product or an ingredient.
 */
export function AboutAppScreen({ locale }: { locale: string }) {
  return (
    <section className="guide" aria-labelledby="about-title">
      <SceneHero src="/gemini/A-09.jpg" focus="50% 40%" />
      <h1 className="guide-title" id="about-title">
        {translate('guide.card.about.title', locale)}
      </h1>
      <p className="lead">{translate('guide.card.about.body', locale)}</p>
      <ul className="points" role="list">
        {ABOUT_POINTS.map(({ n, icon }) => (
          <li key={n} className="point">
            <span className="point__icon" aria-hidden="true">
              <GlyphIcon glyph={icon} />
            </span>
            <span className="point__text">
              <strong className="point__title">
                {translate(`about.p${n}.title` as MessageKey, locale)}
              </strong>
              <span className="point__body">
                {translate(`about.p${n}.body` as MessageKey, locale)}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
