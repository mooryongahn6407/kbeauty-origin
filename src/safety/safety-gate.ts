/**
 * Safety / policy gate.
 *
 * Source: AI Tutor Constitution §7 (Risk Tiers R0-R4, Stop Conditions) and §8
 * (Recommendation Eligibility Gates G1-G6).
 *
 * Two rules drive every decision here:
 *   1. Safety takes priority over learning, engagement and commerce.
 *   2. The product does not diagnose disease or promise treatment.
 *
 * OPEN (SR-014 / OQ-06): market-specific thresholds and escalation wording are NOT approved.
 * The signal vocabulary below is therefore a conservative engineering scaffold: it is data,
 * it is labelled unapproved, and it escalates rather than under-reacts when uncertain.
 */
import type { RiskTier } from '@/domain/learning';
import type { Disclosure, OpenGovernanceItem } from '@/domain/governance';
import { DISCLOSURE_NOT_MEDICAL } from '@/governance/publication-gate';

export const SR_014: OpenGovernanceItem = {
  id: 'SR-014 / OQ-06',
  title: 'Market-specific safety thresholds and escalation wording are unapproved',
  classification: 'OPEN_QUESTION',
  severity: 'BLOCKER',
  summary:
    'R2/R3/R4 thresholds and the exact escalation wording per launch market have not been ' +
    'clinically or legally reviewed.',
  engineeringPosture:
    'Risk signals are held in a replaceable data table marked APPROVAL_REQUIRED. The gate errs ' +
    'toward escalation, and all escalation copy is routed through the localization layer so a ' +
    'market pack can replace it without code changes.',
};

/** A textual signal that raises risk. Held as data so a market pack can replace the set. */
export interface RiskSignal {
  readonly id: string;
  readonly tier: RiskTier;
  /** Lower-cased substrings. Multi-language by design; a market pack extends this list. */
  readonly patterns: readonly string[];
  readonly approval: 'APPROVAL_REQUIRED';
}

/**
 * Engineering scaffold signal set — NOT an approved clinical rule set (SR-014).
 * Kept deliberately small and obvious; a real market pack replaces it wholesale.
 */
export const RISK_SIGNALS: readonly RiskSignal[] = [
  {
    id: 'RS-EMERGENCY',
    tier: 'R4',
    patterns: ['숨을 못', '숨쉬기 힘', 'trouble breathing', "can't breathe", 'anaphyla'],
    approval: 'APPROVAL_REQUIRED',
  },
  {
    id: 'RS-HIGH-CONCERN',
    tier: 'R3',
    patterns: ['감염', '고름', '출혈', 'infection', 'pus', 'bleeding', 'swelling', '붓는', '부어', '부었'],
    approval: 'APPROVAL_REQUIRED',
  },
  {
    id: 'RS-CAUTION',
    tier: 'R2',
    // Korean verb stems conjugate (아프다 -> 아파요), so inflected forms are listed
    // explicitly. A reviewed market pack should replace this with proper morphology.
    patterns: ['통증', '아프', '아파', '아팠', '화끈', '따가', 'severe pain', 'burning', 'worse', '심해'],
    approval: 'APPROVAL_REQUIRED',
  },
  {
    id: 'RS-TREATMENT-CLAIM',
    tier: 'R2',
    patterns: ['치료해', '낫게', 'cure', 'treat my', 'heal my', 'prescribe'],
    approval: 'APPROVAL_REQUIRED',
  },
];

export interface SafetyDecision {
  readonly tier: RiskTier;
  /** True when normal tutoring continues. */
  readonly allowLearning: boolean;
  /** Commerce stops at R2 and above (Constitution §7.2). */
  readonly allowCommerce: boolean;
  /** True when the learner should be routed to professional help. */
  readonly escalate: boolean;
  /** Localization key for the escalation message; never hard-coded prose. */
  readonly messageKey: string | null;
  readonly matchedSignalIds: readonly string[];
  readonly disclosures: readonly Disclosure[];
}

const TIER_ORDER: readonly RiskTier[] = ['R0', 'R1', 'R2', 'R3', 'R4'];
const tierRank = (tier: RiskTier): number => TIER_ORDER.indexOf(tier);

/**
 * Classify free text into a risk tier.
 *
 * Deliberately conservative: it takes the HIGHEST tier among all matches, because
 * under-reacting to a safety signal is the failure mode that matters.
 */
export function classifyRisk(text: string): SafetyDecision {
  const haystack = text.toLowerCase();
  const matched = RISK_SIGNALS.filter((signal) =>
    signal.patterns.some((pattern) => haystack.includes(pattern.toLowerCase())),
  );

  const tier = matched.reduce<RiskTier>(
    (highest, signal) => (tierRank(signal.tier) > tierRank(highest) ? signal.tier : highest),
    'R0',
  );

  return decideForTier(tier, matched.map((signal) => signal.id));
}

/** Build the decision for an already-known tier. */
export function decideForTier(tier: RiskTier, matchedSignalIds: readonly string[] = []): SafetyDecision {
  const rank = tierRank(tier);
  const escalate = rank >= tierRank('R2');

  return {
    tier,
    // R4 ends the tutoring flow entirely (Constitution §7.1).
    allowLearning: tier !== 'R4',
    allowCommerce: rank < tierRank('R2'),
    escalate,
    messageKey: escalate ? `safety.escalation.${tier}` : null,
    matchedSignalIds,
    disclosures: [DISCLOSURE_NOT_MEDICAL],
  };
}

/** Recommendation eligibility gates G1-G6 (AI Tutor Constitution §8.1). */
export interface RecommendationGateInput {
  readonly userRequestedProductHelp: boolean;
  readonly hasMinimumContext: boolean;
  /** True only when the candidate product data itself passes the publication gate. */
  readonly productDataVerified: boolean;
  readonly risk: RiskTier;
  readonly disclosesCommercialRelationship: boolean;
  readonly offersAlternatives: boolean;
}

export interface RecommendationGateResult {
  readonly eligible: boolean;
  readonly failedGates: readonly string[];
}

/**
 * Evaluate whether a product recommendation may be shown at all.
 * Every gate must pass; a single failure suppresses the commerce CTA entirely.
 */
export function evaluateRecommendationGates(
  input: RecommendationGateInput,
): RecommendationGateResult {
  const failed: string[] = [];
  if (!input.userRequestedProductHelp) failed.push('G1_USER_INTENT');
  if (!input.hasMinimumContext) failed.push('G2_CONTEXT');
  if (!input.productDataVerified) failed.push('G3_EVIDENCE');
  if (tierRank(input.risk) >= tierRank('R2')) failed.push('G4_SAFETY');
  if (!input.disclosesCommercialRelationship) failed.push('G5_TRANSPARENCY');
  if (!input.offersAlternatives) failed.push('G6_ALTERNATIVES');

  return { eligible: failed.length === 0, failedGates: failed };
}
