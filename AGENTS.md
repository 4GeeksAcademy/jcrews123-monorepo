# Agent Delivery Protocol — Brasaland Digital Monorepo

This file defines how coding agents must operate in this repository. Follow it before every commit.

## Session startup — required reading

At the start of each session, read these files in order:

1. [`CONTEXT.md`](CONTEXT.md) — company briefing and domain constraints
2. [`memory-bank/projectbrief.md`](memory-bank/projectbrief.md) — business objectives and department needs
3. [`memory-bank/techContext.md`](memory-bank/techContext.md) — stack, folder layout, port conventions
4. [`memory-bank/progress.md`](memory-bank/progress.md) — current state and active work

When working inside a specific app, also read that app's `README.md` and any app-local `CONTEXT.md`.

## Pre-commit workflow

Complete these steps in order before every commit:

1. **Confirm scope** — Verify the task aligns with `memory-bank/progress.md` and `CONTEXT.md`. Do not modify protected paths without explicit developer approval.
2. **Follow conventions** — Place code in the correct folder per [`uis/README.md`](uis/README.md) and sibling folder guides. Match existing naming and patterns in the target app.
3. **Verify changes** — Run checks for affected apps:
   - `uis/website`: `npm run dev`, confirm HTTP 200 on `/`
   - `uis/backoffice`: `npm run dev`, `npm run lint`
   - `uis/talent-pipeline-tracker`: only when that app is in scope
   - `apps/operations`: `npm run typecheck` when touched
4. **Update progress** — Edit [`memory-bank/progress.md`](memory-bank/progress.md) with what was completed and what is next.
5. **Commit deliberately** — Stage only relevant files. Write a commit message that explains *why*, not just *what*.

## Protected paths

Do **not** modify these without explicit developer confirmation:

| Path | Reason |
|------|--------|
| `CONTEXT.md` | Company source of truth |
| `memory-bank/` | Except `progress.md` updates as part of delivery |
| `.agents/` | Agent rules and skills — changes affect all sessions |
| `apps/operations/node_modules/` | Committed vendor tree — never edit |
| Another app's folder | When the task is scoped elsewhere (e.g. do not edit `talent-pipeline-tracker/` during backoffice work) |

## Folder quick reference

| Need | Location |
|------|----------|
| Public website | `uis/website/` |
| Internal admin UI | `uis/backoffice/` |
| HR candidate tracker | `uis/talent-pipeline-tracker/` |
| Backend APIs | `services/` |
| Dev-tool agent config | `.agents/` |
| Product agents (later) | `agents/` |

## Skills

Reusable workflows live in [`.agents/skills/`](.agents/skills/). Use [`verify-ui-apps`](.agents/skills/verify-ui-apps/SKILL.md) before UI-related PRs.
