<!-- Thanks for sending a PR! Please run through the checklist below. -->

## Summary

<!-- One paragraph: what does this change and why. -->

## Type of change

- [ ] 🐛 Bug fix (non-breaking)
- [ ] ✨ New feature (non-breaking)
- [ ] 💥 Breaking change (existing keybind / CLI flag / file format changes)
- [ ] 📝 Docs / README only
- [ ] 🧹 Refactor / chore (no behavior change)

## Related issue

<!-- e.g. Closes #12 / Refs #34. If no issue exists, briefly justify. -->

## How to test manually

```bash
# Commands a reviewer can run to verify
pisesh
# Press …  Expected …
```

## Screenshots (UI changes)

<!-- Drag in a before/after screenshot when changing the TUI layout, colors,
     or any visible output. -->

## Checklist

- [ ] `node --check bin/pisesh` passes locally
- [ ] `node bin/pisesh --help` runs without error
- [ ] Tested on at least one of: Windows Terminal, iTerm2, GNOME Terminal, Alacritty
- [ ] Tested with CJK text (Korean / Japanese / Chinese) in session prompts
- [ ] Updated `README.md` if user-visible behavior changed
- [ ] Updated `CHANGELOG.md` under `[Unreleased]`
- [ ] Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/)
- [ ] No new runtime dependencies (pisesh is zero-dep by design)
