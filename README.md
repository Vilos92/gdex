# gdex

Desktop viewer for [dex](https://dex.rip/) tasks. Tauri + Preact + Vanilla Extract.

## Development

```sh
bun run tauri dev
```

`bun run dev` is Vite only (started by Tauri internally). Do not open http://localhost:1420 in a browser — use the desktop window from `tauri dev`.

## Validation

```sh
bun run check
bun run typecheck
bun run fallow:audit
```

Rust changes: `bun run fmt:rust:check` and `bun run clippy`.
