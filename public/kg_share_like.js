/* KG 공용 «공유 + 좋아요(하트)» 1.0.0 — 11_IST 2026-10-18. 대표이사 10/18 직접 지시:
   «외부에서 쓰는 모든 앱에 잘 보이게 WhatsApp 공유 버튼 · 친절하고 예의 바른 공유 부탁 문구 · 가끔 중간에 공유 부탁 ·
    유튜브처럼 하트(좋아요)를 누르면 하트가 뜨고 그게 나의 WhatsApp 으로 오게». 직원용·내부 앱에는 붙이지 않는다.
   · 오른쪽 아래 둥근 단추 2개: ♥ 좋아요 · 공유(WhatsApp 초록). 화면을 가리지 않게 작게, 손가락 48px.
   · 공유: «WhatsApp으로 공유»(가장 크게) · «다른 곳에 공유»(폰 공유창) · «링크 복사».
   · 하트: 누르면 하트가 퐁퐁 떠오르고 빨갛게 채워짐 → «응원 한마디를 WhatsApp으로 보내 주시겠어요?» →
     회사 WhatsApp Business(+856 20 96363944)로 «❤️ 좋아요» 메시지가 미리 채워진 채 열림(손님이 «보내기»만 누르면 대표님 WhatsApp 에 도착).
   · 가끔 부탁: 앱이 «첫 성공» 순간에 KGShare.ask() 를 부르거나, 3분 넘게 쓰면 자동 1번. 3일에 1번까지만(귀찮게 하지 않는다).
   · 안내자 음성 대본에 넣을 문장: KGShare.line(lang) — «마음에 드시면 친구분들께 공유 부탁드려요» 한 줄.
   쓰는 법: <script>window.KG_SHARE = { app: 'GLOW Class', lang: () => 'ko' };<\/script><script src="kg_share_like.js" defer><\/script>
   설정: app(앱 이름) · url(공유할 주소, 기본 지금 주소에서 ?·# 뺀 것) · lang · dock('br'|'bl'|false — false 면 단추를 안 띄우고 앱이 KGShare.open() 을 부름)
         · autoAskMs(기본 180000, 0 이면 자동 부탁 안 함) · bottom(단추 아래 여백 px, 앱 아래 메뉴와 겹치면 키움) · wa(받는 번호)
   ⚠ 라오어·태국어 문장은 원어민(Ammy) 확인 전 «1차본» — 05_지시서 KG-SHARE 표준의 확인표에 적는다. */
(function () {
  'use strict';
  if (window.KGShare) return;
  const C = Object.assign({ app: document.title || 'KOREA GLOW', url: '', lang: () => document.documentElement.lang || 'en', dock: 'br',
    autoAskMs: 180000, bottom: 16, wa: '8562096363944', enabled: true }, window.KG_SHARE || {});
  if (!C.enabled) return;
  const T = {
    ko: { share: '공유', like: '좋아요', wa: 'WhatsApp으로 공유', more: '다른 곳에 공유', copy: '링크 복사', copied: '복사했어요',
      askT: '이 앱이 마음에 드셨나요?', askB: '마음에 드셨다면 가족·친구분들께 공유 부탁드립니다. 저희에게 정말 큰 힘이 됩니다. 고맙습니다!',
      later: '다음에 할게요', close: '닫기', heartT: '좋아요, 고맙습니다! ❤️', heartB: '응원 한마디를 WhatsApp으로 보내 주시겠어요? «보내기»만 누르시면 됩니다.',
      heartGo: 'WhatsApp으로 응원 보내기', msg: '제가 쓰는 앱인데 좋아서 보내요 👉', likeMsg: '❤️ 좋아요!', line: '마음에 드시면 친구분들께 공유 부탁드려요. 오른쪽 아래 공유 단추를 누르시면 돼요.' },
    en: { share: 'Share', like: 'Like', wa: 'Share on WhatsApp', more: 'More ways to share', copy: 'Copy link', copied: 'Link copied',
      askT: 'Enjoying this app?', askB: "If you like it, we'd be so grateful if you shared it with your friends and family. It really helps us. Thank you!",
      later: 'Maybe later', close: 'Close', heartT: 'Thank you for the like! ❤️', heartB: 'Would you send us a few kind words on WhatsApp? Just tap «Send».',
      heartGo: 'Send love on WhatsApp', msg: "I've been using this app and thought you'd like it 👉", likeMsg: '❤️ I like it!', line: "If you enjoy it, please share it with your friends — just tap the share button at the bottom right." },
    fr: { share: 'Partager', like: "J'aime", wa: 'Partager sur WhatsApp', more: 'Autres façons de partager', copy: 'Copier le lien', copied: 'Lien copié',
      askT: 'Cette application vous plaît ?', askB: 'Si elle vous plaît, nous vous serions très reconnaissants de la partager avec vos proches. Cela nous aide beaucoup. Merci !',
      later: 'Plus tard', close: 'Fermer', heartT: "Merci pour votre « J'aime » ! ❤️", heartB: 'Voulez-vous nous envoyer un petit mot sur WhatsApp ? Il suffit d’appuyer sur « Envoyer ».',
      heartGo: 'Envoyer un mot sur WhatsApp', msg: "J'utilise cette appli et je pense qu'elle te plaira 👉", likeMsg: "❤️ J'aime !", line: "Si l'application vous plaît, partagez-la avec vos proches : le bouton de partage est en bas à droite." },
    lo: { share: 'ແບ່ງປັນ', like: 'ຖືກໃຈ', wa: 'ແບ່ງປັນທາງ WhatsApp', more: 'ແບ່ງປັນທາງອື່ນ', copy: 'ສຳເນົາລິ້ງ', copied: 'ສຳເນົາແລ້ວ',
      askT: 'ທ່ານມັກແອັບນີ້ບໍ່?', askB: 'ຖ້າທ່ານມັກ ກະລຸນາແບ່ງປັນໃຫ້ຄອບຄົວ ແລະ ໝູ່ເພື່ອນນຳແດ່ ມັນຊ່ວຍພວກເຮົາໄດ້ຫຼາຍ ຂອບໃຈຫຼາຍໆ!',
      later: 'ໄວ້ເທື່ອໜ້າ', close: 'ປິດ', heartT: 'ຂອບໃຈທີ່ຖືກໃຈ! ❤️', heartB: 'ສົ່ງກຳລັງໃຈຫາພວກເຮົາທາງ WhatsApp ໄດ້ບໍ່? ພຽງແຕ່ກົດ «ສົ່ງ».',
      heartGo: 'ສົ່ງກຳລັງໃຈທາງ WhatsApp', msg: 'ແອັບນີ້ດີຫຼາຍ ລອງໃຊ້ເບິ່ງເດີ 👉', likeMsg: '❤️ ຖືກໃຈ!', line: 'ຖ້າມັກ ກະລຸນາແບ່ງປັນໃຫ້ໝູ່ເພື່ອນແດ່ ກົດປຸ່ມແບ່ງປັນຢູ່ລຸ່ມເບື້ອງຂວາ.' },
    th: { share: 'แชร์', like: 'ถูกใจ', wa: 'แชร์ทาง WhatsApp', more: 'แชร์ช่องทางอื่น', copy: 'คัดลอกลิงก์', copied: 'คัดลอกแล้ว',
      askT: 'ชอบแอปนี้ไหมคะ?', askB: 'ถ้าชอบ รบกวนช่วยแชร์ให้ครอบครัวและเพื่อน ๆ ด้วยนะคะ ช่วยเราได้มากจริง ๆ ขอบคุณมากค่ะ!',
      later: 'ไว้คราวหน้า', close: 'ปิด', heartT: 'ขอบคุณที่กดถูกใจค่ะ! ❤️', heartB: 'ส่งกำลังใจให้เราทาง WhatsApp ได้ไหมคะ? แค่กด «ส่ง» ค่ะ',
      heartGo: 'ส่งกำลังใจทาง WhatsApp', msg: 'แอปนี้ดีมาก ลองใช้ดูนะ 👉', likeMsg: '❤️ ถูกใจ!', line: 'ถ้าชอบ ช่วยแชร์ให้เพื่อน ๆ ด้วยนะคะ กดปุ่มแชร์ที่มุมขวาล่างได้เลยค่ะ' },
    zh: { share: '分享', like: '点赞', wa: '通过 WhatsApp 分享', more: '其他分享方式', copy: '复制链接', copied: '已复制',
      askT: '喜欢这个应用吗？', askB: '如果您喜欢，恳请分享给家人和朋友。这对我们帮助很大，非常感谢！',
      later: '以后再说', close: '关闭', heartT: '感谢点赞！❤️', heartB: '愿意通过 WhatsApp 给我们留一句鼓励吗？只需点「发送」。',
      heartGo: '通过 WhatsApp 发送鼓励', msg: '我在用这个应用，觉得你也会喜欢 👉', likeMsg: '❤️ 点赞！', line: '如果喜欢，请分享给朋友——点右下角的分享按钮即可。' },
  };
  const L = l => { l = l || (C.lang && C.lang()) || 'en'; l = String(l).slice(0, 2); return T[l] ? l : 'en'; };
  const t = k => T[L()][k];
  const store = { get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  const K = 'kgshare:' + C.app;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const url = () => C.url || (location.origin + location.pathname);
  const WA_ICON = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1.1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.6-.4Z"/></svg>';
  const SHARE_ICON = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>';
  const HEART = f => '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="' + (f ? '#C8102E' : 'none') + '" stroke="#C8102E" stroke-width="2" stroke-linejoin="round" d="M12 21s-7.5-4.6-9.5-9.2C1 8.3 3.2 4.5 7 4.5c2.1 0 3.6 1.2 5 3 1.4-1.8 2.9-3 5-3 3.8 0 6 3.8 4.5 7.3C19.5 16.4 12 21 12 21Z"/></svg>';
  const CSS = '.kgs-dock{position:fixed;z-index:2147481000;display:flex;flex-direction:column;gap:10px;right:14px}' +
    '.kgs-dock.bl{right:auto;left:14px}' +
    '.kgs-b{width:52px;height:52px;border-radius:50%;border:0;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 3px 12px rgba(13,27,62,.25);-webkit-tap-highlight-color:transparent;position:relative}' +
    '.kgs-like{background:#FFFDF9;color:#C8102E}.kgs-share{background:#25D366;color:#fff}' +
    '.kgs-b:focus-visible{outline:3px solid #C9923A;outline-offset:2px}' +
    '.kgs-n{position:absolute;top:-4px;right:-4px;min-width:20px;height:20px;padding:0 5px;border-radius:10px;background:#C8102E;color:#fff;font:700 12px/20px system-ui,sans-serif;text-align:center}' +
    '.kgs-fly{position:fixed;z-index:2147481500;pointer-events:none;font-size:26px;animation:kgsUp 1.4s ease-out forwards}' +
    '@keyframes kgsUp{0%{opacity:1;transform:translate(0,0) scale(.6)}100%{opacity:0;transform:translate(var(--dx),-160px) scale(1.3)}}' +
    '.kgs-back{position:fixed;inset:0;z-index:2147481800;background:rgba(13,27,62,.5);display:flex;align-items:flex-end;justify-content:center;padding:12px}' +
    '@media(min-width:600px){.kgs-back{align-items:center}}' +
    '.kgs-card{width:100%;max-width:420px;background:#FFFDF9;color:#0D1B3E;border-radius:22px;padding:22px 18px 16px;box-shadow:0 8px 28px rgba(13,27,62,.28);font:18px/1.5 system-ui,-apple-system,"Segoe UI","Noto Sans","Noto Sans Lao","Leelawadee UI",sans-serif}' +
    '.kgs-card h3{margin:0 0 6px;font-size:20px;line-height:1.35}.kgs-card p{margin:0 0 14px;font-size:17px;color:#33405e}' +
    '.kgs-a{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;min-height:52px;margin:0 0 10px;border:0;border-radius:14px;font-family:inherit;font-weight:700;font-size:18px;line-height:1.2;cursor:pointer;text-decoration:none}' +
    '.kgs-wa{background:#25D366;color:#fff}.kgs-sec{background:#F3ECE1;color:#0D1B3E}.kgs-ghost{background:transparent;color:#5b6680;font-weight:600;min-height:44px;margin:0}' +
    '@media(prefers-reduced-motion:reduce){.kgs-fly{animation:none;display:none}}';
  let dockEl, likeBtn, open = false;
  function css() { if (document.getElementById('kgs-css')) return; const s = document.createElement('style'); s.id = 'kgs-css'; s.textContent = CSS; document.head.appendChild(s); }
  function sheet(html, onReady) {
    if (open && document.querySelector('.kgs-back')) return null; open = true; css();
    const b = document.createElement('div'); b.className = 'kgs-back'; b.setAttribute('role', 'dialog'); b.setAttribute('aria-modal', 'true');
    b.innerHTML = '<div class="kgs-card">' + html + '</div>';
    const close = () => { b.remove(); open = false; };
    b.addEventListener('click', e => { if (e.target === b || e.target.closest('[data-kgs-close]')) close(); });
    document.addEventListener('keydown', function k(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', k); } });
    document.body.appendChild(b); onReady && onReady(b, close);
    const f = b.querySelector('.kgs-a'); f && f.focus();
    return b;
  }
  const waShare = () => 'https://wa.me/?text=' + encodeURIComponent(t('msg') + ' ' + C.app + '\n' + url());
  const waLike = () => 'https://wa.me/' + C.wa + '?text=' + encodeURIComponent(t('likeMsg') + ' — ' + C.app + '\n' + url());
  function shareSheet(withAsk) {
    const head = withAsk ? '<h3>' + esc(t('askT')) + '</h3><p>' + esc(t('askB')) + '</p>' : '<h3>' + esc(t('share')) + ' · ' + esc(C.app) + '</h3><p>' + esc(t('askB')) + '</p>';
    sheet(head +
      '<a class="kgs-a kgs-wa" target="_blank" rel="noopener" href="' + esc(waShare()) + '" data-kgs-close>' + WA_ICON + esc(t('wa')) + '</a>' +
      (navigator.share ? '<button class="kgs-a kgs-sec" data-kgs-more>' + SHARE_ICON + esc(t('more')) + '</button>' : '') +
      '<button class="kgs-a kgs-sec" data-kgs-copy>' + esc(t('copy')) + '</button>' +
      '<button class="kgs-a kgs-ghost" data-kgs-close>' + esc(withAsk ? t('later') : t('close')) + '</button>', (b, close) => {
      const m = b.querySelector('[data-kgs-more]');
      m && m.addEventListener('click', () => { navigator.share({ title: C.app, text: t('msg'), url: url() }).catch(() => {}); close(); });
      b.querySelector('[data-kgs-copy]').addEventListener('click', e => {
        const done = () => { e.target.textContent = t('copied'); setTimeout(close, 900); };
        (navigator.clipboard ? navigator.clipboard.writeText(url()) : Promise.reject()).then(done, () => { prompt(t('copy'), url()); close(); });
      });
    });
    store.set(K + ':asked', String(Date.now()));
  }
  function burst(from) {
    const r = from.getBoundingClientRect();
    for (let i = 0; i < 7; i++) {
      const h = document.createElement('div'); h.className = 'kgs-fly'; h.textContent = '❤';
      h.style.cssText = 'left:' + (r.left + r.width / 2 - 12) + 'px;top:' + (r.top - 6) + 'px;color:#C8102E;--dx:' + Math.round((Math.random() - .5) * 90) + 'px;animation-delay:' + (i * 90) + 'ms';
      document.body.appendChild(h); setTimeout(() => h.remove(), 1700 + i * 90);
    }
  }
  function like(btn) {
    btn = btn || likeBtn;
    const n = +store.get(K + ':likes', 0) + 1; store.set(K + ':likes', String(n));
    if (btn) { burst(btn); btn.innerHTML = HEART(true) + '<span class="kgs-n">' + n + '</span>'; btn.setAttribute('aria-pressed', 'true'); }
    const day = new Date().toISOString().slice(0, 10);
    if (store.get(K + ':likeAsk', '') === day) return;   // 응원 메시지 부탁은 하루 1번
    store.set(K + ':likeAsk', day);
    setTimeout(() => sheet('<h3>' + esc(t('heartT')) + '</h3><p>' + esc(t('heartB')) + '</p>' +
      '<a class="kgs-a kgs-wa" target="_blank" rel="noopener" href="' + esc(waLike()) + '" data-kgs-close>' + WA_ICON + esc(t('heartGo')) + '</a>' +
      '<button class="kgs-a kgs-ghost" data-kgs-close>' + esc(t('later')) + '</button>'), 900);
  }
  function ask(force) {
    const last = +store.get(K + ':asked', 0);
    if (!force && Date.now() - last < 3 * 864e5) return false;   // 3일에 1번까지만
    shareSheet(true); return true;
  }
  function dock() {
    if (!C.dock || dockEl) return; css();
    dockEl = document.createElement('div'); dockEl.className = 'kgs-dock' + (C.dock === 'bl' ? ' bl' : ''); dockEl.setAttribute('data-kg-share', '1');
    dockEl.style.bottom = 'calc(' + (+C.bottom || 16) + 'px + env(safe-area-inset-bottom, 0px))';
    const n = +store.get(K + ':likes', 0);
    dockEl.innerHTML = '<button class="kgs-b kgs-like" aria-label="' + esc(t('like')) + '" aria-pressed="' + (n ? 'true' : 'false') + '">' + HEART(n > 0) + (n ? '<span class="kgs-n">' + n + '</span>' : '') + '</button>' +
      '<button class="kgs-b kgs-share" aria-label="' + esc(t('wa')) + '">' + WA_ICON + '</button>';
    likeBtn = dockEl.children[0];
    likeBtn.addEventListener('click', () => like(likeBtn));
    dockEl.children[1].addEventListener('click', () => shareSheet(false));
    document.body.appendChild(dockEl);
  }
  function start() {
    document.documentElement.setAttribute('data-kg-share', '1.0.0');
    dock();
    if (+C.autoAskMs > 0) setTimeout(() => { if (!document.querySelector('.kgd-back,.kgs-back,[role=dialog][aria-modal=true]')) ask(false); }, +C.autoAskMs);
  }
  window.KGShare = { version: '1.0.0', open: () => shareSheet(false), ask: f => ask(!!f), like: () => like(), line: l => T[L(l)].line, url, texts: T,
    relabel() { if (dockEl) { dockEl.remove(); dockEl = null; dock(); } } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
