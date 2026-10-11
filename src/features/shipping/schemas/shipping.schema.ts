import { z } from 'zod';

export const shippingSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  addressId: z.string().uuid(),
  carrier: z.string(),
  trackingNumber: z.string().optional(),
  status: z.enum(['pending', 'shipped', 'delivered', 'cancelled']),
  cost: z.number().positive(),
});

export const createShippingSchema = z.object({
  orderId: z.string().uuid(),
  addressId: z.string().uuid(),
  carrier: z.string(),
  trackingNumber: z.string().optional(),
  status: z.enum(['pending', 'shipped', 'delivered', 'cancelled']),
});

export const updateShippingSchema = z.object({
  carrier: z.string().optional(),
  trackingNumber: z.string().optional(),
  status: z.enum(['pending', 'shipped', 'delivered', 'cancelled']).optional(),
  cost: z.number().positive().optional(),
});
