/**
 * English and Lao for the short usage, season and pairing sentences in the owner's master
 * (sheets 사용법·계절 and 궁합). The master writes them in Korean; these 85 sentences repeat
 * across products, so one table covers all 92. Lao is an unreviewed draft, like the whole Lao
 * catalog, and the app already says so on every screen.
 *
 * `ko` is set only where the Korean sentence repeats the heading it sits under ("건기(11~2월):
 * …" under "서늘한 건기 (11~2월)"); the screen shows that shorter form instead.
 *
 * A sentence missing here falls back to the Korean original with a "Korean only" note — never
 * to a guessed translation.
 */
export interface SentenceTranslation {
  readonly ko?: string;
  readonly en: string;
  readonly lo: string;
}

export const USAGE_TRANSLATIONS: Readonly<Record<string, SentenceTranslation>> = {
  // ── usage & seasons ────────────────────────────────────────────
  '가볍게 한 겹 (선크림 전)': {
    en: 'One light layer (before sunscreen)',
    lo: 'ທາບາງໆ ໜຶ່ງຊັ້ນ (ກ່ອນທາກັນແດດ)',
  },
  '건조하면 얇게 덧바르기': {
    en: 'If skin feels dry, add a thin layer',
    lo: 'ຖ້າຮູ້ສຶກແຫ້ງ ທາເພີ່ມບາງໆ',
  },
  '에센스 다음 마지막 단계에서 넉넉히': {
    en: 'Generously, as the last step after essence',
    lo: 'ທາໃຫ້ພຽງພໍ ເປັນຂັ້ນຕອນສຸດທ້າຍ ຫຼັງເອສເຊັນ',
  },
  '건기(11~2월): 풍부하게, 밤에는 한 겹 더': {
    ko: '풍부하게, 밤에는 한 겹 더',
    en: 'Apply richly; add one more layer at night',
    lo: 'ທາໃຫ້ຫຼາຍຂຶ້ນ, ຕອນກາງຄືນທາເພີ່ມອີກໜຶ່ງຊັ້ນ',
  },
  '가장 더운 때: 얇게, 번들거리는 T존은 생략해도 돼요': {
    ko: '얇게, 번들거리는 T존은 생략해도 돼요',
    en: 'Thinly; you can skip a shiny T-zone',
    lo: 'ທາບາງໆ, ບໍລິເວນ T-zone ທີ່ມັນເຫຼື້ອມ ບໍ່ທາກໍ່ໄດ້',
  },
  '우기: 젤·가벼운 타입과 번갈아 써도 좋아요': {
    ko: '젤·가벼운 타입과 번갈아 써도 좋아요',
    en: 'Fine to alternate with a gel or lighter texture',
    lo: 'ສາມາດໃຊ້ສະລັບກັບແບບເຈວ ຫຼື ແບບບາງເບົາໄດ້',
  },
  '이 제품의 핵심 성분은 저녁 사용이 권장돼요 — 아침에는 건너뛰고 선크림을 쓰세요': {
    en: 'Its key ingredient is best used in the evening — skip it in the morning and use sunscreen',
    lo: 'ສ່ວນປະສົມຫຼັກແນະນຳໃຫ້ໃຊ້ຕອນແລງ — ຕອນເຊົ້າຂ້າມໄປ ແລະ ທາກັນແດດແທນ',
  },
  '토너 다음, 크림 전에 2~3방울': {
    en: '2–3 drops after toner, before cream',
    lo: '2–3 ຢົດ ຫຼັງໂທນເນີ ກ່ອນຄຣີມ',
  },
  '토너 다음, 크림 전에 · 밤에 집중': {
    en: 'After toner, before cream · focus on night use',
    lo: 'ຫຼັງໂທນເນີ ກ່ອນຄຣີມ · ເນັ້ນໃຊ້ຕອນກາງຄືນ',
  },
  '건조한 계절에는 보습 성분 위주로': {
    en: 'In the dry season, lean on moisturizing steps',
    lo: 'ລະດູແລ້ງ ເນັ້ນຜະລິດຕະພັນໃຫ້ຄວາມຊຸ່ມ',
  },
  '더운 때엔 가볍게 한두 방울': {
    en: 'In the heat, just one or two drops',
    lo: 'ຊ່ວງຮ້ອນ ໃຊ້ແຕ່ໜຶ່ງ ຫຼື ສອງຢົດ',
  },
  '습한 날엔 흡수 빠른 타입이 산뜻해요': {
    en: 'On humid days, a fast-absorbing texture feels fresher',
    lo: 'ມື້ທີ່ອາກາດຊຸ່ມ ແບບທີ່ຊຶມໄວຈະຮູ້ສຶກສົດຊື່ນກວ່າ',
  },
  '세안 직후 첫 단계, 화장솜이나 손으로 넉넉히': {
    en: 'First step right after washing — generously, with a cotton pad or your hands',
    lo: 'ຂັ້ນຕອນທຳອິດຫຼັງລ້າງໜ້າ — ໃຊ້ສຳລີ ຫຼື ມື ທາໃຫ້ພຽງພໍ',
  },
  '건조하면 다시 한 번 톡톡': { en: 'If dry, pat on once more', lo: 'ຖ້າແຫ້ງ ຕົບເບົາໆອີກຄັ້ງ' },
  '세안 직후 첫 단계': { en: 'First step right after washing', lo: 'ຂັ້ນຕອນທຳອິດຫຼັງລ້າງໜ້າ' },
  '건조한 계절엔 세안 후 바로 보습 (당김 방지)': {
    en: 'In the dry season, moisturize right after washing so skin does not feel tight',
    lo: 'ລະດູແລ້ງ ໃຫ້ບຳລຸງຄວາມຊຸ່ມທັນທີຫຼັງລ້າງໜ້າ ເພື່ອບໍ່ໃຫ້ຜິວຕຶງ',
  },
  '땀·피지 많은 때: 아침·저녁 두 번': {
    ko: '아침·저녁 두 번',
    en: 'When sweaty or oily: twice, morning and evening',
    lo: 'ຊ່ວງເຫື່ອ ແລະ ຄວາມມັນຫຼາຍ: ສອງເທື່ອ ເຊົ້າ ແລະ ແລງ',
  },
  '습한 우기: 세안 뒤 산뜻한 토너로 마무리': {
    ko: '세안 뒤 산뜻한 토너로 마무리',
    en: 'Finish with a fresh toner after washing',
    lo: 'ຫຼັງລ້າງໜ້າ ປິດທ້າຍດ້ວຍໂທນເນີທີ່ສົດຊື່ນ',
  },
  '눈가 뼈를 따라 소량을 톡톡': {
    en: 'Pat a small amount along the eye bone',
    lo: 'ຕົບເບົາໆ ປະລິມານໜ້ອຍ ຕາມກະດູກອ້ອມຕາ',
  },
  '크림 전, 눈가 뼈를 따라 톡톡': {
    en: 'Before cream, pat along the eye bone',
    lo: 'ກ່ອນຄຣີມ ຕົບເບົາໆ ຕາມກະດູກອ້ອມຕາ',
  },
  '특별한 날 전 아침에 한 장 (10분)': {
    en: 'One sheet on the morning before a special day (10 minutes)',
    lo: 'ໜຶ່ງແຜ່ນ ຕອນເຊົ້າກ່ອນມື້ພິເສດ (10 ນາທີ)',
  },
  '건조하거나 피곤한 낮에는 사무실에서 10분': {
    en: 'On a dry or tiring day, 10 minutes at the office',
    lo: 'ມື້ທີ່ແຫ້ງ ຫຼື ເມື່ອຍ ໃຊ້ 10 ນາທີ ຢູ່ຫ້ອງການ',
  },
  '세안 후 토너 다음, 10~20분 · 주 2~3회': {
    en: 'After washing and toner, 10–20 minutes · 2–3 times a week',
    lo: 'ຫຼັງລ້າງໜ້າ ແລະ ໂທນເນີ, 10–20 ນາທີ · ອາທິດລະ 2–3 ເທື່ອ',
  },
  '건조한 바람엔 주 3회까지': {
    en: 'In dry winds, up to 3 times a week',
    lo: 'ລົມແຫ້ງ ໃຊ້ໄດ້ເຖິງອາທິດລະ 3 ເທື່ອ',
  },
  '햇볕에 지친 날 차갑게 두었다 사용하면 상쾌해요': {
    en: 'After a sunny day, chill it first — it feels refreshing',
    lo: 'ຫຼັງມື້ທີ່ຖືກແດດຫຼາຍ ເອົາໄປແຊ່ເຢັນກ່ອນໃຊ້ ຈະສົດຊື່ນ',
  },
  '습한 날엔 주 2회로 충분': {
    en: 'On humid days, twice a week is enough',
    lo: 'ມື້ອາກາດຊຸ່ມ ອາທິດລະ 2 ເທື່ອກໍ່ພໍ',
  },
  '미온수로 가볍게 (또는 폼 소량)': {
    en: 'Lightly with lukewarm water (or a little foam)',
    lo: 'ລ້າງເບົາໆດ້ວຍນ້ຳອຸ່ນ (ຫຼື ໂຟມໜ້ອຍໜຶ່ງ)',
  },
  '땀·피지가 많은 날엔 한 번 더': {
    en: 'Once more on sweaty, oily days',
    lo: 'ມື້ທີ່ເຫື່ອ ແລະ ຄວາມມັນຫຼາຍ ລ້າງອີກເທື່ອໜຶ່ງ',
  },
  '선크림·메이크업을 지운 뒤 거품을 내 30초 세안': {
    en: 'After removing sunscreen and makeup, lather and wash for 30 seconds',
    lo: 'ຫຼັງລ້າງກັນແດດ ແລະ ເຄື່ອງແຕ່ງໜ້າອອກ ຕີໃຫ້ເປັນຟອງ ແລ້ວລ້າງໜ້າ 30 ວິນາທີ',
  },
  '스킨케어 마지막 단계에서 외출 30분 전, 얼굴 전체에 충분히': {
    en: 'Last step of skincare, 30 minutes before going out — enough to cover the whole face',
    lo: 'ຂັ້ນຕອນສຸດທ້າຍ, 30 ນາທີກ່ອນອອກນອກ — ທາໃຫ້ທົ່ວໜ້າ ແລະ ພຽງພໍ',
  },
  '2~3시간마다, 땀·물 뒤에는 바로 덧바르기': {
    en: 'Every 2–3 hours, and right away after sweating or water',
    lo: 'ທຸກ 2–3 ຊົ່ວໂມງ ແລະ ທາຊ້ຳທັນທີຫຼັງເຫື່ອອອກ ຫຼື ຖືກນ້ຳ',
  },
  '클렌징으로 꼼꼼히 지우기 (선크림은 남기지 않기)': {
    en: 'Remove it thoroughly with cleansing (do not leave sunscreen on)',
    lo: 'ລ້າງອອກໃຫ້ໝົດດ້ວຍຜະລິດຕະພັນລ້າງໜ້າ (ຢ່າປະກັນແດດໄວ້)',
  },
  '11~2월 서늘한 건기: 흐려도 자외선은 있어요 — 아침 습관 유지': {
    ko: '흐려도 자외선은 있어요 — 아침 습관 유지',
    en: 'UV is there even when it is cloudy — keep the morning habit',
    lo: 'ເຖິງຟ້າມືດຄຶ້ມ ກໍ່ຍັງມີລັງສີ UV — ຮັກສານິໄສຕອນເຊົ້າໄວ້',
  },
  '3~5월 가장 더운 때: 자외선 최고 — 덧바르기 간격을 줄이세요': {
    ko: '자외선 최고 — 덧바르기 간격을 줄이세요',
    en: 'UV is at its peak — reapply more often',
    lo: 'ລັງສີ UV ສູງສຸດ — ທາຊ້ຳໃຫ້ຖີ່ຂຶ້ນ',
  },
  '6~10월 우기: 워터프루프·땀에 강한 타입이 편해요': {
    ko: '워터프루프·땀에 강한 타입이 편해요',
    en: 'Waterproof, sweat-resistant types are easier',
    lo: 'ແບບກັນນ້ຳ ແລະ ທົນເຫື່ອ ໃຊ້ສະດວກກວ່າ',
  },
  '샤워 후 물기가 남았을 때 바로': {
    en: 'Right after a shower, while skin is still damp',
    lo: 'ທັນທີຫຼັງອາບນ້ຳ ຕອນຜິວຍັງຊຸ່ມຢູ່',
  },
  '건조한 부위(팔꿈치·무릎)는 덧바르기': {
    en: 'Add more on dry spots (elbows, knees)',
    lo: 'ທາເພີ່ມບ່ອນທີ່ແຫ້ງ (ສອກ, ຫົວເຂົ່າ)',
  },
  '샤워 후 전신에': { en: 'All over the body after a shower', lo: 'ທາທົ່ວຮ່າງກາຍ ຫຼັງອາບນ້ຳ' },
  '외출 전 손등 위주로': {
    en: 'Before going out, mainly on the backs of the hands',
    lo: 'ກ່ອນອອກນອກ ເນັ້ນທາຫຼັງມື',
  },
  '손 씻은 뒤마다 소량': {
    en: 'A little after every hand wash',
    lo: 'ໜ້ອຍໜຶ່ງ ທຸກເທື່ອຫຼັງລ້າງມື',
  },
  '잠자기 전 넉넉히 바르고 손톱 주변까지': {
    en: 'Generously before bed, including around the nails',
    lo: 'ທາໃຫ້ຫຼາຍກ່ອນນອນ ລວມທັງອ້ອມເລັບ',
  },
  '머리를 적신 뒤 두피부터 마사지하듯 거품내기, 충분히 헹구기': {
    en: 'Wet your hair, lather from the scalp with a gentle massage, rinse well',
    lo: 'ເຮັດໃຫ້ຜົມປຽກ ນວດໜັງຫົວໃຫ້ເປັນຟອງ ແລ້ວລ້າງອອກໃຫ້ສະອາດ',
  },
  '저녁 샴푸를 권장 — 하루 먼지·피지를 씻어내요': {
    en: 'Evening shampoo is best — it washes off the day’s dust and oil',
    lo: 'ແນະນຳສະຜົມຕອນແລງ — ລ້າງຂີ້ຝຸ່ນ ແລະ ຄວາມມັນຂອງມື້ອອກ',
  },
  '외출 전 얇게': { en: 'A thin layer before going out', lo: 'ທາບາງໆ ກ່ອນອອກນອກ' },
  '건조할 때마다 덧바르기': {
    en: 'Reapply whenever it feels dry',
    lo: 'ທາຊ້ຳທຸກເທື່ອທີ່ຮູ້ສຶກແຫ້ງ',
  },
  '잠들기 전 넉넉히': { en: 'Generously before sleep', lo: 'ທາໃຫ້ຫຼາຍກ່ອນນອນ' },
  '스킨케어·선크림 후 얇게 밀착': {
    en: 'A thin, close layer after skincare and sunscreen',
    lo: 'ທາບາງໆໃຫ້ຕິດແໜ້ນ ຫຼັງບຳລຸງຜິວ ແລະ ກັນແດດ',
  },
  '번들거리면 오일 페이퍼로 정리 후 덧바르기': {
    en: 'If shiny, blot with oil paper, then touch up',
    lo: 'ຖ້າມັນເຫຼື້ອມ ໃຊ້ເຈ້ຍຊັບມັນກ່ອນ ແລ້ວທາເພີ່ມ',
  },
  '클렌징으로 꼼꼼히 지우기': {
    en: 'Remove it thoroughly with cleansing',
    lo: 'ລ້າງອອກໃຫ້ໝົດດ້ວຍຜະລິດຕະພັນລ້າງໜ້າ',
  },
  '맥박이 뛰는 손목·목 뒤에 1~2번': {
    en: '1–2 sprays on the wrists and back of the neck, where the pulse is',
    lo: '1–2 ເທື່ອ ທີ່ຂໍ້ມື ແລະ ຫຼັງຄໍ ບ່ອນທີ່ມີຊີບພະຈອນ',
  },
  '저녁 약속에는 한 번 더 가볍게': {
    en: 'One more light spray before an evening out',
    lo: 'ກ່ອນນັດຕອນແລງ ສີດເບົາໆອີກເທື່ອໜຶ່ງ',
  },
  '구성품마다 아침·저녁 순서가 다름 — 상자 안내 참고': {
    en: 'Each item has its own morning/evening order — see the box',
    lo: 'ແຕ່ລະອັນມີລຳດັບເຊົ້າ/ແລງຕ່າງກັນ — ເບິ່ງຄຳແນະນຳໃນກ່ອງ',
  },

  // ── pairing reasons ────────────────────────────────────────────
  '각질 제거 직후 바로 사용 — 따가울 수 있어요': {
    en: 'Right after exfoliating — it may sting',
    lo: 'ໃຊ້ທັນທີຫຼັງຂັດຜິວ — ອາດຈະແສບ',
  },
  '각질 케어 산(AHA·BHA) 제품과 같은 날 밤에 겹쳐 쓰기 — 자극이 커질 수 있어요. 요일을 나눠 쓰세요':
    {
      en: 'Layering with an exfoliating acid (AHA/BHA) the same night — irritation can build up. Use them on different days',
      lo: 'ໃຊ້ຊ້ອນກັບຜະລິດຕະພັນກົດຂັດຜິວ (AHA·BHA) ໃນຄືນດຽວກັນ — ອາດລະຄາຍເຄືອງຫຼາຍຂຶ້ນ. ໃຫ້ແຍກມື້ໃຊ້',
    },
  '각질 케어 산(AHA·BHA) 제품과 동시에 — 따가울 수 있어요. 시간대를 나누세요': {
    en: 'At the same time as an exfoliating acid (AHA/BHA) — it may sting. Use them at different times',
    lo: 'ໃຊ້ພ້ອມກັບກົດຂັດຜິວ (AHA·BHA) — ອາດຈະແສບ. ໃຫ້ແຍກເວລາໃຊ້',
  },
  '같은 날 스크럽·각질 제거 제품을 여러 개 겹쳐 쓰기 — 피부가 당길 수 있어요': {
    en: 'Several scrubs or exfoliators on the same day — skin can feel tight',
    lo: 'ໃຊ້ສະຄຣັບ ຫຼື ຜະລິດຕະພັນຂັດຜິວຫຼາຍອັນໃນມື້ດຽວ — ຜິວອາດຕຶງ',
  },
  '고농도 비타민C와 함께 써서 따가우면 아침·저녁으로 나눠 쓰세요': {
    en: 'If it stings with a strong vitamin C, use one in the morning and one at night',
    lo: 'ຖ້າໃຊ້ກັບວິຕາມິນ C ເຂັ້ມຂຸ້ນແລ້ວແສບ ໃຫ້ແຍກໃຊ້ເຊົ້າ ແລະ ແລງ',
  },
  '낮에는 선크림 — 이 성분을 쓰는 동안에는 자외선 차단이 특히 중요해요': {
    en: 'Sunscreen by day — while using this ingredient, sun protection matters even more',
    lo: 'ກາງເວັນທາກັນແດດ — ໃນຊ່ວງໃຊ້ສ່ວນປະສົມນີ້ ການກັນແດດຍິ່ງສຳຄັນ',
  },
  '눈가에 각질 케어 산·레티놀 제품을 겹쳐 바르기 — 눈가 피부는 얇아요': {
    en: 'Layering exfoliating acids or retinol around the eyes — that skin is thin',
    lo: 'ທາກົດຂັດຜິວ ຫຼື ເຣຕິນອນຊ້ອນກັນອ້ອມຕາ — ຜິວອ້ອມຕາບາງ',
  },
  '다른 사람과 함께 쓰기 — 위생을 위해 개인용으로 쓰세요': {
    en: 'Sharing it with others — keep it personal, for hygiene',
    lo: 'ໃຊ້ຮ່ວມກັບຄົນອື່ນ — ເພື່ອອະນາໄມ ໃຫ້ໃຊ້ສ່ວນຕົວ',
  },
  '다른 스킨케어·메이크업과 자유롭게 함께 쓸 수 있어요': {
    en: 'Works freely with your other skincare and makeup',
    lo: 'ໃຊ້ຮ່ວມກັບຜະລິດຕະພັນບຳລຸງຜິວ ແລະ ເຄື່ອງແຕ່ງໜ້າອື່ນໄດ້ຢ່າງອິດສະຫຼະ',
  },
  '다른 제품과 섞어서 바르기 — 차단 효과가 떨어질 수 있어요. 마지막에 따로 바르세요': {
    en: 'Mixing it with other products — protection can drop. Apply it on its own, last',
    lo: 'ປະສົມກັບຜະລິດຕະພັນອື່ນ — ການກັນແດດອາດຫຼຸດລົງ. ໃຫ້ທາແຍກເປັນຂັ້ນຕອນສຸດທ້າຍ',
  },
  '레티놀 제품과 같은 날 밤에 겹쳐 쓰기 — 자극이 커질 수 있어요. 요일을 나눠 쓰세요': {
    en: 'Layering with retinol the same night — irritation can build up. Use them on different days',
    lo: 'ໃຊ້ຊ້ອນກັບເຣຕິນອນໃນຄືນດຽວກັນ — ອາດລະຄາຍເຄືອງຫຼາຍຂຶ້ນ. ໃຫ້ແຍກມື້ໃຊ້',
  },
  '레티놀 제품과 같은 시간대 — 아침에는 비타민C, 밤에는 레티놀로 나누세요': {
    en: 'At the same time as retinol — vitamin C in the morning, retinol at night',
    lo: 'ໃຊ້ເວລາດຽວກັບເຣຕິນອນ — ຕອນເຊົ້າວິຕາມິນ C, ຕອນກາງຄືນເຣຕິນອນ',
  },
  '바디 제품 — 샤워 후 물기가 남았을 때 함께': {
    en: 'Body care — together, while skin is still damp after a shower',
    lo: 'ຜະລິດຕະພັນດູແລຜິວກາຍ — ໃຊ້ພ້ອມກັນ ຕອນຜິວຍັງຊຸ່ມຫຼັງອາບນ້ຳ',
  },
  '바디로션을 먼저 바르고 그 위에 향수 — 향이 더 오래 머무는 데 도움이 될 수 있어요': {
    en: 'Body lotion first, perfume on top — it can help the scent last longer',
    lo: 'ທາໂລຊັ່ນກ່ອນ ແລ້ວສີດນ້ຳຫອມທັບ — ອາດຊ່ວຍໃຫ້ກິ່ນຢູ່ດົນຂຶ້ນ',
  },
  '보습 크림 — 건조함과 당김을 줄이는 데 도움이 될 수 있어요': {
    en: 'Moisturizing cream — it can help with dryness and tightness',
    lo: 'ຄຣີມບຳລຸງຄວາມຊຸ່ມ — ອາດຊ່ວຍຫຼຸດຄວາມແຫ້ງ ແລະ ຄວາມຕຶງ',
  },
  '샴푸와 트리트먼트·컨디셔너를 같은 날 순서대로': {
    en: 'Shampoo, then treatment or conditioner, on the same day',
    lo: 'ສະຜົມ ແລ້ວໃຊ້ທຣີດເມັນ ຫຼື ຄອນດິຊັນເນີ ໃນມື້ດຽວກັນ ຕາມລຳດັບ',
  },
  '선크림 — 기미·잡티 관리는 매일의 자외선 차단과 함께할 때 의미가 있어요': {
    en: 'Sunscreen — caring for dark spots only makes sense with daily sun protection',
    lo: 'ກັນແດດ — ການດູແລຝ້າ ແລະ ຈຸດດ່າງດຳ ຈະມີຄວາມໝາຍເມື່ອກັນແດດທຸກມື້',
  },
  '세럼·앰플 — 토너 다음 단계': {
    en: 'Serum or ampoule — the step after toner',
    lo: 'ເຊຣັ່ມ ຫຼື ແອມພູນ — ຂັ້ນຕອນຫຼັງໂທນເນີ',
  },
  '세트 구성품끼리 안내된 순서대로 사용': {
    en: 'Use the set’s items in the order given',
    lo: 'ໃຊ້ສິນຄ້າໃນຊຸດຕາມລຳດັບທີ່ແນະນຳ',
  },
  '수분 세럼·앰플 — 촉촉함을 더하는 데 도움이 될 수 있어요': {
    en: 'Hydrating serum or ampoule — it can add moisture',
    lo: 'ເຊຣັ່ມ ຫຼື ແອມພູນໃຫ້ຄວາມຊຸ່ມ — ອາດຊ່ວຍເພີ່ມຄວາມຊຸ່ມຊື່ນ',
  },
  '스크럽·필링 등 다른 각질 제거 제품과 겹쳐 쓰기': {
    en: 'Layering with other exfoliators such as scrubs or peels',
    lo: 'ໃຊ້ຊ້ອນກັບຜະລິດຕະພັນຂັດຜິວອື່ນ ເຊັ່ນ ສະຄຣັບ ຫຼື ພີລລິງ',
  },
  '스킨케어와 선크림을 먼저 바른 뒤 사용': {
    en: 'Use after your skincare and sunscreen',
    lo: 'ໃຊ້ຫຼັງຈາກບຳລຸງຜິວ ແລະ ທາກັນແດດແລ້ວ',
  },
  '아침에는 선크림으로 마무리': {
    en: 'Finish with sunscreen in the morning',
    lo: 'ຕອນເຊົ້າ ປິດທ້າຍດ້ວຍກັນແດດ',
  },
  '어떤 제품과도 함께 쓸 수 있어요 — 사용 후에는 깨끗이 관리해 주세요': {
    en: 'Works with any product — keep it clean after use',
    lo: 'ໃຊ້ກັບຜະລິດຕະພັນໃດກໍ່ໄດ້ — ຫຼັງໃຊ້ໃຫ້ຮັກສາຄວາມສະອາດ',
  },
  '저녁에는 클렌징으로 깨끗이 지우기': {
    en: 'Cleanse it off well in the evening',
    lo: 'ຕອນແລງ ລ້າງອອກໃຫ້ສະອາດ',
  },
  '진정·보습 제품 — 각질 케어 뒤 피부를 편안하게 하는 데 도움이 될 수 있어요': {
    en: 'Calming, moisturizing products — they can help skin feel comfortable after exfoliating',
    lo: 'ຜະລິດຕະພັນຜ່ອນຄາຍ ແລະ ໃຫ້ຄວາມຊຸ່ມ — ອາດຊ່ວຍໃຫ້ຜິວສະບາຍຫຼັງຂັດຜິວ',
  },
  '크림 — 앞 단계의 수분을 덮어 주는 마무리': {
    en: 'Cream — the final layer that seals in the steps before',
    lo: 'ຄຣີມ — ຊັ້ນສຸດທ້າຍທີ່ປິດຄວາມຊຸ່ມຂອງຂັ້ນຕອນກ່ອນໜ້າ',
  },
  '토너 — 세안 뒤 피부결을 정돈하는 첫 단계': {
    en: 'Toner — the first step after washing, to prep the skin',
    lo: 'ໂທນເນີ — ຂັ້ນຕອນທຳອິດຫຼັງລ້າງໜ້າ ເພື່ອປັບສະພາບຜິວ',
  },
  '특별히 피해야 할 조합은 알려진 것이 없어요': {
    en: 'No combination is known to avoid',
    lo: 'ບໍ່ມີການໃຊ້ຮ່ວມກັນທີ່ຮູ້ວ່າຄວນຫຼີກລ່ຽງ',
  },
  '핸드크림 — 손을 씻은 뒤 함께': {
    en: 'Hand cream — together, after washing your hands',
    lo: 'ຄຣີມທາມື — ໃຊ້ພ້ອມກັນຫຼັງລ້າງມື',
  },
  '향이 강한 제품을 여러 개 겹쳐 쓰기 — 향이 섞여요': {
    en: 'Layering several strongly scented products — the scents mix',
    lo: 'ໃຊ້ຜະລິດຕະພັນທີ່ມີກິ່ນແຮງຫຼາຍອັນຊ້ອນກັນ — ກິ່ນຈະປົນກັນ',
  },

  // ── the master's notes on what a judgement is based on ─────────
  '성분 기준': { en: 'the printed ingredients', lo: 'ສ່ວນປະສົມທີ່ພິມໃນສະຫຼາກ' },
  '성분 기준 일반 안내예요 — 피부 상태에 따라 다를 수 있어요': {
    en: 'General guidance from the ingredients — it may differ with your skin',
    lo: 'ຄຳແນະນຳທົ່ວໄປຕາມສ່ວນປະສົມ — ອາດແຕກຕ່າງຕາມສະພາບຜິວ',
  },
  '제품 종류 기준 일반 안내예요 — 성분표가 확인되면 더 정확해져요': {
    en: 'General guidance from the product type — it gets more precise once the ingredient list is confirmed',
    lo: 'ຄຳແນະນຳທົ່ວໄປຕາມປະເພດສິນຄ້າ — ຈະຊັດເຈນຂຶ້ນເມື່ອຢືນຢັນລາຍການສ່ວນປະສົມ',
  },
};

/** The sentence in the reader's language, and whether it fell back to the Korean original. */
export function translateSentence(
  korean: string,
  locale: string,
): { readonly text: string; readonly korean: boolean } {
  const entry = USAGE_TRANSLATIONS[korean];
  if (locale === 'ko') return { text: entry?.ko ?? korean, korean: false };
  if (!entry) return { text: korean, korean: true };
  return { text: locale === 'lo' ? entry.lo : entry.en, korean: false };
}
