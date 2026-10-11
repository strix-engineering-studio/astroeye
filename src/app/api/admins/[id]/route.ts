import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { verifySession } from "@/lib/auth/session";
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
  const session = await verifySession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await adminUsersRepository.findById(session))?.isActive) {
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 403 },
    );
  }

  try {
    const { id } = await context.params;
    if (!(await adminUsersRepository.findById(id))) {
      return NextResponse.json(
        { error: "Admin user not found" },
        { status: 404 },
      );
    }
    const payload = adminUserUpdateSchema.parse(await request.json());
    return NextResponse.json(
      withoutPassword(await adminUsersRepository.update(id, payload)),
    );
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
  const session = await verifySession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await adminUsersRepository.findById(session))?.isActive) {
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 403 },
    );
  }

  const { id } = await context.params;
  if (!(await adminUsersRepository.findById(id))) {
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
  const session = await verifySession();
  if (!session || !(await adminUsersRepository.findById(session))?.isActive) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const admin = await adminUsersRepository.findById((await context.params).id);
  if (!admin)
    return NextResponse.json(
      { error: "Admin user not found" },
      { status: 404 },
    );
  return NextResponse.json(withoutPassword(admin));
}
