import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { getAdminSession } from "@/lib/admin-auth";
import { productsRepository } from "@/features/products/repository/product.repository";
import { updateProductSchema } from "@/features/products/schemas/product.schema";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/products/:id
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;
    const product = await productsRepository.findById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (!product.isPublished) {
      const adminSession = await getAdminSession();
      if (!adminSession) {
        return NextResponse.json(
          { error: "Product is not available" },
          { status: 404 },
        );
      }
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/products/:id (Admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext,
) {
  const adminSession = await getAdminSession();

  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const existing = await productsRepository.findById(id);

    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const body = await request.json();
    const data = updateProductSchema.parse(body);

    const updated = await productsRepository.update(id, data);
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error.flatten() },
        { status: 400 },
      );
    }

    console.error("Failed to update product:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update product" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/products/:id (Admin only)
 */
export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext,
) {
  const adminSession = await getAdminSession();

  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const existing = await productsRepository.findById(id);

    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await productsRepository.delete(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
