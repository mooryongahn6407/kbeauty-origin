/**
 * Referential integrity reporting.
 *
 * SOURCE_RECONCILIATION_MASTER_REGISTER §5.1 lists known dangling references
 * (SR-004..SR-007) and notes: "These are integrity observations, not mutation instructions.
 * No record should be deleted, created, merged or renamed until lineage is confirmed."
 *
 * This module therefore only *reports*. It never creates a missing node, never drops a link,
 * and never rewrites an ID. Screens that traverse a broken link render the gap honestly.
 */
import {
  evidenceSources,
  findEvidenceSource,
  findNode,
  findQuest,
  ingredients,
  knowledgeNodes,
  nodeRoutineLinks,
  questNodeLinks,
  routines,
} from '@/knowledge/repository';
import { masterDbStrands } from '@/knowledge/strand-taxonomy';

export interface DanglingReference {
  /** Which relation sheet the broken link lives in. */
  readonly relation: 'QUEST_TO_NODE' | 'NODE_ROUTINE_MAP';
  readonly fromId: string;
  readonly missingId: string;
  readonly role: string;
  /** Register entry that already records this observation, when one exists. */
  readonly registerId: string | null;
}

/** Register entries from SOURCE_RECONCILIATION_MASTER_REGISTER §4, keyed by missing node ID. */
const REGISTER_BY_MISSING_NODE: Readonly<Record<string, string>> = {
  'KN-D05-02-003': 'SR-004',
  'KN-D06-08-003': 'SR-005',
  'KN-D06-08-004': 'SR-005',
  'KN-D06-09-003': 'SR-006',
  'KN-D04-02-003': 'SR-007',
};

/** Every quest/routine link whose target node ID does not exist in 03_KNOWLEDGE_NODES. */
export function findDanglingReferences(): readonly DanglingReference[] {
  const routineIds = new Set(routines.map((routine) => routine.Routine_ID));
  const dangling: DanglingReference[] = [];

  for (const link of questNodeLinks) {
    if (!findNode(link.Node_ID)) {
      dangling.push({
        relation: 'QUEST_TO_NODE',
        fromId: link.Quest_ID,
        missingId: link.Node_ID,
        role: link.Role,
        registerId: REGISTER_BY_MISSING_NODE[link.Node_ID] ?? null,
      });
    }
  }

  for (const link of nodeRoutineLinks) {
    if (!findNode(link.Node_ID)) {
      dangling.push({
        relation: 'NODE_ROUTINE_MAP',
        fromId: link.Routine_ID,
        missingId: link.Node_ID,
        role: link.Relationship,
        registerId: REGISTER_BY_MISSING_NODE[link.Node_ID] ?? null,
      });
    }
    if (!routineIds.has(link.Routine_ID)) {
      dangling.push({
        relation: 'NODE_ROUTINE_MAP',
        fromId: link.Node_ID,
        missingId: link.Routine_ID,
        role: link.Relationship,
        registerId: null,
      });
    }
  }

  for (const link of questNodeLinks) {
    if (!findQuest(link.Quest_ID)) {
      dangling.push({
        relation: 'QUEST_TO_NODE',
        fromId: link.Node_ID,
        missingId: link.Quest_ID,
        role: link.Role,
        registerId: null,
      });
    }
  }

  return dangling;
}

/** True when a quest can be run without traversing a broken reference. */
export function questHasCompleteReferences(questId: string): boolean {
  return findDanglingReferences().every((reference) => reference.fromId !== questId);
}

/* -------------------------------------------------------------------------- *
 * Evidence reference integrity (observed 2026-09-18, registered as OQ-E01)
 * -------------------------------------------------------------------------- */

export interface UnresolvedEvidenceReference {
  readonly nodeId: string;
  /** The Source_ID the node carries, verbatim. */
  readonly sourceId: string;
  readonly evidenceStatus: string;
}

/**
 * Knowledge nodes whose `Source_ID` does not exist in 14_EVIDENCE.
 *
 * Observed condition: the 92 nodes that carry a Source_ID use the AI Tutor Constitution §17
 * label namespace (FDA-01, EU-01, AAD-01..03), while 14_EVIDENCE registers SRC-001..SRC-010.
 * The two namespaces were never reconciled, so no node's evidence claim currently resolves.
 *
 * This function reports; it never rewrites a Source_ID or guesses a mapping. Mapping
 * FDA-01 onto SRC-005 (say) looks obvious but is a governance decision about which document
 * a claim was actually anchored to, and getting it wrong would attach a node to the wrong
 * evidence — the precise failure the trust layer exists to prevent.
 */
export function findUnresolvedEvidenceReferences(): readonly UnresolvedEvidenceReference[] {
  return knowledgeNodes
    .filter((node) => node.Source_ID.trim() !== '' && !findEvidenceSource(node.Source_ID))
    .map((node) => ({
      nodeId: node.Node_ID,
      sourceId: node.Source_ID,
      evidenceStatus: node.Evidence_Status,
    }));
}

export interface EvidenceReferenceReport {
  readonly nodesWithSourceId: number;
  readonly nodesWithoutSourceId: number;
  readonly resolved: number;
  readonly unresolved: number;
  /** Distinct Source_ID values used by nodes but absent from the registry. */
  readonly unknownSourceIds: readonly string[];
  /** Source_IDs the registry defines. */
  readonly registeredSourceIds: readonly string[];
}

export function evidenceReferenceReport(): EvidenceReferenceReport {
  const withSourceId = knowledgeNodes.filter((node) => node.Source_ID.trim() !== '');
  const unresolved = findUnresolvedEvidenceReferences();

  return {
    nodesWithSourceId: withSourceId.length,
    nodesWithoutSourceId: knowledgeNodes.length - withSourceId.length,
    resolved: withSourceId.length - unresolved.length,
    unresolved: unresolved.length,
    unknownSourceIds: [...new Set(unresolved.map((reference) => reference.sourceId))].sort(),
    registeredSourceIds: evidenceSources.map((source) => source.Source_ID),
  };
}

/* -------------------------------------------------------------------------- *
 * Suspected strand misplacement (observed 2026-09-18, registered as OQ-S01)
 * -------------------------------------------------------------------------- */

export interface SuspectedStrandMisplacement {
  readonly nodeId: string;
  readonly nodeTitle: string;
  readonly filedUnderStrandCode: string;
  readonly filedUnderStrandName: string;
  /** The governed ingredient whose name appears in the node title. */
  readonly matchedIngredientId: string;
  readonly matchedIngredientName: string;
  /** That ingredient's Family, from 06_INGREDIENTS. */
  readonly ingredientFamily: string;
  /** The strand in the same domain whose name matches that family. */
  readonly suggestedStrandCode: string;
  readonly suggestedStrandName: string;
}

const normalise = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]+/g, '');

/**
 * Nodes that appear to be filed under the wrong strand.
 *
 * Method — deliberately data-driven, using only governed vocabulary so the result is
 * reproducible and carries no reviewer opinion:
 *
 *   1. Find a governed ingredient (06_INGREDIENTS) whose name appears in the node title.
 *   2. Take that ingredient's `Family`.
 *   3. Look for a strand IN THE SAME DOMAIN whose `Strand_Name` matches that family.
 *   4. If such a strand exists and it is NOT the strand the node is filed under, report it.
 *
 * Scope limits, stated honestly: this only catches nodes whose title spells out an ingredient
 * name that the ingredient sheet also contains, and only where a family maps onto a strand
 * name by containment. A node titled "Vitamin C의 기본 개념" is not caught, because no
 * ingredient is literally named "Vitamin C". The real misplacement set is therefore at least
 * as large as what this reports, never smaller.
 *
 * Nothing is corrected. Every result is a SUSPICION requiring owner confirmation, because
 * the fix could equally be to move the node, rename the strand, or re-title the node — and
 * only a curriculum owner can decide which.
 */
export function findSuspectedStrandMisplacements(): readonly SuspectedStrandMisplacement[] {
  const found: SuspectedStrandMisplacement[] = [];

  for (const node of knowledgeNodes) {
    const title = node.Node_Title.toLowerCase();

    // Prefer the longest matching ingredient name so "Ceramide NP" wins over a shorter token.
    const matched = ingredients
      .filter((ingredient) => {
        const name = ingredient.Ingredient_Name.toLowerCase();
        return name.length >= 4 && title.includes(name);
      })
      .sort((a, b) => b.Ingredient_Name.length - a.Ingredient_Name.length)[0];
    if (!matched) continue;

    const family = normalise(matched.Family);
    if (!family) continue;

    const suggested = masterDbStrands.find(
      (strand) =>
        strand.Domain_ID === node.Domain_ID && normalise(strand.Strand_Name).includes(family),
    );
    if (!suggested || suggested.Strand_Code === node.Strand_Code) continue;

    found.push({
      nodeId: node.Node_ID,
      nodeTitle: node.Node_Title,
      filedUnderStrandCode: node.Strand_Code,
      filedUnderStrandName: node.Strand_Name,
      matchedIngredientId: matched.Ingredient_ID,
      matchedIngredientName: matched.Ingredient_Name,
      ingredientFamily: matched.Family,
      suggestedStrandCode: suggested.Strand_Code,
      suggestedStrandName: suggested.Strand_Name,
    });
  }

  return found;
}
