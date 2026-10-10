/**
 * Partner QR codes. A scanner needs the three finder squares and a version-sized grid; the
 * link must fit; and the same link must always draw the same code, so a printed card never
 * goes stale when the app updates.
 */
import { describe, expect, it } from 'vitest';
import { qrMatrix, qrPath } from '@/app/qr';
import { productLink } from '@/app/store-catalog';

const LINK = productLink('https://cozy-treacle-80f53c.netlify.app/', 'KG-CRM-00003', 'VTE-01');

/** The 7×7 finder: dark ring, light ring, dark 3×3 core. */
const isFinder = (m: readonly (readonly boolean[])[], top: number, left: number): boolean => {
  for (let r = 0; r < 7; r += 1) {
    for (let c = 0; c < 7; c += 1) {
      const ring = r === 0 || r === 6 || c === 0 || c === 6;
      const core = r >= 2 && r <= 4 && c >= 2 && c <= 4;
      if (m[top + r]![left + c] !== (ring || core)) return false;
    }
  }
  return true;
};

describe('partner QR codes', () => {
  it('draws a square grid of a real QR version', () => {
    const m = qrMatrix(LINK);
    expect(m.every((row) => row.length === m.length)).toBe(true);
    expect((m.length - 21) % 4).toBe(0);
    expect(m.length).toBeLessThanOrEqual(57); // version 10 at most: still scannable off a phone
  });

  it('has the three finder squares a scanner looks for', () => {
    const m = qrMatrix(LINK);
    const end = m.length - 7;
    expect(isFinder(m, 0, 0)).toBe(true);
    expect(isFinder(m, 0, end)).toBe(true);
    expect(isFinder(m, end, 0)).toBe(true);
  });

  it('draws the same code for the same link, and a different one for another', () => {
    expect(qrMatrix(LINK)).toEqual(qrMatrix(LINK));
    expect(qrMatrix(LINK)).not.toEqual(qrMatrix(LINK.replace('VTE-01', 'VTE-02')));
  });

  it('paints exactly the dark modules', () => {
    const m = qrMatrix(LINK);
    const dark = m.flat().filter(Boolean).length;
    expect(qrPath(m).match(/M/g)).toHaveLength(dark);
  });
});
