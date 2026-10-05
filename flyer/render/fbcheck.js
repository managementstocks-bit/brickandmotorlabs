const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 900 },
  });
  const page = await ctx.newPage();
  try {
    await page.goto('https://www.facebook.com/events/1062980916528359/', { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(6000);
    const text = await page.evaluate(() => document.body.innerText);
    const html = await page.content();
    const times = [...new Set(text.match(/\b[12]\d?:(?:00|30)\s?(?:AM|PM)\b/g) || [])];
    console.log('TIMES_IN_TEXT:', JSON.stringify(times));
    const m = text.match(/.{80}(?:AM|PM).{80}/g);
    if (m) console.log('CONTEXT:', m.slice(0,6).join('\n---\n'));
    const htmlTimes = [...new Set(html.match(/\b[12]\d?:(?:00|30)\s?(?:AM|PM)\b/g) || [])];
    console.log('TIMES_IN_HTML:', JSON.stringify(htmlTimes));
    const dateMatch = text.match(/Saturday[^.\n]{0,80}/g);
    if (dateMatch) console.log('DATE_CTX:', dateMatch.slice(0,5).join(' | '));
  } catch (e) {
    console.log('ERR', e.message);
  }
  await browser.close();
})();
