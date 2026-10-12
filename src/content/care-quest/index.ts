/** The three Care Quest tracks, in the order the owner set: face, then scalp & hair, then body. */
import { FACE_TRACK } from './face';
import type { CareTrack, TrackId } from './types';

export const CARE_TRACKS: readonly CareTrack[] = [FACE_TRACK];

export const careTrack = (id: TrackId): CareTrack | undefined =>
  CARE_TRACKS.find((track) => track.id === id);
