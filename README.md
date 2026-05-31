# pisesh

**English** | [한국어](docs/README.ko.md)

[![npm](https://img.shields.io/npm/v/pisesh?style=for-the-badge&logo=npm&color=CB3837&logoColor=white)](https://www.npmjs.com/package/pisesh)
[![ci](https://img.shields.io/github/actions/workflow/status/Blue-B/pisesh/ci.yml?branch=main&style=for-the-badge&logo=github-actions&logoColor=white&label=CI)](https://github.com/Blue-B/pisesh/actions/workflows/ci.yml)
[![license](https://img.shields.io/github/license/Blue-B/pisesh?style=for-the-badge&color=blue)](LICENSE)
[![node](https://img.shields.io/badge/node-%E2%89%A518-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![deps](https://img.shields.io/badge/dependencies-0-brightgreen?style=for-the-badge)](package.json)

**Bookmark, search, and resume [pi coding-agent](https://github.com/earendil-works/pi-coding-agent) sessions with a fast keyboard-driven TUI.**

> `pi --resume` lists every session you ever started. After a week that's 50+ entries with no titles, no tags, no order — just scroll and pray. **pisesh** adds the one thing that was missing: ⭐ favorites, instant search, and a `[NOW]` badge for the session you're attached to.

## Preview

<p align="center">
  <img src="assets/preview.png" alt="pisesh — Favorites tab in a real Windows Terminal session" width="100%">
</p>

<p align="center"><sub>Real capture: ★ starred session at the top, the rest available behind the <b>Today</b> and <b>All</b> tabs. <code>Tab</code> cycles. <code>f</code> stars. <code>Enter</code> resumes.</sub></p>

## Why pisesh

Pi accumulates sessions across many working directories — your home, several project dirs, scratch tmux panes. The built-in resume picker is alphabetical-ish and forgets context. After a few weeks:

- You can't tell which session was "the one where you fixed the auth bug"
- You can't pin the 3-4 long-running threads you keep going back to
- You re-open the wrong session and pollute it with unrelated context
- You waste time searching by timestamp guessing

pisesh is a **single-file Node script** (no dependencies, ~600 LoC) that gives you everything `pi --resume` doesn't.

### Value at a glance

| Need                                       | What you get                                                                 |
| ------------------------------------------ | ---------------------------------------------------------------------------- |
| Mark important sessions                    | ⭐ Star/unstar with one keystroke; favorites persist to one global JSON       |
| Find a session by what you said            | `/` searches id + project + first user prompt                                |
| Know which session you're attached to      | `[NOW]` badge on the live session (passed from pi via env var)               |
| Keep your terminal clean                   | Alt-screen buffer — exit restores your terminal byte-for-byte (like vim)     |
| Read Korean / Chinese / Japanese prompts   | Display-width-aware truncation; columns never blow up on CJK                 |
| Open from anywhere                         | Run as standalone `pisesh` shell command, or `/sesh` inside pi               |
| Zero install pain                          | No build step, no native deps, runs on Node 18+ everywhere                   |
| Trust it with your history                 | pisesh only writes one favorites file; session jsonl files are read-only     |

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
| `Tab` / `h` / `l`            | switch tab (`★ Favorites` → `Today` → `All`)                 |
| `f` / `Space`                | star / unstar the selected session                           |
| `Enter`                      | resume — spawns `pi --session <id> --session-dir <dir>`      |
| `d`                          | session details (full prompt, file, byte size, timestamps)   |
| `/`                          | search by id / project / first user prompt                   |
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

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/) [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000)](https://developer.mozilla.org/docs/Web/JavaScript) [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![pi](https://img.shields.io/badge/pi--coding--agent-5C4EE5?style=for-the-badge)](https://github.com/earendil-works/pi-coding-agent)

| Area                | Details                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| Runtime             | Node.js ≥ 18 (uses only built-in modules: `fs`, `path`, `os`, `child_process`, `readline`)       |
| TUI rendering       | Raw ANSI escape sequences (no `blessed` / `ink` / `chalk` dependency)                            |
| Alt screen buffer   | `\x1b[?1049h` / `\x1b[?1049l` — same primitive as `vim`, `less`, `htop`, droid CLI               |
| Input               | Node's `readline.emitKeypressEvents` in raw mode                                                 |
| Width calculation   | UAX #11 East Asian Width ranges, compressed to ~10 inline range checks                           |
| Pi extension        | TypeScript factory using `@earendil-works/pi-coding-agent` extension API (`ui.custom`, `tui.stop`) |
| Storage             | Single JSON file at `~/.pi/agent/favorites.json` (`{ ids: [...], updated: "iso" }`)              |
| Session discovery   | Direct filesystem scan of `~/.pi/agent/sessions/<projectSlug>/*.jsonl`; first 96 KB parsed       |
| Process model       | Slash command pauses pi's TUI, spawns pisesh with inherited stdio, restarts pi on exit           |

### What it explicitly does **not** depend on

- No `npm install` for the bundled CLI runtime — true zero-dep
- No native binaries / GPU / ffmpeg / database
- No network calls, no telemetry, no analytics
- No daemon / background process

## How resume works

```text
pi (session A)  ── /sesh ──▶  ui.custom + tui.stop()
                              │
                              └─▶ spawn pisesh  (PISESH_CURRENT_SESSION=A)
                                    │  ↑↓ Tab f / Enter on session B
                                    │
                                    └─▶ spawn  pi --session B --session-dir <dir>
                                          │
                                          │  user works in B …
                                          │  user types q / ^D
                                          │
                                    ◀─── inner pi exits, pisesh exits
                              │
                ◀─── tui.start() + requestRender(true)
pi (session A) continues exactly where it was
```

The current pi session is paused, not lost. When you finish with the resumed session, you pop back to A with full state intact.

## Storage

| What       | Where                                                       |
| ---------- | ----------------------------------------------------------- |
| Favorites  | `~/.pi/agent/favorites.json`                                |
| Sessions   | `~/.pi/agent/sessions/<projectSlug>/<timestamp>_<uuid>.jsonl` (pi's native layout — pisesh never writes here) |

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
✓ aitapps         지금 디렉토리에 앱인토스 제출용앱을 만들었는데…
✓ 공모전          신소재 공학 관련 졸업과제 도와줘…
✓ WhisperSubTrans 이슈 #26 이전 버전 아닌가 확인…
```

(Previously: Korean prompts overflowed to a second line and broke the table.)

## Requirements

- **Node.js ≥ 18** (uses optional chaining, `for…of` on strings — no transpile needed)
- A terminal with ANSI escape + alternate screen buffer support — basically every modern emulator:
  - Windows: **Windows Terminal**, **WezTerm**, **Alacritty** ✅
  - macOS: **iTerm2**, **Terminal.app**, **WezTerm**, **Alacritty**, **Kitty** ✅
  - Linux: **GNOME Terminal**, **Konsole**, **xterm**, **Alacritty**, **Kitty** ✅
- [`pi`](https://www.npmjs.com/package/@earendil-works/pi-coding-agent) on `$PATH` for the `Enter`-to-resume action

## Roadmap

| Status | Item                                                                            |
| ------ | ------------------------------------------------------------------------------- |
| ✅     | Tabs, star/unstar, search, alt-screen, CJK width, `[NOW]` badge, pi `/sesh`     |
| 🚧     | `n` / `N` jump to next / previous search match (less-style)                     |
| 🚧     | Highlight matched substring in yellow                                           |
| 🚧     | Filter by `today/yesterday/this-week`                                           |
| 🧠     | Optional summarize first-N user prompts via local model for richer titles       |
| 🧠     | Export starred sessions as a single bundle (share / archive)                    |
| 🧠     | Inline rename / label (`n` to add a custom title that overrides first prompt)   |

PRs welcome for anything in the 🚧 lane.

## Contributing

```bash
git clone https://github.com/Blue-B/pisesh.git
cd pisesh
npm link
npm test        # node --check + smoke test
```

Branching: short-lived `feature/<scope>` or `fix/<scope>` → squash-merge into `main`.
Commits: [Conventional Commits](https://www.conventionalcommits.org/) style (`feat:`, `fix:`, `docs:`, `chore:`).

Open a PR — the CI matrix runs on Ubuntu / macOS / Windows × Node 18 / 20 / 22.

## Support

If pisesh saves you context-switching time or just makes pi nicer to live in, supporting it directly accelerates development:

- Your support helps: bug fixes, new keybindings, more search modes, integration with other pi extensions.
- Transparency: I don't sell data; funds go to development time and a coffee or two.
- One-time sponsors are credited in README and release notes (opt-out available).
- Monthly sponsors ($3/mo via GitHub Sponsors) get best-effort priority triage for "Sponsor Request" issues.

[![GitHub Sponsors](https://img.shields.io/badge/Sponsor-GitHub-EA4AAA?style=for-the-badge&logo=github-sponsors&logoColor=white)](https://github.com/sponsors/Blue-B) [![Buy Me A Coffee](https://img.shields.io/badge/One%E2%80%91time_$3-Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=000)](https://buymeacoffee.com/beckycode7h) [![PayPal](https://img.shields.io/badge/Donate-PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://www.paypal.com/ncp/payment/ZEWFKDX595ESJ)

## Acknowledgments

- [pi-coding-agent](https://github.com/earendil-works/pi-coding-agent) by [@mariozechner](https://github.com/mariozechner) — the agent and its extension API that make `/sesh` possible.
- [interactive-shell example extension](https://github.com/earendil-works/pi-coding-agent/blob/main/examples/extensions/interactive-shell.ts) — pattern reference for `ui.custom` + `tui.stop` TTY handoff.
- Inspiration for the favorites + tabs UX: [droid CLI](https://github.com/factory-ai/droid) and tmux's [sesh](https://github.com/joshmedeski/sesh).

## Contributors

Thanks to everyone who helps make pisesh better! 🙏

<a href="https://github.com/Blue-B"><img src="https://github.com/Blue-B.png?size=80" width="80" alt="Blue-B" title="Blue-B" /></a>

## Repository activity

![Repobeats analytics image](https://repobeats.axiom.co/api/embed/a21cb8addd5d2f0ea4ec229c69da5b23855911a8.svg "Repobeats analytics image")

## Star History

<a href="https://star-history.com/#Blue-B/pisesh&Date">
  <img src="https://api.star-history.com/svg?repos=Blue-B/pisesh&type=Date" alt="Star History Chart" width="600" />
</a>

## License

MIT © [Blue-B](https://github.com/Blue-B). See [LICENSE](LICENSE).

The pi extension uses the `@earendil-works/pi-coding-agent` API; check pi's own license for that side. The CLI binary is pure Node and has no other licenses to worry about.
