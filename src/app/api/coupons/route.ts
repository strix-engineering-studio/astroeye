import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { getAdminSession } from "@/lib/admin-auth";
import { couponsRepository } from "@/features/coupons/repository/coupon.repository";
import { createCouponSchema } from "@/features/coupons/schemas/coupon.schema";

/**
 * GET /api/coupons
 * Returns all coupons (admin) or only active ones (?active=true, public).
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";

    if (activeOnly) {
      const coupons = await couponsRepository.findActive();
      return NextResponse.json(coupons);
    }

    // Full list requires admin auth
    const adminSession = await getAdminSession();
    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const coupons = await couponsRepository.findAll();
    return NextResponse.json(coupons);
  } catch (error) {
    console.error("Failed to fetch coupons:", error);
    return NextResponse.json(
      { error: "Failed to fetch coupons" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/coupons
 * Create a new coupon (admin only).
 */
export async function POST(request: NextRequest) {
  const adminSession = await getAdminSession();
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Coerce date strings from JSON back to Date objects for Zod
    if (body.startsAt && typeof body.startsAt === "string") {
      body.startsAt = new Date(body.startsAt);
    }
    if (body.expiresAt && typeof body.expiresAt === "string") {
      body.expiresAt = new Date(body.expiresAt);
    }

    const data = createCouponSchema.parse(body);

    // Check for duplicate code
    const existing = await couponsRepository.findByCode(data.code);
    if (existing) {
      return NextResponse.json(
        { error: `Coupon code "${data.code}" already exists` },
        { status: 409 },
      );
    }

    const coupon = await couponsRepository.create({
      ...data,
      startsAt: data.startsAt ?? null,
      expiresAt: data.expiresAt ?? null,
      maxDiscountAmount: data.maxDiscountAmount ?? null,
      usageLimit: data.usageLimit ?? null,
    });

    return NextResponse.json(coupon, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error.flatten() },
        { status: 400 },
      );
    }
    console.error("Failed to create coupon:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create coupon",
      },
      { status: 500 },
    );
  }
}
