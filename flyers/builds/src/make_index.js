// Build a 1-page overview handout of all 18 kits, print to PDF
const fs = require('fs');
const { chromium } = require('/workspace/temp/money/node_modules/playwright-core');
const rows = JSON.parse(fs.readFileSync('/workspace/temp/build_pdf/build_meta.json','utf8'));
rows.sort((a,b)=>a.slug.localeCompare(b.slug));

const cards = rows.map(r => `
  <div class="card">
    <img src="${r.img}" alt="">
    <div class="name">${r.h1}</div>
    <div class="meta">
      <span class="age">Age ${r.age||'–'}</span>
      <span>${r.parts||'—'}</span>
      <span class="price">${r.price||''}</span>
    </div>
  </div>`).join('');

const html = `<!doctype html><html><head><meta charset="utf-8"><title>BrickAndMotorLabs – All Kits</title>
<style>
  * { box-sizing: border-box; margin:0; padding:0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color:#1c1c1c; padding: 10px 14px; }
  header { display:flex; align-items:baseline; gap:14px; border-bottom:3px solid #e8590c; padding-bottom:6px; margin-bottom:8px; }
  h1 { font-size: 20px; }
  .sub { font-size: 11px; color:#555; }
  .grid { display:grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .card { border:1px solid #ddd; border-radius:8px; padding:6px; page-break-inside: avoid; }
  .card img { width:100%; height:74px; object-fit:contain; background:#f7f7f7; border-radius:6px; }
  .name { font-weight:700; font-size:12px; margin-top:5px; }
  .meta { display:flex; flex-wrap:wrap; gap:6px; font-size:10.5px; color:#444; margin-top:3px; }
  .age { background:#fff3e8; color:#b34700; border-radius:10px; padding:1px 7px; font-weight:600; }
  .price { font-weight:700; color:#1a4d8f; }
  footer { margin-top:8px; font-size:10.5px; color:#555; border-top:1px solid #ddd; padding-top:5px; }
</style></head><body>
<header><h1>BrickAndMotorLabs — All Kits at a Glance</h1>
<span class="sub">Hands-on STEM robotics kits · Canadian family business · brickandmotorlabs.com</span></header>
<div class="grid">${cards}</div>
<footer>Full build details, demo videos and kits: <b>brickandmotorlabs.com/builds</b> · Prices in CAD, parts counts per kit · Autumn Bazaar '26</footer>
</body></html>`;

fs.writeFileSync('/workspace/temp/build_pdf/index.html', html);
(async () => {
  const b = await chromium.launch({ executablePath:'/root/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome', headless:true, args:['--no-sandbox','--disable-dev-shm-usage'] });
  const page = await (await b.newContext()).newPage();
  await page.goto('file:///workspace/temp/build_pdf/index.html', { waitUntil:'networkidle' });
  await page.pdf({ path:'/workspace/temp/build_pdf/pdf/00_all_kits_overview.pdf', format:'Letter', printBackground:true, scale:0.9, margin:{top:'7mm',bottom:'7mm',left:'8mm',right:'8mm'} });
  await b.close();
  console.log('overview printed');
})();
