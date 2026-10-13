"use client";

import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TicketPercent,
  ShoppingCart,
  CalendarClock,
  ShieldCheck,
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
import { CouponFormInput, couponFormSchema, CouponFormValues } from "../schemas";



interface CouponFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<Coupon>;
  onSubmit: (values: CouponFormValues) => void | Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

function toDateInput(value?: Date | string | null): string {
  if (!value) return "";

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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
      minimumOrderAmount: "",
      isActive: true,
      expiresAt: "",
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
      minimumOrderAmount: defaultValues.minimumOrderAmount ?? "",
      isActive: defaultValues.isActive ?? true,
      expiresAt: toDateInput(defaultValues.expiresAt),
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
          {/* Coupon information */}
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
                    placeholder="e.g. FESTIVE10"
                    maxLength={30}
                    autoCapitalize="characters"
                    {...form.register("code")}
                    onChange={(event) => {
                      form.setValue("code", event.target.value.toUpperCase(), {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                  />
                </FormField>

                <FormField
                  label="Discount Type"
                  required
                  error={form.formState.errors.discountType?.message}
                >
                  <Select
                    value={discountType}
                    onValueChange={(value) =>
                      form.setValue(
                        "discountType",
                        value as "percentage" | "fixed",
                        {
                          shouldDirty: true,
                          shouldValidate: true,
                        },
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

          {/* Discount configuration */}
          <Card className="overflow-hidden">
            <CardHeader className="border-b px-6 py-5">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShoppingCart className="h-5 w-5" />
                Discount Configuration
              </CardTitle>
              <CardDescription>
                Set the discount amount and minimum order requirement.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 p-6">
              <div className="grid gap-5 md:grid-cols-2">
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

                <FormField
                  label="Minimum Order Amount (₹)"
                  htmlFor="minimumOrderAmount"
                  error={form.formState.errors.minimumOrderAmount?.message}
                >
                  <Input
                    id="minimumOrderAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="No minimum"
                    {...form.register("minimumOrderAmount")}
                  />
                  <p className="text-muted-foreground text-xs">
                    Leave empty if the coupon has no minimum order value.
                  </p>
                </FormField>
              </div>
            </CardContent>
          </Card>

          {/* Validity and status */}
          <Card className="overflow-hidden">
            <CardHeader className="border-b px-6 py-5">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarClock className="h-5 w-5" />
                Validity & Availability
              </CardTitle>
              <CardDescription>
                Control when the coupon expires and whether it can be used.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 p-6">
              <div className="grid gap-5 md:grid-cols-2">
                <FormField
                  label="Expiry Date"
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
                          : "inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground"
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
