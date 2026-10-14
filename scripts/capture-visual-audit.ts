import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const SCREENSHOT_DIR = '/Users/jarvis/.gemini/antigravity-ide/brain/32b4f45f-cc74-4fad-baea-fd4ba0cbf0b9/qa_screenshots';
const CHROME_BIN = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = 'http://localhost:3000';

interface TargetRoute {
  name: string;
  path: string;
  viewports: { width: number; height: number; suffix: string }[];
}

const targets: TargetRoute[] = [
  {
    name: 'homepage',
    path: '/',
    viewports: [
      { width: 1440, height: 900, suffix: '1440' },
      { width: 768, height: 1024, suffix: '768' },
      { width: 390, height: 844, suffix: '390' },
      { width: 375, height: 667, suffix: '375' },
    ],
  },
  {
    name: 'men_landing',
    path: '/men',
    viewports: [
      { width: 1440, height: 900, suffix: '1440' },
      { width: 390, height: 844, suffix: '390' },
    ],
  },
  {
    name: 'women_landing',
    path: '/women',
    viewports: [
      { width: 1440, height: 900, suffix: '1440' },
      { width: 390, height: 844, suffix: '390' },
    ],
  },
  {
    name: 'shop_catalog',
    path: '/shop',
    viewports: [
      { width: 1440, height: 900, suffix: '1440' },
      { width: 390, height: 844, suffix: '390' },
    ],
  },
  {
    name: 'pdp_bridal_lehenga',
    path: '/product/padmavati-crimson-zari-bridal-lehenga',
    viewports: [
      { width: 1440, height: 900, suffix: '1440' },
      { width: 390, height: 844, suffix: '390' },
    ],
  },
  {
    name: 'wishlist',
    path: '/wishlist',
    viewports: [
      { width: 1440, height: 900, suffix: '1440' },
      { width: 390, height: 844, suffix: '390' },
    ],
  },
  {
    name: 'checkout',
    path: '/checkout',
    viewports: [
      { width: 1440, height: 900, suffix: '1440' },
      { width: 390, height: 844, suffix: '390' },
    ],
  },
  {
    name: 'admin_login',
    path: '/admin/login',
    viewports: [
      { width: 1440, height: 900, suffix: '1440' },
      { width: 390, height: 844, suffix: '390' },
    ],
  },
  {
    name: 'admin_dashboard',
    path: '/admin/dashboard',
    viewports: [
      { width: 1440, height: 900, suffix: '1440' },
      { width: 390, height: 844, suffix: '390' },
    ],
  },
  {
    name: 'admin_products',
    path: '/admin/products',
    viewports: [
      { width: 1440, height: 900, suffix: '1440' },
      { width: 390, height: 844, suffix: '390' },
    ],
  },
  {
    name: 'admin_inventory',
    path: '/admin/inventory',
    viewports: [
      { width: 1440, height: 900, suffix: '1440' },
      { width: 390, height: 844, suffix: '390' },
    ],
  },
  {
    name: 'admin_orders',
    path: '/admin/orders',
    viewports: [
      { width: 1440, height: 900, suffix: '1440' },
      { width: 390, height: 844, suffix: '390' },
    ],
  },
  {
    name: 'admin_returns',
    path: '/admin/returns',
    viewports: [
      { width: 1440, height: 900, suffix: '1440' },
      { width: 390, height: 844, suffix: '390' },
    ],
  },
];

console.log('🚀 Starting Automated Visual Inspection Suite via Headless Chrome...\n');

let totalScreenshots = 0;

for (const target of targets) {
  for (const vp of target.viewports) {
    const filename = `${target.name}_${vp.suffix}.png`;
    const outputPath = path.join(SCREENSHOT_DIR, filename);
    const targetUrl = `${BASE_URL}${target.path}`;

    const cmd = `"${CHROME_BIN}" --headless --disable-gpu --run-all-compositor-stages-before-draw --virtual-time-budget=2500 --screenshot="${outputPath}" --window-size=${vp.width},${vp.height} "${targetUrl}" 2>/dev/null`;

    try {
      execSync(cmd, { stdio: 'ignore' });
      const stats = fs.statSync(outputPath);
      console.log(`✅ [${vp.width}x${vp.height}] ${target.name} (${target.path}) -> ${filename} (${(stats.size / 1024).toFixed(1)} kB)`);
      totalScreenshots++;
    } catch (err) {
      console.error(`❌ Failed to capture ${target.name} at ${vp.width}x${vp.height}:`, err);
    }
  }
}

console.log(`\n🎉 Visual inspection completed: ${totalScreenshots} screenshots captured in ${SCREENSHOT_DIR}\n`);
