/**
 * The skin game's greeting — the very first screen. Kept in its own small file, apart from the
 * game itself, so a phone on a slow connection can show it (and Lumina Noy's hello) before the
 * questions, the lessons and the dictionary have downloaded. Tapping «begin» opens the game,
 * whose file has usually arrived by then (the app fetches it in the background).
 */
import { translate } from '@/localization/messages';
import { Companion, SpeechBubble } from '../components/Companion';
import { GlowHero } from '../components/GlowHero';
import { ReadAloud } from '../components/ReadAloud';
import { spokenFallback } from '../spoken-fallback';

export function QuestWelcome({
  locale,
  partner,
  fromSkinQuest,
  onBegin,
}: {
  locale: string;
  partner: string | null;
  fromSkinQuest: boolean;
  onBegin: () => void;
}) {
  const lines = (l: string) =>
    [
      translate('skinquest.welcome.hello', l),
      translate('skinquest.welcome.guide', l),
      translate('skinquest.welcome.promise', l),
    ].join(' ');
  return (
    <section className="quest quest--welcome" aria-labelledby="glow-hero-title">
      <GlowHero locale={locale} partner={partner} fromSkinQuest={fromSkinQuest} />
      <Companion mood="calm" size={116} />
      <SpeechBubble>
        <h2 id="quest-hello" className="bubble__hello">
          {translate('skinquest.welcome.hello', locale)}
        </h2>
        <p className="bubble__prompt">{translate('skinquest.welcome.guide', locale)}</p>
        <p className="bubble__help">{translate('skinquest.welcome.promise', locale)}</p>
        <ReadAloud
          text={lines(locale)}
          locale={locale}
          fallback={spokenFallback(locale, lines)}
          autoplay
        />
      </SpeechBubble>
      <button type="button" className="btn btn--primary" onClick={onBegin}>
        {translate('skinquest.welcome.begin', locale)}
      </button>
      <p className="boundary">{translate('skinquest.welcome.boundary', locale)}</p>
    </section>
  );
}
