# pisesh

[English](../README.md) | **한국어**

[![npm](https://img.shields.io/npm/v/pisesh?style=for-the-badge&logo=npm&color=CB3837&logoColor=white)](https://www.npmjs.com/package/pisesh)
[![ci](https://img.shields.io/github/actions/workflow/status/Blue-B/pisesh/ci.yml?branch=main&style=for-the-badge&logo=github-actions&logoColor=white&label=CI)](https://github.com/Blue-B/pisesh/actions/workflows/ci.yml)
[![license](https://img.shields.io/github/license/Blue-B/pisesh?style=for-the-badge&color=blue)](../LICENSE)
[![node](https://img.shields.io/badge/node-%E2%89%A518-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![deps](https://img.shields.io/badge/dependencies-0-brightgreen?style=for-the-badge)](../package.json)

**[pi coding-agent](https://github.com/earendil-works/pi-coding-agent) 세션을 빠른 키보드 TUI로 즐겨찾기·검색·재개합니다.**

> `pi --resume` 는 시작한 모든 세션을 나열만 합니다. 일주일 지나면 50+ 항목이 제목도 태그도 순서도 없이 늘어서 있어요 — 스크롤하며 운에 맡겨야 하죠. **pisesh** 는 빠진 단 한 가지를 채웁니다: ⭐ 즐겨찾기, 즉시 검색, 그리고 지금 붙어있는 세션을 알려주는 `[NOW]` 배지.

## 미리보기

<p align="center">
  <img src="../assets/preview.png" alt="pisesh — 실제 Windows Terminal에서 캡처한 Favorites 탭" width="100%">
</p>

<p align="center"><sub>실제 캡처: ★ 즐겨찾기 세션이 맨 위, 나머지는 <b>Today</b> / <b>All</b> 탭에. <code>Tab</code> 으로 전환, <code>f</code> 로 별, <code>Enter</code> 로 재개.</sub></p>

## 왜 pisesh?

Pi는 여러 작업 폴더에 걸쳐 세션이 쌓입니다 — 홈, 프로젝트 디렉터리들, 임시 작업방. 내장 resume picker는 알파벳순 비슷한 정렬에 맥락을 기억 못 합니다. 몇 주 지나면:

- "auth 버그 고치던 세션" 이 어느 건지 모름
- 계속 돌아가는 장기 스레드 3~4개를 고정할 방법이 없음
- 잘못된 세션 열어서 무관한 컨텍스트로 오염시킴
- 타임스탬프로 추측하면서 시간 낭비

pisesh는 **단일 파일 Node 스크립트** (의존성 0, ~600 LoC) 입니다. `pi --resume` 이 못하는 모든 걸 채워요.

### 한눈에 보는 가치

| 필요한 것                                    | 제공하는 것                                                       |
| -------------------------------------------- | ----------------------------------------------------------------- |
| 중요한 세션 표시                             | ⭐ 한 키로 별표/해제. 글로벌 JSON 하나에 영구 저장                 |
| 한 말로 세션 찾기                            | `/` 로 id + 프로젝트 + 첫 user prompt 부분 매치 검색               |
| 지금 붙어있는 세션 파악                      | 라이브 세션에 `[NOW]` 배지 (env var로 pi가 전달)                  |
| 터미널 깔끔히 유지                           | Alt-screen buffer — 종료 시 터미널 그대로 복원 (vim과 동일)        |
| 한·중·일 prompt 읽기                         | 표시 너비 기반 truncation; CJK 들어가도 컬럼 안 흐트러짐           |
| 어디서든 열기                                | 셸 명령어 `pisesh` 또는 pi 안의 `/sesh` 슬래시 명령                 |
| 설치 고통 없음                               | 빌드 단계 없음, native deps 없음, Node 18+ 면 어디서든            |
| 히스토리 안전성                              | pisesh는 favorites 파일 하나만 씀. 세션 jsonl은 읽기 전용         |

## 설치

### 빠른 설치 (권장)

```bash
# CLI + /sesh 슬래시 명령을 한 번에
pi install npm:pisesh
```

pi 익스텐션으로 등록됩니다. pi 안에서 `/sesh` 치면 끝.

### 셸 CLI만

```bash
npm install -g pisesh
pisesh
```

pi와 별도로 셸 명령으로만 쓰고 싶을 때.

### 소스에서 (개발자)

```bash
git clone https://github.com/Blue-B/pisesh.git
cd pisesh
npm link            # ./bin/pisesh 를 글로벌 PATH로 심볼릭
pisesh --help
```

Pi 익스텐션 쪽: `extensions/sesh.ts` 를 `~/.pi/agent/extensions/` 에 떨궈놓고 pi 안에서 `/reload`.

## 키

| 키                          | 동작                                                          |
| --------------------------- | ------------------------------------------------------------- |
| `↑` `↓` / `j` `k`           | 커서 이동                                                     |
| `Tab` / `h` / `l`           | 탭 전환 (`★ Favorites` → `Today` → `All`)                     |
| `f` / `Space`               | 선택 세션 별표/해제                                           |
| `Enter`                     | 재개 — `pi --session <id> --session-dir <dir>` 실행            |
| `d`                         | 세션 상세 (전체 prompt, 파일 경로, 크기, 시각)                |
| `/`                         | 검색 (id / 프로젝트 / 첫 user prompt)                         |
| `Esc`                       | 검색 클리어 → 한 번 더 누르면 종료                            |
| `q` / `Ctrl-C`              | 종료 (터미널 복원됨)                                          |
| `r`                         | 세션 파일 재스캔 (pi가 새 세션 시작했을 때)                   |
| `c` (상세 화면)             | session id 클립보드 복사 (clip.exe / pbcopy / xclip)         |
| `Home` `End` `PgUp` `PgDn`  | 맨위 / 맨아래 / ±10 점프                                     |

## CLI (TUI 아닌) 사용법

스크립트·자동화용:

```bash
pisesh --list                  # 별표된 세션 ID 출력 (줄당 하나)
pisesh --json                  # favorites 파일 전체를 JSON으로
pisesh --star <부분-uuid>      # 스크립트에서 별표 추가
pisesh --unstar <부분-uuid>    # 별표 해제
pisesh --help
```

## 기술 스택

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/) [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000)](https://developer.mozilla.org/docs/Web/JavaScript) [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![pi](https://img.shields.io/badge/pi--coding--agent-5C4EE5?style=for-the-badge)](https://github.com/earendil-works/pi-coding-agent)

| 영역                | 세부                                                                                            |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| 런타임              | Node.js ≥ 18 (내장 모듈만: `fs`, `path`, `os`, `child_process`, `readline`)                     |
| TUI 렌더링          | Raw ANSI escape (blessed/ink/chalk 등 의존 없음)                                                |
| Alt-screen buffer   | `\x1b[?1049h` / `\x1b[?1049l` — vim, less, htop, droid CLI와 동일한 원시 기법                   |
| 입력                | Node `readline.emitKeypressEvents` raw 모드                                                     |
| 너비 계산           | UAX #11 East Asian Width 범위, ~10줄짜리 인라인 체크로 압축                                     |
| Pi 익스텐션         | `@earendil-works/pi-coding-agent` 익스텐션 API (`ui.custom`, `tui.stop`) 의 TS 팩토리            |
| 저장소              | `~/.pi/agent/favorites.json` 단일 JSON 파일 (`{ ids: [...], updated: "iso" }`)                  |
| 세션 탐색           | `~/.pi/agent/sessions/<projectSlug>/*.jsonl` 직접 파일시스템 스캔, 첫 96 KB 만 파싱              |
| 프로세스 모델       | 슬래시 명령이 pi TUI를 멈춤 → stdio 상속으로 pisesh 스폰 → 종료 시 pi 다시 그림                  |

### 명시적으로 **안 쓰는** 것

- 번들 CLI 런타임에 `npm install` 불필요 — 진짜 zero-dep
- native binary / GPU / ffmpeg / DB 없음
- 네트워크 호출, 텔레메트리, 분석 없음
- 데몬 / 백그라운드 프로세스 없음

## resume 가 동작하는 방식

```text
pi (세션 A)  ── /sesh ──▶  ui.custom + tui.stop()
                            │
                            └─▶ pisesh 스폰 (PISESH_CURRENT_SESSION=A)
                                  │  ↑↓ Tab f / Enter on 세션 B
                                  │
                                  └─▶ pi --session B --session-dir <dir> 스폰
                                        │
                                        │  사용자가 B에서 작업…
                                        │  사용자가 q / ^D 입력
                                        │
                                  ◀─── 내부 pi 종료, pisesh 종료
                            │
              ◀─── tui.start() + requestRender(true)
pi (세션 A) 정확히 멈췄던 자리에서 이어감
```

현재 pi 세션은 잃지 않고 멈춥니다. 재개한 세션 끝내면 A로 돌아오고 상태 그대로.

## 저장 위치

| 무엇       | 어디                                                       |
| ---------- | ---------------------------------------------------------- |
| 즐겨찾기   | `~/.pi/agent/favorites.json`                               |
| 세션       | `~/.pi/agent/sessions/<projectSlug>/<timestamp>_<uuid>.jsonl` (pi 기본 레이아웃 — pisesh는 안 씀) |

즐겨찾기 파일 모양:

```json
{
  "ids": [
    "019e79b9-d2c1-741f-81ea-1dcad9a2d712",
    "019e6355-9957-7a30-b4ce-b9db5e3c9ac6"
  ],
  "updated": "2026-05-31T01:33:21.234Z"
}
```

글로벌 단일 파일 (프로젝트별 X). 백업은 파일 하나만 동기화하면 됩니다.

## CJK 너비 처리

한·중·일 / 전각 문자는 터미널에서 **2칸 너비**로 렌더됩니다. pisesh는 truncation·padding 시 JS 코드 유닛 길이가 아니라 표시 너비로 측정합니다. 한글 prompt도 줄넘김 없이, 컬럼 정렬도 그대로 유지됩니다.

```text
✓ aitapps         지금 디렉토리에 앱인토스 제출용앱을 만들었는데…
✓ 공모전          신소재 공학 관련 졸업과제 도와줘…
✓ WhisperSubTrans 이슈 #26 이전 버전 아닌가 확인…
```

(이전에는: 한글 prompt가 둘째 줄로 흐르면서 표가 깨졌어요.)

## 요구 사항

- **Node.js ≥ 18** (optional chaining, `for…of` on strings 사용 — 트랜스파일 불필요)
- ANSI escape + alternate screen buffer 지원하는 터미널 — 사실상 모든 모던 에뮬레이터:
  - Windows: **Windows Terminal**, **WezTerm**, **Alacritty** ✅
  - macOS: **iTerm2**, **Terminal.app**, **WezTerm**, **Alacritty**, **Kitty** ✅
  - Linux: **GNOME Terminal**, **Konsole**, **xterm**, **Alacritty**, **Kitty** ✅
- `Enter` 재개 동작 위해 `$PATH` 상의 [`pi`](https://www.npmjs.com/package/@earendil-works/pi-coding-agent)

## 로드맵

| 상태 | 항목                                                                            |
| ---- | ------------------------------------------------------------------------------- |
| ✅   | 탭, 별표/해제, 검색, alt-screen, CJK 너비, `[NOW]` 배지, pi `/sesh`             |
| 🚧   | `n` / `N` 다음/이전 검색 매치 점프 (less 스타일)                                |
| 🚧   | 매치된 부분 노란색 하이라이트                                                   |
| 🚧   | `today/yesterday/this-week` 필터                                                |
| 🧠   | 로컬 모델로 첫 N개 user prompt 요약해 풍부한 제목                               |
| 🧠   | 별표된 세션 단일 번들로 export (공유/아카이브)                                 |
| 🧠   | 인라인 rename/라벨 (`n` 키로 첫 prompt를 덮어쓸 커스텀 제목)                    |

🚧 항목은 PR 환영입니다.

## 기여

```bash
git clone https://github.com/Blue-B/pisesh.git
cd pisesh
npm link
npm test        # node --check + smoke test
```

브랜치: 짧은 `feature/<scope>` 또는 `fix/<scope>` → `main`에 squash-merge.
커밋: [Conventional Commits](https://www.conventionalcommits.org/) 형식 (`feat:`, `fix:`, `docs:`, `chore:`).

PR 올리세요 — CI 매트릭스가 Ubuntu / macOS / Windows × Node 18 / 20 / 22 에서 돕니다.

## 후원

pisesh가 컨텍스트 전환 시간을 아껴주거나 pi 사용 경험을 낫게 만들었다면, 직접 후원이 개발을 가속합니다:

- 후원이 도움이 됩니다: 버그 픽스, 새 키바인딩, 검색 모드 추가, 다른 pi 익스텐션과의 통합.
- 투명성: 데이터 안 팝니다; 자금은 개발 시간 + 커피 한두 잔.
- 일회성 후원자는 README와 릴리스 노트에 크레딧 (옵트아웃 가능).
- 월 후원자 ($3/mo via GitHub Sponsors) 는 "Sponsor Request" 이슈에 best-effort 우선 처리.

[![GitHub Sponsors](https://img.shields.io/badge/Sponsor-GitHub-EA4AAA?style=for-the-badge&logo=github-sponsors&logoColor=white)](https://github.com/sponsors/Blue-B) [![Buy Me A Coffee](https://img.shields.io/badge/One%E2%80%91time_$3-Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=000)](https://buymeacoffee.com/beckycode7h) [![PayPal](https://img.shields.io/badge/Donate-PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://www.paypal.com/ncp/payment/ZEWFKDX595ESJ)

## 감사

- [pi-coding-agent](https://github.com/earendil-works/pi-coding-agent) by [@mariozechner](https://github.com/mariozechner) — 에이전트와 익스텐션 API 가 `/sesh` 를 가능하게 함.
- [interactive-shell 예제 익스텐션](https://github.com/earendil-works/pi-coding-agent/blob/main/examples/extensions/interactive-shell.ts) — `ui.custom` + `tui.stop` TTY 인수 패턴 참조.
- 즐겨찾기 + 탭 UX 영감: [droid CLI](https://github.com/factory-ai/droid) 와 tmux의 [sesh](https://github.com/joshmedeski/sesh).

## 기여자

pisesh를 더 낫게 만든 모두에게 감사 🙏

<a href="https://github.com/Blue-B"><img src="https://github.com/Blue-B.png?size=80" width="80" alt="Blue-B" title="Blue-B" /></a>

## Repository activity

![Repobeats analytics image](https://repobeats.axiom.co/api/embed/a21cb8addd5d2f0ea4ec229c69da5b23855911a8.svg "Repobeats analytics image")

## Star History

<a href="https://star-history.com/#Blue-B/pisesh&Date">
  <img src="https://api.star-history.com/svg?repos=Blue-B/pisesh&type=Date" alt="Star History Chart" width="600" />
</a>

## 라이선스

MIT © [Blue-B](https://github.com/Blue-B). [LICENSE](../LICENSE) 참조.

Pi 익스텐션 부분은 `@earendil-works/pi-coding-agent` API를 사용합니다 — 해당 라이선스는 pi 쪽 확인하세요. CLI 바이너리는 순수 Node 라 추가 라이선스 신경 안 써도 됩니다.
