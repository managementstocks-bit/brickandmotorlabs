import { chromium } from 'playwright';
import { readFileSync } from 'fs';

const src = process.env.FLYER_SRC || 'file:///data/workspace/workspace/BrickAndMotorLabs.com/flyer/flyer.html';
const out = process.env.OUT || '/data/workspace/temp/render';
const label = process.env.LABEL || 'baseline';

const browser = await chromium.launch({ args: ['--font-render-hinting=none'] });
const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 2 });
await page.goto(src, { waitUntil: 'networkidle', timeout: 60000 });
await page.evaluate(() => document.fonts.ready);
const h = await page.evaluate(() => document.body.scrollHeight);
console.log(`${label} body height px:`, h, h <= 1123 ? '(OK one A4 page)' : '(OVERFLOW!)');
await page.screenshot({ path: `${out}/${label}.png`, fullPage: true });
await page.pdf({ path: `${out}/${label}.pdf`, format: 'A4', printBackground: true, preferCssPageSize: true, margin: { top: '0', bottom: '0', left: '0', right: '0' } });
const buf = readFileSync(`${out}/${label}.pdf`);
const pages = (buf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
console.log(`${label} pdf pages:`, pages, 'size KB:', Math.round(buf.length / 1024));
await browser.close();
