/**
 * The shop's catalog and its label reader. The catalog is generated from the owner's ingredient
 * master; these tests hold the line on what it may contain (printed facts, no commerce fields),
 * on the printed-name → ingredient mapping (exact names only, every target real), and on the
 * reader's promises: positions are printed places, an avoid hit is a printed name, and nothing
 * claims a product is free of anything.
 */
import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { LABEL_GALLERY } from '@/content/label-gallery';
import { storeCatalog } from '@/content/store-catalog';
import { PRINTED_NAME_TO_INGREDIENT, ingredientIdForPrinted } from '@/content/inci-names';
import { findIngredient } from '@/knowledge/ingredients';
import {
  INQUIRY_LIMIT,
  avoidHits,
  compareLabels,
  comparisonIsPartial,
  findProduct,
  inquiryMessage,
  loadInquiryList,
  toggleInquiry,
  hasReadableList,
  ingredientsOnSale,
  loadAvoidList,
  productFromSearch,
  productLink,
  readLabel,
  searchCatalog,
  storeCategories,
} from '@/app/store-catalog';
import { translate, type MessageKey } from '@/localization/messages';

const ALLOWED_FIELDS = [
  'sku',
  'category',
  'brand',
  'nameKo',
  'nameEn',
  'size',
  'source',
  'inci',
  'inciGapAfter',
  'inciTruncated',
  'names',
  'photo',
  'fit',
  'usage',
  'pairing',
].sort();

describe('store catalog', () => {
  it('holds the 92 products the shop sells today, each once', () => {
    expect(storeCatalog).toHaveLength(92);
    const skus = storeCatalog.map((product) => product.sku);
    expect(new Set(skus).size).toBe(skus.length);
    for (const sku of skus) expect(sku).toMatch(/^KG-[A-Z]{3}-\d{5}$/);
  });

  it('carries printed facts only — no price, cost, supplier or AI-written field', () => {
    for (const product of storeCatalog) {
      expect(Object.keys(product).sort(), product.sku).toEqual(ALLOWED_FIELDS);
    }
    const text = JSON.stringify(storeCatalog);
    for (const word of [
      '₭',
      '원가',
      '공급가',
      '판매가',
      '수수료',
      '마진',
      '거래처',
      'price',
      'LAK',
      'KRW',
    ]) {
      expect(text.includes(word), word).toBe(false);
    }
  });

  it('has an ingredient list exactly when the master says one was read', () => {
    for (const product of storeCatalog) {
      const readable =
        product.source === 'LABEL_CHECKED' || product.source === 'SUPPLIER_TEXT_UNCHECKED';
      expect(product.inci.length > 0, product.sku).toBe(readable);
      expect(hasReadableList(product)).toBe(readable);
      if (product.inciGapAfter !== null) expect(product.inciTruncated, product.sku).toBe(true);
    }
  });

  it('names every category in all five languages', () => {
    for (const category of storeCategories()) {
      for (const locale of ['en', 'ko', 'fr', 'lo', 'th']) {
        const key = `store.category.${category}` as MessageKey;
        expect(translate(key, locale), `${locale} ${category}`).not.toBe(key);
      }
      expect(translate(`store.category.${category}` as MessageKey, 'ko')).toBe(category);
    }
  });
});

describe('photos and profiles', () => {
  it('points every photo at a file that ships', () => {
    for (const product of storeCatalog) {
      if (!product.photo) continue;
      expect(existsSync(new URL(`../public${product.photo}`, import.meta.url)), product.sku).toBe(
        true,
      );
    }
    expect(storeCatalog.filter((p) => p.photo).length).toBe(storeCatalog.length);
  });

  it('points every back-label photo at a catalog SKU and a file that ships', () => {
    const skus = new Set(storeCatalog.map((p) => p.sku));
    for (const [sku, photos] of Object.entries(LABEL_GALLERY)) {
      expect(skus.has(sku), sku).toBe(true);
      expect(photos.length, sku).toBeGreaterThan(0);
      for (const photo of photos) {
        expect(photo, sku).toMatch(/^\/products\/labels\/.+\.jpg$/);
        expect(existsSync(new URL(`../public${photo}`, import.meta.url)), photo).toBe(true);
      }
    }
    expect(Object.keys(LABEL_GALLERY).length).toBeGreaterThanOrEqual(60);
  });

  it('uses only the known skin, age and concern keys', () => {
    for (const product of storeCatalog) {
      if (!product.fit) continue;
      for (const k of product.fit.skin)
        expect(['dry', 'oily', 'combination', 'sensitive']).toContain(k);
      for (const k of product.fit.age) expect(['20s', '30s', '40plus']).toContain(k);
      for (const k of product.fit.concerns)
        expect([
          'tone',
          'soothing',
          'hydration',
          'barrier',
          'firmness',
          'pores',
          'uv',
          'scalp',
          'nourish',
          'cleansing',
        ]).toContain(k);
    }
  });

  it('keeps Lao names in Lao script', () => {
    for (const product of storeCatalog) {
      if (product.names.lo) expect(product.names.lo, product.sku).toMatch(/[\u0E80-\u0EFF]/);
    }
  });
});

describe('printed name → ingredient record', () => {
  it('points only at records that exist', () => {
    for (const [printed, id] of Object.entries(PRINTED_NAME_TO_INGREDIENT)) {
      expect(findIngredient(id), `${printed} → ${id}`).toBeDefined();
    }
  });

  it('never takes a relative, salt, ester or look-alike for the record', () => {
    for (const name of [
      '에탄올',
      '병풀잎추출물',
      '토코페릴아세테이트',
      '치오글라이콜릭애씨드',
      '베타인살리실레이트',
      '하이드롤라이즈드하이알루로닉애씨드',
      '에틸헥실글리세린',
      '에틸리날룰',
    ]) {
      expect(ingredientIdForPrinted(name), name).toBeNull();
    }
  });

  it('keeps a printed concentration or transcriber mark out of the match', () => {
    expect(ingredientIdForPrinted('글라이콜릭애씨드(420ppm)')).toBe('ING-014');
    expect(ingredientIdForPrinted('나이아신아마이드[?]')).toBe('ING-007');
    expect(ingredientIdForPrinted('아스코빅애씨드 <ILN50755>')).toBe('ING-008');
  });

  it('finds dictionary records on the shelf', () => {
    const onSale = ingredientsOnSale();
    expect(onSale).toContain('ING-001');
    expect(onSale).toContain('ING-035');
    for (const id of onSale) expect(findIngredient(id)).toBeDefined();
  });
});

describe('label reader', () => {
  it('numbers a complete list 1..n in printed order', () => {
    for (const product of storeCatalog.filter((p) => p.inciGapAfter === null)) {
      const entries = readLabel(product);
      entries.forEach((entry, index) => expect(entry.position).toBe(index + 1));
      expect(entries.map((entry) => entry.printed)).toEqual(product.inci);
    }
  });

  it('admits that places after a gap are unknown', () => {
    const gapped = storeCatalog.filter((p) => p.inciGapAfter !== null);
    expect(gapped.length).toBeGreaterThan(0);
    for (const product of gapped) {
      const entries = readLabel(product);
      expect(entries[product.inciGapAfter!]!.position).toBeNull();
      if (product.inciGapAfter! > 0)
        expect(entries[product.inciGapAfter! - 1]!.position).not.toBeNull();
    }
  });

  it('reports an avoided ingredient only where its name is printed', () => {
    for (const product of storeCatalog) {
      const hits = avoidHits(product, ['ING-035']);
      expect(hits.length > 0, product.sku).toBe(
        product.inci.some((printed) => ingredientIdForPrinted(printed) === 'ING-035'),
      );
    }
    const accessory = storeCatalog.find((p) => p.source === 'NOT_APPLICABLE')!;
    expect(avoidHits(accessory, ['ING-035'])).toEqual([]);
  });

  it('searches names, brands and ingredients, in Korean or English', () => {
    expect(searchCatalog('')).toHaveLength(92);
    const byEnglish = searchCatalog('niacinamide');
    const byKorean = searchCatalog('나이아신아마이드');
    expect(byEnglish.length).toBeGreaterThan(0);
    // Korean also matches inside unmapped entries ("2제: 나이아신아마이드"), so it finds at least as many.
    for (const product of byEnglish) expect(byKorean).toContain(product);
    expect(searchCatalog('dr.g').every((p) => /dr\.?\s*g/i.test(p.brand + p.nameKo))).toBe(true);
    expect(searchCatalog('zzzz-nothing')).toEqual([]);
  });
});

describe('avoid list and links', () => {
  it('keeps only real ingredient ids from storage, and survives garbage', () => {
    const store = (value: string | null) => ({ getItem: () => value });
    expect(loadAvoidList(store('["ING-035","ING-999",4]'))).toEqual(['ING-035']);
    expect(loadAvoidList(store('{not json'))).toEqual([]);
    expect(loadAvoidList(store(null))).toEqual([]);
    expect(loadAvoidList(undefined)).toEqual([]);
  });

  it('opens a product only for a well-formed SKU the shop sells', () => {
    const sku = storeCatalog[0]!.sku;
    expect(productFromSearch(`?product=${sku}`)).toBe(sku);
    expect(productFromSearch(`?product=${sku.toLowerCase()}`)).toBe(sku);
    expect(productFromSearch('?product=KG-XXX-99999')).toBeNull();
    expect(productFromSearch('?product=<script>')).toBeNull();
    expect(productFromSearch('')).toBeNull();
    expect(findProduct(sku)).toBeDefined();
  });

  it('carries the partner code on the link it hands out', () => {
    expect(productLink('https://x.test/', 'KG-CRM-00003', 'VTE-01')).toBe(
      'https://x.test/?product=KG-CRM-00003&p=VTE-01',
    );
    expect(productLink('/', 'KG-CRM-00003', null)).toBe('/?product=KG-CRM-00003');
  });
});

describe('comparing two labels', () => {
  const readable = storeCatalog.filter(hasReadableList);
  const [a, b] = [readable[0]!, readable[1]!];

  it('splits every printed name into exactly one of both / only A / only B', () => {
    const result = compareLabels(a, b);
    expect(result.both.length + result.onlyA.length).toBeLessThanOrEqual(a.inci.length);
    for (const name of result.onlyA) expect(a.inci).toContain(name);
    for (const name of result.onlyB) expect(b.inci).toContain(name);
    for (const name of result.both) expect(a.inci).toContain(name);
  });

  it('finds everything in common when a product is compared with itself', () => {
    const result = compareLabels(a, a);
    expect(result.onlyA).toEqual([]);
    expect(result.onlyB).toEqual([]);
    expect(result.both.length).toBeGreaterThan(0);
  });

  it('warns when either list is incomplete or unchecked', () => {
    const unchecked = readable.find((p) => p.source === 'SUPPLIER_TEXT_UNCHECKED');
    if (unchecked) expect(comparisonIsPartial(a, unchecked)).toBe(true);
  });
});

describe('the questions list', () => {
  const skus = storeCatalog.map((p) => p.sku);
  const store = (value: unknown) => ({ getItem: () => JSON.stringify(value) });

  it('keeps only real product codes, once each, up to the limit', () => {
    expect(loadInquiryList(store(['KG-XXX-00000', skus[0], skus[0], 7]))).toEqual([skus[0]]);
    expect(loadInquiryList(store(skus)).length).toBe(INQUIRY_LIMIT);
    expect(loadInquiryList({ getItem: () => 'not json' })).toEqual([]);
  });

  it('adds and removes with one toggle and never goes past the limit', () => {
    const one = toggleInquiry([], skus[0]!);
    expect(one).toEqual([skus[0]]);
    expect(toggleInquiry(one, skus[0]!)).toEqual([]);
    const full = skus.slice(0, INQUIRY_LIMIT);
    expect(toggleInquiry(full, skus[INQUIRY_LIMIT]!)).toEqual(full);
    expect(toggleInquiry([], 'KG-XXX-00000')).toEqual([]);
  });

  it('writes a message with names, codes and the link, and nothing like a price', () => {
    const product = findProduct(skus[0]!)!;
    const text = inquiryMessage(
      translate('store.inquiry.messageHead', 'lo'),
      [{ name: product.nameKo, sku: product.sku }],
      'https://app.korea-glow.com/?p=VTE-01',
    );
    expect(text).toContain(product.sku);
    expect(text).toContain('?p=VTE-01');
    expect(text).not.toMatch(/\$|₭|kip|USD|LAK|THB|price|가격|ລາຄາ|ราคา/i);
  });
});

describe('the "how this app works" page', () => {
  const keys = [1, 2, 3, 4, 5, 6, 7].flatMap((n) => [`about.p${n}.title`, `about.p${n}.body`]);

  it('is written in every catalog, in the right script', () => {
    for (const key of keys) {
      expect(translate(key as MessageKey, 'lo'), key).toMatch(/[\u0E80-\u0EFF]/);
      expect(translate(key as MessageKey, 'th'), key).toMatch(/[\u0E00-\u0E7F]/);
      expect(translate(key as MessageKey, 'ko'), key).toMatch(/[가-힣]/);
    }
  });
});

describe("the owner's scene photos", () => {
  it('ship every scene the guide hub points at', async () => {
    const source = (await import('node:fs')).readFileSync(
      new URL('../src/ui/screens/GuideHubScreen.tsx', import.meta.url),
      'utf8',
    );
    const scenes = [...source.matchAll(/'(\/scenes\/scene-\d+\.jpg)'/g)].map((m) => m[1]!);
    expect(scenes.length).toBeGreaterThanOrEqual(3);
    for (const scene of scenes) {
      expect(existsSync(new URL(`../public${scene}`, import.meta.url)), scene).toBe(true);
    }
  });
});
