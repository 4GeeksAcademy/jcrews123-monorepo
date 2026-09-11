# Company Monorepo Containerization Plan

**Status:** implemented
**Syllabus:** [Company Monorepo Containerization](https://github.com/4GeeksAcademy/ai-engineering-syllabus/tree/main/content/projects/ai-eng-container-project)
**Reference solution:** [Syllabus reference architecture](https://github.com/4GeeksAcademy/ai-engineering-syllabus/blob/main/content/projects/ai-eng-container-project/.learn/solution/README.md)
**Context:** [`containerization-CONTEXT.md`](./containerization-CONTEXT.md)

## Locked decisions

- Keep the syllabus-required Dockerfiles at `uis/Dockerfile` and `services/Dockerfile`.
- Use `uis/` and `services/` as the primary build contexts required by the
  syllabus, with named BuildKit contexts for `apps/operations` and
  `packages/incident-analysis`.
- Run both Next.js applications in one `uis` container: website on port 3000
  and backoffice on port 3001.
- Run FastAPI in one `services` container on port 8000 with Uvicorn reload.
- Use the explicitly named `brasaland-dev` bridge network.
- Proxy browser requests through backoffice at `/backend/*`; Next.js forwards
  them to `http://services:8000` inside Docker.
- Keep the existing hosted Supabase PostgreSQL database. A local database
  container is not part of this two-service assignment.
- Keep credentials only in the ignored root `.env`; commit placeholders in
  `.env.example`.

## Deliverables

| Area | Path |
|------|------|
| UI image | `uis/Dockerfile` |
| UI startup | `uis/start.sh` |
| UI build exclusions | `uis/.dockerignore` |
| Backend image | `services/Dockerfile` |
| Backend build exclusions | `services/.dockerignore` |
| Orchestration | `docker-compose.yml` |
| Environment contract | `.env.example` |
| API proxy | `uis/backoffice/next.config.ts`, `uis/backoffice/lib/api-client.ts` |
| Environment precedence | `services/api/main.py`, `services/api/seed.py` |
| Developer documentation | `README.md` |
| Teaching guide | `archive/containerization-plan/DOCKER_TLDR.md` |

## Evaluation checklist

- [x] `docker compose up` starts the full platform without errors or extra
  dependency installation.
- [x] Host code edits reload both UI applications and FastAPI without an image
  rebuild.
- [x] One UI service is configured for website port 3000 and backoffice port
  3001.
- [x] Container-to-container requests use the `services` Docker hostname.
- [x] No credentials are hardcoded in Dockerfiles or Compose.
- [x] Root `.env` is ignored and absent from the working diff.
- [x] `.dockerignore` exists in both `uis/` and `services/`.
- [ ] PR evidence includes `docker compose ps` or startup output.

## Verification record

- Compose configuration: `docker compose config --quiet` passed.
- Container status: `services` healthy on port 8000; `uis` running on ports
  3000 and 3001.
- Website: HTTP 200 in Docker; production build passed.
- Backoffice: HTTP 200 in Docker.
- API health/docs: direct `/health` and proxied `/backend/health` returned
  `{"status":"ok"}`.
- API tests: 37 passed.
- UI lint: backoffice passed; website retains one pre-existing effect error and
  two image warnings.
- Hot reload: verified through bind mounts for website and FastAPI.
- Windows note: Docker build contexts fail inside this OneDrive Files On-Demand
  path. Runtime verification succeeded from `C:\dev\jcrews123-monorepo-3`.
- Remaining limitation: replace the local smoke-test environment with the real
  ignored Supabase values and capture `docker compose ps` for the PR.
