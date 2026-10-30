// Collects the files Hostinger serves into dist/ (nothing from the repo that isn't part of the site).
// Run with: node build.js   (no dependencies). Then upload dist/ (or the zip made from it) to public_html.
const fs = require('node:fs');
const path = require('node:path');

const FILES = ['index.html', '404.html', 'style.css', 'site.js', 'favicon.svg', 'og.png', 'robots.txt', 'sitemap.xml', '.htaccess'];
const DIRS = ['fonts'];

function build(root = __dirname, out = path.join(__dirname, 'dist')) {
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  for (const f of FILES) fs.copyFileSync(path.join(root, f), path.join(out, f));
  for (const d of DIRS) fs.cpSync(path.join(root, d), path.join(out, d), { recursive: true });
  return out;
}

if (require.main === module) {
  const out = build();
  console.log(`dist ready: ${out}`);
}

module.exports = { build, FILES, DIRS };
