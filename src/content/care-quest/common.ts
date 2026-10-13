/**
 * Pieces every Care Quest track shares: the "not sure" and "none of these" answers, the patch
 * test and sunscreen cards, the product kinds, and the screen's own words.
 */
import type { Localized, QuestChoice, Source } from './types';

export const L = (ko: string, en: string, lo: string, th: string, fr: string): Localized => ({
  ko,
  en,
  lo,
  th,
  fr,
});

export const NOT_SURE_ID = 'unsure';
export const NONE_ID = 'none';

export const NOT_SURE: QuestChoice = {
  id: NOT_SURE_ID,
  icon: '🤔',
  label: L('잘 모르겠어요', "I'm not sure", 'ບໍ່ແນ່ໃຈ', 'ไม่แน่ใจ', 'Je ne sais pas'),
};

export const NONE: QuestChoice = {
  id: NONE_ID,
  icon: '⭕',
  label: L('해당 없음', 'None of these', 'ບໍ່ມີຂໍ້ໃດກົງ', 'ไม่มีข้อใดตรง', 'Aucun de ceux-ci'),
};

/** Kinds of product a routine is built from — what each is, and why it exists. */
export interface ProductKind {
  readonly id: string;
  readonly icon: string;
  readonly name: Localized;
  readonly why: Localized;
  /** Store catalog categories that carry this kind. */
  readonly categories: readonly string[];
}

export const PRODUCT_KINDS: readonly ProductKind[] = [
  {
    id: 'oilCleanser',
    icon: '🫧',
    name: L(
      '클렌징 오일·밤',
      'Cleansing oil / balm',
      'ນ້ຳມັນລ້າງໜ້າ',
      'คลีนซิ่งออยล์ / บาล์ม',
      'Huile / baume démaquillant',
    ),
    why: L(
      '기름은 기름으로 녹입니다. 선크림·화장을 먼저 녹여 내는 1차 세안이에요.',
      'Oil dissolves oil: the first cleanse that lifts sunscreen and make-up.',
      'ນ້ຳມັນລະລາຍນ້ຳມັນ: ລ້າງຄັ້ງທຳອິດ ເພື່ອເອົາຄີມກັນແດດ ແລະ ເຄື່ອງແຕ່ງໜ້າອອກ.',
      'น้ำมันละลายน้ำมัน: ล้างขั้นแรกเพื่อเอากันแดดและเครื่องสำอางออก',
      "L'huile dissout l'huile : premier nettoyage qui retire écran solaire et maquillage.",
    ),
    categories: ['클렌징'],
  },
  {
    id: 'foamCleanser',
    icon: '🧼',
    name: L(
      '폼·젤 클렌저',
      'Foam / gel cleanser',
      'ໂຟມລ້າງໜ້າ',
      'โฟม / เจลล้างหน้า',
      'Mousse / gel nettoyant',
    ),
    why: L(
      '땀·피지·남은 잔여물을 씻어 내는 2차 세안. 피부와 비슷한 약산성(pH 4.5–5.5대)이 덜 당겨요.',
      'The second cleanse for sweat, oil and what is left. A mildly acidic one (around pH 4.5–5.5, close to skin) tends to feel less tight.',
      'ລ້າງຄັ້ງທີສອງ ສຳລັບເຫື່ອ ແລະ ຄວາມມັນ. ແບບເປັນກົດອ່ອນ (pH ປະມານ 4.5–5.5 ໃກ້ກັບຜິວ) ມັກບໍ່ຕຶງ.',
      'ล้างขั้นที่สองเพื่อเหงื่อ ความมัน และสิ่งตกค้าง แบบกรดอ่อน (pH ราว 4.5–5.5 ใกล้ผิว) มักไม่ตึง',
      'Deuxième nettoyage pour la sueur et le sébum. Un pH doux (environ 4,5–5,5, proche de la peau) tiraille moins.',
    ),
    categories: ['클렌징'],
  },
  {
    id: 'toner',
    icon: '💧',
    name: L('토너', 'Toner', 'ໂທນເນີ', 'โทนเนอร์', 'Lotion tonique'),
    why: L(
      '세안 직후 비어 있는 피부에 첫 수분을 주고 결을 정돈해, 다음 단계가 고르게 펴지게 해요. 수분·진정·각질(AHA·BHA·PHA) 토너가 있어요.',
      'First water on freshly washed skin, so the next steps spread evenly. Comes as hydrating, soothing or exfoliating (AHA, BHA, PHA) toners.',
      'ໃຫ້ນ້ຳທຳອິດຫຼັງລ້າງໜ້າ ເພື່ອໃຫ້ຂັ້ນຕໍ່ໄປທາໄດ້ສະເໝີ. ມີແບບໃຫ້ຄວາມຊຸ່ມ, ຜ່ອນຄາຍ ແລະ ຂັດຂີ້ໄຄ (AHA, BHA, PHA).',
      'ให้น้ำแรกกับผิวหลังล้างหน้า เพื่อให้ขั้นต่อไปเกลี่ยได้ทั่ว มีแบบให้ความชุ่มชื้น ปลอบประโลม และผลัดเซลล์ (AHA, BHA, PHA)',
      "Première hydratation après le nettoyage, pour que la suite s'étale bien. Existe en version hydratante, apaisante ou exfoliante (AHA, BHA, PHA).",
    ),
    categories: ['토너'],
  },
  {
    id: 'serum',
    icon: '🧪',
    name: L(
      '에센스·세럼·앰플',
      'Essence / serum / ampoule',
      'ເອັສເຊັນ · ເຊລັ່ມ · ແອມພູນ',
      'เอสเซนส์ / เซรั่ม / แอมพูล',
      'Essence / sérum / ampoule',
    ),
    why: L(
      '고민 성분을 진하게 담은 단계. 에센스(가벼움) → 세럼 → 앰플(가장 진함) 순서로 농도가 높아져요. 고민 하나에 하나면 충분해요.',
      'The step that carries the active ingredients. Essence is lightest, then serum, then ampoule, the most concentrated. One per concern is enough.',
      'ຂັ້ນທີ່ມີສ່ວນປະສົມເຂັ້ມຂຸ້ນ. ເອັສເຊັນເບົາທີ່ສຸດ, ແລ້ວເຊລັ່ມ, ແອມພູນເຂັ້ມທີ່ສຸດ. ບັນຫາໜຶ່ງໃຊ້ອັນດຽວກໍພໍ.',
      'ขั้นที่มีส่วนผสมเข้มข้น เอสเซนส์เบาที่สุด ตามด้วยเซรั่ม แอมพูลเข้มข้นที่สุด ปัญหาหนึ่งใช้ตัวเดียวก็พอ',
      "L'étape des actifs. L'essence est la plus légère, puis le sérum, puis l'ampoule, la plus concentrée. Un par préoccupation suffit.",
    ),
    categories: ['에센스·세럼·앰플'],
  },
  {
    id: 'eyeCream',
    icon: '👁️',
    name: L('아이크림', 'Eye cream', 'ຄີມຮອບຕາ', 'อายครีม', 'Contour des yeux'),
    why: L(
      '눈가 피부는 얼굴 다른 곳보다 훨씬 얇고 피지선이 적어 건조·잔주름이 먼저 와요. 눈에 들어가도 덜 자극적이게 만든 제품이에요. 약지로 톡톡.',
      'Skin around the eyes is much thinner with few oil glands, so dryness and fine lines show there first. Eye creams are made to be gentler near the eye. Pat on with the ring finger.',
      'ຜິວຮອບຕາບາງກວ່າຫຼາຍ ແລະ ມີຕ່ອມນ້ຳມັນໜ້ອຍ ຈຶ່ງແຫ້ງ ແລະ ມີຮອຍຫ່ຽວກ່ອນ. ຄີມຮອບຕາເຮັດໃຫ້ອ່ອນໂຍນ. ຕົບເບົາໆດ້ວຍນິ້ວນາງ.',
      'ผิวรอบดวงตาบางกว่ามากและมีต่อมไขมันน้อย จึงแห้งและเกิดริ้วรอยก่อน อายครีมทำมาให้อ่อนโยนใกล้ดวงตา ใช้นิ้วนางแตะเบาๆ',
      "La peau du contour de l'œil est bien plus fine, avec peu de glandes sébacées : sécheresse et ridules y apparaissent d'abord. Tapoter avec l'annulaire.",
    ),
    categories: ['아이케어'],
  },
  {
    id: 'lotion',
    icon: '🥛',
    name: L('로션·에멀전', 'Lotion / emulsion', 'ໂລຊັ່ນ', 'โลชั่น / อิมัลชั่น', 'Émulsion'),
    why: L(
      '크림보다 가벼운 보습. 지성·복합성, 덥고 습한 날에 잘 맞아요.',
      'A lighter moisturiser than cream; suits oily or combination skin and hot, humid days.',
      'ບຳລຸງຄວາມຊຸ່ມທີ່ເບົາກວ່າຄີມ; ເໝາະກັບຜິວມັນ ແລະ ມື້ຮ້ອນຊື້ນ.',
      'มอยส์เจอไรเซอร์ที่เบากว่าครีม เหมาะกับผิวมันหรือผิวผสมและวันที่ร้อนชื้น',
      'Hydratant plus léger que la crème ; convient aux peaux grasses et aux jours chauds et humides.',
    ),
    categories: ['크림'],
  },
  {
    id: 'cream',
    icon: '🫙',
    name: L('크림', 'Cream', 'ຄີມ', 'ครีม', 'Crème'),
    why: L(
      '앞 단계의 수분이 날아가지 않게 덮어 주는 마지막 보습. 건성·40대 이상은 더 진한 크림, 지성은 젤 크림.',
      'The last moisturising layer that keeps the water from earlier steps in. Richer for dry skin and after 40; gel-cream for oily skin.',
      'ຊັ້ນສຸດທ້າຍທີ່ກັກເກັບຄວາມຊຸ່ມ. ຜິວແຫ້ງ ແລະ ອາຍຸ 40 ຂຶ້ນໄປໃຊ້ແບບເຂັ້ມ; ຜິວມັນໃຊ້ເຈວຄີມ.',
      'ชั้นสุดท้ายที่กักเก็บความชุ่มชื้น ผิวแห้งและวัย 40+ ใช้แบบเข้มข้น ผิวมันใช้เจลครีม',
      "Dernière couche qui garde l'eau des étapes précédentes. Plus riche pour peau sèche et après 40 ans ; gel-crème pour peau grasse.",
    ),
    categories: ['크림'],
  },
  {
    id: 'sunscreen',
    icon: '☀️',
    name: L(
      '선크림·선스틱·선쿠션',
      'Sunscreen (cream, stick, cushion)',
      'ຄີມກັນແດດ',
      'ครีมกันแดด (ครีม สติ๊ก คุชชั่น)',
      'Écran solaire (crème, stick, cushion)',
    ),
    why: L(
      '아침 루틴의 마지막. 기미·흑자·주름의 큰 원인인 자외선을 막는, 모든 나이에 가장 중요한 단계예요.',
      'The last morning step. It blocks the UV light behind much of spotting and wrinkling — the most important step at every age.',
      'ຂັ້ນສຸດທ້າຍຕອນເຊົ້າ. ກັນລັງສີ UV ທີ່ເປັນສາເຫດໃຫຍ່ຂອງຝ້າ ແລະ ຮອຍຫ່ຽວ — ສຳຄັນທີ່ສຸດທຸກໄວ.',
      'ขั้นสุดท้ายตอนเช้า ป้องกันรังสี UV ที่เป็นต้นเหตุใหญ่ของฝ้า จุดด่างดำ และริ้วรอย สำคัญที่สุดทุกวัย',
      "Dernière étape du matin. Elle bloque les UV, grande cause des taches et des rides — l'étape la plus importante à tout âge.",
    ),
    categories: ['선케어'],
  },
  {
    id: 'mask',
    icon: '🎭',
    name: L('마스크팩', 'Sheet mask', 'ແຜ່ນມາສ', 'แผ่นมาสก์', 'Masque en tissu'),
    why: L(
      '주 1–3회, 토너 다음에 15–20분. 집중 수분·진정용 특별 단계예요. 마른 뒤까지 두지 마세요.',
      'One to three times a week, after toner, for 15–20 minutes: an extra hydrating or soothing step. Take it off before it dries.',
      'ອາທິດລະ 1–3 ເທື່ອ ຫຼັງໂທນເນີ 15–20 ນາທີ. ເອົາອອກກ່ອນມັນແຫ້ງ.',
      'สัปดาห์ละ 1–3 ครั้ง หลังโทนเนอร์ 15–20 นาที ลอกออกก่อนแผ่นแห้ง',
      "Une à trois fois par semaine, après le tonique, 15–20 minutes. À retirer avant qu'il ne sèche.",
    ),
    categories: ['마스크팩'],
  },
  {
    id: 'shampoo',
    icon: '🧴',
    name: L('샴푸', 'Shampoo', 'ແຊມພູ', 'แชมพู', 'Shampoing'),
    why: L(
      '두피를 씻는 제품이에요. 거품은 두피에 내고, 길이는 헹굴 때 흘러내리는 거품이면 충분해요.',
      'It is for washing the scalp: lather at the roots; the rinse is enough for the lengths.',
      'ສຳລັບລ້າງໜັງຫົວ: ຟອກຢູ່ໜັງຫົວ; ຄວາມຍາວຂອງຜົມ ພຽງແຕ່ໃຫ້ຟອງໄຫຼຜ່ານ.',
      'ใช้ล้างหนังศีรษะ ตีฟองที่โคนผม ส่วนความยาวผมแค่ให้ฟองไหลผ่านตอนล้างก็พอ',
      'Pour laver le cuir chevelu : faire mousser aux racines ; le rinçage suffit pour les longueurs.',
    ),
    categories: ['헤어케어'],
  },
  {
    id: 'dandruffShampoo',
    icon: '❄️',
    name: L(
      '비듬용 샴푸',
      'Anti-dandruff shampoo',
      'ແຊມພູກັນລັງແຄ',
      'แชมพูขจัดรังแค',
      'Shampoing antipelliculaire',
    ),
    why: L(
      '비듬 성분(징크피리치온 등)이 든 샴푸. 라벨대로 두피에 몇 분 두었다가 헹궈요.',
      'Contains an anti-dandruff active such as zinc pyrithione; leave it on the scalp for the minutes the label says, then rinse.',
      'ມີສ່ວນປະສົມກັນລັງແຄ ເຊັ່ນ zinc pyrithione; ປະໄວ້ຕາມສະຫຼາກ ແລ້ວລ້າງ.',
      'มีสารขจัดรังแค เช่น ซิงค์ไพริไทออน ทิ้งไว้บนหนังศีรษะตามเวลาบนฉลากแล้วล้างออก',
      'Contient un actif antipelliculaire (pyrithione de zinc…) ; laisser poser le temps indiqué.',
    ),
    categories: ['헤어케어'],
  },
  {
    id: 'conditioner',
    icon: '💆‍♀️',
    name: L('컨디셔너·린스', 'Conditioner', 'ຄອນດິຊັນເນີ', 'ครีมนวดผม', 'Après-shampoing'),
    why: L(
      '머리카락 겉면을 매끄럽게 덮어 엉킴·정전기·끊어짐을 줄여요. 두피 말고 길이와 끝에.',
      'Smooths the hair surface to cut tangles, static and breakage. On the lengths and ends, not the scalp.',
      'ເຮັດໃຫ້ເສັ້ນຜົມລື່ນ ລົດການພັນກັນ ແລະ ຂາດ. ທາທີ່ຄວາມຍາວ ແລະ ປາຍ ບໍ່ແມ່ນໜັງຫົວ.',
      'เคลือบผิวเส้นผมให้ลื่น ลดผมพันกัน ไฟฟ้าสถิต และผมขาด ใช้ที่ความยาวและปลายผม ไม่ใช่หนังศีรษะ',
      'Lisse la fibre : moins de nœuds, d’électricité et de casse. Sur longueurs et pointes.',
    ),
    categories: ['헤어케어'],
  },
  {
    id: 'hairMask',
    icon: '🫙',
    name: L(
      '트리트먼트·헤어 마스크',
      'Treatment / hair mask',
      'ທຣີດເມັ້ນ / ມາສຜົມ',
      'ทรีตเมนต์ / มาสก์ผม',
      'Soin / masque capillaire',
    ),
    why: L(
      '손상·건조 모발에 더하는 집중 단계. 라벨의 시간과 횟수를 따르세요.',
      'An intensive extra step for damaged or dry hair; follow the label for time and frequency.',
      'ຂັ້ນເພີ່ມສຳລັບຜົມເສຍ ຫຼື ແຫ້ງ; ເຮັດຕາມສະຫຼາກ.',
      'ขั้นตอนเสริมสำหรับผมเสียหรือผมแห้ง ทำตามเวลาและความถี่บนฉลาก',
      'Étape intensive pour cheveux abîmés ou secs ; suivre l’étiquette.',
    ),
    categories: ['헤어케어'],
  },
  {
    id: 'scalpCare',
    icon: '🌱',
    name: L(
      '두피 토닉·세럼·스케일러',
      'Scalp tonic / serum / scaler',
      'ໂທນິກ ແລະ ເຊລັ່ມໜັງຫົວ',
      'โทนิก / เซรั่ม / สเกลเลอร์หนังศีรษะ',
      'Lotion / sérum / gommage du cuir chevelu',
    ),
    why: L(
      '두피에 직접 바르는 단계. 스케일러(각질 제거)는 처음엔 드물게, 따갑거나 상처가 있으면 쉬어요.',
      'Applied straight to the scalp. Use a scaler (scalp exfoliant) sparingly at first, and skip it if the scalp stings or has sores.',
      'ທາໃສ່ໜັງຫົວໂດຍກົງ. ສະເກວເລີ ໃຊ້ໜ້ອຍໆກ່ອນ; ຖ້າແສບ ຫຼື ມີບາດແຜ ໃຫ້ຢຸດ.',
      'ทาที่หนังศีรษะโดยตรง สเกลเลอร์ (ผลัดเซลล์หนังศีรษะ) ใช้นานๆ ครั้งก่อน ถ้าแสบหรือมีแผลให้งด',
      'Directement sur le cuir chevelu. Le gommage, rarement au début, et jamais sur peau irritée.',
    ),
    categories: ['헤어케어'],
  },
  {
    id: 'hairOil',
    icon: '✨',
    name: L(
      '헤어 오일·에센스·열 보호제',
      'Hair oil / serum / heat protectant',
      'ນ້ຳມັນບຳລຸງຜົມ / ກັນຄວາມຮ້ອນ',
      'ออยล์ / เซรั่มผม / กันความร้อน',
      'Huile / sérum / protecteur thermique',
    ),
    why: L(
      '감은 뒤 끝에 소량. 드라이어·고데기 전에는 열 보호제를 먼저.',
      'A little on the ends after washing; heat protectant before a dryer or straightener.',
      'ທາໜ້ອຍໜຶ່ງທີ່ປາຍຜົມຫຼັງສະ; ກ່ອນເປົ່າ ຫຼື ໜີບຜົມ ໃຫ້ທາກັນຄວາມຮ້ອນ.',
      'ใช้ปริมาณน้อยที่ปลายผมหลังสระ ก่อนใช้ไดร์หรือที่หนีบให้ทากันความร้อนก่อน',
      'Un peu sur les pointes ; protecteur thermique avant sèche-cheveux ou lisseur.',
    ),
    categories: ['헤어케어'],
  },
  {
    id: 'bodyWash',
    icon: '🚿',
    name: L('바디워시', 'Body wash', 'ສະບູອາບນ້ຳ', 'ครีมอาบน้ำ', 'Gel douche'),
    why: L(
      '순하고 향이 적은 세정제를 미지근한 물로 5–10분. 땀 흘린 뒤엔 바로 씻어요.',
      'A mild, low-fragrance cleanser in lukewarm water for 5–10 minutes; wash soon after sweating.',
      'ສະບູອ່ອນໂຍນ ນ້ຳອຸ່ນ 5–10 ນາທີ; ອາບນ້ຳໄວຫຼັງເຫື່ອອອກ.',
      'สบู่อ่อนโยนกลิ่นน้อย น้ำอุ่น 5–10 นาที อาบน้ำเร็วหลังเหงื่อออก',
      'Nettoyant doux à l’eau tiède, 5–10 minutes ; se laver vite après avoir transpiré.',
    ),
    categories: ['바디케어'],
  },
  {
    id: 'bodyLotion',
    icon: '🧴',
    name: L(
      '바디로션·크림',
      'Body lotion / cream',
      'ໂລຊັ່ນທາຕົວ',
      'โลชั่น / ครีมทาผิวกาย',
      'Lait / crème corps',
    ),
    why: L(
      '샤워 후 물기가 살짝 남았을 때 3분 안에. 건조한 곳엔 크림, 덥고 끈적일 땐 로션.',
      'Within three minutes of showering, on slightly damp skin. Cream for dry areas, lotion on hot sticky days.',
      'ພາຍໃນ 3 ນາທີຫຼັງອາບນ້ຳ ຕອນຜິວຍັງຊຸ່ມ. ຄີມສຳລັບບ່ອນແຫ້ງ, ໂລຊັ່ນໃນມື້ຮ້ອນ.',
      'ภายใน 3 นาทีหลังอาบน้ำขณะผิวยังหมาด ผิวแห้งใช้ครีม วันร้อนเหนอะหนะใช้โลชั่น',
      'Dans les trois minutes après la douche, sur peau humide. Crème si sèche, lait par temps chaud.',
    ),
    categories: ['바디케어'],
  },
  {
    id: 'bodyScrub',
    icon: '🧽',
    name: L(
      '바디 스크럽·각질 로션',
      'Body scrub / exfoliating lotion',
      'ສະຄັບຂັດຕົວ',
      'สครับ / โลชั่นผลัดเซลล์ผิวกาย',
      'Gommage / lait exfoliant',
    ),
    why: L(
      '많아야 주 1–2회, 작은 원을 그리며 약 30초. 닭살에는 문지르기보다 AHA·요소 로션이 순해요.',
      'At most once or twice a week, small circles for about thirty seconds. For "chicken skin", an AHA or urea lotion is gentler than scrubbing.',
      'ອາທິດລະ 1–2 ເທື່ອ ຫຼາຍສຸດ, ວົງນ້ອຍໆ 30 ວິນາທີ. ສຳລັບຜິວໜັງໄກ່ ໂລຊັ່ນ AHA ຫຼື ຢູເຣຍ ອ່ອນກວ່າ.',
      'มากสุดสัปดาห์ละ 1–2 ครั้ง วนเป็นวงเล็กราว 30 วินาที ผิวหนังไก่ใช้โลชั่น AHA หรือยูเรียจะอ่อนโยนกว่าขัด',
      'Une à deux fois par semaine au plus, 30 secondes. Pour la kératose pilaire, un lait AHA ou urée est plus doux.',
    ),
    categories: ['바디케어'],
  },
  {
    id: 'handCream',
    icon: '🤲',
    name: L('핸드크림', 'Hand cream', 'ຄີມທາມື', 'ครีมทามือ', 'Crème mains'),
    why: L(
      '손 씻을 때마다, 물기가 살짝 있을 때. 물·세제를 많이 만지면 장갑도 함께.',
      'After every handwash, on damp hands. If you work with water or detergent, wear gloves too.',
      'ທຸກເທື່ອຫຼັງລ້າງມື ຕອນມືຍັງຊຸ່ມ. ຖ້າຈັບນ້ຳ ຫຼື ສານຊັກຟອກຫຼາຍ ໃຫ້ໃສ່ຖົງມື.',
      'ทุกครั้งหลังล้างมือขณะมือยังหมาด ถ้าสัมผัสน้ำหรือสารซักฟอกมากให้สวมถุงมือด้วย',
      'Après chaque lavage, sur mains humides. Gants si vous touchez souvent eau ou détergent.',
    ),
    categories: ['핸드크림', '바디케어'],
  },
  {
    id: 'footCream',
    icon: '🦶',
    name: L(
      '풋크림 (요소)',
      'Foot cream (urea)',
      'ຄີມທາຕີນ',
      'ครีมทาเท้า (ยูเรีย)',
      'Crème pieds (urée)',
    ),
    why: L(
      '발뒤꿈치 각질에는 요소가 든 크림을 자기 전에. 양말을 신으면 더 잘 스며요.',
      'For hard heels, a urea cream at bedtime — socks over it help it sink in.',
      'ສຳລັບສົ້ນຕີນແຂງ ໃຊ້ຄີມຢູເຣຍກ່ອນນອນ ແລ້ວໃສ່ຖົງຕີນ.',
      'ส้นเท้าแข็งใช้ครีมยูเรียก่อนนอน ใส่ถุงเท้าทับจะซึมดีขึ้น',
      'Pour les talons, une crème à l’urée au coucher, avec des chaussettes.',
    ),
    categories: ['바디케어'],
  },
  {
    id: 'deodorant',
    icon: '🌬️',
    name: L(
      '데오드란트·땀 억제제',
      'Deodorant / antiperspirant',
      'ຢາດັບກິ່ນ',
      'ระงับกลิ่นกาย / ลดเหงื่อ',
      'Déodorant / anti-transpirant',
    ),
    why: L(
      '땀 억제제는 자기 전, 마른 피부에 바를 때 가장 잘 들어요.',
      'Antiperspirant works best at bedtime on dry skin.',
      'ຢາລົດເຫື່ອ ໄດ້ຜົນດີທີ່ສຸດກ່ອນນອນ ທາໃສ່ຜິວແຫ້ງ.',
      'ยาลดเหงื่อได้ผลดีที่สุดเมื่อทาก่อนนอนบนผิวแห้ง',
      'L’anti-transpirant agit mieux le soir, sur peau sèche.',
    ),
    categories: ['바디케어'],
  },
];

export const productKind = (id: string): ProductKind | undefined =>
  PRODUCT_KINDS.find((kind) => kind.id === id);

export interface SafetyCard {
  readonly id: string;
  readonly icon: string;
  readonly photo?: string;
  readonly title: Localized;
  readonly points: readonly Localized[];
}

export const PATCH_TEST: SafetyCard = {
  id: 'patch',
  icon: '🩹',
  title: L(
    '새 제품은 패치 테스트부터',
    'Patch-test every new product',
    'ທົດສອບຜະລິດຕະພັນໃໝ່ກ່ອນ',
    'ทดสอบผลิตภัณฑ์ใหม่ก่อนเสมอ',
    "Testez d'abord chaque nouveau produit",
  ),
  points: [
    L(
      '귀 뒤나 팔 안쪽에 동전 크기만큼, 하루 2번 바르고 며칠(가능하면 7–10일) 지켜보세요.',
      'Apply a coin-sized amount behind the ear or on the inner arm twice a day, and watch for a few days (7–10 if you can).',
      'ທາຂະໜາດເທົ່າຫຼຽນຢູ່ຫຼັງຫູ ຫຼື ແຂນດ້ານໃນ ມື້ລະ 2 ເທື່ອ ແລະ ເບິ່ງຈັກມື້ (7–10 ມື້ ຖ້າໄດ້).',
      'ทาปริมาณเท่าเหรียญหลังหูหรือท้องแขนวันละ 2 ครั้ง แล้วสังเกตสักหลายวัน (7–10 วันถ้าทำได้)',
      "Appliquez une noisette derrière l'oreille ou à l'intérieur du bras deux fois par jour, et observez quelques jours (7 à 10 si possible).",
    ),
    L(
      '붉어짐·가려움·따가움·부어오름이 생기면 씻어 내고 그 제품은 쓰지 마세요.',
      'If it turns red, itches, stings or swells, wash it off and do not use that product.',
      'ຖ້າແດງ, ຄັນ, ແສບ ຫຼື ບວມ ໃຫ້ລ້າງອອກ ແລະ ຢ່າໃຊ້ຜະລິດຕະພັນນັ້ນ.',
      'ถ้าแดง คัน แสบ หรือบวม ให้ล้างออกและอย่าใช้ผลิตภัณฑ์นั้น',
      "En cas de rougeur, démangeaison, picotement ou gonflement, rincez et n'utilisez pas ce produit.",
    ),
    L(
      '새 제품은 한 번에 하나씩, 2주 간격으로 더하면 무엇이 맞지 않는지 알 수 있어요.',
      'Add one new product at a time, about two weeks apart, so you can tell which one did not suit you.',
      'ເພີ່ມຜະລິດຕະພັນໃໝ່ເທື່ອລະອັນ ຫ່າງກັນປະມານ 2 ອາທິດ ເພື່ອຮູ້ວ່າອັນໃດບໍ່ເໝາະ.',
      'เพิ่มผลิตภัณฑ์ใหม่ทีละตัว ห่างกันราว 2 สัปดาห์ จะได้รู้ว่าตัวไหนไม่เหมาะ',
      "Ajoutez un seul nouveau produit à la fois, à deux semaines d'intervalle, pour savoir lequel ne vous convient pas.",
    ),
  ],
};

export const SUN_HABIT: SafetyCard = {
  id: 'sun',
  icon: '☀️',
  photo: '/gemini/C-07.jpg',
  title: L(
    '선크림은 매일, 다시 바르기까지',
    'Sunscreen every day — and again',
    'ກັນແດດທຸກມື້ ແລະ ທາຊ້ຳ',
    'กันแดดทุกวัน และทาซ้ำ',
    'Écran solaire chaque jour — et à nouveau',
  ),
  points: [
    L(
      'SPF 30 이상, 자외선 A·B를 함께 막는(PA+++ 이상, broad spectrum) 제품을 아침 마지막 단계로.',
      'SPF 30 or higher that blocks both UVA and UVB (broad spectrum, PA+++ or more), as the last morning step.',
      'SPF 30 ຂຶ້ນໄປ ທີ່ກັນທັງ UVA ແລະ UVB (PA+++ ຂຶ້ນໄປ) ເປັນຂັ້ນສຸດທ້າຍຕອນເຊົ້າ.',
      'SPF 30 ขึ้นไป ที่ป้องกันทั้ง UVA และ UVB (PA+++ ขึ้นไป) เป็นขั้นสุดท้ายตอนเช้า',
      'SPF 30 ou plus, large spectre UVA et UVB (PA+++ ou plus), en dernière étape du matin.',
    ),
    L(
      '밖에 있으면 2시간마다, 땀을 많이 흘리거나 물에 들어간 뒤에는 바로 다시 바르세요.',
      'Outdoors, reapply every two hours, and straight after sweating hard or swimming.',
      'ຢູ່ກາງແຈ້ງ ທາຊ້ຳທຸກ 2 ຊົ່ວໂມງ ແລະ ທັນທີຫຼັງເຫື່ອອອກຫຼາຍ ຫຼື ລົງນ້ຳ.',
      'อยู่กลางแจ้งทาซ้ำทุก 2 ชั่วโมง และทันทีหลังเหงื่อออกมากหรือลงน้ำ',
      "À l'extérieur, réappliquez toutes les deux heures, et aussitôt après avoir beaucoup transpiré ou nagé.",
    ),
    L(
      '흐리거나 비 오는 날에도 자외선은 구름을 통과해요. 창가 실내·오토바이 위에서도 바르세요.',
      'UV passes through cloud on grey and rainy days. Wear it by a window indoors and on a motorbike too.',
      'UV ຜ່ານເມກໄດ້ ແມ່ນແຕ່ມື້ຝົນຕົກ. ທາເຖິງຢູ່ໃນເຮືອນໃກ້ປ່ອງຢ້ຽມ ແລະ ຂີ່ລົດຈັກ.',
      'UV ทะลุเมฆได้แม้วันฟ้าครึ้มหรือฝนตก ทาด้วยแม้อยู่ในบ้านริมหน้าต่างหรือขี่มอเตอร์ไซค์',
      "Les UV traversent les nuages, même les jours de pluie. Mettez-en aussi près d'une fenêtre et à moto.",
    ),
  ],
};

/** The quest screen's own words — buttons and headings, not content. */
export const QUEST_TEXT = {
  start: L('시작하기', 'Start', 'ເລີ່ມ', 'เริ่ม', 'Commencer'),
  next: L('다음', 'Next', 'ຕໍ່ໄປ', 'ถัดไป', 'Suivant'),
  back: L('이전', 'Back', 'ກັບຄືນ', 'ย้อนกลับ', 'Retour'),
  seeResult: L(
    '내 결과 보기',
    'See my result',
    'ເບິ່ງຜົນຂອງຂ້ອຍ',
    'ดูผลของฉัน',
    'Voir mon résultat',
  ),
  pickAny: L(
    '해당하는 것을 모두 골라 주세요',
    'Pick all that apply',
    'ເລືອກທຸກຂໍ້ທີ່ກົງ',
    'เลือกทุกข้อที่ตรง',
    'Choisissez tout ce qui s’applique',
  ),
  pickUpTo: L(
    '최대 {n}개까지 골라 주세요',
    'Pick up to {n}',
    'ເລືອກໄດ້ເຖິງ {n} ຂໍ້',
    'เลือกได้สูงสุด {n} ข้อ',
    "Choisissez jusqu'à {n}",
  ),
  picked: L('{n}개 선택', '{n} picked', 'ເລືອກ {n}', 'เลือก {n}', '{n} choisi(s)'),
  learnDone: L(
    '알았어요, 이제 골라 볼게요',
    'Got it — let me choose',
    'ເຂົ້າໃຈແລ້ວ, ຂໍເລືອກ',
    'เข้าใจแล้ว ขอเลือก',
    'Compris — je choisis',
  ),
  progress: L(
    '{done} / {total}',
    '{done} / {total}',
    '{done} / {total}',
    '{done} / {total}',
    '{done} / {total}',
  ),
  chooseTrack: L(
    '어디부터 살펴볼까요?',
    'Where shall we start?',
    'ຈະເລີ່ມຈາກໃສ?',
    'เริ่มจากตรงไหนดี?',
    'Par où commencer ?',
  ),
  chooseTrackHelp: L(
    '얼굴부터 차례로 하는 것을 추천해요. 목은 얼굴 루틴에 함께 들어가요.',
    'We suggest the face first. The neck is part of the face routine.',
    'ແນະນຳໃຫ້ເລີ່ມຈາກໃບໜ້າ. ຄໍລວມຢູ່ໃນການດູແລໃບໜ້າ.',
    'แนะนำให้เริ่มจากใบหน้า คอรวมอยู่ในรูทีนใบหน้า',
    'Nous conseillons de commencer par le visage. Le cou fait partie de la routine du visage.',
  ),
  done: L('완료', 'Done', 'ສຳເລັດ', 'เสร็จแล้ว', 'Terminé'),
  resultEyebrow: L(
    '나의 케어 결과',
    'My care result',
    'ຜົນການດູແລຂອງຂ້ອຍ',
    'ผลการดูแลของฉัน',
    'Mon résultat',
  ),
  notDiagnosis: L(
    '이 결과는 답을 바탕으로 한 화장품 교육용 추정이에요. 의사의 진단이 아니에요.',
    'This is a cosmetic-education estimate based on your answers. It is not a medical diagnosis.',
    'ນີ້ແມ່ນການຄາດຄະເນເພື່ອການສຶກສາເຄື່ອງສຳອາງ ຈາກຄຳຕອບຂອງທ່ານ. ບໍ່ແມ່ນການວິນິດໄສຂອງທ່ານໝໍ.',
    'นี่คือการประเมินเพื่อการเรียนรู้เรื่องเครื่องสำอางจากคำตอบของคุณ ไม่ใช่การวินิจฉัยของแพทย์',
    "C'est une estimation éducative fondée sur vos réponses. Ce n'est pas un diagnostic médical.",
  ),
  likelyType: L(
    '가능성이 높은 타입',
    'Most likely type',
    'ປະເພດທີ່ເປັນໄປໄດ້ຫຼາຍທີ່ສຸດ',
    'ประเภทที่น่าจะเป็นที่สุด',
    'Type le plus probable',
  ),
  close: L(
    '가까운 타입: {name}',
    'Also close: {name}',
    'ໃກ້ຄຽງ: {name}',
    'ใกล้เคียง: {name}',
    'Proche aussi : {name}',
  ),
  sensitiveToo: L(
    '민감 경향',
    'a sensitive tendency',
    'ແນວໂນ້ມແພ້ງ່າຍ',
    'แนวโน้มแพ้ง่าย',
    'tendance sensible',
  ),
  notEnough: L(
    '답이 적어서 타입을 말하기 어려워요. «잘 모르겠어요»가 많으면 그래요. 아래 루틴은 모든 피부에 순한 기본이에요.',
    'Too few answers to suggest a type — that happens when most answers are "not sure". The routine below is a gentle basic for any skin.',
    'ຄຳຕອບໜ້ອຍເກີນໄປທີ່ຈະບອກປະເພດ. ກິດຈະວັດຂ້າງລຸ່ມແມ່ນພື້ນຖານອ່ອນໂຍນສຳລັບທຸກຜິວ.',
    'คำตอบน้อยเกินกว่าจะบอกประเภท รูทีนด้านล่างเป็นพื้นฐานที่อ่อนโยนสำหรับทุกสภาพผิว',
    'Trop peu de réponses pour proposer un type. La routine ci-dessous est une base douce pour toutes les peaux.',
  ),
  yourConcerns: L(
    '내가 고른 고민과 흔히 쓰이는 성분',
    'Your concerns and the ingredients commonly used',
    'ບັນຫາຂອງທ່ານ ແລະ ສ່ວນປະສົມທີ່ນິຍົມໃຊ້',
    'ปัญหาของคุณและส่วนผสมที่นิยมใช้',
    'Vos préoccupations et les ingrédients courants',
  ),
  commonlyUsed: L(
    '흔히 쓰이는 성분',
    'Commonly used',
    'ສ່ວນປະສົມທີ່ນິຍົມ',
    'ส่วนผสมที่นิยม',
    'Ingrédients courants',
  ),
  productTypes: L('주로 담긴 제품', 'Usually found in', 'ມັກພົບໃນ', 'มักพบใน', 'Souvent dans'),
  seeDoctor: L(
    '이럴 땐 피부과에',
    'See a dermatologist when',
    'ຄວນພົບແພດຜິວໜັງເມື່ອ',
    'ควรพบแพทย์ผิวหนังเมื่อ',
    'Consultez un dermatologue si',
  ),
  noConcerns: L(
    '고른 고민이 없어요. 기본 루틴과 선크림을 지키는 것이 가장 좋아요.',
    'No concerns picked. Keeping the basic routine and sunscreen is the best start.',
    'ບໍ່ໄດ້ເລືອກບັນຫາ. ການຮັກສາກິດຈະວັດພື້ນຖານ ແລະ ກັນແດດແມ່ນດີທີ່ສຸດ.',
    'ไม่ได้เลือกปัญหา การทำรูทีนพื้นฐานและทากันแดดคือจุดเริ่มต้นที่ดีที่สุด',
    'Aucune préoccupation choisie. La routine de base et l’écran solaire suffisent pour bien commencer.',
  ),
  morning: L(
    '아침 루틴',
    'Morning routine',
    'ກິດຈະວັດຕອນເຊົ້າ',
    'รูทีนตอนเช้า',
    'Routine du matin',
  ),
  evening: L('저녁 루틴', 'Evening routine', 'ກິດຈະວັດຕອນແລງ', 'รูทีนตอนเย็น', 'Routine du soir'),
  forYourAge: L(
    '{age}에게 중요한 것',
    'What matters in your {age}',
    'ສິ່ງສຳຄັນສຳລັບ {age}',
    'สิ่งสำคัญสำหรับวัย {age}',
    'Ce qui compte à {age}',
  ),
  forYourType: L(
    '내 타입에 맞는 사용감',
    'Textures for your type',
    'ເນື້ອຜະລິດຕະພັນທີ່ເໝາະກັບປະເພດຂອງທ່ານ',
    'เนื้อสัมผัสที่เหมาะกับประเภทของคุณ',
    'Textures pour votre type',
  ),
  habits: L(
    '생활 습관에서 챙길 것',
    'From your habits',
    'ຈາກນິໄສຂອງທ່ານ',
    'จากนิสัยของคุณ',
    'Selon vos habitudes',
  ),
  products: L(
    'KOREA GLOW에서 찾아볼 제품',
    'Products to look at in KOREA GLOW',
    'ຜະລິດຕະພັນທີ່ຄວນເບິ່ງໃນ KOREA GLOW',
    'ผลิตภัณฑ์ที่น่าดูใน KOREA GLOW',
    'Produits à regarder chez KOREA GLOW',
  ),
  productsNote: L(
    '제품 매칭은 회사 자료의 «맞는 피부·고민» 정보로 고른 것이며, 전문가 검토 전이에요. 라벨과 성분을 직접 확인하세요.',
    'Matched from the company\'s own "suits / concerns" notes, not yet expert-reviewed. Check the label and ingredients yourself.',
    'ຈັບຄູ່ຈາກຂໍ້ມູນ «ເໝາະກັບ» ຂອງບໍລິສັດ, ຍັງບໍ່ໄດ້ກວດໂດຍຜູ້ຊ່ຽວຊານ. ກວດສະຫຼາກ ແລະ ສ່ວນປະສົມເອງ.',
    'จับคู่จากข้อมูล «เหมาะกับ» ของบริษัท ยังไม่ผ่านการตรวจโดยผู้เชี่ยวชาญ ตรวจฉลากและส่วนผสมด้วยตัวเอง',
    "Sélection d'après les notes « convient à » de l'entreprise, non encore revues par un expert. Vérifiez l'étiquette.",
  ),
  sources: L('출처', 'Sources', 'ແຫຼ່ງຂໍ້ມູນ', 'แหล่งที่มา', 'Sources'),
  draft: L(
    'KOREA GLOW 소비자 교육 초안 — 공개된 피부과 학회 자료를 바탕으로 썼고, 전문가 검토 전이에요.',
    'KOREA GLOW consumer-education draft, written from published dermatology-society guidance; not yet expert-reviewed.',
    'ຮ່າງເອກະສານການສຶກສາຂອງ KOREA GLOW ຈາກຂໍ້ມູນສະມາຄົມແພດຜິວໜັງ; ຍັງບໍ່ໄດ້ກວດໂດຍຜູ້ຊ່ຽວຊານ.',
    'ฉบับร่างความรู้ผู้บริโภคของ KOREA GLOW จากข้อมูลสมาคมแพทย์ผิวหนัง ยังไม่ผ่านการตรวจโดยผู้เชี่ยวชาญ',
    "Brouillon éducatif KOREA GLOW, rédigé d'après les sociétés de dermatologie ; pas encore relu par un expert.",
  ),
  shareTitle: L(
    '내 결과를 파트너 매장에 보내기',
    'Send my result to a partner shop',
    'ສົ່ງຜົນໃຫ້ຮ້ານພາດເນີ',
    'ส่งผลของฉันให้ร้านพาร์ทเนอร์',
    'Envoyer mon résultat à une boutique partenaire',
  ),
  shareIntro: L(
    '타입·고민·목표 이름만 보내요. 나이·임신·생활 습관 답은 보내지 않아요. 상담받을 때 보여 주세요.',
    'Only the type, concern and goal names are sent — never your age, pregnancy or lifestyle answers. Show it when you ask a shop for advice.',
    'ສົ່ງສະເພາະຊື່ປະເພດ, ບັນຫາ ແລະ ເປົ້າໝາຍ — ບໍ່ສົ່ງອາຍຸ, ການຖືພາ ຫຼື ນິໄສ.',
    'ส่งเฉพาะชื่อประเภท ปัญหา และเป้าหมาย ไม่ส่งอายุ การตั้งครรภ์ หรือคำตอบเรื่องนิสัย ใช้ตอนขอคำแนะนำจากร้าน',
    'Seuls le type, les préoccupations et les objectifs sont envoyés — jamais l’âge, la grossesse ni les habitudes.',
  ),
  shareHead: L(
    'KOREA GLOW 케어 퀘스트 결과 — {track}',
    'KOREA GLOW Care Quest result — {track}',
    'ຜົນ KOREA GLOW Care Quest — {track}',
    'ผล KOREA GLOW Care Quest — {track}',
    'Résultat KOREA GLOW Care Quest — {track}',
  ),
  shareType: L(
    '가능성이 높은 타입',
    'Likely type',
    'ປະເພດທີ່ເປັນໄປໄດ້',
    'ประเภทที่น่าจะเป็น',
    'Type probable',
  ),
  shareConcerns: L('고민', 'Concerns', 'ບັນຫາ', 'ปัญหา', 'Préoccupations'),
  shareGoals: L('원하는 것', 'Goals', 'ເປົ້າໝາຍ', 'เป้าหมาย', 'Objectifs'),
  shareNone: L('없음', 'none', 'ບໍ່ມີ', 'ไม่มี', 'aucune'),
  shareUnknown: L(
    '답이 적어 아직 모름',
    'not enough answers yet',
    'ຄຳຕອບຍັງບໍ່ພໍ',
    'คำตอบยังไม่พอ',
    'pas assez de réponses',
  ),
  shareNotDx: L(
    '(화장품 교육용 추정 · 의사 진단 아님)',
    '(cosmetic-education estimate, not a medical diagnosis)',
    '(ການຄາດຄະເນເພື່ອການສຶກສາ ບໍ່ແມ່ນການວິນິດໄສ)',
    '(การประเมินเพื่อการเรียนรู้ ไม่ใช่การวินิจฉัยของแพทย์)',
    '(estimation éducative, pas un diagnostic)',
  ),
  share: L('보내기', 'Share', 'ແບ່ງປັນ', 'แชร์', 'Partager'),
  copy: L('복사', 'Copy', 'ສຳເນົາ', 'คัดลอก', 'Copier'),
  copied: L(
    '복사했어요. 메신저에 붙여넣으세요.',
    'Copied — paste it into your messenger.',
    'ສຳເນົາແລ້ວ — ວາງໃນແອັບແຊັດ.',
    'คัดลอกแล้ว วางในแอปแชทได้เลย',
    'Copié — collez-le dans votre messagerie.',
  ),
  resume: L(
    '이어서 하기 ({done}/{total})',
    'Continue ({done}/{total})',
    'ສືບຕໍ່ ({done}/{total})',
    'ทำต่อ ({done}/{total})',
    'Continuer ({done}/{total})',
  ),
  restart: L('처음부터 다시', 'Start again', 'ເລີ່ມໃໝ່', 'เริ่มใหม่', 'Recommencer'),
  otherTracks: L(
    '다른 곳도 살펴보기',
    'Look at another area',
    'ເບິ່ງສ່ວນອື່ນ',
    'ดูส่วนอื่น',
    'Voir une autre zone',
  ),
  learnMore: L('더 배우기', 'Learn more', 'ຮຽນຮູ້ເພີ່ມ', 'เรียนรู้เพิ่ม', 'En savoir plus'),
  savedNote: L(
    '답과 결과는 이 휴대폰에만 저장돼요. 어디로도 보내지 않아요.',
    'Your answers and result stay on this phone only. Nothing is sent anywhere.',
    'ຄຳຕອບ ແລະ ຜົນຢູ່ໃນໂທລະສັບນີ້ເທົ່ານັ້ນ. ບໍ່ສົ່ງໄປໃສ.',
    'คำตอบและผลลัพธ์อยู่ในโทรศัพท์เครื่องนี้เท่านั้น ไม่ส่งไปที่ใด',
    'Vos réponses restent sur ce téléphone. Rien n’est envoyé.',
  ),
  pregnancy: L(
    '임신·수유 중이라고 하셨어요. 레티놀 같은 일부 성분은 피하고, 새 제품은 의사와 먼저 상의하세요.',
    'You said you are pregnant or breastfeeding. Avoid some ingredients such as retinol, and ask your doctor before starting new products.',
    'ທ່ານບອກວ່າກຳລັງຖືພາ ຫຼື ລ້ຽງລູກດ້ວຍນົມ. ຫຼີກລ່ຽງບາງສ່ວນປະສົມ ເຊັ່ນ ເຣຕິນອລ ແລະ ປຶກສາທ່ານໝໍກ່ອນ.',
    'คุณบอกว่ากำลังตั้งครรภ์หรือให้นมบุตร หลีกเลี่ยงบางส่วนผสม เช่น เรตินอล และปรึกษาแพทย์ก่อนใช้ผลิตภัณฑ์ใหม่',
    "Vous avez indiqué être enceinte ou allaiter. Évitez certains ingrédients comme le rétinol et demandez l'avis de votre médecin.",
  ),
  avoidNow: L(
    '지금은 피하기',
    'Avoid for now',
    'ຫຼີກລ່ຽງໄວ້ກ່ອນ',
    'เลี่ยงไว้ก่อน',
    'À éviter pour le moment',
  ),
  listen: L('듣기', 'Listen', 'ຟັງ', 'ฟัง', 'Écouter'),
} as const;

export const COMMON_SOURCES: readonly Source[] = [
  {
    name: 'American Academy of Dermatology — skin care basics',
    url: 'https://www.aad.org/public/everyday-care/skin-care-basics',
  },
  {
    name: 'AAD — how to test skin care products (patch test)',
    url: 'https://www.aad.org/public/everyday-care/skin-care-basics/care/test-skin-care-products',
  },
  {
    name: 'AAD — how to apply sunscreen',
    url: 'https://www.aad.org/public/everyday-care/sun-protection/shade-clothing-sunscreen/how-to-apply-sunscreen',
  },
];
