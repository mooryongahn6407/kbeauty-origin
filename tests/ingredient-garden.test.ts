/**
 * Ingredient Garden tests.
 *
 * Source: Master DB 06_INGREDIENTS, Domain D06, quests QST-008/009/010, 14_EVIDENCE.
 *
 * The central assertion of this suite is that the world is honest about being closed: the three
 * governed quests teach scientific claims and must stay blocked while their records are
 * unverified, while the ingredient-literacy lesson, which teaches reasoning, stays open.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { createMasteryLedger } from '@/mastery/mastery-ledger';
import { createEventSink } from '@/analytics/events';
import {
  INGREDIENT_HALO_PLAN,
  MIRROR_DETECTIVE_PLAN,
  createSession,
  currentActivityText,
  findLessonPlan,
  loadSliceGrounding,
  applySession,
  sliceActivities,
  type SessionState,
} from '@/app/learning-session';
import { findActivity } from '@/content/authored-content';
import {
  INGREDIENT_GARDEN_QUESTS,
  evaluateLessonAvailability,
  evaluateQuestAvailability,
  ingredientGardenQuestAvailability,
  requiresVerifiedEvidence,
} from '@/governance/learning-availability';
import {
  evidenceReferenceReport,
  findSuspectedStrandMisplacements,
  findUnresolvedEvidenceReferences,
} from '@/governance/integrity';
import {
  findIngredient,
  ingredientCorpusReport,
  ingredientFamilies,
  ingredientsInFamily,
} from '@/knowledge/ingredients';
import { nodeLinksForQuest } from '@/knowledge/repository';

const AT = '2026-09-18T00:00:00.000Z';

describe('ingredient corpus', () => {
  it('exposes all 40 governed ingredient records', () => {
    const report = ingredientCorpusReport();
    expect(report.total).toBe(40);
    expect(ingredientFamilies.reduce((sum, f) => sum + f.ingredients.length, 0)).toBe(40);
  });

  it('derives families from the source rather than inventing a taxonomy', () => {
    // Families are whatever 06_INGREDIENTS spells, not a tidied-up set.
    const names = ingredientFamilies.map((family) => family.name);
    expect(names).toContain('Humectant');
    expect(names).toContain('Barrier Lipid');
    expect(names).toContain('Vitamin C Derivative');
    expect(names).toContain('Emollient/Film Former');
    expect(new Set(names).size).toBe(names.length);
  });

  it('keeps source IDs and fields verbatim', () => {
    const glycerin = findIngredient('ING-001');
    expect(glycerin).toMatchObject({
      Ingredient_ID: 'ING-001',
      Ingredient_Name: 'Glycerin',
      Family: 'Humectant',
      Status: 'Draft',
      Evidence_Status: 'Seed / Verify',
    });
    expect(ingredientsInFamily('Humectant').map((i) => i.Ingredient_ID)).toEqual([
      'ING-001',
      'ING-002',
      'ING-003',
    ]);
  });

  it('reports that no ingredient may be stated as fact, and how thin the referencing is', () => {
    const report = ingredientCorpusReport();
    expect(report.mayStateAsFact).toBe(0);
    // Only 3 of 40 records carry any external reference at all.
    expect(report.withReferenceUrl).toBe(3);
  });

  it('returns undefined for an unknown ingredient instead of inventing one', () => {
    expect(findIngredient('ING-999')).toBeUndefined();
  });
});

describe('lesson availability gate', () => {
  it('requires verified evidence only for scientific claims', () => {
    expect(requiresVerifiedEvidence('SCIENTIFIC')).toBe(true);
    expect(requiresVerifiedEvidence('PEDAGOGICAL')).toBe(false);
    expect(requiresVerifiedEvidence('SAFETY_BOUNDARY')).toBe(false);
  });

  it('opens a pedagogical lesson on an unverified node, with a disclosure', () => {
    const availability = evaluateLessonAvailability({
      claimClass: 'PEDAGOGICAL',
      nodeIds: ['KN-D11-02-001'],
    });
    expect(availability.available).toBe(true);
    expect(availability.disclosures.map((d) => d.code)).toContain('PENDING_VERIFICATION');
  });

  it('blocks the same node for a scientific claim', () => {
    const availability = evaluateLessonAvailability({
      claimClass: 'SCIENTIFIC',
      nodeIds: ['KN-D11-02-001'],
    });
    expect(availability.available).toBe(false);
    expect(availability.blockers.map((b) => b.reason)).toContain('UNVERIFIED_RECORD');
  });

  it('blocks a scientific lesson that leans on unverified ingredient records', () => {
    const availability = evaluateLessonAvailability({
      claimClass: 'SCIENTIFIC',
      nodeIds: ['KN-D06-02-001'],
      ingredientIds: ['ING-001'],
    });
    expect(availability.available).toBe(false);
    const ingredientBlocker = availability.blockers.find((b) => b.recordType === 'Ingredient');
    expect(ingredientBlocker?.registerId).toBe('SR-010');
  });

  it('blocks a missing record whatever the claim class', () => {
    for (const claimClass of ['PEDAGOGICAL', 'SCIENTIFIC'] as const) {
      const availability = evaluateLessonAvailability({
        claimClass,
        nodeIds: ['KN-D05-02-003'],
      });
      expect(availability.available).toBe(false);
      expect(availability.blockers[0]!.reason).toBe('MISSING_RECORD');
    }
  });

  it('treats an unresolved evidence citation as blocking a scientific claim', () => {
    const availability = evaluateLessonAvailability({
      claimClass: 'SCIENTIFIC',
      nodeIds: ['KN-D06-01-001'],
    });
    const evidenceBlocker = availability.blockers.find((b) => b.reason === 'UNRESOLVED_EVIDENCE');
    expect(evidenceBlocker?.registerId).toBe('OQ-E01');
    expect(evidenceBlocker?.detail).toContain('EU-01');
  });
});

describe('the three governed Ingredient Garden quests', () => {
  it('wires each quest to its real node map', () => {
    const quests = ingredientGardenQuestAvailability();
    expect(quests.map((q) => q.questId)).toEqual(['QST-008', 'QST-009', 'QST-010']);
    for (const quest of quests) {
      expect(quest.nodeIds).toEqual(nodeLinksForQuest(quest.questId).map((l) => l.Node_ID));
      expect(quest.nodeIds.length).toBeGreaterThan(0);
    }
  });

  it('keeps the source quest names and win conditions verbatim', () => {
    const quests = ingredientGardenQuestAvailability();
    expect(quests[0]).toMatchObject({
      questName: 'Ingredient Garden',
      winCondition: '10개 성분 기능 매칭',
      coreNodeId: 'KN-D06-01-001',
    });
    expect(quests[1]).toMatchObject({ questName: 'Humectant Hunt', coreNodeId: 'KN-D06-02-001' });
    expect(quests[2]).toMatchObject({ questName: 'Barrier Lipid Trio', coreNodeId: 'KN-D06-05-001' });
  });

  it('blocks all three, because each asks the learner to state what an ingredient does', () => {
    for (const quest of ingredientGardenQuestAvailability()) {
      expect(quest.available, quest.questId).toBe(false);
      expect(quest.blockers.length).toBeGreaterThan(0);
    }
  });

  it('names a concrete record and register entry for every blocker', () => {
    for (const quest of ingredientGardenQuestAvailability()) {
      for (const blocker of quest.blockers) {
        expect(blocker.recordId).toMatch(/^(KN|ING|QST)-/);
        expect(blocker.detail.length).toBeGreaterThan(10);
        expect(blocker.registerId).toBeTruthy();
      }
    }
  });

  it('declares every Ingredient Garden quest a scientific claim', () => {
    expect(INGREDIENT_GARDEN_QUESTS.every((q) => q.claimClass === 'SCIENTIFIC')).toBe(true);
  });

  it('reports a missing quest rather than throwing', () => {
    const availability = evaluateQuestAvailability('QST-999', 'PEDAGOGICAL');
    expect(availability.available).toBe(false);
    expect(availability.blockers[0]!.recordType).toBe('Quest');
  });
});

describe('the ingredient-literacy lesson that is open', () => {
  let sink = createEventSink();
  // An isolated ledger: `applySession` would otherwise fold attempts into the
  // process-wide one and let suites see each other's evidence.
  const ledger = createMasteryLedger('test-learner');
  let state: SessionState;
  const dispatch = (action: Parameters<typeof applySession>[1]) => {
    state = applySession(state, action, sink, ledger);
    return state;
  };

  beforeEach(() => {
    sink = createEventSink();
    ledger.reset();
    state = createSession('test-learner', 'en', AT, INGREDIENT_HALO_PLAN);
  });

  it('is grounded in a governed node, strand and skill that all exist', () => {
    const grounding = loadSliceGrounding(INGREDIENT_HALO_PLAN);
    expect(grounding.nodeTitle).toBe('단일 성분 halo effect');
    expect(grounding.domainId).toBe('D11');
    expect(grounding.strandCode).toBe('11.2');
    expect(grounding.strandName).toBe('Ingredient Halo');
    expect(grounding.skillName).toBe('Evaluate Claims');
  });

  it('claims no quest, because no quest in 12_QUEST_NODE_MAP references its node', () => {
    expect(INGREDIENT_HALO_PLAN.questId).toBeNull();
    expect(loadSliceGrounding(INGREDIENT_HALO_PLAN).questName).toBeNull();
  });

  it('runs the full learning flow on the shared engine', () => {
    expect(state.phase).toBe('LESSON');
    expect(dispatch({ type: 'LESSON_READ' }).phase).toBe('ASK');
    expect(dispatch({ type: 'THINK_DONE' }).phase).toBe('THINK');
    expect(dispatch({ type: 'REQUEST_HINT' }).phase).toBe('HINT');

    const activity = findActivity(state.activityId)!;
    dispatch({ type: 'SELECT_OPTION', optionIndex: activity.correctOptionIndex });
    expect(dispatch({ type: 'SUBMIT_ANSWER', at: AT }).phase).toBe('FEEDBACK');
    expect(state.lastAnswerCorrect).toBe(true);
    expect(dispatch({ type: 'CONTINUE_TO_REFLECT' }).phase).toBe('REFLECT');
    expect(
      dispatch({ type: 'SUBMIT_REFLECTION', text: 'A label states presence, not effect.', at: AT })
        .phase,
    ).toBe('MASTER');
    expect(dispatch({ type: 'CONTINUE_TO_MASTERY' }).phase).toBe('COMPLETE');
  });

  it('records mastery evidence against SK06, not the My Skin skill', () => {
    dispatch({ type: 'LESSON_READ' });
    dispatch({ type: 'THINK_DONE' });
    const activity = findActivity(state.activityId)!;
    dispatch({ type: 'SELECT_OPTION', optionIndex: activity.correctOptionIndex });
    dispatch({ type: 'SUBMIT_ANSWER', at: AT });

    expect(state.mastery.skillId).toBe('SK06');
    expect(state.mastery.nodeEvidence).toEqual(['KN-D11-02-001']);
    expect(state.mastery.state).not.toBe('Mastered');
  });

  it('offers a transfer activity that feeds only the transfer dimension', () => {
    const transfer = sliceActivities(INGREDIENT_HALO_PLAN).find((a) => a.isTransfer);
    expect(transfer).toBeDefined();
    dispatch({ type: 'START_ACTIVITY', activityId: transfer!.activityId });
    dispatch({ type: 'LESSON_READ' });
    dispatch({ type: 'THINK_DONE' });
    dispatch({ type: 'SELECT_OPTION', optionIndex: transfer!.correctOptionIndex });
    dispatch({ type: 'SUBMIT_ANSWER', at: AT });
    expect(state.mastery.dimensions.transfer.attempts).toBe(1);
  });

  it('renders in Korean without falling back', () => {
    const korean = currentActivityText({ ...state, locale: 'ko' });
    expect(korean?.usedFallback).toBe(false);
    expect(korean?.options).toHaveLength(3);
  });

  it('restarts back into its own plan, not the default one', () => {
    dispatch({ type: 'LESSON_READ' });
    dispatch({ type: 'RESTART', at: AT });
    expect(state.planId).toBe(INGREDIENT_HALO_PLAN.planId);
    expect(state.nodeId).toBe(INGREDIENT_HALO_PLAN.nodeId);
  });
});

describe('the session engine generalises across plans', () => {
  it('keeps both plans registered and retrievable', () => {
    expect(findLessonPlan('mirror-detective')).toBe(MIRROR_DETECTIVE_PLAN);
    expect(findLessonPlan('ingredient-halo')).toBe(INGREDIENT_HALO_PLAN);
    expect(findLessonPlan('nope')).toBeUndefined();
  });

  it('refuses to start a session for a blocked lesson', () => {
    expect(() =>
      createSession('u', 'en', AT, { ...INGREDIENT_HALO_PLAN, claimClass: 'SCIENTIFIC' }),
    ).toThrow(/blocked/i);
  });

  it('refuses a plan whose node does not exist', () => {
    expect(() =>
      loadSliceGrounding({ ...INGREDIENT_HALO_PLAN, nodeId: 'KN-D99-99-999' }),
    ).toThrow(/not found/i);
  });

  it('refuses a plan that claims a quest it is not the core node of', () => {
    expect(() =>
      loadSliceGrounding({ ...INGREDIENT_HALO_PLAN, questId: 'QST-008' }),
    ).toThrow(/core node/i);
  });
});

describe('evidence reference integrity (OQ-E01)', () => {
  it('reports that no node evidence citation resolves', () => {
    const report = evidenceReferenceReport();
    expect(report.nodesWithSourceId).toBe(92);
    expect(report.nodesWithoutSourceId).toBe(120);
    expect(report.resolved).toBe(0);
    expect(report.unresolved).toBe(92);
  });

  it('names the two ID namespaces that were never reconciled', () => {
    const report = evidenceReferenceReport();
    expect(report.unknownSourceIds).toEqual(['AAD-01', 'AAD-02', 'AAD-03', 'EU-01', 'FDA-01']);
    expect(report.registeredSourceIds).toEqual([
      'SRC-001', 'SRC-002', 'SRC-003', 'SRC-004', 'SRC-005',
      'SRC-006', 'SRC-007', 'SRC-008', 'SRC-009', 'SRC-010',
    ]);
  });

  it('does not rewrite or guess a mapping for any Source_ID', () => {
    for (const reference of findUnresolvedEvidenceReferences()) {
      expect(reference.sourceId).toMatch(/^(FDA|EU|AAD)-\d{2}$/);
    }
  });
});

describe('suspected strand misplacement (OQ-S01)', () => {
  const misplacements = findSuspectedStrandMisplacements();

  it('detects the D06 content drift using governed vocabulary only', () => {
    expect(misplacements.map((m) => m.nodeId)).toEqual([
      'KN-D06-04-003',
      'KN-D06-05-002',
      'KN-D06-05-003',
      'KN-D06-08-001',
      'KN-D06-09-002',
    ]);
  });

  it('explains each suspicion with the ingredient and family that raised it', () => {
    const retinol = misplacements.find((m) => m.nodeId === 'KN-D06-08-001')!;
    expect(retinol).toMatchObject({
      nodeTitle: 'Retinol 기본',
      filedUnderStrandCode: '06.8',
      filedUnderStrandName: 'Exfoliating Acids',
      matchedIngredientName: 'Retinol',
      ingredientFamily: 'Retinoid',
      suggestedStrandCode: '06.9',
      suggestedStrandName: 'Retinoid Family',
    });
  });

  it('does not flag a node that sits in the strand its subject belongs to', () => {
    // KN-D06-02-001 "Glycerin과 흡습성" is correctly filed under 06.2 Humectants.
    expect(misplacements.some((m) => m.nodeId === 'KN-D06-02-001')).toBe(false);
  });

  it('never moves a node: the repository still reports the source placement', () => {
    for (const item of misplacements) {
      expect(item.filedUnderStrandCode).not.toBe(item.suggestedStrandCode);
    }
  });
});
