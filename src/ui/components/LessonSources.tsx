/**
 * "What this lesson is based on" — the one place a lesson screen shows its audit trail.
 *
 * Every lesson in this app stands on governed records, and the app says exactly which ones,
 * how far each has been reviewed, and what is blocking the ones that cannot open. That
 * transparency is a feature. But a customer opening a lesson should meet the lesson first,
 * not a table of knowledge-node IDs, strand codes and blocker reasons. So the grounding lives
 * here: a native <details> disclosure, closed by default, placed after the lesson's main call
 * to action, labelled in the reader's own language.
 *
 * Nothing is removed or summarised away. Every ID, status and blocker that used to sit at the
 * top of the screen is rendered inside, unchanged; `tests/lesson-sources.test.ts` checks that
 * those IDs appear nowhere else on the landing screens.
 */
import type { ReactNode } from 'react';
import type { SliceGrounding } from '@/app/learning-session';
import { translate, type MessageKey } from '@/localization/messages';
import { ProvenanceStrip } from './Disclosures';

export function LessonSources({
  locale,
  label = 'sources.show',
  children,
}: {
  locale: string;
  label?: Extract<MessageKey, `sources.show${string}`>;
  children: ReactNode;
}) {
  return (
    <details className="sources" data-sources="">
      <summary className="sources__toggle">{translate(label, locale)}</summary>
      <div className="sources__body">
        <p className="muted fine">{translate('sources.intro', locale)}</p>
        {children}
      </div>
    </details>
  );
}

/**
 * The lesson itself, as a customer meets it: its title, whether it is open, the gate's verdict
 * in the reader's language, and the one button that starts it. No IDs.
 */
export function LessonDoor({
  grounding,
  locale,
  startLabel,
  onStart,
}: {
  grounding: SliceGrounding;
  locale: string;
  startLabel: string;
  onStart: () => void;
}) {
  const { availability } = grounding;
  return (
    <div className="card card--sunk" style={{ marginTop: '0.9rem' }}>
      <div className="masthead__row">
        <h3 style={{ margin: 0 }}>{grounding.nodeTitle}</h3>
        <span className={`tag tag--${availability.available ? 'open' : 'blocker'}`}>
          {availability.available
            ? translate('ingredient.openLesson', locale)
            : translate('ingredient.closedLesson', locale)}
        </span>
      </div>
      <p className="muted" style={{ marginTop: '0.35rem' }}>
        {translate(availability.summaryKey, locale, availability.summaryParams)}
      </p>
      <div className="btn--row">
        <button className="btn" type="button" disabled={!availability.available} onClick={onStart}>
          {startLabel}
        </button>
      </div>
    </div>
  );
}

/** The records one lesson plan stands on: node, strand, skill, quest, claim class, review state. */
export function LessonGrounding({
  grounding,
  locale,
}: {
  grounding: SliceGrounding;
  locale: string;
}) {
  const { plan } = grounding;
  return (
    <div className="card card--sunk">
      <h3 style={{ margin: 0 }}>{grounding.nodeTitle}</h3>
      <ProvenanceStrip
        entries={[
          { label: translate('common.node', locale), value: plan.nodeId },
          {
            label: 'Strand',
            value: `${grounding.domainId} ${grounding.strandCode} ${grounding.strandName}`,
          },
          {
            label: translate('common.skill', locale),
            value: `${plan.skillId} ${grounding.skillName}`,
          },
          ...(plan.questId !== null
            ? [{ label: 'Quest', value: `${plan.questId} ${grounding.questName ?? ''}`.trim() }]
            : []),
          { label: 'Claim class', value: plan.claimClass },
          { label: translate('common.status', locale), value: grounding.nodeStatus },
          { label: translate('common.evidence', locale), value: grounding.nodeEvidenceStatus },
          { label: translate('common.version', locale), value: grounding.nodeVersion },
          { label: translate('common.source', locale), value: grounding.nodeSourceId },
        ]}
      />
    </div>
  );
}
