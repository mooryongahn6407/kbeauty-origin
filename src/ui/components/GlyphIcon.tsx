/**
 * KG-APP-BASE §5: line icons, never emoji. Content modules still name their icon with an emoji
 * (it is a compact, readable key in the data), and this turns that key into a line SVG in the
 * app's own stroke style. Every icon is decorative — the words next to it carry the meaning — so
 * it is always aria-hidden. A key with no drawing gets a plain ring, never the emoji itself.
 */
export type GlyphName =
  | 'sun'
  | 'moon'
  | 'drop'
  | 'leaf'
  | 'sparkle'
  | 'flame'
  | 'snow'
  | 'cloud'
  | 'flower'
  | 'search'
  | 'medical'
  | 'clock'
  | 'calendar'
  | 'note'
  | 'share'
  | 'copy'
  | 'link'
  | 'bag'
  | 'tag'
  | 'lock'
  | 'globe'
  | 'book'
  | 'cap'
  | 'play'
  | 'bulb'
  | 'face'
  | 'bottle'
  | 'bubble'
  | 'hand'
  | 'heart'
  | 'person'
  | 'check'
  | 'warning'
  | 'close'
  | 'home'
  | 'info'
  | 'ring';

export const GLYPH_PATHS: Readonly<Record<GlyphName, string>> = {
  sun: 'M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  moon: 'M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z',
  drop: 'M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z',
  leaf: 'M5 19C5 10 11 5 20 4c0 9-5 15-13 15M5 19l7-7',
  sparkle: 'M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2zM19 3v4M17 5h4',
  flame: 'M12 3c1 4 5 5.5 5 10a5 5 0 01-10 0c0-2.5 1.5-4 2.5-5 0 2 1 3 2 3 0-3-1-5.5.5-8z',
  snow: 'M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5L12 7l2.5-2.5M9.5 19.5L12 17l2.5 2.5',
  cloud: 'M7 18a4 4 0 01-.5-8A6 6 0 0118 9a4.5 4.5 0 01-.5 9H7z',
  flower: 'M12 9a3 3 0 100 6 3 3 0 000-6zM12 9V4a3 3 0 010 5zM12 15v5a3 3 0 010-5zM9 12H4a3 3 0 015 0zM15 12h5a3 3 0 01-5 0z',
  search: 'M10.5 4a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM15.5 15.5L20 20',
  medical: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 8v8M8 12h8',
  clock: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l3 2',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  note: 'M6 3h9l3 3v15H6zM9 10h6M9 14h6M9 18h4',
  share: 'M12 15V3M8 7l4-4 4 4M5 12v8h14v-8',
  copy: 'M9 9h11v11H9zM5 15H4V4h11v1',
  link: 'M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1',
  bag: 'M5 8h14l-1 13H6zM9 8V6a3 3 0 016 0v2',
  tag: 'M3 12V4h8l10 10-8 8zM7.5 7.5h.01',
  lock: 'M5 11h14v10H5zM8 11V7a4 4 0 018 0v4',
  globe: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18',
  book: 'M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 21V5M8 7h7',
  cap: 'M2 9l10-5 10 5-10 5zM6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6',
  play: 'M12 3a9 9 0 100 18 9 9 0 000-18zM10 8.5v7l6-3.5z',
  bulb: 'M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z',
  face: 'M12 3a9 9 0 100 18 9 9 0 000-18zM9 10h.01M15 10h.01M9 15c1.7 1.3 4.3 1.3 6 0',
  bottle: 'M10 3h4v3l2 3v12H8V9l2-3V3zM8 13h8',
  bubble: 'M9 6a5 5 0 100 10A5 5 0 009 6zM17 13a3 3 0 100 6 3 3 0 000-6zM17 3a2 2 0 100 4 2 2 0 000-4z',
  hand: 'M8 12V5a1.5 1.5 0 013 0v6M11 10V4a1.5 1.5 0 013 0v6M14 10V5.5a1.5 1.5 0 013 0V14a7 7 0 01-7 7h-.5A6.5 6.5 0 014 15l-.5-2.5a1.5 1.5 0 012.8-1L8 14',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z',
  person: 'M12 3a3.5 3.5 0 100 7 3.5 3.5 0 000-7zM5 21a7 7 0 0114 0',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  warning: 'M12 4l9 16H3zM12 10v4M12 17h.01',
  close: 'M6 6l12 12M18 6L6 18',
  home: 'M4 11l8-7 8 7M6 10v9h12v-9',
  info: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 11v6M12 7.5h.01',
  ring: 'M12 8a4 4 0 100 8 4 4 0 000-8z',
};

/** Emoji keys found in the content modules, by the line icon that stands for them. */
const BY_KEY: Readonly<Record<GlyphName, string>> = {
  sun: '☀🌤🌅⛱🌞',
  moon: '🌙😴🛏',
  drop: '💧💦🥛',
  leaf: '🌿🍃🌱🍂🌾🌳🪶',
  sparkle: '✨★⭐🎀🎁',
  flame: '🔥♨🌶⚡',
  snow: '❄🧊',
  cloud: '🌧🌦☁🌥🌫🌬💨🌀',
  flower: '🌸🌹🌺',
  search: '🔍🔬👁',
  medical: '🩹💊🩺🩸',
  clock: '⏳⏰',
  calendar: '🗓📅📆',
  note: '📝✍📋📄🔢📏',
  share: '📤',
  copy: '📑',
  link: '🔗➰',
  bag: '🛍🎒🧺',
  tag: '🏷',
  lock: '🔒🛡🏛🧱',
  globe: '🌐📺',
  book: '📚',
  cap: '🎓',
  play: '🎮🎯🎈🎨🎭',
  bulb: '💡',
  face: '🙂🤔😣🥱😌🙈🪞👄👃🐼🐔🦢',
  bottle: '🧴🫙🧪💄🌰🟤🟫🟡🔴⚫🪨',
  bubble: '🫧🧼🛁🚿🧽',
  hand: '🤲✋🤏🫳🤞🤝💅💪🦶',
  heart: '♥🤍',
  person: '🧍🚶🏃💆💇🤰♀👖🧵🪮✂🪜🚪🚬🛵',
  check: '✓✔✅',
  warning: '⚠',
  close: '✕✖',
  home: '🏠🏁☯➕➖➜',
  info: 'ℹ',
  ring: '',
};

const GLYPH_BY_KEY: ReadonlyMap<string, GlyphName> = (() => {
  const map = new Map<string, GlyphName>();
  for (const [name, keys] of Object.entries(BY_KEY) as [GlyphName, string][])
    for (const key of Array.from(keys)) map.set(key, name);
  return map;
})();

/** The line icon for a glyph name or an emoji key (variation selectors ignored); a ring if unknown. */
export const glyphFor = (key: string): GlyphName => {
  if (Object.prototype.hasOwnProperty.call(GLYPH_PATHS, key)) return key as GlyphName;
  const first = Array.from(key.replace(/[️‍]/g, '').trim())[0] ?? '';
  return GLYPH_BY_KEY.get(first) ?? 'ring';
};

export function GlyphIcon({ glyph, name }: { glyph?: string | undefined; name?: GlyphName }) {
  const shape = name ?? glyphFor(glyph ?? '');
  return (
    <svg className="kg-icon kg-glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={GLYPH_PATHS[shape]} />
    </svg>
  );
}
