# Brasaland Public Website

Brasaland Milestone 1 — corporate landing page and Brasa Points registration form.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Landing page with brand sections, Schema.org, SEO |
| `application.html` | Brasa Points loyalty registration form |
| `validation.js` | Client-side form validation (real-time + submit) |
| `js/dropdowns.js` | Country → City → Location cascading selects |
| `js/i18n.js` | English/Spanish language switcher |
| `js/main.js` | Mobile navigation and smooth scroll |
| `data/locations.js` | 14 restaurant locations data |
| `i18n/en.json` | English translations |
| `i18n/es.json` | Spanish translations |

## Run locally

From this directory (`uis/website/`):

```bash
npm run dev
```

Or directly:

```bash
npx http-server . -p 8080 -a 0.0.0.0
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

Compatible with GitHub Codespaces — forward port 3000 when prompted.

## Pages

- **Landing:** `/index.html` — Hero, Our Story, Locations, Menu, Brasa Points, Contact
- **Registration:** `/application.html` — Brasa Points signup form with validation

## Features

- Tailwind CSS (CDN), mobile-first responsive design
- Bilingual EN/ES with language switcher (preference saved in localStorage)
- WCAG AA: semantic HTML, labels, ARIA errors, keyboard navigation, skip link
- Schema.org Restaurant JSON-LD on landing page
- Simulated form submission with success message

## Deployment

Deploy the `uis/website/` folder to Vercel or any static host. Run PageSpeed Insights on the deployed URL (target score ≥ 80).
