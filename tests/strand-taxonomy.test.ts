/**
 * Strand taxonomy tests — the 58-vs-92 governance guard.
 *
 * The handoff command: "Do NOT choose one. Do NOT rewrite either source."
 * These tests fail if a future change picks a canonical set in code, drops rows to make the
 * numbers agree, or renames a strand code.
 */
import { describe, expect, it } from 'vitest';
import {
  CANONICAL_TAXONOMY_ID,
  CURRICULUM_DOCUMENT_STATED_STRAND_COUNT,
  SR_001,
  STRAND_TAXONOMY_VIEWS,
  masterDbStrands,
  resolveStrandView,
  strandMappings,
  summariseStrandReconciliation,
  uncodedCurriculumGroupings,
} from '@/knowledge/strand-taxonomy';
import { OPEN_GOVERNANCE_ITEMS, openItemsBySeverity } from '@/governance/open-items';
import { translate } from '@/localization/messages';

describe('neither strand representation has been chosen', () => {
  it('leaves the canonical taxonomy undecided', () => {
    expect(CANONICAL_TAXONOMY_ID).toBeNull();
  });

  it('registers both representations side by side', () => {
    expect(STRAND_TAXONOMY_VIEWS.map((view) => view.id)).toEqual([
      'master-db-v1.0',
      'curriculum-coded-v1.0',
    ]);
  });

  it('keeps all three source numbers visible instead of reconciling them', () => {
    const summary = summariseStrandReconciliation();
    expect(summary.dbRowCount).toBe(92);
    expect(summary.curriculumCodedRowCount).toBe(41);
    expect(summary.curriculumDocumentStatedCount).toBe(CURRICULUM_DOCUMENT_STATED_STRAND_COUNT);
    expect(summary.curriculumDocumentStatedCount).toBe(58);
  });

  it('never presents the working view as canonical', () => {
    const resolved = resolveStrandView();
    expect(resolved.isCanonical).toBe(false);
    expect(resolved.disclosures.map((d) => d.code)).toContain('WORKING_DATASET');
    expect(resolved.openItem?.id).toBe(SR_001.id);
  });

  it('gives the working-dataset disclosure real user-facing text in every UI locale', () => {
    for (const locale of ['en', 'ko']) {
      expect(translate('disclosure.workingDataset', locale).length).toBeGreaterThan(10);
    }
  });
});

describe('source rows survive unchanged', () => {
  it('keeps all 92 database strand rows with their original IDs and codes', () => {
    expect(masterDbStrands).toHaveLength(92);
    const first = masterDbStrands[0]!;
    expect(first.Strand_ID).toBe('D01-01');
    expect(first.Strand_Code).toBe('01.1');
    expect(first.Strand_Name).toBe('Skin Map');
  });

  it('preserves the strand code anomalies the register flagged (SR-008)', () => {
    // SR-008 notes D06-10 and D07-10 carry unexpected codes. They are kept, not corrected.
    const d0610 = masterDbStrands.find((strand) => strand.Strand_ID === 'D06-10');
    const d0710 = masterDbStrands.find((strand) => strand.Strand_ID === 'D07-10');
    expect(d0610).toBeDefined();
    expect(d0710).toBeDefined();
  });

  it('keeps the working mapping including every unresolved row', () => {
    expect(strandMappings).toHaveLength(92);
    const summary = summariseStrandReconciliation();
    expect(summary.exactMatches).toBe(35);
    expect(summary.namingVariations).toBe(4);
    expect(summary.openMappings).toBe(53);
    expect(summary.exactMatches + summary.namingVariations + summary.openMappings).toBe(92);
  });

  it('keeps the uncoded curriculum groupings that require a decision', () => {
    expect(uncodedCurriculumGroupings).toHaveLength(5);
  });
});

describe('open governance register', () => {
  it('carries the blocking items from the reconciliation register', () => {
    const ids = OPEN_GOVERNANCE_ITEMS.map((item) => item.id).join(' ');
    expect(ids).toContain('SR-009');
    expect(ids).toContain('SR-011');
    expect(ids).toContain('SR-014');
    expect(ids).toContain('SR-001');
  });

  it('classifies every item with the governance vocabulary', () => {
    for (const item of OPEN_GOVERNANCE_ITEMS) {
      expect(['CONFIRMED', 'DECISION', 'HYPOTHESIS', 'IDEA', 'OPEN_QUESTION', 'REJECTED']).toContain(
        item.classification,
      );
      expect(item.engineeringPosture.length).toBeGreaterThan(20);
    }
  });

  it('sorts blockers first so the most severe item is visible', () => {
    expect(openItemsBySeverity()[0]!.severity).toBe('BLOCKER');
  });
});
