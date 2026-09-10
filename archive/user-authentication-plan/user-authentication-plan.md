# User Authentication Trilogy — Implementation Plan

Syllabus projects #30–#32 on branch `auth`.

| Phase | Project | Status |
|-------|---------|--------|
| 1 | AUTH-01 — FastAPI JWT, users, profiles, route protection | Implemented |
| 2 | AUTH-02 — Backoffice login, register, profile, guards | Implemented |
| 3 | AUTH-03 — Password reset + change password (Resend) | Implemented |

## Protected routes

All supplier and incident routes require Bearer JWT. Public: `/health`, `POST /users`, `POST /auth/login`, `POST /auth/forgot-password`, `POST /auth/reset-password`.

## Verification

- API: `cd services/api && python -m pytest tests` (29 tests)
- Backoffice: `cd uis/backoffice && npm run lint`
- Manual: register → login → suppliers/incidents → forgot/reset/change password

## Resend setup

1. Copy `services/api/.env.example` → `.env`
2. Set `RESEND_API_KEY` and `RESEND_FROM_EMAIL`
3. Set `FRONTEND_RESET_URL=http://localhost:3001/reset-password`
4. Request reset for a registered email; link opens backoffice reset form

## Syllabus links

- [#30 API auth](https://github.com/4GeeksAcademy/ai-engineering-syllabus/blob/main/content/projects/ai-eng-user-authentication-api/README.md)
- [#31 Frontend auth](https://github.com/4GeeksAcademy/ai-engineering-syllabus/blob/main/content/projects/ai-eng-user-authentication-flows/README.md)
- [#32 Password reset](https://github.com/4GeeksAcademy/ai-engineering-syllabus/blob/main/content/projects/ai-eng-user-authentication-restore/README.md)
