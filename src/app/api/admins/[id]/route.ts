import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getAdminSession } from "@/lib/admin-auth";
import { adminUserUpdateSchema } from "@/features/admins";
import { adminUsersRepository } from "@/features/admins/repository/admin.users.repository";

function withoutPassword<T extends { password?: string }>(admin: T) {
  const safeAdmin = { ...admin };
  delete safeAdmin.password;
  return safeAdmin;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const existing = await adminUsersRepository.findById(id);
    if (!existing) {
      return NextResponse.json(
        { error: "Admin user not found" },
        { status: 404 },
      );
    }

    const payload = adminUserUpdateSchema.parse(await request.json());

    // Prevent deactivating own account
    if (session.uid === id && payload.isActive === false) {
      return NextResponse.json(
        { error: "You cannot deactivate your own admin account" },
        { status: 400 },
      );
    }

    const updated = await adminUsersRepository.update(id, payload);
    return NextResponse.json(withoutPassword(updated));
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error.flatten() },
        { status: 400 },
      );
    }
    console.error("Failed to update admin user:", error);
    return NextResponse.json(
      { error: "Failed to update admin user" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  // Prevent administrator from deleting themselves
  if (session.uid === id) {
    return NextResponse.json(
      { error: "You cannot delete your own admin account" },
      { status: 400 },
    );
  }

  const existing = await adminUsersRepository.findById(id);
  if (!existing) {
    return NextResponse.json(
      { error: "Admin user not found" },
      { status: 404 },
    );
  }

  await adminUsersRepository.delete(id);
  return new NextResponse(null, { status: 204 });
}

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const admin = await adminUsersRepository.findById(id);
  if (!admin) {
    return NextResponse.json(
      { error: "Admin user not found" },
      { status: 404 },
    );
  }

  return NextResponse.json(withoutPassword(admin));
}
