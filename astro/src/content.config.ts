// Import the glob loader
import { glob } from "astro/loaders";
// Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";
// Define a `loader` and `schema` for each collection
const blog = defineCollection({
  loader: glob({ pattern: '*', base: "src/content/blog/" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    image: image(),
    author: z.string(),
    tags: z.array(z.string())
  })
});

const program = defineCollection({
  loader: glob({ pattern: '*', base: "src/content/program/" }),
  schema: ({ image }) => z.object({
    name: z.string(),
    description: z.string(),
    objectives: z.array(z.string()),
    requiredEquipment: z.object({
      clothing: z.array(z.string()),
      technicalEquipment: z.array(z.string())
    }),
    image: image(),
    schedule: z.array(z.object({
      event: z.string(),
      itinerary: z.array(z.string())
    }))
  })
});

// Strapi post schema (adjust as your API evolves)
const imageFormat = z
  .object({
    ext: z.string().optional(),
    url: z.string().url(),
    hash: z.string().optional(),
    mime: z.string().optional(),
    name: z.string().optional(),
    path: z.string().nullable().optional(),
    size: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    sizeInBytes: z.number().optional(),
  })
  .partial()
  .strict();

const strapiImageSchema = z
  .object({
    url: z.string().url(),
    width: z.number().optional(),
    height: z.number().optional(),
    alternativeText: z.string().nullable().optional(),
    caption: z.string().nullable().optional(),
    formats: z
      .object({
        thumbnail: imageFormat.optional(),
        small: imageFormat.optional(),
        medium: imageFormat.optional(),
        large: imageFormat.optional(),
      })
      .partial()
      .optional(),
  })
  .strict();

const strapiBlog = defineCollection({
  // Inline loader: fetch remote Strapi data at build time and return entries with an `id`
  // (Astro requires each returned entry to include `id`.) :contentReference[oaicite:0]{index=0}
  loader: async () => {
    const res = await fetch(
      'https://celebrated-victory-07e0d5532b.strapiapp.com/api/posts?populate=*',
    );
    if (!res.ok) {
      throw new Error(`Strapi fetch failed: ${res.status} ${res.statusText}`);
    }
    const json = await res.json();

    // Map Strapi records -> Astro collection entries
    return (json?.data ?? []).map((item: any) => {
      const img = item?.image;

      return {
        // Required unique id for the collection entry
        id: item?.documentId ?? String(item?.id),

        // Fields you’ll use in templates
        slug: item?.slug,
        title: item?.title,
        date: item?.date, // keep as string; Zod will transform to Date below
        description: item?.description ?? null,
        content: item?.content ?? [],

        // Optional image (with useful sizes)
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

        // Metadata (optional but handy)
        createdAt: item?.createdAt ?? item?.created_at ?? null,
        updatedAt: item?.updatedAt ?? item?.updated_at ?? null,
        publishedAt: item?.publishedAt ?? item?.published_at ?? null,
      };
    });
  },

  // Zod schema for type-safe `entry.data`
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    date: z
      .string()
      .transform((d) => new Date(d)), // now `data.date` is a Date in your app
    description: z.string().nullable(),
    content: z.array(z.unknown()), // Strapi rich text blocks; refine if you want
    image: strapiImageSchema.nullable(),
    createdAt: z.string().nullable(),
    updatedAt: z.string().nullable(),
    publishedAt: z.string().nullable(),
  }),
});

// Export a single `collections` object to register your collection(s)
export const collections = { blog, program, strapiBlog };
