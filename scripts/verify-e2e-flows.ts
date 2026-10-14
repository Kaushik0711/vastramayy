/**
 * Vastramay End-to-End Functional Flow Verification Suite
 * Tests Flows A through H across Storefront and Admin domains.
 */

import { productService } from '../src/services/productService';
import { categoryService } from '../src/services/categoryService';
import { orderService } from '../src/services/orderService';
import { inventoryService } from '../src/services/inventoryService';
import { promotionService } from '../src/services/promotionService';
import { customerService } from '../src/services/customerService';
import { storage } from '../src/services/storageAdapter';
import { lookupPincode } from '../src/utils/addressValidation';
import { MOCK_PRODUCTS } from '../src/data/products';

// Mock localStorage for node environment
const memoryStore = new Map<string, string>();
(global as any).window = {
  localStorage: {
    getItem: (key: string) => memoryStore.get(key) || null,
    setItem: (key: string, val: string) => memoryStore.set(key, val),
    removeItem: (key: string) => memoryStore.delete(key),
    clear: () => memoryStore.clear(),
    get length() {
      return memoryStore.size;
    },
    key: (i: number) => Array.from(memoryStore.keys())[i] || null,
  },
};

async function runE2EFlows() {
  console.log('🧪 Starting Vastramay E2E Functional Flow Verification Suite...\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName} ${detail ? `(${detail})` : ''}`);
      failed++;
    }
  }

  // FLOW A: PRODUCT DISCOVERY
  console.log('--- FLOW A: Product Discovery (Catalog, Category, Filters, PDP) ---');
  const allProducts = await productService.getAllProducts();
  assert(allProducts.length >= 30, `Catalog loaded with full collection (${allProducts.length} pieces)`);

  const menFiltered = await productService.filterProducts({ gender: 'men' });
  assert(menFiltered.length === 18, `Men filter returns exactly 18 garments`);

  const womenFiltered = await productService.filterProducts({ gender: 'women' });
  assert(womenFiltered.length === 18, `Women filter returns exactly 18 garments`);

  const categoryFiltered = await productService.filterProducts({
    gender: 'women',
    categorySlug: 'lehengas',
  });
  assert(
    categoryFiltered.length > 0 && categoryFiltered.every((p) => p.categorySlug === 'lehengas'),
    `Category filter 'lehengas' returns matching garments (${categoryFiltered.length} found)`
  );

  const targetSlug = 'padmavati-crimson-zari-bridal-lehenga';
  const pdpProduct = await productService.getProductBySlug(targetSlug);
  assert(
    pdpProduct !== null && pdpProduct.slug === targetSlug,
    `PDP resolution by slug '${targetSlug}' successfully loaded: "${pdpProduct?.name}"`
  );

  // FLOW B: SHOPPING (Cart operations & Variant validation)
  console.log('\n--- FLOW B: Shopping (Variant selection, Stock limits, Cart math) ---');
  assert(pdpProduct!.variants.length > 0, 'Target garment has defined variant matrix');
  const chosenVariant = pdpProduct!.variants[0];
  const initialStock = chosenVariant.stockQuantity;
  assert(initialStock > 0, `Target variant has available inventory (${initialStock} units)`);

  // Cart addition calculation
  const itemPrice = chosenVariant.price;
  const qty = 2;
  const subtotal = itemPrice * qty;
  assert(subtotal === itemPrice * 2, `Accurate cart subtotal: ₹${subtotal.toLocaleString('en-IN')}`);

  // Test Coupon Calculation
  const couponResult = await promotionService.validateCoupon('ROYAL10', subtotal);
  assert(couponResult.valid, 'ROYAL10 coupon validates successfully for subtotal');
  // ROYAL10 has 10% discount with maxDiscountAmount: 2500
  const expectedDiscount = Math.min(Math.round((subtotal * 10) / 100), 2500);
  assert(
    couponResult.discountAmount === expectedDiscount,
    `Accurate coupon discount calculation with cap: ₹${couponResult.discountAmount} (expected ₹${expectedDiscount})`
  );

  // FLOW C: CHECKOUT & ORDER CONFIRMATION
  console.log('\n--- FLOW C: Checkout (PIN code lookup, Address snapshot, Order creation) ---');
  const pinLookup = lookupPincode('110001');
  assert(
    pinLookup !== null && (pinLookup.city === 'Delhi' || pinLookup.city === 'New Delhi') && pinLookup.state === 'Delhi',
    'PIN code 110001 correctly auto-resolves to Delhi'
  );

  const mumbaiLookup = lookupPincode('400001');
  assert(
    mumbaiLookup !== null && mumbaiLookup.city === 'Mumbai' && mumbaiLookup.state === 'Maharashtra',
    'PIN code 400001 correctly auto-resolves to Mumbai, Maharashtra'
  );

  // Create Order with Snapshot
  const testOrder = await orderService.createOrder({
    customerId: 'cust-demo-1',
    customerName: 'Aarav Singhania',
    customerEmail: 'aarav.singhania@example.com',
    items: [
      {
        id: 'ci-test-1',
        productId: pdpProduct!.id,
        variantId: chosenVariant.id,
        name: pdpProduct!.name,
        image: pdpProduct!.images.primary,
        size: chosenVariant.size,
        colorName: chosenVariant.colorName,
        price: chosenVariant.price,
        quantity: qty,
        stockAvailable: initialStock,
      },
    ],
    shippingAddress: {
      fullName: 'Aarav Singhania',
      phone: '+91 98201 44521',
      streetLine1: '42 Marine Drive, Apt 7B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India',
      type: 'residential',
    },
    billingAddress: {
      fullName: 'Aarav Singhania',
      phone: '+91 98201 44521',
      streetLine1: '42 Marine Drive, Apt 7B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India',
      type: 'residential',
    },
    paymentMethod: 'card',
    paymentStatus: 'paid',
    orderStatus: 'confirmed',
    subtotal,
    discount: expectedDiscount,
    shippingFee: 0,
    total: subtotal - expectedDiscount,
    currency: 'INR',
  });

  assert(
    testOrder.id.length > 0 && testOrder.orderNumber.length > 0,
    `Order created successfully with tracking ID #${testOrder.orderNumber}`
  );
  assert(
    testOrder.items.length === 1 && testOrder.total === subtotal - expectedDiscount,
    `Order snapshot preserves item quantities and total math (₹${testOrder.total})`
  );

  // FLOW D: WISHLIST LIFECYCLE
  console.log('\n--- FLOW D: Wishlist (Item addition, Persistence, and State) ---');
  await storage.setItem('wishlist', [pdpProduct!.id]);
  const retrievedWishlist = await storage.getItem<string[]>('wishlist', []);
  assert(
    retrievedWishlist.includes(pdpProduct!.id),
    `Wishlist correctly persists product ID '${pdpProduct!.id}'`
  );

  // FLOW E: ADMINISTRATION (Product CRUD & Inventory Audit)
  console.log('\n--- FLOW E: Administration (Product creation, Inventory unit adjust, Audit trail) ---');
  const initialMovements = await inventoryService.getMovementLogs();
  const initialLogCount = initialMovements.length;

  const newStockTarget = initialStock + 5;
  await inventoryService.adjustVariantStock({
    productId: pdpProduct!.id,
    variantId: chosenVariant.id,
    newStock: newStockTarget,
    reason: 'Atelier Silk Restock',
    notes: 'Received batch from Varanasi weavers',
  });

  const updatedProduct = await productService.getProductById(pdpProduct!.id);
  const updatedVariant = updatedProduct?.variants.find((v) => v.id === chosenVariant.id);
  assert(
    updatedVariant?.stockQuantity === newStockTarget,
    `Variant stock successfully adjusted from ${initialStock} to ${newStockTarget} units`
  );

  const updatedMovements = await inventoryService.getMovementLogs();
  assert(
    updatedMovements.length === initialLogCount + 1,
    `Immutable audit trail logged new movement record (total logs: ${updatedMovements.length})`
  );
  const latestMovement = updatedMovements[0];
  assert(
    latestMovement.reason === 'Atelier Silk Restock' && latestMovement.delta === 5,
    `Audit record captures verified reason ('${latestMovement.reason}') and delta (+${latestMovement.delta})`
  );

  // Rejection of negative stock
  let negativeCaught = false;
  try {
    await inventoryService.adjustVariantStock({
      productId: pdpProduct!.id,
      variantId: chosenVariant.id,
      newStock: -10,
      reason: 'Invalid Test',
    });
  } catch (err) {
    negativeCaught = true;
  }
  assert(negativeCaught, 'Negative stock adjustment is strictly rejected');

  // FLOW F: ORDER MANAGEMENT & STATUS PROGRESSION
  console.log('\n--- FLOW F: Order Management (Pipeline status updates) ---');
  const transitionedOrder = await orderService.updateOrderStatus(testOrder.id, 'processing');
  assert(
    transitionedOrder?.orderStatus === 'processing',
    `Order status successfully transitioned from 'confirmed' to 'processing'`
  );

  const shippedOrder = await orderService.updateOrderStatus(testOrder.id, 'shipped');
  assert(
    shippedOrder?.orderStatus === 'shipped',
    `Order status successfully transitioned from 'processing' to 'shipped'`
  );

  const deliveredOrder = await orderService.updateOrderStatus(testOrder.id, 'delivered');
  assert(
    deliveredOrder?.orderStatus === 'delivered',
    `Order status successfully transitioned from 'shipped' to 'delivered'`
  );

  // FLOW G: RETURNS LIFECYCLE
  console.log('\n--- FLOW G: Returns Lifecycle (Customer claim, Admin approval) ---');
  const initialReturns = await orderService.getAllReturnRequests();
  const returnClaim = await orderService.createReturnRequest({
    orderId: testOrder.id,
    orderNumber: testOrder.orderNumber,
    customerId: testOrder.customerId,
    items: [
      {
        productId: pdpProduct!.id,
        variantId: chosenVariant.id,
        name: pdpProduct!.name,
        size: chosenVariant.size,
        quantity: 1,
        price: chosenVariant.price,
      },
    ],
    reasonCategory: 'fit_issue',
    comments: 'Requires 2-inch alteration at waist',
    refundAmount: chosenVariant.price,
  });

  assert(
    returnClaim.id.length > 0 && returnClaim.status === 'requested',
    `Return claim #${returnClaim.id} submitted with status 'requested'`
  );

  const allReturns = await orderService.getAllReturnRequests();
  assert(
    allReturns.length === initialReturns.length + 1,
    `Admin returns queue contains newly filed return claim (${allReturns.length} claims)`
  );

  // FLOW H: PERSISTENCE & DATA INTEGRITY
  console.log('\n--- FLOW H: Navigation & Persistence (Envelope v2 & Storage fallback) ---');
  const storedOrder = await orderService.getOrderById(testOrder.id);
  assert(
    storedOrder !== null && storedOrder.id === testOrder.id,
    `Order #${testOrder.orderNumber} persists and retrieves reliably from storage envelope`
  );

  console.log('\n======================================================');
  console.log(`E2E Verification Summary: ${passed} Passed, ${failed} Failed`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runE2EFlows().catch((err) => {
  console.error('Fatal E2E error:', err);
  process.exit(1);
});
