/**
 * Disclosure rendering.
 *
 * Every gate in the application returns disclosures alongside its decision. Rendering them
 * is not optional: it is how an unverified record stays visibly unverified in the UI.
 */
import type { Disclosure } from '@/domain/governance';
import { translate, type MessageKey } from '@/localization/messages';

export function Disclosures({
  disclosures,
  locale,
}: {
  disclosures: readonly Disclosure[];
  locale: string;
}) {
  if (disclosures.length === 0) return null;
  const seen = new Set<string>();

  return (
    <>
      {disclosures
        .filter((disclosure) => !seen.has(disclosure.code) && seen.add(disclosure.code))
        .map((disclosure) => (
          <p key={disclosure.code} className={`disclosure disclosure--${disclosure.severity}`}>
            <span className="disclosure__mark" aria-hidden="true">
              {disclosure.severity === 'caution' ? '!' : 'i'}
            </span>
            <span>{translate(disclosure.messageKey as MessageKey, locale)}</span>
          </p>
        ))}
    </>
  );
}

/** Source/status/version footer. Provenance is shown, never implied. */
export function ProvenanceStrip({
  entries,
}: {
  entries: readonly { readonly label: string; readonly value: string }[];
}) {
  return (
    <div className="provenance">
      {entries.map((entry) => (
        <span key={entry.label}>
          <span className="provenance__key">{entry.label}</span> {entry.value}
        </span>
      ))}
    </div>
  );
}
