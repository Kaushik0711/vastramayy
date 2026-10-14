# Vastramay Data Layer & Repository Architecture

## 1. Architectural Principles

The Vastramay application data layer is structured to ensure that the current rich client-side demo can seamlessly transition to an enterprise cloud backend (Supabase, PostgreSQL, or REST/GraphQL microservices) **without requiring structural rewrites of storefront pages or admin management components**.

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│     Storefront Pages, Product Catalog, Admin Modules        │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                Repository Contracts Layer                   │
│  IProductRepository, ICategoryRepository, IOrderRepository  │
│  IInventoryRepository, IPromotionRepository, etc.           │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
       [Active Demo Mode]              [Future Backend Mode]
               │                               │
               ▼                               ▼
┌──────────────────────────────┐┌──────────────────────────────┐
│  Versioned Storage Engine    ││  Cloud / API Repositories    │
│  - Envelope Wrapping (v2)    ││  - Supabase / PostgreSQL     │
│  - Schema Migration Hook     ││  - Server-Side RBAC          │
│  - Corrupted JSON Recovery   ││  - Transactional Inventory   │
│  - In-Memory Quota Fallback  ││  - Webhook Payment Listeners │
│  - Credential Blacklist      ││  - Media CDN (S3/Cloudflare) │
└──────────────────────────────┘└──────────────────────────────┘
```

---

## 2. Core Entity Data Models

All core data structures reside in `src/types/` and are strictly typed:

### 2.1. Catalog Models (`src/types/product.ts`)
- **`Product`**:
  - `id`: Stable string identifier (`prod-001` through `prod-036`).
  - `name`, `slug`, `tagline`, `description`.
  - `gender`: `'men' | 'women' | 'unisex'`.
  - `categorySlug`, `subcategorySlug`.
  - `price`: Integer Indian Rupees (e.g., `8499` for ₹8,499).
  - `originalPrice`, `discountPercentage`.
  - `featured`, `isNewArrival`, `isBestseller`, `isCustomTailorable`.
  - `tags`: String array for discovery facetting.
  - `specifications`: Fabric, weave, lining, embroideryType, fit, careInstructions, occasion.
  - `variants`: Array of `ProductVariant`.
  - `images`: `{ primary: string; gallery: string[]; thumbnail: string; }`.
  - `totalStock`: Sum of all variant inventory.
  - `ratingAverage`: Float (e.g. `4.9`).
  - `reviewCount`: Integer.
- **`ProductVariant`**:
  - `id`: Unique variant ID (`v-001-38-emerald`).
  - `sku`: Standardized inventory SKU (`VM-KUR-001-EM-38`).
  - `size`: Standardized Indian size notation (`38 (S)`, `40 (M)`, `Free Size (6.3m)`).
  - `colorName`, `colorHex`: Visual swatch pairing (`Emerald Green`, `#0A4D38`).
  - `stockQuantity`: Integer stock level.
  - `price`, `originalPrice`.
- **`Category` & `Subcategory`**:
  - Normalized records with `id`, `name`, `slug`, `gender`, `parentId`, `displayOrder`, `isActive`, `heroBannerImage`, and `subcategories`.

### 2.2. Transaction & Order Snapshot Models (`src/types/order.ts`)
- **`OrderItem`**:
  - **Immutable snapshot**: Deep-cloned copy of product details at time of purchase (`productId`, `variantId`, `sku`, `name`, `size`, `colorName`, `colorHex`, `price`, `quantity`, `image`).
  - Guaranteed isolated from future catalog price alterations.
- **`Order`**:
  - `id`, `orderNumber` (`VAST-2026-XXXX`).
  - `customerName`, `customerEmail`, `customerPhone`.
  - `shippingAddress`, `billingAddress`.
  - `items`: `OrderItem[]`.
  - `subtotal`, `discount`, `shippingFee`, `total`.
  - `paymentStatus`: `'paid' | 'pending' | 'failed' | 'refunded'`.
  - `paymentMethod`: `'upi' | 'card' | 'netbanking' | 'cod'`.
  - `orderStatus`: `'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned'`.
  - `carrier`, `trackingNumber`, `estimatedDelivery`.

### 2.3. Customer Profiles & Addresses (`src/types/customer.ts`)
- **`CustomerProfile`**:
  - `id`, `firstName`, `lastName`, `email`, `phone`, `avatarUrl`.
  - `addresses`: `Address[]` (with default flags).
  - `measurements`: Chest, waist, hip, shoulder, kurtaLength, sleeveLength (inches) with Vastramay 2-inch alteration allowance.
  - `totalOrdersCount`, `totalSpent`.

---

## 3. Repository Pattern Contracts

Defined in `src/types/repositories.ts`:

| Repository Interface | Service Implementation | Responsibilities |
| :--- | :--- | :--- |
| **`IProductRepository`** | `src/services/productService.ts` | Catalog queries, multi-attribute filter engine, dynamic facet calculation, full-text search, product CRUD, and duplication. |
| **`ICategoryRepository`** | `src/services/categoryService.ts` | Category hierarchy, active status toggles, display ordering, and deletion safety checks (blocking deletion if garments are assigned). |
| **`IOrderRepository`** | `src/services/orderService.ts` | Order creation, deep-cloning snapshots, order status progression pipeline, return request triage, and cancellation validation. |
| **`IInventoryRepository`** | `src/services/inventoryService.ts` | Variant-level stock adjustments, mandatory operational reason tracking, non-negative stock guards, and movement ledger. |
| **`IPromotionRepository`** | `src/services/promotionService.ts` | Promotional coupon codes, discount type rules (percentage vs fixed), minimum spend validation, and usage counts. |
| **`ICustomerRepository`** | `src/services/customerService.ts` | Active customer profile, bespoke measurements, saved addresses CRUD, and patron directory for admin. |
| **`IReviewRepository`** | `src/services/reviewService.ts` | Customer reviews, star ratings, and moderation workflow (approve, hide, delete). |
| **`ISettingsRepository`** | `src/services/settingsService.ts` | Store operational settings, free shipping thresholds, COD caps, announcement strip, and single-click factory demo reset. |

---

## 4. Versioned Storage Engine & Resilience Layer

The storage engine in `src/services/storageAdapter.ts` implements enterprise-grade resilience:

### 4.1. Envelope Schema Packaging
Every persistent record is automatically wrapped in a versioned envelope:
```json
{
  "schemaVersion": 2,
  "timestamp": "2026-10-14T15:30:00.000Z",
  "data": { ... }
}
```

### 4.2. Automatic Migration & Legacy Recovery
- When unversioned legacy JSON (from Phase 01 or raw arrays) is encountered, the adapter seamlessly extracts the data and upgrades it into a `schemaVersion: 2` envelope.
- When an older version is read (`schemaVersion < CURRENT_SCHEMA_VERSION`), migration logic executes automatically.

### 4.3. Corruption Detection & Recovery
- If invalid or truncated JSON is stored, `JSON.parse` errors are trapped.
- The adapter logs an informative diagnostic warning, cleans up the corrupted entry, and returns the configured default seed fallback without crashing the client application.

### 4.4. Storage Quota & Private Browsing Fallback
- In restricted private browsing environments or when `localStorage` throws `QuotaExceededError`, the adapter automatically falls back to an internal `Map<string, string>` in-memory storage store.
- Zero uncaught exceptions are thrown to the UI.

### 4.5. Sensitive Credential Blacklist
- The adapter strictly blocks attempts to persist sensitive keys (`password`, `admin_password`, `cvv`, `credit_card`, `bank_credentials`, `stripe_secret`, `auth_token_raw`).
- Passwords and auth tokens remain strictly in memory during simulated sessions.

---

## 5. Seed Catalog Specifications

The seed database is located in `src/data/`:
- **`src/data/products.ts`**: **36 distinct luxury garments**:
  - 18 Men's Garments (`prod-001` through `prod-018`): Sherwanis, Chanderi Kurtas, Chikankari Kurtas, Bundi Waistcoats, Jodhpuri Bandhgalas, Tussar Achkans, Linen Kurtas, Dhotis, Mojaris, Pashmina Stoles.
  - 18 Women's Garments (`prod-019` through `prod-036`): Bridal Velvet Lehengas, Kanjeevaram Tissue Sarees, Kalidar Anarkalis, Banarasi Katan Sarees, Peplum Shararas, Cape Sets, Corset Lehengas, Organza Sarees, Saree Gowns, Kundan Polki Jewellery.
- **`src/data/categories.ts`**: 8 Men's & 8 Women's categories with subcategories, hero banners, and display order.
- **`src/data/customers.ts`**: Default patron profile with addresses, measurements, and patron directory entries.
- **`src/data/orders.ts`**: Seed orders spanning various stages of fulfillment (`delivered`, `processing`, `shipped`, `pending`).
- **`src/data/promotions.ts`**: Seed coupons (`ROYAL10`, `FESTIVE15`, `ATELIER1000`).
- **`src/data/faqs.ts`**: Storefront FAQs covering alterations, shipping, and heritage handlooms.
