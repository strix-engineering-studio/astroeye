import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { resourcesRepository } from "@/features/resources/repository/resources.repository";
import { updateResourceSchema } from "@/features/resources/schemas";
import { verifySession } from "@/lib/auth/session";
import { adminDb } from "@/lib/firebase/admin";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/resources/:id
// Get a single resource by ID
export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Resource ID is required" },
        { status: 400 },
      );
    }

    const resource = await resourcesRepository.findById(id);

    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 },
      );
    }

    if (resource.isPremium) {
      const userId = await verifySession();
      const purchase = userId
        ? await adminDb
            .collection("resource_purchases")
            .where("resourceId", "==", id)
            .where("userId", "==", userId)
            .where("status", "in", ["PAID", "CAPTURED", "COMPLETED"])
            .limit(1)
            .get()
        : null;
      if (!purchase || purchase.empty) {
        return NextResponse.json(
          { ...resource, url: undefined },
          { status: 200 },
        );
      }
    }

    return NextResponse.json(resource, {
      status: 200,
    });
  } catch (error: unknown) {
    console.error("[GET /api/resources/:id]", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch resource",
      },
      { status: 500 },
    );
  }
}

// PATCH /api/resources/:id
// Update an existing resource
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    if (!(await verifySession())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Resource ID is required" },
        { status: 400 },
      );
    }

    // Check that the resource exists
    const existingResource = await resourcesRepository.findById(id);

    if (!existingResource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 },
      );
    }

    // Parse and validate request body
    const body = await request.json();

    const input = updateResourceSchema.parse(body);
    delete input.creatorId;

    // Update resource
    const updatedResource = await resourcesRepository.update(id, input);

    if (!updatedResource) {
      return NextResponse.json(
        { error: "Failed to update resource" },
        { status: 500 },
      );
    }

    return NextResponse.json(updatedResource, {
      status: 200,
    });
  } catch (error: unknown) {
    console.error("[PATCH /api/resources/:id]", error);

    // Validation error
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Invalid resource data",
          details: error.flatten(),
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update resource",
      },
      { status: 500 },
    );
  }
}

// DELETE /api/resources/:id
// Delete an existing resource
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    if (!(await verifySession())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Resource ID is required" },
        { status: 400 },
      );
    }

    // Check that the resource exists
    const existingResource = await resourcesRepository.findById(id);

    if (!existingResource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 },
      );
    }

    await resourcesRepository.delete(id);

    return NextResponse.json(
      {
        ok: true,
        message: "Resource deleted successfully",
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("[DELETE /api/resources/:id]", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to delete resource",
      },
      { status: 500 },
    );
  }
}
