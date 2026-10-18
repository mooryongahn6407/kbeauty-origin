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
  aiGuide: L(
    '루미나 노이 · GLOW Class 가이드',
    'Lumina Noy · GLOW Class guide',
    'ລູມິນາ ນ້ອຍ · ຜູ້ນຳທາງ GLOW Class',
    'ลูมินา นอย · ผู้นำทาง GLOW Class',
    'Lumina Noy · guide GLOW Class',
  ),
  whyLabel: L('성분표 근거', 'On the label', 'ໃນສະຫຼາກ', 'บนฉลาก', "Sur l'étiquette"),
  nth: L('{n}번째', 'no. {n}', 'ທີ {n}', 'ลำดับ {n}', 'n° {n}'),
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
  appOfficial: L('KOREA GLOW 공식 사이트', 'KOREA GLOW official site', 'ເວັບໄຊທາງການ KOREA GLOW', 'เว็บไซต์ทางการ KOREA GLOW', 'Site officiel KOREA GLOW'),
  // Like · Share (owner's request 2026-10-18). Korean is the master; en is base; lo/th/fr are
  // unreviewed drafts like every other lo/th/fr line here (CATALOG_REVIEW says so on screen).
  // No counts of shares and no pressure wording, by design.
  helpful: L('이 앱이 도움이 되셨나요?', 'Was this app helpful?', 'ແອັບນີ້ມີປະໂຫຍດບໍ?', 'แอปนี้มีประโยชน์ไหม?', 'Cette app vous a-t-elle aidé ?'),
  like: L('좋아요', 'Like', 'ມັກ', 'ถูกใจ', "J'aime"),
  share: L('공유', 'Share', 'ແບ່ງປັນ', 'แชร์', 'Partager'),
  shareTitle: L('공유하기', 'Share', 'ແບ່ງປັນ', 'แชร์', 'Partager'),
  shareMessage: L(
    '이 앱이 마음에 드시고 도움이 되셨다면 공유를 부탁드려요. 아는 분들이나 친구분들께 많이 알려 주시면 정말 감사하겠습니다.',
    'If you like this app and it has helped you, we would be grateful if you shared it. Telling the people you know and your friends about it would mean a great deal to us.',
    'ຖ້າທ່ານມັກແອັບນີ້ ແລະ ມັນມີປະໂຫຍດ ກະລຸນາແບ່ງປັນໃຫ້ແດ່. ຖ້າທ່ານບອກຄົນຮູ້ຈັກ ແລະ ໝູ່ເພື່ອນ ພວກເຮົາຈະຂອບໃຈຫຼາຍໆ.',
    'ถ้าคุณชอบแอปนี้และได้ประโยชน์ ขอรบกวนช่วยแชร์ด้วยนะคะ ถ้าช่วยบอกต่อคนรู้จักและเพื่อน ๆ เราจะขอบคุณมากจริง ๆ ค่ะ',
    'Si cette app vous plaît et vous a été utile, nous vous serions reconnaissants de la partager. En parler à vos proches et à vos amis nous ferait vraiment plaisir.',
  ),
  shareNative: L('공유하기', 'Share', 'ແບ່ງປັນ', 'แชร์', 'Partager'),
  shareWhatsApp: L('WhatsApp으로 보내기', 'Send on WhatsApp', 'ສົ່ງທາງ WhatsApp', 'ส่งทาง WhatsApp', 'Envoyer sur WhatsApp'),
  shareFacebook: L('Facebook에 올리기', 'Post on Facebook', 'ໂພສໃນ Facebook', 'โพสต์บน Facebook', 'Publier sur Facebook'),
  shareCopy: L('링크 복사', 'Copy link', 'ສຳເນົາລິ້ງ', 'คัดลอกลิงก์', 'Copier le lien'),
  shareCopied: L('복사했어요', 'Copied', 'ສຳເນົາແລ້ວ', 'คัดลอกแล้ว', 'Copié'),
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
