# Agent notes

Living conventions for this repo. Ask whether new habits belong here vs `README.md`.

## Bun

- **Bun-first** for installs and scripts (`bun install`, `bun run …`, `bun x …`). Prefer Bun equivalents when upstream docs use npm/pnpm/npx. Run **`bun install`** after pulling.

## TypeScript

- Prefer **`type` over `interface`** unless you need declaration merging (we do not).
- Prefer **`undefined` over `null`**. Model absence as `undefined`; Zod **`.optional()`**, not **`.nullable().optional()`**. No `?? null` unless a contract requires `null`.
- **`??` vs `||`:** **`??`** for nullish default only; **`||`** for booleans / deliberate truthiness. Empty-string-as-absent → named helper, not `value || fallback`.
- No **`x ?? undefined`** when `x` is already `T | undefined` without `null`.
- **Exports:** module-private until another file imports (or we ship a stable public API).
- **`?` vs `| undefined`:** optional props (`prop?:`) for wide/omitted keys; internal call sites use required `prop: T | undefined`. **Exception:** DOM-style props (`class?`, etc.) stay optional—omit at call sites when unused.
- **Readonly arrays** for read-only / pass-through data (`readonly T[]` or named aliases like `Workspaces`).

## Imports

- **`@/*` → `./src/*`**. No relative imports between `src/` files; no **`.ts` / `.tsx`** suffixes on paths.
- **`App.tsx`** at `src/` root; **`views/`**, **`components/`**, **`hooks/`**, **`schemas/`**, **`lib/`**, **`styles/`** (not `src/app/`).
- **`components/`:** one subfolder per slice; colocate **`*.css.ts`**; import the file via **`@/`** (not the folder). Icons → **`components/icons/`**; shared styles → **`src/styles/`**.

## Preact components

- Props type **`{ComponentName}Props`** under **Types.**; not inline on the component. **`PropsWithChildren<{ … }>`** when needed.
- **`class?: string`** — omit when unused; prefer Vanilla Extract `class={styles.foo}`.

## Preact signals (`@preact/signals`)

- **Signals** for frequent updates without broad re-renders (e.g. column drag styling).
- **`useState`** for local UI in one component.
- **Zustand** for cross-view session state—not per-frame drag writes.

## Vanilla Extract

- **`*.css.ts`** colocated with UI; shared tokens/globals/patterns under **`src/styles/`** (`tokens.ts`, `global.css.ts`).
- Import globals once from **`main.tsx`** (`@/styles/global.css`).

## File layout (section comments)

`/* Section name. */` blocks, blank line before/after. Top-down: entry first, **Helpers.** last.

**Order** (omit unused; no empty **Types.** / **Helpers.**):

1. **Types.** · **Constants.**
2. **Schemas.** (or inline single-schema in one file)
3. Entry: **Script.** | **Component.** | **Styles.** | **Config.**
4. **Hooks.**
5. **Helpers.**

**Tests:** colocate **`{module}.test.ts`**; **Constants.** (fixtures) → **Tests.** when the file uses section blocks.

## Code style

- Functional style; early returns; small helpers over deep nesting.
- Prefer **`map` / `filter` / `reduce`**; no **`forEach`**—use **`for`…`of`** (or indexed `for`) when imperative.

## Comments

- **Why** over **what**. Short **JSDoc** when the contract is non-obvious.
- In prose, backtick **identifiers** (`invoke`), not section headers.

## Naming

- **Booleans:** predicate prefixes (`is`, `has`, `did`, `should`, `can`, …).
- **Locals:** readable names (`taskId`), not `e` / `x` unless scope is tiny.

## Fail fast

- Throw with a clear message rather than run in a misleading state. Rust command boundaries: **`Result`**, not panic in user-facing paths.

## Tauri

- UI **`src/`**; shell/commands **`src-tauri/`**. **`invoke`** via `@tauri-apps/api/core`; keep command names stable; brief Rust comment on new commands.
- **`bun run build`** = Vite bundle only; desktop packaging = Tauri CLI (`README.md`).

## Rust

- **`rust-toolchain.toml`** pins channel + **rustfmt** / **clippy** (keep in sync with `.github/actions/install-rust`).
- Touching **`src-tauri/`**: **`bun run fmt:rust:check`** and **`bun run clippy`** (`-D warnings`). No custom **`clippy.toml`** yet—document any future **`allow`** here.

## Validation

**When:** large or high-impact diff (`src/`, `src-tauri/`, `vite.config.ts`, capabilities); before commit.

**Loop** (stop on first failure):

1. `bun run check`
2. `bun run typecheck`
3. `bun run fallow:audit` (CI: `--base` on PRs; see workflow)
4. **`bun run fmt:rust:check`** then **`bun run clippy`** — only if the diff touches **`src-tauri/`**, **`rust-toolchain.toml`**, or **`src-tauri/Cargo.{toml,lock}`**

Skip step 4 on TS-only work. Clippy is slow; run it after substantive Rust edits or when fixing a Rust CI failure.

**CI job → local command:**

| Job           | Local                    |
| ------------- | ------------------------ |
| `fmt`         | `bun run fmt:check`      |
| `lint`        | `bun run lint:ci`        |
| `typecheck`   | `bun run typecheck`      |
| `fallow`      | `bun run fallow:audit`   |
| `rust-fmt`    | `bun run fmt:rust:check` |
| `rust-clippy` | `bun run clippy`         |

**Builds** workflow (`builds.yaml`): macOS **`.app`** on push to **`main`**, PRs, and **workflow_dispatch** — `bun run tauri build -- --bundles app` (no DMG on CI). **`install-rust`** needs **`tauri-deps: true`** only on **`rust-clippy`**, not **`rust-fmt`**.

**Fallow:** fix, **`entry`** in **`.fallowrc.jsonc`**, or delete—no greenwash. Ask the human before permanent ignores or baselines. **`bun run fallow:audit`** only (not **`fallow-rs/fallow@v2`**). Baselines **`dupes-baseline.json`** / **`health-baseline.json`** are versioned; refresh with **`fallow dupes --save-baseline`** / **`fallow health --save-baseline`** after human review—not by default when audit fails.
