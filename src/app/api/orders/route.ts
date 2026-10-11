import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { ordersRepository } from "@/features/orders/repository/orders.repository";
import { createOrderSchema } from "@/features/orders/schemas";

import type { Order, OrderFilters } from "@/features/orders/types/orders.types";

import { verifySession } from "@/lib/auth/session";
import { OrderStatus } from "@/features/orders";

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
    // Verify admin/session
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

    // Validate request body
    const input = createOrderSchema.parse(await request.json());

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
