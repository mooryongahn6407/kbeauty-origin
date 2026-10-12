/**
 * Partner Academy: five short lessons for partner shops, each a cover photo, three points and two
 * questions. A lesson counts as done when both questions are answered right; that record stays on
 * the reader's phone and is never read by anything to do with commission, rank or partner status.
 * Lesson text is KOREA GLOW's own Draft material (src/content/partner/academy.ts), shown as that.
 */
import { useEffect, useState } from 'react';
import { translate } from '@/localization/messages';
import {
  ACADEMY,
  loadAcademyProgress,
  saveAcademyProgress,
  type AcademyUnit,
} from '@/content/partner/academy';
import { pick, showsEnglishFallback } from '../pick';

const storage = (): Storage | undefined =>
  typeof localStorage === 'undefined' ? undefined : localStorage;

export function AcademyScreen({
  locale,
  onOpenChecker,
}: {
  locale: string;
  onOpenChecker: () => void;
}) {
  const [done, setDone] = useState<readonly string[]>(() => loadAcademyProgress(storage()));
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => saveAcademyProgress(storage(), done), [done]);

  const go = (index: number | null) => {
    setOpen(index);
    if (typeof window !== 'undefined') window.scrollTo?.(0, 0);
  };

  const unit = open === null ? undefined : ACADEMY[open];
  if (unit && open !== null) {
    return (
      <Lesson
        key={unit.id}
        unit={unit}
        index={open}
        locale={locale}
        isDone={done.includes(unit.id)}
        onDone={() => setDone((list) => (list.includes(unit.id) ? list : [...list, unit.id]))}
        onBack={() => go(null)}
        onNext={open + 1 < ACADEMY.length ? () => go(open + 1) : undefined}
        onOpenChecker={onOpenChecker}
      />
    );
  }

  return (
    <section className="guide academy" aria-labelledby="academy-title">
      <h1 className="guide-title" id="academy-title">
        {translate('guide.card.academy.title', locale)}
      </h1>
      <p className="lead">{translate('guide.card.academy.body', locale)}</p>
      <p className="fine">{translate('academy.intro', locale)}</p>
      {showsEnglishFallback(locale) ? (
        <p className="fine">{translate('guide.englishShown', locale)}</p>
      ) : null}
      <p className="academy__progress" aria-live="polite">
        {translate('academy.progress', locale, {
          done: String(done.length),
          total: String(ACADEMY.length),
        })}
      </p>
      <ol className="academy__list">
        {ACADEMY.map((item, index) => (
          <li key={item.id}>
            <button type="button" className="academy-card" onClick={() => go(index)}>
              <span className="academy-card__media" aria-hidden="true">
                <img
                  src={item.cover}
                  alt=""
                  loading="lazy"
                  style={item.coverFocus ? { objectPosition: item.coverFocus } : undefined}
                />
              </span>
              <span className="academy-card__text">
                <span className="academy-card__n">
                  {item.icon} {translate('academy.lesson', locale, { n: String(index + 1) })}
                  {done.includes(item.id) ? ` · ${translate('academy.done', locale)}` : ''}
                </span>
                <span className="academy-card__title">{pick(item.title, locale)}</span>
                <span className="academy-card__body">{pick(item.intro, locale)}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
      <p className="record-block__note">{translate('academy.note', locale)}</p>
    </section>
  );
}

function Lesson({
  unit,
  index,
  locale,
  isDone,
  onDone,
  onBack,
  onNext,
  onOpenChecker,
}: {
  unit: AcademyUnit;
  index: number;
  locale: string;
  isDone: boolean;
  onDone: () => void;
  onBack: () => void;
  onNext: (() => void) | undefined;
  onOpenChecker: () => void;
}) {
  const [answers, setAnswers] = useState<readonly (number | null)[]>(() =>
    unit.quiz.map(() => null),
  );
  const allRight = unit.quiz.every((question, i) => answers[i] === question.answer);

  useEffect(() => {
    if (allRight && !isDone) onDone();
  }, [allRight, isDone, onDone]);

  return (
    <article className="guide academy" aria-labelledby="lesson-title">
      <button type="button" className="btn btn--quiet btn--small" onClick={onBack}>
        {translate('academy.back', locale)}
      </button>
      <figure className="academy-lesson__cover" aria-hidden="true">
        <img
          src={unit.cover}
          alt=""
          style={unit.coverFocus ? { objectPosition: unit.coverFocus } : undefined}
        />
      </figure>
      <p className="eyebrow">
        {unit.icon} {translate('academy.lesson', locale, { n: String(index + 1) })}
      </p>
      <h1 className="guide-title" id="lesson-title">
        {pick(unit.title, locale)}
      </h1>
      <p className="lead">{pick(unit.intro, locale)}</p>
      {showsEnglishFallback(locale) ? (
        <p className="fine">{translate('guide.englishShown', locale)}</p>
      ) : null}

      <ol className="academy-lesson__points">
        {unit.points.map((point) => (
          <li key={point.en}>{pick(point, locale)}</li>
        ))}
      </ol>

      {unit.linksToChecker ? (
        <button type="button" className="btn btn--quiet" onClick={onOpenChecker}>
          ✍️ {translate('academy.openChecker', locale)}
        </button>
      ) : null}

      <h2 className="guide-subtitle">{translate('academy.quiz', locale)}</h2>
      {unit.quiz.map((question, qi) => {
        const chosen = answers[qi];
        const answered = chosen !== null && chosen !== undefined;
        const right = answered && chosen === question.answer;
        return (
          <fieldset key={question.q.en} className="card academy-q">
            <legend className="academy-q__q">
              {qi + 1}. {pick(question.q, locale)}
            </legend>
            <div className="academy-q__options">
              {question.options.map((option, oi) => (
                <button
                  key={option.en}
                  type="button"
                  className={`academy-q__option${answered && oi === chosen ? (right ? ' is-right' : ' is-wrong') : ''}`}
                  aria-pressed={chosen === oi}
                  disabled={right}
                  onClick={() =>
                    setAnswers((list) => list.map((value, i) => (i === qi ? oi : value)))
                  }
                >
                  {pick(option, locale)}
                </button>
              ))}
            </div>
            {answered ? (
              <p
                className={`disclosure ${right ? 'disclosure--info' : 'disclosure--caution'}`}
                role="status"
              >
                <span className="disclosure__mark">{right ? '✓' : '!'}</span>
                <span>
                  <strong>{translate(right ? 'academy.correct' : 'academy.wrong', locale)}</strong>{' '}
                  {right ? pick(question.why, locale) : translate('academy.retry', locale)}
                </span>
              </p>
            ) : null}
          </fieldset>
        );
      })}

      {allRight || isDone ? (
        <p className="academy__progress">{translate('academy.done', locale)}</p>
      ) : null}
      {onNext ? (
        <button type="button" className="btn" onClick={onNext}>
          {translate('academy.next', locale)} →
        </button>
      ) : (
        <button type="button" className="btn" onClick={onBack}>
          {translate('academy.back', locale)}
        </button>
      )}
      <p className="record-block__note">{translate('academy.note', locale)}</p>
    </article>
  );
}
