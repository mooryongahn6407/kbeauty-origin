/**
 * Compare Lab — QST-011 "AHA-BHA-PHA Lab", whose win condition is "3개 산 비교".
 *
 * Two families side by side, every record each one holds, and the fields the database keeps for
 * them. Comparison is the cheapest way to create understanding without asserting anything: the
 * screen only sets two sets of records next to each other and lets the reader see where they
 * differ. It is also, per the learning literature, worth more *before* an explanation than
 * after one — contrasting two cases first is what makes the later explanation land.
 *
 * Everything shown is a governed field. The screen computes no verdict, ranks nothing, and says
 * nothing about which column is better or what either does, because no record here has passed
 * the evidence gate.
 */
import { useState } from 'react';
import { translate } from '@/localization/messages';
import { ingredients } from '@/knowledge/repository';
import type { Ingredient } from '@/domain/entities';
import { familyFunction, huntableFamilies } from '@/app/ingredient-hunt';
import { CompanionSays } from '../components/Companion';
import { ReadAloud } from '../components/ReadAloud';
import { spokenFallback } from '../spoken-fallback';

/** The three acids QST-011 names, when the database holds them; otherwise whatever it holds. */
const OPENING_FAMILIES = ['AHA', 'BHA', 'Polyhydroxy Acid'];

const familiesWithRecords = (): readonly string[] => {
  const all = [...new Set(ingredients.map((ingredient) => ingredient.Family))];
  const opening = OPENING_FAMILIES.filter((family) => all.includes(family));
  return [...opening, ...all.filter((family) => !opening.includes(family))];
};

const membersOf = (family: string): readonly Ingredient[] =>
  ingredients.filter((ingredient) => ingredient.Family === family);

export function CompareLabScreen({ locale }: { locale: string }) {
  const families = familiesWithRecords();
  const [left, setLeft] = useState(families[0] ?? 'AHA');
  const [right, setRight] = useState(families[1] ?? families[0] ?? 'BHA');

  const prompt = translate('compare.prompt', locale);

  return (
    <section className="compare" aria-labelledby="compare-prompt">
      <CompanionSays mood="calm">
        <p className="bubble__prompt" id="compare-prompt">
          {prompt}
        </p>
        <p className="bubble__help">{translate('compare.help', locale)}</p>
        <ReadAloud
          text={prompt}
          locale={locale}
          fallback={spokenFallback(locale, (spoken) => translate('compare.prompt', spoken))}
          autoplay
        />
      </CompanionSays>

      <div className="compare__pickers">
        <FamilyPicker
          label={translate('compare.left', locale)}
          families={families}
          value={left}
          onChange={setLeft}
        />
        <FamilyPicker
          label={translate('compare.right', locale)}
          families={families}
          value={right}
          onChange={setRight}
        />
      </div>

      <div className="compare__columns">
        <FamilyColumn family={left} locale={locale} />
        <FamilyColumn family={right} locale={locale} />
      </div>

      <p className="record-block__note">{translate('compare.note', locale)}</p>
    </section>
  );
}

function FamilyPicker({
  label,
  families,
  value,
  onChange,
}: {
  label: string;
  families: readonly string[];
  value: string;
  onChange: (family: string) => void;
}) {
  const id = `picker-${label.replace(/\s+/g, '-')}`;
  return (
    <div className="compare__picker">
      <label className="settings__label" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className="settings__select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {families.map((family) => {
          const fn = familyFunction(family);
          return (
            <option key={family} value={family}>
              {fn ? `${fn} · ${family}` : family}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function FamilyColumn({ family, locale }: { family: string; locale: string }) {
  const members = membersOf(family);
  const fn = familyFunction(family);
  const levels = [...new Set(members.map((member) => member.Level))].filter(Boolean);
  const withReference = members.filter((member) => member.Reference_URL.trim() !== '');

  return (
    <section className="compare__col">
      <h2 className="compare__family">{family}</h2>
      {fn ? <p className="chip">{fn}</p> : null}

      <dl className="compare__facts">
        <div>
          <dt>{translate('compare.count', locale)}</dt>
          <dd>{members.length}</dd>
        </div>
        <div>
          <dt>{translate('hunt.field.level', locale)}</dt>
          <dd>{levels.join(', ') || '—'}</dd>
        </div>
        <div>
          <dt>{translate('compare.cited', locale)}</dt>
          <dd>
            {withReference.length} / {members.length}
          </dd>
        </div>
      </dl>

      <ul className="compare__members" role="list">
        {members.map((member) => (
          <li key={member.Ingredient_ID}>
            <span className="compare__name">{member.Ingredient_Name}</span>
            {member.Learning_Goal ? (
              <span className="compare__goal">{member.Learning_Goal}</span>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
