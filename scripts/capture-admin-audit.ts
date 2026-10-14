import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const SCREENSHOT_DIR = '/Users/jarvis/.gemini/antigravity-ide/brain/32b4f45f-cc74-4fad-baea-fd4ba0cbf0b9/qa_screenshots';

const adminRoutes = [
  { name: 'admin_dashboard_auth', path: '/admin/dashboard' },
  { name: 'admin_products_auth', path: '/admin/products' },
  { name: 'admin_inventory_auth', path: '/admin/inventory' },
  { name: 'admin_orders_auth', path: '/admin/orders' },
  { name: 'admin_returns_auth', path: '/admin/returns' },
];

const viewports = [
  { width: 1440, height: 900, suffix: '1440', mobile: false },
  { width: 390, height: 844, suffix: '390', mobile: true },
];

const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless',
  '--disable-gpu',
  '--remote-debugging-port=9224',
  '--window-size=1440,900',
  'http://localhost:3000/admin/login',
]);

async function run() {
  await new Promise((r) => setTimeout(r, 1500));
  const res = await fetch('http://127.0.0.1:9224/json');
  const tabs = await res.json();
  const pageTab = tabs.find((t: any) => t.type === 'page');

  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

  let msgId = 100;
  function sendCmd(method: string, params: any = {}): Promise<any> {
    return new Promise((resolve) => {
      const id = ++msgId;
      const handler = (evt: any) => {
        const data = JSON.parse(evt.data.toString());
        if (data.id === id) {
          ws.removeEventListener('message', handler);
          resolve(data.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  ws.onopen = async () => {
    console.log('Connected to Chrome DevTools Protocol for Admin QA...');

    // 1. Inject Admin Session into localStorage (Schema v2 format with correct prefix)
    await sendCmd('Runtime.evaluate', {
      expression: `(() => {
        const sessionPayload = {
          schemaVersion: 2,
          timestamp: new Date().toISOString(),
          data: {
            id: 'adm-001',
            name: 'Vikramaditya Roy',
            email: 'admin@vastramay.com',
            role: 'super_admin',
            avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
            lastLogin: new Date().toISOString()
          }
        };
        localStorage.setItem('vastramay_v2_admin_session', JSON.stringify(sessionPayload));
        return localStorage.getItem('vastramay_v2_admin_session');
      })()`,
      returnByValue: true,
    });
    console.log('✅ Admin session v2 injected into vastramay_v2_admin_session');

    // 2. Visit each admin route across both viewports and capture screenshot
    for (const vp of viewports) {
      await sendCmd('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.mobile,
      });

      for (const route of adminRoutes) {
        // Navigate
        await sendCmd('Page.navigate', { url: `http://localhost:3000${route.path}` });
        // Wait for rendering
        await new Promise((r) => setTimeout(r, 1200));

        // Capture screenshot
        const screenshotResult = await sendCmd('Page.captureScreenshot', { format: 'png' });
        if (screenshotResult?.data) {
          const buffer = Buffer.from(screenshotResult.data, 'base64');
          const filename = `${route.name}_${vp.suffix}.png`;
          const filePath = path.join(SCREENSHOT_DIR, filename);
          fs.writeFileSync(filePath, buffer);
          console.log(`📸 [${vp.width}x${vp.height}] ${route.path} -> ${filename} (${(buffer.length / 1024).toFixed(1)} kB)`);
        }
      }
    }

    console.log('\n🎉 Authenticated Admin inspection completed successfully!\n');
    ws.close();
    chrome.kill();
    process.exit(0);
  };
}

run().catch((err) => {
  console.error('Admin QA failed:', err);
  chrome.kill();
  process.exit(1);
});
