import { NextResponse } from "next/server";

import { verifySession } from "@/lib/auth/session";
import { usersRepository } from "@/features/customers/repository/user.repository";

export async function PATCH(
  _: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await verifySession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;

    const user = await usersRepository.restore(id);

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to restore user:", error);

    return NextResponse.json(
      { error: "Failed to restore user" },
      { status: 500 },
    );
  }
}
