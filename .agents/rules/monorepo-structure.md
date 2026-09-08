# Monorepo structure

**Scope:** Always active — applies to every agent session in this repository.

## Folder ownership

| Folder | Contents |
|--------|----------|
| `uis/` | User-facing frontends only |
| `services/` | Backend APIs and background workers |
| `apps/` | Standalone utilities or apps that are not shared UI/API |
| `agents/` | Product agents for the company (later modules) |
| `skills/` | Product skill integrations (later modules) |
| `.agents/` | Dev-tool configuration — rules and skills for coding agents |
| `memory-bank/` | Living project context for agents |
| `archive/` | Milestone plans and historical reference — not runtime code |

## Rules

1. Read the `README.md` inside a folder before creating files there.
2. Do not create new top-level folders without developer approval.
3. Do not confuse `.agents/` (dev-tool config) with `/agents` (product code).
4. Each UI application gets its own subfolder under `uis/` with its own README and dev command.
5. Do not duplicate the same app in multiple locations — one canonical path per concern.

## When unsure

Stop and ask the developer rather than inventing a new folder or moving existing apps.
