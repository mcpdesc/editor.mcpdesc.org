# Contributing to editor.mcpdesc.org

Thanks for helping improve the hosting for the **MCP Description Editor** at
[editor.mcpdesc.org](https://editor.mcpdesc.org). This repository is **hosting only** — it
consumes a portable editor build and overlays hosting concerns (security headers and
optional analytics), then deploys to Cloudflare Pages.

> **No editor logic here.** All editor changes belong upstream in
> [`cisco-open/mcptoolkit-editor`](https://github.com/cisco-open/mcptoolkit-editor). See
> [AGENTS.md](./AGENTS.md) for the full golden rules.

## License of contributions

By submitting a contribution you agree that it is licensed under **Apache-2.0** — the same
terms this repository ships under ("inbound = outbound"). See [LICENSE](./LICENSE).

Copyright in your contribution remains with you or with the organization that legally owns
it. **No CLA**, **no copyright assignment**, and **no Developer Certificate of Origin (DCO)
sign-off** are required; a `Signed-off-by` line is **not** required. The project does not
centralize copyright, and Git preserves the authorship history. Files do **not** need a
per-file copyright header or SPDX identifier.

Please **do not** submit content you are not authorized to publish, and **do not** remove or
alter third-party copyright or license notices.

## Local development

```bash
npm ci
npm run build      # consumes the portable editor build → dist/
npm run preview    # serves dist/ locally
```

Analytics is **disabled by default**. See `.env.example` and [README.md](./README.md).

## Ground rules

1. **No editor logic here.** Do not fork, patch, or reimplement editor behavior; contribute
   editor changes upstream instead.
2. **Analytics is off by default.** Only inject Plausible when `ANALYTICS_ENABLED=true`, and
   never track editor document content.
3. **Keep the output static.** `dist/` must deploy to Cloudflare Pages with no backend.

## Pull requests

- Open an issue to discuss non-trivial changes first.
- Keep changes focused; run `npm run build` before opening a PR — it must succeed and produce
  `dist/index.html`.
- Be respectful — see the [Code of Conduct](CODE_OF_CONDUCT.md).
- Report security issues privately — see [SECURITY.md](SECURITY.md).
