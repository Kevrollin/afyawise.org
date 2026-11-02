import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const programSlugs = [
  'maternal-child-health',
  'water-sanitation-hygiene',
  'mental-health-disability',
  'health-education',
  'community-health-promoters',
] as const;

/**
 * Stories: real field stories only. /stories and the "Stories" nav item appear automatically once
 * one confirmed story exists. Files starting with "_" are ignored (see _README.md).
 */
const stories = defineCollection({
  loader: glob({ pattern: '**/[!_]*.md', base: './src/content/stories' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().max(80),
        summary: z.string().max(200),
        date: z.coerce.date(),
        place: z.string(),
        program: z.enum(programSlugs),
        lang: z.enum(['en', 'sw']).default('en'),
        image: image().optional(),
        imageAlt: z.string().optional(),
        /** Required for any photo of a person: who consented, when, and for what use. */
        consent: z
          .object({
            given: z.literal(true),
            by: z.string(),
            date: z.coerce.date(),
            scope: z.string(),
          })
          .optional(),
        status: z.enum(['confirmed', 'TODO_CONFIRM']).default('TODO_CONFIRM'),
      })
      .refine((s) => !s.image || (s.consent && s.imageAlt), {
        message: 'A story with a photo needs consent details and alt text.',
      }),
});

export const collections = { stories };
