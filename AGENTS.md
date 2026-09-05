# BrickAndMotorLabs.com - Project Memory

## Overview
- Static HTML/CSS/JS website for Blix STEM robotics kits company
- Target audience: Kids ages 3+ and parents/educators
- Hosting: GitHub Pages (https://brickandmotorlabs.com/)
- Repo: https://github.com/managementstocks-bit/brickandmotorlabs
- GitHub PAT: (stored in git credential helper, not in file)
- Namecheap DNS points to GitHub Pages
- No Docker for production (Dockerfile is for local dev only)

## Tech Stack
- Pure HTML/CSS/JS (no frameworks, no build tools)
- Single shared `style.css` and `script.js` across all pages
- Inter font from Google Fonts
- CSS custom properties for theming
- WebP images with `<picture>` fallbacks (15 WebP files in images/)
- Google Analytics 4: G-VJJ1KVW9LM

## File Structure
```
BrickAndMotorLabs.com/
├── index.html          # Landing page with product grid, filter, sort
├── 404.html            # Branded 404 (served automatically by GitHub Pages)
├── about.html          # Company story
├── events.html         # Events page
├── contact.html        # Contact form (email-first ordering)
├── privacy.html        # Privacy policy
├── shipping.html       # Shipping info
├── faq.html            # FAQ with accordion
├── robots.txt          # Robots.txt with sitemap reference
├── sitemap.xml         # Sitemap with all 22 pages
├── style.css           # Shared styles
├── script.js           # Shared JS (nav, filter, sort, form, FAQ, animations)
├── validate.js         # Validation script
├── Dockerfile          # Local dev only
├── .gitignore
├── builds/             # 15 individual product/build pages
│   ├── bike.html
│   ├── ferris-wheel.html
│   ├── queaky-charge.html
│   ├── buddy.html
│   ├── crawlers.html
│   ├── rover.html
│   ├── gear-box.html
│   ├── forklift-power.html
│   ├── power-screw.html
│   ├── marble-run-2.html
│   ├── rc-explorers.html
│   ├── rc-rover.html
│   ├── amusement-park.html
│   ├── discovering-motions.html
│   └── rc-megastructures.html
└── images/             # Original images + 15 .webp files
```

## Product Catalog (15 kits, sorted by price low-to-high)
1. Blix Minis Bike - $12.78 CAD, Age 5+, 45+ parts
2. Blix Minis Ferris Wheel - $12.78 CAD, Age 5+, 50+ parts
3. Queaky Charge - $24.99 CAD, Age 3+
4. Blix Buddy - $28.40 CAD, Age 5+, 61 parts
5. Blix Crawler - $49.70 CAD, Age 8+, 70+ parts
6. Blix Rover - $53.96 CAD, Age 8+, 150+ parts
7. Blix Gear Box - $69.57 CAD, Age 8+, 100+ parts
8. Forklift Power - $76.68 CAD, Age 8+, 180+ parts
9. Power Screw - $80.93 CAD, Age 8+, 200+ parts
10. Blix Marble Run 2 - $107.92 CAD, Age 8+, 220+ parts
11. RC Explorers - $115.02 CAD, Age 8+, 120+ parts
12. RC Rover - $115.02 CAD, Age 8+, 180+ parts
13. Amusement Park - $115.02 CAD, Age 8+, 340+ parts
14. Blix Discovering Motions - $134.90 CAD, Age 8+, 176 parts
15. RC Megastructures - $268.38 CAD, Age 8+, 750+ parts

## Key Features
- Landing page: Product grid with age filter (All/3+/5+/8+) and price sort (low-high default, high-low option)
- Build pages: Product image, description, specs (age/parts/price), "What You'll Learn" section, "Back to All Kits" button, "Watch Demo" button (YouTube), prev/next navigation (price-sorted order)
- Contact form: Email validation, success/error messages
- FAQ: Accordion (one-at-a-time)
- Scroll reveal animations via IntersectionObserver
- SEO: Title tags, meta descriptions, canonical URLs, OG tags, Twitter cards, JSON-LD schema on index
- Accessibility: Skip-link, :focus-visible, ARIA labels, semantic HTML

## Ordering Process
- Two paths: (1) **card checkout** — Add to Cart → Stripe hosted checkout (see E-Commerce below); (2) **contact-first / Interac e-Transfer** — price links and the cart drawer both offer "order by email", kept for customers who prefer e-transfer
- No "free shipping" claims on site

## E-Commerce (Phase 1) — Stripe Checkout via Cloudflare Worker
- ⚠️ **THIS WORK IS ON `feat/checkout-payments` — NOT MERGED TO MAIN.** Do not merge until: (1) real kit weights → update `SHIPPING_CONFIG` secret, (2) user tests the full checkout flow in browser. Worker is already deployed live (worker secrets are independent of git).
- Cart UI lives in `script.js` (catalog constant, drawer, localStorage `bml_cart`). Add-to-Cart buttons are injected on the 15 product cards and 15 build pages — no per-page HTML needed.
- Checkout API is a Cloudflare Worker — source in PRIVATE repo `managementstocks-bit/brickandmotorlabs-worker` (main branch; NOT in this repo):
  - `POST /api/checkout` — creates a Stripe Checkout Session from the cart (multi-kit), returns session URL
  - `POST /api/webhook` — verifies Stripe signature, logs paid orders
  - `GET /api/health`
- Config via env/secrets (see `api/wrangler.toml` in the private worker repo): `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `PRICE_MAP` (slug→price_ ID), `SHIPPING_OPTIONS` (flat CAD rates), `CHECKOUT_SUCCESS_URL`, `CHECKOUT_CANCEL_URL`, `ALLOWED_ORIGINS`.

### Stripe setup (do once)
1. Create account at stripe.com (Canada). Complete identity + bank + tax info.
2. Dashboard → Products → create one product per kit with a CAD one-time Price (amount = kit price in cents). Copy each `price_...` ID into `PRICE_MAP`.
3. Dashboard → Developers → Webhooks → Add endpoint `https://<your-worker>/api/webhook`, subscribe to `checkout.session.completed`, copy the `whsec_...` signing secret.
4. Set statement descriptor / business name in Settings so it shows on card statements.
5. Test in Test mode first (test key `sk_test_...`, card `4242 4242 4242 4242`); then flip to Live keys.
6. Payment methods enabled automatically (cards, Apple Pay, Google Pay). Interac e-Transfer stays manual on our side (email path).

### Cloudflare deploy
```
cd api
npm i -g wrangler && wrangler login
wrangler deploy
wrangler secret put STRIPE_SECRET_KEY
wrangler secret put STRIPE_WEBHOOK_SECRET
wrangler secret put PRICE_MAP
wrangler secret put SHIPPING_OPTIONS
```
Optional (recommended): put brickandmotorlabs.com on Cloudflare DNS so the Worker runs on the same domain (`/api/*`, no CORS). Otherwise host on `*.workers.dev` and set `BML_API_BASE` in script.js.

### Shipping
- Phase 1: flat rates in `SHIPPING_OPTIONS` (default: Standard Canada Post $12.00, 5–9 business days). Update after measuring kits + checking Canada Post rates.
- Phase 2 (IN PROGRESS, 2026-08-26): 2-step checkout built — cart asks postal code → `POST /api/rates` → live Canada Post quotes (Rating 4.0.0 REST/JSON, OAuth2) → user picks → `POST /api/checkout` re-quotes server-side (amount can't be tampered). Worker falls back to SHIPPING_CONFIG/SHIPPING_OPTIONS when CP keys absent. Needs: user creates Developer Portal account → Test app keys (`CP_CLIENT_ID`/`CP_CLIENT_SECRET` secrets) → then Production app. Kit weights/dims live in `api/src/canadapost.js` in the PRIVATE worker repo (`KIT_PARAMS`); the origin postal code is set via the `CP_ORIGIN` worker secret (value lives only in the private worker repo / Cloudflare dashboard — never commit it here).
- Hand delivery option (built 2026-08-26): `api/src/handdelivery.js` (PRIVATE worker repo) — $5 flat, id `HAND.DELIVERY`, offered when postal code FSA is in zone lists: Ottawa Area (FSAs within 30km of the Ottawa-area origin address — covers Ottawa, Kanata, Orleans, Kars, Stittsville, Gatineau west) and GTA (city coverage around the GTA origin address — Mississauga, S Brampton, Oakville, Milton, Etobicoke, W Toronto). FSA lists derived from GeoNames centroids + 5km buffer (anchor addresses live only in the private worker repo); override via `HAND_DELIVERY_CONFIG` secret.

## YouTube Demo Videos
- Bike: https://www.youtube.com/watch?v=KsnRgw7CJBM
- Ferris Wheel: https://www.youtube.com/watch?v=iiLmrAEs_G4
- Queaky Charge: https://www.youtube.com/watch?v=6bcL4xkWFyg
- Blix Buddy: https://www.youtube.com/watch?v=JikTX5-Lpa4
- Crawler: https://www.youtube.com/watch?v=cPoskmlzszY
- Rover: https://www.youtube.com/watch?v=teOLC33eUdE
- Gear Box: https://www.youtube.com/watch?v=__i8lnySPdk
- Forklift Power: https://www.youtube.com/watch?v=4HhDFlixjYs
- Power Screw: https://www.youtube.com/watch?v=38AioA78VXs
- Marble Run 2: https://www.youtube.com/watch?v=2qDj7rsl6mM
- RC Explorers: https://www.youtube.com/watch?v=BnafTHQzZvw
- RC Rover: https://www.youtube.com/watch?v=FlpMFRt1bC8
- Amusement Park: https://www.youtube.com/watch?v=8HPHd5AGhm0
- Discovering Motions: https://www.youtube.com/watch?v=d-bz_nbVJwc
- RC Megastructures: https://www.youtube.com/watch?v=_D-ln4IxVIc
- Thumbnails: local `images/youtube-<slug>.jpg` (copied from `.vision/<slug>/thumb_maxresdefault.jpg`)

## Build Page Navigation Order
Build pages have prev/next links sorted by price (low-to-high), matching landing page default sort.
- bike.html (1) → ferris-wheel.html (2) → queaky-charge.html (3) → ... → rc-megastructures.html (15)
- First page has "First Kit" disabled, last page has "Last Kit" disabled

## Validation
- Run `node validate.js` to check all 22 HTML files
- Checks: internal links, image refs, HTML structure, WebP elements, CSS braces, JS syntax, new files, Dockerfile

## Git Workflow
- Branch: main
- Remote: https://github.com/managementstocks-bit/brickandmotorlabs.git
- Push: `git remote set-url origin https://<YOUR_PAT>@github.com/managementstocks-bit/brickandmotorlabs.git && git push` (use a GitHub PAT with repo scope)
- GitHub Pages deploys automatically on push to main

## Recent Changes
1. Updated all 15 build pages with product descriptions from PDF
2. Fixed build page navigation order to match landing page price sort
3. Added missing "Watch Demo" buttons to Ferris Wheel and Marble Run 2 pages
4. Fixed wrong ages in titles/meta (bike 5+, forklift-power & rc-megastructures 8+); added `offers` + real product images to Product JSON-LD and OG tags on all 15 build pages
5. Build pages now serve WebP via `<picture>` (was PNG/JPG originals up to 921 KB); fonts moved from CSS @import to `<link>` in head
6. Removed dead "Featured" sort option; hamburger menu now has aria-expanded/controls + Escape/outside-click close
7. Created 404.html; updated sitemap lastmod to 2026-08-24; gitignored .vision/ + dev scripts
8. ⚠️ `update-pages.js` is DESTRUCTIVE (wipes GA/JSON-LD/OG images) — see warning at top of file; prefer editing pages directly

## All changes validated (node validate.js, 0 errors) and pushed to production (commit 56f7baa).
