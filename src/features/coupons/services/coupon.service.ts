import { apiClient } from "@/lib/api/client";
import { Coupon, CouponFormData, UpdateCouponData } from "../types/coupon.type";

export const couponsService = {
  async fetchCoupons() {
    return apiClient.get<Coupon[]>("/coupons");
  },

  async fetchCouponById(id: string) {
    return apiClient.get<Coupon>(`/coupons/${id}`);
  },

  async fetchCouponByCode(code: string) {
    return apiClient.get<Coupon>(`/coupons/code/${encodeURIComponent(code)}`);
  },

  async fetchActiveCoupons() {
    return apiClient.get<Coupon[]>("/coupons/active");
  },

  async createCoupon(data: CouponFormData) {
    return apiClient.post<Coupon>("/coupons", data);
  },

  async updateCoupon(id: string, data: UpdateCouponData) {
    return apiClient.patch<Coupon>(`/coupons/${id}`, data);
  },

  async deleteCoupon(id: string) {
    return apiClient.delete<void>(`/coupons/${id}`);
  },

  async updateCouponStatus(id: string, isActive: boolean) {
    return apiClient.patch<Coupon>(`/coupons/${id}`, {
      isActive,
    });
  },
};

export default couponsService;
