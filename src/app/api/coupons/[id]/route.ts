import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { getAdminSession } from "@/lib/admin-auth";
import { couponsRepository } from "@/features/coupons/repository/coupon.repository";
import { updateCouponSchema } from "@/features/coupons/schemas/coupon.schema";

interface Params {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/coupons/[id]
 * Fetch a single coupon by ID (admin only).
 */
export async function GET(_request: NextRequest, { params }: Params) {
  const adminSession = await getAdminSession();
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const coupon = await couponsRepository.findById(id);
    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }
    return NextResponse.json(coupon);
  } catch (error) {
    console.error("Failed to fetch coupon:", error);
    return NextResponse.json(
      { error: "Failed to fetch coupon" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/coupons/[id]
 * Update a coupon (admin only).
 */
export async function PATCH(request: NextRequest, { params }: Params) {
  const adminSession = await getAdminSession();
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await request.json();

    // Coerce date strings
    if (body.startsAt && typeof body.startsAt === "string") {
      body.startsAt = new Date(body.startsAt);
    }
    if (body.expiresAt && typeof body.expiresAt === "string") {
      body.expiresAt = new Date(body.expiresAt);
    }

    const data = updateCouponSchema.parse(body);

    // If code changed, check for duplicate
    if (data.code) {
      const existing = await couponsRepository.findByCode(data.code);
      if (existing && existing.id !== id) {
        return NextResponse.json(
          { error: `Coupon code "${data.code}" already exists` },
          { status: 409 },
        );
      }
    }

    const coupon = await couponsRepository.update(id, data);
    return NextResponse.json(coupon);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error.flatten() },
        { status: 400 },
      );
    }
    if (error instanceof Error && error.message === "Coupon not found") {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }
    console.error("Failed to update coupon:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update coupon",
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/coupons/[id]
 * Delete a coupon (admin only).
 */
export async function DELETE(_request: NextRequest, { params }: Params) {
  const adminSession = await getAdminSession();
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await couponsRepository.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Coupon not found") {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }
    console.error("Failed to delete coupon:", error);
    return NextResponse.json(
      { error: "Failed to delete coupon" },
      { status: 500 },
    );
  }
}
