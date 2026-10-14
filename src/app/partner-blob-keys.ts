/**
 * Pure key-shape helpers for the partner-visit Blobs store, shared between
 * `netlify/functions/track-visit.mts` (which writes these keys) and
 * `netlify/functions/partner-report.mts` (which lists and aggregates them) — so a mistake about
 * the shape of a key, or about what Netlify Blobs' `list({ directories: true })` hands back,
 * can only happen in one place, and that place is covered by a test that needs no real Blobs
 * store. (It mattered once already: `list()` returns each subfolder as the full prefix ready to
 * pass straight back into the next call, e.g. `v1/VTE-01/`, never the bare name `VTE-01` alone —
 * `directoryLabel` below is what first got that wrong.)
 *
 * Key shape: v1/<code>/<yyyyMM>/<event>/<track-or-dash>/<a unique suffix>
 */
export const KEY_ROOT = 'v1/';
export const TRACKS = ['face', 'scalp', 'body'] as const;
export type Track = (typeof TRACKS)[number];
export type VisitEvent = 'open' | 'result';

/** `2026-10-14T...` → `202610`, the month a visit's key is filed under. */
export function monthKey(now: Date): string {
  return now.toISOString().slice(0, 7).replace('-', '');
}

export function visitKey(
  code: string,
  event: VisitEvent,
  trackOrDash: Track | '-',
  now: Date,
  unique: string,
): string {
  return `${KEY_ROOT}${code}/${monthKey(now)}/${event}/${trackOrDash}/${unique}`;
}

/**
 * The label a person reads for one `directories` entry from `list()`. `directory` is the full
 * prefix `list()` returned (and the exact string to pass as `prefix` to the next call); this
 * only strips the parent prefix that was searched under, and the trailing slash, for display.
 */
export function directoryLabel(parentPrefix: string, directory: string): string {
  return directory.slice(parentPrefix.length).replace(/\/$/, '');
}
