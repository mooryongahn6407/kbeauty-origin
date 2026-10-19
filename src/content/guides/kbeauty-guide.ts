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
  /** Thai and French: unreviewed drafts, made from the English. */
  readonly th?: string;
  readonly fr?: string;
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
      th: 'ประเทศที่แข็งแกร่งด้านการวิจัยและการผลิต',
      fr: 'Un pays fort en recherche et en fabrication',
    },
    body: {
      ko: '한국에는 화장품을 연구하고 만드는 회사가 아주 많아요. 그래서 새로운 제형(바르는 느낌)과 새로운 형태의 제품이 빠르게 나와요.',
      en: 'Korea has a very large number of companies that research and make cosmetics. That is why new textures and new product formats appear there quickly.',
      lo: 'ເກົາຫຼີມີບໍລິສັດທີ່ຄົ້ນຄວ້າ ແລະ ຜະລິດເຄື່ອງສຳອາງຫຼາຍຫຼາຍ. ສະນັ້ນ ຈຶ່ງມີເນື້ອຄຣີມແບບໃໝ່ ແລະ ຜະລິດຕະພັນຮູບແບບໃໝ່ອອກມາໄວ.',
      th: 'เกาหลีมีบริษัทที่วิจัยและผลิตเครื่องสำอางจำนวนมาก จึงมีเนื้อสัมผัสใหม่ ๆ และรูปแบบผลิตภัณฑ์ใหม่ ๆ ออกมาอย่างรวดเร็ว',
      fr: 'La Corée compte un très grand nombre d’entreprises qui étudient et fabriquent des cosmétiques. C’est pourquoi de nouvelles textures et de nouveaux formats de produits y apparaissent rapidement.',
    },
  },
  {
    icon: '💧',
    title: {
      ko: '가볍고 촉촉한 사용감',
      en: 'Light, hydrating textures',
      lo: 'ເນື້ອບາງເບົາ ແລະ ຊຸ່ມຊື່ນ',
      th: 'เนื้อบางเบา ให้ความชุ่มชื้น',
      fr: 'Des textures légères et hydratantes',
    },
    body: {
      ko: '여러 겹 발라도 무겁지 않은 가벼운 제품이 많아요. 그래서 라오스처럼 덥고 습한 나라에서도 쓰기 편하다는 사람이 많아요.',
      en: 'Many Korean products are light enough to layer without feeling heavy. Many people find them comfortable even in hot, humid countries like Laos.',
      lo: 'ຜະລິດຕະພັນເກົາຫຼີຫຼາຍຢ່າງບາງເບົາ ທາຫຼາຍຊັ້ນກໍບໍ່ໜັກໜ້າ. ຫຼາຍຄົນຈຶ່ງເຫັນວ່າໃຊ້ສະດວກ ເຖິງແມ່ນຢູ່ປະເທດທີ່ຮ້ອນ ແລະ ຊຸ່ມຄືລາວ.',
      th: 'ผลิตภัณฑ์เกาหลีหลายตัวเบาพอที่จะทาซ้อนกันได้โดยไม่รู้สึกหนัก หลายคนรู้สึกสบายผิวแม้ในประเทศที่ร้อนชื้นอย่างลาว',
      fr: 'De nombreux produits coréens sont assez légers pour être superposés sans sensation de lourdeur. Beaucoup de personnes les trouvent confortables même dans des pays chauds et humides comme le Laos.',
    },
  },
  {
    icon: '🌿',
    title: {
      ko: '‘벗겨내기’보다 ‘가꾸기’',
      en: 'Caring for skin rather than stripping it',
      lo: 'ເນັ້ນການບຳລຸງ ຫຼາຍກວ່າການຂັດລອກ',
      th: 'ดูแลผิว แทนการขัดล้างผิวอย่างหนัก',
      fr: 'Prendre soin de la peau plutôt que la décaper',
    },
    body: {
      ko: 'K-뷰티는 피부를 세게 문지르거나 벗겨내기보다, 촉촉하게 채우고 피부 장벽(피부 겉의 보호막)을 지키는 데 초점을 두는 편이에요.',
      en: 'K-beauty tends to focus on keeping skin hydrated and protecting the skin barrier (the thin protective outer layer), rather than scrubbing or stripping it hard.',
      lo: 'K-beauty ມັກເນັ້ນໃຫ້ຜິວຊຸ່ມຊື່ນ ແລະ ປົກປ້ອງຊັ້ນປ້ອງກັນຜິວ (ຊັ້ນບາງໆທີ່ຢູ່ນອກສຸດຂອງຜິວ) ຫຼາຍກວ່າການຂັດ ຫຼື ລອກຜິວແຮງໆ.',
      th: 'เคบิวตี้มักเน้นการรักษาความชุ่มชื้นของผิวและปกป้องเกราะป้องกันผิว (ชั้นนอกบาง ๆ ที่คอยปกป้องผิว) แทนการขัดหรือล้างผิวอย่างหนัก',
      fr: 'La K-beauty tend à privilégier l’hydratation de la peau et la protection de la barrière cutanée (la fine couche externe protectrice), plutôt que de la frotter ou de la décaper fortement.',
    },
  },
  {
    icon: '☀️',
    title: {
      ko: '매일 바르는 선크림 문화',
      en: 'An everyday sunscreen habit',
      lo: 'ນິໄສທາຄຣີມກັນແດດທຸກມື້',
      th: 'ทาครีมกันแดดเป็นนิสัยทุกวัน',
      fr: 'L’habitude quotidienne de la crème solaire',
    },
    body: {
      ko: '한국에서는 선크림을 여름에만이 아니라 매일 바르는 기본 단계로 여겨요. 그래서 끈적임과 백탁(하얗게 뜨는 것)을 줄인 제품이 많이 만들어졌어요.',
      en: 'In Korea, sunscreen is seen as a basic daily step, not just a summer product. That is why so many light sunscreens with less stickiness and less white cast have been developed.',
      lo: 'ຢູ່ເກົາຫຼີ ຄຣີມກັນແດດຖືເປັນຂັ້ນຕອນພື້ນຖານທີ່ທາທຸກມື້ ບໍ່ແມ່ນສະເພາະລະດູຮ້ອນ. ຈຶ່ງມີຄຣີມກັນແດດທີ່ບໍ່ໜຽວ ແລະ ບໍ່ຂາວວອກ ອອກມາຫຼາຍ.',
      th: 'ในเกาหลี ครีมกันแดดถูกมองว่าเป็นขั้นตอนพื้นฐานประจำวัน ไม่ใช่แค่ผลิตภัณฑ์สำหรับหน้าร้อน จึงมีการพัฒนาครีมกันแดดเนื้อบางเบาที่เหนอะหนะน้อยลงและทิ้งคราบขาวน้อยลงออกมามากมาย',
      fr: 'En Corée, la crème solaire est considérée comme une étape quotidienne de base, et pas seulement comme un produit d’été. C’est pourquoi tant de crèmes solaires légères, moins collantes et laissant moins de voile blanc ont été développées.',
    },
  },
  {
    icon: '🎯',
    title: {
      ko: '피부 타입별로 고를 수 있는 넓은 선택',
      en: 'Wide choice for every skin type',
      lo: 'ມີໃຫ້ເລືອກຫຼາຍ ຕາມປະເພດຜິວ',
      th: 'ตัวเลือกหลากหลายสำหรับทุกสภาพผิว',
      fr: 'Un large choix pour chaque type de peau',
    },
    body: {
      ko: '지성·건성·민감한 피부 등 피부 타입과 고민에 맞춰 고를 수 있는 제품이 많아요. 마스크팩이나 미니 사이즈처럼 부담 없이 먼저 써 볼 수 있는 형태도 많아요.',
      en: 'There are products for oily, dry and sensitive skin and for many different concerns. Many also come in easy-to-try forms, such as sheet masks and mini sizes.',
      lo: 'ມີຜະລິດຕະພັນໃຫ້ເລືອກຕາມປະເພດຜິວ ເຊັ່ນ ຜິວມັນ, ຜິວແຫ້ງ, ຜິວແພ້ງ່າຍ ແລະ ຕາມບັນຫາຜິວຕ່າງໆ. ຍັງມີແບບທີ່ລອງໃຊ້ໄດ້ງ່າຍ ເຊັ່ນ ແຜ່ນມາສ໌ກ ແລະ ຂະໜາດນ້ອຍ.',
      th: 'มีผลิตภัณฑ์สำหรับผิวมัน ผิวแห้ง และผิวแพ้ง่าย รวมถึงปัญหาผิวอีกหลายแบบ หลายตัวยังมีในรูปแบบที่ทดลองใช้ได้ง่าย เช่น มาสก์แผ่นและขนาดมินิ',
      fr: 'Il existe des produits pour les peaux grasses, sèches et sensibles, et pour de nombreuses préoccupations différentes. Beaucoup existent aussi sous des formes faciles à essayer, comme les masques en tissu et les mini-formats.',
    },
  },
  {
    icon: '📺',
    title: {
      ko: '한류의 힘',
      en: 'The Korean Wave',
      lo: 'ກະແສເກົາຫຼີ',
      th: 'กระแสเกาหลี',
      fr: 'La vague coréenne',
    },
    body: {
      ko: '드라마와 K-팝을 통해 한국 배우·가수의 피부 관리가 알려지면서, 한국식 스킨케어에 관심을 갖는 사람이 세계적으로 늘었어요.',
      en: 'Through K-dramas and K-pop, people around the world saw how Korean actors and singers care for their skin, and interest in Korean-style skincare grew.',
      lo: 'ຜ່ານລະຄອນເກົາຫຼີ ແລະ ເພງ K-pop ຄົນທົ່ວໂລກໄດ້ເຫັນວິທີເບິ່ງແຍງຜິວຂອງດາລາເກົາຫຼີ ຄວາມສົນໃຈໃນການເບິ່ງແຍງຜິວແບບເກົາຫຼີຈຶ່ງເພີ່ມຂຶ້ນ.',
      th: 'ผ่านซีรีส์เกาหลีและเคป็อป ผู้คนทั่วโลกได้เห็นว่านักแสดงและนักร้องเกาหลีดูแลผิวอย่างไร ความสนใจในการดูแลผิวแบบเกาหลีจึงเพิ่มขึ้น',
      fr: 'Grâce aux K-dramas et à la K-pop, des gens du monde entier ont vu comment les acteurs et chanteurs coréens prennent soin de leur peau, et l’intérêt pour les soins de style coréen a grandi.',
    },
  },
  {
    icon: '🏷️',
    title: {
      ko: '정부가 관리하는 ‘기능성’ 표시',
      en: '“Functional” labels overseen by the government',
      lo: 'ປ້າຍ “ຟັງຊັນ” ທີ່ລັດຖະບານກວດກາ',
      th: 'ฉลาก “ฟังก์ชันนัล” ที่รัฐบาลกำกับดูแล',
      fr: 'Des mentions « fonctionnelles » encadrées par l’État',
    },
    body: {
      ko: '한국에서 미백·주름개선·자외선차단 같은 ‘기능성화장품’ 표시는 식품의약품안전처(식약처)의 심사나 보고를 거쳐야 쓸 수 있어요.',
      en: 'In Korea, a product can only carry a “functional cosmetic” label — such as brightening, wrinkle care or UV protection — after review by, or notification to, the Ministry of Food and Drug Safety (MFDS).',
      lo: 'ຢູ່ເກົາຫຼີ ຜະລິດຕະພັນຈະຂຽນວ່າ “ເຄື່ອງສຳອາງຟັງຊັນ” ເຊັ່ນ ຊ່ວຍໃຫ້ຜິວກະຈ່າງໃສ, ຊ່ວຍເລື່ອງຮອຍຫ່ຽວຍົ່ນ ຫຼື ກັນແດດ ໄດ້ ກໍຕໍ່ເມື່ອຜ່ານການກວດ ຫຼື ແຈ້ງຕໍ່ກະຊວງຄວາມປອດໄພອາຫານ ແລະ ຢາ ຂອງເກົາຫຼີ (MFDS) ແລ້ວ.',
      th: 'ในเกาหลี ผลิตภัณฑ์จะติดฉลาก “เครื่องสำอางฟังก์ชันนัล” ได้ — เช่น ช่วยให้ผิวกระจ่างใส ดูแลริ้วรอย หรือป้องกันรังสียูวี — ก็ต่อเมื่อผ่านการตรวจสอบโดย หรือแจ้งต่อ กระทรวงความปลอดภัยอาหารและยา (MFDS) แล้วเท่านั้น',
      fr: 'En Corée, un produit ne peut porter la mention « cosmétique fonctionnel » — comme éclaircissement, soin des rides ou protection UV — qu’après examen par le ministère de la Sécurité des aliments et des médicaments (MFDS), ou notification à celui-ci.',
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
      th: 'หนึ่งขั้นตอน หนึ่งหน้าที่',
      fr: 'Une étape, une fonction',
    },
    body: {
      ko: '클렌징은 씻어내고, 토너는 정돈하고, 세럼은 집중해서 채우고, 크림은 덮어 주고, 선크림은 햇빛을 막아요. 한 제품이 모든 일을 다 하기는 어려워서 나뉘어 있어요.',
      en: 'Cleansers wash away, toners prepare, serums deliver focused care, creams seal in moisture and sunscreen blocks UV. One product can’t easily do every job, so they are separate.',
      lo: 'ຄລີນຊິ່ງລ້າງອອກ, ໂທນເນີປັບສະພາບຜິວ, ເຊຣັ່ມບຳລຸງແບບເຂັ້ມຂຸ້ນ, ຄຣີມປິດຄວາມຊຸ່ມຊື່ນໄວ້, ຄຣີມກັນແດດກັນລັງສີ UV. ຜະລິດຕະພັນດຽວເຮັດທຸກຢ່າງໄດ້ຍາກ ຈຶ່ງແຍກກັນ.',
      th: 'คลีนเซอร์ทำหน้าที่ล้าง โทนเนอร์เตรียมผิว เซรั่มให้การดูแลแบบเจาะจง ครีมกักเก็บความชุ่มชื้น และครีมกันแดดป้องกันรังสียูวี ผลิตภัณฑ์เดียวทำทุกหน้าที่ได้ไม่ง่าย จึงแยกเป็นหลายตัว',
      fr: 'Le nettoyant lave, la lotion tonique prépare, le sérum apporte un soin ciblé, la crème scelle l’hydratation et la crème solaire bloque les UV. Un seul produit ne peut pas facilement tout faire, c’est pourquoi ils sont séparés.',
    },
  },
  {
    icon: '🥛',
    title: {
      ko: '묽은 것부터 진한 것 순서',
      en: 'Thin to thick',
      lo: 'ຈາກບາງໄປຫາໜາ',
      th: 'จากบางไปหนา',
      fr: 'Du plus fluide au plus épais',
    },
    body: {
      ko: '물처럼 묽은 제품을 먼저, 끈적하거나 기름진 제품을 나중에 바르는 게 기본이에요. 제형(질감)과 무게가 다르기 때문에 제품 종류도 나뉘어요.',
      en: 'The basic rule is to apply watery products first and richer, oilier ones later. Because textures and weights differ, the product types are divided too.',
      lo: 'ຫຼັກພື້ນຖານແມ່ນທາຜະລິດຕະພັນທີ່ບາງຄືນ້ຳກ່ອນ ແລ້ວຈຶ່ງທາທີ່ໜາ ຫຼື ມີນ້ຳມັນຫຼາຍທີຫຼັງ. ເນື່ອງຈາກເນື້ອ ແລະ ຄວາມໜັກເບົາຕ່າງກັນ ປະເພດຜະລິດຕະພັນຈຶ່ງແຍກກັນ.',
      th: 'กฎพื้นฐานคือทาผลิตภัณฑ์เนื้อน้ำก่อน แล้วจึงทาเนื้อเข้มข้นหรือมีน้ำมันมากกว่าทีหลัง เพราะเนื้อสัมผัสและความหนักเบาต่างกัน ประเภทผลิตภัณฑ์จึงแบ่งออกด้วย',
      fr: 'La règle de base: appliquer d’abord les produits aqueux, puis les plus riches et plus huileux. Comme les textures et les consistances diffèrent, les types de produits sont aussi séparés.',
    },
  },
  {
    icon: '👁️',
    title: {
      ko: '부위마다 피부가 달라요',
      en: 'Each body area is different',
      lo: 'ແຕ່ລະສ່ວນຂອງຜິວບໍ່ຄືກັນ',
      th: 'แต่ละส่วนของร่างกายต่างกัน',
      fr: 'Chaque zone du corps est différente',
    },
    body: {
      ko: '눈가는 얇고, 입술은 피지(기름)가 거의 나오지 않고, 손은 자주 씻어서 쉽게 건조해져요. 그래서 아이크림·립밤·핸드크림처럼 부위별 제품이 있어요.',
      en: 'The skin around the eyes is thin, lips make almost no oil, and hands dry out from frequent washing. That is why there are eye creams, lip balms and hand creams.',
      lo: 'ຜິວຮອບດວງຕາບາງ, ສົບແທບບໍ່ມີນ້ຳມັນ, ມືແຫ້ງງ່າຍເພາະລ້າງເລື້ອຍໆ. ຈຶ່ງມີຄຣີມຮອບຕາ, ລິບບາມ ແລະ ຄຣີມທາມື ແຍກຕາມສ່ວນ.',
      th: 'ผิวรอบดวงตาบาง ริมฝีปากแทบไม่ผลิตน้ำมัน และมือแห้งจากการล้างบ่อย จึงมีอายครีม ลิปบาล์ม และแฮนด์ครีม',
      fr: 'La peau autour des yeux est fine, les lèvres ne produisent presque pas de sébum et les mains se dessèchent à force d’être lavées. C’est pourquoi il existe des crèmes pour les yeux, des baumes à lèvres et des crèmes pour les mains.',
    },
  },
  {
    icon: '🧼',
    title: {
      ko: '씻어내는 것 · 남기는 것 · 지키는 것',
      en: 'Wash off · leave on · protect',
      lo: 'ລ້າງອອກ · ທາໄວ້ · ປົກປ້ອງ',
      th: 'ล้างออก · ทิ้งไว้บนผิว · ปกป้อง',
      fr: 'Rincer · laisser poser · protéger',
    },
    body: {
      ko: '클렌저는 피부에 잠깐 닿고 씻겨 나가고, 세럼과 크림은 피부에 남아 있고, 선크림은 낮 동안 피부를 지켜요. 목적이 달라서 만드는 방식도 달라요.',
      en: 'Cleansers touch the skin briefly and rinse away, serums and creams stay on, and sunscreen protects through the day. Different purposes need different formulas.',
      lo: 'ຄລີນເຊີສຳຜັດຜິວແປບດຽວແລ້ວລ້າງອອກ, ເຊຣັ່ມ ແລະ ຄຣີມທາໄວ້ເທິງຜິວ, ຄຣີມກັນແດດປົກປ້ອງຜິວຕະຫຼອດມື້. ຈຸດປະສົງຕ່າງກັນ ສູດກໍຕ່າງກັນ.',
      th: 'คลีนเซอร์สัมผัสผิวเพียงครู่เดียวแล้วล้างออก เซรั่มและครีมอยู่บนผิว ส่วนครีมกันแดดปกป้องผิวตลอดวัน จุดประสงค์ต่างกันจึงต้องใช้สูตรต่างกัน',
      fr: 'Le nettoyant touche la peau brièvement puis se rince, le sérum et la crème restent sur la peau, et la crème solaire protège tout au long de la journée. Des usages différents demandent des formules différentes.',
    },
  },
  {
    icon: '🌦️',
    title: {
      ko: '피부 타입과 계절에 맞춰 고르기',
      en: 'Choose by skin type and season',
      lo: 'ເລືອກຕາມປະເພດຜິວ ແລະ ລະດູການ',
      th: 'เลือกตามสภาพผิวและฤดูกาล',
      fr: 'Choisir selon sa peau et la saison',
    },
    body: {
      ko: '지성 피부나 더운 계절엔 가벼운 것만, 건성 피부나 건조한 계절엔 크림을 더하는 식으로 조합할 수 있어요. 단계가 나뉘어 있어야 이렇게 골라 쓸 수 있어요.',
      en: 'Oily skin or hot weather may need only light layers, while dry skin or the dry season may need an extra cream. Separate steps make this mixing and matching possible.',
      lo: 'ຜິວມັນ ຫຼື ລະດູຮ້ອນ ອາດໃຊ້ພຽງຊັ້ນບາງໆ, ສ່ວນຜິວແຫ້ງ ຫຼື ລະດູແລ້ງ ອາດເພີ່ມຄຣີມ. ການແຍກຂັ້ນຕອນເຮັດໃຫ້ເລືອກປະສົມໄດ້ແບບນີ້.',
      th: 'ผิวมันหรืออากาศร้อนอาจต้องการแค่ชั้นบาง ๆ ส่วนผิวแห้งหรือฤดูแล้งอาจต้องเพิ่มครีมอีกชั้น การแยกขั้นตอนทำให้ปรับผสมผสานแบบนี้ได้',
      fr: 'Une peau grasse ou un temps chaud peuvent ne demander que des couches légères, tandis qu’une peau sèche ou la saison sèche peuvent nécessiter une crème en plus. Des étapes séparées permettent ces ajustements.',
    },
  },
  {
    icon: '✅',
    title: {
      ko: '전부 쓸 필요는 없어요',
      en: 'You don’t need them all',
      lo: 'ບໍ່ຈຳເປັນຕ້ອງໃຊ້ທັງໝົດ',
      th: 'ไม่จำเป็นต้องใช้ทั้งหมด',
      fr: 'Inutile de tout utiliser',
    },
    body: {
      ko: '기본은 세 가지예요: 씻기(클렌징), 촉촉하게(보습), 아침엔 선크림. 나머지는 내 피부와 취향에 따라 더하면 돼요.',
      en: 'The basics are three: cleanse, moisturise and, in the morning, sunscreen. Everything else can be added to suit your skin and taste.',
      lo: 'ພື້ນຖານມີສາມຢ່າງ: ລ້າງໜ້າ, ບຳລຸງຄວາມຊຸ່ມຊື່ນ ແລະ ຕອນເຊົ້າທາຄຣີມກັນແດດ. ສ່ວນອື່ນຄ່ອຍເພີ່ມຕາມຜິວ ແລະ ຄວາມມັກຂອງເຈົ້າ.',
      th: 'พื้นฐานมีสามอย่าง: ทำความสะอาด บำรุงความชุ่มชื้น และในตอนเช้า ทาครีมกันแดด ที่เหลือเพิ่มได้ตามสภาพผิวและความชอบของคุณ',
      fr: 'Les bases sont au nombre de trois: nettoyer, hydrater et, le matin, appliquer une crème solaire. Tout le reste peut s’ajouter selon votre peau et vos goûts.',
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
      th: 'ผลิตภัณฑ์เนื้อบางที่บรรจุสารออกฤทธิ์ไว้มากในปริมาณน้อย คนมักพูดว่าเอสเซนส์ → เซรั่ม → แอมพูล ไล่จากเบาไปเข้มข้น แต่แต่ละแบรนด์ใช้ชื่อเรียกต่างกันเล็กน้อย',
      fr: 'Des produits fluides qui concentrent beaucoup d’actifs dans une petite quantité. On dit souvent que l’ordre essence → sérum → ampoule va du plus léger au plus concentré, mais chaque marque utilise ces noms un peu différemment.',
    },
    why: {
      ko: '토너보다 진하고 크림보다 가벼워서, 보습·피부결·피부톤처럼 ‘나만의 고민’에 맞춰 골라 쓰는 단계예요.',
      en: 'Richer than toner but lighter than cream, this is the step you choose to match your own concern — hydration, texture or tone.',
      lo: 'ເຂັ້ມກວ່າໂທນເນີ ແຕ່ບາງເບົາກວ່າຄຣີມ. ເປັນຂັ້ນຕອນທີ່ເລືອກໃຫ້ກົງກັບບັນຫາຜິວຂອງເຈົ້າເອງ ເຊັ່ນ ຄວາມຊຸ່ມຊື່ນ, ຄວາມລຽບນຽນ ຫຼື ສີຜິວ.',
      th: 'เข้มข้นกว่าโทนเนอร์แต่เบากว่าครีม เป็นขั้นตอนที่คุณเลือกให้ตรงกับปัญหาผิวของตัวเอง — ความชุ่มชื้น ผิวสัมผัส หรือสีผิว',
      fr: 'Plus riche que la lotion tonique mais plus léger que la crème, c’est l’étape que vous choisissez selon votre préoccupation — hydratation, grain de peau ou teint.',
    },
    when: {
      ko: '아침·저녁 모두, 토너 다음·크림 전에 발라요. 여러 개를 쓴다면 묽은 것부터 발라요.',
      en: 'Morning and night, after toner and before cream. If you use more than one, apply the thinnest first.',
      lo: 'ທັງຕອນເຊົ້າ ແລະ ຕອນແລງ, ຫຼັງໂທນເນີ ແລະ ກ່ອນຄຣີມ. ຖ້າໃຊ້ຫຼາຍຕົວ ໃຫ້ທາຕົວທີ່ບາງທີ່ສຸດກ່ອນ.',
      th: 'เช้าและเย็น หลังโทนเนอร์และก่อนครีม ถ้าใช้มากกว่าหนึ่งตัว ให้ทาตัวที่เนื้อบางที่สุดก่อน',
      fr: 'Matin et soir, après la lotion tonique et avant la crème. Si vous en utilisez plusieurs, appliquez d’abord le plus fluide.',
    },
    laoTip: {
      ko: '무더운 3~5월과 습한 우기엔 세럼 하나에 가벼운 젤 크림만으로도 충분할 수 있어요. 끈적이면 양을 줄여 보세요.',
      en: 'In the hottest months (March–May) and the humid rainy season, one serum plus a light gel cream may be enough. If it feels sticky, use less.',
      lo: 'ໃນເດືອນທີ່ຮ້ອນທີ່ສຸດ (ມີນາ–ພຶດສະພາ) ແລະ ລະດູຝົນທີ່ຊຸ່ມ, ເຊຣັ່ມໜຶ່ງຕົວ ກັບ ເຈວຄຣີມບາງໆ ອາດພຽງພໍແລ້ວ. ຖ້າໜຽວ ໃຫ້ຫຼຸດປະລິມານລົງ.',
      th: 'ในเดือนที่ร้อนที่สุด (มีนาคม–พฤษภาคม) และฤดูฝนที่ชื้น เซรั่มหนึ่งตัวกับเจลครีมเนื้อบางเบาอาจเพียงพอ ถ้ารู้สึกเหนอะหนะ ให้ใช้น้อยลง',
      fr: 'Pendant les mois les plus chauds (mars–mai) et la saison des pluies humide, un sérum et une crème-gel légère peuvent suffire. Si la sensation est collante, utilisez-en moins.',
    },
  },
  {
    category: '크림',
    icon: '🫙',
    what: {
      ko: '수분과 유분을 함께 담아 피부 겉에 얇은 보호막을 만들어 주는 보습 제품이에요. 젤·로션·크림·밤 순서로 점점 진해져요.',
      en: 'A moisturiser that combines water and oil to form a thin protective film on the skin. Gel, lotion, cream and balm go from lightest to richest.',
      lo: 'ຜະລິດຕະພັນບຳລຸງຄວາມຊຸ່ມຊື່ນທີ່ມີທັງນ້ຳ ແລະ ນ້ຳມັນ ສ້າງຊັ້ນບາງໆປົກປ້ອງຜິວ. ເຈວ, ໂລຊັນ, ຄຣີມ ແລະ ບາມ ໜາຂຶ້ນຕາມລຳດັບ.',
      th: 'มอยส์เจอไรเซอร์ที่ผสานน้ำกับน้ำมันเพื่อสร้างฟิล์มบาง ๆ ปกป้องผิว เจล โลชั่น ครีม และบาล์ม ไล่จากเบาที่สุดไปเข้มข้นที่สุด',
      fr: 'Une crème hydratante qui associe eau et huile pour former un fin film protecteur sur la peau. Gel, lotion, crème et baume vont du plus léger au plus riche.',
    },
    why: {
      ko: '앞 단계에서 준 수분이 날아가지 않도록 ‘뚜껑’을 덮어 주는 역할이에요. 토너나 세럼만으로는 이 일을 하기 어려워요.',
      en: 'It works like a lid, helping keep in the moisture from earlier steps. Toners and serums alone can’t easily do this.',
      lo: 'ມັນເຮັດໜ້າທີ່ຄືຝາປິດ ຊ່ວຍກັກຄວາມຊຸ່ມຊື່ນຈາກຂັ້ນຕອນກ່ອນໜ້າໄວ້. ໂທນເນີ ຫຼື ເຊຣັ່ມຢ່າງດຽວເຮັດໜ້າທີ່ນີ້ໄດ້ຍາກ.',
      th: 'ทำหน้าที่เหมือนฝาปิด ช่วยกักความชุ่มชื้นจากขั้นตอนก่อนหน้าไว้ โทนเนอร์และเซรั่มอย่างเดียวทำแบบนี้ได้ไม่ง่าย',
      fr: 'Elle agit comme un couvercle et aide à retenir l’hydratation des étapes précédentes. La lotion tonique et le sérum seuls y parviennent difficilement.',
    },
    when: {
      ko: '스킨케어의 거의 마지막이에요. 아침엔 크림 다음 선크림, 저녁엔 크림이 마지막 단계예요.',
      en: 'Near the end of your routine. In the morning, sunscreen follows the cream; at night, cream is the last step.',
      lo: 'ເກືອບເປັນຂັ້ນຕອນສຸດທ້າຍ. ຕອນເຊົ້າ ທາຄຣີມແລ້ວຕາມດ້ວຍຄຣີມກັນແດດ, ຕອນແລງ ຄຣີມແມ່ນຂັ້ນຕອນສຸດທ້າຍ.',
      th: 'ใกล้ช่วงท้ายของรูทีน ตอนเช้า ทาครีมกันแดดต่อจากครีม ส่วนตอนกลางคืน ครีมเป็นขั้นตอนสุดท้าย',
      fr: 'Vers la fin de votre routine. Le matin, la crème solaire suit la crème; le soir, la crème est la dernière étape.',
    },
    laoTip: {
      ko: '습한 계절엔 젤이나 로션 타입이 산뜻해요. 건조한 11~2월이나 에어컨을 오래 쬐는 날엔 조금 더 진한 크림이 도움이 될 수 있어요.',
      en: 'In humid months, gel or lotion types feel fresher. In the dry season (November–February) or on long days in air-conditioning, a richer cream may help.',
      lo: 'ໃນລະດູທີ່ຊຸ່ມ ເຈວ ຫຼື ໂລຊັນ ໃຫ້ຄວາມສົດຊື່ນກວ່າ. ໃນລະດູແລ້ງ (ພະຈິກ–ກຸມພາ) ຫຼື ມື້ທີ່ຢູ່ໃນຫ້ອງແອດົນໆ ຄຣີມທີ່ໜາຂຶ້ນອາດຊ່ວຍໄດ້.',
      th: 'ในเดือนที่ชื้น แบบเจลหรือโลชั่นให้ความรู้สึกสดชื่นกว่า ในฤดูแล้ง (พฤศจิกายน–กุมภาพันธ์) หรือวันที่อยู่ในห้องแอร์นาน ๆ ครีมเนื้อเข้มข้นกว่าอาจช่วยได้',
      fr: 'Pendant les mois humides, les textures gel ou lotion sont plus fraîches. Pendant la saison sèche (novembre–février) ou lors de longues journées à la climatisation, une crème plus riche peut aider.',
    },
  },
  {
    category: '선케어',
    icon: '☀️',
    what: {
      ko: '자외선(UV)을 막아 주는 제품이에요. 선크림, 선젤, 선스틱, 선쿠션, 선스프레이 등 형태가 다양해요.',
      en: 'Products that protect skin from ultraviolet (UV) light. They come as creams, gels, sticks, cushions, sprays and more.',
      lo: 'ຜະລິດຕະພັນທີ່ປົກປ້ອງຜິວຈາກລັງສີ UV. ມີຫຼາຍຮູບແບບ ເຊັ່ນ ຄຣີມ, ເຈວ, ແທ່ງ, ຄຸດຊັນ ແລະ ສະເປຣ.',
      th: 'ผลิตภัณฑ์ที่ปกป้องผิวจากรังสีอัลตราไวโอเลต (UV) มีทั้งแบบครีม เจล สติ๊ก คุชชั่น สเปรย์ และอื่น ๆ',
      fr: 'Des produits qui protègent la peau des rayons ultraviolets (UV). Ils existent en crème, gel, stick, cushion, spray et plus encore.',
    },
    why: {
      ko: '다른 제품이 피부를 ‘가꾸는’ 일이라면 선케어는 햇빛으로부터 ‘지키는’ 일이에요. 햇빛은 기미·잡티와 피부 노화의 큰 원인 중 하나로 알려져 있어서 매일 필요한 단계예요.',
      en: 'Other products care for the skin; sun care protects it from sunlight. Sunlight is known as one of the main causes of dark spots and skin ageing, so this step is needed every day.',
      lo: 'ຜະລິດຕະພັນອື່ນບຳລຸງຜິວ ສ່ວນຄຣີມກັນແດດປົກປ້ອງຜິວຈາກແສງແດດ. ແສງແດດເປັນສາເຫດສຳຄັນອັນໜຶ່ງຂອງຈຸດດ່າງດຳ ແລະ ຜິວແກ່ກ່ອນໄວ ຈຶ່ງຄວນທາທຸກມື້.',
      th: 'ผลิตภัณฑ์อื่นดูแลผิว ส่วนผลิตภัณฑ์กันแดดปกป้องผิวจากแสงแดด แสงแดดเป็นที่รู้กันว่าเป็นหนึ่งในสาเหตุหลักของจุดด่างดำและความเสื่อมของผิวตามวัย ขั้นตอนนี้จึงจำเป็นทุกวัน',
      fr: 'Les autres produits prennent soin de la peau ; la protection solaire la protège du soleil. La lumière du soleil est connue comme l’une des principales causes des taches pigmentaires et du vieillissement cutané, cette étape est donc nécessaire chaque jour.',
    },
    when: {
      ko: '아침 스킨케어의 마지막, 메이크업 바로 전에 발라요. 밖에 있다면 약 2시간마다, 땀을 흘리거나 물놀이 뒤에는 바로 다시 발라요.',
      en: 'The last step of your morning skincare, just before makeup. Outdoors, reapply about every 2 hours, and right away after sweating or swimming.',
      lo: 'ຂັ້ນຕອນສຸດທ້າຍຂອງການບຳລຸງຜິວຕອນເຊົ້າ ກ່ອນແຕ່ງໜ້າ. ຖ້າຢູ່ກາງແຈ້ງ ທາຊ້ຳປະມານທຸກໆ 2 ຊົ່ວໂມງ ແລະ ທາຊ້ຳທັນທີຫຼັງອອກເຫື່ອ ຫຼື ລອຍນ້ຳ.',
      th: 'ขั้นตอนสุดท้ายของการดูแลผิวตอนเช้า ก่อนแต่งหน้า เมื่ออยู่กลางแจ้ง ให้ทาซ้ำประมาณทุก 2 ชั่วโมง และทาทันทีหลังเหงื่อออกหรือว่ายน้ำ',
      fr: 'La dernière étape de vos soins du matin, juste avant le maquillage. À l’extérieur, réappliquez environ toutes les 2 heures, et immédiatement après avoir transpiré ou nagé.',
    },
    laoTip: {
      ko: '라오스는 일 년 내내 햇빛이 강해요. 흐린 우기에도 바르고, 오토바이를 탈 땐 목·귀·손등도 잊지 마세요.',
      en: 'The sun in Laos is strong all year. Apply it on cloudy rainy-season days too, and when riding a motorbike, don’t forget your neck, ears and the backs of your hands.',
      lo: 'ແດດຢູ່ລາວແຮງຕະຫຼອດປີ. ລະດູຝົນທີ່ມີເມກກໍຄວນທາ ແລະ ເວລາຂີ່ລົດຈັກ ຢ່າລືມທາຄໍ, ຫູ ແລະ ຫຼັງມື.',
      th: 'แดดในลาวแรงตลอดปี ให้ทาแม้ในวันที่ฟ้าครึ้มช่วงฤดูฝน และเมื่อขี่มอเตอร์ไซค์ อย่าลืมคอ หู และหลังมือ',
      fr: 'Le soleil au Laos est fort toute l’année. Appliquez-la aussi les jours nuageux de la saison des pluies et, à moto, n’oubliez pas le cou, les oreilles et le dos des mains.',
    },
  },
  {
    category: '헤어케어',
    icon: '💇',
    what: {
      ko: '샴푸, 컨디셔너, 헤어 마스크, 헤어 에센스·오일, 두피 제품처럼 머리카락과 두피를 위한 제품이에요.',
      en: 'Products for hair and scalp: shampoo, conditioner, hair masks, hair essences and oils, and scalp products.',
      lo: 'ຜະລິດຕະພັນສຳລັບຜົມ ແລະ ໜັງຫົວ: ແຊມພູ, ຄອນດິຊັນເນີ, ມາສ໌ກຜົມ, ເອສເຊັນ ແລະ ນ້ຳມັນບຳລຸງຜົມ, ຜະລິດຕະພັນສຳລັບໜັງຫົວ.',
      th: 'ผลิตภัณฑ์สำหรับผมและหนังศีรษะ: แชมพู ครีมนวดผม มาสก์ผม เอสเซนส์และน้ำมันบำรุงผม และผลิตภัณฑ์สำหรับหนังศีรษะ',
      fr: 'Des produits pour les cheveux et le cuir chevelu: shampooing, après-shampooing, masques capillaires, essences et huiles capillaires, et produits pour le cuir chevelu.',
    },
    why: {
      ko: '두피는 얼굴과 이어진 피부라 깨끗이 씻어야 하고, 머리카락은 상하면 스스로 회복되기 어려워서 코팅하고 보호해 주는 제품이 따로 필요해요.',
      en: 'The scalp is skin, just like your face, so it needs cleansing. Hair strands can’t repair themselves once damaged, so separate products coat and protect them.',
      lo: 'ໜັງຫົວກໍແມ່ນຜິວຄືກັບໃບໜ້າ ຈຶ່ງຕ້ອງລ້າງໃຫ້ສະອາດ. ເສັ້ນຜົມເມື່ອເສຍແລ້ວຟື້ນຕົວເອງບໍ່ໄດ້ ຈຶ່ງຕ້ອງມີຜະລິດຕະພັນເຄືອບ ແລະ ປົກປ້ອງແຍກຕ່າງຫາກ.',
      th: 'หนังศีรษะก็คือผิวหนังเช่นเดียวกับผิวหน้า จึงต้องทำความสะอาด เส้นผมซ่อมแซมตัวเองไม่ได้เมื่อเสียหายแล้ว จึงมีผลิตภัณฑ์แยกต่างหากที่เคลือบและปกป้องเส้นผม',
      fr: 'Le cuir chevelu est de la peau, tout comme votre visage, il a donc besoin d’être nettoyé. Les cheveux ne peuvent pas se réparer une fois abîmés, c’est pourquoi des produits distincts les gainent et les protègent.',
    },
    when: {
      ko: '샴푸는 두피 위주로 문질러 씻고, 컨디셔너는 머리카락 끝 위주로 발라요. 헤어 오일은 머리를 감은 뒤 끝부분에 조금만 발라요.',
      en: 'Massage shampoo mainly into the scalp; apply conditioner mainly to the ends. Use just a little hair oil on the ends after washing.',
      lo: 'ນວດແຊມພູໃສ່ໜັງຫົວເປັນຫຼັກ, ທາຄອນດິຊັນເນີໃສ່ປາຍຜົມເປັນຫຼັກ. ຫຼັງສະຜົມ ທານ້ຳມັນບຳລຸງຜົມໜ້ອຍດຽວທີ່ປາຍຜົມ.',
      th: 'นวดแชมพูที่หนังศีรษะเป็นหลัก ทาครีมนวดผมที่ปลายผมเป็นหลัก หลังสระ ใช้น้ำมันบำรุงผมเพียงเล็กน้อยที่ปลายผม',
      fr: 'Massez le shampooing surtout sur le cuir chevelu; appliquez l’après-shampooing surtout sur les pointes. Après le lavage, mettez juste un peu d’huile capillaire sur les pointes.',
    },
    laoTip: {
      ko: '땀을 많이 흘린 날엔 두피를 깨끗이 씻고, 비를 맞은 날엔 머리를 젖은 채로 오래 두지 말고 바로 말려 주세요. 강한 햇빛 아래에선 모자가 머리카락을 지켜 줘요.',
      en: 'On sweaty days, wash your scalp well. After getting caught in the rain, dry your hair soon rather than leaving it wet. A hat helps protect hair under strong sun.',
      lo: 'ມື້ທີ່ອອກເຫື່ອຫຼາຍ ໃຫ້ສະຜົມໃຫ້ສະອາດ. ຖ້າຖືກຝົນ ຢ່າປ່ອຍຜົມປຽກດົນ ໃຫ້ເປົ່າໃຫ້ແຫ້ງໄວ. ເວລາແດດແຮງ ໃສ່ໝວກຊ່ວຍປົກປ້ອງຜົມ.',
      th: 'ในวันที่เหงื่อออกมาก ให้สระหนังศีรษะให้สะอาด หลังเปียกฝน ให้รีบทำให้ผมแห้งแทนที่จะปล่อยไว้เปียก หมวกช่วยปกป้องเส้นผมใต้แดดแรง',
      fr: 'Les jours où vous transpirez, lavez bien votre cuir chevelu. Après avoir été surpris par la pluie, séchez vos cheveux rapidement plutôt que de les laisser mouillés. Un chapeau aide à protéger les cheveux sous un soleil fort.',
    },
  },
  {
    category: '클렌징',
    icon: '🫧',
    what: {
      ko: '메이크업, 선크림, 피지(기름), 먼지를 씻어내는 제품이에요. 클렌징 오일·밤, 클렌징 워터, 폼 클렌저, 젤 클렌저 등이 있어요.',
      en: 'Products that remove makeup, sunscreen, oil and dirt: cleansing oils and balms, micellar waters, foam cleansers, gel cleansers and more.',
      lo: 'ຜະລິດຕະພັນທີ່ລ້າງເມກອັບ, ຄຣີມກັນແດດ, ນ້ຳມັນ ແລະ ຂີ້ຝຸ່ນອອກ ເຊັ່ນ ຄລີນຊິ່ງອອຍ ແລະ ບາມ, ຄລີນຊິ່ງວໍເຕີ, ໂຟມລ້າງໜ້າ ແລະ ເຈວລ້າງໜ້າ.',
      th: 'ผลิตภัณฑ์ที่ขจัดเครื่องสำอาง ครีมกันแดด น้ำมัน และสิ่งสกปรก: คลีนซิ่งออยล์และบาล์ม ไมเซลลาร์วอเตอร์ โฟมล้างหน้า เจลล้างหน้า และอื่น ๆ',
      fr: 'Des produits qui éliminent le maquillage, la crème solaire, les huiles et les impuretés: huiles et baumes démaquillants, eaux micellaires, nettoyants moussants, nettoyants en gel et plus encore.',
    },
    why: {
      ko: '깨끗이 씻어야 다음 제품이 제 역할을 할 수 있어요. 기름은 기름으로, 땀과 먼지는 물로 잘 녹기 때문에 종류가 나뉘어 있어요.',
      en: 'Clean skin lets the next products do their job. Oil dissolves oil while water lifts sweat and dust, which is why there are different types.',
      lo: 'ຜິວທີ່ສະອາດຊ່ວຍໃຫ້ຜະລິດຕະພັນຕໍ່ໄປເຮັດວຽກໄດ້ດີ. ນ້ຳມັນລະລາຍນ້ຳມັນ ສ່ວນນ້ຳລ້າງເຫື່ອ ແລະ ຂີ້ຝຸ່ນ ຈຶ່ງມີຫຼາຍປະເພດ.',
      th: 'ผิวที่สะอาดช่วยให้ผลิตภัณฑ์ถัดไปทำหน้าที่ได้ น้ำมันละลายน้ำมัน ส่วนน้ำช่วยชะเหงื่อและฝุ่น จึงมีหลายประเภท',
      fr: 'Une peau propre permet aux produits suivants de faire leur travail. L’huile dissout l’huile tandis que l’eau enlève la sueur et la poussière, c’est pourquoi il en existe différents types.',
    },
    when: {
      ko: '저녁엔 메이크업이나 선크림을 했다면 ‘이중 세안’(1차 오일·밤 → 2차 폼)이 도움이 돼요. 아침엔 물이나 순한 세안제로 가볍게 씻어요.',
      en: 'At night, if you wore makeup or sunscreen, a “double cleanse” (oil or balm first, then foam) helps. In the morning, a light wash with water or a gentle cleanser is enough.',
      lo: 'ຕອນແລງ ຖ້າແຕ່ງໜ້າ ຫຼື ທາຄຣີມກັນແດດ ການລ້າງໜ້າສອງຮອບ (ອອຍ ຫຼື ບາມກ່ອນ ແລ້ວຈຶ່ງໂຟມ) ຊ່ວຍໄດ້. ຕອນເຊົ້າ ລ້າງເບົາໆດ້ວຍນ້ຳ ຫຼື ໂຟມອ່ອນໆກໍພໍ.',
      th: 'ตอนกลางคืน ถ้าแต่งหน้าหรือทาครีมกันแดด การ “ล้างหน้าสองขั้นตอน” (ออยล์หรือบาล์มก่อน แล้วตามด้วยโฟม) จะช่วยได้ ตอนเช้า ล้างเบา ๆ ด้วยน้ำหรือคลีนเซอร์อ่อนโยนก็เพียงพอ',
      fr: 'Le soir, si vous avez porté du maquillage ou de la crème solaire, un « double nettoyage » (huile ou baume d’abord, puis mousse) aide. Le matin, un lavage léger à l’eau ou avec un nettoyant doux suffit.',
    },
    laoTip: {
      ko: '덥고 땀이 많아도 하루 두 번 세안이면 대개 충분해요. 너무 자주, 너무 뜨거운 물로 씻으면 오히려 당기고 건조해질 수 있어요. 미지근한 물을 쓰세요.',
      en: 'Even in hot, sweaty weather, washing twice a day is usually enough. Washing too often or with very hot water can leave skin tight and dry, so use lukewarm water.',
      lo: 'ເຖິງອາກາດຮ້ອນ ແລະ ອອກເຫື່ອຫຼາຍ ລ້າງໜ້າມື້ລະສອງເທື່ອກໍມັກພຽງພໍ. ລ້າງເລື້ອຍເກີນ ຫຼື ໃຊ້ນ້ຳຮ້ອນຫຼາຍ ອາດເຮັດໃຫ້ຜິວຕຶງ ແລະ ແຫ້ງ. ໃຊ້ນ້ຳອຸ່ນໆ.',
      th: 'แม้ในอากาศร้อนและเหงื่อออก การล้างหน้าวันละสองครั้งก็มักจะเพียงพอ การล้างบ่อยเกินไปหรือใช้น้ำร้อนจัดอาจทำให้ผิวตึงและแห้ง จึงควรใช้น้ำอุ่น',
      fr: 'Même par temps chaud et moite, se laver le visage deux fois par jour suffit généralement. Se laver trop souvent ou à l’eau très chaude peut laisser la peau tiraillée et sèche, utilisez donc de l’eau tiède.',
    },
  },
  {
    category: '바디케어',
    icon: '🧴',
    what: {
      ko: '바디워시, 바디로션·크림·오일, 바디 스크럽처럼 몸 피부를 위한 제품이에요.',
      en: 'Products for the skin on your body: body wash, body lotion, cream or oil, and body scrubs.',
      lo: 'ຜະລິດຕະພັນສຳລັບຜິວກາຍ: ສະບູອາບນ້ຳ, ໂລຊັນ, ຄຣີມ ຫຼື ນ້ຳມັນທາຜິວ ແລະ ສະຄຣັບຂັດຜິວ.',
      th: 'ผลิตภัณฑ์สำหรับผิวกาย: ครีมอาบน้ำ โลชั่นบำรุงผิวกาย ครีมหรือออยล์ และสครับขัดผิวกาย',
      fr: 'Des produits pour la peau du corps: gel douche, lotion pour le corps, crème ou huile, et gommages pour le corps.',
    },
    why: {
      ko: '몸은 얼굴보다 피부가 두껍고 면적이 넓어요. 그래서 넓게 잘 펴지고 빨리 스며드는 제형이 따로 만들어져요.',
      en: 'Body skin is thicker than facial skin and covers a much larger area, so body products are made to spread easily and absorb quickly.',
      lo: 'ຜິວກາຍໜາກວ່າຜິວໜ້າ ແລະ ມີພື້ນທີ່ກວ້າງກວ່າຫຼາຍ ຈຶ່ງເຮັດໃຫ້ທາງ່າຍ ແລະ ຊຶມໄວ.',
      th: 'ผิวกายหนากว่าผิวหน้าและครอบคลุมพื้นที่กว้างกว่ามาก ผลิตภัณฑ์สำหรับผิวกายจึงทำมาให้เกลี่ยง่ายและซึมเร็ว',
      fr: 'La peau du corps est plus épaisse que celle du visage et couvre une surface beaucoup plus grande, les produits pour le corps sont donc conçus pour s’étaler facilement et pénétrer rapidement.',
    },
    when: {
      ko: '샤워 후 물기가 살짝 남아 있을 때 로션을 바르면 촉촉함을 지키는 데 도움이 돼요. 스크럽은 주 1~2회 정도면 충분해요.',
      en: 'Applying lotion while skin is still slightly damp after a shower helps keep it moist. Scrubs once or twice a week are plenty.',
      lo: 'ທາໂລຊັນຫຼັງອາບນ້ຳ ຕອນຜິວຍັງຊຸ່ມໜ້ອຍໜຶ່ງ ຊ່ວຍໃຫ້ຜິວຊຸ່ມຊື່ນ. ສະຄຣັບອາທິດລະ 1–2 ເທື່ອກໍພຽງພໍ.',
      th: 'การทาโลชั่นตอนที่ผิวยังหมาด ๆ หลังอาบน้ำช่วยให้ผิวชุ่มชื้น สครับสัปดาห์ละหนึ่งหรือสองครั้งก็เพียงพอแล้ว',
      fr: 'Appliquer la lotion sur une peau encore légèrement humide après la douche aide à la garder hydratée. Un gommage une ou deux fois par semaine suffit largement.',
    },
    laoTip: {
      ko: '더운 날엔 가벼운 젤·로션, 건조한 11~2월엔 정강이와 팔꿈치에 크림을 발라 보세요. 반팔·반바지를 입을 땐 팔다리에도 선크림을 발라요.',
      en: 'Use light gels or lotions on hot days, and cream on shins and elbows in the dry season (November–February). When wearing short sleeves or shorts, put sunscreen on your arms and legs too.',
      lo: 'ມື້ຮ້ອນໃຊ້ເຈວ ຫຼື ໂລຊັນບາງໆ, ລະດູແລ້ງ (ພະຈິກ–ກຸມພາ) ທາຄຣີມທີ່ແຂ້ງ ແລະ ສອກ. ເວລານຸ່ງເສື້ອແຂນສັ້ນ ຫຼື ໂສ້ງຂາສັ້ນ ໃຫ້ທາຄຣີມກັນແດດທີ່ແຂນ ແລະ ຂານຳ.',
      th: 'ใช้เจลหรือโลชั่นเนื้อบางเบาในวันที่ร้อน และใช้ครีมที่หน้าแข้งและข้อศอกในฤดูแล้ง (พฤศจิกายน–กุมภาพันธ์) เมื่อสวมเสื้อแขนสั้นหรือกางเกงขาสั้น ให้ทาครีมกันแดดที่แขนและขาด้วย',
      fr: 'Utilisez des gels ou lotions légers les jours chauds, et de la crème sur les tibias et les coudes pendant la saison sèche (novembre–février). En manches courtes ou en short, mettez aussi de la crème solaire sur les bras et les jambes.',
    },
  },
  {
    category: '마스크팩',
    icon: '🎭',
    what: {
      ko: '에센스를 듬뿍 머금은 시트 마스크, 바르고 씻어내는 워시오프 마스크, 바르고 자는 슬리핑 마스크 등이 있어요.',
      en: 'Sheet masks soaked in essence, wash-off masks you rinse away, and sleeping masks you leave on overnight.',
      lo: 'ມີແຜ່ນມາສ໌ກທີ່ຊຸ່ມດ້ວຍເອສເຊັນ, ມາສ໌ກທີ່ທາແລ້ວລ້າງອອກ ແລະ ສະລີບປິ້ງມາສ໌ກທີ່ທາໄວ້ຂ້າມຄືນ.',
      th: 'มาสก์แผ่นที่ชุ่มด้วยเอสเซนส์ มาสก์แบบล้างออก และสลีปปิ้งมาสก์ที่ทิ้งไว้ข้ามคืน',
      fr: 'Les masques en tissu imbibés d’essence, les masques à rincer et les masques de nuit que l’on garde toute la nuit.',
    },
    why: {
      ko: '일정 시간 얼굴을 덮어서 수분과 성분을 ‘집중해서’ 주는 스페셜 케어예요. 매일 하는 기본 루틴과는 따로예요.',
      en: 'A special-care step that covers the face for a set time to give a concentrated boost of moisture. It is separate from your everyday routine.',
      lo: 'ເປັນການບຳລຸງພິເສດທີ່ປົກຄຸມໜ້າໄວ້ໄລຍະໜຶ່ງ ເພື່ອໃຫ້ຄວາມຊຸ່ມຊື່ນແບບເຂັ້ມຂຸ້ນ. ແຍກຈາກຂັ້ນຕອນປະຈຳວັນ.',
      th: 'ขั้นตอนดูแลพิเศษที่ปิดผิวหน้าไว้ตามเวลาที่กำหนด เพื่อเติมความชุ่มชื้นแบบเข้มข้น แยกจากรูทีนประจำวัน',
      fr: 'Une étape de soin spécial qui couvre le visage pendant un temps donné pour un apport concentré d’hydratation. Elle est distincte de votre routine quotidienne.',
    },
    when: {
      ko: '세안과 토너 후, 제품에 적힌 시간(보통 10~20분)만큼 붙여요. 떼어낸 뒤 남은 에센스를 두드리고 크림으로 마무리해요. 주 1~3회나 피부가 건조할 때 좋아요.',
      en: 'After cleansing and toner, leave it on for the time on the pack (often 10–20 minutes). Pat in the leftover essence, then finish with cream. Once to three times a week, or when skin feels dry.',
      lo: 'ຫຼັງລ້າງໜ້າ ແລະ ທາໂທນເນີ ແປະໄວ້ຕາມເວລາທີ່ຂຽນໃນຊອງ (ມັກແມ່ນ 10–20 ນາທີ). ແກະອອກແລ້ວຕົບເອສເຊັນທີ່ເຫຼືອໃຫ້ຊຶມ ແລ້ວທາຄຣີມ. ອາທິດລະ 1–3 ເທື່ອ ຫຼື ເວລາຜິວແຫ້ງ.',
      th: 'หลังล้างหน้าและทาโทนเนอร์ ให้ทิ้งไว้ตามเวลาที่ระบุบนซอง (มักเป็น 10–20 นาที) ตบเอสเซนส์ที่เหลือให้ซึม แล้วปิดท้ายด้วยครีม สัปดาห์ละหนึ่งถึงสามครั้ง หรือเมื่อรู้สึกว่าผิวแห้ง',
      fr: 'Après le nettoyage et la lotion tonique, laissez poser le temps indiqué sur l’emballage (souvent 10–20 minutes). Faites pénétrer le reste d’essence en tapotant, puis terminez par la crème. Une à trois fois par semaine, ou quand la peau semble sèche.',
    },
    laoTip: {
      ko: '햇볕을 많이 쬔 날엔 냉장고에 넣어 둔 시트 마스크가 시원하게 느껴져요(냉동은 피하세요). 시트가 바싹 마를 때까지 두지 말고 적힌 시간을 지켜요.',
      en: 'After a day in the sun, a sheet mask kept in the fridge feels refreshing (don’t freeze it). Don’t leave it on until it dries out — stick to the time on the pack.',
      lo: 'ຫຼັງມື້ທີ່ຖືກແດດຫຼາຍ ແຜ່ນມາສ໌ກທີ່ແຊ່ຕູ້ເຢັນຈະເຢັນສະບາຍ (ຢ່າແຊ່ແຂງ). ຢ່າແປະໄວ້ຈົນແຜ່ນແຫ້ງ ໃຫ້ແປະຕາມເວລາທີ່ຂຽນໄວ້.',
      th: 'หลังตากแดดมาทั้งวัน มาสก์แผ่นที่แช่ตู้เย็นไว้ให้ความรู้สึกสดชื่น (อย่าแช่แข็ง) อย่าทิ้งไว้จนแผ่นแห้ง — ใช้ตามเวลาที่ระบุบนซอง',
      fr: 'Après une journée au soleil, un masque en tissu gardé au réfrigérateur est rafraîchissant (ne le congelez pas). Ne le laissez pas jusqu’à ce qu’il sèche — respectez le temps indiqué sur l’emballage.',
    },
  },
  {
    category: '뷰티소품',
    icon: '🪞',
    what: {
      ko: '퍼프, 스펀지, 메이크업 브러시, 화장솜, 헤어밴드, 괄사(얼굴 마사지 도구) 같은 도구예요.',
      en: 'Tools such as puffs, sponges, makeup brushes, cotton pads, headbands and gua sha (a facial massage tool).',
      lo: 'ອຸປະກອນເຊັ່ນ ພັບ, ຟອງນ້ຳແຕ່ງໜ້າ, ແປງແຕ່ງໜ້າ, ສຳລີ, ຜ້າຄາດຜົມ ແລະ ກວາຊາ (ອຸປະກອນນວດໜ້າ).',
      th: 'อุปกรณ์ต่าง ๆ เช่น พัฟ ฟองน้ำ แปรงแต่งหน้า สำลี ที่คาดผม และกัวซา (อุปกรณ์นวดหน้า)',
      fr: 'Des accessoires comme les houppettes, éponges, pinceaux de maquillage, cotons, bandeaux et le gua sha (un outil de massage du visage).',
    },
    why: {
      ko: '같은 제품이라도 어떤 도구로 바르느냐에 따라 양과 밀착감이 달라져요. 깨끗한 도구가 깨끗한 피부의 시작이에요.',
      en: 'The same product goes on differently depending on the tool you use. Clean tools are the start of clean skin.',
      lo: 'ຜະລິດຕະພັນດຽວກັນ ແຕ່ທາດ້ວຍອຸປະກອນຕ່າງກັນ ຜົນກໍຕ່າງກັນ. ອຸປະກອນສະອາດ ແມ່ນຈຸດເລີ່ມຕົ້ນຂອງຜິວສະອາດ.',
      th: 'ผลิตภัณฑ์เดียวกันเมื่อทาจะออกมาต่างกันตามอุปกรณ์ที่ใช้ อุปกรณ์ที่สะอาดคือจุดเริ่มต้นของผิวที่สะอาด',
      fr: 'Un même produit s’applique différemment selon l’outil utilisé. Des outils propres sont le point de départ d’une peau propre.',
    },
    when: {
      ko: '스킨케어나 메이크업을 할 때 써요. 퍼프·스펀지·브러시는 일주일에 한 번 정도 씻어 주는 것이 좋아요.',
      en: 'Used during skincare and makeup. Wash puffs, sponges and brushes about once a week.',
      lo: 'ໃຊ້ເວລາບຳລຸງຜິວ ແລະ ແຕ່ງໜ້າ. ຄວນລ້າງພັບ, ຟອງນ້ຳ ແລະ ແປງ ປະມານອາທິດລະເທື່ອ.',
      th: 'ใช้ระหว่างการดูแลผิวและแต่งหน้า ล้างพัฟ ฟองน้ำ และแปรงประมาณสัปดาห์ละครั้ง',
      fr: 'Utilisés pendant les soins et le maquillage. Lavez houppettes, éponges et pinceaux environ une fois par semaine.',
    },
    laoTip: {
      ko: '습한 날씨엔 젖은 퍼프와 스펀지에 세균과 곰팡이가 생기기 쉬워요. 씻은 뒤 바람이 잘 통하는 곳에서 완전히 말리고, 낡으면 바꿔 주세요.',
      en: 'In humid weather, damp puffs and sponges easily grow bacteria and mould. After washing, dry them fully somewhere airy, and replace them when worn.',
      lo: 'ອາກາດຊຸ່ມ ພັບ ແລະ ຟອງນ້ຳທີ່ປຽກ ເກີດເຊື້ອແບັກທີເຣຍ ແລະ ເຊື້ອລາໄດ້ງ່າຍ. ລ້າງແລ້ວຕາກໃຫ້ແຫ້ງສະນິດໃນບ່ອນລົມຖ່າຍເທ ແລະ ປ່ຽນໃໝ່ເມື່ອເກົ່າ.',
      th: 'ในอากาศชื้น พัฟและฟองน้ำที่ชื้นอยู่จะเกิดแบคทีเรียและเชื้อราได้ง่าย หลังล้างแล้วให้ผึ่งให้แห้งสนิทในที่อากาศถ่ายเท และเปลี่ยนใหม่เมื่อเสื่อมสภาพ',
      fr: 'Par temps humide, les houppettes et éponges humides favorisent facilement les bactéries et les moisissures. Après lavage, laissez-les sécher complètement dans un endroit aéré, et remplacez-les lorsqu’elles sont usées.',
    },
  },
  {
    category: '기프트세트',
    icon: '🎁',
    what: {
      ko: '여러 제품을 한 상자에 담은 세트예요. 토너+크림 세트, 같은 라인 세트, 미니 사이즈 세트 등이 있어요.',
      en: 'Several products packed together in one box — a toner-and-cream set, a set from one product line, or a set of minis.',
      lo: 'ຊຸດທີ່ມີຜະລິດຕະພັນຫຼາຍຢ່າງໃນກ່ອງດຽວ ເຊັ່ນ ຊຸດໂທນເນີ ແລະ ຄຣີມ, ຊຸດຈາກລຸ້ນດຽວກັນ ຫຼື ຊຸດຂະໜາດນ້ອຍ.',
      th: 'ผลิตภัณฑ์หลายชิ้นรวมอยู่ในกล่องเดียว — เซ็ตโทนเนอร์กับครีม เซ็ตจากไลน์ผลิตภัณฑ์เดียวกัน หรือเซ็ตขนาดมินิ',
      fr: 'Plusieurs produits réunis dans une seule boîte — un coffret lotion tonique et crème, un coffret d’une même gamme ou un coffret de minis.',
    },
    why: {
      ko: '같은 라인 제품을 함께 써 보거나, 선물하기 좋게 구성한 거예요. 작은 용량으로 먼저 시험해 보기에도 좋아요.',
      en: 'Made for trying products from one line together, or for giving as a gift. They are also a good way to test small sizes first.',
      lo: 'ຈັດມາເພື່ອລອງໃຊ້ຜະລິດຕະພັນລຸ້ນດຽວກັນຮ່ວມກັນ ຫຼື ເພື່ອເປັນຂອງຂວັນ. ຍັງເໝາະສຳລັບລອງຂະໜາດນ້ອຍກ່ອນ.',
      th: 'ทำมาเพื่อทดลองใช้ผลิตภัณฑ์จากไลน์เดียวกันไปพร้อมกัน หรือเพื่อเป็นของขวัญ และยังเป็นวิธีที่ดีในการลองขนาดเล็กก่อน',
      fr: 'Conçus pour essayer ensemble les produits d’une même gamme, ou pour offrir. C’est aussi une bonne façon de tester d’abord de petits formats.',
    },
    when: {
      ko: '생일, 명절, 감사 선물로 좋아요. 처음 써 보는 라인을 시험해 볼 때도 좋아요.',
      en: 'Good for birthdays, holidays and thank-you gifts, or when you want to try a new line.',
      lo: 'ເໝາະເປັນຂອງຂວັນວັນເກີດ, ບຸນປີໃໝ່ ຫຼື ຂອບໃຈ ແລະ ເວລາຢາກລອງລຸ້ນໃໝ່.',
      th: 'เหมาะสำหรับวันเกิด วันหยุดเทศกาล และของขวัญขอบคุณ หรือเมื่ออยากลองไลน์ใหม่',
      fr: 'Bien adaptés aux anniversaires, aux fêtes et aux cadeaux de remerciement, ou quand vous voulez essayer une nouvelle gamme.',
    },
    laoTip: {
      ko: '선물하기 전에 받는 사람의 피부 타입(지성·건성 등)을 먼저 물어보세요. 더운 차 안에 오래 두면 내용물이 변할 수 있으니 서늘한 곳에 보관해요.',
      en: 'Before giving a set, ask about the person’s skin type (oily, dry and so on). Don’t leave it in a hot car — store it somewhere cool so the contents don’t change.',
      lo: 'ກ່ອນໃຫ້ ລອງຖາມປະເພດຜິວຂອງຜູ້ຮັບກ່ອນ (ຜິວມັນ, ຜິວແຫ້ງ ແລະ ອື່ນໆ). ຢ່າປະໄວ້ໃນລົດທີ່ຮ້ອນດົນ ເກັບໄວ້ບ່ອນເຢັນ ເພື່ອບໍ່ໃຫ້ເນື້ອໃນປ່ຽນ.',
      th: 'ก่อนให้เซ็ตเป็นของขวัญ ให้ถามสภาพผิวของผู้รับ (ผิวมัน ผิวแห้ง ฯลฯ) อย่าทิ้งไว้ในรถที่ร้อน — เก็บไว้ในที่เย็นเพื่อไม่ให้ผลิตภัณฑ์ข้างในเปลี่ยนสภาพ',
      fr: 'Avant d’offrir un coffret, renseignez-vous sur le type de peau de la personne (grasse, sèche, etc.). Ne le laissez pas dans une voiture chaude — rangez-le dans un endroit frais pour que le contenu ne s’altère pas.',
    },
  },
  {
    category: '토너',
    icon: '💦',
    what: {
      ko: '세안 후 가장 먼저 바르는 물처럼 묽은 제품이에요. 한국에서는 ‘스킨’이라고도 부르고, 화장솜 패드 형태도 있어요.',
      en: 'The watery product you apply first after cleansing. In Korea it is also called “skin”, and it also comes as soaked pads.',
      lo: 'ຜະລິດຕະພັນທີ່ບາງຄືນ້ຳ ທາເປັນອັນດັບທຳອິດຫຼັງລ້າງໜ້າ. ຢູ່ເກົາຫຼີເອີ້ນວ່າ “ສະກິນ” ແລະ ມີແບບແຜ່ນສຳລີຊຸບໄວ້ນຳ.',
      th: 'ผลิตภัณฑ์เนื้อน้ำที่ทาเป็นอย่างแรกหลังล้างหน้า ในเกาหลีเรียกอีกชื่อว่า “สกิน” และยังมีแบบแผ่นที่ชุ่มด้วยโทนเนอร์ด้วย',
      fr: 'Le produit aqueux que vous appliquez en premier après le nettoyage. En Corée, on l’appelle aussi « skin », et il existe aussi sous forme de disques imbibés.',
    },
    why: {
      ko: '세안 후 피부를 촉촉하게 정돈하고, 다음 제품이 잘 펴지도록 바탕을 만들어 줘요. 각질 제거 성분이 든 ‘닦아내는 토너’도 있는데, 매일 과하게 쓰지 않는 게 좋아요.',
      en: 'It refreshes and hydrates skin after cleansing and makes the next products spread more easily. Some “wipe-off” toners contain exfoliating ingredients — don’t overuse them every day.',
      lo: 'ຊ່ວຍໃຫ້ຜິວສົດຊື່ນ ແລະ ຊຸ່ມຫຼັງລ້າງໜ້າ ແລະ ເຮັດໃຫ້ຜະລິດຕະພັນຕໍ່ໄປທາໄດ້ງ່າຍ. ໂທນເນີແບບເຊັດບາງຕົວມີສ່ວນປະສົມຜັດເຊວຜິວ ບໍ່ຄວນໃຊ້ຫຼາຍເກີນທຸກມື້.',
      th: 'ช่วยให้ผิวสดชื่นและชุ่มชื้นหลังล้างหน้า และทำให้ผลิตภัณฑ์ถัดไปเกลี่ยง่ายขึ้น โทนเนอร์แบบ “เช็ดออก” บางตัวมีส่วนผสมที่ผลัดเซลล์ผิว — อย่าใช้มากเกินไปทุกวัน',
      fr: 'Elle rafraîchit et hydrate la peau après le nettoyage et aide les produits suivants à mieux s’étaler. Certaines lotions toniques « à essuyer » contiennent des ingrédients exfoliants — n’en abusez pas chaque jour.',
    },
    when: {
      ko: '아침·저녁 세안 직후에 발라요. 손바닥으로 가볍게 두드리거나 화장솜으로 피부결을 따라 닦아요.',
      en: 'Morning and night, right after cleansing. Pat it in with your palms or sweep it on with a cotton pad.',
      lo: 'ຕອນເຊົ້າ ແລະ ຕອນແລງ ທັນທີຫຼັງລ້າງໜ້າ. ຕົບເບົາໆດ້ວຍຝາມື ຫຼື ເຊັດດ້ວຍສຳລີ.',
      th: 'เช้าและเย็น ทันทีหลังล้างหน้า ตบให้ซึมด้วยฝ่ามือหรือเช็ดด้วยสำลี',
      fr: 'Matin et soir, juste après le nettoyage. Faites-la pénétrer en tapotant avec les paumes ou appliquez-la avec un coton.',
    },
    laoTip: {
      ko: '습한 계절에 지성 피부라면 토너와 가벼운 크림만으로도 충분할 수 있어요. 냉장고에 둔 토너를 화장솜에 적셔 잠깐 올려 두면 시원해요.',
      en: 'For oily skin in the humid season, toner plus a light cream may be enough. Soaking a cotton pad in fridge-cool toner and resting it on the skin for a moment feels refreshing.',
      lo: 'ຖ້າເປັນຜິວມັນໃນລະດູຊຸ່ມ ໂທນເນີ ກັບ ຄຣີມບາງໆ ອາດພຽງພໍ. ເອົາສຳລີຊຸບໂທນເນີທີ່ແຊ່ຕູ້ເຢັນ ວາງໄວ້ເທິງຜິວແປບໜຶ່ງ ຈະເຢັນສະບາຍ.',
      th: 'สำหรับผิวมันในฤดูชื้น โทนเนอร์กับครีมเนื้อบางเบาอาจเพียงพอ การชุบสำลีด้วยโทนเนอร์ที่แช่เย็นแล้ววางพักบนผิวสักครู่ให้ความรู้สึกสดชื่น',
      fr: 'Pour les peaux grasses pendant la saison humide, lotion tonique et crème légère peuvent suffire. Imbiber un coton de lotion tonique fraîche sortie du réfrigérateur et le poser un moment sur la peau est rafraîchissant.',
    },
  },
  {
    category: '메이크업',
    icon: '💄',
    what: {
      ko: '쿠션·파운데이션, 컨실러, 파우더, 아이섀도, 아이라이너, 블러셔, 립스틱처럼 얼굴을 표현하는 제품이에요.',
      en: 'Products that express your look: cushions and foundations, concealer, powder, eyeshadow, eyeliner, blush and lipstick.',
      lo: 'ຜະລິດຕະພັນແຕ່ງໜ້າ: ຄຸດຊັນ ແລະ ຮອງພື້ນ, ຄອນຊີລເລີ, ແປ້ງ, ອາຍແຊໂດ, ອາຍລາຍເນີ, ບລັດອອນ ແລະ ລິບສະຕິກ.',
      th: 'ผลิตภัณฑ์ที่สะท้อนลุคของคุณ: คุชชั่นและรองพื้น คอนซีลเลอร์ แป้ง อายแชโดว์ อายไลเนอร์ บลัชออน และลิปสติก',
      fr: 'Des produits qui expriment votre look: cushions et fonds de teint, anticernes, poudre, fard à paupières, eye-liner, blush et rouge à lèvres.',
    },
    why: {
      ko: '스킨케어가 피부를 ‘가꾸는’ 일이라면, 메이크업은 ‘보여주는’ 일이에요. 피부톤을 정리하고 나만의 개성을 표현해요.',
      en: 'Skincare looks after the skin; makeup is about how you present yourself — evening out tone and showing your personal style.',
      lo: 'ການບຳລຸງຜິວແມ່ນເບິ່ງແຍງຜິວ ສ່ວນເມກອັບແມ່ນການສະແດງອອກ — ປັບສີຜິວໃຫ້ສະໝ່ຳສະເໝີ ແລະ ສະແດງຄວາມເປັນຕົວເອງ.',
      th: 'สกินแคร์ดูแลผิว ส่วนเมคอัพคือการนำเสนอตัวเอง — ปรับสีผิวให้สม่ำเสมอและแสดงสไตล์ของคุณ',
      fr: 'Les soins prennent soin de la peau; le maquillage, c’est la façon dont vous vous présentez — unifier le teint et montrer votre style personnel.',
    },
    when: {
      ko: '스킨케어와 선크림을 모두 바른 뒤에 해요. 밤에는 반드시 클렌징으로 깨끗이 지워요.',
      en: 'After all skincare and sunscreen. At night, always remove it completely with a cleanser.',
      lo: 'ແຕ່ງໜ້າຫຼັງທາບຳລຸງຜິວ ແລະ ຄຣີມກັນແດດແລ້ວ. ຕອນກາງຄືນ ຕ້ອງລ້າງອອກໃຫ້ໝົດດ້ວຍຄລີນຊິ່ງທຸກເທື່ອ.',
      th: 'หลังการดูแลผิวและครีมกันแดดทั้งหมด ตอนกลางคืน ต้องล้างออกให้หมดด้วยคลีนเซอร์ทุกครั้ง',
      fr: 'Après tous les soins et la crème solaire. Le soir, retirez-le toujours complètement avec un nettoyant.',
    },
    laoTip: {
      ko: '땀이 많은 날엔 얇게 여러 번 바르고 파우더로 마무리하면 덜 무너져요. 쿠션에 SPF가 있어도 보통 얇게 바르기 때문에 선크림을 대신하기는 어려워요.',
      en: 'On sweaty days, thin layers finished with powder last longer. Even if a cushion has SPF, it is usually applied too thinly to replace sunscreen.',
      lo: 'ມື້ທີ່ອອກເຫື່ອຫຼາຍ ທາບາງໆຫຼາຍຊັ້ນ ແລ້ວປິດດ້ວຍແປ້ງ ຈະຕິດທົນກວ່າ. ເຖິງຄຸດຊັນຈະມີ SPF ແຕ່ມັກທາບາງເກີນ ຈຶ່ງໃຊ້ແທນຄຣີມກັນແດດບໍ່ໄດ້.',
      th: 'ในวันที่เหงื่อออก การลงบาง ๆ แล้วเซ็ตด้วยแป้งจะติดทนกว่า แม้คุชชั่นจะมี SPF ก็มักทาบางเกินกว่าจะใช้แทนครีมกันแดดได้',
      fr: 'Les jours où l’on transpire, des couches fines fixées à la poudre tiennent plus longtemps. Même si un cushion contient un SPF, il est généralement appliqué en couche trop fine pour remplacer la crème solaire.',
    },
  },
  {
    category: '핸드크림',
    icon: '🤲',
    what: {
      ko: '손을 위한 보습 크림이에요.',
      en: 'A moisturising cream made for hands.',
      lo: 'ຄຣີມບຳລຸງຄວາມຊຸ່ມຊື່ນສຳລັບມື.',
      th: 'ครีมบำรุงความชุ่มชื้นที่ทำมาสำหรับมือ',
      fr: 'Une crème hydratante conçue pour les mains.',
    },
    why: {
      ko: '손은 자주 씻고 손 소독제를 써서 쉽게 건조해져요. 핸드크림은 끈적이지 않고 빨리 스며들도록 만들어서, 바른 뒤에도 일하거나 휴대폰을 쓰기 편해요.',
      en: 'Hands dry out from frequent washing and hand sanitiser. Hand creams are made to absorb fast without stickiness, so you can keep working or use your phone right after.',
      lo: 'ມືແຫ້ງງ່າຍເພາະລ້າງເລື້ອຍໆ ແລະ ໃຊ້ເຈວລ້າງມື. ຄຣີມທາມືເຮັດໃຫ້ຊຶມໄວ ບໍ່ໜຽວ ທາແລ້ວກໍເຮັດວຽກ ຫຼື ໃຊ້ໂທລະສັບໄດ້ເລີຍ.',
      th: 'มือแห้งจากการล้างบ่อยและเจลล้างมือ แฮนด์ครีมจึงทำมาให้ซึมเร็วโดยไม่เหนอะหนะ คุณจึงทำงานต่อหรือใช้โทรศัพท์ได้ทันที',
      fr: 'Les mains se dessèchent à cause des lavages fréquents et du gel hydroalcoolique. Les crèmes pour les mains sont conçues pour pénétrer vite sans coller, afin que vous puissiez continuer à travailler ou utiliser votre téléphone tout de suite.',
    },
    when: {
      ko: '손을 씻은 뒤마다, 그리고 자기 전에 넉넉히 발라요.',
      en: 'After each hand wash, and generously before bed.',
      lo: 'ຫຼັງລ້າງມືທຸກເທື່ອ ແລະ ທາຫຼາຍໆກ່ອນນອນ.',
      th: 'หลังล้างมือทุกครั้ง และทาให้มากก่อนนอน',
      fr: 'Après chaque lavage des mains, et généreusement avant le coucher.',
    },
    laoTip: {
      ko: '손등은 운전하거나 오토바이를 탈 때 햇빛을 많이 받아요. 낮에는 손등에 선크림도 발라 주세요. 에어컨 사무실에서 일한다면 책상 위에 하나 두세요.',
      en: 'The backs of your hands get a lot of sun when driving or riding a motorbike, so put sunscreen on them during the day. If you work in an air-conditioned office, keep a tube on your desk.',
      lo: 'ຫຼັງມືຖືກແດດຫຼາຍເວລາຂັບລົດ ຫຼື ຂີ່ລົດຈັກ ຕອນກາງເວັນໃຫ້ທາຄຣີມກັນແດດທີ່ຫຼັງມືນຳ. ຖ້າເຮັດວຽກໃນຫ້ອງແອ ວາງໄວ້ໜຶ່ງຫຼອດເທິງໂຕະ.',
      th: 'หลังมือโดนแดดมากเวลาขับรถหรือขี่มอเตอร์ไซค์ จึงควรทาครีมกันแดดที่หลังมือในตอนกลางวัน ถ้าทำงานในออฟฟิศที่มีแอร์ ให้วางหลอดหนึ่งไว้บนโต๊ะ',
      fr: 'Le dos des mains reçoit beaucoup de soleil en voiture ou à moto, alors mettez-y de la crème solaire pendant la journée. Si vous travaillez dans un bureau climatisé, gardez un tube sur votre bureau.',
    },
  },
  {
    category: '아이케어',
    icon: '👁️',
    what: {
      ko: '눈가 피부를 위한 아이크림, 아이세럼, 아이패치 같은 제품이에요.',
      en: 'Eye creams, eye serums and eye patches made for the skin around the eyes.',
      lo: 'ຄຣີມຮອບຕາ, ເຊຣັ່ມຮອບຕາ ແລະ ແຜ່ນແປະໃຕ້ຕາ ສຳລັບຜິວຮອບດວງຕາ.',
      th: 'อายครีม อายเซรั่ม และอายแพตช์ที่ทำมาสำหรับผิวรอบดวงตา',
      fr: 'Crèmes, sérums et patchs pour les yeux conçus pour la peau du contour des yeux.',
    },
    why: {
      ko: '눈가 피부는 얼굴의 다른 곳보다 얇고 많이 움직이며 피지가 적어서 건조해지기 쉬워요. 그래서 자극을 줄이고 눈가에 맞춘 제품이 따로 있어요.',
      en: 'The skin around the eyes is thinner than elsewhere on the face, moves a lot and has little oil, so it dries easily. Eye products are made gentler to suit it.',
      lo: 'ຜິວຮອບດວງຕາບາງກວ່າສ່ວນອື່ນຂອງໜ້າ, ເຄື່ອນໄຫວຫຼາຍ ແລະ ມີນ້ຳມັນໜ້ອຍ ຈຶ່ງແຫ້ງງ່າຍ. ຜະລິດຕະພັນຮອບຕາຈຶ່ງເຮັດໃຫ້ອ່ອນໂຍນກວ່າ.',
      th: 'ผิวรอบดวงตาบางกว่าส่วนอื่นของใบหน้า เคลื่อนไหวบ่อย และมีน้ำมันน้อย จึงแห้งง่าย ผลิตภัณฑ์รอบดวงตาจึงทำมาให้อ่อนโยนกว่าเพื่อให้เหมาะกับผิวบริเวณนี้',
      fr: 'La peau du contour des yeux est plus fine qu’ailleurs sur le visage, bouge beaucoup et a peu de sébum, elle se dessèche donc facilement. Les produits pour les yeux sont formulés plus doux pour lui convenir.',
    },
    when: {
      ko: '세럼 다음, 크림 전에 발라요. 쌀알만큼 덜어 약지로 톡톡 두드려요. 눈 안에 들어가지 않게 조심하세요.',
      en: 'After serum and before cream. Take a rice-grain-sized amount and pat it in with your ring finger. Keep it out of your eyes.',
      lo: 'ຫຼັງເຊຣັ່ມ ແລະ ກ່ອນຄຣີມ. ເອົາປະມານເມັດເຂົ້າໜຶ່ງ ແລ້ວຕົບເບົາໆດ້ວຍນິ້ວນາງ. ລະວັງຢ່າໃຫ້ເຂົ້າຕາ.',
      th: 'หลังเซรั่มและก่อนครีม ใช้ปริมาณเท่าเมล็ดข้าว แล้วตบให้ซึมด้วยนิ้วนาง ระวังอย่าให้เข้าตา',
      fr: 'Après le sérum et avant la crème. Prenez une quantité de la taille d’un grain de riz et faites pénétrer en tapotant avec l’annulaire. Évitez le contact avec les yeux.',
    },
    laoTip: {
      ko: '강한 햇빛에 눈을 자주 찡그리게 돼요. 선글라스와 챙 넓은 모자를 함께 쓰면 눈가를 지키는 데 도움이 돼요.',
      en: 'Strong sun makes you squint a lot. Sunglasses and a wide-brimmed hat help protect the eye area.',
      lo: 'ແດດແຮງເຮັດໃຫ້ຫຍີ່ຕາເລື້ອຍໆ. ໃສ່ແວ່ນຕາກັນແດດ ແລະ ໝວກປີກກວ້າງ ຊ່ວຍປົກປ້ອງຜິວຮອບຕາໄດ້.',
      th: 'แดดแรงทำให้ต้องหรี่ตาบ่อย แว่นกันแดดและหมวกปีกกว้างช่วยปกป้องบริเวณรอบดวงตา',
      fr: 'Un soleil fort fait beaucoup plisser les yeux. Des lunettes de soleil et un chapeau à larges bords aident à protéger le contour des yeux.',
    },
  },
  {
    category: '립케어',
    icon: '👄',
    what: {
      ko: '립밤, 립 마스크, 립 스크럽, 색이 살짝 있는 컬러 립밤 같은 입술 전용 제품이에요.',
      en: 'Products just for lips: lip balm, lip masks, lip scrubs and tinted lip balms.',
      lo: 'ຜະລິດຕະພັນສະເພາະສົບ: ລິບບາມ, ລິບມາສ໌ກ, ລິບສະຄຣັບ ແລະ ລິບບາມມີສີ.',
      th: 'ผลิตภัณฑ์สำหรับริมฝีปากโดยเฉพาะ: ลิปบาล์ม ลิปมาสก์ ลิปสครับ และลิปบาล์มมีสี',
      fr: 'Des produits rien que pour les lèvres: baumes à lèvres, masques pour les lèvres, gommages pour les lèvres et baumes à lèvres teintés.',
    },
    why: {
      ko: '입술은 피지(기름)가 거의 나오지 않아 스스로 촉촉함을 지키기 어렵고 쉽게 갈라져요. 그래서 입술을 덮어 주는 제품이 따로 필요해요.',
      en: 'Lips make almost no oil of their own, so they struggle to stay moist and crack easily. A separate product that coats them helps.',
      lo: 'ສົບແທບບໍ່ມີນ້ຳມັນຂອງຕົວເອງ ຈຶ່ງເກັບຄວາມຊຸ່ມໄວ້ໄດ້ຍາກ ແລະ ແຕກງ່າຍ. ຈຶ່ງຕ້ອງມີຜະລິດຕະພັນເຄືອບສົບແຍກຕ່າງຫາກ.',
      th: 'ริมฝีปากแทบไม่ผลิตน้ำมันเอง จึงเก็บความชุ่มชื้นได้ยากและแตกง่าย ผลิตภัณฑ์แยกที่เคลือบริมฝีปากไว้จะช่วยได้',
      fr: 'Les lèvres ne produisent presque pas de sébum, elles ont donc du mal à rester hydratées et se gercent facilement. Un produit dédié qui les enrobe aide.',
    },
    when: {
      ko: '수시로 바르고, 립스틱 전에 얇게 바탕으로, 자기 전에는 도톰하게 발라요.',
      en: 'Any time during the day, as a thin base before lipstick, and in a thicker layer before bed.',
      lo: 'ທາໄດ້ຕະຫຼອດມື້, ທາບາງໆກ່ອນລິບສະຕິກ ແລະ ທາໜາໆກ່ອນນອນ.',
      th: 'ทาได้ทุกเวลาระหว่างวัน ทาบาง ๆ เป็นเบสก่อนลิปสติก และทาหนา ๆ ก่อนนอน',
      fr: 'À tout moment de la journée, en fine couche de base avant le rouge à lèvres, et en couche plus épaisse avant le coucher.',
    },
    laoTip: {
      ko: '입술도 햇볕에 탈 수 있어서 낮에는 SPF가 있는 립밤이 도움이 될 수 있어요. 건조한 11~2월엔 더 자주 바르고, 입술을 핥지 마세요.',
      en: 'Lips can burn in the sun too, so a lip balm with SPF may help during the day. In the dry season (November–February) apply more often, and try not to lick your lips.',
      lo: 'ສົບກໍໄໝ້ແດດໄດ້ ຕອນກາງເວັນລິບບາມທີ່ມີ SPF ອາດຊ່ວຍໄດ້. ລະດູແລ້ງ (ພະຈິກ–ກຸມພາ) ທາເລື້ອຍຂຶ້ນ ແລະ ຢ່າເລຍສົບ.',
      th: 'ริมฝีปากก็ไหม้แดดได้เช่นกัน ลิปบาล์มที่มี SPF จึงอาจช่วยได้ในตอนกลางวัน ในฤดูแล้ง (พฤศจิกายน–กุมภาพันธ์) ให้ทาบ่อยขึ้น และพยายามอย่าเลียริมฝีปาก',
      fr: 'Les lèvres peuvent aussi brûler au soleil, un baume à lèvres avec SPF peut donc aider pendant la journée. Pendant la saison sèche (novembre–février), appliquez-en plus souvent et essayez de ne pas vous lécher les lèvres.',
    },
  },
  {
    category: '향수',
    icon: '🌸',
    what: {
      ko: '향료를 알코올 등에 녹인 제품이에요. 향의 진하기에 따라 퍼퓸 > 오 드 퍼퓸 > 오 드 뚜왈렛 > 오 드 코롱 순으로 나뉘어요.',
      en: 'Fragrance oils dissolved mainly in alcohol. By strength they run parfum > eau de parfum > eau de toilette > eau de cologne.',
      lo: 'ນ້ຳຫອມທີ່ລະລາຍໃນແອວກໍຮໍເປັນສ່ວນໃຫຍ່. ຕາມຄວາມເຂັ້ມຂອງກິ່ນ: ພາຟູມ > ໂອ ເດີ ພາຟູມ > ໂອ ເດີ ທົວເລັດ > ໂອ ເດີ ໂຄໂລນ.',
      th: 'น้ำมันหอมที่ละลายในแอลกอฮอล์เป็นหลัก เรียงตามความเข้มข้นได้แก่ parfum > eau de parfum > eau de toilette > eau de cologne',
      fr: 'Des huiles parfumées dissoutes principalement dans l’alcool. Par ordre de concentration: parfum > eau de parfum > eau de toilette > eau de cologne.',
    },
    why: {
      ko: '피부를 가꾸는 제품이 아니라 기분과 개성을 위한 제품이에요. 그래서 스킨케어와는 다른 카테고리예요.',
      en: 'It isn’t for skin care — it is about mood and personality, which is why it is its own category.',
      lo: 'ບໍ່ແມ່ນສຳລັບບຳລຸງຜິວ ແຕ່ເພື່ອອາລົມ ແລະ ຄວາມເປັນຕົວເອງ ຈຶ່ງເປັນໝວດແຍກຕ່າງຫາກ.',
      th: 'น้ำหอมไม่ได้มีไว้ดูแลผิว — แต่เกี่ยวกับอารมณ์และบุคลิก จึงแยกเป็นหมวดของตัวเอง',
      fr: 'Il ne sert pas aux soins de la peau — il touche à l’humeur et à la personnalité, c’est pourquoi il forme sa propre catégorie.',
    },
    when: {
      ko: '샤워하고 보습한 뒤, 손목·목 뒤·귀 뒤처럼 맥박이 느껴지는 곳에 1~2번 뿌려요. 뿌린 뒤 손목을 비비지 않는 것이 좋아요.',
      en: 'After showering and moisturising, spray once or twice on pulse points such as wrists, the back of the neck or behind the ears. Try not to rub your wrists together afterwards.',
      lo: 'ຫຼັງອາບນ້ຳ ແລະ ທາໂລຊັນ ສີດ 1–2 ເທື່ອທີ່ຈຸດຊີບພະຈອນ ເຊັ່ນ ຂໍ້ມື, ຫຼັງຄໍ ຫຼື ຫຼັງຫູ. ສີດແລ້ວບໍ່ຄວນຖູຂໍ້ມືເຂົ້າກັນ.',
      th: 'หลังอาบน้ำและบำรุงผิว ฉีดหนึ่งหรือสองครั้งที่จุดชีพจร เช่น ข้อมือ ต้นคอด้านหลัง หรือหลังใบหู พยายามอย่าถูข้อมือเข้าหากันหลังฉีด',
      fr: 'Après la douche et l’hydratation, vaporisez une ou deux fois sur les points de pulsation comme les poignets, la nuque ou derrière les oreilles. Évitez ensuite de frotter vos poignets l’un contre l’autre.',
    },
    laoTip: {
      ko: '더운 날엔 향이 더 강하게 퍼지니 양을 줄이고 상큼한 시트러스나 가벼운 플로럴 향을 골라 보세요. 일부 향 성분은 햇빛을 받으면 피부에 얼룩을 남길 수 있어서, 햇볕 아래에선 옷이나 머리끝에 뿌리는 편이 좋아요. 향수병은 햇빛과 열을 피해 보관하세요.',
      en: 'Scent spreads more strongly in the heat, so use less and try fresh citrus or light floral scents. Some fragrance ingredients can leave marks on skin in sunlight, so outdoors spray clothes or hair ends instead. Keep bottles away from sun and heat.',
      lo: 'ອາກາດຮ້ອນເຮັດໃຫ້ກິ່ນແຮງຂຶ້ນ ໃຫ້ສີດໜ້ອຍລົງ ແລະ ລອງກິ່ນໝາກນາວ ຫຼື ກິ່ນດອກໄມ້ເບົາໆ. ສ່ວນປະສົມກິ່ນບາງຢ່າງອາດເຮັດໃຫ້ຜິວເປັນຮອຍເມື່ອຖືກແດດ ເວລາຢູ່ກາງແຈ້ງຈຶ່ງສີດໃສ່ເສື້ອ ຫຼື ປາຍຜົມແທນ. ເກັບຂວດນ້ຳຫອມໃຫ້ໄກຈາກແດດ ແລະ ຄວາມຮ້ອນ.',
      th: 'ในอากาศร้อน กลิ่นจะกระจายแรงขึ้น จึงควรใช้น้อยลงและลองกลิ่นซิตรัสสดชื่นหรือกลิ่นดอกไม้เบา ๆ ส่วนผสมน้ำหอมบางชนิดอาจทิ้งรอยบนผิวเมื่อโดนแดด เมื่ออยู่กลางแจ้งจึงควรฉีดที่เสื้อผ้าหรือปลายผมแทน เก็บขวดให้ห่างจากแดดและความร้อน',
      fr: 'Le parfum se diffuse plus fortement à la chaleur, alors utilisez-en moins et essayez des notes fraîches d’agrumes ou florales légères. Certains ingrédients parfumés peuvent laisser des marques sur la peau au soleil: à l’extérieur, vaporisez plutôt les vêtements ou les pointes des cheveux. Gardez les flacons à l’abri du soleil et de la chaleur.',
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
      th: 'ตอนเช้า: ล้างเบา ๆ ด้วยน้ำหรือคลีนเซอร์อ่อนโยน ตอนเย็น: ล้างครีมกันแดดและเครื่องสำอางออกให้หมด (ล้างหน้าสองขั้นตอนถ้าจำเป็น)',
      fr: 'Le matin: un lavage léger à l’eau ou avec un nettoyant doux. Le soir: retirez complètement crème solaire et maquillage (double nettoyage si besoin).',
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
      th: 'ทันทีหลังล้างหน้า เพื่อให้ผิวสดชื่นและชุ่มชื้น',
      fr: 'Juste après le nettoyage, pour rafraîchir et hydrater.',
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
      th: 'เริ่มจากตัวที่เหมาะกับปัญหาผิวของคุณ ถ้าใช้หลายตัว ให้ทาตัวที่เนื้อบางที่สุดก่อน',
      fr: 'Commencez par celui qui correspond à votre préoccupation. Si vous en utilisez plusieurs, le plus fluide d’abord.',
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
      th: 'ไม่บังคับ ใช้ปริมาณเท่าเมล็ดข้าว ตบให้ซึมด้วยนิ้วนาง',
      fr: 'Facultatif. Une quantité de la taille d’un grain de riz, appliquée en tapotant avec l’annulaire.',
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
      th: 'ฝาปิดที่กักความชุ่มชื้นไว้ ในวันที่ร้อนชื้น แบบเจลเนื้อบางเบาใช้ได้ดี',
      fr: 'Le couvercle qui retient l’hydratation. Les jours chauds et humides, une texture gel légère convient bien.',
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
      th: 'เฉพาะตอนเช้า เป็นขั้นตอนสุดท้ายของการดูแลผิว ใช้ปริมาณยาวเท่าสองนิ้วสำหรับใบหน้า เมื่ออยู่กลางแจ้ง ให้ทาซ้ำประมาณทุก 2 ชั่วโมง',
      fr: 'Le matin uniquement, comme dernière étape de soin. Deux longueurs de doigt pour le visage; à l’extérieur, réappliquez environ toutes les 2 heures.',
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
      th: 'SPF หมายถึงอะไร?',
      fr: 'Que signifie SPF?',
    },
    body: {
      ko: 'SPF는 피부를 붉게 태우는 자외선 B(UVB)를 막는 정도예요. SPF 30은 UVB의 약 97%, SPF 50은 약 98%를 막아서, 숫자가 두 배라고 보호가 두 배인 건 아니에요. 매일 쓰기엔 SPF 30 이상이 흔히 권장돼요.',
      en: 'SPF shows how well a product blocks UVB, the rays that cause sunburn. SPF 30 blocks about 97% of UVB and SPF 50 about 98%, so double the number is not double the protection. SPF 30 or higher is commonly recommended for daily use.',
      lo: 'SPF ບອກວ່າກັນລັງສີ UVB (ລັງສີທີ່ເຮັດໃຫ້ຜິວໄໝ້ແດງ) ໄດ້ຫຼາຍປານໃດ. SPF 30 ກັນ UVB ໄດ້ປະມານ 97%, SPF 50 ປະມານ 98% ຕົວເລກສອງເທົ່າບໍ່ໄດ້ໝາຍຄວາມວ່າປ້ອງກັນສອງເທົ່າ. ການໃຊ້ປະຈຳວັນມັກແນະນຳ SPF 30 ຂຶ້ນໄປ.',
      th: 'SPF บอกว่าผลิตภัณฑ์ป้องกันรังสี UVB ซึ่งเป็นรังสีที่ทำให้ผิวไหม้แดดได้ดีแค่ไหน SPF 30 ป้องกัน UVB ได้ประมาณ 97% และ SPF 50 ประมาณ 98% ตัวเลขที่เพิ่มเป็นสองเท่าจึงไม่ได้หมายถึงการป้องกันที่เพิ่มเป็นสองเท่า โดยทั่วไปแนะนำ SPF 30 ขึ้นไปสำหรับการใช้ทุกวัน',
      fr: 'Le SPF indique dans quelle mesure un produit bloque les UVB, les rayons qui provoquent les coups de soleil. Le SPF 30 bloque environ 97% des UVB et le SPF 50 environ 98%: doubler le chiffre ne double donc pas la protection. Un SPF 30 ou plus est couramment recommandé pour un usage quotidien.',
    },
  },
  {
    icon: '➕',
    title: {
      ko: 'PA+는 무슨 뜻일까요?',
      en: 'What does PA+ mean?',
      lo: 'PA+ ໝາຍຄວາມວ່າແນວໃດ?',
      th: 'PA+ หมายถึงอะไร?',
      fr: 'Que signifie PA+?',
    },
    body: {
      ko: 'PA는 피부 깊이 들어와 피부를 검게 그을리게 하고 노화와 관련된 자외선 A(UVA)를 막는 정도예요. PA+부터 PA++++까지 있고, +가 많을수록 차단이 강해요. 일본에서 시작된 표시이고 한국 선크림에도 쓰여요.',
      en: 'PA shows protection against UVA, the rays that go deeper into skin, cause tanning and are linked to skin ageing. It runs from PA+ to PA++++ — more plus signs mean stronger protection. The system started in Japan and is used on Korean sunscreens too.',
      lo: 'PA ບອກການປ້ອງກັນລັງສີ UVA ເຊິ່ງເຂົ້າເລິກໃນຜິວ ເຮັດໃຫ້ຜິວຄ້ຳ ແລະ ກ່ຽວຂ້ອງກັບຜິວແກ່ກ່ອນໄວ. ມີຕັ້ງແຕ່ PA+ ຫາ PA++++ — ເຄື່ອງໝາຍ + ຫຼາຍ ປ້ອງກັນໄດ້ແຮງຂຶ້ນ. ລະບົບນີ້ເລີ່ມຈາກຍີ່ປຸ່ນ ແລະ ໃຊ້ໃນຄຣີມກັນແດດເກົາຫຼີນຳ.',
      th: 'PA บอกระดับการป้องกันรังสี UVA ซึ่งเป็นรังสีที่ลงลึกสู่ผิว ทำให้ผิวคล้ำ และเกี่ยวข้องกับความเสื่อมของผิวตามวัย มีตั้งแต่ PA+ ถึง PA++++ — ยิ่งมีเครื่องหมายบวกมาก ยิ่งป้องกันได้มาก ระบบนี้เริ่มต้นในญี่ปุ่นและใช้กับครีมกันแดดเกาหลีด้วย',
      fr: 'Le PA indique la protection contre les UVA, les rayons qui pénètrent plus profondément dans la peau, font bronzer et sont liés au vieillissement cutané. Il va de PA+ à PA++++ — plus il y a de signes plus, plus la protection est forte. Ce système est né au Japon et est aussi utilisé sur les crèmes solaires coréennes.',
    },
  },
  {
    icon: '🤞',
    title: {
      ko: '얼마나 발라야 할까요?',
      en: 'How much should you use?',
      lo: 'ຄວນທາຫຼາຍປານໃດ?',
      th: 'ควรใช้ปริมาณเท่าไร?',
      fr: 'Quelle quantité utiliser?',
    },
    body: {
      ko: 'SPF는 피부 1㎠에 2mg을 바른 상태로 시험해요. 얼굴 전체엔 약 1/4 티스푼, 즉 검지와 중지에 길게 짠 두 줄 정도예요. 이보다 적게 바르면 표시된 만큼 보호받기 어려워요.',
      en: 'SPF is tested at 2 mg of sunscreen per square centimetre of skin. For the whole face, that is about a quarter teaspoon — roughly a line along your index and middle fingers. Use less and you get less protection than the label says.',
      lo: 'SPF ທົດສອບໂດຍທາ 2 ມິນລິກຣາມ ຕໍ່ຜິວ 1 ຕາແມັດເຊັນຕິແມັດ. ໜ້າທັງໝົດໃຊ້ປະມານ 1/4 ບ່ວງກາເຟ ຫຼື ບີບເປັນເສັ້ນຍາວຕາມນິ້ວຊີ້ ແລະ ນິ້ວກາງ. ຖ້າທາໜ້ອຍກວ່ານີ້ ຈະປ້ອງກັນໄດ້ໜ້ອຍກວ່າທີ່ຂຽນໄວ້.',
      th: 'SPF ทดสอบที่ครีมกันแดด 2 mg ต่อผิว 1 ตารางเซนติเมตร สำหรับทั้งใบหน้า เท่ากับประมาณหนึ่งในสี่ช้อนชา — ราว ๆ หนึ่งเส้นยาวตลอดนิ้วชี้และนิ้วกลาง ถ้าใช้น้อยกว่านี้ จะได้รับการป้องกันน้อยกว่าที่ระบุบนฉลาก',
      fr: 'Le SPF est testé avec 2 mg de crème solaire par centimètre carré de peau. Pour tout le visage, cela représente environ un quart de cuillère à café — à peu près une ligne le long de l’index et du majeur. Si vous en mettez moins, la protection est inférieure à celle indiquée sur l’étiquette.',
    },
  },
  {
    icon: '⏰',
    title: {
      ko: '다시 바르기',
      en: 'Reapply',
      lo: 'ທາຊ້ຳ',
      th: 'ทาซ้ำ',
      fr: 'Réappliquer',
    },
    body: {
      ko: '밖에 있다면 약 2시간마다 다시 발라요. 땀을 많이 흘렸거나, 물놀이를 했거나, 수건으로 닦았다면 바로 다시 발라요. ‘워터프루프(내수성)’ 제품도 마찬가지예요.',
      en: 'When outdoors, reapply about every 2 hours — and straight away after heavy sweating, swimming or towelling off. This applies to water-resistant products too.',
      lo: 'ເວລາຢູ່ກາງແຈ້ງ ທາຊ້ຳປະມານທຸກໆ 2 ຊົ່ວໂມງ ແລະ ທາຊ້ຳທັນທີຫຼັງອອກເຫື່ອຫຼາຍ, ລອຍນ້ຳ ຫຼື ເຊັດດ້ວຍຜ້າເຊັດໂຕ. ຄຣີມກັນແດດແບບກັນນ້ຳກໍຄືກັນ.',
      th: 'เมื่ออยู่กลางแจ้ง ให้ทาซ้ำประมาณทุก 2 ชั่วโมง — และทาทันทีหลังเหงื่อออกมาก ว่ายน้ำ หรือเช็ดตัวด้วยผ้าขนหนู ข้อนี้ใช้กับผลิตภัณฑ์กันน้ำด้วย',
      fr: 'À l’extérieur, réappliquez environ toutes les 2 heures — et immédiatement après avoir beaucoup transpiré, nagé ou vous être essuyé avec une serviette. Cela vaut aussi pour les produits résistants à l’eau.',
    },
  },
  {
    icon: '🪨',
    title: {
      ko: '무기자차와 유기자차',
      en: 'Mineral and chemical filters',
      lo: 'ຕົວກັນແດດແບບແຮ່ທາດ ແລະ ແບບເຄມີ',
      th: 'ฟิลเตอร์แบบแร่และแบบเคมี',
      fr: 'Filtres minéraux et chimiques',
    },
    body: {
      ko: '무기자차(미네랄)는 징크옥사이드·티타늄디옥사이드를 써서 피부 위에서 자외선을 막아요. 눈시림이 적다는 사람이 많지만 하얗게 뜰 수 있어요. 유기자차(화학적 필터)는 자외선을 흡수하는 방식으로 가볍고 투명한 편이에요. 둘 다 같은 기준으로 시험해 SPF·PA를 표시해요.',
      en: 'Mineral sunscreens use zinc oxide or titanium dioxide to block UV on the skin’s surface; many people find they sting the eyes less, but they can leave a white cast. Chemical filters absorb UV and tend to feel lighter and look clear. Both are tested the same way for SPF and PA.',
      lo: 'ຄຣີມກັນແດດແບບແຮ່ທາດ ໃຊ້ຊິງອອກໄຊ ຫຼື ໄທທານຽມໄດອອກໄຊ ກັນ UV ຢູ່ເທິງຜິວ ຫຼາຍຄົນວ່າແສບຕາໜ້ອຍກວ່າ ແຕ່ອາດເຮັດໃຫ້ໜ້າຂາວ. ແບບເຄມີ ດູດຊຶມ UV ມັກບາງເບົາ ແລະ ໃສ. ທັງສອງແບບທົດສອບ SPF ແລະ PA ດ້ວຍວິທີດຽວກັນ.',
      th: 'ครีมกันแดดแบบแร่ใช้ซิงค์ออกไซด์หรือไทเทเนียมไดออกไซด์เพื่อป้องกันรังสียูวีที่ผิวชั้นนอก หลายคนรู้สึกว่าแสบตาน้อยกว่า แต่อาจทิ้งคราบขาว ฟิลเตอร์แบบเคมีดูดซับรังสียูวี และมักให้ความรู้สึกเบากว่าและดูใส ทั้งสองแบบทดสอบ SPF และ PA ด้วยวิธีเดียวกัน',
      fr: 'Les crèmes solaires minérales utilisent l’oxyde de zinc ou le dioxyde de titane pour bloquer les UV à la surface de la peau; beaucoup de personnes trouvent qu’elles piquent moins les yeux, mais elles peuvent laisser un voile blanc. Les filtres chimiques absorbent les UV et sont généralement plus légers et invisibles. Les deux sont testés de la même façon pour le SPF et le PA.',
    },
  },
  {
    icon: '☁️',
    title: {
      ko: '흐린 날, 비 오는 계절에도',
      en: 'Cloudy days and the rainy season too',
      lo: 'ມື້ມີເມກ ແລະ ລະດູຝົນກໍຕ້ອງທາ',
      th: 'วันที่ฟ้าครึ้มและฤดูฝนก็ด้วย',
      fr: 'Les jours nuageux et la saison des pluies aussi',
    },
    body: {
      ko: '구름이 있어도 자외선은 상당 부분 통과해요. 라오스의 우기(6~10월)에도, 흐린 날에도 매일 발라 주세요.',
      en: 'A large share of UV passes through clouds. Keep applying sunscreen every day in Laos’ rainy season (June–October) and on overcast days.',
      lo: 'ລັງສີ UV ຜ່ານເມກໄດ້ຫຼາຍ. ລະດູຝົນຂອງລາວ (ມິຖຸນາ–ຕຸລາ) ແລະ ມື້ທີ່ມີເມກ ກໍຄວນທາທຸກມື້.',
      th: 'รังสียูวีจำนวนมากผ่านเมฆได้ ให้ทาครีมกันแดดต่อเนื่องทุกวันในฤดูฝนของลาว (มิถุนายน–ตุลาคม) และในวันที่ฟ้าครึ้ม',
      fr: 'Une grande part des UV traverse les nuages. Continuez à appliquer de la crème solaire chaque jour pendant la saison des pluies au Laos (juin–octobre) et les jours couverts.',
    },
  },
  {
    icon: '🏁',
    title: {
      ko: '스킨케어의 마지막 단계',
      en: 'The last skincare step',
      lo: 'ຂັ້ນຕອນສຸດທ້າຍຂອງການບຳລຸງຜິວ',
      th: 'ขั้นตอนสุดท้ายของการดูแลผิว',
      fr: 'La dernière étape de soin',
    },
    body: {
      ko: '선크림은 아침 스킨케어의 맨 마지막, 메이크업 전에 발라요. 외출 15분쯤 전에 바르면 좋아요.',
      en: 'Sunscreen goes on last in your morning skincare, before makeup. Applying it about 15 minutes before you go out is a good habit.',
      lo: 'ຄຣີມກັນແດດທາເປັນອັນສຸດທ້າຍຂອງການບຳລຸງຜິວຕອນເຊົ້າ ກ່ອນແຕ່ງໜ້າ. ທາກ່ອນອອກຈາກເຮືອນປະມານ 15 ນາທີ ເປັນນິໄສທີ່ດີ.',
      th: 'ครีมกันแดดทาเป็นลำดับสุดท้ายในการดูแลผิวตอนเช้า ก่อนแต่งหน้า การทาประมาณ 15 นาทีก่อนออกไปข้างนอกเป็นนิสัยที่ดี',
      fr: 'La crème solaire s’applique en dernier dans vos soins du matin, avant le maquillage. L’appliquer environ 15 minutes avant de sortir est une bonne habitude.',
    },
  },
  {
    icon: '⛱️',
    title: {
      ko: '더 오래 햇볕에 있어도 된다는 뜻은 아니에요',
      en: 'It isn’t a reason to stay in the sun longer',
      lo: 'ບໍ່ໄດ້ໝາຍຄວາມວ່າຢູ່ກາງແດດດົນຂຶ້ນໄດ້',
      th: 'ไม่ใช่เหตุผลให้อยู่กลางแดดนานขึ้น',
      fr: 'Pas une raison de rester plus longtemps au soleil',
    },
    body: {
      ko: '선크림은 자외선을 모두 막지는 못해요. 햇볕이 강한 한낮(대략 오전 10시~오후 4시)엔 그늘, 모자, 양산, 긴소매, 선글라스를 함께 써요.',
      en: 'Sunscreen can’t block all UV. In the strongest midday sun (roughly 10 am–4 pm), also use shade, a hat, an umbrella, long sleeves and sunglasses.',
      lo: 'ຄຣີມກັນແດດກັນ UV ໄດ້ບໍ່ໝົດ. ເວລາແດດແຮງຕອນທ່ຽງ (ປະມານ 10 ໂມງເຊົ້າ ຫາ 4 ໂມງແລງ) ໃຫ້ໃຊ້ຮົ່ມ, ໝວກ, ຄັນຮົ່ມ, ເສື້ອແຂນຍາວ ແລະ ແວ່ນຕາກັນແດດນຳ.',
      th: 'ครีมกันแดดป้องกันรังสียูวีได้ไม่ทั้งหมด ช่วงแดดแรงที่สุดตอนกลางวัน (ประมาณ 10:00–16:00 น.) ควรใช้ร่มเงา หมวก ร่ม เสื้อแขนยาว และแว่นกันแดดร่วมด้วย',
      fr: 'La crème solaire ne peut pas bloquer tous les UV. Pendant le soleil le plus fort de la mi-journée (environ 10 h–16 h), utilisez aussi l’ombre, un chapeau, un parapluie, des manches longues et des lunettes de soleil.',
    },
  },
  {
    icon: '🤍',
    title: {
      ko: '백탁(하얗게 뜨는 것)이 싫다면',
      en: 'If white cast bothers you',
      lo: 'ຖ້າບໍ່ມັກໜ້າຂາວວອກ',
      th: 'ถ้าคราบขาวกวนใจ',
      fr: 'Si le voile blanc vous gêne',
    },
    body: {
      ko: '백탁은 선크림이 피부 위에 하얀 막처럼 보이는 거예요. 양을 줄이기보다 두 번에 나눠 얇게 펴 바르거나, 투명한 젤 타입·톤업 타입처럼 내 피부색에 맞는 제품을 골라 보세요.',
      en: 'White cast is when sunscreen shows as a pale film on the skin. Rather than using less, apply it in two thin layers, or choose a clear gel or a tinted type that suits your skin tone.',
      lo: 'ໜ້າຂາວວອກ ແມ່ນເວລາຄຣີມກັນແດດເປັນຊັ້ນສີຂາວເທິງຜິວ. ແທນທີ່ຈະທາໜ້ອຍລົງ ໃຫ້ແບ່ງທາບາງໆສອງຊັ້ນ ຫຼື ເລືອກແບບເຈວໃສ ຫຼື ແບບມີສີທີ່ເຂົ້າກັບສີຜິວ.',
      th: 'คราบขาวคือเมื่อครีมกันแดดเห็นเป็นฟิล์มสีซีดบนผิว แทนที่จะใช้น้อยลง ให้ทาเป็นสองชั้นบาง ๆ หรือเลือกแบบเจลใส หรือแบบมีสีที่เข้ากับสีผิวของคุณ',
      fr: 'Le voile blanc, c’est quand la crème solaire laisse un film pâle visible sur la peau. Plutôt que d’en mettre moins, appliquez-la en deux couches fines, ou choisissez un gel transparent ou une version teintée adaptée à votre teint.',
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
      th: '“แอนตี้เอจจิ้ง”',
      fr: '« Anti-âge »',
    },
    body: {
      ko: '‘안티에이징’은 법으로 정한 기준이 없는 광고 표현이에요. 나이를 되돌린다는 뜻이 아니라, 대개 보습과 피부결을 가꾸는 제품을 넓게 부르는 말이에요. 노화 관리의 기본은 매일 보습과 선크림이에요.',
      en: '“Anti-ageing” is a marketing phrase with no legal definition. It doesn’t mean turning back the clock — it usually just describes products that moisturise and smooth. The basics of age care are daily moisturiser and sunscreen.',
      lo: '“ຕ້ານຄວາມແກ່” ເປັນຄຳໂຄສະນາ ບໍ່ມີຄວາມໝາຍທາງກົດໝາຍ. ບໍ່ໄດ້ໝາຍຄວາມວ່າເຮັດໃຫ້ອາຍຸຖອຍຫຼັງ ສ່ວນຫຼາຍແມ່ນຜະລິດຕະພັນທີ່ບຳລຸງຄວາມຊຸ່ມ ແລະ ຄວາມລຽບນຽນ. ພື້ນຖານແມ່ນບຳລຸງຄວາມຊຸ່ມຊື່ນ ແລະ ທາຄຣີມກັນແດດທຸກມື້.',
      th: '“แอนตี้เอจจิ้ง” เป็นคำทางการตลาดที่ไม่มีคำนิยามทางกฎหมาย ไม่ได้หมายถึงการย้อนเวลา — มักใช้อธิบายผลิตภัณฑ์ที่ให้ความชุ่มชื้นและทำให้ผิวเรียบเนียน พื้นฐานของการดูแลผิวตามวัยคือมอยส์เจอไรเซอร์และครีมกันแดดทุกวัน',
      fr: '« Anti-âge » est une expression marketing sans définition légale. Elle ne veut pas dire remonter le temps — elle décrit généralement des produits qui hydratent et lissent. Les bases du soin lié à l’âge sont une crème hydratante et une crème solaire au quotidien.',
    },
  },
  {
    icon: '〰️',
    title: {
      ko: '‘주름개선’',
      en: '“Wrinkle care”',
      lo: '“ຊ່ວຍເລື່ອງຮອຍຫ່ຽວຍົ່ນ”',
      th: '“ดูแลริ้วรอย”',
      fr: '« Soin des rides »',
    },
    body: {
      ko: '한국에서 ‘주름개선’ 기능성 표시는 식약처 심사나 보고를 거친 제품만 쓸 수 있어요. 그래도 주름을 없애 준다는 뜻은 아니고, 꾸준히 썼을 때 주름을 개선하는 데 도움이 될 수 있다는 뜻이에요. 사람마다 차이가 있어요.',
      en: 'In Korea, only products reviewed by or notified to the MFDS may carry the “wrinkle improvement” functional label. Even so, it doesn’t mean wrinkles disappear — it means steady use may help improve their look, and results vary from person to person.',
      lo: 'ຢູ່ເກົາຫຼີ ສະເພາະຜະລິດຕະພັນທີ່ຜ່ານການກວດ ຫຼື ແຈ້ງຕໍ່ MFDS ເທົ່ານັ້ນ ທີ່ຂຽນວ່າຟັງຊັນ “ຊ່ວຍເລື່ອງຮອຍຫ່ຽວຍົ່ນ” ໄດ້. ແຕ່ບໍ່ໄດ້ໝາຍຄວາມວ່າຮອຍຈະຫາຍໄປ ພຽງແຕ່ອາດຊ່ວຍໄດ້ເມື່ອໃຊ້ຢ່າງສະໝ່ຳສະເໝີ ແລະ ຜົນຂອງແຕ່ລະຄົນຕ່າງກັນ.',
      th: 'ในเกาหลี เฉพาะผลิตภัณฑ์ที่ผ่านการตรวจสอบโดย หรือแจ้งต่อ MFDS เท่านั้นที่ติดฉลากฟังก์ชันนัล “ปรับปรุงริ้วรอย” ได้ ถึงอย่างนั้นก็ไม่ได้หมายความว่าริ้วรอยจะหายไป — แต่หมายถึงการใช้อย่างสม่ำเสมออาจช่วยให้ริ้วรอยดูดีขึ้น และผลลัพธ์แตกต่างกันในแต่ละคน',
      fr: 'En Corée, seuls les produits examinés par le MFDS ou notifiés à celui-ci peuvent porter la mention fonctionnelle « amélioration des rides ». Même ainsi, cela ne signifie pas que les rides disparaissent — cela signifie qu’un usage régulier peut aider à améliorer leur apparence, et les résultats varient d’une personne à l’autre.',
    },
  },
  {
    icon: '🫧',
    title: {
      ko: '‘탄력’',
      en: '“Firming”',
      lo: '“ຄວາມກະຊັບ”',
      th: '“กระชับ”',
      fr: '« Raffermissant »',
    },
    body: {
      ko: '‘탄력’은 한국 기능성화장품 종류에 따로 없는 표현이에요. 대부분 촉촉해지면서 피부가 탱탱하게 ‘느껴지는’ 사용감을 말해요.',
      en: '“Firming” is not one of Korea’s functional-cosmetic categories. It mostly describes the bouncy feel skin has when it is well moisturised.',
      lo: '“ຄວາມກະຊັບ” ບໍ່ແມ່ນໝວດໜຶ່ງຂອງເຄື່ອງສຳອາງຟັງຊັນຂອງເກົາຫຼີ. ສ່ວນຫຼາຍໝາຍເຖິງຄວາມຮູ້ສຶກວ່າຜິວເດັ້ງເມື່ອຜິວຊຸ່ມຊື່ນດີ.',
      th: '“กระชับ” ไม่ได้อยู่ในหมวดเครื่องสำอางฟังก์ชันนัลของเกาหลี ส่วนใหญ่ใช้อธิบายความรู้สึกเด้งของผิวเมื่อผิวได้รับความชุ่มชื้นอย่างดี',
      fr: '« Raffermissant » ne fait pas partie des catégories de cosmétiques fonctionnels en Corée. Le terme décrit surtout la sensation de rebond d’une peau bien hydratée.',
    },
  },
  {
    icon: '✨',
    title: {
      ko: '‘미백’과 ‘브라이트닝’',
      en: '“Brightening” and “whitening”',
      lo: '“ຜິວກະຈ່າງໃສ” ແລະ “ຜິວຂາວ”',
      th: '“ไบรท์เทนนิ่ง” และ “ไวท์เทนนิ่ง”',
      fr: '« Éclaircissant » et « blanchissant »',
    },
    body: {
      ko: '한국의 ‘미백’ 기능성은 멜라닌 색소가 쌓이는 것을 줄여 기미·주근깨를 옅게 하는 데 도움을 준다는 뜻이에요. 피부를 표백하거나 타고난 피부색을 바꾼다는 뜻이 아니에요. 어떤 피부색이든 모두 아름다워요.',
      en: 'Korea’s “brightening” functional label means helping reduce the build-up of melanin pigment so dark spots and freckles look lighter. It doesn’t mean bleaching skin or changing your natural skin tone. Every skin tone is beautiful.',
      lo: 'ຟັງຊັນ “ຜິວກະຈ່າງໃສ” ຂອງເກົາຫຼີ ໝາຍເຖິງການຊ່ວຍຫຼຸດການສະສົມຂອງເມັດສີເມລານິນ ເພື່ອໃຫ້ຝ້າ ແລະ ກະເບິ່ງຈາງລົງ. ບໍ່ໄດ້ໝາຍຄວາມວ່າຟອກຜິວ ຫຼື ປ່ຽນສີຜິວທຳມະຊາດ. ຜິວທຸກສີລ້ວນງາມ.',
      th: 'ฉลากฟังก์ชันนัล “ไบรท์เทนนิ่ง” ของเกาหลีหมายถึงการช่วยลดการสะสมของเม็ดสีเมลานิน เพื่อให้จุดด่างดำและกระดูจางลง ไม่ได้หมายถึงการฟอกผิวหรือเปลี่ยนสีผิวตามธรรมชาติของคุณ ผิวทุกสีล้วนสวยงาม',
      fr: 'En Corée, la mention fonctionnelle « éclaircissant » signifie aider à réduire l’accumulation du pigment de mélanine afin que les taches pigmentaires et les taches de rousseur paraissent plus claires. Cela ne signifie pas blanchir la peau ni changer votre teint naturel. Chaque teint est beau.',
    },
  },
  {
    icon: '🏛️',
    title: {
      ko: '‘기능성화장품’이란?',
      en: 'What is a “functional cosmetic”?',
      lo: '“ເຄື່ອງສຳອາງຟັງຊັນ” ແມ່ນຫຍັງ?',
      th: '“เครื่องสำอางฟังก์ชันนัล” คืออะไร?',
      fr: 'Qu’est-ce qu’un « cosmétique fonctionnel »?',
    },
    body: {
      ko: '한국 식약처가 효과와 안전 자료를 심사했거나, 정해진 성분과 함량 기준에 맞는다고 보고된 제품이에요. 용기에 ‘기능성화장품’ 문구가 있어요. 처음엔 미백·주름개선·자외선차단 3가지였고, 2017년부터 염모, 탈모 증상 완화, 여드름성 피부 완화 등으로 넓어졌어요.',
      en: 'A product whose efficacy and safety data the Korean MFDS has reviewed, or which has been notified as meeting set ingredient and concentration standards. The pack says “functional cosmetic” (기능성화장품). It began with brightening, wrinkle improvement and UV protection, and since 2017 has also covered areas such as hair colouring, easing hair-loss symptoms and acne-prone skin.',
      lo: 'ຜະລິດຕະພັນທີ່ MFDS ຂອງເກົາຫຼີ ໄດ້ກວດຂໍ້ມູນດ້ານປະສິດທິພາບ ແລະ ຄວາມປອດໄພແລ້ວ ຫຼື ໄດ້ແຈ້ງວ່າກົງຕາມມາດຕະຖານສ່ວນປະສົມ ແລະ ປະລິມານທີ່ກຳນົດ. ເທິງຂວດຈະມີຄຳວ່າ “기능성화장품”. ເລີ່ມແຕ່ 3 ຢ່າງ: ຜິວກະຈ່າງໃສ, ຮອຍຫ່ຽວຍົ່ນ ແລະ ກັນແດດ, ແລະ ຕັ້ງແຕ່ປີ 2017 ໄດ້ຂະຫຍາຍໄປເຖິງ ການຍ້ອມຜົມ, ອາການຜົມຫຼົ່ນ ແລະ ຜິວທີ່ເປັນສິວງ່າຍ.',
      th: 'ผลิตภัณฑ์ที่ MFDS ของเกาหลีได้ตรวจสอบข้อมูลด้านประสิทธิภาพและความปลอดภัยแล้ว หรือที่ได้แจ้งว่าเป็นไปตามมาตรฐานส่วนผสมและความเข้มข้นที่กำหนด บนบรรจุภัณฑ์จะเขียนว่า “เครื่องสำอางฟังก์ชันนัล” (기능성화장품) เริ่มแรกครอบคลุมด้านความกระจ่างใส การปรับปรุงริ้วรอย และการป้องกันรังสียูวี และตั้งแต่ปี 2017 ได้ครอบคลุมด้านอื่น ๆ ด้วย เช่น การทำสีผม การบรรเทาอาการผมร่วง และผิวที่มีแนวโน้มเป็นสิว',
      fr: 'Un produit dont le MFDS coréen a examiné les données d’efficacité et de sécurité, ou qui a été notifié comme conforme à des normes fixées d’ingrédients et de concentration. L’emballage porte la mention « cosmétique fonctionnel » (기능성화장품). Cela a commencé avec l’éclaircissement, l’amélioration des rides et la protection UV, et depuis 2017 couvre aussi des domaines comme la coloration capillaire, l’atténuation des symptômes de la chute des cheveux et les peaux à tendance acnéique.',
    },
  },
  {
    icon: '💊',
    title: {
      ko: '기능성이어도 약은 아니에요',
      en: 'Functional still isn’t medicine',
      lo: 'ຟັງຊັນ ກໍຍັງບໍ່ແມ່ນຢາ',
      th: 'ฟังก์ชันนัลก็ยังไม่ใช่ยา',
      fr: 'Fonctionnel ne veut pas dire médicament',
    },
    body: {
      ko: '기능성화장품도 화장품이에요. 여드름·탈모 관련 기능성 제품에는 ‘의약품이 아님’이라는 문구가 함께 적혀 있어요. 붉어짐이나 가려움이 계속되면 사용을 멈추고 의사나 약사와 상담하세요.',
      en: 'A functional cosmetic is still a cosmetic. Functional products for acne-prone skin or hair loss carry a note saying they are not medicines. If redness or itching continues, stop using the product and talk to a doctor or pharmacist.',
      lo: 'ເຄື່ອງສຳອາງຟັງຊັນ ກໍຍັງແມ່ນເຄື່ອງສຳອາງ. ຜະລິດຕະພັນຟັງຊັນກ່ຽວກັບສິວ ຫຼື ຜົມຫຼົ່ນ ຈະມີຄຳວ່າ “ບໍ່ແມ່ນຢາ” ຂຽນໄວ້. ຖ້າຜິວແດງ ຫຼື ຄັນບໍ່ເຊົາ ໃຫ້ຢຸດໃຊ້ ແລະ ປຶກສາທ່ານໝໍ ຫຼື ເພສັດກອນ.',
      th: 'เครื่องสำอางฟังก์ชันนัลก็ยังคงเป็นเครื่องสำอาง ผลิตภัณฑ์ฟังก์ชันนัลสำหรับผิวที่มีแนวโน้มเป็นสิวหรือผมร่วงจะมีข้อความระบุว่าไม่ใช่ยา หากรอยแดงหรืออาการคันยังคงอยู่ ให้หยุดใช้ผลิตภัณฑ์และปรึกษาแพทย์หรือเภสัชกร',
      fr: 'Un cosmétique fonctionnel reste un cosmétique. Les produits fonctionnels pour peaux à tendance acnéique ou contre la chute des cheveux portent une mention indiquant qu’ils ne sont pas des médicaments. Si une rougeur ou des démangeaisons persistent, arrêtez le produit et parlez-en à un médecin ou à un pharmacien.',
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
