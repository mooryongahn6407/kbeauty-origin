import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire('/tmp/claude-0/video/package.json');
const FF = require('@ffmpeg-installer/ffmpeg').path;
const { chromium } = pkg;
const OUT = '/tmp/claude-0/video/clips';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
async function clip(name, lang, url, script) {
  const dir = `${OUT}/${name}`; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: lang, exact: true }).click();
  await page.waitForTimeout(500);
  let n = 0;
  const shot = async () => { const f = `${dir}/${String(n++).padStart(5, '0')}.png`; await page.screenshot({ path: f }); return f; };
  const hold = async (frames) => { const f = await shot(); for (let i = 1; i < frames; i++) fs.copyFileSync(f, `${dir}/${String(n++).padStart(5, '0')}.png`); };
  const scroll = async (px, frames) => { for (let i = 0; i < frames; i++) { await page.evaluate((d) => window.scrollBy(0, d), px / frames); await shot(); } };
  await script(page, { hold, scroll });
  await ctx.close();
  execFileSync(FF, ['-loglevel', 'error', '-y', '-framerate', '30', '-i', `${dir}/%05d.png`, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', `${OUT}/${name}.mp4`]);
  fs.rmSync(dir, { recursive: true, force: true });
  console.log('clip', name, n, 'frames');
}
const base = 'http://127.0.0.1:4173/';
for (const [code, lang] of [['ko', '한국어'], ['lo', 'ລາວ']]) {
  await clip(`product-${code}`, lang, base + '?product=KG-CRM-00001', async (p, { hold, scroll }) => {
    await p.locator('.store-product__photo').scrollIntoViewIfNeeded(); await p.waitForTimeout(800); await p.evaluate(() => window.scrollBy(0, -80));
    await hold(36); await scroll(1500, 150); await hold(20);
  });
  await clip(`quest-${code}`, lang, base, async (p, { hold }) => {
    await p.waitForTimeout(800); await hold(45);
    await p.locator('.quest .btn').first().click(); await p.waitForTimeout(600); await hold(40);
    for (let i = 0; i < 2; i++) { await p.locator('.option').nth(i).hover(); await p.locator('.option').nth(i).click(); await p.waitForTimeout(500); await hold(36); }
  });
  await clip(`guide-${code}`, lang, base, async (p, { hold, scroll }) => {
    await p.locator('.guide-entry').click(); await p.waitForTimeout(1200); await hold(40); await scroll(1500, 140); await hold(15);
  });
  await clip(`dict-${code}`, lang, base, async (p, { hold, scroll }) => {
    await p.locator('.guide-entry').click(); await p.waitForTimeout(400); await p.locator('.guide-card').nth(1).click(); await p.waitForTimeout(900);
    await p.evaluate(() => window.scrollTo(0, 230)); await hold(36);
    await p.locator('.dict-card').nth(1).click(); await p.waitForTimeout(900); await p.evaluate(() => window.scrollTo(0, 230)); await hold(30); await scroll(1300, 120); await hold(15);
  });
  await clip(`shopqr-${code}`, lang, base, async (p, { hold }) => {
    await p.locator('.guide-entry').click(); await p.waitForTimeout(300); await p.locator('.guide-card').nth(0).click(); await p.waitForTimeout(500);
    await p.locator('.store-shopqr summary').scrollIntoViewIfNeeded(); await p.locator('.store-shopqr summary').click(); await p.waitForTimeout(400);
    await p.evaluate(() => document.querySelector('.store-shopqr').scrollIntoView({ block: 'start' })); await hold(20);
    for (const ch of 'VTE-01') { await p.locator('#shop-qr-code').type(ch); await p.waitForTimeout(80); await hold(6); }
    await p.waitForTimeout(400); await hold(60);
  });
}
await browser.close();
