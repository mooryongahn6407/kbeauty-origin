/**
 * Body track: everything below the jawline except the scalp — with the neck and upper chest
 * handed to the face routine (thin, always in the sun, cared for with face products), and hands
 * and feet as their own areas. Ten concerns, including the heat-and-humidity ones that matter in
 * Laos (heat rash, sweat, back breakouts, tanning).
 *
 * Sources: AAD, NHS, Cleveland Clinic and the Skin Cancer Foundation via the 2026-10-12 research
 * pass (search excerpts; a person still needs to read the pages). "Within three minutes of the
 * shower" is the app's pick where AAD pages say two, three or five — recorded in docs/기억.
 */
import { L, NONE, NOT_SURE, PATCH_TEST } from './common';
import type {
  AdviceBlock,
  CareConcern,
  CarePlan,
  CareTrack,
  CareType,
  QuestAnswers,
  QuestStep,
  RoutineLine,
  Source,
  TypeReading,
} from './types';

const SECTION_AREA = L(
  '1단계 · 바디는 어디까지?',
  'Step 1 · What counts as body',
  'ຂັ້ນ 1 · ຮ່າງກາຍລວມຫຍັງແດ່',
  'ขั้นที่ 1 · ผิวกายรวมถึงตรงไหน',
  'Étape 1 · Ce que couvre le corps',
);
const SECTION_TYPE = L(
  '2단계 · 몸 피부 타입',
  'Step 2 · Body skin type',
  'ຂັ້ນ 2 · ປະເພດຜິວກາຍ',
  'ขั้นที่ 2 · ประเภทผิวกาย',
  'Étape 2 · Type de peau du corps',
);
const SECTION_CONCERNS = L(
  '3단계 · 고민',
  'Step 3 · Concerns',
  'ຂັ້ນ 3 · ບັນຫາ',
  'ขั้นที่ 3 · ปัญหา',
  'Étape 3 · Préoccupations',
);
const SECTION_HABITS = L(
  '4단계 · 습관과 목표',
  'Step 4 · Habits & goals',
  'ຂັ້ນ 4 · ນິໄສ ແລະ ເປົ້າໝາຍ',
  'ขั้นที่ 4 · นิสัยและเป้าหมาย',
  'Étape 4 · Habitudes & objectifs',
);

export const BODY_TYPES: readonly CareType[] = [
  {
    id: 'dry',
    icon: '🏜️',
    name: L('건조한 몸 피부', 'Dry body skin', 'ຜິວກາຍແຫ້ງ', 'ผิวกายแห้ง', 'Peau du corps sèche'),
    summary: L(
      '샤워 후 당기고 가려우며, 정강이·팔에 하얀 각질이 일어나요.',
      'Tight and itchy after a shower, with white flakes on the shins and arms.',
      'ຕຶງ ແລະ ຄັນຫຼັງອາບນ້ຳ, ມີຂີ້ໄຄຂາວທີ່ແຂ້ງ ແລະ ແຂນ.',
      'ตึงและคันหลังอาบน้ำ มีขุยขาวที่หน้าแข้งและแขน',
      'Tiraille et gratte après la douche, peaux blanches sur tibias et bras.',
    ),
    care: [
      L(
        '미지근한 물로 5–10분, 순한 무향 바디워시.',
        'Five to ten minutes in lukewarm water with a mild, fragrance-free wash.',
        'ນ້ຳອຸ່ນ 5–10 ນາທີ, ສະບູອ່ອນໂຍນ.',
        'อาบน้ำอุ่น 5–10 นาที ใช้ครีมอาบน้ำอ่อนโยนไร้น้ำหอม',
        'Eau tiède 5 à 10 minutes, gel doux sans parfum.',
      ),
      L(
        '샤워 후 3분 안에, 물기가 살짝 남은 피부에 크림.',
        'Cream within three minutes of the shower, on slightly damp skin.',
        'ທາຄີມພາຍໃນ 3 ນາທີ ຕອນຜິວຍັງຊຸ່ມ.',
        'ทาครีมภายใน 3 นาทีหลังอาบน้ำขณะผิวยังหมาด',
        'Crème dans les trois minutes, sur peau encore humide.',
      ),
    ],
  },
  {
    id: 'normal',
    icon: '🌸',
    name: L(
      '보통 몸 피부',
      'Balanced body skin',
      'ຜິວກາຍປົກກະຕິ',
      'ผิวกายปกติ',
      'Peau du corps équilibrée',
    ),
    summary: L(
      '특별히 당기거나 번들거리지 않아요. 계절과 에어컨에 따라 조금씩 달라져요.',
      'Neither tight nor oily; shifts a little with the season and air-conditioning.',
      'ບໍ່ຕຶງ ບໍ່ມັນ; ປ່ຽນໜ້ອຍໜຶ່ງຕາມລະດູ.',
      'ไม่ตึงไม่มัน เปลี่ยนเล็กน้อยตามฤดูและแอร์',
      'Ni tiraillée ni grasse ; varie un peu selon la saison.',
    ),
    care: [
      L(
        '가벼운 로션으로 유지, 팔다리에도 선크림.',
        'Keep it with a light lotion — and sunscreen on arms and legs.',
        'ໂລຊັ່ນເບົາ ແລະ ກັນແດດທີ່ແຂນຂາ.',
        'โลชั่นบางเบา และกันแดดที่แขนขา',
        'Un lait léger, et de l’écran sur bras et jambes.',
      ),
    ],
  },
  {
    id: 'oily',
    icon: '💦',
    name: L(
      '땀·피지가 많은 몸 피부',
      'Sweaty, oily body skin',
      'ຜິວກາຍມັນ ເຫື່ອຫຼາຍ',
      'ผิวกายมันและเหงื่อมาก',
      'Peau du corps grasse',
    ),
    summary: L(
      '등·가슴이 번들거리고 땀이 많아 뾰루지·땀띠가 잘 생겨요.',
      'Back and chest get shiny and sweaty, with breakouts and heat rash.',
      'ຫຼັງ ແລະ ເອິກມັນ ເຫື່ອຫຼາຍ ເກີດສິວ ແລະ ຜື່ນຮ້ອນງ່າຍ.',
      'หลังและหน้าอกมัน เหงื่อมาก เกิดสิวและผดผื่นง่าย',
      'Dos et poitrine brillants, boutons et bourbouille.',
    ),
    care: [
      L(
        '땀 흘린 뒤 바로 샤워, 젖은 운동복은 빨리 갈아입어요.',
        'Shower soon after sweating, and change out of damp workout clothes quickly.',
        'ອາບນ້ຳທັນທີຫຼັງເຫື່ອອອກ ແລະ ປ່ຽນເສື້ອປຽກ.',
        'อาบน้ำทันทีหลังเหงื่อออก และเปลี่ยนเสื้อเปียกเร็วๆ',
        'Douche après l’effort, vêtements humides changés vite.',
      ),
      L(
        '가벼운 젤·로션, 면처럼 통기성 좋은 헐렁한 옷.',
        'Light gel or lotion, and loose, breathable clothes such as cotton.',
        'ເຈວເບົາ ແລະ ເສື້ອຜ້າຝ້າຍຫຼວມ.',
        'เจลหรือโลชั่นบางเบา และเสื้อผ้าหลวมระบายอากาศ เช่น ผ้าฝ้าย',
        'Gel léger, vêtements amples et respirants.',
      ),
    ],
  },
  {
    id: 'sensitive',
    icon: '🌹',
    name: L(
      '예민한 몸 피부',
      'Reactive body skin',
      'ຜິວກາຍແພ້ງ່າຍ',
      'ผิวกายแพ้ง่าย',
      'Peau du corps réactive',
    ),
    summary: L(
      '새 로션·세제·옷감에 가렵거나 붉어져요. 다른 타입과 함께 있을 수 있어요.',
      'Itches or reddens with new lotions, detergents or fabrics; can come with any other type.',
      'ຄັນ ຫຼື ແດງ ກັບໂລຊັ່ນ, ສານຊັກຟອກ ຫຼື ຜ້າໃໝ່.',
      'คันหรือแดงกับโลชั่น ผงซักฟอก หรือเนื้อผ้าใหม่',
      'Démange ou rougit avec lessives, laits ou tissus nouveaux.',
    ),
    care: [
      L(
        '무향 제품, 향 없는 세탁 세제, 새 제품은 하나씩 패치 테스트.',
        'Fragrance-free products and laundry detergent; patch-test new things one at a time.',
        'ຜະລິດຕະພັນ ແລະ ຜົງຊັກຟອກບໍ່ມີນ້ຳຫອມ; ທົດສອບເທື່ອລະອັນ.',
        'ผลิตภัณฑ์และผงซักฟอกไร้น้ำหอม ทดสอบของใหม่ทีละอย่าง',
        'Sans parfum, lessive comprise ; tester un produit à la fois.',
      ),
    ],
  },
];

export const BODY_CONCERNS: readonly CareConcern[] = [
  {
    id: 'dryBody',
    icon: '🏜️',
    governedId: 'CON-012',
    name: L(
      '팔다리 건조·각질',
      'Dry, flaky arms and legs',
      'ແຂນຂາແຫ້ງ ລອກ',
      'แขนขาแห้งเป็นขุย',
      'Bras et jambes secs',
    ),
    what: L(
      '정강이·팔이 하얗게 일어나고 당기며 가려워요.',
      'Shins and arms flake white, feel tight and itch.',
      'ແຂ້ງ ແລະ ແຂນລອກຂາວ ຕຶງ ຄັນ.',
      'หน้าแข้งและแขนเป็นขุยขาว ตึง และคัน',
      'Tibias et bras pèlent, tiraillent et grattent.',
    ),
    ingredients: ['ceramide', 'squalane', 'hyaluronic', 'panthenol'],
    otherIngredients: [
      L('요소·글리세린', 'Urea, glycerin', 'Urea, glycerin', 'ยูเรีย กลีเซอรีน', 'Urée, glycérine'),
    ],
    products: ['bodyWash', 'bodyLotion'],
    storeKeys: ['hydration', 'barrier'],
    tip: L(
      '뜨거운 물과 긴 샤워가 가장 큰 원인이에요. 샤워 후 3분 안에 크림.',
      'Hot water and long showers are the biggest cause; cream within three minutes after.',
      'ນ້ຳຮ້ອນ ແລະ ອາບດົນ ເປັນສາເຫດໃຫຍ່; ທາຄີມພາຍໃນ 3 ນາທີ.',
      'น้ำร้อนและอาบนานเป็นสาเหตุหลัก ทาครีมภายใน 3 นาทีหลังอาบ',
      'L’eau chaude et les longues douches en sont la cause principale.',
    ),
    seeDoctor: L(
      '꾸준히 보습해도 계속되면 — 습진·건선 같은 질환일 수 있어요.',
      'If it continues despite steady moisturising — it may be eczema or psoriasis.',
      'ຖ້າທາຄວາມຊຸ່ມເລື້ອຍໆແລ້ວບໍ່ດີຂຶ້ນ.',
      'ถ้าบำรุงสม่ำเสมอแล้วยังเป็นอยู่ อาจเป็นผื่นแพ้หรือสะเก็ดเงิน',
      'Si cela persiste malgré l’hydratation : eczéma ou psoriasis possibles.',
    ),
  },
  {
    id: 'kp',
    icon: '🐔',
    name: L(
      '닭살 (팔 위·허벅지 오돌토돌)',
      '"Chicken skin" (keratosis pilaris)',
      'ຜິວໜັງໄກ່',
      'ผิวหนังไก่ (ขนคุด)',
      'Kératose pilaire',
    ),
    what: L(
      '팔 위쪽·허벅지에 작고 거친 돌기가 오돌토돌해요.',
      'Small rough bumps on the upper arms or thighs.',
      'ຕຸ່ມນ້ອຍໆ ກະດ້າງ ຢູ່ແຂນເທິງ ຫຼື ຂາ.',
      'ตุ่มเล็กหยาบที่ต้นแขนหรือต้นขา',
      'Petits grains rugueux sur le haut des bras ou les cuisses.',
    ),
    ingredients: ['aha', 'bha'],
    otherIngredients: [
      L('요소', 'Urea', 'Urea', 'ยูเรีย', 'Urée'),
      L('젖산', 'Lactic acid', 'Lactic acid', 'กรดแลคติก', 'Acide lactique'),
    ],
    products: ['bodyScrub', 'bodyLotion'],
    storeKeys: ['hydration'],
    tip: L(
      '문지르면 더 심해져요. AHA·요소 로션을 꾸준히 바르는 편이 나아요.',
      'Scrubbing makes it worse; an AHA or urea lotion used steadily does better.',
      'ຂັດແຮງຈະຮ້າຍແຮງຂຶ້ນ; ໃຊ້ໂລຊັ່ນ AHA ຫຼື ຢູເຣຍ.',
      'การขัดทำให้แย่ลง ใช้โลชั่น AHA หรือยูเรียต่อเนื่องดีกว่า',
      'Frotter aggrave ; un lait AHA ou urée régulier fait mieux.',
    ),
    seeDoctor: L(
      '집에서 관리해도 계속되거나 붉고 가려울 때.',
      'If it persists with home care, or turns red and itchy.',
      'ຖ້າດູແລແລ້ວບໍ່ດີຂຶ້ນ ຫຼື ແດງ ຄັນ.',
      'ถ้าดูแลเองแล้วไม่ดีขึ้น หรือแดงและคัน',
      'Si cela persiste ou devient rouge et prurigineux.',
    ),
  },
  {
    id: 'backAcne',
    icon: '🔴',
    name: L(
      '등·가슴 트러블',
      'Back and chest breakouts',
      'ສິວຫຼັງ ແລະ ເອິກ',
      'สิวที่หลังและหน้าอก',
      'Boutons dos et poitrine',
    ),
    what: L(
      '등·가슴에 뾰루지가 나요. 똑같이 생긴 가려운 돌기라면 곰팡이성일 수도 있어요.',
      'Pimples on the back or chest. Uniform, itchy bumps can be fungal instead.',
      'ສິວຢູ່ຫຼັງ ຫຼື ເອິກ. ຕຸ່ມຄັນຄືກັນໝົດ ອາດແມ່ນເຊື້ອລາ.',
      'สิวที่หลังหรือหน้าอก ถ้าเป็นตุ่มคันเหมือนกันหมดอาจเป็นเชื้อรา',
      'Boutons dos/poitrine ; des petits boutons identiques qui grattent peuvent être fongiques.',
    ),
    ingredients: ['bha', 'teatree', 'niacinamide'],
    otherIngredients: [
      L(
        '벤조일퍼옥사이드 세정제',
        'Benzoyl peroxide wash',
        'Benzoyl peroxide wash',
        'คลีนเซอร์เบนโซอิลเปอร์ออกไซด์',
        'Nettoyant au peroxyde de benzoyle',
      ),
    ],
    products: ['bodyWash', 'bodyLotion'],
    storeKeys: ['soothing', 'cleansing'],
    tip: L(
      '땀 흘린 뒤 바로 샤워, 컨디셔너는 몸에 안 닿게 헹군 뒤 몸을 마지막에 씻어요.',
      'Shower right after sweating; rinse conditioner first and wash your body last so it does not sit on the back.',
      'ອາບນ້ຳທັນທີຫຼັງເຫື່ອອອກ; ລ້າງຄອນດິຊັນເນີກ່ອນ ແລ້ວຄ່ອຍຟອກຕົວ.',
      'อาบน้ำทันทีหลังเหงื่อออก ล้างครีมนวดผมก่อนแล้วค่อยถูตัวทีหลัง',
      'Douche après l’effort ; rincer l’après-shampoing puis laver le corps en dernier.',
    ),
    seeDoctor: L(
      '4–6주 써도 그대로일 때, 깊고 아픈 멍울, 가렵고 고른 돌기, 번지는 반점.',
      'No change after 4–6 weeks, deep painful lumps, itchy uniform bumps or spreading patches.',
      'ໃຊ້ 4–6 ອາທິດແລ້ວບໍ່ດີຂຶ້ນ, ຕຸ່ມເລິກເຈັບ, ຕຸ່ມຄັນ, ດ່າງລາມ.',
      'ใช้ 4–6 สัปดาห์แล้วไม่ดีขึ้น ก้อนลึกเจ็บ ตุ่มคันสม่ำเสมอ หรือปื้นลาม',
      'Aucun mieux en 4–6 semaines, nodules douloureux, boutons identiques qui grattent.',
    ),
  },
  {
    id: 'darkFolds',
    icon: '🟤',
    name: L(
      '겨드랑이·팔꿈치·무릎 착색',
      'Dark underarms, elbows or knees',
      'ຮັກແຮ້ ສອກ ຫົວເຂົ່າ ດຳ',
      'รักแร้ ข้อศอก หัวเข่าดำ',
      'Aisselles, coudes ou genoux foncés',
    ),
    what: L(
      '접히거나 마찰이 많은 곳이 주변보다 어두워요.',
      'Folds and areas that rub look darker than the skin around them.',
      'ບ່ອນພັບ ຫຼື ຖູກັນ ເຂັ້ມກວ່າອ້ອມຂ້າງ.',
      'บริเวณข้อพับหรือที่เสียดสีเข้มกว่าผิวรอบๆ',
      'Plis et zones de frottement plus foncés.',
    ),
    ingredients: ['niacinamide', 'licorice', 'aha'],
    products: ['bodyLotion'],
    storeKeys: ['tone'],
    tip: L(
      '세게 문지르거나 면도로 자극하면 더 어두워져요. 부드럽게, 보습을.',
      'Hard scrubbing and razor irritation darken it further — be gentle and moisturise.',
      'ຖູແຮງ ຫຼື ແຖໄຂ່ ເຮັດໃຫ້ດຳຂຶ້ນ — ໃຫ້ອ່ອນໂຍນ.',
      'การขัดแรงหรือโกนจนระคายทำให้ดำขึ้น ทำอย่างอ่อนโยนและบำรุง',
      'Frotter fort ou irriter au rasoir fonce davantage.',
    ),
    seeDoctor: L(
      '벨벳처럼 두껍고 어둡거나, 갑자기 빠르게 생겼거나, 체중 증가·당뇨 가족력·불규칙한 생리와 함께라면 바로 진료를.',
      'Velvety, thick and dark, appearing suddenly, or with weight gain, diabetes in the family or irregular periods — see a doctor promptly.',
      'ໜາ ດຳ ຄືກຳມະຫຍີ່, ເກີດທັນທີ, ຫຼື ມີນ້ຳໜັກເພີ່ມ/ເບົາຫວານໃນຄອບຄົວ — ພົບແພດ.',
      'หนาดำคล้ายกำมะหยี่ เกิดขึ้นเร็ว หรือมีน้ำหนักเพิ่ม ครอบครัวเป็นเบาหวาน ประจำเดือนไม่ปกติ ควรพบแพทย์',
      'Épais, velouté, brutal, ou avec prise de poids, diabète familial, règles irrégulières : consulter.',
    ),
  },
  {
    id: 'sweatOdor',
    icon: '💧',
    name: L(
      '땀·체취',
      'Sweat & body odour',
      'ເຫື່ອ ແລະ ກິ່ນຕົວ',
      'เหงื่อและกลิ่นตัว',
      'Transpiration & odeur',
    ),
    what: L(
      '겨드랑이·손발 땀이 많고 냄새가 신경 쓰여요.',
      'A lot of sweat under the arms, on hands or feet, and the smell bothers you.',
      'ເຫື່ອຫຼາຍ ແລະ ມີກິ່ນ.',
      'เหงื่อออกมากที่รักแร้ มือ เท้า และกังวลเรื่องกลิ่น',
      'Beaucoup de sueur et d’odeur.',
    ),
    ingredients: [],
    otherIngredients: [
      L(
        '알루미늄 클로라이드 (땀 억제)',
        'Aluminium chloride (antiperspirant)',
        'Aluminium chloride',
        'อะลูมิเนียมคลอไรด์ (ลดเหงื่อ)',
        'Chlorure d’aluminium',
      ),
    ],
    products: ['deodorant', 'bodyWash'],
    storeKeys: ['cleansing'],
    tip: L(
      '땀 억제제는 자기 전 마른 피부에. 면 옷, 젖은 옷은 바로 갈아입기.',
      'Antiperspirant at bedtime on dry skin; cotton clothes, and change damp ones straight away.',
      'ຢາລົດເຫື່ອກ່ອນນອນ; ເສື້ອຝ້າຍ; ປ່ຽນເສື້ອປຽກທັນທີ.',
      'ทายาลดเหงื่อก่อนนอนบนผิวแห้ง ใส่ผ้าฝ้าย และเปลี่ยนเสื้อเปียกทันที',
      'Anti-transpirant le soir sur peau sèche ; coton ; changer les vêtements humides.',
    ),
    seeDoctor: L(
      '관리해도 그대로이고 생활에 지장이 있을 때, 냄새가 달라졌거나 밤에 땀이 날 때. 가슴 통증·어지러움과 함께라면 즉시 응급.',
      'If it is unchanged and affects your life, the smell changes, or you sweat at night. With chest pain or dizziness, go to emergency at once.',
      'ຖ້າບໍ່ດີຂຶ້ນ, ກິ່ນປ່ຽນ ຫຼື ເຫື່ອອອກຕອນກາງຄືນ. ມີເຈັບໜ້າເອິກ ຫຼື ວິນຫົວ ໄປໂຮງໝໍທັນທີ.',
      'ถ้าดูแลแล้วไม่ดีขึ้นและกระทบชีวิต กลิ่นเปลี่ยน หรือเหงื่อออกกลางคืน ถ้ามีเจ็บหน้าอกหรือเวียนหัวไปห้องฉุกเฉินทันที',
      'Sans amélioration, odeur qui change, sueurs nocturnes ; avec douleur thoracique : urgences.',
    ),
  },
  {
    id: 'heatRash',
    icon: '🔥',
    name: L('땀띠', 'Heat rash (prickly heat)', 'ຜື່ນຮ້ອນ', 'ผดผื่นร้อน', 'Bourbouille'),
    what: L(
      '더울 때 목·가슴·접히는 곳에 따끔한 작은 붉은 돌기가 생겨요.',
      'Tiny prickly red bumps on the neck, chest or folds in the heat.',
      'ຕຸ່ມແດງນ້ອຍໆ ແສບ ຢູ່ຄໍ ເອິກ ບ່ອນພັບ ເມື່ອຮ້ອນ.',
      'ตุ่มแดงเล็กๆ แสบคันที่คอ หน้าอก ข้อพับ เมื่ออากาศร้อน',
      'Petits boutons rouges qui piquent à la chaleur.',
    ),
    ingredients: ['aloe', 'panthenol'],
    otherIngredients: [
      L(
        '칼라민 로션',
        'Calamine lotion',
        'Calamine lotion',
        'คาลาไมน์โลชั่น',
        'Lotion à la calamine',
      ),
    ],
    products: ['bodyWash', 'bodyLotion'],
    storeKeys: ['soothing'],
    tip: L(
      '시원하게 식히고 헐렁한 면 옷. 무거운 크림은 땀구멍을 막아 더 심해질 수 있어요.',
      'Cool down and wear loose cotton. Heavy creams can block sweat ducts and make it worse.',
      'ເຮັດໃຫ້ເຢັນ ໃສ່ເສື້ອຝ້າຍຫຼວມ. ຄີມໜັກອາດເຮັດໃຫ້ຮ້າຍແຮງຂຶ້ນ.',
      'ทำให้ผิวเย็นลง ใส่ผ้าฝ้ายหลวม ครีมหนักอาจอุดรูเหงื่อทำให้แย่ลง',
      'Rafraîchir, coton ample ; les crèmes riches peuvent aggraver.',
    ),
    seeDoctor: L(
      '며칠이 지나도 그대로이거나, 아프거나, 열·오한·고름 같은 감염 신호가 있을 때.',
      'If it lasts more than a few days, hurts, or shows signs of infection such as fever, chills or pus.',
      'ຫຼາຍມື້ບໍ່ດີຂຶ້ນ, ເຈັບ, ຫຼື ມີໄຂ້ ໜອງ.',
      'ถ้าหลายวันไม่ดีขึ้น เจ็บ หรือมีไข้ หนาวสั่น หนอง',
      'Au-delà de quelques jours, douleur ou signes d’infection.',
    ),
  },
  {
    id: 'tanBurn',
    icon: '☀️',
    name: L(
      '햇빛에 그을림·화상',
      'Tanning & sunburn',
      'ຜິວຄ້ຳ ແລະ ໄໝ້ແດດ',
      'ผิวคล้ำแดดและผิวไหม้',
      'Bronzage & coups de soleil',
    ),
    what: L(
      '팔·목 뒤에 옷 경계선이 생기거나 붉게 익어요.',
      'Clothing lines on arms and the back of the neck, or red, burnt skin.',
      'ມີຮອຍເສື້ອທີ່ແຂນ ຫຼື ຄໍ, ຫຼື ຜິວແດງໄໝ້.',
      'เกิดรอยเสื้อที่แขนหรือหลังคอ หรือผิวแดงไหม้',
      'Marques de vêtements ou peau rouge et brûlée.',
    ),
    ingredients: ['sunscreen', 'aloe', 'panthenol', 'niacinamide'],
    products: ['sunscreen', 'bodyLotion'],
    storeKeys: ['uv', 'soothing'],
    tip: L(
      '몸에는 소주잔 하나(약 30mL)만큼, 외출 15분 전, 2시간마다. 긴소매·팔토시도 좋아요.',
      'About a shot glass (30 mL) for the body, 15 minutes before going out, every two hours; long sleeves and arm covers help.',
      'ປະມານ 30 mL ສຳລັບຮ່າງກາຍ, 15 ນາທີກ່ອນອອກ, ທຸກ 2 ຊົ່ວໂມງ; ເສື້ອແຂນຍາວ.',
      'ทาตัวประมาณ 30 มล. (หนึ่งแก้วช็อต) ก่อนออกแดด 15 นาที และทุก 2 ชั่วโมง เสื้อแขนยาวหรือปลอกแขนก็ช่วยได้',
      'Environ 30 mL pour le corps, 15 minutes avant, toutes les deux heures ; manches longues.',
    ),
    seeDoctor: L(
      '물집이 생기면 2도 화상이에요 — 터뜨리지 말고 진료를. 열·오한·어지러움이 있으면 바로.',
      'Blisters mean a second-degree burn — do not pop them; see a doctor, at once if there is fever, chills or dizziness.',
      'ພຸພອງ ແມ່ນໄໝ້ລະດັບ 2 — ຢ່າເຈາະ; ມີໄຂ້ ຫຼື ວິນຫົວ ໄປທັນທີ.',
      'ถ้ามีตุ่มพองคือแผลไหม้ระดับ 2 อย่าเจาะ ถ้ามีไข้ หนาวสั่น หรือเวียนหัวให้ไปพบแพทย์ทันที',
      'Cloques : 2e degré, ne pas percer ; fièvre ou vertiges : immédiatement.',
    ),
  },
  {
    id: 'stretch',
    icon: '〰️',
    name: L('튼살', 'Stretch marks', 'ຮອຍແຕກລາຍ', 'ผิวแตกลาย', 'Vergetures'),
    what: L(
      '배·허벅지·가슴에 붉거나 보라색 줄(새것), 하얀 줄(오래된 것).',
      'Red or purple lines (new) or white ones (older) on the belly, thighs or chest.',
      'ເສັ້ນແດງ/ມ່ວງ (ໃໝ່) ຫຼື ຂາວ (ເກົ່າ) ຢູ່ທ້ອງ ຂາ ເອິກ.',
      'เส้นแดงหรือม่วง (ใหม่) หรือเส้นขาว (เก่า) ที่ท้อง ต้นขา หน้าอก',
      'Lignes rouges ou violettes (récentes), blanches (anciennes).',
    ),
    ingredients: ['centella', 'hyaluronic'],
    products: ['bodyLotion'],
    storeKeys: ['hydration'],
    tip: L(
      '새로 생긴 붉은 줄일 때 보습·마사지를 시작하는 경우가 많아요. 하얗게 된 줄은 화장품으로 크게 바뀌지 않아요.',
      'People usually start moisturising and massaging while marks are new and red; white, older ones change little with products.',
      'ເລີ່ມທາຄວາມຊຸ່ມຕອນຮອຍຍັງແດງ; ຮອຍຂາວປ່ຽນໜ້ອຍ.',
      'มักเริ่มบำรุงและนวดตอนรอยยังใหม่และแดง รอยขาวเก่าเปลี่ยนน้อยด้วยเครื่องสำอาง',
      'On hydrate surtout tant qu’elles sont rouges ; les blanches changent peu.',
    ),
    seeDoctor: L(
      '임신·체중 변화 같은 이유 없이 갑자기 많이 생길 때.',
      'If many appear suddenly without a reason such as pregnancy or weight change.',
      'ຖ້າເກີດຫຼາຍທັນທີ ໂດຍບໍ່ມີເຫດຜົນ.',
      'ถ้าเกิดขึ้นมากอย่างกะทันหันโดยไม่มีสาเหตุ เช่น ตั้งครรภ์หรือน้ำหนักเปลี่ยน',
      'Si beaucoup apparaissent soudain sans raison.',
    ),
  },
  {
    id: 'roughHands',
    icon: '🤲',
    name: L(
      '거칠고 트는 손',
      'Rough, cracked hands',
      'ມືກະດ້າງ ແຕກ',
      'มือหยาบแตก',
      'Mains rêches et gercées',
    ),
    what: L(
      '손등이 거칠고 갈라지며, 물·세제를 만지면 따가워요.',
      'Rough, cracking backs of the hands that sting with water or detergent.',
      'ຫຼັງມືກະດ້າງ ແຕກ, ແສບເມື່ອຖືກນ້ຳ ຫຼື ສານຊັກຟອກ.',
      'หลังมือหยาบ แตก แสบเมื่อโดนน้ำหรือผงซักฟอก',
      'Dos des mains rêche, fissuré, qui pique au contact de l’eau.',
    ),
    ingredients: ['ceramide', 'panthenol', 'squalane'],
    otherIngredients: [
      L(
        '글리세린·시어버터',
        'Glycerin, shea butter',
        'Glycerin, shea butter',
        'กลีเซอรีน เชียบัตเตอร์',
        'Glycérine, beurre de karité',
      ),
    ],
    products: ['handCream'],
    storeKeys: ['hydration', 'barrier'],
    tip: L(
      '손 씻을 때마다 핸드크림. 미용실·네일샵·주방 일은 장갑을 함께.',
      'Hand cream after every wash; gloves too for salon, nail-shop or kitchen work.',
      'ທາຄີມທຸກເທື່ອຫຼັງລ້າງມື; ໃສ່ຖົງມືເມື່ອເຮັດວຽກຮ້ານເສີມສວຍ.',
      'ทาครีมทุกครั้งหลังล้างมือ งานร้านทำผม ร้านเล็บ หรืองานครัวให้สวมถุงมือ',
      'Crème après chaque lavage ; gants au salon, en onglerie ou en cuisine.',
    ),
    seeDoctor: L(
      '하루 종일 발라도 아프고 갈라지면 손 습진일 수 있어요.',
      'If it hurts and cracks despite moisturising all day, it may be hand eczema.',
      'ທາທັງມື້ແລ້ວຍັງເຈັບ ແຕກ ອາດແມ່ນຜື່ນແພ້ມື.',
      'ทาทั้งวันแล้วยังเจ็บและแตก อาจเป็นผื่นแพ้ที่มือ',
      'Si cela fait mal malgré la crème toute la journée : eczéma des mains possible.',
    ),
  },
  {
    id: 'crackedHeels',
    icon: '🦶',
    name: L('갈라진 발뒤꿈치', 'Cracked heels', 'ສົ້ນຕີນແຕກ', 'ส้นเท้าแตก', 'Talons fendillés'),
    what: L(
      '발뒤꿈치가 두껍고 하얗게 갈라져요. 샌들을 많이 신으면 흔해요.',
      'Thick, white, splitting heels — common with lots of sandal-wearing.',
      'ສົ້ນຕີນໜາ ແຕກ — ພົບຫຼາຍຖ້າໃສ່ເກີບແຕະ.',
      'ส้นเท้าหนา ขาว แตก พบบ่อยเมื่อใส่รองเท้าแตะ',
      'Talons épais et fendillés — fréquent en sandales.',
    ),
    ingredients: ['squalane', 'ceramide'],
    otherIngredients: [L('요소 크림', 'Urea cream', 'Urea cream', 'ครีมยูเรีย', 'Crème à l’urée')],
    products: ['footCream'],
    storeKeys: ['hydration'],
    tip: L(
      '자기 전 요소 크림 + 양말. 부석은 상처가 없을 때만, 살살.',
      'Urea cream and socks at bedtime; pumice only gently and only on unbroken skin.',
      'ຄີມຢູເຣຍ + ຖົງຕີນກ່ອນນອນ; ຫີນຂັດເບົາໆເມື່ອບໍ່ມີບາດແຜ.',
      'ครีมยูเรียและใส่ถุงเท้าก่อนนอน ใช้หินขัดเบาๆ เฉพาะเมื่อไม่มีแผล',
      'Urée et chaussettes le soir ; pierre ponce douce, seulement sans plaie.',
    ),
    seeDoctor: L(
      '깊게 갈라져 피가 나거나, 붉고 붓고 고름이 날 때. 당뇨가 있다면 매일 발을 살피고 일찍 상담하세요.',
      'Deep, bleeding cracks, or redness, swelling or pus. With diabetes, check your feet daily and get advice early.',
      'ແຕກເລິກມີເລືອດ, ແດງ ບວມ ມີໜອງ. ຖ້າເປັນເບົາຫວານ ກວດຕີນທຸກມື້.',
      'แตกลึกมีเลือด แดง บวม หรือมีหนอง ถ้าเป็นเบาหวานให้ตรวจเท้าทุกวันและปรึกษาแพทย์แต่เนิ่นๆ',
      'Fissures profondes qui saignent, rougeur ou pus. Diabétique : examinez vos pieds chaque jour.',
    ),
  },
];

const s = (scores: Record<string, number>) => scores;

export const BODY_STEPS: readonly QuestStep[] = [
  {
    kind: 'learn',
    id: 'learnBody',
    section: SECTION_AREA,
    prompt: L(
      '바디는 턱 아래 피부예요. 하나만 기억해 주세요.',
      'Body means the skin below the jaw. One thing to remember:',
      'ຮ່າງກາຍ ແມ່ນຜິວໃຕ້ຄາງລົງມາ.',
      'ผิวกาย คือผิวตั้งแต่ใต้คางลงมา จำไว้ข้อเดียว',
      'Le corps, c’est la peau sous la mâchoire. À retenir :',
    ),
    help: L(
      '목과 가슴 윗부분은 얼굴 루틴으로 관리해요.',
      'The neck and upper chest are cared for with the face routine.',
      'ຄໍ ແລະ ເອິກເທິງ ດູແລແບບໃບໜ້າ.',
      'คอและอกส่วนบนดูแลด้วยรูทีนใบหน้า',
      'Cou et décolleté : routine du visage.',
    ),
    cards: [
      {
        id: 'neck',
        icon: '🦢',
        title: L(
          '목·가슴 위 → 얼굴 루틴',
          'Neck & upper chest → face routine',
          'ຄໍ ແລະ ເອິກເທິງ → ດູແລແບບໃບໜ້າ',
          'คอและอกส่วนบน → รูทีนใบหน้า',
          'Cou & décolleté → routine visage',
        ),
        body: L(
          '피부가 얇고 늘 햇빛을 받아요. 얼굴 크림과 선크림을 그대로 이어서 발라요.',
          'Thin skin, always in the sun: carry the face cream and sunscreen straight down.',
          'ຜິວບາງ ຖືກແດດຕະຫຼອດ: ທາຄີມ ແລະ ກັນແດດຕໍ່ລົງມາ.',
          'ผิวบางและโดนแดดตลอด ทาครีมและกันแดดของหน้าต่อลงมา',
          'Peau fine et exposée : prolongez crème et écran du visage.',
        ),
        signs: [],
      },
      {
        id: 'body',
        icon: '🧍‍♀️',
        title: L(
          '몸 (팔·다리·등·배)',
          'Body (arms, legs, back, belly)',
          'ຮ່າງກາຍ (ແຂນ ຂາ ຫຼັງ ທ້ອງ)',
          'ร่างกาย (แขน ขา หลัง ท้อง)',
          'Corps (bras, jambes, dos, ventre)',
        ),
        body: L(
          '씻기 → 3분 안에 보습 → 드러나는 곳엔 선크림.',
          'Wash → moisturise within three minutes → sunscreen wherever skin shows.',
          'ອາບນ້ຳ → ທາຄວາມຊຸ່ມພາຍໃນ 3 ນາທີ → ກັນແດດບ່ອນທີ່ເປີດ.',
          'อาบน้ำ → บำรุงภายใน 3 นาที → กันแดดตรงที่ไม่มีเสื้อผ้าปิด',
          'Laver → hydrater sous trois minutes → écran sur la peau exposée.',
        ),
        signs: [],
      },
      {
        id: 'handsFeet',
        icon: '🤲',
        title: L('손과 발', 'Hands & feet', 'ມື ແລະ ຕີນ', 'มือและเท้า', 'Mains & pieds'),
        body: L(
          '손은 씻을 때마다 크림, 발은 발가락 사이까지 말리고 자기 전 크림.',
          'Hands: cream after every wash. Feet: dry between the toes, cream at bedtime.',
          'ມື: ທາຄີມທຸກເທື່ອລ້າງ. ຕີນ: ເຊັດໃຫ້ແຫ້ງ ທາຄີມກ່ອນນອນ.',
          'มือทาครีมทุกครั้งหลังล้าง เท้าเช็ดซอกนิ้วให้แห้งและทาครีมก่อนนอน',
          'Mains : crème après chaque lavage. Pieds : bien sécher, crème le soir.',
        ),
        signs: [],
      },
    ],
  },
  {
    kind: 'single',
    id: 'afterShower',
    section: SECTION_TYPE,
    prompt: L(
      '샤워 후 아무것도 안 바르면 몸이 어떤가요?',
      'After a shower with nothing applied, how does your body skin feel?',
      'ອາບນ້ຳແລ້ວບໍ່ທາຫຍັງ ຜິວກາຍເປັນແນວໃດ?',
      'อาบน้ำแล้วไม่ทาอะไร ผิวกายเป็นอย่างไร?',
      'Après la douche, sans rien appliquer, votre peau…',
    ),
    choices: [
      {
        id: 'tight',
        icon: '🏜️',
        label: L(
          '당기고 가려워요',
          'Tight and itchy',
          'ຕຶງ ແລະ ຄັນ',
          'ตึงและคัน',
          'Tiraille et gratte',
        ),
        scores: s({ dry: 3 }),
      },
      {
        id: 'fine',
        icon: '🌸',
        label: L('괜찮아요', 'Fine', 'ບໍ່ເປັນຫຍັງ', 'ปกติดี', 'Ça va'),
        scores: s({ normal: 3 }),
      },
      {
        id: 'sticky',
        icon: '💦',
        label: L(
          '금방 다시 끈적이고 땀이 나요',
          'Soon sticky and sweaty again',
          'ບໍ່ດົນກໍໜຽວ ແລະ ເຫື່ອອອກ',
          'ไม่นานก็เหนียวเหงื่อออกอีก',
          'Vite collante et en sueur',
        ),
        scores: s({ oily: 3 }),
      },
      NOT_SURE,
    ],
  },
  {
    kind: 'single',
    id: 'shins',
    section: SECTION_TYPE,
    prompt: L(
      '정강이·팔에 하얀 각질이 일어나나요?',
      'Do your shins or arms flake white?',
      'ແຂ້ງ ຫຼື ແຂນ ລອກຂາວບໍ?',
      'หน้าแข้งหรือแขนเป็นขุยขาวไหม?',
      'Vos tibias ou bras pèlent-ils ?',
    ),
    choices: [
      {
        id: 'often',
        icon: '❄️',
        label: L('자주요', 'Often', 'ເລື້ອຍໆ', 'บ่อย', 'Souvent'),
        scores: s({ dry: 2 }),
      },
      {
        id: 'dryseason',
        icon: '🍂',
        label: L(
          '건기·에어컨에서만',
          'Only in the dry season or air-conditioning',
          'ສະເພາະລະດູແລ້ງ ຫຼື ຫ້ອງແອ',
          'เฉพาะหน้าแล้งหรือในห้องแอร์',
          'Seulement en saison sèche ou climatisation',
        ),
        scores: s({ normal: 1, dry: 1 }),
      },
      {
        id: 'never',
        icon: '✨',
        label: L('거의 없어요', 'Hardly ever', 'ເກືອບບໍ່ມີ', 'แทบไม่มี', 'Presque jamais'),
        scores: s({ normal: 1, oily: 1 }),
      },
      NOT_SURE,
    ],
  },
  {
    kind: 'single',
    id: 'back',
    section: SECTION_TYPE,
    prompt: L(
      '더운 날 등·가슴은 어떤가요?',
      'On hot days, how are your back and chest?',
      'ມື້ຮ້ອນ ຫຼັງ ແລະ ເອິກເປັນແນວໃດ?',
      'วันร้อน หลังและหน้าอกเป็นอย่างไร?',
      'Par temps chaud, votre dos et votre poitrine ?',
    ),
    choices: [
      {
        id: 'breakouts',
        icon: '🔴',
        label: L(
          '번들거리고 뾰루지·땀띠가 나요',
          'Shiny, with spots or heat rash',
          'ມັນ ມີສິວ ຫຼື ຜື່ນຮ້ອນ',
          'มัน มีสิวหรือผดผื่น',
          'Brillants, boutons ou bourbouille',
        ),
        scores: s({ oily: 2 }),
      },
      {
        id: 'fine',
        icon: '🌸',
        label: L('괜찮아요', 'Fine', 'ບໍ່ເປັນຫຍັງ', 'ปกติดี', 'Ça va'),
        scores: s({ normal: 1 }),
      },
      NOT_SURE,
    ],
  },
  {
    kind: 'single',
    id: 'reactive',
    section: SECTION_TYPE,
    prompt: L(
      '새 바디로션·세탁 세제·옷감에 가렵거나 붉어진 적이 있나요?',
      'Have new body lotions, laundry detergents or fabrics made you itch or redden?',
      'ໂລຊັ່ນ, ຜົງຊັກຟອກ ຫຼື ຜ້າໃໝ່ ເຄີຍເຮັດໃຫ້ຄັນ ຫຼື ແດງບໍ?',
      'โลชั่น ผงซักฟอก หรือเนื้อผ้าใหม่เคยทำให้คันหรือแดงไหม?',
      'Un lait, une lessive ou un tissu nouveau vous a-t-il fait réagir ?',
    ),
    choices: [
      {
        id: 'often',
        icon: '🌹',
        label: L('자주요', 'Often', 'ເລື້ອຍໆ', 'บ่อย', 'Souvent'),
        scores: s({ sensitive: 3 }),
      },
      {
        id: 'sometimes',
        icon: '🙂',
        label: L('가끔요', 'Sometimes', 'ບາງຄັ້ງ', 'บางครั้ง', 'Parfois'),
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
    kind: 'multi',
    id: 'concerns',
    section: SECTION_CONCERNS,
    prompt: L(
      '몸·손·발에서 신경 쓰이는 것을 모두 골라 주세요.',
      'Pick everything that bothers you on your body, hands and feet.',
      'ເລືອກທຸກຢ່າງທີ່ກັງວົນຢູ່ຮ່າງກາຍ ມື ແລະ ຕີນ.',
      'เลือกทุกอย่างที่กังวลที่ร่างกาย มือ และเท้า',
      'Choisissez tout ce qui vous préoccupe sur le corps, les mains et les pieds.',
    ),
    help: L(
      '목 고민은 얼굴 퀘스트에 있어요.',
      'Neck concerns are in the face quest.',
      'ບັນຫາຄໍ ຢູ່ໃນສ່ວນໃບໜ້າ.',
      'ปัญหาที่คออยู่ในเควสต์ใบหน้า',
      'Le cou est traité dans la partie visage.',
    ),
    groups: [
      {
        id: 'limbs',
        label: L(
          '팔·다리·피부결',
          'Arms, legs & texture',
          'ແຂນ ຂາ ແລະ ຜິວ',
          'แขน ขา และผิวสัมผัส',
          'Bras, jambes & grain',
        ),
        ids: ['dryBody', 'kp', 'stretch', 'tanBurn'],
      },
      {
        id: 'heat',
        label: L(
          '더위·땀·접히는 곳',
          'Heat, sweat & folds',
          'ຄວາມຮ້ອນ ເຫື່ອ ແລະ ບ່ອນພັບ',
          'ความร้อน เหงื่อ และข้อพับ',
          'Chaleur, sueur & plis',
        ),
        ids: ['backAcne', 'heatRash', 'sweatOdor', 'darkFolds'],
      },
      {
        id: 'handsFeet',
        label: L('손·발', 'Hands & feet', 'ມື ແລະ ຕີນ', 'มือและเท้า', 'Mains & pieds'),
        ids: ['roughHands', 'crackedHeels'],
      },
    ],
    choices: [
      ...BODY_CONCERNS.map((concern) => ({
        id: concern.id,
        icon: concern.icon,
        label: concern.name,
        detail: concern.what,
      })),
      NONE,
    ],
  },
  {
    kind: 'single',
    id: 'shower',
    section: SECTION_HABITS,
    prompt: L(
      '샤워는 보통 어떻게 하나요?',
      'How do you usually shower?',
      'ປົກກະຕິອາບນ້ຳແນວໃດ?',
      'ปกติอาบน้ำอย่างไร?',
      'Comment vous douchez-vous ?',
    ),
    choices: [
      {
        id: 'hotLong',
        icon: '♨️',
        label: L(
          '뜨거운 물로 오래',
          'Hot and long',
          'ນ້ຳຮ້ອນ ດົນ',
          'น้ำร้อนและนาน',
          'Chaude et longue',
        ),
      },
      {
        id: 'warmShort',
        icon: '🚿',
        label: L(
          '미지근한 물로 짧게',
          'Lukewarm and short',
          'ນ້ຳອຸ່ນ ສັ້ນໆ',
          'น้ำอุ่นและสั้น',
          'Tiède et courte',
        ),
      },
      {
        id: 'cold',
        icon: '🧊',
        label: L('찬물로', 'Cold water', 'ນ້ຳເຢັນ', 'น้ำเย็น', 'Eau froide'),
      },
      NOT_SURE,
    ],
  },
  {
    kind: 'single',
    id: 'waterWork',
    section: SECTION_HABITS,
    prompt: L(
      '일하면서 물·세제·화학제품을 자주 만지나요? (미용실·네일·주방)',
      'Do you handle water, detergent or chemicals at work? (salon, nails, kitchen)',
      'ເຮັດວຽກຈັບນ້ຳ ສານຊັກຟອກ ຫຼື ເຄມີເລື້ອຍບໍ?',
      'ทำงานสัมผัสน้ำ ผงซักฟอก หรือสารเคมีบ่อยไหม? (ร้านทำผม ร้านเล็บ ครัว)',
      'Touchez-vous souvent eau, détergents ou produits chimiques au travail ?',
    ),
    choices: [
      {
        id: 'yes',
        icon: '💅',
        label: L('네, 매일', 'Yes, every day', 'ແມ່ນ ທຸກມື້', 'ใช่ ทุกวัน', 'Oui, chaque jour'),
      },
      { id: 'some', icon: '🙂', label: L('가끔', 'Sometimes', 'ບາງຄັ້ງ', 'บางครั้ง', 'Parfois') },
      { id: 'no', icon: '✖️', label: L('아니요', 'No', 'ບໍ່', 'ไม่', 'Non') },
    ],
  },
  {
    kind: 'single',
    id: 'bodySun',
    section: SECTION_HABITS,
    prompt: L(
      '팔·다리처럼 드러나는 몸에도 선크림을 바르나요?',
      'Do you put sunscreen on exposed arms and legs?',
      'ທາກັນແດດທີ່ແຂນຂາບໍ?',
      'ทากันแดดที่แขนขาที่ไม่มีเสื้อผ้าปิดไหม?',
      'Mettez-vous de l’écran sur bras et jambes ?',
    ),
    choices: [
      {
        id: 'always',
        icon: '☀️',
        label: L(
          '밖에 나갈 때마다',
          'Every time I go out',
          'ທຸກເທື່ອອອກນອກ',
          'ทุกครั้งที่ออกนอกบ้าน',
          'À chaque sortie',
        ),
      },
      {
        id: 'sometimes',
        icon: '🙂',
        label: L('가끔', 'Sometimes', 'ບາງຄັ້ງ', 'บางครั้ง', 'Parfois'),
      },
      {
        id: 'never',
        icon: '🙈',
        label: L(
          '얼굴만 발라요 / 안 발라요',
          'Face only, or none',
          'ສະເພາະໜ້າ / ບໍ່ທາ',
          'เฉพาะหน้า / ไม่ทา',
          'Visage seulement, ou rien',
        ),
      },
    ],
  },
  {
    kind: 'multi',
    id: 'lifestyle',
    section: SECTION_HABITS,
    prompt: L(
      '나에게 해당하는 것은?',
      'Which of these apply to you?',
      'ອັນໃດກົງກັບທ່ານ?',
      'ข้อใดตรงกับคุณ?',
      'Lesquels vous concernent ?',
    ),
    choices: [
      {
        id: 'motorbike',
        icon: '🛵',
        label: L(
          '오토바이로 다녀요',
          'I ride a motorbike',
          'ຂີ່ລົດຈັກ',
          'ขี่มอเตอร์ไซค์',
          'Je roule à moto',
        ),
      },
      {
        id: 'outdoor',
        icon: '🌾',
        label: L(
          '밖에서 일해요',
          'I work outdoors',
          'ເຮັດວຽກກາງແຈ້ງ',
          'ทำงานกลางแจ้ง',
          'Je travaille dehors',
        ),
      },
      {
        id: 'exercise',
        icon: '🏃‍♀️',
        label: L(
          '운동으로 땀을 자주 흘려요',
          'I exercise and sweat often',
          'ອອກກຳລັງກາຍ ເຫື່ອອອກເລື້ອຍ',
          'ออกกำลังกายเหงื่อออกบ่อย',
          'Je fais du sport et transpire',
        ),
      },
      {
        id: 'tight',
        icon: '👖',
        label: L(
          '꽉 끼는 합성섬유 옷을 자주 입어요',
          'I often wear tight synthetic clothes',
          'ໃສ່ເສື້ອຜ້າແໜ້ນ ໃຍສັງເຄາະ',
          'ใส่เสื้อผ้าใยสังเคราะห์รัดรูปบ่อย',
          'Vêtements serrés synthétiques',
        ),
      },
      {
        id: 'diabetes',
        icon: '🩸',
        label: L(
          '당뇨가 있어요',
          'I have diabetes',
          'ເປັນເບົາຫວານ',
          'เป็นเบาหวาน',
          'Je suis diabétique',
        ),
      },
      {
        id: 'pregnant',
        icon: '🤰',
        label: L(
          '임신 중이에요',
          'I am pregnant',
          'ກຳລັງຖືພາ',
          'กำลังตั้งครรภ์',
          'Je suis enceinte',
        ),
      },
      NONE,
    ],
  },
  {
    kind: 'multi',
    id: 'goals',
    section: SECTION_HABITS,
    max: 3,
    prompt: L(
      '무엇을 가장 원하세요? (최대 3개)',
      'What do you want most? (up to 3)',
      'ທ່ານຕ້ອງການຫຍັງທີ່ສຸດ? (ສູງສຸດ 3)',
      'คุณต้องการอะไรมากที่สุด? (สูงสุด 3)',
      'Que voulez-vous le plus ? (3 max)',
    ),
    choices: [
      {
        id: 'soft',
        icon: '🤍',
        label: L(
          '부드럽고 촉촉한 몸',
          'Soft, moisturised skin',
          'ຜິວນຸ່ມ ຊຸ່ມ',
          'ผิวนุ่มชุ่มชื้น',
          'Une peau douce et hydratée',
        ),
      },
      {
        id: 'even',
        icon: '✨',
        label: L('고른 톤', 'An even tone', 'ສີຜິວສະເໝີ', 'สีผิวสม่ำเสมอ', 'Un teint uniforme'),
      },
      {
        id: 'fresh',
        icon: '🌬️',
        label: L(
          '땀·냄새 걱정 없이',
          'Fresh, without sweat worries',
          'ສົດຊື່ນ ບໍ່ກັງວົນເຫື່ອ',
          'สดชื่น ไม่กังวลเรื่องเหงื่อ',
          'Fraîcheur, sans souci de sueur',
        ),
      },
      {
        id: 'clear',
        icon: '🌿',
        label: L(
          '등·가슴 트러블 줄이기',
          'Fewer back and chest breakouts',
          'ລົດສິວຫຼັງ ແລະ ເອິກ',
          'ลดสิวที่หลังและหน้าอก',
          'Moins de boutons dos/poitrine',
        ),
      },
      {
        id: 'handsFeet',
        icon: '🤲',
        label: L(
          '손·발 관리',
          'Hands and feet',
          'ດູແລມື ແລະ ຕີນ',
          'ดูแลมือและเท้า',
          'Mains et pieds',
        ),
      },
      {
        id: 'simple',
        icon: '3️⃣',
        label: L(
          '간단한 관리',
          'A simple routine',
          'ການດູແລງ່າຍໆ',
          'การดูแลง่ายๆ',
          'Une routine simple',
        ),
      },
      NONE,
    ],
  },
];

const has = (answers: QuestAnswers, stepId: string, id: string) =>
  (answers[stepId] ?? []).includes(id);

export function bodyPlan(answers: QuestAnswers, reading: TypeReading): CarePlan {
  const concerns = answers.concerns ?? [];
  const pick = (ids: readonly string[]) => ids.some((id) => concerns.includes(id));
  const dry = reading.typeId === 'dry' || pick(['dryBody']);
  const oily = reading.typeId === 'oily' || pick(['backAcne', 'heatRash']);
  const simple = has(answers, 'goals', 'simple');

  const shower: RoutineLine[] = [
    {
      kind: 'bodyWash',
      note: pick(['backAcne'])
        ? L(
            '등·가슴은 BHA·벤조일퍼옥사이드 바디워시로, 거품을 1–2분 두었다 헹궈요. 컨디셔너를 먼저 헹구고 몸은 마지막에.',
            'On the back and chest, a BHA or benzoyl peroxide wash left on for a minute or two; rinse conditioner first and wash the body last.',
            'ຫຼັງ ແລະ ເອິກ ໃຊ້ສະບູ BHA ປະໄວ້ 1–2 ນາທີ; ລ້າງຄອນດິຊັນເນີກ່ອນ.',
            'หลังและหน้าอกใช้ครีมอาบน้ำ BHA หรือเบนโซอิลเปอร์ออกไซด์ ทิ้งไว้ 1–2 นาที ล้างครีมนวดผมก่อนแล้วถูตัวทีหลัง',
            'Sur le dos, nettoyant BHA ou peroxyde de benzoyle 1 à 2 minutes ; rincer l’après-shampoing avant.',
          )
        : L(
            '미지근한 물로 5–10분, 순한 바디워시. 땀 흘린 뒤엔 바로.',
            'Five to ten minutes in lukewarm water with a mild wash — straight after sweating.',
            'ນ້ຳອຸ່ນ 5–10 ນາທີ ສະບູອ່ອນໂຍນ.',
            'น้ำอุ่น 5–10 นาที ครีมอาบน้ำอ่อนโยน อาบทันทีหลังเหงื่อออก',
            'Eau tiède 5 à 10 minutes, nettoyant doux.',
          ),
    },
    {
      kind: 'bodyLotion',
      note: dry
        ? L(
            '수건으로 두드려 말리고 3분 안에 크림을 넉넉히.',
            'Pat dry and apply a generous cream within three minutes.',
            'ຕົບໃຫ້ແຫ້ງ ແລ້ວທາຄີມພາຍໃນ 3 ນາທີ.',
            'ซับให้แห้งแล้วทาครีมให้ทั่วภายใน 3 นาที',
            'Tamponner, puis crème généreuse sous trois minutes.',
          )
        : L(
            '두드려 말리고 3분 안에 가벼운 로션·젤.',
            'Pat dry and apply a light lotion or gel within three minutes.',
            'ຕົບໃຫ້ແຫ້ງ ແລ້ວທາໂລຊັ່ນເບົາ.',
            'ซับให้แห้งแล้วทาโลชั่นหรือเจลบางเบาภายใน 3 นาที',
            'Tamponner, puis lait léger sous trois minutes.',
          ),
    },
    ...(pick(['sweatOdor']) || oily
      ? [
          {
            kind: 'deodorant',
            note: L(
              '땀 억제제는 자기 전, 완전히 마른 겨드랑이에.',
              'Antiperspirant at bedtime, on completely dry underarms.',
              'ຢາລົດເຫື່ອກ່ອນນອນ ທາຮັກແຮ້ແຫ້ງ.',
              'ทายาลดเหงื่อก่อนนอนบนรักแร้ที่แห้งสนิท',
              'Anti-transpirant le soir, aisselles bien sèches.',
            ),
          },
        ]
      : []),
  ];

  const day: RoutineLine[] = [
    {
      kind: 'sunscreen',
      note: L(
        '드러나는 팔·다리·목 뒤에 약 30mL(소주잔 하나), 외출 15분 전, 2시간마다.',
        'About 30 mL (a shot glass) on exposed arms, legs and the back of the neck, 15 minutes before going out, every two hours.',
        'ປະມານ 30 mL ທີ່ແຂນ ຂາ ຫຼັງຄໍ, 15 ນາທີກ່ອນອອກ, ທຸກ 2 ຊົ່ວໂມງ.',
        'ประมาณ 30 มล. ที่แขน ขา หลังคอ ก่อนออกแดด 15 นาที และทุก 2 ชั่วโมง',
        'Environ 30 mL sur bras, jambes et nuque, 15 minutes avant, toutes les deux heures.',
      ),
    },
    {
      kind: 'handCream',
      note: L(
        '손 씻을 때마다, 물기가 살짝 있을 때.',
        'After every handwash, while hands are slightly damp.',
        'ທຸກເທື່ອລ້າງມື ຕອນມືຍັງຊຸ່ມ.',
        'ทุกครั้งหลังล้างมือขณะมือยังหมาด',
        'Après chaque lavage, mains encore humides.',
      ),
    },
    ...(pick(['crackedHeels']) || has(answers, 'lifestyle', 'diabetes')
      ? [
          {
            kind: 'footCream',
            note: L(
              '자기 전 발가락 사이까지 말리고 요소 크림 + 양말.',
              'At bedtime, dry between the toes, then urea cream and socks.',
              'ກ່ອນນອນ ເຊັດໃຫ້ແຫ້ງ ທາຄີມຢູເຣຍ ໃສ່ຖົງຕີນ.',
              'ก่อนนอนเช็ดซอกนิ้วเท้าให้แห้ง ทาครีมยูเรียแล้วใส่ถุงเท้า',
              'Au coucher, sécher entre les orteils, urée et chaussettes.',
            ),
          },
        ]
      : []),
  ];

  const weekly: RoutineLine[] =
    simple || has(answers, 'lifestyle', 'pregnant')
      ? []
      : pick(['kp', 'dryBody', 'darkFolds'])
        ? [
            {
              kind: 'bodyScrub',
              note: L(
                '닭살·각질엔 문지르기보다 AHA·요소 로션 주 2–3번. 스크럽은 많아야 주 1–2번.',
                'For bumps and flakes, an AHA or urea lotion two or three times a week beats scrubbing; scrubs once or twice a week at most.',
                'ໃຊ້ໂລຊັ່ນ AHA ຫຼື ຢູເຣຍ ອາທິດລະ 2–3 ເທື່ອ ດີກວ່າການຂັດ.',
                'ใช้โลชั่น AHA หรือยูเรีย สัปดาห์ละ 2–3 ครั้งดีกว่าการขัด สครับมากสุดสัปดาห์ละ 1–2 ครั้ง',
                'Lait AHA ou urée 2–3 fois par semaine plutôt que frotter.',
              ),
            },
          ]
        : [];

  const tips: ReturnType<typeof L>[] = [];
  if (has(answers, 'shower', 'hotLong'))
    tips.push(
      L(
        '뜨거운 물과 긴 샤워는 몸을 가장 건조하게 만들어요. 미지근하게, 10분 안으로.',
        'Hot water and long showers dry the body more than anything — go lukewarm, under ten minutes.',
        'ນ້ຳຮ້ອນ ແລະ ອາບດົນ ເຮັດໃຫ້ຜິວແຫ້ງທີ່ສຸດ — ນ້ຳອຸ່ນ ບໍ່ເກີນ 10 ນາທີ.',
        'น้ำร้อนและอาบนานทำให้ผิวแห้งที่สุด ใช้น้ำอุ่นไม่เกิน 10 นาที',
        'L’eau chaude et longue assèche le plus : tiède, moins de dix minutes.',
      ),
    );
  if (has(answers, 'waterWork', 'yes') || has(answers, 'waterWork', 'some'))
    tips.push(
      L(
        '미용실·네일·주방 일은 장갑을 끼고, 장갑을 벗을 때마다 핸드크림. 구멍 난 장갑은 버려요.',
        'Wear gloves for salon, nail or kitchen work and put on hand cream each time they come off; throw away gloves with holes.',
        'ໃສ່ຖົງມືເມື່ອເຮັດວຽກ ແລະ ທາຄີມທຸກເທື່ອຖອດ.',
        'สวมถุงมือเมื่อทำงานร้านทำผม ร้านเล็บ หรือครัว และทาครีมทุกครั้งที่ถอด ทิ้งถุงมือที่รั่ว',
        'Gants au travail, crème à chaque retrait ; jetez les gants percés.',
      ),
    );
  if (
    has(answers, 'bodySun', 'never') ||
    has(answers, 'bodySun', 'sometimes') ||
    has(answers, 'lifestyle', 'motorbike') ||
    has(answers, 'lifestyle', 'outdoor')
  )
    tips.push(
      L(
        '오토바이·야외에선 팔·손등·목 뒤가 가장 많이 타요. 긴소매·팔토시와 선크림을 함께.',
        'On a motorbike or outdoors, arms, the backs of hands and the back of the neck burn most — long sleeves or arm covers plus sunscreen.',
        'ຂີ່ລົດຈັກ ຫຼື ກາງແຈ້ງ ແຂນ ຫຼັງມື ແລະ ຄໍ ໄໝ້ຫຼາຍ — ເສື້ອແຂນຍາວ + ກັນແດດ.',
        'ขี่มอเตอร์ไซค์หรืออยู่กลางแจ้ง แขน หลังมือ และหลังคอไหม้มากที่สุด ใส่เสื้อแขนยาวหรือปลอกแขนพร้อมกันแดด',
        'À moto ou dehors, bras, mains et nuque brûlent le plus : manches longues et écran.',
      ),
    );
  if (has(answers, 'lifestyle', 'exercise') || has(answers, 'lifestyle', 'tight'))
    tips.push(
      L(
        '땀에 젖은 옷은 바로 갈아입고, 헐렁한 면 옷을. 꽉 끼는 합성섬유는 트러블·땀띠를 늘려요.',
        'Change out of sweaty clothes straight away and choose loose cotton; tight synthetics add breakouts and heat rash.',
        'ປ່ຽນເສື້ອປຽກເຫື່ອທັນທີ; ເສື້ອແໜ້ນໃຍສັງເຄາະ ເພີ່ມສິວ.',
        'เปลี่ยนเสื้อเปียกเหงื่อทันที เลือกผ้าฝ้ายหลวม ผ้าใยสังเคราะห์รัดรูปทำให้สิวและผดผื่นมากขึ้น',
        'Changez vite les vêtements mouillés ; préférez le coton ample.',
      ),
    );
  if (has(answers, 'lifestyle', 'diabetes'))
    tips.push(
      L(
        '당뇨가 있으면 매일 발을 살펴보고, 상처·갈라짐은 일찍 진료를 받아요. 부석·각질 칼은 쓰지 않아요.',
        'With diabetes, look at your feet every day and get any cut or crack seen early; skip pumice and corn blades.',
        'ຖ້າເປັນເບົາຫວານ ກວດຕີນທຸກມື້ ແລະ ພົບແພດໄວ.',
        'ถ้าเป็นเบาหวาน ตรวจเท้าทุกวัน แผลหรือรอยแตกให้พบแพทย์แต่เนิ่นๆ ไม่ใช้หินขัดหรือมีดเฉือนตาปลา',
        'Diabétique : examinez vos pieds chaque jour ; pas de pierre ponce ni de lame.',
      ),
    );
  if (has(answers, 'lifestyle', 'pregnant'))
    tips.push(
      L(
        '임신 중엔 배·허벅지 보습을 꾸준히. 새 제품·각질 성분은 의사와 먼저 상의해요.',
        'In pregnancy, moisturise belly and thighs steadily, and check new products or exfoliating acids with your doctor first.',
        'ໃນເວລາຖືພາ ທາຄວາມຊຸ່ມທ້ອງ ແລະ ຂາ; ປຶກສາທ່ານໝໍກ່ອນໃຊ້ຜະລິດຕະພັນໃໝ່.',
        'ระหว่างตั้งครรภ์บำรุงท้องและต้นขาสม่ำเสมอ ปรึกษาแพทย์ก่อนใช้ผลิตภัณฑ์ใหม่หรือกรดผลัดเซลล์',
        'Enceinte : hydratez ventre et cuisses ; demandez l’avis du médecin pour les nouveaux produits.',
      ),
    );

  const advice: AdviceBlock[] = [];
  if (tips.length > 0)
    advice.push({
      id: 'body-habits',
      icon: '🗓️',
      title: L(
        '생활 습관에서 챙길 것',
        'From your habits',
        'ຈາກນິໄສຂອງທ່ານ',
        'จากนิสัยของคุณ',
        'Selon vos habitudes',
      ),
      points: tips,
    });
  advice.push({
    id: 'neck-face',
    icon: '🦢',
    title: L(
      '목·가슴 위는 얼굴 루틴으로',
      'Neck and upper chest: the face routine',
      'ຄໍ ແລະ ເອິກເທິງ: ດູແລແບບໃບໜ້າ',
      'คอและอกส่วนบน: ใช้รูทีนใบหน้า',
      'Cou et décolleté : routine visage',
    ),
    points: [
      L(
        '얼굴 크림과 선크림을 턱 아래로 그대로 이어 발라요. 목 고민은 얼굴 퀘스트에서 골라 보세요.',
        'Carry face cream and sunscreen straight down past the jaw; pick neck concerns in the face quest.',
        'ທາຄີມ ແລະ ກັນແດດຂອງໃບໜ້າ ລົງມາຮອດຄໍ.',
        'ทาครีมและกันแดดของหน้าต่อลงมาใต้คาง ปัญหาที่คอเลือกได้ในเควสต์ใบหน้า',
        'Prolongez crème et écran du visage sous la mâchoire.',
      ),
    ],
  });
  advice.push(PATCH_TEST);

  return {
    alert: null,
    routines: [
      {
        id: 'shower',
        icon: '🚿',
        title: L('샤워할 때', 'In the shower', 'ເວລາອາບນ້ຳ', 'ตอนอาบน้ำ', 'Sous la douche'),
        lines: shower,
      },
      {
        id: 'day',
        icon: '☀️',
        title: L(
          '낮과 잠들기 전',
          'Daytime and bedtime',
          'ກາງເວັນ ແລະ ກ່ອນນອນ',
          'กลางวันและก่อนนอน',
          'Journée et coucher',
        ),
        lines: day,
      },
    ],
    weekly,
    advice,
    avoid: [],
    avoidReason: null,
  };
}

export const BODY_SOURCES: readonly Source[] = [
  {
    name: 'AAD — dermatologists’ tips to relieve dry skin',
    url: 'https://www.aad.org/public/everyday-care/skin-care-basics/dry/dermatologists-tips-relieve-dry-skin',
  },
  {
    name: 'AAD — keratosis pilaris self-care',
    url: 'https://www.aad.org/public/diseases/a-z/keratosis-pilaris-self-care',
  },
  {
    name: 'AAD — back acne',
    url: 'https://www.aad.org/public/diseases/acne-and-rosacea/back-acne-how-to-see-clearer-skin',
  },
  {
    name: 'AAD — acanthosis nigricans',
    url: 'https://www.aad.org/public/diseases/a-z/acanthosis-nigricans-symptoms',
  },
  {
    name: 'AAD — skin care tips for hands',
    url: 'https://www.aad.org/public/everyday-care/skin-care-basics/care/skin-care-tips-hands',
  },
  {
    name: 'AAD — dry, cracked heels',
    url: 'https://www.aad.org/public/everyday-care/skin-care-basics/dry/dry-heels',
  },
  {
    name: 'AAD — hyperhidrosis self-care',
    url: 'https://www.aad.org/public/diseases/a-z/hyperhidrosis-self-care',
  },
  {
    name: 'AAD — stretch marks',
    url: 'https://www.aad.org/public/cosmetic/scars-stretch-marks/stretch-marks-why-appear',
  },
  { name: 'NHS — heat rash', url: 'https://www.nhs.uk/conditions/heat-rash-prickly-heat/' },
  {
    name: 'Skin Cancer Foundation — sunburn',
    url: 'https://www.skincancer.org/risk-factors/sunburn/',
  },
  {
    name: 'AAD — how to apply sunscreen',
    url: 'https://www.aad.org/public/everyday-care/sun-protection/shade-clothing-sunscreen/how-to-apply-sunscreen',
  },
];

export const BODY_TRACK: CareTrack = {
  id: 'body',
  icon: '🧴',
  cover: '/products/sku/KG-BDY-00008.jpg',
  title: L(
    '바디·손·발',
    'Body, hands & feet',
    'ຮ່າງກາຍ ມື ແລະ ຕີນ',
    'ผิวกาย มือ และเท้า',
    'Corps, mains & pieds',
  ),
  intro: L(
    '몸 피부 타입 → 고민 10가지(땀띠·등 트러블·튼 손·갈라진 발뒤꿈치 포함) → 습관. 목은 얼굴 루틴으로 가요.',
    'Body skin type → ten concerns (heat rash, back breakouts, cracked hands and heels included) → habits. The neck goes with the face.',
    'ປະເພດຜິວກາຍ → ບັນຫາ 10 ຢ່າງ → ນິໄສ. ຄໍ ໄປກັບໃບໜ້າ.',
    'ประเภทผิวกาย → ปัญหา 10 ข้อ (ผดผื่น สิวที่หลัง มือแตก ส้นเท้าแตก) → นิสัย ส่วนคอดูแลพร้อมใบหน้า',
    'Type de peau → dix préoccupations → habitudes. Le cou va avec le visage.',
  ),
  steps: BODY_STEPS,
  types: BODY_TYPES,
  baseTypeIds: ['dry', 'normal', 'oily'],
  modifierTypeId: 'sensitive',
  concernStepId: 'concerns',
  concerns: BODY_CONCERNS,
  plan: bodyPlan,
  sources: BODY_SOURCES,
};
