import { z } from 'zod';

export const collectionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createCollectionSchema = z.object({
  userId: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
});

export const updateCollectionSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});
