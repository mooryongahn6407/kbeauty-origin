/**
 * Governance reporting used by the Content Governance screen and by tests.
 * Counts are derived from the extracted source data, never asserted by hand.
 */
import { contentAtoms, ingredients, knowledgeNodes, products, quests } from '@/knowledge/repository';
import { evaluatePublication } from './publication-gate';

export interface StatusBreakdown {
  readonly total: number;
  readonly byStatus: Readonly<Record<string, number>>;
  readonly byEvidenceStatus: Readonly<Record<string, number>>;
  readonly mayStateAsFact: number;
}

const tally = (values: readonly string[]): Record<string, number> =>
  values.reduce<Record<string, number>>((acc, value) => {
    const key = value || '(blank)';
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

export function knowledgeNodeStatusBreakdown(): StatusBreakdown {
  return {
    total: knowledgeNodes.length,
    byStatus: tally(knowledgeNodes.map((node) => node.Status)),
    byEvidenceStatus: tally(knowledgeNodes.map((node) => node.Evidence_Status)),
    mayStateAsFact: knowledgeNodes.filter((node) => evaluatePublication(node).mayStateAsFact).length,
  };
}

export function corpusStatusBreakdown() {
  return {
    knowledgeNodes: knowledgeNodeStatusBreakdown(),
    ingredients: {
      total: ingredients.length,
      byStatus: tally(ingredients.map((item) => item.Status)),
      mayStateAsFact: ingredients.filter((item) => evaluatePublication(item).mayStateAsFact).length,
    },
    products: {
      total: products.length,
      byStatus: tally(products.map((item) => item.Status)),
      mayStateAsFact: products.filter((item) => evaluatePublication(item).mayStateAsFact).length,
    },
    quests: { total: quests.length, byStatus: tally(quests.map((item) => item.Status)) },
    contentAtoms: { total: contentAtoms.length, byStatus: tally(contentAtoms.map((item) => item.Status)) },
  };
}
