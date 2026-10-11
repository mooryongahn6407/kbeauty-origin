/**
 * Every usage, season and pairing sentence the catalog carries has English and Lao, so a Lao
 * reader never meets the Korean original on a product page. Label text (directions, cautions)
 * is deliberately excluded: it is what the Korean label prints.
 */
import { describe, expect, it } from 'vitest';
import { storeCatalog } from '@/content/store-catalog';
import { USAGE_TRANSLATIONS, translateSentence } from '@/content/company/usage-translations';

const sentences = new Set<string>();
for (const product of storeCatalog) {
  const u = product.usage;
  for (const t of [u?.am, u?.day, u?.pm, u?.drySeason, u?.hotSeason, u?.rainySeason])
    if (t) sentences.add(t);
  if (product.fit?.basis) sentences.add(product.fit.basis);
  for (const text of [product.pairing?.good, product.pairing?.avoid, product.pairing?.basis]) {
    for (const raw of (text ?? '').split('\n')) {
      const line = raw.trim();
      if (line && !line.startsWith('→')) sentences.add(line.replace(/^•\s*/, ''));
    }
  }
}

describe('usage translations', () => {
  it('cover every sentence the catalog shows', () => {
    const missing = [...sentences].filter((s) => !USAGE_TRANSLATIONS[s]);
    expect(missing).toEqual([]);
  });

  it('write Lao in Lao script', () => {
    for (const [ko, t] of Object.entries(USAGE_TRANSLATIONS)) expect(t.lo, ko).toMatch(/[຀-໿]/);
  });

  it('fall back to Korean, and say so, for a sentence they do not know', () => {
    expect(translateSentence('알 수 없는 문장', 'lo')).toEqual({
      text: '알 수 없는 문장',
      korean: true,
    });
    expect(translateSentence('세안 직후 첫 단계', 'lo').korean).toBe(false);
  });

  it('drop the season prefix in Korean where the heading already says it', () => {
    expect(translateSentence('우기: 젤·가벼운 타입과 번갈아 써도 좋아요', 'ko').text).toBe(
      '젤·가벼운 타입과 번갈아 써도 좋아요',
    );
  });

  it('make no medical claim', () => {
    for (const t of Object.values(USAGE_TRANSLATIONS)) {
      expect(`${t.en} ${t.lo}`).not.toMatch(/\b(cures?|treats?|heals?)\b|ປິ່ນປົວ/i);
    }
  });
});
