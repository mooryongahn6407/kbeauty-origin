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
import type {
  HintLevel,
  LearnerIntent,
  LearnerState,
  RiskTier,
  TutorMode,
} from '@/domain/learning';
import type { Disclosure } from '@/domain/governance';
import { classifyRisk, evaluateRecommendationGates } from '@/safety/safety-gate';
import { evaluatePublication } from '@/governance/publication-gate';
import { findNode, aiRules } from '@/knowledge/repository';
import { ground, type GroundingResult } from './retriever';
import { evaluateModeContract, type ModeContract } from './mode-contract';

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
  /** What the retriever found, with each candidate's own publication decision. */
  readonly grounding: GroundingResult;
  /** Which slots of the mode's §10 skeleton can be filled honestly, and why not when they cannot. */
  readonly contract: ModeContract;
  /** True when the response may state its grounded content as fact. Currently never. */
  readonly mayStateAsFact: boolean;
  /** Reasons the answer is held uncertain, shown to the learner rather than hidden. */
  readonly uncertainty: readonly string[];
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
  /**
   * Current learner state for the skill in play (AI Constitution §5.3 Tutor Fade, §6.2).
   * A mastered learner gets a transfer challenge rather than another explanation.
   */
  readonly learnerState?: LearnerState;
}

/** Intent keywords. A router heuristic, not a knowledge claim. */
const INTENT_PATTERNS: readonly { intent: LearnerIntent; patterns: readonly string[] }[] = [
  { intent: 'SAFETY', patterns: ['아프', '통증', 'pain', 'burning', 'swelling', '붓'] },
  { intent: 'VERIFY', patterns: ['사실이야', '진짜', 'is it true', 'claim', '광고'] },
  { intent: 'COMPARE', patterns: ['차이', '비교', 'vs', 'difference', 'compare'] },
  { intent: 'BUILD', patterns: ['루틴 만들', 'build', 'routine for me'] },
  {
    intent: 'DECIDE',
    patterns: ['뭘 사', '사야', '예산', '추천해', '추천 좀', '골라', 'budget', 'which should i', 'recommend'],
  },
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
 * Stage 3: mode router (AI Constitution §2.2, with Tutor Fade from §5.3).
 *
 * Precedence, highest first: safety, repeated failure, learner state, intent. Safety wins over
 * everything; a learner who has mastered the skill gets a transfer challenge rather than a
 * fresh explanation, because §5.3 requires intervention to fall as competence rises.
 */
export function routeMode(
  intent: LearnerIntent,
  risk: RiskTier,
  failedAttempts: number,
  learnerState: LearnerState = 'NotAssessed',
): TutorMode {
  if (risk !== 'R0' && risk !== 'R1') return 'SAFETY';
  if (intent === 'SAFETY') return 'SAFETY';
  if (failedAttempts >= 3) return 'REMEDIATE';
  if (failedAttempts >= 1) return 'COACH';
  // Tutor Fade: a mastered skill is practised and transferred, not re-taught.
  if (learnerState === 'Mastered') return 'PRACTICE';
  if (intent === 'REFLECT') return 'REFLECT';
  if (intent === 'TRANSFER') return 'PRACTICE';
  if (intent === 'DECIDE' || intent === 'BUILD') return 'RECOMMEND';
  if (learnerState === 'Secure') return 'ASSESS';
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
 * nothing rather than inventing an entity (§3.3 Hallucination Firewall). When no nodeId is
 * supplied the retriever finds candidates from the question itself — and an empty result set
 * stays empty.
 */
export function respond(request: TutorRequest): TutorResponse {
  const trace: string[] = [];
  const learnerState = request.learnerState ?? 'NotAssessed';

  // 1 Context
  trace.push(
    `1:context locale=${request.locale} hints=${request.hintsUsed} fails=${request.failedAttempts} learner=${learnerState}`,
  );

  // 2 Ground — an explicit node wins; otherwise retrieve from the question.
  const explicitNode = request.nodeId ? findNode(request.nodeId) : undefined;
  const grounding = ground(request.userMessage);

  if (request.nodeId && !explicitNode) {
    trace.push(`2:ground MISS node=${request.nodeId} (no entity fabricated)`);
  } else if (explicitNode) {
    trace.push(`2:ground node=${explicitNode.Node_ID} (explicit)`);
  } else if (grounding.empty) {
    trace.push(
      `2:ground EMPTY searched=${grounding.recordsSearched} (no entity fabricated)`,
    );
  } else {
    trace.push(
      `2:ground retrieved=${grounding.candidates.length}/${grounding.recordsSearched} top=${grounding.candidates[0]?.id}`,
    );
  }

  // A requested node that does not exist is a pointer error, not an invitation to retrieve.
  // Substituting a different record under the ID the caller asked for would answer confidently
  // about something nobody asked about — the plausible wrong answer §16's RED TEAM warns of.
  const explicitNodeMissed = request.nodeId !== null && explicitNode === undefined;
  const topCandidate = explicitNodeMissed ? undefined : grounding.candidates[0];
  const groundedNodeId = explicitNodeMissed
    ? null
    : (explicitNode?.Node_ID ?? (topCandidate?.kind === 'KnowledgeNode' ? topCandidate.id : null));
  const publication = explicitNode
    ? evaluatePublication(explicitNode)
    : (topCandidate?.publication ?? null);

  // 3 Classify
  const intent = classifyIntent(request.userMessage);

  // 4 Risk gate
  const safety = classifyRisk(request.userMessage);
  const mode = routeMode(intent, safety.tier, request.failedAttempts, learnerState);
  trace.push(`3:classify intent=${intent}`);
  trace.push(`4:risk tier=${safety.tier} signals=[${safety.matchedSignalIds.join(',')}]`);
  trace.push(`5:respond mode=${mode}`);

  // 5 Respond
  const isSafety = mode === 'SAFETY';
  const hintLevel = isSafety ? null : nextHintLevel(request.hintsUsed, request.failedAttempts);
  const mayStateAsFact = publication?.mayStateAsFact ?? false;
  const contract = evaluateModeContract(mode, groundedNodeId, mayStateAsFact);

  // Commerce eligibility — gates G1-G6. Product data is unverified (SR-011), so G3 fails today.
  const commerce = evaluateRecommendationGates({
    userRequestedProductHelp: request.userRequestedProductHelp,
    hasMinimumContext: groundedNodeId !== null,
    productDataVerified: false,
    risk: safety.tier,
    disclosesCommercialRelationship: true,
    offersAlternatives: true,
  });

  // 6 Verify — uncertainty is stated, never absorbed (C06, AI-005).
  const disclosures: Disclosure[] = [...safety.disclosures];
  const uncertainty: string[] = [];

  if (explicitNodeMissed) {
    uncertainty.push(
      `The record ${request.nodeId} was requested but does not exist, so nothing was grounded. No other record was substituted for it.`,
    );
  } else if (grounding.empty && !explicitNode) {
    uncertainty.push(
      'Nothing in the governed knowledge matched this question, so there is no record to answer from.',
    );
  }
  if (publication && !publication.mayStateAsFact) {
    disclosures.push(...publication.disclosures);
    uncertainty.push(`Grounded record cannot be stated as fact: ${publication.reason}`);
    trace.push(
      `6:verify grounded=${groundedNodeId ?? topCandidate?.id ?? 'none'} mayStateAsFact=false`,
    );
  } else {
    trace.push('6:verify ok');
  }
  if (!explicitNodeMissed && grounding.withUnresolvedEvidence > 0) {
    uncertainty.push(
      `${grounding.withUnresolvedEvidence} grounded record(s) cite an evidence source that does not resolve in 14_EVIDENCE (OQ-E01).`,
    );
  }
  if (!contract.complete && !isSafety) {
    uncertainty.push(
      `${contract.totalCount - contract.filledCount} of ${contract.totalCount} parts of a ${mode} response cannot be filled honestly yet.`,
    );
  }

  // 7 Learn
  trace.push(`7:learn masteryEvent=${isSafety ? 'none' : 'attempted'}`);

  const evidenceIds = explicitNodeMissed
    ? []
    : explicitNode
      ? explicitNode.Source_ID
        ? [explicitNode.Source_ID]
        : []
      : grounding.candidates.flatMap((candidate) =>
          candidate.citedSourceId ? [candidate.citedSourceId] : [],
        );

  return {
    mode,
    risk: safety.tier,
    intent,
    node_ids: groundedNodeId ? [groundedNodeId] : [],
    skill_ids: request.skillId ? [request.skillId] : [],
    messageKey: isSafety ? safety.messageKey : null,
    message: null,
    next_action: isSafety ? null : { type: 'tap_choice' },
    hint_level: hintLevel,
    evidence_ids: [...new Set(evidenceIds)],
    commerce: { eligible: commerce.eligible, failedGates: commerce.failedGates },
    mastery_event: { status: isSafety ? 'none' : 'attempted' },
    disclosures,
    grounding,
    contract,
    mayStateAsFact,
    uncertainty,
    trace,
  };
}

/** Mandatory AI rules (Priority 필수) that are Approved in the Master Database. */
export const mandatoryApprovedAIRules = aiRules.filter(
  (rule) => rule.Priority === '필수' && rule.Status === 'Approved',
);
