// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

import react from '@astrojs/react';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare({
    // compile: Optimizes images at build time using Sharp
    // Works for all local images and pre-rendered routes
    // For SSR pages, local images work but aren't optimized on-demand
    // To enable on-demand optimization, upgrade to 'cloudflare' imageService
    // (requires Cloudflare Images to be enabled on your Cloudflare account)
    imageService: 'compile',
  }),
  output: "server",
  site: 'https://alpenglowguiding.com',
  integrations: [react(), mdx()],
  trailingSlash: 'never',
  image: {
    domains: ['alpenglowguiding.com'],
    remotePatterns: [{ protocol: 'https' }],
  },
  experimental: {
    clientPrerender: true,
  },
});
