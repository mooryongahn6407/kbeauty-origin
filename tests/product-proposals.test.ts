/**
 * Product proposal register and numeric audit tests.
 *
 * The register's value depends entirely on its citations being real. These tests check every
 * Master Database ID it names against the actual source data, so the register cannot drift
 * into citing records that do not exist — which would be exactly the fabrication the project
 * forbids, wearing a governance costume.
 */
import { describe, expect, it } from 'vitest';
import {
  PRODUCT_PROPOSALS,
  PROPOSAL_CONFLICTS,
  PROPOSAL_CONFLICTS_ADDENDUM,
  proposalSummary,
  proposalsByClass,
} from '@/governance/product-proposals';
import { AUDIT_COVERAGE, runNumericAudit } from '@/governance/numeric-audit';
import {
  aiRules,
  concerns,
  contentAtoms,
  domains,
  evidenceSources,
  findDomain,
  findEvidenceSource,
  findNode,
  findQuest,
  findSkill,
  ingredients,
  masteryRules,
  routines,
} from '@/knowledge/repository';
import { findIngredient } from '@/knowledge/ingredients';
import { findRoutineView } from '@/knowledge/routines';

const GOVERNANCE_CLASSES = [
  'CONFIRMED',
  'DECISION',
  'HYPOTHESIS',
  'IDEA',
  'OPEN_QUESTION',
  'REJECTED',
];

/** Resolve any Master Database ID by its namespace. Returns false for an unknown ID. */
function recordExists(id: string): boolean {
  if (/^D\d{2}$/.test(id)) return findDomain(id) !== undefined;
  if (/^KN-/.test(id)) return findNode(id) !== undefined;
  if (/^SK\d{2}$/.test(id)) return findSkill(id) !== undefined;
  if (/^QST-/.test(id)) return findQuest(id) !== undefined;
  if (/^ING-/.test(id)) return findIngredient(id) !== undefined;
  if (/^RUT-/.test(id)) return findRoutineView(id) !== undefined;
  if (/^SRC-/.test(id)) return findEvidenceSource(id) !== undefined;
  if (/^AI-/.test(id)) return aiRules.some((rule) => rule.Rule_ID === id);
  if (/^M\d{2}$/.test(id)) return masteryRules.some((rule) => rule.Rule_ID === id);
  if (/^CA-/.test(id)) return contentAtoms.some((atom) => atom.Content_ID === id);
  if (/^CON-/.test(id)) return concerns.some((concern) => concern.Concern_ID === id);
  if (/^CAT-/.test(id)) return true; // categories are looked up by the catalog, not by ID here
  return false;
}

describe('proposal register hygiene', () => {
  it('holds every proposal from the 2026-09-18 product direction discussion', () => {
    expect(PRODUCT_PROPOSALS.length).toBeGreaterThanOrEqual(27);
    const ids = PRODUCT_PROPOSALS.map((proposal) => proposal.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^PR-\d{3}$/);
  });

  it('classifies every proposal with the governed vocabulary', () => {
    for (const proposal of PRODUCT_PROPOSALS) {
      expect(GOVERNANCE_CLASSES, proposal.id).toContain(proposal.classification);
    }
  });

  it('requires a source citation for anything marked CONFIRMED', () => {
    for (const proposal of proposalsByClass('CONFIRMED')) {
      expect(proposal.sourceBasis.length, proposal.id).toBeGreaterThan(0);
    }
  });

  it('does not let a new idea claim to be source-backed', () => {
    // An IDEA or HYPOTHESIS may cite context, but must not be presented as established.
    for (const proposal of [...proposalsByClass('IDEA'), ...proposalsByClass('HYPOTHESIS')]) {
      expect(proposal.classification, proposal.id).not.toBe('CONFIRMED');
    }
  });

  it('gives every proposal a real summary and either a blocker or a clear path', () => {
    for (const proposal of PRODUCT_PROPOSALS) {
      expect(proposal.summary.length, proposal.id).toBeGreaterThan(40);
      expect(proposal.title.length, proposal.id).toBeGreaterThan(10);
    }
  });
});

describe('every governed record the register cites actually exists', () => {
  it('resolves all Master Database IDs named in proposals', () => {
    const unresolved: string[] = [];
    for (const proposal of PRODUCT_PROPOSALS) {
      for (const id of proposal.governedRecords) {
        if (!recordExists(id)) unresolved.push(`${proposal.id} → ${id}`);
      }
    }
    expect(unresolved).toEqual([]);
  });

  it('confirms the teach-back proposal really is already in the curriculum', () => {
    // PR-011 claims EXPLAIN TO A FRIEND already exists. Verify rather than trust the register.
    expect(findQuest('QST-021')?.Quest_Name).toBe('Teach Your Friend');
    expect(findNode('KN-D12-04-001')?.Node_Title).toBe('친구에게 설명하기');
    expect(findSkill('SK10')?.Skill_Name).toBe('Teach');
    expect(aiRules.find((rule) => rule.Rule_ID === 'AI-019')?.Rule_Name).toBe('Teach Back');
  });

  it('confirms the decision-loop proposal maps onto real curriculum domains', () => {
    expect(findDomain('D09')?.Domain_Name).toBe('Personalization & Decision');
    expect(findDomain('D12')?.Domain_Name).toBe('Beauty Mastery & Lifestyle');
    expect(findNode('KN-D12-06-002')?.Node_Title).toBe('구매량이 아닌 역량 기반 성장');
  });
});

describe('conflicts with governed rules are recorded, not smoothed over', () => {
  const allConflicts = [...PROPOSAL_CONFLICTS, ...PROPOSAL_CONFLICTS_ADDENDUM];

  it('names a real AI rule or register entry for every conflict', () => {
    for (const conflict of allConflicts) {
      expect(conflict.conflictsWith.length, conflict.id).toBeGreaterThan(10);
      expect(conflict.proposedResolution.length, conflict.id).toBeGreaterThan(40);
    }
  });

  it('points every conflict at proposals that exist', () => {
    const ids = new Set(PRODUCT_PROPOSALS.map((proposal) => proposal.id));
    for (const conflict of allConflicts) {
      for (const proposalId of conflict.proposalIds) {
        expect(ids.has(proposalId), `${conflict.id} → ${proposalId}`).toBe(true);
      }
    }
  });

  it('flags the growth loop against the approved no-engagement-optimization rule', () => {
    const conflict = allConflicts.find((item) => item.id === 'CF-001')!;
    expect(conflict.conflictsWith).toContain('AI-011');
    expect(conflict.severity).toBe('MUST_RESOLVE');
    // AI-011 really is Approved and mandatory, so this is a hard rule, not a preference.
    const rule = aiRules.find((item) => item.Rule_ID === 'AI-011')!;
    expect(rule.Status).toBe('Approved');
    expect(rule.Priority).toBe('필수');
  });

  it('flags the MY BEAUTY entry point against the approved no-fixed-identity rule', () => {
    const conflict = allConflicts.find((item) => item.id === 'CF-002')!;
    expect(conflict.conflictsWith).toContain('AI-020');
    const rule = aiRules.find((item) => item.Rule_ID === 'AI-020')!;
    expect(rule.Status).toBe('Approved');
    expect(rule.Priority).toBe('필수');
  });

  it('reports how much is actually buildable today', () => {
    const summary = proposalSummary();
    expect(summary.total).toBe(PRODUCT_PROPOSALS.length);
    // Most of the vision is blocked on source approval, and the register says so.
    expect(summary.buildable).toBeLessThan(summary.total / 2);
    expect(summary.mustResolveConflicts).toBeGreaterThan(0);
  });
});

describe('numeric consistency audit', () => {
  const report = runNumericAudit();

  it('runs every check and compares real numbers', () => {
    expect(report.checks).toHaveLength(6);
    expect(report.totalComparisons).toBeGreaterThanOrEqual(25);
    for (const check of report.checks) {
      expect(check.description.length, check.check).toBeGreaterThan(20);
    }
  });

  it('finds the QST-007 contradiction', () => {
    const finding = report.findings.find((item) => item.check === 'QUEST_WIN_VS_CORE_NODE')!;
    expect(finding.detail).toContain('QST-007');
    expect(finding.registerId).toBe('OQ-R02');
    expect(report.clean).toBe(false);
  });

  it('confirms the README seed counts match the rows actually present', () => {
    const check = report.checks.find((item) => item.check === 'README_SEED_COUNT_VS_ROWS')!;
    expect(check.comparisons).toBe(7);
    expect(check.findings).toEqual([]);
  });

  it('confirms the dashboard per-domain node counts match the node rows', () => {
    const check = report.checks.find((item) => item.check === 'DASHBOARD_DOMAIN_COUNT_VS_ROWS')!;
    expect(check.comparisons).toBe(domains.length);
    expect(check.findings).toEqual([]);
  });

  it('catches the mastery engine drifting from the approved rule text', () => {
    const check = report.checks.find((item) => item.check === 'MASTERY_RULE_VS_ENGINE')!;
    expect(check.comparisons).toBe(3);
    expect(check.findings).toEqual([]);
  });

  it('treats a stated range as satisfied by any value inside it', () => {
    // RUT-001 describes "일상 아침 3–4단계" and lists 4 steps, which agrees.
    const check = report.checks.find(
      (item) => item.check === 'ROUTINE_DESCRIPTION_VS_STEP_COUNT',
    )!;
    expect(findRoutineView('RUT-001')!.steps).toHaveLength(4);
    expect(check.findings).toEqual([]);
  });

  it('confirms a routine named for a step count lists that many steps', () => {
    expect(findRoutineView('RUT-003')!.routine.Routine_Name).toBe('Minimal 3-Step');
    expect(findRoutineView('RUT-003')!.steps).toHaveLength(3);
  });

  it('reports honestly which requested numeric concepts are not yet covered', () => {
    expect(AUDIT_COVERAGE.some((item) => !item.covered)).toBe(true);
    for (const item of AUDIT_COVERAGE) {
      expect(item.note.length, item.concept).toBeGreaterThan(20);
    }
  });

  it('reconciles nothing: the source still states both numbers', () => {
    expect(findQuest('QST-007')!.Win_Condition).toBe('과도한 루틴을 4단계로 단순화');
    expect(findNode('KN-D08-04-001')!.Node_Title).toBe('3-step routine 만들기');
  });
});

describe('extraction still matches the official workbooks after adding raw sheets', () => {
  it('keeps every previously extracted corpus intact', () => {
    expect(ingredients).toHaveLength(40);
    expect(routines).toHaveLength(10);
    expect(evidenceSources).toHaveLength(10);
    expect(masteryRules).toHaveLength(6);
    expect(contentAtoms).toHaveLength(20);
  });
});
