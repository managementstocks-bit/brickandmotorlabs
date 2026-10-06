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

## If a price changes

The source HTML and the build/QC scripts are kept with the working print setup (not in this repo,
because a rendered PDF is a build artifact and the render tooling pulls site images):

```
cd /workspace/temp/money
node gen-stickers.mjs                        # rebuild price-stickers.html from kit-data.json
node flyer-render/render/render-kit.mjs      # table-kit.pdf + overflow / broken-image checks
node flyer-render/render/render-extras.mjs   # schools-camps.pdf + price-stickers.pdf
node flyer-render/qc/qr-print-report.mjs     # decode every code out of the PDFs at 300 dpi -> PRINT QC: PASS
pdffonts flyers/table-kit.pdf                # want CID TrueType, emb sub uni = yes yes yes
```

Then copy the three PDFs into this folder and commit them here.
