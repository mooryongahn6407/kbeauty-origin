/**
 * Owner-only report: how many times each partner's link was opened, and how many times a result
 * was shown (by care track), per month — nothing about who. See `track-visit.mts` for what is
 * and is not recorded, and `src/ui/screens/PartnerReportScreen.tsx` for how this is read.
 *
 * Gated by a secret the owner keeps as the Netlify env var `PARTNER_REPORT_KEY` (set once via
 * the Netlify dashboard or API — never written into this repository). Refuses to serve anything
 * if that variable is unset, rather than defaulting to open.
 */
import { getStore } from '@netlify/blobs';
import type { Config, Context } from '@netlify/functions';

const TRACKS = ['face', 'scalp', 'body'] as const;

interface MonthCount {
  readonly opens: number;
  readonly results: number;
  readonly byTrack: Readonly<Record<(typeof TRACKS)[number], number>>;
}

export default async (req: Request, _context: Context) => {
  const adminKey = Netlify.env.get('PARTNER_REPORT_KEY');
  if (!adminKey) return Response.json({ error: 'not configured' }, { status: 500 });

  const url = new URL(req.url);
  const suppliedKey = url.searchParams.get('key');
  if (suppliedKey !== adminKey) return Response.json({ error: 'unauthorized' }, { status: 401 });

  const onlyCode = normalizeFilter(url.searchParams.get('code'));
  const store = getStore('partner-visits');

  const { directories: codes } = await store.list({ directories: true, prefix: 'v1/' });
  const report: Record<string, Record<string, MonthCount>> = {};

  for (const code of codes) {
    if (onlyCode && code !== onlyCode) continue;
    const codePrefix = `v1/${code}/`;
    const { directories: months } = await store.list({ directories: true, prefix: codePrefix });
    const byMonth: Record<string, MonthCount> = {};

    for (const month of months) {
      const monthPrefix = `${codePrefix}${month}/`;
      const opens = (await store.list({ prefix: `${monthPrefix}open/` })).blobs.length;
      const byTrack = { face: 0, scalp: 0, body: 0 };
      for (const track of TRACKS) {
        byTrack[track] = (
          await store.list({ prefix: `${monthPrefix}result/${track}/` })
        ).blobs.length;
      }
      const results = byTrack.face + byTrack.scalp + byTrack.body;
      byMonth[month] = { opens, results, byTrack };
    }
    report[code] = byMonth;
  }

  return Response.json({ report, note: 'counts of events, not of unique people' });
};

function normalizeFilter(raw: string | null): string | null {
  if (!raw) return null;
  const value = raw.trim().toUpperCase();
  return value || null;
}

export const config: Config = { method: ['GET'] };
