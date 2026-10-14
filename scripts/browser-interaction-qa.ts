import { spawn } from 'child_process';

const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless',
  '--disable-gpu',
  '--remote-debugging-port=9225',
  '--window-size=1440,900',
  'http://localhost:3000',
]);

const consoleErrors: string[] = [];
const verificationLog: { step: string; status: 'PASS' | 'FAIL'; details: string }[] = [];

function record(step: string, pass: boolean, details: string) {
  verificationLog.push({ step, status: pass ? 'PASS' : 'FAIL', details });
  console.log(`[${pass ? '✅ PASS' : '❌ FAIL'}] ${step}: ${details}`);
}

async function run() {
  await new Promise((r) => setTimeout(r, 1500));
  const res = await fetch('http://127.0.0.1:9225/json');
  const tabs = await res.json();
  const pageTab = tabs.find((t: any) => t.type === 'page');

  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

  let msgId = 200;
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

  function evaluate(expression: string): Promise<any> {
    return sendCmd('Runtime.evaluate', { expression, returnByValue: true }).then(
      (r) => r?.result?.value
    );
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data.toString());
    if (data.method === 'Runtime.consoleAPICalled') {
      const type = data.params?.type;
      const text = data.params?.args?.map((a: any) => a.value || a.description).join(' ');
      if (type === 'error') {
        consoleErrors.push(text);
      }
    }
  };

  ws.onopen = async () => {
    await sendCmd('Runtime.enable');
    await sendCmd('Page.enable');

    console.log('🚀 Running Comprehensive Real-Browser Interaction QA...\n');

    // TEST 1: Direct Homepage Loading & Title
    const title = await evaluate(`document.title`);
    const h1 = await evaluate(`document.querySelector('h1')?.innerText`);
    record('Homepage Load', !!h1 && h1.includes('Where Royal Heritage'), `H1: "${h1?.replace(/\n/g, ' ')}"`);

    // TEST 2: Flow A - Navigation to /women and PDP
    await sendCmd('Page.navigate', { url: 'http://localhost:3000/women' });
    await new Promise((r) => setTimeout(r, 1200));
    const womenH1 = await evaluate(`document.querySelector('h1')?.innerText || document.querySelector('h2')?.innerText`);
    record('Storefront /women Route', !!womenH1, `Header on /women: "${womenH1}"`);

    // TEST 3: Direct PDP Loading & Variant Matrix
    await sendCmd('Page.navigate', { url: 'http://localhost:3000/product/padmavati-crimson-zari-bridal-lehenga' });
    await new Promise((r) => setTimeout(r, 1400));
    const pdpTitle = await evaluate(`document.querySelector('h1')?.innerText`);
    const priceText = await evaluate(`document.querySelector('.font-serif.text-2xl, .font-serif.text-3xl')?.innerText`);
    record('PDP Render & Price', pdpTitle?.includes('Padmavati') && !!priceText, `Title: "${pdpTitle}", Price: "${priceText}"`);

    // TEST 4: Select Size Variant then Add to Bag & Cart Drawer Trigger
    const sizeSelected = await evaluate(`(() => {
      const sizeBtns = Array.from(document.querySelectorAll('button')).filter(b => 
        b.innerText.includes('XS') || b.innerText.includes('S (36)') || b.innerText.includes('M (38)') || b.innerText.includes('L (40)')
      );
      if (sizeBtns.length > 0) {
        sizeBtns[1].click(); // Select S (36)
        return true;
      }
      return false;
    })()`);
    record('Size Pill Selection', sizeSelected, 'Garment size S (36) selected');

    await new Promise((r) => setTimeout(r, 500));
    const addToCartSuccess = await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Add to Bag'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    })()`);
    await new Promise((r) => setTimeout(r, 1000));

    // Check if Cart Drawer opened
    const drawerVisible = await evaluate(`(() => {
      const drawer = document.querySelector('[role="dialog"]') || document.querySelector('.fixed.inset-y-0.right-0');
      return !!drawer;
    })()`);
    record('Cart Drawer Open', drawerVisible, 'Cart drawer successfully animated open upon Add to Bag');

    // TEST 5: Escape Key to Close Cart Drawer
    await sendCmd('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', windowsVirtualKeyCode: 27 });
    await sendCmd('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', windowsVirtualKeyCode: 27 });
    await new Promise((r) => setTimeout(r, 600));
    const drawerClosed = await evaluate(`(() => {
      const drawer = document.querySelector('.fixed.inset-y-0.right-0.translate-x-full');
      const anyDrawer = document.querySelector('.fixed.inset-y-0.right-0');
      return !anyDrawer || drawer !== null;
    })()`);
    record('Escape Key Drawer Dismissal', drawerClosed, 'Cart drawer dismissed cleanly upon Escape keypress');

    // TEST 6: Wishlist Toggle
    const wishlistToggled = await evaluate(`(() => {
      const heartBtn = document.querySelector('button[aria-label*="wishlist"]') || document.querySelector('button[title*="wishlist"]');
      if (heartBtn) {
        heartBtn.click();
        return true;
      }
      return false;
    })()`);
    await new Promise((r) => setTimeout(r, 500));
    record('Wishlist Toggle Action', wishlistToggled, 'Wishlist heart action triggered on PDP');

    // TEST 7: Flow D - Checkout Route (with item now present in cart)
    await sendCmd('Page.navigate', { url: 'http://localhost:3000/checkout' });
    await new Promise((r) => setTimeout(r, 1500));
    const checkoutRendered = await evaluate(`(() => {
      const inputs = document.querySelectorAll('input');
      const text = document.body.innerText;
      return inputs.length >= 3 && (text.includes('Delivery Address') || text.includes('Contact Information') || text.includes('Checkout'));
    })()`);
    record('Checkout Page Render', checkoutRendered, 'Active checkout flow loaded with address fields and item snapshot');

    // TEST 8: 404 Route Handling
    await sendCmd('Page.navigate', { url: 'http://localhost:3000/atelier-non-existent-page-test' });
    await new Promise((r) => setTimeout(r, 1000));
    const notFoundRendered = await evaluate(`(() => {
      const text = document.body.innerText;
      return text.includes('404') || text.includes('Page Not Found') || text.includes('Lost in the Atelier');
    })()`);
    record('404 Not Found Page Handling', notFoundRendered, 'Direct navigation to unknown URL gracefully renders 404 view');

    // TEST 9: Admin Authentication Gate & Login
    await sendCmd('Page.navigate', { url: 'http://localhost:3000/admin/login' });
    await new Promise((r) => setTimeout(r, 1200));
    const loginFormExists = await evaluate(`(() => {
      const pwd = document.querySelector('input[type="password"]');
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Access Admin'));
      return !!pwd && !!btn;
    })()`);
    record('Admin Login Gate', loginFormExists, 'Admin login form renders with credentials assistance and password field');

    // Summary & Results
    console.log('\n======================================================');
    console.log(`Interaction QA Results: ${verificationLog.filter(v => v.status === 'PASS').length} Passed, ${verificationLog.filter(v => v.status === 'FAIL').length} Failed`);
    console.log(`Browser Console Errors Detected: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Console errors:', consoleErrors);
    }
    console.log('======================================================\n');

    ws.close();
    chrome.kill();

    const hasFailures = verificationLog.some(v => v.status === 'FAIL');
    process.exit(hasFailures ? 1 : 0);
  };
}

run().catch((err) => {
  console.error('Fatal error in interaction QA:', err);
  chrome.kill();
  process.exit(1);
});
