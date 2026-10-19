/**
 * `POST /api/tutor` (cloudflare/tutor.ts): off unless the owner sets the key AND the switch, the
 * risk gate before anything else, only matched records as context, daily caps, no question text
 * in any log. The model API is a mocked fetch — no key exists here and none is created.
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import type { DatabaseSync as Sqlite } from 'node:sqlite';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { handle, type D1Like, type D1Statement, type Deps, type Env } from '../cloudflare/worker';
import {
  TUTOR_DAILY_CAP,
  TUTOR_IP_DAILY_CAP,
  TUTOR_MAX_TOKENS,
  TUTOR_MODEL,
  TUTOR_SYSTEM_PROMPT,
  parseTutorRequest,
  readTutorAnswer,
  tutorEnabled,
} from '../cloudflare/tutor';
import { laosDay } from '@/app/gift-code';
import { askTutorApi } from '@/tutor/tutor-api';

const { DatabaseSync } = createRequire(import.meta.url)('node:sqlite') as typeof import('node:sqlite');
const MIGRATION = readFileSync(new URL('../migrations/0001_init.sql', import.meta.url), 'utf8');

function d1(db: Sqlite): D1Like {
  const statement = (sql: string, args: unknown[]): D1Statement => ({
    bind: (...values: unknown[]) => statement(sql, values),
    first: async <T,>() => (db.prepare(sql).get(...(args as never[])) as T | undefined) ?? null,
    run: async () => ({ meta: { changes: Number(db.prepare(sql).run(...(args as never[])).changes) } }),
    all: async <T,>() => ({ results: db.prepare(sql).all(...(args as never[])) as T[] }),
  });
  return { prepare: (sql: string) => statement(sql, []) };
}

const ORIGIN = 'https://glow-next.korea-glow.com';
const FAKE_KEY = 'test-placeholder-not-a-real-key';
const QUESTION = '피부 장벽이 뭔가요?';

let sqlite: Sqlite;
let env: Env;
let deps: Deps;
let clock: number;
let apiCalls: { url: string; init: RequestInit }[];
let apiReply: () => Response;

const modelReply = (text: string) =>
  new Response(JSON.stringify({ content: [{ type: 'text', text }] }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });

beforeEach(() => {
  sqlite = new DatabaseSync(':memory:');
  sqlite.exec(MIGRATION);
  apiCalls = [];
  apiReply = () => modelReply('The skin barrier is a lesson topic here.');
  env = {
    ASSETS: { fetch: async () => new Response('asset') },
    DB: d1(sqlite),
    TUTOR_API_KEY: FAKE_KEY,
    TUTOR_ENABLED: '1',
  };
  clock = Date.parse('2026-10-20T03:00:00Z');
  deps = {
    now: () => clock,
    random: () => 0.5,
    fillRandom: (bytes) => bytes,
    blocked: new Map(),
    fetch: async (url, init) => {
      apiCalls.push({ url, init: init ?? {} });
      return apiReply();
    },
  };
});

afterEach(() => vi.restoreAllMocks());

const ask = (body: unknown, ip = '203.0.113.9') =>
  handle(
    new Request(`${ORIGIN}/api/tutor`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'cf-connecting-ip': ip },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
    env,
    { waitUntil: () => undefined },
    deps,
  );

describe('switched off by default', () => {
  it.each([
    ['no key, no switch', {}],
    ['key without the switch', { TUTOR_API_KEY: FAKE_KEY }],
    ['switch without the key', { TUTOR_ENABLED: '1' }],
    ['switch set to something else', { TUTOR_API_KEY: FAKE_KEY, TUTOR_ENABLED: 'true' }],
  ])('%s: 404, and the model is never called', async (_name, extra) => {
    env = { ASSETS: env.ASSETS, DB: env.DB, ...extra };
    expect(tutorEnabled(env)).toBe(false);
    const response = await ask({ question: QUESTION, locale: 'ko' });
    expect(response.status).toBe(404);
    expect(apiCalls).toHaveLength(0);
  });

  it('is on only with both the key and TUTOR_ENABLED="1"', () => {
    expect(tutorEnabled({ TUTOR_API_KEY: FAKE_KEY, TUTOR_ENABLED: '1' })).toBe(true);
    expect(tutorEnabled({ TUTOR_API_KEY: '  ', TUTOR_ENABLED: '1' })).toBe(false);
  });
});

describe('when switched on', () => {
  it('answers from the matched records only, with the agreed model and limits', async () => {
    const response = await ask({ question: QUESTION, locale: 'fr' });
    expect(response.status).toBe(200);
    const body = (await response.json()) as { answer: string; sourceIds: string[] };
    expect(body.answer).toBe('The skin barrier is a lesson topic here.');
    expect(body.sourceIds.length).toBeGreaterThan(0);
    expect(body.sourceIds.every((id) => !id.startsWith('PRD'))).toBe(true);

    expect(apiCalls).toHaveLength(1);
    const call = apiCalls[0]!;
    expect(call.url).toBe('https://api.anthropic.com/v1/messages');
    const headers = new Headers(call.init.headers);
    expect(headers.get('x-api-key')).toBe(FAKE_KEY);
    expect(headers.get('anthropic-version')).toBe('2023-06-01');
    const sent = JSON.parse(String(call.init.body)) as {
      model: string;
      max_tokens: number;
      system: string;
      messages: { role: string; content: string }[];
    };
    expect(sent.model).toBe(TUTOR_MODEL);
    expect(sent.model).toBe('claude-haiku-5-5');
    expect(sent.max_tokens).toBe(TUTOR_MAX_TOKENS);
    expect(sent.max_tokens).toBe(400);
    expect(sent.system).toBe(TUTOR_SYSTEM_PROMPT);
    expect(sent.system).toMatch(/never diagnose/i);
    expect(sent.system).toMatch(/ONLY from the RECORDS/);
    expect(sent.system).toMatch(/do not know/i);
    expect(sent.system).toMatch(/prices/i);
    expect(sent.system).toMatch(/never recommend or promote a product/i);
    const content = sent.messages[0]!.content;
    expect(content).toContain('REPLY LANGUAGE: French');
    for (const id of body.sourceIds) expect(content).toContain(`[${id}]`);
  });

  it('puts the risk gate first: health questions never reach the model', async () => {
    for (const question of [
      '임신 중인데 레티놀 써도 돼요?',
      'Can you diagnose this rash?',
      'ຂ້ອຍຖືພາ ໃຊ້ເຣຕິນອນໄດ້ບໍ',
      'ฉันตั้งครรภ์ ใช้เรตินอลได้ไหม',
      'Je suis enceinte, puis-je utiliser du rétinol ?',
      'I have an allergy to this cream',
      "I can't breathe after using it",
    ]) {
      clock += 61_000; // stay inside the per-minute rate limit
      const response = await ask({ question, locale: 'en' });
      const body = (await response.json()) as { answer: unknown; blocked?: boolean };
      expect(response.status, question).toBe(200);
      expect(body.answer, question).toBeNull();
      expect(body.blocked, question).toBe(true);
    }
    expect(apiCalls).toHaveLength(0);
  });

  it('does not call the model when no record matches', async () => {
    const response = await ask({ question: 'zzzz qqqq', locale: 'en' });
    expect(await response.json()).toEqual({ answer: null, sourceIds: [] });
    expect(apiCalls).toHaveLength(0);
  });

  it('refuses a question over 500 characters, or an empty one', async () => {
    expect((await ask({ question: '가'.repeat(501), locale: 'ko' })).status).toBe(400);
    expect((await ask({ question: '   ', locale: 'ko' })).status).toBe(400);
    expect(parseTutorRequest({ question: 'ກ'.repeat(500), locale: 'lo' })?.locale).toBe('lo');
    expect(parseTutorRequest({ question: 'hi', locale: 'es' })?.locale).toBe('en');
    expect(apiCalls).toHaveLength(0);
  });

  it(`caps one IP at ${TUTOR_IP_DAILY_CAP} answers a day, with a friendly 429`, async () => {
    for (let i = 0; i < TUTOR_IP_DAILY_CAP; i += 1) {
      clock += 61_000; // stay inside the per-minute rate limit
      expect((await ask({ question: QUESTION, locale: 'en' })).status).toBe(200);
    }
    clock += 61_000;
    const over = await ask({ question: QUESTION, locale: 'en' });
    expect(over.status).toBe(429);
    expect(((await over.json()) as { message: string }).message).toMatch(/try again tomorrow/i);
    expect(apiCalls).toHaveLength(TUTOR_IP_DAILY_CAP);
    clock += 61_000;
    expect((await ask({ question: QUESTION, locale: 'en' }, '198.51.100.4')).status).toBe(200);
  });

  it(`caps everyone together at ${TUTOR_DAILY_CAP} answers a Laos day`, async () => {
    sqlite
      .prepare('INSERT INTO counters (bucket, n, expires) VALUES (?, ?, ?)')
      .run(`tutor:day:${laosDay(new Date(clock))}`, TUTOR_DAILY_CAP, clock + 86_400_000);
    const response = await ask({ question: QUESTION, locale: 'en' });
    expect(response.status).toBe(429);
    expect(apiCalls).toHaveLength(0);
  });

  it('drops an answer that names a price, and reports a failed API call as unavailable', async () => {
    apiReply = () => modelReply('It costs $12 at the shop.');
    const priced = (await (await ask({ question: QUESTION, locale: 'en' })).json()) as { answer: unknown };
    expect(priced.answer).toBeNull();
    clock += 61_000;
    apiReply = () => new Response('{}', { status: 500 });
    expect((await ask({ question: QUESTION, locale: 'en' })).status).toBe(503);
  });

  it('never writes the question to any log or table', async () => {
    const spies = (['log', 'info', 'warn', 'error', 'debug'] as const).map((level) =>
      vi.spyOn(console, level).mockImplementation(() => undefined),
    );
    await ask({ question: QUESTION, locale: 'ko' });
    await ask({ question: '임신 중인데 써도 돼요?', locale: 'ko' });
    for (const spy of spies) expect(spy).not.toHaveBeenCalled();
    const stored = JSON.stringify(sqlite.prepare('SELECT * FROM counters').all());
    expect(stored).not.toContain('장벽');
    expect(stored).not.toContain('임신');
  });
});

describe('reading the model reply', () => {
  it('joins text blocks and rejects empty or priced answers', () => {
    expect(readTutorAnswer({ content: [{ type: 'text', text: ' A. ' }, { type: 'text', text: 'B.' }] })).toBe('A. \nB.');
    expect(readTutorAnswer({ content: [] })).toBeNull();
    expect(readTutorAnswer({ content: [{ type: 'text', text: '20,000 ກີບ' }] })).toBeNull();
    expect(readTutorAnswer({ content: [{ type: 'text', text: "It won't sting." }] })).toBe("It won't sting.");
    expect(readTutorAnswer(null)).toBeNull();
  });
});

describe('the app side', () => {
  it('shows an answer only for a 200 with text, and nothing otherwise', async () => {
    const reply = (status: number, body: unknown) => async () =>
      new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
    expect(await askTutorApi('q', 'en', reply(200, { answer: 'Hi.', sourceIds: ['KN-1'] }))).toEqual({
      answer: 'Hi.',
      sourceIds: ['KN-1'],
    });
    expect(await askTutorApi('q', 'en', reply(404, { error: 'not found' }))).toBeNull();
    expect(await askTutorApi('q', 'en', reply(429, { error: 'daily limit' }))).toBeNull();
    expect(await askTutorApi('q', 'en', reply(200, { answer: null, sourceIds: [] }))).toBeNull();
    expect(
      await askTutorApi('q', 'en', async () => {
        throw new Error('offline');
      }),
    ).toBeNull();
  });
});
