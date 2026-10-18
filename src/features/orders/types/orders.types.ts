/**
 * Order type definitions based on OrderModel
 */

import { OrderStatus } from "./orders.enums";

export interface Order {
  id: string;
  userId: string;
  resourceId?: string;
  productId?: string;
  creatorId?: string;
  title: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  paymentId?: string;
  paymentMethod?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  completedAt?: Date | string;
  refundedAt?: Date | string;
  items?: Array<{ productId: string; name: string; sku?: string; unitAmount: number; quantity: number; lineTotal: number }>;
  subtotal?: number;
  shippingAmount?: number;
  shippingAddress?: { line1: string; line2?: string; city: string; state?: string; postalCode: string };
  customer?: { name?: string; email?: string; phone?: string };
  paymentStatus?: "PENDING" | "PAID" | "FAILED" | "PROCESSING";
}

export interface OrderFilters extends Record<
  string,
  string | number | boolean | Date | null | undefined
> {
  search?: string;
  userId?: string;
  resourceId?: string;
  creatorId?: string;
  status?: OrderStatus;
  paymentMethod?: string;
  currency?: string;
  minAmount?: number;
  maxAmount?: number;
  createdAfter?: Date | string;
  createdBefore?: Date | string;
  sortBy?: "createdAt" | "updatedAt" | "amount" | "title";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface OrderStats {
  totalOrders: number;
  totalAmount: number;
  pendingOrders: number;
  completedOrders: number;
  refundedOrders: number;
  failedOrders: number;
}

/**
 * Create order input.
 *
 * Server-generated fields such as id, timestamps, and payment-related
 * completion/refund fields are excluded.
 */
export type CreateOrderInput = Omit<
  Order,
  "id" | "createdAt" | "updatedAt" | "completedAt" | "refundedAt"
>;

/**
 * Update order input.
 *
 * Identity and immutable fields are excluded from updates.
 */
export type UpdateOrderInput = Partial<
  Omit<Order, "id" | "userId" | "resourceId" | "creatorId" | "createdAt">
>;
