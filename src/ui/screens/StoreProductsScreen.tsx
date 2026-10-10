/**
 * Our products' labels — every product the shop sells today, and its back label read aloud.
 *
 * The reader finds a product (by name, brand, category, or an ingredient printed on it) and sees
 * its full ingredient list in printed order. The names our 40-record ingredient dictionary holds
 * are picked out and grouped by the dictionary's own function label, which is still Draft and
 * says so. The reader can keep a private list of ingredients to avoid; a label that prints one
 * of them says so, with its place on the list.
 *
 * What the screen never does: say what a product or ingredient does, rank products, recommend
 * one, show a price, or say a product is "free of" anything. A partner shop's link (`?product=`)
 * opens a product directly, and the link the screen hands out carries the shop's code.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { translate, type MessageKey } from '@/localization/messages';
import { storeCatalog } from '@/content/store-catalog';
import { nameWithoutBrand, type StoreProduct } from '@/content/store-catalog-types';
import { findIngredient } from '@/knowledge/ingredients';
import {
  avoidHits,
  findProduct,
  hasReadableList,
  ingredientsOnSale,
  loadAvoidList,
  productLink,
  readLabel,
  saveAvoidList,
  searchCatalog,
  storeCategories,
  type LabelEntry,
} from '@/app/store-catalog';
import { PARTNER_PARAM } from '@/app/partner';
import { QUIET_ZONE, qrMatrix, qrPath, qrPngDataUrl } from '@/app/qr';
import { CompanionSays } from '../components/Companion';
import { ReadAloud } from '../components/ReadAloud';
import { spokenFallback } from '../spoken-fallback';
import { functionLabel } from '../function-labels';

const storage = (): Storage | undefined =>
  typeof localStorage === 'undefined' ? undefined : localStorage;

const categoryLabel = (category: string, locale: string): string =>
  translate(`store.category.${category}` as MessageKey, locale);

/** The name a reader in this language is most likely to recognise first. */
const primaryName = (product: StoreProduct, locale: string): string =>
  locale === 'ko' || !product.nameEn ? nameWithoutBrand(product) : product.nameEn;
const secondaryName = (product: StoreProduct, locale: string): string | null =>
  locale === 'ko' ? product.nameEn : product.nameEn ? nameWithoutBrand(product) : null;

const positionText = (entry: LabelEntry, total: number, locale: string): string =>
  entry.position === null
    ? translate('compare.storePositionUnknown', locale)
    : translate('compare.storePosition', locale, {
        n: String(entry.position),
        total: String(total),
      });

/** Keep the address bar pointing at what is on screen, so it can be shared as it is. */
function syncAddress(sku: string | null, partner: string | null): void {
  if (typeof window === 'undefined' || !window.history?.replaceState) return;
  const base = window.location.pathname;
  const url = sku
    ? productLink(base, sku, partner)
    : partner
      ? `${base}?${PARTNER_PARAM}=${encodeURIComponent(partner)}`
      : base;
  window.history.replaceState(window.history.state, '', url);
}

export function StoreProductsScreen({
  locale,
  partner,
  initialSku,
}: {
  locale: string;
  partner: string | null;
  initialSku: string | null;
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [selected, setSelected] = useState<string | null>(initialSku);
  const [avoid, setAvoid] = useState<readonly string[]>(() => loadAvoidList(storage()));

  useEffect(() => saveAvoidList(storage(), avoid), [avoid]);

  // Bring the product (or the list, on the way back) to the top of the screen. A customer who
  // scanned a shop's QR code should see the product first, not the row of study rooms above it.
  const top = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current && selected === null) {
      first.current = false;
      return;
    }
    first.current = false;
    top.current?.scrollIntoView?.({ block: 'start' });
  }, [selected]);

  const open = (sku: string | null) => {
    setSelected(sku);
    syncAddress(sku, partner);
  };

  const product = selected ? findProduct(selected) : undefined;
  return (
    <div ref={top}>
      {product ? (
        <ProductLabel
          product={product}
          locale={locale}
          partner={partner}
          avoid={avoid}
          onBack={() => open(null)}
        />
      ) : (
        <ProductList
          locale={locale}
          query={query}
          onQuery={setQuery}
          category={category}
          onCategory={setCategory}
          avoid={avoid}
          onAvoid={setAvoid}
          onOpen={open}
        />
      )}
    </div>
  );
}

function ProductList({
  locale,
  query,
  onQuery,
  category,
  onCategory,
  avoid,
  onAvoid,
  onOpen,
}: {
  locale: string;
  query: string;
  onQuery: (query: string) => void;
  category: string;
  onCategory: (category: string) => void;
  avoid: readonly string[];
  onAvoid: (avoid: readonly string[]) => void;
  onOpen: (sku: string) => void;
}) {
  const categories = useMemo(storeCategories, []);
  const results = useMemo(
    () =>
      searchCatalog(query).filter((product) => category === '' || product.category === category),
    [query, category],
  );
  const prompt = translate('store.prompt', locale, { count: String(storeCatalog.length) });

  return (
    <section className="store" aria-labelledby="store-prompt">
      <CompanionSays mood="calm">
        <p className="bubble__prompt" id="store-prompt">
          {prompt}
        </p>
        <p className="bubble__help">{translate('store.help', locale)}</p>
        <ReadAloud
          text={prompt}
          locale={locale}
          fallback={spokenFallback(locale, (spoken) =>
            translate('store.prompt', spoken, { count: String(storeCatalog.length) }),
          )}
        />
      </CompanionSays>

      <label className="settings__label" htmlFor="store-search">
        {translate('store.searchLabel', locale)}
      </label>
      <input
        id="store-search"
        className="field"
        type="search"
        value={query}
        placeholder={translate('store.searchPlaceholder', locale)}
        onChange={(event) => onQuery(event.target.value)}
      />

      <ul className="store__cats" role="list" aria-label={translate('store.categories', locale)}>
        <li>
          <button
            type="button"
            className="store__cat"
            aria-pressed={category === ''}
            onClick={() => onCategory('')}
          >
            {translate('store.allCategories', locale)}
          </button>
        </li>
        {categories.map((name) => (
          <li key={name}>
            <button
              type="button"
              className="store__cat"
              aria-pressed={category === name}
              onClick={() => onCategory(category === name ? '' : name)}
            >
              {categoryLabel(name, locale)}
            </button>
          </li>
        ))}
      </ul>

      <AvoidPicker locale={locale} avoid={avoid} onAvoid={onAvoid} />

      <p className="store__count" aria-live="polite">
        {translate('store.resultCount', locale, { count: String(results.length) })}
      </p>
      {results.length === 0 ? (
        <p className="muted">{translate('store.noResults', locale)}</p>
      ) : (
        <ul className="store__list" role="list">
          {results.map((item) => {
            const hits = avoidHits(item, avoid).length;
            const secondary = secondaryName(item, locale);
            return (
              <li key={item.sku}>
                <button type="button" className="store-item" onClick={() => onOpen(item.sku)}>
                  <span className="store-item__brand">{item.brand}</span>
                  <span className="store-item__name">{primaryName(item, locale)}</span>
                  {secondary ? <span className="store-item__alt">{secondary}</span> : null}
                  <span className="store-item__tags">
                    <span className="tag">{categoryLabel(item.category, locale)}</span>
                    <SourceTag product={item} locale={locale} />
                    {hits > 0 ? (
                      <span className="tag tag--blocker">
                        ⚠ {translate('store.avoidHitsBadge', locale, { count: String(hits) })}
                      </span>
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <p className="record-block__note">{translate('store.noCommerce', locale)}</p>
    </section>
  );
}

function SourceTag({ product, locale }: { product: StoreProduct; locale: string }) {
  const tone =
    product.source === 'LABEL_CHECKED'
      ? 'tag--open'
      : product.source === 'SUPPLIER_TEXT_UNCHECKED'
        ? 'tag--critical'
        : '';
  return (
    <span className={`tag ${tone}`.trim()}>
      {translate(`store.source.${product.source}` as MessageKey, locale)}
    </span>
  );
}

function AvoidPicker({
  locale,
  avoid,
  onAvoid,
}: {
  locale: string;
  avoid: readonly string[];
  onAvoid: (avoid: readonly string[]) => void;
}) {
  const choices = useMemo(ingredientsOnSale, []);
  const toggle = (id: string) =>
    onAvoid(avoid.includes(id) ? avoid.filter((other) => other !== id) : [...avoid, id]);

  return (
    <details className="store-avoid">
      <summary className="store-avoid__summary">
        {translate('store.avoidTitle', locale)}
        {avoid.length > 0
          ? ` · ${translate('store.avoidCount', locale, { count: String(avoid.length) })}`
          : ''}
      </summary>
      <p className="store-avoid__intro">{translate('store.avoidIntro', locale)}</p>
      <ul className="store__cats" role="list">
        {choices.map((id) => {
          const record = findIngredient(id);
          if (!record) return null;
          return (
            <li key={id}>
              <button
                type="button"
                className="store__cat store__cat--avoid"
                aria-pressed={avoid.includes(id)}
                onClick={() => toggle(id)}
              >
                {record.Ingredient_Name}
              </button>
            </li>
          );
        })}
      </ul>
    </details>
  );
}

function ProductLabel({
  product,
  locale,
  partner,
  avoid,
  onBack,
}: {
  product: StoreProduct;
  locale: string;
  partner: string | null;
  avoid: readonly string[];
  onBack: () => void;
}) {
  const entries = readLabel(product);
  const total = entries.length;
  const readable = hasReadableList(product);
  const hits = avoidHits(product, avoid);
  const secondary = secondaryName(product, locale);

  // Recognised names grouped by the dictionary's function label, in order of first appearance.
  const groups = new Map<string, { id: string; entry: LabelEntry }[]>();
  for (const entry of entries) {
    const record = entry.ingredientId ? findIngredient(entry.ingredientId) : undefined;
    if (!record) continue;
    const list = groups.get(record.Primary_Function) ?? [];
    list.push({ id: record.Ingredient_ID, entry });
    groups.set(record.Primary_Function, list);
  }

  return (
    <section className="store" aria-labelledby="store-product-name">
      <button type="button" className="btn btn--quiet btn--small" onClick={onBack}>
        {translate('store.back', locale)}
      </button>

      <header className="store-product">
        <p className="eyebrow">
          {product.brand} · {categoryLabel(product.category, locale)}
        </p>
        <h2 className="store-product__name" id="store-product-name">
          {primaryName(product, locale)}
        </h2>
        {secondary ? <p className="store-product__alt">{secondary}</p> : null}
        <p className="store-item__tags">
          {product.size ? (
            <span className="tag">
              {translate('store.size', locale)} {product.size}
            </span>
          ) : null}
          <SourceTag product={product} locale={locale} />
        </p>
      </header>

      {avoid.length > 0 && readable ? (
        hits.length > 0 ? (
          <div className="disclosure disclosure--caution" role="alert">
            <span className="disclosure__mark">⚠</span>
            <div>
              <p>{translate('store.avoidAlert', locale)}</p>
              <ul className="store-avoid__hits">
                {hits.map((entry) => (
                  <li key={`${entry.printed}-${entry.position}`}>
                    <strong>{entry.printed}</strong> (
                    {findIngredient(entry.ingredientId!)?.Ingredient_Name}) —{' '}
                    {positionText(entry, total, locale)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="disclosure disclosure--info">
            <span className="disclosure__mark">i</span>
            <span>{translate('store.avoidNoneFound', locale)}</span>
          </p>
        )
      ) : null}

      {!readable ? (
        <p className="card card--sunk">
          {translate(
            product.source === 'NOT_APPLICABLE' ? 'store.noList.accessory' : 'store.noList.pending',
            locale,
          )}
        </p>
      ) : (
        <>
          <div className="card">
            <h3 className="store-labels__title">{translate('store.groupsTitle', locale)}</h3>
            <p className="store-labels__intro">{translate('store.groupsIntro', locale)}</p>
            {groups.size === 0 ? (
              <p className="muted">{translate('store.groupsNone', locale)}</p>
            ) : (
              <dl className="store-groups">
                {[...groups.entries()].map(([fn, members]) => (
                  <div key={fn} className="store-group">
                    <dt className="store-group__fn">
                      {functionLabel(fn, locale)} <span className="muted">· {members.length}</span>
                    </dt>
                    <dd className="store-group__members">
                      {members.map(({ id, entry }) => (
                        <span key={`${id}-${entry.printed}`} className="chip chip--soft">
                          {findIngredient(id)?.Ingredient_Name}
                          {entry.position !== null ? ` · ${entry.position}` : ''}
                        </span>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            <p className="claim-flag">
              <span className="claim-flag__mark" aria-hidden="true">
                !
              </span>
              {translate('ingredient.unverifiedFlag', locale)}
            </p>
          </div>

          <div className="card">
            <h3 className="store-labels__title">
              {translate('store.listTitle', locale, { count: String(total) })}
            </h3>
            <p className="store-labels__intro">{translate('store.listIntro', locale)}</p>
            {product.inciTruncated ? (
              <p className="disclosure disclosure--caution">
                <span className="disclosure__mark">!</span>
                <span>{translate('store.listTruncated', locale)}</span>
              </p>
            ) : null}
            <ol className="store-inci" lang="ko">
              {entries.map((entry, index) => {
                const record = entry.ingredientId ? findIngredient(entry.ingredientId) : undefined;
                const flagged = !!entry.ingredientId && avoid.includes(entry.ingredientId);
                return (
                  <li key={`${index}-${entry.printed}`} className="store-inci__row">
                    {product.inciGapAfter === index ? (
                      <span className="store-inci__gap" lang={locale}>
                        {translate('store.gap', locale)}
                      </span>
                    ) : null}
                    <span className="store-inci__n">{entry.position ?? '?'}</span>
                    <span
                      className={`store-inci__name${record ? ' store-inci__name--known' : ''}${flagged ? ' store-inci__name--avoid' : ''}`}
                    >
                      {flagged ? '⚠ ' : ''}
                      {entry.printed}
                      {record ? (
                        <span className="store-inci__en" lang="en">
                          {' '}
                          {record.Ingredient_Name}
                        </span>
                      ) : null}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </>
      )}

      <ShareLink sku={product.sku} partner={partner} locale={locale} />
      <p className="record-block__note">{translate('store.noCommerce', locale)}</p>
    </section>
  );
}

function ShareLink({
  sku,
  partner,
  locale,
}: {
  sku: string;
  partner: string | null;
  locale: string;
}) {
  const [state, setState] = useState<'idle' | 'copied' | 'manual'>('idle');
  const [showQr, setShowQr] = useState(false);
  const link =
    typeof window === 'undefined'
      ? productLink('/', sku, partner)
      : productLink(`${window.location.origin}${window.location.pathname}`, sku, partner);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setState('copied');
    } catch {
      setState('manual');
    }
  };

  return (
    <div className="store-share">
      <button type="button" className="btn btn--quiet" onClick={copy}>
        🔗 {translate('store.share', locale)}
      </button>
      {state === 'copied' ? (
        <span className="store-share__done" role="status">
          ✓ {translate('store.copied', locale)}
        </span>
      ) : null}
      <button
        type="button"
        className="btn btn--quiet"
        aria-expanded={showQr}
        onClick={() => setShowQr((open) => !open)}
      >
        ▦ {translate(showQr ? 'store.qrHide' : 'store.qrShow', locale)}
      </button>
      {state === 'manual' ? <p className="store-share__link">{link}</p> : null}
      {showQr ? <ProductQr link={link} sku={sku} partner={partner} locale={locale} /> : null}
    </div>
  );
}

/**
 * The product link as a QR code, for a shop's counter card or a customer's phone. Black on
 * white in both themes (scanners need the contrast), drawn from the link alone on this device.
 */
function ProductQr({
  link,
  sku,
  partner,
  locale,
}: {
  link: string;
  sku: string;
  partner: string | null;
  locale: string;
}) {
  const matrix = useMemo(() => qrMatrix(link), [link]);
  const side = matrix.length + QUIET_ZONE * 2;

  const save = () => {
    const tokens = getComputedStyle(document.documentElement);
    const url = qrPngDataUrl(
      matrix,
      tokens.getPropertyValue('--qr-ink').trim(),
      tokens.getPropertyValue('--qr-paper').trim(),
    );
    if (!url) return;
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `KOREA-GLOW-${sku}${partner ? `-${partner}` : ''}.png`;
    anchor.click();
  };

  return (
    <figure className="store-qr">
      <svg
        className="store-qr__code"
        viewBox={`${-QUIET_ZONE} ${-QUIET_ZONE} ${side} ${side}`}
        role="img"
        aria-label={translate('store.qrAlt', locale)}
        shapeRendering="crispEdges"
      >
        <rect
          className="store-qr__paper"
          x={-QUIET_ZONE}
          y={-QUIET_ZONE}
          width={side}
          height={side}
        />
        <path className="store-qr__ink" d={qrPath(matrix)} />
      </svg>
      <figcaption className="store-qr__caption">
        {partner
          ? translate('store.qrPartner', locale, { code: partner })
          : translate('store.qrNoPartner', locale)}
      </figcaption>
      <button type="button" className="btn btn--quiet btn--small" onClick={save}>
        ⬇ {translate('store.qrSave', locale)}
      </button>
    </figure>
  );
}
