/**
 * Knowledge / content repository.
 *
 * The single read path from extracted source data into the application. It attaches
 * provenance, exposes lookups by the source IDs, and refuses to invent records: an unknown
 * ID returns undefined rather than a fabricated placeholder (AI Constitution §3.3
 * "Hallucination Firewall").
 */
import type {
  AIRule,
  ContentAtom,
  Domain,
  EvidenceSource,
  Ingredient,
  KnowledgeNode,
  LocalizationRecord,
  MasteryRule,
  NodeRoutineLink,
  NodeSkillLink,
  Product,
  ProductCategory,
  Quest,
  QuestNodeLink,
  Routine,
  Skill,
  SkinConcern,
} from '@/domain/entities';
import type { Provenance } from '@/domain/governance';

import domainsData from '../../data/source/domains.json';
import nodesData from '../../data/source/knowledge-nodes.json';
import skillsData from '../../data/source/skills.json';
import nodeSkillData from '../../data/source/node-skill-map.json';
import ingredientsData from '../../data/source/ingredients.json';
import concernsData from '../../data/source/concerns.json';
import categoriesData from '../../data/source/product-categories.json';
import routinesData from '../../data/source/routines.json';
import nodeRoutineData from '../../data/source/node-routine-map.json';
import questsData from '../../data/source/quests.json';
import questNodeData from '../../data/source/quest-node-map.json';
import aiRulesData from '../../data/source/ai-rules.json';
import evidenceData from '../../data/source/evidence-sources.json';
import localizationData from '../../data/source/localization.json';
import productsData from '../../data/source/products.json';
import masteryRulesData from '../../data/source/mastery-rules.json';
import contentAtomsData from '../../data/source/content-atoms.json';

interface Dataset<T> {
  readonly sourceFile: string;
  readonly sourceSheet: string;
  readonly recordCount: number;
  readonly records: readonly T[];
}

const provenanceFor = (dataset: { sourceFile: string; sourceSheet: string }): Provenance => ({
  origin: 'MASTER_DB_V1_0',
  sourceFile: dataset.sourceFile,
  sourceSheet: dataset.sourceSheet,
  version: 'v1.0',
});

/** Attach provenance without touching any source field. */
function hydrate<T extends object>(dataset: Dataset<unknown>): readonly (T & { provenance: Provenance })[] {
  const provenance = provenanceFor(dataset);
  return dataset.records.map((record) => ({ ...(record as T), provenance }));
}

export const domains = hydrate<Omit<Domain, 'provenance'>>(domainsData as Dataset<unknown>) as readonly Domain[];
export const knowledgeNodes = hydrate<Omit<KnowledgeNode, 'provenance'>>(nodesData as Dataset<unknown>) as readonly KnowledgeNode[];
export const skills = hydrate<Omit<Skill, 'provenance'>>(skillsData as Dataset<unknown>) as readonly Skill[];
export const ingredients = hydrate<Omit<Ingredient, 'provenance'>>(ingredientsData as Dataset<unknown>) as readonly Ingredient[];
export const concerns = hydrate<Omit<SkinConcern, 'provenance'>>(concernsData as Dataset<unknown>) as readonly SkinConcern[];
export const productCategories = hydrate<Omit<ProductCategory, 'provenance'>>(categoriesData as Dataset<unknown>) as readonly ProductCategory[];
export const routines = hydrate<Omit<Routine, 'provenance'>>(routinesData as Dataset<unknown>) as readonly Routine[];
export const quests = hydrate<Omit<Quest, 'provenance'>>(questsData as Dataset<unknown>) as readonly Quest[];
export const aiRules = hydrate<Omit<AIRule, 'provenance'>>(aiRulesData as Dataset<unknown>) as readonly AIRule[];
export const evidenceSources = hydrate<Omit<EvidenceSource, 'provenance'>>(evidenceData as Dataset<unknown>) as readonly EvidenceSource[];
export const localizationRecords = hydrate<Omit<LocalizationRecord, 'provenance'>>(localizationData as Dataset<unknown>) as readonly LocalizationRecord[];
export const products = hydrate<Omit<Product, 'provenance'>>(productsData as Dataset<unknown>) as readonly Product[];
export const masteryRules = hydrate<Omit<MasteryRule, 'provenance'>>(masteryRulesData as Dataset<unknown>) as readonly MasteryRule[];
export const contentAtoms = hydrate<Omit<ContentAtom, 'provenance'>>(contentAtomsData as Dataset<unknown>) as readonly ContentAtom[];

export const nodeSkillLinks = (nodeSkillData as Dataset<NodeSkillLink>).records;
export const questNodeLinks = (questNodeData as Dataset<QuestNodeLink>).records;
export const nodeRoutineLinks = (nodeRoutineData as Dataset<NodeRoutineLink>).records;

const byId = <T>(items: readonly T[], key: (item: T) => string): ReadonlyMap<string, T> =>
  new Map(items.map((item) => [key(item), item]));

const nodeIndex = byId(knowledgeNodes, (node) => node.Node_ID);
const skillIndex = byId(skills, (skill) => skill.Skill_ID);
const domainIndex = byId(domains, (domain) => domain.Domain_ID);
const questIndex = byId(quests, (quest) => quest.Quest_ID);
const evidenceIndex = byId(evidenceSources, (source) => source.Source_ID);

/** Lookup by source ID. Returns undefined for unknown IDs — never a synthesised record. */
export const findNode = (nodeId: string): KnowledgeNode | undefined => nodeIndex.get(nodeId);
export const findSkill = (skillId: string): Skill | undefined => skillIndex.get(skillId);
export const findDomain = (domainId: string): Domain | undefined => domainIndex.get(domainId);
export const findQuest = (questId: string): Quest | undefined => questIndex.get(questId);
export const findEvidenceSource = (sourceId: string): EvidenceSource | undefined =>
  evidenceIndex.get(sourceId);

export const nodesForDomain = (domainId: string): readonly KnowledgeNode[] =>
  knowledgeNodes.filter((node) => node.Domain_ID === domainId);

export const nodesForStrandCode = (domainId: string, strandCode: string): readonly KnowledgeNode[] =>
  knowledgeNodes.filter((node) => node.Domain_ID === domainId && node.Strand_Code === strandCode);

export const skillsForNode = (nodeId: string): readonly { skill: Skill; relationship: string }[] =>
  nodeSkillLinks
    .filter((link) => link.Node_ID === nodeId)
    .flatMap((link) => {
      const skill = findSkill(link.Skill_ID);
      return skill ? [{ skill, relationship: link.Relationship }] : [];
    });

export const primarySkillIdForNode = (nodeId: string): string | undefined =>
  nodeSkillLinks.find((link) => link.Node_ID === nodeId && link.Relationship === 'Primary')?.Skill_ID;

export const nodeLinksForQuest = (questId: string): readonly QuestNodeLink[] =>
  questNodeLinks.filter((link) => link.Quest_ID === questId);

export const contentAtomsForNode = (nodeId: string): readonly ContentAtom[] =>
  contentAtoms.filter((atom) => atom.Node_ID === nodeId);

/** Counts used by governance screens and regression tests. */
export const repositoryCounts = {
  domains: domains.length,
  knowledgeNodes: knowledgeNodes.length,
  skills: skills.length,
  ingredients: ingredients.length,
  concerns: concerns.length,
  productCategories: productCategories.length,
  routines: routines.length,
  quests: quests.length,
  aiRules: aiRules.length,
  evidenceSources: evidenceSources.length,
  contentAtoms: contentAtoms.length,
  masteryRules: masteryRules.length,
  products: products.length,
} as const;
