/**
 * Scalp & hair track. Starts with a safety check — a round bald patch, hair coming out in
 * clumps, a painful or oozing scalp, a spreading rash, or dandruff that four weeks of
 * anti-dandruff shampoo has not touched are reasons to see a doctor before any product — then the
 * five scalp types (a beauty-care grouping, not a medical one), six helper questions, hair
 * texture and treatments, thirteen concerns, washing habit and goals.
 *
 * Sources: AAD hair & scalp pages, NHS, Cleveland Clinic and Mayo Clinic, via the 2026-10-12
 * research pass (search excerpts; a person still needs to read the pages). "Hair loss" wording
 * follows Korea's MFDS rule: only an approved functional product may say it helps with hair-loss
 * symptoms, so nothing here promises regrowth or prevention.
 */
import { L, NONE, NOT_SURE } from './common';
import type {
  AdviceBlock,
  CarePlan,
  CareTrack,
  CareType,
  QuestAnswers,
  QuestStep,
  RoutineLine,
  Source,
  TypeReading,
  CareConcern,
} from './types';

const SECTION_SAFETY = L(
  '1단계 · 먼저 안전 확인',
  'Step 1 · Safety first',
  'ຂັ້ນ 1 · ກວດຄວາມປອດໄພກ່ອນ',
  'ขั้นที่ 1 · ตรวจความปลอดภัยก่อน',
  'Étape 1 · Sécurité d’abord',
);
const SECTION_TYPE = L(
  '2단계 · 두피 타입',
  'Step 2 · Scalp type',
  'ຂັ້ນ 2 · ປະເພດໜັງຫົວ',
  'ขั้นที่ 2 · ประเภทหนังศีรษะ',
  'Étape 2 · Type de cuir chevelu',
);
const SECTION_HAIR = L(
  '3단계 · 머리카락',
  'Step 3 · Your hair',
  'ຂັ້ນ 3 · ເສັ້ນຜົມ',
  'ขั้นที่ 3 · เส้นผม',
  'Étape 3 · Vos cheveux',
);
const SECTION_CONCERNS = L(
  '4단계 · 고민',
  'Step 4 · Concerns',
  'ຂັ້ນ 4 · ບັນຫາ',
  'ขั้นที่ 4 · ปัญหา',
  'Étape 4 · Préoccupations',
);
const SECTION_HABITS = L(
  '5단계 · 습관과 목표',
  'Step 5 · Habits & goals',
  'ຂັ້ນ 5 · ນິໄສ ແລະ ເປົ້າໝາຍ',
  'ขั้นที่ 5 · นิสัยและเป้าหมาย',
  'Étape 5 · Habitudes & objectifs',
);

export const SCALP_TYPES: readonly CareType[] = [
  {
    id: 'oily',
    icon: '💦',
    name: L('지성 두피', 'Oily scalp', 'ໜັງຫົວມັນ', 'หนังศีรษะมัน', 'Cuir chevelu gras'),
    summary: L(
      '감은 지 하루면 앞머리·정수리가 기름지고 뭉쳐요. 덥고 습한 날 더 심해요.',
      'A day after washing, the fringe and crown look greasy and clump — worse on hot, humid days.',
      'ສະຜົມແລ້ວມື້ດຽວ ໜ້າມ້າ ແລະ ກະໝ່ອມກໍມັນ — ຮ້າຍແຮງຂຶ້ນໃນມື້ຮ້ອນຊື້ນ.',
      'สระแล้ววันเดียวหน้าม้าและกลางศีรษะก็มันเป็นก้อน ยิ่งอากาศร้อนชื้นยิ่งมัน',
      'Un jour après le lavage, frange et sommet regraissent — pire quand il fait chaud et humide.',
    ),
    care: [
      L(
        '하루 한 번 감아도 괜찮아요. 샴푸는 두피에 집중해 거품을 내요.',
        'Washing once a day is fine; focus the lather on the scalp.',
        'ສະມື້ລະເທື່ອກໍໄດ້; ຟອກຢູ່ໜັງຫົວ.',
        'สระวันละครั้งได้ ตีฟองที่หนังศีรษะเป็นหลัก',
        'Un lavage par jour convient ; faire mousser au cuir chevelu.',
      ),
      L(
        '컨디셔너는 두피에 닿지 않게 길이와 끝에만.',
        'Keep conditioner off the scalp — lengths and ends only.',
        'ຄອນດິຊັນເນີ ທາສະເພາະຄວາມຍາວ ແລະ ປາຍ.',
        'ครีมนวดใช้เฉพาะความยาวและปลายผม ไม่ให้โดนหนังศีรษะ',
        'Après-shampoing sur longueurs et pointes seulement.',
      ),
      L(
        '두피를 완전히 말린 뒤 헬멧·모자를 써요.',
        'Dry the scalp fully before a helmet or hat.',
        'ເປົ່າໜັງຫົວໃຫ້ແຫ້ງກ່ອນໃສ່ໝວກກັນກະທົບ.',
        'เป่าหนังศีรษะให้แห้งก่อนใส่หมวกกันน็อกหรือหมวก',
        'Sécher complètement avant casque ou chapeau.',
      ),
    ],
  },
  {
    id: 'dry',
    icon: '🏜️',
    name: L('건성 두피', 'Dry scalp', 'ໜັງຫົວແຫ້ງ', 'หนังศีรษะแห้ง', 'Cuir chevelu sec'),
    summary: L(
      '기름지지 않지만 당기거나 가렵고, 작고 마른 하얀 가루가 떨어져요. 몸 피부도 건조한 편이에요.',
      'Not greasy, but tight or itchy, with small dry white flakes; body skin is often dry too.',
      'ບໍ່ມັນ ແຕ່ຕຶງ ຫຼື ຄັນ ມີຂີ້ຂາວນ້ອຍໆແຫ້ງ; ຜິວກາຍມັກແຫ້ງນຳ.',
      'ไม่มันแต่ตึงหรือคัน มีขุยขาวเล็กๆ แห้งๆ ผิวกายก็มักแห้งด้วย',
      'Pas gras mais tiraillé ou qui gratte, petites pellicules sèches ; la peau du corps est souvent sèche aussi.',
    ),
    care: [
      L(
        '매일 감지 않아도 돼요 — 기름이 신경 쓰일 때. 뜨거운 물은 피해요.',
        'No need to wash daily — wash when oil bothers you, and avoid hot water.',
        'ບໍ່ຈຳເປັນສະທຸກມື້; ຫຼີກລ່ຽງນ້ຳຮ້ອນ.',
        'ไม่ต้องสระทุกวัน สระเมื่อรู้สึกมัน และเลี่ยงน้ำร้อน',
        'Pas besoin de laver chaque jour ; évitez l’eau chaude.',
      ),
      L(
        '순한 무향 샴푸, 보습 컨디셔너.',
        'A mild, fragrance-free shampoo and a moisturising conditioner.',
        'ແຊມພູອ່ອນໂຍນ ບໍ່ມີນ້ຳຫອມ ແລະ ຄອນດິຊັນເນີໃຫ້ຄວາມຊຸ່ມ.',
        'แชมพูอ่อนโยนไร้น้ำหอม และครีมนวดให้ความชุ่มชื้น',
        'Shampoing doux sans parfum, après-shampoing hydratant.',
      ),
      L(
        '비듬 샴푸가 아니라 보습이 필요한 경우가 많아요.',
        'It often needs moisture, not an anti-dandruff shampoo.',
        'ມັກຕ້ອງການຄວາມຊຸ່ມ ບໍ່ແມ່ນແຊມພູກັນລັງແຄ.',
        'มักต้องการความชุ่มชื้น ไม่ใช่แชมพูขจัดรังแค',
        'Il lui faut souvent de l’hydratation, pas un antipelliculaire.',
      ),
    ],
  },
  {
    id: 'dandruff',
    icon: '❄️',
    name: L(
      '비듬성 두피',
      'Dandruff-prone scalp',
      'ໜັງຫົວມີລັງແຄ',
      'หนังศีรษะมีรังแค',
      'Cuir chevelu à pellicules',
    ),
    summary: L(
      '기름기 있는 노르스름한 각질과 가려움이 함께 와요. 두피에 사는 효모균·피지와 관련 있어요.',
      'Greasy, yellowish flakes with itching — linked to a yeast that lives on the scalp, and to oil.',
      'ຂີ້ລັງແຄເຫຼືອງມັນ ແລະ ຄັນ — ກ່ຽວຂ້ອງກັບເຊື້ອລາ ແລະ ຄວາມມັນ.',
      'ขุยสีเหลืองมันพร้อมอาการคัน เกี่ยวข้องกับยีสต์บนหนังศีรษะและความมัน',
      'Pellicules jaunâtres et grasses avec démangeaisons — liées à une levure du cuir chevelu et au sébum.',
    ),
    care: [
      L(
        '비듬 샴푸를 라벨대로 몇 분 두었다 헹궈요. 좋아지면 횟수를 줄여요.',
        'Use an anti-dandruff shampoo as labelled, left on a few minutes; cut back once it improves.',
        'ໃຊ້ແຊມພູກັນລັງແຄຕາມສະຫຼາກ ປະໄວ້ຈັກນາທີ; ດີຂຶ້ນແລ້ວໃຊ້ໜ້ອຍລົງ.',
        'ใช้แชมพูขจัดรังแคตามฉลาก ทิ้งไว้สักครู่ ดีขึ้นแล้วลดความถี่',
        'Antipelliculaire selon l’étiquette, quelques minutes de pose ; espacer quand ça va mieux.',
      ),
      L(
        '한 가지가 안 맞으면 다른 성분으로 바꾸거나 번갈아 써요.',
        'If one does not help, switch to — or alternate with — a different active.',
        'ຖ້າອັນໜຶ່ງບໍ່ໄດ້ຜົນ ປ່ຽນ ຫຼື ສະຫຼັບກັບສ່ວນປະສົມອື່ນ.',
        'ถ้าตัวหนึ่งไม่ได้ผล เปลี่ยนหรือสลับกับสารตัวอื่น',
        'Sinon, changer d’actif ou alterner.',
      ),
      L(
        '4주 넘게 그대로면 피부과에 — 건선·곰팡이 감염일 수도 있어요.',
        'Unchanged after four weeks? See a dermatologist — it may be psoriasis or a fungal infection.',
        'ຖ້າ 4 ອາທິດແລ້ວບໍ່ດີຂຶ້ນ ໃຫ້ພົບແພດຜິວໜັງ.',
        'ถ้า 4 สัปดาห์แล้วไม่ดีขึ้นให้พบแพทย์ผิวหนัง อาจเป็นสะเก็ดเงินหรือเชื้อรา',
        'Sans changement après quatre semaines : dermatologue.',
      ),
    ],
  },
  {
    id: 'normal',
    icon: '🌸',
    name: L(
      '중성 두피',
      'Balanced scalp',
      'ໜັງຫົວປົກກະຕິ',
      'หนังศีรษะปกติ',
      'Cuir chevelu équilibré',
    ),
    summary: L(
      '특별히 기름지거나 가렵지 않고, 2–3일은 편안해요.',
      'Neither greasy nor itchy; comfortable for two or three days.',
      'ບໍ່ມັນ ບໍ່ຄັນ; ສະບາຍ 2–3 ມື້.',
      'ไม่มันไม่คัน สบาย 2–3 วัน',
      'Ni gras ni démangeaisons ; confortable deux ou trois jours.',
    ),
    care: [
      L(
        '기름이 신경 쓰일 때 감고, 땀 흘린 날은 그날 씻어요.',
        'Wash when oil bothers you, and on any day you sweat a lot.',
        'ສະເມື່ອຮູ້ສຶກມັນ ແລະ ມື້ທີ່ເຫື່ອອອກຫຼາຍ.',
        'สระเมื่อรู้สึกมัน และวันที่เหงื่อออกมาก',
        'Laver quand ça graisse, et les jours de forte transpiration.',
      ),
      L(
        '가르마에도 햇빛이 닿아요 — 모자를 써요.',
        'Sun reaches the parting too — wear a hat.',
        'ແດດສ່ອງຮອດແສກຜົມ — ໃສ່ໝວກ.',
        'แดดส่องถึงแสกผม ใส่หมวก',
        'Le soleil atteint la raie — portez un chapeau.',
      ),
    ],
  },
  {
    id: 'sensitive',
    icon: '🌹',
    name: L(
      '민감성 두피',
      'Sensitive scalp',
      'ໜັງຫົວແພ້ງ່າຍ',
      'หนังศีรษะแพ้ง่าย',
      'Cuir chevelu sensible',
    ),
    summary: L(
      '새 샴푸·염색약·더위에 따끔·화끈거리거나 붉어져요. 다른 타입과 함께 있을 수 있어요.',
      'Stings, burns or reddens with a new shampoo, hair dye or heat; can come with any other type.',
      'ແສບ ຮ້ອນ ຫຼື ແດງ ເມື່ອໃຊ້ແຊມພູໃໝ່, ຢາຍ້ອມຜົມ ຫຼື ອາກາດຮ້ອນ.',
      'แสบ ร้อน หรือแดงเมื่อใช้แชมพูใหม่ ยาย้อมผม หรืออากาศร้อน มีร่วมกับประเภทอื่นได้',
      'Picote, brûle ou rougit avec un nouveau shampoing, une coloration ou la chaleur.',
    ),
    care: [
      L(
        '무향·저자극 샴푸, 새 제품은 하나씩.',
        'Fragrance-free, gentle shampoo; one new product at a time.',
        'ແຊມພູບໍ່ມີນ້ຳຫອມ ອ່ອນໂຍນ; ຜະລິດຕະພັນໃໝ່ເທື່ອລະອັນ.',
        'แชมพูไร้น้ำหอม อ่อนโยน เพิ่มผลิตภัณฑ์ใหม่ทีละตัว',
        'Shampoing doux sans parfum ; un nouveau produit à la fois.',
      ),
      L(
        '염색 전에는 꼭 48시간 패치 테스트(귀 뒤).',
        'Always do a 48-hour patch test behind the ear before dyeing.',
        'ກ່ອນຍ້ອມຜົມ ທົດສອບຫຼັງຫູ 48 ຊົ່ວໂມງສະເໝີ.',
        'ก่อนย้อมผมทดสอบหลังหู 48 ชั่วโมงเสมอ',
        'Toujours un test de 48 h derrière l’oreille avant une coloration.',
      ),
    ],
  },
];

const SIGNS: Record<string, readonly ReturnType<typeof L>[]> = {
  oily: [
    L(
      '하루만 지나도 떡져요',
      'Greasy within a day',
      'ມື້ດຽວກໍມັນ',
      'วันเดียวก็มัน',
      'Gras en un jour',
    ),
    L(
      '매일 감아야 편해요',
      'Feels best washed daily',
      'ຕ້ອງສະທຸກມື້',
      'ต้องสระทุกวัน',
      'Mieux lavé chaque jour',
    ),
  ],
  dry: [
    L('당기고 가려워요', 'Tight and itchy', 'ຕຶງ ແລະ ຄັນ', 'ตึงและคัน', 'Tiraille et gratte'),
    L(
      '작은 하얀 가루',
      'Small white flakes',
      'ຂີ້ຂາວນ້ອຍໆ',
      'ขุยขาวเล็กๆ',
      'Petites pellicules blanches',
    ),
  ],
  dandruff: [
    L(
      '노르스름한 기름진 각질',
      'Yellowish, greasy flakes',
      'ຂີ້ລັງແຄເຫຼືອງມັນ',
      'ขุยเหลืองมัน',
      'Pellicules grasses jaunâtres',
    ),
    L(
      '거의 매일 가려워요',
      'Itchy nearly every day',
      'ຄັນເກືອບທຸກມື້',
      'คันเกือบทุกวัน',
      'Démange presque chaque jour',
    ),
  ],
  normal: [
    L(
      '2–3일은 편안해요',
      'Comfortable for 2–3 days',
      'ສະບາຍ 2–3 ມື້',
      'สบาย 2–3 วัน',
      'Confortable 2–3 jours',
    ),
    L(
      '가려움·각질이 드물어요',
      'Rarely itchy or flaky',
      'ບໍ່ຄ່ອຍຄັນ',
      'ไม่ค่อยคันหรือเป็นขุย',
      'Rarement des pellicules',
    ),
  ],
  sensitive: [
    L(
      '새 샴푸에 따끔해요',
      'A new shampoo stings',
      'ແຊມພູໃໝ່ເຮັດໃຫ້ແສບ',
      'แชมพูใหม่ทำให้แสบ',
      'Un nouveau shampoing picote',
    ),
    L(
      '가르마가 붉어 보여요',
      'The parting looks red',
      'ແສກຜົມເບິ່ງແດງ',
      'แสกผมดูแดง',
      'La raie paraît rouge',
    ),
  ],
};

const s = (scores: Record<string, number>) => scores;

export const SCALP_CONCERNS: readonly CareConcern[] = [
  {
    id: 'dandruff',
    icon: '❄️',
    governedId: 'CON-013',
    name: L('비듬', 'Dandruff', 'ລັງແຄ', 'รังแค', 'Pellicules'),
    what: L(
      '하얗거나 노르스름한 각질이 떨어지고 두피가 가려워요.',
      'White or yellowish flakes on hair and shoulders, with itching.',
      'ຂີ້ຂາວ ຫຼື ເຫຼືອງຫຼົ່ນ ແລະ ຄັນ.',
      'ขุยขาวหรือเหลืองร่วงและคันหนังศีรษะ',
      'Pellicules blanches ou jaunâtres et démangeaisons.',
    ),
    ingredients: ['bha', 'teatree'],
    otherIngredients: [
      L(
        '징크피리치온',
        'Zinc pyrithione',
        'Zinc pyrithione',
        'ซิงค์ไพริไทออน',
        'Pyrithione de zinc',
      ),
      L('케토코나졸', 'Ketoconazole', 'Ketoconazole', 'คีโตโคนาโซล', 'Kétoconazole'),
      L(
        '셀레늄설파이드',
        'Selenium sulfide',
        'Selenium sulfide',
        'ซีลีเนียมซัลไฟด์',
        'Sulfure de sélénium',
      ),
    ],
    products: ['dandruffShampoo', 'scalpCare'],
    storeKeys: ['scalp'],
    tip: L(
      '라벨대로 두피에 몇 분 두었다 헹궈요. 좋아지면 횟수를 줄여요.',
      'Leave it on the scalp for the minutes the label says; cut back once it improves.',
      'ປະໄວ້ຕາມສະຫຼາກ; ດີຂຶ້ນແລ້ວໃຊ້ໜ້ອຍລົງ.',
      'ทิ้งไว้ตามเวลาบนฉลาก ดีขึ้นแล้วลดความถี่',
      'Laisser poser le temps indiqué ; espacer ensuite.',
    ),
    seeDoctor: L(
      '4주 넘게 써도 그대로이거나, 심하거나, 붓고 아플 때 — 건선·곰팡이 감염·습진일 수 있어요.',
      'No better after four weeks, severe, or swollen and painful — it may be psoriasis, a fungal infection or eczema.',
      'ໃຊ້ 4 ອາທິດແລ້ວບໍ່ດີຂຶ້ນ, ໜັກ, ບວມ ຫຼື ເຈັບ.',
      'ใช้ 4 สัปดาห์แล้วไม่ดีขึ้น รุนแรง หรือบวมเจ็บ อาจเป็นสะเก็ดเงิน เชื้อรา หรือผื่นแพ้',
      'Aucun mieux après quatre semaines, sévère, ou gonflé et douloureux.',
    ),
  },
  {
    id: 'itchy',
    icon: '🤏',
    name: L('두피 가려움', 'Itchy scalp', 'ໜັງຫົວຄັນ', 'หนังศีรษะคัน', 'Cuir chevelu qui gratte'),
    what: L(
      '각질이 있든 없든 두피가 자주 가려워요.',
      'The scalp itches often, flakes or not.',
      'ໜັງຫົວຄັນເລື້ອຍໆ.',
      'หนังศีรษะคันบ่อย ไม่ว่ามีขุยหรือไม่',
      'Démangeaisons fréquentes, avec ou sans pellicules.',
    ),
    ingredients: ['panthenol', 'centella', 'teatree'],
    products: ['shampoo', 'scalpCare'],
    storeKeys: ['scalp'],
    tip: L(
      '샴푸·염색약을 바꾼 뒤 시작됐다면 그 제품을 먼저 쉬어 보세요.',
      'If it began after a new shampoo or dye, stop that product first.',
      'ຖ້າເລີ່ມຫຼັງປ່ຽນແຊມພູ ຫຼື ຢາຍ້ອມ ໃຫ້ຢຸດອັນນັ້ນກ່ອນ.',
      'ถ้าเริ่มหลังเปลี่ยนแชมพูหรือยาย้อม ให้หยุดตัวนั้นก่อน',
      'Si c’est apparu après un nouveau produit, arrêtez-le d’abord.',
    ),
    seeDoctor: L(
      '바꿔도 낫지 않거나, 붓고 뜨겁거나, 진물·빠진 자리가 생길 때.',
      'If changing products does not help, or it swells, feels hot, oozes or leaves bald spots.',
      'ປ່ຽນແລ້ວບໍ່ດີຂຶ້ນ, ບວມ, ຮ້ອນ, ມີນ້ຳເຫຼືອງ ຫຼື ຜົມຫຼົ່ນເປັນບ່ອນ.',
      'เปลี่ยนแล้วไม่ดีขึ้น บวม ร้อน มีน้ำเหลือง หรือมีจุดผมร่วง',
      'Si rien n’y fait, ou en cas de gonflement, chaleur, suintement ou zones dégarnies.',
    ),
  },
  {
    id: 'oilyScalp',
    icon: '💦',
    name: L('두피 기름짐', 'Greasy roots', 'ໜັງຫົວມັນ', 'หนังศีรษะมัน', 'Racines grasses'),
    what: L(
      '감은 지 하루 만에 뿌리가 기름지고 납작해져요.',
      'Roots turn greasy and flat within a day.',
      'ມື້ດຽວ ໂຄນຜົມກໍມັນ ແລະ ແປ.',
      'วันเดียวโคนผมก็มันและแบน',
      'Racines grasses et plates en un jour.',
    ),
    ingredients: ['bha', 'teatree', 'niacinamide'],
    products: ['shampoo', 'scalpCare'],
    storeKeys: ['scalp'],
    tip: L(
      '하루 한 번 감아도 괜찮아요. 땀 흘린 날은 그날 감고, 두피까지 완전히 말려요.',
      'Washing daily is fine; wash on sweaty days and dry right down to the scalp.',
      'ສະທຸກມື້ໄດ້; ມື້ເຫື່ອອອກ ສະ ແລະ ເປົ່າໃຫ້ແຫ້ງຮອດໜັງຫົວ.',
      'สระทุกวันได้ วันที่เหงื่อออกให้สระ และเป่าให้แห้งถึงหนังศีรษะ',
      'Un lavage par jour convient ; sécher jusqu’au cuir chevelu.',
    ),
    seeDoctor: L(
      '가려움·각질·붉은 기가 계속 함께 있거나, 아프고 곪는 뾰루지가 계속될 때.',
      'When itch, flakes and redness keep coming with it, or sore, pus-filled bumps persist.',
      'ມີຄັນ, ຂີ້ລັງແຄ ແລະ ແດງຮ່ວມກັນເລື້ອຍໆ ຫຼື ຕຸ່ມເຈັບມີໜອງ.',
      'มีคัน ขุย และแดงร่วมด้วยต่อเนื่อง หรือมีตุ่มหนองเจ็บไม่หาย',
      'Si démangeaisons, pellicules et rougeurs persistent, ou boutons douloureux.',
    ),
  },
  {
    id: 'scalpRed',
    icon: '🌹',
    name: L(
      '두피 붉어짐·예민함',
      'Red, reactive scalp',
      'ໜັງຫົວແດງ ແພ້ງ່າຍ',
      'หนังศีรษะแดง ระคายง่าย',
      'Cuir chevelu rouge et réactif',
    ),
    what: L(
      '두피가 붉거나 따끔·화끈거리고, 제품을 바꾸면 쉽게 반응해요.',
      'Red, stinging or burning, and quick to react to new products.',
      'ແດງ, ແສບ ຫຼື ຮ້ອນ, ປ່ຽນຜະລິດຕະພັນກໍແພ້ງ່າຍ.',
      'แดง แสบ หรือร้อน และระคายง่ายเมื่อเปลี่ยนผลิตภัณฑ์',
      'Rouge, picote ou brûle ; réagit vite aux nouveaux produits.',
    ),
    ingredients: ['centella', 'panthenol', 'madecassoside'],
    products: ['shampoo', 'scalpCare'],
    storeKeys: ['scalp'],
    tip: L(
      '무향·저자극 샴푸, 미지근한 물, 드라이어는 시원한 바람으로.',
      'Fragrance-free gentle shampoo, lukewarm water, and the dryer on cool.',
      'ແຊມພູບໍ່ມີນ້ຳຫອມ, ນ້ຳອຸ່ນ, ເປົ່າລົມເຢັນ.',
      'แชมพูไร้น้ำหอม น้ำอุ่น และไดร์ลมเย็น',
      'Shampoing sans parfum, eau tiède, séchoir sur froid.',
    ),
    seeDoctor: L(
      '두꺼운 붉은 판, 은빛 비늘, 진물, 통증, 붓기, 번지는 발진이 있을 때.',
      'Thick red plaques, silvery scales, oozing, pain, swelling or a spreading rash.',
      'ມີແຜ່ນແດງໜາ, ເກັດສີເງິນ, ນ້ຳເຫຼືອງ, ເຈັບ, ບວມ ຫຼື ຜື່ນລາມ.',
      'มีปื้นแดงหนา สะเก็ดสีเงิน น้ำเหลือง เจ็บ บวม หรือผื่นลาม',
      'Plaques épaisses, squames argentées, suintement, douleur ou éruption qui s’étend.',
    ),
  },
  {
    id: 'scalpSun',
    photo: '/gemini/A-07.jpg',
    icon: '☀️',
    name: L(
      '가르마 햇빛 화상',
      'Sunburnt parting',
      'ແສກຜົມຖືກແດດໄໝ້',
      'แสกผมไหม้แดด',
      'Raie brûlée par le soleil',
    ),
    what: L(
      '햇볕 아래 있은 뒤 가르마·정수리가 붉고 따가워요.',
      'After time in the sun, the parting or crown is red and sore.',
      'ຫຼັງຖືກແດດ ແສກຜົມ ແລະ ກະໝ່ອມແດງ ແສບ.',
      'หลังโดนแดด แสกผมหรือกลางศีรษะแดงและแสบ',
      'Après le soleil, la raie ou le sommet est rouge et douloureux.',
    ),
    ingredients: ['sunscreen', 'aloe', 'panthenol'],
    products: ['sunscreen'],
    storeKeys: ['uv'],
    tip: L(
      '모자가 가장 확실해요. 가르마를 자주 바꾸고, 두피용 선스프레이도 있어요.',
      'A hat works best. Change your parting now and then; scalp sun sprays exist too.',
      'ໝວກດີທີ່ສຸດ. ປ່ຽນແສກຜົມ; ມີສະເປຣກັນແດດໜັງຫົວ.',
      'หมวกได้ผลที่สุด เปลี่ยนแสกผมบ้าง และมีสเปรย์กันแดดสำหรับหนังศีรษะ',
      'Le chapeau reste le meilleur. Changez de raie ; il existe des sprays solaires.',
    ),
    seeDoctor: L(
      '물집이 생겼다면 2도 화상이에요 — 터뜨리지 말고 진료를 받으세요.',
      'Blisters mean a second-degree burn — do not pop them, and see a doctor.',
      'ຖ້າພຸພອງ ແມ່ນໄໝ້ລະດັບ 2 — ຢ່າເຈາະ ແລະ ພົບແພດ.',
      'ถ้ามีตุ่มพองคือแผลไหม้ระดับ 2 อย่าเจาะ และไปพบแพทย์',
      'Des cloques = brûlure du 2e degré : ne pas percer, consulter.',
    ),
  },
  {
    id: 'shedding',
    icon: '🍂',
    name: L(
      '머리카락이 많이 빠지는 느낌',
      'More hair falling out',
      'ຜົມຫຼົ່ນຫຼາຍ',
      'ผมร่วงมาก',
      'Plus de chute de cheveux',
    ),
    what: L(
      '빗·베개·배수구에 평소보다 많이 보여요. 하루 50–100가닥은 정상 범위예요.',
      'More than usual on the brush, pillow or drain. Losing 50–100 hairs a day is normal.',
      'ເຫັນຜົມຫຼົ່ນຫຼາຍກວ່າປົກກະຕິ. ມື້ລະ 50–100 ເສັ້ນແມ່ນປົກກະຕິ.',
      'เห็นผมร่วงมากกว่าปกติ วันละ 50–100 เส้นถือว่าปกติ',
      'Plus que d’habitude sur la brosse ou l’oreiller. 50 à 100 cheveux par jour, c’est normal.',
    ),
    ingredients: ['panthenol', 'niacinamide'],
    otherIngredients: [
      L('비오틴', 'Biotin', 'Biotin', 'ไบโอติน', 'Biotine'),
      L('엘-멘톨', 'L-menthol', 'L-menthol', 'แอล-เมนทอล', 'L-menthol'),
      L(
        '징크피리치온',
        'Zinc pyrithione',
        'Zinc pyrithione',
        'ซิงค์ไพริไทออน',
        'Pyrithione de zinc',
      ),
    ],
    products: ['shampoo', 'scalpCare'],
    storeKeys: ['scalp'],
    tip: L(
      '큰 스트레스·출산·급한 다이어트 2–3개월 뒤에 많이 빠지기도 해요. 한국에서는 식약처 심사를 받은 기능성 제품만 «탈모 증상 완화에 도움»이라고 쓸 수 있어요.',
      'Heavy shedding can follow major stress, childbirth or crash dieting by two or three months. In Korea only MFDS-approved functional products may say they "help ease hair-loss symptoms".',
      'ຜົມອາດຫຼົ່ນຫຼາຍ 2–3 ເດືອນຫຼັງຄວາມຄຽດ, ເກີດລູກ ຫຼື ຫຼຸດນ້ຳໜັກໄວ.',
      'ผมอาจร่วงมาก 2–3 เดือนหลังความเครียดหนัก คลอดบุตร หรือลดน้ำหนักเร็ว ในเกาหลีเฉพาะผลิตภัณฑ์ที่ผ่านการรับรองจึงเขียนว่า «ช่วยบรรเทาอาการผมร่วง» ได้',
      'Une forte chute peut suivre de deux ou trois mois un stress, un accouchement ou un régime brutal.',
    ),
    seeDoctor: L(
      '갑자기 많이 빠질 때, 동그랗게 빠진 자리, 뭉텅이로 빠질 때, 몸의 털도 함께 빠질 때. 영양제는 혈액검사로 부족이 확인될 때만.',
      'Sudden heavy loss, round patches, clumps, or body hair falling too. Supplements only when a blood test shows a shortage.',
      'ຫຼົ່ນຫຼາຍທັນທີ, ເປັນວົງ, ເປັນກຳ, ຫຼື ຂົນໃນຮ່າງກາຍຫຼົ່ນນຳ.',
      'ร่วงมากกะทันหัน เป็นวง เป็นกระจุก หรือขนตามตัวร่วงด้วย อาหารเสริมเฉพาะเมื่อตรวจเลือดพบว่าขาด',
      'Chute brutale, plaques rondes, poignées, ou poils du corps aussi. Compléments seulement si une prise de sang montre un manque.',
    ),
  },
  {
    id: 'thinning',
    icon: '🪶',
    name: L(
      '가늘어짐·볼륨 부족',
      'Thinning & low volume',
      'ຜົມບາງລົງ',
      'ผมบางลง',
      'Cheveux qui s’affinent',
    ),
    what: L(
      '가르마가 넓어 보이거나 정수리 두피가 더 보이고, 묶은 굵기가 줄었어요.',
      'A wider parting, more scalp at the crown, a thinner ponytail.',
      'ແສກກວ້າງຂຶ້ນ, ເຫັນໜັງຫົວຢູ່ກະໝ່ອມ, ມັດຜົມນ້ອຍລົງ.',
      'แสกผมกว้างขึ้น เห็นหนังศีรษะกลางหัว หางม้าเล็กลง',
      'Raie plus large, sommet plus visible, queue de cheval plus fine.',
    ),
    ingredients: ['panthenol', 'niacinamide'],
    otherIngredients: [L('비오틴', 'Biotin', 'Biotin', 'ไบโอติน', 'Biotine')],
    products: ['shampoo', 'scalpCare'],
    storeKeys: ['scalp'],
    tip: L(
      '꽉 묶은 머리를 느슨하게. 당기는 머리 모양이 계속되면 영구적으로 빠질 수 있어요.',
      'Loosen tight styles — constant pulling can cause permanent loss.',
      'ມັດຜົມໃຫ້ຫຼວມ — ການດຶງເລື້ອຍໆ ອາດເຮັດໃຫ້ຫຼົ່ນຖາວອນ.',
      'มัดผมให้หลวม การดึงรั้งต่อเนื่องอาจทำให้ผมร่วงถาวร',
      'Desserrez les coiffures : une traction constante peut être définitive.',
    ),
    seeDoctor: L(
      '눈에 띄게 가늘어졌다면 피부과에 — 일찍 시작할수록 관리 효과가 좋은 편이에요.',
      'If thinning is noticeable, see a dermatologist — earlier care tends to do better.',
      'ຖ້າເຫັນວ່າບາງລົງ ໃຫ້ພົບແພດຜິວໜັງ — ຍິ່ງໄວຍິ່ງດີ.',
      'ถ้าบางลงชัดเจนให้พบแพทย์ผิวหนัง ยิ่งเริ่มเร็วยิ่งดี',
      'Si c’est visible, consultez tôt.',
    ),
  },
  {
    id: 'gray',
    icon: '🤍',
    name: L('새치', 'Early grey hair', 'ຜົມຫງອກໄວ', 'ผมหงอกก่อนวัย', 'Cheveux blancs précoces'),
    what: L(
      '젊은 나이에 흰 머리카락이 보여요. 가장 큰 요인은 유전이에요.',
      'White hairs at a young age; genes are the biggest factor.',
      'ຜົມຫງອກຕອນອາຍຸນ້ອຍ; ພັນທຸກຳແມ່ນປັດໃຈໃຫຍ່.',
      'ผมขาวตั้งแต่อายุน้อย ปัจจัยหลักคือพันธุกรรม',
      'Cheveux blancs jeunes ; l’hérédité domine.',
    ),
    ingredients: [],
    products: ['shampoo', 'conditioner'],
    storeKeys: ['scalp'],
    tip: L(
      '뽑지 마세요. 염색한다면 48시간 패치 테스트를 먼저.',
      'Don’t pluck them. If you dye, do a 48-hour patch test first.',
      'ຢ່າຖອນ. ຖ້າຍ້ອມ ໃຫ້ທົດສອບ 48 ຊົ່ວໂມງກ່ອນ.',
      'อย่าถอน ถ้าจะย้อมให้ทดสอบ 48 ชั่วโมงก่อน',
      'Ne pas arracher. Test de 48 h avant toute coloration.',
    ),
    seeDoctor: L(
      '가족력 없이 일찍 생기거나 다른 증상(피로·체중 변화)이 함께 있을 때.',
      'If it starts early with no family history, or with other symptoms such as tiredness or weight change.',
      'ຖ້າເລີ່ມໄວໂດຍບໍ່ມີປະຫວັດຄອບຄົວ ຫຼື ມີອາການອື່ນ.',
      'ถ้าเริ่มเร็วโดยไม่มีประวัติครอบครัว หรือมีอาการอื่นร่วม',
      'S’ils arrivent tôt sans antécédents, ou avec d’autres symptômes.',
    ),
  },
  {
    id: 'damaged',
    icon: '🧵',
    governedId: 'CON-015',
    name: L(
      '손상모 (염색·펌·열)',
      'Damaged hair (colour, perm, heat)',
      'ຜົມເສຍ (ຍ້ອມ, ດັດ, ຄວາມຮ້ອນ)',
      'ผมเสีย (ทำสี ดัด ความร้อน)',
      'Cheveux abîmés',
    ),
    what: L(
      '시술·고데기 뒤 건조하고 뻣뻣하며 잘 끊어져요.',
      'Dry, stiff and breaking after chemical services or hot tools.',
      'ແຫ້ງ ແຂງ ແລະ ຂາດງ່າຍ ຫຼັງເຮັດຜົມ.',
      'แห้ง แข็ง และขาดง่ายหลังทำเคมีหรือใช้ความร้อน',
      'Secs, rêches, cassants après soins chimiques ou chaleur.',
    ),
    ingredients: ['ceramide', 'panthenol', 'squalane'],
    otherIngredients: [
      L(
        '케라틴·아미노산',
        'Keratin, amino acids',
        'Keratin',
        'เคราติน กรดอะมิโน',
        'Kératine, acides aminés',
      ),
    ],
    products: ['conditioner', 'hairMask', 'hairOil'],
    storeKeys: ['scalp'],
    tip: L(
      '시술 사이 간격을 두고, 열기구 전엔 열 보호제, 가장 낮은 온도로.',
      'Space out chemical services; heat protectant first and the lowest heat setting.',
      'ເວັ້ນໄລຍະການເຮັດຜົມ; ທາກັນຄວາມຮ້ອນ ແລະ ໃຊ້ອຸນຫະພູມຕ່ຳ.',
      'เว้นระยะการทำเคมี ใช้กันความร้อนก่อน และอุณหภูมิต่ำสุด',
      'Espacer les soins chimiques ; protecteur thermique et chaleur minimale.',
    ),
    seeDoctor: L(
      '시술 중·후 두피가 화끈거리거나 물집·진물이 생기면 바로 헹구고 진료를.',
      'If the scalp burns, blisters or oozes during or after a service, rinse at once and see a doctor.',
      'ຖ້າໜັງຫົວຮ້ອນ, ພຸພອງ ຫຼື ມີນ້ຳເຫຼືອງ ໃຫ້ລ້າງທັນທີ ແລະ ພົບແພດ.',
      'ถ้าหนังศีรษะแสบร้อน พอง หรือมีน้ำเหลืองระหว่างหรือหลังทำ ให้ล้างทันทีและพบแพทย์',
      'Brûlure, cloques ou suintement : rincer aussitôt et consulter.',
    ),
  },
  {
    id: 'splitEnds',
    icon: '✂️',
    name: L('끝 갈라짐', 'Split ends', 'ປາຍຜົມແຕກ', 'ผมแตกปลาย', 'Fourches'),
    what: L(
      '머리카락 끝이 갈라지고 거칠어 보여요.',
      'Tips split into two or more and look rough.',
      'ປາຍຜົມແຕກ ແລະ ເບິ່ງກະດ້າງ.',
      'ปลายผมแตกและดูหยาบ',
      'Pointes fourchues et rêches.',
    ),
    ingredients: ['squalane', 'ceramide'],
    products: ['conditioner', 'hairOil'],
    storeKeys: ['scalp'],
    tip: L(
      '갈라진 끝은 붙지 않아요 — 다듬고, 젖은 머리는 넓은 빗으로 살살.',
      'Split ends do not rejoin — trim them, and comb wet hair gently with a wide-tooth comb.',
      'ປາຍແຕກບໍ່ຕິດຄືນ — ຕັດ ແລະ ຫວີຜົມປຽກຄ່ອຍໆ.',
      'ปลายแตกไม่กลับมาติด ให้เล็ม และหวีผมเปียกเบาๆ ด้วยหวีซี่ห่าง',
      'Une fourche ne se recolle pas : couper, peigne à dents larges.',
    ),
  },
  {
    id: 'dryDull',
    icon: '🌾',
    governedId: 'CON-014',
    name: L(
      '푸석함·건조',
      'Dry, dull hair',
      'ຜົມແຫ້ງ ບໍ່ເງົາ',
      'ผมแห้ง ไม่เงา',
      'Cheveux secs et ternes',
    ),
    what: L(
      '거칠고 윤기가 없으며 엉켜요.',
      'Rough, without shine, and tangles easily.',
      'ກະດ້າງ ບໍ່ເງົາ ແລະ ພັນກັນ.',
      'หยาบ ไม่เงา และพันกันง่าย',
      'Rêches, sans éclat, s’emmêlent.',
    ),
    ingredients: ['squalane', 'ceramide', 'panthenol'],
    products: ['conditioner', 'hairMask', 'hairOil'],
    storeKeys: ['scalp'],
    tip: L(
      '샴푸는 두피에만, 컨디셔너는 매번. 햇빛·수영장 물도 건조하게 해요.',
      'Shampoo the scalp only and condition every time; sun and pool water dry hair too.',
      'ແຊມພູສະເພາະໜັງຫົວ, ຄອນດິຊັນເນີທຸກເທື່ອ.',
      'แชมพูเฉพาะหนังศีรษะ ใช้ครีมนวดทุกครั้ง แดดและน้ำในสระทำให้ผมแห้ง',
      'Shampoing au cuir chevelu seulement, après-shampoing à chaque fois.',
    ),
  },
  {
    id: 'frizz',
    icon: '🌀',
    name: L('부스스함', 'Frizz', 'ຜົມຟູ', 'ผมชี้ฟู', 'Frisottis'),
    what: L(
      '습한 날 머리가 부풀고 잔머리가 일어나요 — 라오스 우기에 흔해요.',
      'Hair puffs up on humid days — common in the Lao rainy season.',
      'ຜົມຟູໃນມື້ຊື້ນ — ພົບຫຼາຍໃນລະດູຝົນ.',
      'ผมฟูในวันที่อากาศชื้น พบบ่อยในหน้าฝน',
      'Les cheveux gonflent par temps humide.',
    ),
    ingredients: ['squalane', 'ceramide'],
    products: ['conditioner', 'hairOil'],
    storeKeys: ['scalp'],
    tip: L(
      '수건으로 비비지 말고 감싸서 두드려요. 오일·에센스를 끝에 소량.',
      'Wrap and pat with the towel instead of rubbing; a little oil on the ends.',
      'ບໍ່ຖູ ໃຫ້ຫໍ່ ແລະ ຕົບ; ນ້ຳມັນໜ້ອຍໜຶ່ງທີ່ປາຍ.',
      'อย่าขยี้ ใช้ผ้าห่อแล้วซับ และใช้ออยล์เล็กน้อยที่ปลาย',
      'Tamponner sans frotter ; un peu d’huile sur les pointes.',
    ),
  },
  {
    id: 'static',
    icon: '⚡',
    name: L('정전기', 'Static & flyaways', 'ໄຟຟ້າສະຖິດ', 'ไฟฟ้าสถิต', 'Électricité statique'),
    what: L(
      '빗질하거나 옷을 벗을 때 머리카락이 붕 떠요. 에어컨 실내에서 심해요.',
      'Hair stands up when brushing or undressing; worse in air-conditioning.',
      'ຜົມຟູ ເມື່ອຫວີ ຫຼື ຖອດເສື້ອ; ຮ້າຍແຮງໃນຫ້ອງແອ.',
      'ผมลอยเมื่อหวีหรือถอดเสื้อ เป็นมากในห้องแอร์',
      'Les cheveux se dressent au brossage ; pire en climatisation.',
    ),
    ingredients: ['squalane'],
    products: ['conditioner', 'hairOil'],
    storeKeys: ['scalp'],
    tip: L(
      '컨디셔너를 빼먹지 말고, 마른 머리엔 오일을 손바닥에 펴서 살짝.',
      'Never skip conditioner; smooth a drop of oil between your palms over dry hair.',
      'ຢ່າຂ້າມຄອນດິຊັນເນີ; ທານ້ຳມັນໜ້ອຍໜຶ່ງ.',
      'อย่าข้ามครีมนวด ถูออยล์บนฝ่ามือแล้วลูบผมแห้งเบาๆ',
      'Toujours l’après-shampoing ; une goutte d’huile entre les paumes.',
    ),
  },
];

export const SCALP_STEPS: readonly QuestStep[] = [
  {
    kind: 'multi',
    id: 'redFlags',
    section: SECTION_SAFETY,
    prompt: L(
      '먼저 확인해요. 이 중 해당하는 것이 있나요?',
      'First, a safety check. Do any of these apply?',
      'ກ່ອນອື່ນ ກວດຄວາມປອດໄພ. ມີຂໍ້ໃດກົງບໍ?',
      'ก่อนอื่นตรวจความปลอดภัย มีข้อใดตรงไหม?',
      'D’abord, une vérification. L’un de ces cas s’applique-t-il ?',
    ),
    help: L(
      '하나라도 있으면 화장품보다 의사 진료가 먼저예요. 결과는 참고로만 보여 드려요.',
      'If any applies, a doctor comes before products; the result is then for reference only.',
      'ຖ້າມີຂໍ້ໃດ ໃຫ້ພົບທ່ານໝໍກ່ອນ; ຜົນແມ່ນເພື່ອອ້າງອີງເທົ່ານັ້ນ.',
      'ถ้ามีข้อใด ควรพบแพทย์ก่อนใช้ผลิตภัณฑ์ ผลลัพธ์ใช้อ้างอิงเท่านั้น',
      'Si l’un s’applique, consultez d’abord un médecin ; le résultat sera indicatif.',
    ),
    choices: [
      {
        id: 'patch',
        icon: '⭕',
        label: L(
          '동그랗게 머리카락이 빠진 자리가 생겼어요',
          'A round bald patch has appeared',
          'ມີບ່ອນຜົມຫຼົ່ນເປັນວົງມົນ',
          'มีจุดผมร่วงเป็นวงกลม',
          'Une plaque ronde sans cheveux est apparue',
        ),
      },
      {
        id: 'clumps',
        icon: '🫳',
        label: L(
          '갑자기 뭉텅이로 빠져요',
          'Hair is suddenly coming out in clumps',
          'ຜົມຫຼົ່ນເປັນກຳທັນທີ',
          'ผมร่วงเป็นกระจุกอย่างกะทันหัน',
          'Les cheveux tombent soudain par poignées',
        ),
      },
      {
        id: 'pain',
        icon: '🔥',
        label: L(
          '두피가 아프거나 붓거나 진물·고름·피가 나요',
          'The scalp hurts, swells, oozes, has pus or bleeds',
          'ໜັງຫົວເຈັບ ບວມ ມີນ້ຳເຫຼືອງ ໜອງ ຫຼື ເລືອດ',
          'หนังศีรษะเจ็บ บวม มีน้ำเหลือง หนอง หรือเลือด',
          'Le cuir chevelu fait mal, gonfle, suinte ou saigne',
        ),
      },
      {
        id: 'rash',
        icon: '🔴',
        label: L(
          '붉은 발진이 두피나 몸에 번지고 있어요',
          'A red rash is spreading on the scalp or body',
          'ຜື່ນແດງລາມຢູ່ໜັງຫົວ ຫຼື ຮ່າງກາຍ',
          'ผื่นแดงลามบนหนังศีรษะหรือร่างกาย',
          'Une éruption rouge s’étend',
        ),
      },
      {
        id: 'fourWeeks',
        icon: '📅',
        label: L(
          '비듬 샴푸를 4주 넘게 써도 그대로예요',
          'Four weeks of anti-dandruff shampoo changed nothing',
          'ໃຊ້ແຊມພູກັນລັງແຄ 4 ອາທິດ ບໍ່ດີຂຶ້ນ',
          'ใช้แชมพูขจัดรังแค 4 สัปดาห์แล้วไม่ดีขึ้น',
          'Quatre semaines d’antipelliculaire sans effet',
        ),
      },
      NONE,
    ],
  },
  {
    kind: 'learn',
    id: 'learnScalp',
    section: SECTION_TYPE,
    prompt: L(
      '두피도 타입이 있어요. 하나씩 들어 보세요.',
      'Scalps have types too. Have a listen.',
      'ໜັງຫົວກໍມີປະເພດ. ຟັງເທື່ອລະແບບ.',
      'หนังศีรษะก็มีประเภท ลองฟังทีละแบบ',
      'Le cuir chevelu a aussi ses types. Écoutez.',
    ),
    help: L(
      '미용에서 쓰는 생활 분류예요. 의학적 진단이 아니에요.',
      'This is a beauty-care grouping, not a medical diagnosis.',
      'ນີ້ແມ່ນການແບ່ງແບບຄວາມງາມ ບໍ່ແມ່ນການວິນິດໄສ.',
      'เป็นการแบ่งกลุ่มด้านความงาม ไม่ใช่การวินิจฉัยทางการแพทย์',
      'Classement de soin, pas un diagnostic médical.',
    ),
    cards: SCALP_TYPES.map((type) => ({
      id: type.id,
      icon: type.icon,
      title: type.name,
      body: type.summary,
      signs: SIGNS[type.id] ?? [],
    })),
  },
  {
    kind: 'single',
    id: 'scalpSelf',
    section: SECTION_TYPE,
    prompt: L(
      '내 두피는 어디에 가장 가까운가요?',
      'Which sounds most like your scalp?',
      'ໜັງຫົວຂອງທ່ານໃກ້ກັບແບບໃດ?',
      'หนังศีรษะของคุณใกล้แบบไหนที่สุด?',
      'Lequel ressemble le plus à votre cuir chevelu ?',
    ),
    choices: [
      ...SCALP_TYPES.map((type) => ({
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
    id: 'nextEvening',
    section: SECTION_TYPE,
    prompt: L(
      '머리를 감고 다음 날 저녁, 두피와 앞머리는 어떤가요?',
      'The evening after you wash, how are your scalp and fringe?',
      'ສະຜົມແລ້ວ ຕອນແລງມື້ຕໍ່ມາ ໜັງຫົວ ແລະ ໜ້າມ້າເປັນແນວໃດ?',
      'สระผมแล้ว เย็นวันถัดไปหนังศีรษะและหน้าม้าเป็นอย่างไร?',
      'Le soir du lendemain du lavage, comment sont cuir chevelu et frange ?',
    ),
    choices: [
      {
        id: 'greasy',
        icon: '💦',
        label: L(
          '기름지고 머리카락이 뭉쳐요',
          'Greasy, hair clumps together',
          'ມັນ ແລະ ຜົມຕິດກັນ',
          'มันและผมติดกันเป็นก้อน',
          'Gras, mèches collées',
        ),
        scores: s({ oily: 2 }),
      },
      {
        id: 'tight',
        icon: '🏜️',
        label: L(
          '보송하지만 당기거나 가려워요',
          'Not greasy, but tight or itchy',
          'ບໍ່ມັນ ແຕ່ຕຶງ ຫຼື ຄັນ',
          'ไม่มันแต่ตึงหรือคัน',
          'Pas gras, mais tiraille ou gratte',
        ),
        scores: s({ dry: 2 }),
      },
      {
        id: 'fine',
        icon: '🌸',
        label: L(
          '특별히 불편하지 않아요',
          'Nothing in particular',
          'ບໍ່ມີຫຍັງພິເສດ',
          'ไม่มีอะไรเป็นพิเศษ',
          'Rien de spécial',
        ),
        scores: s({ normal: 2 }),
      },
      NOT_SURE,
    ],
  },
  {
    kind: 'single',
    id: 'flakes',
    section: SECTION_TYPE,
    prompt: L(
      '어깨나 머리카락에 하얀 각질이 보이나요?',
      'Do you see flakes on your shoulders or in your hair?',
      'ເຫັນຂີ້ລັງແຄຢູ່ບ່າ ຫຼື ຜົມບໍ?',
      'เห็นขุยบนไหล่หรือเส้นผมไหม?',
      'Voyez-vous des pellicules sur les épaules ou les cheveux ?',
    ),
    choices: [
      {
        id: 'none',
        icon: '✨',
        label: L('거의 없어요', 'Hardly any', 'ເກືອບບໍ່ມີ', 'แทบไม่มี', 'Presque pas'),
        scores: s({ normal: 1 }),
      },
      {
        id: 'dryWhite',
        icon: '❄️',
        label: L(
          '작고 마른 하얀 가루 (몸 피부도 건조)',
          'Small, dry white flakes (body skin is dry too)',
          'ຂີ້ຂາວນ້ອຍໆແຫ້ງ (ຜິວກາຍແຫ້ງນຳ)',
          'ขุยขาวเล็กๆ แห้งๆ (ผิวกายก็แห้ง)',
          'Petites pellicules sèches (peau du corps sèche aussi)',
        ),
        scores: s({ dry: 2 }),
      },
      {
        id: 'greasyYellow',
        icon: '🟡',
        label: L(
          '기름진 노르스름한 각질 + 가려움',
          'Greasy yellowish flakes, and itching',
          'ຂີ້ເຫຼືອງມັນ + ຄັນ',
          'ขุยเหลืองมัน + คัน',
          'Pellicules grasses jaunâtres et démangeaisons',
        ),
        scores: s({ dandruff: 2, oily: 1 }),
      },
      NOT_SURE,
    ],
  },
  {
    kind: 'single',
    id: 'sting',
    section: SECTION_TYPE,
    prompt: L(
      '새 샴푸·염색약을 쓰거나 더울 때 두피가 따끔·화끈거리나요?',
      'Does your scalp sting or burn with a new shampoo, hair dye or heat?',
      'ໜັງຫົວແສບ ຫຼື ຮ້ອນ ເມື່ອໃຊ້ແຊມພູໃໝ່ ຫຼື ຢາຍ້ອມຜົມບໍ?',
      'หนังศีรษะแสบร้อนเมื่อใช้แชมพูใหม่ ยาย้อมผม หรืออากาศร้อนไหม?',
      'Le cuir chevelu picote-t-il avec un nouveau produit ou la chaleur ?',
    ),
    choices: [
      {
        id: 'often',
        icon: '🌹',
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
        scores: s({ normal: 1 }),
      },
      NOT_SURE,
    ],
  },
  {
    kind: 'single',
    id: 'itch',
    section: SECTION_TYPE,
    prompt: L(
      '두피가 얼마나 자주 가렵나요?',
      'How often does your scalp itch?',
      'ໜັງຫົວຄັນເລື້ອຍປານໃດ?',
      'หนังศีรษะคันบ่อยแค่ไหน?',
      'À quelle fréquence le cuir chevelu gratte-t-il ?',
    ),
    choices: [
      {
        id: 'daily',
        icon: '😣',
        label: L(
          '거의 매일, 긁으면 각질이 떨어져요',
          'Almost daily, and flakes fall when I scratch',
          'ເກືອບທຸກມື້ ເກົາແລ້ວມີຂີ້ຫຼົ່ນ',
          'เกือบทุกวัน เกาแล้วมีขุยร่วง',
          'Presque tous les jours, avec des pellicules',
        ),
        scores: s({ dandruff: 2 }),
      },
      {
        id: 'noFlakes',
        icon: '🤏',
        label: L(
          '자주 가렵지만 각질은 거의 없어요',
          'Often, but with hardly any flakes',
          'ຄັນເລື້ອຍ ແຕ່ບໍ່ຄ່ອຍມີຂີ້',
          'คันบ่อยแต่แทบไม่มีขุย',
          'Souvent, presque sans pellicules',
        ),
        scores: s({ sensitive: 1, dry: 1 }),
      },
      {
        id: 'rarely',
        icon: '🌸',
        label: L('거의 가렵지 않아요', 'Hardly ever', 'ເກືອບບໍ່ຄັນ', 'แทบไม่คัน', 'Presque jamais'),
        scores: s({ normal: 1 }),
      },
      NOT_SURE,
    ],
  },
  {
    kind: 'single',
    id: 'skipWash',
    section: SECTION_TYPE,
    prompt: L(
      '며칠 안 감으면 어떤가요?',
      'What happens if you skip washing for a few days?',
      'ຖ້າບໍ່ສະຈັກມື້ ເປັນແນວໃດ?',
      'ถ้าไม่สระสักสองสามวันเป็นอย่างไร?',
      'Que se passe-t-il si vous sautez quelques lavages ?',
    ),
    choices: [
      {
        id: 'greasy',
        icon: '💦',
        label: L(
          '하루만 지나도 떡지고 냄새가 신경 쓰여요',
          'Greasy and smelly after just a day',
          'ມື້ດຽວກໍມັນ ແລະ ມີກິ່ນ',
          'วันเดียวก็มันและมีกลิ่น',
          'Gras et odeur dès le lendemain',
        ),
        scores: s({ oily: 2 }),
      },
      {
        id: 'fine',
        icon: '🙂',
        label: L(
          '2–3일은 괜찮아요',
          'Fine for two or three days',
          'ບໍ່ເປັນຫຍັງ 2–3 ມື້',
          'ไม่เป็นไร 2–3 วัน',
          'Ça va deux ou trois jours',
        ),
        scores: s({ normal: 1, dry: 1 }),
      },
      {
        id: 'flakier',
        icon: '❄️',
        label: L(
          '각질과 가려움이 심해져요',
          'Flakes and itching get worse',
          'ຂີ້ລັງແຄ ແລະ ຄັນ ຫຼາຍຂຶ້ນ',
          'ขุยและอาการคันมากขึ้น',
          'Pellicules et démangeaisons augmentent',
        ),
        scores: s({ dandruff: 1 }),
      },
      NOT_SURE,
    ],
  },
  {
    kind: 'single',
    id: 'parting',
    section: SECTION_TYPE,
    prompt: L(
      '거울로(또는 가족 도움으로) 가르마 두피 색을 보면?',
      'Looking at the skin along your parting (in a mirror, or with help)?',
      'ເບິ່ງສີໜັງຫົວຢູ່ແສກຜົມ?',
      'ดูสีหนังศีรษะตรงแสกผม (ส่องกระจกหรือให้คนช่วย)?',
      'La peau le long de la raie (au miroir ou avec de l’aide) ?',
    ),
    choices: [
      {
        id: 'red',
        icon: '🔴',
        label: L('붉은 기가 있어요', 'Reddish', 'ມີສີແດງ', 'มีสีแดง', 'Rougeâtre'),
        scores: s({ sensitive: 1 }),
      },
      {
        id: 'even',
        icon: '🌸',
        label: L(
          '붉지 않고 고르게 보여요',
          'Even, not red',
          'ສະເໝີ ບໍ່ແດງ',
          'สม่ำเสมอ ไม่แดง',
          'Uniforme, pas rouge',
        ),
        scores: s({ normal: 1 }),
      },
      {
        id: 'scales',
        icon: '🟡',
        label: L(
          '노르스름한 기름진 각질이 붙어 있어요',
          'Yellowish greasy scales stuck to it',
          'ມີຂີ້ເຫຼືອງມັນຕິດ',
          'มีขุยเหลืองมันติดอยู่',
          'Squames grasses jaunâtres',
        ),
        scores: s({ dandruff: 1, oily: 1 }),
      },
      NOT_SURE,
    ],
  },
  {
    kind: 'single',
    id: 'texture',
    section: SECTION_HAIR,
    prompt: L(
      '머리카락 모양은요?',
      'What is your hair like?',
      'ຜົມຂອງທ່ານເປັນແບບໃດ?',
      'ผมของคุณเป็นแบบไหน?',
      'Vos cheveux sont…',
    ),
    choices: [
      {
        id: 'straight',
        icon: '📏',
        label: L('곧은 생머리', 'Straight', 'ຜົມກົງ', 'ผมตรง', 'Raides'),
      },
      { id: 'wavy', icon: '〰️', label: L('웨이브', 'Wavy', 'ຜົມຄື້ນ', 'ผมเป็นลอน', 'Ondulés') },
      { id: 'curly', icon: '➰', label: L('곱슬', 'Curly', 'ຜົມຫຍິກ', 'ผมหยิก', 'Bouclés') },
      {
        id: 'fine',
        icon: '🪶',
        label: L(
          '가늘고 힘이 없어요',
          'Fine and limp',
          'ເສັ້ນນ້ອຍ ບໍ່ມີນ້ຳໜັກ',
          'เส้นเล็ก ลีบแบน',
          'Fins et plats',
        ),
      },
      NOT_SURE,
    ],
  },
  {
    kind: 'multi',
    id: 'treatments',
    section: SECTION_HAIR,
    prompt: L(
      '최근 1년 안에 한 것을 모두 골라 주세요.',
      'Pick everything you have done in the past year.',
      'ເລືອກທຸກຢ່າງທີ່ເຮັດໃນ 1 ປີທີ່ຜ່ານມາ.',
      'เลือกทุกอย่างที่ทำในปีที่ผ่านมา',
      'Choisissez tout ce que vous avez fait cette année.',
    ),
    choices: [
      { id: 'color', icon: '🎨', label: L('염색', 'Colouring', 'ຍ້ອມຜົມ', 'ทำสีผม', 'Coloration') },
      {
        id: 'bleach',
        icon: '🤍',
        label: L('탈색', 'Bleaching', 'ຟອກສີຜົມ', 'ฟอกสีผม', 'Décoloration'),
      },
      { id: 'perm', icon: '➰', label: L('펌', 'Perm', 'ດັດຜົມ', 'ดัดผม', 'Permanente') },
      {
        id: 'straighten',
        icon: '📏',
        label: L(
          '매직·스트레이트 펌',
          'Chemical straightening',
          'ຢືດຜົມ',
          'ยืดผม',
          'Lissage chimique',
        ),
      },
      {
        id: 'heat',
        icon: '🔥',
        label: L(
          '고데기·드라이를 거의 매일',
          'Straightener or blow-dryer almost daily',
          'ໜີບ ຫຼື ເປົ່າຜົມເກືອບທຸກມື້',
          'หนีบหรือไดร์ผมเกือบทุกวัน',
          'Lisseur ou séchoir presque chaque jour',
        ),
      },
      {
        id: 'tight',
        icon: '🎀',
        label: L(
          '꽉 묶거나 땋아요',
          'Tight ponytails, buns or braids',
          'ມັດແໜ້ນ ຫຼື ຖັກ',
          'มัดแน่นหรือถักเปีย',
          'Queues, chignons ou tresses serrés',
        ),
      },
      NONE,
    ],
  },
  {
    kind: 'multi',
    id: 'concerns',
    section: SECTION_CONCERNS,
    prompt: L(
      '두피와 머리카락에서 신경 쓰이는 것을 모두 골라 주세요.',
      'Pick everything that bothers you about your scalp and hair.',
      'ເລືອກທຸກຢ່າງທີ່ກັງວົນກ່ຽວກັບໜັງຫົວ ແລະ ຜົມ.',
      'เลือกทุกอย่างที่กังวลเกี่ยวกับหนังศีรษะและเส้นผม',
      'Choisissez tout ce qui vous préoccupe.',
    ),
    help: L(
      '13가지 중 몇 개든, 없으면 «해당 없음».',
      'Any of the thirteen — or "none of these".',
      'ເລືອກໄດ້ຫຼາຍຂໍ້ ໃນ 13 ຂໍ້.',
      'เลือกได้หลายข้อจาก 13 ข้อ หรือ «ไม่มีข้อใดตรง»',
      'Parmi les treize — ou « aucun ».',
    ),
    groups: [
      {
        id: 'scalp',
        photo: '/products/sku/KG-HAR-00016.jpg',
        label: L('두피', 'Scalp', 'ໜັງຫົວ', 'หนังศีรษะ', 'Cuir chevelu'),
        ids: ['dandruff', 'itchy', 'oilyScalp', 'scalpRed', 'scalpSun'],
      },
      {
        id: 'loss',
        photo: '/products/sku/KG-HAR-00009.jpg',
        label: L(
          '빠짐·볼륨·새치',
          'Shedding, volume, greys',
          'ຜົມຫຼົ່ນ ແລະ ຜົມຫງອກ',
          'ผมร่วง วอลลุ่ม ผมหงอก',
          'Chute, volume, cheveux blancs',
        ),
        ids: ['shedding', 'thinning', 'gray'],
      },
      {
        id: 'lengths',
        photo: '/products/sku/KG-HAR-00017.jpg',
        label: L(
          '머리카락 길이·끝',
          'Lengths & ends',
          'ຄວາມຍາວ ແລະ ປາຍຜົມ',
          'ความยาวและปลายผม',
          'Longueurs & pointes',
        ),
        ids: ['damaged', 'splitEnds', 'dryDull', 'frizz', 'static'],
      },
    ],
    choices: [
      ...SCALP_CONCERNS.map((concern) => ({
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
    id: 'washFreq',
    section: SECTION_HABITS,
    prompt: L(
      '머리는 얼마나 자주 감나요?',
      'How often do you wash your hair?',
      'ສະຜົມເລື້ອຍປານໃດ?',
      'สระผมบ่อยแค่ไหน?',
      'À quelle fréquence lavez-vous vos cheveux ?',
    ),
    choices: [
      { id: 'daily', icon: '🚿', label: L('매일', 'Every day', 'ທຸກມື້', 'ทุกวัน', 'Chaque jour') },
      {
        id: 'everyOther',
        icon: '📆',
        label: L(
          '이틀에 한 번',
          'Every other day',
          'ສອງມື້ເທື່ອ',
          'วันเว้นวัน',
          'Un jour sur deux',
        ),
      },
      {
        id: 'weekly',
        icon: '🗓️',
        label: L(
          '일주일에 2–3번 이하',
          'Two or three times a week, or less',
          'ອາທິດລະ 2–3 ເທື່ອ ຫຼື ໜ້ອຍກວ່າ',
          'สัปดาห์ละ 2–3 ครั้งหรือน้อยกว่า',
          'Deux ou trois fois par semaine ou moins',
        ),
      },
      NOT_SURE,
    ],
  },
  {
    kind: 'multi',
    id: 'habits',
    section: SECTION_HABITS,
    prompt: L(
      '해당하는 생활을 골라 주세요.',
      'Which of these fit your life?',
      'ອັນໃດກົງກັບຊີວິດຂອງທ່ານ?',
      'ข้อใดตรงกับชีวิตของคุณ?',
      'Lesquels vous correspondent ?',
    ),
    choices: [
      {
        id: 'helmet',
        icon: '🛵',
        label: L(
          '오토바이 헬멧을 자주 써요',
          'I often wear a motorbike helmet',
          'ໃສ່ໝວກກັນກະທົບເລື້ອຍໆ',
          'ใส่หมวกกันน็อกบ่อย',
          'Je porte souvent un casque',
        ),
      },
      {
        id: 'sun',
        icon: '☀️',
        label: L(
          '햇볕 아래 오래 있어요',
          'Long hours in the sun',
          'ຢູ່ກາງແດດດົນ',
          'อยู่กลางแดดนาน',
          'Longtemps au soleil',
        ),
      },
      {
        id: 'sleepWet',
        icon: '🛏️',
        label: L(
          '젖은 머리로 자요',
          'I sleep with wet hair',
          'ນອນທັງຜົມປຽກ',
          'นอนทั้งผมเปียก',
          'Je dors les cheveux mouillés',
        ),
      },
      {
        id: 'towelRub',
        icon: '🧺',
        label: L(
          '수건으로 세게 비벼 말려요',
          'I rub my hair dry with a towel',
          'ເຊັດຜົມແຮງດ້ວຍຜ້າເຊັດໂຕ',
          'เช็ดผมแรงๆ ด้วยผ้าขนหนู',
          'Je frotte fort avec la serviette',
        ),
      },
      {
        id: 'stress',
        icon: '😣',
        label: L(
          '최근 큰 스트레스·출산·체중 변화가 있었어요',
          'Recent major stress, childbirth or weight change',
          'ມີຄວາມຄຽດຫຼາຍ, ເກີດລູກ ຫຼື ນ້ຳໜັກປ່ຽນ',
          'เพิ่งมีความเครียดมาก คลอดบุตร หรือน้ำหนักเปลี่ยน',
          'Stress important, accouchement ou changement de poids récent',
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
        id: 'cleanScalp',
        icon: '🌿',
        label: L(
          '깨끗하고 편한 두피',
          'A clean, comfortable scalp',
          'ໜັງຫົວສະອາດ ສະບາຍ',
          'หนังศีรษะสะอาด สบาย',
          'Un cuir chevelu net et confortable',
        ),
      },
      {
        id: 'lessFlakes',
        icon: '❄️',
        label: L(
          '비듬·가려움 줄이기',
          'Fewer flakes and less itch',
          'ລົດລັງແຄ ແລະ ຄັນ',
          'ลดรังแคและอาการคัน',
          'Moins de pellicules et de démangeaisons',
        ),
      },
      {
        id: 'volume',
        icon: '🎈',
        label: L(
          '볼륨·풍성함',
          'Volume and fullness',
          'ຜົມໜາ ມີວອລຸ່ມ',
          'ผมมีวอลลุ่ม',
          'Du volume',
        ),
      },
      {
        id: 'shine',
        icon: '✨',
        label: L(
          '윤기·부드러움',
          'Shine and softness',
          'ເງົາ ແລະ ນຸ່ມ',
          'เงางามและนุ่ม',
          'Brillance et douceur',
        ),
      },
      {
        id: 'repair',
        icon: '🧵',
        label: L(
          '손상 덜 보이게',
          'Less visible damage',
          'ຜົມເສຍໜ້ອຍລົງ',
          'ผมเสียดูน้อยลง',
          'Moins de signes d’abîmement',
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

const N = {
  shampoo: L(
    '두피에 거품을 내 1–2분 마사지하듯 씻고 충분히 헹궈요.',
    'Lather on the scalp, massage for a minute or two, rinse well.',
    'ຟອກທີ່ໜັງຫົວ ນວດ 1–2 ນາທີ ແລ້ວລ້າງໃຫ້ສະອາດ.',
    'ตีฟองที่หนังศีรษะ นวด 1–2 นาที แล้วล้างให้สะอาด',
    'Faire mousser au cuir chevelu, masser une à deux minutes, bien rincer.',
  ),
  dandruffShampoo: L(
    '비듬 샴푸를 두피에 바르고 라벨의 시간만큼 두었다 헹궈요.',
    'Anti-dandruff shampoo on the scalp, left for the time on the label, then rinsed.',
    'ແຊມພູກັນລັງແຄ ປະໄວ້ຕາມສະຫຼາກ ແລ້ວລ້າງ.',
    'แชมพูขจัดรังแค ทิ้งไว้ตามเวลาบนฉลากแล้วล้าง',
    'Antipelliculaire sur le cuir chevelu, temps de pose indiqué, rincer.',
  ),
  gentleShampoo: L(
    '무향·저자극 샴푸, 미지근한 물.',
    'A fragrance-free, gentle shampoo in lukewarm water.',
    'ແຊມພູບໍ່ມີນ້ຳຫອມ ອ່ອນໂຍນ, ນ້ຳອຸ່ນ.',
    'แชมพูไร้น้ำหอม อ่อนโยน น้ำอุ่น',
    'Shampoing doux sans parfum, eau tiède.',
  ),
  conditionerEnds: L(
    '컨디셔너는 귀 아래 길이와 끝에만, 1–3분 뒤 헹궈요.',
    'Conditioner from the ears down to the ends only; rinse after one to three minutes.',
    'ຄອນດິຊັນເນີ ຈາກຫູລົງຫາປາຍ; ລ້າງຫຼັງ 1–3 ນາທີ.',
    'ครีมนวดตั้งแต่ใต้หูถึงปลาย ล้างหลัง 1–3 นาที',
    'Après-shampoing des oreilles aux pointes ; rincer après 1 à 3 minutes.',
  ),
  conditionerAll: L(
    '건조하거나 곱슬한 머리는 길이 전체에 넉넉히.',
    'Dry or curly hair: generously along the whole length.',
    'ຜົມແຫ້ງ ຫຼື ຫຍິກ: ທາທົ່ວຄວາມຍາວ.',
    'ผมแห้งหรือหยิก ใช้ทั่วความยาวผม',
    'Cheveux secs ou bouclés : sur toute la longueur.',
  ),
  towel: L(
    '수건으로 감싸 꾹꾹 눌러 물기를 빼요. 비비지 않기.',
    'Wrap in a towel and press the water out — no rubbing.',
    'ຫໍ່ຜ້າເຊັດໂຕ ແລ້ວກົດ — ບໍ່ຖູ.',
    'ห่อผ้าขนหนูแล้วกดซับ ไม่ขยี้',
    'Envelopper et presser — sans frotter.',
  ),
  dryScalp: L(
    '두피부터 완전히 말려요. 드라이어는 15cm 떨어뜨려 계속 움직이며.',
    'Dry the scalp completely first, dryer about 15 cm away and always moving.',
    'ເປົ່າໜັງຫົວໃຫ້ແຫ້ງກ່ອນ ຫ່າງ 15 ຊມ ແລະ ເຄື່ອນໄຫວຕະຫຼອດ.',
    'เป่าหนังศีรษะให้แห้งก่อน ห่างราว 15 ซม. และขยับตลอด',
    'Sécher d’abord le cuir chevelu, séchoir à 15 cm, toujours en mouvement.',
  ),
  heat: L(
    '고데기·드라이 전 열 보호제, 가장 낮은 온도로 짧게.',
    'Heat protectant before tools; lowest setting, as briefly as possible.',
    'ກັນຄວາມຮ້ອນກ່ອນ; ອຸນຫະພູມຕ່ຳ ສັ້ນໆ.',
    'ใช้กันความร้อนก่อน อุณหภูมิต่ำสุด และใช้เวลาสั้นๆ',
    'Protecteur thermique, température minimale, le moins longtemps possible.',
  ),
  oilEnds: L(
    '마른 끝에 오일·에센스 1–2방울.',
    'One or two drops of oil or serum on dry ends.',
    'ນ້ຳມັນ 1–2 ຢົດທີ່ປາຍຜົມແຫ້ງ.',
    'ออยล์หรือเซรั่ม 1–2 หยดที่ปลายผมแห้ง',
    'Une ou deux gouttes d’huile sur les pointes sèches.',
  ),
  scaler: L(
    '두피 스케일러는 처음엔 드물게(라벨대로). 따갑거나 상처가 있으면 쉬어요.',
    'Scalp scaler sparingly at first, as labelled; skip it if the scalp stings or has sores.',
    'ສະເກວເລີ ໃຊ້ໜ້ອຍໆຕາມສະຫຼາກ; ຖ້າແສບ ໃຫ້ຢຸດ.',
    'สเกลเลอร์ใช้นานๆ ครั้งตามฉลาก ถ้าแสบหรือมีแผลให้งด',
    'Gommage du cuir chevelu, rarement au début ; jamais sur peau irritée.',
  ),
  mask: L(
    '트리트먼트·헤어 마스크 — 라벨의 시간과 횟수대로.',
    'Treatment or hair mask — follow the label for time and how often.',
    'ທຣີດເມັ້ນ ຫຼື ມາສຜົມ — ຕາມສະຫຼາກ.',
    'ทรีตเมนต์หรือมาสก์ผม ทำตามฉลาก',
    'Soin ou masque — selon l’étiquette.',
  ),
  scalpSerum: L(
    '진정 두피 토닉·세럼을 가르마를 나눠 두피에 직접.',
    'A soothing scalp tonic or serum, parted and applied straight to the scalp.',
    'ໂທນິກຜ່ອນຄາຍ ທາໃສ່ໜັງຫົວໂດຍກົງ.',
    'โทนิกหรือเซรั่มปลอบประโลม แบ่งแสกแล้วทาที่หนังศีรษะ',
    'Lotion apaisante, raie par raie, directement sur le cuir chevelu.',
  ),
};

const WASH_ADVICE: Record<string, ReturnType<typeof L>> = {
  oily: L(
    '지성: 하루 한 번까지 감아도 괜찮아요.',
    'Oily: washing up to once a day is fine.',
    'ມັນ: ສະໄດ້ມື້ລະເທື່ອ.',
    'มัน: สระได้วันละครั้ง',
    'Gras : jusqu’à une fois par jour.',
  ),
  dry: L(
    '건성: 기름이 신경 쓰일 때만 — 매일일 필요는 없어요.',
    'Dry: only when oil bothers you — not necessarily daily.',
    'ແຫ້ງ: ສະເມື່ອມັນເທົ່ານັ້ນ.',
    'แห้ง: สระเมื่อรู้สึกมันเท่านั้น ไม่จำเป็นต้องทุกวัน',
    'Sec : seulement quand ça graisse.',
  ),
  dandruff: L(
    '비듬성: 비듬 샴푸를 라벨대로, 좋아지면 횟수를 줄여요.',
    'Dandruff-prone: anti-dandruff shampoo as labelled, less often once it improves.',
    'ລັງແຄ: ໃຊ້ຕາມສະຫຼາກ ແລ້ວຫຼຸດລົງ.',
    'รังแค: ใช้แชมพูขจัดรังแคตามฉลาก ดีขึ้นแล้วลดความถี่',
    'Pellicules : selon l’étiquette, puis espacer.',
  ),
  normal: L(
    '중성: 기름이 신경 쓰일 때, 땀 흘린 날은 그날.',
    'Balanced: when oil bothers you, and on sweaty days.',
    'ປົກກະຕິ: ເມື່ອມັນ ແລະ ມື້ເຫື່ອອອກ.',
    'ปกติ: สระเมื่อรู้สึกมันและวันที่เหงื่อออก',
    'Équilibré : quand ça graisse, et les jours de sueur.',
  ),
};

export function scalpPlan(answers: QuestAnswers, reading: TypeReading): CarePlan {
  const concerns = answers.concerns ?? [];
  const pick = (ids: readonly string[]) => ids.some((id) => concerns.includes(id));
  const sensitive = reading.modifier || pick(['scalpRed']);
  const dandruff = reading.typeId === 'dandruff' || pick(['dandruff']);
  const lengths = pick(['damaged', 'splitEnds', 'dryDull', 'frizz', 'static']);
  const curly = has(answers, 'texture', 'curly') || has(answers, 'texture', 'wavy');
  const heat = has(answers, 'treatments', 'heat') || has(answers, 'treatments', 'straighten');
  const chemical = ['color', 'bleach', 'perm', 'straighten'].some((id) =>
    has(answers, 'treatments', id),
  );
  const simple = has(answers, 'goals', 'simple');
  const flags = (answers.redFlags ?? []).filter((id) => id !== 'none');

  const wash: RoutineLine[] = [
    dandruff
      ? { kind: 'dandruffShampoo', note: N.dandruffShampoo }
      : { kind: 'shampoo', note: sensitive ? N.gentleShampoo : N.shampoo },
    { kind: 'conditioner', note: curly || lengths ? N.conditionerAll : N.conditionerEnds },
  ];
  const after: RoutineLine[] = [
    { kind: 'conditioner', note: N.towel },
    ...(sensitive && !simple ? [{ kind: 'scalpCare', note: N.scalpSerum }] : []),
    { kind: 'hairOil', note: heat ? N.heat : N.dryScalp },
    ...(lengths || chemical ? [{ kind: 'hairOil', note: N.oilEnds }] : []),
  ];
  const weekly: RoutineLine[] = simple
    ? []
    : [
        ...(lengths || chemical ? [{ kind: 'hairMask', note: N.mask }] : []),
        ...((reading.typeId === 'oily' || dandruff) && !sensitive
          ? [{ kind: 'scalpCare', note: N.scaler }]
          : []),
      ];

  const tips: ReturnType<typeof L>[] = [];
  if (reading.typeId && WASH_ADVICE[reading.typeId]) tips.push(WASH_ADVICE[reading.typeId]!);
  if (has(answers, 'habits', 'helmet'))
    tips.push(
      L(
        '헬멧 안은 덥고 습해요. 두피를 완전히 말린 뒤 쓰고, 땀 흘린 날은 그날 감아요.',
        'Inside a helmet is hot and damp: dry your scalp fully before wearing it, and wash on sweaty days.',
        'ໃນໝວກກັນກະທົບຮ້ອນ ແລະ ຊື້ນ: ເປົ່າໜັງຫົວໃຫ້ແຫ້ງກ່ອນ.',
        'ในหมวกกันน็อกร้อนและอับชื้น เป่าหนังศีรษะให้แห้งก่อนใส่ และสระผมวันที่เหงื่อออก',
        'Sous le casque il fait chaud et humide : sécher avant, laver les jours de sueur.',
      ),
    );
  if (has(answers, 'habits', 'sleepWet'))
    tips.push(
      L(
        '젖은 머리로 자면 두피가 눅눅하고 머리카락이 잘 끊어져요. 두피만이라도 말리고 자요.',
        'Sleeping with wet hair keeps the scalp damp and hair breaks more easily — at least dry the scalp.',
        'ນອນທັງຜົມປຽກ ໜັງຫົວຊື້ນ ແລະ ຜົມຂາດງ່າຍ.',
        'นอนทั้งผมเปียกทำให้หนังศีรษะอับชื้นและผมขาดง่าย อย่างน้อยเป่าหนังศีรษะให้แห้ง',
        'Dormir cheveux mouillés : au moins sécher le cuir chevelu.',
      ),
    );
  if (has(answers, 'habits', 'towelRub'))
    tips.push(
      L(
        '수건으로 비비면 젖은 머리카락이 끊어져요. 감싸서 눌러 주세요.',
        'Rubbing breaks wet hair — wrap and press instead.',
        'ຖູຜົມປຽກເຮັດໃຫ້ຂາດ — ຫໍ່ ແລະ ກົດ.',
        'การขยี้ทำให้ผมเปียกขาด ห่อแล้วกดซับแทน',
        'Frotter casse les cheveux mouillés.',
      ),
    );
  if (has(answers, 'treatments', 'tight'))
    tips.push(
      L(
        '꽉 묶는 머리는 견인성 탈모를 일으킬 수 있어요. 느슨하게, 감싼 고무줄로.',
        'Tight styles can cause traction hair loss — keep them loose, with covered elastics.',
        'ມັດແໜ້ນອາດເຮັດໃຫ້ຜົມຫຼົ່ນ — ມັດຫຼວມໆ.',
        'การมัดแน่นอาจทำให้ผมร่วงจากการดึงรั้ง มัดหลวมๆ ด้วยยางรัดที่หุ้มผ้า',
        'Les coiffures serrées peuvent faire tomber les cheveux.',
      ),
    );
  if (has(answers, 'habits', 'stress'))
    tips.push(
      L(
        '큰 스트레스·출산·체중 변화 2–3개월 뒤 머리카락이 많이 빠질 수 있어요. 대개 몇 달 안에 돌아오지만, 6개월이 넘으면 진료를.',
        'Two or three months after major stress, childbirth or weight change, hair can shed heavily; it usually settles within months — see a doctor if it lasts past six.',
        'ຫຼັງຄວາມຄຽດ ຫຼື ເກີດລູກ 2–3 ເດືອນ ຜົມອາດຫຼົ່ນຫຼາຍ; ເກີນ 6 ເດືອນ ໃຫ້ພົບແພດ.',
        'หลังความเครียด คลอดบุตร หรือน้ำหนักเปลี่ยน 2–3 เดือน ผมอาจร่วงมาก มักดีขึ้นในไม่กี่เดือน ถ้าเกิน 6 เดือนให้พบแพทย์',
        'Après un stress ou un accouchement, la chute se calme en quelques mois ; au-delà de six, consultez.',
      ),
    );
  if (has(answers, 'habits', 'sun') || pick(['scalpSun']))
    tips.push(
      L(
        '모자로 가르마를 가려요. 가르마를 가끔 바꾸면 한곳만 타지 않아요.',
        'Cover the parting with a hat; changing it now and then spreads the sun.',
        'ໃສ່ໝວກປິດແສກຜົມ; ປ່ຽນແສກບາງຄັ້ງ.',
        'ใส่หมวกปิดแสกผม และเปลี่ยนแสกบ้าง',
        'Chapeau sur la raie ; la changer de temps en temps.',
      ),
    );

  const advice: AdviceBlock[] = [];
  if (tips.length > 0) {
    advice.push({
      id: 'hair-habits',
      icon: '🗓️',
      title: L(
        '나에게 맞는 감기·습관',
        'Washing and habits for you',
        'ການສະຜົມ ແລະ ນິໄສສຳລັບທ່ານ',
        'การสระผมและนิสัยที่เหมาะกับคุณ',
        'Lavage et habitudes pour vous',
      ),
      points: tips,
    });
  }
  advice.push({
    id: 'dye-test',
    icon: '🩹',
    title: L(
      '염색 전 48시간 패치 테스트',
      'A 48-hour patch test before any dye',
      'ທົດສອບ 48 ຊົ່ວໂມງ ກ່ອນຍ້ອມຜົມ',
      'ทดสอบ 48 ชั่วโมงก่อนย้อมผม',
      'Test de 48 h avant toute coloration',
    ),
    points: [
      L(
        '염색약을 귀 뒤에 조금 바르고 48시간 동안 지켜봐요. 붉어지거나 가렵거나 부으면 그 염색약은 쓰지 않아요.',
        'Dab the dye behind the ear and watch for 48 hours. Redness, itching or swelling means do not use that dye.',
        'ທາຢາຍ້ອມໜ້ອຍໜຶ່ງຫຼັງຫູ ເບິ່ງ 48 ຊົ່ວໂມງ. ຖ້າແດງ ຄັນ ບວມ ຢ່າໃຊ້.',
        'แต้มยาย้อมผมหลังหูแล้วสังเกต 48 ชั่วโมง ถ้าแดง คัน หรือบวม อย่าใช้',
        'Une touche derrière l’oreille, 48 h d’observation. Rougeur, démangeaison ou gonflement : n’utilisez pas.',
      ),
      L(
        '예전에 괜찮던 염색약도 매번 테스트해요. 알레르기는 나중에 생길 수 있어요.',
        'Test every time, even a dye you have used before — allergies can develop later.',
        'ທົດສອບທຸກເທື່ອ ແມ່ນແຕ່ຢາທີ່ເຄີຍໃຊ້.',
        'ทดสอบทุกครั้ง แม้ยาที่เคยใช้ เพราะแพ้ภายหลังได้',
        'Testez à chaque fois : une allergie peut apparaître plus tard.',
      ),
      L(
        '얼굴·두피가 크게 붓거나 숨쉬기 힘들면 바로 응급실로.',
        'If the face or scalp swells badly or breathing is hard, go to emergency at once.',
        'ຖ້າໜ້າບວມຫຼາຍ ຫຼື ຫາຍໃຈຍາກ ໄປໂຮງໝໍທັນທີ.',
        'ถ้าหน้าหรือหนังศีรษะบวมมาก หรือหายใจลำบาก ไปห้องฉุกเฉินทันที',
        'Gonflement important ou gêne respiratoire : urgences immédiatement.',
      ),
    ],
  });

  return {
    alert:
      flags.length > 0
        ? L(
            '안전 질문에 해당하는 것이 있어요. 화장품보다 의사·피부과 진료가 먼저예요. 아래 결과는 참고로만 보세요.',
            'You ticked a safety item: see a doctor or dermatologist before relying on products. The result below is for reference only.',
            'ທ່ານເລືອກຂໍ້ຄວາມປອດໄພ: ໃຫ້ພົບທ່ານໝໍກ່ອນ. ຜົນຂ້າງລຸ່ມເພື່ອອ້າງອີງເທົ່ານັ້ນ.',
            'คุณเลือกข้อด้านความปลอดภัย ควรพบแพทย์หรือแพทย์ผิวหนังก่อนใช้ผลิตภัณฑ์ ผลด้านล่างใช้อ้างอิงเท่านั้น',
            'Vous avez coché un point de sécurité : consultez d’abord un médecin. Le résultat ci-dessous est indicatif.',
          )
        : null,
    routines: [
      {
        id: 'wash',
        icon: '🚿',
        title: L('감을 때', 'When you wash', 'ເວລາສະຜົມ', 'ตอนสระผม', 'Au lavage'),
        lines: wash,
      },
      {
        id: 'after',
        icon: '💨',
        title: L(
          '말리고 손질할 때',
          'Drying and styling',
          'ເວລາເປົ່າ ແລະ ແຕ່ງຜົມ',
          'ตอนเป่าและจัดแต่งทรง',
          'Séchage et coiffage',
        ),
        lines: after,
      },
    ],
    weekly,
    advice,
    avoid: [],
    avoidReason: null,
  };
}

export const SCALP_SOURCES: readonly Source[] = [
  {
    name: 'AAD — how to treat dandruff',
    url: 'https://www.aad.org/public/everyday-care/hair-scalp-care/scalp/treat-dandruff',
  },
  {
    name: 'AAD — relieve an itchy scalp',
    url: 'https://www.aad.org/public/everyday-care/itchy-skin/itch-relief/relieve-scalp-itch',
  },
  {
    name: 'AAD — healthy hair tips',
    url: 'https://www.aad.org/public/everyday-care/hair-scalp-care/hair/healthy-hair-tips',
  },
  {
    name: 'AAD — hair shedding',
    url: 'https://www.aad.org/public/diseases/hair-loss/insider/shedding',
  },
  {
    name: 'AAD — female pattern hair loss',
    url: 'https://www.aad.org/public/diseases/hair-loss/types/female-pattern',
  },
  {
    name: 'AAD — colouring and perming tips',
    url: 'https://www.aad.org/public/everyday-care/hair-scalp-care/hair/coloring-perming-tips',
  },
  {
    name: 'AAD — stop damaging your hair',
    url: 'https://www.aad.org/public/diseases/hair-loss/insider/stop-damage',
  },
  { name: 'NHS — hair loss', url: 'https://www.nhs.uk/symptoms/hair-loss/' },
  { name: 'NHS — dandruff', url: 'https://www.nhs.uk/conditions/dandruff/' },
  {
    name: 'Mayo Clinic — dandruff',
    url: 'https://www.mayoclinic.org/diseases-conditions/dandruff/symptoms-causes/syc-20353850',
  },
  {
    name: 'Cleveland Clinic — dry scalp',
    url: 'https://my.clevelandclinic.org/health/symptoms/23326-dry-scalp',
  },
];

export const SCALP_TRACK: CareTrack = {
  id: 'scalp',
  icon: '💇‍♀️',
  cover: '/products/sku/KG-HAR-00001.jpg',
  title: L(
    '두피·헤어',
    'Scalp & hair',
    'ໜັງຫົວ ແລະ ຜົມ',
    'หนังศีรษะและเส้นผม',
    'Cuir chevelu & cheveux',
  ),
  intro: L(
    '안전 확인 → 두피 타입 → 머리카락 → 고민 13가지 → 습관. 감는 법부터 말리는 법까지 나와요.',
    'Safety check → scalp type → hair → thirteen concerns → habits. From how to wash to how to dry.',
    'ກວດຄວາມປອດໄພ → ປະເພດໜັງຫົວ → ຜົມ → ບັນຫາ 13 → ນິໄສ.',
    'ตรวจความปลอดภัย → ประเภทหนังศีรษะ → เส้นผม → ปัญหา 13 ข้อ → นิสัย ตั้งแต่วิธีสระจนถึงวิธีเป่า',
    'Sécurité → type de cuir chevelu → cheveux → treize préoccupations → habitudes.',
  ),
  steps: SCALP_STEPS,
  types: SCALP_TYPES,
  baseTypeIds: ['oily', 'dry', 'dandruff', 'normal'],
  modifierTypeId: 'sensitive',
  concernStepId: 'concerns',
  selfStepId: 'scalpSelf',
  concerns: SCALP_CONCERNS,
  plan: scalpPlan,
  sources: SCALP_SOURCES,
};
