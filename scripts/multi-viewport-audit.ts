import { spawn } from 'child_process';

const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless',
  '--disable-gpu',
  '--remote-debugging-port=9223',
  '--window-size=1000,1000',
  'http://localhost:3000',
]);

const widthsToTest = [320, 375, 390, 430, 768, 1024, 1440, 1600];

async function run() {
  await new Promise((r) => setTimeout(r, 1500));
  const res = await fetch('http://127.0.0.1:9223/json');
  const tabs = await res.json();
  const pageTab = tabs.find((t: any) => t.type === 'page');

  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

  const results: any[] = [];

  ws.onopen = async () => {
    let msgId = 10;
    for (const width of widthsToTest) {
      await new Promise<void>((resolve) => {
        // Set viewport
        ws.send(
          JSON.stringify({
            id: ++msgId,
            method: 'Emulation.setDeviceMetricsOverride',
            params: {
              width,
              height: 900,
              deviceScaleFactor: 1,
              mobile: width < 1024,
            },
          })
        );

        setTimeout(() => {
          const evalId = ++msgId;
          const handler = (evt: any) => {
            const data = JSON.parse(evt.data.toString());
            if (data.id === evalId) {
              const val = data.result?.result?.value;
              results.push({ width, ...val });
              ws.removeEventListener('message', handler);
              resolve();
            }
          };
          ws.addEventListener('message', handler);

          ws.send(
            JSON.stringify({
              id: evalId,
              method: 'Runtime.evaluate',
              params: {
                expression: `(() => {
                  const docWidth = window.innerWidth;
                  const scrollWidth = document.documentElement.scrollWidth;
                  const header = document.querySelector('header');
                  const headerWidth = header ? header.getBoundingClientRect().width : null;
                  const navUtilities = document.querySelector('header .flex.items-center.space-x-1') || document.querySelector('header .flex.items-center.space-x-2') || document.querySelector('header .flex.items-center.space-x-4');
                  const navRight = navUtilities ? navUtilities.getBoundingClientRect().right : null;
                  return {
                    docWidth,
                    scrollWidth,
                    headerWidth: Math.round(headerWidth || 0),
                    navRight: Math.round(navRight || 0),
                    overflow: scrollWidth > docWidth
                  };
                })()`,
                returnByValue: true,
              },
            })
          );
        }, 300);
      });
    }

    console.log('\n--- Multi-Viewport Responsive Verification Results ---');
    console.table(results);

    ws.close();
    chrome.kill();
    process.exit(0);
  };
}

run().catch((err) => {
  console.error(err);
  chrome.kill();
  process.exit(1);
});
