import { NextResponse } from "next/server";
import crypto from "crypto";
import { Timestamp } from "firebase-admin/firestore";

import { adminDb } from "@/lib/firebase/admin";
import { normalizeFirestoreDateFields } from "@/lib/firebase/firestore-timestamps";

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

/**
 * Verify Razorpay webhook signature.
 *
 * Razorpay signs the RAW request body using
 * HMAC-SHA256 and the webhook secret.
 */
function verifyWebhookSignature(
  rawBody: string,
  receivedSignature: string,
): boolean {
  if (!RAZORPAY_WEBHOOK_SECRET) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  const expected = Buffer.from(expectedSignature, "utf8");

  const received = Buffer.from(receivedSignature, "utf8");

  if (expected.length !== received.length) {
    return false;
  }

  return crypto.timingSafeEqual(expected, received);
}

/**
 * Razorpay webhook.
 *
 * IMPORTANT:
 * - Read raw body first.
 * - Verify signature.
 * - Return quickly.
 * - Process only verified events.
 */
export async function POST(request: Request) {
  try {
    if (!RAZORPAY_WEBHOOK_SECRET) {
      console.error("RAZORPAY_WEBHOOK_SECRET is missing.");

      return NextResponse.json(
        {
          error: "Webhook is not configured.",
        },
        {
          status: 500,
        },
      );
    }

    /*
     * IMPORTANT:
     *
     * Do NOT use request.json().
     *
     * Razorpay requires the exact raw body
     * for webhook signature verification.
     */
    const rawBody = await request.text();

    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        {
          error: "Missing Razorpay webhook signature.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Verify webhook authenticity BEFORE
     * processing any payment information.
     */
    const isValid = verifyWebhookSignature(rawBody, signature);

    if (!isValid) {
      console.error("Invalid Razorpay webhook signature.");

      return NextResponse.json(
        {
          error: "Invalid webhook signature.",
        },
        {
          status: 400,
        },
      );
    }

    let event: {
      event?: string;
      id?: string;
      payload?: { payment?: { entity?: Record<string, unknown> } };
    };

    try {
      event = JSON.parse(rawBody) as typeof event;
    } catch {
      return NextResponse.json(
        {
          error: "Invalid webhook payload.",
        },
        {
          status: 400,
        },
      );
    }

    const eventName = event?.event;

    const eventId = event?.id;

    /*
     * Razorpay event ID should be used for
     * idempotency.
     */
    if (typeof eventId !== "string" || eventId.length > 200) {
      return NextResponse.json(
        {
          error: "Webhook event ID is missing.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * ==========================================================
     * IDEMPOTENCY
     * ==========================================================
     *
     * If this event has already been processed,
     * acknowledge it without processing again.
     */
    const eventRef = adminDb.collection("razorpay_webhook_events").doc(eventId);

    const existingEvent = await eventRef.get();

    if (
      existingEvent.exists &&
      ["COMPLETED", "REJECTED"].includes(existingEvent.data()?.status)
    ) {
      return NextResponse.json({
        received: true,
        duplicate: true,
      });
    }

    /*
     * Save event first.
     *
     * This gives us an audit trail and prevents
     * duplicate processing.
     */
    await eventRef.set({
      id: eventId,

      event: eventName ?? null,

      receivedAt: Timestamp.now(),

      payload: event,
      status: "PROCESSING",
    });

    /*
     * ==========================================================
     * PAYMENT CAPTURED
     * ==========================================================
     */
    if (eventName === "payment.captured") {
      const payment = event?.payload?.payment?.entity;

      if (!payment) {
        await eventRef.update({
          status: "COMPLETED",
          processedAt: Timestamp.now(),
        });
        return NextResponse.json({
          received: true,
        });
      }

      const paymentId = typeof payment.id === "string" ? payment.id : null;
      const orderId =
        typeof payment.order_id === "string" ? payment.order_id : null;

      if (!paymentId || !orderId) {
        await eventRef.update({
          status: "COMPLETED",
          processedAt: Timestamp.now(),
        });
        return NextResponse.json({
          received: true,
        });
      }
      const checkoutPaymentRef = adminDb.collection("payments").doc(orderId);
      const checkoutPaymentSnap = await checkoutPaymentRef.get();
      if (checkoutPaymentSnap.exists) {
        const checkoutPayment = checkoutPaymentSnap.data()!;
        const checkoutNotes = (payment.notes ?? {}) as Record<string, unknown>;
        if (payment.status !== "captured" || payment.amount !== checkoutPayment.amount || payment.currency !== checkoutPayment.currency || checkoutNotes.applicationOrderId !== checkoutPayment.orderId || checkoutNotes.userId !== checkoutPayment.userId) {
          await eventRef.update({ status: "REJECTED", processedAt: Timestamp.now(), reason: "Order payment validation failed." });
          return NextResponse.json({ received: true, processed: false }, { status: 400 });
        }
        const orderRef = adminDb.collection("orders").doc(checkoutPayment.orderId);
        await adminDb.runTransaction(async (transaction) => {
          const [currentPayment, currentOrder] = await Promise.all([transaction.get(checkoutPaymentRef), transaction.get(orderRef)]);
          if (!currentPayment.exists || !currentOrder.exists || currentPayment.data()?.status === "CAPTURED") return;
          const now = Timestamp.now();
          transaction.update(checkoutPaymentRef, { status: "CAPTURED", razorpayPaymentId: paymentId, capturedAt: now, updatedAt: now });
          transaction.update(orderRef, { status: "completed", paymentStatus: "PAID", paymentId, paymentMethod: "razorpay", completedAt: now, updatedAt: now });
        });
        await eventRef.update({ status: "COMPLETED", processedAt: Timestamp.now() });
        return NextResponse.json({ received: true, processed: true, type: "ORDER" });
      }
      const paymentStatus = payment.status;
      if (paymentStatus !== "captured") {
        await eventRef.update({
          status: "COMPLETED",
          processedAt: new Date().toISOString(),
          reason: "Payment was not captured.",
        });
        return NextResponse.json({ received: true, processed: false });
      }
      const notes = (payment.notes ?? {}) as Record<string, unknown>;

      /*
       * Check resource payment.
       */
      const resourcePaymentRef = adminDb
        .collection("resource_payments")
        .doc(orderId);

      const resourcePaymentSnapshot = await resourcePaymentRef.get();

      if (resourcePaymentSnapshot.exists) {
        const resourcePayment = resourcePaymentSnapshot.data();
        if (
          !resourcePayment ||
          payment.amount !== resourcePayment.amount ||
          payment.currency !== resourcePayment.currency ||
          notes.entityType !== "RESOURCE" ||
          notes.resourceId !== resourcePayment.resourceId ||
          notes.userId !== resourcePayment.userId
        ) {
          await eventRef.update({
            status: "REJECTED",
            processedAt: Timestamp.now(),
            reason: "Payment validation failed.",
          });
          return NextResponse.json(
            {
              received: true,
              processed: false,
              reason: "Payment validation failed.",
            },
            { status: 400 },
          );
        }

        if (resourcePayment && resourcePayment.status !== "CAPTURED") {
          const now = Timestamp.now();

          /*
           * Mark payment captured.
           */
          await resourcePaymentRef.update({
            razorpayPaymentId: paymentId,

            status: "CAPTURED",

            capturedAt: now,

            updatedAt: now,
          });

          /*
           * Create resource purchase.
           *
           * Use a deterministic ID so duplicate
           * webhook delivery cannot create duplicate
           * purchases.
           */
          const purchaseId = `${resourcePayment.resourceId}_${resourcePayment.userId}`;

          const purchaseRef = adminDb
            .collection("resource_purchases")
            .doc(purchaseId);

          const purchaseSnapshot = await purchaseRef.get();

          if (!purchaseSnapshot.exists) {
            await purchaseRef.set({
              id: purchaseId,

              resourceId: resourcePayment.resourceId,

              userId: resourcePayment.userId,

              razorpayOrderId: orderId,

              razorpayPaymentId: paymentId,

              amount: resourcePayment.amount,

              currency: resourcePayment.currency,

              status: "PAID",

              purchasedAt: now,

              createdAt: now,

              updatedAt: now,
            });
          }
        }

        await eventRef.update({
          status: "COMPLETED",
          processedAt: Timestamp.now(),
        });
        return NextResponse.json({
          received: true,
          processed: true,
          type: "RESOURCE",
        });
      }

      /*
       * Check webinar payment.
       */
      const webinarPaymentRef = adminDb
        .collection("webinar_payments")
        .doc(orderId);

      const webinarPaymentSnapshot = await webinarPaymentRef.get();

      if (webinarPaymentSnapshot.exists) {
        const webinarPayment = webinarPaymentSnapshot.data();

        if (!webinarPayment) {
          await eventRef.update({
            status: "COMPLETED",
            processedAt: Timestamp.now(),
          });
          return NextResponse.json({
            received: true,
          });
        }
        if (
          payment.amount !== webinarPayment.amount ||
          payment.currency !== webinarPayment.currency ||
          notes.entityType !== "WEBINAR" ||
          notes.webinarId !== webinarPayment.webinarId ||
          notes.userId !== webinarPayment.userId
        ) {
          await eventRef.update({
            status: "REJECTED",
            processedAt: Timestamp.now(),
            reason: "Payment validation failed.",
          });
          return NextResponse.json(
            {
              received: true,
              processed: false,
              reason: "Payment validation failed.",
            },
            { status: 400 },
          );
        }

        if (webinarPayment.status === "CAPTURED") {
          await eventRef.update({
            status: "COMPLETED",
            processedAt: Timestamp.now(),
          });
          return NextResponse.json({
            received: true,
            processed: true,
            type: "WEBINAR",
          });
        }

        const now = Timestamp.now();

        /*
         * Mark payment captured.
         */
        await webinarPaymentRef.update({
          razorpayPaymentId: paymentId,

          status: "CAPTURED",

          capturedAt: now,

          updatedAt: now,
        });

        /*
         * Create or update webinar registration.
         */
        const registrationId =
          webinarPayment.registrationId ??
          `${webinarPayment.webinarId}_${webinarPayment.userId}`;

        const registrationRef = adminDb
          .collection("webinar_registrations")
          .doc(registrationId);

        const registrationSnapshot = await registrationRef.get();
        const isNewRegistration = !registrationSnapshot.exists;

        if (!registrationSnapshot.exists) {
          await registrationRef.set({
            id: registrationId,

            webinarId: webinarPayment.webinarId,

            userId: webinarPayment.userId,

            paymentStatus: "PAID",

            paymentId,

            registrationStatus: "REGISTERED",

            certificateIssued: false,

            feedbackSubmitted: false,

            reminderSent: false,

            registeredAt: now,

            createdAt: now,

            updatedAt: now,
          });
        } else {
          await registrationRef.update({
            paymentStatus: "PAID",

            paymentId,

            registrationStatus: "REGISTERED",

            updatedAt: now,
          });
        }

        /*
         * Store registration ID on payment.
         */
        await webinarPaymentRef.update({
          registrationId,

          updatedAt: now,
        });

        /*
         * Increment registeredCount.
         *
         * This should ideally be done transactionally
         * if participant limits are important.
         */
        const webinarRef = adminDb
          .collection("webinars")
          .doc(webinarPayment.webinarId);

        if (isNewRegistration) {
          await adminDb.runTransaction(async (transaction) => {
            const webinarSnapshot = await transaction.get(webinarRef);

            if (!webinarSnapshot.exists) {
              return;
            }

            const webinar = webinarSnapshot.data();

            const currentCount = Number(webinar?.registeredCount ?? 0);

            /*
             * Only increment if this registration
             * wasn't already registered.
             *
             * Existing registrations are handled
             * separately above.
             */
            transaction.update(webinarRef, {
              registeredCount: currentCount + 1,
              updatedAt: now,
            });
          });
        }

        await eventRef.update({
          status: "COMPLETED",
          processedAt: Timestamp.now(),
        });
        await eventRef.update({
          status: "COMPLETED",
          processedAt: Timestamp.now(),
        });
        return NextResponse.json({
          received: true,
          processed: true,
          type: "WEBINAR",
        });
      }

      /*
       * Payment captured but no internal order
       * was found.
       *
       * Keep the event recorded for investigation.
       */
      console.warn(
        "Captured Razorpay payment has no matching internal order:",
        {
          paymentId,
          orderId,
        },
      );

      await eventRef.update({
        status: "COMPLETED",
        processedAt: Timestamp.now(),
      });
      return NextResponse.json({
        received: true,
        processed: false,
        reason: "Internal payment order not found.",
      });
    }

    /*
     * ==========================================================
     * PAYMENT FAILED
     * ==========================================================
     */
    if (eventName === "payment.failed") {
      const payment = event?.payload?.payment?.entity;

      const paymentId = typeof payment?.id === "string" ? payment.id : null;
      const orderId =
        typeof payment?.order_id === "string" ? payment.order_id : null;

      if (orderId) {
        const checkoutPaymentRef = adminDb.collection("payments").doc(orderId);
        const checkoutPaymentSnap = await checkoutPaymentRef.get();
        if (checkoutPaymentSnap.exists) {
          const checkoutPayment = checkoutPaymentSnap.data()!;
          if (checkoutPayment.status !== "CAPTURED") {
            const now = Timestamp.now();
            await checkoutPaymentRef.update({ status: "FAILED", razorpayPaymentId: paymentId, failureReason: typeof payment?.error_description === "string" ? payment.error_description : null, updatedAt: now });
            await adminDb.collection("orders").doc(checkoutPayment.orderId).update({ paymentStatus: "FAILED", status: "failed", updatedAt: now });
          }
        }
        const resourcePaymentRef = adminDb
          .collection("resource_payments")
          .doc(orderId);

        const resourceSnapshot = await resourcePaymentRef.get();

        if (resourceSnapshot.exists) {
          await resourcePaymentRef.update({
            razorpayPaymentId: paymentId ?? null,

            status: "FAILED",

            failureReason:
              (typeof payment?.error_description === "string"
                ? payment.error_description
                : undefined) ??
              (typeof payment?.error_reason === "string"
                ? payment.error_reason
                : null),

            updatedAt: Timestamp.now(),
          });
        }

        const webinarPaymentRef = adminDb
          .collection("webinar_payments")
          .doc(orderId);

        const webinarSnapshot = await webinarPaymentRef.get();

        if (webinarSnapshot.exists) {
          await webinarPaymentRef.update({
            razorpayPaymentId: paymentId ?? null,

            status: "FAILED",

            failureReason:
              (typeof payment?.error_description === "string"
                ? payment.error_description
                : undefined) ??
              (typeof payment?.error_reason === "string"
                ? payment.error_reason
                : null),

            updatedAt: Timestamp.now(),
          });
        }
      }

      await eventRef.update({
        status: "COMPLETED",
        processedAt: Timestamp.now(),
      });
      return NextResponse.json({
        received: true,
        processed: true,
      });
    }

    /*
     * ==========================================================
     * OTHER EVENTS
     * ==========================================================
     *
     * We acknowledge events we are not currently
     * handling.
     */
    return NextResponse.json({
      received: true,
      processed: false,
      event: eventName ?? null,
    });
  } catch (error) {
    console.error("Razorpay webhook processing error:", error);

    /*
     * Return non-2xx so Razorpay can retry.
     */
    return NextResponse.json(
      {
        error: "Webhook processing failed.",
      },
      {
        status: 500,
      },
    );
  }
}
