import { NextRequest, NextResponse } from "next/server";
import { resourcesRepository } from "@/features/resources/repository/resources.repository";
import { createResourceSchema } from "@/features/resources/schemas";
import type { Resource, ResourceFilters } from "@/features/resources/types";
import { verifySession } from "@/lib/auth/session";
import { ZodError } from "zod";

// GET /api/resources - Get all resources with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse filters from query params
    const filters: ResourceFilters = {
      search: searchParams.get("search") || undefined,
      category: searchParams.get("category") || undefined,
      fileType: searchParams.get("fileType") || undefined,
      isPremium: searchParams.get("isPremium")
        ? searchParams.get("isPremium") === "true"
        : undefined,
      creatorId: searchParams.get("creatorId") || undefined,
    };

    let resources = await resourcesRepository.findAll();

    // Apply filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      resources = resources.filter(
        (resource: Resource) =>
          resource.title?.toLowerCase().includes(searchTerm) ||
          resource.description?.toLowerCase().includes(searchTerm),
      );
    }

    if (filters.category) {
      resources = resources.filter(
        (resource: Resource) => resource.category === filters.category,
      );
    }

    if (filters.fileType) {
      resources = resources.filter(
        (resource: Resource) => resource.fileType === filters.fileType,
      );
    }

    if (filters.isPremium !== undefined) {
      resources = resources.filter(
        (resource: Resource) => resource.isPremium === filters.isPremium,
      );
    }

    if (filters.creatorId) {
      resources = resources.filter(
        (resource: Resource) => resource.creatorId === filters.creatorId,
      );
    }

    if (filters.minDownloads !== undefined) {
      resources = resources.filter(
        (resource) => resource.downloads >= filters.minDownloads!,
      );
    }

    if (filters.maxDownloads !== undefined) {
      resources = resources.filter(
        (resource) => resource.downloads <= filters.maxDownloads!,
      );
    }

    // Never expose premium download URLs from the collection endpoint.
    return NextResponse.json(
      resources.map((resource) =>
        resource.isPremium ? { ...resource, url: undefined } : resource,
      ),
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch resources",
      },
      { status: 500 },
    );
  }
}

// POST /api/resources - Create a new resource
export async function POST(request: NextRequest) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const input = createResourceSchema.parse(await request.json());
    const createdResource = await resourcesRepository.create({
      ...input,
      creatorId: session,
    });

    return NextResponse.json(createdResource, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid resource data", details: error.flatten() },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create resource",
      },
      { status: 500 },
    );
  }
}
