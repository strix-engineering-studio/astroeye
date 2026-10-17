import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { getAdminSession } from "@/lib/admin-auth";
import { adminUserCreateSchema } from "@/features/admins";
import { adminUsersRepository } from "@/features/admins/repository/admin.users.repository";

function withoutPassword<T extends { password?: string }>(admin: T) {
  const safeAdmin = { ...admin };
  delete safeAdmin.password;
  return safeAdmin;
}

/**
 * GET /api/admins
 *
 * Get all admin users.
 */
export async function GET() {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const adminUsers = await adminUsersRepository.findAll();
    const safeAdminUsers = adminUsers.map(withoutPassword);

    return NextResponse.json(safeAdminUsers, {
      status: 200,
    });
  } catch (error: unknown) {
    console.error("Failed to fetch admin users:", error);

    return NextResponse.json(
      { error: "Failed to fetch admin users" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admins
 *
 * Create a new admin user.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const data = adminUserCreateSchema.parse(body);

    const adminUser = await adminUsersRepository.create(data);

    return NextResponse.json(withoutPassword(adminUser), {
      status: 201,
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: error.flatten(),
        },
        { status: 400 },
      );
    }

    const msg = error instanceof Error ? error.message : String(error);
    if (/email-already-exists|already in use/i.test(msg)) {
      return NextResponse.json(
        { error: "An administrator with this email address already exists" },
        { status: 409 },
      );
    }

    console.error("Failed to create admin user:", error);

    return NextResponse.json(
      { error: msg || "Failed to create admin user" },
      { status: 500 },
    );
  }
}
