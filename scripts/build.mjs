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

function injectAnalytics(indexPath) {
  if (process.env.ANALYTICS_ENABLED !== 'true') {
    console.log('• analytics: disabled (set ANALYTICS_ENABLED=true to enable)');
    return;
  }
  const domain = process.env.PLAUSIBLE_DOMAIN || 'editor.mcpdesc.org';
  const src = process.env.PLAUSIBLE_SRC || 'https://plausible.io/js/script.js';
  let html = readFileSync(indexPath, 'utf8');
  if (html.includes(src)) {
    console.log('• analytics: already present, skipping');
    return;
  }
  const tag = `<script defer data-domain="${domain}" src="${src}"></script>`;
  html = html.replace('</head>', `    ${tag}\n  </head>`);
  writeFileSync(indexPath, html);
  console.log(`• analytics: Plausible enabled for ${domain}`);
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
injectAnalytics(indexPath);

console.log('✓ build complete: dist/');
