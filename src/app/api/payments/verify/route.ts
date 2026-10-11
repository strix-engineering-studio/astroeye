import { NextResponse } from "next/server";
import crypto from "crypto";
import { Timestamp } from "firebase-admin/firestore";

import { adminDb } from "@/lib/firebase/admin";
import { verifySession } from "@/lib/auth/session";
import { normalizeFirestoreDateFields } from "@/lib/firebase/firestore-timestamps";

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

/**
 * Extract authenticated user ID from the session.
 */
function getSessionUserId(session: unknown): string | null {
  if (typeof session === "string") {
    return session;
  }

  if (typeof session === "object" && session !== null) {
    const value = session as Record<string, unknown>;

    if (typeof value.userId === "string") {
      return value.userId;
    }

    if (typeof value.uid === "string") {
      return value.uid;
    }

    if (typeof value.id === "string") {
      return value.id;
    }

    if (typeof value.user === "object" && value.user !== null) {
      const user = value.user as Record<string, unknown>;

      if (typeof user.id === "string") {
        return user.id;
      }

      if (typeof user.uid === "string") {
        return user.uid;
      }
    }
  }

  return null;
}

/**
 * Timing-safe signature comparison.
 */
function isValidSignature(
  expectedSignature: string,
  receivedSignature: string,
): boolean {
  const expected = Buffer.from(expectedSignature, "utf8");

  const received = Buffer.from(receivedSignature, "utf8");

  if (expected.length !== received.length) {
    return false;
  }

  return crypto.timingSafeEqual(expected, received);
}

/**
 * Verify Razorpay payment.
 */
export async function POST(request: Request) {
  try {
    const session = await verifySession();

    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    if (!RAZORPAY_KEY_SECRET) {
      console.error("RAZORPAY_KEY_SECRET is missing.");

      return NextResponse.json(
        {
          error: "Payment service is not configured.",
        },
        {
          status: 500,
        },
      );
    }

    const userId = getSessionUserId(session);

    if (!userId) {
      return NextResponse.json(
        {
          error: "Unable to identify authenticated user.",
        },
        {
          status: 401,
        },
      );
    }

    let payload: Record<string, unknown>;
    try {
      const body: unknown = await request.json();
      if (!body || typeof body !== "object" || Array.isArray(body)) {
        return NextResponse.json(
          { error: "Invalid request body." },
          { status: 400 },
        );
      }
      payload = body as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 },
      );
    }

    const resourceId =
      typeof payload.resourceId === "string"
        ? payload.resourceId.trim()
        : undefined;

    const webinarId =
      typeof payload.webinarId === "string"
        ? payload.webinarId.trim()
        : undefined;

    const razorpayPaymentId =
      typeof payload.razorpayPaymentId === "string"
        ? payload.razorpayPaymentId.trim()
        : "";

    const razorpayOrderId =
      typeof payload.razorpayOrderId === "string"
        ? payload.razorpayOrderId.trim()
        : "";

    const razorpaySignature =
      typeof payload.razorpaySignature === "string"
        ? payload.razorpaySignature.trim()
        : "";

    /*
     * Validate request.
     */
    if ((!resourceId && !webinarId) || (resourceId && webinarId)) {
      return NextResponse.json(
        {
          error: "Provide exactly one of resourceId or webinarId.",
        },
        {
          status: 400,
        },
      );
    }

    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return NextResponse.json(
        {
          error: "Razorpay payment verification fields are required.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * ==========================================================
     * RESOURCE PAYMENT
     * ==========================================================
     */

    if (resourceId) {
      const paymentRef = adminDb
        .collection("resource_payments")
        .doc(razorpayOrderId);

      const paymentSnapshot = await paymentRef.get();

      if (!paymentSnapshot.exists) {
        return NextResponse.json(
          {
            error: "Payment order not found.",
          },
          {
            status: 404,
          },
        );
      }

      const payment = paymentSnapshot.data();

      if (!payment) {
        return NextResponse.json(
          {
            error: "Payment order not found.",
          },
          {
            status: 404,
          },
        );
      }

      /*
       * NEVER trust the order/user/resource relationship
       * sent by the browser.
       */
      if (
        payment.userId !== userId ||
        payment.resourceId !== resourceId ||
        payment.razorpayOrderId !== razorpayOrderId
      ) {
        return NextResponse.json(
          {
            error: "Payment order does not belong to this request.",
          },
          {
            status: 403,
          },
        );
      }

      /*
       * Idempotency.
       */
      if (payment.status === "CAPTURED" || payment.status === "PAID") {
        return NextResponse.json({
          success: true,
          resourceId,
          paymentId: payment.razorpayPaymentId ?? razorpayPaymentId,
          orderId: razorpayOrderId,
          message: "Payment was already verified.",
        });
      }

      /*
       * IMPORTANT:
       *
       * Use the order ID from our database.
       *
       * Do not use the client-supplied order ID
       * as the cryptographic source of truth.
       */
      const serverOrderId = payment.razorpayOrderId;

      const signaturePayload = `${serverOrderId}|${razorpayPaymentId}`;

      const expectedSignature = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET)
        .update(signaturePayload)
        .digest("hex");

      if (!isValidSignature(expectedSignature, razorpaySignature)) {
        await paymentRef.update({
          status: "VERIFICATION_FAILED",
          updatedAt: Timestamp.now(),
        });

        return NextResponse.json(
          {
            error: "Invalid payment signature.",
          },
          {
            status: 400,
          },
        );
      }

      /*
       * Signature is valid.
       *
       * Record payment details.
       *
       * IMPORTANT:
       * This confirms authenticity, but production
       * fulfilment should ultimately depend on captured
       * payment state/webhook.
       */
      const purchaseRef = adminDb
        .collection("resource_purchases")
        .doc(`${resourceId}_${userId}`);
      const now = Timestamp.now();
      await adminDb.runTransaction(async (transaction) => {
        const [currentPayment, purchase] = await Promise.all([
          transaction.get(paymentRef),
          transaction.get(purchaseRef),
        ]);
        const current = currentPayment.data();
        if (
          !current ||
          current.status === "CAPTURED" ||
          current.status === "PAID"
        )
          return;
        transaction.update(paymentRef, {
          razorpayPaymentId,
          razorpaySignature,
          status: "CAPTURED",
          verifiedAt: now,
          capturedAt: now,
          updatedAt: now,
        });
        if (!purchase.exists) {
          transaction.create(purchaseRef, {
            id: purchaseRef.id,
            resourceId,
            userId,
            razorpayOrderId,
            razorpayPaymentId,
            amount: current.amount,
            currency: current.currency,
            status: "PAID",
            purchasedAt: now,
            createdAt: now,
            updatedAt: now,
          });
        }
      });

      return NextResponse.json({
        success: true,

        resourceId,

        paymentId: razorpayPaymentId,

        orderId: razorpayOrderId,

        message: "Payment signature verified successfully.",
      });
    }

    /*
     * ==========================================================
     * WEBINAR PAYMENT
     * ==========================================================
     */

    const paymentRef = adminDb
      .collection("webinar_payments")
      .doc(razorpayOrderId);

    const paymentSnapshot = await paymentRef.get();

    if (!paymentSnapshot.exists) {
      return NextResponse.json(
        {
          error: "Payment order not found.",
        },
        {
          status: 404,
        },
      );
    }

    const payment = paymentSnapshot.data();

    if (!payment) {
      return NextResponse.json(
        {
          error: "Payment order not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (
      payment.userId !== userId ||
      payment.webinarId !== webinarId ||
      payment.razorpayOrderId !== razorpayOrderId
    ) {
      return NextResponse.json(
        {
          error: "Payment order does not belong to this request.",
        },
        {
          status: 403,
        },
      );
    }

    /*
     * Idempotency.
     */
    if (payment.status === "CAPTURED" || payment.status === "PAID") {
      return NextResponse.json({
        success: true,

        webinarId,

        paymentId: payment.razorpayPaymentId ?? razorpayPaymentId,

        orderId: razorpayOrderId,

        registrationId: payment.registrationId ?? null,

        message: "Payment was already verified.",
      });
    }

    const serverOrderId = payment.razorpayOrderId;

    const signaturePayload = `${serverOrderId}|${razorpayPaymentId}`;

    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(signaturePayload)
      .digest("hex");

    if (!isValidSignature(expectedSignature, razorpaySignature)) {
      await paymentRef.update({
        status: "VERIFICATION_FAILED",
        updatedAt: Timestamp.now(),
      });

      return NextResponse.json(
        {
          error: "Invalid payment signature.",
        },
        {
          status: 400,
        },
      );
    }

    const registrationId = payment.registrationId ?? `${webinarId}_${userId}`;
    const registrationRef = adminDb
      .collection("webinar_registrations")
      .doc(registrationId);
    const webinarRef = adminDb.collection("webinars").doc(webinarId!);
    await adminDb.runTransaction(async (transaction) => {
      const [currentPayment, registration, webinar] = await Promise.all([
        transaction.get(paymentRef),
        transaction.get(registrationRef),
        transaction.get(webinarRef),
      ]);
      const current = currentPayment.data();
      if (
        !current ||
        current.status === "CAPTURED" ||
        current.status === "PAID"
      )
        return;
      const now = Timestamp.now();
      transaction.update(
        paymentRef,
        normalizeFirestoreDateFields({
          razorpayPaymentId,
          razorpaySignature,
          status: "CAPTURED",
          verifiedAt: now,
          capturedAt: now,
          registrationId,
          paymentStatus: "PAID",
          registrationStatus: "REGISTERED",
          updatedAt: now,
        }),
      );
      if (!registration.exists) {
        transaction.create(
          registrationRef,
          normalizeFirestoreDateFields({
            id: registrationId,
            webinarId,
            userId,
            paymentStatus: "PAID",
            paymentId: razorpayPaymentId,
            registrationStatus: "REGISTERED",
            certificateIssued: false,
            feedbackSubmitted: false,
            reminderSent: false,
            registeredAt: now,
            createdAt: now,
            updatedAt: now,
          }),
        );
        if (webinar.exists) {
          const count = Number(webinar.data()?.registeredCount ?? 0);
          transaction.update(webinarRef, {
            registeredCount: count + 1,
            updatedAt: now,
          });
        }
      } else {
        transaction.update(
          registrationRef,
          normalizeFirestoreDateFields({
            paymentStatus: "PAID",
            paymentId: razorpayPaymentId,
            registrationStatus: "REGISTERED",
            updatedAt: now,
          }),
        );
      }
    });

    return NextResponse.json({
      success: true,

      webinarId,

      paymentId: razorpayPaymentId,

      orderId: razorpayOrderId,

      registrationId,

      message: "Payment signature verified successfully.",
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    return NextResponse.json(
      {
        error: "Unable to verify payment.",
      },
      {
        status: 500,
      },
    );
  }
}
