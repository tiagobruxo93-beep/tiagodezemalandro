# Google Search Console verification (meta tag)

## Goal

Prove ownership of **www.paitiagodezemalandro.com** to Google Search Console so the site can be indexed, using a meta verification tag instead of the HTML file.

## What changes

- The site's `<head>` gains one line: the Google verification tag you provided, with its exact content:
  `<meta name="google-site-verification" content="3maCRAx1rbuQ22olpyIQYx59cny6GeQcgHHBCPzS4Ak" />`
- No other markup, styling or behavior is touched.

## Scope

- [ ] Every page of the published site includes the verification tag in its head.
- [ ] The content string is copied exactly as given — Google fails verification if a single character differs.
- [ ] Existing titles, descriptions, social preview tags, fonts, robots rules, analytics and all pages behave exactly as they do today.

## Notes

- You enter the domain in Search Console, then click **Verify**; the tag only works once the change is live on www.paitiagodezemalandro.com, not on the preview URL.
- The HTML file you attached earlier is not needed with this method.
