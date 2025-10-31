import type { APIRoute } from 'astro';
import { getAllPosts } from '../lib/strapi';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.toString() || 'https://alpenglowguiding.com';

  // Remove trailing slash from site URL
  const baseUrl = siteUrl.replace(/\/$/, '');

  // Static pages
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'weekly' },
    { url: '/blog', priority: '0.9', changefreq: 'daily' },
    { url: '/contact', priority: '0.8', changefreq: 'monthly' },
  ];

  // Get dynamic blog posts from Strapi
  let blogPosts: any[] = [];
  try {
    const posts = await getAllPosts();
    blogPosts = posts.map(post => ({
      url: `/posts/${post.slug}`,
      lastmod: post.updatedAt || post.publishedAt || post.createdAt,
      priority: '0.7',
      changefreq: 'weekly'
    }));
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error);
  }

  // Get program pages from content collections
  let programPages: any[] = [];
  try {
    const programs = await getCollection('program');
    programPages = programs.map(program => ({
      url: `/programs/${program.id}`,
      priority: '0.8',
      changefreq: 'monthly'
    }));
  } catch (error) {
    console.error('Error fetching programs for sitemap:', error);
  }

  // Combine all pages
  const allPages = [...staticPages, ...blogPosts, ...programPages];

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${new Date(page.lastmod).toISOString()}</lastmod>` : ''}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
    }
  });
};
