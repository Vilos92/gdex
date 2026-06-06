# gdex

Desktop viewer for [dex](https://dex.rip/) tasks. Tauri + Preact + Vanilla Extract.

## Keyboard shortcuts

Navigate from the task list or detail pane. **`⌘`** is Command on macOS and Control on Windows/Linux.

| Key | Action |
| --- | ------ |
| **j** / **↓** | Next task |
| **k** / **↑** | Previous task |
| **l** / **→** | Open subtasks *(task list focus)* |
| **h** / **←** | Up one level |
| **Backspace** | Leave detail pane, then up one level |
| **⌘⇧]** | Next workspace |
| **⌘⇧[** | Previous workspace |
| **⌘B** | Toggle sidebar |
| **⌘⌥T** | Cycle theme *(light → dark → auto)* |
| **Esc** | Close Quick prompts menu |

Hold **j** or **k** (or the arrow keys) to move continuously. Shortcuts are ignored while typing in a field, while focus is in the workspace sidebar, or while Quick prompts is open.

## Development

```sh
bun install
bun run tauri dev
```

`bun run dev` is Vite only (started by Tauri internally). Do not open http://localhost:1420 in a browser — use the desktop window from `tauri dev`.

## Build

```sh
bun run tauri build
```

Produces a macOS `.app` and `.dmg` under `src-tauri/target/release/bundle/`. The app shells out to the **`dex`** CLI (and **`node`**, if your `dex` install uses it)—install both and ensure they work when launched from Finder (a **minimal `PATH`**: the system path only, without shell startup files like `.zshrc` or `.bashrc`). If you rely on shell-only setup (nvm, Homebrew hooks, etc.), set **`DEX_BINARY`** to the full path to `dex`.

## Validation

```sh
bun run check
bun run typecheck
bun run fallow:audit
```

Rust changes: `bun run fmt:rust:check` and `bun run clippy`.

## CI

GitHub Actions on every push and PR:

| Workflow | What it does |
| -------- | ------------ |
| **Continuous Integration** | Biome format/lint, typecheck, fallow, Rust fmt, Clippy |
| **Builds** | macOS `bun run tauri build --bundles app` → downloadable **`.app`** artifact (14-day retention) |

**Builds** runs on push to **`main`**, all PRs, and manual **workflow_dispatch**. CI skips DMG bundling (Finder/AppleScript is unreliable on runners). Download artifacts from the workflow run’s **Artifacts** tab.

Agent/coding conventions: **`AGENTS.md`**.
