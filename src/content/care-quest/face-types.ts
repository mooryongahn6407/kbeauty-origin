/**
 * Face track — the five skin types, explained before the reader is asked which is hers, and the
 * seven helper questions that let the app suggest one even when she does not know.
 *
 * Dry, oily, combination and normal are one axis (how much oil the skin makes); sensitive is a
 * second one that can sit on top of any of them. So the read-out names a base type and, when the
 * answers point to it, "with a sensitive tendency" — which is how dermatology societies describe
 * it, and why a single five-way pick was never enough.
 */
import { L, NOT_SURE } from './common';
import type { CareType, LearnCard, SingleStep } from './types';

export const BASE_TYPE_IDS = ['dry', 'oily', 'combination', 'normal'] as const;
export const SENSITIVE_ID = 'sensitive';

const SECTION_TYPE = L(
  '2단계 · 피부 타입',
  'Step 2 · Skin type',
  'ຂັ້ນ 2 · ປະເພດຜິວ',
  'ขั้นที่ 2 · ประเภทผิว',
  'Étape 2 · Type de peau',
);

export const SKIN_TYPES: readonly CareType[] = [
  {
    id: 'dry',
    photo: '/gemini/B-01.jpg',
    icon: '🏜️',
    name: L('건성', 'Dry', 'ຜິວແຫ້ງ', 'ผิวแห้ง', 'Sèche'),
    summary: L(
      '피지가 적어 쉽게 당기고 각질이 일어나는 피부예요. 잔주름이 일찍 보이기 쉬워요.',
      'Makes little oil, so it feels tight and flakes easily; fine lines tend to show early.',
      'ຜະລິດນ້ຳມັນໜ້ອຍ ຈຶ່ງຕຶງ ແລະ ລອກງ່າຍ; ຮອຍຫ່ຽວນ້ອຍໆມັກເຫັນໄວ.',
      'ผลิตน้ำมันน้อย จึงตึงและลอกเป็นขุยง่าย ริ้วรอยเล็กๆ มักเห็นเร็ว',
      'Produit peu de sébum : tiraille et pèle facilement ; les ridules apparaissent tôt.',
    ),
    care: [
      L(
        '거품이 적은 순한 세안제나 클렌징 밀크, 미지근한 물',
        'A gentle low-foam cleanser or cleansing milk, lukewarm water',
        'ສະບູລ້າງໜ້າອ່ອນໂຍນ ໂຟມໜ້ອຍ, ນ້ຳອຸ່ນ',
        'คลีนเซอร์อ่อนโยนฟองน้อยหรือน้ำนมล้างหน้า น้ำอุ่น',
        'Nettoyant doux peu moussant ou lait, eau tiède',
      ),
      L(
        '세안 후 3분 안에 보습 — 세라마이드·히알루론산·스쿠알란',
        'Moisturise within three minutes of washing — ceramide, hyaluronic acid, squalane',
        'ທາຄວາມຊຸ່ມພາຍໃນ 3 ນາທີຫຼັງລ້າງໜ້າ',
        'ทามอยส์เจอไรเซอร์ภายใน 3 นาทีหลังล้างหน้า',
        'Hydrater dans les trois minutes après le lavage',
      ),
      L(
        '진한 크림, 저녁엔 페이스 오일 한두 방울도 좋아요',
        'A richer cream; a drop or two of face oil at night',
        'ຄີມເຂັ້ມຂຸ້ນ; ຕອນແລງເພີ່ມນ້ຳມັນ 1–2 ຢົດ',
        'ครีมเนื้อเข้มข้น กลางคืนเพิ่มออยล์ 1–2 หยด',
        'Crème riche ; une ou deux gouttes d’huile le soir',
      ),
    ],
  },
  {
    id: 'oily',
    photo: '/gemini/B-02.jpg',
    icon: '💦',
    name: L('지성', 'Oily', 'ຜິວມັນ', 'ผิวมัน', 'Grasse'),
    summary: L(
      '피지가 많아 얼굴 전체가 번들거리고 모공이 크게 보이는 피부예요. 블랙헤드·여드름이 잘 생겨요.',
      'Makes plenty of oil: shiny all over, visible pores, prone to blackheads and breakouts.',
      'ຜະລິດນ້ຳມັນຫຼາຍ: ມັນທົ່ວໜ້າ, ຮູຂຸມຂົນໃຫຍ່, ເກີດສິວຫົວດຳ ແລະ ສິວງ່າຍ.',
      'ผลิตน้ำมันมาก หน้ามันทั้งหน้า รูขุมขนกว้าง เกิดสิวเสี้ยนและสิวง่าย',
      'Produit beaucoup de sébum : brille partout, pores visibles, points noirs et boutons.',
    ),
    care: [
      L(
        '아침·저녁 약산성 젤·폼 세안, 하루 2번이면 충분해요',
        'A mildly acidic gel or foam cleanser morning and night — twice a day is enough',
        'ລ້າງໜ້າດ້ວຍເຈວ/ໂຟມ ກົດອ່ອນ ເຊົ້າ-ແລງ, ມື້ລະ 2 ເທື່ອພໍ',
        'ล้างหน้าด้วยเจล/โฟมกรดอ่อน เช้า-เย็น วันละ 2 ครั้งพอ',
        'Gel ou mousse doux matin et soir — deux fois par jour suffit',
      ),
      L(
        '보습은 꼭, 대신 가벼운 젤·로션과 «논코메도제닉» 제품',
        'Still moisturise — with a light gel or lotion labelled non-comedogenic',
        'ຍັງຕ້ອງທາຄວາມຊຸ່ມ — ແບບເຈວເບົາ ທີ່ບໍ່ອຸດຕັນຮູຂຸມຂົນ',
        'ยังต้องบำรุง — ใช้เจลหรือโลชั่นบางเบาที่ไม่อุดตันรูขุมขน',
        'Hydrater quand même — gel léger non comédogène',
      ),
      L(
        'BHA·나이아신아마이드가 흔히 쓰여요. 너무 자주 씻거나 문지르면 오히려 번들거릴 수 있어요',
        'BHA and niacinamide are common choices. Over-washing and scrubbing can make shine worse',
        'BHA ແລະ ໄນອາຊິນາໄມນິຍົມໃຊ້. ລ້າງ ຫຼື ຂັດເລື້ອຍເກີນອາດມັນກວ່າເກົ່າ',
        'BHA และไนอาซินาไมด์นิยมใช้ การล้างหรือขัดบ่อยเกินไปอาจทำให้มันขึ้น',
        'BHA et niacinamide sont courants. Trop laver ou frotter peut aggraver la brillance',
      ),
    ],
  },
  {
    id: 'combination',
    photo: '/gemini/B-03.jpg',
    icon: '☯️',
    name: L('복합성', 'Combination', 'ຜິວປະສົມ', 'ผิวผสม', 'Mixte'),
    summary: L(
      'T존(이마·코·턱)은 번들거리고 볼은 보통이거나 당기는 피부예요. 가장 흔한 타입이에요.',
      'Oily T-zone (forehead, nose, chin) with normal or tight cheeks — the most common type.',
      'T-zone (ໜ້າຜາກ, ດັງ, ຄາງ) ມັນ ແຕ່ແກ້ມປົກກະຕິ ຫຼື ຕຶງ — ພົບຫຼາຍທີ່ສຸດ.',
      'T-zone (หน้าผาก จมูก คาง) มัน แต่แก้มปกติหรือตึง เป็นประเภทที่พบมากที่สุด',
      'Zone T (front, nez, menton) grasse, joues normales ou tiraillées — le type le plus courant.',
    ),
    care: [
      L(
        '얼굴 전체는 순하게 씻고, 부위별로 다르게 발라요',
        'Wash the whole face gently, then care for each zone differently',
        'ລ້າງທົ່ວໜ້າຢ່າງອ່ອນໂຍນ ແລ້ວດູແລແຕ່ລະສ່ວນຕ່າງກັນ',
        'ล้างหน้าอย่างอ่อนโยน แล้วดูแลแต่ละโซนต่างกัน',
        'Nettoyer doucement, puis adapter chaque zone',
      ),
      L(
        'T존은 가벼운 로션·BHA, 볼은 크림을 한 겹 더',
        'Light lotion or BHA on the T-zone, an extra layer of cream on the cheeks',
        'T-zone ໃຊ້ໂລຊັ່ນເບົາ/BHA, ແກ້ມທາຄີມເພີ່ມອີກຊັ້ນ',
        'T-zone ใช้โลชั่นบางเบาหรือ BHA แก้มทาครีมเพิ่มอีกชั้น',
        'Lotion légère ou BHA sur la zone T, crème en plus sur les joues',
      ),
      L(
        '계절 따라 바뀌어요 — 덥고 습할 땐 가볍게, 건기엔 보습 더',
        'It shifts with the season — lighter in the hot, humid months, richer in the dry season',
        'ປ່ຽນຕາມລະດູ — ລະດູຮ້ອນຊື້ນໃຊ້ເບົາ, ລະດູແລ້ງເພີ່ມຄວາມຊຸ່ມ',
        'เปลี่ยนตามฤดู ร้อนชื้นใช้บางเบา หน้าแล้งบำรุงมากขึ้น',
        'Change avec la saison — plus léger quand il fait chaud et humide, plus riche en saison sèche',
      ),
    ],
  },
  {
    id: 'normal',
    photo: '/gemini/B-05.jpg',
    icon: '🌸',
    name: L('중성', 'Normal', 'ຜິວປົກກະຕິ', 'ผิวธรรมดา', 'Normale'),
    summary: L(
      '당기지도 번들거리지도 않고, 트러블이 적고 결이 고른 피부예요.',
      'Neither tight nor shiny, with few breakouts and an even texture.',
      'ບໍ່ຕຶງ ບໍ່ມັນ, ມີສິວໜ້ອຍ ແລະ ຜິວລຽບສະເໝີ.',
      'ไม่ตึงไม่มัน มีสิวน้อย ผิวเรียบเสมอ',
      'Ni tiraillée ni brillante, peu de boutons, grain régulier.',
    ),
    care: [
      L(
        '지금 피부를 지키는 것이 목표 — 순한 세안, 보습, 선크림',
        'The goal is to keep it — gentle cleansing, moisturiser, sunscreen',
        'ເປົ້າໝາຍແມ່ນຮັກສາໄວ້ — ລ້າງອ່ອນໂຍນ, ຄວາມຊຸ່ມ, ກັນແດດ',
        'เป้าหมายคือรักษาไว้ ล้างหน้าอ่อนโยน บำรุง กันแดด',
        'Le but est de la préserver — nettoyage doux, hydratant, écran solaire',
      ),
      L(
        '항산화(비타민 C)를 아침에 더하면 자외선 대비에 좋아요',
        'An antioxidant (vitamin C) in the morning backs up sun protection',
        'ເພີ່ມວິຕາມິນ C ຕອນເຊົ້າ ຊ່ວຍເສີມການກັນແດດ',
        'เพิ่มวิตามินซีตอนเช้าช่วยเสริมการกันแดด',
        'Un antioxydant (vitamine C) le matin renforce la protection solaire',
      ),
      L(
        '나이가 들면 건성 쪽으로 바뀌기 쉬워요 — 보습을 조금씩 늘리세요',
        'Skin often drifts drier with age — add moisture gradually',
        'ອາຍຸຫຼາຍຂຶ້ນ ຜິວມັກແຫ້ງຂຶ້ນ — ເພີ່ມຄວາມຊຸ່ມເທື່ອລະໜ້ອຍ',
        'อายุมากขึ้นผิวมักแห้งลง ค่อยๆ เพิ่มการบำรุง',
        'Avec l’âge, la peau s’assèche — augmentez peu à peu l’hydratation',
      ),
    ],
  },
  {
    id: 'sensitive',
    photo: '/gemini/B-04.jpg',
    icon: '🌹',
    name: L('민감성', 'Sensitive', 'ຜິວແພ້ງ່າຍ', 'ผิวแพ้ง่าย', 'Sensible'),
    summary: L(
      '새 화장품·더위·햇볕·온도 변화에 쉽게 붉어지고 따갑거나 가려운 피부예요. 다른 타입과 함께 있을 수 있어요.',
      'Turns red, stings or itches easily with new products, heat, sun or temperature changes. It can come with any other type.',
      'ແດງ, ແສບ ຫຼື ຄັນງ່າຍ ເມື່ອໃຊ້ຜະລິດຕະພັນໃໝ່, ຮ້ອນ, ແດດ. ອາດມີຮ່ວມກັບປະເພດອື່ນ.',
      'แดง แสบ หรือคันง่ายเมื่อใช้ผลิตภัณฑ์ใหม่ อากาศร้อน แดด หรืออุณหภูมิเปลี่ยน อาจมีร่วมกับประเภทอื่น',
      'Rougit, pique ou démange facilement (nouveaux produits, chaleur, soleil). Peut s’ajouter à tout autre type.',
    ),
    care: [
      L(
        '성분이 적고 향료 없는 제품, 한 번에 하나씩',
        'Short ingredient lists without fragrance, one new product at a time',
        'ຜະລິດຕະພັນສ່ວນປະສົມໜ້ອຍ ບໍ່ມີນ້ຳຫອມ, ເທື່ອລະອັນ',
        'ผลิตภัณฑ์ส่วนผสมน้อย ไม่มีน้ำหอม ทีละตัว',
        'Formules courtes sans parfum, un nouveau produit à la fois',
      ),
      L(
        '병풀(시카)·판테놀·세라마이드 같은 진정·장벽 성분이 흔히 쓰여요',
        'Soothing and barrier ingredients such as centella (cica), panthenol and ceramide are common',
        'ສ່ວນປະສົມຜ່ອນຄາຍ ເຊັ່ນ ໃບບົວບົກ (ຊິກາ), ແພນທີນອລ, ເຊຣາໄມ ນິຍົມໃຊ້',
        'ส่วนผสมปลอบประโลม เช่น ใบบัวบก (ซิก้า) แพนทีนอล เซราไมด์ นิยมใช้',
        'Apaisants et réparateurs courants : centella (cica), panthénol, céramides',
      ),
      L(
        '강한 각질 제거·스크럽은 피하고, 패치 테스트를 꼭',
        'Skip strong peels and scrubs, and always patch-test',
        'ຫຼີກລ່ຽງການຂັດແຮງ ແລະ ທົດສອບກ່ອນສະເໝີ',
        'เลี่ยงการผลัดเซลล์แรงๆ และสครับ ทดสอบก่อนเสมอ',
        'Évitez gommages et peelings forts ; testez toujours',
      ),
    ],
  },
];

export const skinType = (id: string): CareType | undefined =>
  SKIN_TYPES.find((type) => type.id === id);

const SIGNS: Record<string, readonly ReturnType<typeof L>[]> = {
  dry: [
    L(
      '세안 후 금방 당겨요',
      'Feels tight soon after washing',
      'ຕຶງໄວຫຼັງລ້າງໜ້າ',
      'ตึงเร็วหลังล้างหน้า',
      'Tiraille juste après le lavage',
    ),
    L(
      '각질이 하얗게 일어나요',
      'White flakes appear',
      'ມີຂີ້ໄຄສີຂາວລອກ',
      'มีขุยขาวลอก',
      'Petites peaux blanches',
    ),
    L(
      '모공이 거의 안 보여요',
      'Pores are hard to see',
      'ຮູຂຸມຂົນເກືອບບໍ່ເຫັນ',
      'แทบไม่เห็นรูขุมขน',
      'Pores peu visibles',
    ),
  ],
  oily: [
    L(
      '오후면 얼굴 전체가 번들거려요',
      'Shiny all over by afternoon',
      'ຕອນບ່າຍມັນທົ່ວໜ້າ',
      'บ่ายๆ หน้ามันทั้งหน้า',
      "Brille partout l'après-midi",
    ),
    L(
      '모공이 볼까지 크게 보여요',
      'Large pores, even on the cheeks',
      'ຮູຂຸມຂົນໃຫຍ່ ເຖິງແກ້ມ',
      'รูขุมขนกว้างถึงแก้ม',
      'Pores dilatés jusqu’aux joues',
    ),
    L(
      '화장이 잘 무너져요',
      'Make-up slides off',
      'ເຄື່ອງແຕ່ງໜ້າຫຼຸດງ່າຍ',
      'เมคอัพหลุดง่าย',
      'Le maquillage file',
    ),
  ],
  combination: [
    L(
      '볼은 당기는데 코·이마는 번들',
      'Tight cheeks, shiny nose and forehead',
      'ແກ້ມຕຶງ ແຕ່ດັງ-ໜ້າຜາກມັນ',
      'แก้มตึงแต่จมูกหน้าผากมัน',
      'Joues tiraillées, nez et front brillants',
    ),
    L(
      '코 주변에만 모공·블랙헤드',
      'Pores and blackheads mostly around the nose',
      'ຮູຂຸມຂົນ ແລະ ສິວຫົວດຳຢູ່ອ້ອມດັງ',
      'รูขุมขนและสิวเสี้ยนรอบจมูก',
      'Pores et points noirs autour du nez',
    ),
    L(
      '계절 따라 피부가 달라져요',
      'Skin changes with the season',
      'ຜິວປ່ຽນຕາມລະດູ',
      'ผิวเปลี่ยนตามฤดู',
      'La peau change avec les saisons',
    ),
  ],
  normal: [
    L(
      '하루 종일 편안해요',
      'Comfortable all day',
      'ສະບາຍທັງມື້',
      'สบายทั้งวัน',
      'Confortable toute la journée',
    ),
    L(
      '트러블이 드물어요',
      'Breakouts are rare',
      'ສິວບໍ່ຄ່ອຍມີ',
      'สิวขึ้นน้อย',
      'Rares imperfections',
    ),
    L(
      '결이 고르고 부드러워요',
      'Smooth, even texture',
      'ຜິວລຽບ ສະເໝີ',
      'ผิวเรียบเนียน',
      'Grain lisse et régulier',
    ),
  ],
  sensitive: [
    L(
      '새 화장품에 따갑거나 붉어져요',
      'New products sting or redden',
      'ຜະລິດຕະພັນໃໝ່ເຮັດໃຫ້ແສບ ຫຼື ແດງ',
      'ผลิตภัณฑ์ใหม่ทำให้แสบหรือแดง',
      'Les nouveaux produits piquent ou rougissent',
    ),
    L(
      '더위·햇볕에 쉽게 붉어져요',
      'Flushes easily in heat or sun',
      'ແດງງ່າຍເມື່ອຮ້ອນ ຫຼື ຖືກແດດ',
      'แดงง่ายเมื่อร้อนหรือโดนแดด',
      'Rougit vite à la chaleur ou au soleil',
    ),
    L(
      '가렵거나 화끈거릴 때가 있어요',
      'Sometimes itchy or burning',
      'ບາງຄັ້ງຄັນ ຫຼື ຮ້ອນຜ່າວ',
      'บางครั้งคันหรือแสบร้อน',
      'Parfois démangeaisons ou brûlures',
    ),
  ],
};

export const TYPE_CARDS: readonly LearnCard[] = SKIN_TYPES.map((type) => ({
  id: type.id,
  icon: type.icon,
  title: type.name,
  body: type.summary,
  signs: SIGNS[type.id] ?? [],
  ...(type.photo ? { image: type.photo } : {}),
}));

/** Scores helper: a short way to write "this answer points 3 to dry". */
const s = (scores: Record<string, number>) => scores;

export const TYPE_STEPS: readonly SingleStep[] = [
  {
    kind: 'single',
    id: 'typeSelf',
    section: SECTION_TYPE,
    prompt: L(
      '설명을 들어 보니, 내 피부는 어디에 가장 가까운가요?',
      'Having heard them, which sounds most like your skin?',
      'ຫຼັງຈາກຟັງແລ້ວ ຜິວຂອງທ່ານໃກ້ກັບແບບໃດທີ່ສຸດ?',
      'ฟังแล้ว ผิวของคุณใกล้เคียงแบบไหนที่สุด?',
      'D’après ces descriptions, laquelle ressemble le plus à votre peau ?',
    ),
    help: L(
      '몰라도 괜찮아요. 다음 질문 일곱 개로 함께 찾아볼게요.',
      "It's fine not to know — the next seven questions will help work it out.",
      'ບໍ່ຮູ້ກໍບໍ່ເປັນຫຍັງ — 7 ຄຳຖາມຕໍ່ໄປຈະຊ່ວຍຊອກຫາ.',
      'ไม่รู้ก็ไม่เป็นไร คำถาม 7 ข้อต่อไปจะช่วยหาคำตอบ',
      'Pas grave si vous ne savez pas — les sept questions suivantes aideront.',
    ),
    choices: [
      ...SKIN_TYPES.map((type) => ({
        id: type.id,
        icon: type.icon,
        label: type.name,
        scores: s({ [type.id]: 2 }),
      })),
      NOT_SURE,
    ],
  },
  {
    kind: 'single',
    id: 'afterWash',
    section: SECTION_TYPE,
    prompt: L(
      '세안 후 아무것도 바르지 않고 30분이 지나면 얼굴이 어떤가요?',
      'Thirty minutes after washing, with nothing on, how does your face feel?',
      'ລ້າງໜ້າແລ້ວ ບໍ່ທາຫຍັງ 30 ນາທີ ໜ້າຂອງທ່ານເປັນແນວໃດ?',
      'ล้างหน้าแล้วไม่ทาอะไร 30 นาที หน้าของคุณเป็นอย่างไร?',
      'Trente minutes après le lavage, sans rien appliquer, comment est votre visage ?',
    ),
    choices: [
      {
        id: 'tightAll',
        icon: '🏜️',
        label: L(
          '전체가 당기고 건조해요',
          'Tight and dry all over',
          'ຕຶງ ແລະ ແຫ້ງທົ່ວໜ້າ',
          'ตึงและแห้งทั้งหน้า',
          'Tiraillé et sec partout',
        ),
        scores: s({ dry: 3 }),
      },
      {
        id: 'mixed',
        icon: '☯️',
        label: L(
          '볼은 당기는데 이마·코는 번들거려요',
          'Tight cheeks, shiny forehead and nose',
          'ແກ້ມຕຶງ ແຕ່ໜ້າຜາກ-ດັງມັນ',
          'แก้มตึงแต่หน้าผากและจมูกมัน',
          'Joues tiraillées, front et nez brillants',
        ),
        scores: s({ combination: 3 }),
      },
      {
        id: 'shinyAll',
        icon: '💦',
        label: L(
          '얼굴 전체가 번들거려요',
          'Shiny all over',
          'ມັນທົ່ວໜ້າ',
          'มันทั้งหน้า',
          'Brillant partout',
        ),
        scores: s({ oily: 3 }),
      },
      {
        id: 'comfortable',
        icon: '🌸',
        label: L(
          '편안하고 아무렇지 않아요',
          'Comfortable, nothing special',
          'ສະບາຍດີ ບໍ່ມີຫຍັງ',
          'สบายดี ไม่มีอะไร',
          'Confortable, rien de spécial',
        ),
        scores: s({ normal: 3 }),
      },
      NOT_SURE,
    ],
  },
  {
    kind: 'single',
    id: 'blotting',
    section: SECTION_TYPE,
    prompt: L(
      '오후 2–3시쯤 기름종이나 티슈로 얼굴을 눌러 보면?',
      'Press a blotting paper or tissue to your face around 2–3 pm. What do you see?',
      'ປະມານບ່າຍ 2–3 ໂມງ ເອົາເຈ້ຍຊັບນ້ຳມັນກົດໜ້າ ເຫັນຫຍັງ?',
      'ราวบ่าย 2–3 โมง ใช้กระดาษซับมันกดหน้า เห็นอะไร?',
      'Vers 14–15 h, appuyez un papier matifiant sur votre visage. Que voyez-vous ?',
    ),
    choices: [
      {
        id: 'nothing',
        icon: '📄',
        label: L(
          '거의 묻어나지 않아요',
          'Almost nothing',
          'ເກືອບບໍ່ມີຫຍັງ',
          'แทบไม่มีอะไร',
          'Presque rien',
        ),
        scores: s({ dry: 2, normal: 1 }),
      },
      {
        id: 'tzone',
        icon: '👃',
        label: L(
          '코·이마에서만 묻어나요',
          'Only from nose and forehead',
          'ສະເພາະດັງ ແລະ ໜ້າຜາກ',
          'เฉพาะจมูกและหน้าผาก',
          'Seulement nez et front',
        ),
        scores: s({ combination: 2, normal: 1 }),
      },
      {
        id: 'everywhere',
        icon: '💧',
        label: L(
          '얼굴 전체에서 많이 묻어나요',
          'A lot, from everywhere',
          'ຫຼາຍ ທົ່ວໜ້າ',
          'มาก ทั้งหน้า',
          'Beaucoup, partout',
        ),
        scores: s({ oily: 2 }),
      },
      NOT_SURE,
    ],
  },
  {
    kind: 'single',
    id: 'pores',
    section: SECTION_TYPE,
    prompt: L(
      '거울로 보면 모공은 어떤가요?',
      'In the mirror, how do your pores look?',
      'ເບິ່ງໃນແວ່ນ ຮູຂຸມຂົນເປັນແນວໃດ?',
      'ส่องกระจก รูขุมขนเป็นอย่างไร?',
      'Dans le miroir, vos pores sont…',
    ),
    choices: [
      {
        id: 'barely',
        icon: '🔍',
        label: L(
          '거의 안 보여요',
          'Barely visible',
          'ເກືອບບໍ່ເຫັນ',
          'แทบไม่เห็น',
          'À peine visibles',
        ),
        scores: s({ dry: 1, normal: 1 }),
      },
      {
        id: 'nose',
        icon: '👃',
        label: L(
          '코 주변만 보여요',
          'Only around the nose',
          'ສະເພາະອ້ອມດັງ',
          'เฉพาะรอบจมูก',
          'Seulement autour du nez',
        ),
        scores: s({ combination: 2 }),
      },
      {
        id: 'large',
        icon: '⭕',
        label: L(
          '볼까지 크게 보여요',
          'Large, even on the cheeks',
          'ໃຫຍ່ ເຖິງແກ້ມ',
          'กว้างถึงแก้ม',
          'Dilatés jusqu’aux joues',
        ),
        scores: s({ oily: 2 }),
      },
      NOT_SURE,
    ],
  },
  {
    kind: 'single',
    id: 'flakes',
    section: SECTION_TYPE,
    prompt: L(
      '각질이 하얗게 일어나는 곳이 있나요?',
      'Do you get white flaky patches?',
      'ມີບ່ອນທີ່ລອກເປັນຂີ້ໄຄສີຂາວບໍ?',
      'มีบริเวณที่ลอกเป็นขุยขาวไหม?',
      'Avez-vous des zones qui pèlent ?',
    ),
    choices: [
      {
        id: 'often',
        icon: '❄️',
        label: L(
          '자주, 여러 곳에',
          'Often, in several places',
          'ເລື້ອຍໆ ຫຼາຍບ່ອນ',
          'บ่อย หลายจุด',
          'Souvent, à plusieurs endroits',
        ),
        scores: s({ dry: 2 }),
      },
      {
        id: 'cheeks',
        icon: '🙂',
        label: L(
          '볼·입가에만 가끔',
          'Sometimes, on cheeks or around the mouth',
          'ບາງຄັ້ງ ທີ່ແກ້ມ ຫຼື ອ້ອມປາກ',
          'บางครั้งที่แก้มหรือรอบปาก',
          'Parfois, joues ou autour de la bouche',
        ),
        scores: s({ combination: 1, dry: 1 }),
      },
      {
        id: 'rarely',
        icon: '✨',
        label: L('거의 없어요', 'Hardly ever', 'ເກືອບບໍ່ມີ', 'แทบไม่มี', 'Presque jamais'),
        scores: s({ oily: 1, normal: 1 }),
      },
      NOT_SURE,
    ],
  },
  {
    kind: 'single',
    id: 'newProducts',
    section: SECTION_TYPE,
    prompt: L(
      '새 화장품을 쓰면 따갑거나 붉어진 적이 있나요?',
      'Has a new product ever made your face sting or turn red?',
      'ຜະລິດຕະພັນໃໝ່ເຄີຍເຮັດໃຫ້ໜ້າແສບ ຫຼື ແດງບໍ?',
      'ผลิตภัณฑ์ใหม่เคยทำให้หน้าแสบหรือแดงไหม?',
      'Un nouveau produit vous a-t-il déjà piqué ou rougi le visage ?',
    ),
    choices: [
      {
        id: 'often',
        icon: '🌹',
        label: L('자주 그래요', 'Often', 'ເລື້ອຍໆ', 'บ่อย', 'Souvent'),
        scores: s({ sensitive: 3 }),
      },
      {
        id: 'sometimes',
        icon: '🙂',
        label: L('가끔 그래요', 'Sometimes', 'ບາງຄັ້ງ', 'บางครั้ง', 'Parfois'),
        scores: s({ sensitive: 1 }),
      },
      {
        id: 'never',
        icon: '💪',
        label: L('거의 없어요', 'Hardly ever', 'ເກືອບບໍ່ເຄີຍ', 'แทบไม่เคย', 'Presque jamais'),
      },
      NOT_SURE,
    ],
  },
  {
    kind: 'single',
    id: 'flushing',
    section: SECTION_TYPE,
    prompt: L(
      '더위·햇볕·매운 음식·온도 변화에 얼굴이 쉽게 붉어지나요?',
      'Does your face flush easily with heat, sun, spicy food or temperature changes?',
      'ໜ້າແດງງ່າຍບໍ ເມື່ອຮ້ອນ, ຖືກແດດ, ກິນເຜັດ ຫຼື ອຸນຫະພູມປ່ຽນ?',
      'หน้าแดงง่ายไหมเมื่ออากาศร้อน โดนแดด กินเผ็ด หรืออุณหภูมิเปลี่ยน?',
      'Votre visage rougit-il facilement (chaleur, soleil, épices, changements de température) ?',
    ),
    choices: [
      {
        id: 'often',
        icon: '🔥',
        label: L('자주 그래요', 'Often', 'ເລື້ອຍໆ', 'บ่อย', 'Souvent'),
        scores: s({ sensitive: 2 }),
      },
      {
        id: 'sometimes',
        icon: '🙂',
        label: L('가끔 그래요', 'Sometimes', 'ບາງຄັ້ງ', 'บางครั้ง', 'Parfois'),
        scores: s({ sensitive: 1 }),
      },
      {
        id: 'never',
        icon: '💪',
        label: L('거의 없어요', 'Hardly ever', 'ເກືອບບໍ່ເຄີຍ', 'แทบไม่เคย', 'Presque jamais'),
      },
      NOT_SURE,
    ],
  },
  {
    kind: 'single',
    id: 'makeupWear',
    section: SECTION_TYPE,
    prompt: L(
      '파운데이션·쿠션은 하루 동안 어떻게 되나요?',
      'How does your foundation or cushion wear through the day?',
      'ຮອງພື້ນ ຫຼື ຄຸຊັ່ນ ຢູ່ໄດ້ແນວໃດໃນມື້ໜຶ່ງ?',
      'รองพื้นหรือคุชชั่นติดทนแค่ไหนระหว่างวัน?',
      'Comment tient votre fond de teint dans la journée ?',
    ),
    choices: [
      {
        id: 'cakey',
        icon: '🏜️',
        label: L(
          '들뜨고 갈라져요',
          'Patchy and cracked',
          'ລອກ ແລະ ແຕກ',
          'ลอยและแตก',
          'Il craquelle',
        ),
        scores: s({ dry: 2 }),
      },
      {
        id: 'tzone',
        icon: '☯️',
        label: L(
          'T존만 무너져요',
          'Fades only on the T-zone',
          'ຫຼຸດສະເພາະ T-zone',
          'หลุดเฉพาะ T-zone',
          'Il file sur la zone T seulement',
        ),
        scores: s({ combination: 2 }),
      },
      {
        id: 'slides',
        icon: '💦',
        label: L(
          '전체가 번들거리며 무너져요',
          'Turns shiny and slides off everywhere',
          'ມັນ ແລະ ຫຼຸດທົ່ວໜ້າ',
          'มันและหลุดทั้งหน้า',
          'Il brille et file partout',
        ),
        scores: s({ oily: 2 }),
      },
      {
        id: 'stays',
        icon: '🌸',
        label: L('잘 유지돼요', 'Stays put', 'ຢູ່ດີ', 'ติดทนดี', 'Il tient bien'),
        scores: s({ normal: 2 }),
      },
      {
        ...NOT_SURE,
        label: L(
          '화장을 안 해요 / 모르겠어요',
          "I don't wear it / not sure",
          'ບໍ່ແຕ່ງໜ້າ / ບໍ່ແນ່ໃຈ',
          'ไม่แต่งหน้า / ไม่แน่ใจ',
          'Je n’en porte pas / je ne sais pas',
        ),
      },
    ],
  },
];

export const TYPE_LEARN_SECTION = SECTION_TYPE;
