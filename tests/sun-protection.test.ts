/**
 * Sun Protection tests.
 *
 * Source: Master DB Domain D04, quests QST-004 / QST-005, 14_EVIDENCE.
 *
 * This is the domain where fabrication would do the most harm and where the evidence position
 * is weakest, so the central assertions are negative: the app states nothing about UV, SPF,
 * broad-spectrum coverage or reapplication, the exposure log produces no score or threshold,
 * and the absence of guidance is stated rather than left to read as reassurance.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { createEventSink } from '@/analytics/events';
import {
  SUN_EXPOSURE_PLAN,
  createSession,
  currentActivityText,
  findLessonPlan,
  loadSliceGrounding,
  sessionReducer,
  sliceActivities,
  type SessionState,
} from '@/app/learning-session';
import {
  EXPOSURE_BANDS,
  EXPOSURE_SETTINGS,
  MAX_ENTRIES,
  MAX_MINUTES,
  createExposureLog,
  exposureReducer,
  summariseExposure,
  type ExposureBand,
  type ExposureLogState,
  type ExposureSetting,
} from '@/app/exposure-log';
import { atomsForNode, findActivity } from '@/content/authored-content';
import { evaluateQuestAvailability } from '@/governance/learning-availability';
import {
  CONSTITUTION_REFERENCE_LABELS,
  evidenceSpecificityReport,
  findLabelContradictions,
  resolveEvidenceByUrl,
} from '@/governance/evidence-resolution';
import { evidenceSources, findNode, nodesForDomain } from '@/knowledge/repository';
import { translate } from '@/localization/messages';

const AT = '2026-09-18T00:00:00.000Z';

describe('the D04 evidence position (OQ-E02)', () => {
  it('registers no sun, UV or SPF source anywhere in 14_EVIDENCE', () => {
    const sunSources = evidenceSources.filter((source) =>
      /sun|spf|ultraviolet|\buv\b/i.test(`${source.Source_Title} ${source.URL} ${source.Use}`),
    );
    expect(sunSources).toEqual([]);
  });

  it('anchors every D04 node to one general source rather than a sun-specific one', () => {
    const d04 = evidenceSpecificityReport().find((item) => item.domainId === 'D04')!;
    expect(d04.nodeCount).toBe(13);
    expect(d04.nodesWithCitation).toBe(13);
    expect(d04.distinctSources).toEqual(['AAD-02']);
    expect(d04.citedTitles).toEqual(['Skin care basics']);
  });

  it('leaves the Constitution’s own sunscreen reference uncited and unregistered', () => {
    const report = resolveEvidenceByUrl();
    expect(report.constitutionLabelsWithNoRecord.join(' ')).toContain('AAD-05');
    expect(report.constitutionLabelsWithNoRecord.join(' ')).toContain('Right Sunscreen');
    expect(CONSTITUTION_REFERENCE_LABELS.some((l) => l.id === 'AAD-05')).toBe(true);
  });

  it('keeps SPF and broad-spectrum nodes present but unusable as fact', () => {
    // The nodes exist and are not deleted; they simply cannot be stated.
    const titles = nodesForDomain('D04').map((node) => node.Node_Title);
    expect(titles).toContain('SPF의 의미');
    expect(titles).toContain('광범위 자외선 차단');
    expect(nodesForDomain('D04').every((node) => node.Status === 'Draft')).toBe(true);
  });
});

describe('evidence resolution by URL (OQ-E03)', () => {
  const report = resolveEvidenceByUrl();

  it('resolves every unresolved citation without guessing', () => {
    expect(report.nodesResolvableByUrl).toBe(92);
    expect(report.nodesUnresolvable).toBe(0);
    expect(report.fullyDerivable).toBe(true);
  });

  it('derives the mapping from Source_URL agreement alone', () => {
    const byCited = Object.fromEntries(
      report.mappings.map((mapping) => [mapping.citedSourceId, mapping.registeredSourceId]),
    );
    expect(byCited).toEqual({
      'AAD-01': 'SRC-002',
      'AAD-02': 'SRC-001',
      'AAD-03': 'SRC-003',
      'EU-01': 'SRC-009',
      'FDA-01': 'SRC-005',
    });
  });

  it('reports the contradiction with the Constitution rather than picking a side', () => {
    const contradictions = findLabelContradictions();
    const ids = contradictions.map((item) => item.sourceId).sort();
    expect(ids).toContain('AAD-01');
    expect(ids).toContain('AAD-02');
    const aad01 = contradictions.find((item) => item.sourceId === 'AAD-01')!;
    expect(aad01.constitutionTitle).toContain('Skin Care Basics');
    expect(aad01.derivedTitle).toBe('Face washing 101');
  });

  it('does not rewrite a single Source_ID in the repository', () => {
    // Derivation is a proposal. The node data still carries the original, unresolved IDs.
    expect(findNode('KN-D04-01-003')!.Source_ID).toBe('AAD-02');
    expect(findNode('KN-D05-01-001')!.Source_ID).toBe('AAD-01');
  });
});

describe('Sun Observatory quests stay closed', () => {
  for (const questId of ['QST-004', 'QST-005'] as const) {
    it(`blocks ${questId}, naming a record and register entry for every blocker`, () => {
      const quest = evaluateQuestAvailability(questId, 'SCIENTIFIC');
      expect(quest.available).toBe(false);
      expect(quest.blockers.length).toBeGreaterThan(0);
      for (const blocker of quest.blockers) {
        expect(blocker.recordId).toMatch(/^KN-/);
        expect(blocker.registerId).toBeTruthy();
      }
    });
  }

  it('keeps the source quest wiring verbatim', () => {
    const decoder = evaluateQuestAvailability('QST-005', 'SCIENTIFIC');
    expect(decoder.questName).toBe('Sunscreen Label Decoder');
    expect(decoder.coreNodeId).toBe('KN-D04-02-001');
    expect(decoder.winCondition).toBe('라벨 핵심 항목 찾기');
  });
});

describe('the lesson states nothing about UV, SPF or protection', () => {
  let sink = createEventSink();
  let state: SessionState;
  const dispatch = (action: Parameters<typeof sessionReducer>[1]) => {
    state = sessionReducer(state, action, sink);
    return state;
  };

  beforeEach(() => {
    sink = createEventSink();
    state = createSession('test-learner', 'en', AT, SUN_EXPOSURE_PLAN);
  });

  it('is grounded in a governed D04 node, strand and skill', () => {
    const grounding = loadSliceGrounding(SUN_EXPOSURE_PLAN);
    expect(grounding.nodeTitle).toBe('일상 속 선케어 점검');
    expect(grounding.domainId).toBe('D04');
    expect(grounding.strandCode).toBe('04.6');
    expect(grounding.skillName).toBe('Decide');
    expect(findLessonPlan('sun-exposure-observation')).toBe(SUN_EXPOSURE_PLAN);
  });

  it('carries no SPF figure, protection factor or reapplication interval in any variant', () => {
    const forbidden = /\bSPF\s*\d|\bPA\s*\+|broad[- ]spectrum|재도포|자외선 차단지수|every \d+ (hours|minutes)/i;
    for (const atom of atomsForNode(SUN_EXPOSURE_PLAN.nodeId)) {
      for (const variant of atom.variants) {
        for (const [key, value] of Object.entries(variant.text)) {
          expect(value, `${atom.atomId}/${variant.locale}/${key}`).not.toMatch(forbidden);
        }
      }
    }
    for (const activity of sliceActivities(SUN_EXPOSURE_PLAN)) {
      for (const variant of activity.variants) {
        for (const [key, value] of Object.entries(variant.text)) {
          expect(value, `${activity.activityId}/${variant.locale}/${key}`).not.toMatch(forbidden);
        }
      }
    }
  });

  it('states that the silence is about evidence, not about whether protection matters', () => {
    const boundary = atomsForNode(SUN_EXPOSURE_PLAN.nodeId).find(
      (atom) => atom.claimClass === 'SAFETY_BOUNDARY',
    )!;
    const english = boundary.variants.find((variant) => variant.locale === 'en')!;
    expect(english.text['core']).toMatch(/not about whether protection matters/i);
    expect(english.text['core']).toMatch(/do not read it as reassurance/i);
    const korean = boundary.variants.find((variant) => variant.locale === 'ko')!;
    expect(korean.text['core']).toContain('괜찮다는 뜻으로 읽지');
  });

  it('runs end to end on the shared engine and records evidence against SK07', () => {
    dispatch({ type: 'LESSON_READ' });
    dispatch({ type: 'THINK_DONE' });
    const activity = findActivity(state.activityId)!;
    dispatch({ type: 'SELECT_OPTION', optionIndex: activity.correctOptionIndex });
    expect(dispatch({ type: 'SUBMIT_ANSWER', at: AT }).phase).toBe('FEEDBACK');
    expect(state.lastAnswerCorrect).toBe(true);
    expect(state.mastery.skillId).toBe('SK07');
    expect(state.mastery.state).not.toBe('Mastered');
  });

  it('renders in Korean without falling back', () => {
    const korean = currentActivityText({ ...state, locale: 'ko' });
    expect(korean?.usedFallback).toBe(false);
    expect(korean?.options).toHaveLength(3);
  });
});

describe('exposure log records without judging', () => {
  let sink = createEventSink();
  let state: ExposureLogState;
  const dispatch = (action: Parameters<typeof exposureReducer>[1]) => {
    state = exposureReducer(state, action, sink);
    return state;
  };
  const entry = (
    overrides: Partial<{
      activity: string;
      band: ExposureBand;
      setting: ExposureSetting;
      minutes: number;
    }> = {},
  ) =>
    ({
      type: 'ADD_ENTRY',
      activity: 'walked to the market',
      band: 'midday',
      setting: 'open',
      minutes: 40,
      ...overrides,
    }) as const;

  beforeEach(() => {
    sink = createEventSink();
    state = createExposureLog('test-learner');
  });

  it('records what the user reports, verbatim', () => {
    dispatch(entry());
    expect(state.entries).toHaveLength(1);
    expect(state.entries[0]).toMatchObject({
      activity: 'walked to the market',
      band: 'midday',
      setting: 'open',
      minutes: 40,
    });
  });

  it('counts without producing a score, threshold or risk level', () => {
    dispatch(entry({ minutes: 40 }));
    dispatch(entry({ activity: 'sat under a tree', setting: 'shade', minutes: 20 }));
    const summary = summariseExposure(state);
    expect(summary).toEqual({
      entries: 2,
      totalMinutes: 60,
      minutesBySetting: { open: 40, 'partial-shade': 0, shade: 20, 'indoors-by-window': 0 },
      minutesByBand: { 'early-morning': 0, midday: 60, afternoon: 0, evening: 0 },
      bandsNotRecorded: ['early-morning', 'afternoon', 'evening'],
    });
    // The state itself carries no score, rating or recommendation field.
    expect(Object.keys(state)).toEqual([
      'userId',
      'phase',
      'entries',
      'disclosures',
      'safetyHaltMessageKey',
    ]);
  });

  it('rejects an empty activity, a non-positive duration and an implausible one', () => {
    dispatch(entry({ activity: '   ' }));
    dispatch(entry({ minutes: 0 }));
    dispatch(entry({ minutes: -5 }));
    dispatch(entry({ minutes: MAX_MINUTES + 1 }));
    expect(state.entries).toEqual([]);
  });

  it('caps the number of entries', () => {
    for (let i = 0; i < MAX_ENTRIES + 4; i += 1) dispatch(entry({ activity: `period ${i}` }));
    expect(state.entries).toHaveLength(MAX_ENTRIES);
  });

  it('describes an unrecorded band as a gap in the log, not a statement about the day', () => {
    dispatch(entry());
    const summary = summariseExposure(state);
    expect(summary.bandsNotRecorded).toContain('evening');
    // The wording is part of the contract, so assert the copy says so.
    expect(translate('sun.summaryNote', 'en')).toMatch(/gaps in the log, not statements/i);
  });

  it('emits a reflection event on review, and refuses review with nothing logged', () => {
    expect(dispatch({ type: 'REVIEW', at: AT }).phase).toBe('LOGGING');
    dispatch(entry());
    expect(dispatch({ type: 'REVIEW', at: AT }).phase).toBe('REVIEW');
    expect(sink.countOf('reflection_completed')).toBe(1);
  });

  it('halts on a burn or pain report before storing it', () => {
    dispatch(entry({ activity: '햇빛에 타서 너무 아파요' }));
    expect(state.phase).toBe('HALTED');
    expect(state.entries).toEqual([]);
    expect(state.safetyHaltMessageKey).toMatch(/^safety\.escalation\.R[234]$/);
    expect(sink.countOf('safety_intervention')).toBe(1);
  });

  it('accepts nothing but a reset once halted', () => {
    dispatch(entry({ activity: '감염된 것 같아요' }));
    expect(state.phase).toBe('HALTED');
    dispatch(entry());
    expect(state.entries).toEqual([]);
    expect(dispatch({ type: 'RESET' }).phase).toBe('LOGGING');
    expect(state.safetyHaltMessageKey).toBeNull();
  });

  it('offers only coarse time bands, so no precision is implied that cannot be backed', () => {
    expect(EXPOSURE_BANDS).toEqual(['early-morning', 'midday', 'afternoon', 'evening']);
    expect(EXPOSURE_SETTINGS).toEqual(['open', 'partial-shade', 'shade', 'indoors-by-window']);
  });
});

describe('Sun Protection UI copy makes no protection claim', () => {
  it('keeps every sun message free of SPF figures and protection instructions', () => {
    const forbidden = /\bSPF\s*\d|\bPA\s*\+|apply every|reapply|자외선 차단지수|재도포하/i;
    const keys = [
      'sun.lessonTitle', 'sun.lessonIntro', 'sun.logTitle', 'sun.logIntro',
      'sun.summaryNote', 'sun.evidenceTitle', 'sun.questTitle',
    ] as const;
    for (const key of keys) {
      for (const locale of ['en', 'ko']) {
        expect(translate(key, locale), `${key}/${locale}`).not.toMatch(forbidden);
      }
    }
  });
});
