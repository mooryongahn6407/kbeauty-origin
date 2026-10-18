/**
 * The front door of GLOW Class: a short silent clip, one question, what is inside (counted from
 * the content itself, never typed in), "save to home screen", and the way to SKIN QUEST.
 *
 * `compact` is for someone who has been here before and lands on the track list: no clip and no
 * pitch, just the install button (until it is installed) and the game link.
 */
import { useEffect, useState } from 'react';
import { translate, UI_CATALOG_LOCALES } from '@/localization/messages';
import { QUEST_TEXT } from '@/content/care-quest/common';
import { inLocale } from '@/content/care-quest/types';
import { HERO_INGREDIENT_COUNT, HERO_LESSON_COUNT } from '@/content/hero-counts';
import { currentInstallMode, onInstallChange, promptInstall, type InstallMode } from '../install';

export const SKIN_QUEST_URL = 'https://play.korea-glow.com/';

export function skinQuestHref(partner: string | null, locale?: string): string {
  const url = new URL(SKIN_QUEST_URL);
  url.searchParams.set('from', 'glowclass');
  if (partner) url.searchParams.set('p', partner);
  // The reader's language goes along, so the game opens in the language they were reading.
  if (locale) url.searchParams.set('lang', locale);
  return url.toString();
}

function motionAllowed(): boolean {
  if (typeof window === 'undefined') return false;
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
  const saveData =
    (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData ===
    true;
  return !reduced && !saveData;
}

export function InstallButton({ locale }: { locale: string }) {
  const [mode, setMode] = useState<InstallMode>(() => currentInstallMode());
  const [help, setHelp] = useState(false);
  useEffect(() => onInstallChange(() => setMode(currentInstallMode())), []);

  if (mode === 'installed') {
    return <p className="install__done">{translate('hero.installed', locale)}</p>;
  }
  const press = async () => {
    if (mode === 'prompt') {
      await promptInstall();
      setMode(currentInstallMode());
    } else {
      setHelp((open) => !open);
    }
  };
  return (
    <div className="install">
      <button
        type="button"
        className="btn btn--primary install__button"
        onClick={press}
        aria-expanded={mode === 'prompt' ? undefined : help}
      >
        <img src="/icons/glow-class-192.png" alt="" className="install__icon" />
        {translate('hero.install', locale)}
      </button>
      <p className="install__hint">{translate('hero.install.hint', locale)}</p>
      {help && mode === 'ios' ? (
        <div className="install__steps">
          <p className="install__steps-title">{translate('hero.install.ios.title', locale)}</p>
          <ol>
            <li>{translate('hero.install.ios.step1', locale)}</li>
            <li>{translate('hero.install.ios.step2', locale)}</li>
          </ol>
        </div>
      ) : null}
      {help && mode === 'manual' ? (
        <p className="install__steps">{translate('hero.install.manual', locale)}</p>
      ) : null}
    </div>
  );
}

function SkinQuestLink({ locale, partner }: { locale: string; partner: string | null }) {
  return (
    <a
      className="glow-hero__quest"
      href={skinQuestHref(partner, locale)}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src="/icons/skin-quest-192.png" alt="" />
      <span>
        <span className="glow-hero__quest-title">
          {translate('hero.skinquest.title', locale)} ›
        </span>
        <span className="glow-hero__quest-body">{translate('hero.skinquest.body', locale)}</span>
      </span>
    </a>
  );
}

export function GlowHero({
  locale,
  partner,
  fromSkinQuest,
  compact = false,
}: {
  locale: string;
  partner: string | null;
  fromSkinQuest: boolean;
  compact?: boolean;
}) {
  const [motion] = useState(motionAllowed);
  const welcome = fromSkinQuest ? (
    <p className="glow-hero__welcome">{translate('hero.fromSkinQuest', locale)}</p>
  ) : null;

  if (compact) {
    return (
      <section className="glow-hero glow-hero--compact">
        {welcome}
        <InstallButton locale={locale} />
        <SkinQuestLink locale={locale} partner={partner} />
      </section>
    );
  }

  return (
    <section className="glow-hero" aria-labelledby="glow-hero-title">
      <p className="glow-hero__brand">
        {translate('app.title', locale)} · {translate('app.brand', locale)}
      </p>
      {welcome}
      <h1 id="glow-hero-title" className="glow-hero__title">
        {translate('hero.title', locale)}
      </h1>
      <p className="glow-hero__body">{translate('hero.body', locale)}</p>
      <figure className="glow-hero__media">
        {/* Silent, hands only, never a face or a real brand — the same clip as the "order"
            lesson, so it is already in the phone's cache when the reader gets there. Plays by
            itself only when the reader has not asked for less motion or less data; otherwise the
            brand photo stands in until they press play. */}
        <video
          src="/lessons/order.mp4"
          poster={motion ? '/lessons/order-poster.jpg' : '/gemini/A-01.jpg'}
          muted
          playsInline
          loop
          autoPlay={motion}
          controls={!motion}
          preload={motion ? 'auto' : 'none'}
        />
        <figcaption>{inLocale(QUEST_TEXT.videoExample, locale)}</figcaption>
      </figure>
      <ul className="glow-hero__stats">
        <li>
          <strong>{HERO_LESSON_COUNT}</strong> {translate('hero.stat.lessons', locale)}
        </li>
        <li>
          <strong>{HERO_INGREDIENT_COUNT}</strong>{' '}
          {translate('hero.stat.ingredients', locale)}
        </li>
        <li>
          <strong>{UI_CATALOG_LOCALES.length}</strong> {translate('hero.stat.languages', locale)}
        </li>
      </ul>
      <InstallButton locale={locale} />
      <SkinQuestLink locale={locale} partner={partner} />
    </section>
  );
}
