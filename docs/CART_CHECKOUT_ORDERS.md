# Vastramay Cart, Checkout & Order Pipeline Specification

This document details the complete customer purchasing lifecycle in Vastramay, from bag curation to order fulfillment and returns.

---

## 1. Shopping Bag & Financial Logic

The cart domain is managed by [`src/context/CartContext.tsx`](file:///Users/jarvis/MySites/vastramay-3d/src/context/CartContext.tsx) and synchronized with `VersionedLocalStorageAdapter`.

### Item Data Model
```typescript
export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  image: string;
  price: number;              // Current price per unit in INR
  originalPrice?: number;
  size: string;
  colorName: string;
  quantity: number;           // Quantity added
  stockAvailable: number;     // Real-time stock constraint
}
```

### Financial Calculations
All monetary calculations are performed in whole Indian Rupees (INR):
1. **Subtotal**: $\sum (\text{item.price} \times \text{item.quantity})$
2. **Complimentary Shipping Threshold**: Orders $\ge ₹5,000$ qualify for complimentary standard delivery; orders $< ₹5,000$ incur a flat ₹250 logistics fee.
3. **Express Doorstep Dispatch Surcharge**: Optional express delivery adds a ₹400 surcharge.
4. **Discount Calculation**: Applied via validated coupon rules.
5. **Grand Total**: $\text{Subtotal} - \text{Discount} + \text{Shipping Fee}$.

---

## 2. Promotional Privileges & Coupons

Coupons are managed by [`src/services/promotionService.ts`](file:///Users/jarvis/MySites/vastramay-3d/src/services/promotionService.ts).

### Active Seed Coupons

| Coupon Code | Discount Type | Value | Minimum Order | Cap / Rules |
| :--- | :--- | :--- | :--- | :--- |
| `ROYAL10` | Percentage | 10% | ₹2,000 | Maximum discount ₹2,500 |
| `FESTIVE15` | Percentage | 15% | ₹5,000 | Maximum discount ₹4,000 |
| `ATELIER1000` | Fixed | ₹1,000 | ₹10,000 | Fixed cash discount |

### Validation Rules
- Code matching is normalized (case-insensitive, whitespace-trimmed).
- Checks `isActive` flag and `validUntil` expiry date.
- Enforces `minOrderAmount` constraint with localized error messaging.
- Enforces `maxDiscountAmount` ceiling when applicable.

---

## 3. Multi-Step Checkout Flow

The checkout journey is implemented in [`src/pages/storefront/CheckoutPage.tsx`](file:///Users/jarvis/MySites/vastramay-3d/src/pages/storefront/CheckoutPage.tsx).

```
Step 1: Contact Information (Email & SMS Phone)
       │
       ▼
Step 2: Delivery Destination (Address Book or New Address with PIN lookup)
       │
       ▼
Step 3: Delivery Experience (Standard Complimentary vs Express Doorstep)
       │
       ▼
Step 4: Payment Method (UPI, Net Banking, Credit/Debit Card, or COD)
       │
       ▼
Step 5: Order Confirmation & Receipt Generation (/order-success)
```

### Indian Postal PIN Code Auto-Detection
The checkout form features an integrated Indian postal lookup utility ([`src/utils/pincodes.ts`](file:///Users/jarvis/MySites/vastramay-3d/src/utils/pincodes.ts)):
- When a 6-digit PIN code is typed (e.g. `110001` or `400001`), the system automatically resolves and pre-fills the corresponding **City** (e.g. `New Delhi`, `Mumbai`) and **State / Union Territory** (e.g. `Delhi`, `Maharashtra`).

### Address Validation Constraints
- Recipient Name: Required, minimum 2 characters.
- Phone Number: Required, 10-digit Indian mobile format (`/^[6-9]\d{9}$/`).
- Street Address: Required.
- PIN Code: Exactly 6 numeric digits.

---

## 4. Order Lifecycle & Status Pipeline

Orders are processed via [`src/services/orderService.ts`](file:///Users/jarvis/MySites/vastramay-3d/src/services/orderService.ts).

### Order Status Transitions
Orders progress through a 5-stage pipeline:

```
[ pending ] ──► [ confirmed ] ──► [ processing ] ──► [ shipped ] ──► [ delivered ]
    │                                                      │
    └──► [ cancelled ]                                     └──► [ returned ]
```

- `pending`: Order placed, payment authorization initiated.
- `confirmed`: Payment captured, order registered in atelier queue.
- `processing`: Garments undergoing master inspection and tailored packaging.
- `shipped`: Dispatched via logistics courier with active tracking number.
- `delivered`: Safely delivered to client destination.
- `cancelled`: Order voided prior to dispatch.
- `returned`: Customer return claim processed and refund issued.

### Real-Time Inventory Deduction
Upon successful order placement:
1. `orderService.createOrder()` writes the new order to storage.
2. For each order item, `inventoryService.adjustStock()` atomically decreases variant inventory.
3. An immutable audit record is appended to `inventory_movements` with reason `'Customer Order Placed'`.
