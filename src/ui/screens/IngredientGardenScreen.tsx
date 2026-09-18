/**
 * Ingredient Garden.
 *
 * Grounded in Domain D06 (Ingredients & Cosmetic Science), 06_INGREDIENTS (40 records) and
 * quests QST-008 / QST-009 / QST-010.
 *
 * The screen shows three honest things at once:
 *   1. the governed ingredient catalog exactly as it stands, with provenance and status;
 *   2. the three real quests, wired to their real node map, each reporting precisely which
 *      records block it — no mock progress, no placeholder lesson;
 *   3. the one lesson that *is* open today, because it teaches a reasoning skill rather than
 *      a claim about what an ingredient does.
 */
import { useState } from 'react';
import { INGREDIENT_HALO_PLAN, loadSliceGrounding } from '@/app/learning-session';
import { ingredientGardenQuestAvailability } from '@/governance/learning-availability';
import {
  ingredientCorpusReport,
  ingredientFamilies,
} from '@/knowledge/ingredients';
import { evaluatePublication } from '@/governance/publication-gate';
import { findNode } from '@/knowledge/repository';
import { translate } from '@/localization/messages';
import { Disclosures, ProvenanceStrip } from '../components/Disclosures';
import { LessonRunner } from '../components/LessonRunner';

function QuestPanel({ locale }: { locale: string }) {
  const quests = ingredientGardenQuestAvailability();

  return (
    <section className="card">
      <p className="eyebrow">{translate('ingredient.questTitle', locale)}</p>
      <p className="muted">{translate('ingredient.questIntro', locale)}</p>

      {quests.map((quest) => (
        <div key={quest.questId} className="card card--sunk" style={{ marginTop: '0.9rem' }}>
          <div className="masthead__row">
            <h3 style={{ margin: 0 }}>
              {quest.questId} · {quest.questName}
            </h3>
            <span className={`tag tag--${quest.available ? 'open' : 'blocker'}`}>
              {quest.available
                ? translate('ingredient.openLesson', locale)
                : translate('ingredient.closedLesson', locale)}
            </span>
          </div>
          <p className="muted" style={{ marginTop: '0.35rem' }}>
            <span className="provenance__key">{translate('ingredient.winCondition', locale)}</span>{' '}
            {quest.winCondition} ·{' '}
            <span className="provenance__key">{translate('ingredient.coreNode', locale)}</span>{' '}
            {quest.coreNodeId ?? '—'}
          </p>

          <h3 style={{ marginTop: '0.8rem' }}>{translate('ingredient.blockedBy', locale)}</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Record</th>
                <th>Reason</th>
                <th>Detail</th>
                <th>Register</th>
              </tr>
            </thead>
            <tbody>
              {quest.blockers.map((blocker) => (
                <tr key={`${blocker.recordId}-${blocker.reason}`}>
                  <td>
                    {blocker.recordType}
                    <br />
                    <span className="muted">{blocker.recordId}</span>
                  </td>
                  <td>
                    <span className="tag">{blocker.reason}</span>
                  </td>
                  <td className="muted">{blocker.detail}</td>
                  <td className="muted">{blocker.registerId ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </section>
  );
}

function CatalogPanel({ locale }: { locale: string }) {
  const report = ingredientCorpusReport();
  const [openFamily, setOpenFamily] = useState<string | null>(ingredientFamilies[0]?.name ?? null);

  return (
    <section className="card">
      <p className="eyebrow">{translate('ingredient.catalogTitle', locale)}</p>
      <p className="muted">{translate('ingredient.catalogIntro', locale)}</p>
      <Disclosures
        disclosures={[
          { code: 'PENDING_VERIFICATION', severity: 'caution', messageKey: 'disclosure.pendingVerification' },
          { code: 'NOT_MEDICAL_ADVICE', severity: 'info', messageKey: 'disclosure.notMedicalAdvice' },
        ]}
        locale={locale}
      />
      <p className="muted">
        {report.total} records · {report.familyCount} families · {report.mayStateAsFact} may be
        stated as fact · {report.withReferenceUrl} carry a reference URL
      </p>

      <div style={{ marginTop: '0.9rem' }}>
        {ingredientFamilies.map((family) => {
          const isOpen = openFamily === family.name;
          return (
            <div key={family.name} style={{ marginBottom: '0.4rem' }}>
              <button
                type="button"
                className="option"
                aria-pressed={isOpen}
                aria-expanded={isOpen}
                onClick={() => setOpenFamily(isOpen ? null : family.name)}
                style={{ marginBottom: isOpen ? '0.35rem' : undefined }}
              >
                <strong>{family.name}</strong>{' '}
                <span className="muted">({family.ingredients.length})</span>
              </button>
              {isOpen ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>{translate('ingredient.function', locale)}</th>
                      <th>{translate('ingredient.learningGoal', locale)}</th>
                      <th>{translate('common.status', locale)}</th>
                      <th>{translate('ingredient.reference', locale)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {family.ingredients.map((ingredient) => {
                      const decision = evaluatePublication(ingredient);
                      return (
                        <tr key={ingredient.Ingredient_ID}>
                          <td>{ingredient.Ingredient_ID}</td>
                          <td>{ingredient.Ingredient_Name}</td>
                          <td className="muted">{ingredient.Primary_Function}</td>
                          <td className="muted">{ingredient.Learning_Goal}</td>
                          <td>
                            <span className="tag">
                              {ingredient.Status} · {ingredient.Evidence_Status}
                            </span>
                            <br />
                            <span className="muted fine">
                              {decision.mode}
                            </span>
                          </td>
                          <td className="muted">
                            {ingredient.Reference_URL ? (
                              <a href={ingredient.Reference_URL} rel="noreferrer noopener" target="_blank">
                                {new URL(ingredient.Reference_URL).hostname}
                              </a>
                            ) : (
                              translate('ingredient.noReference', locale)
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : null}
            </div>
          );
        })}
      </div>

      <ProvenanceStrip
        entries={[
          { label: translate('common.source', locale), value: '06_INGREDIENTS' },
          { label: 'Domain', value: 'D06 Ingredients & Cosmetic Science' },
          { label: 'Register', value: 'SR-010' },
        ]}
      />
    </section>
  );
}

export function IngredientGardenScreen({ locale }: { locale: string }) {
  const [inLesson, setInLesson] = useState(false);
  const grounding = loadSliceGrounding(INGREDIENT_HALO_PLAN);
  const node = findNode(INGREDIENT_HALO_PLAN.nodeId);

  if (inLesson) {
    return (
      <div className="stack">
        <button className="btn btn--quiet" type="button" onClick={() => setInLesson(false)}>
          ← {translate('ingredient.backToGarden', locale)}
        </button>
        <LessonRunner plan={INGREDIENT_HALO_PLAN} locale={locale} />
      </div>
    );
  }

  return (
    <div className="stack">
      <section className="card">
        <p className="eyebrow">{translate('nav.ingredientGarden', locale)}</p>
        <h1>{translate('ingredient.lessonTitle', locale)}</h1>
        <p className="muted">{translate('ingredient.lessonIntro', locale)}</p>

        <div className="card card--sunk" style={{ marginTop: '0.9rem' }}>
          <div className="masthead__row">
            <h3 style={{ margin: 0 }}>{node?.Node_Title ?? INGREDIENT_HALO_PLAN.nodeId}</h3>
            <span className={`tag tag--${grounding.availability.available ? 'open' : 'blocker'}`}>
              {grounding.availability.available
                ? translate('ingredient.openLesson', locale)
                : translate('ingredient.closedLesson', locale)}
            </span>
          </div>
          <p className="muted" style={{ marginTop: '0.35rem' }}>
            {grounding.availability.summary}
          </p>
          <ProvenanceStrip
            entries={[
              { label: translate('common.node', locale), value: INGREDIENT_HALO_PLAN.nodeId },
              {
                label: 'Strand',
                value: `${grounding.domainId} ${grounding.strandCode} ${grounding.strandName}`,
              },
              {
                label: translate('common.skill', locale),
                value: `${INGREDIENT_HALO_PLAN.skillId} ${grounding.skillName}`,
              },
              { label: 'Claim class', value: INGREDIENT_HALO_PLAN.claimClass },
              { label: translate('common.status', locale), value: grounding.nodeStatus },
              { label: translate('common.evidence', locale), value: grounding.nodeEvidenceStatus },
            ]}
          />
          <div className="btn--row">
            <button
              className="btn"
              type="button"
              disabled={!grounding.availability.available}
              onClick={() => setInLesson(true)}
            >
              {translate('ingredient.startLesson', locale)}
            </button>
          </div>
        </div>
      </section>

      <QuestPanel locale={locale} />
      <CatalogPanel locale={locale} />
    </div>
  );
}
