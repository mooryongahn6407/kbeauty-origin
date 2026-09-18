# ENGINEERING STATUS

**Project:** KOREA GLOW Beauty Learning World
**Date:** 2026-09-18
**Phase:** All seven MVP experiences built + governance instrumentation
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

### Routine Studio

Every routine record is Approved but carries no evidence linkage at all (OQ-R01), so the
product must not tell anyone what their routine should be, in what order, or how many steps it
should have. The world therefore ships three honest things. Verified in Chromium:

```
Routine Studio
  open lesson: 제품 역할로 순서 판단하기   (D08 08.3 Order Logic · SK05 Sequence)
  QST-007 Routine Rescue: Closed, 4 blockers
    OQ-R02 warning rendered: "the quest asks for 4 step(s) while its core node
    KN-D08-04-001 '3-step routine 만들기' teaches 3"
  catalog: 10 records · 10 Approved · 0 may be stated as fact
           5 ordered sequences, 5 recorded as prose
           1 with a broken node reference · evidence column present: no
    RUT-001 tagged "Approved · SR-007"; KN-D04-02-003 shown as "Referenced node does not exist"
  reflection studio: 4 steps listed -> "2 of 4 steps have a purpose you stated"
  safety halt: a step written as "이 단계 하고 나면 너무 아파요" halts the tool,
               stores 0 steps, and shows the R2 escalation message
console errors: none
```

1. **The governed routine catalog**, shown as records rather than advice. Prose sequences are
   printed as written and never split into invented steps; the broken `KN-D04-02-003` link in
   RUT-001 is shown in place rather than dropped.
2. **QST-007**, wired to its real node map and reported as unauthorable.
3. **A reflection studio and one reasoning lesson** — what the product can honestly offer. The
   studio asks the learner to list their own steps and say what each is for, then counts what
   they could account for. It ranks nothing, recommends nothing and has no "ideal" step count
   to compare against, because there is no approved basis for one. A test asserts the state
   object contains no score field at all. Free text runs through the safety gate first, so a
   step or purpose carrying a risk signal halts the tool before it is stored.

The one open lesson teaches the reasoning that precedes any ordering judgement — you cannot
evaluate a step until you can say what it is for and how you would notice — and so asserts
nothing about what a routine should contain.

One lesson *is* open: ingredient literacy, grounded in `KN-D11-02-001` (Ingredient Halo) with
skill `SK06`. It teaches that naming an ingredient establishes presence and an editorial
choice, not effect or quantity — a reasoning skill that asserts nothing about what any
ingredient does, and therefore does not depend on the unverified ingredient corpus.

## 6. Tests and exact results

```
$ npm test

 ✓ tests/reducer-purity.test.ts     (40 tests)
 ✓ tests/ingredient-garden.test.ts  (35 tests)
 ✓ tests/routine-studio.test.ts     (30 tests)
 ✓ tests/ai-tutor.test.ts           (32 tests)
 ✓ tests/localization.test.ts       (36 tests)
 ✓ tests/quest-mastery.test.ts      (25 tests)
 ✓ tests/speech.test.ts             (25 tests)
 ✓ tests/label-detective.test.ts    (27 tests)
 ✓ tests/sun-protection.test.ts     (27 tests)
 ✓ tests/design-system.test.ts      (69 tests)
 ✓ tests/product-proposals.test.ts  (23 tests)
 ✓ tests/governance-gates.test.ts   (18 tests)
 ✓ tests/tutor-runtime.test.ts      (18 tests)
 ✓ tests/learning-slice.test.ts     (28 tests)
 ✓ tests/content-governance.test.ts (15 tests)
 ✓ tests/mastery-engine.test.ts     (13 tests)
 ✓ tests/strand-taxonomy.test.ts    (12 tests)
 ✓ tests/source-integrity.test.ts   (11 tests)

 Test Files  18 passed (18)
      Tests  484 passed (484)
   Duration  2.8s

$ npm run typecheck     # clean
$ npm run build         # dist/index.html 0.57 kB, index.css 12.49 kB, index.js 694.80 kB (gzip 172.06 kB)
$ npm run verify:sources
OK: 27 datasets match the official sources.
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
| **OQ-R01** | CRITICAL | **New finding.** `09_ROUTINES` has columns `Routine_ID`, `Routine_Name`, `Description`, `Default_Sequence`, `Status` — and **no evidence linkage column**. All 10 rows are `Approved`, yet a sequence such as "정돈 → 선택적 트리트먼트 → 보습 → 자외선 보호" is a procedural claim, and `SRC-003` (AAD, routine order) already exists to support it. There is no field in which that link could be recorded. Separately, 5 of 10 sequences are prose, not step lists | The gate already refuses to state an Approved-but-unevidenced routine as fact. Prose sequences are printed as written, never split into invented steps. The missing column is a schema change and is not worked around in code |
| **OQ-R02** | OPEN | **New finding.** `QST-007` "Routine Rescue" asks for a **4**-step routine, while its Core node `KN-D08-04-001` is "**3**-step routine 만들기" and the governed minimal routine `RUT-003` has 3 steps. The only numeric contradiction of its kind across all 25 quests | Detected by comparing integers in each quest `Win_Condition` against its Core node title. Neither number is chosen; the quest is reported as unauthorable and stays closed |
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
2. **Routine Studio can describe routines but not prescribe them.** All 10 routine records are
   Approved with no field in which to cite evidence (OQ-R01), so no routine may be presented as
   correct, and QST-007 cannot be authored until OQ-R02 settles whether the target is 3 or 4
   steps. The world ships its catalog, the quest's real wiring, a reflection tool and one
   reasoning lesson.
3. **Ingredient Garden's three governed quests cannot open.** QST-008, QST-009 and QST-010 all
   ask what an ingredient *does*, which is a scientific claim, and every node and ingredient
   record they stand on is unverified — compounded by OQ-E01, which means their evidence
   citations do not resolve either. The world ships with its catalog, its real quest wiring and
   one reasoning lesson; the function-matching quests stay closed until the records pass.
4. **No authored content beyond the three lessons.** `21_CONTENT_ATOMS` holds 20 templated rows
   with placeholder hooks and no question options, so it cannot drive a lesson. The four
   authored atoms and six activities in `data/authored/` are explicitly labelled prototype
   scaffolding and make only pedagogical and safety-boundary claims.
5. **No AI generation layer.** The tutor runtime, router, ladder and gates are implemented and
   tested deterministically; no model call is wired up, because there is nothing it may state
   as fact. Appendix B of the Constitution requires steps 1–5 to be stable before commerce work.
6. **French and Lao are unreviewed translations, and no locale has translated lesson content.**
   4 UI catalogs (en, ko, fr, lo) cover 4 of 12 registered locales. **Neither fr nor lo has been
   read by a speaker of the language**; both are registered `UNREVIEWED_DRAFT`, the app says so
   on every screen while they are selected, and safety wording carries its English original
   underneath. Lesson text is English in every locale, with the fallback stated on screen.
   Clearing this is a market task — a Lao and a French reviewer — not an engineering one.
7. **Persistence is in-memory.** The reflection studio's entries, the exposure log and the
   mastery ledger are all lost on reload. Session state and mastery do not survive a reload; no database
   or auth has been chosen. This is also why a lesson session is lost when the learner navigates
   to another world and back: the remount is genuinely a new session, and is counted as one.
8. **No deployment target chosen.** `npm run build` produces a static `dist/`.
9. **npm audit reports 5 advisories** in the dev toolchain (Vite/esbuild dev-server class).
   They do not affect the production bundle; worth resolving before any hosted deployment.

## 9. Next coding step

Three MVP worlds run (My Skin, Ingredient Garden, Routine Studio) on one learning engine, and
the governance layer now instruments itself: referential integrity, evidence resolution, strand
placement and numeric consistency are all audited on every test run.

### Numeric consistency audit

Added on request, generalising the one-off QST-007 check into a standing audit. Six checks,
**25 numeric claims compared, 1 governance warning**:

| Check | Compared | Warnings |
|---|---|---|
| Quest win condition vs its Core node title | 1 | **1** (QST-007, OQ-R02) |
| Routine name vs step count | 1 | 0 |
| Routine description vs step count (range-aware) | 1 | 0 |
| README MVP seed counts vs rows present | 7 | 0 |
| Dashboard per-domain node counts vs rows | 12 | 0 |
| Mastery rule thresholds vs the engine's constants | 3 | 0 |

The last check compares **code against a source**, so the mastery engine drifting from the
approved rule text would be caught as a contradiction too. `AUDIT_COVERAGE` reports the three
requested concepts not yet covered (questions per lesson, choices per question, day counts) and
why — no source states them, so there is nothing to compare against.

### Sun Protection

The domain where fabrication would do most harm, and where the evidence position turns out to be
the weakest in the whole corpus. Three findings, all verified against the source:

- All 13 D04 nodes — including "SPF의 의미", "광범위 자외선 차단" and "재도포의 기본 원칙" —
  cite the general AAD "Skin care basics" page.
- `14_EVIDENCE` contains **no source about sun, UV or SPF at all**.
- AI Tutor Constitution §17 cites `AAD-05` "Right Sunscreen" (broad-spectrum, SPF 30+, water
  resistance), but **no node cites it and it is not in the registry**. `AAD-04` "Product Order"
  and `FDA-02` are likewise unregistered and uncited.

So the world ships with **no guidance on what protection to use, how much, or how often**, and
says so. Verified in Chromium:

```
Sun Protection
  open lesson: 일상 속 선케어 점검   (D04 04.6 Daily Protection Planning · SK07 Decide)
  exposure log: 2 periods -> "2 period(s) recorded, 65 minutes in total"
                Open 40 min · Shade 25 min · Midday 65 min · other bands "Not recorded"
  safety halt: "햇빛에 타서 너무 아파요" halts the log, stores 0 entries, shows R2 guidance
  evidence panel: 13/13 nodes cite AAD-02 = SRC-001 "Skin care basics"
                  unregistered Constitution labels: FDA-02, AAD-04, AAD-05 Right Sunscreen
  QST-004 UV Detective and QST-005 Sunscreen Label Decoder: both Closed, 12 blockers
console errors: none
```

The exposure log records only what the user was present for: activity, coarse time band,
setting and minutes. It produces counts and nothing else — no score, no threshold, no risk
level, and a test asserts the state object carries no such field. Time bands with no entry are
labelled "Not recorded", because a gap in the log is not a statement about the day.

Two tests exist specifically to stop the domain drifting: one scans every authored variant and
every sun UI string for SPF figures, PA ratings, broad-spectrum wording or reapplication
intervals; the other asserts the safety-boundary copy says the silence is **about this app's
evidence and not about whether protection matters**, in both locales. An omission that read as
reassurance would be its own false claim.

### Quests & Mastery — the last MVP experience

All seven MVP experiences now run. This one is a map of what is locked and why, not a progress
bar, because that is what the corpus actually supports:

```
Quest map — 7 of 25 quests can open · 12 worlds · 2 already served by a lesson
  3 blocked by a record that does not exist (QST-006, QST-011, QST-012)
  every locked quest names the record and register entry stopping it
Mastery — 12 governed skills, evidence carried across all worlds
  answering in Label Detective and My Skin: 2 attempts, SK06 and SK01 each 1/1
```

**Nothing awards points.** `11_QUESTS` carries Reward labels — XP on 8 quests, Badge on 11,
and Card, Collection, Seed, Boss, Crown on one or two each — but a search of every extracted
dataset found **no amount stated for any of them**, and the seven-level ladder in the Competency
Matrix is marked "PROPOSED — NOT CANONICAL". So labels are shown verbatim, nothing is totalled,
and no learner is assigned a level. The ladder is rendered with every row tagged PROPOSED.

Mastery is reported instead, per governed skill, from a **cross-lesson ledger**. Its API has
`record`, `stateFor`, `snapshot` and `reset` — and deliberately no grant, award, unlock or
setLevel. A test asserts that surface exactly, so a screen cannot hand out a level and no
commercial or loyalty state can reach it (CLAUDE.md rule 9).

Claim class per quest is an engineering **DECISION**, held in one reviewable table with a stated
reason for each of the 7 quests that depart from the SCIENTIFIC default.

#### A real defect the browser run caught

The first end-to-end run recorded **4 attempts for 2 answers**. The cause: the session reducer
performs side effects (`sink.record`, `masteryLedger.record`), and React StrictMode deliberately
invokes reducers twice in development to surface exactly that. The learner's evidence count was
wrong on screen.

Fixed properly rather than by removing StrictMode: attempt IDs now include the answer timestamp,
making them genuinely unique, and the ledger is **idempotent per `attemptId`** — recording the
same attempt twice counts once, which is what an ID should mean regardless of React. A test
covers it, and the test fixture was corrected too: it had reused one ID for every attempt, which
would have masked the bug.

**Resolved since:** the analytics `EventSink` had the same shape and would double-count events
in a development build. The reducers are now pure and the sink is written from one guarded
drain. See "Reducer purity" below.

### AI Tutor — a trust layer, not an answer generator

The tutor generates **no prose**. With nothing in the corpus approved, a generative answer
could only be fluent invention, and §16's RED TEAM note is explicit that in this category
fluency hides hallucination. So the surface is inverted: instead of an answer it shows what was
understood, which governed records were retrieved, which parts of a response can be filled
honestly, what stays uncertain, and the full seven-stage trace. A test asserts `message` is
`null` on every branch.

Three modules were added:

- **`retriever.ts`** — stage 2 (Ground), named as required by §15.1. Searches all 309 governed
  records, returns each candidate with its own publication decision and whether its evidence
  citation resolves. Korean is handled with sliding n-grams so `성분표에서` recovers `성분표`
  without a morphology table. **A query that matches nothing returns nothing.**
- **`mode-contract.ts`** — the §10 output skeletons as declared slots. Each slot reports whether
  it can be filled honestly and why not. A `RECOMMEND` response shows **0 of 5** slots fillable;
  `SAFETY` always shows 3 of 3, because a safety message must never be withheld for lack of
  curriculum.
- **`evaluation-suite.ts`** — the §16 scenarios as executable cases.

```
Constitution §16 evaluation suite — 10 of 10 pass
  T01 treatment claim      SAFETY · R2      T06 product demand   RECOMMEND · R0 · DECIDE
  T02 humectant hunt       TEACH · H0       T07 three failures   REMEDIATE · H3
  T03 unknown product      TEACH, 0 matched T08 mastered learner PRACTICE
  T04 "best" claim         TEACH · VERIFY   T09 plain question   TEACH
  T05 pain report          SAFETY · R3      T10 evidence gap     TEACH + uncertainty
```

Two defects the suite's own meta-test caught, both fixed rather than accommodated:

1. **T06 passed vacuously.** Its assertion read `mode !== 'RECOMMEND' || …`, which is trivially
   true whenever the mode is something else — and it was, because the intent router did not
   recognise `추천해줘` as a product request. The router was fixed and the assertion now
   requires `RECOMMEND` + `DECIDE` with all four fact-asserting slots unfilled.
2. **T02 would have passed on any question at all.** A meta-test runs every case's assertions
   against an unrelated response and fails if they all still pass. T02 now has to ground in
   `KN-D06-01/02` specifically.

A third defect was found while wiring retrieval into the runtime: a requested `nodeId` that does
not exist used to fall through to the retriever, which would answer confidently about a
*different* record under the ID the caller asked for. That is precisely the plausible wrong
answer the RED TEAM note warns about, so a missed explicit node now grounds in nothing and says
so by name.

### Label Detective — the one world whose quest can actually run

`QST-013`'s win condition is literally `claim/ingredient/use instructions 분리` — separation,
not evaluation — and none of its three mapped nodes is missing. Separating the parts of a label
is a categorisation of text, so the quest opens as a `PEDAGOGICAL` claim while still failing as
a `SCIENTIFIC` one. Both are asserted by test.

D11 also has **the best evidence alignment in the corpus**: its nodes cite `FDA-01`, which
resolves by URL to `SRC-005` "FDA Cosmetics Labeling Claims" — genuinely on topic for what the
nodes teach, unlike D04 where sun nodes point at a general skin-care page. That makes D11.7 the
strongest candidate for the first approved evidence seed set.

The world ships a real sorting exercise. Verified in Chromium:

```
Label Detective
  quest QST-013: Open (as categorisation); would be blocked by 6 records as a scientific claim
  sorter: 8 lines, 4 buckets
    deliberately misplaced -> "Nearly — 2 of 8 are where they belong", 6 correction cards
    each card: ✕ line · "You put this under X · It belongs under Y" · "In plain words" …
    sorted correctly -> "All four parts, told apart", 8 rows
  Korean: 스스로에 대해 하는 말 | 안에 든 것 | 어떻게 쓰는지 | 조심할 것
console errors: none
```

Specimens are explicitly fictional and unbranded, because `16_PRODUCTS` is Template-only and a
real label would need product data that does not exist. Tests assert every specimen declares
itself fictional, carries no brand or SKU, and that no explanation anywhere claims an
ingredient does something — the correct answer is always *which part of a label a line is*.

### Interaction patterns from the reference video

A Loora-style language-tutor recording was supplied as a tone reference. Frames were extracted
and reviewed; the audio could not be transcribed, so the reading is visual only. Four patterns
were recorded as proposals (PR-028 … PR-031) and three are implemented in Label Detective:
attempt-first with a specific correction rather than a bare "incorrect"; a plain-words line in
the learner's own language right where it is needed ("쉽게 말하면"); and opening with the
situation rather than the task. A persona with a voice is registered as an IDEA, constrained by
AI-010 and AI-012.

### Evidence resolution — OQ-E01 turns out to be mechanically solvable

While investigating D04 the blocker resolved itself, without guesswork. Every one of the 92
unresolved citations also carries a `Source_URL`, and **each of those URLs appears verbatim in
14_EVIDENCE**. Matching on URL derives the mapping from the data:

| Cited | Resolves to | Nodes | Domains |
|---|---|---|---|
| `AAD-01` | `SRC-002` Face washing 101 | 13 | D05 |
| `AAD-02` | `SRC-001` Skin care basics | 13 | D04 |
| `AAD-03` | `SRC-003` Skin-care product order | 16 | D08 |
| `EU-01` | `SRC-009` CosIng | 35 | D06 |
| `FDA-01` | `SRC-005` Cosmetics Labeling Claims | 15 | D11 |

92 of 92 resolve; 0 unresolvable. **But the derived mapping contradicts the Constitution**,
which labels `AAD-01` "Skin Care Basics" and `AAD-02` "Face Washing 101" — the node sheet pairs
them the other way round. So it is reported as a proposal (OQ-E03) and nothing is rewritten:
applying the wrong direction would attach 26 nodes to the wrong document.

Resolving a citation is also not the same as the citation being adequate — which is exactly
what OQ-E02 shows for D04.

### Product proposal register

The 2026-09-18 product direction discussion is recorded in `src/governance/product-proposals.ts`
as 36 classified proposals: **9 CONFIRMED, 20 DECISION, 3 HYPOTHESIS, 3 IDEA, 1 OPEN QUESTION**.
Only 5 of the product-direction entries have nothing blocking them. Seven conflicts with governed rules are recorded, 3 of them
MUST_RESOLVE.

A test resolves every Master Database ID the register cites against the actual source data, so
the register cannot drift into citing records that do not exist.

**Governance, in leverage order — unchanged and still ahead of any code:**

1. **OQ-E01** — reconcile the evidence ID namespaces. One decision unblocks all 92 anchors.
2. **OQ-R01** — now a schema change request, not a data fix: `09_ROUTINES` needs Purpose,
   Audience_Context, Step_Definition, Usage_Context, Safety_Notes, and Source / Evidence /
   Usage Instruction as three separate fields.
3. **OQ-S01, OQ-R02** — the two content contradictions. Both would teach the wrong thing even
   after approval.
4. **SR-009 / SR-010** — approve the D06 strand 06.2 seed cluster.

**Then, in code:** the register says what is buildable and what is not. Nothing product-facing
(PR-003, PR-008, PR-009) can be built before a verified product master exists, because every
one of those surfaces is a recommendation surface that fails gate G3 today.

### Reducer purity — the event sink moved out of the reducers

The defect, recorded as known technical item 7 after the Quests & Mastery build, is fixed. All
four interactive reducers — `sessionReducer`, `reflectionReducer`, `exposureReducer`,
`sorterReducer` — wrote to the analytics sink from inside their `switch`, and the session
reducer also wrote to the cross-lesson mastery ledger. React StrictMode invokes a reducer twice
for every action in development precisely to expose that, and it did: one answer in the browser
produced two attempts and two of every event.

**What changed.** The reducers are now pure functions of `(state, action)`, and what a
transition wanted to do it *returns* instead:

| Field | Meaning |
| --- | --- |
| `transitionId` | Increments once per real transition. Never decreases, including across RESET and RESTART. |
| `emitted` | The events this transition produced. **Replaced** every transition, never appended to — the state holds one outbox, not a log. |
| `recordedAttempt` | Session reducer only: the attempt for the caller to fold into the mastery ledger. |

`src/app/transition.ts` holds the contract and `createDrainGuard()`, a closure that performs a
given `transitionId` at most once. `src/ui/hooks/use-transition-drain.ts` is the only place in
the UI that turns an outbox back into sink calls; it holds one guard in a ref, which is what
lets it survive the unmount/remount StrictMode also performs on every effect. Callers outside
React use `applySession` / `applyReflection` / `applyExposure` / `applySorter`, which reduce and
drain in one step.

Two design points worth stating, because both were choices:

- **StrictMode stays on.** It is what found this. Removing it would have hidden the defect
  rather than fixed it.
- **The reducers lost their third parameter entirely.** There is no slot to hand an effect into
  any more, so a future call site cannot reintroduce the defect by passing a sink. A test
  asserts `reducer.length === 2` for all four.

**`tests/reducer-purity.test.ts` — 40 tests, enforcing the rule from four directions:**

1. *shape* — each reducer takes exactly `(state, action)`;
2. *behaviour* — invoking a reducer twice from the same state gives deeply equal results and
   writes nothing to a sink or a ledger; `emitted` is replaced not accumulated; `transitionId`
   only ever increases; a no-op action preserves state identity;
3. *drain* — the guard performs a transition once however often the effect re-runs, and runs the
   extra ledger effect once too;
4. *source* — no reducer module matches `sink?.record(`, and `learning-session.ts` contains
   exactly one `ledger.record(` call, inside `drainSession`.

The tests were checked against three deliberate mutations rather than assumed to be meaningful:
removing the guard fails 2 tests; restoring `masteryLedger.record()` inside the transition table
fails the source test; restoring a `sink?.record()` call fails it too. The second mutation is
the reason the source check is case-insensitive — `masteryLedger.record(` does not match a
case-sensitive `ledger.record(`, and the first version of that test sailed straight past it.

**Browser verification (dev server, StrictMode on, Chromium).** Event counts read from the live
`eventSink` singleton by importing the module URL Vite serves, so no debug global was added to
the app:

```
Three lessons in three worlds, one answer each
  after My Skin     {"question_answered":1,"mastery_dimension_updated":1}  1 attempt   [SK01]
  after Ingredient  {"question_answered":2,"mastery_dimension_updated":2}  2 attempts  [SK01,SK06]
  after Routine     {"question_answered":3,"mastery_dimension_updated":3}  3 attempts  [SK01,SK05,SK06]
Re-mounting a world three times
  unchanged         {"question_answered":3,"mastery_dimension_updated":3}  3 attempts
Quests & Mastery   "3 attempts recorded · 3 of 12 skills have evidence · 0 mastered"
Routine Studio     {"reflection_completed":1}
Sun Protection     {"reflection_completed":1}
Label Detective    {"question_answered":1}
console errors: none
```

Before the fix every one of those numbers doubled. The ledger was already correct, because it
is idempotent per `attemptId` — that idempotency is kept, as a second line of defence rather
than as the fix.

**What this surfaced.** Verifying the full lesson path showed that `lesson_started` and
`lesson_completed` never fired in the browser at all. Fixed next; see below.

### Lesson lifecycle — `lesson_started` and `lesson_completed` now fire

Found while verifying the purity fix, and fixed here. Both events existed in the reducer from
the day the slice was written and both were covered by a passing test, yet neither had ever
fired in the running app: no screen dispatched `START_LESSON` or `CONTINUE_TO_MASTERY`. A
reducer test cannot catch that — it drives the reducer directly, so it proves the transition
works and says nothing about whether anything reaches it.

**Three separate defects, all in the same five lines:**

| | Defect | Fix |
| --- | --- | --- |
| 1 | No screen dispatched `START_LESSON` | `LessonRunner` dispatches it from a mount effect. Mounting *is* the learner entering the lesson: four of the five worlds mount it only after a "Start …" button, and My Skin is the app's entry point. |
| 2 | No control dispatched `CONTINUE_TO_MASTERY` | The mastery panel now offers **Finish this lesson**, next to "try a new situation" and "start again". A finished lesson says so and the control disappears. |
| 3 | `lesson_started`, `lesson_completed` and `hint_used` emitted with `new Date(0)` | All three actions now carry the real `at`, like every other event. An event stamped 1970 is not a record of anything. |

**The subtle part: purity is not idempotency.** A mount effect under StrictMode dispatches
`START_LESSON` *twice*, and those are two genuinely different actions — a pure reducer is
obliged to handle both. Purity protects against a repeated **invocation**; only state can
protect against a repeated **action**. So the guard lives in the state:

```ts
lessonStartedAt: string | null      // null until the lesson starts
lessonCompletedAt: string | null    // null until the learner finishes it
```

Timestamps rather than booleans, because "has this fired?" and "when?" are the same fact. Three
consequences follow, each with a test:

- **A doubled mount effect emits one `lesson_started`,** and keeps the *first* timestamp: the
  lesson started when it started.
- **The transfer question does not complete the lesson twice.** It sends the learner back
  through LESSON → … → MASTER inside the same lesson, so arriving a second time is not a
  second completion. The phase still advances when they press Finish — an event that must not
  repeat is not a reason to leave a dead control on screen.
- **A safety halt is not a completion.** `SUBMIT_REFLECTION` with an escalating signal reaches
  phase COMPLETE, because that is what stops the flow, but leaves `lessonCompletedAt` null,
  emits no `lesson_completed`, and offers no Finish button. A lesson that ended in an
  intervention cannot be completed afterwards either.

**Tests: `tests/learning-slice.test.ts` grows from 16 to 28.** Twelve new tests cover the
lifecycle, plus a wiring check that reads `LessonRunner.tsx` and asserts the two dispatches and
the absence of `new Date(0)` — because the whole defect was that the reducer was right and
nothing called it. Checked against three mutations: dropping the `lessonStartedAt` guard fails
2 tests, removing the mount dispatch fails the wiring test, and letting a safety halt set
`lessonCompletedAt` fails the safety test.

**Browser verification (dev server, StrictMode on, Chromium):**

```
Fresh page load — My Skin mounts once
  {"lesson_started":1}                      lesson_started 2026-09-18T10:46:35.722Z
Answer, reflect, press "Finish this lesson"
  {"lesson_started":1,"question_answered":1,"mastery_dimension_updated":1,
   "reflection_completed":1,"lesson_completed":1}
  phase Complete · "Lesson finished" notice shown · Finish button gone
Transfer round, press Finish again
  phase advances Mastery evidence -> Complete   (the control is not dead)
  lesson_completed still 1 · question_answered 2 · transfer_attempted 1
Safety halt (reflection "얼굴이 너무 아파요")
  {"lesson_started":1,"question_answered":1,"mastery_dimension_updated":1,
   "safety_intervention":1}
  lesson_completed 0 · no Finish button · caution shown
console errors: none
```

Every event now carries a real timestamp; the suite asserts `new Date(event.at).getTime() > 0`
for every event a lesson produces, not only the two this task was about.

**One behaviour worth naming, not a defect:** navigating to another world and back emits a new
`lesson_started`, because the remount really is a new session — the learner's progress is gone
with it. That is known technical item 7 (in-memory persistence), not a lifecycle bug, and the
event is telling the truth about it.

### Accessibility and the visual system — legibility made a measurable requirement

Asked for directly by the owner on 2026-09-18: the text is too small to read, readers have both
dark and light devices, add French, add a voice, and lift the design to a level that holds up
anywhere. Recorded as PR-032 … PR-035 in the proposal register.

**What was actually wrong.** The old stylesheet's smallest step was `0.62rem` — **9.9px** at the
browser default — and there was no dark theme at all. Neither was a matter of taste.

**The type scale.** Eight steps, smallest `0.8125rem` (13px), body text at `1.0625rem` (17px),
every one of them `calc(step × var(--text-scale))`. The reader picks A / A+ / A++ (×1, ×1.15,
×1.32), and `html` stays at `font-size: 100%` so a reader who has already enlarged text in their
browser or phone keeps that and gets this on top, rather than having it overwritten.

**The colour system.** Semantic tokens (`--text`, `--surface`, `--accent`) rather than literal
ones (`--charcoal`), so a component never names a colour and both themes stay correct without
the component knowing a theme exists. The spec's governed visual language — warm white, blush,
champagne gold, charcoal, botanical — was kept; the values were moved until every pair measured.

**Theme.** Defaults to the device (`prefers-color-scheme`), guarded so an explicit choice wins
in either direction, persisted in localStorage. Dark is a real dark: `--bg` luminance 0.014.

| | before | after |
| --- | --- | --- |
| Smallest rendered font | 9.9px (10 in the stylesheet, 11.5 measured) | **13px**, 17.2px at A++ |
| Dark theme | none | full, same contrast requirement as light |
| Contrast pairs at AA | unmeasured | **32 / 32**, computed from the shipped CSS |
| Interactive targets < 36px | unmeasured | **0** |
| UI catalogs | en, ko | en, ko, **fr** |

**Read-aloud.** The browser's own speech synthesis reads the passage, the question and the
answer choices. No network call, no account, no audio leaving the device. Two rules govern it:
it reads **only text already on screen** — nothing is generated, summarised or rephrased, so it
is the same text, spoken — and where the device has **no voice for the language it says so and
does nothing**, because reading French in an English voice mispronounces the words a learner is
trying to learn. Voice ranking prefers a vendor-enhanced voice, then a device-local one, then
an exact region match, and actively avoids the low-bandwidth and novelty voices macOS ships.

**French.** The third UI catalog. French is one of the few locales **both** sources agree on —
Master DB 15_LOCALIZATION registers it and the Global Content Engine spec lists it — so this
fills a governed locale rather than inventing one. It is UI chrome only; the lesson text stays
English with the fallback disclosed on screen. OQ-L01 is untouched: the locale set is still
unapproved and Lao still has no catalog.

**Tests: `tests/design-system.test.ts` (60) and `tests/speech.test.ts` (13).** The design test
parses the shipped stylesheet and computes the WCAG ratios itself, rather than trusting a
palette chosen by eye. It also checks the scale is monotonic and never below 13px, that no
`font-size` anywhere is off the scale, that the two dark blocks have not drifted apart, that
44px targets and a visible focus ring are applied, and that no component names a colour of its
own. Checked against five mutations: a low-contrast grey fails 3 tests, a 10px step fails 2,
a drifted dark block fails 5, a hard-coded hex in a component fails 1, and a French catalog
that is secretly English fails 1.

**One defect the tests missed and the browser caught.** After the first pass the stylesheet was
clean and the smallest *rendered* font was still 11.5px, unmoved by the text-size setting:
seventeen components carried `style={{ fontSize: '0.72rem' }}`, which neither the scale nor the
reader's setting can reach. All seventeen were replaced with a `.fine` class on the scale, and
the design test now also greps every `.tsx` for `fontSize`, because the first version of it only
read the CSS.

**Browser verification (Chromium, device dark and device light, desktop and 390×844 phone):**

```
device light, Theme = Auto   bg rgb(250,247,243)  text rgb(31,27,23)   smallest font 13px
device dark,  Theme = Auto   bg rgb(21,18,15)     text rgb(244,238,230) smallest font 13px
override Dark on a light device / Light on a dark device — both apply
text size A++                smallest rendered font 17.2px
phone 390×844                no horizontal overflow · 0 targets under 36px
reload                       data-text-size=large kept · data-theme absent for Auto (correct)
languages                    fr "Ma peau" · ko "마이 스킨" · en "My Skin" · html lang follows
read-aloud                   headless Chromium ships no voices, so the control correctly
                             reads "No voice for this language on this device" and is disabled
console errors: none
```

### Lao — the launch language finally has a UI, labelled as the draft it is

Lao is LOC-003, `Stage=Market`, `Notes="Laos launch language"`, and Constitution §13.1 names it
the first localization target. It had no catalog at all. It has one now: **229 of the 230 UI keys**,
written in Lao script. The one exception is `app.brand` — "KOREA GLOW" is a brand name and is
not translated in any catalog.

**It has not been read by a Lao speaker, and the app says so.** I said before building it that
Lao needs native review; asked to build it anyway, the honest way to do that is to ship it and
label it, which is the same discipline the corpus gets — a record nobody has verified is a
draft, and drafts are not presented as finished.

Three mechanisms carry that:

1. **`CATALOG_REVIEW`** gives every catalog a status: `BASE` (en — authored, not translated),
   `OWNER_REVIEWED` (ko — the owner works in this language and has read these screens),
   `UNREVIEWED_DRAFT` (**fr and lo**). A catalog cannot become reviewed by being committed; only
   a person changes that field. French is re-labelled honestly here too — I wrote it, nobody has
   checked it.
2. **A banner on every screen** while an unreviewed language is selected, phrased in that
   language. It carries no `{language}` placeholder: `Intl` has no Lao endonym in Chromium's
   ICU, so it rendered "Lao" in English inside a Lao sentence. Each catalog now names its own
   language in its own grammar and is reviewed together with it.
3. **Safety wording shows its English original underneath.** CLAUDE.md rule 6 puts safety above
   everything, and a safety instruction is the one string where a translation error could do
   real harm. A mistranslated "seek emergency help" cannot silently replace the instruction,
   because the English is right there. All three halting surfaces — lesson runner, routine
   studio, exposure log — now go through one `SafetyNotice` component, so they cannot drift
   apart on the thing that matters most.

**Lao typography.** Two things the Latin defaults get wrong: Lao stacks vowel and tone marks
both above and below the consonant, so lines set at 1.7 collide (Lao is set at 1.95); and Lao
writes phrases without spaces between words, so a browser breaking on spaces alone overflows
(`overflow-wrap: anywhere`). Uppercasing and letter-spacing are switched off for Lao, where they
do nothing but widen an already long label. The Lao font stack is named in *every* stack, not
only under `:lang(lo)`, so a Lao string inside an English sentence renders rather than showing
tofu.

**No voice for Lao, and it says so.** The read-aloud control reports
`ບໍ່ມີສຽງສຳລັບພາສານີ້ໃນອຸປະກອນນີ້` and is disabled. Adding a UI catalog does not conjure a
system voice, and reading Lao in a Thai or English voice would mispronounce the words a learner
is trying to learn. A test asserts Thai specifically must not stand in for Lao, and a second
asserts a genuine `lo-LA` voice is used where a device has one.

**Tests: localization 15 → 30, speech 13 → 15.** Beyond full-coverage and no-echo checks, Lao is
verified to be *in Lao script* (U+0E80–U+0EFF) key by key, which catches a key left in English
that a coverage test would pass. Checked against four mutations: marking the Lao catalog reviewed
fails 3 tests, one Lao key left in English fails the script test, a safety halt bypassing
`SafetyNotice` fails the routing test, and suppressing the English original fails the safety test.

**Browser verification (Chromium, desktop and 390×844 phone, light and dark):**

```
banner    en no · ko no · fr SHOWN · lo SHOWN        (only unreviewed catalogs)
lo        html lang=lo · font Noto Sans Lao · line-height 33.15px · 42 Lao elements
          smallest rendered font 13px · no text under 13px · no horizontal overflow
all 8 worlds in Lao — every h1 renders, no overflow, nothing under 13px, no console errors
safety    Lao R2 text, with "ຖ້ອຍຄຳຕົ້ນສະບັບ ເພື່ອຄວາມປອດໄພ: This sounds like something to
          stop and check…" beneath it
voice     ▶ ບໍ່ມີສຽງສຳລັບພາສານີ້ໃນອຸປະກອນນີ້ · disabled
```

**What is still needed, and it is not code.** A Lao speaker reading these 229 strings, with the
three safety escalations first. Until then `CATALOG_REVIEW.lo` stays `UNREVIEWED_DRAFT` and the
banner stays up. OQ-L01 is untouched: a catalog existing is not the locale set being approved.

### Thai catalog, and Lao read-aloud speaking through it

Owner instruction, verbatim: Lao writing is supported, but no device has a Lao voice, so Lao
speech should use Thai instead; if Lao writing had not been trustworthy either, the fallback
should have been to present the whole locale as Thai. Thai already needed its own catalog for
this — it is LOC-004, `Stage=Market`, `Notes="Thailand expansion"`, registered in both sources
— so `MESSAGES_TH` was written (229 keys, same coverage as Lao) and PR-037 records the decision.
`CATALOG_REVIEW.th = 'UNREVIEWED_DRAFT'`, same as French and Lao: nobody has read it either.

**Why "speak Lao text with a Thai voice" is not an option.** Lao and Thai are related languages
but **different scripts** (Lao U+0E80–U+0EFF, Thai U+0E00–U+0E7F — adjacent Unicode blocks, no
shared code points). A Thai voice given Lao characters does not read them with an accent; it
fails or produces noise. So the substitution implemented is **Thai voice reading Thai text** —
the app's own Thai translation of the same string — never Lao characters through a Thai engine.

**`SPOKEN_FALLBACK`** (`src/ui/speech.ts`) is one named table, `{ lo: 'th' }`, not a special case
buried in a component. `planSpeech(voices, locale, available)` tries, in order: the reader's own
language; its declared fallback; the base locale (English) — and only ever picks a candidate
that is *both* in `available` (the passage genuinely exists in that language) *and* has a device
voice. A genuine Lao voice, on a device that has one, is always preferred over the Thai
fallback: this is a fallback for devices with none, not a replacement for Lao audio everywhere.

**The reader is always told.** `ReadAloud` never switches language silently: when it substitutes
it renders as "Listen (in ไทย)" rather than continuing to say "Listen" while quietly speaking a
different language — the same transparency principle as the unreviewed-catalog banner and the
safety-original wording.

**Applied first to `SafetyNotice`**, the highest-stakes surface: a Lao reader with no Lao voice
on their device can still hear the safety escalation, correctly, spoken in Thai. Lesson content
(hook/core/analogy/question) was left alone on purpose — it exists only in en/ko, no Thai
variant was invented for it, so a Lao or Thai reader looking at its English fallback hears it
read in **English**, because that is the language actually on screen. This surfaced a real,
separate bug while wiring it: `ReadAloud` was asking a device for a voice in the reader's UI
locale even when the text on screen had already fallen back to English, which is how a French
reader on a device with a perfectly good English voice still saw "no voice available." Fixed
with a `spokenLocale` prop, set from the content layer's own `usedFallback` flag rather than
assumed from the UI locale.

**Tests: `tests/speech.test.ts` grows 15 → 25, `tests/localization.test.ts` grows 30 → 35,
`tests/design-system.test.ts` grows 60 → 69.** Speech tests cover `planSpeech` against the same
real vendor voice lists as before: Thai text through a Thai voice when no Lao voice exists;
Lao preferred when a device genuinely has one; total unavailability when neither does; no
fallback firing when the Thai text was never supplied (a caller forgetting to pass it must not
get Thai audio anyway); Thai read directly with no fallback involved. Localization tests cover
full Thai coverage, Thai-script verification (U+0E00–U+0E7F, immediately adjacent to Lao's block
so a passing test cannot be an accident of sharing it), the catalog review status, and that the
two safety texts (Lao and its Thai fallback) never share a code point. Design-system tests
extend the Lao typography checks (line-height, word wrap, no uppercasing) to Thai in parallel,
and confirm both scripts are named in the shared font stacks, not only under their own `:lang`
rule. Checked against six mutations, each caught: removing the `lo→th` table entry, letting
`planSpeech` skip the availability check, deleting `SafetyNotice`'s wiring (caught only after
tightening the test past a docstring mention of the same identifier — the first version of that
check passed against a mutation that had actually removed the real logic), reverting
`LessonRunner`'s `spokenLocale` fix, and dropping either script's typography block.

**Browser verification.** Headless Chromium ships zero speech voices at all (established earlier
in this build), so the browser check injects two fake voices — Thai and English, no Lao — via
`Object.defineProperty` (a plain assignment to `window.speechSynthesis` silently no-ops, because
it is an accessor-only property on `Window.prototype`; that cost real debugging time before the
cause was found) and drives the real UI end to end:

```
Thai UI standalone: html lang=th · font "Noto Sans Thai" · line-height 33.15px
                     43 Thai elements · smallest font 13px · no overflow · unreviewed banner shown

Lao safety halt, fake voices = [Kanya (th-TH), Samantha (en-US)], no Lao voice:
  halt text   Lao R2 wording, English original beneath it (unchanged from PR-036)
  speak label "▶ຟັງເປັນไทย"  (Listen, in Thai — languageName('th') = its own endonym)
  click       label flips to "■ ຢຸດ" (Stop)
  utterance   { text: "เรื่องนี้ฟังดูเหมือนควรหยุดและตรวจสอบ…", lang: "th-TH",
                voiceName: "Kanya" }   ← genuinely Thai text, genuinely the Thai voice
console errors: none
```

The spoken text is the app's own Thai catalog string, not a transliteration and not the Lao
characters relabelled — exactly the substitution PR-037 specifies.

### Own review before merge — three real bugs, found and fixed

No human collaborator exists on this repository to request a pull request review from, and
GitHub Copilot review was requested but never returned a result (most likely not enabled on
this account). Rather than merge unreviewed, I ran a thorough self-review of the branch and it
found three genuine defects — recorded here rather than silently folded into an earlier section,
because the discipline that matters is catching this class of bug, not just this instance of it.

1. **`exposure-log.ts` and `routine-reflection.ts` still stamped safety events with the
   epoch.** The exact bug already found and fixed once in `learning-session.ts` (a
   `safety_intervention` event dated 1970-01-01, because `halt()` was called with a hardcoded
   `AT_ZERO` instead of the action's real time) was never propagated to these two sibling
   reducers. `ADD_ENTRY`, `ADD_STEP` and `SET_PURPOSE` now all carry `at: string`, supplied by
   the UI's existing `now()` helper, and `halt()` uses it. This is CLAUDE.md rule 6 territory —
   safety data — so it is not a cosmetic fix.
2. **`SafetyNotice` marked the wrong text as English.** `lang="en"` wrapped the whole
   "original wording, for safety" line, including its *label*, which is itself translated into
   the reader's own language. A screen reader or this component's own read-aloud control would
   pronounce a Thai or Lao label using English phonetics. Fixed by moving `lang="en"` onto only
   `{original}`.

All three were confirmed against source before fixing, given a regression test each
(`tests/sun-protection.test.ts`, `tests/routine-studio.test.ts`,
`tests/localization.test.ts` — `localization.test.ts` +36, `routine-studio.test.ts` +30,
`sun-protection.test.ts` +27 over the prior count), and checked against a mutation that
reintroduces each bug — all three caught. Verified live in Chromium: adding a step, setting a
purpose, and logging an exposure entry all still work with zero console errors, and a safety
halt in both Routine Studio and Sun Protection now renders through `SafetyNotice` correctly.

484 tests pass; typecheck, build and verify:sources clean.

## 10. How to run the project

```bash
git clone <repo> && cd kbeauty-origin
npm install

npm run dev       # http://127.0.0.1:5173  — My Skin slice + Content Governance screen
npm test          # 455 tests
npm run build     # typecheck + production build into dist/
```

Requires Node 22+. No environment variables, no database, no API keys.
