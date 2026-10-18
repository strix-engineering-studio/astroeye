"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";

export default function AccountPage() {
  const { user, isLoading, logout } = useAuth(); const router = useRouter();
  useEffect(() => { if (!isLoading && !user) router.replace("/login?next=%2Faccount"); }, [isLoading, user, router]);
  if (isLoading || !user) return <main className="mx-auto max-w-5xl px-4 py-16">Loading your account…</main>;
  return <main className="mx-auto max-w-5xl px-4 py-12 text-stone-900"><p className="text-sm uppercase tracking-widest text-amber-800">My account</p><h1 className="mt-2 text-3xl font-semibold">Welcome, {user.fullName || user.displayName || "there"}</h1><p className="mt-2 text-stone-600">{user.email || user.phoneNumber}</p><section className="mt-8 grid gap-4 sm:grid-cols-2"><Link href="/account/orders" className="rounded-2xl border p-6 transition hover:bg-amber-50"><h2 className="text-xl font-medium">Your orders</h2><p className="mt-2 text-sm text-stone-600">View order history and payment details.</p></Link><Link href="/account/settings" className="rounded-2xl border p-6 transition hover:bg-amber-50"><h2 className="text-xl font-medium">Account settings</h2><p className="mt-2 text-sm text-stone-600">Update your profile and preferences.</p></Link></section><button onClick={async () => { await logout(); router.replace("/"); }} className="mt-8 rounded-lg border px-5 py-3 text-sm">Sign out</button></main>;
}
