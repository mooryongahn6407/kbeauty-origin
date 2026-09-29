import { describe, expect, it } from 'vitest';
import {
  PARTNER_PARAM,
  capturePartner,
  loadPartner,
  normalizePartnerCode,
  partnerFromSearch,
} from '@/app/partner';
import { issueGift } from '@/app/collection';
import { createMasteryLedger } from '@/mastery/mastery-ledger';

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    dump: () => Object.fromEntries(data),
  };
}

describe('a partner shop code arrives in the link, and is only ever a shop code', () => {
  it('reads the shop code from the link and stores it upper-case', () => {
    expect(PARTNER_PARAM).toBe('p');
    expect(partnerFromSearch('?p=vte-01')).toBe('VTE-01');
    expect(partnerFromSearch('?lang=ko&p=SALON7')).toBe('SALON7');
  });

  it('refuses anything that is not the shape of a shop code', () => {
    for (const bad of ['', 'ab', '-VTE', 'VTE-', 'VTE--01', 'VTE 01', '<script>', 'A'.repeat(17), 'vte_01']) {
      expect(normalizePartnerCode(bad)).toBeNull();
    }
    expect(normalizePartnerCode(null)).toBeNull();
    expect(partnerFromSearch('?q=VTE-01')).toBeNull();
  });

  it('remembers the shop on this device, and a new shop link replaces it', () => {
    const storage = memoryStorage();
    expect(capturePartner('?p=VTE-01', storage)).toBe('VTE-01');
    expect(capturePartner('', storage)).toBe('VTE-01');
    expect(capturePartner('?p=NAIL-22', storage)).toBe('NAIL-22');
    expect(loadPartner(storage)).toBe('NAIL-22');
  });

  it('ignores a malformed link instead of forgetting the shop it already knows', () => {
    const storage = memoryStorage();
    capturePartner('?p=VTE-01', storage);
    expect(capturePartner('?p=%3Cscript%3E', storage)).toBe('VTE-01');
  });

  it('survives storage that throws, as in a private window', () => {
    const broken = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
    };
    expect(capturePartner('?p=VTE-01', broken)).toBe('VTE-01');
    expect(capturePartner('', broken)).toBeNull();
    expect(capturePartner('?p=VTE-01', undefined)).toBe('VTE-01');
  });
});

describe('the shop code stays beside the gift, never inside it or in the ledger', () => {
  it('does not change the gift code, which is still a date and nothing else', () => {
    const at = new Date(2026, 8, 20, 12);
    const storage = memoryStorage();
    capturePartner('?p=VTE-01', storage);
    expect(issueGift.length).toBe(1);
    expect(issueGift(at).code).toBe('KG-260920-21');
  });

  it('never reaches the mastery ledger (rule 9)', () => {
    const ledger = createMasteryLedger('test-reader');
    capturePartner('?p=VTE-01', memoryStorage());
    expect(JSON.stringify(ledger.snapshot())).not.toMatch(/VTE|partner/i);
  });
});
