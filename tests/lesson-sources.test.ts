/**
 * A lesson opens on the lesson, not on its audit trail.
 *
 * Found in real Korean screenshots, before the owner filmed these screens for partners: the
 * lesson rooms opened on a card of knowledge-node IDs, strand codes, skill IDs, claim classes
 * and blocker reasons, under an English sentence the Korean UI never translated. The audit
 * trail is a feature of this app and none of it is removed — it moved behind one closed
 * <details> ("See what this lesson is based on"), after the lesson's call to action.
 *
 * Two things are checked here, against the real screens rendered to HTML:
 *   1. the availability verdict is a catalog key, so a Korean reader reads it in Korean;
 *   2. no governance ID appears anywhere on a lesson landing screen outside that disclosure,
 *      while every one of them is still inside it.
 */
import { createElement, type FunctionComponent } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  INGREDIENT_HALO_PLAN,
  LABEL_READING_PLAN,
  MIRROR_DETECTIVE_PLAN,
  ROUTINE_PURPOSE_PLAN,
  SUN_EXPOSURE_PLAN,
  loadSliceGrounding,
  type LessonPlan,
} from '@/app/learning-session';
import {
  AVAILABILITY_SUMMARY_KEYS,
  evaluateLessonAvailability,
  evaluateQuestAvailability,
  ingredientGardenQuestAvailability,
} from '@/governance/learning-availability';
import { UI_CATALOG_LOCALES, translate } from '@/localization/messages';
import { IngredientGardenScreen } from '@/ui/screens/IngredientGardenScreen';
import { LabelDetectiveScreen } from '@/ui/screens/LabelDetectiveScreen';
import { RoutineStudioScreen } from '@/ui/screens/RoutineStudioScreen';
import { SunProtectionScreen } from '@/ui/screens/SunProtectionScreen';
import { QuestMasteryScreen } from '@/ui/screens/QuestMasteryScreen';
import { LessonRunner } from '@/ui/components/LessonRunner';

const HANGUL = /[가-힣]/;

/**
 * Anything that is governance bookkeeping rather than lesson: record IDs from the Master
 * Database, the claim-class and strand labels, blocker reasons, register entries.
 */
const GOVERNANCE_ID =
  /\bKN-D\d{2}|\bQST-\d{3}|\bSK\d{2}\b|\bING-\d{3}|\bSRC-\d{3}|\bSR-0\d{2}|\bOQ-[A-Z]\d{2}|\bMISSING_RECORD\b|\bUNVERIFIED_RECORD\b|\bUNRESOLVED_EVIDENCE\b|\bPEDAGOGICAL\b|\bSCIENTIFIC\b|[Cc]laim class|\bStrand\b|\bAUTHORED-/;

/** Remove every <details>…</details> block, nesting-aware, leaving what is visible unopened. */
function outsideDisclosures(html: string): string {
  let out = '';
  let depth = 0;
  let index = 0;
  while (index < html.length) {
    const open = html.indexOf('<details', index);
    const close = html.indexOf('</details>', index);
    if (open === -1 && close === -1) {
      if (depth === 0) out += html.slice(index);
      break;
    }
    if (open !== -1 && (close === -1 || open < close)) {
      if (depth === 0) out += html.slice(index, open);
      depth += 1;
      index = open + '<details'.length;
    } else {
      depth -= 1;
      index = close + '</details>'.length;
    }
  }
  return out;
}

const render = (component: FunctionComponent<{ locale: string }>, locale: string) =>
  renderToStaticMarkup(createElement(component, { locale }));

const LESSON_SCREENS: readonly {
  name: string;
  component: FunctionComponent<{ locale: string }>;
  plan: LessonPlan;
  startKey: Parameters<typeof translate>[0];
}[] = [
  { name: 'Ingredient Garden', component: IngredientGardenScreen, plan: INGREDIENT_HALO_PLAN, startKey: 'ingredient.startLesson' },
  { name: 'Label Detective', component: LabelDetectiveScreen, plan: LABEL_READING_PLAN, startKey: 'label.startLesson' },
  { name: 'Routine Studio', component: RoutineStudioScreen, plan: ROUTINE_PURPOSE_PLAN, startKey: 'routine.startLesson' },
  { name: 'Sun Protection', component: SunProtectionScreen, plan: SUN_EXPOSURE_PLAN, startKey: 'sun.startLesson' },
];

/** The English verdicts, up to any number in them — none may reach a Korean screen. */
const ENGLISH_SUMMARIES = AVAILABILITY_SUMMARY_KEYS.map(
  (key) => translate(key, 'en').split('{count}')[0]!,
);

describe('the availability verdict goes through the catalogs', () => {
  it('returns a catalog key and parameters, never English prose', () => {
    const results = [
      ...[INGREDIENT_HALO_PLAN, LABEL_READING_PLAN, ROUTINE_PURPOSE_PLAN, SUN_EXPOSURE_PLAN].map(
        (plan) => loadSliceGrounding(plan).availability,
      ),
      ...ingredientGardenQuestAvailability(),
      evaluateQuestAvailability('QST-013', 'PEDAGOGICAL'),
      evaluateQuestAvailability('QST-999', 'PEDAGOGICAL'),
      evaluateLessonAvailability({ claimClass: 'SCIENTIFIC', nodeIds: [] }),
    ];
    for (const result of results) {
      expect(AVAILABILITY_SUMMARY_KEYS).toContain(result.summaryKey);
      expect(result).not.toHaveProperty('summary');
    }
  });

  it('keeps the meaning of each verdict: open-and-verified, open-for-reasoning, blocked, missing', () => {
    expect(evaluateLessonAvailability({ claimClass: 'SCIENTIFIC', nodeIds: [] }).summaryKey).toBe(
      'availability.verified',
    );
    expect(loadSliceGrounding(INGREDIENT_HALO_PLAN).availability.summaryKey).toBe(
      'availability.pedagogical',
    );
    const blocked = ingredientGardenQuestAvailability()[0]!;
    expect(blocked.available).toBe(false);
    expect(blocked.summaryKey).toBe(
      blocked.blockers.length === 1 ? 'availability.blockedOne' : 'availability.blockedMany',
    );
    expect(blocked.summaryParams).toEqual({ count: String(blocked.blockers.length) });
    const count = blocked.blockers.length;
    expect(translate(blocked.summaryKey, 'en', blocked.summaryParams)).toBe(
      `Blocked by ${count} record${count === 1 ? '' : 's'}.`,
    );
    expect(evaluateQuestAvailability('QST-999', 'PEDAGOGICAL').summaryKey).toBe(
      'availability.questNotFound',
    );
  });

  it('says every verdict in Korean for a Korean reader, and in every other catalog too', () => {
    for (const key of AVAILABILITY_SUMMARY_KEYS) {
      const korean = translate(key, 'ko', { count: '3' });
      expect(korean, key).toMatch(HANGUL);
      expect(korean, key).not.toMatch(/[A-Za-z]{3,}/);
      for (const locale of UI_CATALOG_LOCALES.filter((l) => l !== 'en')) {
        expect(translate(key, locale), `${key}/${locale}`).not.toBe(translate(key, 'en'));
      }
    }
  });

  it('labels the disclosure in plain language in every catalog', () => {
    expect(translate('sources.show', 'ko')).toBe('이 레슨의 근거 자료 보기');
    expect(translate('sources.show', 'en')).toBe('See what this lesson is based on');
    for (const locale of UI_CATALOG_LOCALES) {
      expect(translate('sources.show', locale)).not.toMatch(GOVERNANCE_ID);
    }
  });
});

describe('a lesson screen opens on the lesson, with its audit trail behind one closed disclosure', () => {
  for (const screen of LESSON_SCREENS) {
    describe(screen.name, () => {
      const html = render(screen.component, 'ko');
      const visible = outsideDisclosures(html);
      const grounding = loadSliceGrounding(screen.plan);

      it('shows the availability verdict in Korean, with no English sentence', () => {
        expect(visible).toContain(
          translate(grounding.availability.summaryKey, 'ko', grounding.availability.summaryParams),
        );
        for (const english of ENGLISH_SUMMARIES) expect(html).not.toContain(english);
      });

      it('shows no governance ID outside the disclosure', () => {
        expect(visible.match(GOVERNANCE_ID)?.[0] ?? null).toBeNull();
      });

      it('still shows every grounding record inside it', () => {
        const inside = html.slice(html.indexOf('<details'));
        expect(inside).toMatch(GOVERNANCE_ID);
        expect(inside).toContain(screen.plan.nodeId);
        expect(inside).toContain(screen.plan.skillId);
        expect(inside).toContain(screen.plan.claimClass);
        expect(inside).toContain(grounding.nodeStatus);
      });

      it('puts the disclosure after the start button, closed, labelled in Korean', () => {
        const start = html.indexOf(translate(screen.startKey, 'ko'));
        expect(start).toBeGreaterThan(-1);
        expect(html.indexOf('<details')).toBeGreaterThan(start);
        expect(html).not.toMatch(/<details[^>]*\sopen/);
        expect(html).toContain(`<summary class="sources__toggle">${translate('sources.show', 'ko')}</summary>`);
      });
    });
  }

  describe('How far I have got', () => {
    const html = render(QuestMasteryScreen, 'ko');
    const visible = outsideDisclosures(html);

    it('shows the learner their own record without skill IDs, thresholds or quest IDs', () => {
      expect(visible).toContain(translate('quest.masteryTitle', 'ko'));
      expect(visible.match(GOVERNANCE_ID)?.[0] ?? null).toBeNull();
      expect(visible).not.toMatch(/\bM0\d\b/);
    });

    it('keeps the quest map, the skill IDs and the thresholds inside the disclosure', () => {
      const inside = html.slice(html.indexOf('<details'));
      expect(inside).toMatch(/QST-001/);
      expect(inside).toMatch(/\bSK01\b/);
      expect(inside).toMatch(/\bM01\b/);
      expect(html).not.toMatch(/<details[^>]*\sopen/);
    });
  });

  describe('the lesson itself', () => {
    const html = renderToStaticMarkup(
      createElement(LessonRunner, { plan: MIRROR_DETECTIVE_PLAN, locale: 'ko' }),
    );
    const visible = outsideDisclosures(html);

    it('opens on the lesson title, with node, strand and skill codes only in the disclosure', () => {
      expect(visible).toContain(translate('lesson.eyebrow', 'ko'));
      expect(visible.match(GOVERNANCE_ID)?.[0] ?? null).toBeNull();
      const inside = html.slice(html.indexOf('<details'));
      expect(inside).toContain(MIRROR_DETECTIVE_PLAN.nodeId);
      expect(inside).toContain(MIRROR_DETECTIVE_PLAN.skillId);
    });

    it('keeps the honesty notices visible — they are for the learner, not the audit', () => {
      expect(visible).toContain(translate('disclosure.notMedicalAdvice', 'ko'));
    });
  });
});
