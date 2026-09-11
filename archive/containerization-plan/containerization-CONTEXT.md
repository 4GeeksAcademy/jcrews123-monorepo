# Containerization Assignment Context

Source: [Company Monorepo Containerization](https://github.com/4GeeksAcademy/ai-engineering-syllabus/tree/main/content/projects/ai-eng-container-project)

This local context records the grading contract used for Brasaland's
containerization work. The syllabus project does not provide a separate
Brasaland company-context file.

## Ticket infra-40

Define the Brasaland development environment as code so a developer can clone
the monorepo and start the platform consistently with Docker Compose.

## Required architecture

- Dockerize `uis/website` and `uis/backoffice` in one UI container.
- Run the website on port 3000 and backoffice on port 3001.
- Dockerize the FastAPI service separately on port 8000.
- Enable hot reload for both Next.js applications and Uvicorn.
- Start the full platform with `docker compose up` from the repository root.
- Put `Dockerfile` and `.dockerignore` files in `uis/` and `services/`.
- Put `docker-compose.yml` and the untracked `.env` at repository root.
- Join both services to an explicitly named Docker network.
- Use Docker service names, not `localhost`, for container-to-container calls.
- Keep secrets out of Dockerfiles, Compose, images, and Git.

## Evaluation criteria

1. `docker compose up` starts the full platform without extra setup.
2. Bind-mounted code changes appear without rebuilding images.
3. A single UI container serves both Next.js applications.
4. Internal service communication uses Docker DNS names.
5. Dockerfiles and Compose contain no hardcoded credentials.
6. Root `.env` is ignored and was never committed.
7. Both required `.dockerignore` files exist.

## Submission evidence

Open a pull request to `main` and include a screenshot of `docker compose ps`
or the running `docker compose up` output.

## Brasaland-specific constraints

- Backoffice has a local file dependency on `apps/operations`.
- FastAPI imports the shared `packages/incident-analysis` package.
- Inventory connects to hosted Supabase through `DATABASE_URL`.
- Backoffice API calls originate in the host browser, which cannot resolve a
  Docker-only hostname. The implementation therefore uses a same-origin
  Next.js proxy whose server-side destination is `http://services:8000`.
