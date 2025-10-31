import qs from 'qs';

const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL || 'https://celebrated-victory-07e0d5532b.strapiapp.com';

/**
 * Helper function to ensure image URLs are absolute
 */
function getStrapiImageUrl(url: string | undefined | null): string | null {
  if (!url) return null;

  // If already absolute URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // If relative URL, prepend STRAPI_URL
  return `${STRAPI_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

export interface StrapiImage {
  url: string;
  width?: number;
  height?: number;
  alternativeText?: string | null;
  caption?: string | null;
  formats?: {
    thumbnail?: any;
    small?: any;
    medium?: any;
    large?: any;
  };
}

export interface StrapiAuthor {
  name: string;
  email?: string;
}

export interface StrapiPost {
  id: string;
  slug: string;
  title: string;
  date: Date;
  description: string | null;
  content: any[];
  body: any[];
  image: StrapiImage | null;
  author: StrapiAuthor | null;
  createdAt: string | null;
  updatedAt: string | null;
  publishedAt: string | null;
}

/**
 * Fetch all posts from Strapi
 */
export async function getAllPosts(): Promise<StrapiPost[]> {
  const query = qs.stringify({
    populate: {
      author: true,
      image: true,
      body: {
        populate: '*'
      }
    }
  }, {
    encodeValuesOnly: true,
  });

  const res = await fetch(`${STRAPI_URL}/api/posts?${query}`);

  if (!res.ok) {
    throw new Error(`Strapi fetch failed: ${res.status} ${res.statusText}`);
  }

  const json: any = await res.json();

  return (json?.data ?? []).map((item: any) => {
    const author = item?.author;
    const img = item?.image;

    return {
      id: item?.slug ?? String(item?.id),
      slug: item?.slug,
      title: item?.title,
      date: new Date(item?.date),
      description: item?.description ?? null,
      content: item?.content ?? [],
      body: item?.body ?? [],
      image: img
        ? {
            url: getStrapiImageUrl(img.url) || '',
            width: img.width,
            height: img.height,
            alternativeText: img.alternativeText ?? null,
            caption: img.caption ?? null,
            formats: img.formats
              ? Object.keys(img.formats).reduce((acc, key) => {
                  const format = img.formats[key];
                  acc[key] = {
                    ...format,
                    url: getStrapiImageUrl(format.url) || format.url,
                  };
                  return acc;
                }, {} as any)
              : {},
          }
        : null,
      author: author
        ? {
            name: author.username,
            email: author.email,
          }
        : null,
      createdAt: item?.createdAt ?? null,
      updatedAt: item?.updatedAt ?? null,
      publishedAt: item?.publishedAt ?? null,
    };
  });
}

/**
 * Fetch a single post by slug from Strapi
 */
export async function getPostBySlug(slug: string): Promise<StrapiPost | null> {
  const query = qs.stringify({
    filters: {
      slug: {
        $eq: slug
      }
    },
    populate: {
      author: true,
      image: true,
      body: {
        populate: '*'
      }
    }
  }, {
    encodeValuesOnly: true,
  });

  const res = await fetch(`${STRAPI_URL}/api/posts?${query}`);

  if (!res.ok) {
    throw new Error(`Strapi fetch failed: ${res.status} ${res.statusText}`);
  }

  const json: any = await res.json();

  if (!json?.data || json.data.length === 0) {
    return null;
  }

  const item = json.data[0];
  const author = item?.author;
  const img = item?.image;

  return {
    id: item?.slug ?? String(item?.id),
    slug: item?.slug,
    title: item?.title,
    date: new Date(item?.date),
    description: item?.description ?? null,
    content: item?.content ?? [],
    body: item?.body ?? [],
    image: img
      ? {
          url: getStrapiImageUrl(img.url) || '',
          width: img.width,
          height: img.height,
          alternativeText: img.alternativeText ?? null,
          caption: img.caption ?? null,
          formats: img.formats
            ? Object.keys(img.formats).reduce((acc, key) => {
                const format = img.formats[key];
                acc[key] = {
                  ...format,
                  url: getStrapiImageUrl(format.url) || format.url,
                };
                return acc;
              }, {} as any)
            : {},
        }
      : null,
    author: author
      ? {
          name: author.username,
          email: author.email,
        }
      : null,
    createdAt: item?.createdAt ?? null,
    updatedAt: item?.updatedAt ?? null,
    publishedAt: item?.publishedAt ?? null,
  };
}
