const STRAPI_URL = 'https://celebrated-victory-07e0d5532b.strapiapp.com';

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

export interface StrapiPost {
  id: string;
  slug: string;
  title: string;
  date: Date;
  description: string | null;
  content: any[];
  image: StrapiImage | null;
  createdAt: string | null;
  updatedAt: string | null;
  publishedAt: string | null;
}

/**
 * Fetch all posts from Strapi
 */
export async function getAllPosts(): Promise<StrapiPost[]> {
  const res = await fetch(`${STRAPI_URL}/api/posts?populate=*`);

  if (!res.ok) {
    throw new Error(`Strapi fetch failed: ${res.status} ${res.statusText}`);
  }

  const json: any = await res.json();

  return (json?.data ?? []).map((item: any) => {
    const img = item?.image;

    return {
      id: item?.slug ?? String(item?.id),
      slug: item?.slug,
      title: item?.title,
      date: new Date(item?.date),
      description: item?.description ?? null,
      content: item?.content ?? [],
      image: img
        ? {
            url: img.url,
            width: img.width,
            height: img.height,
            alternativeText: img.alternativeText ?? null,
            caption: img.caption ?? null,
            formats: img.formats ?? {},
          }
        : null,
      createdAt: item?.createdAt ?? item?.created_at ?? null,
      updatedAt: item?.updatedAt ?? item?.updated_at ?? null,
      publishedAt: item?.publishedAt ?? item?.published_at ?? null,
    };
  });
}

/**
 * Fetch a single post by slug from Strapi
 */
export async function getPostBySlug(slug: string): Promise<StrapiPost | null> {
  const res = await fetch(
    `${STRAPI_URL}/api/posts?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
  );

  if (!res.ok) {
    throw new Error(`Strapi fetch failed: ${res.status} ${res.statusText}`);
  }

  const json: any = await res.json();

  if (!json?.data || json.data.length === 0) {
    return null;
  }

  const item = json.data[0];
  const img = item?.image;

  return {
    id: item?.slug ?? String(item?.id),
    slug: item?.slug,
    title: item?.title,
    date: new Date(item?.date),
    description: item?.description ?? null,
    content: item?.content ?? [],
    image: img
      ? {
          url: img.url,
          width: img.width,
          height: img.height,
          alternativeText: img.alternativeText ?? null,
          caption: img.caption ?? null,
          formats: img.formats ?? {},
        }
      : null,
    createdAt: item?.createdAt ?? item?.created_at ?? null,
    updatedAt: item?.updatedAt ?? item?.updated_at ?? null,
    publishedAt: item?.publishedAt ?? item?.published_at ?? null,
  };
}
