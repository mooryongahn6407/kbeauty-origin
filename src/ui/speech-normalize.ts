/**
 * How the read-aloud voice should *say* the text on screen.
 *
 * A speech engine reads "SPF50+" as "spf fifty", "PA++++" as "pa", "pH" as "ph" and "KOREA GLOW"
 * letter by letter — the exact terms a learner most needs to hear correctly. This module turns
 * the on-screen text into its spoken form, one language at a time, before it reaches the
 * engine. It is pronunciation only: no word is added, removed, summarised or reworded, and the
 * screen still shows the original (speech.ts rule 1). Each rule is a reading of a symbol or an
 * abbreviation — "%" as "percent", "ml" as "millilitres" — never a translation of a term into
 * something else ("UV" is read "U V", not "ultraviolet").
 *
 * Lao has no rules of its own: Lao voices barely exist on devices, and Lao readers hear the
 * app's Thai text through a Thai voice (SPOKEN_FALLBACK), which is normalised as Thai. Any other
 * language falls back to the English readings, which are letter-by-letter and so safe in any
 * Latin-script voice.
 *
 * Also here: splitting a long passage into sentences, so it can be queued one sentence at a
 * time. Some engines stop silently partway through a long utterance.
 */

type Lang = 'en' | 'ko' | 'th' | 'fr';

interface Readings {
  readonly spf: string;
  readonly pa: string;
  /** "{n}" is replaced by how many plus signs: PA+ … PA++++. */
  readonly paPlus: (count: number) => string;
  readonly plus: string;
  readonly aha: string;
  readonly bha: string;
  readonly pha: string;
  readonly uv: string;
  readonly uva: string;
  readonly uvb: string;
  readonly ph: string;
  readonly percent: string;
  readonly kbeauty: string;
  readonly brand: string;
  readonly units: Readonly<Record<Unit, string>>;
}

type Unit = 'ml' | 'mg' | 'kg' | 'g' | 'cm' | 'mm' | 'nm' | 'celsius';

const EN_COUNT = ['', 'one', 'two', 'three', 'four'];
const FR_COUNT = ['', 'un', 'deux', 'trois', 'quatre'];
const KO_COUNT = ['', '한 개', '두 개', '세 개', '네 개'];
const TH_COUNT = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่'];

export const READINGS: Readonly<Record<Lang, Readings>> = {
  en: {
    spf: 'S P F',
    pa: 'P A',
    paPlus: (n) => `P A ${EN_COUNT[n]} plus`,
    plus: 'plus',
    aha: 'A H A',
    bha: 'B H A',
    pha: 'P H A',
    uv: 'U V',
    uva: 'U V A',
    uvb: 'U V B',
    ph: 'P H',
    percent: 'percent',
    kbeauty: 'K beauty',
    brand: 'Korea Glow',
    units: {
      ml: 'millilitres',
      mg: 'milligrams',
      kg: 'kilograms',
      g: 'grams',
      cm: 'centimetres',
      mm: 'millimetres',
      nm: 'nanometres',
      celsius: 'degrees Celsius',
    },
  },
  ko: {
    spf: '에스피에프',
    pa: '피에이',
    paPlus: (n) => `피에이 플러스 ${KO_COUNT[n]}`,
    plus: '플러스',
    aha: '에이에이치에이',
    bha: '비에이치에이',
    pha: '피에이치에이',
    uv: '유브이',
    uva: '유브이에이',
    uvb: '유브이비',
    ph: '피에이치',
    percent: '퍼센트',
    kbeauty: '케이뷰티',
    brand: '코리아 글로우',
    units: {
      ml: '밀리리터',
      mg: '밀리그램',
      kg: '킬로그램',
      g: '그램',
      cm: '센티미터',
      mm: '밀리미터',
      nm: '나노미터',
      celsius: '도',
    },
  },
  th: {
    spf: 'เอสพีเอฟ',
    pa: 'พีเอ',
    paPlus: (n) => `พีเอ บวก${TH_COUNT[n]}`,
    plus: 'พลัส',
    aha: 'เอเอชเอ',
    bha: 'บีเอชเอ',
    pha: 'พีเอชเอ',
    uv: 'ยูวี',
    uva: 'ยูวีเอ',
    uvb: 'ยูวีบี',
    ph: 'พีเอช',
    percent: 'เปอร์เซ็นต์',
    kbeauty: 'เคบิวตี้',
    brand: 'โคเรีย โกลว์',
    units: {
      ml: 'มิลลิลิตร',
      mg: 'มิลลิกรัม',
      kg: 'กิโลกรัม',
      g: 'กรัม',
      cm: 'เซนติเมตร',
      mm: 'มิลลิเมตร',
      nm: 'นาโนเมตร',
      celsius: 'องศาเซลเซียส',
    },
  },
  fr: {
    spf: 'S P F',
    pa: 'P A',
    paPlus: (n) => `P A ${FR_COUNT[n]} plus`,
    plus: 'plus',
    aha: 'A H A',
    bha: 'B H A',
    pha: 'P H A',
    uv: 'U V',
    uva: 'U V A',
    uvb: 'U V B',
    ph: 'P H',
    percent: 'pour cent',
    kbeauty: 'K beauty',
    brand: 'Korea Glow',
    units: {
      ml: 'millilitres',
      mg: 'milligrammes',
      kg: 'kilogrammes',
      g: 'grammes',
      cm: 'centimètres',
      mm: 'millimètres',
      nm: 'nanomètres',
      celsius: 'degrés Celsius',
    },
  },
};

const langOf = (locale: string): Lang => {
  const base = locale.toLowerCase().split(/[-_]/)[0] ?? '';
  return base === 'ko' || base === 'th' || base === 'fr' ? base : 'en';
};

/*
 * Boundaries. JavaScript's \b only knows ASCII word characters, which is what is wanted here:
 * Hangul and Thai count as "not a word character", so "SPF50+는" still finds SPF. The
 * look-ahead stops a match inside a longer Latin word ("UVA" inside "UVAX") while still allowing
 * a digit after it ("pH5.5"). No look-behind anywhere: older iPhones (Safari before 16.4) reject
 * it, and a rejected pattern here would cost the reader the voice.
 */
const L = '\\b';
const R = '(?![A-Za-z])';
const NUM = '(\\d+(?:[.,]\\d+)?)';

/** The spoken form of `text` for a voice speaking `locale`. Pure; never throws. */
export function normalizeForSpeech(text: string, locale: string): string {
  const r = READINGS[langOf(locale)];
  let out = text;

  // Brand and K-beauty first, so their letters are not caught by the rules below.
  out = out.replace(/KOREA\s+GLOW/g, r.brand);
  out = out.replace(new RegExp(`${L}K-?beauty${R}`, 'gi'), r.kbeauty);

  // SPF 50+ / SPF50+ / SPF 30
  out = out.replace(new RegExp(`${L}SPF\\s*(\\d+)\\s*\\+`, 'g'), `${r.spf} $1 ${r.plus}`);
  out = out.replace(new RegExp(`${L}SPF\\s*(\\d+)`, 'g'), `${r.spf} $1`);
  out = out.replace(new RegExp(`${L}SPF${R}`, 'g'), r.spf);

  // PA+ … PA++++ (the count of plus signs is the grade).
  out = out.replace(new RegExp(`${L}PA\\s?(\\+{1,4})(?!\\+)`, 'g'), (_m, plus: string) => r.paPlus(plus.length));

  // Acids and light, longest first so UVA is not read as UV + A.
  out = out.replace(new RegExp(`${L}AHAs?${R}`, 'g'), r.aha);
  out = out.replace(new RegExp(`${L}BHAs?${R}`, 'g'), r.bha);
  out = out.replace(new RegExp(`${L}PHAs?${R}`, 'g'), r.pha);
  out = out.replace(new RegExp(`${L}UVA\\s*/\\s*UVB${R}`, 'g'), `${r.uva}, ${r.uvb}`);
  out = out.replace(new RegExp(`${L}UVA${R}`, 'g'), r.uva);
  out = out.replace(new RegExp(`${L}UVB${R}`, 'g'), r.uvb);
  out = out.replace(new RegExp(`${L}UV${R}`, 'g'), r.uv);
  out = out.replace(new RegExp(`${L}pH${R}`, 'g'), r.ph);

  // Numbers with units. The unit must follow a number, so a stray "g" or "ml" in a word is left.
  out = out.replace(new RegExp(`${NUM}\\s*°\\s*C${R}`, 'g'), `$1 ${r.units.celsius}`);
  out = out.replace(new RegExp(`${NUM}\\s*%`, 'g'), `$1 ${r.percent}`);
  const unitPatterns: readonly [RegExp, Unit][] = [
    [/m[lL]/, 'ml'],
    [/mg/, 'mg'],
    [/kg/, 'kg'],
    [/g/, 'g'],
    [/cm/, 'cm'],
    [/mm/, 'mm'],
    [/nm/, 'nm'],
  ];
  for (const [unit, key] of unitPatterns) {
    out = out.replace(new RegExp(`${NUM}\\s*${unit.source}${R}`, 'g'), `$1 ${r.units[key]}`);
  }
  // A "%" with no number in front ("% shown on the label") is still a word to say.
  out = out.replace(/%/g, ` ${r.percent} `);

  return out.replace(/[ \t]{2,}/g, ' ').trim();
}

/** Longest piece handed to the engine at once. Long single utterances get cut off on some phones. */
export const MAX_CHUNK = 220;

const hardSplit = (piece: string): string[] => {
  if (piece.length <= MAX_CHUNK) return [piece];
  const out: string[] = [];
  let rest = piece;
  while (rest.length > MAX_CHUNK) {
    const window = rest.slice(0, MAX_CHUNK);
    // Prefer a comma, then a space; Thai has spaces between phrases but no full stops.
    const at = Math.max(window.lastIndexOf(', '), window.lastIndexOf('، '), window.lastIndexOf('、'));
    const space = window.lastIndexOf(' ');
    const cut = at > MAX_CHUNK / 3 ? at + 1 : space > MAX_CHUNK / 3 ? space : MAX_CHUNK;
    out.push(rest.slice(0, cut).trim());
    rest = rest.slice(cut).trim();
  }
  if (rest) out.push(rest);
  return out;
};

/**
 * A passage as the sentences it is made of, in order, each short enough to speak in one go.
 * Joining the result with spaces gives back the passage's words unchanged.
 */
export function splitForSpeech(text: string): readonly string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  // A full stop, question or exclamation mark (Latin, CJK or Thai-adjacent) followed by space.
  // "0.5" and "e.g.x" have no space after the dot and stay whole.
  const sentences = trimmed
    .replace(/([.!?…。！？])\s+/g, '$1\u0000')
    .split('\u0000')
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  return sentences.flatMap(hardSplit);
}
