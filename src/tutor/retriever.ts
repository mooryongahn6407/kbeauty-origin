/**
 * Knowledge retriever — stage 2 (Ground) of the AI Tutor runtime.
 *
 * Source: AI Tutor Constitution §3 (Knowledge Grounding Contract), §15.1 which names
 * `knowledge-retriever` as a required module, and §3.3 the Hallucination Firewall:
 * "검색된 entity가 없으면 제품/성분/주장을 만들어내지 않는다."
 *
 * The retriever's one job is to find which governed records a question is about. It never
 * decides what is true: every candidate comes back with its own publication decision attached,
 * so the caller can see that a record was found AND that it may not be stated as fact. A query
 * that matches nothing returns nothing — never a nearest guess dressed up as an answer.
 *
 * Source priority (§3.1) is applied as a tie-break only. It orders what was already found; it
 * never promotes a record that did not match.
 */
import type { PublicationDecision } from '@/domain/governance';
import { evaluatePublication } from '@/governance/publication-gate';
import {
  concerns,
  findEvidenceSource,
  ingredients,
  knowledgeNodes,
  productCategories,
  products,
} from '@/knowledge/repository';

export type GroundingKind =
  | 'KnowledgeNode'
  | 'Ingredient'
  | 'Concern'
  | 'ProductCategory'
  | 'Product';

export interface GroundingCandidate {
  readonly kind: GroundingKind;
  readonly id: string;
  readonly title: string;
  readonly context: string;
  /** Query terms that actually matched, so a match can be explained rather than trusted. */
  readonly matchedTerms: readonly string[];
  readonly score: number;
  readonly publication: PublicationDecision;
  /** Source_ID the record cites, and whether it resolves in 14_EVIDENCE. */
  readonly citedSourceId: string | null;
  readonly citedSourceResolves: boolean;
}

export interface GroundingResult {
  readonly query: string;
  readonly terms: readonly string[];
  readonly candidates: readonly GroundingCandidate[];
  readonly recordsSearched: number;
  /** True only if some candidate may be stated as fact. Currently never true. */
  readonly anyStatableAsFact: boolean;
  /** True when the query matched nothing. The caller must not invent a subject. */
  readonly empty: boolean;
  /** Candidates whose evidence citation does not resolve (OQ-E01). */
  readonly withUnresolvedEvidence: number;
}

/**
 * Split a query into search terms.
 *
 * Korean is written without spaces between a noun and its particle, so alongside whitespace
 * tokens we keep character n-grams long enough to be meaningful. This is a matching heuristic,
 * not a linguistic claim, and it only affects what is *found* — never what is asserted.
 */
export function queryTerms(query: string): readonly string[] {
  const cleaned = query.toLowerCase().replace(/[^0-9a-z가-힣\s]/g, ' ');
  const words = cleaned.split(/\s+/).filter((word) => word.length >= 2);
  const terms = new Set(words);

  for (const word of words) {
    // Korean words carry particles; sliding windows recover the stem without a morphology table.
    if (/[가-힣]/.test(word) && word.length >= 3) {
      for (let size = word.length - 1; size >= 2; size -= 1) {
        for (let start = 0; start + size <= word.length; start += 1) {
          terms.add(word.slice(start, start + size));
        }
      }
    }
  }
  return [...terms];
}

interface Searchable {
  readonly kind: GroundingKind;
  readonly id: string;
  readonly title: string;
  readonly context: string;
  /** Text matched against. Primary text scores higher than secondary. */
  readonly primary: string;
  readonly secondary: string;
  readonly record: { readonly Status: string; readonly Evidence_Status?: string };
  readonly citedSourceId: string | null;
}

/** Everything the tutor may ground in. Product rows are included so T03 can prove the firewall. */
function searchableRecords(): readonly Searchable[] {
  return [
    ...knowledgeNodes.map((node) => ({
      kind: 'KnowledgeNode' as const,
      id: node.Node_ID,
      title: node.Node_Title,
      context: `${node.Domain_ID} ${node.Strand_Code} ${node.Strand_Name}`,
      primary: node.Node_Title,
      secondary: `${node.Strand_Name} ${node.Learning_Objective}`,
      record: node,
      citedSourceId: node.Source_ID.trim() || null,
    })),
    ...ingredients.map((item) => ({
      kind: 'Ingredient' as const,
      id: item.Ingredient_ID,
      title: item.Ingredient_Name,
      context: item.Family,
      primary: item.Ingredient_Name,
      secondary: `${item.Family} ${item.Primary_Function} ${item.Learning_Goal}`,
      record: item,
      citedSourceId: null,
    })),
    ...concerns.map((item) => ({
      kind: 'Concern' as const,
      id: item.Concern_ID,
      title: item.Concern_Name,
      context: `boundary: ${item.Boundary}`,
      primary: item.Concern_Name,
      secondary: `${item.Description} ${item.Learning_Goal}`,
      record: item,
      citedSourceId: null,
    })),
    ...productCategories.map((item) => ({
      kind: 'ProductCategory' as const,
      id: item.Category_ID,
      title: item.Category_Name,
      context: item.Family,
      primary: item.Category_Name,
      secondary: `${item.Family} ${item.Learning_Focus}`,
      record: item,
      citedSourceId: null,
    })),
    ...products.map((item) => ({
      kind: 'Product' as const,
      id: item.Product_ID,
      title: item.Product_Name || item.Product_ID,
      context: item.Brand || '(no brand recorded)',
      primary: `${item.Brand} ${item.Product_Name}`.trim(),
      secondary: item.Claim_Summary,
      record: item,
      citedSourceId: null,
    })),
  ];
}

/**
 * Find the governed records a question is about.
 *
 * Returns an empty candidate list rather than a best guess when nothing matches: a tutor that
 * always finds something will eventually find something that is not there.
 */
export function ground(query: string, limit = 5): GroundingResult {
  const terms = queryTerms(query);
  const records = searchableRecords();
  const scored: GroundingCandidate[] = [];

  for (const record of records) {
    const primary = record.primary.toLowerCase();
    const secondary = record.secondary.toLowerCase();
    if (primary.trim() === '' && secondary.trim() === '') continue;

    const matched: string[] = [];
    let score = 0;
    for (const term of terms) {
      if (primary.includes(term)) {
        // Longer matches are more specific, so they are worth more.
        score += 4 * term.length;
        matched.push(term);
      } else if (secondary.includes(term)) {
        score += 1 * term.length;
        matched.push(term);
      }
    }
    if (score === 0) continue;

    // Keep only the longest matched terms, so an explanation is readable.
    const distinct = [...new Set(matched)].sort((a, b) => b.length - a.length).slice(0, 3);
    scored.push({
      kind: record.kind,
      id: record.id,
      title: record.title,
      context: record.context,
      matchedTerms: distinct,
      score,
      publication: evaluatePublication(record.record),
      citedSourceId: record.citedSourceId,
      citedSourceResolves:
        record.citedSourceId !== null && findEvidenceSource(record.citedSourceId) !== undefined,
    });
  }

  // Source priority §3.1 as a tie-break: evidence-bearing knowledge before catalogue rows.
  const KIND_PRIORITY: Readonly<Record<GroundingKind, number>> = {
    KnowledgeNode: 0,
    Ingredient: 1,
    Concern: 1,
    ProductCategory: 2,
    Product: 3,
  };
  scored.sort(
    (a, b) => b.score - a.score || KIND_PRIORITY[a.kind] - KIND_PRIORITY[b.kind] || a.id.localeCompare(b.id),
  );

  const candidates = scored.slice(0, limit);
  return {
    query,
    terms,
    candidates,
    recordsSearched: records.length,
    anyStatableAsFact: candidates.some((candidate) => candidate.publication.mayStateAsFact),
    empty: candidates.length === 0,
    withUnresolvedEvidence: candidates.filter(
      (candidate) => candidate.citedSourceId !== null && !candidate.citedSourceResolves,
    ).length,
  };
}
