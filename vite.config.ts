import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';

// KG-APP-BASE §4: every build carries its version (shown in Settings, sent with help-desk notes).
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8')) as { version: string };
const stamp = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '').slice(2);
const APP_VERSION = `v${pkg.version} · ${stamp}`;

export default defineConfig(({ command }) => ({
  // GitHub Pages serves the production build as a project site at
  // https://<owner>.github.io/kbeauty-origin/, not at the domain root, so every asset URL the
  // build emits must be prefixed with the repo name or they 404 once deployed. `npm run dev`
  // still serves at http://127.0.0.1:5173/ exactly as CLAUDE.md documents — only `vite build`
  // picks up the prefix.
  base: command === 'build' ? '/kbeauty-origin/' : '/',
  plugins: [react()],
  define: { __APP_VERSION__: JSON.stringify(APP_VERSION) },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: { host: '127.0.0.1', port: 5173 },
}));
