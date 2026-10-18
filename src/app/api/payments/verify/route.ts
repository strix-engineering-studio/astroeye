import { NextResponse } from "next/server";
import crypto from "crypto";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { verifySession } from "@/lib/auth/session";
import { COLLECTIONS } from "@/lib/constants/COLLECTIONS";

export async function POST(request: Request) {
  try {
    const userId = await verifySession();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    const value = body as Record<string, unknown>;
    const { applicationOrderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = value;
    if (![applicationOrderId, razorpayOrderId, razorpayPaymentId, razorpaySignature].every((field) => typeof field === "string" && field.length > 0)) return NextResponse.json({ error: "Payment verification fields are required." }, { status: 400 });
    const orderRef = adminDb.collection(COLLECTIONS.ORDERS).doc(applicationOrderId as string);
    const paymentRef = adminDb.collection(COLLECTIONS.PAYMENTS).doc(razorpayOrderId as string);
    const [orderSnap, paymentSnap] = await Promise.all([orderRef.get(), paymentRef.get()]);
    if (!orderSnap.exists || !paymentSnap.exists) return NextResponse.json({ error: "Payment order not found." }, { status: 404 });
    const order = orderSnap.data()!;
    const payment = paymentSnap.data()!;
    if (order.userId !== userId || payment.userId !== userId || payment.orderId !== applicationOrderId || payment.razorpayOrderId !== razorpayOrderId) return NextResponse.json({ error: "Payment order does not belong to this request." }, { status: 403 });
    if (order.status === "completed" && payment.status === "CAPTURED") return NextResponse.json({ success: true, orderId: orderSnap.id, status: "PAID" });
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) return NextResponse.json({ error: "Payment service is not configured." }, { status: 500 });
    const expected = crypto.createHmac("sha256", secret).update(`${razorpayOrderId}|${razorpayPaymentId}`).digest("hex");
    const expectedBuf = Buffer.from(expected); const receivedBuf = Buffer.from(razorpaySignature as string);
    if (expectedBuf.length !== receivedBuf.length || !crypto.timingSafeEqual(expectedBuf, receivedBuf)) return NextResponse.json({ error: "Invalid payment signature." }, { status: 400 });
    const keyId = process.env.RAZORPAY_KEY_ID;
    const gatewayResponse = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(razorpayPaymentId as string)}`, { headers: { Authorization: `Basic ${Buffer.from(`${keyId}:${secret}`).toString("base64")}` } });
    const gatewayPayment = await gatewayResponse.json();
    const expectedAmount = Math.round(Number(order.amount) * 100);
    if (!gatewayResponse.ok || gatewayPayment.order_id !== razorpayOrderId || gatewayPayment.amount !== expectedAmount || gatewayPayment.currency !== (order.currency ?? "INR")) return NextResponse.json({ error: "Payment details do not match this order." }, { status: 400 });
    if (gatewayPayment.status !== "captured") return NextResponse.json({ success: false, orderId: orderSnap.id, status: "PROCESSING", message: "Payment is still being confirmed." });
    await adminDb.runTransaction(async (transaction) => {
      const [currentOrder, currentPayment] = await Promise.all([transaction.get(orderRef), transaction.get(paymentRef)]);
      if (!currentOrder.exists || !currentPayment.exists) throw new Error("Order or payment no longer exists.");
      if (currentPayment.data()?.status === "CAPTURED") return;
      const now = FieldValue.serverTimestamp();
      transaction.update(paymentRef, { razorpayPaymentId, razorpaySignature, status: "CAPTURED", capturedAt: now, verifiedAt: now, updatedAt: now });
      transaction.update(orderRef, { status: "completed", paymentStatus: "PAID", paymentId: razorpayPaymentId, paymentMethod: "razorpay", completedAt: now, updatedAt: now });
    });
    return NextResponse.json({ success: true, orderId: orderSnap.id, status: "PAID" });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ error: "Unable to verify payment." }, { status: 500 });
  }
}
