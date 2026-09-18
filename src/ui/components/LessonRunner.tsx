/**
 * Lesson runner — the shared UI for any lesson plan.
 *
 * Renders the reducer in src/app/learning-session.ts. It owns no learning logic: it dispatches
 * actions and displays whatever state, disclosures and grounding come back. Both My Skin and
 * Ingredient Garden mount this same component with a different plan, which is what proves the
 * learning engine generalises beyond the first slice.
 *
 * Flow: micro lesson -> question -> think -> hint ladder -> answer -> feedback
 *       -> reflection -> mastery evidence.
 */
import { useEffect, useMemo, useReducer, useState } from 'react';
import type { LessonPhase } from '@/domain/learning';
import { eventSink } from '@/analytics/events';
import { useTransitionDrain } from '../hooks/use-transition-drain';
import { resolveVariant } from '@/content/authored-content';
import {
  createSession,
  currentActivityText,
  loadSliceGrounding,
  sessionReducer,
  sliceActivities,
  sliceAtoms,
  type LessonPlan,
  type SessionAction,
  type SessionState,
} from '@/app/learning-session';
import { masteryLedger } from '@/mastery/mastery-ledger';
import { translate, type MessageKey } from '@/localization/messages';
import { SafetyNotice } from './SafetyNotice';
import { Disclosures, ProvenanceStrip } from '../components/Disclosures';
import { ReadAloud } from '../components/ReadAloud';
import { MasteryPanel } from '../components/MasteryPanel';

const PHASE_ORDER: readonly LessonPhase[] = [
  'LESSON',
  'ASK',
  'THINK',
  'HINT',
  'TRY',
  'FEEDBACK',
  'REFLECT',
  'MASTER',
  'COMPLETE',
];

const PHASE_LABEL: Readonly<Record<LessonPhase, Parameters<typeof translate>[0]>> = {
  LESSON: 'lesson.phase.lesson',
  ASK: 'lesson.phase.ask',
  THINK: 'lesson.phase.think',
  HINT: 'lesson.phase.hint',
  TRY: 'lesson.phase.try',
  FEEDBACK: 'lesson.phase.feedback',
  REFLECT: 'lesson.phase.reflect',
  MASTER: 'lesson.phase.master',
  COMPLETE: 'lesson.phase.complete',
};

const now = () => new Date().toISOString();

function PhaseRail({ phase, locale }: { phase: LessonPhase; locale: string }) {
  const currentIndex = PHASE_ORDER.indexOf(phase);
  return (
    <nav className="phase-rail" aria-label="Lesson progress">
      {PHASE_ORDER.map((step, index) => {
        const modifier =
          index === currentIndex ? 'current' : index < currentIndex ? 'done' : 'todo';
        return (
          <span key={step} className={`phase-rail__step phase-rail__step--${modifier}`}>
            {translate(PHASE_LABEL[step], locale)}
            {index < PHASE_ORDER.length - 1 ? ' ·' : ''}
          </span>
        );
      })}
    </nav>
  );
}

export function LessonRunner({ plan, locale }: { plan: LessonPlan; locale: string }) {
  const grounding = useMemo(() => loadSliceGrounding(plan), [plan]);
  const [state, rawDispatch] = useReducer(
    (current: SessionState, action: SessionAction) => sessionReducer(current, action),
    undefined,
    () => createSession('local-learner', locale, now(), plan),
  );
  // The reducer is pure; this is the only place its events reach the sink and its attempts
  // reach the cross-lesson mastery ledger.
  useTransitionDrain(state, eventSink, (current) => {
    if (current.recordedAttempt) masteryLedger.record(current.recordedAttempt);
  });
  const [reflectionDraft, setReflectionDraft] = useState('');

  // The session carries its own locale; switching language restarts the slice cleanly.
  const dispatch = rawDispatch;

  // Mounting this component *is* the learner entering the lesson: four of the five worlds
  // mount it only after a "Start …" button, and My Skin is the app's entry point. StrictMode
  // runs this effect twice; `START_LESSON` is idempotent on `lessonStartedAt`, so the event
  // fires once. That guard is in the reducer, not here, because state is the only thing that
  // can tell two identical actions apart.
  useEffect(() => {
    dispatch({ type: 'START_LESSON', at: now() });
  }, [dispatch]);

  const active = currentActivityText({ ...state, locale });
  const atom = sliceAtoms(plan)[0];
  const boundaryAtom = sliceAtoms(plan)[1];
  const lessonText = atom ? resolveVariant(atom.variants, locale) : undefined;
  const boundaryText = boundaryAtom ? resolveVariant(boundaryAtom.variants, locale) : undefined;

  if (!active || !lessonText) {
    return (
      <section className="card">
        <p className="muted">{translate('common.notAvailable', locale)}</p>
      </section>
    );
  }

  const { activity, text, options, usedFallback } = active;
  const HINT_KEYS = ['hintH1', 'hintH2', 'hintH3'] as const;
  const hintKey = HINT_KEYS[Math.min(HINT_KEYS.length - 1, Math.max(0, state.hintsUsed - 1))] ?? 'hintH1';
  const activities = sliceActivities(plan);
  const transferActivity = activities.find(
    (candidate) => candidate.isTransfer && candidate.activityId !== state.activityId,
  );

  return (
    <div className="stack">
      <section className="card">
        <p className="eyebrow">
          {grounding.questName ? `${grounding.questName} · ` : ''}
          {grounding.domainId} {grounding.strandCode} {grounding.strandName} · {grounding.skillName}
        </p>
        <h1>{grounding.nodeTitle}</h1>
        <p className="muted">{grounding.learningObjective}</p>
        <Disclosures
          disclosures={[
            ...grounding.disclosures,
            {
              code: 'AUTHORED_SCAFFOLD',
              severity: 'info',
              messageKey: 'disclosure.authoredScaffold',
            },
            { code: 'NOT_MEDICAL_ADVICE', severity: 'info', messageKey: 'disclosure.notMedicalAdvice' },
          ]}
          locale={locale}
        />
        {usedFallback ? (
          <p className="disclosure disclosure--info">
            <span className="disclosure__mark">i</span>
            <span>{translate('common.fallbackLocale', locale, { locale: 'English' })}</span>
          </p>
        ) : null}
        <ProvenanceStrip
          entries={[
            { label: translate('common.node', locale), value: state.nodeId },
            { label: translate('common.skill', locale), value: `${state.skillId} ${grounding.skillName}` },
            { label: translate('common.status', locale), value: grounding.nodeStatus },
            { label: translate('common.evidence', locale), value: grounding.nodeEvidenceStatus },
            { label: translate('common.version', locale), value: grounding.nodeVersion },
            { label: translate('common.source', locale), value: grounding.nodeSourceId },
          ]}
        />
      </section>

      <PhaseRail phase={state.phase} locale={locale} />

      {state.phase === 'LESSON' ? (
        <section className="card">
          <p className="eyebrow">{translate('lesson.phase.lesson', locale)}</p>
          <p className="lead">{text['hook'] ?? lessonText.variant.text['hook']}</p>
          <p>{lessonText.variant.text['core']}</p>
          <p className="muted">{lessonText.variant.text['analogy']}</p>
          {boundaryText ? (
            <p className="disclosure disclosure--info">
              <span className="disclosure__mark">i</span>
              <span>{boundaryText.variant.text['core']}</span>
            </p>
          ) : null}
          <div className="btn--row">
            <button className="btn" type="button" onClick={() => dispatch({ type: 'LESSON_READ' })}>
              {translate('lesson.next', locale)}
            </button>
            {/* Reads the passage above, in the order it appears — nothing added or rephrased. */}
            <ReadAloud
              locale={locale}
              text={[
                text['hook'] ?? lessonText.variant.text['hook'],
                lessonText.variant.text['core'],
                lessonText.variant.text['analogy'],
              ]
                .filter(Boolean)
                .join(' ')}
            />
          </div>
        </section>
      ) : null}

      {state.phase === 'ASK' ? (
        <section className="card">
          <p className="eyebrow">{translate('lesson.phase.ask', locale)}</p>
          <p className="lead">{text['question']}</p>
          <p className="muted">{translate('lesson.think.prompt', locale)}</p>
          <div className="btn--row">
            <button className="btn" type="button" onClick={() => dispatch({ type: 'THINK_DONE' })}>
              {translate('lesson.think.continue', locale)}
            </button>
            <ReadAloud locale={locale} text={text['question'] ?? ''} />
          </div>
        </section>
      ) : null}

      {state.phase === 'THINK' || state.phase === 'HINT' || state.phase === 'TRY' ? (
        <section className="card">
          <p className="eyebrow">{translate('lesson.phase.try', locale)}</p>
          <p className="lead">{text['question']}</p>
          <div className="btn--row" style={{ marginTop: 0, marginBottom: '0.6rem' }}>
            {/* The question and the choices together: a listener cannot answer without both. */}
            <ReadAloud locale={locale} text={[text['question'], ...options].filter(Boolean).join('. ')} />
          </div>

          {state.phase === 'HINT' && state.hintsUsed > 0 ? (
            <p className="disclosure disclosure--info">
              <span className="disclosure__mark">{`H${state.hintsUsed}`}</span>
              <span>{text[hintKey] ?? translate('lesson.hint.noneLeft', locale)}</span>
            </p>
          ) : null}

          <div role="group" aria-label={text['question']}>
            {options.map((option, index) => (
              <button
                key={option}
                type="button"
                className="option"
                aria-pressed={state.selectedOptionIndex === index}
                onClick={() => dispatch({ type: 'SELECT_OPTION', optionIndex: index })}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="btn--row">
            <button
              className="btn"
              type="button"
              disabled={state.selectedOptionIndex === null}
              onClick={() => dispatch({ type: 'SUBMIT_ANSWER', at: now() })}
            >
              {translate('lesson.next', locale)}
            </button>
            <button
              className="btn btn--quiet"
              type="button"
              disabled={state.hintsUsed >= 3}
              onClick={() => dispatch({ type: 'REQUEST_HINT', at: now() })}
            >
              {translate('lesson.hint.request', locale)}
            </button>
          </div>
        </section>
      ) : null}

      {state.phase === 'FEEDBACK' ? (
        <section className="card">
          <p className="eyebrow">{translate('lesson.phase.feedback', locale)}</p>
          <p className="lead">
            {state.lastAnswerCorrect ? text['feedbackCorrect'] : text['feedbackIncorrect']}
          </p>
          <div className="btn--row">
            <button
              className="btn"
              type="button"
              onClick={() => dispatch({ type: 'CONTINUE_TO_REFLECT' })}
            >
              {translate('lesson.next', locale)}
            </button>
          </div>
        </section>
      ) : null}

      {state.phase === 'REFLECT' ? (
        <section className="card">
          <p className="eyebrow">{translate('lesson.phase.reflect', locale)}</p>
          <p className="lead">{text['reflectionPrompt']}</p>
          <textarea
            className="textarea"
            value={reflectionDraft}
            placeholder={translate('lesson.reflect.placeholder', locale)}
            onChange={(event) => setReflectionDraft(event.target.value)}
          />
          <div className="btn--row">
            <button
              className="btn"
              type="button"
              disabled={reflectionDraft.trim().length === 0}
              onClick={() =>
                dispatch({ type: 'SUBMIT_REFLECTION', text: reflectionDraft, at: now() })
              }
            >
              {translate('lesson.reflect.submit', locale)}
            </button>
          </div>
        </section>
      ) : null}

      {state.phase === 'MASTER' || state.phase === 'COMPLETE' ? (
        <>
          {state.safetyHaltMessageKey ? (
            <section className="card">
              <SafetyNotice messageKey={state.safetyHaltMessageKey as MessageKey} locale={locale} />
            </section>
          ) : null}
          {state.lessonCompletedAt ? (
            <p className="disclosure disclosure--info">
              <span className="disclosure__mark">i</span>
              <span>{translate('lesson.finished', locale)}</span>
            </p>
          ) : null}
          <MasteryPanel mastery={state.mastery} locale={locale} />
          <section className="card card--sunk">
            <p className="eyebrow">{translate('lesson.phase.master', locale)}</p>
            <table className="table">
              <thead>
                <tr>
                  <th>Attempt</th>
                  <th>Activity</th>
                  <th>Correct</th>
                  <th>Hints</th>
                  <th>Transfer</th>
                </tr>
              </thead>
              <tbody>
                {state.attempts.map((attempt) => (
                  <tr key={attempt.attemptId}>
                    <td>{attempt.attemptId}</td>
                    <td>{attempt.activityId}</td>
                    <td>{attempt.correct ? 'yes' : 'no'}</td>
                    <td>{attempt.hintsUsed}</td>
                    <td>{attempt.isTransfer ? 'yes' : 'no'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="btn--row">
              {transferActivity && !state.attempts.some((a) => a.activityId === transferActivity.activityId) ? (
                <button
                  className="btn"
                  type="button"
                  onClick={() =>
                    dispatch({ type: 'START_ACTIVITY', activityId: transferActivity.activityId })
                  }
                >
                  {translate('lesson.continueToTransfer', locale)}
                </button>
              ) : null}
              {state.phase === 'MASTER' ? (
                <button
                  className="btn"
                  type="button"
                  onClick={() => dispatch({ type: 'CONTINUE_TO_MASTERY', at: now() })}
                >
                  {translate('lesson.finish', locale)}
                </button>
              ) : null}
              <button
                className="btn btn--quiet"
                type="button"
                onClick={() => {
                  setReflectionDraft('');
                  dispatch({ type: 'RESTART', at: now() });
                }}
              >
                {translate('lesson.restart', locale)}
              </button>
            </div>
          </section>
        </>
      ) : null}
      <p className="muted fine">
        {activity.activityId} · {atom?.atomId} · claim class {activity.claimClass}
      </p>
    </div>
  );
}
