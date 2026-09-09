# `services` folder

All backend services (APIs and background workers) for the Brasaland Digital monorepo.

Each subfolder is **one service** with its own README, run instructions, and dependencies.

## Services

| Service | Path | Port | Description |
|---------|------|------|-------------|
| **Brasaland API** | [`api/`](./api/) | 8000 | FastAPI — incident CSV analysis (`POST /api/incidents/analyze`, `GET /api/incidents/results/export`). First backend service; inventory and other domains will extend this app later. |

See [`api/README.md`](./api/README.md) for setup and endpoints.

> _Spanish version: [README.es.md](./README.es.md)._
