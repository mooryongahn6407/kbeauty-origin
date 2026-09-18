/**
 * Quests & Mastery.
 *
 * Source: Master DB 11_QUESTS, 12_QUEST_NODE_MAP, 04_SKILLS, 19_MASTERY_RULES.
 *
 * The last MVP world, and the one where the state of the whole corpus becomes visible at once.
 * It is a map of what is locked and why, not a progress bar: 18 of 25 quests cannot open, and
 * each names the record stopping it.
 *
 * Two things are deliberately absent. There is no XP number, because no source states an
 * amount for any reward label (OQ-X01). And no learner is assigned a level, because the
 * seven-level ladder is marked "DECISION DRAFT — NOT CANONICAL". What is shown instead is
 * mastery evidence per governed skill, which is the measure the curriculum actually defines.
 */
import { useState } from 'react';
import type { MasteryDimension } from '@/domain/learning';
import { questMapReport, questWorlds } from '@/app/quest-map';
import { MASTERY_THRESHOLDS, governedMasteryRules } from '@/mastery/mastery-engine';
import { masteryLedger, skillProgress } from '@/mastery/mastery-ledger';
import { findUnresolvedQuestSkills } from '@/governance/integrity';
import { translate, type MessageKey } from '@/localization/messages';
import { ProvenanceStrip } from '../components/Disclosures';

const DIMENSIONS: readonly { dimension: MasteryDimension; key: MessageKey }[] = [
  { dimension: 'accuracy', key: 'mastery.accuracy' },
  { dimension: 'independence', key: 'mastery.independence' },
  { dimension: 'transfer', key: 'mastery.transfer' },
  { dimension: 'retention', key: 'mastery.retention' },
];

/**
 * Levels transcribed from the Mastery Competency Matrix, which marks itself
 * "DECISION DRAFT — NOT CANONICAL". Shown as a proposal, never assigned.
 */
const PROPOSED_LADDER: readonly { level: string; title: string; capability: string }[] = [
  { level: 'L1', title: 'Beauty Explorer', capability: 'Recognize foundational Beauty concepts.' },
  { level: 'L2', title: 'Beauty Learner', capability: 'Explain foundational concepts accurately.' },
  { level: 'L3', title: 'Beauty Advisor', capability: 'Apply knowledge to straightforward scenarios.' },
  { level: 'L4', title: 'Beauty Specialist', capability: 'Compare options using explicit criteria.' },
  { level: 'L5', title: 'Beauty Expert', capability: 'Decide and justify; transfer to unfamiliar cases.' },
  { level: 'L6', title: 'Beauty Professional', capability: 'Guide within safety boundaries, in simulation.' },
  { level: 'L7', title: 'Beauty Master', capability: 'Integrate, teach and transfer independently.' },
];

function QuestMapPanel({ locale }: { locale: string }) {
  const report = questMapReport();
  const worlds = questWorlds();
  const unresolved = findUnresolvedQuestSkills();

  return (
    <section className="card">
      <p className="eyebrow">{translate('quest.mapTitle', locale)}</p>
      <p className="muted">
        {translate('quest.summary', locale, {
          open: String(report.open),
          total: String(report.total),
          worlds: String(report.worlds),
          served: String(report.served),
          missing: String(report.blockedByMissingRecord),
        })}
      </p>
      <p className="disclosure disclosure--info">
        <span className="disclosure__mark">i</span>
        <span>{translate('quest.rewardNote', locale)}</span>
      </p>
      {unresolved.length > 0 ? (
        <p className="disclosure disclosure--caution">
          <span className="disclosure__mark">!</span>
          <span>
            OQ-Q01 —{' '}
            {unresolved
              .map((item) => `${item.questId} names skill “${item.primarySkill}”`)
              .join('; ')}
            , which is not one of the {unresolved[0]!.registeredSkillNames.length} skills in
            04_SKILLS.
          </span>
        </p>
      ) : null}

      {worlds.map((world) => (
        <div key={world.world} className="card card--sunk" style={{ marginTop: '0.8rem' }}>
          <div className="masthead__row">
            <h3 style={{ margin: 0 }}>{world.world}</h3>
            <span className="tag">
              {world.openCount}/{world.entries.length} {translate('quest.open', locale).toLowerCase()}
            </span>
          </div>
          <table className="table">
            <tbody>
              {world.entries.map((entry) => (
                <tr key={entry.quest.Quest_ID}>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span
                      className={`tag tag--${entry.availability.available ? 'open' : 'blocker'}`}
                    >
                      {entry.availability.available
                        ? translate('quest.open', locale)
                        : translate('quest.closed', locale)}
                    </span>
                    <br />
                    {entry.quest.Quest_ID}
                  </td>
                  <td>
                    <strong>{entry.quest.Quest_Name}</strong>
                    <br />
                    <span className="muted">{entry.quest.Win_Condition}</span>
                    {entry.servedByPlanId ? (
                      <>
                        <br />
                        <span className="muted" style={{ fontSize: '0.72rem' }}>
                          {translate('quest.servedBy', locale)}: {entry.servedByPlanId}
                        </span>
                      </>
                    ) : null}
                  </td>
                  <td className="muted" style={{ whiteSpace: 'nowrap' }}>
                    <span className="tag">{entry.claimClass}</span>
                    <br />
                    {translate('quest.reward', locale)}: {entry.reward}
                    <br />
                    {entry.primarySkillUnresolved ? (
                      <span className="tag tag--blocker">
                        {translate('quest.unresolvedSkill', locale)}
                      </span>
                    ) : (
                      <>
                        {entry.primarySkillId} {entry.quest.Primary_Skill}
                      </>
                    )}
                  </td>
                  <td className="muted">
                    {entry.availability.available ? (
                      translate('quest.noBlockers', locale)
                    ) : (
                      <>
                        <strong>{translate('quest.blockers', locale)}</strong>
                        <br />
                        {[
                          ...new Set(
                            entry.availability.blockers.map(
                              (blocker) => `${blocker.recordId} (${blocker.registerId ?? '—'})`,
                            ),
                          ),
                        ]
                          .slice(0, 4)
                          .join(', ')}
                        {entry.availability.blockers.length > 4
                          ? ` … ${entry.availability.blockers.length} total`
                          : ''}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <ProvenanceStrip
        entries={[
          { label: translate('common.source', locale), value: '11_QUESTS · 12_QUEST_NODE_MAP' },
          { label: 'Register', value: 'SR-004 … SR-007 · OQ-Q01 · OQ-X01' },
        ]}
      />
    </section>
  );
}

function MasteryPanel({ locale, version }: { locale: string; version: number }) {
  const snapshot = masteryLedger.snapshot();
  const rows = skillProgress(masteryLedger);

  return (
    <section className="card" key={version}>
      <p className="eyebrow">{translate('quest.masteryTitle', locale)}</p>
      <p className="muted">{translate('quest.masteryIntro', locale)}</p>
      <p className="lead">
        {translate('quest.ledgerSummary', locale, {
          attempts: String(snapshot.attemptCount),
          started: String(snapshot.startedSkillIds.length),
          mastered: String(snapshot.masteredSkillIds.length),
        })}
      </p>
      <p className="muted">{translate('mastery.explainer', locale)}</p>

      <table className="table">
        <thead>
          <tr>
            <th>Skill</th>
            {DIMENSIONS.map((item) => (
              <th key={item.dimension}>{translate(item.key, locale)}</th>
            ))}
            <th>{translate('mastery.state', locale)}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.skillId}>
              <td>
                <strong>
                  {row.skillId} {row.skillName}
                </strong>
                <br />
                <span className="muted">{row.definition}</span>
                {row.state.nodeEvidence.length > 0 ? (
                  <>
                    <br />
                    <span className="muted" style={{ fontSize: '0.7rem' }}>
                      {translate('quest.evidenceFrom', locale)}:{' '}
                      {row.state.nodeEvidence.join(', ')}
                    </span>
                  </>
                ) : null}
              </td>
              {DIMENSIONS.map((item) => {
                const dimension = row.state.dimensions[item.dimension];
                const threshold = MASTERY_THRESHOLDS[item.dimension];
                return (
                  <td key={item.dimension} className="muted">
                    {dimension.attempts === 0 ? (
                      '—'
                    ) : (
                      <>
                        {dimension.successes}/{dimension.attempts}
                        <br />
                        <span className={`tag${dimension.satisfied ? '' : ''}`}>
                          {dimension.satisfied
                            ? translate('mastery.satisfied', locale)
                            : translate('mastery.notYet', locale)}
                        </span>
                      </>
                    )}
                    <br />
                    <span style={{ fontSize: '0.66rem', opacity: 0.7 }}>
                      {threshold.ruleId} ≥{Math.round(threshold.ratio * 100)}% · min{' '}
                      {threshold.minAttempts}
                    </span>
                  </td>
                );
              })}
              <td>
                {row.hasEvidence ? (
                  <strong>{row.state.state}</strong>
                ) : (
                  <span className="muted">{translate('quest.noEvidence', locale)}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: '0.9rem' }}>19_MASTERY_RULES</h3>
      <table className="table">
        <tbody>
          {governedMasteryRules.map((rule) => (
            <tr key={rule.Rule_ID}>
              <td>{rule.Rule_ID}</td>
              <td>{rule.Evidence_Type}</td>
              <td className="muted">{rule.Definition}</td>
              <td className="muted">{rule.Operational_Rule}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function LadderPanel({ locale }: { locale: string }) {
  return (
    <section className="card card--sunk">
      <p className="eyebrow">{translate('quest.ladderTitle', locale)}</p>
      <p className="disclosure disclosure--caution">
        <span className="disclosure__mark">!</span>
        <span>{translate('quest.ladderNote', locale)}</span>
      </p>
      <table className="table">
        <tbody>
          {PROPOSED_LADDER.map((entry) => (
            <tr key={entry.level}>
              <td>{entry.level}</td>
              <td>
                <strong>{entry.title}</strong>
              </td>
              <td className="muted">{entry.capability}</td>
              <td>
                <span className="tag tag--open">PROPOSED</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ProvenanceStrip
        entries={[
          {
            label: translate('common.source', locale),
            value: 'KOREA_GLOW_Beauty_Mastery_Competency_Matrix_v1.0',
          },
          { label: translate('common.status', locale), value: 'DECISION DRAFT — NOT CANONICAL' },
        ]}
      />
    </section>
  );
}

export function QuestMasteryScreen({ locale }: { locale: string }) {
  // Bumped when the learner clears their evidence, so the panel re-reads the ledger.
  const [version, setVersion] = useState(0);

  return (
    <div className="stack">
      <section className="card">
        <p className="eyebrow">{translate('nav.quests', locale)}</p>
        <h1>{translate('quest.title', locale)}</h1>
        <p className="muted">{translate('quest.intro', locale)}</p>
        <div className="btn--row">
          <button
            className="btn btn--quiet"
            type="button"
            onClick={() => {
              masteryLedger.reset();
              setVersion((current) => current + 1);
            }}
          >
            {translate('quest.resetLedger', locale)}
          </button>
        </div>
      </section>

      <MasteryPanel locale={locale} version={version} />
      <QuestMapPanel locale={locale} />
      <LadderPanel locale={locale} />
    </div>
  );
}
