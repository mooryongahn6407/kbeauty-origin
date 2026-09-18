/**
 * Application shell and navigation.
 *
 * The seven MVP experiences named in the handoff command are all present in the navigation.
 * Only My Skin is implemented end-to-end in this slice; the rest state honestly what they
 * are grounded in and what blocks them, rather than showing mock content.
 */
import { useState } from 'react';
import { translate, type MessageKey, UI_CATALOG_LOCALES } from '@/localization/messages';
import { LOCALES } from '@/localization/locales';
import { MySkinScreen } from './screens/MySkinScreen';
import { IngredientGardenScreen } from './screens/IngredientGardenScreen';
import { RoutineStudioScreen } from './screens/RoutineStudioScreen';
import { SunProtectionScreen } from './screens/SunProtectionScreen';
import { LabelDetectiveScreen } from './screens/LabelDetectiveScreen';
import { AITutorScreen } from './screens/AITutorScreen';
import { QuestMasteryScreen } from './screens/QuestMasteryScreen';
import { GovernanceScreen } from './screens/GovernanceScreen';

type ScreenId =
  | 'mySkin'
  | 'ingredientGarden'
  | 'routineStudio'
  | 'sunProtection'
  | 'labelDetective'
  | 'aiTutor'
  | 'quests'
  | 'governance';

const NAV: readonly { id: ScreenId; key: MessageKey }[] = [
  { id: 'mySkin', key: 'nav.mySkin' },
  { id: 'ingredientGarden', key: 'nav.ingredientGarden' },
  { id: 'routineStudio', key: 'nav.routineStudio' },
  { id: 'sunProtection', key: 'nav.sunProtection' },
  { id: 'labelDetective', key: 'nav.labelDetective' },
  { id: 'aiTutor', key: 'nav.aiTutor' },
  { id: 'quests', key: 'nav.quests' },
  { id: 'governance', key: 'nav.governance' },
];

export function App() {
  const [screen, setScreen] = useState<ScreenId>('mySkin');
  const [locale, setLocale] = useState('en');

  return (
    <div className="app">
      <header className="masthead">
        <div className="masthead__inner">
          <div className="masthead__row">
            <div>
              <p className="masthead__brand">{translate('app.brand', locale)}</p>
              <p className="masthead__star">{translate('app.northStar', locale)}</p>
            </div>
            <label className="locale-switch">
              <span>{translate('common.locale', locale)}</span>
              <select value={locale} onChange={(event) => setLocale(event.target.value)}>
                {LOCALES.map((definition) => (
                  <option key={definition.tag} value={definition.tag}>
                    {definition.tag} · {definition.englishName}
                    {UI_CATALOG_LOCALES.includes(definition.tag) ? '' : ' (UI: en)'}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <nav className="nav" aria-label="Main">
            {NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                className="nav__item"
                aria-current={screen === item.id ? 'page' : undefined}
                onClick={() => setScreen(item.id)}
              >
                {translate(item.key, locale)}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="main">
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
      </main>
    </div>
  );
}
