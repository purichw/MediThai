import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://medithai-network.vercel.app',
  output: 'server',
  adapter: vercel(),
  integrations: [
    icon(),
    sitemap({
      filter: (page) =>
        !page.includes('/admin') &&
        !page.includes('/dashboard') &&
        !page.includes('/my-appointments') &&
        !page.includes('/login') &&
        !page.includes('/register') &&
        !page.includes('/logout') &&
        !page.includes('/auth/'),
    }),
  ],
  trailingSlash: 'never',
});
