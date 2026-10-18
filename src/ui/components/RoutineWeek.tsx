/**
 * «7-day routine check» card — after a result and on GLOW home for someone who has played before.
 * Today's two ticks and seven quiet dots; no streak, no reward, no scolding (src/app/routine-week.ts).
 */
import { useState } from 'react';
import { inLocale } from '@/content/care-quest/types';
import {
  WEEK_DAYS,
  dayIndex,
  loadWeek,
  localDay,
  saveWeek,
  startWeek,
  toggleSlot,
  weekDots,
  type RoutineWeek,
  type Slot,
} from '@/app/routine-week';
import { CHROME } from '../chrome-text';
import { Icon } from './AppChrome';

const t = (key: keyof typeof CHROME, locale: string) => inLocale(CHROME[key]!, locale);
const storage = (): Storage | undefined => {
  try {
    return typeof localStorage === 'undefined' ? undefined : localStorage;
  } catch {
    return undefined;
  }
};

export function RoutineWeekCard({ locale, today = localDay(new Date()) }: { locale: string; today?: string }) {
  const [week, setWeek] = useState<RoutineWeek | null>(() => loadWeek(storage()));
  const update = (next: RoutineWeek) => {
    saveWeek(storage(), next);
    setWeek(next);
  };
  const index = week ? dayIndex(week, today) : -1;
  const running = week !== null && index >= 0 && index < WEEK_DAYS;
  const finished = week !== null && index >= WEEK_DAYS;
  const ticks = week?.days[today] ?? {};

  const slot = (which: Slot, label: string) => (
    <button
      type="button"
      className="kg-week__tick"
      aria-pressed={Boolean(ticks[which])}
      onClick={() => week && update(toggleSlot(week, today, which))}
    >
      <span className="kg-week__box" aria-hidden="true">
        {ticks[which] ? <Icon name="check" /> : null}
      </span>
      {label}
    </button>
  );

  return (
    <section className="kg-week" aria-labelledby="kg-week-title">
      <h2 className="kg-week__title" id="kg-week-title">
        {t('weekTitle', locale)}
        {running ? <span className="kg-week__day"> · {t('weekDay', locale).replace('{n}', String(index + 1))}</span> : null}
      </h2>
      {running ? (
        <div className="kg-week__ticks">
          {slot('am', t('weekAm', locale))}
          {slot('pm', t('weekPm', locale))}
        </div>
      ) : null}
      {finished ? <p className="kg-week__note">{t('weekDone', locale)}</p> : null}
      {!running ? (
        <>
          {!finished ? <p className="kg-week__note">{t('weekIntro', locale)}</p> : null}
          <button type="button" className="btn btn--quiet kg-week__start" onClick={() => update(startWeek(today))}>
            {finished ? t('weekAgain', locale) : t('weekStart', locale)}
          </button>
        </>
      ) : (
        <p className="kg-week__note">{t('weekIntro', locale)}</p>
      )}
      {week && index >= 0 ? (
        <ol className="kg-week__dots" aria-hidden="true">
          {weekDots(week, today).map((state, n) => (
            <li key={n} className={`kg-week__dot is-${state}`} />
          ))}
        </ol>
      ) : null}
    </section>
  );
}
