import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: process.env.DEPLOY_PRIME_URL ?? process.env.URL,
  vite: { plugins: [tailwindcss()] },
});
