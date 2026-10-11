import { NextResponse } from "next/server";

import { verifySession } from "@/lib/auth/session";
import { usersRepository } from "@/features/users/repository/user.repository";
import { editUserSchema } from "@/features/users/schemas";
import { ZodError } from "zod";

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await verifySession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;

    const user = await usersRepository.findById(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to get user:", error);

    return NextResponse.json({ error: "Failed to get user" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await verifySession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const payload = await request.json();
    let data = editUserSchema.parse(payload);

    if (
      payload.phoneNumber !== undefined ||
      payload.countryCode !== undefined
    ) {
      const phoneDigits = payload.phoneNumber
        ? String(payload.phoneNumber).replace(/\D/g, "")
        : "";
      const countryCode = payload.countryCode
        ? String(payload.countryCode).replace(/\D/g, "")
        : undefined;

      if (!phoneDigits || !countryCode) {
        return NextResponse.json(
          { error: "Country code and phone number are required" },
          { status: 400 },
        );
      }

      const normalizedPhone = `+${countryCode}${phoneDigits}`;

      const existingPhone =
        await usersRepository.findByPhoneNumber(normalizedPhone);

      if (existingPhone && existingPhone.id !== id) {
        return NextResponse.json(
          { error: "Phone number already exists" },
          { status: 400 },
        );
      }

      const payloadWithoutCountryCode = { ...payload };
      delete payloadWithoutCountryCode.countryCode;

      data = {
        ...editUserSchema.parse({
          ...payloadWithoutCountryCode,
          phoneNumber: phoneDigits,
        }),
        phoneNumber: normalizedPhone,
      };
    }

    const user = await usersRepository.update(id, data);

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error.flatten() },
        { status: 400 },
      );
    }

    console.error("Failed to update user:", error);

    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await verifySession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;

    await usersRepository.softDelete(
      id,
      session, // or session.user.uid depending on your session object
    );

    return NextResponse.json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete user:", error);

    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  }
}
