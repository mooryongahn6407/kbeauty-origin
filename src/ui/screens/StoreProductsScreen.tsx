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
import { ingredientIdForPrinted } from '@/content/inci-names';
import {
  avoidHits,
  compareLabels,
  comparisonIsPartial,
  findProduct,
  inquiryMessage,
  loadInquiryList,
  saveInquiryList,
  toggleInquiry,
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
import { PARTNER_PARAM, normalizePartnerCode, shopLink } from '@/app/partner';
import { ReadAloud } from '../components/ReadAloud';
import { spokenFallback } from '../spoken-fallback';
import { QrCard } from '../components/QrCard';
import { ProductPhoto, productName } from '../components/ProductCard';
import { companyDictionary } from '@/content/company/ingredient-dictionary';
import { dictionaryIdsOn } from '@/content/company/ingredient-links';
import { pick } from '../pick';
import { translateSentence } from '@/content/company/usage-translations';
import { LABEL_GALLERY } from '@/content/label-gallery';
import { ProductStrip } from '../components/ProductCard';

const storage = (): Storage | undefined =>
  typeof localStorage === 'undefined' ? undefined : localStorage;

const categoryLabel = (category: string, locale: string): string =>
  translate(`store.category.${category}` as MessageKey, locale);

const primaryName = productName;
const secondaryName = (product: StoreProduct, locale: string): string | null =>
  locale === 'ko' ? product.nameEn : nameWithoutBrand(product);

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
  onOpenIngredient,
}: {
  locale: string;
  partner: string | null;
  initialSku: string | null;
  onOpenIngredient: (id: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [selected, setSelected] = useState<string | null>(initialSku);
  const [avoid, setAvoid] = useState<readonly string[]>(() => loadAvoidList(storage()));
  const [inquiry, setInquiry] = useState<readonly string[]>(() => loadInquiryList(storage()));

  useEffect(() => saveAvoidList(storage(), avoid), [avoid]);
  useEffect(() => saveInquiryList(storage(), inquiry), [inquiry]);

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
          inquiry={inquiry}
          onInquiry={setInquiry}
          onBack={() => open(null)}
          onOpenIngredient={onOpenIngredient}
          onOpenProduct={open}
        />
      ) : (
        <ProductList
          locale={locale}
          partner={partner}
          query={query}
          onQuery={setQuery}
          category={category}
          onCategory={setCategory}
          avoid={avoid}
          onAvoid={setAvoid}
          inquiry={inquiry}
          onInquiry={setInquiry}
          onOpen={open}
        />
      )}
    </div>
  );
}

function ProductList({
  locale,
  partner,
  query,
  onQuery,
  category,
  onCategory,
  avoid,
  onAvoid,
  inquiry,
  onInquiry,
  onOpen,
}: {
  locale: string;
  partner: string | null;
  query: string;
  onQuery: (query: string) => void;
  category: string;
  onCategory: (category: string) => void;
  avoid: readonly string[];
  onAvoid: (avoid: readonly string[]) => void;
  inquiry: readonly string[];
  onInquiry: (skus: readonly string[]) => void;
  onOpen: (sku: string) => void;
}) {
  const categories = useMemo(storeCategories, []);
  const results = useMemo(
    () =>
      searchCatalog(query).filter((product) => category === '' || product.category === category),
    [query, category],
  );
  const prompt = translate('store.prompt', locale, {
    count: String(storeCatalog.length),
  });

  return (
    <section className="store" aria-labelledby="store-prompt">
      <h1 className="guide-title" id="store-prompt">
        {translate('guide.card.store.title', locale)}
      </h1>
      <p className="lead">{prompt}</p>
      <p className="fine">{translate('store.help', locale)}</p>
      <ReadAloud
        text={prompt}
        locale={locale}
        fallback={spokenFallback(locale, (spoken) =>
          translate('store.prompt', spoken, {
            count: String(storeCatalog.length),
          }),
        )}
      />

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

      <InquiryCard
        locale={locale}
        partner={partner}
        inquiry={inquiry}
        onInquiry={onInquiry}
        onOpen={onOpen}
      />

      <AvoidPicker locale={locale} avoid={avoid} onAvoid={onAvoid} />

      <p className="store__count" aria-live="polite">
        {translate('store.resultCount', locale, {
          count: String(results.length),
        })}
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
                  <ProductPhoto product={item} locale={locale} className="store-item__photo" />
                  <span className="store-item__brand">{item.brand}</span>
                  <span className="store-item__name">{primaryName(item, locale)}</span>
                  {secondary ? <span className="store-item__alt">{secondary}</span> : null}
                  <span className="store-item__tags">
                    <span className="tag">{categoryLabel(item.category, locale)}</span>
                    <SourceTag product={item} locale={locale} />
                    {hits > 0 ? (
                      <span className="tag tag--blocker">
                        ⚠{' '}
                        {translate('store.avoidHitsBadge', locale, {
                          count: String(hits),
                        })}
                      </span>
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <ShopQr locale={locale} partner={partner} />
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
  inquiry,
  onInquiry,
  onBack,
  onOpenIngredient,
  onOpenProduct,
}: {
  product: StoreProduct;
  locale: string;
  partner: string | null;
  avoid: readonly string[];
  inquiry: readonly string[];
  onInquiry: (skus: readonly string[]) => void;
  onBack: () => void;
  onOpenIngredient: (id: string) => void;
  onOpenProduct: (sku: string) => void;
}) {
  const dictIds = dictionaryIdsOn(product);
  const entries = readLabel(product);
  const total = entries.length;
  const readable = hasReadableList(product);
  const hits = avoidHits(product, avoid);
  const secondary = secondaryName(product, locale);

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

      <ProductPhoto product={product} locale={locale} className="store-product__photo" />

      {dictIds.length > 0 ? (
        <section className="card">
          <h3 className="store-labels__title">{translate('dict.onLabel', locale)}</h3>
          <div className="chips">
            {dictIds.map((id) => {
              const entry = companyDictionary.ingredients.find((item) => item.id === id);
              return entry ? (
                <button
                  key={id}
                  type="button"
                  className="store__cat"
                  onClick={() => onOpenIngredient(id)}
                >
                  {companyDictionary.groups[entry.group]?.icon} {pick(entry.name, locale)}
                </button>
              ) : null;
            })}
          </div>
        </section>
      ) : null}

      <ProductFit product={product} locale={locale} />
      <ProductUsage product={product} locale={locale} />
      <ProductPairing product={product} locale={locale} onOpenProduct={onOpenProduct} />

      <h2 className="guide-subtitle">{translate('store.labelSection', locale)}</h2>
      <LabelPhotos product={product} locale={locale} />

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

      {readable ? (
        <CompareLabels product={product} locale={locale} onOpenProduct={onOpenProduct} />
      ) : null}

      <button
        type="button"
        className={`btn ${inquiry.includes(product.sku) ? 'btn--quiet' : ''} store-inquiry__toggle`}
        aria-pressed={inquiry.includes(product.sku)}
        onClick={() => onInquiry(toggleInquiry(inquiry, product.sku))}
      >
        {inquiry.includes(product.sku)
          ? `✓ ${translate('store.inquiry.added', locale)}`
          : `📝 ${translate('store.inquiry.add', locale)}`}
      </button>
      <ShareLink sku={product.sku} partner={partner} locale={locale} />
      <p className="record-block__note">{translate('store.noCommerce', locale)}</p>
    </section>
  );
}

/** What two labels print, side by side — no score, no ranking, no "better". */
function CompareLabels({
  product,
  locale,
  onOpenProduct,
}: {
  product: StoreProduct;
  locale: string;
  onOpenProduct: (sku: string) => void;
}) {
  const [otherSku, setOtherSku] = useState('');
  const choices = useMemo(
    () =>
      storeCatalog
        .filter((item) => item.sku !== product.sku && hasReadableList(item))
        .sort(
          (a, b) =>
            Number(b.category === product.category) - Number(a.category === product.category),
        ),
    [product],
  );
  const other = otherSku ? findProduct(otherSku) : undefined;
  const result = other ? compareLabels(product, other) : null;
  const otherName = other ? productName(other, locale) : '';
  const id = `compare-${product.sku}`;

  return (
    <section className="card store-compare">
      <h3 className="store-labels__title">⇄ {translate('store.compare.title', locale)}</h3>
      <label className="settings__label" htmlFor={id}>
        {translate('store.compare.pick', locale)}
      </label>
      <select
        id={id}
        className="field"
        value={otherSku}
        onChange={(event) => setOtherSku(event.target.value)}
      >
        <option value="">{translate('store.compare.none', locale)}</option>
        {choices.map((item) => (
          <option key={item.sku} value={item.sku}>
            {item.brand} · {productName(item, locale)}
          </option>
        ))}
      </select>
      {other && result ? (
        <>
          <p className="fine">{translate('store.compare.note', locale)}</p>
          {comparisonIsPartial(product, other) ? (
            <p className="disclosure disclosure--caution">
              <span className="disclosure__mark">!</span>
              <span>{translate('store.compare.partial', locale)}</span>
            </p>
          ) : null}
          <div className="store-compare__cols">
            {(
              [
                [
                  'both',
                  translate('store.compare.both', locale, {
                    count: String(result.both.length),
                  }),
                  result.both,
                ],
                [
                  'this',
                  translate('store.compare.onlyThis', locale, {
                    count: String(result.onlyA.length),
                  }),
                  result.onlyA,
                ],
                [
                  'other',
                  translate('store.compare.onlyOther', locale, {
                    name: otherName,
                    count: String(result.onlyB.length),
                  }),
                  result.onlyB,
                ],
              ] as const
            ).map(([key, title, names]) => (
              <details
                key={key}
                className={`store-compare__col store-compare__col--${key}`}
                open={key === 'both'}
              >
                <summary className="store-compare__head">{title}</summary>
                <ul className="store-compare__list">
                  {names.map((name) => {
                    const id = ingredientIdForPrinted(name);
                    const record = id ? findIngredient(id) : undefined;
                    return (
                      <li key={name}>
                        <span lang="ko">{name}</span>
                        {record ? (
                          <span className="store-inci__en" lang="en">
                            {' '}
                            {record.Ingredient_Name}
                          </span>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </details>
            ))}
          </div>
          <button type="button" className="btn btn--quiet" onClick={() => onOpenProduct(other.sku)}>
            {translate('store.compare.open', locale, { name: otherName })}
          </button>
        </>
      ) : null}
    </section>
  );
}

/**
 * The reader's own "ask the shop" list. It assembles a message — product names and codes and a
 * link back here with the shop's code — that the reader copies or shares themselves. No price,
 * no quantity, nothing leaves the phone until the reader sends it.
 */
function InquiryCard({
  locale,
  partner,
  inquiry,
  onInquiry,
  onOpen,
}: {
  locale: string;
  partner: string | null;
  inquiry: readonly string[];
  onInquiry: (skus: readonly string[]) => void;
  onOpen: (sku: string) => void;
}) {
  const [state, setState] = useState<'idle' | 'copied' | 'manual'>('idle');
  if (inquiry.length === 0) return null;
  const products = inquiry
    .map((sku) => findProduct(sku))
    .filter((item): item is StoreProduct => !!item);
  const link =
    partner === null ? appBase() : `${appBase()}?${PARTNER_PARAM}=${encodeURIComponent(partner)}`;
  const message = inquiryMessage(
    translate('store.inquiry.messageHead', locale),
    products.map((item) => ({
      name: `${item.brand} ${productName(item, locale)}`,
      sku: item.sku,
    })),
    link,
  );
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setState('copied');
    } catch {
      setState('manual');
    }
  };
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  const share = async () => {
    try {
      await navigator.share({ text: message });
    } catch {
      // The reader closed the share sheet; nothing to do.
    }
  };

  return (
    <section className="card store-inquiry" aria-labelledby="store-inquiry-title">
      <h2 className="store-labels__title" id="store-inquiry-title">
        📝{' '}
        {translate('store.inquiry.title', locale, {
          count: String(products.length),
        })}
      </h2>
      <p className="store-labels__intro">{translate('store.inquiry.intro', locale)}</p>
      <ul className="store-inquiry__list" role="list">
        {products.map((item) => (
          <li key={item.sku} className="store-inquiry__row">
            <button type="button" className="store-inquiry__name" onClick={() => onOpen(item.sku)}>
              <ProductPhoto product={item} locale={locale} className="store-inquiry__photo" />
              <span>
                {item.brand} · {productName(item, locale)}
              </span>
            </button>
            <button
              type="button"
              className="btn btn--quiet btn--small"
              onClick={() => onInquiry(toggleInquiry(inquiry, item.sku))}
            >
              {translate('store.inquiry.remove', locale)}
            </button>
          </li>
        ))}
      </ul>
      <div className="store-share">
        {canShare ? (
          <button type="button" className="btn" onClick={share}>
            📤 {translate('store.inquiry.share', locale)}
          </button>
        ) : null}
        <button type="button" className="btn btn--quiet" onClick={copy}>
          📋 {translate('store.inquiry.copy', locale)}
        </button>
        <a
          className="btn btn--quiet"
          href={`https://wa.me/?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          {translate('store.inquiry.whatsapp', locale)}
        </a>
        <button type="button" className="btn btn--quiet btn--small" onClick={() => onInquiry([])}>
          {translate('store.inquiry.clear', locale)}
        </button>
      </div>
      {state === 'copied' ? (
        <p className="store-share__done" role="status">
          ✓ {translate('store.inquiry.copied', locale)}
        </p>
      ) : null}
      {state === 'manual' ? <pre className="store-share__link">{message}</pre> : null}
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
      {showQr ? (
        <QrCard
          link={link}
          fileName={`KOREA-GLOW-${sku}${partner ? `-${partner}` : ''}`}
          label={translate('store.qrAlt', locale)}
          caption={
            partner
              ? translate('store.qrPartner', locale, { code: partner })
              : translate('store.qrNoPartner', locale)
          }
          locale={locale}
        />
      ) : null}
    </div>
  );
}

/** The address the app is served from, so a QR made here opens this same app. */
const appBase = (): string =>
  typeof window === 'undefined' ? '/' : `${window.location.origin}${window.location.pathname}`;

/**
 * A partner shop's own QR code, for the counter: it opens the app's front door with the shop's
 * code attached (`?p=CODE`). Making one changes nothing on this device — the remembered shop
 * code is still only ever set by opening a shop's link.
 */
function ShopQr({ locale, partner }: { locale: string; partner: string | null }) {
  const [raw, setRaw] = useState(partner ?? '');
  const code = normalizePartnerCode(raw);
  return (
    <details className="store-avoid store-shopqr">
      <summary className="store-avoid__summary">▦ {translate('store.shopQrTitle', locale)}</summary>
      <p className="store-avoid__intro">{translate('store.shopQrIntro', locale)}</p>
      <label className="settings__label" htmlFor="shop-qr-code">
        {translate('store.shopQrLabel', locale)}
      </label>
      <input
        id="shop-qr-code"
        className="field"
        type="text"
        autoCapitalize="characters"
        autoComplete="off"
        spellCheck={false}
        value={raw}
        placeholder="VTE-01"
        onChange={(event) => setRaw(event.target.value)}
      />
      {code ? (
        <QrCard
          link={shopLink(appBase(), code)!}
          fileName={`KOREA-GLOW-SHOP-${code}`}
          label={translate('store.shopQrAlt', locale, { code })}
          caption={translate('store.qrPartner', locale, { code })}
          locale={locale}
        />
      ) : raw.trim() !== '' ? (
        <p className="store-avoid__intro" role="status">
          {translate('store.shopQrInvalid', locale)}
        </p>
      ) : null}
    </details>
  );
}

/** A sentence from the master in the reader's language, or the Korean original, marked. */
function Sentence({ text, locale }: { text: string; locale: string }) {
  const { text: shown, korean } = translateSentence(text, locale);
  return (
    <p className="store-ko" lang={korean ? 'ko' : locale}>
      {shown}
      {korean ? <span className="fine"> ({translate('store.koreanOnly', locale)})</span> : null}
    </p>
  );
}

/** Label text (directions, cautions) is printed in Korean; it stays Korean and says so. */
function LabelText({ text, locale }: { text: string; locale: string }) {
  return (
    <>
      {locale === 'ko' ? null : <p className="fine">{translate('store.koreanOnly', locale)}</p>}
      <p className="store-ko" lang="ko">
        {text}
      </p>
    </>
  );
}

const SKU_IN_TEXT = /KG-[A-Z]{3}-\d{5}/g;

/** "• reason\n   → product(SKU)、product(SKU)" blocks, as reasons with the products they name. */
function parsePairing(text: string): { reason: string; skus: string[] }[] {
  const blocks: { reason: string; skus: string[] }[] = [];
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (line.startsWith('•')) blocks.push({ reason: line.replace(/^•\s*/, ''), skus: [] });
    else if (line.startsWith('→') && blocks.length > 0)
      blocks[blocks.length - 1]!.skus.push(...(line.match(SKU_IN_TEXT) ?? []));
    else if (line) blocks.push({ reason: line, skus: [] });
  }
  return blocks;
}

function ProductFit({ product, locale }: { product: StoreProduct; locale: string }) {
  const fit = product.fit;
  if (!fit || fit.skin.length + fit.age.length + fit.concerns.length === 0) return null;
  const rows: readonly [MessageKey, string, readonly string[]][] = [
    ['store.fit.skin', 'skin', fit.skin],
    ['store.fit.age', 'age', fit.age],
    ['store.fit.concerns', 'concern', fit.concerns],
  ];
  return (
    <section className="card store-fit">
      <h3 className="store-labels__title">{translate('store.fitTitle', locale)}</h3>
      <dl className="store-fit__rows">
        {rows
          .filter(([, , keys]) => keys.length > 0)
          .map(([title, prefix, keys]) => (
            <div key={title} className="store-fit__row">
              <dt>{translate(title, locale)}</dt>
              <dd className="chips">
                {keys.map((key) => (
                  <span key={key} className="chip chip--soft">
                    {translate(`${prefix}.${key}` as MessageKey, locale)}
                  </span>
                ))}
              </dd>
            </div>
          ))}
      </dl>
      <p className="claim-flag">
        <span className="claim-flag__mark" aria-hidden="true">
          !
        </span>
        {translate('store.fitNote', locale, {
          basis: fit.basis ? translateSentence(fit.basis, locale).text : '—',
        })}
      </p>
    </section>
  );
}

function ProductUsage({ product, locale }: { product: StoreProduct; locale: string }) {
  const usage = product.usage;
  if (!usage) return null;
  const times: readonly [MessageKey, string, string | null][] = [
    ['store.usage.am', '☀️', usage.am],
    ['store.usage.day', '🌤️', usage.day],
    ['store.usage.pm', '🌙', usage.pm],
  ];
  const seasons: readonly [MessageKey, string, string | null][] = [
    ['store.season.dry', '🍃', usage.drySeason],
    ['store.season.hot', '🔥', usage.hotSeason],
    ['store.season.rainy', '🌧️', usage.rainySeason],
  ];
  const anyTime = times.some(([, , text]) => text);
  const anySeason = seasons.some(([, , text]) => text);
  if (!anyTime && !anySeason && !usage.howTo) return null;
  return (
    <section className="card store-usage">
      <h3 className="store-labels__title">{translate('store.usageTitle', locale)}</h3>
      {anyTime ? (
        <ul className="store-usage__list" role="list">
          {times
            .filter(([, , text]) => text)
            .map(([key, icon, text]) => (
              <li key={key} className="store-usage__item">
                <span className="store-usage__when">
                  {icon} {translate(key, locale)}
                </span>
                <Sentence text={text!} locale={locale} />
              </li>
            ))}
        </ul>
      ) : null}
      {anySeason ? (
        <>
          <h4 className="store-usage__sub">{translate('store.seasonsTitle', locale)}</h4>
          <ul className="store-usage__list" role="list">
            {seasons
              .filter(([, , text]) => text)
              .map(([key, icon, text]) => (
                <li key={key} className="store-usage__item">
                  <span className="store-usage__when">
                    {icon} {translate(key, locale)}
                  </span>
                  <Sentence text={text!} locale={locale} />
                </li>
              ))}
          </ul>
        </>
      ) : null}
      {usage.howTo ? (
        <details className="store-usage__more">
          <summary>{translate('store.howTo', locale)}</summary>
          <LabelText text={usage.howTo} locale={locale} />
        </details>
      ) : null}
      {usage.caution ? (
        <details className="store-usage__more">
          <summary>{translate('store.cautionLabel', locale)}</summary>
          <LabelText text={usage.caution} locale={locale} />
        </details>
      ) : null}
    </section>
  );
}

function ProductPairing({
  product,
  locale,
  onOpenProduct,
}: {
  product: StoreProduct;
  locale: string;
  onOpenProduct: (sku: string) => void;
}) {
  const pairing = product.pairing;
  if (!pairing || (!pairing.good && !pairing.avoid)) return null;
  const section = (title: MessageKey, text: string) => (
    <>
      <h3 className="store-labels__title">{translate(title, locale)}</h3>
      {parsePairing(text).map((block, index) => {
        const products = block.skus
          .map((sku) => findProduct(sku))
          .filter((item): item is StoreProduct => !!item && item.sku !== product.sku);
        return (
          <div key={index} className="store-pair">
            <Sentence text={block.reason} locale={locale} />
            {products.length > 0 ? (
              <ProductStrip products={products} locale={locale} onOpen={onOpenProduct} />
            ) : null}
          </div>
        );
      })}
    </>
  );
  return (
    <section className="card store-usage">
      {pairing.good ? section('store.pairGood', pairing.good) : null}
      {pairing.avoid ? section('store.pairAvoid', pairing.avoid) : null}
      {pairing.basis ? (
        <div className="fine">
          <Sentence text={pairing.basis} locale={locale} />
        </div>
      ) : null}
    </section>
  );
}

/** The real back label, photographed — what the printed list below was read from. */
function LabelPhotos({ product, locale }: { product: StoreProduct; locale: string }) {
  const photos = LABEL_GALLERY[product.sku] ?? [];
  if (photos.length === 0) return null;
  const name = productName(product, locale);
  return (
    <section className="card">
      <h3 className="store-labels__title">{translate('store.labelPhotos', locale)}</h3>
      <p className="store-labels__intro">{translate('store.labelPhotosIntro', locale)}</p>
      <ul className="label-gallery" role="list">
        {photos.map((src, index) => (
          <li key={src}>
            <a className="label-gallery__item" href={src} target="_blank" rel="noreferrer">
              <img
                src={src}
                alt={translate('store.labelPhotoAlt', locale, {
                  name,
                  n: String(index + 1),
                })}
                loading="lazy"
                decoding="async"
              />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
