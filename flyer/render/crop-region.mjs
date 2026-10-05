import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
const b64 = readFileSync('/workspace/.pi-web/attachments/attachment-20261001-000327-821-1-Clean-Robotics-Flyer-Facebook-Post-Template.jpg').toString('base64');
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(`<html><body style="margin:0"><canvas id="c" width="896" height="1200"></canvas><canvas id="out" width="1792" height="640"></canvas></body></html>`);
await page.evaluate(async (b64) => {
  const i = new Image();
  i.src = 'data:image/jpeg;base64,' + b64;
  await new Promise((res, rej) => { i.onload = res; i.onerror = () => rej(new Error('fail')); });
  document.getElementById('c').getContext('2d').drawImage(i, 0, 0);
  const out = document.getElementById('out');
  const ctx = out.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  // kit region y 820..1140, full width, 2x scale
  ctx.drawImage(document.getElementById('c'), 0, 820, 896, 320, 0, 0, 1792, 640);
  window.__png = out.toDataURL('image/png').split(',')[1];
}, b64);
const png = await page.evaluate(() => window.__png);
writeFileSync('/tmp/kit-region-2x.png', Buffer.from(png, 'base64'));
await browser.close();
console.log('saved /tmp/kit-region-2x.png');
