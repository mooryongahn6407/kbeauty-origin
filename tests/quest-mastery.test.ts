/**
 * Quest & Mastery tests.
 *
 * Source: Master DB 11_QUESTS, 12_QUEST_NODE_MAP, 04_SKILLS, 19_MASTERY_RULES.
 *
 * Two properties carry most of the weight here:
 *
 *   1. **Mastery can only be earned.** The ledger has no grant, award or unlock. A quest cannot
 *      confer a level, a screen cannot hand one out, and no commercial or loyalty state can
 *      reach it — CLAUDE.md rule 9.
 *   2. **No points economy is invented.** No source states an amount for any reward label or a
 *      threshold for any level, so nothing is totalled and no learner is assigned a level.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import type { Attempt } from '@/domain/learning';
import {
  QUEST_CLAIM_CLASS,
  claimClassFor,
  questMap,
  questMapReport,
  questWorlds,
} from '@/app/quest-map';
import { createMasteryLedger, skillProgress, type MasteryLedger } from '@/mastery/mastery-ledger';
import { isMastered } from '@/mastery/mastery-engine';
import { findUnresolvedQuestSkills } from '@/governance/integrity';
import { LESSON_PLANS } from '@/app/learning-session';
import { quests, skills } from '@/knowledge/repository';

const AT = '2026-09-18T00:00:00.000Z';

let attemptSeq = 0;
/** Real attempts carry distinct ids; the fixture must too, or idempotency would mask a bug. */
const attempt = (overrides: Partial<Attempt> = {}): Attempt => ({
  attemptId: `a${(attemptSeq += 1)}`,
  userId: 'u1',
  nodeId: 'KN-D01-07-001',
  skillId: 'SK01',
  activityId: 'AUTHORED-ACT-001',
  correct: true,
  hintsUsed: 0,
  isTransfer: false,
  isRetention: false,
  at: AT,
  ...overrides,
});

describe('quest map covers every governed quest', () => {
  const report = questMapReport();

  it('maps all 25 quests across the 12 worlds the source names', () => {
    expect(report.total).toBe(25);
    expect(report.worlds).toBe(12);
    expect(questMap()).toHaveLength(quests.length);
    expect(questWorlds().reduce((sum, world) => sum + world.entries.length, 0)).toBe(25);
  });

  it('reports far more locked than open, and says so honestly', () => {
    expect(report.open).toBe(7);
    expect(report.blocked).toBe(18);
    expect(report.open + report.blocked).toBe(25);
  });

  it('names a record and register entry for every blocker on every locked quest', () => {
    for (const entry of questMap()) {
      if (entry.availability.available) continue;
      expect(entry.availability.blockers.length, entry.quest.Quest_ID).toBeGreaterThan(0);
      for (const blocker of entry.availability.blockers) {
        expect(blocker.recordId, entry.quest.Quest_ID).toMatch(/^(KN|ING|QST)-/);
        expect(blocker.registerId, `${entry.quest.Quest_ID}/${blocker.recordId}`).toBeTruthy();
      }
    }
  });

  it('still reports the three quests blocked by a node that does not exist', () => {
    const missing = questMap()
      .filter((entry) =>
        entry.availability.blockers.some((blocker) => blocker.reason === 'MISSING_RECORD'),
      )
      .map((entry) => entry.quest.Quest_ID)
      .sort();
    // SR-004 (QST-006), SR-005 (QST-011), SR-006 (QST-012).
    expect(missing).toEqual(['QST-006', 'QST-011', 'QST-012']);
    expect(report.blockedByMissingRecord).toBe(3);
  });

  it('links the two quests a lesson plan actually serves', () => {
    const served = questMap()
      .filter((entry) => entry.servedByPlanId !== null)
      .map((entry) => `${entry.quest.Quest_ID}:${entry.servedByPlanId}`)
      .sort();
    expect(served).toEqual(['QST-001:mirror-detective', 'QST-013:label-reading']);
    // Every plan that names a quest must appear here.
    const planQuests = LESSON_PLANS.filter((plan) => plan.questId !== null).length;
    expect(served).toHaveLength(planQuests);
  });
});

describe('claim class per quest is a reviewable editorial decision', () => {
  it('defaults to SCIENTIFIC and only departs with a stated reason', () => {
    for (const entry of questMap()) {
      if (entry.claimClass === 'SCIENTIFIC') continue;
      expect(entry.claimClassReason, entry.quest.Quest_ID).toBeTruthy();
      expect(entry.claimClassReason!.length).toBeGreaterThan(30);
    }
    expect(claimClassFor('QST-099')).toBe('SCIENTIFIC');
  });

  it('marks only quests whose win condition separates, records or classifies', () => {
    expect(Object.keys(QUEST_CLAIM_CLASS).sort()).toEqual([
      'QST-001', 'QST-013', 'QST-014', 'QST-015', 'QST-016', 'QST-021', 'QST-022',
    ]);
    for (const questId of Object.keys(QUEST_CLAIM_CLASS)) {
      expect(quests.some((quest) => quest.Quest_ID === questId), questId).toBe(true);
    }
  });

  it('keeps every ingredient, routine and sun quest scientific', () => {
    for (const questId of ['QST-008', 'QST-009', 'QST-010', 'QST-007', 'QST-004', 'QST-005']) {
      expect(claimClassFor(questId), questId).toBe('SCIENTIFIC');
    }
  });
});

describe('no points economy is invented (OQ-X01)', () => {
  it('shows reward labels verbatim and totals nothing', () => {
    const report = questMapReport();
    expect(report.rewardLabels).toEqual({
      XP: 8,
      Badge: 11,
      Card: 1,
      Collection: 1,
      Seed: 1,
      Boss: 2,
      Crown: 1,
    });
    // Each entry carries the label, not a number.
    for (const entry of questMap()) {
      expect(typeof entry.reward).toBe('string');
      expect(entry.reward).toBe(entry.quest.Reward);
    }
  });

  it('exposes no points, score or level field anywhere in the quest map', () => {
    const serialised = JSON.stringify(questMap());
    expect(serialised).not.toMatch(/"(points|score|xpAmount|levelNumber|totalXp)"/i);
  });
});

describe('unresolved quest skill reference (OQ-Q01)', () => {
  const unresolved = findUnresolvedQuestSkills();

  it('finds exactly one quest naming a skill that does not exist', () => {
    expect(unresolved).toHaveLength(1);
    expect(unresolved[0]).toMatchObject({
      questId: 'QST-025',
      questName: 'Final Beauty Intelligence Trial',
      primarySkill: 'Mastery',
    });
    expect(unresolved[0]!.registeredSkillNames).toHaveLength(12);
  });

  it('leaves that quest with no skill attached rather than guessing one', () => {
    const entry = questMap().find((item) => item.quest.Quest_ID === 'QST-025')!;
    expect(entry.primarySkillUnresolved).toBe(true);
    expect(entry.primarySkillId).toBeNull();
  });

  it('resolves every other quest to a real Skill_ID', () => {
    const ids = new Set(skills.map((skill) => skill.Skill_ID));
    for (const entry of questMap()) {
      if (entry.quest.Quest_ID === 'QST-025') continue;
      expect(entry.primarySkillId, entry.quest.Quest_ID).not.toBeNull();
      expect(ids.has(entry.primarySkillId!), entry.quest.Quest_ID).toBe(true);
    }
  });

  it('does not invent a thirteenth skill to make the reference resolve', () => {
    expect(skills).toHaveLength(12);
    expect(skills.some((skill) => skill.Skill_Name === 'Mastery')).toBe(false);
  });
});

describe('mastery ledger: evidence is earned, never granted', () => {
  let ledger: MasteryLedger;

  beforeEach(() => {
    ledger = createMasteryLedger('test-learner');
    attemptSeq = 0;
  });

  it('exposes no way to award, grant or unlock mastery', () => {
    const surface = Object.keys(ledger).sort();
    expect(surface).toEqual(['record', 'reset', 'snapshot', 'stateFor']);
    for (const forbidden of ['grant', 'award', 'unlock', 'setMastered', 'addXp', 'setLevel']) {
      expect(ledger, forbidden).not.toHaveProperty(forbidden);
    }
  });

  it('starts empty, with a state for every governed skill and evidence for none', () => {
    const rows = skillProgress(ledger);
    expect(rows).toHaveLength(12);
    expect(rows.every((row) => !row.hasEvidence)).toBe(true);
    expect(rows.every((row) => !row.mastered)).toBe(true);
    expect(ledger.snapshot().attemptCount).toBe(0);
  });

  it('accumulates evidence across worlds for the same skill', () => {
    // SK06 is practised in both Ingredient Garden and Label Detective.
    ledger.record(attempt({ skillId: 'SK06', nodeId: 'KN-D11-02-001' }));
    ledger.record(attempt({ skillId: 'SK06', nodeId: 'KN-D11-07-001' }));
    const state = ledger.stateFor('SK06');
    expect(state.dimensions.accuracy.attempts).toBe(2);
    expect(state.nodeEvidence).toEqual(['KN-D11-02-001', 'KN-D11-07-001']);
    expect(ledger.snapshot().startedSkillIds).toEqual(['SK06']);
  });

  it('keeps skills separate: evidence for one does not advance another', () => {
    ledger.record(attempt({ skillId: 'SK01' }));
    expect(ledger.stateFor('SK01').dimensions.accuracy.attempts).toBe(1);
    expect(ledger.stateFor('SK06').dimensions.accuracy.attempts).toBe(0);
  });

  it('drops an attempt for a skill that does not exist rather than creating one', () => {
    ledger.record(attempt({ skillId: 'SK99' }));
    expect(ledger.snapshot().attemptCount).toBe(0);
    expect(ledger.snapshot().startedSkillIds).toEqual([]);
    expect(skillProgress(ledger)).toHaveLength(12);
  });

  it('still requires all four dimensions before a skill is mastered', () => {
    for (let i = 0; i < 20; i += 1) ledger.record(attempt({ skillId: 'SK01' }));
    const state = ledger.stateFor('SK01');
    expect(state.dimensions.accuracy.satisfied).toBe(true);
    expect(isMastered(state)).toBe(false);
    expect(ledger.snapshot().masteredSkillIds).toEqual([]);
  });

  it('reaches Mastered only with accuracy, independence, transfer and retention', () => {
    for (let i = 0; i < 5; i += 1) ledger.record(attempt({ skillId: 'SK01' }));
    for (let i = 0; i < 3; i += 1) ledger.record(attempt({ skillId: 'SK01', isTransfer: true }));
    ledger.record(attempt({ skillId: 'SK01', isRetention: true }));
    expect(ledger.snapshot().masteredSkillIds).toEqual(['SK01']);
    expect(skillProgress(ledger).find((row) => row.skillId === 'SK01')!.mastered).toBe(true);
  });

  it('reports which nodes supplied the evidence, for traceability', () => {
    ledger.record(attempt({ skillId: 'SK01', nodeId: 'KN-D01-07-001' }));
    ledger.record(attempt({ skillId: 'SK05', nodeId: 'KN-D08-03-001' }));
    expect(ledger.snapshot().nodesEvidenced).toEqual(['KN-D01-07-001', 'KN-D08-03-001']);
  });

  it('counts a repeated write of the same attempt once', () => {
    // The caller records from inside a reducer, which React StrictMode invokes twice in
    // development. One answer must never show as two.
    const once = attempt({ skillId: 'SK01' });
    ledger.record(once);
    ledger.record(once);
    expect(ledger.snapshot().attemptCount).toBe(1);
    expect(ledger.stateFor('SK01').dimensions.accuracy.attempts).toBe(1);
  });

  it('clears only when explicitly reset', () => {
    ledger.record(attempt());
    expect(ledger.snapshot().attemptCount).toBe(1);
    ledger.reset();
    expect(ledger.snapshot().attemptCount).toBe(0);
    expect(ledger.snapshot().startedSkillIds).toEqual([]);
  });
});

describe('skill progress reports all twelve governed skills', () => {
  it('lists every skill with its source definition, whether or not it has evidence', () => {
    const ledger = createMasteryLedger('u');
    const rows = skillProgress(ledger);
    expect(rows.map((row) => row.skillId)).toEqual(skills.map((skill) => skill.Skill_ID));
    for (const row of rows) {
      expect(row.definition.length).toBeGreaterThan(5);
      expect(row.linkedDomains.length).toBeGreaterThan(1);
    }
  });
});
