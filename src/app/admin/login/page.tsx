"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Shield, LockKeyhole, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminLoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        setMessage(null)

        const formData = new FormData(event.currentTarget)
        const response = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: formData.get("email"),
                password: formData.get("password"),
            }),
        })

        if (response.ok) {
            router.push("/admin")
            router.refresh()
            return
        }

        const payload = await response.json().catch(() => null)
        setMessage(payload?.message ?? "Unable to sign in")
        setLoading(false)
    }

    return (
        <section className="flex min-h-[calc(100vh-120px)] items-center px-5 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1fr_0.95fr]">
                <div className="space-y-6 rounded-[36px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs uppercase tracking-[0.35em] text-emerald-100">
                        <Shield className="size-3.5" />
                        Admin Login
                    </div>
                    <h1 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">Sign in to manage the Strix console.</h1>
                    <p className="max-w-xl text-sm leading-7 text-white/65 sm:text-base">
                        Use the email and password configured for the admin workspace to access landing pages, inquiries, clients, and monitoring.
                    </p>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <InfoTile title="Landing pages" description="Create slug-based business pages." />
                        <InfoTile title="Contact inbox" description="Review and archive inquiries." />
                        <InfoTile title="Client records" description="Track active engagements and notes." />
                        <InfoTile title="Industry signals" description="Capture useful market monitoring." />
                    </div>
                </div>

                <form onSubmit={onSubmit} className="space-y-5 rounded-[36px] border border-white/10 bg-[#07111f]/90 p-8 backdrop-blur-xl">
                    <label className="space-y-2 text-sm text-white/70">
                        <span>Email</span>
                        <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-black/25 px-4 py-3">
                            <Mail className="size-4 text-white/40" />
                            <input name="email" type="email" required placeholder="admin@yourdomain.com" className="w-full bg-transparent text-white outline-none placeholder:text-white/35" />
                        </div>
                    </label>

                    <label className="space-y-2 text-sm text-white/70">
                        <span>Password</span>
                        <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-black/25 px-4 py-3">
                            <LockKeyhole className="size-4 text-white/40" />
                            <input name="password" type="password" required placeholder="••••••••" className="w-full bg-transparent text-white outline-none placeholder:text-white/35" />
                        </div>
                    </label>

                    <Button type="submit" disabled={loading} className="w-full bg-emerald-400 px-5 py-3 text-sm font-medium text-slate-950 hover:bg-emerald-300">
                        {loading ? "Signing in..." : "Enter console"}
                    </Button>

                    {message ? <p className="text-sm text-red-300">{message}</p> : null}
                </form>
            </div>
        </section>
    )
}

function InfoTile({ title, description }: { title: string; description: string }) {
    return (
        <div className="rounded-[28px] border border-white/10 bg-black/20 p-4">
            <p className="text-sm font-medium text-white">{title}</p>
            <p className="mt-2 text-sm leading-7 text-white/55">{description}</p>
        </div>
    )
}