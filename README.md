# Victor Homem Heck · portfolio

One static page (`index.html` + `style.css` + `site.js`); the "build" only copies the files to upload. Lives at https://shogosoftware.com.br, hosted on
Hostinger (Apache/LiteSpeed).

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
| `build.js` | Copies the files to upload into `dist/`. |
| `site.test.js` | `node --test`: copy button, every linked file exists, nothing the CSP would block, valid structured data, no domain placeholder left, the build has exactly the files to upload. |

## Test

```bash
node --test
```

## Build

```bash
node build.js        # copies the site files into dist/
cd dist && tar -a -c -f ../portfolio-hostinger.zip .htaccess 404.html favicon.svg fonts index.html og.png robots.txt site.js sitemap.xml style.css
```

Use Windows' `tar` (or any zip tool that writes `/` paths), not PowerShell's `Compress-Archive`: its backslash paths can
extract as files named `fonts\x.woff2`. CI also keeps `dist/` as the `portfolio-site-<sha>` artifact of each run.

## Deploy (Hostinger)

1. hPanel › the website for the domain must be a plain **"Empty PHP/HTML website"** (a Node.js/Next.js app on the same
   domain would keep serving instead of these files).
2. File Manager › `public_html` › upload `portfolio-hostinger.zip` › right-click › **Extract** into `public_html` (the files
   at its root, not in a subfolder) › delete the zip. Turn on "show hidden files" to see `.htaccess`.
3. Turn on the free SSL for the domain and `www`.
4. Check: `curl -I https://shogosoftware.com.br/` (200, `content-security-policy`), `curl -I http://www.shogosoftware.com.br/` (301 to
   `https://shogosoftware.com.br/`), `curl -I https://shogosoftware.com.br/nope` (404).
5. Share the link once in a LinkedIn draft (or opengraph.xyz) to see the preview card.

## Rebuild the preview image

```bash
"C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --hide-scrollbars --window-size=1200,630 \
  --virtual-time-budget=3000 --screenshot=og.png "file:///C:/git/portfolio/tools/og.html"
```
