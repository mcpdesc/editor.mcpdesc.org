#!/usr/bin/env node

// Build the hosted MCP Description Editor for editor.mcpdesc.org.
//
// This repository does NOT contain editor logic. It consumes a portable editor
// build (the upstream cisco-open/mcptoolkit-editor, shipped as
// @cisco_open/mcptoolkit-editor-dist) and overlays hosting concerns:
//   - security headers (overlay/_headers)
//   - optional Plausible analytics, injected into index.html at build time
//
// Resolution order for the editor build:
//   1. EDITOR_DIST_DIR env var (a local editor `dist/` — handy before the
//      -dist package is published)
//   2. the installed @cisco_open/mcptoolkit-editor-dist package

import {
  existsSync,
  rmSync,
  mkdirSync,
  cpSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const distDir = resolve(root, 'dist');
const overlayDir = resolve(root, 'overlay');

function resolveEditorDist() {
  if (process.env.EDITOR_DIST_DIR) {
    const dir = resolve(process.env.EDITOR_DIST_DIR);
    if (!existsSync(dir)) {
      throw new Error(`EDITOR_DIST_DIR is set but does not exist: ${dir}`);
    }
    return dir;
  }

  try {
    const require = createRequire(import.meta.url);
    const pkgJson = require.resolve('@cisco_open/mcptoolkit-editor-dist/package.json');
    return resolve(dirname(pkgJson), 'dist');
  } catch {
    // not installed yet
  }

  throw new Error(
    'Could not locate the editor build.\n' +
      'Install @cisco_open/mcptoolkit-editor-dist, or set EDITOR_DIST_DIR to a local editor dist folder.\n' +
      'Example: EDITOR_DIST_DIR=../mcptoolkit-editor/dist npm run build',
  );
}

// The exact inline init the browser executes. Its bytes must match the CSP
// hash below, so keep this string and the injected content identical.
//
// Note: Plausible also ships this tracker as an npm module
// (@plausible-analytics/tracker), meant to be imported and bundled into an app
// via init()/track(). This repo does NOT bundle — it only injects a <script>
// tag into a prebuilt editor build — so we use the hosted script here. The npm
// module would belong upstream in the editor bundle, not in this hosting layer.
const PLAUSIBLE_INLINE = `
  window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
  plausible.init()
`;

function injectAnalytics(indexPath, headersPath) {
  if (process.env.ANALYTICS_ENABLED !== 'true') {
    console.log('• analytics: disabled (set ANALYTICS_ENABLED=true to enable)');
    return;
  }
  const src =
    process.env.PLAUSIBLE_SRC || 'https://plausible.io/js/pa-ui2MvTKAF9Y_RM1N1h2LS.js';
  let html = readFileSync(indexPath, 'utf8');
  if (html.includes(src)) {
    console.log('• analytics: already present, skipping');
    return;
  }
  const snippet =
    '<!-- Privacy-friendly analytics by Plausible -->\n' +
    `    <script async src="${src}"></script>\n` +
    `    <script>${PLAUSIBLE_INLINE}</script>`;
  if (html.includes('<head>')) {
    html = html.replace('<head>', `<head>\n    ${snippet}`);
  } else {
    html = html.replace('</head>', `    ${snippet}\n  </head>`);
  }
  writeFileSync(indexPath, html);

  // Allow the inline init under the strict CSP via its SHA-256 hash instead of
  // weakening the policy with 'unsafe-inline'.
  const cspSource = `'sha256-${createHash('sha256').update(PLAUSIBLE_INLINE, 'utf8').digest('base64')}'`;
  if (existsSync(headersPath)) {
    let headers = readFileSync(headersPath, 'utf8');
    if (!headers.includes(cspSource)) {
      headers = headers.replace(/script-src ([^;]*)/, `script-src $1 ${cspSource}`);
      writeFileSync(headersPath, headers);
      console.log('• analytics: added inline-script CSP hash to _headers');
    }
  }
  console.log('• analytics: Plausible enabled');
}

const editorDist = resolveEditorDist();
console.log(`• editor build: ${editorDist}`);

rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });
cpSync(editorDist, distDir, { recursive: true });
console.log('• copied editor build → dist/');

if (existsSync(overlayDir)) {
  cpSync(overlayDir, distDir, { recursive: true });
  console.log('• applied overlay (headers)');
}

const indexPath = resolve(distDir, 'index.html');
if (!existsSync(indexPath)) {
  throw new Error('dist/index.html not found after copy — is the editor build valid?');
}
injectAnalytics(indexPath, resolve(distDir, '_headers'));

console.log('✓ build complete: dist/');
