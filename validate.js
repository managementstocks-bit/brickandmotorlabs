const fs = require('fs');
const path = require('path');

const DIR = __dirname;
let errors = 0;
let warnings = 0;

// Get all HTML files
function getAllHtml(dir, prefix = '') {
  let files = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      files = files.concat(getAllHtml(full, prefix + f + '/'));
    } else if (f.endsWith('.html')) {
      files.push(prefix + f);
    }
  }
  return files;
}

const allHtml = getAllHtml(DIR);
console.log(`Found ${allHtml.length} HTML files\n`);

// Check 1: Internal .html links
console.log('=== CHECK 1: Internal HTML Links ===');
for (const htmlFile of allHtml) {
  const filePath = path.join(DIR, htmlFile);
  const content = fs.readFileSync(filePath, 'utf8');
  const dir = path.dirname(filePath);
  const links = content.match(/href="([^"]+\.html)"/g) || [];
  for (const link of links) {
    const target = link.match(/href="([^"]+)"/)[1];
    // Skip absolute URLs (canonical, OG, etc.)
    if (target.startsWith('http')) continue;
    const targetPath = path.resolve(dir, target);
    if (!fs.existsSync(targetPath)) {
      console.log(`  BROKEN: ${htmlFile} -> ${target}`);
      errors++;
    }
  }
}
if (errors === 0) console.log('  All internal links OK');
console.log('');

// Check 2: Image references
console.log('=== CHECK 2: Image References ===');
for (const htmlFile of allHtml) {
  const filePath = path.join(DIR, htmlFile);
  const content = fs.readFileSync(filePath, 'utf8');
  const dir = path.dirname(filePath);
  const imgs = content.match(/src="([^"]+\.(png|jpg|jpeg))"/gi) || [];
  for (const img of imgs) {
    const target = img.match(/src="([^"]+)"/i)[1];
    const targetPath = path.resolve(dir, target);
    if (!fs.existsSync(targetPath)) {
      console.log(`  MISSING: ${htmlFile} -> ${target}`);
      errors++;
    }
  }
}
if (warnings === 0 && errors === 0) console.log('  All image references OK');
console.log('');

// Check 3: HTML structure
console.log('=== CHECK 3: HTML Structure ===');
for (const htmlFile of allHtml) {
  const filePath = path.join(DIR, htmlFile);
  const content = fs.readFileSync(filePath, 'utf8');

  if (!content.includes('<!DOCTYPE html>')) {
    console.log(`  MISSING DOCTYPE: ${htmlFile}`);
    errors++;
  }
  if (!content.includes('<html lang="en">')) {
    console.log(`  MISSING lang="en": ${htmlFile}`);
    errors++;
  }
  if (!content.includes('<title>')) {
    console.log(`  MISSING title: ${htmlFile}`);
    errors++;
  }
  if (!content.includes('<meta name="viewport"')) {
    console.log(`  MISSING viewport: ${htmlFile}`);
    errors++;
  }
  if (!content.includes('style.css')) {
    console.log(`  MISSING style.css: ${htmlFile}`);
    errors++;
  }
  if (!content.includes('script.js')) {
    console.log(`  MISSING script.js: ${htmlFile}`);
    errors++;
  }
  if (!content.includes('skip-link')) {
    console.log(`  MISSING skip-link: ${htmlFile}`);
    errors++;
  }
  if (!content.includes('id="main-content"')) {
    console.log(`  MISSING main-content: ${htmlFile}`);
    errors++;
  }
  if (!content.includes('canonical')) {
    console.log(`  MISSING canonical: ${htmlFile}`);
    errors++;
  }
}
if (errors === 0) console.log('  All structure checks passed');
console.log('');

// Check 4: WebP picture elements
console.log('=== CHECK 4: WebP Picture Elements ===');
let pictureCount = 0;
for (const htmlFile of allHtml) {
  const filePath = path.join(DIR, htmlFile);
  const content = fs.readFileSync(filePath, 'utf8');
  const pics = (content.match(/<picture>/g) || []).length;
  pictureCount += pics;
}
console.log(`  Total <picture> elements: ${pictureCount}`);
console.log('');

// Check 5: CSS file validity
console.log('=== CHECK 5: CSS Validity ===');
const css = fs.readFileSync(path.join(DIR, 'style.css'), 'utf8');
const openBraces = (css.match(/{/g) || []).length;
const closeBraces = (css.match(/}/g) || []).length;
if (openBraces === closeBraces) {
  console.log(`  Braces balanced (${openBraces} pairs)`);
} else {
  console.log(`  BRACE MISMATCH: ${openBraces} open vs ${closeBraces} close`);
  errors++;
}
console.log('');

// Check 6: JS file validity
console.log('=== CHECK 6: JS Validity ===');
const js = fs.readFileSync(path.join(DIR, 'script.js'), 'utf8');
try {
  new Function(js);
  console.log('  JavaScript syntax OK');
} catch (e) {
  console.log(`  JS SYNTAX ERROR: ${e.message}`);
  errors++;
}
console.log('');

// Check 7: New files exist
console.log('=== CHECK 7: New Files ===');
const required = ['robots.txt', 'sitemap.xml', 'privacy.html', 'shipping.html', 'faq.html'];
for (const f of required) {
  if (fs.existsSync(path.join(DIR, f))) {
    console.log(`  ${f} exists`);
  } else {
    console.log(`  MISSING: ${f}`);
    errors++;
  }
}
console.log('');

// Check 8: Dockerfile
console.log('=== CHECK 8: Dockerfile ===');
const dockerfile = fs.readFileSync(path.join(DIR, 'Dockerfile'), 'utf8');
if (dockerfile.includes('COPY images')) {
  console.log('  Images COPY present');
} else {
  console.log('  MISSING: images COPY in Dockerfile');
  errors++;
}
if (dockerfile.includes('privacy.html')) {
  console.log('  New pages in Dockerfile');
} else {
  console.log('  MISSING: new pages in Dockerfile');
  errors++;
}
console.log('');

// Summary
console.log('=== SUMMARY ===');
console.log(`  Total files checked: ${allHtml.length}`);
console.log(`  Errors: ${errors}`);
console.log(`  ${errors === 0 ? 'ALL CHECKS PASSED!' : 'ISSUES FOUND - fix before deploying'}`);
