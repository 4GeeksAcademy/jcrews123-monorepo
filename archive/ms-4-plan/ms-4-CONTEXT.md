# CONTEXT — Brasaland · Milestone 4: AI-driven Engineering

> **Repository paths:** `memory-bank/`, `AGENTS.md`, `.agents/`, `uis/backoffice/`

---

## Your company

You are part of **Brasaland Digital**, building the internal systems that will let Brasaland operate across 14 locations in Colombia and Florida. Root [`CONTEXT.md`](../../CONTEXT.md) holds the full company briefing.

---

## The assignment

Your tech lead has a ticket on the board:

> **Subject: Monorepo AI Setup — we need this done this week**
>
> The repository needs clear, persistent context before we keep adding features: what the company is, what we're building, what the project rules are — in the **memory bank**. The agent must read it before touching anything, including both business and technical context.
>
> Create **`AGENTS.md`** defining the mandatory workflow before each commit. Use **`.agents/`** for scoped development rules. Formalise at least one **agent skill** with verifiable acceptance criteria.
>
> For the application layer: public website under `./uis/website`, internal app under `./uis/backoffice` with its own layout and company-relevant data visible on screen. Backend services belong under `/services`.
>
> When done, open a PR from `feature/agent-memory-bank`.

**Source:** [Milestone README](https://github.com/4GeeksAcademy/ai-engineering-syllabus/blob/main/content/projects/ai-eng-milestone-ai-driven-engineering/README.md)

---

## Agent infrastructure requirements

| Deliverable | Minimum content |
|-------------|-----------------|
| `memory-bank/projectbrief.md` | Business description, objectives, problem solved |
| `memory-bank/techContext.md` | Stack, architecture, technical constraints |
| `memory-bank/progress.md` | Current state, next steps |
| `AGENTS.md` | Startup reads, 4+ pre-commit steps, protected paths |
| `.agents/rules/` | At least one rule with explicit scope |
| `.agents/skills/` | One skill with objective, inputs, acceptance criteria |

**Important:** Do not confuse `.agents/` (dev-tool config) with `/agents` and `/skills/` (product code).

---

## Application requirements

| App | Requirement |
|-----|-------------|
| `uis/website` | `/` renders corporate site aligned with `CONTEXT.md`; starts via dev command |
| `uis/backoffice` | Own layout; `/` shows company-relevant data on screen (not console-only) |

---

## Submission

1. Branch: `feature/agent-memory-bank`
2. Follow `AGENTS.md` workflow before final commit
3. PR to `main` with website screenshot, backoffice screenshot, link to `AGENTS.md`

---

_Internal document — 4Geeks Academy · AI Engineering Track_
