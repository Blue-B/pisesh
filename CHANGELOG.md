# Changelog

All notable changes to this project will be documented in this file.

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
