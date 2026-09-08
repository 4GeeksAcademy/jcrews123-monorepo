## Summary

- Agent infrastructure: memory bank (incl. syllabus reference), AGENTS.md, `.agents` rules + skills
- **G6 fix:** Migrated `uis/website` to Next.js + TypeScript with reusable React components
- **G8/G9 fix:** Backoffice imports `@brasaland/operations` and displays computed M2 metrics on dashboard

## Links

- [AGENTS.md](./AGENTS.md)
- [memory-bank/syllabusReference.md](./memory-bank/syllabusReference.md)

## Screenshots

_Add screenshots of:_
1. Website homepage at http://localhost:8080/
2. Backoffice dashboard at http://localhost:3001/ showing M2 computed values

## Test plan

- [ ] `cd uis/website && npm run dev` — `/` and `/application` work
- [ ] `cd uis/backoffice && npm run dev` — dashboard shows revenue, ranked locations, top sellers, margins from `apps/operations`
- [ ] `cd apps/operations && npm run demo` — values match backoffice dashboard
