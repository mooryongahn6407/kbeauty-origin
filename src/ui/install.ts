/**
 * "Save to home screen" — what the install button can honestly do on this phone.
 *
 * Android/Chrome hands the page a `beforeinstallprompt` event: keep it, and one tap on our button
 * plus one tap on the browser's own "Install" is the whole thing. iPhone Safari has no such event
 * and no way for a page to install itself, so there the button opens two steps of instructions
 * (Share → Add to Home Screen) instead of pretending. Anything else gets the browser-menu hint.
 */

export type InstallMode = 'installed' | 'prompt' | 'ios' | 'manual';

export function installMode(env: {
  readonly standalone: boolean;
  readonly hasPrompt: boolean;
  readonly ios: boolean;
}): InstallMode {
  if (env.standalone) return 'installed';
  if (env.hasPrompt) return 'prompt';
  if (env.ios) return 'ios';
  return 'manual';
}

/** iPhone, iPod, and iPads that now introduce themselves as a Mac with a touch screen. */
export function isIosDevice(userAgent: string, maxTouchPoints: number): boolean {
  if (/iPhone|iPad|iPod/i.test(userAgent)) return true;
  return /Macintosh/i.test(userAgent) && maxTouchPoints > 1;
}

interface DeferredPrompt extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferred: DeferredPrompt | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

// Captured at module load, not when a screen mounts: the browser fires this once, early, and a
// listener added later would never hear it.
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferred = event as DeferredPrompt;
    notify();
  });
  window.addEventListener('appinstalled', () => {
    deferred = null;
    notify();
  });
}

export function currentInstallMode(): InstallMode {
  if (typeof window === 'undefined') return 'manual';
  const standalone =
    window.matchMedia?.('(display-mode: standalone)').matches === true ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return installMode({
    standalone,
    hasPrompt: deferred !== null,
    ios: isIosDevice(navigator.userAgent, navigator.maxTouchPoints ?? 0),
  });
}

/** Shows the browser's own install dialog. Resolves true if the reader accepted. */
export async function promptInstall(): Promise<boolean> {
  if (!deferred) return false;
  const event = deferred;
  deferred = null;
  await event.prompt();
  const choice = await event.userChoice;
  notify();
  return choice.outcome === 'accepted';
}

export function onInstallChange(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
