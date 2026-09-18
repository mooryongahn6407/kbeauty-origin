# ENGINEERING STATUS

**Project:** KOREA GLOW Beauty Learning World
**Date:** 2026-09-18
**Phase:** Engineering initialization + first vertical slice + Ingredient Garden
**Branch:** `claude/laughing-babbage-acxc3h`

---

## 1. Repository assessment

The repository contained exactly one file: `INDEX.html.txt`, a static e-commerce landing page
("K-Beauty Origin by JY Global", 120-product grid with an inline admin panel). It is unrelated
to the Beauty Learning World and has been left untouched.

| Aspect | Before | Now |
|---|---|---|
| Framework | none | React 18 + TypeScript 5.7 |
| Build | none | Vite 6 |
| Package manager | none | npm |
| Tests | none | Vitest 2 — 115 tests |
| Database | none | Versioned JSON extracted from the official workbooks |
| Deployment config | none | none (static `dist/`; no target chosen) |
| Env vars | none | none required |

All 16 supplied source files are committed verbatim under `sources/`.

## 2. Architecture

Full detail in `docs/ARCHITECTURE.md`. All twelve required concerns are separated:

```
src/
├── domain/        entities, governance vocabulary, learning types
├── knowledge/     repository over extracted source data; strand taxonomy layer
├── governance/    publication gate, referential integrity, open-item register, reporting
├── safety/        R0-R4 risk tiers, stop conditions, recommendation gates G1-G6
├── mastery/       four-dimension mastery engine (M01-M06)
├── tutor/         seven-stage runtime, mode router, hint ladder, structured output
├── content/       authored atoms, locale variants, 11-platform derivation
├── localization/  locale registry (union of two conflicting sources), UI catalog
├── analytics/     learning event sink
├── persistence/   in-memory (prototype)
├── app/           learning-session reducer (the use case layer)
└── ui/            shell, My Skin slice, governance screen, placeholders
```

Dependency direction is inward. `src/domain/` imports no React; `src/ui/` decides no governance
question.

### Three gates, each returning a decision **and** the disclosures the UI must render

1. **Publication gate** — `VERIFIED_FACT` needs `Status=Approved` AND `Evidence_Status=Verified`.
   `Anchor` is deliberately insufficient. `Archived`/`Template` are blocked outright.
2. **Safety gate** — classifies R0–R4, takes the highest matching tier, stops commerce at R2+,
   ends learning at R4.
3. **Recommendation gate** — G1…G6; all six must pass or no commerce CTA renders.

### The 58-vs-92 question was **not** decided

`CANONICAL_TAXONOMY_ID` is `null`. Both representations are registered as named views:

| View | Rows present | Count stated in document |
|---|---|---|
| Master Database strand rows | 92 | — |
| Curriculum explicitly coded strand rows | 41 | 58 |

`resolveStrandView()` returns the working view plus a `WORKING_DATASET` disclosure and the
SR-001 open item. The working mapping is preserved verbatim: **35 exact matches, 4 naming
variations, 53 open, 5 uncoded curriculum groupings**. No row was renamed, merged or deleted.
When an owner approves a canonical set, setting that one constant is the entire change.

## 3. Files created

**Build config (6):** `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.ts`,
`vitest.config.ts`, `.gitignore`, `index.html`, `public/favicon.svg`

**Sources (16):** `sources/` — all official documents, committed unchanged

**Extraction (2):** `scripts/xlsx-reader.mjs` (dependency-free read-only OOXML reader),
`scripts/extract-sources.mjs`

**Data (26):** `data/source/*.json` (25 datasets + `_manifest.json` with per-workbook sha256),
`data/authored/first-slice.json`

**Source (24 TypeScript/TSX modules)** across the twelve layers above

**Tests (8):** `tests/source-integrity`, `governance-gates`, `learning-slice`, `mastery-engine`,
`tutor-runtime`, `content-governance`, `strand-taxonomy`, `localization`

**Docs (3):** `CLAUDE.md`, `docs/ARCHITECTURE.md`, `docs/SOURCE_OF_TRUTH.md`, this file

**Unchanged:** `INDEX.html.txt`

## 4. Data model

Typed entities exist for every item the handoff command listed. Source-derived entities keep
the Master Database column names exactly (`Node_ID`, `Strand_Code`, `Evidence_Status`, `Status`,
`Version`) so traceability survives; application fields are added alongside, never in place of them.

Extracted record counts, all matching the source `99_DASHBOARD`:

| Dataset | Rows | | Dataset | Rows |
|---|---|---|---|---|
| domains | 12 | | quests | 25 |
| strands | 92 | | quest-node-map | 71 |
| knowledge-nodes | 212 | | ai-rules | 20 |
| skills | 12 | | evidence-sources | 10 |
| node-skill-map | 266 | | localization | 7 |
| ingredients | 40 | | products | 10 |
| concerns | 15 | | relations | 408 |
| product-categories | 32 | | mastery-rules | 6 |
| routines | 10 | | content-atoms | 20 |

`UserProfile` has **no** `skinType` field — AI-020 and Constitution §12 forbid fixed identity
labels. Observations are timestamped events, not attributes.

## 5. Working user flow

`My Skin` → `QST-001` Mirror Detective → node `KN-D01-07-001` (Skin Observation) → skill `SK01`
Observe. Verified by driving the running app in Chromium:

```
[after lesson]     Question
[after think]      Take a moment
[after hint]       Hint          (H1 revealed, hintsUsed=1)
[wrong answer]     Feedback -> Hint      (loops back, does not advance)
[right answer]     Feedback -> Reflect
[after reflection] Mastery evidence
mastery: Accuracy 1/2 · Independence 1/2 · Transfer 0/0 · Retention 0/0 -> Developing
attempts logged: 2
transfer activity: starts cleanly, hint counter resets
Korean locale: renders directly, no fallback
Governance screen: 9 open items, 5 dangling references
console errors: none
```

These are real state transitions in a pure reducer, not static screens. The four mastery
dimensions each show their governing rule (M01–M04), threshold and minimum sample size.

### Ingredient Garden

The learning session was generalised from a hard-coded slice to a **lesson plan**, and the
lesson UI extracted into a shared `LessonRunner`. Both worlds now run on the same engine —
which is what proves it generalises. Verified in Chromium:

```
Ingredient Garden
  open lesson: 단일 성분 halo effect   (D11 11.2 Ingredient Halo · SK06 Evaluate Claims)
  status tags: Open | Closed | Closed | Closed
  QST-008 Ingredient Garden  -> 8 blockers (KN-D06-01-001 … unverified + unresolved evidence)
  QST-009 Humectant Hunt     -> 6 blockers
  QST-010 Barrier Lipid Trio -> 6 blockers
  catalog: 26 families, 40 records, expandable
  lesson run end-to-end; mastery recorded against SK06, not SK01
  Korean locale renders directly, no fallback
console errors: none
```

The three governed quests are **wired to their real 12_QUEST_NODE_MAP node lists and correctly
closed** — each blocker names the exact record, reason and register entry. This is the
publication gate doing its job on real content, not a placeholder screen.

One lesson *is* open: ingredient literacy, grounded in `KN-D11-02-001` (Ingredient Halo) with
skill `SK06`. It teaches that naming an ingredient establishes presence and an editorial
choice, not effect or quantity — a reasoning skill that asserts nothing about what any
ingredient does, and therefore does not depend on the unverified ingredient corpus.

## 6. Tests and exact results

```
$ npm test

 ✓ tests/ingredient-garden.test.ts  (35 tests)
 ✓ tests/governance-gates.test.ts   (18 tests)
 ✓ tests/tutor-runtime.test.ts      (18 tests)
 ✓ tests/learning-slice.test.ts     (16 tests)
 ✓ tests/content-governance.test.ts (15 tests)
 ✓ tests/mastery-engine.test.ts     (13 tests)
 ✓ tests/strand-taxonomy.test.ts    (12 tests)
 ✓ tests/localization.test.ts       (12 tests)
 ✓ tests/source-integrity.test.ts   (11 tests)

 Test Files  9 passed (9)
      Tests  150 passed (150)
   Duration  1.50s

$ npm run typecheck     # clean
$ npm run build         # dist/index.html 0.57 kB, index.css 5.91 kB, index.js 437.43 kB (gzip 98.89 kB)
$ npm run verify:sources
OK: 25 datasets match the official sources.
```

The suite covers what the checklist asked for: unit, integration, learning-state, safety,
status-gating and localization tests.

### Three real defects the tests caught during this build

1. `lesson_completed` was never emitted on the normal completion path (the terminal action was
   a no-op once the phase was already `COMPLETE`). Fixed in the reducer.
2. The Korean risk-signal list held only the verb stem `아프`, so the common conjugation
   `아파요` ("it hurts") did not raise R2. Inflected forms added; the table is still marked
   `APPROVAL_REQUIRED` pending linguistic and clinical review.
3. A draft M06 test asserted that one wrong answer reopens a mastered skill. It does not, and
   should not — 5/6 still clears the 80% threshold. The test was wrong, not the engine.

During the Ingredient Garden build, a suspected fourth defect turned out **not** to be one: a
check of node `Strand_Code`/`Strand_Name` against `02_STRANDS` found 0 mismatches across all
212 nodes. The taxonomy fields are internally consistent; the problem is content placement
(OQ-S01 below), which is a different and softer finding. It is recorded here because the
distinction matters: no schema repair is warranted.

## 7. Unresolved governance questions

All carried in `src/governance/open-items.ts` and rendered on the in-app Content Governance
screen. Nothing below was decided in code.

| ID | Severity | Issue | What the app does |
|---|---|---|---|
| SR-009 / OQ-02 | BLOCKER | All 212 Knowledge Nodes are `Draft` (evidence: 92 Anchor, 120 To Review) | Publication gate returns `PENDING_VERIFICATION` for every node; **0 records can be stated as fact anywhere** |
| SR-004…007 | BLOCKER | QST-006, QST-011, QST-012, RUT-001 reference 5 node IDs that do not exist | Integrity checker reports each; affected quests marked incomplete; no node invented |
| SR-011 | BLOCKER | All 10 product rows are `Template` | Gate blocks them; recommendation gate G3 fails for every candidate, so no commerce CTA can render |
| SR-014 / OQ-06 | BLOCKER | Market safety thresholds and escalation wording unapproved | Signals held in a replaceable table marked `APPROVAL_REQUIRED`; gate errs toward escalation; all copy routed through localization |
| SR-001 / OQ-01 | CRITICAL | 58 vs 92 strands | Both registered as views; canonical left `null` |
| SR-002 / SR-003 | CRITICAL | Concept and Scenario are curriculum entities absent from the DB schema | Neither invented; Scenario-shaped data kept inside authored activities so a future first-class entity can absorb it |
| SR-012 | OPEN | AI rules mixed Approved/Draft vs a broader Constitution | Only Approved + 필수 rules are enforced as hard gates; Draft rules readable but not enforced |
| SR-013 | OPEN | Mastery rules state ratios but no sample size | Minimum attempt counts in one table, labelled an engineering DECISION |
| **OQ-E01** | BLOCKER | **New finding.** The 92 nodes marked `Evidence_Status=Anchor` cite `FDA-01`, `EU-01`, `AAD-01..03` — the AI Tutor Constitution §17 label namespace. `14_EVIDENCE` registers `SRC-001…SRC-010`. **0 of 92 references resolve**, so evidence traceability is broken for every node claiming an anchor | Each unresolved reference reported; no `Source_ID` rewritten and no mapping guessed, since picking which registered source a claim was anchored to is a governance decision and a wrong guess attaches a node to the wrong evidence. Treated as blocking for scientific claims |
| **OQ-S01** | CRITICAL | **New finding.** In D06, node content is filed one strand later than its subject from 06.3 onward — "Retinol 기본" under *06.8 Exfoliating Acids*, "Niacinamide 기본 개념" under *06.5 Barrier Lipids*, "Panthenol 기본" under *06.9 Retinoid Family*. Breaks QST-010, QST-011, QST-012, whose supporting nodes are about a different subject from the quest | Detected from governed vocabulary only (an ingredient named in a node title whose `Family` matches a different strand in the same domain). 5 nodes reported as **suspicions needing owner confirmation** — the fix could be to move the node, rename the strand or re-title the node. Nothing is moved |
| **OQ-L01** | OPEN | **New finding.** Master DB `15_LOCALIZATION` defines 7 locales including Lao ("Laos launch language") and Portuguese; the Global Content Engine spec lists 10 languages that include Chinese, Japanese, Italian, Vietnamese and Indonesian but **omit Lao**. AI Tutor Constitution §13.1 names Lao as the first localization target. The two sets are not equal and neither is approved | Union of both registered (12 locales), each tagged with its defining source; per-locale coverage reported |

### Classification of decisions made during this build

- **CONFIRMED** (from sources): 12 domains; learning hierarchy; four mastery dimensions;
  seven-stage AI runtime; H0–H4 ladder; R0–R4 tiers; G1–G6 gates; education before commerce.
- **DECISION** (engineering, reversible, documented): React + Vite + Vitest; JSON extraction with
  sha256 provenance; `ClaimClass` as the anti-fabrication mechanism; mastery minimum sample sizes
  (SR-013); Master DB strand view as the working dataset; `QST-001` as the first slice.
- **OPEN QUESTION**: everything in the table above.
- **REJECTED** (never implemented): medical diagnosis; fabricated claims; fear/shame framing;
  fixed skin-type identity labels; commerce that manufactures educational need.

## 8. Known technical blockers

1. **No approved knowledge to teach.** The single largest blocker. The architecture is complete
   and gated, but with 0 verified records the product can teach only reasoning skills, not
   beauty facts. Unblocking this is a governance task (SR-009), not an engineering one.
2. **Ingredient Garden's three governed quests cannot open.** QST-008, QST-009 and QST-010 all
   ask what an ingredient *does*, which is a scientific claim, and every node and ingredient
   record they stand on is unverified — compounded by OQ-E01, which means their evidence
   citations do not resolve either. The world ships with its catalog, its real quest wiring and
   one reasoning lesson; the function-matching quests stay closed until the records pass.
3. **No authored content beyond the two lessons.** `21_CONTENT_ATOMS` holds 20 templated rows
   with placeholder hooks and no question options, so it cannot drive a lesson. The four
   authored atoms and four activities in `data/authored/` are explicitly labelled prototype
   scaffolding and make only pedagogical and safety-boundary claims.
4. **No AI generation layer.** The tutor runtime, router, ladder and gates are implemented and
   tested deterministically; no model call is wired up, because there is nothing it may state
   as fact. Appendix B of the Constitution requires steps 1–5 to be stable before commerce work.
5. **Translations exist for en + ko only.** 10 of 12 registered locales have 0% coverage.
   Filling them requires human translation and local-market review, not machine text.
6. **Persistence is in-memory.** Session state and mastery do not survive a reload; no database
   or auth has been chosen.
7. **No deployment target chosen.** `npm run build` produces a static `dist/`.
8. **npm audit reports 5 advisories** in the dev toolchain (Vite/esbuild dev-server class).
   They do not affect the production bundle; worth resolving before any hosted deployment.

## 9. Next coding step

**Governance first — three decisions, none of which are mine to make:**

1. **OQ-E01 — reconcile the evidence ID namespaces.** This is now the highest-leverage item.
   Every node that claims an evidence anchor cites an ID that does not exist in the registry,
   so even approving a node's `Status` would leave its evidence chain broken. Decide whether
   `14_EVIDENCE` adopts the `FDA-01`/`EU-01`/`AAD-0n` IDs, or the nodes are re-pointed at
   `SRC-nnn`, and record the mapping in the workbook. One decision unblocks all 92 anchors.

2. **OQ-S01 — confirm or correct the D06 strand placement.** Until this is settled, QST-010,
   QST-011 and QST-012 would teach the wrong subject even if their records were approved.
   Five nodes are flagged with evidence; a curriculum owner decides whether to move the node,
   rename the strand, or re-title the node.

3. **SR-009 / SR-010 — approve a small evidence seed set.** With OQ-E01 resolved, pick the
   D06 strand 06.2 cluster (`KN-D06-02-001/002/003` + `ING-001`, `ING-002`, `ING-003`) — it is
   the one place where node content, strand and ingredient family already agree, and the three
   humectant records are among the only ingredients carrying a reference URL. Approving it
   opens QST-009 Humectant Hunt with no code change.

**Then, in code:** build the QST-009 function-matching activity. The availability gate, quest
wiring, catalog and lesson runner are already in place, so that work is authoring a content
pack plus a matching interaction type — not new architecture.

Exact next command once step 3 lands:

```
npm run extract:sources && npm test
```

## 10. How to run the project

```bash
git clone <repo> && cd kbeauty-origin
npm install

npm run dev       # http://127.0.0.1:5173  — My Skin slice + Content Governance screen
npm test          # 115 tests
npm run build     # typecheck + production build into dist/
```

Requires Node 22+. No environment variables, no database, no API keys.
