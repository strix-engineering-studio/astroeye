"use client";

import { useMemo, useState } from "react";
import {
  TicketPercent,
  Search,
  Clock,
  ShoppingCart,
  Copy,
  Check,
} from "lucide-react";
import { useActiveCouponsQuery } from "@/features/coupons/hooks/useCoupon";
import { Coupon } from "@/features/coupons/types/coupon.type";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

function toDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "object" && "toDate" in (value as object)) {
    return (value as { toDate: () => Date }).toDate();
  }
  const d = new Date(String(value));
  return Number.isNaN(d.getTime()) ? null : d;
}

function CouponCard({ coupon }: { coupon: Coupon }) {
  const [copied, setCopied] = useState(false);

  const expiryDate = toDate(coupon.expiresAt);
  const isExpired = expiryDate ? expiryDate.getTime() < Date.now() : false;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      const el = document.createElement("input");
      el.value = coupon.code;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const discountLabel =
    coupon.discountType === "percentage"
      ? `${coupon.discountValue}% OFF`
      : `₹${coupon.discountValue} OFF`;

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-200 hover:shadow-md ${
        isExpired ? "opacity-60" : ""
      }`}
    >
      {/* Coupon notch effect */}
      <div className="flex items-stretch">
        {/* Left colour block */}
        <div className="flex min-w-[100px] flex-col items-center justify-center bg-primary/10 px-4 py-6">
          <TicketPercent className="mb-2 h-7 w-7 text-primary" />
          <span className="text-center text-xs font-semibold text-primary">
            {coupon.discountType === "percentage" ? "% OFF" : "₹ OFF"}
          </span>
        </div>

        {/* Dashed divider */}
        <div className="flex items-center">
          <div className="mx-2 h-full border-l-2 border-dashed border-border" />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between gap-3 px-4 py-5">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-2xl font-extrabold tracking-widest text-foreground">
                {coupon.code}
              </span>
              {isExpired && (
                <Badge variant="outline" className="border-amber-400 text-amber-600 text-xs">
                  Expired
                </Badge>
              )}
            </div>

            <p className="text-xl font-bold text-primary">{discountLabel}</p>

            {coupon.description && (
              <p className="text-muted-foreground text-sm">
                {coupon.description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {coupon.minOrderAmount > 0 && (
              <span className="flex items-center gap-1">
                <ShoppingCart className="h-3.5 w-3.5" />
                Min. order ₹{coupon.minOrderAmount}
              </span>
            )}

            {expiryDate && !isExpired && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Expires{" "}
                {expiryDate.toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}

            {coupon.usageLimit !== null && (
              <span className="flex items-center gap-1">
                {coupon.usageLimit - coupon.usageCount} uses left
              </span>
            )}
          </div>
        </div>

        {/* Copy button */}
        <div className="flex items-center pr-4">
          <button
            type="button"
            aria-label={`Copy coupon code ${coupon.code}`}
            onClick={handleCopy}
            disabled={isExpired}
            className="flex h-10 w-10 items-center justify-center rounded-xl border bg-background transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-500" />
            ) : (
              <Copy className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CouponsPage() {
  const { data: coupons = [], isLoading } = useActiveCouponsQuery();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return coupons;
    return coupons.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q),
    );
  }, [coupons, search]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10 space-y-2 text-center">
        <div className="mb-3 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            <TicketPercent className="h-4 w-4" />
            Exclusive Offers
          </span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">
          Available Coupons
        </h1>
        <p className="text-muted-foreground text-lg">
          Copy a code and paste it at checkout to save on your order.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        <Input
          id="coupon-search"
          placeholder="Search coupons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && filtered.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <TicketPercent className="text-muted-foreground h-12 w-12" />
          <p className="text-muted-foreground text-lg font-medium">
            {search ? "No coupons match your search." : "No active coupons available right now."}
          </p>
        </div>
      )}

      {/* Coupon list */}
      {!isLoading && filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
        </div>
      )}
    </main>
  );
}
