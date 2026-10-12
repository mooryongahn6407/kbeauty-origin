/**
 * Partner Academy: five complete lessons in Korean, English and Lao, every question answerable,
 * the right answer never a medical claim, covers that ship, and no line from the lessons into
 * anything about commission, rank or partner status (rule 9).
 */
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ACADEMY, loadAcademyProgress } from '@/content/partner/academy';
import { checkWording } from '@/content/partner/wording-check';

const texts = (t: { ko: string; en: string; lo: string }) => [t.ko, t.en, t.lo];

describe('Partner Academy', () => {
  it('has five lessons, each with three points and two questions', () => {
    expect(ACADEMY).toHaveLength(5);
    expect(new Set(ACADEMY.map((u) => u.id)).size).toBe(5);
    for (const unit of ACADEMY) {
      expect(unit.id).toMatch(/^ACADEMY-\d$/);
      expect(unit.points).toHaveLength(3);
      expect(unit.quiz).toHaveLength(2);
      for (const q of unit.quiz) {
        expect(q.answer).toBeGreaterThanOrEqual(0);
        expect(q.answer).toBeLessThan(q.options.length);
      }
    }
  });

  it('is written in Korean, English and Lao script throughout', () => {
    for (const unit of ACADEMY) {
      const all = [
        unit.title,
        unit.intro,
        ...unit.points,
        ...unit.quiz.flatMap((q) => [q.q, q.why, ...q.options]),
      ];
      for (const t of all) {
        expect(t.ko, t.en).toMatch(/[가-힣]/);
        expect(t.lo, t.en).toMatch(/[຀-໿]/);
        expect(t.en.length, t.ko).toBeGreaterThan(1);
      }
    }
  });

  it('never makes a risky phrase the right answer', () => {
    for (const unit of ACADEMY) {
      for (const q of unit.quiz) {
        for (const text of texts(q.options[q.answer]!)) {
          expect(checkWording(text), text).toEqual([]);
        }
      }
    }
  });

  it('ships every cover photo', () => {
    for (const unit of ACADEMY) {
      expect(existsSync(new URL(`../public${unit.cover}`, import.meta.url)), unit.cover).toBe(true);
    }
  });

  it('keeps progress apart from partner and commercial status', () => {
    for (const file of [
      '../src/content/partner/academy.ts',
      '../src/ui/screens/AcademyScreen.tsx',
    ]) {
      const source = readFileSync(new URL(file, import.meta.url), 'utf8');
      const imports = source.split('\n').filter((line) => line.startsWith('import'));
      for (const line of imports) {
        expect(line, file).not.toMatch(/partner'|mastery|ledger|loyalty|commission/);
      }
      expect(source, file).not.toMatch(/setLevel|\.grant\(|\.award\(/);
    }
    expect(loadAcademyProgress({ getItem: () => '["ACADEMY-1","nope","ACADEMY-1"]' })).toEqual([
      'ACADEMY-1',
    ]);
  });
});
