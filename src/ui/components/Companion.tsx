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
import { Lumina, type LuminaMood } from './Lumina';

export type CompanionMood = 'calm' | 'speaking' | 'pleased';

const AS_LUMINA: Readonly<Record<CompanionMood, LuminaMood>> = {
  calm: 'greeting',
  speaking: 'asking',
  pleased: 'pleased',
};

/** The guide, wherever a screen wants one. Every screen asks for her through this. */
export function Companion({ mood = 'calm', size = 96 }: { mood?: CompanionMood; size?: number }) {
  return <Lumina mood={AS_LUMINA[mood]} size={size} />;
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
