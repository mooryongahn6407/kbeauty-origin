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
    title: { ko: '정품 확인하는 법', en: 'Checking a product is genuine', lo: 'ວິທີກວດສິນຄ້າແທ້', th: 'ตรวจสอบว่าเป็นของแท้', fr: 'Vérifier qu\'un produit est authentique' },
    intro: {
      ko: '손님이 가장 먼저 묻는 말은 «진짜예요?»입니다. 말보다 보여 주는 것이 믿음을 줍니다.',
      en: 'The first thing customers ask is "Is it real?" Showing beats telling.',
      lo: 'ສິ່ງທຳອິດທີ່ລູກຄ້າຖາມແມ່ນ «ແມ່ນຂອງແທ້ບໍ?» ການສະແດງໃຫ້ເຫັນ ໜ້າເຊື່ອຖືກວ່າການເວົ້າ.',
      th: 'สิ่งแรกที่ลูกค้าถามคือ “ของแท้หรือเปล่า?” การให้ดูได้ผลกว่าการบอก',
      fr: 'La première question des clients est « C\'est authentique? ». Montrer vaut mieux que dire.',
    },
    points: [
      {
        ko: '한국 화장품 뒷면에는 보통 한국어 전성분, 만든 회사, 제조번호, 사용기한이 인쇄되어 있어요.',
        en: 'The back of a Korean cosmetic usually prints the full ingredient list in Korean, the maker, a batch number and an expiry date.',
        lo: 'ດ້ານຫຼັງຂອງເຄື່ອງສຳອາງເກົາຫຼີ ໂດຍທົ່ວໄປຈະພິມສ່ວນປະສົມເປັນພາສາເກົາຫຼີ, ບໍລິສັດຜູ້ຜະລິດ, ເລກລັອດ ແລະ ວັນໝົດອາຍຸ.',
        th: 'ด้านหลังของเครื่องสำอางเกาหลีมักพิมพ์รายการส่วนผสมทั้งหมดเป็นภาษาเกาหลี ชื่อผู้ผลิต หมายเลขล็อต และวันหมดอายุ',
        fr: 'Le dos d\'un cosmétique coréen indique généralement la liste complète des ingrédients en coréen, le fabricant, un numéro de lot et une date de péremption.',
      },
      {
        ko: '앱 제품 페이지의 «실물 뒷면 라벨 사진»과 손님 손에 있는 제품을 나란히 비교해 보세요.',
        en: 'Compare the product in the customer\'s hand with the "real back label" photo on the app\'s product page.',
        lo: 'ປຽບທຽບສິນຄ້າໃນມືລູກຄ້າ ກັບ «ຮູບສະຫຼາກດ້ານຫຼັງແທ້» ໃນໜ້າສິນຄ້າຂອງແອັບ.',
        th: 'เปรียบเทียบสินค้าในมือลูกค้ากับรูป “ฉลากด้านหลังของจริง” ในหน้าสินค้าของแอป',
        fr: 'Comparez le produit que la cliente a en main avec la photo de « la vraie étiquette arrière » sur la fiche produit de l\'application.',
      },
      {
        ko: '지나치게 싼 가격, 찌그러진 포장, 흐린 인쇄는 조심하세요. KOREA GLOW 제품은 KOREA GLOW를 통해서만 받으세요.',
        en: 'Be careful with prices that are too low, damaged packaging or blurry printing. Get KOREA GLOW products only through KOREA GLOW.',
        lo: 'ລະວັງລາຄາທີ່ຖືກເກີນໄປ, ກ່ອງທີ່ເສຍຫາຍ ຫຼື ການພິມທີ່ບໍ່ຊັດ. ຮັບສິນຄ້າ KOREA GLOW ຜ່ານ KOREA GLOW ເທົ່ານັ້ນ.',
        th: 'ระวังราคาที่ต่ำเกินไป บรรจุภัณฑ์ที่เสียหาย หรือการพิมพ์ที่ไม่คมชัด รับสินค้า KOREA GLOW ผ่าน KOREA GLOW เท่านั้น',
        fr: 'Méfiez-vous des prix trop bas, des emballages abîmés ou des impressions floues. Procurez-vous les produits KOREA GLOW uniquement auprès de KOREA GLOW.',
      },
    ],
    quiz: [
      {
        q: {
          ko: '손님이 «진짜예요?»라고 물을 때 가장 좋은 행동은?',
          en: 'A customer asks "Is it real?" What is the best thing to do?',
          lo: 'ເມື່ອລູກຄ້າຖາມວ່າ «ແມ່ນຂອງແທ້ບໍ?» ຄວນເຮັດແນວໃດດີທີ່ສຸດ?',
          th: 'ลูกค้าถามว่า “ของแท้หรือเปล่า?” ควรทำอย่างไรดีที่สุด?',
          fr: 'Une cliente demande « C\'est authentique? ». Quelle est la meilleure chose à faire?',
        },
        options: [
          {
            ko: '«100% 진짜예요, 보장해요»라고 말한다',
            en: 'Say "100% real, guaranteed"',
            lo: 'ເວົ້າວ່າ «ແທ້ 100% ຮັບປະກັນ»',
            th: 'พูดว่า “แท้ 100% รับประกัน”',
            fr: 'Dire « 100% authentique, garanti »',
          },
          {
            ko: '앱의 실물 뒷면 라벨 사진을 같이 보며 비교한다',
            en: 'Compare it together with the real back-label photo in the app',
            lo: 'ເບິ່ງຮູບສະຫຼາກດ້ານຫຼັງແທ້ໃນແອັບນຳກັນ ແລ້ວປຽບທຽບ',
            th: 'เปรียบเทียบกับรูปฉลากด้านหลังของจริงในแอปด้วยกัน',
            fr: 'Comparer ensemble avec la photo de la vraie étiquette arrière dans l\'application',
          },
          {
            ko: '다른 가게 제품은 가짜라고 말한다',
            en: 'Say other shops sell fakes',
            lo: 'ເວົ້າວ່າຮ້ານອື່ນຂາຍຂອງປອມ',
            th: 'บอกว่าร้านอื่นขายของปลอม',
            fr: 'Dire que les autres boutiques vendent des contrefaçons',
          },
        ],
        answer: 1,
        why: {
          ko: '보여 주면 손님이 스스로 확인합니다. «보장»이나 «다른 가게는 가짜»는 문제가 될 수 있어요.',
          en: 'Showing lets the customer check for herself. "Guaranteed" or "others are fake" can get you into trouble.',
          lo: 'ການສະແດງໃຫ້ເບິ່ງ ເຮັດໃຫ້ລູກຄ້າກວດເອງໄດ້. «ຮັບປະກັນ» ຫຼື «ຮ້ານອື່ນປອມ» ອາດເປັນບັນຫາໄດ້.',
          th: 'การให้ดูช่วยให้ลูกค้าตรวจสอบได้ด้วยตัวเอง คำว่า “รับประกัน” หรือ “ร้านอื่นเป็นของปลอม” อาจทำให้คุณเดือดร้อนได้',
          fr: 'Montrer permet à la cliente de vérifier elle-même. « Garanti » ou « les autres sont des contrefaçons » peuvent vous attirer des ennuis.',
        },
      },
      {
        q: {
          ko: '한국 화장품 뒷면에서 보통 찾을 수 있는 것은?',
          en: 'What can you usually find on the back of a Korean cosmetic?',
          lo: 'ດ້ານຫຼັງເຄື່ອງສຳອາງເກົາຫຼີ ໂດຍທົ່ວໄປຈະມີຫຍັງ?',
          th: 'โดยทั่วไปด้านหลังของเครื่องสำอางเกาหลีมีอะไรบ้าง?',
          fr: 'Que trouve-t-on généralement au dos d\'un cosmétique coréen?',
        },
        options: [
          {
            ko: '제조번호와 사용기한',
            en: 'A batch number and an expiry date',
            lo: 'ເລກລັອດ ແລະ ວັນໝົດອາຍຸ',
            th: 'หมายเลขล็อตและวันหมดอายุ',
            fr: 'Un numéro de lot et une date de péremption',
          },
          { ko: '판매 가격', en: 'The selling price', lo: 'ລາຄາຂາຍ', th: 'ราคาขาย', fr: 'Le prix de vente' },
          { ko: '피부과 의사의 이름', en: "A dermatologist's name", lo: 'ຊື່ທ່ານໝໍຜິວໜັງ', th: 'ชื่อแพทย์ผิวหนัง', fr: 'Le nom d\'un dermatologue' },
        ],
        answer: 0,
        why: {
          ko: '제조번호와 사용기한은 보통 뒷면이나 바닥에 찍혀 있어요. 손님과 같이 찾아보세요.',
          en: 'The batch number and expiry are usually printed on the back or the bottom. Look for them together.',
          lo: 'ເລກລັອດ ແລະ ວັນໝົດອາຍຸ ມັກຈະພິມຢູ່ດ້ານຫຼັງ ຫຼື ກົ້ນກ່ອງ. ຊອກຫານຳກັນກັບລູກຄ້າ.',
          th: 'หมายเลขล็อตและวันหมดอายุมักพิมพ์อยู่ด้านหลังหรือด้านล่าง ให้มองหาทั้งสองอย่างพร้อมกัน',
          fr: 'Le numéro de lot et la date de péremption sont généralement imprimés au dos ou en dessous. Cherchez-les ensemble.',
        },
      },
    ],
  },
  {
    id: 'ACADEMY-2',
    icon: '🏷️',
    cover: '/scenes/scene-04.jpg',
    coverFocus: '50% 35%',
    title: { ko: '라벨 읽기', en: 'Reading a label', lo: 'ການອ່ານສະຫຼາກ', th: 'การอ่านฉลาก', fr: 'Lire une étiquette' },
    intro: {
      ko: '라벨을 읽을 줄 알면 손님에게 자신 있게 설명할 수 있어요.',
      en: 'When you can read a label, you can explain a product with confidence.',
      lo: 'ເມື່ອອ່ານສະຫຼາກເປັນ ກໍອະທິບາຍໃຫ້ລູກຄ້າໄດ້ຢ່າງໝັ້ນໃຈ.',
      th: 'เมื่ออ่านฉลากเป็น คุณจะอธิบายสินค้าได้อย่างมั่นใจ',
      fr: 'Quand vous savez lire une étiquette, vous pouvez présenter un produit avec assurance.',
    },
    points: [
      {
        ko: '전성분은 보통 많이 들어간 것부터 적어요. 앞쪽 몇 개가 그 제품의 바탕이에요.',
        en: 'Full ingredient lists usually start with what there is most of. The first few names are the base of the product.',
        lo: 'ລາຍການສ່ວນປະສົມ ໂດຍທົ່ວໄປຈະຂຽນສິ່ງທີ່ມີຫຼາຍທີ່ສຸດກ່ອນ. ສອງສາມຊື່ທຳອິດແມ່ນພື້ນຖານຂອງສິນຄ້າ.',
        th: 'รายการส่วนผสมทั้งหมดมักเริ่มจากสิ่งที่มีมากที่สุด ชื่อแรก ๆ ไม่กี่ชื่อคือพื้นฐานของสินค้า',
        fr: 'La liste complète des ingrédients commence généralement par ce qu\'il y a en plus grande quantité. Les premiers noms forment la base du produit.',
      },
      {
        ko: '앱의 «성분 사전»을 누르면 성분을 라오어로 볼 수 있어요. 다 외우지 않아도 돼요.',
        en: "Tap the app's ingredient dictionary to read an ingredient in Lao. You do not have to memorise them.",
        lo: 'ກົດ «ວັດຈະນານຸກົມສ່ວນປະສົມ» ໃນແອັບ ເພື່ອອ່ານເປັນພາສາລາວ. ບໍ່ຕ້ອງຈື່ທັງໝົດ.',
        th: 'แตะพจนานุกรมส่วนผสมในแอปเพื่ออ่านส่วนผสมเป็นภาษาลาว ไม่จำเป็นต้องท่องจำ',
        fr: 'Touchez le dictionnaire des ingrédients de l\'application pour lire un ingrédient en lao. Inutile de les apprendre par cœur.',
      },
      {
        ko: '손님이 피하고 싶은 성분이 있으면 앱의 «피하고 싶은 성분»에 넣고 같이 확인하세요.',
        en: 'If a customer wants to avoid an ingredient, add it to "ingredients to avoid" in the app and check together.',
        lo: 'ຖ້າລູກຄ້າຢາກຫຼີກລ່ຽງສ່ວນປະສົມໃດ ໃຫ້ໃສ່ໃນ «ສ່ວນປະສົມທີ່ຢາກຫຼີກລ່ຽງ» ໃນແອັບ ແລ້ວກວດນຳກັນ.',
        th: 'ถ้าลูกค้าต้องการหลีกเลี่ยงส่วนผสมใด ให้เพิ่มลงใน “ส่วนผสมที่ต้องหลีกเลี่ยง” ในแอปแล้วตรวจสอบด้วยกัน',
        fr: 'Si une cliente veut éviter un ingrédient, ajoutez-le aux « ingrédients à éviter » dans l\'application et vérifiez ensemble.',
      },
    ],
    quiz: [
      {
        q: {
          ko: '전성분 목록 맨 앞쪽에 있는 성분은 보통 어떤 것일까요?',
          en: 'What is usually first on a full ingredient list?',
          lo: 'ສ່ວນປະສົມທີ່ຢູ່ທຳອິດຂອງລາຍການ ໂດຍທົ່ວໄປແມ່ນຫຍັງ?',
          th: 'โดยทั่วไปอะไรอยู่ลำดับแรกในรายการส่วนผสมทั้งหมด?',
          fr: 'Qu\'est-ce qui figure généralement en premier dans la liste complète des ingrédients?',
        },
        options: [
          { ko: '가장 많이 들어간 것', en: 'What there is most of', lo: 'ສິ່ງທີ່ມີຫຼາຍທີ່ສຸດ', th: 'สิ่งที่มีมากที่สุด', fr: 'Ce qu\'il y a le plus' },
          { ko: '가장 비싼 것', en: 'The most expensive one', lo: 'ສິ່ງທີ່ແພງທີ່ສຸດ', th: 'สิ่งที่แพงที่สุด', fr: 'Le plus cher' },
          { ko: '효과가 가장 좋은 것', en: 'The one that works best', lo: 'ສິ່ງທີ່ໄດ້ຜົນດີທີ່ສຸດ', th: 'สิ่งที่ได้ผลดีที่สุด', fr: 'Le plus efficace' },
        ],
        answer: 0,
        why: {
          ko: '순서는 양을 말해 줄 뿐, 비싼지나 효과가 좋은지를 말해 주지 않아요.',
          en: 'The order tells you about amount, not price or how well something works.',
          lo: 'ລຳດັບບອກພຽງປະລິມານ ບໍ່ໄດ້ບອກລາຄາ ຫຼື ຜົນ.',
          th: 'ลำดับบอกถึงปริมาณ ไม่ใช่ราคาหรือประสิทธิภาพ',
          fr: 'L\'ordre indique la quantité, pas le prix ni l\'efficacité.',
        },
      },
      {
        q: {
          ko: '모르는 성분 이름을 손님이 물으면?',
          en: 'A customer asks about an ingredient you do not know. What do you do?',
          lo: 'ລູກຄ້າຖາມຊື່ສ່ວນປະສົມທີ່ເຮົາບໍ່ຮູ້ ຄວນເຮັດແນວໃດ?',
          th: 'ลูกค้าถามถึงส่วนผสมที่คุณไม่รู้จัก คุณจะทำอย่างไร?',
          fr: 'Une cliente vous interroge sur un ingrédient que vous ne connaissez pas. Que faites-vous?',
        },
        options: [
          {
            ko: '아는 척 설명한다',
            en: 'Pretend to know and explain',
            lo: 'ທຳທ່າວ່າຮູ້ແລ້ວອະທິບາຍ',
            th: 'แกล้งทำเป็นรู้แล้วอธิบาย',
            fr: 'Faire semblant de savoir et expliquer',
          },
          {
            ko: '앱 성분 사전에서 같이 찾아본다',
            en: "Look it up together in the app's dictionary",
            lo: 'ຊອກນຳກັນໃນວັດຈະນານຸກົມຂອງແອັບ',
            th: 'ค้นหาด้วยกันในพจนานุกรมของแอป',
            fr: 'Chercher ensemble dans le dictionnaire de l\'application',
          },
          {
            ko: '인터넷에서 찾아보라고 한다',
            en: 'Tell her to search the internet',
            lo: 'ບອກໃຫ້ລູກຄ້າໄປຊອກໃນອິນເຕີເນັດ',
            th: 'บอกให้ลูกค้าไปค้นในอินเทอร์เน็ต',
            fr: 'Lui dire de chercher sur Internet',
          },
        ],
        answer: 1,
        why: {
          ko: '같이 찾아보는 모습이 신뢰를 만들어요. 사전에 없으면 «확인해서 알려 드릴게요»라고 하세요.',
          en: 'Looking it up together builds trust. If it is not there, say "I\'ll check and let you know."',
          lo: 'ການຊອກນຳກັນ ສ້າງຄວາມເຊື່ອໃຈ. ຖ້າບໍ່ມີ ໃຫ້ເວົ້າວ່າ «ຂໍກວດເບິ່ງກ່ອນ ແລ້ວຈະບອກ».',
          th: 'การค้นหาด้วยกันช่วยสร้างความไว้วางใจ ถ้าไม่มีในนั้น ให้บอกว่า “ขอตรวจสอบแล้วจะแจ้งให้ทราบ”',
          fr: 'Chercher ensemble crée la confiance. Si l\'ingrédient n\'y figure pas, dites « Je vérifie et je vous tiens au courant. »',
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
      th: 'สิ่งที่พูดได้และพูดไม่ได้',
      fr: 'Ce que vous pouvez dire ou non',
    },
    intro: {
      ko: '화장품은 약이 아니에요. 말 한마디가 가게의 신뢰를 지켜요.',
      en: "Cosmetics are not medicine. One sentence can protect your shop's good name.",
      lo: 'ເຄື່ອງສຳອາງບໍ່ແມ່ນຢາ. ຄຳເວົ້າດຽວ ປົກປ້ອງຄວາມເຊື່ອໃຈຂອງຮ້ານໄດ້.',
      th: 'เครื่องสำอางไม่ใช่ยา ประโยคเดียวช่วยปกป้องชื่อเสียงที่ดีของร้านคุณได้',
      fr: 'Les cosmétiques ne sont pas des médicaments. Une seule phrase peut protéger la bonne réputation de votre boutique.',
    },
    points: [
      {
        ko: '«치료·완치·100% 보장·부작용 없음·기미 제거» 같은 말은 쓰지 마세요.',
        en: 'Do not use words like "treats", "cures", "100% guaranteed", "no side effects" or "removes melasma".',
        lo: 'ຢ່າໃຊ້ຄຳເຊັ່ນ «ປິ່ນປົວ, ຫາຍຂາດ, ຮັບປະກັນ 100%, ບໍ່ມີຜົນຂ້າງຄຽງ, ລຶບຝ້າ».',
        th: 'อย่าใช้คำอย่าง “รักษา” “หายขาด” “รับประกัน 100%” “ไม่มีผลข้างเคียง” หรือ “ลบฝ้า”',
        fr: 'N\'utilisez pas de mots comme « traite », « guérit », « garanti à 100% », « sans effets secondaires » ou « élimine le mélasma ».',
      },
      {
        ko: '대신 사용감과 경험을 말하세요. «촉촉한 느낌이에요», «제 손님들이 산뜻하다고 하셨어요».',
        en: 'Talk about how it feels and what customers said instead: "It feels moist", "My customers say it feels fresh".',
        lo: 'ເວົ້າເຖິງຄວາມຮູ້ສຶກ ແລະ ປະສົບການແທນ: «ຮູ້ສຶກຊຸ່ມ», «ລູກຄ້າຂອງຂ້ອຍບອກວ່າສົດຊື່ນ».',
        th: 'ให้พูดถึงความรู้สึกเวลาใช้และสิ่งที่ลูกค้าบอกแทน เช่น “รู้สึกชุ่มชื้น” “ลูกค้าของฉันบอกว่ารู้สึกสดชื่น”',
        fr: 'Parlez plutôt de la sensation et de ce que disent les clients: « La sensation est hydratante », « Mes clientes disent que c\'est rafraîchissant ».',
      },
      {
        ko: '글을 올리기 전에 앱의 «글 점검»에 붙여 넣어 보세요. 위험한 단어를 짚어 줘요.',
        en: "Before posting, paste your text into the app's post checker. It points at risky words.",
        lo: 'ກ່ອນໂພສ ໃຫ້ວາງຂໍ້ຄວາມໃສ່ «ກວດຂໍ້ຄວາມ» ໃນແອັບ. ມັນຈະຊີ້ຄຳທີ່ມີຄວາມສ່ຽງ.',
        th: 'ก่อนโพสต์ ให้วางข้อความของคุณลงในตัวตรวจโพสต์ของแอป ระบบจะชี้คำที่มีความเสี่ยง',
        fr: 'Avant de publier, collez votre texte dans le vérificateur de publications de l\'application. Il signale les mots à risque.',
      },
    ],
    quiz: [
      {
        q: {
          ko: '다음 중 써도 괜찮은 말은?',
          en: 'Which of these is fine to say?',
          lo: 'ຄຳໃດຕໍ່ໄປນີ້ ເວົ້າໄດ້?',
          th: 'ข้อใดพูดได้?',
          fr: 'Laquelle de ces phrases peut-on dire?',
        },
        options: [
          { ko: '여드름을 치료해요', en: 'It treats acne', lo: 'ມັນປິ່ນປົວສິວ', th: 'รักษาสิวได้', fr: 'Ça traite l\'acné' },
          {
            ko: '바르면 촉촉한 느낌이에요',
            en: 'It feels moist when you put it on',
            lo: 'ທາແລ້ວຮູ້ສຶກຊຸ່ມ',
            th: 'รู้สึกชุ่มชื้นเมื่อทา',
            fr: 'La sensation est hydratante à l\'application',
          },
          { ko: '100% 하얘져요', en: 'You will be 100% whiter', lo: 'ຂາວ 100%', th: 'คุณจะขาวขึ้น 100%', fr: 'Vous serez 100% plus blanche' },
        ],
        answer: 1,
        why: {
          ko: '느낌을 말하는 것은 괜찮아요. 치료나 결과를 약속하는 말은 안 돼요.',
          en: 'Describing how it feels is fine. Promising a treatment or a result is not.',
          lo: 'ເວົ້າເຖິງຄວາມຮູ້ສຶກໄດ້. ແຕ່ສັນຍາການປິ່ນປົວ ຫຼື ຜົນ ບໍ່ໄດ້.',
          th: 'การบรรยายความรู้สึกเวลาใช้พูดได้ แต่การสัญญาว่ารักษาหรือรับรองผลลัพธ์พูดไม่ได้',
          fr: 'Décrire la sensation, c\'est permis. Promettre un traitement ou un résultat, non.',
        },
      },
      {
        q: {
          ko: '손님 피부가 많이 아프고 붉다고 하면?',
          en: 'A customer says her skin is very sore and red. What do you do?',
          lo: 'ລູກຄ້າບອກວ່າຜິວເຈັບ ແລະ ແດງຫຼາຍ ຄວນເຮັດແນວໃດ?',
          th: 'ลูกค้าบอกว่าผิวเจ็บและแดงมาก คุณจะทำอย่างไร?',
          fr: 'Une cliente dit que sa peau est très douloureuse et rouge. Que faites-vous?',
        },
        options: [
          {
            ko: '이 크림을 바르면 나아요',
            en: 'Say this cream will fix it',
            lo: 'ບອກວ່າທາຄີມນີ້ແລ້ວຈະດີ',
            th: 'บอกว่าครีมนี้จะทำให้หาย',
            fr: 'Dire que cette crème va arranger ça',
          },
          {
            ko: '의사나 약사와 상담하시라고 권한다',
            en: 'Suggest she sees a doctor or pharmacist',
            lo: 'ແນະນຳໃຫ້ປຶກສາທ່ານໝໍ ຫຼື ເພສັດ',
            th: 'แนะนำให้ไปพบแพทย์หรือเภสัชกร',
            fr: 'Lui conseiller de voir un médecin ou un pharmacien',
          },
          { ko: '더 많이 바르라고 한다', en: 'Tell her to apply more', lo: 'ບອກໃຫ້ທາຫຼາຍຂຶ້ນ', th: 'บอกให้ทาเพิ่ม', fr: 'Lui dire d\'en appliquer davantage' },
        ],
        answer: 1,
        why: {
          ko: '아픈 피부는 화장품이 아니라 전문가가 볼 일이에요. 그렇게 말해 주는 것이 손님을 지키는 길이에요.',
          en: 'Sore skin is for a professional, not for a cosmetic. Saying so protects your customer.',
          lo: 'ຜິວທີ່ເຈັບ ຄວນໃຫ້ຜູ້ຊ່ຽວຊານເບິ່ງ ບໍ່ແມ່ນເຄື່ອງສຳອາງ. ການບອກແບບນີ້ແມ່ນການປົກປ້ອງລູກຄ້າ.',
          th: 'ผิวที่เจ็บเป็นเรื่องของผู้เชี่ยวชาญ ไม่ใช่เครื่องสำอาง การบอกเช่นนี้ช่วยปกป้องลูกค้าของคุณ',
          fr: 'Une peau douloureuse relève d\'un professionnel, pas d\'un cosmétique. Le dire protège votre cliente.',
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
      th: 'การดูแลลูกค้าและการรับออร์เดอร์ซื้อแบบกลุ่ม',
      fr: 'Servir les clients et prendre les commandes groupées',
    },
    intro: {
      ko: '재고 없이 파는 비결은 주문을 정확하게 받는 거예요.',
      en: 'Selling without stock works when you take orders carefully.',
      lo: 'ການຂາຍໂດຍບໍ່ມີສະຕັອກ ສຳເລັດໄດ້ດ້ວຍການຮັບອໍເດີໃຫ້ຖືກຕ້ອງ.',
      th: 'การขายโดยไม่มีสต็อกทำได้ดีเมื่อคุณรับออร์เดอร์อย่างรอบคอบ',
      fr: 'Vendre sans stock fonctionne si vous prenez les commandes avec soin.',
    },
    points: [
      {
        ko: '손님이 고른 제품은 제품 코드(KG-…)와 함께 적어 두세요. 손님의 «문의 목록» 메시지에도 코드가 있어요.',
        en: "Write down each product with its code (KG-…). The customer's questions-list message already includes the codes.",
        lo: 'ຂຽນສິນຄ້າທີ່ລູກຄ້າເລືອກ ພ້ອມລະຫັດ (KG-…). ຂໍ້ຄວາມ «ລາຍການທີ່ຢາກຖາມ» ຂອງລູກຄ້າກໍມີລະຫັດແລ້ວ.',
        th: 'จดสินค้าแต่ละรายการพร้อมรหัส (KG-…) ข้อความรายการคำถามของลูกค้ามีรหัสอยู่แล้ว',
        fr: 'Notez chaque produit avec son code (KG-…). Le message de liste de questions du client contient déjà les codes.',
      },
      {
        ko: '도착 날짜는 KOREA GLOW가 알려 준 일정만 말하세요. 모르면 «확인해서 알려 드릴게요».',
        en: 'Only give arrival dates KOREA GLOW has told you. If you do not know, say "I\'ll check and let you know."',
        lo: 'ບອກວັນມາຮອດ ສະເພາະຕາມທີ່ KOREA GLOW ແຈ້ງເທົ່ານັ້ນ. ຖ້າບໍ່ຮູ້ ໃຫ້ເວົ້າວ່າ «ຂໍກວດເບິ່ງກ່ອນ ແລ້ວຈະບອກ».',
        th: 'แจ้งวันที่สินค้าจะมาถึงเฉพาะที่ KOREA GLOW แจ้งไว้เท่านั้น ถ้าไม่รู้ ให้บอกว่า “ขอตรวจสอบแล้วจะแจ้งให้ทราบ”',
        fr: 'Ne donnez que les dates d\'arrivée communiquées par KOREA GLOW. Si vous ne savez pas, dites « Je vérifie et je vous tiens au courant. »',
      },
      {
        ko: '처음 쓰는 손님에게는 귀 뒤나 팔 안쪽에 조금 발라 보기를 권하세요.',
        en: 'Suggest first-time users try a little behind the ear or on the inner arm first.',
        lo: 'ແນະນຳລູກຄ້າທີ່ໃຊ້ຄັ້ງທຳອິດ ໃຫ້ລອງທາໜ້ອຍໜຶ່ງຫຼັງຫູ ຫຼື ແຂນດ້ານໃນກ່ອນ.',
        th: 'แนะนำให้ผู้ที่ใช้ครั้งแรกลองทาเล็กน้อยที่หลังหูหรือท้องแขนด้านในก่อน',
        fr: 'Conseillez aux personnes qui l\'utilisent pour la première fois d\'en essayer d\'abord un peu derrière l\'oreille ou à l\'intérieur du bras.',
      },
    ],
    quiz: [
      {
        q: {
          ko: '손님이 «언제 와요?»라고 물으면?',
          en: 'A customer asks "When will it arrive?"',
          lo: 'ລູກຄ້າຖາມວ່າ «ຈະມາຮອດເມື່ອໃດ?»',
          th: 'ลูกค้าถามว่า “จะมาถึงเมื่อไร?”',
          fr: 'Une cliente demande « Quand est-ce que ça arrive? »',
        },
        options: [
          { ko: '«아마 내일이요»', en: '"Probably tomorrow"', lo: '«ອາດຈະມື້ອື່ນ»', th: '“น่าจะพรุ่งนี้”', fr: '« Sans doute demain »' },
          {
            ko: '«확인해서 알려 드릴게요»',
            en: '"I\'ll check and let you know"',
            lo: '«ຂໍກວດເບິ່ງກ່ອນ ແລ້ວຈະບອກ»',
            th: '“ขอตรวจสอบแล้วจะแจ้งให้ทราบ”',
            fr: '« Je vérifie et je vous tiens au courant »',
          },
          {
            ko: '«모르니까 그냥 기다리세요»',
            en: '"No idea, just wait"',
            lo: '«ບໍ່ຮູ້ ລໍຖ້າໄປກ່ອນ»',
            th: '“ไม่รู้ รอไปก่อน”',
            fr: '« Aucune idée, attendez »',
          },
        ],
        answer: 1,
        why: {
          ko: '모르는 날짜를 약속하면 신뢰를 잃어요. 확인하고 정확히 알려 주세요.',
          en: 'Promising a date you do not know loses trust. Check, then answer exactly.',
          lo: 'ການສັນຍາວັນທີ່ບໍ່ຮູ້ ເຮັດໃຫ້ເສຍຄວາມເຊື່ອໃຈ. ກວດກ່ອນ ແລ້ວບອກໃຫ້ຖືກຕ້ອງ.',
          th: 'การสัญญาวันที่ที่คุณไม่รู้ทำให้เสียความไว้วางใจ ตรวจสอบก่อน แล้วตอบให้ตรง',
          fr: 'Promettre une date que vous ne connaissez pas fait perdre la confiance. Vérifiez, puis répondez précisément.',
        },
      },
      {
        q: {
          ko: '주문을 헷갈리지 않으려면?',
          en: 'How do you avoid mixing up orders?',
          lo: 'ເຮັດແນວໃດຈຶ່ງບໍ່ສັບສົນອໍເດີ?',
          th: 'จะหลีกเลี่ยงการสับสนออร์เดอร์ได้อย่างไร?',
          fr: 'Comment éviter de mélanger les commandes?',
        },
        options: [
          {
            ko: '제품 이름만 기억한다',
            en: 'Remember only the product name',
            lo: 'ຈື່ແຕ່ຊື່ສິນຄ້າ',
            th: 'จำแค่ชื่อสินค้า',
            fr: 'Retenir seulement le nom du produit',
          },
          {
            ko: '제품 코드와 함께 적어 둔다',
            en: 'Write it down with the product code',
            lo: 'ຂຽນໄວ້ພ້ອມລະຫັດສິນຄ້າ',
            th: 'จดไว้พร้อมรหัสสินค้า',
            fr: 'Le noter avec le code produit',
          },
          { ko: '사진만 찍어 둔다', en: 'Just take a photo', lo: 'ຖ່າຍຮູບໄວ້ເທົ່ານັ້ນ', th: 'แค่ถ่ายรูปไว้', fr: 'Prendre juste une photo' },
        ],
        answer: 1,
        why: {
          ko: '비슷한 이름의 제품이 많아요. 코드는 하나뿐이라 실수가 없어요.',
          en: 'Many products have similar names. A code is unique, so there is no mix-up.',
          lo: 'ສິນຄ້າຫຼາຍຢ່າງມີຊື່ຄ້າຍກັນ. ລະຫັດມີອັນດຽວ ຈຶ່ງບໍ່ຜິດ.',
          th: 'สินค้าหลายตัวมีชื่อคล้ายกัน รหัสไม่ซ้ำกัน จึงไม่สับสน',
          fr: 'Beaucoup de produits ont des noms proches. Un code est unique, donc aucune confusion.',
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
      th: 'การรักษาข้อมูลของลูกค้าให้เป็นความลับ',
      fr: 'Protéger les informations des clients',
    },
    intro: {
      ko: '손님의 정보는 손님의 것이에요.',
      en: "A customer's information belongs to the customer.",
      lo: 'ຂໍ້ມູນຂອງລູກຄ້າ ແມ່ນຂອງລູກຄ້າ.',
      th: 'ข้อมูลของลูกค้าเป็นของลูกค้า',
      fr: 'Les informations d\'une cliente lui appartiennent.',
    },
    points: [
      {
        ko: '손님 얼굴 사진이나 이름은 허락 없이 SNS에 올리지 마세요.',
        en: "Never post a customer's photo or name on social media without her permission.",
        lo: 'ຢ່າໂພສຮູບ ຫຼື ຊື່ລູກຄ້າໃນສື່ສັງຄົມ ໂດຍບໍ່ໄດ້ຮັບອະນຸຍາດ.',
        th: 'ห้ามโพสต์รูปหรือชื่อของลูกค้าบนโซเชียลมีเดียโดยไม่ได้รับอนุญาตจากลูกค้า',
        fr: 'Ne publiez jamais la photo ou le nom d\'une cliente sur les réseaux sociaux sans sa permission.',
      },
      {
        ko: '손님 연락처 목록을 다른 사람에게 넘기지 마세요.',
        en: "Never pass your customers' contact list to anyone else.",
        lo: 'ຢ່າສົ່ງລາຍຊື່ເບີຕິດຕໍ່ລູກຄ້າໃຫ້ຄົນອື່ນ.',
        th: 'ห้ามส่งต่อรายชื่อผู้ติดต่อของลูกค้าให้ผู้อื่นเด็ดขาด',
        fr: 'Ne transmettez jamais la liste de contacts de vos clients à qui que ce soit.',
      },
      {
        ko: '이 앱은 손님의 퀴즈 답과 목록을 어디에도 보내지 않아요. 손님에게 안심하라고 말해도 돼요.',
        en: "This app does not send customers' quiz answers or lists anywhere. You can tell them so.",
        lo: 'ແອັບນີ້ບໍ່ໄດ້ສົ່ງຄຳຕອບ ຫຼື ລາຍການຂອງລູກຄ້າໄປໃສ. ບອກລູກຄ້າໃຫ້ໝັ້ນໃຈໄດ້.',
        th: 'แอปนี้ไม่ส่งคำตอบแบบทดสอบหรือรายการของลูกค้าไปที่ใดเลย คุณบอกลูกค้าแบบนี้ได้',
        fr: 'Cette application n\'envoie nulle part les réponses aux quiz ni les listes des clients. Vous pouvez le leur dire.',
      },
    ],
    quiz: [
      {
        q: {
          ko: '손님 사용 후기 사진을 올리고 싶다면?',
          en: "You want to post a customer's photo review. What first?",
          lo: 'ຢາກໂພສຮູບລີວິວຂອງລູກຄ້າ ຕ້ອງເຮັດຫຍັງກ່ອນ?',
          th: 'คุณต้องการโพสต์รีวิวพร้อมรูปของลูกค้า ต้องทำอะไรก่อน?',
          fr: 'Vous voulez publier l\'avis en photo d\'une cliente. Que faire d\'abord?',
        },
        options: [
          { ko: '먼저 허락을 받는다', en: 'Ask her permission first', lo: 'ຂໍອະນຸຍາດກ່ອນ', th: 'ขออนุญาตจากลูกค้าก่อน', fr: 'Lui demander d\'abord sa permission' },
          { ko: '얼굴만 가리면 된다', en: 'Just cover her face', lo: 'ພຽງແຕ່ປິດໜ້າ', th: 'แค่ปิดหน้าไว้', fr: 'Juste cacher son visage' },
          { ko: '그냥 올린다', en: 'Just post it', lo: 'ໂພສເລີຍ', th: 'โพสต์เลย', fr: 'Le publier directement' },
        ],
        answer: 0,
        why: {
          ko: '사진과 이야기는 손님의 것이에요. 허락이 먼저예요.',
          en: 'The photo and the story are hers. Permission comes first.',
          lo: 'ຮູບ ແລະ ເລື່ອງແມ່ນຂອງລູກຄ້າ. ຕ້ອງຂໍອະນຸຍາດກ່ອນ.',
          th: 'รูปและเรื่องราวเป็นของลูกค้า การขออนุญาตต้องมาก่อน',
          fr: 'La photo et l\'histoire lui appartiennent. La permission passe avant tout.',
        },
      },
      {
        q: {
          ko: '다른 가게가 손님 연락처를 달라고 하면?',
          en: "Another shop asks for your customers' contacts.",
          lo: 'ຮ້ານອື່ນຂໍເບີຕິດຕໍ່ລູກຄ້າຂອງເຮົາ.',
          th: 'ร้านอื่นขอข้อมูลติดต่อลูกค้าของคุณ',
          fr: 'Une autre boutique vous demande les contacts de vos clients.',
        },
        options: [
          { ko: '준다', en: 'Give them', lo: 'ໃຫ້', th: 'ให้ไป', fr: 'Les donner' },
          { ko: '주지 않는다', en: 'Do not give them', lo: 'ບໍ່ໃຫ້', th: 'ไม่ให้', fr: 'Ne pas les donner' },
          { ko: '일부만 준다', en: 'Give some of them', lo: 'ໃຫ້ບາງສ່ວນ', th: 'ให้บางส่วน', fr: 'En donner une partie' },
        ],
        answer: 1,
        why: {
          ko: '손님은 우리를 믿고 연락처를 줬어요. 누구에게도 넘기지 않아요.',
          en: 'Customers gave you their number because they trust you. It goes to no one else.',
          lo: 'ລູກຄ້າໃຫ້ເບີເພາະເຊື່ອໃຈເຮົາ. ບໍ່ສົ່ງໃຫ້ໃຜ.',
          th: 'ลูกค้าให้เบอร์กับคุณเพราะไว้ใจคุณ เบอร์นี้จะไม่ไปถึงใครอื่น',
          fr: 'Les clients vous ont donné leur numéro parce qu\'ils vous font confiance. Il ne va à personne d\'autre.',
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
