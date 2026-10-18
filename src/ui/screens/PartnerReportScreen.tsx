/**
 * Owner-only: how many times each partner's link was opened and how many times a result was
 * shown, by month. Reached only at `?admin=report` (see `src/ui/App.tsx`) — never linked from
 * the app itself, never offered to a reader. Asks for the key kept as the Cloudflare Worker
 * secret `PARTNER_REPORT_KEY` and shows nothing until it is entered correctly. The key travels in
 * the `X-Report-Key` header, never in the address (where logs and history would keep it), and
 * the Worker locks an IP out for 15 minutes after five wrong keys.
 *
 * What this is not: not a list of partners (the server never sends one — only the codes that
 * actually had a visit), not a count of unique people (see `src/app/partner-track.ts` for why),
 * and not something a partner can open about another partner — the key is the owner's alone.
 */
import { useEffect, useState } from 'react';
import { formatMonth, reportRows, reportToTsv, type PartnerReport } from '@/app/partner-report';

const SESSION_KEY = 'korea-glow:partner-report-key';
const ENDPOINT = '/api/partner-report';

type Status = 'idle' | 'loading' | 'ready' | 'badKey' | 'locked' | 'notConfigured' | 'networkError';

async function fetchReport(
  key: string,
  code: string,
): Promise<
  | { status: 'ready'; report: PartnerReport }
  | { status: Exclude<Status, 'idle' | 'loading' | 'ready'> }
> {
  const url = new URL(
    ENDPOINT,
    typeof window === 'undefined' ? 'http://x' : window.location.origin,
  );
  if (code.trim()) url.searchParams.set('code', code.trim());
  let response: Response;
  try {
    response = await fetch(url.toString(), { headers: { 'x-report-key': key }, cache: 'no-store' });
  } catch {
    return { status: 'networkError' };
  }
  if (response.status === 401) return { status: 'badKey' };
  if (response.status === 429) return { status: 'locked' };
  if (response.status === 500) return { status: 'notConfigured' };
  if (!response.ok) return { status: 'networkError' };
  try {
    const body = (await response.json()) as { report?: PartnerReport };
    return { status: 'ready', report: body.report ?? {} };
  } catch {
    return { status: 'networkError' };
  }
}

export function PartnerReportScreen() {
  const [key, setKey] = useState('');
  const [codeFilter, setCodeFilter] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [report, setReport] = useState<PartnerReport | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) setKey(saved);
    } catch {
      // Private window or blocked storage: the owner just types the key again.
    }
  }, []);

  const load = async (event?: React.FormEvent) => {
    event?.preventDefault();
    if (!key.trim()) return;
    setStatus('loading');
    setCopied(false);
    const result = await fetchReport(key.trim(), codeFilter);
    if (result.status === 'ready') {
      setReport(result.report);
      setStatus('ready');
      try {
        sessionStorage.setItem(SESSION_KEY, key.trim());
      } catch {
        // Fine — the owner just re-enters the key next time.
      }
    } else {
      setReport(null);
      setStatus(result.status);
    }
  };

  const rows = report ? reportRows(report) : [];
  const copy = async () => {
    if (!report) return;
    try {
      await navigator.clipboard.writeText(reportToTsv(report));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="app">
      <main className="main">
        <section className="guide" aria-labelledby="partner-report-title">
          <h1 className="guide-title" id="partner-report-title">
            파트너 리포트
          </h1>
          <p className="lead">
            파트너 링크를 연 횟수와 결과를 본 횟수를, 코드와 월별로 보여 드립니다. 이름·전화번호는
            어디에도 저장하지 않습니다.
          </p>

          <form onSubmit={load} className="stack">
            <label className="settings__label" htmlFor="partner-report-key">
              관리자 키
            </label>
            <input
              id="partner-report-key"
              className="field"
              type="password"
              autoComplete="off"
              value={key}
              onChange={(event) => setKey(event.target.value)}
              placeholder="PARTNER_REPORT_KEY"
            />
            <label className="settings__label" htmlFor="partner-report-code">
              파트너 코드 (비우면 전체)
            </label>
            <input
              id="partner-report-code"
              className="field"
              type="text"
              autoComplete="off"
              value={codeFilter}
              onChange={(event) => setCodeFilter(event.target.value)}
              placeholder="예: VTE-01"
            />
            <button type="submit" className="btn btn--primary" disabled={status === 'loading'}>
              {status === 'loading' ? '불러오는 중…' : '불러오기'}
            </button>
          </form>

          {status === 'badKey' ? (
            <p className="disclosure disclosure--caution">
              <span className="disclosure__mark">!</span>
              <span>키가 맞지 않습니다. 저장해 둔 PARTNER_REPORT_KEY 값을 다시 확인해 주세요.</span>
            </p>
          ) : null}
          {status === 'notConfigured' ? (
            <p className="disclosure disclosure--caution">
              <span className="disclosure__mark">!</span>
              <span>아직 설정되지 않았습니다. Cloudflare Worker 비밀값 PARTNER_REPORT_KEY가 없습니다.</span>
            </p>
          ) : null}
          {status === 'locked' ? (
            <p className="disclosure disclosure--caution">
              <span className="disclosure__mark">!</span>
              <span>여러 번 틀려 잠시 잠겼습니다. 15분 뒤 다시 시도해 주세요.</span>
            </p>
          ) : null}
          {status === 'networkError' ? (
            <p className="disclosure disclosure--caution">
              <span className="disclosure__mark">!</span>
              <span>불러오지 못했습니다. 인터넷 연결을 확인하고 다시 시도해 주세요.</span>
            </p>
          ) : null}

          {status === 'ready' ? (
            <>
              {rows.length === 0 ? (
                <p className="record-block__note">아직 기록된 방문이 없습니다.</p>
              ) : (
                <div className="stack">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>코드</th>
                        <th>월</th>
                        <th>링크 연 횟수</th>
                        <th>결과 본 횟수</th>
                        <th>얼굴</th>
                        <th>두피</th>
                        <th>바디</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => (
                        <tr key={`${row.code}-${row.month}`}>
                          <td>{row.code}</td>
                          <td>{formatMonth(row.month)}</td>
                          <td>{row.opens}</td>
                          <td>{row.results}</td>
                          <td>{row.face}</td>
                          <td>{row.scalp}</td>
                          <td>{row.body}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button type="button" className="btn btn--quiet" onClick={copy}>
                    {copied ? '복사됨' : '표 복사 (스프레드시트에 붙여넣기)'}
                  </button>
                </div>
              )}
              <p className="record-block__note">
                숫자는 있었던 «횟수»입니다. 같은 사람이 링크를 다시 열거나 결과를 다시 보면 또
                셉니다 — 몇 명이 왔는지가 아니라, 그 파트너를 거쳐 얼마나 많이 앱을 열고 결과를
                봤는지를 보여 드립니다.
              </p>
            </>
          ) : null}
        </section>
      </main>
    </div>
  );
}
