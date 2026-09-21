/**
 * Claim vs observation — QST-012.
 *
 * Each sentence gets two buttons rather than a drag: on a phone, in a shop, with one hand, a
 * tap beats a drag every time. The reveal explains why each one sorts where it does, and those
 * explanations are about the *kind* of sentence, never about whether it is true.
 */
import { useReducer } from 'react';
import { translate } from '@/localization/messages';
import {
  CLAIM_BUCKETS,
  allPlaced,
  bucketNote,
  claimSorterReducer,
  claimStatements,
  correctIds,
  initialClaimSorter,
  misplacedIds,
  type ClaimBucket,
} from '@/app/claim-sorter';
import { CompanionSays } from '../components/Companion';
import { ReadAloud } from '../components/ReadAloud';
import { spokenFallback } from '../spoken-fallback';

const localised = (record: Readonly<Record<string, string>>, locale: string): string =>
  record[locale] ?? record['en'] ?? '';

const BUCKET_KEY: Readonly<Record<ClaimBucket, 'claim.bucket.observation' | 'claim.bucket.claim'>> = {
  OBSERVATION: 'claim.bucket.observation',
  CLAIM: 'claim.bucket.claim',
};

export function ClaimSorterScreen({ locale }: { locale: string }) {
  const [state, dispatch] = useReducer(claimSorterReducer, initialClaimSorter);
  const prompt = translate('claim.prompt', locale);
  const right = new Set(correctIds(state));
  const wrong = new Set(misplacedIds(state));

  return (
    <section className="claim" aria-labelledby="claim-prompt">
      <CompanionSays>
        <p className="bubble__prompt" id="claim-prompt">
          {prompt}
        </p>
        <p className="bubble__help">{localised(bucketNote, locale)}</p>
        <ReadAloud
          text={`${prompt} ${localised(bucketNote, locale)}`}
          locale={locale}
          fallback={spokenFallback(
            locale,
            (spoken) => `${translate('claim.prompt', spoken)} ${localised(bucketNote, spoken)}`,
          )}
          autoplay
        />
      </CompanionSays>

      <ul className="claim__list" role="list">
        {claimStatements.map((statement) => {
          const placed = state.placements[statement.statementId];
          const mark = state.revealed
            ? right.has(statement.statementId)
              ? ' is-right'
              : wrong.has(statement.statementId)
                ? ' is-wrong'
                : ''
            : '';
          return (
            <li className={`claim__card${mark}`} key={statement.statementId}>
              <p className="claim__text">{localised(statement.text, locale)}</p>
              <div className="claim__buttons">
                {CLAIM_BUCKETS.map((bucket) => (
                  <button
                    key={bucket}
                    type="button"
                    className="btn btn--small btn--quiet"
                    aria-pressed={placed === bucket}
                    disabled={state.revealed}
                    onClick={() =>
                      dispatch({ type: 'place', statementId: statement.statementId, bucket })
                    }
                  >
                    {translate(BUCKET_KEY[bucket], locale)}
                  </button>
                ))}
              </div>
              {state.revealed ? (
                <p className="claim__why">
                  <strong>{translate(BUCKET_KEY[statement.kind], locale)}</strong> ·{' '}
                  {localised(statement.why, locale)}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>

      {state.revealed ? (
        <>
          <p className="hunt__score">
            {translate('claim.result', locale, {
              correct: String(right.size),
              total: String(claimStatements.length),
            })}
          </p>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => dispatch({ type: 'reset' })}
          >
            {translate('claim.again', locale)}
          </button>
        </>
      ) : (
        <button
          type="button"
          className="btn btn--primary"
          disabled={!allPlaced(state)}
          onClick={() => dispatch({ type: 'check' })}
        >
          {translate('claim.check', locale)}
        </button>
      )}

      <p className="record-block__note">{translate('claim.note', locale)}</p>
    </section>
  );
}
