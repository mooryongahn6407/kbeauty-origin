/**
 * Words for the KG-APP-BASE chrome (bottom bar, settings, button guide, help desk, update line).
 * Korean and English are the base; Lao, Thai and French are unreviewed drafts, and the app
 * already says so at the top of every screen in those languages.
 */
import { L } from '@/content/care-quest/common';
import type { Localized } from '@/content/care-quest/types';

export const CHROME: Readonly<Record<string, Localized>> = {
  inApp: L(
    '이 화면은 앱 안 브라우저예요. 오른쪽 위 ⋯ → «브라우저에서 열기»를 누르면 저장·설치가 잘 돼요.',
    'You are in an in-app browser. Tap ⋯ at the top right → “Open in browser” so saving and installing work.',
    'ນີ້ແມ່ນບຣາວເຊີໃນແອັບ. ກົດ ⋯ ດ້ານເທິງຂວາ → «ເປີດໃນບຣາວເຊີ» ເພື່ອບັນທຶກ ແລະ ຕິດຕັ້ງໄດ້.',
    'นี่คือเบราว์เซอร์ในแอป แตะ ⋯ มุมขวาบน → «เปิดในเบราว์เซอร์» เพื่อให้บันทึกและติดตั้งได้',
    'Vous êtes dans le navigateur d’une app. Touchez ⋯ en haut à droite → « Ouvrir dans le navigateur ».',
  ),
  // CEO 2026-10-17: the caption names the guide — no «AI» notice.
  guideName: L(
    '루미나 노이 · GLOW Class 가이드',
    'Lumina Noy · GLOW Class guide',
    'ລູມິນາ ນ້ອຍ · ຜູ້ນຳທາງ GLOW Class',
    'ลูมินา นอย · ผู้นำทาง GLOW Class',
    'Lumina Noy · guide GLOW Class',
  ),
  whyLabel: L('성분표 근거', 'On the label', 'ໃນສະຫຼາກ', 'บนฉลาก', "Sur l'étiquette"),
  nth: L('{n}번째', 'no. {n}', 'ທີ {n}', 'ลำดับ {n}', 'n° {n}'),
  // CEO 2026-10-18 (card sqglow_14): supplier-list evidence is shown, but said to be unchecked
  supplierUnchecked: L(
    '공급사 성분표 기준 · 실물 라벨 확인 전',
    "From the supplier's list · real label not checked yet",
    'ຕາມລາຍການຂອງຜູ້ສະໜອງ · ຍັງບໍ່ໄດ້ກວດສະຫຼາກແທ້',
    'ตามรายการของผู้จำหน่าย · ยังไม่ได้ตรวจฉลากจริง',
    'Liste du fournisseur · étiquette réelle pas encore vérifiée',
  ),
  prev: L('이전', 'Back', 'ກັບຄືນ', 'ย้อนกลับ', 'Retour'),
  next: L('다음', 'Next', 'ຕໍ່ໄປ', 'ถัดไป', 'Suivant'),
  skip: L('건너뛰기', 'Skip', 'ຂ້າມ', 'ข้าม', 'Passer'),
  restart: L('다시 하기', 'Play again', 'ເຮັດໃໝ່', 'เล่นอีกครั้ง', 'Recommencer'),
  first: L('처음으로', 'Start', 'ເລີ່ມຕົ້ນ', 'หน้าแรก', 'Début'),
  home: L('홈', 'Home', 'ໜ້າຫຼັກ', 'หน้าหลัก', 'Accueil'),
  settings: L('설정', 'Settings', 'ຕັ້ງຄ່າ', 'ตั้งค่า', 'Réglages'),
  close: L('닫기', 'Close', 'ປິດ', 'ปิด', 'Fermer'),
  confirmFirst: L(
    '처음으로 갈까요? 지금까지의 답은 저장돼요.',
    'Go back to the start? Your answers so far are saved.',
    'ກັບໄປໜ້າທຳອິດບໍ? ຄຳຕອບທີ່ຜ່ານມາຖືກບັນທຶກໄວ້ແລ້ວ.',
    'กลับไปหน้าแรกไหม? คำตอบที่ตอบไปแล้วถูกบันทึกไว้',
    'Revenir au début ? Vos réponses sont enregistrées.',
  ),
  backAgainToLeave: L(
    '한 번 더 누르면 앱을 나가요.',
    'Press back once more to leave the app.',
    'ກົດກັບຄືນອີກເທື່ອໜຶ່ງເພື່ອອອກຈາກແອັບ.',
    'กดย้อนกลับอีกครั้งเพื่อออกจากแอป',
    'Appuyez encore sur retour pour quitter.',
  ),
  // Settings
  sLanguage: L('언어', 'Language', 'ພາສາ', 'ภาษา', 'Langue'),
  sDisplay: L('화면·글씨 크기', 'Screen and text size', 'ໜ້າຈໍ ແລະ ຂະໜາດຕົວໜັງສື', 'หน้าจอและขนาดตัวอักษร', 'Affichage et taille du texte'),
  sSound: L('소리', 'Sound', 'ສຽງ', 'เสียง', 'Son'),
  sInstall: L('홈 화면에 저장', 'Save to home screen', 'ບັນທຶກໃສ່ໜ້າຈໍຫຼັກ', 'บันทึกไว้ที่หน้าจอหลัก', "Ajouter à l'écran d'accueil"),
  sUpdate: L('새 버전 확인', 'Check for a new version', 'ກວດເບິ່ງເວີຊັນໃໝ່', 'ตรวจหาเวอร์ชันใหม่', 'Chercher une nouvelle version'),
  sUpToDate: L('지금이 최신 버전이에요.', 'You have the latest version.', 'ນີ້ແມ່ນເວີຊັນລ່າສຸດແລ້ວ.', 'นี่คือเวอร์ชันล่าสุดแล้ว', 'Vous avez la dernière version.'),
  sGuide: L('버튼 안내 다시 보기', 'See the button guide again', 'ເບິ່ງຄຳແນະນຳປຸ່ມອີກຄັ້ງ', 'ดูคำแนะนำปุ่มอีกครั้ง', 'Revoir le guide des boutons'),
  sHelp: L('고객센터', 'Help desk', 'ສູນບໍລິການລູກຄ້າ', 'ศูนย์ช่วยเหลือ', 'Assistance'),
  sApps: L('KOREA GLOW 다른 앱', 'Other KOREA GLOW apps', 'ແອັບອື່ນຂອງ KOREA GLOW', 'แอปอื่นของ KOREA GLOW', 'Autres apps KOREA GLOW'),
  sVersion: L('버전', 'Version', 'ເວີຊັນ', 'เวอร์ชัน', 'Version'),
  // Error boundary — shown instead of a blank screen when a screen fails to draw
  errTitle: L('잠깐 문제가 생겼어요', 'Something went wrong for a moment', 'ມີບັນຫາເລັກນ້ອຍ', 'เกิดปัญหาเล็กน้อย', 'Un petit souci est survenu'),
  errBody: L(
    '화면을 그리지 못했어요. 저장된 내용은 그대로예요. 다시 시도하거나 홈으로 가 주세요.',
    'This screen could not be drawn. What you saved is still there. Try again, or go home.',
    'ບໍ່ສາມາດສະແດງໜ້ານີ້ໄດ້. ສິ່ງທີ່ບັນທຶກໄວ້ຍັງຢູ່. ລອງໃໝ່ ຫຼື ກັບໄປໜ້າຫຼັກ.',
    'แสดงหน้านี้ไม่ได้ สิ่งที่บันทึกไว้ยังอยู่ ลองอีกครั้งหรือกลับหน้าหลัก',
    'Cet écran n’a pas pu s’afficher. Ce que vous avez enregistré est toujours là. Réessayez ou revenez à l’accueil.',
  ),
  errRetry: L('다시 시도', 'Try again', 'ລອງໃໝ່', 'ลองอีกครั้ง', 'Réessayer'),
  errHome: L('홈으로', 'Go home', 'ກັບໜ້າຫຼັກ', 'กลับหน้าหลัก', 'Accueil'),
  // Delete my data on this phone
  sData: L('이 폰에 저장된 내 정보', 'My data on this phone', 'ຂໍ້ມູນຂອງຂ້ອຍໃນໂທລະສັບນີ້', 'ข้อมูลของฉันในโทรศัพท์นี้', 'Mes données sur ce téléphone'),
  sDataNote: L(
    '퀘스트 답(임신·수유·나이·피부 상태 포함), 기록, 학습 진도, 모은 것, 설정이 이 폰에 저장돼 있어요.',
    'Your quest answers (including pregnancy, breastfeeding, age and skin condition), history, learning progress, collection and settings are saved on this phone.',
    'ຄຳຕອບໃນເກມ (ລວມທັງການຖືພາ, ການໃຫ້ນົມລູກ, ອາຍຸ ແລະ ສະພາບຜິວ), ປະຫວັດ, ຄວາມຄືບໜ້າການຮຽນ, ສິ່ງທີ່ສະສົມ ແລະ ການຕັ້ງຄ່າ ຖືກບັນທຶກໄວ້ໃນໂທລະສັບນີ້.',
    'คำตอบในเกม (รวมถึงการตั้งครรภ์ การให้นมบุตร อายุ และสภาพผิว) ประวัติ ความคืบหน้าการเรียน สิ่งที่สะสม และการตั้งค่า ถูกบันทึกไว้ในโทรศัพท์นี้',
    'Vos réponses au quiz (y compris grossesse, allaitement, âge et état de la peau), l’historique, la progression, la collection et les réglages sont enregistrés sur ce téléphone.',
  ),
  sDelete: L('이 폰에서 내 정보 지우기', 'Delete my data on this phone', 'ລຶບຂໍ້ມູນຂອງຂ້ອຍໃນໂທລະສັບນີ້', 'ลบข้อมูลของฉันในโทรศัพท์นี้', 'Supprimer mes données sur ce téléphone'),
  sDeleteConfirm: L(
    '이 앱이 이 폰에 저장한 것을 모두 지울까요? 되돌릴 수 없어요. 앱은 처음 방문한 것처럼 다시 시작돼요.',
    'Delete everything this app saved on this phone? This cannot be undone. The app will start again as on your first visit.',
    'ລຶບທຸກຢ່າງທີ່ແອັບນີ້ບັນທຶກໄວ້ໃນໂທລະສັບນີ້ບໍ? ເອົາຄືນບໍ່ໄດ້. ແອັບຈະເລີ່ມໃໝ່ຄືກັບການເຂົ້າເທື່ອທຳອິດ.',
    'ลบทุกอย่างที่แอปนี้บันทึกไว้ในโทรศัพท์นี้ไหม? ย้อนกลับไม่ได้ แอปจะเริ่มใหม่เหมือนเข้าครั้งแรก',
    'Supprimer tout ce que cette app a enregistré sur ce téléphone ? C’est définitif. L’app redémarrera comme à votre première visite.',
  ),
  sDeleteYes: L('네, 지울게요', 'Yes, delete', 'ແມ່ນ, ລຶບ', 'ใช่ ลบเลย', 'Oui, supprimer'),
  sDeleteNo: L('그대로 둘게요', 'Keep my data', 'ເກັບໄວ້', 'เก็บไว้', 'Garder mes données'),
  appSkinQuest: L('SKIN QUEST — 3분 피부 게임 (이 앱 안)', 'SKIN QUEST — 3-minute skin game (in this app)', 'SKIN QUEST — ເກມຜິວ 3 ນາທີ (ໃນແອັບນີ້)', 'SKIN QUEST — เกมผิว 3 นาที (ในแอปนี้)', 'SKIN QUEST — jeu de peau en 3 min (dans cette app)'),
  appSmartBuy: L('KOREA SMART BUY — 한국 제품 보기 (쇼핑몰)', 'KOREA SMART BUY — see Korean products (shop)', 'KOREA SMART BUY — ເບິ່ງສິນຄ້າເກົາຫຼີ (ຮ້ານຄ້າ)', 'KOREA SMART BUY — ดูสินค้าเกาหลี (ร้านค้า)', 'KOREA SMART BUY — voir des produits coréens (boutique)'),
  appLaoBridge: L('LAO BRIDGE — 라오어·한국어·영어 배우기', 'LAO BRIDGE — learn Lao, Korean and English', 'LAO BRIDGE — ຮຽນພາສາລາວ, ເກົາຫຼີ ແລະ ອັງກິດ', 'LAO BRIDGE — เรียนภาษาลาว เกาหลี และอังกฤษ', 'LAO BRIDGE — apprendre le lao, le coréen et l’anglais'),
  // lo/th/fr: unreviewed drafts like every other lo/th/fr line here.
  appOfficial: L('KOREA GLOW 공식 사이트', 'KOREA GLOW official site', 'ເວັບໄຊທາງການ KOREA GLOW', 'เว็บไซต์ทางการ KOREA GLOW', 'Site officiel KOREA GLOW'),
  // ── 2026-10-18 owner orders C–F. Korean is the master; en is base; lo/th/fr below are
  // unreviewed drafts like every other lo/th/fr line in this file (the app says so on screen).
  // C · SKIN QUEST → GLOW Class
  deeper: L('더 깊이 공부하기 → GLOW 클래스', 'Learn more deeply → GLOW Class', 'ຮຽນຮູ້ໃຫ້ເລິກຂຶ້ນ → GLOW Class', 'เรียนรู้ให้ลึกขึ้น → GLOW Class', 'Approfondir → GLOW Class'),
  welcomeBack: L('다시 오셨네요', 'Welcome back', 'ຍິນດີຕ້ອນຮັບກັບມາ', 'ยินดีต้อนรับกลับมา', 'Bon retour'),
  lastResult: L('지난 결과 보기', 'See my last result', 'ເບິ່ງຜົນຄັ້ງກ່ອນ', 'ดูผลครั้งก่อน', 'Voir mon dernier résultat'),
  continueQuest: L('이어 하기', 'Continue', 'ສືບຕໍ່', 'ทำต่อ', 'Continuer'),
  newQuest: L('피부 게임 새로 하기', 'Play the skin game again', 'ຫຼິ້ນເກມຜິວໃໝ່', 'เล่นเกมผิวใหม่', 'Rejouer au jeu de peau'),
  installHintTitle: L('폰 홈 화면에 아이콘 저장', 'Save the icon to your home screen', 'ບັນທຶກໄອຄອນໃສ່ໜ້າຈໍຫຼັກ', 'บันทึกไอคอนไว้ที่หน้าจอหลัก', "Ajouter l'icône à l'écran d'accueil"),
  installHintBody: L(
    '아이콘을 저장해 두면 언제든 결과를 다시 보고 이어서 공부할 수 있어요.',
    'With the icon on your home screen, you can see your result again and keep learning any time.',
    'ຖ້າບັນທຶກໄອຄອນໄວ້ ທ່ານຈະເບິ່ງຜົນຄືນ ແລະ ຮຽນຕໍ່ໄດ້ທຸກເວລາ.',
    'ถ้าบันทึกไอคอนไว้ จะกลับมาดูผลและเรียนต่อได้ทุกเมื่อ',
    "Avec l'icône sur votre écran d'accueil, vous retrouvez votre résultat et continuez d'apprendre quand vous voulez.",
  ),
  // D · ask about a product on WhatsApp Business (no prices, ever)
  kgProducts: L('KOREA GLOW 제품', 'KOREA GLOW products', 'ສິນຄ້າ KOREA GLOW', 'สินค้า KOREA GLOW', 'Produits KOREA GLOW'),
  askProduct: L('WhatsApp으로 이 제품 문의하기', 'Ask about this product on WhatsApp', 'ສອບຖາມສິນຄ້ານີ້ທາງ WhatsApp', 'สอบถามสินค้านี้ทาง WhatsApp', 'Poser une question sur ce produit (WhatsApp)'),
  askProductMessage: L(
    '안녕하세요! GLOW 클래스에서 보고 연락드려요. 이 제품에 대해 여쭤보고 싶어요: {product}',
    'Hello! I saw this in GLOW Class and would like to ask about this product: {product}',
    'ສະບາຍດີ! ຂ້ອຍເຫັນໃນ GLOW Class ແລະ ຢາກສອບຖາມກ່ຽວກັບສິນຄ້ານີ້: {product}',
    'สวัสดีค่ะ เห็นใน GLOW Class และอยากสอบถามเกี่ยวกับสินค้านี้: {product}',
    'Bonjour ! Je l’ai vu dans GLOW Class et j’aimerais me renseigner sur ce produit : {product}',
  ),
  // E · a gentle one-line reminder at step changes
  nudge: L(
    '내용이 좋으면 ♥ 좋아요를 눌러 주세요. 친구분들께 공유해 주시면 정말 고맙겠습니다.',
    'If you like it, please tap ♥ Like. Sharing it with your friends would mean a lot to us.',
    'ຖ້າມັກ ກະລຸນາກົດ ♥ ຖືກໃຈ. ຖ້າແບ່ງປັນໃຫ້ໝູ່ເພື່ອນ ພວກເຮົາຈະຂອບໃຈຫຼາຍ.',
    'ถ้าชอบ ช่วยกด ♥ ถูกใจนะคะ ถ้าช่วยแชร์ให้เพื่อน ๆ เราจะขอบคุณมากค่ะ',
    "Si cela vous plaît, touchez ♥ J'aime. Le partager avec vos amis nous ferait vraiment plaisir.",
  ),
  // F · first-visit intro (preview only until the owner approves the script)
  introSkip: L('건너뛰기', 'Skip', 'ຂ້າມ', 'ข้าม', 'Passer'),
  introNoAuto: L('다음부터 자동으로 보지 않기', "Don't play this automatically", 'ບໍ່ຕ້ອງເປີດອັດຕະໂນມັດ', 'ไม่ต้องเล่นอัตโนมัติ', 'Ne plus lancer automatiquement'),
  introSound: L('소리 켜기', 'Turn on sound', 'ເປີດສຽງ', 'เปิดเสียง', 'Activer le son'),
  introStart: L('시작하기', "Let's start", 'ເລີ່ມເລີຍ', 'เริ่มเลย', 'Commencer'),
  // H · skin-care tips on WhatsApp Business (secondary to «learn more deeply»)
  tips: L('WhatsApp으로 피부 관리 팁 받기', 'Get skin-care tips on WhatsApp', 'ຮັບຄຳແນະນຳດູແລຜິວທາງ WhatsApp', 'รับเคล็ดลับดูแลผิวทาง WhatsApp', 'Recevoir des conseils de soin sur WhatsApp'),
  tipsMessage: L(
    '안녕하세요! GLOW 클래스 피부 게임 결과가 «{type}»(으)로 나왔어요. 저에게 맞는 피부 관리 팁을 받아 보고 싶어요.',
    'Hello! My GLOW Class skin game result was «{type}». I would love some skin-care tips that suit me.',
    'ສະບາຍດີ! ຜົນເກມຜິວ GLOW Class ຂອງຂ້ອຍແມ່ນ «{type}». ຢາກໄດ້ຄຳແນະນຳດູແລຜິວທີ່ເໝາະກັບຂ້ອຍ.',
    'สวัสดีค่ะ ผลเกมผิว GLOW Class ของฉันคือ «{type}» อยากได้เคล็ดลับดูแลผิวที่เหมาะกับฉันค่ะ',
    'Bonjour ! Mon résultat au jeu de peau GLOW Class : « {type} ». J’aimerais recevoir des conseils de soin adaptés.',
  ),
  // I · 7-day routine check — gentle, no streak pressure, nothing tied to it
  weekTitle: L('7일 루틴 체크', '7-day routine check', 'ກວດກິດຈະວັດ 7 ມື້', 'เช็กรูทีน 7 วัน', 'Routine sur 7 jours'),
  weekIntro: L(
    '아침·저녁 관리를 했으면 가볍게 체크해 보세요. 못 한 날이 있어도 괜찮아요. 이 폰에만 저장돼요.',
    'Tick your morning and evening care when you have done it. Missing a day is fine. Saved only on this phone.',
    'ເມື່ອດູແລຕອນເຊົ້າ ແລະ ຕອນແລງແລ້ວ ໝາຍໄວ້ເບົາໆ. ມື້ທີ່ບໍ່ໄດ້ເຮັດກໍບໍ່ເປັນຫຍັງ. ບັນທຶກໄວ້ໃນໂທລະສັບນີ້ເທົ່ານັ້ນ.',
    'ถ้าดูแลผิวเช้าและเย็นแล้ว ติ๊กไว้เบา ๆ ได้เลย วันไหนพลาดก็ไม่เป็นไร บันทึกไว้ในโทรศัพท์นี้เท่านั้น',
    'Cochez vos soins du matin et du soir une fois faits. Un jour manqué, ce n’est pas grave. Enregistré seulement sur ce téléphone.',
  ),
  weekStart: L('오늘부터 시작하기', 'Start today', 'ເລີ່ມມື້ນີ້', 'เริ่มวันนี้', 'Commencer aujourd’hui'),
  weekDay: L('{n}일째', 'Day {n}', 'ມື້ທີ {n}', 'วันที่ {n}', 'Jour {n}'),
  weekAm: L('아침 관리', 'Morning care', 'ດູແລຕອນເຊົ້າ', 'ดูแลตอนเช้า', 'Soin du matin'),
  weekPm: L('저녁 관리', 'Evening care', 'ດູແລຕອນແລງ', 'ดูแลตอนเย็น', 'Soin du soir'),
  weekDone: L('7일을 함께했어요. 수고하셨어요!', 'Seven days together. Well done!', 'ຄົບ 7 ມື້ແລ້ວ. ເກັ່ງຫຼາຍ!', 'ครบ 7 วันแล้ว เก่งมากค่ะ!', 'Sept jours ensemble. Bravo !'),
  weekAgain: L('7일 다시 시작', 'Start another 7 days', 'ເລີ່ມ 7 ມື້ໃໝ່', 'เริ่ม 7 วันใหม่', 'Recommencer 7 jours'),
  // Update line
  updateReady: L('새 버전이 있어요', 'A new version is ready', 'ມີເວີຊັນໃໝ່ແລ້ວ', 'มีเวอร์ชันใหม่แล้ว', 'Une nouvelle version est prête'),
  updateApply: L('지금 적용', 'Update now', 'ອັບເດດດຽວນີ້', 'อัปเดตตอนนี้', 'Mettre à jour'),
  // Button guide (3 cards)
  g1t: L('아래 막대로 움직여요', 'Move with the bar at the bottom', 'ເລື່ອນດ້ວຍແຖບລຸ່ມ', 'เลื่อนด้วยแถบด้านล่าง', 'Avancez avec la barre du bas'),
  g1b: L(
    '이전 · 다음(건너뛰기) · 처음으로. 휴대폰의 «뒤로» 버튼도 똑같이 돼요.',
    'Back · Next (or Skip) · Start. Your phone’s back button works the same way.',
    'ກັບຄືນ · ຕໍ່ໄປ (ຫຼື ຂ້າມ) · ເລີ່ມຕົ້ນ. ປຸ່ມກັບຄືນຂອງໂທລະສັບກໍໃຊ້ໄດ້ຄືກັນ.',
    'ย้อนกลับ · ถัดไป (หรือข้าม) · หน้าแรก ปุ่มย้อนกลับของโทรศัพท์ก็ใช้ได้เหมือนกัน',
    'Retour · Suivant (ou Passer) · Début. Le bouton retour du téléphone marche aussi.',
  ),
  g2t: L('위에는 홈과 설정', 'Home and Settings at the top', 'ໜ້າຫຼັກ ແລະ ຕັ້ງຄ່າ ຢູ່ດ້ານເທິງ', 'หน้าหลักและตั้งค่าอยู่ด้านบน', 'Accueil et Réglages en haut'),
  g2b: L(
    '홈은 첫 화면으로, 설정에서는 언어·글씨 크기·소리·홈 화면 저장·고객센터를 바꿀 수 있어요.',
    'Home takes you to the first screen. Settings has language, text size, sound, save to home screen and the help desk.',
    'ໜ້າຫຼັກພາກັບໄປໜ້າທຳອິດ. ຕັ້ງຄ່າມີ ພາສາ, ຂະໜາດຕົວໜັງສື, ສຽງ, ບັນທຶກໃສ່ໜ້າຈໍ ແລະ ສູນບໍລິການ.',
    'หน้าหลักพากลับไปหน้าแรก ตั้งค่ามีภาษา ขนาดตัวอักษร เสียง บันทึกที่หน้าจอ และศูนย์ช่วยเหลือ',
    "Accueil ramène au premier écran. Réglages : langue, taille du texte, son, écran d'accueil et assistance.",
  ),
  g3t: L('언제든 다시 볼 수 있어요', 'You can see this again any time', 'ເບິ່ງຄືນໄດ້ທຸກເວລາ', 'ดูอีกครั้งได้ทุกเมื่อ', 'Revoyez-le quand vous voulez'),
  g3b: L(
    '이 안내는 설정 › «버튼 안내 다시 보기»에 있어요.',
    'This guide lives in Settings › “See the button guide again”.',
    'ຄຳແນະນຳນີ້ຢູ່ໃນ ຕັ້ງຄ່າ › «ເບິ່ງຄຳແນະນຳປຸ່ມອີກຄັ້ງ».',
    'คำแนะนำนี้อยู่ใน ตั้งค่า › «ดูคำแนะนำปุ่มอีกครั้ง»',
    'Ce guide se trouve dans Réglages › « Revoir le guide des boutons ».',
  ),
  gDone: L('시작하기', 'Got it', 'ເຂົ້າໃຈແລ້ວ', 'เข้าใจแล้ว', "C'est compris"),
  // Help desk
  hIntro: L(
    '앱이 열리지 않거나, 틀린 내용이 있거나, 꼭 필요한 기능 제안이 있을 때만 보내 주세요. 간단히 적어 주시면 바로 고치겠습니다. 고맙습니다.',
    'Please write only when the app will not open, something is wrong, or there is a feature you really need. A short note is enough and we will fix it quickly. Thank you.',
    'ກະລຸນາສົ່ງສະເພາະເມື່ອແອັບເປີດບໍ່ໄດ້, ມີຂໍ້ມູນຜິດ, ຫຼື ມີຄຳແນະນຳທີ່ຈຳເປັນ. ຂຽນສັ້ນໆກໍພໍ ພວກເຮົາຈະແກ້ໄຂໄວ. ຂອບໃຈ.',
    'กรุณาส่งเฉพาะเมื่อแอปเปิดไม่ได้ มีข้อมูลผิด หรือมีฟีเจอร์ที่จำเป็นจริงๆ เขียนสั้นๆ ก็พอ เราจะรีบแก้ไข ขอบคุณค่ะ',
    "Écrivez-nous seulement si l'app ne s'ouvre pas, si quelque chose est faux, ou pour une fonction vraiment utile. Une courte note suffit, nous corrigeons vite. Merci.",
  ),
  hKind: L('어떤 일인가요?', 'What is it about?', 'ເລື່ອງຫຍັງ?', 'เรื่องอะไร?', 'De quoi s’agit-il ?'),
  hError: L('오류', 'Error', 'ຂໍ້ຜິດພາດ', 'ข้อผิดพลาด', 'Erreur'),
  hWrong: L('틀린 내용', 'Wrong information', 'ຂໍ້ມູນຜິດ', 'ข้อมูลผิด', 'Information fausse'),
  hIdea: L('기능 제안', 'Feature idea', 'ແນະນຳຟັງຊັນ', 'เสนอฟีเจอร์', 'Idée de fonction'),
  hNote: L('한 줄로 적어 주세요 (필수)', 'Write one line (required)', 'ຂຽນໜຶ່ງແຖວ (ຈຳເປັນ)', 'เขียนหนึ่งบรรทัด (จำเป็น)', 'Écrivez une ligne (obligatoire)'),
  hSend: L('WhatsApp으로 보내기', 'Send on WhatsApp', 'ສົ່ງທາງ WhatsApp', 'ส่งทาง WhatsApp', 'Envoyer sur WhatsApp'),
  hLimit: L('오늘은 이미 보내 주셨어요. 고맙습니다.', 'You have already written to us today. Thank you.', 'ມື້ນີ້ທ່ານສົ່ງມາແລ້ວ. ຂອບໃຈ.', 'วันนี้คุณส่งมาแล้ว ขอบคุณค่ะ', "Vous nous avez déjà écrit aujourd'hui. Merci."),
};
