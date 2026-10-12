/**
 * Care lessons — the background the Care Quest result points to: sunscreen forms and filters,
 * cleansing and pH, toners, the order things go on and how long to wait, which ingredients get
 * on and which to keep apart, why eye cream is its own product, and the patch test.
 *
 * KOREA GLOW's own consumer education, Draft, written from the dermatology-society pages in
 * `sources` via the 2026-10-12 research pass. Where the research found no authoritative number
 * (how many minutes to wait after vitamin C, exact skin pH), the text says "a few minutes" and
 * "around 5" rather than inventing precision.
 */
import { L } from './common';
import type { Localized, Source } from './types';

export interface LessonSection {
  readonly title: Localized;
  readonly body: Localized;
}

export interface CareLesson {
  readonly id: string;
  readonly icon: string;
  readonly title: Localized;
  readonly intro: Localized;
  readonly sections: readonly LessonSection[];
  /** Company-dictionary ids the lesson talks about, offered as links. */
  readonly ingredients: readonly string[];
  readonly sources: readonly Source[];
  /** A picture for the top of the lesson (public/gemini), when there is one. */
  readonly cover?: string;
}

const AAD_SUN = {
  name: 'AAD — how to apply sunscreen',
  url: 'https://www.aad.org/public/everyday-care/sun-protection/shade-clothing-sunscreen/how-to-apply-sunscreen',
};
const AAD_BASICS = {
  name: 'AAD — skin care basics',
  url: 'https://www.aad.org/public/everyday-care/skin-care-basics',
};

export const CARE_LESSONS: readonly CareLesson[] = [
  {
    id: 'sun-forms',
    icon: '☀️',
    cover: '/gemini/B-08.jpg',
    title: L(
      '선케어 더 알기 — 필터와 제형',
      'Sun care, further — filters and forms',
      'ກັນແດດ — ຕົວກອງ ແລະ ຮູບແບບ',
      'กันแดดเพิ่มเติม — ตัวกรองและเนื้อสัมผัส',
      'Protection solaire — filtres et formats',
    ),
    intro: L(
      '무기자차·유기자차·혼합자차의 차이, 선스틱·선크림·선에센스·선쿠션은 언제 쓰는지.',
      'Mineral, chemical and hybrid filters — and when to reach for a stick, cream, essence or cushion.',
      'ຕົວກອງແຮ່ທາດ, ເຄມີ ແລະ ປະສົມ — ແລະ ເວລາໃຊ້ແບບແທ່ງ, ຄີມ, ເອັສເຊັນ, ຄຸຊັ່ນ.',
      'ตัวกรองแร่ธาตุ เคมี และแบบผสม และควรใช้แบบแท่ง ครีม เอสเซนส์ หรือคุชชั่นเมื่อไร',
      'Filtres minéraux, chimiques et hybrides — et quand choisir stick, crème, essence ou cushion.',
    ),
    sections: [
      {
        title: L(
          '무기자차 (미네랄)',
          'Mineral filters',
          'ຕົວກອງແຮ່ທາດ',
          'ตัวกรองแร่ธาตุ (ฟิสิคอล)',
          'Filtres minéraux',
        ),
        body: L(
          '징크옥사이드·티타늄디옥사이드가 피부 위에서 자외선을 막아요. 민감한 피부·눈가에 덜 자극적인 경우가 많고, 하얗게 뜨는 백탁이 생길 수 있어요.',
          'Zinc oxide and titanium dioxide block UV from the skin’s surface. Often gentler on sensitive skin and around the eyes; can leave a white cast.',
          'ສັງກະສີອອກໄຊ ແລະ ໄທທານຽມໄດອອກໄຊ ກັນ UV ຢູ່ເທິງຜິວ. ມັກອ່ອນໂຍນກັບຜິວແພ້ງ່າຍ; ອາດເປັນຄາບຂາວ.',
          'ซิงค์ออกไซด์และไทเทเนียมไดออกไซด์กันรังสีบนผิว มักอ่อนโยนกับผิวแพ้ง่ายและรอบดวงตา อาจทำให้หน้าวอก',
          'Oxyde de zinc et dioxyde de titane bloquent les UV en surface ; souvent plus doux, peuvent blanchir.',
        ),
      },
      {
        title: L(
          '유기자차 (화학적 필터)와 혼합자차',
          'Chemical and hybrid filters',
          'ຕົວກອງເຄມີ ແລະ ແບບປະສົມ',
          'ตัวกรองเคมีและแบบผสม',
          'Filtres chimiques et hybrides',
        ),
        body: L(
          '유기자차는 자외선을 흡수하는 방식이라 가볍고 투명해요. 혼합자차는 둘을 섞어 백탁은 줄이고 바르는 느낌을 가볍게 한 제품이에요. 어느 쪽이든 SPF·PA 표시는 같은 기준으로 시험한 결과예요 — 내가 매일 쓰기 편한 것이 가장 좋은 선크림이에요.',
          'Chemical filters absorb UV, so they feel light and clear. Hybrids mix both to cut white cast and keep a light feel. Either way the SPF and PA on the label come from the same tests — the best sunscreen is the one you will wear every day.',
          'ຕົວກອງເຄມີ ດູດຊຶມ UV ຈຶ່ງເບົາ ແລະ ໃສ. ແບບປະສົມ ລວມທັງສອງ. ກັນແດດທີ່ດີທີ່ສຸດ ແມ່ນອັນທີ່ທ່ານໃຊ້ທຸກມື້.',
          'ตัวกรองเคมีดูดซับรังสีจึงบางเบาใส แบบผสมรวมทั้งสองเพื่อลดหน้าวอก ค่า SPF และ PA ทดสอบด้วยมาตรฐานเดียวกัน กันแดดที่ดีที่สุดคือตัวที่คุณทาได้ทุกวัน',
          'Les filtres chimiques absorbent les UV : légers et transparents. Les hybrides mêlent les deux. Le meilleur écran est celui qu’on porte chaque jour.',
        ),
      },
      {
        title: L(
          '제형별로 언제 쓰나',
          'Which form, when',
          'ແຕ່ລະຮູບແບບໃຊ້ຕອນໃດ',
          'แต่ละแบบใช้เมื่อไร',
          'Quel format, quand',
        ),
        body: L(
          '선크림·선로션: 아침 첫 도포에 양을 정확히 바르기 좋아요. 선에센스·선젤: 가볍고 투명해서 지성·더운 날에. 선스틱: 손에 안 묻어 밖에서 덧바르기 편해요(여러 번 문질러야 양이 충분해요). 선쿠션: 화장 위에 덧바를 때 — 다만 쿠션만으로는 양이 부족하기 쉬워 아침엔 크림을 먼저.',
          'Cream or lotion: best for the first, measured morning layer. Essence or gel: light and clear for oily skin and hot days. Stick: no mess, handy for reapplying outdoors (go over it several times to get enough). Cushion: for touching up over make-up — but alone it rarely gives enough, so start the morning with a cream.',
          'ຄີມ/ໂລຊັ່ນ: ສຳລັບທາຄັ້ງທຳອິດຕອນເຊົ້າ. ເອັສເຊັນ/ເຈວ: ເບົາ ສຳລັບຜິວມັນ. ແທ່ງ: ທາຊ້ຳງ່າຍຢູ່ນອກ. ຄຸຊັ່ນ: ທາຊ້ຳເທິງເຄື່ອງແຕ່ງໜ້າ — ແຕ່ຢ່າໃຊ້ຢ່າງດຽວ.',
          'ครีม/โลชั่น: เหมาะกับการทาครั้งแรกตอนเช้า เอสเซนส์/เจล: บางเบาสำหรับผิวมันและวันร้อน แบบแท่ง: ทาซ้ำนอกบ้านสะดวก (ต้องปาดหลายรอบ) คุชชั่น: ทาซ้ำทับเมคอัพ แต่ใช้อย่างเดียวมักได้ปริมาณไม่พอ',
          'Crème/lait : première couche du matin. Essence/gel : léger pour peau grasse. Stick : pratique pour renouveler dehors. Cushion : retouche sur maquillage, insuffisant seul.',
        ),
      },
      {
        title: L(
          '실내·비 오는 날·차 안',
          'Indoors, rainy days, in a vehicle',
          'ໃນເຮືອນ, ມື້ຝົນ, ໃນລົດ',
          'ในบ้าน วันฝนตก ในรถ',
          'Intérieur, pluie, en voiture',
        ),
        body: L(
          '자외선 A는 유리창을 통과하고, 구름 낀 날에도 상당 부분 내려와요. 창가에서 일하거나 차·툭툭을 오래 탄다면 실내에서도 아침에 바르세요. 하루 종일 실내에만 있다면 아침 한 번으로 충분한 경우가 많아요.',
          'UVA passes through window glass and much UV gets through cloud. If you work by a window or spend long hours in a car or tuk-tuk, wear it indoors too. If you are indoors all day, the morning layer is usually enough.',
          'UVA ຜ່ານແວ່ນປ່ອງຢ້ຽມໄດ້ ແລະ ຜ່ານເມກ. ຖ້າເຮັດວຽກໃກ້ປ່ອງຢ້ຽມ ຫຼື ຂີ່ລົດດົນ ໃຫ້ທາ. ຢູ່ໃນເຮືອນທັງມື້ ທາຕອນເຊົ້າເທື່ອດຽວກໍພໍ.',
          'UVA ผ่านกระจกหน้าต่างได้ และรังสีผ่านเมฆได้มาก ถ้าทำงานริมหน้าต่างหรือนั่งรถ ตุ๊กตุ๊กนานๆ ให้ทาแม้อยู่ในร่ม ถ้าอยู่ในบ้านทั้งวัน ทาตอนเช้าครั้งเดียวมักพอ',
          'Les UVA traversent les vitres et les nuages. Près d’une fenêtre ou en voiture, mettez-en ; à l’intérieur toute la journée, le matin suffit souvent.',
        ),
      },
    ],
    ingredients: ['sunscreen', 'vitc', 'vite'],
    sources: [
      AAD_SUN,
      {
        name: 'Skin Cancer Foundation — sunscreen',
        url: 'https://www.skincancer.org/skin-cancer-prevention/sun-protection/sunscreen/',
      },
    ],
  },
  {
    id: 'cleansing',
    icon: '🫧',
    title: L(
      '클렌징과 pH',
      'Cleansing and pH',
      'ການລ້າງໜ້າ ແລະ pH',
      'การล้างหน้าและค่า pH',
      'Nettoyage et pH',
    ),
    intro: L(
      '클렌징 오일·밤·밀크·폼·젤·클렌징 워터의 차이, 이중 세안이 필요한 날, 약산성이 왜 말해지는지.',
      'Oil, balm, milk, foam, gel and micellar water; when you need a double cleanse; why "mildly acidic" comes up.',
      'ນ້ຳມັນ, ບາມ, ນົມ, ໂຟມ, ເຈວ ແລະ ນ້ຳລ້າງໜ້າ; ເວລາຕ້ອງລ້າງສອງຂັ້ນ; ເປັນຫຍັງກົດອ່ອນ.',
      'ออยล์ บาล์ม น้ำนม โฟม เจล และไมเซลลาร์ เมื่อไรต้องล้างสองขั้นตอน และทำไมพูดถึงกรดอ่อน',
      'Huile, baume, lait, mousse, gel, eau micellaire ; quand doubler ; pourquoi « légèrement acide ».',
    ),
    sections: [
      {
        title: L(
          '종류별 쓰임',
          'What each is for',
          'ແຕ່ລະແບບໃຊ້ເຮັດຫຍັງ',
          'แต่ละแบบใช้ทำอะไร',
          'À quoi sert chacun',
        ),
        body: L(
          '오일·밤: 선크림·화장을 녹이는 1차 세안. 밀크·크림: 건성·민감 피부의 순한 세안. 폼: 거품으로 땀·피지를 씻는 2차 세안 — 지성·복합성에. 젤: 거품이 적고 가벼워 대부분에게 무난. 클렌징 워터(미셀라): 화장솜으로 닦아 내는 간편 세안, 그 뒤 물세안 권장.',
          'Oil or balm: the first cleanse that melts sunscreen and make-up. Milk or cream: gentle, for dry or sensitive skin. Foam: a lathering second cleanse for sweat and oil — oily and combination skin. Gel: light, low-foam, suits most. Micellar water: a quick wipe-off, best followed by water.',
          'ນ້ຳມັນ/ບາມ: ລ້າງທຳອິດ. ນົມ/ຄີມ: ອ່ອນໂຍນສຳລັບຜິວແຫ້ງ. ໂຟມ: ລ້າງທີສອງ ສຳລັບຜິວມັນ. ເຈວ: ເບົາ ເໝາະກັບຫຼາຍຄົນ. ນ້ຳໄມເຊລາ: ເຊັດອອກ ແລ້ວລ້າງນ້ຳ.',
          'ออยล์/บาล์ม: ล้างขั้นแรกละลายกันแดดและเมคอัพ น้ำนม/ครีม: อ่อนโยนสำหรับผิวแห้งและแพ้ง่าย โฟม: ล้างขั้นที่สองสำหรับผิวมันและผสม เจล: ฟองน้อย เหมาะกับคนส่วนใหญ่ ไมเซลลาร์: เช็ดออกสะดวก แล้วล้างน้ำตาม',
          'Huile/baume : premier nettoyage. Lait/crème : doux pour peau sèche. Mousse : second nettoyage, peau grasse. Gel : léger, convient à presque tous. Eau micellaire : à rincer ensuite.',
        ),
      },
      {
        title: L(
          '이중 세안은 언제?',
          'When to double-cleanse',
          'ລ້າງສອງຂັ້ນເມື່ອໃດ',
          'ล้างสองขั้นตอนเมื่อไร',
          'Quand doubler',
        ),
        body: L(
          '선크림이나 화장을 한 날 저녁: 오일·밤 → 폼·젤. 아침이나 아무것도 바르지 않은 날은 한 번이면 충분해요. 너무 자주·세게 씻으면 장벽이 약해져 오히려 건조·번들거림이 늘어요.',
          'Evenings after sunscreen or make-up: oil or balm, then foam or gel. In the morning, or on a bare-skin day, once is enough. Washing too often or too hard weakens the barrier and can make dryness — and shine — worse.',
          'ແລງ ຫຼັງທາກັນແດດ ຫຼື ແຕ່ງໜ້າ: ນ້ຳມັນ → ໂຟມ. ຕອນເຊົ້າ ເທື່ອດຽວພໍ. ລ້າງເລື້ອຍເກີນ ເຮັດໃຫ້ເກາະປ້ອງກັນອ່ອນ.',
          'เย็นหลังทากันแดดหรือแต่งหน้า: ออยล์ → โฟมหรือเจล ตอนเช้าหรือวันที่ไม่ได้ทาอะไรล้างครั้งเดียวพอ ล้างบ่อยหรือแรงเกินไปทำให้เกราะผิวอ่อนแอ',
          'Le soir après écran ou maquillage : huile puis mousse. Le matin, une fois suffit. Trop laver affaiblit la barrière.',
        ),
      },
      {
        title: L(
          'pH와 «약산성»',
          'pH and "mildly acidic"',
          'pH ແລະ «ກົດອ່ອນ»',
          'ค่า pH และ «กรดอ่อน»',
          'pH et « légèrement acide »',
        ),
        body: L(
          '피부 표면은 약산성(대략 pH 4–6, 보통 5 안팎)이에요. 비누처럼 알칼리성이 강한 세정제는 씻은 뒤 더 당기게 할 수 있어서, 피부와 비슷한 약산성 세안제가 덜 자극적이라고 흔히 말해요. 세안 후 당기면 세안제를 바꿔 볼 신호예요.',
          'The skin’s surface is mildly acidic (roughly pH 4–6, usually around 5). Strongly alkaline cleansers such as bar soap can leave skin tighter, which is why a mildly acidic cleanser closer to skin is often called gentler. Tightness after washing is a sign to try another cleanser.',
          'ຜິວເປັນກົດອ່ອນ (pH ປະມານ 4–6, ສ່ວນຫຼາຍປະມານ 5). ສະບູດ່າງແຮງ ອາດເຮັດໃຫ້ຕຶງ. ຖ້າລ້າງແລ້ວຕຶງ ລອງປ່ຽນ.',
          'ผิวมีความเป็นกรดอ่อน (ราว pH 4–6 ส่วนใหญ่ประมาณ 5) สบู่ที่เป็นด่างสูงอาจทำให้ตึง คลีนเซอร์กรดอ่อนจึงมักถูกเรียกว่าอ่อนโยนกว่า ถ้าล้างแล้วตึงลองเปลี่ยน',
          'La peau est légèrement acide (pH 4–6, souvent vers 5). Un savon très alcalin tiraille davantage ; si ça tire, changez de nettoyant.',
        ),
      },
    ],
    ingredients: ['ceramide', 'panthenol'],
    sources: [
      AAD_BASICS,
      {
        name: 'Cleveland Clinic — skin barrier',
        url: 'https://health.clevelandclinic.org/skin-barrier',
      },
    ],
  },
  {
    id: 'order',
    icon: '🪜',
    cover: '/gemini/B-09.jpg',
    title: L(
      '바르는 순서와 기다리는 시간',
      'What goes on first, and how long to wait',
      'ລຳດັບການທາ ແລະ ເວລາລໍຖ້າ',
      'ลำดับการทาและเวลารอ',
      'L’ordre et le temps d’attente',
    ),
    intro: L(
      '토너부터 크림까지 왜 그 순서인지, 토너가 왜 필요한지, 비타민 C와 선크림 사이엔 왜 잠깐 기다리는지.',
      'Why toner comes before cream, what toner is for, and why you pause between vitamin C and sunscreen.',
      'ເປັນຫຍັງໂທນເນີກ່ອນຄີມ, ໂທນເນີມີໄວ້ເຮັດຫຍັງ, ແລະ ເປັນຫຍັງລໍຖ້າກ່ອນກັນແດດ.',
      'ทำไมโทนเนอร์ก่อนครีม โทนเนอร์มีไว้ทำอะไร และทำไมต้องรอระหว่างวิตามินซีกับกันแดด',
      'Pourquoi le tonique avant la crème, à quoi il sert, et pourquoi attendre avant l’écran.',
    ),
    sections: [
      {
        title: L(
          '묽은 것에서 진한 것으로',
          'Thin to thick',
          'ຈາກບາງຫາໜາ',
          'จากบางไปหนา',
          'Du plus fluide au plus épais',
        ),
        body: L(
          '세안 → 토너 → 에센스 → 세럼·앰플 → 아이크림 → 로션·크림 → (아침) 선크림. 물처럼 묽은 것이 먼저 스며들고, 기름진 크림이 마지막에 덮어 수분이 날아가지 않게 해요. 크림 위에 세럼을 바르면 잘 스며들지 않아요.',
          'Cleanse → toner → essence → serum or ampoule → eye cream → lotion or cream → (morning) sunscreen. Watery things sink in first; the richer cream goes last to keep the water in. Serum over cream barely gets through.',
          'ລ້າງ → ໂທນເນີ → ເອັສເຊັນ → ເຊລັ່ມ → ຄີມຮອບຕາ → ຄີມ → (ເຊົ້າ) ກັນແດດ. ຂອງບາງຊຶມກ່ອນ ຄີມປິດທ້າຍ.',
          'ล้างหน้า → โทนเนอร์ → เอสเซนส์ → เซรั่ม/แอมพูล → อายครีม → โลชั่น/ครีม → (เช้า) กันแดด ของเหลวซึมก่อน ครีมปิดท้ายเพื่อกักความชุ่มชื้น',
          'Nettoyer → tonique → essence → sérum → contour des yeux → crème → (matin) écran. Le fluide d’abord, le riche en dernier.',
        ),
      },
      {
        title: L(
          '토너는 왜 필요할까',
          'What toner is for',
          'ໂທນເນີມີໄວ້ເຮັດຫຍັງ',
          'โทนเนอร์มีไว้ทำอะไร',
          'À quoi sert le tonique',
        ),
        body: L(
          '세안 직후 비어 있는 피부에 첫 수분을 주고 남은 잔여물을 정리해, 다음 단계가 고르게 펴지게 해요. 수분 토너(건성·모든 피부), 진정 토너(병풀·어성초 — 민감·트러블), 각질 토너(AHA·BHA·PHA — 주 2–3회, 매일 아님)가 있어요. 화장솜으로 닦거나 손바닥으로 눌러 흡수시켜요.',
          'It gives freshly washed skin its first water and clears what is left, so the next steps spread evenly. Hydrating toners suit everyone; soothing ones (centella, heartleaf) suit sensitive or breakout-prone skin; exfoliating ones (AHA, BHA, PHA) are for two or three times a week, not daily. Swipe with a pad or press in with your palms.',
          'ໃຫ້ນ້ຳທຳອິດກັບຜິວ ເພື່ອໃຫ້ຂັ້ນຕໍ່ໄປທາໄດ້ດີ. ໂທນເນີໃຫ້ຄວາມຊຸ່ມ, ຜ່ອນຄາຍ, ແລະ ຂັດຂີ້ໄຄ (ອາທິດລະ 2–3 ເທື່ອ).',
          'ให้น้ำแรกกับผิวหลังล้างหน้าและเก็บสิ่งตกค้าง เพื่อให้ขั้นต่อไปเกลี่ยได้ทั่ว มีโทนเนอร์ให้ความชุ่มชื้น ปลอบประโลม (ใบบัวบก พลูคาว) และผลัดเซลล์ (AHA BHA PHA สัปดาห์ละ 2–3 ครั้ง)',
          'Il hydrate la peau juste lavée pour que la suite s’étale bien. Hydratant, apaisant (centella, houttuynia) ou exfoliant (2–3 fois par semaine).',
        ),
      },
      {
        title: L(
          '비타민 C → 몇 분 → 선크림',
          'Vitamin C → a few minutes → sunscreen',
          'ວິຕາມິນ C → ຈັກນາທີ → ກັນແດດ',
          'วิตามินซี → รอสักครู่ → กันแดด',
          'Vitamine C → quelques minutes → écran',
        ),
        body: L(
          '비타민 C는 아침, 선크림 전에 써요 — 자외선 차단을 보완하는 항산화 성분이라서요. 바른 뒤 몇 분(대략 3–5분) 스며들게 두면 선크림이 밀리거나 뭉치지 않고 고르게 발려요. 레티놀은 밤에, 세안 후 피부가 완전히 마른 뒤에 바르면 덜 따가워요.',
          'Vitamin C goes on in the morning, before sunscreen, as an antioxidant that backs up sun protection. Giving it a few minutes (roughly three to five) to sink in stops the sunscreen pilling and lets it spread evenly. Retinol goes on at night, on fully dry skin after washing, where it stings less.',
          'ວິຕາມິນ C ຕອນເຊົ້າ ກ່ອນກັນແດດ. ລໍຖ້າຈັກນາທີ (ປະມານ 3–5) ໃຫ້ຊຶມ. ເຣຕິນອລ ຕອນກາງຄືນ ເທິງຜິວແຫ້ງ.',
          'วิตามินซีใช้ตอนเช้าก่อนกันแดด เพราะเป็นสารต้านอนุมูลอิสระที่ช่วยเสริมการกันแดด รอให้ซึมสักครู่ (ราว 3–5 นาที) กันแดดจะไม่เป็นขุยและเกลี่ยได้ทั่ว เรตินอลใช้กลางคืนบนผิวที่แห้งสนิทหลังล้างหน้าจะแสบน้อยกว่า',
          'Vitamine C le matin, avant l’écran ; laisser pénétrer quelques minutes (3 à 5). Rétinol le soir, sur peau bien sèche.',
        ),
      },
    ],
    ingredients: ['vitc', 'retinol', 'hyaluronic', 'ceramide'],
    sources: [
      AAD_BASICS,
      {
        name: 'Cleveland Clinic — vitamin C serum',
        url: 'https://health.clevelandclinic.org/vitamin-c-serum',
      },
      {
        name: 'Cleveland Clinic — what does toner do',
        url: 'https://health.clevelandclinic.org/what-does-toner-do',
      },
    ],
  },
  {
    id: 'pairings',
    icon: '🤝',
    cover: '/gemini/A-04.jpg',
    title: L(
      '같이 쓰면 좋은 성분, 떨어뜨릴 성분',
      'Ingredients that get on, and ones to keep apart',
      'ສ່ວນປະສົມທີ່ເຂົ້າກັນ ແລະ ທີ່ຄວນແຍກ',
      'ส่วนผสมที่ใช้คู่กันได้ และที่ควรแยก',
      'Ingrédients compatibles, et à séparer',
    ),
    intro: L(
      '아침·저녁으로 나누면 대부분 함께 쓸 수 있어요. 같은 밤에 겹치면 따가운 조합만 기억해요.',
      'Split across morning and night, most can be used together. Just remember the pairs that sting on the same night.',
      'ແບ່ງເຊົ້າ-ແລງ ກໍໃຊ້ຮ່ວມກັນໄດ້. ຈື່ໄວ້ຄູ່ທີ່ແສບເມື່ອໃຊ້ຄືນດຽວກັນ.',
      'แบ่งใช้เช้า-เย็น ส่วนใหญ่ใช้ด้วยกันได้ แค่จำคู่ที่ทำให้แสบเมื่อใช้คืนเดียวกัน',
      'Répartis matin et soir, la plupart cohabitent. Retenez les paires qui piquent le même soir.',
    ),
    sections: [
      {
        title: L('함께 쓰면 좋은 짝', 'Good partners', 'ຄູ່ທີ່ດີ', 'คู่ที่ดี', 'Bons partenaires'),
        body: L(
          '비타민 C + 선크림(+ 비타민 E): 아침의 기본 짝. 나이아신아마이드 + 히알루론산: 대부분의 피부에 무난. 레티놀 + 세라마이드·판테놀: 레티놀의 건조함을 줄여 줘요. 트라넥사믹애씨드 + 나이아신아마이드: 톤 관리에 흔히 함께 써요.',
          'Vitamin C + sunscreen (+ vitamin E): the classic morning pair. Niacinamide + hyaluronic acid: easy for most skin. Retinol + ceramide or panthenol: eases retinol dryness. Tranexamic acid + niacinamide: often used together for tone.',
          'ວິຕາມິນ C + ກັນແດດ; ໄນອາຊິນາໄມ + ໄຮຢາລູໂຣນິກ; ເຣຕິນອລ + ເຊຣາໄມ; ທຣາເນັກຊາມິກ + ໄນອາຊິນາໄມ.',
          'วิตามินซี + กันแดด (+ วิตามินอี) คู่พื้นฐานตอนเช้า ไนอาซินาไมด์ + ไฮยาลูรอนิก ใช้ได้กับผิวส่วนใหญ่ เรตินอล + เซราไมด์หรือแพนทีนอล ลดความแห้ง ทรานซามิก + ไนอาซินาไมด์ มักใช้คู่กันเพื่อปรับสีผิว',
          'Vitamine C + écran (+ vitamine E) ; niacinamide + acide hyaluronique ; rétinol + céramides ; acide tranexamique + niacinamide.',
        ),
      },
      {
        title: L(
          '같은 밤엔 떨어뜨리기',
          'Not on the same night',
          'ບໍ່ໃຊ້ຄືນດຽວກັນ',
          'ไม่ใช้คืนเดียวกัน',
          'Pas le même soir',
        ),
        body: L(
          '레티놀 + AHA·BHA: 번갈아 다른 밤에. 고농도 비타민 C + AHA·BHA: 따가우면 아침·저녁으로 나눠요. 레티놀 + 벤조일퍼옥사이드: 같은 시간에 겹치지 않기. 각질 성분 여러 개를 한꺼번에 쓰지 않기 — 장벽이 상하면 다 따가워져요.',
          'Retinol + AHA or BHA: alternate nights. Strong vitamin C + AHA or BHA: split morning and evening if it stings. Retinol + benzoyl peroxide: not at the same time. Never stack several exfoliants at once — a damaged barrier makes everything sting.',
          'ເຣຕິນອລ + AHA/BHA: ສະຫຼັບຄືນ. ວິຕາມິນ C ເຂັ້ມ + AHA/BHA: ແຍກເຊົ້າ-ແລງ. ບໍ່ໃຊ້ສ່ວນປະສົມຂັດຂີ້ໄຄຫຼາຍອັນພ້ອມກັນ.',
          'เรตินอล + AHA/BHA: สลับคืน วิตามินซีเข้มข้น + AHA/BHA: ถ้าแสบให้แยกเช้า-เย็น เรตินอล + เบนโซอิลเปอร์ออกไซด์: ไม่ใช้พร้อมกัน อย่าใช้สารผลัดเซลล์หลายตัวพร้อมกัน',
          'Rétinol + AHA/BHA : soirs alternés. Vitamine C forte + acides : matin et soir séparés. Rétinol + peroxyde de benzoyle : jamais ensemble.',
        ),
      },
    ],
    ingredients: [
      'vitc',
      'vite',
      'niacinamide',
      'hyaluronic',
      'retinol',
      'ceramide',
      'panthenol',
      'txa',
      'aha',
      'bha',
    ],
    sources: [
      AAD_BASICS,
      {
        name: 'Cleveland Clinic — niacinamide',
        url: 'https://health.clevelandclinic.org/niacinamide',
      },
      {
        name: 'AAD — safely exfoliate at home',
        url: 'https://www.aad.org/public/everyday-care/skin-care-secrets/routine/safely-exfoliate-at-home',
      },
    ],
  },
  {
    id: 'eye-cream',
    icon: '👁️',
    title: L(
      '아이크림은 왜 따로 있을까',
      'Why eye cream is its own product',
      'ເປັນຫຍັງມີຄີມຮອບຕາ',
      'ทำไมต้องมีอายครีมแยก',
      'Pourquoi un soin contour des yeux',
    ),
    intro: L(
      '눈가는 얼굴에서 피부가 가장 얇고 피지선이 적어요.',
      'Around the eyes the skin is the thinnest on the face, with few oil glands.',
      'ຜິວຮອບຕາບາງທີ່ສຸດ ແລະ ມີຕ່ອມນ້ຳມັນໜ້ອຍ.',
      'ผิวรอบดวงตาบางที่สุดบนใบหน้าและมีต่อมไขมันน้อย',
      'La peau du contour est la plus fine du visage.',
    ),
    sections: [
      {
        title: L(
          '무엇이 다른가',
          'What is different',
          'ແຕກຕ່າງແນວໃດ',
          'ต่างกันอย่างไร',
          'Ce qui change',
        ),
        body: L(
          '얇고 기름이 적어 건조·잔주름이 먼저 보이고, 눈에 들어가기 쉬워요. 아이크림은 눈가에 덜 자극적이도록 농도·향을 조절해 만든 제품이에요. 얼굴 크림이 눈가에 따갑지 않다면 그것을 써도 괜찮아요.',
          'Thin and low in oil, it shows dryness and fine lines first, and product easily reaches the eye. Eye creams adjust strength and fragrance to be gentler there. If your face cream does not sting around the eyes, it is fine to use it.',
          'ບາງ ແລະ ນ້ຳມັນໜ້ອຍ ຈຶ່ງແຫ້ງ ແລະ ມີຮອຍກ່ອນ. ຄີມຮອບຕາ ເຮັດໃຫ້ອ່ອນໂຍນກວ່າ. ຖ້າຄີມໜ້າບໍ່ແສບ ກໍໃຊ້ໄດ້.',
          'บางและมันน้อย จึงแห้งและเกิดริ้วรอยก่อน และผลิตภัณฑ์เข้าตาง่าย อายครีมปรับความเข้มข้นและน้ำหอมให้อ่อนโยนขึ้น ถ้าครีมหน้าไม่แสบรอบดวงตาก็ใช้แทนได้',
          'Fine et peu grasse, elle marque en premier. Le soin yeux est formulé plus doux ; une crème visage qui ne pique pas convient aussi.',
        ),
      },
      {
        title: L('바르는 법', 'How to apply', 'ວິທີທາ', 'วิธีทา', 'Comment l’appliquer'),
        body: L(
          '쌀알 크기를 약지에 덜어 눈 밑 뼈를 따라 톡톡. 속눈썹 바로 위·아래는 피해요. 문지르거나 당기지 않기. 다크서클·주름이 신경 쓰인다면 아침엔 선크림을 눈가까지 바르는 것이 먼저예요.',
          'A rice-grain amount on the ring finger, patted along the orbital bone; keep off the lash line; no rubbing or pulling. For dark circles or lines, sunscreen up to the eye area in the morning comes first.',
          'ເທົ່າເມັດເຂົ້າ ຕົບດ້ວຍນິ້ວນາງ ຕາມກະດູກໃຕ້ຕາ; ບໍ່ຖູ. ກັນແດດຮອດຮອບຕາກ່ອນ.',
          'ปริมาณเท่าเมล็ดข้าวบนนิ้วนาง แตะตามกระดูกใต้ตา ไม่ทาชิดขนตา ไม่ถูหรือดึง ถ้ากังวลเรื่องใต้ตาคล้ำหรือริ้วรอย กันแดดถึงรอบดวงตาตอนเช้าต้องมาก่อน',
          'Un grain de riz à l’annulaire, tapoté le long de l’os ; sans frotter. L’écran jusqu’au contour d’abord.',
        ),
      },
    ],
    ingredients: ['peptide', 'adenosine', 'retinol', 'hyaluronic'],
    sources: [
      {
        name: 'Cleveland Clinic — dark circles',
        url: 'https://my.clevelandclinic.org/health/symptoms/23128-dark-circles-under-eyes',
      },
      {
        name: 'Cleveland Clinic — crow’s feet',
        url: 'https://my.clevelandclinic.org/health/diseases/24586-crows-feet',
      },
    ],
  },
  {
    id: 'patch-test',
    icon: '🩹',
    title: L(
      '패치 테스트 — 새 제품을 쓰기 전에',
      'The patch test — before any new product',
      'ທົດສອບກ່ອນໃຊ້ຜະລິດຕະພັນໃໝ່',
      'ทดสอบก่อนใช้ผลิตภัณฑ์ใหม่',
      'Le test avant tout nouveau produit',
    ),
    intro: L(
      '알레르기나 자극이 있는지 작은 곳에서 먼저 확인해요.',
      'Check a small patch first for allergy or irritation.',
      'ກວດບ່ອນນ້ອຍໆກ່ອນ ວ່າແພ້ ຫຼື ບໍ່.',
      'ทดสอบบริเวณเล็กๆ ก่อนว่าแพ้หรือระคายเคืองไหม',
      'Vérifiez d’abord sur une petite zone.',
    ),
    sections: [
      {
        title: L('방법', 'How', 'ວິທີ', 'วิธี', 'Comment'),
        body: L(
          '귀 뒤나 팔 안쪽에 동전 크기만큼, 하루 2번, 며칠(가능하면 7–10일) 같은 자리에 발라요. 염색약은 48시간 테스트. 붉어짐·가려움·따가움·부어오름이 있으면 씻어 내고 그 제품은 쓰지 않아요.',
          'A coin-sized amount behind the ear or on the inner arm, twice a day, on the same spot for several days (7–10 if you can). Hair dye: a 48-hour test. Redness, itching, stinging or swelling: wash it off and do not use that product.',
          'ຫຼັງຫູ ຫຼື ແຂນດ້ານໃນ ເທົ່າຫຼຽນ ມື້ລະ 2 ເທື່ອ ຫຼາຍມື້. ຢາຍ້ອມຜົມ 48 ຊົ່ວໂມງ. ຖ້າແດງ ຄັນ ແສບ ບວມ ຢ່າໃຊ້.',
          'หลังหูหรือท้องแขนปริมาณเท่าเหรียญ วันละ 2 ครั้ง ที่เดิมหลายวัน (7–10 วันถ้าทำได้) ยาย้อมผมทดสอบ 48 ชั่วโมง ถ้าแดง คัน แสบ หรือบวม ให้ล้างออกและไม่ใช้',
          'Derrière l’oreille ou à l’intérieur du bras, deux fois par jour, plusieurs jours. Coloration : 48 h. Réaction : rincer et ne pas utiliser.',
        ),
      },
      {
        title: L(
          '바로 진료가 필요한 때',
          'When to get help at once',
          'ເມື່ອຕ້ອງໄປໂຮງໝໍທັນທີ',
          'เมื่อต้องพบแพทย์ทันที',
          'Quand consulter tout de suite',
        ),
        body: L(
          '얼굴·입술·눈이 붓거나, 물집·진물이 생기거나, 숨쉬기 힘들면 바로 병원·응급실로 가요.',
          'Swelling of the face, lips or eyes, blisters or oozing, or trouble breathing: go to a clinic or emergency straight away.',
          'ໜ້າ ສົບ ຕາບວມ, ພຸພອງ, ຫຼື ຫາຍໃຈຍາກ: ໄປໂຮງໝໍທັນທີ.',
          'หน้า ริมฝีปาก หรือตาบวม มีตุ่มพองหรือน้ำเหลือง หรือหายใจลำบาก ไปโรงพยาบาลหรือห้องฉุกเฉินทันที',
          'Gonflement du visage, cloques ou gêne respiratoire : urgences immédiatement.',
        ),
      },
    ],
    ingredients: [],
    sources: [
      {
        name: 'AAD — how to test skin care products',
        url: 'https://www.aad.org/public/everyday-care/skin-care-basics/care/test-skin-care-products',
      },
    ],
  },
];
