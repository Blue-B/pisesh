# pisesh

> **Bookmark, search, and resume your [pi](https://github.com/earendil-works/pi-coding-agent) sessions with a fast keyboard-driven TUI.**

```text
┌─ pisesh ─────────────────────────────────────────────────┐
│ [★ Favorites]  [Today]  [All]                            │
├──────────────────────────────────────────────────────────┤
│ ★ 05/31 01:33  root          [NOW] 팔림시스트 secret …   │
│   05/31 01:30  root                여태 컴퓨터가 꺼진 …   │
│ ▶ 05/30 22:33  aitapps             지금 디렉토리에 앱 …   │
│ ★ 05/30 22:13  root                LINE-TRANSLATOR …     │
│   05/30 21:58  instareal           릴스자동화 글귀 5편 …  │
│   05/30 19:18  WhisperSubTrans     이슈 #26 …             │
├──────────────────────────────────────────────────────────┤
│ ↑↓ move  Tab tab  f star  Enter resume  / search  q quit │
└──────────────────────────────────────────────────────────┘
```

## Why

pi accumulates *a lot* of sessions across many cwds. The built-in `pi --resume` shows them, but offers no way to **mark the important ones** or jump back later. After a week you have 50+ sessions, no idea which is which, and scrolling is painful.

**pisesh** is a tiny, zero-dependency TUI that:

- ⭐ **Stars** sessions you want to keep handy
- 🔎 **Searches** id / project / first user prompt with `/`
- 🕒 Shows **Today** vs **All** in tabs
- 🎯 Marks the **`[NOW]`** session if you launched from inside pi
- ⌨️ Runs on the **alternate screen buffer** — exit and your terminal is exactly where you left it (like `less`, `vim`, `htop`, droid CLI)
- 🚀 **One Enter** spawns `pi --session <id>` in the original cwd

Single-file Node script, no `npm install` for runtime, ~600 lines.

## Install

### As a standalone CLI

```bash
npm install -g pisesh
pisesh
```

That's it. The `pisesh` binary scans `~/.pi/agent/sessions/` and serves you a picker.

### As a pi slash command (`/sesh`)

```bash
# Inside any pi session, just once:
pi install npm:pisesh

# Reload extensions in the current pi:
/reload
```

Now `/sesh` opens pisesh **inside pi**. Pick a session, hit Enter, work in it, `q` when done — you'll pop back to the pi session you launched from.

> **How it works:** the `/sesh` slash command pauses pi's TUI via `ui.custom()` + `tui.stop()`, spawns `pisesh` with `stdio: "inherit"`, and re-renders pi when pisesh exits. Same trick the [interactive-shell](https://github.com/earendil-works/pi-coding-agent/blob/main/examples/extensions/interactive-shell.ts) example extension uses.

## Keys

| Key                 | Action                                                     |
| ------------------- | ---------------------------------------------------------- |
| `↑` `↓` / `j` `k`   | move cursor                                                |
| `Tab` / `h` `l`     | switch tab (`★ Favorites` → `Today` → `All`)               |
| `f` / `Space`       | star / unstar the selected session                         |
| `Enter`             | resume (spawns `pi --session <id> --session-dir <dir>`)    |
| `d`                 | session details (full prompt, file path, size, timestamps) |
| `/`                 | search by id / project / first prompt                      |
| `Esc`               | clears search (one-step back) then quits                   |
| `q` / `Ctrl-C`      | quit (terminal is restored byte-for-byte)                  |
| `r`                 | rescan session files                                       |
| `c` (details only)  | copy session id to clipboard (clip.exe / pbcopy / xclip)   |
| `Home` `End` `PgUp` `PgDn` | jump to top / bottom / ±10                          |

## CLI (non-TUI) usage

```bash
pisesh --list                  # print starred session IDs (one per line)
pisesh --json                  # full favorites file as JSON
pisesh --star <partial-uuid>   # star by partial id from a script
pisesh --unstar <partial-uuid>
pisesh --help
```

## Storage

| What       | Where                                      |
| ---------- | ------------------------------------------ |
| Favorites  | `~/.pi/agent/favorites.json`               |
| Sessions   | `~/.pi/agent/sessions/<projectSlug>/*.jsonl` (pi's native layout) |

pisesh **only writes the favorites file**. Session files are read-only to pisesh — your pi history is never modified.

## CJK-aware

Korean / Chinese / Japanese characters render 2 cells wide in terminals; pisesh measures display width (not code units) when truncating and padding, so columns stay aligned and rows never wrap.

## Requirements

- Node **≥ 18**
- A terminal that supports ANSI escapes + the alternate screen buffer (basically any modern one: iTerm, Windows Terminal, Alacritty, Kitty, GNOME Terminal, …)
- [`pi`](https://www.npmjs.com/package/@earendil-works/pi-coding-agent) on `$PATH` for the `Enter`-to-resume action

## License

MIT © [Blue-B](https://github.com/Blue-B)
