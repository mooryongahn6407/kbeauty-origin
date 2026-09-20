/**
 * Renders the promo film: captures each cut, then assembles them with ffmpeg.
 *
 * Nothing here costs money. The cuts are HTML, the screens are the real app, ffmpeg comes from
 * npm, and the subtitles are burned into the frames so the film carries its own words wherever
 * it is forwarded — which in Laos is usually a messaging app, not a video platform.
 *
 * The two tools this needs are deliberately NOT project dependencies: a learning app should not
 * make every contributor and every CI run download Playwright and an ffmpeg binary to install
 * it. Before rendering, once:
 *
 *   npm i --no-save playwright-core @ffmpeg-installer/ffmpeg
 */
import { chromium } from 'playwright-core';
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

// ffmpeg comes from npm rather than the system: apt cannot reach the Ubuntu mirrors from this
// environment, and the npm registry can.
const ffmpegPath = createRequire(import.meta.url)('@ffmpeg-installer/ffmpeg').path;

const HERE = new URL('.', import.meta.url).pathname;
const CUTS = `${HERE}cuts/`;
mkdirSync(CUTS, { recursive: true });

/** Seconds each cut holds. Matches the shot list in docs/PROMO_VIDEO_SCRIPT_KO.md. */
const HOLD = [5, 5, 5, 6, 6, 8, 7, 6, 5, 5, 4];

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto(`file://${HERE}slides.html`, { waitUntil: 'networkidle' });

const ids = await page.evaluate(() =>
  [...document.querySelectorAll('.slide')].map((slide) => slide.id),
);
if (ids.length !== HOLD.length) {
  throw new Error(`${ids.length} cuts in the HTML but ${HOLD.length} durations listed`);
}

for (const [index, id] of ids.entries()) {
  await page.locator(`#${id}`).screenshot({ path: `${CUTS}${String(index + 1).padStart(2, '0')}.png` });
  console.log('cut', id);
}
await browser.close();

// One entry per cut, held for its own duration. The last frame is repeated because ffmpeg's
// concat demuxer ignores the final duration otherwise and the closing card would flash past.
const list = ids
  .map((_, index) => {
    const file = `${CUTS}${String(index + 1).padStart(2, '0')}.png`;
    return `file '${file}'\nduration ${HOLD[index]}`;
  })
  .join('\n');
const lastFile = `${CUTS}${String(ids.length).padStart(2, '0')}.png`;
writeFileSync(`${HERE}cuts.txt`, `${list}\nfile '${lastFile}'\n`);

const out = `${HERE}korea-glow-skin-quest-ko.mp4`;
execFileSync(
  ffmpegPath,
  [
    '-y',
    '-f', 'concat', '-safe', '0', '-i', `${HERE}cuts.txt`,
    // yuv420p and an even frame size, so the file plays on phones and in messaging apps
    // rather than only in a desktop player.
    '-vf', 'fps=30,format=yuv420p',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '20',
    '-movflags', '+faststart',
    out,
  ],
  { stdio: 'inherit' },
);
console.log('\nwrote', out);
