# 재개카드 — BEAUTY LEARNING WORLD 방 · 2026-09-21

> **저장 위치 경고.** 지시받은 경로
> `C:\Users\pc\Desktop\01_KOREA_GLOW\14_일일보고_주간보고\05_지시서\재개카드\`
> 는 이 방에서 **닿지 않습니다.** 이 방은 대표이사님 PC가 아니라 Anthropic 클라우드
> 컨테이너에서 돌고 있고, `/mnt/c/...` 는 존재하지 않습니다(확인함). 그래서 이 카드는
> 리포지토리에 커밋해서 남깁니다. 위 경로에는 **대표이사님이 직접 복사해 두셔야 합니다.**

---

## ① 방 이름

`KOREA GLOW BEAUTY LEARNING WORLD — GLOBAL AI BEAUTY INTELLIGENCE PLATFORM`
(get_session 확인) · 세션 `session_01QXeMxWmEV5WqU3s4KrzUYh` · 2026-09-18 개설 ·
환경 `anthropic_cloud` · 모델 `claude-opus-5`
리포지토리: `github.com/mooryongahn6407/kbeauty-origin`

이 방은 **9개 부서 방이 아니라 앱 개발 방**입니다. 가격·수수료·재고 등 다른 부서에
영향을 주는 상업적 결정은 이 방에서 **한 건도 내리지 않았습니다.**

## ② 지금 하던 일

앱을 "세계 수준"으로 올리기 위한 UX 개선. 마지막 작업 3건:
언어 버튼 상단 배치 / 음성 지원 버튼 상단 + 친절 안내 / 색·글씨 개선,
그리고 첫 화면을 루미나 노이가 직접 인사하는 형태로 재작성.

## ③ 어디까지 했나 (증거)

| 항목 | 상태 | 증거 |
|---|---|---|
| 라이브 사이트 | **배포 완료** | https://cozy-treacle-80f53c.netlify.app · Netlify deploy `6ab0aefb05de4200085f9d19`, state `ready`, published `2026-09-21T04:14:15Z` |
| main 브랜치 | `92e67c0` | PR #5 (`df9b2fe`), PR #6 (`92e67c0`) 둘 다 squash 머지됨 |
| 작업 브랜치 | `claude/laughing-babbage-acxc3h` HEAD `97db822` | main 머지 커밋. 내용은 main과 동일 (`git diff` 없음) |
| 테스트 | **578개 전부 통과** | `npx vitest run` · `npm run typecheck` · `npm run build` 모두 clean |
| 브라우저 육안 확인 | 완료 | Chromium 390×780 / 320×720, 밝은·어두운 모드, 5개 언어 전부 |

완성된 화면: 스킨 퀘스트(첫 화면), 성분 찾기, 나란히 비교, 순서 맞추기,
주장/기록 구분, 내 피부, 성분 하나씩 보기, 내 루틴 짜보기, 자외선 보호,
화장품 상자 읽기, AI 튜터, 내가 어디까지 왔나, 콘텐츠 거버넌스(관리자용).

이번 방에서 잡은 실제 버그 2건(둘 다 브라우저로 보다가 발견):
- 음성 켠 상태 버튼 글씨가 안 보임 (CSS `:hover` 우선순위)
- 음성 오류 시 앱 전체가 하얗게 죽음 (`speak()` 예외가 React 트리를 날림)

**확인되지 않음:** 이 방의 작업 내용이 `05_지시서` / 체크리스트 / `KG-TRACK`에
남아 있는지는 이 방에서 열어볼 수 없어 확인하지 못했습니다. 이 카드가 그 기록의
대체가 아닙니다 — 대표이사님이 옮겨 주셔야 합니다.

## ④ 다음 한 걸음

**안쪽 화면(질문 화면·기록 화면)의 말투를 루미나 노이 톤으로 통일.**
지금은 첫 화면만 루미나가 말하고, 안쪽은 아직 딱딱합니다.
대상 파일: `src/ui/screens/SkinQuestScreen.tsx`, `src/localization/messages.ts`.
그 다음이 **라오어 홍보영상** (`scripts/promo/slides.html` 자막만 라오어로 교체,
`npm run promo:video`).

## ⑤ 대표이사 결정 대기 (아직 답 못 받은 것만)

1. **[최대 병목] 지식베이스 승인.** 212개 지식노드 / 40개 성분 / 15개 고민이
   전부 `Status=Draft`. 그래서 앱이 "성분이 무엇을 한다"를 한 마디도 말하지
   못합니다. 이게 앱이 추상적으로 읽히는 **진짜 이유**이고, 코드로는 해결 불가.
   자격 있는 검수자 1명 × 약 2주 필요. 근거: `docs/PROJECT_REPORT_KO.md`
2. **안쪽 화면도 첫 화면과 같은 톤으로 풀까요?** (04:20 마지막 메시지에서 여쭸고
   아직 답 없음)
3. **58 vs 92 strand 문제 (SR-001).** 오너가 결정하기 전까지
   `CANONICAL_TAXONOMY_ID = null` 고정. CLAUDE.md 규칙 5.

이미 답 주신 것(재질문 금지): 머지·배포 할 것 / 유료 AI 안 씀 / 이미지는 만화로 /
영상은 앱 완성 후.

## ⑥ 기한·약속

- 라오어 홍보영상: "앱이 더 완벽해진 뒤" — **구체 날짜 확인되지 않음**
- `docs/PROJECT_REPORT_KO.md`는 "내일 회의"용으로 작성됨(2026-09-20 기준) —
  **회의가 실제로 열렸는지 확인되지 않음**

## ⑦ 건드리면 안 되는 것

`CLAUDE.md`의 16개 규칙 전부. 특히:
- 소스 ID(`D01`, `ING-001`, `QST-001` …) 변경·삭제·병합 금지
- Draft를 Approved처럼 다루기 금지. `evaluatePublication()`만이 판단
- 과학·성분·안전·규제 사실 **지어내기 절대 금지**
- 숙달(mastery)과 선물·인플루언서·파트너 상태 **분리 유지** (규칙 9, OQ-X01)
- 13px 미만 금지 / 밝은·어두운 모드 둘 다 WCAG AA / 터치 44px / 인라인 fontSize 금지
- 미검수 번역(fr·lo·th)은 화면에 "미검수"라고 표시 — 사람만 이 상태를 바꿀 수 있음
- 음성이 스크립트를 넘나들지 않음. 라오어는 태국어 **번역문**을 태국어 음성으로
- 리듀서는 순수 `(state, action)`
- 저장소 루트 `INDEX.html.txt` (JY Global 커머스 랜딩) **손대지 말 것**

## ⑧ 관련 문서·화면·도구

| 무엇 | 경로 |
|---|---|
| 라이브 앱 | https://cozy-treacle-80f53c.netlify.app |
| 리포지토리 | https://github.com/mooryongahn6407/kbeauty-origin |
| 사업 보고서(한글) | `docs/PROJECT_REPORT_KO.md` |
| 홍보영상 대본·콘티 | `docs/PROMO_VIDEO_SCRIPT_KO.md` |
| 영상 제작 도구 | `scripts/promo/` (`slides.html`, `capture-app.mjs`, `render.mjs`) |
| 규칙 원문 | `CLAUDE.md`, `docs/SOURCE_OF_TRUTH.md`, `docs/ARCHITECTURE.md` |
| 현재 빌드 상태 | `ENGINEERING_STATUS.md` |
| 미해결 쟁점 등록부 | `src/governance/open-items.ts`, `src/governance/product-proposals.ts` |
| 5개 언어 문구 전부 | `src/localization/messages.ts` |
| 디자인 토큰·색·글씨 | `src/ui/theme.css` |
| Netlify 관리 | https://app.netlify.com/projects/cozy-treacle-80f53c |

## 뒤에서 돌고 있는 것

- **서브에이전트: 없음**
- **예약작업(cron·트리거): 없음**
- **다운로드: 없음**
- **배포: 완료됨** (Netlify `6ab0aefb05de4200085f9d19`, `ready`)
- `vite preview` 로컬 서버가 4241 포트에서 떠 있으나 이 컨테이너 안에서만 도는
  임시 서버입니다. 컨테이너가 회수되면 같이 사라지고, **잃을 것이 없습니다.**
- 작업물은 전부 `origin/main`(`92e67c0`)에 푸시되어 있습니다.
