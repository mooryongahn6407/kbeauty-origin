/**
 * Recommendation audit (skipped in `npm test`; runs only with AUDIT_OUT set):
 *   AUDIT_OUT=audit.json npx vitest run tests/recommendation-audit.test.ts
 * Prints, for the concerns that matter most (melasma, acne …), which products the quest would
 * show and the printed-label evidence behind each, so a person can check every pick.
 */
import { writeFileSync } from 'node:fs';
import { it } from 'vitest';
import { FACE_CONCERNS } from '@/content/care-quest/face-concerns';
import { storeCatalog } from '@/content/store-catalog';
import { labelEvidence, matchProducts } from '@/app/care-quest';

const CASES: Record<string, string[]> = {
  melasma: ['melasma'],
  acne: ['acne'],
  'melasma+acne': ['melasma', 'acne'],
  comedones: ['comedones'],
  darkSpots: ['darkSpots'],
  dryness: ['dryness'],
  redness: ['redness'],
};
const KINDS = ['토너', '에센스·세럼·앰플', '아이케어', '크림', '선케어'];

it.skipIf(!process.env.AUDIT_OUT)('writes the audit (only when AUDIT_OUT is set)', () => {
  const reading = { typeId: 'combination', modifier: null } as never;
  const out: Record<string, unknown[]> = {};
  for (const [name, ids] of Object.entries(CASES)) {
    const concerns = FACE_CONCERNS.filter((concern) => ids.includes(concern.id));
    out[name] = matchProducts(storeCatalog, concerns, reading, KINDS).map((product) => ({
      sku: product.sku,
      category: product.category,
      name: product.nameKo,
      evidence: labelEvidence(product, concerns).map((e) => `${e.printed}#${e.position}(${e.evidence})`),
    }));
  }
  writeFileSync(process.env.AUDIT_OUT ?? 'recommendation-audit.json', JSON.stringify(out, null, 1));
});
