# Vastramay State Architecture & Persistence Guide

This document details the state management and persistence mechanisms implemented in Vastramay, covering global React Context providers, the versioned storage engine, schema envelopes, and backend readiness.

---

## 1. State Management Architecture

Vastramay employs a clean, modular React Context architecture divided into four primary domains:

```
               ┌───────────────────────┐
               │        App.tsx        │
               └───────────┬───────────┘
                           │
      ┌────────────────────┼────────────────────┐
      ▼                    ▼                    ▼
┌──────────────┐   ┌──────────────┐   ┌───────────────────┐
│ AuthContext  │   │ CartContext  │   │  WishlistContext  │
└──────────────┘   └──────────────┘   └───────────────────┘
                           │
                           ▼
                  ┌───────────────────┐
                  │   ToastContext    │
                  └───────────────────┘
```

### `AuthContext`
- **Location**: [`src/context/AuthContext.tsx`](file:///Users/jarvis/MySites/vastramay-3d/src/context/AuthContext.tsx)
- **Responsibilities**:
  - Manages active customer and administrative user sessions.
  - Exposes `login()`, `logout()`, `adminLogin()`, and `adminLogout()` methods.
  - Coordinates with `authService.ts` for credential verification.
  - Synchronizes session state with browser session storage.

### `CartContext`
- **Location**: [`src/context/CartContext.tsx`](file:///Users/jarvis/MySites/vastramay-3d/src/context/CartContext.tsx)
- **Responsibilities**:
  - Manages items currently in the shopping bag (`cartItems: CartItem[]`).
  - Provides atomic methods: `addItem()`, `removeItem()`, `updateQuantity()`, `clearCart()`.
  - Calculates real-time financial summaries (`subtotal`, `shippingFee`, `discount`, `total`).
  - Enforces stock limits so quantity never exceeds available variant inventory.
  - Automatically persists cart state to `storageAdapter` under key `'cart'`.

### `WishlistContext`
- **Location**: [`src/context/WishlistContext.tsx`](file:///Users/jarvis/MySites/vastramay-3d/src/context/WishlistContext.tsx)
- **Responsibilities**:
  - Maintains the patron's saved garment IDs (`wishlistIds: string[]`).
  - Provides `toggleWishlist(productId)` and `isInWishlist(productId)`.
  - Persists saved items across browser sessions.

### `ToastContext`
- **Location**: [`src/context/ToastContext.tsx`](file:///Users/jarvis/MySites/vastramay-3d/src/context/ToastContext.tsx)
- **Responsibilities**:
  - Centralized notification dispatcher across storefront and admin views.
  - Supports notification types: `'success'`, `'error'`, `'info'`, `'gold'`.
  - Automatically manages timeout dismissals (4,000ms) with manual close actions.

---

## 2. Persistence Engine: `VersionedLocalStorageAdapter`

To achieve an authentic full-stack experience without requiring a live database connection during development, Vastramay features a custom, enterprise-grade `VersionedLocalStorageAdapter`.

- **File**: [`src/services/storageAdapter.ts`](file:///Users/jarvis/MySites/vastramay-3d/src/services/storageAdapter.ts)
- **Schema Version**: `2` (`CURRENT_SCHEMA_VERSION = 2`)

### Schema Envelope Specification
Every item written to browser storage is wrapped in a versioned envelope:

```typescript
interface StorageEnvelope<T> {
  schemaVersion: number;   // Currently 2
  timestamp: string;       // ISO 8601 creation/mutation timestamp
  data: T;                 // The typed payload
}
```

### Key Capabilities & Safeguards

#### 1. Automated Schema Migrations
When reading data written by an earlier version of the application (e.g. unversioned JSON or schema v1), the adapter automatically detects the legacy structure, wraps it in the v2 envelope, and persists the upgraded format without data loss.

#### 2. Corrupted JSON Recovery
If stored data is malformed (e.g., from manual browser edits or interrupted writes), `JSON.parse()` syntax errors are caught, logged with warning diagnostics, and the storage key is reset to the initial seed fallback. The application never crashes due to corrupted storage.

#### 3. In-Memory Fallback
If the user's browser blocks `localStorage` (e.g., Safari Private Browsing mode with strict storage blocking, or exceeded 5MB quota), the adapter automatically redirects writes and reads to an internal in-memory Map structure, maintaining continuous application functionality.

#### 4. Credential Security Guard
The storage adapter actively inspects keys being persisted. Any attempt to write sensitive credentials (such as plain text passwords or raw private keys) is intercepted and blocked with a security alert.

---

## 3. Storage Keys Registry

The application partitions data into clearly namespaced storage keys:

| Storage Key | Data Model | Description | Default Fallback |
| :--- | :--- | :--- | :--- |
| `products` | `Product[]` | Complete garment catalog with variant stock | `MOCK_PRODUCTS` (36 garments) |
| `categories` | `Category[]` | Category and subcategory hierarchy | `MOCK_CATEGORIES` |
| `orders` | `Order[]` | Placed customer orders and tracking records | `INITIAL_ORDERS` |
| `inventory_movements` | `InventoryMovement[]` | Immutable audit log of stock movements | `INITIAL_MOVEMENTS` |
| `promotions` | `CouponRule[]` | Privilege coupon rules and usage counters | `INITIAL_COUPONS` |
| `reviews` | `ProductReview[]` | Customer reviews and moderation statuses | `INITIAL_REVIEWS` |
| `store_settings` | `StoreSettings` | Shipping thresholds and announcement copy | Default settings object |
| `cart` | `CartItem[]` | User's active shopping bag | `[]` |
| `wishlist` | `string[]` | Saved product IDs | `[]` |
| `addresses` | `Address[]` | Saved delivery addresses | Default user addresses |

---

## 4. Resetting to Factory Demo State

To restore the application to its pristine seed data state:
1. Navigate to the Admin Settings panel: `/admin/settings`.
2. Click **Reset All Demo Data to Factory State**.
3. All custom modifications will be cleared, and storage will be re-seeded with pristine catalog records.
