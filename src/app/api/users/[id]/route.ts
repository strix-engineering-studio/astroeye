import { NextResponse } from "next/server";

import { verifySession } from "@/lib/auth/session";
import { getAdminSession } from "@/lib/admin-auth";
import { usersRepository } from "@/features/customers/repository/user.repository";
import { editUserSchema } from "@/features/customers/schemas";
import { ZodError } from "zod";

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const adminSession = await getAdminSession();
  const customerUid = adminSession ? null : await verifySession();

  // Scoped to authorized administrator or customer accessing own profile
  if (!adminSession && customerUid !== id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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
  const { id } = await context.params;

  const adminSession = await getAdminSession();
  const customerUid = adminSession ? null : await verifySession();

  if (!adminSession && customerUid !== id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();

    // If customer updating own profile, restrict to non-privileged fields
    if (!adminSession) {
      delete payload.membershipType;
      delete payload.isActive;
      delete payload.isExpert;
      delete payload.isDeleted;
    }

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
  const adminSession = await getAdminSession();

  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;

    await usersRepository.softDelete(
      id,
      adminSession.uid,
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
