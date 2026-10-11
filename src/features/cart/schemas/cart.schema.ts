import { z } from 'zod';

export const cartSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createCartSchema = z.object({
  userId: z.string().uuid(),
});

export const addToCartSchema = z.object({
  cartId: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

export const removeFromCartSchema = z.object({
  cartId: z.string().uuid(),
  productId: z.string().uuid(),
});
