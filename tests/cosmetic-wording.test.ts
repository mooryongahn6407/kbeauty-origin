/**
 * Cosmetic wording, not medical wording (rule 7). The ingredient dictionary and the face concerns
 * describe how skin looks and feels — "calming care", "spot care", "skin that looks stressed" —
 * never wounds, regeneration or treatment. These are the words the owner asked to remove on
 * 2026-10-18; the test keeps them from coming back in any language.
 */
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

  it('PDRN is described as calming care, in every language it has', () => {
    const pdrn = companyDictionary.ingredients.find((entry) => entry.id === 'pdrn');
    expect(pdrn).toBeDefined();
    const what = text(pdrn!.what);
    for (const word of MEDICAL) expect(what).not.toMatch(word);
    expect(pdrn!.what.en).toMatch(/calming/i);
    expect(pdrn!.what.ko).toContain('진정');
  });
});
