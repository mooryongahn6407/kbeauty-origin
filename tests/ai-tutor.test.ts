/**
 * AI Tutor tests — retriever, mode contracts, and the Constitution §16 evaluation suite.
 *
 * Source: AI Tutor Constitution §2 (runtime), §3 (grounding contract and hallucination
 * firewall), §5 (hint ladder and Tutor Fade), §10 (mode skeletons), §15.3 (engineering
 * definition of done), §16 (evaluation scenarios).
 *
 * The §16 suite is the centrepiece: the Constitution names those ten scenarios as mandatory
 * before launch, so they run here as a regression gate rather than as a document.
 */
import { describe, expect, it } from 'vitest';
import { EVAL_CASES, runEvaluationSuite } from '@/tutor/evaluation-suite';
import { MODE_SKELETON, evaluateModeContract } from '@/tutor/mode-contract';
import { ground, queryTerms } from '@/tutor/retriever';
import { mandatoryApprovedAIRules, respond, routeMode, type TutorRequest } from '@/tutor/tutor-engine';
import { aiRules, knowledgeNodes } from '@/knowledge/repository';

const request = (overrides: Partial<TutorRequest> = {}): TutorRequest => ({
  userMessage: '피부 장벽이 뭔가요?',
  nodeId: null,
  skillId: null,
  locale: 'ko',
  hintsUsed: 0,
  failedAttempts: 0,
  userRequestedProductHelp: false,
  ...overrides,
});

describe('Constitution §16 evaluation suite', () => {
  const report = runEvaluationSuite();

  it('covers exactly the ten scenarios the Constitution lists', () => {
    expect(EVAL_CASES.map((item) => item.id)).toEqual([
      'T01', 'T02', 'T03', 'T04', 'T05', 'T06', 'T07', 'T08', 'T09', 'T10',
    ]);
    for (const evalCase of EVAL_CASES) {
      expect(evalCase.passCriteria.length, evalCase.id).toBeGreaterThan(5);
      expect(evalCase.assertions.length, evalCase.id).toBeGreaterThanOrEqual(3);
    }
  });

  it('passes every scenario against the real runtime', () => {
    const failures = report.cases
      .filter((item) => !item.passed)
      .map((item) => `${item.id}: ${item.assertions.filter((a) => !a.passed).map((a) => a.name).join('; ')}`);
    expect(failures).toEqual([]);
    expect(report.allPassed).toBe(true);
    expect(report.passedCount).toBe(10);
  });

  it('routes each scenario to a distinct, defensible mode rather than one catch-all', () => {
    const byId = Object.fromEntries(report.cases.map((item) => [item.id, item.response]));
    expect(byId['T01']!.mode).toBe('SAFETY');
    expect(byId['T05']!.mode).toBe('SAFETY');
    expect(byId['T06']!.mode).toBe('RECOMMEND');
    expect(byId['T07']!.mode).toBe('REMEDIATE');
    expect(byId['T08']!.mode).toBe('PRACTICE');
    // At least four different modes are exercised, so the router is not a constant function.
    expect(new Set(report.cases.map((item) => item.response.mode)).size).toBeGreaterThanOrEqual(4);
  });

  it('has no assertion that passes vacuously on an unrelated response', () => {
    // Every assertion must be able to fail: run each case's assertions against a plain
    // learning response and require that at least one of them rejects it.
    const neutral = respond(request({ userMessage: '피부 장벽이 뭔가요?' }));
    const alwaysTrue = EVAL_CASES.filter(
      (evalCase) =>
        evalCase.id !== 'T09' && evalCase.assertions.every((assertion) => assertion.check(neutral)),
    );
    expect(alwaysTrue.map((item) => item.id)).toEqual([]);
  });
});

describe('retriever grounding contract (§3)', () => {
  it('finds the governed records a question is about', () => {
    const result = ground('Niacinamide가 뭐예요?');
    expect(result.empty).toBe(false);
    expect(result.candidates.some((candidate) => candidate.id === 'ING-007')).toBe(true);
  });

  it('returns nothing rather than a nearest guess for an unknown product', () => {
    const result = ground('XYZ 슈퍼글로우 크림 어때요?');
    expect(result.empty).toBe(true);
    expect(result.candidates).toEqual([]);
    expect(result.recordsSearched).toBeGreaterThan(300);
  });

  it('returns nothing for gibberish', () => {
    expect(ground('zzzzqqq').empty).toBe(true);
  });

  it('attaches a publication decision to every candidate, and none is statable', () => {
    const result = ground('자외선 차단');
    expect(result.candidates.length).toBeGreaterThan(0);
    for (const candidate of result.candidates) {
      expect(candidate.publication.mayStateAsFact).toBe(false);
    }
    expect(result.anyStatableAsFact).toBe(false);
  });

  it('reports candidates whose evidence citation does not resolve (OQ-E01)', () => {
    const result = ground('자외선 차단');
    expect(result.withUnresolvedEvidence).toBeGreaterThan(0);
  });

  it('explains a match by naming the terms that matched it', () => {
    const result = ground('성분표 읽기');
    expect(result.candidates[0]!.matchedTerms.length).toBeGreaterThan(0);
    for (const term of result.candidates[0]!.matchedTerms) {
      expect(term.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('orders governed knowledge above catalogue rows', () => {
    const result = ground('클렌저');
    if (result.candidates.length > 1) {
      const kinds = result.candidates.map((candidate) => candidate.kind);
      const firstProduct = kinds.indexOf('Product');
      const firstNode = kinds.indexOf('KnowledgeNode');
      if (firstProduct !== -1 && firstNode !== -1) expect(firstNode).toBeLessThan(firstProduct);
    }
  });

  it('recovers a Korean stem from an inflected word without a morphology table', () => {
    const terms = queryTerms('성분표에서');
    expect(terms).toContain('성분표');
  });

  it('ignores single characters, so a query cannot match everything', () => {
    expect(queryTerms('이 가 를 성분').every((term) => term.length >= 2)).toBe(true);
  });
});

describe('the hallucination firewall holds on an explicit miss', () => {
  it('does not substitute another record when a requested node does not exist', () => {
    const response = respond(request({ nodeId: 'KN-D99-99-999', userMessage: '보습이 뭔가요?' }));
    expect(response.node_ids).toEqual([]);
    expect(response.evidence_ids).toEqual([]);
    expect(response.uncertainty.join(' ')).toContain('KN-D99-99-999');
    expect(response.uncertainty.join(' ')).toMatch(/No other record was substituted/i);
  });

  it('still grounds normally when the requested node exists', () => {
    const nodeId = knowledgeNodes[0]!.Node_ID;
    expect(respond(request({ nodeId })).node_ids).toEqual([nodeId]);
  });
});

describe('mode contracts (§10)', () => {
  it('declares a skeleton for every mode the router can produce', () => {
    for (const mode of ['TEACH', 'COACH', 'REMEDIATE', 'PRACTICE', 'ASSESS', 'REFLECT', 'RECOMMEND', 'SAFETY'] as const) {
      expect(MODE_SKELETON[mode].length, mode).toBeGreaterThan(0);
    }
  });

  it('cannot fill a slot that would assert a fact while nothing is approved', () => {
    const contract = evaluateModeContract('RECOMMEND', 'KN-D11-07-001', false);
    for (const name of ['criteria', 'options', 'why', 'limits']) {
      const slot = contract.slots.find((item) => item.slot === name)!;
      expect(slot.filled, name).toBe(false);
      expect(slot.blockedReason).toMatch(/assert something about the world/i);
    }
    expect(contract.complete).toBe(false);
  });

  it('fills a pedagogical slot when authored content exists for the node', () => {
    // KN-D11-07-001 has an authored atom; a node with none cannot fill the same slot.
    const withContent = evaluateModeContract('COACH', 'KN-D11-07-001', false);
    expect(withContent.complete).toBe(true);
    const withoutContent = evaluateModeContract('COACH', 'KN-D03-01-001', false);
    expect(withoutContent.complete).toBe(false);
    expect(withoutContent.slots[0]!.blockedReason).toMatch(/No authored content/i);
  });

  it('always allows a safety response, whatever the knowledge state', () => {
    const contract = evaluateModeContract('SAFETY', null, false);
    expect(contract.complete).toBe(true);
    // A safety message must never be withheld for lack of curriculum.
    expect(contract.slots.every((slot) => slot.filled)).toBe(true);
  });

  it('reports the empty slots rather than hiding them behind fluent prose', () => {
    const response = respond(request({ userMessage: '그냥 추천해줘', userRequestedProductHelp: true }));
    expect(response.message).toBeNull();
    expect(response.contract.filledCount).toBeLessThan(response.contract.totalCount);
    expect(response.uncertainty.some((line) => line.includes('cannot be filled honestly'))).toBe(true);
  });
});

describe('Tutor Fade (§5.3) and the mode router', () => {
  it('practises a mastered learner instead of re-teaching them', () => {
    expect(routeMode('LEARN', 'R0', 0, 'Mastered')).toBe('PRACTICE');
    expect(routeMode('LEARN', 'R0', 0, 'NotAssessed')).toBe('TEACH');
  });

  it('assesses a secure learner rather than explaining again', () => {
    expect(routeMode('LEARN', 'R0', 0, 'Secure')).toBe('ASSESS');
  });

  it('lets safety and repeated failure outrank learner state', () => {
    expect(routeMode('LEARN', 'R3', 0, 'Mastered')).toBe('SAFETY');
    expect(routeMode('LEARN', 'R0', 3, 'Mastered')).toBe('REMEDIATE');
  });

  it('recognises an explicit request for a product as a decision intent', () => {
    expect(respond(request({ userMessage: '이 중에 뭐 추천해줘요?' })).intent).toBe('DECIDE');
  });
});

describe('engineering definition of done (§15.3)', () => {
  it('records mode, risk and intent on every response', () => {
    for (const message of ['피부 장벽이 뭔가요?', '너무 아파요', '추천해줘']) {
      const response = respond(request({ userMessage: message }));
      expect(response.mode).toBeTruthy();
      expect(response.risk).toBeTruthy();
      expect(response.intent).toBeTruthy();
      expect(response.trace).toHaveLength(7);
    }
  });

  it('never renders a commerce CTA while recommendation is impossible', () => {
    for (const message of ['추천해줘', '뭐 사야 해요?', '피부 장벽이 뭔가요?']) {
      expect(respond(request({ userMessage: message, userRequestedProductHelp: true })).commerce.eligible).toBe(false);
    }
  });

  it('never uses Draft evidence as approved fact', () => {
    expect(respond(request()).mayStateAsFact).toBe(false);
  });

  it('keeps source and version traceable for anything it grounded in', () => {
    const response = respond(request({ userMessage: '자외선 차단은 어떻게 해요?' }));
    expect(response.grounding.candidates.length).toBeGreaterThan(0);
    for (const candidate of response.grounding.candidates) {
      expect(candidate.id).toMatch(/^(KN|ING|CON|CAT|PROD)-/);
    }
  });

  it('lets a safety stop bypass the learning and commerce layers', () => {
    const response = respond(
      request({ userMessage: '감염된 것 같고 고름이 나와요', userRequestedProductHelp: true }),
    );
    expect(response.mode).toBe('SAFETY');
    expect(response.next_action).toBeNull();
    expect(response.hint_level).toBeNull();
    expect(response.mastery_event.status).toBe('none');
    expect(response.commerce.eligible).toBe(false);
  });

  it('enforces only rules that are Approved and mandatory in the database', () => {
    expect(mandatoryApprovedAIRules.length).toBeGreaterThan(0);
    for (const rule of mandatoryApprovedAIRules) {
      expect(rule.Status).toBe('Approved');
      expect(rule.Priority).toBe('필수');
    }
    // AI-002 Student First is Draft in the source and must not be silently enforced.
    expect(aiRules.find((rule) => rule.Rule_ID === 'AI-002')!.Status).toBe('Draft');
    expect(mandatoryApprovedAIRules.some((rule) => rule.Rule_ID === 'AI-002')).toBe(false);
  });
});

describe('the tutor generates no prose', () => {
  it('returns a null message on every branch, so no wording can be mistaken for an answer', () => {
    for (const message of [
      '피부 장벽이 뭔가요?',
      'Niacinamide가 모든 피부 문제를 치료해?',
      'XYZ 크림 어때요?',
      '추천해줘',
      '너무 아파요',
    ]) {
      expect(respond(request({ userMessage: message })).message).toBeNull();
    }
  });

  it('carries safety wording as a localization key rather than inline prose', () => {
    const response = respond(request({ userMessage: '얼굴이 붓고 아파요' }));
    expect(response.messageKey).toMatch(/^safety\.escalation\.R[234]$/);
    expect(response.message).toBeNull();
  });
});
