/**
 * Captures the real app screens used in the promo video.
 *
 * Real screens rather than mock-ups, for the same reason the video never promises an effect:
 * the film's whole argument is "look what it actually does", and a drawn approximation of a
 * screen would quietly make that a claim too.
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const APP_URL = process.env.PROMO_URL ?? 'http://127.0.0.1:4240/';
const OUT = new URL('./frames/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});
// 2x so the screens stay crisp when composited into a 1080-wide frame.
const page = await browser.newPage({
  viewport: { width: 390, height: 760 },
  deviceScaleFactor: 2,
  colorScheme: 'light',
});

const shot = async (name) => {
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${OUT}${name}.png` });
  console.log('captured', name);
};

await page.goto(APP_URL, { waitUntil: 'networkidle' });
await page.getByRole('button', { name: '한국어' }).click();
await page.waitForTimeout(200);
await shot('welcome');

// Straight to the hunt, which is the heart of the film.
await page.getByRole('button', { name: '네, 시작할게요' }).click();
await page.getByRole('button', { name: '당겨요' }).click();
await page.getByRole('button', { name: '얼굴', exact: true }).click();
await page.getByRole('button', { name: '다음' }).click();
await page.getByRole('button', { name: '가끔 그래요' }).click();
await page.getByRole('button', { name: '아침에' }).click();
await page.getByRole('button', { name: '다음' }).click();
await page.getByRole('button', { name: '햇빛 강한 날에만' }).click();
await page.getByRole('button', { name: '다음' }).click();
await page.waitForTimeout(300);

const giftCard = page.locator('.gift');
await giftCard.scrollIntoViewIfNeeded();
await shot('gift');
await page.evaluate(() => window.scrollTo(0, 0));

await page.getByRole('button', { name: '이제 레슨 보러 갈래요' }).click();
await page.getByRole('button', { name: '성분 찾기' }).click();
await page.waitForTimeout(400);
// Scroll past the rooms nav so the question and the list fill the frame. At 120 the nav took
// the top half of the shot and the game — the thing the cut is about — sat below the fold.
// Clearance is measured from whatever is actually pinned over the content, which is nothing
// now that the top bar scrolls with the page — but reading it rather than assuming it means
// this keeps framing correctly if that changes again.
const scrollTo = (selector) =>
  page.evaluate((sel) => {
    const target = document.querySelector(sel);
    if (!target) return;
    const bar = document.querySelector('.topbar');
    const pinned = bar && getComputedStyle(bar).position === 'sticky';
    const clearance = (pinned ? bar.getBoundingClientRect().height : 0) + 16;
    window.scrollTo(0, window.scrollY + target.getBoundingClientRect().top - clearance);
  }, selector);
await scrollTo('.says');
await shot('hunt-question');

const chips = page.locator('.inci__item');
const count = await chips.count();
for (const i of [0, 2]) if (i < count) await chips.nth(i).click();
await page.getByRole('button', { name: '확인하기' }).click();
await page.waitForTimeout(400);
await scrollTo('.inci');
await shot('hunt-reveal');

const show = page.getByRole('button', { name: '원본 기록 보기' }).first();
if (await show.count()) {
  await show.click();
  await page.waitForTimeout(300);
  await scrollTo('.hunt__reveal');
  await shot('record-open');
}

// Language chips, at the top.
await page.evaluate(() => window.scrollTo(0, 0));
await shot('languages');

await browser.close();
