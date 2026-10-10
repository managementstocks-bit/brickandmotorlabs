#!/usr/bin/env node
/*
 * Generates BrickAndMotorLabs.com/family-bazaar.html — the INTERNAL one-page
 * price + QR sheet (print target: single A4 sheet, 3 x 5 grid, no descriptions).
 *
 *   node flyers/gen-bazaar-sheet.mjs          -> writes family-bazaar.html (repo root)
 *   node flyers/gen-bazaar-sheet.mjs --check   -> verifies the 15 QR pngs + prices against live /api/prices
 *
 * Prices here must stay in sync with Stripe PRICE_MAP (worker repo price-map.json),
 * the site script.js CATALOG and the print flyers. Floor to whole dollars (no cents).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(SITE, 'family-bazaar.html');

// slug, display name, age band, price (CAD, whole dollars), QR png (images/qrcodes/)
const KITS = [
  ['bike',                'Blix Minis - Bike',      '5+',  12],
  ['ferris-wheel',        'Blix Minis - Ferris Wheel','5+', 12],
  ['queaky-charge',       'Queaky Charge - Sleepy', '3+',  24],
  ['buddy',               'Blix Buddy',             '5+',  28],
  ['crawlers',            'Crawlers',               '8+',  49],
  ['rover',               'Rover',                  '8+',  53],
  ['gear-box',           'Gear Box',                '8+',  69],
  ['forklift-power',      'Forklift Power',         '8+',  76],
  ['power-screw',        'Power Screw',             '8+',  80],
  ['marble-run-2',        'Blix Marble Run 2',      '8+',  107],
  ['amusement-park',      'Amusement Park',         '8+',  115],
  ['rc-explorers',        'RC Explorers',           '8+',  115],
  ['rc-rover',            'RC Rover',               '8+',  115],
  ['discovering-motions', 'Discovering Motions',    '8+',  134],
  ['rc-megastructures',   'RC Megastructures',      '8+',  268],
];

const EVENT = {
  when: 'Saturday, October 10, 2026 &middot; 11:30 AM &ndash; 4:15 PM',
  where: 'Pineview Community Hub &mdash; Gloucester &amp; Meadowbrook Room, 1700 Blair Rd, Gloucester, ON K1B 4E6',
  entry: 'Free &middot; Everyone welcome',
};

const cards = KITS.map(([slug, name, age, price]) => `      <article class="bz-card">
        <div class="bz-card__text">
          <h3 class="bz-card__name">${name}</h3>
          <p class="bz-card__meta"><span class="bz-card__price">$${price}</span><span class="bz-card__age">Ages ${age}</span></p>
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
  <meta name="description" content="Internal price sheet: all 15 BrickAndMotorLabs STEM kits with price and QR code, laid out for a single A4 sheet.">
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
.bz-card__qr { width: 118px; height: 118px; flex-shrink: 0; image-rendering: pixelated; border: 1px solid var(--gray-light); border-radius: 4px; padding: 4px; background: #fff; }
@media (max-width: 900px) { .bz-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 620px) { .bz-grid { grid-template-columns: 1fr; } }

/* --- Print: exactly one A4 sheet, 3 x 5, 30 mm codes --- */
@media print {
  @page { size: A4 portrait; margin: 8mm; }
  body { background: #fff !important; }
  .navbar, .footer, .subscribe-band, .skip-link, .bz-print { display: none !important; }
  .section { padding: 0 !important; }
  .container { max-width: none !important; }
  .bz-sheet__head { margin-bottom: 4mm; }
  .bz-sheet__head h1 { font-size: 13pt; }
  .bz-event { border: 1pt solid #16283f; border-radius: 2pt; padding: 2mm 3mm; margin: 0 0 3mm; gap: 1mm 10mm; }
  .bz-event__item strong { font-size: 6pt; }
  .bz-event__item span { font-size: 7.5pt; }
  .bz-grid { grid-template-columns: repeat(3, 1fr); gap: 4mm; }
  .bz-card { border: 0.6pt solid #16283f; border-radius: 2pt; box-shadow: none; padding: 2.5mm; gap: 3mm; break-inside: avoid; page-break-inside: avoid; }
  .bz-card__name { font-size: 10pt; margin-bottom: 1mm; }
  .bz-card__price { font-size: 13pt; }
  .bz-card__age { font-size: 7pt; padding: 0 4pt; }
  .bz-card__qr { width: 36mm; height: 36mm; border: none; border-radius: 0; padding: 0; }
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
        <div class="bz-event__item"><strong>Prices</strong><span>CAD &middot; online prices, whole dollars</span></div>
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
  for (const [slug, name, , price] of KITS) {
    if (live[slug] !== price * 100) { console.log(`PRICE DRIFT ${slug}: page $${price}, worker ${live[slug]} cents`); bad++; }
  }
  console.log(bad === 0 ? `OK: 15 QR files present, 15 prices match the live worker (${KITS.length} kits).` : `${bad} problem(s).`);
  process.exit(bad === 0 ? 0 : 1);
}

fs.writeFileSync(OUT, html);
console.log(`wrote ${OUT} (${KITS.length} kits, ${html.split('\n').length} lines)`);
