import { describe, expect, it } from 'vitest';
import { installMode, isIosDevice } from '@/ui/install';

describe('home-screen install', () => {
  it('never offers to install an app that is already open from the home screen', () => {
    expect(installMode({ standalone: true, hasPrompt: true, ios: false })).toBe('installed');
    expect(installMode({ standalone: true, hasPrompt: false, ios: true })).toBe('installed');
  });

  it('uses the browser prompt when the browser gave us one', () => {
    expect(installMode({ standalone: false, hasPrompt: true, ios: false })).toBe('prompt');
  });

  it('falls back to iPhone instructions, then to the browser-menu hint', () => {
    expect(installMode({ standalone: false, hasPrompt: false, ios: true })).toBe('ios');
    expect(installMode({ standalone: false, hasPrompt: false, ios: false })).toBe('manual');
  });

  it('recognises iPhones and the iPads that report themselves as a Mac', () => {
    expect(isIosDevice('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)', 5)).toBe(true);
    expect(isIosDevice('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 5)).toBe(true);
    expect(isIosDevice('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 0)).toBe(false);
    expect(isIosDevice('Mozilla/5.0 (Linux; Android 14; Pixel 8)', 5)).toBe(false);
  });
});
