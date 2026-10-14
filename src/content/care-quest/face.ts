/**
 * Face track (the neck and upper chest included — their skin is thin, always in the sun and
 * cared for with the face's products). Order, as the owner set it: age band → the five skin
 * types explained → which is yours, plus seven helper questions → up to twenty concerns →
 * tendencies, family and habits → goals → result.
 */
import { COMMON_SOURCES, L, NONE, NOT_SURE, PATCH_TEST, QUEST_TEXT, SUN_HABIT } from './common';
import { FACE_CONCERN_GROUPS, FACE_CONCERNS, FACE_SOURCES } from './face-concerns';
import {
  BASE_TYPE_IDS,
  SENSITIVE_ID,
  SKIN_TYPES,
  TYPE_CARDS,
  TYPE_STEPS,
  TYPE_LEARN_SECTION,
} from './face-types';
import type {
  AdviceBlock,
  CarePlan,
  CareTrack,
  Localized,
  QuestAnswers,
  QuestStep,
  RoutineLine,
  TypeReading,
} from './types';

const SECTION_AGE = L(
  '1단계 · 나이대',
  'Step 1 · Age',
  'ຂັ້ນ 1 · ອາຍຸ',
  'ขั้นที่ 1 · ช่วงวัย',
  'Étape 1 · Âge',
);
const SECTION_CONCERNS = L(
  '3단계 · 피부 고민',
  'Step 3 · Concerns',
  'ຂັ້ນ 3 · ບັນຫາຜິວ',
  'ขั้นที่ 3 · ปัญหาผิว',
  'Étape 3 · Préoccupations',
);
const SECTION_HISTORY = L(
  '4단계 · 경향·가족·습관',
  'Step 4 · History & habits',
  'ຂັ້ນ 4 · ປະຫວັດ ແລະ ນິໄສ',
  'ขั้นที่ 4 · ประวัติและนิสัย',
  'Étape 4 · Antécédents & habitudes',
);
const SECTION_GOALS = L(
  '5단계 · 원하는 것',
  'Step 5 · Goals',
  'ຂັ້ນ 5 · ເປົ້າໝາຍ',
  'ขั้นที่ 5 · เป้าหมาย',
  'Étape 5 · Objectifs',
);

export const AGE_BANDS = [
  {
    id: 'teens',
    icon: '🎒',
    label: L('10대', 'Teens', 'ໄວລຸ້ນ (10–19)', 'วัยรุ่น (10–19)', 'Ados'),
  },
  { id: '20s', icon: '🌱', label: L('20대', '20s', '20–29 ປີ', '20–29 ปี', '20–29 ans') },
  { id: '30s', icon: '🌿', label: L('30대', '30s', '30–39 ປີ', '30–39 ปี', '30–39 ans') },
  { id: '40s', icon: '🌳', label: L('40대', '40s', '40–49 ປີ', '40–49 ปี', '40–49 ans') },
  { id: '50s', icon: '🍂', label: L('50대', '50s', '50–59 ປີ', '50–59 ปี', '50–59 ans') },
  {
    id: '60plus',
    icon: '🌺',
    label: L('60대 이상', '60 and over', '60 ປີຂຶ້ນໄປ', '60 ปีขึ้นไป', '60 ans et plus'),
  },
] as const;

const yesNo = (often: Localized, some: Localized, no: Localized) => [
  { id: 'lots', icon: '✔️', label: often },
  { id: 'some', icon: '➖', label: some },
  { id: 'no', icon: '✖️', label: no },
  NOT_SURE,
];

export const FACE_STEPS: readonly QuestStep[] = [
  {
    kind: 'single',
    id: 'age',
    section: SECTION_AGE,
    prompt: L(
      '나이대가 어떻게 되세요?',
      'Which age group are you in?',
      'ທ່ານຢູ່ໃນຊ່ວງອາຍຸໃດ?',
      'คุณอยู่ในช่วงวัยไหน?',
      'Quelle est votre tranche d’âge ?',
    ),
    help: L(
      '나이대마다 피부가 바뀌는 방식과 루틴이 달라요.',
      'Skin changes, and the routine with it, differ by age.',
      'ຜິວປ່ຽນແປງ ແລະ ກິດຈະວັດ ແຕກຕ່າງກັນຕາມອາຍຸ.',
      'ผิวและรูทีนเปลี่ยนไปตามช่วงวัย',
      'La peau et la routine changent avec l’âge.',
    ),
    choices: [
      ...AGE_BANDS,
      {
        ...NOT_SURE,
        label: L(
          '말하지 않을래요',
          "I'd rather not say",
          'ບໍ່ຢາກບອກ',
          'ไม่ขอบอก',
          'Je préfère ne pas dire',
        ),
      },
    ],
  },
  {
    kind: 'learn',
    id: 'learnTypes',
    section: TYPE_LEARN_SECTION,
    prompt: L(
      '피부 타입은 다섯 가지예요. 하나씩 들어 보세요.',
      'There are five skin types. Have a listen to each.',
      'ປະເພດຜິວມີ 5 ແບບ. ຟັງເທື່ອລະແບບ.',
      'ประเภทผิวมี 5 แบบ ลองฟังทีละแบบ',
      'Il existe cinq types de peau. Écoutez-les un par un.',
    ),
    help: L(
      '민감성은 다른 타입과 함께 있을 수 있어요 — 예: «복합성 + 민감 경향».',
      'Sensitive can come with another type — for example "combination, with a sensitive tendency".',
      'ຜິວແພ້ງ່າຍ ອາດມີຮ່ວມກັບແບບອື່ນ — ເຊັ່ນ «ຜິວປະສົມ + ແພ້ງ່າຍ».',
      'ผิวแพ้ง่ายอาจมีร่วมกับประเภทอื่น เช่น «ผิวผสม + แพ้ง่าย»',
      'La sensibilité peut s’ajouter à un autre type — par exemple « mixte, tendance sensible ».',
    ),
    cards: TYPE_CARDS,
  },
  ...TYPE_STEPS,
  {
    kind: 'multi',
    id: 'concerns',
    section: SECTION_CONCERNS,
    prompt: L(
      '지금 얼굴과 목에서 신경 쓰이는 것을 모두 골라 주세요.',
      'Pick everything that bothers you on your face and neck right now.',
      'ເລືອກທຸກຢ່າງທີ່ກັງວົນຢູ່ໃບໜ້າ ແລະ ຄໍ ຕອນນີ້.',
      'เลือกทุกอย่างที่กังวลบนใบหน้าและลำคอตอนนี้',
      'Choisissez tout ce qui vous préoccupe sur le visage et le cou.',
    ),
    help: L(
      '20가지 중 몇 개든 괜찮아요. 없으면 «해당 없음».',
      'Any number of the twenty is fine — or "none of these".',
      'ເລືອກຈັກຂໍ້ກໍໄດ້ ໃນ 20 ຂໍ້ — ຫຼື «ບໍ່ມີຂໍ້ໃດກົງ».',
      'เลือกกี่ข้อก็ได้จาก 20 ข้อ หรือ «ไม่มีข้อใดตรง»',
      'Autant que vous voulez parmi les vingt — ou « aucun ».',
    ),
    groups: FACE_CONCERN_GROUPS,
    choices: [
      ...FACE_CONCERNS.map((concern) => ({
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
    id: 'teenAcne',
    section: SECTION_HISTORY,
    prompt: L(
      '10대 때 여드름이 많았나요?',
      'Did you have a lot of acne as a teenager?',
      'ຕອນໄວລຸ້ນ ມີສິວຫຼາຍບໍ?',
      'ตอนวัยรุ่นเป็นสิวเยอะไหม?',
      'Aviez-vous beaucoup d’acné à l’adolescence ?',
    ),
    choices: yesNo(
      L('많았어요', 'A lot', 'ຫຼາຍ', 'เยอะ', 'Beaucoup'),
      L('조금 있었어요', 'A little', 'ໜ້ອຍໜຶ່ງ', 'นิดหน่อย', 'Un peu'),
      L('거의 없었어요', 'Hardly any', 'ເກືອບບໍ່ມີ', 'แทบไม่มี', 'Presque pas'),
    ),
  },
  {
    kind: 'multi',
    id: 'family',
    section: SECTION_HISTORY,
    prompt: L(
      '부모님·형제자매에게 흔한 것이 있나요?',
      'Is any of this common in your parents or siblings?',
      'ພໍ່ແມ່ ຫຼື ອ້າຍເອື້ອຍນ້ອງ ມັກເປັນອັນໃດບໍ?',
      'พ่อแม่หรือพี่น้องมักเป็นสิ่งเหล่านี้ไหม?',
      'Vos parents ou frères et sœurs ont-ils souvent… ?',
    ),
    help: L(
      '피부 경향은 가족을 닮는 경우가 많아요.',
      'Skin tendencies often run in families.',
      'ລັກສະນະຜິວມັກຄືກັບຄອບຄົວ.',
      'ลักษณะผิวมักคล้ายคนในครอบครัว',
      'Les tendances de peau sont souvent familiales.',
    ),
    choices: [
      { id: 'melasma', icon: '🌫️', label: L('기미', 'Melasma', 'ຝ້າ', 'ฝ้า', 'Mélasma') },
      {
        id: 'earlyLines',
        icon: '〰️',
        label: L(
          '이른 주름·처짐',
          'Early wrinkles or sagging',
          'ຮອຍຫ່ຽວໄວ',
          'ริ้วรอยก่อนวัย',
          'Rides précoces',
        ),
      },
      {
        id: 'atopy',
        icon: '🌹',
        label: L(
          '아토피·민감한 피부',
          'Eczema or sensitive skin',
          'ຜື່ນແພ້ ຫຼື ຜິວແພ້ງ່າຍ',
          'ผื่นภูมิแพ้หรือผิวแพ้ง่าย',
          'Eczéma ou peau sensible',
        ),
        scores: { sensitive: 1 },
      },
      {
        id: 'acne',
        icon: '🔴',
        label: L('심한 여드름', 'Severe acne', 'ສິວໜັກ', 'สิวรุนแรง', 'Acné sévère'),
      },
      {
        id: 'freckles',
        icon: '🌰',
        label: L('주근깨·잡티', 'Freckles or spots', 'ຕົກກະ', 'กระ', 'Taches de rousseur'),
      },
      NONE,
    ],
  },
  {
    kind: 'single',
    id: 'sunTime',
    section: SECTION_HISTORY,
    prompt: L(
      '하루에 밖(햇볕)에 있는 시간은요?',
      'How long are you outdoors in daylight each day?',
      'ແຕ່ລະມື້ ຢູ່ກາງແຈ້ງດົນປານໃດ?',
      'แต่ละวันอยู่กลางแจ้งนานเท่าไร?',
      'Combien de temps passez-vous dehors chaque jour ?',
    ),
    choices: [
      {
        id: 'under30',
        icon: '🏠',
        label: L(
          '30분 미만',
          'Under 30 minutes',
          'ໜ້ອຍກວ່າ 30 ນາທີ',
          'น้อยกว่า 30 นาที',
          'Moins de 30 minutes',
        ),
      },
      {
        id: 'upTo2h',
        icon: '🚶‍♀️',
        label: L(
          '30분–2시간',
          '30 minutes to 2 hours',
          '30 ນາທີ – 2 ຊົ່ວໂມງ',
          '30 นาที – 2 ชั่วโมง',
          '30 min à 2 h',
        ),
      },
      {
        id: 'over2h',
        icon: '🛵',
        label: L(
          '2시간 이상 (오토바이·시장·야외 일)',
          'Over 2 hours (motorbike, market, outdoor work)',
          'ຫຼາຍກວ່າ 2 ຊົ່ວໂມງ (ລົດຈັກ, ຕະຫຼາດ)',
          'มากกว่า 2 ชั่วโมง (มอเตอร์ไซค์ ตลาด งานกลางแจ้ง)',
          'Plus de 2 h (moto, marché, travail dehors)',
        ),
      },
      NOT_SURE,
    ],
  },
  {
    kind: 'single',
    id: 'sunscreen',
    section: SECTION_HISTORY,
    prompt: L(
      '선크림은 얼마나 바르나요?',
      'How often do you wear sunscreen?',
      'ທາກັນແດດເລື້ອຍປານໃດ?',
      'ทากันแดดบ่อยแค่ไหน?',
      'Mettez-vous de l’écran solaire ?',
    ),
    choices: [
      {
        id: 'daily',
        icon: '☀️',
        label: L(
          '매일, 다시 바르기도 해요',
          'Every day, and I reapply',
          'ທຸກມື້ ແລະ ທາຊ້ຳ',
          'ทุกวันและทาซ้ำ',
          'Chaque jour, et je renouvelle',
        ),
      },
      {
        id: 'morning',
        icon: '🌅',
        label: L(
          '매일 아침 한 번',
          'Once every morning',
          'ທຸກເຊົ້າ ເທື່ອດຽວ',
          'ทุกเช้าครั้งเดียว',
          'Une fois chaque matin',
        ),
      },
      {
        id: 'out',
        icon: '🚪',
        label: L(
          '외출할 때만',
          'Only when I go out',
          'ສະເພາະເວລາອອກນອກ',
          'เฉพาะตอนออกนอกบ้าน',
          'Seulement quand je sors',
        ),
      },
      {
        id: 'rarely',
        icon: '🙈',
        label: L('거의 안 발라요', 'Hardly ever', 'ເກືອບບໍ່ທາ', 'แทบไม่ทา', 'Presque jamais'),
      },
    ],
  },
  {
    kind: 'single',
    id: 'makeup',
    section: SECTION_HISTORY,
    prompt: L(
      '화장은 어떻게 지우나요?',
      'How do you take off make-up?',
      'ລ້າງເຄື່ອງແຕ່ງໜ້າແນວໃດ?',
      'ล้างเครื่องสำอางอย่างไร?',
      'Comment vous démaquillez-vous ?',
    ),
    choices: [
      {
        id: 'none',
        icon: '🌿',
        label: L(
          '화장을 거의 안 해요',
          'I hardly wear make-up',
          'ເກືອບບໍ່ແຕ່ງໜ້າ',
          'แทบไม่แต่งหน้า',
          'Je me maquille peu',
        ),
      },
      {
        id: 'double',
        icon: '🫧',
        label: L(
          '클렌징 오일 + 폼, 두 번',
          'Oil cleanser, then foam — twice',
          'ນ້ຳມັນ + ໂຟມ ສອງເທື່ອ',
          'คลีนซิ่งออยล์ + โฟม สองขั้น',
          'Huile puis mousse — deux fois',
        ),
      },
      {
        id: 'single',
        icon: '🧼',
        label: L(
          '폼이나 물티슈로 한 번',
          'Once, with foam or a wipe',
          'ເທື່ອດຽວ ດ້ວຍໂຟມ ຫຼື ຜ້າປຽກ',
          'ครั้งเดียวด้วยโฟมหรือทิชชูเปียก',
          'Une fois, mousse ou lingette',
        ),
      },
      {
        id: 'sleepIn',
        icon: '😴',
        label: L(
          '가끔 안 지우고 자요',
          'Sometimes I sleep in it',
          'ບາງຄັ້ງນອນທັງແຕ່ງໜ້າ',
          'บางครั้งนอนทั้งที่ยังแต่งหน้า',
          'Je dors parfois maquillée',
        ),
      },
    ],
  },
  {
    kind: 'single',
    id: 'sleep',
    section: SECTION_HISTORY,
    prompt: L(
      '보통 몇 시간 자나요?',
      'How many hours do you usually sleep?',
      'ປົກກະຕິນອນຈັກຊົ່ວໂມງ?',
      'ปกตินอนกี่ชั่วโมง?',
      'Combien d’heures dormez-vous ?',
    ),
    choices: [
      {
        id: 'under6',
        icon: '🥱',
        label: L('6시간 미만', 'Under 6', 'ໜ້ອຍກວ່າ 6', 'น้อยกว่า 6', 'Moins de 6'),
      },
      { id: '6to8', icon: '🛏️', label: L('6–8시간', '6 to 8', '6–8', '6–8', '6 à 8') },
      {
        id: 'over8',
        icon: '😌',
        label: L('8시간 이상', 'More than 8', 'ຫຼາຍກວ່າ 8', 'มากกว่า 8', 'Plus de 8'),
      },
      NOT_SURE,
    ],
  },
  {
    kind: 'multi',
    id: 'lifestyle',
    section: SECTION_HISTORY,
    prompt: L(
      '나에게 해당하는 생활은?',
      'Which of these are part of your life?',
      'ອັນໃດກົງກັບຊີວິດຂອງທ່ານ?',
      'ข้อใดตรงกับชีวิตของคุณ?',
      'Lesquels font partie de votre vie ?',
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
        id: 'aircon',
        icon: '❄️',
        label: L(
          '에어컨 실내에 오래 있어요',
          'Long hours in air-conditioning',
          'ຢູ່ຫ້ອງແອດົນ',
          'อยู่ห้องแอร์นาน',
          'Longtemps en climatisation',
        ),
      },
      {
        id: 'smoking',
        icon: '🚬',
        label: L('담배를 피워요', 'I smoke', 'ສູບຢາ', 'สูบบุหรี่', 'Je fume'),
      },
      {
        id: 'spicy',
        icon: '🌶️',
        label: L(
          '맵고 뜨거운 음식·술을 자주',
          'Spicy or hot food, or alcohol, often',
          'ອາຫານເຜັດຮ້ອນ ຫຼື ເຫຼົ້າເລື້ອຍໆ',
          'อาหารเผ็ดร้อนหรือแอลกอฮอล์บ่อย',
          'Épices ou alcool souvent',
        ),
      },
      {
        id: 'stress',
        icon: '😣',
        label: L(
          '스트레스가 많아요',
          'A lot of stress',
          'ຄວາມຄຽດຫຼາຍ',
          'เครียดมาก',
          'Beaucoup de stress',
        ),
      },
      {
        id: 'touch',
        icon: '✋',
        label: L(
          '얼굴을 자주 만져요',
          'I touch my face a lot',
          'ຈັບໜ້າເລື້ອຍໆ',
          'จับหน้าบ่อย',
          'Je touche souvent mon visage',
        ),
      },
      {
        id: 'pregnant',
        icon: '🤰',
        label: L(
          '임신 중이거나 수유 중이에요',
          'Pregnant or breastfeeding',
          'ຖືພາ ຫຼື ລ້ຽງລູກດ້ວຍນົມ',
          'ตั้งครรภ์หรือให้นมบุตร',
          'Enceinte ou allaitante',
        ),
      },
      NONE,
    ],
  },
  {
    kind: 'multi',
    id: 'goals',
    section: SECTION_GOALS,
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
        id: 'clearTone',
        icon: '✨',
        label: L(
          '맑고 고른 톤',
          'A clear, even tone',
          'ສີຜິວໃສ ສະເໝີ',
          'ผิวกระจ่างใส สม่ำเสมอ',
          'Un teint net et uniforme',
        ),
      },
      {
        id: 'hydration',
        icon: '💧',
        label: L('촉촉함', 'Hydration', 'ຄວາມຊຸ່ມ', 'ความชุ่มชื้น', 'Hydratation'),
      },
      {
        id: 'calm',
        icon: '🌿',
        label: L(
          '트러블·붉은기 진정',
          'Calmer breakouts and redness',
          'ສິວ ແລະ ຜິວແດງສະຫງົບ',
          'สิวและผิวแดงสงบลง',
          'Apaiser boutons et rougeurs',
        ),
      },
      {
        id: 'poresOil',
        icon: '⭕',
        label: L(
          '모공·피지 정리',
          'Tidier pores and oil',
          'ຮູຂຸມຂົນ ແລະ ຄວາມມັນ',
          'รูขุมขนและความมัน',
          'Pores et sébum',
        ),
      },
      {
        id: 'firm',
        icon: '🎈',
        label: L(
          '주름·탄력',
          'Lines and firmness',
          'ຮອຍຫ່ຽວ ແລະ ຄວາມກະຊັບ',
          'ริ้วรอยและความกระชับ',
          'Rides et fermeté',
        ),
      },
      {
        id: 'sunHabit',
        icon: '☀️',
        label: L(
          '자외선 차단 습관',
          'A sunscreen habit',
          'ນິໄສກັນແດດ',
          'นิสัยกันแดด',
          'L’habitude de l’écran solaire',
        ),
      },
      {
        id: 'simple',
        icon: '3️⃣',
        label: L(
          '간단한 루틴',
          'A simple routine',
          'ກິດຈະວັດງ່າຍໆ',
          'รูทีนง่ายๆ',
          'Une routine simple',
        ),
      },
      NONE,
    ],
  },
];

// ---- the plan ------------------------------------------------------------------------------

const has = (answers: QuestAnswers, step: string, id: string) => (answers[step] ?? []).includes(id);
const anyOf = (answers: QuestAnswers, step: string, ids: readonly string[]) =>
  ids.some((id) => has(answers, step, id));

const N = {
  cleanserAm: L(
    '순한 세안제 또는 미지근한 물. 손가락으로 부드럽게.',
    'A gentle cleanser, or just lukewarm water. Fingertips, no scrubbing.',
    'ສະບູລ້າງໜ້າອ່ອນໂຍນ ຫຼື ນ້ຳອຸ່ນ. ໃຊ້ນິ້ວມື ບໍ່ຖູແຮງ.',
    'คลีนเซอร์อ่อนโยนหรือน้ำอุ่น ใช้ปลายนิ้ว ไม่ถู',
    'Nettoyant doux ou simple eau tiède, du bout des doigts.',
  ),
  oilPm: L(
    '선크림·화장을 먼저 녹여요. 마른 손·마른 얼굴에 마사지 후 물로 유화.',
    'Melts sunscreen and make-up first. Massage onto a dry face with dry hands, then emulsify with water.',
    'ລະລາຍກັນແດດ ແລະ ເຄື່ອງແຕ່ງໜ້າກ່ອນ. ນວດໃສ່ໜ້າແຫ້ງ ແລ້ວເອົານ້ຳໃສ່.',
    'ละลายกันแดดและเมคอัพก่อน นวดบนหน้าแห้งด้วยมือแห้ง แล้วเติมน้ำให้เป็นน้ำนม',
    'Dissout écran et maquillage. Masser sur peau sèche, puis émulsionner à l’eau.',
  ),
  foamPm: L(
    '약산성 폼·젤로 두 번째 세안. 60초면 충분해요.',
    'Second cleanse with a mildly acidic foam or gel; sixty seconds is enough.',
    'ລ້າງຄັ້ງທີສອງ ດ້ວຍໂຟມ/ເຈວ ກົດອ່ອນ; 60 ວິນາທີພໍ.',
    'ล้างขั้นที่สองด้วยโฟมหรือเจลกรดอ่อน 60 วินาทีพอ',
    'Second nettoyage, mousse ou gel doux ; soixante secondes suffisent.',
  ),
  toner: L(
    '손바닥으로 눌러 흡수. 수분·진정 토너가 기본이에요.',
    'Press in with the palms; a hydrating or soothing toner is the default.',
    'ກົດດ້ວຍຝ່າມືໃຫ້ຊຶມ; ໂທນເນີໃຫ້ຄວາມຊຸ່ມ/ຜ່ອນຄາຍ.',
    'ตบด้วยฝ่ามือให้ซึม ใช้โทนเนอร์ให้ความชุ่มชื้นหรือปลอบประโลม',
    'Faire pénétrer avec les paumes ; tonique hydratant ou apaisant.',
  ),
  tonerTeen: L(
    '선택이에요. 쓴다면 알코올·수렴 토너는 피하세요.',
    'Optional. If you use one, skip alcohol or astringent toners.',
    'ບໍ່ບັງຄັບ. ຖ້າໃຊ້ ຫຼີກລ່ຽງໂທນເນີທີ່ມີແອນກໍຮໍ.',
    'ไม่บังคับ ถ้าใช้ให้เลี่ยงโทนเนอร์ที่มีแอลกอฮอล์',
    'Facultatif ; évitez les toniques alcoolisés.',
  ),
  vitcAm: L(
    '비타민 C 세럼 — 아침, 선크림 전에. 몇 분 흡수시킨 뒤 다음 단계로. 처음엔 저농도부터.',
    'Vitamin C serum — mornings, before sunscreen. Let it sink in for a few minutes first. Start with a low strength.',
    'ເຊລັ່ມວິຕາມິນ C — ຕອນເຊົ້າ ກ່ອນກັນແດດ. ລໍຖ້າຈັກນາທີໃຫ້ຊຶມ. ເລີ່ມຈາກຄວາມເຂັ້ມຕ່ຳ.',
    'เซรั่มวิตามินซี ตอนเช้าก่อนกันแดด รอให้ซึมสักครู่ เริ่มจากความเข้มข้นต่ำ',
    'Sérum vitamine C le matin, avant l’écran ; laisser pénétrer quelques minutes. Commencer faiblement dosé.',
  ),
  niaAm: L(
    '나이아신아마이드 세럼 — 피지·모공·톤에 흔히 쓰여요. 아침·저녁 모두 가능.',
    'Niacinamide serum — common for oil, pores and tone; fine morning or evening.',
    'ເຊລັ່ມໄນອາຊິນາໄມ — ນິຍົມໃຊ້ກັບຄວາມມັນ, ຮູຂຸມຂົນ, ສີຜິວ; ໃຊ້ໄດ້ເຊົ້າ ແລະ ແລງ.',
    'เซรั่มไนอาซินาไมด์ นิยมใช้กับความมัน รูขุมขน สีผิว ใช้ได้ทั้งเช้าและเย็น',
    'Sérum niacinamide — courant pour sébum, pores et teint ; matin ou soir.',
  ),
  hydrateSerum: L(
    '히알루론산 같은 수분 세럼 하나면 충분해요.',
    'One hydrating serum, such as hyaluronic acid, is enough.',
    'ເຊລັ່ມໃຫ້ຄວາມຊຸ່ມ ເຊັ່ນ ໄຮຢາລູໂຣນິກ ອັນດຽວພໍ.',
    'เซรั่มให้ความชุ่มชื้น เช่น ไฮยาลูรอนิก ตัวเดียวพอ',
    'Un sérum hydratant (acide hyaluronique) suffit.',
  ),
  soothSerum: L(
    '진정 세럼(병풀·판테놀) — 예민한 날의 기본.',
    'A soothing serum (centella, panthenol) — the default on reactive days.',
    'ເຊລັ່ມຜ່ອນຄາຍ (ໃບບົວບົກ, ແພນທີນອລ).',
    'เซรั่มปลอบประโลม (ใบบัวบก แพนทีนอล) สำหรับวันที่ผิวอ่อนไหว',
    'Sérum apaisant (centella, panthénol) les jours réactifs.',
  ),
  eye: L(
    '아이크림 — 쌀알 크기를 약지로 톡톡. 눈가는 피부가 가장 얇아요.',
    'Eye cream — a rice-grain amount, patted on with the ring finger. The thinnest skin on the face.',
    'ຄີມຮອບຕາ — ເທົ່າເມັດເຂົ້າ ຕົບດ້ວຍນິ້ວນາງ.',
    'อายครีมปริมาณเท่าเมล็ดข้าว แตะด้วยนิ้วนาง ผิวรอบตาบางที่สุด',
    'Contour des yeux — un grain de riz, tapoté à l’annulaire.',
  ),
  lotion: L(
    '가벼운 젤·로션. 오일프리·논코메도제닉이면 좋아요.',
    'A light gel or lotion, ideally oil-free and non-comedogenic.',
    'ເຈວ ຫຼື ໂລຊັ່ນເບົາ ບໍ່ມີນ້ຳມັນ ບໍ່ອຸດຕັນ.',
    'เจลหรือโลชั่นบางเบา ปลอดน้ำมัน ไม่อุดตัน',
    'Gel ou lotion légère, sans huile, non comédogène.',
  ),
  creamRich: L(
    '진한 크림(세라마이드·스쿠알란). 목과 가슴 위까지 함께.',
    'A richer cream (ceramide, squalane), taken down over the neck and upper chest.',
    'ຄີມເຂັ້ມຂຸ້ນ (ເຊຣາໄມ, ສະຄວາເລນ) ທາລົງຮອດຄໍ ແລະ ໜ້າເອິກ.',
    'ครีมเข้มข้น (เซราไมด์ สควาเลน) ทาลงถึงคอและอกส่วนบน',
    'Crème riche (céramides, squalane), jusqu’au cou et au décolleté.',
  ),
  creamZones: L(
    'T존은 얇게, 볼은 한 겹 더. 목까지 함께.',
    'Thin on the T-zone, an extra layer on the cheeks, and down the neck.',
    'T-zone ທາບາງ, ແກ້ມເພີ່ມອີກຊັ້ນ, ລົງຮອດຄໍ.',
    'T-zone ทาบางๆ แก้มเพิ่มอีกชั้น และทาถึงคอ',
    'Fin sur la zone T, plus sur les joues, jusqu’au cou.',
  ),
  creamBasic: L(
    '보습 크림으로 마무리. 목까지 함께.',
    'Finish with a moisturiser — neck included.',
    'ປິດທ້າຍດ້ວຍຄີມ — ລວມຄໍ.',
    'ปิดท้ายด้วยมอยส์เจอไรเซอร์ รวมถึงคอ',
    'Terminer par une crème — cou compris.',
  ),
  creamSensitive: L(
    '무향 진정 크림(판테놀·병풀·세라마이드).',
    'A fragrance-free soothing cream (panthenol, centella, ceramide).',
    'ຄີມຜ່ອນຄາຍ ບໍ່ມີນ້ຳຫອມ.',
    'ครีมปลอบประโลมไร้น้ำหอม (แพนทีนอล ใบบัวบก เซราไมด์)',
    'Crème apaisante sans parfum (panthénol, centella, céramides).',
  ),
  sunscreen: L(
    'SPF 30 이상·PA+++ 이상, 얼굴·목·귀까지 넉넉히. 밖에서는 2시간마다.',
    'SPF 30+ and PA+++ or more, generously over face, neck and ears. Outdoors, every two hours.',
    'SPF 30+ ແລະ PA+++ ຂຶ້ນໄປ ທາໜ້າ, ຄໍ, ຫູ ໃຫ້ພຽງພໍ. ກາງແຈ້ງ ທຸກ 2 ຊົ່ວໂມງ.',
    'SPF 30+ และ PA+++ ขึ้นไป ทาหน้า คอ หู ให้ทั่ว อยู่กลางแจ้งทาซ้ำทุก 2 ชั่วโมง',
    'SPF 30+ et PA+++ ou plus, généreusement sur visage, cou et oreilles. Dehors, toutes les deux heures.',
  ),
  sunscreenSensitive: L(
    '미네랄(무기자차) SPF 30 이상이 덜 자극적인 경우가 많아요. 밖에서는 2시간마다.',
    'A mineral SPF 30+ is often gentler; outdoors, reapply every two hours.',
    'ກັນແດດແບບແຮ່ທາດ SPF 30+ ມັກອ່ອນໂຍນກວ່າ; ທາຊ້ຳທຸກ 2 ຊົ່ວໂມງ.',
    'กันแดดแบบฟิสิคอล SPF 30+ มักอ่อนโยนกว่า อยู่กลางแจ้งทาซ้ำทุก 2 ชั่วโมง',
    'Un écran minéral SPF 30+ est souvent plus doux ; dehors, toutes les deux heures.',
  ),
  retinol: L(
    '레티놀 — 저녁에만, 주 2–3번 저농도로 시작. 따가우면 횟수를 줄이고, 다음 날 선크림은 꼭.',
    'Retinol — evenings only, starting low two or three nights a week. Cut back if it stings, and never skip next-day sunscreen.',
    'ເຣຕິນອລ — ຕອນແລງເທົ່ານັ້ນ ເລີ່ມອາທິດລະ 2–3 ຄືນ ຄວາມເຂັ້ມຕ່ຳ. ແສບໃຫ້ຫຼຸດ, ມື້ຕໍ່ໄປຕ້ອງກັນແດດ.',
    'เรตินอล ใช้เฉพาะกลางคืน เริ่มสัปดาห์ละ 2–3 คืนความเข้มข้นต่ำ ถ้าแสบให้ลดความถี่ และวันรุ่งขึ้นต้องกันแดด',
    'Rétinol — le soir seulement, faiblement dosé, 2–3 soirs par semaine. Espacer si ça pique ; écran solaire le lendemain.',
  ),
  bhaPm: L(
    'BHA(살리실산) 토너·세럼 — 주 2–3번 저녁. 레티놀과 같은 날 겹치지 말고 번갈아.',
    'BHA (salicylic acid) toner or serum — two or three evenings a week, alternating with retinol rather than on the same night.',
    'BHA ໂທນເນີ/ເຊລັ່ມ — ອາທິດລະ 2–3 ຄືນ; ສະຫຼັບກັບເຣຕິນອລ ບໍ່ໃຊ້ຄືນດຽວກັນ.',
    'BHA (ซาลิไซลิก) โทนเนอร์หรือเซรั่ม สัปดาห์ละ 2–3 คืน สลับกับเรตินอล ไม่ใช้คืนเดียวกัน',
    'Tonique ou sérum BHA, 2–3 soirs par semaine, en alternance avec le rétinol.',
  ),
  ahaPm: L(
    'AHA·PHA 각질 관리 — 주 1–2번 저녁. 그 밤엔 다른 강한 성분은 쉬어요.',
    'AHA or PHA exfoliation — once or twice a week in the evening; no other strong actives that night.',
    'ຂັດຂີ້ໄຄ AHA/PHA — ອາທິດລະ 1–2 ຄືນ; ຄືນນັ້ນບໍ່ໃຊ້ສ່ວນປະສົມແຮງອື່ນ.',
    'ผลัดเซลล์ AHA/PHA สัปดาห์ละ 1–2 คืน คืนนั้นงดส่วนผสมแรงตัวอื่น',
    'Exfoliation AHA/PHA, une à deux fois par semaine le soir ; pas d’autre actif fort ce soir-là.',
  ),
  tonePm: L(
    '톤 세럼(나이아신아마이드·트라넥사믹애씨드) — 아침·저녁 모두 가능, 8–12주 꾸준히.',
    'A tone serum (niacinamide, tranexamic acid) — morning or evening, steadily for 8–12 weeks.',
    'ເຊລັ່ມສີຜິວ (ໄນອາຊິນາໄມ, ທຣາເນັກຊາມິກ) — ເຊົ້າ ຫຼື ແລງ, 8–12 ອາທິດ.',
    'เซรั่มปรับสีผิว (ไนอาซินาไมด์ ทรานซามิก) ใช้ได้เช้าและเย็น ต่อเนื่อง 8–12 สัปดาห์',
    'Sérum teint (niacinamide, acide tranexamique) matin ou soir, 8 à 12 semaines.',
  ),
  spot: L(
    '올라온 여드름에만 진정·스팟 제품을 콕. 짜지 않기.',
    'Spot product only on the pimple itself. No squeezing.',
    'ທາສະເພາະເມັດສິວ. ບໍ່ບີບ.',
    'แต้มเฉพาะเม็ดสิว ไม่บีบ',
    'Soin local sur le bouton seulement. Ne pas presser.',
  ),
  mask: L(
    '수분·진정 마스크팩, 토너 다음에 15–20분.',
    'A hydrating or soothing sheet mask after toner, 15–20 minutes.',
    'ແຜ່ນມາສໃຫ້ຄວາມຊຸ່ມ ຫຼັງໂທນເນີ 15–20 ນາທີ.',
    'มาสก์ให้ความชุ่มชื้นหรือปลอบประโลมหลังโทนเนอร์ 15–20 นาที',
    'Masque hydratant ou apaisant après le tonique, 15–20 minutes.',
  ),
};

const AGE_ADVICE: Record<string, AdviceBlock> = {
  teens: {
    id: 'age-teens',
    icon: '🎒',
    title: L(
      '10대에게 중요한 것',
      'What matters in your teens',
      'ສິ່ງສຳຄັນສຳລັບໄວລຸ້ນ',
      'สิ่งสำคัญสำหรับวัยรุ่น',
      'L’essentiel à l’adolescence',
    ),
    points: [
      L(
        '사춘기 호르몬으로 피지가 늘어 모공·블랙헤드·여드름이 잘 생겨요. 루틴은 간단할수록 좋아요: 세안 → 가벼운 보습 → 선크림.',
        'Puberty hormones raise oil, so pores, blackheads and acne are common. Simpler is better: cleanse → light moisturiser → sunscreen.',
        'ຮໍໂມນໄວລຸ້ນເພີ່ມຄວາມມັນ ຈຶ່ງເກີດສິວງ່າຍ. ຍິ່ງງ່າຍຍິ່ງດີ: ລ້າງ → ຄວາມຊຸ່ມເບົາ → ກັນແດດ.',
        'ฮอร์โมนวัยรุ่นเพิ่มความมัน จึงเกิดสิวง่าย ยิ่งง่ายยิ่งดี: ล้างหน้า → บำรุงบางเบา → กันแดด',
        'Les hormones augmentent le sébum. Au plus simple : nettoyer → hydratant léger → écran.',
      ),
      L(
        '화장을 한다면 가볍게, 그리고 그날 꼭 이중 세안으로 지우기. 화장한 채 자면 모공이 막혀요.',
        'If you wear make-up, keep it light and always double-cleanse it off the same day. Sleeping in it clogs pores.',
        'ຖ້າແຕ່ງໜ້າ ໃຫ້ບາງໆ ແລະ ລ້າງສອງຂັ້ນທຸກຄືນ. ນອນທັງແຕ່ງໜ້າ ອຸດຕັນຮູຂຸມຂົນ.',
        'ถ้าแต่งหน้าให้บางเบา และล้างสองขั้นตอนทุกคืน นอนทั้งที่แต่งหน้าทำให้รูขุมขนอุดตัน',
        'Maquillage léger, toujours retiré le soir par un double nettoyage.',
      ),
      L(
        '레티놀·강한 각질 제거·여러 산(酸)을 겹쳐 쓰지 마세요. 여드름이 심하면 혼자 해결하려 말고 피부과로.',
        'Skip retinol, strong peels and layered acids. If acne is severe, see a dermatologist rather than experimenting.',
        'ບໍ່ໃຊ້ເຣຕິນອລ ແລະ ກົດແຮງໆ. ສິວໜັກໃຫ້ພົບແພດຜິວໜັງ.',
        'อย่าใช้เรตินอล การผลัดเซลล์แรงๆ หรือกรดหลายตัวซ้อนกัน ถ้าสิวรุนแรงให้พบแพทย์ผิวหนัง',
        'Pas de rétinol ni d’acides forts. Acné sévère : dermatologue.',
      ),
    ],
  },
  '20s': {
    id: 'age-20s',
    icon: '🌱',
    title: L(
      '20대에게 중요한 것',
      'What matters in your 20s',
      'ສິ່ງສຳຄັນສຳລັບອາຍຸ 20+',
      'สิ่งสำคัญสำหรับวัย 20+',
      'L’essentiel à 20 ans',
    ),
    points: [
      L(
        '지금 쌓이는 햇빛 손상이 30–40대 잡티·주름이 돼요. 매일 선크림이 가장 큰 투자예요.',
        'Sun damage collected now becomes the spots and lines of your 30s and 40s; daily sunscreen is the best investment.',
        'ຄວາມເສຍຫາຍຈາກແດດຕອນນີ້ ຈະເປັນຈຸດດ່າງ ແລະ ຮອຍຫ່ຽວໃນອາຍຸ 30–40.',
        'ความเสียหายจากแดดตอนนี้จะกลายเป็นจุดด่างดำและริ้วรอยในวัย 30–40 กันแดดทุกวันคือการลงทุนที่ดีที่สุด',
        'Le soleil d’aujourd’hui fait les taches et rides de demain : l’écran quotidien.',
      ),
      L(
        '성인 여드름(턱·입가)이 생길 수 있어요. 아침 비타민 C나 나이아신아마이드 하나로 시작해요.',
        'Adult acne on the jaw can appear. One morning serum — vitamin C or niacinamide — is a good start.',
        'ສິວຜູ້ໃຫຍ່ຢູ່ຄາງອາດເກີດ. ເລີ່ມດ້ວຍເຊລັ່ມຕອນເຊົ້າອັນດຽວ.',
        'สิวผู้ใหญ่ที่คางอาจเกิดขึ้น เริ่มด้วยเซรั่มตอนเช้าตัวเดียว วิตามินซีหรือไนอาซินาไมด์',
        'L’acné adulte peut apparaître ; un sérum du matin pour commencer.',
      ),
      L(
        '20대 후반부터 가벼운 아이크림·저농도 레티놀을 천천히 들일 수 있어요.',
        'From the late 20s, a light eye cream and a low-strength retinol can come in slowly.',
        'ທ້າຍອາຍຸ 20 ເລີ່ມຄີມຮອບຕາ ແລະ ເຣຕິນອລອ່ອນໆ ໄດ້.',
        'ช่วงปลายวัย 20 เริ่มอายครีมและเรตินอลความเข้มข้นต่ำได้อย่างช้าๆ',
        'Dès la fin de la vingtaine, contour des yeux et rétinol doux.',
      ),
    ],
  },
  '30s': {
    id: 'age-30s',
    icon: '🌿',
    title: L(
      '30대에게 중요한 것',
      'What matters in your 30s',
      'ສິ່ງສຳຄັນສຳລັບອາຍຸ 30+',
      'สิ่งสำคัญสำหรับวัย 30+',
      'L’essentiel à 30 ans',
    ),
    points: [
      L(
        '잡티·기미가 보이기 시작하고, 표정 주름이 가만히 있어도 남기 시작해요. 임신·피임약은 기미를 진하게 할 수 있어요.',
        'Spots and melasma start to show and expression lines stay at rest. Pregnancy and the pill can darken melasma.',
        'ຈຸດດ່າງ ແລະ ຝ້າເລີ່ມເຫັນ, ຮອຍຫ່ຽວເລີ່ມຢູ່. ການຖືພາ ແລະ ຢາຄຸມ ອາດເຮັດໃຫ້ຝ້າເຂັ້ມ.',
        'จุดด่างดำและฝ้าเริ่มชัด ริ้วรอยเริ่มติดค้าง การตั้งครรภ์และยาคุมอาจทำให้ฝ้าเข้มขึ้น',
        'Taches et mélasma apparaissent ; grossesse et pilule peuvent les foncer.',
      ),
      L(
        '아침: 비타민 C 또는 톤 세럼 + 선크림(목·가슴까지). 저녁: 레티놀을 주 2–3번부터.',
        'Mornings: vitamin C or a tone serum plus sunscreen down to the chest. Evenings: retinol from two or three nights a week.',
        'ເຊົ້າ: ວິຕາມິນ C + ກັນແດດ ຮອດໜ້າເອິກ. ແລງ: ເຣຕິນອລ ອາທິດລະ 2–3 ຄືນ.',
        'เช้า: วิตามินซีหรือเซรั่มปรับสีผิว + กันแดดถึงอก เย็น: เรตินอลสัปดาห์ละ 2–3 คืน',
        'Matin : vitamine C + écran jusqu’au décolleté. Soir : rétinol 2–3 fois par semaine.',
      ),
      L(
        '아이크림을 루틴에 넣기 좋은 때예요.',
        'A good time to add an eye cream.',
        'ເວລາດີທີ່ຈະເພີ່ມຄີມຮອບຕາ.',
        'เป็นช่วงที่ดีจะเพิ่มอายครีม',
        'Bon moment pour un contour des yeux.',
      ),
    ],
  },
  '40s': {
    id: 'age-40s',
    icon: '🌳',
    title: L(
      '40대에게 중요한 것',
      'What matters in your 40s',
      'ສິ່ງສຳຄັນສຳລັບອາຍຸ 40+',
      'สิ่งสำคัญสำหรับวัย 40+',
      'L’essentiel à 40 ans',
    ),
    points: [
      L(
        '콜라겐·엘라스틴이 줄어 피부가 얇아지고 탄력이 떨어져요. 장벽도 약해져 건조해지기 쉬워요.',
        'Collagen and elastin fall, so skin thins and loosens; the barrier weakens and dries more easily.',
        'ຄໍລາເຈນຫຼຸດລົງ ຜິວບາງ ແລະ ຢ່ອນ; ເກາະປ້ອງກັນອ່ອນລົງ ແຫ້ງງ່າຍ.',
        'คอลลาเจนและอีลาสตินลดลง ผิวบางและหย่อน เกราะผิวอ่อนแอลงจึงแห้งง่าย',
        'Collagène et élastine diminuent ; la barrière s’affaiblit.',
      ),
      L(
        '세라마이드·펩타이드가 든 더 진한 크림, 저녁 레티놀, 아침 비타민 C — 그리고 목까지.',
        'A richer cream with ceramides and peptides, evening retinol, morning vitamin C — and all of it down the neck.',
        'ຄີມເຂັ້ມທີ່ມີເຊຣາໄມ ແລະ ເປບໄທ, ເຣຕິນອລຕອນແລງ, ວິຕາມິນ C ຕອນເຊົ້າ — ລົງຮອດຄໍ.',
        'ครีมเข้มข้นที่มีเซราไมด์และเปปไทด์ เรตินอลตอนเย็น วิตามินซีตอนเช้า และทาถึงคอ',
        'Crème plus riche (céramides, peptides), rétinol le soir, vitamine C le matin — jusqu’au cou.',
      ),
      L(
        '폐경 전후 변화가 시작돼요. 피부가 예전과 다르게 반응하면 제품을 줄이고 순하게.',
        'Perimenopause begins. If skin starts reacting differently, cut back to gentler products.',
        'ການປ່ຽນແປງກ່ອນໝົດປະຈຳເດືອນເລີ່ມ. ຖ້າຜິວປ່ຽນ ໃຫ້ໃຊ້ຜະລິດຕະພັນອ່ອນໂຍນ.',
        'ช่วงก่อนวัยทองเริ่มขึ้น ถ้าผิวตอบสนองต่างไป ให้ลดผลิตภัณฑ์และใช้ที่อ่อนโยน',
        'La périménopause commence ; si la peau réagit, simplifiez.',
      ),
    ],
  },
  '50s': {
    id: 'age-50s',
    icon: '🍂',
    title: L(
      '50대에게 중요한 것',
      'What matters in your 50s',
      'ສິ່ງສຳຄັນສຳລັບອາຍຸ 50+',
      'สิ่งสำคัญสำหรับวัย 50+',
      'L’essentiel à 50 ans',
    ),
    points: [
      L(
        '폐경 후 몇 년 동안 콜라겐이 빠르게 줄고(첫 5년 약 30%), 피지가 줄어 건조·가려움이 늘어요.',
        'Collagen drops fast in the years after menopause (about 30% in the first five) and less oil means more dryness and itch.',
        'ຫຼັງໝົດປະຈຳເດືອນ ຄໍລາເຈນຫຼຸດໄວ (ປະມານ 30% ໃນ 5 ປີທຳອິດ) ແລະ ແຫ້ງ ຄັນຫຼາຍຂຶ້ນ.',
        'หลังวัยทองคอลลาเจนลดเร็ว (ราว 30% ใน 5 ปีแรก) ความมันลดลงจึงแห้งและคันมากขึ้น',
        'Après la ménopause, le collagène chute (env. 30 % en cinq ans) ; plus de sécheresse.',
      ),
      L(
        '비누 대신 크림 타입 세안제, 세안 후 3분 안에 진한 보습, 레티놀은 천천히.',
        'A cream cleanser instead of soap, rich moisture within three minutes, retinol introduced slowly.',
        'ໃຊ້ສະບູແບບຄີມ, ທາຄວາມຊຸ່ມພາຍໃນ 3 ນາທີ, ເຣຕິນອລຄ່ອຍໆ.',
        'ใช้คลีนเซอร์แบบครีมแทนสบู่ บำรุงเข้มข้นภายใน 3 นาที เรตินอลค่อยเป็นค่อยไป',
        'Nettoyant crème, hydratation riche dans les trois minutes, rétinol progressif.',
      ),
      L(
        '새로 생기거나 변하는 점이 없는지 한 달에 한 번 살펴보세요.',
        'Check once a month for new or changing spots.',
        'ກວດເບິ່ງຈຸດໃໝ່ ຫຼື ທີ່ປ່ຽນແປງ ເດືອນລະເທື່ອ.',
        'ตรวจดูจุดใหม่หรือจุดที่เปลี่ยนแปลงเดือนละครั้ง',
        'Une fois par mois, repérez les taches nouvelles ou changeantes.',
      ),
    ],
  },
  '60plus': {
    id: 'age-60plus',
    icon: '🌺',
    title: L(
      '60대 이상에게 중요한 것',
      'What matters at 60 and over',
      'ສິ່ງສຳຄັນສຳລັບອາຍຸ 60+',
      'สิ่งสำคัญสำหรับวัย 60+',
      'L’essentiel après 60 ans',
    ),
    points: [
      L(
        '피부가 얇고 연약해져 멍이 잘 들고 회복이 느려요. 문지르지 말고 아주 순하게.',
        'Skin is thin and fragile, bruises easily and heals slowly — never scrub, keep everything gentle.',
        'ຜິວບາງ ອ່ອນແອ ຊ້ຳງ່າຍ ຫາຍຊ້າ — ບໍ່ຖູ ໃຫ້ອ່ອນໂຍນທີ່ສຸດ.',
        'ผิวบางและเปราะบาง ช้ำง่าย หายช้า อย่าถู ใช้แต่ที่อ่อนโยน',
        'Peau fine et fragile : jamais frotter, tout en douceur.',
      ),
      L(
        '미지근한 물이나 무향 세안제, 하루 두 번 진한 무향 크림, 매일 선크림.',
        'Lukewarm water or a fragrance-free cleanser, a rich fragrance-free cream twice a day, sunscreen daily.',
        'ນ້ຳອຸ່ນ ຫຼື ສະບູບໍ່ມີນ້ຳຫອມ, ຄີມເຂັ້ມມື້ລະ 2 ເທື່ອ, ກັນແດດທຸກມື້.',
        'น้ำอุ่นหรือคลีนเซอร์ไร้น้ำหอม ครีมเข้มข้นไร้น้ำหอมวันละ 2 ครั้ง กันแดดทุกวัน',
        'Eau tiède ou nettoyant sans parfum, crème riche deux fois par jour, écran quotidien.',
      ),
      L(
        '새로 생기거나 변하는 점·낫지 않는 상처는 피부과에서 확인하세요.',
        'Have new or changing spots, and sores that do not heal, checked by a dermatologist.',
        'ຈຸດໃໝ່ ຫຼື ປ່ຽນແປງ ແລະ ບາດແຜທີ່ບໍ່ຫາຍ ໃຫ້ແພດຜິວໜັງກວດ.',
        'จุดใหม่หรือที่เปลี่ยนไป และแผลที่ไม่หาย ให้แพทย์ผิวหนังตรวจ',
        'Faites vérifier toute tache nouvelle et toute plaie qui ne guérit pas.',
      ),
    ],
  },
};

const HABIT_TIPS: readonly { test: (a: QuestAnswers) => boolean; text: Localized }[] = [
  {
    test: (a) => has(a, 'teenAcne', 'lots') || has(a, 'family', 'acne'),
    text: L(
      '여드름 경향이 있는 편이에요. «논코메도제닉» 표시를 확인하고, 자국이 남지 않게 짜지 마세요.',
      'You lean towards breakouts: look for "non-comedogenic" and leave pimples alone so they do not mark.',
      'ທ່ານມີແນວໂນ້ມເປັນສິວ: ເລືອກ «ບໍ່ອຸດຕັນ» ແລະ ຢ່າບີບ.',
      'คุณมีแนวโน้มเป็นสิว เลือกผลิตภัณฑ์ «ไม่อุดตัน» และอย่าบีบสิว',
      'Tendance acnéique : produits non comédogènes, ne pas presser.',
    ),
  },
  {
    test: (a) => has(a, 'family', 'melasma') || has(a, 'family', 'freckles'),
    text: L(
      '가족에게 기미·잡티가 있으면 같은 경향이 있을 수 있어요. 자외선 차단을 30대 전부터 철저히.',
      'Melasma or spots in the family can mean the same tendency — be thorough with sun protection well before your 30s.',
      'ຖ້າຄອບຄົວມີຝ້າ ທ່ານອາດມີແນວໂນ້ມດຽວກັນ — ກັນແດດໃຫ້ດີແຕ່ຫົວທີ.',
      'ถ้าครอบครัวมีฝ้าหรือกระ คุณอาจมีแนวโน้มเดียวกัน กันแดดให้ดีตั้งแต่ก่อนวัย 30',
      'Mélasma familial : protection solaire rigoureuse dès maintenant.',
    ),
  },
  {
    test: (a) => has(a, 'family', 'earlyLines'),
    text: L(
      '이른 주름 가족력이 있다면 선크림과 보습, 20대 후반부터 저농도 레티놀이 흔히 권해져요.',
      'With early lines in the family, sunscreen, moisture and a low-strength retinol from the late 20s are the usual advice.',
      'ຖ້າຄອບຄົວມີຮອຍຫ່ຽວໄວ: ກັນແດດ, ຄວາມຊຸ່ມ ແລະ ເຣຕິນອລອ່ອນໆ ຈາກທ້າຍອາຍຸ 20.',
      'ถ้าครอบครัวมีริ้วรอยก่อนวัย กันแดด บำรุง และเรตินอลอ่อนๆ ตั้งแต่ปลายวัย 20',
      'Rides précoces dans la famille : écran, hydratation, rétinol doux dès 25–30 ans.',
    ),
  },
  {
    test: (a) => has(a, 'family', 'atopy'),
    text: L(
      '아토피·민감 가족력이 있으면 무향·저자극 제품을 고르고 새 제품은 꼭 패치 테스트.',
      'With eczema or sensitive skin in the family, choose fragrance-free gentle products and always patch-test.',
      'ຖ້າຄອບຄົວມີຜື່ນແພ້: ເລືອກຜະລິດຕະພັນບໍ່ມີນ້ຳຫອມ ແລະ ທົດສອບກ່ອນ.',
      'ถ้าครอบครัวมีผื่นภูมิแพ้ เลือกผลิตภัณฑ์ไร้น้ำหอม อ่อนโยน และทดสอบก่อนเสมอ',
      'Eczéma familial : produits sans parfum et test systématique.',
    ),
  },
  {
    test: (a) => has(a, 'sunTime', 'over2h') || has(a, 'lifestyle', 'motorbike'),
    text: L(
      '밖에 오래 있거나 오토바이를 탄다면 2시간마다 덧바르기, 챙 넓은 모자·마스크·선글라스, 목·손등까지. 선스틱이 덧바르기 편해요.',
      'Long hours outside or on a motorbike: reapply every two hours, add a wide hat, mask and sunglasses, and cover the neck and backs of hands. A sun stick makes reapplying easy.',
      'ຢູ່ກາງແຈ້ງດົນ ຫຼື ຂີ່ລົດຈັກ: ທາຊ້ຳທຸກ 2 ຊົ່ວໂມງ, ໝວກ, ຜ້າອັດປາກ, ແວ່ນ, ຄໍ ແລະ ຫຼັງມື. ກັນແດດແບບແທ່ງທາຊ້ຳງ່າຍ.',
      'อยู่กลางแจ้งนานหรือขี่มอเตอร์ไซค์ ทาซ้ำทุก 2 ชั่วโมง ใส่หมวก หน้ากาก แว่นกันแดด ทาถึงคอและหลังมือ กันแดดแบบแท่งทาซ้ำง่าย',
      'Longtemps dehors ou à moto : renouveler toutes les deux heures, chapeau, masque, lunettes ; un stick facilite.',
    ),
  },
  {
    test: (a) => has(a, 'sunscreen', 'rarely') || has(a, 'sunscreen', 'out'),
    text: L(
      '선크림이 습관이 아니라면 이것 하나만 먼저 바꿔 보세요. 흐린 날·실내 창가에서도 자외선은 들어와요.',
      'If sunscreen is not a habit yet, change just this first. UV gets through on cloudy days and through windows.',
      'ຖ້າຍັງບໍ່ເຄີຍທາກັນແດດ ໃຫ້ເລີ່ມອັນນີ້ກ່ອນ. UV ຜ່ານເມກ ແລະ ປ່ອງຢ້ຽມໄດ້.',
      'ถ้ายังไม่ทากันแดดเป็นนิสัย ให้เริ่มเปลี่ยนข้อนี้ก่อน UV ผ่านเมฆและกระจกได้',
      'Si l’écran n’est pas encore un réflexe, commencez par là : les UV passent nuages et vitres.',
    ),
  },
  {
    test: (a) => has(a, 'makeup', 'sleepIn') || has(a, 'makeup', 'single'),
    text: L(
      '화장과 선크림은 클렌징 오일 → 폼, 두 번 세안으로 지워야 남지 않아요. 화장한 채 자지 않기.',
      'Make-up and sunscreen come off properly with two cleanses — oil, then foam. Never sleep in make-up.',
      'ເຄື່ອງແຕ່ງໜ້າ ແລະ ກັນແດດ ຕ້ອງລ້າງສອງຂັ້ນ: ນ້ຳມັນ → ໂຟມ. ຢ່ານອນທັງແຕ່ງໜ້າ.',
      'เมคอัพและกันแดดต้องล้างสองขั้นตอน ออยล์แล้วตามด้วยโฟม อย่านอนทั้งที่ยังแต่งหน้า',
      'Démaquillage en deux temps : huile puis mousse. Jamais dormir maquillée.',
    ),
  },
  {
    test: (a) => has(a, 'sleep', 'under6') || has(a, 'lifestyle', 'stress'),
    text: L(
      '잠과 스트레스는 다크서클·칙칙함·트러블에 바로 보여요. 화장품보다 먼저 챙길 것이에요.',
      'Sleep and stress show straight away as dark circles, dullness and breakouts — they come before any product.',
      'ການນອນ ແລະ ຄວາມຄຽດ ສະແດງອອກທັນທີ ເປັນຮອຍຄ້ຳ ແລະ ສິວ — ສຳຄັນກວ່າເຄື່ອງສຳອາງ.',
      'การนอนและความเครียดสะท้อนทันทีเป็นใต้ตาคล้ำ ผิวหมอง และสิว สำคัญกว่าเครื่องสำอาง',
      'Sommeil et stress se voient tout de suite — avant tout produit.',
    ),
  },
  {
    test: (a) => has(a, 'lifestyle', 'aircon'),
    text: L(
      '에어컨은 피부 수분을 빼앗아요. 보습 크림을 한 겹 더, 낮에 건조하면 크림을 얇게 덧발라요.',
      'Air-conditioning pulls water from skin: add a layer of moisturiser and top up thinly during the day.',
      'ແອເຮັດໃຫ້ຜິວແຫ້ງ: ທາຄີມເພີ່ມອີກຊັ້ນ ແລະ ທາບາງໆລະຫວ່າງມື້.',
      'แอร์ดึงความชุ่มชื้นจากผิว ทามอยส์เจอไรเซอร์เพิ่มอีกชั้นและเติมบางๆ ระหว่างวัน',
      'La climatisation assèche : une couche de crème en plus, retouches légères.',
    ),
  },
  {
    test: (a) => has(a, 'lifestyle', 'smoking'),
    text: L(
      '흡연은 주름·칙칙함·입가 주름을 앞당기는 큰 요인이에요.',
      'Smoking is a major driver of early wrinkles, dullness and lines around the mouth.',
      'ການສູບຢາ ເປັນສາເຫດໃຫຍ່ຂອງຮອຍຫ່ຽວໄວ ແລະ ຜິວໝອງ.',
      'การสูบบุหรี่เป็นปัจจัยใหญ่ของริ้วรอยก่อนวัย ผิวหมอง และริ้วรอยรอบปาก',
      'Le tabac accélère rides, teint terne et rides péribuccales.',
    ),
  },
  {
    test: (a) => has(a, 'lifestyle', 'spicy'),
    text: L(
      '맵고 뜨거운 음식과 술은 홍조를 심하게 할 수 있어요. 붉어지는 날을 기록해 보세요.',
      'Spicy or hot food and alcohol can make flushing worse; keep a note of your red days.',
      'ອາຫານເຜັດຮ້ອນ ແລະ ເຫຼົ້າ ອາດເຮັດໃຫ້ໜ້າແດງຂຶ້ນ.',
      'อาหารเผ็ดร้อนและแอลกอฮอล์อาจทำให้หน้าแดงมากขึ้น ลองจดวันที่หน้าแดง',
      'Épices et alcool peuvent accentuer les rougeurs.',
    ),
  },
  {
    test: (a) => has(a, 'lifestyle', 'touch'),
    text: L(
      '손으로 얼굴을 만지거나 턱을 괴는 습관은 트러블을 늘려요. 휴대폰 화면도 자주 닦아요.',
      'Touching your face or resting your chin on your hand adds breakouts — wipe your phone screen often too.',
      'ການຈັບໜ້າ ເພີ່ມສິວ — ເຊັດໜ້າຈໍໂທລະສັບເລື້ອຍໆ.',
      'การจับหน้าหรือเท้าคางเพิ่มสิว เช็ดหน้าจอโทรศัพท์บ่อยๆ',
      'Toucher son visage favorise les boutons ; nettoyez aussi l’écran du téléphone.',
    ),
  },
];

const SKIN_AGE_RICH = new Set(['40s', '50s', '60plus']);

/** Builds the morning and evening routine for these answers. Pure: same answers, same plan. */
export function facePlan(answers: QuestAnswers, reading: TypeReading): CarePlan {
  const age = answers.age?.[0] ?? 'unsure';
  const concerns = answers.concerns ?? [];
  const pick = (ids: readonly string[]) => ids.some((id) => concerns.includes(id));
  const pregnant = has(answers, 'lifestyle', 'pregnant');
  const teen = age === 'teens';
  const sensitive =
    reading.modifier || reading.typeId === SENSITIVE_ID || pick(['sensitivity', 'redness']);
  const type = reading.typeId;
  const wearsMakeup = !has(answers, 'makeup', 'none');

  const wantsTone =
    pick(['melasma', 'sunSpots', 'freckles', 'darkSpots', 'dullness', 'marks', 'darkCircles']) ||
    has(answers, 'goals', 'clearTone');
  const wantsOil =
    pick(['acne', 'comedones', 'pores', 'sebum']) || has(answers, 'goals', 'poresOil');
  const wantsFirm =
    pick(['eyeWrinkles', 'mouthLines', 'foreheadLines', 'sagging', 'neck']) ||
    has(answers, 'goals', 'firm');
  const wantsTexture = pick(['flaking', 'dullness']);
  const eyeCare =
    pick(['eyeWrinkles', 'darkCircles']) || ['30s', '40s', '50s', '60plus'].includes(age);
  const retinolOk =
    !teen &&
    !pregnant &&
    !sensitive &&
    (wantsFirm || ['30s', '40s', '50s', '60plus'].includes(age));
  const simple = has(answers, 'goals', 'simple');

  const moisturiser: RoutineLine = sensitive
    ? { kind: 'cream', note: N.creamSensitive }
    : type === 'oily'
      ? { kind: 'lotion', note: N.lotion }
      : type === 'combination'
        ? { kind: 'cream', note: N.creamZones }
        : type === 'dry' || SKIN_AGE_RICH.has(age)
          ? { kind: 'cream', note: N.creamRich }
          : { kind: 'cream', note: N.creamBasic };

  const amSerum: RoutineLine | null = teen
    ? null
    : sensitive
      ? { kind: 'serum', note: N.soothSerum }
      : wantsTone || wantsFirm
        ? { kind: 'serum', note: N.vitcAm }
        : wantsOil
          ? { kind: 'serum', note: N.niaAm }
          : { kind: 'serum', note: N.hydrateSerum };

  const am: RoutineLine[] = [
    { kind: 'foamCleanser', note: N.cleanserAm },
    ...(simple ? [] : [{ kind: 'toner', note: teen ? N.tonerTeen : N.toner }]),
    ...(amSerum && !simple ? [amSerum] : []),
    ...(eyeCare && !simple ? [{ kind: 'eyeCream', note: N.eye }] : []),
    moisturiser,
    { kind: 'sunscreen', note: sensitive ? N.sunscreenSensitive : N.sunscreen },
  ];

  const pmTreatment: RoutineLine[] = [];
  if (!simple) {
    if (retinolOk) pmTreatment.push({ kind: 'serum', note: N.retinol });
    if (wantsOil && !teen) pmTreatment.push({ kind: 'toner', note: N.bhaPm });
    if (wantsTone && !retinolOk) pmTreatment.push({ kind: 'serum', note: N.tonePm });
    if (wantsTexture && !sensitive && !teen) pmTreatment.push({ kind: 'toner', note: N.ahaPm });
    if (sensitive && pmTreatment.length === 0)
      pmTreatment.push({ kind: 'serum', note: N.soothSerum });
  }

  const pm: RoutineLine[] = [
    ...(wearsMakeup || !teen ? [{ kind: 'oilCleanser', note: N.oilPm }] : []),
    { kind: 'foamCleanser', note: N.foamPm },
    ...(simple ? [] : [{ kind: 'toner', note: teen ? N.tonerTeen : N.toner }]),
    ...pmTreatment.slice(0, 2),
    ...(teen && pick(['acne']) ? [{ kind: 'serum', note: N.spot }] : []),
    ...(eyeCare && !simple ? [{ kind: 'eyeCream', note: N.eye }] : []),
    moisturiser,
  ];

  const weekly: RoutineLine[] = simple ? [] : [{ kind: 'mask', note: N.mask }];

  const advice: AdviceBlock[] = [];
  const ageAdvice = AGE_ADVICE[age];
  if (ageAdvice) advice.push(ageAdvice);
  const habits = HABIT_TIPS.filter((tip) => tip.test(answers)).map((tip) => tip.text);
  if (habits.length > 0) {
    advice.push({
      id: 'habits',
      icon: '🗓️',
      photo: '/gemini/C-03.jpg',
      title: L(
        '생활 습관에서 챙길 것',
        'From your habits',
        'ຈາກນິໄສຂອງທ່ານ',
        'จากนิสัยของคุณ',
        'Selon vos habitudes',
      ),
      points: habits,
    });
  }
  advice.push(SUN_HABIT, PATCH_TEST);

  const avoid = pregnant ? ['retinol', 'bha'] : teen ? ['retinol'] : [];
  const avoidReason = pregnant
    ? L(
        '임신·수유 중에는 레티놀, 고농도 살리실산(BHA) 같은 성분은 쓰기 전에 의사와 상의하세요.',
        'In pregnancy or while breastfeeding, ask your doctor before using retinol or high-strength salicylic acid (BHA).',
        'ໃນເວລາຖືພາ ຫຼື ລ້ຽງລູກດ້ວຍນົມ ປຶກສາທ່ານໝໍກ່ອນໃຊ້ເຣຕິນອລ ຫຼື BHA ເຂັ້ມຂຸ້ນ.',
        'ระหว่างตั้งครรภ์หรือให้นมบุตร ปรึกษาแพทย์ก่อนใช้เรตินอลหรือซาลิไซลิก (BHA) ความเข้มข้นสูง',
        'Enceinte ou allaitante : demandez l’avis du médecin avant rétinol ou BHA concentré.',
      )
    : teen
      ? L(
          '10대에게는 레티놀을 권하지 않아요. 여드름이 심하면 피부과에서 상담하세요.',
          'Retinol is not suggested for teenagers; for severe acne, see a dermatologist.',
          'ບໍ່ແນະນຳເຣຕິນອລສຳລັບໄວລຸ້ນ; ສິວໜັກໃຫ້ພົບແພດຜິວໜັງ.',
          'ไม่แนะนำเรตินอลสำหรับวัยรุ่น ถ้าสิวรุนแรงให้พบแพทย์ผิวหนัง',
          'Pas de rétinol pour les adolescents ; acné sévère : dermatologue.',
        )
      : null;

  return {
    alert: null,
    routines: [
      { id: 'am', icon: '🌅', title: QUEST_TEXT.morning, lines: am },
      { id: 'pm', icon: '🌙', title: QUEST_TEXT.evening, lines: pm },
    ],
    weekly,
    advice,
    avoid,
    avoidReason,
  };
}

export const FACE_TRACK: CareTrack = {
  id: 'face',
  icon: '🌸',
  cover: '/scenes/scene-03.jpg',
  coverFocus: '50% 30%',
  title: L(
    '얼굴 (목까지)',
    'Face (and neck)',
    'ໃບໜ້າ (ລວມຄໍ)',
    'ใบหน้า (รวมลำคอ)',
    'Visage (et cou)',
  ),
  intro: L(
    '나이대 → 피부 타입 → 고민 20가지 → 습관 → 목표. 약 5분이면 내 타입과 아침·저녁 루틴이 나와요.',
    'Age → skin type → twenty concerns → habits → goals. About five minutes to your likely type and a morning and evening routine.',
    'ອາຍຸ → ປະເພດຜິວ → ບັນຫາ 20 ຢ່າງ → ນິໄສ → ເປົ້າໝາຍ. ປະມານ 5 ນາທີ.',
    'ช่วงวัย → ประเภทผิว → ปัญหา 20 ข้อ → นิสัย → เป้าหมาย ประมาณ 5 นาทีจะได้ประเภทผิวและรูทีนเช้า-เย็น',
    'Âge → type de peau → vingt préoccupations → habitudes → objectifs. Environ cinq minutes.',
  ),
  steps: FACE_STEPS,
  types: SKIN_TYPES,
  baseTypeIds: BASE_TYPE_IDS,
  modifierTypeId: SENSITIVE_ID,
  concernStepId: 'concerns',
  selfStepId: 'typeSelf',
  concerns: FACE_CONCERNS,
  plan: facePlan,
  sources: [...COMMON_SOURCES, ...FACE_SOURCES],
};
