import { execSync } from 'child_process';

// Use Chrome with a small script injected or evaluate scrollWidth
const script = `
const docWidth = document.documentElement.clientWidth;
const bodyWidth = document.body.scrollWidth;
const wideElements = [];
document.querySelectorAll('*').forEach(el => {
  const r = el.getBoundingClientRect();
  if (r.right > docWidth + 2) {
    wideElements.push({
      tag: el.tagName,
      className: (el.className || '').toString().slice(0, 50),
      right: Math.round(r.right),
      width: Math.round(r.width)
    });
  }
});
console.log('DOC_WIDTH:' + docWidth + ' SCROLL_WIDTH:' + bodyWidth);
console.log('WIDE_COUNT:' + wideElements.length);
console.log('WIDE_SAMPLE:' + JSON.stringify(wideElements.slice(0, 5)));
`;

const cmd = `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --run-all-compositor-stages-before-draw --window-size=390,844 --virtual-time-budget=2000 "http://localhost:3000" --dump-dom 2>/dev/null`;
// Or run node script that checks stylesheet or classes
console.log('Inspecting widths...');
