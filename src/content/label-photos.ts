/**
 * Real ingredient-label photographs — four Korean cosmetic products the owner is sourcing to
 * sell in Laos, photographed by hand.
 *
 * This module states nothing about what an ingredient does. It only records a fact a reader
 * can check against the photo itself: which `Ingredient_ID` from 06_INGREDIENTS is printed in
 * that product's declared-ingredients list (표시성분 / 전성분), transcribed directly from each
 * label. No efficacy, safety or regulatory claim is attached here — those stay in governed
 * knowledge/evidence data (CLAUDE.md rule 8), and this corpus has none Approved+Verified yet
 * (rule 2). A photo is evidence that an ingredient exists on a real shelf, not evidence of what
 * it does.
 *
 * Product names are the Korean label's own naming (SPF rating included, since that is also
 * printed fact, not a claim this app makes), not marketing copy — this app is a learning
 * platform, not a storefront.
 */
export interface LabelPhoto {
  readonly id: string;
  readonly productName: string;
  /** The declared-ingredients section this was transcribed from, as printed on the box. */
  readonly labelSection: '표시성분' | '전성분';
  readonly src: string;
  readonly thumbSrc: string;
  /** Ingredient_IDs (06_INGREDIENTS) printed in that section of this label, verified by eye. */
  readonly ingredientIds: readonly string[];
}

export const labelPhotos: readonly LabelPhoto[] = [
  {
    id: 'label-sun-essence',
    productName: '본셉 비타씨 선 에센스 SPF50+ PA++++',
    labelSection: '표시성분',
    src: '/products/label-sun-essence.jpg',
    thumbSrc: '/products/label-sun-essence-thumb.jpg',
    ingredientIds: ['ING-007', 'ING-008', 'ING-009', 'ING-039'],
  },
  {
    id: 'label-vitaminc-ampoule-kit',
    productName: '본셉 비타씨 동결건조 더블샷 앰플 키트',
    labelSection: '표시성분',
    src: '/products/label-vitaminc-ampoule-kit.jpg',
    thumbSrc: '/products/label-vitaminc-ampoule-kit-thumb.jpg',
    ingredientIds: ['ING-007', 'ING-008', 'ING-010', 'ING-024'],
  },
  {
    id: 'label-tone-filter-sun-cream',
    productName: '에딧비 베어버니 톤 필터 선크림 SPF50+ PA++++',
    labelSection: '표시성분',
    src: '/products/label-tone-filter-sun-cream.jpg',
    thumbSrc: '/products/label-tone-filter-sun-cream-thumb.jpg',
    ingredientIds: ['ING-007', 'ING-028', 'ING-039'],
  },
  {
    id: 'label-madeca-cream',
    productName: '센텔리안24 마데카 크림 타임 리버스',
    labelSection: '전성분',
    src: '/products/label-madeca-cream.jpg',
    thumbSrc: '/products/label-madeca-cream-thumb.jpg',
    ingredientIds: ['ING-001', 'ING-007', 'ING-010', 'ING-011', 'ING-012', 'ING-022', 'ING-024'],
  },
];

export const labelPhotosForIngredient = (ingredientId: string): readonly LabelPhoto[] =>
  labelPhotos.filter((photo) => photo.ingredientIds.includes(ingredientId));
