/**
 * AI Tutor runtime tests.
 * Source: AI Tutor Constitution §2 (runtime + mode router), §3.3 (hallucination firewall),
 * §5 (hint ladder), §11.1 (structured output), §16 (evaluation scenarios T01-T10).
 */
import { describe, expect, it } from 'vitest';
import {
  classifyIntent,
  mandatoryApprovedAIRules,
  nextHintLevel,
  respond,
  routeMode,
  type TutorRequest,
} from '@/tutor/tutor-engine';

const request = (overrides: Partial<TutorRequest> = {}): TutorRequest => ({
  userMessage: 'What is a humectant?',
  nodeId: 'KN-D01-07-001',
  skillId: 'SK01',
  locale: 'en',
  hintsUsed: 0,
  failedAttempts: 0,
  userRequestedProductHelp: false,
  ...overrides,
});

describe('seven-stage runtime', () => {
  it('traces all seven stages on every response', () => {
    const response = respond(request());
    expect(response.trace).toHaveLength(7);
    expect(response.trace[0]).toMatch(/^1:context/);
    expect(response.trace[6]).toMatch(/^7:learn/);
  });

  it('produces the structured response contract from §11.1', () => {
    const response = respond(request());
    expect(response).toMatchObject({
      mode: expect.any(String),
      risk: expect.any(String),
      intent: expect.any(String),
      node_ids: ['KN-D01-07-001'],
      skill_ids: ['SK01'],
    });
    expect(response.commerce).toHaveProperty('eligible');
    expect(response.mastery_event).toHaveProperty('status');
  });
});

describe('grounding and the hallucination firewall (§3.3)', () => {
  it('grounds in a node that exists', () => {
    expect(respond(request()).node_ids).toEqual(['KN-D01-07-001']);
  });

  it('grounds in nothing rather than inventing an unknown node (T03)', () => {
    const response = respond(request({ nodeId: 'KN-D99-99-999' }));
    expect(response.node_ids).toEqual([]);
    expect(response.trace.some((line) => line.includes('no entity fabricated'))).toBe(true);
  });

  it('marks an unverified grounded node as not statable as fact', () => {
    const response = respond(request());
    expect(response.disclosures.map((d) => d.code)).toContain('PENDING_VERIFICATION');
    expect(response.trace.some((line) => line.includes('mayStateAsFact=false'))).toBe(true);
  });
});

describe('mode router (§2.2)', () => {
  it('routes a new concept question to TEACH', () => {
    expect(routeMode('LEARN', 'R0', 0)).toBe('TEACH');
  });

  it('routes a stuck learner to COACH and a repeatedly stuck one to REMEDIATE (T07)', () => {
    expect(routeMode('LEARN', 'R0', 1)).toBe('COACH');
    expect(routeMode('LEARN', 'R0', 3)).toBe('REMEDIATE');
  });

  it('lets safety override every other mode', () => {
    expect(routeMode('LEARN', 'R2', 0)).toBe('SAFETY');
    expect(routeMode('DECIDE', 'R3', 5)).toBe('SAFETY');
  });

  it('classifies a severe-reaction message as SAFETY intent', () => {
    expect(classifyIntent('얼굴이 너무 아프고 붓는 것 같아')).toBe('SAFETY');
  });
});

describe('hint ladder (§5.1-§5.2)', () => {
  it('starts at H0 and escalates one step at a time', () => {
    expect(nextHintLevel(0, 0)).toBe('H0');
    expect(nextHintLevel(1, 0)).toBe('H1');
    expect(nextHintLevel(0, 2)).toBe('H2');
  });

  it('reaches explicit teaching at H4 and does not run past it', () => {
    expect(nextHintLevel(4, 0)).toBe('H4');
    expect(nextHintLevel(9, 9)).toBe('H4');
  });

  it('does not offer a hint level when the flow is halted for safety', () => {
    const response = respond(request({ userMessage: '감염된 것 같고 고름이 나와요' }));
    expect(response.mode).toBe('SAFETY');
    expect(response.hint_level).toBeNull();
    expect(response.next_action).toBeNull();
  });
});

describe('commerce boundary (§8)', () => {
  it('suppresses commerce for a plain learning question (T09)', () => {
    const response = respond(request());
    expect(response.commerce.eligible).toBe(false);
    expect(response.commerce.failedGates).toContain('G1_USER_INTENT');
  });

  it('still suppresses commerce when asked, because product data is unverified (SR-011)', () => {
    const response = respond(request({ userRequestedProductHelp: true }));
    expect(response.commerce.eligible).toBe(false);
    expect(response.commerce.failedGates).toContain('G3_EVIDENCE');
  });

  it('suppresses commerce entirely under a safety signal (T05, T06)', () => {
    const response = respond(
      request({ userMessage: '바르고 너무 아파요', userRequestedProductHelp: true }),
    );
    expect(response.commerce.eligible).toBe(false);
    expect(response.commerce.failedGates).toContain('G4_SAFETY');
  });

  it('records no mastery event when the flow halts for safety', () => {
    const response = respond(request({ userMessage: '감염 같아요' }));
    expect(response.mastery_event.status).toBe('none');
  });
});

describe('governed AI rules', () => {
  it('enforces only rules that are both Approved and mandatory in the database', () => {
    expect(mandatoryApprovedAIRules.length).toBeGreaterThan(0);
    expect(
      mandatoryApprovedAIRules.every(
        (rule) => rule.Status === 'Approved' && rule.Priority === '필수',
      ),
    ).toBe(true);
  });

  it('does not silently enforce Draft rules', () => {
    expect(mandatoryApprovedAIRules.some((rule) => rule.Rule_ID === 'AI-002')).toBe(false);
  });
});
