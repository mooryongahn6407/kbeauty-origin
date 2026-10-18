/**
 * "Delete my data on this phone".
 *
 * Everything this app keeps about a reader lives in this browser's storage: care-quest answers
 * (which can include pregnancy, breastfeeding, age and skin condition), quest history and
 * progress, the mastery ledger, the review schedule, the collection, avoid-list, help-desk
 * counter, partner code, language and display/voice settings. A reader must be able to remove
 * all of it from the device in one step.
 *
 * The keys are listed here by name, and a test scans `src/` for every `korea-glow…` storage key
 * so a new one cannot be added without landing in this list. As a second net, any other key
 * that starts with the app's own prefix is removed too — but never a key belonging to anything
 * else on the same origin.
 *
 * Every storage call is guarded: a private window or blocked site data must not turn "delete"
 * into a crash.
 */

/** localStorage keys this app writes. */
export const LOCAL_STORAGE_KEYS: readonly string[] = [
  'korea-glow:care-quest:v1',
  'korea-glow:care-quest:progress:v1',
  'korea-glow:care-quest:history:v1',
  'korea-glow:mastery:v1',
  'korea-glow:review:v1',
  'korea-glow:collection:v1',
  'korea-glow:academy:v1',
  'korea-glow:partner:v1',
  'korea-glow:avoid:v1',
  'korea-glow:inquiry:v1',
  'korea-glow:help-desk:v1',
  'korea-glow:button-guide:v1',
  'korea-glow:locale:v1',
  'korea-glow:like:v1',
  'korea-glow.display',
  'korea-glow.voice',
];

/** sessionStorage keys this app writes. */
export const SESSION_STORAGE_KEYS: readonly string[] = ['korea-glow:partner-report-key'];

/** The app's own prefix. Keys of other apps on the same origin never start with it. */
const OWN_PREFIX = 'korea-glow';

type ClearableStore = Pick<Storage, 'removeItem' | 'key' | 'length'>;

function clearStore(store: ClearableStore | undefined, named: readonly string[]): number {
  if (!store) return 0;
  const doomed = new Set(named);
  try {
    for (let index = 0; index < store.length; index += 1) {
      const key = store.key(index);
      if (key !== null && key.startsWith(OWN_PREFIX)) doomed.add(key);
    }
  } catch {
    // Enumeration blocked: the named keys are still attempted below.
  }
  let removed = 0;
  for (const key of doomed) {
    try {
      store.removeItem(key);
      removed += 1;
    } catch {
      // One key failing must not stop the rest.
    }
  }
  return removed;
}

/** Removes every key this app owns from both stores. Returns how many removals were attempted successfully. */
export function clearDeviceData(
  local: ClearableStore | undefined,
  session: ClearableStore | undefined,
): number {
  return clearStore(local, LOCAL_STORAGE_KEYS) + clearStore(session, SESSION_STORAGE_KEYS);
}

const safe = (pick: () => Storage | undefined): Storage | undefined => {
  try {
    return pick();
  } catch {
    return undefined;
  }
};

/** The browser's own stores, or undefined where access itself throws. */
export const browserStores = (): { local: Storage | undefined; session: Storage | undefined } => ({
  local: safe(() => (typeof localStorage === 'undefined' ? undefined : localStorage)),
  session: safe(() => (typeof sessionStorage === 'undefined' ? undefined : sessionStorage)),
});
