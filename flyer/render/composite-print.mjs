import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';

const b64 = readFileSync('/workspace/.pi-web/attachments/attachment-20261001-000327-821-1-Clean-Robotics-Flyer-Facebook-Post-Template.jpg').toString('base64');
const assetB64 = readFileSync('/workspace/workspace/BrickAndMotorLabs.com/images/Blix_Minis_Ferris_Wheel.png').toString('base64');
const S = 4; // print scale (896x1200 -> 3584x4800)

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(`<!DOCTYPE html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap" rel="stylesheet">
</head><body style="margin:0"><canvas id="c" width="${896*S}" height="${1200*S}"></canvas><canvas id="t" width="896" height="1200"></canvas></body></html>`);
await page.evaluate(async ({ b64, assetB64, S }) => {
  const load = (src) => new Promise((res, rej) => { const i = new Image(); i.src = src; i.onload = () => res(i); i.onerror = () => rej(new Error('img fail')); });
  const orig = await load('data:image/jpeg;base64,' + b64);
  const asset = await load('data:image/png;base64,' + assetB64);
  await document.fonts.ready;
  const t = document.getElementById('t'); // work at 896, then upscale 2-pass
  const ctx = t.getContext('2d');
  ctx.drawImage(orig, 0, 0);

  // 1) erase old 4th card
  ctx.fillStyle = '#fdfdfd';
  ctx.fillRect(505, 902, 173, 170);
  // 2) new photo
  const bw = 282, bh = 410, boxW = 116, boxH = 100;
  const s = Math.min(boxW / bw, boxH / bh);
  const w = bw * s, h = bh * s;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(asset, 356, 292, bw, bh, 598 - w / 2, 959 - h / 2, w, h);
  // 3) caption
  ctx.fillStyle = '#001e6e';
  ctx.font = '800 14px Nunito, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillText('Ferris Wheel', 598, 1013);
  // 4) description
  ctx.font = '700 11px Nunito, sans-serif';
  ['Build a working', 'ferris wheel that', 'spins with a lever.'].forEach((ln, k) => ctx.fillText(ln, 598, 1031 + k * 14.5));

  // 2-pass upscale to 4x (smoother than single 4x)
  const c = document.getElementById('c');
  const cctx = c.getContext('2d');
  const mid = document.createElement('canvas'); mid.width = 896 * 2; mid.height = 1200 * 2;
  const mctx = mid.getContext('2d');
  mctx.imageSmoothingQuality = 'high';
  mctx.drawImage(t, 0, 0, 896, 1200, 0, 0, 896 * 2, 1200 * 2);
  cctx.imageSmoothingQuality = 'high';
  cctx.drawImage(mid, 0, 0, 896 * 2, 1200 * 2, 0, 0, 896 * S, 1200 * S);
  window.__png = c.toDataURL('image/png').split(',')[1];
}, { b64, assetB64, S });
const png = await page.evaluate(() => window.__png);
writeFileSync('/workspace/workspace/BrickAndMotorLabs.com/flyer/flyer-fb-post-corrected-print.png', Buffer.from(png, 'base64'));
await browser.close();
console.log('done');
