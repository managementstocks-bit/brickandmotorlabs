const { chromium } = require('playwright');
const fs = require('fs');
const html = `<!doctype html><html><head><meta charset="utf-8">
<style>@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,500;0,600;0,700;0,800;1,600&family=Inter:wght@400;500;600;700&display=swap');
.s{position:absolute;white-space:nowrap;}</style></head><body>
<span id="a" class="s" style="font:800 57px Poppins">Building Young</span>
<span id="b" class="s" style="font:800 51px Poppins">Building Young</span>
<span id="c" class="s" style="font:800 51px Poppins">Innovators.</span>
<span id="d" class="s" style="font:700 37px Poppins;letter-spacing:-0.5px">BrickAndMotorLabs</span>
<span id="e" class="s" style="font:800 33px Poppins;letter-spacing:1px">OCTOBER EVENTS</span>
<span id="f" class="s" style="font:700 18.5px Poppins;letter-spacing:.4px">COME BUILD, PLAY &amp; GET INSPIRED WITH US THIS OCTOBER!</span>
<span id="g" class="s" style="font:700 22px Poppins">ROBOTICS KITS FOR AGES 5+</span>
<span id="h" class="s" style="font:700 17.5px Poppins">Build a Ferris Wheel!</span>
<span id="i" class="s" style="font:700 14px Poppins">RC Megastructures</span>
<span id="j" class="s" style="font:700 16px Poppins">11:30 AM to 4:15 PM</span>
<span id="k" class="s" style="font:700 17px Poppins">Family Bazaar</span>
<span id="l" class="s" style="font:500 12px Inter">J.R. Brisson Complexe,</span>
<span id="m" class="s" style="font:700 14px Poppins">SAT &bull; OCT 17</span>
<span id="n" class="s" style="font:700 14.5px Poppins">RC Megastructures</span>
</body></html>`;
fs.writeFileSync('/tmp/measure.html', html);
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('file:///tmp/measure.html', { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate(async () => { try { await document.fonts.ready; } catch {} });
  const ids = 'abcdefghijklmn'.split('');
  for (const id of ids) {
    const w = await page.locator('#'+id).evaluate(el => el.getBoundingClientRect().width);
    console.log(id, w.toFixed(1));
  }
  await browser.close();
})();
