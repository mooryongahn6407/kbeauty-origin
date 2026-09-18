/**
 * Routine repository — the knowledge layer behind Routine Studio.
 *
 * Source: Master DB 09_ROUTINES (10 rows), 10_NODE_ROUTINE_MAP (16 links), Domain D08,
 * Quest QST-007 "Routine Rescue".
 *
 * Two properties of the source shape everything here:
 *
 *   1. 09_ROUTINES has columns Routine_ID, Routine_Name, Description, Default_Sequence and
 *      Status — and **no evidence linkage column at all**. All 10 rows are Status=Approved,
 *      yet a Default_Sequence is a procedural claim ("apply in this order") that the evidence
 *      registry already has a Tier-A source for (SRC-003, AAD "Skin-care product order").
 *      There is currently no field in which a routine could cite it. See OQ-R01.
 *
 *   2. Only some Default_Sequence values are ordered step lists. The rest are prose. A routine
 *      builder can render the first kind as steps; the second kind must not be split into fake
 *      steps just to make a UI work.
 */
import type { Routine } from '@/domain/entities';
import { evaluatePublication } from '@/governance/publication-gate';
import { findNode, nodeRoutineLinks, routines } from './repository';

/** Separator used by 09_ROUTINES for ordered sequences. */
const STEP_SEPARATOR = /\s*→\s*/;

export interface RoutineStep {
  readonly index: number;
  /** Step text exactly as the source writes it. Not translated, not normalised. */
  readonly label: string;
}

export interface RoutineNodeLink {
  readonly nodeId: string;
  readonly relationship: string;
  /** Node title, or null when the referenced node does not exist (SR-007). */
  readonly nodeTitle: string | null;
  readonly exists: boolean;
}

export interface RoutineView {
  readonly routine: Routine;
  /**
   * True when Default_Sequence is an ordered list this app may render as steps.
   * False when it is prose, in which case `steps` is empty and the prose is shown as written.
   */
  readonly isSequenced: boolean;
  readonly steps: readonly RoutineStep[];
  readonly links: readonly RoutineNodeLink[];
  /** True when every node this routine references exists. */
  readonly referencesComplete: boolean;
  /** Whether the routine's own record may be presented as verified fact. Currently never. */
  readonly mayStateAsFact: boolean;
  readonly publicationReason: string;
}

const parseSteps = (sequence: string): readonly RoutineStep[] =>
  sequence
    .split(STEP_SEPARATOR)
    .map((label) => label.trim())
    .filter((label) => label !== '')
    .map((label, index) => ({ index, label }));

/** Build the view for one routine, reporting gaps rather than smoothing them over. */
export function toRoutineView(routine: Routine): RoutineView {
  const isSequenced = STEP_SEPARATOR.test(routine.Default_Sequence);
  const links: RoutineNodeLink[] = nodeRoutineLinks
    .filter((link) => link.Routine_ID === routine.Routine_ID)
    .map((link) => {
      const node = findNode(link.Node_ID);
      return {
        nodeId: link.Node_ID,
        relationship: link.Relationship,
        nodeTitle: node?.Node_Title ?? null,
        exists: node !== undefined,
      };
    });

  const decision = evaluatePublication(routine);
  return {
    routine,
    isSequenced,
    steps: isSequenced ? parseSteps(routine.Default_Sequence) : [],
    links,
    referencesComplete: links.every((link) => link.exists),
    mayStateAsFact: decision.mayStateAsFact,
    publicationReason: decision.reason,
  };
}

export const routineViews = (): readonly RoutineView[] => routines.map(toRoutineView);

export const findRoutineView = (routineId: string): RoutineView | undefined => {
  const routine = routines.find((item) => item.Routine_ID === routineId);
  return routine ? toRoutineView(routine) : undefined;
};

export interface RoutineCorpusReport {
  readonly total: number;
  readonly approved: number;
  /** How many may be presented as verified fact. Zero while 09_ROUTINES has no evidence field. */
  readonly mayStateAsFact: number;
  /** Routines whose Default_Sequence is an ordered list rather than prose. */
  readonly sequenced: number;
  readonly prose: number;
  /** Routines that reference at least one node which does not exist. */
  readonly withBrokenReferences: number;
  /**
   * True when the source sheet has no column in which a routine could cite evidence.
   * A schema gap cannot be closed by data entry, which is why it is reported separately.
   */
  readonly hasEvidenceLinkageColumn: boolean;
}

export function routineCorpusReport(): RoutineCorpusReport {
  const views = routineViews();
  const columns = new Set(Object.keys(routines[0] ?? {}));

  return {
    total: views.length,
    approved: views.filter((view) => view.routine.Status === 'Approved').length,
    mayStateAsFact: views.filter((view) => view.mayStateAsFact).length,
    sequenced: views.filter((view) => view.isSequenced).length,
    prose: views.filter((view) => !view.isSequenced).length,
    withBrokenReferences: views.filter((view) => !view.referencesComplete).length,
    hasEvidenceLinkageColumn: columns.has('Source_ID') || columns.has('Evidence_Status'),
  };
}

export { routines };
