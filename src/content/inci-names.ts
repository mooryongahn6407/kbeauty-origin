/**
 * Printed Korean ingredient names → the 06_INGREDIENTS record they are.
 *
 * Exact names only. A name is listed here when it is the Korean INCI name of that very record —
 * not a salt, ester, derivative or relative of it — because a label reader that says "this is
 * glycolic acid" about 치오글라이콜릭애씨드 (a depilatory) would be stating a false fact. So:
 * - 에탄올 (Alcohol) is not 변성알코올 (Alcohol Denat., ING-038), and is not mapped.
 * - 병풀잎추출물 (leaf extract) is a different INCI from 병풀추출물 (ING-022), and is not mapped.
 * - 토코페릴아세테이트 is an ester of tocopherol, not ING-024.
 * - 베타인살리실레이트 is not salicylic acid; 하이드롤라이즈드하이알루로닉애씨드 is not ING-002.
 * - Fermented ingredients (ING-025) are a story category with no single printed name.
 *
 * ING-017 is a family record ("PHA family"), so both of its printed members point to it.
 */
export const PRINTED_NAME_TO_INGREDIENT: Readonly<Record<string, string>> = {
  글리세린: 'ING-001',
  하이알루로닉애씨드: 'ING-002',
  소듐하이알루로네이트: 'ING-003',
  세라마이드엔피: 'ING-004',
  세라마이드에이피: 'ING-005',
  콜레스테롤: 'ING-006',
  나이아신아마이드: 'ING-007',
  아스코빅애씨드: 'ING-008',
  '3-O-에틸아스코빅애씨드': 'ING-009',
  레티놀: 'ING-010',
  판테놀: 'ING-011',
  알란토인: 'ING-012',
  살리실릭애씨드: 'ING-013',
  글라이콜릭애씨드: 'ING-014',
  락틱애씨드: 'ING-015',
  만델릭애씨드: 'ING-016',
  글루코노락톤: 'ING-017',
  락토바이오닉애씨드: 'ING-017',
  페트롤라툼: 'ING-018',
  시어버터: 'ING-019',
  스쿠알란: 'ING-020',
  다이메티콘: 'ING-021',
  병풀추출물: 'ING-022',
  녹차추출물: 'ING-023',
  토코페롤: 'ING-024',
  카페인: 'ING-026',
  징크옥사이드: 'ING-027',
  티타늄디옥사이드: 'ING-028',
  코카미도프로필베타인: 'ING-029',
  소듐라우레스설페이트: 'ING-030',
  세테아릴알코올: 'ING-031',
  카보머: 'ING-032',
  잔탄검: 'ING-033',
  페녹시에탄올: 'ING-034',
  향료: 'ING-035',
  리모넨: 'ING-036',
  리날룰: 'ING-037',
  변성알코올: 'ING-038',
  아데노신: 'ING-039',
  바쿠치올: 'ING-040',
};

/**
 * The name part of a printed entry: whatever follows a printed concentration "(420ppm)", a
 * transcriber's "[?]" or a code "<ILN50755>" is dropped, and nothing else is changed.
 */
export const printedBase = (printed: string): string => printed.replace(/\s*[([<].*$/, '').trim();

/** The 06_INGREDIENTS record a printed entry names, or null when it is not one we hold. */
export const ingredientIdForPrinted = (printed: string): string | null =>
  PRINTED_NAME_TO_INGREDIENT[printedBase(printed)] ?? null;
