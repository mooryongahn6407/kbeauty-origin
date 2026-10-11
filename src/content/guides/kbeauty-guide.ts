/**
 * K-Beauty consumer guide — plain-language background for shoppers in Laos.
 *
 * Korean (ko) is the master text. English (en) is a natural rendering. Lao (lo) is an
 * UNREVIEWED DRAFT written without a native-speaker check and must be shown as such.
 *
 * Every statement is hedged general consumer education ("may help", "is used to"), never a
 * medical, product or brand claim. Sun-care numbers (SPF/PA meaning, ~2 mg/cm², two-hour
 * reapplication) and the Korean MFDS functional-cosmetics description were checked against
 * the sources in GUIDE_SOURCES.
 */

export interface L10n {
  readonly ko: string;
  readonly en: string;
  readonly lo: string;
}

export interface GuidePoint {
  readonly icon: string;
  readonly title: L10n;
  readonly body: L10n;
}

export interface CategoryGuide {
  /** Exact Korean category key used by the store catalog. */
  readonly category: string;
  readonly icon: string;
  /** What this product type is. */
  readonly what: L10n;
  /** Why it exists as its own category — the job it does that others don't. */
  readonly why: L10n;
  /** Where it sits in a routine, or when it is used. */
  readonly when: L10n;
  /** A practical tip for Laos' hot, humid climate and its seasons. */
  readonly laoTip: L10n;
}

export interface RoutineStep {
  readonly step: number;
  readonly category: string;
  readonly am: boolean;
  readonly pm: boolean;
  readonly note: L10n;
}

export interface GuideSource {
  readonly label: string;
  readonly url: string;
}

/* ------------------------------------------------------------------------------------------ */
/* Why Korean cosmetics                                                                         */
/* ------------------------------------------------------------------------------------------ */

export const WHY_KBEAUTY: readonly GuidePoint[] = [
  {
    icon: '🔬',
    title: {
      ko: '연구와 제조가 강한 나라',
      en: 'A country strong in research and manufacturing',
      lo: 'ປະເທດທີ່ເກັ່ງດ້ານການຄົ້ນຄວ້າ ແລະ ການຜະລິດ',
    },
    body: {
      ko: '한국에는 화장품을 연구하고 만드는 회사가 아주 많아요. 그래서 새로운 제형(바르는 느낌)과 새로운 형태의 제품이 빠르게 나와요.',
      en: 'Korea has a very large number of companies that research and make cosmetics. That is why new textures and new product formats appear there quickly.',
      lo: 'ເກົາຫຼີມີບໍລິສັດທີ່ຄົ້ນຄວ້າ ແລະ ຜະລິດເຄື່ອງສຳອາງຫຼາຍຫຼາຍ. ສະນັ້ນ ຈຶ່ງມີເນື້ອຄຣີມແບບໃໝ່ ແລະ ຜະລິດຕະພັນຮູບແບບໃໝ່ອອກມາໄວ.',
    },
  },
  {
    icon: '💧',
    title: {
      ko: '가볍고 촉촉한 사용감',
      en: 'Light, hydrating textures',
      lo: 'ເນື້ອບາງເບົາ ແລະ ຊຸ່ມຊື່ນ',
    },
    body: {
      ko: '여러 겹 발라도 무겁지 않은 가벼운 제품이 많아요. 그래서 라오스처럼 덥고 습한 나라에서도 쓰기 편하다는 사람이 많아요.',
      en: 'Many Korean products are light enough to layer without feeling heavy. Many people find them comfortable even in hot, humid countries like Laos.',
      lo: 'ຜະລິດຕະພັນເກົາຫຼີຫຼາຍຢ່າງບາງເບົາ ທາຫຼາຍຊັ້ນກໍບໍ່ໜັກໜ້າ. ຫຼາຍຄົນຈຶ່ງເຫັນວ່າໃຊ້ສະດວກ ເຖິງແມ່ນຢູ່ປະເທດທີ່ຮ້ອນ ແລະ ຊຸ່ມຄືລາວ.',
    },
  },
  {
    icon: '🌿',
    title: {
      ko: '‘벗겨내기’보다 ‘가꾸기’',
      en: 'Caring for skin rather than stripping it',
      lo: 'ເນັ້ນການບຳລຸງ ຫຼາຍກວ່າການຂັດລອກ',
    },
    body: {
      ko: 'K-뷰티는 피부를 세게 문지르거나 벗겨내기보다, 촉촉하게 채우고 피부 장벽(피부 겉의 보호막)을 지키는 데 초점을 두는 편이에요.',
      en: 'K-beauty tends to focus on keeping skin hydrated and protecting the skin barrier (the thin protective outer layer), rather than scrubbing or stripping it hard.',
      lo: 'K-beauty ມັກເນັ້ນໃຫ້ຜິວຊຸ່ມຊື່ນ ແລະ ປົກປ້ອງຊັ້ນປ້ອງກັນຜິວ (ຊັ້ນບາງໆທີ່ຢູ່ນອກສຸດຂອງຜິວ) ຫຼາຍກວ່າການຂັດ ຫຼື ລອກຜິວແຮງໆ.',
    },
  },
  {
    icon: '☀️',
    title: {
      ko: '매일 바르는 선크림 문화',
      en: 'An everyday sunscreen habit',
      lo: 'ນິໄສທາຄຣີມກັນແດດທຸກມື້',
    },
    body: {
      ko: '한국에서는 선크림을 여름에만이 아니라 매일 바르는 기본 단계로 여겨요. 그래서 끈적임과 백탁(하얗게 뜨는 것)을 줄인 제품이 많이 만들어졌어요.',
      en: 'In Korea, sunscreen is seen as a basic daily step, not just a summer product. That is why so many light sunscreens with less stickiness and less white cast have been developed.',
      lo: 'ຢູ່ເກົາຫຼີ ຄຣີມກັນແດດຖືເປັນຂັ້ນຕອນພື້ນຖານທີ່ທາທຸກມື້ ບໍ່ແມ່ນສະເພາະລະດູຮ້ອນ. ຈຶ່ງມີຄຣີມກັນແດດທີ່ບໍ່ໜຽວ ແລະ ບໍ່ຂາວວອກ ອອກມາຫຼາຍ.',
    },
  },
  {
    icon: '🎯',
    title: {
      ko: '피부 타입별로 고를 수 있는 넓은 선택',
      en: 'Wide choice for every skin type',
      lo: 'ມີໃຫ້ເລືອກຫຼາຍ ຕາມປະເພດຜິວ',
    },
    body: {
      ko: '지성·건성·민감한 피부 등 피부 타입과 고민에 맞춰 고를 수 있는 제품이 많아요. 마스크팩이나 미니 사이즈처럼 부담 없이 먼저 써 볼 수 있는 형태도 많아요.',
      en: 'There are products for oily, dry and sensitive skin and for many different concerns. Many also come in easy-to-try forms, such as sheet masks and mini sizes.',
      lo: 'ມີຜະລິດຕະພັນໃຫ້ເລືອກຕາມປະເພດຜິວ ເຊັ່ນ ຜິວມັນ, ຜິວແຫ້ງ, ຜິວແພ້ງ່າຍ ແລະ ຕາມບັນຫາຜິວຕ່າງໆ. ຍັງມີແບບທີ່ລອງໃຊ້ໄດ້ງ່າຍ ເຊັ່ນ ແຜ່ນມາສ໌ກ ແລະ ຂະໜາດນ້ອຍ.',
    },
  },
  {
    icon: '📺',
    title: {
      ko: '한류의 힘',
      en: 'The Korean Wave',
      lo: 'ກະແສເກົາຫຼີ',
    },
    body: {
      ko: '드라마와 K-팝을 통해 한국 배우·가수의 피부 관리가 알려지면서, 한국식 스킨케어에 관심을 갖는 사람이 세계적으로 늘었어요.',
      en: 'Through K-dramas and K-pop, people around the world saw how Korean actors and singers care for their skin, and interest in Korean-style skincare grew.',
      lo: 'ຜ່ານລະຄອນເກົາຫຼີ ແລະ ເພງ K-pop ຄົນທົ່ວໂລກໄດ້ເຫັນວິທີເບິ່ງແຍງຜິວຂອງດາລາເກົາຫຼີ ຄວາມສົນໃຈໃນການເບິ່ງແຍງຜິວແບບເກົາຫຼີຈຶ່ງເພີ່ມຂຶ້ນ.',
    },
  },
  {
    icon: '🏷️',
    title: {
      ko: '정부가 관리하는 ‘기능성’ 표시',
      en: '“Functional” labels overseen by the government',
      lo: 'ປ້າຍ “ຟັງຊັນ” ທີ່ລັດຖະບານກວດກາ',
    },
    body: {
      ko: '한국에서 미백·주름개선·자외선차단 같은 ‘기능성화장품’ 표시는 식품의약품안전처(식약처)의 심사나 보고를 거쳐야 쓸 수 있어요.',
      en: 'In Korea, a product can only carry a “functional cosmetic” label — such as brightening, wrinkle care or UV protection — after review by, or notification to, the Ministry of Food and Drug Safety (MFDS).',
      lo: 'ຢູ່ເກົາຫຼີ ຜະລິດຕະພັນຈະຂຽນວ່າ “ເຄື່ອງສຳອາງຟັງຊັນ” ເຊັ່ນ ຊ່ວຍໃຫ້ຜິວກະຈ່າງໃສ, ຊ່ວຍເລື່ອງຮອຍຫ່ຽວຍົ່ນ ຫຼື ກັນແດດ ໄດ້ ກໍຕໍ່ເມື່ອຜ່ານການກວດ ຫຼື ແຈ້ງຕໍ່ກະຊວງຄວາມປອດໄພອາຫານ ແລະ ຢາ ຂອງເກົາຫຼີ (MFDS) ແລ້ວ.',
    },
  },
];

/* ------------------------------------------------------------------------------------------ */
/* Why so many product types                                                                    */
/* ------------------------------------------------------------------------------------------ */

export const WHY_SO_MANY_CATEGORIES: readonly GuidePoint[] = [
  {
    icon: '🧱',
    title: {
      ko: '한 단계에 한 가지 일',
      en: 'One step, one job',
      lo: 'ໜຶ່ງຂັ້ນຕອນ ໜຶ່ງໜ້າທີ່',
    },
    body: {
      ko: '클렌징은 씻어내고, 토너는 정돈하고, 세럼은 집중해서 채우고, 크림은 덮어 주고, 선크림은 햇빛을 막아요. 한 제품이 모든 일을 다 하기는 어려워서 나뉘어 있어요.',
      en: 'Cleansers wash away, toners prepare, serums deliver focused care, creams seal in moisture and sunscreen blocks UV. One product can’t easily do every job, so they are separate.',
      lo: 'ຄລີນຊິ່ງລ້າງອອກ, ໂທນເນີປັບສະພາບຜິວ, ເຊຣັ່ມບຳລຸງແບບເຂັ້ມຂຸ້ນ, ຄຣີມປິດຄວາມຊຸ່ມຊື່ນໄວ້, ຄຣີມກັນແດດກັນລັງສີ UV. ຜະລິດຕະພັນດຽວເຮັດທຸກຢ່າງໄດ້ຍາກ ຈຶ່ງແຍກກັນ.',
    },
  },
  {
    icon: '🥛',
    title: {
      ko: '묽은 것부터 진한 것 순서',
      en: 'Thin to thick',
      lo: 'ຈາກບາງໄປຫາໜາ',
    },
    body: {
      ko: '물처럼 묽은 제품을 먼저, 끈적하거나 기름진 제품을 나중에 바르는 게 기본이에요. 제형(질감)과 무게가 다르기 때문에 제품 종류도 나뉘어요.',
      en: 'The basic rule is to apply watery products first and richer, oilier ones later. Because textures and weights differ, the product types are divided too.',
      lo: 'ຫຼັກພື້ນຖານແມ່ນທາຜະລິດຕະພັນທີ່ບາງຄືນ້ຳກ່ອນ ແລ້ວຈຶ່ງທາທີ່ໜາ ຫຼື ມີນ້ຳມັນຫຼາຍທີຫຼັງ. ເນື່ອງຈາກເນື້ອ ແລະ ຄວາມໜັກເບົາຕ່າງກັນ ປະເພດຜະລິດຕະພັນຈຶ່ງແຍກກັນ.',
    },
  },
  {
    icon: '👁️',
    title: {
      ko: '부위마다 피부가 달라요',
      en: 'Each body area is different',
      lo: 'ແຕ່ລະສ່ວນຂອງຜິວບໍ່ຄືກັນ',
    },
    body: {
      ko: '눈가는 얇고, 입술은 피지(기름)가 거의 나오지 않고, 손은 자주 씻어서 쉽게 건조해져요. 그래서 아이크림·립밤·핸드크림처럼 부위별 제품이 있어요.',
      en: 'The skin around the eyes is thin, lips make almost no oil, and hands dry out from frequent washing. That is why there are eye creams, lip balms and hand creams.',
      lo: 'ຜິວຮອບດວງຕາບາງ, ສົບແທບບໍ່ມີນ້ຳມັນ, ມືແຫ້ງງ່າຍເພາະລ້າງເລື້ອຍໆ. ຈຶ່ງມີຄຣີມຮອບຕາ, ລິບບາມ ແລະ ຄຣີມທາມື ແຍກຕາມສ່ວນ.',
    },
  },
  {
    icon: '🧼',
    title: {
      ko: '씻어내는 것 · 남기는 것 · 지키는 것',
      en: 'Wash off · leave on · protect',
      lo: 'ລ້າງອອກ · ທາໄວ້ · ປົກປ້ອງ',
    },
    body: {
      ko: '클렌저는 피부에 잠깐 닿고 씻겨 나가고, 세럼과 크림은 피부에 남아 있고, 선크림은 낮 동안 피부를 지켜요. 목적이 달라서 만드는 방식도 달라요.',
      en: 'Cleansers touch the skin briefly and rinse away, serums and creams stay on, and sunscreen protects through the day. Different purposes need different formulas.',
      lo: 'ຄລີນເຊີສຳຜັດຜິວແປບດຽວແລ້ວລ້າງອອກ, ເຊຣັ່ມ ແລະ ຄຣີມທາໄວ້ເທິງຜິວ, ຄຣີມກັນແດດປົກປ້ອງຜິວຕະຫຼອດມື້. ຈຸດປະສົງຕ່າງກັນ ສູດກໍຕ່າງກັນ.',
    },
  },
  {
    icon: '🌦️',
    title: {
      ko: '피부 타입과 계절에 맞춰 고르기',
      en: 'Choose by skin type and season',
      lo: 'ເລືອກຕາມປະເພດຜິວ ແລະ ລະດູການ',
    },
    body: {
      ko: '지성 피부나 더운 계절엔 가벼운 것만, 건성 피부나 건조한 계절엔 크림을 더하는 식으로 조합할 수 있어요. 단계가 나뉘어 있어야 이렇게 골라 쓸 수 있어요.',
      en: 'Oily skin or hot weather may need only light layers, while dry skin or the dry season may need an extra cream. Separate steps make this mixing and matching possible.',
      lo: 'ຜິວມັນ ຫຼື ລະດູຮ້ອນ ອາດໃຊ້ພຽງຊັ້ນບາງໆ, ສ່ວນຜິວແຫ້ງ ຫຼື ລະດູແລ້ງ ອາດເພີ່ມຄຣີມ. ການແຍກຂັ້ນຕອນເຮັດໃຫ້ເລືອກປະສົມໄດ້ແບບນີ້.',
    },
  },
  {
    icon: '✅',
    title: {
      ko: '전부 쓸 필요는 없어요',
      en: 'You don’t need them all',
      lo: 'ບໍ່ຈຳເປັນຕ້ອງໃຊ້ທັງໝົດ',
    },
    body: {
      ko: '기본은 세 가지예요: 씻기(클렌징), 촉촉하게(보습), 아침엔 선크림. 나머지는 내 피부와 취향에 따라 더하면 돼요.',
      en: 'The basics are three: cleanse, moisturise and, in the morning, sunscreen. Everything else can be added to suit your skin and taste.',
      lo: 'ພື້ນຖານມີສາມຢ່າງ: ລ້າງໜ້າ, ບຳລຸງຄວາມຊຸ່ມຊື່ນ ແລະ ຕອນເຊົ້າທາຄຣີມກັນແດດ. ສ່ວນອື່ນຄ່ອຍເພີ່ມຕາມຜິວ ແລະ ຄວາມມັກຂອງເຈົ້າ.',
    },
  },
];

/* ------------------------------------------------------------------------------------------ */
/* The 15 store categories                                                                      */
/* ------------------------------------------------------------------------------------------ */

export const CATEGORY_GUIDES: readonly CategoryGuide[] = [
  {
    category: '에센스·세럼·앰플',
    icon: '💧',
    what: {
      ko: '피부에 필요한 성분을 적은 양에 많이 담은 묽은 제품이에요. 보통 에센스 → 세럼 → 앰플 순으로 진하다고 말하지만, 브랜드마다 기준은 조금씩 달라요.',
      en: 'Thin products that pack a lot of active ingredients into a small amount. People often say essence → serum → ampoule goes from light to concentrated, but each brand uses the names a little differently.',
      lo: 'ຜະລິດຕະພັນເນື້ອບາງທີ່ມີສ່ວນປະສົມບຳລຸງຫຼາຍໃນປະລິມານໜ້ອຍ. ມັກເວົ້າວ່າ ເອສເຊັນ → ເຊຣັ່ມ → ແອມພູນ ເຂັ້ມຂຸ້ນຂຶ້ນເລື້ອຍໆ ແຕ່ແຕ່ລະແບຣນໃຊ້ຊື່ຕ່າງກັນໜ້ອຍໜຶ່ງ.',
    },
    why: {
      ko: '토너보다 진하고 크림보다 가벼워서, 보습·피부결·피부톤처럼 ‘나만의 고민’에 맞춰 골라 쓰는 단계예요.',
      en: 'Richer than toner but lighter than cream, this is the step you choose to match your own concern — hydration, texture or tone.',
      lo: 'ເຂັ້ມກວ່າໂທນເນີ ແຕ່ບາງເບົາກວ່າຄຣີມ. ເປັນຂັ້ນຕອນທີ່ເລືອກໃຫ້ກົງກັບບັນຫາຜິວຂອງເຈົ້າເອງ ເຊັ່ນ ຄວາມຊຸ່ມຊື່ນ, ຄວາມລຽບນຽນ ຫຼື ສີຜິວ.',
    },
    when: {
      ko: '아침·저녁 모두, 토너 다음·크림 전에 발라요. 여러 개를 쓴다면 묽은 것부터 발라요.',
      en: 'Morning and night, after toner and before cream. If you use more than one, apply the thinnest first.',
      lo: 'ທັງຕອນເຊົ້າ ແລະ ຕອນແລງ, ຫຼັງໂທນເນີ ແລະ ກ່ອນຄຣີມ. ຖ້າໃຊ້ຫຼາຍຕົວ ໃຫ້ທາຕົວທີ່ບາງທີ່ສຸດກ່ອນ.',
    },
    laoTip: {
      ko: '무더운 3~5월과 습한 우기엔 세럼 하나에 가벼운 젤 크림만으로도 충분할 수 있어요. 끈적이면 양을 줄여 보세요.',
      en: 'In the hottest months (March–May) and the humid rainy season, one serum plus a light gel cream may be enough. If it feels sticky, use less.',
      lo: 'ໃນເດືອນທີ່ຮ້ອນທີ່ສຸດ (ມີນາ–ພຶດສະພາ) ແລະ ລະດູຝົນທີ່ຊຸ່ມ, ເຊຣັ່ມໜຶ່ງຕົວ ກັບ ເຈວຄຣີມບາງໆ ອາດພຽງພໍແລ້ວ. ຖ້າໜຽວ ໃຫ້ຫຼຸດປະລິມານລົງ.',
    },
  },
  {
    category: '크림',
    icon: '🫙',
    what: {
      ko: '수분과 유분을 함께 담아 피부 겉에 얇은 보호막을 만들어 주는 보습 제품이에요. 젤·로션·크림·밤 순서로 점점 진해져요.',
      en: 'A moisturiser that combines water and oil to form a thin protective film on the skin. Gel, lotion, cream and balm go from lightest to richest.',
      lo: 'ຜະລິດຕະພັນບຳລຸງຄວາມຊຸ່ມຊື່ນທີ່ມີທັງນ້ຳ ແລະ ນ້ຳມັນ ສ້າງຊັ້ນບາງໆປົກປ້ອງຜິວ. ເຈວ, ໂລຊັນ, ຄຣີມ ແລະ ບາມ ໜາຂຶ້ນຕາມລຳດັບ.',
    },
    why: {
      ko: '앞 단계에서 준 수분이 날아가지 않도록 ‘뚜껑’을 덮어 주는 역할이에요. 토너나 세럼만으로는 이 일을 하기 어려워요.',
      en: 'It works like a lid, helping keep in the moisture from earlier steps. Toners and serums alone can’t easily do this.',
      lo: 'ມັນເຮັດໜ້າທີ່ຄືຝາປິດ ຊ່ວຍກັກຄວາມຊຸ່ມຊື່ນຈາກຂັ້ນຕອນກ່ອນໜ້າໄວ້. ໂທນເນີ ຫຼື ເຊຣັ່ມຢ່າງດຽວເຮັດໜ້າທີ່ນີ້ໄດ້ຍາກ.',
    },
    when: {
      ko: '스킨케어의 거의 마지막이에요. 아침엔 크림 다음 선크림, 저녁엔 크림이 마지막 단계예요.',
      en: 'Near the end of your routine. In the morning, sunscreen follows the cream; at night, cream is the last step.',
      lo: 'ເກືອບເປັນຂັ້ນຕອນສຸດທ້າຍ. ຕອນເຊົ້າ ທາຄຣີມແລ້ວຕາມດ້ວຍຄຣີມກັນແດດ, ຕອນແລງ ຄຣີມແມ່ນຂັ້ນຕອນສຸດທ້າຍ.',
    },
    laoTip: {
      ko: '습한 계절엔 젤이나 로션 타입이 산뜻해요. 건조한 11~2월이나 에어컨을 오래 쬐는 날엔 조금 더 진한 크림이 도움이 될 수 있어요.',
      en: 'In humid months, gel or lotion types feel fresher. In the dry season (November–February) or on long days in air-conditioning, a richer cream may help.',
      lo: 'ໃນລະດູທີ່ຊຸ່ມ ເຈວ ຫຼື ໂລຊັນ ໃຫ້ຄວາມສົດຊື່ນກວ່າ. ໃນລະດູແລ້ງ (ພະຈິກ–ກຸມພາ) ຫຼື ມື້ທີ່ຢູ່ໃນຫ້ອງແອດົນໆ ຄຣີມທີ່ໜາຂຶ້ນອາດຊ່ວຍໄດ້.',
    },
  },
  {
    category: '선케어',
    icon: '☀️',
    what: {
      ko: '자외선(UV)을 막아 주는 제품이에요. 선크림, 선젤, 선스틱, 선쿠션, 선스프레이 등 형태가 다양해요.',
      en: 'Products that protect skin from ultraviolet (UV) light. They come as creams, gels, sticks, cushions, sprays and more.',
      lo: 'ຜະລິດຕະພັນທີ່ປົກປ້ອງຜິວຈາກລັງສີ UV. ມີຫຼາຍຮູບແບບ ເຊັ່ນ ຄຣີມ, ເຈວ, ແທ່ງ, ຄຸດຊັນ ແລະ ສະເປຣ.',
    },
    why: {
      ko: '다른 제품이 피부를 ‘가꾸는’ 일이라면 선케어는 햇빛으로부터 ‘지키는’ 일이에요. 햇빛은 기미·잡티와 피부 노화의 큰 원인 중 하나로 알려져 있어서 매일 필요한 단계예요.',
      en: 'Other products care for the skin; sun care protects it from sunlight. Sunlight is known as one of the main causes of dark spots and skin ageing, so this step is needed every day.',
      lo: 'ຜະລິດຕະພັນອື່ນບຳລຸງຜິວ ສ່ວນຄຣີມກັນແດດປົກປ້ອງຜິວຈາກແສງແດດ. ແສງແດດເປັນສາເຫດສຳຄັນອັນໜຶ່ງຂອງຈຸດດ່າງດຳ ແລະ ຜິວແກ່ກ່ອນໄວ ຈຶ່ງຄວນທາທຸກມື້.',
    },
    when: {
      ko: '아침 스킨케어의 마지막, 메이크업 바로 전에 발라요. 밖에 있다면 약 2시간마다, 땀을 흘리거나 물놀이 뒤에는 바로 다시 발라요.',
      en: 'The last step of your morning skincare, just before makeup. Outdoors, reapply about every 2 hours, and right away after sweating or swimming.',
      lo: 'ຂັ້ນຕອນສຸດທ້າຍຂອງການບຳລຸງຜິວຕອນເຊົ້າ ກ່ອນແຕ່ງໜ້າ. ຖ້າຢູ່ກາງແຈ້ງ ທາຊ້ຳປະມານທຸກໆ 2 ຊົ່ວໂມງ ແລະ ທາຊ້ຳທັນທີຫຼັງອອກເຫື່ອ ຫຼື ລອຍນ້ຳ.',
    },
    laoTip: {
      ko: '라오스는 일 년 내내 햇빛이 강해요. 흐린 우기에도 바르고, 오토바이를 탈 땐 목·귀·손등도 잊지 마세요.',
      en: 'The sun in Laos is strong all year. Apply it on cloudy rainy-season days too, and when riding a motorbike, don’t forget your neck, ears and the backs of your hands.',
      lo: 'ແດດຢູ່ລາວແຮງຕະຫຼອດປີ. ລະດູຝົນທີ່ມີເມກກໍຄວນທາ ແລະ ເວລາຂີ່ລົດຈັກ ຢ່າລືມທາຄໍ, ຫູ ແລະ ຫຼັງມື.',
    },
  },
  {
    category: '헤어케어',
    icon: '💇',
    what: {
      ko: '샴푸, 컨디셔너, 헤어 마스크, 헤어 에센스·오일, 두피 제품처럼 머리카락과 두피를 위한 제품이에요.',
      en: 'Products for hair and scalp: shampoo, conditioner, hair masks, hair essences and oils, and scalp products.',
      lo: 'ຜະລິດຕະພັນສຳລັບຜົມ ແລະ ໜັງຫົວ: ແຊມພູ, ຄອນດິຊັນເນີ, ມາສ໌ກຜົມ, ເອສເຊັນ ແລະ ນ້ຳມັນບຳລຸງຜົມ, ຜະລິດຕະພັນສຳລັບໜັງຫົວ.',
    },
    why: {
      ko: '두피는 얼굴과 이어진 피부라 깨끗이 씻어야 하고, 머리카락은 상하면 스스로 회복되기 어려워서 코팅하고 보호해 주는 제품이 따로 필요해요.',
      en: 'The scalp is skin, just like your face, so it needs cleansing. Hair strands can’t repair themselves once damaged, so separate products coat and protect them.',
      lo: 'ໜັງຫົວກໍແມ່ນຜິວຄືກັບໃບໜ້າ ຈຶ່ງຕ້ອງລ້າງໃຫ້ສະອາດ. ເສັ້ນຜົມເມື່ອເສຍແລ້ວຟື້ນຕົວເອງບໍ່ໄດ້ ຈຶ່ງຕ້ອງມີຜະລິດຕະພັນເຄືອບ ແລະ ປົກປ້ອງແຍກຕ່າງຫາກ.',
    },
    when: {
      ko: '샴푸는 두피 위주로 문질러 씻고, 컨디셔너는 머리카락 끝 위주로 발라요. 헤어 오일은 머리를 감은 뒤 끝부분에 조금만 발라요.',
      en: 'Massage shampoo mainly into the scalp; apply conditioner mainly to the ends. Use just a little hair oil on the ends after washing.',
      lo: 'ນວດແຊມພູໃສ່ໜັງຫົວເປັນຫຼັກ, ທາຄອນດິຊັນເນີໃສ່ປາຍຜົມເປັນຫຼັກ. ຫຼັງສະຜົມ ທານ້ຳມັນບຳລຸງຜົມໜ້ອຍດຽວທີ່ປາຍຜົມ.',
    },
    laoTip: {
      ko: '땀을 많이 흘린 날엔 두피를 깨끗이 씻고, 비를 맞은 날엔 머리를 젖은 채로 오래 두지 말고 바로 말려 주세요. 강한 햇빛 아래에선 모자가 머리카락을 지켜 줘요.',
      en: 'On sweaty days, wash your scalp well. After getting caught in the rain, dry your hair soon rather than leaving it wet. A hat helps protect hair under strong sun.',
      lo: 'ມື້ທີ່ອອກເຫື່ອຫຼາຍ ໃຫ້ສະຜົມໃຫ້ສະອາດ. ຖ້າຖືກຝົນ ຢ່າປ່ອຍຜົມປຽກດົນ ໃຫ້ເປົ່າໃຫ້ແຫ້ງໄວ. ເວລາແດດແຮງ ໃສ່ໝວກຊ່ວຍປົກປ້ອງຜົມ.',
    },
  },
  {
    category: '클렌징',
    icon: '🫧',
    what: {
      ko: '메이크업, 선크림, 피지(기름), 먼지를 씻어내는 제품이에요. 클렌징 오일·밤, 클렌징 워터, 폼 클렌저, 젤 클렌저 등이 있어요.',
      en: 'Products that remove makeup, sunscreen, oil and dirt: cleansing oils and balms, micellar waters, foam cleansers, gel cleansers and more.',
      lo: 'ຜະລິດຕະພັນທີ່ລ້າງເມກອັບ, ຄຣີມກັນແດດ, ນ້ຳມັນ ແລະ ຂີ້ຝຸ່ນອອກ ເຊັ່ນ ຄລີນຊິ່ງອອຍ ແລະ ບາມ, ຄລີນຊິ່ງວໍເຕີ, ໂຟມລ້າງໜ້າ ແລະ ເຈວລ້າງໜ້າ.',
    },
    why: {
      ko: '깨끗이 씻어야 다음 제품이 제 역할을 할 수 있어요. 기름은 기름으로, 땀과 먼지는 물로 잘 녹기 때문에 종류가 나뉘어 있어요.',
      en: 'Clean skin lets the next products do their job. Oil dissolves oil while water lifts sweat and dust, which is why there are different types.',
      lo: 'ຜິວທີ່ສະອາດຊ່ວຍໃຫ້ຜະລິດຕະພັນຕໍ່ໄປເຮັດວຽກໄດ້ດີ. ນ້ຳມັນລະລາຍນ້ຳມັນ ສ່ວນນ້ຳລ້າງເຫື່ອ ແລະ ຂີ້ຝຸ່ນ ຈຶ່ງມີຫຼາຍປະເພດ.',
    },
    when: {
      ko: '저녁엔 메이크업이나 선크림을 했다면 ‘이중 세안’(1차 오일·밤 → 2차 폼)이 도움이 돼요. 아침엔 물이나 순한 세안제로 가볍게 씻어요.',
      en: 'At night, if you wore makeup or sunscreen, a “double cleanse” (oil or balm first, then foam) helps. In the morning, a light wash with water or a gentle cleanser is enough.',
      lo: 'ຕອນແລງ ຖ້າແຕ່ງໜ້າ ຫຼື ທາຄຣີມກັນແດດ ການລ້າງໜ້າສອງຮອບ (ອອຍ ຫຼື ບາມກ່ອນ ແລ້ວຈຶ່ງໂຟມ) ຊ່ວຍໄດ້. ຕອນເຊົ້າ ລ້າງເບົາໆດ້ວຍນ້ຳ ຫຼື ໂຟມອ່ອນໆກໍພໍ.',
    },
    laoTip: {
      ko: '덥고 땀이 많아도 하루 두 번 세안이면 대개 충분해요. 너무 자주, 너무 뜨거운 물로 씻으면 오히려 당기고 건조해질 수 있어요. 미지근한 물을 쓰세요.',
      en: 'Even in hot, sweaty weather, washing twice a day is usually enough. Washing too often or with very hot water can leave skin tight and dry, so use lukewarm water.',
      lo: 'ເຖິງອາກາດຮ້ອນ ແລະ ອອກເຫື່ອຫຼາຍ ລ້າງໜ້າມື້ລະສອງເທື່ອກໍມັກພຽງພໍ. ລ້າງເລື້ອຍເກີນ ຫຼື ໃຊ້ນ້ຳຮ້ອນຫຼາຍ ອາດເຮັດໃຫ້ຜິວຕຶງ ແລະ ແຫ້ງ. ໃຊ້ນ້ຳອຸ່ນໆ.',
    },
  },
  {
    category: '바디케어',
    icon: '🧴',
    what: {
      ko: '바디워시, 바디로션·크림·오일, 바디 스크럽처럼 몸 피부를 위한 제품이에요.',
      en: 'Products for the skin on your body: body wash, body lotion, cream or oil, and body scrubs.',
      lo: 'ຜະລິດຕະພັນສຳລັບຜິວກາຍ: ສະບູອາບນ້ຳ, ໂລຊັນ, ຄຣີມ ຫຼື ນ້ຳມັນທາຜິວ ແລະ ສະຄຣັບຂັດຜິວ.',
    },
    why: {
      ko: '몸은 얼굴보다 피부가 두껍고 면적이 넓어요. 그래서 넓게 잘 펴지고 빨리 스며드는 제형이 따로 만들어져요.',
      en: 'Body skin is thicker than facial skin and covers a much larger area, so body products are made to spread easily and absorb quickly.',
      lo: 'ຜິວກາຍໜາກວ່າຜິວໜ້າ ແລະ ມີພື້ນທີ່ກວ້າງກວ່າຫຼາຍ ຈຶ່ງເຮັດໃຫ້ທາງ່າຍ ແລະ ຊຶມໄວ.',
    },
    when: {
      ko: '샤워 후 물기가 살짝 남아 있을 때 로션을 바르면 촉촉함을 지키는 데 도움이 돼요. 스크럽은 주 1~2회 정도면 충분해요.',
      en: 'Applying lotion while skin is still slightly damp after a shower helps keep it moist. Scrubs once or twice a week are plenty.',
      lo: 'ທາໂລຊັນຫຼັງອາບນ້ຳ ຕອນຜິວຍັງຊຸ່ມໜ້ອຍໜຶ່ງ ຊ່ວຍໃຫ້ຜິວຊຸ່ມຊື່ນ. ສະຄຣັບອາທິດລະ 1–2 ເທື່ອກໍພຽງພໍ.',
    },
    laoTip: {
      ko: '더운 날엔 가벼운 젤·로션, 건조한 11~2월엔 정강이와 팔꿈치에 크림을 발라 보세요. 반팔·반바지를 입을 땐 팔다리에도 선크림을 발라요.',
      en: 'Use light gels or lotions on hot days, and cream on shins and elbows in the dry season (November–February). When wearing short sleeves or shorts, put sunscreen on your arms and legs too.',
      lo: 'ມື້ຮ້ອນໃຊ້ເຈວ ຫຼື ໂລຊັນບາງໆ, ລະດູແລ້ງ (ພະຈິກ–ກຸມພາ) ທາຄຣີມທີ່ແຂ້ງ ແລະ ສອກ. ເວລານຸ່ງເສື້ອແຂນສັ້ນ ຫຼື ໂສ້ງຂາສັ້ນ ໃຫ້ທາຄຣີມກັນແດດທີ່ແຂນ ແລະ ຂານຳ.',
    },
  },
  {
    category: '마스크팩',
    icon: '🎭',
    what: {
      ko: '에센스를 듬뿍 머금은 시트 마스크, 바르고 씻어내는 워시오프 마스크, 바르고 자는 슬리핑 마스크 등이 있어요.',
      en: 'Sheet masks soaked in essence, wash-off masks you rinse away, and sleeping masks you leave on overnight.',
      lo: 'ມີແຜ່ນມາສ໌ກທີ່ຊຸ່ມດ້ວຍເອສເຊັນ, ມາສ໌ກທີ່ທາແລ້ວລ້າງອອກ ແລະ ສະລີບປິ້ງມາສ໌ກທີ່ທາໄວ້ຂ້າມຄືນ.',
    },
    why: {
      ko: '일정 시간 얼굴을 덮어서 수분과 성분을 ‘집중해서’ 주는 스페셜 케어예요. 매일 하는 기본 루틴과는 따로예요.',
      en: 'A special-care step that covers the face for a set time to give a concentrated boost of moisture. It is separate from your everyday routine.',
      lo: 'ເປັນການບຳລຸງພິເສດທີ່ປົກຄຸມໜ້າໄວ້ໄລຍະໜຶ່ງ ເພື່ອໃຫ້ຄວາມຊຸ່ມຊື່ນແບບເຂັ້ມຂຸ້ນ. ແຍກຈາກຂັ້ນຕອນປະຈຳວັນ.',
    },
    when: {
      ko: '세안과 토너 후, 제품에 적힌 시간(보통 10~20분)만큼 붙여요. 떼어낸 뒤 남은 에센스를 두드리고 크림으로 마무리해요. 주 1~3회나 피부가 건조할 때 좋아요.',
      en: 'After cleansing and toner, leave it on for the time on the pack (often 10–20 minutes). Pat in the leftover essence, then finish with cream. Once to three times a week, or when skin feels dry.',
      lo: 'ຫຼັງລ້າງໜ້າ ແລະ ທາໂທນເນີ ແປະໄວ້ຕາມເວລາທີ່ຂຽນໃນຊອງ (ມັກແມ່ນ 10–20 ນາທີ). ແກະອອກແລ້ວຕົບເອສເຊັນທີ່ເຫຼືອໃຫ້ຊຶມ ແລ້ວທາຄຣີມ. ອາທິດລະ 1–3 ເທື່ອ ຫຼື ເວລາຜິວແຫ້ງ.',
    },
    laoTip: {
      ko: '햇볕을 많이 쬔 날엔 냉장고에 넣어 둔 시트 마스크가 시원하게 느껴져요(냉동은 피하세요). 시트가 바싹 마를 때까지 두지 말고 적힌 시간을 지켜요.',
      en: 'After a day in the sun, a sheet mask kept in the fridge feels refreshing (don’t freeze it). Don’t leave it on until it dries out — stick to the time on the pack.',
      lo: 'ຫຼັງມື້ທີ່ຖືກແດດຫຼາຍ ແຜ່ນມາສ໌ກທີ່ແຊ່ຕູ້ເຢັນຈະເຢັນສະບາຍ (ຢ່າແຊ່ແຂງ). ຢ່າແປະໄວ້ຈົນແຜ່ນແຫ້ງ ໃຫ້ແປະຕາມເວລາທີ່ຂຽນໄວ້.',
    },
  },
  {
    category: '뷰티소품',
    icon: '🪞',
    what: {
      ko: '퍼프, 스펀지, 메이크업 브러시, 화장솜, 헤어밴드, 괄사(얼굴 마사지 도구) 같은 도구예요.',
      en: 'Tools such as puffs, sponges, makeup brushes, cotton pads, headbands and gua sha (a facial massage tool).',
      lo: 'ອຸປະກອນເຊັ່ນ ພັບ, ຟອງນ້ຳແຕ່ງໜ້າ, ແປງແຕ່ງໜ້າ, ສຳລີ, ຜ້າຄາດຜົມ ແລະ ກວາຊາ (ອຸປະກອນນວດໜ້າ).',
    },
    why: {
      ko: '같은 제품이라도 어떤 도구로 바르느냐에 따라 양과 밀착감이 달라져요. 깨끗한 도구가 깨끗한 피부의 시작이에요.',
      en: 'The same product goes on differently depending on the tool you use. Clean tools are the start of clean skin.',
      lo: 'ຜະລິດຕະພັນດຽວກັນ ແຕ່ທາດ້ວຍອຸປະກອນຕ່າງກັນ ຜົນກໍຕ່າງກັນ. ອຸປະກອນສະອາດ ແມ່ນຈຸດເລີ່ມຕົ້ນຂອງຜິວສະອາດ.',
    },
    when: {
      ko: '스킨케어나 메이크업을 할 때 써요. 퍼프·스펀지·브러시는 일주일에 한 번 정도 씻어 주는 것이 좋아요.',
      en: 'Used during skincare and makeup. Wash puffs, sponges and brushes about once a week.',
      lo: 'ໃຊ້ເວລາບຳລຸງຜິວ ແລະ ແຕ່ງໜ້າ. ຄວນລ້າງພັບ, ຟອງນ້ຳ ແລະ ແປງ ປະມານອາທິດລະເທື່ອ.',
    },
    laoTip: {
      ko: '습한 날씨엔 젖은 퍼프와 스펀지에 세균과 곰팡이가 생기기 쉬워요. 씻은 뒤 바람이 잘 통하는 곳에서 완전히 말리고, 낡으면 바꿔 주세요.',
      en: 'In humid weather, damp puffs and sponges easily grow bacteria and mould. After washing, dry them fully somewhere airy, and replace them when worn.',
      lo: 'ອາກາດຊຸ່ມ ພັບ ແລະ ຟອງນ້ຳທີ່ປຽກ ເກີດເຊື້ອແບັກທີເຣຍ ແລະ ເຊື້ອລາໄດ້ງ່າຍ. ລ້າງແລ້ວຕາກໃຫ້ແຫ້ງສະນິດໃນບ່ອນລົມຖ່າຍເທ ແລະ ປ່ຽນໃໝ່ເມື່ອເກົ່າ.',
    },
  },
  {
    category: '기프트세트',
    icon: '🎁',
    what: {
      ko: '여러 제품을 한 상자에 담은 세트예요. 토너+크림 세트, 같은 라인 세트, 미니 사이즈 세트 등이 있어요.',
      en: 'Several products packed together in one box — a toner-and-cream set, a set from one product line, or a set of minis.',
      lo: 'ຊຸດທີ່ມີຜະລິດຕະພັນຫຼາຍຢ່າງໃນກ່ອງດຽວ ເຊັ່ນ ຊຸດໂທນເນີ ແລະ ຄຣີມ, ຊຸດຈາກລຸ້ນດຽວກັນ ຫຼື ຊຸດຂະໜາດນ້ອຍ.',
    },
    why: {
      ko: '같은 라인 제품을 함께 써 보거나, 선물하기 좋게 구성한 거예요. 작은 용량으로 먼저 시험해 보기에도 좋아요.',
      en: 'Made for trying products from one line together, or for giving as a gift. They are also a good way to test small sizes first.',
      lo: 'ຈັດມາເພື່ອລອງໃຊ້ຜະລິດຕະພັນລຸ້ນດຽວກັນຮ່ວມກັນ ຫຼື ເພື່ອເປັນຂອງຂວັນ. ຍັງເໝາະສຳລັບລອງຂະໜາດນ້ອຍກ່ອນ.',
    },
    when: {
      ko: '생일, 명절, 감사 선물로 좋아요. 처음 써 보는 라인을 시험해 볼 때도 좋아요.',
      en: 'Good for birthdays, holidays and thank-you gifts, or when you want to try a new line.',
      lo: 'ເໝາະເປັນຂອງຂວັນວັນເກີດ, ບຸນປີໃໝ່ ຫຼື ຂອບໃຈ ແລະ ເວລາຢາກລອງລຸ້ນໃໝ່.',
    },
    laoTip: {
      ko: '선물하기 전에 받는 사람의 피부 타입(지성·건성 등)을 먼저 물어보세요. 더운 차 안에 오래 두면 내용물이 변할 수 있으니 서늘한 곳에 보관해요.',
      en: 'Before giving a set, ask about the person’s skin type (oily, dry and so on). Don’t leave it in a hot car — store it somewhere cool so the contents don’t change.',
      lo: 'ກ່ອນໃຫ້ ລອງຖາມປະເພດຜິວຂອງຜູ້ຮັບກ່ອນ (ຜິວມັນ, ຜິວແຫ້ງ ແລະ ອື່ນໆ). ຢ່າປະໄວ້ໃນລົດທີ່ຮ້ອນດົນ ເກັບໄວ້ບ່ອນເຢັນ ເພື່ອບໍ່ໃຫ້ເນື້ອໃນປ່ຽນ.',
    },
  },
  {
    category: '토너',
    icon: '💦',
    what: {
      ko: '세안 후 가장 먼저 바르는 물처럼 묽은 제품이에요. 한국에서는 ‘스킨’이라고도 부르고, 화장솜 패드 형태도 있어요.',
      en: 'The watery product you apply first after cleansing. In Korea it is also called “skin”, and it also comes as soaked pads.',
      lo: 'ຜະລິດຕະພັນທີ່ບາງຄືນ້ຳ ທາເປັນອັນດັບທຳອິດຫຼັງລ້າງໜ້າ. ຢູ່ເກົາຫຼີເອີ້ນວ່າ “ສະກິນ” ແລະ ມີແບບແຜ່ນສຳລີຊຸບໄວ້ນຳ.',
    },
    why: {
      ko: '세안 후 피부를 촉촉하게 정돈하고, 다음 제품이 잘 펴지도록 바탕을 만들어 줘요. 각질 제거 성분이 든 ‘닦아내는 토너’도 있는데, 매일 과하게 쓰지 않는 게 좋아요.',
      en: 'It refreshes and hydrates skin after cleansing and makes the next products spread more easily. Some “wipe-off” toners contain exfoliating ingredients — don’t overuse them every day.',
      lo: 'ຊ່ວຍໃຫ້ຜິວສົດຊື່ນ ແລະ ຊຸ່ມຫຼັງລ້າງໜ້າ ແລະ ເຮັດໃຫ້ຜະລິດຕະພັນຕໍ່ໄປທາໄດ້ງ່າຍ. ໂທນເນີແບບເຊັດບາງຕົວມີສ່ວນປະສົມຜັດເຊວຜິວ ບໍ່ຄວນໃຊ້ຫຼາຍເກີນທຸກມື້.',
    },
    when: {
      ko: '아침·저녁 세안 직후에 발라요. 손바닥으로 가볍게 두드리거나 화장솜으로 피부결을 따라 닦아요.',
      en: 'Morning and night, right after cleansing. Pat it in with your palms or sweep it on with a cotton pad.',
      lo: 'ຕອນເຊົ້າ ແລະ ຕອນແລງ ທັນທີຫຼັງລ້າງໜ້າ. ຕົບເບົາໆດ້ວຍຝາມື ຫຼື ເຊັດດ້ວຍສຳລີ.',
    },
    laoTip: {
      ko: '습한 계절에 지성 피부라면 토너와 가벼운 크림만으로도 충분할 수 있어요. 냉장고에 둔 토너를 화장솜에 적셔 잠깐 올려 두면 시원해요.',
      en: 'For oily skin in the humid season, toner plus a light cream may be enough. Soaking a cotton pad in fridge-cool toner and resting it on the skin for a moment feels refreshing.',
      lo: 'ຖ້າເປັນຜິວມັນໃນລະດູຊຸ່ມ ໂທນເນີ ກັບ ຄຣີມບາງໆ ອາດພຽງພໍ. ເອົາສຳລີຊຸບໂທນເນີທີ່ແຊ່ຕູ້ເຢັນ ວາງໄວ້ເທິງຜິວແປບໜຶ່ງ ຈະເຢັນສະບາຍ.',
    },
  },
  {
    category: '메이크업',
    icon: '💄',
    what: {
      ko: '쿠션·파운데이션, 컨실러, 파우더, 아이섀도, 아이라이너, 블러셔, 립스틱처럼 얼굴을 표현하는 제품이에요.',
      en: 'Products that express your look: cushions and foundations, concealer, powder, eyeshadow, eyeliner, blush and lipstick.',
      lo: 'ຜະລິດຕະພັນແຕ່ງໜ້າ: ຄຸດຊັນ ແລະ ຮອງພື້ນ, ຄອນຊີລເລີ, ແປ້ງ, ອາຍແຊໂດ, ອາຍລາຍເນີ, ບລັດອອນ ແລະ ລິບສະຕິກ.',
    },
    why: {
      ko: '스킨케어가 피부를 ‘가꾸는’ 일이라면, 메이크업은 ‘보여주는’ 일이에요. 피부톤을 정리하고 나만의 개성을 표현해요.',
      en: 'Skincare looks after the skin; makeup is about how you present yourself — evening out tone and showing your personal style.',
      lo: 'ການບຳລຸງຜິວແມ່ນເບິ່ງແຍງຜິວ ສ່ວນເມກອັບແມ່ນການສະແດງອອກ — ປັບສີຜິວໃຫ້ສະໝ່ຳສະເໝີ ແລະ ສະແດງຄວາມເປັນຕົວເອງ.',
    },
    when: {
      ko: '스킨케어와 선크림을 모두 바른 뒤에 해요. 밤에는 반드시 클렌징으로 깨끗이 지워요.',
      en: 'After all skincare and sunscreen. At night, always remove it completely with a cleanser.',
      lo: 'ແຕ່ງໜ້າຫຼັງທາບຳລຸງຜິວ ແລະ ຄຣີມກັນແດດແລ້ວ. ຕອນກາງຄືນ ຕ້ອງລ້າງອອກໃຫ້ໝົດດ້ວຍຄລີນຊິ່ງທຸກເທື່ອ.',
    },
    laoTip: {
      ko: '땀이 많은 날엔 얇게 여러 번 바르고 파우더로 마무리하면 덜 무너져요. 쿠션에 SPF가 있어도 보통 얇게 바르기 때문에 선크림을 대신하기는 어려워요.',
      en: 'On sweaty days, thin layers finished with powder last longer. Even if a cushion has SPF, it is usually applied too thinly to replace sunscreen.',
      lo: 'ມື້ທີ່ອອກເຫື່ອຫຼາຍ ທາບາງໆຫຼາຍຊັ້ນ ແລ້ວປິດດ້ວຍແປ້ງ ຈະຕິດທົນກວ່າ. ເຖິງຄຸດຊັນຈະມີ SPF ແຕ່ມັກທາບາງເກີນ ຈຶ່ງໃຊ້ແທນຄຣີມກັນແດດບໍ່ໄດ້.',
    },
  },
  {
    category: '핸드크림',
    icon: '🤲',
    what: {
      ko: '손을 위한 보습 크림이에요.',
      en: 'A moisturising cream made for hands.',
      lo: 'ຄຣີມບຳລຸງຄວາມຊຸ່ມຊື່ນສຳລັບມື.',
    },
    why: {
      ko: '손은 자주 씻고 손 소독제를 써서 쉽게 건조해져요. 핸드크림은 끈적이지 않고 빨리 스며들도록 만들어서, 바른 뒤에도 일하거나 휴대폰을 쓰기 편해요.',
      en: 'Hands dry out from frequent washing and hand sanitiser. Hand creams are made to absorb fast without stickiness, so you can keep working or use your phone right after.',
      lo: 'ມືແຫ້ງງ່າຍເພາະລ້າງເລື້ອຍໆ ແລະ ໃຊ້ເຈວລ້າງມື. ຄຣີມທາມືເຮັດໃຫ້ຊຶມໄວ ບໍ່ໜຽວ ທາແລ້ວກໍເຮັດວຽກ ຫຼື ໃຊ້ໂທລະສັບໄດ້ເລີຍ.',
    },
    when: {
      ko: '손을 씻은 뒤마다, 그리고 자기 전에 넉넉히 발라요.',
      en: 'After each hand wash, and generously before bed.',
      lo: 'ຫຼັງລ້າງມືທຸກເທື່ອ ແລະ ທາຫຼາຍໆກ່ອນນອນ.',
    },
    laoTip: {
      ko: '손등은 운전하거나 오토바이를 탈 때 햇빛을 많이 받아요. 낮에는 손등에 선크림도 발라 주세요. 에어컨 사무실에서 일한다면 책상 위에 하나 두세요.',
      en: 'The backs of your hands get a lot of sun when driving or riding a motorbike, so put sunscreen on them during the day. If you work in an air-conditioned office, keep a tube on your desk.',
      lo: 'ຫຼັງມືຖືກແດດຫຼາຍເວລາຂັບລົດ ຫຼື ຂີ່ລົດຈັກ ຕອນກາງເວັນໃຫ້ທາຄຣີມກັນແດດທີ່ຫຼັງມືນຳ. ຖ້າເຮັດວຽກໃນຫ້ອງແອ ວາງໄວ້ໜຶ່ງຫຼອດເທິງໂຕະ.',
    },
  },
  {
    category: '아이케어',
    icon: '👁️',
    what: {
      ko: '눈가 피부를 위한 아이크림, 아이세럼, 아이패치 같은 제품이에요.',
      en: 'Eye creams, eye serums and eye patches made for the skin around the eyes.',
      lo: 'ຄຣີມຮອບຕາ, ເຊຣັ່ມຮອບຕາ ແລະ ແຜ່ນແປະໃຕ້ຕາ ສຳລັບຜິວຮອບດວງຕາ.',
    },
    why: {
      ko: '눈가 피부는 얼굴의 다른 곳보다 얇고 많이 움직이며 피지가 적어서 건조해지기 쉬워요. 그래서 자극을 줄이고 눈가에 맞춘 제품이 따로 있어요.',
      en: 'The skin around the eyes is thinner than elsewhere on the face, moves a lot and has little oil, so it dries easily. Eye products are made gentler to suit it.',
      lo: 'ຜິວຮອບດວງຕາບາງກວ່າສ່ວນອື່ນຂອງໜ້າ, ເຄື່ອນໄຫວຫຼາຍ ແລະ ມີນ້ຳມັນໜ້ອຍ ຈຶ່ງແຫ້ງງ່າຍ. ຜະລິດຕະພັນຮອບຕາຈຶ່ງເຮັດໃຫ້ອ່ອນໂຍນກວ່າ.',
    },
    when: {
      ko: '세럼 다음, 크림 전에 발라요. 쌀알만큼 덜어 약지로 톡톡 두드려요. 눈 안에 들어가지 않게 조심하세요.',
      en: 'After serum and before cream. Take a rice-grain-sized amount and pat it in with your ring finger. Keep it out of your eyes.',
      lo: 'ຫຼັງເຊຣັ່ມ ແລະ ກ່ອນຄຣີມ. ເອົາປະມານເມັດເຂົ້າໜຶ່ງ ແລ້ວຕົບເບົາໆດ້ວຍນິ້ວນາງ. ລະວັງຢ່າໃຫ້ເຂົ້າຕາ.',
    },
    laoTip: {
      ko: '강한 햇빛에 눈을 자주 찡그리게 돼요. 선글라스와 챙 넓은 모자를 함께 쓰면 눈가를 지키는 데 도움이 돼요.',
      en: 'Strong sun makes you squint a lot. Sunglasses and a wide-brimmed hat help protect the eye area.',
      lo: 'ແດດແຮງເຮັດໃຫ້ຫຍີ່ຕາເລື້ອຍໆ. ໃສ່ແວ່ນຕາກັນແດດ ແລະ ໝວກປີກກວ້າງ ຊ່ວຍປົກປ້ອງຜິວຮອບຕາໄດ້.',
    },
  },
  {
    category: '립케어',
    icon: '👄',
    what: {
      ko: '립밤, 립 마스크, 립 스크럽, 색이 살짝 있는 컬러 립밤 같은 입술 전용 제품이에요.',
      en: 'Products just for lips: lip balm, lip masks, lip scrubs and tinted lip balms.',
      lo: 'ຜະລິດຕະພັນສະເພາະສົບ: ລິບບາມ, ລິບມາສ໌ກ, ລິບສະຄຣັບ ແລະ ລິບບາມມີສີ.',
    },
    why: {
      ko: '입술은 피지(기름)가 거의 나오지 않아 스스로 촉촉함을 지키기 어렵고 쉽게 갈라져요. 그래서 입술을 덮어 주는 제품이 따로 필요해요.',
      en: 'Lips make almost no oil of their own, so they struggle to stay moist and crack easily. A separate product that coats them helps.',
      lo: 'ສົບແທບບໍ່ມີນ້ຳມັນຂອງຕົວເອງ ຈຶ່ງເກັບຄວາມຊຸ່ມໄວ້ໄດ້ຍາກ ແລະ ແຕກງ່າຍ. ຈຶ່ງຕ້ອງມີຜະລິດຕະພັນເຄືອບສົບແຍກຕ່າງຫາກ.',
    },
    when: {
      ko: '수시로 바르고, 립스틱 전에 얇게 바탕으로, 자기 전에는 도톰하게 발라요.',
      en: 'Any time during the day, as a thin base before lipstick, and in a thicker layer before bed.',
      lo: 'ທາໄດ້ຕະຫຼອດມື້, ທາບາງໆກ່ອນລິບສະຕິກ ແລະ ທາໜາໆກ່ອນນອນ.',
    },
    laoTip: {
      ko: '입술도 햇볕에 탈 수 있어서 낮에는 SPF가 있는 립밤이 도움이 될 수 있어요. 건조한 11~2월엔 더 자주 바르고, 입술을 핥지 마세요.',
      en: 'Lips can burn in the sun too, so a lip balm with SPF may help during the day. In the dry season (November–February) apply more often, and try not to lick your lips.',
      lo: 'ສົບກໍໄໝ້ແດດໄດ້ ຕອນກາງເວັນລິບບາມທີ່ມີ SPF ອາດຊ່ວຍໄດ້. ລະດູແລ້ງ (ພະຈິກ–ກຸມພາ) ທາເລື້ອຍຂຶ້ນ ແລະ ຢ່າເລຍສົບ.',
    },
  },
  {
    category: '향수',
    icon: '🌸',
    what: {
      ko: '향료를 알코올 등에 녹인 제품이에요. 향의 진하기에 따라 퍼퓸 > 오 드 퍼퓸 > 오 드 뚜왈렛 > 오 드 코롱 순으로 나뉘어요.',
      en: 'Fragrance oils dissolved mainly in alcohol. By strength they run parfum > eau de parfum > eau de toilette > eau de cologne.',
      lo: 'ນ້ຳຫອມທີ່ລະລາຍໃນແອວກໍຮໍເປັນສ່ວນໃຫຍ່. ຕາມຄວາມເຂັ້ມຂອງກິ່ນ: ພາຟູມ > ໂອ ເດີ ພາຟູມ > ໂອ ເດີ ທົວເລັດ > ໂອ ເດີ ໂຄໂລນ.',
    },
    why: {
      ko: '피부를 가꾸는 제품이 아니라 기분과 개성을 위한 제품이에요. 그래서 스킨케어와는 다른 카테고리예요.',
      en: 'It isn’t for skin care — it is about mood and personality, which is why it is its own category.',
      lo: 'ບໍ່ແມ່ນສຳລັບບຳລຸງຜິວ ແຕ່ເພື່ອອາລົມ ແລະ ຄວາມເປັນຕົວເອງ ຈຶ່ງເປັນໝວດແຍກຕ່າງຫາກ.',
    },
    when: {
      ko: '샤워하고 보습한 뒤, 손목·목 뒤·귀 뒤처럼 맥박이 느껴지는 곳에 1~2번 뿌려요. 뿌린 뒤 손목을 비비지 않는 것이 좋아요.',
      en: 'After showering and moisturising, spray once or twice on pulse points such as wrists, the back of the neck or behind the ears. Try not to rub your wrists together afterwards.',
      lo: 'ຫຼັງອາບນ້ຳ ແລະ ທາໂລຊັນ ສີດ 1–2 ເທື່ອທີ່ຈຸດຊີບພະຈອນ ເຊັ່ນ ຂໍ້ມື, ຫຼັງຄໍ ຫຼື ຫຼັງຫູ. ສີດແລ້ວບໍ່ຄວນຖູຂໍ້ມືເຂົ້າກັນ.',
    },
    laoTip: {
      ko: '더운 날엔 향이 더 강하게 퍼지니 양을 줄이고 상큼한 시트러스나 가벼운 플로럴 향을 골라 보세요. 일부 향 성분은 햇빛을 받으면 피부에 얼룩을 남길 수 있어서, 햇볕 아래에선 옷이나 머리끝에 뿌리는 편이 좋아요. 향수병은 햇빛과 열을 피해 보관하세요.',
      en: 'Scent spreads more strongly in the heat, so use less and try fresh citrus or light floral scents. Some fragrance ingredients can leave marks on skin in sunlight, so outdoors spray clothes or hair ends instead. Keep bottles away from sun and heat.',
      lo: 'ອາກາດຮ້ອນເຮັດໃຫ້ກິ່ນແຮງຂຶ້ນ ໃຫ້ສີດໜ້ອຍລົງ ແລະ ລອງກິ່ນໝາກນາວ ຫຼື ກິ່ນດອກໄມ້ເບົາໆ. ສ່ວນປະສົມກິ່ນບາງຢ່າງອາດເຮັດໃຫ້ຜິວເປັນຮອຍເມື່ອຖືກແດດ ເວລາຢູ່ກາງແຈ້ງຈຶ່ງສີດໃສ່ເສື້ອ ຫຼື ປາຍຜົມແທນ. ເກັບຂວດນ້ຳຫອມໃຫ້ໄກຈາກແດດ ແລະ ຄວາມຮ້ອນ.',
    },
  },
];

/* ------------------------------------------------------------------------------------------ */
/* Basic routine order                                                                          */
/* ------------------------------------------------------------------------------------------ */

export const ROUTINE: readonly RoutineStep[] = [
  {
    step: 1,
    category: '클렌징',
    am: true,
    pm: true,
    note: {
      ko: '아침엔 물이나 순한 세안제로 가볍게. 저녁엔 선크림·메이크업까지 깨끗이(필요하면 이중 세안).',
      en: 'Mornings: a light wash with water or a gentle cleanser. Evenings: remove sunscreen and makeup completely (double cleanse if needed).',
      lo: 'ຕອນເຊົ້າ: ລ້າງເບົາໆດ້ວຍນ້ຳ ຫຼື ໂຟມອ່ອນໆ. ຕອນແລງ: ລ້າງຄຣີມກັນແດດ ແລະ ເມກອັບອອກໃຫ້ໝົດ (ລ້າງສອງຮອບຖ້າຈຳເປັນ).',
    },
  },
  {
    step: 2,
    category: '토너',
    am: true,
    pm: true,
    note: {
      ko: '세안 직후, 피부를 촉촉하게 정돈해요.',
      en: 'Right after cleansing, to refresh and hydrate.',
      lo: 'ທັນທີຫຼັງລ້າງໜ້າ ເພື່ອໃຫ້ຜິວສົດຊື່ນ ແລະ ຊຸ່ມ.',
    },
  },
  {
    step: 3,
    category: '에센스·세럼·앰플',
    am: true,
    pm: true,
    note: {
      ko: '내 피부 고민에 맞는 것 하나부터. 여러 개라면 묽은 것부터.',
      en: 'Start with one that suits your concern. If you use several, thinnest first.',
      lo: 'ເລີ່ມຈາກໜຶ່ງຕົວທີ່ເໝາະກັບບັນຫາຜິວ. ຖ້າໃຊ້ຫຼາຍຕົວ ທາຕົວບາງກ່ອນ.',
    },
  },
  {
    step: 4,
    category: '아이케어',
    am: true,
    pm: true,
    note: {
      ko: '선택 단계예요. 쌀알만큼, 약지로 톡톡.',
      en: 'Optional. A rice-grain amount, patted in with the ring finger.',
      lo: 'ບໍ່ບັງຄັບ. ປະມານເມັດເຂົ້າໜຶ່ງ ຕົບເບົາໆດ້ວຍນິ້ວນາງ.',
    },
  },
  {
    step: 5,
    category: '크림',
    am: true,
    pm: true,
    note: {
      ko: '수분을 지켜 주는 뚜껑. 덥고 습한 날엔 가벼운 젤 타입도 좋아요.',
      en: 'The lid that keeps moisture in. On hot, humid days a light gel type works well.',
      lo: 'ຝາປິດທີ່ກັກຄວາມຊຸ່ມຊື່ນ. ມື້ຮ້ອນ ແລະ ຊຸ່ມ ເຈວຄຣີມບາງໆກໍດີ.',
    },
  },
  {
    step: 6,
    category: '선케어',
    am: true,
    pm: false,
    note: {
      ko: '아침에만, 스킨케어의 마지막 단계. 얼굴엔 두 손가락 길이만큼, 밖에서는 약 2시간마다 덧발라요.',
      en: 'Mornings only, as the last skincare step. Two finger-lengths for the face; outdoors, reapply about every 2 hours.',
      lo: 'ສະເພາະຕອນເຊົ້າ ເປັນຂັ້ນຕອນສຸດທ້າຍ. ໜ້າໃຊ້ປະມານສອງຄວາມຍາວນິ້ວ; ຢູ່ກາງແຈ້ງ ທາຊ້ຳປະມານທຸກໆ 2 ຊົ່ວໂມງ.',
    },
  },
];

/* ------------------------------------------------------------------------------------------ */
/* Sun care                                                                                     */
/* ------------------------------------------------------------------------------------------ */

export const SUN_CARE: readonly GuidePoint[] = [
  {
    icon: '🔢',
    title: {
      ko: 'SPF는 무슨 뜻일까요?',
      en: 'What does SPF mean?',
      lo: 'SPF ໝາຍຄວາມວ່າແນວໃດ?',
    },
    body: {
      ko: 'SPF는 피부를 붉게 태우는 자외선 B(UVB)를 막는 정도예요. SPF 30은 UVB의 약 97%, SPF 50은 약 98%를 막아서, 숫자가 두 배라고 보호가 두 배인 건 아니에요. 매일 쓰기엔 SPF 30 이상이 흔히 권장돼요.',
      en: 'SPF shows how well a product blocks UVB, the rays that cause sunburn. SPF 30 blocks about 97% of UVB and SPF 50 about 98%, so double the number is not double the protection. SPF 30 or higher is commonly recommended for daily use.',
      lo: 'SPF ບອກວ່າກັນລັງສີ UVB (ລັງສີທີ່ເຮັດໃຫ້ຜິວໄໝ້ແດງ) ໄດ້ຫຼາຍປານໃດ. SPF 30 ກັນ UVB ໄດ້ປະມານ 97%, SPF 50 ປະມານ 98% ຕົວເລກສອງເທົ່າບໍ່ໄດ້ໝາຍຄວາມວ່າປ້ອງກັນສອງເທົ່າ. ການໃຊ້ປະຈຳວັນມັກແນະນຳ SPF 30 ຂຶ້ນໄປ.',
    },
  },
  {
    icon: '➕',
    title: {
      ko: 'PA+는 무슨 뜻일까요?',
      en: 'What does PA+ mean?',
      lo: 'PA+ ໝາຍຄວາມວ່າແນວໃດ?',
    },
    body: {
      ko: 'PA는 피부 깊이 들어와 피부를 검게 그을리게 하고 노화와 관련된 자외선 A(UVA)를 막는 정도예요. PA+부터 PA++++까지 있고, +가 많을수록 차단이 강해요. 일본에서 시작된 표시이고 한국 선크림에도 쓰여요.',
      en: 'PA shows protection against UVA, the rays that go deeper into skin, cause tanning and are linked to skin ageing. It runs from PA+ to PA++++ — more plus signs mean stronger protection. The system started in Japan and is used on Korean sunscreens too.',
      lo: 'PA ບອກການປ້ອງກັນລັງສີ UVA ເຊິ່ງເຂົ້າເລິກໃນຜິວ ເຮັດໃຫ້ຜິວຄ້ຳ ແລະ ກ່ຽວຂ້ອງກັບຜິວແກ່ກ່ອນໄວ. ມີຕັ້ງແຕ່ PA+ ຫາ PA++++ — ເຄື່ອງໝາຍ + ຫຼາຍ ປ້ອງກັນໄດ້ແຮງຂຶ້ນ. ລະບົບນີ້ເລີ່ມຈາກຍີ່ປຸ່ນ ແລະ ໃຊ້ໃນຄຣີມກັນແດດເກົາຫຼີນຳ.',
    },
  },
  {
    icon: '🤞',
    title: {
      ko: '얼마나 발라야 할까요?',
      en: 'How much should you use?',
      lo: 'ຄວນທາຫຼາຍປານໃດ?',
    },
    body: {
      ko: 'SPF는 피부 1㎠에 2mg을 바른 상태로 시험해요. 얼굴 전체엔 약 1/4 티스푼, 즉 검지와 중지에 길게 짠 두 줄 정도예요. 이보다 적게 바르면 표시된 만큼 보호받기 어려워요.',
      en: 'SPF is tested at 2 mg of sunscreen per square centimetre of skin. For the whole face, that is about a quarter teaspoon — roughly a line along your index and middle fingers. Use less and you get less protection than the label says.',
      lo: 'SPF ທົດສອບໂດຍທາ 2 ມິນລິກຣາມ ຕໍ່ຜິວ 1 ຕາແມັດເຊັນຕິແມັດ. ໜ້າທັງໝົດໃຊ້ປະມານ 1/4 ບ່ວງກາເຟ ຫຼື ບີບເປັນເສັ້ນຍາວຕາມນິ້ວຊີ້ ແລະ ນິ້ວກາງ. ຖ້າທາໜ້ອຍກວ່ານີ້ ຈະປ້ອງກັນໄດ້ໜ້ອຍກວ່າທີ່ຂຽນໄວ້.',
    },
  },
  {
    icon: '⏰',
    title: {
      ko: '다시 바르기',
      en: 'Reapply',
      lo: 'ທາຊ້ຳ',
    },
    body: {
      ko: '밖에 있다면 약 2시간마다 다시 발라요. 땀을 많이 흘렸거나, 물놀이를 했거나, 수건으로 닦았다면 바로 다시 발라요. ‘워터프루프(내수성)’ 제품도 마찬가지예요.',
      en: 'When outdoors, reapply about every 2 hours — and straight away after heavy sweating, swimming or towelling off. This applies to water-resistant products too.',
      lo: 'ເວລາຢູ່ກາງແຈ້ງ ທາຊ້ຳປະມານທຸກໆ 2 ຊົ່ວໂມງ ແລະ ທາຊ້ຳທັນທີຫຼັງອອກເຫື່ອຫຼາຍ, ລອຍນ້ຳ ຫຼື ເຊັດດ້ວຍຜ້າເຊັດໂຕ. ຄຣີມກັນແດດແບບກັນນ້ຳກໍຄືກັນ.',
    },
  },
  {
    icon: '🪨',
    title: {
      ko: '무기자차와 유기자차',
      en: 'Mineral and chemical filters',
      lo: 'ຕົວກັນແດດແບບແຮ່ທາດ ແລະ ແບບເຄມີ',
    },
    body: {
      ko: '무기자차(미네랄)는 징크옥사이드·티타늄디옥사이드를 써서 피부 위에서 자외선을 막아요. 눈시림이 적다는 사람이 많지만 하얗게 뜰 수 있어요. 유기자차(화학적 필터)는 자외선을 흡수하는 방식으로 가볍고 투명한 편이에요. 둘 다 같은 기준으로 시험해 SPF·PA를 표시해요.',
      en: 'Mineral sunscreens use zinc oxide or titanium dioxide to block UV on the skin’s surface; many people find they sting the eyes less, but they can leave a white cast. Chemical filters absorb UV and tend to feel lighter and look clear. Both are tested the same way for SPF and PA.',
      lo: 'ຄຣີມກັນແດດແບບແຮ່ທາດ ໃຊ້ຊິງອອກໄຊ ຫຼື ໄທທານຽມໄດອອກໄຊ ກັນ UV ຢູ່ເທິງຜິວ ຫຼາຍຄົນວ່າແສບຕາໜ້ອຍກວ່າ ແຕ່ອາດເຮັດໃຫ້ໜ້າຂາວ. ແບບເຄມີ ດູດຊຶມ UV ມັກບາງເບົາ ແລະ ໃສ. ທັງສອງແບບທົດສອບ SPF ແລະ PA ດ້ວຍວິທີດຽວກັນ.',
    },
  },
  {
    icon: '☁️',
    title: {
      ko: '흐린 날, 비 오는 계절에도',
      en: 'Cloudy days and the rainy season too',
      lo: 'ມື້ມີເມກ ແລະ ລະດູຝົນກໍຕ້ອງທາ',
    },
    body: {
      ko: '구름이 있어도 자외선은 상당 부분 통과해요. 라오스의 우기(6~10월)에도, 흐린 날에도 매일 발라 주세요.',
      en: 'A large share of UV passes through clouds. Keep applying sunscreen every day in Laos’ rainy season (June–October) and on overcast days.',
      lo: 'ລັງສີ UV ຜ່ານເມກໄດ້ຫຼາຍ. ລະດູຝົນຂອງລາວ (ມິຖຸນາ–ຕຸລາ) ແລະ ມື້ທີ່ມີເມກ ກໍຄວນທາທຸກມື້.',
    },
  },
  {
    icon: '🏁',
    title: {
      ko: '스킨케어의 마지막 단계',
      en: 'The last skincare step',
      lo: 'ຂັ້ນຕອນສຸດທ້າຍຂອງການບຳລຸງຜິວ',
    },
    body: {
      ko: '선크림은 아침 스킨케어의 맨 마지막, 메이크업 전에 발라요. 외출 15분쯤 전에 바르면 좋아요.',
      en: 'Sunscreen goes on last in your morning skincare, before makeup. Applying it about 15 minutes before you go out is a good habit.',
      lo: 'ຄຣີມກັນແດດທາເປັນອັນສຸດທ້າຍຂອງການບຳລຸງຜິວຕອນເຊົ້າ ກ່ອນແຕ່ງໜ້າ. ທາກ່ອນອອກຈາກເຮືອນປະມານ 15 ນາທີ ເປັນນິໄສທີ່ດີ.',
    },
  },
  {
    icon: '⛱️',
    title: {
      ko: '더 오래 햇볕에 있어도 된다는 뜻은 아니에요',
      en: 'It isn’t a reason to stay in the sun longer',
      lo: 'ບໍ່ໄດ້ໝາຍຄວາມວ່າຢູ່ກາງແດດດົນຂຶ້ນໄດ້',
    },
    body: {
      ko: '선크림은 자외선을 모두 막지는 못해요. 햇볕이 강한 한낮(대략 오전 10시~오후 4시)엔 그늘, 모자, 양산, 긴소매, 선글라스를 함께 써요.',
      en: 'Sunscreen can’t block all UV. In the strongest midday sun (roughly 10 am–4 pm), also use shade, a hat, an umbrella, long sleeves and sunglasses.',
      lo: 'ຄຣີມກັນແດດກັນ UV ໄດ້ບໍ່ໝົດ. ເວລາແດດແຮງຕອນທ່ຽງ (ປະມານ 10 ໂມງເຊົ້າ ຫາ 4 ໂມງແລງ) ໃຫ້ໃຊ້ຮົ່ມ, ໝວກ, ຄັນຮົ່ມ, ເສື້ອແຂນຍາວ ແລະ ແວ່ນຕາກັນແດດນຳ.',
    },
  },
  {
    icon: '🤍',
    title: {
      ko: '백탁(하얗게 뜨는 것)이 싫다면',
      en: 'If white cast bothers you',
      lo: 'ຖ້າບໍ່ມັກໜ້າຂາວວອກ',
    },
    body: {
      ko: '백탁은 선크림이 피부 위에 하얀 막처럼 보이는 거예요. 양을 줄이기보다 두 번에 나눠 얇게 펴 바르거나, 투명한 젤 타입·톤업 타입처럼 내 피부색에 맞는 제품을 골라 보세요.',
      en: 'White cast is when sunscreen shows as a pale film on the skin. Rather than using less, apply it in two thin layers, or choose a clear gel or a tinted type that suits your skin tone.',
      lo: 'ໜ້າຂາວວອກ ແມ່ນເວລາຄຣີມກັນແດດເປັນຊັ້ນສີຂາວເທິງຜິວ. ແທນທີ່ຈະທາໜ້ອຍລົງ ໃຫ້ແບ່ງທາບາງໆສອງຊັ້ນ ຫຼື ເລືອກແບບເຈວໃສ ຫຼື ແບບມີສີທີ່ເຂົ້າກັບສີຜິວ.',
    },
  },
];

/* ------------------------------------------------------------------------------------------ */
/* Anti-ageing and "functional" words                                                           */
/* ------------------------------------------------------------------------------------------ */

export const ANTI_AGING_TERMS: readonly GuidePoint[] = [
  {
    icon: '⏳',
    title: {
      ko: '‘안티에이징’',
      en: '“Anti-ageing”',
      lo: '“ຕ້ານຄວາມແກ່”',
    },
    body: {
      ko: '‘안티에이징’은 법으로 정한 기준이 없는 광고 표현이에요. 나이를 되돌린다는 뜻이 아니라, 대개 보습과 피부결을 가꾸는 제품을 넓게 부르는 말이에요. 노화 관리의 기본은 매일 보습과 선크림이에요.',
      en: '“Anti-ageing” is a marketing phrase with no legal definition. It doesn’t mean turning back the clock — it usually just describes products that moisturise and smooth. The basics of age care are daily moisturiser and sunscreen.',
      lo: '“ຕ້ານຄວາມແກ່” ເປັນຄຳໂຄສະນາ ບໍ່ມີຄວາມໝາຍທາງກົດໝາຍ. ບໍ່ໄດ້ໝາຍຄວາມວ່າເຮັດໃຫ້ອາຍຸຖອຍຫຼັງ ສ່ວນຫຼາຍແມ່ນຜະລິດຕະພັນທີ່ບຳລຸງຄວາມຊຸ່ມ ແລະ ຄວາມລຽບນຽນ. ພື້ນຖານແມ່ນບຳລຸງຄວາມຊຸ່ມຊື່ນ ແລະ ທາຄຣີມກັນແດດທຸກມື້.',
    },
  },
  {
    icon: '〰️',
    title: {
      ko: '‘주름개선’',
      en: '“Wrinkle care”',
      lo: '“ຊ່ວຍເລື່ອງຮອຍຫ່ຽວຍົ່ນ”',
    },
    body: {
      ko: '한국에서 ‘주름개선’ 기능성 표시는 식약처 심사나 보고를 거친 제품만 쓸 수 있어요. 그래도 주름을 없애 준다는 뜻은 아니고, 꾸준히 썼을 때 주름을 개선하는 데 도움이 될 수 있다는 뜻이에요. 사람마다 차이가 있어요.',
      en: 'In Korea, only products reviewed by or notified to the MFDS may carry the “wrinkle improvement” functional label. Even so, it doesn’t mean wrinkles disappear — it means steady use may help improve their look, and results vary from person to person.',
      lo: 'ຢູ່ເກົາຫຼີ ສະເພາະຜະລິດຕະພັນທີ່ຜ່ານການກວດ ຫຼື ແຈ້ງຕໍ່ MFDS ເທົ່ານັ້ນ ທີ່ຂຽນວ່າຟັງຊັນ “ຊ່ວຍເລື່ອງຮອຍຫ່ຽວຍົ່ນ” ໄດ້. ແຕ່ບໍ່ໄດ້ໝາຍຄວາມວ່າຮອຍຈະຫາຍໄປ ພຽງແຕ່ອາດຊ່ວຍໄດ້ເມື່ອໃຊ້ຢ່າງສະໝ່ຳສະເໝີ ແລະ ຜົນຂອງແຕ່ລະຄົນຕ່າງກັນ.',
    },
  },
  {
    icon: '🫧',
    title: {
      ko: '‘탄력’',
      en: '“Firming”',
      lo: '“ຄວາມກະຊັບ”',
    },
    body: {
      ko: '‘탄력’은 한국 기능성화장품 종류에 따로 없는 표현이에요. 대부분 촉촉해지면서 피부가 탱탱하게 ‘느껴지는’ 사용감을 말해요.',
      en: '“Firming” is not one of Korea’s functional-cosmetic categories. It mostly describes the bouncy feel skin has when it is well moisturised.',
      lo: '“ຄວາມກະຊັບ” ບໍ່ແມ່ນໝວດໜຶ່ງຂອງເຄື່ອງສຳອາງຟັງຊັນຂອງເກົາຫຼີ. ສ່ວນຫຼາຍໝາຍເຖິງຄວາມຮູ້ສຶກວ່າຜິວເດັ້ງເມື່ອຜິວຊຸ່ມຊື່ນດີ.',
    },
  },
  {
    icon: '✨',
    title: {
      ko: '‘미백’과 ‘브라이트닝’',
      en: '“Brightening” and “whitening”',
      lo: '“ຜິວກະຈ່າງໃສ” ແລະ “ຜິວຂາວ”',
    },
    body: {
      ko: '한국의 ‘미백’ 기능성은 멜라닌 색소가 쌓이는 것을 줄여 기미·주근깨를 옅게 하는 데 도움을 준다는 뜻이에요. 피부를 표백하거나 타고난 피부색을 바꾼다는 뜻이 아니에요. 어떤 피부색이든 모두 아름다워요.',
      en: 'Korea’s “brightening” functional label means helping reduce the build-up of melanin pigment so dark spots and freckles look lighter. It doesn’t mean bleaching skin or changing your natural skin tone. Every skin tone is beautiful.',
      lo: 'ຟັງຊັນ “ຜິວກະຈ່າງໃສ” ຂອງເກົາຫຼີ ໝາຍເຖິງການຊ່ວຍຫຼຸດການສະສົມຂອງເມັດສີເມລານິນ ເພື່ອໃຫ້ຝ້າ ແລະ ກະເບິ່ງຈາງລົງ. ບໍ່ໄດ້ໝາຍຄວາມວ່າຟອກຜິວ ຫຼື ປ່ຽນສີຜິວທຳມະຊາດ. ຜິວທຸກສີລ້ວນງາມ.',
    },
  },
  {
    icon: '🏛️',
    title: {
      ko: '‘기능성화장품’이란?',
      en: 'What is a “functional cosmetic”?',
      lo: '“ເຄື່ອງສຳອາງຟັງຊັນ” ແມ່ນຫຍັງ?',
    },
    body: {
      ko: '한국 식약처가 효과와 안전 자료를 심사했거나, 정해진 성분과 함량 기준에 맞는다고 보고된 제품이에요. 용기에 ‘기능성화장품’ 문구가 있어요. 처음엔 미백·주름개선·자외선차단 3가지였고, 2017년부터 염모, 탈모 증상 완화, 여드름성 피부 완화 등으로 넓어졌어요.',
      en: 'A product whose efficacy and safety data the Korean MFDS has reviewed, or which has been notified as meeting set ingredient and concentration standards. The pack says “functional cosmetic” (기능성화장품). It began with brightening, wrinkle improvement and UV protection, and since 2017 has also covered areas such as hair colouring, easing hair-loss symptoms and acne-prone skin.',
      lo: 'ຜະລິດຕະພັນທີ່ MFDS ຂອງເກົາຫຼີ ໄດ້ກວດຂໍ້ມູນດ້ານປະສິດທິພາບ ແລະ ຄວາມປອດໄພແລ້ວ ຫຼື ໄດ້ແຈ້ງວ່າກົງຕາມມາດຕະຖານສ່ວນປະສົມ ແລະ ປະລິມານທີ່ກຳນົດ. ເທິງຂວດຈະມີຄຳວ່າ “기능성화장품”. ເລີ່ມແຕ່ 3 ຢ່າງ: ຜິວກະຈ່າງໃສ, ຮອຍຫ່ຽວຍົ່ນ ແລະ ກັນແດດ, ແລະ ຕັ້ງແຕ່ປີ 2017 ໄດ້ຂະຫຍາຍໄປເຖິງ ການຍ້ອມຜົມ, ອາການຜົມຫຼົ່ນ ແລະ ຜິວທີ່ເປັນສິວງ່າຍ.',
    },
  },
  {
    icon: '💊',
    title: {
      ko: '기능성이어도 약은 아니에요',
      en: 'Functional still isn’t medicine',
      lo: 'ຟັງຊັນ ກໍຍັງບໍ່ແມ່ນຢາ',
    },
    body: {
      ko: '기능성화장품도 화장품이에요. 여드름·탈모 관련 기능성 제품에는 ‘의약품이 아님’이라는 문구가 함께 적혀 있어요. 붉어짐이나 가려움이 계속되면 사용을 멈추고 의사나 약사와 상담하세요.',
      en: 'A functional cosmetic is still a cosmetic. Functional products for acne-prone skin or hair loss carry a note saying they are not medicines. If redness or itching continues, stop using the product and talk to a doctor or pharmacist.',
      lo: 'ເຄື່ອງສຳອາງຟັງຊັນ ກໍຍັງແມ່ນເຄື່ອງສຳອາງ. ຜະລິດຕະພັນຟັງຊັນກ່ຽວກັບສິວ ຫຼື ຜົມຫຼົ່ນ ຈະມີຄຳວ່າ “ບໍ່ແມ່ນຢາ” ຂຽນໄວ້. ຖ້າຜິວແດງ ຫຼື ຄັນບໍ່ເຊົາ ໃຫ້ຢຸດໃຊ້ ແລະ ປຶກສາທ່ານໝໍ ຫຼື ເພສັດກອນ.',
    },
  },
];

/* ------------------------------------------------------------------------------------------ */
/* Sources                                                                                      */
/* ------------------------------------------------------------------------------------------ */

export const GUIDE_SOURCES: readonly GuideSource[] = [
  {
    label: 'American Academy of Dermatology — How to apply sunscreen',
    url: 'https://www.aad.org/public/everyday-care/sun-protection/shade-clothing-sunscreen/how-to-apply-sunscreen',
  },
  {
    label: 'American Academy of Dermatology — Common sunscreen mistakes',
    url: 'https://www.aad.org/sun-protection/common-sunscreen-mistakes',
  },
  {
    label: 'Skin Cancer Foundation — Sunscreen (SPF 15/30/50 ≈ 93/97/98% UVB)',
    url: 'https://www.skincancer.org/skin-cancer-prevention/sun-protection/sunscreen/',
  },
  {
    label: 'Eurofins — ISO 24444 SPF test protocol (2 mg/cm² application)',
    url: 'https://cdnmedia.eurofins.com/apac/media/601367/spf-iso-protocol.pdf',
  },
  {
    label: 'ChemLinked — Japan revises the sun protection test methods (JCIA PA standard)',
    url: 'https://cosmetic.chemlinked.com/news/cosmetic-news/japan-revises-the-sun-protection-test-methods',
  },
  {
    label: 'Journal of the Society of Cosmetic Chemists of Japan — PA / PFA measurement',
    url: 'https://www.jstage.jst.go.jp/article/sccj/47/4/47_271/_article/-char/en',
  },
  {
    label: 'Finnish Meteorological Institute — Protecting the skin from sunlight',
    url: 'https://en.ilmatieteenlaitos.fi/uv-radiation-protection',
  },
  {
    label: '식품의약품안전처(MFDS) — 기능성화장품 심사에 관한 규정 행정예고',
    url: 'https://www.mfds.go.kr/brd/m_209/view.do?seq=43363',
  },
  {
    label: '국가법령정보센터 — 화장품법 시행규칙 제2조(기능성화장품의 범위)',
    url: 'https://www.law.go.kr/법령/화장품법시행규칙',
  },
  {
    label: 'WTO TBT notification (Korea, 2017) — expansion of functional cosmetics',
    url: 'https://members.wto.org/crnattachments/2017/TBT/KOR/17_1813_00_x.pdf',
  },
  {
    label: '서울신문 (2017) — 기능성 화장품에 ‘의약품 아님’ 표시',
    url: 'https://m.go.seoul.co.kr/news/2017/05/09/20170509012003',
  },
];
