// Run with: node --test   (no dependencies)
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { copyText } = require('./site.js');

const read = (f) => fs.readFileSync(path.join(__dirname, f), 'utf8');
const PAGES = ['index.html', '404.html'];

test('copying the email reports success', async () => {
  const written = [];
  const note = await copyText('a@b.c', { writeText: async (t) => { written.push(t); } }, () => assert.fail('no fallback'));
  assert.equal(note, 'Copied');
  assert.deepEqual(written, ['a@b.c']);
});

test('without clipboard access the address is selected instead', async () => {
  let selected = 0;
  const denied = { writeText: async () => { throw new Error('denied'); } };
  assert.equal(await copyText('a@b.c', denied, () => selected++), 'Selected. Press Ctrl+C to copy.');
  assert.equal(await copyText('a@b.c', undefined, () => selected++), 'Selected. Press Ctrl+C to copy.');
  assert.equal(selected, 2);
});

test('every local file a page links to exists', () => {
  for (const page of PAGES) {
    for (const [, ref] of read(page).matchAll(/(?:href|src)="(\/[^"#]*)"/g)) {
      if (ref === '/') continue;
      assert.ok(fs.existsSync(path.join(__dirname, ref)), `${page} links to missing ${ref}`);
    }
  }
  for (const [, ref] of read('style.css').matchAll(/url\("(\/[^"]+)"\)/g)) {
    assert.ok(fs.existsSync(path.join(__dirname, ref)), `style.css uses missing ${ref}`);
  }
});

test('pages have nothing the CSP would block: no inline scripts, styles or third-party assets', () => {
  for (const page of PAGES) {
    const html = read(page);
    assert.doesNotMatch(html, /\sstyle="/, `${page}: inline style attribute`);
    assert.doesNotMatch(html, /<style[\s>]/, `${page}: <style> block`);
    assert.doesNotMatch(html, /\son[a-z]+="/, `${page}: inline event handler`);
    for (const [tag] of html.matchAll(/<script\b[^>]*>/g)) {
      assert.ok(/src="\/[^"]+"/.test(tag) || tag.includes('application/ld+json'), `${page}: inline script ${tag}`);
    }
    assert.doesNotMatch(html, /(?:src|href)="https?:\/\/[^"]+\.(?:css|js|woff2?)"/, `${page}: third-party asset`);
  }
  const csp = read('.htaccess').match(/Content-Security-Policy "([^"]+)"/)[1];
  assert.doesNotMatch(csp, /https?:/, 'the CSP allows no other origin');
  assert.doesNotMatch(csp, /unsafe-inline/);
});

test('the structured data is valid JSON for a Person', () => {
  const json = read('index.html').match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];
  const person = JSON.parse(json);
  assert.equal(person['@type'], 'Person');
  assert.equal(person.name, 'Victor Homem Heck');
});

test('the domain is filled in everywhere (no __SITE_URL__ / __DOMAIN__ left)', () => {
  for (const f of ['index.html', 'robots.txt', 'sitemap.xml', '.htaccess']) {
    assert.doesNotMatch(read(f), /__SITE_URL__|__DOMAIN__/, `${f} still has a placeholder`);
  }
});

test('the site can be indexed', () => {
  assert.doesNotMatch(read('index.html'), /name="robots"/);
  assert.doesNotMatch(read('.htaccess'), /X-Robots-Tag/);
  assert.match(read('robots.txt'), /Allow: \//);
});
