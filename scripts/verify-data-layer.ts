/**
 * Vastramay Data Layer & Resilience Verification Suite
 */

import { VersionedLocalStorageAdapter, CURRENT_SCHEMA_VERSION } from '../src/services/storageAdapter';
import { MOCK_PRODUCTS } from '../src/data/products';
import { MOCK_CATEGORIES } from '../src/data/categories';
import { productService } from '../src/services/productService';
import { promotionService } from '../src/services/promotionService';
import { inventoryService } from '../src/services/inventoryService';

// Mock browser window and localStorage for node environment
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

async function runTests() {
  console.log('🧪 Starting Vastramay Data Layer Verification Suite...\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // TEST 1: Centralized Mock Data Scale & Consistency
  console.log('--- Test Group 1: Seed Catalog Scale & Data Integrity ---');
  assert(MOCK_PRODUCTS.length >= 30, `Catalog contains at least 30 products (actual: ${MOCK_PRODUCTS.length})`);
  
  const menCount = MOCK_PRODUCTS.filter((p) => p.gender === 'men').length;
  const womenCount = MOCK_PRODUCTS.filter((p) => p.gender === 'women').length;
  assert(menCount >= 15 && womenCount >= 15, `Balanced departments: Men (${menCount}), Women (${womenCount})`);

  const uniqueIds = new Set(MOCK_PRODUCTS.map((p) => p.id));
  assert(uniqueIds.size === MOCK_PRODUCTS.length, 'All product IDs are unique and stable');

  const allHaveVariants = MOCK_PRODUCTS.every((p) => p.variants && p.variants.length > 0);
  assert(allHaveVariants, 'All products contain defined variant matrices');

  const allHaveGalleries = MOCK_PRODUCTS.every(
    (p) => p.images && p.images.primary && Array.isArray(p.images.gallery) && p.images.thumbnail
  );
  assert(allHaveGalleries, 'All products contain multi-angle image galleries');

  const validPricing = MOCK_PRODUCTS.every((p) => p.price > 0 && Number.isInteger(p.price));
  assert(validPricing, 'All products use valid integer Indian Rupee pricing');

  // TEST 2: Storage Resilience & Fault Tolerance
  console.log('\n--- Test Group 2: Storage Resilience & Envelope Schema ---');
  const testStorage = new VersionedLocalStorageAdapter('test_resilience_', 0);

  // 2a. Missing Data Fallback
  const missing = await testStorage.getItem('non_existent_key', { fallback: true });
  assert(missing.fallback === true, 'Missing key safely returns default fallback');

  // 2b. Corrupted JSON Recovery
  (global as any).window.localStorage.setItem('test_resilience_corrupted_key', '{ bad: json; not_valid... ');
  const recovered = await testStorage.getItem('corrupted_key', { recovered: true });
  assert(recovered.recovered === true, 'Corrupted JSON gracefully caught and fallback returned without throwing');

  // 2c. Schema Versioning & Envelope
  await testStorage.setItem('sample_item', { name: 'Imperial Kurta' });
  const rawEnvelopeStr = (global as any).window.localStorage.getItem('test_resilience_sample_item');
  const parsedEnvelope = JSON.parse(rawEnvelopeStr);
  assert(
    parsedEnvelope.schemaVersion === CURRENT_SCHEMA_VERSION && parsedEnvelope.data.name === 'Imperial Kurta',
    `Data is wrapped in schema version ${CURRENT_SCHEMA_VERSION} envelope`
  );

  // 2d. Legacy / Unversioned Payload Automatic Upgrade
  (global as any).window.localStorage.setItem('test_resilience_legacy_v1', JSON.stringify({ legacyField: 42 }));
  const upgraded = await testStorage.getItem<{ legacyField: number }>('legacy_v1', { legacyField: 0 });
  assert(upgraded.legacyField === 42, 'Unversioned legacy JSON seamlessly read and auto-migrated');

  // 2e. Sensitive Key Blacklist
  await testStorage.setItem('password', 'secret_plain_text');
  const blockedKey = (global as any).window.localStorage.getItem('test_resilience_password');
  assert(blockedKey === null, 'Security Guard successfully blocked persistence of sensitive "password" key');

  // TEST 3: Repository & Service Operations
  console.log('\n--- Test Group 3: Repository Contracts & Service Logic ---');
  const allProds = await productService.getAllProducts();
  assert(allProds.length >= 30, 'productService.getAllProducts returns complete seed catalog');

  const filteredMenKurtas = await productService.filterProducts({ gender: 'men', categorySlug: 'kurtas' });
  assert(filteredMenKurtas.length > 0 && filteredMenKurtas.every((p) => p.gender === 'men' && p.categorySlug === 'kurtas'),
    'productService.filterProducts successfully filters by department and category');

  const facets = await productService.getFacets(allProds);
  assert(facets.categories.length > 0 && facets.sizes.length > 0 && facets.colors.length > 0,
    'productService.computeFacets calculates dynamic facet counts');

  // Coupon Validation Engine
  const validCouponRes = await promotionService.validateCoupon('ROYAL10', 5000);
  assert(validCouponRes.valid === true && validCouponRes.discountAmount === 500,
    'promotionService validates ROYAL10 (10% discount on ₹5,000 = ₹500)');

  const minOrderFail = await promotionService.validateCoupon('FESTIVE15', 2000);
  assert(minOrderFail.valid === false,
    'promotionService correctly rejects FESTIVE15 when subtotal is below minimum order threshold');

  // Inventory Adjustment Workflow
  const sampleProd = allProds[0];
  const sampleVariant = sampleProd.variants[0];
  const initialStock = sampleVariant.stockQuantity;

  const adjustResult = await inventoryService.adjustVariantStock({
    productId: sampleProd.id,
    variantId: sampleVariant.id,
    newStock: initialStock + 5,
    reason: 'restock',
    notes: 'Inbound seasonal restocking batch #882',
    adjustedBy: 'Admin Test Runner',
  });
  assert(adjustResult.product.totalStock > 0, 'inventoryService adjusts variant stock');

  const movements = await inventoryService.getMovements();
  assert(movements.length > 0 && movements[0].notes === 'Inbound seasonal restocking batch #882',
    'inventoryService creates immutable audit movement record with mandatory reason');

  let negativeBlocked = false;
  try {
    await inventoryService.adjustVariantStock({
      productId: sampleProd.id,
      variantId: sampleVariant.id,
      newStock: -10,
      reason: 'damage',
    });
  } catch {
    negativeBlocked = true;
  }
  assert(negativeBlocked, 'inventoryService strictly prevents negative inventory adjustments');

  console.log(`\n==============================================`);
  console.log(`Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
  console.log(`==============================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
