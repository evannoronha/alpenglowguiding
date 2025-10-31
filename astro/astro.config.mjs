// @ts-check
import { defineConfig, passthroughImageService } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

import react from '@astrojs/react';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare({
  }),
  output: "server",
  site: 'https://alpenglowguiding.com',
  integrations: [react(), mdx()],
  trailingSlash: 'never',
  image: {
    service: passthroughImageService(),
  },
});
