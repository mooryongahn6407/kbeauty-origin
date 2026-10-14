import { describe, expect, it } from 'vitest';
import { directoryLabel, monthKey, visitKey } from '@/app/partner-blob-keys';

describe('the partner-visit key shape', () => {
  it('builds a key with the code, month, event and track in order', () => {
    const key = visitKey('VTE-01', 'result', 'face', new Date('2026-10-14T03:00:00Z'), '123-abc');
    expect(key).toBe('v1/VTE-01/202610/result/face/123-abc');
  });

  it('writes a dash where there is no track (an "open" event)', () => {
    const key = visitKey('VTE-01', 'open', '-', new Date('2026-01-05T00:00:00Z'), 'x');
    expect(key).toBe('v1/VTE-01/202601/open/-/x');
  });

  it('formats the month as yyyyMM, zero-padded', () => {
    expect(monthKey(new Date('2026-01-05T00:00:00Z'))).toBe('202601');
    expect(monthKey(new Date('2026-12-31T23:59:59Z'))).toBe('202612');
  });
});

describe('reading a directory() entry back — the bug this guards against', () => {
  // Netlify Blobs' list({ directories: true }) hands back each subfolder as the FULL prefix
  // ready to pass straight into the next list() call, never the bare segment name alone. The
  // first version of partner-report.mts assumed the bare name and silently matched nothing.
  it('strips the parent prefix and the trailing slash, not just the trailing slash', () => {
    expect(directoryLabel('v1/', 'v1/VTE-01/')).toBe('VTE-01');
    expect(directoryLabel('v1/VTE-01/', 'v1/VTE-01/202610/')).toBe('202610');
  });

  it('is the inverse of how visitKey nests a code and a month', () => {
    const key = visitKey('NAIL-22', 'open', '-', new Date('2026-07-01T00:00:00Z'), 'u');
    const [root, code, month] = key.split('/');
    expect(directoryLabel('v1/', `${root}/${code}/`)).toBe('NAIL-22');
    expect(directoryLabel(`${root}/${code}/`, `${root}/${code}/${month}/`)).toBe('202607');
  });
});
