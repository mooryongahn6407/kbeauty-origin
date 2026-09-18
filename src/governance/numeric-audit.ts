/**
 * Numeric consistency audit.
 *
 * A number that appears in two places in the sources is a claim made twice. When the two
 * disagree, something downstream teaches the wrong thing — and the contradiction is invisible
 * unless something looks for it. QST-007 (a quest asking for 4 steps whose core node teaches 3)
 * was found this way; this module generalises that one check into a standing audit.
 *
 * Every check compares **governed data against governed data**. The audit reports a
 * GOVERNANCE WARNING and never reconciles: deciding which of two numbers is correct is an
 * editorial act with consequences across Quest → Node → Routine → Lesson → Assessment.
 *
 * One check is deliberately different: MASTERY_RULE_VS_ENGINE compares the source's stated
 * thresholds against the constants the mastery engine runs on, so code drifting away from the
 * approved rule is caught as a contradiction too.
 */
import { MASTERY_THRESHOLDS } from '@/mastery/mastery-engine';
import {
  contentAtoms,
  findNode,
  ingredients,
  knowledgeNodes,
  masteryRules,
  productCategories,
  questNodeLinks,
  quests,
  concerns,
  routines,
  skills,
} from '@/knowledge/repository';
import { routineViews } from '@/knowledge/routines';
import readmeData from '../../data/source/readme.json';
import dashboardData from '../../data/source/dashboard.json';

export type NumericCheckId =
  | 'QUEST_WIN_VS_CORE_NODE'
  | 'ROUTINE_NAME_VS_STEP_COUNT'
  | 'ROUTINE_DESCRIPTION_VS_STEP_COUNT'
  | 'README_SEED_COUNT_VS_ROWS'
  | 'DASHBOARD_DOMAIN_COUNT_VS_ROWS'
  | 'MASTERY_RULE_VS_ENGINE';

export interface NumericFinding {
  readonly check: NumericCheckId;
  /** What concept is being counted, in plain words. */
  readonly concept: string;
  /** Where the first number is stated, and what it says. */
  readonly leftSource: string;
  readonly leftValue: string;
  /** Where the second number is stated, and what it says. */
  readonly rightSource: string;
  readonly rightValue: string;
  readonly detail: string;
  readonly registerId: string | null;
}

export interface NumericCheckResult {
  readonly check: NumericCheckId;
  readonly description: string;
  readonly comparisons: number;
  readonly findings: readonly NumericFinding[];
}

/** Integers appearing in a string, de-duplicated and in order of first appearance. */
const integersIn = (text: string): readonly number[] => [
  ...new Set((text.match(/\d+/g) ?? []).map(Number)),
];

/**
 * Ranges written with an en dash or hyphen, e.g. "3–4단계".
 * Returned as the inclusive set of integers so "4 steps" satisfies "3–4".
 */
function numericClaim(text: string): readonly number[] {
  const range = /(\d+)\s*[–~-]\s*(\d+)/.exec(text);
  if (range) {
    const low = Number(range[1]);
    const high = Number(range[2]);
    if (high >= low && high - low < 20) {
      return Array.from({ length: high - low + 1 }, (_, i) => low + i);
    }
  }
  return integersIn(text);
}

const agrees = (left: readonly number[], right: readonly number[]): boolean =>
  left.length === 0 || right.length === 0 || left.some((value) => right.includes(value));

/* ── 1. Quest win condition vs its Core node title ──────────────────────── */

function questWinVsCoreNode(): NumericCheckResult {
  const findings: NumericFinding[] = [];
  let comparisons = 0;

  for (const quest of quests) {
    const coreLink = questNodeLinks.find(
      (link) => link.Quest_ID === quest.Quest_ID && link.Role === 'Core',
    );
    const coreNode = coreLink ? findNode(coreLink.Node_ID) : undefined;
    if (!coreNode) continue;

    const win = numericClaim(quest.Win_Condition);
    const node = numericClaim(coreNode.Node_Title);
    if (win.length === 0 || node.length === 0) continue;
    comparisons += 1;
    if (agrees(win, node)) continue;

    findings.push({
      check: 'QUEST_WIN_VS_CORE_NODE',
      concept: 'target count stated by a quest versus its core knowledge',
      leftSource: `11_QUESTS ${quest.Quest_ID} Win_Condition`,
      leftValue: quest.Win_Condition,
      rightSource: `03_KNOWLEDGE_NODES ${coreNode.Node_ID} Node_Title`,
      rightValue: coreNode.Node_Title,
      detail:
        `${quest.Quest_ID} states ${win.join('/')} while its core node ${coreNode.Node_ID} ` +
        `states ${node.join('/')}.`,
      registerId: 'OQ-R02',
    });
  }

  return {
    check: 'QUEST_WIN_VS_CORE_NODE',
    description: 'A quest win condition and its core node must not state different counts.',
    comparisons,
    findings,
  };
}

/* ── 2 & 3. Routine name / description vs actual step count ─────────────── */

function routineNameVsSteps(): NumericCheckResult {
  const findings: NumericFinding[] = [];
  let comparisons = 0;

  for (const view of routineViews()) {
    if (!view.isSequenced) continue;
    const claimed = numericClaim(view.routine.Routine_Name);
    if (claimed.length === 0) continue;
    comparisons += 1;
    if (claimed.includes(view.steps.length)) continue;

    findings.push({
      check: 'ROUTINE_NAME_VS_STEP_COUNT',
      concept: 'step count named by a routine versus the steps it actually lists',
      leftSource: `09_ROUTINES ${view.routine.Routine_ID} Routine_Name`,
      leftValue: view.routine.Routine_Name,
      rightSource: `09_ROUTINES ${view.routine.Routine_ID} Default_Sequence`,
      rightValue: `${view.steps.length} steps`,
      detail: `${view.routine.Routine_ID} is named for ${claimed.join('/')} step(s) but lists ${view.steps.length}.`,
      registerId: 'OQ-R01',
    });
  }

  return {
    check: 'ROUTINE_NAME_VS_STEP_COUNT',
    description: 'A routine named for a step count must list that many steps.',
    comparisons,
    findings,
  };
}

function routineDescriptionVsSteps(): NumericCheckResult {
  const findings: NumericFinding[] = [];
  let comparisons = 0;

  for (const view of routineViews()) {
    if (!view.isSequenced) continue;
    const claimed = numericClaim(view.routine.Description);
    if (claimed.length === 0) continue;
    comparisons += 1;
    if (claimed.includes(view.steps.length)) continue;

    findings.push({
      check: 'ROUTINE_DESCRIPTION_VS_STEP_COUNT',
      concept: 'step count described by a routine versus the steps it actually lists',
      leftSource: `09_ROUTINES ${view.routine.Routine_ID} Description`,
      leftValue: view.routine.Description,
      rightSource: `09_ROUTINES ${view.routine.Routine_ID} Default_Sequence`,
      rightValue: `${view.steps.length} steps`,
      detail: `${view.routine.Routine_ID} describes ${claimed.join('/')} step(s) but lists ${view.steps.length}.`,
      registerId: 'OQ-R01',
    });
  }

  return {
    check: 'ROUTINE_DESCRIPTION_VS_STEP_COUNT',
    description:
      'A routine description stating a step count must match the sequence. Ranges such as "3–4단계" are satisfied by any value in range.',
    comparisons,
    findings,
  };
}

/* ── 4. README MVP seed counts vs actual row counts ─────────────────────── */

/** Entity words the README seed line uses, mapped to the rows they count. */
const README_ENTITIES: readonly { readonly label: string; readonly rows: () => number }[] = [
  { label: 'Knowledge Nodes', rows: () => knowledgeNodes.length },
  { label: 'Skills', rows: () => skills.length },
  { label: 'Ingredients', rows: () => ingredients.length },
  { label: 'Concerns', rows: () => concerns.length },
  { label: 'Categories', rows: () => productCategories.length },
  { label: 'Routines', rows: () => routines.length },
  { label: 'Quests', rows: () => quests.length },
];

function readmeSeedVsRows(): NumericCheckResult {
  const findings: NumericFinding[] = [];
  let comparisons = 0;
  const text = (readmeData.rows as readonly (readonly string[])[])
    .map((row) => row.join(' '))
    .join('\n');

  for (const entity of README_ENTITIES) {
    const match = new RegExp(`(\\d+)\\s+${entity.label}\\b`).exec(text);
    if (!match) continue;
    comparisons += 1;
    const stated = Number(match[1]);
    const actual = entity.rows();
    if (stated === actual) continue;

    findings.push({
      check: 'README_SEED_COUNT_VS_ROWS',
      concept: `${entity.label} counted in the README versus rows present`,
      leftSource: '00_README MVP seed',
      leftValue: `${stated} ${entity.label}`,
      rightSource: 'extracted rows',
      rightValue: `${actual}`,
      detail: `The README states ${stated} ${entity.label} but ${actual} rows are present.`,
      registerId: null,
    });
  }

  return {
    check: 'README_SEED_COUNT_VS_ROWS',
    description: 'Counts stated in prose by 00_README must match the rows actually present.',
    comparisons,
    findings,
  };
}

/* ── 5. Dashboard per-domain node counts vs actual ──────────────────────── */

function dashboardDomainVsRows(): NumericCheckResult {
  const findings: NumericFinding[] = [];
  let comparisons = 0;
  const rows = dashboardData.rows as readonly (readonly string[])[];

  for (const row of rows) {
    for (let i = 0; i < row.length - 1; i += 1) {
      // The dashboard lays domain counts out as an adjacent pair: "D01 Skin Foundations" | "20".
      const label = /^(D\d{2})\s+\S/.exec(row[i] ?? '');
      const next = (row[i + 1] ?? '').trim();
      if (!label || !/^\d+$/.test(next)) continue;

      const domainId = label[1]!;
      const stated = Number(next);
      const actual = knowledgeNodes.filter((node) => node.Domain_ID === domainId).length;
      comparisons += 1;
      if (stated === actual) continue;

      findings.push({
        check: 'DASHBOARD_DOMAIN_COUNT_VS_ROWS',
        concept: `nodes counted for ${domainId} on the dashboard versus rows present`,
        leftSource: `99_DASHBOARD ${row[i]}`,
        leftValue: `${stated}`,
        rightSource: `03_KNOWLEDGE_NODES Domain_ID=${domainId}`,
        rightValue: `${actual}`,
        detail: `The dashboard states ${stated} nodes for ${domainId} but ${actual} rows are present.`,
        registerId: null,
      });
    }
  }

  return {
    check: 'DASHBOARD_DOMAIN_COUNT_VS_ROWS',
    description: 'Per-domain node counts on 99_DASHBOARD must match the node rows.',
    comparisons,
    findings,
  };
}

/* ── 6. Mastery rule thresholds vs the constants the engine runs on ─────── */

const ENGINE_THRESHOLD_BY_RULE: Readonly<Record<string, number>> = Object.fromEntries(
  Object.values(MASTERY_THRESHOLDS).map((threshold) => [threshold.ruleId, threshold.ratio]),
);

function masteryRuleVsEngine(): NumericCheckResult {
  const findings: NumericFinding[] = [];
  let comparisons = 0;

  for (const rule of masteryRules) {
    const engineRatio = ENGINE_THRESHOLD_BY_RULE[rule.Rule_ID];
    if (engineRatio === undefined) continue;
    const stated = /(\d+)\s*%/.exec(rule.Operational_Rule);
    if (!stated) continue;
    comparisons += 1;

    const statedPercent = Number(stated[1]);
    const enginePercent = Math.round(engineRatio * 100);
    if (statedPercent === enginePercent) continue;

    findings.push({
      check: 'MASTERY_RULE_VS_ENGINE',
      concept: `threshold for ${rule.Evidence_Type}`,
      leftSource: `19_MASTERY_RULES ${rule.Rule_ID} Operational_Rule`,
      leftValue: rule.Operational_Rule,
      rightSource: 'src/mastery/mastery-engine.ts MASTERY_THRESHOLDS',
      rightValue: `${enginePercent}%`,
      detail: `${rule.Rule_ID} states ${statedPercent}% but the engine runs on ${enginePercent}%.`,
      registerId: 'SR-013',
    });
  }

  return {
    check: 'MASTERY_RULE_VS_ENGINE',
    description:
      'Thresholds the mastery engine runs on must match the approved rule text. This is the one check that compares code against a source.',
    comparisons,
    findings,
  };
}

/* ── Audit ──────────────────────────────────────────────────────────────── */

export interface NumericAuditReport {
  readonly checks: readonly NumericCheckResult[];
  readonly totalComparisons: number;
  readonly findings: readonly NumericFinding[];
  /** True when every numeric claim the audit can compare agrees. */
  readonly clean: boolean;
}

/** Run every numeric consistency check and report a GOVERNANCE WARNING per disagreement. */
export function runNumericAudit(): NumericAuditReport {
  const checks = [
    questWinVsCoreNode(),
    routineNameVsSteps(),
    routineDescriptionVsSteps(),
    readmeSeedVsRows(),
    dashboardDomainVsRows(),
    masteryRuleVsEngine(),
  ];
  const findings = checks.flatMap((check) => check.findings);

  return {
    checks,
    totalComparisons: checks.reduce((sum, check) => sum + check.comparisons, 0),
    findings,
    clean: findings.length === 0,
  };
}

/**
 * Numeric concepts the product owner asked to be covered, and whether the audit covers them
 * yet. Reported honestly so the gaps are visible rather than implied to be checked.
 */
export const AUDIT_COVERAGE: readonly {
  readonly concept: string;
  readonly covered: boolean;
  readonly note: string;
}[] = [
  {
    concept: 'Routine step count',
    covered: true,
    note: 'Routine name and description are both compared against the sequence actually listed.',
  },
  {
    concept: 'Quest objective / target count',
    covered: true,
    note: 'A quest Win_Condition is compared against the title of its Core knowledge node.',
  },
  {
    concept: 'Mastery criteria count and thresholds',
    covered: true,
    note: 'Ratios stated in 19_MASTERY_RULES are compared against the constants the engine runs on.',
  },
  {
    concept: 'Number of ingredients',
    covered: true,
    note: 'The README MVP seed line states a count per entity; each is compared against the rows.',
  },
  {
    concept: 'Number of stages / domains',
    covered: true,
    note: 'The dashboard states a node count per domain; each is compared against the rows.',
  },
  {
    concept: 'Number of questions per lesson',
    covered: false,
    note: 'No source states a per-lesson question count; 21_CONTENT_ATOMS has no such field.',
  },
  {
    concept: 'Number of choices per question',
    covered: false,
    note: 'Authored activities fix this at 3; no source states a required number to compare against.',
  },
  {
    concept: 'Number of days (e.g. a 7-day quest)',
    covered: false,
    note: 'QST-022 states 7 days in its Win_Condition, but no schedule record exists to compare it with.',
  },
];
