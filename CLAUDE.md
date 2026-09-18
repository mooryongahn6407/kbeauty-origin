# KOREA GLOW Beauty Learning World

**Learn Beauty. Know Yourself. Choose Better.**

A Beauty Intelligence learning platform. **Not** a shopping app. **Not** a medical diagnosis app.

Read `docs/SOURCE_OF_TRUTH.md` before changing anything under `data/`, `sources/` or `src/governance/`.
Read `docs/ARCHITECTURE.md` before adding a layer or screen.
Current build state is in `ENGINEERING_STATUS.md`.

## Commands

```bash
npm install
npm run dev              # http://127.0.0.1:5173
npm test                 # vitest, 352 tests
npm run typecheck        # tsc --noEmit
npm run build            # typecheck + production build
npm run extract:sources  # regenerate data/source/*.json from sources/*.xlsx
npm run verify:sources   # fail if data/source/ drifted from the official workbooks
```

## Rules this codebase enforces

These are not style preferences. Each has a test that fails if it is broken.

1. **Never change, delete, merge, rename or reinterpret a source ID.** IDs from the Master
   Database (`D01`, `D01-01`, `KN-D01-07-001`, `SK01`, `QST-001`, `ING-001`, `AI-001`, `M01`,
   `CA-001`, `SRC-001`) are used verbatim everywhere.
2. **Never treat Draft/Review data as Approved.** Only `evaluatePublication()` may answer
   "can this be stated as fact?", and it requires `Status=Approved` **and**
   `Evidence_Status=Verified`. Today nothing in the corpus qualifies.
3. **Never fabricate a scientific, ingredient, product, safety or regulatory fact.** Authored
   content declares a `ClaimClass`; a `SCIENTIFIC` claim requires verified evidence behind it.
4. **Never invent a missing entity.** Broken references are reported by
   `src/governance/integrity.ts`, never repaired in code.
5. **Do not resolve the 58-vs-92 strand question.** `CANONICAL_TAXONOMY_ID` stays `null` until
   an owner decides. See SR-001.
6. **Safety outranks learning, engagement and commerce.** Then education outranks commerce.
7. **No medical diagnosis or treatment functionality.**
8. **Do not hard-code scientific or product claims in UI components or AI prompts.** They
   belong in governed knowledge/evidence data.
9. **Keep mastery separate** from loyalty, influencer, partner and commercial status. The
   mastery ledger has `record`/`stateFor`/`snapshot`/`reset` and deliberately no grant, award,
   unlock or setLevel — evidence is only ever earned from attempts. No XP amount or level
   threshold is computed anywhere, because no source defines one (OQ-X01).
10. **Classify anything unresolved** as CONFIRMED / DECISION / HYPOTHESIS / IDEA /
    OPEN QUESTION / REJECTED. Source contradictions go in `src/governance/open-items.ts`;
    product proposals go in `src/governance/product-proposals.ts`, where a test verifies every
    Master Database ID they cite actually exists.
11. **The AI Tutor generates no prose.** `respond()` returns `message: null` on every branch;
    safety wording is a localization key. A mode's unfilled response slots are reported, never
    papered over with fluent text. The Constitution §16 scenarios run as a regression gate in
    `src/tutor/evaluation-suite.ts` and must stay at 10/10.
12. **A number stated twice must agree.** `src/governance/numeric-audit.ts` compares governed
    numbers against each other and against the constants the code runs on, and raises a
    governance warning on disagreement. It never reconciles.
13. **Reducers are pure; effects happen in the drain.** `sessionReducer`, `reflectionReducer`,
    `exposureReducer` and `sorterReducer` take exactly `(state, action)` — there is no third
    parameter to hand a sink into. A transition returns what it wants to do in `emitted`
    (and `recordedAttempt`), and `createDrainGuard()` performs it once. StrictMode stays on:
    it is what caught this. See `src/app/transition.ts` and `tests/reducer-purity.test.ts`.

## Adding content

Authored learning content lives in `data/authored/` with `AUTHORED-*` IDs — a namespace that
cannot collide with any source ID. Every atom must name the governed `nodeId` it derives from,
the `nodeVersion` it was written against, its `skillId` and its `claimClass`, and must stay
`Draft`. Nothing in code promotes a review status.

## Repository note

`INDEX.html.txt` at the repository root is a pre-existing static e-commerce landing page
("K-Beauty Origin by JY Global"). It is a separate commerce artefact, not part of the Beauty
Learning World, and is intentionally left untouched.
