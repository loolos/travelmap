/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { createHash } from 'node:crypto';
import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const BASE = '/travelmap/';

/**
 * Exposes `virtual:core-manifest`: the list of essential (offline core) files
 * with their size and content hash, computed at build time from assets.json.
 */
function coreManifest(): Plugin {
  const id = 'virtual:core-manifest';
  const resolved = '\0' + id;
  return {
    name: 'core-manifest',
    resolveId: (s) => (s === id ? resolved : undefined),
    load(s) {
      if (s !== resolved) return;
      const assetsFile = join(import.meta.dirname, 'src/content/assets.json');
      this.addWatchFile(assetsFile);
      const assets = JSON.parse(readFileSync(assetsFile, 'utf8')) as { path?: string; essential: boolean }[];
      const entries = assets
        .filter((a) => a.essential && a.path)
        .map((a) => {
          const file = join(import.meta.dirname, 'public', a.path!);
          const buf = readFileSync(file);
          return {
            path: a.path!,
            bytes: statSync(file).size,
            rev: createHash('sha256').update(buf).digest('hex').slice(0, 12),
          };
        });
      return `export default ${JSON.stringify(entries)};`;
    },
  };
}

/** Shown on the offline page so you can tell which version is running. */
const stamp = new Intl.DateTimeFormat('zh-TW', {
  timeZone: 'Asia/Taipei',
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
}).format(new Date());
const APP_VERSION = `${stamp}${process.env.GITHUB_SHA ? ` · ${process.env.GITHUB_SHA.slice(0, 7)}` : ''}`;

export default defineConfig({
  base: BASE,
  define: { __APP_VERSION__: JSON.stringify(APP_VERSION) },
  plugins: [
    react(),
    coreManifest(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'prompt',
      injectRegister: false,
      manifest: {
        name: '埃及探索 Egypt Explorer',
        short_name: '埃及探索',
        description: '埃及互動地圖：點地點看歷史、到現場找找看，可離線使用。',
        lang: 'zh-Hant',
        start_url: BASE,
        scope: BASE,
        display: 'standalone',
        background_color: '#F4EBD9',
        theme_color: '#244C79',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      injectManifest: {
        // App Shell only. Core media is downloaded on demand from the offline page.
        globPatterns: ['**/*.{js,css,html,svg,png,webmanifest,woff2}'],
        globIgnores: ['media/**'],
      },
      devOptions: { enabled: false },
    }),
  ],
  test: {
    include: ['src/**/*.test.ts'],
  },
});
