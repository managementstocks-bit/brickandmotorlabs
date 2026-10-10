# flyers/ - printable sheets (A4)

Print-ready sheets for the shop table and for schools and camps. Every file here is also served
from the site, so you can print from any device:

| Print this | Direct link | What it is |
|---|---|---|
| `table-kit.pdf` | https://brickandmotorlabs.com/flyers/table-kit.pdf | 5 sheets A4: order card, sign-up card, full price list, 15 per-kit scan cards (each code opens that exact kit page) |
| `schools-camps.pdf` | https://brickandmotorlabs.com/flyers/schools-camps.pdf | 1 sheet A4: one-pager for a teacher, camp director or group leader (code goes to the contact form) |
| `price-stickers.pdf` | https://brickandmotorlabs.com/flyers/price-stickers.pdf | 1 sheet A4: 15 price tags, 3 x 5, cut on the dashed line |

Previews (`preview-*.png`) are for looking on a screen before you spend paper.

## Print settings

A4, portrait, colour, **scale 100% / "Actual size"**. Never "Fit to page" - shrinking the page
shrinks the QR modules and phones stop reading them. If your printer is not borderless, trim the
5 mm white edge instead of scaling.

## Verified

Generated 2026-10-05, re-verified 2026-10-06 after font and layout fixes:

- All 20 QR codes decode from the **rendered PDF at 300 dpi**, each to its intended URL.
- Every code sits fully inside the sheet; smallest module is **0.81 mm** (kit cards, 30 mm codes) - comfortable for a phone camera.
- Text is embedded as **subsetted CID TrueType Inter**, not bitmap (Type 3) glyph runs, so it stays crisp at 600 dpi.
- Prices and ages come from the live price feed and the maker-confirmed age labels: 3+ (Queaky Charge - Sleepy), 5+ (Bike, Ferris Wheel, Blix Buddy), 8+ for the rest.

## Flyer sources in this folder

- `flyer.html` — main A4 product flyer (source of truth; live at /flyers/flyer.html)
- `flyer-social-october.html` — 1080×1350 social post canvas (same events, for FB/IG)
- `logo.png` — brick+gear brand mark used by both flyer canvases
- `qrcode.png` — QR to the homepage (used on the flyer)

## If a price changes

The table-kit / schools-camps / price-stickers source HTML and the build/QC scripts are kept with
the working print setup (not in this repo, because a rendered PDF is a build artifact and the
render tooling pulls site images):

```
cd /workspace/temp/money
node gen-stickers.mjs                        # rebuild price-stickers.html from kit-data.json
node flyer-render/render/render-kit.mjs      # table-kit.pdf + overflow / broken-image checks
node flyer-render/render/render-extras.mjs   # schools-camps.pdf + price-stickers.pdf
./flyer-render/recompress.sh                 # 300 ppi at print size (6.8 MB -> 635 KB for table-kit)
node flyer-render/qc/qr-print-report.mjs     # decode every code out of the PDFs at 300 dpi -> PRINT QC: PASS
pdffonts flyers/table-kit.pdf                # want CID TrueType, emb sub uni = yes yes yes
```

The recompression step is not optional if these files are going into this folder: Chromium writes the kit photos at their source resolution (~1280 ppi when a 1000 px photo is drawn at 20 mm), which is 4x more than a printer can resolve. Recompress to 300 ppi, then run the QC and a 300-dpi crop compare against the uncompressed render (expect 0 differing pixels) before committing. Copy the recompressed files here so the working print copies and the public ones are the same bytes.

## Family Bazaar price sheet (`/family-bazaar.html`) — internal, not linked

`../family-bazaar.html` is the **internal** price + QR sheet: 15 kits, name / price /
age / 36 mm QR, no descriptions, no links to the page. It prints as **one A4 sheet**
(3 x 5 grid) and is deliberately not linked from `events.html`, not in `sitemap.xml`,
`noindex, nofollow`, and `robots.txt` has `Disallow: /family-bazaar.html`.

Rebuild it after any price change (prices come from the live worker, so the sheet
cannot drift from Stripe):

```
node flyers/gen-bazaar-sheet.mjs          # rewrites family-bazaar.html from the kit table
node flyers/gen-bazaar-sheet.mjs --check  # 15 QR pngs present + prices match live /api/prices
```

Verified 2026-10-09: the generator reproduces the committed page byte-for-byte from any
working directory, and the print render is 1 A4 page (cards 103 x 42 mm, QR 36 mm, grid
224 mm + 15 mm event bar inside a 281 mm printable height). QR PNGs are the tracked
`images/qrcodes/bazaar-*.png`; all 15 decode to their product pages. `bazaar-events.png`
and `bazaar-subscribe.png` are kept for printed cards but no longer appear on the sheet.
