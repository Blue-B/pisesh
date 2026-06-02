# pisesh

**English** | [한국어](https://github.com/Blue-B/pisesh/blob/main/docs/README.ko.md)

[![npm](https://img.shields.io/npm/v/pisesh?style=for-the-badge&logo=npm&color=CB3837&logoColor=white)](https://www.npmjs.com/package/pisesh)
[![ci](https://img.shields.io/github/actions/workflow/status/Blue-B/pisesh/ci.yml?branch=main&style=for-the-badge&logo=github-actions&logoColor=white&label=CI)](https://github.com/Blue-B/pisesh/actions/workflows/ci.yml)
[![license](https://img.shields.io/github/license/Blue-B/pisesh?style=for-the-badge&color=blue)](LICENSE)
[![node](https://img.shields.io/badge/node-%E2%89%A518-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![deps](https://img.shields.io/badge/dependencies-0-brightgreen?style=for-the-badge)](package.json)

**Bookmark, search, and resume [pi coding-agent](https://github.com/earendil-works/pi) sessions with a fast keyboard-driven TUI.**

> `pi --resume` lists every session you ever started. After a week that's 50+ entries with no titles, no tags, and no order, so you just scroll and hope. pisesh adds what was missing: ⭐ favorites, instant search, and a `[NOW]` badge for the session you're attached to.

## Preview

<p align="center">
  <img src="assets/preview.png" alt="pisesh Favorites tab in a real Windows Terminal session" width="100%">
</p>

<p align="center"><sub>Real capture: ★ starred session at the top, the rest available behind the <b>Today</b>, <b>Here</b>, and <b>All</b> tabs. <code>Tab</code> cycles. <code>f</code> stars. <code>Enter</code> resumes.</sub></p>

## Terminal walkthrough

What the TUI looks like, screen by screen. The data below is made up, not real sessions.

**Main list.** The highlighted row is the current selection, and `Tab` cycles through the tabs. The green `[NOW]` badge marks the pi session you launched from, and the cyan `✎` marks a session you renamed yourself. CJK titles stay column-aligned:

<p align="center"><img src="assets/screen-list.png" alt="pisesh main list, Favorites tab with Today / Here / All tabs, the NOW badge, and a renamed session" width="100%"></p>

**`e` renames a session.** The first user prompt makes a poor title for a thread you keep coming back to, so press `e` to set your own. It's saved as an override (the session jsonl is never touched) and the session gets a `✎` marker in the list:

<p align="center"><img src="assets/screen-rename.png" alt="pisesh edit-name panel for setting a custom display title" width="100%"></p>

**`p` re-points the working directory** through an arrow-key directory browser. This is the cwd pi actually `cd`s into on resume, and it's also what the `Here` tab filters on. Press `s` to lock in the highlighted directory:

<p align="center"><img src="assets/screen-cwd.png" alt="pisesh cwd browser, an arrow-key directory picker for the resume and Here directory" width="100%"></p>

The **`Here` tab** shows only sessions whose effective cwd matches the directory you launched pisesh from. Inside a project you see just that project's threads, without scrolling past your home-dir scratch sessions.

## Why pisesh

Pi accumulates sessions across many working directories: your home, several project dirs, scratch tmux panes. The built-in resume picker is roughly alphabetical and forgets context. After a few weeks:

- You can't tell which session was "the one where you fixed the auth bug"
- You can't pin the 3-4 long-running threads you keep going back to
- You re-open the wrong session and pollute it with unrelated context
- You waste time searching by timestamp guessing

pisesh is a **single-file Node script** (no dependencies, ~900 LoC) that gives you everything `pi --resume` doesn't.

### Value at a glance

| Need                                       | What you get                                                                 |
| ------------------------------------------ | ---------------------------------------------------------------------------- |
| Mark important sessions                    | ⭐ Star/unstar with one keystroke; favorites persist to one global JSON       |
| Give a thread a real name                  | `e` sets a custom title (marked `✎`); overrides the first-prompt label        |
| See only the current project's sessions    | `Here` tab filters to sessions whose cwd matches where you launched pisesh   |
| Fix where a session resumes                | `p` opens an arrow-key directory browser; sets the cwd pi `cd`s into         |
| Find a session by what you said            | `/` searches id + project + first user prompt + custom title                 |
| Know which session you're attached to      | `[NOW]` badge on the live session (passed from pi via env var)               |
| Keep your terminal clean                   | Alt-screen buffer, so quitting puts your terminal back the way it was (like vim) |
| Read Korean / Chinese / Japanese prompts   | Display-width-aware truncation; columns never blow up on CJK                 |
| Open from anywhere                         | Run as standalone `pisesh` shell command, or `/sesh` inside pi               |
| Zero install pain                          | No build step, no native deps, runs on Node 18+ everywhere                   |
| Trust it with your history                 | pisesh writes only two small JSON files (favorites + overrides); session jsonl files are read-only |

## Getting started

### Quick install (recommended)

```bash
# Install both the CLI and the /sesh slash command in one go
pi install npm:pisesh
```

This registers pisesh as a pi extension. Inside any pi session, type `/sesh`.

### Standalone CLI only

```bash
npm install -g pisesh
pisesh
```

Use this if you want pisesh as a separate shell command and don't need the pi slash binding.

### From source (developers)

```bash
git clone https://github.com/Blue-B/pisesh.git
cd pisesh
npm link            # symlink ./bin/pisesh into your global PATH
pisesh --help
```

Pi-extension side: drop `extensions/sesh.ts` into `~/.pi/agent/extensions/` and run `/reload` inside pi.

## Keys

| Key                          | Action                                                       |
| ---------------------------- | ------------------------------------------------------------ |
| `↑` `↓` / `j` `k`            | move cursor                                                  |
| `Tab` / `h` / `l`            | switch tab (`★ Favorites` → `Today` → `Here` → `All`)         |
| `f` / `Space`                | star / unstar the selected session                           |
| `Enter`                      | resume the session; runs `pi --session <id>` in its (or the overridden) cwd |
| `e`                          | edit name: set a custom display title, shown with `✎` in the list |
| `p`                          | edit cwd with an arrow-key directory browser; sets the resume / `Here` dir |
| `d`                          | session details (full prompt, file, byte size, timestamps)   |
| `/`                          | search by id / project / first user prompt / custom title    |
| `Esc`                        | clear search first, then quit                                |
| `q` / `Ctrl-C`               | quit (terminal restored)                                     |
| `r`                          | rescan session files (after pi starts a new session)         |
| `c` (in details view)        | copy session id to clipboard (clip.exe / pbcopy / xclip)     |
| `Home` `End` `PgUp` `PgDn`   | jump to top / bottom / ±10                                   |

## CLI (non-TUI) usage

For scripts and automation:

```bash
pisesh --list                  # print starred session IDs (one per line)
pisesh --json                  # full favorites file as JSON
pisesh --star <partial-uuid>   # star a session from a script
pisesh --unstar <partial-uuid> # unstar
pisesh --help
```

## Tech Stack

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/) [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000)](https://developer.mozilla.org/docs/Web/JavaScript) [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![pi](https://img.shields.io/badge/pi--coding--agent-5C4EE5?style=for-the-badge)](https://github.com/earendil-works/pi)

| Area                | Details                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| Runtime             | Node.js ≥ 18 (uses only built-in modules: `fs`, `path`, `os`, `child_process`, `readline`)       |
| TUI rendering       | Raw ANSI escape sequences (no `blessed` / `ink` / `chalk` dependency)                            |
| Alt screen buffer   | `\x1b[?1049h` / `\x1b[?1049l`, the same primitive `vim`, `less`, `htop`, and droid CLI use         |
| Input               | Node's `readline.emitKeypressEvents` in raw mode                                                 |
| Width calculation   | UAX #11 East Asian Width ranges, compressed to ~10 inline range checks                           |
| Pi extension        | TypeScript factory using `@earendil-works/pi-coding-agent` extension API (`ui.custom`, `tui.stop`) |
| Storage             | Two JSON files: `~/.pi/agent/favorites.json` (starred ids) + `~/.pi/agent/pisesh-meta.json` (per-session title / cwd overrides) |
| Session discovery   | Direct filesystem scan of `~/.pi/agent/sessions/<projectSlug>/*.jsonl`; first 96 KB parsed       |
| Process model       | Slash command pauses pi's TUI, spawns pisesh with inherited stdio, restarts pi on exit           |

### What it explicitly does **not** depend on

- No `npm install` for the bundled CLI runtime; it's genuinely zero-dependency
- No native binaries / GPU / ffmpeg / database
- No network calls, no telemetry, no analytics
- No daemon / background process

## Storage

| What       | Where                                                       |
| ---------- | ----------------------------------------------------------- |
| Favorites  | `~/.pi/agent/favorites.json`                                |
| Overrides  | `~/.pi/agent/pisesh-meta.json` (per-session custom title / cwd, keyed by session id) |
| Sessions   | `~/.pi/agent/sessions/<projectSlug>/<timestamp>_<uuid>.jsonl` (pi's native layout; pisesh never writes here) |

Favorites file shape:

```json
{
  "ids": [
    "019e79b9-d2c1-741f-81ea-1dcad9a2d712",
    "019e6355-9957-7a30-b4ce-b9db5e3c9ac6"
  ],
  "updated": "2026-05-31T01:33:21.234Z"
}
```

It's a single global file (not per-project). Back it up by syncing one file.

## CJK-aware rendering

Korean / Chinese / Japanese / fullwidth characters render **2 cells wide** in terminals; pisesh measures display width (not JavaScript code-unit length) when truncating and padding. Korean prompts never wrap, columns stay aligned, and the layout looks identical whether the prompt is `hello world` or `안녕하세요 세상`.

```text
✓ webapp          로그인 폼 만들고 인증 엔드포인트 연결…
✓ 가계부앱         이번 달 지출 분석 화면 설계…
✓ docs-site       시작하기 가이드 다시 작성…
```

(Previously: Korean prompts overflowed to a second line and broke the table.)

## Requirements

- **Node.js ≥ 18** (uses optional chaining and `for…of` on strings, so no transpile step)
- A terminal with ANSI escape and alternate screen buffer support, which covers basically every modern emulator:
  - Windows: **Windows Terminal**, **WezTerm**, **Alacritty** ✅
  - macOS: **iTerm2**, **Terminal.app**, **WezTerm**, **Alacritty**, **Kitty** ✅
  - Linux: **GNOME Terminal**, **Konsole**, **xterm**, **Alacritty**, **Kitty** ✅
- [`pi`](https://www.npmjs.com/package/@earendil-works/pi-coding-agent) on `$PATH` for the `Enter`-to-resume action

## Contributing

```bash
git clone https://github.com/Blue-B/pisesh.git
cd pisesh
npm link
npm test        # node --check + smoke test
```

Branch from `main` with a short-lived `feature/<scope>` or `fix/<scope>`, then squash-merge back.
Commits: [Conventional Commits](https://www.conventionalcommits.org/) style (`feat:`, `fix:`, `docs:`, `chore:`).

Open a PR. The CI matrix runs on Ubuntu, macOS, and Windows across Node 18, 20, and 22.

## Support

If pisesh saves you context-switching time or just makes pi nicer to live in, supporting it directly accelerates development:

- Your support helps: bug fixes, new keybindings, more search modes, integration with other pi extensions.
- Transparency: I don't sell data; funds go to development time and a coffee or two.
- One-time sponsors are credited in README and release notes (opt-out available).
- Monthly sponsors ($3/mo via GitHub Sponsors) get best-effort priority triage for "Sponsor Request" issues.

[![GitHub Sponsors](https://img.shields.io/badge/Sponsor-GitHub-EA4AAA?style=for-the-badge&logo=github-sponsors&logoColor=white)](https://github.com/sponsors/Blue-B) [![Buy Me A Coffee](https://img.shields.io/badge/One%E2%80%91time_$3-Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=000)](https://buymeacoffee.com/beckycode7h) [![PayPal](https://img.shields.io/badge/Donate-PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://www.paypal.com/ncp/payment/ZEWFKDX595ESJ)

## Acknowledgments

- [pi-coding-agent](https://github.com/earendil-works/pi) by [@mariozechner](https://github.com/mariozechner), the agent and extension API that make `/sesh` possible.
- [interactive-shell example extension](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/examples/extensions/interactive-shell.ts), the pattern reference for the `ui.custom` + `tui.stop` TTY handoff.
- Inspiration for the favorites + tabs UX: [droid CLI](https://github.com/factory-ai/droid) and tmux's [sesh](https://github.com/joshmedeski/sesh).

## License

MIT © [Blue-B](https://github.com/Blue-B). See [LICENSE](LICENSE).

The pi extension uses the `@earendil-works/pi-coding-agent` API; check pi's own license for that side. The CLI binary is pure Node and has no other licenses to worry about.
