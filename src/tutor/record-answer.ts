/**
 * The tutor's short answer, built ONLY from the text of the record it matched.
 *
 * Rule 11 still holds: the tutor writes no prose of its own. The answer is a catalogue sentence
 * (one per record kind, in every UI language) whose blanks are filled with the matched record's
 * own fields, verbatim — title, family, recorded role, description, learning goal. Nothing is
 * paraphrased, summarised or added, so the answer can say no more than the record does. Record
 * fields are mostly Korean (the Master Database's language) and stay in it; the screen marks them.
 *
 * Product rows are never answered from: their text is the maker's claim, and answering from it
 * would push a product (G1–G6 apply to products, not to this sentence).
 *
 * The same record text is the only context `/api/tutor` (cloudflare/worker.ts) may send to the
 * language model, so the AI answer and the rule-based one rest on exactly the same records.
 */
import { concerns, ingredients, knowledgeNodes, productCategories } from '@/knowledge/repository';
import type { GroundingCandidate, GroundingKind } from './retriever';

export type AnswerKind = Exclude<GroundingKind, 'Product'>;
export type AnswerKey = `tutor.answer.${AnswerKind}`;

export interface RecordAnswer {
  readonly key: AnswerKey;
  /** The record's own fields, verbatim. */
  readonly params: Readonly<Record<string, string>>;
  readonly recordId: string;
  readonly kind: AnswerKind;
}

const clean = (value: string | undefined): string => (value ?? '').replace(/\s+/g, ' ').trim();

/** The verbatim fields of one record, or null when it is a product or has nothing to say. */
export function recordAnswer(candidate: Pick<GroundingCandidate, 'kind' | 'id'>): RecordAnswer | null {
  const { kind, id } = candidate;
  let params: Record<string, string> | null = null;
  if (kind === 'KnowledgeNode') {
    const node = knowledgeNodes.find((item) => item.Node_ID === id);
    if (node) params = { title: clean(node.Node_Title), strand: clean(node.Strand_Name), goal: clean(node.Learning_Objective) };
  } else if (kind === 'Ingredient') {
    const item = ingredients.find((entry) => entry.Ingredient_ID === id);
    if (item) params = { title: clean(item.Ingredient_Name), family: clean(item.Family), role: clean(item.Primary_Function) };
  } else if (kind === 'Concern') {
    const item = concerns.find((entry) => entry.Concern_ID === id);
    if (item) params = { title: clean(item.Concern_Name), description: clean(item.Description) };
  } else if (kind === 'ProductCategory') {
    const item = productCategories.find((entry) => entry.Category_ID === id);
    if (item) params = { title: clean(item.Category_Name), family: clean(item.Family), focus: clean(item.Learning_Focus) };
  }
  if (!params || Object.values(params).some((value) => value === '')) return null;
  return { key: `tutor.answer.${kind as AnswerKind}`, params, recordId: id, kind: kind as AnswerKind };
}

/** The first matched record that can be answered from, in the retriever's order. */
export function firstRecordAnswer(
  candidates: readonly Pick<GroundingCandidate, 'kind' | 'id'>[],
): RecordAnswer | null {
  for (const candidate of candidates) {
    const answer = recordAnswer(candidate);
    if (answer) return answer;
  }
  return null;
}

/** One record as plain context lines for the model — its id, kind and verbatim fields only. */
export function recordContext(answer: RecordAnswer): string {
  const fields = Object.entries(answer.params).map(([name, value]) => `${name}: ${value}`);
  return [`[${answer.recordId}] (${answer.kind})`, ...fields].join('\n');
}
