import { describe, expect, it } from 'vitest';
import {
  CONTINUE_CARDS_FROM_VISIT,
  LAST_LESSON_KEY,
  VISITS_KEY,
  VISIT_GAP_MS,
  countVisit,
  dueReviewCount,
  finishedTracks,
  journeyCards,
  loadLastLesson,
  nextLesson,
  saveLastLesson,
} from '@/app/journey';
import { LOCAL_STORAGE_KEYS } from '@/app/device-data';
import { CHROME } from '@/ui/chrome-text';

class MemoryStorage implements Storage {
  private data = new Map<string, string>();
  get length() {
    return this.data.size;
  }
  clear() {
    this.data.clear();
  }
  getItem(key: string) {
    return this.data.get(key) ?? null;
  }
  key(index: number) {
    return [...this.data.keys()][index] ?? null;
  }
  removeItem(key: string) {
    this.data.delete(key);
  }
  setItem(key: string, value: string) {
    this.data.set(key, value);
  }
}

const blocked = {
  getItem: () => {
    throw new Error('blocked');
  },
  setItem: () => {
    throw new Error('blocked');
  },
} as unknown as Storage;

const LESSONS = ['a', 'b', 'c'];

describe('visit counter', () => {
  it('counts a new visit only after a 30-minute gap', () => {
    const store = new MemoryStorage();
    expect(countVisit(store, 0)).toBe(1);
    expect(countVisit(store, 1000)).toBe(1); // a reload
    expect(countVisit(store, 1000 + VISIT_GAP_MS)).toBe(2);
    expect(countVisit(store, 1000 + 3 * VISIT_GAP_MS)).toBe(CONTINUE_CARDS_FROM_VISIT);
  });
  it('treats blocked or garbled storage as a first visit', () => {
    expect(countVisit(blocked, 0)).toBe(1);
    const store = new MemoryStorage();
    store.setItem(VISITS_KEY, '{"n":"x"}');
    expect(countVisit(store, 0)).toBe(1);
  });
  it('keeps its keys inside «delete my data»', () => {
    expect(LOCAL_STORAGE_KEYS).toContain(VISITS_KEY);
    expect(LOCAL_STORAGE_KEYS).toContain(LAST_LESSON_KEY);
  });
});

describe('what the cards read', () => {
  it('remembers the last lesson', () => {
    const store = new MemoryStorage();
    expect(loadLastLesson(store)).toBeNull();
    saveLastLesson(store, 'b');
    expect(loadLastLesson(store)).toBe('b');
    expect(loadLastLesson(blocked)).toBeNull();
  });
  it('reads finished tracks and due reviews without the game', () => {
    const store = new MemoryStorage();
    store.setItem('korea-glow:care-quest:v1', JSON.stringify({ face: {}, body: { s: ['x'] }, junk: {} }));
    expect(finishedTracks(store)).toEqual(['face', 'body']);
    store.setItem(
      'korea-glow:review:v1',
      JSON.stringify({ a: { dueOn: '2026-10-18' }, b: { dueOn: '2026-10-19' }, c: { dueOn: '2026-10-25' }, d: null }),
    );
    expect(dueReviewCount(store, '2026-10-19')).toBe(2);
    expect(dueReviewCount(blocked, '2026-10-19')).toBe(0);
  });
  it('steps through lessons and wraps at the end', () => {
    expect(nextLesson(LESSONS, null)).toBe('a');
    expect(nextLesson(LESSONS, 'a')).toBe('b');
    expect(nextLesson(LESSONS, 'c')).toBe('a');
    expect(nextLesson(LESSONS, 'a', 1)).toBe('c');
    expect(nextLesson([], 'a')).toBeNull();
  });
});

describe('the four continue cards', () => {
  const base = { finished: [], hasProgress: false, weekTodo: false, dueReviews: 0, lastLesson: null, lessonIds: LESSONS } as const;

  it('always gives four, in the same order', () => {
    expect(journeyCards(base).map((card) => card.slot)).toEqual(['today', 'review', 'next', 'other']);
  });
  it('puts a half-done game first, then the 7-day check, then the game itself', () => {
    expect(journeyCards({ ...base, hasProgress: true, weekTodo: true })[0]!.action).toEqual({ kind: 'resume' });
    expect(journeyCards({ ...base, weekTodo: true })[0]!.action).toEqual({ kind: 'week' });
    expect(journeyCards(base)[0]!.action).toEqual({ kind: 'track', track: 'face' });
  });
  it('offers due reviews, else the last result', () => {
    expect(journeyCards({ ...base, dueReviews: 4 })[1]!.action).toEqual({ kind: 'review', due: 4 });
    expect(journeyCards({ ...base, finished: ['face'] })[1]!.action).toEqual({ kind: 'result' });
  });
  it('never offers the same lesson twice', () => {
    const cards = journeyCards({ ...base, finished: ['face'], lastLesson: 'a' });
    expect(cards[0]!.action).toEqual({ kind: 'lesson', id: 'b' });
    expect(cards[2]!.action).toEqual({ kind: 'lesson', id: 'c' });
  });
  it('sends «something else» to an unplayed branch, then the dictionary', () => {
    expect(journeyCards({ ...base, finished: ['face'] })[3]!.action).toEqual({ kind: 'track', track: 'scalp' });
    expect(journeyCards({ ...base, finished: ['face', 'scalp'] })[3]!.action).toEqual({ kind: 'track', track: 'body' });
    expect(journeyCards({ ...base, finished: ['face', 'scalp', 'body'] })[3]!.action).toEqual({ kind: 'dictionary' });
  });
});

describe('journey words', () => {
  it('exist in all five languages', () => {
    for (const key of ['branchStart', 'branchesTitle', 'jHello', 'jToday', 'jReview', 'jNext', 'jOther', 'sIntroReplay']) {
      const text = CHROME[key]!;
      for (const locale of ['ko', 'en', 'lo', 'th', 'fr'] as const) {
        expect((text as unknown as Record<string, string>)[locale], `${key}.${locale}`).toBeTruthy();
      }
    }
  });
});
