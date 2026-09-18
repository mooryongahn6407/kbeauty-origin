/**
 * My Skin — the first end-to-end learning slice.
 *
 * Quest QST-001 "Mirror Detective" (World: My Skin) grounded in node KN-D01-07-001 with
 * skill SK01 Observe. All learning behaviour lives in the shared LessonRunner and the
 * session reducer; this screen only names the plan.
 */
import { MIRROR_DETECTIVE_PLAN } from '@/app/learning-session';
import { LessonRunner } from '../components/LessonRunner';

export function MySkinScreen({ locale }: { locale: string }) {
  return <LessonRunner plan={MIRROR_DETECTIVE_PLAN} locale={locale} />;
}
