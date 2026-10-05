import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const b64 = readFileSync('/workspace/.pi-web/attachments/attachment-20261001-000327-821-1-Clean-Robotics-Flyer-Facebook-Post-Template.jpg').toString('base64');
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(`<html><body style="margin:0"><canvas id="c" width="896" height="1200"></canvas></body></html>`);
const report = await page.evaluate(async (b64) => {
  const c = document.getElementById('c');
  const ctx = c.getContext('2d');
  const i = new Image();
  i.src = 'data:image/jpeg;base64,' + b64;
  await new Promise((res, rej) => { i.onload = res; i.onerror = () => rej(new Error('img load failed')); });
  ctx.drawImage(i, 0, 0);
  const d = ctx.getImageData(0, 0, 896, 1200).data;
  const px = (x, y) => { const j = (y * 896 + x) * 4; return [d[j], d[j+1], d[j+2]]; };
  const isWhite = (x, y) => { const [r,g,b] = px(x,y); return r>240 && g>240 && b>240; };
  const isNavy = (x, y) => { const [r,g,b] = px(x,y); return r<80 && g<80 && b>60; };
  // navy bottom band top at column x=448
  let navyTop = -1;
  for (let y = 1199; y > 800; y--) { if (isNavy(448, y)) { navyTop = y; break; } }
  // colorful bands in kit area (y 840..1120, x 250..760)
  const colorRows = [];
  for (let y = 840; y < Math.min(1130, navyTop); y++) {
    let n = 0;
    for (let x = 250; x <= 760; x += 2) { if (!isWhite(x, y) && !isNavy(x, y)) n++; }
    if (n > 8) colorRows.push(y);
  }
  const bands = [];
  for (const y of colorRows) { if (bands.length && y - bands[bands.length-1].end <= 3) bands[bands.length-1].end = y; else bands.push({start: y, end: y}); }
  // horizontal extent per band (at mid row), restricted to x 20..880
  const extents = bands.map(g => {
    const y = Math.round((g.start + g.end) / 2);
    const xs = [];
    let run = null;
    for (let x = 20; x < 880; x++) {
      const on = !isWhite(x, y) && !isNavy(x, y);
      if (on && !run) run = { a: x, b: x };
      else if (on) run.b = x;
      else if (run) { if (run.b - run.a > 5) xs.push(run); run = null; }
    }
    if (run && run.b - run.a > 5) xs.push(run);
    return { y, runs: xs };
  });
  // dark text rows below the photo band, x 380..740
  const photoBand = bands.find(g => g.end - g.start > 40);
  const textGroups = [];
  if (photoBand) {
    for (let y = photoBand.end + 2; y < Math.min(navyTop > 0 ? navyTop : 1130, photoBand.end + 80); y++) {
      let n = 0;
      for (let x = 380; x <= 740; x += 2) { const [r,g,b] = px(x,y); if (r<130 && g<130 && b<170) n++; }
      if (n > 6) { if (textGroups.length && y - textGroups[textGroups.length-1].end <= 2) textGroups[textGroups.length-1].end = y; else textGroups.push({start: y, end: y}); }
    }
  }
  // caption row y-center for each of 4 columns: use text groups row 1
  const bg = px(620, 860);
  const bg2 = px(595, 1050);
  return { navyTop, bands, extents, photoBand, textGroups, bg, bg2, W: 896, H: 1200 };
}, b64);
console.log(JSON.stringify(report, null, 1));
await browser.close();
