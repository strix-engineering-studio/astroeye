"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import type { Order } from "@/features/orders/types/orders.types";

export default function AccountOrderDetailsPage() {
  const params = useParams<{ id: string }>(); const id = params.id; const { user, isLoading } = useAuth(); const router = useRouter(); const [order, setOrder] = useState<Order | null>(null); const [error, setError] = useState("");
  useEffect(() => { if (!isLoading && !user) router.replace(`/login?next=${encodeURIComponent(`/account/orders/${id}`)}`); }, [isLoading, user, router, id]);
  useEffect(() => { if (!user || !id) return; fetch(`/api/orders/${encodeURIComponent(id)}`, { credentials: "include", cache: "no-store" }).then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error || "Order not found."); setOrder(data); }).catch((e: unknown) => setError(e instanceof Error ? e.message : "Unable to load order.")); }, [user, id]);
  if (isLoading || (!order && !error)) return <main className="mx-auto max-w-3xl px-4 py-16">Loading order…</main>;
  if (error) return <main className="mx-auto max-w-3xl px-4 py-16"><Link href="/account/orders" className="underline">← Orders</Link><p role="alert" className="mt-8">{error}</p></main>;
  if (!order) return null;
  return <main className="mx-auto max-w-3xl px-4 py-12"><Link href="/account/orders" className="text-sm text-amber-800">← Your orders</Link><h1 className="mt-4 text-3xl font-semibold">Order details</h1><p className="mt-2 text-sm text-stone-600">Reference: {order.id}</p><p className="mt-4 inline-block rounded-full bg-stone-100 px-3 py-1 text-sm capitalize">{order.paymentStatus === "PAID" ? "Paid" : order.status}</p><section className="mt-8 rounded-2xl border p-6"><h2 className="font-medium">Items</h2><div className="mt-3 divide-y">{order.items?.map((item) => <div key={item.productId} className="flex justify-between gap-4 py-3"><span>{item.name} × {item.quantity}</span><span>{new Intl.NumberFormat("en-IN", { style: "currency", currency: order.currency || "INR" }).format(item.lineTotal / 100)}</span></div>)}</div><div className="mt-4 border-t pt-4 text-right font-semibold">Total: {new Intl.NumberFormat("en-IN", { style: "currency", currency: order.currency || "INR" }).format(order.amount)}</div></section>{order.shippingAddress && <section className="mt-4 rounded-2xl border p-6"><h2 className="font-medium">Shipping address</h2><p className="mt-2 text-sm leading-6">{order.customer?.name}<br />{order.shippingAddress.line1}{order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}<br />{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p></section>}</main>;
}
