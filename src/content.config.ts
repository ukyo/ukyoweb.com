import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    pubDate: z.coerce.date(),
    description: z.string().optional(),
    draft: z.boolean().optional()
  })
});

const reports = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/reports" }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    pubDate: z.coerce.date(),
    periodStart: z.coerce.date(),
    periodEnd: z.coerce.date(),
    topic: z.string(),
    sources: z
      .array(
        z.object({
          title: z.string(),
          url: z.string().url()
        })
      )
      .min(1),
    description: z.string().optional(),
    draft: z.boolean().optional()
  })
});

export const collections = { blog, reports };
