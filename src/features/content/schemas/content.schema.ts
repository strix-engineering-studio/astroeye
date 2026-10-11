import { z } from 'zod';

export const contentSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['blog', 'product', 'page']),
  title: z.string().min(1),
  slug: z.string(),
  body: z.string(),
  isPublished: z.boolean().default(false),
  publishedAt: z.date().nullable(),
});

export const createContentSchema = z.object({
  type: z.enum(['blog', 'product', 'page']),
  title: z.string().min(1),
  slug: z.string(),
  body: z.string(),
});

export const updateContentSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().optional(),
  body: z.string().optional(),
  isPublished: z.boolean().optional(),
  publishedAt: z.date().nullable().optional(),
});
