/**
 * Routine Studio.
 *
 * Grounded in Domain D08 (Routine & Layering), 09_ROUTINES (10 records),
 * 10_NODE_ROUTINE_MAP (16 links) and quest QST-007 "Routine Rescue".
 *
 * The world ships three things, none of which tell anyone what their routine should be:
 *   1. the governed routine patterns, shown as records with their status and gaps — including
 *      the broken reference in RUT-001 (SR-007) and prose sequences left unsplit (OQ-R01);
 *   2. QST-007, wired to its real node map and reported as unauthorable (OQ-R02);
 *   3. a reflection studio and one reasoning lesson, which are what the product can honestly
 *      offer while every routine record is Approved-but-unevidenced.
 */
import { useReducer, useState } from 'react';
import { ROUTINE_PURPOSE_PLAN, loadSliceGrounding } from '@/app/learning-session';
import {
  MAX_STEPS,
  createReflection,
  reflectionReducer,
  summariseReflection,
  type ReflectionAction,
  type ReflectionState,
} from '@/app/routine-reflection';
import { eventSink } from '@/analytics/events';
import { useTransitionDrain } from '../hooks/use-transition-drain';
import { evaluateQuestAvailability } from '@/governance/learning-availability';
import { findQuestNumericMismatches } from '@/governance/integrity';
import { routineCorpusReport, routineViews } from '@/knowledge/routines';
import { findNode } from '@/knowledge/repository';
import { translate } from '@/localization/messages';
import { Disclosures, ProvenanceStrip } from '../components/Disclosures';
import { LessonRunner } from '../components/LessonRunner';

const now = () => new Date().toISOString();

function ReflectionStudio({ locale }: { locale: string }) {
  const [state, dispatch] = useReducer(
    (current: ReflectionState, action: ReflectionAction) => reflectionReducer(current, action),
    undefined,
    () => createReflection('local-learner'),
  );
  // The reducer is pure; this is the only place its events reach the sink.
  useTransitionDrain(state, eventSink);
  const [draft, setDraft] = useState('');
  const summary = summariseReflection(state);

  return (
    <section className="card">
      <p className="eyebrow">{translate('routine.studioTitle', locale)}</p>
      <p className="muted">{translate('routine.studioIntro', locale)}</p>
      <Disclosures disclosures={state.disclosures} locale={locale} />

      {state.phase === 'HALTED' ? (
        <>
          <p className="disclosure disclosure--caution">
            <span className="disclosure__mark">!</span>
            <span>{translate(state.safetyHaltMessageKey as never, locale)}</span>
          </p>
          <div className="btn--row">
            <button className="btn btn--quiet" type="button" onClick={() => dispatch({ type: 'RESET' })}>
              {translate('routine.startOver', locale)}
            </button>
          </div>
        </>
      ) : null}

      {state.phase === 'LISTING' ? (
        <>
          <div className="btn--row" style={{ marginTop: '0.5rem' }}>
            <input
              className="textarea"
              style={{ minHeight: 'auto', flex: '1 1 260px' }}
              value={draft}
              placeholder={translate('routine.stepPlaceholder', locale)}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && draft.trim() !== '') {
                  dispatch({ type: 'ADD_STEP', label: draft });
                  setDraft('');
                }
              }}
            />
            <button
              className="btn"
              type="button"
              disabled={draft.trim() === '' || state.entries.length >= MAX_STEPS}
              onClick={() => {
                dispatch({ type: 'ADD_STEP', label: draft });
                setDraft('');
              }}
            >
              {translate('routine.addStep', locale)}
            </button>
          </div>

          {state.entries.length === 0 ? (
            <p className="muted">{translate('routine.noSteps', locale)}</p>
          ) : (
            <ol className="stack" style={{ paddingLeft: '1.1rem' }}>
              {state.entries.map((entry) => (
                <li key={entry.entryId}>
                  {entry.label}{' '}
                  <button
                    className="btn btn--quiet"
                    type="button"
                    style={{ padding: '0.1rem 0.6rem', fontSize: '0.72rem' }}
                    onClick={() => dispatch({ type: 'REMOVE_STEP', entryId: entry.entryId })}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ol>
          )}

          <div className="btn--row">
            <button
              className="btn"
              type="button"
              disabled={state.entries.length === 0}
              onClick={() => dispatch({ type: 'GO_TO_PURPOSE' })}
            >
              {translate('routine.toPurpose', locale)}
            </button>
          </div>
        </>
      ) : null}

      {state.phase === 'PURPOSE' ? (
        <>
          {state.entries.map((entry) => (
            <div key={entry.entryId} style={{ marginBottom: '0.7rem' }}>
              <h3>{entry.label}</h3>
              <textarea
                className="textarea"
                style={{ minHeight: '56px' }}
                value={entry.purpose ?? ''}
                placeholder={translate('routine.purposePlaceholder', locale)}
                onChange={(event) =>
                  dispatch({ type: 'SET_PURPOSE', entryId: entry.entryId, purpose: event.target.value })
                }
              />
            </div>
          ))}
          <div className="btn--row">
            <button
              className="btn"
              type="button"
              onClick={() => dispatch({ type: 'COMPLETE_REVIEW', at: now() })}
            >
              {translate('routine.finishReview', locale)}
            </button>
          </div>
        </>
      ) : null}

      {state.phase === 'REVIEW' ? (
        <>
          <h3>{translate('routine.reviewHeading', locale)}</h3>
          <p className="lead">
            {translate('routine.reviewSummary', locale, {
              withPurpose: String(summary.withPurpose),
              total: String(summary.total),
            })}
          </p>
          <p className="muted">{translate('routine.reviewNote', locale)}</p>
          <table className="table">
            <thead>
              <tr>
                <th>{translate('routine.stepLabel', locale)}</th>
                <th>{translate('routine.purposeLabel', locale)}</th>
              </tr>
            </thead>
            <tbody>
              {state.entries.map((entry) => (
                <tr key={entry.entryId}>
                  <td>{entry.label}</td>
                  <td className="muted">
                    {entry.purpose && entry.purpose.trim() !== '' ? (
                      entry.purpose
                    ) : (
                      <span className="tag">{translate('routine.notStated', locale)}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="btn--row">
            <button className="btn btn--quiet" type="button" onClick={() => dispatch({ type: 'RESET' })}>
              {translate('routine.startOver', locale)}
            </button>
          </div>
        </>
      ) : null}
    </section>
  );
}

function QuestPanel({ locale }: { locale: string }) {
  const quest = evaluateQuestAvailability('QST-007', 'SCIENTIFIC');
  const mismatch = findQuestNumericMismatches().find((item) => item.questId === 'QST-007');

  return (
    <section className="card">
      <p className="eyebrow">{translate('routine.questTitle', locale)}</p>
      <div className="masthead__row">
        <h3 style={{ margin: 0 }}>
          {quest.questId} · {quest.questName}
        </h3>
        <span className="tag tag--blocker">{translate('ingredient.closedLesson', locale)}</span>
      </div>
      <p className="muted" style={{ marginTop: '0.35rem' }}>
        <span className="provenance__key">{translate('ingredient.winCondition', locale)}</span>{' '}
        {quest.winCondition} ·{' '}
        <span className="provenance__key">{translate('ingredient.coreNode', locale)}</span>{' '}
        {quest.coreNodeId}
      </p>

      {mismatch ? (
        <p className="disclosure disclosure--caution">
          <span className="disclosure__mark">!</span>
          <span>
            OQ-R02 — the quest asks for {mismatch.winConditionNumbers.join('/')} step(s) while its
            core node {mismatch.coreNodeId} “{mismatch.coreNodeTitle}” teaches{' '}
            {mismatch.coreNodeNumbers.join('/')}. The target number is not settled, so the quest
            cannot be authored.
          </span>
        </p>
      ) : null}

      <h3 style={{ marginTop: '0.8rem' }}>{translate('ingredient.blockedBy', locale)}</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Record</th>
            <th>Reason</th>
            <th>Detail</th>
            <th>Register</th>
          </tr>
        </thead>
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
    </section>
  );
}

function RoutineCatalog({ locale }: { locale: string }) {
  const views = routineViews();
  const report = routineCorpusReport();

  return (
    <section className="card">
      <p className="eyebrow">{translate('routine.catalogTitle', locale)}</p>
      <p className="muted">{translate('routine.catalogIntro', locale)}</p>
      <Disclosures
        disclosures={[
          { code: 'PENDING_VERIFICATION', severity: 'caution', messageKey: 'disclosure.pendingVerification' },
          { code: 'NOT_MEDICAL_ADVICE', severity: 'info', messageKey: 'disclosure.notMedicalAdvice' },
        ]}
        locale={locale}
      />
      <p className="muted">
        {report.total} records · {report.approved} marked Approved · {report.mayStateAsFact} may be
        stated as fact · {report.sequenced} ordered sequences, {report.prose} recorded as prose ·{' '}
        {report.withBrokenReferences} with a broken node reference · evidence column present:{' '}
        {report.hasEvidenceLinkageColumn ? 'yes' : 'no'}
      </p>

      {views.map((view) => (
        <div key={view.routine.Routine_ID} className="card card--sunk" style={{ marginTop: '0.8rem' }}>
          <div className="masthead__row">
            <h3 style={{ margin: 0 }}>
              {view.routine.Routine_ID} · {view.routine.Routine_Name}
            </h3>
            <span className={`tag${view.referencesComplete ? '' : ' tag--blocker'}`}>
              {view.routine.Status}
              {view.referencesComplete ? '' : ' · SR-007'}
            </span>
          </div>
          <p className="muted" style={{ marginTop: '0.3rem' }}>
            {view.routine.Description}
          </p>

          <h3 style={{ marginTop: '0.6rem' }}>{translate('routine.sequence', locale)}</h3>
          {view.isSequenced ? (
            <ol style={{ margin: '0.2rem 0 0', paddingLeft: '1.2rem' }}>
              {view.steps.map((step) => (
                <li key={step.index}>{step.label}</li>
              ))}
            </ol>
          ) : (
            <>
              <p style={{ margin: '0.2rem 0 0' }}>{view.routine.Default_Sequence}</p>
              <p className="muted" style={{ fontSize: '0.75rem' }}>
                {translate('routine.proseSequence', locale)}
              </p>
            </>
          )}

          <h3 style={{ marginTop: '0.7rem' }}>{translate('routine.linkedNodes', locale)}</h3>
          <table className="table">
            <tbody>
              {view.links.map((link) => (
                <tr key={link.nodeId}>
                  <td>{link.nodeId}</td>
                  <td>
                    <span className="tag">{link.relationship}</span>
                  </td>
                  <td className="muted">
                    {link.exists ? (
                      link.nodeTitle
                    ) : (
                      <span className="tag tag--blocker">
                        {translate('routine.missingNode', locale)}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="muted" style={{ fontSize: '0.72rem', marginTop: '0.4rem' }}>
            {view.publicationReason}
          </p>
        </div>
      ))}

      <ProvenanceStrip
        entries={[
          { label: translate('common.source', locale), value: '09_ROUTINES · 10_NODE_ROUTINE_MAP' },
          { label: 'Domain', value: 'D08 Routine & Layering' },
          { label: 'Register', value: 'SR-007 · OQ-R01' },
        ]}
      />
    </section>
  );
}

export function RoutineStudioScreen({ locale }: { locale: string }) {
  const [inLesson, setInLesson] = useState(false);
  const grounding = loadSliceGrounding(ROUTINE_PURPOSE_PLAN);
  const node = findNode(ROUTINE_PURPOSE_PLAN.nodeId);

  if (inLesson) {
    return (
      <div className="stack">
        <button className="btn btn--quiet" type="button" onClick={() => setInLesson(false)}>
          ← {translate('routine.backToStudio', locale)}
        </button>
        <LessonRunner plan={ROUTINE_PURPOSE_PLAN} locale={locale} />
      </div>
    );
  }

  return (
    <div className="stack">
      <section className="card">
        <p className="eyebrow">{translate('nav.routineStudio', locale)}</p>
        <h1>{translate('routine.lessonTitle', locale)}</h1>
        <p className="muted">{translate('routine.lessonIntro', locale)}</p>

        <div className="card card--sunk" style={{ marginTop: '0.9rem' }}>
          <div className="masthead__row">
            <h3 style={{ margin: 0 }}>{node?.Node_Title ?? ROUTINE_PURPOSE_PLAN.nodeId}</h3>
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
              { label: translate('common.node', locale), value: ROUTINE_PURPOSE_PLAN.nodeId },
              {
                label: 'Strand',
                value: `${grounding.domainId} ${grounding.strandCode} ${grounding.strandName}`,
              },
              {
                label: translate('common.skill', locale),
                value: `${ROUTINE_PURPOSE_PLAN.skillId} ${grounding.skillName}`,
              },
              { label: 'Claim class', value: ROUTINE_PURPOSE_PLAN.claimClass },
              { label: translate('common.status', locale), value: grounding.nodeStatus },
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
              {translate('routine.startLesson', locale)}
            </button>
          </div>
        </div>
      </section>

      <ReflectionStudio locale={locale} />
      <QuestPanel locale={locale} />
      <RoutineCatalog locale={locale} />
    </div>
  );
}
