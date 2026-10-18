"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, TicketPercent } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageWrapper from "@/components/wrappers/PageWrapper";
import { CouponForm } from "../components/CouponForm";
import { useCreateCouponMutation } from "../hooks/useCoupon";
import { CouponFormValues } from "../schemas";

export function CreateCouponPage() {
  const router = useRouter();
  const { mutateAsync, isPending } = useCreateCouponMutation();

  const handleSubmit = async (values: CouponFormValues) => {
    const coupon = await mutateAsync({
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
    });
    router.push(`/console/coupons/${coupon.id}`);
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
              <h1 className="text-2xl font-bold tracking-tight">
                Create Coupon
              </h1>
            </div>
            <p className="text-muted-foreground mt-0.5 text-sm">
              Configure a new discount coupon for your customers.
            </p>
          </div>
        </div>

        {/* Form */}
        <CouponForm
          mode="create"
          isSubmitting={isPending}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
        />
      </div>
    </PageWrapper>
  );
}

export default CreateCouponPage;
