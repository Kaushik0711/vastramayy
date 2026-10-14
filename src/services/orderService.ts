import { storage } from './storageAdapter';
import { MOCK_ORDERS } from '../data/orders';
import { Order, OrderStatus, ReturnRequest } from '../types';

const ORDERS_STORAGE_KEY = 'orders';
const RETURNS_STORAGE_KEY = 'return_requests';

// In-memory set to prevent double submission within a short time window
const inFlightOrderKeys = new Set<string>();

export const orderService = {
  /**
   * Retrieve all orders
   */
  async getAllOrders(): Promise<Order[]> {
    return await storage.getItem<Order[]>(ORDERS_STORAGE_KEY, MOCK_ORDERS);
  },

  /**
   * Find order by internal ID or human-readable order number (e.g. VAST-2026-8812)
   */
  async getOrderById(idOrNumber: string): Promise<Order | undefined> {
    const orders = await this.getAllOrders();
    return orders.find(
      (o) => o.id === idOrNumber || o.orderNumber.toLowerCase() === idOrNumber.toLowerCase()
    );
  },

  /**
   * Get orders for a specific customer
   */
  async getOrdersByCustomerId(customerId: string): Promise<Order[]> {
    const orders = await this.getAllOrders();
    return orders.filter((o) => o.customerId === customerId);
  },

  /**
   * Determine if an order is eligible for cancellation
   * (Permitted only before the garment leaves the atelier inspection phase: pending or confirmed)
   */
  canCancelOrder(order: Order): { eligible: boolean; reason?: string } {
    if (order.orderStatus === 'cancelled') {
      return { eligible: false, reason: 'This order has already been cancelled.' };
    }
    if (order.orderStatus === 'delivered' || order.orderStatus === 'shipped' || order.orderStatus === 'out_for_delivery') {
      return {
        eligible: false,
        reason: 'Order has already departed the atelier. Please await delivery and request a return instead.',
      };
    }
    if (order.orderStatus === 'pending' || order.orderStatus === 'confirmed') {
      return { eligible: true };
    }
    return {
      eligible: false,
      reason: 'Atelier tailoring is in progress. Please contact customer concierge.',
    };
  },

  /**
   * Determine if an order is eligible for return
   * (Permitted within 10 days of delivery, and order status must be 'delivered')
   */
  canReturnOrder(order: Order): { eligible: boolean; reason?: string; daysRemaining?: number } {
    if (order.orderStatus !== 'delivered') {
      return {
        eligible: false,
        reason: 'Returns can only be initiated once the garment has been delivered.',
      };
    }

    const expiry = new Date(order.returnEligibleUntil).getTime();
    const now = Date.now();
    const diffMs = expiry - now;

    if (diffMs <= 0) {
      return {
        eligible: false,
        reason: 'The 10-day complimentary return window has expired for this order.',
      };
    }

    const daysRemaining = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    return { eligible: true, daysRemaining };
  },

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: string, reason: string): Promise<Order> {
    const orders = await this.getAllOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) throw new Error('Order not found');

    const eligibility = this.canCancelOrder(orders[index]);
    if (!eligibility.eligible) {
      throw new Error(eligibility.reason || 'This order cannot be cancelled.');
    }

    orders[index].orderStatus = 'cancelled';
    orders[index].paymentStatus = orders[index].paymentStatus === 'paid' ? 'refunded' : 'failed';
    orders[index].updatedAt = new Date().toISOString();
    orders[index].timeline.push({
      title: 'Order Cancelled',
      description: `Cancellation requested: ${reason}`,
      timestamp: new Date().toISOString(),
      completed: true,
    });

    await storage.setItem(ORDERS_STORAGE_KEY, orders);
    return orders[index];
  },

  /**
   * Create a new immutable order snapshot with duplicate submission prevention
   */
  async createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'timeline' | 'returnEligibleUntil' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    // Duplicate submission guard (idempotency key based on customer, amount, and items)
    const idempotencySignature = `${orderData.customerId}_${orderData.total}_${orderData.items.map((i) => `${i.variantId}:${i.quantity}`).join(',')}`;
    if (inFlightOrderKeys.has(idempotencySignature)) {
      throw new Error('Order submission already in progress. Please wait.');
    }

    inFlightOrderKeys.add(idempotencySignature);

    try {
      const orders = await this.getAllOrders();
      const orderYear = new Date().getFullYear();
      const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
      const orderNumber = `VAST-${orderYear}-${uniqueSuffix}`;
      const now = new Date().toISOString();
      const returnEligibleUntil = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString();

      // Deep clone items and address to create an immutable snapshot
      const immutableOrder: Order = {
        ...orderData,
        id: `ord-${Date.now()}`,
        orderNumber,
        items: JSON.parse(JSON.stringify(orderData.items)),
        shippingAddress: JSON.parse(JSON.stringify(orderData.shippingAddress)),
        billingAddress: JSON.parse(JSON.stringify(orderData.billingAddress)),
        trackingNumber: `VMTRK${Math.floor(100000000 + Math.random() * 900000000)}`,
        carrier: 'BlueDart Luxury Express',
        timeline: [
          {
            title: 'Order Placed & Confirmed',
            description: `Payment authorized via ${orderData.paymentMethod.toUpperCase()}`,
            timestamp: now,
            completed: true,
          },
          {
            title: 'Atelier Tailoring & Quality Inspection',
            description: 'Hand inspection by master couturier at Varanasi Atelier',
            timestamp: now,
            completed: false,
          },
          {
            title: 'Handcrafted Packaging',
            description: 'Garment packed in breathable muslin bag with fragrance cedar block',
            timestamp: '',
            completed: false,
          },
          {
            title: 'Dispatched with BlueDart Express',
            description: 'Tamper-evident luxury seal applied with tracking active',
            timestamp: '',
            completed: false,
          },
          {
            title: 'Delivered',
            description: 'Signature handover at doorstep',
            timestamp: '',
            completed: false,
          },
        ],
        returnEligibleUntil,
        createdAt: now,
        updatedAt: now,
      };

      orders.unshift(immutableOrder);
      await storage.setItem(ORDERS_STORAGE_KEY, orders);
      return immutableOrder;
    } finally {
      // Clear guard after a brief timeout
      setTimeout(() => inFlightOrderKeys.delete(idempotencySignature), 3000);
    }
  },

  /**
   * Update order status (Admin & simulated workflow transitions)
   */
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
    const orders = await this.getAllOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) return null;

    orders[index].orderStatus = status;
    orders[index].updatedAt = new Date().toISOString();
    orders[index].timeline.push({
      title: `Status updated to ${status.replace(/_/g, ' ').toUpperCase()}`,
      description: 'Atelier milestone updated in operations log',
      timestamp: new Date().toISOString(),
      completed: true,
    });

    await storage.setItem(ORDERS_STORAGE_KEY, orders);
    return orders[index];
  },

  // --- Returns Lifecycle ---

  /**
   * Retrieve all return requests
   */
  async getAllReturnRequests(): Promise<ReturnRequest[]> {
    return await storage.getItem<ReturnRequest[]>(RETURNS_STORAGE_KEY, []);
  },

  /**
   * Retrieve return requests for an order
   */
  async getReturnsForOrder(orderId: string): Promise<ReturnRequest[]> {
    const returns = await this.getAllReturnRequests();
    return returns.filter((r) => r.orderId === orderId);
  },

  /**
   * Create a return request with item selection, quantity, and reason
   */
  async createReturnRequest(
    data: Omit<ReturnRequest, 'id' | 'status' | 'createdAt'>
  ): Promise<ReturnRequest> {
    const order = await this.getOrderById(data.orderId);
    if (!order) throw new Error('Order not found');

    const eligibility = this.canReturnOrder(order);
    if (!eligibility.eligible) {
      throw new Error(eligibility.reason || 'This order is not eligible for return.');
    }

    // Validate return items and quantities against ordered items
    for (const returnItem of data.items) {
      const orderItem = order.items.find(
        (i) => i.productId === returnItem.productId && i.variantId === returnItem.variantId
      );
      if (!orderItem) {
        throw new Error('Return item does not match garments in this order.');
      }
      if (returnItem.quantity <= 0 || returnItem.quantity > orderItem.quantity) {
        throw new Error(`Invalid return quantity for ${orderItem.name}.`);
      }
    }

    const returns = await this.getAllReturnRequests();
    const newReturn: ReturnRequest = {
      ...data,
      id: `ret-${Date.now()}`,
      status: 'requested',
      createdAt: new Date().toISOString(),
    };

    returns.unshift(newReturn);
    await storage.setItem(RETURNS_STORAGE_KEY, returns);

    // Update order status and append return timeline event
    const orders = await this.getAllOrders();
    const orderIndex = orders.findIndex((o) => o.id === data.orderId);
    if (orderIndex !== -1) {
      orders[orderIndex].orderStatus = 'returned';
      orders[orderIndex].timeline.push({
        title: 'Return Request Registered',
        description: `Doorstep pickup initiated for return ID #${newReturn.id}`,
        timestamp: new Date().toISOString(),
        completed: true,
      });
      await storage.setItem(ORDERS_STORAGE_KEY, orders);
    }

    return newReturn;
  },

  /**
   * Reset orders to defaults
   */
  async resetToDefaults(): Promise<void> {
    await storage.setItem(ORDERS_STORAGE_KEY, MOCK_ORDERS);
    await storage.setItem(RETURNS_STORAGE_KEY, []);
  },
};
