/**
 * Display settings — theme and text size, in the masthead where they are found without looking.
 *
 * Rendered as segmented controls rather than a menu because there are three options each and
 * the current one should be visible at a glance, not one click away. Every button clears the
 * 44px touch target the design system sets.
 */
import { translate, type MessageKey } from '@/localization/messages';
import {
  THEME_CHOICES,
  TEXT_SIZE_CHOICES,
  type DisplayPreferences,
  type TextSizeChoice,
  type ThemeChoice,
} from '../preferences';

const THEME_LABEL: Readonly<Record<ThemeChoice, MessageKey>> = {
  auto: 'display.theme.auto',
  light: 'display.theme.light',
  dark: 'display.theme.dark',
};

const TEXT_SIZE_LABEL: Readonly<Record<TextSizeChoice, MessageKey>> = {
  normal: 'display.textSize.normal',
  large: 'display.textSize.large',
  larger: 'display.textSize.larger',
};

function Segmented<T extends string>({
  label,
  options,
  value,
  labelFor,
  onChange,
  locale,
}: {
  label: string;
  options: readonly T[];
  value: T;
  labelFor: Readonly<Record<T, MessageKey>>;
  onChange: (next: T) => void;
  locale: string;
}) {
  return (
    <div className="settings__group">
      <span className="settings__label" id={`settings-${label}`}>
        {label}
      </span>
      <div className="segmented" role="group" aria-labelledby={`settings-${label}`}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className="segmented__item"
            aria-pressed={value === option}
            onClick={() => onChange(option)}
          >
            {translate(labelFor[option], locale)}
          </button>
        ))}
      </div>
    </div>
  );
}

export function DisplaySettings({
  preferences,
  onChange,
  locale,
}: {
  preferences: DisplayPreferences;
  onChange: (next: DisplayPreferences) => void;
  locale: string;
}) {
  return (
    <div className="settings">
      <Segmented
        label={translate('display.theme', locale)}
        options={THEME_CHOICES}
        value={preferences.theme}
        labelFor={THEME_LABEL}
        locale={locale}
        onChange={(theme) => onChange({ ...preferences, theme })}
      />
      <Segmented
        label={translate('display.textSize', locale)}
        options={TEXT_SIZE_CHOICES}
        value={preferences.textSize}
        labelFor={TEXT_SIZE_LABEL}
        locale={locale}
        onChange={(textSize) => onChange({ ...preferences, textSize })}
      />
    </div>
  );
}
