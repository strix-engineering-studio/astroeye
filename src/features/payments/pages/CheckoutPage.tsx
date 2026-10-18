"use client";

import Script from "next/script";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CART_KEY = "magicalstones-cart";
type CartItem = { productId: string; name: string; price: number; quantity: number; imageUrl?: string };
type PaymentOrder = { orderId: string; amount: number; currency: string; keyId: string; applicationOrderId: string };
declare global { interface Window { Razorpay?: new (options: Record<string, unknown>) => { open: () => void }; } }

const money = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value);

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [details, setDetails] = useState({ name: "", email: "", phone: "", line1: "", line2: "", city: "", state: "", postalCode: "" });
  useEffect(() => { try { const value: unknown = JSON.parse(localStorage.getItem(CART_KEY) ?? "[]"); if (Array.isArray(value)) setItems(value as CartItem[]); } catch { setItems([]); } const orderId = new URLSearchParams(window.location.search).get("orderId"); if (orderId) fetch(`/api/orders/${encodeURIComponent(orderId)}`, { credentials: "include" }).then((response) => response.ok ? response.json() : null).then((order) => { if (order?.items) setItems(order.items.map((item: { productId: string; name: string; unitAmount: number; quantity: number }) => ({ productId: item.productId, name: item.name, price: item.unitAmount / 100, quantity: item.quantity }))); if (order?.customer || order?.shippingAddress) setDetails((current) => ({ ...current, name: order.customer?.name ?? "", email: order.customer?.email ?? "", phone: order.customer?.phone ?? "", line1: order.shippingAddress?.line1 ?? "", line2: order.shippingAddress?.line2 ?? "", city: order.shippingAddress?.city ?? "", state: order.shippingAddress?.state ?? "", postalCode: order.shippingAddress?.postalCode ?? "" })); }).finally(() => setLoaded(true)); else setLoaded(true); }, []);
  const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0);
  const set = (key: keyof typeof details, value: string) => setDetails((current) => ({ ...current, [key]: value }));

  async function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    if (!items.length) { toast.error("Your cart is empty."); return; }
    if (!window.Razorpay) { toast.error("Payment checkout is still loading."); return; }
    setSubmitting(true);
    try {
      let appOrderId = new URLSearchParams(window.location.search).get("orderId");
      if (!appOrderId) {
        const orderKeyStorage = "astroeye-checkout-idempotency";
        const idemKey = sessionStorage.getItem(orderKeyStorage) ?? crypto.randomUUID();
        sessionStorage.setItem(orderKeyStorage, idemKey);
        const orderResponse = await fetch("/api/orders", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json", "Idempotency-Key": idemKey }, body: JSON.stringify({ items: items.map(({ productId, quantity }) => ({ productId, quantity })), customerName: details.name, customerEmail: details.email, customerPhone: details.phone, shippingAddress: { line1: details.line1, line2: details.line2, city: details.city, state: details.state, postalCode: details.postalCode } }) });
        const orderData = await orderResponse.json();
        if (!orderResponse.ok) throw new Error(orderData.error || "Unable to create your order.");
        appOrderId = orderData.order.id as string;
        sessionStorage.removeItem(orderKeyStorage);
      }
      const paymentResponse = await fetch("/api/payments/create-order", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId: appOrderId }) });
      const payment = await paymentResponse.json() as PaymentOrder & { error?: string };
      if (!paymentResponse.ok) throw new Error(payment.error || "Unable to start payment.");
      const checkout = new window.Razorpay({ key: payment.keyId, order_id: payment.orderId, amount: payment.amount, currency: payment.currency, name: "Astroeye", description: `Order ${appOrderId}`, prefill: { name: details.name, email: details.email, contact: details.phone }, theme: { color: "#956537" }, modal: { ondismiss: () => { setSubmitting(false); router.push(`/checkout/failed?orderId=${encodeURIComponent(appOrderId)}&state=cancelled`); } }, handler: async (result: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
        try {
          const verifyResponse = await fetch("/api/payments/verify", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ applicationOrderId: appOrderId, ...result, razorpayOrderId: result.razorpay_order_id, razorpayPaymentId: result.razorpay_payment_id, razorpaySignature: result.razorpay_signature }) });
          const verification = await verifyResponse.json();
          if (verification.success && verification.status === "PAID") { localStorage.removeItem(CART_KEY); window.dispatchEvent(new CustomEvent("magicalstones:cart-updated", { detail: { cart: [] } })); router.replace(`/checkout/success?orderId=${encodeURIComponent(appOrderId)}`); }
          else router.replace(`/checkout/processing?orderId=${encodeURIComponent(appOrderId)}`);
        } catch { router.replace(`/checkout/processing?orderId=${encodeURIComponent(appOrderId)}`); }
        finally { setSubmitting(false); }
      } });
      checkout.open();
    } catch (error) { toast.error(error instanceof Error ? error.message : "Unable to place your order."); setSubmitting(false); }
  }

  if (!loaded) return <main className="mx-auto max-w-3xl p-8">Loading checkout…</main>;
  return <>
    <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
    <main className="mx-auto grid min-h-[75vh] max-w-6xl gap-8 px-4 py-10 text-[#29251F] md:grid-cols-[1fr_360px]">
      <section><Link href="/cart" className="text-sm text-[#956537]">← Back to cart</Link><h1 className="mt-4 font-serif text-3xl">Checkout</h1>
        <form onSubmit={placeOrder} className="mt-7 space-y-6">
          <fieldset className="grid gap-4 rounded-2xl border border-[#EAE3D9] p-5 sm:grid-cols-2"><legend className="px-2 font-medium">Contact information</legend>
            <label className="text-sm">Full name<input required autoComplete="name" value={details.name} onChange={(e) => set("name", e.target.value)} className="mt-1 w-full rounded-lg border p-3" /></label>
            <label className="text-sm">Email<input required type="email" autoComplete="email" value={details.email} onChange={(e) => set("email", e.target.value)} className="mt-1 w-full rounded-lg border p-3" /></label>
            <label className="text-sm sm:col-span-2">Phone<input required type="tel" autoComplete="tel" value={details.phone} onChange={(e) => set("phone", e.target.value)} className="mt-1 w-full rounded-lg border p-3" /></label>
          </fieldset>
          <fieldset className="grid gap-4 rounded-2xl border border-[#EAE3D9] p-5 sm:grid-cols-2"><legend className="px-2 font-medium">Shipping address</legend>
            <label className="text-sm sm:col-span-2">Address<input required autoComplete="address-line1" value={details.line1} onChange={(e) => set("line1", e.target.value)} className="mt-1 w-full rounded-lg border p-3" /></label>
            <label className="text-sm sm:col-span-2">Apartment, suite, etc. (optional)<input autoComplete="address-line2" value={details.line2} onChange={(e) => set("line2", e.target.value)} className="mt-1 w-full rounded-lg border p-3" /></label>
            <label className="text-sm">City<input required value={details.city} onChange={(e) => set("city", e.target.value)} className="mt-1 w-full rounded-lg border p-3" /></label><label className="text-sm">State<input required value={details.state} onChange={(e) => set("state", e.target.value)} className="mt-1 w-full rounded-lg border p-3" /></label>
            <label className="text-sm">Postal code<input required autoComplete="postal-code" value={details.postalCode} onChange={(e) => set("postalCode", e.target.value)} className="mt-1 w-full rounded-lg border p-3" /></label>
          </fieldset>
          <button disabled={submitting || (!items.length && !new URLSearchParams(typeof window === "undefined" ? "" : window.location.search).has("orderId"))} className="w-full rounded-full bg-[#29251F] px-6 py-4 font-medium text-white disabled:opacity-50">{submitting ? "Preparing secure payment…" : "Place order and pay"}</button>
        </form>
      </section>
      <aside className="h-fit rounded-2xl bg-[#F7F3EC] p-6"><h2 className="font-medium">Order summary</h2><div className="mt-4 divide-y divide-[#EAE3D9]">{items.map((item) => <div key={item.productId} className="flex justify-between gap-4 py-3 text-sm"><span>{item.name} × {item.quantity}</span><span>{money(item.price * item.quantity)}</span></div>)}</div><div className="mt-4 flex justify-between border-t border-[#EAE3D9] pt-4 text-sm"><span>Shipping</span><span>Free</span></div><div className="mt-4 flex justify-between text-lg font-semibold"><span>Total estimate</span><span>{money(subtotal)}</span></div><p className="mt-3 text-xs text-[#777066]">The server validates current prices and stock before creating your order.</p></aside>
    </main>
  </>;
}
