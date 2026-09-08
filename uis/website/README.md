# Brasaland Public Website (Next.js)

Brasaland Milestone 1 corporate site — rebuilt for Milestone 4 as **Next.js + TypeScript** with reusable React components.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- EN/ES i18n via React context

## Setup

```bash
cd uis/website
npm install
```

## Run

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080).

## Routes

| Path | Purpose |
| ---- | ------- |
| `/` | Corporate landing (hero, story, locations, menu, Brasa Points, contact) |
| `/application` | Brasa Points registration form with validation |

## Legacy static M1

Original HTML/JS version archived at [`archive/ms-1-website-static/`](../../archive/ms-1-website-static/).

## Components

- `components/layout/` — header, footer
- `components/home/` — landing sections
- `components/forms/` — Brasa Points form
- `lib/i18n/` — typed translations
- `data/locations.ts` — location hierarchy for form dropdowns
