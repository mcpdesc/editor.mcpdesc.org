# Security Policy

## Reporting a vulnerability

This repository hosts a **static website** with no backend — it consumes a portable build of
the MCP Description Editor and overlays hosting concerns. Still, if you discover a security
issue — for example a content injection vector, a dependency vulnerability, or a
misconfiguration in the deployment or security headers — please report it responsibly.

- **Do not** open a public issue for security-sensitive reports.
- Email [security@mcpdesc.org](mailto:security@mcpdesc.org), or use GitHub's private
  [security advisories](https://docs.github.com/en/code-security/security-advisories) on this
  repository.

Please include:

- A description of the issue and its potential impact.
- Steps to reproduce, if applicable.
- Any relevant URLs, request/response details, or configuration.

## Scope

In scope:

- This repository's hosting code, configuration, and deployment (Cloudflare Pages, the
  security headers in `overlay/_headers`, and the build in `scripts/build.mjs`).
- The optional analytics injection.

Out of scope:

- Bugs in the editor itself. The editor is maintained upstream in
  [`cisco-open/mcptoolkit-editor`](https://github.com/cisco-open/mcptoolkit-editor); report
  editor issues there.

## Supported versions

The live site is built from the `main` branch. Only `main` is supported.
