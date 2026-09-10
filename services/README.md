# `services` folder

All backend services (APIs and background workers) for the Brasaland Digital monorepo.

Each subfolder is **one service** with its own README, run instructions, and dependencies.

## Services

| Service | Path | Port | Description |
|---------|------|------|-------------|
| **Brasaland API** | [`api/`](./api/) | 8000 | FastAPI — incidents, suppliers, auth, inventory (`/inventory`). TinyDB + Supabase dual DB. |

See [`api/README.md`](./api/README.md) for setup and endpoints.

> _Spanish version: [README.es.md](./README.es.md)._
