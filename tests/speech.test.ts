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
  SPOKEN_FALLBACK,
  pickVoice,
  planSpeech,
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

  it('either finds a voice for the right language or none at all, for every UI locale', async () => {
    const { UI_CATALOG_LOCALES } = await import('@/localization/messages');
    const device = [...MAC, ...CHROME];
    for (const locale of UI_CATALOG_LOCALES) {
      const picked = pickVoice(device, locale);
      // The only two acceptable answers. What must never happen is a voice for a *different*
      // language, which is what a naive "use the default voice" fallback would give.
      if (picked !== null) expect(picked.lang.slice(0, 2), locale).toBe(locale);
    }
  });

  it('has no voice for Lao on a typical device, and says so rather than substituting', async () => {
    // Lao is LOC-003, the Master Database's launch language, and the locale least likely to
    // have a system voice anywhere. Adding a UI catalog for a language does not conjure a voice
    // for it, and the control must report that rather than read Lao text in a Thai or English
    // voice. This is the case the whole null-return contract exists for.
    const { UI_CATALOG_LOCALES } = await import('@/localization/messages');
    expect(UI_CATALOG_LOCALES).toContain('lo');
    expect(pickVoice([...MAC, ...CHROME], 'lo')).toBeNull();
    // Thai is the nearest neighbouring script and must not stand in for it.
    expect(pickVoice([voice('Kanya', 'th-TH')], 'lo')).toBeNull();
  });

  it('finds a Lao voice when the device genuinely has one', async () => {
    // Some Android builds do ship one. Nothing about the null case should block that.
    const withLao = [...MAC, voice('Google ລາວ', 'lo-LA', false)];
    expect(pickVoice(withLao, 'lo')?.lang).toBe('lo-LA');
  });
});

/**
 * The Lao-speaks-Thai fallback.
 *
 * The owner's instruction, verbatim: Lao script can be written (the UI catalog exists), Lao
 * voices essentially do not exist on real devices, and Thai is close enough that a Lao reader
 * commonly follows it — so speech falls back to the app's own Thai translation, read by a Thai
 * voice. Never Lao text through a Thai engine: the scripts differ and that would not work at
 * all, let alone correctly.
 */
describe('the Lao voice fallback', () => {
  it('is registered as Lao \u2192 Thai, and nothing else', () => {
    expect(SPOKEN_FALLBACK).toEqual({ lo: 'th' });
  });

  it('speaks the Thai text with a Thai voice when the device has no Lao voice', () => {
    const device = [...MAC, voice('Kanya', 'th-TH')];
    const plan = planSpeech(device, 'lo', ['lo', 'th']);
    expect(plan.spokenLocale).toBe('th');
    expect(plan.isSubstitute).toBe(true);
    expect(plan.voice?.lang).toBe('th-TH');
  });

  it('prefers a genuine Lao voice over the Thai fallback when the device has one', () => {
    const device = [voice('Google \u0EA5\u0EB2\u0EA7', 'lo-LA', false), voice('Kanya', 'th-TH')];
    const plan = planSpeech(device, 'lo', ['lo', 'th']);
    expect(plan.spokenLocale).toBe('lo');
    expect(plan.isSubstitute).toBe(false);
  });

  it('never hands Lao script to a Thai voice \u2014 the fallback text must be Thai, not Lao', () => {
    // The caller (ReadAloud) is responsible for supplying Thai *text* alongside the Lao text;
    // this only proves the plan names Thai as the language actually spoken, which is the
    // contract the caller relies on to pick the right string.
    const plan = planSpeech([voice('Kanya', 'th-TH')], 'lo', ['lo', 'th']);
    expect(plan.spokenLocale).not.toBe('lo');
  });

  it('reports total unavailability when neither Lao nor Thai has a voice', () => {
    const plan = planSpeech(MAC, 'lo', ['lo', 'th']);
    expect(plan.voice).toBeNull();
  });

  it('does not apply the fallback when the Thai text was never made available', () => {
    // A caller that forgets to pass Thai text must not get Thai audio for it.
    const plan = planSpeech([voice('Kanya', 'th-TH')], 'lo', ['lo']);
    expect(plan.voice).toBeNull();
  });

  it('falls through to the base locale (English) when nothing else is available', () => {
    const plan = planSpeech(MAC, 'lo', ['lo', 'en']);
    expect(plan.spokenLocale).toBe('en');
    expect(plan.isSubstitute).toBe(true);
  });

  it('does not substitute anything for a locale with no declared fallback', () => {
    // fr has no SPOKEN_FALLBACK entry, so with no French voice the only remaining candidate
    // is the base locale \u2014 exercised above for lo; here fr must not reach for th.
    expect(SPOKEN_FALLBACK['fr']).toBeUndefined();
    const plan = planSpeech([voice('Kanya', 'th-TH')], 'fr', ['fr']);
    expect(plan.voice).toBeNull();
  });

  it('needs no substitution at all when the reader has no voice and no fallback text', () => {
    const plan = planSpeech(MAC, 'lo', ['lo']);
    // No Lao voice on MAC and no Thai text offered \u2014 still null, not a silent switch to
    // whatever voice happens to be default.
    expect(plan.voice).toBeNull();
    expect(plan.isSubstitute).toBe(false);
  });

  it('covers Thai itself: a Thai reader gets a Thai voice directly, no fallback involved', () => {
    const plan = planSpeech([voice('Kanya', 'th-TH')], 'th', ['th']);
    expect(plan.spokenLocale).toBe('th');
    expect(plan.isSubstitute).toBe(false);
  });
});
