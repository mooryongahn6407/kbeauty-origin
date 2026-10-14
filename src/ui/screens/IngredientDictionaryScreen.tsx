/**
 * The KOREA GLOW ingredient dictionary — 30 ingredients, each with what it does, how it works,
 * how to use it, what to watch for, what it pairs with, and which of our products print it.
 *
 * The content is the company's own published dictionary (src/content/company), shown as that:
 * the source line and the company's own evidence grade sit on every entry, and nothing here
 * has been through this app's expert review. Product links are computed from printed labels.
 */
import { useMemo, useState } from 'react';
import { SceneHero } from '../components/SceneHero';
import { translate, type MessageKey } from '@/localization/messages';
import { companyDictionary } from '@/content/company/ingredient-dictionary';
import type { DictionaryEntry, Evidence } from '@/content/company/ingredient-dictionary-types';
import { productsWith } from '@/content/company/ingredient-links';
import { INGREDIENT_GOVERNED_LINKS } from '@/content/company/ingredient-governed-links';
import { labelPhotosForIngredient } from '@/content/label-photos';
import { pick, showsEnglishFallback } from '../pick';
import { ProductStrip } from '../components/ProductCard';
import { ReadAloud } from '../components/ReadAloud';

/** Company content exists in ko/lo/en only (see `pick.ts`) — never asks a device for a voice in
    a language the on-screen text is not actually written in (rule 15's own reasoning). */
const spokenLocaleFor = (locale: string): string =>
  locale === 'ko' || locale === 'lo' ? locale : 'en';

const entryById = (id: string): DictionaryEntry | undefined =>
  companyDictionary.ingredients.find((entry) => entry.id === id);

function EvidenceBadge({ evidence, locale }: { evidence: Evidence; locale: string }) {
  return (
    <span className={`evidence evidence--${evidence}`}>
      {translate(`dict.evidence.${evidence}` as MessageKey, locale)}
    </span>
  );
}

export function IngredientDictionaryScreen({
  locale,
  initialId,
  onOpenProduct,
}: {
  locale: string;
  initialId: string | null;
  onOpenProduct: (sku: string) => void;
}) {
  const [group, setGroup] = useState('');
  const [selected, setSelected] = useState<string | null>(initialId);
  const entry = selected ? entryById(selected) : undefined;

  const open = (id: string | null) => {
    setSelected(id);
    if (typeof window !== 'undefined') window.scrollTo?.(0, 0);
  };

  if (entry) {
    return (
      <EntryPage
        entry={entry}
        locale={locale}
        onBack={() => open(null)}
        onOpen={open}
        onOpenProduct={onOpenProduct}
      />
    );
  }

  const groups = Object.entries(companyDictionary.groups);
  const shown = companyDictionary.ingredients.filter(
    (item) => group === '' || item.group === group,
  );

  return (
    <section className="dict" aria-labelledby="dict-title">
      <SceneHero src="/scenes/scene-01.jpg" focus="50% 28%" />
      <h1 className="guide-title" id="dict-title">
        {translate('dict.title', locale)}
      </h1>
      <p className="lead">
        {translate('dict.intro', locale, { count: String(companyDictionary.ingredients.length) })}
      </p>
      <p className="fine">{translate('dict.evidenceLegend', locale)}</p>
      {showsEnglishFallback(locale) ? (
        <p className="fine">{translate('guide.englishShown', locale)}</p>
      ) : null}

      <ul className="store__cats" role="list">
        <li>
          <button
            type="button"
            className="store__cat"
            aria-pressed={group === ''}
            onClick={() => setGroup('')}
          >
            {translate('dict.all', locale)}
          </button>
        </li>
        {groups.map(([key, label]) => (
          <li key={key}>
            <button
              type="button"
              className="store__cat"
              aria-pressed={group === key}
              onClick={() => setGroup(group === key ? '' : key)}
            >
              {label.icon} {pick(label, locale)}
            </button>
          </li>
        ))}
      </ul>

      <ul className="dict__grid" role="list">
        {shown.map((item) => (
          <li key={item.id}>
            <button type="button" className="dict-card" onClick={() => open(item.id)}>
              <span className="dict-card__icon" aria-hidden="true">
                {companyDictionary.groups[item.group]?.icon}
              </span>
              <span className="dict-card__name">{pick(item.name, locale)}</span>
              <EvidenceBadge evidence={item.evidence} locale={locale} />
              <span className="dict-card__what">{pick(item.what, locale)}</span>
              <span className="dict-card__count">
                {translate('dict.products', locale, {
                  count: String(productsWith(item.id).length),
                })}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="record-block__note">{translate('dict.source', locale)}</p>
    </section>
  );
}

function EntryPage({
  entry,
  locale,
  onBack,
  onOpen,
  onOpenProduct,
}: {
  entry: DictionaryEntry;
  locale: string;
  onBack: () => void;
  onOpen: (id: string) => void;
  onOpenProduct: (sku: string) => void;
}) {
  const products = useMemo(() => productsWith(entry.id), [entry.id]);
  const group = companyDictionary.groups[entry.group];
  const spokenLocale = spokenLocaleFor(locale);
  const governedId = INGREDIENT_GOVERNED_LINKS[entry.id];
  const labelPhotos = governedId ? labelPhotosForIngredient(governedId) : [];

  return (
    <article className="dict" aria-labelledby="dict-entry-name">
      <button type="button" className="btn btn--quiet btn--small" onClick={onBack}>
        {translate('dict.back', locale)}
      </button>
      <header className="dict-entry__head">
        <p className="eyebrow">
          {group?.icon} {group ? pick(group, locale) : ''}
        </p>
        <h1 className="guide-title" id="dict-entry-name">
          {pick(entry.name, locale)}
        </h1>
        <EvidenceBadge evidence={entry.evidence} locale={locale} />
        <p className="fine">
          {translate('dict.aka', locale)}: <span lang="ko">{entry.aka}</span>
        </p>
      </header>

      {labelPhotos.length > 0 ? (
        <section className="card">
          <h2 className="store-labels__title">{translate('ingredient.seenOnLabel', locale)}</h2>
          <div className="label-photo-row">
            {labelPhotos.map((photo) => (
              <a
                key={photo.id}
                href={photo.src}
                rel="noreferrer noopener"
                target="_blank"
                title={translate('ingredient.viewLabelPhoto', locale, {
                  product: photo.productName,
                })}
              >
                <img
                  className="label-photo-thumb label-photo-thumb--large"
                  src={photo.thumbSrc}
                  alt={translate('ingredient.viewLabelPhoto', locale, {
                    product: photo.productName,
                  })}
                  width={96}
                  height={171}
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <div className="chips dict-entry__concerns" aria-label={translate('dict.concerns', locale)}>
        {entry.concerns.map((key) => {
          const concern = companyDictionary.concerns[key];
          return concern ? (
            <span key={key} className="chip chip--soft">
              {pick(concern, locale)}
            </span>
          ) : null;
        })}
      </div>

      {(
        [
          ['dict.what', entry.what],
          ['dict.how', entry.how],
          ['dict.use', entry.use],
          ['dict.caution', entry.caution],
        ] as const
      ).map(([key, text], index) => (
        <section
          key={key}
          className={`card dict-entry__part${key === 'dict.caution' ? ' dict-entry__part--caution' : ''}`}
        >
          <h2 className="store-labels__title">{translate(key, locale)}</h2>
          <p>{pick(text, locale)}</p>
          <ReadAloud
            text={pick(text, locale)}
            locale={locale}
            spokenLocale={spokenLocale}
            autoplay={index === 0}
          />
        </section>
      ))}

      {entry.pairs.length > 0 ? (
        <section className="card">
          <h2 className="store-labels__title">{translate('dict.pairs', locale)}</h2>
          <div className="chips">
            {entry.pairs.map((id) => {
              const other = entryById(id);
              return other ? (
                <button key={id} type="button" className="store__cat" onClick={() => onOpen(id)}>
                  {pick(other.name, locale)}
                </button>
              ) : null;
            })}
          </div>
        </section>
      ) : null}

      {entry.avoid.length > 0 ? (
        <section className="card dict-entry__part--caution">
          <h2 className="store-labels__title">{translate('dict.avoid', locale)}</h2>
          <ul className="dict-entry__avoid">
            {entry.avoid.map((item) => {
              const other = entryById(item.id);
              return (
                <li key={item.id}>
                  {other ? (
                    <button type="button" className="store__cat" onClick={() => onOpen(item.id)}>
                      {pick(other.name, locale)}
                    </button>
                  ) : null}{' '}
                  {pick(item.why, locale)}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <section className="dict-entry__products">
        <h2 className="store-labels__title">
          {translate('dict.products', locale, { count: String(products.length) })}
        </h2>
        {products.length === 0 ? (
          <p className="muted">{translate('dict.noProducts', locale)}</p>
        ) : (
          <ProductStrip products={products} locale={locale} onOpen={onOpenProduct} />
        )}
      </section>

      <p className="record-block__note">{translate('dict.source', locale)}</p>
    </article>
  );
}
