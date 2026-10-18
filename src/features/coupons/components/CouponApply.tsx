"use client";

import { useState } from "react";
import { Loader2, Tag, CheckCircle2, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { couponsService } from "@/features/coupons/services/coupon.service";
import { CouponValidation } from "@/features/coupons/types/coupon.type";

interface CouponApplyProps {
  cartSubtotal: number;
  onApply: (validation: CouponValidation) => void;
  onRemove: () => void;
  appliedCode?: string;
}

/**
 * Coupon apply widget for the www cart/checkout flow.
 */
export function CouponApply({
  cartSubtotal,
  onApply,
  onRemove,
  appliedCode,
}: CouponApplyProps) {
  const [code, setCode] = useState(appliedCode ?? "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CouponValidation | null>(null);

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const validation = await couponsService.validateCoupon(
        code.trim(),
        cartSubtotal,
      );
      setResult(validation);
      if (validation.valid) {
        onApply(validation);
      }
    } catch {
      setResult({
        valid: false,
        discountAmount: 0,
        message: "Failed to validate coupon. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setCode("");
    setResult(null);
    onRemove();
  };

  const isApplied = result?.valid === true;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Tag className="text-muted-foreground h-4 w-4" />
        <span className="text-sm font-medium">Apply Coupon</span>
      </div>

      <div className="flex gap-2">
        <Input
          id="coupon-code-input"
          placeholder="Enter coupon code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setResult(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") void handleApply();
          }}
          disabled={isApplied || loading}
          className="font-mono tracking-widest"
          autoCapitalize="characters"
          maxLength={30}
        />

        {isApplied ? (
          <Button
            type="button"
            variant="outline"
            onClick={handleRemove}
            className="shrink-0"
          >
            Remove
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleApply}
            disabled={!code.trim() || loading}
            className="shrink-0"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Apply"
            )}
          </Button>
        )}
      </div>

      {/* Feedback */}
      {result && (
        <div
          className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${
            result.valid
              ? "border-emerald-500/30 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
              : "border-destructive/30 bg-destructive/5 text-destructive"
          }`}
        >
          {result.valid ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <span>{result.message}</span>
        </div>
      )}
    </div>
  );
}
