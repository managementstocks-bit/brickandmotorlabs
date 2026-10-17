// Batch-print all brickandmotorlabs.com build pages to clean PDFs
const fs = require('fs');
const path = require('path');
const { chromium } = require('/workspace/temp/money/node_modules/playwright-core');

const OUT = '/workspace/temp/build_pdf/pdf';
const URLS = fs.readFileSync('/workspace/temp/build_urls.txt', 'utf8')
  .split('\n').map(s => s.trim()).filter(Boolean);

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({
    executablePath: '/root/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const results = [];
  for (const url of URLS) {
    const slug = url.match(/builds\/([a-z0-9-]+)\.html/)[1];
    const page = await ctx.newPage();
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
      await page.waitForTimeout(400);
      const title = (await page.title()).replace(/\s*\|\s*BrickAndMotorLabs.*$/, '').trim();
      // Clean the page for printing: drop site chrome, keep main content
      await page.evaluate(() => {
        for (const sel of ['.navbar', '.footer', '.build-nav', '.btn', '.build-cta', 'script']) {
          document.querySelectorAll(sel).forEach(el => { el.style.display = 'none'; });
        }
        document.body.style.backgroundColor = '#fff';
        // printed-friendly learn-more line, inserted after the hero badges
        const h1 = document.querySelector('h1');
        if (h1) {
          const p = document.createElement('p');
          p.textContent = 'Full details, video and kits: brickandmotorlabs.com' + location.pathname;
          p.style.cssText = 'text-align:center;font-size:12px;color:#555;margin-top:8px;';
          h1.parentElement.appendChild(p);
        }
      });
      const file = path.join(OUT, slug + '.pdf');
      await page.pdf({
        path: file,
        format: 'Letter',
        printBackground: true,
        scale: 0.92,
        margin: { top: '12mm', bottom: '12mm', left: '12mm', right: '12mm' },
      });
      const size = fs.statSync(file).size;
      const buf = fs.readFileSync(file, 'latin1');
      const pages = (buf.match(/\/Type\s*\/Page[^s]/g) || []).length;
      results.push({ slug, title, pages, kb: Math.round(size / 1024) });
      console.log(`OK ${slug}  (${pages} pages, ${Math.round(size / 1024)} KB)  "${title}"`);
    } catch (e) {
      results.push({ slug, error: e.message });
      console.log(`FAIL ${slug}: ${e.message}`);
    } finally {
      await page.close();
    }
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(results, null, 2));
  const ok = results.filter(r => !r.error).length;
  console.log(`\nDone: ${ok}/${URLS.length} printed`);
})();
