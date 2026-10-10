/**
 * QR codes for partner links, drawn on the device.
 *
 * A shop prints or shows a product's QR code; a customer scans it and lands on that product's
 * label with the shop's code attached (see `productLink` and `src/app/partner.ts`). The code is
 * computed here from the link text alone — no network service, no account, nothing leaves the
 * phone. Error correction is level M, which survives a little glare on a printed counter card.
 */
import qrcode from 'qrcode-generator';

/** Dark modules, row by row. Square; the side is 21 + 4k modules for version k + 1. */
export function qrMatrix(text: string): readonly (readonly boolean[])[] {
  const code = qrcode(0, 'M');
  code.addData(text, 'Byte');
  code.make();
  const size = code.getModuleCount();
  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) => code.isDark(row, col)),
  );
}

/** One SVG path covering every dark module, in module units (one unit per module). */
export function qrPath(matrix: readonly (readonly boolean[])[]): string {
  const parts: string[] = [];
  matrix.forEach((row, y) =>
    row.forEach((dark, x) => {
      if (dark) parts.push(`M${x} ${y}h1v1h-1z`);
    }),
  );
  return parts.join('');
}

/** Modules of white margin a scanner needs around the code (the standard's quiet zone). */
export const QUIET_ZONE = 4;

/**
 * A PNG of the code, for saving and sending in a chat app. Browser only; `ink` and `paper` are
 * passed in so the colours come from the stylesheet's tokens, not from here.
 */
export function qrPngDataUrl(
  matrix: readonly (readonly boolean[])[],
  ink: string,
  paper: string,
  scale = 12,
): string | null {
  if (typeof document === 'undefined') return null;
  const side = (matrix.length + QUIET_ZONE * 2) * scale;
  const canvas = document.createElement('canvas');
  canvas.width = side;
  canvas.height = side;
  const context = canvas.getContext('2d');
  if (!context) return null;
  context.fillStyle = paper;
  context.fillRect(0, 0, side, side);
  context.fillStyle = ink;
  matrix.forEach((row, y) =>
    row.forEach((dark, x) => {
      if (dark) context.fillRect((x + QUIET_ZONE) * scale, (y + QUIET_ZONE) * scale, scale, scale);
    }),
  );
  return canvas.toDataURL('image/png');
}
