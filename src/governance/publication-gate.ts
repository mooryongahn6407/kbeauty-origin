/**
 * Status / evidence gate.
 *
 * Rule (handoff command): "Never treat Draft/Review data as Approved" and
 * "Never display an unapproved knowledge item as verified fact"
 * (01_TECHNICAL_IMPLEMENTATION_SPEC_v1.0.md §3).
 *
 * The gate is the only place allowed to answer "may this be stated as fact?". It derives the
 * answer from the record's own Status/Evidence_Status fields; it never writes them back.
 */
import type {
  Disclosure,
  EvidenceStatus,
  PublicationDecision,
  RecordStatus,
} from '@/domain/governance';

export const DISCLOSURE_PENDING_VERIFICATION: Disclosure = {
  code: 'PENDING_VERIFICATION',
  severity: 'caution',
  messageKey: 'disclosure.pendingVerification',
};

export const DISCLOSURE_WORKING_DATASET: Disclosure = {
  code: 'WORKING_DATASET',
  severity: 'info',
  messageKey: 'disclosure.workingDataset',
};

export const DISCLOSURE_NOT_MEDICAL: Disclosure = {
  code: 'NOT_MEDICAL_ADVICE',
  severity: 'info',
  messageKey: 'disclosure.notMedicalAdvice',
};

/** The subset of fields the gate reads. Any source record satisfies it structurally. */
export interface GatedRecord {
  readonly Status: RecordStatus | 'Template' | string;
  readonly Evidence_Status?: EvidenceStatus | string;
}

/**
 * Decide how a record may be presented.
 *
 * A record may be stated as fact only when BOTH gates pass:
 *   Status === 'Approved'  AND  Evidence_Status === 'Verified'.
 *
 * 'Anchor' means an evidence source has been attached but not yet verified, so it is
 * deliberately NOT sufficient. Presence of a record is never treated as approval.
 */
export function evaluatePublication(record: GatedRecord): PublicationDecision {
  const status = record.Status;
  const evidence = record.Evidence_Status ?? '';

  if (status === 'Archived') {
    return {
      mode: 'BLOCKED',
      disclosures: [],
      reason: 'Record is Archived and must not be rendered.',
      mayStateAsFact: false,
    };
  }

  if (status === 'Template') {
    return {
      mode: 'BLOCKED',
      disclosures: [],
      reason: 'Record is a Template placeholder with no verified content (see SR-011).',
      mayStateAsFact: false,
    };
  }

  if (status === 'Approved' && evidence === 'Verified') {
    return {
      mode: 'VERIFIED_FACT',
      disclosures: [],
      reason: 'Status=Approved and Evidence_Status=Verified.',
      mayStateAsFact: true,
    };
  }

  const reason =
    status === 'Approved'
      ? `Status=Approved but Evidence_Status="${evidence || 'missing'}" is not Verified.`
      : `Status="${status}" is not Approved.`;

  return {
    mode: 'PENDING_VERIFICATION',
    disclosures: [DISCLOSURE_PENDING_VERIFICATION],
    reason,
    mayStateAsFact: false,
  };
}

/**
 * Guard for render paths that would assert a claim as true.
 * Throws rather than degrading silently, so a missing gate check fails loudly in tests.
 */
export function assertMayStateAsFact(record: GatedRecord, context: string): void {
  const decision = evaluatePublication(record);
  if (!decision.mayStateAsFact) {
    throw new Error(
      `Refusing to state unverified content as fact in ${context}: ${decision.reason}`,
    );
  }
}
