# MCP Description Editor — Hosting (`editor.mcpdesc.org`)

This repository **hosts** the MCP Description Editor at
[`editor.mcpdesc.org`](https://editor.mcpdesc.org). It contains **no editor
logic** — it consumes a portable build of the editor and overlays only
hosting-specific concerns (security headers and optional analytics), then deploys the
result to Cloudflare Pages.

This mirrors the Swagger model: the editor is a portable, host-neutral tool that anyone
can deploy anywhere; `mcpdesc.org` is simply one host among many.

- **Editor source (upstream):** [`cisco-open/mcptoolkit-editor`](https://github.com/cisco-open/mcptoolkit-editor)
- **Portable build package:** `@cisco_open/mcptoolkit-editor-dist` (the prebuilt `dist/`)
- **Companion site:** [`mcpdesc/mcpdesc.org`](https://github.com/mcpdesc/mcpdesc.org)

## How it works

`npm run build`:

1. Resolves a portable editor build, in this order:
   - `EDITOR_DIST_DIR` (a local editor `dist/`), else
   - the installed `@cisco_open/mcptoolkit-editor-dist` package.
2. Copies it to `dist/`.
3. Overlays `overlay/` (e.g. `_headers`) into `dist/`.
4. If `ANALYTICS_ENABLED=true`, injects the Plausible script into `dist/index.html`.

The output `dist/` is a self-contained static site ready for Cloudflare Pages.

## Local development

```bash
npm ci
npm run build      # consumes @cisco_open/mcptoolkit-editor-dist
npm run preview    # serves dist/ locally
```

To test against a local, unpublished editor build instead of the npm package,
point `EDITOR_DIST_DIR` at the editor's `dist/`:

```bash
EDITOR_DIST_DIR=../mcptoolkit-editor/dist npm run build
```

## Environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `ANALYTICS_ENABLED` | `false` | Inject Plausible only when `true` (production). |
| `PLAUSIBLE_SRC` | `https://plausible.io/js/pa-ui2MvTKAF9Y_RM1N1h2LS.js` | Site-specific Plausible script (identifies the site; no `data-domain` needed). |
| `EDITOR_DIST_DIR` | _(unset)_ | Local editor `dist/` to consume instead of the npm package. |

Copy `.env.example` to `.env` for local overrides. Analytics stays **off** unless
explicitly enabled.

## Deploy (Cloudflare Pages)

| Setting | Value |
|---------|-------|
| Project name | `mcpdesc-editor` |
| Production branch | `main` |
| Build command | `npm ci && npm run build` |
| Build output directory | `dist` |
| Production domain | `editor.mcpdesc.org` |

Set the production environment variables above (`ANALYTICS_ENABLED=true`, etc.). The
simplest setup is Cloudflare Pages' **Git integration** (build on push). An optional
manual GitHub Actions deploy is provided in `.github/workflows/deploy.yml`.

## Security headers

`overlay/_headers` ships baseline security headers plus a strict Content-Security-Policy.
The CSP was validated against the self-hosted editor build (Monaco loads from same-origin
workers — no runtime CDN) and Plausible; the editor mounts with zero CSP violations. When
analytics is enabled, the build adds a SHA-256 hash for Plausible's inline init script to
`script-src` (so no `'unsafe-inline'` is needed); if you disable analytics, the
`https://plausible.io` allowances are simply unused.

> Plausible also distributes this tracker as an npm module
> ([`@plausible-analytics/tracker`](https://www.npmjs.com/package/@plausible-analytics/tracker)),
> intended to be imported and bundled into an app. This hosting repo does not bundle — it only
> injects a `<script>` tag into the prebuilt editor build — so it uses the hosted script.
> Bundling the npm module would belong upstream in the editor.

## License

Apache-2.0. See [LICENSE](./LICENSE). Contributions are inbound = outbound under Apache-2.0;
there is **no CLA, no copyright assignment, and no DCO sign-off** (no `Signed-off-by` line),
and files do **not** carry per-file copyright headers or SPDX identifiers. See
[CONTRIBUTING.md](./CONTRIBUTING.md).

The editor itself is licensed separately in its upstream repository.
