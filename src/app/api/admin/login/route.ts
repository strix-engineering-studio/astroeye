import { NextResponse } from "next/server"
import { createAdminSessionToken, isValidAdminCredentials, ADMIN_SESSION_COOKIE } from "@/lib/admin-auth"

export async function POST(request: Request) {
    const payload = await request.json().catch(() => null)
    const email = typeof payload?.email === "string" ? payload.email.trim() : ""
    const password = typeof payload?.password === "string" ? payload.password : ""

    if (!isValidAdminCredentials(email, password)) {
        return NextResponse.json({ ok: false, message: "Invalid credentials" }, { status: 401 })
    }

    const response = NextResponse.json({ ok: true, message: "Signed in" })
    response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSessionToken(email), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 12,
    })

    return response
}