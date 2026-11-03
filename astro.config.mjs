import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.gauravsfeatheredframes.com',
  output: 'static',
  // Tailwind is used on the Life List page only (see src/styles/lifelist.css)
  vite: { plugins: [tailwindcss()] },
});
