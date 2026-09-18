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

  'ingredient.catalogTitle': 'Ingredient catalog',
  'ingredient.catalogIntro':
    'Every ingredient record in the governed database, shown exactly as it stands. None has completed evidence review, so these are records to inspect — not statements about what any ingredient does.',
  'ingredient.family': 'Family',
  'ingredient.function': 'Primary function',
  'ingredient.level': 'Level',
  'ingredient.learningGoal': 'Learning goal',
  'ingredient.reference': 'Reference',
  'ingredient.noReference': 'No reference recorded',
  'ingredient.questTitle': 'Ingredient Garden quests',
  'ingredient.questIntro':
    'The three governed quests for this world, wired to their real node map. Each asks the learner to state what an ingredient does, which is a scientific claim, so each stays closed until its records pass evidence review.',
  'ingredient.winCondition': 'Win condition',
  'ingredient.coreNode': 'Core node',
  'ingredient.blockedBy': 'Blocked by',
  'ingredient.lessonTitle': 'What you can learn here today',
  'ingredient.lessonIntro':
    'Ingredient literacy does not depend on unverified ingredient data. Reading a claim is a reasoning skill, so this lesson is open.',
  'ingredient.startLesson': 'Start ingredient literacy',
  'ingredient.backToGarden': 'Back to the garden',
  'ingredient.openLesson': 'Open',
  'ingredient.closedLesson': 'Closed',
  'routine.lessonTitle': 'Before you reorder anything',
  'routine.lessonIntro':
    'This world does not tell you what your routine should be. It teaches the question that makes your own routine answerable, so the lesson is open while the routine records are still in review.',
  'routine.startLesson': 'Start routine reasoning',
  'routine.backToStudio': 'Back to the studio',
  'routine.catalogTitle': 'Governed routine patterns',
  'routine.catalogIntro':
    'The ten routine records as the database holds them. Each is marked Approved, but the sheet has no field in which a routine could cite evidence, so none may be presented as the correct way to do anything.',
  'routine.sequence': 'Default sequence',
  'routine.proseSequence': 'Recorded as prose, not as an ordered step list. Shown as written.',
  'routine.linkedNodes': 'Linked knowledge',
  'routine.missingNode': 'Referenced node does not exist',
  'routine.questTitle': 'Routine Studio quest',
  'routine.studioTitle': 'My routine — a reflection',
  'routine.studioIntro':
    'List the steps you actually take, then say what each one is for. This records what you write and counts what you could account for. It does not evaluate your routine, rank your steps, or recommend anything.',
  'routine.addStep': 'Add step',
  'routine.stepPlaceholder': 'A step you actually take…',
  'routine.purposePlaceholder': 'What is this step for, and how would you notice?',
  'routine.toPurpose': 'Now ask why',
  'routine.finishReview': 'See what I could account for',
  'routine.reviewHeading': 'What you could account for',
  'routine.reviewSummary': '{withPurpose} of {total} steps have a purpose you stated.',
  'routine.reviewNote':
    'That number is yours, not a score. A step you could not account for is not wrong — it is simply one you cannot yet compare, defend or drop on purpose.',
  'routine.startOver': 'Start over',
  'routine.noSteps': 'No steps listed yet.',
  'routine.stepLabel': 'Step',
  'routine.purposeLabel': 'Purpose',
  'routine.notStated': 'Not stated',
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

  'ingredient.catalogTitle': '성분 카탈로그',
  'ingredient.catalogIntro':
    '거버넌스 데이터베이스의 모든 성분 레코드를 있는 그대로 보여 줍니다. 근거 검토를 마친 것은 하나도 없으므로, 이것은 살펴볼 레코드이지 성분이 무엇을 한다는 진술이 아닙니다.',
  'ingredient.family': '계열',
  'ingredient.function': '주요 기능',
  'ingredient.level': '수준',
  'ingredient.learningGoal': '학습 목표',
  'ingredient.reference': '참고 자료',
  'ingredient.noReference': '기록된 참고 자료 없음',
  'ingredient.questTitle': '성분 가든 퀘스트',
  'ingredient.questIntro':
    '이 세계의 공식 퀘스트 세 개를 실제 노드 맵에 연결했습니다. 셋 다 성분이 무엇을 하는지 답하도록 요구하는 과학적 주장이므로, 레코드가 근거 검토를 통과할 때까지 닫혀 있습니다.',
  'ingredient.winCondition': '완료 조건',
  'ingredient.coreNode': '핵심 노드',
  'ingredient.blockedBy': '차단 사유',
  'ingredient.lessonTitle': '오늘 여기서 배울 수 있는 것',
  'ingredient.lessonIntro':
    '성분 리터러시는 검증되지 않은 성분 데이터에 의존하지 않습니다. 광고 문구를 읽는 일은 사고 기술이므로 이 수업은 열려 있습니다.',
  'ingredient.startLesson': '성분 리터러시 시작하기',
  'ingredient.backToGarden': '가든으로 돌아가기',
  'ingredient.openLesson': '열림',
  'ingredient.closedLesson': '닫힘',
  'routine.lessonTitle': '순서를 바꾸기 전에',
  'routine.lessonIntro':
    '이 세계는 당신의 루틴이 어때야 하는지 말하지 않습니다. 내 루틴에 대해 답할 수 있게 만드는 질문을 가르치므로, 루틴 레코드가 검토 중이어도 이 수업은 열려 있습니다.',
  'routine.startLesson': '루틴 사고 시작하기',
  'routine.backToStudio': '스튜디오로 돌아가기',
  'routine.catalogTitle': '공식 루틴 패턴',
  'routine.catalogIntro':
    '데이터베이스가 보관한 그대로의 루틴 레코드 열 개입니다. 모두 Approved로 표시되어 있지만, 이 시트에는 루틴이 근거를 인용할 수 있는 칸이 없습니다. 따라서 어느 것도 올바른 방법으로 제시될 수 없습니다.',
  'routine.sequence': '기본 순서',
  'routine.proseSequence': '순서 목록이 아니라 서술형으로 기록되어 있습니다. 적힌 그대로 표시합니다.',
  'routine.linkedNodes': '연결된 지식',
  'routine.missingNode': '참조된 노드가 존재하지 않음',
  'routine.questTitle': '루틴 스튜디오 퀘스트',
  'routine.studioTitle': '나의 루틴 — 돌아보기',
  'routine.studioIntro':
    '실제로 하고 있는 단계를 적고, 각각이 무엇을 위한 것인지 말해 보세요. 적은 내용을 기록하고 설명할 수 있었던 개수를 세어 드립니다. 루틴을 평가하거나 단계에 순위를 매기거나 무언가를 추천하지 않습니다.',
  'routine.addStep': '단계 추가',
  'routine.stepPlaceholder': '실제로 하는 단계…',
  'routine.purposePlaceholder': '이 단계는 무엇을 위한 것이고, 되었다면 어떻게 알아차릴까요?',
  'routine.toPurpose': '이제 이유를 묻기',
  'routine.finishReview': '내가 설명할 수 있었던 것 보기',
  'routine.reviewHeading': '설명할 수 있었던 것',
  'routine.reviewSummary': '{total}개 단계 중 {withPurpose}개에 대해 목적을 말했습니다.',
  'routine.reviewNote':
    '이 숫자는 점수가 아니라 당신의 것입니다. 설명하지 못한 단계가 틀린 것은 아닙니다. 다만 아직은 비교하거나 근거를 대거나 의도를 가지고 뺄 수 없는 단계일 뿐입니다.',
  'routine.startOver': '다시 시작',
  'routine.noSteps': '아직 적은 단계가 없습니다.',
  'routine.stepLabel': '단계',
  'routine.purposeLabel': '목적',
  'routine.notStated': '말하지 않음',
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
