/**
 * Skin lessons — the background the Care Quest result points to. A list of six short lessons;
 * each opens to a few sections, every one with its own read-aloud control, the ingredients it
 * mentions as links into the dictionary, and its sources. Words live in
 * `src/content/care-quest/lessons.ts` (rule 8); this screen only lays them out.
 */
import { useState } from 'react';
import { translate } from '@/localization/messages';
import { CARE_LESSONS, type CareLesson } from '@/content/care-quest/lessons';
import { QUEST_TEXT } from '@/content/care-quest/common';
import { inLocale, type Localized } from '@/content/care-quest/types';
import { companyDictionary } from '@/content/company/ingredient-dictionary';
import { ReadAloud } from '../components/ReadAloud';
import { SceneHero } from '../components/SceneHero';
import { spokenFallback } from '../spoken-fallback';
import { pick } from '../pick';

function Say({ text, locale }: { text: Localized; locale: string }) {
  return (
    <ReadAloud
      text={inLocale(text, locale)}
      locale={locale}
      fallback={spokenFallback(locale, (spoken) => inLocale(text, spoken))}
    />
  );
}

export function CareLessonsScreen({
  locale,
  onOpenIngredient,
}: {
  locale: string;
  onOpenIngredient: (id: string) => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const t = (text: Localized) => inLocale(text, locale);
  const go = (id: string | null) => {
    setOpen(id);
    if (typeof window !== 'undefined') window.scrollTo?.(0, 0);
  };
  const lesson = CARE_LESSONS.find((item) => item.id === open);

  if (lesson) {
    return (
      <Lesson
        key={lesson.id}
        lesson={lesson}
        locale={locale}
        onBack={() => go(null)}
        onGo={go}
        onOpenIngredient={onOpenIngredient}
      />
    );
  }

  return (
    <section className="guide" aria-labelledby="lessons-title">
      <SceneHero src="/scenes/scene-11.jpg" focus="50% 30%" />
      <h1 className="guide-title" id="lessons-title">
        {translate('guide.card.lessons.title', locale)}
      </h1>
      <p className="lead">{translate('guide.card.lessons.body', locale)}</p>
      <ol className="care-lessons">
        {CARE_LESSONS.map((item) => (
          <li key={item.id}>
            <button type="button" className="care-lesson-card" onClick={() => go(item.id)}>
              <span className="care-lesson-card__icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="care-lesson-card__text">
                <span className="care-lesson-card__title">{t(item.title)}</span>
                <span className="care-lesson-card__body">{t(item.intro)}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
      <p className="record-block__note">{t(QUEST_TEXT.draft)}</p>
    </section>
  );
}

function Lesson({
  lesson,
  locale,
  onBack,
  onGo,
  onOpenIngredient,
}: {
  lesson: CareLesson;
  locale: string;
  onBack: () => void;
  onGo: (id: string) => void;
  onOpenIngredient: (id: string) => void;
}) {
  const t = (text: Localized) => inLocale(text, locale);
  const index = CARE_LESSONS.indexOf(lesson);
  const next = CARE_LESSONS[index + 1];
  return (
    <article className="guide care-lesson" aria-labelledby="lesson-title">
      <button type="button" className="btn btn--quiet btn--small" onClick={onBack}>
        ‹ {translate('guide.card.lessons.title', locale)}
      </button>
      <p className="eyebrow">
        {lesson.icon} {index + 1} / {CARE_LESSONS.length}
      </p>
      <h1 className="guide-title" id="lesson-title">
        {t(lesson.title)}
      </h1>
      {lesson.cover ? <SceneHero src={lesson.cover} focus="50% 35%" /> : null}
      <p className="lead">{t(lesson.intro)}</p>
      {lesson.video ? (
        <figure className="care-lesson__video">
          {/* Silent clip — no dialogue to translate, and nothing it shows is a claim (hands or
              forearm only, never a face or a real brand). Not autoplayed: a reader on a slow or
              paid connection presses play, rather than data spending itself. */}
          <video
            src={lesson.video}
            poster={lesson.videoPoster}
            controls
            muted
            playsInline
            preload="none"
          />
          <figcaption>{t(QUEST_TEXT.videoExample)}</figcaption>
        </figure>
      ) : null}
      {lesson.sections.map((section) => (
        <section key={section.title.en} className="care-lesson__section">
          <h2 className="care-lesson__heading">{t(section.title)}</h2>
          <p className="care-lesson__body">{t(section.body)}</p>
          <Say
            text={{
              ko: `${section.title.ko}. ${section.body.ko}`,
              en: `${section.title.en}. ${section.body.en}`,
              lo: `${section.title.lo}. ${section.body.lo}`,
              th: `${section.title.th}. ${section.body.th}`,
              fr: `${section.title.fr}. ${section.body.fr}`,
            }}
            locale={locale}
          />
        </section>
      ))}
      {lesson.ingredients.length > 0 ? (
        <>
          <h2 className="care-lesson__heading">{t(QUEST_TEXT.commonlyUsed)}</h2>
          <ul className="chips" role="list">
            {lesson.ingredients.map((id) => {
              const entry = companyDictionary.ingredients.find((item) => item.id === id);
              return entry ? (
                <li key={id}>
                  <button
                    type="button"
                    className="chip care-chip"
                    onClick={() => onOpenIngredient(id)}
                  >
                    {pick(entry.name, locale)}
                  </button>
                </li>
              ) : null;
            })}
          </ul>
        </>
      ) : null}
      <section className="record-block care-sources">
        <h2 className="record-block__title">{t(QUEST_TEXT.sources)}</h2>
        <p className="record-block__note">{t(QUEST_TEXT.draft)}</p>
        <ul className="care-sources__list">
          {lesson.sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noreferrer noopener">
                {source.name}
              </a>
            </li>
          ))}
        </ul>
      </section>
      <div className="quest__foot">
        <button type="button" className="btn btn--quiet" onClick={onBack}>
          {t(QUEST_TEXT.back)}
        </button>
        {next ? (
          <button type="button" className="btn btn--primary" onClick={() => onGo(next.id)}>
            {t(QUEST_TEXT.next)}: {t(next.title)}
          </button>
        ) : null}
      </div>
    </article>
  );
}
