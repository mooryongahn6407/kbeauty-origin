/**
 * Skin Quest — the guided first-run journey.
 *
 * Every question here asks the reader what *they* can see on their own skin, and every result
 * is their own answer read back to them. That is not a stylistic choice: no Knowledge Node in
 * the Master Database has passed the evidence gate, so the app may not tell anyone what causes
 * what, what an ingredient does, or what their skin "is". What it may always do is help someone
 * look, and keep the record they made.
 *
 * The three levels are not invented. `Level` is a governed field on 07_CONCERNS, and the
 * fifteen concerns divide Basic / Intermediate / Advanced exactly as the levels below. A level
 * opens when the one before it is finished, which is what makes the journey feel like a course
 * rather than eight flat tabs — without computing a score, an XP amount or a threshold, none of
 * which any source defines (OQ-X01).
 *
 * Concerns whose governed `Learning_Goal` names a boundary ("치료 주장 금지", "지속 시 전문가
 * 상담") carry `escalates`, and the result screen shows the professional-consultation notice
 * for them. The boundary comes from the source record, not from a judgement made here.
 */
import { concerns } from '@/knowledge/repository';
import type { MessageKey } from '@/localization/messages';

export type QuestLevelId = 'L1' | 'L2' | 'L3';

export interface QuestOption {
  readonly id: string;
  /** UI catalog key. Options never carry inline prose — see CLAUDE.md rule 8. */
  readonly labelKey: MessageKey;
}

export interface QuestStep {
  readonly id: string;
  readonly level: QuestLevelId;
  readonly promptKey: MessageKey;
  /** One line under the prompt saying how to answer. Never a fact about skin. */
  readonly helpKey: MessageKey;
  readonly options: readonly QuestOption[];
}

export interface QuestLevel {
  readonly id: QuestLevelId;
  readonly titleKey: MessageKey;
  /** The governed 07_CONCERNS.Level value this level draws its concerns from. */
  readonly sourceLevel: 'Basic' | 'Intermediate' | 'Advanced';
  readonly steps: readonly QuestStep[];
}

/**
 * Concern IDs whose governed Learning_Goal states a boundary rather than a topic. Listed by ID
 * so the reason stays traceable to the record; the wording shown to the reader is a catalog key.
 */
export const ESCALATING_CONCERN_IDS: readonly string[] = ['CON-004', 'CON-005', 'CON-013'];

export const QUEST_LEVELS: readonly QuestLevel[] = [
  {
    id: 'L1',
    titleKey: 'skinquest.level.L1',
    sourceLevel: 'Basic',
    steps: [
      {
        id: 'L1-S1',
        level: 'L1',
        promptKey: 'skinquest.L1.S1.prompt',
        helpKey: 'skinquest.L1.S1.help',
        options: [
          { id: 'tight', labelKey: 'skinquest.L1.S1.tight' },
          { id: 'comfortable', labelKey: 'skinquest.L1.S1.comfortable' },
          { id: 'shiny', labelKey: 'skinquest.L1.S1.shiny' },
          { id: 'mixed', labelKey: 'skinquest.L1.S1.mixed' },
        ],
      },
      {
        id: 'L1-S2',
        level: 'L1',
        promptKey: 'skinquest.L1.S2.prompt',
        helpKey: 'skinquest.L1.S2.help',
        options: [
          { id: 'face', labelKey: 'skinquest.L1.S2.face' },
          { id: 'body', labelKey: 'skinquest.L1.S2.body' },
          { id: 'hair', labelKey: 'skinquest.L1.S2.hair' },
        ],
      },
    ],
  },
  {
    id: 'L2',
    titleKey: 'skinquest.level.L2',
    sourceLevel: 'Intermediate',
    steps: [
      {
        id: 'L2-S1',
        level: 'L2',
        promptKey: 'skinquest.L2.S1.prompt',
        helpKey: 'skinquest.L2.S1.help',
        options: [
          { id: 'never', labelKey: 'skinquest.L2.S1.never' },
          { id: 'sometimes', labelKey: 'skinquest.L2.S1.sometimes' },
          { id: 'often', labelKey: 'skinquest.L2.S1.often' },
          { id: 'unsure', labelKey: 'skinquest.L2.S1.unsure' },
        ],
      },
      {
        id: 'L2-S2',
        level: 'L2',
        promptKey: 'skinquest.L2.S2.prompt',
        helpKey: 'skinquest.L2.S2.help',
        options: [
          { id: 'morning', labelKey: 'skinquest.L2.S2.morning' },
          { id: 'evening', labelKey: 'skinquest.L2.S2.evening' },
          { id: 'both', labelKey: 'skinquest.L2.S2.both' },
          { id: 'varies', labelKey: 'skinquest.L2.S2.varies' },
        ],
      },
    ],
  },
  {
    id: 'L3',
    titleKey: 'skinquest.level.L3',
    sourceLevel: 'Advanced',
    steps: [
      {
        id: 'L3-S1',
        level: 'L3',
        promptKey: 'skinquest.L3.S1.prompt',
        helpKey: 'skinquest.L3.S1.help',
        options: [
          { id: 'daily', labelKey: 'skinquest.L3.S1.daily' },
          { id: 'sunny', labelKey: 'skinquest.L3.S1.sunny' },
          { id: 'rarely', labelKey: 'skinquest.L3.S1.rarely' },
          { id: 'never', labelKey: 'skinquest.L3.S1.never' },
        ],
      },
    ],
  },
];

/** The governed concerns a level offers, in source order. Never a hand-written list of names. */
export const concernsForLevel = (level: QuestLevel) =>
  concerns.filter((concern) => concern.Level === level.sourceLevel);

export const questLevel = (id: QuestLevelId): QuestLevel => {
  const found = QUEST_LEVELS.find((level) => level.id === id);
  if (!found) throw new Error(`Unknown quest level: ${id}`);
  return found;
};

/** Total answerable steps across the journey, used for the "03 / 08" progress readout. */
export const TOTAL_QUEST_STEPS = QUEST_LEVELS.reduce(
  // Each level asks its steps, then one concern pick.
  (total, level) => total + level.steps.length + 1,
  0,
);
