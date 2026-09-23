/**
 * The skin map and the routine diagram.
 *
 * Both are drawn from what the reader answered and from governed records — not decoration
 * dropped on top. The map lights the region someone said they were looking at; the routine
 * diagram draws the one Approved sequence in the database, splitting it on the arrow the
 * record itself uses rather than on a list written here.
 *
 * Drawn rather than photographed, for the same reason the companion is: a photograph of a face
 * is a particular age and a particular skin, and the reader supplies both.
 */

export type SkinRegion = 'face' | 'body' | 'hair';

const REGION_LABEL_ID = 'skinmap-title';

/**
 * A figure with three regions. `active` is the region the reader named; the others stay drawn
 * but quiet, so the map reads as "here is you, and this is where you were looking".
 */
export function SkinMap({
  active,
  title,
  size = 150,
}: {
  active: SkinRegion | null;
  title: string;
  size?: number;
}) {
  const on = (region: SkinRegion) => (active === region ? ' is-active' : '');
  return (
    <svg
      className="skinmap"
      width={size}
      height={size * 1.25}
      viewBox="0 0 120 150"
      role="img"
      aria-labelledby={REGION_LABEL_ID}
    >
      <title id={REGION_LABEL_ID}>{title}</title>

      {/* A soft halo behind the figure, so she sits on the page rather than floating on it. */}
      <ellipse className="skinmap__halo" cx="60" cy="62" rx="46" ry="52" />

      {/* Hair behind the head. Drawn first so the face overlaps it, which is what gives the
          hairline its shape instead of a hard line across the forehead. */}
      <path
        className={`skinmap__part skinmap__hair${on('hair')}`}
        d="M60 12c-18 0-29 13-29 30 0 9 1 17 0 25 -1 7-3 12-5 17 5 2 11 3 16 3
           -2-8-3-17-3-25 0-7 0-14 1-21 1-14 8-22 20-22s19 8 20 22c1 7 1 14 1 21
           0 8-1 17-3 25 5 0 11-1 16-3 -2-5-4-10-5-17 -1-8 0-16 0-25 0-17-11-30-29-30z"
      />

      {/* Shoulders and torso. */}
      <path
        className={`skinmap__part skinmap__body${on('body')}`}
        d="M60 82c-17 0-29 9-32 23l-4 26c-1 7 3 12 9 12h54c6 0 10-5 9-12l-4-26c-3-14-15-23-32-23z"
      />

      {/* Neck, then the face on top. */}
      <path className="skinmap__part skinmap__neck" d="M52 66h16v14c0 4-4 7-8 7s-8-3-8-7z" />
      <path
        className={`skinmap__part skinmap__face${on('face')}`}
        d="M60 20c-13 0-21 9-21 23 0 7 1 14 4 20 3 7 9 12 17 12s14-5 17-12c3-6 4-13 4-20
           0-14-8-23-21-23z"
      />

      {/* A face, not an oval. Two eyes and a mouth are what make this read as a person at
         40px on a phone — and the reader is here to look at her own face. */}
      <g className="skinmap__features" aria-hidden="true">
        <path d="M49 40c2.5-2 6-2 8.5 0M62.5 40c2.5-2 6-2 8.5 0" />
        <circle className="skinmap__eye" cx="53" cy="47" r="2.1" />
        <circle className="skinmap__eye" cx="67" cy="47" r="2.1" />
        <path d="M56 61c2.5 2 5.5 2 8 0" />
      </g>
    </svg>
  );
}

/**
 * The approved routine, drawn as the steps it names.
 *
 * `Default_Sequence` is one governed string joined by arrows ("정돈 → 선택적 트리트먼트 → 보습
 * → 자외선 보호"). Splitting it is presentation; the words are the record's own, in its own
 * order, and nothing is added to them.
 */
export function RoutineDiagram({ sequence }: { sequence: string }) {
  const steps = sequence
    .split(/[→➜>]/)
    .map((step) => step.trim())
    .filter(Boolean);

  if (steps.length < 2) return <p className="record-block__sequence">{sequence}</p>;

  return (
    <ol className="routine-steps" role="list">
      {steps.map((step, index) => (
        <li className="routine-step" key={step}>
          <span className="routine-step__dot" aria-hidden="true">
            {index + 1}
          </span>
          <span className="routine-step__label">{step}</span>
        </li>
      ))}
    </ol>
  );
}
