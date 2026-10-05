// Render the October FB portrait flyer (896x1200 design) at 4x + PDF.
// Usage: node render-portrait.mjs [outPrefix]
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const dir = path.dirname(new URL(import.meta.url).pathname);
const root = path.dirname(dir); // flyer/
const src = path.join(root, 'flyer-fb-portrait.html');
const prefix = process.argv[2] || 'flyer-fb-post';

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 896, height: 1200 },
    deviceScaleFactor: 4,
  });
  await page.goto(pathToFileURL(src).href, { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate(async () => { try { await document.fonts.ready; } catch {} });
  await page.waitForTimeout(500);
  const el = await page.locator('.page');
  await el.screenshot({ path: path.join(root, `${prefix}-3584x4800.png`) });
  await page.pdf({
    path: path.join(root, `${prefix}.pdf`),
    width: '896px', height: '1200px',
    printBackground: true, preferCSSPageSize: true, margin: { top: 0, bottom: 0, left: 0, right: 0 },
  });
  console.log('rendered', prefix);
} finally {
  await browser.close();
}
