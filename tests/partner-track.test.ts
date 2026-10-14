import { describe, expect, it } from 'vitest';
import { visitPayload } from '@/app/partner-track';

describe('what a visit event sends, and what it refuses to send', () => {
  it('builds the payload for an open and for a result, upper-casing the code', () => {
    expect(visitPayload('vte-01', 'open')).toEqual({ code: 'VTE-01', event: 'open' });
    expect(visitPayload('VTE-01', 'result', 'face')).toEqual({
      code: 'VTE-01',
      event: 'result',
      track: 'face',
    });
  });

  it('never leaves a track field on an open event', () => {
    const payload = visitPayload('VTE-01', 'open');
    expect(payload).not.toHaveProperty('track');
  });

  it('refuses a malformed code — nothing is ever sent', () => {
    for (const bad of ['', 'ab', '<script>', 'VTE_01', 'A'.repeat(17)]) {
      expect(visitPayload(bad, 'open')).toBeNull();
      expect(visitPayload(bad, 'result', 'scalp')).toBeNull();
    }
  });
});
