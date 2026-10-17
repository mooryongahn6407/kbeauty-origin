/**
 * "Delete my data on this phone" removes everything the app keeps, and nothing else.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { LOCAL_STORAGE_KEYS, SESSION_STORAGE_KEYS, clearDeviceData } from '@/app/device-data';
import { CHROME } from '@/ui/chrome-text';

const SRC = fileURLToPath(new URL('../src', import.meta.url));

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx)$/.test(name) ? [path] : [];
  });

const fakeStore = (initial: Record<string, string>, opts: { failOn?: string } = {}) => {
  const data = new Map(Object.entries(initial));
  return {
    data,
    get length() {
      return data.size;
    },
    key: (index: number) => [...data.keys()][index] ?? null,
    removeItem: (key: string) => {
      if (key === opts.failOn) throw new Error('blocked');
      data.delete(key);
    },
  };
};

describe('the list covers every storage key the code writes', () => {
  it('names every korea-glow key literal found under src/', () => {
    const found = new Set<string>();
    for (const file of sourceFiles(SRC)) {
      if (file.endsWith('device-data.ts')) continue;
      const text = readFileSync(file, 'utf8');
      for (const match of text.matchAll(/'(korea-glow[:.][^']+)'/g)) found.add(match[1]!);
    }
    expect(found.size).toBeGreaterThan(10);
    const listed = new Set([...LOCAL_STORAGE_KEYS, ...SESSION_STORAGE_KEYS]);
    for (const key of found) expect(listed, key).toContain(key);
  });

  it('includes the care-quest answers, history and mastery', () => {
    expect(LOCAL_STORAGE_KEYS).toEqual(
      expect.arrayContaining([
        'korea-glow:care-quest:v1',
        'korea-glow:care-quest:history:v1',
        'korea-glow:mastery:v1',
        'korea-glow:collection:v1',
        'korea-glow.display',
      ]),
    );
  });
});

describe('clearing', () => {
  it('removes every app key from both stores and leaves other keys alone', () => {
    const local = fakeStore({
      'korea-glow:care-quest:v1': '{"pregnant":true}',
      'korea-glow:mastery:v1': '{}',
      'korea-glow:future-thing:v9': 'x',
      'someone-else': 'keep',
    });
    const session = fakeStore({ 'korea-glow:partner-report-key': 'k', other: 'keep' });
    clearDeviceData(local, session);
    expect([...local.data.keys()]).toEqual(['someone-else']);
    expect([...session.data.keys()]).toEqual(['other']);
  });

  it('keeps going when one key cannot be removed', () => {
    const local = fakeStore(
      { 'korea-glow:care-quest:v1': 'a', 'korea-glow:mastery:v1': 'b' },
      { failOn: 'korea-glow:care-quest:v1' },
    );
    expect(() => clearDeviceData(local, undefined)).not.toThrow();
    expect(local.data.has('korea-glow:mastery:v1')).toBe(false);
  });

  it('does nothing harmful without storage', () => {
    expect(clearDeviceData(undefined, undefined)).toBe(0);
  });
});

describe('the settings action is labelled and confirmed in all five languages', () => {
  const keys = ['sData', 'sDataNote', 'sDelete', 'sDeleteConfirm', 'sDeleteYes', 'sDeleteNo'] as const;

  it('has text for ko, en, lo, th and fr', () => {
    for (const key of keys) {
      const entry = CHROME[key]!;
      for (const locale of ['ko', 'en', 'lo', 'th', 'fr'] as const) {
        expect(entry[locale], `${key}.${locale}`).toBeTruthy();
      }
    }
  });

  it('is wired into the settings sheet with a confirm step before clearing', () => {
    const chrome = readFileSync(join(SRC, 'ui/components/AppChrome.tsx'), 'utf8');
    const app = readFileSync(join(SRC, 'ui/App.tsx'), 'utf8');
    expect(app).toContain('<DeleteMyData locale={locale} />');
    const confirmAt = chrome.indexOf("t('sDeleteConfirm', locale)");
    const clearAt = chrome.indexOf('clearDeviceData(local, session)');
    expect(confirmAt).toBeGreaterThan(0);
    expect(clearAt).toBeGreaterThan(confirmAt);
    expect(chrome).toContain('window.location.reload()');
  });
});
