import { z } from 'zod';

export const couponSchema = z.object({
  id: z.string().uuid(),
  code: z.string().min(3),
  description: z.string().optional(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().positive(),
  minimumOrderAmount: z.number().optional(),
  maximumDiscount: z.number().optional(),
  isActive: z.boolean().default(true),
  expiresAt: z.date().nullable(),
});

export const createCouponSchema = z.object({
  code: z.string().min(3),
  description: z.string().optional(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().positive(),
  minimumOrderAmount: z.number().optional(),
});

export const updateCouponSchema = z.object({
  code: z.string().min(3).optional(),
  description: z.string().optional(),
  discountType: z.enum(['percentage', 'fixed']).optional(),
  discountValue: z.number().positive().optional(),
  minimumOrderAmount: z.number().optional(),
  isActive: z.boolean().optional(),
  expiresAt: z.date().nullable().optional(),
});
