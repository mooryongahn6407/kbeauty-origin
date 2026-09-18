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

/** All open items, most blocking first. */
export const OPEN_GOVERNANCE_ITEMS: readonly OpenGovernanceItem[] = [
  SR_009,
  SR_004_007,
  SR_011,
  SR_014,
  SR_001,
  SR_002_003,
  SR_012,
  SR_013,
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
