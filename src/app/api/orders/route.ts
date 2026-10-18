import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { ordersRepository } from "@/features/orders/repository/orders.repository";
import { createOrderSchema } from "@/features/orders/schemas";

import type { Order, OrderFilters } from "@/features/orders/types/orders.types";

import { verifySession } from "@/lib/auth/session";
import { OrderStatus } from "@/features/orders";
import { adminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/constants/COLLECTIONS";
import { FieldValue } from "firebase-admin/firestore";
import crypto from "crypto";

/**
 * GET /api/orders
 *
 * Get all orders with optional filters.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse filters from query params
    const filters: OrderFilters = {
      search: searchParams.get("search") || undefined,

      userId: searchParams.get("userId") || undefined,

      resourceId: searchParams.get("resourceId") || undefined,

      creatorId: searchParams.get("creatorId") || undefined,

      status: (searchParams.get("status") as OrderStatus) || undefined,

      paymentMethod: searchParams.get("paymentMethod") || undefined,

      currency: searchParams.get("currency") || undefined,

      minAmount: searchParams.get("minAmount")
        ? Number(searchParams.get("minAmount"))
        : undefined,

      maxAmount: searchParams.get("maxAmount")
        ? Number(searchParams.get("maxAmount"))
        : undefined,

      createdAfter: searchParams.get("createdAfter") || undefined,

      createdBefore: searchParams.get("createdBefore") || undefined,

      sortBy:
        (searchParams.get("sortBy") as OrderFilters["sortBy"]) || undefined,

      sortOrder:
        (searchParams.get("sortOrder") as OrderFilters["sortOrder"]) ||
        undefined,

      page: searchParams.get("page")
        ? Number(searchParams.get("page"))
        : undefined,

      limit: searchParams.get("limit")
        ? Number(searchParams.get("limit"))
        : undefined,
    };

    let orders = await ordersRepository.findAll();

    // ------------------------------------------------------------------------
    // Search
    // ------------------------------------------------------------------------

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();

      orders = orders.filter((order: Order) => {
        return (
          order.title?.toLowerCase().includes(searchTerm) ||
          order.id?.toLowerCase().includes(searchTerm) ||
          order.userId?.toLowerCase().includes(searchTerm) ||
          order.resourceId?.toLowerCase().includes(searchTerm) ||
          order.creatorId?.toLowerCase().includes(searchTerm) ||
          order.paymentId?.toLowerCase().includes(searchTerm)
        );
      });
    }

    // ------------------------------------------------------------------------
    // User filter
    // ------------------------------------------------------------------------

    if (filters.userId) {
      orders = orders.filter((order: Order) => order.userId === filters.userId);
    }

    // ------------------------------------------------------------------------
    // Resource filter
    // ------------------------------------------------------------------------

    if (filters.resourceId) {
      orders = orders.filter(
        (order: Order) => order.resourceId === filters.resourceId,
      );
    }

    // ------------------------------------------------------------------------
    // Creator filter
    // ------------------------------------------------------------------------

    if (filters.creatorId) {
      orders = orders.filter(
        (order: Order) => order.creatorId === filters.creatorId,
      );
    }

    // ------------------------------------------------------------------------
    // Status filter
    // ------------------------------------------------------------------------

    if (filters.status) {
      orders = orders.filter((order: Order) => order.status === filters.status);
    }

    // ------------------------------------------------------------------------
    // Payment method filter
    // ------------------------------------------------------------------------

    if (filters.paymentMethod) {
      orders = orders.filter(
        (order: Order) => order.paymentMethod === filters.paymentMethod,
      );
    }

    // ------------------------------------------------------------------------
    // Currency filter
    // ------------------------------------------------------------------------

    if (filters.currency) {
      orders = orders.filter(
        (order: Order) => order.currency === filters.currency,
      );
    }

    // ------------------------------------------------------------------------
    // Amount filters
    // ------------------------------------------------------------------------

    if (filters.minAmount !== undefined) {
      orders = orders.filter(
        (order: Order) => order.amount >= filters.minAmount!,
      );
    }

    if (filters.maxAmount !== undefined) {
      orders = orders.filter(
        (order: Order) => order.amount <= filters.maxAmount!,
      );
    }

    // ------------------------------------------------------------------------
    // Created date filters
    // ------------------------------------------------------------------------

    if (filters.createdAfter) {
      const createdAfter = new Date(filters.createdAfter).getTime();

      orders = orders.filter(
        (order: Order) => new Date(order.createdAt).getTime() >= createdAfter,
      );
    }

    if (filters.createdBefore) {
      const createdBefore = new Date(filters.createdBefore).getTime();

      orders = orders.filter(
        (order: Order) => new Date(order.createdAt).getTime() <= createdBefore,
      );
    }

    // ------------------------------------------------------------------------
    // Sorting
    // ------------------------------------------------------------------------

    if (filters.sortBy) {
      const sortBy = filters.sortBy;
      const sortOrder = filters.sortOrder === "asc" ? 1 : -1;

      orders.sort((a: Order, b: Order) => {
        if (sortBy === "amount") {
          return (a.amount - b.amount) * sortOrder;
        }

        if (sortBy === "title") {
          return a.title.localeCompare(b.title) * sortOrder;
        }

        const aDate = new Date(a[sortBy]).getTime();

        const bDate = new Date(b[sortBy]).getTime();

        return (aDate - bDate) * sortOrder;
      });
    }

    // ------------------------------------------------------------------------
    // Pagination
    // ------------------------------------------------------------------------

    const page = Math.max(filters.page ?? 1, 1);

    const limit = Math.max((filters.limit ?? orders.length) || 1, 1);

    const startIndex = (page - 1) * limit;

    const paginatedOrders = orders.slice(startIndex, startIndex + limit);

    return NextResponse.json(paginatedOrders);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch orders",
      },
      {
        status: 500,
      },
    );
  }
}

/**
 * POST /api/orders
 *
 * Create a new order.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await verifySession();

    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const body: unknown = await request.json();
    if (body && typeof body === "object" && "items" in body) {
      const input = body as { items?: unknown; shippingAddress?: unknown; customerName?: unknown; customerEmail?: unknown; customerPhone?: unknown };
      if (!Array.isArray(input.items) || input.items.length === 0 || input.items.length > 50) return NextResponse.json({ error: "Your cart is empty or invalid." }, { status: 400 });
      const quantities = new Map<string, number>();
      for (const item of input.items) {
        if (!item || typeof item !== "object") return NextResponse.json({ error: "Invalid cart item." }, { status: 400 });
        const value = item as { productId?: unknown; quantity?: unknown };
        if (typeof value.productId !== "string" || !Number.isSafeInteger(value.quantity) || Number(value.quantity) < 1 || Number(value.quantity) > 99) return NextResponse.json({ error: "Cart quantities must be positive whole numbers." }, { status: 400 });
        quantities.set(value.productId, (quantities.get(value.productId) ?? 0) + Number(value.quantity));
      }
      if ([...quantities.values()].some((quantity) => quantity > 99)) return NextResponse.json({ error: "A product quantity exceeds the limit." }, { status: 400 });
      const requestKey = request.headers.get("idempotency-key")?.trim();
      if (!requestKey || requestKey.length > 200) return NextResponse.json({ error: "Idempotency-Key is required." }, { status: 400 });
      const idemId = crypto.createHash("sha256").update(`${session}:${requestKey}`).digest("hex");
      const idemRef = adminDb.collection("checkout_idempotency").doc(idemId);
      const saved = await idemRef.get();
      if (saved.exists && saved.data()?.orderId) {
        const existingOrder = await adminDb.collection(COLLECTIONS.ORDERS).doc(String(saved.data()?.orderId)).get();
        if (existingOrder.exists) return NextResponse.json({ order: { id: existingOrder.id, ...existingOrder.data() } });
      }
      const productDocs = await Promise.all([...quantities.keys()].map((id) => adminDb.collection(COLLECTIONS.PRODUCTS).doc(id).get()));
      const items = productDocs.map((snapshot, index) => {
        if (!snapshot.exists) throw new Error("One or more products are no longer available.");
        const product = snapshot.data()!;
        const quantity = quantities.get([...quantities.keys()][index])!;
        const price = Number(product.price);
        if (!product.isPublished || !Number.isFinite(price) || price < 0 || Number(product.stockQuantity ?? 0) < quantity) throw new Error(`${String(product.name ?? "A product")} is unavailable in the requested quantity.`);
        const unitAmount = Math.round(price * 100);
        return { productId: snapshot.id, name: String(product.name ?? "Product"), unitAmount, quantity, lineTotal: unitAmount * quantity };
      });
      const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
      const shippingAmount = 0;
      const address = input.shippingAddress && typeof input.shippingAddress === "object" ? input.shippingAddress : null;
      if (!address || typeof (address as { line1?: unknown }).line1 !== "string" || typeof (address as { city?: unknown }).city !== "string" || typeof (address as { postalCode?: unknown }).postalCode !== "string") return NextResponse.json({ error: "Enter a complete shipping address." }, { status: 400 });
      const orderRef = adminDb.collection(COLLECTIONS.ORDERS).doc();
      const orderData = { id: orderRef.id, userId: session, items, title: items.map((item) => item.name).join(", ").slice(0, 200), amount: (subtotal + shippingAmount) / 100, subtotal: subtotal / 100, shippingAmount: shippingAmount / 100, currency: "INR", shippingAddress: address, customer: { name: input.customerName ?? "", email: input.customerEmail ?? "", phone: input.customerPhone ?? "" }, status: OrderStatus.pending, paymentStatus: "PENDING", createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() };
      await adminDb.runTransaction(async (transaction) => {
        const current = await transaction.get(idemRef);
        if (current.exists && current.data()?.orderId) throw new Error("CHECKOUT_ALREADY_CREATED");
        transaction.create(orderRef, orderData);
        transaction.set(idemRef, { orderId: orderRef.id, userId: session, createdAt: FieldValue.serverTimestamp() });
      });
      return NextResponse.json({ order: { ...orderData, id: orderRef.id } }, { status: 201 });
    }

    const input = createOrderSchema.parse(body);

    // Create order
    const createdOrder = await ordersRepository.create(input);

    return NextResponse.json(createdOrder, {
      status: 201,
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Invalid order data",
          details: error.flatten(),
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create order",
      },
      {
        status: 500,
      },
    );
  }
}
