"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function Content() {
  const params = useSearchParams(); const id = params.get("orderId");
  const [order, setOrder] = useState<Record<string, unknown> | null>(null); const [loading, setLoading] = useState(true);
  useEffect(() => { if (!id) { setLoading(false); return; } fetch(`/api/orders/${encodeURIComponent(id)}`, { credentials: "include" }).then(async (r) => { if (!r.ok) throw new Error(); return r.json(); }).then(setOrder).catch(() => setOrder(null)).finally(() => setLoading(false)); }, [id]);
  const paid = order?.status === "completed" && order?.paymentStatus === "PAID";
  if (loading) return <main className="mx-auto max-w-xl p-12 text-center">Checking your order…</main>;
  if (!paid) return <main className="mx-auto max-w-xl p-12 text-center"><h1 className="text-2xl font-semibold">Payment is being confirmed</h1><p className="mt-3 text-muted-foreground">We’ll show confirmation once your order status is updated.</p>{id && <Link className="mt-6 inline-block underline" href={`/checkout/processing?orderId=${encodeURIComponent(id)}`}>View payment status</Link>}</main>;
  const items = Array.isArray(order?.items) ? order.items as Array<{ name?: string; quantity?: number }> : [];
  return <main className="mx-auto max-w-xl px-4 py-16"><section className="rounded-2xl border p-8"><p className="text-sm font-medium text-green-700">PAYMENT CONFIRMED</p><h1 className="mt-2 text-3xl font-semibold">Thank you for your order</h1><p className="mt-3 text-muted-foreground">Order {String(order?.id)}</p><div className="mt-6 divide-y">{items.map((item, i) => <div key={i} className="py-3">{item.name} × {item.quantity}</div>)}</div><p className="mt-5 border-t pt-4 font-semibold">Total: ₹{Number(order?.amount ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p><div className="mt-7 flex gap-4"><Link href={`/account/orders/${encodeURIComponent(id!)}`} className="underline">Order details</Link><Link href="/products" className="underline">Continue shopping</Link></div></section></main>;
}
export default function Page() { return <Suspense fallback={<main className="p-12 text-center">Loading…</main>}><Content /></Suspense>; }
