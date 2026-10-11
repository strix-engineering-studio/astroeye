import type {
  CreateResourceCheckoutInput,
  CreateResourceCheckoutResponse,
  VerifyResourcePaymentInput,
  VerifyResourcePaymentResponse,
  CreateWebinarPaymentOrderInput,
  CreateWebinarPaymentOrderResponse,
  VerifyWebinarPaymentInput,
  VerifyWebinarPaymentResponse,
} from "../types/razorpay.types";

class PaymentServices {
  /**
   * ============================================================
   * RESOURCE PAYMENT
   * ============================================================
   */

  /**
   * Create a Razorpay order for a resource.
   *
   * The client sends only the resource ID.
   * The backend is responsible for:
   * - validating the resource
   * - checking premium status
   * - determining the price
   * - creating the Razorpay order
   */
  async createResourceCheckout(
    data: CreateResourceCheckoutInput,
  ): Promise<CreateResourceCheckoutResponse> {
    const response = await fetch("/api/payments/create-order", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": data.idempotencyKey ?? crypto.randomUUID(),
      },

      credentials: "include",

      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await this.parseError(response);

      throw new Error(error || "Failed to create resource payment order");
    }

    return response.json();
  }

  /**
   * Verify Razorpay payment for a resource.
   *
   * The backend must verify the Razorpay signature
   * before granting resource access.
   */
  async verifyResourcePayment(
    data: VerifyResourcePaymentInput,
  ): Promise<VerifyResourcePaymentResponse> {
    const response = await fetch("/api/payments/verify", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await this.parseError(response);

      throw new Error(error || "Failed to verify resource payment");
    }

    return response.json();
  }

  /**
   * ============================================================
   * WEBINAR PAYMENT
   * ============================================================
   */

  /**
   * Create a Razorpay order for a paid webinar.
   *
   * The client sends only the webinar ID.
   *
   * The backend is responsible for:
   * - validating the webinar
   * - checking isPaid
   * - determining webinar.amount
   * - checking registration availability
   * - checking existing registration
   * - creating the Razorpay order
   */
  async createWebinarPaymentOrder(
    data: CreateWebinarPaymentOrderInput,
  ): Promise<CreateWebinarPaymentOrderResponse> {
    const response = await fetch("/api/payments/create-order", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": data.idempotencyKey ?? crypto.randomUUID(),
      },

      credentials: "include",

      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await this.parseError(response);

      throw new Error(error || "Failed to create webinar payment order");
    }

    return response.json();
  }

  /**
   * Verify Razorpay payment for a webinar.
   *
   * The backend must:
   * - verify the Razorpay signature
   * - verify the payment
   * - create/update WebinarRegistration
   * - set paymentStatus = PAID
   * - set registrationStatus = REGISTERED
   */
  async verifyWebinarPayment(
    data: VerifyWebinarPaymentInput,
  ): Promise<VerifyWebinarPaymentResponse> {
    const response = await fetch("/api/payments/verify", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await this.parseError(response);

      throw new Error(error || "Failed to verify webinar payment");
    }

    return response.json();
  }

  /**
   * ============================================================
   * ERROR HANDLING
   * ============================================================
   */

  /**
   * Safely extract an error message from an API response.
   *
   * Prevents response.json() from throwing when the backend
   * returns an empty or non-JSON response.
   */
  private async parseError(response: Response): Promise<string | null> {
    try {
      const error = await response.json();

      if (typeof error === "object" && error !== null) {
        const message =
          "error" in error
            ? error.error
            : "message" in error
              ? error.message
              : null;

        if (typeof message === "string") {
          return message;
        }

        if (Array.isArray(message)) {
          return message.join(", ");
        }
      }

      if (typeof error === "string") {
        return error;
      }

      return null;
    } catch {
      return null;
    }
  }
}

export default new PaymentServices();
