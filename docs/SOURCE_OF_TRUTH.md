# Source of Truth

## Hierarchy

Encoded from `00_CLAUDE_MASTER_CODING_HANDOFF_COMMAND_v1.0.md` and confirmed by
`KOREA_GLOW_SOURCE_RECONCILIATION_MASTER_REGISTER_v1.0.docx` §2.

| Priority | Source | Authority |
|---|---|---|
| 1 | Product Charter / Experience Vision (`KOREA_GLOW_Beauty_Learning_World_Concept_v0.1.docx`) | Mission, North Star, non-negotiable principles |
| 2 | Beauty Curriculum & Knowledge Tree v1.0 | Learning hierarchy, curriculum, mastery |
| 3 | Beauty Knowledge Master Database v1.0 | Entities, IDs, relations, evidence, content backbone |
| 4 | Beauty AI Tutor Constitution + Prompt Architecture v1.0 | AI behaviour, grounding, safety, tutoring |
| 5 | Approved Evidence Sources (`14_EVIDENCE`) | Factual grounding |
| 6 | Product / Catalog Data (`16_PRODUCTS`) | Commercial layer |
| 7 | New proposals | Not authoritative until approved |
| 8 | AI assumptions | Lowest; must be labelled |

Context layers that do **not** override the four official sources:
`MASTER_CONTEXT_v1.0`, `SKIN_QUEST_2_0_Ecosystem_Blueprint_v1.0`,
`Beauty_Mastery_Competency_Matrix_v1.0` (explicitly "DECISION DRAFT — NOT CANONICAL").

All source files are committed verbatim under `sources/`.

## How source data enters the codebase

```
sources/*.xlsx  --(scripts/extract-sources.mjs)-->  data/source/*.json  --> src/knowledge/repository.ts
```

`scripts/extract-sources.mjs` copies every cell verbatim. It performs **no** normalisation,
de-duplication, status inference or reference repair. `data/source/_manifest.json` records the
sha256 of each workbook, so drift between the committed JSON and the official file is detectable:

```
npm run verify:sources   # exits non-zero if data/source/ no longer matches sources/
```

## Non-negotiable rules, and where they are enforced

| Rule | Enforced in | Tested by |
|---|---|---|
| Never change, delete, merge or rename a source ID | `scripts/extract-sources.mjs`, `src/knowledge/repository.ts` | `tests/source-integrity.test.ts` |
| Never treat Draft/Review data as Approved | `src/governance/publication-gate.ts` | `tests/governance-gates.test.ts` |
| Never fabricate scientific/ingredient/product/safety facts | `src/content/types.ts` (`ClaimClass`), authored pack | `tests/content-governance.test.ts` |
| Preserve evidence, status, version, provenance | `src/domain/entities.ts`, `ProvenanceStrip` | `tests/source-integrity.test.ts` |
| Do not resolve 58-vs-92 in code | `src/knowledge/strand-taxonomy.ts` | `tests/strand-taxonomy.test.ts` |
| Safety before learning, engagement and commerce | `src/safety/safety-gate.ts` | `tests/governance-gates.test.ts`, `tests/tutor-runtime.test.ts` |
| Education before commerce | `evaluateRecommendationGates` (G1–G6) | `tests/tutor-runtime.test.ts` |
| Do not invent a missing entity | `findNode` returns `undefined`; `src/governance/integrity.ts` reports | `tests/source-integrity.test.ts` |

## Source state as extracted (2026-09-18)

| Dataset | Rows | Governance state |
|---|---|---|
| `01_DOMAINS` | 12 | Approved |
| `02_STRANDS` | 92 | Approved rows, but the taxonomy itself is OPEN (SR-001) |
| `03_KNOWLEDGE_NODES` | 212 | **All `Draft`**. Evidence: 92 `Anchor`, 120 `To Review` |
| `04_SKILLS` | 12 | — |
| `06_INGREDIENTS` | 40 | All `Draft`, evidence "Seed / Verify" (SR-010) |
| `11_QUESTS` | 25 | All `Draft`; 3 reference missing nodes (SR-004…006) |
| `13_AI_RULES` | 20 | Mixed Approved/Draft (SR-012) |
| `14_EVIDENCE` | 10 | Registry only |
| `15_LOCALIZATION` | 7 | Conflicts with the 10-language spec (OQ-L01) |
| `16_PRODUCTS` | 10 | All `Template` — no usable product data (SR-011) |
| `19_MASTERY_RULES` | 6 | Ratios without sample sizes (SR-013) |
| `21_CONTENT_ATOMS` | 20 | All `Draft`; templated text, no authored questions |

### Two further integrity findings (observed 2026-09-18)

| ID | Finding |
|---|---|
| OQ-E01 | The 92 nodes marked `Evidence_Status=Anchor` cite `FDA-01`, `EU-01`, `AAD-01..03` (the AI Tutor Constitution §17 label namespace). `14_EVIDENCE` registers `SRC-001…SRC-010`. **0 of 92 resolve.** |
| OQ-S01 | In D06, node content is filed one strand later than its subject from 06.3 onward. `Strand_Code`/`Strand_Name` agree with `02_STRANDS` on all 212 nodes, so this is content placement, not a schema break. 5 nodes flagged as suspicions. |

Both are reported by `src/governance/integrity.ts` and rendered on the in-app governance
screen. Neither is repaired in code.

**Consequence:** zero records in the corpus currently pass the publication gate. Nothing in the
application may be stated as verified fact. This is not a bug; it is the source state.
