import { z } from "zod";

export const couponSchema = z.object({
  id: z.string().uuid(),
  code: z.string().min(3),
  description: z.string().optional(),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number().positive(),
  minimumOrderAmount: z.number().optional(),
  isActive: z.boolean().default(true),
  expiresAt: z.date().nullable(),
});

export const createCouponSchema = z.object({
  code: z.string().min(3),
  description: z.string().optional(),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number().positive(),
  minimumOrderAmount: z.number().optional(),
});

export const updateCouponSchema = z.object({
  code: z.string().min(3).optional(),
  description: z.string().optional(),
  discountType: z.enum(["percentage", "fixed"]).optional(),
  discountValue: z.number().positive().optional(),
  minimumOrderAmount: z.number().optional(),
  isActive: z.boolean().optional(),
  expiresAt: z.date().nullable().optional(),
});

export const couponFormSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3, "Coupon code must contain at least 3 characters")
    .max(30, "Coupon code cannot exceed 30 characters")
    .transform((value) => value.toUpperCase()),

  description: z
    .string()
    .trim()
    .max(300, "Description cannot exceed 300 characters")
    .optional(),

  discountType: z.enum(["percentage", "fixed"]),

  discountValue: z.coerce
    .number()
    .positive("Discount value must be greater than zero")
    .refine(
      (value) => value <= 100 || value > 100,
      "Enter a valid discount value",
    ),

  minimumOrderAmount: z
    .union([z.literal(""), z.coerce.number().nonnegative()])
    .optional()
    .transform((value) =>
      value === "" || value === undefined ? undefined : Number(value),
    ),

  isActive: z.boolean(),

  expiresAt: z
    .string()
    .optional()
    .transform((value) => (value ? new Date(`${value}T23:59:59`) : null))
    .refine(
      (value) => value === null || !Number.isNaN(value.getTime()),
      "Enter a valid expiry date",
    ),
});

export type CouponFormInput = z.input<typeof couponFormSchema>;
export type CouponFormValues = z.output<typeof couponFormSchema>;
