"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, TicketPercent } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageWrapper from "@/components/wrappers/PageWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { CouponForm } from "../components/CouponForm";
import { useCouponQuery, useUpdateCouponMutation } from "../hooks/useCoupon";
import { CouponFormValues } from "../schemas";

export function EditCouponPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";

  const { data: coupon, isLoading, isError } = useCouponQuery(id);
  const { mutateAsync, isPending } = useUpdateCouponMutation();

  const handleSubmit = async (values: CouponFormValues) => {
    await mutateAsync({
      id,
      data: {
        code: values.code,
        description: values.description,
        discountType: values.discountType,
        discountValue: values.discountValue,
        minOrderAmount: values.minOrderAmount,
        maxDiscountAmount: values.maxDiscountAmount ?? null,
        usageLimit: values.usageLimit ?? null,
        startsAt: values.startsAt,
        expiresAt: values.expiresAt,
        isActive: values.isActive,
      },
    });
    router.push(`/console/coupons/${id}`);
  };

  return (
    <PageWrapper className="animate-fade-in p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Go back"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div>
            <div className="flex items-center gap-2">
              <TicketPercent className="text-muted-foreground h-6 w-6" />
              <h1 className="text-2xl font-bold tracking-tight">Edit Coupon</h1>
            </div>
            <p className="text-muted-foreground mt-0.5 text-sm">
              {coupon ? `Editing ${coupon.code}` : "Update coupon details"}
            </p>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        )}

        {/* Error */}
        {isError && (
          <div
            role="alert"
            className="border-destructive/30 bg-destructive/5 rounded-lg border p-4"
          >
            <p className="text-destructive text-sm">
              Failed to load coupon. Please go back and try again.
            </p>
          </div>
        )}

        {/* Form */}
        {coupon && (
          <CouponForm
            mode="edit"
            defaultValues={coupon}
            isSubmitting={isPending}
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
          />
        )}
      </div>
    </PageWrapper>
  );
}

export default EditCouponPage;
