# Changelog

All notable changes to the hosting of the MCP Description Editor are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-07-21

### Added

- `overlay/robots.txt` allowing all crawlers and AI bots (no `Sitemap:` entry —
  the editor is a single-page app).
- `overlay/llms.txt` describing the site for LLMs, with links to the live editor,
  the upstream editor source, the hosting repo, and related MCP resources.

## [0.1.1] - 2026-07-20

### Changed

- Updated the Plausible analytics injection to Plausible's current script snippet
  (an `async` site-specific `pa-*.js` script plus an inline `plausible.init()`),
  injected at the top of `<head>`.
- `PLAUSIBLE_SRC` now defaults to the site-specific hosted script
  (`https://plausible.io/js/pa-ui2MvTKAF9Y_RM1N1h2LS.js`).
- Allowed the inline init under the strict CSP via a build-computed SHA-256
  `script-src` hash, so no `'unsafe-inline'` is required.

### Removed

- Dropped the now-unused `PLAUSIBLE_DOMAIN` env var; the new script format
  identifies the site by its script file rather than a `data-domain` attribute.

## [0.1.0] - 2026-07-14

### Added

- Initial hosting scaffold for the MCP Description Editor at `editor.mcpdesc.org`.
- Build script (`scripts/build.mjs`) that consumes the published portable editor
  build `@cisco_open/mcptoolkit-editor-dist` (or a local `EDITOR_DIST_DIR`) and
  overlays hosting concerns.
- Security headers overlay (`overlay/_headers`) including a strict
  Content-Security-Policy, validated against the self-hosted editor + Plausible
  (editor mounts with zero CSP violations; no runtime CDN requests).
- Optional, build-time Plausible analytics injection (off by default).
- Optional manual Cloudflare Pages deploy workflow.

### Verified

- Built against `@cisco_open/mcptoolkit-editor-dist@1.1.0-rc.2`: the editor loads
  fully (Monaco, cards preview, validation) with **no CDN/external requests**, and
  survives the strict CSP.
