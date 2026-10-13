
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


import { COLLECTIONS } from "@/lib/constants/COLLECTIONS";
import couponsService from "../services/coupon.service";
import { Coupon, CouponFormData, UpdateCouponData } from "../types/coupon.type";

export const useCouponsQuery = () => {
  return useQuery({
    queryKey: [COLLECTIONS.COUPONS],
    queryFn: () => couponsService.fetchCoupons(),
  });
};

export const useCouponQuery = (id: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [COLLECTIONS.COUPONS, id],
    queryFn: () => couponsService.fetchCouponById(id),
    enabled: Boolean(id),

    initialData: () => {
      const listQueries = queryClient.getQueriesData<Coupon[]>({
        queryKey: [COLLECTIONS.COUPONS],
      });

      return listQueries
        .flatMap(([, coupons]) => coupons ?? [])
        .find((coupon) => coupon.id === id);
    },
  });
};

export const useActiveCouponsQuery = () => {
  return useQuery({
    queryKey: [COLLECTIONS.COUPONS, "active"],
    queryFn: () => couponsService.fetchActiveCoupons(),
  });
};

export const useCouponByCodeQuery = (code: string) => {
  return useQuery({
    queryKey: [COLLECTIONS.COUPONS, "code", code],
    queryFn: () => couponsService.fetchCouponByCode(code),
    enabled: Boolean(code.trim()),
  });
};

export const useCreateCouponMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CouponFormData) =>
      couponsService.createCoupon(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [COLLECTIONS.COUPONS],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard", "stats"],
      });

      toast.success("Coupon created successfully");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to create coupon");
    },
  });
};

export const useUpdateCouponMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCouponData;
    }) => couponsService.updateCoupon(id, data),

    onSuccess: (updated) => {
      queryClient.setQueryData(
        [COLLECTIONS.COUPONS, updated.id],
        updated,
      );

      queryClient.setQueriesData<Coupon[]>(
        { queryKey: [COLLECTIONS.COUPONS] },
        (old) =>
          old?.map((coupon) =>
            coupon.id === updated.id ? updated : coupon,
          ) ?? [],
      );

      queryClient.invalidateQueries({
        queryKey: [COLLECTIONS.COUPONS],
      });

      toast.success(`Coupon ${updated.code} updated successfully`);
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to update coupon");
    },
  });
};

export const useUpdateCouponStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      isActive,
    }: {
      id: string;
      isActive: boolean;
    }) => couponsService.updateCouponStatus(id, isActive),

    onSuccess: (updated) => {
      queryClient.setQueryData(
        [COLLECTIONS.COUPONS, updated.id],
        updated,
      );

      queryClient.invalidateQueries({
        queryKey: [COLLECTIONS.COUPONS],
      });

      toast.success(
        updated.isActive
          ? "Coupon activated successfully"
          : "Coupon deactivated successfully",
      );
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to update coupon status");
    },
  });
};

export const useDeleteCouponMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => couponsService.deleteCoupon(id),

    onSuccess: (_, id) => {
      queryClient.removeQueries({
        queryKey: [COLLECTIONS.COUPONS, id],
      });

      queryClient.invalidateQueries({
        queryKey: [COLLECTIONS.COUPONS],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard", "stats"],
      });

      toast.success("Coupon deleted successfully");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete coupon");
    },
  });
};
