import { NextRequest, NextResponse } from "next/server";
import { couponsRepository } from "@/features/coupons/repository/coupon.repository";

/**
 * POST /api/coupons/validate
 * Validate a coupon code against a cart subtotal and return discount amount.
 * Public endpoint (called from storefront checkout).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const code =
      typeof body.code === "string" ? body.code.trim().toUpperCase() : "";
    const cartSubtotal =
      typeof body.cartSubtotal === "number" ? body.cartSubtotal : 0;

    if (!code) {
      return NextResponse.json(
        { valid: false, discountAmount: 0, message: "Coupon code is required" },
        { status: 400 },
      );
    }

    const coupon = await couponsRepository.findByCode(code);

    if (!coupon) {
      return NextResponse.json({
        valid: false,
        discountAmount: 0,
        message: "Coupon not found",
      });
    }

    if (!coupon.isActive) {
      return NextResponse.json({
        valid: false,
        discountAmount: 0,
        message: "This coupon is inactive",
      });
    }

    const now = Date.now();

    // Not yet started
    if (coupon.startsAt) {
      const startsAt =
        coupon.startsAt instanceof Date
          ? coupon.startsAt
          : (coupon.startsAt as { toDate?: () => Date }).toDate?.() ??
            new Date(String(coupon.startsAt));
      if (startsAt.getTime() > now) {
        return NextResponse.json({
          valid: false,
          discountAmount: 0,
          message: "This coupon is not yet active",
        });
      }
    }

    // Expired
    if (coupon.expiresAt) {
      const expiresAt =
        coupon.expiresAt instanceof Date
          ? coupon.expiresAt
          : (coupon.expiresAt as { toDate?: () => Date }).toDate?.() ??
            new Date(String(coupon.expiresAt));
      if (expiresAt.getTime() < now) {
        return NextResponse.json({
          valid: false,
          discountAmount: 0,
          message: "This coupon has expired",
        });
      }
    }

    // Usage limit
    if (
      coupon.usageLimit !== null &&
      coupon.usageCount >= coupon.usageLimit
    ) {
      return NextResponse.json({
        valid: false,
        discountAmount: 0,
        message: "This coupon has reached its usage limit",
      });
    }

    // Minimum order
    if (cartSubtotal < coupon.minOrderAmount) {
      return NextResponse.json({
        valid: false,
        discountAmount: 0,
        message: `Minimum order amount of ₹${coupon.minOrderAmount} required`,
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = (cartSubtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount !== null) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    // Discount cannot exceed cart subtotal
    discountAmount = Math.min(discountAmount, cartSubtotal);

    return NextResponse.json({
      valid: true,
      coupon,
      discountAmount: Math.round(discountAmount * 100) / 100,
      message: `Coupon applied! You save ₹${discountAmount.toFixed(2)}`,
    });
  } catch (error) {
    console.error("Failed to validate coupon:", error);
    return NextResponse.json(
      { valid: false, discountAmount: 0, message: "Failed to validate coupon" },
      { status: 500 },
    );
  }
}
