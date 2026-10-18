/**
 * What the address a reader arrived with asks for — read before anything heavy has loaded.
 *
 * These checks used to live beside the catalog and the skin game, which meant the first screen
 * had to download every product and every question just to read `?play` or `?product=`. They
 * only need the shapes, so they live here, in a file that imports nothing.
 * `tests/entry-links.test.ts` keeps TRACK_IDS equal to the real tracks.
 */
import type { TrackId } from '@/content/care-quest/types';

export const TRACK_IDS: readonly TrackId[] = ['face', 'scalp', 'body'];
export const PRODUCT_PARAM = 'product';
export const SKU_SHAPE = /^KG-[A-Z]{3}-\d{5}$/;

/**
 * The game door: `?play` (what play.korea-glow.com forwards to) opens the face track's first
 * question; `?play=scalp` / `?play=body` open those tracks. Anything else is no door.
 */
export function playTrackFromSearch(search: string): TrackId | null {
  try {
    const params = new URLSearchParams(search);
    if (!params.has('play')) return null;
    const raw = params.get('play')?.trim().toLowerCase() || 'face';
    return (TRACK_IDS as readonly string[]).includes(raw) ? (raw as TrackId) : null;
  } catch {
    return null;
  }
}

/** A well-formed `?product=` code. Whether that product exists is the catalog's question. */
export function productShapeFromSearch(search: string): string | null {
  try {
    const raw = new URLSearchParams(search).get(PRODUCT_PARAM)?.trim().toUpperCase() ?? '';
    return SKU_SHAPE.test(raw) ? raw : null;
  } catch {
    return null;
  }
}

const QUEST_KEYS = ['korea-glow:care-quest:v1', 'korea-glow:care-quest:progress:v1'];

/** True when this phone has played the skin game before (a saved result or a half-done track). */
export function hasPlayedBefore(storage: Pick<Storage, 'getItem'> | undefined): boolean {
  try {
    return QUEST_KEYS.some((key) => Boolean(storage?.getItem(key)));
  } catch {
    return false;
  }
}

/** A finished result is saved on this phone. */
export function hasSavedResult(storage: Pick<Storage, 'getItem'> | undefined): boolean {
  try {
    const raw = storage?.getItem(QUEST_KEYS[0]!);
    return Boolean(raw && raw !== '{}');
  } catch {
    return false;
  }
}

/** A track was left half-way on this phone. */
export function hasProgress(storage: Pick<Storage, 'getItem'> | undefined): boolean {
  try {
    return Boolean(storage?.getItem(QUEST_KEYS[1]!));
  } catch {
    return false;
  }
}
