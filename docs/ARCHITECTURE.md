# Architecture

North Star: **Learn Beauty. Know Yourself. Choose Better.**
This is a Beauty Intelligence learning platform — not a shopping app, not a medical
diagnosis app.

## Layer map

The twelve concerns named in the handoff command, and where each one lives:

| # | Concern | Location |
|---|---|---|
| 1 | UI / Presentation | `src/ui/` |
| 2 | Application / Use cases | `src/app/` |
| 3 | Learning domain logic | `src/domain/`, `src/mastery/` |
| 4 | Knowledge / Content repository | `src/knowledge/`, `src/content/`, `data/source/` |
| 5 | AI Tutor orchestration | `src/tutor/` |
| 6 | Safety / Policy gates | `src/safety/` |
| 7 | Recommendation / Commerce | `src/safety/safety-gate.ts` (`evaluateRecommendationGates`) |
| 8 | Analytics | `src/analytics/` |
| 9 | Persistence | `src/persistence/` (in-memory for the prototype) |
| 10 | Admin / Content governance | `src/governance/`, `src/ui/screens/GovernanceScreen.tsx` |
| 11 | Localization / Global content | `src/localization/` |
| 12 | Media content derivation | `src/content/derivation.ts` |

Dependency direction is inward: `ui → app → (domain, mastery, tutor, safety, governance) → knowledge/content → data`.
Nothing in `src/domain/` imports React, and nothing in `src/ui/` decides governance questions.

## The three gates

Every path that could put a claim in front of a learner goes through a gate that returns both
a decision and the disclosures the UI is obliged to render.

1. **Publication gate** — `src/governance/publication-gate.ts`
   `VERIFIED_FACT` requires `Status === 'Approved'` **and** `Evidence_Status === 'Verified'`.
   `Anchor` is deliberately insufficient. `Archived` and `Template` are `BLOCKED` outright.

2. **Safety gate** — `src/safety/safety-gate.ts`
   Classifies text into R0–R4, takes the *highest* matching tier, stops commerce at R2+,
   ends the learning flow at R4. Signal patterns are data marked `APPROVAL_REQUIRED` (SR-014).

3. **Recommendation gate** — G1 intent, G2 context, G3 evidence, G4 safety, G5 transparency,
   G6 alternatives. All six must pass or no commerce CTA renders. G3 currently fails for every
   product because `16_PRODUCTS` holds only `Template` rows.

## Reconciliation-safe strand layer

`src/knowledge/strand-taxonomy.ts` registers each source representation as a named view:

| View | Rows present | Count stated in the document |
|---|---|---|
| `master-db-v1.0` | 92 | — |
| `curriculum-coded-v1.0` | 41 | 58 |

`CANONICAL_TAXONOMY_ID` is `null`. `resolveStrandView()` returns the working view plus a
`WORKING_DATASET` disclosure and the SR-001 open item. When an owner approves a canonical set,
**setting that one constant is the whole change** — no consumer needs to be rewritten, and no
source row is renamed, merged or deleted to get there.

## One knowledge → multi-language → multi-format → multi-platform

```
KnowledgeNode (Master DB, governed)
  └── AuthoredContentAtom   (AUTHORED-*, declares nodeId + nodeVersion + ClaimClass)
        ├── ContentVariant  (per locale, own review status)
        └── PlatformDerivative × 11 platforms  (app lesson, tutor, quiz, quest, article,
              infographic, YouTube long/Shorts, TikTok, Reels, Facebook)
```

`src/content/derivation.ts` re-shapes one atom per platform. It copies no facts of its own:
every emitted block comes from the atom's variant text, and a missing block is omitted rather
than invented. Each derivative carries `nodeId` and `nodeVersion` back to the canonical source.

### ClaimClass — the anti-fabrication mechanism

| Class | Meaning | Requirement |
|---|---|---|
| `PEDAGOGICAL` | How to learn, observe, reason | None |
| `SAFETY_BOUNDARY` | The product's own limits | None |
| `SCIENTIFIC` | A fact about skin, ingredients, products, regulation | Evidence IDs **and** a node that passes the publication gate |

Because no node passes the gate, no `SCIENTIFIC` content can ship today. `tests/content-governance.test.ts`
fails if authored content ever declares a scientific claim without verified evidence behind it.

## Localization

`src/localization/locales.ts` registers the **union** of two disagreeing sources (12 locales),
tagging each with the source that defines it, and reports the conflict as `OQ-L01` rather than
picking a set. Lao — which the Master DB names as the Laos launch language and the AI Tutor
Constitution §13.1 names as the first localization target — is absent from the 10-language
Global Content Engine list. Translation coverage is reported per locale, so an unresolved
locale decision cannot quietly become a claim of "10 languages supported".

UI chrome (`src/localization/messages.ts`) is separate from governed knowledge. A test asserts
no UI string contains a scientific, ingredient or product claim.

## Mastery

Mastery is judged at **Skill** level (AI Constitution §6.2), from four independent dimensions
(Master DB `19_MASTERY_RULES` M01–M04). A skill is `Mastered` only when all four are satisfied,
and each dimension requires a minimum attempt count — so a single correct answer can never
produce mastery. M06 reopens a mastered skill to `Developing` when performance drops below
threshold.

The minimum attempt counts are an engineering **DECISION**, not a source value: the source
states ratios but no sample size. Recorded as SR-013.

## Lesson plans and the availability gate

A `LessonPlan` (`src/app/learning-session.ts`) names the governed records a session stands on:
quest (or null), node, skill, and the `ClaimClass` the lesson makes. Screens name a plan; they
cannot assemble one, so a screen cannot point a session at an arbitrary node or widen what a
lesson claims.

`src/governance/learning-availability.ts` answers the question a screen actually asks — **may
this whole lesson open?**

| Lesson claim class | Requirement |
|---|---|
| `SCIENTIFIC` | Every node and ingredient passes the publication gate **and** its `Source_ID` resolves in `14_EVIDENCE` |
| `PEDAGOGICAL` / `SAFETY_BOUNDARY` | Records must exist; renders with the pending-verification disclosure |
| any | A **missing** record blocks unconditionally — teaching around a hole means inventing it |

`createSession()` refuses to start a blocked lesson, so a blocked lesson cannot be reached by
constructing a session directly, only reported by the screen that offered it.

Both My Skin and Ingredient Garden mount the same `LessonRunner` with a different plan.

## First end-to-end slice

Quest `QST-001` "Mirror Detective" (World: My Skin) → core node `KN-D01-07-001` (Skin
Observation) → primary skill `SK01` Observe. All three IDs come from the Master Database and
are used unchanged; `loadSliceGrounding()` throws rather than substituting content if any is
missing.

`src/app/learning-session.ts` is a pure reducer implementing
`LESSON → ASK → THINK → HINT → TRY → FEEDBACK → REFLECT → MASTER → COMPLETE`.
An incorrect answer returns to the hint ladder rather than advancing. Free-text reflections
run through the safety gate *before* being stored.
