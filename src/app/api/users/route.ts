import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { getAdminSession } from "@/lib/admin-auth";
import { createUserSchema } from "@/features/customers";
import { usersRepository } from "@/features/customers/repository/user.repository";
import {
  Gender,
  MembershipType,
  Relationship,
  UserFilters,
} from "@/features/customers";

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);

    const filters: UserFilters = {
      search: searchParams.get("search") ?? undefined,

      membershipType:
        (searchParams.get("membershipType") as MembershipType) ?? undefined,

      gender: (searchParams.get("gender") as Gender) ?? undefined,

      relationship:
        (searchParams.get("relationship") as Relationship) ?? undefined,

      isActive:
        searchParams.get("isActive") === null
          ? undefined
          : searchParams.get("isActive") === "true",

      isExpert:
        searchParams.get("isExpert") === null
          ? undefined
          : searchParams.get("isExpert") === "true",

      sortBy:
        searchParams.get("sortBy") === "createdAt" ? "createdAt" : "createdAt",

      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") ?? "desc",

      page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,

      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 10,
    };
    // const isDeleted = searchParams.get('isDeleted') === 'true';

    const users = await usersRepository.findAll(filters);

    return NextResponse.json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);

    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const data = createUserSchema.parse(body);

    const phoneNumber = data.phoneNumber.replace(/\D/g, "").slice(0, 10);
    const normalizedPhone = `+${data.countryCode}${phoneNumber}`;

    const existingPhone =
      await usersRepository.findByPhoneNumber(normalizedPhone);

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 },
      );
    }

    if (existingPhone) {
      return NextResponse.json(
        { error: "Phone number already exists" },
        { status: 400 },
      );
    }

    const user = await usersRepository.create({
      fullName: data.fullName,
      email: data.email,
      phoneNumber: normalizedPhone,
      membershipType: data.membershipType,
      gender: data.gender,
      profileImageUrl: data.profileImageUrl,
      status: data.status,
      isActive: data.isActive,
      isExpert: data.isExpert,
    });

    return NextResponse.json(user, {
      status: 201,
    });
  } catch (error) {
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

    console.error("Failed to create user:", error);

    return NextResponse.json(
      {
        error: "Failed to create user",
      },
      {
        status: 500,
      },
    );
  }
}
