/* Settings for the shared KOREA GLOW «Share + Like» part (public/kg_share_like.js, copied
 * unchanged from kg_common/parts/v1.2 — 11_IST owns it; do not edit the copy here).
 *
 * The shared link is always the real public address, https://app.korea-glow.com/ — never the
 * preview host — with the reader's language and, if she came in through a partner shop's link,
 * that shop's ?p= code, so the shop keeps the credit (see src/app/partner.ts). The part takes the
 * address as a string, so it is worked out here once, when the page loads.
 * A separate file rather than an inline <script>, so the page keeps working under script-src 'self'. */
(function () {
  'use strict';
  var OFFERED = ['en', 'ko', 'lo', 'th', 'fr'];
  var PARTNER_SHAPE = /^[A-Z0-9](?:[A-Z0-9]|-(?=[A-Z0-9])){2,15}$/;
  function read(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function offered(tag) {
    var base = String(tag || '').toLowerCase().split('-')[0];
    return OFFERED.indexOf(base) >= 0 ? base : null;
  }
  function partnerCode(raw) {
    var code = String(raw || '').trim().toUpperCase();
    return PARTNER_SHAPE.test(code) ? code : null;
  }
  var params;
  try { params = new URLSearchParams(window.location.search); } catch (e) { params = null; }
  var languages = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language]) || [];
  var lang = offered(params && params.get('lang')) || offered(read('korea-glow:locale:v1'));
  for (var i = 0; !lang && i < languages.length; i += 1) lang = offered(languages[i]);
  lang = lang || 'en';
  var partner = partnerCode(params && params.get('p')) || partnerCode(read('korea-glow:partner:v1'));
  var url = 'https://app.korea-glow.com/?lang=' + lang + (partner ? '&p=' + encodeURIComponent(partner) : '');
  window.KG_SHARE = {
    app: 'GLOW Class',
    url: url,
    lang: function () { return document.documentElement.lang || lang; },
    // Clears the app's bottom bar (64px + safe area) with room to spare.
    bottom: 80,
  };
})();
