/**
 * The shop's gift-code check, at `?staff=gift` (CEO card sqglow_10). Never linked from inside
 * the app and never offered to a reader — a shop's staff open the address they were given.
 *
 * The staff PIN is typed once and kept for this browser tab only (sessionStorage); each code is
 * checked first (valid / already used / unknown) and only then marked used with one tap, so a
 * code is never spent by a mistyped check. The server (`cloudflare/worker.ts`) holds the PIN as a
 * Worker secret, compares it in constant time, and locks out after repeated wrong PINs.
 */
import { useEffect, useState } from 'react';
import { initialLocale } from '@/app/app-chrome';
import { formatGiftCode, normalizeGiftCode } from '@/app/gift-code';
import { staffGiftCall, type StaffResult } from '@/app/gift';
import { translate } from '@/localization/messages';

const PIN_KEY = 'korea-glow:staff-pin';
const LANGUAGES: readonly { tag: string; label: string }[] = [
  { tag: 'lo', label: 'ລາວ' },
  { tag: 'th', label: 'ไทย' },
  { tag: 'en', label: 'EN' },
  { tag: 'fr', label: 'Français' },
  { tag: 'ko', label: '한국어' },
];

function startLocale(): string {
  try {
    return initialLocale(
      window.location.search,
      typeof localStorage === 'undefined' ? undefined : localStorage,
      typeof navigator === 'undefined' ? [] : navigator.languages ?? [],
      LANGUAGES.map((language) => language.tag),
    );
  } catch {
    return 'en';
  }
}

const when = (iso: string | null): string => (iso ? iso.slice(0, 16).replace('T', ' ') + ' UTC' : '');

export function StaffGiftScreen() {
  const [locale, setLocale] = useState(startLocale);
  const [pin, setPin] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<StaffResult | null>(null);
  const t = (key: Parameters<typeof translate>[0], params?: Record<string, string>) => translate(key, locale, params);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(PIN_KEY);
      if (saved) setPin(saved);
    } catch {
      // Blocked storage: staff type the PIN again.
    }
  }, []);

  const call = async (action: 'check' | 'redeem', event?: React.FormEvent) => {
    event?.preventDefault();
    if (!pin.trim() || !code.trim()) return;
    setBusy(true);
    const next = await staffGiftCall(pin.trim(), code, action);
    setBusy(false);
    setResult(next);
    if (next.status === 'badPin') {
      try {
        sessionStorage.removeItem(PIN_KEY);
      } catch {
        // Nothing kept to remove.
      }
      return;
    }
    if (next.status !== 'locked' && next.status !== 'networkError' && next.status !== 'notConfigured') {
      try {
        sessionStorage.setItem(PIN_KEY, pin.trim());
      } catch {
        // Fine — the PIN is typed again next time.
      }
    }
  };

  const reset = () => {
    setCode('');
    setResult(null);
  };

  const typed = normalizeGiftCode(code);

  return (
    <div className="app">
      <main className="main">
        <section className="guide" aria-labelledby="staff-gift-title">
          <div className="staff-langs" role="group" aria-label="Language">
            {LANGUAGES.map((language) => (
              <button
                key={language.tag}
                type="button"
                className={language.tag === locale ? 'btn btn--quiet is-on' : 'btn btn--quiet'}
                aria-pressed={language.tag === locale}
                onClick={() => setLocale(language.tag)}
              >
                {language.label}
              </button>
            ))}
          </div>
          <h1 className="guide-title" id="staff-gift-title">
            {t('staff.title')}
          </h1>
          <p className="lead">{t('staff.lead')}</p>

          <form onSubmit={(event) => void call('check', event)} className="stack">
            <label className="settings__label" htmlFor="staff-pin">
              {t('staff.pin')}
            </label>
            <input
              id="staff-pin"
              className="field"
              type="password"
              inputMode="numeric"
              autoComplete="off"
              value={pin}
              onChange={(event) => setPin(event.target.value)}
            />
            <label className="settings__label" htmlFor="staff-code">
              {t('staff.code')}
            </label>
            <input
              id="staff-code"
              className="field staff-code"
              type="text"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              value={code}
              onChange={(event) => {
                setCode(event.target.value);
                setResult(null);
              }}
              placeholder="K7M-X4P"
            />
            <button type="submit" className="btn btn--primary" disabled={busy || !pin.trim() || !code.trim()}>
              {t('staff.check')}
            </button>
          </form>

          <div aria-live="polite">
            {result ? <StaffOutcome result={result} typed={typed} t={t} /> : null}
            {result?.status === 'valid' ? (
              <button type="button" className="btn btn--primary" disabled={busy} onClick={() => void call('redeem')}>
                {t('staff.redeem')}
              </button>
            ) : null}
            {result && result.status !== 'badPin' ? (
              <button type="button" className="btn btn--quiet" onClick={reset}>
                {t('staff.next')}
              </button>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}

function StaffOutcome({
  result,
  typed,
  t,
}: {
  result: StaffResult;
  typed: string | null;
  t: (key: Parameters<typeof translate>[0], params?: Record<string, string>) => string;
}) {
  if (result.status === 'valid' || result.status === 'used' || result.status === 'redeemed') {
    const message =
      result.status === 'valid'
        ? t('staff.valid')
        : result.status === 'redeemed'
          ? t('staff.redeemed')
          : t('staff.used', { when: when(result.redeemedAt) });
    return (
      <div className={`staff-result staff-result--${result.status}`}>
        <p className="gift__code">{result.display || (typed ? formatGiftCode(typed) : '')}</p>
        <p className="staff-result__status">{message}</p>
        <p className="record-block__note">
          {t('staff.issued', { day: result.issuedOn })}
          {result.partner ? ` · ${t('staff.partner', { code: result.partner })}` : ''}
        </p>
      </div>
    );
  }
  const key =
    result.status === 'unknown'
      ? 'staff.unknown'
      : result.status === 'badPin'
        ? 'staff.badPin'
        : result.status === 'locked'
          ? 'staff.locked'
          : result.status === 'notConfigured'
            ? 'staff.notConfigured'
            : 'staff.network';
  return (
    <p className="disclosure disclosure--caution">
      <span className="disclosure__mark">!</span>
      <span>{t(key)}</span>
    </p>
  );
}
