// Scrape title/age/parts/price from each build page for an overview index
const fs = require('fs');
const { chromium } = require('/workspace/temp/money/node_modules/playwright-core');
const URLS = fs.readFileSync('/workspace/temp/build_urls.txt','utf8').split('\n').map(s=>s.trim()).filter(Boolean);
(async () => {
  const b = await chromium.launch({ executablePath:'/root/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome', headless:true, args:['--no-sandbox','--disable-dev-shm-usage'] });
  const ctx = await b.newContext({ viewport:{width:1280,height:900} });
  const rows = [];
  for (const url of URLS) {
    const slug = url.match(/builds\/([a-z0-9-]+)\.html/)[1];
    const page = await ctx.newPage();
    try {
      await page.goto(url, { waitUntil:'domcontentloaded', timeout:45000 });
      await page.waitForTimeout(250);
      const d = await page.evaluate(() => {
        const clean = s => (s||'').replace(/\s+/g,' ').trim();
        const h1 = clean(document.querySelector('h1')?.textContent);
        const img = (()=>{ const s=document.querySelector('.build-hero img')?.getAttribute('src') || document.body.querySelector('img[src*="../images"]:not([alt*="logo"])')?.getAttribute('src'); return s? new URL(s, location.href).href : ''; })();
        const meta = s => clean(document.querySelector(s)?.textContent);
        const tags = [...document.querySelectorAll('.build-hero__meta *')].map(el=>clean(el.textContent)).filter(t=>t && t.length<25);
        const age = (tags.find(t=>/^Age\s*\d/i.test(t))||'').replace('Age','').trim();
        const parts = (tags.find(t=>/Parts$/i.test(t))||'').trim();
        const price = (tags.find(t=>/^\$/.test(t))||'').trim();
        return { h1, age, parts, price, img };
      });
      rows.push({ slug, url, ...d });
      console.log(`${slug}\t age='${d.age}' parts='${d.parts}' price='${d.price}' img='${d.img}'  h1="${d.h1}"`);
    } catch(e){ console.log('FAIL', slug, e.message); rows.push({slug,url,h1:slug}); }
    finally { await page.close(); }
  }
  fs.writeFileSync('/workspace/temp/build_pdf/build_meta.json', JSON.stringify(rows,null,2));
  await b.close();
})();
