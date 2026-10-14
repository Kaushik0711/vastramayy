/**
 * Phase 11 — Responsive, Accessibility, and Performance Automated Audit Suite
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MOCK_PRODUCTS } from '../src/data/products';
import { MOCK_CATEGORIES } from '../src/data/categories';
import { promotionService } from '../src/services/promotionService';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function runAudit() {
  console.log('🏛️  Starting Vastramay Phase 11 Audit Verification Suite...\n');

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

  // GROUP 1: PERFORMANCE & BUNDLE BUDGET AUDIT
  console.log('\n--- Group 1: Bundle Splitting & Performance Budget ---');
  const distAssetsDir = path.join(rootDir, 'dist', 'assets');
  if (fs.existsSync(distAssetsDir)) {
    const files = fs.readdirSync(distAssetsDir);
    const jsFiles = files.filter((f) => f.endsWith('.js'));
    assert(jsFiles.length > 5, `Bundle is code-split into distinct chunks (found ${jsFiles.length} JS chunks)`);

    let anyOversized = false;
    let maxChunkSizeKB = 0;
    let maxChunkName = '';

    for (const file of jsFiles) {
      const stats = fs.statSync(path.join(distAssetsDir, file));
      const sizeKB = Math.round(stats.size / 1024);
      if (sizeKB > maxChunkSizeKB) {
        maxChunkSizeKB = sizeKB;
        maxChunkName = file;
      }
      if (sizeKB > 550) {
        anyOversized = true;
      }
    }

    assert(
      !anyOversized,
      `No JS chunk exceeds 550 kB threshold (Largest chunk: ${maxChunkName} at ${maxChunkSizeKB} kB)`
    );

    const hasVendorReact = files.some((f) => f.includes('vendor-react'));
    const hasVendorMotion = files.some((f) => f.includes('vendor-motion'));
    assert(hasVendorReact, 'Dedicated vendor-react chunk created');
    assert(hasVendorMotion, 'Dedicated vendor-motion chunk created');
  } else {
    console.log('  ⚠️  dist/ directory not built yet. Run build first to test asset size.');
  }

  // GROUP 2: CRITICAL IMAGE DELIVERY & LAZY-LOADING AUDIT
  console.log('\n--- Group 2: Image Delivery & Loading Strategies ---');
  const heroBannerSrc = fs.readFileSync(
    path.join(rootDir, 'src', 'components', 'storefront', 'HeroBanner.tsx'),
    'utf-8'
  );
  assert(
    heroBannerSrc.includes('loading="eager"') && heroBannerSrc.includes('decoding="sync"'),
    'Above-the-fold hero image loads eagerly with sync decoding for optimal LCP'
  );

  const productCardSrc = fs.readFileSync(
    path.join(rootDir, 'src', 'components', 'storefront', 'ProductCard.tsx'),
    'utf-8'
  );
  assert(
    productCardSrc.includes('loading="lazy"'),
    'Catalog product card thumbnails are lazily loaded to preserve mobile bandwidth'
  );

  // GROUP 3: ACCESSIBILITY (A11Y) AUDIT
  console.log('\n--- Group 3: Accessibility & Semantic Markup ---');
  const inputComponentSrc = fs.readFileSync(
    path.join(rootDir, 'src', 'components', 'common', 'Input.tsx'),
    'utf-8'
  );
  assert(
    inputComponentSrc.includes('aria-invalid') && inputComponentSrc.includes('aria-describedby'),
    'Form Input component binds aria-invalid and aria-describedby for assistive tech'
  );
  assert(
    inputComponentSrc.includes('role="alert"'),
    'Error messages carry role="alert" for immediate screen reader announcements'
  );

  assert(
    productCardSrc.includes('aria-label=') && productCardSrc.includes('wishlist'),
    'Interactive icon buttons (e.g., Wishlist) have descriptive dynamic accessible names'
  );

  const cartDrawerSrc = fs.readFileSync(
    path.join(rootDir, 'src', 'components', 'common', 'CartDrawer.tsx'),
    'utf-8'
  );
  assert(
    cartDrawerSrc.includes('Decrease quantity of') &&
      cartDrawerSrc.includes('Increase quantity of'),
    'Cart quantity increment/decrement controls have explicit accessible labels with product names'
  );

  // GROUP 4: MOBILE USABILITY & TOUCH TARGETS AUDIT
  console.log('\n--- Group 4: Mobile Shopping Usability & Touch Targets ---');
  assert(
    productCardSrc.includes('md:hidden') && productCardSrc.includes('Quick Add'),
    'Product cards feature a mobile-specific touch quick-add button (no hover trap)'
  );

  assert(
    cartDrawerSrc.includes('w-8 h-8') || cartDrawerSrc.includes('min-w-[32px]'),
    'Cart touch controls meet minimum ergonomic touch dimensions (>=32px)'
  );

  assert(
    cartDrawerSrc.includes('safe-area-pb'),
    'Cart Drawer action footer accounts for modern mobile safe areas'
  );

  const checkoutSrc = fs.readFileSync(
    path.join(rootDir, 'src', 'pages', 'storefront', 'CheckoutPage.tsx'),
    'utf-8'
  );
  assert(
    checkoutSrc.includes('inputMode="email"') &&
      checkoutSrc.includes('inputMode="tel"') &&
      checkoutSrc.includes('inputMode="numeric"'),
    'Checkout fields provide mobile keyboard hints (email, tel, numeric keypad)'
  );
  assert(
    checkoutSrc.includes('autoComplete="postal-code"') &&
      checkoutSrc.includes('autoComplete="address-line1"'),
    'Checkout address inputs support autofill attributes for mobile checkout speed'
  );

  // GROUP 5: ADMIN RESPONSIVE ALTERNATIVES AUDIT
  console.log('\n--- Group 5: Admin Mobile Alternative Layouts ---');
  const adminOrdersSrc = fs.readFileSync(
    path.join(rootDir, 'src', 'pages', 'admin', 'AdminOrdersPage.tsx'),
    'utf-8'
  );
  assert(
    adminOrdersSrc.includes('hidden md:block') && adminOrdersSrc.includes('md:hidden'),
    'Admin Orders page provides both a desktop table and a responsive mobile card stack'
  );

  const adminProductsSrc = fs.readFileSync(
    path.join(rootDir, 'src', 'pages', 'admin', 'AdminProductsPage.tsx'),
    'utf-8'
  );
  assert(
    adminProductsSrc.includes('hidden md:block') && adminProductsSrc.includes('md:hidden'),
    'Admin Products page provides responsive mobile cards for on-the-go catalog management'
  );

  const adminInventorySrc = fs.readFileSync(
    path.join(rootDir, 'src', 'pages', 'admin', 'AdminInventoryPage.tsx'),
    'utf-8'
  );
  assert(
    adminInventorySrc.includes('hidden md:block') && adminInventorySrc.includes('md:hidden'),
    'Admin Inventory page provides mobile-optimized stock adjustment cards'
  );

  // GROUP 6: CATALOG INTEGRITY & BUSINESS LOGIC MATH AUDIT
  console.log('\n--- Group 6: Catalog Integrity & Business Calculation Math ---');
  assert(MOCK_PRODUCTS.length >= 30, 'Full mock catalog of 30+ luxury pieces verified');
  const allValidPrices = MOCK_PRODUCTS.every((p) => p.price > 0 && typeof p.price === 'number');
  assert(allValidPrices, 'All product prices are positive numbers in INR');

  // Verify Async Coupon Calculation
  const testSubtotal = 10000;
  const festiveCoupon = await promotionService.validateCoupon('FESTIVE15', testSubtotal);
  assert(
    festiveCoupon.valid && festiveCoupon.discountAmount === 1500,
    'FESTIVE15 applies accurate 15% discount calculation (₹1,500 on ₹10,000)'
  );

  const royalCoupon = await promotionService.validateCoupon('ROYAL10', 5000);
  assert(
    royalCoupon.valid && royalCoupon.discountAmount === 500,
    'ROYAL10 applies accurate 10% discount calculation (₹500 on ₹5,000)'
  );

  console.log('\n======================================================');
  console.log(`Audit Summary: ${passed} Passed, ${failed} Failed`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAudit().catch((err) => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});
