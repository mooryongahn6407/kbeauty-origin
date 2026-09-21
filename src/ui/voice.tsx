/**
 * The master voice switch.
 *
 * `ReadAloud` has always been able to speak a passage, but it sat beside the passage — which
 * means a reader had to scroll to a control they did not know existed, in an app whose whole
 * promise is that you do not need to already know things. For a Vientiane customer meeting this
 * app on a phone, in a language whose written form they read more slowly than they hear it,
 * that control being one screen down is the same as it not being there.
 *
 * So there is one switch, at the top, on every screen, that says in words what it does and how
 * to turn it off. When it is on, the main passage of whatever screen you are on is read aloud
 * as it appears; when it is off nothing speaks. It is one boolean — deliberately not a set of
 * per-screen options — because the person it is for is not going to configure anything.
 *
 * Two constraints it inherits unchanged from `src/ui/speech.ts`, neither of which this file
 * relaxes: nothing is ever spoken that is not already on the screen, and no language is ever
 * read in a voice that cannot pronounce it. The switch decides *whether* to speak, never
 * *what*.
 *
 * Browsers require a user gesture before the first utterance of a page. Pressing the switch is
 * that gesture, so turning it on works immediately. Arriving with it already on from a previous
 * visit may stay silent until the first tap anywhere — which is why the control states its own
 * state in words rather than relying on the reader hearing something.
 */
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'korea-glow.voice';

/** Off by default: sound that starts by itself on a first visit is startling, not helpful. */
export const VOICE_DEFAULT = false;

export function parseVoiceSetting(raw: string | null): boolean {
  return raw === 'on' ? true : raw === 'off' ? false : VOICE_DEFAULT;
}

export function loadVoiceSetting(): boolean {
  try {
    return parseVoiceSetting(globalThis.localStorage?.getItem(STORAGE_KEY) ?? null);
  } catch {
    return VOICE_DEFAULT;
  }
}

export function saveVoiceSetting(on: boolean): void {
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, on ? 'on' : 'off');
  } catch {
    // Storage blocked. The setting still holds for this visit.
  }
}

interface VoiceContextValue {
  readonly on: boolean;
  readonly toggle: () => void;
}

/** Defaults to off with a no-op toggle, so a component rendered outside the provider is inert. */
const VoiceContext = createContext<VoiceContextValue>({ on: VOICE_DEFAULT, toggle: () => {} });

export function VoiceProvider({ children }: { children: ReactNode }) {
  const [on, setOn] = useState(loadVoiceSetting);

  useEffect(() => {
    saveVoiceSetting(on);
  }, [on]);

  const toggle = useCallback(() => setOn((current) => !current), []);

  return <VoiceContext.Provider value={{ on, toggle }}>{children}</VoiceContext.Provider>;
}

export const useVoice = (): VoiceContextValue => useContext(VoiceContext);
