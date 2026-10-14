/**
 * Words a KOREA GLOW partner should look at twice before posting about a product.
 *
 * This is a list of patterns, not a judge: the checker only points at a word and says why it is
 * risky, in the partner's language. It never rewrites the post and never says a post is "safe" —
 * a post with no hits can still be wrong. Patterns are deliberately broad (Lao and Thai have no
 * spaces between words), so a hit means "read this again", not "this is forbidden".
 *
 * Categories follow the risks in the 2026-10-11 market research: medical claims (cosmetics are not
 * medicine), promises and absolutes, "no side effects", removal/whitening promises, claims that a product changes how the body
 * works (ASEAN Cosmetic Directive: hair regrowth, reversing ageing, cell regeneration, slimming), borrowed
 * authority, calling other sellers' goods fake, and "cheapest" claims.
 */
/** Written in all five app languages, because partners post in Lao and Thai as much as Korean. */
export interface Localized {
  readonly ko: string;
  readonly en: string;
  readonly lo: string;
  readonly th: string;
  readonly fr: string;
}

export const inLocale = (text: Localized, locale: string): string =>
  locale === 'ko' || locale === 'lo' || locale === 'th' || locale === 'fr' ? text[locale] : text.en;

export interface WordingRule {
  readonly id: string;
  /** Regular-expression sources, case-insensitive, one array for all languages. */
  readonly patterns: readonly string[];
  readonly why: Localized;
  readonly instead: Localized;
}

export const WORDING_RULES: readonly WordingRule[] = [
  {
    id: 'medical',
    patterns: [
      '치료',
      '완치',
      '낫(?:는다|아요|게|습니다)',
      '처방',
      '약효',
      '\\bcure[sd]?\\b',
      '\\btreat(?:s|ment|ing)?\\b',
      '\\bheal(?:s|ing)?\\b',
      '\\bprescri',
      'ປິ່ນປົວ',
      'ຫາຍຂາດ',
      'ຮັກສາ(?:ສິວ|ຝ້າ|ໂລກ)',
      'รักษา(?:สิว|ฝ้า|โรค)',
      'หายขาด',
      '\\bguéri',
      '\\bsoigne',
    ],
    why: {
      ko: '화장품은 약이 아니에요. «치료·완치·낫는다»는 의약품 표현이라 문제가 될 수 있어요.',
      en: 'Cosmetics are not medicine. "Cure", "treat" and "heal" are medical words and can get you into trouble.',
      lo: 'ເຄື່ອງສຳອາງບໍ່ແມ່ນຢາ. ຄຳວ່າ «ປິ່ນປົວ, ຫາຍຂາດ» ແມ່ນຄຳທາງການແພດ ອາດເປັນບັນຫາໄດ້.',
      th: 'เครื่องสำอางไม่ใช่ยา คำว่า «รักษา หายขาด» เป็นคำทางการแพทย์ อาจเป็นปัญหาได้',
      fr: "Un cosmétique n'est pas un médicament. « Guérir » ou « soigner » sont des mots médicaux et peuvent poser problème.",
    },
    instead: {
      ko: '«피부를 촉촉하게 가꿔 줘요», «피부 결을 정돈해 줘요»처럼 화장품의 말로.',
      en: 'Use cosmetic words: "keeps skin moist", "makes skin feel smoother".',
      lo: 'ໃຊ້ຄຳຂອງເຄື່ອງສຳອາງ: «ຊ່ວຍໃຫ້ຜິວຊຸ່ມຊື່ນ», «ຜິວຮູ້ສຶກລຽບນຽນ».',
      th: 'ใช้คำของเครื่องสำอาง: «ช่วยให้ผิวชุ่มชื้น» «ผิวรู้สึกเรียบเนียน»',
      fr: 'Utilisez des mots cosmétiques : « hydrate la peau », « peau plus douce au toucher ».',
    },
  },
  {
    id: 'promise',
    patterns: [
      '보장',
      '100\\s*%',
      '무조건',
      '확실히',
      '즉시',
      '영구',
      '\\bguarantee',
      '\\binstant',
      '\\bpermanent',
      '\\bovernight',
      'ຮັບປະກັນ',
      'ທັນທີ',
      'ຖາວອນ',
      'ແນ່ນອນ',
      'รับประกัน',
      'ทันที',
      'ถาวร',
      'แน่นอน',
      '\\bgaranti',
      '\\binstantan',
      '\\bpermanent',
    ],
    why: {
      ko: '피부는 사람마다 달라서 결과를 약속할 수 없어요. «보장·100%·즉시»는 과장 광고가 돼요.',
      en: 'Skin differs from person to person, so no result can be promised. "Guaranteed", "100%" and "instant" are overclaims.',
      lo: 'ຜິວຂອງແຕ່ລະຄົນບໍ່ຄືກັນ ຈຶ່ງສັນຍາຜົນບໍ່ໄດ້. «ຮັບປະກັນ, 100%, ທັນທີ» ແມ່ນການໂຄສະນາເກີນຈິງ.',
      th: 'ผิวของแต่ละคนไม่เหมือนกัน จึงสัญญาผลลัพธ์ไม่ได้ «รับประกัน 100% ทันที» เป็นการโฆษณาเกินจริง',
      fr: 'Chaque peau est différente : aucun résultat ne peut être promis. « Garanti », « 100 % », « instantané » sont exagérés.',
    },
    instead: {
      ko: '«제 손님들은 이런 느낌이 좋다고 하셨어요»처럼 경험으로, 결과는 약속하지 않기.',
      en: 'Share experience ("my customers liked how it feels"), never promise a result.',
      lo: 'ເລົ່າປະສົບການ («ລູກຄ້າຂອງຂ້ອຍມັກຄວາມຮູ້ສຶກແບບນີ້»), ບໍ່ສັນຍາຜົນ.',
      th: 'เล่าประสบการณ์ («ลูกค้าของฉันชอบความรู้สึกแบบนี้») ไม่สัญญาผลลัพธ์',
      fr: 'Partagez une expérience (« mes clientes aiment la sensation »), sans promettre de résultat.',
    },
  },
  {
    id: 'no-side-effects',
    patterns: [
      '부작용\\s*(?:이\\s*)?(?:없|0|제로)',
      '절대\\s*안전',
      '무독성',
      '화학\\s*성분\\s*(?:이\\s*)?없',
      '\\bno side[- ]effects?',
      '\\bcompletely safe',
      '\\bchemical[- ]free',
      '\\bnon[- ]toxic',
      'ບໍ່ມີຜົນຂ້າງຄຽງ',
      'ປອດໄພ\\s*100',
      'ບໍ່ມີສານເຄມີ',
      'ไม่มีผลข้างเคียง',
      'ปลอดภัย\\s*100',
      'ไม่มีสารเคมี',
      'sans effets? secondaires?',
      'sans produits? chimiques?',
    ],
    why: {
      ko: '어떤 화장품도 모든 사람에게 자극이 없다고 말할 수 없어요. 모든 것은 화학 성분이기도 해요.',
      en: 'No cosmetic can be said to irritate nobody, and everything — water included — is a chemical.',
      lo: 'ບໍ່ມີເຄື່ອງສຳອາງໃດບອກໄດ້ວ່າບໍ່ລະຄາຍເຄືອງກັບທຸກຄົນ ແລະ ທຸກຢ່າງ (ລວມທັງນ້ຳ) ກໍແມ່ນສານເຄມີ.',
      th: 'ไม่มีเครื่องสำอางใดบอกได้ว่าไม่ระคายเคืองกับทุกคน และทุกอย่าง (รวมทั้งน้ำ) ก็เป็นสารเคมี',
      fr: "Aucun cosmétique ne peut être dit sans irritation pour tous, et tout — l'eau comprise — est chimique.",
    },
    instead: {
      ko: '«처음 쓰실 땐 귀 뒤에 조금 발라 보세요»처럼 안전한 사용법을 알려 주기.',
      en: 'Give the safe habit instead: "try a little behind the ear first".',
      lo: 'ບອກວິທີໃຊ້ທີ່ປອດໄພ: «ທົດລອງທາໜ້ອຍໜຶ່ງຫຼັງຫູກ່ອນ».',
      th: 'บอกวิธีใช้ที่ปลอดภัย: «ลองทาเล็กน้อยหลังหูก่อน»',
      fr: "Donnez le bon réflexe : « essayez d'abord un peu derrière l'oreille ».",
    },
  },
  {
    id: 'removal',
    patterns: [
      '(?:기미|주름|여드름|잡티|흉터)\\s*(?:을|를)?\\s*(?:제거|없애|지워)',
      '하얘(?:져|진다|지는)',
      '피부색\\s*(?:이\\s*)?바뀌',
      '\\bremoves? (?:wrinkles|melasma|acne|dark spots|scars)',
      '\\bwhiten(?:s|ing)? (?:overnight|fast|in)',
      'ລຶບ(?:ຝ້າ|ຮອຍຫ່ຽວ|ສິວ|ແປ້ວ)',
      'ຂາວໄວ',
      'ຂາວທັນທີ',
      'ลบ(?:ฝ้า|ริ้วรอย|สิว|แผลเป็น)',
      'ขาวไว',
      'ขาวทันที',
      'efface (?:les )?(?:rides|taches|cicatrices)',
      'blanchi',
    ],
    why: {
      ko: '«기미·주름 제거», «하얘진다»는 화장품이 약속할 수 없는 결과예요.',
      en: '"Removes melasma or wrinkles" and "whitens fast" are results a cosmetic cannot promise.',
      lo: '«ລຶບຝ້າ ລຶບຮອຍຫ່ຽວ» ແລະ «ຂາວໄວ» ແມ່ນຜົນທີ່ເຄື່ອງສຳອາງສັນຍາບໍ່ໄດ້.',
      th: '«ลบฝ้า ลบริ้วรอย» และ «ขาวไว» เป็นผลลัพธ์ที่เครื่องสำอางสัญญาไม่ได้',
      fr: '« Efface les taches ou les rides », « blanchit vite » : un cosmétique ne peut pas promettre cela.',
    },
    instead: {
      ko: '«피부 톤을 맑게 가꿔 줘요»처럼, 그리고 자외선 차단을 같이 권하기.',
      en: 'Say "helps skin look brighter" and recommend daily sun care alongside.',
      lo: 'ເວົ້າວ່າ «ຊ່ວຍໃຫ້ຜິວເບິ່ງສົດໃສ» ແລະ ແນະນຳໃຫ້ກັນແດດທຸກມື້ນຳ.',
      th: 'พูดว่า «ช่วยให้ผิวดูกระจ่างใส» และแนะนำให้กันแดดทุกวันด้วย',
      fr: 'Dites « aide la peau à paraître plus lumineuse » et conseillez une protection solaire quotidienne.',
    },
  },
  {
    id: 'body-change',
    patterns: [
      '발모',
      '모발\\s*(?:이\\s*)?(?:다시\\s*)?(?:나|자라)',
      '머리(?:카락)?\\s*(?:이|가)?\\s*다시\\s*(?:나|자라)',
      '탈모\\s*(?:를\\s*)?(?:방지|예방|치료|멈|막)',
      '노화\\s*(?:를\\s*)?(?:되돌|역전|멈추)',
      '세포\\s*(?:를\\s*)?재생',
      '보톡스',
      '지방\\s*(?:을\\s*)?(?:분해|연소|태)',
      '살\\s*(?:이\\s*)?빠(?:져|진|지)',
      '가슴\\s*(?:이\\s*)?커',
      '\\bhair\\s+(?:re)?growth',
      '\\bregrows?\\b',
      '\\bstops?\\s+hair\\s+loss',
      '\\breverses?\\s+(?:the\\s+)?(?:signs\\s+of\\s+)?(?:ag(?:e|ing)|ageing)',
      '\\bcell(?:ular)?\\s+regenerat',
      '\\bbotox',
      '\\bfat[- ]burn',
      '\\bslimming',
      '\\bdna\\s+repair',
      'ຜົມງອກ',
      'ປູກຜົມ',
      'ຢຸດຜົມຫຼົ່ນ',
      'ຍ້ອນໄວ',
      'ຟື້ນຟູເຊລ',
      'ໂບທັອກ',
      'ເຜົາຜານໄຂມັນ',
      'ຫຼຸດນ້ຳໜັກ',
      'ปลูกผม',
      'ผมงอก',
      'หยุดผมร่วง',
      'ย้อนวัย',
      'ฟื้นฟูเซลล์',
      'โบท็อก',
      'เผาผลาญไขมัน',
      'ลดน้ำหนัก',
      '\\brepousse',
      'stoppe\\s+la\\s+chute',
      'inverse\\s+le\\s+vieillissement',
      'régénération\\s+cellulaire',
      'brûle[- ]graisses?',
      '\\bamincissant',
    ],
    why: {
      ko: '«머리카락이 다시 난다·노화를 되돌린다·세포 재생·지방 분해·살 빠짐»은 몸의 기능을 바꾼다는 말이라 화장품이 아니라 의약품 표현이에요. 아세안 화장품 규정에서 허용되지 않는 주장이에요.',
      en: '"Regrows hair", "reverses ageing", "regenerates cells", "burns fat" and "slimming" say a product changes how the body works. Under the ASEAN cosmetic rules that is a medicine claim, not a cosmetic one.',
      lo: '«ຜົມງອກໃໝ່, ຍ້ອນໄວ, ຟື້ນຟູເຊລ, ເຜົາຜານໄຂມັນ, ຫຼຸດນ້ຳໜັກ» ແມ່ນການບອກວ່າປ່ຽນການເຮັດວຽກຂອງຮ່າງກາຍ. ຕາມລະບຽບເຄື່ອງສຳອາງອາຊຽນ ນີ້ແມ່ນຄຳຂອງຢາ ບໍ່ແມ່ນເຄື່ອງສຳອາງ.',
      th: '«ปลูกผม ผมงอกใหม่ ย้อนวัย ฟื้นฟูเซลล์ เผาผลาญไขมัน ลดน้ำหนัก» คือการบอกว่าเปลี่ยนการทำงานของร่างกาย ตามเกณฑ์เครื่องสำอางอาเซียน นี่เป็นคำของยา ไม่ใช่เครื่องสำอาง',
      fr: '« Fait repousser les cheveux », « inverse le vieillissement », « régénération cellulaire », « brûle-graisses », « amincissant » : dire qu’un produit change le fonctionnement du corps est une allégation de médicament selon les règles cosmétiques de l’ASEAN.',
    },
    instead: {
      ko: '«두피를 깨끗하고 촉촉하게», «피부를 탄력 있어 보이게 가꿔 줘요»처럼 겉모습과 느낌으로 말하기.',
      en: 'Talk about how skin and hair look and feel: "keeps the scalp clean and comfortable", "helps skin look firmer".',
      lo: 'ເວົ້າເຖິງການເບິ່ງ ແລະ ຄວາມຮູ້ສຶກ: «ຊ່ວຍໃຫ້ໜັງຫົວສະອາດ ສະບາຍ», «ຊ່ວຍໃຫ້ຜິວເບິ່ງກະຊັບ».',
      th: 'พูดถึงรูปลักษณ์และความรู้สึก: «ช่วยให้หนังศีรษะสะอาด สบาย» «ช่วยให้ผิวดูกระชับ»',
      fr: 'Parlez de l’aspect et de la sensation : « garde le cuir chevelu propre et confortable », « aide la peau à paraître plus ferme ».',
    },
  },
  {
    id: 'authority',
    patterns: [
      '의사\\s*추천',
      '피부과\\s*(?:의사\\s*)?추천',
      '\\bFDA\\b',
      '식약처\\s*(?:인증|승인)',
      '\\bdoctor[- ]recommended',
      '\\bdermatologist[- ]recommended',
      '\\bclinically proven',
      'ທ່ານໝໍແນະນຳ',
      'ໝໍແນະນຳ',
      'แพทย์แนะนำ',
      'หมอแนะนำ',
      'recommandé par (?:les )?(?:médecins|dermatologues)',
      'cliniquement prouvé',
    ],
    why: {
      ko: '의사 추천·기관 인증은 서류로 확인된 것만 말할 수 있어요. 확인 안 된 인증은 허위 광고예요.',
      en: 'Only say "doctor recommended" or name an authority if you have the document. An unverified approval is false advertising.',
      lo: 'ເວົ້າ «ທ່ານໝໍແນະນຳ» ຫຼື ການຮັບຮອງໄດ້ສະເພາະເມື່ອມີເອກະສານຢັ້ງຢືນ. ຖ້າບໍ່ມີ ແມ່ນການໂຄສະນາບໍ່ຈິງ.',
      th: 'พูด «แพทย์แนะนำ» หรือการรับรองได้เฉพาะเมื่อมีเอกสารยืนยัน หากไม่มีถือเป็นโฆษณาเท็จ',
      fr: 'Ne dites « recommandé par les médecins » ou ne citez une autorité que si vous avez le document.',
    },
    instead: {
      ko: '궁금하면 KOREA GLOW 수석 파트너에게 서류가 있는지 먼저 물어보기.',
      en: 'Ask the KOREA GLOW lead partner first whether a document exists.',
      lo: 'ຖາມພາດເນີຫົວໜ້າຂອງ KOREA GLOW ກ່ອນວ່າມີເອກະສານບໍ່.',
      th: 'ถามพาร์ทเนอร์หัวหน้าของ KOREA GLOW ก่อนว่ามีเอกสารหรือไม่',
      fr: "Demandez d'abord à la partenaire principale KOREA GLOW si le document existe.",
    },
  },
  {
    id: 'fake-others',
    patterns: [
      '가짜',
      '짝퉁',
      '\\bfake\\b',
      '\\bcounterfeit',
      'ປອມ',
      'ของปลอม',
      'ปลอม',
      '\\bcontrefa',
    ],
    why: {
      ko: '다른 가게 제품을 증거 없이 «가짜»라고 하면 명예훼손이 될 수 있어요.',
      en: 'Calling another seller\'s goods "fake" without proof can be defamation.',
      lo: 'ການເວົ້າວ່າສິນຄ້າຂອງຮ້ານອື່ນ «ປອມ» ໂດຍບໍ່ມີຫຼັກຖານ ອາດເປັນການໝິ່ນປະໝາດ.',
      th: 'การพูดว่าสินค้าของร้านอื่น «ปลอม» โดยไม่มีหลักฐาน อาจเป็นการหมิ่นประมาท',
      fr: "Dire que les produits d'un autre vendeur sont « faux » sans preuve peut être diffamatoire.",
    },
    instead: {
      ko: '우리 이야기만: «뒷면 라벨 사진과 전성분을 앱에서 직접 확인하세요».',
      en: 'Talk about us only: "check the real back-label photo and full ingredient list in the app".',
      lo: 'ເວົ້າແຕ່ເລື່ອງຂອງເຮົາ: «ກວດເບິ່ງຮູບສະຫຼາກດ້ານຫຼັງແທ້ ແລະ ສ່ວນປະສົມໃນແອັບໄດ້ເລີຍ».',
      th: 'พูดแต่เรื่องของเรา: «ตรวจดูรูปฉลากด้านหลังจริงและส่วนผสมในแอปได้เลย»',
      fr: "Parlez de nous seulement : « vérifiez la photo de l'étiquette et la liste d'ingrédients dans l'app ».",
    },
  },
  {
    id: 'cheapest',
    patterns: [
      '최저가',
      '제일\\s*싸',
      '가장\\s*싸',
      '\\bcheapest\\b',
      '\\blowest price',
      'ຖືກທີ່ສຸດ',
      'ລາຄາຕ່ຳສຸດ',
      'ถูกที่สุด',
      'ราคาต่ำสุด',
      'le moins cher',
      'prix le plus bas',
    ],
    why: {
      ko: '«최저가»는 증명하기 어렵고, 지나친 할인은 오히려 가짜를 의심받게 해요.',
      en: '"Cheapest" is hard to prove, and a too-good price makes people suspect a fake.',
      lo: '«ຖືກທີ່ສຸດ» ພິສູດຍາກ ແລະ ລາຄາຫຼຸດຫຼາຍເກີນໄປ ເຮັດໃຫ້ຄົນສົງໄສວ່າເປັນຂອງປອມ.',
      th: '«ถูกที่สุด» พิสูจน์ยาก และราคาที่ลดมากเกินไปทำให้คนสงสัยว่าเป็นของปลอม',
      fr: '« Le moins cher » est difficile à prouver, et un prix trop bas fait soupçonner une contrefaçon.',
    },
    instead: {
      ko: '이유를 말하기: «선주문·공동구매라 재고 비용이 없어서 합리적이에요».',
      en: 'Give the reason: "pre-order and group-buy, so there is no stock cost".',
      lo: 'ບອກເຫດຜົນ: «ສັ່ງຈອງລ່ວງໜ້າ ແລະ ຊື້ເປັນກຸ່ມ ຈຶ່ງບໍ່ມີຕົ້ນທຶນສະຕັອກ».',
      th: 'บอกเหตุผล: «สั่งจองล่วงหน้าและซื้อเป็นกลุ่ม จึงไม่มีต้นทุนสต็อก»',
      fr: 'Donnez la raison : « précommande et achat groupé, donc pas de coût de stock ».',
    },
  },
];

/**
 * A deliberately bad post, for the "try an example" button: it is here, as data labelled as a bad
 * example, and not in the UI strings, because UI strings must never carry a claim.
 */
export const BAD_EXAMPLE_POST: Localized = {
  ko: '새로 온 크림! 여드름 치료, 기미 제거 100% 보장, 부작용 없음, 최저가!',
  en: 'New cream! Guaranteed to cure acne and remove dark spots, no side effects, cheapest in town!',
  lo: 'ຄີມໃໝ່! ຮັບປະກັນປິ່ນປົວສິວ ລຶບຝ້າ ບໍ່ມີຜົນຂ້າງຄຽງ ຖືກທີ່ສຸດ!',
  th: 'ครีมใหม่! รับประกันรักษาสิว ลบฝ้า ไม่มีผลข้างเคียง ถูกที่สุด!',
  fr: "Nouvelle crème ! Garantie pour guérir l'acné, efface les taches, sans effets secondaires, le moins cher !",
};

export interface WordingHit {
  readonly ruleId: string;
  readonly text: string;
  readonly index: number;
}

/** Every place in `post` that a rule's pattern matches, in reading order. */
export function checkWording(
  post: string,
  rules: readonly WordingRule[] = WORDING_RULES,
): readonly WordingHit[] {
  const hits: WordingHit[] = [];
  for (const rule of rules) {
    for (const source of rule.patterns) {
      const re = new RegExp(source, 'giu');
      for (const match of post.matchAll(re)) {
        if (match[0].length > 0)
          hits.push({ ruleId: rule.id, text: match[0], index: match.index ?? 0 });
      }
    }
  }
  const seen = new Set<string>();
  return hits
    .sort((a, b) => a.index - b.index)
    .filter((hit) => {
      const key = `${hit.index}:${hit.ruleId}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}
