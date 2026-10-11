import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { ordersRepository } from "@/features/orders/repository/orders.repository";
import { updateOrderSchema } from "@/features/orders/schemas";
import { verifySession } from "@/lib/auth/session";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/orders/:id
// Get a single order by ID
export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          error: "Order ID is required",
        },
        {
          status: 400,
        },
      );
    }

    const order = await ordersRepository.findById(id);

    if (!order) {
      return NextResponse.json(
        {
          error: "Order not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(order, {
      status: 200,
    });
  } catch (error: unknown) {
    console.error("[GET /api/orders/:id]", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch order",
      },
      {
        status: 500,
      },
    );
  }
}

// PATCH /api/orders/:id
// Update an existing order
export async function PATCH(request: NextRequest, { params }: RouteContext) {
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

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          error: "Order ID is required",
        },
        {
          status: 400,
        },
      );
    }

    // Check that the order exists
    const existingOrder = await ordersRepository.findById(id);

    if (!existingOrder) {
      return NextResponse.json(
        {
          error: "Order not found",
        },
        {
          status: 404,
        },
      );
    }

    // Parse and validate request body
    const body = await request.json();

    const input = updateOrderSchema.parse(body);

    // Prevent changing the original order relationships
    // delete input.userId;
    // delete input.resourceId;
    // delete input.creatorId;

    // Update order
    const updatedOrder = await ordersRepository.update(id, input);

    if (!updatedOrder) {
      return NextResponse.json(
        {
          error: "Failed to update order",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(updatedOrder, {
      status: 200,
    });
  } catch (error: unknown) {
    console.error("[PATCH /api/orders/:id]", error);

    // Validation error
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
          error instanceof Error ? error.message : "Failed to update order",
      },
      {
        status: 500,
      },
    );
  }
}

// DELETE /api/orders/:id
// Delete an existing order
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
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

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          error: "Order ID is required",
        },
        {
          status: 400,
        },
      );
    }

    // Check that the order exists
    const existingOrder = await ordersRepository.findById(id);

    if (!existingOrder) {
      return NextResponse.json(
        {
          error: "Order not found",
        },
        {
          status: 404,
        },
      );
    }

    await ordersRepository.delete(id);

    return NextResponse.json(
      {
        ok: true,
        message: "Order deleted successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error: unknown) {
    console.error("[DELETE /api/orders/:id]", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to delete order",
      },
      {
        status: 500,
      },
    );
  }
}
