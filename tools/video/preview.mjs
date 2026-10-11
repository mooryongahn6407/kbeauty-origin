import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'node:fs';
const { chromium } = pkg;
const [specFile, outPrefix, ...times] = process.argv.slice(2);
const spec = JSON.parse(fs.readFileSync(specFile, 'utf8'));
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto('file:///tmp/claude-0/video/engine.html');
await page.evaluate((s) => window.setup(s), spec);
await page.evaluate(() => document.fonts.ready);
for (const t of times) { await page.evaluate((t) => window.frame(t), Number(t)); await page.waitForTimeout(150); await page.evaluate((t) => window.frame(t), Number(t)); await page.screenshot({ path: `${outPrefix}-${t}.jpg`, type: 'jpeg', quality: 80 }); }
await browser.close();
