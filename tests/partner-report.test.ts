import { describe, expect, it } from 'vitest';
import { formatMonth, reportRows, reportToTsv, type PartnerReport } from '@/app/partner-report';

const SAMPLE: PartnerReport = {
  'VTE-01': {
    '202609': { opens: 5, results: 3, byTrack: { face: 2, scalp: 1, body: 0 } },
    '202610': { opens: 8, results: 6, byTrack: { face: 4, scalp: 1, body: 1 } },
  },
  'NAIL-22': {
    '202610': { opens: 2, results: 1, byTrack: { face: 0, scalp: 0, body: 1 } },
  },
};

describe('shaping the partner report for the table', () => {
  it('flattens every code and month into one row each, codes alphabetical, newest month first', () => {
    const rows = reportRows(SAMPLE);
    expect(rows.map((r) => `${r.code}:${r.month}`)).toEqual([
      'NAIL-22:202610',
      'VTE-01:202610',
      'VTE-01:202609',
    ]);
  });

  it('carries opens, results and the per-track split through unchanged', () => {
    const row = reportRows(SAMPLE).find((r) => r.code === 'VTE-01' && r.month === '202610')!;
    expect(row).toMatchObject({ opens: 8, results: 6, face: 4, scalp: 1, body: 1 });
  });

  it('formats yyyyMM as yyyy-MM, and leaves anything else alone', () => {
    expect(formatMonth('202610')).toBe('2026-10');
    expect(formatMonth('bad')).toBe('bad');
  });

  it('is empty for an empty report', () => {
    expect(reportRows({})).toEqual([]);
  });
});

describe('copying the report as a table', () => {
  it('writes one tab-separated line per row, with a header, parseable back into numbers', () => {
    const tsv = reportToTsv(SAMPLE);
    const lines = tsv.split('\n');
    expect(lines).toHaveLength(4); // header + 3 rows
    expect(lines[0]!.split('\t')).toEqual([
      '코드',
      '월',
      '링크 연 횟수',
      '결과 본 횟수',
      '얼굴',
      '두피',
      '바디',
    ]);
    const first = lines[1]!.split('\t');
    expect(first[0]).toBe('NAIL-22');
    expect(first[1]).toBe('2026-10');
    expect(Number(first[2])).toBe(2);
  });
});
