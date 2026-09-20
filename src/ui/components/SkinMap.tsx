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

      {/* hair / scalp */}
      <path
        className={`skinmap__part skinmap__hair${on('hair')}`}
        d="M60 8c-16 0-26 11-26 25 0 5 1 9 2 12 1-9 5-16 11-19 5 7 20 9 30 4 3 3 5 8 6 15 1-3 3-7 3-12 0-14-10-25-26-25z"
      />
      {/* face */}
      <ellipse className={`skinmap__part skinmap__face${on('face')}`} cx="60" cy="47" rx="20" ry="24" />
      {/* neck */}
      <rect className="skinmap__part skinmap__neck" x="53" y="68" width="14" height="10" rx="4" />
      {/* body */}
      <path
        className={`skinmap__part skinmap__body${on('body')}`}
        d="M60 76c-14 0-24 7-26 18l-4 26c-1 6 2 10 7 10h46c5 0 8-4 7-10l-4-26c-2-11-12-18-26-18z"
      />
      <path className="skinmap__part skinmap__body-arm" d="M32 96l-9 26M88 96l9 26" />
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
