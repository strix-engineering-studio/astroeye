import {
  PaymentStatus as WebinarPaymentStatus,
  RegistrationStatus,
} from "@/features/webinars/types/webiner.enum.types";

export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "CAPTURED"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "VERIFICATION_FAILED";

export interface PaymentRecord {
  id: string;
  orderId?: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  userId: string;
  customerEmail?: string;
  customerName?: string;
  entityType?: "PRODUCT" | "RESOURCE" | "WEBINAR";
  productId?: string;
  resourceId?: string;
  webinarId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  failureReason?: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
  capturedAt?: Date | string;
  verifiedAt?: Date | string;
}

/**
 * ============================================================
 * PRODUCT
 * ============================================================
 */

export interface CreateProductCheckoutInput {
  productId: string;
  idempotencyKey?: string;
}

export interface CreateProductCheckoutResponse {
  orderId: string;
  amount: number;
  currency: string;
  productId: string;
  keyId: string;
  name: string;
  description: string;
}

export interface VerifyProductPaymentInput {
  productId: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

export interface VerifyProductPaymentResponse {
  success: boolean;
  productId: string;
  paymentId: string;
  orderId: string;
  message?: string;
}

/**
 * ============================================================
 * RESOURCE
 * ============================================================
 */

export interface CreateResourceCheckoutInput {
  resourceId: string;
  idempotencyKey?: string;
}

export interface CreateResourceCheckoutResponse {
  orderId: string;
  amount: number;
  currency: string;
  resourceId: string;
  keyId: string;
  name: string;
  description: string;
}

export interface VerifyResourcePaymentInput {
  resourceId: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

export interface VerifyResourcePaymentResponse {
  success: boolean;
  resourceId: string;
  paymentId: string;
  orderId: string;
  accessUrl?: string;
  message?: string;
}

/**
 * ============================================================
 * WEBINAR
 * ============================================================
 */

export interface CreateWebinarPaymentOrderInput {
  webinarId: string;
  idempotencyKey?: string;
}

export interface CreateWebinarPaymentOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  webinarId: string;
  keyId: string;
  name: string;
  description: string;
}

export interface VerifyWebinarPaymentInput {
  webinarId: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

export interface VerifyWebinarPaymentResponse {
  success: boolean;
  webinarId: string;
  paymentId: string;
  orderId: string;
  registrationId: string;
  paymentStatus: WebinarPaymentStatus;
  registrationStatus: RegistrationStatus;
  message?: string;
}
