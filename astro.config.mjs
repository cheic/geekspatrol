import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://geekspatrol.com',
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [
    tailwind({
      applyBaseStyles: false
    }),
    react()
  ]
});