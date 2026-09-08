# Skill: Verify UI apps

## Objective

Confirm the public website and internal backoffice start without errors and display Brasaland company content on screen.

## Inputs

| Input | Required | Description |
|-------|----------|-------------|
| `repoRoot` | Yes | Absolute path to monorepo root |
| `websitePort` | No | Default `8080` |
| `backofficePort` | No | Default `3001` |

## Steps

1. From `{repoRoot}/uis/website`, run `npm run dev` (or `npx http-server . -p {websitePort}`).
2. From `{repoRoot}/uis/backoffice`, run `npm install` if needed, then `npm run dev`.
3. Request `http://localhost:{websitePort}/` — expect HTTP 200.
4. Request `http://localhost:{backofficePort}/` — expect HTTP 200.
5. Visually confirm the backoffice page shows company KPIs, departments, or locations (not console-only output).
6. Stop servers when verification is complete.

## Acceptance criteria

- [ ] Website returns HTTP 200 for `/` or `/index.html`
- [ ] Backoffice returns HTTP 200 for `/`
- [ ] Backoffice renders visible Brasaland data (locations, departments, or KPIs) in the DOM
- [ ] No startup errors in either terminal
- [ ] Website and backoffice use distinct layouts (public vs internal)

## When to use

- Before opening a UI-related pull request
- After changes to `uis/website/` or `uis/backoffice/`
- As part of the pre-commit workflow in root `AGENTS.md` when UI files changed
