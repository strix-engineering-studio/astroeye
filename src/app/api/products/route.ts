import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { getAdminSession } from "@/lib/admin-auth";
import { productsRepository } from "@/features/products/repository/product.repository";
import { productFormSchema } from "@/src/features/products";


/**
 * GET /api/products
 *
 * Public listing of published products, or all products if admin requests all=true.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get("all") === "true";
    const categoryId = searchParams.get("categoryId") || searchParams.get("category");
    const search = searchParams.get("search") || searchParams.get("q");

    // If requesting all products (including unpublished/drafts), verify admin session
    if (showAll) {
      const adminSession = await getAdminSession();
      if (!adminSession) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const allProducts = await productsRepository.findAll();
      return NextResponse.json(allProducts);
    }

    // Public catalog: fetch products
    let products = await productsRepository.findAll();

    // Storefront only exposes published products
    products = products.filter((p) => p.isPublished === true);

    if (categoryId) {
      products = products.filter(
        (p) => p.categoryId.toLowerCase() === categoryId.toLowerCase(),
      );
    }

    if (search) {
      const term = search.toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          (p.description && p.description.toLowerCase().includes(term)),
      );
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/products
 *
 * Create a new product (admin only).
 */
export async function POST(request: NextRequest) {
  const adminSession = await getAdminSession();

  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = productFormSchema.parse(body);

    const createdProduct = await productsRepository.create(data);

    return NextResponse.json(createdProduct, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error.flatten() },
        { status: 400 },
      );
    }

    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create product" },
      { status: 500 },
    );
  }
}
