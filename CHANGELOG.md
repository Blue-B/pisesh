# Changelog

All notable changes to this project will be documented in this file.

## [0.1.11] - 2026-07-14

### Fixed
- `/sesh` now launches the CLI bundled with the pi package instead of requiring `pisesh` on the user's `PATH`.
- Clarified that the standalone `pisesh` shell command requires `npm install -g pisesh`.

## [0.1.10] — 2026-06-09

### Fixed
- **Resume no longer crashes on sessions interrupted mid-tool-call.** If a session ended while a tool call was still in flight (e.g. an image generation cut off by a usage limit or a closed window), its transcript held a tool call with no recorded result. On resume, pi would re-fire that dead tool and the spawned process could exit non-zero — surfacing as `pisesh exited with code 1`, repeatedly. `resumeSession` now heals the target session first: every orphaned tool call gets a synthetic `[interrupted]` result injected before pi is spawned, so the resumed history is always well-formed and no dead tool is re-run. Idempotent, never throws, and writes a one-time `.bak-orphanheal` backup of the session before modifying it.

## [0.1.9] — 2026-06-03

### Fixed
- Name / cwd editor (`e`) now has a real caret. Arrow keys (and `Home` / `End`) move inside the text you already typed, so you can insert or delete in the middle instead of only at the end. Backspace, forward `Delete`, and inserts all act at the caret. Cursor moves by whole code points, so CJK and emoji never get split.

## [0.1.4] — 2026-06-03

### Added
- **`Here` tab** — filters the list to sessions whose effective cwd matches the directory pisesh was launched from. Tab order is now **★ Favorites → Today → Here → All**.
- **Inline rename (`e`)** — set a custom display title that overrides the first-prompt label; renamed sessions are marked with a cyan `✎` in the list.
- **Edit cwd (`p`)** — arrow-key directory browser to re-point the working directory pi resumes into (also drives the `Here` filter).
- Per-session overrides (custom title / cwd) persist to `~/.pi/agent/pisesh-meta.json`, keyed by session id. Session jsonl files remain read-only.
- README terminal screenshots for the list view, rename panel, and cwd browser.

## [0.1.0] — 2026-05-31

Initial release.

### Added
- `pisesh` CLI binary — keyboard-driven TUI that lists every pi session under `~/.pi/agent/sessions/`
- Tabs: **★ Favorites**, **Today**, **All**
- Star / unstar with `f` or Space; favorites persist to `~/.pi/agent/favorites.json`
- Search across id / project / first user prompt with `/`
- Session details view (`d`): full prompt, file path, byte size, timestamps
- `Enter` resumes the selected session via `pi --session <id> --session-dir <dir>` in the original cwd
- `[NOW]` badge marks the session belonging to the pi instance that spawned pisesh (set via `PISESH_CURRENT_SESSION` env var)
- Alternate screen buffer (`\x1b[?1049h`) — exit restores terminal byte-for-byte; no scrollback pollution
- CJK-aware truncation and padding (Hangul / CJK ideographs / emoji counted as 2 cells)
- Signal handlers (`SIGINT`, `SIGTERM`, `exit`) restore cursor + main buffer on unexpected exit
- Non-TUI CLI: `--list`, `--json`, `--star <id>`, `--unstar <id>`, `--help`
- Pi extension at `extensions/sesh.ts` — registers `/sesh` slash command which spawns pisesh inside pi via `ui.custom` + `tui.stop()`
