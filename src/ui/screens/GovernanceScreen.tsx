/**
 * Content governance screen.
 *
 * Required by the architecture list ("Admin / Content Governance"). It shows the real state
 * of the source corpus rather than a marketing summary: what is approved, what is not, which
 * references are broken, and which decisions are still open.
 */
import {
  evidenceReferenceReport,
  findDanglingReferences,
  findSuspectedStrandMisplacements,
} from '@/governance/integrity';
import { openItemsBySeverity } from '@/governance/open-items';
import { corpusStatusBreakdown } from '@/governance/status-report';
import { localeCoverage } from '@/content/authored-content';
import { LOCALES } from '@/localization/locales';
import { translate } from '@/localization/messages';
import {
  resolveStrandView,
  summariseStrandReconciliation,
  STRAND_TAXONOMY_VIEWS,
} from '@/knowledge/strand-taxonomy';
import { Disclosures } from '../components/Disclosures';

export function GovernanceScreen({ locale }: { locale: string }) {
  const strandView = resolveStrandView();
  const reconciliation = summariseStrandReconciliation();
  const dangling = findDanglingReferences();
  const corpus = corpusStatusBreakdown();
  const coverage = localeCoverage(LOCALES.map((item) => item.tag));
  const evidence = evidenceReferenceReport();
  const misplacements = findSuspectedStrandMisplacements();

  return (
    <div className="stack">
      <section className="card">
        <p className="eyebrow">{translate('governance.title', locale)}</p>
        <h1>{translate('governance.openItems', locale)}</h1>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Severity</th>
              <th>Issue</th>
              <th>What the app does</th>
            </tr>
          </thead>
          <tbody>
            {openItemsBySeverity().map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  <span className={`tag tag--${item.severity.toLowerCase()}`}>{item.severity}</span>
                </td>
                <td>
                  <strong>{item.title}</strong>
                  <br />
                  <span className="muted">{item.summary}</span>
                </td>
                <td className="muted">{item.engineeringPosture}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card">
        <p className="eyebrow">{translate('governance.strandTitle', locale)}</p>
        <Disclosures disclosures={strandView.disclosures} locale={locale} />
        <p className="muted">
          {strandView.isCanonical ? '' : translate('governance.noCanonical', locale)} Active view:{' '}
          <strong>{strandView.view.label}</strong> ({strandView.view.rowCount} rows)
        </p>
        <table className="table">
          <thead>
            <tr>
              <th>Registered view</th>
              <th>Rows present</th>
              <th>Count stated in document</th>
              <th>Canonical</th>
            </tr>
          </thead>
          <tbody>
            {STRAND_TAXONOMY_VIEWS.map((view) => (
              <tr key={view.id}>
                <td>
                  <strong>{view.label}</strong>
                  <br />
                  <span className="muted">
                    {view.sourceFile} · {view.sourceSheet}
                  </span>
                </td>
                <td>{view.rowCount}</td>
                <td>{view.documentStatedCount ?? '—'}</td>
                <td>{strandView.isCanonical && strandView.view.id === view.id ? 'yes' : 'undecided'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="muted" style={{ marginTop: '0.7rem' }}>
          Working mapping: {reconciliation.exactMatches} exact matches ·{' '}
          {reconciliation.namingVariations} naming variations · {reconciliation.openMappings} open ·{' '}
          {reconciliation.uncodedGroupings} uncoded curriculum groupings.
        </p>
      </section>

      <section className="card">
        <p className="eyebrow">{translate('governance.statusCounts', locale)}</p>
        <table className="table">
          <thead>
            <tr>
              <th>Corpus</th>
              <th>Total</th>
              <th>Status breakdown</th>
              <th>May be stated as fact</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Knowledge nodes', corpus.knowledgeNodes.total, corpus.knowledgeNodes.byStatus, corpus.knowledgeNodes.mayStateAsFact],
              ['Ingredients', corpus.ingredients.total, corpus.ingredients.byStatus, corpus.ingredients.mayStateAsFact],
              ['Products', corpus.products.total, corpus.products.byStatus, corpus.products.mayStateAsFact],
              ['Quests', corpus.quests.total, corpus.quests.byStatus, '—'],
              ['Content atoms', corpus.contentAtoms.total, corpus.contentAtoms.byStatus, '—'],
            ].map(([label, total, breakdown, fact]) => (
              <tr key={String(label)}>
                <td>{String(label)}</td>
                <td>{String(total)}</td>
                <td className="muted">
                  {Object.entries(breakdown as Record<string, number>)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(' · ')}
                </td>
                <td>{String(fact)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="muted" style={{ marginTop: '0.7rem' }}>
          Evidence status of knowledge nodes:{' '}
          {Object.entries(corpus.knowledgeNodes.byEvidenceStatus)
            .map(([key, value]) => `${key}: ${value}`)
            .join(' · ')}
        </p>
      </section>

      <section className="card">
        <p className="eyebrow">{translate('governance.integrityTitle', locale)}</p>
        {dangling.length === 0 ? (
          <p className="muted">No dangling references found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Relation</th>
                <th>From</th>
                <th>Missing ID</th>
                <th>Role</th>
                <th>Register</th>
              </tr>
            </thead>
            <tbody>
              {dangling.map((reference) => (
                <tr key={`${reference.relation}-${reference.fromId}-${reference.missingId}`}>
                  <td>{reference.relation}</td>
                  <td>{reference.fromId}</td>
                  <td>{reference.missingId}</td>
                  <td>{reference.role}</td>
                  <td>{reference.registerId ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="card">
        <p className="eyebrow">Evidence reference integrity · OQ-E01</p>
        <p className="muted">
          {evidence.nodesWithSourceId} node(s) cite a Source_ID; {evidence.resolved} resolve
          against 14_EVIDENCE, {evidence.unresolved} do not. Cited but unregistered:{' '}
          {evidence.unknownSourceIds.join(', ') || 'none'}. Registered:{' '}
          {evidence.registeredSourceIds.join(', ')}.
        </p>
      </section>

      <section className="card">
        <p className="eyebrow">Suspected strand misplacement · OQ-S01</p>
        {misplacements.length === 0 ? (
          <p className="muted">None detected.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Node</th>
                <th>Filed under</th>
                <th>Named ingredient</th>
                <th>Family suggests</th>
              </tr>
            </thead>
            <tbody>
              {misplacements.map((item) => (
                <tr key={item.nodeId}>
                  <td>
                    {item.nodeId}
                    <br />
                    <span className="muted">{item.nodeTitle}</span>
                  </td>
                  <td className="muted">
                    {item.filedUnderStrandCode} {item.filedUnderStrandName}
                  </td>
                  <td className="muted">
                    {item.matchedIngredientName}
                    <br />
                    <span className="tag">{item.ingredientFamily}</span>
                  </td>
                  <td className="muted">
                    {item.suggestedStrandCode} {item.suggestedStrandName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="card">
        <p className="eyebrow">{translate('governance.localeTitle', locale)}</p>
        <table className="table">
          <thead>
            <tr>
              <th>Locale</th>
              <th>Defined by</th>
              <th>Stage</th>
              <th>Atoms translated</th>
              <th>Activities translated</th>
            </tr>
          </thead>
          <tbody>
            {LOCALES.map((definition) => {
              const stats = coverage.find((item) => item.locale === definition.tag);
              return (
                <tr key={definition.tag}>
                  <td>
                    {definition.tag} · {definition.englishName}
                  </td>
                  <td className="muted">{definition.origin}</td>
                  <td>{definition.stage ?? '—'}</td>
                  <td>
                    {stats?.atomsTranslated ?? 0}/{stats?.atomsTotal ?? 0}
                  </td>
                  <td>
                    {stats?.activitiesTranslated ?? 0}/{stats?.activitiesTotal ?? 0}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
