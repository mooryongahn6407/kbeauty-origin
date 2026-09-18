/**
 * Governance vocabulary shared by every layer.
 *
 * Source: 00_CLAUDE_MASTER_CODING_HANDOFF_COMMAND_v1.0.md ("SOURCE DISCIPLINE"),
 * 01_TECHNICAL_IMPLEMENTATION_SPEC_v1.0.md §3, Master DB sheet 20_ENUMS.
 *
 * These types exist so that "is this fact safe to show as true?" is a decision the
 * type system forces callers to make, rather than something a component can skip.
 */

/** Record lifecycle status. Values mirror Master DB 20_ENUMS `Status`, plus OPEN from the spec. */
export type RecordStatus = 'Draft' | 'Review' | 'Approved' | 'Archived' | 'OPEN';

/** Evidence lifecycle. Values mirror Master DB 20_ENUMS `Evidence_Status`. */
export type EvidenceStatus = 'To Review' | 'Anchor' | 'Verified';

/** Evidence tier. Source: SOURCE_RECONCILIATION_MASTER_REGISTER §7. */
export type EvidenceTier = 'A' | 'B' | 'C' | 'D';

/**
 * Classification for anything not yet decided by an owner.
 * Source: MASTER_CONTEXT §09 and the handoff command ("Classify unresolved matters as ...").
 */
export type GovernanceClass =
  | 'CONFIRMED'
  | 'DECISION'
  | 'HYPOTHESIS'
  | 'IDEA'
  | 'OPEN_QUESTION'
  | 'REJECTED';

/**
 * How a piece of knowledge may appear in the product.
 *
 * VERIFIED_FACT     - may be stated as fact; requires Approved status AND Verified evidence.
 * PENDING_VERIFICATION - may be used for learning only, and only with a visible disclosure.
 * BLOCKED           - must not be rendered at all (archived, or safety-blocked).
 */
export type PresentationMode = 'VERIFIED_FACT' | 'PENDING_VERIFICATION' | 'BLOCKED';

/** A user-visible statement the UI is obliged to render alongside the content. */
export interface Disclosure {
  readonly code: string;
  readonly severity: 'info' | 'caution';
  /** Message key resolved through the localization layer; never a hard-coded claim. */
  readonly messageKey: string;
}

/** Result of running a record through the evidence/status gate. */
export interface PublicationDecision {
  readonly mode: PresentationMode;
  readonly disclosures: readonly Disclosure[];
  /** Human-readable reason, for admin/governance surfaces and test assertions. */
  readonly reason: string;
  /** True when the caller may state the content's factual claims without hedging. */
  readonly mayStateAsFact: boolean;
}

/** Provenance attached to every record the application handles. */
export interface Provenance {
  /** Which official source the record came from, or AUTHORED_SCAFFOLD for app-authored content. */
  readonly origin: 'MASTER_DB_V1_0' | 'RECONCILIATION_WORKING_V1_0' | 'AUTHORED_SCAFFOLD';
  readonly sourceFile?: string;
  readonly sourceSheet?: string;
  readonly version?: string;
}

/** An unresolved governance item carried in code so screens can surface it honestly. */
export interface OpenGovernanceItem {
  /** Register ID from SOURCE_RECONCILIATION_MASTER_REGISTER §4 (SR-xxx) or MASTER_CONTEXT §08 (OQ-xx). */
  readonly id: string;
  readonly title: string;
  readonly classification: GovernanceClass;
  readonly severity: 'OPEN' | 'CRITICAL' | 'BLOCKER';
  readonly summary: string;
  /** What the application does while the item is unresolved. */
  readonly engineeringPosture: string;
}
