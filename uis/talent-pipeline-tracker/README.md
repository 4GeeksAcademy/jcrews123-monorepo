# Talent Pipeline Tracker · Brasaland

Internal People & Talent tool for tracking **Executive Assistant** candidates at Brasaland corporate headquarters (Medellín). Replaces the shared Google Sheet Ashley’s team was using.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- React hooks only (no Redux / Zustand)

## Setup

```bash
cd uis/talent-pipeline-tracker
npm install
```

Create `.env.local` (already provided in local setup):

```env
NEXT_PUBLIC_API_URL=https://playground.4geeks.com/tracker/api/v1
```

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Path | Purpose |
| ---- | ------- |
| `/` | Candidate list with status/stage filters and name/email search |
| `/candidates/[id]` | Detail, status/stage update, internal notes |
| `/candidates/new` | Register a candidate |
| `/candidates/[id]/edit` | Edit candidate data |

## Folder layout

- `app/` — routes
- `components/` — UI by concern (`candidates`, `detail`, `forms`, `feedback`, `layout`, `badges`)
- `hooks/` — async data hooks (`useCandidates`, `useCandidate`, `useNotes`)
- `lib/api/` — API client
- `lib/labels/` — human-readable status/stage labels
- `types/` — TypeScript models

## API docs

[https://playground.4geeks.com/tracker/api/v1/docs](https://playground.4geeks.com/tracker/api/v1/docs)
