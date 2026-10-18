"use client";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
function Content() {
  const params = useSearchParams(); const router = useRouter(); const id = params.get("orderId");
  const [state, setState] = useState("Checking"); const [busy, setBusy] = useState(false);
  const refresh = useCallback(async () => { if (!id) { setState("Order reference is missing."); return; } setBusy(true); try { const response = await fetch(`/api/orders/${encodeURIComponent(id)}`, { credentials: "include", cache: "no-store" }); if (!response.ok) throw new Error("We could not retrieve this order."); const order = await response.json(); if (order.status === "completed" && order.paymentStatus === "PAID") { router.replace(`/checkout/success?orderId=${encodeURIComponent(id)}`); return; } if (order.status === "failed") { router.replace(`/checkout/failed?orderId=${encodeURIComponent(id)}&state=failed`); return; } setState("Your payment is being confirmed. This can take a few minutes."); } catch (error) { setState(error instanceof Error ? error.message : "Status is temporarily unavailable."); } finally { setBusy(false); } }, [id, router]);
  useEffect(() => { let count = 0; void refresh(); const timer = window.setInterval(() => { count += 1; if (count >= 5) { window.clearInterval(timer); return; } void refresh(); }, 5000); return () => window.clearInterval(timer); }, [refresh]);
  return <main className="mx-auto max-w-lg px-4 py-20 text-center"><h1 className="text-3xl font-semibold">Payment confirmation in progress</h1><p className="mt-4 text-muted-foreground">{state}</p>{id && <p className="mt-3 text-sm">Order reference: {id}</p>}<button onClick={() => void refresh()} disabled={busy} className="mt-7 rounded-lg border px-5 py-3 disabled:opacity-50">{busy ? "Refreshing…" : "Refresh status"}</button><div className="mt-6"><Link href={id ? `/account/orders/${encodeURIComponent(id)}` : "/account/orders"} className="underline">View your orders</Link></div></main>;
}
export default function Page() { return <Suspense fallback={<main className="p-12 text-center">Loading…</main>}><Content /></Suspense>; }
