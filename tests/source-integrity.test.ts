/**
 * Source discipline regression tests.
 *
 * These are the tests that fail if someone "fixes" a source problem in code instead of
 * escalating it to governance: renaming an ID, inventing a missing node, or promoting a
 * Draft record to Approved.
 */
import { describe, expect, it } from 'vitest';
import manifest from '../data/source/_manifest.json';
import {
  aiRules,
  contentAtoms,
  domains,
  evidenceSources,
  ingredients,
  knowledgeNodes,
  masteryRules,
  products,
  quests,
  repositoryCounts,
  skills,
} from '@/knowledge/repository';
import { masterDbStrands } from '@/knowledge/strand-taxonomy';
import { findDanglingReferences } from '@/governance/integrity';

describe('extracted source data matches the official Master Database', () => {
  // Counts from 99_DASHBOARD of KOREA_GLOW_Beauty_Knowledge_Master_Database_v1.0.xlsx.
  it('holds exactly the record counts the source dashboard states', () => {
    expect(repositoryCounts).toEqual({
      domains: 12,
      knowledgeNodes: 212,
      skills: 12,
      ingredients: 40,
      concerns: 15,
      productCategories: 32,
      routines: 10,
      quests: 25,
      aiRules: 20,
      evidenceSources: 10,
      contentAtoms: 20,
      masteryRules: 6,
      products: 10,
    });
    expect(masterDbStrands).toHaveLength(92);
  });

  it('records the sha256 of every official workbook it extracted', () => {
    expect(manifest.sourceFiles.length).toBeGreaterThanOrEqual(2);
    for (const file of manifest.sourceFiles) {
      expect(file.sha256).toMatch(/^[0-9a-f]{64}$/);
    }
  });

  it('preserves every source ID namespace unchanged', () => {
    expect(domains.every((d) => /^D\d{2}$/.test(d.Domain_ID))).toBe(true);
    expect(masterDbStrands.every((s) => /^D\d{2}-\d{2}$/.test(s.Strand_ID))).toBe(true);
    expect(knowledgeNodes.every((n) => /^KN-D\d{2}-\d{2}-\d{3}$/.test(n.Node_ID))).toBe(true);
    expect(skills.every((s) => /^SK\d{2}$/.test(s.Skill_ID))).toBe(true);
    expect(quests.every((q) => /^QST-\d{3}$/.test(q.Quest_ID))).toBe(true);
    expect(ingredients.every((i) => /^ING-\d{3}$/.test(i.Ingredient_ID))).toBe(true);
    expect(aiRules.every((r) => /^AI-\d{3}$/.test(r.Rule_ID))).toBe(true);
    expect(masteryRules.every((r) => /^M\d{2}$/.test(r.Rule_ID))).toBe(true);
    expect(contentAtoms.every((a) => /^CA-\d{3}$/.test(a.Content_ID))).toBe(true);
  });

  it('contains no duplicate primary IDs', () => {
    const unique = <T>(items: readonly T[], key: (item: T) => string) =>
      new Set(items.map(key)).size === items.length;
    expect(unique(knowledgeNodes, (n) => n.Node_ID)).toBe(true);
    expect(unique(masterDbStrands, (s) => s.Strand_ID)).toBe(true);
    expect(unique(quests, (q) => q.Quest_ID)).toBe(true);
    expect(unique(evidenceSources, (e) => e.Source_ID)).toBe(true);
  });

  it('keeps every knowledge node attached to a domain that exists', () => {
    const domainIds = new Set(domains.map((domain) => domain.Domain_ID));
    const orphans = knowledgeNodes.filter((node) => !domainIds.has(node.Domain_ID));
    expect(orphans).toEqual([]);
  });
});

describe('approval state is read from the source, never inferred', () => {
  it('reports every knowledge node as Draft, as the source dashboard states', () => {
    const statuses = new Set(knowledgeNodes.map((node) => node.Status));
    expect([...statuses]).toEqual(['Draft']);
  });

  it('reports the source evidence split of 92 Anchor and 120 To Review', () => {
    const anchor = knowledgeNodes.filter((n) => n.Evidence_Status === 'Anchor').length;
    const toReview = knowledgeNodes.filter((n) => n.Evidence_Status === 'To Review').length;
    expect({ anchor, toReview }).toEqual({ anchor: 92, toReview: 120 });
  });

  it('leaves all product rows as unusable Template records', () => {
    expect(products.every((product) => product.Status === 'Template')).toBe(true);
  });
});

describe('referential integrity is reported, not repaired', () => {
  it('still reports exactly the dangling node references the register records', () => {
    const missing = [...new Set(findDanglingReferences().map((ref) => ref.missingId))].sort();
    // SR-004 … SR-007. If this list changes, a source record was created, renamed or deleted.
    expect(missing).toEqual([
      'KN-D04-02-003',
      'KN-D05-02-003',
      'KN-D06-08-003',
      'KN-D06-08-004',
      'KN-D06-09-003',
    ]);
  });

  it('maps each dangling reference to its register entry', () => {
    for (const reference of findDanglingReferences()) {
      expect(reference.registerId).toMatch(/^SR-00[4-7]$/);
    }
  });

  it('does not invent the missing nodes in the repository', () => {
    const nodeIds = new Set(knowledgeNodes.map((node) => node.Node_ID));
    expect(nodeIds.has('KN-D05-02-003')).toBe(false);
    expect(nodeIds.has('KN-D04-02-003')).toBe(false);
  });
});
