# flyers/builds/ — printable kit build pages (2026-10-15)

Local-only print pack (gitignored). Full detail pages for all 18 kits, rendered from the
live site — meant for showing people at events instead of (or alongside) QR scanning.

## Print this

| File | What it is |
|---|---|
| `all_builds_booklet.pdf` | **One print job**: 45 pages = overview page + all 18 build pages (alphabetical). Duplex prints as ~23 sheets. |
| `00_all_kits_overview.pdf` | 1 page: all 18 kits at a glance (photo, name, age, parts, price CAD). Table handout. |
| `<slug>.pdf` | 2–3 pages each: that kit's full build page (hero, what you'll learn, models, parts). Print only the kits you bring. |
| `autumn-bazaar-registration-qr.png` | QR to the Autumn Bazaar '26 workshop registration form (forms.gle/UoMA5fH5d7ZqD8T5A). |

## Regenerate (when kit pages/prices change)

Pipeline in `src/` (uses local chromium via playwright-core):
```
node src/print_builds.js    # 18 build-page PDFs -> pdf/ (hides nav/footer/CTA buttons, adds printed URL line)
node src/scrape_meta.js     # -> src/build_meta.json (name/age/parts/price/photo per kit)
node src/make_index.js      # -> 1-page overview
pdfunite 00_all_kits_overview.pdf <slugs…> all_builds_booklet.pdf
```
`src/build_urls.txt` = the 18 build URLs (mirrors sitemap.xml).

## Render notes (2026-10-17)
- Letter format (US/Canada paper), 12mm margins, `printBackground: true`, scale 0.92.
- Site chrome stripped before printing: `.navbar`, `.footer`, `.build-nav`, all `.btn`/`.build-cta`
  ("Back to All Kits", "Watch Demo", "Add to Cart" are dead on paper). A small printed line
  `brickandmotorlabs.com/builds/<slug>` replaces the buttons.
- Booklet re-compressed with ghostscript `-dPDFSETTINGS=/prepress` (23 MB -> 4.5 MB, 45 pp verified);
  overview 7.5 -> 0.4 MB. Pack total ~20 MB.
- Overview is Letter, 1 page: 3x6 card grid, real scraped prices/ages/parts (18 kits, 2026-10-17).
- **Served by the site** (committed 2026-10-17 per owner): direct print links in `flyers/README.md`.
  To go local-only again: add `flyers/builds/` back to `.gitignore` + `git rm -r --cached flyers/builds`.
