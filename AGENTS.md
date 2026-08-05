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
- Google Analytics 4: G-9VZK4GZM4K

## File Structure
```
BrickAndMotorLabs.com/
├── index.html          # Landing page with product grid, filter, sort
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
3. Queaky Charge - $24.99 CAD, Age 5+
4. Blix Buddy - $28.40 CAD, Age 8+, 61 parts
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
- Contact-first: No payment setup yet
- Customers click price → goes to contact.html
- Customers email for shipping quotes
- No "free shipping" claims on site

## YouTube Demo Videos
- Bike: https://www.youtube.com/watch?v=KsnRgw7CJBM
- Ferris Wheel: https://www.youtube.com/watch?v=iiLmrAEs_G4
- Marble Run 2: https://www.youtube.com/watch?v=2qDj7rsl6mM
- Others: Check individual build pages

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
4. All changes validated and deployed to production
