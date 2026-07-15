# AGENTS.md

Guidance for AI agents and human contributors working in this repository.

## What this repo is

**Hosting only** for the MCP Description Editor at `editor.mcpdesc.org`. It consumes a portable editor build and overlays hosting concerns, then deploys to Cloudflare Pages.

## Golden rules (do not violate)

1. **No editor logic here.** Do not fork, patch, or reimplement editor behavior. All
   editor changes belong upstream in
   [`cisco-open/mcptoolkit-editor`](https://github.com/cisco-open/mcptoolkit-editor).
   This repo only: consumes a build, adds headers, optionally injects analytics.
2. **Analytics is off by default.** Only inject Plausible when `ANALYTICS_ENABLED=true`.
   Never track editor document content — the injected script does pageviews only.
3. **Keep upstream host-neutral.** Anything mcpdesc.org-specific (domain, analytics,
   branding, headers) lives here, never in the editor repo.
4. **Keep the output static.** `dist/` must deploy to Cloudflare Pages with no backend.

## Consuming the editor build

- Preferred: the published `@cisco_open/mcptoolkit-editor-dist` package.
- Interim/dev: a local editor `dist/` via `EDITOR_DIST_DIR`.
- The build resolves these in `scripts/build.mjs`. Do not hardcode paths.

## Before you commit

```bash
npm run build   # must succeed and produce dist/index.html
```

## License and contributions

Apache-2.0 (`LICENSE`). Contributions are inbound = outbound under Apache-2.0. There is **no
CLA, no copyright assignment, and no DCO sign-off** (no `Signed-off-by` line), and files do
**not** carry per-file copyright headers or SPDX identifiers. See
[CONTRIBUTING.md](./CONTRIBUTING.md).
