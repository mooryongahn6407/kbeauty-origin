/**
 * Label Detective tests.
 *
 * Source: QST-013, D11 strand 11.7, KN-D11-07-001 / KN-D11-07-002, KN-D06-01-003.
 *
 * This is the one world whose quest can actually run, so the assertions are about the exercise
 * staying a categorisation exercise: the specimens are fictional and unbranded, the correct
 * answer is always which part of a label a line is, and nothing anywhere asserts that an
 * ingredient does something or that a claim is true.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { createEventSink } from '@/analytics/events';
import {
  LABEL_READING_PLAN,
  createSession,
  currentActivityText,
  findLessonPlan,
  loadSliceGrounding,
  sessionReducer,
  sliceActivities,
  type SessionState,
} from '@/app/learning-session';
import {
  LABEL_BUCKETS,
  createSorter,
  evaluateSorter,
  findSpecimen,
  labelSpecimens,
  misplacedFragments,
  sorterReducer,
  type SorterState,
} from '@/app/label-sorter';
import { atomsForNode, findActivity } from '@/content/authored-content';
import { evaluateQuestAvailability } from '@/governance/learning-availability';
import { evidenceSpecificityReport, resolveEvidenceByUrl } from '@/governance/evidence-resolution';
import { findNode, nodeLinksForQuest, products } from '@/knowledge/repository';
import { translate } from '@/localization/messages';

const AT = '2026-09-18T00:00:00.000Z';
const SPECIMEN = 'SPECIMEN-001';

describe('label specimens are fictional and carry no product data', () => {
  it('declares every specimen fictional with a note saying so in both locales', () => {
    expect(labelSpecimens.length).toBeGreaterThan(0);
    for (const specimen of labelSpecimens) {
      expect(specimen.isFictional, specimen.specimenId).toBe(true);
      expect(specimen.fictionNote['en']).toBeTruthy();
      expect(specimen.fictionNote['ko']).toBeTruthy();
      expect(specimen.specimenId).toMatch(/^SPECIMEN-\d{3}$/);
    }
  });

  it('carries no brand, product name or SKU, because 16_PRODUCTS is Template-only', () => {
    expect(products.every((product) => product.Status === 'Template')).toBe(true);
    for (const specimen of labelSpecimens) {
      expect(specimen).not.toHaveProperty('brand');
      expect(specimen).not.toHaveProperty('productName');
      const serialised = JSON.stringify(specimen);
      expect(serialised).not.toMatch(/PROD-/);
    }
  });

  it('sorts every fragment into one of the four governed buckets', () => {
    for (const specimen of labelSpecimens) {
      for (const fragment of specimen.fragments) {
        expect(LABEL_BUCKETS, fragment.fragmentId).toContain(fragment.kind);
      }
    }
  });

  it('explains every fragment in both locales, about placement rather than efficacy', () => {
    // An explanation that said what an ingredient does would be a scientific claim.
    const efficacy =
      /(개선|효과가 있|works to|helps? (?:your )?skin|treats?|repairs? (?:your )?skin|reduces? wrinkles|whitens)/i;
    for (const specimen of labelSpecimens) {
      for (const fragment of specimen.fragments) {
        for (const locale of ['en', 'ko']) {
          expect(fragment.text[locale], `${fragment.fragmentId}/${locale}`).toBeTruthy();
          const why = fragment.why[locale]!;
          expect(why.length).toBeGreaterThan(20);
          expect(why, `${fragment.fragmentId}/${locale}`).not.toMatch(efficacy);
        }
      }
    }
  });

  it('covers all four kinds, so the exercise is not trivially one-sided', () => {
    const kinds = new Set(findSpecimen(SPECIMEN)!.fragments.map((f) => f.kind));
    expect([...kinds].sort()).toEqual(['CAUTION', 'CLAIM', 'HOW_TO_USE', 'INGREDIENTS']);
  });
});

describe('the sorter marks nothing until asked', () => {
  let sink = createEventSink();
  let state: SorterState;
  const dispatch = (action: Parameters<typeof sorterReducer>[1]) => {
    state = sorterReducer(state, action, sink);
    return state;
  };
  const specimen = findSpecimen(SPECIMEN)!;
  const placeAll = (correct: boolean) => {
    for (const fragment of specimen.fragments) {
      const bucket = correct
        ? fragment.kind
        : LABEL_BUCKETS.find((b) => b !== fragment.kind)!;
      dispatch({ type: 'PLACE', fragmentId: fragment.fragmentId, bucket });
    }
  };

  beforeEach(() => {
    sink = createEventSink();
    state = createSorter('test-learner', SPECIMEN);
  });

  it('starts with nothing placed and nothing marked', () => {
    expect(state.phase).toBe('SORTING');
    expect(state.placements).toEqual({});
    expect(state.incorrectFragmentIds).toEqual([]);
    expect(evaluateSorter(state).placed).toBe(0);
  });

  it('refuses to check until every line is placed', () => {
    dispatch({ type: 'PLACE', fragmentId: 'f1', bucket: 'CLAIM' });
    expect(dispatch({ type: 'CHECK', at: AT }).phase).toBe('SORTING');
    expect(state.incorrectFragmentIds).toEqual([]);
  });

  it('marks the misplaced lines only after a check, and names each one', () => {
    placeAll(false);
    expect(state.incorrectFragmentIds).toEqual([]);
    dispatch({ type: 'CHECK', at: AT });
    expect(state.phase).toBe('CHECKED');
    expect(state.incorrectFragmentIds).toHaveLength(specimen.fragments.length);
    expect(misplacedFragments(state).every((fragment) => fragment.why['en'])).toBe(true);
  });

  it('clears a stale mark as soon as the learner moves that line', () => {
    placeAll(false);
    dispatch({ type: 'CHECK', at: AT });
    const first = specimen.fragments[0]!;
    dispatch({ type: 'PLACE', fragmentId: first.fragmentId, bucket: first.kind });
    expect(state.phase).toBe('SORTING');
    expect(state.incorrectFragmentIds).not.toContain(first.fragmentId);
  });

  it('lets a correct sort finish, and refuses to finish an incorrect one', () => {
    placeAll(false);
    dispatch({ type: 'CHECK', at: AT });
    expect(dispatch({ type: 'COMPLETE', at: AT }).phase).toBe('CHECKED');

    dispatch({ type: 'RESET' });
    placeAll(true);
    expect(evaluateSorter(state).allCorrect).toBe(true);
    dispatch({ type: 'CHECK', at: AT });
    expect(dispatch({ type: 'COMPLETE', at: AT }).phase).toBe('COMPLETE');
    expect(sink.countOf('lesson_completed')).toBe(1);
  });

  it('counts attempts so feedback can change tone, without scoring the learner', () => {
    placeAll(false);
    dispatch({ type: 'CHECK', at: AT });
    dispatch({ type: 'CONTINUE_SORTING' });
    placeAll(true);
    dispatch({ type: 'CHECK', at: AT });
    expect(state.checkCount).toBe(2);
    expect(sink.countOf('question_answered')).toBe(2);
    // There is no grade, streak or score anywhere in the state.
    expect(Object.keys(state)).toEqual([
      'userId',
      'specimenId',
      'phase',
      'placements',
      'incorrectFragmentIds',
      'checkCount',
      'disclosures',
    ]);
  });

  it('ignores a fragment that does not belong to the specimen', () => {
    const before = state;
    expect(dispatch({ type: 'PLACE', fragmentId: 'nope', bucket: 'CLAIM' })).toEqual(before);
  });

  it('lets a line be taken back out', () => {
    dispatch({ type: 'PLACE', fragmentId: 'f1', bucket: 'CLAIM' });
    dispatch({ type: 'UNPLACE', fragmentId: 'f1' });
    expect(state.placements).toEqual({});
  });

  it('throws rather than inventing a specimen that does not exist', () => {
    expect(() => createSorter('u', 'SPECIMEN-999')).toThrow(/not found/i);
  });
});

describe('QST-013 is the one quest that can actually run', () => {
  it('has all three mapped nodes present', () => {
    const links = nodeLinksForQuest('QST-013');
    expect(links.map((link) => link.Node_ID)).toEqual([
      'KN-D11-07-001',
      'KN-D11-07-002',
      'KN-D06-01-003',
    ]);
    for (const link of links) expect(findNode(link.Node_ID), link.Node_ID).toBeDefined();
  });

  it('opens as a categorisation quest and closes as a scientific one', () => {
    const asPedagogical = evaluateQuestAvailability('QST-013', 'PEDAGOGICAL');
    expect(asPedagogical.available).toBe(true);
    expect(asPedagogical.blockers).toEqual([]);

    const asScientific = evaluateQuestAvailability('QST-013', 'SCIENTIFIC');
    expect(asScientific.available).toBe(false);
    expect(asScientific.blockers.length).toBeGreaterThan(0);
  });

  it('keeps the source win condition verbatim', () => {
    expect(evaluateQuestAvailability('QST-013', 'PEDAGOGICAL').winCondition).toBe(
      'claim/ingredient/use instructions 분리',
    );
  });
});

describe('D11 has the best evidence alignment in the corpus', () => {
  it('cites a source that is genuinely on topic for label and claim reading', () => {
    const d11 = evidenceSpecificityReport().find((item) => item.domainId === 'D11')!;
    expect(d11.distinctSources).toEqual(['FDA-01']);
    const mapping = resolveEvidenceByUrl().mappings.find((m) => m.domains.includes('D11'))!;
    expect(mapping.registeredSourceId).toBe('SRC-005');
    expect(mapping.registeredTitle).toBe('Cosmetics Labeling Claims');
  });

  it('still cannot state any D11 node as fact, because they are Draft', () => {
    const grounding = loadSliceGrounding(LABEL_READING_PLAN);
    expect(grounding.nodeStatus).toBe('Draft');
    expect(grounding.mayStateAsFact).toBe(false);
  });
});

describe('the label lesson', () => {
  let sink = createEventSink();
  let state: SessionState;
  const dispatch = (action: Parameters<typeof sessionReducer>[1]) => {
    state = sessionReducer(state, action, sink);
    return state;
  };

  beforeEach(() => {
    sink = createEventSink();
    state = createSession('test-learner', 'en', AT, LABEL_READING_PLAN);
  });

  it('is the only plan that claims a quest, and is that quest’s core node', () => {
    expect(LABEL_READING_PLAN.questId).toBe('QST-013');
    const grounding = loadSliceGrounding(LABEL_READING_PLAN);
    expect(grounding.questName).toBe('Label Detective');
    expect(grounding.strandCode).toBe('11.7');
    expect(grounding.skillName).toBe('Evaluate Claims');
    expect(findLessonPlan('label-reading')).toBe(LABEL_READING_PLAN);
  });

  it('runs end to end and records evidence against SK06', () => {
    dispatch({ type: 'LESSON_READ' });
    dispatch({ type: 'THINK_DONE' });
    const activity = findActivity(state.activityId)!;
    dispatch({ type: 'SELECT_OPTION', optionIndex: activity.correctOptionIndex });
    expect(dispatch({ type: 'SUBMIT_ANSWER', at: AT }).phase).toBe('FEEDBACK');
    expect(state.lastAnswerCorrect).toBe(true);
    expect(state.mastery.skillId).toBe('SK06');
  });

  it('offers a transfer activity about a sentence that mixes two label parts', () => {
    const transfer = sliceActivities(LABEL_READING_PLAN).find((a) => a.isTransfer)!;
    const english = transfer.variants.find((v) => v.locale === 'en')!;
    expect(english.text['question']).toContain('best results');
    expect(transfer.correctOptionIndex).toBe(2);
  });

  it('asserts no efficacy anywhere in its atoms or activities', () => {
    const efficacy = /(cures?|treats?|clinically proven|guarantee[sd]?|개선해 ?줍니다|치료)/i;
    for (const atom of atomsForNode(LABEL_READING_PLAN.nodeId)) {
      for (const variant of atom.variants) {
        for (const [key, value] of Object.entries(variant.text)) {
          expect(value, `${atom.atomId}/${variant.locale}/${key}`).not.toMatch(efficacy);
        }
      }
    }
  });

  it('states the boundary: sorting a label judges nothing', () => {
    const boundary = atomsForNode(LABEL_READING_PLAN.nodeId).find(
      (atom) => atom.claimClass === 'SAFETY_BOUNDARY',
    )!;
    expect(boundary.variants.find((v) => v.locale === 'en')!.text['core']).toMatch(
      /does not tell you whether anything on it is true/i,
    );
    expect(boundary.variants.find((v) => v.locale === 'ko')!.text['core']).toContain(
      '판정을 하지 않습니다',
    );
  });

  it('renders in Korean without falling back', () => {
    const korean = currentActivityText({ ...state, locale: 'ko' });
    expect(korean?.usedFallback).toBe(false);
    expect(korean?.options).toHaveLength(3);
  });
});

describe('Label Detective UI copy stays a sorting vocabulary', () => {
  it('describes buckets without judging what belongs in them', () => {
    for (const bucket of LABEL_BUCKETS) {
      for (const locale of ['en', 'ko']) {
        const name = translate(`label.bucket.${bucket}` as never, locale);
        const hint = translate(`label.bucketHint.${bucket}` as never, locale);
        expect(name.length, `${bucket}/${locale}`).toBeGreaterThan(2);
        expect(hint.length, `${bucket}/${locale}`).toBeGreaterThan(10);
        expect(hint).not.toMatch(/(good|bad|better|worse|좋은|나쁜)/i);
      }
    }
  });

  it('frames a wrong placement as something to read, not as a failure', () => {
    expect(translate('label.someWrongBody', 'en')).toMatch(/how the difference becomes obvious/i);
    expect(translate('label.someWrongBody', 'ko')).toContain('또렷하게');
    expect(translate('label.whyLabel', 'ko')).toBe('쉽게 말하면');
  });
});
