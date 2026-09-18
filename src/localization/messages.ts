/**
 * UI message catalog.
 *
 * UI chrome is separated from governed knowledge (AI Constitution §13.1: "Core content과 UI를
 * 분리"). Nothing in this file is a scientific, ingredient, product or regulatory claim —
 * those live in governed knowledge/evidence data, never in UI strings.
 *
 * Safety escalation wording is deliberately generic pending the approved market pack (SR-014).
 */
import { BASE_LOCALE } from './locales';

export type MessageKey = keyof typeof MESSAGES_EN;

const MESSAGES_EN = {
  'app.title': 'Beauty Learning World',
  'app.brand': 'KOREA GLOW',
  'app.northStar': 'Learn Beauty. Know Yourself. Choose Better.',

  'nav.mySkin': 'My Skin',
  'nav.ingredientGarden': 'Ingredient Garden',
  'nav.routineStudio': 'Routine Studio',
  'nav.sunProtection': 'Sun Protection',
  'nav.labelDetective': 'Label Detective',
  'nav.aiTutor': 'AI Tutor',
  'nav.quests': 'Quests & Mastery',
  'nav.governance': 'Content Governance',

  'disclosure.pendingVerification':
    'This knowledge record has not completed evidence review. It is shown for learning, not as verified fact.',
  'disclosure.workingDataset':
    'Working dataset. The canonical curriculum structure has not been approved yet.',
  'disclosure.notMedicalAdvice':
    'This is cosmetic education, not medical diagnosis or treatment.',
  'disclosure.authoredScaffold':
    'Learning scaffolding authored for this prototype. It teaches reasoning, and states no scientific claim.',

  'safety.escalation.R2':
    'This sounds like something to stop and check rather than learn through. Consider asking a qualified professional, and pause new products for now.',
  'safety.escalation.R3':
    'What you described should be looked at by a qualified professional. Product suggestions are switched off here.',
  'safety.escalation.R4':
    'Please seek immediate help from local emergency or medical services. This lesson is stopping here.',

  'lesson.phase.lesson': 'Micro lesson',
  'lesson.phase.ask': 'Question',
  'lesson.phase.think': 'Take a moment',
  'lesson.phase.hint': 'Hint',
  'lesson.phase.try': 'Your answer',
  'lesson.phase.feedback': 'Feedback',
  'lesson.phase.reflect': 'Reflect',
  'lesson.phase.master': 'Mastery evidence',
  'lesson.phase.complete': 'Complete',

  'lesson.think.prompt': 'Before you answer — which one could someone else check for you?',
  'lesson.think.continue': 'I have a guess',
  'lesson.hint.request': 'I need a hint',
  'lesson.hint.noneLeft': 'No further hints; the explanation below is the last step.',
  'lesson.reflect.placeholder': 'Write one sentence in your own words…',
  'lesson.reflect.submit': 'Record my reflection',
  'lesson.next': 'Next',
  'lesson.restart': 'Start again',
  'lesson.continueToTransfer': 'Try a new situation',

  'mastery.title': 'Mastery evidence',
  'mastery.accuracy': 'Accuracy',
  'mastery.independence': 'Independence',
  'mastery.transfer': 'Transfer',
  'mastery.retention': 'Retention',
  'mastery.notYet': 'Not yet evidenced',
  'mastery.satisfied': 'Evidenced',
  'mastery.explainer':
    'Mastery needs all four kinds of evidence. One correct answer is not mastery.',
  'mastery.state': 'Learner state',

  'governance.title': 'Content governance',
  'governance.openItems': 'Open governance items',
  'governance.strandTitle': 'Strand taxonomy',
  'governance.integrityTitle': 'Referential integrity',
  'governance.localeTitle': 'Locale coverage',
  'governance.noCanonical': 'No canonical taxonomy has been approved.',
  'governance.statusCounts': 'Knowledge node status',

  'common.source': 'Source',
  'common.status': 'Status',
  'common.evidence': 'Evidence',
  'common.version': 'Version',
  'common.node': 'Knowledge node',
  'common.skill': 'Skill',
  'common.locale': 'Language',
  'common.fallbackLocale': 'Shown in {locale} — no translation available yet.',
  'common.notAvailable': 'Not available',
  'common.comingSoon': 'Not built in this prototype slice.',
} as const;

/**
 * Korean catalog. Korean is a Core locale in Master DB 15_LOCALIZATION (LOC-002).
 * Keys with no entry fall back to English and the UI reports the fallback.
 */
const MESSAGES_KO: Partial<Record<MessageKey, string>> = {
  'app.title': '뷰티 러닝 월드',
  'app.northStar': '뷰티를 배우고, 나를 알고, 더 잘 선택하기.',

  'nav.mySkin': '마이 스킨',
  'nav.ingredientGarden': '성분 가든',
  'nav.routineStudio': '루틴 스튜디오',
  'nav.sunProtection': '자외선 보호',
  'nav.labelDetective': '라벨 탐정',
  'nav.aiTutor': 'AI 튜터',
  'nav.quests': '퀘스트와 숙달',
  'nav.governance': '콘텐츠 거버넌스',

  'disclosure.pendingVerification':
    '이 지식 레코드는 근거 검토를 마치지 않았습니다. 검증된 사실이 아니라 학습용으로 표시합니다.',
  'disclosure.workingDataset': '작업용 데이터셋입니다. 정본 커리큘럼 구조는 아직 승인되지 않았습니다.',
  'disclosure.notMedicalAdvice': '이것은 화장품 교육이며, 의학적 진단이나 치료가 아닙니다.',
  'disclosure.authoredScaffold':
    '이 프로토타입을 위해 작성한 학습 보조 콘텐츠입니다. 사고 방법을 가르치며 과학적 주장을 하지 않습니다.',

  'safety.escalation.R2':
    '이건 배우면서 넘어갈 일이 아니라 멈추고 확인할 일로 보입니다. 전문가에게 문의하시고, 당분간 새 제품은 잠시 미뤄 두세요.',
  'safety.escalation.R3':
    '말씀하신 상태는 전문가가 직접 봐야 합니다. 여기서는 제품 제안을 표시하지 않습니다.',
  'safety.escalation.R4': '지역 응급 서비스나 의료기관의 도움을 바로 받으세요. 이 수업은 여기서 멈춥니다.',

  'lesson.phase.lesson': '마이크로 레슨',
  'lesson.phase.ask': '질문',
  'lesson.phase.think': '잠시 생각하기',
  'lesson.phase.hint': '힌트',
  'lesson.phase.try': '나의 답',
  'lesson.phase.feedback': '피드백',
  'lesson.phase.reflect': '돌아보기',
  'lesson.phase.master': '숙달 증거',
  'lesson.phase.complete': '완료',

  'lesson.think.prompt': '답하기 전에 — 다른 사람이 대신 확인해 줄 수 있는 문장은 어느 것일까요?',
  'lesson.think.continue': '짐작 가는 게 있어요',
  'lesson.hint.request': '힌트가 필요해요',
  'lesson.hint.noneLeft': '더 이상의 힌트는 없습니다. 아래 설명이 마지막 단계입니다.',
  'lesson.reflect.placeholder': '자기 말로 한 문장 적어 보세요…',
  'lesson.reflect.submit': '내 생각 기록하기',
  'lesson.next': '다음',
  'lesson.restart': '다시 시작',
  'lesson.continueToTransfer': '새로운 상황으로 시도하기',

  'mastery.title': '숙달 증거',
  'mastery.accuracy': '정확성',
  'mastery.independence': '독립성',
  'mastery.transfer': '전이',
  'mastery.retention': '유지',
  'mastery.notYet': '아직 증거 없음',
  'mastery.satisfied': '증거 확보',
  'mastery.explainer': '숙달에는 네 가지 증거가 모두 필요합니다. 정답 하나는 숙달이 아닙니다.',
  'mastery.state': '학습자 상태',

  'governance.title': '콘텐츠 거버넌스',
  'governance.openItems': '미해결 거버넌스 항목',
  'governance.strandTitle': 'Strand 분류 체계',
  'governance.integrityTitle': '참조 무결성',
  'governance.localeTitle': '언어 커버리지',
  'governance.noCanonical': '정본으로 승인된 분류 체계가 없습니다.',
  'governance.statusCounts': '지식 노드 상태',

  'common.source': '출처',
  'common.status': '상태',
  'common.evidence': '근거',
  'common.version': '버전',
  'common.node': '지식 노드',
  'common.skill': '스킬',
  'common.locale': '언어',
  'common.fallbackLocale': '{locale}로 표시됩니다 — 아직 번역이 없습니다.',
  'common.notAvailable': '해당 없음',
  'common.comingSoon': '이 프로토타입 슬라이스에는 없습니다.',
};

const CATALOGS: Readonly<Record<string, Partial<Record<MessageKey, string>>>> = {
  en: MESSAGES_EN,
  ko: MESSAGES_KO,
};

export interface TranslationResult {
  readonly text: string;
  /** True when the requested locale had no entry and the base locale was used. */
  readonly usedFallback: boolean;
}

/** Translate a key, reporting whether a fallback was needed. */
export function translateWithMeta(
  key: MessageKey,
  locale: string,
  params: Readonly<Record<string, string>> = {},
): TranslationResult {
  const localised = CATALOGS[locale]?.[key];
  const text = localised ?? MESSAGES_EN[key];
  const interpolated = Object.entries(params).reduce(
    (acc, [name, value]) => acc.replaceAll(`{${name}}`, value),
    text,
  );
  return { text: interpolated, usedFallback: localised === undefined && locale !== BASE_LOCALE };
}

export const translate = (
  key: MessageKey,
  locale: string,
  params?: Readonly<Record<string, string>>,
): string => translateWithMeta(key, locale, params ?? {}).text;

/** Locales that have a UI catalog. Distinct from locales the content layer can render. */
export const UI_CATALOG_LOCALES: readonly string[] = Object.keys(CATALOGS);

export const messageKeys = Object.keys(MESSAGES_EN) as readonly MessageKey[];
