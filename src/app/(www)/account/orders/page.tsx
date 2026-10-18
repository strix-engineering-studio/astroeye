"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import type { Order } from "@/features/orders/types/orders.types";

export default function AccountOrdersPage() {
  const { user, isLoading } = useAuth(); const router = useRouter(); const [orders, setOrders] = useState<Order[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { if (!isLoading && !user) router.replace("/login?next=%2Faccount%2Forders"); }, [isLoading, user, router]);
  useEffect(() => { if (!user) return; fetch("/api/account/orders", { credentials: "include", cache: "no-store" }).then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error || "Could not load orders."); setOrders(data.orders); }).catch((e: unknown) => setError(e instanceof Error ? e.message : "Could not load orders.")).finally(() => setLoading(false)); }, [user]);
  return <main className="mx-auto max-w-4xl px-4 py-12"><Link href="/account" className="text-sm text-amber-800">← My account</Link><h1 className="mt-4 text-3xl font-semibold">Your orders</h1>{loading || isLoading ? <p className="mt-8">Loading orders…</p> : error ? <p role="alert" className="mt-8 text-red-700">{error}</p> : orders.length === 0 ? <section className="mt-8 rounded-2xl border p-8 text-center"><p>You haven’t placed an order yet.</p><Link href="/products" className="mt-4 inline-block underline">Browse the shop</Link></section> : <div className="mt-8 space-y-4">{orders.map((order) => <Link key={order.id} href={`/account/orders/${encodeURIComponent(order.id)}`} className="block rounded-2xl border p-5 hover:bg-amber-50"><div className="flex flex-wrap justify-between gap-3"><span className="font-medium">Order {order.id}</span><span className="rounded-full bg-stone-100 px-3 py-1 text-xs capitalize">{order.paymentStatus === "PAID" ? "Paid" : order.status}</span></div><p className="mt-2 text-sm text-stone-600">{order.items?.map((item) => `${item.name} × ${item.quantity}`).join(", ") || order.title}</p><p className="mt-3 font-medium">{new Intl.NumberFormat("en-IN", { style: "currency", currency: order.currency || "INR" }).format(order.amount)}</p><p className="mt-1 text-xs text-stone-500">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p></Link>)}</div>}</main>;
}
