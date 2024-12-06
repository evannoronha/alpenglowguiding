// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

import react from '@astrojs/react';

import robotsTxt from 'astro-robots-txt';

import sitemap from '@astrojs/sitemap';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    }
  }),
  output: "server",
  site: 'https://alpenglowguiding.com',
  integrations: [react(), robotsTxt({
    sitemap: false
  }), sitemap(), mdx()]
});