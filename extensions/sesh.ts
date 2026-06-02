/**
 * pisesh slash command
 *
 * Registers `/sesh` inside pi.
 *
 * Behavior:
 *   1. Pauses pi's TUI (releases the terminal)
 *   2. Spawns the external `pisesh` TUI (bookmark/resume picker)
 *   3. When pisesh exits — whether the user resumed a nested session and quit it,
 *      or just pressed `q` — control returns to the original pi session and the
 *      TUI is restored.
 *
 * Companion CLI tool: ~/.pi/bin/pisesh   (single-file Node TUI, no deps)
 * Favorites file:     ~/.pi/agent/favorites.json
 */

import { spawn } from "node:child_process";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

function runPisesh(
	currentSessionId: string | undefined,
): Promise<number | null> {
	return new Promise((resolve) => {
		// stdio:"inherit" hands the real TTY to pisesh. pi's tui.stop() has
		// already detached so this is safe.
		// PISESH_CURRENT_SESSION lets pisesh flag the row that belongs to the
		// pi instance that just spawned it (rendered with a [NOW] badge).
		const child = spawn("pisesh", [], {
			stdio: "inherit",
			env: {
				...process.env,
				// Forward pi's cwd so pisesh's "Here" tab can show only the sessions
				// that belong to the directory this pi instance is attached to.
				PISESH_CWD: process.cwd(),
				...(currentSessionId
					? { PISESH_CURRENT_SESSION: currentSessionId }
					: {}),
			},
		});
		child.on("exit", (code) => resolve(code));
		child.on("error", (err) => {
			// Surface a readable error in the terminal before we re-render.
			process.stdout.write(
				`\x1b[31mpisesh failed to launch: ${err.message}\x1b[0m\n`,
			);
			resolve(127);
		});
	});
}

export default function (pi: ExtensionAPI) {
	pi.registerCommand("sesh", {
		description: "Browse, star, and resume pi sessions (opens pisesh TUI)",
		handler: async (_args, ctx) => {
			if (!ctx.hasUI) {
				ctx.ui?.notify?.("/sesh requires interactive UI", "warning");
				return;
			}

			let currentId: string | undefined;
			try {
				currentId = ctx.sessionManager?.getSessionId?.();
			} catch {
				currentId = undefined;
			}

			const code = await ctx.ui.custom<number | null>(
				(tui, _theme, _kb, done) => {
					// Hand over the terminal
					tui.stop();
					process.stdout.write("\x1b[2J\x1b[H");

					runPisesh(currentId).then((exitCode) => {
						// Restore pi's TUI
						tui.start();
						tui.requestRender(true);
						done(exitCode);
					});

					// Return a no-op component (custom() requires one synchronously)
					return { render: () => [], invalidate: () => {} };
				},
			);

			if (code === 0 || code === null) {
				ctx.ui.notify("Returned from pisesh", "info");
			} else if (code === 127) {
				ctx.ui.notify("pisesh not found on PATH", "error");
			} else {
				ctx.ui.notify(`pisesh exited with code ${code}`, "warning");
			}
		},
	});
}
