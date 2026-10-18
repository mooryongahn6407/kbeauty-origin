/**
 * "Other KOREA GLOW apps" — in Settings, and as small links at the very end of a skin-game
 * result. Each address was checked to answer 200 before it was listed (2026-10-18). The shop is
 * named as a shop, so nobody mistakes it for part of the class: education outranks commerce
 * (rule 6), and the shop is never the first link.
 */
import { inLocale } from '@/content/care-quest/types';
import { CHROME } from '../chrome-text';
import { Icon } from './AppChrome';

const t = (key: keyof typeof CHROME, locale: string) => inLocale(CHROME[key]!, locale);

export const OTHER_APPS: readonly { readonly url: string; readonly label: keyof typeof CHROME }[] = [
  { url: 'https://laobridge.korea-glow.com/', label: 'appLaoBridge' },
  { url: 'https://buy.korea-glow.com/', label: 'appSmartBuy' },
  { url: 'https://korea-glow.com/', label: 'appOfficial' },
];

/** The rows inside Settings' "Other KOREA GLOW apps" list. */
export function OtherAppItems({ locale }: { locale: string }) {
  return (
    <>
      {OTHER_APPS.map((app) => (
        <li key={app.url}>
          <a className="kg-setting__btn" href={app.url} target="_blank" rel="noopener noreferrer">
            <Icon name="external" />
            {t(app.label, locale)}
          </a>
        </li>
      ))}
    </>
  );
}

/** A small, quiet block of the same links — for the end of a result. */
export function OtherAppLinks({ locale }: { locale: string }) {
  return (
    <nav className="kg-otherapps" aria-label={t('sApps', locale)}>
      <p className="kg-otherapps__title">{t('sApps', locale)}</p>
      <ul className="kg-otherapps__list" role="list">
        {OTHER_APPS.map((app) => (
          <li key={app.url}>
            <a className="kg-otherapps__link" href={app.url} target="_blank" rel="noopener noreferrer">
              {t(app.label, locale)}
              <Icon name="external" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
