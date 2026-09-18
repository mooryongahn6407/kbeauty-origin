/**
 * Honest placeholder for MVP experiences that are architected but not yet built.
 *
 * It names the governed records the experience will be grounded in and the gate that
 * currently blocks it, rather than presenting an empty screen or mock content.
 */
import { translate, type MessageKey } from '@/localization/messages';

export interface PlaceholderProps {
  readonly titleKey: MessageKey;
  readonly locale: string;
  readonly groundedIn: readonly string[];
  readonly blockedBy: string;
}

export function PlaceholderScreen({ titleKey, locale, groundedIn, blockedBy }: PlaceholderProps) {
  return (
    <section className="card">
      <p className="eyebrow">{translate('app.title', locale)}</p>
      <h1>{translate(titleKey, locale)}</h1>
      <p className="muted">{translate('common.comingSoon', locale)}</p>
      <h3 style={{ marginTop: '1.1rem' }}>Grounded in</h3>
      <p className="muted">{groundedIn.join(' · ')}</p>
      <h3 style={{ marginTop: '0.9rem' }}>Currently blocked by</h3>
      <p className="muted">{blockedBy}</p>
    </section>
  );
}
