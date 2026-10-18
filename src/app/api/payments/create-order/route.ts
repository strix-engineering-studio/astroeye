
import { NextResponse } from "next/server";

import { adminDb } from "@/lib/firebase/admin";
import { verifySession } from "@/lib/auth/session";
import { COLLECTIONS } from "@/lib/constants/COLLECTIONS";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

type CreatePaymentResult = {
  applicationOrderId: string;
  paymentId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
  name: string;
  description: string;
};

export async function POST(request: Request) {
  let paymentRef:
    | FirebaseFirestore.DocumentReference
    | undefined;

  try {
    const userId = await verifySession();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 },
      );
    }

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Payment service is not configured." },
        { status: 500 },
      );
    }

    const body: unknown = await request.json();

    if (
      !body ||
      typeof body !== "object" ||
      !("orderId" in body) ||
      typeof body.orderId !== "string" ||
      !body.orderId.trim()
    ) {
      return NextResponse.json(
        { error: "A valid orderId is required." },
        { status: 400 },
      );
    }

    const applicationOrderId = body.orderId.trim();
    const orderRef = adminDb
      .collection(COLLECTIONS.ORDERS)
      .doc(applicationOrderId);

    // 1. Validate the already-created application order.
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 },
      );
    }

    const order = orderSnap.data()!;

    if (order.userId !== userId) {
      return NextResponse.json(
        { error: "Forbidden." },
        { status: 403 },
      );
    }

    if (
      order.paymentStatus === "PAID" ||
      order.status === "completed"
    ) {
      return NextResponse.json(
        { error: "Order is already paid." },
        { status: 409 },
      );
    }

    if (
      order.status === "cancelled" ||
      order.status === "refunded"
    ) {
      return NextResponse.json(
        { error: "This order cannot be paid." },
        { status: 409 },
      );
    }

    const amount = Math.round(Number(order.amount) * 100);
    const currency =
      typeof order.currency === "string"
        ? order.currency
        : "INR";

    if (!Number.isSafeInteger(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Order total is invalid." },
        { status: 400 },
      );
    }

    // 2. Reuse an existing pending payment if its Razorpay
    // order has already been created.
    const existingPayments = await adminDb
      .collection(COLLECTIONS.PAYMENTS)
      .where("orderId", "==", applicationOrderId)
      .where("userId", "==", userId)
      .where("status", "==", "PENDING")
      .limit(10)
      .get();

    const existingPayment = existingPayments.docs.find(
      (doc) =>
        typeof doc.data().razorpayOrderId === "string" &&
        doc.data().razorpayOrderId.length > 0,
    );

    if (existingPayment) {
      const payment = existingPayment.data();

      // Do not reuse a payment attempt whose amount no longer
      // matches the saved order total.
      if (payment.amount !== amount ||
          payment.currency !== currency) {
        return NextResponse.json(
          { error: "Payment amount does not match the order." },
          { status: 409 },
        );
      }

      return NextResponse.json({
        applicationOrderId,
        paymentId: existingPayment.id,
        razorpayOrderId: payment.razorpayOrderId,
        amount: payment.amount,
        currency: payment.currency,
        keyId,
        name: "Astroeye",
        description: `Order ${applicationOrderId}`,
      } satisfies CreatePaymentResult);
    }

    // 3. Create the payment document FIRST.
    // This record is linked to the application order even if
    // the subsequent Razorpay API request fails.
    paymentRef = adminDb
      .collection(COLLECTIONS.PAYMENTS)
      .doc();

    await paymentRef.create({
      id: paymentRef.id,
      orderId: applicationOrderId,
      userId,
      amount,
      currency,
      status: "PENDING",
      razorpayOrderId: null,
      razorpayPaymentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 4. Create the Razorpay order using the saved order total.
    const razorpayResponse = await fetch(
      "https://api.razorpay.com/v1/orders",
      {
        method: "POST",
        headers: {
          Authorization:
            `Basic ${Buffer.from(
              `${keyId}:${keySecret}`,
            ).toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          currency,
          receipt: applicationOrderId.slice(0, 40),
          notes: {
            applicationOrderId,
            paymentId: paymentRef.id,
            userId,
          },
        }),
        cache: "no-store",
      },
    );

    const razorpayOrder: unknown =
      await razorpayResponse.json();

    if (
      !razorpayResponse.ok ||
      !razorpayOrder ||
      typeof razorpayOrder !== "object" ||
      !("id" in razorpayOrder) ||
      typeof razorpayOrder.id !== "string" ||
      !("amount" in razorpayOrder) ||
      razorpayOrder.amount !== amount ||
      !("currency" in razorpayOrder) ||
      razorpayOrder.currency !== currency
    ) {
      throw new Error("Razorpay order creation failed.");
    }

    const razorpayOrderId = razorpayOrder.id;

    // 5. Link the Razorpay order to the payment record.
    await paymentRef.update({
      razorpayOrderId,
      updatedAt: new Date(),
    });

    // Keep the application order's payment status unpaid/pending.
    await orderRef.update({
      paymentId: paymentRef.id,
      paymentStatus: "PENDING",
      updatedAt: new Date(),
    });

    return NextResponse.json({
      applicationOrderId,
      paymentId: paymentRef.id,
      razorpayOrderId,
      amount,
      currency,
      keyId,
      name: "Astroeye",
      description: `Order ${applicationOrderId}`,
    } satisfies CreatePaymentResult);
  } catch (error) {
    console.error("Create payment order error:", error);

    // If the payment record was created but Razorpay order
    // creation failed, retain the record for auditing.
    if (paymentRef) {
      try {
        await paymentRef.update({
          status: "FAILED",
          failureReason: "PAYMENT_ORDER_CREATION_FAILED",
          updatedAt: new Date(),
        });
      } catch (updateError) {
        console.error(
          "Failed to update payment status:",
          updateError,
        );
      }
    }

    return NextResponse.json(
      { error: "Unable to create payment order." },
      { status: 502 },
    );
  }
}
