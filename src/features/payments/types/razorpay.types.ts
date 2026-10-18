export type PaymentStatus = "CREATED" | "PENDING" | "PROCESSING" | "CAPTURED" | "PAID" | "FAILED" | "REFUNDED" | "VERIFICATION_FAILED";

export interface PaymentRecord {
  id: string;
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface PaymentType {
  id: string;
  orderId: string;
  userId: string;
  amount: number; // paise
  currency: string;
  status: string;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  createdAt?: unknown;
}

export interface PaymentFilters {
  search: string;
  status?: string;
  currency?: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  page: number;
  limit: number;
}

export interface CreatePaymentOrderInput { orderId: string }
export interface CreatePaymentOrderResponse { orderId: string; applicationOrderId: string; amount: number; currency: string; keyId: string; name: string; description: string }
export interface VerifyPaymentInput { applicationOrderId: string; razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }
export interface VerifyPaymentResponse { success: boolean; orderId: string; status: "PAID" | "PROCESSING"; message?: string }
