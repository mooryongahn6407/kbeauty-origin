/**
 * Read-aloud tests.
 *
 * The part worth testing is the ranking: which of a device's voices is chosen, and when the
 * honest answer is "none of them". Everything else in `src/ui/speech.ts` is a thin call into
 * the browser API.
 *
 * The voice lists below are real ones — the names macOS, Windows and Chrome actually report —
 * because a ranking that only works on an invented list is not a ranking.
 */
import { describe, expect, it } from 'vitest';
import {
  SPEECH_RATE,
  pickVoice,
  rankVoices,
  scoreVoice,
  voicesForLocale,
  type VoiceLike,
} from '@/ui/speech';

const voice = (
  name: string,
  lang: string,
  localService = true,
  isDefault = false,
): VoiceLike => ({ name, lang, localService, default: isDefault });

/** A macOS-shaped list: enhanced voices, plain voices and the novelty ones, all mixed. */
const MAC: readonly VoiceLike[] = [
  voice('Thomas', 'fr-FR'),
  voice('Amélie (Enhanced)', 'fr-CA'),
  voice('Audrey (Premium)', 'fr-FR'),
  voice('Bad News', 'en-US'),
  voice('Samantha', 'en-US', true, true),
  voice('Albert', 'en-US'),
  voice('Yuna', 'ko-KR'),
  voice('Sora (Enhanced)', 'ko-KR'),
];

/** A Chrome-on-Android-shaped list: network voices, region variants, no novelty ones. */
const CHROME: readonly VoiceLike[] = [
  voice('Google français', 'fr-FR', false),
  voice('Google US English', 'en-US', false, true),
  voice('Google 한국의', 'ko-KR', false),
  voice('Microsoft Denise Online (Natural) - French (France)', 'fr-FR', false),
];

describe('finding voices for a language', () => {
  it('matches on the language, not the region', () => {
    const french = voicesForLocale(MAC, 'fr');
    expect(french.map((v) => v.name)).toEqual([
      'Thomas',
      'Amélie (Enhanced)',
      'Audrey (Premium)',
    ]);
  });

  it('returns nothing for a language the device has no voice for', () => {
    // Lao is the Master Database's launch language and the least likely to have a voice.
    expect(voicesForLocale(MAC, 'lo')).toEqual([]);
    expect(pickVoice(MAC, 'lo')).toBeNull();
  });

  it('returns nothing rather than guessing when the locale is empty', () => {
    expect(pickVoice(MAC, '')).toBeNull();
  });
});

describe('picking the best voice', () => {
  it('prefers a vendor-enhanced voice over a plain one', () => {
    expect(pickVoice(MAC, 'fr')?.name).toBe('Audrey (Premium)');
  });

  it('prefers the exact region when quality is otherwise equal', () => {
    const both = [voice('Marie (Premium)', 'fr-CA'), voice('Audrey (Premium)', 'fr-FR')];
    expect(pickVoice(both, 'fr-FR')?.name).toBe('Audrey (Premium)');
  });

  it('never picks a novelty or low-bandwidth voice when anything else exists', () => {
    const list = [voice('Bad News', 'en-US'), voice('Samantha', 'en-US')];
    expect(pickVoice(list, 'en')?.name).toBe('Samantha');
    expect(scoreVoice(voice('Zarvox', 'en-US'), 'en')).toBeLessThan(
      scoreVoice(voice('Samantha', 'en-US'), 'en'),
    );
    expect(scoreVoice(voice('Alex (Compact)', 'en-US'), 'en')).toBeLessThan(
      scoreVoice(voice('Alex', 'en-US'), 'en'),
    );
  });

  it('picks a novelty voice only when the device offers nothing else', () => {
    // A poor voice still beats silence, and silence would look like a broken button.
    expect(pickVoice([voice('Bad News', 'en-US')], 'en')?.name).toBe('Bad News');
  });

  it('handles the vendor labels a real browser reports', () => {
    expect(pickVoice(CHROME, 'fr')?.name).toContain('Natural');
    expect(pickVoice(CHROME, 'ko')?.name).toBe('Google 한국의');
  });

  it('prefers a device-local voice when quality markers tie', () => {
    const list = [voice('Google français', 'fr-FR', false), voice('Google Français', 'fr-FR', true)];
    // Identical names bar case, so only localService separates them: the offline one wins,
    // and the text never leaves the device.
    expect(pickVoice(list, 'fr')?.localService).toBe(true);
  });

  it('ranks the whole list for a voice picker, best first', () => {
    const ranked = rankVoices(MAC, 'fr').map((v) => v.name);
    expect(ranked[0]).toBe('Audrey (Premium)');
    expect(ranked).toHaveLength(3);
    expect(ranked).toContain('Thomas');
  });

  it('tolerates an underscore-form language tag', () => {
    expect(pickVoice([voice('Thomas', 'fr_FR')], 'fr')?.name).toBe('Thomas');
  });
});

describe('the reading itself', () => {
  it('reads a little slower than the browser default', () => {
    // Learning material, often in the listener's second or third language.
    expect(SPEECH_RATE).toBeLessThan(1);
    expect(SPEECH_RATE).toBeGreaterThan(0.8);
  });

  it('covers every locale that has a UI catalog with a plausible device voice', async () => {
    const { UI_CATALOG_LOCALES } = await import('@/localization/messages');
    const device = [...MAC, ...CHROME];
    for (const locale of UI_CATALOG_LOCALES) {
      // en, ko and fr are the three catalogs; a typical device has a voice for each, and the
      // picker must find one rather than falling back to another language.
      const picked = pickVoice(device, locale);
      expect(picked, locale).not.toBeNull();
      expect(picked!.lang.slice(0, 2), locale).toBe(locale);
    }
  });
});
