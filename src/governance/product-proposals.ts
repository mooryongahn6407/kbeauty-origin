/**
 * Product proposal register — 2026-09-18 product direction discussion.
 *
 * Purpose (CLAUDE.md rule 10): keep what the official sources already establish separate from
 * what was newly proposed, so a strong product vision can be developed without quietly
 * becoming a claim that the sources never made.
 *
 * Each entry records:
 *   - `classification` from the governed vocabulary;
 *   - `sourceBasis` — where an official source already establishes it. CONFIRMED entries must
 *     have one. An entry with no basis is a new proposal and is labelled as such;
 *   - `governedRecords` — records that already exist for it. Every ID here is checked against
 *     the Master Database by tests/product-proposals.test.ts, so this register cannot drift
 *     into citing records that do not exist;
 *   - `blockedBy` — what must be true before it can be built;
 *   - `constraints` — governed rules that must not be broken while building it.
 *
 * Nothing in this file authorises building anything. It is a register, not a backlog.
 */
import type { GovernanceClass } from '@/domain/governance';

export interface ProductProposal {
  readonly id: string;
  readonly title: string;
  readonly classification: GovernanceClass;
  readonly summary: string;
  /** Official-source citations. Required for CONFIRMED; empty means the idea is new. */
  readonly sourceBasis: readonly string[];
  /** Master Database record IDs that already exist for this. Verified by test. */
  readonly governedRecords: readonly string[];
  readonly blockedBy: readonly string[];
  readonly constraints: readonly string[];
}

/* ── 1. Entry point and profile ─────────────────────────────────────────── */

const PR_001: ProductProposal = {
  id: 'PR-001',
  title: 'MY BEAUTY is the entry point, not an ingredient or product menu',
  classification: 'CONFIRMED',
  summary:
    'The app opens on the user’s own skin, concerns, goals and what to look for — not on a ' +
    'catalogue of ingredients or product categories.',
  sourceBasis: [
    'MASTER_CONTEXT §05: MVP pillars begin with My Skin',
    'Curriculum Knowledge Tree §6.1: My Beauty Profile schema (Context / Observed State / Goals / Routine)',
    'AI Tutor Constitution §12.2: next best step is a learning step, not a commercial one',
  ],
  governedRecords: ['D09', 'KN-D09-01-001', 'KN-D09-01-002', 'KN-D09-02-001'],
  blockedBy: [],
  constraints: [
    'AI-020 No Fixed Identity: the profile must express a current observation ("현재 관찰상 ○○ 경향"), ' +
      'never a permanent label ("당신은 ○○ 피부입니다"). MASTER_CONTEXT §04A already settled this wording.',
  ],
};

const PR_002: ProductProposal = {
  id: 'PR-002',
  title: 'Family / child Beauty pathway',
  classification: 'OPEN_QUESTION',
  summary:
    'An adult user could open a separate pathway to learn about a child’s skin. The principle ' +
    'that adult and child data, safety rules and commerce stay separate is established; the ' +
    'child experience itself is not.',
  sourceBasis: [
    'MASTER_CONTEXT §05: child and adult data, safety rules and commerce are kept separate',
  ],
  governedRecords: [],
  blockedBy: [
    'No child-facing curriculum, safety rules or guardian model exists in any source',
    'No legal basis established for processing child data in the launch market',
    'OQ-L01: launch market and locale set are themselves undecided',
  ],
  constraints: [
    'MASTER_CONTEXT §05: adult and child data, safety and commerce must not share a store or a gate',
    'Nothing child-facing may be built before a guardian consent model and a market legal review exist',
  ],
};

/* ── 2. Product Intelligence Card ───────────────────────────────────────── */

const PR_003: ProductProposal = {
  id: 'PR-003',
  title: 'Three-level product page (at a glance → why → evidence)',
  classification: 'DECISION',
  summary:
    'A product page in three depths: who might find it relevant, why (ingredients and their ' +
    'role), and the evidence behind each claim. Readers choose their own depth.',
  sourceBasis: [
    'AI Tutor Constitution §8.3: recommendation order is category reason → product role → criteria → options → limits → alternatives → commercial disclosure',
    'AI-009 Explain Why',
  ],
  governedRecords: ['AI-008', 'AI-009', 'QST-013', 'QST-018'],
  blockedBy: [
    'SR-011: all 10 rows in 16_PRODUCTS are Status=Template with no product data',
    'OQ-P01: 16_PRODUCTS has one Primary_Ingredient_ID, so a multi-ingredient card cannot be represented',
  ],
  constraints: [
    'Level 1 relevance ("이런 분이 관심을 가질 수 있어요") is a product-specific claim and needs ' +
      'evidence per product, not a generic mapping from category to skin type',
  ],
};

const PR_004: ProductProposal = {
  id: 'PR-004',
  title: 'Evidence layer states what it supports AND what it does not establish',
  classification: 'CONFIRMED',
  summary:
    'Showing a study is not showing that a product works. Each evidence entry says what it ' +
    'supports and, explicitly, what it does not.',
  sourceBasis: [
    'AI Tutor Constitution §3.3 Hallucination Firewall: brand-supplied and independent evidence must not be spoken with equal certainty',
    'AI Tutor Constitution §7.1 regulatory guardrail (FDA-01, EU-01): CosIng listing is not approval; disease claims move a product into drug regulation',
    'SOURCE_RECONCILIATION_MASTER_REGISTER §7: evidence tiers A–D with scope and uncertainty',
    'C06 Uncertainty is a feature',
  ],
  governedRecords: ['AI-005', 'AI-016', 'SRC-005', 'SRC-009'],
  blockedBy: ['OQ-E01: node evidence citations do not resolve to 14_EVIDENCE'],
  constraints: [
    'Evidence tier must be visible: a manufacturer document is Tier C and may support a ' +
      'product-specific fact, never a general scientific one',
  ],
};

const PR_005: ProductProposal = {
  id: 'PR-005',
  title: 'Never infer or display an undeclared ingredient concentration',
  classification: 'CONFIRMED',
  summary:
    'If a concentration is not published by the manufacturer, the app must not state or ' +
    'estimate one. A declared percentage is also not the same thing as an effect.',
  sourceBasis: [
    'AI Tutor Constitution §3.3: 숫자(농도, SPF, 사용 빈도 등)는 반드시 source/label/market context가 있는 경우에만 제시한다',
    'AI-005 Uncertainty',
  ],
  governedRecords: ['AI-005', 'AI-016'],
  blockedBy: [],
  constraints: [
    'A declared concentration is a Tier C product fact. It must never be rendered as evidence ' +
      'of an effect, and the absence of a declaration must be shown as absent, not omitted.',
  ],
};

const PR_006: ProductProposal = {
  id: 'PR-006',
  title: 'Separate ingredient fact, scientific fact and product-specific fact in the data model',
  classification: 'DECISION',
  summary:
    'Store "this ingredient is in this product", "this is known about this ingredient" and ' +
    '"this has been shown about this product" as three different records with their own ' +
    'evidence, strength and uncertainty — never merged into one claim.',
  sourceBasis: [
    'AI Tutor Constitution §3.3: 브랜드가 제공한 정보와 독립적 근거를 섞어 동일한 확실성으로 말하지 않는다',
    'SOURCE_RECONCILIATION_MASTER_REGISTER §7: tier C is for product facts, not general science',
  ],
  governedRecords: ['ING-001', 'CON-001', 'SRC-009'],
  blockedBy: [
    'OQ-P01: neither 16_PRODUCTS nor 17_PRODUCT_RELATIONS has a field for declared ' +
      'concentration, evidence strength, product-specific claim or uncertainty',
  ],
  constraints: ['The three record kinds must remain separately addressable, not flattened for UI convenience'],
};

const PR_007: ProductProposal = {
  id: 'PR-007',
  title: 'When and how to use, derived per product rather than from a generic template',
  classification: 'DECISION',
  summary:
    'Usage timing and order shown per product, driven by its category, formulation, ingredients ' +
    'and the manufacturer’s own instructions — not a single AM/PM template applied to everything.',
  sourceBasis: [
    'AI Tutor Constitution §3.3: frequency figures require a source, label or market context',
  ],
  governedRecords: ['RUT-001', 'RUT-002', 'CAT-001', 'KN-D08-03-001'],
  blockedBy: [
    'SR-011: 16_PRODUCTS.How_To_Use is empty on every row',
    'OQ-R01: 09_ROUTINES has no evidence linkage column, so no routine order is verifiable',
  ],
  constraints: [
    'Applying one generic morning/evening sequence to every product would fabricate a ' +
      'procedural claim. Where instructions are absent, the app must say they are absent.',
  ],
};

/* ── 3. Fit, ranking and the recommendation spine ───────────────────────── */

const PR_008: ProductProposal = {
  id: 'PR-008',
  title: 'CHECK MY FIT answers with reasoning and limits, never with "YES, BEST"',
  classification: 'CONFIRMED',
  summary:
    'Asking whether a product suits me returns skin context, goal, product characteristics, ' +
    'relevant ingredients, evidence, limitations and alternatives — as a reasoned comparison, ' +
    'not a verdict.',
  sourceBasis: [
    'AI Tutor Constitution §8.1: recommendation gates G1 intent, G2 context, G3 evidence, G4 safety, G5 transparency, G6 alternatives',
    'AI Tutor Constitution §8.2: never recommend when it requires inventing "best" or "guaranteed"',
    'AI Tutor Constitution §12.2 agency rule: prefer "이 기준을 보면 스스로 고를 수 있어요"',
  ],
  governedRecords: ['AI-008', 'AI-009', 'KN-D09-07-001', 'KN-D09-07-002', 'QST-018'],
  blockedBy: ['SR-011: gate G3 (evidence) fails for every product, so no fit answer may render'],
  constraints: [
    'This is a recommendation surface. All six gates must pass, and the commerce CTA stays ' +
      'suppressed while any fails.',
  ],
};

const PR_009: ProductProposal = {
  id: 'PR-009',
  title: 'Re-rank the catalogue around the user, with "why it appears here" on every entry',
  classification: 'CONFIRMED',
  summary:
    'Rather than listing every product, show the ones relevant to the user’s stated profile ' +
    'and goal, each carrying the reason it surfaced, its evidence, its use and its limits.',
  sourceBasis: [
    'AI Tutor Constitution §8.3 recommendation response pattern',
    'AI-009 Explain Why; AI-012 Agency Growth',
    '01_TECHNICAL_IMPLEMENTATION_SPEC §8: recommendation must be explainable and downstream of intent + context + evidence + safety',
  ],
  governedRecords: ['AI-009', 'AI-012', 'KN-D09-03-001', 'KN-D09-07-001'],
  blockedBy: ['SR-011', 'OQ-P01'],
  constraints: [
    '01_TECHNICAL_IMPLEMENTATION_SPEC §8: ranking must not be driven by margin, inventory, ' +
      'promotion, brand preference or emotional vulnerability. KOREA GLOW products get no ' +
      'preferential factual treatment.',
  ],
};

const PR_010: ProductProposal = {
  id: 'PR-010',
  title: 'Purpose classification A–E, with medical/treatment routed out of the cosmetic path',
  classification: 'DECISION',
  summary:
    'Classify a product’s purpose as daily care, appearance/conditioning, concern-oriented ' +
    'cosmetic care, prevention/maintenance, or medical/treatment — where the last is not a ' +
    'cosmetic category at all but a safety-gate exit.',
  sourceBasis: [
    'AI Tutor Constitution §1.3: cosmetic education vs disease treatment boundary',
    'AI Tutor Constitution §7.1: risk tiers R0–R4',
    '07_CONCERNS already carries a Boundary field separating education from other territory',
  ],
  governedRecords: ['CON-001', 'AI-006', 'AI-007', 'SK12'],
  blockedBy: ['SR-014: market safety thresholds and escalation wording are unapproved'],
  constraints: [
    'AI-006 No Diagnosis: category E must be an exit to professional care, never a product ' +
      'category the app fills with recommendations',
  ],
};

/* ── 4. Teaching, sharing and the growth loop ───────────────────────────── */

const PR_011: ProductProposal = {
  id: 'PR-011',
  title: 'EXPLAIN TO A FRIEND — the user retells what they learned',
  classification: 'CONFIRMED',
  summary:
    'After learning, the user produces a short plain explanation they can send to someone. ' +
    'This already exists in the curriculum as teach-back, and is a mastery mechanism rather ' +
    'than a sharing feature.',
  sourceBasis: [
    'AI Tutor Constitution §6.2: mastery includes teach-back',
    'AI-019 Teach Back (Draft, 권장)',
  ],
  governedRecords: ['QST-021', 'KN-D12-04-001', 'KN-D12-04-002', 'SK10', 'AI-019'],
  blockedBy: ['SR-009: the nodes a user would explain are unapproved'],
  constraints: [
    'The explanation is evidence of the user’s own understanding. It must carry the same ' +
      'uncertainty the source content carries, and must not become a marketing asset.',
  ],
};

const PR_012: ProductProposal = {
  id: 'PR-012',
  title: 'Save, and a later prompt to revisit what was saved',
  classification: 'CONFIRMED',
  summary:
    'A user saves what they want to return to, and the app later offers it back for review. ' +
    'This is spaced retrieval, which the curriculum already defines.',
  sourceBasis: [
    'Curriculum D12.1 Retrieval: 간격 반복·회상',
    '19_MASTERY_RULES M04 Retention: pass after scheduled review',
  ],
  governedRecords: ['KN-D12-01-001', 'KN-D12-01-002', 'M04', 'SK08'],
  blockedBy: ['Persistence layer is in-memory; nothing survives a reload'],
  constraints: [
    'AI-011 No Screen-Time Optimization: review prompts serve retention, and their cadence must ' +
      'be set by the retention schedule, not by a return-visit target',
  ],
};

const PR_013: ProductProposal = {
  id: 'PR-013',
  title: 'Shareable and private learning are distinguished at the content-atom level',
  classification: 'DECISION',
  summary:
    'A content atom declares whether it is general knowledge that may be shared or personal ' +
    'material that may not, so privacy is a property of the content rather than a later toggle.',
  sourceBasis: [
    'AI Tutor Constitution §12.1: personalization inputs carry explicit boundaries; no unnecessary sensitive data',
  ],
  governedRecords: ['CA-001'],
  blockedBy: ['21_CONTENT_ATOMS has no shareability or privacy field'],
  constraints: [
    'Default must be private. A personal skin observation or profile is never shareable by default.',
  ],
};

const PR_014: ProductProposal = {
  id: 'PR-014',
  title: 'Personal skin data is never auto-shared; the user picks what leaves the app',
  classification: 'CONFIRMED',
  summary:
    'Achievements and general knowledge may be shared at the user’s choice. A personal skin ' +
    'profile or concern is off by default and never posted automatically.',
  sourceBasis: [
    'AI Tutor Constitution §12.1: 민감 속성 추론·불필요한 개인정보 수집 금지; 정밀 위치 수집 금지',
    'AI-020 No Fixed Identity',
    'C07 No shame, fear, or body anxiety',
  ],
  governedRecords: ['AI-020', 'AI-011'],
  blockedBy: [],
  constraints: [
    'A share surface that reveals a skin concern would publish exactly the attribute the ' +
      'Constitution forbids inferring or fixing. Default OFF is not a setting but a rule.',
  ],
};

const PR_015: ProductProposal = {
  id: 'PR-015',
  title: 'Beauty Discovery cards, friend challenges and progress sharing',
  classification: 'IDEA',
  summary:
    'Share what I learned today, send a friend a challenge, or share a monthly learning ' +
    'summary. Attractive, but not prioritised and not grounded in any source requirement.',
  sourceBasis: [],
  governedRecords: ['QST-021', 'KN-D12-06-001'],
  blockedBy: ['Not prioritised; no approved content to share'],
  constraints: [
    'MASTER_CONTEXT §09 lists social features under IDEAS with the instruction "do not build ' +
      'without prioritization"',
    'KN-D12-06-002 defines growth as competence-based, not volume-based — a progress card must ' +
      'show capability, never purchases or streaks',
  ],
};

const PR_016: ProductProposal = {
  id: 'PR-016',
  title: 'Like / Save / Share / Follow as four distinct signals',
  classification: 'IDEA',
  summary:
    'Four actions with different meanings, usable as personalization input. Save is separately ' +
    'confirmed (PR-012); the other three are new.',
  sourceBasis: [],
  governedRecords: ['AI-012'],
  blockedBy: ['Not prioritised'],
  constraints: [
    'AI-011 and C09: these signals may inform what is taught next. They must not become ' +
      'success metrics, and may not gate content behind engagement.',
  ],
};

const PR_017: ProductProposal = {
  id: 'PR-017',
  title: 'Organic sharing reduces dependence on paid acquisition',
  classification: 'HYPOTHESIS',
  summary:
    'That genuinely useful learning content will be shared often enough to acquire users ' +
    'alongside, or instead of, paid advertising.',
  sourceBasis: ['MASTER_CONTEXT §09 already files revenue and conversion assumptions as HYPOTHESIS'],
  governedRecords: [],
  blockedBy: ['No product in market; nothing measured'],
  constraints: ['Must be validated, not assumed, before it shapes roadmap or pricing'],
};

const PR_018: ProductProposal = {
  id: 'PR-018',
  title: 'Co-learning with a friend beats referral rewards',
  classification: 'HYPOTHESIS',
  summary:
    'That two people learning together retains better than paying a user to invite someone.',
  sourceBasis: [],
  governedRecords: [],
  blockedBy: ['No product in market; nothing measured'],
  constraints: [
    'A reward for inviting would make invitation the goal. AI-011 forbids optimising anything ' +
      'above learning.',
  ],
};

const PR_019: ProductProposal = {
  id: 'PR-019',
  title: 'Social platforms are a discovery surface feeding deeper learning in the app',
  classification: 'HYPOTHESIS',
  summary:
    'Short-form video creates curiosity; the app answers it properly. The content architecture ' +
    'for this already exists.',
  sourceBasis: [
    '02_GLOBAL_CONTENT_ENGINE_SPEC: one knowledge → multi-language → multi-format → multi-platform',
  ],
  governedRecords: ['CA-001'],
  blockedBy: ['SR-009: no approved knowledge to derive platform content from'],
  constraints: [
    '02_GLOBAL_CONTENT_ENGINE_SPEC: a platform derivative may change tone and length but must ' +
      'link back to the canonical knowledge node and version',
  ],
};

/* ── 5. The organising journey ──────────────────────────────────────────── */

const PR_020: ProductProposal = {
  id: 'PR-020',
  title: 'PERSONAL BEAUTY DECISION LOOP as the organising user journey',
  classification: 'DECISION',
  summary:
    'Know me → understand my concern → learn what matters → find relevant ingredients → ' +
    'evaluate products → choose → use correctly → observe and reflect → learn again → explain ' +
    'to others. A synthesis of two curriculum domains rather than a new model.',
  sourceBasis: [
    'Curriculum D09 Personalization & Decision covers profile, goal, comparison, budget, need vs want, uncertainty, recommendation literacy, decision journal',
    'Curriculum D12 Beauty Mastery covers retrieval, reflection, transfer, teach-back, habit, Beauty Intelligence Score',
    'MASTER_CONTEXT §06: Discover → Understand → Try → Explain → Compare → Decide → Reflect → Master → Apply',
  ],
  governedRecords: [
    'D09',
    'D12',
    'KN-D09-08-001',
    'KN-D12-02-001',
    'KN-D12-03-001',
    'KN-D12-04-001',
    'QST-025',
  ],
  blockedBy: ['SR-009'],
  constraints: [
    'The loop must not be rewritten as a purchase funnel. MASTER_CONTEXT §06 states the learning ' +
      'progression; commerce is downstream of it, not a stage within it.',
  ],
};

const PR_021: ProductProposal = {
  id: 'PR-021',
  title: 'Extend the same structure to body and hair',
  classification: 'CONFIRMED',
  summary:
    'Skin, body and hair each run profile → concern → ingredient → product → routine, managed ' +
    'in one Beauty Intelligence profile.',
  sourceBasis: ['Curriculum D10 Body, Hair & Nails'],
  governedRecords: ['D10', 'RUT-009', 'RUT-010', 'KN-D10-01-002', 'KN-D10-03-002'],
  blockedBy: ['SR-009', 'OQ-S01: D06 content placement affects ingredient mapping for these too'],
  constraints: [],
};

const PR_022: ProductProposal = {
  id: 'PR-022',
  title: 'Shareability becomes a review criterion for every content atom',
  classification: 'DECISION',
  summary:
    'Content is reviewed for learning value, curiosity, application, mastery, shareability and ' +
    'privacy together, rather than shareability being added later.',
  sourceBasis: [],
  governedRecords: ['CA-001'],
  blockedBy: ['21_CONTENT_ATOMS has no field for any of these criteria'],
  constraints: [
    'Shareability must rank below learning value and privacy. A content atom must never be ' +
      'reshaped to be more shareable at the cost of accuracy or uncertainty.',
  ],
};


/* ── 6. Routine as a learning canvas (2026-09-18 review) ────────────────── */

const PR_023: ProductProposal = {
  id: 'PR-023',
  title: 'SOURCE, EVIDENCE and USAGE INSTRUCTION are three separate records',
  classification: 'DECISION',
  summary:
    'Where a routine or instruction came from, what evidence exists for the underlying claim, ' +
    'and what the manufacturer actually instructs for one product are three different things. ' +
    'A study about an ingredient does not establish that everyone should use a given sequence.',
  sourceBasis: [
    'AI Tutor Constitution §3.3: brand-supplied and independent evidence must not be spoken with equal certainty',
    'SOURCE_RECONCILIATION_MASTER_REGISTER §7: tier C is for product-specific facts, not general science',
  ],
  governedRecords: ['SRC-003', 'SRC-009', 'RUT-001'],
  blockedBy: [
    'OQ-R01: 09_ROUTINES has no field for any of the three',
    'OQ-P01: 16_PRODUCTS.How_To_Use exists but is empty and carries no evidence linkage',
  ],
  constraints: [
    'A product usage instruction may support "the maker says to apply this after cleansing". ' +
      'It may never be generalised into "this is the correct order for everyone".',
  ],
};

const PR_024: ProductProposal = {
  id: 'PR-024',
  title: 'Routine Studio as a personal learning canvas, not a routine builder',
  classification: 'DECISION',
  summary:
    'The user writes what they already do; the app uses it to find what they have not yet ' +
    'learned. Routine becomes the starting point of learning rather than its destination: ' +
    'what am I doing → why → what is my goal → what do I know → what must I learn → what ' +
    'evidence supports it → what should I verify.',
  sourceBasis: [
    'AI Tutor Constitution §5.3 Tutor Fade: intervene only as much as the learner state requires',
    'AI Tutor Constitution §12.2: the next best step is a learning step',
    'Curriculum D09.6 Uncertainty: turning what you do not know into a question',
  ],
  governedRecords: ['KN-D09-06-001', 'KN-D09-06-002', 'KN-D09-08-001', 'SK11', 'SK08'],
  blockedBy: ['SR-009: the knowledge a detected gap would route to is unapproved'],
  constraints: [
    'The canvas must keep making no recommendation. Detecting that a user cannot explain a ' +
      'step is a learning signal; it is not a verdict on their routine or a reason to suggest ' +
      'a product.',
  ],
};

const PR_025: ProductProposal = {
  id: 'PR-025',
  title: 'Detect knowledge, ingredient, product, usage, safety and mastery gaps from a routine',
  classification: 'DECISION',
  summary:
    'From what the user wrote, surface which of six gap types is present, and teach only the ' +
    'part that is missing.',
  sourceBasis: [
    'AI Tutor Constitution §6.3 error taxonomy: knowledge gap, skill gap, misconception, reading error, reasoning error, transfer failure, overconfidence',
    'AI Tutor Constitution §5.3 Tutor Fade',
  ],
  governedRecords: ['AI-004', 'AI-017', 'SK12'],
  blockedBy: [
    'SR-009 and SR-010: a detected gap has nothing approved to route to',
    'Free-text routine entries cannot be mapped to governed ingredients or products while 16_PRODUCTS is Template-only',
  ],
  constraints: [
    'A safety gap must route to the safety gate, never to a lesson. AI-007 Safety Escalation ' +
      'outranks any learning opportunity the canvas finds.',
  ],
};

const PR_026: ProductProposal = {
  id: 'PR-026',
  title: 'Numeric consistency audit as a standing governance check',
  classification: 'DECISION',
  summary:
    'Any number stated in two places in the sources is compared automatically, and a ' +
    'disagreement raises a governance warning rather than being silently reconciled.',
  sourceBasis: [
    'SOURCE_RECONCILIATION_MASTER_REGISTER §12: detect → capture → classify → impact-map → decide → amend → validate → freeze',
  ],
  governedRecords: ['M01', 'M02', 'M03', 'QST-007', 'RUT-003'],
  blockedBy: [],
  constraints: [
    'The audit reports and never reconciles. Choosing which of two numbers is correct affects ' +
      'Quest → Node → Routine → Lesson → Assessment together and is an owner decision.',
  ],
};

const PR_027: ProductProposal = {
  id: 'PR-027',
  title: 'A feature is accepted on the Beauty Intelligence it produces, not on being implemented',
  classification: 'DECISION',
  summary:
    'Every feature must answer what the user can do afterwards that they could not before: ' +
    'understand their own skin, describe their concern, find the relevant criteria, compare ' +
    'products, verify usage information, explain their own reasoning, and want to pass it on.',
  sourceBasis: [
    'MASTER_CONTEXT §10 Digital Product Advisor Mandate: user value, learning value, business value, AI quality, trust, safety, technical durability',
    'AI Tutor Constitution §14: learning gain, transfer rate and reduced AI dependence are the quality measures',
    'Curriculum D12.6: growth is measured by capability, not volume',
  ],
  governedRecords: ['KN-D12-06-001', 'KN-D12-06-002', 'AI-012'],
  blockedBy: [],
  constraints: [
    'AI Constitution §14.1 anti-metrics: session length, message volume, purchase value and ' +
      'notification response may not stand in for this test.',
  ],
};


/* ── 7. Tutor interaction patterns (2026-09-18 reference video) ─────────── */

const PR_028: ProductProposal = {
  id: 'PR-028',
  title: 'Attempt first, then a specific correction — never a bare "incorrect"',
  classification: 'DECISION',
  summary:
    'The learner commits to an answer before anything is marked, and a wrong answer is met with ' +
    'the exact item, where it went, where it belongs, and one warm sentence saying why.',
  sourceBasis: [
    'AI Tutor Constitution C03: user agency before answer delivery',
    'AI Tutor Constitution §6.3 error taxonomy: respond to the kind of error, not to the score',
    'AI-002 Student First (Draft, 권장)',
  ],
  governedRecords: ['AI-002', 'AI-003', 'SK06'],
  blockedBy: [],
  constraints: [
    'The explanation must be about the mistake, not about the learner. No grade, streak or ' +
      'score may attach to it (AI-011).',
  ],
};

const PR_029: ProductProposal = {
  id: 'PR-029',
  title: 'A plain-words line in the learner’s own language, right where the term appears',
  classification: 'DECISION',
  summary:
    'When something needs explaining, explain it inline in one sentence rather than linking ' +
    'away to a glossary. Rendered under a "쉽게 말하면" heading.',
  sourceBasis: [
    'AI Tutor Constitution §9.1 P6 UX Tone: short, elegant, clear, visual-first',
    'AI Tutor Constitution §13: localization is tone and terminology, not only translation',
  ],
  governedRecords: ['AI-014', 'AI-018'],
  blockedBy: [],
  constraints: [
    'Only structural terms may be explained this way — what a claim is, what an ingredient list ' +
      'is. Explaining what an ingredient does would be a scientific claim needing evidence.',
  ],
};

const PR_030: ProductProposal = {
  id: 'PR-030',
  title: 'Put the learner in a situation rather than in an exercise',
  classification: 'DECISION',
  summary:
    'Open with the moment the skill is actually needed — someone hands you a box and asks "is ' +
    'this any good?" — rather than with an instruction to complete a task.',
  sourceBasis: [
    'Curriculum Knowledge Tree §8: Scenario carries context, choices, reasoning and safe_boundary',
    'MASTER_CONTEXT §06: Discover → Understand → Try → Explain → Compare → Decide',
  ],
  governedRecords: ['QST-013', 'QST-020'],
  blockedBy: [
    'SR-003: Scenario is a curriculum entity the database schema does not define, so scenarios ' +
      'currently live inside authored activities',
  ],
  constraints: [
    'A scenario may not introduce a real brand or product while 16_PRODUCTS is Template-only. ' +
      'Practice material must be visibly fictional.',
  ],
};

const PR_031: ProductProposal = {
  id: 'PR-031',
  title: 'A guide with a voice, not a faceless interface',
  classification: 'IDEA',
  summary:
    'A consistent character speaks to the learner, as a language tutor app does with an avatar ' +
    'and live captions. Warmth and continuity rather than system messages.',
  sourceBasis: [],
  governedRecords: ['AI-010'],
  blockedBy: ['Not prioritised; no persona defined in any source'],
  constraints: [
    'AI-010 No Fear Marketing and C07: a persona must not use warmth to push a purchase, and ' +
      'must not become a parasocial hook. AI-012 requires intervention to fall as competence rises, ' +
      'so the guide should speak less over time, not more.',
  ],
};


/* ── 7. Accessibility and the visual system (2026-09-18 owner request) ──── */

const PR_032: ProductProposal = {
  id: 'PR-032',
  title: 'Legibility is a product requirement, not a style preference',
  classification: 'DECISION',
  summary:
    'The reader must be able to read the app: a minimum type size enforced by a scale, a ' +
    'reader-controlled text-size setting, WCAG AA contrast on every text/background pair, and ' +
    '44px interactive targets. Asked for directly by the owner on 2026-09-18 ("제일 중요한 게 ' +
    '눈에 잘 보여야지"), and consistent with the spec line the visual system was already built on.',
  sourceBasis: [
    '01_TECHNICAL_IMPLEMENTATION_SPEC_v1.0.md §11: "learning clarity is more important than ' +
      'decorative effects"',
    'Owner request, 2026-09-18: text too small to read; must be legible first',
  ],
  governedRecords: [],
  blockedBy: [],
  constraints: [
    'The spec\u2019s visual language (warm white, blush, champagne gold, charcoal, botanical) is ' +
      'governed and was kept; only the values were adjusted until each pair measured 4.5:1.',
    'Enforced by tests/design-system.test.ts, which computes the ratios from the shipped ' +
      'stylesheet rather than trusting a palette chosen by eye.',
  ],
};

const PR_033: ProductProposal = {
  id: 'PR-033',
  title: 'The app follows the device\u2019s light or dark setting, and the reader may override it',
  classification: 'DECISION',
  summary:
    'Theme defaults to the device preference and offers Auto / Light / Dark. A phone set to dark ' +
    'showing a white page is unusable at night; a phone set to light showing a black page is ' +
    'unusable in sun. Both themes are held to the same contrast requirement.',
  sourceBasis: ['Owner request, 2026-09-18: readers have dark and light devices'],
  governedRecords: [],
  blockedBy: [],
  constraints: [
    'Neither theme may be the lesser one. The contrast test runs over both, and a token defined ' +
      'in one theme and not the other fails.',
  ],
};

const PR_034: ProductProposal = {
  id: 'PR-034',
  title: 'Read-aloud for on-screen learning text',
  classification: 'DECISION',
  summary:
    'The browser\u2019s own speech synthesis reads the passage, the question and the answer choices ' +
    'aloud, with the best voice the device has for the current language. No network call, no ' +
    'account, no audio leaving the device.',
  sourceBasis: [
    'AI Tutor Constitution §13.1: core content and UI are separable per locale',
    'Owner request, 2026-09-18: read it aloud, in a good voice',
  ],
  governedRecords: [],
  blockedBy: [],
  constraints: [
    'It reads only text already on screen. Nothing is generated, summarised or rephrased for ' +
      'speech, so CLAUDE.md rules 3 and 11 are untouched \u2014 it is the same text, spoken.',
    'Where the device has no voice for the language it says so and does nothing. Reading French ' +
      'in an English voice would mispronounce the words a learner is trying to learn.',
  ],
};

const PR_035: ProductProposal = {
  id: 'PR-035',
  title: 'French UI catalog',
  classification: 'DECISION',
  summary:
    'The third UI catalog, after English and Korean. French is one of the few locales both ' +
    'sources agree on, and is a working second language in the Laos market the Master Database ' +
    'names as the launch market.',
  sourceBasis: [
    'Master DB 15_LOCALIZATION registers FR',
    '02_GLOBAL_CONTENT_ENGINE_SPEC_v1.0.md lists French',
    'Owner request, 2026-09-18',
  ],
  governedRecords: [],
  blockedBy: [],
  constraints: [
    'UI chrome only. No French lesson content exists, so a French reader gets the interface in ' +
      'French and the lesson text in English with the fallback stated on screen \u2014 never passed ' +
      'off as a translation.',
    'Filling a registered locale does not resolve OQ-L01. The locale set is still unapproved.',
  ],
};

const PR_036: ProductProposal = {
  id: 'PR-036',
  title: 'Lao UI catalog \u2014 shipped as an unreviewed draft, and labelled as one',
  classification: 'DECISION',
  summary:
    'Lao (LOC-003) is the locale the Master Database calls the "Laos launch language" and the ' +
    'Constitution names the first localization target, and it had no catalog at all. One now ' +
    'exists. It was written without a Lao speaker, so it is registered UNREVIEWED_DRAFT, the app ' +
    'says so on every screen while Lao is selected, and the safety wording is shown with its ' +
    'English original underneath.',
  sourceBasis: [
    'Master DB 15_LOCALIZATION LOC-003, Stage=Market, Notes="Laos launch language"',
    'AI Tutor Constitution \u00a713.1: Lao is the first localization target',
    'Owner instruction, 2026-09-18, after being told review would be needed',
  ],
  governedRecords: [],
  blockedBy: [
    'Native review. Until a Lao speaker reads it, the wording is a draft and is presented as one.',
  ],
  constraints: [
    'CLAUDE.md rule 6 \u2014 safety outranks everything: an unreviewed catalog shows the English ' +
      'original beneath every safety escalation, so a mistranslated instruction cannot silently ' +
      'replace the one the reader must act on.',
    'CLAUDE.md rule 2 by analogy \u2014 an unreviewed translation is a draft and must not be ' +
      'presented as finished. CATALOG_REVIEW records the status; only a person can change it.',
    'No Lao lesson content exists and none was invented. Lesson text stays English with the ' +
      'fallback stated on screen.',
    'No device voice for Lao exists on typical hardware, so read-aloud reports that it cannot ' +
      'speak Lao rather than reading it in a Thai or English voice.',
  ],
};

export const PRODUCT_PROPOSALS: readonly ProductProposal[] = [
  PR_001, PR_002, PR_003, PR_004, PR_005, PR_006, PR_007, PR_008,
  PR_009, PR_010, PR_011, PR_012, PR_013, PR_014, PR_015, PR_016,
  PR_017, PR_018, PR_019, PR_020, PR_021, PR_022,
  PR_023, PR_024, PR_025, PR_026, PR_027,
  PR_028, PR_029, PR_030, PR_031,
  PR_032, PR_033, PR_034, PR_035, PR_036,
];

/* ── Conflicts that must be resolved before building ────────────────────── */

export interface ProposalConflict {
  readonly id: string;
  readonly proposalIds: readonly string[];
  /** The governed rule or register entry the proposal collides with. */
  readonly conflictsWith: string;
  readonly severity: 'MUST_RESOLVE' | 'CONSTRAINT';
  readonly detail: string;
  /** The posture that lets both hold. Not a decision — a proposal for one. */
  readonly proposedResolution: string;
}

export const PROPOSAL_CONFLICTS: readonly ProposalConflict[] = [
  {
    id: 'CF-001',
    proposalIds: ['PR-015', 'PR-016', 'PR-017', 'PR-018'],
    conflictsWith: 'AI-011 No Screen-Time Optimization (Approved, 필수) and Constitution C09',
    severity: 'MUST_RESOLVE',
    detail:
      'A growth loop that ends in SHARE → INVITE → RETURN is structurally an engagement loop. ' +
      'The Constitution forbids optimising anything above learning, and its anti-metrics ' +
      'explicitly reject session length, message volume and notification response as measures ' +
      'of success. Sharing designed to be wanted rather than demanded is consistent with that; ' +
      'sharing measured as a target is not.',
    proposedResolution:
      'Permit sharing as an outcome and never as an objective: no share prompt may gate content, ' +
      'no reward may attach to inviting, and no share or invite count may enter the success ' +
      'metric set. KN-D12-06-002 already states that growth is measured by capability rather ' +
      'than volume — apply that same rule to social metrics.',
  },
  {
    id: 'CF-002',
    proposalIds: ['PR-001'],
    conflictsWith: 'AI-020 No Fixed Identity (Approved, 필수) and Constitution C08',
    severity: 'CONSTRAINT',
    detail:
      'Opening with "나의 피부는 어떤 타입일까?" invites an answer shaped as a permanent label, ' +
      'which AI-020 forbids and which D02.3 (Type vs State) exists to correct.',
    proposedResolution:
      'Keep the entry point, constrain the output wording. MASTER_CONTEXT §04A already settled ' +
      'it: express a current observation and tendency, not an identity, and say plainly that ' +
      'this is not a medical assessment.',
  },
  {
    id: 'CF-003',
    proposalIds: ['PR-003', 'PR-008', 'PR-009'],
    conflictsWith: 'Recommendation gate G3 (evidence) — SR-011',
    severity: 'MUST_RESOLVE',
    detail:
      'Every product-facing surface in the proposal is a recommendation surface. All 10 rows of ' +
      '16_PRODUCTS are Status=Template, so G3 fails for every candidate and no fit answer, ' +
      'relevance line or ranking may render today.',
    proposedResolution:
      'Build the product surfaces against a verified product master, not before one. The gates ' +
      'are already implemented and will open on their own once the data passes.',
  },
  {
    id: 'CF-004',
    proposalIds: ['PR-005', 'PR-006'],
    conflictsWith: 'Evidence tiers A–D (SOURCE_RECONCILIATION_MASTER_REGISTER §7)',
    severity: 'CONSTRAINT',
    detail:
      'A manufacturer-declared concentration is Tier C brand documentation. It can support "this ' +
      'product declares X" and never "X produces an effect". Presenting the two at the same ' +
      'certainty is the failure the evidence layer exists to prevent.',
    proposedResolution:
      'Render the tier alongside every figure, and keep "declared" and "shown to do" as separate ' +
      'sentences that cannot be merged by a template.',
  },
  {
    id: 'CF-005',
    proposalIds: ['PR-002'],
    conflictsWith: 'MASTER_CONTEXT §05 adult/child separation; no legal basis established',
    severity: 'MUST_RESOLVE',
    detail:
      'A child pathway introduces a new category of personal data and a new safety surface, in a ' +
      'launch market that is itself undecided (OQ-L01). No source defines child-facing content, ' +
      'guardian consent or the applicable law.',
    proposedResolution:
      'Hold as OPEN QUESTION. Nothing child-facing is designed or built until a guardian model ' +
      'and a market legal review exist, and adult and child data remain separately stored.',
  },
  {
    id: 'CF-006',
    proposalIds: ['PR-007'],
    conflictsWith: 'AI Tutor Constitution §3.3 Hallucination Firewall',
    severity: 'CONSTRAINT',
    detail:
      'Filling a morning/evening template for every product would generate a procedural claim ' +
      'the source never made, for products whose How_To_Use field is empty.',
    proposedResolution:
      'Render usage only from the manufacturer instructions or a verified source. Where none ' +
      'exists, state that none is recorded rather than showing a default sequence.',
  },
];

/* ── Reporting ──────────────────────────────────────────────────────────── */

export const PROPOSAL_CONFLICTS_ADDENDUM: readonly ProposalConflict[] = [
  {
    id: 'CF-007',
    proposalIds: ['PR-024', 'PR-025'],
    conflictsWith: 'AI-007 Safety Escalation (Approved, 필수)',
    severity: 'CONSTRAINT',
    detail:
      'A learning canvas that reads free-text routine entries will sometimes receive a report of ' +
      'pain, spreading irritation or a worsening reaction. Treating that as a "usage ' +
      'understanding gap" and teaching into it would put learning ahead of safety.',
    proposedResolution:
      'Safety classification runs before gap detection, as it already does in the reflection ' +
      'reducer: a risk signal halts the canvas and routes to guidance rather than to a lesson.',
  },
];

export const proposalsByClass = (
  classification: GovernanceClass,
): readonly ProductProposal[] =>
  PRODUCT_PROPOSALS.filter((proposal) => proposal.classification === classification);

export interface ProposalSummary {
  readonly total: number;
  readonly byClass: Readonly<Record<string, number>>;
  readonly buildable: number;
  readonly mustResolveConflicts: number;
}

/** A proposal is buildable when nothing blocks it. Classification alone never unblocks work. */
export const proposalSummary = (): ProposalSummary => ({
  total: PRODUCT_PROPOSALS.length,
  byClass: PRODUCT_PROPOSALS.reduce<Record<string, number>>((acc, proposal) => {
    acc[proposal.classification] = (acc[proposal.classification] ?? 0) + 1;
    return acc;
  }, {}),
  buildable: PRODUCT_PROPOSALS.filter((proposal) => proposal.blockedBy.length === 0).length,
  mustResolveConflicts: PROPOSAL_CONFLICTS.filter((c) => c.severity === 'MUST_RESOLVE').length,
});
