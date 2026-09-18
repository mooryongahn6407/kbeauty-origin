import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  // GitHub Pages serves the production build as a project site at
  // https://<owner>.github.io/kbeauty-origin/, not at the domain root, so every asset URL the
  // build emits must be prefixed with the repo name or they 404 once deployed. `npm run dev`
  // still serves at http://127.0.0.1:5173/ exactly as CLAUDE.md documents — only `vite build`
  // picks up the prefix.
  base: command === 'build' ? '/kbeauty-origin/' : '/',
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: { host: '127.0.0.1', port: 5173 },
}));
