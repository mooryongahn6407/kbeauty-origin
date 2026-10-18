/**
 * Lumina Noy's first-visit introduction (owner's Korean script, 2026-10-18 — awaiting his
 * approval; shown on the preview only until then, see `src/app/intro.ts`). Korean is the master;
 * en/fr/lo/th are unreviewed drafts, like every lo/th/fr line in the app.
 * Six lines, one subtitle at a time.
 */
import { L } from './care-quest/common';
import type { Localized } from './care-quest/types';

export const INTRO_LINES: readonly Localized[] = [
  L(
    '안녕하세요, 저는 루미나 노이예요. GLOW 클래스에 오신 걸 환영해요.',
    "Hello, I'm Lumina Noy. Welcome to GLOW Class.",
    'ສະບາຍດີ, ຂ້ອຍຊື່ ລູມິນາ ນ້ອຍ. ຍິນດີຕ້ອນຮັບສູ່ GLOW Class.',
    'สวัสดีค่ะ ฉันชื่อลูมินา นอย ยินดีต้อนรับสู่ GLOW Class ค่ะ',
    'Bonjour, je suis Lumina Noy. Bienvenue dans GLOW Class.',
  ),
  L(
    '여기서는 내 피부를 정확히 알고, 나에게 맞는 관리법을 쉽게 배울 수 있어요.',
    'Here you can get to know your skin well and easily learn the care that suits you.',
    'ຢູ່ນີ້ ທ່ານຈະຮູ້ຈັກຜິວຂອງຕົນເອງດີຂຶ້ນ ແລະ ຮຽນວິທີດູແລທີ່ເໝາະກັບທ່ານໄດ້ງ່າຍໆ.',
    'ที่นี่คุณจะรู้จักผิวของตัวเองได้ดีขึ้น และเรียนรู้วิธีดูแลที่เหมาะกับคุณได้ง่าย ๆ',
    'Ici, vous apprenez à bien connaître votre peau et, simplement, les soins qui vous conviennent.',
  ),
  L(
    '먼저 3분 피부 게임을 해 볼게요. 질문에 하나씩 답하면 내 피부 타입과 아침·저녁 순서를 알려 드려요.',
    "Let's start with a 3-minute skin game. Answer one question at a time, and I'll show you your skin type and your morning and evening steps.",
    'ກ່ອນອື່ນ ມາຫຼິ້ນເກມຜິວ 3 ນາທີກັນ. ຕອບຄຳຖາມເທື່ອລະຂໍ້ ແລ້ວຂ້ອຍຈະບອກປະເພດຜິວ ແລະ ຂັ້ນຕອນຕອນເຊົ້າ ແລະ ຕອນແລງຂອງທ່ານ.',
    'เริ่มจากเกมผิว 3 นาทีกันก่อนนะคะ ตอบคำถามทีละข้อ แล้วฉันจะบอกประเภทผิวและขั้นตอนเช้าและเย็นของคุณ',
    'Commençons par un jeu de peau de 3 minutes. Répondez aux questions une à une, et je vous indiquerai votre type de peau et vos étapes du matin et du soir.',
  ),
  L(
    '결과에는 늘 이유가 함께 나와요. 기미나 여드름이 고민이라면 어떤 성분을 찾아야 하는지도요.',
    'Every result comes with its reasons — and, if dark spots or breakouts worry you, which ingredients to look for.',
    'ຜົນທຸກຄັ້ງມີເຫດຜົນປະກອບ. ຖ້າກັງວົນເລື່ອງຝ້າ ຫຼື ສິວ ກໍຈະບອກວ່າຄວນຊອກຫາສ່ວນປະສົມໃດ.',
    'ผลลัพธ์ทุกครั้งมีเหตุผลประกอบเสมอ ถ้ากังวลเรื่องฝ้าหรือสิว ก็จะบอกด้วยว่าควรมองหาส่วนผสมอะไร',
    'Chaque résultat vient avec ses raisons — et, si les taches ou les boutons vous préoccupent, les ingrédients à rechercher.',
  ),
  L(
    '게임이 끝나면 스킨·헤어·바디를 짧은 영상과 퀴즈로 더 깊이 공부할 수 있어요.',
    'After the game, you can learn more about skin, hair and body with short videos and quizzes.',
    'ເມື່ອຈົບເກມ ທ່ານຮຽນເລື່ອງຜິວ, ຜົມ ແລະ ຮ່າງກາຍ ໄດ້ເລິກຂຶ້ນ ດ້ວຍວິດີໂອສັ້ນ ແລະ ແບບທົດສອບ.',
    'เมื่อจบเกม คุณเรียนเรื่องผิว ผม และผิวกาย ได้ลึกขึ้นด้วยวิดีโอสั้นและแบบทดสอบ',
    'Après le jeu, vous pourrez approfondir la peau, les cheveux et le corps avec de courtes vidéos et des quiz.',
  ),
  L(
    '폰에 아이콘을 저장해 두면 언제든 이어서 할 수 있어요. 마음에 드시면 친구분들께 공유도 부탁드려요. 자, 시작해 볼까요?',
    'Save the icon to your phone and pick up where you left off any time. If you like it, please share it with your friends. Shall we begin?',
    'ບັນທຶກໄອຄອນໃສ່ໂທລະສັບໄວ້ ຈະກັບມາເຮັດຕໍ່ໄດ້ທຸກເວລາ. ຖ້າມັກ ກະລຸນາແບ່ງປັນໃຫ້ໝູ່ເພື່ອນແດ່. ພ້ອມແລ້ວບໍ? ມາເລີ່ມກັນເລີຍ.',
    'บันทึกไอคอนไว้ในโทรศัพท์ แล้วกลับมาทำต่อได้ทุกเมื่อ ถ้าชอบ ฝากแชร์ให้เพื่อน ๆ ด้วยนะคะ พร้อมแล้ว เริ่มกันเลยไหมคะ',
    "Ajoutez l'icône sur votre téléphone pour reprendre quand vous voulez. Si cela vous plaît, partagez-la avec vos amis. On commence ?",
  ),
];
