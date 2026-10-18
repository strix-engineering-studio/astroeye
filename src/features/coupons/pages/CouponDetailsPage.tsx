"use client";

import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  Edit,
  Percent,
  ShieldCheck,
  ShieldX,
  Tag,
  TicketPercent,
  Trash2,
  ShoppingCart,
  FileText,
  Users,
  TrendingUp,
  PlayCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coupon } from "../types/coupon.type";

interface CouponDetailsPageProps {
  coupon: Coupon;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

export function CouponDetailsPage({
  coupon,
  onEdit,
  onDelete,
  onToggleStatus,
}: CouponDetailsPageProps) {
  // ── Date helpers ──────────────────────────────────────────────────────────
  const toJsDate = (value: unknown): Date | null => {
    if (!value) return null;
    if (value instanceof Date) return value;
    if (typeof value === "object" && "toDate" in (value as object)) {
      return (value as { toDate: () => Date }).toDate();
    }
    const d = new Date(String(value));
    return Number.isNaN(d.getTime()) ? null : d;
  };

  const expiryDate = toJsDate(coupon.expiresAt);
  const startsAtDate = toJsDate(coupon.startsAt);
  const isExpired =
    expiryDate !== null && expiryDate.getTime() < Date.now();
  const isCurrentlyValid = coupon.isActive && !isExpired;

  const formatDate = (value: unknown) => {
    const d = toJsDate(value);
    if (!d) return "-";
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (value: unknown) => {
    const d = toJsDate(value);
    if (!d) return "-";
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (value?: number | null) => {
    if (value === undefined || value === null) return "No minimum";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);
  };

  const discountLabel =
    coupon.discountType === "percentage"
      ? `${coupon.discountValue}%`
      : formatCurrency(coupon.discountValue);

  const statusLabel = !coupon.isActive
    ? "Inactive"
    : isExpired
      ? "Expired"
      : "Active";

  const statusClass = !coupon.isActive
    ? "bg-muted text-muted-foreground"
    : isExpired
      ? "border-amber-500/20 bg-amber-500/10 text-amber-600"
      : "border-emerald-500/20 bg-emerald-500/10 text-emerald-600";

  // Usage progress
  const usagePct =
    coupon.usageLimit !== null && coupon.usageLimit > 0
      ? Math.min((coupon.usageCount / coupon.usageLimit) * 100, 100)
      : null;

  return (
    <div className="container mx-auto max-w-7xl space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Go back"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {coupon.code}
              </h1>
              <Badge variant="outline" className={statusClass}>
                {statusLabel}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1 text-sm">
              Coupon details and promotional settings
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:justify-end">
          <Button type="button" variant="outline" onClick={onToggleStatus}>
            {coupon.isActive ? (
              <>
                <ShieldX className="mr-2 h-4 w-4" />
                Deactivate
              </>
            ) : (
              <>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Activate
              </>
            )}
          </Button>

          <Button type="button" onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Coupon
          </Button>

          <Button type="button" variant="destructive" onClick={onDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* ── Coupon Overview ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TicketPercent className="h-5 w-5" />
            Coupon Overview
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem
            icon={<Tag className="h-4 w-4" />}
            label="Coupon Code"
            value={coupon.code}
          />

          <InfoItem
            icon={
              coupon.discountType === "percentage" ? (
                <Percent className="h-4 w-4" />
              ) : (
                <CircleDollarSign className="h-4 w-4" />
              )
            }
            label="Discount"
            value={discountLabel}
          />

          <InfoItem
            icon={<TicketPercent className="h-4 w-4" />}
            label="Discount Type"
            value={
              coupon.discountType === "percentage"
                ? "Percentage Discount"
                : "Fixed Amount Discount"
            }
          />

          <InfoItem
            icon={<ShoppingCart className="h-4 w-4" />}
            label="Minimum Order Amount"
            value={
              coupon.minOrderAmount
                ? formatCurrency(coupon.minOrderAmount)
                : "No minimum"
            }
          />

          {coupon.discountType === "percentage" && (
            <InfoItem
              icon={<CircleDollarSign className="h-4 w-4" />}
              label="Max Discount Cap"
              value={
                coupon.maxDiscountAmount !== null
                  ? formatCurrency(coupon.maxDiscountAmount)
                  : "No cap"
              }
            />
          )}

          <InfoItem
            icon={
              isCurrentlyValid ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <ShieldX className="h-4 w-4" />
              )
            }
            label="Current Status"
            value={statusLabel}
          />
        </CardContent>
      </Card>

      {/* ── Usage ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Usage Statistics
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2">
          <InfoItem
            icon={<TrendingUp className="h-4 w-4" />}
            label="Total Redemptions"
            value={String(coupon.usageCount)}
          />

          <InfoItem
            icon={<Users className="h-4 w-4" />}
            label="Usage Limit"
            value={
              coupon.usageLimit !== null
                ? `${coupon.usageCount} / ${coupon.usageLimit}`
                : "Unlimited"
            }
          />

          {usagePct !== null && (
            <div className="sm:col-span-2">
              <p className="text-muted-foreground mb-2 text-xs">
                Usage: {usagePct.toFixed(0)}%
              </p>
              <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                <div
                  className="h-2 rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${usagePct}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Description ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Description
          </CardTitle>
        </CardHeader>

        <CardContent>
          {coupon.description ? (
            <p className="text-muted-foreground text-sm leading-6">
              {coupon.description}
            </p>
          ) : (
            <p className="text-muted-foreground text-sm">
              No description has been added for this coupon.
            </p>
          )}
        </CardContent>
      </Card>

      {/* ── Validity ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Validity Information
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2">
          <InfoItem
            icon={<PlayCircle className="h-4 w-4" />}
            label="Starts At"
            value={
              startsAtDate ? formatDateTime(startsAtDate) : "Immediately"
            }
          />

          <InfoItem
            icon={<Calendar className="h-4 w-4" />}
            label="Expires At"
            value={
              coupon.expiresAt
                ? formatDateTime(coupon.expiresAt)
                : "No expiry date"
            }
          />

          <InfoItem
            icon={<ShieldCheck className="h-4 w-4" />}
            label="Coupon Enabled"
            value={coupon.isActive ? "Yes" : "No"}
          />
        </CardContent>
      </Card>

      {/* ── Record Info ── */}
      <Card>
        <CardHeader>
          <CardTitle>Record Information</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2">
          <InfoItem
            icon={<Calendar className="h-4 w-4" />}
            label="Created At"
            value={formatDateTime(coupon.createdAt)}
          />

          <InfoItem
            icon={<Calendar className="h-4 w-4" />}
            label="Last Updated"
            value={formatDateTime(coupon.updatedAt)}
          />

          <InfoItem
            icon={<Tag className="h-4 w-4" />}
            label="Coupon ID"
            value={coupon.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// InfoItem helper
// ---------------------------------------------------------------------------
interface InfoItemProps {
  icon?: React.ReactNode;
  label: string;
  value?: React.ReactNode;
}

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className="min-w-0 rounded-lg border p-4">
      <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm">
        {icon}
        <span>{label}</span>
      </div>
      <div className="break-words font-medium">{value ?? "-"}</div>
    </div>
  );
}
