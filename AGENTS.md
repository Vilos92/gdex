# Agent notes

Living conventions for this repo. Order and wording can evolve—ask whether new habits belong here.

## Bun

- This repo is **Bun-first**. Use **Bun** for dependency installs, `package.json` scripts, and ad-hoc tooling (`bun install`, `bun run …`, `bunx …` / `bun x …`). Do not reach for npm, pnpm, or npx in instructions or habits unless something in the stack truly requires it.
- When upstream docs show `npm` / `pnpm` / `npx`, prefer the **Bun equivalent** so the workflow stays consistent.
- After pulling remote changes, run **`bun install`** before dev or validation.

## TypeScript

- Prefer **`type` over `interface`** unless you truly need declaration merging (we do not).
- Prefer **`undefined` over `null`**. Model absence as `undefined` in app shapes; use **`.optional()`** in Zod when we add schemas, not **`.nullable().optional()`**. Do not use `?? null` in app code unless a type contract explicitly requires `null` (rare).
- **`??` vs `||`:** use **`??`** to default `null`/`undefined` only. Reserve **`||`** for boolean conditions and deliberate truthiness. Treating `''` as absent belongs in a named helper, not `value || fallback`.
- **Avoid redundant nullish coalescing:** do not write `x ?? undefined` when `x` is already `T | undefined` with no `null`.
- **Exports:** do not export types, functions, or constants unless another file imports them (or we deliberately expose a stable public API). Prefer module-private symbols until then.
- **`?` vs `| undefined`:** use optional properties (`prop?:`) only when callers often omit the key entirely. For **internal** components and modules, prefer required keys with `T | undefined` when a value may be absent.

## Imports

- **`@/*` → `./src/*`** in `tsconfig` `paths`. Import every `src/` module via `@/` (`@/app/App`, `@/styles/tokens`); no relative paths between `src/` files.
- No **`.ts` / `.tsx`** suffixes on import paths (`allowImportingTsExtensions: false`).

## Preact components

- **Props types** are named **`{ComponentName}Props`** (e.g. `TaskListProps` for `TaskList`). Do not type props inline on the component; declare them under **Types.** in the file layout below. With **`children`**, use **`PropsWithChildren<{ … }>`** (other props in the generic object).

## Vanilla Extract

- Styling uses **Vanilla Extract** (`@vanilla-extract/css`, `@vanilla-extract/vite-plugin`)—same stack as **vilos92.com**, not Tailwind.
- Co-locate styles in **`*.css.ts`** next to the UI or under **`src/styles/`** for shared tokens and globals.
- **`tokens.ts`** holds palette and shared constants; **`global.css.ts`** holds `globalStyle` resets; component files export `style()` class names consumed as `class={styles.foo}` in Preact.
- Import global styles once from **`main.tsx`** (side-effect import of `@/styles/global.css`).

## File layout (section comments)

Use `/* Section name. */` blocks. Read top-down: main entry first, **Helpers.** last.

**Order** (omit unused sections; never add empty **Types.** / **Helpers.** blocks):

1. **Types.** · **Constants.** — swap when paths or literals must come first
2. **Schema.** — optional Zod, when we add validation
3. Entry surface (one per file — pick what matches):
   - **Script.** — browser bootstrap (`main.tsx`)
   - **Component.** — Preact UI (`*.tsx` under `src/`)
   - **Styles.** — Vanilla Extract (`*.css.ts`)
   - **Config.** — tooling default export (`vite.config.ts`)
4. **Hooks.** — custom hooks when a file grows past a single component
5. **Helpers.** — private helpers only; always after the entry surface and any UI sections

**Lean files** (one export, few lines): one matching entry block (**Script.**, **Component.**, **Config.**, etc.) is enough.

**Tests:** when we add Vitest, co-locate **`{module}.test.ts`** with the module under test. Use **Constants.** (fixtures) → **Tests.** (`describe` / `test`) inside the file.

Blank line before and after each section block, and between the comment and the code below it.

## Code style

- Prefer a **functional** style: fewer reassignments unless performance or clarity really wins.
- Avoid deep nesting (nested functions × loops × ternaries). Prefer **small helpers** with **early returns**.
- Prefer **array helpers** (`map`, `filter`, `reduce`, etc.) for readability unless hot paths need a hand-tuned loop. **Do not use `forEach`**—use a **`for`…`of`** (or indexed `for`) when you need imperative iteration.

## Comments

- Prefer **why** (intent, tradeoffs, invariants) over **what**; drop comments that only restate the code.
- **JSDoc** on exports and non-trivial helpers when the contract is not obvious—often one crisp line is enough.
- In `//` / `/** */` prose, **backtick code identifiers** (`invoke`, `palette.pageBg`); not section headers (`/* Component. */`).

## Naming

- **Booleans:** prefix with **`is`**, **`has`**, **`should`**, etc. (`isLoading`, `hasSelection`).
- **Locals:** context-readable names (`greetMessage`, `taskId`)—not `e`, `res`, `n`, `x` unless in a tiny scope where the meaning is obvious.

## Fail fast

- Prefer **loud, immediate failure** over letting the app keep running in a **useless or misleading state**. Validate required configuration and Tauri/plugin assumptions **as early as we can**, and **throw** with a clear message when something required is missing or invalid.
- On the Rust side, prefer **`Result`** and explicit errors for command boundaries instead of panicking in user-facing paths.

## Tauri

- Frontend lives under **`src/`**; the native shell and commands live under **`src-tauri/`**.
- Call Rust from the UI via **`invoke`** (`@tauri-apps/api/core`). Keep command names and payloads stable; document new commands in Rust with a short comment on intent.
- Day-to-day desktop dev: **`bun run tauri dev`** (Vite + Tauri). **`bun run build`** is the Vite production web bundle only; Tauri app packaging uses the Tauri CLI separately.

## Rust (Clippy and rustfmt)

**Clippy** is Rust’s built-in linter (like Biome for TS). It catches suspicious patterns, needless clones, bad `Option`/`Result` handling, and APIs that are easy to misuse. We run it with **warnings denied** so anything Clippy flags fails the command.

- **`bun run clippy`** — `cargo clippy` on `src-tauri` with **`-D warnings`** (warnings become errors).
- **`bun run fmt:rust`** — format Rust in place.
- **`bun run fmt:rust:check`** — CI-style “would `cargo fmt` change files?” check.

**rustfmt** is the standard Rust formatter (like Biome format for TS). Use it on every Rust touch before commit; pair with Clippy when `src-tauri/` changes matter.

No custom `clippy.toml` yet—defaults plus `-D warnings`. If we add lint groups or `allow` attributes, document the **why** here.

## Validation

**When:** after a **large diff** or **high-impact** touch (`src/`, `src-tauri/`, `vite.config.ts`, capabilities) and **always before commit**.

**Loop** (shortest → longest; stop on first failure):

1. `bun run check` — Biome format + lint (CI: `fmt:check`, `lint:ci`)
2. `bun run typecheck`
3. `bun run fallow:audit` — dead code, unused exports, baselines (CI passes `--base`; see workflow)
4. **`bun run clippy`** and **`bun run fmt:rust:check`** when `src-tauri/` changes are non-trivial

**CI** (`.github/workflows/continuous-integration.yaml`) runs fmt, lint, typecheck, and fallow in parallel. It does **not** run `bun run build` or Tauri packaging—those stay local or in a release workflow later.

**Findings:** fix—wire code, add or extend **`entry`** in `.fallowrc.jsonc`, or delete. Do not suppress to greenwash.

**Must ignore?** Ask the human first; aim for a healthy codebase, not a quiet audit.

- **Temporary** (follow-up PR): `TODO` + reason; smallest suppression only if needed.
- **Permanent** (e.g. generated export): comment at the ignore explaining why.

No fallow/lint waivers or “reserved for later” files without human approval and that documentation. Do not use **`fallow-rs/fallow@v2`** or Actions cache for **`.fallow/`**—run the lockfile-pinned CLI via **`bun run fallow:audit`**.

## Keeping this file useful

When we lock in a new convention or clarify a recurring detail, ask whether it should be added or tightened in `AGENTS.md`.
