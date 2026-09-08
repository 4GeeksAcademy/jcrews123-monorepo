---
name: AI-driven Engineering
overview: Add agent infrastructure (memory bank, AGENTS.md, .agents rules/skills), build uis/backoffice internal dashboard, verify uis/website, and open PR from feature/agent-memory-bank.
todos:
  - id: memory-bank
    content: Create memory-bank/ with projectbrief.md, techContext.md, progress.md
    status: completed
  - id: agents-md
    content: Create root AGENTS.md with startup reads and pre-commit workflow
    status: completed
  - id: agents-config
    content: Add .agents/rules and verify-ui-apps skill
    status: completed
  - id: backoffice
    content: Scaffold uis/backoffice Next.js app with CONTEXT-driven dashboard
    status: completed
  - id: backoffice
    content: Scaffold uis/backoffice Next.js app with CONTEXT-driven dashboard
    status: completed
  - id: website-verify
    content: Add uis/website dev script and verify site starts
    status: completed
  - id: test-pr
    content: Verify UIs, commit, open PR to main
    status: completed
isProject: false
---

# Milestone 4 — AI-driven Engineering

**Source documents:**

- Assignment: [ms-4-CONTEXT.md](ms-4-CONTEXT.md)
- Syllabus: [Milestone README](https://github.com/4GeeksAcademy/ai-engineering-syllabus/blob/main/content/projects/ai-eng-milestone-ai-driven-engineering/README.md)
- Company briefing: [CONTEXT.md](../../CONTEXT.md)

## Decisions locked

- Branch: `feature/agent-memory-bank`
- Memory bank at repo root: `memory-bank/` (3 files)
- Dev-tool config: `.agents/rules/` + `.agents/skills/verify-ui-apps/`
- Backoffice: Next.js App Router at `uis/backoffice/`, port **3001**
- Website: keep existing static MS-1 site; add `npm run dev` on port **8080**
- MS-3 context: distilled into memory bank; full doc stays in `archive/ms-3-plan/`

## Agent infrastructure

| File | Purpose |
|------|---------|
| `memory-bank/projectbrief.md` | Brasaland business context and department needs |
| `memory-bank/techContext.md` | Stack, ports, app paths, MS-3 API notes |
| `memory-bank/progress.md` | Completed milestones and active work |
| `AGENTS.md` | Session reads + 5-step pre-commit workflow |
| `.agents/rules/monorepo-structure.md` | Always-active folder conventions |
| `.agents/rules/uis-isolation.md` | Pattern `uis/**` — separate layouts per app |
| `.agents/skills/verify-ui-apps/SKILL.md` | Verify website + backoffice HTTP 200 |

## Backoffice scope

- Layout: slate sidebar, distinct from public amber marketing site
- `/` dashboard: KPI cards (14 locations, 115 staff, $6M revenue, 2 countries)
- Department table from CONTEXT.md (7 departments with leads and needs)
- Location summary from shared Brasaland location hierarchy (14 restaurants)

## Evaluation checklist

- [ ] Memory bank has business + technical context
- [ ] AGENTS.md has 4+ ordered pre-commit steps
- [ ] `.agents/` has rule with explicit scope + skill with acceptance criteria
- [ ] `uis/website` dev command works; `/` renders Brasaland site
- [ ] `uis/backoffice` own layout; company data visible on screen
- [ ] PR from `feature/agent-memory-bank` with screenshots

## Deliverables

- `memory-bank/`
- `AGENTS.md`
- `.agents/`
- `uis/backoffice/`
- `uis/website/package.json`
- `archive/ms-4-plan/` (this folder)
- `uis/talent-pipeline-tracker/CONTEXT.md` (app-local MS-3 reference)
