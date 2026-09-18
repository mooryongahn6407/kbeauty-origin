/**
 * AI Tutor.
 *
 * Source: AI Tutor Constitution §2 (seven-stage runtime), §10 (mode contracts),
 * §11 (structured output), §16 (evaluation suite).
 *
 * The tutor generates no prose. With no approved knowledge in the corpus a generative answer
 * could only be fluent invention, and §16's RED TEAM note is explicit that in this category
 * fluency hides hallucination. So the surface inverts the usual shape: instead of an answer,
 * it shows what was understood, which governed records were found, which parts of a response
 * can be filled honestly, what remains uncertain, and the full runtime trace.
 *
 * That is not a placeholder for a real tutor. It is the trust layer a real tutor would need to
 * sit on top of, built and testable first.
 */
import { useMemo, useState } from 'react';
import { mandatoryApprovedAIRules, respond, type TutorResponse } from '@/tutor/tutor-engine';
import { runEvaluationSuite } from '@/tutor/evaluation-suite';
import { translate, type MessageKey } from '@/localization/messages';
import { Disclosures, ProvenanceStrip } from '../components/Disclosures';

/** Prompts that exercise different branches of the router, drawn from Constitution §16 and C. */
const SUGGESTIONS: readonly string[] = [
  '피부 장벽이 뭔가요?',
  'Niacinamide가 모든 피부 문제를 치료해?',
  'XYZ 슈퍼글로우 크림 어때요?',
  '그냥 제일 좋은 거 하나 추천해줘',
  '자외선 차단은 어떻게 해요?',
];

function ResponsePanel({ response, locale }: { response: TutorResponse; locale: string }) {
  return (
    <>
      <section className="card">
        <p className="eyebrow">{translate('tutor.understood', locale)}</p>
        <div className="dims">
          {[
            ['tutor.intent', response.intent],
            ['tutor.mode', response.mode],
            ['tutor.risk', response.risk],
            ['tutor.hintLevel', response.hint_level ?? '—'],
          ].map(([key, value]) => (
            <div key={String(key)} className="dim">
              <p className="dim__name">{translate(key as MessageKey, locale)}</p>
              <p className="dim__value">
                <strong>{String(value)}</strong>
              </p>
            </div>
          ))}
        </div>
        <Disclosures disclosures={response.disclosures} locale={locale} />
        {response.messageKey ? (
          <p className="disclosure disclosure--caution">
            <span className="disclosure__mark">!</span>
            <span>{translate(response.messageKey as MessageKey, locale)}</span>
          </p>
        ) : null}
      </section>

      <section className="card">
        <p className="eyebrow">{translate('tutor.grounding', locale)}</p>
        <p className="muted">
          {translate('tutor.groundingCount', locale, {
            searched: String(response.grounding.recordsSearched),
            found: String(response.grounding.candidates.length),
          })}
        </p>
        {response.grounding.empty ? (
          <p className="disclosure disclosure--caution">
            <span className="disclosure__mark">!</span>
            <span>{translate('tutor.groundingEmpty', locale)}</span>
          </p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Record</th>
                <th>Title</th>
                <th>{translate('tutor.matched', locale)}</th>
                <th>{translate('common.status', locale)}</th>
                <th>{translate('common.evidence', locale)}</th>
              </tr>
            </thead>
            <tbody>
              {response.grounding.candidates.map((candidate) => (
                <tr key={`${candidate.kind}-${candidate.id}`}>
                  <td>
                    <span className="tag">{candidate.kind}</span>
                    <br />
                    {candidate.id}
                  </td>
                  <td>
                    {candidate.title}
                    <br />
                    <span className="muted">{candidate.context}</span>
                  </td>
                  <td className="muted">{candidate.matchedTerms.join(', ')}</td>
                  <td className="muted">{candidate.publication.mode}</td>
                  <td className="muted">
                    {candidate.citedSourceId ?? '—'}
                    {candidate.citedSourceId && !candidate.citedSourceResolves ? (
                      <>
                        <br />
                        <span className="tag tag--blocker">unresolved</span>
                      </>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="card">
        <p className="eyebrow">{translate('tutor.canSay', locale)}</p>
        <p className="muted">
          {translate('tutor.contractNote', locale, {
            mode: response.contract.mode,
            total: String(response.contract.totalCount),
            filled: String(response.contract.filledCount),
          })}
        </p>
        <table className="table">
          <tbody>
            {response.contract.slots.map((slot) => (
              <tr key={slot.slot}>
                <td>{slot.slot}</td>
                <td>
                  <span className={`tag${slot.filled ? '' : ' tag--blocker'}`}>
                    {slot.filled ? 'ok' : translate('tutor.slotBlocked', locale)}
                  </span>
                </td>
                <td className="muted">{slot.blockedReason ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {response.uncertainty.length > 0 ? (
        <section className="card">
          <p className="eyebrow">{translate('tutor.uncertainty', locale)}</p>
          {response.uncertainty.map((line) => (
            <p key={line} className="disclosure disclosure--caution">
              <span className="disclosure__mark">?</span>
              <span>{line}</span>
            </p>
          ))}
        </section>
      ) : null}

      <section className="card">
        <p className="eyebrow">{translate('tutor.commerce', locale)}</p>
        <p className="muted">
          {response.commerce.eligible
            ? 'Eligible.'
            : translate('tutor.commerceBlocked', locale, {
                gates: response.commerce.failedGates.join(', ') || '—',
              })}
        </p>
      </section>

      <section className="card card--sunk">
        <p className="eyebrow">{translate('tutor.trace', locale)}</p>
        <p className="muted">{translate('tutor.traceNote', locale)}</p>
        <ol className="fine" style={{ paddingLeft: '1.1rem' }}>
          {response.trace.map((line) => (
            <li key={line} className="muted" style={{ fontFamily: 'ui-monospace, monospace' }}>
              {line}
            </li>
          ))}
        </ol>
        <ProvenanceStrip
          entries={[
            { label: translate('common.node', locale), value: response.node_ids.join(', ') || '—' },
            { label: translate('common.skill', locale), value: response.skill_ids.join(', ') || '—' },
            {
              label: translate('common.evidence', locale),
              value: response.evidence_ids.join(', ') || '—',
            },
            { label: 'Mastery event', value: response.mastery_event.status },
          ]}
        />
      </section>
    </>
  );
}

function EvaluationPanel({ locale }: { locale: string }) {
  const report = useMemo(() => runEvaluationSuite(), []);

  return (
    <section className="card">
      <p className="eyebrow">{translate('tutor.evalTitle', locale)}</p>
      <p className="muted">{translate('tutor.evalNote', locale)}</p>
      <p className="lead">
        {translate('tutor.evalPassed', locale, {
          passed: String(report.passedCount),
          total: String(report.totalCount),
        })}
      </p>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Scenario</th>
            <th>Pass criteria</th>
            <th>Routed as</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {report.cases.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.scenario}</td>
              <td className="muted">{item.passCriteria}</td>
              <td className="muted">
                {item.response.mode} · {item.response.risk} · {item.response.intent}
              </td>
              <td>
                <span className={`tag${item.passed ? '' : ' tag--blocker'}`}>
                  {item.passed ? 'pass' : 'FAIL'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export function AITutorScreen({ locale }: { locale: string }) {
  const [draft, setDraft] = useState('');
  const [asked, setAsked] = useState<string | null>(null);
  const response = useMemo(
    () =>
      asked === null
        ? null
        : respond({
            userMessage: asked,
            nodeId: null,
            skillId: null,
            locale,
            hintsUsed: 0,
            failedAttempts: 0,
            // The learner has not asked for a product unless the question says so.
            userRequestedProductHelp: /추천|사야|골라|recommend|which should i/i.test(asked),
          }),
    [asked, locale],
  );

  const ask = (question: string) => {
    if (question.trim() === '') return;
    setAsked(question.trim());
    setDraft('');
  };

  return (
    <div className="stack">
      <section className="card">
        <p className="eyebrow">{translate('nav.aiTutor', locale)}</p>
        <h1>{translate('tutor.title', locale)}</h1>
        <p className="muted">{translate('tutor.intro', locale)}</p>

        <div className="btn--row" style={{ marginTop: '0.8rem' }}>
          <input
            className="textarea"
            style={{ minHeight: 'auto', flex: '1 1 280px' }}
            value={draft}
            placeholder={translate('tutor.placeholder', locale)}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') ask(draft);
            }}
          />
          <button className="btn" type="button" disabled={draft.trim() === ''} onClick={() => ask(draft)}>
            {translate('tutor.ask', locale)}
          </button>
        </div>

        <h3 style={{ marginTop: '0.9rem' }}>{translate('tutor.tryThese', locale)}</h3>
        <div className="btn--row">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className="btn btn--quiet btn--small"
              onClick={() => ask(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>

        {asked ? (
          <p className="lead" style={{ marginTop: '1rem' }}>
            “{asked}”
          </p>
        ) : null}
      </section>

      {response ? <ResponsePanel response={response} locale={locale} /> : null}

      <section className="card">
        <p className="eyebrow">{translate('tutor.rulesTitle', locale)}</p>
        <p className="muted">{translate('tutor.rulesNote', locale)}</p>
        <table className="table">
          <tbody>
            {mandatoryApprovedAIRules.map((rule) => (
              <tr key={rule.Rule_ID}>
                <td>{rule.Rule_ID}</td>
                <td>{rule.Rule_Name}</td>
                <td className="muted">{rule.Policy}</td>
                <td>
                  <span className="tag">
                    {rule.Status} · {rule.Priority}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <EvaluationPanel locale={locale} />
    </div>
  );
}
