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
    sequenceNumber: z.number(),
    pricePerPerson: z.array(z.number()),
      description: z.string(),
      locations: z.enum([
        "Vantage (Frenchman Coulee)",
        "North Bend, WA",
        "Index, WA",
        "The Mountaineers Wall, Seattle, WA"
      ]),
      programType: z.enum(["Guided Climb", "Skills Course"]),
      durationDays: z.enum(["1/2 Day", "Full Day", "2 Days", "Multi-Day"]),
      durationHours: z.number(),
      seasons: z.array(z.enum(["Winter", "Spring", "Summer", "Fall"])),
      clientToGuideRatio: z.number(),
      minimumParticipants: z.number(),
      photos: z.array(image()),
      itinerary: z.array(z.string()),
      prerequisites: z.string(),
      curriculum: z.array(z.string()),
      requiredGear: z.array(z.string()),
      attachedInformation: z.array(z.string()),
    })
  });
// Export a single `collections` object to register your collection(s)
export const collections = { blog, program };
