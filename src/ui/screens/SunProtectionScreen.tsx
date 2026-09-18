/**
 * Sun Protection — the Sun Observatory.
 *
 * Grounded in Domain D04, quests QST-004 / QST-005, and 14_EVIDENCE.
 *
 * This is the world where the evidence position is weakest and the stakes are highest, so it
 * is deliberately the most restrained. It offers no guidance on what protection to use. It
 * offers an exposure log the user fills in themselves, one lesson about the boundary between
 * observation and decision, the two governed quests reported as closed, and a plain statement
 * of the domain's evidence position.
 */
import { useReducer, useState } from 'react';
import { SUN_EXPOSURE_PLAN, loadSliceGrounding } from '@/app/learning-session';
import {
  EXPOSURE_BANDS,
  EXPOSURE_SETTINGS,
  MAX_ENTRIES,
  createExposureLog,
  exposureReducer,
  summariseExposure,
  type ExposureAction,
  type ExposureBand,
  type ExposureLogState,
  type ExposureSetting,
} from '@/app/exposure-log';
import { eventSink } from '@/analytics/events';
import { useTransitionDrain } from '../hooks/use-transition-drain';
import { evaluateQuestAvailability } from '@/governance/learning-availability';
import {
  evidenceSpecificityReport,
  resolveEvidenceByUrl,
} from '@/governance/evidence-resolution';
import { findNode, nodesForDomain } from '@/knowledge/repository';
import { translate, type MessageKey } from '@/localization/messages';
import { Disclosures, ProvenanceStrip } from '../components/Disclosures';
import { LessonRunner } from '../components/LessonRunner';

const now = () => new Date().toISOString();
const SUN_QUESTS = ['QST-004', 'QST-005'] as const;

function ExposureLog({ locale }: { locale: string }) {
  const [state, dispatch] = useReducer(
    (current: ExposureLogState, action: ExposureAction) => exposureReducer(current, action),
    undefined,
    () => createExposureLog('local-learner'),
  );
  // The reducer is pure; this is the only place its events reach the sink.
  useTransitionDrain(state, eventSink);
  const [activity, setActivity] = useState('');
  const [band, setBand] = useState<ExposureBand>('midday');
  const [setting, setSetting] = useState<ExposureSetting>('open');
  const [minutes, setMinutes] = useState('30');
  const summary = summariseExposure(state);

  return (
    <section className="card">
      <p className="eyebrow">{translate('sun.logTitle', locale)}</p>
      <p className="muted">{translate('sun.logIntro', locale)}</p>
      <Disclosures disclosures={state.disclosures} locale={locale} />

      {state.phase === 'HALTED' ? (
        <>
          <p className="disclosure disclosure--caution">
            <span className="disclosure__mark">!</span>
            <span>{translate(state.safetyHaltMessageKey as MessageKey, locale)}</span>
          </p>
          <div className="btn--row">
            <button className="btn btn--quiet" type="button" onClick={() => dispatch({ type: 'RESET' })}>
              {translate('sun.startOver', locale)}
            </button>
          </div>
        </>
      ) : null}

      {state.phase === 'LOGGING' ? (
        <>
          <div className="btn--row" style={{ alignItems: 'flex-end' }}>
            <label style={{ flex: '2 1 200px' }}>
              <span className="dim__name">{translate('sun.activity', locale)}</span>
              <input
                className="textarea"
                style={{ minHeight: 'auto' }}
                value={activity}
                placeholder={translate('sun.activityPlaceholder', locale)}
                onChange={(event) => setActivity(event.target.value)}
              />
            </label>
            <label style={{ flex: '1 1 120px' }}>
              <span className="dim__name">{translate('sun.band', locale)}</span>
              <select
                className="textarea"
                style={{ minHeight: 'auto' }}
                value={band}
                onChange={(event) => setBand(event.target.value as ExposureBand)}
              >
                {EXPOSURE_BANDS.map((value) => (
                  <option key={value} value={value}>
                    {translate(`sun.band.${value}` as MessageKey, locale)}
                  </option>
                ))}
              </select>
            </label>
            <label style={{ flex: '1 1 140px' }}>
              <span className="dim__name">{translate('sun.setting', locale)}</span>
              <select
                className="textarea"
                style={{ minHeight: 'auto' }}
                value={setting}
                onChange={(event) => setSetting(event.target.value as ExposureSetting)}
              >
                {EXPOSURE_SETTINGS.map((value) => (
                  <option key={value} value={value}>
                    {translate(`sun.setting.${value}` as MessageKey, locale)}
                  </option>
                ))}
              </select>
            </label>
            <label style={{ flex: '0 1 90px' }}>
              <span className="dim__name">{translate('sun.minutes', locale)}</span>
              <input
                className="textarea"
                style={{ minHeight: 'auto' }}
                type="number"
                min="1"
                max="720"
                value={minutes}
                onChange={(event) => setMinutes(event.target.value)}
              />
            </label>
            <button
              className="btn"
              type="button"
              disabled={activity.trim() === '' || state.entries.length >= MAX_ENTRIES}
              onClick={() => {
                dispatch({
                  type: 'ADD_ENTRY',
                  activity,
                  band,
                  setting,
                  minutes: Number(minutes),
                });
                setActivity('');
              }}
            >
              {translate('sun.addEntry', locale)}
            </button>
          </div>

          {state.entries.length === 0 ? (
            <p className="muted">{translate('sun.noEntries', locale)}</p>
          ) : (
            <table className="table">
              <tbody>
                {state.entries.map((entry) => (
                  <tr key={entry.entryId}>
                    <td>{entry.activity}</td>
                    <td className="muted">{translate(`sun.band.${entry.band}` as MessageKey, locale)}</td>
                    <td className="muted">
                      {translate(`sun.setting.${entry.setting}` as MessageKey, locale)}
                    </td>
                    <td>{entry.minutes}</td>
                    <td>
                      <button
                        className="btn btn--quiet"
                        type="button"
                        style={{ padding: '0.1rem 0.6rem' }}
                        onClick={() => dispatch({ type: 'REMOVE_ENTRY', entryId: entry.entryId })}
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="btn--row">
            <button
              className="btn"
              type="button"
              disabled={state.entries.length === 0}
              onClick={() => dispatch({ type: 'REVIEW', at: now() })}
            >
              {translate('sun.review', locale)}
            </button>
          </div>
        </>
      ) : null}

      {state.phase === 'REVIEW' ? (
        <>
          <p className="lead">
            {translate('sun.summaryTotal', locale, {
              entries: String(summary.entries),
              minutes: String(summary.totalMinutes),
            })}
          </p>
          <div className="dims">
            {EXPOSURE_SETTINGS.map((value) => (
              <div key={value} className="dim">
                <p className="dim__name">{translate(`sun.setting.${value}` as MessageKey, locale)}</p>
                <p className="dim__value">{summary.minutesBySetting[value]} min</p>
              </div>
            ))}
          </div>
          <div className="dims" style={{ marginTop: '0.6rem' }}>
            {EXPOSURE_BANDS.map((value) => (
              <div key={value} className="dim">
                <p className="dim__name">{translate(`sun.band.${value}` as MessageKey, locale)}</p>
                <p className="dim__value">
                  {summary.minutesByBand[value] === 0
                    ? translate('sun.notRecorded', locale)
                    : `${summary.minutesByBand[value]} min`}
                </p>
              </div>
            ))}
          </div>
          <p className="muted" style={{ marginTop: '0.8rem' }}>
            {translate('sun.summaryNote', locale)}
          </p>
          <div className="btn--row">
            <button className="btn btn--quiet" type="button" onClick={() => dispatch({ type: 'RESET' })}>
              {translate('sun.startOver', locale)}
            </button>
          </div>
        </>
      ) : null}
    </section>
  );
}

function EvidencePanel({ locale }: { locale: string }) {
  const specificity = evidenceSpecificityReport().find((item) => item.domainId === 'D04');
  const resolution = resolveEvidenceByUrl();
  const d04Mapping = resolution.mappings.find((mapping) => mapping.domains.includes('D04'));

  return (
    <section className="card">
      <p className="eyebrow">{translate('sun.evidenceTitle', locale)}</p>
      <p className="disclosure disclosure--caution">
        <span className="disclosure__mark">!</span>
        <span>
          OQ-E02 — all {specificity?.nodeCount ?? 0} D04 nodes cite a single general source, and
          14_EVIDENCE registers no source about sun, UV or SPF at all. Nothing in this world may
          state what protection to use.
        </span>
      </p>
      <table className="table">
        <tbody>
          <tr>
            <td>Nodes in D04</td>
            <td>{specificity?.nodeCount ?? 0}</td>
          </tr>
          <tr>
            <td>Nodes carrying a citation</td>
            <td>{specificity?.nodesWithCitation ?? 0}</td>
          </tr>
          <tr>
            <td>Distinct sources cited</td>
            <td>{specificity?.distinctSources.join(', ') || '—'}</td>
          </tr>
          <tr>
            <td>What that source actually is</td>
            <td className="muted">
              {d04Mapping
                ? `${d04Mapping.registeredSourceId} · ${d04Mapping.registeredTitle}`
                : '—'}
            </td>
          </tr>
          <tr>
            <td>Constitution labels with no registry record</td>
            <td className="muted">
              {resolution.constitutionLabelsWithNoRecord.join('; ') || 'none'}
            </td>
          </tr>
        </tbody>
      </table>
      <ProvenanceStrip
        entries={[
          { label: translate('common.source', locale), value: '03_KNOWLEDGE_NODES · 14_EVIDENCE' },
          { label: 'Domain', value: 'D04 Sun & Environmental Protection' },
          { label: 'Register', value: 'OQ-E02 · OQ-E03' },
        ]}
      />
    </section>
  );
}

function QuestPanel({ locale }: { locale: string }) {
  return (
    <section className="card">
      <p className="eyebrow">{translate('sun.questTitle', locale)}</p>
      {SUN_QUESTS.map((questId) => {
        const quest = evaluateQuestAvailability(questId, 'SCIENTIFIC');
        return (
          <div key={questId} className="card card--sunk" style={{ marginTop: '0.8rem' }}>
            <div className="masthead__row">
              <h3 style={{ margin: 0 }}>
                {quest.questId} · {quest.questName}
              </h3>
              <span className="tag tag--blocker">
                {translate('ingredient.closedLesson', locale)}
              </span>
            </div>
            <p className="muted" style={{ marginTop: '0.35rem' }}>
              <span className="provenance__key">{translate('ingredient.winCondition', locale)}</span>{' '}
              {quest.winCondition} ·{' '}
              <span className="provenance__key">{translate('ingredient.coreNode', locale)}</span>{' '}
              {quest.coreNodeId} {findNode(quest.coreNodeId ?? '')?.Node_Title ?? ''}
            </p>
            <table className="table">
              <tbody>
                {quest.blockers.map((blocker) => (
                  <tr key={`${blocker.recordId}-${blocker.reason}`}>
                    <td>{blocker.recordId}</td>
                    <td>
                      <span className="tag">{blocker.reason}</span>
                    </td>
                    <td className="muted">{blocker.detail}</td>
                    <td className="muted">{blocker.registerId ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </section>
  );
}

export function SunProtectionScreen({ locale }: { locale: string }) {
  const [inLesson, setInLesson] = useState(false);
  const grounding = loadSliceGrounding(SUN_EXPOSURE_PLAN);
  const node = findNode(SUN_EXPOSURE_PLAN.nodeId);

  if (inLesson) {
    return (
      <div className="stack">
        <button className="btn btn--quiet" type="button" onClick={() => setInLesson(false)}>
          ← {translate('sun.backToObservatory', locale)}
        </button>
        <LessonRunner plan={SUN_EXPOSURE_PLAN} locale={locale} />
      </div>
    );
  }

  return (
    <div className="stack">
      <section className="card">
        <p className="eyebrow">{translate('nav.sunProtection', locale)}</p>
        <h1>{translate('sun.lessonTitle', locale)}</h1>
        <p className="muted">{translate('sun.lessonIntro', locale)}</p>

        <div className="card card--sunk" style={{ marginTop: '0.9rem' }}>
          <div className="masthead__row">
            <h3 style={{ margin: 0 }}>{node?.Node_Title ?? SUN_EXPOSURE_PLAN.nodeId}</h3>
            <span className={`tag tag--${grounding.availability.available ? 'open' : 'blocker'}`}>
              {grounding.availability.available
                ? translate('ingredient.openLesson', locale)
                : translate('ingredient.closedLesson', locale)}
            </span>
          </div>
          <p className="muted" style={{ marginTop: '0.35rem' }}>
            {grounding.availability.summary}
          </p>
          <ProvenanceStrip
            entries={[
              { label: translate('common.node', locale), value: SUN_EXPOSURE_PLAN.nodeId },
              {
                label: 'Strand',
                value: `${grounding.domainId} ${grounding.strandCode} ${grounding.strandName}`,
              },
              {
                label: translate('common.skill', locale),
                value: `${SUN_EXPOSURE_PLAN.skillId} ${grounding.skillName}`,
              },
              { label: 'Claim class', value: SUN_EXPOSURE_PLAN.claimClass },
              { label: translate('common.evidence', locale), value: grounding.nodeEvidenceStatus },
            ]}
          />
          <div className="btn--row">
            <button
              className="btn"
              type="button"
              disabled={!grounding.availability.available}
              onClick={() => setInLesson(true)}
            >
              {translate('sun.startLesson', locale)}
            </button>
          </div>
        </div>
      </section>

      <ExposureLog locale={locale} />
      <EvidencePanel locale={locale} />
      <QuestPanel locale={locale} />

      <section className="card card--sunk">
        <p className="eyebrow">D04 knowledge nodes</p>
        <table className="table">
          <thead>
            <tr>
              <th>Node</th>
              <th>Strand</th>
              <th>Title</th>
              <th>Evidence</th>
            </tr>
          </thead>
          <tbody>
            {nodesForDomain('D04').map((item) => (
              <tr key={item.Node_ID}>
                <td>{item.Node_ID}</td>
                <td className="muted">
                  {item.Strand_Code} {item.Strand_Name}
                </td>
                <td>{item.Node_Title}</td>
                <td className="muted">
                  <span className="tag">{item.Status}</span> {item.Evidence_Status} ·{' '}
                  {item.Source_ID}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
