/**
 * KG-APP-CARE §2-4 (CEO, 2026-10-19): from the third visit on, GLOW home opens with Lumina
 * Noy's «welcome back, last time you were here» and four cards — today's one thing (largest),
 * review, next, and something different. Everything is worked out from what is already saved on
 * this phone (src/app/journey.ts); nothing new about the reader is stored to draw it.
 */
import { inLocale, type TrackId } from '@/content/care-quest/types';
import { CARE_LESSONS } from '@/content/care-quest/lessons';
import { LUMINA_PORTRAIT } from '@/content/brand';
import {
  dueReviewCount,
  finishedTracks,
  journeyCards,
  loadLastLesson,
  type JourneyAction,
  type JourneyCard,
} from '@/app/journey';
import { hasProgress } from '@/app/entry-links';
import { dayIndex, loadWeek, localDay, WEEK_DAYS } from '@/app/routine-week';
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

const TRACK_LABEL: Readonly<Record<TrackId, keyof typeof CHROME>> = {
  face: 'aTrackFace',
  scalp: 'aTrackScalp',
  body: 'aTrackBody',
};
const TRACK_NAME: Readonly<Record<TrackId, keyof typeof CHROME>> = {
  face: 'brSkin',
  scalp: 'brHair',
  body: 'brBody',
};
const SLOT_TITLE: Readonly<Record<JourneyCard['slot'], keyof typeof CHROME>> = {
  today: 'jToday',
  review: 'jReview',
  next: 'jNext',
  other: 'jOther',
};

const lessonTitle = (id: string, locale: string): string | null => {
  const lesson = CARE_LESSONS.find((item) => item.id === id);
  return lesson ? inLocale(lesson.title, locale) : null;
};

function actionLabel(action: JourneyAction, locale: string): string {
  switch (action.kind) {
    case 'resume':
      return t('aResume', locale);
    case 'week':
      return t('aWeek', locale);
    case 'track':
      return t(TRACK_LABEL[action.track], locale);
    case 'result':
      return t('lastResult', locale);
    case 'review':
      return action.due > 0
        ? t('aReviewDue', locale).replace('{n}', String(action.due))
        : t('aReviewStart', locale);
    case 'lesson':
      return t('aLesson', locale).replace('{name}', lessonTitle(action.id, locale) ?? action.id);
    case 'dictionary':
      return t('aDict', locale);
  }
}

export function JourneyCards({
  locale,
  onAction,
}: {
  locale: string;
  onAction: (action: JourneyAction) => void;
}) {
  const store = storage();
  const today = localDay(new Date());
  const week = loadWeek(store);
  const index = week ? dayIndex(week, today) : -1;
  const ticks = week?.days[today];
  const finished = finishedTracks(store);
  const lastLesson = loadLastLesson(store);
  const cards = journeyCards({
    finished,
    hasProgress: hasProgress(store),
    weekTodo: week !== null && index >= 0 && index < WEEK_DAYS && !(ticks?.am && ticks?.pm),
    dueReviews: dueReviewCount(store, today),
    lastLesson,
    lessonIds: CARE_LESSONS.map((lesson) => lesson.id),
  });
  const lastName = lastLesson ? lessonTitle(lastLesson, locale) : null;
  const where = lastName
    ? t('jLastLesson', locale).replace('{name}', lastName)
    : finished.length > 0
      ? t('jLastTrack', locale).replace('{name}', t(TRACK_NAME[finished[finished.length - 1]!], locale))
      : null;

  return (
    <section className="kg-journey" aria-labelledby="kg-journey-title">
      <div className="kg-journey__hello">
        {LUMINA_PORTRAIT ? <img className="kg-journey__photo" src={LUMINA_PORTRAIT} alt="" /> : null}
        <div>
          <h2 className="kg-journey__title" id="kg-journey-title">
            {t('jHello', locale)}
          </h2>
          {where ? <p className="kg-journey__where">{where}</p> : null}
          <p className="kg-journey__name">{t('guideName', locale)}</p>
        </div>
      </div>
      <ul className="kg-journey__cards" role="list">
        {cards.map((card) => (
          <li key={card.slot} className={`kg-journey__item kg-journey__item--${card.slot}`}>
            <button type="button" className="kg-jcard" onClick={() => onAction(card.action)}>
              <span className="kg-jcard__slot">{t(SLOT_TITLE[card.slot], locale)}</span>
              <span className="kg-jcard__label">{actionLabel(card.action, locale)}</span>
              <Icon name="next" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
