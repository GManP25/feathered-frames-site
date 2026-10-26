import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    heroImage: z.string().optional().default(''),
    excerpt: z.string().optional().default(''),
    originalUrl: z.string().optional().default(''),
  }),
});

const portfolio = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/portfolio' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    coverImage: z.string(),
    tripDetails: z.string().optional().default(''),
    photos: z.array(
      z.object({
        title: z.string(),
        image: z.string(),
      })
    ),
  }),
});

export const collections = { blog, portfolio };
