"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
function Content() {
  const params = useSearchParams(); const id = params.get("orderId"); const reason = params.get("state");
  const [status, setStatus] = useState("CHECKING");
  useEffect(() => { if (!id) { setStatus("UNKNOWN"); return; } fetch(`/api/orders/${encodeURIComponent(id)}`, { credentials: "include", cache: "no-store" }).then(async (r) => { if (!r.ok) throw new Error(); return r.json(); }).then((order) => setStatus(order.paymentStatus === "PAID" || order.status === "completed" ? "PAID" : order.paymentStatus === "FAILED" ? "FAILED" : "PENDING")).catch(() => setStatus("UNKNOWN")); }, [id]);
  const paid = status === "PAID"; const uncertain = status === "PENDING" || status === "CHECKING" || status === "UNKNOWN";
  return <main className="mx-auto max-w-lg px-4 py-20 text-center"><p className="text-sm font-medium text-[#956537]">PAYMENT STATUS: {status}</p><h1 className="mt-3 text-3xl font-semibold">{paid ? "Order paid" : uncertain || reason === "cancelled" ? "Payment confirmation pending" : "Payment unsuccessful"}</h1><p className="mt-4 text-muted-foreground">{paid ? "This order is confirmed." : uncertain || reason === "cancelled" ? "Closing checkout does not confirm a failure. Check the order status before retrying." : "The payment was not confirmed. You can safely retry this order."}</p>{id && <p className="mt-4 text-sm">Order reference: {id}</p>}<div className="mt-8 flex flex-col gap-3">{id && uncertain && <Link className="rounded-lg border px-5 py-3" href={`/checkout/processing?orderId=${encodeURIComponent(id)}`}>Check payment status</Link>}{id && !paid && status === "FAILED" && <Link className="rounded-lg bg-[#29251F] px-5 py-3 text-white" href={`/checkout?orderId=${encodeURIComponent(id)}`}>Retry payment for this order</Link>}<Link className="rounded-lg border px-5 py-3" href="/products">Continue shopping</Link></div></main>;
}
export default function Page() { return <Suspense fallback={<main className="p-12 text-center">Loading…</main>}><Content /></Suspense>; }
