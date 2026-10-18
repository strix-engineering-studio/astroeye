"use client";

import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TicketPercent,
  ShoppingCart,
  CalendarClock,
  ShieldCheck,
  Users,
  TrendingDown,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormWrapper } from "@/components/wrappers/FormWrapper";
import { Coupon } from "../types/coupon.type";
import {
  CouponFormInput,
  couponFormSchema,
  CouponFormValues,
} from "../schemas";

interface CouponFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<Coupon>;
  onSubmit: (values: CouponFormValues) => void | Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

function toDateInput(value?: Date | string | null): string {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function CouponForm({
  mode,
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CouponFormProps) {
  const isCreateMode = mode === "create";

  const form = useForm<CouponFormInput, unknown, CouponFormValues>({
    resolver: zodResolver(couponFormSchema),
    mode: "onChange",
    defaultValues: {
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: 10,
      minOrderAmount: "",
      maxDiscountAmount: "",
      usageLimit: "",
      startsAt: "",
      expiresAt: "",
      isActive: true,
    },
  });

  const discountType = form.watch("discountType");
  const isActive = form.watch("isActive");

  useEffect(() => {
    if (!defaultValues) return;
    form.reset({
      code: defaultValues.code ?? "",
      description: defaultValues.description ?? "",
      discountType: defaultValues.discountType ?? "percentage",
      discountValue: defaultValues.discountValue ?? 10,
      minOrderAmount:
        defaultValues.minOrderAmount != null
          ? String(defaultValues.minOrderAmount)
          : "",
      maxDiscountAmount:
        defaultValues.maxDiscountAmount != null
          ? String(defaultValues.maxDiscountAmount)
          : "",
      usageLimit:
        defaultValues.usageLimit != null
          ? String(defaultValues.usageLimit)
          : "",
      startsAt: toDateInput(
        defaultValues.startsAt instanceof Date
          ? defaultValues.startsAt
          : defaultValues.startsAt
            ? new Date(String(defaultValues.startsAt))
            : null,
      ),
      expiresAt: toDateInput(
        defaultValues.expiresAt instanceof Date
          ? defaultValues.expiresAt
          : defaultValues.expiresAt
            ? new Date(String(defaultValues.expiresAt))
            : null,
      ),
      isActive: defaultValues.isActive ?? true,
    });
  }, [defaultValues, form]);

  const handleSubmit = async (values: CouponFormValues) => {
    await onSubmit({
      ...values,
      code: values.code.trim().toUpperCase(),
      description: values.description?.trim() || undefined,
    });
  };

  return (
    <FormProvider {...form}>
      <FormWrapper
        form={form}
        showHeader={false}
        showDevelopmentDebug={false}
        submitting={isSubmitting}
        submitLabel={isCreateMode ? "Create Coupon" : "Save Changes"}
        title={isCreateMode ? "Create Coupon" : "Edit Coupon"}
        description={
          isCreateMode
            ? "Configure a discount coupon for your customers."
            : "Update the coupon's discount, validity, and availability."
        }
        onCancel={onCancel}
        onSubmit={handleSubmit}
      >
        <div className="space-y-6">
          {/* ── Coupon Information ── */}
          <Card className="overflow-hidden">
            <CardHeader className="border-b px-6 py-5">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TicketPercent className="h-5 w-5" />
                Coupon Information
              </CardTitle>
              <CardDescription>
                Define the coupon code and customer-facing description.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 p-6">
              <div className="grid gap-5 md:grid-cols-2">
                <FormField
                  label="Coupon Code"
                  required
                  htmlFor="code"
                  error={form.formState.errors.code?.message}
                >
                  <Input
                    id="code"
                    placeholder="e.g. WELCOME10"
                    maxLength={30}
                    autoCapitalize="characters"
                    {...form.register("code")}
                    onChange={(e) =>
                      form.setValue("code", e.target.value.toUpperCase(), {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  />
                </FormField>

                <FormField
                  label="Discount Type"
                  required
                  error={form.formState.errors.discountType?.message}
                >
                  <Select
                    value={discountType}
                    onValueChange={(v) =>
                      form.setValue(
                        "discountType",
                        v as "percentage" | "fixed",
                        { shouldDirty: true, shouldValidate: true },
                      )
                    }
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select discount type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              <FormField
                label="Description"
                htmlFor="description"
                error={form.formState.errors.description?.message}
              >
                <Textarea
                  id="description"
                  placeholder="Describe the offer and its intended use"
                  rows={3}
                  maxLength={300}
                  {...form.register("description")}
                />
              </FormField>
            </CardContent>
          </Card>

          {/* ── Discount Configuration ── */}
          <Card className="overflow-hidden">
            <CardHeader className="border-b px-6 py-5">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShoppingCart className="h-5 w-5" />
                Discount Configuration
              </CardTitle>
              <CardDescription>
                Set the discount amount and order requirements.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 p-6">
              <div className="grid gap-5 md:grid-cols-2">
                {/* Discount Value */}
                <FormField
                  label={
                    discountType === "percentage"
                      ? "Discount Percentage"
                      : "Discount Amount (₹)"
                  }
                  required
                  htmlFor="discountValue"
                  error={form.formState.errors.discountValue?.message}
                >
                  <div className="relative">
                    <Input
                      id="discountValue"
                      type="number"
                      min="0.01"
                      max={discountType === "percentage" ? 100 : undefined}
                      step="0.01"
                      className="pr-12"
                      {...form.register("discountValue", {
                        valueAsNumber: true,
                      })}
                    />
                    <span className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 text-sm">
                      {discountType === "percentage" ? "%" : "₹"}
                    </span>
                  </div>
                  {discountType === "percentage" && (
                    <p className="text-muted-foreground text-xs">
                      Enter a value from 0.01 to 100.
                    </p>
                  )}
                </FormField>

                {/* Min Order Amount */}
                <FormField
                  label="Minimum Order Amount (₹)"
                  htmlFor="minOrderAmount"
                  error={form.formState.errors.minOrderAmount?.message}
                >
                  <Input
                    id="minOrderAmount"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    {...form.register("minOrderAmount")}
                  />
                  <p className="text-muted-foreground text-xs">
                    Leave 0 if the coupon has no minimum requirement.
                  </p>
                </FormField>

                {/* Max Discount Amount (percentage only) */}
                {discountType === "percentage" && (
                  <FormField
                    label="Maximum Discount Amount (₹)"
                    htmlFor="maxDiscountAmount"
                    error={form.formState.errors.maxDiscountAmount?.message}
                  >
                    <div className="relative">
                      <Input
                        id="maxDiscountAmount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        className="pr-8"
                        placeholder="No cap"
                        {...form.register("maxDiscountAmount")}
                      />
                      <span className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 text-sm">
                        ₹
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Cap the maximum discount for percentage-based coupons.
                    </p>
                  </FormField>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ── Usage Limits ── */}
          <Card className="overflow-hidden">
            <CardHeader className="border-b px-6 py-5">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5" />
                Usage Limits
              </CardTitle>
              <CardDescription>
                Control how many times this coupon can be redeemed.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid gap-5 md:grid-cols-2">
                <FormField
                  label="Total Usage Limit"
                  htmlFor="usageLimit"
                  error={form.formState.errors.usageLimit?.message}
                >
                  <Input
                    id="usageLimit"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Unlimited"
                    {...form.register("usageLimit")}
                  />
                  <p className="text-muted-foreground text-xs">
                    Leave empty for unlimited redemptions.
                  </p>
                </FormField>

                {!isCreateMode && (
                  <FormField label="Usage Count">
                    <div className="flex h-10 items-center">
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium">
                        <TrendingDown className="text-muted-foreground h-4 w-4" />
                        {defaultValues?.usageCount ?? 0} redemptions so far
                      </span>
                    </div>
                  </FormField>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ── Validity & Availability ── */}
          <Card className="overflow-hidden">
            <CardHeader className="border-b px-6 py-5">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarClock className="h-5 w-5" />
                Validity &amp; Availability
              </CardTitle>
              <CardDescription>
                Control when the coupon is active and whether it can be used.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 p-6">
              <div className="grid gap-5 md:grid-cols-2">
                <FormField
                  label="Starts At"
                  htmlFor="startsAt"
                  error={form.formState.errors.startsAt?.message}
                >
                  <Input
                    id="startsAt"
                    type="date"
                    {...form.register("startsAt")}
                  />
                  <p className="text-muted-foreground text-xs">
                    Leave empty to activate immediately.
                  </p>
                </FormField>

                <FormField
                  label="Expires At"
                  htmlFor="expiresAt"
                  error={form.formState.errors.expiresAt?.message}
                >
                  <Input
                    id="expiresAt"
                    type="date"
                    {...form.register("expiresAt")}
                  />
                  <p className="text-muted-foreground text-xs">
                    Leave empty for a coupon with no expiry date.
                  </p>
                </FormField>

                <FormField label="Coupon Status">
                  <div className="flex h-10 items-center">
                    <span
                      className={
                        isActive
                          ? "inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-950 dark:text-green-300"
                          : "bg-muted text-muted-foreground inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
                      }
                    >
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Inactive coupons cannot be redeemed.
                  </p>
                </FormField>
              </div>

              <div className="border-t pt-5">
                <label className="hover:bg-muted/40 flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors">
                  <Checkbox
                    checked={isActive}
                    onCheckedChange={(checked) =>
                      form.setValue("isActive", checked === true, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    className="mt-0.5"
                  />
                  <span className="space-y-1">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <ShieldCheck className="h-4 w-4" />
                      Enable Coupon
                    </span>
                    <span className="text-muted-foreground block text-xs leading-relaxed">
                      Allow customers to redeem this coupon when all discount
                      and validity rules are satisfied.
                    </span>
                  </span>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>
      </FormWrapper>
    </FormProvider>
  );
}

// ---------------------------------------------------------------------------
// FormField helper
// ---------------------------------------------------------------------------
interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

function FormField({
  label,
  htmlFor,
  error,
  required = false,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
        {required && (
          <span className="ml-1 text-destructive" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
