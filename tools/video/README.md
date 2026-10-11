# 세로 영상 만드는 도구 (KOREA GLOW)

앱과 별개인 영상 제작 도구입니다. 1080×1920, 30fps.

| 파일 | 하는 일 |
|---|---|
| `record2.mjs` | 앱 실제 화면을 한 장씩 찍어 `frames/<장면>-<언어>/` 로 저장 (vite preview가 4173에 떠 있어야 함) |
| `engine.html` | 장면 종류(photo, portrait, phone, grid, qr, cards, flow)를 시간 t의 함수로 그림 |
| `render.mjs <spec.json> <out.mp4>` | 장면 목록(spec)을 프레임마다 찍어 H.264로 |
| `preview.mjs <spec> <접두어> <초...>` / `overflow.mjs <spec...>` | 미리보기 / 글자가 화면 밖으로 넘치는지 검사 |
| `music.py bright\|calm <초> <out.npy>` | 배경음악 직접 합성(샘플 없음, 저작권 문제 없음) |
| `mix.py <이름>` | `narr.json` 대사를 Supertonic 3(무료 오프라인 한국어 음성)으로 읽고 음악과 섞음, 말할 때 음악을 줄임 |
| `supertonic.py` | Supertonic 3 불러오기 (모델은 /tmp/claude-0/tts 에 내려받아 둠) |

필요한 것: `npm i @ffmpeg-installer/ffmpeg @fontsource/noto-sans-lao` (이 폴더에서), Playwright/Chromium, Python numpy·scipy·soundfile·sherpa-onnx.

**파트너·투자자 영상의 장면표와 대사는 여기에 없습니다** — 수수료율·재무 추정치가 들어 있어 공개 저장소에 두지 않습니다. 내용은 대본 문서(https://claude.ai/code/artifact/9fd4a1cf-091a-45cd-a552-2749538b6a6e)에, 투자자 원본은 구글 드라이브
`KG_앱자산_공유`의 «영상_투자자_장면표_백업.json»에 두었습니다.
라오어는 무료 음성 엔진이 없어 음악 + 자막입니다(수석 파트너 녹음을 받으면 교체).
