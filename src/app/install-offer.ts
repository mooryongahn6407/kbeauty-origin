/**
 * «Save the icon to your home screen» is offered at most once per visit.
 *
 * Two places can offer it: the compact strip on the first screen (GlowHero `InstallStrip`) and
 * the sheet after the first quest result (CareQuestScreen). Whichever comes first this visit
 * owns the offer; the other stays quiet until the next visit. A visit is this tab's session
 * (sessionStorage), with an in-memory copy for private windows where storage throws.
 */
export type InstallOfferSource = 'strip' | 'sheet';

export const INSTALL_OFFER_VISIT_KEY = 'korea-glow:install-offered:visit';

let offeredBy: InstallOfferSource | null = null;

const session = (): Storage | undefined => {
  try {
    return typeof sessionStorage === 'undefined' ? undefined : sessionStorage;
  } catch {
    return undefined;
  }
};

/** Which offer, if any, has already been shown on this visit. */
export function installOfferedThisVisit(store: Storage | undefined = session()): InstallOfferSource | null {
  if (offeredBy) return offeredBy;
  try {
    const value = store?.getItem(INSTALL_OFFER_VISIT_KEY);
    return value === 'strip' || value === 'sheet' ? value : null;
  } catch {
    return null;
  }
}

/** True when `source` may show the offer now: nothing shown yet this visit, or it was this one. */
export function mayOfferInstall(source: InstallOfferSource, store: Storage | undefined = session()): boolean {
  const already = installOfferedThisVisit(store);
  return already === null || already === source;
}

export function markInstallOffered(source: InstallOfferSource, store: Storage | undefined = session()): void {
  if (installOfferedThisVisit(store)) return;
  offeredBy = source;
  try {
    store?.setItem(INSTALL_OFFER_VISIT_KEY, source);
  } catch {
    // Private window: the in-memory copy covers this visit.
  }
}

/** Tests only. */
export function resetInstallOfferForTests(): void {
  offeredBy = null;
}
