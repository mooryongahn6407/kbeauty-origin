/**
 * Application shell.
 *
 * The front door is the Skin Quest: a question about your own face, asked by someone, with big
 * things to tap. The seven study rooms are still all here, but they are behind "go deeper"
 * rather than spread across the first screen as eight equal tabs — a row of tabs is a filing
 * cabinet, and a filing cabinet is what made this read like a paper.
 *
 * Two things moved deliberately:
 *
 * - **Language is chosen first, in the open.** Four flat chips at the very top, not a dropdown
 *   below the fold. Someone in Vientiane should not have to find a select element to read in
 *   their own language.
 * - **Content governance is behind a door.** Review status, provenance and the open-items
 *   register are how this app keeps itself honest, and they still run on every screen — but
 *   they are for whoever owns the content, not for someone looking at their own skin. The rule
 *   they enforce is unchanged: nothing unverified is ever stated as fact anywhere.
 */
import { useEffect, useState } from 'react';
import {
  isUnreviewedCatalog,
  translate,
  type MessageKey,
} from '@/localization/messages';
import { applyPreferences, loadPreferences, savePreferences } from './preferences';
import { DisplaySettings } from './components/DisplaySettings';
import { SkinQuestScreen } from './screens/SkinQuestScreen';
import { IngredientHuntScreen } from './screens/IngredientHuntScreen';
import { CompareLabScreen } from './screens/CompareLabScreen';
import { RoutineOrderScreen } from './screens/RoutineOrderScreen';
import { MySkinScreen } from './screens/MySkinScreen';
import { IngredientGardenScreen } from './screens/IngredientGardenScreen';
import { RoutineStudioScreen } from './screens/RoutineStudioScreen';
import { SunProtectionScreen } from './screens/SunProtectionScreen';
import { LabelDetectiveScreen } from './screens/LabelDetectiveScreen';
import { AITutorScreen } from './screens/AITutorScreen';
import { QuestMasteryScreen } from './screens/QuestMasteryScreen';
import { GovernanceScreen } from './screens/GovernanceScreen';

type ScreenId =
  | 'quest'
  | 'hunt'
  | 'compare'
  | 'order'
  | 'mySkin'
  | 'ingredientGarden'
  | 'routineStudio'
  | 'sunProtection'
  | 'labelDetective'
  | 'aiTutor'
  | 'quests'
  | 'governance';

/** The study rooms, reached from the quest's record or the "go deeper" row. */
const STUDY_ROOMS: readonly { id: ScreenId; key: MessageKey }[] = [
  { id: 'hunt', key: 'hunt.title' },
  { id: 'compare', key: 'compare.title' },
  { id: 'order', key: 'order.title' },
  { id: 'mySkin', key: 'nav.mySkin' },
  { id: 'ingredientGarden', key: 'nav.ingredientGarden' },
  { id: 'routineStudio', key: 'nav.routineStudio' },
  { id: 'sunProtection', key: 'nav.sunProtection' },
  { id: 'labelDetective', key: 'nav.labelDetective' },
  { id: 'aiTutor', key: 'nav.aiTutor' },
  { id: 'quests', key: 'nav.quests' },
];

/**
 * The languages offered as chips. Four, not ten: these are the catalogs that exist, and an
 * offer to read in a language the app has no words for is not an offer. Lao ships as an
 * unreviewed draft and says so on screen — which is why it is still offered rather than hidden:
 * Laos is who this is for, and a labelled draft beats no Lao at all.
 */
const OFFERED_LOCALES: readonly { tag: string; label: string }[] = [
  { tag: 'en', label: 'EN' },
  { tag: 'ko', label: '한국어' },
  { tag: 'fr', label: 'Français' },
  { tag: 'th', label: 'ไทย' },
  { tag: 'lo', label: 'ລາວ' },
];

export function App() {
  const [screen, setScreen] = useState<ScreenId>('quest');
  const [locale, setLocale] = useState('en');
  const [preferences, setPreferences] = useState(loadPreferences);
  // Theme and text size matter to whoever needs them and to nobody else, and expanded they
  // cost a phone screen's whole top third before the first question is even visible. Folded
  // away they are one tap, and the question is the first thing on the screen.
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    applyPreferences(preferences, document.documentElement);
    savePreferences(preferences);
  }, [preferences]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const onQuest = screen === 'quest';

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        {translate('display.skipToContent', locale)}
      </a>

      <header className="topbar">
        <div className="topbar__inner">
          <ul className="langchips" role="list" aria-label={translate('common.locale', locale)}>
            {OFFERED_LOCALES.map((option) => (
              <li key={option.tag}>
                <button
                  type="button"
                  className="langchip"
                  aria-pressed={locale === option.tag}
                  lang={option.tag}
                  onClick={() => setLocale(option.tag)}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="topbar__right">
            <button
              type="button"
              className="brandmark"
              onClick={() => setScreen('quest')}
              aria-current={onQuest ? 'page' : undefined}
            >
              {translate('app.brand', locale)}
            </button>
            <button
              type="button"
              className="settings-toggle"
              aria-expanded={settingsOpen}
              aria-controls="display-settings"
              onClick={() => setSettingsOpen((open) => !open)}
            >
              {translate('display.theme', locale)} · {translate('display.textSize', locale)}
            </button>
          </div>
        </div>
        <div className="topbar__settings" id="display-settings" hidden={!settingsOpen}>
          <DisplaySettings preferences={preferences} onChange={setPreferences} locale={locale} />
        </div>
      </header>

      <main className="main" id="main" tabIndex={-1}>
        {isUnreviewedCatalog(locale) ? (
          // Said once, at the top of every screen, for as long as the reader stays in an
          // unchecked language. A translation nobody has read is a draft, and the app does not
          // present drafts as finished anywhere else either.
          <p className="disclosure disclosure--caution">
            <span className="disclosure__mark">!</span>
            <span>{translate('catalog.unreviewed', locale)}</span>
          </p>
        ) : null}

        {onQuest ? (
          <SkinQuestScreen key={locale} locale={locale} onExplore={() => setScreen('mySkin')} />
        ) : (
          <>
            <nav className="rooms" aria-label="Lessons">
              <button type="button" className="rooms__back" onClick={() => setScreen('quest')}>
                ‹ {translate('skinquest.title', locale)}
              </button>
              {STUDY_ROOMS.map((room) => (
                <button
                  key={room.id}
                  type="button"
                  className="rooms__item"
                  aria-current={screen === room.id ? 'page' : undefined}
                  onClick={() => setScreen(room.id)}
                >
                  {translate(room.key, locale)}
                </button>
              ))}
              <button
                type="button"
                className="rooms__item rooms__item--owner"
                aria-current={screen === 'governance' ? 'page' : undefined}
                onClick={() => setScreen('governance')}
              >
                {translate('nav.governance', locale)}
              </button>
            </nav>

            {screen === 'hunt' ? <IngredientHuntScreen key={locale} locale={locale} /> : null}
            {screen === 'compare' ? <CompareLabScreen key={locale} locale={locale} /> : null}
            {screen === 'order' ? <RoutineOrderScreen key={locale} locale={locale} /> : null}
            {screen === 'mySkin' ? <MySkinScreen key={locale} locale={locale} /> : null}
            {screen === 'ingredientGarden' ? (
              <IngredientGardenScreen key={locale} locale={locale} />
            ) : null}
            {screen === 'routineStudio' ? (
              <RoutineStudioScreen key={locale} locale={locale} />
            ) : null}
            {screen === 'sunProtection' ? (
              <SunProtectionScreen key={locale} locale={locale} />
            ) : null}
            {screen === 'labelDetective' ? (
              <LabelDetectiveScreen key={locale} locale={locale} />
            ) : null}
            {screen === 'aiTutor' ? <AITutorScreen key={locale} locale={locale} /> : null}
            {screen === 'quests' ? <QuestMasteryScreen key={locale} locale={locale} /> : null}
            {screen === 'governance' ? <GovernanceScreen locale={locale} /> : null}
          </>
        )}
      </main>
    </div>
  );
}
