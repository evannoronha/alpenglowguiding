import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const isPreview = url.searchParams.get('preview') === 'true';

  const response = await next();

  // Allow iframe embedding from Strapi when in preview mode
  if (isPreview) {
    const newResponse = new Response(response.body, response);

    // Remove any existing X-Frame-Options header
    newResponse.headers.delete('X-Frame-Options');

    // Get Strapi URL from environment
    const strapiUrl = import.meta.env.PUBLIC_STRAPI_URL || 'https://celebrated-victory-07e0d5532b.strapiapp.com';
    const strapiOrigin = new URL(strapiUrl).origin;

    // Allow embedding from both production and local Strapi
    const allowedOrigins = [
      "'self'",
      strapiOrigin,
      'http://localhost:1337'
    ].join(' ');

    newResponse.headers.set('Content-Security-Policy', `frame-ancestors ${allowedOrigins}`);

    return newResponse;
  }

  return response;
});
