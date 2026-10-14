import { spawn } from 'child_process';

const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless',
  '--disable-gpu',
  '--remote-debugging-port=9222',
  '--window-size=390,844',
  'http://localhost:3000',
]);

async function run() {
  await new Promise((r) => setTimeout(r, 1500));
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  const pageTab = tabs.find((t: any) => t.type === 'page');
  console.log('Page tab found:', pageTab?.url);

  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  ws.onopen = () => {
    // Override device metrics to true 390x844 mobile viewport
    ws.send(
      JSON.stringify({
        id: 1,
        method: 'Emulation.setDeviceMetricsOverride',
        params: {
          width: 390,
          height: 844,
          deviceScaleFactor: 2,
          mobile: true,
        },
      })
    );

    setTimeout(() => {
      // Evaluate scrollWidth
      ws.send(
        JSON.stringify({
          id: 2,
          method: 'Runtime.evaluate',
          params: {
            expression: `(() => {
              const docWidth = window.innerWidth;
              const scrollWidth = document.documentElement.scrollWidth;
              const header = document.querySelector('header');
              const headerRect = header ? header.getBoundingClientRect() : null;
              const navUtilities = document.querySelector('header .flex.items-center.space-x-1') || document.querySelector('header .flex.items-center.space-x-2');
              const navRect = navUtilities ? navUtilities.getBoundingClientRect() : null;
              return { docWidth, scrollWidth, headerWidth: headerRect?.width, navUtilitiesRight: navRect?.right };
            })()`,
            returnByValue: true,
          },
        })
      );
    }, 500);
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data.toString());
    if (data.id === 2) {
      console.log('CDP Result:', JSON.stringify(data.result?.result?.value, null, 2));
      ws.close();
      chrome.kill();
      process.exit(0);
    }
  };
}

run().catch((err) => {
  console.error(err);
  chrome.kill();
  process.exit(1);
});
