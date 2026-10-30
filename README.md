# Victor Homem Heck · portfolio

One static page (`index.html` + `style.css` + `site.js`), no build step. Hosted on Hostinger (Apache/LiteSpeed).

| File | What |
| --- | --- |
| `index.html` | The portfolio (English). Head has the description, Open Graph preview and `Person` structured data. |
| `404.html` | Not-found page (`ErrorDocument` in `.htaccess`). |
| `style.css` | All styles; light/dark follow the system. |
| `site.js` | "Copy email" button (falls back to selecting the address). |
| `fonts/` | Bricolage Grotesque, IBM Plex Sans, JetBrains Mono (Latin, variable WOFF2, SIL Open Font License), self-hosted so no visitor data goes to a font CDN. |
| `favicon.svg`, `og.png` | Icon and the 1200×630 link preview. `og.png` is rendered from `tools/og.html`. |
| `robots.txt`, `sitemap.xml` | The site is meant to be indexed. |
| `.htaccess` | HTTPS + bare domain redirect, strict CSP (everything from this domain), security headers, caching, 404. |
| `site.test.js` | `node --test`: copy button, every linked file exists, nothing the CSP would block, valid structured data, no domain placeholder left. |

## Test

```bash
node --test
```

## Deploy (Hostinger)

1. hPanel › add a website for the domain as **"Empty PHP/HTML website"**.
2. Upload to `public_html`: `index.html`, `404.html`, `style.css`, `site.js`, `favicon.svg`, `og.png`, `robots.txt`,
   `sitemap.xml`, `.htaccess` and the `fonts/` folder. Not the rest (`tools/`, `.github/`, tests, README).
3. Turn on the free SSL for the domain and `www`.
4. Check: `curl -I https://<domain>/` (200, `content-security-policy`), `curl -I http://www.<domain>/` (301 to
   `https://<domain>/`), `curl -I https://<domain>/nope` (404).
5. Share the link once in a LinkedIn draft (or opengraph.xyz) to see the preview card.

## Rebuild the preview image

```bash
"C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --hide-scrollbars --window-size=1200,630 \
  --virtual-time-budget=3000 --screenshot=og.png "file:///C:/git/portfolio/tools/og.html"
```
