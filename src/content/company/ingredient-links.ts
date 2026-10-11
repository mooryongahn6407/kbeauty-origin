/**
 * Which products list a dictionary ingredient on their printed label.
 *
 * Patterns are over the printed Korean INCI name (after `printedBase`), anchored at the start
 * wherever a name has look-alikes. They name the ingredient itself and its standard label
 * forms — salts, esters and derivatives the dictionary entry itself describes ("유도체",
 * "레티날") — and nothing merely related. A product counts when its printed list carries one.
 * The UV-filter list is Korea's registered filters as they appear on Korean labels.
 */
import { printedBase } from '../inci-names';
import { storeCatalog } from '../store-catalog';
import type { StoreProduct } from '../store-catalog-types';

export const DICTIONARY_LABEL_PATTERNS: Readonly<Record<string, RegExp>> = {
  vitc: /^(아스코빅애씨드|3-O-에틸아스코빅애씨드|에틸아스코빌에터|아스코빌글루코사이드|소듐아스코빌포스페이트|마그네슘아스코빌포스페이트|아스코빌테트라이소팔미테이트|아스코빌팔미테이트)$/,
  niacinamide: /^나이아신아마이드$/,
  txa: /^(트라넥사믹애씨드|트라넥삼산)$/,
  arbutin: /^(알파-)?알부틴$/,
  licorice: /^(감초|다이포타슘글리시리제이트|글라브리딘)/,
  centella: /^병풀/,
  madecassoside: /^(마데카소사이드|아시아티코사이드|마데카식애씨드|아시아틱애씨드)$/,
  panthenol: /^(판테놀|덱스판테놀)$/,
  heartleaf: /^(약모밀|어성초)/,
  aloe: /^알로에/,
  hyaluronic: /하이알루로/,
  ceramide: /^세라마이드/,
  squalane: /^스쿠알란$/,
  betaglucan: /^베타-?글루칸$/,
  propolis: /^프로폴리스/,
  retinol: /^(레티놀|레티날|레티닐팔미테이트|하이드록시피나콜론레티노에이트)$/,
  peptide: /펩타이드-?\d*$/,
  adenosine: /^아데노신$/,
  collagen: /콜라겐$/,
  pdrn: /^(소듐디엔에이|폴리뉴클레오타이드|소듐폴리뉴클레오타이드)$/,
  exosome: /엑소좀/,
  stemcell: /(줄기세포|캘러스배양|배양액)/,
  spicule: /해면/,
  bha: /^살리실릭애씨드$/,
  aha: /^(글라이콜릭애씨드|락틱애씨드|만델릭애씨드)$/,
  pha: /^(글루코노락톤|락토바이오닉애씨드)$/,
  azelaic: /^아젤라/,
  teatree: /티트리/,
  sunscreen: /^(징크옥사이드|티타늄디옥사이드|에틸헥실메톡시신나메이트|에칠헥실메톡시신나메이트|비스-?에(틸|칠)헥실옥시페놀메톡시페닐트리아진|에(틸|칠)헥실트리아존|호모살레이트|옥토크릴렌|에(틸|칠)헥실살리실레이트|부틸메톡시다이벤조일메테인|다이에틸아미노하이드록시벤조일헥실벤조에이트|메틸렌비스-?벤조트리아졸릴테트라메틸부틸페놀|폴리실리콘-15|드로메트리졸트리실록산|테레프탈릴리덴다이캠퍼설포닉애씨드)$/,
  vite: /^(토코페롤|토코페릴아세테이트)$/,
};

/** The printed names on this product that belong to a dictionary entry, in printed order. */
export const printedMatches = (product: StoreProduct, id: string): readonly string[] => {
  const pattern = DICTIONARY_LABEL_PATTERNS[id];
  return pattern ? product.inci.filter((printed) => pattern.test(printedBase(printed))) : [];
};

/** Dictionary ids whose ingredient this product's label prints. */
export const dictionaryIdsOn = (product: StoreProduct): readonly string[] =>
  Object.keys(DICTIONARY_LABEL_PATTERNS).filter((id) => printedMatches(product, id).length > 0);

/** Products that sell today and print this dictionary ingredient on their label. */
export const productsWith = (id: string): readonly StoreProduct[] =>
  storeCatalog.filter((product) => printedMatches(product, id).length > 0);
