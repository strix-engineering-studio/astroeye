import { FieldValue } from "firebase-admin/firestore";

import {
  Order,
  CreateOrderInput,
  UpdateOrderInput,
  OrderStats,
  OrderFilters,
} from "../types/orders.types";

import { COLLECTIONS } from "@/lib/constants/COLLECTIONS";
import { firestoreService } from "@/lib/firebase/admin-firestore";
import { OrderStatus } from "../types";
import { logger } from "@/lib/logger";

class OrdersRepository {
  // --------------------------------------------------------------------------
  // Orders
  // --------------------------------------------------------------------------

  /**
   * Fetch all orders
   */
  async findAll(filters?: OrderFilters): Promise<Order[]> {
    try {
      logger.info("Fetching all orders with filters:", filters);

      const orders = await firestoreService.getDocuments<Order>(
        COLLECTIONS.ORDERS,
      );

      if (!filters) {
        logger.debug(
          "No filters applied, returning all orders. Count:",
          orders.length,
        );
        return orders;
      }

      let filteredOrders = orders;

      // Search by title
      if (filters.search) {
        const search = filters.search.toLowerCase().trim();

        filteredOrders = filteredOrders.filter((order) =>
          order.title.toLowerCase().includes(search),
        );
      }

      // Filter by user
      if (filters.userId) {
        filteredOrders = filteredOrders.filter(
          (order) => order.userId === filters.userId,
        );
      }

      // Filter by resource
      if (filters.resourceId) {
        filteredOrders = filteredOrders.filter(
          (order) => order.resourceId === filters.resourceId,
        );
      }

      // Filter by creator
      if (filters.creatorId) {
        filteredOrders = filteredOrders.filter(
          (order) => order.creatorId === filters.creatorId,
        );
      }

      // Filter by status
      if (filters.status) {
        filteredOrders = filteredOrders.filter(
          (order) => order.status === filters.status,
        );
      }

      // Filter by payment method
      if (filters.paymentMethod) {
        filteredOrders = filteredOrders.filter(
          (order) => order.paymentMethod === filters.paymentMethod,
        );
      }

      // Filter by currency
      if (filters.currency) {
        filteredOrders = filteredOrders.filter(
          (order) => order.currency === filters.currency,
        );
      }

      // Minimum amount
      if (filters.minAmount !== undefined) {
        filteredOrders = filteredOrders.filter(
          (order) => order.amount >= Number(filters.minAmount),
        );
      }

      // Maximum amount
      if (filters.maxAmount !== undefined) {
        filteredOrders = filteredOrders.filter(
          (order) => order.amount <= Number(filters.maxAmount),
        );
      }

      // Created after
      if (filters.createdAfter) {
        const createdAfter = new Date(filters.createdAfter).getTime();

        filteredOrders = filteredOrders.filter(
          (order) => new Date(order.createdAt).getTime() >= createdAfter,
        );
      }

      // Created before
      if (filters.createdBefore) {
        const createdBefore = new Date(filters.createdBefore).getTime();

        filteredOrders = filteredOrders.filter(
          (order) => new Date(order.createdAt).getTime() <= createdBefore,
        );
      }

      // Sorting
      if (filters.sortBy) {
        const sortBy = filters.sortBy;
        const direction = filters.sortOrder === "asc" ? 1 : -1;

        filteredOrders.sort((a, b) => {
          if (sortBy === "amount") {
            return (a.amount - b.amount) * direction;
          }

          if (sortBy === "title") {
            return a.title.localeCompare(b.title) * direction;
          }

          const aValue = new Date(a[sortBy]).getTime();
          const bValue = new Date(b[sortBy]).getTime();

          return (aValue - bValue) * direction;
        });
      }

      // Pagination
      const page = Math.max(Number(filters.page ?? 1), 1);
      const limit = Math.max(Number(filters.limit ?? filteredOrders.length), 1);

      const startIndex = (page - 1) * limit;

      logger.debug(
        "Orders filtered successfully. Result count:",
        filteredOrders.length,
      );
      return filteredOrders.slice(startIndex, startIndex + limit);
    } catch (error) {
      logger.error("Error in findAll orders:", error);
      throw error;
    }
  }

  /**
   * Fetch order by id
   */
  async findById(id: string): Promise<Order | null> {
    try {
      logger.info("Fetching order by ID:", id);

      const order = await firestoreService.getDocument<Order>(
        COLLECTIONS.ORDERS,
        id,
      );

      if (!order) {
        logger.debug("Order not found with ID:", id);
        return null;
      }

      logger.debug("Order found successfully:", order.id);
      return order;
    } catch (error) {
      logger.error(`Error in findById for order ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create order
   */
  async create(data: CreateOrderInput): Promise<Order> {
    try {
      logger.info("Creating new order for user:", data.userId);

      const id = await firestoreService.addDocument(COLLECTIONS.ORDERS, {
        ...data,

        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      const order = await this.findById(id as string);

      if (!order) {
        throw new Error("Failed to create order");
      }

      logger.info("Order created successfully with ID:", order.id);
      return order;
    } catch (error) {
      logger.error("Error creating order:", error);
      throw error;
    }
  }

  /**
   * Update order
   */
  async update(id: string, data: UpdateOrderInput): Promise<Order> {
    try {
      logger.info("Updating order:", id);

      await firestoreService.updateDocument(COLLECTIONS.ORDERS, id, {
        ...data,
        updatedAt: FieldValue.serverTimestamp(),
      });

      const order = await this.findById(id);

      if (!order) {
        throw new Error("Order not found");
      }

      logger.info("Order updated successfully:", id);
      return order;
    } catch (error) {
      logger.error(`Error updating order ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete order
   */
  async delete(id: string): Promise<void> {
    try {
      logger.info("Deleting order:", id);
      await firestoreService.deleteDocument(COLLECTIONS.ORDERS, id);
      logger.info("Order deleted successfully:", id);
    } catch (error) {
      logger.error(`Error deleting order ${id}:`, error);
      throw error;
    }
  }

  // --------------------------------------------------------------------------
  // Order Queries
  // --------------------------------------------------------------------------

  /**
   * Fetch orders by user
   */
  async findByUser(userId: string): Promise<Order[]> {
    try {
      logger.info("Fetching orders by user:", userId);
      const orders = await firestoreService.getDocumentsByField<Order>(
        COLLECTIONS.ORDERS,
        "userId",
        userId,
      );
      logger.debug("Found orders for user:", { userId, count: orders.length });
      return orders;
    } catch (error) {
      logger.error(`Error fetching orders for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Fetch orders by resource
   */
  async findByResource(resourceId: string): Promise<Order[]> {
    try {
      logger.info("Fetching orders by resource:", resourceId);
      const orders = await firestoreService.getDocumentsByField<Order>(
        COLLECTIONS.ORDERS,
        "resourceId",
        resourceId,
      );
      logger.debug("Found orders for resource:", {
        resourceId,
        count: orders.length,
      });
      return orders;
    } catch (error) {
      logger.error(`Error fetching orders for resource ${resourceId}:`, error);
      throw error;
    }
  }

  /**
   * Fetch orders by creator
   */
  async findByCreator(creatorId: string): Promise<Order[]> {
    try {
      logger.info("Fetching orders by creator:", creatorId);
      const orders = await firestoreService.getDocumentsByField<Order>(
        COLLECTIONS.ORDERS,
        "creatorId",
        creatorId,
      );
      logger.debug("Found orders for creator:", {
        creatorId,
        count: orders.length,
      });
      return orders;
    } catch (error) {
      logger.error(`Error fetching orders for creator ${creatorId}:`, error);
      throw error;
    }
  }

  /**
   * Fetch orders by status
   */
  async findByStatus(status: Order["status"]): Promise<Order[]> {
    try {
      logger.info("Fetching orders by status:", status);
      const orders = await firestoreService.getDocumentsByField<Order>(
        COLLECTIONS.ORDERS,
        "status",
        status,
      );
      logger.debug("Found orders for status:", {
        status,
        count: orders.length,
      });
      return orders;
    } catch (error) {
      logger.error(`Error fetching orders for status ${status}:`, error);
      throw error;
    }
  }

  // --------------------------------------------------------------------------
  // Order Lifecycle
  // --------------------------------------------------------------------------

  /**
   * Update order status
   */
  async updateStatus(id: string, status: Order["status"]): Promise<Order> {
    try {
      logger.info(`Updating status for order ${id} to ${status}`);

      const updateData: Record<string, unknown> = {
        status,
        updatedAt: FieldValue.serverTimestamp(),
      };

      if (status === "completed") {
        updateData.completedAt = FieldValue.serverTimestamp();
      }

      if (status === "refunded") {
        updateData.refundedAt = FieldValue.serverTimestamp();
      }

      await firestoreService.updateDocument(COLLECTIONS.ORDERS, id, updateData);

      const order = await this.findById(id);

      if (!order) {
        throw new Error("Order not found");
      }

      logger.info("Order status updated successfully:", id);
      return order;
    } catch (error) {
      logger.error(`Error updating status for order ${id}:`, error);
      throw error;
    }
  }

  /**
   * Mark order as completed
   */
  async complete(
    id: string,
    data?: {
      paymentId?: string;
      paymentMethod?: string;
    },
  ): Promise<Order> {
    try {
      logger.info("Completing order:", id);

      await firestoreService.updateDocument(COLLECTIONS.ORDERS, id, {
        ...data,
        status: "completed",
        completedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      const order = await this.findById(id);

      if (!order) {
        throw new Error("Order not found");
      }

      logger.info("Order completed successfully:", id);
      return order;
    } catch (error) {
      logger.error(`Error completing order ${id}:`, error);
      throw error;
    }
  }

  /**
   * Mark order as refunded
   */
  async refund(id: string): Promise<Order> {
    try {
      logger.info("Refunding order:", id);

      await firestoreService.updateDocument(COLLECTIONS.ORDERS, id, {
        status: OrderStatus.refunded,
        refundedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      const order = await this.findById(id);

      if (!order) {
        throw new Error("Order not found");
      }

      logger.info("Order refunded successfully:", id);
      return order;
    } catch (error) {
      logger.error(`Error refunding order ${id}:`, error);
      throw error;
    }
  }

  // --------------------------------------------------------------------------
  // Order Statistics
  // --------------------------------------------------------------------------

  /**
   * Fetch order statistics
   */
  async getStats(): Promise<OrderStats> {
    try {
      logger.info("Calculating order statistics");
      const orders = await this.findAll();

      const stats: OrderStats = {
        totalOrders: orders.length,

        totalAmount: orders.reduce(
          (sum, order) => sum + (order.amount ?? 0),
          0,
        ),

        pendingOrders: orders.filter(
          (order) => order.status === OrderStatus.pending,
        ).length,

        completedOrders: orders.filter(
          (order) => order.status === OrderStatus.completed,
        ).length,

        refundedOrders: orders.filter(
          (order) => order.status === OrderStatus.refunded,
        ).length,

        failedOrders: orders.filter(
          (order) => order.status === OrderStatus.failed,
        ).length,
      };

      logger.info("Order stats calculated successfully:", stats);
      return stats;
    } catch (error) {
      logger.error("Error calculating order stats:", error);
      throw error;
    }
  }

  /**
   * Fetch recent orders
   */
  async getRecent(limit = 10): Promise<Order[]> {
    try {
      logger.info("Fetching recent orders with limit:", limit);
      const orders = await firestoreService.getDocumentsOrdered<Order>(
        COLLECTIONS.ORDERS,
        "createdAt",
        limit,
        "desc",
      );
      logger.debug("Found recent orders count:", orders.length);
      return orders;
    } catch (error) {
      logger.error("Error fetching recent orders:", error);
      throw error;
    }
  }

  /**
   * Fetch highest-value orders
   */
  async getHighestValue(limit = 10): Promise<Order[]> {
    try {
      logger.info("Fetching highest value orders with limit:", limit);
      const orders = await firestoreService.getDocumentsOrdered<Order>(
        COLLECTIONS.ORDERS,
        "amount",
        limit,
        "desc",
      );
      logger.debug("Found highest value orders count:", orders.length);
      return orders;
    } catch (error) {
      logger.error("Error fetching highest value orders:", error);
      throw error;
    }
  }

  /**
   * Fetch pending orders
   */
  async getPending(): Promise<Order[]> {
    try {
      logger.info("Fetching pending orders");
      return await this.findByStatus(OrderStatus.pending);
    } catch (error) {
      logger.error("Error fetching pending orders:", error);
      throw error;
    }
  }

  /**
   * Fetch completed orders
   */
  async getCompleted(): Promise<Order[]> {
    try {
      logger.info("Fetching completed orders");
      return await this.findByStatus(OrderStatus.completed);
    } catch (error) {
      logger.error("Error fetching completed orders:", error);
      throw error;
    }
  }

  /**
   * Fetch refunded orders
   */
  async getRefunded(): Promise<Order[]> {
    try {
      logger.info("Fetching refunded orders");
      return await this.findByStatus(OrderStatus.refunded);
    } catch (error) {
      logger.error("Error fetching refunded orders:", error);
      throw error;
    }
  }

  /**
   * Fetch failed orders
   */
  async getFailed(): Promise<Order[]> {
    try {
      logger.info("Fetching failed orders");
      return await this.findByStatus(OrderStatus.failed);
    } catch (error) {
      logger.error("Error fetching failed orders:", error);
      throw error;
    }
  }
}

export const ordersRepository = new OrdersRepository();

export default ordersRepository;
