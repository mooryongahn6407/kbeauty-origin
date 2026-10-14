/**
 * The partner wording checker: every rule is complete in five languages, every pattern
 * compiles, risky posts in each language are caught, and an ordinary post is left alone.
 */
import { describe, expect, it } from 'vitest';
import { WORDING_RULES, checkWording, inLocale } from '@/content/partner/wording-check';

const LOCALES = ['ko', 'en', 'lo', 'th', 'fr'] as const;

describe('partner wording rules', () => {
  it('have unique ids, compiling patterns and text in every language', () => {
    expect(new Set(WORDING_RULES.map((r) => r.id)).size).toBe(WORDING_RULES.length);
    for (const rule of WORDING_RULES) {
      for (const source of rule.patterns) expect(() => new RegExp(source, 'giu')).not.toThrow();
      for (const locale of LOCALES) {
        expect(rule.why[locale].length, `${rule.id}.why.${locale}`).toBeGreaterThan(10);
        expect(rule.instead[locale].length, `${rule.id}.instead.${locale}`).toBeGreaterThan(10);
      }
      expect(inLocale(rule.why, 'lo')).toMatch(/[຀-໿]/);
      expect(inLocale(rule.why, 'th')).toMatch(/[฀-๿]/);
    }
  });

  it('catch risky posts in Korean, Lao, Thai and English', () => {
    const ids = (post: string) => new Set(checkWording(post).map((hit) => hit.ruleId));
    expect(ids('이 크림 쓰면 기미 제거, 여드름 치료 100% 보장!')).toEqual(
      new Set(['removal', 'medical', 'promise']),
    );
    expect(ids('ຄີມນີ້ປິ່ນປົວສິວ ຂາວທັນທີ ບໍ່ມີຜົນຂ້າງຄຽງ')).toEqual(
      new Set(['medical', 'promise', 'removal', 'no-side-effects']),
    );
    expect(ids('ครีมนี้หายขาด แพทย์แนะนำ ถูกที่สุด')).toEqual(
      new Set(['medical', 'authority', 'cheapest']),
    );
    expect(ids('Guaranteed to cure acne. Other shops sell fake ones.')).toEqual(
      new Set(['promise', 'medical', 'fake-others']),
    );
  });

  it('catch body-function claims the ASEAN cosmetic rules leave to medicines', () => {
    const ids = (post: string) => new Set(checkWording(post).map((hit) => hit.ruleId));
    for (const post of [
      '이 샴푸 쓰면 머리카락이 다시 나요',
      '노화를 되돌리는 세포 재생 크림',
      'Stops hair loss and reverses ageing',
      'ແຊມພູນີ້ ຊ່ວຍໃຫ້ຜົມງອກ',
      'ครีมย้อนวัย ฟื้นฟูเซลล์',
      'Crème amincissant, brûle-graisses',
    ]) {
      expect(ids(post), post).toContain('body-change');
    }
    expect(ids('두피를 깨끗하고 촉촉하게 가꿔 줘요')).toEqual(new Set());
  });

  it('leave an ordinary post alone', () => {
    expect(
      checkWording(
        '새로 들어온 수분 크림이에요. 뒷면 라벨 사진은 앱에서 볼 수 있어요. 문의 주세요!',
      ),
    ).toEqual([]);
    expect(checkWording('ຄີມໃໝ່ມາແລ້ວ ຊ່ວຍໃຫ້ຜິວຊຸ່ມຊື່ນ. ເບິ່ງຮູບສະຫຼາກໃນແອັບໄດ້.')).toEqual([]);
  });

  it('report hits in reading order', () => {
    const hits = checkWording('100% 보장, 치료 효과');
    expect(hits.map((h) => h.index)).toEqual([...hits.map((h) => h.index)].sort((a, b) => a - b));
  });
});

describe('the bad example post', () => {
  it('trips several rules in every language', async () => {
    const { BAD_EXAMPLE_POST } = await import('@/content/partner/wording-check');
    for (const locale of LOCALES) {
      const ids = new Set(checkWording(BAD_EXAMPLE_POST[locale]).map((hit) => hit.ruleId));
      expect(ids.size, locale).toBeGreaterThanOrEqual(3);
    }
  });
});
