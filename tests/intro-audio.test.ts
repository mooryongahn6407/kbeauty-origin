/**
 * Lumina Noy's recorded introduction (2026-10-18): one MP3 per sentence for ko/en/fr/th, Lao
 * screens play the Thai recording, a file that fails falls back to the device voice, and the
 * service worker keeps the files like other media.
 */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { INTRO_LINES } from '@/content/intro-script';
import { INTRO_AUDIO_COUNT, clipSafetyMs, introAudioUrl, subtitleMs } from '@/app/intro';
import { playClip, type ClipElement } from '@/ui/intro-audio';

const publicFile = (url: string) => resolve(__dirname, '../public', url.replace(/^\//, ''));

describe('which recording plays for which sentence', () => {
  it('has one file per sentence for every recorded language, and Lao uses the Thai one', () => {
    expect(INTRO_AUDIO_COUNT).toBe(INTRO_LINES.length);
    for (const lang of ['ko', 'en', 'fr', 'th']) {
      for (let n = 0; n < INTRO_LINES.length; n += 1) {
        const url = introAudioUrl(lang, n);
        expect(url).toBe(`/intro/audio/${lang}/${n + 1}.mp3`);
        expect(existsSync(publicFile(url!))).toBe(true);
        expect(statSync(publicFile(url!)).size).toBeGreaterThan(5_000);
      }
    }
    expect(introAudioUrl('lo', 2)).toBe('/intro/audio/th/3.mp3');
    expect(introAudioUrl('ko-KR', 0)).toBe('/intro/audio/ko/1.mp3');
    expect(introAudioUrl('fr_FR', 5)).toBe('/intro/audio/fr/6.mp3');
  });

  it('has no recording outside the script or for a language never recorded', () => {
    expect(introAudioUrl('ko', -1)).toBeNull();
    expect(introAudioUrl('ko', INTRO_LINES.length)).toBeNull();
    expect(introAudioUrl('ko', 1.5)).toBeNull();
    expect(introAudioUrl('vi', 0)).toBeNull();
    expect(introAudioUrl('', 0)).toBeNull();
  });

  it('was recorded from the exact sentences on screen (regenerate when a line changes)', () => {
    const manifest = JSON.parse(readFileSync(publicFile('/intro/audio/manifest.json'), 'utf8')) as {
      lines: Record<string, string[]>;
    };
    for (const lang of ['ko', 'en', 'fr', 'th']) {
      expect(manifest.lines[lang]).toEqual(INTRO_LINES.map((line) => (line as unknown as Record<string, string>)[lang]));
    }
  });

  it('waits for the clip’s own length, or generously before it is known', () => {
    expect(clipSafetyMs('abc', 12.5)).toBe(15_500);
    expect(clipSafetyMs('abc')).toBe(subtitleMs('abc') * 3 + 5000);
    expect(clipSafetyMs('abc', Number.NaN)).toBe(subtitleMs('abc') * 3 + 5000);
  });
});

class FakeAudio implements ClipElement {
  src = '';
  duration = Number.NaN;
  paused = true;
  private listeners = new Map<string, Set<() => void>>();
  constructor(private readonly playResult: () => Promise<void> | void = () => Promise.resolve()) {}
  play() {
    this.paused = false;
    return this.playResult();
  }
  pause() {
    this.paused = true;
  }
  addEventListener(type: string, listener: () => void) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type)!.add(listener);
  }
  removeEventListener(type: string, listener: () => void) {
    this.listeners.get(type)?.delete(listener);
  }
  fire(type: string) {
    for (const listener of [...(this.listeners.get(type) ?? [])]) listener();
  }
  count() {
    return [...this.listeners.values()].reduce((sum, set) => sum + set.size, 0);
  }
}

const handlers = () => ({ onEnd: vi.fn(), onBlocked: vi.fn(), onFail: vi.fn(), onDuration: vi.fn() });
const flush = () => new Promise((done) => setTimeout(done, 0));

describe('playing one recorded sentence', () => {
  it('moves the subtitle on when the clip ends, and reports its length', async () => {
    const audio = new FakeAudio();
    const h = handlers();
    playClip(audio, '/intro/audio/th/1.mp3', h);
    expect(audio.src).toBe('/intro/audio/th/1.mp3');
    audio.duration = 4.2;
    audio.fire('loadedmetadata');
    expect(h.onDuration).toHaveBeenCalledWith(4.2);
    audio.fire('ended');
    audio.fire('ended');
    expect(h.onEnd).toHaveBeenCalledTimes(1);
    expect(h.onFail).not.toHaveBeenCalled();
    expect(audio.count()).toBe(0);
  });

  it('falls back to the device voice when the file fails to load', async () => {
    const audio = new FakeAudio();
    const h = handlers();
    playClip(audio, '/intro/audio/ko/9.mp3', h);
    audio.fire('error');
    await flush();
    expect(h.onFail).toHaveBeenCalledTimes(1);
    expect(h.onEnd).not.toHaveBeenCalled();
  });

  it('falls back when the browser cannot play the file at all', async () => {
    const audio = new FakeAudio(() => Promise.reject(Object.assign(new Error('no'), { name: 'NotSupportedError' })));
    const h = handlers();
    playClip(audio, '/intro/audio/fr/1.mp3', h);
    await flush();
    expect(h.onFail).toHaveBeenCalledTimes(1);
    const throwing = new FakeAudio(() => {
      throw new Error('broken');
    });
    const h2 = handlers();
    playClip(throwing, '/intro/audio/fr/1.mp3', h2);
    expect(h2.onFail).toHaveBeenCalledTimes(1);
  });

  it('shows «Turn on sound» (not the fallback) when autoplay is blocked', async () => {
    const audio = new FakeAudio(() => Promise.reject(Object.assign(new Error('tap first'), { name: 'NotAllowedError' })));
    const h = handlers();
    playClip(audio, '/intro/audio/en/1.mp3', h);
    await flush();
    expect(h.onBlocked).toHaveBeenCalledTimes(1);
    expect(h.onFail).not.toHaveBeenCalled();
  });

  it('stopping it (skip, next line) pauses and silences every later event', async () => {
    const audio = new FakeAudio(() => Promise.reject(Object.assign(new Error('stopped'), { name: 'AbortError' })));
    const h = handlers();
    const stop = playClip(audio, '/intro/audio/en/2.mp3', h);
    stop();
    audio.fire('ended');
    audio.fire('error');
    await flush();
    expect(audio.paused).toBe(true);
    expect(h.onEnd).not.toHaveBeenCalled();
    expect(h.onFail).not.toHaveBeenCalled();
    expect(h.onBlocked).not.toHaveBeenCalled();
  });
});

describe('the intro uses the recordings', () => {
  const guide = readFileSync(resolve(__dirname, '../src/ui/components/IntroGuide.tsx'), 'utf8');
  it('plays the file first, falls back to the device voice, and keeps Skip and «don’t play»', () => {
    expect(guide).toContain('introAudioUrl(locale, index)');
    expect(guide).toContain('playClip(');
    expect(guide).toContain('setRecording(false)');
    expect(guide).toContain('speakLocalized(line, locale');
    expect(guide).toContain("t('introSkip', locale)");
    expect(guide).toContain("t('introNoAuto', locale)");
    expect(guide).toContain("t('introSound', locale)");
  });

  it('the service worker keeps mp3 files like other media, answering byte ranges', () => {
    const sw = readFileSync(resolve(__dirname, '../public/sw.js'), 'utf8');
    expect(sw).toMatch(/mp3/);
    expect(sw).toContain('audioResponse(request)');
    expect(sw).toContain('status: 206');
  });
});
