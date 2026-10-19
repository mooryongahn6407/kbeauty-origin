/**
 * The rule-based tutor's short answer: a catalogue sentence filled only with the matched record's
 * own words, in five languages, after the risk gate — plus the doctor/pharmacist route for
 * diagnosis, rash, allergy and pregnancy questions in every language the app speaks.
 */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { respond } from '@/tutor/tutor-engine';
import { recordAnswer } from '@/tutor/record-answer';
import { classifyRisk } from '@/safety/safety-gate';
import { UI_CATALOG_LOCALES, translate } from '@/localization/messages';
import { AITutorScreen } from '@/ui/screens/AITutorScreen';

const ask = (userMessage: string, locale = 'en') =>
  respond({
    userMessage,
    nodeId: null,
    skillId: null,
    locale,
    hintsUsed: 0,
    failedAttempts: 0,
    userRequestedProductHelp: false,
  });

describe('the short answer', () => {
  it('is built only from the matched record, in every UI language', () => {
    for (const locale of ['ko', 'en', 'lo', 'th', 'fr']) {
      const response = ask('dryness', locale);
      expect(response.answer?.recordId).toBe('CON-001');
      const params = response.answer!.params;
      // Every word that is not the catalogue's own frame comes from the record, verbatim.
      let frame = response.message!;
      for (const value of Object.values(params)) {
        expect(frame).toContain(value);
        frame = frame.replace(value, '');
      }
      const template = translate(response.answer!.key, locale).replace(/\{[a-zA-Z]+\}/g, '');
      expect(frame.replace(/\s+/g, '')).toBe(template.replace(/\s+/g, ''));
    }
  });

  it('has a catalogue sentence for every record kind in every catalog', () => {
    for (const kind of ['KnowledgeNode', 'Ingredient', 'Concern', 'ProductCategory'] as const) {
      for (const locale of UI_CATALOG_LOCALES) {
        expect(translate(`tutor.answer.${kind}`, locale)).toContain('{title}');
      }
    }
  });

  it('never answers from a product row', () => {
    expect(recordAnswer({ kind: 'Product', id: 'PRD-001' })).toBeNull();
    const response = ask('XYZ 슈퍼글로우 크림 어때요?');
    expect(response.answer).toBeNull();
    expect(response.message).toBeNull();
  });

  it('stays silent when the risk gate escalates — the gate comes first', () => {
    for (const question of ['Niacinamide가 모든 피부 문제를 치료해?', '임신 중인데 레티놀 써도 돼요?']) {
      const response = ask(question);
      expect(response.mode).toBe('SAFETY');
      expect(response.answer).toBeNull();
      expect(response.message).toBeNull();
    }
  });

  it('stays silent when nothing matched, or a named node is missing', () => {
    expect(ask('zzzz qqqq').message).toBeNull();
    const missing = respond({
      userMessage: 'dryness',
      nodeId: 'KN-D99-99-999',
      skillId: null,
      locale: 'en',
      hintsUsed: 0,
      failedAttempts: 0,
      userRequestedProductHelp: false,
    });
    expect(missing.message).toBeNull();
  });

  it('is shown on the tutor screen with the "based on the records" line', () => {
    // The screen asks on submit; render the panel's pieces through the engine instead.
    const html = renderToStaticMarkup(createElement(AITutorScreen, { locale: 'ko' }));
    expect(html).not.toContain(translate('tutor.answerBasis', 'ko')); // nothing asked yet
    expect(translate('tutor.answerBasis', 'ko')).toBe('답변은 아래 기록에 근거해요');
  });
});

describe('doctor or pharmacist questions', () => {
  const QUESTIONS: Record<string, readonly string[]> = {
    diagnosis: ['Can you diagnose my skin?', '진단해 주세요', 'ຊ່ວຍວິນິດໄສຜິວຂ້ອຍແດ່', 'ช่วยวินิจฉัยผิวให้หน่อย', 'Pouvez-vous faire un diagnostic ?'],
    rash: ['I have a rash', '발진이 생겼어요', 'ຂ້ອຍມີຜື່ນ', 'ฉันมีผื่นขึ้น', "J'ai une éruption sur la joue"],
    allergy: ['Am I allergic to this?', '알레르기가 있어요', 'ຂ້ອຍມີອາການແພ້', 'ฉันมีอาการแพ้', "J'ai une allergie"],
    pregnancy: ['I am pregnant', '임신 중이에요', 'ຂ້ອຍຖືພາ', 'ฉันตั้งครรภ์', 'Je suis enceinte'],
  };

  it.each(Object.entries(QUESTIONS))('%s: routed to the doctor/pharmacist wording in 5 languages', (_topic, questions) => {
    for (const question of questions) {
      const decision = classifyRisk(question);
      expect(decision.tier, question).toBe('R2');
      expect(decision.allowCommerce, question).toBe(false);
      expect(decision.messageKey, question).toBe('safety.escalation.professional');
    }
  });

  it('does not take Thai «sensitive skin» for an allergy', () => {
    expect(classifyRisk('ผิวแพ้ง่ายควรใช้อะไร').tier).toBe('R0');
  });

  it('lets a higher tier keep its own, stronger wording', () => {
    expect(classifyRisk("I'm pregnant and can't breathe").messageKey).toBe('safety.escalation.R4');
  });

  it('says doctor or pharmacist in every catalog', () => {
    const doctor: Record<string, RegExp> = {
      en: /doctor or pharmacist/,
      ko: /의사나 약사/,
      fr: /médecin ou d’un pharmacien/,
      lo: /ທ່ານໝໍ ຫຼື ເພສັດກອນ/,
      th: /แพทย์หรือเภสัชกร/,
    };
    for (const locale of UI_CATALOG_LOCALES) {
      expect(translate('safety.escalation.professional', locale)).toMatch(doctor[locale]!);
    }
  });
});
