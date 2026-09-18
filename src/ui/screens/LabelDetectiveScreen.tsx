/**
 * Label Detective.
 *
 * Grounded in QST-013 "Label Detective", core node KN-D11-07-001, skill SK06 Evaluate Claims.
 *
 * This is the one world whose quest can actually run: its win condition is separating the parts
 * of a label, which is text categorisation, and none of its three mapped nodes is missing. So
 * instead of a closed-quest panel, it ships the exercise itself.
 *
 * The interaction follows the pattern the product owner asked for after reviewing a language
 * tutor: the learner places everything first, nothing is marked until they ask, and a wrong
 * placement is answered with one warm sentence in their own language explaining where the line
 * belongs and why — never a bare "incorrect".
 */
import { useReducer, useState } from 'react';
import { LABEL_READING_PLAN, loadSliceGrounding } from '@/app/learning-session';
import {
  LABEL_BUCKETS,
  createSorter,
  evaluateSorter,
  findSpecimen,
  labelSpecimens,
  misplacedFragments,
  sorterReducer,
  type LabelBucket,
  type SorterAction,
  type SorterState,
} from '@/app/label-sorter';
import { eventSink } from '@/analytics/events';
import { evaluateQuestAvailability } from '@/governance/learning-availability';
import { evidenceSpecificityReport, resolveEvidenceByUrl } from '@/governance/evidence-resolution';
import { findNode } from '@/knowledge/repository';
import { translate, type MessageKey } from '@/localization/messages';
import { Disclosures, ProvenanceStrip } from '../components/Disclosures';
import { LessonRunner } from '../components/LessonRunner';

const now = () => new Date().toISOString();
const SPECIMEN_ID = 'SPECIMEN-001';

const localised = (record: Readonly<Record<string, string>>, locale: string): string =>
  record[locale] ?? record['en'] ?? '';

function LabelSorter({ locale }: { locale: string }) {
  const [state, dispatch] = useReducer(
    (current: SorterState, action: SorterAction) => sorterReducer(current, action, eventSink),
    undefined,
    () => createSorter('local-learner', SPECIMEN_ID),
  );
  const [selected, setSelected] = useState<string | null>(null);
  const specimen = findSpecimen(state.specimenId)!;
  const result = evaluateSorter(state);
  const wrong = misplacedFragments(state);
  const unplaced = specimen.fragments.filter(
    (fragment) => state.placements[fragment.fragmentId] === undefined,
  );

  const place = (bucket: LabelBucket) => {
    if (!selected) return;
    dispatch({ type: 'PLACE', fragmentId: selected, bucket });
    setSelected(null);
  };

  return (
    <section className="card">
      <p className="eyebrow">{translate('label.sorterTitle', locale)}</p>
      <p className="lead">{localised(specimen.context, locale)}</p>
      <p className="muted">{translate('label.sorterIntro', locale)}</p>
      <Disclosures disclosures={state.disclosures} locale={locale} />
      <p className="disclosure disclosure--info">
        <span className="disclosure__mark">i</span>
        <span>
          {translate('label.specimenWarning', locale)} {localised(specimen.fictionNote, locale)}
        </span>
      </p>
      <p className="muted" style={{ fontSize: '0.78rem' }}>
        {localised(specimen.identity, locale)}
      </p>

      {state.phase !== 'COMPLETE' ? (
        <>
          <h3 style={{ marginTop: '1rem' }}>
            {translate('label.unplaced', locale)} ({unplaced.length})
          </h3>
          {unplaced.length === 0 ? (
            <p className="muted">{translate('label.allSorted', locale)}</p>
          ) : (
            unplaced.map((fragment) => (
              <button
                key={fragment.fragmentId}
                type="button"
                className="option"
                aria-pressed={selected === fragment.fragmentId}
                onClick={() =>
                  setSelected(selected === fragment.fragmentId ? null : fragment.fragmentId)
                }
              >
                {localised(fragment.text, locale)}
              </button>
            ))
          )}

          <div className="dims" style={{ marginTop: '1rem' }}>
            {LABEL_BUCKETS.map((bucket) => {
              const inBucket = specimen.fragments.filter(
                (fragment) => state.placements[fragment.fragmentId] === bucket,
              );
              return (
                <div key={bucket} className="dim">
                  <p className="dim__name">
                    {translate(`label.bucket.${bucket}` as MessageKey, locale)}
                  </p>
                  <p className="dim__value" style={{ fontSize: '0.68rem' }}>
                    {translate(`label.bucketHint.${bucket}` as MessageKey, locale)}
                  </p>
                  <button
                    className="btn btn--quiet"
                    type="button"
                    disabled={selected === null}
                    style={{ marginTop: '0.4rem', width: '100%' }}
                    onClick={() => place(bucket)}
                  >
                    +
                  </button>
                  {inBucket.map((fragment) => {
                    const isWrong =
                      state.phase === 'CHECKED' &&
                      state.incorrectFragmentIds.includes(fragment.fragmentId);
                    return (
                      <button
                        key={fragment.fragmentId}
                        type="button"
                        className="option"
                        style={{ marginTop: '0.35rem', fontSize: '0.8rem' }}
                        onClick={() =>
                          dispatch({ type: 'UNPLACE', fragmentId: fragment.fragmentId })
                        }
                      >
                        {isWrong ? <span style={{ color: '#8b3a2e' }}>✕ </span> : null}
                        {localised(fragment.text, locale)}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </>
      ) : null}

      {state.phase === 'SORTING' ? (
        <div className="btn--row">
          <button
            className="btn"
            type="button"
            disabled={!result.allPlaced}
            onClick={() => dispatch({ type: 'CHECK', at: now() })}
          >
            {translate('label.check', locale)}
          </button>
        </div>
      ) : null}

      {state.phase === 'CHECKED' ? (
        <>
          {result.allCorrect ? (
            <>
              <h3 style={{ marginTop: '1rem' }}>{translate('label.allCorrectTitle', locale)}</h3>
              <p className="muted">{translate('label.allCorrectBody', locale)}</p>
            </>
          ) : (
            <>
              <h3 style={{ marginTop: '1rem' }}>
                {translate('label.someWrongTitle', locale, {
                  correct: String(result.correct),
                  total: String(result.total),
                })}
              </h3>
              <p className="muted">{translate('label.someWrongBody', locale)}</p>
              {wrong.map((fragment) => (
                <div key={fragment.fragmentId} className="card card--sunk" style={{ marginTop: '0.6rem' }}>
                  <p style={{ margin: 0 }}>
                    <span style={{ color: '#8b3a2e', fontWeight: 700 }}>✕</span>{' '}
                    {localised(fragment.text, locale)}
                  </p>
                  <p className="muted" style={{ fontSize: '0.76rem', marginTop: '0.3rem' }}>
                    {translate('label.movedTo', locale)}{' '}
                    <strong>
                      {translate(
                        `label.bucket.${state.placements[fragment.fragmentId]}` as MessageKey,
                        locale,
                      )}
                    </strong>{' '}
                    · {translate('label.belongsIn', locale)}{' '}
                    <strong>
                      {translate(`label.bucket.${fragment.kind}` as MessageKey, locale)}
                    </strong>
                  </p>
                  <p className="disclosure disclosure--info" style={{ marginTop: '0.5rem' }}>
                    <span className="disclosure__mark">{translate('label.whyLabel', locale)}</span>
                    <span>{localised(fragment.why, locale)}</span>
                  </p>
                </div>
              ))}
            </>
          )}
          <div className="btn--row">
            {result.allCorrect ? (
              <button className="btn" type="button" onClick={() => dispatch({ type: 'COMPLETE', at: now() })}>
                {translate('label.finish', locale)}
              </button>
            ) : (
              <button
                className="btn"
                type="button"
                onClick={() => dispatch({ type: 'CONTINUE_SORTING' })}
              >
                {translate('label.keepSorting', locale)}
              </button>
            )}
            <button className="btn btn--quiet" type="button" onClick={() => dispatch({ type: 'RESET' })}>
              {translate('label.startOver', locale)}
            </button>
          </div>
        </>
      ) : null}

      {state.phase === 'COMPLETE' ? (
        <>
          <h3 style={{ marginTop: '1rem' }}>{translate('label.allCorrectTitle', locale)}</h3>
          <p className="muted">{translate('label.allCorrectBody', locale)}</p>
          <table className="table">
            <tbody>
              {specimen.fragments.map((fragment) => (
                <tr key={fragment.fragmentId}>
                  <td>{localised(fragment.text, locale)}</td>
                  <td>
                    <span className="tag">
                      {translate(`label.bucket.${fragment.kind}` as MessageKey, locale)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="btn--row">
            <button className="btn btn--quiet" type="button" onClick={() => dispatch({ type: 'RESET' })}>
              {translate('label.startOver', locale)}
            </button>
          </div>
        </>
      ) : null}

      <ProvenanceStrip
        entries={[
          { label: 'Quest', value: 'QST-013 Label Detective' },
          { label: 'Specimen', value: `${specimen.specimenId} · fictional` },
          { label: 'Specimens available', value: String(labelSpecimens.length) },
        ]}
      />
    </section>
  );
}

function QuestPanel({ locale }: { locale: string }) {
  // QST-013 separates the parts of a label, which is categorisation rather than a claim.
  const asPedagogical = evaluateQuestAvailability('QST-013', 'PEDAGOGICAL');
  const asScientific = evaluateQuestAvailability('QST-013', 'SCIENTIFIC');

  return (
    <section className="card">
      <p className="eyebrow">{translate('label.questTitle', locale)}</p>
      <div className="masthead__row">
        <h3 style={{ margin: 0 }}>
          {asPedagogical.questId} · {asPedagogical.questName}
        </h3>
        <span className={`tag tag--${asPedagogical.available ? 'open' : 'blocker'}`}>
          {asPedagogical.available
            ? translate('ingredient.openLesson', locale)
            : translate('ingredient.closedLesson', locale)}
        </span>
      </div>
      <p className="muted" style={{ marginTop: '0.35rem' }}>
        <span className="provenance__key">{translate('ingredient.winCondition', locale)}</span>{' '}
        {asPedagogical.winCondition} ·{' '}
        <span className="provenance__key">{translate('ingredient.coreNode', locale)}</span>{' '}
        {asPedagogical.coreNodeId}
      </p>
      <p className="muted">{asPedagogical.summary}</p>
      <table className="table">
        <tbody>
          <tr>
            <td>Mapped nodes</td>
            <td className="muted">{asPedagogical.nodeIds.join(', ')}</td>
          </tr>
          <tr>
            <td>Missing references</td>
            <td>
              {asPedagogical.blockers.filter((b) => b.reason === 'MISSING_RECORD').length === 0
                ? 'none'
                : asPedagogical.blockers.filter((b) => b.reason === 'MISSING_RECORD').length}
            </td>
          </tr>
          <tr>
            <td>If it asserted efficacy instead</td>
            <td className="muted">
              would be blocked by {asScientific.blockers.length} record(s) — the same quest fails
              as a scientific claim
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

function EvidencePanel({ locale }: { locale: string }) {
  const d11 = evidenceSpecificityReport().find((item) => item.domainId === 'D11');
  const mapping = resolveEvidenceByUrl().mappings.find((item) => item.domains.includes('D11'));

  return (
    <section className="card">
      <p className="eyebrow">{translate('label.evidenceTitle', locale)}</p>
      <p className="muted">
        D11 is the one domain where the cited source is genuinely on topic for what the nodes
        teach — which makes it the strongest candidate for the first approved evidence seed set.
        The nodes are still Status=Draft, so nothing here is stated as verified fact.
      </p>
      <table className="table">
        <tbody>
          <tr>
            <td>Nodes in D11</td>
            <td>{d11?.nodeCount ?? 0}</td>
          </tr>
          <tr>
            <td>Cited source</td>
            <td className="muted">{d11?.distinctSources.join(', ') || '—'}</td>
          </tr>
          <tr>
            <td>What it resolves to</td>
            <td className="muted">
              {mapping ? `${mapping.registeredSourceId} · ${mapping.registeredTitle}` : '—'}
            </td>
          </tr>
        </tbody>
      </table>
      <ProvenanceStrip
        entries={[
          { label: translate('common.source', locale), value: '03_KNOWLEDGE_NODES · 14_EVIDENCE' },
          { label: 'Domain', value: 'D11 Beauty Media Literacy' },
          { label: 'Register', value: 'SR-009 · OQ-E03' },
        ]}
      />
    </section>
  );
}

export function LabelDetectiveScreen({ locale }: { locale: string }) {
  const [inLesson, setInLesson] = useState(false);
  const grounding = loadSliceGrounding(LABEL_READING_PLAN);
  const node = findNode(LABEL_READING_PLAN.nodeId);

  if (inLesson) {
    return (
      <div className="stack">
        <button className="btn btn--quiet" type="button" onClick={() => setInLesson(false)}>
          ← {translate('label.backToLibrary', locale)}
        </button>
        <LessonRunner plan={LABEL_READING_PLAN} locale={locale} />
      </div>
    );
  }

  return (
    <div className="stack">
      <section className="card">
        <p className="eyebrow">{translate('nav.labelDetective', locale)}</p>
        <h1>{translate('label.title', locale)}</h1>
        <p className="muted">{translate('label.intro', locale)}</p>

        <div className="card card--sunk" style={{ marginTop: '0.9rem' }}>
          <div className="masthead__row">
            <h3 style={{ margin: 0 }}>{node?.Node_Title ?? LABEL_READING_PLAN.nodeId}</h3>
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
              { label: translate('common.node', locale), value: LABEL_READING_PLAN.nodeId },
              {
                label: 'Strand',
                value: `${grounding.domainId} ${grounding.strandCode} ${grounding.strandName}`,
              },
              {
                label: translate('common.skill', locale),
                value: `${LABEL_READING_PLAN.skillId} ${grounding.skillName}`,
              },
              { label: 'Quest', value: grounding.questName ?? '—' },
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
              {translate('label.startLesson', locale)}
            </button>
          </div>
        </div>
      </section>

      <LabelSorter locale={locale} />
      <QuestPanel locale={locale} />
      <EvidencePanel locale={locale} />
    </div>
  );
}
