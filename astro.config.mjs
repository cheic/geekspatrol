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
  server: {
    host: true,
    port: process.env.PORT ? Number(process.env.PORT) : 3000, // 👈 ligne essentielle
  },
  integrations: [
    tailwind({
      applyBaseStyles: false
    }),
    react()
  ]
});