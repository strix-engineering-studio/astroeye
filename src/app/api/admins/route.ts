import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { verifySession } from "@/lib/auth/session";

import { adminUserCreateSchema } from "@/features/admins";

import { adminUsersRepository } from "@/features/admins/repository/admin.users.repository";

/**
 * GET /api/admin-users
 *
 * Get all admin users.
 */
function withoutPassword<T extends { password?: string }>(admin: T) {
  const safeAdmin = { ...admin };
  delete safeAdmin.password;
  return safeAdmin;
}

export async function GET() {
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

    if (!(await adminUsersRepository.findById(session))?.isActive) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
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
      {
        error: "Failed to fetch admin users",
      },
      {
        status: 500,
      },
    );
  }
}

/**
 * POST /api/admin-users
 *
 * Create a new admin user.
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

    const body = await request.json();

    if (!(await adminUsersRepository.findById(session))?.isActive) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    const data = adminUserCreateSchema.parse(body);

    const adminUser = await adminUsersRepository.create(data);

    return NextResponse.json(withoutPassword(adminUser), {
      status: 201,
    });
  } catch (error: unknown) {
    /**
     * Zod validation errors are client/input errors,
     * therefore return 400 rather than 500.
     */
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: error.flatten(),
        },
        {
          status: 400,
        },
      );
    }

    console.error("Failed to create admin user:", error);

    return NextResponse.json(
      {
        error: "Failed to create admin user",
      },
      {
        status: 500,
      },
    );
  }
}
