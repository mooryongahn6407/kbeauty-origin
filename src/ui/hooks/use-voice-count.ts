/**
 * How many speech voices the device currently reports.
 *
 * Chrome (desktop and Android) populates its voice list asynchronously: `getVoices()` returns
 * an empty array on first call and fires `voiceschanged` once the real list is ready, sometimes
 * a noticeable moment later. Any component that decides "this device has no voice for X" from
 * `getVoices()` at render time has to re-render when that event fires, or it can freeze on a
 * false "no voice" from the instant before the browser finished loading its own voice list —
 * and, for a control with no other reason to re-render, stay frozen that way for the rest of
 * the visit. `ReadAloud` and `VoiceSwitch` both decide that; both use this hook so the device's
 * answer about its own voices is read in exactly one place.
 */
import { useEffect, useState } from 'react';
import { availableVoices, speechSupported } from '../speech';

export function useVoiceCount(): number {
  const [count, setCount] = useState(() => availableVoices().length);

  useEffect(() => {
    if (!speechSupported()) return undefined;
    const onVoices = () => setCount(availableVoices().length);
    globalThis.speechSynthesis.addEventListener('voiceschanged', onVoices);
    onVoices();
    return () => globalThis.speechSynthesis.removeEventListener('voiceschanged', onVoices);
  }, []);

  return count;
}
