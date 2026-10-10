import { translate } from '@/localization/messages';

// Display-only translation of the function column's closed, small vocabulary (22 known values;
// see the matching catalog keys in messages.ts). The family name itself (already English/Latin,
// e.g. "Humectant") is never translated — only the Korean function word beside it.
export const FUNCTION_LABEL_KEYS: Readonly<Record<string, Parameters<typeof translate>[0]>> = {
  '각질 literacy': 'ingredient.function.각질 literacy',
  '각질/피부 컨디셔닝': 'ingredient.function.각질/피부 컨디셔닝',
  '보습': 'ingredient.function.보습',
  '보존': 'ingredient.function.보존',
  '브라이트닝 literacy': 'ingredient.function.브라이트닝 literacy',
  '사용감/피부 컨디셔닝': 'ingredient.function.사용감/피부 컨디셔닝',
  '세정': 'ingredient.function.세정',
  '수분 손실 억제': 'ingredient.function.수분 손실 억제',
  '스킨 컨디셔닝': 'ingredient.function.스킨 컨디셔닝',
  '자외선 차단': 'ingredient.function.자외선 차단',
  '장벽 지원': 'ingredient.function.장벽 지원',
  '제품 스토리 literacy': 'ingredient.function.제품 스토리 literacy',
  '제형': 'ingredient.function.제형',
  '제형/연화': 'ingredient.function.제형/연화',
  '제형/용매': 'ingredient.function.제형/용매',
  '컨디셔닝': 'ingredient.function.컨디셔닝',
  '피부 유연': 'ingredient.function.피부 유연',
  '피부 컨디셔닝': 'ingredient.function.피부 컨디셔닝',
  '항산화 literacy': 'ingredient.function.항산화 literacy',
  '항산화/브라이트닝 literacy': 'ingredient.function.항산화/브라이트닝 literacy',
  '항산화/피부 컨디셔닝': 'ingredient.function.항산화/피부 컨디셔닝',
  '향': 'ingredient.function.향',
};

/** The function word in the reader's language, or the database's own word when it is unknown. */
export const functionLabel = (fn: string, locale: string): string => {
  const key = FUNCTION_LABEL_KEYS[fn];
  return key ? translate(key, locale) : fn;
};
