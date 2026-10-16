/// <reference types="vite/client" />
/**
 * Registers the service worker and tells the app when a new version is waiting
 * (KG-APP-BASE §4: "A new version is ready · Update now" — no reinstalling the app).
 * Off in development, so `npm run dev` never caches anything.
 */
type Listener = (ready: boolean) => void;

let waiting: ServiceWorker | null = null;
const listeners = new Set<Listener>();
const announce = () => listeners.forEach((listener) => listener(waiting !== null));

export function onUpdateReady(listener: Listener): () => void {
  listeners.add(listener);
  listener(waiting !== null);
  return () => listeners.delete(listener);
}

function watch(registration: ServiceWorkerRegistration) {
  const track = (worker: ServiceWorker | null) => {
    if (!worker) return;
    worker.addEventListener('statechange', () => {
      if (worker.state === 'installed' && navigator.serviceWorker.controller) {
        waiting = worker;
        announce();
      }
    });
  };
  if (registration.waiting && navigator.serviceWorker.controller) {
    waiting = registration.waiting;
    announce();
  }
  track(registration.installing);
  registration.addEventListener('updatefound', () => track(registration.installing));
}

let registration: ServiceWorkerRegistration | null = null;

export function registerServiceWorker(): void {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
  if (import.meta.env.DEV) return;
  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) return;
    reloading = true;
    window.location.reload();
  });
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`)
      .then((reg) => {
        registration = reg;
        watch(reg);
      })
      .catch(() => undefined);
  });
}

/** "Check for a new version" in Settings. Resolves true when one is waiting. */
export async function checkForUpdate(): Promise<boolean> {
  try {
    await registration?.update();
  } catch {
    // Offline: nothing new can be found anyway.
  }
  return waiting !== null;
}

/** "Update now": hand over to the waiting version; the page reloads on controllerchange. */
export function applyUpdate(): void {
  if (waiting) waiting.postMessage('SKIP_WAITING');
  else window.location.reload();
}
