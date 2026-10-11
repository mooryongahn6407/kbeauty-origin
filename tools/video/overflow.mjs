import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'node:fs';
const { chromium } = pkg;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
for (const f of process.argv.slice(2)) {
  await page.goto('file:///tmp/claude-0/video/engine.html');
  await page.evaluate((s) => window.setup(s), JSON.parse(fs.readFileSync(f, 'utf8')));
  await page.evaluate(() => document.fonts.ready);
  const bad = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('.scene').forEach((n) => { n.style.opacity = 1; });
    document.querySelectorAll('.main,.sub,.t,.d,.small,.k').forEach((e) => {
      const r = document.createRange(); r.selectNodeContents(e);
      const rects = [...r.getClientRects()];
      const right = Math.max(...rects.map((x) => x.right));
      const box = e.getBoundingClientRect();
      if (right > box.right + 2 || right > 1075) out.push(e.textContent.slice(0, 40) + ' → ' + Math.round(right));
    });
    return out;
  });
  console.log(f, bad.length ? bad : 'OK');
}
await browser.close();
