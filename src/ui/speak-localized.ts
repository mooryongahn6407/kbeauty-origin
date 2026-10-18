/**
 * Speak a short line the app has in several languages, in the reader's language — or, when her
 * device has no voice for it, in the language that may speak for it (Lao → Thai), reading that
 * language's own translation, never the original script (rule 15). False when nothing was said.
 */
import { inLocale, type Localized } from '@/content/care-quest/types';
import { availableVoices, planSpeech, speak, speechSupported, type SpeakOptions } from './speech';

export function speakLocalized(text: Localized, locale: string, options: SpeakOptions = {}): boolean {
  try {
    if (!speechSupported()) return false;
    const available = Object.entries(text)
      .filter(([, value]) => typeof value === 'string' && value.trim() !== '')
      .map(([tag]) => tag);
    const plan = planSpeech(availableVoices(), locale, available);
    if (!plan.voice) return false;
    return speak(inLocale(text, plan.spokenLocale), plan.spokenLocale, { ...options, voice: plan.voice });
  } catch {
    return false;
  }
}
