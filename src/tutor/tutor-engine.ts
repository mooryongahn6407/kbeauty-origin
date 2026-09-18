/**
 * AI Tutor orchestration.
 *
 * Runtime (AI Constitution §2.1):
 *   Context -> Ground -> Classify -> Risk Gate -> Respond -> Verify -> Learn
 *
 * This prototype implements the orchestration, the gates and the structured output contract
 * (§11.1) deterministically. No model call is made, and no scientific claim is generated:
 * responses are assembled from governed records and authored scaffolding only. That is the
 * point — the grounding and safety pipeline must be correct before any generation is added.
 */
import type { HintLevel, LearnerIntent, RiskTier, TutorMode } from '@/domain/learning';
import type { Disclosure } from '@/domain/governance';
import { classifyRisk, evaluateRecommendationGates } from '@/safety/safety-gate';
import { evaluatePublication } from '@/governance/publication-gate';
import { findNode, aiRules } from '@/knowledge/repository';

/** Structured response contract from AI Constitution §11.1. */
export interface TutorResponse {
  readonly mode: TutorMode;
  readonly risk: RiskTier;
  readonly intent: LearnerIntent;
  readonly node_ids: readonly string[];
  readonly skill_ids: readonly string[];
  /** Localization key or authored text; never a generated factual claim in this prototype. */
  readonly messageKey: string | null;
  readonly message: string | null;
  readonly next_action: { readonly type: string; readonly options?: readonly string[] } | null;
  readonly hint_level: HintLevel | null;
  readonly evidence_ids: readonly string[];
  readonly commerce: { readonly eligible: boolean; readonly failedGates: readonly string[] };
  readonly mastery_event: { readonly status: 'attempted' | 'none' };
  readonly disclosures: readonly Disclosure[];
  /** Internal trace of the seven runtime stages, for tests and admin surfaces. */
  readonly trace: readonly string[];
}

export interface TutorRequest {
  readonly userMessage: string;
  readonly nodeId: string | null;
  readonly skillId: string | null;
  readonly locale: string;
  /** Hints already revealed in this activity, driving the H0-H4 ladder. */
  readonly hintsUsed: number;
  readonly failedAttempts: number;
  readonly userRequestedProductHelp: boolean;
}

/** Intent keywords. A router heuristic, not a knowledge claim. */
const INTENT_PATTERNS: readonly { intent: LearnerIntent; patterns: readonly string[] }[] = [
  { intent: 'SAFETY', patterns: ['아프', '통증', 'pain', 'burning', 'swelling', '붓'] },
  { intent: 'VERIFY', patterns: ['사실이야', '진짜', 'is it true', 'claim', '광고'] },
  { intent: 'COMPARE', patterns: ['차이', '비교', 'vs', 'difference', 'compare'] },
  { intent: 'BUILD', patterns: ['루틴 만들', 'build', 'routine for me'] },
  { intent: 'DECIDE', patterns: ['뭘 사', '예산', 'budget', 'which should i'] },
  { intent: 'IDENTIFY', patterns: ['찾아', 'find', 'which ingredient'] },
  { intent: 'REFLECT', patterns: ['배웠', 'what did i learn'] },
  { intent: 'TRANSFER', patterns: ['새 제품', 'new product', 'apply to'] },
];

/** Stage 3: classify intent. Defaults to LEARN. */
export function classifyIntent(userMessage: string): LearnerIntent {
  const haystack = userMessage.toLowerCase();
  for (const { intent, patterns } of INTENT_PATTERNS) {
    if (patterns.some((pattern) => haystack.includes(pattern.toLowerCase()))) return intent;
  }
  return 'LEARN';
}

/**
 * Stage 3: mode router (AI Constitution §2.2).
 * Safety wins over every other mode; repeated failure routes to REMEDIATE before COACH.
 */
export function routeMode(
  intent: LearnerIntent,
  risk: RiskTier,
  failedAttempts: number,
): TutorMode {
  if (risk !== 'R0' && risk !== 'R1') return 'SAFETY';
  if (intent === 'SAFETY') return 'SAFETY';
  if (failedAttempts >= 3) return 'REMEDIATE';
  if (failedAttempts >= 1) return 'COACH';
  if (intent === 'REFLECT') return 'REFLECT';
  if (intent === 'TRANSFER') return 'PRACTICE';
  if (intent === 'DECIDE' || intent === 'BUILD') return 'RECOMMEND';
  return 'TEACH';
}

/**
 * Hint ladder escalation (AI Constitution §5.2).
 * First attempt H0-H1, first failure H1-H2, second H2-H3, third H4 with remediation.
 */
export function nextHintLevel(hintsUsed: number, failedAttempts: number): HintLevel {
  const step = Math.max(hintsUsed, failedAttempts);
  const ladder: readonly HintLevel[] = ['H0', 'H1', 'H2', 'H3', 'H4'];
  return ladder[Math.min(step, ladder.length - 1)] ?? 'H4';
}

/**
 * Run the seven-stage runtime and produce a structured response.
 *
 * Grounding rule: if `nodeId` names a record that does not exist, the response grounds in
 * nothing rather than inventing an entity (§3.3 Hallucination Firewall).
 */
export function respond(request: TutorRequest): TutorResponse {
  const trace: string[] = [];

  // 1 Context
  trace.push(`1:context locale=${request.locale} hints=${request.hintsUsed} fails=${request.failedAttempts}`);

  // 2 Ground
  const node = request.nodeId ? findNode(request.nodeId) : undefined;
  if (request.nodeId && !node) {
    trace.push(`2:ground MISS node=${request.nodeId} (no entity fabricated)`);
  } else {
    trace.push(`2:ground node=${node?.Node_ID ?? 'none'}`);
  }
  const publication = node ? evaluatePublication(node) : null;

  // 3 Classify
  const intent = classifyIntent(request.userMessage);

  // 4 Risk gate
  const safety = classifyRisk(request.userMessage);
  const mode = routeMode(intent, safety.tier, request.failedAttempts);
  trace.push(`3:classify intent=${intent}`);
  trace.push(`4:risk tier=${safety.tier} signals=[${safety.matchedSignalIds.join(',')}]`);
  trace.push(`5:respond mode=${mode}`);

  // 5 Respond
  const isSafety = mode === 'SAFETY';
  const hintLevel = isSafety ? null : nextHintLevel(request.hintsUsed, request.failedAttempts);

  // Commerce eligibility — gates G1-G6. Product data is unverified (SR-011), so G3 fails today.
  const commerce = evaluateRecommendationGates({
    userRequestedProductHelp: request.userRequestedProductHelp,
    hasMinimumContext: request.nodeId !== null,
    productDataVerified: false,
    risk: safety.tier,
    disclosesCommercialRelationship: true,
    offersAlternatives: true,
  });

  // 6 Verify — an unverified node may never be voiced as fact.
  const disclosures: Disclosure[] = [...safety.disclosures];
  if (publication && !publication.mayStateAsFact) {
    disclosures.push(...publication.disclosures);
    trace.push(`6:verify node=${node?.Node_ID} mayStateAsFact=false (${publication.reason})`);
  } else {
    trace.push('6:verify ok');
  }

  // 7 Learn
  trace.push(`7:learn masteryEvent=${isSafety ? 'none' : 'attempted'}`);

  return {
    mode,
    risk: safety.tier,
    intent,
    node_ids: node ? [node.Node_ID] : [],
    skill_ids: request.skillId ? [request.skillId] : [],
    messageKey: isSafety ? safety.messageKey : null,
    message: null,
    next_action: isSafety ? null : { type: 'tap_choice' },
    hint_level: hintLevel,
    evidence_ids: node && node.Source_ID ? [node.Source_ID] : [],
    commerce: { eligible: commerce.eligible, failedGates: commerce.failedGates },
    mastery_event: { status: isSafety ? 'none' : 'attempted' },
    disclosures,
    trace,
  };
}

/** Mandatory AI rules (Priority 필수) that are Approved in the Master Database. */
export const mandatoryApprovedAIRules = aiRules.filter(
  (rule) => rule.Priority === '필수' && rule.Status === 'Approved',
);
