/**
 * The Share sheet always sends the real public address, in the reader's language, keeping the
 * partner shop's code so the shop keeps the credit — and never a count of shares.
 */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  PUBLIC_APP_URL,
  SHARE_TITLE,
  facebookShareHref,
  publicShareUrl,
  whatsappShareHref,
} from '@/app/share';
import { CHROME } from '@/ui/chrome-text';
import { ShareSheet } from '@/ui/components/LikeShare';

const LOCALES = ['ko', 'en', 'lo', 'th', 'fr'] as const;

describe('the shared link', () => {
  it('is always app.korea-glow.com, never the preview host', () => {
    expect(PUBLIC_APP_URL).toBe('https://app.korea-glow.com/');
    for (const locale of LOCALES) {
      const url = new URL(publicShareUrl(locale, null));
      expect(url.origin).toBe('https://app.korea-glow.com');
      expect(url.searchParams.get('lang')).toBe(locale);
      expect(url.searchParams.has('p')).toBe(false);
    }
    expect(publicShareUrl('ko', null)).not.toMatch(/glow-next|localhost|netlify|workers\.dev/);
    expect(SHARE_TITLE).toBe('GLOW Class · KOREA GLOW');
  });

  it('keeps a well-formed partner code and drops a malformed one', () => {
    expect(new URL(publicShareUrl('lo', 'vte-01')).searchParams.get('p')).toBe('VTE-01');
    expect(publicShareUrl('lo', 'VTE-01')).toBe('https://app.korea-glow.com/?lang=lo&p=VTE-01');
    expect(new URL(publicShareUrl('lo', '<script>')).searchParams.has('p')).toBe(false);
    expect(new URL(publicShareUrl('x-bad', null)).searchParams.has('lang')).toBe(false);
  });

  it('WhatsApp carries the note and the link; Facebook carries the link', () => {
    const url = publicShareUrl('th', 'SALON7');
    const wa = new URL(whatsappShareHref('สวัสดี', url));
    expect(wa.origin).toBe('https://wa.me');
    expect(wa.searchParams.get('text')).toBe(`สวัสดี\n${url}`);
    const fb = new URL(facebookShareHref(url));
    expect(fb.href.startsWith('https://www.facebook.com/sharer/sharer.php?u=')).toBe(true);
    expect(fb.searchParams.get('u')).toBe(url);
  });
});

describe('the Share sheet', () => {
  it('carries the owner’s Korean wording, and a translation in every other language', () => {
    expect(CHROME.shareMessage!.ko).toBe(
      '이 앱이 마음에 드시고 도움이 되셨다면 공유를 부탁드려요. 아는 분들이나 친구분들께 많이 알려 주시면 정말 감사하겠습니다.',
    );
    for (const key of ['like', 'share', 'shareTitle', 'shareMessage', 'shareCopy', 'shareCopied', 'helpful'] as const) {
      for (const locale of LOCALES) expect(CHROME[key]![locale], `${key}.${locale}`).toBeTruthy();
    }
    for (const locale of ['en', 'lo', 'th', 'fr'] as const) {
      expect(CHROME.shareMessage![locale]).not.toMatch(/[가-힣]/);
    }
  });

  it('offers WhatsApp, Facebook, copy and close — with no share count anywhere', () => {
    for (const locale of LOCALES) {
      const html = renderToStaticMarkup(createElement(ShareSheet, { locale, onClose: () => undefined }));
      expect(html).toContain('https://wa.me/?text=');
      expect(html).toContain('https://www.facebook.com/sharer/sharer.php?u=');
      expect(html).toContain(encodeURIComponent(`https://app.korea-glow.com/?lang=${locale}`));
      expect(html).toContain('rel="noopener noreferrer"');
      expect(html).toContain(CHROME.shareCopy![locale]!.replace(/'/g, '&#x27;'));
      expect(html).toContain(CHROME.close![locale]!.replace(/'/g, '&#x27;'));
      expect(html).not.toMatch(/\d+\s*(shares|번 공유)/i);
    }
  });
});
