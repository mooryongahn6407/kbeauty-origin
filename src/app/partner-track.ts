/**
 * Counts a visit through a partner's link — the shop code, which kind of event, and for a
 * finished result which track. Never a name, a phone number or a device id (decision ② in
 * `docs/기억/05_결정대기.md`).
 *
 * What this deliberately is not:
 * - Not a count of unique people. Nothing here is stored to tell two visits from the same reader
 *   apart (that would need a device id, which this app does not keep — see `partner.ts`), so the
 *   admin report counts *events*: a link opened, a result shown. A reader who reopens a saved
 *   result, or scans the same shop's QR twice, adds to the count again. `cloudflare/worker.ts`
 *   (GET /api/partner-report) and the admin screen say this plainly, so the number is never read as
 *   more precise than it is.
 * - Not something the app depends on. Every screen works exactly the same if this endpoint is
 *   slow, blocked, or unreachable — `trackPartnerVisit` never awaits, never throws outward, and
 *   its failure is invisible to the reader.
 * - Not a log of visits. Since the move to Cloudflare (2026-10-18) the Worker
 *   (`cloudflare/worker.ts`) adds one to a monthly count per shop, event and track in D1 — the
 *   same numbers the Netlify version counted, without keeping a row per visit.
 */
import { normalizePartnerCode } from './partner-shape';
import type { TrackId } from '@/content/care-quest/types';

export type VisitEvent = 'open' | 'result';

/** The request body for one visit, or null when the code is not well-formed — never sent. */
export function visitPayload(
  code: string,
  event: VisitEvent,
  track?: TrackId,
): { readonly code: string; readonly event: VisitEvent; readonly track?: TrackId } | null {
  const normalized = normalizePartnerCode(code);
  if (!normalized) return null;
  return track ? { code: normalized, event, track } : { code: normalized, event };
}

/** The Worker also still answers the old Netlify path, for phones holding a cached build. */
const ENDPOINT = '/api/visit';

/** Fire-and-forget. Does nothing outside a browser, for a malformed code, or if sending fails. */
export function trackPartnerVisit(code: string, event: VisitEvent, track?: TrackId): void {
  const payload = visitPayload(code, event, track);
  if (!payload) return;
  if (typeof navigator === 'undefined' && typeof fetch === 'undefined') return;
  const body = JSON.stringify(payload);
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }));
      return;
    }
  } catch {
    // Fall through to fetch below.
  }
  try {
    void fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {
      // Offline, blocked, or the function is unreachable: the visit just goes uncounted.
    });
  } catch {
    // Same as above — never thrown to the caller.
  }
}
