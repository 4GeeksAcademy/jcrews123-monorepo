# Milestone archive

**Scope:** Agent-requested — apply when starting, completing, reviewing, or resubmitting any company milestone (MS-0 through MS-10).

Archive holds **your implementation history**. The syllabus project README remains the grading spec — see [`syllabus-first.md`](syllabus-first.md).

## At milestone start

Before substantial implementation, create `archive/ms-N-plan/` with all three files:

| File | Purpose |
|------|---------|
| `ms-N-plan.md` | Decisions locked, deliverables, evaluation checklist |
| `ms-N-CONTEXT.md` | Assignment context (from syllabus context folder) |
| `plan.json` | Machine-readable metadata and deliverables list |

**`ms-N-plan.md` must include:** source document links, decisions locked, scope/deliverables table, evaluation checklist with checkboxes.

**`plan.json` must include:** `name`, `version`, `status` (`planned` → `in_progress` → `implemented`), `overview`, `implementationRoot`, `branch` (if applicable), `stack`, `ports` (if UI), `deliverables` array listing every path you will ship (including the archive files themselves).

**Reference examples:** [`archive/ms-4-plan/`](../../archive/ms-4-plan/) (most complete pattern).

## When replacing an implementation

Do not delete superseded code silently. Move it to `archive/<descriptive-name>/` with a `README.md` that states what it was, what replaced it, and when. Example: [`archive/ms-1-website-static/`](../../archive/ms-1-website-static/).

## At milestone completion

1. Set `plan.json` → `"status": "implemented"`.
2. Mark evaluation items complete in `ms-N-plan.md`.
3. Add or update the milestone row in [`memory-bank/progress.md`](../../memory-bank/progress.md) with a link to `archive/ms-N-plan/`.
4. Keep `plan.json` `deliverables` in sync with files actually shipped.

## Do not

- Put active runtime code in `archive/` (only deliberate snapshots of replaced implementations).
- Treat local archive plans as sufficient without syllabus cross-check.
- Start MS-N+1 milestone work without an archive folder for MS-N if MS-N is not yet archived.

## Self-verification (before PR or marking complete)

- [ ] `archive/ms-N-plan/` exists with `ms-N-plan.md`, `ms-N-CONTEXT.md`, and `plan.json`
- [ ] `plan.json` status and deliverables match the repo
- [ ] `memory-bank/progress.md` links to the archive folder
- [ ] Superseded implementations moved to `archive/` with README, not deleted
