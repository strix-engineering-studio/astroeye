import type { CreatePaymentOrderInput, CreatePaymentOrderResponse, PaymentFilters, PaymentType, VerifyPaymentInput, VerifyPaymentResponse } from "../types/razorpay.types";

async function request<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const result: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message = result && typeof result === "object" && "error" in result && typeof result.error === "string" ? result.error : "Payment request failed.";
    throw new Error(message);
  }
  return result as T;
}

class PaymentServices {
  createPaymentOrder(data: CreatePaymentOrderInput): Promise<CreatePaymentOrderResponse> { return request("/api/payments/create-order", data); }
  verifyPayment(data: VerifyPaymentInput): Promise<VerifyPaymentResponse> { return request("/api/payments/verify", data); }
  getPayments(filters: PaymentFilters): Promise<{ data: PaymentType[]; totalPages: number }> {
    return request(`/api/payments?search=${encodeURIComponent(filters.search)}&status=${encodeURIComponent(filters.status || "")}...etc`, {});
  }
}
export default new PaymentServices();
