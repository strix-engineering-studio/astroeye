import { Timestamp } from "firebase/firestore";

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number | null;
  usageLimit: number | null;
  usageCount: number;
  startsAt: Date | Timestamp | null;
  expiresAt: Date | Timestamp | null;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CouponFormData {
  code: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number | null;
  usageLimit: number | null;
  startsAt: Date | null;
  expiresAt: Date | null;
  isActive: boolean;
}

export interface UpdateCouponData {
  code?: string;
  description?: string;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number | null;
  usageLimit?: number | null;
  startsAt?: Date | null;
  expiresAt?: Date | null;
  isActive?: boolean;
}

/** Lightweight shape returned when validating a coupon code at checkout */
export interface CouponValidation {
  valid: boolean;
  coupon?: Coupon;
  discountAmount: number;
  message?: string;
}
