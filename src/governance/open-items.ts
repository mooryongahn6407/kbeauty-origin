/**
 * Register of unresolved governance items, carried in code so the product can be honest
 * about what it does not yet know.
 *
 * Every entry is transcribed from an official source (SOURCE_RECONCILIATION_MASTER_REGISTER §4
 * and MASTER_CONTEXT §08), except OQ-L01, which records a conflict observed between two
 * supplied sources during this build and is labelled as such.
 */
import type { OpenGovernanceItem } from '@/domain/governance';
import { SR_001 } from '@/knowledge/strand-taxonomy';
import { SR_014 } from '@/safety/safety-gate';
import { OQ_L01 } from '@/localization/locales';

const SR_009: OpenGovernanceItem = {
  id: 'SR-009 / OQ-02',
  title: 'No Knowledge Node has completed evidence approval',
  classification: 'OPEN_QUESTION',
  severity: 'BLOCKER',
  summary:
    'All 212 Knowledge Nodes carry Status=Draft. Evidence_Status is Anchor for 92 and To Review ' +
    'for 120. Existence in the database is not approval.',
  engineeringPosture:
    'The publication gate returns PENDING_VERIFICATION for every node, so no node can be stated ' +
    'as verified fact anywhere in the app. Learning content authored for the prototype makes ' +
    'only pedagogical and safety-boundary claims, never scientific ones.',
};

const SR_002_003: OpenGovernanceItem = {
  id: 'SR-002 / SR-003',
  title: 'Concept and Scenario are curriculum entities absent from the database schema',
  classification: 'OPEN_QUESTION',
  severity: 'CRITICAL',
  summary:
    'The Curriculum hierarchy is Domain → Strand → Concept → Knowledge Node → Skill → ' +
    'Scenario/Application → Mastery Evidence, but the Master Database Schema Dictionary lists ' +
    'neither Concept nor Scenario as a first-class entity.',
  engineeringPosture:
    'Neither entity is invented. The learning layer addresses nodes directly, and the content ' +
    'layer keeps Scenario-shaped data inside authored activities so a later first-class entity ' +
    'can absorb them without reshaping the domain model.',
};

const SR_004_007: OpenGovernanceItem = {
  id: 'SR-004 … SR-007',
  title: 'Quest and Routine rows reference Knowledge Node IDs that do not exist',
  classification: 'OPEN_QUESTION',
  severity: 'BLOCKER',
  summary:
    'QST-006, QST-011, QST-012 and RUT-001 reference node IDs absent from 03_KNOWLEDGE_NODES. ' +
    'Lineage must be traced before anything is created, renamed or deleted.',
  engineeringPosture:
    'The integrity checker reports every dangling reference and the affected quests are marked ' +
    'incomplete. No node is created to satisfy a broken link.',
};

const SR_011: OpenGovernanceItem = {
  id: 'SR-011',
  title: 'Product master contains template rows only',
  classification: 'OPEN_QUESTION',
  severity: 'BLOCKER',
  summary: 'All 10 rows in 16_PRODUCTS have Status=Template with no brand, name or claim data.',
  engineeringPosture:
    'The publication gate blocks Template rows outright, and recommendation gate G3 (evidence) ' +
    'therefore fails for every candidate, so no commerce CTA can render.',
};

const SR_013: OpenGovernanceItem = {
  id: 'SR-013',
  title: 'Mastery protocol lacks approved sampling and scheduling detail',
  classification: 'OPEN_QUESTION',
  severity: 'OPEN',
  summary:
    'Master DB 19_MASTERY_RULES states ratios (≥80%, ≥70%) but no sample size, and retention ' +
    'depends on an undefined review schedule.',
  engineeringPosture:
    'Minimum attempt counts are held in one table in the mastery engine and marked as an ' +
    'engineering DECISION, chosen so that a single correct answer can never produce mastery.',
};

const SR_012: OpenGovernanceItem = {
  id: 'SR-012',
  title: 'AI rules carry mixed Approved/Draft status against a broader Constitution',
  classification: 'OPEN_QUESTION',
  severity: 'OPEN',
  summary:
    'Master DB 13_AI_RULES holds 20 rules, of which some are Draft, while the AI Tutor ' +
    'Constitution states a broader policy set. Hard vs soft policy is not yet mapped.',
  engineeringPosture:
    'The tutor enforces the Constitution rules that are also Approved+필수 in the database as ' +
    'hard gates. Draft rules are available to read but do not silently become enforcement.',
};


/**
 * Observed during the Ingredient Garden build (2026-09-18) by cross-checking node Source_ID
 * values against 14_EVIDENCE. Not previously recorded in the reconciliation register.
 */
const OQ_E01: OpenGovernanceItem = {
  id: 'OQ-E01',
  title: 'Node evidence references use a different ID namespace from the evidence registry',
  classification: 'OPEN_QUESTION',
  severity: 'BLOCKER',
  summary:
    'The 92 Knowledge Nodes marked Evidence_Status=Anchor cite Source_IDs FDA-01, EU-01, ' +
    'AAD-01, AAD-02 and AAD-03 — the label namespace used by AI Tutor Constitution §17. ' +
    '14_EVIDENCE registers SRC-001 … SRC-010. None of the 92 references resolves, so the ' +
    'evidence traceability chain is broken for every node that claims an anchor.',
  engineeringPosture:
    'The integrity checker reports each unresolved reference. No Source_ID is rewritten and no ' +
    'mapping is guessed: choosing which registered source a claim was anchored to is a ' +
    'governance decision, and a wrong guess would attach a node to the wrong evidence. The ' +
    'lesson availability gate treats an unresolved reference as blocking for scientific claims.',
};

/**
 * Observed during the Ingredient Garden build (2026-09-18) by cross-checking node titles
 * against the governed ingredient families in 06_INGREDIENTS.
 */
const OQ_S01: OpenGovernanceItem = {
  id: 'OQ-S01',
  title: 'Knowledge node content appears to be filed one strand later than its subject in D06',
  classification: 'OPEN_QUESTION',
  severity: 'CRITICAL',
  summary:
    'In Domain D06 the node content drifts against the strand it is filed under from strand ' +
    '06.3 onward: "Retinol 기본" sits in 06.8 Exfoliating Acids, "Niacinamide 기본 개념" in ' +
    '06.5 Barrier Lipids, "Panthenol 기본" in 06.9 Retinoid Family. Strand_Code and ' +
    'Strand_Name agree with 02_STRANDS on every node, so this is content placement rather ' +
    'than a schema break. It breaks quests QST-010, QST-011 and QST-012, whose supporting ' +
    'nodes are about a different subject from the quest.',
  engineeringPosture:
    'Detected from governed vocabulary only — an ingredient named in a node title whose Family ' +
    'matches a different strand in the same domain. Every result is reported as a suspicion ' +
    'needing owner confirmation, because the correction could be to move the node, rename the ' +
    'strand or re-title the node, and only a curriculum owner can decide which. Nothing is moved.',
};


/**
 * Observed during the Routine Studio build (2026-09-18) by inspecting the columns of
 * 09_ROUTINES against the procedural claims its rows make.
 */
const OQ_R01: OpenGovernanceItem = {
  id: 'OQ-R01',
  title: '09_ROUTINES has no column in which a routine could cite evidence',
  classification: 'OPEN_QUESTION',
  severity: 'CRITICAL',
  summary:
    'The routine sheet has only Routine_ID, Routine_Name, Description, Default_Sequence and ' +
    'Status. All 10 rows are Status=Approved, yet a Default_Sequence such as ' +
    '"정돈 → 선택적 트리트먼트 → 보습 → 자외선 보호" is a procedural claim, and the evidence ' +
    'registry already holds a Tier-A source for routine order (SRC-003, AAD). There is no ' +
    'field in which that link could be recorded. Separately, 5 of the 10 Default_Sequence ' +
    'values are prose rather than ordered step lists.',
  engineeringPosture:
    'The publication gate already refuses to state an Approved-but-unevidenced routine as ' +
    'fact, so no routine is presented as correct. Routines whose sequence is prose are shown ' +
    'as written and never split into invented steps. The missing column is a schema change ' +
    'and is not worked around in code. Promoted 2026-09-18 from a data observation to a ' +
    'Master Database schema change request: a routine is a behavioural instruction the moment ' +
    'it is rendered, so the sheet needs Purpose, Audience_Context, Step_Definition, ' +
    'Usage_Context, Safety_Notes, Source_ID, Evidence_ID, Evidence_Status, Source_Updated, ' +
    'Review_Status and Version — with Source, Evidence and product Usage Instruction kept as ' +
    'three separate fields rather than one (see PR-023).',
};

/**
 * Observed during the Routine Studio build (2026-09-18) by comparing quest win conditions
 * against their Core node titles.
 */
const OQ_R02: OpenGovernanceItem = {
  id: 'OQ-R02',
  title: 'QST-007 asks for a 4-step routine while its Core node teaches a 3-step routine',
  classification: 'OPEN_QUESTION',
  severity: 'OPEN',
  summary:
    'Quest QST-007 "Routine Rescue" has Win_Condition "과도한 루틴을 4단계로 단순화", but its ' +
    'Core node KN-D08-04-001 is "3-step routine 만들기" and the governed minimal routine ' +
    'RUT-003 has three steps. The quest cannot be authored until the target number is settled. ' +
    'This is the only numeric contradiction of its kind across all 25 quests.',
  engineeringPosture:
    'Detected by comparing integers in each quest Win_Condition against its Core node title. ' +
    'Neither number is chosen; the quest is reported as unauthorable and stays closed.',
};


/**
 * Observed during the Sun Protection build (2026-09-18) by checking which registered evidence
 * source each D04 node actually cites.
 */
const OQ_E02: OpenGovernanceItem = {
  id: 'OQ-E02',
  title: 'No sun, UV or SPF evidence source exists in the registry, and no node cites one',
  classification: 'OPEN_QUESTION',
  severity: 'BLOCKER',
  summary:
    'All 13 Sun & Environmental Protection nodes — including "SPF의 의미", "광범위 자외선 차단" ' +
    'and "재도포의 기본 원칙" — cite the general AAD "Skin care basics" page. 14_EVIDENCE ' +
    'contains no source about sun, UV or SPF at all. The AI Tutor Constitution §17 does cite ' +
    'AAD-05 "Right Sunscreen" (broad-spectrum, SPF 30+, water resistance), but no node cites ' +
    'it and it is absent from the registry.',
  engineeringPosture:
    'Sun Protection ships with no guidance on what protection to use, how much or how often. ' +
    'The world offers an exposure log the user fills in themselves and one lesson about the ' +
    'boundary between observation and decision. The safety-boundary content states explicitly ' +
    'that this silence is about the app\u2019s evidence and not about whether protection matters, ' +
    'so an omission cannot read as reassurance.',
};

/**
 * Observed during the Sun Protection build (2026-09-18) while investigating OQ-E01: every
 * citing node also carries a Source_URL, and each of those URLs is registered in 14_EVIDENCE.
 */
const OQ_E03: OpenGovernanceItem = {
  id: 'OQ-E03',
  title: 'The evidence ID mapping is derivable from Source_URL, but contradicts the Constitution',
  classification: 'DECISION',
  severity: 'CRITICAL',
  summary:
    'All 92 unresolved citations can be matched to a registered source by exact Source_URL, so ' +
    'OQ-E01 needs no guesswork: AAD-01→SRC-002, AAD-02→SRC-001, AAD-03→SRC-003, EU-01→SRC-009, ' +
    'FDA-01→SRC-005. The derived mapping contradicts AI Tutor Constitution §17, which labels ' +
    'AAD-01 "Skin Care Basics" and AAD-02 "Face Washing 101" — the node sheet pairs them the ' +
    'other way round.',
  engineeringPosture:
    'The mapping is derived and reported as a proposal; nothing is rewritten. An owner must ' +
    'say whether the Constitution label or the node Source_URL governs before the IDs are ' +
    'reconciled, because applying the wrong direction would attach 26 nodes to the wrong ' +
    'document. Resolving a citation also does not make it sufficient — see OQ-E02.',
};

/** All open items, most blocking first. */
export const OPEN_GOVERNANCE_ITEMS: readonly OpenGovernanceItem[] = [
  SR_009,
  OQ_E01,
  OQ_E02,
  SR_004_007,
  SR_011,
  SR_014,
  SR_001,
  SR_002_003,
  OQ_E03,
  OQ_S01,
  OQ_R01,
  SR_012,
  SR_013,
  OQ_R02,
  OQ_L01,
];

const SEVERITY_ORDER: Readonly<Record<OpenGovernanceItem['severity'], number>> = {
  BLOCKER: 0,
  CRITICAL: 1,
  OPEN: 2,
};

export const openItemsBySeverity = (): readonly OpenGovernanceItem[] =>
  [...OPEN_GOVERNANCE_ITEMS].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity],
  );
