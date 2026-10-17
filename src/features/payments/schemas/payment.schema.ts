import { z } from "zod";

export const paymentSchema = z.object({
  id: z.string().min(1),
  orderId: z.string().optional(),
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().optional(),
  razorpaySignature: z.string().optional(),
  userId: z.string().min(1),
  customerEmail: z.string().email().optional(),
  customerName: z.string().optional(),
  entityType: z.enum(["PRODUCT", "RESOURCE", "WEBINAR"]).optional(),
  productId: z.string().optional(),
  resourceId: z.string().optional(),
  webinarId: z.string().optional(),
  amount: z.number().positive(),
  currency: z.string().default("INR"),
  status: z.enum([
    "PENDING",
    "PROCESSING",
    "CAPTURED",
    "PAID",
    "FAILED",
    "REFUNDED",
    "VERIFICATION_FAILED",
  ]),
  failureReason: z.string().optional(),
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]).optional(),
  capturedAt: z.union([z.date(), z.string()]).optional(),
  verifiedAt: z.union([z.date(), z.string()]).optional(),
});

export const createPaymentSchema = z.object({
  orderId: z.string().optional(),
  razorpayOrderId: z.string().min(1),
  userId: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().default("INR"),
  entityType: z.enum(["PRODUCT", "RESOURCE", "WEBINAR"]).optional(),
  productId: z.string().optional(),
  resourceId: z.string().optional(),
  webinarId: z.string().optional(),
});

export const updatePaymentSchema = z.object({
  status: z.enum([
    "PENDING",
    "PROCESSING",
    "CAPTURED",
    "PAID",
    "FAILED",
    "REFUNDED",
    "VERIFICATION_FAILED",
  ]).optional(),
  razorpayPaymentId: z.string().optional(),
  razorpaySignature: z.string().optional(),
  failureReason: z.string().optional(),
});

export type PaymentRecordSchema = z.infer<typeof paymentSchema>;
