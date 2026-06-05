import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [icon()],
  trailingSlash: 'never',
});
