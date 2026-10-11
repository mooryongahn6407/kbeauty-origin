import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire('/tmp/claude-0/video/package.json');
const FF = require('@ffmpeg-installer/ffmpeg').path;
const { chromium } = pkg;
const [specFile, out] = process.argv.slice(2);
const spec = JSON.parse(fs.readFileSync(specFile, 'utf8'));
const dir = `/tmp/claude-0/video/render-${spec.name}`; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto('file:///tmp/claude-0/video/engine.html');
const total = await page.evaluate((s) => window.setup(s), spec);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(500);
const fps = 30, n = Math.round(total * fps);
for (let i = 0; i < n; i++) {
  await page.evaluate((t) => window.frame(t), i / fps);
  await page.screenshot({ path: `${dir}/${String(i).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 92 });
}
await browser.close();
execFileSync(FF, ['-loglevel', 'error', '-y', '-framerate', String(fps), '-i', `${dir}/%05d.jpg`, '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo', '-shortest', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-movflags', '+faststart', out]);
fs.rmSync(dir, { recursive: true, force: true });
console.log('rendered', out, n, 'frames', total, 's');
