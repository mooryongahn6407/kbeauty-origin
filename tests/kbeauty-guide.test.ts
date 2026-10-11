/**
 * K-Beauty consumer guide — shape and wording gates.
 *
 * The guide is plain-language background, not governed evidence. These tests keep it complete
 * in all three languages, aligned with the store's 15 category keys, and free of medical
 * "cure/treat/heal" wording in any language.
 */
import { describe, expect, it } from 'vitest';
import {
  ANTI_AGING_TERMS,
  CATEGORY_GUIDES,
  GUIDE_SOURCES,
  ROUTINE,
  SUN_CARE,
  WHY_KBEAUTY,
  WHY_SO_MANY_CATEGORIES,
  type L10n,
} from '@/content/guides/kbeauty-guide';

const CATEGORY_KEYS = [
  '에센스·세럼·앰플',
  '크림',
  '선케어',
  '헤어케어',
  '클렌징',
  '바디케어',
  '마스크팩',
  '뷰티소품',
  '기프트세트',
  '토너',
  '메이크업',
  '핸드크림',
  '아이케어',
  '립케어',
  '향수',
] as const;

const LAO_SCRIPT = /[຀-໿]/;
const MEDICAL_WORDING = /치료|완치|cures?\b|treats?\b|heals?\b|ລັກສາ|ປິ່ນປົວ/i;

/** Every L10n in every export, labelled for failure messages. */
function allL10n(): Array<[string, L10n]> {
  const out: Array<[string, L10n]> = [];
  const points = { WHY_KBEAUTY, WHY_SO_MANY_CATEGORIES, SUN_CARE, ANTI_AGING_TERMS };
  for (const [name, list] of Object.entries(points)) {
    list.forEach((p, i) => {
      out.push([`${name}[${i}].title`, p.title], [`${name}[${i}].body`, p.body]);
    });
  }
  for (const g of CATEGORY_GUIDES) {
    for (const field of ['what', 'why', 'when', 'laoTip'] as const) {
      out.push([`${g.category}.${field}`, g[field]]);
    }
  }
  for (const s of ROUTINE) out.push([`ROUTINE[${s.step}].note`, s.note]);
  return out;
}

describe('kbeauty guide', () => {
  it('has the expected number of points per section', () => {
    expect(WHY_KBEAUTY.length).toBeGreaterThanOrEqual(5);
    expect(WHY_KBEAUTY.length).toBeLessThanOrEqual(7);
    expect(WHY_SO_MANY_CATEGORIES.length).toBeGreaterThanOrEqual(4);
    expect(WHY_SO_MANY_CATEGORIES.length).toBeLessThanOrEqual(6);
    expect(SUN_CARE.length).toBeGreaterThanOrEqual(7);
    expect(SUN_CARE.length).toBeLessThanOrEqual(10);
    expect(ANTI_AGING_TERMS.length).toBeGreaterThanOrEqual(4);
    expect(ANTI_AGING_TERMS.length).toBeLessThanOrEqual(6);
  });

  it('fills ko, en and lo in every text', () => {
    for (const [where, t] of allL10n()) {
      expect(t.ko.trim(), `${where}/ko`).not.toBe('');
      expect(t.en.trim(), `${where}/en`).not.toBe('');
      expect(t.lo.trim(), `${where}/lo`).not.toBe('');
    }
  });

  it('writes every Lao string in Lao script', () => {
    for (const [where, t] of allL10n()) {
      expect(t.lo, `${where}/lo`).toMatch(LAO_SCRIPT);
    }
  });

  it('covers exactly the 15 store categories, once each, in order', () => {
    expect(CATEGORY_GUIDES.map((g) => g.category)).toEqual([...CATEGORY_KEYS]);
    expect(new Set(CATEGORY_GUIDES.map((g) => g.category)).size).toBe(CATEGORY_KEYS.length);
    for (const g of CATEGORY_GUIDES) expect(g.icon.trim(), g.category).not.toBe('');
  });

  it('builds the routine from known categories in ascending order', () => {
    const keys: readonly string[] = CATEGORY_KEYS;
    expect(ROUTINE.length).toBeGreaterThan(0);
    for (const s of ROUTINE) {
      expect(keys, `ROUTINE[${s.step}]`).toContain(s.category);
      expect(s.am || s.pm, `ROUTINE[${s.step}] used at some time of day`).toBe(true);
    }
    for (let i = 1; i < ROUTINE.length; i++) {
      expect(ROUTINE[i]!.step).toBeGreaterThan(ROUTINE[i - 1]!.step);
    }
    const sun = ROUTINE.find((s) => s.category === '선케어');
    expect(sun?.am).toBe(true);
    expect(sun?.pm).toBe(false);
  });

  it('uses no medical cure/treat/heal wording in any language', () => {
    for (const [where, t] of allL10n()) {
      for (const lang of ['ko', 'en', 'lo'] as const) {
        expect(t[lang], `${where}/${lang}`).not.toMatch(MEDICAL_WORDING);
      }
    }
  });

  it('cites https sources', () => {
    expect(GUIDE_SOURCES.length).toBeGreaterThan(0);
    for (const s of GUIDE_SOURCES) {
      expect(s.label.trim()).not.toBe('');
      expect(s.url).toMatch(/^https:\/\//);
    }
  });
});
