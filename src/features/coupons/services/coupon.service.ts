import { apiClient } from "@/lib/api/client";
import {
  Coupon,
  CouponFormData,
  CouponValidation,
  UpdateCouponData,
} from "../types/coupon.type";

export const couponsService = {
  async fetchCoupons(): Promise<Coupon[]> {
    return apiClient.get<Coupon[]>("/coupons");
  },

  async fetchCouponById(id: string): Promise<Coupon> {
    return apiClient.get<Coupon>(`/coupons/${id}`);
  },

  async fetchCouponByCode(code: string): Promise<Coupon> {
    return apiClient.get<Coupon>(`/coupons/code/${encodeURIComponent(code)}`);
  },

  async fetchActiveCoupons(): Promise<Coupon[]> {
    return apiClient.get<Coupon[]>("/coupons?active=true");
  },

  async createCoupon(data: CouponFormData): Promise<Coupon> {
    return apiClient.post<Coupon>("/coupons", data);
  },

  async updateCoupon(id: string, data: UpdateCouponData): Promise<Coupon> {
    return apiClient.patch<Coupon>(`/coupons/${id}`, data);
  },

  async updateCouponStatus(id: string, isActive: boolean): Promise<Coupon> {
    return apiClient.patch<Coupon>(`/coupons/${id}`, { isActive });
  },

  async deleteCoupon(id: string): Promise<void> {
    return apiClient.delete<void>(`/coupons/${id}`);
  },

  /**
   * Validate a coupon code against a cart subtotal.
   * Returns the computed discount amount.
   */
  async validateCoupon(
    code: string,
    cartSubtotal: number,
  ): Promise<CouponValidation> {
    return apiClient.post<CouponValidation>("/coupons/validate", {
      code,
      cartSubtotal,
    });
  },
};

export default couponsService;
