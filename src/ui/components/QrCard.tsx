/**
 * A link drawn as a QR code, with a caption and a button that saves it as a PNG.
 *
 * Black on white in both themes (scanners need the contrast; the colours are the `--qr-*`
 * tokens), computed on this device from the link text alone — see `src/app/qr.ts`.
 */
import { useMemo } from 'react';
import { translate } from '@/localization/messages';
import { QUIET_ZONE, qrMatrix, qrPath, qrPngDataUrl } from '@/app/qr';

export function QrCard({
  link,
  fileName,
  label,
  caption,
  locale,
}: {
  link: string;
  /** Without extension; ".png" is added. */
  fileName: string;
  /** What the code opens, for a screen reader. */
  label: string;
  caption: string;
  locale: string;
}) {
  const matrix = useMemo(() => qrMatrix(link), [link]);
  const side = matrix.length + QUIET_ZONE * 2;

  const save = () => {
    const tokens = getComputedStyle(document.documentElement);
    const url = qrPngDataUrl(
      matrix,
      tokens.getPropertyValue('--qr-ink').trim(),
      tokens.getPropertyValue('--qr-paper').trim(),
    );
    if (!url) return;
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${fileName}.png`;
    anchor.click();
  };

  return (
    <figure className="store-qr">
      <svg
        className="store-qr__code"
        viewBox={`${-QUIET_ZONE} ${-QUIET_ZONE} ${side} ${side}`}
        role="img"
        aria-label={label}
        shapeRendering="crispEdges"
      >
        <rect
          className="store-qr__paper"
          x={-QUIET_ZONE}
          y={-QUIET_ZONE}
          width={side}
          height={side}
        />
        <path className="store-qr__ink" d={qrPath(matrix)} />
      </svg>
      <figcaption className="store-qr__caption">{caption}</figcaption>
      <button type="button" className="btn btn--quiet btn--small" onClick={save}>
        ⬇ {translate('store.qrSave', locale)}
      </button>
    </figure>
  );
}
