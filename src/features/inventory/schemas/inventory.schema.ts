import { z } from 'zod';

export const inventorySchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number().int().nonnegative(),
  minQuantity: z.number().positive(),
  maxQuantity: z.number().optional(),
  unit: z.string().default('pcs'),
});

export const createInventorySchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().nonnegative(),
  minQuantity: z.number().positive(),
  maxQuantity: z.number().optional(),
  unit: z.string().default('pcs'),
});

export const updateInventorySchema = z.object({
  quantity: z.number().int().nonnegative().optional(),
  minQuantity: z.number().positive().optional(),
  maxQuantity: z.number().optional(),
  unit: z.string().optional(),
});
