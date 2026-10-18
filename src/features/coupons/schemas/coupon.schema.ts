import { z } from "zod";

// ---------------------------------------------------------------------------
// Full coupon document schema (used for API response validation)
// ---------------------------------------------------------------------------
export const couponSchema = z.object({
  id: z.string(),
  code: z.string().min(3),
  description: z.string().optional(),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number().positive(),
  minOrderAmount: z.number().nonnegative().default(0),
  maxDiscountAmount: z.number().positive().nullable().default(null),
  usageLimit: z.number().int().positive().nullable().default(null),
  usageCount: z.number().int().nonnegative().default(0),
  startsAt: z.date().nullable(),
  expiresAt: z.date().nullable(),
  isActive: z.boolean().default(true),
});

// ---------------------------------------------------------------------------
// Create schema (POST body)
// ---------------------------------------------------------------------------
export const createCouponSchema = z.object({
  code: z.string().min(3),
  description: z.string().optional(),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number().positive(),
  minOrderAmount: z.number().nonnegative().default(0),
  maxDiscountAmount: z.number().positive().nullable().optional(),
  usageLimit: z.number().int().positive().nullable().optional(),
  startsAt: z.date().nullable().optional(),
  expiresAt: z.date().nullable().optional(),
  isActive: z.boolean().default(true),
});

// ---------------------------------------------------------------------------
// Update schema (PATCH body)
// ---------------------------------------------------------------------------
export const updateCouponSchema = z.object({
  code: z.string().min(3).optional(),
  description: z.string().optional(),
  discountType: z.enum(["percentage", "fixed"]).optional(),
  discountValue: z.number().positive().optional(),
  minOrderAmount: z.number().nonnegative().optional(),
  maxDiscountAmount: z.number().positive().nullable().optional(),
  usageLimit: z.number().int().positive().nullable().optional(),
  startsAt: z.date().nullable().optional(),
  expiresAt: z.date().nullable().optional(),
  isActive: z.boolean().optional(),
});

// ---------------------------------------------------------------------------
// Form schema (react-hook-form / UI)
// ---------------------------------------------------------------------------
const optionalPositiveNumber = z
  .union([z.literal(""), z.coerce.number().nonnegative()])
  .optional()
  .transform((v) => (v === "" || v === undefined ? null : Number(v)));

export const couponFormSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(3, "Coupon code must be at least 3 characters")
      .max(30, "Coupon code cannot exceed 30 characters")
      .transform((v) => v.toUpperCase()),

    description: z
      .string()
      .trim()
      .max(300, "Description cannot exceed 300 characters")
      .optional(),

    discountType: z.enum(["percentage", "fixed"]),

    discountValue: z.coerce
      .number()
      .positive("Discount value must be greater than zero"),

    minOrderAmount: z
      .union([z.literal(""), z.coerce.number().nonnegative()])
      .optional()
      .transform((v) =>
        v === "" || v === undefined ? 0 : Number(v),
      ),

    maxDiscountAmount: optionalPositiveNumber,

    usageLimit: z
      .union([z.literal(""), z.coerce.number().int().positive()])
      .optional()
      .transform((v) =>
        v === "" || v === undefined ? null : Number(v),
      ),

    startsAt: z
      .string()
      .optional()
      .transform((v) => (v ? new Date(`${v}T00:00:00`) : null))
      .refine(
        (v) => v === null || !Number.isNaN(v.getTime()),
        "Enter a valid start date",
      ),

    expiresAt: z
      .string()
      .optional()
      .transform((v) => (v ? new Date(`${v}T23:59:59`) : null))
      .refine(
        (v) => v === null || !Number.isNaN(v.getTime()),
        "Enter a valid expiry date",
      ),

    isActive: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.discountType === "percentage" && data.discountValue > 100) {
        return false;
      }
      return true;
    },
    {
      message: "Percentage discount cannot exceed 100%",
      path: ["discountValue"],
    },
  );

export type CouponFormInput = z.input<typeof couponFormSchema>;
export type CouponFormValues = z.output<typeof couponFormSchema>;
