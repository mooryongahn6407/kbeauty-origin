/**
 * Products KOREA GLOW sells today whose printed ingredient list names an acid from the AHA, BHA
 * or PHA families in 06_INGREDIENTS.
 *
 * Extracted from the owner's ingredient master (KOREA_GLOW_성분표_마스터_260930.xlsx, sheet
 * 제품_전체, rows with 상태 = 지금 판매). Only three things were taken: the product's name, the
 * ingredient as it is printed, and where in the printed list it sits. The master's own
 * "who is it for / season / pairing" columns are AI analysis awaiting expert review, so none of
 * that is here, and no price or supplier field ever was.
 *
 * `source` keeps the master's own honesty flag: LABEL_CHECKED means someone read the physical
 * label; SUPPLIER_TEXT_UNCHECKED means the list came from supplier or public text and the
 * physical label has not been compared yet. The screen shows the difference.
 *
 * Matching is by exact printed name, so 치오글라이콜릭애씨드 (a depilatory) is not glycolic acid
 * and 베타인살리실레이트 is not salicylic acid. A printed concentration such as (420ppm) is kept
 * verbatim. `position` is null when the source list was elided before that ingredient.
 */
export type LabelSource = 'LABEL_CHECKED' | 'SUPPLIER_TEXT_UNCHECKED';

export interface LabelMatch {
  /** Exactly as printed, including any printed concentration. */
  readonly printedName: string;
  /** 06_INGREDIENTS record this printed name belongs to. */
  readonly ingredientId: string;
  /** 1-based place in the printed list, or null when the list was elided before it. */
  readonly position: number | null;
}

export interface StoreProductLabel {
  readonly sku: string;
  readonly category: string;
  readonly brand: string;
  readonly name: string;
  readonly source: LabelSource;
  readonly inciCount: number;
  /** True when the master holds only part of the printed list. */
  readonly inciTruncated: boolean;
  readonly matches: readonly LabelMatch[];
}

export const storeProductLabels: readonly StoreProductLabel[] = [
  {
    sku: 'KG-CRM-00008',
    category: '크림',
    brand: 'Dr.G',
    name: '배리어 D 인텐스 크림',
    source: 'LABEL_CHECKED',
    inciCount: 63,
    inciTruncated: false,
    matches: [
      {
        printedName: '글루코노락톤',
        ingredientId: 'ING-017',
        position: 37,
      },
    ],
  },
  {
    sku: 'KG-SER-00032',
    category: '에센스·세럼·앰플',
    brand: '더마엘',
    name: '제로 포어 타이트닝 스피큘 세럼',
    source: 'LABEL_CHECKED',
    inciCount: 44,
    inciTruncated: false,
    matches: [
      {
        printedName: '글루코노락톤',
        ingredientId: 'ING-017',
        position: 18,
      },
      {
        printedName: '글라이콜릭애씨드',
        ingredientId: 'ING-014',
        position: 31,
      },
    ],
  },
  {
    sku: 'KG-TON-00008',
    category: '토너',
    brand: '푸드어홀릭',
    name: '아하바하파하(AHA·BHA·PHA) 리플레싱 카밍 세럼',
    source: 'SUPPLIER_TEXT_UNCHECKED',
    inciCount: 38,
    inciTruncated: false,
    matches: [
      {
        printedName: '글라이콜릭애씨드(420ppm)',
        ingredientId: 'ING-014',
        position: 19,
      },
      {
        printedName: '락틱애씨드(170ppm)',
        ingredientId: 'ING-015',
        position: 24,
      },
      {
        printedName: '살리실릭애씨드(100ppm)',
        ingredientId: 'ING-013',
        position: 25,
      },
      {
        printedName: '글루코노락톤(100ppm)',
        ingredientId: 'ING-017',
        position: 26,
      },
    ],
  },
  {
    sku: 'KG-CLN-00001',
    category: '클렌징',
    brand: '성분에디터',
    name: '그린토마토 딥 포어 클렌징폼',
    source: 'LABEL_CHECKED',
    inciCount: 56,
    inciTruncated: true,
    matches: [
      {
        printedName: '살리실릭애씨드',
        ingredientId: 'ING-013',
        position: null,
      },
    ],
  },
  {
    sku: 'KG-CLN-00002',
    category: '클렌징',
    brand: 'Dr.Jart+',
    name: '포어레미디 리뉴잉 폼 클렌저',
    source: 'LABEL_CHECKED',
    inciCount: 25,
    inciTruncated: false,
    matches: [
      {
        printedName: '글루코노락톤',
        ingredientId: 'ING-017',
        position: 22,
      },
    ],
  },
  {
    sku: 'KG-CLN-00006',
    category: '클렌징',
    brand: 'Cell Fusion C',
    name: '포어 썬 클렌징 폼',
    source: 'LABEL_CHECKED',
    inciCount: 26,
    inciTruncated: false,
    matches: [
      {
        printedName: '살리실릭애씨드',
        ingredientId: 'ING-013',
        position: 7,
      },
    ],
  },
  {
    sku: 'KG-HAR-00001',
    category: '헤어케어',
    brand: '미상코스메틱',
    name: '탈모샴푸 _ 스페이스 오션 300g',
    source: 'LABEL_CHECKED',
    inciCount: 24,
    inciTruncated: false,
    matches: [
      {
        printedName: '살리실릭애씨드',
        ingredientId: 'ING-013',
        position: 12,
      },
    ],
  },
  {
    sku: 'KG-HAR-00008',
    category: '헤어케어',
    brand: '모다모다',
    name: '블루비오틴 스칼프샴푸 300 ml',
    source: 'SUPPLIER_TEXT_UNCHECKED',
    inciCount: 33,
    inciTruncated: false,
    matches: [
      {
        printedName: '살리실릭애씨드',
        ingredientId: 'ING-013',
        position: 14,
      },
    ],
  },
  {
    sku: 'KG-HAR-00009',
    category: '헤어케어',
    brand: 'RGIII',
    name: '레드진생 스칼프 샴푸 300 ml',
    source: 'LABEL_CHECKED',
    inciCount: 43,
    inciTruncated: false,
    matches: [
      {
        printedName: '살리실릭애씨드',
        ingredientId: 'ING-013',
        position: 14,
      },
    ],
  },
  {
    sku: 'KG-HAR-00017',
    category: '헤어케어',
    brand: '애경',
    name: '케라시스 두피 클리닉 컨디셔너',
    source: 'LABEL_CHECKED',
    inciCount: 44,
    inciTruncated: false,
    matches: [
      {
        printedName: '락틱애씨드',
        ingredientId: 'ING-015',
        position: 29,
      },
    ],
  },
  {
    sku: 'KG-HAR-00021',
    category: '헤어케어',
    brand: '애경',
    name: '케라시스 린스(리필)',
    source: 'SUPPLIER_TEXT_UNCHECKED',
    inciCount: 19,
    inciTruncated: false,
    matches: [
      {
        printedName: '락틱애씨드',
        ingredientId: 'ING-015',
        position: 15,
      },
    ],
  },
];

/** Products whose label lists any of the given ingredient records. */
export const storeProductsListing = (
  ingredientIds: readonly string[],
): readonly StoreProductLabel[] =>
  storeProductLabels.filter((product) =>
    product.matches.some((match) => ingredientIds.includes(match.ingredientId)),
  );
