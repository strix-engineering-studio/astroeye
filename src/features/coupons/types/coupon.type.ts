export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minimumOrderAmount?: number;
  isActive: boolean;
  expiresAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CouponFormData {
  code: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minimumOrderAmount?: number;
}

export interface UpdateCouponData {
  code?: string;
  description?: string;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  minimumOrderAmount?: number;
  isActive?: boolean;
  expiresAt?: Date | null;
}
