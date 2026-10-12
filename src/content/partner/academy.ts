/**
 * KOREA GLOW Partner Academy — five short units for shop owners and influencers who sell with us.
 *
 * This is KOREA GLOW's own training material, written for partners, and it says so on every
 * screen: Draft, not reviewed by an outside expert. It teaches practice (how to check a label, what
 * not to say, how to take an order, how to keep a customer's information private) and makes no
 * claim about what any product or ingredient does.
 *
 * Finishing a unit changes nothing about a partner's commission, rank or status (rule 9: mastery is
 * kept apart from partner and commercial status). Progress is the reader's own, on their phone.
 */
import type { Trilingual } from '../company/ingredient-dictionary-types';

export interface AcademyQuestion {
  readonly q: Trilingual;
  readonly options: readonly Trilingual[];
  /** Index into `options`. */
  readonly answer: number;
  readonly why: Trilingual;
}

export interface AcademyUnit {
  readonly id: string;
  readonly icon: string;
  /** One of the owner's lifestyle photos until the commissioned cover (D-01…D-05) arrives. */
  readonly cover: string;
  readonly coverFocus?: string;
  readonly title: Trilingual;
  readonly intro: Trilingual;
  readonly points: readonly Trilingual[];
  readonly quiz: readonly AcademyQuestion[];
  /** Opens the partner post checker from this unit. */
  readonly linksToChecker?: boolean;
}

export const ACADEMY_STATUS = 'Draft' as const;

export const ACADEMY: readonly AcademyUnit[] = [
  {
    id: 'ACADEMY-1',
    icon: '🔍',
    cover: '/scenes/scene-06.jpg',
    coverFocus: '50% 30%',
    title: { ko: '정품 확인하는 법', en: 'Checking a product is genuine', lo: 'ວິທີກວດສິນຄ້າແທ້' },
    intro: {
      ko: '손님이 가장 먼저 묻는 말은 «진짜예요?»입니다. 말보다 보여 주는 것이 믿음을 줍니다.',
      en: 'The first thing customers ask is "Is it real?" Showing beats telling.',
      lo: 'ສິ່ງທຳອິດທີ່ລູກຄ້າຖາມແມ່ນ «ແມ່ນຂອງແທ້ບໍ?» ການສະແດງໃຫ້ເຫັນ ໜ້າເຊື່ອຖືກວ່າການເວົ້າ.',
    },
    points: [
      {
        ko: '한국 화장품 뒷면에는 보통 한국어 전성분, 만든 회사, 제조번호, 사용기한이 인쇄되어 있어요.',
        en: 'The back of a Korean cosmetic usually prints the full ingredient list in Korean, the maker, a batch number and an expiry date.',
        lo: 'ດ້ານຫຼັງຂອງເຄື່ອງສຳອາງເກົາຫຼີ ໂດຍທົ່ວໄປຈະພິມສ່ວນປະສົມເປັນພາສາເກົາຫຼີ, ບໍລິສັດຜູ້ຜະລິດ, ເລກລັອດ ແລະ ວັນໝົດອາຍຸ.',
      },
      {
        ko: '앱 제품 페이지의 «실물 뒷면 라벨 사진»과 손님 손에 있는 제품을 나란히 비교해 보세요.',
        en: 'Compare the product in the customer\'s hand with the "real back label" photo on the app\'s product page.',
        lo: 'ປຽບທຽບສິນຄ້າໃນມືລູກຄ້າ ກັບ «ຮູບສະຫຼາກດ້ານຫຼັງແທ້» ໃນໜ້າສິນຄ້າຂອງແອັບ.',
      },
      {
        ko: '지나치게 싼 가격, 찌그러진 포장, 흐린 인쇄는 조심하세요. KOREA GLOW 제품은 KOREA GLOW를 통해서만 받으세요.',
        en: 'Be careful with prices that are too low, damaged packaging or blurry printing. Get KOREA GLOW products only through KOREA GLOW.',
        lo: 'ລະວັງລາຄາທີ່ຖືກເກີນໄປ, ກ່ອງທີ່ເສຍຫາຍ ຫຼື ການພິມທີ່ບໍ່ຊັດ. ຮັບສິນຄ້າ KOREA GLOW ຜ່ານ KOREA GLOW ເທົ່ານັ້ນ.',
      },
    ],
    quiz: [
      {
        q: {
          ko: '손님이 «진짜예요?»라고 물을 때 가장 좋은 행동은?',
          en: 'A customer asks "Is it real?" What is the best thing to do?',
          lo: 'ເມື່ອລູກຄ້າຖາມວ່າ «ແມ່ນຂອງແທ້ບໍ?» ຄວນເຮັດແນວໃດດີທີ່ສຸດ?',
        },
        options: [
          {
            ko: '«100% 진짜예요, 보장해요»라고 말한다',
            en: 'Say "100% real, guaranteed"',
            lo: 'ເວົ້າວ່າ «ແທ້ 100% ຮັບປະກັນ»',
          },
          {
            ko: '앱의 실물 뒷면 라벨 사진을 같이 보며 비교한다',
            en: 'Compare it together with the real back-label photo in the app',
            lo: 'ເບິ່ງຮູບສະຫຼາກດ້ານຫຼັງແທ້ໃນແອັບນຳກັນ ແລ້ວປຽບທຽບ',
          },
          {
            ko: '다른 가게 제품은 가짜라고 말한다',
            en: 'Say other shops sell fakes',
            lo: 'ເວົ້າວ່າຮ້ານອື່ນຂາຍຂອງປອມ',
          },
        ],
        answer: 1,
        why: {
          ko: '보여 주면 손님이 스스로 확인합니다. «보장»이나 «다른 가게는 가짜»는 문제가 될 수 있어요.',
          en: 'Showing lets the customer check for herself. "Guaranteed" or "others are fake" can get you into trouble.',
          lo: 'ການສະແດງໃຫ້ເບິ່ງ ເຮັດໃຫ້ລູກຄ້າກວດເອງໄດ້. «ຮັບປະກັນ» ຫຼື «ຮ້ານອື່ນປອມ» ອາດເປັນບັນຫາໄດ້.',
        },
      },
      {
        q: {
          ko: '한국 화장품 뒷면에서 보통 찾을 수 있는 것은?',
          en: 'What can you usually find on the back of a Korean cosmetic?',
          lo: 'ດ້ານຫຼັງເຄື່ອງສຳອາງເກົາຫຼີ ໂດຍທົ່ວໄປຈະມີຫຍັງ?',
        },
        options: [
          {
            ko: '제조번호와 사용기한',
            en: 'A batch number and an expiry date',
            lo: 'ເລກລັອດ ແລະ ວັນໝົດອາຍຸ',
          },
          { ko: '판매 가격', en: 'The selling price', lo: 'ລາຄາຂາຍ' },
          { ko: '피부과 의사의 이름', en: "A dermatologist's name", lo: 'ຊື່ທ່ານໝໍຜິວໜັງ' },
        ],
        answer: 0,
        why: {
          ko: '제조번호와 사용기한은 보통 뒷면이나 바닥에 찍혀 있어요. 손님과 같이 찾아보세요.',
          en: 'The batch number and expiry are usually printed on the back or the bottom. Look for them together.',
          lo: 'ເລກລັອດ ແລະ ວັນໝົດອາຍຸ ມັກຈະພິມຢູ່ດ້ານຫຼັງ ຫຼື ກົ້ນກ່ອງ. ຊອກຫານຳກັນກັບລູກຄ້າ.',
        },
      },
    ],
  },
  {
    id: 'ACADEMY-2',
    icon: '🏷️',
    cover: '/scenes/scene-04.jpg',
    coverFocus: '50% 35%',
    title: { ko: '라벨 읽기', en: 'Reading a label', lo: 'ການອ່ານສະຫຼາກ' },
    intro: {
      ko: '라벨을 읽을 줄 알면 손님에게 자신 있게 설명할 수 있어요.',
      en: 'When you can read a label, you can explain a product with confidence.',
      lo: 'ເມື່ອອ່ານສະຫຼາກເປັນ ກໍອະທິບາຍໃຫ້ລູກຄ້າໄດ້ຢ່າງໝັ້ນໃຈ.',
    },
    points: [
      {
        ko: '전성분은 보통 많이 들어간 것부터 적어요. 앞쪽 몇 개가 그 제품의 바탕이에요.',
        en: 'Full ingredient lists usually start with what there is most of. The first few names are the base of the product.',
        lo: 'ລາຍການສ່ວນປະສົມ ໂດຍທົ່ວໄປຈະຂຽນສິ່ງທີ່ມີຫຼາຍທີ່ສຸດກ່ອນ. ສອງສາມຊື່ທຳອິດແມ່ນພື້ນຖານຂອງສິນຄ້າ.',
      },
      {
        ko: '앱의 «성분 사전»을 누르면 성분을 라오어로 볼 수 있어요. 다 외우지 않아도 돼요.',
        en: "Tap the app's ingredient dictionary to read an ingredient in Lao. You do not have to memorise them.",
        lo: 'ກົດ «ວັດຈະນານຸກົມສ່ວນປະສົມ» ໃນແອັບ ເພື່ອອ່ານເປັນພາສາລາວ. ບໍ່ຕ້ອງຈື່ທັງໝົດ.',
      },
      {
        ko: '손님이 피하고 싶은 성분이 있으면 앱의 «피하고 싶은 성분»에 넣고 같이 확인하세요.',
        en: 'If a customer wants to avoid an ingredient, add it to "ingredients to avoid" in the app and check together.',
        lo: 'ຖ້າລູກຄ້າຢາກຫຼີກລ່ຽງສ່ວນປະສົມໃດ ໃຫ້ໃສ່ໃນ «ສ່ວນປະສົມທີ່ຢາກຫຼີກລ່ຽງ» ໃນແອັບ ແລ້ວກວດນຳກັນ.',
      },
    ],
    quiz: [
      {
        q: {
          ko: '전성분 목록 맨 앞쪽에 있는 성분은 보통 어떤 것일까요?',
          en: 'What is usually first on a full ingredient list?',
          lo: 'ສ່ວນປະສົມທີ່ຢູ່ທຳອິດຂອງລາຍການ ໂດຍທົ່ວໄປແມ່ນຫຍັງ?',
        },
        options: [
          { ko: '가장 많이 들어간 것', en: 'What there is most of', lo: 'ສິ່ງທີ່ມີຫຼາຍທີ່ສຸດ' },
          { ko: '가장 비싼 것', en: 'The most expensive one', lo: 'ສິ່ງທີ່ແພງທີ່ສຸດ' },
          { ko: '효과가 가장 좋은 것', en: 'The one that works best', lo: 'ສິ່ງທີ່ໄດ້ຜົນດີທີ່ສຸດ' },
        ],
        answer: 0,
        why: {
          ko: '순서는 양을 말해 줄 뿐, 비싼지나 효과가 좋은지를 말해 주지 않아요.',
          en: 'The order tells you about amount, not price or how well something works.',
          lo: 'ລຳດັບບອກພຽງປະລິມານ ບໍ່ໄດ້ບອກລາຄາ ຫຼື ຜົນ.',
        },
      },
      {
        q: {
          ko: '모르는 성분 이름을 손님이 물으면?',
          en: 'A customer asks about an ingredient you do not know. What do you do?',
          lo: 'ລູກຄ້າຖາມຊື່ສ່ວນປະສົມທີ່ເຮົາບໍ່ຮູ້ ຄວນເຮັດແນວໃດ?',
        },
        options: [
          {
            ko: '아는 척 설명한다',
            en: 'Pretend to know and explain',
            lo: 'ທຳທ່າວ່າຮູ້ແລ້ວອະທິບາຍ',
          },
          {
            ko: '앱 성분 사전에서 같이 찾아본다',
            en: "Look it up together in the app's dictionary",
            lo: 'ຊອກນຳກັນໃນວັດຈະນານຸກົມຂອງແອັບ',
          },
          {
            ko: '인터넷에서 찾아보라고 한다',
            en: 'Tell her to search the internet',
            lo: 'ບອກໃຫ້ລູກຄ້າໄປຊອກໃນອິນເຕີເນັດ',
          },
        ],
        answer: 1,
        why: {
          ko: '같이 찾아보는 모습이 신뢰를 만들어요. 사전에 없으면 «확인해서 알려 드릴게요»라고 하세요.',
          en: 'Looking it up together builds trust. If it is not there, say "I\'ll check and let you know."',
          lo: 'ການຊອກນຳກັນ ສ້າງຄວາມເຊື່ອໃຈ. ຖ້າບໍ່ມີ ໃຫ້ເວົ້າວ່າ «ຂໍກວດເບິ່ງກ່ອນ ແລ້ວຈະບອກ».',
        },
      },
    ],
  },
  {
    id: 'ACADEMY-3',
    icon: '💬',
    cover: '/scenes/scene-08.jpg',
    coverFocus: '50% 64%',
    title: {
      ko: '말해도 되는 말',
      en: 'What you can and cannot say',
      lo: 'ຄຳທີ່ເວົ້າໄດ້ ແລະ ເວົ້າບໍ່ໄດ້',
    },
    intro: {
      ko: '화장품은 약이 아니에요. 말 한마디가 가게의 신뢰를 지켜요.',
      en: "Cosmetics are not medicine. One sentence can protect your shop's good name.",
      lo: 'ເຄື່ອງສຳອາງບໍ່ແມ່ນຢາ. ຄຳເວົ້າດຽວ ປົກປ້ອງຄວາມເຊື່ອໃຈຂອງຮ້ານໄດ້.',
    },
    points: [
      {
        ko: '«치료·완치·100% 보장·부작용 없음·기미 제거» 같은 말은 쓰지 마세요.',
        en: 'Do not use words like "treats", "cures", "100% guaranteed", "no side effects" or "removes melasma".',
        lo: 'ຢ່າໃຊ້ຄຳເຊັ່ນ «ປິ່ນປົວ, ຫາຍຂາດ, ຮັບປະກັນ 100%, ບໍ່ມີຜົນຂ້າງຄຽງ, ລຶບຝ້າ».',
      },
      {
        ko: '대신 사용감과 경험을 말하세요. «촉촉한 느낌이에요», «제 손님들이 산뜻하다고 하셨어요».',
        en: 'Talk about how it feels and what customers said instead: "It feels moist", "My customers say it feels fresh".',
        lo: 'ເວົ້າເຖິງຄວາມຮູ້ສຶກ ແລະ ປະສົບການແທນ: «ຮູ້ສຶກຊຸ່ມ», «ລູກຄ້າຂອງຂ້ອຍບອກວ່າສົດຊື່ນ».',
      },
      {
        ko: '글을 올리기 전에 앱의 «글 점검»에 붙여 넣어 보세요. 위험한 단어를 짚어 줘요.',
        en: "Before posting, paste your text into the app's post checker. It points at risky words.",
        lo: 'ກ່ອນໂພສ ໃຫ້ວາງຂໍ້ຄວາມໃສ່ «ກວດຂໍ້ຄວາມ» ໃນແອັບ. ມັນຈະຊີ້ຄຳທີ່ມີຄວາມສ່ຽງ.',
      },
    ],
    quiz: [
      {
        q: {
          ko: '다음 중 써도 괜찮은 말은?',
          en: 'Which of these is fine to say?',
          lo: 'ຄຳໃດຕໍ່ໄປນີ້ ເວົ້າໄດ້?',
        },
        options: [
          { ko: '여드름을 치료해요', en: 'It treats acne', lo: 'ມັນປິ່ນປົວສິວ' },
          {
            ko: '바르면 촉촉한 느낌이에요',
            en: 'It feels moist when you put it on',
            lo: 'ທາແລ້ວຮູ້ສຶກຊຸ່ມ',
          },
          { ko: '100% 하얘져요', en: 'You will be 100% whiter', lo: 'ຂາວ 100%' },
        ],
        answer: 1,
        why: {
          ko: '느낌을 말하는 것은 괜찮아요. 치료나 결과를 약속하는 말은 안 돼요.',
          en: 'Describing how it feels is fine. Promising a treatment or a result is not.',
          lo: 'ເວົ້າເຖິງຄວາມຮູ້ສຶກໄດ້. ແຕ່ສັນຍາການປິ່ນປົວ ຫຼື ຜົນ ບໍ່ໄດ້.',
        },
      },
      {
        q: {
          ko: '손님 피부가 많이 아프고 붉다고 하면?',
          en: 'A customer says her skin is very sore and red. What do you do?',
          lo: 'ລູກຄ້າບອກວ່າຜິວເຈັບ ແລະ ແດງຫຼາຍ ຄວນເຮັດແນວໃດ?',
        },
        options: [
          {
            ko: '이 크림을 바르면 나아요',
            en: 'Say this cream will fix it',
            lo: 'ບອກວ່າທາຄີມນີ້ແລ້ວຈະດີ',
          },
          {
            ko: '의사나 약사와 상담하시라고 권한다',
            en: 'Suggest she sees a doctor or pharmacist',
            lo: 'ແນະນຳໃຫ້ປຶກສາທ່ານໝໍ ຫຼື ເພສັດ',
          },
          { ko: '더 많이 바르라고 한다', en: 'Tell her to apply more', lo: 'ບອກໃຫ້ທາຫຼາຍຂຶ້ນ' },
        ],
        answer: 1,
        why: {
          ko: '아픈 피부는 화장품이 아니라 전문가가 볼 일이에요. 그렇게 말해 주는 것이 손님을 지키는 길이에요.',
          en: 'Sore skin is for a professional, not for a cosmetic. Saying so protects your customer.',
          lo: 'ຜິວທີ່ເຈັບ ຄວນໃຫ້ຜູ້ຊ່ຽວຊານເບິ່ງ ບໍ່ແມ່ນເຄື່ອງສຳອາງ. ການບອກແບບນີ້ແມ່ນການປົກປ້ອງລູກຄ້າ.',
        },
      },
    ],
    linksToChecker: true,
  },
  {
    id: 'ACADEMY-4',
    icon: '🛍️',
    cover: '/scenes/scene-07.jpg',
    coverFocus: '50% 40%',
    title: {
      ko: '손님 응대와 공동구매 주문',
      en: 'Serving customers and taking group-buy orders',
      lo: 'ການຕ້ອນຮັບລູກຄ້າ ແລະ ຮັບອໍເດີຊື້ເປັນກຸ່ມ',
    },
    intro: {
      ko: '재고 없이 파는 비결은 주문을 정확하게 받는 거예요.',
      en: 'Selling without stock works when you take orders carefully.',
      lo: 'ການຂາຍໂດຍບໍ່ມີສະຕັອກ ສຳເລັດໄດ້ດ້ວຍການຮັບອໍເດີໃຫ້ຖືກຕ້ອງ.',
    },
    points: [
      {
        ko: '손님이 고른 제품은 제품 코드(KG-…)와 함께 적어 두세요. 손님의 «문의 목록» 메시지에도 코드가 있어요.',
        en: "Write down each product with its code (KG-…). The customer's questions-list message already includes the codes.",
        lo: 'ຂຽນສິນຄ້າທີ່ລູກຄ້າເລືອກ ພ້ອມລະຫັດ (KG-…). ຂໍ້ຄວາມ «ລາຍການທີ່ຢາກຖາມ» ຂອງລູກຄ້າກໍມີລະຫັດແລ້ວ.',
      },
      {
        ko: '도착 날짜는 KOREA GLOW가 알려 준 일정만 말하세요. 모르면 «확인해서 알려 드릴게요».',
        en: 'Only give arrival dates KOREA GLOW has told you. If you do not know, say "I\'ll check and let you know."',
        lo: 'ບອກວັນມາຮອດ ສະເພາະຕາມທີ່ KOREA GLOW ແຈ້ງເທົ່ານັ້ນ. ຖ້າບໍ່ຮູ້ ໃຫ້ເວົ້າວ່າ «ຂໍກວດເບິ່ງກ່ອນ ແລ້ວຈະບອກ».',
      },
      {
        ko: '처음 쓰는 손님에게는 귀 뒤나 팔 안쪽에 조금 발라 보기를 권하세요.',
        en: 'Suggest first-time users try a little behind the ear or on the inner arm first.',
        lo: 'ແນະນຳລູກຄ້າທີ່ໃຊ້ຄັ້ງທຳອິດ ໃຫ້ລອງທາໜ້ອຍໜຶ່ງຫຼັງຫູ ຫຼື ແຂນດ້ານໃນກ່ອນ.',
      },
    ],
    quiz: [
      {
        q: {
          ko: '손님이 «언제 와요?»라고 물으면?',
          en: 'A customer asks "When will it arrive?"',
          lo: 'ລູກຄ້າຖາມວ່າ «ຈະມາຮອດເມື່ອໃດ?»',
        },
        options: [
          { ko: '«아마 내일이요»', en: '"Probably tomorrow"', lo: '«ອາດຈະມື້ອື່ນ»' },
          {
            ko: '«확인해서 알려 드릴게요»',
            en: '"I\'ll check and let you know"',
            lo: '«ຂໍກວດເບິ່ງກ່ອນ ແລ້ວຈະບອກ»',
          },
          {
            ko: '«모르니까 그냥 기다리세요»',
            en: '"No idea, just wait"',
            lo: '«ບໍ່ຮູ້ ລໍຖ້າໄປກ່ອນ»',
          },
        ],
        answer: 1,
        why: {
          ko: '모르는 날짜를 약속하면 신뢰를 잃어요. 확인하고 정확히 알려 주세요.',
          en: 'Promising a date you do not know loses trust. Check, then answer exactly.',
          lo: 'ການສັນຍາວັນທີ່ບໍ່ຮູ້ ເຮັດໃຫ້ເສຍຄວາມເຊື່ອໃຈ. ກວດກ່ອນ ແລ້ວບອກໃຫ້ຖືກຕ້ອງ.',
        },
      },
      {
        q: {
          ko: '주문을 헷갈리지 않으려면?',
          en: 'How do you avoid mixing up orders?',
          lo: 'ເຮັດແນວໃດຈຶ່ງບໍ່ສັບສົນອໍເດີ?',
        },
        options: [
          {
            ko: '제품 이름만 기억한다',
            en: 'Remember only the product name',
            lo: 'ຈື່ແຕ່ຊື່ສິນຄ້າ',
          },
          {
            ko: '제품 코드와 함께 적어 둔다',
            en: 'Write it down with the product code',
            lo: 'ຂຽນໄວ້ພ້ອມລະຫັດສິນຄ້າ',
          },
          { ko: '사진만 찍어 둔다', en: 'Just take a photo', lo: 'ຖ່າຍຮູບໄວ້ເທົ່ານັ້ນ' },
        ],
        answer: 1,
        why: {
          ko: '비슷한 이름의 제품이 많아요. 코드는 하나뿐이라 실수가 없어요.',
          en: 'Many products have similar names. A code is unique, so there is no mix-up.',
          lo: 'ສິນຄ້າຫຼາຍຢ່າງມີຊື່ຄ້າຍກັນ. ລະຫັດມີອັນດຽວ ຈຶ່ງບໍ່ຜິດ.',
        },
      },
    ],
  },
  {
    id: 'ACADEMY-5',
    icon: '🔒',
    cover: '/scenes/scene-02.jpg',
    coverFocus: '50% 35%',
    title: {
      ko: '손님 개인정보 지키기',
      en: "Keeping customers' information private",
      lo: 'ການຮັກສາຂໍ້ມູນສ່ວນຕົວຂອງລູກຄ້າ',
    },
    intro: {
      ko: '손님의 정보는 손님의 것이에요.',
      en: "A customer's information belongs to the customer.",
      lo: 'ຂໍ້ມູນຂອງລູກຄ້າ ແມ່ນຂອງລູກຄ້າ.',
    },
    points: [
      {
        ko: '손님 얼굴 사진이나 이름은 허락 없이 SNS에 올리지 마세요.',
        en: "Never post a customer's photo or name on social media without her permission.",
        lo: 'ຢ່າໂພສຮູບ ຫຼື ຊື່ລູກຄ້າໃນສື່ສັງຄົມ ໂດຍບໍ່ໄດ້ຮັບອະນຸຍາດ.',
      },
      {
        ko: '손님 연락처 목록을 다른 사람에게 넘기지 마세요.',
        en: "Never pass your customers' contact list to anyone else.",
        lo: 'ຢ່າສົ່ງລາຍຊື່ເບີຕິດຕໍ່ລູກຄ້າໃຫ້ຄົນອື່ນ.',
      },
      {
        ko: '이 앱은 손님의 퀴즈 답과 목록을 어디에도 보내지 않아요. 손님에게 안심하라고 말해도 돼요.',
        en: "This app does not send customers' quiz answers or lists anywhere. You can tell them so.",
        lo: 'ແອັບນີ້ບໍ່ໄດ້ສົ່ງຄຳຕອບ ຫຼື ລາຍການຂອງລູກຄ້າໄປໃສ. ບອກລູກຄ້າໃຫ້ໝັ້ນໃຈໄດ້.',
      },
    ],
    quiz: [
      {
        q: {
          ko: '손님 사용 후기 사진을 올리고 싶다면?',
          en: "You want to post a customer's photo review. What first?",
          lo: 'ຢາກໂພສຮູບລີວິວຂອງລູກຄ້າ ຕ້ອງເຮັດຫຍັງກ່ອນ?',
        },
        options: [
          { ko: '먼저 허락을 받는다', en: 'Ask her permission first', lo: 'ຂໍອະນຸຍາດກ່ອນ' },
          { ko: '얼굴만 가리면 된다', en: 'Just cover her face', lo: 'ພຽງແຕ່ປິດໜ້າ' },
          { ko: '그냥 올린다', en: 'Just post it', lo: 'ໂພສເລີຍ' },
        ],
        answer: 0,
        why: {
          ko: '사진과 이야기는 손님의 것이에요. 허락이 먼저예요.',
          en: 'The photo and the story are hers. Permission comes first.',
          lo: 'ຮູບ ແລະ ເລື່ອງແມ່ນຂອງລູກຄ້າ. ຕ້ອງຂໍອະນຸຍາດກ່ອນ.',
        },
      },
      {
        q: {
          ko: '다른 가게가 손님 연락처를 달라고 하면?',
          en: "Another shop asks for your customers' contacts.",
          lo: 'ຮ້ານອື່ນຂໍເບີຕິດຕໍ່ລູກຄ້າຂອງເຮົາ.',
        },
        options: [
          { ko: '준다', en: 'Give them', lo: 'ໃຫ້' },
          { ko: '주지 않는다', en: 'Do not give them', lo: 'ບໍ່ໃຫ້' },
          { ko: '일부만 준다', en: 'Give some of them', lo: 'ໃຫ້ບາງສ່ວນ' },
        ],
        answer: 1,
        why: {
          ko: '손님은 우리를 믿고 연락처를 줬어요. 누구에게도 넘기지 않아요.',
          en: 'Customers gave you their number because they trust you. It goes to no one else.',
          lo: 'ລູກຄ້າໃຫ້ເບີເພາະເຊື່ອໃຈເຮົາ. ບໍ່ສົ່ງໃຫ້ໃຜ.',
        },
      },
    ],
  },
];

const PROGRESS_KEY = 'korea-glow:academy:v1';

/** Units whose quiz the reader has answered correctly, kept on this device only. */
export function loadAcademyProgress(
  storage: Pick<Storage, 'getItem'> | undefined,
): readonly string[] {
  try {
    const parsed: unknown = JSON.parse(storage?.getItem(PROGRESS_KEY) ?? '[]');
    const ids = new Set(ACADEMY.map((unit) => unit.id));
    return Array.isArray(parsed)
      ? [...new Set(parsed.filter((id): id is string => typeof id === 'string' && ids.has(id)))]
      : [];
  } catch {
    return [];
  }
}

export function saveAcademyProgress(
  storage: Pick<Storage, 'setItem'> | undefined,
  done: readonly string[],
): void {
  try {
    storage?.setItem(PROGRESS_KEY, JSON.stringify(done));
  } catch {
    // Private windows and full storage: progress lasts for this visit only.
  }
}
