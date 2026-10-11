import { z } from 'zod';

export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  categoryId: z.string().uuid(),
  price: z.number().positive(),
  stockQuantity: z.number().int().nonnegative(),
  isPublished: z.boolean().default(false),
});

export const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  categoryId: z.string().uuid(),
  price: z.number().positive(),
  stockQuantity: z.number().int().nonnegative(),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  price: z.number().positive().optional(),
  stockQuantity: z.number().int().nonnegative().optional(),
  isPublished: z.boolean().optional(),
});
