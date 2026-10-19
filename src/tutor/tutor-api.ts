/**
 * The optional server tutor (`POST /api/tutor`, cloudflare/worker.ts).
 *
 * The rule-based tutor always answers first and stays the answer of record. The server tutor is
 * OFF until the owner sets its key and switch (see the Worker); while it is off, or busy, or
 * capped for the day, or anything at all goes wrong, this returns null and the screen simply
 * shows nothing more. Only a 200 with a non-empty answer is ever shown.
 *
 * The app never sends a question the local risk gate escalated — the server repeats the same
 * gate anyway.
 */
export const TUTOR_API_PATH = '/api/tutor';
export const TUTOR_API_TIMEOUT_MS = 12_000;
export const TUTOR_API_MAX_CHARS = 500;

export interface TutorApiAnswer {
  readonly answer: string;
  readonly sourceIds: readonly string[];
}

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export async function askTutorApi(
  question: string,
  locale: string,
  fetchImpl: FetchLike | undefined = typeof fetch === 'function' ? fetch : undefined,
): Promise<TutorApiAnswer | null> {
  const text = question.trim().slice(0, TUTOR_API_MAX_CHARS);
  if (!fetchImpl || text === '') return null;
  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), TUTOR_API_TIMEOUT_MS) : null;
  try {
    const response = await fetchImpl(TUTOR_API_PATH, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ question: text, locale }),
      ...(controller ? { signal: controller.signal } : {}),
    });
    if (response.status !== 200) return null;
    const body = (await response.json()) as { answer?: unknown; sourceIds?: unknown };
    if (typeof body.answer !== 'string' || body.answer.trim() === '') return null;
    const sourceIds = Array.isArray(body.sourceIds)
      ? body.sourceIds.filter((id): id is string => typeof id === 'string')
      : [];
    return { answer: body.answer.trim(), sourceIds };
  } catch {
    return null;
  } finally {
    if (timer) clearTimeout(timer);
  }
}
