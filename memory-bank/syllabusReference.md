# Syllabus Reference — 4Geeks AI Engineering

Canonical external source: [4GeeksAcademy/ai-engineering-syllabus](https://github.com/4GeeksAcademy/ai-engineering-syllabus)

Before starting or reviewing milestone work, fetch the **project README** and matching **company CONTEXT** from the links below. Do not assume merged code from a prior milestone satisfies the current milestone if the syllabus requires a new stack or integration.

## Index URLs

| Resource | URL |
|----------|-----|
| All projects (ordered) | [content/projects/README.md](https://github.com/4GeeksAcademy/ai-engineering-syllabus/blob/main/content/projects/README.md) |
| All milestone contexts | [content/contexts/README.md](https://github.com/4GeeksAcademy/ai-engineering-syllabus/blob/main/content/contexts/README.md) |
| Company briefings | [content/contexts/00-general-contexts/](https://github.com/4GeeksAcademy/ai-engineering-syllabus/tree/main/content/contexts/00-general-contexts) |

Raw file pattern: `https://raw.githubusercontent.com/4GeeksAcademy/ai-engineering-syllabus/main/<path>`

## Brasaland company milestones

| MS | Monorepo path | Project README | Context folder |
|----|---------------|----------------|----------------|
| 0 | `CONTEXT.md` | [choose-company](https://github.com/4GeeksAcademy/ai-engineering-syllabus/blob/main/content/projects/ai-eng-milestone-choose-company/README.md) | [00-general-contexts](https://github.com/4GeeksAcademy/ai-engineering-syllabus/tree/main/content/contexts/00-general-contexts) |
| 1 | `uis/website/` | [web-fundamentals](https://github.com/4GeeksAcademy/ai-engineering-syllabus/blob/main/content/projects/ai-eng-milestone-web-fundamentals/README.md) | [01-web-fundamentals](https://github.com/4GeeksAcademy/ai-engineering-syllabus/tree/main/content/contexts/01-web-fundamentals) |
| 2 | `apps/operations/` | [coding-fundamentals](https://github.com/4GeeksAcademy/ai-engineering-syllabus/blob/main/content/projects/ai-eng-milestone-coding-fundamentals/README.md) | [02-coding-fundamentals](https://github.com/4GeeksAcademy/ai-engineering-syllabus/tree/main/content/contexts/02-coding-fundamentals) |
| 3 | `uis/talent-pipeline-tracker/` | [frontend-development](https://github.com/4GeeksAcademy/ai-engineering-syllabus/blob/main/content/projects/ai-eng-milestone-frontend-development/README.md) | [03-frontend-development](https://github.com/4GeeksAcademy/ai-engineering-syllabus/tree/main/content/contexts/03-frontend-development) |
| 4 | memory bank, `.agents/`, `uis/backoffice/` | [ai-driven-engineering](https://github.com/4GeeksAcademy/ai-engineering-syllabus/blob/main/content/projects/ai-eng-milestone-ai-driven-engineering/README.md) | [04-ai-driven-engineering](https://github.com/4GeeksAcademy/ai-engineering-syllabus/tree/main/content/contexts/04-ai-driven-engineering) |
| 5 | `services/` | [backend-development](https://github.com/4GeeksAcademy/ai-engineering-syllabus/blob/main/content/projects/ai-eng-milestone-backend-development/README.md) | [05-backend-development](https://github.com/4GeeksAcademy/ai-engineering-syllabus/tree/main/content/contexts/05-backend-development) |

## MS-4 key syllabus requirement (project catalog #24)

> Monorepo layout: **public Next.js site**, internal backoffice, services/APIs, and **integration of prior milestones** with an AI-assisted delivery workflow.

This means MS-4 is not satisfied by reusing static M1 HTML or hardcoded dashboard constants — wire `apps/operations` into backoffice and rebuild `uis/website` as Next.js.

## Local cross-references

| Local | Purpose |
|-------|---------|
| [`CONTEXT.md`](../CONTEXT.md) | Working company briefing copy |
| [`archive/ms-N-plan/`](../archive/) | Your implementation plans per milestone |
| App `CONTEXT.md` | Milestone-specific assignment (e.g. talent tracker) |

## Agent workflow

1. Identify active milestone from `memory-bank/progress.md`
2. Fetch project README from table above
3. Fetch `CONTEXT-brasaland*.md` from the context folder if needed
4. List evaluation criteria from README and compare to repo before marking complete
