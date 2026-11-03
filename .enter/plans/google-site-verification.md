# Google Search Console verification

## Goal

Make the site verifiable by Google Search Console using the verification file you attached, so Google can confirm ownership of the domain and start indexing it.

## What changes

- Publish the file `googleed6043b2784ad77a.html` at the site root, at the exact address Google will check: `https://<your-domain>/googleed6043b2784ad77a.html`.
- The file keeps its exact content (`google-site-verification: googleed6043b2784ad77a.html`) and exact name — Google rejects any alteration, prefix, or redirect.

## Scope

- [ ] The verification file is added to the public assets so it is served from the site root, unchanged, with the exact filename.
- [ ] Existing pages, styles, robots rules and analytics keep working exactly as they do today.
- [ ] Nothing else is added — no sitemap, no meta tag, no new routes.

## Notes

- Verification only succeeds after the site is published at the domain you entered in Search Console; the file does nothing on the preview URL.
- If you would rather verify with a meta tag instead of a file, say so and I will add the `<meta name="google-site-verification">` tag to the page head instead.
