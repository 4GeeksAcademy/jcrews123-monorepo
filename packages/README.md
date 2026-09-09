# `packages` folder

Shared packages for the monorepo: internal libraries, types, and reusable code consumed by multiple apps, services, or scripts.

Each subfolder is **one versionable package** with its own README.

## Packages

| Package | Language | Consumers | Description |
|---------|----------|-----------|-------------|
| [`shared/`](./shared/) | TypeScript | Frontends (future) | `@repo/shared-types` — shared TS types |
| [`incident-analysis/`](./incident-analysis/) | Python | `scripts/analyze.py`, `services/api/` | Brasaland incident CSV validation, metrics, console report, CSV export |

Add new packages here when logic is shared across two or more deliverables — do not duplicate business rules in CLI and API separately.

> _Spanish version: [README.es.md](./README.es.md)._
