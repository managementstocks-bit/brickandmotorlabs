// Measure, from the rendered PDFs, the distance between the outermost ink and each paper edge.
// This is the check for "a bit of the B does not print": if the min distance is comfortably bigger
// than a printer's unprintable margin (~10-12 mm typical, ~15-20 mm on some inkjets) the page is safe.
import { createRequire } from 'node:module';
const req = createRequire('/workspace/temp/qr-verify/');
const { PNG } = req('pngjs');
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
const DPI = 150, PXMM = DPI / 25.4;
const FLYERS = '/workspace/workspace/BrickAndMotorLabs.com/flyers';
const jsQR = req('jsqr');

for (const [f, label] of [['table-banner.pdf','A4 landscape'], ['table-banner-letter.pdf','Letter landscape']]) {
  const info = execSync(`pdfinfo ${FLYERS}/${f}`).toString();
  const pages = +info.match(/^Pages:\s+(\d+)/m)[1];
  const [wpt, hpt] = info.match(/Page size:\s+([\d.]+) x ([\d.]+) pts/).slice(1).map(Number);
  const W = wpt / 72 * 25.4, H = hpt / 72 * 25.4;
  execSync(`rm -rf raw && mkdir -p raw && pdftoppm -r ${DPI} -png ${FLYERS}/${f} raw/p`);
  console.log(`\n${label}  ${f}  pages=${pages}  paper ${W.toFixed(1)} x ${H.toFixed(1)} mm`);
  let worst = 999;
  for (let i = 1; i <= pages; i++) {
    const cands = [`raw/p-${i}.png`, `raw/p-${String(i).padStart(2,'0')}.png`];
    const png = PNG.sync.read(readFileSync(cands.find(c => existsSync(c)) ?? cands[0]));
    let L = png.width, R = -1, T = png.height, B = -1;
    const ink = (x,y) => { const d = png.data, o = (y*png.width+x)*4; return d[o] < 246 || d[o+1] < 246 || d[o+2] < 246; };
    for (let y = 0; y < png.height; y++) for (let x = 0; x < png.width; x++) if (ink(x,y)) { if (x<L) L=x; if (x>R) R=x; if (y<T) T=y; if (y>B) B=y; }
    const d = { left: L/PXMM, right: (png.width-1-R)/PXMM, top: T/PXMM, bottom: (png.height-1-B)/PXMM };
    const min = Math.min(...Object.values(d));
    worst = Math.min(worst, min);
    // QR decode on this page
    const found = [];
    for (let step = 4; step <= 10 && !found.length; step += 2) {
      const q = jsQR(png.data, png.width, png.height, { inversionAttempts: 'dontInvert', ...{} });
      if (q) found.push(q.data);
    }
    const codes = [...new Set([...found])];
    console.log(`  page ${i}: ink edges left=${d.left.toFixed(1)} right=${d.right.toFixed(1)} top=${d.top.toFixed(1)} bottom=${d.bottom.toFixed(1)} mm  min=${min.toFixed(1)}  ink ${((R-L+1)/PXMM).toFixed(0)}x${((B-T+1)/PXMM).toFixed(0)} mm`);
  }
  console.log(`  -> smallest margin from paper edge across all pages: ${worst.toFixed(1)} mm  ${worst >= 15 ? 'SAFE' : 'TOO TIGHT'}`);
  execSync('rm -rf raw');
}
