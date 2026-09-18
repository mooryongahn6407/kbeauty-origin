/**
 * Display preferences — theme and text size.
 *
 * The reader decides how this app looks, and the app remembers. Two settings, both of which
 * exist because the alternative fails somebody:
 *
 *   - THEME. A phone set to dark showing a white page is painful at night, and a phone set to
 *     light showing a black page is unreadable in sun. So the default is `auto`: follow the
 *     device. `light` and `dark` are overrides for a reader whose device setting is not what
 *     they want here.
 *   - TEXT SIZE. Three steps. This multiplies the browser's own font size rather than
 *     replacing it, so a reader who has already enlarged text everywhere keeps that and gets
 *     this on top.
 *
 * Applied by setting `data-theme` and `data-text-size` on the document element; the tokens in
 * theme.css key off those attributes. Nothing here touches component code.
 *
 * Storage is best-effort. A browser with storage blocked still works — it simply starts from
 * the defaults each time, which is why every read is wrapped.
 */
export const THEME_CHOICES = ['auto', 'light', 'dark'] as const;
export type ThemeChoice = (typeof THEME_CHOICES)[number];

export const TEXT_SIZE_CHOICES = ['normal', 'large', 'larger'] as const;
export type TextSizeChoice = (typeof TEXT_SIZE_CHOICES)[number];

export interface DisplayPreferences {
  readonly theme: ThemeChoice;
  readonly textSize: TextSizeChoice;
}

export const DEFAULT_PREFERENCES: DisplayPreferences = { theme: 'auto', textSize: 'normal' };

const STORAGE_KEY = 'korea-glow.display';

const isTheme = (value: unknown): value is ThemeChoice =>
  typeof value === 'string' && (THEME_CHOICES as readonly string[]).includes(value);

const isTextSize = (value: unknown): value is TextSizeChoice =>
  typeof value === 'string' && (TEXT_SIZE_CHOICES as readonly string[]).includes(value);

/**
 * Read stored preferences, falling back to the defaults for anything missing or unrecognised.
 *
 * Pure with respect to its input: a stored value that is not one of the choices is ignored
 * rather than trusted, because it could be left over from an older build.
 */
export function parsePreferences(raw: string | null): DisplayPreferences {
  if (!raw) return DEFAULT_PREFERENCES;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return DEFAULT_PREFERENCES;
    const record = parsed as Record<string, unknown>;
    return {
      theme: isTheme(record['theme']) ? record['theme'] : DEFAULT_PREFERENCES.theme,
      textSize: isTextSize(record['textSize']) ? record['textSize'] : DEFAULT_PREFERENCES.textSize,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function loadPreferences(): DisplayPreferences {
  try {
    return parsePreferences(globalThis.localStorage?.getItem(STORAGE_KEY) ?? null);
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(preferences: DisplayPreferences): void {
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    // Storage blocked or full. The setting still applies for this visit.
  }
}

/**
 * The attribute values theme.css keys off.
 *
 * `auto` deliberately produces no `data-theme` attribute at all, because that is what lets the
 * `prefers-color-scheme` block in theme.css apply. Writing `data-theme="auto"` would be a
 * value no stylesheet matches.
 */
export function themeAttribute(theme: ThemeChoice): string | null {
  return theme === 'auto' ? null : theme;
}

export function applyPreferences(
  preferences: DisplayPreferences,
  root: { setAttribute(name: string, value: string): void; removeAttribute(name: string): void },
): void {
  const theme = themeAttribute(preferences.theme);
  if (theme === null) root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', theme);
  root.setAttribute('data-text-size', preferences.textSize);
}
