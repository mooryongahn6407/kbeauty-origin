/**
 * Mastery evidence panel.
 *
 * Shows all four dimensions separately, so the learner can see that a correct answer moved
 * one dimension and not the others. Master DB 19_MASTERY_RULES; AI Constitution §6.1.
 */
import type { MasteryDimension, MasteryState } from '@/domain/learning';
import { MASTERY_THRESHOLDS, isMastered } from '@/mastery/mastery-engine';
import { translate, type MessageKey } from '@/localization/messages';

const DIMENSION_KEYS: readonly { dimension: MasteryDimension; key: MessageKey }[] = [
  { dimension: 'accuracy', key: 'mastery.accuracy' },
  { dimension: 'independence', key: 'mastery.independence' },
  { dimension: 'transfer', key: 'mastery.transfer' },
  { dimension: 'retention', key: 'mastery.retention' },
];

export function MasteryPanel({ mastery, locale }: { mastery: MasteryState; locale: string }) {
  return (
    <section className="card">
      <p className="eyebrow">{translate('mastery.title', locale)}</p>
      <p className="muted">{translate('mastery.explainer', locale)}</p>
      <div className="dims">
        {DIMENSION_KEYS.map(({ dimension, key }) => {
          const state = mastery.dimensions[dimension];
          const threshold = MASTERY_THRESHOLDS[dimension];
          return (
            <div key={dimension} className={`dim${state.satisfied ? ' dim--satisfied' : ''}`}>
              <p className="dim__name">{translate(key, locale)}</p>
              <p className="dim__value">
                {state.successes}/{state.attempts} ·{' '}
                {state.satisfied
                  ? translate('mastery.satisfied', locale)
                  : translate('mastery.notYet', locale)}
              </p>
              <p className="dim__value fine">
                {threshold.ruleId} · ≥{Math.round(threshold.ratio * 100)}% · min {threshold.minAttempts}
              </p>
            </div>
          );
        })}
      </div>
      <p className="muted" style={{ marginTop: '0.8rem' }}>
        {translate('mastery.state', locale)}: <strong>{mastery.state}</strong>
        {isMastered(mastery) ? '' : ''}
      </p>
    </section>
  );
}
