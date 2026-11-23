# futureonward.com

Website of **Future Onward OPC**, Bangladesh: solar EPC (industrial, residential, utility scale; purchase or investment + PPA), battery energy storage, electric commercial vehicles (with CHTC Kinwin) and EraseAI Firewall (with Vantward Solutions).

Static site served by GitHub Pages from `main` (custom domain in `CNAME`). No build step.

- `index.html` – the one-page story, SEO meta and JSON-LD
- `css/site.css`, `js/site.js` – styles, scroll animation, savings calculator, contact brief
- `images/partners/` – partner logos (CHTC Kinwin and Chuangang are shown as text marks until official logo files are added)
- `robots.txt`, `sitemap.xml`, `404.html`
- `service-worker.js` – removes the cache left by the old service worker; do not register a new one

Facts quoted on the page are listed with sources in the footer. Update the date in `sitemap.xml` and `dateModified` in the JSON-LD when content changes.
