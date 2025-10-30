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

// Export a single `collections` object to register your collection(s)
export const collections = { blog, program };
