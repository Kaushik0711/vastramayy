# TypeScript Data Models & Schema Specifications

All primary data entities are typed in `src/types/`.

---

## 1. Product & Catalog Entities (`src/types/product.ts`)

```typescript
export type ProductGender = 'men' | 'women' | 'unisex';

export type ProductFit =
  | 'Tailored'
  | 'Regular'
  | 'Slim'
  | 'Structured Slim'
  | 'Flared Kalidar'
  | 'Relaxed Kalidar'
  | 'Oversized'
  | 'Relaxed';

export interface ProductVariant {
  id: string;
  sku: string;
  size: string;
  colorName: string;
  colorHex: string;
  stockQuantity: number;
  price: number;
  originalPrice?: number;
}

export interface ProductSpecification {
  fabric: string;
  weave?: string;
  lining?: string;
  embroideryType?: string;
  fit: ProductFit;
  careInstructions: string[];
  occasion: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  gender: ProductGender;
  categorySlug: string;
  subcategorySlug: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  featured: boolean;
  isNewArrival: boolean;
  isBestseller: boolean;
  isCustomTailorable: boolean;
  tags: string[];
  specifications: ProductSpecification;
  variants: ProductVariant[];
  images: {
    primary: string;
    gallery: string[];
    thumbnail: string;
  };
  totalStock: number;
  ratingAverage: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}
```

---

## 2. Order & Logistics Entities (`src/types/order.ts`)

```typescript
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
```

---

## 3. Customer & Measurement Entities (`src/types/customer.ts`)

```typescript
export interface CustomerProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  addresses: Address[];
  measurements?: {
    chest?: number;
    waist?: number;
    hip?: number;
    shoulder?: number;
    kurtaLength?: number;
    sleeveLength?: number;
  };
  totalOrdersCount: number;
  totalSpent: number;
  createdAt: string;
}
```
