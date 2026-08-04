const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const buildDir = path.join(DIR, 'builds');
const buildFiles = fs.readdirSync(buildDir).filter(f => f.endsWith('.html'));

for (const file of buildFiles) {
  const filePath = path.join(buildDir, file);
  let html = fs.readFileSync(filePath, 'utf8');

  // Fix cross-build links: ../queaky-charge.html -> ../builds/queaky-charge.html
  html = html.replace(
    /href="\.\.\/([a-z-]+\.html)"/g,
    (match, name) => {
      // If the file exists in builds/, use ../builds/
      if (fs.existsSync(path.join(buildDir, name))) {
        return `href="../builds/${name}"`;
      }
      return match;
    }
  );

  // Fix main-content ID if missing
  if (!html.includes('id="main-content"')) {
    html = html.replace('<section class="hero">', '<section class="hero" id="main-content">');
  }

  fs.writeFileSync(filePath, html, 'utf8');
}

console.log('Fixed cross-build links and main-content IDs');
