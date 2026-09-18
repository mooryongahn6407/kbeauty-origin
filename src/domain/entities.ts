/**
 * MVP data model.
 *
 * Every entity below is a typed view over an official source record. Field names follow
 * the Master Database column names (Node_ID, Strand_Code, ...) exactly where they come
 * from a source sheet, because renaming them would break the traceability the handoff
 * command requires. Application-level fields are added alongside, never in place of them.
 */
import type {
  EvidenceStatus,
  EvidenceTier,
  Provenance,
  RecordStatus,
} from './governance';

/** Master DB 01_DOMAINS. */
export interface Domain {
  readonly Domain_ID: string;
  readonly Domain_Name: string;
  readonly Description: string;
  readonly Sequence: string;
  readonly Priority: string;
  readonly Status: RecordStatus;
  readonly provenance: Provenance;
}

/** Master DB 02_STRANDS. Strand identity is governed; see src/knowledge/strand-taxonomy.ts. */
export interface Strand {
  readonly Strand_ID: string;
  readonly Domain_ID: string;
  readonly Strand_Code: string;
  readonly Strand_Name: string;
  readonly Description: string;
  readonly Sequence: string;
  readonly Status: RecordStatus;
  readonly provenance: Provenance;
}

/** Master DB 03_KNOWLEDGE_NODES — the AI grounding SSOT. */
export interface KnowledgeNode {
  readonly Node_ID: string;
  readonly Domain_ID: string;
  readonly Strand_Code: string;
  readonly Strand_Name: string;
  readonly Node_Title: string;
  readonly Node_Type: string;
  readonly Level: string;
  readonly Learning_Objective: string;
  readonly Mastery_Rule: string;
  readonly Evidence_Status: EvidenceStatus | '';
  readonly Source_ID: string;
  readonly Source_URL: string;
  readonly Status: RecordStatus;
  readonly Version: string;
  readonly provenance: Provenance;
}

/** Master DB 04_SKILLS — mastery is measured here, not on nodes (AI Constitution §6.2). */
export interface Skill {
  readonly Skill_ID: string;
  readonly Skill_Name: string;
  readonly Definition: string;
  readonly Skill_Code: string;
  readonly Level: string;
  readonly Linked_Domains: string;
  readonly provenance: Provenance;
}

/** Master DB 06_INGREDIENTS. */
export interface Ingredient {
  readonly Ingredient_ID: string;
  readonly Ingredient_Name: string;
  readonly Family: string;
  readonly Primary_Function: string;
  readonly Level: string;
  readonly Learning_Goal: string;
  readonly Reference_URL: string;
  readonly Evidence_Status: string;
  readonly Status: RecordStatus;
  readonly provenance: Provenance;
}

/** Master DB 07_CONCERNS. `Boundary` separates cosmetic education from medical territory. */
export interface SkinConcern {
  readonly Concern_ID: string;
  readonly Concern_Name: string;
  readonly Description: string;
  readonly Boundary: string;
  readonly Level: string;
  readonly Learning_Goal: string;
  readonly Status: RecordStatus;
  readonly provenance: Provenance;
}

/** Master DB 08_PRODUCT_CATEGORIES. */
export interface ProductCategory {
  readonly Category_ID: string;
  readonly Category_Name: string;
  readonly Family: string;
  readonly Lao_Label: string;
  readonly Learning_Focus: string;
  readonly Status: RecordStatus;
  readonly provenance: Provenance;
}

/** Master DB 09_ROUTINES. */
export interface Routine {
  readonly Routine_ID: string;
  readonly Routine_Name: string;
  readonly Description: string;
  readonly Default_Sequence: string;
  readonly Status: RecordStatus;
  readonly provenance: Provenance;
}

/** Master DB 11_QUESTS. */
export interface Quest {
  readonly Quest_ID: string;
  readonly Quest_Name: string;
  readonly World: string;
  readonly Theme: string;
  readonly Win_Condition: string;
  readonly Reward: string;
  readonly Primary_Skill: string;
  readonly Status: RecordStatus;
  readonly provenance: Provenance;
}

/** Master DB 14_EVIDENCE. */
export interface EvidenceSource {
  readonly Source_ID: string;
  readonly Publisher: string;
  readonly Source_Title: string;
  readonly URL: string;
  readonly Tier: EvidenceTier | string;
  readonly Use: string;
  readonly provenance: Provenance;
}

/** Master DB 13_AI_RULES — policy seed set with mixed Approved/Draft status. */
export interface AIRule {
  readonly Rule_ID: string;
  readonly Rule_Name: string;
  readonly Policy: string;
  /** Source values are Korean: 필수 (mandatory) / 권장 (recommended). Preserved verbatim. */
  readonly Priority: string;
  readonly Applies_To: string;
  readonly Status: RecordStatus;
  readonly provenance: Provenance;
}

/** Master DB 19_MASTERY_RULES. */
export interface MasteryRule {
  readonly Rule_ID: string;
  readonly Evidence_Type: string;
  readonly Definition: string;
  readonly Operational_Rule: string;
  readonly provenance: Provenance;
}

/** Master DB 21_CONTENT_ATOMS. */
export interface ContentAtom {
  readonly Content_ID: string;
  readonly Node_ID: string;
  readonly Content_Type: string;
  readonly Locale: string;
  readonly Level: string;
  readonly Duration: string;
  readonly Hook: string;
  readonly Core_Explanation: string;
  readonly Interaction_Type: string;
  readonly Feedback_Template: string;
  readonly Transfer_Prompt: string;
  readonly Source_ID: string;
  readonly Version: string;
  readonly Status: RecordStatus;
  readonly provenance: Provenance;
}

/** Master DB 15_LOCALIZATION. */
export interface LocalizationRecord {
  readonly Locale_ID: string;
  readonly Language: string;
  readonly Market_Label: string;
  readonly Stage: string;
  readonly Notes: string;
  readonly provenance: Provenance;
}

/** Master DB 16_PRODUCTS. Current source rows are templates; see SR-011. */
export interface Product {
  readonly Product_ID: string;
  readonly Brand: string;
  readonly Product_Name: string;
  readonly Category_ID: string;
  readonly Primary_Ingredient_ID: string;
  readonly Claim_Summary: string;
  readonly How_To_Use: string;
  readonly Market: string;
  readonly KOREA_GLOW_SKU: string;
  readonly Source_URL: string;
  readonly Status: RecordStatus | 'Template';
  readonly provenance: Provenance;
}

/** Many-to-many link rows kept verbatim from their sheets. */
export interface NodeSkillLink {
  readonly Node_ID: string;
  readonly Skill_ID: string;
  readonly Relationship: string;
}
export interface QuestNodeLink {
  readonly Quest_ID: string;
  readonly Node_ID: string;
  readonly Role: string;
}
export interface NodeRoutineLink {
  readonly Node_ID: string;
  readonly Routine_ID: string;
  readonly Relationship: string;
}

/**
 * Learner profile.
 *
 * AI Constitution §12 / AI-020: personalization must not create fixed identity labels,
 * so there is no `skinType` field. Observations are timestamped events, not attributes.
 */
export interface UserProfile {
  readonly userId: string;
  readonly displayName: string;
  readonly locale: string;
  /** Goals are user-chosen and changeable (Constitution §12.1 "goal can change"). */
  readonly goals: readonly string[];
  /** Free-text context such as climate, used only to adapt learning, never to profile the user. */
  readonly context: Readonly<Record<string, string>>;
  readonly createdAt: string;
}
