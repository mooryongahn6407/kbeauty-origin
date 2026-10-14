/**
 * Pure helpers for the owner's partner report screen — shaping what
 * `netlify/functions/partner-report.mts` returns into rows a table can render, and building the
 * tab-separated text the "복사" button copies. No network and no DOM here, so this is the part
 * of the report that vitest actually exercises; the screen itself only fetches and renders.
 */

export interface MonthCount {
  readonly opens: number;
  readonly results: number;
  readonly byTrack: { readonly face: number; readonly scalp: number; readonly body: number };
}

export type PartnerReport = Readonly<Record<string, Readonly<Record<string, MonthCount>>>>;

export interface ReportRow {
  readonly code: string;
  readonly month: string;
  readonly opens: number;
  readonly results: number;
  readonly face: number;
  readonly scalp: number;
  readonly body: number;
}

/** `{code: {month: count}}` flattened to rows, newest month first within each code. */
export function reportRows(report: PartnerReport): readonly ReportRow[] {
  const rows: ReportRow[] = [];
  for (const code of Object.keys(report).sort()) {
    const months = Object.keys(report[code] ?? {}).sort((a, b) => b.localeCompare(a));
    for (const month of months) {
      const count = report[code]![month]!;
      rows.push({
        code,
        month,
        opens: count.opens,
        results: count.results,
        face: count.byTrack.face,
        scalp: count.byTrack.scalp,
        body: count.byTrack.body,
      });
    }
  }
  return rows;
}

/** `202610` → `2026-10`, for display; anything else is returned unchanged. */
export function formatMonth(month: string): string {
  return /^\d{6}$/.test(month) ? `${month.slice(0, 4)}-${month.slice(4)}` : month;
}

/** Tab-separated text (code, month, opens, results, face, scalp, body) for pasting into a sheet. */
export function reportToTsv(report: PartnerReport): string {
  const header = ['코드', '월', '링크 연 횟수', '결과 본 횟수', '얼굴', '두피', '바디'];
  const lines = reportRows(report).map((row) =>
    [row.code, formatMonth(row.month), row.opens, row.results, row.face, row.scalp, row.body].join(
      '\t',
    ),
  );
  return [header.join('\t'), ...lines].join('\n');
}
