/**
 * A product as a picture first: photo, brand, name in the reader's language. Used wherever the
 * app points at products — the guide, the dictionary, the category pages, the shop list.
 */
import { translate } from '@/localization/messages';
import { nameWithoutBrand, type StoreProduct } from '@/content/store-catalog-types';

/** The name a reader in this language is most likely to recognise first. */
export const productName = (product: StoreProduct, locale: string): string => {
  if (locale === 'ko') return nameWithoutBrand(product);
  if (locale === 'lo' && product.names.lo) return product.names.lo;
  if (locale === 'th' && product.names.th) return product.names.th;
  if (locale === 'fr' && product.names.fr) return product.names.fr;
  return product.nameEn ?? nameWithoutBrand(product);
};

export function ProductPhoto({
  product,
  locale,
  className = 'product-photo',
}: {
  product: StoreProduct;
  locale: string;
  className?: string;
}) {
  const name = productName(product, locale);
  return product.photo ? (
    <img
      className={className}
      src={product.photo}
      alt={translate('store.photoAlt', locale, { name })}
      loading="lazy"
      decoding="async"
    />
  ) : (
    <span className={`${className} ${className}--empty`} aria-hidden="true">
      {product.brand.slice(0, 1)}
    </span>
  );
}

export function ProductCard({
  product,
  locale,
  onOpen,
}: {
  product: StoreProduct;
  locale: string;
  onOpen: (sku: string) => void;
}) {
  return (
    <button type="button" className="product-card" onClick={() => onOpen(product.sku)}>
      <ProductPhoto product={product} locale={locale} />
      <span className="product-card__brand">{product.brand}</span>
      <span className="product-card__name">{productName(product, locale)}</span>
    </button>
  );
}

export function ProductStrip({
  products,
  locale,
  onOpen,
}: {
  products: readonly StoreProduct[];
  locale: string;
  onOpen: (sku: string) => void;
}) {
  return (
    <ul className="product-strip" role="list">
      {products.map((product) => (
        <li key={product.sku}>
          <ProductCard product={product} locale={locale} onOpen={onOpen} />
        </li>
      ))}
    </ul>
  );
}
