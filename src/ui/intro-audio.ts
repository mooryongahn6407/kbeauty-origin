/**
 * Play one recorded intro sentence on an audio element and report exactly one outcome:
 * - `onEnd`: the sentence finished (the subtitle moves on);
 * - `onBlocked`: the browser refused to play before the reader touched the page — the subtitles
 *   carry on and the «Turn on sound» button appears, as with the device voice;
 * - `onFail`: the file could not be loaded or played — the caller falls back to the device voice.
 * The returned function stops the clip and silences every later event from it.
 */
export interface ClipElement {
  src: string;
  readonly duration: number;
  play(): Promise<void> | void;
  pause(): void;
  addEventListener(type: string, listener: () => void): void;
  removeEventListener(type: string, listener: () => void): void;
}

export interface ClipHandlers {
  readonly onEnd: () => void;
  readonly onBlocked: () => void;
  readonly onFail: () => void;
  /** The clip's length in seconds, once the browser knows it. */
  readonly onDuration?: (seconds: number) => void;
}

export function playClip(element: ClipElement, url: string, handlers: ClipHandlers): () => void {
  let live = true;
  const detach = () => {
    element.removeEventListener('ended', ended);
    element.removeEventListener('error', failed);
    element.removeEventListener('loadedmetadata', meta);
  };
  const settle = (outcome: () => void) => {
    if (!live) return;
    live = false;
    detach();
    outcome();
  };
  function ended() {
    settle(handlers.onEnd);
  }
  function failed() {
    settle(handlers.onFail);
  }
  function meta() {
    if (live && Number.isFinite(element.duration) && element.duration > 0) handlers.onDuration?.(element.duration);
  }
  element.addEventListener('ended', ended);
  element.addEventListener('error', failed);
  element.addEventListener('loadedmetadata', meta);
  try {
    element.src = url;
    const started = element.play();
    if (started && typeof started.then === 'function') {
      started.catch((error: unknown) => {
        const name = (error as { name?: string } | null)?.name;
        if (name === 'NotAllowedError') settle(handlers.onBlocked);
        else if (name !== 'AbortError') settle(handlers.onFail); // AbortError: we stopped it ourselves
      });
    }
  } catch {
    settle(handlers.onFail);
  }
  return () => {
    if (live) {
      live = false;
      detach();
    }
    try {
      element.pause();
    } catch {
      // Nothing to stop.
    }
  };
}
