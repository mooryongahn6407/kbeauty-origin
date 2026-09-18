# KOREA GLOW TECHNICAL IMPLEMENTATION SPEC v1.0

STATUS: ENGINEERING HANDOFF / WORKING SPECIFICATION

## 1. Product layers
- Experience Layer: My Skin, Ingredient Garden, Routine Studio, Sun Protection, Label Detective, AI Tutor, Quest/XP/Mastery.
- Learning Layer: curriculum hierarchy, learning progression, mastery evidence.
- Knowledge Layer: governed nodes, ingredients, concerns, categories, routines, products, evidence.
- AI Layer: tutor orchestration, grounding, classification, safety gate, response verification.
- Trust Layer: evidence/status/version/provenance and medical boundary.
- Global Content Layer: localization and platform derivatives.
- Commerce Layer: downstream recommendations only.
- Analytics Layer: learning gain, skill gain, transfer, retention, decision quality, trust, safety, subscription and commerce conversion.

## 2. Canonical entity relationships
Domain -> Strand -> Concept -> KnowledgeNode -> Skill -> Application -> MasteryEvidence
KnowledgeNode -> EvidenceSource(s)
KnowledgeNode -> ContentAtom(s)
KnowledgeNode -> Localization/ContentVariant(s)
KnowledgeNode -> LearningActivity(s)
Product -> ProductCategory
Recommendation -> Knowledge/Evidence + UserContext + SafetyGate
MasteryState -> Skill/KnowledgeNode + evidence events

## 3. Status model
At minimum support:
DRAFT
REVIEW
APPROVED
ARCHIVED
OPEN

Never display an unapproved knowledge item as verified fact.

## 4. Mastery state
Track separately:
accuracy
independence
transfer
retention
plus evidence/events used to establish each dimension.

Do not reduce mastery to a single quiz score.

## 5. Localization
Use locale identifiers rather than separate hard-coded screens.
Core knowledge is language-neutral where possible.
Localized variants store:
locale
translated text
local terminology notes
review status
version
source/reference linkage

Required initial locales:
en, fr, es, zh, ko, ja, it, th, vi, id

## 6. Content derivation
A ContentAtom should be able to produce/refer to:
lesson
quiz
quest
AI tutor teaching unit
article
infographic
video script
short-form script
social caption

Each derivative must retain a link to the canonical KnowledgeNode and version.

## 7. Safety
Safety gates must run before high-risk responses.
The product must not diagnose disease, prescribe treatment, guarantee cosmetic outcomes, or fabricate safety/regulatory facts.
When a case may require professional evaluation, the system should route to appropriate safety guidance rather than pretend certainty.

## 8. Recommendation
Recommendation should be explainable and downstream:
intent + context + evidence + safety.
Do not create recommendation logic based merely on margin, inventory, promotion, brand preference, or emotional vulnerability.

## 9. Analytics
Instrument learning events rather than only engagement:
lesson_started/completed
question_answered
hint_used
reflection_completed
transfer_attempted
mastery_dimension_updated
safety_intervention
recommendation_shown
recommendation_explained
content_language_used
content_variant_used

## 10. Reconciliation-safe architecture
The 58-vs-92 strand issue must be handled by versioned/configurable mappings. Do not mutate source records merely to make the application convenient.

## 11. UI principles
Premium Korean Beauty + intelligent learning.
Warm white, soft blush, champagne gold, deep charcoal, restrained botanical accents.
Modern elegant typography.
Avoid clutter and excessive text.
Learning clarity is more important than decorative effects.
