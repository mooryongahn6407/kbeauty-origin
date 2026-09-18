/**
 * Evidence reference resolution (OQ-E01).
 *
 * The 92 nodes marked Evidence_Status=Anchor cite Source_IDs from a namespace 14_EVIDENCE does
 * not use (FDA-01, EU-01, AAD-01..03 versus SRC-001..SRC-010), so none of them resolves.
 *
 * This module does NOT guess a mapping. It observes that every one of those nodes also carries
 * a `Source_URL`, and that each of those URLs appears verbatim in 14_EVIDENCE. Matching on the
 * URL therefore derives a candidate mapping from the data itself rather than from an opinion
 * about which document a label meant.
 *
 * The result is still a PROPOSAL and is never applied:
 *
 *   - The derived mapping CONTRADICTS the AI Tutor Constitution §17 reference register. The
 *     Constitution labels AAD-01 "Skin Care Basics" and AAD-02 "Face Washing 101"; the node
 *     data pairs AAD-01 with the face-washing URL and AAD-02 with the skin-care-basics URL.
 *     The two are swapped, so an owner has to say which document is authoritative for the label
 *     before anything is rewritten.
 *   - Resolving a citation does not make the cited source *sufficient* for the claim. See
 *     `evidenceSpecificityReport()`.
 */
import type { EvidenceSource } from '@/domain/entities';
import { evidenceSources, findEvidenceSource, knowledgeNodes } from '@/knowledge/repository';

export interface DerivedEvidenceMapping {
  /** The Source_ID the nodes carry, verbatim. */
  readonly citedSourceId: string;
  /** The Source_URL those nodes carry, verbatim. */
  readonly citedUrl: string;
  /** The registered source whose URL is identical. */
  readonly registeredSourceId: string;
  readonly registeredTitle: string;
  readonly nodeCount: number;
  /** Domains that rely on this citation. */
  readonly domains: readonly string[];
}

export interface EvidenceResolutionReport {
  readonly mappings: readonly DerivedEvidenceMapping[];
  readonly nodesResolvableByUrl: number;
  readonly nodesUnresolvable: number;
  /** True when every citing node's URL matches a registered source exactly. */
  readonly fullyDerivable: boolean;
  /**
   * Labels used by the AI Tutor Constitution §17 register that no node cites and that
   * 14_EVIDENCE does not register either.
   */
  readonly constitutionLabelsWithNoRecord: readonly string[];
}

/**
 * Labels the AI Tutor Constitution §17 reference register defines, transcribed verbatim.
 * Held as data so the contradiction with the node sheet is visible rather than asserted.
 */
export const CONSTITUTION_REFERENCE_LABELS: readonly { id: string; title: string }[] = [
  { id: 'FDA-01', title: 'U.S. FDA — Cosmetics Labeling Claims' },
  { id: 'FDA-02', title: 'U.S. FDA — Cosmetics Labeling' },
  { id: 'EU-01', title: 'European Commission — CosIng' },
  { id: 'AAD-01', title: 'AAD — Skin Care Basics' },
  { id: 'AAD-02', title: 'AAD — Face Washing 101' },
  { id: 'AAD-03', title: 'AAD — Skin Care on a Budget' },
  { id: 'AAD-04', title: 'AAD — Product Order' },
  { id: 'AAD-05', title: 'AAD — Right Sunscreen' },
];

const normaliseUrl = (url: string): string => url.trim().replace(/\/+$/, '');

/** Derive the candidate mapping from Source_URL agreement. Nothing is written back. */
export function resolveEvidenceByUrl(): EvidenceResolutionReport {
  const registeredByUrl = new Map<string, EvidenceSource>(
    evidenceSources.map((source) => [normaliseUrl(source.URL), source]),
  );

  const grouped = new Map<string, { url: string; nodes: string[]; domains: Set<string> }>();
  let unresolvable = 0;

  for (const node of knowledgeNodes) {
    if (node.Source_ID.trim() === '') continue;
    if (findEvidenceSource(node.Source_ID)) continue; // already resolves; nothing to derive

    const url = normaliseUrl(node.Source_URL);
    if (url === '' || !registeredByUrl.has(url)) {
      unresolvable += 1;
      continue;
    }
    const key = `${node.Source_ID}|${url}`;
    const entry = grouped.get(key) ?? { url, nodes: [], domains: new Set<string>() };
    entry.nodes.push(node.Node_ID);
    entry.domains.add(node.Domain_ID);
    grouped.set(key, entry);
  }

  const mappings: DerivedEvidenceMapping[] = [];
  let resolvable = 0;

  for (const [key, entry] of grouped) {
    const citedSourceId = key.split('|')[0] ?? '';
    const registered = registeredByUrl.get(entry.url)!;
    resolvable += entry.nodes.length;
    mappings.push({
      citedSourceId,
      citedUrl: entry.url,
      registeredSourceId: registered.Source_ID,
      registeredTitle: registered.Source_Title,
      nodeCount: entry.nodes.length,
      domains: [...entry.domains].sort(),
    });
  }

  mappings.sort((a, b) => a.citedSourceId.localeCompare(b.citedSourceId));

  const registeredUrls = new Set(evidenceSources.map((source) => normaliseUrl(source.URL)));
  const citedIds = new Set(mappings.map((mapping) => mapping.citedSourceId));
  const constitutionLabelsWithNoRecord = CONSTITUTION_REFERENCE_LABELS.filter(
    (label) => !citedIds.has(label.id) && !findEvidenceSource(label.id),
  ).map((label) => `${label.id} (${label.title})`);

  return {
    mappings,
    nodesResolvableByUrl: resolvable,
    nodesUnresolvable: unresolvable,
    fullyDerivable: unresolvable === 0 && mappings.length > 0,
    constitutionLabelsWithNoRecord,
  };
}

/**
 * Where the derived mapping disagrees with the Constitution's own label for the same ID.
 *
 * This is the reason the mapping cannot simply be applied: the two official sources disagree
 * about what AAD-01 and AAD-02 name, and only an owner can say which one governs.
 */
export interface LabelContradiction {
  readonly sourceId: string;
  readonly constitutionTitle: string;
  readonly derivedTitle: string;
  readonly derivedFromUrl: string;
}

export function findLabelContradictions(): readonly LabelContradiction[] {
  const contradictions: LabelContradiction[] = [];
  const byId = new Map(CONSTITUTION_REFERENCE_LABELS.map((label) => [label.id, label.title]));

  for (const mapping of resolveEvidenceByUrl().mappings) {
    const constitutionTitle = byId.get(mapping.citedSourceId);
    if (!constitutionTitle) continue;

    // Compare on the distinctive part of the title, not on publisher prefixes.
    const constitutionTail = constitutionTitle.split('—').pop()!.trim().toLowerCase();
    const derived = mapping.registeredTitle.trim().toLowerCase();
    const agrees =
      constitutionTail.includes(derived) ||
      derived.includes(constitutionTail) ||
      constitutionTail.replace(/\s+/g, '') === derived.replace(/\s+/g, '');
    if (agrees) continue;

    contradictions.push({
      sourceId: mapping.citedSourceId,
      constitutionTitle,
      derivedTitle: mapping.registeredTitle,
      derivedFromUrl: mapping.citedUrl,
    });
  }

  return contradictions;
}

/**
 * Whether a domain's evidence is specific enough for what it teaches.
 *
 * Resolving a citation is not the same as the citation being adequate. A domain whose nodes all
 * point at one general page has traceability but not support: nothing in that page speaks to the
 * specific claims the nodes make.
 */
export interface DomainEvidenceSpecificity {
  readonly domainId: string;
  readonly nodeCount: number;
  readonly nodesWithCitation: number;
  /** Distinct sources the domain's nodes cite. One general source for a whole domain is thin. */
  readonly distinctSources: readonly string[];
  readonly citedTitles: readonly string[];
}

export function evidenceSpecificityReport(): readonly DomainEvidenceSpecificity[] {
  const byDomain = new Map<string, { total: number; cited: number; sources: Set<string>; titles: Set<string> }>();
  const mappings = resolveEvidenceByUrl().mappings;
  const derivedTitle = new Map(mappings.map((m) => [m.citedSourceId, m.registeredTitle]));

  for (const node of knowledgeNodes) {
    const entry =
      byDomain.get(node.Domain_ID) ?? { total: 0, cited: 0, sources: new Set<string>(), titles: new Set<string>() };
    entry.total += 1;
    if (node.Source_ID.trim() !== '') {
      entry.cited += 1;
      entry.sources.add(node.Source_ID);
      const title = derivedTitle.get(node.Source_ID) ?? findEvidenceSource(node.Source_ID)?.Source_Title;
      if (title) entry.titles.add(title);
    }
    byDomain.set(node.Domain_ID, entry);
  }

  return [...byDomain.entries()]
    .map(([domainId, entry]) => ({
      domainId,
      nodeCount: entry.total,
      nodesWithCitation: entry.cited,
      distinctSources: [...entry.sources].sort(),
      citedTitles: [...entry.titles].sort(),
    }))
    .sort((a, b) => a.domainId.localeCompare(b.domainId));
}
