/**
 * The companion and its speech bubble.
 *
 * Everything the quest says to the reader is said *by* someone, in a bubble, rather than
 * printed at them as a heading. That is the whole difference between a page that reads like a
 * paper and one that reads like a conversation, and it costs nothing in accuracy: the words are
 * the same governed catalog strings either way.
 *
 * The figure is drawn, not photographed, on purpose. A photographed face is a face — a
 * particular age, a particular skin — and this app is for whoever is holding it. A drop of
 * light belongs to nobody and so belongs to everyone.
 */
import type { ReactNode } from 'react';

export type CompanionMood = 'calm' | 'speaking' | 'pleased';

export function Companion({ mood = 'calm', size = 96 }: { mood?: CompanionMood; size?: number }) {
  return (
    <svg
      className={`companion companion--${mood}`}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      {/* The drop. */}
      <path
        className="companion__body"
        d="M60 14c14 20 30 34 30 52a30 30 0 0 1-60 0c0-18 16-32 30-52z"
      />
      {/* A highlight, so it reads as something with light in it rather than a flat shape. */}
      <ellipse className="companion__gleam" cx="47" cy="60" rx="8" ry="12" />
      <circle className="companion__eye" cx="50" cy="70" r="3.4" />
      <circle className="companion__eye" cx="70" cy="70" r="3.4" />
      <path className="companion__smile" d="M52 80c3 3.4 13 3.4 16 0" />
    </svg>
  );
}

/**
 * A line said by the companion. `children` rather than a string, so a caller can put a
 * `ReadAloud` control or an emphasised span inside without this component knowing about them.
 */
export function SpeechBubble({ children }: { children: ReactNode }) {
  return <div className="bubble">{children}</div>;
}

/** The companion with its bubble beside it — the arrangement used on nearly every quest screen. */
export function CompanionSays({
  children,
  mood = 'speaking',
  size = 72,
}: {
  children: ReactNode;
  mood?: CompanionMood;
  size?: number;
}) {
  return (
    <div className="says">
      <Companion mood={mood} size={size} />
      <SpeechBubble>{children}</SpeechBubble>
    </div>
  );
}
