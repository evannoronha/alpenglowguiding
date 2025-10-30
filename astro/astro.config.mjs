// @ts-check
import { defineConfig, passthroughImageService } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

import react from '@astrojs/react';

import robotsTxt from 'astro-robots-txt';

import sitemap from '@astrojs/sitemap';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare({
  }),
  output: "server",
  site: 'https://alpenglowguiding.com',
  integrations: [react(), robotsTxt({
    sitemap: false
  }), sitemap({
    serialize: (item) => {
      item.url = item.url.replace(/\/$/, "");
      return item;
    }
  }), mdx()],
  trailingSlash: 'never',
  image: {
    service: passthroughImageService(),
  },
});
