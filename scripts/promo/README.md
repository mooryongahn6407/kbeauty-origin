# 홍보 영상 제작 (scripts/promo)

대본과 컷 구성은 `docs/PROMO_VIDEO_SCRIPT_KO.md`에 있습니다. 여기는 그걸 실제 파일로 뽑는 도구입니다.

## 만드는 법

```bash
# 도구는 프로젝트 의존성이 아닙니다 — 영상 만들 때만 한 번 설치합니다.
# 학습 앱 설치할 때마다 Playwright와 ffmpeg를 받게 만들 이유가 없습니다.
npm i --no-save playwright-core @ffmpeg-installer/ffmpeg

npm run build && npx vite preview --outDir dist --port 4240 &   # 앱을 띄우고
node scripts/promo/capture-app.mjs                               # 실제 화면을 찍고
node scripts/promo/render.mjs                                    # 영상을 만든다
```

결과: `scripts/promo/korea-glow-skin-quest-ko.mp4` (1080×1920, 62초, 약 1MB)

## 구성

| 파일 | 하는 일 |
|---|---|
| `capture-app.mjs` | 실제 앱 화면 6장을 2배 해상도로 캡처 → `frames/` |
| `slides.html` | 컷 11개. 하나가 `<section class="slide">` 하나 |
| `render.mjs` | 컷을 1080×1920로 캡처 → ffmpeg로 이어붙임 |

## 다른 언어판

`slides.html`의 자막만 바꿔 다시 렌더링하면 됩니다. 컷 구성과 화면은 그대로 씁니다.
라오어판이 가장 중요합니다 — 라오스 소비자에게 라오어로 말하는 한국 화장품 영상은 사실상 없습니다.

## 지킬 것

효능을 약속하지 않습니다. 성분이 무엇을 한다고 말하지 않습니다. 진단처럼 들리게 하지 않습니다.
앱이 지키는 원칙을 홍보 영상이 깨면 앱이 하는 말이 전부 무의미해집니다.
