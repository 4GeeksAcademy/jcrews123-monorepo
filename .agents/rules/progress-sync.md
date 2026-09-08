# Progress sync

**Scope:** Agent-requested — apply when finishing a task, opening/updating a PR, completing a milestone step, or ending a session where repo state changed.

[`memory-bank/progress.md`](../../memory-bank/progress.md) is the **living status board** for agents and developers. Read it at session start; update it before you commit or hand off work.

## When to update

Update `progress.md` if any of the following happened:

- A milestone deliverable was completed or started
- A checklist item in "In progress" changed state
- A known gap was fixed or a new gap was discovered
- Future work priorities shifted (e.g. MS-5 scope clarified)
- A new reference doc or archive plan should be linked

Skip updates for trivial fixes (typos, formatting) that do not change project status.

## What to update

| Section | Action |
|---------|--------|
| `_Last updated:` line | Set to a short phrase describing what just changed |
| **Completed** | Add or update rows for finished milestones or major deliverables |
| **In progress** | Toggle `- [x]` / `- [ ]` items; add new bullets for active work |
| **Next** | Adjust upcoming milestones or tasks when priorities change |
| **Known gaps** | Add resolved gaps (remove or strike through); add newly found gaps |
| **Reference docs** | Link new plans, proposals, or archive folders |

Keep entries concise — one line per item, with a path or link when helpful.

## Pre-commit requirement

Step 4 of root [`AGENTS.md`](../../AGENTS.md) requires a progress update before every commit that reflects delivery work. If you changed application code or milestone artifacts, include `memory-bank/progress.md` in the same commit unless the user asked otherwise.

## Protected paths

You may edit **`memory-bank/progress.md`** freely as part of delivery. Do **not** edit other `memory-bank/` files (`projectbrief.md`, `techContext.md`, `syllabusReference.md`) without developer approval.

## Do not

- Leave "In progress" items checked off in code but unchecked in `progress.md`
- Duplicate long explanations — link to `archive/ms-N-plan/` or app READMEs instead
- Mark a milestone complete in `progress.md` without syllabus cross-check ([`syllabus-first.md`](syllabus-first.md))

## Self-verification (before commit or PR)

- [ ] `_Last updated:` reflects this session's work
- [ ] Completed or in-progress sections match the actual repo state
- [ ] New archive plans or docs appear under **Reference docs**
- [ ] Resolved items removed or marked done in **Known gaps**
