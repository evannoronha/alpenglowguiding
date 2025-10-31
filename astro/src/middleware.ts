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

    console.log('Setting Content-Security-Policy to allow localhost embedding');
    // Allow embedding from localhost Strapi
    newResponse.headers.set('Content-Security-Policy', 'frame-ancestors http://localhost:1337');

    return newResponse;
  }

  return response;
});
