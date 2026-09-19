import { createHmac, timingSafeEqual } from "crypto"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const ADMIN_SESSION_COOKIE = "strix_admin_session"
const ADMIN_SESSION_TTL_MS = 1000 * 60 * 60 * 12

type AdminSession = {
    email: string
    expiresAt: number
}

function getAdminEmail() {
    return process.env.ADMIN_EMAIL ?? ""
}

function getAdminPassword() {
    return process.env.ADMIN_PASSWORD ?? ""
}

function getSessionSecret() {
    return process.env.ADMIN_SESSION_SECRET ?? process.env.NEXTAUTH_SECRET ?? ""
}

function base64UrlEncode(value: string) {
    return Buffer.from(value).toString("base64url")
}

function base64UrlDecode(value: string) {
    return Buffer.from(value, "base64url").toString("utf8")
}

function signPayload(payload: string) {
    const secret = getSessionSecret()
    return createHmac("sha256", secret).update(payload).digest("base64url")
}

export function isValidAdminCredentials(email: string, password: string) {
    return email === getAdminEmail() && password === getAdminPassword()
}

export function createAdminSessionToken(email: string) {
    const session: AdminSession = {
        email,
        expiresAt: Date.now() + ADMIN_SESSION_TTL_MS,
    }

    const payload = base64UrlEncode(JSON.stringify(session))
    const signature = signPayload(payload)
    return `${payload}.${signature}`
}

export function verifyAdminSessionToken(token?: string) {
    if (!token) return null
    const secret = getSessionSecret()
    if (!secret) return null

    const [payload, signature] = token.split(".")
    if (!payload || !signature) return null

    const expectedSignature = signPayload(payload)
    const provided = Buffer.from(signature)
    const expected = Buffer.from(expectedSignature)
    if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return null

    try {
        const session = JSON.parse(base64UrlDecode(payload)) as AdminSession
        if (!session.email || session.expiresAt < Date.now()) return null
        if (session.email !== getAdminEmail()) return null
        return session
    } catch {
        return null
    }
}

export async function getAdminSession() {
    const cookieStore = await cookies()
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
    return verifyAdminSessionToken(token)
}

export async function setAdminSessionCookie(email: string) {
    const cookieStore = await cookies()
    cookieStore.set(ADMIN_SESSION_COOKIE, createAdminSessionToken(email), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: ADMIN_SESSION_TTL_MS / 1000,
    })
}

export async function clearAdminSessionCookie() {
    const cookieStore = await cookies()
    cookieStore.set(ADMIN_SESSION_COOKIE, "", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
    })
}

export async function requireAdminSession() {
    const session = await getAdminSession()
    if (!session) {
        redirect("/admin/login")
    }

    return session
}
