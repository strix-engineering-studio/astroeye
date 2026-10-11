import { NextResponse } from "next/server";
import crypto from "crypto";
import type { DocumentReference } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { verifySession } from "@/lib/auth/session";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

const RAZORPAY_API_URL = "https://api.razorpay.com/v1/orders";

/**
 * Extract a stable user identifier from the session.
 *
 * Your existing feed route passes `session` directly around,
 * so the exact session shape is project-specific.
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
 * Convert an INR amount into paise.
 *
 * Example:
 * ₹499 -> 49900
 */
function toRazorpayAmount(amount: number): number {
  return Math.round(amount * 100);
}

function idempotencyRef(userId: string, key: string) {
  const digest = crypto
    .createHash("sha256")
    .update(`${userId}:${key}`)
    .digest("hex");
  return adminDb.collection("payment_idempotency").doc(digest);
}

function isMatchingCheckout(
  saved: Record<string, unknown> | undefined,
  entityType: "RESOURCE" | "WEBINAR",
  entityId: string,
): boolean {
  return (
    saved?.entityType === entityType &&
    saved[entityType === "RESOURCE" ? "resourceId" : "webinarId"] === entityId
  );
}

/**
 * Create a Razorpay order.
 */
export async function POST(request: Request) {
  let activeIdempotencyRef: DocumentReference | null = null;

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

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      console.error("Razorpay environment variables are missing.");

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

    /*
     * Exactly one purchasable entity is required.
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
    const idempotencyKey = request.headers.get("idempotency-key")?.trim();
    if (!idempotencyKey || idempotencyKey.length > 200) {
      return NextResponse.json(
        { error: "Idempotency-Key header is required." },
        { status: 400 },
      );
    }

    /*
     * ==========================================================
     * RESOURCE
     * ==========================================================
     */

    if (resourceId) {
      const resourceRef = adminDb.collection("resources").doc(resourceId);

      const resourceSnapshot = await resourceRef.get();

      if (!resourceSnapshot.exists) {
        return NextResponse.json(
          {
            error: "Resource not found.",
          },
          {
            status: 404,
          },
        );
      }

      const resource = resourceSnapshot.data();

      if (!resource) {
        return NextResponse.json(
          {
            error: "Resource not found.",
          },
          {
            status: 404,
          },
        );
      }

      if (!resource.isPremium) {
        return NextResponse.json(
          {
            error: "This resource does not require payment.",
          },
          {
            status: 400,
          },
        );
      }

      /*
       * IMPORTANT:
       *
       * The price must come from Firestore.
       * Never trust a price supplied by the browser.
       */
      const price = Number(resource.price ?? 0);

      if (!Number.isFinite(price) || price <= 0) {
        return NextResponse.json(
          {
            error: "Resource price is not configured.",
          },
          {
            status: 400,
          },
        );
      }

      /*
       * Check whether the user already purchased
       * this resource.
       *
       * Change `resource_purchases` if your actual
       * Firestore collection uses another name.
       */
      const existingPurchase = await adminDb
        .collection("resource_purchases")
        .where("resourceId", "==", resourceId)
        .where("userId", "==", userId)
        .where("status", "in", ["PAID", "CAPTURED", "COMPLETED"])
        .limit(1)
        .get();

      if (!existingPurchase.empty) {
        return NextResponse.json(
          {
            error: "You have already purchased this resource.",
          },
          {
            status: 409,
          },
        );
      }

      const amount = toRazorpayAmount(price);
      if (!Number.isSafeInteger(amount) || amount <= 0) {
        return NextResponse.json(
          { error: "Resource price is invalid." },
          { status: 400 },
        );
      }
      const idemRef = idempotencyRef(userId, idempotencyKey);
      activeIdempotencyRef = idemRef;
      const existingIdem = await idemRef.get();
      if (existingIdem.exists) {
        const saved = existingIdem.data();
        if (!isMatchingCheckout(saved, "RESOURCE", resourceId)) {
          return NextResponse.json(
            {
              error:
                "This idempotency key was already used for another checkout.",
            },
            { status: 409 },
          );
        }
        if (saved?.status === "COMPLETED" && saved.response)
          return NextResponse.json(saved.response);
        if (saved?.status !== "FAILED") {
          return NextResponse.json(
            { error: "A checkout with this idempotency key is in progress." },
            { status: 409 },
          );
        }
        await idemRef.delete();
      }
      try {
        await idemRef.create({
          status: "PROCESSING",
          entityType: "RESOURCE",
          resourceId,
          createdAt: new Date().toISOString(),
        });
      } catch {
        return NextResponse.json(
          { error: "A checkout with this idempotency key is in progress." },
          { status: 409 },
        );
      }

      /*
       * Create Razorpay order.
       */
      const razorpayResponse = await fetch(RAZORPAY_API_URL, {
        method: "POST",

        headers: {
          Authorization: `Basic ${Buffer.from(
            `${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`,
          ).toString("base64")}`,

          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          amount,
          currency: "INR",

          receipt: `resource_${resourceId}_${Date.now()}`,

          notes: {
            entityType: "RESOURCE",
            resourceId,
            userId,
          },

          payment_capture: 1,
        }),
      });

      if (!razorpayResponse.ok) {
        const razorpayError = await razorpayResponse.json().catch(() => null);

        console.error("Razorpay order creation failed:", razorpayError);
        await idemRef.update({
          status: "FAILED",
          updatedAt: new Date().toISOString(),
        });

        return NextResponse.json(
          {
            error: "Failed to create payment order.",
          },
          {
            status: 502,
          },
        );
      }

      const razorpayOrder = await razorpayResponse.json();
      if (
        typeof razorpayOrder?.id !== "string" ||
        razorpayOrder.amount !== amount ||
        razorpayOrder.currency !== "INR"
      ) {
        await idemRef.update({
          status: "FAILED",
          updatedAt: new Date().toISOString(),
        });
        return NextResponse.json(
          { error: "Invalid payment order response." },
          { status: 502 },
        );
      }

      /*
       * Store the order before returning it
       * to the browser.
       *
       * This server-side record becomes the source
       * of truth during signature verification.
       */
      const response = {
        orderId: razorpayOrder.id,
        amount,
        currency: "INR",
        resourceId,
        keyId: RAZORPAY_KEY_ID,
        name: "Astroeye",
        description: resource.title ?? "Astroeye Resource",
      };
      await adminDb.collection("resource_payments").doc(razorpayOrder.id).set({
        id: razorpayOrder.id,

        entityType: "RESOURCE",

        resourceId,
        userId,

        razorpayOrderId: razorpayOrder.id,

        amount,

        currency: "INR",

        status: "CREATED",

        createdAt: new Date().toISOString(),

        updatedAt: new Date().toISOString(),
      });
      await idemRef.update({ status: "COMPLETED", response });
      return NextResponse.json(response);
    }

    /*
     * ==========================================================
     * WEBINAR
     * ==========================================================
     */

    const webinarRef = adminDb.collection("webinars").doc(webinarId!);

    const webinarSnapshot = await webinarRef.get();

    if (!webinarSnapshot.exists) {
      return NextResponse.json(
        {
          error: "Webinar not found.",
        },
        {
          status: 404,
        },
      );
    }

    const webinar = webinarSnapshot.data();

    if (!webinar) {
      return NextResponse.json(
        {
          error: "Webinar not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (
      webinar.isActive === false ||
      webinar.status === "CANCELLED" ||
      webinar.status === "COMPLETED"
    ) {
      return NextResponse.json(
        { error: "This webinar is not available for registration." },
        { status: 400 },
      );
    }

    if (!webinar.isPaid) {
      return NextResponse.json(
        {
          error: "This webinar does not require payment.",
        },
        {
          status: 400,
        },
      );
    }

    const price = Number(webinar.amount ?? 0);

    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json(
        {
          error: "Webinar payment amount is not configured.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Check existing registration.
     */
    const existingRegistration = await adminDb
      .collection("webinar_registrations")
      .where("webinarId", "==", webinarId)
      .where("userId", "==", userId)
      .limit(1)
      .get();

    if (!existingRegistration.empty) {
      const registration = existingRegistration.docs[0].data();

      if (registration.registrationStatus === "REGISTERED") {
        return NextResponse.json(
          {
            error: "You are already registered for this webinar.",
          },
          {
            status: 409,
          },
        );
      }
    }

    /*
     * Check participant limit.
     */
    if (
      webinar.maxParticipants &&
      Number(webinar.registeredCount ?? 0) >= Number(webinar.maxParticipants)
    ) {
      return NextResponse.json(
        {
          error: "This webinar has reached its participant limit.",
        },
        {
          status: 409,
        },
      );
    }

    const amount = toRazorpayAmount(price);
    if (!Number.isSafeInteger(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Webinar payment amount is invalid." },
        { status: 400 },
      );
    }
    const idemRef = idempotencyRef(userId, idempotencyKey);
    activeIdempotencyRef = idemRef;
    const existingIdem = await idemRef.get();
    if (existingIdem.exists) {
      const saved = existingIdem.data();
      if (!isMatchingCheckout(saved, "WEBINAR", webinarId!)) {
        return NextResponse.json(
          {
            error:
              "This idempotency key was already used for another checkout.",
          },
          { status: 409 },
        );
      }
      if (saved?.status === "COMPLETED" && saved.response)
        return NextResponse.json(saved.response);
      if (saved?.status !== "FAILED") {
        return NextResponse.json(
          { error: "A checkout with this idempotency key is in progress." },
          { status: 409 },
        );
      }
      await idemRef.delete();
    }
    try {
      await idemRef.create({
        status: "PROCESSING",
        entityType: "WEBINAR",
        webinarId,
        createdAt: new Date().toISOString(),
      });
    } catch {
      return NextResponse.json(
        { error: "A checkout with this idempotency key is in progress." },
        { status: 409 },
      );
    }

    /*
     * Create Razorpay order.
     */
    const razorpayResponse = await fetch(RAZORPAY_API_URL, {
      method: "POST",

      headers: {
        Authorization: `Basic ${Buffer.from(
          `${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`,
        ).toString("base64")}`,

        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        amount,
        currency: "INR",

        receipt: `webinar_${webinarId}_${Date.now()}`,

        notes: {
          entityType: "WEBINAR",
          webinarId,
          userId,
        },

        payment_capture: 1,
      }),
    });

    if (!razorpayResponse.ok) {
      const razorpayError = await razorpayResponse.json().catch(() => null);

      console.error("Razorpay webinar order creation failed:", razorpayError);
      await idemRef.update({
        status: "FAILED",
        updatedAt: new Date().toISOString(),
      });

      return NextResponse.json(
        {
          error: "Failed to create payment order.",
        },
        {
          status: 502,
        },
      );
    }

    const razorpayOrder = await razorpayResponse.json();
    if (
      typeof razorpayOrder?.id !== "string" ||
      razorpayOrder.amount !== amount ||
      razorpayOrder.currency !== "INR"
    ) {
      await idemRef.update({
        status: "FAILED",
        updatedAt: new Date().toISOString(),
      });
      return NextResponse.json(
        { error: "Invalid payment order response." },
        { status: 502 },
      );
    }

    /*
     * Store server-side payment record.
     */
    const response = {
      orderId: razorpayOrder.id,
      amount,
      currency: "INR",
      webinarId,
      keyId: RAZORPAY_KEY_ID,
      name: "Astroeye",
      description: webinar.title ?? "Astroeye Webinar",
    };
    await adminDb.collection("webinar_payments").doc(razorpayOrder.id).set({
      id: razorpayOrder.id,

      entityType: "WEBINAR",

      webinarId,
      userId,

      razorpayOrderId: razorpayOrder.id,

      amount,

      currency: "INR",

      status: "CREATED",

      createdAt: new Date().toISOString(),

      updatedAt: new Date().toISOString(),
    });

    await idemRef.update({ status: "COMPLETED", response });
    return NextResponse.json(response);
  } catch (error) {
    console.error("Create payment order error:", error);
    if (activeIdempotencyRef) {
      await activeIdempotencyRef
        .update({ status: "FAILED", updatedAt: new Date().toISOString() })
        .catch(() => undefined);
    }

    return NextResponse.json(
      {
        error: "Unable to create payment order.",
      },
      {
        status: 500,
      },
    );
  }
}
