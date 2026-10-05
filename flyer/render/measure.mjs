import { chromium } from 'playwright';
const b = await chromium.launch({ args: ['--font-render-hinting=none'] });
const p = await b.newPage({ viewport: { width: 794, height: 1123 } });
await p.goto(process.env.SRC, { waitUntil: 'networkidle', timeout: 60000 });
await p.evaluate(() => document.fonts.ready);
const m = await p.evaluate(() => {
  const h = s => { const e = document.querySelector(s); return e ? Math.round(e.getBoundingClientRect().height) : null; };
  const gap = (a,b2) => { const r1 = document.querySelector(a).getBoundingClientRect(), r2 = document.querySelector(b2).getBoundingClientRect(); return Math.round(r2.top - r1.bottom); };
  const evs = [...document.querySelectorAll('.event')].map(e => Math.round(e.getBoundingClientRect().height));
  return {
    hero: h('.hero'), heroTop: h('.hero-top'), workshop: h('.workshop'), lead: h('.lead'), banner: h('.brush-banner'),
    about: h('.about'), eventsHead: h('.events-head'),
    gapHeroAbout: gap('.hero','.about'), gapAboutEvents: gap('.about','.events-head'),
    events: evs, gapEventsFirst: gap('.events-head','.event'),
    gapEvent12: gap('.events .event:nth-child(1)','.events .event:nth-child(2)'),
    total: document.body.scrollHeight
  };
});
console.log(JSON.stringify(m, null, 1));
await b.close();
