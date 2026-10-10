#!/usr/bin/env node
/*
 * Generates BrickAndMotorLabs.com/family-bazaar.html — the INTERNAL one-page
 * price + QR sheet (print target: single A4 sheet, 3 x 6 grid, no descriptions).
 *
 *   node flyers/gen-bazaar-sheet.mjs          -> writes family-bazaar.html (repo root)
 *   node flyers/gen-bazaar-sheet.mjs --check   -> verifies the 18 QR pngs + online prices against live /api/prices
 *
 * Prices here must stay in sync with Stripe PRICE_MAP (worker repo price-map.json),
 * the site script.js CATALOG and the print flyers. Floor to whole dollars (no cents).
 * Kits marked online=false are event-only: priced by hand, no Stripe record yet.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(SITE, 'family-bazaar.html');

// slug, display name, age band, price (CAD, whole dollars), on-hand qty (null = not counted), online?
// stock is printed on this INTERNAL sheet only - it is what we physically have at the table.
// eventOnly kits have no Stripe price yet (ordered 2026-10-10, sold at the table / by email).
const KITS = [
  ['bike',                'Blix Minis - Bike',      '5+',  12,  null, true],
  ['ferris-wheel',        'Blix Minis - Ferris Wheel','5+', 12,  null, true],
  ['disco-bot',           'Blix Minis - Disco Bot',  '5+',  12,  5,    false],
  ['queaky-charge',       'Queaky Charge - Sleepy', '3+',  24,  null, true],
  ['buddy',               'Blix Buddy',             '5+',  28,  null, true],
  ['build-a-machine',     'Blix Build-A-Machine',   '5+',  38,  4,    false],
  ['crawlers',            'Crawlers',               '8+',  49,  null, true],
  ['rover',               'Rover',                  '8+',  53,  null, true],
  ['gear-box',           'Gear Box',                '8+',  69,  null, true],
  ['forklift-power',      'Forklift Power',         '8+',  76,  null, true],
  ['power-screw',        'Power Screw',             '8+',  80,  null, true],
  ['marble-run-2',        'Blix Marble Run 2',      '8+',  107, null, true],
  ['amusement-park',      'Amusement Park',         '8+',  115, null, true],
  ['rc-explorers',        'RC Explorers',           '8+',  115, null, true],
  ['rc-rover',            'RC Rover',               '8+',  115, null, true],
  ['discovering-motions', 'Discovering Motions',    '8+',  134, null, true],
  ['logic-blocks',        'Blix Logic Blocks',      '8+',  268, 2,    false],
  ['rc-megastructures',   'RC Megastructures',      '8+',  268, null, true],
];

const EVENT = {
  when: 'Saturday, October 10, 2026 &middot; 11:30 AM &ndash; 4:15 PM',
  where: 'Pineview Community Hub &mdash; Gloucester &amp; Meadowbrook Room, 1700 Blair Rd, Gloucester, ON K1B 4E6',
  entry: 'Free &middot; Everyone welcome',
};

const cards = KITS.map(([slug, name, age, price, stock, online]) => `      <article class="bz-card">
        <div class="bz-card__text">
          <h3 class="bz-card__name">${name}</h3>
          <p class="bz-card__meta"><span class="bz-card__price">$${price}</span><span class="bz-card__age">Ages ${age}</span>${stock !== null ? `<span class="bz-card__stock">${stock} on hand</span>` : ''}</p>
          <p class="bz-card__note">${online ? 'Buy online' : 'At our table today'}</p>
        </div>
        <img class="bz-card__qr" src="images/qrcodes/bazaar-${slug}.png" width="480" height="480" alt="QR code for ${name}">
      </article>`).join('\n');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-VJJ1KVW9LM"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-VJJ1KVW9LM');
  gtag('event', 'page_view', { page_title: "Family Bazaar - Price Sheet - BrickAndMotorLabs" });
</script>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Family Bazaar - Price Sheet - BrickAndMotorLabs</title>
  <meta name="description" content="Internal price sheet: all 18 BrickAndMotorLabs STEM kits with price, on-hand count and QR code, laid out for a single A4 sheet.">
  <meta name="robots" content="noindex, nofollow">
  <link rel="canonical" href="https://brickandmotorlabs.com/family-bazaar.html">
  <meta name="theme-color" content="#1a73e8">
  <link rel="icon" type="image/svg+xml" href="images/favicon-baml.png?v=4">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">
  <link rel="stylesheet" href="style.css">
  <style>
/* --- Family Bazaar price sheet (internal, 1 x A4) --- */
.bz-sheet__head { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 0.75rem 1.5rem; margin-bottom: 1.25rem; }
.bz-sheet__head h1 { font-size: 1.5rem; }
.bz-sheet__head h1 span { color: var(--primary); }
.bz-print { display: inline-flex; }
.bz-event { display: flex; flex-wrap: wrap; gap: 0.5rem 2rem; border: 2px solid var(--gray-light); border-radius: var(--radius-md); padding: 0.75rem 1rem; margin-bottom: 1.25rem; background: var(--white); }
.bz-event__item strong { display: block; color: var(--primary); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em; }
.bz-event__item span { color: var(--dark); font-weight: 500; font-size: 0.9rem; }
.bz-grid { display: grid; gap: 1rem; grid-template-columns: repeat(3, 1fr); }
.bz-card { display: flex; align-items: center; gap: 0.85rem; background: var(--white); border: 1px solid var(--gray-light); border-radius: var(--radius-md); padding: 0.75rem; box-shadow: var(--shadow-sm); }
.bz-card__text { flex: 1; min-width: 0; }
.bz-card__name { font-size: 1.02rem; line-height: 1.25; margin-bottom: 0.35rem; }
.bz-card__meta { display: flex; align-items: baseline; gap: 0.6rem; flex-wrap: wrap; }
.bz-card__price { font-size: 1.5rem; font-weight: 800; color: var(--dark); }
.bz-card__age { font-size: 0.72rem; font-weight: 700; color: var(--primary-dark); background: rgba(26, 115, 232, 0.1); padding: 2px 8px; border-radius: 999px; }
.bz-card__stock { font-size: 0.72rem; font-weight: 700; color: #7a4c00; background: rgba(240, 163, 26, 0.16); padding: 2px 8px; border-radius: 999px; }
.bz-card__note { font-size: 0.68rem; color: var(--gray); margin-top: 0.3rem; text-transform: uppercase; letter-spacing: 0.05em; }
.bz-card__qr { width: 118px; height: 118px; flex-shrink: 0; image-rendering: pixelated; border: 1px solid var(--gray-light); border-radius: 4px; padding: 4px; background: #fff; }
@media (max-width: 900px) { .bz-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 620px) { .bz-grid { grid-template-columns: 1fr; } }

/* --- Print: exactly one A4 sheet, 3 x 6, 30 mm codes --- */
@media print {
  @page { size: A4 portrait; margin: 9mm; }
  body { background: #fff !important; }
  .navbar, .footer, .subscribe-band, .skip-link, .bz-print { display: none !important; }
  .section { padding: 0 !important; }
  .container { max-width: none !important; }
  .bz-sheet__head { margin-bottom: 2mm; }
  .bz-sheet__head h1 { font-size: 12pt; }
  .bz-event { border: 1pt solid #16283f; border-radius: 2pt; padding: 1mm 2.5mm; margin: 0 0 2mm; gap: 0.5mm 8mm; }
  .bz-event__item { flex: 1 1 28%; }
  .bz-event__item strong { font-size: 6pt; }
  .bz-event__item span { font-size: 7.5pt; }
  .bz-grid { grid-template-columns: repeat(3, 1fr); gap: 2.5mm; }
  .bz-card { border: 0.6pt solid #16283f; border-radius: 2pt; box-shadow: none; padding: 2mm; gap: 2mm; break-inside: avoid; page-break-inside: avoid; align-items: center; }
  .bz-card__name { font-size: 9.5pt; line-height: 1.2; margin-bottom: 0.8mm; }
  .bz-card__price { font-size: 12.5pt; }
  .bz-card__age { font-size: 6.5pt; padding: 0 4pt; }
  .bz-card__stock { font-size: 6.5pt; padding: 0 4pt; }
  .bz-card__note { font-size: 6pt; margin-top: 0.6mm; }
  .bz-card__qr { width: 27mm; height: 27mm; border: none; border-radius: 0; padding: 0; }
  a[href]::after { content: "" !important; }
}
  </style>
</head>
<body>

  <a href="#main-content" class="skip-link">Skip to main content</a>

  <!-- Navigation -->
  <nav class="navbar">
    <div class="container">
      <a href="index.html" class="navbar__logo"><img src="images/baml1-logo.png" alt="BrickAndMotorLabs logo">BrickAndMotor<span>Labs</span></a>
      <ul class="navbar__menu" id="navbar-menu">
        <li><a href="index.html" class="navbar__link">Home</a></li>
        <li><a href="about.html" class="navbar__link">About</a></li>
        <li><a href="index.html#products" class="navbar__link">Kits</a></li>
        <li><a href="events.html" class="navbar__link">Events</a></li>
        <li><a href="contact.html" class="navbar__link">Contact</a></li>
        <li><a href="contact.html" class="navbar__cta">Get In Touch</a></li>
      </ul>
      <button class="navbar__hamburger" aria-label="Toggle menu" aria-expanded="false" aria-controls="navbar-menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </nav>

  <!-- Price sheet -->
  <section id="main-content" class="section">
    <div class="container">
      <div class="bz-sheet__head">
        <h1>Kit Prices &amp; <span>QR Codes</span> &mdash; Family Bazaar</h1>
        <button class="btn btn--accent bz-print" onclick="window.print()" type="button">Print (1 page, A4)</button>
      </div>

      <div class="bz-event" role="note" aria-label="Event details">
        <div class="bz-event__item"><strong>When</strong><span>${EVENT.when}</span></div>
        <div class="bz-event__item"><strong>Where</strong><span>${EVENT.where}</span></div>
        <div class="bz-event__item"><strong>Entry</strong><span>${EVENT.entry}</span></div>
        <div class="bz-event__item"><strong>Prices</strong><span>CAD &middot; whole dollars &middot; buy online or at our table</span></div>
        <div class="bz-event__item"><strong>New today</strong><span>Disco Bot &times;5 &middot; Build-A-Machine &times;4 &middot; Logic Blocks &times;2</span></div>
      </div>

      <div class="bz-grid">

${cards}
      </div>
    </div>
  </section>

    <footer class="footer">
    <div class="container">
      <div class="footer__grid">
        <div class="footer__brand">
          <div class="footer__logo">BrickAndMotor<span>Labs</span></div>
          <p>Hands-on STEM robotics kits that turn curiosity into creation.</p>
          <div class="footer__trust">
            <span>Canadian Family Business</span>
          </div>
        </div>
        <div>
          <h4 class="footer__heading">Quick Links</h4>
          <ul class="footer__links">
            <li><a href="index.html">Home</a></li>
            <li><a href="about.html">About Us</a></li>
            <li><a href="events.html">Events</a></li>
            <li><a href="subscribe.html">Newsletter</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 class="footer__heading">Support</h4>
          <ul class="footer__links">
            <li><a href="faq.html">FAQ</a></li>
            <li><a href="shipping.html">Shipping</a></li>
            <li><a href="terms.html">Terms of Sale</a></li>
            <li><a href="privacy.html">Privacy Policy</a></li>
            <li><a href="mailto:info@brickandmotorlabs.com">Email Us</a></li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom">
        <p>&copy; 2026 BrickAndMotorLabs. All rights reserved.</p>
      </div>
    </div>
  </footer>
<script src="script.js"></script>
</body>
</html>
`;

if (process.argv.includes('--check')) {
  let bad = 0;
  for (const [slug, name] of KITS) {
    const p = path.join(SITE, 'images/qrcodes', `bazaar-${slug}.png`);
    if (!fs.existsSync(p)) { console.log(`MISSING QR: ${p}`); bad++; }
  }
  const live = await (await fetch('https://brickandmotorlabs-checkout.brickandmotorlabs.workers.dev/api/prices')).json();
  // Only kits that are actually sold online have a worker price; the event-only kits are priced by hand.
  for (const [slug, name, , price, , online] of KITS) {
    if (!online) continue;
    if (live[slug] !== price * 100) { console.log(`PRICE DRIFT ${slug}: page $${price}, worker ${live[slug]} cents`); bad++; }
  }
  console.log(bad === 0 ? `OK: ${KITS.length} QR files present, ${KITS.filter(k => k[5]).length} online prices match the live worker (${KITS.length} kits).` : `${bad} problem(s).`);
  process.exit(bad === 0 ? 0 : 1);
}

fs.writeFileSync(OUT, html);
console.log(`wrote ${OUT} (${KITS.length} kits, ${html.split('\n').length} lines)`);
