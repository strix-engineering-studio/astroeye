"use client";

import { useParams, useRouter } from "next/navigation";
import PageWrapper from "@/components/wrappers/PageWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { CouponDetailsPage } from "@/features/coupons/pages/CouponDetailsPage";
import {
  useCouponQuery,
  useDeleteCouponMutation,
  useUpdateCouponStatusMutation,
} from "@/features/coupons/hooks/useCoupon";

export default function Page() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";

  const { data: coupon, isLoading, isError } = useCouponQuery(id);
  const { mutate: deleteCoupon } = useDeleteCouponMutation();
  const { mutate: toggleStatus } = useUpdateCouponStatusMutation();

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    deleteCoupon(id, {
      onSuccess: () => router.push("/console/coupons"),
    });
  };

  return (
    <PageWrapper className="animate-fade-in p-6">
      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-12 w-64 rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      )}

      {isError && (
        <div
          role="alert"
          className="border-destructive/30 bg-destructive/5 rounded-lg border p-4"
        >
          <p className="text-destructive text-sm">
            Failed to load coupon. It may have been deleted.
          </p>
        </div>
      )}

      {coupon && (
        <CouponDetailsPage
          coupon={coupon}
          onEdit={() => router.push(`/console/coupons/${id}/edit`)}
          onDelete={handleDelete}
          onToggleStatus={() =>
            toggleStatus({ id, isActive: !coupon.isActive })
          }
        />
      )}
    </PageWrapper>
  );
}
