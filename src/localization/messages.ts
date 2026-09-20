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
  'lesson.finish': 'Finish this lesson',
  'lesson.finished': 'Lesson finished. Your evidence is kept in Quests & Mastery.',

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
  'sun.lessonTitle': 'What you can establish yourself',
  'sun.lessonIntro':
    'This world does not tell you what sun protection to use. The evidence registry holds no source about sun or ultraviolet exposure at all, so the only honest thing it can teach is the boundary between what you observe and what needs evidence.',
  'sun.startLesson': 'Start exposure reasoning',
  'sun.backToObservatory': 'Back to the observatory',
  'sun.logTitle': 'My exposure log',
  'sun.logIntro':
    'Record the parts of your day you were actually present for: what you were doing, roughly when, for how long, and the setting. This records and counts. It gives no score, no threshold and no advice.',
  'sun.activity': 'What were you doing?',
  'sun.activityPlaceholder': 'walked to the market…',
  'sun.band': 'Roughly when',
  'sun.setting': 'Setting',
  'sun.minutes': 'Minutes',
  'sun.addEntry': 'Add to log',
  'sun.review': 'See what I recorded',
  'sun.noEntries': 'Nothing recorded yet.',
  'sun.summaryTotal': '{entries} period(s) recorded, {minutes} minutes in total.',
  'sun.summaryNote':
    'These are your own observations, not a measurement and not a risk level. Time bands you did not record are gaps in the log, not statements about your day.',
  'sun.notRecorded': 'Not recorded',
  'sun.startOver': 'Start over',
  'sun.evidenceTitle': 'Evidence position for this domain',
  'sun.questTitle': 'Sun Observatory quests',
  'sun.band.early-morning': 'Early morning',
  'sun.band.midday': 'Midday',
  'sun.band.afternoon': 'Afternoon',
  'sun.band.evening': 'Evening',
  'sun.setting.open': 'Open, no cover',
  'sun.setting.partial-shade': 'Partial shade',
  'sun.setting.shade': 'Shade',
  'sun.setting.indoors-by-window': 'Indoors by a window',
  'label.title': 'Four messages, one box',
  'label.intro':
    'Reading a label is sorting, not judging. This world helps you tell the four parts apart. It never tells you whether a claim is true or whether a product suits you.',
  'label.startLesson': 'Start label reading',
  'label.backToLibrary': 'Back to the library',
  'label.sorterTitle': 'Sort this label',
  'label.sorterIntro': 'Put each line where you think it belongs. Nothing is marked until you ask.',
  'label.specimenWarning': 'A practice label — invented, with no brand.',
  'label.unplaced': 'Lines to sort',
  'label.allSorted': 'Every line is placed. Shall we look together?',
  'label.check': 'Check my sorting',
  'label.keepSorting': 'Let me move a few',
  'label.finish': 'Finish',
  'label.startOver': 'Start over',
  'label.allCorrectTitle': 'All four parts, told apart.',
  'label.allCorrectBody':
    'You can now do this to any box you pick up. The parts will be more tangled on a real label than on this one.',
  'label.someWrongTitle': 'Nearly — {correct} of {total} are where they belong.',
  'label.someWrongBody':
    'The ones below moved to the wrong place. Have a read, then move them and check again. Getting these wrong first is how the difference becomes obvious.',
  'label.whyLabel': 'In plain words',
  'label.movedTo': 'You put this under',
  'label.belongsIn': 'It belongs under',
  'label.bucket.CLAIM': 'What it says about itself',
  'label.bucket.INGREDIENTS': 'What is inside',
  'label.bucket.HOW_TO_USE': 'What to do with it',
  'label.bucket.CAUTION': 'What to watch for',
  'label.bucketHint.CLAIM': 'Written to interest you. The company chose to say it.',
  'label.bucketHint.INGREDIENTS': 'Names of what is in the bottle. Required to be printed.',
  'label.bucketHint.HOW_TO_USE': 'An instruction from the maker about using it.',
  'label.bucketHint.CAUTION': 'A warning about stopping, storing or asking someone.',
  'label.questTitle': 'Label Detective quest',
  'label.evidenceTitle': 'Evidence position for this domain',
  'tutor.title': 'Ask, and see what I am standing on',
  'tutor.intro':
    'This tutor does not generate answers. It shows you what it understood, which governed records it found, and exactly what it may and may not say — so you can judge the reasoning rather than trust the wording.',
  'tutor.placeholder': 'Ask anything about beauty…',
  'tutor.ask': 'Ask',
  'tutor.tryThese': 'Try one of these',
  'tutor.understood': 'What I understood',
  'tutor.intent': 'Intent',
  'tutor.mode': 'Mode',
  'tutor.risk': 'Risk',
  'tutor.hintLevel': 'Hint level',
  'tutor.grounding': 'What I found',
  'tutor.groundingEmpty':
    'Nothing in the governed knowledge matched. I will not invent a record to answer from.',
  'tutor.groundingCount': 'Searched {searched} records · {found} matched',
  'tutor.matched': 'matched',
  'tutor.canSay': 'What I can say',
  'tutor.contractNote':
    'A {mode} response has {total} parts. {filled} can be filled honestly right now.',
  'tutor.slotBlocked': 'cannot be filled',
  'tutor.uncertainty': 'What I am unsure about',
  'tutor.commerce': 'Product suggestions',
  'tutor.commerceBlocked': 'Suppressed. Failed gates: {gates}',
  'tutor.trace': 'Runtime trace',
  'tutor.traceNote':
    'The seven stages the Constitution specifies: context, ground, classify, risk gate, respond, verify, learn.',
  'tutor.rulesTitle': 'Rules enforced as hard gates',
  'tutor.rulesNote':
    'Only AI rules that are both Approved and mandatory in the database are enforced. Draft rules are readable but do not silently become enforcement.',
  'tutor.evalTitle': 'Constitution §16 evaluation suite',
  'tutor.evalNote':
    'Ten scenarios the Constitution requires to pass before launch. They run against this same runtime.',
  'tutor.evalPassed': '{passed} of {total} pass',
  'quest.title': 'Twenty-five quests, and what each is waiting on',
  'quest.intro':
    'This is a map of the curriculum, not a progress bar. Most quests cannot open yet, and each one says which record is stopping it. Nothing here awards points: no source defines an amount for any reward.',
  'quest.mapTitle': 'Quest map',
  'quest.summary':
    '{open} of {total} quests can open · {worlds} worlds · {served} already served by a lesson · {missing} blocked by a record that does not exist',
  'quest.open': 'Open',
  'quest.closed': 'Locked',
  'quest.reward': 'Reward',
  'quest.rewardNote':
    'Reward labels are shown exactly as the database records them. No source states an amount for any of them, so nothing is totalled.',
  'quest.claimClass': 'Claim class',
  'quest.servedBy': 'Served by',
  'quest.blockers': 'Waiting on',
  'quest.noBlockers': 'Nothing is blocking this quest.',
  'quest.unresolvedSkill': 'Names a skill that does not exist',
  'quest.masteryTitle': 'Mastery evidence',
  'quest.masteryIntro':
    'Twelve governed skills. Evidence is earned only by answering, and it carries across every world — a skill practised while reading a label is the same skill practised in the garden.',
  'quest.noEvidence': 'No evidence yet',
  'quest.evidenceFrom': 'Evidence from',
  'quest.attempts': 'attempts',
  'quest.ladderTitle': 'The seven-level ladder',
  'quest.ladderNote':
    'The Mastery Competency Matrix proposes seven levels from Beauty Explorer to Beauty Master. It is marked "DECISION DRAFT — NOT CANONICAL", so no level is assigned to anyone here.',
  'quest.resetLedger': 'Clear my evidence',
  'quest.ledgerSummary': '{attempts} attempts recorded · {started} of 12 skills have evidence · {mastered} mastered',

  'display.theme': 'Theme',
  'display.theme.auto': 'Auto',
  'display.theme.light': 'Light',
  'display.theme.dark': 'Dark',
  'display.textSize': 'Text size',
  'display.textSize.normal': 'A',
  'display.textSize.large': 'A+',
  'display.textSize.larger': 'A++',
  'display.skipToContent': 'Skip to the main content',

  'speech.listen': 'Listen',
  'speech.stop': 'Stop',
  'speech.unavailable': 'No voice for this language on this device',
  'speech.listenIn': 'Listen (in {language})',

  'catalog.unreviewed':
    'This interface translation has not yet been checked by a speaker of this language. Wording may be wrong. The lessons themselves are unaffected.',
  'catalog.safetyOriginal': 'Original wording, for safety',

  /* ---- Skin Quest ---------------------------------------------------------
   * Every line below is about the activity — what to look at, what to tap, what was
   * recorded. None of it says what skin is, does, or needs, because no knowledge record has
   * passed the evidence gate yet. */
  'skinquest.title': 'Skin Quest',
  'skinquest.welcome.eyebrow': 'Four minutes, with your own skin',
  'skinquest.welcome.headline': 'Nobody has looked at your skin as often as you have.',
  'skinquest.welcome.lead':
    'This is not a test and there are no wrong answers. You look, you answer, and at the end you keep the record you made.',
  'skinquest.welcome.begin': 'Start looking',
  'skinquest.welcome.boundary':
    'This is cosmetic observation, not diagnosis. If something hurts, spreads or keeps getting worse, that is for a qualified professional, not for an app.',
  'skinquest.progress': 'Step {done} of {total}',
  'skinquest.level.L1': 'Level 1 · What you can see',
  'skinquest.level.L2': 'Level 2 · How it changes',
  'skinquest.level.L3': 'Level 3 · What you already do',
  'skinquest.back': 'Back',
  'skinquest.continue': 'Continue',
  'skinquest.thatsMe': "That's me",

  'skinquest.L1.S1.prompt': 'An hour after washing, with nothing applied — how does your face feel?',
  'skinquest.L1.S1.help': 'Pick the closest one. You can change it later.',
  'skinquest.L1.S1.tight': 'Tight',
  'skinquest.L1.S1.comfortable': 'Comfortable',
  'skinquest.L1.S1.shiny': 'Shiny',
  'skinquest.L1.S1.mixed': 'Different in different places',

  'skinquest.L1.S2.prompt': 'Where are you looking today?',
  'skinquest.L1.S2.help': 'Start wherever you are actually curious.',
  'skinquest.L1.S2.face': 'My face',
  'skinquest.L1.S2.body': 'My body',
  'skinquest.L1.S2.hair': 'My scalp and hair',

  'skinquest.L2.S1.prompt': 'When you try something new, does your skin react?',
  'skinquest.L2.S1.help': 'React means anything you noticed afterwards — not only stinging.',
  'skinquest.L2.S1.never': 'Not that I have noticed',
  'skinquest.L2.S1.sometimes': 'Sometimes',
  'skinquest.L2.S1.often': 'Often',
  'skinquest.L2.S1.unsure': 'I have never paid attention',

  'skinquest.L2.S2.prompt': 'When do you notice it most?',
  'skinquest.L2.S2.help': 'Think of an ordinary day, not your worst one.',
  'skinquest.L2.S2.morning': 'In the morning',
  'skinquest.L2.S2.evening': 'By the end of the day',
  'skinquest.L2.S2.both': 'Both',
  'skinquest.L2.S2.varies': 'It changes with the weather',

  'skinquest.L3.S1.prompt': 'How often do you use sun protection?',
  'skinquest.L3.S1.help': 'Answer for what you actually do, not what you mean to do.',
  'skinquest.L3.S1.daily': 'Every day',
  'skinquest.L3.S1.sunny': 'On sunny days',
  'skinquest.L3.S1.rarely': 'Rarely',
  'skinquest.L3.S1.never': 'Never',

  'skinquest.concerns.prompt': 'Which of these are you noticing right now?',
  'skinquest.concerns.help': 'Pick as many as you like, or none. This is your list, not a verdict.',
  'skinquest.concerns.none': 'None of these right now',

  'skinquest.record.eyebrow': 'Your record',
  'skinquest.record.headline': 'Here is what you observed.',
  'skinquest.record.lead':
    'These are your own answers, written down. Nothing here has been interpreted, scored or diagnosed.',
  'skinquest.record.answers': 'What you answered',
  'skinquest.record.picked': 'What you are noticing',
  'skinquest.record.nothingPicked': 'You did not pick anything to watch — that is a valid answer.',
  'skinquest.record.learnNext': 'What this world can teach you about these',
  'skinquest.record.pendingReview':
    'The topics above are drawn from the Master Database and are still in review, so they are named as topics to learn — not stated as fact.',
  'skinquest.record.routine': 'The one sequence that is approved',
  'skinquest.record.routineNote':
    'Of everything in the Master Database, the routine sequences are the records that have been approved. This is that sequence, unchanged.',
  'skinquest.record.escalation':
    'One or more of the things you picked is marked in the source as needing a qualified professional rather than self-care learning. Please give it that weight.',
  'skinquest.record.restart': 'Start over',
  'skinquest.record.explore': 'Go deeper into the lessons',
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
  'lesson.finish': '이 레슨 마치기',
  'lesson.finished': '레슨을 마쳤습니다. 증거는 퀘스트와 숙달에 기록되어 있습니다.',

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
  'sun.lessonTitle': '내가 스스로 확인할 수 있는 것',
  'sun.lessonIntro':
    '이 세계는 어떤 자외선 보호를 해야 하는지 알려 드리지 않습니다. 근거 등록부에 햇빛이나 자외선 노출에 관한 자료가 하나도 없기 때문에, 정직하게 가르칠 수 있는 것은 관찰과 근거 사이의 경계뿐입니다.',
  'sun.startLesson': '노출 관찰 시작하기',
  'sun.backToObservatory': '관측소로 돌아가기',
  'sun.logTitle': '나의 노출 기록',
  'sun.logIntro':
    '내가 실제로 그 자리에 있었던 부분을 적어 보세요. 무엇을 했고, 대략 언제였고, 얼마나였고, 어떤 환경이었는지. 기록하고 세어 드립니다. 점수도, 기준치도, 조언도 없습니다.',
  'sun.activity': '무엇을 하고 계셨나요?',
  'sun.activityPlaceholder': '시장까지 걸어감…',
  'sun.band': '대략 언제',
  'sun.setting': '환경',
  'sun.minutes': '분',
  'sun.addEntry': '기록에 추가',
  'sun.review': '기록한 것 보기',
  'sun.noEntries': '아직 기록한 것이 없습니다.',
  'sun.summaryTotal': '{entries}개 구간, 합계 {minutes}분을 기록했습니다.',
  'sun.summaryNote':
    '이것은 당신의 관찰이며 측정값도 위험도도 아닙니다. 기록하지 않은 시간대는 기록의 빈칸일 뿐, 그날에 대한 진술이 아닙니다.',
  'sun.notRecorded': '기록 없음',
  'sun.startOver': '다시 시작',
  'sun.evidenceTitle': '이 영역의 근거 상태',
  'sun.questTitle': '선 옵저버토리 퀘스트',
  'sun.band.early-morning': '이른 아침',
  'sun.band.midday': '한낮',
  'sun.band.afternoon': '오후',
  'sun.band.evening': '저녁',
  'sun.setting.open': '가림 없는 곳',
  'sun.setting.partial-shade': '부분 그늘',
  'sun.setting.shade': '그늘',
  'sun.setting.indoors-by-window': '창가 실내',
  'label.title': '상자 하나, 메시지 넷',
  'label.intro':
    '라벨을 읽는 일은 분류하는 일이지 판정하는 일이 아닙니다. 이 세계는 네 부분을 구분하도록 돕습니다. 어떤 문구가 사실인지, 그 제품이 나에게 맞는지는 말하지 않습니다.',
  'label.startLesson': '라벨 읽기 시작하기',
  'label.backToLibrary': '라이브러리로 돌아가기',
  'label.sorterTitle': '이 라벨을 분류해 보세요',
  'label.sorterIntro': '각 줄을 어디에 속한다고 생각하시는 곳에 놓아 보세요. 말씀하시기 전까지는 채점하지 않습니다.',
  'label.specimenWarning': '연습용 라벨입니다. 브랜드 없이 지어낸 것입니다.',
  'label.unplaced': '분류할 줄',
  'label.allSorted': '모든 줄을 놓으셨습니다. 같이 볼까요?',
  'label.check': '내 분류 확인하기',
  'label.keepSorting': '몇 개 옮겨 볼게요',
  'label.finish': '마치기',
  'label.startOver': '다시 시작',
  'label.allCorrectTitle': '네 부분을 모두 구분하셨습니다.',
  'label.allCorrectBody':
    '이제 어떤 상자를 집어도 같은 방법을 쓰실 수 있습니다. 실제 라벨은 이 연습용보다 훨씬 더 섞여 있습니다.',
  'label.someWrongTitle': '거의 다 됐어요 — {total}개 중 {correct}개가 제자리입니다.',
  'label.someWrongBody':
    '아래 줄들이 다른 자리에 갔습니다. 한번 읽어 보시고 옮긴 뒤에 다시 확인해 보세요. 처음에 틀려 보는 것이 차이를 또렷하게 만듭니다.',
  'label.whyLabel': '쉽게 말하면',
  'label.movedTo': '여기에 놓으셨습니다',
  'label.belongsIn': '속하는 곳은',
  'label.bucket.CLAIM': '스스로에 대해 하는 말',
  'label.bucket.INGREDIENTS': '안에 든 것',
  'label.bucket.HOW_TO_USE': '어떻게 쓰는지',
  'label.bucket.CAUTION': '조심할 것',
  'label.bucketHint.CLAIM': '관심을 끌려고 쓴 문장입니다. 회사가 말하기로 선택한 부분입니다.',
  'label.bucketHint.INGREDIENTS': '통 안에 든 것의 이름입니다. 인쇄해야만 하는 부분입니다.',
  'label.bucketHint.HOW_TO_USE': '만든 쪽이 사용에 대해 주는 지시입니다.',
  'label.bucketHint.CAUTION': '중단·보관·상담에 대한 경고입니다.',
  'label.questTitle': '라벨 탐정 퀘스트',
  'label.evidenceTitle': '이 영역의 근거 상태',
  'tutor.title': '물어보세요. 제가 무엇에 근거하는지 함께 보여 드립니다',
  'tutor.intro':
    '이 튜터는 답을 지어내지 않습니다. 무엇으로 이해했는지, 어떤 공식 레코드를 찾았는지, 무엇을 말할 수 있고 없는지를 그대로 보여 드립니다. 말솜씨가 아니라 근거를 보고 판단하시라는 뜻입니다.',
  'tutor.placeholder': '뷰티에 대해 무엇이든 물어보세요…',
  'tutor.ask': '물어보기',
  'tutor.tryThese': '이런 걸 물어보실 수 있어요',
  'tutor.understood': '제가 이해한 것',
  'tutor.intent': '의도',
  'tutor.mode': '모드',
  'tutor.risk': '위험도',
  'tutor.hintLevel': '힌트 단계',
  'tutor.grounding': '제가 찾은 것',
  'tutor.groundingEmpty':
    '공식 지식에서 일치하는 것이 없습니다. 답하기 위해 레코드를 지어내지 않겠습니다.',
  'tutor.groundingCount': '{searched}개 레코드 검색 · {found}개 일치',
  'tutor.matched': '일치',
  'tutor.canSay': '제가 말할 수 있는 것',
  'tutor.contractNote':
    '{mode} 응답은 {total}개 부분으로 이루어집니다. 지금 정직하게 채울 수 있는 것은 {filled}개입니다.',
  'tutor.slotBlocked': '채울 수 없음',
  'tutor.uncertainty': '제가 확신하지 못하는 것',
  'tutor.commerce': '제품 제안',
  'tutor.commerceBlocked': '표시하지 않습니다. 통과하지 못한 게이트: {gates}',
  'tutor.trace': '런타임 추적',
  'tutor.traceNote':
    'Constitution이 정한 일곱 단계입니다. 맥락 · 근거 · 분류 · 위험 게이트 · 응답 · 검증 · 학습.',
  'tutor.rulesTitle': '하드 게이트로 강제되는 규칙',
  'tutor.rulesNote':
    '데이터베이스에서 Approved이면서 필수인 AI 규칙만 강제합니다. Draft 규칙은 읽을 수 있지만 조용히 강제되지 않습니다.',
  'tutor.evalTitle': 'Constitution §16 평가 시나리오',
  'tutor.evalNote':
    'Constitution이 출시 전 반드시 통과하도록 요구하는 열 가지 시나리오입니다. 지금 이 런타임을 대상으로 실행됩니다.',
  'tutor.evalPassed': '{total}개 중 {passed}개 통과',
  'quest.title': '스물다섯 개의 퀘스트, 그리고 각각이 기다리는 것',
  'quest.intro':
    '이것은 진행률 막대가 아니라 커리큘럼 지도입니다. 대부분의 퀘스트는 아직 열 수 없고, 각각 어떤 레코드가 막고 있는지 말해 줍니다. 여기서는 점수를 주지 않습니다. 어떤 보상에도 수치를 정한 자료가 없기 때문입니다.',
  'quest.mapTitle': '퀘스트 지도',
  'quest.summary':
    '{total}개 중 {open}개 열 수 있음 · {worlds}개 월드 · {served}개는 이미 수업으로 제공 중 · {missing}개는 존재하지 않는 레코드 때문에 막힘',
  'quest.open': '열림',
  'quest.closed': '잠김',
  'quest.reward': '보상',
  'quest.rewardNote':
    '보상 표기는 데이터베이스에 적힌 그대로입니다. 어떤 자료도 수치를 정하지 않았으므로 합산하지 않습니다.',
  'quest.claimClass': '주장 분류',
  'quest.servedBy': '제공 중인 수업',
  'quest.blockers': '기다리는 것',
  'quest.noBlockers': '이 퀘스트를 막는 것이 없습니다.',
  'quest.unresolvedSkill': '존재하지 않는 스킬을 가리킴',
  'quest.masteryTitle': '숙달 증거',
  'quest.masteryIntro':
    '열두 개의 공식 스킬입니다. 증거는 답을 통해서만 쌓이고, 모든 월드를 가로질러 이어집니다. 라벨을 읽으며 연습한 스킬은 성분 가든에서 연습한 그 스킬과 같습니다.',
  'quest.noEvidence': '아직 증거 없음',
  'quest.evidenceFrom': '증거 출처',
  'quest.attempts': '시도',
  'quest.ladderTitle': '일곱 단계 사다리',
  'quest.ladderNote':
    'Mastery Competency Matrix는 Beauty Explorer부터 Beauty Master까지 일곱 단계를 제안합니다. 다만 "DECISION DRAFT — NOT CANONICAL"로 표시되어 있어, 여기서는 누구에게도 단계를 부여하지 않습니다.',
  'quest.resetLedger': '내 증거 지우기',
  'quest.ledgerSummary': '{attempts}회 시도 기록 · 12개 스킬 중 {started}개에 증거 · {mastered}개 숙달',

  'display.theme': '화면 모드',
  'display.theme.auto': '자동',
  'display.theme.light': '밝게',
  'display.theme.dark': '어둡게',
  'display.textSize': '글자 크기',
  'display.textSize.normal': '가',
  'display.textSize.large': '가+',
  'display.textSize.larger': '가++',
  'display.skipToContent': '본문으로 건너뛰기',

  'speech.listen': '듣기',
  'speech.stop': '정지',
  'speech.unavailable': '이 기기에는 이 언어의 음성이 없습니다',
  'speech.listenIn': '{language}로 듣기',

  'catalog.unreviewed':
    '이 화면의 번역은 아직 해당 언어 사용자의 검수를 받지 않았습니다. 표현이 틀릴 수 있습니다. 레슨 내용 자체는 영향을 받지 않습니다.',
  'catalog.safetyOriginal': '안전을 위한 원문',

  'skinquest.title': '스킨 퀘스트',
  'skinquest.welcome.eyebrow': '내 피부와 함께하는 4분',
  'skinquest.welcome.headline': '당신의 피부를 당신만큼 자주 본 사람은 없습니다.',
  'skinquest.welcome.lead':
    '시험이 아니고 틀린 답도 없습니다. 보고, 답하고, 끝나면 당신이 만든 기록이 남습니다.',
  'skinquest.welcome.begin': '내 피부 보러 가기',
  'skinquest.welcome.boundary':
    '이것은 화장품 관점의 관찰이며 진단이 아닙니다. 아프거나, 번지거나, 점점 심해진다면 그때는 앱이 아니라 전문가를 찾을 때입니다.',
  'skinquest.progress': '{total}단계 중 {done}단계',
  'skinquest.level.L1': '1단계 · 지금 보이는 것',
  'skinquest.level.L2': '2단계 · 달라지는 것',
  'skinquest.level.L3': '3단계 · 이미 하고 있는 것',
  'skinquest.back': '이전',
  'skinquest.continue': '다음',
  'skinquest.thatsMe': '이게 나예요',

  'skinquest.L1.S1.prompt': '세수하고 한 시간, 아무것도 바르지 않았을 때 얼굴이 어떤가요?',
  'skinquest.L1.S1.help': '가장 가까운 것을 고르세요. 나중에 바꿀 수 있습니다.',
  'skinquest.L1.S1.tight': '당깁니다',
  'skinquest.L1.S1.comfortable': '편안합니다',
  'skinquest.L1.S1.shiny': '번들거립니다',
  'skinquest.L1.S1.mixed': '부위마다 다릅니다',

  'skinquest.L1.S2.prompt': '오늘은 어디를 보고 계신가요?',
  'skinquest.L1.S2.help': '지금 정말 궁금한 곳부터 시작하세요.',
  'skinquest.L1.S2.face': '얼굴',
  'skinquest.L1.S2.body': '몸',
  'skinquest.L1.S2.hair': '두피와 머리카락',

  'skinquest.L2.S1.prompt': '새로운 것을 써 보면 피부가 반응하나요?',
  'skinquest.L2.S1.help': '반응은 따가움만이 아니라, 쓰고 나서 알아차린 모든 것을 말합니다.',
  'skinquest.L2.S1.never': '알아차린 적 없습니다',
  'skinquest.L2.S1.sometimes': '가끔 그렇습니다',
  'skinquest.L2.S1.often': '자주 그렇습니다',
  'skinquest.L2.S1.unsure': '신경 써 본 적이 없습니다',

  'skinquest.L2.S2.prompt': '언제 가장 많이 느끼시나요?',
  'skinquest.L2.S2.help': '가장 심했던 날 말고, 보통의 하루를 떠올려 보세요.',
  'skinquest.L2.S2.morning': '아침에',
  'skinquest.L2.S2.evening': '하루가 끝날 무렵',
  'skinquest.L2.S2.both': '둘 다',
  'skinquest.L2.S2.varies': '날씨에 따라 달라집니다',

  'skinquest.L3.S1.prompt': '자외선 차단은 얼마나 자주 하시나요?',
  'skinquest.L3.S1.help': '하려고 마음먹은 것 말고, 실제로 하고 있는 것을 답해 주세요.',
  'skinquest.L3.S1.daily': '매일',
  'skinquest.L3.S1.sunny': '햇빛이 강한 날',
  'skinquest.L3.S1.rarely': '가끔',
  'skinquest.L3.S1.never': '하지 않습니다',

  'skinquest.concerns.prompt': '지금 눈에 들어오는 것이 있나요?',
  'skinquest.concerns.help':
    '여러 개를 골라도 되고, 하나도 안 골라도 됩니다. 이것은 판정이 아니라 당신의 목록입니다.',
  'skinquest.concerns.none': '지금은 해당하는 것이 없습니다',

  'skinquest.record.eyebrow': '내 기록',
  'skinquest.record.headline': '당신이 관찰한 것입니다.',
  'skinquest.record.lead':
    '전부 당신이 직접 답한 내용을 그대로 적은 것입니다. 해석하거나, 점수를 매기거나, 진단하지 않았습니다.',
  'skinquest.record.answers': '당신의 답',
  'skinquest.record.picked': '눈에 들어온 것',
  'skinquest.record.nothingPicked': '지켜볼 것을 고르지 않으셨습니다. 그것도 유효한 답입니다.',
  'skinquest.record.learnNext': '이 주제로 앞으로 배울 수 있는 것',
  'skinquest.record.pendingReview':
    '위 주제들은 마스터 데이터베이스에서 가져온 것이며 아직 검수 중입니다. 그래서 사실로 단정하지 않고 "앞으로 배울 주제"로만 적었습니다.',
  'skinquest.record.routine': '승인된 단 하나의 순서',
  'skinquest.record.routineNote':
    '마스터 데이터베이스 전체에서 승인(Approved) 상태인 기록은 루틴 순서입니다. 아래는 그 순서를 그대로 옮긴 것입니다.',
  'skinquest.record.escalation':
    '고르신 항목 중에는, 원본 자료에서 자가 관리 학습이 아니라 전문가의 판단이 필요하다고 표시된 것이 있습니다. 그렇게 다뤄 주세요.',
  'skinquest.record.restart': '처음부터 다시',
  'skinquest.record.explore': '레슨으로 더 깊이 들어가기',
};


/**
 * French catalog. French is one of the few locales BOTH sources agree on: Master DB
 * 15_LOCALIZATION registers it and the Global Content Engine spec lists it, so this fills a
 * governed locale rather than inventing one — OQ-L01 stays open regardless.
 *
 * UI chrome only, like every catalog here. No French lesson content exists yet, so a learner
 * who picks French reads the interface in French and the lesson text in English, with the
 * fallback stated on screen rather than passed off as a translation.
 */
const MESSAGES_FR: Partial<Record<MessageKey, string>> = {
  'app.title': 'Le Monde de la Beauté',
  'app.northStar': 'Apprendre la beauté. Se connaître. Mieux choisir.',

  'nav.mySkin': 'Ma peau',
  'nav.ingredientGarden': 'Jardin des ingrédients',
  'nav.routineStudio': 'Atelier routine',
  'nav.sunProtection': 'Protection solaire',
  'nav.labelDetective': 'Détective d’étiquettes',
  'nav.aiTutor': 'Tuteur IA',
  'nav.quests': 'Quêtes et maîtrise',
  'nav.governance': 'Gouvernance du contenu',

  'disclosure.pendingVerification':
    'Cette fiche de connaissance n’a pas terminé sa revue des preuves. Elle est présentée pour apprendre, non comme un fait vérifié.',
  'disclosure.workingDataset':
    'Jeu de données de travail. La structure canonique du programme n’est pas encore approuvée.',
  'disclosure.notMedicalAdvice':
    'Ceci relève de l’éducation cosmétique, non du diagnostic ni du traitement médical.',
  'disclosure.authoredScaffold':
    'Support pédagogique rédigé pour ce prototype. Il enseigne un raisonnement et n’énonce aucune affirmation scientifique.',

  'safety.escalation.R2':
    'Cela semble être quelque chose à faire vérifier plutôt qu’à traverser en apprenant. Envisagez de consulter un professionnel qualifié, et suspendez tout nouveau produit pour l’instant.',
  'safety.escalation.R3':
    'Ce que vous décrivez devrait être examiné par un professionnel qualifié. Les suggestions de produits sont désactivées ici.',
  'safety.escalation.R4':
    'Veuillez demander immédiatement de l’aide aux services d’urgence ou médicaux locaux. Cette leçon s’arrête ici.',

  'lesson.phase.lesson': 'Micro-leçon',
  'lesson.phase.ask': 'Question',
  'lesson.phase.think': 'Un instant',
  'lesson.phase.hint': 'Indice',
  'lesson.phase.try': 'Votre réponse',
  'lesson.phase.feedback': 'Retour',
  'lesson.phase.reflect': 'Réflexion',
  'lesson.phase.master': 'Preuves de maîtrise',
  'lesson.phase.complete': 'Terminé',

  'lesson.think.prompt':
    'Avant de répondre — laquelle quelqu’un d’autre pourrait-il vérifier à votre place ?',
  'lesson.think.continue': 'J’ai une idée',
  'lesson.hint.request': 'J’ai besoin d’un indice',
  'lesson.hint.noneLeft': 'Plus d’indices ; l’explication ci-dessous est la dernière étape.',
  'lesson.reflect.placeholder': 'Écrivez une phrase avec vos propres mots…',
  'lesson.reflect.submit': 'Enregistrer ma réflexion',
  'lesson.next': 'Suivant',
  'lesson.restart': 'Recommencer',
  'lesson.continueToTransfer': 'Essayer une nouvelle situation',
  'lesson.finish': 'Terminer cette leçon',
  'lesson.finished': 'Leçon terminée. Vos preuves sont conservées dans Quêtes et maîtrise.',

  'mastery.title': 'Preuves de maîtrise',
  'mastery.accuracy': 'Exactitude',
  'mastery.independence': 'Autonomie',
  'mastery.transfer': 'Transfert',
  'mastery.retention': 'Rétention',
  'mastery.notYet': 'Pas encore démontré',
  'mastery.satisfied': 'Démontré',
  'mastery.explainer':
    'La maîtrise demande les quatre types de preuves. Une bonne réponse n’est pas la maîtrise.',
  'mastery.state': 'État de l’apprenant',

  'governance.title': 'Gouvernance du contenu',
  'governance.openItems': 'Points de gouvernance ouverts',
  'governance.strandTitle': 'Taxonomie des axes',
  'governance.integrityTitle': 'Intégrité référentielle',
  'governance.localeTitle': 'Couverture linguistique',
  'governance.noCanonical': 'Aucune taxonomie canonique n’a été approuvée.',
  'governance.statusCounts': 'Statut des fiches de connaissance',

  'common.source': 'Source',
  'common.status': 'Statut',
  'common.evidence': 'Preuve',
  'common.version': 'Version',
  'common.node': 'Fiche de connaissance',
  'common.skill': 'Compétence',
  'common.locale': 'Langue',
  'common.fallbackLocale': 'Affiché en {locale} — aucune traduction disponible pour l’instant.',
  'common.notAvailable': 'Non disponible',
  'common.comingSoon': 'Non développé dans cette tranche du prototype.',

  'ingredient.catalogTitle': 'Catalogue des ingrédients',
  'ingredient.catalogIntro':
    'Chaque fiche d’ingrédient de la base gouvernée, telle quelle. Aucune n’a terminé sa revue des preuves : ce sont donc des fiches à examiner, et non des affirmations sur ce que fait un ingrédient.',
  'ingredient.family': 'Famille',
  'ingredient.function': 'Fonction principale',
  'ingredient.level': 'Niveau',
  'ingredient.learningGoal': 'Objectif d’apprentissage',
  'ingredient.reference': 'Référence',
  'ingredient.noReference': 'Aucune référence enregistrée',
  'ingredient.questTitle': 'Quêtes du Jardin des ingrédients',
  'ingredient.questIntro':
    'Les trois quêtes gouvernées de ce monde, reliées à leur véritable carte de fiches. Chacune demande d’énoncer ce que fait un ingrédient, ce qui est une affirmation scientifique : chacune reste donc fermée tant que ses fiches n’ont pas passé la revue des preuves.',
  'ingredient.winCondition': 'Condition de réussite',
  'ingredient.coreNode': 'Fiche centrale',
  'ingredient.blockedBy': 'Bloquée par',
  'ingredient.lessonTitle': 'Ce que vous pouvez apprendre ici aujourd’hui',
  'ingredient.lessonIntro':
    'Savoir lire une allégation ne dépend pas de données d’ingrédients non vérifiées. C’est une compétence de raisonnement : cette leçon est donc ouverte.',
  'ingredient.startLesson': 'Commencer la lecture d’allégations',
  'ingredient.backToGarden': 'Retour au jardin',
  'ingredient.openLesson': 'Ouverte',
  'ingredient.closedLesson': 'Fermée',

  'routine.lessonTitle': 'Avant de réorganiser quoi que ce soit',
  'routine.lessonIntro':
    'Ce monde ne vous dit pas quelle devrait être votre routine. Il enseigne la question qui rend votre propre routine analysable : la leçon est donc ouverte pendant que les fiches de routine sont encore en revue.',
  'routine.startLesson': 'Commencer le raisonnement sur la routine',
  'routine.backToStudio': 'Retour à l’atelier',
  'routine.catalogTitle': 'Modèles de routine gouvernés',
  'routine.catalogIntro':
    'Les dix fiches de routine telles que la base les conserve. Chacune est marquée Approuvée, mais la feuille ne comporte aucun champ où une routine pourrait citer une preuve : aucune ne peut donc être présentée comme la bonne façon de faire.',
  'routine.sequence': 'Séquence par défaut',
  'routine.proseSequence':
    'Enregistrée en texte libre, non comme une liste d’étapes ordonnée. Présentée telle quelle.',
  'routine.linkedNodes': 'Connaissances liées',
  'routine.missingNode': 'La fiche référencée n’existe pas',
  'routine.questTitle': 'Quête de l’Atelier routine',
  'routine.studioTitle': 'Ma routine — une réflexion',
  'routine.studioIntro':
    'Listez les étapes que vous faites réellement, puis dites à quoi chacune sert. Cet outil enregistre ce que vous écrivez et compte ce que vous avez su expliquer. Il n’évalue pas votre routine, ne classe pas vos étapes et ne recommande rien.',
  'routine.addStep': 'Ajouter une étape',
  'routine.stepPlaceholder': 'Une étape que vous faites vraiment…',
  'routine.purposePlaceholder': 'À quoi sert cette étape, et comment le remarqueriez-vous ?',
  'routine.toPurpose': 'Maintenant, pourquoi ?',
  'routine.finishReview': 'Voir ce que j’ai su expliquer',
  'routine.reviewHeading': 'Ce que vous avez su expliquer',
  'routine.reviewSummary': '{withPurpose} étapes sur {total} ont une raison que vous avez énoncée.',
  'routine.reviewNote':
    'Ce nombre est le vôtre, pas une note. Une étape que vous n’avez pas su expliquer n’est pas une erreur : c’est simplement une étape que vous ne pouvez pas encore comparer, défendre ou abandonner en connaissance de cause.',
  'routine.startOver': 'Tout recommencer',
  'routine.noSteps': 'Aucune étape listée pour l’instant.',
  'routine.stepLabel': 'Étape',
  'routine.purposeLabel': 'Raison',
  'routine.notStated': 'Non énoncée',

  'sun.lessonTitle': 'Ce que vous pouvez établir vous-même',
  'sun.lessonIntro':
    'Ce monde ne vous dit pas quelle protection utiliser. Le registre des preuves ne contient aucune source sur le soleil ni sur l’exposition aux ultraviolets : la seule chose honnête qu’il puisse enseigner est la frontière entre ce que vous observez et ce qui demande une preuve.',
  'sun.startLesson': 'Commencer le raisonnement sur l’exposition',
  'sun.backToObservatory': 'Retour à l’observatoire',
  'sun.logTitle': 'Mon journal d’exposition',
  'sun.logIntro':
    'Notez les moments de votre journée auxquels vous étiez réellement présent : ce que vous faisiez, à peu près quand, combien de temps, et dans quel cadre. Cet outil enregistre et compte. Il ne donne ni note, ni seuil, ni conseil.',
  'sun.activity': 'Que faisiez-vous ?',
  'sun.activityPlaceholder': 'marché à pied jusqu’au marché…',
  'sun.band': 'Vers quel moment',
  'sun.setting': 'Cadre',
  'sun.minutes': 'Minutes',
  'sun.addEntry': 'Ajouter au journal',
  'sun.review': 'Voir ce que j’ai noté',
  'sun.noEntries': 'Rien de noté pour l’instant.',
  'sun.summaryTotal': '{entries} période(s) notée(s), {minutes} minutes au total.',
  'sun.summaryNote':
    'Ce sont vos propres observations, ni une mesure ni un niveau de risque. Les moments que vous n’avez pas notés sont des trous dans le journal, pas des affirmations sur votre journée.',
  'sun.notRecorded': 'Non noté',
  'sun.startOver': 'Tout recommencer',
  'sun.evidenceTitle': 'État des preuves pour ce domaine',
  'sun.questTitle': 'Quêtes de l’Observatoire solaire',
  'sun.band.early-morning': 'Tôt le matin',
  'sun.band.midday': 'Milieu de journée',
  'sun.band.afternoon': 'Après-midi',
  'sun.band.evening': 'Soirée',
  'sun.setting.open': 'À découvert',
  'sun.setting.partial-shade': 'Ombre partielle',
  'sun.setting.shade': 'À l’ombre',
  'sun.setting.indoors-by-window': 'À l’intérieur, près d’une fenêtre',

  'label.title': 'Quatre messages, une seule boîte',
  'label.intro':
    'Lire une étiquette, c’est trier, pas juger. Ce monde vous aide à distinguer les quatre parties. Il ne vous dit jamais si une allégation est vraie ni si un produit vous convient.',
  'label.startLesson': 'Commencer la lecture d’étiquette',
  'label.backToLibrary': 'Retour à la bibliothèque',
  'label.sorterTitle': 'Triez cette étiquette',
  'label.sorterIntro':
    'Placez chaque ligne là où vous pensez qu’elle va. Rien n’est corrigé tant que vous ne le demandez pas.',
  'label.specimenWarning': 'Une étiquette d’entraînement — inventée, sans marque.',
  'label.unplaced': 'Lignes à trier',
  'label.allSorted': 'Toutes les lignes sont placées. On regarde ensemble ?',
  'label.check': 'Vérifier mon tri',
  'label.keepSorting': 'Laissez-moi en déplacer',
  'label.finish': 'Terminer',
  'label.startOver': 'Tout recommencer',
  'label.allCorrectTitle': 'Les quatre parties, bien distinguées.',
  'label.allCorrectBody':
    'Vous pouvez maintenant le faire sur n’importe quelle boîte. Sur une vraie étiquette, les parties seront plus emmêlées que sur celle-ci.',
  'label.someWrongTitle': 'Presque — {correct} sur {total} sont à leur place.',
  'label.someWrongBody':
    'Celles ci-dessous ont changé de place. Lisez-les, puis déplacez-les et vérifiez à nouveau. Se tromper d’abord, c’est ainsi que la différence devient évidente.',
  'label.whyLabel': 'En clair',
  'label.movedTo': 'Vous l’avez mise sous',
  'label.belongsIn': 'Sa place est sous',
  'label.bucket.CLAIM': 'Ce qu’elle dit d’elle-même',
  'label.bucket.INGREDIENTS': 'Ce qu’il y a dedans',
  'label.bucket.HOW_TO_USE': 'Quoi en faire',
  'label.bucket.CAUTION': 'Ce à quoi faire attention',
  'label.bucketHint.CLAIM': 'Écrit pour vous intéresser. L’entreprise a choisi de le dire.',
  'label.bucketHint.INGREDIENTS':
    'Les noms de ce qu’il y a dans le flacon. Leur impression est obligatoire.',
  'label.bucketHint.HOW_TO_USE': 'Une instruction du fabricant sur l’usage du produit.',
  'label.bucketHint.CAUTION': 'Un avertissement : arrêter, conserver, ou demander à quelqu’un.',
  'label.questTitle': 'Quête du Détective d’étiquettes',
  'label.evidenceTitle': 'État des preuves pour ce domaine',

  'tutor.title': 'Posez une question, et voyez sur quoi je m’appuie',
  'tutor.intro':
    'Ce tuteur ne génère pas de réponses. Il vous montre ce qu’il a compris, quelles fiches gouvernées il a trouvées, et exactement ce qu’il peut et ne peut pas dire — pour que vous jugiez le raisonnement plutôt que de faire confiance à la formulation.',
  'tutor.placeholder': 'Posez une question sur la beauté…',
  'tutor.ask': 'Demander',
  'tutor.tryThese': 'Essayez l’une de celles-ci',
  'tutor.understood': 'Ce que j’ai compris',
  'tutor.intent': 'Intention',
  'tutor.mode': 'Mode',
  'tutor.risk': 'Risque',
  'tutor.hintLevel': 'Niveau d’indice',
  'tutor.grounding': 'Ce que j’ai trouvé',
  'tutor.groundingEmpty':
    'Rien dans la connaissance gouvernée ne correspond. Je n’inventerai pas de fiche pour vous répondre.',
  'tutor.groundingCount': '{searched} fiches parcourues · {found} correspondances',
  'tutor.matched': 'correspond',
  'tutor.canSay': 'Ce que je peux dire',
  'tutor.contractNote':
    'Une réponse en mode {mode} comporte {total} parties. {filled} peuvent être remplies honnêtement pour l’instant.',
  'tutor.slotBlocked': 'ne peut pas être remplie',
  'tutor.uncertainty': 'Ce dont je ne suis pas sûr',
  'tutor.commerce': 'Suggestions de produits',
  'tutor.commerceBlocked': 'Supprimées. Contrôles échoués : {gates}',
  'tutor.trace': 'Trace d’exécution',
  'tutor.traceNote':
    'Les sept étapes prévues par la Constitution : contexte, ancrage, classement, contrôle du risque, réponse, vérification, apprentissage.',
  'tutor.rulesTitle': 'Règles appliquées comme contrôles stricts',
  'tutor.rulesNote':
    'Seules les règles IA à la fois approuvées et obligatoires dans la base sont appliquées. Les règles en brouillon sont consultables mais ne deviennent pas silencieusement contraignantes.',
  'tutor.evalTitle': 'Suite d’évaluation — Constitution §16',
  'tutor.evalNote':
    'Dix scénarios que la Constitution exige de réussir avant le lancement. Ils s’exécutent sur ce même moteur.',
  'tutor.evalPassed': '{passed} réussis sur {total}',

  'quest.title': 'Vingt-cinq quêtes, et ce que chacune attend',
  'quest.intro':
    'Ceci est une carte du programme, pas une barre de progression. La plupart des quêtes ne peuvent pas encore s’ouvrir, et chacune indique quelle fiche la bloque. Rien ici n’attribue de points : aucune source ne définit de montant pour la moindre récompense.',
  'quest.mapTitle': 'Carte des quêtes',
  'quest.summary':
    '{open} quêtes sur {total} peuvent s’ouvrir · {worlds} mondes · {served} déjà servies par une leçon · {missing} bloquées par une fiche inexistante',
  'quest.open': 'Ouverte',
  'quest.closed': 'Verrouillée',
  'quest.reward': 'Récompense',
  'quest.rewardNote':
    'Les intitulés de récompense sont affichés exactement comme la base les enregistre. Aucune source n’en indique le montant : rien n’est donc totalisé.',
  'quest.claimClass': 'Classe d’affirmation',
  'quest.servedBy': 'Servie par',
  'quest.blockers': 'En attente de',
  'quest.noBlockers': 'Rien ne bloque cette quête.',
  'quest.unresolvedSkill': 'Nomme une compétence qui n’existe pas',
  'quest.masteryTitle': 'Preuves de maîtrise',
  'quest.masteryIntro':
    'Douze compétences gouvernées. Les preuves ne s’obtiennent qu’en répondant, et elles se cumulent d’un monde à l’autre — une compétence exercée en lisant une étiquette est la même que celle exercée au jardin.',
  'quest.noEvidence': 'Aucune preuve pour l’instant',
  'quest.evidenceFrom': 'Preuves issues de',
  'quest.attempts': 'tentatives',
  'quest.ladderTitle': 'L’échelle à sept niveaux',
  'quest.ladderNote':
    'La Mastery Competency Matrix propose sept niveaux, de Beauty Explorer à Beauty Master. Elle porte la mention « DECISION DRAFT — NOT CANONICAL » : aucun niveau n’est donc attribué à qui que ce soit ici.',
  'quest.resetLedger': 'Effacer mes preuves',
  'quest.ledgerSummary':
    '{attempts} tentatives enregistrées · {started} compétences sur 12 ont des preuves · {mastered} maîtrisées',

  'display.theme': 'Affichage',
  'display.theme.auto': 'Auto',
  'display.theme.light': 'Clair',
  'display.theme.dark': 'Sombre',
  'display.textSize': 'Taille du texte',
  'display.textSize.normal': 'A',
  'display.textSize.large': 'A+',
  'display.textSize.larger': 'A++',
  'display.skipToContent': 'Aller au contenu principal',

  'speech.listen': 'Écouter',
  'speech.stop': 'Arrêter',
  'speech.unavailable': 'Aucune voix pour cette langue sur cet appareil',
  'speech.listenIn': 'Écouter (en {language})',

  'catalog.unreviewed':
    'Cette interface a été traduite en français mais n’a pas encore été relue par une personne francophone. La formulation peut être inexacte. Les leçons elles-mêmes ne sont pas concernées.',
  'catalog.safetyOriginal': 'Formulation d’origine, par sécurité',

  'skinquest.title': 'Quête de la peau',
  'skinquest.welcome.eyebrow': 'Quatre minutes, avec votre propre peau',
  'skinquest.welcome.headline': 'Personne n’a regardé votre peau aussi souvent que vous.',
  'skinquest.welcome.lead':
    'Ce n’est pas un test et il n’y a pas de mauvaise réponse. Vous regardez, vous répondez, et à la fin vous gardez le relevé que vous avez fait.',
  'skinquest.welcome.begin': 'Commencer à regarder',
  'skinquest.welcome.boundary':
    'Il s’agit d’observation cosmétique, pas d’un diagnostic. Si quelque chose fait mal, s’étend ou empire, cela relève d’un professionnel qualifié, pas d’une application.',
  'skinquest.progress': 'Étape {done} sur {total}',
  'skinquest.level.L1': 'Niveau 1 · Ce que vous voyez',
  'skinquest.level.L2': 'Niveau 2 · Ce qui change',
  'skinquest.level.L3': 'Niveau 3 · Ce que vous faites déjà',
  'skinquest.back': 'Retour',
  'skinquest.continue': 'Continuer',
  'skinquest.thatsMe': 'C’est moi',
  'skinquest.L1.S1.prompt': 'Une heure après le nettoyage, sans rien appliquer — comment se sent votre visage ?',
  'skinquest.L1.S1.help': 'Choisissez le plus proche. Vous pourrez changer plus tard.',
  'skinquest.L1.S1.tight': 'Tiraillé',
  'skinquest.L1.S1.comfortable': 'Confortable',
  'skinquest.L1.S1.shiny': 'Brillant',
  'skinquest.L1.S1.mixed': 'Différent selon les zones',
  'skinquest.L1.S2.prompt': 'Que regardez-vous aujourd’hui ?',
  'skinquest.L1.S2.help': 'Commencez là où vous êtes vraiment curieux.',
  'skinquest.L1.S2.face': 'Mon visage',
  'skinquest.L1.S2.body': 'Mon corps',
  'skinquest.L1.S2.hair': 'Mon cuir chevelu et mes cheveux',
  'skinquest.L2.S1.prompt': 'Quand vous essayez quelque chose de nouveau, votre peau réagit-elle ?',
  'skinquest.L2.S1.help': 'Réagir veut dire tout ce que vous avez remarqué ensuite, pas seulement des picotements.',
  'skinquest.L2.S1.never': 'Pas que j’aie remarqué',
  'skinquest.L2.S1.sometimes': 'Parfois',
  'skinquest.L2.S1.often': 'Souvent',
  'skinquest.L2.S1.unsure': 'Je n’y ai jamais fait attention',
  'skinquest.L2.S2.prompt': 'Quand le remarquez-vous le plus ?',
  'skinquest.L2.S2.help': 'Pensez à une journée ordinaire, pas à la pire.',
  'skinquest.L2.S2.morning': 'Le matin',
  'skinquest.L2.S2.evening': 'En fin de journée',
  'skinquest.L2.S2.both': 'Les deux',
  'skinquest.L2.S2.varies': 'Cela change avec le temps qu’il fait',
  'skinquest.L3.S1.prompt': 'À quelle fréquence utilisez-vous une protection solaire ?',
  'skinquest.L3.S1.help': 'Répondez pour ce que vous faites vraiment, pas ce que vous comptez faire.',
  'skinquest.L3.S1.daily': 'Tous les jours',
  'skinquest.L3.S1.sunny': 'Les jours ensoleillés',
  'skinquest.L3.S1.rarely': 'Rarement',
  'skinquest.L3.S1.never': 'Jamais',
  'skinquest.concerns.prompt': 'Lesquelles remarquez-vous en ce moment ?',
  'skinquest.concerns.help':
    'Choisissez-en autant que vous voulez, ou aucune. C’est votre liste, pas un verdict.',
  'skinquest.concerns.none': 'Aucune pour l’instant',
  'skinquest.record.eyebrow': 'Votre relevé',
  'skinquest.record.headline': 'Voici ce que vous avez observé.',
  'skinquest.record.lead':
    'Ce sont vos propres réponses, notées. Rien ici n’a été interprété, noté ni diagnostiqué.',
  'skinquest.record.answers': 'Vos réponses',
  'skinquest.record.picked': 'Ce que vous remarquez',
  'skinquest.record.nothingPicked': 'Vous n’avez rien choisi à surveiller — c’est une réponse valable.',
  'skinquest.record.learnNext': 'Ce que ce monde peut vous apprendre à ce sujet',
  'skinquest.record.pendingReview':
    'Les sujets ci-dessus proviennent de la base de connaissances et sont encore en révision : ils sont donc nommés comme sujets d’apprentissage, non énoncés comme des faits.',
  'skinquest.record.routine': 'La seule séquence approuvée',
  'skinquest.record.routineNote':
    'De toute la base de connaissances, les séquences de routine sont les enregistrements qui ont été approuvés. Voici cette séquence, inchangée.',
  'skinquest.record.escalation':
    'Au moins un des éléments choisis est signalé dans la source comme relevant d’un professionnel qualifié plutôt que d’un apprentissage en autonomie. Accordez-lui ce poids.',
  'skinquest.record.restart': 'Recommencer',
  'skinquest.record.explore': 'Aller plus loin dans les leçons',
};


/**
 * Lao catalog. Lao is LOC-003 in Master DB 15_LOCALIZATION, marked "Laos launch language",
 * and AI Tutor Constitution §13.1 names it the first localization target. It is the single
 * most important locale in the registry and had no catalog at all until now.
 *
 * ⚠ THIS CATALOG HAS NOT BEEN CHECKED BY A LAO SPEAKER. It is registered as
 * `UNREVIEWED_DRAFT` in CATALOG_REVIEW below, the app says so on screen while it is selected,
 * and the safety wording is shown with its English original underneath — see `safetyWording`.
 * Replacing this with reviewed text is a market task, not an engineering one (SR-014).
 */
const MESSAGES_LO: Partial<Record<MessageKey, string>> = {
  'app.title': 'ໂລກແຫ່ງການຮຽນຮູ້ຄວາມງາມ',
  'app.northStar': 'ຮຽນຮູ້ຄວາມງາມ. ຮູ້ຈັກຕົນເອງ. ເລືອກໃຫ້ດີຂຶ້ນ.',

  'nav.mySkin': 'ຜິວຂອງຂ້ອຍ',
  'nav.ingredientGarden': 'ສວນສ່ວນປະກອບ',
  'nav.routineStudio': 'ສະຕູດິໂອກິດຈະວັດ',
  'nav.sunProtection': 'ການປ້ອງກັນແສງແດດ',
  'nav.labelDetective': 'ນັກສືບສະຫຼາກ',
  'nav.aiTutor': 'ຄູສອນ AI',
  'nav.quests': 'ພາລະກິດ ແລະ ຄວາມຊຳນານ',
  'nav.governance': 'ການກຳກັບດູແລເນື້ອຫາ',

  'disclosure.pendingVerification':
    'ບັນທຶກຄວາມຮູ້ນີ້ຍັງບໍ່ທັນຜ່ານການກວດສອບຫຼັກຖານ. ສະແດງໄວ້ເພື່ອການຮຽນຮູ້ ບໍ່ແມ່ນເປັນຂໍ້ເທັດຈິງທີ່ຢັ້ງຢືນແລ້ວ.',
  'disclosure.workingDataset':
    'ຊຸດຂໍ້ມູນທີ່ກຳລັງໃຊ້ງານ. ໂຄງສ້າງຫຼັກສູດມາດຕະຖານຍັງບໍ່ທັນໄດ້ຮັບການອະນຸມັດ.',
  'disclosure.notMedicalAdvice':
    'ນີ້ແມ່ນການສຶກສາດ້ານເຄື່ອງສຳອາງ ບໍ່ແມ່ນການວິນິດໄສ ຫຼື ການປິ່ນປົວທາງການແພດ.',
  'disclosure.authoredScaffold':
    'ໂຄງຮ່າງການຮຽນທີ່ຂຽນຂຶ້ນສຳລັບຕົ້ນແບບນີ້. ມັນສອນວິທີຄິດ ແລະ ບໍ່ໄດ້ກ່າວອ້າງທາງວິທະຍາສາດໃດໆ.',

  'safety.escalation.R2':
    'ສິ່ງນີ້ຟັງຄືວ່າຄວນຢຸດ ແລະ ກວດເບິ່ງ ຫຼາຍກວ່າຈະຮຽນຕໍ່ໄປ. ຂໍແນະນຳໃຫ້ປຶກສາຜູ້ຊ່ຽວຊານທີ່ມີຄຸນວຸດທິ ແລະ ຢຸດໃຊ້ຜະລິດຕະພັນໃໝ່ໄວ້ກ່ອນ.',
  'safety.escalation.R3':
    'ສິ່ງທີ່ທ່ານອະທິບາຍຄວນໄດ້ຮັບການກວດຈາກຜູ້ຊ່ຽວຊານທີ່ມີຄຸນວຸດທິ. ການແນະນຳຜະລິດຕະພັນຖືກປິດໄວ້ຢູ່ນີ້.',
  'safety.escalation.R4':
    'ກະລຸນາຂໍຄວາມຊ່ວຍເຫຼືອດ່ວນຈາກໜ່ວຍງານສຸກເສີນ ຫຼື ການແພດໃນທ້ອງຖິ່ນທັນທີ. ບົດຮຽນນີ້ຈະຢຸດຢູ່ນີ້.',

  'lesson.phase.lesson': 'ບົດຮຽນຫຍໍ້',
  'lesson.phase.ask': 'ຄຳຖາມ',
  'lesson.phase.think': 'ຄິດເບິ່ງກ່ອນ',
  'lesson.phase.hint': 'ຄຳໃບ້',
  'lesson.phase.try': 'ຄຳຕອບຂອງທ່ານ',
  'lesson.phase.feedback': 'ຄຳຕິຊົມ',
  'lesson.phase.reflect': 'ທົບທວນ',
  'lesson.phase.master': 'ຫຼັກຖານຄວາມຊຳນານ',
  'lesson.phase.complete': 'ສຳເລັດ',

  'lesson.think.prompt': 'ກ່ອນຈະຕອບ — ຂໍ້ໃດທີ່ຄົນອື່ນສາມາດກວດສອບແທນທ່ານໄດ້?',
  'lesson.think.continue': 'ຂ້ອຍພໍເດົາໄດ້ແລ້ວ',
  'lesson.hint.request': 'ຂ້ອຍຕ້ອງການຄຳໃບ້',
  'lesson.hint.noneLeft': 'ບໍ່ມີຄຳໃບ້ຕໍ່ໄປແລ້ວ; ຄຳອະທິບາຍຢູ່ລຸ່ມນີ້ແມ່ນຂັ້ນຕອນສຸດທ້າຍ.',
  'lesson.reflect.placeholder': 'ຂຽນໜຶ່ງປະໂຫຍກດ້ວຍຄຳເວົ້າຂອງທ່ານເອງ…',
  'lesson.reflect.submit': 'ບັນທຶກການທົບທວນຂອງຂ້ອຍ',
  'lesson.next': 'ຕໍ່ໄປ',
  'lesson.restart': 'ເລີ່ມໃໝ່',
  'lesson.continueToTransfer': 'ລອງສະຖານະການໃໝ່',
  'lesson.finish': 'ຈົບບົດຮຽນນີ້',
  'lesson.finished': 'ຈົບບົດຮຽນແລ້ວ. ຫຼັກຖານຂອງທ່ານຖືກເກັບໄວ້ໃນ ພາລະກິດ ແລະ ຄວາມຊຳນານ.',

  'mastery.title': 'ຫຼັກຖານຄວາມຊຳນານ',
  'mastery.accuracy': 'ຄວາມຖືກຕ້ອງ',
  'mastery.independence': 'ຄວາມເປັນເອກະລາດ',
  'mastery.transfer': 'ການນຳໄປໃຊ້',
  'mastery.retention': 'ການຈື່ຈຳ',
  'mastery.notYet': 'ຍັງບໍ່ມີຫຼັກຖານ',
  'mastery.satisfied': 'ມີຫຼັກຖານແລ້ວ',
  'mastery.explainer': 'ຄວາມຊຳນານຕ້ອງການຫຼັກຖານທັງສີ່ປະເພດ. ຕອບຖືກເທື່ອດຽວບໍ່ແມ່ນຄວາມຊຳນານ.',
  'mastery.state': 'ສະຖານະຜູ້ຮຽນ',

  'governance.title': 'ການກຳກັບດູແລເນື້ອຫາ',
  'governance.openItems': 'ລາຍການກຳກັບດູແລທີ່ຍັງເປີດຢູ່',
  'governance.strandTitle': 'ການຈັດໝວດສາຍວິຊາ',
  'governance.integrityTitle': 'ຄວາມສົມບູນຂອງການອ້າງອີງ',
  'governance.localeTitle': 'ຄວາມຄຸ້ມຄອງຂອງພາສາ',
  'governance.noCanonical': 'ຍັງບໍ່ມີການຈັດໝວດມາດຕະຖານໃດໄດ້ຮັບການອະນຸມັດ.',
  'governance.statusCounts': 'ສະຖານະຂອງບັນທຶກຄວາມຮູ້',

  'common.source': 'ແຫຼ່ງທີ່ມາ',
  'common.status': 'ສະຖານະ',
  'common.evidence': 'ຫຼັກຖານ',
  'common.version': 'ເວີຊັນ',
  'common.node': 'ບັນທຶກຄວາມຮູ້',
  'common.skill': 'ທັກສະ',
  'common.locale': 'ພາສາ',
  'common.fallbackLocale': 'ສະແດງເປັນ {locale} — ຍັງບໍ່ມີຄຳແປ.',
  'common.notAvailable': 'ບໍ່ມີ',
  'common.comingSoon': 'ຍັງບໍ່ໄດ້ສ້າງໃນຕົ້ນແບບສ່ວນນີ້.',

  'ingredient.catalogTitle': 'ລາຍການສ່ວນປະກອບ',
  'ingredient.catalogIntro':
    'ທຸກບັນທຶກສ່ວນປະກອບໃນຖານຂໍ້ມູນທີ່ກຳກັບດູແລ ສະແດງຕາມທີ່ມັນເປັນຢູ່. ຍັງບໍ່ມີອັນໃດຜ່ານການກວດສອບຫຼັກຖານ ສະນັ້ນນີ້ແມ່ນບັນທຶກໃຫ້ກວດເບິ່ງ — ບໍ່ແມ່ນຄຳກ່າວວ່າສ່ວນປະກອບໃດເຮັດຫຍັງ.',
  'ingredient.family': 'ກຸ່ມ',
  'ingredient.function': 'ໜ້າທີ່ຫຼັກ',
  'ingredient.level': 'ລະດັບ',
  'ingredient.learningGoal': 'ເປົ້າໝາຍການຮຽນ',
  'ingredient.reference': 'ເອກະສານອ້າງອີງ',
  'ingredient.noReference': 'ບໍ່ມີການບັນທຶກເອກະສານອ້າງອີງ',
  'ingredient.questTitle': 'ພາລະກິດຂອງສວນສ່ວນປະກອບ',
  'ingredient.questIntro':
    'ສາມພາລະກິດທີ່ກຳກັບດູແລຂອງໂລກນີ້ ເຊື່ອມກັບແຜນທີ່ບັນທຶກຕົວຈິງຂອງມັນ. ແຕ່ລະອັນຂໍໃຫ້ຜູ້ຮຽນບອກວ່າສ່ວນປະກອບເຮັດຫຍັງ ຊຶ່ງເປັນການກ່າວອ້າງທາງວິທະຍາສາດ ສະນັ້ນແຕ່ລະອັນຍັງປິດຢູ່ຈົນກວ່າບັນທຶກຈະຜ່ານການກວດສອບ.',
  'ingredient.winCondition': 'ເງື່ອນໄຂການສຳເລັດ',
  'ingredient.coreNode': 'ບັນທຶກຫຼັກ',
  'ingredient.blockedBy': 'ຖືກກີດຂວາງໂດຍ',
  'ingredient.lessonTitle': 'ສິ່ງທີ່ທ່ານຮຽນໄດ້ຢູ່ນີ້ໃນມື້ນີ້',
  'ingredient.lessonIntro':
    'ການອ່ານສ່ວນປະກອບໃຫ້ເປັນ ບໍ່ໄດ້ຂຶ້ນກັບຂໍ້ມູນສ່ວນປະກອບທີ່ຍັງບໍ່ໄດ້ຢັ້ງຢືນ. ການອ່ານຄຳກ່າວອ້າງແມ່ນທັກສະການຄິດ ສະນັ້ນບົດຮຽນນີ້ຈຶ່ງເປີດຢູ່.',
  'ingredient.startLesson': 'ເລີ່ມການອ່ານສ່ວນປະກອບ',
  'ingredient.backToGarden': 'ກັບໄປສວນ',
  'ingredient.openLesson': 'ເປີດ',
  'ingredient.closedLesson': 'ປິດ',

  'routine.lessonTitle': 'ກ່ອນທີ່ທ່ານຈະຈັດລຳດັບໃໝ່',
  'routine.lessonIntro':
    'ໂລກນີ້ບໍ່ໄດ້ບອກທ່ານວ່າກິດຈະວັດຂອງທ່ານຄວນເປັນແນວໃດ. ມັນສອນຄຳຖາມທີ່ເຮັດໃຫ້ກິດຈະວັດຂອງທ່ານເອງຕອບໄດ້ ສະນັ້ນບົດຮຽນຈຶ່ງເປີດຢູ່ໃນຂະນະທີ່ບັນທຶກກິດຈະວັດຍັງຢູ່ໃນການກວດສອບ.',
  'routine.startLesson': 'ເລີ່ມການຄິດເລື່ອງກິດຈະວັດ',
  'routine.backToStudio': 'ກັບໄປສະຕູດິໂອ',
  'routine.catalogTitle': 'ຮູບແບບກິດຈະວັດທີ່ກຳກັບດູແລ',
  'routine.catalogIntro':
    'ສິບບັນທຶກກິດຈະວັດຕາມທີ່ຖານຂໍ້ມູນເກັບໄວ້. ແຕ່ລະອັນຖືກໝາຍວ່າອະນຸມັດແລ້ວ ແຕ່ຕາຕະລາງບໍ່ມີຊ່ອງໃດທີ່ກິດຈະວັດຈະອ້າງຫຼັກຖານໄດ້ ສະນັ້ນຈຶ່ງບໍ່ມີອັນໃດຖືກນຳສະເໜີເປັນວິທີທີ່ຖືກຕ້ອງໄດ້.',
  'routine.sequence': 'ລຳດັບຕັ້ງຕົ້ນ',
  'routine.proseSequence': 'ບັນທຶກເປັນຂໍ້ຄວາມ ບໍ່ແມ່ນລາຍການຂັ້ນຕອນທີ່ຈັດລຳດັບ. ສະແດງຕາມທີ່ຂຽນໄວ້.',
  'routine.linkedNodes': 'ຄວາມຮູ້ທີ່ເຊື່ອມໂຍງ',
  'routine.missingNode': 'ບັນທຶກທີ່ອ້າງເຖິງບໍ່ມີຢູ່',
  'routine.questTitle': 'ພາລະກິດຂອງສະຕູດິໂອກິດຈະວັດ',
  'routine.studioTitle': 'ກິດຈະວັດຂອງຂ້ອຍ — ການທົບທວນ',
  'routine.studioIntro':
    'ຂຽນລາຍການຂັ້ນຕອນທີ່ທ່ານເຮັດຈິງ ແລ້ວບອກວ່າແຕ່ລະຂັ້ນຕອນມີໄວ້ເພື່ອຫຍັງ. ເຄື່ອງມືນີ້ບັນທຶກສິ່ງທີ່ທ່ານຂຽນ ແລະ ນັບສິ່ງທີ່ທ່ານອະທິບາຍໄດ້. ມັນບໍ່ປະເມີນກິດຈະວັດຂອງທ່ານ ບໍ່ຈັດອັນດັບຂັ້ນຕອນ ແລະ ບໍ່ແນະນຳຫຍັງ.',
  'routine.addStep': 'ເພີ່ມຂັ້ນຕອນ',
  'routine.stepPlaceholder': 'ຂັ້ນຕອນທີ່ທ່ານເຮັດຈິງ…',
  'routine.purposePlaceholder': 'ຂັ້ນຕອນນີ້ມີໄວ້ເພື່ອຫຍັງ ແລະ ທ່ານຈະສັງເກດເຫັນແນວໃດ?',
  'routine.toPurpose': 'ຕອນນີ້ ຖາມວ່າເປັນຫຍັງ',
  'routine.finishReview': 'ເບິ່ງສິ່ງທີ່ຂ້ອຍອະທິບາຍໄດ້',
  'routine.reviewHeading': 'ສິ່ງທີ່ທ່ານອະທິບາຍໄດ້',
  'routine.reviewSummary': '{withPurpose} ໃນ {total} ຂັ້ນຕອນ ມີຈຸດປະສົງທີ່ທ່ານບອກໄວ້.',
  'routine.reviewNote':
    'ຕົວເລກນັ້ນເປັນຂອງທ່ານ ບໍ່ແມ່ນຄະແນນ. ຂັ້ນຕອນທີ່ທ່ານອະທິບາຍບໍ່ໄດ້ ບໍ່ແມ່ນຜິດ — ພຽງແຕ່ເປັນຂັ້ນຕອນທີ່ທ່ານຍັງບໍ່ສາມາດປຽບທຽບ ປົກປ້ອງ ຫຼື ຕັດອອກຢ່າງຕັ້ງໃຈໄດ້.',
  'routine.startOver': 'ເລີ່ມໃໝ່ທັງໝົດ',
  'routine.noSteps': 'ຍັງບໍ່ມີຂັ້ນຕອນໃນລາຍການ.',
  'routine.stepLabel': 'ຂັ້ນຕອນ',
  'routine.purposeLabel': 'ຈຸດປະສົງ',
  'routine.notStated': 'ບໍ່ໄດ້ບອກໄວ້',

  'sun.lessonTitle': 'ສິ່ງທີ່ທ່ານຢືນຢັນເອງໄດ້',
  'sun.lessonIntro':
    'ໂລກນີ້ບໍ່ໄດ້ບອກທ່ານວ່າຄວນໃຊ້ການປ້ອງກັນແບບໃດ. ທະບຽນຫຼັກຖານບໍ່ມີແຫຼ່ງຂໍ້ມູນໃດກ່ຽວກັບແສງແດດ ຫຼື ລັງສີອຸນຕຣາໄວໂອເລັດເລີຍ ສະນັ້ນສິ່ງດຽວທີ່ຊື່ສັດທີ່ມັນສອນໄດ້ ຄືເສັ້ນແບ່ງລະຫວ່າງສິ່ງທີ່ທ່ານສັງເກດເຫັນ ກັບສິ່ງທີ່ຕ້ອງການຫຼັກຖານ.',
  'sun.startLesson': 'ເລີ່ມການຄິດເລື່ອງການສຳຜັດແດດ',
  'sun.backToObservatory': 'ກັບໄປຫໍສັງເກດການ',
  'sun.logTitle': 'ບັນທຶກການສຳຜັດແດດຂອງຂ້ອຍ',
  'sun.logIntro':
    'ບັນທຶກຊ່ວງເວລາຂອງມື້ທີ່ທ່ານຢູ່ຕົວຈິງ: ທ່ານເຮັດຫຍັງ ປະມານເວລາໃດ ດົນເທົ່າໃດ ແລະ ຢູ່ສະພາບແວດລ້ອມແບບໃດ. ເຄື່ອງມືນີ້ບັນທຶກ ແລະ ນັບ. ມັນບໍ່ໃຫ້ຄະແນນ ບໍ່ໃຫ້ເກນ ແລະ ບໍ່ໃຫ້ຄຳແນະນຳ.',
  'sun.activity': 'ທ່ານເຮັດຫຍັງຢູ່?',
  'sun.activityPlaceholder': 'ຍ່າງໄປຕະຫຼາດ…',
  'sun.band': 'ປະມານເວລາໃດ',
  'sun.setting': 'ສະພາບແວດລ້ອມ',
  'sun.minutes': 'ນາທີ',
  'sun.addEntry': 'ເພີ່ມເຂົ້າບັນທຶກ',
  'sun.review': 'ເບິ່ງສິ່ງທີ່ຂ້ອຍບັນທຶກໄວ້',
  'sun.noEntries': 'ຍັງບໍ່ໄດ້ບັນທຶກຫຍັງ.',
  'sun.summaryTotal': 'ບັນທຶກໄວ້ {entries} ຊ່ວງ, ລວມ {minutes} ນາທີ.',
  'sun.summaryNote':
    'ນີ້ແມ່ນການສັງເກດຂອງທ່ານເອງ ບໍ່ແມ່ນການວັດແທກ ແລະ ບໍ່ແມ່ນລະດັບຄວາມສ່ຽງ. ຊ່ວງເວລາທີ່ທ່ານບໍ່ໄດ້ບັນທຶກ ແມ່ນຊ່ອງວ່າງໃນບັນທຶກ ບໍ່ແມ່ນຄຳກ່າວກ່ຽວກັບມື້ຂອງທ່ານ.',
  'sun.notRecorded': 'ບໍ່ໄດ້ບັນທຶກ',
  'sun.startOver': 'ເລີ່ມໃໝ່ທັງໝົດ',
  'sun.evidenceTitle': 'ສະຖານະຫຼັກຖານຂອງຂົງເຂດນີ້',
  'sun.questTitle': 'ພາລະກິດຂອງຫໍສັງເກດການແສງແດດ',
  'sun.band.early-morning': 'ເຊົ້າຕຼູ່',
  'sun.band.midday': 'ທ່ຽງ',
  'sun.band.afternoon': 'ຕອນບ່າຍ',
  'sun.band.evening': 'ຕອນແລງ',
  'sun.setting.open': 'ກາງແຈ້ງ ບໍ່ມີບັງ',
  'sun.setting.partial-shade': 'ຮົ່ມບາງສ່ວນ',
  'sun.setting.shade': 'ຢູ່ຮົ່ມ',
  'sun.setting.indoors-by-window': 'ຢູ່ໃນເຮືອນ ໃກ້ປ່ອງຢ້ຽມ',

  'label.title': 'ສີ່ຂໍ້ຄວາມ ໃນກັບດຽວ',
  'label.intro':
    'ການອ່ານສະຫຼາກແມ່ນການແຍກປະເພດ ບໍ່ແມ່ນການຕັດສິນ. ໂລກນີ້ຊ່ວຍໃຫ້ທ່ານແຍກສີ່ສ່ວນອອກຈາກກັນ. ມັນບໍ່ເຄີຍບອກວ່າຄຳກ່າວອ້າງເປັນຈິງ ຫຼື ຜະລິດຕະພັນເໝາະກັບທ່ານ.',
  'label.startLesson': 'ເລີ່ມການອ່ານສະຫຼາກ',
  'label.backToLibrary': 'ກັບໄປຫ້ອງສະໝຸດ',
  'label.sorterTitle': 'ແຍກສະຫຼາກນີ້',
  'label.sorterIntro': 'ວາງແຕ່ລະແຖວໄວ້ບ່ອນທີ່ທ່ານຄິດວ່າມັນຄວນຢູ່. ຈະບໍ່ມີການກວດຈົນກວ່າທ່ານຈະຂໍ.',
  'label.specimenWarning': 'ສະຫຼາກຝຶກຫັດ — ສົມມຸດຂຶ້ນ ບໍ່ມີຍີ່ຫໍ້.',
  'label.unplaced': 'ແຖວທີ່ຕ້ອງແຍກ',
  'label.allSorted': 'ທຸກແຖວຖືກວາງແລ້ວ. ເບິ່ງນຳກັນບໍ?',
  'label.check': 'ກວດການແຍກຂອງຂ້ອຍ',
  'label.keepSorting': 'ຂໍຍ້າຍອີກໜ້ອຍ',
  'label.finish': 'ຈົບ',
  'label.startOver': 'ເລີ່ມໃໝ່ທັງໝົດ',
  'label.allCorrectTitle': 'ສີ່ສ່ວນ ແຍກອອກໄດ້ໝົດ.',
  'label.allCorrectBody':
    'ຕອນນີ້ທ່ານເຮັດແບບນີ້ກັບກັບໃດກໍໄດ້ທີ່ທ່ານຈັບຂຶ້ນມາ. ໃນສະຫຼາກຈິງ ສ່ວນຕ່າງໆຈະປົນກັນຫຼາຍກວ່າອັນນີ້.',
  'label.someWrongTitle': 'ເກືອບແລ້ວ — {correct} ໃນ {total} ຢູ່ຖືກບ່ອນ.',
  'label.someWrongBody':
    'ອັນຢູ່ລຸ່ມນີ້ໄປຢູ່ຜິດບ່ອນ. ລອງອ່ານເບິ່ງ ແລ້ວຍ້າຍ ແລະ ກວດອີກເທື່ອ. ການຜິດກ່ອນ ຄືວິທີທີ່ຄວາມແຕກຕ່າງຈະຊັດເຈນຂຶ້ນ.',
  'label.whyLabel': 'ເວົ້າງ່າຍໆ',
  'label.movedTo': 'ທ່ານວາງອັນນີ້ໄວ້ໃຕ້',
  'label.belongsIn': 'ມັນຄວນຢູ່ໃຕ້',
  'label.bucket.CLAIM': 'ສິ່ງທີ່ມັນເວົ້າກ່ຽວກັບຕົນເອງ',
  'label.bucket.INGREDIENTS': 'ສິ່ງທີ່ຢູ່ຂ້າງໃນ',
  'label.bucket.HOW_TO_USE': 'ວິທີໃຊ້ມັນ',
  'label.bucket.CAUTION': 'ສິ່ງທີ່ຕ້ອງລະວັງ',
  'label.bucketHint.CLAIM': 'ຂຽນຂຶ້ນເພື່ອດຶງດູດທ່ານ. ບໍລິສັດເລືອກທີ່ຈະເວົ້າແບບນັ້ນ.',
  'label.bucketHint.INGREDIENTS': 'ຊື່ຂອງສິ່ງທີ່ຢູ່ໃນຂວດ. ກົດໝາຍບັງຄັບໃຫ້ພິມໄວ້.',
  'label.bucketHint.HOW_TO_USE': 'ຄຳແນະນຳຈາກຜູ້ຜະລິດກ່ຽວກັບການໃຊ້.',
  'label.bucketHint.CAUTION': 'ຄຳເຕືອນເລື່ອງການຢຸດໃຊ້ ການເກັບຮັກສາ ຫຼື ການໄປປຶກສາຜູ້ໃດຜູ້ໜຶ່ງ.',
  'label.questTitle': 'ພາລະກິດຂອງນັກສືບສະຫຼາກ',
  'label.evidenceTitle': 'ສະຖານະຫຼັກຖານຂອງຂົງເຂດນີ້',

  'tutor.title': 'ຖາມມາ ແລ້ວເບິ່ງວ່າຂ້ອຍຢືນຢູ່ເທິງຫຍັງ',
  'tutor.intro':
    'ຄູສອນນີ້ບໍ່ໄດ້ສ້າງຄຳຕອບຂຶ້ນມາ. ມັນສະແດງໃຫ້ທ່ານເຫັນສິ່ງທີ່ມັນເຂົ້າໃຈ ບັນທຶກທີ່ກຳກັບດູແລອັນໃດທີ່ມັນພົບ ແລະ ສິ່ງທີ່ມັນເວົ້າໄດ້ ແລະ ເວົ້າບໍ່ໄດ້ — ເພື່ອໃຫ້ທ່ານຕັດສິນເຫດຜົນ ແທນທີ່ຈະເຊື່ອຖ້ອຍຄຳ.',
  'tutor.placeholder': 'ຖາມຫຍັງກໍໄດ້ກ່ຽວກັບຄວາມງາມ…',
  'tutor.ask': 'ຖາມ',
  'tutor.tryThese': 'ລອງອັນໃດອັນໜຶ່ງນີ້',
  'tutor.understood': 'ສິ່ງທີ່ຂ້ອຍເຂົ້າໃຈ',
  'tutor.intent': 'ເຈດຕະນາ',
  'tutor.mode': 'ໂໝດ',
  'tutor.risk': 'ຄວາມສ່ຽງ',
  'tutor.hintLevel': 'ລະດັບຄຳໃບ້',
  'tutor.grounding': 'ສິ່ງທີ່ຂ້ອຍພົບ',
  'tutor.groundingEmpty': 'ບໍ່ມີຫຍັງໃນຄວາມຮູ້ທີ່ກຳກັບດູແລທີ່ກົງກັນ. ຂ້ອຍຈະບໍ່ແຕ່ງບັນທຶກຂຶ້ນມາເພື່ອຕອບ.',
  'tutor.groundingCount': 'ຄົ້ນຫາ {searched} ບັນທຶກ · ກົງກັນ {found}',
  'tutor.matched': 'ກົງກັນ',
  'tutor.canSay': 'ສິ່ງທີ່ຂ້ອຍເວົ້າໄດ້',
  'tutor.contractNote': 'ຄຳຕອບແບບ {mode} ມີ {total} ສ່ວນ. {filled} ສ່ວນສາມາດຕື່ມໄດ້ຢ່າງຊື່ສັດຕອນນີ້.',
  'tutor.slotBlocked': 'ຕື່ມບໍ່ໄດ້',
  'tutor.uncertainty': 'ສິ່ງທີ່ຂ້ອຍບໍ່ແນ່ໃຈ',
  'tutor.commerce': 'ການແນະນຳຜະລິດຕະພັນ',
  'tutor.commerceBlocked': 'ຖືກລະງັບໄວ້. ດ່ານທີ່ບໍ່ຜ່ານ: {gates}',
  'tutor.trace': 'ຮ່ອງຮອຍການເຮັດວຽກ',
  'tutor.traceNote':
    'ເຈັດຂັ້ນຕອນທີ່ທຳມະນູນກຳນົດໄວ້: ບໍລິບົດ ການຍຶດຫຼັກ ການຈັດປະເພດ ດ່ານຄວາມສ່ຽງ ການຕອບ ການກວດສອບ ການຮຽນຮູ້.',
  'tutor.rulesTitle': 'ກົດທີ່ບັງຄັບໃຊ້ເປັນດ່ານເຂັ້ມ',
  'tutor.rulesNote':
    'ບັງຄັບໃຊ້ສະເພາະກົດ AI ທີ່ທັງອະນຸມັດແລ້ວ ແລະ ບັງຄັບໃນຖານຂໍ້ມູນ. ກົດທີ່ຍັງເປັນຮ່າງ ອ່ານໄດ້ ແຕ່ບໍ່ກາຍເປັນການບັງຄັບໃຊ້ຢ່າງງຽບໆ.',
  'tutor.evalTitle': 'ຊຸດປະເມີນ ທຳມະນູນ §16',
  'tutor.evalNote': 'ສິບສະຖານະການທີ່ທຳມະນູນຮຽກຮ້ອງໃຫ້ຜ່ານກ່ອນເປີດໃຊ້. ພວກມັນແລ່ນເທິງລະບົບດຽວກັນນີ້.',
  'tutor.evalPassed': 'ຜ່ານ {passed} ໃນ {total}',

  'quest.title': 'ຊາວຫ້າພາລະກິດ ແລະ ສິ່ງທີ່ແຕ່ລະອັນລໍຖ້າ',
  'quest.intro':
    'ນີ້ແມ່ນແຜນທີ່ຂອງຫຼັກສູດ ບໍ່ແມ່ນແຖບຄວາມຄືບໜ້າ. ພາລະກິດສ່ວນຫຼາຍຍັງເປີດບໍ່ໄດ້ ແລະ ແຕ່ລະອັນບອກວ່າບັນທຶກໃດກີດຂວາງມັນຢູ່. ຢູ່ນີ້ບໍ່ມີການໃຫ້ຄະແນນ: ບໍ່ມີແຫຼ່ງຂໍ້ມູນໃດກຳນົດຈຳນວນລາງວັນໄວ້.',
  'quest.mapTitle': 'ແຜນທີ່ພາລະກິດ',
  'quest.summary':
    '{open} ໃນ {total} ພາລະກິດເປີດໄດ້ · {worlds} ໂລກ · {served} ມີບົດຮຽນຮອງຮັບແລ້ວ · {missing} ຖືກກີດຂວາງໂດຍບັນທຶກທີ່ບໍ່ມີຢູ່',
  'quest.open': 'ເປີດ',
  'quest.closed': 'ລັອກຢູ່',
  'quest.reward': 'ລາງວັນ',
  'quest.rewardNote':
    'ປ້າຍລາງວັນສະແດງຕາມທີ່ຖານຂໍ້ມູນບັນທຶກໄວ້ທຸກປະການ. ບໍ່ມີແຫຼ່ງຂໍ້ມູນໃດລະບຸຈຳນວນ ສະນັ້ນຈຶ່ງບໍ່ມີການລວມຍອດ.',
  'quest.claimClass': 'ປະເພດຄຳກ່າວອ້າງ',
  'quest.servedBy': 'ຮອງຮັບໂດຍ',
  'quest.blockers': 'ລໍຖ້າ',
  'quest.noBlockers': 'ບໍ່ມີຫຍັງກີດຂວາງພາລະກິດນີ້.',
  'quest.unresolvedSkill': 'ອ້າງເຖິງທັກສະທີ່ບໍ່ມີຢູ່',
  'quest.masteryTitle': 'ຫຼັກຖານຄວາມຊຳນານ',
  'quest.masteryIntro':
    'ສິບສອງທັກສະທີ່ກຳກັບດູແລ. ຫຼັກຖານໄດ້ມາຈາກການຕອບເທົ່ານັ້ນ ແລະ ມັນສະສົມຂ້າມທຸກໂລກ — ທັກສະທີ່ຝຶກຕອນອ່ານສະຫຼາກ ແມ່ນທັກສະດຽວກັບທີ່ຝຶກໃນສວນ.',
  'quest.noEvidence': 'ຍັງບໍ່ມີຫຼັກຖານ',
  'quest.evidenceFrom': 'ຫຼັກຖານຈາກ',
  'quest.attempts': 'ຄັ້ງ',
  'quest.ladderTitle': 'ຂັ້ນໄດເຈັດລະດັບ',
  'quest.ladderNote':
    'Mastery Competency Matrix ສະເໜີເຈັດລະດັບ ຈາກ Beauty Explorer ຫາ Beauty Master. ມັນຖືກໝາຍວ່າ "DECISION DRAFT — NOT CANONICAL" ສະນັ້ນຢູ່ນີ້ຈຶ່ງບໍ່ມີການກຳນົດລະດັບໃຫ້ຜູ້ໃດ.',
  'quest.resetLedger': 'ລຶບຫຼັກຖານຂອງຂ້ອຍ',
  'quest.ledgerSummary': 'ບັນທຶກ {attempts} ຄັ້ງ · {started} ໃນ 12 ທັກສະມີຫຼັກຖານ · ຊຳນານ {mastered}',

  'display.theme': 'ໜ້າຈໍ',
  'display.theme.auto': 'ອັດຕະໂນມັດ',
  'display.theme.light': 'ສະຫວ່າງ',
  'display.theme.dark': 'ມືດ',
  'display.textSize': 'ຂະໜາດຕົວອັກສອນ',
  'display.textSize.normal': 'ກ',
  'display.textSize.large': 'ກ+',
  'display.textSize.larger': 'ກ++',
  'display.skipToContent': 'ຂ້າມໄປຫາເນື້ອຫາຫຼັກ',

  'speech.listen': 'ຟັງ',
  'speech.stop': 'ຢຸດ',
  'speech.unavailable': 'ບໍ່ມີສຽງສຳລັບພາສານີ້ໃນອຸປະກອນນີ້',
  'speech.listenIn': 'ຟັງເປັນ{language}',

  'catalog.unreviewed':
    'ໜ້າຈໍນີ້ຖືກແປເປັນພາສາລາວ ແຕ່ຍັງບໍ່ທັນໄດ້ຮັບການກວດຈາກຜູ້ເວົ້າພາສາລາວ. ຖ້ອຍຄຳອາດຜິດ. ບົດຮຽນເອງບໍ່ໄດ້ຮັບຜົນກະທົບ.',
  'catalog.safetyOriginal': 'ຖ້ອຍຄຳຕົ້ນສະບັບ ເພື່ອຄວາມປອດໄພ',

  'skinquest.title': 'ການເດີນທາງຂອງຜິວ',
  'skinquest.welcome.eyebrow': 'ສີ່ນາທີ ກັບຜິວຂອງທ່ານເອງ',
  'skinquest.welcome.headline': 'ບໍ່ມີໃຜເບິ່ງຜິວຂອງທ່ານ ຫຼາຍເທົ່າກັບທ່ານເອງ.',
  'skinquest.welcome.lead':
    'ນີ້ບໍ່ແມ່ນການສອບເສັງ ແລະ ບໍ່ມີຄຳຕອບທີ່ຜິດ. ທ່ານເບິ່ງ, ທ່ານຕອບ, ແລະ ໃນທີ່ສຸດ ທ່ານຈະໄດ້ບັນທຶກທີ່ທ່ານສ້າງເອງ.',
  'skinquest.welcome.begin': 'ເລີ່ມເບິ່ງຜິວຂອງຂ້ອຍ',
  'skinquest.welcome.boundary':
    'ນີ້ແມ່ນການສັງເກດໃນມຸມມອງເຄື່ອງສຳອາງ ບໍ່ແມ່ນການວິນິດໄສ. ຖ້າມີອາການເຈັບ, ລາມ ຫຼື ຮ້າຍແຮງຂຶ້ນ ນັ້ນແມ່ນເລື່ອງຂອງຜູ້ຊ່ຽວຊານ ບໍ່ແມ່ນຂອງແອັບ.',
  'skinquest.progress': 'ຂັ້ນຕອນທີ {done} ຈາກ {total}',
  'skinquest.level.L1': 'ລະດັບ 1 · ສິ່ງທີ່ທ່ານເຫັນ',
  'skinquest.level.L2': 'ລະດັບ 2 · ສິ່ງທີ່ປ່ຽນແປງ',
  'skinquest.level.L3': 'ລະດັບ 3 · ສິ່ງທີ່ທ່ານເຮັດຢູ່ແລ້ວ',
  'skinquest.back': 'ກັບຄືນ',
  'skinquest.continue': 'ຕໍ່ໄປ',
  'skinquest.thatsMe': 'ແມ່ນຂ້ອຍເອງ',
  'skinquest.L1.S1.prompt': 'ຫຼັງລ້າງໜ້າໜຶ່ງຊົ່ວໂມງ ໂດຍບໍ່ທາຫຍັງເລີຍ — ໜ້າຂອງທ່ານຮູ້ສຶກແນວໃດ?',
  'skinquest.L1.S1.help': 'ເລືອກຂໍ້ທີ່ໃກ້ຄຽງທີ່ສຸດ. ທ່ານປ່ຽນໄດ້ພາຍຫຼັງ.',
  'skinquest.L1.S1.tight': 'ຕຶງ',
  'skinquest.L1.S1.comfortable': 'ສະບາຍ',
  'skinquest.L1.S1.shiny': 'ເປັນມັນ',
  'skinquest.L1.S1.mixed': 'ຕ່າງກັນຕາມບໍລິເວນ',
  'skinquest.L1.S2.prompt': 'ມື້ນີ້ທ່ານກຳລັງເບິ່ງບ່ອນໃດ?',
  'skinquest.L1.S2.help': 'ເລີ່ມຈາກບ່ອນທີ່ທ່ານຢາກຮູ້ແທ້ໆ.',
  'skinquest.L1.S2.face': 'ໜ້າຂອງຂ້ອຍ',
  'skinquest.L1.S2.body': 'ຮ່າງກາຍຂອງຂ້ອຍ',
  'skinquest.L1.S2.hair': 'ໜັງຫົວ ແລະ ເສັ້ນຜົມ',
  'skinquest.L2.S1.prompt': 'ເມື່ອທ່ານລອງຜະລິດຕະພັນໃໝ່ ຜິວຂອງທ່ານມີປະຕິກິລິຍາບໍ?',
  'skinquest.L2.S1.help': 'ປະຕິກິລິຍາໝາຍເຖິງທຸກສິ່ງທີ່ທ່ານສັງເກດເຫັນຫຼັງຈາກນັ້ນ ບໍ່ແມ່ນແຕ່ອາການແສບ.',
  'skinquest.L2.S1.never': 'ບໍ່ເຄີຍສັງເກດເຫັນ',
  'skinquest.L2.S1.sometimes': 'ບາງເທື່ອ',
  'skinquest.L2.S1.often': 'ເລື້ອຍໆ',
  'skinquest.L2.S1.unsure': 'ບໍ່ເຄີຍໃສ່ໃຈ',
  'skinquest.L2.S2.prompt': 'ທ່ານສັງເກດເຫັນຫຼາຍທີ່ສຸດຕອນໃດ?',
  'skinquest.L2.S2.help': 'ຄິດເຖິງມື້ປົກກະຕິ ບໍ່ແມ່ນມື້ທີ່ຮ້າຍແຮງທີ່ສຸດ.',
  'skinquest.L2.S2.morning': 'ຕອນເຊົ້າ',
  'skinquest.L2.S2.evening': 'ຕອນທ້າຍມື້',
  'skinquest.L2.S2.both': 'ທັງສອງ',
  'skinquest.L2.S2.varies': 'ປ່ຽນໄປຕາມອາກາດ',
  'skinquest.L3.S1.prompt': 'ທ່ານໃຊ້ການປ້ອງກັນແດດເລື້ອຍປານໃດ?',
  'skinquest.L3.S1.help': 'ຕອບຕາມສິ່ງທີ່ທ່ານເຮັດແທ້ ບໍ່ແມ່ນສິ່ງທີ່ຕັ້ງໃຈຈະເຮັດ.',
  'skinquest.L3.S1.daily': 'ທຸກມື້',
  'skinquest.L3.S1.sunny': 'ມື້ທີ່ແດດແຮງ',
  'skinquest.L3.S1.rarely': 'ບໍ່ຄ່ອຍ',
  'skinquest.L3.S1.never': 'ບໍ່ເຄີຍ',
  'skinquest.concerns.prompt': 'ຕອນນີ້ທ່ານສັງເກດເຫັນຂໍ້ໃດແດ່?',
  'skinquest.concerns.help':
    'ເລືອກໄດ້ຫຼາຍຂໍ້ ຫຼື ບໍ່ເລືອກກໍໄດ້. ນີ້ແມ່ນລາຍການຂອງທ່ານ ບໍ່ແມ່ນຄຳຕັດສິນ.',
  'skinquest.concerns.none': 'ຕອນນີ້ບໍ່ມີຂໍ້ໃດກົງ',
  'skinquest.record.eyebrow': 'ບັນທຶກຂອງຂ້ອຍ',
  'skinquest.record.headline': 'ນີ້ແມ່ນສິ່ງທີ່ທ່ານສັງເກດເຫັນ.',
  'skinquest.record.lead':
    'ທັງໝົດນີ້ແມ່ນຄຳຕອບຂອງທ່ານເອງ ທີ່ຂຽນໄວ້ຕາມນັ້ນ. ບໍ່ໄດ້ຕີຄວາມ, ບໍ່ໄດ້ໃຫ້ຄະແນນ ແລະ ບໍ່ໄດ້ວິນິດໄສ.',
  'skinquest.record.answers': 'ຄຳຕອບຂອງທ່ານ',
  'skinquest.record.picked': 'ສິ່ງທີ່ທ່ານສັງເກດເຫັນ',
  'skinquest.record.nothingPicked': 'ທ່ານບໍ່ໄດ້ເລືອກສິ່ງໃດໄວ້ຕິດຕາມ — ນັ້ນກໍເປັນຄຳຕອບທີ່ໃຊ້ໄດ້.',
  'skinquest.record.learnNext': 'ສິ່ງທີ່ໂລກນີ້ສອນທ່ານໄດ້ກ່ຽວກັບເລື່ອງນີ້',
  'skinquest.record.pendingReview':
    'ຫົວຂໍ້ຂ້າງເທິງມາຈາກຖານຂໍ້ມູນຄວາມຮູ້ ແລະ ຍັງຢູ່ໃນຂັ້ນຕອນກວດສອບ ຈຶ່ງລະບຸໄວ້ເປັນຫົວຂໍ້ທີ່ຈະຮຽນ ບໍ່ແມ່ນຂໍ້ເທັດຈິງທີ່ຢືນຢັນແລ້ວ.',
  'skinquest.record.routine': 'ລຳດັບດຽວທີ່ໄດ້ຮັບການອະນຸມັດ',
  'skinquest.record.routineNote':
    'ໃນຖານຂໍ້ມູນຄວາມຮູ້ທັງໝົດ ລຳດັບກິດຈະວັດແມ່ນບັນທຶກທີ່ໄດ້ຮັບການອະນຸມັດ. ຂ້າງລຸ່ມນີ້ແມ່ນລຳດັບນັ້ນ ຕາມຕົ້ນສະບັບ.',
  'skinquest.record.escalation':
    'ໃນສິ່ງທີ່ທ່ານເລືອກ ມີຢ່າງໜ້ອຍໜຶ່ງຂໍ້ ທີ່ເອກະສານຕົ້ນສະບັບລະບຸວ່າ ຕ້ອງການຜູ້ຊ່ຽວຊານ ບໍ່ແມ່ນການຮຽນຮູ້ດູແລຕົນເອງ. ກະລຸນາໃຫ້ຄວາມສຳຄັນຕາມນັ້ນ.',
  'skinquest.record.restart': 'ເລີ່ມໃໝ່ແຕ່ຕົ້ນ',
  'skinquest.record.explore': 'ເຂົ້າໄປຮຽນໃຫ້ເລິກກວ່ານີ້',
};


/**
 * Thai catalog. Thai is LOC-004 in Master DB 15_LOCALIZATION, Stage=Market,
 * Notes="Thailand expansion", and the Global Content Engine spec lists it too.
 *
 * It carries a second job beyond Thailand. Lao and Thai are closely related and Lao readers
 * commonly follow Thai, but the two use *different scripts* — a Thai voice cannot pronounce Lao
 * script at all. So where Lao is selected and the device has no Lao voice, read-aloud speaks
 * *this* Thai text with a Thai voice rather than feeding Lao characters to a Thai engine. See
 * SPOKEN_FALLBACK.
 *
 * ⚠ Like French and Lao, this has not been read by a Thai speaker. It is registered
 * UNREVIEWED_DRAFT and the app says so while it is selected.
 */
const MESSAGES_TH: Partial<Record<MessageKey, string>> = {
  'app.title': 'โลกแห่งการเรียนรู้ความงาม',
  'app.northStar': 'เรียนรู้ความงาม รู้จักตัวเอง เลือกได้ดีขึ้น',

  'nav.mySkin': 'ผิวของฉัน',
  'nav.ingredientGarden': 'สวนส่วนผสม',
  'nav.routineStudio': 'สตูดิโอรูทีน',
  'nav.sunProtection': 'การป้องกันแสงแดด',
  'nav.labelDetective': 'นักสืบฉลาก',
  'nav.aiTutor': 'ติวเตอร์ AI',
  'nav.quests': 'เควสต์และความเชี่ยวชาญ',
  'nav.governance': 'การกำกับดูแลเนื้อหา',

  'disclosure.pendingVerification':
    'บันทึกความรู้นี้ยังไม่ผ่านการตรวจสอบหลักฐาน แสดงไว้เพื่อการเรียนรู้ ไม่ใช่ข้อเท็จจริงที่ยืนยันแล้ว',
  'disclosure.workingDataset':
    'ชุดข้อมูลที่กำลังใช้งาน โครงสร้างหลักสูตรมาตรฐานยังไม่ได้รับการอนุมัติ',
  'disclosure.notMedicalAdvice':
    'นี่คือการให้ความรู้ด้านเครื่องสำอาง ไม่ใช่การวินิจฉัยหรือการรักษาทางการแพทย์',
  'disclosure.authoredScaffold':
    'โครงร่างการเรียนที่เขียนขึ้นสำหรับต้นแบบนี้ สอนวิธีคิด และไม่ได้กล่าวอ้างทางวิทยาศาสตร์ใด ๆ',

  'safety.escalation.R2':
    'เรื่องนี้ฟังดูเหมือนควรหยุดและตรวจสอบ มากกว่าจะเรียนรู้ต่อไป แนะนำให้ปรึกษาผู้เชี่ยวชาญที่มีคุณวุฒิ และหยุดใช้ผลิตภัณฑ์ใหม่ไว้ก่อน',
  'safety.escalation.R3':
    'สิ่งที่คุณอธิบายควรได้รับการตรวจจากผู้เชี่ยวชาญที่มีคุณวุฒิ การแนะนำผลิตภัณฑ์ถูกปิดไว้ที่นี่',
  'safety.escalation.R4':
    'กรุณาขอความช่วยเหลือด่วนจากหน่วยฉุกเฉินหรือบริการทางการแพทย์ในพื้นที่ทันที บทเรียนนี้จะหยุดที่นี่',

  'lesson.phase.lesson': 'บทเรียนสั้น',
  'lesson.phase.ask': 'คำถาม',
  'lesson.phase.think': 'คิดสักครู่',
  'lesson.phase.hint': 'คำใบ้',
  'lesson.phase.try': 'คำตอบของคุณ',
  'lesson.phase.feedback': 'ผลตอบกลับ',
  'lesson.phase.reflect': 'ทบทวน',
  'lesson.phase.master': 'หลักฐานความเชี่ยวชาญ',
  'lesson.phase.complete': 'เสร็จสิ้น',

  'lesson.think.prompt': 'ก่อนจะตอบ — ข้อไหนที่คนอื่นตรวจสอบแทนคุณได้?',
  'lesson.think.continue': 'ฉันพอเดาได้แล้ว',
  'lesson.hint.request': 'ฉันต้องการคำใบ้',
  'lesson.hint.noneLeft': 'ไม่มีคำใบ้เพิ่มแล้ว คำอธิบายด้านล่างคือขั้นสุดท้าย',
  'lesson.reflect.placeholder': 'เขียนหนึ่งประโยคด้วยคำพูดของคุณเอง…',
  'lesson.reflect.submit': 'บันทึกการทบทวนของฉัน',
  'lesson.next': 'ถัดไป',
  'lesson.restart': 'เริ่มใหม่',
  'lesson.continueToTransfer': 'ลองสถานการณ์ใหม่',
  'lesson.finish': 'จบบทเรียนนี้',
  'lesson.finished': 'จบบทเรียนแล้ว หลักฐานของคุณถูกเก็บไว้ใน เควสต์และความเชี่ยวชาญ',

  'mastery.title': 'หลักฐานความเชี่ยวชาญ',
  'mastery.accuracy': 'ความถูกต้อง',
  'mastery.independence': 'ความเป็นอิสระ',
  'mastery.transfer': 'การนำไปใช้',
  'mastery.retention': 'การจดจำ',
  'mastery.notYet': 'ยังไม่มีหลักฐาน',
  'mastery.satisfied': 'มีหลักฐานแล้ว',
  'mastery.explainer': 'ความเชี่ยวชาญต้องการหลักฐานครบทั้งสี่ด้าน ตอบถูกครั้งเดียวไม่ใช่ความเชี่ยวชาญ',
  'mastery.state': 'สถานะผู้เรียน',

  'governance.title': 'การกำกับดูแลเนื้อหา',
  'governance.openItems': 'รายการกำกับดูแลที่ยังเปิดอยู่',
  'governance.strandTitle': 'การจัดหมวดสายวิชา',
  'governance.integrityTitle': 'ความสมบูรณ์ของการอ้างอิง',
  'governance.localeTitle': 'ความครอบคลุมของภาษา',
  'governance.noCanonical': 'ยังไม่มีการจัดหมวดมาตรฐานใดได้รับการอนุมัติ',
  'governance.statusCounts': 'สถานะของบันทึกความรู้',

  'common.source': 'แหล่งที่มา',
  'common.status': 'สถานะ',
  'common.evidence': 'หลักฐาน',
  'common.version': 'เวอร์ชัน',
  'common.node': 'บันทึกความรู้',
  'common.skill': 'ทักษะ',
  'common.locale': 'ภาษา',
  'common.fallbackLocale': 'แสดงเป็น {locale} — ยังไม่มีคำแปล',
  'common.notAvailable': 'ไม่มี',
  'common.comingSoon': 'ยังไม่ได้สร้างในต้นแบบส่วนนี้',

  'ingredient.catalogTitle': 'รายการส่วนผสม',
  'ingredient.catalogIntro':
    'ทุกบันทึกส่วนผสมในฐานข้อมูลที่กำกับดูแล แสดงตามที่เป็นอยู่ ยังไม่มีรายการใดผ่านการตรวจสอบหลักฐาน จึงเป็นบันทึกให้ตรวจดู ไม่ใช่คำกล่าวว่าส่วนผสมใดทำอะไร',
  'ingredient.family': 'กลุ่ม',
  'ingredient.function': 'หน้าที่หลัก',
  'ingredient.level': 'ระดับ',
  'ingredient.learningGoal': 'เป้าหมายการเรียน',
  'ingredient.reference': 'เอกสารอ้างอิง',
  'ingredient.noReference': 'ไม่มีการบันทึกเอกสารอ้างอิง',
  'ingredient.questTitle': 'เควสต์ของสวนส่วนผสม',
  'ingredient.questIntro':
    'สามเควสต์ที่กำกับดูแลของโลกนี้ เชื่อมกับแผนที่บันทึกจริงของมัน แต่ละเควสต์ขอให้ผู้เรียนบอกว่าส่วนผสมทำอะไร ซึ่งเป็นการกล่าวอ้างทางวิทยาศาสตร์ จึงยังปิดอยู่จนกว่าบันทึกจะผ่านการตรวจสอบ',
  'ingredient.winCondition': 'เงื่อนไขความสำเร็จ',
  'ingredient.coreNode': 'บันทึกหลัก',
  'ingredient.blockedBy': 'ถูกขวางโดย',
  'ingredient.lessonTitle': 'สิ่งที่คุณเรียนได้ที่นี่วันนี้',
  'ingredient.lessonIntro':
    'การอ่านส่วนผสมให้เป็น ไม่ได้ขึ้นกับข้อมูลส่วนผสมที่ยังไม่ยืนยัน การอ่านคำกล่าวอ้างเป็นทักษะการคิด บทเรียนนี้จึงเปิดอยู่',
  'ingredient.startLesson': 'เริ่มการอ่านส่วนผสม',
  'ingredient.backToGarden': 'กลับไปที่สวน',
  'ingredient.openLesson': 'เปิด',
  'ingredient.closedLesson': 'ปิด',

  'routine.lessonTitle': 'ก่อนที่คุณจะจัดลำดับใหม่',
  'routine.lessonIntro':
    'โลกนี้ไม่ได้บอกคุณว่ารูทีนของคุณควรเป็นอย่างไร แต่สอนคำถามที่ทำให้รูทีนของคุณเองตอบได้ บทเรียนจึงเปิดอยู่ขณะที่บันทึกรูทีนยังอยู่ระหว่างการตรวจสอบ',
  'routine.startLesson': 'เริ่มการคิดเรื่องรูทีน',
  'routine.backToStudio': 'กลับไปที่สตูดิโอ',
  'routine.catalogTitle': 'รูปแบบรูทีนที่กำกับดูแล',
  'routine.catalogIntro':
    'สิบบันทึกรูทีนตามที่ฐานข้อมูลเก็บไว้ แต่ละรายการถูกทำเครื่องหมายว่าอนุมัติแล้ว แต่ตารางไม่มีช่องให้รูทีนอ้างหลักฐานได้ จึงไม่มีรายการใดถูกนำเสนอว่าเป็นวิธีที่ถูกต้อง',
  'routine.sequence': 'ลำดับตั้งต้น',
  'routine.proseSequence': 'บันทึกเป็นข้อความ ไม่ใช่รายการขั้นตอนที่เรียงลำดับ แสดงตามที่เขียนไว้',
  'routine.linkedNodes': 'ความรู้ที่เชื่อมโยง',
  'routine.missingNode': 'บันทึกที่อ้างถึงไม่มีอยู่',
  'routine.questTitle': 'เควสต์ของสตูดิโอรูทีน',
  'routine.studioTitle': 'รูทีนของฉัน — การทบทวน',
  'routine.studioIntro':
    'เขียนรายการขั้นตอนที่คุณทำจริง แล้วบอกว่าแต่ละขั้นตอนมีไว้เพื่ออะไร เครื่องมือนี้บันทึกสิ่งที่คุณเขียนและนับสิ่งที่คุณอธิบายได้ ไม่ประเมินรูทีนของคุณ ไม่จัดอันดับขั้นตอน และไม่แนะนำอะไร',
  'routine.addStep': 'เพิ่มขั้นตอน',
  'routine.stepPlaceholder': 'ขั้นตอนที่คุณทำจริง…',
  'routine.purposePlaceholder': 'ขั้นตอนนี้มีไว้เพื่ออะไร และคุณจะสังเกตเห็นอย่างไร?',
  'routine.toPurpose': 'ตอนนี้ ถามว่าทำไม',
  'routine.finishReview': 'ดูสิ่งที่ฉันอธิบายได้',
  'routine.reviewHeading': 'สิ่งที่คุณอธิบายได้',
  'routine.reviewSummary': '{withPurpose} จาก {total} ขั้นตอน มีเหตุผลที่คุณระบุไว้',
  'routine.reviewNote':
    'ตัวเลขนั้นเป็นของคุณ ไม่ใช่คะแนน ขั้นตอนที่คุณอธิบายไม่ได้ไม่ใช่สิ่งผิด เพียงแต่เป็นขั้นตอนที่คุณยังเปรียบเทียบ ปกป้อง หรือตัดออกอย่างตั้งใจไม่ได้',
  'routine.startOver': 'เริ่มใหม่ทั้งหมด',
  'routine.noSteps': 'ยังไม่มีขั้นตอนในรายการ',
  'routine.stepLabel': 'ขั้นตอน',
  'routine.purposeLabel': 'เหตุผล',
  'routine.notStated': 'ไม่ได้ระบุ',

  'sun.lessonTitle': 'สิ่งที่คุณยืนยันเองได้',
  'sun.lessonIntro':
    'โลกนี้ไม่ได้บอกคุณว่าควรใช้การป้องกันแบบใด ทะเบียนหลักฐานไม่มีแหล่งข้อมูลใดเกี่ยวกับแสงแดดหรือรังสียูวีเลย สิ่งเดียวที่ซื่อสัตย์ที่มันสอนได้ คือเส้นแบ่งระหว่างสิ่งที่คุณสังเกตเห็น กับสิ่งที่ต้องการหลักฐาน',
  'sun.startLesson': 'เริ่มการคิดเรื่องการสัมผัสแดด',
  'sun.backToObservatory': 'กลับไปที่หอสังเกตการณ์',
  'sun.logTitle': 'บันทึกการสัมผัสแดดของฉัน',
  'sun.logIntro':
    'บันทึกช่วงเวลาของวันที่คุณอยู่จริง: คุณทำอะไร ประมาณเวลาใด นานเท่าใด และอยู่ในสภาพแวดล้อมแบบใด เครื่องมือนี้บันทึกและนับ ไม่ให้คะแนน ไม่ให้เกณฑ์ และไม่ให้คำแนะนำ',
  'sun.activity': 'คุณกำลังทำอะไรอยู่?',
  'sun.activityPlaceholder': 'เดินไปตลาด…',
  'sun.band': 'ประมาณเวลาใด',
  'sun.setting': 'สภาพแวดล้อม',
  'sun.minutes': 'นาที',
  'sun.addEntry': 'เพิ่มลงบันทึก',
  'sun.review': 'ดูสิ่งที่ฉันบันทึกไว้',
  'sun.noEntries': 'ยังไม่ได้บันทึกอะไร',
  'sun.summaryTotal': 'บันทึกไว้ {entries} ช่วง รวม {minutes} นาที',
  'sun.summaryNote':
    'นี่คือการสังเกตของคุณเอง ไม่ใช่การวัด และไม่ใช่ระดับความเสี่ยง ช่วงเวลาที่คุณไม่ได้บันทึกคือช่องว่างในบันทึก ไม่ใช่คำกล่าวเกี่ยวกับวันของคุณ',
  'sun.notRecorded': 'ไม่ได้บันทึก',
  'sun.startOver': 'เริ่มใหม่ทั้งหมด',
  'sun.evidenceTitle': 'สถานะหลักฐานของขอบเขตนี้',
  'sun.questTitle': 'เควสต์ของหอสังเกตการณ์แสงแดด',
  'sun.band.early-morning': 'เช้าตรู่',
  'sun.band.midday': 'กลางวัน',
  'sun.band.afternoon': 'ช่วงบ่าย',
  'sun.band.evening': 'ช่วงเย็น',
  'sun.setting.open': 'กลางแจ้ง ไม่มีที่บัง',
  'sun.setting.partial-shade': 'ร่มบางส่วน',
  'sun.setting.shade': 'อยู่ในร่ม',
  'sun.setting.indoors-by-window': 'ในอาคาร ใกล้หน้าต่าง',

  'label.title': 'สี่ข้อความ ในกล่องเดียว',
  'label.intro':
    'การอ่านฉลากคือการแยกประเภท ไม่ใช่การตัดสิน โลกนี้ช่วยให้คุณแยกสี่ส่วนออกจากกัน ไม่เคยบอกว่าคำกล่าวอ้างเป็นจริงหรือผลิตภัณฑ์เหมาะกับคุณ',
  'label.startLesson': 'เริ่มการอ่านฉลาก',
  'label.backToLibrary': 'กลับไปที่ห้องสมุด',
  'label.sorterTitle': 'แยกฉลากนี้',
  'label.sorterIntro': 'วางแต่ละบรรทัดไว้ตรงที่คุณคิดว่าควรอยู่ จะยังไม่มีการตรวจจนกว่าคุณจะขอ',
  'label.specimenWarning': 'ฉลากฝึกหัด — สมมติขึ้น ไม่มียี่ห้อ',
  'label.unplaced': 'บรรทัดที่ต้องแยก',
  'label.allSorted': 'ทุกบรรทัดถูกวางแล้ว ดูด้วยกันไหม?',
  'label.check': 'ตรวจการแยกของฉัน',
  'label.keepSorting': 'ขอย้ายอีกหน่อย',
  'label.finish': 'จบ',
  'label.startOver': 'เริ่มใหม่ทั้งหมด',
  'label.allCorrectTitle': 'สี่ส่วน แยกออกได้ครบ',
  'label.allCorrectBody':
    'ตอนนี้คุณทำแบบนี้กับกล่องไหนก็ได้ที่หยิบขึ้นมา บนฉลากจริง ส่วนต่าง ๆ จะปนกันมากกว่านี้',
  'label.someWrongTitle': 'เกือบแล้ว — {correct} จาก {total} อยู่ถูกที่',
  'label.someWrongBody':
    'รายการด้านล่างไปอยู่ผิดที่ ลองอ่านดู แล้วย้ายและตรวจอีกครั้ง การผิดก่อนคือวิธีที่ความแตกต่างจะชัดเจนขึ้น',
  'label.whyLabel': 'พูดง่าย ๆ',
  'label.movedTo': 'คุณวางสิ่งนี้ไว้ใต้',
  'label.belongsIn': 'ที่ของมันอยู่ใต้',
  'label.bucket.CLAIM': 'สิ่งที่มันพูดถึงตัวเอง',
  'label.bucket.INGREDIENTS': 'สิ่งที่อยู่ข้างใน',
  'label.bucket.HOW_TO_USE': 'วิธีใช้มัน',
  'label.bucket.CAUTION': 'สิ่งที่ต้องระวัง',
  'label.bucketHint.CLAIM': 'เขียนขึ้นเพื่อดึงดูดคุณ บริษัทเลือกที่จะพูดแบบนั้น',
  'label.bucketHint.INGREDIENTS': 'ชื่อของสิ่งที่อยู่ในขวด กฎหมายบังคับให้พิมพ์ไว้',
  'label.bucketHint.HOW_TO_USE': 'คำแนะนำจากผู้ผลิตเกี่ยวกับการใช้งาน',
  'label.bucketHint.CAUTION': 'คำเตือนเรื่องการหยุดใช้ การเก็บรักษา หรือการไปปรึกษาใครสักคน',
  'label.questTitle': 'เควสต์ของนักสืบฉลาก',
  'label.evidenceTitle': 'สถานะหลักฐานของขอบเขตนี้',

  'tutor.title': 'ถามมา แล้วดูว่าฉันยืนอยู่บนอะไร',
  'tutor.intro':
    'ติวเตอร์นี้ไม่ได้สร้างคำตอบขึ้นมา แต่แสดงให้คุณเห็นสิ่งที่มันเข้าใจ บันทึกที่กำกับดูแลรายการใดที่มันพบ และสิ่งที่มันพูดได้และพูดไม่ได้ — เพื่อให้คุณตัดสินเหตุผล แทนที่จะเชื่อถ้อยคำ',
  'tutor.placeholder': 'ถามอะไรก็ได้เกี่ยวกับความงาม…',
  'tutor.ask': 'ถาม',
  'tutor.tryThese': 'ลองข้อใดข้อหนึ่งนี้',
  'tutor.understood': 'สิ่งที่ฉันเข้าใจ',
  'tutor.intent': 'เจตนา',
  'tutor.mode': 'โหมด',
  'tutor.risk': 'ความเสี่ยง',
  'tutor.hintLevel': 'ระดับคำใบ้',
  'tutor.grounding': 'สิ่งที่ฉันพบ',
  'tutor.groundingEmpty': 'ไม่มีสิ่งใดในความรู้ที่กำกับดูแลตรงกัน ฉันจะไม่แต่งบันทึกขึ้นมาเพื่อตอบ',
  'tutor.groundingCount': 'ค้นหา {searched} บันทึก · ตรงกัน {found}',
  'tutor.matched': 'ตรงกัน',
  'tutor.canSay': 'สิ่งที่ฉันพูดได้',
  'tutor.contractNote': 'คำตอบแบบ {mode} มี {total} ส่วน {filled} ส่วนเติมได้อย่างซื่อสัตย์ตอนนี้',
  'tutor.slotBlocked': 'เติมไม่ได้',
  'tutor.uncertainty': 'สิ่งที่ฉันไม่แน่ใจ',
  'tutor.commerce': 'การแนะนำผลิตภัณฑ์',
  'tutor.commerceBlocked': 'ถูกระงับไว้ ด่านที่ไม่ผ่าน: {gates}',
  'tutor.trace': 'ร่องรอยการทำงาน',
  'tutor.traceNote':
    'เจ็ดขั้นตอนที่ธรรมนูญกำหนดไว้: บริบท การยึดหลัก การจัดประเภท ด่านความเสี่ยง การตอบ การตรวจสอบ การเรียนรู้',
  'tutor.rulesTitle': 'กฎที่บังคับใช้เป็นด่านเข้ม',
  'tutor.rulesNote':
    'บังคับใช้เฉพาะกฎ AI ที่ทั้งอนุมัติแล้วและเป็นข้อบังคับในฐานข้อมูล กฎที่ยังเป็นร่างอ่านได้ แต่ไม่กลายเป็นการบังคับใช้อย่างเงียบ ๆ',
  'tutor.evalTitle': 'ชุดประเมิน ธรรมนูญ §16',
  'tutor.evalNote': 'สิบสถานการณ์ที่ธรรมนูญกำหนดให้ผ่านก่อนเปิดใช้ ทั้งหมดทำงานบนระบบเดียวกันนี้',
  'tutor.evalPassed': 'ผ่าน {passed} จาก {total}',

  'quest.title': 'ยี่สิบห้าเควสต์ และสิ่งที่แต่ละเควสต์รออยู่',
  'quest.intro':
    'นี่คือแผนที่ของหลักสูตร ไม่ใช่แถบความคืบหน้า เควสต์ส่วนใหญ่ยังเปิดไม่ได้ และแต่ละเควสต์บอกว่าบันทึกใดขวางอยู่ ที่นี่ไม่มีการให้คะแนน: ไม่มีแหล่งข้อมูลใดกำหนดจำนวนรางวัลไว้',
  'quest.mapTitle': 'แผนที่เควสต์',
  'quest.summary':
    '{open} จาก {total} เควสต์เปิดได้ · {worlds} โลก · {served} มีบทเรียนรองรับแล้ว · {missing} ถูกขวางโดยบันทึกที่ไม่มีอยู่',
  'quest.open': 'เปิด',
  'quest.closed': 'ล็อกอยู่',
  'quest.reward': 'รางวัล',
  'quest.rewardNote':
    'ป้ายรางวัลแสดงตามที่ฐานข้อมูลบันทึกไว้ทุกประการ ไม่มีแหล่งข้อมูลใดระบุจำนวน จึงไม่มีการรวมยอด',
  'quest.claimClass': 'ประเภทคำกล่าวอ้าง',
  'quest.servedBy': 'รองรับโดย',
  'quest.blockers': 'รออยู่',
  'quest.noBlockers': 'ไม่มีอะไรขวางเควสต์นี้',
  'quest.unresolvedSkill': 'อ้างถึงทักษะที่ไม่มีอยู่',
  'quest.masteryTitle': 'หลักฐานความเชี่ยวชาญ',
  'quest.masteryIntro':
    'สิบสองทักษะที่กำกับดูแล หลักฐานได้มาจากการตอบเท่านั้น และสะสมข้ามทุกโลก — ทักษะที่ฝึกตอนอ่านฉลาก คือทักษะเดียวกับที่ฝึกในสวน',
  'quest.noEvidence': 'ยังไม่มีหลักฐาน',
  'quest.evidenceFrom': 'หลักฐานจาก',
  'quest.attempts': 'ครั้ง',
  'quest.ladderTitle': 'บันไดเจ็ดระดับ',
  'quest.ladderNote':
    'Mastery Competency Matrix เสนอเจ็ดระดับ จาก Beauty Explorer ถึง Beauty Master เอกสารนั้นระบุว่า "DECISION DRAFT — NOT CANONICAL" ที่นี่จึงไม่มีการกำหนดระดับให้ใคร',
  'quest.resetLedger': 'ลบหลักฐานของฉัน',
  'quest.ledgerSummary': 'บันทึก {attempts} ครั้ง · {started} จาก 12 ทักษะมีหลักฐาน · เชี่ยวชาญ {mastered}',

  'display.theme': 'หน้าจอ',
  'display.theme.auto': 'อัตโนมัติ',
  'display.theme.light': 'สว่าง',
  'display.theme.dark': 'มืด',
  'display.textSize': 'ขนาดตัวอักษร',
  'display.textSize.normal': 'ก',
  'display.textSize.large': 'ก+',
  'display.textSize.larger': 'ก++',
  'display.skipToContent': 'ข้ามไปยังเนื้อหาหลัก',

  'speech.listen': 'ฟัง',
  'speech.stop': 'หยุด',
  'speech.unavailable': 'ไม่มีเสียงสำหรับภาษานี้ในอุปกรณ์นี้',

  'speech.listenIn': 'ฟังเป็นภาษา{language}',

  'catalog.unreviewed':
    'หน้าจอนี้ถูกแปลเป็นภาษาไทย แต่ยังไม่ได้รับการตรวจจากผู้พูดภาษาไทย ถ้อยคำอาจผิด บทเรียนเองไม่ได้รับผลกระทบ',
  'catalog.safetyOriginal': 'ถ้อยคำต้นฉบับ เพื่อความปลอดภัย',

  'skinquest.title': 'การเดินทางของผิว',
  'skinquest.welcome.eyebrow': 'สี่นาที กับผิวของคุณเอง',
  'skinquest.welcome.headline': 'ไม่มีใครมองผิวของคุณบ่อยเท่าตัวคุณเอง',
  'skinquest.welcome.lead':
    'นี่ไม่ใช่ข้อสอบ และไม่มีคำตอบที่ผิด คุณมอง คุณตอบ และในตอนท้ายคุณจะได้บันทึกที่คุณสร้างขึ้นเอง',
  'skinquest.welcome.begin': 'เริ่มมองผิวของฉัน',
  'skinquest.welcome.boundary':
    'นี่คือการสังเกตในมุมมองเครื่องสำอาง ไม่ใช่การวินิจฉัย หากมีอาการเจ็บ ลุกลาม หรือแย่ลงเรื่อย ๆ นั่นเป็นเรื่องของผู้เชี่ยวชาญ ไม่ใช่ของแอป',
  'skinquest.progress': 'ขั้นที่ {done} จาก {total}',
  'skinquest.level.L1': 'ระดับ 1 · สิ่งที่คุณเห็น',
  'skinquest.level.L2': 'ระดับ 2 · สิ่งที่เปลี่ยนไป',
  'skinquest.level.L3': 'ระดับ 3 · สิ่งที่คุณทำอยู่แล้ว',
  'skinquest.back': 'ย้อนกลับ',
  'skinquest.continue': 'ต่อไป',
  'skinquest.thatsMe': 'นี่คือฉัน',
  'skinquest.L1.S1.prompt': 'หนึ่งชั่วโมงหลังล้างหน้า โดยไม่ทาอะไรเลย ใบหน้าของคุณรู้สึกอย่างไร',
  'skinquest.L1.S1.help': 'เลือกข้อที่ใกล้เคียงที่สุด เปลี่ยนภายหลังได้',
  'skinquest.L1.S1.tight': 'ตึง',
  'skinquest.L1.S1.comfortable': 'สบาย',
  'skinquest.L1.S1.shiny': 'มันวาว',
  'skinquest.L1.S1.mixed': 'ต่างกันตามบริเวณ',
  'skinquest.L1.S2.prompt': 'วันนี้คุณกำลังมองตรงไหน',
  'skinquest.L1.S2.help': 'เริ่มจากตรงที่คุณอยากรู้จริง ๆ',
  'skinquest.L1.S2.face': 'ใบหน้าของฉัน',
  'skinquest.L1.S2.body': 'ร่างกายของฉัน',
  'skinquest.L1.S2.hair': 'หนังศีรษะและเส้นผม',
  'skinquest.L2.S1.prompt': 'เมื่อคุณลองของใหม่ ผิวของคุณมีปฏิกิริยาไหม',
  'skinquest.L2.S1.help': 'ปฏิกิริยาหมายถึงทุกอย่างที่คุณสังเกตเห็นหลังจากนั้น ไม่ใช่แค่อาการแสบ',
  'skinquest.L2.S1.never': 'ไม่เคยสังเกตเห็น',
  'skinquest.L2.S1.sometimes': 'บางครั้ง',
  'skinquest.L2.S1.often': 'บ่อย ๆ',
  'skinquest.L2.S1.unsure': 'ไม่เคยใส่ใจ',
  'skinquest.L2.S2.prompt': 'คุณสังเกตเห็นมากที่สุดตอนไหน',
  'skinquest.L2.S2.help': 'นึกถึงวันธรรมดา ไม่ใช่วันที่แย่ที่สุด',
  'skinquest.L2.S2.morning': 'ตอนเช้า',
  'skinquest.L2.S2.evening': 'ตอนท้ายวัน',
  'skinquest.L2.S2.both': 'ทั้งสองช่วง',
  'skinquest.L2.S2.varies': 'เปลี่ยนไปตามอากาศ',
  'skinquest.L3.S1.prompt': 'คุณใช้การป้องกันแดดบ่อยแค่ไหน',
  'skinquest.L3.S1.help': 'ตอบตามสิ่งที่ทำจริง ไม่ใช่สิ่งที่ตั้งใจจะทำ',
  'skinquest.L3.S1.daily': 'ทุกวัน',
  'skinquest.L3.S1.sunny': 'วันที่แดดแรง',
  'skinquest.L3.S1.rarely': 'นาน ๆ ครั้ง',
  'skinquest.L3.S1.never': 'ไม่เคย',
  'skinquest.concerns.prompt': 'ตอนนี้คุณสังเกตเห็นข้อใดบ้าง',
  'skinquest.concerns.help':
    'เลือกกี่ข้อก็ได้ หรือไม่เลือกเลยก็ได้ นี่คือรายการของคุณ ไม่ใช่คำตัดสิน',
  'skinquest.concerns.none': 'ตอนนี้ไม่มีข้อใดตรง',
  'skinquest.record.eyebrow': 'บันทึกของฉัน',
  'skinquest.record.headline': 'นี่คือสิ่งที่คุณสังเกตเห็น',
  'skinquest.record.lead':
    'ทั้งหมดนี้คือคำตอบของคุณเอง ที่เขียนไว้ตามนั้น ไม่ได้ตีความ ไม่ได้ให้คะแนน และไม่ได้วินิจฉัย',
  'skinquest.record.answers': 'คำตอบของคุณ',
  'skinquest.record.picked': 'สิ่งที่คุณสังเกตเห็น',
  'skinquest.record.nothingPicked': 'คุณไม่ได้เลือกสิ่งใดไว้ติดตาม นั่นก็เป็นคำตอบที่ใช้ได้',
  'skinquest.record.learnNext': 'สิ่งที่โลกนี้สอนคุณได้เกี่ยวกับเรื่องนี้',
  'skinquest.record.pendingReview':
    'หัวข้อข้างต้นมาจากฐานข้อมูลความรู้และยังอยู่ระหว่างการตรวจสอบ จึงระบุไว้เป็นหัวข้อที่จะเรียน ไม่ใช่ข้อเท็จจริงที่ยืนยันแล้ว',
  'skinquest.record.routine': 'ลำดับเดียวที่ได้รับการอนุมัติ',
  'skinquest.record.routineNote':
    'ในฐานข้อมูลความรู้ทั้งหมด ลำดับกิจวัตรคือบันทึกที่ได้รับการอนุมัติ ด้านล่างคือลำดับนั้นตามต้นฉบับ',
  'skinquest.record.escalation':
    'ในสิ่งที่คุณเลือก มีอย่างน้อยหนึ่งข้อที่เอกสารต้นฉบับระบุว่าต้องการผู้เชี่ยวชาญ ไม่ใช่การเรียนรู้ดูแลตนเอง กรุณาให้ความสำคัญตามนั้น',
  'skinquest.record.restart': 'เริ่มใหม่ตั้งแต่ต้น',
  'skinquest.record.explore': 'เข้าไปเรียนให้ลึกกว่านี้',

};

const CATALOGS: Readonly<Record<string, Partial<Record<MessageKey, string>>>> = {
  en: MESSAGES_EN,
  ko: MESSAGES_KO,
  fr: MESSAGES_FR,
  lo: MESSAGES_LO,
  th: MESSAGES_TH,
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

/**
 * How much confidence each catalog has earned.
 *
 * The same discipline the rest of this codebase applies to knowledge records: a translation
 * nobody has checked is a draft, and must not be presented as if it were reviewed. Existing
 * only in code is not review.
 *
 *   BASE             — authored in this language. Not a translation, so nothing to review.
 *   OWNER_REVIEWED   — the product owner works in this language and has read these screens.
 *   UNREVIEWED_DRAFT — machine-assisted, awaiting a speaker of the language. Said on screen.
 */
export type CatalogReview = 'BASE' | 'OWNER_REVIEWED' | 'UNREVIEWED_DRAFT';

export const CATALOG_REVIEW: Readonly<Record<string, CatalogReview>> = {
  en: 'BASE',
  ko: 'OWNER_REVIEWED',
  fr: 'UNREVIEWED_DRAFT',
  // LOC-003, "Laos launch language". Being the launch market makes review urgent, not optional.
  lo: 'UNREVIEWED_DRAFT',
  // LOC-004, "Thailand expansion", and the voice Lao borrows. See SPOKEN_FALLBACK.
  th: 'UNREVIEWED_DRAFT',
};

export const catalogReview = (locale: string): CatalogReview =>
  CATALOG_REVIEW[locale] ?? 'BASE';

export const isUnreviewedCatalog = (locale: string): boolean =>
  catalogReview(locale) === 'UNREVIEWED_DRAFT';

/**
 * Safety wording, plus the base-locale original when the catalog has not been reviewed.
 *
 * CLAUDE.md rule 6 puts safety above everything else, and a safety instruction is the one
 * string where a translation error could do real harm — "seek emergency help" has to survive
 * the trip. So an unreviewed locale shows both: the translation the reader can act on, and the
 * English it was made from, so a mistranslation cannot silently replace the instruction.
 *
 * `original` is null for a reviewed catalog and for the base locale itself; there is nothing
 * to compare against and the second line would only be noise.
 */
export interface SafetyWording {
  readonly text: string;
  readonly original: string | null;
}

export function safetyWording(key: MessageKey, locale: string): SafetyWording {
  const text = translate(key, locale);
  if (!isUnreviewedCatalog(locale)) return { text, original: null };
  const original = translate(key, BASE_LOCALE);
  return { text, original: original === text ? null : original };
}

export const messageKeys = Object.keys(MESSAGES_EN) as readonly MessageKey[];
