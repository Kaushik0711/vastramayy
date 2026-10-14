# Vastramay Backend Migration Plan & Cloud Readiness Blueprint

This technical blueprint outlines the exact engineering pathway for connecting the **Vastramay** client application to a production cloud backend (such as Supabase, PostgreSQL, NestJS/Node.js, or Go microservices) **without redesigning or modifying page components**.

---

## 1. Zero-Component-Rewrite Architectural Contract

The UI layer communicates exclusively through abstract repository interfaces defined in [`src/types/repositories.ts`](file:///Users/jarvis/MySites/vastramay-3d/src/types/repositories.ts). When switching to a real backend, only the repository implementations need to be swapped:

```
Present Architecture:
  Page Component ──► Service / Repository ──► VersionedLocalStorageAdapter ──► Browser LocalStorage

Production Cloud Architecture:
  Page Component ──► Service / Repository ──► Supabase / REST Client ──► PostgreSQL / Redis / S3
```

---

## 2. Database Schema (PostgreSQL DDL)

Below is the production relational schema ready for deployment in PostgreSQL or Supabase:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES & TAXONOMY
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('men', 'women', 'unisex')),
    parent_id UUID REFERENCES categories(id) ON DELETE RESTRICT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    tagline VARCHAR(255),
    description TEXT,
    image_url TEXT NOT NULL,
    hero_banner_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCTS (GARMENTS)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    tagline VARCHAR(255),
    description TEXT,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('men', 'women', 'unisex')),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    subcategory_slug VARCHAR(100),
    base_price_paise BIGINT NOT NULL, -- Integer paise (₹8499 = 849900 paise)
    original_price_paise BIGINT,
    discount_percentage INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_new_arrival BOOLEAN DEFAULT FALSE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    is_custom_tailorable BOOLEAN DEFAULT TRUE,
    tags TEXT[] DEFAULT '{}',
    specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
    images JSONB NOT NULL, -- { "primary": "...", "gallery": [...], "thumbnail": "..." }
    rating_average NUMERIC(3, 2) DEFAULT 5.00,
    review_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCT VARIANTS (SKUs)
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL,
    size VARCHAR(50) NOT NULL,
    color_name VARCHAR(100) NOT NULL,
    color_hex VARCHAR(20) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    price_paise BIGINT NOT NULL,
    original_price_paise BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CUSTOMERS & PROFILES
CREATE TABLE customers (
    id UUID PRIMARY KEY REFERENCES auth.users(id), -- Linked to Supabase Auth or OAuth2
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(30),
    avatar_url TEXT,
    measurements JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE customer_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    street_line1 TEXT NOT NULL,
    street_line2 TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    country VARCHAR(50) DEFAULT 'India',
    is_default_shipping BOOLEAN DEFAULT FALSE,
    is_default_billing BOOLEAN DEFAULT FALSE,
    address_type VARCHAR(20) DEFAULT 'home' CHECK (address_type IN ('home', 'office', 'other'))
);

-- 5. ORDERS & IMMUTABLE LINE ITEMS
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    shipping_address JSONB NOT NULL,
    billing_address JSONB NOT NULL,
    subtotal_paise BIGINT NOT NULL,
    discount_paise BIGINT DEFAULT 0,
    shipping_fee_paise BIGINT DEFAULT 0,
    total_paise BIGINT NOT NULL,
    payment_status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method VARCHAR(30) NOT NULL CHECK (payment_method IN ('upi', 'card', 'netbanking', 'cod')),
    payment_gateway_order_id VARCHAR(100),
    payment_gateway_payment_id VARCHAR(100),
    order_status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')),
    carrier VARCHAR(100),
    tracking_number VARCHAR(100),
    idempotency_key VARCHAR(100) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL,
    variant_id UUID NOT NULL,
    sku VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    size VARCHAR(50) NOT NULL,
    color_name VARCHAR(100) NOT NULL,
    color_hex VARCHAR(20) NOT NULL,
    unit_price_paise BIGINT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    image_url TEXT NOT NULL
);

-- 6. INVENTORY MOVEMENTS (IMMUTABLE AUDIT LOG)
CREATE TABLE inventory_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    variant_id UUID NOT NULL,
    sku VARCHAR(100) NOT NULL,
    previous_stock INT NOT NULL,
    delta INT NOT NULL,
    new_stock INT NOT NULL,
    reason VARCHAR(100) NOT NULL,
    notes TEXT,
    adjusted_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PROMOTIONS & PRIVILEGES
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value INT NOT NULL,
    min_order_amount_paise BIGINT DEFAULT 0,
    max_discount_amount_paise BIGINT,
    is_active BOOLEAN DEFAULT TRUE,
    valid_until TIMESTAMPTZ NOT NULL,
    usage_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CUSTOMER REVIEWS
CREATE TABLE product_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_city VARCHAR(100),
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(255),
    comment TEXT NOT NULL,
    garment_size_worn VARCHAR(50),
    is_verified_buyer BOOLEAN DEFAULT TRUE,
    status VARCHAR(20) DEFAULT 'approved' CHECK (status IN ('approved', 'hidden', 'flagged')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 3. Server-Side Price & Inventory Consistency

### 3.1. Authoritative Server Financials Calculation
The client must **never** send total order amounts or discounts to the backend. Instead:
1. Client sends:
   ```json
   {
     "items": [{ "variantId": "uuid", "quantity": 1 }],
     "couponCode": "ROYAL10",
     "shippingMethod": "express"
   }
   ```
2. The server queries `product_variants` directly, fetches real `price_paise`, validates the coupon against `coupons` table in a single transaction, calculates shipping surcharge based on threshold ($₹3,000$), and writes the verified `total_paise` to `orders`.

### 3.2. Concurrency Control with Row-Level Locks
To prevent overselling during flash festive sales, the backend executes an atomic stock reservation using PostgreSQL row-level locks:
```sql
BEGIN;
  -- Lock variants for update to prevent race conditions
  SELECT id, stock_quantity 
  FROM product_variants 
  WHERE id = $variant_id 
  FOR UPDATE;

  -- Ensure stock is sufficient
  UPDATE product_variants 
  SET stock_quantity = stock_quantity - $quantity 
  WHERE id = $variant_id AND stock_quantity >= $quantity;

  -- Log movement audit
  INSERT INTO inventory_movements (product_id, variant_id, sku, previous_stock, delta, new_stock, reason, adjusted_by)
  VALUES (...);

COMMIT;
```

---

## 4. Idempotency & Duplicate-Submission Guard

1. The frontend checkout generates a unique `Idempotency-Key` UUID v4 header per checkout attempt:
   ```ts
   const idempotencyKey = crypto.randomUUID();
   fetch('/api/v1/orders', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Idempotency-Key': idempotencyKey,
     },
     body: JSON.stringify(checkoutPayload),
   });
   ```
2. The server stores the `idempotency_key` in a Redis cache (TTL 24 hours) or the `orders` table. If a duplicate request with the same key arrives while in-flight or completed, the server immediately returns the existing order record without double-charging the customer.

---

## 5. Payment Provider Integration (Razorpay / Cashfree)

### 5.1. Payment Initiation Flow
1. **Server generates order**:
   ```ts
   const razorpayOrder = await razorpay.orders.create({
     amount: order.totalPaise,
     currency: 'INR',
     receipt: order.orderNumber,
   });
   ```
2. **Client loads Razorpay Checkout modal** passing `razorpayOrder.id`.

### 5.2. Webhook Signature Verification
The backend registers a webhook endpoint (`POST /api/webhooks/razorpay`):
```ts
const expectedSignature = crypto
  .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
  .update(JSON.stringify(req.body))
  .digest('hex');

if (req.headers['x-razorpay-signature'] !== expectedSignature) {
  return res.status(400).send('Invalid webhook signature');
}

if (req.body.event === 'order.paid') {
  await orderService.markOrderAsPaid(req.body.payload.order.entity.receipt);
}
```

---

## 6. Image & Asset Storage Pipeline

1. **Storage Provider**: Amazon S3 bucket with Cloudflare Images / Fastly CDN.
2. **Administrative Upload**:
   - Admin panel calls `/api/v1/uploads/presigned-url` with `{ fileName, fileType }`.
   - Backend issues temporary presigned S3 PUT URL (TTL 5 minutes).
   - Admin UI uploads image directly from browser to S3, bypassing application servers.
3. **Responsive Image Transformations**:
   - Cloudflare CDN generates automatic WebP and AVIF formats with responsive width parameters (`?width=400`, `?width=1000`, `?width=1600`).

---

## 7. Authentication & Row-Level Security (RLS)

### 7.1. Role-Based Access Control (RBAC)
- **`anon`**: Read published products, categories, active promotions, approved reviews.
- **`customer`**: Read/write own profile, addresses, orders, and submitted reviews.
- **`atelier_staff`**: Read orders, update fulfillment statuses, adjust stock with audit reasons.
- **`admin`**: Full CRUD across catalog, categories, promotions, and settings.

### 7.2. Supabase RLS Example
```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Customers can only read their own orders
CREATE POLICY "Customers view own orders" ON orders
    FOR SELECT USING (auth.uid() = customer_id);

-- Admins can view and update all orders
CREATE POLICY "Admins full order access" ON orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.role IN ('admin', 'superuser')
        )
    );
```
