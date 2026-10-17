/**
 * Mastery survives a reload.
 *
 * The ledger writes the attempts it accepted under a versioned key and rebuilds by replaying them
 * through `record` — so storage can restore earned evidence but never mint any. Blocked storage
 * must leave a working in-memory ledger.
 */
import { describe, expect, it } from 'vitest';
import type { Attempt } from '@/domain/learning';
import { MASTERY_STORAGE_KEY, createMasteryLedger, type LedgerStore } from '@/mastery/mastery-ledger';

const memoryStore = (): LedgerStore & { data: Map<string, string> } => {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
    removeItem: (key) => void data.delete(key),
  };
};

const blockedStore: LedgerStore = {
  getItem: () => {
    throw new Error('SecurityError');
  },
  setItem: () => {
    throw new Error('QuotaExceededError');
  },
  removeItem: () => {
    throw new Error('SecurityError');
  },
};

let counter = 0;
const attempt = (overrides: Partial<Attempt> = {}): Attempt => ({
  attemptId: `a-${(counter += 1)}`,
  userId: 'u',
  nodeId: 'KN-D01-01-001',
  skillId: 'SK01',
  activityId: 'act',
  correct: true,
  hintsUsed: 0,
  isTransfer: false,
  isRetention: false,
  at: '2026-10-18T09:00:00.000Z',
  ...overrides,
});

describe('the key is versioned', () => {
  it('carries a version suffix', () => {
    expect(MASTERY_STORAGE_KEY).toMatch(/:v\d+$/);
  });
});

describe('progress survives a reload', () => {
  it('rebuilds the same snapshot from the stored attempts', () => {
    const store = memoryStore();
    const first = createMasteryLedger('u', store);
    first.record(attempt());
    first.record(attempt({ correct: false }));
    first.record(attempt({ isRetention: true }));
    const reloaded = createMasteryLedger('u', store);
    expect(reloaded.snapshot()).toEqual(first.snapshot());
    expect(reloaded.snapshot().attemptCount).toBe(3);
  });

  it('keeps idempotency across a reload', () => {
    const store = memoryStore();
    const one = attempt();
    createMasteryLedger('u', store).record(one);
    const reloaded = createMasteryLedger('u', store);
    reloaded.record(one);
    expect(reloaded.snapshot().attemptCount).toBe(1);
  });

  it('reset clears what was stored', () => {
    const store = memoryStore();
    const ledger = createMasteryLedger('u', store);
    ledger.record(attempt());
    ledger.reset();
    expect(store.data.has(MASTERY_STORAGE_KEY)).toBe(false);
    expect(createMasteryLedger('u', store).snapshot().attemptCount).toBe(0);
  });
});

describe('stored data can rebuild evidence but never mint it', () => {
  it('skips malformed rows and unknown skills', () => {
    const store = memoryStore();
    store.setItem(
      MASTERY_STORAGE_KEY,
      JSON.stringify({ attempts: [attempt(), { attemptId: 'x' }, attempt({ skillId: 'SK99' }), 'junk'] }),
    );
    expect(createMasteryLedger('u', store).snapshot().attemptCount).toBe(1);
  });

  it('ignores a stored state block — only attempts are read', () => {
    const store = memoryStore();
    store.setItem(MASTERY_STORAGE_KEY, JSON.stringify({ states: [{ skillId: 'SK01', state: 'Mastered' }] }));
    const ledger = createMasteryLedger('u', store);
    expect(ledger.snapshot().masteredSkillIds).toEqual([]);
  });

  it('starts empty on unparseable data', () => {
    const store = memoryStore();
    store.setItem(MASTERY_STORAGE_KEY, '{not json');
    expect(createMasteryLedger('u', store).snapshot().attemptCount).toBe(0);
  });
});

describe('blocked storage leaves a working ledger', () => {
  it('records, snapshots and resets without throwing', () => {
    const ledger = createMasteryLedger('u', blockedStore);
    expect(() => ledger.record(attempt())).not.toThrow();
    expect(ledger.snapshot().attemptCount).toBe(1);
    expect(() => ledger.reset()).not.toThrow();
    expect(ledger.snapshot().attemptCount).toBe(0);
  });

  it('works with no storage at all', () => {
    const ledger = createMasteryLedger('u');
    ledger.record(attempt());
    expect(ledger.snapshot().attemptCount).toBe(1);
  });
});
