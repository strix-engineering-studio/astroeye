
"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  CreditCard,
  ExternalLink,
  MapPin,
  Package,
  RefreshCcw,
  RotateCcw,
  ShoppingBag,
  Truck,
  UserRound,
} from "lucide-react";

import {
  useOrderQuery,
  useUpdateOrderStatusMutation,
  useCompleteOrderMutation,
  useRefundOrderMutation,
} from "../hooks/useOrders";

import type { Order } from "../types/orders.types";
import { OrderStatus } from "../types/orders.enums";

import PageWrapper from "@/components/wrappers/PageWrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatCurrency(
  amount: number | undefined,
  currency = "INR",
): string {
  if (amount === undefined || !Number.isFinite(amount)) {
    return "-";
  }

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("en-IN")}`;
  }
}

function formatDate(value?: Date | string): string {
  if (!value) return "-";

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatLabel(value?: string): string {
  if (!value) return "Unknown";

  return value
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getOrderStatusClass(status?: string): string {
  switch (status?.toUpperCase()) {
    case "COMPLETED":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600";
    case "PENDING":
      return "border-amber-500/20 bg-amber-500/10 text-amber-600";
    case "FAILED":
      return "border-red-500/20 bg-red-500/10 text-red-600";
    case "REFUNDED":
      return "border-purple-500/20 bg-purple-500/10 text-purple-600";
    case "CANCELLED":
      return "border-border bg-muted text-muted-foreground";
    default:
      return "border-blue-500/20 bg-blue-500/10 text-blue-600";
  }
}

function getPaymentStatusClass(status?: string): string {
  switch (status?.toUpperCase()) {
    case "PAID":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600";
    case "FAILED":
      return "border-red-500/20 bg-red-500/10 text-red-600";
    case "PROCESSING":
      return "border-blue-500/20 bg-blue-500/10 text-blue-600";
    default:
      return "border-amber-500/20 bg-amber-500/10 text-amber-600";
  }
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 py-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="break-words text-sm font-medium sm:max-w-[65%] sm:text-right">
        {value ?? "-"}
      </span>
    </div>
  );
}

function SectionHeading({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        {icon}
      </div>

      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Loading                                                                    */
/* -------------------------------------------------------------------------- */

function OrderDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-56 animate-pulse rounded bg-muted" />
        <div className="h-4 w-72 animate-pulse rounded bg-muted" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-64 animate-pulse rounded-xl border bg-muted/30"
            />
          ))}
        </div>

        <div className="h-96 animate-pulse rounded-xl border bg-muted/30" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Order Details Page                                                         */
/* -------------------------------------------------------------------------- */

export const ConsoleOrderDetailsPage: React.FC = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const orderId = params.id;

  const [selectedStatus, setSelectedStatus] = useState<
    OrderStatus | undefined
  >(undefined);

  const {
    data: order,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useOrderQuery(orderId);

  const updateStatusMutation = useUpdateOrderStatusMutation();
  const completeOrderMutation = useCompleteOrderMutation();
  const refundOrderMutation = useRefundOrderMutation();

  const availableStatuses = useMemo(
    () =>
      Array.from(
        new Set(Object.values(OrderStatus).filter(
          (value): value is OrderStatus => typeof value === "string",
        )),
      ),
    [],
  );

  if (isLoading) {
    return (
      <PageWrapper className="animate-fade-in p-4 sm:p-6">
        <OrderDetailsSkeleton />
      </PageWrapper>
    );
  }

  if (isError || !order) {
    return (
      <PageWrapper className="animate-fade-in p-4 sm:p-6">
        <div className="mx-auto max-w-2xl space-y-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/orders")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Button>

          <Alert variant="destructive">
            <AlertTitle>Unable to load order</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "The order could not be found or loaded."}
            </AlertDescription>
          </Alert>

          <Button onClick={() => refetch()} variant="outline">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </PageWrapper>
    );
  }

  const currentStatus = String(order.status);
  const currentPaymentStatus = order.paymentStatus ?? "PENDING";

  const isRefunded =
    currentStatus.toUpperCase() === "REFUNDED" ||
    Boolean(order.refundedAt);

  const isCompleted = currentStatus.toUpperCase() === "COMPLETED";

  const isBusy =
    updateStatusMutation.isPending ||
    completeOrderMutation.isPending ||
    refundOrderMutation.isPending;

  const itemCount =
    order.items?.reduce((total, item) => total + item.quantity, 0) ?? 0;

  const calculatedSubtotal =
    order.subtotal ??
    order.items?.reduce((total, item) => total + item.lineTotal, 0) ??
    order.amount - (order.shippingAmount ?? 0);

  const handleUpdateStatus = () => {
    if (!selectedStatus || selectedStatus === order.status) return;

    updateStatusMutation.mutate({
      id: order.id,
      data: { status: selectedStatus },
    });
  };

  const handleCompleteOrder = () => {
    if (
      !window.confirm(
        "Are you sure you want to mark this order as completed?",
      )
    ) {
      return;
    }

    completeOrderMutation.mutate({
      id: order.id,
    });
  };

  const handleRefundOrder = () => {
    if (
      !window.confirm(
        "Are you sure you want to initiate the refund action for this order?",
      )
    ) {
      return;
    }

    refundOrderMutation.mutate(order.id);
  };

  return (
    <PageWrapper className="animate-fade-in p-4 sm:p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/orders")}
              className="-ml-2 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Orders
            </Button>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                  Order Details
                </h1>

                <Badge
                  variant="outline"
                  className={getOrderStatusClass(currentStatus)}
                >
                  {formatLabel(currentStatus)}
                </Badge>
              </div>

              <p className="mt-2 break-all font-mono text-sm text-muted-foreground">
                Order ID: {order.id}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Created on {formatDate(order.createdAt)}
                {isFetching && " · Refreshing..."}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-2"
          >
            <RefreshCcw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-primary/10 p-3">
                <ShoppingBag className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">Order Total</p>
                <p className="truncate text-xl font-bold">
                  {formatCurrency(order.amount, order.currency)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-muted p-3">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Items</p>
                <p className="text-xl font-bold">{itemCount}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-emerald-500/10 p-3">
                <CreditCard className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">Payment</p>
                <Badge
                  variant="outline"
                  className={getPaymentStatusClass(currentPaymentStatus)}
                >
                  {formatLabel(currentPaymentStatus)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-muted p-3">
                <Clock3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-sm font-semibold">
                  {formatDate(order.updatedAt)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid items-start gap-6 xl:grid-cols-3">
          {/* Main content */}
          <div className="space-y-6 xl:col-span-2">
            {/* Items */}
            <Card>
              <CardHeader>
                <SectionHeading
                  icon={<Package className="h-4 w-4" />}
                  title="Order Items"
                  description="Products and quantities included in this order."
                />
              </CardHeader>

              <CardContent>
                {order.items?.length ? (
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <React.Fragment
                        key={`${item.productId}-${item.sku ?? index}`}
                      >
                        {index > 0 && <Separator />}

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex min-w-0 items-start gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border bg-muted/40">
                              <Package className="h-5 w-5 text-muted-foreground" />
                            </div>

                            <div className="min-w-0">
                              <p className="break-words text-sm font-semibold">
                                {item.name}
                              </p>

                              {item.sku && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                  SKU: {item.sku}
                                </p>
                              )}

                              <p className="mt-1 text-xs text-muted-foreground">
                                {formatCurrency(
                                  item.unitAmount,
                                  order.currency,
                                )}{" "}
                                × {item.quantity}
                              </p>
                            </div>
                          </div>

                          <p className="shrink-0 text-sm font-semibold sm:text-right">
                            {formatCurrency(
                              item.lineTotal,
                              order.currency,
                            )}
                          </p>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed p-8 text-center">
                    <Package className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-3 text-sm font-medium">
                      No item details available
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      This order does not contain an items list.
                    </p>
                  </div>
                )}

                <Separator className="my-5" />

                <div className="ml-auto max-w-sm space-y-3">
                  <InfoRow
                    label="Subtotal"
                    value={formatCurrency(
                      calculatedSubtotal,
                      order.currency,
                    )}
                  />

                  <InfoRow
                    label="Shipping"
                    value={formatCurrency(
                      order.shippingAmount ?? 0,
                      order.currency,
                    )}
                  />

                  <Separator />

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold">Order Total</span>
                    <span className="text-xl font-bold">
                      {formatCurrency(order.amount, order.currency)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer */}
            <Card>
              <CardHeader>
                <SectionHeading
                  icon={<UserRound className="h-4 w-4" />}
                  title="Customer Information"
                  description="Customer details associated with the order."
                />
              </CardHeader>

              <CardContent className="divide-y">
                <InfoRow
                  label="Customer Name"
                  value={order.customer?.name || "Not provided"}
                />
                <InfoRow
                  label="Email"
                  value={order.customer?.email || "Not provided"}
                />
                <InfoRow
                  label="Phone"
                  value={order.customer?.phone || "Not provided"}
                />
                <InfoRow label="User ID" value={order.userId} />
              </CardContent>
            </Card>

            {/* Shipping */}
            <Card>
              <CardHeader>
                <SectionHeading
                  icon={<MapPin className="h-4 w-4" />}
                  title="Shipping Address"
                  description="Delivery address recorded on this order."
                />
              </CardHeader>

              <CardContent>
                {order.shippingAddress ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      {order.shippingAddress.line1}
                    </p>

                    {order.shippingAddress.line2 && (
                      <p className="text-sm text-muted-foreground">
                        {order.shippingAddress.line2}
                      </p>
                    )}

                    <p className="text-sm text-muted-foreground">
                      {order.shippingAddress.city}
                      {order.shippingAddress.state
                        ? `, ${order.shippingAddress.state}`
                        : ""}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Postal Code: {order.shippingAddress.postalCode}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No shipping address recorded.
                  </p>
                )}

                <div className="mt-4 rounded-lg bg-muted/40 p-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    Shipment tracking
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Shipment and tracking details are not present in the
                    current Order type.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Order Actions</CardTitle>
                <CardDescription>
                  Manage the order lifecycle.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Update order status
                  </label>

                  <Select
                    value={selectedStatus ?? String(order.status)}
                    onValueChange={(value) =>
                      setSelectedStatus(value as OrderStatus)
                    }
                    disabled={isBusy}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>

                    <SelectContent>
                      {availableStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {formatLabel(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    className="w-full"
                    onClick={handleUpdateStatus}
                    disabled={
                      isBusy ||
                      !selectedStatus ||
                      selectedStatus === order.status
                    }
                  >
                    Update Status
                  </Button>
                </div>

                <Separator />

                <Button
                  className="w-full gap-2"
                  variant="outline"
                  onClick={handleCompleteOrder}
                  disabled={isBusy || isCompleted || isRefunded}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {completeOrderMutation.isPending
                    ? "Completing..."
                    : "Mark as Completed"}
                </Button>

                <Button
                  className="w-full gap-2"
                  variant="outline"
                  onClick={handleRefundOrder}
                  disabled={
                    isBusy ||
                    isRefunded ||
                    currentPaymentStatus !== "PAID"
                  }
                >
                  <RotateCcw className="h-4 w-4" />
                  {refundOrderMutation.isPending
                    ? "Processing..."
                    : "Refund Order"}
                </Button>

                {currentPaymentStatus !== "PAID" && !isRefunded && (
                  <p className="text-xs text-muted-foreground">
                    Refund action is available only when the recorded payment
                    status is PAID.
                  </p>
                )}

                <p className="text-xs text-muted-foreground">
                  Only use these actions after verifying the payment and
                  order state. The backend must validate allowed transitions.
                </p>
              </CardContent>
            </Card>

            {/* Payment details */}
            <Card>
              <CardHeader>
                <SectionHeading
                  icon={<CreditCard className="h-4 w-4" />}
                  title="Payment Details"
                />
              </CardHeader>

              <CardContent className="divide-y">
                <InfoRow
                  label="Payment Status"
                  value={
                    <Badge
                      variant="outline"
                      className={getPaymentStatusClass(
                        currentPaymentStatus,
                      )}
                    >
                      {formatLabel(currentPaymentStatus)}
                    </Badge>
                  }
                />

                <InfoRow
                  label="Payment Method"
                  value={formatLabel(order.paymentMethod)}
                />

                <InfoRow
                  label="Payment ID"
                  value={
                    order.paymentId ? (
                      <span className="break-all font-mono text-xs">
                        {order.paymentId}
                      </span>
                    ) : (
                      "Not available"
                    )
                  }
                />

                <InfoRow
                  label="Currency"
                  value={order.currency}
                />

                <InfoRow
                  label="Amount"
                  value={formatCurrency(order.amount, order.currency)}
                />
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <SectionHeading
                  icon={<Clock3 className="h-4 w-4" />}
                  title="Order Timeline"
                  description="Recorded lifecycle timestamps."
                />
              </CardHeader>

              <CardContent>
                <div className="space-y-5">
                  <div className="flex gap-3">
                    <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm font-medium">Order Created</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDate(order.updatedAt)}
                      </p>
                    </div>
                  </div>

                  {order.completedAt && (
                    <div className="flex gap-3">
                      <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
                      <div>
                        <p className="text-sm font-medium">Completed</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDate(order.completedAt)}
                        </p>
                      </div>
                    </div>
                  )}

                  {order.refundedAt && (
                    <div className="flex gap-3">
                      <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-purple-500" />
                      <div>
                        <p className="text-sm font-medium">Refunded</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDate(order.refundedAt)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Related records */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Related Records</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {order.productId && (
                  <Link
                    href={`/products/${order.productId}`}
                    className="flex items-center justify-between gap-3 text-sm hover:underline"
                  >
                    <span className="truncate">Product</span>
                    <ExternalLink className="h-4 w-4 shrink-0" />
                  </Link>
                )}

                {order.resourceId && (
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span>Resource ID</span>
                    <span className="max-w-[60%] truncate font-mono text-xs">
                      {order.resourceId}
                    </span>
                  </div>
                )}

                {order.creatorId && (
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span>Creator ID</span>
                    <span className="max-w-[60%] truncate font-mono text-xs">
                      {order.creatorId}
                    </span>
                  </div>
                )}

                {!order.productId &&
                  !order.resourceId &&
                  !order.creatorId && (
                    <p className="text-sm text-muted-foreground">
                      No related records available.
                    </p>
                  )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ConsoleOrderDetailsPage;
