// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://tunisia-cinematic.example',
  trailingSlash: 'ignore',
  // Inline the stylesheet: one fewer render-blocking request on first paint.
  build: { inlineStylesheets: 'always' },
  vite: {
    build: { cssMinify: true },
  },
});
