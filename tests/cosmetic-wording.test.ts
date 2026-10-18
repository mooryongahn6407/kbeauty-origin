/**
 * Cosmetic wording, not medical wording (rule 7). The ingredient dictionary and the face concerns
 * describe how skin looks and feels — "calming care", "spot care", "skin that looks stressed" —
 * never wounds, regeneration or treatment. These are the words the owner asked to remove on
 * 2026-10-18; the test keeps them from coming back in any language.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { FACE_CONCERNS } from '@/content/care-quest/face-concerns';
import { companyDictionary } from '@/content/company/ingredient-dictionary';

const MEDICAL = [
  /wound/i,
  /regenerat/i,
  /spot treatment/i,
  /상처/,
  /재생/,
  /ບາດແຜ/,
  /เป็นแผลหรือรอย/,
  /blessure/i,
];

const text = (value: unknown): string => JSON.stringify(value);

describe('cosmetic wording', () => {
  it('the face concerns name no wound, regeneration or spot treatment', () => {
    const all = text(FACE_CONCERNS);
    for (const word of MEDICAL) expect(all).not.toMatch(word);
  });

  it('older skin "takes longer to look settled", never "heals slowly", in any language', () => {
    const source = readFileSync(resolve(__dirname, '../src/content/care-quest/face.ts'), 'utf8');
    for (const word of [/회복이 느려/, /heals slowly/i, /หายช้า/, /ຫາຍຊ້າ/, /guérit lentement/i]) {
      expect(source).not.toMatch(word);
    }
    expect(source).toContain('다시 차분해지는 데 시간이 더 걸려요');
    expect(source).toContain('takes longer to look settled again');
  });

  it('PDRN is described as calming care, in every language it has', () => {
    const pdrn = companyDictionary.ingredients.find((entry) => entry.id === 'pdrn');
    expect(pdrn).toBeDefined();
    const what = text(pdrn!.what);
    for (const word of MEDICAL) expect(what).not.toMatch(word);
    expect(pdrn!.what.en).toMatch(/calming/i);
    expect(pdrn!.what.ko).toContain('진정');
  });
});
