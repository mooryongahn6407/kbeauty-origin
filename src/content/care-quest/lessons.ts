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
  /** A short illustrative clip for the lesson (public/lessons), when there is one — silent,
      hands/forearm only, nothing it shows is a claim: see CareLessonsScreen for how it plays. */
  readonly video?: string;
  /** The clip's first frame, shown before the reader presses play. */
  readonly videoPoster?: string;
}

const AAD_SUN = {
  name: 'AAD — how to apply sunscreen',
  url: 'https://www.aad.org/public/everyday-care/sun-protection/shade-clothing-sunscreen/how-to-apply-sunscreen',
};
const AAD_BASICS = {
  name: 'AAD — skin care basics',
  url: 'https://www.aad.org/public/everyday-care/skin-care-basics',
};
const AAD_DANDRUFF = {
  name: 'AAD — how to treat dandruff',
  url: 'https://www.aad.org/public/everyday-care/hair-scalp-care/scalp/treat-dandruff',
};
const AAD_KP = {
  name: 'AAD — keratosis pilaris self-care',
  url: 'https://www.aad.org/public/diseases/a-z/keratosis-pilaris-self-care',
};
const AAD_DRY_SKIN = {
  name: 'AAD — dry skin relief',
  url: 'https://www.aad.org/public/everyday-care/skin-care-basics/dry/dry-skin-relief',
};

export const CARE_LESSONS: readonly CareLesson[] = [
  {
    id: 'sun-forms',
    icon: '☀️',
    cover: '/gemini/B-08.jpg',
    video: '/lessons/sun-forms.mp4',
    videoPoster: '/lessons/sun-forms-poster.jpg',
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
    video: '/lessons/cleansing.mp4',
    videoPoster: '/lessons/cleansing-poster.jpg',
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
    video: '/lessons/order.mp4',
    videoPoster: '/lessons/order-poster.jpg',
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
    video: '/lessons/pairings.mp4',
    videoPoster: '/lessons/pairings-poster.jpg',
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
    video: '/lessons/eye-cream.mp4',
    videoPoster: '/lessons/eye-cream-poster.jpg',
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
    video: '/lessons/patch-test.mp4',
    videoPoster: '/lessons/patch-test-poster.jpg',
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
  {
    id: 'scalp-type',
    icon: '🧴',
    title: L(
      '두피 관리 — 비듬과 건조는 다르게',
      "Scalp care — dandruff and dryness aren't the same",
      'ການບຳລຸງຫນັງຫົວ — ຂີ້ຫົວ ແລະ ຫນັງຫົວແຫ້ງ ແຕກຕ່າງກັນ',
      'ดูแลหนังศีรษะ — รังแคกับหนังศีรษะแห้งไม่เหมือนกัน',
      "Soin du cuir chevelu — pellicules et sécheresse, ce n'est pas pareil",
    ),
    intro: L(
      '두피가 기름지고 비듬이 있는지, 아니면 건조해서 당기는지에 따라 맞는 샴푸가 달라요.',
      'Whether your scalp is oily with flaking, or dry and tight, calls for a different shampoo.',
      'ຫນັງຫົວມັນ ມີຂີ້ຫົວ ຫຼື ແຫ້ງຕຶງ — ຕ້ອງການແຊມພູຄົນລະແບບ.',
      'หนังศีรษะมันและมีรังแค หรือแห้งตึง ต้องใช้แชมพูต่างกัน',
      "Cuir chevelu gras avec pellicules, ou sec et tiraillé : le shampoing à choisir n'est pas le même.",
    ),
    sections: [
      {
        title: L(
          '비듬 vs 건조한 두피',
          'Dandruff vs. dry scalp',
          'ຂີ້ຫົວ ທຽບກັບ ຫນັງຫົວແຫ້ງ',
          'รังแค เทียบกับ หนังศีรษะแห้ง',
          'Pellicules ou cuir chevelu sec',
        ),
        body: L(
          '비듬은 두피가 기름지고 말라세지아균과 관련 있는 경우가 많고, 각질도 크고 기름져 보여요. 건조한 두피는 추운 날씨·건조한 실내·세정력이 강한 제품 같은 외부 요인으로 생기는 경우가 많고, 각질이 더 작고 하얗고 두피가 당겨요. 둘을 구분하기 어렵다면, 센 비듬 샴푸를 건조한 두피에 쓰면 오히려 더 건조해질 수 있다는 점만 기억하세요.',
          "Dandruff often comes with an oily scalp and the yeast Malassezia, with larger, oilier-looking flakes. Dry scalp is usually driven by outside causes — cold weather, dry indoor air, a harsh product — with smaller, whiter flakes and a tight feeling. If you can't tell which is which, remember that a strong anti-dandruff shampoo can make a truly dry scalp even drier.",
          'ຂີ້ຫົວ ມັກມາພ້ອມຫນັງຫົວມັນ ແລະ ເຊື້ອລາມາລາເຊເຊຍ, ສະເກັດໃຫຍ່ ແລະ ມັນກວ່າ. ຫນັງຫົວແຫ້ງ ມັກມາຈາກອາກາດໜາວ, ອາກາດແຫ້ງໃນຫ້ອງ, ຫຼື ຜະລິດຕະພັນທີ່ແຮງ — ສະເກັດນ້ອຍ ຂາວ ແລະ ຮູ້ສຶກຕຶງ. ຖ້າແຍກບໍ່ອອກ ຈື່ໄວ້ວ່າ ແຊມພູຂີ້ຫົວແຮງໆ ອາດເຮັດໃຫ້ຫນັງຫົວແຫ້ງຍິ່ງແຫ້ງກວ່າເກົ່າ.',
          'รังแคส่วนมากมาพร้อมหนังศีรษะมันและเชื้อยีสต์มาลาสซีเซีย สะเก็ดมีขนาดใหญ่และดูมันกว่า หนังศีรษะแห้งมักเกิดจากอากาศหนาว อากาศแห้งในห้อง หรือผลิตภัณฑ์ที่รุนแรง สะเก็ดเล็กกว่า สีขาว และรู้สึกตึง ถ้าแยกไม่ออก ให้จำไว้ว่าแชมพูขจัดรังแคที่แรงอาจทำให้หนังศีรษะแห้งยิ่งแห้งขึ้น',
          "Les pellicules s'accompagnent souvent d'un cuir chevelu gras et de la levure Malassezia, avec des squames plus grosses et plus grasses. Un cuir chevelu sec vient plutôt du froid, de l'air sec intérieur ou d'un produit agressif, avec des squames plus petites et blanches, et une sensation de tiraillement. En cas de doute, retenez qu'un shampoing antipelliculaire fort peut assécher davantage un cuir chevelu déjà sec.",
        ),
      },
      {
        title: L(
          '비듬 샴푸의 성분과 쓰는 빈도',
          'Dandruff shampoo: ingredients and how often',
          'ສ່ວນປະກອບ ແລະ ຄວາມຖີ່ຂອງແຊມພູຂີ້ຫົວ',
          'ส่วนผสมและความถี่ของแชมพูขจัดรังแค',
          'Shampoing antipelliculaire : ingrédients et fréquence',
        ),
        body: L(
          'AAD에 따르면 비듬 샴푸는 징크피리치온·살리실산·황·셀레늄설파이드·케토코나졸·콜타르 같은 활성 성분이 핵심이에요. 머리카락이 가늘거나 곧고 두피가 기름지면 자주 감아도 되고, 머릿결이 굵거나 곱슬이라면 일주일에 한 번 정도로 줄여도 괜찮아요(곱슬머리는 이 성분들이 모발을 더 건조하게 만들 수 있다고 해요). 한 제품이 안 들으면 활성 성분이 다른 제품으로 바꿔 보는 것도 방법이에요.',
          "AAD guidance centers on active ingredients: zinc pyrithione, salicylic acid, sulfur, selenium sulfide, ketoconazole, or coal tar. Fine or straight hair with an oily scalp can be washed often; coarse or curly hair can go down to about once a week, since these actives can dry curly hair further. If one shampoo isn't working, switching to a different active ingredient is worth trying.",
          'ອີງຕາມ AAD ແຊມພູຂີ້ຫົວ ສຳຄັນຢູ່ທີ່ສານອອກລິດ: ຊິງຄ໌ໄພຣິທິໂອນ, ອາຊິດຊາລິໄຊລິກ, ກຳມະຖັນ, ເຊເລນຽມຊຸນຟິດ, ເກໂຕໂຄນາໂຊນ, ຫຼື ນ້ຳມັນຖ່ານຫີນ. ຜົມບາງຫຼືກົງ ແລະ ຫນັງຫົວມັນ ສາມາດສະຫຼອຍເລື້ອຍໆ; ຜົມແຂງຫຼືຫ​ຍິກ ສະຫຼອຍອາທິດລະເທື່ອກໍພໍ (ສານເຫຼົ່ານີ້ອາດເຮັດໃຫ້ຜົມຫ​ຍິກແຫ້ງກວ່າເກົ່າ). ຖ້າໃຊ້ແລ້ວບໍ່ໄດ້ຜົນ ລອງປ່ຽນສານອອກລິດອື່ນ.',
          'ตาม AAD แชมพูขจัดรังแคสำคัญที่สารออกฤทธิ์: ซิงค์ไพริไทออน กรดซาลิไซลิก กำมะถัน ซีลีเนียมซัลไฟด์ คีโตโคนาโซล หรือน้ำมันดินถ่านหิน ผมเส้นเล็กหรือตรงและหนังศีรษะมันสระได้บ่อย ผมหยาบหรือหยิกลดเหลือสัปดาห์ละครั้งก็พอ (สารเหล่านี้อาจทำให้ผมหยิกแห้งขึ้นอีก) ถ้าใช้แล้วไม่ได้ผล ลองเปลี่ยนไปใช้สารออกฤทธิ์ตัวอื่น',
          "Selon l'AAD, les shampoings antipelliculaires reposent sur des actifs : pyrithione de zinc, acide salicylique, soufre, sulfure de sélénium, kétoconazole ou goudron de houille. Cheveux fins ou raides avec cuir chevelu gras : lavage fréquent possible ; cheveux épais ou bouclés : environ une fois par semaine, ces actifs pouvant assécher davantage les boucles. Si un shampoing ne fonctionne pas, changer d'actif peut aider.",
        ),
      },
      {
        title: L(
          '건조한 두피엔 보습을',
          'For a dry scalp, moisturize',
          'ຫນັງຫົວແຫ້ງ ໃຫ້ເພີ່ມຄວາມຊຸ່ມ',
          'หนังศีรษะแห้ง ให้เพิ่มความชุ่มชื้น',
          'Cuir chevelu sec : hydrater',
        ),
        body: L(
          '두피가 당기고 작은 흰 각질이 일어난다면, 센 비듬 샴푸 대신 두피용 보습 제품을 먼저 시도해 보세요. 히알루론산처럼 수분을 채우는 성분이 들어간 제품을 찾아보고, 너무 뜨거운 물로 자주 감는 것도 피하세요. 어떤 샴푸를 써도 가려움·붉어짐·각질이 계속 심하면 피부과 상담을 권해요.',
          'If your scalp feels tight with small white flakes, try a scalp-moisturizing product before reaching for a strong anti-dandruff shampoo. Look for hydrating ingredients such as hyaluronic acid, and avoid very hot water or washing too often. If itching, redness or flaking stays bad no matter what you use, see a dermatologist.',
          'ຖ້າຫນັງຫົວຕຶງ ແລະ ມີສະເກັດຂາວນ້ອຍໆ ລອງໃຊ້ຜະລິດຕະພັນໃຫ້ຄວາມຊຸ່ມແກ່ຫນັງຫົວກ່ອນແຊມພູຂີ້ຫົວແຮງໆ. ຊອກຫາສ່ວນປະສົມໃຫ້ຄວາມຊຸ່ມ ເຊັ່ນ ໄຮຢາລູໂຣນິກອາຊິດ, ແລະ ຫຼີກລ່ຽງນ້ຳຮ້ອນຫຼາຍ ຫຼື ສະຫຼອຍເລື້ອຍເກີນໄປ. ຖ້າຄັນ ແດງ ຫຼື ສະເກັດຍັງຮ້າຍແຮງຢູ່ ບໍ່ວ່າໃຊ້ຫຍັງກໍຕາມ ຄວນປຶກສາທ່ານໝໍຜິວໜັງ.',
          'ถ้าหนังศีรษะตึงและมีสะเก็ดขาวเล็กๆ ลองใช้ผลิตภัณฑ์เพิ่มความชุ่มชื้นให้หนังศีรษะก่อนแชมพูขจัดรังแคที่แรง มองหาส่วนผสมให้ความชุ่มชื้นอย่างไฮยาลูรอนิกแอซิด และหลีกเลี่ยงน้ำร้อนจัดหรือสระบ่อยเกินไป ถ้าคัน แดง หรือสะเก็ดยังรุนแรงไม่ว่าใช้อะไรก็ตาม ควรปรึกษาแพทย์ผิวหนัง',
          "Si le cuir chevelu tiraille avec de petites squames blanches, essayez d'abord un soin hydratant pour cuir chevelu plutôt qu'un shampoing antipelliculaire fort. Cherchez des ingrédients hydratants comme l'acide hyaluronique, évitez l'eau très chaude et les lavages trop fréquents. Si les démangeaisons, rougeurs ou squames persistent quoi que vous utilisiez, consultez un dermatologue.",
        ),
      },
    ],
    ingredients: ['bha', 'hyaluronic', 'panthenol', 'centella'],
    sources: [AAD_DANDRUFF],
  },
  {
    id: 'body-care',
    icon: '🛁',
    title: L(
      '바디케어 — 얼굴과 다르게 챙길 것',
      "Body care — what's different from the face",
      'ບຳລຸງຜິວກາຍ — ແຕກຕ່າງຈາກໜ້າແນວໃດ',
      'ดูแลผิวกาย — ต่างจากใบหน้าอย่างไร',
      'Soin du corps — ce qui diffère du visage',
    ),
    intro: L(
      '몸도 자외선·보습이 필요하지만 양과 방법이 얼굴과는 달라요. 닭살(모공각화증)도 흔한 고민이에요.',
      "The body needs sun protection and moisture too, but the amount and method differ from the face. Keratosis pilaris (bumpy 'goose-skin' texture) is a common concern as well.",
      'ຮ່າງກາຍກໍ່ຕ້ອງການກັນແດດ ແລະ ຄວາມຊຸ່ມຄືກັນ ແຕ່ປະລິມານ ແລະ ວິທີຕ່າງຈາກໜ້າ. ຜິວໜັງເປັນເມັດໆ (keratosis pilaris) ກໍ່ເປັນເລື່ອງທົ່ວໄປ.',
      'ร่างกายก็ต้องการกันแดดและความชุ่มชื้นเช่นกัน แต่ปริมาณและวิธีต่างจากใบหน้า ผิวเป็นตุ่มขรุขระ (keratosis pilaris) ก็เป็นปัญหาที่พบได้บ่อย',
      "Le corps a lui aussi besoin de protection solaire et d'hydratation, mais en quantité et selon une méthode différentes du visage. La kératose pilaire (peau « chair de poule ») est aussi un problème fréquent.",
    ),
    sections: [
      {
        title: L(
          '몸에도 선크림이 필요한 이유',
          'Why the body needs sunscreen too',
          'ເປັນຫຍັງຮ່າງກາຍກໍ່ຕ້ອງການກັນແດດ',
          'ทำไมร่างกายก็ต้องการกันแดด',
          "Pourquoi le corps a besoin d'écran solaire aussi",
        ),
        body: L(
          'AAD는 옷으로 가리지 않은 피부 전체에 대략 1온스(샷 잔 한 잔 분량)의 선크림을 쓰라고 안내해요. 야외에서는 2시간마다, 수영이나 땀을 많이 흘린 뒤에는 바로 덧발라요. 등처럼 손이 안 닿는 곳은 다른 사람에게 부탁하거나 스프레이 타입을 쓰고, 스프레이는 뿌린 뒤 손으로 문질러 고르게 펴 주세요.',
          'AAD guidance is roughly one ounce (about a shot glass) of sunscreen for all the skin clothing does not cover. Reapply every two hours outdoors, and right after swimming or heavy sweating. For hard-to-reach spots like the back, ask someone to help or use a spray — and rub a spray in afterward so it covers evenly.',
          'AAD ແນະນຳໃຫ້ໃຊ້ກັນແດດປະມານ 1 ອອນສ໌ (ເທົ່າຈອກຊັອດ) ກັບຜິວທັງໝົດທີ່ເສື້ອຜ້າບໍ່ປົກປິດ. ທາຊ້ຳທຸກ 2 ຊົ່ວໂມງເວລາຢູ່ນອກ ແລະ ທັນທີຫຼັງລອຍນ້ຳ ຫຼື ເຫື່ອອອກຫຼາຍ. ບ່ອນທີ່ມືເອື້ອມບໍ່ເຖິງເຊັ່ນຫຼັງ ໃຫ້ຄົນອື່ນຊ່ວຍ ຫຼື ໃຊ້ແບບສະເປຣ — ແລະ ຖູໃຫ້ທົ່ວຫຼັງສີດ.',
          'AAD แนะนำให้ใช้กันแดดประมาณ 1 ออนซ์ (เท่าแก้วช็อต) กับผิวทั้งหมดที่เสื้อผ้าไม่ได้ปกคลุม ทาซ้ำทุก 2 ชั่วโมงเมื่ออยู่กลางแจ้ง และทันทีหลังว่ายน้ำหรือเหงื่อออกมาก บริเวณที่มือเอื้อมไม่ถึงอย่างแผ่นหลัง ให้คนอื่นช่วยทาหรือใช้แบบสเปรย์ และถูให้ทั่วหลังฉีด',
          "L'AAD recommande environ une once (un verre à shot) d'écran solaire pour toute la peau non couverte par les vêtements. Renouveler toutes les deux heures en extérieur, et juste après la baignade ou une forte transpiration. Pour les zones difficiles d'accès comme le dos, demandez de l'aide ou utilisez un spray, à frotter ensuite pour une couverture uniforme.",
        ),
      },
      {
        title: L(
          '닭살(모공각화증) 관리법',
          "Caring for keratosis pilaris ('chicken skin')",
          'ການບຳລຸງຜິວເປັນເມັດໆ (Keratosis Pilaris)',
          'การดูแลผิวเป็นตุ่มขรุขระ (Keratosis Pilaris)',
          'Prendre soin de la kératose pilaire',
        ),
        body: L(
          'AAD는 꼭 없애야 하는 건 아니지만 신경 쓰인다면 세 단계를 권해요: 부드러운 각질 제거(거친 때수건이 아니라 가벼운 샤워타월 정도로), 글리콜산·락틱산·살리실산·레티놀 같은 각질 성분(지시대로만, 과하면 오히려 자극), 그 뒤 보습(오일프리 크림이나 연고). 자연히 좋아지는 데 몇 년씩 걸리기도 하고, 계속 신경 쓰이면 피부과 상담을 권해요.',
          "AAD says treatment isn't required, but if it bothers you, three steps help: gentle exfoliation (a soft washcloth, not a harsh scrub), a chemical exfoliant — glycolic or lactic acid, salicylic acid, or a retinoid, used exactly as directed since overuse irritates — and moisturizing afterward (an oil-free cream or ointment). It often clears gradually over years; see a dermatologist if it keeps bothering you.",
          'AAD ບອກວ່າບໍ່ຈຳເປັນຕ້ອງແກ້ໄຂ ແຕ່ຖ້າກັງວົນ ມີ 3 ຂັ້ນຕອນ: ຂັດຜິວເບົາໆ (ຜ້າອາບນ້ຳອ່ອນໆ ບໍ່ແມ່ນຜ້າຂັດແຮງ), ສານຂັດຜິວເຄມີ — ອາຊິດໄກລີໂຄລິກ ຫຼື ແລັກຕິກ, ອາຊິດຊາລິໄຊລິກ, ຫຼື ເຣຕິນອຍ (ໃຊ້ຕາມຄຳແນະນຳ ຖ້າໃຊ້ຫຼາຍເກີນໄປ ຈະລະຄາຍ), ແລະ ທາຄວາມຊຸ່ມຫຼັງຈາກນັ້ນ (ຄີມ ຫຼື ຂີ້ຜຶ້ງແບບບໍ່ມີນ້ຳມັນ). ມັກຄ່ອຍດີຂຶ້ນໃນໄລຍະຫຼາຍປີ, ຖ້າຍັງກັງວົນຢູ່ ຄວນປຶກສາທ່ານໝໍຜິວໜັງ.',
          'AAD บอกว่าไม่จำเป็นต้องแก้ไข แต่ถ้ากังวลมี 3 ขั้นตอน: ผลัดเซลล์ผิวเบาๆ (ผ้าขนหนูอาบน้ำนุ่มๆ ไม่ใช่การขัดแรง) สารผลัดเซลล์เคมี — กรดไกลโคลิกหรือแลคติก กรดซาลิไซลิก หรือเรตินอยด์ (ใช้ตามคำแนะนำเท่านั้น ถ้าใช้มากเกินไปจะระคายเคือง) และเพิ่มความชุ่มชื้นหลังจากนั้น (ครีมหรือขี้ผึ้งสูตรไม่มีน้ำมัน) มักค่อยๆ ดีขึ้นในช่วงหลายปี หากยังกังวลอยู่ควรปรึกษาแพทย์ผิวหนัง',
          "L'AAD indique qu'un traitement n'est pas obligatoire, mais si cela vous gêne, trois étapes aident : une exfoliation douce (gant de toilette doux, pas de gommage agressif), un exfoliant chimique — acide glycolique ou lactique, acide salicylique, ou un rétinoïde, utilisé exactement comme indiqué car un excès irrite — puis une hydratation (crème ou pommade sans huile). Cela s'estompe souvent progressivement sur plusieurs années ; consultez un dermatologue si cela persiste.",
        ),
      },
      {
        title: L(
          '목욕은 따뜻한 물로 짧게',
          'Bathe warm, not hot — and keep it short',
          'ອາບນ້ຳອຸ່ນ ບໍ່ຮ້ອນ ແລະ ບໍ່ດົນ',
          'อาบน้ำอุ่น ไม่ร้อน และใช้เวลาสั้นๆ',
          'Douche tiède, pas chaude, et courte',
        ),
        body: L(
          'AAD는 목욕·샤워를 5~10분으로 줄이고 뜨겁지 않은 따뜻한 물을 쓰라고 안내해요. 문지르지 말고 수건으로 톡톡 두드려 물기를 없애고, 향이 없는 보습제를 피부가 촉촉할 때 바로 발라요. 세정제도 꼭 필요한 만큼만 쓰면 돼요 — 거품이 두껍게 날 정도로 많이 쓰지 않아도 괜찮아요.',
          "AAD advises keeping baths and showers to five to ten minutes in warm, not hot, water. Pat dry with a towel instead of rubbing, and apply a fragrance-free moisturizer right away while skin is still damp. Use only as much cleanser as you need — you don't need a thick lather.",
          'AAD ແນະນຳໃຫ້ອາບນ້ຳ 5-10 ນາທີ ດ້ວຍນ້ຳອຸ່ນ ບໍ່ຮ້ອນ. ໃຊ້ຜ້າເຊັດຕົບເບົາໆແທນການຖູ, ແລະ ທາຄວາມຊຸ່ມແບບບໍ່ມີກິ່ນທັນທີຕອນຜິວຍັງປຽກໆ. ໃຊ້ສະບູ່ເທົ່າທີ່ຈຳເປັນ — ບໍ່ຈຳເປັນໃຫ້ມີຟອງໜາ.',
          'AAD แนะนำให้อาบน้ำ 5-10 นาที ด้วยน้ำอุ่นไม่ร้อน ใช้ผ้าขนหนูซับเบาๆ แทนการถู และทามอยส์เจอไรเซอร์สูตรไม่มีกลิ่นทันทีตอนผิวยังชื้นอยู่ ใช้คลีนเซอร์เท่าที่จำเป็น ไม่ต้องให้เกิดฟองหนา',
          "L'AAD recommande des douches ou bains de cinq à dix minutes à l'eau tiède, pas chaude. Tamponnez avec une serviette plutôt que de frotter, et appliquez une crème hydratante sans parfum tout de suite pendant que la peau est encore humide. Utilisez seulement la quantité de nettoyant nécessaire, sans chercher une mousse épaisse.",
        ),
      },
    ],
    ingredients: ['sunscreen', 'aha', 'bha', 'retinol', 'hyaluronic'],
    sources: [AAD_SUN, AAD_KP, AAD_DRY_SKIN],
  },
];
