import { z } from 'zod';

export const paymentSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  transactionId: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  status: z.enum(['pending', 'completed', 'failed', 'refunded']),
  paymentMethod: z.string(),
  paymentProvider: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createPaymentSchema = z.object({
  orderId: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  paymentMethod: z.string(),
  paymentProvider: z.string(),
});

export const updatePaymentSchema = z.object({
  status: z.enum(['pending', 'completed', 'failed', 'refunded']),
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  paymentMethod: z.string(),
  paymentProvider: z.string(),
});
