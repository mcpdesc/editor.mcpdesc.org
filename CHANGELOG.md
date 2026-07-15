# Changelog

All notable changes to the hosting of the MCP Description Editor are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
