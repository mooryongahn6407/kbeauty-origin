/**
 * Shared glossary — one name per ingredient and routine term, in all five app languages.
 *
 * The ingredient dictionary, the guide, the academy and the product pages must all call an
 * ingredient by the same name in the same language; `tests/glossary.test.ts` checks every
 * dictionary entry against this list. Korean, English and Lao are the company's own names
 * (copied from the dictionary). Thai and French are UNREVIEWED DRAFTS like the rest of those two
 * catalogs (`CATALOG_REVIEW`): change a name here first, then in the content that uses it.
 */
export interface GlossaryName {
  readonly ko: string;
  readonly en: string;
  readonly lo: string;
  readonly th: string;
  readonly fr: string;
}

export const GLOSSARY_LOCALES = ['ko', 'en', 'lo', 'th', 'fr'] as const;

/** Ingredient names, keyed by dictionary id. */
export const INGREDIENT_GLOSSARY: Readonly<Record<string, GlossaryName>> = {
  vitc: { ko: '비타민 C', en: 'Vitamin C', lo: 'ວິຕາມິນ C', th: 'วิตามินซี', fr: 'Vitamine C' },
  niacinamide: { ko: '나이아신아마이드', en: 'Niacinamide', lo: 'ໄນອາຊິນາໄມ', th: 'ไนอะซินาไมด์', fr: 'Niacinamide' },
  txa: { ko: '트라넥삼산 (TXA)', en: 'Tranexamic Acid (TXA)', lo: 'ທຣາເນັກຊາມິກ (TXA)', th: 'กรดทราเนซามิก (TXA)', fr: 'Acide tranexamique (TXA)' },
  arbutin: { ko: '알부틴', en: 'Arbutin', lo: 'ອາບູຕິນ', th: 'อาร์บูติน', fr: 'Arbutine' },
  licorice: { ko: '감초 추출물', en: 'Licorice Root Extract', lo: 'ສານສະກັດຊະເອົາເຫຼືອງ', th: 'สารสกัดรากชะเอมเทศ', fr: 'Extrait de racine de réglisse' },
  centella: { ko: '센텔라 (시카)', en: 'Centella Asiatica (CICA)', lo: 'ເຊັນເທລລາ (CICA)', th: 'ใบบัวบก (CICA)', fr: 'Centella asiatica (CICA)' },
  madecassoside: { ko: '마데카소사이드', en: 'Madecassoside', lo: 'ມາເດຄາໂຊໄຊດ໌', th: 'มาเดคาโซไซด์', fr: 'Madécassoside' },
  panthenol: { ko: '판테놀 (비타민 B5)', en: 'Panthenol (Vitamin B5)', lo: 'ແພນທີນອນ (ວິຕາມິນ B5)', th: 'แพนทีนอล (วิตามินบี 5)', fr: 'Panthénol (vitamine B5)' },
  heartleaf: { ko: '어성초', en: 'Heartleaf (Houttuynia Cordata)', lo: 'ຜັກຄາວທອງ', th: 'พลูคาว (Houttuynia cordata)', fr: 'Houttuynia cordata' },
  aloe: { ko: '알로에베라', en: 'Aloe Vera', lo: 'ຫວ້ານຫາງແຂ້', th: 'ว่านหางจระเข้', fr: 'Aloe vera' },
  hyaluronic: { ko: '히알루론산', en: 'Hyaluronic Acid', lo: 'ໄຮອາລູໂຣນິກ', th: 'กรดไฮยาลูรอนิก', fr: 'Acide hyaluronique' },
  ceramide: { ko: '세라마이드', en: 'Ceramide', lo: 'ເຊຣາໄມ', th: 'เซราไมด์', fr: 'Céramide' },
  squalane: { ko: '스쿠알란', en: 'Squalane', lo: 'ສະຄວາເລນ', th: 'สควาเลน', fr: 'Squalane' },
  betaglucan: { ko: '베타글루칸', en: 'Beta-Glucan', lo: 'ເບຕ້າກຼູແຄນ', th: 'เบต้ากลูแคน', fr: 'Bêta-glucane' },
  propolis: { ko: '프로폴리스', en: 'Propolis', lo: 'ພຣໍໂພລິດ', th: 'โพรโพลิส', fr: 'Propolis' },
  retinol: { ko: '레티놀', en: 'Retinol', lo: 'ເຣຕິນອນ', th: 'เรตินอล', fr: 'Rétinol' },
  peptide: { ko: '펩타이드', en: 'Peptides', lo: 'ເປັບໄທ', th: 'เปปไทด์', fr: 'Peptides' },
  adenosine: { ko: '아데노신', en: 'Adenosine', lo: 'ອາເດໂນຊິນ', th: 'อะดีโนซีน', fr: 'Adénosine' },
  collagen: { ko: '콜라겐', en: 'Collagen', lo: 'ຄໍລາເຈນ', th: 'คอลลาเจน', fr: 'Collagène' },
  pdrn: { ko: 'PDRN', en: 'PDRN', lo: 'PDRN', th: 'PDRN', fr: 'PDRN' },
  exosome: { ko: '엑소좀', en: 'Exosomes', lo: 'ເອັກໂຊໂຊມ', th: 'เอ็กโซโซม', fr: 'Exosomes' },
  stemcell: { ko: '줄기세포 배양액', en: 'Stem Cell Culture Media', lo: 'ນ້ຳລ້ຽງເຊວຕົ້ນກຳເນີດ', th: 'น้ำเลี้ยงเซลล์ต้นกำเนิด', fr: 'Milieu de culture de cellules souches' },
  spicule: { ko: '스피큘', en: 'Spicules', lo: 'ສະປິຄິວ', th: 'สปิคูล', fr: 'Spicules' },
  bha: { ko: '살리실산 (BHA)', en: 'Salicylic Acid (BHA)', lo: 'ກົດຊາລິຊິລິກ (BHA)', th: 'กรดซาลิไซลิก (BHA)', fr: 'Acide salicylique (BHA)' },
  aha: { ko: 'AHA (글리콜산·락틱산)', en: 'AHA (Glycolic · Lactic Acid)', lo: 'AHA (ກົດໄກຼໂຄລິກ · ແລັກຕິກ)', th: 'AHA (กรดไกลโคลิก · กรดแลคติก)', fr: 'AHA (acide glycolique · acide lactique)' },
  pha: { ko: 'PHA (글루코노락톤)', en: 'PHA (Gluconolactone)', lo: 'PHA (ກຼູໂຄໂນແລັກໂຕນ)', th: 'PHA (กลูโคโนแลคโตน)', fr: 'PHA (gluconolactone)' },
  azelaic: { ko: '아젤라익산', en: 'Azelaic Acid', lo: 'ກົດອາເຊລາອິກ', th: 'กรดอะเซลาอิก', fr: 'Acide azélaïque' },
  teatree: { ko: '티트리 오일', en: 'Tea Tree Oil', lo: 'ນ້ຳມັນທີທຣີ', th: 'น้ำมันทีทรี', fr: 'Huile de tea tree' },
  sunscreen: { ko: '무기자차 (징크·티타늄)', en: 'Mineral Filters (Zinc · Titanium)', lo: 'ກັນແດດແຮ່ທາດ (Zinc · Titanium)', th: 'ฟิลเตอร์กันแดดแร่ (ซิงค์ · ไทเทเนียม)', fr: 'Filtres minéraux (zinc · titane)' },
  vite: { ko: '비타민 E (토코페롤)', en: 'Vitamin E (Tocopherol)', lo: 'ວິຕາມິນ E (ໂຕໂຄເຟຣອນ)', th: 'วิตามินอี (โทโคฟีรอล)', fr: 'Vitamine E (tocophérol)' },
};

/** Routine and skin terms the guide, academy and usage sentences share. */
export const TERM_GLOSSARY: Readonly<Record<string, GlossaryName>> = {
  'cleanser': { ko: '클렌저', en: 'cleanser', lo: 'ໂຟມລ້າງໜ້າ', th: 'คลีนเซอร์', fr: 'nettoyant' },
  'toner': { ko: '토너', en: 'toner', lo: 'ໂທນເນີ', th: 'โทนเนอร์', fr: 'lotion tonique' },
  'essence': { ko: '에센스', en: 'essence', lo: 'ເອສເຊັນ', th: 'เอสเซนส์', fr: 'essence' },
  'serum': { ko: '세럼', en: 'serum', lo: 'ເຊຣັ່ມ', th: 'เซรั่ม', fr: 'sérum' },
  'ampoule': { ko: '앰플', en: 'ampoule', lo: 'ແອມພູນ', th: 'แอมพูล', fr: 'ampoule' },
  'cream': { ko: '크림', en: 'cream', lo: 'ຄຣີມ', th: 'ครีม', fr: 'crème' },
  'moisturizer': { ko: '보습제', en: 'moisturizer', lo: 'ຄຣີມບຳລຸງຄວາມຊຸ່ມ', th: 'มอยส์เจอไรเซอร์', fr: 'crème hydratante' },
  'sunscreen': { ko: '선크림', en: 'sunscreen', lo: 'ກັນແດດ', th: 'ครีมกันแดด', fr: 'crème solaire' },
  'sheet-mask': { ko: '시트 마스크', en: 'sheet mask', lo: 'ແຜ່ນມາສ໌ກ', th: 'มาสก์แผ่น', fr: 'masque en tissu' },
  'barrier': { ko: '피부 장벽', en: 'skin barrier', lo: 'ເກາະປ້ອງກັນຜິວ', th: 'เกราะป้องกันผิว', fr: 'barrière cutanée' },
  'dark-spots': { ko: '잡티', en: 'dark spots', lo: 'ຈຸດດ່າງດຳ', th: 'จุดด่างดำ', fr: 'taches pigmentaires' },
  'melasma': { ko: '기미', en: 'melasma', lo: 'ຝ້າ', th: 'ฝ้า', fr: 'mélasma' },
  'exfoliate': { ko: '각질 제거', en: 'exfoliate', lo: 'ຂັດຜິວ', th: 'ผลัดเซลล์ผิว', fr: 'exfolier' },
};

/** The glossary name for an ingredient in `locale`; English for a locale it does not carry. */
export function glossaryName(id: string, locale: string): string | undefined {
  const entry = INGREDIENT_GLOSSARY[id];
  if (!entry) return undefined;
  return (GLOSSARY_LOCALES as readonly string[]).includes(locale)
    ? entry[locale as (typeof GLOSSARY_LOCALES)[number]]
    : entry.en;
}
