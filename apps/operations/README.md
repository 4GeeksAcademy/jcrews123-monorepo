# Brasaland Operations — Milestone 2

TypeScript data-processing utilities for Brasaland restaurant operations: filtering, searching, financial calculations, performance scoring, aggregations, and validations.

## Structure

```
src/
├── types/models.ts       # Interfaces and types
├── utils/
│   ├── collections.ts    # Filter and sort functions
│   ├── search.ts         # Linear and binary search
│   ├── transformations.ts # Financial calcs, scoring, reports
│   └── validations.ts    # Business rule validations
├── data/samples.ts       # Sample data from CONTEXT
└── demo.ts               # CLI smoke test
```

## Commands

```bash
npm install
npm run typecheck   # tsc --noEmit
npm run demo        # Exercise all functions with sample data
```

## Approved assumptions (Phase 7)

| ID | Decision |
|----|----------|
| A1 | Operating days = days since Jan 1 of `openingYear`, minimum 1 |
| A2 | Date comparisons use UTC calendar day (YYYY-MM-DD) |
| A5 | Country comparison sums USD and COP fields separately in `Price` |
| A6 | Zero total revenue → margin returns `0` |
| A7 | Zero revenue → waste score component returns max `20` |
| A8 | Zero sales → average ticket returns `0` |
| A9 | Missing menu item on sale join → skip sale in margin/top sellers |
| A3 | Binary search returns leftmost index on duplicate capacities |
| A4 | Top sellers: sort by qty desc, then item name asc |

## Validation error messages

- MenuItem: `"USD price must be greater than 0"`, `"COP price must be greater than 0"`, `"Prep time must be between 1 and 60 minutes"`, `"Name must not be empty"`, `"Item must be available in at least one country"`
- SaleTransaction: `"Quantity must be greater than 0"`, `"USD price must be greater than 0"`, `"COP price must be greater than 0"`, `"Waiter name must not be empty"`
- Location: `"Opening year must be between 2008 and the current year"`, `"Seating capacity must be greater than 0"`, `"Staff count must be greater than 0"`, `"Monthly rent cost must be greater than 0 in both currencies"`, `"Monthly utilities cost must be greater than 0 in both currencies"`
