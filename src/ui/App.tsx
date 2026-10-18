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
 * - **Language is chosen first, in the open.** Five flat buttons at the very top, all five on
 *   the screen at once — not a dropdown below the fold and not a row that has to be scrolled
 *   sideways to reach Lao. Someone in Vientiane should not have to hunt for their own language.
 * - **Voice is offered second, in words.** The master switch sits directly under the language
 *   buttons, says what pressing it does, and once it is on says how to turn it off. It used to
 *   be a small control beside each passage, one screen down, which is indistinguishable from
 *   not existing for a reader meeting the app for the first time.
 * - **Content governance is behind a door.** Review status, provenance and the open-items
 *   register are how this app keeps itself honest, and they still run on every screen — but
 *   they are for whoever owns the content, not for someone looking at their own skin. The rule
 *   they enforce is unchanged: nothing unverified is ever stated as fact anywhere.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { isUnreviewedCatalog, translate, type MessageKey } from '@/localization/messages';
import { applyPreferences, loadPreferences, savePreferences } from './preferences';
import { DisplaySettings } from './components/DisplaySettings';
import { VoiceSwitch } from './components/VoiceSwitch';
import { VoiceProvider } from './voice';
import { LocaleContext } from './locale-context';
import { CareQuestScreen } from './screens/CareQuestScreen';
import { CareLessonsScreen } from './screens/CareLessonsScreen';
import { capturePartner, partnerFromSearch } from '@/app/partner';
import { trackPartnerVisit } from '@/app/partner-track';
import { PartnerReportScreen } from './screens/PartnerReportScreen';
import { IngredientHuntScreen } from './screens/IngredientHuntScreen';
import { CompareLabScreen } from './screens/CompareLabScreen';
import { RoutineOrderScreen } from './screens/RoutineOrderScreen';
import { ClaimSorterScreen } from './screens/ClaimSorterScreen';
import { MySkinScreen } from './screens/MySkinScreen';
import { IngredientGardenScreen } from './screens/IngredientGardenScreen';
import { RoutineStudioScreen } from './screens/RoutineStudioScreen';
import { SunProtectionScreen } from './screens/SunProtectionScreen';
import { LabelDetectiveScreen } from './screens/LabelDetectiveScreen';
import { AITutorScreen } from './screens/AITutorScreen';
import { QuestMasteryScreen } from './screens/QuestMasteryScreen';
import { GovernanceScreen } from './screens/GovernanceScreen';
import { StoreProductsScreen } from './screens/StoreProductsScreen';
import { WordingCheckScreen } from './screens/WordingCheckScreen';
import { AcademyScreen } from './screens/AcademyScreen';
import { GuideHubScreen, type GuideTarget } from './screens/GuideHubScreen';
import { IngredientDictionaryScreen } from './screens/IngredientDictionaryScreen';
import {
  CategoriesGuideScreen,
  AboutAppScreen,
  KBeautyGuideScreen,
  SunCareGuideScreen,
} from './screens/GuideTopicScreens';
import { storeCatalog } from '@/content/store-catalog';
import { productFromSearch } from '@/app/store-catalog';
import { playTrackFromSearch } from '@/app/care-quest';
import {
  APP_VERSION,
  buttonGuideSeen,
  initialLocale,
  isInAppBrowser,
  markButtonGuideSeen,
  saveLocale,
  type QuestNav,
} from '@/app/app-chrome';
import {
  BottomBar,
  ButtonGuide,
  DeleteMyData,
  HelpDesk,
  Icon,
  Sheet,
  UpdateCheck,
  UpdateLine,
  chromeText,
} from './components/AppChrome';
import { InstallButton, SKIN_QUEST_URL } from './components/GlowHero';
import { LikeShareBar } from './components/LikeShare';
import { OtherAppItems } from './components/OtherApps';

type ScreenId =
  | 'quest'
  | 'guide'
  | 'store'
  | 'dictionary'
  | 'categories'
  | 'kbeauty'
  | 'sunguide'
  | 'about'
  | 'academy'
  | 'lessons'
  | 'wording'
  | 'more'
  | 'hunt'
  | 'compare'
  | 'order'
  | 'claimSort'
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
  { id: 'claimSort', key: 'claim.title' },
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
  // The owner's own report, at `?admin=report` — never linked from inside the app, never shown
  // to a reader. This check runs once, from the address this page loaded with, before any other
  // hook, so it never changes mid-session: see the doc comment on PartnerReportScreen.
  if (
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('admin') === 'report'
  ) {
    return <PartnerReportScreen />;
  }

  // A partner's product link (`?product=KG-CRM-00003`) opens straight onto that product's label.
  const [linkedProduct] = useState(() =>
    productFromSearch(typeof window === 'undefined' ? '' : window.location.search),
  );
  const [screen, setScreen] = useState<ScreenId>(linkedProduct ? 'store' : 'quest');
  // Which product or dictionary entry a cross-link asked for. Bumping `focusKey` remounts the
  // screen on that item even when the same screen is already open.
  const [focusSku, setFocusSku] = useState<string | null>(linkedProduct);
  const [focusIngredient, setFocusIngredient] = useState<string | null>(null);
  const [focusKey, setFocusKey] = useState(0);
  // KG-APP-BASE: «Back» (the bar's and the phone's) walks back through the screens visited.
  const stackRef = useRef<ScreenId[]>([]);
  const screenRef = useRef<ScreenId>(screen);
  screenRef.current = screen;
  const go = (next: ScreenId, remember = true) => {
    if (remember && next !== screenRef.current) stackRef.current.push(screenRef.current);
    if (next === 'quest') stackRef.current = [];
    setScreen(next);
    if (next !== 'store') setFocusSku(null);
    if (next !== 'dictionary') setFocusIngredient(null);
    setFocusKey((key) => key + 1);
    if (typeof window !== 'undefined') window.scrollTo?.(0, 0);
  };
  const openProduct = (sku: string) => {
    go('store');
    setFocusSku(sku);
  };
  const openIngredient = (id: string) => {
    go('dictionary');
    setFocusIngredient(id);
  };
  // Remembered across visits and carried by links (?lang=), so the game door and the class open
  // in the language the reader chose — not back in English (CEO, 2026-10-16).
  const [locale, setLocale] = useState(() =>
    initialLocale(
      typeof window === 'undefined' ? '' : window.location.search,
      typeof localStorage === 'undefined' ? undefined : localStorage,
      typeof navigator === 'undefined' ? [] : navigator.languages ?? [navigator.language],
      OFFERED_LOCALES.map((option) => option.tag),
    ),
  );
  const [preferences, setPreferences] = useState(loadPreferences);
  // Theme and text size matter to whoever needs them and to nobody else, and expanded they
  // cost a phone screen's whole top third before the first question is even visible. Folded
  // away they are one tap, and the question is the first thing on the screen.
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(() =>
    typeof localStorage === 'undefined' ? false : !buttonGuideSeen(localStorage),
  );
  const closeGuide = () => {
    if (typeof localStorage !== 'undefined') markButtonGuideSeen(localStorage);
    setGuideOpen(false);
  };
  const [questNav, setQuestNav] = useState<QuestNav | null>(null);
  const questNavRef = useRef<QuestNav | null>(null);
  questNavRef.current = questNav;
  const onNav = useCallback((nav: QuestNav | null) => setQuestNav(nav), []);
  const [toast, setToast] = useState<string | null>(null);
  // SKIN QUEST's "learn more" link lands here with ?from=skinquest — greeted as such, once.
  const [fromSkinQuest] = useState(
    () =>
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('from') === 'skinquest',
  );
  // The game door (`?play`, where play.korea-glow.com forwards): straight onto the first question.
  const [playTrack] = useState(() =>
    playTrackFromSearch(typeof window === 'undefined' ? '' : window.location.search),
  );
  // A partner shop's link (its QR code) carries the shop's code. Read once, remembered on this
  // device, and printed only on the gift card — see src/app/partner.ts for what it is not.
  const [partner] = useState(() => {
    const search = typeof window === 'undefined' ? '' : window.location.search;
    const code = capturePartner(
      search,
      typeof localStorage === 'undefined' ? undefined : localStorage,
    );
    // Only when the code is freshly in this load's own link — not on every later visit that
    // merely remembers it — so "link opened" stays close to "someone followed this link".
    if (code && partnerFromSearch(search) === code) trackPartnerVisit(code, 'open');
    return code;
  });

  useEffect(() => {
    applyPreferences(preferences, document.documentElement);
    savePreferences(preferences);
  }, [preferences]);

  useEffect(() => {
    document.documentElement.lang = locale;
    saveLocale(typeof localStorage === 'undefined' ? undefined : localStorage, locale);
  }, [locale]);

  const localeRef = useRef(locale);
  localeRef.current = locale;
  /** One step back inside the app. False only on the very first screen. */
  const stepBack = (): boolean => {
    if (screenRef.current === 'quest' && questNavRef.current?.canGoBack) {
      questNavRef.current.back();
      return true;
    }
    const previous = stackRef.current.pop();
    if (previous) {
      go(previous, false);
      return true;
    }
    if (screenRef.current !== 'quest') {
      go('quest', false);
      return true;
    }
    return false;
  };
  const stepBackRef = useRef(stepBack);
  stepBackRef.current = stepBack;

  // The phone's back button: a guard entry in history turns «back» into an in-app step back,
  // so the app never closes by surprise. On the first screen it asks once, then lets go.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.history?.pushState) return;
    let armedUntil = 0;
    window.history.pushState({ kgGuard: true }, '');
    const onPop = () => {
      if (stepBackRef.current()) {
        window.history.pushState({ kgGuard: true }, '');
        return;
      }
      if (Date.now() < armedUntil) {
        window.history.back();
        return;
      }
      armedUntil = Date.now() + 2500;
      setToast(chromeText('backAgainToLeave', localeRef.current));
      window.history.pushState({ kgGuard: true }, '');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const goFirst = () => {
    const inProgress = screenRef.current === 'quest' && questNavRef.current?.position;
    if (inProgress && !window.confirm(chromeText('confirmFirst', locale))) return;
    go('quest');
  };

  const onQuest = screen === 'quest';
  const inStudyRooms =
    screen === 'more' || STUDY_ROOMS.some((room) => room.id === screen) || screen === 'governance';

  return (
    <VoiceProvider>
      <LocaleContext.Provider value={locale}>
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
            <VoiceSwitch locale={locale} />
            <div className="topbar__right">
              <button
                type="button"
                className="brandmark"
                onClick={() => go('quest')}
                aria-current={onQuest ? 'page' : undefined}
              >
                {translate('app.title', locale)}
              </button>
              <button
                type="button"
                className="kg-iconbtn"
                onClick={goFirst}
                aria-label={chromeText('home', locale)}
                data-guide="home"
              >
                <Icon name="home" />
              </button>
              <button
                type="button"
                className="kg-iconbtn"
                aria-haspopup="dialog"
                onClick={() => setSettingsOpen(true)}
                aria-label={chromeText('settings', locale)}
                data-guide="settings"
              >
                <Icon name="gear" />
              </button>
            </div>
          </div>
        </header>

        <main className="main" id="main" tabIndex={-1}>
          {typeof navigator !== 'undefined' && isInAppBrowser(navigator.userAgent) ? (
            <p className="disclosure disclosure--caution kg-inapp" role="note">
              <span className="disclosure__mark">!</span>
              <span>{chromeText('inApp', locale)}</span>
            </p>
          ) : null}
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
            <>
              <CareQuestScreen
                key={focusKey}
                locale={locale}
                partner={partner}
                fromSkinQuest={fromSkinQuest}
                // Only on first arrival: coming back from a lesson must not restart the quest.
                startTrack={focusKey === 0 ? playTrack : null}
                onNav={onNav}
                onExplore={() => go('lessons')}
                onOpenIngredient={openIngredient}
                onOpenProduct={openProduct}
              />
              <button type="button" className="guide-entry" onClick={() => go('guide')}>
                <span className="guide-entry__photos" aria-hidden="true">
                  {storeCatalog
                    .filter((product) => product.photo)
                    .slice(4, 8)
                    .map((product) => (
                      <img key={product.sku} src={product.photo!} alt="" loading="lazy" />
                    ))}
                </span>
                <span className="guide-entry__text">{translate('guide.entry', locale)} ›</span>
              </button>
              {/* Home only — the welcome screen, after its main content. Not on every screen. */}
              {questNav && !questNav.canGoBack ? <LikeShareBar locale={locale} ask /> : null}
            </>
          ) : (
            <>
              <nav className="rooms" aria-label="Lessons">
                <button type="button" className="rooms__back" onClick={() => go('quest')}>
                  ‹ {translate('skinquest.title', locale)}
                </button>
                <button
                  type="button"
                  className="rooms__item"
                  aria-current={screen === 'guide' ? 'page' : undefined}
                  onClick={() => go('guide')}
                >
                  {translate('nav.guide', locale)}
                </button>
                {inStudyRooms ? (
                  <>
                    {STUDY_ROOMS.map((room) => (
                      <button
                        key={room.id}
                        type="button"
                        className="rooms__item"
                        aria-current={screen === room.id ? 'page' : undefined}
                        onClick={() => go(room.id)}
                      >
                        {translate(room.key, locale)}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="rooms__item rooms__item--owner"
                      aria-current={screen === 'governance' ? 'page' : undefined}
                      onClick={() => go('governance')}
                    >
                      {translate('nav.governance', locale)}
                    </button>
                  </>
                ) : null}
              </nav>

              {screen === 'guide' ? (
                <GuideHubScreen locale={locale} onGo={(target: GuideTarget) => go(target)} />
              ) : null}
              {screen === 'more' ? (
                <section className="guide" aria-labelledby="more-title">
                  <h1 className="guide-title" id="more-title">
                    {translate('guide.card.more.title', locale)}
                  </h1>
                  <p className="lead">{translate('guide.card.more.body', locale)}</p>
                </section>
              ) : null}
              {screen === 'dictionary' ? (
                <IngredientDictionaryScreen
                  key={`${locale}-${focusKey}`}
                  locale={locale}
                  initialId={focusIngredient}
                  onOpenProduct={openProduct}
                />
              ) : null}
              {screen === 'categories' ? (
                <CategoriesGuideScreen key={locale} locale={locale} onOpenProduct={openProduct} />
              ) : null}
              {screen === 'kbeauty' ? <KBeautyGuideScreen key={locale} locale={locale} /> : null}
              {screen === 'about' ? <AboutAppScreen key={locale} locale={locale} /> : null}
              {screen === 'wording' ? <WordingCheckScreen key={locale} locale={locale} /> : null}
              {screen === 'academy' ? (
                <AcademyScreen key={locale} locale={locale} onOpenChecker={() => go('wording')} />
              ) : null}
              {screen === 'lessons' ? (
                <CareLessonsScreen key={locale} locale={locale} onOpenIngredient={openIngredient} />
              ) : null}
              {screen === 'sunguide' ? (
                <SunCareGuideScreen key={locale} locale={locale} onOpenProduct={openProduct} />
              ) : null}

              {screen === 'store' ? (
                <StoreProductsScreen
                  key={`${locale}-${focusKey}`}
                  locale={locale}
                  partner={partner}
                  initialSku={focusSku}
                  onOpenIngredient={openIngredient}
                />
              ) : null}
              {screen === 'hunt' ? <IngredientHuntScreen key={locale} locale={locale} /> : null}
              {screen === 'compare' ? <CompareLabScreen key={locale} locale={locale} /> : null}
              {screen === 'order' ? <RoutineOrderScreen key={locale} locale={locale} /> : null}
              {screen === 'claimSort' ? <ClaimSorterScreen key={locale} locale={locale} /> : null}
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
          {onQuest ? (
            <p className="kg-helplink">
              <button type="button" className="kg-helplink__btn" onClick={() => setHelpOpen(true)}>
                {chromeText('sHelp', locale)}
              </button>
            </p>
          ) : null}
        </main>

        <UpdateLine locale={locale} />
        <BottomBar
          locale={locale}
          position={onQuest ? (questNav?.position ?? null) : null}
          canGoBack={!onQuest || Boolean(questNav?.canGoBack)}
          nextLabel={onQuest ? (questNav?.nextLabel ?? null) : null}
          onPrev={() => stepBack()}
          onNext={() => questNav?.next()}
          onFirst={goFirst}
        />
        {toast ? (
          <p className="kg-toast" role="status">
            {toast}
          </p>
        ) : null}

        {settingsOpen ? (
          <Sheet title={chromeText('settings', locale)} locale={locale} onClose={() => setSettingsOpen(false)}>
            <section className="kg-setting">
              <h3 className="kg-setting__title">{chromeText('sLanguage', locale)}</h3>
              <ul className="langchips" role="list">
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
            </section>
            <section className="kg-setting">
              <h3 className="kg-setting__title">{chromeText('sDisplay', locale)}</h3>
              <DisplaySettings preferences={preferences} onChange={setPreferences} locale={locale} />
            </section>
            <section className="kg-setting">
              <h3 className="kg-setting__title">{chromeText('sSound', locale)}</h3>
              <VoiceSwitch locale={locale} />
            </section>
            <section className="kg-setting">
              <h3 className="kg-setting__title">{chromeText('sInstall', locale)}</h3>
              <InstallButton locale={locale} />
            </section>
            <section className="kg-setting">
              <UpdateCheck locale={locale} />
              <button
                type="button"
                className="kg-setting__btn"
                onClick={() => {
                  setSettingsOpen(false);
                  setGuideOpen(true);
                }}
              >
                {chromeText('sGuide', locale)}
              </button>
              <button
                type="button"
                className="kg-setting__btn"
                onClick={() => {
                  setSettingsOpen(false);
                  setHelpOpen(true);
                }}
              >
                <Icon name="chat" />
                {chromeText('sHelp', locale)}
              </button>
            </section>
            <section className="kg-setting">
              <h3 className="kg-setting__title">{chromeText('sApps', locale)}</h3>
              <ul className="kg-applist" role="list">
                <li>
                  <a className="kg-setting__btn" href={SKIN_QUEST_URL}>
                    {chromeText('appSkinQuest', locale)}
                  </a>
                </li>
                <OtherAppItems locale={locale} />
              </ul>
            </section>
            <section className="kg-setting">
              <h3 className="kg-setting__title">{chromeText('sData', locale)}</h3>
              <DeleteMyData locale={locale} />
            </section>
            <p className="kg-setting__version">
              {chromeText('sVersion', locale)} {APP_VERSION}
            </p>
          </Sheet>
        ) : null}

        {helpOpen ? (
          <Sheet title={chromeText('sHelp', locale)} locale={locale} onClose={() => setHelpOpen(false)}>
            <HelpDesk
              locale={locale}
              screen={
                questNav?.position
                  ? `${screen} ${questNav.position.index}/${questNav.position.total}`
                  : screen
              }
            />
          </Sheet>
        ) : null}

        {guideOpen ? <ButtonGuide locale={locale} onDone={closeGuide} /> : null}
      </div>
      </LocaleContext.Provider>
    </VoiceProvider>

  );
}
