/**
 * Care Quest — the rebuilt Skin Quest (face first; scalp & hair and body follow).
 *
 * What these pin down: every word exists in all five languages; every "not sure" and "none of
 * these" the owner asked for is there; every ingredient, product kind and governed concern id a
 * concern cites actually exists; the likely-type read-out picks the type whose signature
 * answers were given and names nothing when the answers are mostly "not sure"; the routine holds
 * retinol back in pregnancy and for teenagers and always ends the morning on sunscreen; and no
 * content line makes a medical claim.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CARE_TRACKS } from '@/content/care-quest';
import { NONE_ID, NOT_SURE_ID, PRODUCT_KINDS } from '@/content/care-quest/common';
import { FACE_CONCERNS } from '@/content/care-quest/face-concerns';
import { FACE_TRACK } from '@/content/care-quest/face';
import { inLocale, type Localized, type QuestAnswers } from '@/content/care-quest/types';
import { CARE_LESSONS } from '@/content/care-quest/lessons';
import { companyDictionary } from '@/content/company/ingredient-dictionary';
import { storeCatalog } from '@/content/store-catalog';
import { concerns as governedConcerns } from '@/knowledge/repository';
import {
  CLEAR_MARGIN,
  HISTORY_KEEP,
  careQuestReducer,
  compareWithPrevious,
  initialCareQuest,
  loadHistory,
  loadProgress,
  recordHistory,
  resultDate,
  retestDate,
  selfDisagrees,
  typeConfidence,
  typeReasons,
  matchProducts,
  pickedConcerns,
  readType,
  resultSummary,
  saveProgress,
  toggleChoice,
} from '@/app/care-quest';

const LANGS = ['ko', 'en', 'lo', 'th', 'fr'] as const;

/** Every Localized object reachable from a value, functions excluded. */
function localizedIn(
  value: unknown,
  out: Localized[] = [],
  seen = new Set<unknown>(),
): Localized[] {
  if (!value || typeof value !== 'object' || seen.has(value)) return out;
  seen.add(value);
  const record = value as Record<string, unknown>;
  if (LANGS.every((lang) => typeof record[lang] === 'string')) {
    out.push(record as unknown as Localized);
    return out;
  }
  for (const child of Object.values(record)) localizedIn(child, out, seen);
  return out;
}

const allText = CARE_TRACKS.flatMap((track) => localizedIn(track));

describe('Care Quest content', () => {
  it('writes every line in all five languages', () => {
    expect(allText.length).toBeGreaterThan(200);
    for (const text of allText) {
      for (const lang of LANGS) expect(text[lang].trim(), `${text.en} [${lang}]`).not.toBe('');
    }
  });

  it('makes no medical claim in any language', () => {
    const claim =
      /치료|완치|\bcures?\b|\btreats?\b|\btreatment\b|guarante|traiter|guérir|ຮັກສາໂລກ|รักษาโรค/i;
    for (const text of allText) {
      for (const lang of LANGS) expect(text[lang], text.en).not.toMatch(claim);
    }
  });

  it('offers twenty face concerns in four groups, plus "none of these"', () => {
    expect(FACE_CONCERNS).toHaveLength(20);
    const step = FACE_TRACK.steps.find((s) => s.id === 'concerns');
    expect(step?.kind).toBe('multi');
    if (step?.kind !== 'multi') return;
    const grouped = step.groups!.flatMap((group) => group.ids);
    expect([...grouped].sort()).toEqual(FACE_CONCERNS.map((c) => c.id).sort());
    expect(step.choices.some((choice) => choice.id === NONE_ID)).toBe(true);
  });

  it('asks the age first, then explains the five skin types before asking which', () => {
    expect(FACE_TRACK.steps[0]!.id).toBe('age');
    expect(FACE_TRACK.steps[1]!.kind).toBe('learn');
    const learn = FACE_TRACK.steps[1]!;
    if (learn.kind === 'learn') {
      expect(learn.cards.map((card) => card.id)).toEqual([
        'dry',
        'oily',
        'combination',
        'normal',
        'sensitive',
      ]);
    }
  });

  it('lets the reader say "not sure" on every type question, and "none" on every multi-pick', () => {
    for (const track of CARE_TRACKS) {
      for (const step of track.steps) {
        if (step.kind === 'multi') {
          expect(
            step.choices.some((c) => c.id === NONE_ID),
            step.id,
          ).toBe(true);
        }
        if (step.kind === 'single' && step.choices.some((c) => c.scores)) {
          expect(
            step.choices.some((c) => c.id === NOT_SURE_ID),
            step.id,
          ).toBe(true);
        }
      }
    }
  });

  it('cites only ingredients, product kinds and governed concerns that exist', () => {
    const ingredientIds = new Set(companyDictionary.ingredients.map((entry) => entry.id));
    const kindIds = new Set(PRODUCT_KINDS.map((kind) => kind.id));
    const governedIds = new Set(governedConcerns.map((concern) => concern.Concern_ID));
    const storeKeys = new Set(storeCatalog.flatMap((product) => product.fit?.concerns ?? []));
    for (const track of CARE_TRACKS) {
      for (const concern of track.concerns) {
        for (const id of concern.ingredients)
          expect(ingredientIds.has(id), `${concern.id}:${id}`).toBe(true);
        for (const id of concern.products)
          expect(kindIds.has(id), `${concern.id}:${id}`).toBe(true);
        for (const key of concern.storeKeys)
          expect(storeKeys.has(key), `${concern.id}:${key}`).toBe(true);
        if (concern.governedId) expect(governedIds.has(concern.governedId), concern.id).toBe(true);
      }
    }
  });

  it('lists its sources as https links', () => {
    for (const track of CARE_TRACKS) {
      expect(track.sources.length).toBeGreaterThan(3);
      for (const source of track.sources) expect(source.url).toMatch(/^https:\/\//);
    }
  });
});

/** The signature answer of one type on every helper question. */
const signature: Record<string, QuestAnswers> = {
  dry: {
    afterWash: ['tightAll'],
    blotting: ['nothing'],
    pores: ['barely'],
    flakes: ['often'],
    makeupWear: ['cakey'],
  },
  oily: {
    afterWash: ['shinyAll'],
    blotting: ['everywhere'],
    pores: ['large'],
    flakes: ['rarely'],
    makeupWear: ['slides'],
  },
  combination: {
    afterWash: ['mixed'],
    blotting: ['tzone'],
    pores: ['nose'],
    flakes: ['cheeks'],
    makeupWear: ['tzone'],
  },
  normal: {
    afterWash: ['comfortable'],
    blotting: ['tzone'],
    pores: ['barely'],
    flakes: ['rarely'],
    makeupWear: ['stays'],
  },
};

describe('likely skin type', () => {
  for (const [type, answers] of Object.entries(signature)) {
    it(`reads ${type} from ${type} answers`, () => {
      expect(readType(FACE_TRACK, answers).typeId).toBe(type);
    });
  }

  it('names no type when the answers are mostly "not sure"', () => {
    const unsure: QuestAnswers = {
      typeSelf: ['unsure'],
      afterWash: ['unsure'],
      blotting: ['unsure'],
      pores: ['unsure'],
      flakes: ['unsure'],
      makeupWear: ['unsure'],
    };
    expect(readType(FACE_TRACK, unsure).typeId).toBeNull();
  });

  it('adds the sensitive tendency on top of a base type', () => {
    const reading = readType(FACE_TRACK, {
      ...signature.oily,
      newProducts: ['often'],
      flushing: ['sometimes'],
    });
    expect(reading).toMatchObject({ typeId: 'oily', modifier: true });
  });

  it('names the runner-up when it is within a point', () => {
    const reading = readType(FACE_TRACK, { afterWash: ['mixed'], blotting: ['everywhere'] });
    expect(reading.typeId).toBe('combination');
    expect(reading.closeTypeId).toBe('oily');
  });

  it('shows which answers gave the named type its points, strongest first', () => {
    const reasons = typeReasons(FACE_TRACK, signature.dry!, 'dry');
    expect(reasons.length).toBeGreaterThanOrEqual(3);
    expect(reasons.every((reason) => reason.points > 0)).toBe(true);
    for (let i = 1; i < reasons.length; i++) {
      expect(reasons[i - 1]!.points).toBeGreaterThanOrEqual(reasons[i]!.points);
    }
    expect(typeReasons(FACE_TRACK, {}, 'dry')).toEqual([]);
  });

  it('says how sure it is instead of stating the type flatly', () => {
    for (const answers of Object.values(signature)) {
      expect(typeConfidence(FACE_TRACK, answers)).toBe('clear');
    }
    expect(typeConfidence(FACE_TRACK, { afterWash: ['mixed'], blotting: ['everywhere'] })).toBe(
      'mixed',
    );
    expect(typeConfidence(FACE_TRACK, { typeSelf: ['unsure'] })).toBeNull();
    expect(CLEAR_MARGIN).toBeGreaterThan(1);
  });

  it('points out when the type she picked herself differs from her answers', () => {
    expect(selfDisagrees(FACE_TRACK, { ...signature.oily, typeSelf: ['dry'] })).toBe('dry');
    expect(selfDisagrees(FACE_TRACK, { ...signature.oily, typeSelf: ['oily'] })).toBeNull();
    expect(selfDisagrees(FACE_TRACK, { ...signature.oily, typeSelf: ['unsure'] })).toBeNull();
  });
});

describe('face routine', () => {
  const base: QuestAnswers = { ...signature.combination, concerns: ['sagging', 'melasma'] };

  it('always ends the morning on sunscreen', () => {
    for (const age of ['teens', '20s', '40s', '60plus']) {
      const answers = { ...base, age: [age] };
      const plan = FACE_TRACK.plan(answers, readType(FACE_TRACK, answers));
      expect(plan.routines[0]!.lines.at(-1)!.kind).toBe('sunscreen');
    }
  });

  it('suggests retinol in the evening for a woman in her 40s with firmness concerns', () => {
    const answers = { ...base, age: ['40s'] };
    const plan = FACE_TRACK.plan(answers, readType(FACE_TRACK, answers));
    expect(plan.routines[1]!.lines.some((line) => line.note.en.startsWith('Retinol'))).toBe(true);
    expect(plan.routines[0]!.lines.some((line) => line.note.en.startsWith('Retinol'))).toBe(false);
  });

  it('holds retinol back in pregnancy and says why', () => {
    const answers = { ...base, age: ['30s'], lifestyle: ['pregnant'] };
    const plan = FACE_TRACK.plan(answers, readType(FACE_TRACK, answers));
    expect(plan.routines[1]!.lines.some((line) => line.note.en.startsWith('Retinol'))).toBe(false);
    expect(plan.avoid).toContain('retinol');
    expect(plan.avoidReason).not.toBeNull();
  });

  it('keeps a teenager to a simple routine without retinol', () => {
    const answers = { ...base, age: ['teens'], concerns: ['acne'] };
    const plan = FACE_TRACK.plan(answers, readType(FACE_TRACK, answers));
    expect(plan.avoid).toContain('retinol');
    expect(
      plan.routines.flatMap((r) => r.lines).some((line) => line.note.en.startsWith('Retinol')),
    ).toBe(false);
    expect(plan.advice[0]!.id).toBe('age-teens');
  });

  it('puts the patch test and sunscreen habit in every result', () => {
    const plan = FACE_TRACK.plan({}, readType(FACE_TRACK, {}));
    expect(plan.advice.map((block) => block.id)).toEqual(expect.arrayContaining(['sun', 'patch']));
  });
});

describe('Care Quest state', () => {
  it('walks age → learn → … → result, and back', () => {
    let state = careQuestReducer(initialCareQuest, { type: 'begin' });
    expect(state.phase).toBe('tracks');
    state = careQuestReducer(state, { type: 'chooseTrack', track: 'face' });
    state = careQuestReducer(state, { type: 'choose', stepId: 'age', choiceId: '40s' });
    expect(state.stepIndex).toBe(1);
    state = careQuestReducer(state, { type: 'next' });
    expect(state.stepIndex).toBe(2);
    state = careQuestReducer(state, { type: 'back' });
    expect(state.stepIndex).toBe(1);
    for (let i = 0; i < 40 && state.phase === 'steps'; i += 1) {
      const step = FACE_TRACK.steps[state.stepIndex]!;
      state =
        step.kind === 'single'
          ? careQuestReducer(state, {
              type: 'choose',
              stepId: step.id,
              choiceId: step.choices[0]!.id,
            })
          : careQuestReducer(
              step.kind === 'multi'
                ? careQuestReducer(state, {
                    type: 'toggle',
                    stepId: step.id,
                    choiceId: step.choices[0]!.id,
                  })
                : state,
              { type: 'next' },
            );
    }
    expect(state.phase).toBe('result');
    expect(state.answers.age).toEqual(['40s']);
  });

  it('ignores an answer for a step that is not on screen', () => {
    const state = careQuestReducer(
      careQuestReducer(initialCareQuest, { type: 'chooseTrack', track: 'face' }),
      { type: 'choose', stepId: 'sleep', choiceId: 'under6' },
    );
    expect(state.answers).toEqual({});
  });

  it('treats "none of these" as exclusive and respects a pick limit', () => {
    expect(toggleChoice(['acne', 'pores'], NONE_ID)).toEqual([NONE_ID]);
    expect(toggleChoice([NONE_ID], 'acne')).toEqual(['acne']);
    expect(toggleChoice(['a', 'b', 'c'], 'd', 3)).toEqual(['a', 'b', 'c']);
    expect(toggleChoice(['a', 'b'], 'a', 3)).toEqual(['b']);
  });
});

describe('products to look at', () => {
  it('offers only products in the routine’s categories that match a picked concern', () => {
    const answers = { concerns: ['melasma', 'dryness'] };
    const picked = pickedConcerns(FACE_TRACK, answers);
    const found = matchProducts(storeCatalog, picked, readType(FACE_TRACK, answers), ['크림']);
    expect(found.length).toBeGreaterThan(0);
    for (const product of found) {
      expect(product.category).toBe('크림');
      expect(
        product.fit!.concerns.some((key) => ['tone', 'uv', 'hydration', 'barrier'].includes(key)),
      ).toBe(true);
    }
  });
});

describe('scalp & hair track', () => {
  const scalp = CARE_TRACKS.find((track) => track.id === 'scalp')!;
  const body = CARE_TRACKS.find((track) => track.id === 'body')!;

  it('starts with the safety check, and any red flag puts "see a doctor" above the result', () => {
    expect(scalp.steps[0]!.id).toBe('redFlags');
    const flagged = scalp.plan({ redFlags: ['patch'] }, readType(scalp, {}));
    expect(flagged.alert).not.toBeNull();
    expect(scalp.plan({ redFlags: [NONE_ID] }, readType(scalp, {})).alert).toBeNull();
  });

  it('reads an oily scalp and a dandruff-prone scalp from their answers', () => {
    expect(
      readType(scalp, { nextEvening: ['greasy'], skipWash: ['greasy'], flakes: ['none'] }).typeId,
    ).toBe('oily');
    expect(
      readType(scalp, { flakes: ['greasyYellow'], itch: ['daily'], skipWash: ['flakier'] }).typeId,
    ).toBe('dandruff');
  });

  it('switches to an anti-dandruff shampoo when dandruff is picked', () => {
    const answers = { concerns: ['dandruff'] };
    const plan = scalp.plan(answers, readType(scalp, answers));
    expect(plan.routines[0]!.lines[0]!.kind).toBe('dandruffShampoo');
    expect(plan.advice.some((block) => block.id === 'dye-test')).toBe(true);
  });

  it('keeps the neck with the face, not the body', () => {
    expect(body.concerns.some((concern) => concern.id === 'neck')).toBe(false);
    expect(FACE_TRACK.concerns.some((concern) => concern.id === 'neck')).toBe(true);
    const learn = body.steps[0]!;
    expect(learn.kind === 'learn' && learn.cards[0]!.id).toBe('neck');
  });

  it('adds foot care for a reader with diabetes', () => {
    const answers = { lifestyle: ['diabetes'] };
    const plan = body.plan(answers, readType(body, answers));
    expect(
      plan.routines.flatMap((block) => block.lines).some((line) => line.kind === 'footCream'),
    ).toBe(true);
  });
});

describe('skin lessons', () => {
  const lessonText = localizedIn(CARE_LESSONS);

  it('are written in all five languages, with no medical claim', () => {
    expect(CARE_LESSONS.length).toBeGreaterThanOrEqual(6);
    for (const text of lessonText) {
      for (const lang of LANGS) {
        expect(text[lang].trim(), `${text.en} [${lang}]`).not.toBe('');
        expect(text[lang], text.en).not.toMatch(/치료|완치|\bcures?\b|\btreats?\b|guérir/i);
      }
    }
  });

  it('link only to ingredients the dictionary has', () => {
    const ids = new Set(companyDictionary.ingredients.map((entry) => entry.id));
    for (const lesson of CARE_LESSONS) {
      for (const id of lesson.ingredients) expect(ids.has(id), `${lesson.id}:${id}`).toBe(true);
      expect(lesson.sources.length).toBeGreaterThan(0);
    }
  });

  it('cover what the owner asked for: sun forms, cleansing & pH, order & vitamin C wait, pairings, eye cream, patch test', () => {
    expect(CARE_LESSONS.map((lesson) => lesson.id)).toEqual(
      expect.arrayContaining([
        'sun-forms',
        'cleansing',
        'order',
        'pairings',
        'eye-cream',
        'patch-test',
      ]),
    );
  });
});

describe('scripts do not cross', () => {
  // A Thai character in a Lao line (or the reverse) is a typing slip a reader sees at once.
  const LAO = /[຀-໿]/;
  const THAI = /[ก-๿]/;
  const everything = [...allText, ...localizedIn(CARE_LESSONS)];

  it('keeps Lao text in Lao script and Thai text in Thai script', () => {
    for (const text of everything) {
      expect(text.th, `th: ${text.th}`).not.toMatch(LAO);
      expect(text.lo, `lo: ${text.lo}`).not.toMatch(THAI);
    }
  });
});

describe('track covers', () => {
  it('point at photos that are in public/', () => {
    for (const track of CARE_TRACKS) {
      expect(existsSync(join(process.cwd(), 'public', track.cover)), track.cover).toBe(true);
    }
  });
});

describe('owner pictures (public/gemini)', () => {
  it('every /gemini/ picture the code points at is in public/', () => {
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const name of readdirSync(dir, { withFileTypes: true })) {
        const path = join(dir, name.name);
        if (name.isDirectory()) walk(path);
        else if (/\.(ts|tsx)$/.test(name.name)) files.push(path);
      }
    };
    walk(join(process.cwd(), 'src'));
    const refs = new Set(
      files.flatMap((file) => readFileSync(file, 'utf8').match(/\/gemini\/[A-Z]-\d\d\.jpg/g) ?? []),
    );
    expect(refs.size).toBeGreaterThan(5);
    for (const ref of refs) expect(existsSync(join(process.cwd(), 'public', ref)), ref).toBe(true);
  });
});

describe('sharing a result with a partner shop', () => {
  const answers: QuestAnswers = {
    age: ['30s'],
    ...signature.combination,
    concerns: ['melasma', 'dryness'],
    family: ['earlyLines', 'atopy'],
    lifestyle: ['pregnant', 'smoking'],
    goals: ['clearTone'],
  };

  it('sends the type, concerns and goals, with the link', () => {
    const text = resultSummary(FACE_TRACK, answers, 'ko', 'https://app.korea-glow.com/?p=VTE-01');
    expect(text).toContain('복합성');
    expect(text).toContain('기미');
    expect(text).toContain('맑고 고른 톤');
    expect(text).toContain('의사 진단 아님');
    expect(text.endsWith('https://app.korea-glow.com/?p=VTE-01')).toBe(true);
  });

  it('never sends age, family or lifestyle answers', () => {
    for (const locale of ['ko', 'en', 'lo']) {
      const text = resultSummary(FACE_TRACK, answers, locale, 'x');
      for (const stepId of ['age', 'family', 'lifestyle']) {
        const step = FACE_TRACK.steps.find((s) => s.id === stepId)!;
        if (step.kind === 'learn') continue;
        for (const id of answers[stepId] ?? []) {
          const label = step.choices.find((choice) => choice.id === id)!.label;
          expect(text, `${stepId}:${id}`).not.toContain(inLocale(label, locale));
        }
      }
    }
  });
});

describe('continuing a track left half-way', () => {
  const memory = () => {
    const data = new Map<string, string>();
    return {
      getItem: (key: string) => data.get(key) ?? null,
      setItem: (key: string, value: string) => void data.set(key, value),
      removeItem: (key: string) => void data.delete(key),
    } as unknown as Storage;
  };

  it('remembers the question and answers, and picks up at the same place', () => {
    const storage = memory();
    let state = careQuestReducer(initialCareQuest, { type: 'chooseTrack', track: 'face' });
    state = careQuestReducer(state, { type: 'choose', stepId: 'age', choiceId: '40s' });
    state = careQuestReducer(state, { type: 'next' });
    saveProgress(storage, state);
    const progress = loadProgress(storage)!;
    expect(progress).toMatchObject({ track: 'face', stepIndex: 2 });
    const resumed = careQuestReducer(initialCareQuest, { type: 'resume', ...progress });
    expect(resumed).toMatchObject({ phase: 'steps', track: 'face', stepIndex: 2 });
    expect(resumed.answers.age).toEqual(['40s']);
  });

  it('forgets the progress once the result is shown', () => {
    const storage = memory();
    saveProgress(storage, { phase: 'steps', track: 'body', stepIndex: 3, answers: {} });
    expect(loadProgress(storage)).not.toBeNull();
    saveProgress(storage, { phase: 'result', track: 'body', stepIndex: 0, answers: {} });
    expect(loadProgress(storage)).toBeNull();
  });

  it('refuses a step number the track does not have', () => {
    const state = careQuestReducer(initialCareQuest, {
      type: 'resume',
      track: 'face',
      stepIndex: 999,
      answers: {},
    });
    expect(state).toBe(initialCareQuest);
  });
});

describe('looking again and comparing with last time', () => {
  const memory = () => {
    const data = new Map<string, string>();
    return {
      getItem: (key: string) => data.get(key) ?? null,
      setItem: (key: string, value: string) => void data.set(key, value),
      removeItem: (key: string) => void data.delete(key),
    } as unknown as Storage;
  };
  const first: QuestAnswers = { ...signature.dry, concerns: ['dryness', 'darkCircles'] };
  const second: QuestAnswers = { ...signature.combination, concerns: ['darkCircles', 'pores'] };

  it('puts this result beside the one before, as her answers only', () => {
    const storage = memory();
    let history = recordHistory(storage, {}, 'face', first, new Date('2026-06-01T10:00:00Z'));
    history = recordHistory(storage, history, 'face', second, new Date('2026-07-01T10:00:00Z'));
    const change = compareWithPrevious(FACE_TRACK, loadHistory(storage), second)!;
    expect(change).toMatchObject({
      previousAt: '2026-06-01',
      at: '2026-07-01',
      typeBefore: 'dry',
      typeNow: 'combination',
    });
    expect(change.added.map((c) => c.id)).toEqual(['pores']);
    expect(change.kept.map((c) => c.id)).toEqual(['darkCircles']);
    expect(change.gone.map((c) => c.id)).toEqual(['dryness']);
    expect(compareWithPrevious(FACE_TRACK, history, first)).toBeNull();
  });

  it('does not add an entry when the same result is opened again', () => {
    const storage = memory();
    const once = recordHistory(storage, {}, 'face', first, new Date('2026-06-01T10:00:00Z'));
    const twice = recordHistory(storage, once, 'face', first, new Date('2026-06-09T10:00:00Z'));
    expect(twice).toBe(once);
    expect(resultDate(twice, 'face', first)).toBe('2026-06-01');
  });

  it('keeps a result saved before dates were kept as the first, undated entry', () => {
    const history = recordHistory(memory(), {}, 'face', second, new Date('2026-07-01'), first);
    expect(history.face!.map((record) => record.at)).toEqual([null, '2026-07-01']);
    expect(compareWithPrevious(FACE_TRACK, history, second)!.previousAt).toBeNull();
  });

  it('keeps only the latest few results per track', () => {
    let history = {};
    for (let day = 1; day <= HISTORY_KEEP + 3; day++) {
      history = recordHistory(
        undefined,
        history,
        'face',
        { age: [String(day)] },
        new Date(`2026-08-${String(day).padStart(2, '0')}T00:00:00Z`),
      );
    }
    expect((history as { face: unknown[] }).face).toHaveLength(HISTORY_KEEP);
  });

  it('suggests a date to look again, across a month end', () => {
    expect(retestDate('2026-10-14')).toBe('2026-11-11');
    expect(retestDate('2026-12-20')).toBe('2027-01-17');
  });

  it('survives storage that holds rubbish', () => {
    const storage = memory();
    storage.setItem('korea-glow:care-quest:history:v1', '{"face":[1,{"answers":"x"}]');
    expect(loadHistory(storage)).toEqual({});
    storage.setItem('korea-glow:care-quest:history:v1', '{"face":[1,{"answers":{"a":[2,"b"]}}]}');
    expect(loadHistory(storage)).toEqual({ face: [{ at: null, answers: { a: ['b'] } }] });
  });
});
