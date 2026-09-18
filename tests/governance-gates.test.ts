/**
 * Status / evidence / safety gate tests.
 * Source: 01_TECHNICAL_IMPLEMENTATION_SPEC_v1.0.md §3 and §7, AI Tutor Constitution §7-§8.
 */
import { describe, expect, it } from 'vitest';
import {
  assertMayStateAsFact,
  evaluatePublication,
} from '@/governance/publication-gate';
import { knowledgeNodeStatusBreakdown } from '@/governance/status-report';
import { knowledgeNodes, products } from '@/knowledge/repository';
import {
  classifyRisk,
  decideForTier,
  evaluateRecommendationGates,
} from '@/safety/safety-gate';

describe('publication gate', () => {
  it('allows a fact only when Approved AND Verified', () => {
    const decision = evaluatePublication({ Status: 'Approved', Evidence_Status: 'Verified' });
    expect(decision.mode).toBe('VERIFIED_FACT');
    expect(decision.mayStateAsFact).toBe(true);
    expect(decision.disclosures).toEqual([]);
  });

  it('treats Anchor evidence as insufficient even when the record is Approved', () => {
    const decision = evaluatePublication({ Status: 'Approved', Evidence_Status: 'Anchor' });
    expect(decision.mayStateAsFact).toBe(false);
    expect(decision.mode).toBe('PENDING_VERIFICATION');
  });

  it('never promotes Draft or Review records', () => {
    for (const status of ['Draft', 'Review'] as const) {
      const decision = evaluatePublication({ Status: status, Evidence_Status: 'Verified' });
      expect(decision.mayStateAsFact).toBe(false);
    }
  });

  it('blocks Archived and Template records from rendering at all', () => {
    expect(evaluatePublication({ Status: 'Archived' }).mode).toBe('BLOCKED');
    expect(evaluatePublication({ Status: 'Template' }).mode).toBe('BLOCKED');
  });

  it('attaches a caution disclosure to everything pending verification', () => {
    const decision = evaluatePublication({ Status: 'Draft', Evidence_Status: 'To Review' });
    expect(decision.disclosures.map((d) => d.code)).toContain('PENDING_VERIFICATION');
    expect(decision.disclosures.every((d) => d.severity === 'caution')).toBe(true);
  });

  it('throws when a render path tries to state unverified content as fact', () => {
    expect(() => assertMayStateAsFact({ Status: 'Draft' }, 'test render')).toThrow(
      /Refusing to state unverified content as fact/,
    );
  });
});

describe('the current corpus cannot produce a single verified fact', () => {
  it('reports zero knowledge nodes eligible to be stated as fact', () => {
    const breakdown = knowledgeNodeStatusBreakdown();
    expect(breakdown.total).toBe(212);
    expect(breakdown.mayStateAsFact).toBe(0);
  });

  it('gates every node and product without exception', () => {
    expect(knowledgeNodes.every((node) => !evaluatePublication(node).mayStateAsFact)).toBe(true);
    expect(products.every((product) => evaluatePublication(product).mode === 'BLOCKED')).toBe(true);
  });
});

describe('safety gate', () => {
  it('classifies ordinary educational text as R0 and allows commerce', () => {
    const decision = classifyRisk('What does a humectant do?');
    expect(decision.tier).toBe('R0');
    expect(decision.allowLearning).toBe(true);
    expect(decision.allowCommerce).toBe(true);
    expect(decision.escalate).toBe(false);
  });

  it('stops commerce and escalates on a severe-reaction report (Constitution §7.2, T05)', () => {
    const decision = classifyRisk('이 제품 바르고 얼굴이 너무 아프고 붓는 것 같아');
    expect(['R2', 'R3']).toContain(decision.tier);
    expect(decision.allowCommerce).toBe(false);
    expect(decision.escalate).toBe(true);
    expect(decision.messageKey).toMatch(/^safety\.escalation\.R[234]$/);
  });

  it('takes the highest matching tier rather than the first', () => {
    const decision = classifyRisk('통증도 있고 감염 같아요');
    expect(decision.tier).toBe('R3');
  });

  it('ends the learning flow entirely at R4', () => {
    const decision = decideForTier('R4');
    expect(decision.allowLearning).toBe(false);
    expect(decision.allowCommerce).toBe(false);
  });

  it('always attaches the not-medical-advice disclosure', () => {
    expect(classifyRisk('anything').disclosures.map((d) => d.code)).toContain('NOT_MEDICAL_ADVICE');
  });

  it('routes a treatment-claim request away from a simple answer (T01)', () => {
    const decision = classifyRisk('이 크림이 여드름을 치료해?');
    expect(decision.escalate).toBe(true);
    expect(decision.allowCommerce).toBe(false);
  });
});

describe('recommendation eligibility gates G1-G6', () => {
  const passing = {
    userRequestedProductHelp: true,
    hasMinimumContext: true,
    productDataVerified: true,
    risk: 'R0',
    disclosesCommercialRelationship: true,
    offersAlternatives: true,
  } as const;

  it('passes only when every gate passes', () => {
    expect(evaluateRecommendationGates(passing).eligible).toBe(true);
  });

  it('fails G3 while the product master holds only unverified template rows (SR-011)', () => {
    const result = evaluateRecommendationGates({ ...passing, productDataVerified: false });
    expect(result.eligible).toBe(false);
    expect(result.failedGates).toContain('G3_EVIDENCE');
  });

  it('fails G4 at R2 and above, whatever else passes', () => {
    for (const risk of ['R2', 'R3', 'R4'] as const) {
      const result = evaluateRecommendationGates({ ...passing, risk });
      expect(result.failedGates).toContain('G4_SAFETY');
      expect(result.eligible).toBe(false);
    }
  });

  it('fails G1 when the learner only asked a learning question (T09)', () => {
    const result = evaluateRecommendationGates({ ...passing, userRequestedProductHelp: false });
    expect(result.failedGates).toContain('G1_USER_INTENT');
  });
});
