/**
 * Strand taxonomy layer — the reconciliation-safe answer to the 58-vs-92 conflict.
 *
 * GOVERNANCE (SR-001 / OQ-01): the Curriculum Knowledge Tree headline states 58 Strands,
 * the Master Database contains 92 Strand rows, and the forensic working file counts 41
 * explicitly coded Curriculum Strand rows (35 with codes matching the DB). The handoff
 * command is explicit: "Do NOT choose one. Do NOT rewrite either source."
 *
 * Therefore this module:
 *   - registers each source representation as a named, versioned *view*;
 *   - keeps `CANONICAL_TAXONOMY_ID` null until an owner decision is recorded;
 *   - exposes the working mapping (EXACT MATCH / NAMING VARIATION / OPEN) verbatim;
 *   - forces every consumer to receive a disclosure describing which view it is reading.
 *
 * When the canonical decision is approved, the only change required is to set
 * `CANONICAL_TAXONOMY_ID` (and, if a new set is authored, add one more view). No consumer
 * of `resolveStrandView()` needs to change.
 */
import type { Disclosure, OpenGovernanceItem } from '@/domain/governance';
import type { Strand } from '@/domain/entities';
import { DISCLOSURE_WORKING_DATASET } from '@/governance/publication-gate';
import strandsData from '../../data/source/strands.json';
import reconciliationData from '../../data/source/reconciliation-db-vs-curriculum.json';
import curriculumCodedData from '../../data/source/reconciliation-curriculum-coded.json';
import uncodedGroupingsData from '../../data/source/reconciliation-uncoded-groupings.json';

/** Identifier of a registered strand representation. Never a count, always a source view. */
export type StrandTaxonomyId = 'master-db-v1.0' | 'curriculum-coded-v1.0';

export interface StrandTaxonomyView {
  readonly id: StrandTaxonomyId;
  readonly label: string;
  readonly sourceFile: string;
  readonly sourceSheet: string;
  /** Number of rows actually present in the source. Not a target, not a claim. */
  readonly rowCount: number;
  /** Count stated in prose by the source document, when it differs from rowCount. */
  readonly documentStatedCount: number | null;
  readonly note: string;
}

/** Working mapping row from 01_STRAND_FORENSIC_RECONCILIATION_WORKING_v1.0.xlsx. */
export interface StrandMappingRow {
  readonly dbStrandId: string;
  readonly dbCode: string;
  readonly dbName: string;
  readonly candidateCurriculumStrand: string;
  readonly classification: string;
  readonly confidence: string;
  readonly rationale: string;
}

type RawStrand = Omit<Strand, 'provenance'>;
type RawRecon = Record<string, string>;

const strandRows = strandsData.records as readonly RawStrand[];
const reconRows = reconciliationData.records as readonly RawRecon[];
const curriculumCodedRows = curriculumCodedData.records as readonly RawRecon[];
const uncodedRows = uncodedGroupingsData.records as readonly RawRecon[];

/** Strand rows exactly as the Master Database holds them. IDs and codes untouched. */
export const masterDbStrands: readonly Strand[] = strandRows.map((row) => ({
  ...row,
  provenance: {
    origin: 'MASTER_DB_V1_0',
    sourceFile: strandsData.sourceFile,
    sourceSheet: strandsData.sourceSheet,
    version: 'v1.0',
  },
}));

/**
 * Count stated in prose by the Curriculum Knowledge Tree headline ("12 Domains · 58 Strands").
 * Recorded as data so no part of the app has to hard-code the number 58 or 92 as truth.
 */
export const CURRICULUM_DOCUMENT_STATED_STRAND_COUNT = 58;

export const STRAND_TAXONOMY_VIEWS: readonly StrandTaxonomyView[] = [
  {
    id: 'master-db-v1.0',
    label: 'Master Database strand rows',
    sourceFile: strandsData.sourceFile,
    sourceSheet: strandsData.sourceSheet,
    rowCount: strandRows.length,
    documentStatedCount: null,
    note: 'Structured strand records with Strand_ID and Strand_Code. Used as the working dataset.',
  },
  {
    id: 'curriculum-coded-v1.0',
    label: 'Curriculum explicitly coded strand rows',
    sourceFile: curriculumCodedData.sourceFile,
    sourceSheet: curriculumCodedData.sourceSheet,
    rowCount: curriculumCodedRows.length,
    documentStatedCount: CURRICULUM_DOCUMENT_STATED_STRAND_COUNT,
    note:
      'Rows visibly coded in the Curriculum document, per the forensic working file. The document ' +
      'headline states a larger number than the coded rows it contains, which is part of SR-001.',
  },
];

/**
 * The approved canonical strand set.
 *
 * Intentionally null: SR-001 is OPEN and no owner decision exists. Setting this value is a
 * governance act, not a coding convenience.
 */
export const CANONICAL_TAXONOMY_ID: StrandTaxonomyId | null = null;

/**
 * Which view the application reads while the canonical decision is open.
 * The Master Database view is used because it is the only representation with stable
 * Strand_IDs; this is a *working* choice and is always accompanied by a disclosure.
 */
export const WORKING_TAXONOMY_ID: StrandTaxonomyId = 'master-db-v1.0';

export const SR_001: OpenGovernanceItem = {
  id: 'SR-001 / OQ-01',
  title: 'Curriculum 58 Strands vs Master Database 92 Strand rows',
  classification: 'OPEN_QUESTION',
  severity: 'CRITICAL',
  summary:
    'The Curriculum document headline states 58 strands; the Master Database holds 92 strand rows; ' +
    'the forensic working file finds 41 explicitly coded Curriculum strand rows, 35 of which match ' +
    'a DB Strand_Code exactly. No representation has been approved as canonical.',
  engineeringPosture:
    'Both representations are registered as named views. No row is renamed, merged or deleted. ' +
    'The application reads the Master Database view labelled WORKING_DATASET until an owner sets ' +
    'CANONICAL_TAXONOMY_ID.',
};

export interface ResolvedStrandView {
  readonly view: StrandTaxonomyView;
  readonly strands: readonly Strand[];
  /** True only when an owner decision has designated this view canonical. */
  readonly isCanonical: boolean;
  readonly disclosures: readonly Disclosure[];
  readonly openItem: OpenGovernanceItem | null;
}

/**
 * Resolve the strand list a screen should render, together with the honesty obligations
 * that come with it. Callers must render every returned disclosure.
 */
export function resolveStrandView(): ResolvedStrandView {
  const activeId = CANONICAL_TAXONOMY_ID ?? WORKING_TAXONOMY_ID;
  const view = STRAND_TAXONOMY_VIEWS.find((candidate) => candidate.id === activeId);
  if (!view) throw new Error(`Unknown strand taxonomy view: ${activeId}`);

  const isCanonical = CANONICAL_TAXONOMY_ID !== null;
  return {
    view,
    strands: activeId === 'master-db-v1.0' ? masterDbStrands : [],
    isCanonical,
    disclosures: isCanonical ? [] : [DISCLOSURE_WORKING_DATASET],
    openItem: isCanonical ? null : SR_001,
  };
}

/** The working DB-to-Curriculum mapping, verbatim. Ambiguous rows stay OPEN. */
export const strandMappings: readonly StrandMappingRow[] = reconRows.map((row) => ({
  dbStrandId: row['DB Strand ID'] ?? '',
  dbCode: row['DB Code'] ?? '',
  dbName: row['DB Strand Name'] ?? '',
  candidateCurriculumStrand: row['Candidate Curriculum Strand'] ?? '',
  classification: row['Working Classification'] ?? '',
  confidence: row['Confidence'] ?? '',
  rationale: row['Rationale / Required Decision'] ?? '',
}));

/** Curriculum groupings that have no strand code at all. They require a canonical decision. */
export const uncodedCurriculumGroupings = uncodedRows;

export interface StrandReconciliationSummary {
  readonly dbRowCount: number;
  readonly curriculumCodedRowCount: number;
  readonly curriculumDocumentStatedCount: number;
  readonly exactMatches: number;
  readonly namingVariations: number;
  readonly openMappings: number;
  readonly uncodedGroupings: number;
}

/** Counts derived from the working file, for governance screens and tests. */
export function summariseStrandReconciliation(): StrandReconciliationSummary {
  const countWhere = (predicate: (row: StrandMappingRow) => boolean) =>
    strandMappings.filter(predicate).length;

  return {
    dbRowCount: masterDbStrands.length,
    curriculumCodedRowCount: curriculumCodedRows.length,
    curriculumDocumentStatedCount: CURRICULUM_DOCUMENT_STATED_STRAND_COUNT,
    exactMatches: countWhere((row) => row.classification.startsWith('EXACT MATCH')),
    namingVariations: countWhere((row) => row.classification.startsWith('NAMING VARIATION')),
    openMappings: countWhere((row) => row.classification.startsWith('OPEN')),
    uncodedGroupings: uncodedCurriculumGroupings.length,
  };
}
