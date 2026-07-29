# Agent notes

Living conventions for this repo. Ask whether new habits belong here vs `README.md`.

## Bun

- **Bun-first** for installs and scripts (`bun install`, `bun run …`, `bun x …`). Prefer Bun equivalents when upstream docs use npm/pnpm/npx. Run **`bun install`** after pulling.

## TypeScript

- Prefer **`type` over `interface`** unless you need declaration merging (we do not).
- Prefer **`undefined` over `null`**. Model absence as `undefined`; Zod **`.optional()`**, not **`.nullable().optional()`**. No `?? null` unless a contract requires `null`.
- **`??` vs `||`:** **`??`** for nullish default only; **`||`** for booleans / deliberate truthiness. Empty-string-as-absent → named helper, not `value || fallback`.
- No **`x ?? undefined`** when `x` is already `T | undefined` without `null`.
- **Exports:** module-private until another file imports (or we ship a stable public API). Fallow flags unused exports—wire, **`entry`**, or delete (see **Validation**).
- **`?` vs `| undefined`:** optional props (`prop?:`) for wide/omitted keys; internal call sites use required `prop: T | undefined`. **Exception:** DOM-style props (`class?`, etc.) stay optional—omit at call sites when unused.
- **Readonly arrays** for read-only / pass-through data (`readonly T[]` or named aliases like `Workspaces`).

## Imports

- **`@/*` → `./src/*`**. No relative imports between `src/` files; no **`.ts` / `.tsx`** suffixes on paths.
- Use **`import type`** for type-only imports.
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
- **`data-*` attribute variants over class composition.** Encode discrete state (side, pressed, visibility) with `data-` attributes and match them in `selectors` (`'&[data-side="left"]'`, `'&[data-visible="true"]'`). Do not toggle separate BEM modifier classes.
- **Runtime-varying values via `createVar` + `setElementVar`.** CSS variables that change at runtime flow through a `createVar()` in `.css.ts` (default set via `vars: { [myVar]: value }` on the rule) and are updated by `setElementVar` from `@vanilla-extract/dynamic`. The static rule stays in `.css.ts`; only the value moves at runtime.
- **Imperative `element.style` is the last resort.** Reach for it only when neither pattern above fits.

## File layout (section comments)

**TypeScript / Vanilla Extract** (`src/**/*.ts`, `*.tsx`, colocated `*.css.ts`): section markers are **multi-line block comments** (sentence-case label + period). Blank line before and after each block, and between the comment and the code below it:

```
/*
 * Types.
 */

type Foo = …;
```

Do **not** collapse these to single-line `/* Types. */` — the TS tree uses the block form above (`TaskDetail.tsx`, `tokens.ts`, `*.css.ts`, etc.). Skip section markers on lean single-export files where they add ceremony only.

**Rust** (`src-tauri/`): **single-line** section markers — `/* Types. */`, `/* Helpers. */`, etc. File-level docs use **`//!`** at the top. Do not use the TS multi-line block form in Rust sources.

Top-down: entry first, **Helpers.** last.

**Order** (omit unused; no empty **Types.** / **Helpers.**):

1. **Types.** · **Constants.** — **Types.** precedes **Constants.** unless a type derives from a constant and declaration order requires the swap
2. **Schemas.** (or inline single-schema in one file) · **Inferred types.** (see **Runtime validation**)
3. **Scratch.** — module-scope state that gets mutated, including a `const` whose properties are mutated; sits directly above the entry section
4. Entry: **Script.** | **Component.** | **Styles.** | **Config.**
5. **Hooks.**
6. **Helpers.**

**Config files** (`vite.config.ts`): **Constants.** → **Config.** (default export). Module-level `const` above the entry; only `function` helpers may follow (hoisting).

**Tests:** colocate **`{module}.test.ts`**; **Constants.** (fixtures) → **Tests.** when the file uses section blocks.

**Test-support modules:** helpers shared across suites cannot be `*.test.ts` files (vitest collects those as suites), so colocate them with their domain as **`{name}.fixture.ts`** (`sampleTasks.fixture.ts`). Fixture modules are reachable only from tests and never ship.

## Code style

- Functional style; early returns; small helpers over deep nesting.
- Prefer **`map` / `filter` / `reduce`**; no **`forEach`**—use **`for`…`of`** (or indexed `for`) when imperative.
- **`noNestedTernary`** and **`useBlockStatements`** are Biome errors—always brace blocks; no nested ternaries.

## Comments

- **Why** over **what**. Drop comments that only restate mechanics the code already shows.
- **State intent positively.** Explain what we do and why, not what we avoid or what could fail. Prefer `// ensures Y` over `// prevents X` when the code already makes X impossible.
- **Layer once.** Put shared why on a constant, type field, or entry closure. Do not repeat the same rationale at every call site.
- **JSDoc** on exports and non-trivial helpers when the contract is not obvious—often one crisp line is enough. Do not document module-private types (see **Exports**).
- In prose, backtick **identifiers** (`invoke`), not section headers.
- Default to **separate sentences** over semicolons or em dashes joining clauses. Either is fine occasionally for a tight parenthetical, but overuse gives the codebase a heavy editorial voice.
- **Balance line widths** in multi-line comments, and never wrap mid-token.
- **A comment carries its own why** — never a pointer to `AGENTS.md` or other contributor docs. Referencing other code (a sibling function, another module) is fine.
- **Section blocks** (see **File layout**) label structure only — no extra explanation inside the marker.

## Naming

- **Booleans:** predicate prefixes (`is`, `has`, `did`, `should`, `can`, …) for locals, props, and fields — not bare adjectives or state nouns (`open` → `isOpen`, `loading` → `isLoading`).
- **Boolean predicates:** name functions that return yes/no so the call reads as a question (`canApplyFilter`, `hasSelection`, `checkIsLongDescription`). Prefer `can` / `has` / `check` / `should` over `getIs…` / `getShould…`—that pattern reads like a property accessor for a stored flag. Reserve **`is` / `has` / …** on functions for type guards only.
- **`compute` / `calc`** for calculated non-boolean results (`computeDueLabel`).
- **Locals:** readable names (`taskId`), not `e` / `x` unless scope is tiny.
- **Name for what a thing is, not where it lives.** When a folder or module already conveys context, do not restate it as an identifier prefix.
- **`.tsx` modules whose entry is a component are PascalCase**, named for the component they export (`TaskDetail.tsx`), and their colocated `.css.ts` matches (`TaskDetail.css.ts`). The `main.tsx` bootstrap is exempt.

## Fail fast

- Throw with a clear message rather than run in a misleading state. Rust command boundaries: **`Result`**, not panic in user-facing paths.
- Avoid plausible-looking placeholders for values the app cannot function without.

## Runtime validation

Untrusted data — `invoke` results, store and file reads, watcher payloads — is parsed once at the trust boundary with **zod** schemas, then flows inward as typed data. Zod is the repo's one schema library; do not introduce another validator.

- **Placement:** a schema with a single consumer colocates in that module under its **Schemas.** section. Schemas imported across files live in **`src/schemas/`**.
- **Every schema value sits in Schemas.** — private sub-schemas included, not just the exported composites. **Constants.** holds only plain values (bounds, value lists) that schemas read.
- **Inferred types live beside their schema**, in the same module, under an **Inferred types.** section directly below **Schemas.** A type derived via `z.infer<typeof fooSchema>` never sits in **Types.** (hand-authored shapes only) or inside the **Schemas.** section.

## Tauri

- UI **`src/`**; shell/commands **`src-tauri/`**. **`invoke`** via `@tauri-apps/api/core`; keep command names stable; brief Rust comment on new commands.
- **`bun run build`** = Vite bundle only; desktop packaging = Tauri CLI (`README.md`).

## Rust

- **`rust-toolchain.toml`** pins channel + **rustfmt** / **clippy** (keep in sync with `.github/actions/install-rust`).
- Touching **`src-tauri/`**: **`bun run fmt:rust:check`** and **`bun run clippy`** (`-D warnings`). No custom **`clippy.toml`** yet—document any future **`allow`** here.
- **Section comments:** single-line `/* Types. */` markers (see **File layout**) — not the TS multi-line block form.

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

**Builds** workflow (`builds.yaml`): macOS **`.app`** on push to **`main`**, PRs, and **workflow_dispatch** — `bun run tauri build --bundles app` (no DMG on CI). **`install-rust`** needs **`tauri-deps: true`** only on **`rust-clippy`**, not **`rust-fmt`**.

**Fallow:** fix, **`entry`** in **`.fallowrc.jsonc`**, or delete—no greenwash. Ask the human before permanent ignores or baselines. **`bun run fallow:audit`** only (not **`fallow-rs/fallow@v2`**). Baselines **`dupes-baseline.json`** / **`health-baseline.json`** are versioned; refresh with **`fallow dupes --save-baseline`** / **`fallow health --save-baseline`** after human review—not by default when audit fails.

## Keeping this file useful

When we lock in a new convention, ask whether it should be added or tightened in `AGENTS.md`.
