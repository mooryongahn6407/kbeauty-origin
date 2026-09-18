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
  findNode,
  findQuest,
  nodeRoutineLinks,
  questNodeLinks,
  routines,
} from '@/knowledge/repository';

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
