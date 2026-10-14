import { CartItem } from './cart';
import { Address } from './customer';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'credit_card' | 'upi' | 'net_banking' | 'cod';

export interface TimelineEvent {
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  items: {
    productId: string;
    variantId: string;
    reason: string;
    quantity: number;
  }[];
  status: 'requested' | 'approved' | 'pickup_scheduled' | 'received' | 'refunded' | 'rejected';
  reasonCategory: 'sizing_issue' | 'fabric_expectation' | 'damaged' | 'wrong_item' | 'other';
  comments?: string;
  refundAmount: number;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. VAST-2026-8812
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  currency: string;
  trackingNumber?: string;
  carrier?: string;
  timeline: TimelineEvent[];
  returnEligibleUntil: string;
  createdAt: string;
  updatedAt: string;
}
