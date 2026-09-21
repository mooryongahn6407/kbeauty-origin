/**
 * LUMINA NOY — the guide.
 *
 * Drawn here rather than photographed, and the reason is not only that a drawing costs nothing
 * to make in five moods. A photograph of a face is a particular age and a particular skin, and
 * the person holding the phone supplies both; an illustration lets a woman in Vientiane and a
 * woman in Seoul both see someone who could be talking to them.
 *
 * Every colour comes from the theme tokens, so she is the same character in the light theme and
 * the dark one without a second drawing. She is built from a few shapes on purpose: a face that
 * says a great deal with two dots and a curve reads as warm at 64px on a phone, where a detailed
 * one reads as noise.
 *
 * This is a stand-in the app can ship today. When the company's own LUMINA NOY artwork arrives,
 * it replaces the `<svg>` body below and nothing else changes — every screen asks for her the
 * same way.
 */

export type LuminaMood = 'greeting' | 'asking' | 'pleased' | 'thinking';

const MOOD_TITLE: Readonly<Record<LuminaMood, string>> = {
  greeting: 'LUMINA NOY',
  asking: 'LUMINA NOY',
  pleased: 'LUMINA NOY',
  thinking: 'LUMINA NOY',
};

export function Lumina({
  mood = 'asking',
  size = 96,
}: {
  mood?: LuminaMood;
  size?: number;
}) {
  return (
    <svg
      className={`lumina lumina--${mood}`}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label={MOOD_TITLE[mood]}
      focusable="false"
    >
      {/* The glow she is named for: a soft disc behind her, never a halo around the face. */}
      <circle className="lumina__glow" cx="60" cy="58" r="42" />

      {/* Hair, back layer — drawn first so the face sits in front of it. It falls past the
          shoulders rather than stopping at the jaw, which was the first attempt and read as a
          hood rather than as hair. */}
      <path
        className="lumina__hair"
        d="M60 15c-20 0-33 14-33 34 0 10-1 19-3 27-1 6-2 12-4 17 6 3 12 4 17 4-2-8-3-17-3-26 0-6 0-13 1-20 1-16 10-25 25-25s24 9 25 25c1 7 1 14 1 20 0 9-1 18-3 26 5 0 11-1 17-4-2-5-3-11-4-17-2-8-3-17-3-27 0-20-13-34-33-34z"
      />

      {/* Shoulders. */}
      <path className="lumina__shoulders" d="M60 90c-19 0-33 9-36 22h72c-3-13-17-22-36-22z" />

      {/* Face. */}
      <ellipse className="lumina__face" cx="60" cy="58" rx="21" ry="25" />
      {/* Fringe, front layer. */}
      <path
        className="lumina__hair"
        d="M60 31c-13 0-21 8-22 20 5-7 12-11 22-11s17 4 22 11c-1-12-9-20-22-20z"
      />

      {/* Eyes and mouth. Closed, curved eyes for `pleased` — the one change that reads as a
          smile from across a room. */}
      {mood === 'pleased' ? (
        <>
          <path className="lumina__eye-line" d="M47 57c2-3 7-3 9 0" />
          <path className="lumina__eye-line" d="M64 57c2-3 7-3 9 0" />
        </>
      ) : (
        <>
          <circle className="lumina__eye" cx="51.5" cy="57" r="2.8" />
          <circle className="lumina__eye" cx="68.5" cy="57" r="2.8" />
        </>
      )}
      <path
        className="lumina__mouth"
        d={mood === 'pleased' ? 'M54 69c3 4 9 4 12 0' : 'M55 69c3 2.5 7 2.5 10 0'}
      />
      <circle className="lumina__blush" cx="43" cy="65" r="4.5" />
      <circle className="lumina__blush" cx="77" cy="65" r="4.5" />

      {/* A small spark she offers, only when she is pleased with the reader. */}
      {mood === 'pleased' ? (
        <path className="lumina__spark" d="M96 30l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5z" />
      ) : null}
    </svg>
  );
}
